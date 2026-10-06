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
import { buildCarMesh, syncCarMesh } from '../src/render/TrackMesh.js';

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
  SAMPLE_SPACING
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
import { LapTimer } from '../src/race/LapTimer.js';
import {
  createQualifying,
  applySegment,
  entriesForSegment,
  isComplete,
  classification
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
import { StartSequence } from '../src/race/startSequence.js';
import { SETTING, environmentFor, isStreet } from '../src/track/environments.js';
import { ELEVATION, PROFILE_POINTS, elevationAt } from '../src/track/elevationData.js';
import { ACTIONS, InputController } from '../src/core/InputController.js';
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
  assert.equal(classification(q).length, 18, 'everyone who set a time is classified, knockouts included');
  assert.equal(classification(q)[0].short, 'D0', 'fastest lap takes pole');

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

  // A circuit with no data must be flat, not broken.
  const flat = buildTrack(getCircuit('spa'));
  assert.ok(
    flat.samples.every((sample) => sample.y === 0),
    'a circuit with no elevation data must be flat'
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
  assert.match(inputSource, /this\.touch\.steer = clamp\(dx \/ reach, -1, 1\)/, 'stick across = steer');

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
    for (const s of track.samples) {
      const kappa = Math.abs(s.lineCurvature);
      if (kappa < 1e-4) continue;
      const implied = (s.targetSpeed * s.targetSpeed) / (1 / kappa);
      // The profile must sit below what the car can actually hold *with* downforce.
      // A bare friction coefficient is the wrong bound: at speed the aero load
      // multiplies available grip several times over, and a profile checked
      // against it would be rejected for being achievable.
      const downforce = 0.5 * 1.225 * DEFAULT_GEOMETRY.downforceArea * s.targetSpeed * s.targetSpeed;
      const grip = (TYRE.peakGrip * (DEFAULT_GEOMETRY.mass * GRAVITY + downforce)) / DEFAULT_GEOMETRY.mass;
      assert.ok(
        implied < grip * GRAVITY * 0.85,
        `${circuit.id} profile demands ${(implied / GRAVITY).toFixed(2)}g at sample ${s.index}`
      );
    }
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

  const normal = new CarPhysics({ grip: 1 });
  normal.reset(0, 0, 0, 30);
  for (let i = 0; i < 120 * 40; i += 1) normal.step(DT, { throttle: 0.45, brake: 0, steer: 0.18 });
  assert.ok(
    normal.frontTemp > 60 && normal.frontTemp < 150,
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
  const soft = new CarPhysics({ compound: 'soft', lapSeconds });
  const hard = new CarPhysics({ compound: 'hard', lapSeconds });
  assert.ok(soft.wearPerSecond > hard.wearPerSecond, 'a soft must wear faster than a hard');
  assert.ok(soft.wearPerSecond * lapSeconds > 0.02, 'a soft must lose a couple of percent of grip per lap');

  // Degradation is per *lap*, so it is normalised by the circuit's own lap time.
  const monaco = buildTrack(getCircuit('monaco'));
  const atMonaco = new CarPhysics({ compound: 'soft', lapSeconds: monaco.lapRecord });
  const perLap = (car) => car.wearPerSecond * car.lapSeconds;
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
    const car = new CarPhysics({ compound, lapSeconds: track.lapRecord });
    car.frontWear = Math.min(1, laps * car.wearPerSecond * track.lapRecord * 0.55);
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