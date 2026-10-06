/**
 * Real elevation for every circuit.
 *
 * ## Why this was not done earlier
 *
 * Not because it is impossible -- because the two obvious sources both come up empty,
 * and guessing would have been worse than leaving it flat:
 *
 * - **OSM `ele` tags.** Queried directly: Monza's raceway is 216 nodes and *none* of
 *   them carry elevation. Raceways are not routinely surveyed with height in OSM.
 * - **The published centrelines.** The CSV mirrors the geometry comes from have no
 *   elevation column at all.
 *
 * So the real path is two stages: OSM for *where* the circuit goes, and a Digital
 * Elevation Model for *how high* it is. This script does exactly that, per circuit:
 *
 *   1. Overpass, for the `highway=raceway` ways near the circuit's real coordinates.
 *   2. Open-Meteo's elevation API, for a DEM reading at every one of those nodes.
 *   3. Project each node onto our own centreline, so the profile is keyed by lap
 *      distance rather than by OSM's node ordering -- the two start in different
 *      places and must not be assumed to agree.
 *   4. Smooth, heavily. See below.
 *
 * ## Smoothing, and why it is not cheating
 *
 * SRTM-resolution DEM data is ~30m horizontally and has metre-scale noise that has no
 * business being in a racing surface. Sampled every 25m along the lap, the raw profile
 * is a jagged mess, and feeding it to the physics directly would make cars bounce
 * over bumps that do not exist.
 *
 * Real circuits are graded surfaces on real hills: the elevation change across a lap
 * is real and the metre-scale noise is not. A wide circular moving average keeps the
 * former and discards the latter, which is what a circuit builder does anyway. The
 * smoothing width is stated in the output so the choice is visible rather than buried.
 *
 * ## Elevation source
 *
 * Originally Open-Meteo's elevation API, which rate-limits: a full run got three circuits and
 * spent the rest of its retries being refused, and because a missing circuit renders flat, the
 * run looked like it had simply not found those tracks.
 *
 * Now AWS Terrarium terrain tiles (SRTM, ASTGTM2, NED and others), fetched at z13 and decoded
 * here. No API key and no request-rate limit, so a circuit fails one tile at a time and loudly
 * instead of the run quietly producing fewer circuits. Verified against Open-Meteo at eight
 * points across four continents before use: agreement within 0.1-11 m.
 *
 * ## Attribution
 *
 * Geometry: OpenStreetMap contributors, ODbL.
 * Elevation: AWS `elevation-tiles-prod` Terrarium tiles.
 *
 * Run: node scripts/fetch-elevation.mjs            # only the missing circuits
 *     node scripts/fetch-elevation.mjs --force    # all of them
 */

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { centrelineFor } from '../src/track/circuitData.js';
import { CIRCUITS } from '../src/track/circuits.js';
import { sampleElevation } from './lib/elevationSource.mjs';

/**
 * Circuit centres, and a search radius.
 *
 * Hand-entered rather than derived, because there is no reliable machine-readable
 * source of "where is each F1 circuit" that is not a list someone maintains by hand
 * anyway. The radius is generous on purpose: OSM's `highway=raceway` tagging is
 * inconsistent between circuits, so a tight radius finds nothing at half of them and a
 * 2km search finds the circuit whatever it is tagged as.
 */
const LOCATIONS = {
  bahrain: [26.0328, 50.5106],
  jeddah: [21.6319, 39.1044],
  melbourne: [-37.8497, 144.968],
  sepang: [2.76083, 101.738],
  suzuka: [34.8431, 136.5407],
  shanghai: [31.3389, 121.22],
  miami: [25.9581, -80.2389],
  imola: [44.3439, 11.7167],
  monaco: [43.7347, 7.42056],
  montreal: [45.5, -73.5228],
  barcelona: [41.57, 2.26111],
  spielberg: [47.2197, 14.7647],
  silverstone: [52.0786, -1.01694],
  hungaroring: [47.5789, 19.2486],
  spa: [50.4372, 5.97139],
  zandvoort: [52.3888, 4.54092],
  monza: [45.6156, 9.28111],
  baku: [40.3725, 49.8533],
  singapore: [1.2914, 103.864],
  austin: [30.1328, -97.6411],
  mexico: [19.4042, -99.0907],
  interlagos: [-23.7036, -46.6997],
  vegas: [36.1147, -115.173],
  yasmarina: [24.4672, 54.6031]
};

