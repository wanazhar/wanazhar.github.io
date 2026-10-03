import { WORLD, SEED, REGIONS } from '../../config.js';
import { BIOMES, heightAt, biomeAt, cellJitter, onBridge, RIVER, riverCenterX } from '../Terrain.js';
import { hash2, mulberry32 } from '../../util/rng.js';

// A building lot produced by the city planner.
export function makeLot(x, z, w, d, kind, seedValue) {
  return { x, z, w, d, kind, seed: seedValue };
}

// ---------------------------------------------------------------------------
// Street grid. Deterministic: the same roads appear on every machine, which
// matters because the city is dense enough that random streets would look
// like noise.
// ---------------------------------------------------------------------------

export function buildRoadNetwork() {
  const rect = REGIONS.city.rect;
  const rng = mulberry32(SEED + 1001);

  // Vertical arterials run north-south, horizontal ones east-west.
  // Block pitch. Sized so that after half-road-width plus a 1-block sidewalk
  // inset, roughly 14x16 of buildable frontage is left inside every block.
  const vSpacing = 20;
  const hSpacing = 22;

  const verticals = [];
  for (let x = rect.x0 + 6; x < rect.x1 - 6; x += vSpacing) {
    verticals.push({ axis: 'v', pos: Math.round(x), width: x % (vSpacing * 2) < vSpacing ? 5 : 4 });
  }

  const horizontals = [];
  for (let z = rect.z0 + 6; z < rect.z1 - 6; z += hSpacing) {
    horizontals.push({ axis: 'h', pos: Math.round(z), width: 4 });
  }

  const roads = [...verticals, ...horizontals];

  // Two avenues get painted centre lines and become the main routes.
  const avenues = [];
  for (const road of roads) {
    if (road.width >= 5 && rng() > 0.55) avenues.push(road);
  }

  return { roads, avenues };
}

// True when a column sits on tarmac.
export function isRoadColumn(x, z, network) {
  for (const road of network.roads) {
    if (road.axis === 'v' && Math.abs(x - road.pos) <= road.width / 2) return true;
    if (road.axis === 'h' && Math.abs(z - road.pos) <= road.width / 2) return true;
  }
  return false;
}

// True when the column is on the raised sidewalk band beside a road.
export function isSidewalkColumn(x, z, network) {
  for (const road of network.roads) {
    const half = road.width / 2;
    if (road.axis === 'v' && Math.abs(x - road.pos) > half && Math.abs(x - road.pos) <= half + 2) return true;
    if (road.axis === 'h' && Math.abs(z - road.pos) > half && Math.abs(z - road.pos) <= half + 2) return true;
  }
  return false;
}

// Distance to the nearest road centre, used to keep buildings off the tarmac.
export function distanceToRoad(x, z, network) {
  let best = Infinity;
  for (const road of network.roads) {
    const d = road.axis === 'v' ? Math.abs(x - road.pos) : Math.abs(z - road.pos);
    best = Math.min(best, d);
  }
  return best;
}

// ---------------------------------------------------------------------------
// The city planner. Walks the blocks between roads and fills each one with
// lots: towers downtown, mid-rise, then shophouse rows on the outer streets.
// ---------------------------------------------------------------------------

const TOWER = 'tower';
const MIDRISE = 'midrise';
const SHOPHOUSE = 'shophouse';
const LOTUS = 'lotus';

