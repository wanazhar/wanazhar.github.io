# Apex GP — Formula 1 Championship

An arcade Formula 1 championship for `wanazhar.github.io/f1`, built with vanilla
Three.js and no external assets. Six circuits, qualifying and race sessions, ten
drivers on the grid, championship points, and development upgrades between rounds.

## Running it

```bash
npm install
npm run dev      # http://localhost:5174
npm test         # regression suite
npm run build    # -> ../f1
```

## How it fits the monorepo

| | |
|---|---|
| Source | `_f1-src/` |
| Built output | `f1/` |
| Vite `base` | `/f1/` |
| Deployed by | `.github/workflows/pages.yml` |

Built output is committed, matching the other games here. The deploy workflow
builds this project and uploads the repository root as the Pages artifact.

## Controls

| Action | Keyboard | Touch |
|---|---|---|
| Throttle | `W` / `↑` | GAS pedal |
| Brake | `S` / `↓` | BRAKE pedal |
| Steer | `A` `D` / `←` `→` | Thumb stick |
| DRS | `Shift` | DRS button (straights only) |
| Deploy ERS | `Space` | ERS button |
| Recover to track | `R` | — |
| Camera | `C` | — |
| Pause | `Esc` | — |

Gamepads work through the standard mapping: right trigger throttle, left trigger
brake, left stick steering.

Touch controls appear automatically on coarse-pointer devices. The layout asks
for landscape on phones and respects device safe areas.

## Architecture

```
src/
  main.js                     championship state machine, screen dispatch
  core/
    Game.js                   renderer, scene, fixed-timestep loop
    CameraRig.js              chase / cockpit / trackside cameras
    InputController.js        keyboard, touch and gamepad
  track/
    circuitShapes.js          radial layout generator
    circuits.js               the 23 real circuits: names, venues, grip, metadata
    circuitData.js            GENERATED real centrelines (fetch-circuits.mjs)
    trackGeometry.js          centreline, racing line, speed profile, checkpoints
  physics/
    CarPhysics.js             the car: tyres, drivetrain, load transfer, thermal model
    drivers.js                11 real 2026 teams, 22 real drivers, skill presets
    upgrades.js               development tree
  ai/
    AIDriver.js               path follower, speed planner, traffic, recovery
  race/
    LapTimer.js               lap validation, sectors, live timing order
    RaceSession.js            the grid, the step loop, barriers, classification
    quickRace.js              Quick Race: circuit + team picker, field builder
  championship/
    ChampionshipManager.js    calendar, points, standings, saves
  render/
    TrackMesh.js              procedural track, kerbs, walls, grandstands, car mesh
  ui/
    UIManager.js              HUD and panels
  util/
    math.js                   shared maths and formatting
    storage.js                localStorage persistence
```

The load-bearing rule is that **track geometry, physics and the championship are
free of Three.js**. Everything testable runs under plain `node`, which is why the
test suite can assert on real numbers — lap times, braking distances, tyre
temperatures, championship totals — rather than on screenshots.

## The decisions that matter

### Circuits are radial, not straights-and-corners

The obvious way to author a circuit is a list of straights and corners. That
cannot work: a closed loop's arc chords miss the start line by hundreds of metres,
and solving for scale factors to close it is so badly conditioned that the layouts
fold through themselves. Circuits here are instead a **radial profile** — a base
radius plus a handful of `{ at, radius, spread }` pins — which is closed and
non-self-intersecting by construction. Every angle maps to exactly one point, so a
circuit can never cross itself, and the shape stays tunable by moving one pin.

### The racing line minimises length, not curvature

The line is found by gradient descent on **arc length** within the track corridor,
then smoothed with a clamped circular blur. Minimising curvature — the tempting
choice — solves to "stay on the centreline", because a straight line has zero
curvature.

Two things then matter more than the optimisation itself:

- **Edge margin.** The line is held 4.5m inside the kerbs. A line that runs to the
  edge is a shortest path on paper and undriveable in practice.
- **De-kinking.** Gradient descent leaves steps where a limit binds. A step is not
  just ugly: the curvature spike at it drags the speed profile to a crawl, and the
  AI ends up braking for a corner that does not exist.

### The speed profile must be reachable *and* smooth

The profile is grip-limited, then given a backward pass for braking and a forward
pass for acceleration. Curvature is smoothed over ~72m before it becomes a speed
limit. Straight from sampled points it oscillates with a period of a few samples,
which produces a profile flipping between corner and straight speed every few
metres — braking events no car can perform.

The profile is built with roughly a third of the car's real grip in reserve. A
target the car cannot reach is worse than useless: the AI arrives too fast, runs
wide, and cannot recover.

### The AI drives the same physics as the player

`AIDriver` only produces `{ throttle, brake, steer }`. It cannot cheat with
different physics, only with a different skill profile.

Control is Stanley-style, and both terms are measured **at the car's own position
on the line**. Measuring cross-track error against an aim point ahead makes the
heading term and the cross-track term contradict each other in a corner, and the
car porpoises off the road without recovering. Steering is passed through a soft
saturation so a saturated controller always retains authority in the other term.

Speed planning scans the whole braking window for its slowest point and caps the
current speed by what the brakes can still shed — `v² = v_corner² + 2·a·d`.
Reading the speed of the straight *after* a corner, or applying the corner speed
immediately, both mean arriving far too fast.

### Physics bugs found the hard way

Each of these shipped once and looked plausible. The test suite guards all of them.

| Symptom | Cause |
|---|---|
| Car capped at 190 km/h at any engine tune | Thrust divided by wheel **circumference** instead of radius — a silent factor of 2π |
| Car ignores the steering wheel | Front slip angle computed without subtracting the steer angle, so a straight-moving car had zero front slip, no lateral force and no yaw moment |
| Stays stuck in first gear | Gear ladder far too short to ever reach the upshift point |
| AI spins on every corner entry then reverses into the scenery | Reverse latched on a momentary brake input, and never cleared by throttle |
| AI understeers off the road while braking | Braking and cornering coupled into one friction budget; the front does the braking in reality, and the two axles are separate |

## Known limitations

- **AI pace.** The AI completes every circuit, but it runs wide more often than it
  should and needs recovery a few times per lap. Racing a full field is playable
  rather than convincing. `scripts/ai-pace.mjs` is the bench for this; the numbers
  there are honest.
