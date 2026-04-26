import * as THREE from 'three';
import { VoxelInstancer, VOXEL_PALETTE } from './VoxelInstancer.js';
import { fbm, hash2, mulberry32, clamp } from '../utils/noise.js';

const MAP_MIN = -96;
const MAP_MAX = 96;
const MAP_SIZE = MAP_MAX - MAP_MIN + 1;

function mapKey(x, z) {
  return `${x},${z}`;
}

function rangeInt(random, min, max) {
  return Math.floor(min + random() * (max - min + 1));
}

function distance2D(ax, az, bx, bz) {
  return Math.hypot(ax - bx, az - bz);
}

function isNearAny(x, z, points, radius) {
  return points.some((p) => distance2D(x, z, p.x, p.z) < radius);
}

function addPalmTree(inst, terrain, x, z, height = 4) {
  const y = terrain.surfaceYAt(x, z);
  inst.addBox(x, y + height / 2, z, 0.7, height, 0.7, 'treeTrunk');
  inst.addBox(x, y + height + 0.8, z, 3.4, 1.2, 3.4, 'treeLeaf');
  inst.addBox(x, y + height + 1.4, z, 2.1, 1.1, 2.1, 'treeLeaf2');
  inst.addBox(x, y + height + 0.4, z, 4.8, 0.55, 1.2, 'treeLeaf');
  inst.addBox(x, y + height + 0.4, z, 1.2, 0.55, 4.8, 'treeLeaf');
}

function addRoadTile(inst, terrain, x, z, width = 1, depth = 1, key = 'road') {
  const y = terrain.surfaceYAt(x, z) + 0.04;
  inst.addBox(x + 0.5, y, z + 0.5, width, 0.08, depth, key);
}

function addRoadLine(inst, terrain, start, end, roadWidth = 5) {
  const dx = Math.sign(end.x - start.x);
  const dz = Math.sign(end.z - start.z);
  const length = Math.max(Math.abs(end.x - start.x), Math.abs(end.z - start.z));
  const half = Math.floor(roadWidth / 2);

  for (let i = 0; i <= length; i += 1) {
    const x = start.x + dx * i;
    const z = start.z + dz * i;
    if (Math.abs(dx) > 0) {
      for (let oz = -half; oz <= half; oz += 1) addRoadTile(inst, terrain, x, z + oz);
      if (i % 7 === 0) addRoadTile(inst, terrain, x, z, 0.9, 0.18, 'lineWhite');
    } else {
      for (let ox = -half; ox <= half; ox += 1) addRoadTile(inst, terrain, x + ox, z);
      if (i % 7 === 0) addRoadTile(inst, terrain, x, z, 0.18, 0.9, 'lineWhite');
    }
  }
}

function addPlaza(inst, terrain, cx, cz, width, depth, key = 'plaza') {
  const x0 = Math.floor(cx - width / 2);
  const z0 = Math.floor(cz - depth / 2);
  for (let x = x0; x < x0 + width; x += 1) {
    for (let z = z0; z < z0 + depth; z += 1) {
      const checker = (x + z) % 2 === 0 ? key : 'concrete';
      const y = terrain.surfaceYAt(x, z) + 0.05;
      inst.addBox(x + 0.5, y, z + 0.5, 1, 0.09, 1, checker);
    }
  }
}

function addWindowBands(inst, x0, z0, w, d, yBase, floors, floorHeight, sideKey = 'glassDark') {
  for (let f = 1; f < floors; f += 2) {
    const y = yBase + f * floorHeight;
    inst.addBox(x0 + w / 2, y, z0 - 0.06, Math.max(1, w - 1), 0.42, 0.08, sideKey);
    inst.addBox(x0 + w / 2, y, z0 + d + 0.06, Math.max(1, w - 1), 0.42, 0.08, sideKey);
    inst.addBox(x0 - 0.06, y, z0 + d / 2, 0.08, 0.42, Math.max(1, d - 1), sideKey);
    inst.addBox(x0 + w + 0.06, y, z0 + d / 2, 0.08, 0.42, Math.max(1, d - 1), sideKey);
  }
}

