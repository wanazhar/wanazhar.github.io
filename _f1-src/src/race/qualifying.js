/**
 * Real qualifying: Q1, Q2, Q3, with eliminations.
 *
 * What this replaces
 * ------------------
 * Qualifying used to be a three-lap race with the start lights switched off. Every car ran
 * on track at the same time, nobody was eliminated, and the grid was every car's best lap
 * sorted ascending. That is not qualifying -- it is a time trial with a grid at the end of
 * it. Two things follow from being wrong:
 *
 *   1. There is no reason for a lap to matter differently from another. In real qualifying
 *      a driver's lap has to be a *flying* lap: out on cold tyres, learn the circuit, then
 *      commit. Here the fastest lap was whichever of three happened to be quick.
 *   2. Nobody is ever out. The tension that makes qualifying a session -- a full field and
 *      five cars going home -- does not exist.
 *
 * The format
 * ----------
 * Segments of five eliminations, which is the shape F1 actually uses. With a 23-car field:
 *
 *     Q1   23 cars, 5 eliminated  ->  18 remain
 *     Q2   18 cars, 5 eliminated  ->  13 remain
 *     Q3   13 cars fight for pole
 *
 * A driver's result is the *best* lap they set across every segment they appeared in, so
 * being quick in Q1 and then falling out in Q2 still counts for Q1 -- which is why the
 * knockout is a risk rather than a formality.
 *
 * This module is deliberately free of session and UI code: it is pure state, so the format
 * can be tested without a browser, and so the rules live in one readable place rather than
 * being spread through the session lifecycle.
 */

/** Laps a driver gets in a segment: one out lap, one flying lap, one in lap. */
export const QUALIFYING_LAPS = 3;

/** How many are knocked out at the end of each segment. The last segment eliminates nobody. */
export const QUALIFYING_ELIMINATIONS = [5, 5, 0];

/** Guard against a field too small to knock anyone out. */
const MIN_FIELD = 6;

export function segmentCount() {
  return QUALIFYING_ELIMINATIONS.length;
}

export function segmentName(index) {
  return `Q${index + 1}`;
}

/**
 * Start a qualifying session.
 *
 * @param {object[]} entries the full field
 */
export function createQualifying(entries) {
  return {
    segment: 0,
    /** Entries still in, in championship order. */
    remaining: entries.slice(),
    /** Best lap per entry short code, across every segment so far. */
    best: new Map(),
    /** Per segment: how many ran, who went home, and who was quickest. */
    history: []
  };
}

/** The entries that run in the current segment. */
export function entriesForSegment(qualifying) {
  return qualifying.remaining;
}

/** Is this qualifying over? */
export function isComplete(qualifying) {
  return qualifying.segment >= QUALIFYING_ELIMINATIONS.length;
}

/**
 * Fold a finished segment's results into the qualifying state and eliminate.
 *
 * A car is eliminated if it is slower than the cars that survive. Ties break on entry order
 * so the result is reproducible rather than dependent on sort stability.
 *
 * @param {object} qualifying
 * @param {{entry: object, bestLap: number|null}[]} results of the segment just run
 * @returns {{eliminated: string[], advancing: string[]}}
 */
export function applySegment(qualifying, results) {
  const index = qualifying.segment;
  const eliminations = QUALIFYING_ELIMINATIONS[index] ?? 0;

  /*
   * A car that produced no result at all -- crashed on the out lap, never took the start --
   * is out on the same terms as one that set no time.
   *
   * Without this it would silently never appear in `results`, never be ranked and never go
   * home, so it would simply reappear in the next segment as though nothing had happened.
   */
  const reported = new Set(results.map((result) => result.entry));
  const missing = qualifying.remaining
    .filter((entry) => !reported.has(entry))
    .map((entry) => ({ entry, bestLap: Infinity }));

  const ranked = [...results, ...missing]
    .map((result) => ({
      entry: result.entry,
      lap: Number.isFinite(result.bestLap) ? result.bestLap : Infinity,
      order: qualifying.remaining.indexOf(result.entry)
    }))
    .sort((a, b) => (a.lap - b.lap) || (a.order - b.order));

  // Keep the fastest; everyone past the cut goes home. The field shrinks to MIN_FIELD so a
  // small grid never eliminates down to nothing.
  const cut = Math.max(qualifying.remaining.length - eliminations, MIN_FIELD);
  const surviving = ranked.slice(0, cut);
  const eliminated = ranked.slice(cut);

  for (const row of surviving) qualifying.best.set(row.entry.short, row.lap);

  const eliminatedNames = eliminated.map((r) => r.entry.short);
  qualifying.remaining = surviving.map((r) => r.entry);
  qualifying.history.push({
    segment: segmentName(index),
    entries: qualifying.remaining.length + eliminated.length,
    eliminated: eliminatedNames,
    fastest: surviving[0] ? { short: surviving[0].entry.short, lap: surviving[0].lap } : null
  });
  qualifying.segment += 1;

  return {
    eliminated: eliminatedNames,
    advancing: surviving.map((r) => r.entry.short)
  };
}

/** Every entry that set a time, fastest first. */
export function classification(qualifying) {
  return [...qualifying.best.entries()]
    .map(([short, lap]) => ({ short, lap }))
    .sort((a, b) => a.lap - b.lap);
}

/**
 * The race grid.
 *
 * Eliminated drivers still have a time from an earlier segment and still start -- that is
 * the whole point of knocking people out rather than disqualifying them.
 */
export function gridFrom(qualifying) {
  return classification(qualifying).map((row) => row.short);
}