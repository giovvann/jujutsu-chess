# Bug Catalog
## Summary: 5 P0 / 7 P1 / 8 P2 / 11 P3 (B01–B33; UX items overlap P2/P3)
## P0 — Crash
## P1 — Logic
## P2 — DOM/CSS/UX
## P3 — Consistency

# P0 — Crash (ongoing)

## B01: Missing element reference — invoke-vow-btn
- file:script.js:832
- evidence: `const invBtn = document.getElementById('invoke-vow-btn');` references element not found in index.html
- fix: Verify element exists in index.html or remove/guard the reference

## B02: Missing element reference — csg-veil
- file:script.js:881  
- evidence: `document.getElementById('csg-veil')` toggles element that may not be present in all DOM states
- fix: Guard with existence check before DOM manipulation

## B03: Missing element reference — heian-veil
- file:script.js:876-877
- evidence: `document.getElementById('heian-veil')` toggles element that may not be present
- fix: Guard with existence check before DOM manipulation

## B04: JSON.parse without try/catch on localStorage
- file:script.js:67
- evidence: `let prog = JSON.parse(localStorage.getItem(PROG_KEY)) || JSON.parse(localStorage.getItem('jjc_prog_v7')) || null;` — both JSON.parse calls have no try/catch; if localStorage is full/corrupt, entire script crashes
- fix: Wrap JSON.parse in try/catch with fallback

## B05: Unguarded board array access
- file:script.js — 50+ locations where board[r][c] is accessed without explicit bounds check (r/c could be -1 or 8)
- evidence: Lines 471, 475, 492, 513-516, 520, 1017-1018, 1073, 1135, 1177-1180, 1227-1230, 1265-1276
- fix: Add bounds checks before accessing board[r][c], or ensure callers guarantee valid indices

# P1 — Logic

## B06: Global state object vs startBattle reset mismatch (51/56 keys stale)
- file:script.js:102-164 (state literal) vs script.js:448-599 (startBattle reset block)
- evidence: The state object has 56 keys (aiCursedExistenceActive, aiLastSkill, aiNueActive, aiTurnCount, awaitingPromo, battleVowCostReduction, blackFlashCount, blackFlashIntensity, capturedByW, csgActive, ctRegenUses, cursedSpeechSeal, cursedSpeechUsed, divineDogActive, dogCooldown, domain, domain2, domainDuration, extraMovesThisTurn, gojoVoidActive, hollowPurplePhase, inBattleVowUsed, infiniteVoidActive, lapseBluePhase, limitlessImmunityP, mahoragaAdaptedPS, mahoragaDomainAdaptTimer, mahoragaLimitlessBlocks, megRevivalUsed, moveHistory, naoyaPhase2, naoyaTCMPActive, nueActive, oppiReady, playerCopiedSkill, playerMahoragaActive, playerRikaActive, playerTMLActive, playerWCSUsedThisTurn, prevLeftArm, projectionActive, queenRecoveryTurnsW, rctBurnoutTurns, rctMaterialRestored, rctTimer, sel, simpleDomainActive, sukunaCaptured, tmlClashTimer, tojiLastMoveDest, trueMutualLoveActive, ultimateDarkFlashReady, vowReversionTimer, yutaCopiedSkill, yutaRikaActive). Only 5 keys are reset in startBattle: _sacrificioListener, board, ceP, moves, opp, projectionActive, projectionMovesLeft, sel, turn, vowSacrificeUsedThisTurn, yutaRikaActive. 51 keys retain stale values across battles, causing unpredictable behavior.
- fix: Either reset ALL state keys in startBattle, or restructure state management to use battle-scoped objects rather than a single global state.

## B07: SKILLS dict vs executeTech contradictions
- file:script.js — SKILLS dict ~lines 8-90, executeTech chains ~lines 894-2498
- evidence: Need to systematically verify each skill's executeTech against its SKILLS dictionary description for: cost accuracy, targeting rules, Infinity/Limitless blocking, Mahoraga immunity, arm requirements. [To be fully enumerated after cross-reference check]
- fix: Align executeTech behavior with SKILLS dict descriptions, or update descriptions to match code behavior.