- **Recovery is automatic for AI cars.** A car that ends up well off the road and
  stationary is put back on the racing line after ~2.5s. The penalty is the time
  lost getting there. Without it, races never finish — a car with its heading and
  cross-track errors both pointing away from the track steers further out with the
  lock on and drives away down the access road indefinitely. The player gets a
  manual `R` instead.
- **Tyre thermal model is a heuristic**, tuned so a normal lap sits in the working
  window and abuse cooks them. Not derived from a first-principles heat model.
- **No pit stops.** Tyres degrade over a stint and development points are spent
  between rounds, but a race does not stop.

### Two modes

**Championship** — strictly sequential, by design. `currentRound` returns
`CIRCUITS[championship.round]`; rounds are raced in calendar order, points
accumulate, and upgrades cost development points earned from the previous round.
Being unable to jump to Silverstone in round one is correct behaviour for that
mode, not an oversight.

**Quick Race** — any of the 23 circuits, any of the 10 teams, racing immediately.
No qualifying, no points, no development, no save. `src/race/quickRace.js` builds
the field and the screen flow; `main.js` threads a `quickRace` selection through
the same `startSession` so the build, loading progress and error handling are
written once. `finishSession` guards `applyRaceResult` behind
`if (!activeSession.quickRace)`, so a Quick Race result cannot touch the
standings, and `quit` / `next-round` return to the Quick Race picker rather than to
a calendar round the player never entered.

The player takes a seat *in addition to* the full 20-car grid rather than
replacing a named driver. Removing a real driver to make room would misrepresent
the field, and would break saved championships keyed by driver code.

### Real data

**The layouts are the real layouts.** Generated by `scripts/fetch-circuits.mjs`
from published centrelines (f1tenth/f1tenth_racetracks, GPL-3.0, itself derived
from OpenStreetMap) and, for the seven venues with no published centreline, from
the circuit outline's medial axis (bacinger/f1-circuits, CC-BY-SA).

Every lap is within 0.2% of the real distance: Monaco 3.330km against 3.337, Spa
7.002 against 7.004, Silverstone 5.890 against 5.891. Each source is rescaled to
the published lap length, which is also the check that it is the right circuit --
the published files claim metres but are not consistently scaled, Monza arriving
at 1.30x and Silverstone at 1.29x.

Real: circuit names, venues, cities, countries, corner counts, lap character,
surface grip, team names, driver names, liveries and colours.

No result, standing or record reflects anything real. The `SKILL_PRESETS` buckets
are invented and the team ratings are hand-assigned estimates of relative pace.
Names are used nominatively to identify the real-world subjects; no team or series
asset is included.

#### What went wrong getting here

The layouts were radial profiles until this change: a base radius plus corner pins.
That cannot produce a specific circuit, because a star-shaped loop has nowhere to
put a hairpin beside a long straight. It was being fitted to real lap lengths, and
it got them -- while looking nothing like the circuits it was named after.

Three real failures along the way, all caught by measurement rather than by looking:

- **Sampling density cut every apex.** Coarsening the centrelines to 20m to save
  bundle size made Miami's tightest corner a 218m radius where the real circuit is
  full of hairpins, and the AI ran off track on 87-99% of a lap on most circuits. The
  cause was that lap length is unchanged by a cut apex -- only corner radius moves.
  It is back to 6m, and the AI is on track 0-2% of the lap on 17 of 23 circuits.
- **Ranking sources by "most self-separation" is the wrong metric.** It sends 15 of
  23 circuits onto the derived medial axis, because a loop reduced from an outline
  tends to round off its own hairpins and so self-approaches slightly further. The
  published centreline is smoother and is now preferred unless it is unusable.
- **Miami's published centreline is not Miami's layout.** It has the right length
  and does not self-cross, and it carries no corner tighter than 235m. It is listed
  in `FORCE_OUTLINE` rather than worked around by loosening a rule, because a
  general "tightest corner" check was tried and rejected: finite-difference
  curvature on a densely sampled real centreline is dominated by sampling noise at
  the apex rather than by the corner.

Suzuka is the one circuit whose centreline is the derived medial axis *and* is
degraded by it: the figure-of-eight's offsets fold through each other at the
crossover, so its lap touches itself at ~0m. The real Suzuka crosses over itself on
a bridge, so the topology is right and the separation is not. It is exempted by
name in the test suite rather than by loosening the bound for everything.

#### Real circuits come close to themselves

The old assertion that a lap must keep a car width from itself is impossible to
satisfy with real layouts. Monaco's tunnel run passes back over the harbour
section, Baku's castle section folds back on itself, and Suzuka crosses over
itself. Those are the circuits. What is still guarded is a lap that folds *through*
itself, which is what the radial generator could produce and what a failed
medial-axis reduction produces.

### Car-to-car contact

There were no collisions between cars at all: `RaceSession` resolved the track edges
and nothing else, so cars drove through each other in traffic. Added as a second pass
over the field each substep -- inside the per-car loop, the first car processed is
already out of the way when the second is tested, so which car ends up on the inside
of a shunt depends on grid slot rather than on where the cars met.

Cars are oriented boxes, 5.2m x 2.0m, resolved with the Separating Axis Theorem over
four candidate axes. A circle would be wrong in the only direction that matters: two
cars side by side are 2m apart, and a circle wide enough to represent the car's
length would push them apart when they are nowhere near touching.

Three things turned out to matter more than the shape:

**Restitution is 0.12, on purpose.** Two F1 cars meeting at 40m/s do not bounce, they
deflect. A springy collision is arcade, and worse, it lets the faster car leave the
contact faster than it arrived -- contact that *adds* to the car that was already
quicker is not racing.

**The separating bias is bounded by grip, not by taste.** Yaw and shove are both
velocity changes, and a large one is not recoverable by steering: the car is already
sliding before the driver has finished reacting. A yaw kick of 1.1 rad/s sounds
modest but demands 4.5g of lateral acceleration at racing speed, so a hit spun the
car unrecoverably and the AI sat in the barriers. Caps are now 0.18 rad/s and
1.2 m/s, both well under what grip can hold.

**The lever arm comes from where the other car is, not from the contact normal.** For
a car alongside, the normal is purely lateral and has no longitudinal component, so
deriving the lever from it produces exactly zero rotation in precisely the
wheel-to-wheel case that most needs it.