export function planCityLots(network) {
  const rect = REGIONS.city.rect;
  const rng = mulberry32(SEED + 2002);
  const lots = [];

  const vRoads = network.roads.filter((r) => r.axis === 'v');
  const hRoads = network.roads.filter((r) => r.axis === 'h');
  const vPositions = vRoads.map((r) => r.pos);
  const hPositions = hRoads.map((r) => r.pos);

  // Road records keyed by their centre, so block insets can use real widths.
  const vRoadAt = (positions, pos) => vRoads[positions.indexOf(pos)];
  const hRoadAt = (positions, pos) => hRoads[positions.indexOf(pos)];

  for (let vi = 0; vi < vPositions.length - 1; vi += 1) {
    for (let hi = 0; hi < hPositions.length - 1; hi += 1) {
      const x0 = vPositions[vi];
      const x1 = vPositions[vi + 1];
      const z0 = hPositions[hi];
      const z1 = hPositions[hi + 1];

      // Downtown is the north-west corner: taller, denser, more towers.
      const distFromCore = Math.hypot(x0 - 56, z0 - 52);
      const towerChance = Math.max(0.05, 0.72 - distFromCore / 90);

      // Usable frontage inside a block, inset from each bounding road by half
      // its width plus the sidewalk band. Uses each road's own width so a wide
      // avenue does not carve a bigger hole than a lane.
      const left = vRoadAt(vPositions, x0);
      const right = vRoadAt(vPositions, x1);
      const top = hRoadAt(hPositions, z0);
      const bottom = hRoadAt(hPositions, z1);

      const insetV = Math.ceil(left.width / 2) + 1;
      const insetV2 = Math.ceil(right.width / 2) + 1;
      const insetH = Math.ceil(top.width / 2) + 1;
      const insetH2 = Math.ceil(bottom.width / 2) + 1;

      const blockX0 = x0 + insetV;
      const blockX1 = x1 - insetV2;
      const blockZ0 = z0 + insetH;
      const blockZ1 = z1 - insetH2;
      const blockW = blockX1 - blockX0;
      const blockD = blockZ1 - blockZ0;
      if (blockW < 8 || blockD < 8) continue;

      // A park or plaza replaces roughly one block in nine.
      if (rng() < 0.11) {
        lots.push(makeLot(blockX0, blockZ0, blockW, blockD, LOTUS, Math.floor(rng() * 1e6)));
        continue;
      }

      if (rng() < towerChance) {
        lots.push(...fillWithTower(blockX0, blockZ0, blockW, blockD, rng));
      } else if (rng() < 0.55) {
        lots.push(...fillWithMidrise(blockX0, blockZ0, blockW, blockD, rng));
      } else {
        lots.push(...fillWithShophouses(blockX0, blockZ0, blockW, blockD, rng));
      }
    }
  }

  // Keep only lots that actually sit on dry, flat-ish ground.
  return lots.filter((lot) => lotFitsTerrain(lot));
}

function lotFitsTerrain(lot) {
  let ok = true;
  const step = 3;
  for (let x = lot.x; x < lot.x + lot.w && ok; x += step) {
    for (let z = lot.z; z < lot.z + lot.d && ok; z += step) {
      if (heightAt(x, z) <= WORLD.seaLevel) ok = false;
    }
  }
  return ok;
}

function fillWithTower(x0, z0, w, d, rng) {
  const lots = [];
  const bw = 12;
  const bd = 12;
  for (let x = x0; x + bw <= x0 + w; x += bw + 3) {
    for (let z = z0; z + bd <= z0 + d; z += bd + 3) {
      lots.push(makeLot(x, z, bw, bd, TOWER, Math.floor(rng() * 1e6)));
    }
  }
  return lots;
}

function fillWithMidrise(x0, z0, w, d, rng) {
  const lots = [];
  const bw = 10;
  const bd = 14;
  for (let x = x0; x + bw <= x0 + w; x += bw + 2) {
    for (let z = z0; z + bd <= z0 + d; z += bd + 2) {
      lots.push(makeLot(x, z, bw, bd, MIDRISE, Math.floor(rng() * 1e6)));
    }
  }
  return lots;
}

// Shophouses are narrow and share party walls, so they fill a row edge to edge.
function fillWithShophouses(x0, z0, w, d, rng) {
  const lots = [];
  const bw = 6;
  const bd = 10;
  const vertical = w >= d;
  const span = vertical ? d : w;

  for (let i = 0; i + bw <= span; i += bw) {
    for (let off = 0; off + bd <= (vertical ? w : d) - 3; off += bd + 2) {
      const x = vertical ? x0 + off : x0 + i;
      const z = vertical ? z0 + i : z0 + off;
      lots.push(makeLot(x, z, bw, bd, SHOPHOUSE, Math.floor(rng() * 1e6)));
    }
  }
  return lots;
}

// ---------------------------------------------------------------------------
// Emitting boxes for a single lot.
// ---------------------------------------------------------------------------