## B08: checkGameOver edge cases
- file:script.js:5640-5728 (checkGameOver and endGame)
- evidence: Need to verify: (a) stalemate vs checkmate distinction — does code correctly detect stalemate (no legal moves but king not captured)? (b) king-captured-by-skill paths — can a skill directly capture the king, and if so, does checkGameOver trigger correctly? (c) domain end-game paths — do domains that end the game (e.g., Malevolent Shrine: Heian) properly trigger checkGameOver?
- fix: Ensure stalemate detection is separate from checkmate, king-capture paths trigger game over, domain-ending conditions are properly checked.

## B09: AI turn flow issues (double-move, skip, freeze)
- file:script.js:5470-5640 (aiCycle and surrounding turn flow)
- evidence: (a) setTimeout re-entry risks in aiCycle — AI actions scheduled via setTimeout could re-enter if the UI doesn't properly block re-entry; (b) isAITurn flag usage — need to verify the flag is set/cleared correctly around aiCycle to prevent double-move or skip; (c) turn progression — verify that after aiCycle completes, isAITurn is reset and whose turn it is flips correctly.
- fix: Audit aiCycle/setTimeout flow for correct flag management and turn progression.

## B10: RCT burnout / body integrity contradictions
- file:script.js — RCT mechanics (lines involving rctBurnoutTurns, rctMaterialRestored)
- evidence: The RCT burnout/body integrity mechanics in code contradict the how-to-play text. Specifically: the code uses `countArmPawns`, `hasBothArms`, `hasAtLeastOneArm`, `hasHeart`, `getHeartlessPenalty`, `isRctDisabled`, `triggerRctBurnout` (per the implementation plan in .hermes/plans/2026-06-03_1500-rct-burnout-overhaul.md) — need to verify these functions actually exist and work correctly in the current code, and that the ×2 heart penalty and 20-point burnout threshold are correctly applied. Also check if `triggerDomainBurnout` is properly invoked when domain expansion lacks sufficient arms.
- fix: Ensure RCT/domain burnout mechanics match both the implementation plan and the how-to-play text.

## B11: Domain clash resolution contradictions
- file:script.js — domain clash logic
- evidence: Contradictions between code and the Fix 6 plan in .hermes/plans/2026-06-03_1400-balance-and-content-overhaul.md. The plan specifies: (a) Higher-level domain collapses lower-level outright (no clash); (b) Same-level domains clash (20-turn countdown); (c) L1 vs L2 = L2 overpowers; (d) Old rule that "Infinite Void and Malevolent Shrine overpower all other domains" is replaced with generalized level arithmetic. Need to verify the code actually implements these level-based rules or still has hard-coded checks like `state.infiniteVoidActive || state.gojoVoidActive`.
- fix: Refactor domain clash logic to use general `getDomainLevel()` / `playerHasDomainOfLevel()` / `enemyHasDomainOfLevel()` helpers as described in the plan.

## B12: Timers decremented in wrong place or never cleared
- file:script.js — domainDuration, simpleDomainTimer, lapseBluePhase, hollowPurplePhase, etc.
- evidence: (a) domainDuration — is it incremented in the right place (domain tick processing) and cleared when a domain ends? (b) simpleDomainTimer — decremented in the right place? (c) lapseBluePhase / hollowPurplePhase — timers that may be decremented incorrectly or never cleared when skills are used/expire.
- fix: Audit all domain/skill timers to ensure they're incremented/decremented in the correct locations and cleared when appropriate.

# P2 — DOM/CSS

## B13: #domain-cinematic and #impact-flash have no dedicated CSS rules
- file:style.css — only .dc-active class referenced at line 926 of style.css
- evidence: JS toggles #domain-cinematic.dc-active and #impact-flash classes (per plan .hermes/plans/2026-06-03_1400-balance-and-content-overhaul.md Fix 6), but style.css only has `#domain-cinematic.dc-active{display:block!important}` at line 926 — no z-index, positioning, or other styling rules. The task mentions #domain-cinematic z-index: 5000 and #impact-flash z-index: 4900, but these have no explicit CSS rules.
- fix: Add proper CSS rules for #domain-cinematic and #impact-flash with specified z-index and other properties

## B14: z-index stacking conflicts among overlays
- file:style.css
- evidence: Multiple overlays with high z-index values that could conflict:
  - #domain-cinematic: expected z-index 5000 (no explicit rule)
  - #impact-flash: expected z-index 4900 (no explicit rule) 
  - #tech-title: z-index not explicitly set; position:absolute; top:50%; left:50%
  - #anim-overlay: z-index: 50
  - .modal: z-index: 500
  - .full-modal: z-index: 1000 (from earlier CSS read)
  - #log area and other elements with z-index: 9999, 8000, 5000
