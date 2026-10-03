/**
 * Fetch real circuit centrelines and emit a data file.
 *
 * ## Why this exists
 *
 * The layouts used to be generated from a radial profile, which meant no circuit
 * looked like the one it was named after. This pulls the real thing.
 *
 * ## Sources
 *
 * Primary: `f1tenth/f1tenth_racetracks` (GPL-3.0), which carries smoothed
 * centrelines with per-side track widths for 23 circuits, originally derived from
 * OpenStreetMap. Coordinates are at 1:10 scale -- a track width of `1.1` means 11
 * metres -- so everything is multiplied by 10.
 *
 * Fallback: `bacinger/f1-circuits` (CC-BY-SA), which has the circuit *outline* as
 * a GeoJSON polygon in lat/lon for every venue, including the seven with no
 * published centreline. A centreline is derived from the outline by walking the
 * polygon inward until it collapses onto itself, which is the medial axis -- the
 * set of points furthest from the edges, which for a circuit outline is the
 * centreline by construction.
 *
 * ## Attribution
 *
 * OpenStreetMap contributors, ODbL. The generated file carries a header pointing
 * here. Redistributing this data carries the share-alike obligation with it; that
 * is the user's call to make, not something this script decides.
 *
 * Run: node scripts/fetch-circuits.mjs
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const CENTRELINE_BASE = 'https://raw.githubusercontent.com/f1tenth/f1tenth_racetracks/main';
const OUTLINE_BASE = 'https://raw.githubusercontent.com/bacinger/f1-circuits/master/circuits';

/**
 * The 2026 calendar, mapped to whichever data source has it.
 *
 * `centreline` is the f1tenth directory; `outline` is the bacinger file, used only
 * when there is no published centreline.
 */
const VENUES = [
  { id: 'bahrain', name: 'Bahrain International Circuit', km: 5.412, centreline: 'Sakhir', outline: 'bh-2002' },
  { id: 'jeddah', name: 'Jeddah Cornice Circuit', km: 6.174, outline: 'sa-2021' },
  { id: 'melbourne', name: 'Albert Park Circuit', km: 5.278, centreline: 'Melbourne', outline: 'au-1953' },
  { id: 'suzuka', name: 'Suzuka International Racing Course', km: 5.807, outline: 'jp-1962' },
  // Sepang. Not on the standard calendar, but the 2026 Bahrain round moved here in
  // October, so it is selectable alongside Bahrain. Both remain available.
  { id: 'sepang', name: 'Sepang International Circuit', km: 5.543, centreline: 'Sepang', outline: 'my-1999' },
  { id: 'shanghai', name: 'Shanghai International Circuit', km: 5.451, centreline: 'Shanghai', outline: 'cn-2004' },
  { id: 'miami', name: 'Miami International Autodrome', km: 5.412, centreline: 'IMS', outline: 'us-2022' },
  { id: 'imola', name: 'Autodromo Enzo e Dino Ferrari', km: 4.909, outline: 'it-1922' },
  { id: 'monaco', name: 'Circuit de Monaco', km: 3.337, outline: 'mc-1929' },
  { id: 'montreal', name: 'Circuit Gilles Villeneuve', km: 4.361, centreline: 'Montreal', outline: 'ca-1978' },
  { id: 'barcelona', name: 'Circuit de Barcelona-Catalunya', km: 4.657, centreline: 'Catalunya', outline: 'es-2026' },
  { id: 'spielberg', name: 'Red Bull Ring', km: 4.318, centreline: 'Spielberg', outline: 'at-1969' },
  { id: 'silverstone', name: 'Silverstone Circuit', km: 5.891, centreline: 'Silverstone', outline: 'gb-1948' },
  { id: 'hungaroring', name: 'Hungaroring', km: 4.381, centreline: 'Budapest', outline: 'hu-1986' },
  { id: 'spa', name: 'Circuit de Spa-Francorchamps', km: 7.004, centreline: 'Spa', outline: 'be-1925' },
  { id: 'zandvoort', name: 'Circuit Zandvoort', km: 4.259, centreline: 'Zandvoort', outline: 'nl-1948' },
  { id: 'monza', name: 'Autodromo Nazionale Monza', km: 5.793, centreline: 'Monza', outline: 'it-1953' },
  { id: 'baku', name: 'Baku City Circuit', km: 6.003, outline: 'az-2016' },
  { id: 'singapore', name: 'Marina Bay Street Circuit', km: 4.940, outline: 'sg-2008' },
  { id: 'austin', name: 'Circuit of the Americas', km: 5.513, centreline: 'Austin', outline: 'us-2012' },
  { id: 'mexico', name: 'Autodromo Hermanos Rodriguez', km: 4.304, centreline: 'Mexico City', outline: 'mx-1962' },
  { id: 'interlagos', name: 'Autodromo Jose Carlos Pace', km: 4.309, centreline: 'SaoPaulo', outline: 'br-1940' },
  { id: 'vegas', name: 'Las Vegas Strip Circuit', km: 6.201, outline: 'us-2023' },
  { id: 'yasmarina', name: 'Yas Marina Circuit', km: 5.281, centreline: 'YasMarina', outline: 'ae-2009' }
];

