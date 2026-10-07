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

### Contact: what it actually is, and where it comes from

The median car spent **13-18% of a race in contact** — 160s at Bahrain, 231s at Monza, against
single-digit seconds in real F1. That is why results are incident-dominated rather than
pace-dominated: the fastest car at Bahrain lapped 16.4s quicker than the median and finished
fifth.

"Too much contact" splits into two faults needing opposite fixes, so
`scripts/measure-contact.mjs` measures them separately by the geometry of each touching pair —
longitudinal (nose to tail) or lateral (side by side):

    circuit   median   max   lateral%   longitudinal%
    bahrain    160s   272s       95%             5%
    monza      231s   402s       94%             6%
    spa        220s   347s       96%             4%

**95% lateral.** So the follow logic was never the problem, which was worth testing rather than
assuming: the closing-rate hypothesis said the `2 m/s` margin floor kept followers closing, and
removing it made contact *worse* — Monza median 231s to 317s, cars over a quarter of the race
2 to 6 — because matching the leader's speed exactly parks the follower on its gearbox.

The cause was the offset. It was always a fraction of the available room —
`budget * aggression * commitment`, so on a 14m track a committed aggressive pass asked for 2.3m
and a `mid` driver 1.5m — and **two cars are 2.0m wide**. The AI was steering *into* the car it
was overtaking. Aggression now sits on top of clearing the car rather than in place of it.

| | before | after |
|---|---|---|
| Bahrain median | 160 s | **124 s** |
| Monza median | 231 s | **141 s** |
| Spa median | 220 s | **127 s** |
| cars over 25% of a race | 2 (Monza) | **0** |

Race times dropped with it (Monza 1285s to 1167s), which is the point: contact was costing the
field time that was not pace.

This is a 22-42% reduction, not a fix — 124-141s is still well above real F1. And the balance
measurement has not yet moved: a `human` driver still finishes P1 in 10 of 12 rounds, with the
pace margin shifting from -0.55s to +3.09s off the field median. Pace still is not converting
into position, so there is more to find. `measure-contact.mjs`, `measure-balance.mjs` and
`measure-drivers.mjs` all exist to make that measurable rather than arguable.

### What the residual contact actually is

Contact was cut 22-42% by the clearance fix, but ~130s per car remained. That is still far above
real F1, and a total cannot say whether it is *racing* -- two cars side by side through a
sequence of corners, which is the point of the sport -- or cars wedged abreast because neither
can complete a pass, which is a bug. The two need opposite responses.

The discriminator is whether the relative order changes: a real pass resolves with the overtaker
ahead, a stuck battle never resolves. `measure-contact.mjs` now tracks contact as episodes per
pair and classifies them.

**It is neither. It is ~6,500 clips of a tenth of a second.**

| circuit | episodes | median | p90 | resolved by a pass | episodes > 10 s |
|---|---|---|---|---|---|
| bahrain | 6791 | **0.1 s** | 0.7 s | 3993/6791 | 41 |
| monza | 6533 | **0.1 s** | 0.9 s | 4327/6533 | 47 |
| spa | 6176 | **0.1 s** | 0.8 s | 4048/6176 | 36 |

So the field is not stuck together in long battles -- it is grinding, constantly and briefly.
Barely 0.7% of episodes last longer than ten seconds. And **59% of them end with the order
changed**, which is churn rather than racing: positions are being swapped thousands of times a
race between cars that are only briefly alongside each other.

The pack is not all on one line -- measured at Monza the field occupies 10.0m of lateral spread
across a 13m road, using 5.1 of the ~6 available 2m lanes. It is simply too dense: 23 cars in six
lanes is nearly four abreast, so overlap within a lane is close to unavoidable and a car changing
lane brushes whoever is there.

That is the mechanism behind all three symptoms at once -- contact a quarter of the race, results
that are incident-dominated, and a pace advantage that does not become track position.

### Lateral avoidance, measured from the car

The clearance fix above raised a car's offset *from the centreline*. It could not stop two cars
driving into each other, because it never looked at where the other car was. Two drivers solving
the same problem got the same answer.

At the moment of contact, over 87,559 samples, the median pair was **0.10 m apart laterally**,
overlapping by 0.93 m of a 2.0 m car, with 63% of contacts deeper than 0.8 m. That is not
wheel-to-wheel racing -- two cars a metre apart brushing wheels -- it is two cars in the same
place.

