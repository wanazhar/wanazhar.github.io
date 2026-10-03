import { WORLD, SEED } from '../../config.js';
import { heightAt, biomeAt, BIOMES } from '../Terrain.js';
import { mulberry32, hash2 } from '../../util/rng.js';

// The details that make a scene read as Japan rather than as generic blocks.
//
// The research is unambiguous on which cues carry the most weight, and they
// cluster in infrastructure rather than architecture: concrete utility poles
// with sagging cables, stainless water tanks on roofs, and vending machines.
// None of them are exotic; they are simply what a Japanese street is made of.
// Building them costs a few boxes each and changes how the whole ward reads.

// One catenary of wire between two poles. Real wires sag; straight lines look
// wrong immediately, so the dip is modelled as a cosine.
function addWire(batch, ax, ay, az, bx, by, bz, sag, material = 'wire') {
  const segments = 6;
  for (let i = 1; i < segments; i += 1) {
    const t = i / segments;
    const x = ax + (bx - ax) * t;
    const z = az + (bz - az) * t;
    // Parabolic droop, deepest at the midpoint.
    const dip = Math.sin(t * Math.PI) * sag;
    batch.add(material, x, ay + (by - ay) * t - dip, z, 0.09, 0.09, 0.09);
  }
}

// Concrete utility pole with crossarms, insulators and a transformer.
function addUtilityPole(batch, x, z, { withTransformer = true } = {}) {
  const ground = heightAt(x, z);
  if (ground <= WORLD.seaLevel) return;

  // Pale grey concrete shaft.
  batch.add('utilityPole', x, ground + 4.5, z, 0.42, 9, 0.42);
  // The ladder of holes running up one side is the signature detail.
  for (let i = 0; i < 7; i += 1) {
    batch.add('metalDark', x - 0.24, ground + 1.4 + i * 1.05, z, 0.12, 0.12, 0.5);
  }

  // Crossarms, densely loaded: this clutter is what says "Japan".
  batch.add('woodPost', x, ground + 8.3, z, 3.0, 0.26, 0.26);
  batch.add('woodPost', x, ground + 7.5, z, 2.3, 0.24, 0.24);
  // Insulators.
  for (const ox of [-1.2, -0.4, 0.4, 1.2]) {
    batch.add('signWhite', x + ox, ground + 8.55, z, 0.22, 0.34, 0.22);
  }
  if (withTransformer) {
    batch.add('metal', x + 0.75, ground + 7.1, z, 1.1, 1.4, 0.9);
  }
  // A warning plate, the small yellow thing on every pole.
  batch.add('neonYellow', x - 0.6, ground + 6.4, z - 0.28, 0.5, 0.7, 0.1);
}

// A run of poles with wires strung between them, following a street line.
export function buildUtilityLine(batch, { axis, from, to, step = 14, withWires = true }) {
  const positions = [];
  for (let t = from; t <= to; t += step) {
    const x = axis === 'x' ? t : t;
    const z = axis === 'x' ? t : t;
    positions.push([x, z]);
  }

  // Poles must stand on walkable ground, so skip any that land in water or on
  // a lot. Simple check: the column must be dry.
  const usable = positions.filter(([x, z]) => heightAt(Math.floor(x), Math.floor(z)) > WORLD.seaLevel);
  for (let i = 0; i < usable.length; i += 1) {
    const [x, z] = usable[i];
    addUtilityPole(batch, x, z, { withTransformer: i % 3 === 0 });
  }

  if (!withWires) return;

  // Three parallel wire runs between consecutive poles: the sky-crossing web
  // that a Japanese townscape is known for.
  for (let i = 0; i < usable.length - 1; i += 1) {
    const [ax, az] = usable[i];
    const [bx, bz] = usable[i + 1];
    const ay = heightAt(Math.floor(ax), Math.floor(az)) + 8.5;
    const by = heightAt(Math.floor(bx), Math.floor(bz)) + 8.5;
    const span = Math.hypot(bx - ax, bz - az);
    if (span > step * 1.6) continue;
    addWire(batch, ax, ay, az, bx, by, bz, span * 0.09);
    addWire(batch, ax, ay - 0.8, az, bx, by - 0.8, bz, span * 0.11);
    addWire(batch, ax, ay - 1.6, az, bx, by - 1.6, bz, span * 0.13);
  }
}

// A stainless water tank on four legs. Ubiquitous on Japanese roofs, and the
// thing that stops a roofscape reading as a row of flat rectangles.
export function buildRoofTank(batch, x, y, z) {
  batch.add('metal', x, y + 0.7, z, 0.22, 1.4, 0.22);
  batch.add('metal', x + 0.9, y + 0.7, z, 0.22, 1.4, 0.22);
  batch.add('metal', x, y + 0.7, z + 0.9, 0.22, 1.4, 0.22);
  batch.add('metal', x + 0.9, y + 0.7, z + 0.9, 0.22, 1.4, 0.22);
  batch.add('metal', x + 0.45, y + 2.4, z + 0.45, 1.5, 1.6, 1.5);
  batch.add('metalDark', x + 0.45, y + 3.25, z + 0.45, 1.6, 0.2, 1.6);
  // Downpipe.
  batch.add('metal', x + 1.05, y + 1.4, z + 0.45, 0.16, 2.6, 0.16);
}

