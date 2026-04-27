# Kuala Lumpur 2M–5M Static Chunked Map Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Evolve `/kualalumpur/` into a high-detail, geographically accurate Greater KL interactive map with **2M authored details as the realistic milestone** and **5M authored details as a stretch target**, while still deploying fully on GitHub Pages as static files.

**Architecture:** Do not render 2M–5M cubes as one always-loaded scene. Build a static geospatial tile pipeline: source geographic data → projected world coordinates → chunk files → runtime chunk loader → nearby high-detail chunks + distant low-detail chunks. Use static binary chunk assets served by GitHub Pages, with mobile performance tiers and hard budgets.

**Tech Stack:** Vite, Three.js, JavaScript modules, static GitHub Pages, generated JSON/binary chunk assets, optional build-time Node scripts, optional MapLibre/OpenStreetMap/Overpass-style data ingestion during build only.

---

## Reality Check

Current baseline:

- Current scene: `306,103` instances
- Meshes: `53` material-batched instanced meshes
- Deployment: GitHub Pages static app under `/kualalumpur/`
- Current map coordinate system now supports real lat/lon projection for 106 KL-region landmarks and a schematic Malaysia gateway strip.

Raw cost estimates if rendered all at once:

| Authored/rendered instances | GPU instance matrix memory | Approx box vertex transforms/frame | CPU pre-finalize object data estimate |
|---:|---:|---:|---:|
| 2M | 122.1 MB | 48.0M | 183–305 MB |
| 5M | 305.2 MB | 120.0M | 458–763 MB |

Conclusion:

- **2M is achievable** if chunked, budgeted, and not all high-detail chunks are visible at once.
- **5M is possible as authored static detail**, but only if most of it is unloaded or rendered as low-detail summaries most of the time.
- **5M simultaneously rendered as individual cube instances is not a sensible target for mobile/iPad.** It will likely punish load time, memory, battery, and thermal performance.

The correct target is:

- **2M authored details, 300k–700k visible/rendered at a time** depending on device.
- **5M authored details, 350k–900k visible/rendered at a time** with aggressive chunking/LOD.

---

## Strategic Direction

We need to stop thinking of the KL world as one scene and treat it like a static map engine.

### Four layers

1. **Core shell layer**
   - App UI, player, camera, minimap, search, route panels.
   - Always bundled.

2. **Base map layer**
   - Low-detail terrain, major roads, rivers, district labels, landmarks.
   - Loads immediately.
   - Must stay lightweight.

3. **Chunked detail layer**
   - Buildings, roads, smaller parks, local shop clusters, landmark surroundings.
   - Loaded/unloaded around player/camera.
   - Stored as static chunk files.

4. **High-value set-piece layer**
   - Petronas/KLCC, Merdeka 118, Batu Caves, Putrajaya, Shah Alam Mosque, Sunway, KLIA, etc.
   - Loaded on demand or kept as medium-detail impostors when distant.

---

## Geographic Scope

Use the already-added coordinate envelope as the main playable region:

- West: Kuala Selangor / Klang / Port Klang / Morib
- East: Ampang / Ulu Klang / Genting / Janda Baik edge
- North: Rawang / Kanching / Genting
- South: Putrajaya / Cyberjaya / KLIA / Sepang / Broga
- Core: KLCC, Bukit Bintang, Merdeka, Chinatown, Brickfields, Bangsar, Mont Kiara, PJ, Subang, Shah Alam

Do **not** try to include Penang/Langkawi/Sabah/Perhentian proportionally in this same physical map. Keep Malaysia Highlights schematic or build a separate Malaysia-scale page later.

---

## Data Accuracy Plan

### Source priority

1. **Known exact landmarks**
   - Keep curated `lat/lon` in `_kualalumpur-src/src/data/tourismContent.js`.
   - Add `source`, `confidence`, and optional `osmId/wikidataId` later.

2. **OpenStreetMap-derived layers**
   - Buildings footprints where available.
   - Road classes: motorway/trunk/primary/secondary/residential.
   - Rail/transit corridors.
   - Rivers/water bodies/parks.
   - District/suburb/place labels.