const TOWER_WALLS = ['buildingWall', 'buildingWallAlt', 'buildingWallGrey', 'buildingWallBlue'];
const TOWER_ROOFS = ['buildingRoof', 'buildingRoofBlue'];
const SHOP_WALLS = ['buildingWall', 'buildingWallPink', 'awningBlue', 'buildingWallGrey'];
const AWNINGS = ['awningRed', 'awningBlue', 'awningGreen', 'awningYellow'];
const NEONS = ['neonPink', 'neonBlue', 'neonGreen', 'neonYellow', 'neonOrange', 'neonRed'];

// Returns the vertical stacking description for a lot, so the collision
// footprint and the visuals can never disagree.
export function describeLot(lot) {
  const rng = mulberry32(lot.seed);
  const spec = { height: 6, setbacks: [], roof: 'buildingRoof', wall: 'buildingWall', windows: true };

  if (lot.kind === TOWER) {
    spec.height = 16 + Math.floor(rng() * 26);
    spec.wall = TOWER_WALLS[Math.floor(rng() * TOWER_WALLS.length)];
    spec.roof = TOWER_ROOFS[Math.floor(rng() * TOWER_ROOFS.length)];
    // A setback part-way up gives the skyline some shape.
    if (rng() < 0.6) {
      const setbackAt = 8 + Math.floor(rng() * (spec.height - 12));
      spec.setbacks.push({ at: setbackAt, inset: 2 });
    }
  } else if (lot.kind === MIDRISE) {
    spec.height = 8 + Math.floor(rng() * 8);
    spec.wall = TOWER_WALLS[Math.floor(rng() * TOWER_WALLS.length)];
    spec.roof = TOWER_ROOFS[Math.floor(rng() * TOWER_ROOFS.length)];
    if (rng() < 0.4) spec.setbacks.push({ at: 5 + Math.floor(rng() * 4), inset: 1 });
  } else if (lot.kind === SHOPHOUSE) {
    spec.height = 5 + Math.floor(rng() * 3);
    spec.wall = SHOP_WALLS[Math.floor(rng() * SHOP_WALLS.length)];
    spec.roof = 'buildingRoof';
  } else {
    spec.height = 0;
  }

  return spec;
}

// Shrink a lot horizontally by each active setback at a given height.
function footprintAt(lot, spec, y) {
  let inset = 0;
  for (const s of spec.setbacks) {
    if (y >= s.at) inset = Math.max(inset, s.inset);
  }
  return {
    x: lot.x + inset,
    z: lot.z + inset,
    w: lot.w - inset * 2,
    d: lot.d - inset * 2
  };
}

function addWindows(batch, fp, y, spec, rng) {
  if (!spec.windows) return;
  const step = 3;
  for (let fy = y - spec.baseY; fy < 3; fy += 1) {
    const wy = y + fy;
    // North and south faces.
    for (let x = fp.x + 1.5; x < fp.x + fp.w - 0.5; x += step) {
      const lit = rng() < 0.22;
      batch.add(lit ? 'windowLit' : 'window', x, wy, fp.z - 0.02, 0.9, 0.9, 0.08);
      batch.add(lit ? 'windowLit' : 'window', x, wy, fp.z + fp.d + 0.02, 0.9, 0.9, 0.08);
    }
    for (let z = fp.z + 1.5; z < fp.z + fp.d - 0.5; z += step) {
      const lit = rng() < 0.22;
      batch.add(lit ? 'windowLit' : 'window', fp.x - 0.02, wy, z, 0.08, 0.9, 0.9);
      batch.add(lit ? 'windowLit' : 'window', fp.x + fp.w + 0.02, wy, z, 0.08, 0.9, 0.9);
    }
  }
}

