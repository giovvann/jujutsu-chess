/**
 * Jujutsu Chess — Procedural SFX Engine
 * Pure Web Audio API synthesis — zero external assets, zero dependencies.
 * Exposes: window.SFX { init, play, setVolume, toggle, enabled, test }
 * Volume hierarchy (quiet → loud): ui_hover, move, capture, skill, domain
 * Master gain ~0.5 with DynamicsCompressor to prevent clipping.
 */
(function () {
  'use strict';

  // ============================================================
  // Core state & lazy AudioContext
  // ============================================================
  let ctx = null;
  let masterGain = null;
  let compressor = null;
  let initialized = false;
  let enabled = true;
  let pendingPlays = []; // queue play() calls before init

  // Persisted enabled state (localStorage key 'jjc_sfx')
  try {
    const stored = typeof localStorage !== 'undefined' && localStorage.getItem('jjc_sfx');
    if (stored !== null) enabled = stored === 'true';
  } catch (_) { /* ignore */ }

  // Noise buffer cache (shared across patches)
  const noiseCache = new Map();

  // ============================================================
  // Helpers
  // ============================================================

  /** Get or create a white-noise AudioBuffer of given duration (seconds). */
  function getNoiseBuffer(duration) {
    const key = duration.toFixed(3);
    if (noiseCache.has(key)) return noiseCache.get(key);
    const sampleRate = ctx.sampleRate;
    const length = Math.ceil(sampleRate * duration);
    const buf = ctx.createBuffer(1, length, sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    noiseCache.set(key, buf);
    return buf;
  }

  /** ADSR-like envelope on a GainNode: attack (linear), decay (exponential to sustain=0). */
  function env(gain, t, attack, decay, peak = 1) {
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
    // stop source after envelope to free voices
    return attack + decay + 0.02;
  }

  /** Create a filtered noise burst. */
  function noiseBurst(opts = {}) {
    const {
      duration = 0.15,
      freq = 800,
      Q = 2,
      type = 'bandpass',
      gain = 1,
      attack = 0.005,
      decay = 0.1
    } = opts;
    const src = ctx.createBufferSource();
    src.buffer = getNoiseBuffer(duration);
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = Q;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(filter).connect(g).connect(masterGain);
    src.start(ctx.currentTime);
    const total = env(g, ctx.currentTime, attack, decay, gain);
    src.stop(ctx.currentTime + total);
    return total;
  }

  /** Tone with envelope: oscillator + optional second osc for richness. */
  function tone(opts = {}) {
    const {
      freq = 440,
      type = 'sine',
      freq2 = null,
      type2 = null,
      detune = 0,
      gain = 1,
      attack = 0.01,
      decay = 0.2,
      filter = null, // { type, freq, Q }
      freqRamp = null // { from, to, time }
    } = opts;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    const g = ctx.createGain();
    g.gain.value = gain;
    let chain = osc;
    if (filter) {
      const f = ctx.createBiquadFilter();
      f.type = filter.type;
      f.frequency.value = filter.freq;
      f.Q.value = filter.Q || 2;
      chain = osc.connect(f);
    }
    chain.connect(g).connect(masterGain);
    if (freqRamp) {
      osc.frequency.setValueAtTime(freqRamp.from, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqRamp.to, ctx.currentTime + freqRamp.time);
    }
    if (freq2) {
      const osc2 = ctx.createOscillator();
      osc2.type = type2 || type;
      osc2.frequency.value = freq2;
      osc2.detune.value = detune;
      osc2.connect(g);
      osc2.start(ctx.currentTime);
      const total2 = env(g, ctx.currentTime, attack, decay, gain);
      osc2.stop(ctx.currentTime + total2);
    }
    osc.start(ctx.currentTime);
    const total = env(g, ctx.currentTime, attack, decay, gain);
    osc.stop(ctx.currentTime + total);
    return total;
  }

  /** Swept filter on noise — classic whoosh/riser. */
  function noiseSweep(opts = {}) {
    const {
      duration = 0.5,
      from = 200,
      to = 4000,
      type = 'bandpass',
      Q = 6,
      gain = 1,
      attack = 0.02,
      decay = 0.3,
      curve = 'exponential'
    } = opts;
    const src = ctx.createBufferSource();
    src.buffer = getNoiseBuffer(duration);
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.Q.value = Q;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(filter).connect(g).connect(masterGain);
    const now = ctx.currentTime;
    if (curve === 'exponential') {
      filter.frequency.setValueAtTime(from, now);
      filter.frequency.exponentialRampToValueAtTime(to, now + duration);
    } else {
      filter.frequency.linearRampToValueAtTime(to, now + duration);
    }
    src.start(now);
    const total = env(g, now, attack, decay, gain);
    src.stop(now + total);
    return total;
  }

  // ============================================================
  // Patch definitions — each returns approximate duration (seconds)
  // ============================================================

  // ---- UI: ultra-quiet, airy ----
  function p_ui_hover() {
    // High filtered noise blip, barely audible — like air displacement
    return noiseBurst({ duration: 0.06, freq: 6000, Q: 8, type: 'highpass', gain: 0.06, attack: 0.001, decay: 0.04 });
  }

  function p_ui_click() {
    // Crisp confirm: sine+triangle chirp down, snappy
    const now = ctx.currentTime;
    // Main chirp
    const o1 = ctx.createOscillator(); o1.type = 'sine';
    const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = 1200;
    const g = ctx.createGain(); g.gain.value = 0.18;
    o1.connect(g); o2.connect(g); g.connect(masterGain);
    o1.frequency.setValueAtTime(1600, now);
    o1.frequency.exponentialRampToValueAtTime(600, now + 0.07);
    o1.start(now); o2.start(now);
    const dur = env(g, now, 0.001, 0.06, 0.18);
    o1.stop(now + dur); o2.stop(now + dur);
    return dur;
  }

  function p_ui_back() {
    // Reverse chirp, softer — upward sweep, lower gain
    const now = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sine';
    const g = ctx.createGain(); g.gain.value = 0.1;
    o.connect(g).connect(masterGain);
    o.frequency.setValueAtTime(500, now);
    o.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
    o.start(now);
    const dur = env(g, now, 0.005, 0.07, 0.1);
    o.stop(now + dur);
    return dur;
  }

  function p_select() {
    // Soft mystical chime: fundamental + shimmer partials (2x, 3x, 5x)
    const now = ctx.currentTime;
    const base = 660;
    const partials = [1, 2, 3, 5].map(m => base * m);
    let maxDur = 0;
    partials.forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = 0.07 / (i + 1);
      o.connect(g).connect(masterGain);
      o.start(now);
      const d = env(g, now, 0.01, 0.6 + i * 0.1, 0.07 / (i + 1));
      o.stop(now + d);
      maxDur = Math.max(maxDur, d);
    });
    return maxDur;
  }

  // ---- GAMEPLAY CORE ----
  function p_move() {
    // Piece-on-stone thock: low noise burst + 90Hz sine drop
    const now = ctx.currentTime;
    // Low thump
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 90;
    const g1 = ctx.createGain(); g1.gain.value = 0.25;
    o.connect(g1).connect(masterGain);
    o.frequency.exponentialRampToValueAtTime(55, now + 0.08);
    o.start(now);
    const d1 = env(g1, now, 0.002, 0.07, 0.25);
    o.stop(now + d1);
    // Stone dust noise
    noiseBurst({ duration: 0.08, freq: 220, Q: 3, type: 'bandpass', gain: 0.12, attack: 0.001, decay: 0.06 });
    return 0.12;
  }

  function p_capture() {
    // Heavy impact + shatter: sub-bass thump + bright noise crack + descending debris
    const now = ctx.currentTime;
    // Sub-bass thump
    const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.value = 38;
    const gSub = ctx.createGain(); gSub.gain.value = 0.45;
    sub.connect(gSub).connect(masterGain);
    sub.frequency.exponentialRampToValueAtTime(22, now + 0.15);
    sub.start(now);
    const dSub = env(gSub, now, 0.005, 0.18, 0.45);
    sub.stop(now + dSub);
    // Bright crack (high noise)
    noiseBurst({ duration: 0.06, freq: 4500, Q: 4, type: 'highpass', gain: 0.25, attack: 0.001, decay: 0.04 });
    // Descending debris: rapid low-noise grains
    for (let i = 0; i < 6; i++) {
      const t = now + 0.04 + i * 0.025;
      const src = ctx.createBufferSource(); src.buffer = getNoiseBuffer(0.04);
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 180 - i * 20; f.Q.value = 3;
      const g = ctx.createGain(); g.gain.value = 0.1 * (1 - i * 0.1);
      src.connect(f).connect(g).connect(masterGain);
      src.start(t);
      env(g, t, 0.001, 0.035, 0.1 * (1 - i * 0.1));
      src.stop(t + 0.06);
    }
    return 0.45;
  }

  function p_check() {
    // Dissonant warning: minor-second stinger (tritone-ish), mid loudness
    const now = ctx.currentTime;
    const f1 = 523.25; // C5
    const f2 = 554.37; // C#5 (minor second)
    [f1, f2].forEach(f => {
      const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = 0.15;
      o.connect(g).connect(masterGain);
      o.start(now);
      const d = env(g, now, 0.005, 0.25, 0.15);
      o.stop(now + d);
    });
    // Undertone rumble
    const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.value = 55;
    const gSub = ctx.createGain(); gSub.gain.value = 0.1;
    sub.connect(gSub).connect(masterGain);
    sub.start(now);
    env(gSub, now, 0.02, 0.3, 0.1);
    sub.stop(now + 0.35);
    return 0.35;
  }

  // ---- CURSED TECHNIQUES ----
  function p_skill() {
    // Cursed-energy charge-and-release: rising saw sweep through bandpass + noise whoosh (~0.7s)
    const now = ctx.currentTime;
    const dur = 0.7;
    // Charge: sawtooth rising through bandpass
    const osc = ctx.createOscillator(); osc.type = 'sawtooth';
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 12;
    const g1 = ctx.createGain(); g1.gain.value = 0.22;
    osc.connect(bp).connect(g1).connect(masterGain);
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + dur * 0.65);
    bp.frequency.setValueAtTime(120, now);
    bp.frequency.exponentialRampToValueAtTime(2200, now + dur * 0.65);
    osc.start(now);
    env(g1, now, 0.02, dur * 0.6, 0.22);
    osc.stop(now + dur * 0.7);
    // Release whoosh
    noiseSweep({ duration: dur * 0.35, from: 2000, to: 300, type: 'bandpass', Q: 8, gain: 0.28, attack: 0.01, decay: 0.2 });
    return dur;
  }

  function p_domain() {
    // Cinematic domain expansion: deep 40Hz boom + slow riser + metallic shimmer (~1.8s, loudest)
    const now = ctx.currentTime;
    const dur = 1.8;
    // Deep boom
    const boom = ctx.createOscillator(); boom.type = 'sine'; boom.frequency.value = 40;
    const gBoom = ctx.createGain(); gBoom.gain.value = 0.6;
    boom.connect(gBoom).connect(masterGain);
    boom.start(now);
    env(gBoom, now, 0.05, 1.2, 0.6);
    boom.stop(now + dur);
    // Slow riser (saw + LPF opening)
    const riser = ctx.createOscillator(); riser.type = 'sawtooth';
    const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.Q.value = 4;
    const gRiser = ctx.createGain(); gRiser.gain.value = 0.18;
    riser.connect(lpf).connect(gRiser).connect(masterGain);
    riser.frequency.setValueAtTime(60, now);
    riser.frequency.exponentialRampToValueAtTime(440, now + dur * 0.8);
    lpf.frequency.setValueAtTime(120, now);
    lpf.frequency.exponentialRampToValueAtTime(3500, now + dur * 0.8);
    riser.start(now);
    env(gRiser, now, 0.1, dur * 0.7, 0.18);
    riser.stop(now + dur * 0.9);
    // Metallic shimmer: high partials with slow attack
    [880, 1320, 1760, 2640].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = 0.06 / (i + 1);
      o.connect(g).connect(masterGain);
      o.start(now + 0.3);
      const d = env(g, now + 0.3, 0.3, 1.0, 0.06 / (i + 1));
      o.stop(now + 0.3 + d);
    });
    return dur;
  }

  function p_clash() {
    // Two domains colliding: distorted dual-osc beat + crackle
    const now = ctx.currentTime;
    const dur = 1.1;
    // Dual detuned saws creating beat frequency
    const base = 110;
    [base * 0.98, base * 1.02].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = 0.2;
      const dist = ctx.createWaveShaper();
      dist.curve = (() => {
        const n = 256; const curve = new Float32Array(n);
        for (let j = 0; j < n; j++) {
          const x = (j * 2 / n) - 1;
          curve[j] = Math.tanh(x * 6); // soft clip
        }
        return curve;
      })();
      o.connect(dist).connect(g).connect(masterGain);
      o.start(now);
      const d = env(g, now, 0.02, dur * 0.8, 0.2);
      o.stop(now + d);
    });
    // Crackle layer: sporadic noise bursts
    for (let i = 0; i < 12; i++) {
      const t = now + Math.random() * dur;
      noiseBurst({ duration: 0.03, freq: 3000 + Math.random() * 4000, Q: 2, type: 'bandpass', gain: 0.15, attack: 0.001, decay: 0.02 });
    }
    return dur;
  }

  function p_blackflash() {
    // Sharp crack + sub drop + brief silence gap then low boom (~1s, dramatic)
    const now = ctx.currentTime;
    // Sharp crack (high transient)
    noiseBurst({ duration: 0.025, freq: 8000, Q: 6, type: 'highpass', gain: 0.5, attack: 0.0005, decay: 0.015 });
    // Sub drop
    const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.value = 180;
    const gSub = ctx.createGain(); gSub.gain.value = 0.55;
    sub.connect(gSub).connect(masterGain);
    sub.frequency.exponentialRampToValueAtTime(35, now + 0.12);
    sub.start(now);
    env(gSub, now, 0.002, 0.1, 0.55);
    sub.stop(now + 0.14);
    // Silence gap ~80ms
    // Low boom after gap
    const boom = ctx.createOscillator(); boom.type = 'sine'; boom.frequency.value = 32;
    const gBoom = ctx.createGain(); gBoom.gain.value = 0.45;
    boom.connect(gBoom).connect(masterGain);
    const boomTime = now + 0.22;
    boom.start(boomTime);
    env(gBoom, boomTime, 0.02, 0.6, 0.45);
    boom.stop(boomTime + 0.7);
    return 1.0;
  }

  function p_heal() {
    // Warm rising shimmer: major arpeggio sines + soft noise, gentle
    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4 E4 G4 C5
    let maxDur = 0;
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = 0.12;
      o.connect(g).connect(masterGain);
      o.start(now + i * 0.08);
      const d = env(g, now + i * 0.08, 0.05, 0.8, 0.12);
      o.stop(now + i * 0.08 + d);
      maxDur = Math.max(maxDur, i * 0.08 + d);
    });
    // Soft noise bed
    noiseSweep({ duration: 1.2, from: 1500, to: 400, type: 'lowpass', Q: 2, gain: 0.06, attack: 0.2, decay: 1.0, curve: 'linear' });
    return maxDur + 0.2;
  }

  function p_summon() {
    // Ethereal apparition: detuned pad swell + ghostly sine gliss
    const now = ctx.currentTime;
    const dur = 1.4;
    // Detuned pad (5 voices)
    for (let i = 0; i < 5; i++) {
      const o = ctx.createOscillator(); o.type = 'triangle';
      o.frequency.value = 164.81 * (1 + (i - 2) * 0.008); // E3-ish detuned
      const g = ctx.createGain(); g.gain.value = 0.06;
      const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 800; lpf.Q.value = 1.5;
      o.connect(lpf).connect(g).connect(masterGain);
      o.start(now);
      env(g, now, 0.4, dur * 0.6, 0.06);
      o.stop(now + dur);
    }
    // Ghostly gliss
    const gliss = ctx.createOscillator(); gliss.type = 'sine';
    const gGliss = ctx.createGain(); gGliss.gain.value = 0.12;
    gliss.connect(gGliss).connect(masterGain);
    gliss.frequency.setValueAtTime(220, now);
    gliss.frequency.exponentialRampToValueAtTime(880, now + dur * 0.7);
    gliss.start(now + 0.15);
    env(gGliss, now + 0.15, 0.2, dur * 0.5, 0.12);
    gliss.stop(now + dur);
    return dur;
  }

  function p_teleport() {
    // Whoosh: bandpass noise sweep up then down
    const now = ctx.currentTime;
    const up = 0.18, down = 0.22;
    noiseSweep({ duration: up, from: 300, to: 4500, type: 'bandpass', Q: 10, gain: 0.22, attack: 0.01, decay: up * 0.8 });
    noiseSweep({ duration: down, from: 4500, to: 200, type: 'bandpass', Q: 10, gain: 0.18, attack: 0.01, decay: down * 0.7 });
    return up + down;
  }

  function p_error() {
    // Dull rejected thud: low square blip, short
    const now = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = 110;
    const g = ctx.createGain(); g.gain.value = 0.18;
    const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 300; lpf.Q.value = 2;
    o.connect(lpf).connect(g).connect(masterGain);
    o.start(now);
    const d = env(g, now, 0.005, 0.08, 0.18);
    o.stop(now + d);
    return d;
  }

  // ---- ENDGAME ----
  function p_win() {
    // Victory phrase: 3-note rising cinematic chord + shimmer tail (~2.5s)
    const now = ctx.currentTime;
    const chord = [392.00, 523.25, 659.25]; // G4 B4 D5 (G major)
    chord.forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = 0.18;
      o.connect(g).connect(masterGain);
      o.start(now + i * 0.12);
      const d = env(g, now + i * 0.12, 0.05, 1.8, 0.18);
      o.stop(now + i * 0.12 + d);
    });
    // Shimmer tail: high partials
    [987.77, 1318.5, 1975.5].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = 0.05;
      o.connect(g).connect(masterGain);
      o.start(now + 0.5);
      const d = env(g, now + 0.5, 0.3, 1.8, 0.05);
      o.stop(now + 0.5 + d);
    });
    // Warm pad swell underneath
    const pad = ctx.createOscillator(); pad.type = 'triangle'; pad.frequency.value = 196;
    const gPad = ctx.createGain(); gPad.gain.value = 0.12;
    const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 600;
    pad.connect(lpf).connect(gPad).connect(masterGain);
    pad.start(now);
    env(gPad, now, 0.3, 2.0, 0.12);
    pad.stop(now + 2.5);
    return 2.5;
  }

  function p_lose() {
    // Defeat dirge: descending minor chord + low rumble (~2.5s)
    const now = ctx.currentTime;
    const chord = [392.00, 349.23, 293.66]; // G4 F4 D4 (descending minor feel)
    chord.forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = 0.16;
      o.connect(g).connect(masterGain);
      o.start(now + i * 0.18);
      const d = env(g, now + i * 0.18, 0.08, 1.6, 0.16);
      o.stop(now + i * 0.18 + d);
    });
    // Low rumble
    const rumble = ctx.createOscillator(); rumble.type = 'sawtooth'; rumble.frequency.value = 38;
    const gRumble = ctx.createGain(); gRumble.gain.value = 0.1;
    const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 80;
    rumble.connect(lpf).connect(gRumble).connect(masterGain);
    rumble.start(now);
    env(gRumble, now, 0.5, 2.0, 0.1);
    rumble.stop(now + 2.5);
    // Sparse high sorrow notes
    [523.25, 466.16].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = 0.06;
      o.connect(g).connect(masterGain);
      o.start(now + 1.0 + i * 0.4);
      const d = env(g, now + 1.0 + i * 0.4, 0.2, 1.0, 0.06);
      o.stop(now + 1.0 + i * 0.4 + d);
    });
    return 2.5;
  }

  // ============================================================
  // Patch registry & dispatcher
  // ============================================================
  const patches = {
    ui_hover: p_ui_hover,
    ui_click: p_ui_click,
    ui_back: p_ui_back,
    select: p_select,
    move: p_move,
    capture: p_capture,
    check: p_check,
    skill: p_skill,
    domain: p_domain,
    clash: p_clash,
    blackflash: p_blackflash,
    heal: p_heal,
    summon: p_summon,
    teleport: p_teleport,
    error: p_error,
    win: p_win,
    lose: p_lose,
    // Note: reversal_red, hollow_purple, domain_expand, ct, regen not implemented as SFX in this build
    domain_expand: p_domain_expand,
    ct: p_ct,
    regen: p_regen
  };

  // Volume scaling per patch (relative to master ~0.5)
  // Hierarchy: ui_hover < move < capture < skill < domain
  const patchGain = {
    ui_hover: 0.15,
    ui_click: 0.25,
    ui_back: 0.22,
    select: 0.3,
    move: 0.35,
    capture: 0.5,
    check: 0.45,
    skill: 0.65,
    domain: 0.9,
    clash: 0.75,
    blackflash: 0.8,
    heal: 0.4,
    summon: 0.45,
    teleport: 0.4,
    error: 0.3,
    win: 0.7,
    lose: 0.65
  };

  // ============================================================
  // Public API
  // ============================================================
  const SFX = {
    // Initialize AudioContext + master chain. Must be called on user gesture.
    init() {
      if (initialized) return Promise.resolve();
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return Promise.reject(new Error('Web Audio API not supported'));
      ctx = new AC();
      // Master chain: gain -> compressor -> destination
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.5; // global ceiling
      compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -12;
      compressor.knee.value = 12;
      compressor.ratio.value = 6;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.15;
      masterGain.connect(compressor).connect(ctx.destination);
      initialized = true;
      // Flush any queued plays
      pendingPlays.forEach(({ name, opts }) => SFX.play(name, opts));
      pendingPlays = [];
      // Resume if suspended (autoplay policy)
      if (ctx.state === 'suspended') return ctx.resume();
      return Promise.resolve();
    },

    // Play a named effect. Safe no-op if disabled or uninitialized.
    play(name, opts = {}) {
      if (!enabled) return;
      if (!initialized) {
        pendingPlays.push({ name, opts });
        return;
      }
      const fn = patches[name];
      if (!fn) {
        console.warn(`SFX: unknown sound "${name}"`);
        return;
      }
      // Create a per-play gain for volume scaling + opts.gain override
      const playGain = ctx.createGain();
      playGain.gain.value = (patchGain[name] || 0.5) * (opts.gain ?? 1);
      // Temporarily insert into chain: patch outputs connect to masterGain;
      // we achieve per-play gain by wrapping masterGain connection in the patch?
      // Simpler: each patch connects to masterGain directly. We'll use a proxy gain
      // by monkey-patching masterGain reference for this call — but that's messy.
      // Instead: patches accept an optional output node. Let's refactor patches to take dest.
      // For minimal diff: create a temporary gain that patches connect to.
      // We'll redefine patches to accept (dest) — but to keep diff small, we instead
      // create a gain node and temporarily swap masterGain in a closure.
      // Simplest: each patch uses a local `out = opts.dest || masterGain`.
      // We'll update patch functions inline below — but since they're already defined,
      // we'll use a wrapper that creates a gain and patches connect to it by using
      // a module-level `currentDest` trick.
      currentDest = playGain;
      playGain.connect(masterGain);
      fn();
      currentDest = masterGain;
    },

    // Set master volume 0..1 (applies to masterGain)
    setVolume(v) {
      const vol = Math.max(0, Math.min(1, v));
      if (masterGain) masterGain.gain.value = vol * 0.5; // 0.5 is our internal ceiling
    },

    // Toggle enabled state, persist to localStorage, return new state
    toggle() {
      enabled = !enabled;
      try { localStorage.setItem('jjc_sfx', enabled); } catch (_) {}
      return enabled;
    },

    // Expose current enabled state (getter)
    get enabled() { return enabled; },
    set enabled(v) {
      enabled = !!v;
      try { localStorage.setItem('jjc_sfx', enabled); } catch (_) {}
    },

    // Manual audition for dev/testing
    test(name) {
      if (!patches[name]) { console.warn(`SFX.test: unknown "${name}"`); return; }
      if (!initialized) SFX.init();
      SFX.play(name, { gain: 1 });
    }
  };


  // Expose globally
  if (typeof window !== 'undefined') window.SFX = SFX;
  if (typeof module !== 'undefined') module.exports = SFX;
})();
