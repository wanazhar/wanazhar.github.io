/**
 * Pit stops.
 *
 * `car.pitStop` used to be a boolean that was initialised and never read: there was no lane, no
 * box, no tyre change, and a race simply ran to the flag. With compounds and degradation finally
 * reaching the car (#30), a stop can be a decision rather than a lap-count animation.
 *
 * The lane
 * ---------
 * Modelled as a corridor beside the main straight, in the same `(lap fraction, lateral)` space
 * the race already tracks. A car is in the lane when it is within the pit window of the lap *and*
 * is beyond the road edge on the pit side, within the lane's width.
 *
 * A separate polyline would be more honest about shape, and would immediately need to agree with
 * the centreline about where the track is -- which is precisely the thing this avoids.
 *
 * Sign convention
 * ---------------
 * `lateral` is positive to the right of the centreline: it is the projection of the car's offset
 * onto the sample's `rightX`/`rightZ` pair, and the AI steers by aiming at
 * `sample.x + sample.rightX * lineOffset`, so a negative `lineOffset` *is* a negative `lateral`.
 *
 * `PIT_SIDE` therefore names which side the lane is on in those same terms, and distance into the
 * lane is `PIT_SIDE * lateral - halfWidth`. This was originally written as
 * `(lateral - PIT_SIDE * halfWidth) * -PIT_SIDE`, which is algebraically the same expression but
 * evaluates to `lateral + halfWidth` when `PIT_SIDE` is -1 -- true for nearly the whole width of
 * the road and false for the actual lane. Every car was "in the pit lane" while racing on the
 * circuit, which applied the 80 km/h limit on track and meant none of them ever reached the box.
 */

/** Where the lane sits in the lap: entry before the line, exit after it. */
export const PIT_WINDOW_START = 0.955;
export const PIT_WINDOW_END = 0.045;

/** Metres beyond the road edge that the lane occupies. */
export const PIT_LANE_WIDTH = 12;

/** FIA pit lane speed limit, 80 km/h. */
export const PIT_SPEED_LIMIT = 80 / 3.6;

/** Stationary time in the box. Real F1 is about 2.5s. */
export const PIT_STOP_SECONDS = 2.4;

/** Which side of the track the lane is on, in the track's lateral convention. */
export const PIT_SIDE = -1;

/** Where in the lane the box sits, 0 at entry and 1 at exit. */
export const BOX_PROGRESS = 0.3;

/**
 * Is this car in the pit lane?
 *
 * @param {number} lapFraction 0..1 around the lap
 * @param {number} lateral metres from the centreline, signed
 * @param {number} halfWidth half the road width here
 */
export function inPitLane(lapFraction, lateral, halfWidth) {
  const fraction = ((lapFraction % 1) + 1) % 1;
  // The window wraps the line, so it is two ranges rather than one.
  if (fraction < PIT_WINDOW_START && fraction > PIT_WINDOW_END) return false;
  const beyond = PIT_SIDE * lateral - halfWidth;
  return beyond > 0 && beyond <= PIT_LANE_WIDTH;
}

/** How far through the lane a car is: 0 at entry, 1 at exit. */
export function laneProgress(lapFraction) {
  const fraction = ((lapFraction % 1) + 1) % 1;
  const span = 1 - PIT_WINDOW_START + PIT_WINDOW_END;
  if (fraction >= PIT_WINDOW_START) return (fraction - PIT_WINDOW_START) / span;
  return (1 - PIT_WINDOW_START + fraction) / span;
}

/**
 * Should this driver stop?
 *
 * A readable rule rather than a lap-time model, because a clever one would be harder to reason
 * about and no more correct at this fidelity:
 *
 *   - the tyre is past the point where the compound's remaining grip is worth losing, and
 *   - there is enough race left for a fresh tyre to pay for the stop.
 *
 * The second condition is what stops a car pitting on the final lap, which is the classic way a
 * naive strategy model embarrasses itself.
 */
export function shouldPit(car, lapsRemaining) {
  if (!car || car.finished || car.retired) return false;
  if ((car.pitStops ?? 0) >= (car.maxStops ?? 1)) return false;
  if (lapsRemaining <= 1) return false;
  const wear = Math.max(car.physics.frontWear, car.physics.rearWear);
  return wear >= (car.pitWhen ?? 0.2);
}

/**
 * Take a stop: fresh rubber, warm rather than cold.
 *
 * A tyre out of the pit is not at ambient, and modelling that is the difference between a stop
 * that costs time and one that costs time *and* grip for a stint.
 */
export function applyPitStop(car, compoundId, compoundGrip) {
  car.physics.applyCompound(compoundId, compoundGrip);
  car.pitStops = (car.pitStops ?? 0) + 1;
  car.pitStopTime = 0;
  car.lastPitLap = car.timer?.lap ?? 0;
}