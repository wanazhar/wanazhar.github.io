# Kuala Lumpur Voxel Game Expansion Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Evolve `/kualalumpur/` from a neat voxel scene prototype into a small exploratory KL city game with better camera control, landmark presentation, traversal, and lightweight objectives.

**Architecture:** Keep the current static GitHub Pages deployment model. Develop inside the Vite/Three.js source project, build to `dist/`, then copy the production output into `wanazhar.github.io/kualalumpur/`. Avoid external assets unless explicitly approved; prefer procedural/code-generated geometry to keep the project portable.

**Tech Stack:** Vite, Three.js, OrbitControls, vanilla JS modules, CSS HUD, GitHub Pages static hosting.

---

## Current Codebase Notes

- Source package: uploaded `voxel-kuala-lumpur` Vite app.
- Deployed static target: `wanazhar.github.io/kualalumpur/`.
- Main camera/orbit config is in `src/main.js`:
  - `PerspectiveCamera(58, ..., 0.1, 520)`
  - `controls.minDistance = 9`
  - `controls.maxDistance = 65`
  - `placeCameraNear(target, distance = 28)`
  - landmark focus uses `placeCameraNear(target, 24)`
  - player refocus uses `placeCameraNear(..., 24)`
- Current world bounds: `MAP_MIN = -96`, `MAP_MAX = 96` in `src/world/createKualaLumpurWorld.js`.
- Existing landmark list: Petronas, Merdeka 118, KL Tower, Merdeka Square, Masjid Negara, Tugu Negara, LRT/MRT Hub, Lake Gardens.

---

## Phase 0 — Immediate Camera Fix

### Task 0.1: Let the player zoom out much further

**Objective:** Make architectural scale readable without changing gameplay.

**Files:**
- Modify: `src/main.js`

**Implementation:**
- Increase far plane and max orbit distance.
- Use a slightly wider FOV.
- Start/focus cameras further back for landmarks.

Suggested values:

```js
const camera = new THREE.PerspectiveCamera(64, window.innerWidth / window.innerHeight, 0.1, 900);

controls.minDistance = 7;
controls.maxDistance = 180;
controls.maxPolarAngle = Math.PI * 0.495;
```

Change camera placement defaults:

```js
function placeCameraNear(target, distance = 44) {
  controls.target.copy(target);
  recentCameraTarget.copy(target);
  camera.position.copy(target).add(new THREE.Vector3(distance, distance * 0.72, distance));
  camera.lookAt(target);
  controls.update();
}
```

Change landmark/player focus distances:

```js
placeCameraNear(target, 58); // landmarks
placeCameraNear(player.group.position.clone().add(new THREE.Vector3(0, 2, 0)), 34); // player refocus
```

**Verification:**
- Build and open `/kualalumpur/`.
- Mouse wheel / pinch can zoom far enough to see full Petronas and KL Tower silhouettes.
- Close movement view still works.
- No clipping at maximum zoom out.

### Task 0.2: Add explicit camera mode shortcuts

**Objective:** Give players predictable views instead of relying only on wheel zoom.

**Files:**
- Modify: `src/main.js`
- Modify: `src/ui/hud.js`
- Modify: `src/style.css`

**Feature:**
- `1` / HUD button: Walker camera, close behind player.
- `2` / HUD button: Landmark camera, medium distance.
- `3` / HUD button: City overview, very zoomed-out isometric view.

**Verification:**
- Buttons work on touch and desktop.
- Keyboard shortcuts show toast feedback.

---

## Phase 1 — Make Exploration Feel Like A Game

### Task 1.1: Add collectible landmark stamps

**Objective:** Turn sightseeing into lightweight progression.

**Files:**
- Create: `src/game/LandmarkProgress.js`
- Modify: `src/main.js`
- Modify: `src/ui/hud.js`

**Feature:**
- When the player gets within a radius of each landmark, mark it as visited.
- HUD shows `Landmarks visited: 0/8`.
- Landmark buttons show visited/unvisited state.
- Toast: `Stamp collected: Petronas Twin Towers`.

**Verification:**
- Visiting all current landmarks reaches 8/8.
- Warping with existing landmark buttons also triggers visits.

### Task 1.2: Add a mini-map / compass strip

**Objective:** Reduce disorientation in a 193x193 voxel city.

**Files:**
- Create: `src/ui/miniMap.js`
- Modify: `src/main.js`
- Modify: `src/style.css`

**Feature:**
- Simple top-right 2D mini-map canvas or SVG.
- Shows player dot, current heading, and landmark dots.
- Optional: click a landmark dot to focus/warp.

**Verification:**
- Dot positions map correctly from world coords `[-96, 96]` to mini-map bounds.
- Works on mobile without blocking joystick.

### Task 1.3: Add a guided route mode

**Objective:** Make the experience more approachable for first-time visitors.

**Files:**
- Create: `src/game/TourRoute.js`
- Modify: `src/main.js`
- Modify: `src/ui/hud.js`

**Feature:**
- Button: `Start KL Tour`.
- Suggested route: KLCC → KL Tower → Merdeka 118 → Merdeka Square → Masjid Negara → Lake Gardens.
- HUD displays next destination and distance.
- Optional pulsing beacon above next landmark.

