# Jujutsu Chess Balance & Content Overhaul

> **Branch:** `fix/balance-and-content-overhaul`

**Goal:** Apply 6 fixes to `giovvann/jujutsu-chess` covering: character icon, skill descriptions, WCS/Hollow Nuke King-kill, Heian Shrine unlock gate, cast limits, and 3-tier domain power system.

**Files touched:**
- `index.html` — character icon, how-to-play, character-select drops display
- `script.js` — SKILLS dictionary, drop table, executeTech for WCS/HN/Lapse Blue, domain resolution, endTurn per-turn resets
- `style.css` — minor (only if visuals needed; level 1/2/3 distinct classes)

---

## Fix 1: Megumi (Awakened) heart → ball
**File:** `index.html:115`
**Change:** `<span>🩵</span>` → `<span>🌑</span>` (new moon = ball). Note: user said "hearth" but the actual char on the Awakened card is 🩵 (light blue heart).

## Fix 2: Lapse Blue description fix
**File:** `script.js:15`
**Change:** Remove "Bypasses Infinity and Limitless entirely" from Lapse Blue's `desc`. Also update how-to-play at `index.html:557` ("Lapse Blue bypasses both entirely" → remove or replace with the actual rule).
**Rationale:** Per the 4-rule bypass system in lines 559-572, Lapse Blue does not satisfy A/B/C/D. The `executeTech` for Lapse Blue has no Infinity/Limitless check — but Lapse Blue is a teleport, not an attack that crosses the barrier, so it doesn't actually "bypass" anything. Fix: clarify in description that Lapse Blue is a teleport (it moves a piece to a destination; it doesn't break the barrier rule because it's a movement, not an attack).

## Fix 3: WCS + Hollow Nuke can destroy Mahoraga/Rika/King
**Files:**
- `script.js:45` — WCS description: add "Cannot be blocked; can destroy Mahoraga, Rika, and the King"
- `script.js:46` — Hollow Nuke description: add "Can destroy Mahoraga, Rika, and the King"
- `script.js:1750,1762` — WCS executeTech: remove `&& !p.isAdaptive` filter (so Mahoraga, Rika get hit). Keep `!p.isMahoragaKing` (King cannot be hit by WCS — wait, user says King can be hit. Re-read). Re-read user: "WCS and hollow nuke will be able to destroy mahoraga, Rika or the king" — so YES they can destroy King. Remove the `!p.isMahoragaKing` filter too.
- `script.js:1851,1879` — Hollow Nuke executeTech: same — currently just `!np || np.color === 'W'` filter (any non-white piece, including King). The Mahoraga/adaptive filter is missing here — actually looking again, the code at line 1851 already only excludes white pieces. So Mahoraga (Black), Rika (Black), King (Black) would all be hit. The user wants to confirm King is hit. The Mahoraga filter — looking again, there's no isAdaptive filter on HN. Let me verify by reading the code carefully...

Actually re-reading `script.js:1848-1853`:
```
for (let nr = 1; nr <= 6; nr++) for (let nc = 1; nc <= 6; nc++) {
    const np = state.board[nr][nc];
    if (!np || np.color === 'W') continue;
    state.capturedByW.push(np.type); state.board[nr][nc] = null;
    playAnim(nr, nc, 'hollow-nuke-anim');
}
```
This already destroys ANY Black piece (including King, Mahoraga, Rika). Good. But the description says "Bypassed by Infinity/Limitless unless..." which is the contradiction. The user wants WCS and HN to NOT be bypassed by Infinity/Limitless. Wait — let me re-read.

The user said: "Now WCS and hollow nuke will be able to destroy mahoraga, Rika or he king, update the code, the descriptions, the how to play, etc."

So the change is: WCS and HN can now destroy Mahoraga, Rika, and the King. Update the code (remove the isAdaptive / isMahoragaKing filters), descriptions, and how-to-play.

WCS code at line 1750-1753: `if (p && p.color === 'B' && !p.isAdaptive && !p.isMahoragaKing) { ... }` — remove `!p.isAdaptive && !p.isMahoragaKing`.

Hollow Nuke: already destroys all Black pieces. But Mahoraga is a Black piece that has `isAdaptive: true`. Looking again, the HN code doesn't check `isAdaptive` — it just checks `color === 'W'`. So HN already works. The user just wants the descriptions and how-to-play to reflect this.

Update how-to-play `index.html:489-500` (Hollow Purple, WCS, HN, Fuga).

