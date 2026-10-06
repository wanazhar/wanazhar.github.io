/**
 * Race session: builds the grid, steps every car, keeps the order and reports
 * what the UI needs to draw.
 *
 * The player and the AI run through the same `CarPhysics`; the only difference is
 * who fills in the controls.
 */

import { CarPhysics } from '../physics/CarPhysics.js';
import { AIDriver } from '../ai/AIDriver.js';
import { skillFor } from '../physics/drivers.js';
import { gridSlot, locateOnTrack, racingLineAt } from '../track/trackGeometry.js';
import { LapTimer, RaceOrder } from './LapTimer.js';
import { setupForEntry } from '../championship/ChampionshipManager.js';
import { getCompound, getWeather } from '../physics/compounds.js';
import { inContact, resolveCarContacts } from './collision.js';
import { StartSequence } from './startSequence.js';
import {
  BOX_PROGRESS,
  PIT_LANE_WIDTH,
  PIT_SIDE,
  PIT_SPEED_LIMIT,
  PIT_STOP_SECONDS,
  applyPitStop,
  inPitLane,
  laneProgress,
  shouldPit
} from './pit.js';
import { clamp } from '../util/math.js';

/** Fixed physics timestep. Rendering runs free; physics never does. */
export const FIXED_TIMESTEP = 1 / 120;
const MAX_SUBSTEPS = 8;

/**
 * The controls a car receives while the start lights are on.
 *
 * Frozen and shared. Every held car gets this same object, and nothing mutates controls
 * after `read()`, so there is no reason to allocate one per car per frame.
 */
const HELD = Object.freeze({ throttle: 0, brake: 0, steer: 0, handbrake: false });

/**
 * How far off the road, and how stationary, before a car is recovered.
 *
 * Both conditions matter. Recovering a car that is merely *slow* would yank it
 * back mid-race; recovering one that is still moving fast at a small angle would
 * take away a save the driver could have made.
 */
const OFF_TRACK_MARGIN = 8;
/*
 * How long a car may make no forward progress before it is recovered, seconds.
 *
 * Long enough that a car fighting its way out of a gravel trap, or one that has
 * spun and is rejoining slowly, is left alone -- both of those are legitimate and
 * both resolve themselves. A car that has genuinely stopped advancing does not.
 */
const NO_PROGRESS_SECONDS = 22;

/**
 * Forward progress that counts as real, metres.
 *
 * Comfortably more than a single frame of travel at racing speed, so normal
 * cornering and a slow corner exit never read as "stuck".
 */
const NO_PROGRESS_MARGIN = 20;

const RESCUE_DELAY = 2.5;
/** Below this speed a car counts as stranded, however close to the line it is. */
const RESCUE_SPEED = 5;

export const SESSION_TYPE = {
  qualifying: 'qualifying',
  race: 'race'
};