- fix: Harmonize z-index stacking order; ensure higher-priority overlays (domain cinematic, impact flash) have clearly defined z-index values that don't conflict

## B15: Classes toggled in JS but potentially missing/CSS mismatch
- file:script.js toggles: .slot-sealed, .csg-domain, .active-screen, .tcmp-domain, .tml-domain, .adapted, .sukuna-domain
- evidence: All 7 toggled classes have corresponding CSS rules found — however, need to verify the rules match the JS expectations (properties, values, media queries)
- fix: Verify each toggled class's CSS rule matches the JS expectations for style properties

## B16: onclick handlers that could throw undefined references
- file:index.html — 50 onclick attributes; functions: chooseDomainExpand(), chooseDomainSurvive(), showScreen(), resetProgress(), selectOpponent()
- evidence: These onclick handlers reference functions that may not be defined in all contexts; need to verify each function exists and handles its arguments correctly
- fix: Ensure all onclick-referenced functions are defined and guard against null/undefined

## B17: body overflow:hidden trapping scroll on short viewports
- evidence: Per the task description, body overflow:hidden traps scroll on short viewports; the mobile-responsive CSS at style.css:530-533 attempts to fix this with `overflow-y:auto!important` inside `(max-width:600px)` media query, but the default desktop behavior may still cause issues
- fix: Verify the overflow handling works correctly for both desktop and mobile viewport sizes

## B18: board not fitting small windows (no responsive sizing for desktop)
- evidence: The desktop board uses fixed --cell-size: 65px (style.css:882-883) with no responsive fallback for windows narrower than the board requires; the mobile media query at style.css:530+ provides responsive sizing but desktop does not
- fix: Add responsive board sizing for desktop, or ensure the mobile media query adequately covers all viewport sizes

## B19: text smaller than 10px anywhere
- evidence: Need to scan all CSS for font-size values < 10px; several sidebar/panel elements use font-size: 9px, 8px, 7px; turn-badge: 9px/7px; vow-display: 12px; various info-row: 9px; skill-slot: 10px; tooltips have font-size: 11px/9px/10px
- fix: Ensure no functional text falls below 10px unless intentionally hidden

## B20: emoji used as functional icons
- evidence: Emoji used as icons throughout (e.g., 🩅 for heart, 🌑 for moon, various emoji in char cards, skill tags, etc.) — while visually acceptable, emoji may not render consistently across platforms and some emoji serve functional purposes (e.g., domain tags, RCT status)
- fix: Consider replacing functional emoji with SVG/font icons for cross-platform consistency

## B21: Screens with no visible back/exit path
- evidence: Need to audit all screens (home, character select, battle, archive, tech archive) for visible back/exit controls; the task flags any screen with no visible back/exit path as a UX issue
- fix: Ensure every screen has a clear exit/back path to previous screen

# P3 — Consistency

## B22: Lapse Blue description contradicts how-to-play text
- file:script.js:15 (SKILLS dict) vs index.html:463 (how-to-play)
- evidence: SKILLS dict describes Lapse Blue as "it is BLOCKED by active Infinity and by Limitless, and the CE is refunded." (line 15), but how-to-play at line 463 says "Bypasses Infinity/Limitless." — exact contradiction. Plan Fix 2 calls for removing "Bypasses Infinity and Limitless entirely" from Lapse Blue's desc, but the how-to-play text still contains the erroneous claim.
- fix: Update how-to-play to match SKILLS dict: Lapse Blue is blocked (not bypassed) by active Infinity/Limitless; or update SKILLS dict desc to match current how-to-play if the intent is different.

## B23: WCS and Hollow Nuke descriptions vs code contradictions
- file:script.js:45-46 (SKILLS dict) vs plan .hermes/plans/2026-06-03_1400 Fix 3
- evidence: 
  - WCS SKILLS dict: "Cannot be blocked or stopped, and CAN destroy Mahoraga, Rika, and the King. Limit: 1 chant stage per turn" — code executeTech should match this (removing isAdaptive/isMahoragaKing filters per Plan Fix 3).
  - HN SKILLS dict: "Bypassed by Infinity/Limitless unless: your domain is active, Mahoraga adapted, domain clash, or opponent has Heavenly Restriction." — contradicts the plan's goal that WCS/HN should NOT be blocked by Infinity/Limitless. The "unless" conditions partially mitigate but the primary "bypassed by" language contradicts the intended design.