/**
 * Overpass endpoints, tried in order.
 *
 * The public instance is frequently saturated -- during this work it answered
 * `runtime error: ... Dispatcher_Client::request_read_and_idx::timeout` for every query, and
 * then began timing out entirely. A single hard-coded endpoint turns "the mirror is busy" into
 * "this circuit has no elevation", which is the failure mode this whole script exists to
 * avoid. So the mirrors are rotated and each one is tried before giving up on a circuit.
 */
const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.private.coffee/api/interpreter'
];

/**
 * OSM tag patterns that identify a circuit's racing surface, in order of preference.
 *
 * `highway=raceway` is the correct tag and covers most of the calendar. It is not universal:
 * Melbourne's Albert Park is not tagged as a raceway at all -- verified, `way(around:2200,
 * -37.8497,144.968)["highway"="raceway"]` returns a count of 0 -- because it is a public road
 * circuit inside a park, and mappers tagged the park instead. `leisure=track` finds 16 ways
 * there.
 *
 * Nothing broader than `highway=track` is in this list. An earlier version had `["sport"]` as
 * a final fallback, which matches *any* sport-tagged way: it returned 81 ways at Interlagos
 * and produced a smooth, entirely plausible 27m profile with no indication that it had found
 * the surrounding sports complex rather than the circuit. A wrong answer that looks right is
 * worse than a missing one, so the chain stops where the tags stop meaning "a road you race
 * on", and `verifyLapLength` is the backstop for everything that slips through.
 */
/**
 * Circuits whose traced geometry does not match the circuit, measured and refused.
 *
 * `silverstone`: the 95 `highway=raceway` ways within 2km of the Grand Prix circuit include
 * enough of the rest of the Silverstone estate to pass the extent check, and the resulting
 * profile came out at 154.4-156.1m -- 1.7m of relief. Sampling the DEM directly at real points
 * around the actual circuit gives 146.2-157.3m, about 11.1m, so the profile understates the
 * relief by roughly 6x. Smoothing is not the cause: re-smoothing the profile at +/-3 points
 * still only gives 1.6m, so the trace itself is flat.
 *
 * Refused rather than shipped. A wrong profile is worse than a missing one, because a missing
 * circuit renders flat *honestly* while a wrong one renders a real circuit incorrectly -- and
 * at Silverstone that silently removes the Chapel and Maggotts/Becketts changes of elevation.
 *
 * To restore it, the geometry needs to come from a trace that is actually the Grand Prix loop
 * (a relation rather than a bag of ways, or a manual way id list), not from a proximity query.
 */
const REFUSED = new Set(['silverstone']);

const RACEWAY_QUERIES = [
  '["highway"="raceway"]',
  '["leisure"="track"]',
  '["highway"="track"]'
];
const ELEVATION = 'https://api.open-meteo.com/v1/elevation';
const USER_AGENT = 'ApexGP/1.0';

const OUTPUT = fileURLToPath(new URL('../src/track/elevationData.js', import.meta.url));
const CACHE = fileURLToPath(new URL('../.circuit-cache/', import.meta.url));

/**
 * Where decoded terrain tiles are cached between runs.
 *
 * This is the whole reason a re-run is cheap: a full season of profiles is a few hundred
 * distinct tiles, and once they are on disk the fetch is pure arithmetic.
 */
const TILE_CACHE = fileURLToPath(new URL('../.circuit-cache/tiles/', import.meta.url));

/** Lookup radius for the circuit's ways, metres. Generous: OSM tagging varies by circuit. */
const SEARCH_RADIUS = 2200;

/**
 * Moving-average half-width, in *lap samples*.
 *
 * A wide window on purpose: at DEM resolution the useful signal is the tens-of-metres
 * hill and the noise is metre-scale, so a narrow window would pass the noise through
 * and a wide one keeps only the hill.
 */
const SMOOTH_SAMPLES = 26;

/** Output resolution: elevation samples around the lap. */
const PROFILE_POINTS = 240;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Overpass, with a User-Agent and backoff.
 *
 * Without a User-Agent the endpoint returns 406. It also rate-limits: a full run is 24
 * spatial queries, which is enough to earn a 429 or a 504 if they go out back to back.
 * Both are retried with growing gaps, because both are transient and neither is a
 * reason to lose a circuit.
 */
