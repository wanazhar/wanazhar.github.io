# spacebunnyalpha — agent guide

An orientation document for anyone picking this project up cold. It assumes no
prior context from the conversation that produced it.

For the player-facing description, art-direction history and measured targets,
see [`README.md`](./README.md). This document is about **how to work on the code
without breaking it**, and it leads with the things that will waste your day if
you do not know them first.

---

## 1. What this is

A third-person slice-of-life exploration RPG on one seamless Japanese island.
Four regions — city, suburbs, rural, oceanside — connected on foot with no
loading screens. No timer, no fail state, no pressure.

Everything is generated from code. **There are no textures, no models, no image
assets, and none may be introduced.** If a task seems to need a texture, the
answer is geometry or colour, not an image.

Target mood: calm. The player walks around, talks to people having an ordinary
day, fishes, cooks, runs small errands.

## 2. Layout

```
_spacebunnyalpha-src/    source (Vite). You edit here.
spacebunnyalpha/         build output. Generated. Never hand-edit.
```

`vite.config.js` uses `base: './'` and an `outDir` of `../spacebunnyalpha`.
The monorepo convention is every subproject keeps source in an underscore-prefixed
directory and publishes to a sibling directory.

Monorepo neighbours — **do not touch these**, other agents work on them
concurrently:

| Directory | Project |
|---|---|
| `_f1-src/` → `f1/` | Apex GP racing game |
| `_emir-src/` → `emir/` | Emir driving game |
| `_kualalumpur-src/` → `kualalumpur/` | Kuala Lumpur |
| `_endlessrunner-src/` → `endlessrunner/` | Endless runner |
| `doom/` | Doom |

## 3. Commands

```bash
npm install
npm run dev          # http://localhost:5174
npm run build        # -> ../spacebunnyalpha/
npm test             # 128 tests, must be green before you commit
npm run lint         # node --check on every file
npm run validate:budget
npm run measure:world
```

Two things about the test command:

- **`npm test` runs `scripts/run-tests.js`, not a glob.** It discovers
  `*.test.js` under both `scripts/` and `test/` and prints the file list.
  Keep suites in one of those two directories, or they silently never run.
- **`NODE_ENV` may already be `production` in this environment**, which makes
  `npm ci` skip devDependencies and leave `jsdom`, `acorn` and `acorn-walk`
  uninstalled. Use `npm ci --include=dev` in CI.

Browser tooling:

```bash
npm run smoke:browser -- http://100.98.115.95:4174/
python3 scripts/controls-check.py          # joystick direction, real Chrome
python3 scripts/serve.py --bind 100.98.115.95 --port 4174 &
python3 scripts/serve-check.py             # asserts the server gotchas below
```

For visual work, drive a dedicated Chrome over CDP. Do **not** reuse a shared
browser; a long-running one accumulates tabs and drops its socket mid-run:

```bash
chromium-browser --headless=new --remote-debugging-port=9333 \
  --user-data-dir=/tmp/sba-chrome about:blank &
SBA_CDP=9333 npm run build
SBA_CDP=9333 python3 scripts/tour.py http://100.98.115.95:4174/ /tmp/shots
```

`window.__sba` is the inspection handle: `state`, `teleport`, `view`,
`portrait`, `setConditions`, `place`, `probeMovement`, and the raw
`scene`/`camera`/`player`/`input`/`followCamera`.

**There is no GPU here.** Software rendering costs roughly 3 s per frame, and
headless Chrome throttles `requestAnimationFrame` to about 1 fps. Budget minutes,
not seconds, for any browser-driven check. Count frames; never watch the
in-game clock to decide whether something worked.

## 4. Read this before you touch the shader

`src/render/AnimeMaterial.js` is a raw `ShaderMaterial`. Four consequences that
have each cost real debugging time:

**1. It declares its own uniforms. `diffuseColor` does not exist.** A bare
`ShaderMaterial` gets none of Three's built-in uniform declarations. Pass base
colour as an explicit `uBaseColor` uniform.

**2. A JavaScript object literal pasted into the GLSL block breaks the entire
world, silently.** This happened. GLSL reported only
`'uSaturation' : syntax error`, the program failed to link, and every surface in
the game stopped drawing. What remained was the bare sky dome with the character
floating in it — which read as a horror film, not as a bug.

If the scene renders as sky with a character hanging in space, check the console
for `WebGL: INVALID_OPERATION: useProgram: program not valid` before debugging
anything else. `scripts/shader.test.js` now rejects JS-in-GLSL, and
`scripts/palette-clipping.test.js` guards the related failure mode, but a
compile error still produces a scene with no error on screen.

**3. Colours must never be dimmed twice.** The light colour already encodes its
own dimness. Multiplying it by `lightStrength` as well drained walls to RGB 47
when they should have been about 135. `normaliseToUnitBrightness()` in
`SkySystem.js` divides by the **peak channel**, not by HSL lightness — HSL
lightness is a poor brightness measure for saturated colours and pushed a deep
blue to 1.45.

**4. Rim light is additive, so it clips at night.** A rim tuned for daylight
(0.75) turned every house in a row into a featureless white blob at 21:00,
because the surface underneath was already dim. Keep it under ~0.35.

## 5. Sign conventions — the recurring bug class

Movement has been inverted **twice**, in two different axes, and both shipped
through a green build. Read this section before changing any movement code.

`FollowCamera` places the camera at `focus + (sin(yaw), cos(yaw)) * distance`.
It therefore **looks along the negation**:

```js
lookX  = -sin(camYaw)
lookZ  = -cos(camYaw)
rightX = -lookZ      // NOT lookZ
rightZ = lookX       // NOT -lookX
```