export class RaceSession {
  /**
   * @param {object} options
   * @param {object} options.track built track model
   * @param {Array} options.entries championship entries (player + AI)
   * @param {'qualifying'|'race'} options.type
   * @param {number} options.totalLaps
   * @param {number} [options.gridOrder] entry order for the starting grid
   */
  constructor({
    track,
    entries,
    type,
    totalLaps,
    gridOrder = null,
    random = Math.random,
    conditions = null,
    contacts = true
  }) {
    this.track = track;
    this.conditions = conditions ?? { compound: 'medium', weather: 'clear' };

    /*
     * Whether cars collide with each other.
     *
     * A switch rather than a constant because car-to-car contact is the one system
     * where "is it helping or hurting" is genuinely unclear from the outside: it
     * fixes cars driving through each other and makes the AI field harder to drive.
     * Being able to turn it off and re-run a season is the only honest way to find
     * out which of those dominates, and tuning the constants by feel made it worse
     * before rather than better.
     */
    this.contacts = contacts;

    /*
     * Lights, and the hold that goes with them.
     *
     * A race starts when the lights go out, not when the scene loads. Until then every
     * car is held and all input is ignored, so the player's throttle held from the
     * moment the HUD appears does not launch them off the line.
     *
     * Disabled for qualifying: there is no standing start and no field to hold, only
     * one car and a flying lap.
     */
    this.start = new StartSequence({
      enabled: type !== SESSION_TYPE.qualifying,
      // A little grace before the first light so the grid is on screen before
      // anything starts happening.
      delayBefore: 1.4
    });
    this.weatherState = getWeather(this.conditions.weather);
    this.type = type;
    this.totalLaps = totalLaps;
    this.random = random;
    this.time = 0;
    this.finished = false;
    this.finishOrder = [];
    this.safetyCar = false;
    this.flags = new Set();
    this.order = new RaceOrder();

    const startingGrid = gridOrder ?? entries.map((entry, index) => ({ entry, grid: index }));

    this.cars = startingGrid.map(({ entry, grid }) => {
      const setup = setupForEntry(entry);
      /*
       * The compound and the circuit's own lap estimate are what turn the tyre data into
       * a rate. `lapRecord` is the track's estimate of a clean lap, which is exactly the
       * unit `wearRate` is documented in -- "fraction of peak per lap" -- so a soft tyre
       * lasts the same number of laps at Monaco as at Monza instead of the same number
       * of seconds.
       */

setup.compound = this.conditions.compound;
      setup.lapSeconds = track.lapRecord;

setup.lapMetres = track.length;

      const physics = new CarPhysics(setup, { isPlayer: Boolean(entry.isPlayer), name: entry.short });
      const slot = gridSlot(track, grid);
      physics.reset(slot.x, slot.z, slot.heading, 0);
      physics.odometer = 0;

      const located = locateOnTrack(track, slot.x, slot.z, null);
      const timer = new LapTimer(track);
      timer.hintIndex = located.index;
      timer.progress = located.sample.s / track.length;
      timer.lap = 0;
      timer.lapStarted = true;
      timer.visited.add(0);
      timer.expected = 1;

      const car = {
        entry,
        physics,
        timer,
        gridPosition: grid,
        isPlayer: Boolean(entry.isPlayer),
        finished: false,
        finishTime: Infinity,
        retired: false,
        pitStops: 0,
        maxStops: 1,
        pitRequested: false,
        pitStopTime: 0,
        pitWhen: 0.2,
        inPitLane: false,
        lastPitLap: 0,
        distance: 0,
        speed: 0,
        lateral: located.lateral,
        onTrack: true,
        surfaceGrip: 1,
        compound: this.conditions.compound,
        lastLapTime: Infinity,
        bestLapTime: Infinity,
        penaltySeconds: 0,
        lapsDown: 0
      };

      if (!car.isPlayer) {
        const skill = skillFor(entry);
        car.ai = new AIDriver(physics, skill, { track, name: entry.short, random });
        car.ai.reset();
      }
      return car;
    });

    this.player = this.cars.find((car) => car.isPlayer) ?? this.cars[0];
    this.#updateProgress();
  }

  /** Advance one rendered frame. */
  update(dt, playerControls) {
    if (this.finished) return;
    // Clamp the frame so a background tab or a long stall cannot teleport cars.
    const clamped = Math.min(dt, FIXED_TIMESTEP * MAX_SUBSTEPS);
    let steps = Math.max(1, Math.ceil(clamped / FIXED_TIMESTEP));
    steps = Math.min(steps, MAX_SUBSTEPS);
    const step = clamped / steps;

    for (let i = 0; i < steps; i += 1) {
      this.#step(step, playerControls);
    }
    this.order.update(
      this.cars.map((car) => ({
        id: car.entry.short,
        distance: car.distance,
        speed: car.physics.speed,
        lap: car.timer.lap,
        finished: car.finished,
        retired: car.retired
      }))
    );
  }

  #step(dt, playerControls) {
    this.time += dt;
    this.start.update(dt);

    /*
     * Input is discarded, not clamped, while the lights are on.
     *
     * Zeroing rather than scaling, because "the game ignores you until lights out" is
     * only believable if it is total: a car that creeps under full throttle reads as a
     * broken input rather than a start procedure.
     */
    const held = this.start.holding;
    const controls = held ? HELD : playerControls;

