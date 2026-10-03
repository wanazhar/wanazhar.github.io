/**
 * Pure track geometry: turns a circuit definition from `circuits.js` into a
 * resampled centreline with widths, curvature, a relaxed racing line, a speed
 * profile, sectors, lap checkpoints and starting grid slots.
 *
 * Deliberately free of any Three.js import so the layout maths can be unit
 * tested under plain node, and so the same data drives both the renderer and
 * the AI.
 */

import { clamp, wrapAngle } from '../util/math.js';
import { ELEVATION, elevationAt } from './elevationData.js';

/** Distance in metres between centreline samples. */
export const SAMPLE_SPACING = 4;

/** Number of lap-validation gates. A lap only counts when all are crossed in order. */
export const CHECKPOINT_COUNT = 24;

/** Closure residual (metres) a circuit may be off after straight-length correction. */
export const CLOSURE_TOLERANCE = 12;

/**
 * Gradient-descent passes used to relax the racing line.
 *
 * This is the generator's dominant cost -- passes x samples, twice -- so the
 * number is the first thing to reach for when a circuit feels slow to load.
 *
 * It is also the number most likely to be wrong in either direction. Too few and
 * the line is visibly under-converged: the seed's corner-by-corner shape survives
 * instead of the smooth apex-to-apex cut a shortest path produces. Too many and
 * it burns time on changes smaller than the smoothing pass that follows will
 * erase anyway. `scripts/line-convergence.mjs` measures the residual against the
 * fully converged line so the number stays honest.
 */
export const LINE_RELAX_ITERATIONS = 1400;

/**
 * Reference grip / braking / acceleration used to build the AI speed profile.
 * These are the pace an ideal driver could hold; the AI applies its skill factor
 * on top, and the player's car is measured against the resulting lap estimate.
 */
/**
 * Reference grip / braking / acceleration used to build the AI speed profile.
 *
 * These are deliberately well below what the car can actually do -- roughly a
 * third under on grip, a quarter under on brakes. The profile is used as a
 * *target*, and a target the car cannot reach is worse than useless: the AI
 * finds itself carrying more speed than the corner allows, runs wide, and can
 * never recover. Leaving real margin means the speed it can actually hold is
 * always above the target it is aiming at, so corrections stay small.
 */
const PROFILE_MU = 0.95;
const PROFILE_BRAKE = 9.5;
const PROFILE_ACCEL = 5.4;
/** ~340 km/h, an upper bound for the profile even on the fastest circuits. */
const PROFILE_TOP_SPEED = 94;
/**
 * Floor on the profile, as a fraction of the corner speed rather than an
 * absolute value.
 *
 * An absolute floor is a trap here. It silently overrides the corners that
 * genuinely need to be taken slower, so the AI is told to carry 60 km/h through
 * a hairpin it can only take at 35, arrives far too fast, runs wide, and never
 * recovers. Scaling from the corner's own speed keeps the floor out of the way
 * of tight corners while still preventing absurdly slow ones.
 */
const PROFILE_MIN_FRACTION = 0.72;
/**
 * Curvature smoothing window for the speed profile, in samples.
 *
 * At 4m per sample this is a ~72 metre window, comparable to the distance over
 * which a driver actually sets up for and rounds a corner. It is wide enough to
 * remove the sampling oscillation and narrow enough to keep genuine corners
 * distinct.
 */
const PROFILE_CURVATURE_WINDOW = 18;

/** Half the width of the local window a car is searched for when tracking progress. */
const LOCATE_WINDOW = 44;

/**
 * Walk the segment DSL and return the raw polyline plus the total turn angle.
 * Heading convention: 0 = +X, increasing towards +Z, so a positive corner angle
 * sweeps the nose to the right.
 */
