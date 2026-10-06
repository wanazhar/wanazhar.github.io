/**
 * Elevation sampling from AWS Terrarium terrain tiles.
 *
 * Drop-in replacement for the Open-Meteo elevation endpoint the first version of
 * `fetch-elevation.mjs` used, which managed 7 of 24 circuits before the rate limit stopped it.
 *
 * The difference that matters is not resolution, it is *reliability of failure*. Open-Meteo
 * answers 429 after a short burst, and because a circuit with no profile is indistinguishable
 * from a flat one, the run simply produced fewer circuits and said so only in the summary. A
 * tile source with no request-rate limit fails loudly instead, one tile at a time, and each
 * decoded tile is cached on disk so a re-run costs nothing.
 *
 * Verified against Open-Meteo at eight points across four continents before being used:
 * agreement within 0.1-11 m, with Terrarium consistently the more detailed of the two
 * (z13 is ~15-19 m per pixel at these latitudes, against Open-Meteo's ~90 m SRTM resampling).
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { decodePng, elevationFromTile, terrariumUrl } from './terrainTiles.mjs';

/**
 * Zoom level to sample at.
 *
 * z13 puts a tile pixel at roughly 15-19 m at these latitudes, which is the right order for a
 * circuit whose features span hundreds of metres. z14 would be finer than the DEM underneath
 * in most of the world and doubles the tile count for detail that is not there.
 */
const ZOOM = 13;

/** Retries per tile. A tile is small and static, so a failure is almost always transient. */
const TILE_ATTEMPTS = 4;

/**
 * Fetch (or reuse) the terrain tiles covering a set of coordinates, and sample them.
 *
 * @param {Array<[number, number]>} points lat/lon pairs
 * @param {string} cacheDir where decoded tiles are kept between runs
 * @param {(done: number, total: number) => void} [onProgress]
 * @returns {Promise<number[]>} metres above sea level, positionally matched to `points`
 */
export async function sampleElevation(points, cacheDir, onProgress = () => {}) {
  await mkdir(cacheDir, { recursive: true });

  // Which tiles are needed, and which points each one answers for. Fetching the unique set
  // first means a lap that doubles back on itself does not refetch a tile it already has.
  const wanted = new Map();
  for (const [lat, lon] of points) {
    const url = terrariumUrl(lat, lon, ZOOM);
    if (!wanted.has(url)) wanted.set(url, []);
    wanted.get(url).push([lat, lon]);
  }

  const tiles = new Map();
  const urls = [...wanted.keys()];
  for (let i = 0; i < urls.length; i += 1) {
    tiles.set(urls[i], await tileAt(urls[i], cacheDir));
    onProgress(i + 1, urls.length);
  }

  return points.map(([lat, lon]) => {
    const tile = tiles.get(terrariumUrl(lat, lon, ZOOM));
    return elevationFromTile(tile, lat, lon, ZOOM);
  });
}

/**
 * One tile, from disk if it is already there.
 *
 * Cached by URL digest rather than by tile coordinates so the cache stays valid if ZOOM changes
 * -- a different zoom is a different digest, and therefore a different file.
 */
async function tileAt(url, cacheDir) {
  const path = join(cacheDir, `${createHash('sha1').update(url).digest('hex')}.tile`);
  try {
    return decodePng(await readFile(path));
  } catch {
    // Not cached, or cached and unreadable. Either way, fetch it.
  }

  let lastError = null;
  for (let attempt = 0; attempt < TILE_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      const tile = decodePng(buffer);
      // Written via a temp file and renamed, so an interrupted run cannot leave a truncated
      // tile that then decodes to quietly wrong elevations on every future run.
      await writeFile(`${path}.tmp`, buffer);
      await rename(`${path}.tmp`, path);
      return tile;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 700 * 2 ** attempt));
    }
  }
  throw new Error(`terrain tile unavailable: ${url} (${lastError?.message})`);
}