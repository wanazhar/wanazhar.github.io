import {
  BLOCK_SIZE,
  BLOCK_INSET,
  LOT_SIZE,
  blockCenter,
  blockRect,
  districtFor,
  rectsIntersect,
  CITY_BLOCK_MIN,
  CITY_BLOCK_MAX
} from './streetGrid.js';
import {
  addGenericBuilding,
  addSetbackTower,
  addShophouseRow,
  addKampungHouse,
  addParkBlock,
  addLeafyTree
} from './buildings.js';

const BODY_BY_DISTRICT = {
  downtown: ['glass', 'blackGlass', 'merdekaGlass', 'silver', 'glassGreen'],
  midtown: ['concrete', 'glassGreen', 'silver', 'stone', 'concreteDark'],
  urban: ['concrete', 'stone', 'redBrick', 'concreteDark', 'museumBrown'],
  suburb: ['station', 'stone', 'concrete', 'clay', 'concreteDark']
};

const GLASS_BY_BODY = {
  blackGlass: 'glass',
  silver: 'glassDark',
  glass: 'glassDark',
  glassGreen: 'glassDark',
  merdekaGlass: 'blackGlass',
  concrete: 'glassDark',
  concreteDark: 'glassDark',
  stone: 'glassDark',
  redBrick: 'glassDark',
  museumBrown: 'glassDark',
  station: 'glassDark',
  clay: 'glassDark',
  mallGold: 'glassDark',
  pavilionRed: 'glassDark',
  templeRed: 'blackGlass',
  marketBlue: 'glassDark',
  littleIndiaPink: 'glassDark',
  palaceWall: 'glassDark'
};

function glassFor(bodyKey) {
  return GLASS_BY_BODY[bodyKey] ?? 'glassDark';
}

const SHOPHOUSE_COLORS = ['marketRed', 'templeRed', 'marketBlue', 'littleIndiaPink', 'palaceWall', 'awningStripe', 'station'];

function hashBlock(bx, bz, salt = 0) {
  let value = (bx * 374761393 + bz * 668265263 + salt * 2246822519) >>> 0;
  value = (value ^ (value >>> 13)) >>> 0;
  value = Math.imul(value, 1274126177) >>> 0;
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
}

function subdivide(x0, z0, size, cols, rows, gap) {
  const lots = [];
  const lotW = (size - gap * (cols - 1)) / cols;
  const lotD = (size - gap * (rows - 1)) / rows;
  for (let cx = 0; cx < cols; cx += 1) {
    for (let cz = 0; cz < rows; cz += 1) {
      lots.push({
        x: x0 + cx * (lotW + gap),
        z: z0 + cz * (lotD + gap),
        w: lotW,
        d: lotD
      });
    }
  }
  return lots;
}

function addParkedCars(inst, terrain, x0, z0, count, axis, random) {
  const carColors = ['trainBlue', 'trainYellow', 'silver', 'marketRed', 'station'];
  for (let i = 0; i < count; i += 1) {
    const offset = 2 + i * 3;
    const x = axis === 'x' ? x0 + offset : x0;
    const z = axis === 'x' ? z0 : z0 + offset;
    const ground = terrain.surfaceYAt(x, z);
    const key = carColors[Math.floor(random() * carColors.length)];
    inst.addBox(x, ground + 0.65, z, axis === 'x' ? 2.4 : 1.2, 0.9, axis === 'x' ? 1.2 : 2.4, key);
    inst.addBox(x, ground + 1.25, z, axis === 'x' ? 1.4 : 1.0, 0.5, axis === 'x' ? 1.0 : 1.4, 'glassDark');
  }
}

const ACCENT_MATERIALS = ['mallGold', 'pavilionRed', 'glassGreen', 'templeRed', 'marketBlue', 'littleIndiaPink', 'palaceWall'];

function pickBodyKey(bodyKeys, random, accentChance) {
  if (random() < accentChance) {
    return ACCENT_MATERIALS[Math.floor(random() * ACCENT_MATERIALS.length)];
  }
  return bodyKeys[Math.floor(random() * bodyKeys.length)];
}