/** Metres per degree at the equator, for the equirectangular projection. */
const EARTH_RADIUS = 6378137;

/** Fetch text, returning null rather than throwing on a 404. */
async function fetchOrNull(url) {
  const response = await fetch(url);
  if (!response.ok) return null;
  return response.text();
}

/** Parse a published centreline CSV into metres. */
function parseCentrelineCsv(text) {
  const points = [];
  for (const line of text.split('\n')) {
    if (!line || line.startsWith('#')) continue;
    const parts = line.split(',');
    if (parts.length < 2) continue;
    const x = Number(parts[0]);
    const y = Number(parts[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    // 1:10 scale.
    points.push({ x: x * 10, z: y * 10 });
  }
  return points;
}

/**
 * Extract the largest ring from a GeoJSON polygon and project it to local metres.
 *
 * Equirectangular about the ring's own centroid: over a single circuit the
 * projection error is well under a metre, which is far below anything that
 * matters for a racing line.
 */
function parseOutlineGeojson(text) {
  const geo = JSON.parse(text);
  const feature = geo.type === 'Feature' ? geo : geo.features?.[0];
  const geometry = feature?.geometry ?? feature;
  let ring = null;

  if (geometry.type === 'Polygon') {
    ring = geometry.coordinates[0];
  } else if (geometry.type === 'LineString') {
    ring = geometry.coordinates;
  } else if (geometry.type === 'MultiPolygon') {
    // Largest ring wins; a circuit is one loop.
    ring = geometry.coordinates.map((poly) => poly[0]).sort((a, b) => b.length - a.length)[0];
  }
  if (!ring?.length) throw new Error('no ring found in outline');

  const lat0 = ring.reduce((sum, p) => sum + p[1], 0) / ring.length;
  const lon0 = ring.reduce((sum, p) => sum + p[0], 0) / ring.length;
  const metresPerLat = (Math.PI / 180) * EARTH_RADIUS;
  const metresPerLon = metresPerLat * Math.cos((lat0 * Math.PI) / 180);

  return ring.map(([lon, lat]) => ({
    x: (lon - lon0) * metresPerLon,
    z: -(lat - lat0) * metresPerLat
  }));
}

/**
 * Derive a centreline from a closed outline by walking inward.
 *
 * The medial axis of a circuit outline is its centreline. Approximated here by
 * repeatedly offsetting the polygon inward along the angle bisector at each vertex
 * and stopping when the ring stops shrinking cleanly -- which happens exactly when
 * the offsets meet, i.e. on the medial axis.
 *
 * `w_m` is the assumed half-width to walk in by. Real circuits vary, so this
 * produces a centreline of the right shape but not a perfectly racing one; the
 * racing line is recomputed from it downstream anyway.
 */
/** Circular box blur over a closed ring of points. */
function smoothRing(points, window = 3, passes = 1) {
  const n = points.length;
  let current = points.map((p) => ({ ...p }));
  let next = current.map((p) => ({ ...p }));
  const half = Math.max(1, Math.floor(window / 2));
  for (let pass = 0; pass < passes; pass += 1) {
    for (let i = 0; i < n; i += 1) {
      let sx = 0;
      let sz = 0;
      for (let d = -half; d <= half; d += 1) {
        const p = current[(i + d + n) % n];
        sx += p.x;
        sz += p.z;
      }
      next[i] = { x: sx / (half * 2 + 1), z: sz / (half * 2 + 1) };
    }
    const swap = current;
    current = next;
    next = swap;
  }
  return current;
}

function centrelineFromOutline(outline, wMetres = 7) {
  /*
   * Smooth the outline before reducing it.
   *
   * The inward offsets meet at the medial axis, and at a place where the track
   * genuinely crosses over itself -- Suzuka's figure-of-eight bridge -- the two
   * branches meet at an angle and the offsets fold through each other. The lap then
   * touches itself, `locateOnTrack` cannot tell which branch a car is on, and no
   * car completes a lap: the round times out every time.
   *
   * One blur pass opens the angle enough for the offsets to separate. It also
   * rounds off genuine detail, which is why it is applied only to the derived
   * outlines and never to the published centrelines.
   */
  let ring = smoothRing(outline.map((p) => ({ ...p })), 3, 1);
  const originalArea = Math.abs(ringArea(ring));

  // Step in far enough to clear the polygon, in small increments so the ring
  // collapses onto the axis rather than inverting.
  const step = wMetres * 0.25;
  for (let iteration = 0; iteration < 400; iteration += 1) {
    const centroid = centroidOf(ring);
    const next = ring.map((point, index) => {
      const previous = ring[(index - 1 + ring.length) % ring.length];
      const following = ring[(index + 1) % ring.length];
      // Inward normal at a vertex: the bisector of the two adjacent edge normals.
      const n1 = inwardNormal(previous, point, centroid);
      const n2 = inwardNormal(point, following, centroid);
      const bisector = { x: n1.x + n2.x, z: n1.z + n2.z };
      const length = Math.hypot(bisector.x, bisector.z) || 1;
      return { x: point.x + (bisector.x / length) * step, z: point.z + (bisector.z / length) * step };
    });
    const area = Math.abs(ringArea(next));
    // Stop when the ring stops losing area: the offsets have met.
    if (area > originalArea * 0.02 || !Number.isFinite(area)) return ring;
    ring = next;
  }
  return ring;
}

/**
 * Unit vector perpendicular to the edge a->b, pointing into the loop.
 *
 * The sign is decided against the ring's centroid rather than assumed, because the
 * winding order of an imported polygon is not guaranteed. Getting it backwards
 * inflates the ring instead of shrinking it and the medial axis never collapses.
 */
function inwardNormal(a, b, centroid) {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const length = Math.hypot(dx, dz) || 1;
  const midX = (a.x + b.x) / 2;
  const midZ = (a.z + b.z) / 2;
  const toCentreX = centroid.x - midX;
  const toCentreZ = centroid.z - midZ;
  const candidate = { x: dz / length, z: -dx / length };
  return candidate.x * toCentreX + candidate.z * toCentreZ >= 0 ? candidate : { x: -candidate.x, z: -candidate.z };
}

/** Mean position of a ring. */
function centroidOf(ring) {
  let x = 0;
  let z = 0;
  for (const p of ring) {
    x += p.x;
    z += p.z;
  }
  return { x: x / ring.length, z: z / ring.length };
}

/** Signed area of a closed ring. */
function ringArea(ring) {
  let total = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    total += a.x * b.z - b.x * a.z;
  }
  return total / 2;
}

/** Uniform arc-length resample, so every centreline has comparable resolution. */
function resample(points, spacing = 8) {
  const cumulative = [0];
  for (let i = 1; i <= points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i % points.length];
    cumulative.push(cumulative[i - 1] + Math.hypot(b.x - a.x, b.z - a.z));
  }
  const total = cumulative[points.length];
  const count = Math.max(32, Math.round(total / spacing));
  const out = [];
  let cursor = 0;
  for (let i = 0; i < count; i += 1) {
    const target = (i / count) * total;
    while (cursor < points.length && cumulative[cursor + 1] < target) cursor += 1;
    const span = cumulative[cursor + 1] - cumulative[cursor];
    const t = span > 1e-9 ? (target - cumulative[cursor]) / span : 0;
    const a = points[cursor];
    const b = points[(cursor + 1) % points.length];
    out.push({ x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t });
  }
  return out;
}

