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
 * ## Attribution
 *
 * Geometry: OpenStreetMap contributors, ODbL.
 * Elevation: Open-Meteo's elevation API (SRTM and other public DEMs).
 *
 * Run: node scripts/fetch-elevation.mjs            # only the missing circuits
 *     node scripts/fetch-elevation.mjs --force    # all of them
 */

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { centrelineFor } from '../src/track/circuitData.js';
import { CIRCUITS } from '../src/track/circuits.js';

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

const OVERPASS = 'https://overpass-api.de/api/interpreter';
const ELEVATION = 'https://api.open-meteo.com/v1/elevation';
const USER_AGENT = 'ApexGP/1.0';

const OUTPUT = fileURLToPath(new URL('../src/track/elevationData.js', import.meta.url));
const CACHE = fileURLToPath(new URL('../.circuit-cache/', import.meta.url));

/**
 * DEM points per request.
 *
 * Open-Meteo accepts up to 100 coordinates per call.
 */
const DEM_BATCH = 100;

/**
 * Minimum gap between DEM calls, milliseconds.
 *
 * This replaced Open-Elevation, whose public endpoint rate-limited a batch run across
 * 24 circuits into twenty-four identical 429s even with exponential backoff. Open-Meteo
 * has a documented free tier and answers a hundred points in well under a second.
 */
/**
 * Minimum gap between DEM calls, milliseconds.
 *
 * Measured, not documented. Open-Meteo's public tier allows a short burst of about
 * three calls and then answers 429 for a while; at 350ms spacing a full run got three
 * circuits and spent the rest of its retries being refused. 1.6s is comfortably inside
 * the sustained rate.
 */
const DEM_INTERVAL = 1600;

/** Lookup radius for the raceway, metres. Generous: OSM tagging varies by circuit. */
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
  const url = `${OVERPASS}?data=${encodeURIComponent(`[out:json][timeout:90];${query}`)}`;
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (response.status === 429 || response.status === 504 || response.status === 503) {
    if (attempt >= 4) throw new Error(`overpass HTTP ${response.status} after 5 attempts`);
    await sleep(6000 * 2 ** attempt);
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
  const out = [];
  let lastCall = 0;

  for (let i = 0; i < pairs.length; i += DEM_BATCH) {
    const batch = pairs.slice(i, i + DEM_BATCH);
    /*
     * Open-Meteo takes two parallel comma-separated lists, not Open-Elevation's
     * interleaved `lat,lon|lat,lon`. Passing the old shape gets a 403, because the
     * endpoint sees a request it does not recognise -- which is what happened on the
     * first run after the switch, and it cost twenty-four circuits.
     */
    const latitudes = batch.map(([lat]) => lat.toFixed(5)).join(',');
    const longitudes = batch.map(([, lon]) => lon.toFixed(5)).join(',');

    let heights = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      // Hold the gap even after a failure, so backing off actually spaces the calls.
      const wait = DEM_INTERVAL - (Date.now() - lastCall);
      if (wait > 0) await sleep(wait);
      lastCall = Date.now();

      try {
        const response = await fetch(`${ELEVATION}?latitude=${latitudes}&longitude=${longitudes}`, {
          headers: { 'User-Agent': USER_AGENT }
        });
        if (response.status === 429 || response.status >= 500) {
          await sleep(2500 * 2 ** attempt);
          continue;
        }
        if (!response.ok) throw new Error(`elevation HTTP ${response.status}`);
        const json = await response.json();
        // Open-Meteo answers with a positional array, not per-point objects.
        if (!Array.isArray(json.elevation)) throw new Error('unexpected elevation payload');
        heights = json.elevation;
        break;
      } catch (error) {
        // A network error is worth one more try; anything else is fatal for the batch.
        if (attempt === 4) throw error;
        await sleep(2000 * 2 ** attempt);
      }
    }
    if (!heights) throw new Error('elevation endpoint rate-limited after 5 attempts');

    // Positional: the i-th height belongs to the i-th requested location.
    for (let k = 0; k < batch.length; k += 1) {
      const [lat, lon] = batch[k];
      out.push([lat, lon, heights[k]]);
    }
  }
  return out;
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
  const ways = await overpass(
    `way(around:${SEARCH_RADIUS},${lat},${lon})["highway"="raceway"];out geom;`
  );
  if (!ways.length) {
    console.log(`  ${id.padEnd(14)} NO OSM DATA (searched ${SEARCH_RADIUS}m around ${lat},${lon})`);
    return null;
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
async function writeOutput(collected) {
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
 * Geometry from OpenStreetMap contributors (ODbL); elevation from Open-Meteo's public
 * DEM endpoint. Regenerate with \`node scripts/fetch-elevation.mjs\`, which is
 * resumable: completed circuits are cached and skipped.
 *
 * \`profile\` is metres above sea level at ${PROFILE_POINTS} evenly spaced points around
 * the lap, starting where the circuit centreline starts, smoothed with a circular
 * moving average of +/-${SMOOTH_SAMPLES} points to strip DEM noise.
 *
 * A circuit may be missing: OSM's \`highway=raceway\` tagging is inconsistent, and the
 * public DEM endpoint rate-limits. Missing means flat, not wrong.
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

const collected = {};
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