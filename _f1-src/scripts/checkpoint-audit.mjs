/**
 * Does the lap validator agree with the direction of travel?
 *
 * Cars complete no laps at some circuits while driving perfectly well, which is a
 * lap-validation failure rather than a driving one. `LapTimer` only counts a lap
 * when every checkpoint is passed in order, so a checkpoint sequence that runs
 * against the direction the cars travel can never be satisfied no matter how well
 * the AI drives.
 *
 * This walks each circuit's centreline in the order the checkpoints are defined and
 * checks that the sequence advances monotonically. It also reports the gap from
 * each checkpoint to the nearest point on any *other* part of the lap, because a
 * checkpoint sitting next to a distant section is reachable out of order.
 *
 * Run: node scripts/checkpoint-audit.mjs
 */

import { buildTrack, CHECKPOINT_COUNT } from '../src/track/trackGeometry.js';
import { CIRCUITS } from '../src/track/circuits.js';

console.log('circuit          monotonic  wrap  minGap(samples)  closest-other-section');
let suspect = 0;

for (const circuit of CIRCUITS) {
  const track = buildTrack(circuit);
  const { samples, count, checkpoints } = track;

  // Indices of the checkpoints, in the order the timer expects them.
  const order = checkpoints.map((checkpoint) => checkpoint.index);

  // Walking forward around the lap, each checkpoint must be ahead of the last.
  let monotonic = true;
  let wraps = 0;
  for (let i = 1; i < order.length; i += 1) {
    if (order[i] <= order[i - 1]) monotonic = false;
  }
  if (order[order.length - 1] > order[0]) wraps = 1;

  // Gap between consecutive checkpoints, in samples. A very small gap means two
  // gates are effectively the same place and a single stray moment can trip both.
  let minGap = Infinity;
  for (let i = 1; i < order.length; i += 1) minGap = Math.min(minGap, order[i] - order[i - 1]);
  if (order[0] + count - order[order.length - 1] < minGap) {
    minGap = Math.min(minGap, order[0] + count - order[order.length - 1]);
  }

  /*
   * How close is each checkpoint to a part of the lap that is not adjacent to it?
   *
   * This is the failure that matters. If gate 5 sits 20m from the road on the far
   * side of the circuit, a car driving past that section trips gate 5 without
   * having earned it, and every subsequent lap is invalidated.
   */
  let closest = Infinity;
  for (const checkpoint of checkpoints) {
    for (let i = 0; i < count; i += 1) {
      let along = Math.abs(i - checkpoint.index);
      along = Math.min(along, count - along);
      const samplesApart = along * (track.length / count);
      if (samplesApart < 60) continue; // adjacent section, expected
      const distance = Math.hypot(samples[i].x - checkpoint.x, samples[i].z - checkpoint.z);
      if (distance < closest) closest = distance;
    }
  }

  const bad = !monotonic || closest < 40;
  if (bad) suspect += 1;
  console.log(
    `${circuit.id.padEnd(15)} ${String(monotonic).padStart(9)} ${String(wraps).padStart(5)} ` +
      `${String(minGap).padStart(15)} ${closest.toFixed(0).padStart(20)}m${bad ? '   <<<' : ''}`
  );
}

console.log(`\n${suspect} circuit(s) with a suspect checkpoint layout, out of ${CIRCUITS.length}`);
console.log(`gates per circuit: ${CHECKPOINT_COUNT}`);