function fillTowerBlock(inst, terrain, collision, rect, district, random) {
  const inset = rect.x0 + BLOCK_INSET;
  const insetZ = rect.z0 + BLOCK_INSET;
  const tall = district === 'downtown';
  const bodyKeys = BODY_BY_DISTRICT[district];
  const split = tall && random() > 0.55 ? 2 : 1;

  if (split === 2) {
    const lots = subdivide(inset, insetZ, LOT_SIZE, 1, 2, 2);
    lots.forEach((lot, index) => {
      const body = pickBodyKey(bodyKeys, random, index === 0 ? 0.15 : 0);
      const height = tall ? 34 + random() * 52 : 22 + random() * 20;
      addSetbackTower(inst, terrain, collision, lot.x, lot.z, lot.w, lot.d, height, body, glassFor(body), random);
    });
    return;
  }

  const size = tall ? 12 : 11;
  const x = inset + (LOT_SIZE - size) / 2;
  const z = insetZ + (LOT_SIZE - size) / 2;
  const body = pickBodyKey(bodyKeys, random, 0.18);
  if (tall) {
    const height = 46 + random() * 58;
    addSetbackTower(inst, terrain, collision, x, z, size, size, height, body, glassFor(body), random);
    if (random() < 0.5) {
      addGenericBuilding(inst, terrain, collision, inset + 1, insetZ + LOT_SIZE - 6, 5, 5, 8 + random() * 6, 'concreteDark', 'glassDark', { random });
    }
  } else {
    addGenericBuilding(inst, terrain, collision, x, z, size, size, 16 + random() * 22, body, glassFor(body), { random, podium: random() < 0.4 });
  }
}

function fillMidriseBlock(inst, terrain, collision, rect, district, random) {
  const inset = rect.x0 + BLOCK_INSET;
  const insetZ = rect.z0 + BLOCK_INSET;
  const bodyKeys = BODY_BY_DISTRICT[district];
  const lots = subdivide(inset, insetZ, LOT_SIZE, 2, 2, 1.6);
  lots.forEach((lot, index) => {
    if (random() < 0.12) return;
    const body = pickBodyKey(bodyKeys, random, index === 0 ? 0.28 : 0.12);
    const maxHeight = district === 'midtown' ? 34 : 18;
    const minHeight = district === 'midtown' ? 14 : 7;
    const height = minHeight + random() * (maxHeight - minHeight);
    if (height > 26 && random() < 0.35) {
      addSetbackTower(inst, terrain, collision, lot.x, lot.z, lot.w, lot.d, height, body, glassFor(body), random);
    } else {
      addGenericBuilding(inst, terrain, collision, lot.x, lot.z, lot.w, lot.d, height, body, glassFor(body), { random });
    }
  });
}

function fillShophouseBlock(inst, terrain, collision, rect, random) {
  const axis = random() < 0.5 ? 'x' : 'z';
  if (axis === 'x') {
    addShophouseRow(inst, terrain, collision, rect.x0 + BLOCK_INSET, rect.z0 + BLOCK_INSET, 4, 'x', SHOPHOUSE_COLORS, random);
    addParkedCars(inst, terrain, rect.x0 + 1, rect.z1 - 3, 4, 'x', random);
  } else {
    addShophouseRow(inst, terrain, collision, rect.x0 + BLOCK_INSET, rect.z0 + BLOCK_INSET, 4, 'z', SHOPHOUSE_COLORS, random);
    addParkedCars(inst, terrain, rect.x1 - 3, rect.z0 + 1, 4, 'z', random);
  }
}

function fillKampungBlock(inst, terrain, collision, rect, random) {
  const inset = rect.x0 + 2;
  const insetZ = rect.z0 + 2;
  const lots = subdivide(inset, insetZ, BLOCK_SIZE - 4, 2, 3, 1.2);
  lots.forEach((lot) => {
    if (random() < 0.2) {
      addLeafyTree(inst, terrain, lot.x + lot.w / 2, lot.z + lot.d / 2, 3.4 + random() * 1.6);
      return;
    }
    addKampungHouse(inst, terrain, collision, lot.x, lot.z, lot.w, lot.d, random);
  });
}

function fillPlazaBlock(inst, terrain, rect) {
  const cx = (rect.x0 + rect.x1) / 2;
  const cz = (rect.z0 + rect.z1) / 2;
  const ground = terrain.surfaceYAt(cx, cz);
  for (let i = -1; i <= 1; i += 1) {
    for (let j = -1; j <= 1; j += 1) {
      if (i === 0 && j === 0) continue;
      inst.addBox(cx + i * 5.5, ground + 2, cz + j * 5.5, 0.35, 4, 0.35, 'concreteDark');
      inst.addBox(cx + i * 5.5, ground + 4.3, cz + j * 5.5, 1, 0.42, 1, 'lampGlow');
    }
  }
  inst.addBox(cx, ground + 1.2, cz, 4.2, 0.6, 4.2, 'plaza');
  inst.addBox(cx, ground + 3.4, cz, 1.4, 3.6, 1.4, 'monumentBronze');
}

