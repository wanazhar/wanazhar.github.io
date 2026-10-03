import { WORLD, SEED, REGIONS } from '../../config.js';
import { heightAt, biomeAt, BIOMES, MOUNTAIN, onBridge } from '../Terrain.js';
import { mulberry32 } from '../../util/rng.js';
import { addTree } from './CityRegion.js';

// ---------------------------------------------------------------------------
// Terraced rice paddies. Each terrace is a flat basin with a raised mud rim,
// so the staircase of the mountainside reads clearly from the road.
// ---------------------------------------------------------------------------

export function buildPaddies(batch) {
  const rect = REGIONS.rural.rect;
  const rng = mulberry32(SEED + 4004);

  for (let z = rect.z0 + 10; z < rect.z1 - 20; z += 2) {
    for (let x = rect.x0 + 10; x < rect.x1 - 30; x += 2) {
      if (biomeAt(x, z) !== BIOMES.paddy) continue;
      if (rng() < 0.06) continue;

      const h = heightAt(x, z);
      if (h <= WORLD.seaLevel) continue;

      // Each terrace is a flat basin holding still water, with a raised mud bund
      // around it. The water is a mirror: it takes a sky-tinted colour with a
      // brighter strip toward the horizon, which at golden hour makes the whole
      // hillside a second sky. That single effect is worth more than any
      // amount of rice geometry.
      const mirror = 'paddyWater';
      const sheen = 'foam';
      batch.add(mirror, x + 0.5, h + 0.32, z + 0.5, 2, 0.2, 2);
      // Sun path on the water.
      batch.add(sheen, x + 0.5, h + 0.38, z + 0.5, 1.5, 0.06, 0.5);
      // Mud bund around the plot.
      batch.add('paddyMud', x + 0.5, h + 0.5, z + 0.02, 2, 0.5, 0.2);
      batch.add('paddyMud', x + 0.5, h + 0.5, z + 1.98, 2, 0.5, 0.2);
      batch.add('paddyMud', x + 0.02, h + 0.5, z + 0.5, 0.2, 0.5, 2);
      batch.add('paddyMud', x + 1.98, h + 0.5, z + 0.5, 0.2, 0.5, 2);

      // Rice seedlings in rows.
      const growth = cellGrowth(x, z);
      const mat = growth > 0.6 ? 'riceGold' : 'riceGreen';
      for (let dx = 0.4; dx < 2; dx += 0.5) {
        for (let dz = 0.4; dz < 2; dz += 0.5) {
          batch.add(mat, x + dx, h + 0.5 + growth * 0.5, z + dz, 0.14, 0.4 + growth * 0.7, 0.14);
        }
      }
    }
  }

  // Irrigation channel: a thin ribbon of water winding between terraces.
  let channelZ = rect.z0 + 16;
  for (let x = rect.x0 + 8; x < rect.x1 - 34; x += 1) {
    channelZ += (rng() - 0.5) * 0.4;
    const h = heightAt(x, Math.round(channelZ));
    if (h <= WORLD.seaLevel) continue;
    batch.add('stone', x + 0.5, h + 0.4, channelZ, 1, 0.35, 1);
    batch.add('paddyWater', x + 0.5, h + 0.55, channelZ, 1, 0.14, 0.7);
  }

  return batch;
}

// How grown a rice plot is: deterministic per plot so the fields look the same
// every visit, but vary enough to read as a real crop.
function cellGrowth(x, z) {
  const v = Math.sin(x * 0.37 + z * 0.21) * 0.5 + 0.5;
  return Math.min(1, Math.max(0.2, v));
}

// ---------------------------------------------------------------------------
// The orchard: neat rows of fruit trees with a packing shed.
// ---------------------------------------------------------------------------

export function buildOrchard(batch) {
  const rect = { x0: 186, z0: 150, x1: 226, z1: 190 };
  const rng = mulberry32(SEED + 4014);

  for (let x = rect.x0 + 2; x < rect.x1 - 2; x += 5) {
    for (let z = rect.z0 + 2; z < rect.z1 - 2; z += 5) {
      if (heightAt(x, z) <= WORLD.seaLevel) continue;
      addTree(batch, x + (rng() - 0.5), z + (rng() - 0.5), rng, 'orchard');
      // Grass strip between rows, kept mown.
      if (rng() < 0.4) batch.add('orchardGrass', x + 2.5, heightAt(Math.floor(x) + 2, Math.floor(z)) + 0.1, z + 2.5, 4, 0.12, 4);
    }
  }

  // Packing shed at the orchard edge.
  const sx = rect.x1 - 2;
  const sz = rect.z0 + 6;
  const sh = heightAt(sx, sz);
  batch.add('woodPlank', sx + 3, sh + 2, sz + 3, 7, 4, 6);
  batch.add('barnRoof', sx + 3, sh + 4.4, sz + 3, 7.8, 0.5, 6.8);
  batch.add('woodPost', sx + 1, sh + 2, sz + 0.1, 0.4, 4, 0.3);
  batch.add('woodPost', sx + 5, sh + 2, sz + 0.1, 0.4, 4, 0.3);
  // Crates of fruit stacked outside.
  for (let i = 0; i < 5; i += 1) {
    batch.add('crate', sx - 1 + (i % 3) * 1.2, sh + 0.5 + Math.floor(i / 3) * 0.9, sz + 1 + Math.floor(i / 3) * 1.4, 1, 0.9, 1);
    batch.add('riceGold', sx - 1 + (i % 3) * 1.2, sh + 1.05 + Math.floor(i / 3) * 0.9, sz + 1 + Math.floor(i / 3) * 1.4, 0.8, 0.3, 0.8);
  }

  return batch;
}