// Builds the solid boxes for a lot. Pure: returns a VoxelBatch so it can be
// tested without a scene.
export function buildLot(batch, lot) {
  const spec = describeLot(lot);
  if (spec.height <= 0) return batch;

  const base = heightAt(lot.x + lot.w / 2, lot.z + lot.d / 2);
  spec.baseY = base;

  const rng = mulberry32(lot.seed + 7);

  for (let i = 0; i < spec.height; i += 1) {
    const y = base + i;
    const fp = footprintAt(lot, spec, i);

    // A shell of four wall slabs plus a cap, so the interior stays hollow and
    // the instance count stays sane on tall towers. The walls are the shape
    // that carries the silhouette, so they are rounded; the floor slabs are not
    // seen edge-on and stay cheap.
    batch.add(spec.wall, fp.x + fp.w / 2, y + 0.5, fp.z, fp.w, 1, 1, { shape: 'rounded' });
    batch.add(spec.wall, fp.x + fp.w / 2, y + 0.5, fp.z + fp.d - 1, fp.w, 1, 1, { shape: 'rounded' });
    batch.add(spec.wall, fp.x, y + 0.5, fp.z + fp.d / 2, 1, 1, fp.d, { shape: 'rounded' });
    batch.add(spec.wall, fp.x + fp.w - 1, y + 0.5, fp.z + fp.d / 2, 1, 1, fp.d, { shape: 'rounded' });

    // Floor slab every few storeys so it reads as a building from outside.
    if (i % 4 === 0) batch.add('concrete', fp.x + fp.w / 2, y + 0.05, fp.z + fp.d / 2, fp.w, 0.12, fp.d, { shape: 'block' });

    addWindows(batch, fp, y, spec, rng);
  }

  const topFp = footprintAt(lot, spec, spec.height);
  const topY = base + spec.height;

  // Wall panels use a rounded shape so their corners catch the rim light: a hard
  // 90-degree edge is the single most Minecraft-looking thing in a scene.
  // Roof slabs stay block-shaped; nobody sees their edges and they are the bulk
  // of the instance count.
  const WALL_SHAPE = 'rounded';
  const SLAB_SHAPE = 'block';

  // Roof cap.
  batch.add(spec.roof, topFp.x + topFp.w / 2, topY + 0.25, topFp.z + topFp.d / 2, topFp.w, 0.5, topFp.d, { shape: SLAB_SHAPE });

  // Roof clutter: tanks, vents, a water tower on the tall ones.
  if (lot.kind === TOWER || lot.kind === MIDRISE) {
    const n = 1 + Math.floor(rng() * 3);
    for (let i = 0; i < n; i += 1) {
      const rx = topFp.x + 1 + rng() * (topFp.w - 2);
      const rz = topFp.z + 1 + rng() * (topFp.d - 2);
      batch.add('metal', rx, topY + 0.9, rz, 1.1, 0.9, 1.1, { shape: 'soft' });
    }
    if (lot.kind === TOWER && spec.height > 30 && rng() < 0.5) {
      batch.add('metalDark', topFp.x + topFp.w / 2, topY + 1.8, topFp.z + topFp.d / 2, 1.6, 1.6, 1.6, { shape: 'soft' });
      batch.add('metal', topFp.x + topFp.w / 2, topY + 3.1, topFp.z + topFp.d / 2, 1.2, 1.2, 1.2, { shape: 'soft' });
    }
  }

  // Ground-floor shopfront treatment for shophouses: awning, signboard, neon.
  if (lot.kind === SHOPHOUSE) {
    const awning = AWNINGS[lot.seed % AWNINGS.length];
    const neon = NEONS[lot.seed % NEONS.length];
    const front = lot.z + lot.d;
    batch.add(awning, lot.x + lot.w / 2, base + 2.4, front + 0.7, lot.w - 1, 0.24, 1.6);
    batch.add('signWhite', lot.x + lot.w / 2, base + 3.1, front + 0.1, lot.w - 2, 0.7, 0.16);
    batch.add(neon, lot.x + lot.w / 2, base + 3.1, front + 0.22, lot.w - 3.2, 0.34, 0.1);
  }

  return batch;
}