Contact is genuinely a trade, measured rather than argued about: with
`APEXGP_CONTACTS=0` the season completes 24/24; with it on, 23/24. It buys cars that
do not pass through each other at the cost of one round where a car gets stuck.

### AI pace

The AI was driving at 86% of the generated speed profile, which is about a third of
the achievable lap time, and the factor had been carried forward unexamined. Sweeping
it (`scripts/ai-pace-sweep.mjs`) showed the honest problem is that no single constant
fits: Albert Park would hold 0.98 at about 1% of the lap off track, while Spa sent
the AI spinning for 64% of the lap above 1.00.

So the factor is now 0.93 and each driver adapts their own margin, slowly and within
a narrow band, from whether they are keeping it on the road -- which is what a driver
actually does. Measured effect on Albert Park: 140.6s -> 129.5s.

Spa still fails standalone at every pace setting. That is a separate geometry problem,
not a pace problem, and it is not fixed.

### Start lights

A race begins when the lights go out, not when the scene loads.

Five pairs light one per second, then all out, with a short reaction delay between
lights-out and the field moving. Input is **discarded, not clamped**, while the lights
are on -- a car that creeps under full throttle reads as a broken input rather than as
a start procedure.

Two things this needed that were not obvious:

- **The rescue must be suppressed during the hold.** Every car is stationary on the grid
  by definition, so the "spun and crawling" rescue -- which exists precisely to catch
  stationary cars -- fired on the entire field two seconds into the countdown and
  scattered the grid across the track. Being held is indistinguishable from being
  stuck; only the lights can tell them apart.
- **Green is edge-triggered.** The sequence goes from held to green inside a single
  frame, so polling for the state misses it and the gantry never changes. It is also
  driven from the session rather than a UI timer, so the lights and the hold cannot
  disagree.

The fifth light initially never appeared: the count of completed intervals reaches five
one second *before* the fifth pair should light. Caught by a test asserting the lights
come on as 1,2,3,4,5.

### Minimap

Top centre -- the one region no other HUD element occupies, and where a broadcast puts
the track map anyway.

The outline, the racing line and the car dots all come from a single `TrackProjection`.
That is the point: two projections of the same circuit differing by a rotation or a
scale would look entirely plausible and put every car on the wrong part of the track.
`trackMapPath` throws its numbers away after drawing, which is right for a static
outline and useless for a dot that moves, so the transform is exposed as a class and the
outline is drawn through it.

Redrawn at 20Hz. 23 dots rewritten every frame is 23 DOM attribute writes per frame for
something nobody can read at that rate.

### HUD overlap, and a pre-existing collision

The brief for the minimap was "no overlapping UI", which turned out to matter more than
expected -- checking found the timing tower sitting **on top of the position number** at
every viewport. It had been a separate absolutely-positioned box separated by
`calc(var(--pad) + var(--safe-t) + var(--ui-lg))`, and that calc silently evaluated to
just `--pad`. A stale media query still carried a dead copy of the same `top`.

Fixed structurally rather than numerically: the right-hand HUD is now one grid column, so
the position, the gap and the timer stack instead of being positioned independently. A
column cannot overlap itself, at any viewport, and a fourth element does not need a new
invented offset.

Verified by measuring every visible HUD region's bounding box and intersecting them at
six viewports from 740x360 to 1600x900 -- including the new gantry, which is floored
clear of the minimap with `max(11rem, 34%)` rather than placed at a bare percentage.

### Ground, and the cockpit

**There was no ground.** Everything past the 26m run-off was the lower half of the sky
gradient: a flat green field with no texture, no horizon and no parallax. That is what
made the circuits read as "literally grass", and why the cockpit looked like the car
was floating in a void. There is now a large textured quad under everything.

The repeat is the whole trick. The grass texture is applied at one tile per ~12m; at the
`repeat: [2, 1]` it previously had, a 256px texture covered the entire circuit, so each
texel spanned tens of metres and the detail averaged out to flat paint.

Deliberately still featureless. Real terrain -- elevation, trees -- would be a lot of
work for a circuit meant to look flat and fast, and anything tall near the track would
occlude the barriers and crowds, which are what actually sell a venue.

**The cockpit camera was the chase camera at eye level** -- the same view of the same
world with the player's own car nowhere in it. It is not a cockpit, it is a floating
camera, and the absence is felt more than noticed: the view looks wrong without anything
to explain why the horizon sits where it does.

There is now an interior, parented to the camera so it cannot lag a frame behind the
view, hidden outside cockpit mode so it costs nothing elsewhere, with the steering wheel
following the steering input.

Its first version filled the screen, which is the standard failure and worth recording:
at the default 62 degree vertical FOV on a landscape phone the frame is about 108
degrees across, so the visible half-width at one metre is ~1.36m. Structure meant to sit
at the *edge* of the view has to be at x = +/-0.9m. At +/-0.4m -- where it started -- it
is halfway across the screen and reads as a wall.

### The AI following, and why it did not

The AI considered the car ahead only **laterally**: it would move out of the way, but
never matched its speed. And `#neighbour` only looked **90 m** ahead -- less than the
stopping distance from 200 kph.

Together those mean an AI arrives at full profile pace with no time left to react. With a
car parked on the racing line at Sepang that produced **26 contacts from 12 different cars
in one minute**, and the pile-up behind them is what "the AI crashed and then followed me"
describes.

Fixed by making a car ahead a *speed limit*, not only a line to avoid, and by scaling the
look-ahead with speed (three seconds of travel, capped at 320 m). Same scenario after:
**10 contacts from 6 cars**. Better, not solved -- the remainder is cars queueing into
each other behind the obstacle rather than into it, which is a different problem.

### Elevation: fetched, tested, and never drawn

Real DEM elevation had been in the data since PR #17 -- resampled into every track sample,
gradient-clamped to a driveable 10%, and unit-tested for monotonicity. Nothing read it.

The road ribbon hardcoded `0.02` for its height. The barriers started at `0`. The kerbs
used a single `KERB_HEIGHT` constant for the entire buffer, in a vertex format that only
carried x and z. `syncCarMesh` pinned every car to `y = 0`. The chase camera held a fixed
altitude and looked at a fixed height. So Monza's real 182m-196m was drawn as a flat
plane, and the tests passed the whole time, because they asserted the *data* was sane and
never that the world used it.

