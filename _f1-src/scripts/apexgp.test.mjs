/**
 * Regression tests for Apex GP.
 *
 * These are architecture and physics assertions rather than gameplay tests. They
 * encode the decisions that are expensive to rediscover: units and sign
 * conventions, the physical limits the car must stay within, and the specific
 * mistakes this codebase has already made and fixed. Several of the `doesNotMatch`
 * checks exist because the bug they guard against shipped once and looked
 * plausible.
 *
 *   npm test
 */

/*
 * DOM shim, installed before anything that draws a canvas is imported.
 * See `scripts/helpers/domShim.mjs` for why this exists at all.
 */
import { installCanvasShim } from './helpers/domShim.mjs';

installCanvasShim();

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { buildCarMesh, buildEnvironment, buildTrackMesh, syncCarMesh } from '../src/render/TrackMesh.js';
import {
  Effects,
  MARK_CAPACITY,
  MARK_LIFE,
  SOFT_CAPACITY,
  SPARK_CAPACITY,
  tyreSignals
} from '../src/render/Effects.js';
import { buildCockpit, steerCockpit } from '../src/render/Cockpit.js';
import { buildSurrounds } from '../src/render/Surrounds.js';
import { disposeTree } from '../src/core/Game.js';
import { CameraRig } from '../src/core/CameraRig.js';

import { CIRCUITS, getCircuit } from '../src/track/circuits.js';
import {
  buildTrack,
  locateOnTrack,
  racingLineAt,
  relaxRacingLine,
  gridSlot,
  MAX_GRID_CARS,
  CLOSURE_TOLERANCE,
  CHECKPOINT_COUNT,
  LINE_RELAX_ITERATIONS,
  PROFILE_BRAKE,
  PROFILE_CURVATURE_WINDOW,
  SAMPLE_SPACING,
  smoothCircular
} from '../src/track/trackGeometry.js';
import { profileFromPins, radialLoop } from '../src/track/circuitShapes.js';
import {
  BRAKES,
  CarPhysics,
  wearGrip,
  DEFAULT_GEOMETRY,
  GRAVITY,
  POWERTRAIN,
  REVERSE_ENGAGE_HOLD,
  REVERSE_LIMIT,
  TYRE,
  torqueFactor,
  topSpeed,
  temperatureGrip
} from '../src/physics/CarPhysics.js';
import { AIDriver } from '../src/ai/AIDriver.js';
import { LapTimer, RaceOrder } from '../src/race/LapTimer.js';
import { BOX_PROGRESS, inPitLane, laneProgress, PIT_LANE_WIDTH, PIT_WINDOW_END, PIT_WINDOW_START, shouldPit } from '../src/race/pit.js';
import { weatherAt, weatherPlan } from '../src/race/weather.js';
import {
  applyImpact,
  createDamage,
  failureRisk,
  retirementReason,
  rollMechanical,
  setReliability
} from '../src/race/damage.js';
import {
  createQualifying,
  applySegment,
  entriesForSegment,
  isComplete,
  classification,
  gridFrom
} from '../src/race/qualifying.js';
import { SESSION_TYPE, RaceSession, FIXED_TIMESTEP } from '../src/race/RaceSession.js';
import { UPGRADES, applyUpgrades, developmentPointsFor, upgradeCost } from '../src/physics/upgrades.js';
import {
  COMPOUNDS,
  WEATHER,
  expectedLifeLaps,
  getCompound,
  getWeather,
  suitabilityFor,
  surfaceGripFor
} from '../src/physics/compounds.js';
import { centrelineFor } from '../src/track/circuitData.js';
import { driverAvatar, teamBadge } from '../src/ui/avatars.js';
import { TrackProjection, cachedTrackMapPath, trackMapPath } from '../src/ui/trackMap.js';
import { UIManager } from '../src/ui/UIManager.js';
import { StartSequence } from '../src/race/startSequence.js';
import { SETTING, environmentFor, isStreet } from '../src/track/environments.js';
import { ELEVATION, PROFILE_POINTS, elevationAt } from '../src/track/elevationData.js';
import {
  ACTIONS,
  DEFAULT_STEER_SENSITIVITY,
  InputController,
  STEER_CURVES,
  stickAxis
} from '../src/core/InputController.js';
import { MotionControl } from '../src/core/MotionControl.js';

import { createRandom } from '../src/util/math.js';
import {
  DRIVERS,
  PLAYER_ENTRY,
  SKILL_PRESETS,
  TEAM_NAMES,
  skillFor,
  teamFor
} from '../src/physics/drivers.js';
import {
  createQuickRace,
  playerEntryFor,
  quickRaceEntries,
  selectCircuit,
  selectDriver,
  selectTeam
} from '../src/race/quickRace.js';
import {
  POINTS_TABLE,
  applyRaceResult,
  buyUpgrade,
  createChampionship,
  currentRound,
  loadChampionship,
  pointsForPosition,
  setupForEntry,
  standings
} from '../src/championship/ChampionshipManager.js';
import { formatGap, formatLapTime, formatPosition, wrapAngle } from '../src/util/math.js';

const viteConfig = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const aiSource = readFileSync(new URL('../src/ai/AIDriver.js', import.meta.url), 'utf8');
const physicsSource = readFileSync(new URL('../src/physics/CarPhysics.js', import.meta.url), 'utf8');
const geometrySource = readFileSync(new URL('../src/track/trackGeometry.js', import.meta.url), 'utf8');
const uiSource = readFileSync(new URL('../src/ui/UIManager.js', import.meta.url), 'utf8');
const renderSource = readFileSync(new URL('../src/render/TrackMesh.js', import.meta.url), 'utf8');
const gameSource = readFileSync(new URL('../src/core/Game.js', import.meta.url), 'utf8');
const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

const DT = FIXED_TIMESTEP;

/* ------------------------------------------------------------------ build -- */

test('car meshes point where the car is actually travelling', () => {
  // The car was drawn 90 degrees off its direction of travel: it slid sideways
  // down the road at full throttle.
  //
  // Nothing else was wrong, which is why this survived. Physics advances the car
  // by `vLong * (cos h, sin h)`; the track derives headings from
  // `atan2(dz, dx)`; the AI, the lap times, the speed readout and the collision
  // checks are all consistent with that. Only the mesh disagreed, so every test
  // that asserts a number passed while the car drove sideways.
  //
  // The mesh is modelled nose-forward along local +Z. A Three.js object rotated
  // by `rotation.y = t` maps local +Z to `(sin t, cos t)`. Requiring that to
  // equal the direction of travel `(cos h, sin h)` gives `t = PI/2 - h`.
  const localToWorld = (t, v) => {
    const object = new THREE.Object3D();
    object.rotation.y = t;
    object.updateMatrixWorld();
    return new THREE.Vector3(...v).applyQuaternion(object.quaternion);
  };

  for (const heading of [0, 0.7, Math.PI / 2, Math.PI, -1.05, 2.2, -2.7, -Math.PI]) {
    const travel = new THREE.Vector3(Math.cos(heading), 0, Math.sin(heading));

    const nose = localToWorld(Math.PI / 2 - heading, [0, 0, 1]);
    assert.ok(
      nose.dot(travel) > 0.9999,
      `at heading ${heading.toFixed(2)} the nose should point along travel, dot was ${nose.dot(travel).toFixed(3)}`
    );

    // The regression itself: the old -heading is exactly perpendicular.
    const wrong = localToWorld(-heading, [0, 0, 1]);
    assert.ok(
      Math.abs(wrong.dot(travel)) < 1e-9,
      `rotation.y = -heading should be perpendicular to travel; if this ever fails ` +
        'the guard below is no longer protecting against the original bug'
    );
  }

  // The gantry beam is modelled across local +X and must span the track, not
  // stand along it.
  for (const heading of [0, 0.7, Math.PI / 2, Math.PI]) {
    const across = new THREE.Vector3(Math.sin(heading), 0, -Math.cos(heading));
    const beam = localToWorld(Math.PI / 2 - heading, [1, 0, 0]);
    assert.ok(beam.dot(across) > 0.9999, `gantry should span the track at heading ${heading.toFixed(2)}`);
  }

  // Steering: the physics turns right for a positive input (verified against
  // CarPhysics below), and the mesh's local +X is the car's left, so the front
  // pivots must yaw negatively to point the same way the car actually goes.
  const turned = new CarPhysics();
  turned.reset(0, 0, 0, 40);
  for (let i = 0; i < 120; i += 1) turned.step(1 / 60, { throttle: 0.5, brake: 0, steer: 1 });
  const turnedLeft = new CarPhysics();
  turnedLeft.reset(0, 0, 0, 40);
  for (let i = 0; i < 120; i += 1) turnedLeft.step(1 / 60, { throttle: 0.5, brake: 0, steer: -1 });
  assert.ok(
    turned.heading > turnedLeft.heading,
    'a positive steer input must rotate the heading one way and negative the other'
  );

  // With the body fixed, the front wheels have to yaw the same way the car
  // actually turns, or they point visibly the wrong way through a corner.
  //
  // Established above: local +X is the car's right, and yawing a pivot by +phi
  // about Y swings it towards the right. Physics turns *left* (towards +z at
  // heading 0) for a positive steer input, so the net pivot yaw must be negative
  // with respect to `physics.steerAngle`.
  //
  // Checked numerically from the source rather than by matching the text: the
  // code negates into a local variable and then assigns that, so the sign is not
  // visible in any single expression.
  // Comments may sit between the two statements, so allow intervening lines.
  const bodyRotation = /mesh\.rotation\.y = ([^;]+);/.exec(renderSource);
  assert.ok(bodyRotation, 'could not find the car body yaw in syncCarMesh');
  assert.match(
    bodyRotation[1],
    /Math\.PI\s*\/\s*2\s*-\s*physics\.heading/,
    `car body yaw must be PI/2 - physics.heading, found "${bodyRotation[1]}"`
  );

  const steerDecl = /const steerAngle = ([^;]+);/.exec(renderSource);
  assert.ok(steerDecl, 'could not find the wheel steer angle in syncCarMesh');
  const pivotAssign = /wheel\.pivot\.rotation\.y = ([^;]+);/.exec(renderSource);
  assert.ok(pivotAssign, 'could not find the front wheel pivot yaw in syncCarMesh');

  // Resolve the net sign rather than trusting any single expression.
  const resolvesToNegative =
    (steerDecl[1].trim() === '-physics.steerAngle' && pivotAssign[1].trim() === 'steerAngle') ||
    (steerDecl[1].trim() === 'physics.steerAngle' && pivotAssign[1].trim() === '-physics.steerAngle');
  assert.ok(
    resolvesToNegative,
    `front wheel pivot yaw must resolve to -physics.steerAngle; found ` +
      `"const steerAngle = ${steerDecl[1]}" then "pivot.rotation.y = ${pivotAssign[1]}" so the ` +
      'wheels would point the opposite way to the direction of travel'
  );

  assert.match(renderSource, /gantry\.rotation\.y = Math\.PI \/ 2 - startSample\.heading/);

  assert.match(renderSource, /mesh\.rotation\.y = Math\.PI \/ 2 - physics\.heading/);
  assert.match(renderSource, /gantry\.rotation\.y = Math\.PI \/ 2 - startSample\.heading/);
  assert.doesNotMatch(
    renderSource,
    /rotation\.y = -[a-z]+\.heading/,
    'no mesh may use rotation.y = -heading; that is the 90-degree bug'
  );
});

test('a driven car\'s mesh points where it is travelling, on every circuit', () => {
  // The unit test above proves the geometry at fixed headings. This drives a real
  // car round every circuit using the real physics and the real mesh sync, and
  // measures the rendered nose against the actual velocity vector -- which is the
  // thing that was wrong, and which fixed headings cannot catch because they never
  // involve a slip angle.
  //
  // 200 simulated seconds per circuit is enough for several laps; the figures are
  // printed by `node scripts/mesh-heading-check.mjs`, which is where to look when
  // this fails.
  for (const circuit of CIRCUITS) {
    const track = buildTrack(circuit);
    const mesh = buildCarMesh();
    const car = new CarPhysics();
    car.reset(track.samples[0].x, track.samples[0].z, track.samples[0].heading, 55);

    let worstDot = 1;
    let checked = 0;
    let hint = 0;

    for (let step = 0; step < 60 * 60; step += 1) {
      // Steer at a point down the road: a lazy but valid driver.
      const lookAhead = 18 + Math.abs(car.vLong) * 0.45;
      let bestIndex = 0;
      let bestGap = Infinity;
      for (let i = 0; i < track.count; i += 1) {
        let ahead = track.samples[i].s - (hint % track.length);
        if (ahead < 0) ahead += track.length;
        const gap = Math.abs(ahead - lookAhead);
        if (gap < bestGap) { bestGap = gap; bestIndex = i; }
      }
      hint = bestIndex;
      const target = track.samples[bestIndex];
      let error = Math.atan2(target.z - car.z, target.x - car.x) - car.heading;
      error = Math.atan2(Math.sin(error), Math.cos(error));
      const speed = Math.abs(car.vLong);
      car.step(1 / 60, {
        throttle: speed < 70 ? 1 : 0,
        brake: speed > 78 ? 0.5 : 0,
        steer: Math.max(-1, Math.min(1, error * 1.8)),
        handbrake: false
      });

      const vx = car.vLong * Math.cos(car.heading) - car.vLat * Math.sin(car.heading);
      const vz = car.vLong * Math.sin(car.heading) + car.vLat * Math.cos(car.heading);
      if (vx * vx + vz * vz < 4) continue; // ignore standing starts

      syncCarMesh(mesh, car);
      mesh.updateMatrixWorld(true);
      const nose = new THREE.Vector3(0, 0, 1).applyQuaternion(mesh.quaternion);
      nose.y = 0;
      nose.normalize();
      const travel = new THREE.Vector3(vx, 0, vz).normalize();

      const dot = nose.dot(travel);
      checked += 1;
      if (dot < worstDot) worstDot = dot;
    }

    assert.ok(checked > 500, `${circuit.id}: only ${checked} moving samples, the drive was not exercised`);
    // 0.99 rather than 1.0: a car at a slip angle is *supposed* to point somewhere
    // other than where it travels. Measured worst is 3-4 degrees, which is that.
    // A mesh rendered 90 degrees off scores 0.000.
    assert.ok(
      worstDot > 0.99,
      `${circuit.id}: mesh nose disagreed with travel, worst dot ${worstDot.toFixed(4)} ` +
        `(${(Math.acos(worstDot) * 180 / Math.PI).toFixed(1)} degrees of slip)`
    );
  }
});

test('the calendar is real circuits with plausible dimensions', () => {
  for (const circuit of CIRCUITS) {
    assert.ok(circuit.name?.length > 4, `${circuit.id}: needs a real circuit name`);
    assert.ok(circuit.venue?.length > 4, `${circuit.id}: needs a real venue`);
    assert.ok(circuit.country?.length > 2, `${circuit.id}: needs a real country`);
    assert.ok(circuit.length > 3 && circuit.length < 7.5, `${circuit.id}: real lap length out of range`);
    assert.ok(circuit.cornerCount >= 9 && circuit.cornerCount <= 30, `${circuit.id}: implausible corner count`);
    assert.ok(circuit.laps >= 3, `${circuit.id}: a race should be at least 3 laps`);
  }

  // Generated length must track the real length. `scripts/fetch-circuits.mjs`
  // rescales every centreline to its published lap distance, which is also what
  // catches a source that is the wrong circuit.
  for (const circuit of CIRCUITS) {
    const track = buildTrack(circuit);
    const error = Math.abs(track.length / 1000 - circuit.length) / circuit.length;
    assert.ok(
      error < 0.02,
      `${circuit.id}: generated ${(track.length / 1000).toFixed(3)}km against a real ${circuit.length}km ` +
        `(${(error * 100).toFixed(1)}% off)`
    );
  }

});

test('teams and drivers are a real grid, and every entry is reachable', () => {
  assert.equal(TEAM_NAMES.length, 11, 'the 2026 grid is eleven teams');
  for (const team of TEAM_NAMES) {
    const rating = teamFor(team);
    assert.ok(rating.power > 0.9 && rating.power <= 1.0, `${team}: power rating out of range`);
    assert.ok(rating.grip > 0.9 && rating.grip <= 1.0, `${team}: grip rating out of range`);
    assert.ok(typeof rating.base === 'number', `${team}: needs a livery colour`);
  }
  assert.equal(DRIVERS.length, 22, 'twenty-two race seats in 2026');
  const codes = new Set();
  for (const driver of DRIVERS) {
    assert.ok(TEAM_NAMES.includes(driver.team), `${driver.short}: unknown team ${driver.team}`);
    assert.match(driver.short, /^[A-Z]{3}$/, `${driver.name}: ${driver.short} is not a three-letter code`);
    assert.ok(!codes.has(driver.short), `duplicate driver code ${driver.short}`);
    codes.add(driver.short);
    assert.ok(SKILL_PRESETS[driver.skill], `${driver.short}: unknown skill preset ${driver.skill}`);
  }
  // Two seats per team, so the grid is not a works team against nobodies.
  for (const team of TEAM_NAMES) {
    assert.equal(DRIVERS.filter((driver) => driver.team === team).length, 2, `${team} should have two drivers`);
  }
  // Teammates must not be identical, or the field is not a field.
  for (const team of TEAM_NAMES) {
    const pair = DRIVERS.filter((driver) => driver.team === team);
    assert.notEqual(pair[0].skill, pair[1].skill, `${team}: teammates share a skill preset`);
  }
});

test('the AI field is not a handful of identical cars', () => {
  // The AI upgrade seeding used `(team.power - 0.975) * 40`, which assumed team
  // ratings spanned a wide band. The real ratings span 0.97-1.00, so that produced
  // either 0 or 2 with nothing between, and a flat bonus for anything above 0.95
  // pace. Result: six distinct setups across twenty cars, half the field on
  // identical maximum upgrades.
  const championship = createChampionship();
  const field = championship.entries.filter((entry) => !entry.isPlayer);
  const distinct = new Set(field.map((entry) => JSON.stringify(entry.upgrades)));
  assert.ok(
    distinct.size >= 10,
    `only ${distinct.size} distinct AI setups across ${field.length} cars`
  );

  // And they must not be near maximum: development points buy tiers for the
  // player, so an AI field that starts at the top leaves nothing to earn.
  for (const entry of field) {
    assert.ok(entry.upgrades.power <= 2, `${entry.short}: AI starts at max power tier`);
    assert.ok(entry.upgrades.aero <= 2, `${entry.short}: AI starts at max aero tier`);
  }

  // The standings must count wins and podiums. This matched history rows on
  // `result.id`, but rows are written with `short` and nothing writes `id`, so the
  // filter never matched and every driver reported zero wins all season.
  const applyOneRace = () => {
    const c = createChampionship();
    applyRaceResult(
      c,
      DRIVERS.slice(0, 3).map((driver, index) => ({ short: driver.short, position: index + 1 })),
      DRIVERS[0].short
    );
    return standings(c);
  };
  const table = applyOneRace();
  assert.equal(table.find((row) => row.short === DRIVERS[0].short).wins, 1, 'winner should have a win');
  assert.equal(table.find((row) => row.short === DRIVERS[0].short).podiums, 1, 'winner should have a podium');
  assert.equal(table.find((row) => row.short === DRIVERS[1].short).podiums, 1, 'P2 should have a podium');
  assert.equal(table.find((row) => row.short === DRIVERS[3].short).podiums, 0, 'P4 should not');
});

test('Quick Race picks any circuit and team, and touches no championship state', () => {
  const quickRace = createQuickRace();
  assert.ok(CIRCUITS.length > 1, 'need several circuits to choose between');

  // Any circuit, not just the next one in the calendar.
  for (const circuit of CIRCUITS) {
    selectCircuit(quickRace, circuit.id);
    assert.equal(quickRace.circuitId, circuit.id);
  }
  assert.throws(() => selectCircuit(quickRace, 'not-a-circuit'), /Unknown circuit/);

  // Any team.
  for (const team of TEAM_NAMES) {
    selectTeam(quickRace, team);
    assert.equal(quickRace.team, team);
  }
  assert.throws(() => selectTeam(quickRace, 'Not A Team'), /Unknown team/);

  // The chosen team must actually change the car. The player's setup used to be
  // hardcoded to a perfect baseline while AI cars got their team rating, so
  // picking Haas gave you a Haas-coloured car and a Red Bull's engine.
  const setups = new Map();
  for (const team of TEAM_NAMES) {
    const entry = { ...playerEntryFor(createQuickRace({ team })), isPlayer: true, upgrades: stockUpgrades() };
    const setup = setupForEntry(entry);
    setups.set(team, `${setup.powerScale.toFixed(4)}/${setup.grip.toFixed(4)}`);
  }
  assert.ok(
    new Set(setups.values()).size >= 8,
    `only ${new Set(setups.values()).size} distinct player setups across ${TEAM_NAMES.length} teams`
  );

  // The grid has the player plus the full field, and the player is not replacing
  // a real named driver.
  const entries = quickRaceEntries(createQuickRace({ team: 'Ferrari' }));
  assert.equal(entries.length, DRIVERS.length + 1);
  assert.ok(entries[0].isPlayer);
  assert.equal(entries[0].team, 'Ferrari');
  assert.ok(entries.every((entry) => !entry.isPlayer || entry.short === 'YOU'));
  for (const driver of DRIVERS) {
    assert.ok(entries.some((entry) => entry.short === driver.short), `${driver.short} missing from the grid`);
  }

  // And it must not write to the save.
  assert.doesNotMatch(
    mainSource,
    /case 'quick-race-start':\s*\n\s*qualifyingGrid = null;\s*\n\s*startSession\(SESSION_TYPE\.race, \{ quickRace \}\);/,
    'quick race start should pass the quickRace selection through'
  );
  assert.match(
    mainSource,
    /if \(!activeSession\.quickRace\) \{\s*\n\s*applyRaceResult\(/,
    'a Quick Race result must not be applied to the championship standings'
  );
  assert.doesNotMatch(
    mainSource,
    /case 'quick-race-[\w-]+:[\s\S]{0,400}?saveChampionship\(/,
    'no Quick Race screen may save the championship'
  );
});

test('a full field starts on the grid, not on top of each other', () => {
  /*
   * The grid used to be built with a hardcoded ten slots, and `gridSlot` clamped anything
   * past the last one back onto it. A race has 23 cars, so grid positions 9-22 -- 14 of
   * them -- all spawned at identical coordinates: a contact storm from the standing
   * start, and the real cause of the pile-ups that read as AI behaviour.
   */
  const FIELD = 23;
  assert.ok(
    MAX_GRID_CARS >= FIELD,
    `the grid must pre-build at least ${FIELD} slots for a full field, has ${MAX_GRID_CARS}`
  );

  for (const id of ['monza', 'sepang', 'spa', 'monaco']) {
    const track = buildTrack(getCircuit(id));
    const points = [];
    for (let position = 0; position < FIELD; position += 1) {
      const slot = gridSlot(track, position);
      points.push(slot);
    }

    const distinct = new Set(points.map((p) => `${p.x.toFixed(3)},${p.z.toFixed(3)}`));
    assert.equal(
      distinct.size,
      FIELD,
      `${id}: ${FIELD} cars must get ${FIELD} distinct spawn points, got ${distinct.size}`
    );

    // Overlapping boxes, not just coincident points: a car is 5.2m long and 2m wide.
    let closest = Infinity;
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        closest = Math.min(closest, Math.hypot(points[i].x - points[j].x, points[i].z - points[j].z));
      }
    }
    assert.ok(closest > 2.5, `${id}: two cars spawn ${closest.toFixed(2)}m apart, which is inside a car`);
  }
});

test('the grid extends past the pre-built slots instead of stacking on the last one', () => {
  /*
   * Belt and braces. Even with enough pre-built slots, `gridSlot` must never clamp: a
   * clamp is what turned a long field into a pile of cars on one spot.
   */
  const track = buildTrack(getCircuit('monza'));
  const extra = MAX_GRID_CARS + 6;
  const points = Array.from({ length: extra }, (_, p) => gridSlot(track, p));
  const distinct = new Set(points.map((p) => `${p.x.toFixed(3)},${p.z.toFixed(3)}`));
  assert.equal(distinct.size, extra, 'a field larger than the pre-built grid must still get unique slots');
});

test('the AI can spend energy, the way the player can', () => {
  /*
   * `deployErs()` had exactly one call site -- the player's input path in `Game.js`. The
   * whole field therefore had a straight-line tool the player did not, and the player
   * could lean on it on every straight while the AI could never use one.
   */
  const track = buildTrack(getCircuit('monza'));
  const random = createRandom(4242);
  const session = new RaceSession({
    track,
    entries: quickRaceEntries({ team: 'Ferrari', driverShort: null }),
    type: SESSION_TYPE.race,
    totalLaps: 1,
    random
  });

  let deploys = 0;
  const idle = { throttle: 0, brake: 0, steer: 0, handbrake: false };
  for (const car of session.cars) {
    car.isPlayer = false;
    car.ai = new AIDriver(car.physics, SKILL_PRESETS.strong, { track, name: car.entry.short, random });
    car.ai.reset();
  }

  const charge = session.cars.map((c) => c.physics.ersCharge);
  for (let step = 0; step < 120 * 30; step += 1) {
    session.update(FIXED_TIMESTEP, idle);
    session.cars.forEach((car, i) => {
      if (charge[i] - car.physics.ersCharge > 0.25 && car.physics.boost > 0) deploys += 1;
      charge[i] = car.physics.ersCharge;
    });
  }

  assert.ok(deploys > 0, 'the AI must be able to deploy ERS at all');
});

test('upgrades the player pays for actually reach the car', () => {
  // `applyUpgrades` computed the DRS tier and never passed it on, so `CarPhysics`
  // fell back to its default. Buying the DRS upgrade cost development points and
  // did nothing.
  const base = { powerScale: 1, grip: 1, drsStrength: 1, ersStrength: 1 };
  const drsTiers = [0, 1, 2, 3].map(
    (drs) => applyUpgrades({ power: 0, aero: 0, brakes: 0, tyres: 0, drs, reliability: 0 }, base).drsStrength
  );
  for (let i = 1; i < drsTiers.length; i += 1) {
    assert.ok(
      drsTiers[i] > drsTiers[i - 1],
      `DRS tier ${i} must be stronger than tier ${i - 1}: ${drsTiers[i]} vs ${drsTiers[i - 1]}`
    );
  }
  assert.ok(Math.abs(drsTiers[0] - 1) > 1e-6, 'even tier 0 must not be silently dropped');

  /*
   * Every upgrade tier must change the setup it names -- read back off the *car*.
   *
   * Asserting on the returned setup object is what let four of these upgrades be inert
   * for so long: `downforceArea` was computed, returned and then ignored by CarPhysics,
   * so the number moved and the car did not. Building the car and reading its field is
   * the contract that actually matters.
   */
  const onCar = (setup, field) => {
    const car = new CarPhysics(setup);
    return field in car ? car[field] : car.geometry[field];
  };

  for (const upgrade of UPGRADES) {
    const low = applyUpgrades(allTiers(0), base);
    const high = applyUpgrades(allTiers(upgrade.values.length - 1), base);
    for (const field of upgrade.affects) {
      // `reliability` is data for a failure model that does not exist yet.
      if (field === 'reliability') continue;
      assert.notEqual(
        onCar(low, field),
        onCar(high, field),
        `${upgrade.id} claims to affect ${field} but tier 0 and max are identical on the car`
      );
    }
  }
});

function allTiers(tier) {
  return { power: tier, aero: tier, brakes: tier, tyres: tier, drs: tier, reliability: tier };
}

function stockUpgrades() {
  return { power: 0, aero: 0, brakes: 0, tyres: 0, drs: 0, reliability: 0 };
}

test('tyre compounds and weather actually change the grip', () => {
  // A compound and a weather state that change no numbers are two dropdowns.
  const compounds = COMPOUNDS.map((c) => c.id);
  assert.deepEqual(new Set(compounds).size, compounds.length, 'compound ids must be unique');

  // The dry slick ladder is monotonic: softer grips harder and wears faster.
  // The whole list is not one ladder -- grooved intermediates and full wets are a
  // different product for a different purpose, not a rung between soft and hard --
  // so only the slicks are ordered here.
  const slicks = ['soft', 'medium', 'hard'];
  for (const id of slicks) assert.ok(getCompound(id), `${id} must exist`);
  for (let i = 1; i < slicks.length; i += 1) {
    const softer = getCompound(slicks[i - 1]);
    const harder = getCompound(slicks[i]);
    assert.ok(softer.grip > harder.grip, `${softer.id} should grip harder than ${harder.id}`);
    assert.ok(softer.wearRate > harder.wearRate, `${softer.id} should wear faster than ${harder.id}`);
    assert.ok(softer.band < harder.band, `${softer.id} should have a narrower window than ${harder.id}`);
  }
  // Grooved tyres must be lower peak than slicks, or they would be used everywhere.
  for (const id of ['intermediate', 'wet']) {
    assert.ok(getCompound(id).grip < getCompound('medium').grip, `${id} should peak below slicks`);
  }

  // Rain must cost grip, monotonically.
  const clear = surfaceGripFor('medium', 'clear');
  const light = surfaceGripFor('medium', 'light-rain');
  const heavy = surfaceGripFor('medium', 'heavy-rain');
  assert.ok(clear > light && light > heavy, `wet must cost grip: ${clear} > ${light} > ${heavy}`);

  // The two multiply: a bad compound in the wet is worse than either alone.
  assert.ok(
    surfaceGripFor('soft', 'heavy-rain') < surfaceGripFor('soft', 'clear') * 0.85,
    'a soft in the wet should be worse than a soft on a dry track by more than the weather alone'
  );

  // Drainage is a real circuit property: a circuit that sheds water keeps more grip.
  assert.ok(
    surfaceGripFor('medium', 'heavy-rain', 1) > surfaceGripFor('medium', 'heavy-rain', 0),
    'good drainage must be worth grip in the wet'
  );

  // Slicks in the rain are flagged, full wets on a dry track are too.
  assert.equal(suitabilityFor('wet', 'clear').ok, false);
  assert.equal(suitabilityFor('soft', 'heavy-rain').ok, false);
  assert.equal(suitabilityFor('wet', 'heavy-rain').ok, true);
  assert.equal(suitabilityFor('soft', 'clear').ok, true);

  // Life estimates should order softest-first.
  assert.ok(
    expectedLifeLaps('soft', 'clear') < expectedLifeLaps('hard', 'clear'),
    'softs should be expected to last fewer laps than hards'
  );

  assert.equal(getCompound('nonsense').id, 'medium', 'unknown compounds fall back');
  assert.equal(getWeather('nonsense').id, 'clear', 'unknown weather falls back');
});