function addGenericBuilding(inst, terrain, x0, z0, w, d, h, bodyKey, glassKey = 'glassDark') {
  const ground = terrain.surfaceYAt(x0 + w / 2, z0 + d / 2);
  const floorHeight = 2;
  const floors = Math.max(2, Math.floor(h / floorHeight));
  const height = floors * floorHeight;

  inst.addBox(x0 + w / 2, ground + height / 2, z0 + d / 2, w, height, d, bodyKey);
  inst.addBox(x0 + w / 2, ground + height + 0.25, z0 + d / 2, w + 0.6, 0.5, d + 0.6, 'concreteDark');
  addWindowBands(inst, x0, z0, w, d, ground + 0.9, floors, floorHeight, glassKey);

  if (height > 24) {
    inst.addBox(x0 + w / 2, ground + height + 2, z0 + d / 2, Math.max(1.5, w * 0.38), 3.5, Math.max(1.5, d * 0.38), 'steel');
  }
}

function addPetronasTower(inst, ground, cx, cz) {
  const height = 70;
  for (let y = 0; y < height; y += 2) {
    const t = y / height;
    const r = t < 0.38 ? 7 : t < 0.67 ? 6 : t < 0.86 ? 5 : 4;
    const floorKey = y % 8 === 0 ? 'petronasTrim' : 'silver';
    inst.addBox(cx, ground + y + 1, cz, r, 2, r, 'glass');
    inst.addBox(cx, ground + y + 1.03, cz, r + 1.1, 0.22, r + 1.1, floorKey);
    inst.addBox(cx - r / 2 - 0.3, ground + y + 1, cz, 0.45, 2, 1.5, 'petronasTrim');
    inst.addBox(cx + r / 2 + 0.3, ground + y + 1, cz, 0.45, 2, 1.5, 'petronasTrim');
    inst.addBox(cx, ground + y + 1, cz - r / 2 - 0.3, 1.5, 2, 0.45, 'petronasTrim');
    inst.addBox(cx, ground + y + 1, cz + r / 2 + 0.3, 1.5, 2, 0.45, 'petronasTrim');
  }

  for (let i = 0; i < 8; i += 1) {
    inst.addBox(cx, ground + height + 1.2 + i * 1.7, cz, 3.6 - i * 0.35, 1.5, 3.6 - i * 0.35, i % 2 ? 'petronasTrim' : 'silver');
  }
  inst.addBox(cx, ground + height + 17, cz, 0.8, 12, 0.8, 'petronasTrim');
  inst.addBox(cx, ground + height + 24, cz, 0.35, 5, 0.35, 'petronasTrim');
}

function addPetronas(inst, terrain) {
  const cz = 22;
  const left = -18;
  const right = -5;
  const ground = terrain.surfaceYAt(-12, cz);
  addPlaza(inst, terrain, -12, cz, 38, 28, 'concrete');
  addPetronasTower(inst, ground, left, cz);
  addPetronasTower(inst, ground, right, cz);
  inst.addBox((left + right) / 2, ground + 35, cz, Math.abs(right - left) + 4, 3, 3.2, 'petronasTrim');
  inst.addBox((left + right) / 2, ground + 35, cz, Math.abs(right - left) + 2, 1.5, 4.6, 'glass');
  inst.addBox(-12, ground + 2.4, cz + 16, 20, 4.8, 8, 'concreteDark');
  inst.addBox(-12, ground + 5.2, cz + 16, 22, 1.2, 9.5, 'petronasTrim');
}

