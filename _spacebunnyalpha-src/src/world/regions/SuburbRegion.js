import { WORLD, SEED, REGIONS } from '../../config.js';
import { heightAt, biomeAt, BIOMES, onBridge, riverCenterX, RIVER } from '../Terrain.js';
import { mulberry32 } from '../../util/rng.js';
import { addTree } from './Trees.js';

// Suburban lots: a detached house with a small garden and a driveway.
export function planSuburbLots() {
  const rect = REGIONS.suburbs.rect;
  const rng = mulberry32(SEED + 3003);

  // Two residential streets running east-west, plus short cul-de-sacs.
  const streetZ = [];
  for (let z = rect.z0 + 14; z < rect.z1 - 12; z += 30) streetZ.push(Math.round(z));

  const lots = [];
  let id = 0;

  // Houses sit far enough back from the carriageway that the camera has room
  // to orbit behind the player. With houses crowding the verge the camera
  // collides on the first frame and the whole view snaps to nose-distance.
  const laneOffset = 13;

  for (const sz of streetZ) {
    // Houses face the street on both sides.
    for (const side of [-1, 1]) {
      const z = sz + side * laneOffset;
      for (let x = rect.x0 + 8; x < rect.x1 - 8; x += 15) {
        const jitter = Math.floor(rng() * 2);
        const lotX = x + jitter;
        if (lotX + 11 > rect.x1 - 4) continue;
        const h = heightAt(lotX + 5, z + 4);
        if (h <= WORLD.seaLevel) continue;
        lots.push({
          x: lotX,
          z: z - 4,
          w: 11,
          d: 9,
          kind: 'house',
          side,
          streetZ: sz,
          seed: Math.floor(rng() * 1e6),
          id: id++
        });
      }
    }
  }

  return lots.filter((lot) => groundIsFlat(lot));
}

function groundIsFlat(lot) {
  const min = heightAt(lot.x + 2, lot.z + 2);
  const max = heightAt(lot.x + lot.w - 2, lot.z + lot.d - 2);
  return max - min <= 1;
}

const HOUSE_WALLS = ['houseWall', 'houseWallWood', 'houseWallBlue', 'houseWall'];
const HOUSE_ROOFS = [
  ['houseRoof', 'houseRoofBlue'],
  ['houseRoofBlue', 'buildingRoofBlue'],
  ['houseRoofGrey', 'houseRoof'],
  ['houseRoofGreen', 'houseRoofGrey']
];

export function describeHouse(lot) {
  const rng = mulberry32(lot.seed);
  const pair = HOUSE_ROOFS[Math.floor(rng() * HOUSE_ROOFS.length)];
  return {
    height: 4,
    wall: HOUSE_WALLS[Math.floor(rng() * HOUSE_WALLS.length)],
    roof: pair[0],
    // The second tile value. Alternating the two across the roof courses is
    // what makes a tiled roof read as tiled rather than as a grey slab.
    roofAlt: pair[1],
    // A gable roof: stepped courses climbing to a ridge.
    gable: rng() < 0.65,
    garage: rng() < 0.35,
    balcony: rng() < 0.3,
    twoStorey: rng() < 0.45
  };
}

