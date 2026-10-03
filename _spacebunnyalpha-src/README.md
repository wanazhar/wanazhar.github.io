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

The target is Rimsoft (*That Time I Got Reincarnated as a Slime*) rather than
Ghibli. Those are genuinely different, and the difference is not subtle.

**Saturation is the whole game.** Measured median saturation across official
Rimsoft artwork is 0.30-0.45; a muted, filmic look sits nearer 0.10. This
palette measures 0.46, with mean lightness 0.61. Grass moved to a real green
`#7FBF4A` from a pale celadon.

**Shadows are hue-shifted, not multiplied.** This is the single most important
finding. Measured across Rimsoft's covers, the shadow band of a surface rotates
hue about 6-9 degrees *toward blue* and roughly *doubles* saturation, while
value barely moves:

```
lit     #E2F2F4   H187  S0.07  V0.96
shadow  #C8E6F1   H196  S0.17  V0.95    <- +9 deg hue, 2.3x saturation
```

Multiplying value -- the default in any lit 3D scene -- gives `#C0CECF`: dead
grey-green. That is why value-darkened scenes always look washed out.
`AnimeMaterial.js` does what Rimsoft does instead.

The same shader adds a wide soft rim (a narrow one reads as a cel outline, the
opposite of the target), a warm/cool subsurface bleed either side of the
terminator, and contact darkening tinted towards the ambient rather than
towards black, because this art direction has no true black anywhere.

**The sky is banded, not a ramp.** Five value steps, the way a gouache wash is
built up, with a dither so the banding reads as intentional. Fog takes the
horizon colour exactly; grey fog is the tell of an unstyled 3D scene.

**Geometry is rounded.** `RoundedGeometry.js` builds superellipsoids, so nothing
is a hard 90-degree cube. Buildings keep crisp blocks so their structure still
reads; foliage uses soft blobs in overlapping lobes. Segment counts are low on
purpose -- an early version used four times as many and cost 11.9 million
triangles on screen for curvature nobody can see at gameplay distance.

### Making a street read as Japanese

Colour was never the main problem with the city. Structure was. A Japanese
neighbourhood street is a **narrow slot with a continuous wall on both sides**,
not a corridor between detached objects. The first version had 20-unit streets,
which is an arterial with a tram.

Measured targets now implemented, at one world unit per metre:

| | |
|---|---|
| residential street | 5 wide (was 20) |
| collector street | 9, two of them |
| roji alley | 3, cutting through the blocks |
| machiya frontage | 3.7-5.4 |
| machiya ridge | 7-8.4 |
| frontage-to-ridge | 1:2.2, narrow and tall |
| eaves | ~6, projecting 0.8, one continuous line |
| roof pitch | 22-27 degrees, shallow; steep reads as a chalet |

Machiya share party walls and sit flush against the street with **no setback at
all**. Three types, so a row is not a fence: `tsushinikai` with its low latticed
second floor, `sounikai` with full-height storeys, and the 1960s-80s `kanban`
retrofit -- a modern glowing shopfront under an Edo roof, which is the most
recognisably Japanese street form there is.

Signage is layered in three bands between 0 and 6.5m. That is *why* the street
reads as crowded but ordered: all the clutter lives in one horizontal stratum
rather than being sprayed evenly up the facade. Below about a quarter unit,
detail becomes colour rather than geometry -- the `koshi` lattice is one dark
recessed plane with three ribs, not hundreds of invisible bars.

### Visual verification

Every bug in the list above was invisible to the unit tests, so the game is
checked by looking at it. There is a real Chrome on the dev box with a debug
port; the tooling drives it over CDP.

```bash
# Use a dedicated browser. The shared one on 9222 accumulates tabs over a long
# session and eventually drops its socket mid-run.
chromium-browser --headless=new --remote-debugging-port=9333 \
  --user-data-dir=/tmp/sba-chrome about:blank &
SBA_CDP=9333 npm run build
SBA_CDP=9333 python3 scripts/tour.py http://100.98.115.95:4174/ /tmp/shots
python3 scripts/analyze.py /tmp/shots/00-machiya-street.png   # colour stats
node scripts/find-vantage-points.js                           # camera positions
```

`window.__sba` is the inspection handle: `state`, `teleport`, `view`, `portrait`,
`setConditions`, and the raw `scene`/`camera`/`player`.

## Tests

```bash
npm test           # 108 tests
npm run lint       # node --check every source file
```

Notable suites:

- `lint-undefined.test.js` — parses every module with acorn and fails on an
  identifier that is referenced but never bound. Missing imports compile
  cleanly, because the bundler treats them as globals, and only surface as a
  `ReferenceError` at runtime. This has caught four real bugs of that shape.
- `character.test.js` — asserts the rig's proportions numerically: super-deformed
  at 2.0-2.6 heads, head 1.2-1.7x torso width, arms never thicker than legs,
  feet landing on the ground, face parts sitting on the skull surface rather
  than inside it, and the hair cap not swallowing the head. Each of those was a
  real bug that read as "the character looks wrong" and nothing more.