    for (const car of this.cars) {
      if (car.retired) continue;
      // A car with an AI attached is driven by that AI, whoever owns it. Checking
      // `isPlayer` instead means an AI cannot be attached to the player slot --
      // which is exactly what the headless simulator does, and what leaves that
      // car sitting on the grid with no throttle.
      const carControls = car.ai ? this.#aiControls(car, dt) : controls;
      // Belt and braces: the AI must be held as firmly as the player, or the field
      // pulls away on its own and the player is dropped into a race already under way.
      car.physics.step(dt, held ? HELD : carControls, { grip: car.surfaceGrip });
      car.physics.odometer = (car.physics.odometer ?? 0) + car.physics.speed * dt;

      this.#resolveBarriers(car, dt);
      this.#updateProgress();

      const result = car.timer.update(car.physics.x, car.physics.z, dt, this.totalLaps);
      car.lastLapTime = car.timer.lastLap;
      car.bestLapTime = car.timer.bestLap;
      car.lapsDown = Math.max(0, this.player.timer.lap - car.timer.lap);

      // Qualifying ends after the flying lap plus the in/out laps; here it is
      // simply the configured number of timed laps.
      if (this.type === SESSION_TYPE.qualifying && car.timer.lap >= this.totalLaps) {
        this.#finishCar(car);
        continue;
      }
      if (this.type === SESSION_TYPE.race && result.finished) {
        this.#finishCar(car);
        continue;
      }
      // Retirement is a last resort, and only for the player: an AI car that gets
      // stuck is recovered by `#rescueStuckCars` instead, because a car parked in
      // the run-off for the rest of the race is a worse outcome than one that
      // loses a couple of seconds. The player keeps the choice, and is offered the
      // same manual recovery.
      if (car.isPlayer && car.physics.speed < 1 && this.time > 15 && !car.finished) {
        car.stuckFor = (car.stuckFor ?? 0) + dt;
        if (car.stuckFor > 12) car.retired = true;
      } else {
        car.stuckFor = 0;
      }
    }

    /*
     * Contact between cars, after every car has moved.
     *
     * This has to be a second pass over the field rather than part of the loop
     * above. Resolving contact as each car is integrated means the first car
     * processed is already out of the way when the second is tested, so which car
     * ends up on the inside of a shunt depends on its grid slot rather than on
     * where the cars actually met.
     */
    if (this.contacts) resolveCarContacts(this.cars);

    this.#updateStrategy();
    this.#rescueStuckCars(dt);