// ---------------------------------------------------------------------------
// The shrine, up the mountain road.
// ---------------------------------------------------------------------------

export function buildShrine(batch) {
  const sx = MOUNTAIN.x - 4;
  const sz = MOUNTAIN.z + 2;
  const base = heightAt(sx, sz);

  // Stepped stone approach up the last of the slope.
  for (let i = 0; i < 12; i += 1) {
    const z = sz + 14 - i * 1.4;
    batch.add('stone', sx + 2, heightAt(sx + 2, Math.round(z)) + 0.2, z, 10, 0.4, 1.6);
  }

  // Torii gate at the foot of the steps.
  const tz = sz + 16;
  const tY = heightAt(sx + 2, Math.round(tz));
  const legH = 5;
  batch.add('toriiRed', sx - 1, tY + legH / 2, tz, 0.7, legH, 0.7);
  batch.add('toriiRed', sx + 5, tY + legH / 2, tz, 0.7, legH, 0.7);
  batch.add('toriiRedDark', sx + 2, tY + legH + 0.4, tz, 9.6, 0.8, 1.1);
  batch.add('toriiRed', sx + 2, tY + legH + 1.3, tz, 10.6, 0.6, 1.3);
  batch.add('toriiRedDark', sx + 2, tY + legH + 1.9, tz, 9, 0.5, 1);
  // Rope and paper streamers.
  batch.add('woodPlank', sx + 2, tY + legH - 0.2, tz, 7, 0.3, 0.3);
  for (let i = 0; i < 3; i += 1) {
    batch.add('signWhite', sx - 0.5 + i * 2.5, tY + legH - 0.9, tz, 0.5, 0.9, 0.16);
  }

  // Stone lanterns lining the path.
  for (let i = 0; i < 5; i += 1) {
    const z = sz + 12 - i * 2.4;
    const x = i % 2 === 0 ? sx - 2.5 : sx + 6.5;
    const ly = heightAt(Math.round(x), Math.round(z));
    batch.add('lanternStone', x, ly + 0.5, z, 0.7, 1, 0.7);
    batch.add('lanternStone', x, ly + 1.2, z, 0.5, 0.6, 0.5);
    batch.add('lampGlass', x, ly + 1.75, z, 0.6, 0.7, 0.6);
    batch.add('stone', x, ly + 2.2, z, 0.9, 0.3, 0.9);
  }

  // The hall itself.
  const hw = 12;
  const hd = 10;
  batch.add('stoneLight', sx + 2, base + 0.4, sz + 4, hw + 3, 0.8, hd + 3);
  for (let i = 0; i < 5; i += 1) {
    batch.add('shrineWood', sx + 2, base + 1 + i, sz + 4, hw, 1, hd);
  }
  // Curved roof, approximated with stacked slabs that step inward.
  for (let i = 0; i < 3; i += 1) {
    const w = hw + 2 - i * 3;
    batch.add('shrineRoof', sx + 2, base + 6.2 + i * 0.7, sz + 4, w, 0.7, hd + 2 - i * 1.6);
  }
  batch.add('shrineRoofEdge', sx + 2, base + 8.6, sz + 4, hw + 3.5, 0.5, hd + 3.5);
  // Steps, pillars, and a bell rope.
  batch.add('stone', sx + 2, base + 0.9, sz - 0.6, 8, 0.4, 1.6);
  batch.add('shrineWoodDark', sx - 3, base + 3, sz, 0.7, 5, 0.7);
  batch.add('shrineWoodDark', sx + 7, base + 3, sz, 0.7, 5, 0.7);
  batch.add('signWhite', sx + 2, base + 4.4, sz - 0.3, 2.6, 1.6, 0.2);
  batch.add('woodPlank', sx + 2, base + 3.6, sz - 0.4, 0.24, 3, 0.24);

  return batch;
}

// ---------------------------------------------------------------------------
// Barn, windpump, and fencing along the mountain road.
// ---------------------------------------------------------------------------