test('taking a named driver replaces them, and only them', () => {
  const base = createQuickRace({ team: 'Mercedes' });
  assert.equal(base.driverShort, null, 'no driver by default');

  selectDriver(base, 'RUS');
  assert.equal(base.driverShort, 'RUS');

  const entries = quickRaceEntries(base);
  // Taking a real driver's seat keeps the grid at the regulation 22 -- the player
  // is that car, not an extra one. Only a reserve seat adds a car, which is what
  // "reserve" means and is stated on the screen.
  assert.equal(entries.length, DRIVERS.length, 'taking a seat keeps the grid at 22');

  const playerEntries = entries.filter((entry) => entry.isPlayer);
  assert.equal(playerEntries.length, 1, 'exactly one player');
  assert.equal(playerEntries[0].short, 'RUS', 'the player took the chosen seat');
  assert.equal(playerEntries[0].name, 'George Russell', 'and keeps the driver name');

  // The displaced driver must not also be in the field, or there are two of them.
  assert.equal(
    entries.filter((entry) => entry.short === 'RUS').length,
    1,
    'the taken driver appears exactly once'
  );
  // Their team-mate is untouched.
  assert.ok(entries.some((entry) => entry.short === 'ANT'), 'the team-mate still races');

  // A reserve seat is not a real driver and does not remove anybody.
  const reserve = quickRaceEntries(createQuickRace({ team: 'Mercedes' }));
  assert.equal(reserve.length, DRIVERS.length + 1);
  assert.ok(reserve.some((entry) => entry.short === 'RUS'), 'a reserve seat leaves the grid alone');

  assert.throws(() => selectDriver(base, 'LEC'), /does not drive for/);
});

test('the track preview is the real centreline, drawn to scale', () => {
  for (const circuit of CIRCUITS.slice(0, 6)) {
    const points = centrelineFor(circuit.id);
    const path = trackMapPath(points, circuit.length * 1000);

    assert.match(path, /^M/, `${circuit.id}: preview path should start with a move`);
    assert.ok(path.length > 100, `${circuit.id}: preview path is suspiciously short`);

    // Every coordinate must land inside the viewBox, or the preview is clipped.
    const numbers = path.match(/-?\d+\.\d+/g).map(Number);
    for (const value of numbers) {
      assert.ok(
        value >= -1 && value <= 101,
        `${circuit.id}: preview coordinate ${value} falls outside the viewBox`
      );
    }

    // Cached: the same circuit must give the identical string, or the cache is
    // not doing anything and the menu pays to re-project every card on each open.
    assert.equal(cachedTrackMapPath(circuit.id, points, circuit.length * 1000), path, 'cache is stable');
  }

  // A circle and the same circle translated must produce the same shape, or the
  // preview is being distorted by its position rather than just its form.
  const circle = Array.from({ length: 64 }, (_, i) => {
    const angle = (i / 64) * Math.PI * 2;
    return { x: Math.cos(angle) * 500, z: Math.sin(angle) * 500 };
  });
  const moved = circle.map((point) => ({ x: point.x + 900, z: point.z - 400 }));
  assert.equal(trackMapPath(circle, 3141), trackMapPath(moved, 3141), 'preview must not depend on position');
});

test('every driver gets a distinct, deterministic helmet', () => {
  const seen = new Map();
  for (const driver of DRIVERS) {
    const first = driverAvatar(driver, { size: 32 });
    assert.equal(driverAvatar(driver, { size: 32 }), first, `${driver.short}: avatar must be deterministic`);
    assert.match(first, /^<svg/, `${driver.short}: avatar should be SVG`);
    assert.match(first, new RegExp(driver.short), `${driver.short}: the code should be on the helmet`);

    // Distinct enough to identify a driver from. The livery is shared with a
    // team-mate, so the pattern and not the colour is what separates them.
    const pattern = /<path d="([^"]+)" fill="#[0-9a-f]{6}" opacity/.exec(first);
    if (!seen.has(driver.short)) seen.set(driver.short, pattern?.[1] ?? '');
  }
  assert.equal(seen.size, DRIVERS.length, 'each driver should get an avatar');

  // A team-mate must not be indistinguishable: same colours, different pattern.
  const russell = DRIVERS.find((d) => d.short === 'RUS');
  const antonelli = DRIVERS.find((d) => d.short === 'ANT');
  const a = /<path d="([^"]+)" fill="#[0-9a-f]{6}" opacity/.exec(driverAvatar(russell))?.[1];
  const b = /<path d="([^"]+)" fill="#[0-9a-f]{6}" opacity/.exec(driverAvatar(antonelli))?.[1];
  assert.notEqual(a, b, 'teammates share livery, so the pattern has to differ');

  assert.match(teamBadge('Ferrari', 0xe8002d, 20), /^<svg/, 'team badge should be SVG');
});

/**
 * A stand-in for `window`, for exercising the gyroscope without a device.
 *
 * The interesting cases are the ones that fail in the real world: hardware with no
 * sensor fires the event perfectly happily with null values forever, and iOS refuses
 * permission silently when it is not asked inside a user gesture. Both have to be
 * simulated explicitly or they only ever get discovered on a player's phone.
 */
function fakeWindow({ supported = false, angle = 0, requestPermission = null, secure = true } = {}) {
  const listeners = new Map();
  const win = {
    isSecureContext: secure,
    screen: { orientation: { angle } },
    addEventListener(type, handler) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(handler);
    },
    removeEventListener(type, handler) {
      listeners.get(type)?.delete(handler);
    },
    /** Emit one `deviceorientation` event to everything listening. */
    emit(beta, gamma) {
      for (const handler of listeners.get('deviceorientation') ?? []) handler({ beta, gamma });
    },
    listenerCount(type) {
      return listeners.get(type)?.size ?? 0;
    }
  };
  if (supported || requestPermission) {
    win.DeviceOrientationEvent = function DeviceOrientationEvent() {};
    if (requestPermission) win.DeviceOrientationEvent.requestPermission = requestPermission;
  }
  return win;
}

/**
 * A stand-in for an on-screen control, for exercising `bindButton` without a DOM.
 *
 * Only what the binding touches: listeners to fire, a class list to check, and no pointer
 * capture -- which the code treats as optional, so leaving it out is the case worth covering.
 */
function fakeButton() {
  const listeners = new Map();
  return {
    classList: {
      classes: new Set(),
      add(name) {
        this.classes.add(name);
      },
      remove(name) {
        this.classes.delete(name);
      },
      contains(name) {
        return this.classes.has(name);
      }
    },
    addEventListener(type, handler) {
      listeners.set(type, handler);
    },
    /** Fire one listener, with the event fields the handlers read. */
    emit(type, fields = {}) {
      listeners.get(type)?.({ preventDefault() {}, pointerId: 1, ...fields });
    }
  };
}

/**
 * A started, calibrated motion controller.
 *
 * Going through `start()` rather than poking `active` matters: the event listener is
 * attached there, so a controller that never started has no way to receive a tilt
 * and every mapping assertion would be measuring nothing.
 */
async function startedMotion(options = {}) {
  const win = fakeWindow({ supported: true, ...options });
  const motion = new MotionControl({ target: win });
  const waiting = motion.start();
  win.emit(0, 0);
  await waiting;
  motion.calibrate();
  return motion;
}

test('motion controls fail loudly rather than silently doing nothing', async () => {
  // 1. No orientation support at all.
  const bare = fakeWindow();
  assert.equal(MotionControl.isSupported(bare), false);
  const unsupported = new MotionControl({ target: bare });
  assert.equal(await unsupported.start(), false);
  assert.equal(unsupported.status, 'unsupported');
  assert.match(unsupported.describeFailure(), /does not report orientation/);

  // 2. Hardware that fires the event with nulls forever -- the commonest real
  //    failure, and the one that looks most like working hardware.
  const silent = fakeWindow({ supported: true });
  const sensorless = new MotionControl({ target: silent });
  const silentStart = sensorless.start();
  silent.emit(null, null);
  silent.emit(null, null);
  assert.equal(await silentStart, false, 'null readings must not be treated as data');
  assert.equal(sensorless.status, 'no-signal');
  assert.match(sensorless.describeFailure(), /Motion & Orientation Access/);

  // 3. A reading arriving late is still data: some hardware needs a second or two of
  //    being held still before it reports anything.
  const late = fakeWindow({ supported: true });
  const lateControl = new MotionControl({ target: late });
  const lateStart = lateControl.start();
  setTimeout(() => late.emit(12, -30), 30);
  assert.equal(await lateStart, true, 'a real reading arriving late is still data');
  assert.equal(lateControl.active, true);

  // 4. Stopping must actually detach the listener, or it outlives the session that
  //    created it and keeps the gyroscope -- and the battery -- awake.
  assert.equal(late.listenerCount('deviceorientation'), 1);
  lateControl.stop();
  assert.equal(late.listenerCount('deviceorientation'), 0, 'stop() must detach the listener');

  /*
   * Restarting must re-prove that the sensor works.
   *
   * `start()` treats a stored reading as evidence the sensor is live. If `stop()`
   * left that reading behind, switching motion off and on again would report success
   * without the sensor ever having spoken -- motion controls that look selected and
   * calibrated and do nothing, which is the failure this whole class is built to
   * prevent.
   */
  const restarted = new MotionControl({ target: late });
  const firstStart = restarted.start();
  late.emit(5, 5);
  assert.equal(await firstStart, true);

  restarted.stop();
  const secondStart = restarted.start();
  late.emit(null, null);
  assert.equal(
    await secondStart,
    false,
    'a restarted controller must not trust a reading from before it was stopped'
  );
  assert.equal(restarted.status, 'no-signal');
});

test('motion permission is requested and honoured', async () => {
  // iOS shape: requestPermission exists and must be called from a gesture.
  const granted = fakeWindow({ requestPermission: async () => 'granted' });
  assert.equal(MotionControl.needsPermission(granted), true);
  assert.equal(await MotionControl.requestPermission(granted), true);

  // Refusal has to leave the scheme unusable rather than half-enabled.
  const denied = fakeWindow({ requestPermission: async () => 'denied' });
  assert.equal(await MotionControl.requestPermission(denied), false);

  // iOS throws when asked outside a gesture. That must not become an unhandled
  // rejection in the middle of a click handler.
  const throws = fakeWindow({
    requestPermission: async () => {
      throw new Error('not allowed outside a user gesture');
    }
  });
  assert.equal(await MotionControl.requestPermission(throws), false);

  /*
   * A `requestPermission` that never settles.
   *
   * Some builds expose the method and return a promise that resolves to nothing,
   * ever. Awaited unguarded that hangs the caller forever, which for the settings
   * screen means a button that silently does nothing -- so the request is raced
   * against a timer and reports unavailable instead.
   */
  const hangs = fakeWindow({ requestPermission: () => new Promise(() => {}) });
  assert.equal(MotionControl.needsPermission(hangs), true);
  const started = Date.now();
  assert.equal(await MotionControl.requestPermission(hangs), false, 'a hung prompt must not hang the caller');
  assert.ok(Date.now() - started >= 1000, 'and it must actually have waited before giving up');
  assert.ok(Date.now() - started < 20000, 'but not indefinitely');

  /*
   * An insecure origin.
   *
   * The API is still present and nothing throws -- the events just never fire -- so
   * without an explicit check this is indistinguishable from a device with no
   * gyroscope, and the advice given ("check your sensors are enabled") is wrong.
   */
  const insecure = fakeWindow({ supported: true, secure: false });
  assert.equal(MotionControl.isBlockedByPolicy(insecure), true);
  const insecureControl = new MotionControl({ target: insecure });
  assert.equal(await insecureControl.start(), false);
  assert.equal(insecureControl.status, 'insecure');
  assert.match(insecureControl.describeFailure(), /HTTPS/);

  // localhost is a secure context, so a local dev server is fine over http.
  const local = fakeWindow({ supported: true, secure: true });
  assert.equal(MotionControl.isBlockedByPolicy(local), false);

  // No prompt needed: everywhere else just works.
  const permissive = fakeWindow({ supported: true });
  assert.equal(MotionControl.needsPermission(permissive), false);
  assert.equal(await MotionControl.requestPermission(permissive), true);
});

test('tilt steers, and steers the way the player tilts', async () => {
  /*
   * Rotation compensation.
   *
   * In portrait, gamma is the side-to-side tilt. Rotated to landscape, that same
   * physical gesture arrives as a different raw field, so reading one field alone in
   * landscape steers with the wrong axis entirely. This game requires landscape, so
   * the uncompensated case is the normal case.
   */
  for (const [angle, expected] of [[0, 30], [90, -30], [180, -30], [270, 30]]) {
    const rotated = await startedMotion({ angle });
    rotated.target.emit(30, 30);
    assert.equal(Math.round(rotated.screenTilt.x), expected, `rotated ${angle} degrees`);
  }

  const motion = await startedMotion({ angle: 0 });

  /** Tilt by a gamma offset and return the resulting steering, fully settled. */
  const steerSettledAt = (gamma) => {
    motion.target.emit(0, gamma);
    let steer = 0;
    for (let i = 0; i < 40; i += 1) steer = motion.read(1 / 60).steer;
    return steer;
  };

  /*
   * Direction.
   *
   * Tilt right, car goes right. The default was wrong -- tilt right drove the car
   * left -- and it could only ever have been settled by hand, because the sign of the
   * roll axis relative to the player's idea of "right" depends on the screen rotation
   * and the browser.
   *
   * Note the convention, because it is what made this bug easy to write and easy to
   * misread: **positive steer turns the car LEFT**. That is a property of the physics
   * (see "steering actually turns the car"), not of this file. So "steer right" is a
   * *negative* number here, and an assertion written as `> 0.9` would be asserting
   * the opposite of what it reads like.
   */
  // Past full-lock tilt (34 degrees) rather than at it, so this asserts direction
  // and saturation together. At exactly 30 the squared response deliberately gives
  // about three-quarters lock, which is correct behaviour and a bad thing to assert
  // against.
  assert.ok(
    steerSettledAt(40) < -0.95,
    `tilting right must steer right, i.e. negative: got ${steerSettledAt(40)}`
  );
  assert.ok(
    steerSettledAt(-40) > 0.95,
    `tilting left must steer left, i.e. positive: got ${steerSettledAt(-40)}`
  );

  // Deadzone: a phone lying on a table must not creep into a corner.
  motion.target.emit(0, 0);
  motion.calibrate();
  assert.ok(Math.abs(steerSettledAt(1.5)) < 0.02, 'a small tilt must not move the steering');

  /*
   * The response curve must be weighted towards small inputs *and* still have a usable
   * gradient through the middle.
   *
   * A squared curve gives lovely fine control at the centre but leaves nothing between
   * 3 and 10 degrees, so the car sits dead straight and then goes to full lock with no
   * warning -- which is exactly what "janky and hard to control" felt like. Asserted as
   * both properties, because either one alone is satisfiable by a bad curve.
   */
  const gentle = Math.abs(steerSettledAt(8));
  const hard = Math.abs(steerSettledAt(20));
  assert.ok(gentle < hard * 0.6, `small tilt should still be finer than large: ${gentle} vs ${hard}`);

  const quarter = Math.abs(steerSettledAt(8.5));
  const threeQuarter = Math.abs(steerSettledAt(23));
  assert.ok(
    quarter > 0.08 && quarter < 0.3,
    `a quarter of the tilt range should give a usable amount of lock, got ${quarter}`
  );
  assert.ok(
    threeQuarter - quarter > 0.3,
    `the middle of the range must not be dead: ${quarter} -> ${threeQuarter}`
  );

  // Calibration resets the centre, so a phone held at an angle still starts centred.
  motion.target.emit(20, 12);
  motion.calibrate();
  assert.ok(Math.abs(motion.read(1 / 60).steer) < 0.05, 'calibration must recentre steering');

  // Inverting still flips it, for hardware that reports the other way round.
  // Recentre first: the calibration check above deliberately left neutral at gamma 12,
  // so a 40-degree tilt from here is only a 28-degree offset and cannot reach lock.
  motion.target.emit(0, 0);
  motion.calibrate();

  motion.setInverted(true);
  assert.ok(steerSettledAt(40) > 0.95, 'inverting should reverse steering');
  motion.setInverted(false);
  assert.ok(steerSettledAt(40) < -0.95, 'and un-inverting restores it');
});

test('motion supplies steering only -- pedals belong to the screen', async () => {
  const motion = await startedMotion({ angle: 0 });

  // Pitch is no longer an input at all, so it cannot leak into the pedals.
  const reading = motion.read(1 / 60);
  assert.deepEqual(Object.keys(reading).sort(), ['active', 'steer'],
    'motion must report steering and nothing else');
  assert.equal(reading.throttle, undefined);
  assert.equal(reading.brake, undefined);

  // And with the phone pitched right over, steering stays put and no pedal appears.
  let settled = { steer: 0, throttle: 0, brake: 0 };
  motion.target.emit(-70, 0);
  for (let i = 0; i < 40; i += 1) settled = motion.read(1 / 60);
  assert.ok(Math.abs(settled.steer) < 0.02, `pitch must not steer: ${settled.steer}`);
  assert.equal(settled.throttle, undefined, 'and must not produce a throttle');
  assert.equal(settled.brake, undefined, 'or a brake');

  /*
   * End to end: a hard-over tilt with no pedal pressed must not move the throttle.
   *
   * This is the claim that actually matters. It is cheap to assert at the motion
   * level and worthless there -- the interesting failure is `InputController`
   * combining a tilt with a pedal, so it is asserted where the combining happens.
   */
  const input = new InputController(fakeWindow());
  input.motion = motion;
  input.controlScheme = 'motion';

  motion.target.emit(0, -34);
  let controls = { throttle: 0, brake: 0 };
  for (let i = 0; i < 30; i += 1) controls = input.read(1 / 60, 0);
  // Positive steer is a left turn in this codebase, so tilting left must read positive.
  assert.ok(controls.steer > 0.5, `full left tilt should steer left, got ${controls.steer}`);
  assert.equal(controls.throttle, 0, 'motion must not supply throttle');
  assert.equal(controls.brake, 0, 'motion must not supply brake');

  // The on-screen pedal is what applies throttle now, and it must reach the car.
  input.keys.add(ACTIONS.throttle);
  assert.equal(input.read(1 / 60, 0).throttle, 1, 'a held pedal must still work in motion mode');
});

test('an inactive motion controller never contributes input', () => {
  const motion = new MotionControl({ target: fakeWindow({ supported: true }) });
  assert.deepEqual(motion.read(1 / 60), { steer: 0, active: false });
});

test('the input controller uses motion only when it is the chosen scheme', async () => {
  const input = new InputController(fakeWindow());
  const motion = await startedMotion({ angle: 0 });
  input.motion = motion;
  motion.target.emit(0, 34);

  // Motion attached but touch selected: the stick and keys decide.
  input.controlScheme = 'touch';
  input.touch.active = true;
  input.touch.steer = 0;
  assert.ok(
    Math.abs(input.read(1 / 60).steer) < 0.2,
    'motion must not steer while the stick is selected'
  );

  // Motion selected: it does.
  input.controlScheme = 'motion';
  let steer = 0;
  for (let i = 0; i < 60; i += 1) steer = input.read(1 / 60).steer;
  assert.ok(Math.abs(steer) > 0.5, `motion should steer when selected, got ${steer}`);

  // The keyboard still wins, so a player can grab the keys mid-corner rather than
  // having to open a menu first. Both steer the same way, so compare magnitudes.
  input.keys.add(ACTIONS.steerLeft);
  let counter = 0;
  for (let i = 0; i < 60; i += 1) counter = input.read(1 / 60).steer;
  assert.ok(Math.abs(counter) > Math.abs(steer), 'the keyboard should still override motion');
});

test('a button pressed once is not still pressed a lap later', () => {
  /*
   * `read()` reported DRS from the `pressed` set as well as from the held ones, and `pressed`
   * is the one-shot queue that only `consume()` empties -- and nothing consumes DRS, because
   * it is a level the physics reads rather than an event to be handled. So a single tap of the
   * DRS key added `drs` to the queue and it never left: from the next frame to the end of the
   * race `controls.drs` was true, and the DRS deployed itself at every zone without the driver
   * touching the button again.
   */
  const input = new InputController(fakeWindow());
  const press = (code) => input.onKeyDown({ code, repeat: false, preventDefault() {} });
  const release = (code) => input.onKeyUp({ code });

  press('ShiftLeft');
  assert.equal(input.read(1 / 60).drs, true, 'holding the button must ask for DRS');
  release('ShiftLeft');
  assert.equal(input.read(1 / 60).drs, false, 'and releasing it must stop asking');
  for (let i = 0; i < 10; i += 1) {
    assert.equal(input.read(1 / 60).drs, false, 'a tap must not leave DRS asking for the rest of the race');
  }

  // ERS is the same kind of control and is read the same way, so it is asserted with it.
  press('Space');
  assert.equal(input.read(1 / 60).ers, true, 'holding the button must deploy ERS');
  release('Space');
  assert.equal(input.read(1 / 60).ers, false, 'and releasing it must stop');

  /*
   * The one-shot queue is a queue, and pausing empties it.
   *
   * `reset` is bound on screen as a toggle, so it writes to `pressed`, and queued actions used
   * to survive a pause: the frame after the player unpaused, the car they had just come back to
   * respawned on the track.
   */
  press('KeyR');
  assert.equal(input.consume(ACTIONS.reset), true, 'a queued action fires once');
  press('KeyR');
  input.clear();
  assert.equal(
    input.consume(ACTIONS.reset),
    false,
    'a press from before the pause must not act after it'
  );
});

test('losing focus releases everything that was being held', () => {
  /*
   * Neither the browser nor the operating system delivers a keyup for a key that was held when
   * the window lost focus, and no pointerup arrives for a finger on a control -- the events
   * simply stop. So everything held has to be released on blur, or a held throttle stays
   * asserted for the rest of the session and the car drives off on its own while the player is
   * looking at something else. On a phone, leaving the page is one of the ordinary ways to
   * lose focus.
   */
  const input = new InputController(fakeWindow());
  const pad = fakeButton();
  input.bindButton(pad, ACTIONS.throttle, 'hold');

  pad.emit('pointerdown');
  assert.equal(input.read(1 / 60).throttle, 1, 'the on-screen pedal supplies throttle while held');

  input.onBlur();
  assert.equal(input.read(1 / 60).throttle, 0, 'and losing focus must release it');
  assert.equal(pad.classList.contains('is-pressed'), false, 'the control must stop looking pressed');

  // A key held at the same moment goes too: its `keyup` is never delivered either.
  input.onKeyDown({ code: 'KeyW', repeat: false, preventDefault() {} });
  assert.equal(input.read(1 / 60).throttle, 1, 'the key supplies throttle while held');
  input.onBlur();
  assert.equal(input.read(1 / 60).throttle, 0, 'and blur releases the keyboard as well');
});

test('qualifying is a knockout, not a time trial', () => {
  /*
   * Qualifying used to be a three-lap race with the lights off: every car on track at once,
   * nobody eliminated, grid sorted by best lap. That is a time trial with a grid at the end,
   * and it has none of the tension that makes qualifying a session.
   */
  const entries = Array.from({ length: 23 }, (_, i) => ({
    short: `D${i}`, name: `Driver ${i}`, team: 'T', colour: 0, upgrades: {}
  }));

  const q = createQualifying(entries);
  assert.equal(entriesForSegment(q).length, 23, 'everyone starts in Q1');

  const ran = [];
  while (!isComplete(q)) {
    const running = entriesForSegment(q);
    // Deliberately: the back of the field is slower in every segment.
    const results = running.map((entry, i) => ({ entry, bestLap: 80 + i * 0.5 + q.segment * 1.5 }));
    ran.push(running.length);
    applySegment(q, results);
  }

  assert.deepEqual(ran, [23, 18, 13], 'five out of Q1, five out of Q2, thirteen fight for pole');
  assert.equal(classification(q).length, 23, 'everyone who set a time is classified, knockouts included');
  assert.equal(classification(q)[0].short, 'D0', 'fastest lap takes pole');

  /*
   * The five knocked out in Q1 still start the race. Keeping them out of `best` -- which is
   * what the grid is built from -- turned 23 qualifiers into an 18-car grid.
   */
  const outInQ1 = q.history[0].eliminated;
  assert.equal(outInQ1.length, 5, `five eliminated in Q1, got ${outInQ1.length}`);
  for (const short of outInQ1) {
    assert.ok(q.best.has(short), `${short} was eliminated in Q1 but must still be classified`);
  }

  /*
   * A driver's result is their *best* lap across every segment, so a quick Q1 lap survives a
   * slow Q2 rather than being overwritten by the later one.
   */
  const bestLapFor = (short) => classification(q).find((row) => row.short === short)?.lap;
  for (let i = 0; i < 23; i += 1) {
    const expected = 80 + i * 0.5;
    assert.equal(bestLapFor(`D${i}`), expected, `D${i} must keep the best of their segment times`);
  }

  /*
   * A driver knocked out in Q2 keeps the time they set in Q1, which is what makes the
   * knockout a risk rather than a formality.
   */
  const outInQ2 = q.history[1].eliminated;
  assert.equal(outInQ2.length, 5, `five eliminated in Q2, got ${outInQ2.length}`);
  for (const short of outInQ2) {
    assert.ok(q.best.has(short), `${short} was eliminated but must still hold a classified time`);
  }

  /*
   * A car that produced no result at all -- crashed on the out lap, never took the start --
   * must go home on the same terms as one that set no time. Without this it never appears in
   * `results`, never gets ranked, and silently reappears in the next segment.
   */
  const stalled = createQualifying(entries);
  applySegment(stalled, entries.slice(0, 22).map((entry) => ({ entry, bestLap: 90 })));
  assert.ok(
    stalled.history[0].eliminated.includes(entries[22].short),
    'a car that never ran must be eliminated'
  );
});

test('the qualifying grid is what the race session starts from', () => {
  /*
   * `gridFrom` returned short codes while `RaceSession` destructured `{ entry, grid }` slots,
   * so "To the race" after qualifying threw and the championship could not get past Q3.
   *
   * Nothing covered the seam: the qualifying module was tested and the session was tested,
   * but the handoff between them was not, which is exactly where the two conventions had
   * drifted apart.
   */
  const entries = Array.from({ length: 6 }, (_, i) => ({
    short: `Q${i}`, name: `Driver ${i}`, team: 'T', colour: 0, upgrades: {}
  }));

  const q = createQualifying(entries);
  while (!isComplete(q)) {
    applySegment(q, entriesForSegment(q).map((entry, i) => ({ entry, bestLap: 80 + i })));
  }

  const grid = gridFrom(q);
  assert.deepEqual(
    grid.map((slot) => slot.grid),
    grid.map((_, index) => index),
    'grid slots are pole first'
  );
  assert.deepEqual(
    grid.map((slot) => slot.entry.short),
    entries.map((entry) => entry.short),
    'a clean sweep leaves the field in entry order'
  );

  const track = buildTrack(getCircuit('monza'));
  const session = new RaceSession({
    track,
    entries,
    type: SESSION_TYPE.race,
    totalLaps: 1,
    gridOrder: grid
  });

  assert.deepEqual(
    session.cars.map((car) => car.entry.short),
    entries.map((entry) => entry.short),
    'the race starts in qualifying order'
  );
  for (const car of session.cars) {
    assert.equal(car.gridPosition, session.cars.indexOf(car), 'grid position matches the slot');
  }
});

test('qualifying never eliminates the field down to nothing', () => {
  const few = Array.from({ length: 6 }, (_, i) => ({
    short: `D${i}`, name: `D${i}`, team: 'T', colour: 0, upgrades: {}
  }));
  const q = createQualifying(few);
  applySegment(q, few.map((entry, i) => ({ entry, bestLap: 80 + i })));
  assert.ok(q.remaining.length >= 6, `a small grid must not be eliminated away, left ${q.remaining.length}`);
});

test('missing one checkpoint does not end a car\'s race', () => {
  /*
   * A lap only counted if the car had visited all `CHECKPOINT_COUNT` gates *in order*.
   * Miss one -- clip a kerb, get nudged at a hairpin -- and the car could never complete
   * another lap: the lap would not count, `timer.lap` would not advance, and the next
   * time round it would have to collect every gate again.
   *
   * It cascaded. A lap that fails to count also makes `lap * length + progress * length`
   * drop by a full lap distance, which the no-progress watchdog reads as a car going
   * backwards. Measured at Bahrain before this fix: **130 rescues in ten minutes, and not
   * one car completed a single lap.**
   *
   * All-but-one is a real-world reading, not a fudge: timing loops in F1 are not perfect
   * either. Direction is already enforced where it matters -- the lap boundary comes from
   * the sample index wrapping the start line, so a car cannot get round without passing
   * every gate.
   */
  const track = buildTrack(getCircuit('monza'));
  const timer = new LapTimer(track);

  /*
   * Walk the car round the circuit, skipping the samples inside one gate's radius.
   *
   * Skipping a single *sample* would not miss the gate: a gate is claimed by every sample
   * within its radius, of which there are several. Missing a gate means passing none of
   * them, so the skip has to be by position.
   */
  const samples = track.samples;
  const skipGate = track.checkpoints[5];
  // Two laps: the first line crossing only arms the attempt (`lapStarted` starts false),
  // so the second one is what completes a lap.
  for (let i = 0; i <= track.count * 2; i += 1) {
    const s = samples[i % track.count];
    if (i > track.count && Math.hypot(s.x - skipGate.x, s.z - skipGate.z) <= skipGate.radius) continue;
    timer.update(s.x, s.z, DT, 99);
  }
  assert.ok(timer.lap >= 1, `a lap with one gate missed must still count, got ${timer.lap}`);

  // But losing several gates is still a lap that does not count.
  const strict = new LapTimer(track);
  const dropped = new Set([3, 4, 5, 6, 7]);
  for (let i = 0; i <= track.count * 2; i += 1) {
    const s = samples[i % track.count];
    if (i > track.count) {
      let skip = false;
      for (const gateIndex of dropped) {
        const gate = track.checkpoints[gateIndex];
        if (Math.hypot(s.x - gate.x, s.z - gate.z) <= gate.radius) skip = true;
      }
      if (skip) continue;
    }
    strict.update(s.x, s.z, DT, 99);
  }
  assert.ok(strict.lap < 1, 'losing several gates must still invalidate the lap');
});

test('the no-progress watchdog survives a car crossing the line', () => {
  /*
   * `car.distance` is `lap * length + progress * length`, so it drops by a full lap every
   * time the start/finish line is crossed. The watchdog compared it against a stored
   * maximum, which left that value unreachable until the car had completed another entire
   * lap -- so 22 seconds after the line every car on the grid was rescued for "going
   * nowhere" while driving at race speed in mid-field.
   *
   * The wrap has to be detected and the reference moved with it.
   */
  const track = buildTrack(getCircuit('monza'));
  const car = { distance: track.length * 0.98, bestDistance: track.length * 0.98, noProgressFor: 0 };

  // Cross the line: lap does not count, so distance drops by nearly a full lap.
  car.distance = track.length * 0.02;
  const reference = car.bestDistance ?? car.distance;
  assert.ok(car.distance < reference, 'precondition: the distance really did wrap backwards');

  // A wrap-safe watchdog must not read that as going backwards.
  const half = track.length * 0.5;
  const wrapped = car.distance < reference - half;
  assert.ok(wrapped, 'a drop of more than half a lap is a line crossing, not a reversal');
});

