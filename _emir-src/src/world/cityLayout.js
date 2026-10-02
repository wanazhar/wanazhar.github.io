import { mulberry32, fbm, hash2, clamp, smoothstep, pick } from './noise.js';

export const BLOCK_PITCH = 62;
export const ROAD_WIDTH = 11;
// Kerb-to-kerb footway either side of a street, so a block's buildable interior is
// BLOCK_PITCH - ROAD_WIDTH - SIDEWALK_WIDTH (once, not twice).
export const SIDEWALK_WIDTH = 9;
export const CITY_HALF = 7 * BLOCK_PITCH;
export const KERB_HEIGHT = 0.34;

const DISTRICTS = [
  { id: 'core', radius: 0.26, minHeight: 22, maxHeight: 44 },
  { id: 'midtown', radius: 0.55, minHeight: 13, maxHeight: 26 },
  { id: 'residential', radius: 1.2, minHeight: 7, maxHeight: 15 }
];

const TOWER_COLORS = ['#9fb0c6', '#8b9db4', '#a9b8cb', '#7f8fa4'];
const FACADE_COLORS = ['#cdc6b8', '#c0b7aa', '#b9c1ca', '#c4b6a6'];
const RESIDENTIAL_COLORS = ['#cfc5b4', '#c4b6a6', '#bcb09f'];
const SHOP_COLORS = ['#d5c2a4', '#c7b295', '#dccdb0', '#bfae90'];
const ROOF_COLORS = ['#8d8579', '#7d766b', '#9a9285', '#6f6961'];
const HERITAGE_COLORS = ['#b4643c', '#a85a36', '#c07047'];

export const LANDMARKS = [
  { id: 'petronas', name: 'Petronas Twin Towers', x: -40, z: -44, kind: 'twinTowers', radius: 44 },
  { id: 'merdeka', name: 'Merdeka 118', x: 120, z: 4, kind: 'twistingTower', radius: 32 },
  { id: 'kltower', name: 'KL Tower', x: -180, z: 120, kind: 'needleTower', radius: 30 },
  { id: 'sultan', name: 'Sultan Abdul Samad', x: 34, z: 130, kind: 'heritageBlock', radius: 34 },
  { id: 'masjid', name: 'National Mosque', x: -130, z: 40, kind: 'domeMosque', radius: 30 },
  { id: 'exchange', name: 'Exchange 106', x: -44, z: -206, kind: 'truncatedTower', radius: 30 }
];

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

/**
 * A cell is road when it belongs to a road *corridor*: the band within ROAD_WIDTH/2 of any street
 * centre line, on either axis. Testing each axis independently would only produce disconnected
 * patches, so a cell like (40, 0) is road and (40, 5) is not.
 */
export function isRoadCoord(x, z) {
  // Streets are drawn as an ROAD_WIDTH strip starting at each multiple of BLOCK_PITCH, so the
  // test has to use the same origin or the collision layout drifts half a road off the asphalt.
  const localX = mod(x, BLOCK_PITCH);
  const localZ = mod(z, BLOCK_PITCH);
  return localX < ROAD_WIDTH || localZ < ROAD_WIDTH;
}

function districtFor(x, z) {
  const radius = Math.hypot(x, z) / CITY_HALF;
  const index = DISTRICTS.findIndex((d) => radius <= d.radius);
  return DISTRICTS[index < 0 ? DISTRICTS.length - 1 : index];
}



function isReservedBlock(bx, bz) {
  const cx = bx * BLOCK_PITCH + BLOCK_PITCH / 2;
  const cz = bz * BLOCK_PITCH + BLOCK_PITCH / 2;
  return LANDMARKS.some((landmark) => Math.hypot(cx - landmark.x, cz - landmark.z) < landmark.radius);
}

function paletteFor(districtId, random) {
  if (districtId === 'core') return pick(TOWER_COLORS, random);
  if (districtId === 'midtown') return pick(FACADE_COLORS, random);
  return pick(RESIDENTIAL_COLORS, random);
}