function addMerdeka118(inst, terrain) {
  const cx = 35;
  const cz = 18;
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 30, 26, 'plaza');
  for (let y = 0; y < 86; y += 3) {
    const t = y / 86;
    const w = 12 - t * 5.8;
    const d = 10 - t * 3.6;
    const offset = Math.sin(t * Math.PI * 2) * 0.9;
    inst.addBox(cx + offset, ground + y + 1.5, cz, w, 3, d, 'merdekaGlass');
    if (y % 9 === 0) inst.addBox(cx + offset, ground + y + 1.55, cz, w + 0.7, 0.35, d + 0.7, 'merdekaTrim');
    inst.addBox(cx + w / 2 + offset + 0.16, ground + y + 1.5, cz, 0.22, 3, d * 0.8, 'blackGlass');
  }
  inst.addBox(cx, ground + 91, cz, 3.3, 9, 3.3, 'merdekaTrim');
  inst.addBox(cx, ground + 101, cz, 1.1, 16, 1.1, 'merdekaTrim');
  inst.addBox(cx, ground + 111, cz, 0.45, 8, 0.45, 'merdekaTrim');
}

function addKLTower(inst, terrain) {
  const cx = 58;
  const cz = -25;
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 22, 20, 'concrete');
  inst.addBox(cx, ground + 27, cz, 3, 54, 3, 'klTowerWhite');
  inst.addBox(cx, ground + 28, cz, 1.3, 58, 1.3, 'stoneDark');
  inst.addBox(cx, ground + 56, cz, 12, 5, 12, 'klTowerWhite');
  inst.addBox(cx, ground + 58, cz, 15, 2, 7, 'glassGreen');
  inst.addBox(cx, ground + 58, cz, 7, 2, 15, 'glassGreen');
  inst.addBox(cx, ground + 61.6, cz, 10, 2, 10, 'klTowerRed');
  inst.addBox(cx, ground + 70, cz, 1.3, 18, 1.3, 'klTowerWhite');
  inst.addBox(cx, ground + 83, cz, 0.45, 8, 0.45, 'klTowerRed');
}

function addSultanAbdulSamad(inst, terrain) {
  const cx = 0;
  const cz = -55;
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 62, 22, 'plaza');
  inst.addBox(cx, ground + 4, cz, 54, 8, 8, 'redBrick');
  inst.addBox(cx, ground + 8.8, cz, 56, 1.2, 9.2, 'stone');

  for (let i = -24; i <= 24; i += 8) {
    inst.addBox(cx + i, ground + 4.8, cz - 4.5, 2.4, 5.6, 0.6, 'mosqueWhite');
    inst.addBox(cx + i, ground + 4.8, cz + 4.5, 2.4, 5.6, 0.6, 'mosqueWhite');
  }

  inst.addBox(cx, ground + 12, cz, 7, 24, 7, 'redBrick');
  inst.addBox(cx, ground + 19.5, cz - 3.7, 4.5, 4, 0.7, 'mosqueWhite');
  inst.addBox(cx, ground + 19.5, cz + 3.7, 4.5, 4, 0.7, 'mosqueWhite');
  inst.addBox(cx, ground + 25.2, cz, 8.5, 2.4, 8.5, 'roofCopper');
  inst.addBox(cx, ground + 28.2, cz, 5.8, 3.4, 5.8, 'roofCopper');
  inst.addBox(cx, ground + 31.6, cz, 2.8, 3.2, 2.8, 'roofCopper');

  [-25, 25].forEach((x) => {
    inst.addBox(cx + x, ground + 10, cz, 5.2, 14, 5.2, 'redBrick');
    inst.addBox(cx + x, ground + 18.8, cz, 6.6, 2.2, 6.6, 'roofCopper');
    inst.addBox(cx + x, ground + 21.2, cz, 3.8, 2.8, 3.8, 'roofCopper');
  });
}

function addNationalMosque(inst, terrain) {
  const cx = -48;
  const cz = -32;
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 34, 26, 'concrete');
  inst.addBox(cx, ground + 3, cz, 22, 6, 14, 'mosqueWhite');
  for (let layer = 0; layer < 6; layer += 1) {
    inst.addBox(cx, ground + 6.2 + layer * 0.72, cz, 25 - layer * 3.2, 0.7, 17 - layer * 2, 'mosqueBlue');
  }
  inst.addBox(cx - 17, ground + 14, cz + 4, 2.4, 28, 2.4, 'mosqueWhite');
  inst.addBox(cx - 17, ground + 29.5, cz + 4, 4.5, 3.2, 4.5, 'mosqueBlue');
  inst.addBox(cx - 17, ground + 33, cz + 4, 1.1, 6, 1.1, 'mosqueWhite');
}