Rendered span against the real span:

| circuit | real | rendered |
|---|---|---|
| monaco | 38m | 37.6m |
| monza | 14m | 14.0m |
| bahrain | 14m | 13.6m |
| sepang | 9m | 9.5m |
| montreal | 6m | 6.1m |

`CarPhysics` now carries `y` and `pitch`; the race session supplies both from the located
sample, so the gradient is measured off the road the car is actually on. Trackside
furniture (barriers, buildings, trees, hoardings) follows the road, and the horizon treeline
-- a ring, with no per-sample height -- is pinned to the circuit's mean ground level so a
circuit at 190m does not float above a forest growing out of the plane.

### Pit stops

`car.pitStop` was a boolean that was initialised and never read: no lane, no box, no tyre
change, and a race ran to the flag. With compounds and degradation reaching the car, a stop can
finally be a decision rather than a lap-count animation.

The lane is a corridor beside the main straight, in the same `(lap fraction, lateral)` space the
race already tracks -- entry before the line, the box in the middle of the lane, exit after it.
While in it the FIA 80 km/h limit applies. Crossing the box with a stop requested fits fresh
rubber at 68 C, not ambient, because a tyre out of the pit is not cold.

Three things had to be true, and each was a real fault found by measurement:

**The rescue fired during every stop.** A car in its box is stationary, which is exactly the
signature of a car beached in the run-off. `PIT_STOP_SECONDS` is 2.4 against a rescue delay of
2.5 -- the same length to within a tenth of a second -- so the rescue dragged cars back onto the
racing line mid-service. One car took **507 seconds** for the lap it stopped in.

**The lane test had an inverted sign.** `(lateral - PIT_SIDE * halfWidth) * -PIT_SIDE` is
algebraically identical to `PIT_SIDE * lateral - halfWidth` and behaviourally the opposite: it
evaluates to `lateral + halfWidth` when `PIT_SIDE` is -1, so it was true for nearly the whole
width of the road and false for the actual lane. Every car was "in the pit lane" while racing on
the circuit, which applied the 80 km/h limit *on track*, and none of them reached the box.

**The barrier walled the pit off.** Cars cannot pass `half + 1.6`, so a lane at `half + 5` was
unreachable and cars queued against the wall for the whole window. There is now a gap through
the pit window on the pit side -- the only place the circuit is not closed.

And the decision itself had to be priced honestly. A stop costing only the two seconds in the
box would never be worth taking, so the AI is *asked* whether it wants to stop and then has to
steer there itself: lane in, box, lane out, measured at **about 40 seconds** lost against a
normal lap, of which 2.4 is stationary.

The first attempt cost 185 seconds, because the driver began steering for the lane the moment it
was asked and ran off the racing line for most of a lap. Drivers do not cross the circuit on
decision -- they run to the end of the straight and then turn off, which is what it does now.

### Tyres: compounds and wear, finally reaching the car### Tyres: compounds and wear, finally reaching the car

`compounds.js` has always carried per-compound grip, wear rate, operating window and warm-up.
`getCompound` was imported by `RaceSession` and never called; the one function that applied
`compound.grip` was called from the setup screen to print a label. Choosing Soft over Wet
changed a swatch and nothing else.

Wear was worse. It accumulated at `0.0000075 * dt` with no compound and no unit, the grip cost
was a flat `1 - wear * 0.18`, and over a five-lap race that came to **0.013%**. The HUD wear bar
read 0.0% for an entire race and "soft tyres wear faster" was simply false.

Three things had to be true for it to work:

**Wear is charged per metre, not per second.** `wearRate` is documented as a fraction of peak
per lap, and dividing by lap *time* meant a driver who lifted to save a tyre simply took longer
to wear it out. Protecting one bought nothing, so the whole model reduced to "always pick the
hard".

**The AI can manage a tyre.** Without it, degradation is a tax rather than a decision. `AIDriver`
backs off once a tyre passes the point where it actually costs grip, scaled by `skill.tyreCare`
(0.95 for ace down to 0.3 for a backmarker). Only past the cliff -- early in a stint `wearGrip` is
flat at 1.0, and lifting there throws away pace for nothing.

**The authored numbers had to be made self-consistent.** Wired up, the original wear rates
disagreed with the grip spread: a soft beat a medium for **0.89 laps** and then fell behind it
forever, making the fastest compound in the game a mistake to run. Recalibrated from crossover
points, and wear now has a cliff past 18% because a linear fade alone never produces the
decision F1 is about.

Measured on a steady-state skidpad, 55 m/s, temperatures in the window:

| wear | soft | medium | hard |
|---|---|---|---|
| 0.00 | **2.720** | 2.685 | 2.636 |
| 0.20 | 2.388 | 2.352 | 2.295 |
| 0.45 | 1.590 | 1.563 | 1.516 |

Fresh soft beats fresh hard by 3%, and a dead soft is 42% down. Compounds order correctly at
every wear level, and a soft is worth running early and stops being worth running -- which is the
only reason choosing one is a decision.

### What this was actually blocked by

Not by grip. Four attempts were spent on cornering-speed theories and every one was wrong: the
field uses **19-21% of the friction circle in steady cornering** and drives at **80-91% of the
speed profile's prediction**, so there was never a margin problem to fix.

It was blocked by #29. Cars spun, and a spun car could not reverse, so the field spent ~29% of
each race jammed against a barrier facing backwards and was rescued 651-801 times. Degradation
made cars slower, slower cars got caught in traffic, and caught cars spun. Fix the recovery and
the tyre model has room to work.

### Four things that were built but not connected

A survey of the simulation found four systems where the data existed, the numbers moved,
and nothing downstream read them. All four were invisible in normal play because each had
a plausible-looking surface.

**The grid had ten slots for a 23-car field.** `gridSlot` clamped anything past the end
back onto the last slot, so grid positions 9-22 -- 14 cars -- spawned at identical
coordinates. Measured over the first 40 seconds of a race:

| | distinct spawn points | contact car-steps |
|---|---|---|
| before | 10 (min separation **0.00m**) | 19133 |
| after | **23** (min separation **5.6m**) | **15067** |