function integrateSegments(segments) {
  const points = [{ x: 0, z: 0, heading: 0 }];
  let x = 0;
  let z = 0;
  let heading = 0;
  let totalTurn = 0;

  for (const segment of segments) {
    if (segment.type === 'straight') {
      x += Math.cos(heading) * segment.length;
      z += Math.sin(heading) * segment.length;
      points.push({ x, z, heading });
    } else {
      const angle = (segment.angle * Math.PI) / 180;
      const radius = Math.max(segment.radius, 1);
      const arcLength = Math.abs(angle) * radius;
      // Emit the arc in <=8 degree bites: a single chord would cut the corner
      // and flatten every hairpin into a straight line.
      const steps = Math.max(2, Math.ceil(Math.abs(angle) / ((8 * Math.PI) / 180)));
      const entryHeading = heading;
      for (let step = 1; step <= steps; step += 1) {
        const subAngle = (angle * step) / steps;
        x += Math.cos(entryHeading + subAngle / 2) * arcLength / steps;
        z += Math.sin(entryHeading + subAngle / 2) * arcLength / steps;
        heading = entryHeading + subAngle;
        points.push({ x, z, heading });
      }
      totalTurn += angle;
    }
  }

  return { points, totalTurn };
}

/**
 * Closed centripetal Catmull-Rom through the authored control points.
 *
 * The layout DSL exists to make circuits readable, but a DSL cannot guarantee
 * that a hand-authored set of straights and corners closes on itself: the arc
 * chords of a loop generally miss by hundreds of metres, and no amount of
 * scaling fixes that without distorting the design. So the DSL is integrated
 * into an open polyline, and this spline turns that polyline into a genuinely
 * closed loop. Closure is then structural rather than something to be solved
 * for, and centripetal parameterisation keeps it free of cusps and self-
 * intersection artefacts on the tightest corners.
 */
function catmullRomClosed(points, samplesPerSegment) {
  const n = points.length;
  const out = [];
  const at = (i) => points[((i % n) + n) % n];

  for (let i = 0; i < n; i += 1) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);

    const t0 = 0;
    const t1 = t0 + Math.pow(Math.hypot(p1.x - p0.x, p1.z - p0.z), 0.5) || t0 + 1e-4;
    const t2 = t1 + Math.pow(Math.hypot(p2.x - p1.x, p2.z - p1.z), 0.5) || t1 + 1e-4;
    const t3 = t2 + Math.pow(Math.hypot(p3.x - p2.x, p3.z - p2.z), 0.5) || t2 + 1e-4;

    for (let s = 0; s < samplesPerSegment; s += 1) {
      const t = t1 + ((t2 - t1) * s) / samplesPerSegment;
      out.push({
        x: interpolateCentripetal(p0.x, p1.x, p2.x, p3.x, t0, t1, t2, t3, t),
        z: interpolateCentripetal(p0.z, p1.z, p2.z, p3.z, t0, t1, t2, t3, t)
      });
    }
  }
  return out;
}

/** Barry-Goldman pyramidal evaluation of a non-uniform Catmull-Rom segment. */
function interpolateCentripetal(a0, a1, a2, a3, t0, t1, t2, t3, t) {
  const d10 = t1 - t0;
  const d21 = t2 - t1;
  const d32 = t3 - t2;
  const d20 = t2 - t0;
  const d31 = t3 - t1;

  const c0 = ((t1 - t) * a0 + (t - t0) * a1) / d10;
  const c1 = ((t2 - t) * a1 + (t - t1) * a2) / d21;
  const c2 = ((t3 - t) * a2 + (t - t2) * a3) / d32;
  const c3 = ((t2 - t) * a0 + (t - t0) * a2) / d20;
  const c4 = ((t3 - t) * a1 + (t - t1) * a3) / d31;

  const d11 = ((t1 - t) * c0 + (t - t0) * c1) / d10;
  const d12 = ((t2 - t) * c1 + (t - t1) * c2) / d21;
  const d13 = ((t3 - t) * c2 + (t - t2) * c3) / d32;

  const d01 = ((t2 - t) * d11 + (t - t0) * d12) / d20;
  const d12b = ((t3 - t) * d12 + (t - t1) * d13) / d31;

  return ((t2 - t) * d01 + (t - t1) * d12b) / d21;
}

