import * as THREE from 'three';
import { VoxelInstancer, VOXEL_PALETTE } from './VoxelInstancer.js';
import { fbm, hash2, mulberry32, clamp } from '../utils/noise.js';
import { tourismLandmarks } from '../data/tourismContent.js';

const MAP_MIN = -220;
const MAP_MAX = 220;
const MAP_SIZE = MAP_MAX - MAP_MIN + 1;
const landmarkByName = new Map(tourismLandmarks.map((item) => [item.name, item]));

function landmarkPoint(name, fallback) {
  const item = landmarkByName.get(name);
  return item ? { x: item.x, z: item.z } : fallback;
}

function landmarkVector(name, y, fallback) {
  const point = landmarkPoint(name, fallback);
  return new THREE.Vector3(point.x, y, point.z);
}

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
  const { x: cx, z: cz } = landmarkPoint('Petronas Twin Towers', { x: -12, z: 22 });
  const left = cx - 6.5;
  const right = cx + 6.5;
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 38, 28, 'concrete');
  addPetronasTower(inst, ground, left, cz);
  addPetronasTower(inst, ground, right, cz);
  inst.addBox((left + right) / 2, ground + 35, cz, Math.abs(right - left) + 4, 3, 3.2, 'petronasTrim');
  inst.addBox((left + right) / 2, ground + 35, cz, Math.abs(right - left) + 2, 1.5, 4.6, 'glass');
  inst.addBox(cx, ground + 2.4, cz + 16, 20, 4.8, 8, 'concreteDark');
  inst.addBox(cx, ground + 5.2, cz + 16, 22, 1.2, 9.5, 'petronasTrim');
}

function addMerdeka118(inst, terrain) {
  const { x: cx, z: cz } = landmarkPoint('Merdeka 118', { x: 35, z: 18 });
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
  const { x: cx, z: cz } = landmarkPoint('KL Tower', { x: 58, z: -25 });
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
  const { x: cx, z: cz } = landmarkPoint('Sultan Abdul Samad Building', { x: 0, z: -55 });
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
  const { x: cx, z: cz } = landmarkPoint('Masjid Negara', { x: -48, z: -32 });
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
  const { x: cx, z: cz } = landmarkPoint('Tugu Negara', { x: -70, z: 43 });
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
  const { x: cx, z: cz } = landmarkPoint('TRX Exchange 106', { x: 66, z: 32 });
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
  const { x: cx, z: cz } = landmarkPoint('Bukit Bintang', { x: 30, z: -22 });
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 30, 24, 'plaza');
  inst.addBox(cx - 8, ground + 5, cz, 18, 10, 10, 'mallGold');
  inst.addBox(cx + 8, ground + 4, cz + 4, 13, 8, 9, 'glassDark');
  inst.addBox(cx, ground + 10.5, cz, 32, 1, 14, 'concreteDark');
  for (let i = -10; i <= 10; i += 5) inst.addBox(cx + i, ground + 11.6, cz - 7, 2.5, 1.4, 0.5, 'lampGlow');
}

function addCentralMarket(inst, terrain) {
  const { x: cx, z: cz } = landmarkPoint('Central Market', { x: -20, z: -60 });
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 24, 16, 'concrete');
  inst.addBox(cx, ground + 3.8, cz, 20, 7.6, 9, 'marketBlue');
  inst.addBox(cx, ground + 8.2, cz, 22, 1.2, 10.5, 'concrete');
  inst.addBox(cx, ground + 10, cz, 12, 2.2, 5, 'marketBlue');
}

function addRailwayStation(inst, terrain) {
  const { x: cx, z: cz } = landmarkPoint('Old Railway Station', { x: -36, z: -58 });
  const ground = terrain.surfaceYAt(cx, cz);
  inst.addBox(cx, ground + 4, cz, 24, 8, 7, 'mosqueWhite');
  for (let x = -10; x <= 10; x += 5) inst.addBox(cx + x, ground + 9, cz, 3, 4, 3, 'mosqueWhite');
  inst.addBox(cx, ground + 11.8, cz, 26, 1, 8.5, 'stationRoof');
  inst.addBox(cx - 13, ground + 10, cz, 2, 12, 2, 'mosqueWhite');
  inst.addBox(cx + 13, ground + 10, cz, 2, 12, 2, 'mosqueWhite');
}

