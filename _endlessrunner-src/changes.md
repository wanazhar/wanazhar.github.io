# Endless Runner v5 Changes

## Overview

v5 focuses on three priorities:

1. **A real redesign for Anime Mode using dedicated art assets**
2. **A HUD / overlay system that stays out of the way during gameplay**
3. **Better accessibility, stronger contrast, and more touch-friendly UI behavior**

---

## 1) Anime Mode redesign with actual design assets

The previous anime pass leaned heavily on procedural geometry and color changes.

In v5, Anime Mode now includes **dedicated visual assets** stored in `public/assets/anime/` and applied directly in-game.

### Added art assets

- `anime-face.svg`
- `anime-bow.svg`
- `anime-skirt.svg`
- `anime-emblem.svg`
- `anime-bus-decal.svg`
- `anime-gate-charm.svg`
- `anime-power-magnet.svg`
- `anime-power-jet.svg`
- `anime-power-shield.svg`
- `anime-power-2x.svg`

### How they are used

- **Player redesign**
  - Anime runner now has a proper illustrated face decal instead of relying only on primitive eye meshes.
  - Added illustrated ribbon / bow elements.
  - Added skirt front art treatment.
  - Added chest brooch / emblem.
  - Added anime-styled jetpack embellishments.

- **Obstacle redesign**
  - Anime train now has a proper illustrated front decal.
  - Anime gate obstacle now has a hanging charm / sign asset.

- **Power-up redesign**
  - Anime power-ups now use dedicated icon artwork for:
    - magnet
    - 2x multiplier
    - jetpack
    - shield

### New asset loader utility

Added:

- `src/assets/AssetRegistry.js`

This centralizes texture loading and decal creation so future art asset swaps are easier.

---

## 2) Overlays no longer disrupt gameplay

The old UI layout had larger persistent panels that could feel intrusive while the run was active.

### What changed

- Reworked the HUD into a more compact layout:
  - top-left compact brand chip
  - top-right compact score chips
  - small power-up strip
  - bottom-right collapsible settings drawer

- **Gameplay overlay behavior improved**
  - Overlay is only shown when it is actually needed:
    - start screen
    - game over screen
  - During active gameplay, the central overlay is hidden entirely.

- **Settings moved into a collapsible drawer**
  - Theme switching
  - swipe threshold adjustment
  - score reset
  are all still available, but no longer sit as a large always-open panel on screen.

This keeps the running view cleaner and better for actual play.

---

## 3) Accessibility and contrast improvements

v5 improves readability and interaction quality across both themes.

### Contrast improvements

- Increased HUD panel opacity for better separation from the 3D scene.
- Strengthened text contrast in both Neon and Anime themes.
- Reworked accent usage so buttons remain readable.
- Improved muted text colors so helper text stays legible.

### Interaction / UX improvements

- Added **clear focus-visible outlines** for keyboard accessibility.
- Ensured key buttons meet better touch-target sizing.
- Added clearer labels and ARIA attributes on main controls.
- Added `aria-live` for dynamic power-up announcements.
- Reduced persistent UI clutter.
- Added `prefers-reduced-motion` CSS handling for users who prefer less motion.

### Result

The UI should now feel cleaner, more readable, and more accessible without losing the futuristic identity.

---

## Files added

- `public/assets/anime/anime-face.svg`
- `public/assets/anime/anime-bow.svg`
- `public/assets/anime/anime-skirt.svg`
- `public/assets/anime/anime-emblem.svg`
- `public/assets/anime/anime-bus-decal.svg`
- `public/assets/anime/anime-gate-charm.svg`
- `public/assets/anime/anime-power-magnet.svg`
- `public/assets/anime/anime-power-jet.svg`
- `public/assets/anime/anime-power-shield.svg`
- `public/assets/anime/anime-power-2x.svg`
- `src/assets/AssetRegistry.js`

---

## Major files updated

- `index.html`
- `src/styles.css`
- `src/ui/Hud.js`
- `src/player/CharacterController.js`
- `src/world/ObstaclePool.js`
- `src/world/PowerUpManager.js`
- `package.json`

---

## Gameplay note

Gameplay rules remain unchanged.

Still the same core loop:
- lane switching
- jumping
- rolling
- obstacle avoidance
- collecting coins / power-ups
- persistent high score storage

This version is primarily a **visual, UX, and accessibility refinement** on top of v4.
