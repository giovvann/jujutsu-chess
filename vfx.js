/**
 * VFX - Anime-style particle engine for Jujutsu Chess
 * Vanilla JS, zero dependencies, exposes window.VFX
 * ~550 lines
 */
(function () {
  'use strict';

  // ============================================================
  // Configuration & Constants
  // ============================================================
  const MAX_PARTICLES = 700;
  const DEFAULT_COLOR = '#8a2be2';      // cursed-energy purple
  const DEFAULT_COLOR_ALT = '#00d2ff';  // cursed-energy blue
  const STORAGE_KEY = 'jjc_vfx';

  // ============================================================
  // Module State
  // ============================================================
  let canvas = null;
  let ctx = null;
  let dpr = 1;
  let width = 0;
  let height = 0;
  let animationId = null;
  let running = false;
  let enabled = true;
  let reducedMotion = false;

  // Object pool for particles
  const pool = [];
  const active = [];
  let poolPtr = 0;

  // Pre-allocated particle objects
  for (let i = 0; i < MAX_PARTICLES; i++) {
    pool.push({
      x: 0, y: 0,
      vx: 0, vy: 0,
      ax: 0, ay: 0,
      life: 0, maxLife: 0,
      size: 0, startSize: 0, endSize: 0,
      color: '#fff', glowColor: '#fff',
      shape: 'circle', // 'circle' | 'spark' | 'star'
      rotation: 0, rotationSpeed: 0,
      type: 'particle', // 'particle' | 'slash' | 'shockwave' | 'beam' | 'blackflash' | 'domain'
      // Slash-specific
      x1: 0, y1: 0, x2: 0, y2: 0,
      progress: 0, duration: 0, width: 0, glow: 0,
      // Shockwave-specific
      radius: 0, maxRadius: 0, rings: 1, ringWidth: 0,
      // Beam-specific
      beamProgress: 0,
      // BlackFlash-specific
      streaks: null, vignetteAlpha: 0,
      // Domain-specific
      cracks: null, speedLines: null, phase: 0,
    });
  }

  // ============================================================
  // Utilities
  // ============================================================
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rand(min, max) { return min + Math.random() * (max - min); }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
  function deg2rad(d) { return d * Math.PI / 180; }

  function parseColor(c, alpha) {
    // Accepts #rgb, #rrggbb, #rrggbbaa, rgb(), rgba(), or named colors
    // Returns [r, g, b, a] in 0-255, 0-1
    // Self-contained parser - no canvas dependency (works in Node test env)
    if (!c) return [138, 43, 226, alpha ?? 1]; // default purple

    // rgb()/rgba() parsing
    const rgbMatch = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/i);
    if (rgbMatch) {
      return [+rgbMatch[1], +rgbMatch[2], +rgbMatch[3], rgbMatch[4] !== undefined ? +rgbMatch[4] : (alpha ?? 1)];
    }

    // Hex parsing (#rgb, #rrggbb, #rrggbbaa)
    let hex = c.replace('#', '').trim();
    if (/^[0-9a-fA-F]{3}$/.test(hex)) {
      hex = hex.split('').map(ch => ch + ch).join('');
    }
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
      hex += 'ff';
    }
    if (/^[0-9a-fA-F]{8}$/.test(hex)) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      return [r, g, b, alpha ?? a];
    }

    // Named colors - minimal fallback map
    const named = {
      'white': [255, 255, 255, 1], 'black': [0, 0, 0, 1],
      'red': [255, 0, 0, 1], 'green': [0, 128, 0, 1], 'blue': [0, 0, 255, 1],
      'yellow': [255, 255, 0, 1], 'purple': [128, 0, 128, 1], 'transparent': [0, 0, 0, 0],
    };
    const lower = c.toLowerCase();
    if (named[lower]) return [...named[lower].slice(0, 3), alpha ?? named[lower][3]];

    // Ultimate fallback
    return [138, 43, 226, alpha ?? 1];
  }

  function colorToRgba(c, a) {
    const [r, g, b, _] = parseColor(c, a);
    return `rgba(${r},${g},${b},${a})`;
  }

  function colorToHex(c) {
    const [r, g, b] = parseColor(c);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // ============================================================
  // Canvas & Render Loop
  // ============================================================
  function resize() {
    if (!canvas) return;
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function startLoop() {
    if (running) return;
    running = true;
    tick();
  }

  function stopLoop() {
    running = false;
    if (animationId) cancelAnimationFrame(animationId);
    animationId = null;
  }

  function tick(ts) {
    if (!running) return;
    animationId = requestAnimationFrame(tick);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter'; // additive blending for glow

    let anyAlive = false;
    const now = ts || performance.now();

    for (let i = active.length - 1; i >= 0; i--) {
      const p = active[i];
      if (updateParticle(p, now)) {
        drawParticle(p);
        anyAlive = true;
      } else {
        // Return to pool
        active.splice(i, 1);
      }
    }

    if (!anyAlive) stopLoop();
  }

  // ============================================================
  // Particle Update & Draw
  // ============================================================
  function updateParticle(p, now) {
    const dt = 1 / 60; // fixed timestep for determinism

    switch (p.type) {
      case 'particle': {
        p.life -= dt;
        if (p.life <= 0) return false;
        const t = 1 - p.life / p.maxLife;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx += p.ax * dt;
        p.vy += p.ay * dt;
        p.rotation += p.rotationSpeed * dt;
        p.size = lerp(p.startSize, p.endSize, t);
        return true;
      }
      case 'slash': {
        p.progress += dt / p.duration;
        if (p.progress >= 1) return false;
        return true;
      }
      case 'shockwave': {
        p.radius += (p.maxRadius / p.duration) * dt;
        if (p.radius >= p.maxRadius) return false;
        return true;
      }
      case 'beam': {
        p.beamProgress += dt / p.duration;
        if (p.beamProgress >= 1) return false;
        return true;
      }
      case 'blackflash': {
        p.progress += dt / p.duration;
        if (p.progress >= 1) return false;
        return true;
      }
      case 'domain': {
        p.progress += dt / p.duration;
        if (p.progress >= 1) return false;
        return true;
      }
    }
    return false;
  }

  function drawParticle(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    if (p.rotation) ctx.rotate(p.rotation);

    switch (p.type) {
      case 'particle': drawParticleShape(p); break;
      case 'slash': drawSlash(p); break;
      case 'shockwave': drawShockwave(p); break;
      case 'beam': drawBeam(p); break;
      case 'blackflash': drawBlackFlash(p); break;
      case 'domain': drawDomain(p); break;
    }
    ctx.restore();
  }

  function drawParticleShape(p) {
    const alpha = p.life / p.maxLife;
    const [r, g, b] = parseColor(p.color);
    const [gr, gg, gb] = parseColor(p.glowColor);

    // Glow
    if (p.shape === 'spark') {
      ctx.globalAlpha = alpha * 0.6;
      ctx.fillStyle = `rgba(${gr},${gg},${gb},${alpha * 0.4})`;
      const len = p.size * 3;
      ctx.beginPath();
      ctx.moveTo(-len * 0.5, -p.size * 0.3);
      ctx.lineTo(len * 0.5, 0);
      ctx.lineTo(-len * 0.5, p.size * 0.3);
      ctx.closePath();
      ctx.fill();
    } else if (p.shape === 'star') {
      drawStar(0, 0, p.size, p.size * 0.4, 4, alpha, p.color, p.glowColor);
    } else {
      // circle
      ctx.globalAlpha = alpha * 0.5;
      ctx.fillStyle = `rgba(${gr},${gg},${gb},${alpha * 0.3})`;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Core
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    if (p.shape === 'spark') {
      const len = p.size * 2;
      ctx.beginPath();
      ctx.moveTo(-len * 0.5, -p.size * 0.2);
      ctx.lineTo(len * 0.5, 0);
      ctx.lineTo(-len * 0.5, p.size * 0.2);
      ctx.closePath();
      ctx.fill();
    } else if (p.shape === 'star') {
      drawStar(0, 0, p.size * 0.7, p.size * 0.25, 4, alpha, p.color, p.color);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStar(cx, cy, outerR, innerR, points, alpha, fillColor, glowColor) {
    const [r, g, b] = parseColor(fillColor);
    const [gr, gg, gb] = parseColor(glowColor);
    ctx.globalAlpha = alpha * 0.4;
    ctx.fillStyle = `rgba(${gr},${gg},${gb},${alpha * 0.3})`;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const radius = i % 2 === 0 ? outerR * 1.5 : innerR * 1.5;
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = alpha;
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const radius = i % 2 === 0 ? outerR : innerR;
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawSlash(p) {
    const t = p.progress;
    const easeOut = 1 - Math.pow(1 - t, 3);
    const easeIn = Math.pow(t, 2);

    // Curved arc path
    const cx = (p.x1 + p.x2) * 0.5;
    const cy = (p.y1 + p.y2) * 0.5;
    const dx = p.x2 - p.x1;
    const dy = p.y2 - p.y1;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const perpX = -Math.sin(angle);
    const perpY = Math.cos(angle);
    const curveHeight = dist * 0.3;
    const mx = cx + perpX * curveHeight * (1 - easeOut);
    const my = cy + perpY * curveHeight * (1 - easeOut);

    // Glow trail
    ctx.globalAlpha = (1 - t) * p.glow;
    const [gr, gg, gb] = parseColor(p.glowColor || p.color);
    ctx.strokeStyle = `rgba(${gr},${gg},${gb},${(1 - t) * p.glow * 0.6})`;
    ctx.lineWidth = p.width * 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p.x1, p.y1);
    ctx.quadraticCurveTo(mx, my, p.x2 * easeOut + p.x1 * (1 - easeOut), p.y2 * easeOut + p.y1 * (1 - easeOut));
    ctx.stroke();

    // White-hot core
    ctx.globalAlpha = (1 - t) * 0.9;
    ctx.strokeStyle = `rgba(255,255,255,${(1 - t) * 0.8})`;
    ctx.lineWidth = p.width * 0.6;
    ctx.beginPath();
    ctx.moveTo(p.x1, p.y1);
    ctx.quadraticCurveTo(mx, my, p.x2 * easeOut + p.x1 * (1 - easeOut), p.y2 * easeOut + p.y1 * (1 - easeOut));
    ctx.stroke();

    // Spark particles along arc (drawn as part of main particle system via burst)
  }

  function drawShockwave(p) {
    const t = p.radius / p.maxRadius;
    const alpha = (1 - t) * 0.8;
    const [r, g, b] = parseColor(p.color);

    for (let i = 0; i < p.rings; i++) {
      const ringT = clamp(t - i * 0.15, 0, 1);
      if (ringT >= 1) continue;
      const ringAlpha = alpha * (1 - ringT);
      ctx.globalAlpha = ringAlpha;
      ctx.strokeStyle = `rgba(${r},${g},${b},${ringAlpha})`;
      ctx.lineWidth = p.ringWidth * (1 - ringT * 0.5);
      ctx.beginPath();
      ctx.arc(0, 0, p.radius * (0.7 + i * 0.3), 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawBeam(p) {
    const t = p.beamProgress;
    const flashPhase = t < 0.15 ? t / 0.15 : 1;
    const fadePhase = t > 0.7 ? (1 - t) / 0.3 : 1;
    const alpha = flashPhase * fadePhase;

    const [r, g, b] = parseColor(p.color);

    // Thick glow first
    if (t < 0.3) {
      const glowAlpha = (1 - t / 0.3) * 0.6;
      ctx.globalAlpha = glowAlpha;
      ctx.strokeStyle = `rgba(${r},${g},${b},${glowAlpha})`;
      ctx.lineWidth = p.width * 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x1, p.y1);
      ctx.lineTo(p.x2, p.y2);
      ctx.stroke();
    }

    // Thin white core
    ctx.globalAlpha = alpha * 0.9;
    ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.8})`;
    ctx.lineWidth = p.width * 0.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p.x1, p.y1);
    ctx.lineTo(
      lerp(p.x1, p.x2, clamp(t * 2, 0, 1)),
      lerp(p.y1, p.y2, clamp(t * 2, 0, 1))
    );
    ctx.stroke();
  }

  function drawBlackFlash(p) {
    const t = p.progress;
    const dur = p.duration;

    // Phase 1: Instant black frame (0-0.05s)
    if (t < 0.08) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#000';
      ctx.fillRect(-width * 0.5, -height * 0.5, width, height);
    }

    // Phase 2: Red/white radial impact lines (0.05-0.25s)
    if (t >= 0.05 && t < 0.4) {
      const lineAlpha = 1 - (t - 0.05) / 0.35;
      ctx.globalAlpha = lineAlpha;
      for (let i = 0; i < p.streaks; i++) {
        const angle = (i / p.streaks) * Math.PI * 2 + p.rotation;
        const len = lerp(0, Math.max(width, height) * 0.8, (t - 0.05) / 0.35);
        ctx.strokeStyle = i % 2 === 0 ? `rgba(255,255,255,${lineAlpha})` : `rgba(255,0,0,${lineAlpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
        ctx.stroke();
      }
    }

    // Phase 3: Screen-edge red vignette pulse (0.1-0.5s)
    if (t >= 0.1 && t < 0.6) {
      const vignetteT = (t - 0.1) / 0.5;
      const vignetteAlpha = Math.sin(vignetteT * Math.PI) * 0.4;
      p.vignetteAlpha = vignetteAlpha;
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(width, height) * 0.7);
      grad.addColorStop(0, 'rgba(255,0,0,0)');
      grad.addColorStop(1, `rgba(255,0,0,${vignetteAlpha})`);
      ctx.globalAlpha = 1;
      ctx.fillStyle = grad;
      ctx.fillRect(-width * 0.5, -height * 0.5, width, height);
    }

    // Phase 4: Impact streaks flying outward (0.15-0.6s)
    if (t >= 0.15) {
      const streakT = (t - 0.15) / 0.45;
      const streakAlpha = 1 - streakT;
      for (let i = 0; i < p.streaks; i++) {
        const angle = (i / p.streaks) * Math.PI * 2 + p.rotation;
        const dist = lerp(0, Math.max(width, height) * 0.6, streakT);
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        const size = lerp(8, 2, streakT);
        ctx.globalAlpha = streakAlpha * 0.8;
        ctx.fillStyle = i % 3 === 0 ? `rgba(255,255,255,${streakAlpha})` : `rgba(255,50,50,${streakAlpha})`;
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x + size * 0.3, y - size * 0.5);
        ctx.lineTo(x + size * 0.3, y + size * 0.5);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  function drawDomain(p) {
    const t = p.progress;
    const [r, g, b] = parseColor(p.color);

    // Phase 1: Converging speed lines (0-0.3s)
    if (t < 0.3) {
      const phaseT = t / 0.3;
      const alpha = 1 - phaseT;
      ctx.globalAlpha = alpha * 0.6;
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.5})`;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2;
        const startR = lerp(Math.max(width, height), 100, phaseT);
        const endR = Math.max(width, height) * 0.6;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * startR, Math.sin(angle) * startR);
        ctx.lineTo(Math.cos(angle) * endR, Math.sin(angle) * endR);
        ctx.stroke();
      }
    }

    // Phase 2: Radial crack lines from center (0.2-0.6s)
    if (t >= 0.2 && t < 0.6) {
      const crackT = (t - 0.2) / 0.4;
      ctx.globalAlpha = (1 - crackT) * 0.7;
      ctx.strokeStyle = `rgba(255,255,255,${(1 - crackT) * 0.6})`;
      ctx.lineWidth = 2;
      for (const crack of p.cracks) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let j = 0; j < crack.segments; j++) {
          const segT = j / crack.segments;
          const segProg = clamp(crackT * 2 - segT, 0, 1);
          const r = lerp(0, crack.maxR, segProg);
          const angle = crack.baseAngle + crack.jitter[j] * (1 - segProg);
          ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.stroke();
      }
    }

    // Phase 3: Exploding speed lines outward (0.4-0.8s)
    if (t >= 0.4 && t < 0.85) {
      const explodeT = (t - 0.4) / 0.45;
      const alpha = 1 - explodeT;
      ctx.globalAlpha = alpha * 0.5;
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.4})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 40; i++) {
        const angle = (i / 40) * Math.PI * 2 + p.rotation;
        const startR = lerp(100, Math.max(width, height) * 0.5, explodeT);
        const endR = lerp(200, Math.max(width, height), explodeT);
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * startR, Math.sin(angle) * startR);
        ctx.lineTo(Math.cos(angle) * endR, Math.sin(angle) * endR);
        ctx.stroke();
      }
    }

    // Phase 4: Colored shockwave rings (0.5-1.0s)
    if (t >= 0.5) {
      const ringT = (t - 0.5) / 0.5;
      const alpha = (1 - ringT) * 0.7;
      for (let i = 0; i < 3; i++) {
        const rT = clamp(ringT - i * 0.15, 0, 1);
        if (rT >= 1) continue;
        const ringAlpha = alpha * (1 - rT);
        ctx.globalAlpha = ringAlpha;
        ctx.strokeStyle = `rgba(${r},${g},${b},${ringAlpha})`;
        ctx.lineWidth = 4 * (1 - rT * 0.5);
        ctx.beginPath();
        ctx.arc(0, 0, lerp(0, Math.max(width, height) * 0.8, rT), 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  // ============================================================
  // Particle Spawning (Object Pool)
  // ============================================================
  function allocate() {
    if (active.length >= MAX_PARTICLES) return null;
    const p = pool[poolPtr];
    poolPtr = (poolPtr + 1) % MAX_PARTICLES;
    active.push(p);
    return p;
  }

  function spawnParticle(x, y, opts) {
    if (!enabled) return;
    if (active.length >= MAX_PARTICLES) return;

    const count = Math.min(opts.count || 20, MAX_PARTICLES - active.length);
    const color = opts.color || DEFAULT_COLOR;
    const speed = opts.speed || rand(150, 350);
    const spread = opts.spread !== undefined ? opts.spread : Math.PI * 2;
    const gravity = opts.gravity || 0;
    const life = opts.life || rand(0.4, 0.8);
    const baseSize = opts.size || rand(2, 5);
    const shape = opts.shape || 'circle';

    const baseAngle = opts.angle || 0;

    for (let i = 0; i < count; i++) {
      const p = allocate();
      if (!p) break;

      const angle = baseAngle + (Math.random() - 0.5) * spread;
      const spd = speed * rand(0.6, 1.4);

      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * spd;
      p.vy = Math.sin(angle) * spd;
      p.ax = 0;
      p.ay = gravity;
      p.life = life * rand(0.7, 1.3);
      p.maxLife = p.life;
      p.startSize = baseSize * rand(0.8, 1.2);
      p.endSize = 0;
      p.size = p.startSize;
      p.color = color;
      p.glowColor = opts.glowColor || color;
      p.shape = shape;
      p.rotation = rand(0, Math.PI * 2);
      p.rotationSpeed = rand(-3, 3);
      p.type = 'particle';
    }
    startLoop();
  }

  // ============================================================
  // Public API
  // ============================================================
  const VFX = {
    init() {
      if (canvas) return; // already initialized

      // Read persisted enabled state
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) enabled = stored === 'true';
      } catch (_) {}

      // Check prefers-reduced-motion
      try {
        reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch (_) {}

      // Create canvas
      canvas = document.createElement('canvas');
      canvas.id = 'vfx-canvas';
      canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:4800;';
      document.body.appendChild(canvas);

      ctx = canvas.getContext('2d');
      resize();

      window.addEventListener('resize', resize);
      window.addEventListener('blur', stopLoop); // pause when tab hidden
    },

    toggle() {
      enabled = !enabled;
      try { localStorage.setItem(STORAGE_KEY, enabled); } catch (_) {}
      if (!enabled) VFX.clear();
      return enabled;
    },

    isEnabled() { return enabled; },

    clear() {
      active.length = 0;
      stopLoop();
    },

    // ---- Burst: radial particle explosion ----
    burst(x, y, opts = {}) {
      if (!enabled) return;
      const count = reducedMotion ? Math.floor((opts.count || 20) / 2) : (opts.count || 20);
      spawnParticle(x, y, { ...opts, count });
    },

    // ---- Slash: anime sword slash ----
    slash(x1, y1, x2, y2, opts = {}) {
      if (!enabled) return;
      const p = allocate();
      if (!p) return;

      const color = opts.color || DEFAULT_COLOR;
      const width = opts.width || 4;
      const glow = opts.glow || 0.6;
      const duration = opts.duration || 0.35;

      p.x1 = x1; p.y1 = y1; p.x2 = x2; p.y2 = y2;
      p.progress = 0;
      p.duration = duration;
      p.width = width;
      p.glow = glow;
      p.color = color;
      p.glowColor = opts.glowColor || color;
      p.type = 'slash';

      // Also spawn spark particles along the arc
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const sparkCount = reducedMotion ? 3 : 6;
      for (let i = 0; i < sparkCount; i++) {
        const t = (i + 0.5) / sparkCount;
        const sx = lerp(x1, x2, t);
        const sy = lerp(y1, y2, t);
        spawnParticle(sx, sy, {
          count: 1,
          color: color,
          speed: rand(80, 150),
          spread: Math.PI * 0.5,
          gravity: 0,
          life: rand(0.2, 0.4),
          size: rand(1.5, 3),
          shape: 'spark',
          angle: Math.atan2(y2 - y1, x2 - x1) + (Math.random() - 0.5) * Math.PI * 0.5,
        });
      }
      startLoop();
    },

    // ---- Shockwave: expanding ring(s) ----
    shockwave(x, y, opts = {}) {
      if (!enabled) return;
      const p = allocate();
      if (!p) return;

      const color = opts.color || DEFAULT_COLOR;
      const maxRadius = opts.maxRadius || Math.max(width, height) * 0.6;
      const rings = opts.rings || 2;
      const width_ = opts.width || 3;
      const duration = opts.duration || 0.6;

      p.x = x; p.y = y;
      p.radius = 0;
      p.maxRadius = maxRadius;
      p.rings = rings;
      p.ringWidth = width_;
      p.duration = duration;
      p.color = color;
      p.type = 'shockwave';

      startLoop();
    },

    // ---- Beam: energy beam ----
    beam(x1, y1, x2, y2, opts = {}) {
      if (!enabled) return;
      const p = allocate();
      if (!p) return;

      const color = opts.color || DEFAULT_COLOR_ALT;
      const width = opts.width || 3;
      const duration = opts.duration || 0.25;

      p.x1 = x1; p.y1 = y1; p.x2 = x2; p.y2 = y2;
      p.beamProgress = 0;
      p.duration = duration;
      p.width = width;
      p.color = color;
      p.type = 'beam';

      startLoop();
    },

    // ---- Black Flash: signature full-screen effect ----
    blackFlash(x, y) {
      if (!enabled) return;
      if (reducedMotion) {
        // Simple fade fallback
        const p = allocate();
        if (!p) return;
        p.x = x; p.y = y;
        p.progress = 0;
        p.duration = 0.3;
        p.type = 'blackflash';
        p.streaks = 0;
        startLoop();
        return;
      }

      const p = allocate();
      if (!p) return;

      p.x = x; p.y = y;
      p.progress = 0;
      p.duration = 0.6;
      p.streaks = 24;
      p.rotation = rand(0, Math.PI * 2);
      p.vignetteAlpha = 0;
      p.type = 'blackflash';

      startLoop();
    },

    // ---- Domain Expansion: full-screen cinematic ----
    domainExpand(colorHex) {
      if (!enabled) return;
      if (reducedMotion) {
        // Simple fade fallback
        const p = allocate();
        if (!p) return;
        p.x = width * 0.5; p.y = height * 0.5;
        p.progress = 0;
        p.duration = 0.5;
        p.color = colorHex || DEFAULT_COLOR;
        p.type = 'domain';
        startLoop();
        return;
      }

      const p = allocate();
      if (!p) return;

      const color = colorHex || DEFAULT_COLOR;
      p.x = width * 0.5; p.y = height * 0.5;
      p.progress = 0;
      p.duration = 1.2;
      p.color = color;
      p.rotation = rand(0, Math.PI * 2);
      p.type = 'domain';

      // Pre-generate crack lines
      const crackCount = 12;
      p.cracks = [];
      for (let i = 0; i < crackCount; i++) {
        const baseAngle = (i / crackCount) * Math.PI * 2;
        const segments = randInt(4, 8);
        const jitter = [];
        for (let j = 0; j < segments; j++) jitter.push(rand(-0.3, 0.3));
        p.cracks.push({
          baseAngle,
          segments,
          maxR: Math.max(width, height) * 0.6,
          jitter,
        });
      }

      startLoop();
    },

    // ---- Cell helpers ----
    cellCenter(r, c) {
      // Board is #board with 64 .cell divs in row-major order (r=0 top)
      const board = document.getElementById('board');
      if (!board) return { x: width * 0.5, y: height * 0.5 };
      const cells = board.querySelectorAll('.cell');
      const idx = r * 8 + c;
      if (idx < 0 || idx >= cells.length) return { x: width * 0.5, y: height * 0.5 };
      const cell = cells[idx];
      const rect = cell.getBoundingClientRect();
      return { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5 };
    },

    cellBurst(r, c, opts = {}) {
      const pos = this.cellCenter(r, c);
      this.burst(pos.x, pos.y, opts);
    },

    cellSlash(r1, c1, r2, c2, opts = {}) {
      const p1 = this.cellCenter(r1, c1);
      const p2 = this.cellCenter(r2, c2);
      this.slash(p1.x, p1.y, p2.x, p2.y, opts);
    },
  };

  // Expose globally (no bare DOM access at load time)
  if (typeof window !== 'undefined') {
    window.VFX = VFX;
  }
  // Also support CommonJS/Node for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = VFX;
  }
})();