21-53% fewer contacts depending on circuit, and the no-overlap property is now structural:
`gridSlot` extends backwards along the centreline rather than clamping, so it cannot run
out of slots for any field size.

**Four of six purchasable upgrades did nothing.** `applyUpgrades` computed
`downforceArea`, `maxBrakeForce`, `peakGrip`, `optimalBand` and `drsDragReduction` and
returned them; `CarPhysics` read the module constants instead, so development points were
spent on a number nothing looked at. The two upgrade tests asserted on the *returned
object*, which is precisely why they kept passing -- they now build the car and read its
fields. Braking distance from 80 m/s goes from 139.8m to 109.6m across the tiers, and
downforce at speed from 29.0kN to 35.7kN.

**The AI could not deploy ERS.** `deployErs()` had exactly one call site, in the player's
input path. The entire field had a straight-line tool the player did not. Measured after
the fix: 324 deployments across 23 cars in 120 seconds; before, zero by construction.

**Still known-inert, deliberately:** `TEAMS[].reliability` and the per-circuit
`circuit.grip` (0.90 at Miami, 1.06 at Silverstone). Both are read by the tuning scripts
but not by `src/`, which means the balance tools and the game currently disagree about
every circuit. Both are listed as load-bearing below rather than quietly wired up, because
wiring them changes handling everywhere at once and wants its own measurement.

### Qualifying is a knockout, not a time trial

It used to be a three-lap race with the start lights switched off: every car on track at
the same time, nobody eliminated, and the grid produced by sorting every best lap. That is
not qualifying. Nothing about a lap mattered differently from any other -- in real
qualifying a lap has to be a *flying* lap, out on cold tyres, learn the circuit, then commit
-- and the tension that makes qualifying a session, a full field with five cars going home,
did not exist.

Now three segments of five eliminations, the shape F1 uses:

    Q1   23 cars, 5 eliminated  ->  18 remain
    Q2   18 cars, 5 eliminated  ->  13 remain
    Q3   13 cars fight for pole

A driver's result is the best lap across every segment they appeared in, so being quick in
Q1 and then knocked out in Q2 still starts them on that Q1 time. That is what makes the
knockout a risk rather than a formality.

The rules live in `src/race/qualifying.js` as pure state with no session or UI code, so the
format is testable without a browser and the rules sit in one readable place instead of
being spread through the session lifecycle. Two edge cases it handles that are easy to get
wrong: a car that never took the start is eliminated on the same terms as one that set no
time, and a short grid is never eliminated below six cars.

### Elevation: real data, from two sources

I said earlier this could not be done honestly. That was wrong, and the user was right
to push back on it.

Two obvious sources come up empty, which is what made it look impossible:

- **OSM `ele` tags.** Queried directly: Monza's raceway is 216 nodes and *none* of them
  carry elevation. Raceways are not routinely surveyed with height in OSM.
- **The published centrelines.** The CSV mirrors the geometry comes from have no
  elevation column at all.

But the data is reachable in two stages: **OSM for where the circuit goes, a DEM for how
high it is.** `scripts/fetch-elevation.mjs` does exactly that, per circuit:

1. Overpass for the `highway=raceway` ways near the circuit's real coordinates.
2. Open-Meteo's elevation API for a DEM reading at every one of those nodes.
3. Project each node onto *our* centreline, so the profile is keyed by lap distance
   rather than by OSM node order — the two start in different places and must not be
   assumed to agree.
4. Smooth with a circular moving average, then clamp the gradient.

**The clamping is the part worth explaining.** SRTM-resolution DEM data is metre-scale
noise with no business in a racing surface, and a profile obeying it launches cars off
crests that do not exist. Real circuits are graded surfaces on real hills: the tens-of-metres
change is real, the metre-scale noise is not. The profile is also kept *absolute*, so Spa
really is 400m above sea level rather than being flattened to zero.

What came back, checked against reality rather than against itself:

| Circuit | Fetched | Real? |
|---|---|---|
| Monza | 182–196 m, 14 m range | Mon circuit sits at ~190 m, ~15 m change ✓ |
| Monaco | 2–40 m, 38 m range | Harbour level up to La Turbie ✓ |
| Sepang | 31–40 m | ~30–40 m ✓ |
| Bahrain | 7–21 m | Sakhir is 7–20 m ✓ |
| Montreal | 8–14 m | Île Notre-Dame ✓ |

A test asserts those relationships, because a mis-keyed projection or a wrong circuit's
nodes would produce a profile that *looks* perfectly fine and is not.

**Seven of twenty-four so far.** The public DEM endpoint rate-limits hard — measured, not
documented: about three calls in a burst, then 429. The script is resumable (completed
circuits are cached, and the output is written after every circuit rather than once at
the end, which the first version did and lost everything when it was interrupted), so
running it again fills in the rest.

### What is NOT done yet

**Elevation is not rendered.** `buildTrack` now sets `sample.y` and `sample.lineY`, and
both are tested, but the track mesh, the camera and the car physics do not read them.
Nothing is higher or lower on screen yet. The data and the geometry are real; the
consumption is the missing half.

### Trackside world, and per-circuit identity

The centrelines are real, so every circuit's *shape* is right. Everything around it was
generic: the same green, the same stands at the same spacing, the same run-off. Two
circuits that differ by a factor of three in width and are six thousand kilometres apart
looked identical.

`environments.js` gives each circuit its actual setting — street, parkland, permanent,
desert or coastal — with relative tree and building density and a ground tint. It drives
`Surrounds.js`, which builds run-off, barriers, buildings, trees, a horizon treeline and
trackside hoardings.

The two differences that change how a circuit *drives*, not just how it looks:

- **Run-off.** A street circuit gets 2.5m and a permanent one 14m. Monaco has walls at
  the edge of the road; Silverstone has room to put a car off and recover. That comes
  from the profile, not a hand-tuned constant per circuit.
- **Barriers.** Solid walls for street circuits, armco everywhere else. Drawing a wall
  round everything flattens the difference between Monaco and Monza more than any amount
  of scenery can put back.

The **horizon treeline** is doing more work than its cost suggests. Without a reference at
the far side the world simply stops at the edge of the ground plane and the circuit reads
as a diorama on a table. It is the cheapest depth cue available.

Everything is instanced — a plausible treeline is tens of thousands of trees, which is
one draw call rather than tens of thousands. The whole module costs about eight.

