import { WORLD } from '../../config.js';
import { heightAt, biomeAt, BIOMES } from '../Terrain.js';

// Tree construction, shared by every region.
//
// Foliage is the clearest case for the rounding levels: a canopy built from
// stacked cubes is the most Minecraft-looking object in the scene. Soft
// superellipsoids in overlapping lobes read as a rounded mass instead, which is
// what the art direction actually calls for. Curved edges also catch the rim
// light, and that highlight is most of what separates a silhouette from the
// background.

const ROUND = 'rounded';
const SOFT = 'soft';

const KINDS = {
  // Rounded and broad, as deciduous trees are.
  normal: { trunkH: 3.2, trunkR: 0.55, leafR: 2.4, leafH: 2.2, mat: 'leafGreen', lobes: 3 },
  // Wider than tall: a cherry canopy is a dome, and the blossom is very
  // slightly magenta-pink rather than coral.
  sakura: { trunkH: 2.6, trunkR: 0.45, leafR: 2.7, leafH: 1.6, mat: 'flowerSakura', lobes: 4 },
  maple: { trunkH: 3.2, trunkR: 0.5, leafR: 2.5, leafH: 1.8, mat: 'leafMaple', lobes: 4 },
  // A pine is a cone, not a ball: a stack of shrinking tiers.
  pine: { trunkH: 4.4, trunkR: 0.4, leafR: 1.9, leafH: 1.2, mat: 'leafGreen', lobes: 3, tiered: true },
  orchard: { trunkH: 1.8, trunkR: 0.4, leafR: 1.6, leafH: 1.4, mat: 'orchardTree', lobes: 2 },
  bamboo: { trunkH: 7, trunkR: 0.22, leafR: 0.5, leafH: 0.6, mat: 'bamboo', lobes: 0 }
};

export function addTree(batch, x, z, rng, kind = 'normal') {
  const ground = heightAt(Math.floor(x), Math.floor(z));
  if (ground <= WORLD.seaLevel) return batch;

  const spec = KINDS[kind] ?? KINDS.normal;

  if (kind === 'bamboo') {
    // A bamboo stand is a clump of thin culms, never one trunk with a canopy.
    const clump = 2 + Math.floor(rng() * 3);
    for (let i = 0; i < clump; i += 1) {
      const ox = x + (rng() - 0.5) * 1.1;
      const oz = z + (rng() - 0.5) * 1.1;
      const og = heightAt(Math.floor(ox), Math.floor(oz));
      const h = spec.trunkH * (0.7 + rng() * 0.5);
      batch.add(rng() < 0.4 ? 'bambooDark' : 'bamboo', ox, og + h / 2, oz, 0.28, h, 0.28, { shape: ROUND });
      // A couple of leaf sprays near the top.
      batch.add('bamboo', ox, og + h * 0.85, oz, 1.1, 0.7, 1.1, { shape: SOFT });
    }
    return batch;
  }

  // Trunk, slightly tapered by stacking two sections.
  batch.add('trunk', x, ground + spec.trunkH / 2, z, spec.trunkR, spec.trunkH, spec.trunkR, { shape: ROUND });

  const canopyBase = ground + spec.trunkH;

  if (spec.tiered) {
    // Pine: shrinking tiers, each wider than the one above.
    for (let i = 0; i < spec.lobes; i += 1) {
      const t = i / spec.lobes;
      const r = spec.leafR * (1 - t * 0.55);
      batch.add(spec.mat, x, canopyBase + t * spec.leafH * 2.2 + 0.4, z, r * 2, 0.9, r * 2, { shape: SOFT });
    }
    return batch;
  }

  // Canopy: overlapping lobes at different heights and offsets. One single mass
  // reads as a ball; lobes read as foliage and catch light unevenly.
  for (let i = 0; i < spec.lobes; i += 1) {
    const ox = (rng() - 0.5) * spec.leafR * 0.7;
    const oz = (rng() - 0.5) * spec.leafR * 0.7;
    const oy = (rng() - 0.3) * spec.leafH * 0.6;
    const scale = 0.8 + rng() * 0.4;
    batch.add(
      spec.mat,
      x + ox,
      canopyBase + spec.leafH * 0.5 + oy,
      z + oz,
      spec.leafR * scale * 2,
      spec.leafH * scale * 1.6,
      spec.leafR * scale * 2,
      { shape: SOFT }
    );
  }

  // A brighter highlight lobe on one side. The value split between the two
  // reads as light falling through the canopy.
  batch.add(
    kind === 'sakura' ? 'flowerSakuraDeep' : 'leafLight',
    x + spec.leafR * 0.35,
    canopyBase + spec.leafH * 1.15,
    z + spec.leafR * 0.3,
    spec.leafR * 1.1,
    spec.leafH * 0.9,
    spec.leafR * 1.1,
    { shape: SOFT }
  );

  return batch;
}

// A grove, scattered so canopies overlap into a mass rather than reading as
// separate objects.
export function addGrove(batch, rng, { x0, z0, x1, z1, density = 0.3, kinds = ['normal'], minHeight = 0, step = 3 }) {
  for (let x = x0; x < x1; x += step) {
    for (let z = z0; z < z1; z += step) {
      const h = heightAt(Math.floor(x), Math.floor(z));
      if (h <= WORLD.seaLevel || h < minHeight) continue;
      if (biomeAt(Math.floor(x), Math.floor(z)) === BIOMES.rock) continue;
      if (rng() > density) continue;
      const kind = kinds[Math.floor(rng() * kinds.length)];
      addTree(batch, x + (rng() - 0.5) * 2, z + (rng() - 0.5) * 2, rng, kind);
    }
  }
  return batch;
}
