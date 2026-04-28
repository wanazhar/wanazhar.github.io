# Endless Runner v4 Changes

## Major additions

1. **Theme Switcher**
   - Added a live theme switcher with two modes:
     - **Neon Future** (original futuristic vibe retained)
     - **Anime Mode** (cute anime-inspired character, pastel world styling, themed obstacles and items)
   - Theme selection is persisted in `localStorage`.

2. **Anime Mode Visual Overhaul**
   - Added a new anime-styled playable runner with:
     - larger expressive head and face details
     - twin-tail hair
     - sailor / magical-girl inspired silhouette
     - pastel costume styling
   - Added anime-themed world dressing:
     - softer pastel roads and lighting
     - cute scenery / blossom-inspired props
     - themed obstacles and power-up visuals

3. **Improved Character State Readability**
   - Character visuals now differentiate better across actions:
     - **Running**: idle run-trail accent
     - **Jumping / hopping**: visible jump halo and more distinct airborne pose
     - **Flying with jetpack**: visible jetpack rig and flame thrusters
     - **Rolling**: more obvious low-profile silhouette

4. **Persistent High Score**
   - Added `localStorage`-backed **high score** tracking.
   - High score now stays saved between sessions / refreshes.

5. **Reset Scores Option**
   - Added a **Reset Scores** control in the HUD.
   - Resets stored high score and current displayed score counters back to zero.

6. **Touch Sensitivity Control**
   - Added a HUD slider to adjust **swipe threshold / sensitivity** for touch devices.
   - This helps tune left/right/up/down swipe behavior to user preference.

7. **HUD Refresh**
   - Updated HUD with:
     - score
     - coins
     - high score
     - theme controls
     - power-up feed
     - cleaner overlay copy
   - Kept the UI lightweight without bottom arrow navigation overlays.

## Files added

- `src/core/ThemePresets.js`
- `src/core/ThemeManager.js`
- `src/utils/ScoreStorage.js`
- `changes.md`

## Major files updated

- `index.html`
- `src/styles.css`
- `src/game/Game.js`
- `src/core/StateManager.js`
- `src/player/CharacterController.js`
- `src/world/WorldGenerator.js`
- `src/world/CoinManager.js`
- `src/world/ObstaclePool.js`
- `src/world/PowerUpManager.js`
- `package.json`

## Gameplay note

Core gameplay loop remains the same:
- 3-lane endless runner
- same lane switching, jumping, rolling, collecting and obstacle dodging
- added features are mostly visual, UX, and persistence improvements