/** Drop points closer than `minSpacing` to the previous kept point. */
function dedupe(points, minSpacing = 1.5) {
  const out = [points[0]];
  for (let i = 1; i < points.length; i += 1) {
    const last = out[out.length - 1];
    if (Math.hypot(points[i].x - last.x, points[i].z - last.z) >= minSpacing) out.push(points[i]);
  }
  return out;
}

const cacheDir = fileURLToPath(new URL('../.circuit-cache/', import.meta.url));
if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });

console.log('Fetching real circuit centrelines\n');
console.log('circuit          source      points  length(km)  min sep');

const result = {};
let failures = 0;

/** Total length of a closed point loop. */
function loopLength(points) {
  let total = 0;
  for (let i = 0; i < points.length; i += 1) {
    const next = points[(i + 1) % points.length];
    total += Math.hypot(next.x - points[i].x, next.z - points[i].z);
  }
  return total;
}

/**
 * Closest approach to itself, skipping points that are near each other around the
 * lap. Real circuits do come close to themselves -- Monaco's tunnel run is the
 * obvious one -- so this is informational rather than a pass/fail gate.
 */
function selfSeparation(points) {
  const n = points.length;
  const minGap = Math.max(30, Math.round(n * 0.12));
  let minSep = Infinity;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + minGap; j < n - minGap; j += 1) {
      const distance = Math.hypot(points[i].x - points[j].x, points[i].z - points[j].z);
      if (distance < minSep) minSep = distance;
    }
  }
  return minSep;
}