function addNationalMonument(inst, terrain) {
  const cx = -70;
  const cz = 43;
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 26, 20, 'plaza');
  inst.addBox(cx, ground + 1.3, cz, 16, 2.6, 10, 'stone');
  inst.addBox(cx, ground + 3.4, cz, 12, 1.2, 7, 'concrete');

  const offsets = [-4, -2, 0, 2, 4];
  offsets.forEach((ox, index) => {
    const lean = (index - 2) * 0.25;
    inst.addBox(cx + ox, ground + 7, cz + lean, 1.2, 6, 1.2, 'monumentBronze');
    inst.addBox(cx + ox, ground + 10.4, cz + lean, 2, 1.6, 1.8, 'monumentBronze');
    inst.addBox(cx + ox - 1.2, ground + 7.6, cz + lean, 1.1, 3.8, 0.9, 'monumentBronze');
    inst.addBox(cx + ox + 1.2, ground + 8.2, cz + lean, 1.1, 4.2, 0.9, 'monumentBronze');
  });
  inst.addBox(cx + 4, ground + 14, cz, 1, 9, 1, 'monumentBronze');
  inst.addBox(cx + 4, ground + 17.6, cz, 5, 1.2, 0.8, 'monumentBronze');
}

function addExchange106(inst, terrain) {
  const cx = 66;
  const cz = 32;
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 28, 22, 'concrete');
  for (let y = 0; y < 74; y += 3) {
    const t = y / 74;
    inst.addBox(cx, ground + y + 1.5, cz, 11 - t * 4, 3, 9 - t * 3, 'glassGreen');
    if (y % 12 === 0) inst.addBox(cx, ground + y + 1.6, cz, 12 - t * 4, 0.3, 10 - t * 3, 'mallGold');
  }
  inst.addBox(cx, ground + 78, cz, 5, 6, 5, 'mallGold');
  inst.addBox(cx, ground + 84, cz, 1, 8, 1, 'mallGold');
  addGenericBuilding(inst, terrain, cx - 18, cz - 6, 8, 8, 34, 'blackGlass', 'glassDark');
  addGenericBuilding(inst, terrain, cx + 12, cz - 8, 7, 9, 28, 'merdekaGlass', 'glass');
}

function addBukitBintang(inst, terrain) {
  const cx = 30;
  const cz = -22;
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 30, 24, 'plaza');
  inst.addBox(cx - 8, ground + 5, cz, 18, 10, 10, 'mallGold');
  inst.addBox(cx + 8, ground + 4, cz + 4, 13, 8, 9, 'glassDark');
  inst.addBox(cx, ground + 10.5, cz, 32, 1, 14, 'concreteDark');
  for (let i = -10; i <= 10; i += 5) inst.addBox(cx + i, ground + 11.6, cz - 7, 2.5, 1.4, 0.5, 'lampGlow');
}

function addCentralMarket(inst, terrain) {
  const cx = -20;
  const cz = -60;
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 24, 16, 'concrete');
  inst.addBox(cx, ground + 3.8, cz, 20, 7.6, 9, 'marketBlue');
  inst.addBox(cx, ground + 8.2, cz, 22, 1.2, 10.5, 'concrete');
  inst.addBox(cx, ground + 10, cz, 12, 2.2, 5, 'marketBlue');
}

function addRailwayStation(inst, terrain) {
  const cx = -36;
  const cz = -58;
  const ground = terrain.surfaceYAt(cx, cz);
  inst.addBox(cx, ground + 4, cz, 24, 8, 7, 'mosqueWhite');
  for (let x = -10; x <= 10; x += 5) inst.addBox(cx + x, ground + 9, cz, 3, 4, 3, 'mosqueWhite');
  inst.addBox(cx, ground + 11.8, cz, 26, 1, 8.5, 'stationRoof');
  inst.addBox(cx - 13, ground + 10, cz, 2, 12, 2, 'mosqueWhite');
  inst.addBox(cx + 13, ground + 10, cz, 2, 12, 2, 'mosqueWhite');
}

