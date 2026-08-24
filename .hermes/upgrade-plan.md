# Jujutsu Chess — AAA Upgrade Plan

## Current state (audited)
- Monolith: index.html (1097L), style.css (1301L), script.js (6491L). Vanilla JS, no deps, no build.
- Node available for syntax checks. Git remote = giovvann/jujutsu-chess, push deploys.
- Visual verdict (verified in browser): hobbyist-grade. Footer overlaps stats strip, dead space, emoji icons, clipped title, flat CSS-only bg, no motion design, no sound at all.
- DOM/JS contract extracted at .hermes/upgrade-contract.md — all 23 onclick fns exist; no missing handlers.

## Workstreams

### A. SFX engine (subagent) → NEW file sfx.js
Procedural Web Audio synthesis (no assets). window.SFX.play(name).
Names: ui_hover, ui_click, select, move, capture, check, skill, domain, blackflash, heal, summon, error, win, lose, clash, teleport.
Lazy AudioContext init on first pointerdown. localStorage 'jjc_sfx' mute.

### B. VFX engine (subagent) → NEW file vfx.js
Canvas particle engine, anime aesthetics. window.VFX.{burst, slash, shockwave, beam, blackFlash, domainExpand, cellCenter, cellBurst}.
Fixed canvas z-index 4800, pointer-events none. Particle pool, additive blend, idle-stops-rAF. localStorage 'jjc_vfx'.

### C. Bug audit (subagent) → .hermes/bug-catalog.md
Reads from git HEAD (immune to concurrent edits). P0–P3 catalog with file:line + fix.
Focus: state-reset gaps in startBattle, skill/cost contradictions, game-over edge cases, dead DOM refs, UX bugs.

### D. UI overhaul (me, parallel) → style.css + index.html
1. Home: fill viewport, fix footer overlap (footer flows after panel, not over it), title breathing room.
2. Replace emoji icons with inline SVG (sword, scroll, question, star, gear, cross).
3. Animated ambient bg: layered radial gradients + slow-drifting cursed-energy particles (CSS only) + vignette.
4. Buttons: depth, glow sweep on hover, press states, staggered entrance animation.
5. Typography scale up (labels 11px→12-13px, better contrast), stats strip redesign (no truncation).
6. Responsive: board sized via min(90vw, calc(100vh - panels)); media queries ≤900px stack battle layout; ≤520px compact.
7. Battle screen: cleaner panels, CE bars with glow, move history scroll fix.
8. Win modal: cinematic entrance.

### E. Integration (me, after A+B land)
- index.html: <script src="sfx.js"></script><script src="vfx.js"></script> before script.js. Settings toggles for SFX/VFX.
- script.js hooks: applyMove (move/capture SFX + VFX.burst), executeTech (skill SFX + VFX), showDomainCinematic (VFX.domainExpand + domain SFX), black flash path, endGame (win/lose), button hovers/clicks (delegated listener).

### F. Bug fixes (me, after C lands) — in catalog priority order.

### G. Test loop
Serve on :8123 → browser_navigate → vision check each screen → console errors → scripted self-play smoke (move a piece, trigger a skill via executeTech in console) → fix → repeat.

### H. Ship
git add -A, commit, push origin main.
