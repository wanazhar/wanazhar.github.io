import { WORLD, SEED, REGIONS } from '../../config.js';
import { heightAt, biomeAt, BIOMES, cellJitter } from '../Terrain.js';
import { mulberry32 } from '../../util/rng.js';
import { addTree } from './CityRegion.js';

// ---------------------------------------------------------------------------
// Beach furniture: driftwood, shells, seaweed, tide pools.
// ---------------------------------------------------------------------------

export function buildBeachDetail(batch) {
  const rect = REGIONS.coast.rect;
  const rng = mulberry32(SEED + 5005);

  for (let x = rect.x0; x < rect.x1; x += 2) {
    for (let z = rect.z0; z < rect.z1; z += 2) {
      const h = heightAt(x, z);
      if (h <= WORLD.seaLevel || h > WORLD.seaLevel + 3) continue;
      const biome = biomeAt(x, z);
      if (biome !== BIOMES.sand && biome !== BIOMES.shallow) continue;

      const r = cellJitter(x, z, 6123);

      if (r > 0.95) {
        // Driftwood, lying at whatever angle the beach happens to run.
        batch.add('driftwood', x + 0.5, h + 0.25, z + 0.5, 1.6 + rng(), 0.4, 0.5, { ry: rng() * Math.PI });
      } else if (r > 0.93) {
        batch.add('wetSand', x + 0.5, h + 0.1, z + 0.5, 1.2, 0.2, 1.2);
      } else if (r > 0.9) {
        batch.add('stone', x + 0.5, h + 0.14, z + 0.5, 0.4, 0.28, 0.4);
      } else if (r > 0.87) {
        // A tuft of beach grass or a piece of kelp.
        batch.add(rng() < 0.5 ? 'grassTuft' : 'leafMaple', x + 0.5, h + 0.3, z + 0.5, 0.5, 0.6, 0.5);
      }

      // Tide pools: a shallow basin of water sitting in a hollow.
      if (h === WORLD.seaLevel && cellJitter(x, z, 6180) > 0.97) {
        batch.add('sand', x + 0.5, h + 0.45, z + 0.5, 2, 0.5, 2);
        batch.add('waterShallow', x + 0.5, h + 0.72, z + 0.5, 1.6, 0.2, 1.6);
      }
    }
  }

  return batch;
}

// ---------------------------------------------------------------------------
// The big torii standing out in the water. It is the one landmark you can see
// from the suburbs, which is the whole point of it.
// ---------------------------------------------------------------------------

export function buildSeaTorii(batch) {
  const tx = 120;
  const tz = 286;
  const legH = 11;

  // Found on rock outcrops rather than loose sand, the way real ones are.
  for (const ox of [-3.5, 3.5]) {
    const oz = 1.5;
    const base = WORLD.seaLevel - 1;
    batch.add('rockWet', tx + ox, base + 0.5, tz + oz, 3, 1.6, 3);
    batch.add('rock', tx + ox, base + 1.4, tz + oz, 2.2, 0.6, 2.2);
    batch.add('toriiRed', tx + ox, base + 1.8 + legH / 2, tz + oz, 1.1, legH, 1.1);
  }

  const lintelY = WORLD.seaLevel + 0.8 + legH;
  // Kasagi: the top lintel, curved upward at the ends.
  batch.add('toriiRed', tx, lintelY + 1.4, tz + 1.5, 14, 1, 1.8);
  batch.add('toriiRedDark', tx - 6.6, lintelY + 1.5, tz + 1.5, 2.2, 1.1, 2, { rz: 0.16 });
  batch.add('toriiRedDark', tx + 6.6, lintelY + 1.5, tz + 1.5, 2.2, 1.1, 2, { rz: -0.16 });
  // Shimaki and nuki beneath it.
  batch.add('toriiRed', tx, lintelY + 0.4, tz + 1.5, 12.4, 0.7, 1.4);
  batch.add('toriiRedDark', tx, lintelY - 0.5, tz + 1.5, 10, 0.8, 1.2);
  // Gakuzuka: the small central strut.
  batch.add('toriiRed', tx, lintelY - 0.1, tz + 1.5, 1, 1.4, 1);
  batch.add('signWhite', tx, lintelY - 0.1, tz + 1.02, 0.7, 0.9, 0.14);

  return batch;
}