async function overpass(query, attempt = 0) {
  // Mirror N is chosen by the attempt count, so retries walk the list rather than hammering
  // whichever endpoint happened to be busy first.
  const endpoint = OVERPASS_MIRRORS[attempt % OVERPASS_MIRRORS.length];
  const url = `${endpoint}?data=${encodeURIComponent(`[out:json][timeout:90];${query}`)}`;
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (response.status === 429 || response.status === 504 || response.status === 503) {
    if (attempt >= OVERPASS_MIRRORS.length * 2) {
      throw new Error(`overpass HTTP ${response.status} after ${attempt + 1} attempts`);
    }
    await sleep(6000 * 2 ** (attempt % 3));
    return overpass(query, attempt + 1);
  }
  if (!response.ok) throw new Error(`overpass HTTP ${response.status}`);
  const json = await response.json();
  return json.elements ?? [];
}

/**
 * DEM elevation for a list of [lat, lon] pairs.
 *
 * Retries 429 and 5xx with exponential backoff. A free public endpoint will rate-limit
 * a batch run across 24 circuits, and treating that as a hard failure means the whole
 * fetch produces nothing -- which is what happened on the first attempt: 24 circuits,
 * 24 identical 429s, zero data.
 */
async function elevations(pairs) {
  const heights = await sampleElevation(pairs, TILE_CACHE);
  return pairs.map(([lat, lon], index) => [lat, lon, heights[index]]);
}

/**
 * Nearest point on a closed polyline, returned as a lap fraction.
 *
 * The profile has to be keyed by lap distance, not by OSM node order: the OSM way and
 * our centreline start in completely different places, and pairing them by index would
 * produce a plausible, smoothly-varying, completely wrong profile.
 *
 * @param {{x: number, z: number}[]} points our centreline, in track metres
 * @param {number} x
 * @param {number} z
 */
function lapFractionAt(points, x, z) {
  let best = Infinity;
  let bestIndex = 0;
  let bestT = 0;

  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const lengthSquared = dx * dx + dz * dz;
    if (lengthSquared === 0) continue;
    // Projection parameter, clamped so a point beyond a segment snaps to its end.
    let t = ((x - a.x) * dx + (z - a.z) * dz) / lengthSquared;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const px = a.x + dx * t;
    const pz = a.z + dz * t;
    const distance = (x - px) ** 2 + (z - pz) ** 2;
    if (distance < best) {
      best = distance;
      bestIndex = i;
      bestT = t;
    }
  }

  const segment = points[(bestIndex + 1) % points.length];
  const total = cumulativeLength(points);
  const soFar = cumulativeBefore(points, bestIndex) + Math.hypot(segment.x - points[bestIndex].x, segment.z - points[bestIndex].z) * bestT;
  return total > 0 ? (soFar / total) % 1 : 0;
}

let lengthCache = null;
let prefixCache = null;

/** Total length of the centreline, metres. */
function cumulativeLength(points) {
  if (lengthCache) return lengthCache;
  let total = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    total += Math.hypot(b.x - a.x, b.z - a.z);
  }
  lengthCache = total;
  return total;
}

/** Cumulative distance at each sample, for O(1) lookup of "distance before i". */
function cumulativeBefore(points, index) {
  if (!prefixCache) {
    const prefix = [0];
    for (let i = 1; i < points.length; i += 1) {
      prefix[i] = prefix[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].z - points[i - 1].z);
    }
    prefixCache = prefix;
  }
  return prefixCache[index] ?? 0;
}

/**
 * Smooth a lap-indexed profile with a circular moving average.
 * @param {number[]} values one per profile point, in lap order
 */
function smoothCircular(values, halfWidth) {
  const n = values.length;
  const out = new Array(n);
  for (let i = 0; i < n; i += 1) {
    let sum = 0;
    let count = 0;
    for (let k = -halfWidth; k <= halfWidth; k += 1) {
      const value = values[(i + k + n) % n];
      if (value === null || value === undefined) continue;
      sum += value;
      count += 1;
    }
    out[i] = count ? sum / count : values[i];
  }
  return out;
}

/**
 * Fetch one circuit's profile.
 * @returns {Promise<{id: string, profile: number[], min: number, max: number}|null>}
 */