### What this is not, and why

**Elevation is not modelled.** Every centre is at y = 0. Spa's Raidillon and Monaco's
climbs are the most recognisable things about both circuits and neither is here.

This one is worth being firm about. Real elevation needs real survey data — OSM `ele`
tags per node, or a DEM. Inventing plausible-looking height numbers would be *worse*
than flat, because a wrong hill changes the driving as well as the view: it would make
players lose time on terrain that does not exist. There is a test asserting the absence
stays deliberate, so adding invented elevation has to be a documented decision rather
than a quiet default.

**Corner-by-corner furniture is generated by character, not surveyed.** Gravel traps,
kerbs and barriers land where the layout algorithm puts them. Real circuits place them in
specific places because of specific terrain.

**The tree line is a ring**, banded to a radius around the circuit centre, not placed
where trees actually are.

Also fixed along the way: the run-off was first built as a flat untextured band of bright
green with a hard edge, which read as a painted lane either side of the road — the single
most unnatural thing a circuit can look like. It now reuses the ground's own grass
texture at a finer repeat, so it reads as the same field mown differently, which is what
a run-off actually is.

### Motion controls

Gyroscope steering, offered alongside the on-screen stick rather than instead of it.
Roll steers.

**Steering only.** Throttle and brake stay on the on-screen pedals even in motion mode.
That is a usability decision, not a limitation: tilt is a good steering input because it
is continuous, proportional and needs no thumb on the glass, but it is a poor pedal.
Holding a phone at a fixed angle to keep the throttle down is uncomfortable within a
minute, the phone cannot lie flat on a table, and it turns a standing start -- where you
want full throttle immediately -- into something you have to *achieve* rather than
press.

The stick normally supplies throttle and brake from its vertical axis, so hiding it for
motion mode would leave the player with no pedals at all. Hence the two large buttons
at the bottom of the screen, bound through the same `bindButton` path as every other
on-screen control.

**The steering sign was wrong, and only hardware could have said so.** Tilt right, the
car went left. Positive `steer` means *left* in this physics model, so the mapping
needed the opposite sign to what the spec implied. The tests assert it in the player's
terms -- tilt right, car goes right -- rather than in terms of which raw axis moves,
because the raw axis is the part that differs between devices. `setInverted` still
exists for hardware that reports the other way.

Three things make device orientation controls fail silently, and all three are handled
rather than left for the player to discover:

- **Permission.** iOS 13+ requires `requestPermission()` from inside a user gesture.
  Called anywhere else it returns `denied` with no error. The request is also raced
  against a timeout, because some builds expose the method and return a promise that
  never settles -- which would otherwise leave the settings screen awaiting forever and
  a button that appears to do nothing.
- **Null readings.** Plenty of hardware fires `deviceorientation` perfectly happily
  with `beta` and `gamma` set to `null`, forever. Naive handlers get `NaN`. The first
  *real* reading is awaited, and its absence is reported instead of ignored.
- **Secure context.** `DeviceOrientationEvent` is HTTPS-only. Over plain `http://` the
  API is still present, nothing throws, and no prompt appears -- the events just never
  fire. Without a specific check that is indistinguishable from hardware with no
  gyroscope, and the advice given ("check your sensors are enabled") is wrong.

Also: `stop()` discards the cached reading, because `start()` trusts a stored reading
as proof the sensor is live -- so a controller switched off and on would report success
without the sensor ever having spoken. A refused switch restores the on-screen controls,
because a scheme that was declined must not also take away the one that works.
Switching scheme releases anything held, since a control hidden under a finger never
receives its `pointerup` and a stuck throttle is a car that drives off on its own.

### Setup: driver, tyres, weather

Quick Race goes circuit → setup → race, and the setup screen is four blocks of
choices that change how the race is driven rather than what it is.

**Driver.** Take a real driver's seat in their team, or a reserve seat. Taking a
named seat puts you in their car for that race and keeps their name on the timing
screen; that driver then leaves the grid, so the field stays at the regulation 22
rather than becoming 23 with a duplicate. A reserve seat adds a car and leaves
everybody where they were, which is what "reserve" means and is stated on screen.

**Tyres.** Five compounds with a real trade in both directions: peak grip against
how long it lasts. `wearRate` is a fraction of peak grip lost per lap, so it is
comparable between compounds rather than being a multiplier on an opaque thermal
model. The screen estimates life in laps, because choosing blind is not a choice.

**Weather.** Four states with their own sky, fog, visibility and spray. Rain costs
grip, and the grip multiplier is applied to the whole field rather than only the
player -- the AI faces the same conditions it would in a race, or the rain is
cosmetic for everyone but you.

The three multiply rather than add, and that is deliberate: a bad compound on a wet
track is worse than either problem alone, which is what makes the choice matter in
the rain instead of being a flat speed penalty. Circuits that drain well keep more
grip than the raw weather figure suggests.

Running the wrong compound is allowed. It is a mistake you make once and then drive
around, and the screen warns about it rather than refusing to start.

Championship rounds get weather derived from the circuit's own theme rather than
rolled at random, so the season is reproducible and a night circuit does not
inexplicably race in daylight.

### Track preview

The venue picker draws each circuit from the same centreline the track is built
from, so the shape on the screen is the shape you race. It is not an illustration.

The rotation is anchored on the *tangent at the start line*, not on the position
of the first point. Anchoring on position made the drawn orientation depend on
where a circuit happened to sit in its source coordinate frame -- two identical
layouts offset by 900m came out rotated differently -- which makes the grid
incoherent and two circuits impossible to compare by eye.

### Driver avatars

Real photographs are licensed and not redistributable, so these are generated: a
helmet in the driver's team colours, with a visor, a highlight, and one of three
pattern families seeded from the three-letter code. The same driver always gets
the same helmet, so it identifies rather than decorates.

A team-mate shares the livery, so the *pattern* is what separates the two -- the
test asserts that specifically, because identical helmets for Verstappen and Hadjar
would be worse than no avatars at all.

### Bugs found while adding real data

Four of these were pre-existing and unrelated to the change that surfaced them.

**Standings never counted a win.** `standings` filtered history on `result.id`,
but history rows are written with `short` and nothing ever writes `id`, so the
filter matched nothing. Every driver reported zero wins and zero podiums all
season and the table fell back to sorting on points alone.

