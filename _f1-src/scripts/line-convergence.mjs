/**
 * Justify `LINE_RELAX_ITERATIONS`.
 *
 * The racing line is relaxed by gradient descent over `LINE_RELAX_ITERATIONS`
 * passes, and that count is a straight trade: too few and the line keeps the
 * shape of its corner-by-corner seed instead of the smooth apex-to-apex cut a
 * shortest path produces; too many and the build pays for changes smaller than
 * the smoothing pass that follows will erase.
 *
 * There is no principled way to pick it by eye, because "looks fine" and "is 40%
 * of the cost" are easy to hit at once. So: run the descent to convergence, treat
 * that as the reference, and measure how far short of it each candidate count
 * lands. What is reported is the residual offset and, more to the point, the
 * excess *path length* -- the quantity actually being minimised. A residual that
 * looks alarming in metres can correspond to a path only a centimetre longer;
 * a small-looking residual spread over the lap can be worse.
 *
 * Also cross-checks the spatial-hash self-intersection scan against brute force,
 * since that one replaced a quadratic sweep and a wrong answer there would be a
 * silently wrong validation number rather than a crash.
 *
 * Run: node scripts/line-convergence.mjs
 */

import { CIRCUITS } from '../src/track/circuits.js';
import { buildTrack, relaxRacingLine, LINE_RELAX_ITERATIONS, SAMPLE_SPACING } from '../src/track/trackGeometry.js';

const CANDIDATES = [200, 400, 700, 1000, 1400, 2000, 3000, 4000];
const REFERENCE = 8000;

/** Total length of the polyline through the line points, in metres. */
function estimateLineLength(xs, zs, rightX, rightZ, offsets) {
  const n = xs.length;
  let total = 0;
  for (let i = 0; i < n; i += 1) {
    const next = i + 1 === n ? 0 : i + 1;
    const ax = xs[i] + rightX[i] * offsets[i];
    const az = zs[i] + rightZ[i] * offsets[i];
    const bx = xs[next] + rightX[next] * offsets[next];
    const bz = zs[next] + rightZ[next] * offsets[next];
    const dx = ax - bx;
    const dz = az - bz;
    total += Math.sqrt(dx * dx + dz * dz);
  }
  return total;
}

const pad = (s, width = 9) => String(s).padStart(width);

console.log('Racing-line relaxation convergence');
console.log(`reference = ${REFERENCE} passes, current build = ${LINE_RELAX_ITERATIONS}\n`);

const columns = ['circuit', 'n', ...CANDIDATES.map(String)];

const residualRows = [];
const excessRows = [];
const lengthRows = [];
let worstExcessAtCurrent = 0;

for (const circuit of CIRCUITS) {
  const track = buildTrack(circuit);
  const n = track.count;
  const { xs, zs, rightX, rightZ, limits, seed } = seedInputs(track);

  const reference = relaxRacingLine(xs, zs, rightX, rightZ, limits, seed, REFERENCE);
  const referenceLength = estimateLineLength(xs, zs, rightX, rightZ, reference);

  const residuals = [];
  const excesses = [];
  for (const iterations of CANDIDATES) {
    const offsets = relaxRacingLine(xs, zs, rightX, rightZ, limits, seed, iterations);
    let worst = 0;
    for (let i = 0; i < n; i += 1) worst = Math.max(worst, Math.abs(offsets[i] - reference[i]));
    residuals.push(worst.toFixed(3).padStart(9));

    const length = estimateLineLength(xs, zs, rightX, rightZ, offsets);
    const excess = length - referenceLength;
    if (iterations === LINE_RELAX_ITERATIONS) worstExcessAtCurrent = Math.max(worstExcessAtCurrent, excess);
    excesses.push(excess.toFixed(2).padStart(9));
  }

  residualRows.push([circuit.id.padEnd(14), pad(n), ...residuals].join(' '));
  excessRows.push([circuit.id.padEnd(14), pad(n), ...excesses].join(' '));
  lengthRows.push(
    `  ${circuit.id.padEnd(12)} reference line ${referenceLength.toFixed(1).padStart(8)}m over a ` +
      `${(track.length / 1000).toFixed(2)}km centreline`
  );
}

console.log('residual |offset| from reference, metres');
console.log(columns.map((c, i) => (i === 0 ? c.padEnd(14) : pad(c))).join(' '));
console.log(residualRows.join('\n'));

console.log('\nexcess path length vs reference, metres  <- the quantity being minimised');
console.log(columns.map((c, i) => (i === 0 ? c.padEnd(14) : pad(c))).join(' '));
console.log(excessRows.join('\n'));
console.log('\n' + lengthRows.join('\n'));
console.log(
  `\nAt ${LINE_RELAX_ITERATIONS} passes the worst circuit's line is ` +
    `${worstExcessAtCurrent.toFixed(2)}m longer than the fully converged shortest path.`
);

