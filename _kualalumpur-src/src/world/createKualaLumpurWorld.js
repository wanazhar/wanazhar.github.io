import * as THREE from 'three';
import { VoxelInstancer, VOXEL_PALETTE } from './VoxelInstancer.js';
import { fbm, hash2, clamp } from '../utils/noise.js';
import { tourismLandmarks } from '../data/tourismContent.js';
import { CollisionMap } from './layout/collision.js';
import { blockGroundKey, createBlockPlan, fillCityBlocks } from './layout/cityBlocks.js';
import {
  BLOCK_PITCH,
  CITY_BLOCK_MAX,
  CITY_BLOCK_MIN,
  CITY_EXTENT,
  HALF_STREET,
  blockIndexAt,
  cellZone,
  isCityCoord,
  isStreetCoord,
  mod
} from './layout/streetGrid.js';

const MAP_MIN = -220;
const MAP_MAX = 220;
const MAP_SIZE = MAP_MAX - MAP_MIN + 1;
const CITY_GROUND = 4;
const landmarkByName = new Map(tourismLandmarks.map((item) => [item.name, item]));

function landmarkPoint(name, fallback) {
  const item = landmarkByName.get(name);
  return item ? { x: item.x, z: item.z } : fallback;
}

function transitVector(terrain, name, fallback) {
  const point = landmarkPoint(name, fallback);
  return new THREE.Vector3(
    point.x,
    terrain.surfaceYAt(point.x, point.z) + TRANSIT_CLEARANCE + TRANSIT_RIDE_OFFSET,
    point.z
  );
}

function mapKey(x, z) {
  return `${x},${z}`;
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

const PETRONAS_GAP = 40;
const PETRONAS_SEGMENTS = [
  { from: 0, to: 24, radius: 5.5 },
  { from: 24, to: 52, radius: 5 },
  { from: 52, to: 78, radius: 4.5 },
  { from: 78, to: 96, radius: 4 },
  { from: 96, to: 112, radius: 3.2 }
];
const PETRONAS_SHAFT = 112;

function addPetronasTower(inst, ground, cx, cz) {
  PETRONAS_SEGMENTS.forEach((segment) => {
    const radius = segment.radius;
    const height = segment.to - segment.from;

    for (let y = segment.from; y < segment.to; y += 2) {
      const y0 = ground + y + 1;
      inst.addBox(cx, y0, cz, radius * 2, 2, radius * 2, 'glass');
      inst.addBox(cx, y0 + 1.04, cz, radius * 2 + 0.5, 0.16, radius * 2 + 0.5, 'petronasTrim');
    }

    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
      inst.addBox(cx + sx * (radius - 0.5), ground + segment.from + height / 2, cz + sz * (radius - 0.5), 1.4, height, 1.4, 'petronasTrim');
    });

    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([sx, sz]) => {
      const alongX = sx === 0;
      inst.addBox(
        cx + sx * (radius + 0.08),
        ground + segment.from + height / 2,
        cz + sz * (radius + 0.08),
        alongX ? radius * 1.5 : 0.3,
        height,
        alongX ? 0.3 : radius * 1.5,
        'silver'
      );
    });
  });

  inst.addBox(cx, ground + PETRONAS_SHAFT + 1.6, cz, 4.8, 3.2, 4.8, 'petronasTrim');
  for (let i = 0; i < 12; i += 1) {
    const width = Math.max(0.8, 3.4 - i * 0.22);
    inst.addBox(cx, ground + PETRONAS_SHAFT + 3.6 + i * 2.4, cz, width, 2.4, width, i % 2 ? 'silver' : 'petronasTrim');
  }
  inst.addBox(cx, ground + PETRONAS_SHAFT + 34, cz, 0.6, 10, 0.6, 'silver');
  inst.addBox(cx, ground + PETRONAS_SHAFT + 39.6, cz, 1, 1, 1, 'warning');
}

function addFountain(inst, terrain, cx, cz) {
  const ground = terrain.surfaceYAt(cx, cz);
  for (let x = -7; x <= 7; x += 1) {
    for (let z = -7; z <= 7; z += 1) {
      const distance = Math.hypot(x, z);
      if (distance > 7) continue;
      if (distance > 5.4) {
        inst.addBox(cx + x, ground + 0.4, cz + z, 1, 0.8, 1, 'plaza');
      } else if (distance > 4.2) {
        inst.addBox(cx + x, ground + 0.22, cz + z, 1, 0.24, 1, 'water');
      }
    }
  }
  inst.addBox(cx, ground + 1.7, cz, 2.6, 1.8, 2.6, 'concrete');
  inst.addBox(cx, ground + 3.8, cz, 0.9, 3.2, 0.9, 'silver');
  inst.addBox(cx, ground + 5.8, cz, 1.8, 0.8, 1.8, 'water');
}