// Builds one suburban house plus its garden furniture.
export function buildHouse(batch, lot) {
  const spec = describeHouse(lot);
  const base = heightAt(lot.x + Math.floor(lot.w / 2), lot.z + Math.floor(lot.d / 2));
  const rng = mulberry32(lot.seed + 13);

  const wallW = lot.w - 3;
  const wallD = lot.d - 3;
  const wallX = lot.x + 1.5;
  const wallZ = lot.z + 1.5;
  const cx = wallX + wallW / 2;
  const cz = wallZ + wallD / 2;

  const storeys = spec.twoStorey ? 6 : 4;

  // Walls: a hollow shell, floor by floor.
  for (let i = 0; i < storeys; i += 1) {
    const y = base + i + 0.5;
    batch.add(spec.wall, cx, y, wallZ, wallW, 1, 1);
    batch.add(spec.wall, cx, y, wallZ + wallD - 1, wallW, 1, 1);
    batch.add(spec.wall, wallX, y, cz, 1, 1, wallD);
    batch.add(spec.wall, wallX + wallW - 1, y, cz, 1, 1, wallD);
    if (i % 3 === 0) batch.add('concrete', cx, base + i + 0.05, cz, wallW, 0.12, wallD);
  }

  const topY = base + storeys;

  if (spec.gable) {
    // A stepped gable: rows of shrinking depth climbing to a ridge. Built as
    // stacked slabs rather than rotated ones, because a rotated box pivots about
    // its centre and leaves the eaves floating detached from the walls, which
    // reads as debris rather than as a roof.
    const steps = 3;
    for (let i = 0; i < steps; i += 1) {
      const t = i / steps;
      // Each step is shallower and higher than the last.
      const stepDepth = wallD / steps + 0.6;
      const z = wallZ - 0.3 + (i + 0.5) * (wallD + 0.6) / steps;
      const y = topY + 0.25 + i * 0.55;
      batch.add(i % 2 === 0 ? spec.roof : spec.roofAlt, cx, y, z, wallW + 1.6, 0.55, stepDepth);
    }
    // Ridge cap.
    batch.add(spec.roofAlt, cx, topY + 0.25 + steps * 0.55, cz, wallW + 1.9, 0.4, 0.7);
    // Gable ends, filling the triangle under the slope.
    for (const gx of [wallX - 0.1, wallX + wallW - 0.9]) {
      batch.add('woodPlank', gx, topY + 0.9, cz, 0.3, 1.8, wallD - 0.4);
    }
  } else {
    // Flat-ish hip roof with a parapet.
    batch.add(spec.roof, cx, topY + 0.35, cz, wallW + 1.4, 0.5, wallD + 1.4);
    batch.add('concrete', cx, topY + 0.75, cz, wallW + 1.8, 0.3, wallD + 1.8);
  }

  // Windows and a door on the street-facing side.
  const frontZ = lot.side < 0 ? wallZ + wallD + 0.05 : wallZ - 0.05;
  const facing = lot.side < 0 ? 1 : -1;
  for (let fy = 1; fy < storeys; fy += 2) {
    for (let k = -1; k <= 1; k += 2) {
      batch.add('windowLit', cx + k * 3, base + fy + 0.5, frontZ, 1.3, 1.2, 0.12);
    }
  }
  batch.add('woodPost', cx, base + 1, frontZ + facing * 0.05, 1.1, 2, 0.2);

  // Garden: a path from the door to the street, a hedge, and a tree.
  batch.add('stone', cx, base + 0.06, frontZ + facing * 2.2, 1.4, 0.12, 4);
  const hedgeZ = lot.side < 0 ? lot.z : lot.z + lot.d - 1;
  batch.add('leafGreen', cx, base + 0.5, hedgeZ, lot.w - 2, 1, 0.6);

  if (rng() < 0.7) addTree(batch, lot.x + 1 + rng() * (lot.w - 2), lot.z + 1 + rng() * (lot.d - 2), rng);

  // Balcony on some two-storey houses.
  if (spec.balcony && spec.twoStorey) {
    batch.add('concrete', cx, base + 3.2, frontZ + facing * 0.7, wallW - 1.5, 0.2, 1.4);
    batch.add('metal', cx, base + 3.8, frontZ + facing * 1.3, wallW - 1.5, 1.2, 0.12);
  }

  // Garage and a parked car.
  if (spec.garage) {
    const gx = lot.x + lot.w - 3.5;
    const gz = lot.z + lot.d - 4;
    batch.add('concrete', gx, base + 1.5, gz, 3.4, 3, 3.4);
    batch.add('houseRoofGrey', gx, base + 3.2, gz, 3.8, 0.4, 3.8);
    batch.add('metal', gx, base + 1.2, gz - 1.75, 2.6, 2.2, 0.2);
    batch.add('metalDark', gx, base + 0.4, gz + 3.4, 2.4, 0.7, 1.6);
  }

  return batch;
}

