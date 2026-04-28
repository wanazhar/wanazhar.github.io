# Emir’s Car World Architecture

## Rendering

The city renderer builds chunked `THREE.InstancedMesh` groups from `public/data/city-blocks.json`.

- One instanced mesh per voxel type per chunk.
- Chunks are manually frustum-culled every frame.
- Renderer pixel ratio is capped for legacy hardware.
- The world is intentionally made from simple cube geometry to keep draw calls predictable.

## Physics

Rapier runs at a fixed 60Hz timestep. The vehicle controller is a custom raycast suspension system:

- Dynamic chassis rigid body.
- Four independent wheel rays.
- Suspension impulse from compression and damping.
- Engine impulse applied at driven wheels.
- Lateral tire friction impulse at contact points.
- Runtime vehicle profile swapping through `VehicleManager.spawn(profileId)`.

## Vehicle profiles

Profiles live in `src/physics/VehicleProfiles.js` and include mass, dimensions, center of mass, wheel radius, suspension, friction, torque, brake force and steering limits.

The excavator is tuned with extremely high mass, high torque, high damping and an acceleration limiter, making it heavy and slow rather than sports-car fast.

## City Sample Generation

`scripts/fetch-city-sample.js` calls Overpass API for the bundled sample area and converts buildings, roads and parks into a grid of city blocks.

The bundled `public/data/city-blocks.json` is a playable sample. Run `npm run generate:city` to refresh it from live map data.

## Collision streaming

`WorldColliderManager` queries a spatial hash around the active vehicle and only creates fixed Rapier colliders inside the streaming radius. Colliders outside the radius are destroyed.

## Supabase

No server is used. `src/services/supabaseClient.js` initializes the browser Supabase client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

`supabase/schema.sql` creates an RLS-protected `garage_state` table keyed by `auth.uid()`. If Supabase is not configured, the game saves garage state in localStorage.