So the offset is now relative to the car: whatever the corner wants, the target line passes at
least `CAR_CLEARANCE` to one side of the car ahead. The side is the one already occupied, so this
widens an existing avoidance rather than inventing one, and two cars can no longer satisfy it by
choosing the same offset in the same direction.

| | before | after |
|---|---|---|
| Bahrain contact per car | 124 s | **24 s** |
| Monza | 141 s | **24 s** |
| Spa | 127 s | **15 s** |
| episodes at Monza | 6533 | **1591** |
| overlap depth, p50 | 0.93 m | **0.64 m** |

An 80-88% reduction in contact time, and real F1 is single-digit seconds -- so this closes most of
the gap rather than all of it. The lateral/longitudinal split also moved from 93-95% lateral to
64-71%, which is the right way: nose-to-tail following is the ordinary case.

It also reconciles two measurements that looked contradictory. The field *does* spread 10 m across
the road, yet contacting pairs sat 0.1 m apart. Both were true -- cars use different lanes from
each other and identical lanes from their immediate neighbour.

**The balance question is still open.** A `human` driver finishes P1 in 10 of 12 rounds, and
`mid` -- now 3.4 s/lap off the field median -- wins 10 of 12 as well. Contact was a real fault and
this fixes it, but it was not what was stopping pace from becoming position.

### Are positions won on pace?

Whether a race result means anything depends on one property: **should being faster get you
past?** If track position is uncorrelated with pace, then winning does not require driving
better, and every headline figure derived from results -- including "the player wins 24 of 24" --
is measuring the grid slot rather than the driving.

Nothing else in the suite would catch it. A season completes cleanly, races are won, points are
scored, and every number looks plausible. The fault is only visible in the *relationship* between
two things that are individually fine. `scripts/measure-passes.mjs` watches every position change
at the lead and asks, of the car that gained the place, whether it was faster than the car it
took the place from:

    circuit     swaps  faster wins   slower wins   slower deficit   contact
    monza         76      32 (42%)      44 (58%)         4.18s        24s
    sepang        80      33 (41%)      47 (59%)         5.75s        28s
    spa           53      27 (51%)      26 (49%)         4.58s        15s

    overall: 44% of positions won by the faster car

Cars 4-6 seconds a lap slower are overtaking faster cars routinely. The two distributions have
near-identical shape, which is the signature of position being uncorrelated with pace rather than
of one driver being unlucky. Real F1 does not look like that: the faster car takes the place, and
the exception is a genuine error or a tyre situation, not a routine pass.

This is also why a `human` driver finishes P1 in 10 of 12 rounds while `mid` -- several seconds a
lap off the field median -- wins 10 of 12 as well. Winning does not require being faster.

#### Why nothing has fixed it yet

The pass decision is gated on closing rate, road shape and aggression. None of those says whether
this car is faster than the one in front. Three attempts, each improving one number and breaking
another:

| attempt | faster car wins | cost |
|---|---|---|
| pace gate on the pass | 42% -> 53% | a driver that cannot pass has nothing to do but follow, and the field queues: Sepang failed outright |
| separate `avoiding` from `overtakeIntent` | 42% -> 47% | contact 24s -> 34s per car |
| all three together | 42% -> 50% | contact 24s -> 37s, and still one failed round |

The second of those is worth recording because it is a fault introduced here: `overtakeIntent`
means "committed to a pass" *and* exempts the driver from the car-ahead speed limit, and the lateral
avoidance was setting it. So a car moving aside to avoid contact stopped leaving room for the car it
was moving aside for.

Neither is a threshold. What is missing is **traffic management**: a driver who cannot pass should
use the slipstream, pick where to try, defend when overtaken, and manage the car in front rather
than parking in its gearbox. That is a subsystem rather than a constant, and `measure-passes.mjs`
is the number it has to move.

### Reaction time, and what the balance question actually is

`reactionMs` used to be a sample-and-hold on the **entire control loop**, re-issued every
`reactionMs`. At 90ms that is an 11Hz steering input, and at 83m/s each steering decision covers
7.5m of travel. Two measured consequences:

- an 80ms difference between two presets cost **2.4 to 14.0 seconds a lap**
- one flying lap varied by up to **8.9s run to run**, against a real-world 0.1-0.3s

That second number is why balance could not be answered: **the noise was larger than the
difference between drivers.**

