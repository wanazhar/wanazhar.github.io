# Emir’s Car World

Open-world toy car simulator for `wanazhar.github.io/emir`, built with Vanilla Three.js, Rapier physics, and optional Supabase browser persistence.

## What is inside

- Vanilla Vite + Three.js renderer.
- Rapier custom raycast vehicle controller with five swappable profiles: Sedan, Hatchback, 4WD Off-roader, Heavy Truck, Excavator.
- Deterministic procedural city layout (`src/world/cityLayout.js`) — no map data files, no fetches.
- Blocky city rendered through `THREE.InstancedMesh` chunks.
- Spatial hash + runtime collider streaming so Rapier only simulates nearby voxel colliders.
- Vehicles assembled from code (`src/physics/VehicleModels.js`) — no GLB assets.
- Minimalist high-contrast garage UI.
- Browser-only Supabase client. No Prisma. No server code.
- Published by the monorepo workflow (repository-root `.github/workflows/pages.yml`), which builds this app into `../emir`.

## Quick start

```bash
npm install
npm run dev
```

## The city

The city is procedural. `src/world/cityLayout.js` generates the street grid,
block plots and landmark sites deterministically — same seed, same city — and
`src/world/VoxelCity.js` renders it as chunked instanced cubes. There is no
city data file and no generator script; the only build step is `npm run build`.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env`.
4. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

The app uses Supabase Auth magic links and RLS policies. If env vars are missing, garage saves fall back to `localStorage`.

## GitHub Pages deployment

`vite.config.js` builds with `base: '/emir/'` into `../emir`, the directory the
monorepo publishes. There is no workflow inside this project; the repository-root
`.github/workflows/pages.yml` installs, tests and builds it on every push to `main`.

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

## Adding a vehicle

Add a profile to `src/physics/VehicleProfiles.js` and a builder to
`src/physics/VehicleModels.js`. The garage swaps vehicles through
`game.setVehicle(id)`, which disposes the current model and rebuilds it from
the profile. There are no vehicle asset files.