function addTheanHouTemple(inst, terrain) {
  const { x: cx, z: cz } = landmarkPoint('Thean Hou Temple', { x: -75, z: -20 });
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
  const { x: cx, z: cz } = landmarkPoint('National Museum', { x: -58, z: -66 });
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
  const landmarkPoints = ['Petronas Twin Towers', 'Merdeka 118', 'KL Tower', 'Sultan Abdul Samad Building', 'Masjid Negara', 'Tugu Negara']
    .map((name) => landmarkPoint(name, { x: 0, z: 0 }));
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

function addRiverOfLife(inst, terrain) {
  for (let z = -62; z <= -28; z += 1) {
    const x = Math.round(-8 + Math.sin(z * 0.18) * 3);
    for (let ox = -2; ox <= 2; ox += 1) addRoadTile(inst, terrain, x + ox, z, 1, 1, 'riverBlue');
  }
  for (let x = -24; x <= 6; x += 1) {
    const z = Math.round(-39 + Math.sin(x * 0.22) * 2);
    for (let oz = -1; oz <= 1; oz += 1) addRoadTile(inst, terrain, x, z + oz, 1, 1, 'riverBlue');
  }
}

function addSmallSign(inst, terrain, cx, cz, key = 'warning') {
  const ground = terrain.surfaceYAt(cx, cz);
  inst.addBox(cx, ground + 1.8, cz, 0.45, 3.2, 0.45, 'concreteDark');
  inst.addBox(cx, ground + 3.6, cz, 4.2, 1.5, 0.55, key);
}

function addMarketStalls(inst, terrain, cx, cz, count, key = 'marketRed') {
  for (let i = 0; i < count; i += 1) {
    const x = cx + (i % 5) * 4 - 8;
    const z = cz + Math.floor(i / 5) * 4 - 4;
    const ground = terrain.surfaceYAt(x, z);
    inst.addBox(x, ground + 1.1, z, 2.6, 2.2, 2.2, 'concreteDark');
    inst.addBox(x, ground + 2.5, z, 3.2, 0.55, 2.8, i % 2 ? key : 'awningStripe');
    inst.addBox(x, ground + 0.65, z + 2, 1.1, 1.3, 1.1, 'lampGlow');
  }
}

function addTourismExpansion(inst, terrain) {
  addRiverOfLife(inst, terrain);
  const klccPark = landmarkPoint('KLCC Park', { x: -25, z: 43 });
  const chinatown = landmarkPoint('Petaling Street / Chinatown', { x: -18, z: -42 });
  const jalanAlor = landmarkPoint('Jalan Alor', { x: 23, z: -32 });
  const riverOfLife = landmarkPoint('Masjid Jamek / River of Life', { x: -9, z: -38 });
  const club = landmarkPoint('Royal Selangor Club', { x: -12, z: -55 });
  const islamicArts = landmarkPoint('Islamic Arts Museum', { x: -58, z: -40 });
  const planetarium = landmarkPoint('National Planetarium', { x: -64, z: -34 });
  const palace = landmarkPoint('Istana Negara', { x: -86, z: 10 });
  const batuCaves = landmarkPoint('Batu Caves Gateway', { x: 82, z: 68 });
  const kampungBaru = landmarkPoint('Kampung Baru', { x: -35, z: 8 });
  const chowKit = landmarkPoint('Chow Kit Market', { x: -44, z: -12 });
  const littleIndia = landmarkPoint('Little India Brickfields', { x: -55, z: -74 });
  const pavilion = landmarkPoint('Pavilion KL', { x: 39, z: -18 });

  addPlaza(inst, terrain, klccPark.x, klccPark.z, 24, 18, 'parkPath');
  [[-6, -4], [3, -5], [7, 5], [-7, 7], [1, 1]].forEach(([dx, dz]) => addPalmTree(inst, terrain, klccPark.x + dx, klccPark.z + dz, 4));

  addMarketStalls(inst, terrain, chinatown.x, chinatown.z, 9, 'marketRed');
  addSmallSign(inst, terrain, chinatown.x + 3, chinatown.z + 6, 'templeRed');
  addMarketStalls(inst, terrain, jalanAlor.x, jalanAlor.z, 10, 'lampGlow');
  for (let i = -8; i <= 8; i += 4) {
    const y = terrain.surfaceYAt(jalanAlor.x + i, jalanAlor.z + 5);
    inst.addBox(jalanAlor.x + i, y + 1, jalanAlor.z + 5, 1.4, 0.7, 1.4, 'mallGold');
  }

  const mosqueGround = terrain.surfaceYAt(riverOfLife.x, riverOfLife.z);
  inst.addBox(riverOfLife.x, mosqueGround + 3, riverOfLife.z, 12, 6, 8, 'mosqueWhite');
  inst.addBox(riverOfLife.x, mosqueGround + 7, riverOfLife.z, 8, 2, 8, 'roofCopper');
  inst.addBox(riverOfLife.x - 5, mosqueGround + 9, riverOfLife.z + 4, 1.4, 12, 1.4, 'mosqueWhite');

  const clubGround = terrain.surfaceYAt(club.x, club.z);
  inst.addBox(club.x, clubGround + 3, club.z, 16, 6, 7, 'stationRoof');
  inst.addBox(club.x, clubGround + 6.8, club.z, 18, 1, 8, 'mosqueWhite');

  const iamGround = terrain.surfaceYAt(islamicArts.x, islamicArts.z);
  inst.addBox(islamicArts.x, iamGround + 3.6, islamicArts.z, 18, 7.2, 12, 'mosqueWhite');
  inst.addBox(islamicArts.x, iamGround + 8.1, islamicArts.z, 9, 2.5, 9, 'mosqueBlue');
  const planetGround = terrain.surfaceYAt(planetarium.x, planetarium.z);
  inst.addBox(planetarium.x, planetGround + 3, planetarium.z, 12, 6, 10, 'museumBrown');
  inst.addBox(planetarium.x, planetGround + 7.2, planetarium.z, 8, 3, 8, 'glassGreen');

  const palaceGround = terrain.surfaceYAt(palace.x, palace.z);
  addPlaza(inst, terrain, palace.x, palace.z, 18, 16, 'plaza');
  inst.addBox(palace.x, palaceGround + 4, palace.z, 16, 8, 9, 'palaceWall');
  inst.addBox(palace.x, palaceGround + 9, palace.z, 12, 2.2, 6, 'palaceGold');
  inst.addBox(palace.x - 8, palaceGround + 5, palace.z - 4, 2, 10, 2, 'palaceGold');

  const caveGround = terrain.surfaceYAt(batuCaves.x, batuCaves.z);
  inst.addBox(batuCaves.x, caveGround + 8, batuCaves.z, 18, 16, 8, 'caveLimestone');
  inst.addBox(batuCaves.x, caveGround + 3, batuCaves.z - 5, 5, 6, 3, 'templeGold');
  for (let step = 0; step < 8; step += 1) inst.addBox(batuCaves.x, caveGround + 0.2 + step * 0.25, batuCaves.z - 10 + step, 9 - step * 0.5, 0.3, 1, 'concrete');

  addMarketStalls(inst, terrain, kampungBaru.x, kampungBaru.z, 8, 'templeGold');
  addMarketStalls(inst, terrain, chowKit.x, chowKit.z, 8, 'marketBlue');
  addMarketStalls(inst, terrain, littleIndia.x, littleIndia.z, 7, 'littleIndiaPink');

  const pavilionGround = terrain.surfaceYAt(pavilion.x, pavilion.z);
  inst.addBox(pavilion.x, pavilionGround + 4.5, pavilion.z, 18, 9, 12, 'pavilionRed');
  inst.addBox(pavilion.x, pavilionGround + 9.5, pavilion.z, 20, 1, 13, 'mallGold');

  tourismLandmarks.filter((item) => item.isSchematicGateway).forEach((item, index) => {
    const ground = terrain.surfaceYAt(item.x, item.z);
    addPlaza(inst, terrain, item.x, item.z, 8, 7, index % 2 ? 'plaza' : 'concrete');
    inst.addBox(item.x, ground + 0.8, item.z, 7, 1.2, 5.5, 'gatewayPurple');
    inst.addBox(item.x, ground + 3.2, item.z, 4.5, 3.6, 0.8, 'lampGlow');
    addSmallSign(inst, terrain, item.x - 3, item.z + 3, 'gatewayPurple');
  });
}


function addDistrictLabel(inst, terrain, cx, cz, width, key = 'gatewayPurple') {
  const ground = terrain.surfaceYAt(cx, cz);
  inst.addBox(cx, ground + 0.7, cz, width, 0.8, 2.2, key);
  inst.addBox(cx - width / 2 + 0.5, ground + 2.1, cz, 0.6, 2.8, 0.6, 'concreteDark');
  inst.addBox(cx + width / 2 - 0.5, ground + 2.1, cz, 0.6, 2.8, 0.6, 'concreteDark');
}

function addMosqueMarker(inst, terrain, cx, cz, scale = 1) {
  const ground = terrain.surfaceYAt(cx, cz);
  inst.addBox(cx, ground + 2.4 * scale, cz, 9 * scale, 4.8 * scale, 6 * scale, 'mosqueWhite');
  inst.addBox(cx, ground + 5.4 * scale, cz, 7 * scale, 1.8 * scale, 7 * scale, 'mosqueBlue');
  inst.addBox(cx - 6 * scale, ground + 6 * scale, cz + 2 * scale, 1.1 * scale, 10 * scale, 1.1 * scale, 'mosqueWhite');
}

function addMallMarker(inst, terrain, cx, cz, key = 'mallGold') {
  const ground = terrain.surfaceYAt(cx, cz);
  inst.addBox(cx, ground + 4, cz, 18, 8, 12, key);
  inst.addBox(cx, ground + 8.8, cz, 20, 1.2, 14, 'concreteDark');
  inst.addBox(cx - 6, ground + 4.2, cz - 6.1, 4, 2.4, 0.4, 'glassDark');
  inst.addBox(cx + 5, ground + 4.2, cz - 6.1, 4, 2.4, 0.4, 'glassDark');
}

function addHillMarker(inst, terrain, cx, cz, key = 'treeLeaf') {
  const ground = terrain.surfaceYAt(cx, cz);
  for (let i = 0; i < 5; i += 1) {
    inst.addBox(cx + (i - 2) * 4, ground + 1 + i * 0.8, cz + i * 2, 14 - i * 1.6, 2 + i * 0.8, 10 - i, i % 2 ? key : 'grassDark');
  }
  addPalmTree(inst, terrain, cx - 7, cz - 4, 5);
  addPalmTree(inst, terrain, cx + 8, cz + 6, 4.5);
}

function addFoodMarker(inst, terrain, cx, cz) {
  addMarketStalls(inst, terrain, cx, cz, 12, 'marketRed');
  const ground = terrain.surfaceYAt(cx, cz);
  for (let i = -8; i <= 8; i += 4) {
    inst.addBox(cx + i, ground + 4, cz - 8, 0.45, 5.2, 0.45, 'concreteDark');
    inst.addBox(cx + i, ground + 6.8, cz - 8, 1.4, 0.7, 1.4, 'lampGlow');
  }
}

function addGatewayMarker(inst, terrain, cx, cz, index) {
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 18, 14, index % 2 ? 'plaza' : 'concrete');
  inst.addBox(cx, ground + 1.4, cz, 14, 2.2, 9, 'gatewayPurple');
  inst.addBox(cx, ground + 5, cz, 7, 7, 1.4, 'lampGlow');
  inst.addBox(cx, ground + 8.8, cz, 4, 2, 4, index % 2 ? 'templeGold' : 'glassGreen');
  addDistrictLabel(inst, terrain, cx, cz + 9, 12, 'gatewayPurple');
}

