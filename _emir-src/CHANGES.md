# Changes

Initial autonomous scaffold for **Emir's Car World**.

## Added

- Vanilla Vite + Three.js app shell.
- Rapier physics world with fixed timestep.
- Custom raycast vehicle controller.
- Runtime vehicle swapping through `VehicleManager`.
- Five vehicle profiles: Sedan, Hatchback, 4WD Off-roader, Truck, Excavator.
- GLB asset loader with decoupled chassis/wheel node support.
- Real placeholder `.glb` assets for all five vehicles.
- OSM/Overpass build-time script for central Kuala Lumpur voxel generation.
- Bundled playable Kuala Lumpur-inspired voxel sample dataset.
- Chunked `THREE.InstancedMesh` voxel renderer with custom frustum culling.
- Spatial hash and runtime Rapier collider streaming around active vehicle.
- High-contrast editorial minimalist UI with Garage, Vehicle Select, Map and touch controls.
- Browser-only Supabase integration with localStorage fallback.
- Supabase SQL schema with RLS policies.
- GitHub Pages deployment workflow for repository path `/emir/`.
