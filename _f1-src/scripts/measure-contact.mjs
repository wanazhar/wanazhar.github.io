/**
 * Car-to-car contact, split by geometry.
 *
 * ## Why the split
 *
 * Measuring only *how much* contact a car has says something is wrong without saying what.
 * The median car here spends 13-18% of a race in contact, against single-digit seconds in real
 * F1, and that is why race results are incident-dominated rather than pace-dominated -- the
 * fastest car at Bahrain lapped 16.4s quicker than the median and finished fifth.
 *
 * But "too much contact" splits into at least two faults with opposite fixes:
 *
 *   - **longitudinal** (nose to tail): the follower keeps closing on a car it cannot pass.
 *     The fix is the follow logic -- a closing-rate limit.
 *   - **lateral** (side by side): cars overlap while racing each other, which is *supposed* to
 *     happen, and fixing it by slowing cars down would make the racing worse.
 *
 * Those two look identical in a total and need opposite remedies, so this measures them
 * separately. The first thing tried here was the longitudinal hypothesis -- the follow margin
 * bottomed out at 2 m/s *faster* than the car ahead, which sounds small and at racing speed is a
 * persistent closing rate. Removing that floor made contact worse (Monza median 231s to 317s),
 * because matching the leader's speed exactly parks the follower on its gearbox. So the closing
 * rate is not the cause, and this script is what establishes where it actually is.
 *
 * ## Classification
 *
 * For each touching pair, the separation is taken in the *struck* car's own frame:
 *
 *   longitudinal = component along the car's heading
 *   lateral      = component across it
 *
 * and compared against the car's half-extents (2.6m long, 1.0m wide). Whichever axis is more
 * deeply overlapped is the one that is touching:
 *
 *   lateral  dominant -> side by side, the two normal racing case
 *   longitudinal dominant -> nose to tail, following too closely
 *
 * Measured from positions and headings, so it does not depend on anything inside `collision.js`
 * beyond the `touching` flag the session already publishes.
 */

import { installCanvasShim } from './helpers/domShim.mjs';

installCanvasShim();

const tg = await import('../src/track/trackGeometry.js');
const circ = await import('../src/track/circuits.js');
const rs = await import('../src/race/RaceSession.js');
const cm = await import('../src/championship/ChampionshipManager.js');
const drv = await import('../src/physics/drivers.js');
const { AIDriver } = await import('../src/ai/AIDriver.js');
const { createRandom } = await import('../src/util/math.js');

/** Half-extents, from `race/collision.js`. */
const HALF_LENGTH = 2.6;
const HALF_WIDTH = 1.0;

const CIRCUITS = process.argv.slice(2).length ? process.argv.slice(2) : ['bahrain', 'monza', 'spa'];

console.log('car-to-car contact, by geometry. Real F1: single-digit seconds per car per race.\n');
console.log('circuit     race    median   max    lateral%  longit%   >25% of race');