function addSatelliteLandmark(inst, terrain, item, index) {
  addPlaza(inst, terrain, item.x, item.z, item.category === 'gateway' ? 18 : 22, item.category === 'gateway' ? 14 : 18, index % 2 ? 'plaza' : 'parkPath');
  if (item.category === 'gateway') {
    addGatewayMarker(inst, terrain, item.x, item.z, index);
  } else if (['nature', 'excursion', 'viewpoint'].includes(item.category)) {
    addHillMarker(inst, terrain, item.x, item.z, item.category === 'excursion' ? 'caveLimestone' : 'treeLeaf');
    if (item.name.includes('Putrajaya')) {
      for (let x = item.x - 12; x <= item.x + 12; x += 1) {
        for (let z = item.z + 10; z <= item.z + 18; z += 1) addRoadTile(inst, terrain, x, z, 1, 1, 'water');
      }
      addMosqueMarker(inst, terrain, item.x - 8, item.z - 4, 1.15);
    }
  } else if (['food', 'market'].includes(item.category)) {
    addFoodMarker(inst, terrain, item.x, item.z);
  } else if (['shopping', 'family', 'modern'].includes(item.category)) {
    addMallMarker(inst, terrain, item.x, item.z, item.category === 'family' ? 'pavilionRed' : 'mallGold');
  } else if (['culture', 'heritage'].includes(item.category)) {
    addMosqueMarker(inst, terrain, item.x, item.z, item.name.includes('Blue Mosque') ? 1.3 : 1);
  } else {
    addGenericBuilding(inst, terrain, item.x - 6, item.z - 5, 12, 10, 22, 'glassGreen', 'glassDark');
  }
  addDistrictLabel(inst, terrain, item.x, item.z - 12, Math.min(18, Math.max(8, item.name.length * 0.36)), item.category === 'gateway' ? 'gatewayPurple' : 'warning');
}