Two wrong answers came first. A transport delay on material changes was much worse (+39s/lap) —
it latches a stale *brake* value through a braking zone, which is backwards. Lagging steering as
well as the pedals was right in kind but cost ~7% of pace, enough to push a 6-lap race past a
test's fixed budget.

What shipped lags **the pedals only**. Reaction time delays the response to a *change* — lift,
brake, swerve — and steering while tracking a line is continuous feedback a human is already
inside. That separates the two problems exactly: the noise came from quantising steering, the
pace cost from quantising throttle mid-braking-zone.

Measured over five circuits, flying lap (lap 2) averaged over five seeds, no traffic:

| | before | after |
|---|---|---|
| worst run-to-run scatter | **8.93 s** | **2.75 s** |
| Silverstone `ace` | ±0.45 s | **±0.08 s** |
| Spa `human` | ±7.53 s | **±0.10 s** |
| `human` gap to `ace` | +2.7 to +19.5 s | +2.7 to +6.8 s |
| `backmarker` gap to `ace` | +14 to +28.6 s | +8.0 to +17.6 s |

`scripts/measure-drivers.mjs` and `scripts/measure-balance.mjs` reproduce these.

### The balance answer

`measure-balance.mjs` runs the same rounds three times, changing only who is in the player's
seat. Best lap of the player's car, against the field median on the same circuit:

| driver in the seat | wins | podiums | pace vs field median |
|---|---|---|---|
| `ace` | 10/12 | 12/12 | −5.14 s/lap |
| `human` | 10/12 | 12/12 | −0.55 s/lap |
| `mid` | 10/12 | 12/12 | +1.30 s/lap |

**The player's result is insensitive to a 6.4 s/lap swing in driver pace.** `mid` is over a
second a lap slower than the field median and still wins 10 of 12 and never finishes outside the
podium. So the wins come from the grid slot and not from the driving, which is why the original
"the player wins 24/24" figure never meant anything: it was true of the autopilot, and it is
equally true of a deliberately mediocre one.

Overtaking does happen -- 46 to 89 position changes at the lead across three circuits -- so this
is not a field frozen solid. What the measurement shows is that a pace advantage is not being
converted into track position, and that is the thing to investigate next. It needs its own
measurement-first change; it is not fixed here.

### Elevation: 22 of 24 circuits

The DEM source was the problem, not the code. Open-Meteo's elevation endpoint rate-limits, and
because a circuit with no profile renders *flat*, a partial run looked like those circuits had
simply been missed. Seven circuits made it.

Now **AWS Terrarium terrain tiles** (`elevation-tiles-prod`) at z13, decoded by a small PNG
reader on Node's zlib — no API key, no request-rate limit, ~15-19m per pixel against Open-Meteo's
~90m SRTM resampling. Verified against Open-Meteo at eight points across four continents before
use: **agreement within 0.1-11m**.

**Coverage went from 7 to 22 of 24**, and the values are right:

| circuit | measured | reality |
|---|---|---|
| Baku | **-20.7 to -7.7 m** | below sea level |
| Yas Marina | -1.4 to 2.4 m | ≈ sea level |
| Mexico | 2235.0 to 2241.3 m | Mexico City ≈ 2240 m |
| Spielberg | 684.6 to 729.9 m | Red Bull Ring ≈ 700 m |
| Interlagos | 752.6 to 783.2 m | ≈ 750 m |
| Spa | 397.5 to 468.5 m | most relief on the calendar, correctly |

Confirmed to reach the car rather than merely be returned: `sample.y` varies per circuit exactly
as the profiles say — Spa 71.0m, Interlagos 30.6m, Miami 1.3m.

Four faults, three of them mine:

- **Melbourne has no `highway=raceway` at all** within 2km — verified, count 0 — because Albert
  Park is a public road circuit in a park. `leisure=track` finds it.
- **A transient Overpass failure was being read as "not tagged this way."** That is how Bahrain
  got a smooth, plausible, wrongly-*sourced* profile from `highway=track` on a run where the
  raceway query had merely timed out. Failures are now retried across mirrors before a filter is
  abandoned.
- **The extent gate first summed way lengths**, which double-counts because a circuit is mapped
  as several overlapping ways. It rejected Monza as 12.30km traced against 5.793km real and
  refused 12 of 22 circuits. Now measured by extent — invariant to how a lap splits into ways,
  sensitive to tracing the wrong feature; real circuits sit at extent/lap ≈ 0.25-0.65.