// ---------------------------------------------------------------------------
// A tiny fishing village: a handful of houses, a harbour wall, a boat.
// ---------------------------------------------------------------------------

// The fishing village. Site chosen by scoring the coast for a wide band of
  // dry, low-slope ground: the shelf around x 190-250, z 220-232 is by far
  // the flattest stretch, so the village sits there rather than at the
  // southern beach, which is too broken by tidal channels to build on.
export const COAST_VILLAGE = { x0: 190, x1: 250, z0: 218, z1: 234, centreX: 220, centreZ: 226 };

export function planCoastHouses() {
  const rng = mulberry32(SEED + 5015);
  const houses = [];

  // A lane running parallel to the shore, with plots strung along both sides.
  // Laying the village out along a street beats rejection-sampling positions:
  // the shore is too irregular for random placement to find enough sites.
  // Plots whose footprint straddles water or a slope are left empty, so the
  // village naturally thins out where the coast eats into the shelf.
  const laneZ = COAST_VILLAGE.centreZ;
  const pitch = 12;
  const offset = 6;

  for (let x = COAST_VILLAGE.x0; x < COAST_VILLAGE.x1; x += pitch) {
    for (const side of [-1, 1]) {
      const z = laneZ + side * offset + Math.floor((rng() - 0.5) * 2);
      const h = heightAt(x, z);

      if (h <= WORLD.seaLevel || h > WORLD.seaLevel + 6) continue;

      // The footprint must sit on dry ground with only gentle variation.
      // Minor 1-2 block steps are fine: the stilts absorb them, and being
      // strict here rejects most of an irregular shoreline for no visual gain.
      let ok = true;
      let lowest = Infinity;
      let highest = -Infinity;
      for (let dx = 0; dx <= 9 && ok; dx += 1) {
        for (let dz = 0; dz <= 8 && ok; dz += 1) {
          const hh = heightAt(x + dx, z + dz);
          if (hh <= WORLD.seaLevel) ok = false;
          if (hh < lowest) lowest = hh;
          if (hh > highest) highest = hh;
        }
      }
      if (!ok) continue;
      // Reject only genuinely steep or cliffed ground.
      if (highest - lowest > 2) continue;

      houses.push({ x, z, w: 9, d: 8, seed: Math.floor(rng() * 1e6), side, id: houses.length });
    }
  }

  return houses;
}

// The village lane: a packed-earth road with a low stone wall behind it.
export function buildVillageLane(batch) {
  const laneZ = COAST_VILLAGE.centreZ;
  for (let x = COAST_VILLAGE.x0 - 4; x < COAST_VILLAGE.x1 + 4; x += 1) {
    const h = heightAt(x, Math.round(laneZ));
    if (h <= WORLD.seaLevel) continue;
    batch.add('dirt', x + 0.5, h + 0.08, laneZ + 0.5, 1, 0.16, 5);
    for (const side of [-1, 1]) {
      const z = laneZ + side * 3.5;
      batch.add('stone', x + 0.5, heightAt(x, Math.round(z)) + 0.3, z, 1, 0.5, 0.5);
    }
  }

  // A single lamp at the middle of the lane, and a bench.
  const mx = COAST_VILLAGE.centreX;
  const mh = heightAt(mx, Math.round(laneZ));
  batch.add('lampPost', mx, mh + 2.4, laneZ + 3, 0.24, 4.8, 0.24);
  batch.add('lampGlass', mx, mh + 4.9, laneZ + 3, 0.6, 0.35, 0.6);
  batch.add('woodPlank', mx + 4, mh + 0.5, laneZ + 3, 2.4, 0.2, 0.7);
  batch.add('woodPost', mx + 3.2, mh + 0.25, laneZ + 3, 0.16, 0.5, 0.6);
  batch.add('woodPost', mx + 4.8, mh + 0.25, laneZ + 3, 0.16, 0.5, 0.6);

  return batch;
}

