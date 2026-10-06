/**
 * Minimal PNG reader for Terrarium terrain tiles, on Node's zlib.
 *
 * ## Why not a library
 *
 * The project's only dependencies are `three` and `vite`, and this is a build-time script that
 * reads one specific kind of file: a 256x256, 8-bit, non-interlaced, truecolour PNG. Adding a
 * general image library to decode that would be a heavier dependency than the decoder.
 *
 * ## Why Terrarium tiles at all
 *
 * The first version of this script used Open-Meteo's elevation endpoint, which is free but
 * rate-limits: it managed 7 of 24 circuits before giving up, and the failure mode is silent --
 * a circuit with no profile is indistinguishable from a flat one.
 *
 * AWS publishes the same kind of DEM as pre-rendered Terrarium tiles, with no API key and no
 * request-rate limit, at roughly 10-30 m resolution against Open-Meteo's ~90 m SRTM. The
 * trade is that they are tiles, so a profile means decoding a few hundred of them and
 * bilinear-sampling between them, rather than asking for a list of coordinates.
 *
 * ## Format
 *
 * Terrarium encodes elevation across the three colour channels:
 *
 *     metres = (R * 256 + G + B / 256) - 32768
 *
 * PNG scanlines are each prefixed with a filter byte and must be reconstructed before the
 * pixels mean anything, which is what most of this file is.
 */

import { inflateSync } from 'node:zlib';

const SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/**
 * Decode a PNG to raw RGB bytes.
 *
 * Only what Terrarium tiles use is supported: 8-bit, colour type 2 (truecolour),
 * non-interlaced. Anything else throws rather than returning something wrong, because a
 * silently-wrong DEM is worse than a missing one -- that is precisely how the previous
 * source produced seven real circuits and seventeen silently flat ones.
 *
 * @param {Buffer} buffer
 * @returns {{width: number, height: number, data: Buffer}} `data` is width*height*3 bytes
 */
export function decodePng(buffer) {
  for (let i = 0; i < SIGNATURE.length; i += 1) {
    if (buffer[i] !== SIGNATURE[i]) throw new Error('not a PNG');
  }

  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colourType = 0;
  let interlace = 0;
  const idat = [];

  let offset = 8;
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const body = buffer.subarray(offset + 8, offset + 8 + length);

    if (type === 'IHDR') {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      bitDepth = body[8];
      colourType = body[9];
      interlace = body[12];
    } else if (type === 'IDAT') {
      idat.push(body);
    } else if (type === 'IEND') {
      break;
    }
    // Chunks are length + type + data + 4-byte CRC.
    offset += 12 + length;
  }

  if (bitDepth !== 8) throw new Error(`unsupported bit depth ${bitDepth}`);
  if (colourType !== 2) throw new Error(`unsupported colour type ${colourType}`);
  if (interlace !== 0) throw new Error('interlaced PNGs are not supported');

  const inflated = inflateSync(Buffer.concat(idat));
  return { width, height, data: unfilter(inflated, width, height) };
}

/**
 * Reconstruct PNG scanlines.
 *
 * Each scanline in the inflated stream is one filter byte followed by the raw bytes, and the
 * filter is defined relative to the byte to the left and the byte above. Getting this wrong
 * does not throw: it produces plausible-looking numbers that are quietly wrong, which is why
 * it is verified against a known-good source before being used.
 */
function unfilter(inflated, width, height) {
  const bpp = 3;
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  let src = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[src];
    src += 1;
    const rowStart = y * stride;
    const priorStart = rowStart - stride;

    for (let x = 0; x < stride; x += 1) {
      const raw = inflated[src + x];
      const left = x >= bpp ? out[rowStart + x - bpp] : 0;
      const up = y > 0 ? out[priorStart + x] : 0;
      const upLeft = y > 0 && x >= bpp ? out[priorStart + x - bpp] : 0;
      out[rowStart + x] = (raw + predictor(filter, left, up, upLeft)) & 0xff;
    }
    src += stride;
  }
  return out;
}

/** The five PNG scanline filters. */
function predictor(filter, a, b, c) {
  switch (filter) {
    case 0: return 0;
    case 1: return a;
    case 2: return b;
    case 3: return ((a + b) >> 1);
    case 4: return paeth(a, b, c);
    default: throw new Error(`unknown filter ${filter}`);
  }
}

/** Paeth's predictor: whichever of left, above and above-left is closest to their average. */
function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

/**
 * The tile index containing a coordinate.
 *
 * Standard Web Mercator, with the usual latitude clamp -- past about 85 degrees the
 * projection degenerates, and no circuit here is anywhere near that.
 */
export function tileFor(latitude, longitude, zoom) {
  const clamped = Math.max(-85.05112878, Math.min(85.05112878, latitude));
  const scale = 2 ** zoom;
  const x = Math.floor(((longitude + 180) / 360) * scale);
  const latRad = (clamped * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale);
  return { x, y, zoom, scale };
}

/**
 * Elevation in metres at a coordinate, from a decoded Terrarium tile.
 *
 * Bilinear between the four surrounding pixels. Nearest-neighbour would quantise the DEM to
 * whatever the tile grid happens to be -- visibly steppy along a lap profile, and steppy
 * gradients are steppy physics.
 *
 * @param {{width: number, height: number, data: Buffer}} tile a decoded tile
 * @param {number} zoom the zoom the tile was fetched at
 */
export function elevationFromTile(tile, latitude, longitude, zoom) {
  const { x: tileX, y: tileY, scale } = tileFor(latitude, longitude, zoom);
  const { width, height, data } = tile;

  // Pixel coordinates within the tile, as a float.
  const worldX = (((longitude + 180) / 360) * scale - tileX) * width;
  const latRad = (Math.max(-85.05112878, Math.min(85.05112878, latitude)) * Math.PI) / 180;
  const worldY = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale - tileY;
  const pixelY = worldY * height;

  const fx = Math.floor(worldX);
  const fy = Math.floor(pixelY);
  const tx = worldX - fx;
  const ty = pixelY - fy;

  const at = (px, py) => {
    const cx = Math.max(0, Math.min(width - 1, px));
    const cy = Math.max(0, Math.min(height - 1, py));
    const i = (cy * width + cx) * 3;
    return data[i] * 256 + data[i + 1] + data[i + 2] / 256 - 32768;
  };

  // `at` clamps to the tile, so a sample on the boundary degrades gracefully to its edge
  // pixel instead of reading out of bounds. No special case is needed for that.
  const top = lerp(at(fx, fy), at(fx + 1, fy), tx);
  const bottom = lerp(at(fx, fy), at(fx, fy + 1), tx);
  return lerp(top, bottom, ty);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** The tile URL for a coordinate at a zoom level. */
export function terrariumUrl(latitude, longitude, zoom) {
  const { x, y } = tileFor(latitude, longitude, zoom);
  return `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${zoom}/${x}/${y}.png`;
}