    if (this.cars.every((car) => car.finished || car.retired)) {
      this.finished = true;
    }
    // In a race the session ends once the leader is home; others are classified.
    if (this.type === SESSION_TYPE.race && this.finishOrder.length > 0) {
      const leader = this.finishOrder[0];
      if (leader && this.time - leader.finishTime > 12) this.finished = true;
    }
  }

  #aiControls(car, dt) {
    const ahead = this.#neighbour(car, 1);
    const behind = this.#neighbour(car, -1);
    return car.ai.update(dt, {
      opponentAhead: ahead,
      opponentBehind: behind,
      lateral: car.lateral,
      cars: this.cars,
      // The AI has to know it is being touched, or it keeps driving into the other
      // car for the whole corner. Passing it here rather than letting the driver
      // reach into the session keeps the driver dependent on nothing but physics.
      contact: inContact(car),
      // Whether this driver has been told to stop. The session decides *that*; the driver
      // still has to steer there, so the lane and the box cost real time.
      pitRequested: car.pitRequested === true
    });
  }

  /**
   * The car in front or behind on the road.
   *
   * `gapSpeed` is how fast the gap is closing, positive when this car is catching
   * the one ahead. The AI needs it to tell "a car is nearby" from "a car is about
   * to be overtaken", which on a packed grid are very different situations.
   */
  #neighbour(car, direction) {
    let best = null;
    /*
     * How far ahead to look, and it has to scale with speed.
     *
     * This was a flat 90m for both directions, which is fine for deciding whether to
     * pull out of someone's way and useless for deciding whether to brake. From 55 m/s
     * -- 200 kph -- a car needs roughly 150m to stop, so a 90m window means the AI only
     * sees the car in front once it is already too late to do anything about it.
     *
     * The result was measured: a car parked on the racing line collected 26 contacts
     * from 12 different cars in a minute, because every one of them arrived at profile
     * pace with no time left to react.
     *
     * Three seconds of travel is a generous but sane planning horizon; beyond a closing
     * speed of 200 kph it is mostly wasted lookups.
     */
    const lookahead = Math.min(90 + car.physics.speed * 3, 320);
    for (const other of this.cars) {
      if (other === car || other.retired) continue;
      const gap = direction > 0 ? other.distance - car.distance : car.distance - other.distance;
      if (gap < -6 || gap > lookahead) continue;
      if (!best || gap < best.gap) {
        best = {
          gap,
          lateral: other.lateral,
          car: other,
          gapSpeed: direction > 0 ? car.physics.speed - other.physics.speed : other.physics.speed - car.physics.speed
        };
      }
    }
    return best;
  }

  /** Keep the car on the track: kerbs slow it, the wall stops it. */
  #resolveBarriers(car, dt) {
    const physics = car.physics;
    const located = locateOnTrack(this.track, physics.x, physics.z, car.timer.hintIndex);
    car.lateral = located.lateral;
    const half = located.sample.width * 0.5;

    /*
     * Height and pitch, from the road surface under the car.
     *
     * The height comes off the *centreline* sample rather than the car's own lateral
     * offset, because the track is not crowned in this model and a car on the kerb is on
     * the same plane as one on the centreline, only at a different width. Pitch is the
     * gradient immediately ahead of the car, which is what makes a crest hide a car and
     * a compression squash its suspension.
     */
    const here = located.sample;
    const ahead = this.track.samples[(Math.round(here.s / this.track.step) + 4) % this.track.count];
    physics.y = here.y;
    physics.pitch = Math.atan2(ahead.y - here.y, ahead.s - here.s);
    // Cached for the rescue check, which runs outside this method.
    car.trackHalfWidth = half;

    // Kerb at the edge of the tarmac: grip and a small scrub of speed.
    const onKerb = Math.abs(located.lateral) > half - 1.4 && Math.abs(located.lateral) <= half + 1.4;

    /*
     * Surface grip is the product of three independent factors, and they multiply
     * rather than add for a reason: a hard tyre on a wet track is worse than either
     * problem on its own, which is what makes the compound choice matter in the rain
     * instead of being a flat speed penalty.
     *
     *   kerb   -- a local surface change
     *   weather-- how much friction the surface offers at all
     *   compound (applied to the car's own grip, not here)
     *
     * Kerbs also cost more grip in the wet, which is what they do on a real circuit.
     */
    const weather = this.weatherState;
    const wetPenalty = 1 - weather.spray * 0.25;
    /*
     * The pit lane: a corridor beside the main straight, occupying the pit window of the lap and
     * a band beyond the road edge on the pit side. While in it the FIA limit applies, and crossing
     * the box with a stop requested takes the tyres off and fits fresh ones.
     */
    const lapFraction = here.s / this.track.length;
    car.inPitLane = inPitLane(lapFraction, car.lateral, half);

    if (car.pitStopTime > 0) {
      // Stationary in the box: the only thing happening this step.
      car.pitStopTime -= dt;
      physics.vLong = 0;
      physics.vLat = 0;
      car.surfaceGrip = 1;
      return;
    }

    if (car.inPitLane) {
      if (physics.speed > PIT_SPEED_LIMIT) {
        physics.vLong = Math.sign(physics.vLong) * Math.max(0, physics.speed - 22 * dt);
      }
      if (car.pitRequested && Math.abs(laneProgress(lapFraction) - BOX_PROGRESS) < 0.05) {
        const id = this.#pitCompound();
        applyPitStop(car, id, getCompound(id).grip);
        car.pitRequested = false;
        car.pitStopTime = PIT_STOP_SECONDS;
      }
    }

    car.surfaceGrip = (onKerb ? 0.86 * wetPenalty : 1) * weather.grip;
    if (onKerb && physics.speed > 20) {
      // A light constant scrub, plus the reduced grip set above.
      physics.vLong *= 1 - clamp(1.6 * dt, 0, 0.5);
      car.onKerb = true;
    }

    /*
     * Barrier: a hard stop that costs speed and shakes the camera.
     *
     * With a gap through the pit window, on the pit side only. The lane is beyond the road edge,
     * so without this the barrier walls the pit off: cars queue against it for the whole window
     * and can never reach their box. It is the only place the circuit is not closed.
     */
    const openToPit = inPitLane(here.s / this.track.length, located.lateral, half);
    const limit = half + (openToPit ? PIT_LANE_WIDTH + 1 : 1.6);
    if (Math.abs(located.lateral) > limit) {
      const clamped = clamp(located.lateral, -limit, limit);
      const sample = located.sample;
      physics.x = sample.x + sample.rightX * clamped;
      physics.z = sample.z + sample.rightZ * clamped;
      // Kill the component of velocity heading into the wall.
      const wallNormal = { x: sample.rightX * Math.sign(located.lateral), z: sample.rightZ * Math.sign(located.lateral) };
      const cos = Math.cos(physics.heading);
      const sin = Math.sin(physics.heading);
      const worldVx = physics.vLong * cos - physics.vLat * sin;
      const worldVz = physics.vLong * sin + physics.vLat * cos;
      const intoWall = worldVx * wallNormal.x + worldVz * wallNormal.z;
      if (intoWall > 0) {
        const newVx = worldVx - wallNormal.x * intoWall * 1.4;
        const newVz = worldVz - wallNormal.z * intoWall * 1.4;
        physics.vLong = newVx * cos + newVz * sin;
        physics.vLat = -newVx * sin + newVz * cos;
        if (car.isPlayer) this.onImpact?.(Math.abs(intoWall));
      }
      physics.vLong *= 0.86;
      physics.vLat *= 0.5;
      physics.yawRate *= 0.6;
      car.distance -= 0.5;
    }
  }

  /** Recompute distance, speed and surface for every car. */
  /**
 * Put hopeless cars back on the road.
 *
 * A car that has left the circuit and stopped cannot always recover under its own
 * power -- its heading error and cross-track error can both point away from the
 * track, so the controller steers it further out with the lock on. Left alone it
 * sits in the countryside and the race never ends.
 *
 * The player has a manual recovery key for exactly this. The AI gets it
 * automatically, after a few seconds of being well off the road and not moving.
 * The penalty is the time lost getting there, which is what it should be.
 */