function buildTowerBlock(bx, bz, random, push) {
  const inner = BLOCK_PITCH - ROAD_WIDTH - SIDEWALK_WIDTH * 2;
  // inner = 62 - 11 - 18 = 33 units of buildable footprint per block
  const x0 = bx * BLOCK_PITCH + ROAD_WIDTH + SIDEWALK_WIDTH;
  const z0 = bz * BLOCK_PITCH + ROAD_WIDTH + SIDEWALK_WIDTH;
  if (random() < 0.4) {
    const gap = 8;
    const halfD = 17;
    const halfW = (inner - gap) / 2;
    const heights = [46 + random() * 26, 38 + random() * 22];
    for (let i = 0; i < 2; i += 1) {
      const x = i === 0 ? x0 : x0 + halfW + gap;
      push({
        x, z: z0 + (inner - halfD) / 2, w: halfW, d: halfD, h: heights[i],
        color: TOWER_COLORS[i % TOWER_COLORS.length],
        roof: ROOF_COLORS[0], district: 'core', floors: Math.round(heights[i] / 3.4), windows: true,
        setback: { at: heights[i] * 0.62, shrink: 3.2 }, mast: heights[i] > 56
      });
    }
    return;
  }
  const size = inner * (0.62 + random() * 0.2);
  const h = 40 + random() * 36;
  push({
    x: x0 + (inner - size) / 2, z: z0 + (inner - size) / 2, w: size, d: size, h,
    color: pick(TOWER_COLORS, random), roof: pick(ROOF_COLORS, random), district: 'core',
    floors: Math.round(h / 3.4), windows: true, setback: { at: h * 0.6, shrink: 3.4 }, mast: random() < 0.5
  });
}

function buildMidriseBlock(bx, bz, random, push, district) {
  const inner = BLOCK_PITCH - ROAD_WIDTH - SIDEWALK_WIDTH * 2;
  // inner = 62 - 11 - 18 = 33 units of buildable footprint per block
  const x0 = bx * BLOCK_PITCH + ROAD_WIDTH + SIDEWALK_WIDTH;
  const z0 = bz * BLOCK_PITCH + ROAD_WIDTH + SIDEWALK_WIDTH;
  const splitX = random() < 0.5;
  const lot = (ox, oz, w, d) => {
    const h = district.minHeight + random() * (district.maxHeight - district.minHeight);
    push({
      x: x0 + ox, z: z0 + oz, w, d, h,
      color: paletteFor(district.id, random), roof: pick(ROOF_COLORS, random),
      district: district.id, floors: Math.round(h / 3.4), windows: true,
      shop: random() < 0.4 ? pick(SHOP_COLORS, random) : null
    });
  };
  const gap = 6;
  if (splitX) {
    const half = (inner - gap) / 2;
    lot(0, 0, half, inner);
    lot(half + gap, 0, half, inner);
  } else {
    const half = (inner - gap) / 2;
    lot(0, 0, inner, half);
    lot(0, half + gap, inner, half);
  }
}

function buildShophouseBlock(bx, bz, random, push) {
  const inner = BLOCK_PITCH - ROAD_WIDTH - SIDEWALK_WIDTH * 2;
  // inner = 62 - 11 - 18 = 33 units of buildable footprint per block
  const x0 = bx * BLOCK_PITCH + ROAD_WIDTH + SIDEWALK_WIDTH;
  const z0 = bz * BLOCK_PITCH + ROAD_WIDTH + SIDEWALK_WIDTH;
  const unit = inner / 4;
  for (let i = 0; i < 4; i += 1) {
    const h = (2 + (i % 2)) * 3.5;
    push({
      x: x0 + i * unit, z: z0, w: unit - 0.5, d: 14, h,
      color: pick(SHOP_COLORS, random), roof: pick(ROOF_COLORS, random),
      district: 'heritage', floors: Math.round(h / 3.5), windows: true, awning: true,
      shop: pick(SHOP_COLORS, random)
    });
  }
  for (let i = 0; i < 3; i += 1) {
    const h = (2 + (i % 2)) * 3.5;
    push({
      x: x0 + i * unit, z: z0 + inner - 12, w: unit - 0.5, d: 12, h,
      color: pick(SHOP_COLORS, random), roof: pick(ROOF_COLORS, random),
      district: 'heritage', floors: Math.round(h / 3.5), windows: true, awning: true,
      shop: pick(SHOP_COLORS, random)
    });
  }
}

