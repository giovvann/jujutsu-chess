# Jujutsu Chess: Tactical Ritual

A free browser chess variant set in the *Jujutsu Kaisen* universe. Play standard chess rules layered with cursed techniques, domain expansions, and character-specific abilities — capture pieces the normal way, or burn cursed energy (CE) to unleash Cleave, Malevolent Shrine, Hollow Purple, Black Flash, and dozens of other techniques pulled from the source material.

Progress through a roster of AI opponents of increasing difficulty (from early antagonists up through Gojo Satoru, Ryomen Sukuna, and other "MAX tier" fights), unlocking each opponent's techniques to add to your own loadout as you win.

## Running it

This is a static site with no build step and no dependencies — just serve the directory and open it in a browser:

```bash
python3 -m http.server 9000
# then visit http://localhost:9000
```

Or open `index.html` directly in a browser.

## Project structure

```
index.html   — markup, screens (home, battle, archive, how-to-play, settings)
script.js    — game state, chess rules, AI opponents, cursed techniques
style.css    — all styling and animations
sfx.js       — procedural Web Audio sound effects
vfx.js       — canvas-based particle/visual effects
assets/pieces/ — SVG chess piece and shikigami icons
```

Everything runs client-side; there's no backend. Player progress (unlocked techniques, loadout, CE pool) is saved to `localStorage`.

## How to play

Standard chess movement and check/checkmate rules apply as a baseline. Beyond that:

- **Cursed Energy (CE)** builds up over the course of a battle and is spent to activate techniques.
- **Techniques** are equipped into slots (Special, Ability, Domain, Ultimate, RCT, etc.) from what you've unlocked by defeating opponents, and used from the battle screen instead of, or alongside, normal moves.
- **Domain Expansions** are powerful area-effect states with their own activation costs, durations, and clash rules against enemy domains.
- Full mechanics and a per-opponent breakdown are documented in-game under **How to Play**.

Some opponents change the win condition (e.g. capture every enemy piece rather than checkmate) — check each opponent's card before starting a battle.