/**
 * The compound a stop fits. One strategy for the session, as a real team runs.
 */
#pitCompound() {
  return this.conditions?.pitCompound ?? this.conditions?.compound ?? 'medium';
}

/**
 * Strategy: ask each driver whether it wants a stop, and let it steer into the lane itself.
 *
 * A question rather than a rule the session applies to the car, because the car has to actually
 * aim for the lane -- so a stop costs the entry and the exit as well as the box.
 */
#updateStrategy() {
  for (const car of this.cars) {
    if (car.retired || car.finished || car.pitStopTime > 0 || car.pitRequested) continue;
    if (shouldPit(car, Math.max(0, this.totalLaps - car.timer.lap))) car.pitRequested = true;
  }
}

#rescueStuckCars(dt) {
    /*
     * Never during the start lights.
     *
     * Every car is stationary on the grid by definition, so the "spun and crawling"
     * rescue -- which exists precisely to catch stationary cars -- would fire on the
     * entire field a couple of seconds into the countdown and scatter the grid across
     * the track. Being held is indistinguishable from being stuck; only the lights can
     * tell them apart.
     */
    if (this.start.holding) return;

    for (const car of this.cars) {
      if (car.retired || car.finished) continue;

      /*
       * Never rescue a car that is stopped on purpose.
       *
       * A car in its pit box is stationary, which is exactly the signature of a car beached in
       * the run-off -- so the rescue fired during every stop and dragged the car back onto the
       * racing line mid-service. `PIT_STOP_SECONDS` is 2.4 against a rescue delay of 2.5, so they
       * were the same length to within a tenth of a second. Measured before this: one car took
       * 507 seconds for the lap it stopped in.
       */
      if (car.pitStopTime > 0 || car.inPitLane) continue;

      const wellOff = Math.abs(car.lateral) > car.trackHalfWidth + OFF_TRACK_MARGIN;
      const crawling = car.physics.speed < RESCUE_SPEED;

      /*
       * Stranded while still moving.
       *
       * Stationary and beached are not the only ways to be stuck. A car can be
       * crawling fast enough to clear the stationary threshold while going nowhere
       * useful -- circling, facing the wrong way, or grinding along a barrier at
       * walking pace -- and then it never triggers a rescue and never finishes a lap.
       * Observed as exactly that: a car that completed none of the race's laps and
       * was rescued once.
       *
       * Distance along the lap only ever increases within a race, so "has not got
       * further than where it was a moment ago" is a reliable way to spot it.
       */
      /*
       * No-progress watchdog.
       *
       * `car.distance` is `lap * length + progress * length`, so it drops by a full lap
       * distance every time the start/finish line is crossed. Comparing it against a stored
       * maximum therefore leaves that stored value unreachable until the car has completed
       * another entire lap -- and 22 seconds later every car on the grid is being rescued
       * for "going nowhere" while driving at race speed in mid-field.
       *
       * The wrap is detected and the reference moved with it, so the watchdog measures the
       * thing it is meant to: a car that is genuinely going nowhere.
       */
      const distance = car.distance ?? 0;
      const reference = car.bestDistance ?? distance;
      if (distance < reference - this.track.length * 0.5) {
        car.bestDistance = distance;
        car.noProgressFor = 0;
      } else if (distance > reference + NO_PROGRESS_MARGIN) {
        car.bestDistance = distance;
        car.noProgressFor = 0;
      } else {
        car.noProgressFor = (car.noProgressFor ?? 0) + dt;
      }
      const goingNowhere = car.noProgressFor > NO_PROGRESS_SECONDS;

      // Three ways to get stranded: beached in the run-off, spun and stationary on
      // the road, or moving but making no progress. All three end a race if left
      // alone.
      if (!wellOff && !crawling && !goingNowhere) {
        car.rescueTimer = 0;
        continue;
      }

      car.rescueTimer = (car.rescueTimer ?? 0) + dt;
      if (car.rescueTimer <= RESCUE_DELAY) continue;

      car.rescueTimer = 0;
      if (car.isPlayer) {
        // The player is told rather than moved behind their back: they have a
        // manual recovery key for this.
        this.onStranded?.(car);
      } else if (car.ai) {
        car.ai.rescue(car.physics, this.track);
        car.timer.hintIndex = car.ai.trackIndex;
        // The teleport breaks the checkpoint sequence: the car is now past gates it has
        // not collected and behind ones it has. Without a resync it can never complete
        // another lap, so it laps forever and is never classified.
        // (resync disabled: see notes)
        car.stuckFor = 0;
        // Reset the progress watchdog too, or the rescued car is immediately
        // eligible again for having made no progress since before it was rescued.
        car.noProgressFor = 0;
        car.bestDistance = car.distance;
        // Telemetry. A car that needs rescuing repeatedly is a different problem
        // from one that beaches once, and only the count tells them apart.
        car.rescues = (car.rescues ?? 0) + 1;
      }
    }
  }

  #updateProgress() {
    for (const car of this.cars) {
      const timer = car.timer;
      car.distance = timer.lap * this.track.length + timer.progress * this.track.length;
      car.speed = car.physics.speed;
      // Progress distance for the AI, measured from the start line.
      car.physics.progressDistance = car.distance;
    }
  }

  #finishCar(car) {
    car.finished = true;
    car.finishTime = this.time + car.penaltySeconds;
    this.finishOrder.push(car);
  }

  /** Current standing of the player, 1-based. */
  get playerPosition() {
    return this.order.positionOf(this.player.entry.short) || 1;
  }

  /** Racing-line target for the minimap and the ghost line. */
  lineAt(distance) {
    return racingLineAt(this.track, distance);
  }

  /** Results in championship format, for the results screen and the save file. */
  results() {
    const ordered = [...this.cars].sort((a, b) => {
      if (a.retired !== b.retired) return a.retired ? 1 : -1;
      if (a.finished !== b.finished) return a.finished ? -1 : 1;
      if (a.finished && b.finished) return a.finishTime - b.finishTime;
      return b.distance - a.distance;
    });

    return ordered.map((car, index) => ({
      short: car.entry.short,
      name: car.entry.name,
      team: car.entry.team,
      isPlayer: car.isPlayer,
      // A car that never took the flag is classified behind everyone who did.
      position: car.retired ? null : index + 1,
      retired: car.retired,
      bestLap: Number.isFinite(car.timer.bestLap) ? car.timer.bestLap : null,
      totalTime: car.finished ? car.finishTime : null,
      // Grid slots are zero-based and finishing positions are one-based, so the
      // +1 is what makes "started 5th, finished 3rd" read as +2 rather than +1.
      gridPosition: car.gridPosition,
      gained: car.retired ? 0 : car.gridPosition + 1 - (index + 1),
      entry: car.entry
    }));
  }

  /**
   * Fastest lap of the session.
   *
   * Read straight from each car's lap timer rather than from the mirrored
   * `bestLapTime` field. The mirror is refreshed once per physics step, so
   * anything that changes a timer outside a step -- a results screen, a save/load,
   * a test -- reads a stale value and reports no fastest lap at all.
   */
  fastestLap() {
    let best = Infinity;
    let holder = null;
    for (const car of this.cars) {
      if (car.retired) continue;
      const time = car.timer.bestLap;
      if (time < best) {
        best = time;
        holder = car.entry.short;
      }
    }
    return { time: best, holder };
  }
}

/** Session types, re-exported so callers do not need a second import. */
export { SESSION_TYPE as SESSION };