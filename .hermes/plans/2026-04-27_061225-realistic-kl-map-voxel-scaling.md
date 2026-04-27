# Realistic Kuala Lumpur Map Voxel Scaling Plan

> **For Hermes:** Use subagent-driven-development skill if executing this plan task-by-task. For now, this is plan-only.

**Goal:** Turn `/kualalumpur/` from a dense stylized voxel scene into a more realistic, proportional Greater KL interactive map without making desktop, mobile, or iPad performance collapse.

**Architecture:** Keep the static Vite/Three.js/GitHub Pages deployment. Increase realism through geographic data layers, selective density, instancing, chunk-level visibility, and landmark-specific set pieces rather than brute-forcing millions of always-visible voxels. Current rendering is already instanced by material, which is good, but it is not chunked or LOD-aware yet.

**Tech Stack:** Vite, Three.js, JavaScript modules, static built output in `kualalumpur/`.

---

## Current Measured Baseline

Measured from `_kualalumpur-src/src/world/createKualaLumpurWorld.js` using `createKualaLumpurWorld(new THREE.Scene())`:

- Current voxel/instance count: `306,103`
- Instanced material meshes: `53`
- Draw instances: `306,103`
- Largest instance buckets:
  - `grass`: `104,985`
  - `grass2`: `54,630`
  - `road`: `39,667`
  - `grassDark`: `34,893`
  - `concrete`: `15,154`
  - terrain side/fill materials are also significant

Approximate memory / shader cost estimates:

| Count | GPU instance matrix memory | Approx box vertex transforms/frame | CPU pre-finalize object data estimate |
|---:|---:|---:|---:|
| 306k | 18.7 MB | 7.3M | 28–47 MB |
| 500k | 30.5 MB | 12.0M | 46–76 MB |
| 750k | 45.8 MB | 18.0M | 69–114 MB |
| 1.0M | 61.0 MB | 24.0M | 92–153 MB |
| 1.5M | 91.6 MB | 36.0M | 137–229 MB |

Important code detail: `VoxelInstancer.finalize()` creates `THREE.InstancedMesh` buffers, but the original JS arrays in `this.instances` are retained. So increasing count raises both GPU buffer memory and avoidable CPU memory.

## Realistic Voxel Ceiling

### With the current architecture, no chunking/LOD

- **Safe target:** `400k–500k` instances
- **Aggressive target:** `600k–750k` instances
- **Not recommended:** `1M+` instances

Reason: the app must work on mobile/iPad, not just a desktop GPU. 1M simple cubes can look fine on a strong machine, but it risks long load, memory pressure, thermal throttling, and stutter on phones/tablets.

### With cleanup + chunking + LOD

- **Practical target:** `800k–1.2M` total authored instances, but only a subset visible/rendered at full detail
- **Stretch target:** `1.5M–2.0M` authored details if distant areas are simplified/hidden and if CPU instance arrays are released after buffer upload

For GitHub Pages/static web, I would not chase beyond this unless we introduce a real tiling/streaming system.

## Recommendation

Do **not** spend the voxel budget evenly. A realistic KL map should use density where tourists notice it:

1. Central KL: high density and detail.
2. Landmark set pieces: bespoke recognizable silhouettes.
3. Transport corridors/rivers/roads: geographically accurate lines.
4. Outer regions: lower-density but correctly positioned districts with strong labels and key POIs.
5. Malaysia Highlights: keep schematic/off-map, unless building a separate Malaysia-scale page.

Target for the next implementation pass:

- Total always-loaded count: **450k–550k**
- Keep mobile/iPad responsive.
- Add a hard performance budget panel/check so we know exactly where counts go.
- Make the map more realistic via layout/data and set pieces, not just raw cube spam.

---

## Implementation Plan

### Task 1: Add build-time/world-generation budget instrumentation

**Objective:** Know which systems generate voxels and how many each contributes.

**Files:**
- Modify: `_kualalumpur-src/src/world/VoxelInstancer.js`
- Modify: `_kualalumpur-src/src/world/createKualaLumpurWorld.js`