/**
 * Closest approach between two parts of the lap that are far apart along it.
 *
 * Adjacent samples always pass a 0m test, so candidates are separated by a
 * minimum arc distance before being compared. A circuit that folds back on
 * itself would otherwise place walls through its own racing line.
 */
function findSelfIntersection(samples, step, minSeparation = 220) {
  const n = samples.length;
  const gapSamples = Math.max(4, Math.round(minSeparation / step));

  // Straightforwardly this is every pair of points more than `gapSamples` apart,
  // which is quadratic -- about 740,000 tests on the longest circuit, and it is
  // the reason a track takes seconds to load rather than milliseconds.
  //
  // It does not need to be. What is being asked for is "how close does the lap
  // come to itself", and once there is *any* candidate distance `d` known, no
  // point further than `d` away can improve on it. So: hash the points into a
  // uniform grid whose cell size is at least the best distance seen so far, and
  // only compare within neighbouring cells. A grid cell of side `c >= d` around a
  // point contains every point within distance `c`, and the 3x3 block of cells
  // around it is a superset of that, so nothing that could beat `d` is missed.
  //
  // The initial bound comes from a coarse scan (every STRIDE-th sample against
  // every other), which is `n^2 / STRIDE^2` -- three orders of magnitude cheaper
  // than the full sweep -- and is a valid upper bound because it is the minimum
  // of a *subset* of the pairs. `best` only decreases from there, so the invariant
  // holds for the whole scan.
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

  // Cell size at least `best`, so the 3x3 neighbourhood is a superset of the
  // disc of radius `best`. The bound is padded slightly for the same reason.
  const cellSize = Math.max(best * 1.05, step * 2);

  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
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

  // Counting sort into cells: two flat passes, no per-cell arrays, no
  // allocation proportional to the point count.
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
    const cell = cellOf[i];
    items[cursor[cell]] = i;
    cursor[cell] += 1;
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
          // Arc separation along the lap, both ways round, so that the two ends
          // of the sample array -- which are physically adjacent because the
          // circuit is closed -- are not mistaken for two distant parts of the
          // track passing close by. Linear index distance is not the same thing:
          // samples 650 and 5 of a 661-sample lap are 16 apart going round the
          // loop despite being 645 apart in the array.
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

/** Resample a closed polyline to (approximately) uniform arc-length spacing. */
function resampleClosed(points, spacing) {
  const n = points.length;
  const cumulative = new Float64Array(n + 1);
  for (let i = 0; i < n; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % n];
    cumulative[i + 1] = cumulative[i] + Math.hypot(b.x - a.x, b.z - a.z);
  }
  const total = cumulative[n];
  const count = Math.max(16, Math.round(total / spacing));
  const step = total / count;

  const out = [];
  let cursor = 0;
  for (let i = 0; i < count; i += 1) {
    const target = i * step;
    while (cursor < n - 1 && cumulative[cursor + 1] < target) cursor += 1;
    const span = cumulative[cursor + 1] - cumulative[cursor];
    const t = span > 1e-9 ? (target - cumulative[cursor]) / span : 0;
    const a = points[cursor];
    const b = points[(cursor + 1) % n];
    out.push({ x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t });
  }
  return { samples: out, step, total };
}

/** Circular box blur over a Float64Array, used to tame finite-difference noise. */
function smoothCircular(values, window) {
  const n = values.length;
  const half = Math.max(1, Math.floor(window / 2));
  const span = half * 2 + 1;
  const out = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    let sum = 0;
    for (let d = -half; d <= half; d += 1) {
      sum += values[(((i + d) % n) + n) % n];
    }
    out[i] = sum / span;
  }
  return out;
}

/** Signed curvature of a closed polyline sampled at `step`, smoothed. */
function curvatureOfPoints(xs, zs, step, window) {
  const n = xs.length;
  const headings = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    const a = (i - 1 + n) % n;
    const b = (i + 1) % n;
    headings[i] = Math.atan2(zs[b] - zs[a], xs[b] - xs[a]);
  }
  const raw = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    const delta = wrapAngle(headings[(i + 1) % n] - headings[(i - 1 + n) % n]);
    raw[i] = delta / (2 * step);
  }
  return { headings, curvature: smoothCircular(raw, window) };
}

