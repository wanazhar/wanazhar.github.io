/**
 * Procedural surface textures.
 *
 * Everything here is drawn into a canvas at load time and uploaded as a texture.
 * The alternative -- untextured `MeshStandardMaterial` in flat colours -- is what
 * made the game look unfinished: a road is a single dark grey, the grass a single
 * green, and a grandstand a grey slab. No amount of lighting fixes that, because
 * the missing information is the surface itself.
 *
 * All of it is deterministic: a seeded generator, so a circuit looks the same
 * every time it is loaded and a screenshot of it is reproducible.
 *
 * Kept free of Three.js types in the signatures where practical so these can be
 * unit tested, and small on purpose -- these are tiled many times across a large
 * surface, so 256px is plenty and the upload cost is negligible.
 */

import * as THREE from 'three';
import { createRandom } from '../util/math.js';

/** Texture cache, so repeated calls for the same surface do not redraw. */
const cache = new Map();

/**
 * @param {string} key
 * @param {() => HTMLCanvasElement} draw
 */
function cached(key, draw) {
  if (!cache.has(key)) cache.set(key, draw());
  return cache.get(key);
}

/**
 * Fill a canvas with per-pixel noise in a base colour.
 *
 * Value noise rather than white noise: white noise at texture scale reads as
 * television static, whereas blocking it slightly gives the mottling you get on
 * asphalt and grass.
 */
