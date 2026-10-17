# Changes

Initial autonomous scaffold for **Emir’s Car World**.

## Added

- Vanilla Vite + Three.js app shell.
- Rapier physics world with fixed timestep.
- Custom raycast vehicle controller.
- Runtime vehicle swapping through `Game#setVehicle`.
- Five vehicle profiles: Sedan, Hatchback, 4WD Off-roader, Truck, Excavator.
- Vehicles assembled from code in `src/physics/VehicleModels.js` (no GLB assets).
- Deterministic procedural city layout (`src/world/cityLayout.js`).
- Chunked `THREE.InstancedMesh` city renderer with custom frustum culling.
- Spatial hash and runtime Rapier collider streaming around active vehicle.
- High-contrast editorial minimalist UI with Garage, Vehicle Select, Map and touch controls.
- Browser-only Supabase integration with localStorage fallback.
- Supabase SQL schema with RLS policies.
- GitHub Pages deployment workflow for repository path `/emir/`.