/**
 * Find the shortest path through the track corridor: the racing line.
 *
 * This minimises arc *length* with gradient descent, not curvature. Curvature
 * minimisation is the tempting choice and it is wrong: a dead-straight run has
 * zero curvature, so it solves to "stay on the centreline everywhere" and the
 * line ends up hugging the middle of the road. Shortest-path minimisation is
 * what produces the real shape -- cutting to the apexes, running wide on entry
 * and exit, and diagonal links between them.
 *
 * With `p_i = s_i + o_i * r_i` (centreline point plus lateral offset along the
 * right vector), only `o_i` moves, so the gradient of the segment length is
 *
 *   g_i = (p_i - p_{i-1}).r_i / |p_i - p_{i-1}|  -  (p_{i+1} - p_i).r_i / |p_{i+1} - p_i|
 *
 * Each `o_i` is then projected back inside its own kerb limit, which is what
 * keeps the line on the track.
 *
 * Takes the centreline and right vectors as flat `Float64Array`s rather than the
 * sample objects. This loop is the single most expensive thing the track
 * generator does -- it runs `iterations` times over every sample, so two property
 * lookups per sample per iteration is millions of megamorphic dictionary hits.
 * The vectors also never change, so hoisting them out is free.
 *
 * @param {Float64Array} xs Centreline x per sample.
 * @param {Float64Array} zs Centreline z per sample.
 * @param {Float64Array} rightX Unit right vector x per sample.
 * @param {Float64Array} rightZ Unit right vector z per sample.
 * @param {Float64Array} limits Kerb clearance per sample.
 * @param {Float64Array} seed Starting offsets.
 * @param {number} iterations Gradient passes.
 * @param {number} [learningRate]
 */
export function relaxRacingLine(xs, zs, rightX, rightZ, limits, seed, iterations, learningRate) {
  const n = xs.length;
  const offsets = Float64Array.from(seed);
  const velocity = new Float64Array(n);
  const px = new Float64Array(n);
  const pz = new Float64Array(n);
  const LEARNING_RATE = learningRate ?? 0.35;

  for (let pass = 0; pass < iterations; pass += 1) {
    for (let i = 0; i < n; i += 1) {
      px[i] = xs[i] + rightX[i] * offsets[i];
      pz[i] = zs[i] + rightZ[i] * offsets[i];
    }

    // Decaying rate: early passes make large moves to find the shape, later
    // passes settle it. Without this the line oscillates around the optimum.
    const rate = LEARNING_RATE * (0.25 + 0.75 * (1 - pass / iterations));

    for (let i = 0; i < n; i += 1) {
      // Wrapped indices, hoisted so the modulo happens once per neighbour rather
      // than as part of a larger expression the optimiser cannot split.
      const prev = i === 0 ? n - 1 : i - 1;
      const next = i + 1 === n ? 0 : i + 1;

      const backX = px[i] - px[prev];
      const backZ = pz[i] - pz[prev];
      // Math.sqrt, not Math.hypot. hypot is specified to be overflow-safe and
      // is implemented accordingly: it branches on argument size and scales before
      // squaring. Track coordinates are a few kilometres, so the scaling can never
      // matter here, and hypot costs roughly three times as much as a plain sqrt
      // -- multiplied by two calls per sample per iteration, that is most of the
      // generator's run time.
      const backLength = Math.sqrt(backX * backX + backZ * backZ) || 1e-6;

      const aheadX = px[next] - px[i];
      const aheadZ = pz[next] - pz[i];
      const aheadLength = Math.sqrt(aheadX * aheadX + aheadZ * aheadZ) || 1e-6;

      const rx = rightX[i];
      const rz = rightZ[i];
      const gradient = (backX * rx + backZ * rz) / backLength - (aheadX * rx + aheadZ * rz) / aheadLength;

      // Momentum smooths the stepping order so information propagates around
      // the lap instead of each sample reacting only to its two neighbours.
      velocity[i] = velocity[i] * 0.72 - gradient * rate;
      const offset = offsets[i] + velocity[i];
      offsets[i] = offset < -limits[i] ? -limits[i] : offset > limits[i] ? limits[i] : offset;
    }
  }
  return offsets;
}