3. **Procedural inferred detail**
   - Use only where data is missing.
   - Must be tied to real district/category footprints, not random uniform scatter.

4. **Hand-authored set pieces**
   - For landmarks where recognizable voxel silhouettes matter more than raw OSM footprints.

### Build-time only network/data use

GitHub Pages cannot run a backend, so any OSM/geo data ingestion must happen before build:

- `scripts/geo/fetch-osm-data.js` or Python equivalent
- Store normalized local static data under `_kualalumpur-src/src/data/geo/` or generated chunks under `_kualalumpur-src/public/chunks/`
- Build output copies chunks into `/kualalumpur/chunks/`

---

## Target Budgets

### Milestone A: 500k–750k visible, architecture proof

Purpose: validate chunking before making giant data.

- Authored: 750k–1M
- Visible desktop: 450k–650k
- Visible mobile: 250k–400k
- Chunk size: 48x48 or 64x64 world units
- Chunk file format: JSON first, binary later if needed

### Milestone B: 2M authored realistic Greater KL

Purpose: first serious realistic map target.

- Authored: 2M
- Visible desktop: 500k–800k
- Visible mobile/iPad: 300k–500k
- High-detail radius: 1–2 chunks around player/camera
- Medium-detail radius: 2–4 chunks
- Low-detail beyond that
- Static chunk files: likely 100–300 files

### Milestone C: 5M authored stretch

Purpose: dense district-level detail, not all visible.

- Authored: 5M
- Visible desktop: 600k–1M max
- Visible mobile/iPad: 350k–550k max
- Must use binary chunks or very compact JSON
- Must use LOD/impostor chunks
- Must include chunk cache eviction
- Must have automated performance gates

---

## Proposed Chunk Format

### Chunk metadata

Create:

`_kualalumpur-src/public/chunks/metadata.json`

Fields:

```json
{
  "version": 1,
  "projection": {
    "minLat": 2.72,
    "maxLat": 3.45,
    "minLon": 101.23,
    "maxLon": 102.02,
    "minX": -214,
    "maxX": 214,
    "minZ": -214,
    "maxZ": 214
  },
  "chunkSize": 48,
  "lods": ["low", "medium", "high"],
  "chunks": [
    {
      "id": "-3_2",
      "x0": -144,
      "z0": 96,
      "x1": -96,
      "z1": 144,
      "files": {
        "low": "chunks/low/-3_2.bin",
        "medium": "chunks/medium/-3_2.bin",
        "high": "chunks/high/-3_2.bin"
      },
      "counts": {
        "low": 250,
        "medium": 2200,
        "high": 12000
      }
    }
  ]
}
```

### JSON prototype chunk

For phase 1, use JSON because it is easy to debug:

```json
{
  "id": "0_0",
  "materials": {
    "glass": [[x, y, z, sx, sy, sz], [x, y, z, sx, sy, sz]],
    "road": [[x, y, z, sx, sy, sz]]
  }
}
```

### Binary final chunk

For 2M–5M, use compact binary:

- Header: magic/version/material table/counts
- Per instance:
  - x, y, z: Int16 or Float32 depending precision needs
  - sx, sy, sz: UInt8/UInt16 or Float32
  - material index: UInt8/UInt16
- Or split by material and omit material index per instance.

Suggested first binary format:

- Per material block:
  - material id string/table index
  - count UInt32
  - Float32Array of `x,y,z,sx,sy,sz`

Simple, less compact, easy to parse.

Later optimization:

- Quantize x/z/y/scale to Int16/Uint16.

---

## Runtime Architecture

### New files

Create:

- `_kualalumpur-src/src/world/chunks/ChunkManager.js`
- `_kualalumpur-src/src/world/chunks/ChunkLoader.js`
- `_kualalumpur-src/src/world/chunks/ChunkInstancer.js`
- `_kualalumpur-src/src/world/chunks/chunkVisibility.js`
- `_kualalumpur-src/src/world/chunks/chunkFormat.js`
- `_kualalumpur-src/scripts/generate-kl-chunks.js`
- `_kualalumpur-src/scripts/validate-chunks.js`

Modify:

- `_kualalumpur-src/src/world/VoxelInstancer.js`
- `_kualalumpur-src/src/world/createKualaLumpurWorld.js`
- `_kualalumpur-src/src/main.js`
- `_kualalumpur-src/vite.config.js` if public asset handling needs adjustment
- `_kualalumpur-src/package.json` scripts

### Runtime flow

1. Load core map and metadata.
2. Determine camera/player chunk.
3. Keep nearby chunks at high detail.
4. Keep mid-distance chunks at medium detail.
5. Keep distant important regions at low detail or label-only.
6. Unload high-detail chunks outside budget.
7. Maintain global caps:
   - desktop visible cap
   - tablet visible cap
   - mobile visible cap
8. If cap exceeded, downgrade farthest chunks first.

### Device tiers

```js
const detailTier = (() => {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = window.matchMedia('(max-width: 860px)').matches;
  const memory = navigator.deviceMemory ?? 4;

  if (coarse || small || memory <= 4) return 'mobile';
  if (memory <= 8) return 'balanced';
  return 'desktop';
})();
```

Indicative budgets:

| Tier | High radius | Medium radius | Visible instance cap |
|---|---:|---:|---:|
| mobile | 1 chunk | 2 chunks | 350k–500k |
| balanced/iPad | 1–2 chunks | 3 chunks | 500k–700k |
| desktop | 2 chunks | 4 chunks | 700k–1M |

---

## Rendering Changes Needed

### Current limitation

`VoxelInstancer` currently creates one `InstancedMesh` per material for the whole scene. This is excellent for 300k, but poor for chunked streaming because one huge material mesh cannot be partially unloaded by region.

### Required change

Create many smaller instanced meshes:

- One mesh per material per chunk per LOD.
- Track them under a `THREE.Group` per chunk.
- Dispose geometry/material references correctly when unloading.

### Reuse materials

Do not create a new material object for every chunk if avoidable. Share material instances by palette key:

- `MaterialRegistry.get(key)`
- dispose only at app teardown, not per chunk.

### Geometry

Reuse a single `BoxGeometry(1,1,1)` for all chunk meshes.

---

## Map Accuracy / Realism Layers

### Layer 1: Accurate base geography

- Rivers:
  - Klang River
  - Gombak River
  - River of Life confluence
  - major lakes: KLCC Park, Titiwangsa, Putrajaya Lake, Mines Lake
- Parks/green:
  - KLCC Park
  - Perdana Botanical Garden
  - Bukit Nanas
  - FRIM
  - Titiwangsa
  - Bukit Kiara
  - Putrajaya parks
- Terrain impression:
  - flatter core KL
  - hillier Ampang/Ulu Klang/Genting/Janda Baik edge
  - coastal/river lowlands west/south-west

### Layer 2: Road and rail network

Prioritize real corridor shape over every small street.

- Major roads/highways:
  - Federal Highway
  - NKVE / ELITE impression
  - MRR2
  - Jalan Tun Razak
  - Jalan Sultan Ismail / Bukit Bintang core
  - DUKE / AKLEH impressions
  - Putrajaya-KLIA south corridor
- Transit:
  - Kelana Jaya LRT
  - Ampang/Sri Petaling LRT
  - MRT Kajang line
  - MRT Putrajaya line impression
  - Monorail
  - KTM Batu Caves / Klang / Port Klang
  - ERL to KLIA

### Layer 3: Building/district detail

Use building footprints where possible, but simplify aggressively:

- Central KL: more footprint detail and height variety.
- PJ/Subang/Sunway/Shah Alam: district clusters with landmark anchors.
- Putrajaya: broad civic blocks, bridges, lakes.
- KLIA: runway/terminal/circuit motif.
- Genting/Batu Caves: set-piece terrain and silhouette.

### Layer 4: Landmark set pieces

Make recognizable voxel silhouettes for:

1. Petronas Twin Towers + Suria/KLCC Park
2. Merdeka 118 + Merdeka/Stadium area
3. KL Tower + Bukit Nanas
4. Sultan Abdul Samad + Merdeka Square + River of Life
5. Masjid Negara + Islamic Arts Museum + Lake Gardens
6. Batu Caves stairs/statue/limestone
7. Thean Hou Temple
8. TRX/Pavilion/Bukit Bintang retail spine
9. Shah Alam Blue Mosque
10. Sunway Pyramid/Lagoon
11. Putrajaya Mosque/bridges/lake
12. KLIA/Sepang
13. Genting highlands gateway

