# spacebunnyalpha

**スペースバニー・アルファ** — a slice-of-life exploration RPG on one seamless Japanese island.

City → suburbs → rice fields → shrine → coast, all on a single walkable landmass.
Everything is generated from code: no textures, no image assets, no models.

## The vibe

There is nothing to lose and no timer running. You walk around an island, you talk to
people who are having an ordinary day, you fish a bit, you cook what you caught, and
somebody hands you a small errand. That's the whole game. Everything is tuned around
that: quests are errands, not campaigns; failure states do not exist; the most a bad
roll can cost you is a wasted cast.

## Four regions, one island

| Region | さくら区 Sakura Ward | ひのね郊外 Hinode Suburbs | きすみ高地 Kisumi Highlands | あおい海岸 Aoi Coast |
|---|---|---|---|---|
| Feel | neon alleys, commuters, a konbini | detached houses, a school, the 07:12 train | paddies, orchard, a shrine on the mountain | torii in the surf, fishing boats, nothing to do |
| Landmarks | street grid, towers, shophouse rows with neon | konbini, school, rail line | terraced rice, shrine, barn, windpump | sea torii, harbour wall, fishing village |

The island is connected by a carved river with bridges, and the mountain road climbs
from the river crossing to the shrine. You can walk from downtown to the beach without
a loading screen; a flood-fill test in the suite guarantees all four regions stay
reachable on foot.

## Features

- **Seamless procedural island** — a 320×320-block heightmap with a carved river,
  a ridged mountain range, four region plateaus, and an irregular eroded coastline.
  Fully deterministic from a single seed.
- **Real time of day** — a 10-stop colour ramp drives the sky gradient, sun and moon
  discs, fog, stars and light intensity, from a 5am dawn through to a 1am night.
- **Weather that changes on its own** — clear, cloudy, overcast, rain and storm,
  weighted towards fair weather, re-rolled every 25–90 in-game minutes.
- **Region-specific ambience** — sakura petals in the city, fireflies over the fields
  at night, pollen by day, gulls circling the bay, and rain everywhere it rains.
- **Third-person voxel characters** — articulated rigs with a real walk cycle, plus
  10 NPCs who keep daily schedules and turn to face you when you talk.
- **RPG depth without pressure** — inventory, wallet, stamina, skill levels, cooking,
  crafting, fishing with an hour-dependent fish table, and foraging.
- **Slice-of-life dialogue** — every NPC has lines that change with the time of day,
  the weather, and how well you know them, plus quests, gift preferences and a
  friendship meter.
- **Animated sea** — layered vertex waves, a deep-water layer, and surf foam that
  pulses against the shore and pushes you back if you try to swim out.
- **Photo mode** — press `P` for letterbox framing; move the camera freely.

## Controls

| Action | Control |
|---|---|
| Walk | `WASD` / arrow keys, or the left thumbstick on touch |
| Run | `Shift` (drains stamina) |
| Jump | `Space` |
| Talk / interact / fish / forage | `E` |
| Orbit camera | drag anywhere on the canvas |
| Zoom | mouse wheel or pinch |
| Journal | `J` |
| Island map | `M` |
| Bag | `I` |
| Photo mode | `P`, `Esc` to exit |

## Development

```bash
npm install
npm run dev        # http://localhost:5174
```

### Serving a build locally

```bash
npm run build
python3 scripts/serve.py --bind 127.0.0.1 --port 4174
```

`serve.py` exists because of two failures that cost real time:

- It sends `Cache-Control: no-store`. iOS Safari aggressively caches a plain
  static `index.html`, so without it a rebuilt game keeps serving a stale
  bundle reference and the fix appears not to have landed.
- It re-resolves its document root on every request and moves its own working
  directory to `/` at startup. `vite build` uses `emptyOutDir`, which deletes
  and recreates the output directory; a server holding the original handle
  then serves a bare directory listing instead of the game.