function addPetronas(inst, terrain) {
  const { x: cx, z: cz } = landmarkPoint('Petronas Twin Towers', { x: -12, z: 22 });
  const ground = terrain.surfaceYAt(cx, cz);
  const left = cx - PETRONAS_GAP / 2;
  const right = cx + PETRONAS_GAP / 2;

  addPlaza(inst, terrain, cx, cz, 78, 52, 'plaza');
  addPetronasTower(inst, ground, left, cz);
  addPetronasTower(inst, ground, right, cz);

  const bridgeY = ground + 54;
  const span = PETRONAS_GAP - 9;
  inst.addBox(cx, bridgeY + 1.6, cz, span, 3.2, 4.8, 'glass');
  inst.addBox(cx, bridgeY - 1.8, cz, span, 0.7, 5.6, 'petronasTrim');
  inst.addBox(cx, bridgeY + 3.4, cz, span + 1.2, 0.5, 5.8, 'petronasTrim');
  [-1, 1].forEach((side) => {
    inst.addBox(cx + side * (span / 2 - 1.5), bridgeY - 0.2, cz, 1.2, 3.4, 3.6, 'silver');
  });

  inst.addBox(cx, ground + 4.5, cz + 22, 50, 9, 14, 'concrete');
  inst.addBox(cx, ground + 9.2, cz + 22, 52, 0.9, 15, 'petronasTrim');
  inst.addBox(cx, ground + 5, cz + 22, 44, 5, 10, 'glass');
  inst.addBox(cx, ground + 8.6, cz + 22, 12, 4, 7, 'petronasTrim');

  const park = landmarkPoint('KLCC Park', { x: cx - 13, z: cz + 21 });
  addFountain(inst, terrain, park.x, park.z);
  [[-22, 12], [22, 12], [-22, -10], [22, -10]].forEach(([ox, oz]) => addPalmTree(inst, terrain, cx + ox, cz + oz, 4.6));
}

function addMerdeka118(inst, terrain) {
  const { x: cx, z: cz } = landmarkPoint('Merdeka 118', { x: 35, z: 18 });
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 34, 30, 'plaza');

  const shaft = 104;
  for (let y = 0; y < shaft; y += 3) {
    const t = y / shaft;
    const w = 13 - t * 6.4;
    const d = 11 - t * 4.6;
    const offsetX = Math.sin(t * Math.PI * 2) * 1.1;
    const offsetZ = Math.cos(t * Math.PI * 2) * 0.9;
    inst.addBox(cx + offsetX, ground + y + 1.5, cz + offsetZ, w, 3, d, 'merdekaGlass');
    if (y % 9 === 0) {
      inst.addBox(cx + offsetX, ground + y + 1.55, cz + offsetZ, w + 0.6, 0.35, d + 0.6, 'merdekaTrim');
    }
    [-1, 1].forEach((side) => {
      inst.addBox(cx + offsetX + side * (w / 2 + 0.14), ground + y + 1.5, cz + offsetZ, 0.28, 3, d * 0.82, 'blackGlass');
      inst.addBox(cx + offsetX, ground + y + 1.5, cz + offsetZ + side * (d / 2 + 0.14), w * 0.82, 3, 0.28, 'blackGlass');
    });
  }

  inst.addBox(cx, ground + shaft + 2, cz, 3.8, 4, 3.8, 'merdekaTrim');
  for (let i = 0; i < 6; i += 1) {
    const width = Math.max(0.9, 3 - i * 0.42);
    inst.addBox(cx, ground + shaft + 5 + i * 2.6, cz, width, 2.6, width, i % 2 ? 'silver' : 'merdekaTrim');
  }
  inst.addBox(cx, ground + shaft + 22, cz, 1.2, 12, 1.2, 'merdekaTrim');
  inst.addBox(cx, ground + shaft + 29.5, cz, 0.5, 7, 0.5, 'silver');
  inst.addBox(cx, ground + shaft + 34, cz, 1.1, 1.1, 1.1, 'warning');
}