- `machiya.test.js` — street width bands, the 1:2.2 frontage-to-ridge ratio,
  continuous party walls, nothing built in the road or the water, and the axis
  test: facade detail must sit on the street-facing face. Placing it on the
  depth axis left every building turned away from the road, presenting a blank
  back, which looked like an empty street rather than a bug.
- `controls.test.js` / `touch-controls.test.js` — movement direction as a
  property rather than a snapshot: forward must move along the camera view at
  *every* camera angle, and the joystick chain is tested end to end.
- `feel.test.js` — acceleration, braking, turning easing, and the lean, all
  measured against the tuned constants.
- `terrain.test.js` — island shape, biomes, and a flood-fill proof that all four
  regions are reachable on foot from the spawn.
- `gameplay.test.js` — inventory stacking limits, atomic shop transactions,
  crafting input accounting, quest state machine, save round-tripping.
- `budget.test.js` — world size ceilings, plus a check that the validator
  itself rejects an oversized world.
- `runtime.test.js` — boots the **real built bundle** in jsdom against a
  stubbed WebGL context and fails on any uncaught error.

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
│  ├─ serve.py              local server: no-store headers, binds one address
│  ├─ cdp.py                a correct Chrome DevTools Protocol client
│  ├─ tour.py               photographs named viewpoints in a real browser
│  ├─ screenshot.py         single screenshot plus console capture
│  ├─ browser-smoke.py      boots the game and proves the loop runs
│  ├─ analyze.py            colour statistics for a screenshot
│  ├─ find-vantage-points.js  scans for camera positions with real clearance
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
   │  ├─ RoundedGeometry.js superellipsoids, so nothing is a hard cube
   │  ├─ ChunkMeshes.js     terrain box generation and instancing
   │  ├─ Collision.js       blocked-cell grid with per-column height
   │  ├─ World.js           world plan, street surfacing, chunk streaming
   │  └─ regions/
   │     ├─ Machiya.js      street network and the machiya itself
   │     ├─ Trees.js        canopy lobes and groves, shared by all regions
   │     ├─ SuburbRegion.js
   │     ├─ RuralRegion.js
   │     ├─ CoastRegion.js
   │     └─ JapaneseDetails.js  poles, wires, tanks, vending, signage
   ├─ render/
   │  ├─ AnimeMaterial.js   hue-shifted shadows, rim, subsurface, contact
   │  ├─ SkySystem.js       banded gradient dome, sun, moon, stars, fog
   │  ├─ OceanSystem.js     sky-coloured water with a sun path
   │  ├─ AmbienceSystem.js  pooled particle layers
   │  └─ WeatherSystem.js   weather rolls and regional ambience rules
   ├─ characters/
   │  ├─ CharacterRig.js    chibi rig, squash-and-stretch walk, villager AI
   │  └─ PlayerController.js input, collision-aware camera, stamina
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
      ├─ Menus.js           journal, bag, shop, crafting, map
      └─ TouchControls.js   thumbstick and action buttons
```

## Design notes

**Why the world is rounded, not boxes.** Every form is a superellipsoid, so a
"block" is a box with softened corners. A hard 90-degree edge catches light in a
way that draws the eye straight to it, and no amount of colour work overcomes
it. Buildings use a crisp exponent so their structure still reads; foliage uses
a soft one. Geometry is cached per exponent, so the whole island still shares a
handful of buffers.

**Why shadows are hue-shifted.** Measured, not assumed: Rimsoft's shadow band
shifts hue toward blue and *raises* saturation relative to its lit band. Value
multiplication drains chroma, which is why ordinary lit 3D scenes look grey even
when the palette is bright. `AnimeMaterial.js` rotates hue and lifts saturation
instead.

**Collision shares its data with the visuals, and knows how tall things are.**
`Collision.js` is built from the same lot arrays the geometry builders use, so
a wall you can see is always a wall you bump into. It also records a height per
column, because a 2D footprint cannot tell the camera it is inside a roof.

**The city planner records which axis its street runs along.** A lot on a
north-south street has its frontage on the X face; one on an east-west street
has it on Z. Getting that backwards is invisible in the data and catastrophic
on screen: every building turns its blank back to the road and the street reads
as empty ground. `machiya.test.js` asserts it directly.

**The world is a pure function of a seed.** `Terrain.js` has no Three.js import,
so the entire island — height, biome, region — is testable in plain Node. The
tests do exactly that rather than mocking a renderer.

**Dialogue is data, not code.** NPC lines are keyed by moment (any / morning /
evening / rainy / friendly) and the most specific pool that applies wins, so
adding a character means adding an object to `data/npcs.js`.

**Visual bugs get tests, because nothing else catches them.** Every real defect
in this build — the invisible player, the inverted movement, the misplaced
facades, the hair cap swallowing a head — passed the unit suite and was found
by looking at a screenshot. Each now has a numeric assertion.