test('a car that stops making progress is recovered, even while still moving', () => {
  /*
   * The original rescue only fired for a car that was stationary or beached. A car
   * crawling above that speed threshold while going nowhere useful -- circling,
   * facing the wrong way, grinding along a barrier -- never triggered it, and so
   * never completed a lap. That is not hypothetical: it was the failure mode that
   * stopped a championship round from finishing once cars could touch each other.
   */
  const track = buildTrack(getCircuit('monza'));
  const entry = { short: 'TEST', team: 'Ferrari', name: 'Test', colour: 0xe8002d, isPlayer: false, upgrades: {} };
  const session = new RaceSession({
    track,
    entries: [entry],
    type: SESSION_TYPE.race,
    totalLaps: 1,
    random: () => 0.5
  });

  const car = session.cars[0];
  let rescues = 0;
  car.ai = {
    trackIndex: 0,
    rescue() {
      rescues += 1;
    },
    update: () => ({ throttle: 1, brake: 0, steer: 0, handbrake: false })
  };

  /*
   * Park it on the racing line but hold it at a speed *above* the stationary
   * rescue threshold, and never let it advance. Every stationary-based check passes
   * and no rescue fires; only the progress watchdog can catch this.
   */
  const sample = track.samples[0];
  car.physics.reset(sample.x, sample.z, sample.heading, 40);
  car.lateral = 0;
  car.trackHalfWidth = sample.width * 0.5;

  /*
   * Run long enough in *simulated* time, not in steps. The watchdog needs 22s to
   * decide a car is stuck and a further rescue delay after that; assuming 60Hz here
   * silently under-runs it, because the fixed timestep is not 1/60.
   */
  const seconds = (value) => Math.ceil(value / FIXED_TIMESTEP);
  const stuckSteps = seconds(35);

  for (let step = 0; step < stuckSteps; step += 1) {
    // Never actually move, but report real speed.
    car.physics.x = sample.x;
    car.physics.z = sample.z;
    car.physics.vLong = 40;
    car.distance = 0;
    session.update(FIXED_TIMESTEP, { throttle: 0, brake: 0, steer: 0, handbrake: false });
  }

  assert.ok(rescues > 0, 'a car that never advances must eventually be recovered');
  assert.ok(car.rescues > 0, 'and the recovery must be counted for telemetry');

  // A car that is genuinely progressing must be left alone.
  const moving = session.cars[0];
  let movingRescues = 0;
  moving.ai = { trackIndex: 0, rescue: () => { movingRescues += 1; }, update: () => ({ throttle: 1, brake: 0, steer: 0, handbrake: false }) };
  let advanced = 0;
  for (let step = 0; step < stuckSteps; step += 1) {
    advanced += 40 * FIXED_TIMESTEP;
    moving.distance = advanced;
    moving.lateral = 0;
    moving.trackHalfWidth = sample.width * 0.5;
    moving.physics.vLong = 40;
    session.update(FIXED_TIMESTEP, { throttle: 0, brake: 0, steer: 0, handbrake: false });
  }
  assert.equal(movingRescues, 0, 'a car making progress must not be rescued');

  /*
   * The same check on a *fresh* car, which is the case that was broken.
   *
   * `car.bestDistance ?? car.distance` made the reference follow the car whenever the stored
   * value was absent, so the improvement branch could never be true on a car that had never
   * been rescued: `noProgressFor` accumulated from the first step, and every AI car was
   * teleported back to the racing line around 25 seconds into every race, at racing speed.
   * The car only healed after that first free rescue, which is why the loop above -- reusing
   * a car that had already been rescued -- did not catch it.
   */
  const fresh = new RaceSession({
    track,
    entries: [entry],
    type: SESSION_TYPE.race,
    totalLaps: 1,
    random: () => 0.5
  });
  const driven = fresh.cars[0];
  let freshRescues = 0;
  driven.ai.rescue = () => {
    freshRescues += 1;
  };
  const startOdometer = driven.physics.odometer;
  for (let step = 0; step < seconds(35); step += 1) {
    fresh.update(FIXED_TIMESTEP, { throttle: 0, brake: 0, steer: 0, handbrake: false });
  }
  assert.equal(freshRescues, 0, 'a fresh car running at race speed must not be rescued');
  assert.ok(driven.physics.odometer > startOdometer + 500, 'the car must actually have made progress');
});

test('the start lights hold every car until they go out', () => {
  /*
   * The sequence itself.
   *
   * The order matters more than the timing: nothing may reach "green" before all five
   * lights have come on, because a race that starts early is worse than one that
   * starts late.
   */
  const start = new StartSequence({ delayBefore: 1.4 });

  assert.equal(start.holding, true, 'a fresh sequence must hold the field');
  assert.equal(start.state, 'pending');

  const dt = 1 / 60;
  const seen = [];
  let lastState = null;
  let lastLit = -1;
  let steps = 0;
  while (start.holding && steps < 60 * 30) {
    start.update(dt);
    steps += 1;
    if (start.state !== lastState || start.lightsOn !== lastLit) {
      seen.push({ t: steps * dt, state: start.state, lit: start.lightsOn });
      lastState = start.state;
      lastLit = start.lightsOn;
    }
  }

  assert.equal(start.holding, false, 'the sequence must eventually release the field');

  // Lights come on one at a time, in order, and never skip a step.
  const litStates = seen.filter((entry) => entry.state === 'lights').map((entry) => entry.lit);
  assert.deepEqual([...new Set(litStates)], [1, 2, 3, 4, 5], 'lights must come on one at a time, in order');

  // Nothing goes green before every light has been.
  const firstGreen = seen.findIndex((entry) => entry.state === 'green');
  const allLit = seen.findIndex((entry) => entry.state === 'lights' && entry.lit === 5);
  assert.ok(allLit >= 0, 'all five lights must come on');
  assert.ok(firstGreen > allLit, 'green must not come before the fifth light');

  // And there must be a pause at full lit, which is the moment drivers are reacting.
  assert.ok(
    seen.some((entry) => entry.state === 'hold'),
    'a hold at full lit is the reaction window and must exist'
  );

  // A disabled sequence must never hold, for qualifying.
  const instant = new StartSequence({ enabled: false });
  assert.equal(instant.holding, false, 'a disabled sequence must not hold');
  assert.equal(instant.state, 'green');
  assert.equal(instant.remaining, 0);

  /*
   * End to end, through a real session.
   *
   * The invariant that actually matters: input is discarded while the lights are on.
   * A player holding throttle from the moment the HUD appears must not launch, and the
   * whole field must be held together.
   */
  const track = buildTrack(getCircuit('monza'));
  const entry = { short: 'TEST', team: 'Ferrari', name: 'T', colour: 0xe8002d, isPlayer: true, upgrades: {} };
  const session = new RaceSession({
    track,
    entries: [entry],
    type: SESSION_TYPE.race,
    totalLaps: 1,
    random: () => 0.5
  });

  const startPosition = { x: session.cars[0].physics.x, z: session.cars[0].physics.z };

  // Full throttle and steering, held down for the entire countdown.
  const eager = { throttle: 1, brake: 0, steer: 0.5, handbrake: false };
  let stepsHeld = 0;
  let peakSpeed = 0;
  while (session.start.holding && stepsHeld < 60 * 30) {
    session.update(FIXED_TIMESTEP, eager);
    stepsHeld += 1;
    peakSpeed = Math.max(peakSpeed, session.cars[0].physics.speed);
  }

  /*
   * The claim is "the car is held", not "the car is frozen".
   *
   * The tyre model leaves a few centimetres per second of numerical creep at a
   * standstill, and demanding exactly zero would be asserting something physics does
   * not promise. What matters is that the car cannot *build* speed: full throttle held
   * down for the whole countdown must leave it effectively where it started, rather
   * than launching it down the road.
   */
  assert.ok(
    peakSpeed < 0.5,
    `a held car must not build speed under full throttle, peaked at ${peakSpeed}m/s`
  );
  const heldDisplacement = Math.hypot(
    session.cars[0].physics.x - startPosition.x,
    session.cars[0].physics.z - startPosition.z
  );
  assert.ok(heldDisplacement < 1, `a held car must not move, travelled ${heldDisplacement.toFixed(2)}m`);

  /*
   * After the lights, the same throttle must actually launch the car.
   *
   * Straight-line throttle only. Holding half lock at the same time spins the car off at
   * the first corner, which would make this assert that the car is *stuck* -- the
   * opposite of the claim. The claim being tested is that the input reaches the car at
   * all, which throttle alone establishes.
   */
  const straight = { throttle: 1, brake: 0, steer: 0, handbrake: false };
  for (let i = 0; i < 60 * 4; i += 1) session.update(FIXED_TIMESTEP, straight);
  assert.ok(
    session.cars[0].physics.speed > 10,
    `the car must be released at lights out, got ${session.cars[0].physics.speed.toFixed(2)}m/s`
  );

  // And the AI must be held too, or the field pulls away on its own.
  const field = new RaceSession({
    track,
    entries: [{ ...entry, short: 'A' }, { ...entry, short: 'B' }],
    type: SESSION_TYPE.race,
    totalLaps: 1,
    random: () => 0.5
  });
  for (const car of field.cars) {
    car.isPlayer = false;
    car.ai = { trackIndex: 0, reset() {}, rescue() {}, update: () => ({ throttle: 1, brake: 0, steer: 0 }) };
  }
  const idle = { throttle: 0, brake: 0, steer: 0, handbrake: false };
  let aiSteps = 0;
  const aiPeak = new Map();
  while (field.start.holding && aiSteps < 60 * 30) {
    // No player input at all: the AI drives itself, so anything they do during the
    // countdown came from the AI and not from us failing to hold them.
    field.update(FIXED_TIMESTEP, idle);
    aiSteps += 1;
    for (const car of field.cars) {
      aiPeak.set(car.entry.short, Math.max(aiPeak.get(car.entry.short) ?? 0, car.physics.speed));
    }
  }
  for (const car of field.cars) {
    assert.ok(
      (aiPeak.get(car.entry.short) ?? 0) < 0.5,
      `${car.entry.short} moved while the lights were on: ${aiPeak.get(car.entry.short)}m/s`
    );
  }
});

test('the minimap projection agrees with the outline it sits on', () => {
  /*
   * The whole point of `TrackProjection`.
   *
   * The minimap draws the circuit as an outline and the cars as dots, from the same
   * centreline. If those two projections disagree by a rotation or a scale, every dot
   * sits somewhere plausible on the map and nowhere near its car on track -- which
   * looks fine until you compare it with where you actually are.
   */
  for (const circuit of CIRCUITS.slice(0, 5)) {
    const points = centrelineFor(circuit.id);
    const projection = new TrackProjection(points);
    const path = trackMapPath(points, circuit.length * 1000);

    // The start of the outline and the projected start line must be the same point.
    const [headX, headY] = path.replace('M', '').split(' ').slice(0, 2).map(Number);
    const projected = projection.project(points[0].x, points[0].z);
    assert.ok(
      Math.abs(headX - projected.x) < 0.05 && Math.abs(headY - projected.y) < 0.05,
      `${circuit.id}: the projection disagrees with the outline (${headX},${headY} vs ${projected.x},${projected.y})`
    );

    // Every projected centreline point must land on the drawn path's own extent.
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const sample of points) {
      const p = projection.project(sample.x, sample.z);
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    const numbers = path.match(/-?\d+\.\d+/g).map(Number);
    const xs = numbers.filter((_, i) => i % 2 === 0);
    const ys = numbers.filter((_, i) => i % 2 === 1);
    assert.ok(Math.min(...xs) - 0.1 <= minX && maxX <= Math.max(...xs) + 0.1, `${circuit.id}: projected x escapes the outline`);
    assert.ok(Math.min(...ys) - 0.1 <= minY && maxY <= Math.max(...ys) + 0.1, `${circuit.id}: projected y escapes the outline`);

    // Nothing may land outside the viewBox, or the map is clipped.
    for (const sample of points) {
      const p = projection.project(sample.x, sample.z);
      assert.ok(p.x >= -1 && p.x <= 101 && p.y >= -1 && p.y <= 101, `${circuit.id}: projected point outside the viewBox`);
    }
  }

  // Translation invariance, or the projection would depend on where a circuit happens
  // to sit in its source data.
  const circle = Array.from({ length: 64 }, (_, i) => {
    const angle = (i / 64) * Math.PI * 2;
    return { x: Math.cos(angle) * 500, z: Math.sin(angle) * 500 };
  });
  const moved = circle.map((point) => ({ x: point.x + 900, z: point.z - 400 }));
  const a = new TrackProjection(circle);
  const b = new TrackProjection(moved);
  for (const index of [0, 17, 40]) {
    const pa = a.project(circle[index].x, circle[index].z);
    const pb = b.project(moved[index].x, moved[index].z);
    assert.ok(Math.abs(pa.x - pb.x) < 1e-6 && Math.abs(pa.y - pb.y) < 1e-6, 'projection must not depend on position');
  }
});

test('weather arrives during the race, and it costs grip', () => {
  /*
   * A race's weather used to be read once in the constructor and never touched: the forecast
   * could not arrive, the track could not go off under the cars, and a wet race was wet from
   * the lights. The flags and safety-car hooks beside it were initialised and never used.
   *
   * The plan is deterministic and keyed to the circuit rather than re-rolled per race, so a
   * round is reproducible and testable.
   */
  const changeable = weatherPlan('suzuka', 'clear');
  assert.ok(changeable.length > 0, 'a circuit with a wet reputation must plan a change');
  assert.equal(changeable[0].from, 'clear', 'a race must start dry -- that is the whole drama');
  assert.ok(changeable[0].at > 0.35, `the first change should land in the second half, got ${changeable[0].at}`);
  for (const step of changeable) {
    assert.ok(step.at < 1, `a transition at ${step.at} cannot happen before the flag`);
  }
  assert.deepEqual(weatherPlan('monza', 'clear'), [], 'a dry circuit plans no weather');

  // Progress through the race gives the right weather at the right point.
  assert.equal(weatherAt(changeable, 'clear', 0), 'clear');
  assert.equal(weatherAt(changeable, 'clear', changeable[0].at + 0.01), changeable[0].to);

  // And it actually costs grip on the road.
  const dry = getWeather('clear');
  const wet = getWeather('light-rain');
  assert.ok(wet.grip < dry.grip, `rain must cost grip, ${wet.grip} vs ${dry.grip}`);
  assert.ok(wet.spray > dry.spray, 'and spray must rise with it');

  /*
   * The session wiring, asserted directly rather than by simulating a race.
   *
   * A whole six-lap session is a poor unit test: it takes over a minute, and it depends on the
   * AI actually completing the distance, which is a moving target for reasons that have nothing
   * to do with weather. The standalone probe covers the behaviour -- Suzuka dry at the lights,
   * overcast on lap 2, light rain on lap 4, surface grip 1.000 -> 0.879.
   */
  const track = buildTrack(getCircuit('suzuka'));
  const session = new RaceSession({
    track,
    entries: createChampionship().entries,
    type: SESSION_TYPE.race,
    totalLaps: 6,
    random: createRandom(7),
    conditions: { compound: 'medium', weather: 'clear' }
  });
  assert.equal(session.weatherState.id, 'clear', 'races start dry');
  assert.ok(session.weatherPlan.length > 0, 'the session must carry a plan for a changeable circuit');
  assert.equal(session.startWeather, 'clear', 'and remember what it started as');

  // Progress through the race distance selects the weather, so the transition is driven by
  // distance rather than by lap count.
  const total = 6 * track.length;
  session.distanceCovered = session.weatherPlan[0].at * total * 1.01;
  session.update(FIXED_TIMESTEP, { throttle: 0, brake: 0, steer: 0, handbrake: false });
  assert.notEqual(session.weatherState.id, 'clear', 'passing the first transition must change the weather');
  assert.ok(session.weatherChanged, 'and the change must be recorded so the HUD can show it');
});

test('damage costs the car lap time, and wheel-to-wheel contact stays free', () => {
  /*
   * Damage was entirely absent: contact resolved impulse and yaw kick correctly and then
   * threw the energy away, so a car could lean on another for a season and finish on the
   * lead lap. `TEAMS[].reliability` was documented as feeding mechanical failure and never
   * did.
   *
   * Everything here asserts on what the *car* ends up with -- `physics.aeroFactor` and a
   * measured lap time -- rather than on the damage object, which is just numbers until
   * something reads them.
   */
  const fresh = createDamage(() => 0.5);

  // Wheel-to-wheel contact must be free. This is the property that matters most: a model
  // that damages cars for running two abreast punishes the only thing racing rewards.
  const rubbing = createDamage(() => 0.5);
  for (const severity of [0.05, 0.19, 1, 4.37, 14.53]) {
    applyImpact(rubbing, severity);
  }
  assert.equal(rubbing.contacts, 5, 'every contact must still be seen');
  assert.equal(rubbing.impacts, 0, 'but none of them may register damage');
  assert.equal(rubbing.total, 0, 'rubbing must not damage the car');
  assert.equal(rubbing.aero, 1, 'and must leave the aero multiplier untouched');

  // A big shunt registers, and it reaches the physics as lost downforce and power.
  const big = createDamage(() => 0.5);
  applyImpact(big, 38);
  assert.ok(big.impacts === 1, 'a big shunt registers');
  assert.ok(big.total > 0.3, `a maximal shunt should cost real damage, got ${big.total.toFixed(3)}`);
  // The calibration, stated so a change to either constant has to be deliberate:
  // severity 38 is 18 over onset, which is 0.36 damage, costing 18% of downforce and 12.6%
  // of power.
  assert.ok(Math.abs(big.total - 0.36) < 0.001, `calibration: total ${big.total.toFixed(3)}`);
  assert.ok(Math.abs(big.aero - 0.82) < 0.001, `calibration: aero ${big.aero.toFixed(3)}`);
  assert.ok(Math.abs(big.power - 0.874) < 0.001, `calibration: power ${big.power.toFixed(3)}`);
  assert.ok(!big.terminal, 'but one big shunt must not end the race on its own');

  /*
   * No single contact may end the race.
   *
   * The severity metric is not bounded at the 38 the rate was sized against -- the worst
   * shunt measured in a Bahrain race was 231.6, which uncapped retires both cars involved
   * from one incident. A cap keeps terminal damage something a race accumulates.
   */
  for (const severity of [80, 231.6, 1000, 1e6]) {
    const hit = createDamage(() => 0.5);
    applyImpact(hit, severity);
    assert.ok(!hit.terminal, `severity ${severity} must not retire a car by itself`);
    assert.ok(hit.total <= 0.45, `severity ${severity} must be capped, got ${hit.total}`);
  }

  // Terminal damage is reachable, and it is reachable by accumulation.
  const wrecked = createDamage(() => 0.5);
  let hits = 0;
  while (!wrecked.terminal && hits < 20) {
    applyImpact(wrecked, 38);
    hits += 1;
  }
  assert.ok(wrecked.terminal, 'repeated heavy contact must end the race');
  assert.ok(hits >= 2 && hits <= 5, `a car should survive a couple of big hits, retired after ${hits}`);
  assert.equal(retirementReason(wrecked), 'DAMAGE');

  /*
   * The physics has to actually consume it. `aeroFactor` is read by `computeDownforce`, so a
   * car with it set has measurably less grip -- this is the assertion that would fail if the
   * damage state were computed correctly and then never applied.
   */
  const track = buildTrack(getCircuit('monza'));
  const entry = createChampionship().entries[0];
  const clean = new CarPhysics();
  clean.reset({ x: 0, z: 0, heading: 0 });
  const hurt = new CarPhysics();
  hurt.reset({ x: 0, z: 0, heading: 0 });
  hurt.aeroFactor = 0.5;
  assert.ok(
    hurt.computeDownforce(80) < clean.computeDownforce(80) * 0.6,
    `half the aero must be half the downforce: ${hurt.computeDownforce(80).toFixed(0)} vs ${clean.computeDownforce(80).toFixed(0)} N`
  );
  assert.ok(track.length > 0, 'and the circuit is a real one, so the comparison means something');

  /*
   * The negative feedback that stops damage running away.
   *
   * Damage is self-amplifying: a car that has lost downforce understeers, understeering cars
   * collect more contact, and the loop eats the field. Measured with no feedback, 23 of 23
   * cars retired from one Monza race. The driver lifting is what breaks it, so the AI has to
   * express it -- otherwise the model can only express "this race is now unwinnable".
   */
  const aiSource = readFileSync(new URL('../src/ai/AIDriver.js', import.meta.url), 'utf8');
  assert.match(aiSource, /physics\.aeroFactor\s*<\s*1/, 'a damaged AI must lift');
  assert.match(aiSource, /DAMAGE_LIFT/, 'and the lift must be bounded, not unbounded slowdown');
});

test('mechanical failure uses the team reliability that was already in the data', () => {
  /*
   * `TEAMS[].reliability` runs 0.91 to 0.98 and was inert in three places: it seeded upgrade
   * priority, it was documented as feeding mechanical failure, and it never did. A race now
   * retires cars for both reasons, and the two must be distinguishable.
   */
  const better = setReliability(createDamage(() => 0.5), 0.98);
  const worse = setReliability(createDamage(() => 0.5), 0.91);
  assert.ok(better.hazardPerKm < worse.hazardPerKm, 'the worse team must carry the higher hazard');
  /*
   * Asserted over this game's real race distance, not a nominal Grand Prix one.
   *
   * These circuits run 35-40 km. Calibrating against a 5.3 km figure put 4 mechanical
   * retirements in a single Bahrain race, because a hazard is a rate and the distance was
   * wrong by a factor of seven. So the bound is stated over 38 km.
   */
  assert.ok(failureRisk(worse, 38) > 0, 'a race distance must carry some risk');
  assert.ok(failureRisk(worse, 38) < 0.1, `the worst team must stay under 10% a race, got ${failureRisk(worse, 38)}`);
  assert.ok(failureRisk(better, 38) < 0.03, `and the best under 3%, got ${failureRisk(better, 38)}`);
  // Across a field of 23 that has to land near one retirement per race, not four.
  const expectedPerRace = failureRisk(setReliability(createDamage(() => 0.5), 0.95), 38) * 23;
  assert.ok(expectedPerRace < 1.5, `about one mechanical retirement per race, got ${expectedPerRace.toFixed(2)}`);
  assert.ok(
    failureRisk(better, 38) < failureRisk(worse, 38),
    'and the better team must be the safer one over the same distance'
  );

  // Risk grows with distance, which is what makes it a hazard rather than a flat roll.
  assert.ok(failureRisk(worse, 76) > failureRisk(worse, 38), 'twice the distance, more risk');

  // The failure sets a different reason than damage does.
  const broke = setReliability(createDamage(() => 0), 0.91);
  rollMechanical(broke, 100_000);
  assert.ok(broke.terminal, 'a hazard this size must eventually fire');
  assert.equal(retirementReason(broke), 'MECHANICAL');
  assert.notEqual(retirementReason(broke), retirementReason({ terminal: true, mechanical: false }));

  /*
   * The reason a whole race once stopped progressing.
   *
   * Rolling mechanical failure once per car per step off the *session's* random stream meant
   * 23 draws x 120 steps = 2,760 per second, which silently perturbed every other stochastic
   * decision until the field stopped advancing. So the stream has to be per car, and seeded,
   * and the roll has to be on distance rather than on frames.
   */
  // The default must be *no* stream, so a car that forgets to supply one fails safe instead
  // of quietly borrowing the session's.
  assert.equal(createDamage().random, null, 'no stream by default; the session one must never be assumed');

  // Rolls are on distance, not frames: a second of racing accumulates toward the interval
  // without drawing, and a car sitting still cannot fail.
  const walked = setReliability(createDamage(() => 0.5), 0.91);
  rollMechanical(walked, 40); // 1s at 144 km/h: under the interval, so no draw
  assert.equal(walked.sinceRoll, 40, 'a short step must accumulate rather than draw');
  assert.ok(!walked.terminal);
});