- **`writeOutput` runs after every circuit**, so an empty collection truncated the file to the
  first circuit and destroyed the baseline the never-shrink guard compared against — which is
  why that guard silently did nothing. It now parses loudly on failure, because a guard that
  cannot fail loudly is not a guard.

**Silverstone is refused, not missing by accident.** Its profile came out at 1.7m of relief where
sampling the DEM at real points round the actual circuit gives 11.1m — 6x under. Not a smoothing
artifact: re-smoothing at ±3 points still gives 1.6m, so the trace itself is flat. The 95
`highway=raceway` ways within 2km include enough of the rest of the estate to pass the extent
check. Shipping it would silently remove the Chapel and Maggotts/Becketts elevation changes from
a circuit whose character is having them, so it is refused with the measurement recorded and a
test asserts it stays out. Vegas is the other absence: only 4 of 240 profile buckets are
fillable from its fragmented street-circuit ways.

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

### Damage, mechanical failure and retirement

Contact resolved impulse and yaw kick correctly and then threw the energy away. Two cars could
lean on each other for a season and both finish on the lead lap, because nothing recorded that
the nose had gone in. There was no `damage` anywhere in `src/`, and `TEAMS[].reliability` —
documented as feeding mechanical failure — was inert in three places.

Damage is expressed as **lost downforce and lost power**, not as a lap-time deduction, so the
cost falls out of the handling: a damaged car understeers into a corner it used to take flat.
`physics.aeroFactor` and `physics.powerFactor` are the two hooks, and both feed calculations
the physics already performs.

**Calibrating the threshold took three attempts**, and the way the first two were wrong is the
reason the numbers below exist.

1. Counting `car.contact.age === 0` is not a way to count impacts. `collision.js`
   `recordContact` returns early when a car already has a contact with the same opponent, and
   that `return` leaves the function, so the *other* car never has its contact refreshed — its
   age never returns to zero, and an `age === 0` watcher misses every repeat contact involving
   it. The distribution came out far too light and the first version retired 9 cars in the
   first 100 seconds.
2. Counting a per-car flag properly was still wrong by about 20×, because the flag was read
   *before* `update()` and so reported the previous frame's decision.
3. Reading the counters the session writes from inside the step is the only thing that cannot
   drift from the code that runs.

Measured over a full Monza race — 27,507 contacts considered:

| | severity | events | per car |
|---|---|---|---|
| p50 | 0.07 | | |
| p90 | 0.19 | | |
| p99 | 4.37 | | |
| p99.9 | 14.53 | | |
| | ≥ 20 | 14 | 0.6 |
| | ≥ 10 | 83 | 3.6 |

`p90 = 0.19` is the load-bearing result: **the overwhelming majority of contact in this model is
two cars rubbing, not hitting.** The onset is therefore 20, which leaves the entire
wheel-to-wheel population free — a model that damages cars for running two abreast punishes the
only thing racing should reward.

Three further faults, each found by measuring:

- **The cascade.** Damage is self-amplifying: less downforce means understeer, understeering
  cars collect more contact. With an onset of 10, **23 of 23 cars retired from one Monza
  race**. The missing piece is negative feedback, and in real F1 it is the driver, so
  `ai/AIDriver.js` lifts for a damaged car — capped at 12%, because a driver managing a car
  still wants points.
- **The metric is not bounded.** The rate was sized against a worst case near 38; the worst
  shunt actually measured was **231.6**, which retires both cars involved from one incident.
  Per-impact damage is now capped, so terminal damage is something a race accumulates.
- **A 7× distance error.** `FAILURE_HAZARD_PER_KM` was derived for a 5.3 km race, but these
  circuits run 35–40 km. A hazard is a rate, so the result was 4 mechanical retirements in one
  Bahrain race and 6–25% per car. Calibrated over 38 km it is now 1.42 retirements per round
  across 23 cars, of which the season's 34 split 31 mechanical / 3 damage.

One more fault, of a kind worth naming on its own: mechanical failure originally rolled off the
**session's shared random stream**, once per car per step — 23 × 120 = 2,760 draws a second,
which silently perturbed every other stochastic decision until the whole field stopped
progressing. Each car now has its own stream, seeded from the race so replays reproduce, and
the roll is on distance rather than frames.

`simulate-all.mjs` now prints a season retirement tally by cause and names the reason a car
failed. Every round completes cleanly whether nothing retires or half the grid does, so neither
shows up in the pass/fail line — only the distribution distinguishes them.