async function buildProfile(id, centre, points, force) {
  /*
   * Ahead of the cache check, not after it: a refused circuit with a cache entry would
   * otherwise return the stale profile and quietly stay in the output.
   */
  if (REFUSED.has(id)) {
    console.log(`  ${id.padEnd(14)} refused: traced geometry does not match the circuit`);
    return null;
  }

  const cacheFile = `${CACHE}elev-${id}.json`;
  if (!force && (await exists(cacheFile))) {
    try {
      const cached = JSON.parse(await readFile(cacheFile, 'utf8'));
      if (Array.isArray(cached.profile) && cached.profile.length) {
        console.log(`  ${id.padEnd(14)} cached  ${cached.min.toFixed(0)}-${cached.max.toFixed(0)}m`);
        return cached;
      }
    } catch {
      // A corrupt cache entry is not worth failing over; refetch instead.
    }
  }

  const [lat, lon] = centre;
  /*
   * Try each way of tagging a racing surface until one returns something.
   *
   * Melbourne is the case that forced this: Albert Park carries no `highway=raceway` at all
   * within 2km, because it is a public road circuit in a park and mappers tagged the park.
   */
  let ways = [];
  let matched = null;
  for (const filter of RACEWAY_QUERIES) {
    /*
     * Two failures that must not be confused.
     *
     * "The query succeeded and found nothing" means this circuit is tagged that other way, and
     * the next filter is the right move. "The query failed" means we do not know, and moving
     * on is how Bahrain ended up with a profile traced from `highway=track` on a run where the
     * raceway query merely timed out -- a plausible, smooth, and wrongly-sourced answer.
     *
     * So a failed query is retried against the other mirrors before the filter is abandoned.
     */
    ways = [];
    for (let attempt = 0; attempt < OVERPASS_MIRRORS.length; attempt += 1) {
      try {
        ways = await overpass(`way(around:${SEARCH_RADIUS},${lat},${lon})${filter};out geom;`, attempt);
        break;
      } catch (error) {
        if (attempt === OVERPASS_MIRRORS.length - 1) {
          console.log(`  ${id.padEnd(14)} ${filter} unavailable on all mirrors: ${error.message}`);
        }
      }
    }
    if (ways.length) {
      matched = filter;
      break;
    }
  }
  if (!ways.length) {
    console.log(`  ${id.padEnd(14)} NO OSM DATA (searched ${SEARCH_RADIUS}m around ${lat},${lon})`);
    return null;
  }
  /*
   * Does this geometry actually form the circuit?
   *
   * The tag fallback can only tell you that *something* tagged that way is nearby.
   * `highway=track` matches a farm track, `leisure=track` matches a park path, and either will
   * happily produce a smooth, entirely plausible profile of the wrong place.
   *
   * Measured by **extent**, not by summed way length. Summing is wrong in a way that looked
   * plausible: a circuit is usually mapped as several ways that overlap at the junctions and
   * share access roads, so the sum double-counts. Measured, it rejected Monza as 12.30km
   * traced against 5.793km real -- rejecting 12 of 22 circuits that the previous run had
   * fetched successfully.
   *
   * Extent is invariant to how the lap is split into ways, and strongly sensitive to tracing
   * the wrong feature, which is exactly the property wanted here. Real circuits sit at an
   * extent-to-lap-length ratio of roughly 0.25-0.65 (Monza ~0.31, Monaco ~0.24, Silverstone
   * ~0.61), so the bounds below accept a real circuit and reject both a park footpath
   * (too small) and a whole district (too big).
   */
  const real = CIRCUITS.find((entry) => entry.id === id)?.length;
  if (Number.isFinite(real)) {
    const MPD_LAT = 111320;
    const cosLat = Math.cos((centre[0] * Math.PI) / 180);
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const way of ways) {
      for (const node of way.geometry ?? []) {
        const x = (node.lon - centre[1]) * MPD_LAT * cosLat;
        const y = (node.lat - centre[0]) * MPD_LAT;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    const extent = Math.hypot(maxX - minX, maxY - minY);
    const ratio = extent / (real * 1000);
    if (!(ratio >= 0.12 && ratio <= 0.95)) {
      console.log(
        `  ${id.padEnd(14)} REJECTED geometry: extent ${(extent / 1000).toFixed(2)}km against a real ${real}km lap (ratio ${ratio.toFixed(2)}, want 0.12-0.95)`
      );
      return null;
    }
  }

  if (matched !== RACEWAY_QUERIES[0]) {
    // Worth saying out loud: this circuit's profile came from a less specific tag, so it is
    // worth more scrutiny than one found by the obvious one.
    console.log(`  ${id.padEnd(14)} found via ${matched} (${ways.length} ways)`);
  }

  // Gather nodes. Overpass returns them per way; dedupe on lat/lon to 1cm.
  const nodes = new Map();
  for (const way of ways) {
    for (const node of way.geometry ?? []) {
      if (typeof node.lat !== 'number' || typeof node.lon !== 'number') continue;
      const key = `${node.lat.toFixed(5)},${node.lon.toFixed(5)}`;
      if (!nodes.has(key)) nodes.set(key, [node.lat, node.lon]);
    }
  }
  if (nodes.size < 20) {
    console.log(`  ${id.padEnd(14)} only ${nodes.size} OSM nodes, not enough for a profile`);
    return null;
  }

  const samples = await elevations([...nodes.values()]);
  if (samples.length < 20) {
    console.log(`  ${id.padEnd(14)} only ${samples.length} DEM readings`);
    return null;
  }

  /*
   * Project onto our centreline.
   *
   * `project` maps world metres to metres. OSM gives degrees, so a local equirectangular
   * projection is applied first: over a 6km circuit the error in a naive degrees-as-metres
   * conversion is larger than the circuit.
   */
  const METRES_PER_DEGREE_LAT = 111320;
  const cosLat = Math.cos((centre[0] * Math.PI) / 180);
  const origin = points[0];
  const local = points.map((point) => ({
    x: point.x - origin.x,
    z: point.z - origin.z
  }));
  const trackLength = cumulativeLength(local);

  // Bin the DEM readings by lap fraction.
  const buckets = new Array(PROFILE_POINTS).fill(null).map(() => []);
  let rejects = 0;
  for (const [sampleLat, sampleLon, elevation] of samples) {
    if (!Number.isFinite(elevation)) continue;
    const dx = (sampleLon - centre[1]) * METRES_PER_DEGREE_LAT * cosLat;
    const dz = (sampleLat - centre[0]) * METRES_PER_DEGREE_LAT;
    // Reject readings nowhere near the circuit: Overpass returned something once and a
    // stray node at 5km would drag a whole bucket with it.
    if (Math.hypot(dx, dz) > trackLength) {
      rejects += 1;
      continue;
    }
    const fraction = lapFractionAt(local, dx, dz);
    buckets[Math.min(PROFILE_POINTS - 1, Math.floor(fraction * PROFILE_POINTS))].push(elevation);
  }

  const raw = buckets.map((bucket) =>
    bucket.length ? bucket.reduce((a, b) => a + b, 0) / bucket.length : null
  );
  // Fill empty buckets from the nearest filled neighbour, so a sparse stretch does not
  // punch a hole in the profile.
  const known = raw.map((value, index) => ({ value, index })).filter((entry) => entry.value !== null);
  /*
   * A low fill threshold, deliberately.
   *
   * Street circuits fill few buckets because OSM's node density is uneven along a
   * circuit threading between buildings: Monaco returned 32 of 240 and was being
   * rejected, when 32 readings spread around the lap is a perfectly good profile once
   * the gaps are filled below from the nearest real reading. Sparse is not the same as
   * absent, and rejecting sparse threw away good data.
   */
  if (known.length < 12) {
    console.log(`  ${id.padEnd(14)} only ${known.length}/${PROFILE_POINTS} profile buckets filled`);
    return null;
  }
  for (let i = 0; i < PROFILE_POINTS; i += 1) {
    if (raw[i] !== null) continue;
    let nearest = known[0];
    let nearestDistance = Infinity;
    for (const entry of known) {
      let distance = Math.abs(entry.index - i);
      distance = Math.min(distance, PROFILE_POINTS - distance);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = entry;
      }
    }
    raw[i] = nearest.value;
  }

  const smoothed = smoothCircular(raw, SMOOTH_SAMPLES);
  const profile = smoothed.map((value) => Math.round(value * 10) / 10);
  const min = Math.min(...profile);
  const max = Math.max(...profile);

  await mkdir(CACHE, { recursive: true });
  await writeFile(cacheFile, JSON.stringify({ id, profile, min, max, nodes: samples.length }));

  console.log(
    `  ${id.padEnd(14)} ${String(samples.length).padStart(4)} DEM readings` +
      `${rejects ? ` (${rejects} rejected as off-circuit)` : ''}` +
      ` -> ${(max - min).toFixed(0)}m range, ${min.toFixed(0)}-${max.toFixed(0)}m`
  );
  return { id, profile, min, max };
}