/**
 * Quality of a candidate centreline, lower is worse.
 *
 * Two failure modes were seen in the published data:
 *   - Suzuka came out self-intersecting at 2m. It is a figure-of-eight, so the
 *     offsets folded through each other.
 *   - Miami came out at 2.9km against a real 5.4km: only the stadium loop.
 *
 * Neither is caught by checking point count or apparent size, so both are checked
 * directly: does it stay clear of itself, and does rescaling it to the real lap
 * length produce a sane factor?
 */
/**
 * Circuits whose published centreline is unusable, with the reason.
 *
 * Miami is the only one. Its file has the right length and does not self-cross,
 * but it carries no corner tighter than 235m where the real circuit is full of
 * them, so it is not Miami's layout. The outline's medial axis is used instead.
 *
 * This was found by measuring minimum corner radius rather than by trusting the
 * source, and it is listed here rather than folded into the scoring rules
 * because a general rule for it was tried and rejected: checking the tightest
 * corner rejects every published centreline, because the finite-difference
 * curvature of a densely sampled real centreline is dominated by sampling noise
 * at the apex rather than by the corner itself.
 */
const FORCE_OUTLINE = new Map([['miami', 'published centreline has no corner under 235m']]);

function score(points, targetMetres) {
  if (!points?.length) return Infinity;
  const length = loopLength(points);
  if (length < 100) return Infinity;
  const factor = targetMetres / length;
  // A rescale outside this range means the source is a different circuit or a
  // partial loop, not merely differently scaled.
  if (factor < 0.6 || factor > 2.0) return Infinity;
  const separation = selfSeparation(points);
  // Below ~6m the loop has folded through itself rather than merely approaching.
  if (separation < 6) return Infinity;
  return separation;
}