function addTourismPin(inst, terrain, item, index) {
  const ground = terrain.surfaceYAt(item.x, item.z);
  const colorByCategory = {
    skyline: 'merdekaTrim',
    viewpoint: 'lampGlow',
    heritage: 'redBrick',
    culture: 'templeGold',
    museum: 'museumBrown',
    market: 'marketRed',
    food: 'warning',
    shopping: 'mallGold',
    family: 'pavilionRed',
    park: 'treeLeaf2',
    nature: 'treeLeaf',
    excursion: 'caveLimestone',
    transit: 'station',
    modern: 'glassGreen',
    sports: 'stationRoof',
    gateway: 'gatewayPurple'
  };
  const key = colorByCategory[item.category] ?? 'warning';
  const size = item.category === 'gateway' ? 3.2 : item.category === 'skyline' ? 2.8 : 2.4;
  inst.addBox(item.x, ground + 0.16, item.z, 7.4, 0.24, 7.4, index % 2 ? 'plaza' : 'concrete');
  inst.addBox(item.x, ground + 2.1, item.z, 0.5, 4.1, 0.5, 'concreteDark');
  inst.addBox(item.x, ground + 4.5, item.z, size, size, size, key);
  inst.addBox(item.x, ground + 6.2, item.z, Math.max(2.1, size * 0.7), 0.45, Math.max(2.1, size * 0.7), 'lampGlow');
  if (index % 3 === 0) {
    inst.addBox(item.x - 3.2, ground + 1.2, item.z + 3.1, 1.2, 2.4, 1.2, key);
    inst.addBox(item.x + 3.1, ground + 1.2, item.z - 3.2, 1.2, 2.4, 1.2, key);
  }
}