```bash
python3 scripts/serve-check.py   # asserts both of the above
```

Pass `--bind` a specific address to keep the server off `0.0.0.0`.

## Build

```bash
npm run build
```

Output goes to the sibling `spacebunnyalpha/` directory, using `base: './'` so it is
served correctly from `/spacebunnyalpha/` inside the `wanazhar.github.io` monorepo.

```bash
npm run preview    # verify the production build
```

### Art direction

The palette, lighting and detail are taken from real Studio Ghibli film frames
(the "Movies in Color" quantiles), not chosen by eye. Three rules carry most of
the look:

- **Lightness before hue.** Minecraft grass is `#7CBD6B`: dark, mid-saturated.
  Ghibli grass is `#ACD2A3`: light, pale. Raising lightness and dropping
  saturation is the single biggest "not Minecraft" lever, and it costs nothing.
- **Shadows are tinted, never black.** The fill is a `HemisphereLight` whose sky
  and ground colours differ, so every surface picks up a temperature split the
  way a painted background does. One key light casts every shadow; a weak
  opposing light lifts distant silhouettes off the sky.
- **Fog is the horizon colour exactly.** Grey fog is the tell of an unstyled 3D
  scene.

The sky is a banded vertical gradient (five value steps, the way a wash is built
up in gouache) rather than a smooth ramp, and the sea takes the sky's own colour
with a sun path on it.

"Reads as Japan" comes mostly from infrastructure rather than architecture:
concrete utility poles with sagging catenary wires, stainless roof tanks,
vending machines under awnings, kawara roofs built from alternating-value tile
courses, and shoji glowing cream in the evening. These are cheap boxes and they
do more work than any amount of building detail.

### Visual verification

The game is checked by looking at it, not by asserting on the DOM. There is real
Chrome on the dev box with a debug port, and the tooling drives it over CDP:

```bash
python3 scripts/tour.py http://127.0.0.1:4174/ /tmp/shots   # photograph every region
python3 scripts/analyze.py /tmp/shots/07-paddy-fields.png    # colour statistics
node scripts/find-vantage-points.js                          # find camera positions
```

`window.__sba` is an inspection handle exposed by the game: `state`, `teleport`,
`view`, and the raw `scene`/`camera`/`player`. It exists because every visual
bug found so far was invisible to the test suite.

`find-vantage-points.js` scans for spots with real camera clearance. Hand-picked
coordinates kept landing inside a tree canopy, a barn or a hillside, which
produced black frames and shots with no player in them.

## Tests

```bash
npm test           # 73 tests across terrain, regions, gameplay, budget, runtime
npm run lint       # node --check every source file
```

Notable suites:

- `lint-undefined.test.js` — parses every module with acorn and fails on an
  identifier that is referenced but never bound. This catches missing imports,
  which the bundler treats as globals and therefore compiles cleanly; they only
  surface as a `ReferenceError` at runtime. It has caught two real bugs of
  exactly that shape.
- `terrain.test.js` — island shape, biomes, and a flood-fill proof that all four
  regions are reachable on foot from the spawn.
- `city.test.js` / `regions.test.js` — layout invariants: lots never overlap, never
  sit on a road, never land in the water, and only ever emit known materials.
- `gameplay.test.js` — inventory stacking limits, atomic shop transactions, crafting
  input accounting, quest state machine, and save round-tripping.
- `budget.test.js` — world size ceilings, plus a check that the validator itself
  rejects an oversized world.
- `runtime.test.js` — boots the **real built bundle** in jsdom against a stubbed
  WebGL context and fails on any uncaught error. This catches DOM and renderer bugs
  that a compile-only check misses.

### Browser smoke test

The jsdom suite stubs WebGL, so it proves the module graph boots but not that a
real renderer gets a playable scene. For that, drive a real Chrome over CDP:

```bash
npm run build
python3 scripts/serve.py --bind 100.98.115.95 --port 4174 &
npm run smoke:browser -- http://100.98.115.95:4174/
```

