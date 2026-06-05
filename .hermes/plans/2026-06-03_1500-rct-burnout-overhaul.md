# RCT Burnout + Body Integrity + Domain Overhaul — Implementation Plan

## New State Variables (add to both global state and startBattle state)

```
// Body integrity tracking
rctBurnoutTurns: 0,          // turns remaining in RCT burnout (0 = not in burnout)
rctMaterialRestored: 0,      // material points restored this "session" (resets when burnout triggers)
domainBurnoutTurns: 0,       // turns remaining in domain burnout (skills + RCT disabled)
blackFlashCount: 0,          // consecutive black flashes landed (resets on non-BF turn)
// Domain duration tracking (all domains now last max 20 turns)
domainDuration: 0,           // turns since current domain was activated
```

## Helper Functions to Add

### 1. countArmPawns(color)
Counts pawns on queen-side (A-D files = cols 0-3) and king-side (E-H files = cols 4-7).
Returns `{ leftArm: count, rightArm: count }` for the given color.

### 2. hasBothArms(color)
Returns true if countArmPawns shows >= 1 pawn on BOTH sides for that color.
(Only need 1 pawn per side to keep the arm functional.)

### 3. hasAtLeastOneArm(color)
Returns true if countArmPawns shows >= 1 pawn on ANY side.

### 4. hasHeart(color)
Returns true if the Queen of that color is on the board.

### 5. getHeartlessPenalty(color)
If no Queen on board for that color, all skill costs are ×2.
Applied in getTechCost().

### 6. isRctDisabled(color)
Returns true if rctBurnoutTurns > 0 OR domainBurnoutTurns > 0.

### 7. isDomainDisabled(color)
Returns true if domainBurnoutTurns > 0 OR not enough arms.

### 8. triggerRctBurnout(color)
Sets rctBurnoutTurns = 10, resets rctMaterialRestored = 0.
Logs dramatic message.

### 9. triggerDomainBurnout(color)
Sets domainBurnoutTurns = 10.
Logs dramatic message.

### 10. onBlackFlash(color)
Increments blackFlashCount.
If blackFlashCount >= 2 AND (rctBurnoutTurns > 0 OR domainBurnoutTurns > 0):
  - Clear both burnouts
  - Reset blackFlashCount
  - Log dramatic "RCT RECOVERED" message

## Changes to Existing Functions

### getTechCost(name, isAI)
- If the caster's Queen is missing (hasHeart check), cost ×2
- Apply this AFTER all other cost modifications

### executeTech for RCT
- Check isRctDisabled → if true, log "RCT is in cooldown! X turns remaining." and return
- After restoring a piece, add the piece's material value to rctMaterialRestored
  - Pawn = 1, Knight = 3, Bishop = 3, Rook = 5, Queen = 9
- If rctMaterialRestored >= 20: triggerRctBurnout
- Queen restoration: if Queen was captured and is being restored, set a flag `heartRestored = true` and start a 10-turn timer. After 10 turns, the Queen is "recovered" and the ×2 penalty ends. While the timer runs, the Queen is on the board but the penalty persists.

### executeTech for ALL domains
- Check isDomainDisabled → if true, log "Domain is in cooldown! X turns remaining." and return
- Check arms: if fewer than 2 arms (for non-Heian/non-Void domains), log "Cannot expand domain — both arms required!" and return
- Heian Shrine and Infinite Void: only need >= 1 arm
- No arms at all: no domain works

### Domain tick processing (the big block starting ~line 3133)
- For EVERY domain type, increment domainDuration
- If domainDuration >= 20: force collapse (call domain deactivation + triggerDomainBurnout)

### Fuga (both player and AI paths)
- Change from 5×5 (dr/dc -2..+2) to 6×6 (dr/dc -3..+3, but clamped to board 0-7)
- After firing: collapse the Heian domain + triggerDomainBurnout

### Black Flash (in the move processing ~line 2346)
- DRAMATIC upgrade: full-screen flash effect, big "BLACK FLASH" title
- Log: "⚡ BLACK FLASH! [Player/Enemy] lands a critical hit! [effect]"
- Call onBlackFlash(color) to handle burnout recovery
- Visual: add a CSS class `black-flash-active` to game-screen for 1.5s

### endTurn()
- Decrement rctBurnoutTurns if > 0
- Decrement domainBurnoutTurns if > 0
- Reset blackFlashCount if no BF landed this turn (track with a flag)

### AI Updates
- AI should NOT use RCT if rctBurnoutTurns > 0
- AI should NOT use domain if domainBurnoutTurns > 0 or insufficient arms
- AI should prefer RCT when material restored is low (< 15) to avoid burnout
- AI should be more cautious about domain timing (don't activate if < 5 turns of safety)

## How to Play Updates
- New section: "Body Integrity System" explaining the body-pieces mapping
- New section: "RCT Burnout" explaining the 20-point threshold and 10-turn cooldown
- New section: "Domain Burnout" explaining domain collapse cooldown
- New section: "Black Flash Recovery" explaining the 2× BF skip mechanic
- Update all domain descriptions with arm requirements
- Update RCT description
- Update Fuga description (6×6, collapses domain)

## What's New Page
- Index 30: list all the new mechanics

## CSS Updates
- Add `.black-flash-active` animation (screen flash effect)
- Add `.rct-burnout` visual for disabled RCT slot
- Add `.domain-burnout` visual for disabled domain slot