export function buildCoastHouse(batch, lot) {
  const spec = {
    height: 4,
    wall: ['houseWall', 'houseWallWood', 'clothCream'][lot.seed % 3],
    roof: ['houseRoof', 'houseRoofGrey', 'houseRoofBlue'][lot.seed % 3],
    roofAlt: ['houseRoofGrey', 'houseRoofBlue', 'houseRoof'][lot.seed % 3]
  };
  const base = heightAt(lot.x + 4, lot.z + 4);
  const rng = mulberry32(lot.seed + 5);

  // Raised on short stilts, because the ground is soft sand.
  for (const [sx, sz] of [[lot.x + 1, lot.z + 1], [lot.x + lot.w - 2, lot.z + 1], [lot.x + 1, lot.z + lot.d - 2], [lot.x + lot.w - 2, lot.z + lot.d - 2]]) {
    batch.add('woodPost', sx, base + 0.6, sz, 0.4, 1.2, 0.4);
  }

  const wallX = lot.x;
  const wallZ = lot.z;
  const cx = wallX + lot.w / 2;
  const cz = wallZ + lot.d / 2;

  for (let i = 0; i < spec.height; i += 1) {
    const y = base + 1.2 + i + 0.5;
    batch.add(spec.wall, cx, y, wallZ, lot.w, 1, 1);
    batch.add(spec.wall, cx, y, wallZ + lot.d - 1, lot.w, 1, 1);
    batch.add(spec.wall, wallX, y, cz, 1, 1, lot.d);
    batch.add(spec.wall, wallX + lot.w - 1, y, cz, 1, 1, lot.d);
  }

  const topY = base + 1.2 + spec.height;
  // Steep roof, because it rains sideways on this coast. Stepped courses
  // rather than rotated slabs: a rotated box pivots about its own centre and
  // leaves the eaves hanging in mid-air.
  const steps = 3;
  for (let i = 0; i < steps; i += 1) {
    const stepDepth = (lot.d + 1.2) / steps;
    const z = lot.z - 0.6 + (i + 0.5) * stepDepth;
    batch.add(i % 2 === 0 ? spec.roof : spec.roofAlt, cx, topY + 0.3 + i * 0.5, z, lot.w + 1.6, 0.5, stepDepth);
  }
  batch.add(spec.roofAlt, cx, topY + 0.3 + steps * 0.5, cz, lot.w + 1.8, 0.4, 0.6);
  // Gable ends.
  for (const gx of [lot.x - 0.1, lot.x + lot.w - 0.9]) {
    batch.add('woodPlank', gx, topY + 0.8, cz, 0.3, 1.6, lot.d - 0.6);
  }

  // Windows, door, and a drying rack.
  batch.add('windowLit', cx - 2, base + 2.6, wallZ - 0.05, 1.2, 1.1, 0.12);
  batch.add('windowLit', cx + 2, base + 2.6, wallZ - 0.05, 1.2, 1.1, 0.12);
  batch.add('woodPost', cx, base + 2, wallZ - 0.05, 1.1, 1.8, 0.2);
  batch.add('woodPost', cx - 3, base + 3.4, wallZ - 1.2, 0.16, 2.4, 0.16);
  batch.add('woodPost', cx + 3, base + 3.4, wallZ - 1.2, 0.16, 2.4, 0.16);
  batch.add('woodPlank', cx, base + 4.4, wallZ - 1.2, 6.4, 0.14, 0.14);
  for (let i = 0; i < 3; i += 1) {
    batch.add(i % 2 ? 'clothRed' : 'neonBlue', cx - 2 + i * 2, base + 3.8, wallZ - 1.2, 0.9, 1.2, 0.1);
  }

  if (rng() < 0.6) addTree(batch, lot.x + 1 + rng() * (lot.w - 2), lot.z + 1 + rng() * (lot.d - 2), rng, 'pine');

  return batch;
}