function addTheanHouTemple(inst, terrain) {
  const cx = -75;
  const cz = -20;
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 22, 18, 'plaza');
  inst.addBox(cx, ground + 3, cz, 16, 6, 10, 'templeRed');
  for (let y = 0; y < 3; y += 1) inst.addBox(cx, ground + 6.6 + y * 0.7, cz, 19 - y * 2, 0.65, 12 - y, 'templeGold');
  [-7, 7].forEach((x) => {
    inst.addBox(cx + x, ground + 7, cz, 3.5, 7, 3.5, 'templeRed');
    inst.addBox(cx + x, ground + 11, cz, 5, 1, 5, 'templeGold');
  });
}

function addNationalMuseum(inst, terrain) {
  const cx = -58;
  const cz = -66;
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 24, 18, 'concrete');
  inst.addBox(cx, ground + 3.5, cz, 18, 7, 10, 'museumBrown');
  inst.addBox(cx, ground + 8, cz, 20, 2, 12, 'roofCopper');
  inst.addBox(cx, ground + 10.2, cz, 10, 2.2, 6, 'roofCopper');
}

function addStreetDetails(inst, terrain) {
  const crossings = [[18, -8], [18, 42], [-62, -55], [-24, 22], [46, 22], [0, -55]];
  crossings.forEach(([cx, cz]) => {
    for (let i = -3; i <= 3; i += 2) {
      addRoadTile(inst, terrain, cx + i, cz, 0.65, 5.4, 'lineWhite');
      addRoadTile(inst, terrain, cx, cz + i, 5.4, 0.65, 'lineWhite');
    }
  });

  for (let x = -80; x <= 80; x += 16) {
    [[x, -12], [x, 46]].forEach(([lx, lz]) => {
      const y = terrain.surfaceYAt(lx, lz);
      inst.addBox(lx, y + 2, lz, 0.35, 4, 0.35, 'concreteDark');
      inst.addBox(lx, y + 4.2, lz, 1.1, 0.45, 1.1, 'lampGlow');
    });
  }

  [[-30, -8], [34, -8], [52, 42], [-70, 42]].forEach(([x, z]) => {
    const y = terrain.surfaceYAt(x, z);
    inst.addBox(x, y + 1.2, z, 4, 2.4, 2.2, 'busGreen');
    inst.addBox(x, y + 2.7, z, 4.6, 0.5, 2.8, 'stationRoof');
  });

  [[-8, -50], [-52, -24], [22, 34], [41, -18], [-72, 52]].forEach(([x, z]) => {
    const y = terrain.surfaceYAt(x, z);
    inst.addBox(x, y + 1, z, 3.2, 2, 1.8, 'warning');
    inst.addBox(x - 1.5, y + 2.3, z, 0.8, 0.8, 0.8, 'lampGlow');
  });
}

function addTransitLine(inst, terrain, orientation, fixed, from, to, y = 13) {
  const start = Math.min(from, to);
  const end = Math.max(from, to);
  for (let s = start; s <= end; s += 2) {
    const x = orientation === 'x' ? s : fixed;
    const z = orientation === 'x' ? fixed : s;
    const ground = terrain.surfaceYAt(x, z);
    if (s % 10 === 0) inst.addBox(x, ground + 5.2, z, 1.2, 10.4, 1.2, 'concreteDark');
    if (orientation === 'x') {
      inst.addBox(x + 0.5, y, z, 2.2, 0.35, 5.2, 'concrete');
      inst.addBox(x + 0.5, y + 0.45, z - 1.4, 2.2, 0.25, 0.35, 'rail');
      inst.addBox(x + 0.5, y + 0.45, z + 1.4, 2.2, 0.25, 0.35, 'rail');
    } else {
      inst.addBox(x, y, z + 0.5, 5.2, 0.35, 2.2, 'concrete');
      inst.addBox(x - 1.4, y + 0.45, z + 0.5, 0.35, 0.25, 2.2, 'rail');
      inst.addBox(x + 1.4, y + 0.45, z + 0.5, 0.35, 0.25, 2.2, 'rail');
    }
  }
}