function buildResidentialBlock(bx, bz, random, push, district, addProp) {
  const inner = BLOCK_PITCH - ROAD_WIDTH - SIDEWALK_WIDTH * 2;
  // inner = 62 - 11 - 18 = 33 units of buildable footprint per block
  const x0 = bx * BLOCK_PITCH + ROAD_WIDTH + SIDEWALK_WIDTH;
  const z0 = bz * BLOCK_PITCH + ROAD_WIDTH + SIDEWALK_WIDTH;
  if (random() < 0.45) {
    const lots = 4;
    const lotSize = inner / lots;
    for (let i = 0; i < lots; i += 1) {
      for (let j = 0; j < lots; j += 1) {
        if (random() < 0.22) {
          addProp({ kind: 'tree', x: x0 + i * lotSize + lotSize / 2, z: z0 + j * lotSize + lotSize / 2, scale: 0.8 + random() * 0.5 });
          continue;
        }
        const w = lotSize - 5 - random() * 2;
        const d = lotSize - 5 - random() * 2;
        const h = district.minHeight + random() * (district.maxHeight - district.minHeight);
        push({
          x: x0 + i * lotSize + 2.5, z: z0 + j * lotSize + 2.5, w, d, h,
          color: pick(RESIDENTIAL_COLORS, random), roof: pick(ROOF_COLORS, random),
          district: 'residential', floors: Math.round(h / 3.4), windows: true,
          shop: random() < 0.28 ? pick(SHOP_COLORS, random) : null
        });
      }
    }
  } else {
    const w = inner * (0.55 + random() * 0.2);
    const d = inner * (0.5 + random() * 0.2);
    const h = district.minHeight + random() * 4;
    push({
      x: x0 + (inner - w) / 2, z: z0 + (inner - d) / 2, w, d, h,
      color: pick(RESIDENTIAL_COLORS, random), roof: pick(ROOF_COLORS, random),
      district: 'residential', floors: Math.round(h / 3.4)
    });
    addProp({ kind: 'tree', x: x0 + 3, z: z0 + inner - 4, scale: 1 });
  }
}

function buildParkBlock(bx, bz, random, addProp) {
  const inner = BLOCK_PITCH - ROAD_WIDTH - SIDEWALK_WIDTH * 2;
  // inner = 62 - 11 - 18 = 33 units of buildable footprint per block
  const x0 = bx * BLOCK_PITCH + ROAD_WIDTH + SIDEWALK_WIDTH;
  const z0 = bz * BLOCK_PITCH + ROAD_WIDTH + SIDEWALK_WIDTH;
  addProp({ kind: 'parkPath', x: x0 + inner / 2, z: z0 + inner / 2, w: inner, d: 4 });
  addProp({ kind: 'parkPath', x: x0 + inner / 2, z: z0 + inner / 2, w: 4, d: inner });
  const trees = 6 + Math.floor(random() * 5);
  for (let i = 0; i < trees; i += 1) {
    addProp({
      kind: 'tree',
      x: x0 + 4 + random() * (inner - 8),
      z: z0 + 4 + random() * (inner - 8),
      scale: 0.85 + random() * 0.6
    });
  }
  if (random() < 0.45) {
    addProp({ kind: 'fountain', x: x0 + inner / 2, z: z0 + inner / 2 });
  } else {
    // A pond instead, with a stone rim, set off to one side of the crossing paths.
    const pondSize = inner * (0.34 + random() * 0.16);
    const px = x0 + (random() < 0.5 ? inner * 0.26 : inner * 0.7);
    const pz = z0 + (random() < 0.5 ? inner * 0.26 : inner * 0.7);
    addProp({ kind: 'pond', x: px, z: pz, w: pondSize, d: pondSize * (0.7 + random() * 0.5) });
    for (let i = 0; i < 3; i += 1) {
      addProp({
        kind: 'tree',
        x: px + (random() - 0.5) * pondSize * 1.7,
        z: pz + (random() - 0.5) * pondSize * 1.7,
        scale: 0.9 + random() * 0.5
      });
    }
  }
}