// A stone harbour wall sheltering a couple of moored boats, built just south
// of the fishing village and running out into the water.
export function buildHarbour(batch) {
  const hx = COAST_VILLAGE.centreX - 6;
  const hz = COAST_VILLAGE.z1 + 6;
  const rng = mulberry32(SEED + 5025);

  // Breakwater running out into the sea.
  for (let i = 0; i < 30; i += 1) {
    const z = hz + i;
    const h = heightAt(hx, Math.round(z));
    const y = Math.max(h, WORLD.seaLevel - 1);
    batch.add('stoneDark', hx, y + 0.9, z, 4, 2.2, 1.05);
    if (i % 4 === 0) batch.add('stone', hx + 1.4, y + 2.1, z, 1, 0.5, 1.05);
  }

  // Two boats, one moored inside the wall and one out at sea.
  buildFishingBoat(batch, hx - 6, hz + 8, 0.4, rng);
  buildFishingBoat(batch, 150, 292, 1.9, rng);

  // Crab pots and coils of rope on the quay.
  for (let i = 0; i < 5; i += 1) {
    const px = hx - 8 + rng() * 8;
    const pz = hz + 2 + rng() * 6;
    const h = heightAt(Math.floor(px), Math.floor(pz));
    batch.add('crate', px, h + 0.5, pz, 1.2, 1, 1.2);
  }

  return batch;
}

export function buildFishingBoat(batch, x, z, heading, rng) {
  const deckY = WORLD.seaLevel + 0.55;

  // Hull: a stack of narrowing slabs makes a convincing taper.
  batch.add('boatHullDark', x, deckY - 0.7, z, 3.4, 1, 8, { ry: heading });
  batch.add('boatHull', x, deckY - 0.1, z, 3.6, 0.7, 8, { ry: heading });
  // Pointed bow and stern.
  batch.add('boatHull', x + Math.cos(heading) * 4.4, deckY - 0.1, z + Math.sin(heading) * 4.4, 2.2, 0.7, 2.2, { ry: heading });
  batch.add('boatHullDark', x - Math.cos(heading) * 4.2, deckY - 0.1, z - Math.sin(heading) * 4.2, 2.6, 0.7, 2.4, { ry: heading });

  // Wheelhouse and mast.
  batch.add('clothCream', x, deckY + 0.9, z - Math.sin(heading) * 1.6, 2.2, 1.4, 2.4, { ry: heading });
  batch.add('windowDark', x, deckY + 1, z - Math.sin(heading) * 1.6, 2.3, 0.5, 2.5, { ry: heading });
  batch.add('boatHullDark', x, deckY + 1.8, z - Math.sin(heading) * 1.6, 2.6, 0.3, 2.8, { ry: heading });
  batch.add('driftwood', x, deckY + 3.2, z, 0.22, 3, 0.22);
  batch.add('sailCloth', x, deckY + 3.6, z + 0.6, 0.12, 1.8, 1.4);

  // Buoys and a net on the deck.
  batch.add('buoy', x + 2, deckY + 0.6, z + 2, 0.7, 0.7, 0.7);
  batch.add('buoyBlue', x - 2, deckY + 0.6, z + 1, 0.6, 0.6, 0.6);
  batch.add('leafMaple', x, deckY + 0.5, z + 2.6, 2, 0.2, 2, { ry: heading });
}

// Windswept pines and a warning sign on the cliff edge.
export function buildCoastVegetation(batch) {
  const rect = REGIONS.coast.rect;
  const rng = mulberry32(SEED + 5035);

  for (let x = rect.x0; x < rect.x1; x += 3) {
    for (let z = rect.z0; z < rect.z1; z += 3) {
      const h = heightAt(x, z);
      if (h < WORLD.seaLevel + 3 || h > WORLD.seaLevel + 9) continue;
      if (rng() < 0.09) addTree(batch, x + rng(), z + rng(), rng, 'pine');
      if (rng() < 0.05) batch.add('reed', x + 0.5, h + 0.6, z + 0.5, 0.2, 1.2, 0.2);
    }
  }

  // A hazard sign where the cliff path gets close to the edge.
  const sx = 180;
  const sz = 258;
  const h = heightAt(sx, sz);
  batch.add('signPost', sx, h + 1.2, sz, 0.2, 2.4, 0.2);
  batch.add('neonYellow', sx, h + 2.4, sz, 1.6, 1, 0.12);
  batch.add('metalDark', sx, h + 2.4, sz - 0.1, 1.7, 0.12, 0.08);

  return batch;
}

export const COAST_FURNITURE = {
  torii: { x: 120, z: 286 },
  harbour: { x: COAST_VILLAGE.centreX - 6, z: COAST_VILLAGE.z1 + 6 },
  villageCentre: { x: COAST_VILLAGE.centreX, z: COAST_VILLAGE.centreZ }
};