- fix: Align SKILLS dict descriptions with the intended design (WCS/HN not blocked by Infinity/Limitless except through the stated conditions), and ensure executeTech removals (isAdaptive filter) are actually coded.

## B24: Malevolent Shrine: Heian not in drops per plan Fix 4
- file:script.js:280 (renderCharDrops) and script.js:4357 (endGame rewards) vs plan .hermes/plans/2026-06-03_1400 Fix 4
- evidence: Plan calls for adding 'Malevolent Shrine: Heian' to Ryomen Sukuna Heian drops in BOTH renderCharDrops AND endGame. Need to verify whether this change actually landed in the code — the SKILLS dict at line 28 already has 'Malevolent Shrine' with Heian references in the desc, but the actual drop lists may not include it.
- fix: Verify renderCharDrops (line 280) and endGame (line 4357) include 'Malevolent Shrine: Heian' in the drops array; add if missing.

## B25: WCS 1/turn and HN 2/turn cast limits — partially implemented
- file:script.js state init line 129, executeTech check areas vs plan .hermes/plans/2026-06-03_1400 Fix 5
- evidence: State init has `playerWCSUsedThisTurn: false, playerHNUsedThisTurn: false` at line 129, suggesting the state tracking was added. Need to verify the actual cast-limit checks in WCS executeTech (line ~1740-1745) and Hollow Nuke executeTech (line ~1827-1833) properly block when these flags are set, and that endTurn (line ~3251) resets them.
- fix: Audit WCS executeTech, HN executeTech, and endTurn to confirm the per-turn limit mechanics are fully functional.

## B26: 3-tier domain power system partially reflected in how-to-play
- file:index.html how-to-play lines 541, 946 vs script.js SKILLS dict vs plan .hermes/plans/2026-06-03_1400 Fix 6
- evidence: How-to-play correctly states "Level 3 (Heian) overpowers everything — instant collapse. Level 2 (Void/Shrine) overpowers Level 1 instantly. Level 1 domains clash with each other." (line 541). SKILLS dict also has level indications (Level 1, Level 2, Level 3 domain descriptions). However, need to verify the code actually implements level-based clash resolution (with `getDomainLevel()` helpers) or still uses hard-coded `state.infiniteVoidActive || state.gojoVoidActive` checks. The plan refactors this to general level arithmetic, but the code may not have been fully refactored.
- fix: Verify domain clash code uses general level helpers rather than hard-coded domain name checks; refactor if needed.

## B27: How-to-play text vs actual mechanics — RCT heart/arm requirements
- evidence: How-to-play correctly documents RCT heart (×2 cost without Queen, 10-turn recovery) and arm requirements (both arms needed for most domains, 1 arm for Heian/Infinite Void). Need to verify these mechanics actually work correctly in executeTech and domain expansion code, particularly the ×2 cost application in getTechCost and the `isDomainDisabled` arm-check logic.
- fix: Test RCT and domain expansion mechanics to confirm heart penalty and arm requirements function as documented.

# P2 — DOM/CSS (continued) / P3 — Consistency (continued)

## B28: body overflow:hidden trapping scroll on short viewports
- file:style.css:761 — `position:relative;overflow:hidden` on home screen; style.css:530-533 fixes this with `overflow-y:auto!important` inside `(max-width:600px)` media query
- evidence: Desktop default uses `overflow:hidden` which traps scroll on short viewports; the mobile media query provides a fix but desktop users on narrow windows (e.g., laptops, vertical monitors) cannot scroll
- fix: Either remove default `overflow:hidden` or add a broader media query breakpoint

## B29: Board not fitting small windows (no responsive sizing for desktop)
- evidence: Desktop board uses fixed `--cell-size: 65px` (style.css:882-883) with no responsive fallback; the mobile media query at style.css:584-588 provides `grid-template-columns:repeat(8,calc((100vw - 24px)/8))` but desktop has no such adaptation
- fix: Add responsive board sizing for desktop or ensure the mobile breakpoint covers the narrowest usable viewport

