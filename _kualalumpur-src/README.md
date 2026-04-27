# Kuala Lumpur

A browser game prototype built with **Vite + Three.js**. The scene is a Minecraft-style voxel version of Kuala Lumpur generated entirely from code. No textures, no image assets, no models.

## Features

- Explorable third-person voxel character
- Orbit camera controls with zoom
- Tasteful touch navigation overlay for phones/tablets
  - analog left thumb-stick for movement
  - jump, sprint, focus-camera, and train toggle buttons
- Large terraced terrain generated from deterministic code noise
- Code-built landmarks:
  - Petronas Twin Towers with skybridge
  - Merdeka 118
  - KL Tower
  - Sultan Abdul Samad / Merdeka Square area
  - Masjid Negara inspired mosque
  - Tugu Negara inspired monument
  - Lake Gardens inspired park
- Procedural skyscraper district
- Roads, plazas, parks, lake, trees, public transport stations
- Elevated rail / monorail inspired lines with animated voxel trains
- Browser performance optimizations:
  - static city made with `THREE.InstancedMesh`
  - in-memory chunk groups for future static map streaming
  - grouped material palette to reduce draw calls
  - adaptive pixel ratio based on frame cost
  - limited dynamic lighting
  - render loop pauses when idle
  - train animation auto-pauses when idle unless toggled on

## Controls

| Action | Control |
|---|---|
| Move | `WASD` or arrow keys |
| Touch move | left thumb-stick overlay |
| Sprint | `Shift`, or hold `Sprint` on touch overlay |
| Jump | `Space`, or tap/hold `Jump` on touch overlay |
| Orbit camera | mouse / touch drag outside the navigation overlay |
| Zoom | mouse wheel / pinch |
| Refocus camera on player | `F`, or `Focus` on touch overlay |
| Toggle continuous train motion | `P`, or `Trains` on touch overlay |


## Touchscreen behavior

On phones, tablets, and narrow screens, the game now shows a lightweight navigation overlay:

- Left side: analog thumb-stick for walking in any direction relative to the camera.
- Right side: action buttons for Sprint, Jump, Focus, and Trains.
- The rest of the canvas remains available for touch orbit / pinch camera controls.
- The overlay uses `pointer-events` carefully so it does not block normal camera orbiting outside the controls.

## Local setup

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

The built static site will be created in:

```text
dist/
```

## Measurement and budgets

The voxel world has guardrail scripts so large detail passes do not accidentally ship an oversized static scene:

```bash
npm run measure:world
npm run validate:budget
```

`measure:world` builds the scene in Node and reports authored instance totals, material counts, section counts, chunk count, and instanced mesh count. `validate:budget` enforces the Phase 0/1 prototype ceilings before any 2M-detail generation work begins.

Current runtime detail remains bundled in the Vite app for GitHub Pages compatibility. The instancer now releases its CPU-side queued instance arrays after `finalize()` and renders the static world as shared-material chunk groups, which provides the visibility foundation for later external chunk files without changing the current map APIs.


## 5M generated detail layer

The map now includes a deterministic high-detail layer targeting **5,000,000 authored regional detail instances** on top of the bundled base world. Runtime rendering keeps the combined base + generated detail visibility target at **950,000 visible instances** across desktop, tablet, and mobile tiers. The generated detail is distributed across 225 static/procedural chunks with higher density around KLCC, Bukit Bintang/TRX, Merdeka/Chinatown, PJ, Subang/Sunway, Shah Alam, Klang, Putrajaya, KLIA/Sepang, Batu Caves/Gombak, Genting foothills, and Kuala Selangor.

This is deliberately a chunked/generated layer rather than 5M simultaneously visible cubes. The 5M authored target is measured by `npm run measure:world`; the shipped GitHub Pages manifest is exported to `public/chunks/metadata.json` by `npm run export:chunks`.

## Deploy to `wanazhar.github.io/kualalumpur`

This project uses `base: './'` in `vite.config.js`, so the built files can be copied into a subfolder like `/kualalumpur` without changing asset paths.

From this project folder:

```bash
npm install
npm run build
```

Then copy the **contents** of `dist/` into the `kualalumpur` folder of your `wanazhar.github.io` repository:

```bash
# example folder layout:
# ~/projects/voxel-kuala-lumpur
# ~/projects/wanazhar.github.io

mkdir -p ~/projects/wanazhar.github.io/kualalumpur
rm -rf ~/projects/wanazhar.github.io/kualalumpur/*
cp -R dist/* ~/projects/wanazhar.github.io/kualalumpur/

cd ~/projects/wanazhar.github.io
git add kualalumpur
git commit -m "Add Kuala Lumpur prototype"
git push
```

After GitHub Pages updates, open:

```text
https://wanazhar.github.io/kualalumpur/
```

## Optional: one-command deploy helper

Edit `scripts/deploy-to-wanazhar-pages.sh` if your local `wanazhar.github.io` repo is somewhere else, then run:

```bash
bash scripts/deploy-to-wanazhar-pages.sh
```

## Project structure

```text
voxel-kuala-lumpur/
├─ index.html
├─ package.json
├─ vite.config.js
├─ scripts/
│  └─ deploy-to-wanazhar-pages.sh
└─ src/
   ├─ main.js
   ├─ style.css
   ├─ characters/
   │  └─ PlayerController.js
   ├─ render/
   │  └─ AdaptiveRenderer.js
   ├─ transport/
   │  └─ TrainSystem.js
   ├─ ui/
   │  └─ hud.js
   ├─ utils/
   │  └─ noise.js
   └─ world/
      ├─ VoxelInstancer.js
      └─ createKualaLumpurWorld.js
```

## Notes

This is a prototype, not a perfect geographic reconstruction. The goal is to give you a fast, stylized, code-generated voxel KL scene that can be expanded into a proper browser game later.