function addAllLandmarkPins(inst, terrain) {
  tourismLandmarks.forEach((item, index) => {
    const isMajorIcon = [
      'Petronas Twin Towers',
      'Merdeka 118',
      'KL Tower',
      'Sultan Abdul Samad Building',
      'Masjid Negara',
      'Tugu Negara',
      'TRX Exchange 106',
      'Bukit Bintang',
      'Central Market',
      'Old Railway Station',
      'Thean Hou Temple',
      'National Museum'
    ].includes(item.name);
    if (isMajorIcon) return;
    addTourismPin(inst, terrain, item, index);
  });
}

function addRegionSpines(inst, terrain) {
  const spines = [
    ['Sunway Lagoon & Pyramid', 'SS15 Food Street', 'PJ Old Town', 'Section 17 Market', 'TTDI Market', 'Mutiara Damansara Curve'],
    ['Shah Alam Blue Mosque', 'i-City Shah Alam', 'Setia City Park', 'Klang Little India', 'Pulau Ketam Ferry Gate', 'Morib Beach Gateway'],
    ['Mines Lake', 'IOI City Mall', 'Putrajaya Pink Mosque', 'Putrajaya Bridge Promenade', 'Dengkil Kampung Food', 'KLIA Terminal Gateway'],
    ['Titiwangsa Lake Gardens', 'Setapak Food Quarter', 'Wangsa Maju Town Centre', 'Batu Caves Temple Steps', 'Gombak Transit Gate', 'Kanching Falls', 'Rawang Waterfall Gate'],
    ['Mont Kiara Dining Cluster', 'Kepong Food Row', 'Sungai Buloh Nursery Belt', 'Elmina Rainbow Bridge', 'Kuala Selangor Fireflies', 'Sasaran Sky Mirror Gate'],
    ['Ampang Korean Village', 'Ulu Klang Ridge Trail', 'Melawati Food & Hills', 'Janda Baik Gateway', 'Bukit Tinggi Village Gate']
  ];
  spines.map((names) => names.map((name) => landmarkPoint(name, { x: 0, z: 0 }))).forEach((points, spineIndex) => {
    for (let i = 0; i < points.length - 1; i += 1) {
      addRoadLine(inst, terrain, points[i], points[i + 1], spineIndex % 2 ? 3 : 5);
    }
  });
}

function addOuterRoads(inst, terrain) {
  const horizontals = [-170, -128, -88, -38, 12, 52, 92, 138, 178];
  const verticals = [-188, -148, -108, -62, -18, 38, 88, 132, 176];
  horizontals.forEach((z, index) => addRoadLine(inst, terrain, { x: -208, z }, { x: 208, z }, index % 3 === 0 ? 5 : 3));
  verticals.forEach((x, index) => addRoadLine(inst, terrain, { x, z: -208 }, { x, z: 208 }, index % 3 === 0 ? 5 : 3));
  addRoadLine(inst, terrain, landmarkPoint('Kuala Selangor Fireflies', { x: -204, z: 152 }), landmarkPoint('Damansara Arts & Cafes', { x: -148, z: 42 }), 5);
  addRoadLine(inst, terrain, landmarkPoint('Damansara Arts & Cafes', { x: -148, z: 42 }), landmarkPoint('Mid Valley Megamall', { x: -82, z: -88 }), 5);
  addRoadLine(inst, terrain, landmarkPoint('Mid Valley Megamall', { x: -82, z: -88 }), landmarkPoint('Kajang Satay Town', { x: 68, z: -184 }), 5);
  addRoadLine(inst, terrain, landmarkPoint('Kajang Satay Town', { x: 68, z: -184 }), landmarkPoint('KLIA Terminal Gateway', { x: 198, z: -106 }), 5);
  addRoadLine(inst, terrain, landmarkPoint('Ampang Lookout Ridge', { x: 126, z: 18 }), landmarkPoint('Genting Highlands Gateway', { x: 148, z: 162 }), 5);
}