// A vending machine. The brightest object in any Japanese street, and a
// deliberate punctuation mark in an otherwise muted palette. Always placed
// against a wall or under an awning, never standing loose in the open.
export function buildVendingMachine(batch, x, y, z, { warm = false } = {}) {
  batch.add('vendingBody', x, y + 0.95, z, 1.2, 1.9, 0.7);
  // Illuminated product rows behind the front glass.
  batch.add(warm ? 'lampGlass' : 'neonBlue', x, y + 1.05, z - 0.37, 1.0, 1.3, 0.06);
  // Brand panel at the top.
  batch.add('vending', x, y + 1.95, z - 0.37, 1.05, 0.34, 0.06);
  // Product rows, visible as coloured blocks behind the glass.
  const rng = mulberry32(Math.floor(x * 31 + z * 17));
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const mats = ['neonRed', 'neonGreen', 'neonBlue', 'neonYellow', 'clothCream'];
      batch.add(
        mats[Math.floor(rng() * mats.length)],
        x - 0.42 + col * 0.28,
        y + 0.6 + row * 0.35,
        z - 0.4,
        0.22,
        0.26,
        0.05
      );
    }
  }
  // Dispensing tray.
  batch.add('metalDark', x, y + 0.22, z - 0.4, 0.9, 0.2, 0.14);
}

// Kawara roof tiles: dark blue-grey with alternating row values, which is what
// makes a tiled roof read as tiled rather than as a grey slab.
export function buildTiledRoof(batch, cx, y, cz, w, d, { ridgeAxis = 'x' } = {}) {
  const rows = Math.max(3, Math.round(d / 1.4));
  for (let i = 0; i < rows; i += 1) {
    const t = i / (rows - 1);
    // Two alternating values: the rhythm of tile courses.
    const material = i % 2 === 0 ? 'buildingRoof' : 'buildingRoofBlue';
    // Each row steps inward as it approaches the ridge.
    const inset = Math.sin(t * Math.PI) * 1.1;
    const z = cz - d / 2 + t * d;
    const width = w - inset * 2;
    batch.add(material, cx, y + 0.16 * i + 0.2, z, width, 0.22, d / rows + 0.05);
  }
  // Ridge cap along the top.
  if (ridgeAxis === 'x') {
    batch.add('buildingRoofBlue', cx, y + 0.16 * rows + 0.3, cz + d / 2, w, 0.36, 0.5);
    // Onigawara: the small end-tile block on the ridge. Cheap, high value.
    batch.add('metalDark', cx - w / 2 + 0.4, y + 0.16 * rows + 0.6, cz + d / 2, 0.5, 0.5, 0.5);
    batch.add('metalDark', cx + w / 2 - 0.4, y + 0.16 * rows + 0.6, cz + d / 2, 0.5, 0.5, 0.5);
  }
}

// Shoji: a warm cream glowing rectangle set into a dark frame. In an evening
// scene a lit shoji is one of the most important light sources in frame.
export function buildShoji(batch, x, y, z, { ry = 0 } = {}) {
  batch.add('signWhite', x, y, z, 2.0, 1.6, 0.14, { ry });
  // Frame, with the lattice dividing it into panels.
  batch.add('woodPost', x, y + 0.85, z, 2.2, 0.16, 0.2, { ry });
  batch.add('woodPost', x, y - 0.85, z, 2.2, 0.16, 0.2, { ry });
  batch.add('woodPost', x, y, z - 0.98, 0.12, 1.7, 0.18, { ry });
  batch.add('woodPost', x, y, z + 0.98, 0.12, 1.7, 0.18, { ry });
  for (const off of [-0.45, 0, 0.45]) {
    batch.add('woodPost', x + off, y, z, 0.1, 1.7, 0.18, { ry });
  }
  for (const off of [-0.3, 0.3]) {
    batch.add('woodPost', x, y + off, z, 2.0, 0.09, 0.18, { ry });
  }
}

// Paddy water that mirrors the sky. A flat plane in a sky-tinted colour with
// a sun glitter path is the single biggest mood lever on the island.
export function buildPaddyMirror(batch, x, y, z, w = 2, d = 2) {
  batch.add('paddyWater', x, y + 0.5, z, w, 0.18, d);
  // A brighter strip toward the horizon sells the reflection.
  batch.add('foam', x, y + 0.56, z - d * 0.25, w * 0.8, 0.06, d * 0.35);
}

// Small roadside shrine: a lit stone box. Placed at paths and bends.
export function buildRoadsideShrine(batch, x, z) {
  const ground = heightAt(x, z);
  if (ground <= WORLD.seaLevel) return;
  batch.add('stoneDark', x, ground + 0.3, z, 1.3, 0.6, 1.3);
  batch.add('stone', x, ground + 1.2, z, 1.1, 1.2, 1.1);
  batch.add('lampGlass', x, ground + 1.2, z - 0.58, 0.7, 0.7, 0.06);
  batch.add('shrineRoof', x, ground + 2.0, z, 1.5, 0.3, 1.5);
  batch.add('toriiRed', x, ground + 2.3, z, 1.0, 0.3, 1.0);
}

// Scatters the above across a region, deterministically.
export function buildJapaneseInfrastructure(batch, region, bounds) {
  const rng = mulberry32(SEED + hash2(region.length, bounds.x0, 7777));
  const { x0, z0, x1, z1 } = bounds;

  // Utility runs down both street axes of the region.
  buildUtilityLine(batch, { axis: 'x', from: x0 + 8, to: x1 - 8, step: 15 });
  buildUtilityLine(batch, { axis: 'z', from: z0 + 8, to: z1 - 8, step: 15 });

  // Vending machines and small roadside shrines against walls.
  for (let i = 0; i < 10; i += 1) {
    const x = x0 + rng() * (x1 - x0);
    const z = z0 + rng() * (z1 - z0);
    const ground = heightAt(Math.floor(x), Math.floor(z));
    if (ground <= WORLD.seaLevel) continue;
    if (rng() < 0.55) buildVendingMachine(batch, x, ground, z);
    else buildRoadsideShrine(batch, x, z);
  }
}