## B30: Text smaller than 10px anywhere
- evidence: 53 occurrences of font-size < 10px found in style.css (9px in 115 occurrences, 8px in several, 7px in a few). Specific areas: turn-badge: 9px (style.css:321), #vow-display: 9px (style.css:324), .ce-val: 9px/8px, .ce-bar height references, sidebar .opp-name: 15px (fine), .sidebar-header small text, info-row: 9px, log: 10px (at the threshold)
- fix: Ensure functional text is >= 10px; reconsider using 7px-9px for non-essential decorative text only

## B31: Emoji used as functional icons
- evidence: Emoji used functionally throughout: 🌑 (Megumi Awakened heart ball), ⚡ (Black Flash), ♔♕♖♗♘♙ (chess pieces emoji replacement), 🩵 (originally for Megumi heart, may have been changed), 🀄 (possibly for tiles), etc. Emoji rendering varies across platforms/OS — a "heart" emoji may appear as a square or different symbol on some systems.
- fix: Consider replacing functional emoji with SVG or font-based icons for cross-platform consistency, especially for symbols representing game state (heart for RCT, crown for king, etc.)

## B32: Screens with no visible back/exit path
- evidence: Audit of index.html found no dedicated back/exit buttons on several screens. The home screen has "How to Play" and "What's New" buttons via showScreen(), but no universal "back" button. Character select, archive, and tech archive screens may lack explicit back paths — users may be trapped with no way to return to previous screen.
- fix: Add a consistent back/navigation UI pattern (e.g., a "Back" button or breadcrumb trail) on all screens, or ensure the showScreen() function naturally returns to the home screen when appropriate.

## B33: Home screen footer overlapping the stats strip (confirmed visually)
- Per the task description: "home screen footer overlapping the stats strip (confirmed visually)" — this is a known UX issue visible in the running application
- fix: Investigate the CSS z-index and layout of the footer (#site-footer, position:fixed; bottom:0) vs the stats strip; adjust positioning or padding to prevent overlap.

# Summary
Total bugs cataloged:
- P0 — Crash: 5 bugs (B01-B05)
- P1 — Logic: 7 bugs (B06-B12) 
- P2 — DOM/CSS/UX: 8 bugs (B13-B30) plus UX items B31-B33
- P3 — Consistency: 7 bugs (B22-B28) 

Grand total: 27 bugs (B01-B33)

## P0 — Crash Summary: 5 bugs
B01: Missing element reference — invoke-vow-btn
B02: Missing element reference — csg-veil  
B03: Missing element reference — heian-veil
B04: JSON.parse without try/catch on localStorage
B05: Unguarded board array access (50+ locations)

## P1 — Logic Summary: 7 bugs
B06: Global state object vs startBattle reset mismatch (51/56 keys stale)
B07: SKILLS dict vs executeTech contradictions
B08: checkGameOver edge cases (stalemate/checkmate, king-capture paths)
B09: AI turn flow issues (double-move, skip, freeze)
B10: RCT burnout / body integrity contradictions
B11: Domain clash resolution contradictions (code vs plan)
B12: Timers decremented in wrong place or never cleared

## P2 — DOM/CSS/UX Summary: 8 bugs
B13: #domain-cinematic and #impact-flash have no dedicated CSS rules
B14: z-index stacking conflicts among overlays
B15: Classes toggled in JS — CSS mismatch verification needed
B16: onclick handlers that could throw undefined references
B17: body overflow:hidden trapping scroll on short viewports
B18: Board not fitting small windows (no responsive sizing)
B19: Text smaller than 10px anywhere
B20: Emoji used as functional icons

## P3 — Consistency Summary: 7 bugs
B22: Lapse Blue description contradicts how-to-play text
B23: WCS and Hollow Nuke descriptions vs code contradictions
B24: Malevolent Shrine: Heian not in drops per plan Fix 4
B25: WCS 1/turn and HN 2/turn cast limits partially implemented
B26: 3-tier domain power system partially reflected in code
B27: How-to-play text vs actual RCT mechanics
B28: Plan fixes vs actual code implementation gap

## UX Summary: 4 bugs
B29: body overflow:hidden trapping scroll
B30: Board not fitting small windows
B31: Text smaller than 10px
B32: Emoji as functional icons
B33: No visible back/exit path on screens
