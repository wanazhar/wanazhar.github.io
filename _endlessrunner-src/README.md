# Endless Runner v5

A Vite + Three.js + GSAP 3-lane endless runner with Subway Surfers-style collectable tools and power-ups.

## v5 additions

- **Anime Mode on real art assets**: ten SVGs in `public/assets/anime/` (face, bow, skirt, emblem, bus decal, gate charm, and four power-up icons) are loaded through `src/assets/AssetRegistry.js`, replacing the procedural-geometry-only pass.
- **Compact HUD**: a brand chip, score chips, a power-up strip and a collapsible settings drawer replace the large always-open panels; the central overlay only appears on the start and game-over screens.
- **Accessibility pass**: higher-contrast panels and text in both themes, focus-visible outlines, larger touch targets, ARIA labels on the main controls, `aria-live` power-up announcements, and a `prefers-reduced-motion` fallback.
- Gameplay is unchanged from v4. The power-ups introduced in v3 still work the same way: **jetpack / sky flight** (lifts the runner into the sky and spawns elevated halo coin paths), **coin magnet** (pulls nearby halo coins into the player), **2x score multiplier** (doubles passive score gain and coin value), and **shield** (absorbs one collision and grants a short grace window).
- Keeps v2 improvements: simplified UI, adjustable swipe sensitivity, no bottom mobile arrows, and subfolder-friendly GitHub Pages build.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Deploy the contents of `dist/` to your GitHub Pages `/endlessrunner/` folder. `vite.config.js` still uses `base: './'`.

## Controls

Desktop: arrow keys, WASD, or Space.

Touch: swipe left/right/up/down. Swipe sensitivity can be adjusted in the HUD.