function addStation(inst, terrain, cx, cz, labelKey = 'station') {
  const ground = terrain.surfaceYAt(cx, cz);
  const y = 13;
  inst.addBox(cx, y + 1.8, cz, 13, 3, 8, labelKey);
  inst.addBox(cx, y + 4, cz, 15, 1.4, 10, 'stationRoof');
  inst.addBox(cx - 5, ground + 6, cz - 3, 1.2, 12, 1.2, 'concreteDark');
  inst.addBox(cx + 5, ground + 6, cz + 3, 1.2, 12, 1.2, 'concreteDark');
  inst.addBox(cx, ground + 1.8, cz + 7, 9, 3.6, 3, 'station');
}

function addCityBuildings(inst, terrain) {
  const random = mulberry32(20260604);
  const landmarkPoints = [
    { x: -12, z: 22 },
    { x: 35, z: 18 },
    { x: 58, z: -25 },
    { x: 0, z: -55 },
    { x: -48, z: -32 },
    { x: -70, z: 43 }
  ];
  const colors = ['glass', 'glassGreen', 'merdekaGlass', 'silver', 'concreteDark', 'blackGlass'];

  for (let i = 0; i < 88; i += 1) {
    const x = rangeInt(random, -70, 72);
    const z = rangeInt(random, -70, 65);
    const w = rangeInt(random, 4, 10);
    const d = rangeInt(random, 4, 10);
    if (isNearAny(x, z, landmarkPoints, 19)) continue;
    if (Math.abs(z + 8) < 6 || Math.abs(x - 18) < 6 || Math.abs(z - 42) < 5 || Math.abs(x + 60) < 5) continue;
    const downtownBoost = clamp(1.4 - distance2D(x, z, 8, 6) / 85, 0.35, 1.4);
    const h = Math.floor((rangeInt(random, 8, 34) + random() * 20) * downtownBoost);
    const color = colors[rangeInt(random, 0, colors.length - 1)];
    const windowKey = color === 'blackGlass' ? 'glass' : 'glassDark';
    addGenericBuilding(inst, terrain, x, z, w, d, Math.max(7, h), color, windowKey);
  }
}

function createTerrain(inst) {
  const heights = new Map();
  for (let x = MAP_MIN; x <= MAP_MAX; x += 1) {
    for (let z = MAP_MIN; z <= MAP_MAX; z += 1) {
      const dist = Math.hypot(x * 0.78, z) / 100;
      const hills = fbm(x / 44, z / 44, 8808, 4) * 5.5 + fbm(x / 18, z / 18, 9020, 3) * 2.4;
      const cityFlatten = Math.max(0, 1 - Math.hypot(x - 8, z + 2) / 92);
      const raw = 2.4 + hills + dist * 4.5 - cityFlatten * 2.8;
      const terrace = Math.floor(raw / 1.35) * 1.35;
      const height = clamp(Math.round(terrace), 0, 11);
      heights.set(mapKey(x, z), height);
    }
  }

  const heightAtCell = (x, z) => {
    const cx = clamp(Math.floor(x), MAP_MIN, MAP_MAX);
    const cz = clamp(Math.floor(z), MAP_MIN, MAP_MAX);
    return heights.get(mapKey(cx, cz)) ?? 1;
  };

  const terrain = {
    min: MAP_MIN,
    max: MAP_MAX,
    size: MAP_SIZE,
    heightAtCell,
    surfaceYAt(x, z) {
      return heightAtCell(x, z) + 1;
    },
    clampXZ(position) {
      position.x = clamp(position.x, MAP_MIN + 2, MAP_MAX - 2);
      position.z = clamp(position.z, MAP_MIN + 2, MAP_MAX - 2);
      return position;
    }
  };

  for (let x = MAP_MIN; x <= MAP_MAX; x += 1) {
    for (let z = MAP_MIN; z <= MAP_MAX; z += 1) {
      const h = heightAtCell(x, z);
      const noise = hash2(x, z, 4477);
      const grassKey = noise > 0.72 ? 'grass2' : noise < 0.18 ? 'grassDark' : 'grass';
      inst.addVoxel(x, h, z, grassKey);

      const neighborMin = Math.min(
        heightAtCell(x - 1, z),
        heightAtCell(x + 1, z),
        heightAtCell(x, z - 1),
        heightAtCell(x, z + 1),
        x === MAP_MIN || x === MAP_MAX || z === MAP_MIN || z === MAP_MAX ? 0 : h
      );
      for (let y = neighborMin + 1; y < h; y += 1) {
        inst.addVoxel(x, y, z, y > h - 3 ? 'dirt' : 'clay');
      }
      if (x === MAP_MIN || x === MAP_MAX || z === MAP_MIN || z === MAP_MAX) {
        for (let y = 0; y < h; y += 1) inst.addVoxel(x, y, z, y > h - 4 ? 'dirt' : 'stoneDark');
      }
    }
  }

  return terrain;
}