function mottle(context, size, { base, amount, cell = 2, seed = 1 }) {
  const random = createRandom(seed);
  const cells = Math.ceil(size / cell);
  const field = new Float32Array(cells * cells);
  for (let i = 0; i < field.length; i += 1) field[i] = random();

  const image = context.createImageData(size, size);
  const { r, g, b } = base;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      // Bilinear sample of the noise field, wrapping at the edges so the texture
      // tiles without a visible seam.
      const fx = x / cell;
      const fy = y / cell;
      const x0 = Math.floor(fx) % cells;
      const y0 = Math.floor(fy) % cells;
      const x1 = (x0 + 1) % cells;
      const y1 = (y0 + 1) % cells;
      const tx = fx - Math.floor(fx);
      const ty = fy - Math.floor(fy);
      const a = field[y0 * cells + x0] * (1 - tx) + field[y0 * cells + x1] * tx;
      const c = field[y1 * cells + x0] * (1 - tx) + field[y1 * cells + x1] * tx;
      const value = (a * (1 - ty) + c * ty - 0.5) * amount;
      const index = (y * size + x) * 4;
      image.data[index] = clampByte(r + value * 255);
      image.data[index + 1] = clampByte(g + value * 255);
      image.data[index + 2] = clampByte(b + value * 255);
      image.data[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
}

function clampByte(value) {
  return value < 0 ? 0 : value > 255 ? 255 : value;
}

function canvasOf(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

/**
 * Road surface: mottled grey plus long streaks along the direction of travel.
 *
 * The streaks matter more than the noise. Tarmac is laid in long runs, and the
 * eye reads the direction of those runs as the direction of the road, which is
 * the cue that tells you where the circuit goes at a glance.
 */
export function asphaltTexture() {
  return cached('asphalt', () => {
    const size = 256;
    const canvas = canvasOf(size);
    const context = canvas.getContext('2d');
    // Tarmac grain is fine and low-contrast. An earlier pass used amount 0.16 at
    // cell size 2, which is coarse enough to read as cobbles or gravel from the
    // driver's seat -- the texture became the subject instead of the surface.
    mottle(context, size, { base: { r: 44, g: 46, b: 52 }, amount: 0.07, cell: 1, seed: 7 });

    const random = createRandom(19);
    context.globalAlpha = 0.022;
    for (let i = 0; i < 90; i += 1) {
      const y = random() * size;
      const width = 0.6 + random() * 2.2;
      context.fillStyle = random() > 0.5 ? '#ffffff' : '#000000';
      context.fillRect(0, y, size, width);
    }
    // Faint transverse joints every so often.
    context.globalAlpha = 0.035;
    context.fillStyle = '#000000';
    for (let y = 0; y < size; y += 64) context.fillRect(0, y, size, 1.5);
    context.globalAlpha = 1;
    return canvas;
  });
}

/** Grass: clumpy mottling at two scales, so it does not read as flat green. */
export function grassTexture() {
  return cached('grass', () => {
    const size = 256;
    const canvas = canvasOf(size);
    const context = canvas.getContext('2d');
    mottle(context, size, { base: { r: 63, g: 122, b: 74 }, amount: 0.13, cell: 8, seed: 23 });
    // A second, coarser pass for large-scale variation.
    mottle(context, size, { base: { r: 63, g: 122, b: 74 }, amount: 0.07, cell: 32, seed: 91 });

    const random = createRandom(53);
    // Mown stripes, which is what most circuits actually have.
    //
    // Kept very low contrast on purpose. At the alpha this started with, the
    // stripes were the loudest thing in the frame -- brighter than the cars and
    // drawing the eye across the screen on every straight -- which is worse than
    // no stripes at all. Real mown bands are a few percent of reflectance apart.
    context.globalAlpha = 0.045;
    for (let x = 0; x < size; x += 64) {
      context.fillStyle = (x / 64) % 2 === 0 ? '#ffffff' : '#000000';
      context.fillRect(x, 0, 32, size);
    }
    // Scuff the stripes so they are not perfectly clean.
    context.globalAlpha = 0.1;
    for (let i = 0; i < 260; i += 1) {
      context.fillStyle = random() > 0.5 ? '#8fe08f' : '#2b5c34';
      context.fillRect(random() * size, random() * size, 2 + random() * 5, 2 + random() * 5);
    }
    context.globalAlpha = 1;
    return canvas;
  });
}

/** Run-off: loose gravel, warmer and lighter than the grass. */
export function runOffTexture() {
  return cached('runoff', () => {
    const size = 128;
    const canvas = canvasOf(size);
    const context = canvas.getContext('2d');
    mottle(context, size, { base: { r: 190, g: 168, b: 120 }, amount: 0.26, cell: 2, seed: 41 });
    return canvas;
  });
}

/**
 * Grandstand crowd: a dense field of coloured dots on a dark terrace.
 *
 * Without this the stands are grey slabs, which is the single clearest "this is
 * a placeholder" signal in the scene. Individual dots do not need to be people.
 */
export function crowdTexture() {
  return cached('crowd', () => {
    const size = 128;
    const canvas = canvasOf(size);
    const context = canvas.getContext('2d');
    context.fillStyle = '#20242e';
    context.fillRect(0, 0, size, size);

    const random = createRandom(311);
    const shirt = ['#e8e8ee', '#c94f4f', '#4f7fc9', '#e0b040', '#4fae74', '#e08ad0', '#2f3542'];
    // Rows of seats. Density falls off towards the back so the stand has depth.
    for (let row = 0; row < 22; row += 1) {
      const y = row * (size / 22);
      const occupancy = 0.94 - row * 0.012;
      for (let column = 0; column < 26; column += 1) {
        if (random() > occupancy) continue;
        context.fillStyle = shirt[Math.floor(random() * shirt.length)];
        context.fillRect(column * (size / 26) + 1, y + 1, 3, 3);
      }
    }
    // Shadowed gaps between rows.
    context.fillStyle = 'rgba(0,0,0,0.22)';
    for (let row = 0; row < 22; row += 1) context.fillRect(0, row * (size / 22) + 4, size, 1);
    return canvas;
  });
}

/** Tyre sidewall: circumferential grooves plus a worn contact patch. */
export function tyreTexture() {
  return cached('tyre', () => {
    const size = 128;
    const canvas = canvasOf(size);
    const context = canvas.getContext('2d');
    context.fillStyle = '#1c1c20';
    context.fillRect(0, 0, size, size);
    // Grooves run around the circumference, which is the horizontal axis here.
    context.fillStyle = '#0b0b0d';
    for (let x = 0; x < size; x += 16) context.fillRect(x, 0, 5, size);
    context.fillStyle = 'rgba(255,255,255,0.05)';
    for (let x = 8; x < size; x += 16) context.fillRect(x, 0, 2, size);
    return canvas;
  });
}

/** Concrete: barrier walls and grandstand structure. */
export function concreteTexture() {
  return cached('concrete', () => {
    const size = 128;
    const canvas = canvasOf(size);
    const context = canvas.getContext('2d');
    mottle(context, size, { base: { r: 154, g: 160, b: 166 }, amount: 0.1, cell: 4, seed: 77 });
    context.strokeStyle = 'rgba(0,0,0,0.12)';
    context.lineWidth = 1;
    for (let x = 0; x <= size; x += 32) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, size);
      context.stroke();
    }
    return canvas;
  });
}

/** Build a repeating texture from a drawn canvas, ready for a material. */
export function toTexture(canvas, { repeat = [1, 1], aniso = 4, srgb = true } = {}) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);
  texture.anisotropy = aniso;
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}