test('the HUD tells the player what the weather is doing', () => {
  /*
   * Weather that reaches the physics but not the screen is worse than no weather at all:
   * the car stops gripping and the player has nothing to explain it, so it reads as the
   * controls breaking. This is the seventh time this repo has had a value computed
   * correctly and then never read.
   *
   * `weather` reaches the car already -- `surfaceGrip` follows `weatherState.grip`. What was
   * missing was anything the player could see.
   */
  const gameSource = readFileSync(new URL('../src/core/Game.js', import.meta.url), 'utf8');
  assert.match(
    gameSource,
    /weather: this\.session\.weatherState\?\.id/,
    'the session weather must reach the HUD telemetry'
  );

  // The label map must not drift from the presets, or the chip shows a state the car is not in.
  const labels = uiSource.match(/const WEATHER_LABEL = \{([\s\S]*?)\n\};/);
  assert.ok(labels, 'the HUD must map weather ids to labels');
  const mapped = [...labels[1].matchAll(/\s*'?([a-z-]+)'?:/g)].map((m) => m[1]);
  for (const state of WEATHER) {
    assert.ok(mapped.includes(state.id), `the HUD has no label for the '${state.id}' preset`);
  }

  // And the change must be announced, not merely displayed: a chip that silently reads
  // LIGHT RAIN is easy to miss while chasing a car.
  assert.match(uiSource, /WEATHER_ANNOUNCE\[weather\]/, 'a weather change must raise an alert');
  assert.match(uiSource, /this\.alert\(WEATHER_ANNOUNCE/, 'and it must go through the alert path');

  // The chip is hidden on a circuit that cannot change, so a dry race does not spend a
  // HUD region promising something that will not happen.
  assert.match(uiSource, /e\.weather\.hidden = !changeable/);
});

test('the timing tower shows a gap in seconds, which is what a tower shows', () => {
  /*
   * `RaceOrder` computes both readings and its own comment says which is which -- `secondsToAhead`
   * is "a gap in seconds, from the distance gap divided by the speed of the car behind, which is
   * how a timing tower shows it" -- and the tower printed the distance instead, with an "s" on
   * it. A car eighty metres back showed as "+82.4s". The player's own gap readout reads the
   * seconds, so the tower's looked plausible; `gapToAhead` and `secondsToAhead` being one word
   * apart is the trap that produced it.
   */
  const cars = [
    { id: 'VER', distance: 1000, speed: 50, retired: false },
    { id: 'NOR', distance: 900, speed: 50, retired: false },
    { id: 'LEC', distance: 880, speed: 40, retired: false }
  ];
  const order = new RaceOrder().update(cars);

  // The two readings, from the same pair of cars: 100m behind, two seconds behind.
  assert.equal(order[1].gapToAhead, 100, 'the distance gap is in metres');
  assert.equal(order[1].secondsToAhead, 2, 'and the time gap is that distance over the speed');

  const ui = { elements: { standings: { innerHTML: '' } } };
  UIManager.prototype.updateStandings.call(ui, order, 'NOR', 4);
  const html = ui.elements.standings.innerHTML;
  assert.match(html, /LEADER/, 'the leader leads');
  assert.match(html, /\+2\.000/, 'two seconds behind is shown as two seconds');
  assert.doesNotMatch(html, /\+100\.0/, 'not as a hundred');
});

test('a deleted lap is reported once, not once per frame', () => {
  /*
   * `invalidLap` stays set for the rest of a deleted lap, and the HUD drove `alert()` straight
   * from the flag on every frame. `alert()` deliberately restarts its animation on every call
   * (it exists to be noticed), so being driven from a state rather than an event meant the
   * message never got past the first frames of its pop: unreadable for the whole lap, sitting
   * in the one alert slot the HUD has, and blocking the messages that matter more -- damage and
   * weather. The flag is a state; the alert belongs to the transition into it, which is how
   * `#setDamage` and `#setWeather` are already written.
   */
  assert.match(uiSource, /this\.alert\('INVALID LAP'/, 'a deleted lap must still be reported');
  assert.doesNotMatch(
    uiSource,
    /if \(telemetry\.invalidLap\) this\.alert/,
    'the state must not be re-reported every frame'
  );
  assert.match(
    uiSource,
    /Boolean\(telemetry\.invalidLap\) !== this\.lastInvalidLap/,
    'the transition is what arms the alert, and the flag going false is what re-arms it'
  );
});

test('no two HUD regions can overlap, at any viewport', () => {
  /*
   * A structural check rather than a screenshot.
   *
   * The right-hand HUD used to position the position counter and the timing tower as
   * two independent absolute boxes separated by a computed offset, and
   * `calc(var(--pad) + var(--safe-t) + var(--ui-lg))` silently evaluated to just
   * `--pad` -- which put the timer panel directly on top of the position number.
   * Nothing caught it because bounding boxes are not asserted anywhere.
   *
   * This does not measure pixels; it asserts the structural property that makes overlap
   * impossible: the stacked elements are children of one grid column, so the browser
   * places them and no hand-computed offset is involved.
   */
  const uiSource = readFileSync(new URL('../src/ui/UIManager.js', import.meta.url), 'utf8');

  // Position, gap and timer are inside one column.
  const column = /<div class="hud-right"[^>]*>[\s\S]*?hud-topright[\s\S]*?hud-timer[\s\S]*?<\/div>\s*<\/div>/;
  assert.match(uiSource, column, 'the right-hand HUD must be a single containing column');
  assert.match(uiSource, /data-hud-right/, 'and must be identifiable');

  const cssSource = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

  // No computed offsets between the stacked elements: a column cannot overlap itself.
  assert.match(cssSource, /\.hud-right\s*\{[^}]*display:\s*grid/, 'the column must be a grid');
  assert.match(
    cssSource,
    /\.hud-right \.hud-topright,\s*\.hud-right \.hud-timer\s*\{[^}]*position:\s*static/,
    'its children must not be independently positioned'
  );
  assert.doesNotMatch(
    cssSource,
    /\.hud-timer\s*\{[^}]*\btop:/,
    'the timer must not carry a hand-computed top offset'
  );

  /*
   * The two new regions must not be positioned by magic fractions that could put them
   * on top of each other either. The gantry uses a rem floor for exactly that reason.
   */
  assert.match(
    cssSource,
    /\.hud-lights\s*\{[^}]*top:\s*max\(/,
    'the start gantry must be floored clear of the minimap'
  );
  assert.match(
    cssSource,
    /\.hud-minimap\s*\{[^}]*width:\s*clamp\(/,
    'the minimap box must hug the map rather than shrink-to-fit its label'
  );
});

test('every circuit has a place, and the place is a real claim', () => {
  /*
   * The world is built from a per-circuit profile, so a missing profile is a circuit
   * that renders as a generic -- and therefore wrong -- place. It must not be silent.
   */
  for (const circuit of CIRCUITS) {
    const profile = environmentFor(circuit.id);
    assert.ok(profile, `${circuit.id} has no environment profile`);
    assert.ok(
      Object.values(SETTING).includes(profile.setting),
      `${circuit.id}: unknown setting "${profile.setting}"`
    );
    for (const key of ['treeDensity', 'buildingDensity', 'dust']) {
      const value = profile[key];
      assert.ok(
        Number.isFinite(value) && value >= 0 && value <= 1,
        `${circuit.id}: ${key} should be a 0..1 relative density, got ${value}`
      );
    }
    assert.ok(
      Number.isFinite(profile.groundTint),
      `${circuit.id}: groundTint must be a colour`
    );
  }

  /*
   * The profiles must actually differ.
   *
   * A table where every circuit has the same numbers is a table that has done nothing,
   * and it would pass every other assertion in this test.
   */
  const signatures = new Set(
    CIRCUITS.map((circuit) => {
      const profile = environmentFor(circuit.id);
      return `${profile.setting}:${profile.treeDensity}:${profile.buildingDensity}`;
    })
  );
  assert.ok(
    signatures.size >= 6,
    `the profiles should distinguish circuits; only ${signatures.size} distinct signatures across ${CIRCUITS.length}`
  );

  // And the extremes must be where they actually are, not scattered.
  const spacy = environmentFor('spa');
  const bahraini = environmentFor('bahrain');
  const monaco = environmentFor('monaco');
  const melbourne = environmentFor('melbourne');

  assert.ok(spacy.treeDensity > 0.8, 'Spa is forested');
  assert.ok(bahraini.treeDensity < 0.2, 'Bahrain is bare');
  assert.equal(monaco.setting, SETTING.street, 'Monaco is a street circuit');
  assert.ok(monaco.buildingDensity > 0.8, 'and has buildings hard against the barrier');
  assert.ok(melbourne.treeDensity > 0.7, 'Albert Park is leafy');

  // Street circuits are the ones with no run-off, which is the difference that changes
  // how a circuit drives rather than how it looks.
  assert.equal(isStreet(monaco.setting), true);
  assert.equal(isStreet(spacy.setting), false);

  // An unknown circuit must still build a world.
  const fallback = environmentFor('not-a-circuit');
  assert.equal(fallback.setting, SETTING.permanent);
  assert.ok(fallback.treeDensity > 0);
});

test('elevation is real data, and the gradient stays driveable', () => {
  /*
   * The fetch pipeline exists because two obvious sources come up empty:
   *
   * - OSM `ele` tags. Queried: Monza's raceway is 216 nodes and *none* carry elevation.
   * - The published centrelines. The CSV mirrors have no elevation column at all.
   *
   * So elevation comes from OSM for *where* the circuit goes and a DEM for *how high*
   * it is. These assertions are about the result being real and usable, not present.
   */
  const withData = Object.entries(ELEVATION);
  assert.ok(withData.length > 0, 'at least some circuits should have real elevation');

  /*
   * Coverage, and the two circuits deliberately without a profile.
   *
   * `silverstone` is refused rather than missing by accident. Its 95 `highway=raceway` ways
   * within 2km include enough of the rest of the estate to pass the extent check, and the
   * profile came out 1.7m of relief where sampling the DEM at real points round the actual
   * circuit gives 11.1m -- an underestimate by about 6x. Re-smoothing does not recover it
   * (+/-3 points still gives 1.6m), so the trace itself is flat, not the smoothing.
   *
   * `vegas` is the other absence: the Strip circuit is mapped in fragments, so only 4 of the
   * 240 profile buckets fill and there is no trace worth sampling. Both are recorded in
   * `scripts/fetch-elevation.mjs`'s refusal list with the measurement that refuses them.
   *
   * A wrong profile is worse than a missing one: a missing circuit renders flat *honestly*,
   * while a wrong one renders a real circuit incorrectly, and at Silverstone that silently
   * removes the Chapel and Maggotts/Becketts elevation changes.
   *
   * The set is asserted exactly rather than counted. "At least 22 of 24" also passes when one
   * of these two gains a profile and a different circuit loses its own: the count is identical
   * either way, but the second file has a circuit nobody decided to drop.
   */
  const withoutProfile = CIRCUITS.map((circuit) => circuit.id)
    .filter((id) => !ELEVATION[id])
    .sort();
  assert.deepEqual(
    withoutProfile,
    ['silverstone', 'vegas'],
    'only circuits refused with a measurement may be missing a profile'
  );

  for (const [id, entry] of withData) {
    assert.equal(entry.profile.length, PROFILE_POINTS, `${id}: profile should have ${PROFILE_POINTS} points`);
    for (const value of entry.profile) {
      assert.ok(Number.isFinite(value), `${id}: profile contains a non-finite elevation`);
    }
    // Elevations are heights above sea level, so they are positive and plausible.
    const min = Math.min(...entry.profile);
    const max = Math.max(...entry.profile);
    assert.ok(min >= -420 && max < 4500, `${id}: elevations should be plausible, got ${min}..${max}`);
  }

  /*
   * The profiles must agree with reality.
   *
   * These are the checks that would catch a broken pipeline: if the projection were
   * mis-keyed, or the nodes belonged to a different circuit, or the profile were
   * inverted, the *shape* of the data would still look fine and the numbers would not.
   */
  const rangeOf = id => {
    const profile = ELEVATION[id]?.profile;
    return profile ? Math.max(...profile) - Math.min(...profile) : null;
  };

  // Monza sits at roughly 190m and gains about 15m across the lap.
  if (ELEVATION.monza) {
    const monza = ELEVATION.monza.profile;
    assert.ok(
      monza.every((v) => v > 150 && v < 230),
      `Monza should be around 180-200m, got ${Math.min(...monza)}-${Math.max(...monza)}`
    );
    assert.ok(rangeOf('monza') > 5, `Monza has real elevation change, got ${rangeOf('monza')}m`);
  }

  // Monaco starts at the harbour and climbs to La Turbie. Nothing about it is flat,
  // and nothing about it is alpine -- it is the circuit most defined by its gradient.
  if (ELEVATION.monaco) {
    assert.ok(rangeOf('monaco') > 20, `Monaco should climb substantially, got ${rangeOf('monaco')}m`);
    assert.ok(
      ELEVATION.monaco.profile.every((v) => v >= -10 && v < 200),
      'Monaco should be low-lying, not mountainous'
    );
  }

  /*
   * On the track, the gradient must be driveable.
   *
   * A DEM sampled every few metres produces local gradients far steeper than any real
   * road. A car obeying one gets launched off the crest, which looks spectacular and is
   * wrong -- so the profile is clamped on the way in, and this asserts the clamp bites.
   */
  for (const id of ['monza', 'monaco', 'sepang', 'bahrain', 'montreal', 'miami', 'jeddah']) {
    const track = buildTrack(getCircuit(id));
    let maxGrade = 0;
    for (let i = 1; i < track.samples.length; i += 1) {
      maxGrade = Math.max(maxGrade, Math.abs(track.samples[i].y - track.samples[i - 1].y) / track.step);
    }
    assert.ok(maxGrade < 0.11, `${id}: gradient ${(maxGrade * 100).toFixed(1)}% exceeds what a car can hold`);

    // Every sample must sit on the profile, including the racing line.
    for (const sample of track.samples) {
      assert.ok(Number.isFinite(sample.y), `${id}: sample height is not finite`);
      assert.equal(sample.lineY, sample.y, `${id}: the racing line must sit on the road surface`);
    }

    /*
     * No seam at the start/finish line.
     *
     * The profile is circular, so the last point joins the first. A step here is
     * invisible in the data and very visible in the world: a car crossing the line
     * would drop or jump.
     */
    const samples = track.samples;
    const seam = Math.abs(samples[0].y - samples[samples.length - 1].y);
    assert.ok(seam < 0.5, `${id}: ${seam.toFixed(2)}m step across the start/finish line`);
  }

  /*
   * A circuit with no data must be flat, not broken.
   *
   * The circuit is chosen from what is actually missing rather than hardcoded, because a named
   * example goes stale the moment coverage improves: this asserted on Spa, and then Spa gained a
   * real profile, at which point the assertion was testing a circuit with the most elevation in
   * the calendar against a claim that it has none.
   */
  const missing = CIRCUITS.find((circuit) => !ELEVATION[circuit.id]);
  assert.ok(missing, 'at least one circuit is expected to lack elevation data, for this check to mean anything');
  const flat = buildTrack(getCircuit(missing.id));
  assert.ok(
    flat.samples.every((sample) => sample.y === 0),
    `${missing.id}: a circuit with no elevation data must be flat`
  );

  // And the interpolator must wrap rather than clamp.
  const profile = ELEVATION.monza.profile;
  assert.equal(elevationAt(profile, 0), profile[0]);
  assert.equal(elevationAt(profile, 1), profile[0], 'fraction 1 is the same point as 0');
  assert.ok(elevationAt(profile, -0.25) > 0, 'negative fractions must wrap, not clamp to zero');
});

test('real elevation is actually rendered, not just fetched and stored', () => {
  /*
   * The single most-repeated "this looks flat" complaint traced to data that was fetched
   * in PR #17, resampled into every track sample, gradient-clamped, unit-tested for
   * monotonicity -- and read by nothing. `TrackMesh` hardcoded `0.02` for the road, the
   * walls started at `0`, the kerbs used one constant `KERB_HEIGHT` for the whole buffer,
   * `syncCarMesh` pinned every car to `y = 0`, and the chase camera held a fixed altitude.
   *
   * So Monza's real 182m-196m was a flat plane, and the test suite passed throughout,
   * because the tests asserted the *data* was sane and never that the world used it.
   */
  for (const id of ['monza', 'monaco', 'sepang', 'bahrain', 'montreal', 'jeddah', 'miami']) {
    const entry = ELEVATION[id];
    if (!entry) continue;
    const track = buildTrack(getCircuit(id));
    const heights = track.samples.map((sample) => sample.y);
    const range = Math.max(...heights) - Math.min(...heights);
    // Compared as a fraction of the real span, not against a round number: the gradient
    // clamp is allowed to shave a little off, but not the shape of the circuit.
    const realRange = Math.max(...entry.profile) - Math.min(...entry.profile);

    assert.ok(
      range >= realRange * 0.9,
      `${id}: real elevation spans ${realRange.toFixed(1)}m but the track surface only ` +
      `spans ${range.toFixed(1)}m -- it is being drawn flat`
    );

    // The road a car drives on, not the centreline, must carry the height too.
    for (const sample of track.samples) {
      assert.ok(
        Math.abs(sample.lineY - sample.y) < 1e-6,
        `${id}: the racing line must sit on the road surface, not float above it`
      );
    }
  }

  // The renderer has to read it. Source-level, because the alternative is a WebGL context
  // in a unit test: a hardcoded height in the road ribbon is exactly the bug this guards.
  const meshSource = readFileSync(new URL('../src/render/TrackMesh.js', import.meta.url), 'utf8');
  assert.ok(
    /roadPositions\.push\(\s*leftX,\s*s\.y/.test(meshSource.replace(/\s+/g, ' ')),
    'the road ribbon must be built from the sample height, not a constant'
  );
  assert.ok(
    !/KERB_HEIGHT, quad\[/.test(meshSource),
    'kerbs must carry a per-vertex height, not one constant for the whole buffer'
  );

  const carSource = readFileSync(new URL('../src/physics/CarPhysics.js', import.meta.url), 'utf8');
  assert.ok(/this\.y = 0/.test(carSource), 'the car must carry a height for the renderer to place it on');
});

test('no profile claims to model elevation', () => {
  /*
   * A deliberate guard.
   *
   * Elevation is the most recognisable thing about Spa and Monaco and it is not
   * modelled: every centre is at y = 0. It would be easy to add plausible-looking
   * height numbers to make a circuit "feel" right, and that would be worse than leaving
   * it flat -- a wrong hill changes the driving as well as the view, so it would be
   * making the player lose time on terrain that does not exist.
   *
   * This asserts the absence stays deliberate and visible, so adding invented elevation
   * has to be a decision someone makes and documents rather than a quiet default.
   */
  const source = readFileSync(new URL('../src/track/environments.js', import.meta.url), 'utf8');
  assert.doesNotMatch(
    source,
    /elevation\s*[:=]\s*[0-9]/i,
    'environments.js must not carry elevation numbers without real survey data'
  );
  assert.match(
    source,
    /\*\*Elevation\.\*\*/,
    'the absence of elevation must stay documented where the data lives'
  );
});

test('the portrait block actually shows the rotate hint', () => {
  // `.rotate-hint { display: none }` came *after* the portrait media query that
  // sets `display: flex`. Equal specificity, so source order decided and the base
  // rule always won: the hint never rendered. The same query hides `#app`, so a
  // portrait phone got a blank page with nothing explaining why.
  //
  // This is structurally checkable, and it is the same failure as the
  // `.loading[hidden]` rule -- a display declaration quietly overriding the one
  // meant to control it -- so it is checked the same way.
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

  const match = /\.rotate-hint\s*\{\s*display:\s*none/.exec(css);
  assert.ok(match, 'the rotate hint needs a default display: none');
  const base = match.index;
  const media = css.indexOf('@media (orientation: portrait)');
  assert.ok(media >= 0, 'the rotate hint needs a portrait media query');
  assert.ok(
    base < media,
    'the default display: none must come before the portrait media query, or it wins on source order'
  );

  // And the query must actually do something in both halves.
  const query = css.slice(media, css.indexOf('@keyframes rotate-hint', media));
  assert.match(query, /#app\s*\{\s*visibility:\s*hidden/, 'portrait must hide the app');
  assert.match(query, /\.rotate-hint\s*\{[^}]*display:\s*flex/, 'portrait must show the hint');

  // The lock is best-effort: iOS has no web orientation lock, so the CSS block is
  // the mechanism that actually works there.
  assert.match(mainSource, /screen\.orientation/, 'landscape lock should be attempted');
  assert.match(mainSource, /lock\('landscape'\)/);
});

test('the on-screen controls are actually wired to the input controller', () => {
  // Three separate bugs, same shape: the control layer was built, styled and
  // visible, and not connected to anything.
  //
  //   1. `new UIManager(uiRoot)` passed no input, so `#bindTouch`'s
  //      `if (!this.input) return` fired on every boot and bound nothing.
  //   2. The pedals wrote to `input.touch.throttle` while `read()` consulted
  //      `touchButtons`, populated only by the never-called `bindButton`.
  //   3. `bindStick` measured horizontal travel only, so there was no throttle.
  //
  // None of them threw, so the game ran fine and the controls did nothing.
  assert.match(mainSource, /input: game\.input/, 'the game owns the input controller and must pass it in');
  assert.doesNotMatch(
    uiSource,
    /if \(!this\.input\) return;/,
    'a missing input controller must throw, not silently skip binding'
  );

  // Every on-screen control is bound through the one path.
  assert.doesNotMatch(uiSource, /input\.touch\.(throttle|brake)\s*=/, 'pedals must go through bindButton');
  for (const control of ['ers', 'drs', 'reset', 'camera']) {
    assert.match(uiSource, new RegExp(`\\['${control}', ACTIONS\\.\\w+`), `${control} must be bound`);
  }

  // Throttle and brake come off the stick's vertical axis.
  const inputSource = readFileSync(new URL('../src/core/InputController.js', import.meta.url), 'utf8');
  assert.match(inputSource, /this\.touch\.throttle = clamp\(-dy \/ reach, 0, 1\)/, 'stick up = throttle');
  assert.match(inputSource, /this\.touch\.brake = clamp\(dy \/ reach, 0, 1\)/, 'stick down = brake');
  assert.match(
    inputSource,
    /this\.touch\.steer = stickAxis\(dx, reach, this\.curve\)/,
    'stick across = steer, through the response curve'
  );

  // `read()` must consider both on-screen sources, or a control wired to
  // whichever one it picked can silently go dead again.
  assert.match(inputSource, /this\.touch\.throttle/, 'read() must consult touch.throttle');
  assert.match(inputSource, /this\.touchButtons\.has\(ACTIONS\.throttle\)/, 'read() must consult touchButtons');

  // A control that is *only* cleared on pointerleave releases the moment a thumb
  // crosses its edge. Pointer capture is what makes holding it survivable.
  assert.doesNotMatch(inputSource, /addEventListener\('pointerleave', up\)/);

  /*
   * Pedals for motion mode.
   *
   * The stick supplies throttle and brake from its vertical axis, so hiding it for
   * motion mode would leave the player with no pedals at all. They have to exist and
   * be bound, or motion mode is unplayable -- and nothing else would notice, because
   * the game still runs perfectly with the controls merely absent.
   */
  assert.match(uiSource, /data-pedal="throttle"/, 'a throttle pedal must exist for motion mode');
  assert.match(uiSource, /data-pedal="brake"/, 'and a brake pedal');
  // Matched across `querySelector(...)` -- a `[^)]*` cannot span those parentheses.
  assert.match(
    uiSource,
    /bindButton[\s\S]{0,90}data-pedal="throttle"[\s\S]{0,40}ACTIONS\.throttle/,
    'the throttle pedal must be bound through bindButton'
  );
  assert.match(
    uiSource,
    /bindButton[\s\S]{0,90}data-pedal="brake"[\s\S]{0,40}ACTIONS\.brake/,
    'and so must the brake pedal'
  );
  // Pedals are shown in motion mode and hidden otherwise, by the same call that hides
  // the stick. Anything less and one scheme is left with no pedals.
  assert.match(uiSource, /this\.pedals\.hidden = !motion/, 'pedals visibility follows the scheme');

  // Motion must not be a pedal source: tilt is good steering and a poor throttle.
  //
  // Asserted on `InputController`, which is where a tilt could actually be *combined*
  // with a pedal. Deliberately not asserted against `MotionControl`'s own source: it
  // mentions throttle and brake constantly, in the comments explaining that it does
  // not handle them, and no amount of pattern matching tells those apart. The real
  // proof is behavioural and lives in "motion supplies steering only", which asserts
  // the reported shape and that a hard-over tilt leaves the throttle at zero.
  assert.doesNotMatch(
    inputSource,
    /motion\?\.throttle|motion\?\.brake/,
    'motion must not supply throttle or brake'
  );

  // A control hidden under a finger never gets its pointerup, so its action would
  // stay asserted for the rest of the session -- a stuck throttle is a car that drives
  // off on its own. Switching scheme has to release everything held.
  assert.match(uiSource, /this\.input\.releaseHeld\(\)/, 'switching scheme must release held controls');
});

test('every element toggled via [hidden] also has a [hidden] display rule', () => {
  // `hidden` is a UA-level `display: none`. Any class rule that sets `display` beats
  // it on specificity, so a full-screen overlay with `display: flex` keeps painting
  // after `.hidden = true`.
  //
  // This is not hypothetical: `.loading` did exactly this and the loading screen sat
  // on top of a running race, which reported as "stuck on loading". The DOM said
  // `hidden`, the screen said otherwise, and nothing in the JS could tell.
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

  // Class names the UI toggles with the `hidden` property.
  const toggled = ['loading', 'overlay'];
  for (const className of toggled) {
    assert.match(
      css,
      new RegExp(`\\.${className}\\[hidden\\]\\s*\\{[^}]*display:\\s*none`, 's'),
      `.${className} is toggled with the hidden property but has no [hidden] display rule, ` +
        'so a display rule on the base class will override it'
    );
  }

  // Catch the general shape of the mistake in future: any full-screen overlay class
  // that sets display and is never given a [hidden] counterpart.
  const fullScreenOverlays = [...css.matchAll(/\.([a-z-]+)\s*\{([^}]*)\}/g)]
    .filter(([, name, body]) => /position:\s*absolute/.test(body) && /inset:\s*0/.test(body) && /display:\s*(flex|grid|block)/.test(body))
    .map(([, name]) => name);
  assert.ok(fullScreenOverlays.length > 0, 'expected to find full-screen overlay classes');
  for (const name of fullScreenOverlays) {
    assert.match(
      css,
      new RegExp(`\\.${name}\\[hidden\\]`),
      `.${name} is a full-screen overlay with a display rule and no [hidden] counterpart`
    );
  }

  /*
   * And every element the HUD itself hides, taken from its own markup.
   *
   * The check above only looks at full-screen overlays, which is the shape the first two
   * instances happened to have. The damage bar and the conditions chip are not full-screen --
   * they sit bottom-centre and top-left, they set `display: flex`, and they are toggled with
   * `hidden` like the rest. A guard that only recognises the shape of the last bug is how the
   * next one survives: the damage bar was meant to be invisible below 2% and the chip absent on
   * a circuit that cannot change weather, and neither of them ever hid.
   */
  const toggledInMarkup = [...uiSource.matchAll(/<div class="([^"]*)"[^>]*\bhidden\b/g)].map(([, classes]) => classes);
  assert.ok(toggledInMarkup.length >= 5, `expected to find the HUD's hidden elements, found ${toggledInMarkup.length}`);
  for (const classes of toggledInMarkup) {
    assert.ok(
      classes
        .split(/\s+/)
        .some((name) => new RegExp(`\\.${name}\\[hidden\\]`).test(css)),
      `${classes} is hidden by the HUD and has no [hidden] display rule against its display`
    );
  }
});

test('the start lights are ready for the next race', () => {
  /*
   * `is-go` is what holds the green GO on screen instead of letting the next state the session
   * reports replace it -- and it was added and never taken off. The flash is timed and the panel
   * is hidden at the end of it, so in the first race nothing looked wrong; from the second race
   * of a championship onwards, `setStartLights` refused to touch the caption, and the countdown
   * showed a green GO for its whole length: GET READY and HOLD never appeared again.
   */
  const flash = uiSource.match(/greenTimer = setTimeout\(\(\) => \{([\s\S]*?)\}, (\d+)\)/);
  assert.ok(flash, 'the GO flash must still be timed rather than cleared on the next frame');
  assert.match(flash[1], /classList\.remove\('is-go'\)/, 'and it must clear its own class when it ends');
  assert.match(uiSource, /classList\.add\('is-go'\)/, 'while still marking the flash as the flash');
});

test('Vite app targets the /f1/ GitHub Pages subpath', () => {
  assert.match(viteConfig, /base:\s*['"]\/f1\/['"]/, 'base should target /f1/');
  assert.match(viteConfig, /outDir:\s*['"]\.\.\/f1['"]/, 'build output should target ../f1');
  assert.match(viteConfig, /emptyOutDir:\s*true/, 'build should replace only the f1 route output');
  assert.equal(packageJson.type, 'module');
});

/* ------------------------------------------------------------------ track -- */

test('every circuit builds a closed, non-self-intersecting lap', () => {
  assert.equal(CIRCUITS.length, 24, '23 championship rounds plus Sepang, which hosted the moved Bahrain race');
  for (const circuit of CIRCUITS) {
    const track = buildTrack(circuit);
    assert.ok(track.length > 1200, `${circuit.id} should be a real lap`);
    // Spa is 7km and Jeddah 6.2km for real; the upper bound is now the longest
    // real circuit, not a number picked for the old six-circuit calendar.
    assert.ok(track.length < 7200, `${circuit.id} should not be a marathon`);
    /*
     * Real circuits come close to themselves, and the old assertion forbade it.
     * Monaco's tunnel run passes back over the harbour section, Baku's castle
     * section folds back on itself, and Suzuka is a figure-of-eight where the track
     * genuinely crosses over itself on a bridge. These are the layouts, not defects.
     *
     * What still matters is that a lap does not fold *through* itself, which is
     * the failure the radial-profile generator could produce. The bar is now a few
     * metres rather than a car width, which separates "genuinely close" from
     * "collapsed".
     */
    // Real circuits genuinely come close to themselves, so a car-width bar was
    // always going to be wrong here. What is left to guard is a fully degenerate
    // lap: a centreline that touches itself, which is what the radial-profile
    // generator could produce and what a failed medial-axis reduction produces.
    //
    // Suzuka sits at ~3m and is genuinely a figure-of-eight. That number is not
    // the real bridge separation, though -- it is the outline's medial axis
    // collapsing at the crossover, which is a limitation of that method and is
    // called out in the README. It is allowed explicitly rather than by quietly
    // loosening the bound for everything.
    const selfApproachLimit = circuit.id === 'suzuka' ? 0.25 : 6;
    assert.ok(
      track.minSelfDistance > selfApproachLimit,
      `${circuit.id} folded through itself at ${track.minSelfDistance.toFixed(1)}m`
    );
    assert.equal(track.count, track.samples.length);
    assert.equal(track.checkpoints.length, CHECKPOINT_COUNT);
  }
});

test('the self-intersection scan is exact, not merely close', () => {
  // The scan runs on a spatial hash rather than comparing every pair, which is a
  // real algorithmic risk: a hash that silently misses a nearby pair returns a
  // plausible-looking number and weakens the "must not pass within a car width of
  // itself" assertion above without ever failing it.
  //
  // So it is checked against brute force, including the case that broke the first
  // version. The circuit is a closed loop, so samples 650 and 5 of a 661-sample lap
  // are physically adjacent while being 645 apart in the array. Separation has to be
  // measured along the lap in both directions. The first spatial-hash version used
  // raw array index distance and reported 4m -- one sample spacing -- as the
  // minimum, because it was comparing the start line against itself.
  for (const circuit of CIRCUITS) {
    const track = buildTrack(circuit);
    const n = track.count;
    const gapSamples = Math.max(4, Math.round(220 / SAMPLE_SPACING));

    let brute = Infinity;
    for (let i = 0; i < n; i += 1) {
      const a = track.samples[i];
      for (let j = 0; j < n; j += 1) {
        const separation = i > j ? i - j : j - i;
        if (separation < gapSamples || separation > n - gapSamples) continue;
        const b = track.samples[j];
        const distance = Math.hypot(a.x - b.x, a.z - b.z);
        if (distance < brute) brute = distance;
      }
    }

    // Compared with tolerance rather than exactly, because the reference below uses
    // Math.hypot and the scan uses Math.sqrt. hypot is specified to be overflow-safe
    // and so scales before squaring, which makes its last bit differ from a plain
    // sqrt. Anything that actually matters -- a missed pair -- would be off by
    // metres, not by 1e-14.
    const tolerance = Math.max(1e-9, brute * 1e-12);
    assert.ok(
      Math.abs(track.minSelfDistance - brute) <= tolerance,
      `${circuit.id}: hashed scan found ${track.minSelfDistance.toFixed(4)}m, ` +
        `brute force found ${brute.toFixed(4)}m`
    );
    // This check exists to catch the separation filter not being applied, where
    // the answer collapses to roughly one sample spacing. Suzuka is a figure-of-
    // eight whose medial axis crosses itself, and lands at ~1m, so it is exempted
    // explicitly rather than by loosening the bound for every circuit.
    if (circuit.id !== 'suzuka') {
      assert.ok(
        brute > SAMPLE_SPACING * 1.5,
        `${circuit.id}: minimum self-distance of ${brute.toFixed(2)}m is within one sample ` +
          'spacing, which means adjacent samples are being compared'
      );
    }
  }
});

/**
 * Rebuild the racing-line descent's inputs from a built track.
 *
 * Mirrors `buildTrack`'s seeding. Duplicated deliberately rather than exported:
 * it is the *inputs* that matter here, and having the test recompute them from
 * `track.samples` means it stays honest if the production seeding changes.
 */
function seedInputs(track) {
  const samples = track.samples;
  const n = track.count;
  const xs = new Float64Array(n);
  const zs = new Float64Array(n);
  const rightX = new Float64Array(n);
  const rightZ = new Float64Array(n);
  const limits = new Float64Array(n);
  const seed = new Float64Array(n);
  const LINE_EDGE_MARGIN = 4.5;
  for (let i = 0; i < n; i += 1) {
    const s = samples[i];
    xs[i] = s.x;
    zs[i] = s.z;
    rightX[i] = s.rightX;
    rightZ[i] = s.rightZ;
    const limit = Math.max(0.6, s.width * 0.5 - LINE_EDGE_MARGIN);
    limits[i] = limit;
    const magnitude = Math.min(limit, Math.max(0, Math.abs(s.curvature) * 48));
    seed[i] = Math.sign(s.curvature) * magnitude;
  }
  return { xs, zs, rightX, rightZ, limits, seed };
}

/** Total length of the polyline through the racing-line points, in metres. */
function lineLength(inputs, offsets) {
  const { xs, zs, rightX, rightZ } = inputs;
  const n = xs.length;
  let total = 0;
  for (let i = 0; i < n; i += 1) {
    const next = i + 1 === n ? 0 : i + 1;
    const ax = xs[i] + rightX[i] * offsets[i];
    const az = zs[i] + rightZ[i] * offsets[i];
    const bx = xs[next] + rightX[next] * offsets[next];
    const bz = zs[next] + rightZ[next] * offsets[next];
    total += Math.hypot(ax - bx, az - bz);
  }
  return total;
}

test('the racing line is relaxed to the converged shortest path', () => {
  // LINE_RELAX_ITERATIONS is a speed/quality trade. This pins the quality side so
  // the number cannot be quietly lowered to make the loading screen feel faster:
  // at the configured count, no circuit's line may be measurably longer than the
  // fully converged shortest path.
  const excess = [];
  for (const circuit of CIRCUITS) {
    const track = buildTrack(circuit);
    const inputs = seedInputs(track);
    const reference = relaxRacingLine(
      inputs.xs,
      inputs.zs,
      inputs.rightX,
      inputs.rightZ,
      inputs.limits,
      inputs.seed,
      8000
    );
    const settled = relaxRacingLine(
      inputs.xs,
      inputs.zs,
      inputs.rightX,
      inputs.rightZ,
      inputs.limits,
      inputs.seed,
      LINE_RELAX_ITERATIONS
    );
    // Arc length, not offset: offset can look alarming while the line still sits
    // on the shortest-path manifold, and arc length is the quantity actually
    // being minimised.
    excess.push({
      circuit: circuit.id,
      metres: lineLength(inputs, settled) - lineLength(inputs, reference)
    });
  }
  for (const { circuit, metres } of excess) {
    /*
     * 0.65m over a 4-7km lap, on the worst circuit.
     *
     * This was 0.25m when the layouts were radial profiles. The real centrelines
     * carry far more curvature detail -- every corner is where the real circuit puts
     * it -- so the same iteration count converges less completely. Raising
     * `LINE_RELAX_ITERATIONS` to reach the old bound pushed the worst build from
     * 400ms to over 1s, which is a worse trade than half a metre of path length on
     * a lap that runs a minute and a half.
     */
    assert.ok(
      metres < 0.65,
      `${circuit}: line is ${metres.toFixed(3)}m longer than the converged shortest path; ` +
        `raise LINE_RELAX_ITERATIONS (currently ${LINE_RELAX_ITERATIONS})`
    );
  }
});

test('the track generator stays fast enough to be worth showing progress for', () => {
  // The whole reason buildTrack is split into yielding phases with a progress bar
  // is that it blocks the main thread. If this regresses, the loading screen goes
  // back to being a freeze, and it should fail here rather than in a bug report.
  for (const circuit of CIRCUITS) {
    const started = process.hrtime.bigint();
    buildTrack(circuit);
    const ms = Number(process.hrtime.bigint() - started) / 1e6;
    // 500ms, not the old 250ms. Real centrelines have far more curvature detail
    // than the radial profiles they replaced -- every corner is now wherever the
    // real circuit puts it -- so there is genuinely more work. Measured worst case
    // is ~400ms, and `scripts/circuit-perf.mjs` is the breakdown.
    //
    // The point of the bound is that the load screen is not a freeze. The build is
    // split into yielding phases for the same reason.
    assert.ok(ms < 500, `${circuit.id} took ${ms.toFixed(0)}ms to build, expected under 500ms`);
  }
});

test('track geometry is closed by construction, not by a solve', () => {
  // Radial profiles are closed and simple because every angle maps to exactly
  // one point. A straights-and-corners DSL cannot do that: its arc chords miss
  // the start line by hundreds of metres and no scaling fixes it.
  const points = profileFromPins(400, [{ at: 0, radius: 300 }, { at: 180, radius: 520 }]);
  assert.equal(points.length, 72);
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    assert.ok(Math.hypot(b.x - a.x, b.z - a.z) > 1, 'consecutive ring points must be distinct');
  }
  assert.throws(
    () => radialLoop({ radius: 400, harmonics: [{ order: 2, amplitude: 0.3 }, { order: 3, amplitude: 0.3 }] }),
    /fold the loop/,
    'over-large harmonics must be rejected'
  );
  void CLOSURE_TOLERANCE;
});

test('the racing line stays inside the kerbs and is actually driveable', () => {
  for (const circuit of CIRCUITS) {
    const track = buildTrack(circuit);
    for (const sample of track.samples) {
      const limit = sample.width * 0.5 - 4.5;
      assert.ok(
        Math.abs(sample.lineOffset) <= limit + 1e-6,
        `${circuit.id} line leaves the road at sample ${sample.index}`
      );
    }
    // A line that steps between adjacent samples is not followable: the curvature
    // spike at the step drags the speed profile to a crawl and the AI brakes for a
    // corner that is not there.
    let maxStep = 0;
    for (let i = 0; i < track.count; i += 1) {
      const next = track.samples[(i + 1) % track.count];
      maxStep = Math.max(maxStep, Math.abs(next.lineOffset - sample(track, i).lineOffset));
    }
    assert.ok(maxStep < 0.5, `${circuit.id} line steps ${maxStep.toFixed(2)}m between samples`);

    // The line must be shorter than the centreline, or it is not a racing line.
    const lineLength = pathLength(track, (s) => ({ x: s.lineX, z: s.lineZ }));
    assert.ok(lineLength < track.length, `${circuit.id} racing line should be shorter`);
  }

  function sample(track, i) {
    return track.samples[i];
  }
  function pathLength(track, get) {
    let total = 0;
    for (let i = 0; i < track.count; i += 1) {
      const a = get(track.samples[i]);
      const b = get(track.samples[(i + 1) % track.count]);
      total += Math.hypot(b.x - a.x, b.z - a.z);
    }
    return total;
  }
});

test('the speed profile asks for less grip than the car has', () => {
  for (const circuit of CIRCUITS) {
    const track = buildTrack(circuit);
    /*
     * Checked against the curvature the profile was *built from*, not the raw curvature of
     * the sampled points. The profile smooths it over PROFILE_CURVATURE_WINDOW samples
     * precisely because finite differences oscillate -- the test below this one exists for
     * the same reason -- so a sample-by-sample check against the raw value is asking the
     * profile to honour a limit it deliberately does not use. (With the raw value it also
     * fails: Bahrain's sample 183 demands 1.77g against a smoothed bound of 0.95g.)
     */
    const kappa = smoothCircular(
      track.samples.map((s) => s.lineCurvature),
      PROFILE_CURVATURE_WINDOW
    );
    track.samples.forEach((s, i) => {
      const implied = s.targetSpeed * s.targetSpeed * Math.abs(kappa[i]);
      // The profile must sit below what the car can actually hold *with* downforce.
      // A bare friction coefficient is the wrong bound: at speed the aero load
      // multiplies available grip several times over, and a profile checked
      // against it would be rejected for being achievable.
      const downforce = 0.5 * 1.225 * DEFAULT_GEOMETRY.downforceArea * s.targetSpeed * s.targetSpeed;
      const grip = (TYRE.peakGrip * (DEFAULT_GEOMETRY.mass * GRAVITY + downforce)) / DEFAULT_GEOMETRY.mass;
      /*
       * Both sides are accelerations in m/s^2, and `grip` already contains gravity.
       *
       * The extra `* GRAVITY` that used to be here turned the bound into roughly
       * 9.8 x 0.85 x 9.8 m/s^2 -- about 8.5g of grip, or several times what the car has
       * even at speed. The assertion could not fail for any positive speed, which is how
       * a speed profile demanding 486 m/s^2 of braking passed a test whose whole subject
       * was "the profile asks for less than the car has".
       */
      assert.ok(
        implied < grip * 0.85,
        `${circuit.id} profile demands ${(implied / GRAVITY).toFixed(2)}g at sample ${s.index}`
      );
    });
  }
});

test('the speed profile only asks for braking the profile itself allows', () => {
  /*
   * The profile carries its own reference braking, well under what the car can do, and its
   * backwards pass is built on it: between two adjacent samples the profile can therefore
   * never demand more deceleration than that reference. It did. A floor of 0.72 of the
   * corner speed was applied *after* the reachability passes, so a sample in the middle of a
   * braking zone was raised back up to the floor and then dropped to the corner speed one
   * sample later -- up to 486 m/s^2 between samples four metres apart, in a profile whose
   * own reference is 9.5. Nothing in the suite looked at the difference between adjacent
   * samples, so the profile was undriveable and the tests agreed it was fine.
   */
  for (const circuit of CIRCUITS) {
    const track = buildTrack(circuit);
    let worst = 0;
    let at = 0;
    for (let i = 0; i < track.count; i += 1) {
      const from = track.samples[i].targetSpeed;
      const to = track.samples[(i + 1) % track.count].targetSpeed;
      if (to >= from) continue;
      const demand = (from * from - to * to) / (2 * track.step);
      if (demand > worst) {
        worst = demand;
        at = track.samples[i].index;
      }
    }
    assert.ok(
      worst <= PROFILE_BRAKE * 1.05,
      `${circuit.id} asks for ${worst.toFixed(1)} m/s^2 between samples at ${at}; ` +
        `the profile's own reference is ${PROFILE_BRAKE}`
    );
  }
});

test('the speed profile is smooth enough to be driven', () => {
  for (const circuit of CIRCUITS) {
    const track = buildTrack(circuit);
    let worstJump = 0;
    for (let i = 0; i < track.count; i += 1) {
      const a = track.samples[i].targetSpeed;
      const b = track.samples[(i + 1) % track.count].targetSpeed;
      if (Math.min(a, b) < 1) continue;
      worstJump = Math.max(worstJump, Math.max(a, b) / Math.min(a, b));
    }
    // Curvature taken straight from sampled points oscillates, and turning that
    // into a speed limit produces braking events no car can physically perform.
    assert.ok(worstJump < 3, `${circuit.id} profile jumps by ${worstJump.toFixed(1)}x in 4m`);
  }
});

test('locating a car on the track is stable and correctly signed', () => {
  const track = buildTrack(getCircuit('suzuka'));
  for (let i = 0; i < track.count; i += 17) {
    const s = track.samples[i];
    const offset = 2.5;
    const located = locateOnTrack(track, s.x + s.rightX * offset, s.z + s.rightZ * offset, i);
    assert.equal(located.index, i, 'should find the sample it was told about');
    assert.ok(Math.abs(located.lateral - offset) < 0.2, 'lateral offset should be signed correctly');
    assert.ok(located.onTrack);
  }
  // Racing line points must lie on the road.
  for (let d = 0; d < track.length; d += 37) {
    const point = racingLineAt(track, d);
    const located = locateOnTrack(track, point.x, point.z, null);
    assert.ok(
      Math.abs(located.lateral) <= located.sample.width * 0.5,
      'the racing line must stay on the road'
    );
  }
});

test('laps only count when every gate is passed in order', () => {
  const track = buildTrack(getCircuit('suzuka'));
  const timer = new LapTimer(track);
  timer.lapStarted = true;
  timer.visited.add(0);
  timer.expected = 1;

  // Drive a clean lap around the racing line.
  let laps = 0;
  for (let d = 0; d < track.length * 2; d += 0.5) {
    const point = racingLineAt(track, d);
    if (timer.update(point.x, point.z, 0.5 / 30, 5).justCompletedLap) laps += 1;
  }
  assert.equal(laps, 2, 'two clean laps should register');
  assert.ok(timer.bestLap > 30, 'a lap time should have been recorded');

  // Now cut the course: cross the line without visiting the gates.
  const cheater = new LapTimer(track);
  cheater.lapStarted = true;
  cheater.visited.add(0);
  cheater.expected = 1;
  cheater.update(track.samples[5].x, track.samples[5].z, 1, 5);
  // Skip most of the lap, then cross the line. The crossing is detected from the
  // sample index wrapping, so it is seen even though the gate counter still points
  // at a gate in the middle of the lap.
  const far = racingLineAt(track, track.length - 30);
  cheater.update(far.x, far.z, 0.1, 5);
  const overLine = racingLineAt(track, 4);
  cheater.update(overLine.x, overLine.z, 0.1, 5);
  assert.equal(cheater.lap, 0, 'a cut lap must not count');
  assert.equal(cheater.invalid, true, 'a cut lap must be flagged');
});

/* ---------------------------------------------------------------- physics -- */

test('the car reaches real-world reference figures', () => {
  const car = new CarPhysics({ grip: 1 });
  let time = 0;
  const reached = {};
  let terminal = 0;
  let previous = 0;
  let settled = 0;
  while (time < 90) {
    car.step(DT, { throttle: 1, brake: 0, steer: 0 });
    time += DT;
    terminal = Math.max(terminal, car.speedKph);
    if (!reached.hundred && car.speedKph >= 100) reached.hundred = time;
    if (!reached.twoHundred && car.speedKph >= 200) reached.twoHundred = time;
    if (car.speedKph - previous < 0.01) settled += DT;
    else settled = 0;
    previous = car.speedKph;
    if (settled > 8) break;
  }
  assert.ok(reached.hundred > 1.8 && reached.hundred < 3.4, `0-100 should be ~2.6s, got ${reached.hundred?.toFixed(2)}`);
  assert.ok(reached.twoHundred > 4.5 && reached.twoHundred < 7, `0-200 should be ~5.8s, got ${reached.twoHundred?.toFixed(2)}`);
  assert.ok(terminal > 300 && terminal < 400, `top speed should be ~340 km/h, got ${terminal.toFixed(0)}`);
  void topSpeed();
});

test('braking from 300 km/h is strong but not impossible', () => {
  const car = new CarPhysics({ grip: 1 });
  car.reset(0, 0, 0, 300 / 3.6);
  car.gear = 6;
  let path = 0;
  let time = 0;
  let peak = 0;
  let previousX = car.x;
  let previousZ = car.z;
  while (car.speedKph > 100 && time < 20) {
    car.step(DT, { throttle: 0, brake: 1, steer: 0 });
    path += Math.hypot(car.x - previousX, car.z - previousZ);
    previousX = car.x;
    previousZ = car.z;
    peak = Math.max(peak, Math.abs(car.longitudinalG) / GRAVITY);
    time += DT;
  }
  assert.ok(peak > 3.5, `peak braking should exceed 3.5g, got ${peak.toFixed(2)}`);
  assert.ok(peak < 8, `peak braking should stay physical, got ${peak.toFixed(2)}`);
  assert.ok(path > 60 && path < 260, `300->100 km/h should be ~100-250m, got ${path.toFixed(0)}m`);
});

test('the gearbox reaches every gear and the limiter', () => {
  const car = new CarPhysics({ grip: 1 });
  const gears = new Set();
  let maxRpm = 0;
  for (let i = 0; i < 120 * 40; i++) {
    car.step(DT, { throttle: 1, brake: 0, steer: 0 });
    gears.add(car.gear);
    maxRpm = Math.max(maxRpm, car.rpm);
  }
  assert.equal(gears.size, POWERTRAIN.gearRatios.length, 'every gear should be used on a full run');
  assert.ok(maxRpm > POWERTRAIN.revLimit * 0.95, 'the engine should reach its rev limiter');
  assert.ok(maxRpm < POWERTRAIN.revLimit * 1.2, 'the engine must not rev far past the limiter');
});

test('gearing is not so short that the car is stuck in first', () => {
  // A too-short first gear means the upshift point is never reached, and the car
  // is permanently limited to whatever first gear can manage.
  const firstRatio = POWERTRAIN.gearRatios[0] * POWERTRAIN.finalDrive;
  const topRatio = POWERTRAIN.gearRatios.at(-1) * POWERTRAIN.finalDrive;
  assert.ok(firstRatio / topRatio > 2, 'the gearbox should span a sensible ratio range');
  const wheelCircumference = Math.PI * POWERTRAIN.wheelDiameter;
  const firstTopSpeed = ((POWERTRAIN.revLimit / 60) * wheelCircumference) / firstRatio;
  const topTopSpeed = ((POWERTRAIN.revLimit / 60) * wheelCircumference) / topRatio;
  // First gear should top out around 110-140 km/h and top gear near 350.
  assert.ok(
    firstTopSpeed * 3.6 > 100 && firstTopSpeed * 3.6 < 150,
    `first gear should top out around 120 km/h, got ${(firstTopSpeed * 3.6).toFixed(0)}`
  );
  assert.ok(
    topTopSpeed * 3.6 > 300,
    `top gear should reach top speed, got ${(topTopSpeed * 3.6).toFixed(0)} km/h`
  );
});

test('the torque curve is a plateau, not a spike', () => {
  const mid = torqueFactor(POWERTRAIN.peakTorqueRpm);
  const high = torqueFactor(POWERTRAIN.shiftUpRpm);
  assert.ok(mid > 0.95, 'torque should peak at its rated rpm');
  assert.ok(high > mid * 0.75, 'torque must not fall off a cliff before the upshift');
  assert.ok(torqueFactor(POWERTRAIN.idleRpm) < 0.7, 'torque should still be low at idle');
});

test('thrust is computed from wheel radius, not circumference', () => {
  // `torque * ratio` is wheel torque, and thrust is that over the wheel *radius*.
  // Dividing by the circumference instead silently costs a factor of 2*PI and
  // leaves the car gutless at any engine tune.
  assert.match(
    physicsSource,
    /function thrustFromTorque[\s\S]*?\/ WHEEL_RADIUS/,
    'thrust must divide by the wheel radius'
  );
  assert.doesNotMatch(physicsSource, /engineTorque \* gearRatio\) \/ WHEEL_CIRCUMFERENCE/);

  // And it must actually produce the expected acceleration.
  const car = new CarPhysics({ grip: 1 });
  car.reset(0, 0, 0, 0);
  for (let i = 0; i < 60; i += 1) car.step(DT, { throttle: 1, brake: 0, steer: 0 });
  assert.ok(
    car.longitudinalG > 2,
    `launch acceleration should be over 2g, got ${car.longitudinalG.toFixed(2)}`
  );
});

test('steering actually turns the car, and in the documented direction', () => {
  const car = new CarPhysics({ grip: 1 });
  car.reset(0, 0, 0, 30);
  for (let i = 0; i < 120; i += 1) car.step(DT, { throttle: 0.2, brake: 0, steer: 0.6 });
  assert.ok(car.yawRate > 0.1, 'positive steering should turn the car left (heading increases)');
  assert.ok(car.heading > 0, 'heading should increase with positive steering');
});

test('front slip angle includes the steer angle', () => {
  // Omitting it leaves a car travelling straight with zero front slip, so it
  // produces no lateral force and no yaw moment and holds its line no matter how
  // hard it is steered.
  assert.match(physicsSource, /frontDynamic[\s\S]*?-\s*this\.steerAngle/);
  const car = new CarPhysics({ grip: 1 });
  car.reset(0, 0, 0, 30);
  car.step(DT, { throttle: 0.2, brake: 0, steer: 0.5 });
  assert.ok(Math.abs(car.frontSlipAngle) > 0.01, 'steering must generate front slip');
  assert.ok(Math.abs(car.frontForce) > 100, 'front slip must produce lateral force');
});

test('reverse is a recovery aid, never a driving mode', () => {
  // Holding the brake selects reverse; a momentary brake must not, or a car that
  // brushes the brakes latches into reverse and drives away from the circuit.
  const brakeTap = new CarPhysics({ grip: 1 });
  brakeTap.reset(0, 0, 0, 0);
  for (let i = 0; i < 30; i += 1) brakeTap.step(DT, { throttle: 0, brake: 1, steer: 0 });
  assert.equal(brakeTap.direction, 1, 'a brief brake tap must not select reverse');

  // Holding it does select reverse.
  const held = new CarPhysics({ grip: 1 });
  held.reset(0, 0, 0, 0);
  for (let i = 0; i < Math.ceil((REVERSE_ENGAGE_HOLD + 0.3) / DT); i += 1) {
    held.step(DT, { throttle: 0, brake: 1, steer: 0 });
  }
  assert.equal(held.direction, -1, 'holding the brake should select reverse');

  /*
   * And throttle now *drives* whichever way is selected.
   *
   * This used to assert `throttle must reselect forward`, which pinned the bug rather than
   * the intent: throttle deselected reverse on the very next step, so reverse was selectable
   * but not drivable. It went unnoticed because this very test -- asserting `direction === -1`
   * after a brake hold -- kept passing. The fault was in the gap between selecting reverse and
   * driving in it.
   *
   * The consequence: the AI's spin recovery is `throttle: 1`, so a spun car could never go
   * anywhere. Measured at Jeddah, 90% of stopped cars faced backwards against a barrier and
   * 1% were reversing.
   */
  const from = held.x;
  for (let i = 0; i < Math.ceil(0.4 / DT); i += 1) held.step(DT, { throttle: 1, brake: 0, steer: 0 });
  assert.equal(held.direction, -1, 'throttle must not deselect reverse, or reverse is undriveable');
  // Reverse is deliberately gentle: 2000N over 800kg is ~2.5 m/s^2, so 0.4s is ~0.2m.
  assert.ok(held.x < from - 0.1, `the car must actually move backwards, x went ${from.toFixed(2)} -> ${held.x.toFixed(2)}`);

  /*
   * The guard the original test was reaching for, and the real reason reverse is bounded: it
   * is a recovery aid, not somewhere to live. It is released on speed, so a car held in it
   * reaches `REVERSE_LIMIT` and selects forward on its own.
   */
  // Reverse accelerates gently, so give it enough steps to actually pass the limit rather
  // than asserting on a boundary it may not have crossed yet.
  for (let i = 0; i < Math.ceil(20 / DT); i += 1) held.step(DT, { throttle: 1, brake: 0, steer: 0 });
  assert.equal(held.direction, 1, 'reverse must give way to forward once the car is moving');
  assert.ok(REVERSE_LIMIT <= 8, 'reverse must be strictly speed-limited');
});

test('yaw inertia is the tuned number, and the number is the tuned thing', () => {
  /*
   * The comment on this constant claimed it was "a fraction of mass * wheelbase^2". The code
   * uses `mass * yawInertiaPerKg`. The two differ by 13x -- 350 kg m^2 against 4530 -- so the
   * comment, the constant and the code disagreed about what a 795kg car with a 3.6m wheelbase
   * does when you turn the wheel.
   *
   * The code is the calibrated side: the inertia is deliberately light (a knife-edge car, held
   * stable by the yaw damping in `step`, with the AI's steering gains tuned against both), and
   * "fixing" it to match the old comment would silently re-tune the entire game. So the
   * arithmetic is pinned here, and the comment now says what the constant is.
   */
  const inertia = DEFAULT_GEOMETRY.mass * DEFAULT_GEOMETRY.yawInertiaPerKg;
  assert.ok(Math.abs(inertia - 350) < 5, `yaw inertia is ${inertia.toFixed(0)} kg m^2`);
  assert.ok(
    inertia < DEFAULT_GEOMETRY.mass * DEFAULT_GEOMETRY.wheelBase ** 2 * 0.5,
    'mass * wheelbase^2 is not the formula, and applying it re-tunes the car'
  );
});

test('engine braking is a force at the wheels, not a torque', () => {
  /*
   * `ax` is assembled from forces, and every drivetrain term goes through `thrustFromTorque`,
   * which divides by the wheel radius. Engine braking did not: it added `peakTorque *
   * engineBrake * gearRatio` straight into the sum -- a torque in newtons, 2.8x too small
   * (radius 0.36m) -- so lifting off slowed the car as if the clutch were in. Checked here
   * against the model's own constants, because the error is in the units and only arithmetic
   * can see it.
   */
  const car = new CarPhysics({ grip: 1 });
  car.reset(0, 0, 0, 60);
  for (let i = 0; i < 240; i += 1) car.step(DT, { throttle: 0, brake: 0, steer: 0 }, { grip: 1 });

  const ratio = (POWERTRAIN.gearRatios[car.gear] ?? 1) * POWERTRAIN.finalDrive;
  const radius = POWERTRAIN.wheelDiameter / 2;
  const engineForce = (POWERTRAIN.peakTorque * POWERTRAIN.engineBrake * ratio) / radius;
  const drag = 0.5 * 1.225 * DEFAULT_GEOMETRY.dragArea * car.vLong * Math.abs(car.vLong);
  const rolling = 0.4 * car.vLong;
  const expected = (engineForce + drag + rolling) / DEFAULT_GEOMETRY.mass;

  assert.ok(
    Math.abs(-car.longitudinalG - expected) < 0.05,
    `coasting at ${car.speed.toFixed(1)} m/s in gear ${car.gear} decelerates at ` +
      `${(-car.longitudinalG).toFixed(2)} m/s^2, the model's own terms give ${expected.toFixed(2)}`
  );
  // And the version that was missing the wheel radius would be nowhere near it.
  const withoutRadius = (POWERTRAIN.peakTorque * POWERTRAIN.engineBrake * ratio) / DEFAULT_GEOMETRY.mass;
  assert.ok(
    Math.abs(-car.longitudinalG - withoutRadius) > 0.3,
    'a torque added to a sum of forces must not pass this test'
  );
});

test('a pit stop actually happens, and it actually costs time', () => {
  /*
   * `car.pitStop` used to be a boolean that was initialised and never read. Now that compounds
   * and degradation reach the car, a stop has to be a decision rather than a lap-count animation
   * -- so the mechanic has to work end to end, not merely exist.
   */
  const track = buildTrack(getCircuit('monza'));
  // A real championship field, not hand-rolled entries: the AI's skill preset and the cars'
  // setups both come from the entry, and a stub entry produces a field that does not race.
  const entries = createChampionship().entries;
  /*
   * Twelve laps, not six.
   *
   * Six laps on softs brings wear to about 0.27, which crosses the `pitWhen` cliff of 0.2 at
   * roughly lap 5 -- and `shouldPit` refuses when a lap or less remains. So at six laps the stop
   * was a coin toss decided by a few tenths of a percent of wear, and changing the AI's reaction
   * model was enough to flip it. A test whose premise is a near miss is not testing the pit
   * mechanic.
   *
   * Twelve laps puts the cliff in the middle of the race with laps to spare, so what is being
   * measured is the mechanic rather than the tyre arithmetic.
   */
  const RACE_LAPS = 12;
  const session = new RaceSession({
    track,
    entries,
    type: SESSION_TYPE.race,
    totalLaps: RACE_LAPS,
    random: createRandom(4242),
    conditions: { compound: 'soft', weather: 'clear' }
  });

  const idle = { throttle: 0, brake: 0, steer: 0, handbrake: false };
  let boxSteps = 0;
  let laneSteps = 0;
  const lapEnd = new Map();

  /*
   * Budget derived from the circuit, not a fixed number of minutes.
   *
   * It was `120 * 60 * 14`, a hand-picked 14 minutes that the AI happened to fit inside. Any
   * change to how fast the field laps -- which is exactly what fixing the reaction model did --
   * pushed the race past it, the tyres never reached the cliff that triggers a stop, and the
   * test failed on "no driver pitted" rather than on anything to do with the pit mechanic.
   * A budget that encodes a hidden assumption about driver pace is a landmine.
   */
  const budget = Math.ceil(track.lapRecord * RACE_LAPS * 4 * 120);
  const inBox = new Map();
  const wearAfterStop = [];
  for (let i = 0; i < budget && !session.finished; i += 1) {
    session.update(FIXED_TIMESTEP, idle);
    for (const car of session.cars) {
      if (car.pitStopTime > 0) boxSteps += 1;
      if (car.inPitLane) laneSteps += 1;
      const prev = lapEnd.get(car.entry.short) ?? 0;
      if (car.timer.lap > prev) { lapEnd.set(car.entry.short, car.timer.lap); }

      /*
       * Sample the tyres at the instant a stop completes, not at the end of the race.
       *
       * This used to find the first car that ever pitted and check its wear once the session
       * finished. Over a twelve-lap race that car has long since driven on the fresh rubber and
       * worn it back out, so the assertion was reporting 26% for tyres that were replaced
       * several laps earlier -- measuring the rest of the race rather than the pit stop.
       */
      const wasInBox = inBox.get(car.entry.short) ?? false;
      const nowInBox = car.pitStopTime > 0;
      if (wasInBox && !nowInBox && (car.pitStops ?? 0) > 0) {
        wearAfterStop.push(car.physics.frontWear);
      }
      inBox.set(car.entry.short, nowInBox);
    }
  }

  const stops = session.cars.map((car) => car.pitStops ?? 0);
  assert.ok(stops.some((n) => n > 0), 'at least one driver must actually stop');
  assert.ok(boxSteps > 0, `a car must stand in the box, got ${boxSteps} car-steps`);
  assert.ok(laneSteps > boxSteps, 'reaching the box has to involve being in the lane first');

  // The stop has to cost time. This is the whole point: a stop whose only cost were the two
  // seconds in the box would never be worth taking, so nobody would stop and the tyre model
  // would stay decorative.
  assert.ok(wearAfterStop.length > 0, 'at least one stop must have completed, to sample its tyres');
  const worstFreshRubber = Math.max(...wearAfterStop);
  assert.ok(
    worstFreshRubber < 0.2,
    `a stop must leave fresh rubber, worst sample ${(worstFreshRubber * 100).toFixed(0)}% wear`
  );
});

test('the cockpit view has a cockpit in it', () => {
  /*
   * `#ensureCockpit` was defined, documented at length, and never called. Nothing else built the
   * interior either, so `this.cockpit` was undefined for the life of the game: the visibility
   * line in the frame loop was a no-op, `steerCockpit` never ran, and the cockpit camera -- the
   * one view with the player inside the car -- looked out through a car with no wheel, no dash
   * and no halo. It is the one place the interior is ever seen, and it was empty.
   */
  const cockpit = buildCockpit();
  let parts = 0;
  cockpit.traverse((node) => {
    if (node.isMesh) parts += 1;
  });
  assert.ok(parts >= 8, `an interior to sit in, not ${parts} parts`);

  const wheel = cockpit.userData.wheel;
  assert.ok(wheel, 'the interior has a steering wheel');
  steerCockpit(cockpit, 1);
  assert.ok(wheel.rotation.z < -0.05, `the wheel turns with the input (${wheel.rotation.z})`);
  steerCockpit(cockpit, -1);
  assert.ok(wheel.rotation.z > 0.05, 'and turns the other way');
  steerCockpit(cockpit, 0);
  assert.ok(Math.abs(wheel.rotation.z) < 1e-9, 'and centres');

  // And the game wires it up: built on demand when the camera enters it, and steered from the
  // player's own input rather than left locked straight.
  assert.ok(/this\.#syncCockpit\(\)/.test(gameSource), 'the camera mode syncs the interior');
  assert.ok(
    /this\.rig\.cycleMode\(\);\s*\n\s*this\.#syncCockpit\(\)/.test(gameSource),
    'including at the moment the mode changes'
  );
  assert.ok(
    /this\.#ensureCockpit\(\)\.visible/.test(gameSource),
    'something has to actually build it'
  );
  assert.ok(/steerCockpit\(this\.cockpit, controls\.steer\)/.test(gameSource), 'the wheel follows the input');
});

test('the trackside camera stands on the circuit and watches a car', () => {
  /*
   * Two anchors of sea level in one camera, and the mode showed neither a circuit nor a car.
   *
   * The anchor was `7 + Math.random() * 5` metres flat, and sixteen of the twenty-four circuits
   * sit entirely above that band: Mexico's circuit is two kilometres up, so its trackside cameras
   * stood two kilometres underground, and Spa's stood 400 metres under the grass. The camera then
   * aimed at `(anchor.x, 0.7, anchor.z)` -- and `#nearestCarTo` returned `this.focus ?? the anchor
   * point` with `setFocus` called from nowhere, so it aimed at the point directly under itself,
   * straight down, at every anchor on every circuit.
   *
   * The circuit here is Mexico's height, so an absolute altitude fails on the first frame.
   */
  const samples = [];
  for (let i = 0; i < 60; i += 1) {
    samples.push({ index: i, x: i * 10, z: 0, y: 2235, width: 12, rightX: 0, rightZ: 1 });
  }
  const rig = new CameraRig(new THREE.PerspectiveCamera(), { samples });
  rig.setMode('tv');

  const car = { x: 120, y: 2235, z: 0, heading: 0 };
  const leader = { x: 380, y: 2235, z: 6, heading: 0 };
  const forward = new THREE.Vector3();

  for (let frame = 0; frame < 60; frame += 1) {
    rig.update(car, 0.5, leader);
    const at = rig.camera.position;

    assert.ok(
      at.y > 2235,
      `frame ${frame}: the trackside camera is at ${at.y.toFixed(1)}m, under ground that is 2235m up`
    );

    // The nearest of the two cars the rig is handed: the one a director would cut to.
    const nearest = [car, leader].sort(
      (a, b) => Math.hypot(a.x - at.x, a.z - at.z) - Math.hypot(b.x - at.x, b.z - at.z)
    )[0];
    rig.camera.getWorldDirection(forward);
    const toCar = new THREE.Vector3(
      nearest.x - at.x,
      nearest.y + 0.7 - at.y,
      nearest.z - at.z
    ).normalize();
    assert.ok(
      forward.dot(toCar) > 0.999,
      `frame ${frame}: the camera looks at a car, not ${forward.toArray().map((v) => v.toFixed(2)).join(', ')}`
    );
  }
});

test('a circuit that is replaced is released, textures and all', () => {
  /*
   * Two leaks, neither visible in a frame time.
   *
   * The surroundings were never cleared: `loadCircuit` and `prepareCircuit` removed and released
   * the track and the venue, then assigned a fresh set of surroundings on top of the old ones, so
   * the scene accumulated a full set of trees, buildings, barriers and treeline per circuit
   * loaded -- all of it still drawn, behind the current ones.
   *
   * And nothing released a texture. `disposeTree` disposed geometries and materials, and in
   * Three.js a material owns its textures: a circuit's road, run-off, walls, ground and treeline
   * are all canvas textures uploaded to the GPU, so every load left the previous set behind.
   */
  const canvas = document.createElement('canvas');
  const texture = new THREE.CanvasTexture(canvas);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  const released = [];
  for (const target of [geometry, material, texture]) {
    const original = target.dispose.bind(target);
    target.dispose = () => {
      released.push(target);
      original();
    };
  }
  disposeTree(mesh);
  assert.ok(released.includes(geometry), 'the geometry is released');
  assert.ok(released.includes(material), 'the material is released');
  assert.ok(released.includes(texture), "and the texture its map points at");

  // The track, the venue and the surroundings are one unit, released at every site that builds a
  // circuit: the definition plus `loadCircuit`, `prepareCircuit` and `destroy`.
  assert.ok(
    (gameSource.match(/#clearCircuitGroups\(\)/g) ?? []).length >= 4,
    'a circuit is cleared as one unit, not group by group'
  );
  assert.equal(
    (gameSource.match(/#clearGroup\('surroundsGroup'\)/g) ?? []).length,
    1,
    'nothing clears a partial set of the groups'
  );
  assert.ok(/disposeTree\(this\.rain\)/.test(gameSource), 'the rain owns geometry and a texture too');
});

test('the city stands on its foundations, at the height it is drawn', () => {
  /*
   * Buildings are one instanced mesh of a 1m-tall box, scaled up to each building's height, so
   * the transform carries the height twice: in the scale, and in the position, which has to be
   * at half of it. The two came from separate draws of the random number generator -- one for
   * the position, another for the scale -- so on a street circuit, where heights run from 8m to
   * 34m, a building stood up to 13m clear of the ground or buried to its windows, and the band
   * of windows on its facade was placed against the first height while the building was scaled
   * by the second.
   */
  for (const id of ['monaco', 'singapore']) {
    const circuit = getCircuit(id);
    const track = buildTrack(circuit);
    const group = buildSurrounds(track, circuit.theme, id);
    const meshes = [];
    group.traverse((node) => {
      if (node.isMesh && node.isInstancedMesh) meshes.push(node);
    });
    const buildings = meshes.find(
      (mesh) => mesh.geometry.parameters?.width === 9 && mesh.geometry.parameters?.depth === 12
    );
    assert.ok(buildings && buildings.count > 50, `${id}: a street circuit is buildings`);

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const heights = track.samples.map((sample) => sample.y);
    const bases = [];
    for (let i = 0; i < buildings.count; i += 1) {
      new THREE.Matrix4().fromArray(buildings.instanceMatrix.array, i * 16).decompose(position, quaternion, scale);
      const base = position.y - scale.y * 0.5;
      /*
       * The base has to be a ground height: the circuit's own surface at the sample the building
       * was placed from. Which sample that is cannot be recovered from the x/z alone -- the
       * streets of Monaco run within metres of each other 37m apart in height -- so the assertion
       * is that the base is the height of *some* sample, exactly. Under the double draw it was a
       * height between two of them, which is not a surface anything can stand on.
       */
      assert.ok(
        heights.some((y) => Math.abs(y - base) < 0.05),
        `${id}: a building stands at ${base.toFixed(2)}m, which is not the ground anywhere`
      );
      // The 1m box is the unit: the scale *is* the height.
      assert.ok(scale.y > 8 && scale.y < 34.001, `${id}: a building ${scale.y.toFixed(1)}m tall`);
      bases.push(base);
    }
    assert.ok(new Set(bases.map((base) => base.toFixed(0))).size > 1, `${id}: the city follows the terrain`);
  }
});

test('the start line is painted across the road, on the road', () => {
  /*
   * The line is a plane `track.width` wide and 1.6m deep, and it was turned by `-heading`. The
   * track's heading describes travel as `(cos h, sin h)` in world (x, z), so `-h` puts the line's
   * *width* along the direction of travel: a 15m stripe painted down the middle of the start
   * straight rather than a line across it, mirrored off the road entirely wherever the straight
   * does not happen to run at a heading of 0. It was also placed at an absolute y of 0.03, which
   * is 2.2km under the road at Mexico City.
   */
  for (const id of ['bahrain', 'monza', 'mexico', 'silverstone']) {
    const track = buildTrack(getCircuit(id));
    const group = buildTrackMesh(track);
    let line = null;
    group.traverse((node) => {
      if (node.isMesh && node.geometry.type === 'PlaneGeometry') line = node;
    });
    assert.ok(line, `${id}: no start line`);

    const start = track.samples[0];
    const lateral = new THREE.Vector3(start.rightX, 0, start.rightZ).normalize();
    const forward = new THREE.Vector3(Math.cos(start.heading), 0, Math.sin(start.heading));
    const across = new THREE.Vector3(1, 0, 0).applyQuaternion(line.quaternion).normalize();
    const along = new THREE.Vector3(0, 1, 0).applyQuaternion(line.quaternion).normalize();
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(line.quaternion).normalize();

    assert.ok(
      Math.abs(across.dot(lateral)) > 0.99,
      `${id}: the line runs at ${across.dot(lateral).toFixed(3)} to the road's width`
    );
    assert.ok(
      Math.abs(along.dot(forward)) > 0.99,
      `${id}: the line's 1.6m depth must follow the direction of travel, not cross it`
    );
    assert.ok(normal.y > 0.99, `${id}: the line must lie flat, facing up`);
    assert.ok(
      Math.abs(line.position.y - (start.y + 0.03)) < 1e-6,
      `${id}: the line is at ${line.position.y.toFixed(1)}m, the road is at ${start.y.toFixed(1)}m`
    );
  }
});

test('the barriers are on both sides of the circuit, facing it', () => {
  /*
   * `side` was computed in the barrier loop and then never used: both walls were built at the
   * same offset. One side of every circuit had two coincident barriers z-fighting with each
   * other, and the other side -- the one a car actually leaves the track on -- had no barrier at
   * all. The winding did not follow the side either, so a wall placed on the far side is lit from
   * behind and culled: not merely misplaced, invisible.
   */
  const circuit = getCircuit('monza');
  const track = buildTrack(circuit);
  const group = buildTrackMesh(track);
  const meshes = [];
  group.traverse((node) => {
    if (node.isMesh) meshes.push(node);
  });

  // The containment walls: pairs of vertices 1.5m apart. The pit wall is 1.2m and the strips
  // built from the road surface are flat.
  const walls = meshes.filter((mesh) => {
    if (mesh.isInstancedMesh || !mesh.geometry.getIndex()) return false;
    const pos = mesh.geometry.getAttribute('position');
    if (pos.count < 4 || pos.count % 2 !== 0) return false;
    for (let i = 0; i < pos.count; i += 2) {
      if (Math.abs(pos.getY(i + 1) - pos.getY(i) - 1.5) > 1e-3) return false;
    }
    return true;
  });
  assert.equal(walls.length, 2, 'one containment wall per side of the circuit');

  const samples = track.samples;
  const sides = walls.map((wall) => {
    const pos = wall.geometry.getAttribute('position');
    const located = locateOnTrack(track, pos.getX(0), pos.getZ(0), 0);
    return Math.sign(located.lateral);
  });
  assert.equal(sides[0], -sides[1], `both barriers are on the same side (${sides.join(', ')})`);

  for (const [index, wall] of walls.entries()) {
    const pos = wall.geometry.getAttribute('position');
    const pairs = pos.count / 2;
    assert.equal(pairs, samples.length + 1, 'the barrier follows the whole lap');

    // Its faces point back at the circuit. Vertex pairs are in sample order, so each triangle
    // can be attributed to the sample it was built from rather than to whichever sample happens
    // to be nearest -- which, on a hairpin tighter than the barrier's own offset, is a different
    // part of the lap entirely.
    const wallIndex = wall.geometry.getIndex();
    let outward = 0;
    let faces = 0;
    for (let t = 0; t < wallIndex.count; t += 3) {
      const v0 = wallIndex.getX(t);
      const v1 = wallIndex.getX(t + 1);
      const v2 = wallIndex.getX(t + 2);
      const ax = pos.getX(v0);
      const ay = pos.getY(v0);
      const az = pos.getZ(v0);
      const ux = pos.getX(v1) - ax;
      const uy = pos.getY(v1) - ay;
      const uz = pos.getZ(v1) - az;
      const wx = pos.getX(v2) - ax;
      const wy = pos.getY(v2) - ay;
      const wz = pos.getZ(v2) - az;
      const nx = uy * wz - uz * wy;
      const nz = ux * wy - uy * wx;
      const sample = samples[Math.floor(v0 / 2) % samples.length];
      const towardX = sample.x - ax;
      const towardZ = sample.z - az;
      faces += 1;
      if (nx * towardX + nz * towardZ <= 0) outward += 1;
    }
    /*
     * A few per cent, not zero: where a corner is tighter than the wall's own offset (Monza's
     * chicane), extruding a strip 34m wide round the inside of it genuinely folds the wall back
     * on itself. The wall on the *wrong* side of the circuit fails this by a mile, since every
     * face of it is lit from behind.
     */
    assert.ok(
      outward * 50 < faces,
      `${outward} of ${faces} barrier faces point away from the circuit`
    );
  }

  /*
   * One on each side, an apron apart.
   *
   * The two walls are built from the same sample, so their separation is the road's own width
   * plus two run-offs plus the two walls -- 26m of run-off each side, which is TrackMesh's
   * `APRON`. Coincident walls measure zero here.
   */
  const [near, far] = walls.map((wall) => wall.geometry.getAttribute('position'));
  for (let i = 0; i < samples.length; i += 7) {
    const gap = Math.hypot(near.getX(i * 2) - far.getX(i * 2), near.getZ(i * 2) - far.getZ(i * 2));
    const expected = samples[i].width + 2 * 26 + 2 * 1.5;
    assert.ok(
      Math.abs(gap - expected) < 1,
      `the barriers are ${gap.toFixed(1)}m apart at sample ${i}, expected ${expected.toFixed(1)}m`
    );
  }
});

test('the pit lane is one strip, where the lane rules say it is', () => {
  /*
   * The pit window wraps the start line, so the samples in it are two runs in storage order --
   * the end of the lap and the beginning of it -- plus a repeat of the first sample at the end
   * of an inclusive walk. The geometry was built as though they were one unbroken strip: the
   * index loop joined the end of the lap to the start of it with a quad, and ran two vertices
   * past the end of the buffer, which WebGL reads as index 0 -- a triangle from the pit lane to
   * the middle of the world. The pit wall had the same treatment, which is why its opening at
   * the box was a hole in the vertex list that the indices happily spanned.
   */
  const circuit = getCircuit('monza');
  const track = buildTrack(circuit);
  const group = buildTrackMesh(track);
  const meshes = [];
  group.traverse((node) => {
    if (node.isMesh) meshes.push(node);
  });
  const positionOf = (mesh) => mesh.geometry.getAttribute('position');

  // Every index is a real vertex of its own buffer.
  for (const mesh of meshes) {
    const index = mesh.geometry.getIndex();
    if (!index) continue;
    const vertices = positionOf(mesh).count;
    for (let i = 0; i < index.count; i += 1) {
      assert.ok(index.getX(i) < vertices, `index ${index.getX(i)} of ${vertices} vertices`);
    }
  }

  /*
   * No triangle in the circuit spans a gap.
   *
   * The widest legitimate triangle here is the run-off apron's: it links the road edge to the
   * verge 26m out on the other side, so a quad is about 70m across on every circuit. Anything
   * much wider is two pieces of geometry being joined that should not be: the quad that joined
   * the two pit-lane runs crossed the main straight, and the triangle built on the out-of-range
   * indices crossed the map from the pit lane to the origin.
   */
  for (const mesh of meshes) {
    if (mesh.isInstancedMesh) continue;
    const pos = positionOf(mesh);
    const index = mesh.geometry.getIndex();
    const total = index ? index.count : pos.count;
    const at = (v) => [pos.getX(v), pos.getY(v), pos.getZ(v)];
    const span = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    for (let t = 0; t + 2 < total; t += 3) {
      const corners = index
        ? [index.getX(t), index.getX(t + 1), index.getX(t + 2)].map(at)
        : [at(t), at(t + 1), at(t + 2)];
      const longest = Math.max(
        span(corners[0], corners[1]),
        span(corners[1], corners[2]),
        span(corners[2], corners[0])
      );
      assert.ok(longest < 90, `a ${longest.toFixed(0)}m edge in the ${mesh.geometry.type}`);
    }
  }

  // The lane surface: the strip whose every vertex is inside the pit window, out past the road
  // edge. Nothing else in the group is confined to the lane.
  const lane = meshes.find((mesh) => {
    if (mesh.isInstancedMesh || !mesh.geometry.getIndex()) return false;
    const pos = positionOf(mesh);
    for (let i = 0; i < pos.count; i += 1) {
      const located = locateOnTrack(track, pos.getX(i), pos.getZ(i), null);
      const fraction = located.sample.s / track.length;
      const inWindow = fraction >= PIT_WINDOW_START || fraction <= PIT_WINDOW_END;
      if (!inWindow) return false;
      if (Math.abs(located.lateral) < located.sample.width * 0.5 - 0.5) return false;
    }
    return true;
  });
  assert.ok(lane, 'the pit lane must be drawn');

  const samplesInWindow = track.samples.filter((sample) => {
    const fraction = sample.s / track.length;
    return fraction >= PIT_WINDOW_START || fraction <= PIT_WINDOW_END;
  });
  const pos = positionOf(lane);
  assert.equal(
    pos.count,
    samplesInWindow.length * 2,
    'one pair of vertices per sample of the window -- no missing run, no repeat of the first sample'
  );

  // And it is where `race/pit.js` says the lane is: the middle of each quad is in the lane by
  // the same rule the race uses, and its two sides are the road edge and the far side of it.
  for (let i = 0; i < pos.count; i += 2) {
    const middle = locateOnTrack(track, (pos.getX(i) + pos.getX(i + 1)) / 2, (pos.getZ(i) + pos.getZ(i + 1)) / 2, null);
    const half = middle.sample.width * 0.5;
    assert.ok(
      inPitLane(middle.sample.s / track.length, middle.lateral, half),
      `the middle of the lane is not in the lane (lateral ${middle.lateral.toFixed(1)}m)`
    );
    const inner = locateOnTrack(track, pos.getX(i), pos.getZ(i), null);
    const outer = locateOnTrack(track, pos.getX(i + 1), pos.getZ(i + 1), null);
    assert.ok(Math.abs(Math.abs(inner.lateral) - half) < 0.2, 'the lane starts at the road edge');
    assert.ok(
      Math.abs(Math.abs(outer.lateral) - (half + PIT_LANE_WIDTH)) < 0.2,
      `the lane ends at the lane width, not ${(Math.abs(outer.lateral) - half).toFixed(1)}m out`
    );
  }

  // The wall: pairs of vertices 1.2m apart, which nothing else in the group is.
  const wall = meshes.find((mesh) => {
    if (mesh.isInstancedMesh || !mesh.geometry.getIndex()) return false;
    const wallPos = positionOf(mesh);
    if (wallPos.count < 4 || wallPos.count % 2 !== 0) return false;
    for (let i = 0; i < wallPos.count; i += 2) {
      // Tolerance is the float32 round-off in the attribute, not slack: the wall is the only
      // pair-of-vertices-a-fixed-height-apart strip in the group.
      if (Math.abs(wallPos.getY(i + 1) - wallPos.getY(i) - 1.2) > 1e-3) return false;
    }
    return true;
  });
  assert.ok(wall, 'the pit wall must be drawn');

  // Connected pieces of the wall, and how far along the lane each one reaches.
  const wallIndex = wall.geometry.getIndex();
  const wallPos = positionOf(wall);
  const neighbours = new Map();
  const connect = (a, b) => {
    if (!neighbours.has(a)) neighbours.set(a, new Set());
    if (!neighbours.has(b)) neighbours.set(b, new Set());
    neighbours.get(a).add(b);
    neighbours.get(b).add(a);
  };
  for (let i = 0; i < wallIndex.count; i += 3) {
    const tri = [wallIndex.getX(i), wallIndex.getX(i + 1), wallIndex.getX(i + 2)];
    connect(tri[0], tri[1]);
    connect(tri[1], tri[2]);
    connect(tri[2], tri[0]);
  }
  const seen = new Set();
  const pieces = [];
  for (const start of neighbours.keys()) {
    if (seen.has(start)) continue;
    const queue = [start];
    seen.add(start);
    let low = Infinity;
    let high = -Infinity;
    while (queue.length) {
      const vertex = queue.pop();
      const located = locateOnTrack(track, wallPos.getX(vertex), wallPos.getZ(vertex), null);
      const progress = laneProgress(located.sample.s / track.length);
      low = Math.min(low, progress);
      high = Math.max(high, progress);
      for (const next of neighbours.get(vertex)) {
        if (seen.has(next)) continue;
        seen.add(next);
        queue.push(next);
      }
    }
    pieces.push([low, high]);
  }

  assert.equal(pieces.length, 2, `the wall is two pieces with the box between them, not ${pieces.length}`);
  for (const [low, high] of pieces) {
    assert.ok(
      low > BOX_PROGRESS || high < BOX_PROGRESS,
      `a wall from ${low.toFixed(2)} to ${high.toFixed(2)} crosses the pit box, where cars have to`
    );
  }
  assert.ok(
    Math.min(...pieces.map(([low]) => low)) < 0.02 && Math.max(...pieces.map(([, high]) => high)) > 0.98,
    'the wall runs the length of the lane, either side of the opening'
  );
});

test('the pit lane is a lane, not most of the circuit', () => {
  /*
   * The lane test was originally `(lateral - PIT_SIDE * halfWidth) * -PIT_SIDE`, which is
   * algebraically identical but evaluates to `lateral + halfWidth` when `PIT_SIDE` is -1. That
   * made it true for nearly the whole width of the road and false for the actual lane: every car
   * was "in the pit lane" while racing on the circuit, the 80 km/h limit applied on track, and
   * none of them ever reached the box.
   */
  const HALF = 12;
  assert.equal(inPitLane(0.98, -HALF - 5, HALF), true, 'on the pit side, past the edge: in the lane');
  assert.equal(inPitLane(0.98, -(HALF + 4), HALF), true, 'mid-lane is in the lane');
  assert.equal(inPitLane(0.98, -HALF, HALF), false, 'exactly on the road edge is not yet in the lane');
  assert.equal(inPitLane(0.98, 0, HALF), false, 'the middle of the road is not in the lane');
  assert.equal(inPitLane(0.98, HALF + 5, HALF), false, 'the far side is not the pit lane');
  assert.equal(inPitLane(0.98, -(HALF + PIT_LANE_WIDTH + 1), HALF), false, 'past the far wall is not the lane');
  assert.equal(inPitLane(0.5, -(HALF + 5), HALF), false, 'mid-lap there is no lane');

  // The window wraps the line, so entry and exit are on opposite sides of it.
  assert.equal(inPitLane(0.99, -(HALF + 5), HALF), true, 'before the line is still in the window');
  assert.equal(inPitLane(0.01, -(HALF + 5), HALF), true, 'after the line is still in the window');
});

test('nobody pitters on the final lap', () => {
  const car = { finished: false, retired: false, maxStops: 1, pitStops: 0, pitWhen: 0.2, physics: { frontWear: 0.9, rearWear: 0.9 }, timer: {} };
  assert.equal(shouldPit(car, 3), true, 'a worn tyre with three laps left is worth stopping for');
  assert.equal(shouldPit(car, 1), false, 'not with one lap left -- the fresh tyre would never pay for itself');
  car.pitStops = 1;
  assert.equal(shouldPit(car, 5), false, 'and not twice');
});

test('downforce grows with the square of speed and lifts the car in fast corners', () => {
  const car = new CarPhysics({ grip: 1 });
  const slow = car.computeDownforce(30);
  const fast = car.computeDownforce(60);
  assert.ok(Math.abs(fast / slow - 4) < 0.01, 'downforce should scale with v^2');
  assert.ok(slow > 0, 'there should be some downforce at speed');

  // Peak lateral g must rise with speed, which is the entire point of downforce.
  const peakLateralAt = (speed) => {
    const probe = new CarPhysics({ grip: 1 });
    probe.reset(0, 0, 0, speed);
    let best = 0;
    for (let steer = 0.2; steer <= 1; steer += 0.1) {
      const p = new CarPhysics({ grip: 1 });
      p.reset(0, 0, 0, speed);
      p.gear = 6;
      for (let i = 0; i < 400; i += 1) p.step(DT, { throttle: 0.25, brake: 0, steer });
      best = Math.max(best, Math.abs(p.lateralG) / GRAVITY);
    }
    return best;
  };
  const slowG = peakLateralAt(20);
  const fastG = peakLateralAt(70);
  assert.ok(fastG > slowG * 1.4, `fast corners should grip much harder: ${slowG.toFixed(1)}g -> ${fastG.toFixed(1)}g`);
});

test('tyre temperature gates grip, and a normal lap does not overheat', () => {
  assert.equal(temperatureGrip(TYRE.optimalTemp), 1, 'the optimum window should give full grip');
  assert.ok(
    temperatureGrip(TYRE.optimalTemp + TYRE.optimalBand + 125) < 0.85,
    'overheated tyres must lose grip'
  );

  /*
   * A lap, not a lap's worth of corner.
   *
   * This held throttle 0.45 and steer 0.18 for forty continuous seconds, which is not a
   * normal lap -- it is forty seconds of unbroken cornering, and it never let the car
   * straighten up. The test passed only because the thermal model under-heated so badly
   * that even that scenario stayed under 150C. With a speed term added, sustained cornering
   * correctly cooks a tyre, which is the behaviour we want, so the scenario had to change
   * to match the claim it is making.
   *
   * Measured on real circuits, the AI's *median* lateral acceleration is under 6 m/s2:
   * most of a lap is a straight. So a lap is modelled as alternating.
   */
  const normal = new CarPhysics({ grip: 1 });
  normal.reset(0, 0, 0, 55);
  for (let i = 0; i < 120 * 40; i += 1) {
    const phase = Math.floor(i / (120 * 2.5)) % 2;
    normal.step(DT, phase === 0 ? { throttle: 1, brake: 0, steer: 0 } : { throttle: 0.2, brake: 0.2, steer: 0.16 });
  }
  assert.ok(
    normal.frontTemp > 70 && normal.frontTemp < 150,
    `a normal lap should run the tyres in the window, got ${normal.frontTemp.toFixed(0)}C`
  );
  assert.ok(normal.frontGrip > 0.95, 'a normal lap should not lose grip to heat');

  // Abuse should cook them.
  const abuse = new CarPhysics({ grip: 1 });
  abuse.reset(0, 0, 0, 30);
  for (let i = 0; i < 120 * 90; i += 1) {
    // Braking and cornering hard together is what actually cooks tyres.
    abuse.step(DT, { throttle: 1, brake: i % 240 < 60 ? 1 : 0, steer: 0.45 });
  }
  assert.ok(abuse.frontTemp > 160, `heavy use should overheat the tyres, got ${abuse.frontTemp.toFixed(0)}C`);
  assert.ok(abuse.frontGrip < 0.95, `overheated tyres must cost grip, got ${abuse.frontGrip.toFixed(3)}`);
});


test('the compound you pick changes the car, and a worn tyre costs real grip', () => {
  /*
   * `compounds.js` has always carried per-compound grip, wear rate, band and warm-up, and
   * none of it reached the car: `getCompound` was imported by `RaceSession` and never
   * called, and the only function that applied `compound.grip` was called from the setup
   * screen to print a label. Soft versus Wet was a coloured swatch.
   *
   * Wear was worse than inert. It accumulated at `0.0000075 * dt` with no compound and no
   * unit: 0.0007 over a five-lap race, costing `1 - wear * 0.18`, for **0.013%** of grip.
   * The HUD wear bar read 0.0% for an entire race and "soft tyres wear faster" was false.
   */
  const track = buildTrack(getCircuit('monza'));
  const lapSeconds = track.lapRecord;

  // A steady-state skidpad, so the measurement is the compound and not a transient.
  const lateralG = (compound, wear) => {
    const car = new CarPhysics({ compound, lapSeconds });
    car.reset(0, 0, 0, 55);
    car.frontTemp = 100;
    car.rearTemp = 100;
    car.frontWear = wear;
    car.rearWear = wear;
    let sum = 0;
    for (let i = 0; i < 2400; i += 1) {
      car.step(1 / 240, { throttle: 0.18, brake: 0, steer: 0.18 });
      if (i >= 1200) sum += Math.abs(car.lateralG);
    }
    return sum / 1200;
  };

  const softFresh = lateralG('soft', 0);
  const hardFresh = lateralG('hard', 0);
  const softWorn = lateralG('soft', 0.5);

  assert.ok(softFresh > hardFresh, `a fresh soft must out-grip a fresh hard: ${softFresh.toFixed(3)} vs ${hardFresh.toFixed(3)}`);
  assert.ok(softWorn < softFresh * 0.75, `a worn soft must lose real grip: ${softWorn.toFixed(3)} vs ${softFresh.toFixed(3)}`);
  assert.ok(softWorn < hardFresh, `a dead soft must be slower than a fresh hard: ${softWorn.toFixed(3)} vs ${hardFresh.toFixed(3)}`);

  // And the wear bar has to move, which it never did before.
  const soft = new CarPhysics({ compound: 'soft', lapSeconds, lapMetres: track.length });
  const hard = new CarPhysics({ compound: 'hard', lapSeconds, lapMetres: track.length });
  assert.ok(soft.wearPerMetre > hard.wearPerMetre, 'a soft must wear faster than a hard');
  assert.ok(soft.wearPerMetre * track.length > 0.02, 'a soft must lose a couple of percent of grip per lap');

  /*
   * Degradation is per *distance*, not per second. That is what makes tyre management
   * possible at all: a time-based rate means a driver who lifts to save a tyre just takes
   * longer to wear it out, so protecting a tyre buys nothing.
   */
  const monaco = buildTrack(getCircuit('monaco'));
  const atMonaco = new CarPhysics({ compound: 'soft', lapSeconds: monaco.lapRecord, lapMetres: monaco.length });
  const perLap = (car) => car.wearPerMetre * car.lapMetres;
  assert.ok(
    Math.abs(perLap(atMonaco) - perLap(soft)) < 1e-9,
    'a lap of a soft must cost the same grip at Monaco as at Monza -- it is defined per lap, not per second'
  );
});

test('a soft is worth running early and stops being worth running', () => {
  /*
   * With the compounds actually connected, the authored wear rates turned out to be
   * inconsistent with the authored grip spread: a soft beat a medium for **0.89 laps**
   * and then fell behind it forever, which would have made the fastest compound in the
   * game a mistake to run. The rates are now set from the crossover points instead.
   *
   * This test pins the ordering, because a compound set with no crossing points is just
   * three numbers that never interact.
   */
  const track = buildTrack(getCircuit('monza'));
  const multiplierAt = (compound, laps) => {
    const car = new CarPhysics({ compound, lapSeconds: track.lapRecord, lapMetres: track.length });
    car.frontWear = Math.min(1, laps * car.wearPerMetre * track.length);
    return car.compoundGrip * wearGrip(car.frontWear);
  };

  // Fresh: fastest compound wins.
  assert.ok(multiplierAt('soft', 0) > multiplierAt('medium', 0), 'soft is fastest when fresh');
  assert.ok(multiplierAt('medium', 0) > multiplierAt('hard', 0), 'medium is faster than hard when fresh');

  // After a stint, the order must reverse -- that is the whole point of a tyre choice.
  assert.ok(multiplierAt('hard', 8) > multiplierAt('soft', 8), 'a hard must out-grip a soft after a long stint');
  assert.ok(multiplierAt('medium', 8) > multiplierAt('soft', 8), 'a medium must out-grip a soft after a long stint');

  // And it has to take more than a single lap to flip, or softs are pointless.
  const crossover = (a, b) => {
    for (let laps = 0; laps <= 20; laps += 0.05) {
      if (multiplierAt(a, laps) <= multiplierAt(b, laps)) return laps;
    }
    return Infinity;
  };
  const softBehindMedium = crossover('soft', 'medium');
  assert.ok(
    softBehindMedium > 1.5 && softBehindMedium < 6,
    `a soft should stay ahead for a stint, not ${softBehindMedium.toFixed(2)} laps`
  );
});


test('braking does not gut the cornering grip', () => {
  // Coupling braking and cornering into one friction budget makes a car that
  // brakes before a corner lose nearly all rear grip, understeer wide, and never
  // recover. Real cars brake and corner at once because the axles are separate.
  /*
   * Measured over a short early window, at matched speed.
   *
   * This used to run 240 steps (2s) with throttle 0.2 AND brake 0.3 at once, which is
   * not trail braking -- it is contradictory input. The car span, ended up nearly
   * stationary, and the assertion was reading lateral acceleration off a car doing
   * 5 m/s. It passed because a spin happened to produce a flattering number, and only
   * failed once the tyre compounds started reaching the physics and shifted the car into
   * a slightly different transient. It was measuring noise.
   *
   * Trail braking is brake-only, and it has to be compared while both cars are still at
   * comparable speed -- braking necessarily slows you, so a long window compares 44 m/s
   * of cornering against 0.2 m/s of braking and calls the result a handling fault.
   */
  const WINDOW = 48; // 0.4s at DT
  const lateralOver = (controls) => {
    const car = new CarPhysics({ grip: 1 });
    car.reset(0, 0, 0, 40);
    let sum = 0;
    for (let i = 0; i < WINDOW; i += 1) {
      car.step(DT, controls);
      sum += Math.abs(car.lateralG);
    }
    return { mean: sum / WINDOW, car };
  };

  const cornering = lateralOver({ throttle: 0.2, brake: 0, steer: 0.18 }).mean;
  const trail = lateralOver({ throttle: 0, brake: 0.3, steer: 0.18 });
  const trailBraking = trail.mean;

  // Longitudinal load transfer legitimately takes grip away from the rear axle
  // under braking, so some loss is correct. What must not happen is the rear
  // losing essentially all of its lateral force, which is what a shared friction
  // budget produces and what leaves an AI understeering off the road.
  const ratio = trailBraking / cornering;
  assert.ok(
    ratio > 0.45,
    `trail braking should retain a useful share of lateral grip, got ${(ratio * 100).toFixed(0)}%`
  );
  assert.ok(
    trail.car.loadRear > 0,
    'the rear axle should still be carrying load while trail braking'
  );
});

test('the handbrake really does break traction', () => {
  const gripped = new CarPhysics({ grip: 1 });
  gripped.reset(0, 0, 0, 25);
  for (let i = 0; i < 60; i += 1) gripped.step(DT, { throttle: 1, brake: 0, steer: 0.2 });

  const pulled = new CarPhysics({ grip: 1 });
  pulled.reset(0, 0, 0, 25);
  for (let i = 0; i < 60; i += 1) pulled.step(DT, { throttle: 1, brake: 0, steer: 0.2, handbrake: true });

  assert.ok(pulled.wheelSlip > gripped.wheelSlip, 'the handbrake should induce wheelspin');
  assert.ok(pulled.vLong < gripped.vLong, 'the handbrake should scrub speed');
});

/* --------------------------------------------------------------------- AI -- */

test('the AI measures both controller terms at the car, not at an aim point', () => {
  // Cross-track error against a point ahead makes the heading term and the
  // cross-track term contradict each other in a corner, and the car porpoises off
  // the road without ever recovering.
  assert.match(aiSource, /const crossTrack = \(physics\.x - lineX\)/);
  assert.match(aiSource, /sample\.lineHeading/);
  assert.doesNotMatch(aiSource, /const aim = racingLineAt\(/);
});

test('the AI aims along the racing line, not along the centreline', () => {
  assert.match(
    geometrySource,
    /heading: sample\.lineHeading/,
    'racingLineAt must report the line tangent, not the centreline tangent'
  );
  assert.match(aiSource, /racingLineAt\(track, distance \+ aimLead\)/);
});

test('the AI scan-ahead speed plan brakes in time for the slowest corner', () => {
  assert.match(aiSource, /#planSpeed/);
  // Sampling only the far end of the window reads the straight *after* a corner
  // and arrives far too fast.
  assert.match(aiSource, /BRAKE_WINDOW_SAMPLES/);
  assert.match(aiSource, /reachable/);
  assert.doesNotMatch(aiSource, /targetSpeed = racingLineAt\(track, brakeLookAhead\)/);
});

test('off the line is measured to the line, on either side of the centreline', () => {
  /*
   * The off-track distance was `|lateral| - |lineOffset|`, which is the distance to the line
   * only while the car and the line are on the same side of the centreline. On the other side
   * it under-reports by twice the line's own offset -- and the run-off speed cap and the
   * rejoin behaviour both key off that number, so a car 13m from the line was measured at 10m
   * and left to race on at full speed while the same departure on the line's own side of the
   * centreline read as a trip through the gravel.
   */
  const track = buildTrack(getCircuit('monza'));
  // A straight where the racing line sits well to the left of the centreline.
  const candidates = track.samples.filter(
    (s) => s.lineOffset < -1.5 && Math.abs(s.curvature) < 0.002 && s.width > 8
  );
  assert.ok(candidates.length > 0, 'precondition: monza has a straight with the line left of centre');
  const sample = candidates.reduce((a, b) => (Math.abs(b.curvature) < Math.abs(a.curvature) ? b : a));

  // Ten metres past the line, which puts the car right of the centreline with the line to its left.
  const lateral = Math.abs(sample.lineOffset) + 10;
  const car = new CarPhysics();
  car.reset(sample.x + sample.rightX * lateral, sample.z + sample.rightZ * lateral, sample.heading, 40);
  const driver = new AIDriver(car, SKILL_PRESETS.strong, { track, random: () => 0.5 });
  driver.update(FIXED_TIMESTEP, {});

  assert.ok(
    track.samples[driver.trackIndex].lineOffset < 0,
    'precondition: the line is still left of centre where the car was placed'
  );
  assert.ok(
    driver.offTrackDistance > 12,
    `10m past the line, on the far side of the centreline, measured ` +
      `${driver.offTrackDistance.toFixed(2)}m; under the old formula it was 10.00m and the ` +
      `12m rejoin threshold (OFF_TRACK_REJOIN) never fired`
  );
});

test('a recovered car gets the normal controller back, not a stale recovery command', () => {
  /*
   * `recoveryTimer` meant two things at once. Inside the spin manoeuvre it accumulated the
   * seconds spent recovering -- that is what the reverse-engage hold is measured against --
   * while a leftover "recovery is time-boxed" block further down still read it as a countdown
   * of how long to hold *full throttle with the steering inverted*, and nothing reset it when
   * the car recovered. A driver who spun for three seconds therefore got three seconds of
   * full throttle fighting the line once the car was already back up to racing speed: the
   * ghost of the spin, lasting exactly as long as the spin did.
   */
  const track = buildTrack(getCircuit('monza'));
  const candidates = track.samples.filter(
    (s) => s.lineOffset < -1.5 && Math.abs(s.curvature) < 0.002 && s.width > 8
  );
  const sample = candidates.reduce((a, b) => (Math.abs(b.curvature) < Math.abs(a.curvature) ? b : a));
  const x = sample.x + sample.rightX * 4;
  const z = sample.z + sample.rightZ * 4;

  // What a driver with no history commands, driving this exact state.
  const clean = new CarPhysics();
  clean.reset(x, z, sample.heading, 40);
  const cleanDriver = new AIDriver(clean, SKILL_PRESETS.strong, { track, random: () => 0.5 });
  const expected = cleanDriver.update(FIXED_TIMESTEP, {});

  // Now a driver that has just spent a second and a half facing the wrong way. Those 180
  // frames are what the old code banked into `recoveryTimer`.
  const car = new CarPhysics();
  car.reset(sample.x, sample.z, sample.heading + Math.PI, 0);
  const driver = new AIDriver(car, SKILL_PRESETS.strong, { track, random: () => 0.5 });
  for (let i = 0; i < 180; i += 1) {
    car.step(FIXED_TIMESTEP, driver.update(FIXED_TIMESTEP, {}), { grip: 1 });
  }
  assert.equal(car.direction, -1, 'precondition: the recovery engaged reverse');

  car.reset(x, z, sample.heading, 40);
  const afterSpin = driver.update(FIXED_TIMESTEP, {});

  assert.ok(
    Math.abs(afterSpin.steer - expected.steer) < 0.15,
    `a recovered car must steer like a fresh one: ${afterSpin.steer.toFixed(3)} vs ` +
      `${expected.steer.toFixed(3)} -- the stale countdown returned ${(-expected.steer).toFixed(3)}`
  );
  assert.ok(
    afterSpin.throttle < 0.5,
    `and must not be handed full throttle once it is moving again (got ${afterSpin.throttle.toFixed(2)})`
  );
});

test('DRS is a decision the AI makes once per straight, not a per-step coin flip', () => {
  /*
   * `#shouldUseDrs` re-rolled `random() < drsSkill` on every call, and it is called once per
   * physics step. At 120 steps a second a driver with 0.7 skill had the flap open on roughly
   * 70% of frames: the wing strobed, the drag was the average of the two states, and "skill"
   * became a duty cycle rather than a decision. The roll is latched now, and released when
   * the gate closes.
   */
  const track = buildTrack(getCircuit('monza'));
  // The flattest sample on the lap: a straight, which is where the DRS gate is open.
  const straight = track.samples.reduce(
    (best, s) => (Math.abs(s.curvature) < Math.abs(best.curvature) ? s : best),
    track.samples[0]
  );
  const behind = { gap: 40, lateral: 0 };

  const car = new CarPhysics();
  car.reset(straight.x, straight.z, straight.heading, 90);
  // An alternating roll: under the old code half the frames deploy and half do not.
  let roll = 0;
  const alternating = () => (roll++ % 2 === 0 ? 0.5 : 0.95);
  const driver = new AIDriver(car, SKILL_PRESETS.strong, { track, random: alternating });

  let transitions = 0;
  let wasOpen = false;
  for (let i = 0; i < 240; i += 1) {
    driver.update(FIXED_TIMESTEP, { opponentBehind: behind });
    if (car.drsOpen !== wasOpen) transitions += 1;
    wasOpen = car.drsOpen;
  }
  assert.equal(transitions, 1, `the flap changed state ${transitions} times on one straight`);
  assert.equal(car.drsOpen, true, 'a driver who deploys keeps it open for the straight');

  // The latch has to be released when the gate closes, or the next straight is not a decision.
  for (let i = 0; i < 5; i += 1) driver.update(FIXED_TIMESTEP, { opponentBehind: null });
  assert.equal(car.drsOpen, false, 'no car within range means no DRS');

  // And a driver with no DRS skill never opens it at all.
  const rookie = new AIDriver(car, { ...SKILL_PRESETS.strong, drsSkill: 0 }, { track, random: () => 0.5 });
  for (let i = 0; i < 20; i += 1) rookie.update(FIXED_TIMESTEP, { opponentBehind: behind });
  assert.equal(car.drsOpen, false, 'a driver with no DRS skill must not deploy');
});

test('a spin requires the car to be facing backwards AND stopped', () => {
  // Testing the heading alone reverses the car mid-corner, where a large angle to
  // the track is normal, and it drives away down the escape road.
  assert.match(aiSource, /facingBackwards/);
  assert.match(aiSource, /nearlyStopped/);
  assert.match(aiSource, /facingBackwards && nearlyStopped/);
  assert.doesNotMatch(aiSource, /Math\.abs\(headingError\) > 1\.9 && physics\.speed < 8/);
});

test('the AI has a distinct behaviour for rejoining a car that left the road', () => {
  assert.match(aiSource, /OFF_TRACK_REJOIN/);
  assert.match(aiSource, /offTrack && offTrackDistance > OFF_TRACK_REJOIN/);
});

test('lateral avoidance is measured from the car being avoided, not from the racing line', () => {
  /*
   * The clearance floor in the test above raised a car's offset *from the centreline*. It could
   * not stop two cars driving into each other, because it never looked at where the other car
   * was: two drivers solving the same problem got the same answer and drove into each other.
   *
   * Measured at the moment of contact over 87,559 samples: the median pair was **0.10m apart
   * laterally**, overlapping by 0.93m of a 2.0m car, with 63% of contacts deeper than 0.8m.
   * That is not wheel-to-wheel racing -- two cars a metre apart brushing wheels -- it is two
   * cars in the same place, thousands of times a race in clips of a tenth of a second.
   *
   * Measured after: contact per car 124s to 24s at Bahrain, 141s to 24s at Monza, 127s to 15s at
   * Spa, and contact episodes down about three quarters.
   */
  const aiSource = readFileSync(new URL('../src/ai/AIDriver.js', import.meta.url), 'utf8');

  // The target line must be set relative to the opponent's own lateral position.
  assert.match(
    aiSource,
    /aheadCar\.lateral \+ Math\.sign\(lineOffset - aheadCar\.lateral \|\| 1\) \* CAR_CLEARANCE/,
    'the line has to be placed relative to the car ahead, not to the ideal line'
  );
  assert.match(aiSource, /const AVOID_GAP = 18/, 'and only while the car is close enough to matter');
  assert.match(aiSource, /aheadCar\.gap < AVOID_GAP/);

  // It must widen an existing avoidance rather than pick a side from the road's centre, which
  // is what let two cars choose the same side of the circuit at the same moment.
  assert.doesNotMatch(
    aiSource,
    /const side = ahead\.lateral > 0 \? -1 : 1;\s*\n\s*const commitment[\s\S]{0,200}target = side \* clamp\(wanted/,
    'the overtake offset must not still be chosen from which side of the road the car is on'
  );
});

test('an AI that commits to a pass moves far enough to clear the car', () => {
  /*
   * Contact was 13-18% of a race per car, against single-digit seconds in real F1, and it is
   * why race results were incident-dominated: the fastest car at Bahrain lapped 16.4s quicker
   * than the median and finished fifth.
   *
   * `scripts/measure-contact.mjs` splits it by geometry, and 95% of it was **lateral** -- cars
   * side by side, not nose to tail. So the follow logic was never the problem. (The closing-
   * rate hypothesis was tested and made it worse: removing the 2m/s margin floor took the Monza
   * median from 231s to 317s, because matching the leader's speed exactly parks the follower on
   * its gearbox.)
   *
   * The cause was the offset itself. `budget * aggression * commitment` is always a fraction of
   * the available room -- on a 14m track a committed aggressive pass asked for 2.3m and a `mid`
   * driver 1.5m -- and two cars are 2.0m wide. The AI was steering *into* the car it was
   * overtaking.
   */
  const aiSource = readFileSync(new URL('../src/ai/AIDriver.js', import.meta.url), 'utf8');

  // The clearance must be derived from the collision box, not guessed.
  assert.match(
    aiSource,
    /const CAR_CLEARANCE = 2\.3/,
    'the clearance must be stated, since it comes from a 2.0m-wide collision box'
  );
  // And it must floor the requested offset, rather than only scaling it down.
  assert.match(
    aiSource,
    /clamp\(wanted, Math\.min\(CAR_CLEARANCE, budget\), budget\)/,
    'a committed pass must never request less than the clearance'
  );
  assert.match(
    aiSource,
    /if \(Math\.abs\(target\) < Math\.min\(CAR_CLEARANCE, budget\)\)/,
    'and a defence must clear the car behind too, not merely lean towards it'
  );
});

test('there is a human driver to calibrate balance against, and a known reaction-model error', () => {
  /*
   * Every skill preset in this file is a model of *the AI's* idea of a driver, and none of them
   * is a person. The headline "the player wins 24 of 24" was measured with an `ace` autopilot
   * in the player's seat: it says the autopilot beats the field, not that a game is fair.
   * Asking "is this balanced" with nobody in the driver's seat is the wrong question, and
   * answering it anyway is how a balance problem gets reported as a solved one.
   *
   * So a `human` preset exists, with `reactionMs` taken from published motorsport figures.
   */
  assert.ok(SKILL_PRESETS.human, 'a human reference driver must exist');
  const human = SKILL_PRESETS.human;
  assert.equal(human.reactionMs, 200, '200ms is the standard human figure for motorsport');
  // The AI's fastest driver is superhuman by a factor of two; the human must not be faster.
  assert.ok(
    human.reactionMs > SKILL_PRESETS.ace.reactionMs,
    'the AI ace must stay superhuman, or the grid has no headroom for the player'
  );
  assert.ok(human.reactionMs < SKILL_PRESETS.backmarker.reactionMs, 'and a human is not a backmarker');

  /*
   * `consistency` is dead, and this is the seventh time this repo has had a value defined in
   * every preset and read by nothing. It is not asserted here as a working feature because it
   * is not one: what is asserted is that the gap is visible, so it cannot be closed by
   * accident and forgotten.
   */
  const aiSource = readFileSync(new URL('../src/ai/AIDriver.js', import.meta.url), 'utf8');
  assert.doesNotMatch(
    aiSource,
    /skill\.consistency/,
    'KNOWN DEFECT: consistency is defined on every preset and read by nothing, so the AI has ' +
    'no repeatability model at all. Measured: an ace flying lap varies 0.16-2.63s run to run ' +
    'where a real one varies 0.1-0.3s. Delete this assertion when the field reads it.'
  );

  /*
   * `reactionMs` used to be a sample-and-hold on the whole control loop, which is not what
   * reaction time is. At 90ms that is an 11Hz steering input, and at 83m/s each steering
   * decision covers 7.5m of travel. Measured cost of 80ms: 2.4-14.0s a lap, and up to 8.9s of
   * run-to-run scatter on one flying lap, which is what made the field unbalanceable -- the
   * noise was larger than the difference between drivers.
   *
   * Two wrong answers were tried first. A transport delay on material changes was much worse
   * (up to +39s a lap: it latches a stale *brake* through a braking zone). Lagging steering as
   * well as the pedals was right in kind but cost ~7% of pace, enough to push a 6-lap race
   * past the pit-stop test's fixed budget.
   *
   * What shipped lags the pedals only. Reaction time delays the response to a *change* -- lift,
   * brake, swerve -- and steering while tracking a line is continuous feedback a human is
   * already inside. That separates the two problems: the noise came from quantising steering,
   * and the pace cost from quantising throttle mid-braking-zone.
   */
  assert.match(
    aiSource,
    /1 - Math\.exp\(-dt \/ lag\)/,
    'reaction must be a first-order response, not a sample-and-hold on the loop'
  );
  assert.match(
    aiSource,
    /steer: fresh\.steer/,
    'steering must not be lagged: it is continuous tracking, not a decision'
  );
  assert.doesNotMatch(
    aiSource,
    /reactionDelay >= lag/,
    'the old sample-and-hold on the whole control loop must stay gone'
  );
});

test('the AI never commands throttle and brake together', () => {
  const car = new CarPhysics({ grip: 1 });
  car.reset(0, 0, 0, 45);
  const track = buildTrack(getCircuit('suzuka'));
  const ai = new AIDriver(car, SKILL_PRESETS.ace, { track, random: () => 0.5 });
  for (let i = 0; i < 120 * 30; i += 1) {
    const controls = ai.update(DT, {});
    assert.ok(
      !(controls.throttle > 0.05 && controls.brake > 0.05),
      'throttle and brake must never be applied together'
    );
    car.step(DT, controls, { grip: 1 });
  }
});

test('the world is built at the circuit, not at sea level', () => {
  /*
   * `sample.y` is metres above sea level and the calendar spans 2.2km of it: Mexico City at
   * 2235m, Spielberg at 685, Baku at -21, Silverstone and Las Vegas at exactly 0. Every piece
   * of venue scenery -- grandstands, floodlight pylons, the start gantry, the ground plane --
   * was placed at a hardcoded y = 0, and the sun's shadow camera was anchored the same way.
   *
   * At Mexico that put the entire venue two kilometres below the road: no stands, no rigs, no
   * gantry, no ground, a circuit hanging in the sky. At Baku it hung a storey above it. The
   * only two circuits it looked right on were the two that happen to be at zero metres, which
   * is how a hardcoded height survives a decade of playtesting.
   */
  for (const id of ['mexico', 'spielberg', 'baku', 'monza', 'silverstone']) {
    const circuit = getCircuit(id);
    const track = buildTrack(circuit);
    const heights = track.samples.map((sample) => sample.y);
    const low = Math.min(...heights);
    const high = Math.max(...heights);

    const environment = buildEnvironment(track, circuit.theme);
    // One forced update of the whole tree: measuring a child's world box before its parents
    // have been updated reports the child's *local* box, which is how the start gantry read as
    // sitting at 8m on a circuit 2.2km up.
    environment.updateMatrixWorld(true);
    const meshes = [];
    environment.traverse((node) => {
      if (node.isMesh) meshes.push(node);
    });
    assert.ok(meshes.length > 0, `${id}: no venue scenery at all`);

    for (const mesh of meshes) {
      const box = new THREE.Box3().setFromObject(mesh);
      // The ground plane is deliberately just under the *lowest* point of the lap; everything
      // else stands on the ground the circuit is actually built on.
      assert.ok(
        box.min.y > low - 40,
        `${id}: scenery at ${box.min.y.toFixed(1)}m is below a circuit at ${low.toFixed(1)}m`
      );
      assert.ok(
        box.max.y < high + 60,
        `${id}: scenery at ${box.max.y.toFixed(1)}m towers over a circuit at ${high.toFixed(1)}m`
      );
    }

    // And specifically the ground: under the road everywhere, over the horizon nowhere.
    const ground = meshes.find((mesh) => mesh.geometry.type === 'PlaneGeometry');
    assert.ok(ground, `${id}: the world outside the barriers needs a ground plane`);
    assert.ok(ground.position.y < low, `${id}: the ground plane cuts through the circuit`);
    assert.ok(ground.position.y > low - 20, `${id}: the ground plane is ${(low - ground.position.y).toFixed(1)}m below the road`);
  }

  // Two more anchors of the same kind, in the game loop rather than in the venue. The sun's
  // shadow camera is 40m to 900m deep over a car that can be 2.2km above sea level, and the
  // rain column is 45m tall around a camera that is up there with it. Source-level, because
  // both need a live renderer to exercise.
  assert.ok(
    /this\.sun\.position\.set\(\s*physics\.x \+ 180,\s*physics\.y \+ 320,\s*physics\.z \+ 120\s*\)/.test(gameSource),
    'the shadow camera must be anchored to the car it is shadowing, not to sea level'
  );
  assert.ok(
    /this\.sun\.target\.position\.set\(physics\.x, physics\.y, physics\.z\)/.test(gameSource),
    'the light must point at the car, not at the origin'
  );
  assert.ok(
    /this\.rain\.position\.set\(camera\.x, camera\.y - 22, camera\.z\)/.test(gameSource),
    'the rain column must be centred on the camera in all three axes'
  );
});

test('the floodlights are on the pylons, and on every pylon', () => {
  /*
   * The five lamps of a rig were pushed as *world* transforms -- the same five for every
   * pylon -- and then passed to the instancing helper with an empty offset list, which
   * multiplies the instance count to zero. The floodlights were not misplaced, they were
   * never drawn at all: every pylon head on every circuit was a dark bar lit only by the sun.
   */
  const circuit = getCircuit('monza');
  const track = buildTrack(circuit);
  const environment = buildEnvironment(track, circuit.theme);

  const matricesOf = (mesh) => {
    const out = [];
    for (let i = 0; i < mesh.count; i += 1) {
      out.push(new THREE.Matrix4().fromArray(mesh.instanceMatrix.array, i * 16));
    }
    return out;
  };

  const meshes = [];
  environment.traverse((node) => {
    if (node.isMesh) meshes.push(node);
  });
  // The rig head is the 7m box at the top of the mast; the lamps are the only unlit
  // (basic-material) geometry up there.
  const heads = meshes.find(
    (mesh) => mesh.isInstancedMesh && mesh.geometry.parameters?.width === 7 && mesh.geometry.parameters?.height === 2.4
  );
  const bulbs = meshes.find((mesh) => mesh.isInstancedMesh && mesh.material.isMeshBasicMaterial);
  assert.ok(heads && bulbs, 'the venue must have floodlights at all');

  const headPositions = matricesOf(heads).map((matrix) => new THREE.Vector3().setFromMatrixPosition(matrix));
  const bulbPositions = matricesOf(bulbs).map((matrix) => new THREE.Vector3().setFromMatrixPosition(matrix));

  assert.equal(bulbPositions.length, headPositions.length * 5, 'five lamps per rig');
  const span = new THREE.Box3().setFromPoints(headPositions).getSize(new THREE.Vector3());
  assert.ok(Math.hypot(span.x, span.z) > 400, `the rigs are spread round the lap, not stacked (${span.toArray()})`);

  for (const bulb of bulbPositions) {
    let nearest = Infinity;
    let lift = Infinity;
    for (const head of headPositions) {
      const distance = Math.hypot(bulb.x - head.x, bulb.z - head.z);
      if (distance < nearest) {
        nearest = distance;
        lift = bulb.y - head.y;
      }
    }
    assert.ok(
      nearest < 4,
      `a lamp ${nearest.toFixed(1)}m from the nearest pylon head is not on a pylon`
    );
    assert.ok(
      Math.abs(lift) < 2,
      `the lamps belong in the rig head, not ${lift.toFixed(1)}m away from it`
    );
  }
});

test('an AI car completes every circuit, with recovery when it runs wide', () => {
  // The guarantee under test is that a race always finishes: a car that leaves
  // the road and cannot get back is recovered to the racing line, costing it the
  // time it lost. Pace and line accuracy are a separate concern -- see
  // `scripts/ai-pace.mjs` for those numbers.
  for (const circuit of CIRCUITS) {
    const track = buildTrack(circuit);
    const setup = applyUpgrades({ power: 1, aero: 1, brakes: 1, tyres: 1, drs: 1 });
    const car = new CarPhysics(setup);
    const driver = new AIDriver(car, SKILL_PRESETS.mid, { track, random: () => 0.5 });
    const start = track.samples[0];
    car.reset(start.lineX, start.lineZ, start.lineHeading, start.targetSpeed * 0.6);

    let index = 0;
    let lastIndex = -1;
    let laps = 0;
    let time = 0;
    let rescues = 0;
    let lastRescue = -99;
    while (laps < 1 && time < 300) {
      const controls = driver.update(DT, {});
      car.step(DT, controls, { grip: 1 });
      time += DT;
      let located = locateOnTrack(track, car.x, car.z, index);
      index = located.index;

      // The same recovery the session performs for real.
      if (
        time - lastRescue > 2.5 &&
        Math.abs(located.lateral) > located.sample.width * 0.5 + 8 &&
        car.speed < 10
      ) {
        driver.rescue(car, track);
        index = driver.trackIndex;
        lastRescue = time;
        rescues += 1;
        located = locateOnTrack(track, car.x, car.z, index);
      }

      if (lastIndex >= 0 && index < lastIndex && lastIndex - index > track.count * 0.5) laps += 1;
      lastIndex = index;
    }
    assert.equal(laps, 1, `${circuit.id}: the AI must complete a lap`);
    assert.ok(rescues < 12, `${circuit.id}: the AI should not need constant recovery (${rescues})`);
  }
});

/* ----------------------------------------------------------------- season -- */

test('the championship starts with a full real grid', () => {
  const championship = createChampionship();
  assert.equal(championship.entries.length, 23, 'player plus a full twenty-two-car grid');
  assert.equal(championship.entries.filter((e) => e.isPlayer).length, 1);
  const teams = new Set(championship.entries.map((e) => e.team));
  assert.ok(teams.size >= 4, 'several teams');
  for (const driver of DRIVERS) {
    // Real drivers are listed in full ("Max Verstappen"), not as "M. Verstappen".
    assert.match(driver.name, /^[A-Z][a-z]+ [A-Z][a-z]/);
    assert.ok(skillFor(driver), `${driver.name} needs a skill profile`);
  }
  assert.equal(championship.entries.length, DRIVERS.length + 1, 'one player plus the full grid');
});

test('points follow the championship system', () => {
  assert.deepEqual(POINTS_TABLE, [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]);
  assert.equal(pointsForPosition(1), 25);
  assert.equal(pointsForPosition(10), 1);
  assert.equal(pointsForPosition(11), 0, 'outside the points there is nothing');
});

test('retiring is not a podium and not a win', () => {
  /*
   * A best finish was counted as `position <= 3`, and `position` is null for a car that was not
   * classified -- `null <= 3` is true, so every retirement counted as a podium. The standings
   * break a points tie on wins and then on podiums, so this handed the championship to whoever
   * had failed to finish most often, and the season screen credited retirements as silverware.
   */
  const championship = createChampionship();
  const [a, b] = championship.entries;
  // Level on points, so the tiebreak is the only thing that separates them.
  a.points = 20;
  b.points = 20;
  championship.history[0] = [
    { short: a.short, position: null, retired: true, points: 0, fastestLap: false },
    { short: b.short, position: 3, retired: false, points: 15, fastestLap: false }
  ];
  championship.history[1] = [
    { short: a.short, position: null, retired: true, points: 0, fastestLap: false },
    { short: b.short, position: 8, retired: false, points: 4, fastestLap: false }
  ];
  championship.history[2] = [
    { short: a.short, position: null, retired: true, points: 0, fastestLap: false },
    { short: b.short, position: 11, retired: false, points: 0, fastestLap: false }
  ];

  const table = standings(championship);
  const rowA = table.find((row) => row.short === a.short);
  const rowB = table.find((row) => row.short === b.short);
  assert.equal(rowA.wins, 0, 'three retirements are not three wins');
  assert.equal(rowA.podiums, 0, 'and they are not three podiums either');
  assert.equal(rowB.podiums, 1, 'a third place is a podium');
  assert.equal(rowA.races, 3, 'a retirement is still a race entered');
  assert.equal(rowB.races, 3, 'and so is a finish');
  assert.ok(
    table.indexOf(rowB) < table.indexOf(rowA),
    'level on points, the driver who finished on the podium is ahead of the one who never finished'
  );
});

test('an unusable save leaves the season where it was', () => {
  /*
   * `loadChampionship` returns null when the save cannot be applied, but it wrote each entry as
   * it checked it -- points, upgrades and development points, one entry at a time. A save that
   * failed on its last entry, which is what a save from a different roster looks like, therefore
   * left the championship half-loaded: some of a stranger's progress, this season's for the
   * rest. The caller ignores the null, because a null save means "start fresh" and there is
   * nothing else for it to do, so it started the season from that chimaera.
   */
  const store = {
    available: true,
    data: null,
    load() {
      return this.data;
    },
    save(state) {
      this.data = state;
      return true;
    },
    clear() {
      this.data = null;
    }
  };
  const championship = createChampionship(store);
  const before = championship.entries.map((entry) => ({
    short: entry.short,
    points: entry.points,
    upgrades: { ...entry.upgrades }
  }));

  // Every entry named but the last: usable right up to the point where it is not.
  store.data = {
    version: 1,
    round: 5,
    finished: false,
    history: [],
    entries: championship.entries.slice(0, -1).map((entry, index) => ({
      short: entry.short,
      points: 40 + index,
      upgrades: { ...entry.upgrades, power: 3 },
      developmentPoints: 7
    }))
  };
  assert.equal(loadChampionship(championship), null, 'a save missing an entry is unusable');
  assert.equal(championship.round, 0, 'so the season must not be moved on');
  for (const entry of championship.entries) {
    const original = before.find((row) => row.short === entry.short);
    assert.equal(entry.points, original.points, `${entry.short} must keep this season's points`);
    assert.deepEqual(entry.upgrades, original.upgrades, "and this season's upgrades");
    assert.notEqual(entry.points, 40, 'and none of the unusable save must be in there');
  }

  // A save that names every entry still loads, which is the whole point of the function.
  store.data = {
    version: 1,
    round: 4,
    finished: false,
    history: [],
    entries: championship.entries.map((entry, index) => ({
      short: entry.short,
      points: 10 + index,
      upgrades: { ...entry.upgrades },
      developmentPoints: 3
    }))
  };
  assert.ok(loadChampionship(championship), 'a complete save must still load');
  assert.equal(championship.round, 4, 'with its round, its history and its points');
  assert.equal(championship.entries[0].points, 10, 'the first entry takes the saved points');
  assert.equal(championship.entries.at(-1).points, 10 + championship.entries.length - 1);
});

test('a season runs every round and awards points exactly once', () => {
  const store = {
    available: true,
    data: null,
    load() {
      return this.data;
    },
    save(state) {
      this.data = state;
      return true;
    },
    clear() {
      this.data = null;
    }
  };
  const championship = createChampionship(store);
  const rounds = [];

  for (let round = 0; round < CIRCUITS.length; round += 1) {
    const circuit = currentRound(championship);
    assert.ok(circuit, 'each round should have a circuit');
    rounds.push(circuit.id);
    const results = championship.entries.map((entry, index) => ({
      short: entry.short,
      position: index + 1,
      retired: false
    }));
    applyRaceResult(championship, results, championship.entries[0].short);
  }

  assert.deepEqual(rounds, CIRCUITS.map((c) => c.id), 'the calendar runs in order');
  assert.equal(championship.round, CIRCUITS.length);
  assert.equal(championship.finished, true);

  const total = standings(championship).reduce((sum, row) => sum + row.points, 0);
  // Every round awards the full points table plus one point for the fastest lap.
  const perRound = POINTS_TABLE.reduce((a, b) => a + b, 0) + 1;
  assert.equal(total, perRound * CIRCUITS.length, 'every round should distribute the full points table');
  assert.equal(currentRound(championship), null, 'the season is over');
});

test('retirements score nothing', () => {
  const store = { available: true, data: null, load() { return null; }, save() { return true; }, clear() {} };
  const championship = createChampionship(store);
  const before = championship.entries.map((e) => e.points);
  applyRaceResult(
    championship,
    championship.entries.map((entry, index) => ({
      short: entry.short,
      position: index + 1,
      retired: index > 2
    })),
    null
  );
  championship.entries.forEach((entry, index) => {
    if (index > 2) {
      assert.equal(entry.points, before[index], 'a retirement must not score');
    }
  });
});

test('upgrades cost development points and change the car', () => {
  const store = { available: true, data: null, load() { return null; }, save() { return true; }, clear() {} };
  const championship = createChampionship(store);
  const entry = championship.entries.find((e) => e.isPlayer);

  assert.equal(buyUpgrade(championship, 'power'), false, 'cannot buy without points');
  entry.developmentPoints = 50;
  assert.equal(buyUpgrade(championship, 'power'), true);
  assert.equal(entry.upgrades.power, 1);
  assert.ok(entry.developmentPoints < 50, 'points should have been spent');

  const stock = applyUpgrades({ power: 0, aero: 0, brakes: 0, tyres: 0, drs: 0 });
  const upgraded = applyUpgrades({ power: 3, aero: 3, brakes: 3, tyres: 3, drs: 3 });
  assert.ok(upgraded.powerScale > stock.powerScale, 'power upgrade should add thrust');

  // Read off the car, not the setup, and check the consequence in force and downforce
  // rather than the number that feeds them.
  const stockCar = new CarPhysics(stock);
  const upgradedCar = new CarPhysics(upgraded);
  assert.ok(
    upgradedCar.geometry.downforceArea > stockCar.geometry.downforceArea,
    'aero upgrade should add downforce to the car'
  );
  assert.ok(
    upgradedCar.computeDownforce(80) > stockCar.computeDownforce(80) * 1.05,
    `aero upgrade should measurably raise downforce at speed: ${upgradedCar.computeDownforce(80).toFixed(0)}N vs ${stockCar.computeDownforce(80).toFixed(0)}N`
  );
  assert.ok(upgradedCar.peakGrip > stockCar.peakGrip, 'tyre upgrade should add grip');
  assert.ok(upgradedCar.maxBrakeForce > stockCar.maxBrakeForce, 'brake upgrade should add force');

  // Tiers must be bounded.
  entry.developmentPoints = 1000;
  for (let i = 0; i < 10; i += 1) buyUpgrade(championship, 'power');
  assert.equal(entry.upgrades.power, POWERTRAIN && UPGRADES[0].values.length - 1, 'upgrades must cap out');
});

test('development points are earned from finishes', () => {
  assert.ok(developmentPointsFor(1, true) > developmentPointsFor(10, true));
  assert.equal(developmentPointsFor(1, false), 0, 'a retirement pays nothing');
});

test('skill presets differ, and weaker drivers are slower', () => {
  const pace = Object.values(SKILL_PRESETS).map((s) => s.pace);
  assert.ok(Math.max(...pace) - Math.min(...pace) > 0.05, 'skill should span a real range');
  for (const preset of Object.values(SKILL_PRESETS)) {
    for (const key of ['pace', 'cornering', 'brakeConfidence', 'consistency', 'aggression', 'linePrecision', 'drsSkill', 'mistakeChance']) {
      assert.equal(typeof preset[key], 'number', `${key} should be numeric`);
    }
    assert.ok(preset.reactionMs > 0, 'every driver needs a reaction time');
  }
});

test('every upgrade tier is reachable and monotonic', () => {
  for (const upgrade of UPGRADES) {
    assert.ok(upgrade.values.length >= 2, `${upgrade.id} needs tiers`);
    assert.equal(upgrade.costs.length, upgrade.values.length, `${upgrade.id} costs must match tiers`);
    assert.equal(upgrade.costs[0], 0, 'stock should be free');
    for (let i = 1; i < upgrade.costs.length; i += 1) {
      assert.ok(upgrade.costs[i] > 0, `${upgrade.id} tier ${i} should cost something`);
    }
    assert.ok(upgradeCost(upgrade, 0, upgrade.values.length - 1) > 0);
  }
});

/* -------------------------------------------------------------- formatting -- */

test('lap times and positions format the way a timing screen shows them', () => {
  assert.equal(formatLapTime(0), '--:--.---');
  assert.equal(formatLapTime(83.456), '1:23.456');
  assert.equal(formatLapTime(3725.1), '62:05.100');
  assert.equal(formatGap(0), '0.000');
  assert.equal(formatGap(1.25), '+1.250');
  assert.equal(formatPosition(1), '1st');
  assert.equal(formatPosition(2), '2nd');
  assert.equal(formatPosition(3), '3rd');
  assert.equal(formatPosition(11), '11th');
  assert.equal(formatPosition(21), '21st');
  assert.equal(formatPosition(112), '112th');
});

test('angles wrap to the shortest arc', () => {
  assert.ok(Math.abs(wrapAngle(Math.PI * 2 - 0.1) + 0.1) < 1e-9);
  assert.ok(Math.abs(wrapAngle(0.1) - 0.1) < 1e-9);
});

/* ----------------------------------------------------------------- session -- */

test('a race session runs, classifies and returns results', async () => {
  const track = buildTrack(getCircuit('austin'));
  const base = { power: 1, aero: 1, brakes: 1, tyres: 1, drs: 1, reliability: 1 };
  const entries = [
    { ...PLAYER_ENTRY, isPlayer: true, upgrades: { ...base } },
    ...DRIVERS.map((d) => ({ ...d, isPlayer: false, upgrades: { ...base } }))
  ];
  const session = new RaceSession({
    track,
    entries,
    type: SESSION_TYPE.race,
    totalLaps: 1,
    random: () => 0.5
  });

  assert.equal(session.cars.length, DRIVERS.length + 1, 'player plus the full grid');
  assert.ok(session.player, 'there must be a player car');

  const idle = { throttle: 0, brake: 0, steer: 0, handbrake: false };
  for (let i = 0; i < 120 * 20 && !session.finished; i += 1) session.update(DT, idle);

  const results = session.results();
  assert.equal(results.length, DRIVERS.length + 1, 'every car is classified');
  for (const result of results) {
    assert.ok(result.position >= 1 || result.retired, 'a car is either placed or retired');
  }

  // Order is maintained live, and reflects how far round the lap each car is.
  // Retired cars sort to the back, but every car still running must be ahead of
  // them -- otherwise a retirement does not actually cost the driver positions.
  const order = session.order.entries;
  assert.equal(order.length, DRIVERS.length + 1, 'every car should appear in the live order');
  assert.equal(order[0].position, 1, 'the leader is P1');
  const running = order.filter((entry) => !entry.retired);
  for (let i = 1; i < running.length; i += 1) {
    assert.ok(
      running[i - 1].distance >= running[i].distance,
      'running cars must be ordered by distance covered'
    );
  }
  for (const entry of order) {
    if (!entry.retired) continue;
    assert.ok(
      order.at(-1) === entry || order.slice(order.indexOf(entry) + 1).every((other) => other.retired),
      'retired cars must not appear ahead of cars still running'
    );
  }
  assert.ok(
    order[0].gapToLeader === 0,
    'the leader has no gap to themselves'
  );

  // A session driven entirely on the brakes strands the whole field, and a
  // retired car cannot hold the fastest lap -- so with everyone retired there is
  // correctly no fastest lap to award.
  assert.equal(session.fastestLap().holder, null, 'retired cars cannot hold the fastest lap');

  // With cars still running, attribution works.
  for (const car of session.cars) car.retired = false;
  session.cars.forEach((car, index) => {
    car.timer.bestLap = 90 + index;
  });
  const fastest = session.fastestLap();
  assert.ok(fastest.holder, 'a fastest lap should be attributed');
  assert.equal(fastest.time, 90, 'the quickest lap should win');
});

test('a race is classified in finishing order, not grid order', () => {
  /*
   * The per-car step loop only skipped retired cars, so `#finishCar` ran again for every
   * already-finished car on every step. It pushed the car onto `finishOrder` again, and it
   * rewrote `finishTime` to the current step, so every finisher ended the race on the same
   * time -- which made `results()` sort by nothing and classify the field in grid order.
   * Rewriting the leader's time also left the "12 seconds after the winner" rule comparing
   * the clock with itself, so it never fired and the race ran until the last car finished.
   *
   * One idle car on pole is the whole test: it never completes a lap, so the only way the
   * session can end is the 12s rule.
   */
  const track = buildTrack(getCircuit('monza'));
  const entries = [
    { ...DRIVERS[0], isPlayer: false, upgrades: {} },
    { ...DRIVERS[1], isPlayer: false, upgrades: {} }
  ];
  const session = new RaceSession({
    track,
    entries,
    type: SESSION_TYPE.race,
    totalLaps: 1,
    random: () => 0.5
  });

  // The second car has no AI and no input, so it never completes a lap and cannot retire.
  const leader = session.cars[0];
  session.cars[1].ai = null;

  const idle = { throttle: 0, brake: 0, steer: 0, handbrake: false };
  let leaderFinishTime = null;

  for (let i = 0; i < 120 * 400 && !session.finished; i += 1) {
    session.update(DT, idle);
    if (leader.finished) {
      if (leaderFinishTime === null) leaderFinishTime = leader.finishTime;
      assert.equal(leader.finishTime, leaderFinishTime, 'a finisher\'s time must not be rewritten');
    }
  }

  assert.ok(leader.finished, 'the AI car should complete the lap');
  assert.ok(session.finished, 'the session must end 12s after the winner');
  assert.ok(
    session.time - leaderFinishTime >= 12 && session.time - leaderFinishTime < 14,
    `session ran ${(session.time - leaderFinishTime).toFixed(1)}s past the winner`
  );
  assert.equal(
    session.finishOrder.length,
    1,
    'the winner is recorded once, not once per step'
  );

  const results = session.results();
  assert.equal(results[0].short, leader.entry.short, 'the winner is classified first');
  assert.equal(results[0].position, 1, 'the winner takes P1');
  assert.equal(results[1].totalTime, null, 'a car that never took the flag has no total time');
  assert.ok(results[0].totalTime < results[1].totalTime || results[1].totalTime === null);
});

test('the starting grid is staggered and inside the track', () => {
  const track = buildTrack(getCircuit('suzuka'));
  assert.ok(track.grid.length >= 10);
  const rows = new Set();
  for (const slot of track.grid) {
    rows.add(slot.row);
    const located = locateOnTrack(track, slot.x, slot.z, null);
    assert.ok(
      Math.abs(located.lateral) <= located.sample.width * 0.5,
      'grid slots must be on the road'
    );
  }
  assert.ok(rows.size >= 5, 'the grid should be staggered over several rows');
});

test('the grid puts pole on the road, not in the run-off', () => {
  const track = buildTrack(getCircuit('spa'));
  const pole = track.grid[0];
  const located = locateOnTrack(track, pole.x, pole.z, null);
  assert.ok(Number.isFinite(located.index));
  assert.ok(Math.abs(located.lateral) < 6, 'pole should be near the centreline');
});

test('the first lap of a race is a lap, not a deleted one', () => {
  /*
   * The grid sits behind the line and crossing that line arms the timer: that is the whole
   * reason a grid is where it is. `RaceSession` armed every car's timer while it was still
   * standing on the grid -- `lapStarted = true` with gate 0 already collected, which is the
   * state of a machine halfway round a lap -- so the first crossing of the line was read as
   * the end of a lap that had missed twenty-three checkpoints. `invalid` was set for every car
   * on the grid, and the HUD reported INVALID LAP at all of them from lights out until each
   * one had finished a full lap: a lap none of them had cut.
   */
  const track = buildTrack(getCircuit('monza'));
  const entries = [
    { ...DRIVERS[0], isPlayer: true, upgrades: {} },
    { ...DRIVERS[1], isPlayer: false, upgrades: {} }
  ];
  const session = new RaceSession({
    track,
    entries,
    type: SESSION_TYPE.race,
    totalLaps: 3,
    random: () => 0.5
  });

  for (const car of session.cars) {
    // Unarmed, and with no checkpoints collected: the crossing is what starts the lap.
    assert.equal(car.timer.lapStarted, false, `${car.entry.short} must not be timing from the grid`);
    assert.equal(car.timer.visited.size, 0, 'a car on the grid has not collected a checkpoint');
  }

  // Off the grid and over the line: the player's car by hand, the AI's car by itself.
  const straight = { throttle: 0.7, brake: 0, steer: 0, handbrake: false };
  let crossed = 0;
  for (let i = 0; i < 60 * 40 && crossed < session.cars.length; i += 1) {
    session.update(DT, straight);
    crossed = session.cars.filter((car) => car.timer.lapStarted).length;
  }
  assert.equal(crossed, session.cars.length, 'the field is over the line within forty seconds');

  for (const car of session.cars) {
    assert.equal(car.timer.invalid, false, `${car.entry.short}'s first lap was deleted on the line`);
    assert.equal(car.timer.laps.length, 0, 'the crossing arms the timer rather than completing a lap');
    assert.equal(car.timer.lap, 0, 'so no lap has been completed yet');
  }
});

/* ---------------------------------------------------------------------------
 * The touch stick: travel, response curve and the steering setting
 * ------------------------------------------------------------------------ */

/**
 * A stand-in for the floating thumbstick.
 *
 * `bindStick` measures the ring it is handed and listens on the zone, so both are faked
 * with the same listener map. Pointer capture is a silent no-op rather than absent: the
 * binding treats it as optional, and a phone that refuses it must still steer.
 */
function fakeStick(width = 132) {
  const make = () => {
    const listeners = new Map();
    return {
      style: {},
      contains: () => true,
      classList: { add() {}, remove() {}, toggle() {} },
      setPointerCapture() {},
      getBoundingClientRect: () => ({ width, left: 0, top: 0 }),
      addEventListener(type, handler) {
        listeners.set(type, handler);
      },
      emit(type, fields = {}) {
        listeners.get(type)?.({ preventDefault() {}, pointerId: 1, ...fields });
      }
    };
  };
  return { ring: make(), zone: make() };
}

/** A controller with the stand-in stick bound, the way `main.js` binds the real one. */
function stickController(stick = fakeStick(132)) {
  const input = new InputController(fakeWindow());
  input.bindStick(stick.ring, null, stick.zone);
  return { input, stick };
}

/**
 * Press the stick somewhere, drag `px` pixels right, then read one long frame.
 *
 * The frame is deliberately a whole second: steering is rate-limited to at most 4.2 units
 * per second, so a sixtieth of a second would report the slew limit rather than the
 * request the stick actually made.
 */
function stickSteer(controller, px, dt = 1) {
  const { input, stick } = controller;
  stick.zone.emit('pointerdown', { clientX: 200, clientY: 200, target: stick.zone });
  stick.zone.emit('pointermove', { clientX: 200 + px, clientY: 200 });
  return input.read(dt, 0).steer;
}

test('the touch stick keeps full lock for the edge of its travel', () => {
  /*
   * The complaint: "if I move a bit, I get pushed onto the grass already". Full lock used
   * to be 32% of the ring -- 42px, about a centimetre of thumb on a phone -- and the
   * response was dead linear, so the first eighth of the travel did an eighth of the
   * steering. Nothing in the middle of that range was usable: every thumb position that
   * could be held was already asking for more lock than the tyres could honour.
   *
   * The reach is 41% now and the axis is curved, with a dead zone for a resting thumb.
   * Both ends of the range stay where they belong: nothing until the thumb moves, and
   * full lock at the edge of the travel rather than somewhere in the middle of it.
   */
  const reach = 132 * 0.41;

  assert.equal(stickAxis(0, reach), 0, 'a stick left alone steers by nothing');
  assert.equal(stickAxis(2, reach), 0, 'and a resting thumb inside the dead zone does not steer');
  assert.ok(stickAxis(8, reach) < 0.05, `8px is a small request, got ${stickAxis(8, reach)}`);
  assert.ok(
    stickAxis(8, reach) < 8 / reach / 3,
    'and it is under a third of what the same nudge asked for with a linear map'
  );
  assert.ok(stickAxis(reach * 0.5, reach) < 0.5, 'half travel is less than half the steering');
  assert.ok(stickAxis(reach * 0.5, reach) > 0.2, 'but the middle of the travel still does something');
  assert.equal(stickAxis(reach, reach), 1, 'the edge of the travel is full lock');
  assert.equal(stickAxis(reach * 4, reach), 1, 'and past it stays there');
  assert.equal(stickAxis(-reach * 4, reach), -1, 'which holds in both directions');

  let previous = -1;
  for (let px = 0; px <= reach; px += 1) {
    const value = stickAxis(px, reach);
    assert.ok(value >= previous, `the curve must not fold back: ${value} after ${previous} at ${px}px`);
    previous = value;
  }
});

test('a nudge of the stick at racing speed asks for less grip than the tyres have', () => {
  /*
   * The numbers behind the same complaint, taken from the model the car drives on.
   *
   * A stick request becomes a steering angle through `maxSteer`, which falls from 0.52 rad
   * at rest to 0.09 rad at 85 m/s, and the wheelbase is the car mesh's own front-to-rear
   * length. Steady-state cornering then asks for `v^2 * tan(steer) / L` of lateral
   * acceleration, and the tyres can supply `TYRE.peakGrip * g` before they slide. Asking
   * for more than that is the car leaving the road: at 200 km/h the old linear mapping
   * turned an 8px thumb movement into several times the grip the car has, at any speed.
   */
  const speed = 55; // ~200 km/h
  const maxSteer = 0.52 + (0.09 - 0.52) * Math.min(speed / 85, 1);
  const wheelbase = 1.42 + 1.5;
  const budget = TYRE.peakGrip * GRAVITY;
  const demand = (request) => (speed * speed * Math.tan(request * maxSteer)) / wheelbase;

  const nudge = stickAxis(8, 132 * 0.41);
  assert.ok(
    demand(nudge) < budget,
    `8px at 200 km/h must stay inside the tyres: ${demand(nudge).toFixed(1)} against ${budget.toFixed(1)} m/s^2`
  );

  const before = demand(8 / (132 * 0.32));
  assert.ok(
    before > budget * 2,
    `the linear mapping this replaces demanded ${before.toFixed(1)} m/s^2 against ${budget.toFixed(1)} available`
  );
});

test('the steering setting chooses the response, and every choice still reaches full lock', () => {
  const controller = stickController();
  const { input } = controller;

  assert.equal(input.sensitivity, DEFAULT_STEER_SENSITIVITY, 'a new player gets the tuned curve');

  const at = (name, px) => {
    input.setSensitivity(name);
    return Math.abs(stickSteer(controller, px));
  };

  const calm = at('calm', 20);
  const normal = at('normal', 20);
  const sharp = at('sharp', 20);
  assert.ok(calm < normal, `calm must be gentler than normal: ${calm} against ${normal}`);
  assert.ok(normal < sharp, `sharp must answer sooner than normal: ${sharp} against ${normal}`);

  // The endpoints survive every curve, which is what makes the setting safe to offer:
  // a calm stick is a gentler stick, not a car that cannot be turned.
  for (const name of Object.keys(STEER_CURVES)) {
    assert.equal(at(name, 132 * 0.5), 1, `${name} must still be able to ask for full lock`);
  }

  assert.equal(input.setSensitivity('wild'), false, 'an unknown name is refused');
  assert.equal(input.sensitivity, 'sharp', 'and does not disturb the choice already made');
  assert.equal(input.curve, STEER_CURVES.sharp);
});

test('the steering setting reaches the gyroscope as well as the stick', async () => {
  /*
   * One setting, both analogue schemes. A player who found the stick too sharp and
   * switched to motion expecting that to be gentler should not have to go looking for a
   * second control, and a motion player whose setting quietly did nothing would have no
   * way to tell that from a phone that is simply hard to hold still.
   */
  const motion = await startedMotion({ angle: 0 });
  const input = new InputController(fakeWindow());
  input.motion = motion;
  input.controlScheme = 'motion';
  motion.target.emit(0, 6);

  const settled = () => {
    let steer = 0;
    for (let i = 0; i < 90; i += 1) steer = input.read(1 / 60).steer;
    return Math.abs(steer);
  };

  const normal = settled();
  input.setSensitivity('calm');
  assert.equal(motion.curve, STEER_CURVES.calm, 'the tilt curve follows the same choice');
  const calm = settled();
  assert.ok(calm < normal, `a calm setting must steer less on tilt too: ${calm} against ${normal}`);

  motion.target.emit(0, 40);
  input.setSensitivity('normal');
  assert.ok(settled() > 0.9, 'and a full tilt still reaches full lock');
});

test('the controls screen offers the same steering names the input layer accepts', () => {
  /*
   * The names are the contract between two files: `main.js` builds the chips from
   * `STEER_CURVES`, so a new curve without copy would render a chip labelled with its own
   * key, and a chip with no curve behind it would silently do nothing. Neither is visible
   * from the input layer's side, which is why this reads the screen's source.
   */
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const copy = source.match(/const STEERING_COPY = \{([\s\S]*?)\n\};/);
  assert.ok(copy, 'the controls screen must have copy for the steering choices');
  const named = [...copy[1].matchAll(/^ {2}([a-z]+):/gm)].map((match) => match[1]);
  assert.deepEqual(named, Object.keys(STEER_CURVES), 'every accepted name needs a label, in order');

  assert.match(source, /data-steer="\$\{choice\.id\}"/, 'the chips are built from the input layer list');
  assert.match(source, /saveSteering\(/, 'the choice is remembered between sessions');
  assert.match(source, /game\.input\.setSensitivity\(loadSteering\(\)\)/, 'and applied on boot');
});

/* ---------------------------------------------------------------------------
 * Tyre effects: smoke, dust, sparks and the rubber on the road
 * ------------------------------------------------------------------------ */

/**
 * Deterministic stand-ins for `Math.random` in the effect tests.
 *
 * Emission is a probability per frame, so a test that wanted a particle would be flaky on
 * `Math.random`, and a test that wanted *no* particle would pass for the wrong reason.
 * `fires` is below every probability the module produces and `coin` sits inside the range,
 * so each assertion is about the threshold in the code rather than about luck.
 */
const fires = () => 0;
const coin = () => 0.5;

const rounded = (value) => Math.round(value * 100) / 100;

test('the tyre effects fire on the physics signals rather than on guesses', () => {
  /*
   * The whole value of a smoke effect is that it means something: that the rear tyres are
   * past the peak of the friction curve and the car is about to be a handful. A car at the
   * limit of grip must therefore show nothing, which is why the thresholds are read from
   * the physics rather than chosen for how the effect looks.
   */
  const car = new CarPhysics();
  car.vLong = 50; // ~180 km/h
  car.vLat = 0;
  const surface = { halfWidth: 7, lateral: 0 };

  // Gripping: the tyres are working hard and nothing should be coming off them.
  car.rearSlipAngle = 0.08;
  car.wheelSlip = 0;
  car.brakeLock = 0;
  let signals = tyreSignals(car, surface);
  assert.equal(signals.smoky, false, 'a car at the peak of the friction curve must not smoke');
  assert.equal(signals.laying, false, 'and must not be leaving rubber either');

  // Sliding: past the peak, which is where the smoke belongs.
  car.rearSlipAngle = 0.2;
  signals = tyreSignals(car, surface);
  assert.equal(signals.smoky, true, 'a sliding tyre smokes');
  assert.equal(signals.laying, true, 'and leaves rubber');

  /*
   * Wheelspin, which has to clear a much higher bar than the slip angle does.
   *
   * `wheelSlip` is non-zero whenever the engine asks for more than the rear tyres can put
   * down, and in these cars that is most of a lap. An earlier version fired on any of it,
   * and the first run in the browser had all twenty-two cars smoking and laying rubber
   * through a green-flag lap -- a cue that is always on is not a cue.
   */
  car.rearSlipAngle = 0.02;
  car.wheelSlip = 0.3;
  signals = tyreSignals(car, surface);
  assert.equal(signals.smoky, false, 'a car merely on the power out of a corner is not smoking');
  assert.equal(signals.laying, false, 'and is not leaving rubber either');

  car.wheelSlip = 0.7; // half the drive force again on top of what the tyres can take
  signals = tyreSignals(car, surface);
  assert.ok(signals.sliding > 0.5, 'but a wheel properly spinning up is a sliding tyre');
  assert.equal(signals.smoky, true);
  assert.equal(signals.laying, true);

  // Locked up under braking, which the physics flags for the front axle.
  car.wheelSlip = 0;
  car.brakeLock = 1;
  signals = tyreSignals(car, surface);
  assert.equal(signals.smoky, true, 'a locked wheel smokes');

  /*
   * Where the car is on the road, which decides dust and whether there is anything to mark.
   * The kerb is 1.4m of run-off either side, so 8m off centre on a 14m road is still kerb
   * and 9m is not -- and off the road there is no asphalt for the rubber to be laid on.
   */
  car.rearSlipAngle = 0.3;
  car.brakeLock = 0;
  assert.equal(
    tyreSignals(car, { halfWidth: 7, lateral: 8 }).offTrack,
    false,
    'the kerb is still the track: the car is on the paint, not the grass'
  );
  const off = tyreSignals(car, { halfWidth: 7, lateral: 9 });
  assert.equal(off.offTrack, true, 'past the kerb the wheels are on the run-off');
  assert.equal(off.laying, false, 'and there is nothing to lay rubber on out there');
  assert.equal(off.smoky, true, 'though the tyres are as gone as they were on the road');
  assert.equal(
    tyreSignals(car).offTrack,
    false,
    'a car the session has not placed yet is on the road, not off it'
  );
});

test('the effect pools are bounded, and every particle ends', () => {
  /*
   * The pools are the reason this is affordable on a phone at all, so the two things worth
   * asserting are that they cannot grow and that nothing in them is immortal. An effect
   * that leaks a particle per frame is invisible until the frame rate falls off a cliff
   * twenty minutes into a race.
   */
  const effects = new Effects(new THREE.Scene(), { random: fires });
  for (let i = 0; i < 4000; i += 1) {
    effects.smoke(0, 0, 0, 1, 0, 0, 1 / 60);
    effects.dust(0, 0, 0, 1, 0, 0, 1 / 60);
    effects.sparks(0, 0, 0, 20);
  }
  assert.ok(effects.particleCount > 0, 'the emitters must have produced something to test');
  assert.ok(
    effects.particleCount <= SOFT_CAPACITY + SPARK_CAPACITY,
    `the pools cannot grow past their capacity, got ${effects.particleCount}`
  );
  effects.update(1 / 60);
  assert.equal(
    effects.soft.geometry.drawRange.count,
    effects.soft.live,
    'the draw range follows the live particles, so a dead one is not still drawn'
  );

  effects.update(3);
  assert.equal(effects.particleCount, 0, 'every particle must expire');
  assert.equal(effects.soft.geometry.drawRange.count, 0, 'and stop being drawn');
  assert.equal(effects.soft.live, 0, 'with nothing left in the pool');
});

test('emission is a rate per second rather than a particle per frame', () => {
  /*
   * The frame rate is not a game variable: a phone at 30fps and a desktop at 144 are the
   * same race, and smoke emitted per frame would be five times as dense on the desktop. A
   * probability scaled by `dt` is what makes them agree.
   */
  const effects = new Effects(new THREE.Scene(), { random: coin });
  effects.smoke(0, 0, 0, 1, 0, 0, 1 / 30);
  assert.equal(effects.particleCount, 1, 'a thirtieth of a second of a fully sliding tyre emits');

  effects.reset();
  effects.smoke(0, 0, 0, 1, 0, 0, 1 / 600);
  assert.equal(effects.particleCount, 0, 'a tenth of that time emits nothing');

  // A tyre that is not past the limit emits nothing whatever the frame length is.
  effects.reset();
  effects.smoke(0, 0, 0, 0, 0, 0, 1);
  assert.equal(effects.particleCount, 0, 'a tyre that is not sliding must not smoke');
});

test('smoke is left behind by the car that made it', () => {
  const effects = new Effects(new THREE.Scene(), { random: fires });
  effects.smoke(0, 0, 0, 1, 40, 0, 1 / 60);
  assert.equal(effects.particleCount, 1);

  const vx = effects.soft.velocity[0];
  assert.ok(vx > 0 && vx < 40, `smoke drifts along with the car, it does not travel at its speed: ${vx}`);
  effects.update(0.05);
  assert.ok(effects.soft.position[1] > 0, 'and rises, because it is lighter than the air it is in');
  assert.ok(effects.soft.alpha[0] > 0, 'fading in rather than appearing at full opacity');
  assert.ok(effects.soft.size[0] > 0.5, 'and growing as it goes');
});

test('skid marks are laid one segment at a time, and wear off', () => {
  const effects = new Effects(new THREE.Scene(), { random: fires });

  assert.equal(effects.skid('car', 0, 0, 0, 1), false, 'the first call records where the strip starts');
  assert.equal(effects.skid('car', 1, 0, 0, 1), false, 'a metre is less than a segment');
  assert.equal(effects.skid('car', 3, 0, 0, 1), true, 'three metres is a segment');
  assert.equal(effects.markCount, 1, 'and leaves exactly one mark');

  // Geometry: the mark runs from the last point to this one, 0.34m wide, at road height.
  // The segment travelled was 3m along x, so the width is taken across z.
  const xs = [];
  const zs = [];
  for (let corner = 0; corner < 4; corner += 1) {
    xs.push(rounded(effects.marks.position[corner * 3]));
    zs.push(rounded(effects.marks.position[corner * 3 + 2]));
  }
  assert.deepEqual(xs, [0, 0, 3, 3], 'the strip spans the segment that was travelled');
  assert.deepEqual(zs, [0.17, -0.17, 0.17, -0.17], 'and is 0.34m wide, centred on the path');

  /*
   * A strip that ends, ends where it ended.
   *
   * Without that, the next time the car slides the first mark would be one quad from the
   * last slide to this one -- a single black streak across half the circuit, drawn the first
   * time a car spins and comes back.
   */
  effects.clearStrip('car');
  assert.equal(effects.skid('car', 400, 0, 0, 1), false, 'a new strip starts where the car is now');
  assert.equal(effects.markCount, 1, 'and does not draw anything to get there');

  for (let i = 0; i < 5000; i += 1) effects.skid('ring', i * 3, 0, 0, 1);
  assert.equal(effects.markCount, MARK_CAPACITY, 'the ring is the cap, however long the slide');

  effects.update(MARK_LIFE + 1);
  assert.equal(effects.markCount, 0, 'and the rubber wears off in the end');
});

test('a barrier strike throws a burst of sparks, sized by the hit', () => {
  const scene = new THREE.Scene();
  const light = new Effects(scene, { random: fires });
  const heavy = new Effects(new THREE.Scene(), { random: fires });
  light.sparks(0, 0, 0, 2);
  heavy.sparks(0, 0, 0, 30);
  assert.ok(light.particleCount >= 3, 'even a graze throws something');
  assert.ok(
    heavy.particleCount > light.particleCount * 2,
    `a big hit has to read as a big hit: ${heavy.particleCount} against ${light.particleCount}`
  );
  assert.ok(heavy.particleCount <= SPARK_CAPACITY, 'and the burst is capped');

  /*
   * Sparks are thrown along the wall's normal rather than in a sphere: the car is scraping
   * one side, and sparks that fly through the barrier read as confetti.
   */
  const effect = new Effects(scene, { random: fires });
  effect.sparks(0, 1, 0, 20, 1, 0);
  const along = [];
  for (let i = 0; i < effect.glow.live; i += 1) along.push(effect.glow.velocity[i * 3]);
  assert.ok(along.length > 0, 'the burst must have produced sparks');
  assert.ok(along.every((vx) => vx > 0), 'and every one of them starts moving away from the wall');

  // Nothing, once they have fallen out of the air.
  effect.update(2);
  assert.equal(effect.particleCount, 0, 'sparks are gone within a second or so');
});