/**
 * Write whatever has been collected so far.
 *
 * Written after every circuit, not once at the end. The first version wrote once, and a
 * run interrupted part way through -- which is exactly what a rate-limited run does --
 * left an empty file and threw away everything it had fetched. Progress now survives
 * being killed, which is the only thing that makes a script this slow usable.
 */
/** Parse the profiles already published, so they can be compared against and preserved. */
async function readExistingProfiles() {
  try {
    const source = await readFile(OUTPUT, 'utf8');
    const body = source.slice(source.indexOf('ELEVATION = {') + 'ELEVATION ='.length);
    const object = body.slice(body.indexOf('{'), body.lastIndexOf('};') + 1);
    // Generated keys are bare identifiers; quote both levels, circuit id and `profile`.
    const parsed = JSON.parse(
      object.replace(/^(\s*)([a-z]+):/gm, '$1"$2":').replace(/\bprofile:/g, '"profile":')
    );
    const out = {};
    for (const [id, entry] of Object.entries(parsed)) {
      if (Array.isArray(entry?.profile) && !REFUSED.has(id)) out[id] = { profile: entry.profile };
    }
    console.log(`seeding from ${Object.keys(out).length} existing profile(s)`);
    return out;
  } catch (error) {
    console.log(`no existing profiles to seed from (${error.message})`);
    return {};
  }
}

