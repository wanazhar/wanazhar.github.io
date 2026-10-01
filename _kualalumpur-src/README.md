# Kuala Lumpur

A browser game prototype built with **Vite + Three.js**. The scene is a Minecraft-style voxel version of Kuala Lumpur generated entirely from code. No textures, no image assets, no models.

## Features

- Explorable third-person voxel character with building collision and wall sliding
- Orbit camera controls with zoom
- Day / golden hour / sunset / night / rain / thunderstorm lighting modes
- Tasteful touch navigation overlay for phones/tablets
  - analog left thumb-stick for movement
  - jump, sprint, focus-camera, and train toggle buttons
- Large terraced hills outside a flat, paved city plateau
- Code-built landmarks:
  - Petronas Twin Towers with skybridge
  - Merdeka 118
  - KL Tower
  - Sultan Abdul Samad / Merdeka Square area
  - Masjid Negara inspired mosque
  - Tugu Negara inspired monument
  - Lake Gardens inspired park
- Street-grid downtown with a tower cluster, mid-rise blocks, shophouses and kampung houses
- Sidewalks, lane markings, traffic lights, parks, plazas and parking blocks
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

## City layout: street grid, blocks, and props

The city is laid out on a deterministic **street grid** instead of scattered random buildings:

- `src/world/layout/streetGrid.js` — grid math: 24-unit block pitch, 6-unit streets, sidewalk bands, district rings around the KLCC core.
- `src/world/layout/buildings.js` — building kit: setback towers, mid-rise blocks, shophouse rows with awnings, kampung houses, parks, roof clutter, plus collision volumes.
- `src/world/layout/cityBlocks.js` — classifies every block (tower / mid-rise / low-rise / shophouse / kampung / park / plaza / parking / reserved landmark plot) and fills it with lots that respect setbacks and each other.
- `src/world/layout/collision.js` — building footprint map used by the player for wall collision and sliding.

Landmarks get reserved plots so nothing is built on top of them, transit lines run along street lines, and the ground itself is zoned: asphalt on streets, concrete/paving in built blocks, grass in parks, and natural terrain outside the city.

Street furniture (lamps, trees, benches, bins, parked cars, signs, planters, hydrants) is generated as a separate, grid-aware detail layer (`src/world/detail/`) that places props on the sidewalk bands and skips building footprints.

## Measurement and budgets

The voxel world has guardrail scripts so detail passes do not accidentally ship an oversized scene:

```bash
npm run measure:world
npm run validate:budget
```

`measure:world` builds the scene in Node and reports authored instance totals, material counts, section counts, chunk count, prop totals, and instanced mesh count. `validate:budget` enforces the authored/mesh/chunk/visible ceilings before export.

Current numbers: ~284k authored base instances (mostly terrain), ~4.2k authored street props, ~460 instanced meshes, 16 base chunks at 128 units, and a 350k visible-instance cap per device tier.

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