**Choosing a team changed nothing but the paint.** `setupForEntry` returned
`{ powerScale: 1, grip: 1 }` for the player and the team rating only for AI cars,
so picking Haas gave you a Haas-coloured car with a Red Bull engine. Both now take
their baseline from `TEAMS`.

**The DRS upgrade did nothing.** `applyUpgrades` computed the DRS tier and never
passed it through, so `CarPhysics` fell back to its default of 1. The player was
spending development points on nothing.

**The AI field was six identical cars.** Upgrade seeding scaled the team's
contribution by `(team.power - 0.975) * 40`, which assumes team ratings span a wide
band. The real ratings span 0.97-1.00 — about 3% — so that produced either 0 or 2
with nothing between, and a flat bonus for anything above 0.95 pace. Eleven
distinct setups now, and AI is capped at tier 2: `POWER_TIERS` run to 1.105, so a
tier-3 AI on top of a top team's rating beat a fully upgraded player outright.

McLaren and Aston Martin both sat at 0.985/0.99, as did Alpine and Williams —
four of the ten team choices were duplicates of another.

### Touch controls

One floating thumbstick. Both axes come from a single contact: sideways is
steering, up is throttle, down is brake.

This replaced a horizontal steering bar plus separate gas and brake pedals. That
needed two thumbs working independently, which is why the controls overlapped --
the pedal row sat on top of the ERS/DRS row at short viewport heights, and
neither was in a corner the player was reliably holding. The stick is drawn
wherever the finger lands, so it is always under the thumb.

Three separate bugs had to be fixed before any of it worked, and all three had the
same shape: the control layer was built, styled and visible, and connected to
nothing.

| Bug | Consequence |
|---|---|
| `new UIManager(uiRoot)` passed no `input`, and `#bindTouch` began `if (!this.input) return` | **No handler was ever attached.** Every control was inert. |
| Pedals wrote to `input.touch.throttle` / `.brake`; `read()` consulted `touchButtons`, filled only by the never-called `bindButton` | The pedals set fields nothing read. |
| `bindStick` measured horizontal travel only | No throttle at all from touch. |

None of them threw, so the game ran correctly and the controls simply did nothing.
The guard is now a thrown `Error`, and a test asserts the wiring exists.

Two more found while fixing the layout:

- `.hud-controls-toggle` had no `position: absolute`, so its `top`/`left` did
  nothing and it laid out as a full-width flex item across the top of the HUD --
  transparent, but over the timing panel and the mode row, eating taps meant for
  them.
- The stick knob was painted at the raw pointer offset rather than clamped, so it
  slid out of the ring and off the screen edge while the controls were still at
  full lock. The readout disagreed with the input.

Buttons release on `pointerup`, never `pointerleave`: with pointer capture the
element receives `pointerup` wherever the finger ends up, so releasing on leave
fires the moment a thumb crosses the button's edge.

There is a pause button on the mode row. `Escape` is the only pause on desktop
and a phone has no Escape, so there was previously no way to pause at all on
touch.

## Development benches

These are not part of the game. They exist because the AI and physics were tuned
against numbers rather than by feel.

```bash
node scripts/physics-lab.mjs      # 0-100, top speed, braking, peak lateral g
node scripts/circuit-lab.mjs      # per-circuit layout report
node scripts/tune.mjs check       # lap length, speed range, estimated lap time
node scripts/ai-pace.mjs          # AI lap times and off-track time
node scripts/track-test.mjs       # line-following in isolation, at several paces
node scripts/iso-test.mjs         # controller without the AI module
node scripts/profile-check.mjs    # is the speed profile achievable?
node scripts/simulate.mjs         # a full race, headless, with classification
node scripts/line-convergence.mjs # is the racing line fully relaxed? is the
                                  #   self-intersection scan exact?
node scripts/mesh-heading-check.mjs # does the car mesh point where it travels?
node scripts/simulate-all.mjs    # a full 23-round season, headless, classified
node scripts/fetch-circuits.mjs    # re-fetch the real centrelines (writes circuitData.js)
node scripts/circuit-perf.mjs      # per-circuit build cost, draw calls, corner radii
```

`scripts/tune-ai.mjs` sweeps controller gains across all circuits and is how the
current values were chosen.

### Circuit load time

Building a circuit is the one thing that visibly blocks the main thread, so it is
split into phases that yield to the browser between them and report progress. It
was originally a single synchronous call, which meant the loading screen was
painted once and then froze — indistinguishable from a hang on a slow device.

The yields wait for two animation frames, not one. A `requestAnimationFrame`
callback runs *before* paint, so awaiting a single frame lets the pending work run
first and the screen never actually updates.

Worst-case circuit load in headless Chromium is now about 1.5 s wall clock
(including GPU and texture upload), against roughly 2 s of pure JavaScript before
any of the work below.

It used to take up to two seconds. Almost all of that was the racing-line
relaxation, which runs `LINE_RELAX_ITERATIONS` passes over every sample:

- `LINE_RELAX_ITERATIONS` cut from 4000 to 1400. `scripts/line-convergence.mjs`
  shows the resulting line is within 0.04 m of arc length of the fully converged
  shortest path on every circuit, which is far below the smoothing pass that
  follows will erase anyway.
- `Math.hypot` replaced with `Math.sqrt` in the descent. `hypot` is specified to
  be overflow-safe and scales its arguments before squaring, which costs about
  three times as much for no benefit at kilometre-scale coordinates — and it was
  called twice per sample per pass.
- The per-sample right vectors are hoisted into flat `Float64Array`s instead of
  being read off sample objects millions of times.

The self-intersection check was quadratic — every pair of samples more than 220 m
apart, about 740,000 comparisons on the longest circuit. It now uses a spatial
hash whose cell size is at least the best distance seen so far, which is exact
rather than approximate: any point closer than `best` must lie in the 3×3 block
of cells around the point being tested.

The regression suite checks that hash against brute force on every circuit,
because a hash that silently misses a nearby pair returns a plausible-looking
number and quietly weakens the "must not pass within a car width of itself"
validation without ever failing. That check immediately paid for itself: the
first version compared raw array indices, and since the circuit is a closed loop,
samples 650 and 5 of a 661-sample lap are physically adjacent. It was reporting
4 m — one sample spacing — as the minimum self-distance. Separation has to be
measured along the lap in both directions.