**Steps:**
1. Add optional section/group labels to `VoxelInstancer`:
   - `beginSection(name)`
   - `endSection()`
   - per-section totals
2. Wrap major calls in `createKualaLumpurWorld()`:
   - `terrain`
   - `parksWater`
   - `outerDistrictExpansion`
   - `roads`
   - `transit`
   - `streetDetails`
   - `tourismExpansion`
   - `cityBuildings`
   - `landmarkPins`
   - each major landmark set piece
3. Return section stats in `world.voxelStats`.
4. Show section stats only in console/dev, not intrusive UI.

**Verification:**
- `npm run lint:syntax`
- `npm run build`
- Node script confirms total still equals sum of section totals.

### Task 2: Release CPU-side instance arrays after finalization

**Objective:** Increase safe ceiling without visual changes.

**Files:**
- Modify: `_kualalumpur-src/src/world/VoxelInstancer.js`

**Steps:**
1. After creating all `InstancedMesh` buffers in `finalize()`, clear heavy JS arrays:
   - `this.instances.clear()`
2. Preserve returned stats before clearing.
3. Ensure no later code depends on `inst.instances`.

**Why:** Current CPU object data can easily reach 45–150 MB as counts rise.

**Verification:**
- Existing smoke tests still pass.
- `world.voxelStats.total` still displays correctly.

### Task 3: Define a density budget by map zone

**Objective:** Prevent uncontrolled count growth.

**Files:**
- Modify: `_kualalumpur-src/src/world/createKualaLumpurWorld.js`
- Possibly create: `_kualalumpur-src/src/world/mapDensityConfig.js`

**Proposed budget:**

| Layer | Current likely role | Target count |
|---|---:|---:|
| Terrain surface/fill | base map | 210k–240k max |
| Roads/rails/rivers | readability | 45k–65k |
| Central buildings | KL realism | 80k–130k |
| Landmark set pieces | recognizability | 35k–70k |
| Outer district clusters | regional context | 35k–70k |
| Pins/signage/decor | UX | 10k–25k |
| **Total** |  | **450k–550k** |

**Verification:**
- Budget report warns if total exceeds 550k.
- Build fails only if exceeding a hard cap, e.g. 650k, during development script.

### Task 4: Replace uniform grid roads with geography-driven corridors

**Objective:** Make KL feel real without adding tons of voxels.

**Files:**
- Modify: `_kualalumpur-src/src/world/createKualaLumpurWorld.js`
- Possibly create: `_kualalumpur-src/src/data/geoCorridors.js`

**Approach:**
1. Convert known road/rail/river corridors into projected coordinate polylines.
2. Prioritize recognizable axes:
   - Federal Highway / Klang corridor
   - Jalan Tun Razak ring impression
   - KLCC–Bukit Bintang pedestrian/core corridor
   - KL Sentral–Pasar Seni–Masjid Jamek heritage rail spine
   - MRT/PJ/Subang/Sunway west spine
   - Putrajaya/KLIA south corridor
   - Gombak/Batu Caves north-east spine
3. Render fewer, better lines instead of a generic full grid.

**Verification:**
- Road count stays under budget.
- Visual check confirms major regions are connected proportionally.

### Task 5: Add landmark-specific silhouette upgrades

**Objective:** Use voxels where they create tourism realism.

**Files:**
- Modify: `_kualalumpur-src/src/world/createKualaLumpurWorld.js`
- Possibly create separate modules:
  - `_kualalumpur-src/src/world/landmarks/centralKl.js`
  - `_kualalumpur-src/src/world/landmarks/outerKl.js`

**Priority set pieces:**
1. Petronas + KLCC Park + lake/fountain zone
2. Merdeka 118 + Stadium Merdeka area marker
3. KL Tower + Bukit Nanas hill/forest marker
4. Merdeka Square + Sultan Abdul Samad + River of Life
5. Masjid Negara + Islamic Arts + Lake Gardens cluster
6. Batu Caves limestone hill + stairs + Murugan statue color marker
7. Putrajaya mosque/lake/bridges
8. Shah Alam Blue Mosque dome silhouette
9. Sunway Pyramid/Lagoon recognizable pyramid/water icon
10. KLIA/Sepang runway/circuit motif