function addParksAndWater(inst, terrain) {
  for (let x = -82; x < -58; x += 1) {
    for (let z = 53; z < 77; z += 1) {
      const dx = (x + 70) / 12;
      const dz = (z - 65) / 12;
      if (dx * dx + dz * dz < 1) {
        const y = terrain.surfaceYAt(x, z) + 0.09;
        inst.addBox(x + 0.5, y, z + 0.5, 1, 0.1, 1, 'water');
      }
    }
  }

  const treeSpots = [
    [-77, 50], [-65, 38], [-58, 44], [-75, 70], [-59, 72], [-42, 28], [-34, 32],
    [-28, -38], [-54, -18], [-63, -21], [-8, -42], [14, -43], [43, -12], [50, -8],
    [66, -14], [72, -34], [24, 42], [12, 48], [-10, 48], [-20, 40]
  ];
  treeSpots.forEach(([x, z], index) => addPalmTree(inst, terrain, x, z, 3.5 + (index % 4) * 0.6));

  for (let x = -78; x <= 78; x += 11) {
    if (Math.abs(x) < 18) continue;
    addPalmTree(inst, terrain, x, 77, 4);
  }
}

function addRoads(inst, terrain) {
  addRoadLine(inst, terrain, { x: -88, z: -8 }, { x: 88, z: -8 }, 7);
  addRoadLine(inst, terrain, { x: -86, z: 42 }, { x: 86, z: 42 }, 5);
  addRoadLine(inst, terrain, { x: 18, z: -84 }, { x: 18, z: 78 }, 7);
  addRoadLine(inst, terrain, { x: -62, z: -80 }, { x: -62, z: 78 }, 5);
  addRoadLine(inst, terrain, { x: -42, z: -55 }, { x: 44, z: -55 }, 5);
  addRoadLine(inst, terrain, { x: -24, z: 22 }, { x: 46, z: 22 }, 5);
}

function addTransit(inst, terrain) {
  addTransitLine(inst, terrain, 'x', -8, -84, 86, 13.2);
  addTransitLine(inst, terrain, 'z', 18, -75, 74, 15.8);
  addStation(inst, terrain, -12, -8);
  addStation(inst, terrain, 18, 22);
  addStation(inst, terrain, 58, -8);
  addStation(inst, terrain, -62, -55);
}