/**
 * Smooth the racing line and keep it inside the kerbs.
 *
 * Gradient descent leaves small kinks where a limit binds, and the track width
 * varies around the lap, so the feasible corridor's own boundary can have
 * steps. A line with a step in it is not just ugly, it is undriveable: the
 * curvature spike at the kink drags the speed profile down to a crawl there and
 * makes the AI brake for a corner that does not exist.
 *
 * Several passes of a clamped circular blur, from a wide window down to a narrow
 * one, remove the kinks while the clamping stops the line escaping the kerbs.
 */
function smoothLine(offsets, limits, passes) {
  const n = offsets.length;
  let current = Float64Array.from(offsets);
  let next = new Float64Array(n);

  for (const half of passes) {
    const span = half * 2 + 1;
    for (let i = 0; i < n; i += 1) {
      let sum = 0;
      for (let d = -half; d <= half; d += 1) {
        sum += current[(((i + d) % n) + n) % n];
      }
      next[i] = clamp(sum / span, -limits[i], limits[i]);
    }
    const swap = current;
    current = next;
    next = swap;
  }

  return current;
}

function buildSpeedProfile(curvatures, step, topSpeed) {
  const n = curvatures.length;
  const speeds = new Float64Array(n);
  const gripSpeeds = new Float64Array(n);

  for (let i = 0; i < n; i += 1) {
    const kappa = Math.max(Math.abs(curvatures[i]), 1e-5);
    gripSpeeds[i] = Math.min(topSpeed, Math.sqrt((PROFILE_MU * 9.81) / kappa));
    speeds[i] = gripSpeeds[i];
  }

  for (let pass = 0; pass < 2; pass += 1) {
    for (let i = n - 1; i >= 0; i -= 1) {
      const ahead = speeds[(i + 1) % n];
      speeds[i] = Math.min(speeds[i], Math.sqrt(ahead * ahead + 2 * PROFILE_BRAKE * step));
    }
    for (let i = 0; i < n; i += 1) {
      const behind = speeds[(i - 1 + n) % n];
      speeds[i] = Math.min(speeds[i], Math.sqrt(behind * behind + 2 * PROFILE_ACCEL * step));
    }
  }

  for (let i = 0; i < n; i += 1) {
    speeds[i] = Math.max(gripSpeeds[i] * PROFILE_MIN_FRACTION, speeds[i]);
  }
  return speeds;
}

/** Staggered starting grid placed behind the start/finish line. */
function buildStartingGrid(samples, count) {
  const slots = [];
  for (let i = 0; i < 10; i += 1) {
    const row = Math.floor(i / 2);
    const side = i % 2 === 0 ? -1 : 1;
    const backSamples = 7 + row * 3.25;
    const index = ((count - Math.round(backSamples)) % count + count) % count;
    const sample = samples[index];
    const lateral = side * (sample.width * 0.2);
    slots.push({
      index,
      x: sample.x + sample.rightX * lateral,
      z: sample.z + sample.rightZ * lateral,
      heading: sample.heading,
      row
    });
  }
  return slots;
}

/** A representative clean lap from the speed profile, used by the calendar UI. */
function estimateLapTime(speeds, step) {
  let time = 0;
  for (let i = 0; i < speeds.length; i += 1) time += step / Math.max(speeds[i], 1);
  return time;
}

/**
 * Build the complete track model for a circuit.
 * @param {object} circuit entry from CIRCUITS
 */
