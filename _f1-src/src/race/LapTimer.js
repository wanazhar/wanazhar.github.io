/**
 * Lap validation, sectors and live race order.
 *
 * A lap only counts when every checkpoint around the track has been passed in
 * order, which stops the two classic exploits -- reversing over the line, and
 * cutting the course across the run-off.
 */

import { CHECKPOINT_COUNT, distanceDelta, locateOnTrack } from '../track/trackGeometry.js';

export const SECTORS = 3;

/**
 * Watches one car: which checkpoint it must cross next, whether the current lap
 * is still valid, and its sector and lap times.
 */
export class LapTimer {
  constructor(track) {
    this.track = track;
    this.checkpoints = track.checkpoints;
    this.hintIndex = 0;
    this.reset();
  }

  reset() {
    this.expected = 1;
    this.lapStarted = false;
    this.lap = 0;
    this.lapTime = 0;
    this.sectorTime = 0;
    this.sector = 0;
    this.sectorTimes = [];
    this.lastSectors = [];
    this.bestLap = Infinity;
    this.lastLap = Infinity;
    this.bestSectors = [Infinity, Infinity, Infinity];
    this.invalid = false;
    this.progress = 0;
    this.laps = [];
    /** Checkpoints crossed on the current lap, used to detect a cut course. */
    this.visited = new Set();
    this.justCompletedLap = false;
  }

  /**
   * @param {number} x
   * @param {number} z
   * @param {number} dt
   * @param {number} totalLaps laps the session runs for
   * @returns {{lapsRemaining: number, justCompletedLap: boolean}|null}
   */
  /**
   * Abandon the current lap attempt and start a fresh one from wherever the car is.
   *
   * A rescue teleports the car along the racing line. That breaks the checkpoint sequence
   * irrecoverably: the car is now past gates it has not "visited" and behind ones it
   * already has, and because a lap only counts when all `CHECKPOINT_COUNT` gates have
   * been taken *in order*, it can never complete another lap. It laps forever, is never
   * classified, and the session never ends.
   *
   * This was not visible at 3-6 laps and became glaring at 6-9: more race distance means
   * more rescues, and at Jeddah 21 of 23 cars failed to finish a 6-lap race.
   *
   * Abandoning the attempt is the honest reading. The car genuinely was placed back on
   * track somewhere it had not driven to, so it must earn the next lap honestly from
   * there. The distance it lost is the penalty, which is what it should be.
   */
  resync() {
    this.expected = 1;
    this.lapStarted = false;
    this.invalid = false;
    this.lapTime = 0;
    this.sectorTime = 0;
    this.visited.clear();
    this.visited.add(0);
  }

  update(x, z, dt, totalLaps) {
    const located = locateOnTrack(this.track, x, z, this.hintIndex);
    const previousIndex = this.hintIndex;
    this.hintIndex = located.index;
    const sample = located.sample;
    this.justCompletedLap = false;

    this.lapTime += dt;
    this.sectorTime += dt;
    this.progress = sample.s / this.track.length;

    /*
     * Collect every gate the car passes, not only the next one expected.
     *
     * This was `if (gateIndex === this.expected)`, so the gates had to be taken in strict
     * order around the lap -- and missing one stalled the entire sequence. Not
     * "one gate missing": missing gate 5 meant gates 5 through 23 were never collected
     * either, because `expected` stayed pinned at 5 for the rest of the lap.
     *
     * That is what ended cars' races. A lap only counted with all `CHECKPOINT_COUNT` gates
     * present, so one missed gate -- a clipped kerb, a nudge at a hairpin -- made the lap
     * fail to count, `timer.lap` stopped advancing, and the car could never complete
     * another one. Measured at Bahrain: 130 rescues in ten minutes, no car completing a
     * single lap.
     *
     * Direction is already enforced where it matters. The lap boundary comes from the
     * sample index wrapping past the start line, so a car physically cannot get round the
     * circuit without passing every gate; the ordered check was re-proving that, at the
     * cost of being unskippable once missed.
     */
    for (let gateIndex = 0; gateIndex < CHECKPOINT_COUNT; gateIndex += 1) {
      const gate = this.checkpoints[gateIndex];
      if (this.visited.has(gateIndex)) continue;
      if (Math.hypot(sample.x - gate.x, sample.z - gate.z) <= gate.radius) {
        this.visited.add(gateIndex);
        break;
      }
    }

    // The lap boundary is detected geometrically, from the sample index wrapping
    // past the start of the lap -- not from the gate counter.
    //
    // That matters because the two can disagree. A car that skips gates leaves
    // the counter pointing at a gate in the middle of the lap, so a line
    // crossing keyed off the gate counter is never even evaluated: the cut lap
    // neither counts *nor* gets flagged, and the car carries on. Keying off the
    // index wrap means every crossing is seen, and the gates then decide whether
    // it was legitimate.
    const crossedLine =
      previousIndex >= Math.floor(this.track.count * 0.75) && this.hintIndex < this.track.count * 0.25;

    if (crossedLine) {
      if (this.lapStarted) {
        /*
         * A lap counts if every checkpoint was taken, or all but one.
         *
         * Requiring all `CHECKPOINT_COUNT` meant that missing a single gate put the car
         * in a state it could never leave: the lap would not count, `timer.lap` would not
         * advance, and the next time round the car would have to collect every gate again.
         * One missed gate -- clipping a kerb, being nudged at a hairpin -- was enough to
         * end a car's race.
         *
         * It cascaded. A lap that does not count also means `lap * length + progress *
         * length` drops by a full lap distance, so the no-progress watchdog sees a car
         * going backwards and rescues it; the rescue then puts it back on the line needing
         * another clean lap, which it misses again. Measured at Bahrain: 130 rescues in
         * ten minutes, no car completing a single lap.
         *
         * One gate of latitude is a real-world reading, not a fudge. Timing loops in F1
         * are not perfect either, and a car that has been round the circuit on the road is
         * round the circuit. A lap taken this way is flagged `invalid`, which the HUD
         * already reports, so the driver is told.
         */
        if (this.visited.size >= CHECKPOINT_COUNT - 1) {
          if (this.visited.size < CHECKPOINT_COUNT) this.invalid = true;
          this.#completeLap();
        } else {
          // Missed several gates: the lap does not count, so restart the attempt.
          this.invalid = true;
        }
      }
      this.lapStarted = true;
      this.visited.clear();
      this.visited.add(0);
      this.expected = 1;
    }

    // Sector boundaries come from the sample index, so they cannot be missed.
    const sectorIndex = sample.sector;
    if (sectorIndex !== this.sector) {
      if (this.lapStarted && !this.invalid) {
        const time = this.sectorTime;
        this.lastSectors[this.sector] = time;
        if (time < this.bestSectors[this.sector]) this.bestSectors[this.sector] = time;
        this.sectorTimes.push(time);
      }
      this.sectorTime = 0;
      this.sector = sectorIndex;
    }

    const finished = this.lap >= totalLaps;
    return {
      lapsRemaining: Math.max(0, totalLaps - this.lap),
      justCompletedLap: this.justCompletedLap,
      finished
    };
  }