### Balance: what the question actually needs

The `human` preset in `physics/drivers.js` exists because every other preset in that file is a
model of *the AI's* idea of a driver, and none of them is a person. The "player wins 24 of 24"
figure was measured with an `ace` autopilot in the player's seat: it says the autopilot beats
the field, not that a game is fair.

Its one externally-sourced number is `reactionMs: 200`, the standard figure for human reaction
in motorsport. The AI presets run 90-220ms, so `ace` at 90ms is superhuman by a factor of two
and `backmarker` at 220ms is already human-fast.

**It is not yet a calibrated difficulty, and the reason is worth writing down.** Measuring a
flying lap -- lap 2, averaged over five seeds, no traffic -- surfaces three defects that have
to be fixed before any pace number means anything:

| measurement | this model | reality |
|---|---|---|
| seed-to-seed scatter, `ace` flying lap | 0.16-2.63 s | ~0.1-0.3 s |
| cost of 80 ms of `reactionMs` | 2.4-14.0 s/lap | well under 1 s/lap |
| `consistency` | defined on all 5 presets, read by nothing | — |

**`consistency` is dead.** It is on every preset, documented, and no line of `src/` reads it --
so the AI has no repeatability model at all, which is why the same driver produces a lap that
varies by 1.95s run to run. This is the seventh instance in this repo of a value defined
correctly and then never read.

**`reactionMs` is mis-scaled by about a hundred times.** It is applied as a sample-and-hold on
the *entire control loop*, so at 90ms the AI steers in 11Hz steps; at 83m/s each steering
decision covers 7.5m of travel. That is not reaction time -- nobody re-decides their steering
every 200ms -- and it is why an 80ms difference between two presets costs up to 14s a lap.

Two replacements were built and measured rather than reasoned about:

- **A transport delay on material changes** (delay big changes, apply small tracking
  corrections immediately): *much* worse, up to +39s/lap. It latches a stale **brake** value
  through a braking zone, which is precisely backwards.
- **A first-order lag** on the controls: right in kind. Cut `ace` seed-to-seed scatter at Monza
  from 1.95s to **0.28s** and at Silverstone from 0.45s to **0.11s** -- real flying-lap
  repeatability. But it cost about 7% of pace across the field, which pushes a 6-lap race past
  the pit-stop test's fixed 840s budget.

Both were **reverted rather than shipped half-verified**, and the second is worth resuming:
the fix and the budget retune belong in the same change, with the whole season re-measured.
The measurements are pinned in a test so the next attempt starts from the numbers rather than
rediscovering them.

### Weather that arrives during the race

A race's weather was read once in the `RaceSession` constructor and never touched, so the
forecast could not arrive, the track could not go off under the cars, and a wet race was wet from
the lights. The flags and safety-car hooks sitting beside it were initialised and never used.

Now `race/weather.js` plans a deterioration and the session walks it, driven by how far through
the **race distance** the field is rather than by lap count -- so a longer race does not simply
hold the same weather for longer.

The plan is **deterministic and keyed to the circuit**, not re-rolled per race. Real weather does
not change each time a race is run, and more usefully a reproducible answer can be tested and a
random one cannot. About a third of the calendar has a wet reputation and plans a change; the
rest stay dry.

Races start dry. That is the whole drama of a wet race in F1 -- the track is dry at the lights
and somewhere in the second half the cloud breaks and the field has to change tyres while trying
to hold the line. Measured at Suzuka:

    lap 0   clear       surface grip 1.000
    lap 2   cloudy      1.000
    lap 4   light-rain  0.962   -> final 0.879 as the tyres go off too

Transitions move one step at a time through the presets, because the sky does not jump from sun
to monsoon, and because the intermediate step is where the grip cliff is nastiest: `cloudy`
costs almost nothing, `light-rain` takes 10% off the surface and `heavy-rain` takes 26%.

Grip reaching the car is only half of it. The HUD carries a conditions chip in the top-left
stack with a bar that fills as the forecast builds, and the arrival raises an alert — because
weather the player cannot see is worse than no weather at all: the car stops gripping and the
only explanation available is that the controls have broken. The chip is hidden on a circuit
that cannot change, so a permanently dry race does not spend a HUD region promising rain that
never comes. A test asserts the label map covers every `WEATHER` preset id, so the readout
cannot drift from the state the car is actually in.

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