**Verification:**
- Route advances when player enters destination radius.
- Can cancel/restart tour.

---

## Phase 2 — Expand The City Content

### Task 2.1: Add more recognizable KL landmarks

**Objective:** Make the city feel richer and more local.

**Files:**
- Modify: `src/world/createKualaLumpurWorld.js`
- Modify: `src/world/VoxelInstancer.js` if more palette colors are needed.

**Candidate landmarks:**
- TRX / Exchange 106 cluster
- Bukit Bintang intersection / Pavilion-inspired mall block
- Central Market / Pasar Seni
- Old railway station
- National Museum
- Thean Hou Temple
- Batu Caves-inspired edge landmark, if expanding map northward

**Implementation principle:**
- Each landmark should have a simple strong silhouette, not tiny detail noise.
- Add each landmark as a function: `addTheanHouTemple(inst, terrain)`, etc.
- Add each to the `landmarks` array so HUD/tour systems pick it up.

**Verification:**
- New landmarks are visible from overview camera.
- Landmark focus buttons still fit on desktop/mobile.

### Task 2.2: Add street-level texture without image textures

**Objective:** Make walking less empty while keeping procedural/code-generated style.

**Files:**
- Modify: `src/world/createKualaLumpurWorld.js`
- Modify: `src/world/VoxelInstancer.js`

**Feature ideas:**
- Crosswalk stripes near plazas.
- Street lamps.
- Bus stops.
- Food-truck/hawker-stall blocks.
- Trees with varied canopy shapes.
- Benches and signboards.

**Verification:**
- Voxel count remains reasonable.
- FPS stays acceptable on phone.

---

## Phase 3 — Transport And Motion

### Task 3.1: Make trains boardable as cinematic rides

**Objective:** Turn train animation into an interaction.

**Files:**
- Modify: `src/transport/TrainSystem.js`
- Modify: `src/main.js`
- Modify: `src/ui/hud.js`

**Feature:**
- Near station, show `Board Train` button / `E` prompt.
- Camera follows train along route while player is locked.
- `Exit` returns player near next station.

**Verification:**
- Train ride starts only near station.
- Exit places player on valid terrain.
- Orbit controls don’t fight train camera.

### Task 3.2: Add traffic / city life ambience

**Objective:** Increase liveliness with cheap motion.

**Files:**
- Create: `src/world/CityActors.js`
- Modify: `src/main.js`

**Feature:**
- Tiny instanced cars/taxis moving along a few road splines.
- Optional tiny pedestrians near plazas.
- Motion sleeps when render loop is idle, matching current performance model.

**Verification:**
- Render loop still pauses when no movement is active.
- No major FPS drop.

---

## Phase 4 — Presentation Polish

### Task 4.1: Add day / sunset / night modes

**Objective:** Give the city atmosphere and replayable views.

**Files:**
- Modify: `src/main.js`
- Modify: `src/ui/hud.js`
- Modify: `src/world/VoxelInstancer.js` if emissive-ish colors are needed.

**Feature:**
- HUD toggle cycles: Day → Sunset → Night.
- Night mode adds glowing window strips / train lights via material colors.

**Verification:**
- Landmarks remain readable in all modes.
- No real-time shadow complexity unless performance allows.

### Task 4.2: Add photo mode

**Objective:** Let people capture cool views for sharing.

**Files:**
- Create: `src/ui/photoMode.js`
- Modify: `src/main.js`
- Modify: `src/style.css`

**Feature:**
- Hide HUD button.
- Wider/narrower FOV controls.
- Preset camera angles: Skyline, Petronas, Merdeka, KL Tower, Tour Poster.
- Download screenshot via `canvas.toDataURL()`.

**Verification:**
- Screenshot downloads on desktop.
- On mobile, fallback opens image in new tab or prompts long-press save.

---

## Recommended Implementation Order

1. Phase 0 camera fix — immediate usability win.
2. Phase 1.1 landmark stamps — simplest “game loop”.
3. Phase 1.2 mini-map — improves orientation.
4. Phase 1.3 guided route — turns prototype into tour.
5. Phase 2.1 add 2–3 new landmarks — content expansion.
6. Phase 4.1 day/night — visual payoff.
7. Phase 3 train ride — more complex, do after architecture is cleaner.
8. Phase 4.2 photo mode — good finishing touch.

---

## Deployment Checklist For Each Release

```bash
cd /path/to/voxel-kuala-lumpur
npm run lint:syntax
npm run build
rsync -a --delete dist/ /home/ubuntu/work/wanazhar.github.io/kualalumpur/
cd /home/ubuntu/work/wanazhar.github.io
python3 -m http.server 4173 --bind 127.0.0.1
# verify http://127.0.0.1:4173/kualalumpur/
git add kualalumpur
git commit -m "feat: improve Kuala Lumpur voxel prototype"
git push origin main
```

---

## My Recommended First Patch

Ship this first:

- Increase `controls.maxDistance` from `65` to `180`.
- Increase camera far plane from `520` to `900`.
- Slightly widen FOV from `58` to `64`.
- Make landmark focus use distance `58` instead of `24`.
- Add camera preset buttons: `Walk`, `Landmark`, `Skyline`.

This directly fixes the zoom complaint and makes the prototype feel intentionally designed rather than “camera got stuck too close”.
