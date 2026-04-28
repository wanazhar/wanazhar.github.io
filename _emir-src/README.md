# Emir's Car World

Open-world voxel car simulator for `wanazhar.github.io/emir`, built with Vanilla Three.js, Rapier physics, and optional Supabase browser persistence.

## What is inside

- Vanilla Vite + Three.js renderer.
- Rapier custom raycast vehicle controller with five swappable profiles: Sedan, Hatchback, 4WD Off-roader, Heavy Truck, Excavator.
- Build-time OpenStreetMap/Overpass fetcher for central Kuala Lumpur.
- Voxel city rendered through `THREE.InstancedMesh` chunks.
- Spatial hash + runtime collider streaming so Rapier only simulates nearby voxel colliders.
- Decoupled GLB vehicle chassis/wheel loading with procedural fallback.
- Minimalist high-contrast garage UI.
- Browser-only Supabase client. No Prisma. No server code.
- GitHub Pages Actions workflow using official Pages actions.

## Quick start

```bash
npm install
npm run dev
```

## Generate Kuala Lumpur voxel data from OSM

The repo already includes a small generated sample at `public/data/kl-voxels.json` so the game loads immediately.

```bash
npm run generate:city
```

Tune it:

```bash
KL_RADIUS_METERS=950 KL_CELL_SIZE=4 KL_MAX_VOXELS=45000 npm run generate:city
```

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env`.
4. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

The app uses Supabase Auth magic links and RLS policies. If env vars are missing, garage saves fall back to `localStorage`.

## GitHub Pages deployment

The repo name should be `emir`. `vite.config.js` already contains `base: '/emir/'`.

Push to `main`; `.github/workflows/deploy.yml` builds the app and deploys `dist` to GitHub Pages. In GitHub repo settings, set **Pages → Build and deployment → Source → GitHub Actions**.

## Controls

| Action | Keyboard |
|---|---|
| Accelerate | W / Arrow Up |
| Brake / reverse | S / Arrow Down |
| Steer left | A / Arrow Left |
| Steer right | D / Arrow Right |
| Handbrake | Space |
| Reset car | R |
| Toggle UI | Tab |

Touch controls are included as an accessible bottom-right overlay.

## Asset naming convention

Each GLB vehicle should expose separate nodes named `chassis`, `wheel_fl`, `wheel_fr`, `wheel_rl`, `wheel_rr`. The included placeholder `.glb` files already follow this convention.
