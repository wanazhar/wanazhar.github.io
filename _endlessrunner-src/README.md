# Endless Runner v3

A Vite + Three.js + GSAP 3-lane endless runner prototype with Subway Surfers-style collectable tools and power-ups.

## v3 additions

- **Jetpack / sky flight**: collecting the jetpack lifts the runner into the sky with GSAP and spawns elevated halo coin paths.
- **Coin magnet**: pulls nearby halo coins into the player while active.
- **2x score multiplier**: doubles passive score gain and coin score value for the active duration.
- **Shield**: absorbs one collision and grants a short grace window.
- **Power-up HUD**: active timers show at the top of the screen.
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