## Fix 4: Malevolent Shrine: Heian unlock
**File:** `script.js:280,4357` and `index.html`
**Change:** Add `'Malevolent Shrine: Heian'` to the `Ryomen Sukuna Heian` drops list in BOTH `renderCharDrops` (line 280) AND `endGame` rewards (line 4357).
Also update how-to-play line 647-648: "World Cutting Slash, Heian Cleave, Heian Dismantle, Imaginary Fierce God, and Fuga" → add "Malevolent Shrine: Heian".

## Fix 5: WCS 1/turn, Hollow Nuke 2/turn cast limits
**Files:** `script.js`
**Changes:**
- Add `playerWCSUsedThisTurn` and `playerHNUsedThisTurn` to state init
- In WCS executeTech (line 1740-1745): block if `playerWCSUsedThisTurn` is true (log: "WCS: 1 chant stage per turn max"). Set to true after the chant advances.
- In Hollow Nuke executeTech (line 1827-1833): block if `playerHNUsedThisTurn` is true. Set to true after the chant advances.
- In endTurn (line 3251): when `state.turn === 'W'` (player's turn just started), reset `playerWCSUsedThisTurn = false` and `playerHNUsedThisTurn = false`.

Also update how-to-play `index.html:491-500` to reflect the per-turn limits.

## Fix 6: 3-tier domain power system
**File:** `script.js` (mostly in `checkDomainClashVisual`, `endDomainClash`, `chooseDomainExpand`, `canEnemyExpandDomain`, `aiExpandDomain`, `isDomainClash`, `canBypassBarrier`, `executeTech` for each domain)

**Levels:**
- **Level 1** (lowest, but overpowering): True Mutual Love, Self Embodiment of Perfection, Time Cell Moon Palace, Chimera Shadow Garden
- **Level 2**: Infinite Void, Malevolent Shrine
- **Level 3** (highest): Malevolent Shrine: Heian

**New rules:**
- Higher-level domain **collapses** the lower-level domain outright (no clash). E.g. L3 collapses L2 and L1; L2 collapses L1.
- Same-level domains **clash** (20-turn countdown, current behavior).
- L1 vs L2 = L2 overpowers (L1 collapses). L1 vs L3 = L3 overpowers. L2 vs L3 = L3 overpowers.
- The old rule that Infinite Void and Malevolent Shrine "overpower all other domains" is now generalized: any L2 overpowers L1, any L3 overpowers L2 or L1.

**Implementation:**
- Add a `getDomainLevel(domainType)` helper function returning 1, 2, or 3.
- Refactor `checkDomainClashVisual` so when a new domain is activated:
  - If existing domain is **lower** level → collapse existing, new domain takes control (use current "overpower" code path)
  - If existing domain is **same** level → trigger domain clash (20-turn countdown, as today)
  - If existing domain is **higher** level → new domain collapses (it failed to overpower)
- Update `endGame` / collapse logic to use level checks.
- Update SKILLS dictionary descriptions:
  - Level 1: add "Domain Level 1"
  - Level 2: add "Domain Level 2" (currently says "Overwhelms all other domains" — change to "Domain Level 2 — overpowers Level 1 domains; clashes with same-level Void; collapses to Heian")
  - Level 3: add "Domain Level 3"
- Update how-to-play lines 502-518 (Domain slots section) and 522-535 (Domain Expansion & Clashes).

**Refactor strategy:** The existing code has hard-coded checks like `state.infiniteVoidActive || state.gojoVoidActive` for "has any L2 domain". I'll add a `playerHasDomainOfLevel(n)` and `enemyHasDomainOfLevel(n)` helper, then refactor `checkDomainClashVisual` to use level arithmetic.

---

## Implementation order

1. Fix 1 (1 char in HTML)
2. Fix 2 (1 line in script.js + 1 in HTML)
3. Fix 4 (4 lines total: 2 in script.js drops, 1 in how-to-play)
4. Fix 3 (3 lines in script.js + ~4 in how-to-play)
5. Fix 5 (~10 lines in script.js + 2-3 in how-to-play)
6. Fix 6 (~40 lines refactor in script.js + ~10 in how-to-play + 1-2 in SKILLS dict)

After each: verify in browser via Netlify preview or local `python -m http.server`.

## Verification

For each fix, after editing:
- Open `http://localhost:8000` in browser
- Verify visible change
- Use browser_console to inspect state if needed
- Test in-game if applicable (start battle, equip, use skill)

Final: build a test battle, force-trigger the relevant skills via `executeTech(name, false)` in console, verify outcomes.