console.log(`Self-intersection scan: spatial hash vs brute force (circular separation, gap 220m)\n`);
for (const circuit of CIRCUITS) {
  const track = buildTrack(circuit);
  const samples = track.samples;
  const n = samples.length;
  const gapSamples = Math.max(4, Math.round(220 / SAMPLE_SPACING));

  let brute = Infinity;
  let bruteIndex = -1;
  for (let i = 0; i < n; i += 1) {
    const a = samples[i];
    for (let j = 0; j < n; j += 1) {
      // Separation along the lap, both ways round. Comparing array indices
      // directly is the easy mistake here: the loop is closed, so index 650 and
      // index 5 sit next to each other on track.
      const separation = i > j ? i - j : j - i;
      if (separation < gapSamples || separation > n - gapSamples) continue;
      const b = samples[j];
      const dx = a.x - b.x;
      const dz = a.z - b.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      if (distance < brute) {
        brute = distance;
        bruteIndex = i;
      }
    }
  }

  const hash = findSelfIntersectionHashed(samples, SAMPLE_SPACING);
  const agrees = Math.abs(hash.distance - brute) < 1e-9;
  console.log(
    `${circuit.id.padEnd(14)} brute ${brute.toFixed(3).padStart(9)}m  hash ${hash.distance.toFixed(3).padStart(9)}m  ` +
      `${agrees ? 'exact match' : `MISMATCH (delta ${(hash.distance - brute).toExponential(2)})`}`
  );
}

/** Rebuild the descent's inputs from a built track, matching `buildTrack`. */
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
    seed[i] = Math.sign(s.curvature) * clampLocal(Math.abs(s.curvature) * 48, 0, limit);
  }
  return { xs, zs, rightX, rightZ, limits, seed };
}

function clampLocal(value, lo, hi) {
  return value < lo ? lo : value > hi ? hi : value;
}

/** Copy of the hashed scan, for cross-checking. Kept local so the bench cannot drift from the module by import side effects. */
function findSelfIntersectionHashed(samples, step, minSeparation = 220) {
  const n = samples.length;
  const gapSamples = Math.max(4, Math.round(minSeparation / step));
  const STRIDE = 16;
  let best = Infinity;
  for (let i = 0; i < n; i += STRIDE) {
    const a = samples[i];
    for (let j = i + gapSamples; j < n - gapSamples; j += STRIDE) {
      const b = samples[j];
      const dx = a.x - b.x;
      const dz = a.z - b.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      if (distance < best) best = distance;
    }
  }
  if (!Number.isFinite(best)) return { distance: Infinity, indexA: 0 };
  const cellSize = Math.max(best * 1.05, step * 2);
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < n; i += 1) {
    const p = samples[i];
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.z < minZ) minZ = p.z;
    if (p.z > maxZ) maxZ = p.z;
  }
  const cols = Math.max(1, Math.ceil((maxX - minX) / cellSize) + 1);
  const rows = Math.max(1, Math.ceil((maxZ - minZ) / cellSize) + 1);
  const cellCount = cols * rows;
  const cellOf = new Int32Array(n);
  const counts = new Int32Array(cellCount + 1);
  for (let i = 0; i < n; i += 1) {
    const p = samples[i];
    const col = Math.min(cols - 1, Math.max(0, ((p.x - minX) / cellSize) | 0));
    const row = Math.min(rows - 1, Math.max(0, ((p.z - minZ) / cellSize) | 0));
    const cell = row * cols + col;
    cellOf[i] = cell;
    counts[cell + 1] += 1;
  }
  for (let c = 0; c < cellCount; c += 1) counts[c + 1] += counts[c];
  const cursor = counts.slice(0, cellCount);
  const items = new Int32Array(n);
  for (let i = 0; i < n; i += 1) {
    items[cursor[cellOf[i]]] = i;
    cursor[cellOf[i]] += 1;
  }
  let indexA = 0;
  for (let i = 0; i < n; i += 1) {
    const a = samples[i];
    const col = cellOf[i] % cols;
    const row = (cellOf[i] / cols) | 0;
    for (let dr = -1; dr <= 1; dr += 1) {
      const r = row + dr;
      if (r < 0 || r >= rows) continue;
      for (let dc = -1; dc <= 1; dc += 1) {
        const c = col + dc;
        if (c < 0 || c >= cols) continue;
        const cell = r * cols + c;
        for (let k = counts[cell]; k < counts[cell + 1]; k += 1) {
          const j = items[k];
          const separation = i > j ? i - j : j - i;
          if (separation >= gapSamples && separation <= n - gapSamples) {
            const b = samples[j];
            const dx = a.x - b.x;
            const dz = a.z - b.z;
            const distance = Math.sqrt(dx * dx + dz * dz);
            if (distance < best) {
              best = distance;
              indexA = i;
            }
          }
        }
      }
    }
  }
  return { distance: best, indexA };
}