// Streets, pavements, hedges, mailboxes, utility poles.
export function buildSuburbStreets(batch) {
  const rect = REGIONS.suburbs.rect;
  const rng = mulberry32(SEED + 3011);

  for (let z = rect.z0 + 14; z < rect.z1 - 12; z += 30) {
    // Carriageway.
    batch.add('asphalt', (rect.x0 + rect.x1) / 2, heightAt(Math.floor((rect.x0 + rect.x1) / 2), z) + 0.06, z, rect.x1 - rect.x0 - 12, 0.12, 5);
    // Centre dashes.
    for (let x = rect.x0 + 8; x < rect.x1 - 8; x += 6) {
      batch.add('laneYellow', x, heightAt(x, z) + 0.13, z, 2.4, 0.08, 0.2);
    }
    // Pavements either side.
    for (const side of [-1, 1]) {
      const pz = z + side * 3;
      batch.add('sidewalk', (rect.x0 + rect.x1) / 2, heightAt(Math.floor((rect.x0 + rect.x1) / 2), pz) + 0.1, pz, rect.x1 - rect.x0 - 12, 0.2, 1.6);
    }

    // Street lamps on alternating sides.
    for (let x = rect.x0 + 12; x < rect.x1 - 12; x += 22) {
      const side = (Math.floor((x - rect.x0) / 22) % 2 === 0) ? -1 : 1;
      const lz = z + side * 3;
      const ly = heightAt(x, lz);
      batch.add('lampPost', x, ly + 2.4, lz, 0.24, 4.8, 0.24);
      batch.add('lampGlass', x, ly + 4.9, lz, 0.6, 0.35, 0.6);
    }
  }

  // Utility poles with sagging wires along one side.
  for (let z = rect.z0 + 10; z < rect.z1 - 8; z += 34) {
    for (let x = rect.x0 + 10; x < rect.x1 - 10; x += 26) {
      const py = heightAt(x, z);
      batch.add('utilityPole', x, py + 4.5, z, 0.36, 9, 0.36);
      batch.add('woodPost', x, py + 8.2, z, 2.6, 0.3, 0.3);
      batch.add('woodPost', x, py + 7.4, z, 2.2, 0.3, 0.3);
    }
  }

  return batch;
}

// A konbini: the one building that glows all night.
export function buildKonbini(batch, x, z) {
  const base = heightAt(x, z);
  const w = 14;
  const d = 10;

  batch.add('concrete', x + w / 2, base + 0.1, z + d / 2, w + 2, 0.2, d + 2);
  batch.add('vendingBody', x + w / 2, base + 2.5, z + d / 2, w, 5, d);
  // Interior glow: a lit ceiling band behind the front glass.
  batch.add('lampGlass', x + w / 2, base + 3.4, z - 0.05, w - 2.4, 2.4, 0.16);
  batch.add('windowDark', x + w / 2, base + 3.4, z + 0.02, w - 1.6, 3, 0.1);

  // Fascia and the stripe that every konbini has.
  batch.add('lampGlass', x + w / 2, base + 5.3, z - 0.3, w + 0.6, 1.1, 0.5);
  batch.add('neonBlue', x + w / 2, base + 5.3, z - 0.62, w + 0.2, 0.3, 0.14);
  batch.add('neonRed', x + w / 2, base + 6.1, z - 0.62, w * 0.4, 0.22, 0.14);
  batch.add('concrete', x + w / 2, base + 5.9, z + d / 2, w + 1.4, 0.4, d + 1.4);

  // Vending machines by the door, and a bench.
  batch.add('vending', x + 1.4, base + 1.1, z - 1.4, 1.2, 2.2, 0.8);
  batch.add('vendingBlue', x + 1.4, base + 1.2, z - 1.85, 0.9, 1.2, 0.1);
  batch.add('vending', x + 2.9, base + 1.1, z - 1.4, 1.2, 2.2, 0.8);
  batch.add('lampGlass', x + 2.9, base + 1.2, z - 1.85, 0.9, 1.2, 0.1);
  batch.add('woodPlank', x + w - 3, base + 0.5, z - 1.6, 2.4, 0.2, 0.7);
  batch.add('metalDark', x + w - 3, base + 0.25, z - 1.6, 2.4, 0.5, 0.4);

  // Car park markings.
  for (let i = 0; i < 4; i += 1) {
    batch.add('laneWhite', x + 2 + i * 3.2, base + 0.08, z + d + 3, 0.16, 0.08, 5);
  }

  return batch;
}