/**
 * Steepest road gradient allowed, as a fraction.
 *
 * Real circuits stay within about 10% on the road. A DEM sampled every few metres
 * produces local gradients far steeper than that, and a car obeying one gets launched
 * off the crest -- which looks spectacular and is wrong.
 */
const MAX_ROAD_GRADE = 0.1;

/**
 * Limit the gradient of an elevation profile, in place.
 *
 * A forward pass then a backward pass, which flattens a spike from whichever side it
 * was approached rather than only from the one it was scanned in. A single pass would
 * fix a peak but leave the dip behind it, and a dip is exactly what launches a car.
 *
 * @param {Float64Array} elevation metres, one per sample
 * @param {number} step sample spacing in metres
 * @param {number} limit maximum gradient as a fraction
 */
function clampGradient(elevation, step, limit) {
  const maxRise = limit * step;
  for (let pass = 0; pass < 2; pass += 1) {
    const forward = pass === 0;
    const count = elevation.length;
    for (let n = 1; n < count; n += 1) {
      const i = forward ? n : count - n;
      const previous = elevation[forward ? i - 1 : i + 1];
      const delta = elevation[i] - previous;
      if (delta > maxRise) elevation[i] = previous + maxRise;
      else if (delta < -maxRise) elevation[i] = previous - maxRise;
    }
  }
}