export function createCityLayout(options = {}) {
  const random = mulberry32(options.seed ?? 20260930);

  // The countryside must keep gently rolling ground everywhere. Returning a hard 0 (which
  // smoothstep does once the fade fully completes) left ~75% of the terrain collider perfectly
  // flat, and a body resting on a perfectly flat trimesh gets degenerate contact normals, which
  // Rapier turns into NaN. The small constant bias also keeps every sample strictly positive.
  const groundHeight = (x, z) => {
    const distance = Math.hypot(x, z);
    const inland = smoothstep(CITY_HALF + 260, CITY_HALF - 60, distance);
    const hills = (fbm(x / 300, z / 300, 71, 3) - 0.5) * 14 * inland;
    const plateau = inland * 4;
    const rolling = (fbm(x / 520, z / 520, 211, 3) - 0.5) * 16 * (1 - inland * 0.6);
    return 6 + plateau + hills + rolling;
  };

  const buildings = [];
  const props = [];
  const colliders = [];
  const coins = [];
  const ramps = [];
  const streetFurniture = [];

  const pushBuilding = (building) => {
    // Defensive clamp: a zero or negative footprint produces a degenerate cuboid, and a single
    // invalid collider can make the whole Rapier island report non-finite state.
    const w = Math.max(1, building.w);
    const d = Math.max(1, building.d);
    const h = Math.max(2, building.h);
    const ground = groundHeight(building.x + w / 2, building.z + d / 2);
    const record = { ...building, w, d, h, ground };
    buildings.push(record);
    colliders.push({
      x: building.x + w / 2,
      y: ground + h / 2,
      z: building.z + d / 2,
      hx: w / 2,
      hy: h / 2,
      hz: d / 2,
      kind: 'building'
    });
    return record;
  };

  const addProp = (prop) => {
    const y = groundHeight(prop.x, prop.z);
    props.push({ ...prop, y });
    if (prop.kind === 'tree' || prop.kind === 'lamp' || prop.kind === 'fountain') {
      colliders.push({
        x: prop.x,
        y: y + (prop.kind === 'tree' ? 2 : 1.5),
        z: prop.z,
        hx: prop.kind === 'fountain' ? 3 : 0.5,
        hy: prop.kind === 'fountain' ? 0.6 : 2,
        hz: prop.kind === 'fountain' ? 3 : 0.5,
        kind: prop.kind
      });
    }
  };

  for (let bx = -7; bx <= 7; bx += 1) {
    for (let bz = -7; bz <= 7; bz += 1) {
      if (isReservedBlock(bx, bz)) continue;
      const cx = bx * BLOCK_PITCH + BLOCK_PITCH / 2;
      const cz = bz * BLOCK_PITCH + BLOCK_PITCH / 2;
      if (Math.hypot(cx, cz) > CITY_HALF) continue;
      const district = districtFor(cx, cz);
      const roll = random();
      if (district.id === 'core') buildTowerBlock(bx, bz, random, pushBuilding);
      else if (district.id === 'midtown') buildMidriseBlock(bx, bz, random, pushBuilding, district);
      else if (roll < 0.16) buildParkBlock(bx, bz, random, addProp);
      else if (roll < 0.34) buildShophouseBlock(bx, bz, random, pushBuilding);
      else buildResidentialBlock(bx, bz, random, pushBuilding, district, addProp);
    }
  }

  // Lamps sit on the footway either side of the carriageway, which spans
  // [line * BLOCK_PITCH, line * BLOCK_PITCH + ROAD_WIDTH].
  for (let line = -7; line <= 7; line += 1) {
    const position = line * BLOCK_PITCH;
    for (let step = -CITY_HALF; step <= CITY_HALF; step += 22) {
      const spots = [
        [position - 1.5, step],
        [position + ROAD_WIDTH + 1.5, step + 11],
        [step, position - 1.5],
        [step + 11, position + ROAD_WIDTH + 1.5]
      ];
      for (const [x, z] of spots) {
        // Never plant a lamp in the carriageway or in the middle of a junction.
        if (isRoadCoord(x, z)) continue;
        streetFurniture.push({ kind: 'lamp', x, z, y: groundHeight(x, z) });
      }
    }
  }

  // Street furniture along the footways: benches, bins, bollards, planters and signs.
  const FURNITURE = ['bench', 'bench', 'bin', 'bin', 'bollard', 'bollard', 'bollard', 'planter', 'sign', 'shelter'];
  for (let line = -7; line <= 7; line += 1) {
    const at = line * BLOCK_PITCH;
    for (let step = -CITY_HALF; step <= CITY_HALF; step += 26) {
      const spots = [
        [at - 2.4, step],
        [at + ROAD_WIDTH + 2.4, step + 13],
        [step + 13, at - 2.4],
        [step, at + ROAD_WIDTH + 2.4]
      ];
      for (const [x, z] of spots) {
        if (isRoadCoord(x, z)) continue;
        if (random() > 0.55) continue;
        streetFurniture.push({
          kind: FURNITURE[Math.floor(random() * FURNITURE.length)],
          x,
          z,
          y: groundHeight(x, z),
          facing: Math.floor(random() * 4)
        });
      }
    }
  }

  // Signal heads on opposite corners of each junction.
  const signals = [];
  for (let a = -5; a <= 5; a += 1) {
    for (let b = -5; b <= 5; b += 1) {
      const cx = a * BLOCK_PITCH + ROAD_WIDTH / 2;
      const cz = b * BLOCK_PITCH + ROAD_WIDTH / 2;
      if (Math.hypot(cx, cz) > CITY_HALF) continue;
      const arm = ROAD_WIDTH / 2 + 1.4;
      for (const corner of [[1, 1], [-1, -1]]) {
        const x = cx + corner[0] * arm;
        const z = cz + corner[1] * arm;
        signals.push({ x, z, y: groundHeight(x, z), facing: corner[0] * corner[1] > 0 ? 0 : 1 });
      }
    }
  }

  for (let i = 0; i < 90; i += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 30 + random() * (CITY_HALF - 40);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    if (isRoadCoord(x, z)) continue;
    coins.push({ x, y: groundHeight(x, z) + 1.3, z, collected: false });
  }

  for (let i = 0; i < 7; i += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 120 + random() * 300;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    if (isRoadCoord(x, z)) continue;
    ramps.push({ x, y: groundHeight(x, z), z, angle: random() * Math.PI * 2, width: 7, length: 16, height: 2.4 });
  }

  const layout = {
    seed: options.seed ?? 20260930,
    random,
    groundHeight,
    isRoadCoord,
    blockPitch: BLOCK_PITCH,
    roadWidth: ROAD_WIDTH,
    sidewalkWidth: SIDEWALK_WIDTH,
    cityHalf: CITY_HALF,
    kerbHeight: KERB_HEIGHT,
    buildings,
    props,
    streetFurniture,
    signals,
    colliders,
    coins,
    ramps,
    landmarks: LANDMARKS.map((landmark) => ({ ...landmark, ground: groundHeight(landmark.x, landmark.z) })),
    palettes: { tower: TOWER_COLORS, facade: FACADE_COLORS, residential: RESIDENTIAL_COLORS, shop: SHOP_COLORS, roof: ROOF_COLORS, heritage: HERITAGE_COLORS }
  };

  return layout;
}