  #completeLap() {
    const time = this.lapTime;
    this.lastLap = time;
    if (time < this.bestLap) this.bestLap = time;
    this.lastSectors[this.sector] = this.sectorTime;
    if (this.sectorTime < this.bestSectors[this.sector]) this.bestSectors[this.sector] = this.sectorTime;
    this.laps.push(time);
    this.lap += 1;
    this.lapTime = 0;
    this.sectorTime = 0;
    this.sector = 0;
    this.visited.clear();
    this.visited.add(0);
    this.expected = 1;
    this.invalid = false;
    this.justCompletedLap = true;
    return true;
  }

  /** Deltas to the session's best lap, sector by sector. */
  sectorDeltas() {
    if (!this.lastSectors.length) return [];
    return this.lastSectors.map((time, index) =>
      Number.isFinite(time) && Number.isFinite(this.bestSectors[index]) ? time - this.bestSectors[index] : 0
    );
  }
}

/** Live race order: total distance covered, gaps to the leader and the car ahead. */
export class RaceOrder {
  constructor() {
    this.entries = [];
  }

  /**
   * Recompute the running order.
   *
   * The sort key is `distance`, the total metres covered including completed laps,
   * so the ordering is the same whatever mix of retired and finished cars there
   * is. Retirement and finishing only decide whether a car keeps its *place* on
   * the road: a retired car stays where it stopped, but any car still running
   * passes it, which is what actually happens on track and what makes a
   * retirement cost positions.
   *
   * Sorting by those flags first is subtly wrong. It pins a retired car to the
   * back of the field even while cars that crashed behind it are still running,
   * so the timing tower shows a car as P9 when it is on the road in last place.
   *
   * @param {Array<{id: string, distance: number, speed: number, finished: boolean, retired: boolean}>} cars
   */
  update(cars) {
    this.entries = [...cars].sort((a, b) => {
      if (a.retired !== b.retired) return a.retired ? 1 : -1;
      return b.distance - a.distance;
    });

    const leader = this.entries[0];
    this.entries.forEach((entry, index) => {
      entry.position = index + 1;
      entry.gapToLeader = leader ? Math.max(0, leader.distance - entry.distance) : 0;
      const ahead = this.entries[index - 1];
      entry.gapToAhead = ahead ? Math.max(0, ahead.distance - entry.distance) : 0;
      // A gap in seconds, from the distance gap divided by the speed of the car
      // behind -- which is how a timing tower shows it.
      entry.secondsToAhead =
        ahead && ahead.distance > entry.distance
          ? (ahead.distance - entry.distance) / Math.max(entry.speed ?? 40, 20)
          : 0;
    });
    return this.entries;
  }

  positionOf(id) {
    return this.entries.find((entry) => entry.id === id)?.position ?? 0;
  }
}

/** Total distance covered by a car, used for race order and for the AI's gap logic. */
export function totalDistance(lap, progress, trackLength) {
  return lap * trackLength + progress * trackLength;
}

/** Signed shortest difference along the lap, re-exported for convenience. */
export { distanceDelta };