**Budget rule:** Each set piece should justify its count. Prefer larger instanced boxes and simple silhouettes over thousands of tiny cubes.

### Task 6: Add chunk visibility / distance LOD

**Objective:** Allow more authored detail without rendering everything equally.

**Files:**
- Modify: `_kualalumpur-src/src/world/VoxelInstancer.js`
- Modify: `_kualalumpur-src/src/main.js`
- Possibly create: `_kualalumpur-src/src/world/ChunkedVoxelInstancer.js`

**Approach:**
1. Bin instances into chunks, e.g. 32x32 or 48x48 world units.
2. Create instanced meshes per material per chunk.
3. On camera/player movement, toggle distant chunks or lower-detail variants.
4. Keep landmark pins/labels visible even if surrounding chunk detail is simplified.

**Tradeoff:** More draw calls, less per-frame instance work. Good once total instances exceed ~600k.

**Verification:**
- Desktop and mobile smoke tests.
- FPS/EMA check while moving across central KL and outer districts.

### Task 7: Add mobile performance tiers

**Objective:** Let desktop get more detail while mobile remains smooth.

**Files:**
- Modify: `_kualalumpur-src/src/render/AdaptiveRenderer.js`
- Modify: `_kualalumpur-src/src/world/createKualaLumpurWorld.js` or new density config

**Approach:**
1. Detect coarse pointer / small viewport / low hardware hints.
2. Use lower detail generation for mobile:
   - fewer decorative buildings
   - fewer random cluster filler buildings
   - smaller rain count if weather mode active
   - lower far chunk visibility
3. Desktop can target 550k–750k; mobile target 350k–450k visible/full-detail.

**Verification:**
- Playwright iPad/mobile layout still works.
- Manual performance smoke on mobile viewport.

### Task 8: Build a realistic KL content roadmap

**Objective:** Improve realism and tourist usefulness without exploding geometry.

**Add layers in this order:**
1. Accurate waterways: Klang River, Gombak River, River of Life confluence.
2. Transit: LRT/MRT/Monorail/KTM/ERL simplified but geographically arranged.
3. District boundaries/labels: KLCC, Bukit Bintang, Chinatown, Brickfields, Bangsar, Mont Kiara, PJ, Subang, Shah Alam, Klang, Putrajaya, KLIA, Batu Caves.
4. Tourist route overlays: food, heritage, skyline, nature, family, airport layover.
5. Landmark silhouettes and photo-mode postcard spots.
6. Optional: search/filter categories before adding many more POIs.

### Task 9: Verification package

**Objective:** Never ship a pretty but broken map.

**Commands:**
```bash
cd /home/ubuntu/work/wanazhar.github.io/_kualalumpur-src
npm run lint:syntax
npm run build
rsync -a --delete dist/ ../kualalumpur/
```

**Regression checks:**
- Count totals and section budget.
- Desktop Playwright smoke.
- iPad viewport smoke.
- Mobile viewport smoke.
- Route selector has 14+ routes.
- Landmark buttons show 115+ landmarks.
- Station selector still works.
- No browser console errors.
- Public URL returns HTTP 200 after push.

---

## Recommended Execution Order

1. Instrument counts.
2. Clear CPU instance arrays after finalize.
3. Add density budget guard.
4. Improve geographic roads/rail/rivers.
5. Add 5–10 high-value landmark set pieces.
6. Re-measure. If under 500k and smooth, add more district detail.
7. Only then implement chunking/LOD if we want to push toward 800k+.

## Final Position

For this app, the realistic target is not “maximum possible cubes”; it is “maximum useful detail while the page still loads fast and feels smooth on phones.”

My recommended next milestone: **~500k voxels, visibly more realistic KL, still mobile-safe.**

If we later add chunking/LOD and mobile tiers, then we can aim for **800k–1.2M authored details** without making the experience worse.