async function writeOutput(collected) {
  /*
   * Never publish a profile that is worse than one already published.
   *
   * The DEM is higher resolution than the source the first seven circuits came from, so over
   * equivalent geometry it can only add relief, not remove it. A *smaller* range therefore
   * means the trace missed part of the lap -- and it did, three times:
   *
   *     monaco    37.6m -> 22.6m   from 137 DEM readings
   *     montreal   6.1m ->  1.2m   from 269
   *     miami      1.3m ->  0.2m   from 331
   *
   * against 1766 readings for Silverstone, which came out fine. Sparse geometry is the cause,
   * so the sparse result is kept out and the previous one is retained. Anything that genuinely
   * got flatter -- a quarry, a regraded circuit -- is vanishingly unlikely and would show up in
   * this report, so it is not silently swallowed.
   */
  let restored = 0;
  try {
    /*
     * Extract just the object literal. Parsing the file as a module was the first attempt and
     * it failed silently -- this file has two exports, not one, so the whole thing never became
     * valid JSON and the catch below quietly disabled the guard while it looked like it was
     * running. A guard that cannot fail loudly is not a guard, so the parse is checked.
     */
    const source = await readFile(OUTPUT, 'utf8');
    const body = source.slice(source.indexOf('ELEVATION = {') + 'ELEVATION ='.length);
    const object = body.slice(body.indexOf('{'), body.lastIndexOf('};') + 1);
    // The generated keys are bare identifiers, so quote them before parsing. Both levels:
    // the circuit id starts a line, but `profile` sits on the same line as it.
    const previous = JSON.parse(
      object.replace(/^(\s*)([a-z]+):/gm, '$1"$2":').replace(/\bprofile:/g, '"profile":')
    );
    if (typeof previous !== 'object' || previous === null) throw new Error('no previous profiles');
    for (const [id, entry] of Object.entries(collected)) {
      const old = previous[id]?.profile;
      if (!Array.isArray(old) || old.length !== entry.profile.length) continue;
      const span = (p) => Math.max(...p) - Math.min(...p);
      if (span(entry.profile) < span(old) * 0.8) {
        console.log(`  ${id.padEnd(14)} keeping existing profile: ${span(old).toFixed(1)}m beats ${span(entry.profile).toFixed(1)}m`);
        collected[id] = { profile: old };
        restored += 1;
      }
    }
  } catch (error) {
    /*
     * Loud, not silent. The first version of this guard swallowed a parse failure, and the
     * symptom was that it looked like it was protecting the profiles while doing nothing --
     * which is the same failure mode as the thing it was written to prevent.
     */
    console.log(`  note: no previous profiles to compare against (${error.message})`);
  }
  if (restored) console.log(`  kept ${restored} existing profile(s) over a sparser new trace`);

  const body = Object.entries(collected)
    .map(([id, entry]) => `  ${id}: { profile: [${entry.profile.join(',')}] }`)
    .join(',\n');

  await writeFile(
    OUTPUT,
    `/**
 * GENERATED by scripts/fetch-elevation.mjs -- do not edit by hand.
 *
 * Real elevation around the lap, for every circuit the fetch managed.
 *
 * Geometry from OpenStreetMap contributors (ODbL); elevation from AWS \`elevation-tiles-prod\`
 * Terrarium tiles at z13. Regenerate with \`node scripts/fetch-elevation.mjs\`, which is
 * resumable: completed circuits and terrain tiles are cached and skipped.
 *
 * \`profile\` is metres above sea level at ${PROFILE_POINTS} evenly spaced points around
 * the lap, starting where the circuit centreline starts, smoothed with a circular
 * moving average of +/-${SMOOTH_SAMPLES} points to strip DEM noise.
 *
 * A circuit may be missing: OSM tagging of a racing surface is inconsistent, so the geometry
 * search falls back through \`highway=raceway\`, \`leisure=track\` and \`highway=track\`, and
 * a candidate whose extent disagrees with the circuit's known length is rejected. Missing means
 * flat, not wrong. The writer also refuses to replace an existing profile with one of
 * materially smaller relief, which is the signature of a trace that missed part of the lap.
 */

/** Points per profile around the lap. */
export const PROFILE_POINTS = ${PROFILE_POINTS};

export const ELEVATION = {
${body}
};

/**
 * Elevation at a lap fraction, linearly interpolated and wrapping at the ends.
 *
 * Wrapping matters: the profile is circular and the last point joins the first, so a
 * car crossing the line must not see a step.
 *
 * @param {number[]} profile
 * @param {number} fraction 0..1 around the lap
 */
export function elevationAt(profile, fraction) {
  if (!profile || profile.length === 0) return 0;
  const n = profile.length;
  const wrapped = ((fraction % 1) + 1) % 1;
  const position = wrapped * n;
  const index = Math.floor(position) % n;
  const t = position - Math.floor(position);
  const a = profile[index];
  const b = profile[(index + 1) % n];
  return a + (b - a) * t;
}
`,
    'utf8'
  );
}