Static scenery was also moved onto `InstancedMesh`. Grandstands and floodlight
pylons were a `Group` per structure, two to eight meshes each, which is around 200
draw calls per frame for scenery that never moves and is usually behind the
camera. That is now about 15.

Worst-case `buildTrack` is now about 160 ms, from ~2 s.

### Graphics

Everything is untextured `MeshStandardMaterial` in flat colours: a road is one
dark grey, the grass one green, and a grandstand a grey slab. No lighting rig
fixes that, because the missing information is the surface itself.

`src/render/textures.js` draws every texture into a canvas at load time -- no
image files, no asset pipeline. All seeded, so a circuit looks identical every
time and screenshots reproduce.

| Surface | Approach |
|---|---|
| Tarmac | Fine value noise plus long runs along the direction of travel, so the road's direction is legible at a glance |
| Grass | Mottling at two scales, plus very low-contrast mown bands |
| Barriers, stand structure | Concrete panels with joints |
| Grandstands | A crowd of coloured dots, thinning towards the back |
| Tyres | Circumferential grooves |

Two calibrations that were wrong on the first attempt and are worth recording:

- The tarmac noise started at `amount: 0.16, cell: 2` and read as cobbles from
  the driver's seat. Tarmac grain is fine and low contrast; it is now `0.07` at
  `cell: 1`.
- The mown grass stripes started at alpha `0.14` and were the loudest thing in
  the frame -- brighter than the cars, drawing the eye across the screen on every
  straight. That is worse than no stripes at all. Real mown bands are a few
  percent of reflectance apart; they are now `0.045`.

A texture on a mesh with no UV attribute silently does nothing: every vertex
samples texel (0,0) and the surface renders as one flat colour. The apron and
barrier walls both needed UVs added before their textures did anything.

Lighting:

- `scene.environment` was never set. Any material with metalness in it has almost
  no diffuse response, so with nothing to reflect it renders close to black --
  car bodywork, wheel rims and pylon metal all went flat and dead. A 64x128
  gradient sky is now generated per circuit and run through `PMREMGenerator`.
- ACES filmic tone mapping. Without it, anything above 1.0 clips straight to
  white, which is most of a sunlit white car and all of the specular highlights.
- Antialiasing was disabled above DPR 2, which is backwards: that is most phones
  and every laptop. It is now always on, and the pixel ratio is capped at 1.5 to
  pay for it.

The scene background is now that gradient sky rather than a flat colour.

### Car rendered 90 degrees off

The car slid sideways down the road at full throttle. `syncCarMesh` set
`rotation.y = -heading`, which is a plausible-looking mistake for someone
converting a 2D heading into a Y rotation.

Two conventions meet at that line:

- **Physics** advances the car by `vLong * (cos h, sin h)`, and track headings come
  from `atan2(dz, dx)`, so world `(x, z)` direction of travel at heading `h` is
  `(cos h, sin h)`.
- **The mesh** is modelled nose-forward along local `+Z` (front wing at
  `z = +2.8`). A Three.js object rotated by `rotation.y = t` maps local `+Z` to
  `(sin t, cos t)`.

Setting `t = -h` gives `(-sin h, cos h)`, whose dot product with the direction of
travel is **zero at every heading**. Solving `sin t = cos h`, `cos t = sin h`
gives `t = PI/2 - h`.

The start gantry had the same bug: its beam is modelled across local `+X` and was
standing *along* the track instead of spanning it.

Why it survived so long: nothing else was wrong. The physics, the AI, the lap
times, the speed readout, the standings and the collision checks are all consistent
with `(cos h, sin h)`. Every existing test asserted a number and passed. Only the
rendering disagreed, so the only way to notice was to look at the screen — and my
own control test measured speed going 0 → 33 km/h without ever checking *which
direction* the car moved.

Two tests now cover it, and the second is the one that matters:

- Fixed headings, checked as vectors. Also asserts `-heading` is still exactly
  perpendicular, so the guard keeps guarding.
- A car driven round every circuit with the real physics and the real mesh sync,
  comparing the rendered nose against the **actual velocity vector** — which fixed
  headings cannot catch, because they never involve a slip angle.

  Threshold is dot > 0.99, not 1.0. A car at a slip angle is *supposed* to point
  somewhere other than where it travels; measured worst is 3–4°, which is that.
  A mesh rendered 90° off scores 0.000.

  `node scripts/mesh-heading-check.mjs` prints the per-circuit figures.

### Two bugs that looked like "the game is hanging"

Both presented identically — a player sitting on a screen that never resolved —
and neither was where the symptom pointed.

**The loading screen never went away.** `.loading` sets `display: flex`, which
outranks the user-agent `[hidden] { display: none }` rule. Setting
`loading.hidden = true` updated the DOM while the overlay stayed painted on top of
a race that was running perfectly underneath. Anything toggled with the `hidden`
property and given a `display` rule needs a matching `[hidden]` rule; the test
suite now checks that structurally rather than relying on someone noticing.

**Kerbs were built from NaN positions.** Kerb quads were handed to
`BufferGeometry.setFromPoints()` as raw `[x, y, z]` arrays, but that API expects
`{x, y, z}` objects — so every kerb vertex came out `NaN`, and Three.js logged a
bounding-sphere error *per frame* for each one. The console filled up and the
frame rate collapsed. The kerbs are now one vertex-coloured geometry instead of
roughly 240 separate meshes, which was both the NaN source and a large number of
pointless draw calls.

Both are the kind of failure that a JS console shows as a warning or an error
rather than an exception, so nothing in the app's own flow could detect them.
Rendering was verified by screenshotting a real browser session rather than by
trusting that no errors were thrown.

## Reference figures

The car is tuned against a current-generation ground-effect F1 car:

| | Model | Reference |
|---|---|---|
| 0–100 km/h | 2.64 s | ~2.6 s |
| 0–200 km/h | 5.49 s | ~5.8 s |
| Top speed | 339 km/h | ~340 km/h |
| Braking 300→100 | 108 m at 5.2 g peak | ~5 g |
| Peak lateral | 4.9 g at 215 km/h | ~5 g |
| Tyre window | 50–140 °C | ~90–110 °C |