export function buildFarm(batch, x, z) {
  const base = heightAt(x, z);

  batch.add('barnWall', x + 5, base + 2.5, z + 4, 10, 5, 8);
  batch.add('barnRoof', x + 5, base + 5.6, z + 4, 11, 0.8, 9);
  batch.add('barnWall', x + 5, base + 6.4, z + 4, 6, 1.2, 5);
  batch.add('barnRoof', x + 5, base + 7.4, z + 4, 7, 0.6, 6);
  batch.add('woodPost', x + 1.2, base + 1.6, z + 0.1, 2.4, 3.2, 0.3);
  batch.add('signWhite', x + 1.2, base + 1.6, z - 0.1, 1.8, 1.8, 0.14);
  batch.add('driftwood', x + 1.2, base + 1.6, z - 0.2, 0.2, 2, 0.1);

  // Hay bales and a water trough.
  const rng = mulberry32(SEED + 4024);
  for (let i = 0; i < 4; i += 1) {
    batch.add('riceGold', x + 8 + rng() * 4, base + 0.6, z + 8 + rng() * 3, 1.6, 1.2, 1.6);
  }
  batch.add('woodPlank', x - 2, base + 0.4, z + 6, 3, 0.8, 1.2);
  batch.add('paddyWater', x - 2, base + 0.75, z + 6, 2.6, 0.16, 0.9);

  // Windpump: a lattice tower with a spinning rotor head.
  const wx = x + 12;
  const wz = z + 1;
  const wh = heightAt(wx, wz);
  const towerH = 10;
  for (let i = 0; i < 5; i += 1) {
    const t = i / 5;
    const spread = 2.2 * (1 - t);
    batch.add('metalDark', wx - spread, wh + 0.5 + i * 2, wz, 0.2, 2, 0.2);
    batch.add('metalDark', wx + spread, wh + 0.5 + i * 2, wz, 0.2, 2, 0.2);
    batch.add('metalDark', wx, wh + 0.5 + i * 2, wz - spread, 0.2, 2, 0.2);
    batch.add('metalDark', wx, wh + 0.5 + i * 2, wz + spread, 0.2, 2, 0.2);
  }
  batch.add('metal', wx, wh + towerH + 0.4, wz, 1, 0.8, 1);
  batch.add('metalDark', wx, wh + towerH + 1.1, wz - 0.8, 3.4, 0.3, 0.3);
  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * Math.PI * 2;
    batch.add('metal', wx + Math.cos(a) * 1.6, wh + towerH + 1.6, wz, 0.8, 0.9, 0.12, { ry: -a });
  }

  // Post-and-rail fencing around the yard.
  for (let i = 0; i < 14; i += 1) {
    const fx = x - 5 + i * 1.6;
    const fh = heightAt(Math.floor(fx), z + 11);
    if (fh <= WORLD.seaLevel) continue;
    batch.add('woodPost', fx, fh + 0.7, z + 11, 0.24, 1.4, 0.24);
    if (i > 0) batch.add('fenceWood', fx - 0.8, fh + 1.1, z + 11, 1.6, 0.16, 0.12);
    batch.add('fenceWood', fx, fh + 0.5, z + 11, 1.6, 0.16, 0.12);
  }

  return batch;
}

// Pine forest and bamboo grove on the upper slopes.
export function buildHighlandVegetation(batch) {
  const rng = mulberry32(SEED + 4034);

  for (let x = 176; x < 288; x += 3) {
    for (let z = 28; z < 212; z += 3) {
      const h = heightAt(x, z);
      if (h <= WORLD.seaLevel || h < 14) continue;
      const slopeRisk = biomeAt(x, z) === BIOMES.rock ? 0.55 : 0;
      const r = rng();
      const density = 0.3 - slopeRisk;
      if (r < density) {
        const kind = h > 22 ? 'pine' : r < density * 0.4 ? 'bamboo' : 'normal';
        addTree(batch, x + (rng() - 0.5) * 2, z + (rng() - 0.5) * 2, rng, kind);
      }
    }
  }

  // A stand of bamboo, because there is always a bamboo stand.
  for (let z = 60; z < 90; z += 2) {
    for (let x = 250; x < 268; x += 2) {
      if (heightAt(x, z) <= WORLD.seaLevel) continue;
      addTree(batch, x, z, rng, 'bamboo');
    }
  }

  return batch;
}

// Stone lanterns and a small roadside shrine along the mountain road.
export function buildMountainRoad(batch) {
  const rng = mulberry32(SEED + 4044);

  // The road climbs from the river crossing to the shrine.
  let x = 232;
  let z = 150;
  while (z > 100) {
    const h = heightAt(Math.round(x), Math.round(z));
    if (h > WORLD.seaLevel) {
      batch.add('dirt', x, h + 0.08, z, 4, 0.16, 4);
      batch.add('stoneDark', x - 1.4, h + 0.5, z, 0.5, 1, 4);
    }
    x += (rng() - 0.5) * 1.2;
    z -= 2;
  }

  return batch;
}

export const RURAL_FURNITURE = {
  shrine: { x: MOUNTAIN.x - 4, z: MOUNTAIN.z + 2 },
  farm: { x: 196, z: 196 },
  orchardShed: { x: 224, z: 156 }
};