function addKLTower(inst, terrain) {
  const { x: cx, z: cz } = landmarkPoint('KL Tower', { x: 58, z: -25 });
  const ground = terrain.surfaceYAt(cx, cz);
  addPlaza(inst, terrain, cx, cz, 26, 24, 'parkPath');
  [[-9, -7], [9, -7], [-9, 7], [9, 7], [0, -10], [0, 10]].forEach(([ox, oz]) => addPalmTree(inst, terrain, cx + ox, cz + oz, 5));

  inst.addBox(cx, ground + 2, cz, 9, 4, 9, 'concrete');
  inst.addBox(cx, ground + 4.4, cz, 7, 1.2, 7, 'concreteDark');
  for (let i = 0; i < 22; i += 1) {
    const width = 3.6 - i * 0.06;
    const key = i % 6 === 5 ? 'klTowerRed' : 'klTowerWhite';
    inst.addBox(cx, ground + 5 + i * 2.6, cz, width, 2.6, width, key);
  }

  const podY = ground + 62;
  inst.addBox(cx, podY, cz, 13, 5, 13, 'klTowerWhite');
  inst.addBox(cx, podY + 0.2, cz, 15, 2.4, 8, 'glassGreen');
  inst.addBox(cx, podY + 0.2, cz, 8, 2.4, 15, 'glassGreen');
  inst.addBox(cx, podY + 3.4, cz, 11, 1.6, 11, 'klTowerRed');
  inst.addBox(cx, podY + 5.6, cz, 7, 3, 7, 'klTowerWhite');
  inst.addBox(cx, podY + 14, cz, 1.6, 18, 1.6, 'klTowerWhite');
  inst.addBox(cx, podY + 24, cz, 0.7, 6, 0.7, 'klTowerRed');
  inst.addBox(cx, podY + 31, cz, 0.35, 8, 0.35, 'silver');
  inst.addBox(cx, podY + 35.5, cz, 0.9, 0.9, 0.9, 'warning');
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

const TRANSIT_CLEARANCE = 7;
const TRANSIT_PIER_SPACING = 12;
const TRANSIT_RIDE_OFFSET = 0.75;

function addTransitLine(inst, terrain, orientation, fixed, from, to, baseY = 0) {
  const start = Math.min(from, to);
  const end = Math.max(from, to);
  for (let s = start; s <= end; s += 2) {
    const x = orientation === 'x' ? s : fixed;
    const z = orientation === 'x' ? fixed : s;
    const ground = terrain.surfaceYAt(x, z);
    const deckY = Math.max(baseY, ground + TRANSIT_CLEARANCE);

    if (orientation === 'x') {
      inst.addBox(x + 0.5, deckY, z, 2.6, 0.5, 5.6, 'concrete');
      inst.addBox(x + 0.5, deckY - 0.65, z - 2.8, 2.6, 0.7, 0.4, 'concreteDark');
      inst.addBox(x + 0.5, deckY - 0.65, z + 2.8, 2.6, 0.7, 0.4, 'concreteDark');
      inst.addBox(x + 0.5, deckY + 0.5, z - 1.3, 2.6, 0.3, 0.4, 'rail');
      inst.addBox(x + 0.5, deckY + 0.5, z + 1.3, 2.6, 0.3, 0.4, 'rail');
    } else {
      inst.addBox(x, deckY, z + 0.5, 5.6, 0.5, 2.6, 'concrete');
      inst.addBox(x - 2.8, deckY - 0.65, z + 0.5, 0.4, 0.7, 2.6, 'concreteDark');
      inst.addBox(x + 2.8, deckY - 0.65, z + 0.5, 0.4, 0.7, 2.6, 'concreteDark');
      inst.addBox(x - 1.3, deckY + 0.5, z + 0.5, 0.4, 0.3, 2.6, 'rail');
      inst.addBox(x + 1.3, deckY + 0.5, z + 0.5, 0.4, 0.3, 2.6, 'rail');
    }

    if ((s - start) % TRANSIT_PIER_SPACING === 0) {
      const columnHeight = deckY - 0.9 - ground;
      if (columnHeight > 0.6) {
        inst.addBox(x, ground + columnHeight / 2, z, 1.4, columnHeight, 1.4, 'concreteDark');
        if (orientation === 'x') {
          inst.addBox(x, deckY - 0.8, z, 2.4, 0.8, 6.4, 'concreteDark');
        } else {
          inst.addBox(x, deckY - 0.8, z, 6.4, 0.8, 2.4, 'concreteDark');
        }
      }
    }
  }
}

function addStation(inst, terrain, cx, cz, labelKey = 'station') {
  const ground = terrain.surfaceYAt(cx, cz);
  const deckY = ground + TRANSIT_CLEARANCE;
  inst.addBox(cx, deckY + 1.7, cz, 15, 3.4, 9, labelKey);
  inst.addBox(cx, deckY + 4, cz, 17, 1.2, 11, 'stationRoof');
  const columnHeight = deckY - 1.2 - ground;
  inst.addBox(cx - 6, ground + columnHeight / 2, cz - 3, 1.2, columnHeight, 1.2, 'concreteDark');
  inst.addBox(cx + 6, ground + columnHeight / 2, cz + 3, 1.2, columnHeight, 1.2, 'concreteDark');
  inst.addBox(cx, ground + 1.8, cz + 9, 9, 3.6, 3, 'station');
}

function addCityBuildings(inst, terrain, collision, blockPlan) {
  fillCityBlocks({ inst, terrain, collision, plan: blockPlan });
}

function streetSurfaceKey(x, z) {
  const localX = mod(x, BLOCK_PITCH);
  const localZ = mod(z, BLOCK_PITCH);
  const sidewalkX = localX === HALF_STREET - 1 || localX === BLOCK_PITCH - HALF_STREET;
  const sidewalkZ = localZ === HALF_STREET - 1 || localZ === BLOCK_PITCH - HALF_STREET;
  if (isStreetCoord(x) && isStreetCoord(z)) {
    return sidewalkX && sidewalkZ ? 'concrete' : 'road';
  }
  if (isStreetCoord(x)) return sidewalkX ? 'concrete' : 'road';
  if (isStreetCoord(z)) return sidewalkZ ? 'concrete' : 'road';
  return 'road';
}

function countryGroundKey(x, z, height) {
  const noise = hash2(x, z, 4477);
  if (height > 9) return noise > 0.5 ? 'stoneDark' : 'stone';
  if (noise < 0.1) return 'dirt';
  if (noise > 0.68) return 'grass2';
  if (noise < 0.34) return 'grassDark';
  return 'grass';
}

function createTerrain(inst, blockPlan) {
  const heights = new Map();
  for (let x = MAP_MIN; x <= MAP_MAX; x += 1) {
    for (let z = MAP_MIN; z <= MAP_MAX; z += 1) {
      const dist = Math.hypot(x * 0.78, z) / 100;
      const hills = fbm(x / 44, z / 44, 8808, 4) * 5.5 + fbm(x / 18, z / 18, 9020, 3) * 2.4;
      const raw = 2.4 + hills + dist * 4.5;
      const natural = clamp(Math.round(Math.floor(raw / 1.35) * 1.35), 0, 11);
      const edge = Math.max(Math.abs(x), Math.abs(z));
      if (edge <= CITY_EXTENT) {
        heights.set(mapKey(x, z), CITY_GROUND);
      } else if (edge <= CITY_EXTENT + 14) {
        const blend = (edge - CITY_EXTENT) / 14;
        heights.set(mapKey(x, z), Math.round(CITY_GROUND * (1 - blend) + natural * blend));
      } else {
        heights.set(mapKey(x, z), natural);
      }
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
      const zone = cellZone(x, z);
      let surfaceKey;
      if (zone === 'street') {
        surfaceKey = streetSurfaceKey(x, z);
      } else if (zone === 'block') {
        const entry = blockPlan.get(`${blockIndexAt(x)}_${blockIndexAt(z)}`);
        surfaceKey = blockGroundKey(entry);
      } else {
        surfaceKey = countryGroundKey(x, z, h);
      }
      inst.addVoxel(x, h, z, surfaceKey);

      const neighborMin = Math.min(
        heightAtCell(x - 1, z),
        heightAtCell(x + 1, z),
        heightAtCell(x, z - 1),
        heightAtCell(x, z + 1),
        x === MAP_MIN || x === MAP_MAX || z === MAP_MIN || z === MAP_MAX ? 0 : h
      );
      const subsurfaceKey = zone === 'country' ? 'clay' : 'dirt';
      for (let y = neighborMin + 1; y < h; y += 1) {
        inst.addVoxel(x, y, z, y > h - 3 ? 'dirt' : subsurfaceKey);
      }
      if (x === MAP_MIN || x === MAP_MAX || z === MAP_MIN || z === MAP_MAX) {
        for (let y = 0; y < h; y += 1) inst.addVoxel(x, y, z, y > h - 4 ? 'dirt' : 'stoneDark');
      }
    }
  }

  return terrain;
}

function addStreetMarkings(inst, terrain) {
  const lines = [];
  for (let k = CITY_BLOCK_MIN; k <= CITY_BLOCK_MAX + 1; k += 1) lines.push(k * BLOCK_PITCH);
  for (const line of lines) {
    for (let x = -CITY_EXTENT; x <= CITY_EXTENT; x += 6) {
      if (isStreetCoord(x)) continue;
      if (x % 12 === 0) {
        const y = terrain.surfaceYAt(x, line) + 0.06;
        inst.addBox(x + 0.5, y, line + 0.5, 3, 0.1, 0.34, 'lineWhite');
      }
      if (line % 24 === 0 && x % 24 === 0) {
        const y = terrain.surfaceYAt(x, line) + 0.07;
        inst.addBox(x + 0.5, y, line + 0.5, 5.4, 0.1, 0.5, 'lineWhite');
        inst.addBox(x + 0.5, y, line + 0.5, 0.5, 0.1, 5.4, 'lineWhite');
      }
    }
    for (let z = -CITY_EXTENT; z <= CITY_EXTENT; z += 6) {
      if (isStreetCoord(z)) continue;
      if (z % 12 === 0) {
        const y = terrain.surfaceYAt(line, z) + 0.06;
        inst.addBox(line + 0.5, y, z + 0.5, 0.34, 0.1, 3, 'lineWhite');
      }
    }
  }
}

function addIntersectionDetails(inst, terrain, collision) {
  const lines = [];
  for (let k = CITY_BLOCK_MIN; k <= CITY_BLOCK_MAX + 1; k += 1) lines.push(k * BLOCK_PITCH);
  for (const x of lines) {
    for (const z of lines) {
      const y = terrain.surfaceYAt(x, z);
      const corners = [[-3.4, -3.4], [2.6, -3.4], [-3.4, 2.6], [2.6, 2.6]];
      corners.forEach(([ox, oz], index) => {
        inst.addBox(x + ox, y + 2.2, z + oz, 0.3, 4.4, 0.3, 'concreteDark');
        inst.addBox(x + ox, y + 4.6, z + oz, 0.9, 0.4, 0.9, index % 2 ? 'warning' : 'lampGlow');
        collision.addRect(x + ox, z + oz, 1, 1);
      });
    }
  }
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
  const gap = CITY_EXTENT + 8;

  horizontals.forEach((z, index) => {
    const width = index % 3 === 0 ? 5 : 3;
    if (Math.abs(z) < gap) {
      addRoadLine(inst, terrain, { x: -208, z }, { x: -gap, z }, width);
      addRoadLine(inst, terrain, { x: gap, z }, { x: 208, z }, width);
    } else {
      addRoadLine(inst, terrain, { x: -208, z }, { x: 208, z }, width);
    }
  });
  verticals.forEach((x, index) => {
    const width = index % 3 === 0 ? 5 : 3;
    if (Math.abs(x) < gap) {
      addRoadLine(inst, terrain, { x, z: -208 }, { x, z: -gap }, width);
      addRoadLine(inst, terrain, { x, z: gap }, { x, z: 208 }, width);
    } else {
      addRoadLine(inst, terrain, { x, z: -208 }, { x, z: 208 }, width);
    }
  });
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

  for (let x = -208; x <= 208; x += 24) {
    addPalmTree(inst, terrain, x, 204, 4.5);
    addPalmTree(inst, terrain, x, -204, 4.2);
  }
  for (let z = -180; z <= 180; z += 28) {
    addPalmTree(inst, terrain, -210, z, 4);
    addPalmTree(inst, terrain, 210, z, 4);
  }
}

function addTransit(inst, terrain) {
  addTransitLine(inst, terrain, 'x', 0, -84, 86);
  addTransitLine(inst, terrain, 'z', 24, -75, 74);
  addTransitLine(inst, terrain, 'x', -120, -198, 178);
  addTransitLine(inst, terrain, 'z', 120, -188, 172);
  addTransitLine(inst, terrain, 'x', 96, -204, 188);
  ['Petaling Street / Chinatown', 'LRT / MRT Hub', 'KL Tower', 'Old Railway Station'].forEach((name) => {
    const { x, z } = landmarkPoint(name, { x: 0, z: 0 });
    addStation(inst, terrain, x, z);
  });
  ['Sunway Lagoon & Pyramid', 'Shah Alam Blue Mosque', 'Mont Kiara Dining Cluster', 'Putrajaya Lake & Mosque', 'Cyberjaya Tech Garden', 'Zoo Negara', 'Penang George Town Gateway', 'Sepang / KLIA Gateway'].forEach((name) => {
    const { x, z } = landmarkPoint(name, { x: 188, z: 92 });
    addStation(inst, terrain, x, z, 'gatewayPurple');
  });
}

const MAJOR_LANDMARKS = [
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
];

const LANDMARK_PLOTS = {
  'Petronas Twin Towers': {
    pad: 40,
    rects: [
      [-20, 0, 13, 13],
      [20, 0, 13, 13],
      [0, 22, 52, 16]
    ]
  },
  'Merdeka 118': { pad: 20, rects: [[0, 0, 16, 14]] },
  'KL Tower': { pad: 18, rects: [[0, 0, 6, 6]] },
  'Sultan Abdul Samad Building': { pad: 18, rects: [[0, 0, 58, 12]] },
  'Masjid Negara': { pad: 16, rects: [[0, 0, 26, 18]] },
  'Tugu Negara': { pad: 14, rects: [[0, 0, 20, 14]] },
  'TRX Exchange 106': { pad: 16, rects: [[0, 0, 14, 12]] },
  'Bukit Bintang': { pad: 16, rects: [[0, 0, 36, 18]] },
  'Central Market': { pad: 14, rects: [[0, 0, 24, 13]] },
  'Old Railway Station': { pad: 14, rects: [[0, 0, 28, 11]] },
  'Thean Hou Temple': { pad: 14, rects: [[0, 0, 22, 14]] },
  'National Museum': { pad: 14, rects: [[0, 0, 24, 14]] }
};

const LANDMARK_VIEW = {
  'Petronas Twin Towers': { distance: 185, height: 66 },
  'Merdeka 118': { distance: 175, height: 66 },
  'KL Tower': { distance: 140, height: 54 },
  'TRX Exchange 106': { distance: 140, height: 46 },
  'Sultan Abdul Samad Building': { distance: 95, height: 18 },
  'Masjid Negara': { distance: 85, height: 16 },
  'Tugu Negara': { distance: 70, height: 12 },
  'Bukit Bintang': { distance: 80, height: 14 },
  'Central Market': { distance: 70, height: 10 },
  'Old Railway Station': { distance: 70, height: 10 },
  'Thean Hou Temple': { distance: 75, height: 12 },
  'National Museum': { distance: 70, height: 10 }
};

function landmarkView(item) {
  return LANDMARK_VIEW[item.name] ?? { distance: item.category === 'gateway' ? 55 : 72, height: item.category === 'gateway' ? 8 : 12 };
}

function createPlotReservations() {
  return tourismLandmarks.map((item) => {
    const plot = LANDMARK_PLOTS[item.name];
    const pad = plot?.pad ?? (item.category === 'gateway' ? 6 : 7);
    const park = item.category === 'park' || item.name === 'KLCC Park';
    return {
      x0: item.x - pad,
      z0: item.z - pad,
      x1: item.x + pad,
      z1: item.z + pad,
      padding: 0,
      style: park ? 'park' : 'clear'
    };
  });
}

function registerLandmarkCollision(collision) {
  Object.entries(LANDMARK_PLOTS).forEach(([name, plot]) => {
    const point = landmarkPoint(name, null);
    if (!point) return;
    plot.rects.forEach(([offsetX, offsetZ, width, depth]) => {
      collision.addRect(point.x + offsetX - width / 2, point.z + offsetZ - depth / 2, width, depth);
    });
  });
}

export function createKualaLumpurWorld(scene) {
  scene.background = new THREE.Color(0x8fc4ef);
  scene.fog = new THREE.Fog(0xb6d9f5, 340, 980);

  const inst = new VoxelInstancer(scene, { castShadow: false, receiveShadow: true });
  const collision = new CollisionMap(MAP_MIN, MAP_MAX);
  const blockPlan = createBlockPlan(createPlotReservations());
  const terrain = inst.withSection('terrain', () => createTerrain(inst, blockPlan));
  const addSection = (name, callback) => inst.withSection(name, callback);

  addSection('streets', () => {
    addStreetMarkings(inst, terrain);
    addIntersectionDetails(inst, terrain, collision);
  });
  addSection('parksAndWater', () => addParksAndWater(inst, terrain));
  addSection('outerDistrictExpansion', () => addOuterDistrictExpansion(inst, terrain));
  addSection('cityBlocks', () => addCityBuildings(inst, terrain, collision, blockPlan));
  addSection('transit', () => addTransit(inst, terrain));
  addSection('tourismExpansion', () => addTourismExpansion(inst, terrain));
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

  registerLandmarkCollision(collision);
  const stats = inst.finalize();

  const landmarks = tourismLandmarks.map((item) => ({
    ...item,
    ...landmarkView(item),
    position: new THREE.Vector3(item.x, terrain.surfaceYAt(item.x, item.z) + (item.category === 'gateway' ? 2 : 4), item.z),
    visitRadius: item.category === 'gateway' ? 9 : 10
  }));

  const transportPaths = [
    {
      name: 'Kelana Jaya inspired elevated line',
      label: 'LRT',
      stations: ['Subang Gateway', 'Pasar Seni', 'KLCC', 'Bukit Bintang Link', 'KL Tower', 'Ampang Park'],
      points: [
        transitVector(terrain, 'Subang Airport Heritage Strip', { x: -82, z: -8 }),
        transitVector(terrain, 'Central Market', { x: -48, z: -8 }),
        transitVector(terrain, 'Petronas Twin Towers', { x: -12, z: -8 }),
        transitVector(terrain, 'Bukit Bintang', { x: 18, z: 22 }),
        transitVector(terrain, 'KL Tower', { x: 54, z: -8 }),
        transitVector(terrain, 'Ampang Korean Village', { x: 84, z: -8 })
      ],
      color: 'blue'
    },
    {
      name: 'Monorail inspired north-south line',
      label: 'Monorail',
      stations: ['KL Sentral', 'Imbi', 'Bukit Bintang', 'Titiwangsa'],
      points: [
        transitVector(terrain, 'National Museum', { x: 18, z: -72 }),
        transitVector(terrain, 'Jalan Alor', { x: 18, z: -28 }),
        transitVector(terrain, 'Bukit Bintang', { x: 18, z: 22 }),
        transitVector(terrain, 'Titiwangsa Lake Gardens', { x: 18, z: 72 })
      ],
      color: 'yellow'
    },
    {
      name: 'MRT heritage loop',
      label: 'MRT',
      stations: ['National Museum', 'Merdeka', 'TRX', 'KLCC Park'],
      points: [
        transitVector(terrain, 'National Museum', { x: -58, z: -66 }),
        transitVector(terrain, 'Merdeka 118', { x: -18, z: -42 }),
        transitVector(terrain, 'TRX Exchange 106', { x: 66, z: 32 }),
        transitVector(terrain, 'Petronas Twin Towers', { x: -12, z: 22 }),
        transitVector(terrain, 'KLCC Park', { x: -25, z: 43 })
      ],
      color: 'green'
    },
    {
      name: 'KTM tourism gateway',
      label: 'KTM',
      stations: ['Old Railway Station', 'Batu Caves Gateway', 'Malaysia Highlights'],
      points: [
        transitVector(terrain, 'Old Railway Station', { x: -36, z: -58 }),
        transitVector(terrain, 'LRT / MRT Hub', { x: 18, z: 22 }),
        transitVector(terrain, 'Batu Caves Gateway', { x: 82, z: 68 }),
        transitVector(terrain, 'Putrajaya Lake & Mosque', { x: 132, z: -136 }),
        transitVector(terrain, 'Sepang / KLIA Gateway', { x: 188, z: -82 })
      ],
      color: 'purple'
    },
    {
      name: 'Greater KL outer ring',
      label: 'BRT',
      stations: ['Mont Kiara', 'FRIM', 'Kuala Selangor', 'Shah Alam', 'Sunway', 'Bangsar', 'Kajang', 'Putrajaya', 'Zoo Negara', 'Genting Base'],
      points: [
        transitVector(terrain, 'Mont Kiara Dining Cluster', { x: -92, z: 92 }),
        transitVector(terrain, 'FRIM Forest Reserve', { x: -138, z: 128 }),
        transitVector(terrain, 'Kuala Selangor Fireflies', { x: -204, z: 152 }),
        transitVector(terrain, 'Shah Alam Blue Mosque', { x: -184, z: -38 }),
        transitVector(terrain, 'Sunway Lagoon & Pyramid', { x: -156, z: -126 }),
        transitVector(terrain, 'Bangsar Village', { x: -94, z: -108 }),
        transitVector(terrain, 'Kajang Satay Town', { x: 68, z: -184 }),
        transitVector(terrain, 'Putrajaya Lake & Mosque', { x: 132, z: -136 }),
        transitVector(terrain, 'Zoo Negara', { x: 142, z: 68 }),
        transitVector(terrain, 'Genting Highlands Gateway', { x: 148, z: 162 })
      ],
      color: 'green'
    },

    ,
    {
      name: 'PJ Subang Sunway connector',
      label: 'Rapid',
      stations: ['TTDI', 'Bandar Utama', 'PJ Old Town', 'SS15', 'Sunway', 'USJ', 'Puchong'],
      points: [
        transitVector(terrain, 'TTDI Market', { x: -126, z: 22 }),
        transitVector(terrain, '1 Utama & Bandar Utama', { x: -156, z: 12 }),
        transitVector(terrain, 'PJ Old Town', { x: -122, z: -62 }),
        transitVector(terrain, 'SS15 Food Street', { x: -136, z: -92 }),
        transitVector(terrain, 'Sunway Lagoon & Pyramid', { x: -156, z: -126 }),
        transitVector(terrain, 'USJ Taipan', { x: -126, z: -116 }),
        transitVector(terrain, 'Puchong IOI Boulevard', { x: -78, z: -150 })
      ],
      color: 'blue'
    },
    {
      name: 'Shah Alam Klang coast connector',
      label: 'Coast',
      stations: ['Shah Alam', 'i-City', 'Klang Little India', 'Port Klang', 'Pulau Ketam Ferry', 'Morib Gate'],
      points: [
        transitVector(terrain, 'Shah Alam Blue Mosque', { x: -184, z: -38 }),
        transitVector(terrain, 'i-City Shah Alam', { x: -176, z: -8 }),
        transitVector(terrain, 'Klang Little India', { x: -198, z: -72 }),
        transitVector(terrain, 'Port Klang Coastal Gate', { x: -210, z: -150 }),
        transitVector(terrain, 'Pulau Ketam Ferry Gate', { x: -210, z: -126 }),
        transitVector(terrain, 'Morib Beach Gateway', { x: -186, z: -198 })
      ],
      color: 'purple'
    },
    {
      name: 'Putrajaya KLIA south connector',
      label: 'ERL',
      stations: ['Mines Lake', 'IOI City', 'Putrajaya Mosque', 'Cyberjaya', 'Sepang Circuit', 'KLIA', 'Nilai'],
      points: [
        transitVector(terrain, 'Mines Lake', { x: 24, z: -150 }),
        transitVector(terrain, 'IOI City Mall', { x: 88, z: -144 }),
        transitVector(terrain, 'Putrajaya Pink Mosque', { x: 124, z: -126 }),
        transitVector(terrain, 'Cyberjaya Tech Garden', { x: 114, z: -168 }),
        transitVector(terrain, 'Sepang Circuit', { x: 176, z: -116 }),
        transitVector(terrain, 'KLIA Terminal Gateway', { x: 198, z: -106 }),
        transitVector(terrain, 'Nilai Outlet Corridor', { x: 134, z: -206 })
      ],
      color: 'yellow'
    },
    {
      name: 'North east nature connector',
      label: 'Green',
      stations: ['Titiwangsa', 'Setapak', 'Wangsa Maju', 'Batu Caves', 'Gombak', 'Kanching', 'Rawang Falls'],
      points: [
        transitVector(terrain, 'Titiwangsa Lake Gardens', { x: 8, z: 82 }),
        transitVector(terrain, 'Setapak Food Quarter', { x: 52, z: 62 }),
        transitVector(terrain, 'Wangsa Maju Town Centre', { x: 76, z: 78 }),
        transitVector(terrain, 'Batu Caves Temple Steps', { x: 88, z: 92 }),
        transitVector(terrain, 'Gombak Transit Gate', { x: 104, z: 112 }),
        transitVector(terrain, 'Kanching Falls', { x: 18, z: 176 }),
        transitVector(terrain, 'Rawang Waterfall Gate', { x: -28, z: 206 })
      ],
      color: 'green'
    },
    {
      name: 'Malaysia gateway spine',
      label: 'Tour',
      stations: ['Penang Gate', 'Langkawi Gate', 'Malacca Gate', 'Cameron Gate', 'Taman Negara Gate', 'Kinabalu Gate', 'Perhentian Gate', 'Putrajaya Gate', 'KLIA Gate'],
      points: [
        transitVector(terrain, 'Penang George Town Gateway', { x: 188, z: 92 }),
        transitVector(terrain, 'Langkawi Gateway', { x: 188, z: 72 }),
        transitVector(terrain, 'Malacca Gateway', { x: 188, z: 52 }),
        transitVector(terrain, 'Cameron Highlands Gateway', { x: 188, z: 32 }),
        transitVector(terrain, 'Taman Negara Gateway', { x: 188, z: 12 }),
        transitVector(terrain, 'Kinabalu Gateway', { x: 188, z: -8 }),
        transitVector(terrain, 'Perhentian Islands Gateway', { x: 188, z: -28 }),
        transitVector(terrain, 'Putrajaya Gateway', { x: 188, z: -58 }),
        transitVector(terrain, 'Sepang / KLIA Gateway', { x: 188, z: -82 })
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
    collision,
    blockPlan,
    startPosition: new THREE.Vector3(-24, terrain.surfaceYAt(-24, 24) + 0.1, 24)
  };
}