export function createKualaLumpurWorld(scene) {
  scene.background = new THREE.Color(0x07101f);
  scene.fog = new THREE.Fog(0x07101f, 90, 235);

  const inst = new VoxelInstancer(scene, { castShadow: false, receiveShadow: true });
  const terrain = createTerrain(inst);

  addParksAndWater(inst, terrain);
  addRoads(inst, terrain);
  addTransit(inst, terrain);
  addStreetDetails(inst, terrain);
  addCityBuildings(inst, terrain);
  addPetronas(inst, terrain);
  addMerdeka118(inst, terrain);
  addKLTower(inst, terrain);
  addSultanAbdulSamad(inst, terrain);
  addNationalMosque(inst, terrain);
  addNationalMonument(inst, terrain);
  addExchange106(inst, terrain);
  addBukitBintang(inst, terrain);
  addCentralMarket(inst, terrain);
  addRailwayStation(inst, terrain);
  addTheanHouTemple(inst, terrain);
  addNationalMuseum(inst, terrain);

  const sunDisc = new THREE.Mesh(
    new THREE.SphereGeometry(6, 16, 8),
    new THREE.MeshBasicMaterial({ color: 0xffe4aa })
  );
  sunDisc.position.set(-82, 92, -110);
  scene.add(sunDisc);

  const stats = inst.finalize();

  const landmarks = [
    { name: 'Petronas Twin Towers', position: new THREE.Vector3(-12, terrain.surfaceYAt(-12, 22) + 5, 22) },
    { name: 'Merdeka 118', position: new THREE.Vector3(35, terrain.surfaceYAt(35, 18) + 8, 18) },
    { name: 'KL Tower', position: new THREE.Vector3(58, terrain.surfaceYAt(58, -25) + 8, -25) },
    { name: 'Merdeka Square', position: new THREE.Vector3(0, terrain.surfaceYAt(0, -55) + 4, -55) },
    { name: 'Masjid Negara', position: new THREE.Vector3(-48, terrain.surfaceYAt(-48, -32) + 4, -32) },
    { name: 'Tugu Negara', position: new THREE.Vector3(-70, terrain.surfaceYAt(-70, 43) + 4, 43) },
    { name: 'LRT / MRT Hub', position: new THREE.Vector3(18, 16, 22) },
    { name: 'Lake Gardens', position: new THREE.Vector3(-70, terrain.surfaceYAt(-70, 65) + 3, 65) },
    { name: 'TRX Exchange 106', position: new THREE.Vector3(66, terrain.surfaceYAt(66, 32) + 8, 32) },
    { name: 'Bukit Bintang', position: new THREE.Vector3(30, terrain.surfaceYAt(30, -22) + 4, -22) },
    { name: 'Central Market', position: new THREE.Vector3(-20, terrain.surfaceYAt(-20, -60) + 4, -60) },
    { name: 'Old Railway Station', position: new THREE.Vector3(-36, terrain.surfaceYAt(-36, -58) + 4, -58) },
    { name: 'Thean Hou Temple', position: new THREE.Vector3(-75, terrain.surfaceYAt(-75, -20) + 5, -20) },
    { name: 'National Museum', position: new THREE.Vector3(-58, terrain.surfaceYAt(-58, -66) + 4, -66) }
  ];

  const transportPaths = [
    {
      name: 'Kelana Jaya inspired elevated line',
      points: [
        new THREE.Vector3(-82, 14.4, -8),
        new THREE.Vector3(-48, 14.4, -8),
        new THREE.Vector3(-12, 14.4, -8),
        new THREE.Vector3(18, 17.0, 22),
        new THREE.Vector3(54, 14.4, -8),
        new THREE.Vector3(84, 14.4, -8)
      ],
      color: 'blue'
    },
    {
      name: 'Monorail inspired north-south line',
      points: [
        new THREE.Vector3(18, 17.0, -72),
        new THREE.Vector3(18, 17.0, -28),
        new THREE.Vector3(18, 17.0, 22),
        new THREE.Vector3(18, 17.0, 72)
      ],
      color: 'yellow'
    }
  ];

  return {
    terrain,
    palette: VOXEL_PALETTE,
    landmarks,
    transportPaths,
    voxelStats: stats,
    startPosition: new THREE.Vector3(-38, terrain.surfaceYAt(-38, 8) + 0.1, 8)
  };
}