// Park / plaza block: trees, hedges, benches, a fountain or a monument.
export function buildLotusBlock(batch, lot) {
  const rng = mulberry32(lot.seed + 3);
  const cx = lot.x + lot.w / 2;
  const cz = lot.z + lot.d / 2;

  batch.add('concrete', cx, heightAt(Math.floor(cx), Math.floor(cz)) + 0.06, cz, lot.w - 1, 0.12, lot.d - 1);

  const treeCount = Math.floor((lot.w * lot.d) / 44);
  for (let i = 0; i < treeCount; i += 1) {
    const tx = lot.x + 2 + rng() * (lot.w - 4);
    const tz = lot.z + 2 + rng() * (lot.d - 4);
    addTree(batch, tx, tz, rng);
  }

  for (let i = 0; i < 3; i += 1) {
    const bx = lot.x + 3 + rng() * (lot.w - 6);
    const bz = lot.z + 3 + rng() * (lot.d - 6);
    batch.add('woodPlank', bx, heightAt(Math.floor(bx), Math.floor(bz)) + 0.5, bz, 1.8, 0.2, 0.7);
    batch.add('woodPost', bx - 0.7, heightAt(Math.floor(bx), Math.floor(bz)) + 0.25, bz, 0.16, 0.5, 0.6);
    batch.add('woodPost', bx + 0.7, heightAt(Math.floor(bx), Math.floor(bz)) + 0.25, bz, 0.16, 0.5, 0.6);
  }

  // A central fountain or statue, depending on the block's seed.
  if (rng() < 0.5) {
    const fy = heightAt(Math.floor(cx), Math.floor(cz));
    batch.add('stone', cx, fy + 0.4, cz, 3.4, 0.8, 3.4);
    batch.add('waterShallow', cx, fy + 0.85, cz, 2.8, 0.2, 2.8);
    batch.add('stone', cx, fy + 1.7, cz, 0.7, 1.8, 0.7);
    batch.add('foam', cx, fy + 2.7, cz, 1.2, 0.4, 1.2);
  } else {
    const fy = heightAt(Math.floor(cx), Math.floor(cz));
    batch.add('stoneDark', cx, fy + 0.3, cz, 2.2, 0.6, 2.2);
    batch.add('stone', cx, fy + 1.8, cz, 0.9, 3, 0.9);
    batch.add('metal', cx, fy + 3.6, cz, 1.2, 0.6, 0.2);
  }

  return batch;
}

// Shared tree builder, reused by parks, suburbs, orchards and the highlands.
export function addTree(batch, x, z, rng, kind = 'normal') {
  const ground = heightAt(Math.floor(x), Math.floor(z));
  if (ground <= WORLD.seaLevel) return batch;

  let trunkH = 3;
  let leafMat = 'leafGreen';
  let leafH = 2.6;
  let leafR = 2.2;

  if (kind === 'sakura') {
    trunkH = 2.4;
    leafMat = rng() < 0.5 ? 'flowerSakura' : 'flowerSakuraDeep';
    leafH = 1.9;
    leafR = 2.6;
  } else if (kind === 'maple') {
    trunkH = 3.2;
    leafMat = 'leafMaple';
    leafH = 2.4;
    leafR = 2.3;
  } else if (kind === 'pine') {
    trunkH = 5;
    leafMat = 'leafGreen';
    leafH = 2.2;
    leafR = 1.8;
  } else if (kind === 'orchard') {
    trunkH = 1.8;
    leafMat = 'orchardTree';
    leafH = 1.5;
    leafR = 1.6;
  } else if (kind === 'bamboo') {
    trunkH = 7;
    leafMat = 'bamboo';
    leafH = 1;
    leafR = 0.5;
  }

  batch.add('trunk', x, ground + trunkH / 2, z, 0.6, trunkH, 0.6);

  if (kind === 'bamboo') {
    // Bamboo is a cluster of thin culms rather than one trunk and a canopy.
    const clump = 2 + Math.floor(rng() * 3);
    for (let i = 0; i < clump; i += 1) {
      const ox = x + (rng() - 0.5) * 1.1;
      const oz = z + (rng() - 0.5) * 1.1;
      const h = trunkH * (0.7 + rng() * 0.5);
      batch.add(rng() < 0.4 ? 'bambooDark' : 'bamboo', ox, heightAt(Math.floor(ox), Math.floor(oz)) + h / 2, oz, 0.28, h, 0.28);
    }
    return batch;
  }

  batch.add(leafMat, x, ground + trunkH + leafH / 2 - 0.3, z, leafR, leafH, leafR);
  if (kind === 'sakura' || kind === 'maple') {
    batch.add(leafMat, x + (rng() - 0.5), ground + trunkH + leafH / 2 + 0.5, z + (rng() - 0.5), leafR * 0.7, leafH * 0.7, leafR * 0.7);
  }

  return batch;
}