const force = process.argv.includes('--force');
await mkdir(CACHE, { recursive: true });

console.log('Fetching real elevation: OSM geometry + DEM sampling\n');
console.log(`circuit         result`);
console.log(`smoothing: circular moving average, +/-${SMOOTH_SAMPLES} profile points\n`);

/*
 * Seeded from the file that is already on disk, for two reasons.
 *
 * `writeOutput` runs after *every* circuit, so the file is rewritten with whatever has been
 * collected so far. Starting empty, the first circuit therefore truncates the file down to
 * itself -- which destroys the previous profiles before they can be compared, and is why the
 * never-shrink guard silently did nothing: by the time Monaco was checked, the only previous
 * profile left in the file was Bahrain's.
 *
 * Seeding also means an interrupted run cannot drop circuits it already published.
 */
const collected = await readExistingProfiles();
let failures = 0;

for (const circuit of CIRCUITS) {
  const centre = LOCATIONS[circuit.id];
  if (!centre) {
    console.log(`  ${circuit.id.padEnd(14)} no coordinates in the table`);
    failures += 1;
    continue;
  }
  try {
    const points = centrelineFor(circuit.id);
    lengthCache = null;
    prefixCache = null;
    const result = await buildProfile(circuit.id, centre, points, force);
    if (result) {
      collected[circuit.id] = result;
      // Save as we go: a run that gets killed part way -- which is what a rate-limited
      // run does -- must not lose what it already fetched.
      await writeOutput(collected);
    } else failures += 1;
  } catch (error) {
    console.log(`  ${circuit.id.padEnd(14)} FAILED: ${String(error.message).slice(0, 60)}`);
    if (process.env.APEXGP_ELEV_DEBUG) console.log(error.stack);
    failures += 1;
  }
  // Space the spatial queries out. A circuit every second is well inside the rate a
  // public Overpass instance expects from one client.
  await sleep(1100);
}

await writeOutput(collected);
const total = Object.keys(collected).length;
console.log(`\nwrote ${OUTPUT.replace(/^.*_f1-src/, '_f1-src')}`);
console.log(`${total}/${CIRCUITS.length} circuits with real elevation, ${failures} without`);