function fillParkingBlock(inst, terrain, rect, random) {
  const inset = rect.x0 + 1;
  const insetZ = rect.z0 + 1;
  const ground = terrain.surfaceYAt(rect.x0 + 8, rect.z0 + 8);
  inst.addBox(rect.x0 + BLOCK_SIZE / 2, ground + 0.08, rect.z0 + BLOCK_SIZE / 2, BLOCK_SIZE - 1, 0.16, BLOCK_SIZE - 1, 'stoneDark');
  for (let i = 0; i < 4; i += 1) {
    inst.addBox(inset + 1.5 + i * 4, ground + 0.18, insetZ + 2, 0.25, 0.06, 4, 'lineWhite');
  }
  addParkedCars(inst, terrain, inset + 1, insetZ + 3, 4, 'x', random);
  addParkedCars(inst, terrain, inset + 1, insetZ + BLOCK_SIZE - 5, 4, 'x', random);
}

export function createBlockPlan(reservations = []) {
  const plan = new Map();
  for (let bx = CITY_BLOCK_MIN; bx <= CITY_BLOCK_MAX; bx += 1) {
    for (let bz = CITY_BLOCK_MIN; bz <= CITY_BLOCK_MAX; bz += 1) {
      const rect = blockRect(bx, bz);
      const cx = blockCenter(bx);
      const cz = blockCenter(bz);
      const roll = hashBlock(bx, bz);
      let style;

      const reserved = reservations.find((item) => rectsIntersect(rect, item, item.padding ?? 0));
      if (reserved) {
        style = reserved.style ?? 'clear';
      } else if (Math.abs(cx + 18) < 30 && Math.abs(cz + 42) < 26) {
        style = 'shophouse';
      } else if (Math.abs(cx + 35) < 26 && Math.abs(cz - 8) < 24) {
        style = 'kampung';
      } else if (Math.abs(cx + 55) < 24 && Math.abs(cz + 74) < 22) {
        style = 'shophouse';
      } else if (roll < 0.1) {
        style = 'park';
      } else if (roll < 0.15) {
        style = 'plaza';
      } else if (roll < 0.2) {
        style = 'parking';
      } else {
        const district = districtFor(cx, cz);
        if (district === 'downtown') style = 'tower';
        else if (district === 'midtown') style = roll < 0.42 ? 'tower' : 'midrise';
        else if (district === 'urban') style = roll < 0.18 ? 'midrise' : 'lowrise';
        else style = 'lowrise';
      }

      plan.set(`${bx}_${bz}`, { style, bx, bz, rect, roll });
    }
  }
  return plan;
}

export function blockGroundKey(entry) {
  if (!entry) return 'grass';
  switch (entry.style) {
    case 'street':
      return 'road';
    case 'park':
    case 'clear-grass':
      return entry.roll > 0.5 ? 'grass2' : 'grass';
    case 'parking':
      return 'stoneDark';
    default:
      return entry.roll > 0.72 ? 'plaza' : entry.roll > 0.42 ? 'concrete' : 'concreteDark';
  }
}

export function fillCityBlocks({ inst, terrain, collision, plan }) {
  const random = mulberry32FromPlan();
  const sorted = [...plan.values()].sort((a, b) => Math.abs(a.bx) + Math.abs(a.bz) - (Math.abs(b.bx) + Math.abs(b.bz)));
  for (const entry of sorted) {
    const { style, rect } = entry;
    if (style === 'clear' || style === 'clear-grass') continue;
    if (style === 'park') {
      addParkBlock(inst, terrain, rect.x0, rect.z0, BLOCK_SIZE, random);
    } else if (style === 'plaza') {
      fillPlazaBlock(inst, terrain, rect);
    } else if (style === 'parking') {
      fillParkingBlock(inst, terrain, rect, random);
    } else if (style === 'shophouse') {
      fillShophouseBlock(inst, terrain, collision, rect, random);
    } else if (style === 'kampung') {
      fillKampungBlock(inst, terrain, collision, rect, random);
    } else if (style === 'tower') {
      fillTowerBlock(inst, terrain, collision, rect, 'downtown', random);
    } else if (style === 'midrise') {
      const district = districtFor((rect.x0 + rect.x1) / 2, (rect.z0 + rect.z1) / 2);
      fillMidriseBlock(inst, terrain, collision, rect, district === 'midtown' ? 'midtown' : 'urban', random);
    } else if (style === 'lowrise') {
      fillMidriseBlock(inst, terrain, collision, rect, 'suburb', random);
    }
  }
}

function mulberry32FromPlan() {
  let value = 0x9e3779b9;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
