/**
 * 1-D sweep test for the axis the world travels along.
 *
 * The world advances `speed * deltaSeconds` units per frame, and MAX_DELTA
 * caps that at BASE_WORLD_SPEED * 3.15 * 1/30 ≈ 1.89 units at full speed —
 * wider than a coin's collection window (1.24) or a power-up's (1.84). A
 * point-in-time test only looks at where an object landed, so one that flew
 * across the player between two frames is silently skipped, frame-rate
 * dependently. Testing the whole segment it travelled catches every crossing.
 *
 * `previous`/`next` are the object's positions at the ends of the frame (any
 * order), `center`/`half` describe the player's window on the same axis.
 */
export function sweptWindowHit(previous, next, center, half) {
  return Math.min(previous, next) <= center + half && Math.max(previous, next) >= center - half;
}