export function buildTrack(circuit) {
  // DSL -> open polyline -> closed spline -> uniform arc-length samples.
  const controlPoints = circuit.controlPoints ?? integrateSegments(circuit.segments).points;
  const spline = catmullRomClosed(controlPoints, 24);
  const { samples: raw, step, total } = resampleClosed(spline, SAMPLE_SPACING);

  const selfIntersection = findSelfIntersection(raw, step);
  const count = raw.length;

  const xs = Float64Array.from(raw, (point) => point.x);
  const zs = Float64Array.from(raw, (point) => point.z);
  const { headings, curvature } = curvatureOfPoints(xs, zs, step, 9);
  // A heavily smoothed copy drives the road width. Taken from the raw curvature
  // it flickers sample to sample, and a road whose width flickers makes the racing
  // line weave, which makes the speed profile oscillate between a corner speed and
  // a straight speed every few metres -- braking events no car can physically
  // satisfy, and the AI spends the lap unable to make them.
  const widthCurvature = smoothCircular(curvature, 41);

  /*
   * Elevation.
   *
   * Keyed by lap fraction rather than by sample index, because the profile was built by
   * projecting OSM nodes onto the centreline and the two start in different places.
   * Interpolated here, once, onto the sample grid.
   *
   * Two properties are deliberate. It is **absolute**, so a circuit keeps its real
   * height -- Spa really is 400m above sea level -- which means the world has to be lit
   * and fogged consistently with it. And the **gradient is kept under a plausible limit**,
   * because a DEM sampled every few metres can produce a gradient the tyres cannot obey,
   * which would show up as cars being launched off crests.
   */
  const profile = ELEVATION[circuit.id]?.profile ?? null;
  const elevation = new Float64Array(count);
  if (profile) {
    let low = Infinity;
    let high = -Infinity;
    for (let i = 0; i < count; i += 1) {
      const value = elevationAt(profile, i / count);
      elevation[i] = value;
      if (value < low) low = value;
      if (value > high) high = value;
    }
    clampGradient(elevation, step, MAX_ROAD_GRADE);
  }

  const samples = [];
  for (let i = 0; i < count; i += 1) {
    const kappa = curvature[i];
    const squeeze = Math.min(1, Math.abs(widthCurvature[i]) * 55);
    samples.push({
      index: i,
      x: xs[i],
      z: zs[i],
      /** Metres above sea level. Zero for a circuit with no elevation data. */
      y: elevation[i],
      s: i * step,
      sector: Math.floor((i / count) * 3),
      heading: headings[i],
      curvature: kappa,
      rightX: Math.sin(headings[i]),
      rightZ: -Math.cos(headings[i]),
      // Slightly wider through the quick stuff: room for the racing line to breathe.
      width: circuit.width + squeeze * 4.5,
      lineOffset: 0,
      lineX: xs[i],
      lineZ: zs[i],
      /** The racing line sits on the road surface, so it carries the road's height. */
      lineY: elevation[i],
      lineHeading: headings[i],
      lineCurvature: 0,
      targetSpeed: PROFILE_TOP_SPEED
    });
  }

  // Seed the line on the inside of each corner, then relax it to the shortest
  // path. The seed matters: gradient descent on arc length has no strong
  // incentive to move towards a kerb, so a centreline seed would happily stay on
  // the centreline and only creep outwards where curvature forces it to.
  // Margin kept between the racing line and the edge of the road, in metres.
  //
  // This is the single most consequential number in the track generator. A line
  // that runs right up to the kerbs is a shortest path on paper and undriveable
  // in practice: the car sits on the limit continuously, any small tracking
  // error puts two wheels over the edge, and the AI then spends the lap
  // recovering rather than racing. Real racing lines leave the car somewhere it
  // can breathe.
  const LINE_EDGE_MARGIN = 4.5;

  const limits = new Float64Array(count);
  const seed = new Float64Array(count);
  for (let i = 0; i < count; i += 1) {
    const limit = Math.max(0.6, samples[i].width * 0.5 - LINE_EDGE_MARGIN);
    limits[i] = limit;
    // Inside is -sign(curvature): curvature is positive for a right-hand turn,
    // and the inside of a right-hander is to the right, i.e. positive offset.
    seed[i] = Math.sign(curvature[i]) * clamp(Math.abs(curvature[i]) * 48, 0, limit);
  }
  // Progressive de-kinking: wide windows flatten the large steps, narrow windows
  // tidy up what is left. Every window is clamped to the kerbs, so smoothing
  // can never push the line off the road.
  const SMOOTHING_WINDOWS = [24, 12, 6, 3, 2, 1];
  const lineRightX = new Float64Array(count);
  const lineRightZ = new Float64Array(count);
  for (let i = 0; i < count; i += 1) {
    lineRightX[i] = samples[i].rightX;
    lineRightZ[i] = samples[i].rightZ;
  }
  const offsets = smoothLine(
    relaxRacingLine(xs, zs, lineRightX, lineRightZ, limits, seed, LINE_RELAX_ITERATIONS),
    limits,
    SMOOTHING_WINDOWS
  );

  const lineX = new Float64Array(count);
  const lineZ = new Float64Array(count);
  for (let i = 0; i < count; i += 1) {
    const sample = samples[i];
    sample.lineOffset = offsets[i];
    lineX[i] = sample.x + sample.rightX * offsets[i];
    lineZ[i] = sample.z + sample.rightZ * offsets[i];
    sample.lineX = lineX[i];
    sample.lineZ = lineZ[i];
  }

  // The racing line's own tangent and curvature, computed from the line points
  // themselves. Deriving the line's direction from the *centreline* heading
  // instead -- even with a curvature lead term -- is wrong wherever the line
  // runs at an angle to the centreline, which is most of a real racing line, and
  // a steering controller aimed at the wrong tangent cannot hold the line.
  const lineGeometry = curvatureOfPoints(lineX, lineZ, step, 7);
  for (let i = 0; i < count; i += 1) {
    samples[i].lineHeading = lineGeometry.headings[i];
    samples[i].lineCurvature = lineGeometry.curvature[i];
  }

  // The speed profile is driven by a heavily smoothed curvature.
  //
  // Curvature taken straight from the sampled line oscillates with a period of
  // only a few samples, because finite differences of any numerical curve do.
  // Turning that oscillation straight into a speed limit produces a profile that
  // flips between corner speed and straight speed every few metres -- braking
  // events no car can physically perform. A real driver's line has smooth
  // curvature over tens of metres, and so does this one once it is smoothed at a
  // comparable scale.
  const profileCurvature = smoothCircular(lineGeometry.curvature, PROFILE_CURVATURE_WINDOW);
  const speeds = buildSpeedProfile(profileCurvature, step, PROFILE_TOP_SPEED);
  for (let i = 0; i < count; i += 1) {
    samples[i].targetSpeed = speeds[i];
  }

  const checkpoints = [];
  for (let i = 0; i < CHECKPOINT_COUNT; i += 1) {
    const index = Math.round((i * count) / CHECKPOINT_COUNT) % count;
    checkpoints.push({
      id: i,
      index,
      x: samples[index].x,
      z: samples[index].z,
      radius: samples[index].width * 0.5 + 22
    });
  }

  return {
    circuit,
    samples,
    step,
    length: total,
    count,
    width: circuit.width,
    sectorCount: 3,
    checkpoints,
    grid: buildStartingGrid(samples, count),
    minSelfDistance: selfIntersection.distance,
    grip: circuit.grip,
    lapRecord: estimateLapTime(speeds, step)
  };
}