---

## Phased Implementation

## Phase 0: Guardrails and measurement

**Objective:** Prevent accidental performance regression.

Tasks:

1. Add detailed section counting to `VoxelInstancer`.
2. Add `scripts/measure-world.js`.
3. Add budget thresholds to `package.json`:
   - `npm run measure:world`
   - `npm run validate:budget`
4. Release CPU arrays after `finalize()`.
5. Add memory/performance notes to `_kualalumpur-src/README.md`.

Verification:

```bash
cd /home/ubuntu/work/wanazhar.github.io/_kualalumpur-src
npm run lint:syntax
npm run build
npm run measure:world
npm run validate:budget
```

## Phase 1: In-memory chunking prototype

**Objective:** Prove chunk visibility without external files.

Tasks:

1. Split generated instances into chunk buckets.
2. Generate one `InstancedMesh` per material per chunk.
3. Add `ChunkManager.update(camera/player)`.
4. Toggle visibility by radius.
5. Keep existing final built bundle; no external chunk files yet.

Target:

- Current 306k scene behaves the same visually.
- Distant chunks can hide/show without breaking landmarks/minimap/routes.

Verification:

- Desktop Playwright smoke.
- iPad smoke.
- Mobile smoke.
- Manually pan/fast travel and ensure chunks appear/disappear cleanly.

## Phase 2: Static external chunk loading

**Objective:** Make GitHub Pages serve map chunks as static assets.

Tasks:

1. Create `_kualalumpur-src/scripts/generate-kl-chunks.js`.
2. Generate chunks into `_kualalumpur-src/public/chunks/`.
3. Create chunk metadata.
4. Add runtime fetch loader.
5. Add loading indicator and error fallback.
6. Add chunk cache eviction.

Target:

- App initial JS does not contain all detail.
- Nearby chunks load from `/kualalumpur/chunks/...`.
- Reloading/direct access on GitHub Pages works.

Verification:

```bash
npm run build
rsync -a --delete dist/ ../kualalumpur/
python3 -m http.server 8089 --bind 127.0.0.1
curl -I http://127.0.0.1:8089/kualalumpur/chunks/metadata.json
```

Browser verification:

- No 404s for chunk assets.
- Moving/fast traveling loads expected chunks.
- Offline failed chunks degrade gracefully.

## Phase 3: 2M authored detail pass

**Objective:** Reach 2M authored details while keeping visible count bounded.

Tasks:

1. Generate real/procedural district building details by chunk.
2. Add accurate waterways/parks/roads layer.
3. Add high-detail central KL chunks.
4. Add medium-detail suburb chunks.
5. Add low-detail far-region impostors.
6. Add set pieces for top 10 landmarks.
7. Add search/filter UI if landmark count grows beyond ~250.

Target:

- Authored count: 2M.
- Desktop visible cap: 700k–900k.
- Mobile visible cap: 350k–500k.
- Initial page load stays acceptable.

Verification:

- Budget validation passes.
- Playwright desktop/iPad/mobile passes.
- Manual render check at KLCC, Chinatown, Batu Caves, Shah Alam, Putrajaya, KLIA, Kuala Selangor.

## Phase 4: Binary chunk format

**Objective:** Make chunks smaller and faster.

Tasks:

1. Implement binary writer in `scripts/generate-kl-chunks.js`.
2. Implement parser in `_kualalumpur-src/src/world/chunks/chunkFormat.js`.
3. Keep JSON debug option behind build flag.
4. Add chunk checksums/versioning.
5. Add metadata count validation.

Target:

- Chunk file size materially lower than JSON.
- Runtime parse faster.
- 2M map loads smoothly.

Verification:

- Compare JSON vs binary total size with a script.
- Browser chunk loading has no parse errors.
- Visual parity check between JSON and binary modes.

## Phase 5: 5M authored stretch

**Objective:** Push detail density while preserving user experience.

Prerequisites:

- Binary chunks working.
- LOD working.
- Mobile tier working.
- Budget gate working.
- Chunk unload/dispose working.