It clicks the start button, counts `requestAnimationFrame` callbacks to prove the
loop is live, and fails on any console error. Note that headless Chrome throttles
rAF to roughly 1fps, so the in-game clock barely moves there — count frames, do
not watch the clock.

### Guardrails

```bash
npm run measure:world      # instance counts, biome census, region extents
npm run validate:budget    # fails if the world outgrows its ceilings
```

Current numbers: ~10.7k static boxes, ~45k instances on screen across 25 streamed
chunks, ~465 approximate draw calls, 8k collision cells, and a plan that builds in
under 2s.

## Deploying to `wanazhar.github.io`

This project is built by the monorepo's GitHub Actions workflow, which runs
`npm ci && npm run build` in `_spacebunnyalpha-src/` and uploads the whole repository
as the Pages artifact. Nothing else is needed locally.

## Project structure

```text
_spacebunnyalpha-src/
├─ index.html
├─ package.json
├─ vite.config.js
├─ scripts/
│  ├─ measure-world.js      world size report
│  ├─ validate-budget.js    size ceilings (also imported by budget.test.js)
│  └─ *.test.js
└─ src/
   ├─ main.js               boot, game loop, interaction wiring
   ├─ config.js             every tunable number in the game
   ├─ style.css
   ├─ core/
   │  ├─ EventBus.js        systems talk through events, never directly
   │  ├─ GameClock.js       in-game time and day phases
   │  └─ SaveSystem.js      versioned save with corrupt-save recovery
   ├─ util/
   │  ├─ rng.js             seeded noise: value, fbm, ridged
   │  └─ math.js
   ├─ world/
   │  ├─ Terrain.js         the island heightmap and biome rules
   │  ├─ Palette.js         named materials + VoxelBatch
   │  ├─ ChunkMeshes.js     terrain box generation and instancing
   │  ├─ Collision.js       blocked-cell grid, shared with the visuals
   │  ├─ World.js           world plan, city streets, chunk streaming
   │  └─ regions/           city, suburb, rural, coast builders
   ├─ render/
   │  ├─ SkySystem.js       gradient dome, sun, moon, stars, fog
   │  ├─ OceanSystem.js     layered waves and surf
   │  ├─ AmbienceSystem.js  pooled particle layers
   │  └─ WeatherSystem.js   weather rolls and regional ambience rules
   ├─ characters/
   │  ├─ CharacterRig.js    voxel humans, walk cycle, villager AI
   │  └─ PlayerController.js input, follow camera, collision, stamina
   ├─ game/
   │  ├─ Systems.js         inventory, economy, skills, crafting, activities
   │  └─ QuestSystem.js     quests, friendship, journal
   ├─ data/
   │  ├─ items.js
   │  ├─ npcs.js            the cast, their schedules and their dialogue
   │  ├─ quests.js
   │  └─ recipes.js
   └─ ui/
      ├─ HUD.js             hud, panels, dialogue, nameplates
      └─ Menus.js           journal, bag, shop, crafting, map
```

## Design notes

**Why everything is a box.** The island is ~45k instances of a single shared
`BoxGeometry`, batched per material into `InstancedMesh`es. One geometry, one
material set, and the draw-call count stays flat as the world grows.

**Collision shares its data with the visuals.** `Collision.js` is built from the same
lot arrays the geometry builders use, so a wall you can see is always a wall you bump
into. Buildings, cliffs and the water's edge are all in one blocked-cell grid.

**The world is a pure function of a seed.** `Terrain.js` has no Three.js import, so
the entire island — height, biome, region — is testable in plain Node. The tests do
exactly that rather than mocking a renderer.

**Dialogue is data, not code.** NPC lines are keyed by moment (any / morning /
evening / rainy / friendly) and the most specific pool that applies wins, so adding a
character means adding an object to `data/npcs.js`.