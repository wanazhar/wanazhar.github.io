/**
 * The garage persists the best run score it has seen. `save()` reports the
 * current run's score; saving a worse run must not lower the stored value,
 * and a missing/absent one must not turn into NaN.
 */
export function nextHighScore(current, run) {
  const best = Number.isFinite(Number(current)) ? Math.round(Number(current)) : 0;
  const candidate = Number.isFinite(Number(run)) ? Math.round(Number(run)) : 0;
  return Math.max(best, candidate);
}