At `camYaw = 0`: camera sits at `+z`, looks towards `-z`, screen-right is `+x`.

Two errors have lived here:

| Bug | Symptom |
|---|---|
| Rotating the stick vector by `+yaw` instead of negating it | joystick up walked backwards |
| `right` negated | joystick right walked left |

Each was invisible while the other was present. A fix for one exposed the other.

**The test that failed to catch them is the lesson.** `scripts/controls-check.py`
computed its own `right` vector with the same wrong formula the game used, so it
agreed with the bug and reported PASS. A check that shares the bug's assumption
verifies nothing. When writing a test for geometry, derive the expected value
from first principles, never by copying the expression under test.

Three measurement traps in that same script, each of which produced a confident
wrong verdict:

- The follow camera **slides sideways mid-walk** when it has nowhere to sit
  (`reframeAround`). Reading the yaw after the walk gives a basis the movement
  was never made in. Pin the yaw for the duration of the measurement.
- `state.cameraOrbit.distance` reports the **damped** `currentDistance`, which
  camera collision has already pulled in. `zoom()` drives `targetDistance`.
  Comparing a target against a current produces a meaningless number.
- A probe tile inside a **collision footprint** stops the player dead and reads
  as "wrong direction" rather than "no room to walk".

`cameraYaw` is a **getter-only** property installed on the player in `main.js`.
Assigning to it throws. Read it; never write it.

## 6. Other invariants worth knowing

**The island mask is the whole world.** `Terrain.js` has no Three.js import, so
the entire island is testable in plain Node — keep it that way. An inverted
`smoothstep` once returned 0 at the centre and put an ocean in the middle of
the island.

**Facade detail must sit on the street-facing face.** A lot on a north-south
street fronts on X; one on an east-west street fronts on Z. Getting this
backwards is invisible in the data and catastrophic on screen: every building
turns its blank back to the road and the street reads as empty ground. All 14
call sites in `Machiya.js` were wrong once.

**Collision is built from the same lot arrays as the geometry**, and records a
height per column. Keep it that way: a wall you can see must be a wall you bump
into, and a 2D footprint cannot tell the camera it is inside a roof.

**`lit windows` must stay proud of the eave.** Windows placed at the wall plane
sit underneath the eave overhang and are invisible from the street.

**Emissive materials ignore the day/night curve.** Lit windows, neon, lamp glass
and signs hold `uLightStrength = 1.0` whatever the hour, because they are their
own light source. They are the entire night-time image; dim them and the town
goes black.

**The key light must never point below the horizon.** After sunset a moon takes
over and stays above the ground. Without that, every upward surface reads as
back-facing and the world renders as a flat dark slab.

**Saturation is the whole art direction.** Shadows rotate hue 6–9° toward blue
and roughly *double* saturation while value barely moves. Multiplying value
instead — the default in any lit 3D scene — drains chroma and produces dead
grey. Measured Rimsoft median saturation is 0.30–0.45.

**Non-emissive palette entries stay below L=0.86.** The shader adds rim and
subsurface bleed on top of the lit term, so a base near white clips and loses all
its shading. `palette-clipping.test.js` enforces this.

## 7. Testing philosophy

Every real defect in this build passed the unit suite and was found by looking at
a screenshot: the invisible world, inverted movement, misplaced facades, the
hair cap swallowing a head, legs below ground, the night ambient crushing
grass to L=0.14.

So:

- **Every bug you fix gets a numeric assertion.** Not a snapshot of current
  behaviour — a property that would have caught it.
- **Test properties, not outputs.** "Forward moves along the camera view at
  *every* camera angle" beats "forward moves to (0,-1) at yaw 0".
- **`lint-undefined.test.js` exists because missing imports compile cleanly.**
  The bundler treats them as globals and only a runtime `ReferenceError`
  reveals them. It has caught four real bugs of that shape.

## 8. Known issues

**Oversized `concrete` slabs in the suburbs.** Roughly 29 boxes near the konbini
are 8 × 0.12 × 6 — thin in Y but 8 × 6 in plan — and render as wide grey plates
that dominate the view. Hiding the house material group confirms `concrete` and
`stone` are the culprit, but the emitting call site has not been identified;
`SuburbRegion.js` lines 105, 133, 155, 163, 219, 229, 264 and 304 are all
candidates. The intent was presumably a thin floor or footing slab.

To find it:

```bash
node --input-type=module -e "
import { WorldPlan } from './src/world/World.js';
const b = new WorldPlan().buildAllStatics();
const hits = b.get('concrete').filter(o =>
  Math.abs(o.x - 113.5) < 1 && Math.abs(o.z - 167.5) < 1);
console.log(hits.length, hits.slice(0, 4));
"
```

**Nothing else is known-broken.** Treat that as a claim to be tested, not
trusted — the bug rate in this project has been consistently "looks fine in the
data, visibly broken on screen".

## 9. Conventions

- **Commit format:** Conventional Commits. Scoped to the project, since the
  monorepo shares one history:
  `feat(city): ...`, `fix(shader): ...`, `test(controls): ...`,
  `docs(spacebunnyalpha): ...`.
- **Write the commit body as a post-mortem.** The value is in *why* — the
  measured numbers, the misleading symptom, the thing that made it hard to
  find. Several commits here exist mostly to record that.
- **Branch per change.** `main` is shared with other agents' projects; never
  commit to it directly.
- **Comments explain *why*, not *what*.** The existing code carries a lot of
  load-bearing rationale. Match it, and keep it when editing — several comments
  are the only record of a bug that is otherwise invisible.
- **No new dependencies** without a reason worth putting in a commit body.