function addOuterDistrictExpansion(inst, terrain) {
  addOuterRoads(inst, terrain);
  addRegionSpines(inst, terrain);

  tourismLandmarks
    .filter((item) => Math.abs(item.x) > 96 || Math.abs(item.z) > 96 || item.category === 'gateway')
    .forEach((item, index) => addSatelliteLandmark(inst, terrain, item, index));

  const random = mulberry32(20260426);
  const clusters = [
    { ...landmarkPoint('Sunway Lagoon & Pyramid', { x: -156, z: -126 }), radius: 34, count: 34, key: 'glassGreen' },
    { ...landmarkPoint('Shah Alam Blue Mosque', { x: -184, z: -38 }), radius: 30, count: 24, key: 'concreteDark' },
    { ...landmarkPoint('Mont Kiara Dining Cluster', { x: -92, z: 92 }), radius: 32, count: 28, key: 'blackGlass' },
    { ...landmarkPoint('Putrajaya Lake & Mosque', { x: 132, z: -136 }), radius: 42, count: 34, key: 'mosqueWhite' },
    { ...landmarkPoint('Cyberjaya Tech Garden', { x: 114, z: -168 }), radius: 34, count: 26, key: 'glass' },
    { ...landmarkPoint('Zoo Negara', { x: 142, z: 68 }), radius: 30, count: 20, key: 'parkPath' },
    { ...landmarkPoint('Taman Negara Gateway', { x: 188, z: 12 }), radius: 55, count: 42, key: 'gatewayPurple' },
    { ...landmarkPoint('Klang Royal Town', { x: -204, z: -88 }), radius: 26, count: 18, key: 'redBrick' }
  ].map((cluster) => ({ ...cluster, cx: cluster.x, cz: cluster.z }));

  clusters.forEach((cluster) => {
    for (let i = 0; i < cluster.count; i += 1) {
      const angle = random() * Math.PI * 2;
      const r = Math.sqrt(random()) * cluster.radius;
      const x = Math.round(cluster.cx + Math.cos(angle) * r);
      const z = Math.round(cluster.cz + Math.sin(angle) * r);
      if (Math.abs(x) > 214 || Math.abs(z) > 214) continue;
      if (isNearAny(x, z, tourismLandmarks, 10)) continue;
      const w = rangeInt(random, 4, 9);
      const d = rangeInt(random, 4, 9);
      const h = rangeInt(random, 7, cluster.key === 'blackGlass' || cluster.key === 'glass' ? 34 : 20);
      addGenericBuilding(inst, terrain, x, z, w, d, h, cluster.key, cluster.key === 'blackGlass' ? 'glass' : 'glassDark');
    }
  });

  for (let x = -208; x <= 208; x += 24) {
    addPalmTree(inst, terrain, x, 204, 4.5);
    addPalmTree(inst, terrain, x, -204, 4.2);
  }
  for (let z = -180; z <= 180; z += 28) {
    addPalmTree(inst, terrain, -210, z, 4);
    addPalmTree(inst, terrain, 210, z, 4);
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
  addTransitLine(inst, terrain, 'x', -128, -198, 178, 14.8);
  addTransitLine(inst, terrain, 'z', 132, -188, 172, 15.5);
  addTransitLine(inst, terrain, 'x', 92, -204, 188, 15.0);
  ['Petaling Street / Chinatown', 'LRT / MRT Hub', 'KL Tower', 'Old Railway Station'].forEach((name) => {
    const { x, z } = landmarkPoint(name, { x: 0, z: 0 });
    addStation(inst, terrain, x, z);
  });
  ['Sunway Lagoon & Pyramid', 'Shah Alam Blue Mosque', 'Mont Kiara Dining Cluster', 'Putrajaya Lake & Mosque', 'Cyberjaya Tech Garden', 'Zoo Negara', 'Penang George Town Gateway', 'Sepang / KLIA Gateway'].forEach((name) => {
    const { x, z } = landmarkPoint(name, { x: 188, z: 92 });
    addStation(inst, terrain, x, z, 'gatewayPurple');
  });
}

export function createKualaLumpurWorld(scene) {
  scene.background = new THREE.Color(0x07101f);
  scene.fog = new THREE.Fog(0x07101f, 170, 620);

  const inst = new VoxelInstancer(scene, { castShadow: false, receiveShadow: true });
  const terrain = inst.withSection('terrain', () => createTerrain(inst));
  const addSection = (name, callback) => inst.withSection(name, callback);

  addSection('parksAndWater', () => addParksAndWater(inst, terrain));
  addSection('outerDistrictExpansion', () => addOuterDistrictExpansion(inst, terrain));
  addSection('roads', () => addRoads(inst, terrain));
  addSection('transit', () => addTransit(inst, terrain));
  addSection('streetDetails', () => addStreetDetails(inst, terrain));
  addSection('tourismExpansion', () => addTourismExpansion(inst, terrain));
  addSection('cityBuildings', () => addCityBuildings(inst, terrain));
  addSection('landmarkPins', () => addAllLandmarkPins(inst, terrain));
  addSection('petronas', () => addPetronas(inst, terrain));
  addSection('merdeka118', () => addMerdeka118(inst, terrain));
  addSection('klTower', () => addKLTower(inst, terrain));
  addSection('sultanAbdulSamad', () => addSultanAbdulSamad(inst, terrain));
  addSection('nationalMosque', () => addNationalMosque(inst, terrain));
  addSection('nationalMonument', () => addNationalMonument(inst, terrain));
  addSection('exchange106', () => addExchange106(inst, terrain));
  addSection('bukitBintang', () => addBukitBintang(inst, terrain));
  addSection('centralMarket', () => addCentralMarket(inst, terrain));
  addSection('railwayStation', () => addRailwayStation(inst, terrain));
  addSection('theanHouTemple', () => addTheanHouTemple(inst, terrain));
  addSection('nationalMuseum', () => addNationalMuseum(inst, terrain));

  const sunDisc = new THREE.Mesh(
    new THREE.SphereGeometry(6, 16, 8),
    new THREE.MeshBasicMaterial({ color: 0xffe4aa })
  );
  sunDisc.position.set(-82, 92, -110);
  scene.add(sunDisc);

  const stats = inst.finalize();

  const landmarks = tourismLandmarks.map((item) => ({
    ...item,
    position: new THREE.Vector3(item.x, terrain.surfaceYAt(item.x, item.z) + (item.category === 'gateway' ? 2 : 4), item.z),
    visitRadius: item.category === 'gateway' ? 9 : 10
  }));

  const transportPaths = [
    {
      name: 'Kelana Jaya inspired elevated line',
      label: 'LRT',
      stations: ['Subang Gateway', 'Pasar Seni', 'KLCC', 'Bukit Bintang Link', 'KL Tower', 'Ampang Park'],
      points: [
        landmarkVector('Subang Airport Heritage Strip', 14.4, { x: -82, z: -8 }),
        landmarkVector('Central Market', 14.4, { x: -48, z: -8 }),
        landmarkVector('Petronas Twin Towers', 14.4, { x: -12, z: -8 }),
        landmarkVector('Bukit Bintang', 17.0, { x: 18, z: 22 }),
        landmarkVector('KL Tower', 14.4, { x: 54, z: -8 }),
        landmarkVector('Ampang Korean Village', 14.4, { x: 84, z: -8 })
      ],
      color: 'blue'
    },
    {
      name: 'Monorail inspired north-south line',
      label: 'Monorail',
      stations: ['KL Sentral', 'Imbi', 'Bukit Bintang', 'Titiwangsa'],
      points: [
        landmarkVector('National Museum', 17.0, { x: 18, z: -72 }),
        landmarkVector('Jalan Alor', 17.0, { x: 18, z: -28 }),
        landmarkVector('Bukit Bintang', 17.0, { x: 18, z: 22 }),
        landmarkVector('Titiwangsa Lake Gardens', 17.0, { x: 18, z: 72 })
      ],
      color: 'yellow'
    },
    {
      name: 'MRT heritage loop',
      label: 'MRT',
      stations: ['National Museum', 'Merdeka', 'TRX', 'KLCC Park'],
      points: [
        landmarkVector('National Museum', 14.4, { x: -58, z: -66 }),
        landmarkVector('Merdeka 118', 14.4, { x: -18, z: -42 }),
        landmarkVector('TRX Exchange 106', 14.4, { x: 66, z: 32 }),
        landmarkVector('Petronas Twin Towers', 14.4, { x: -12, z: 22 }),
        landmarkVector('KLCC Park', 14.4, { x: -25, z: 43 })
      ],
      color: 'green'
    },
    {
      name: 'KTM tourism gateway',
      label: 'KTM',
      stations: ['Old Railway Station', 'Batu Caves Gateway', 'Malaysia Highlights'],
      points: [
        landmarkVector('Old Railway Station', 14.4, { x: -36, z: -58 }),
        landmarkVector('LRT / MRT Hub', 16, { x: 18, z: 22 }),
        landmarkVector('Batu Caves Gateway', 14.4, { x: 82, z: 68 }),
        landmarkVector('Putrajaya Lake & Mosque', 15.5, { x: 132, z: -136 }),
        landmarkVector('Sepang / KLIA Gateway', 15.5, { x: 188, z: -82 })
      ],
      color: 'purple'
    },
    {
      name: 'Greater KL outer ring',
      label: 'BRT',
      stations: ['Mont Kiara', 'FRIM', 'Kuala Selangor', 'Shah Alam', 'Sunway', 'Bangsar', 'Kajang', 'Putrajaya', 'Zoo Negara', 'Genting Base'],
      points: [
        landmarkVector('Mont Kiara Dining Cluster', 15.2, { x: -92, z: 92 }),
        landmarkVector('FRIM Forest Reserve', 15.2, { x: -138, z: 128 }),
        landmarkVector('Kuala Selangor Fireflies', 15.2, { x: -204, z: 152 }),
        landmarkVector('Shah Alam Blue Mosque', 15.2, { x: -184, z: -38 }),
        landmarkVector('Sunway Lagoon & Pyramid', 15.2, { x: -156, z: -126 }),
        landmarkVector('Bangsar Village', 15.2, { x: -94, z: -108 }),
        landmarkVector('Kajang Satay Town', 15.2, { x: 68, z: -184 }),
        landmarkVector('Putrajaya Lake & Mosque', 15.2, { x: 132, z: -136 }),
        landmarkVector('Zoo Negara', 15.2, { x: 142, z: 68 }),
        landmarkVector('Genting Highlands Gateway', 15.2, { x: 148, z: 162 })
      ],
      color: 'green'
    },

    ,
    {
      name: 'PJ Subang Sunway connector',
      label: 'Rapid',
      stations: ['TTDI', 'Bandar Utama', 'PJ Old Town', 'SS15', 'Sunway', 'USJ', 'Puchong'],
      points: [
        landmarkVector('TTDI Market', 15.2, { x: -126, z: 22 }),
        landmarkVector('1 Utama & Bandar Utama', 15.2, { x: -156, z: 12 }),
        landmarkVector('PJ Old Town', 15.2, { x: -122, z: -62 }),
        landmarkVector('SS15 Food Street', 15.2, { x: -136, z: -92 }),
        landmarkVector('Sunway Lagoon & Pyramid', 15.2, { x: -156, z: -126 }),
        landmarkVector('USJ Taipan', 15.2, { x: -126, z: -116 }),
        landmarkVector('Puchong IOI Boulevard', 15.2, { x: -78, z: -150 })
      ],
      color: 'blue'
    },
    {
      name: 'Shah Alam Klang coast connector',
      label: 'Coast',
      stations: ['Shah Alam', 'i-City', 'Klang Little India', 'Port Klang', 'Pulau Ketam Ferry', 'Morib Gate'],
      points: [
        landmarkVector('Shah Alam Blue Mosque', 15.2, { x: -184, z: -38 }),
        landmarkVector('i-City Shah Alam', 15.2, { x: -176, z: -8 }),
        landmarkVector('Klang Little India', 15.2, { x: -198, z: -72 }),
        landmarkVector('Port Klang Coastal Gate', 15.2, { x: -210, z: -150 }),
        landmarkVector('Pulau Ketam Ferry Gate', 15.2, { x: -210, z: -126 }),
        landmarkVector('Morib Beach Gateway', 15.2, { x: -186, z: -198 })
      ],
      color: 'purple'
    },
    {
      name: 'Putrajaya KLIA south connector',
      label: 'ERL',
      stations: ['Mines Lake', 'IOI City', 'Putrajaya Mosque', 'Cyberjaya', 'Sepang Circuit', 'KLIA', 'Nilai'],
      points: [
        landmarkVector('Mines Lake', 15.2, { x: 24, z: -150 }),
        landmarkVector('IOI City Mall', 15.2, { x: 88, z: -144 }),
        landmarkVector('Putrajaya Pink Mosque', 15.2, { x: 124, z: -126 }),
        landmarkVector('Cyberjaya Tech Garden', 15.2, { x: 114, z: -168 }),
        landmarkVector('Sepang Circuit', 15.2, { x: 176, z: -116 }),
        landmarkVector('KLIA Terminal Gateway', 15.2, { x: 198, z: -106 }),
        landmarkVector('Nilai Outlet Corridor', 15.2, { x: 134, z: -206 })
      ],
      color: 'yellow'
    },
    {
      name: 'North east nature connector',
      label: 'Green',
      stations: ['Titiwangsa', 'Setapak', 'Wangsa Maju', 'Batu Caves', 'Gombak', 'Kanching', 'Rawang Falls'],
      points: [
        landmarkVector('Titiwangsa Lake Gardens', 15.2, { x: 8, z: 82 }),
        landmarkVector('Setapak Food Quarter', 15.2, { x: 52, z: 62 }),
        landmarkVector('Wangsa Maju Town Centre', 15.2, { x: 76, z: 78 }),
        landmarkVector('Batu Caves Temple Steps', 15.2, { x: 88, z: 92 }),
        landmarkVector('Gombak Transit Gate', 15.2, { x: 104, z: 112 }),
        landmarkVector('Kanching Falls', 15.2, { x: 18, z: 176 }),
        landmarkVector('Rawang Waterfall Gate', 15.2, { x: -28, z: 206 })
      ],
      color: 'green'
    },
    {
      name: 'Malaysia gateway spine',
      label: 'Tour',
      stations: ['Penang Gate', 'Langkawi Gate', 'Malacca Gate', 'Cameron Gate', 'Taman Negara Gate', 'Kinabalu Gate', 'Perhentian Gate', 'Putrajaya Gate', 'KLIA Gate'],
      points: [
        landmarkVector('Penang George Town Gateway', 15.0, { x: 188, z: 92 }),
        landmarkVector('Langkawi Gateway', 15.0, { x: 188, z: 72 }),
        landmarkVector('Malacca Gateway', 15.0, { x: 188, z: 52 }),
        landmarkVector('Cameron Highlands Gateway', 15.0, { x: 188, z: 32 }),
        landmarkVector('Taman Negara Gateway', 15.0, { x: 188, z: 12 }),
        landmarkVector('Kinabalu Gateway', 15.0, { x: 188, z: -8 }),
        landmarkVector('Perhentian Islands Gateway', 15.0, { x: 188, z: -28 }),
        landmarkVector('Putrajaya Gateway', 15.0, { x: 188, z: -58 }),
        landmarkVector('Sepang / KLIA Gateway', 15.0, { x: 188, z: -82 })
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
    chunkManager: stats.chunkManager,
    startPosition: new THREE.Vector3(-38, terrain.surfaceYAt(-38, 8) + 0.1, 8)
  };
}
