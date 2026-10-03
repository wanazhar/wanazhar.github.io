/**
 * Closed-circuit generation from a radial profile.
 *
 * Circuits are described as a star-shaped polar loop: the centreline radius at
 * angle `t` comes from a Fourier series, `r(t) = R0 + sum(a_k * cos(k*t + phi_k))`.
 *
 * That representation is used for a specific reason. A hand-authored list of
 * straights and corners can only be made to close by solving for scale factors,
 * and such a solve is badly conditioned -- a loop's arc chords miss by hundreds
 * of metres and no scaling of a few free parameters removes that without
 * distorting the design. Worse, the resulting layouts tend to fold back through
 * themselves. A radial profile is closed and simple by construction: every
 * angle maps to exactly one point, so the loop can never cross itself, and the
 * harmonics still give per-corner shape.
 *
 * Sharpness is controlled by the amplitude of the higher harmonics. For
 * `a_k * cos(k*t)` the radius of curvature at an extremum is roughly
 * `r / (1 + (a_k * k^2 / R0))`, so raising either the harmonic order or its
 * amplitude tightens that corner while leaving the rest of the lap untouched.
 */

import { clamp } from '../util/math.js';

/** Amplitude budget, as a fraction of the base radius, that keeps the loop simple. */
const SUMMED_AMPLITUDE = 0.44;

/** Angle (radians) per control point. 72 points is plenty for a smooth centreline. */
const CONTROL_POINT_COUNT = 72;

/**
 * @param {object} spec
 * @param {number} spec.radius      base radius in metres
 * @param {Array<{order: number, amplitude: number, phase?: number}>} spec.harmonics
 * @param {number} [spec.rotation]  rotates the whole layout, radians
 * @returns {Array<{x: number, z: number}>} closed ring of control points
 */
export function radialLoop({ radius, harmonics, rotation = 0 }) {
  const total = harmonics.reduce((sum, harmonic) => sum + Math.abs(harmonic.amplitude), 0);
  if (total > SUMMED_AMPLITUDE) {
    throw new Error(
      `Harmonic amplitudes (${(total * 100).toFixed(1)}% of radius) exceed the ` +
        `${SUMMED_AMPLITUDE * 100}% budget and would fold the loop over itself.`
    );
  }
  if (radius < 120) {
    throw new Error(`Circuit radius ${radius}m is too small to build a lap from.`);
  }

  const points = [];
  for (let i = 0; i < CONTROL_POINT_COUNT; i += 1) {
    const t = (i / CONTROL_POINT_COUNT) * Math.PI * 2;
    let r = radius;
    for (const harmonic of harmonics) {
      r += radius * harmonic.amplitude * Math.cos(harmonic.order * t + (harmonic.phase ?? 0));
    }
    const angle = t + rotation;
    points.push({ x: Math.cos(angle) * r, z: Math.sin(angle) * r });
  }
  return points;
}

/**
 * Build a corner profile from a list of `{ at, radius }` pins.
 *
 * This is the form circuit designers actually think in: "there is a hairpin
 * around 100 degrees and the back straight runs from 200 to 300 degrees". The
 * pins are turned into a smooth profile with cosine falloff, which reads far
 * better in the circuit table than a Fourier series would.
 *
 * @param {number} baseRadius
 * @param {Array<{at: number, radius: number, width?: number}>} pins degrees around the lap
 * @param {number} [samples] pins per lap
 */
export function profileFromPins(baseRadius, pins, samples = CONTROL_POINT_COUNT) {
  const sorted = [...pins].sort((a, b) => a.at - b.at);
  const radiusAt = (degrees) => {
    const t = ((degrees % 360) + 360) % 360;
    // Nearest pin by angular distance, then smooth falloff around it.
    let best = sorted[0];
    let bestGap = Infinity;
    for (const pin of sorted) {
      const gap = Math.abs(((pin.at - t + 540) % 360) - 180);
      if (gap < bestGap) {
        bestGap = gap;
        best = pin;
      }
    }
    const spread = best.spread ?? 55;
    if (bestGap >= spread) return baseRadius;
    // Raised cosine: C1 at the edges, so curvature stays continuous.
    const blend = 0.5 + 0.5 * Math.cos((bestGap / spread) * Math.PI);
    return baseRadius + (best.radius - baseRadius) * blend;
  };

  const points = [];
  for (let i = 0; i < samples; i += 1) {
    const degrees = (i / samples) * 360;
    const r = clamp(radiusAt(degrees), baseRadius * 0.34, baseRadius * 1.5);
    points.push({ x: Math.cos((degrees * Math.PI) / 180) * r, z: Math.sin((degrees * Math.PI) / 180) * r });
  }
  return points;
}