// A school: long low building, a yard, a running track, and a gate.
export function buildSchool(batch, x, z) {
  const base = heightAt(x, z);
  const w = 26;
  const d = 12;

  batch.add('schoolYard', x + w / 2, base + 0.08, z + d / 2 + 6, w + 8, 0.16, d + 14);
  batch.add('schoolWall', x + w / 2, base + 3.5, z + d / 2, w, 7, d);
  batch.add('schoolRoof', x + w / 2, base + 7.3, z + d / 2, w + 1.2, 0.6, d + 1.2);

  // Window bands.
  for (let i = 0; i < 9; i += 1) {
    batch.add('window', x + 3 + i * 2.6, base + 4.4, z - 0.06, 1.8, 1.8, 0.14);
    batch.add('window', x + 3 + i * 2.6, base + 4.4, z + d + 0.06, 1.8, 1.8, 0.14);
  }

  // Entrance canopy and a clock over the gate.
  batch.add('concrete', x + w / 2, base + 3.2, z - 2.2, 8, 0.35, 4);
  batch.add('metal', x + w / 2, base + 1.6, z - 3.6, 0.3, 3.2, 0.3);
  batch.add('metal', x + w / 2, base + 1.6, z - 1.2, 0.3, 3.2, 0.3);
  batch.add('signWhite', x + w / 2, base + 4.4, z - 0.2, 3.4, 1.2, 0.2);
  batch.add('metal', x + w / 2, base + 3.4, z - 0.25, 1, 1, 0.16);

  // Running track: an oval of red cinder.
  batch.add('barnRoof', x + w / 2, base + 0.1, z + d + 13, w + 4, 0.2, 5);
  batch.add('meadow', x + w / 2, base + 0.2, z + d + 13, w - 6, 0.2, 2.4);

  // Goal posts and a couple of trees for shade.
  for (const side of [-1, 1]) {
    batch.add('signWhite', x + w / 2 + side * (w / 2 - 4), base + 1.4, z + d + 13, 0.2, 2.8, 2.4);
  }
  const rng = mulberry32(SEED + 3021);
  for (let i = 0; i < 5; i += 1) {
    addTree(batch, x + 2 + rng() * (w - 4), z + d + 8 + rng() * 6, rng);
  }

  return batch;
}

// The rail line: embankment, sleepers, rails, and a small platform.
export function buildRailLine(batch, z0, z1) {
  const rng = mulberry32(SEED + 3031);

  for (let z = z0; z < z1; z += 1) {
    const x = Math.round(riverCenterX(z) + 30);
    const h = heightAt(x, z);
    if (h <= WORLD.seaLevel) continue;

    batch.add('stoneDark', x, h + 0.1, z + 0.5, 7, 0.2, 1);
    batch.add('woodPost', x, h + 0.24, z + 0.5, 5, 0.12, 0.3);
    batch.add('metal', x - 0.7, h + 0.34, z + 0.5, 0.14, 0.14, 1);
    batch.add('metal', x + 0.7, h + 0.34, z + 0.5, 0.14, 0.14, 1);
  }

  // A single small station where the line meets a residential street.
  const sx = Math.round(riverCenterX(z0 + 20) + 30);
  const sh = heightAt(sx, z0 + 20);
  batch.add('concrete', sx - 5, sh + 0.5, z0 + 20, 8, 1, 10);
  batch.add('houseRoofGrey', sx - 5, sh + 1.2, z0 + 20, 9, 0.4, 11);
  for (let i = 0; i < 3; i += 1) {
    batch.add('metal', sx - 8, sh + 2, z0 + 17 + i * 3, 0.24, 4, 0.24);
  }
  batch.add('houseRoofGrey', sx - 8, sh + 4.2, z0 + 20, 8, 0.35, 10);
  batch.add('signWhite', sx - 3.4, sh + 1.9, z0 + 15, 1.4, 0.8, 0.14);
  batch.add('lampPost', sx - 1, sh + 2, z0 + 17, 0.2, 4, 0.2);
  batch.add('lampGlass', sx - 1, sh + 4.1, z0 + 17, 0.5, 0.3, 0.5);

  return batch;
}

export const SUBURB_FURNITURE = {
  konbini: { x: 150, z: 176 },
  school: { x: 44, z: 168 }
};