Tasks:

1. Increase building footprint density.
2. Add secondary street grids per district.
3. Add district-level vegetation, signage, waterfront, and transit details.
4. Add more set pieces and local clusters.
5. Add region bookmarks and search to avoid UI overload.
6. Add an optional “High detail” toggle for desktop.

Target:

- Authored count: 5M.
- Default desktop visible: <= 1M.
- Default mobile visible: <= 550k.
- User can opt into higher detail on strong desktop.

Verification:

- Desktop high-detail manual test.
- Mobile default remains smooth enough.
- GitHub Pages asset count and file sizes remain reasonable.

---

## GitHub Pages Constraints

Supported:

- Static chunk files.
- Vite hashed assets.
- JSON/binary chunk fetches.
- Client-side cache.
- Full static deployment.

Not supported:

- Server-side tile generation.
- Database queries.
- Dynamic spatial APIs.
- Runtime OSM fetching at scale.

Therefore:

- All heavy geodata processing must happen before build.
- Runtime only fetches prebuilt static chunks.

---

## File/Request Budget Guidance

For 2M:

- Keep chunk count roughly `100–300` files per LOD set.
- Avoid thousands of tiny chunks.
- Prefer chunk size around `48–64` world units.
- Use metadata to load only necessary files.

For 5M:

- Binary chunks strongly recommended.
- Use chunk grouping or archives if request count grows too high.
- Consider one file per region+LOD rather than one tiny file per tile if request overhead becomes obvious.

---

## UI/UX Additions Required

1. **Loading indicator**
   - “Loading KLCC detail…”
   - Should not block movement.

2. **Detail mode toggle**
   - Auto / Battery saver / High detail.

3. **Region jump/search**
   - Essential once map gets dense.

4. **Map layer toggles**
   - Landmarks
   - Transit
   - Food
   - Nature
   - Heritage
   - Shopping

5. **Debug overlay in dev**
   - visible chunks
   - loaded chunks
   - visible instances
   - loaded instance memory estimate
   - chunk load failures

---

## Risks and Mitigations

### Risk: GitHub Pages file size / many requests

Mitigation:

- Use binary chunks.
- Keep chunk count moderate.
- Group distant low-detail chunks.
- Avoid huge single JS bundle.

### Risk: Mobile memory pressure

Mitigation:

- Hard mobile visible cap.
- Aggressive eviction.
- Lower LOD by default.
- Disable or reduce decorative filler.

### Risk: Visual popping when chunks load

Mitigation:

- Load low LOD first.
- Crossfade/chunk opacity optional later.
- Keep labels and major landmarks persistent.

### Risk: Data accuracy claims

Mitigation:

- Store coordinate source/confidence.
- Distinguish exact landmark vs representative district marker.
- Avoid claiming survey precision.

### Risk: Overengineering before validating

Mitigation:

- Phase 1 in-memory chunking first.
- Phase 2 external chunks with small count.
- Only then 2M/5M generation.

---

## Acceptance Criteria

### For 2M milestone

- `2,000,000+` authored/generated instances across chunks.
- App initial load remains functional on GitHub Pages.
- Desktop visible detail does not exceed chosen cap unless High Detail is enabled.
- Mobile/iPad controls remain accessible.
- No console errors in smoke tests.
- Route selector, station selector, landmark jump, minimap, photo mode still work.
- Geographic corridors and landmark positions are visibly more realistic.

### For 5M stretch

- `5,000,000+` authored/generated instances in static chunks.
- Default visible detail remains capped.
- Binary chunk format active.
- Chunk cache eviction works.
- Mobile tier does not attempt to render all detail.
- High-detail desktop mode is opt-in or auto only on strong devices.

---

## Recommended Next Step

Start with **Phase 0 + Phase 1**, not direct 5M generation.

Concrete first implementation batch:

1. Add section/budget instrumentation.
2. Free CPU arrays after finalize.
3. Convert current scene to chunked instanced meshes in memory.
4. Add dev chunk debug overlay.
5. Verify no behavior regression.

After that, proceed to static external chunks and 2M authored detail.

This is the safe path to a serious KL map without wrecking the experience.