for (const id of CIRCUITS) {
  const circuit = circ.getCircuit(id);
  const track = tg.buildTrack(circuit);
  const entries = cm.createChampionship().entries;
  const session = new rs.RaceSession({
    track,
    entries,
    type: rs.SESSION_TYPE.race,
    totalLaps: circuit.laps,
    gridOrder: entries.map((entry, index) => ({ entry, grid: index })),
    random: createRandom(20240218),
    seed: 20240218,
    conditions: { compound: 'medium', weather: 'clear' }
  });

  // A deliberately mediocre driver in the player's seat, so the leader is not simply untouchable.
  const player = session.player;
  player.isPlayer = false;
  player.ai = new AIDriver(player.physics, drv.SKILL_PRESETS.mid, {
    track,
    name: player.entry.short,
    random: createRandom(20240218)
  });
  player.ai.reset();

  const seconds = new Map(session.cars.map((car) => [car.entry.short, { any: 0, lateral: 0, longitudinal: 0 }]));

  /*
   * Episodes: a contact is not a rate, it is a sequence of events.
   *
   * The total says a car spends far too long in contact. It cannot say whether that is *racing*
   * -- two cars side by side through a sequence of corners, which is the whole point of the
   * sport -- or cars wedged abreast because neither can complete a pass, which is a bug. The
   * two are indistinguishable in a total and need opposite responses: one is correct and must be
   * left alone, the other has to be fixed.
   *
   * The discriminator is whether the relative order changes. A real pass ends with the overtaker
   * ahead; a stuck battle never resolves. Episodes are tracked per ordered pair, closed when the
   * pair separates, and classified by what happened.
   *
   * A real wheel-to-wheel battle runs a corner or two -- single-digit seconds. Episodes running
   * to tens of seconds are the stuck case.
   */
  const episodes = new Map();
  let nextEpisode = 0;
  const open = new Map();
  const budget = Math.ceil(track.lapRecord * circuit.laps * 4 * 120);

  for (let step = 0; step < budget && !session.finished; step += 1) {
    session.update(rs.FIXED_TIMESTEP, { throttle: 0, brake: 0, steer: 0, handbrake: false });

    /*
     * Counted once per car per step, not once per pair.
     *
     * The first version tallied every touching pair, so a car overlapping two others in the
     * same step was credited with twice the time -- and reported 1677 seconds of contact in a
     * 1285 second race. A measurement that can exceed the race it is measuring is not a
     * measurement, so each car contributes at most one step's worth, classified by the deepest
     * overlap it is currently in: that is the contact actually costing it time.
     */
    const cars = session.cars;
    const dt = 1 / 120;
    for (let i = 0; i < cars.length; i += 1) {
      const a = cars[i];
      if (!a.touching) continue;
      const pa = a.physics;
      const cos = Math.cos(pa.heading);
      const sin = Math.sin(pa.heading);

      let bestDepth = -Infinity;
      let bestLateral = false;
      for (let j = 0; j < cars.length; j += 1) {
        if (i === j) continue;
        const b = cars[j];
        if (!b.touching) continue;
        const pb = b.physics;
        const dx = pb.x - pa.x;
        const dz = pb.z - pa.z;
        // The separation is taken in this car's own frame; the boxes are symmetric, so which
        // car is chosen does not change the split.
        const longitudinal = Math.abs(dx * cos + dz * sin);
        const lateral = Math.abs(-dx * sin + dz * cos);
        const depthLong = HALF_LENGTH - longitudinal;
        const depthLat = HALF_WIDTH - lateral;
        if (Math.max(depthLong, depthLat) > bestDepth) {
          bestDepth = Math.max(depthLong, depthLat);
          bestLateral = depthLat > depthLong;
        }
      }
      if (bestDepth === -Infinity) continue;
      const record = seconds.get(a.entry.short);
      record.any += dt;
      if (bestLateral) record.lateral += dt;
      else record.longitudinal += dt;

      /*
       * Episode bookkeeping against the car this one is deepest in.
       */
      let partner = null;
      let partnerDepth = -Infinity;
      for (let j = 0; j < cars.length; j += 1) {
        if (i === j) continue;
        const b = cars[j];
        if (!b.touching) continue;
        const pb = b.physics;
        const dx = pb.x - pa.x;
        const dz = pb.z - pa.z;
        const depth = Math.max(
          HALF_LENGTH - Math.abs(dx * cos + dz * sin),
          HALF_WIDTH - Math.abs(-dx * sin + dz * cos)
        );
        if (depth > partnerDepth) { partnerDepth = depth; partner = b; }
      }
      if (partner) {
        const key = [a, partner].map((c) => c.entry.short).sort().join('|');
        if (!open.has(key)) {
          open.set(key, { id: nextEpisode++, started: step * dt, a: a.entry.short, b: partner.entry.short });
        }
        open.get(key).lateral += dt;
      }
    }

    // Close any episode whose pair has separated this step.
    for (const [key, ep] of [...open]) {
      const [sa, sb] = key.split('|');
      const ca = session.cars.find((c) => c.entry.short === sa);
      const cb = session.cars.find((c) => c.entry.short === sb);
      if (!ca || !cb || (ca.touching && cb.touching)) continue;
      ep.ended = step * dt;
      // Did the order change while they were in contact? A real pass resolves; a battle does not.
      const orderNow = session.order.entries.map((e) => e.id);
      const before = ep.a < ep.b ? -1 : 1;
      const after = orderNow.indexOf(ep.a) < orderNow.indexOf(ep.b) ? -1 : 1;
      ep.swapped = before !== after;
      episodes.set(ep.id, ep);
      open.delete(key);
    }
  }

  const totals = [...seconds.values()];
  const any = totals.map((r) => r.any).sort((a, b) => a - b);
  const lateralShare = totals.reduce((a, r) => a + r.lateral, 0) / Math.max(0.001, totals.reduce((a, r) => a + r.any, 0));
  const median = any[Math.floor(any.length / 2)];
  const heavy = any.filter((v) => v > session.time * 0.25).length;

  console.log(
    `${id.padEnd(10)} ${session.time.toFixed(0).padStart(5)}s  ${median.toFixed(0).padStart(5)}s ${any[any.length - 1].toFixed(0).padStart(5)}s  ` +
    `${(lateralShare * 100).toFixed(0).padStart(7)}% ${((1 - lateralShare) * 100).toFixed(0).padStart(7)}%  ${heavy}/${any.length}`
  );

  const done = [...episodes.values()];
  const lengths = done.map((e) => e.ended - e.started).sort((a, b) => a - b);
  const swapped = done.filter((e) => e.swapped).length;
  const long = done.filter((e) => e.ended - e.started > 10);
  const longSwapped = long.filter((e) => e.swapped).length;
  console.log(
    `           episodes ${done.length}, median ${lengths[Math.floor(lengths.length / 2)].toFixed(1)}s, ` +
    `p90 ${lengths[Math.floor(lengths.length * 0.9)].toFixed(1)}s, resolved by a pass ${swapped}/${done.length}` +
    (long.length ? `  |  >10s: ${long.length} of which resolved ${longSwapped}` : '')
  );
}