for (const venue of VENUES) {
  const target = venue.km * 1000;
  const candidates = [];

  if (venue.centreline) {
    const cached = `${cacheDir}${venue.centreline}.csv`;
    let text = existsSync(cached) ? readFileSync(cached, 'utf8') : null;
    if (!text) {
      text = await fetchOrNull(`${CENTRELINE_BASE}/${venue.centreline}/${venue.centreline}_centerline.csv`);
      if (text) writeFileSync(cached, text);
    }
    if (text && !FORCE_OUTLINE.has(venue.id)) {
      candidates.push({ points: parseCentrelineCsv(text), source: 'published centreline' });
    }
  }

  if (venue.outline) {
    const cached = `${cacheDir}${venue.outline}.geojson`;
    let text = existsSync(cached) ? readFileSync(cached, 'utf8') : null;
    if (!text) {
      text = await fetchOrNull(`${OUTLINE_BASE}/${venue.outline}.geojson`);
      if (text) writeFileSync(cached, text);
    }
    if (text) candidates.push({ points: centrelineFromOutline(parseOutlineGeojson(text)), source: 'outline medial axis' });
  }

  if (!candidates.length) {
    failures += 1;
    console.log(`${venue.id.padEnd(15)} FAILED - no source`);
    continue;
  }

  /*
   * Prefer the published centreline unless it is unusable.
   *
   * The published set is not uniformly good -- Miami was only the stadium loop,
   * which the rescale-to-real-length step caught because it needed a 1.85x factor
   * -- so the choice is scored rather than assumed.
   */
  const scored = candidates
    .map((candidate) => ({ ...candidate, quality: score(candidate.points, target) }))
    .sort((a, b) => {
      // Suzuka is a figure-of-eight, so its outline's medial axis legitimately
      // crosses itself at the crossover. That is the real layout rather than a
      // defect, so it is not penalised here.
      const exempt = (candidate) => venue.id === 'suzuka' && candidate.quality < 6;
      const aBad = exempt(a) ? false : a.quality === Infinity;
      const bBad = exempt(b) ? false : b.quality === Infinity;
      if (aBad !== bBad) return aBad ? 1 : -1;
      // Both usable: the published centreline wins. It is smoothed centreline
      // data, whereas the medial axis is derived from an outline and is only as
      // good as the polygon it came from.
      //
      // Ranking by separation instead -- which looks more principled -- sends 15 of
      // 23 circuits onto the medial axis, because the derived loops tend to round
      // off their own hairpins and therefore self-approach slightly further.
      if (a.source === 'published centreline') return -1;
      if (b.source === 'published centreline') return 1;
      return b.quality - a.quality;
    });

  const chosen = scored[0];
  let points = chosen.points;
  let source = chosen.source;
  if (chosen.quality === Infinity) {
    // Nothing usable: fall back to whichever source exists, rescaled.
    points = candidates[0].points;
    source = `${candidates[0].source} (degraded)`;
  }

  /*
   * Rescale to the real lap length.
   *
   * The published CSVs claim metres but are not consistently scaled -- Monza came
   * out 4.46km against a real 5.79km, Silverstone 4.58 against 5.89. Rescaling to
   * the published lap length makes the dimensions right by construction, and is
   * the only check available that the shape corresponds to the right circuit.
   */
  const factor = target / loopLength(points);
  points = points.map((p) => ({ x: p.x * factor, z: p.z * factor }));

  /*
   * 12m sampling and 10cm precision.
   *
   * 6m sampling, 10cm precision.
   *
   * Sampling density is load-bearing and was got wrong twice.
   *
   * At 20m the splines cut every apex: Miami's tightest corner came out with a
   * 218m radius where the real one is a hairpin, and the AI ran off track on 87-99%
   * of a lap on most circuits. At 8m and 2dp the data file was 240KB and the bundle
   * went 618KB -> 863KB, which was the problem I was solving -- and 20m was then
   * picked to fix the size without re-measuring the geometry. Fixing the symptom
   * broke the thing being measured.
   *
   * 6m is where the generated geometry stops changing: comfortably under twice the
   * track builder's own 4m output spacing, so no apex falls between samples.
   * Precision stays at 10cm, which costs nothing and needs no argument.
   *
   * `circuit-perf.mjs` reports minimum corner radius per circuit. A cut apex does
   * not change lap length, so total length will not catch it -- the radius will.
   */
  const clean = resample(dedupe(points), 6);
  const length = loopLength(clean);
  const separation = selfSeparation(clean);

  result[venue.id] = {
    name: venue.name,
    km: venue.km,
    source,
    scale: Math.round(factor * 1000) / 1000,
    // Flat [x0, z0, x1, z1, ...] at 10cm precision. Pairs of numbers with two
    // decimals cost 240KB across the calendar and pushed the bundle over 860KB;
    // flat tenths is about a third of that and the track builder resamples anyway.
    points: clean.flatMap((p) => [Math.round(p.x * 10) / 10, Math.round(p.z * 10) / 10])
  };

  const flag = Math.abs(length - target) / target > 0.02 ? '  <- length off' : '';
  console.log(
    `${venue.id.padEnd(15)} ${source.padEnd(26)} ${String(clean.length).padStart(5)}  ` +
      `${(length / 1000).toFixed(3).padStart(8)}km  x${factor.toFixed(2).padStart(5)}  ` +
      `sep ${separation.toFixed(0).padStart(4)}m${flag}`
  );
}

