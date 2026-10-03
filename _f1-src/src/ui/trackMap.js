/**
 * Track map preview.
 *
 * An SVG outline of the circuit, drawn from the same centreline the track is
 * actually built from, so the shape on the selection screen is the shape you race.
 * It is not an illustration of a circuit -- it *is* the circuit.
 *
 * The path is generated once per circuit and cached as a string. Every venue card
 * on the selection screen would otherwise re-project several hundred points while
 * the menu is opening.
 *
 * Orientation is normalised so the start/finish line is on the right and the lap
 * reads left-to-right, which is how circuit maps are conventionally drawn and how
 * people expect to read one.
 */

/** SVG viewBox dimensions. Square, so every circuit is drawn to the same scale. */
const VIEW = 100;

/** Inset so the outline is not flush against the edge of the viewBox. */
const PADDING = 6;

/**
 * Rotate a centreline so the start/finish straight always points the same way.
 *
 * The rotation is taken from the *tangent at the start line*, not from the position
 * of the first point. Anchoring on position made the drawn orientation depend on
 * where the circuit happens to sit in its source coordinate frame: two identical
 * layouts offset by 900m came out rotated differently from each other, which makes
 * the preview grid incoherent and two circuits impossible to compare by eye.
 *
 * Anchoring on the tangent is translation-invariant, so every circuit in the
 * calendar is drawn start-line-left, running right, regardless of its source.
 *
 * @param {{x: number, z: number}[]} points
 */
function rotateToStartLine(points) {
  const first = points[0];
  const second = points[points.length > 1 ? 1 : 0];
  const tangentAngle = Math.atan2(second.z - first.z, second.x - first.x);
  // Rotate the tangent onto +x.
  const rotation = -tangentAngle;
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  return points.map((point) => ({ x: point.x * cos - point.z * sin, z: point.x * sin + point.z * cos }));
}

/**
 * Project a centreline into a normalised, start-line-right SVG path.
 *
 * @param {{x: number, z: number}[]} points
 * @param {number} length lap length in metres, used to find the start line
 * @returns {string} SVG path data
 */
export function trackMapPath(points, length) {
  if (!points?.length) return '';

  const rotated = rotateToStartLine(points);

  // Fit to the viewBox, preserving aspect ratio so a long circuit is not stretched
  // into a square it is not.
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const point of rotated) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.z < minZ) minZ = point.z;
    if (point.z > maxZ) maxZ = point.z;
  }
  const spanX = Math.max(maxX - minX, 1e-6);
  const spanZ = Math.max(maxZ - minZ, 1e-6);
  const span = Math.max(spanX, spanZ);
  const usable = VIEW - PADDING * 2;
  const scale = usable / span;
  const offsetX = PADDING + (usable - spanX * scale) / 2;
  const offsetZ = PADDING + (usable - spanZ * scale) / 2;

  // SVG y grows downward; the world's z grows "up the screen". Flip so north is up.
  const project = (point) => ({
    x: offsetX + (point.x - minX) * scale,
    y: offsetZ + (maxZ - point.z) * scale
  });

  const projected = rotated.map(project);
  return projected
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ') + ' Z';
}

/**
 * Where the start/finish line falls on the drawn map, so the preview can mark it.
 * @returns {{x: number, y: number}}
 */
export function startLinePoint(points) {
  if (!points?.length) return { x: 0, y: 0 };
  const rotated = rotateToStartLine(points);
  const first = rotated[0];

  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const point of rotated) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.z < minZ) minZ = point.z;
    if (point.z > maxZ) maxZ = point.z;
  }
  const span = Math.max(maxX - minX, maxZ - minZ, 1e-6);
  const scale = (VIEW - PADDING * 2) / span;
  return {
    x: PADDING + (first.x - minX) * scale + ((VIEW - PADDING * 2) - (maxX - minX) * scale) / 2,
    y: PADDING + (maxZ - first.z) * scale + ((VIEW - PADDING * 2) - (maxZ - minZ) * scale) / 2
  };
}

const pathCache = new Map();

/**
 * Cached map path for a circuit.
 * @param {string} id
 * @param {{x: number, z: number}[]} points
 * @param {number} length
 */
export function cachedTrackMapPath(id, points, length) {
  if (!pathCache.has(id)) pathCache.set(id, trackMapPath(points, length));
  return pathCache.get(id);
}

/**
 * A reusable world-to-map projection.
 *
 * `trackMapPath` projects and immediately throws the numbers away, which is right for
 * drawing a static outline and useless for putting a moving dot on it. The minimap has
 * to project a car position every frame, so it needs the same transform as a function
 * it can call repeatedly -- and critically, it must be the *same* transform as the
 * outline, or the dots drift off the line they belong to.
 *
 * That is the whole reason this exists rather than a second projection written for the
 * minimap: two projections of the same circuit that disagree by a rotation or a scale
 * would look plausible and be wrong.
 */
export class TrackProjection {
  /**
   * @param {{x: number, z: number}[]} points the circuit centreline
   */
  constructor(points) {
    this.points = points;
    const rotated = rotateToStartLine(points);

    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (const point of rotated) {
      if (point.x < minX) minX = point.x;
      if (point.x > maxX) maxX = point.x;
      if (point.z < minZ) minZ = point.z;
      if (point.z > maxZ) maxZ = point.z;
    }

    const spanX = maxX - minX;
    const spanZ = maxZ - minZ;
    const span = Math.max(spanX, spanZ, 1e-6);
    const usable = VIEW - PADDING * 2;
    this.scale = usable / span;
    this.offsetX = PADDING + (usable - spanX * this.scale) / 2;
    this.offsetZ = PADDING + (usable - spanZ * this.scale) / 2;
    this.minX = minX;
    this.maxZ = maxZ;
    this.cos = Math.cos(ROTATION_CACHED(points));
    this.sin = Math.sin(ROTATION_CACHED(points));
  }

  /**
   * Project a world position into viewBox coordinates.
   * @param {number} x
   * @param {number} z
   * @returns {{x: number, y: number}}
   */
  project(x, z) {
    const rx = x * this.cos - z * this.sin;
    const rz = x * this.sin + z * this.cos;
    return {
      x: this.offsetX + (rx - this.minX) * this.scale,
      // SVG y grows downward; the world's z grows "up the screen".
      y: this.offsetZ + (this.maxZ - rz) * this.scale
    };
  }
}

/**
 * The rotation `rotateToStartLine` applies, so a projection can apply the same one.
 *
 * Rotating twice would be wasteful and rotating inconsistently would put the dots on a
 * different circuit from the outline, so the angle is derived from the same two points
 * the rotation uses rather than stored alongside it.
 */
function ROTATION_CACHED(points) {
  const first = points[0];
  const second = points[points.length > 1 ? 1 : 0];
  return -Math.atan2(second.z - first.z, second.x - first.x);
}