/**
 * Locate a world position on the track.
 *
 * `hint` is the previously returned index. A car moves a few metres per frame,
 * so a local window is both correct and far cheaper than scanning the whole lap.
 * The full scan only runs when there is no usable hint (spawn or respawn), or
 * when the car has genuinely left the hint's neighbourhood.
 */
export function locateOnTrack(track, x, z, hint = null) {
  const samples = track.samples;
  const count = track.count;
  let bestIndex = -1;
  let bestDistance = Infinity;

  if (hint !== null && hint >= 0 && hint < count) {
    for (let d = -LOCATE_WINDOW; d <= LOCATE_WINDOW; d += 1) {
      const index = (((hint + d) % count) + count) % count;
      const sample = samples[index];
      const distance = (sample.x - x) ** 2 + (sample.z - z) ** 2;
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    }
    if (bestDistance > 90 * 90) bestIndex = -1;
  }

  if (bestIndex === -1) {
    bestDistance = Infinity;
    for (let i = 0; i < count; i += 1) {
      const sample = samples[i];
      const distance = (sample.x - x) ** 2 + (sample.z - z) ** 2;
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = i;
      }
    }
  }

  const sample = samples[bestIndex];
  const deltaX = x - sample.x;
  const deltaZ = z - sample.z;
  const lateral = deltaX * sample.rightX + deltaZ * sample.rightZ;

  return {
    index: bestIndex,
    sample,
    lateral,
    onTrack: Math.abs(lateral) <= sample.width * 0.5,
    distanceToCentre: Math.abs(lateral)
  };
}

/** Interpolated track sample at an arbitrary distance along the lap. */
export function sampleAtDistance(track, distance) {
  const index = Math.round(wrapDistance(distance, track.length) / track.step) % track.count;
  return track.samples[(((index % track.count) + track.count) % track.count)];
}

/** Interpolated racing-line point at an arbitrary distance along the lap. */
export function racingLineAt(track, distance, lateralNudge = 0) {
  const sample = sampleAtDistance(track, distance);
  const limit = Math.max(0, sample.width * 0.5 - 2);
  const offset = clamp(sample.lineOffset + lateralNudge, -limit, limit);
  return {
    x: sample.x + sample.rightX * offset,
    z: sample.z + sample.rightZ * offset,
    // The line's own tangent, so a follower aims along the line rather than
    // along the centreline it crosses diagonally.
    heading: sample.lineHeading,
    offset,
    width: sample.width,
    targetSpeed: sample.targetSpeed,
    sample
  };
}

/** Shortest signed delta from `a` to `b` on a loop of `length` metres. */
export function distanceDelta(a, b, length) {
  let delta = (b - a) % length;
  if (delta > length / 2) delta -= length;
  if (delta < -length / 2) delta += length;
  return delta;
}

/** Positive modulo on the lap distance. */
export function wrapDistance(distance, length) {
  const wrapped = distance % length;
  return wrapped < 0 ? wrapped + length : wrapped;
}

/** Grid slot for a starting position (0 = pole). */
export function gridSlot(track, position) {
  return track.grid[clamp(position, 0, track.grid.length - 1)];
}