/**
 * The terrain tile reader and its sampler.
 *
 * `lib/terrainTiles.mjs` decodes AWS's Terrarium PNGs into metres, and every number in
 * `src/track/elevationData.js` was read through it. Its failure mode is not an exception: it is
 * a plausible value that is quietly wrong, which is exactly how the elevation source before
 * this one shipped seven real circuits and seventeen flat ones.
 *
 * So the reader is checked against a PNG this file writes itself, and the sampler against tiles
 * whose values at a point are known by hand.
 *
 *   npm test
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { deflateSync } from 'node:zlib';
import { decodePng, elevationFromTile } from './lib/terrainTiles.mjs';

/*
 * PNG chunks carry a CRC32.
 *
 * The decoder does not verify them, but a fixture that a strict reader would reject is not a
 * fixture -- and if this decoder ever grows a check, it should not be the test that fails.
 */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, body) {
  const header = Buffer.alloc(4);
  header.writeUInt32BE(body.length, 0);
  const typed = Buffer.concat([Buffer.from(type, 'ascii'), body]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typed), 0);
  return Buffer.concat([header, typed, crc]);
}

/** A truecolour, 8-bit, unfiltered PNG: the one shape the decoder claims to support. */
function writePng(width, height, pixel) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const rows = [];
  for (let y = 0; y < height; y += 1) {
    const row = Buffer.alloc(1 + width * 3);
    for (let x = 0; x < width; x += 1) {
      const [r, g, b] = pixel(x, y);
      row[1 + x * 3] = r;
      row[2 + x * 3] = g;
      row[3 + x * 3] = b;
    }
    rows.push(row);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

/** Terrarium's encoding, from the file's own header: metres = (R*256 + G + B/256) - 32768. */
function terrarium(metres) {
  const value = Math.round((metres + 32768) * 256);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

function tileOf(width, height, pixel) {
  return decodePng(writePng(width, height, (x, y) => terrarium(pixel(x, y))));
}

/*
 * Every sample below uses the same coordinate, chosen so the arithmetic is exact rather than
 * approximately right.
 *
 * Longitude 45 at zoom 0 is a quarter of the way round the world, and the fixture tiles are
 * four pixels wide, so the sample lands on pixel x = 2.5 -- halfway between two columns, which
 * is where a missing horizontal term shows.
 *
 * Latitude -41 is where the Mercator projection puts pixel y = 2.50030 of the zoom-0 tile.
 * The number is written down rather than recomputed here: it is part of what is being pinned,
 * since the profiles in `elevationData.js` were binned by these pixel coordinates.
 */
const LATITUDE = -41;
const LONGITUDE = 45;
const ZOOM = 0;

test('the PNG reader gives back the pixels the file wrote', () => {
  const tile = tileOf(4, 4, () => 100);
  assert.equal(tile.width, 4);
  assert.equal(tile.height, 4);
  assert.equal(tile.data.length, 4 * 4 * 3);
  // 100m is (100 + 32768) * 256, which is R = 128, G = 100, B = 0.
  assert.deepEqual([...tile.data.subarray(0, 3)], [128, 100, 0]);
  assert.deepEqual([...tile.data.subarray(12, 15)], [128, 100, 0]);
});

test('the reader refuses a file that is not a PNG, rather than decoding noise', () => {
  assert.throws(() => decodePng(Buffer.from('not a png at all')), /not a PNG/);
});

test('a plane is sampled as that plane, at the projected point', () => {
  /*
   * Bilinear interpolation reproduces a plane exactly, whatever the sample point inside the
   * cell, so the expected value is the plane's value at (2.5, 2.50030) and nothing has to be
   * recomputed: 100 + 10 * 2.5 + 2 * 2.50030.
   */
  const tile = tileOf(4, 4, (x, y) => 100 + 10 * x + 2 * y);
  const value = elevationFromTile(tile, LATITUDE, LONGITUDE, ZOOM);
  assert.ok(
    Math.abs(value - 130.0006) < 0.02,
    `expected the plane's 130.00m at pixel (2.5, 2.5003), got ${value.toFixed(4)}m`
  );
});

test('a tile that only changes across x is sampled across x', () => {
  /*
   * The corner this used to drop.
   *
   * The bottom row was interpolated between `(fx, fy)` and `(fx, fy + 1)` -- the left column,
   * already read for the top row -- so the horizontal term vanished for every sample below the
   * top row of pixels. On this tile the true value is 10 * 2.5 = 25.0m and the old sampler
   * returned 22.5m, while on a real circuit the error moves with the terrain's row gradients
   * and is a metre or two of bias rather than an exception.
   */
  const tile = tileOf(4, 4, (x) => 10 * x);
  const value = elevationFromTile(tile, LATITUDE, LONGITUDE, ZOOM);
  assert.ok(
    Math.abs(value - 25) < 0.02,
    `expected 25.00m at pixel x = 2.5, got ${value.toFixed(4)}m`
  );
});