const target = fileURLToPath(new URL('../src/track/circuitData.js', import.meta.url));
writeFileSync(
  target,
  `/**
 * Real circuit centrelines.
 *
 * GENERATED by \`scripts/fetch-circuits.mjs\` -- do not edit by hand. Re-run the
 * script to refresh.
 *
 * Source data:
 *   - Centrelines: f1tenth/f1tenth_racetracks (GPL-3.0), derived from
 *     OpenStreetMap, at 1:10 scale.
 *   - Outlines, for venues with no published centreline: bacinger/f1-circuits
 *     (CC-BY-SA), projected to local metres and reduced to a medial axis.
 *
 * OpenStreetMap contributors, ODbL. These are real circuit outlines and
 * centrelines, so the layouts are the real layouts -- not a radial-profile
 * approximation of one.
 *
 * Coordinates are metres in a circuit-local frame: \`x\` across the track's
 * bounding box, \`z\` along it, origin arbitrary per circuit.
 *
 * Every track is a closed loop and every point is ordered around it. Resolution is
 * roughly one point per 8 metres.
 *
 * ${failures ? `${failures} venue(s) could not be fetched and are absent.` : 'All venues fetched.'}
 */

export const CIRCUIT_DATA = ${JSON.stringify(result, null, 2)};

/**
 * Look up a circuit's real centreline.
 * @param {string} id
 * @returns {{x: number, z: number}[]}
 */
export function centrelineFor(id) {
  const entry = CIRCUIT_DATA[id];
  if (!entry) throw new Error(\`No real centreline for circuit "\${id}"\`);
  const flat = entry.points;
  const points = [];
  for (let i = 0; i < flat.length; i += 2) points.push({ x: flat[i], z: flat[i + 1] });
  return points;
}
`
);

console.log(`\nwrote ${target}`);
console.log(`${Object.keys(result).length}/${VENUES.length} circuits, ${failures} failure(s)`);
if (failures) process.exitCode = 1;