import * as THREE from 'three';
import { STREAMING, WORLD, REGIONS, REGION_ORDER } from '../config.js';
import { heightAt, biomeAt, regionAt } from './Terrain.js';
import { buildChunk } from './ChunkMeshes.js';
import {
  buildRoadNetwork,
  planCityLots,
  buildMachiya,
  isRoadColumn,
  distanceToRoad
} from './regions/Machiya.js';
import {
  planSuburbLots,
  buildHouse,
  buildSuburbStreets,
  buildKonbini,
  buildSchool,
  buildRailLine,
  describeHouse,
  SUBURB_FURNITURE
} from './regions/SuburbRegion.js';
import {
  buildPaddies,
  buildOrchard,
  buildShrine,
  buildFarm,
  buildHighlandVegetation,
  buildMountainRoad,
  RURAL_FURNITURE
} from './regions/RuralRegion.js';
import {
  buildUtilityLine,
  buildVendingMachine,
  buildRoadsideShrine,
  buildTiledRoof,
  buildShoji,
  buildRoofTank,
  buildJapaneseInfrastructure
} from './regions/JapaneseDetails.js';
import {
  planCoastHouses,
  buildCoastHouse,
  buildVillageLane,
  buildBeachDetail,
  buildSeaTorii,
  buildHarbour,
  buildCoastVegetation,
  COAST_VILLAGE
} from './regions/CoastRegion.js';
import { createBlockGeometry, createPaletteMaterials, getMaterial } from './Palette.js';
import { SHAPE, shapeGeometry } from './RoundedGeometry.js';
import { VoxelBatch } from './Palette.js';
import { buildCollisionGrid } from './Collision.js';

// Solid landmark structures: footprint plus height, so both the player and the
// camera treat them as real buildings. Kept as data rather than inferred from
// the geometry builders, because the shrine hall is drawn from a dozen separate
// boxes and reading its bounds back out of them is fragile.
const LANDMARK_BOXES = [
  // Shrine hall on the summit plateau, and its torii below.
  { x: 226, z: 92, w: 12, d: 10, height: 10 },
  { x: 227, z: 112, w: 10, d: 2, height: 7 },
  // Konbini, school and the rail station.
  { x: 143, z: 171, w: 14, d: 10, height: 6 },
  { x: 34, z: 164, w: 26, d: 12, height: 8 },
  { x: 141, z: 113, w: 8, d: 10, height: 5 },
  // Barn and packing shed.
  { x: 196, z: 196, w: 10, d: 8, height: 7 },
  { x: 222, z: 152, w: 7, d: 6, height: 5 }
];

// Machiya carry their height on the lot itself, so collision can read it
// without knowing about building types.
function machiyaHeight(lot) {
  const spec = lot.typeSpec;
  return { height: spec ? spec.ridge : 8 };
}

// The world plan. Everything static is computed once here: the lot layouts the
// visuals use, and the same layouts fed into collision so the two agree.
export class WorldPlan {
  constructor() {
    this.cityNetwork = buildRoadNetwork();
    this.cityLots = planCityLots(this.cityNetwork);
    this.suburbLots = planSuburbLots();
    this.coastHouses = planCoastHouses();

    this.collision = buildCollisionGrid({
      lots: this.cityLots,
      houses: this.suburbLots,
      coastHouses: this.coastHouses,
      describeCityLot: machiyaHeight,
      describeHouse,
      // Landmark buildings are solid geometry the player can walk into, and the
      // camera must stay outside them. Without this the camera happily sits
      // inside the shrine hall, because the collision grid only knew about
      // city lots and houses.
      landmarks: LANDMARK_BOXES
    });
  }

  // Builds every static box in the game into a single batch. Regions are kept
  // separate internally so chunks only take the pieces that intersect them.
  buildAllStatics() {
    const batch = new VoxelBatch();

    // City: continuous rows of narrow machiya, party wall to party wall.
    for (const lot of this.cityLots) buildMachiya(batch, lot);
    this.buildCityStreets(batch);
    this.addRoofClutter(batch);
    this.buildJapaneseLayer(batch);

    // Suburbs.
    for (const lot of this.suburbLots) buildHouse(batch, lot);
    buildSuburbStreets(batch);
    buildKonbini(batch, SUBURB_FURNITURE.konbini.x, SUBURB_FURNITURE.konbini.z);
    buildSchool(batch, SUBURB_FURNITURE.school.x, SUBURB_FURNITURE.school.z);
    buildRailLine(batch, 96, 214);

    // Rural.
    buildPaddies(batch);
    buildOrchard(batch);
    buildShrine(batch);
    buildFarm(batch, RURAL_FURNITURE.farm.x, RURAL_FURNITURE.farm.z);
    buildHighlandVegetation(batch);
    buildMountainRoad(batch);

    // Coast.
    for (const lot of this.coastHouses) buildCoastHouse(batch, lot);
    buildVillageLane(batch);
    buildBeachDetail(batch);
    buildSeaTorii(batch);
    buildHarbour(batch);
    buildCoastVegetation(batch);

    return batch;
  }

  // Roofscape furniture: water tanks, which are what stops a Japanese
  // roofscape reading as a row of flat rectangles.
  addRoofClutter(batch) {
    let added = 0;
    for (const lot of this.cityLots) {
      const spec = lot.typeSpec;
      if (!spec || spec.id === 'tsushinikai') continue;

      const cx = lot.x + lot.w / 2;
      const cz = lot.z + lot.d / 2;
      const topY = heightAt(Math.floor(cx), Math.floor(cz)) + spec.ridge;

      // A tank on roughly a third of the roofs.
      if (added % 3 === 0) {
        buildRoofTank(batch, cx - 1.2, topY - 0.2, cz - 1.5);
      }
      added += 1;
    }
  }

  // The Japanese layer: utility poles with sagging wires, vending machines,
    // roadside shrines. These carry more of the "this is Japan" read than any
    // amount of architecture detail.
    buildJapaneseLayer(batch) {
      buildUtilityLine(batch, { axis: 'x', from: 30, to: 142, step: 16 });
      buildUtilityLine(batch, { axis: 'z', from: 30, to: 134, step: 16 });
      buildUtilityLine(batch, { axis: 'x', from: 30, to: 166, step: 18 });
      buildUtilityLine(batch, { axis: 'z', from: 146, to: 210, step: 18 });

      // Vending machines beside the konbini and the station.
      const spots = [
        [SUBURB_FURNITURE.konbini.x - 9, SUBURB_FURNITURE.konbini.z + 7],
        [SUBURB_FURNITURE.konbini.x + 9, SUBURB_FURNITURE.konbini.z + 7],
        [148, 112],
        [144, 112],
        [52, 176],
        [96, 178],
        [120, 196]
      ];
      for (const [x, z] of spots) {
        const ground = heightAt(Math.floor(x), Math.floor(z));
        if (ground > WORLD.seaLevel) buildVendingMachine(batch, x, ground, z);
      }

      // A few roadside shrines along the walks.
      const shrines = [[70, 130], [110, 150], [150, 200], [196, 120]];
      for (const [x, z] of shrines) buildRoadsideShrine(batch, x, z);
    }

  // Streets, paved narrow.
  //
  // The earlier version was written for 20-unit arterial roads and laid wide
  // pavements, kerbs and centre lines down both sides. With machiya now sitting
  // flush against the road boundary, a pavement would be inside the buildings,
  // so a narrow street is just carriageway with a thin gutter and nothing else.
  // The eave above closes the space; that is what makes it a street.
  buildCityStreets(batch) {
    const rect = REGIONS.city.rect;

    for (const road of this.cityNetwork.roads) {
      const vertical = road.axis === 'v';
      const from = (vertical ? rect.z0 : rect.x0) + 4;
      const to = (vertical ? rect.z1 : rect.x1) - 4;
      const len = to - from;
      const mid = (from + to) / 2;
      const collector = road.width >= 9;

      for (let t = from; t < to; t += 1) {
        const x = vertical ? road.pos + 0.5 : t + 0.5;
        const z = vertical ? t + 0.5 : road.pos + 0.5;
        const g = heightAt(Math.floor(x), Math.floor(z));
        if (g <= WORLD.seaLevel) continue;

        // Carriageway, laid as a run so there is no per-tile seam.
        batch.add(collector ? 'asphalt' : 'asphaltLight', x, g + 0.08, z,
          vertical ? road.width : 1, 0.16, vertical ? 1 : road.width);

        // A shallow gutter line at each edge, which is where the wall drains.
        for (const side of [-1, 1]) {
          const gx = vertical ? road.pos + side * (road.width / 2 - 0.3) + 0.5 : x;
          const gz = vertical ? z : road.pos + side * (road.width / 2 - 0.3) + 0.5;
          batch.add('stoneDark', gx, g + 0.1, gz,
            vertical ? 0.5 : 1, 0.14, vertical ? 1 : 0.5);
        }
      }

      // Centre line only on the two collectors. A narrow residential street
      // has no markings at all, which is most of why it reads as a lane.
      if (collector) {
        for (let t = from + 6; t < to - 6; t += 6) {
          const x = vertical ? road.pos : t;
          const z = vertical ? t : road.pos;
          const g = heightAt(Math.floor(x), Math.floor(z));
          if (g <= WORLD.seaLevel) continue;
          batch.add('laneYellow', x + 0.5, g + 0.17, z + 0.5,
            vertical ? 0.22 : 2.6, 0.08, vertical ? 2.6 : 0.22);
        }
      }
    }

    // Alleys: paving rather than tarmac, and a drain grate at each mouth.
    for (const alley of this.cityNetwork.alleys ?? []) {
      const vertical = alley.axis === 'v';
      for (let t = alley.from; t < alley.to; t += 1) {
        const x = vertical ? alley.pos + 0.5 : t + 0.5;
        const z = vertical ? t + 0.5 : alley.pos + 0.5;
        const g = heightAt(Math.floor(x), Math.floor(z));
        if (g <= WORLD.seaLevel) continue;
        batch.add('stone', x, g + 0.08, z,
          vertical ? alley.width : 1, 0.14, vertical ? 1 : alley.width);
      }
    }

    // Street lamps, wall-mounted low on the machiya rather than on posts. A
    // pole in a 5-wide street would be in the way; these are at 3m on the wall.
    for (const road of this.cityNetwork.roads) {
      const vertical = road.axis === 'v';
      const from = (vertical ? REGIONS.city.rect.z0 : REGIONS.city.rect.x0) + 10;
      const to = (vertical ? REGIONS.city.rect.z1 : REGIONS.city.rect.x1) - 10;
      for (let t = from; t < to; t += 26) {
        for (const side of [-1, 1]) {
          const x = vertical ? road.pos + side * (road.width / 2 + 0.4) + 0.5 : t;
          const z = vertical ? t : road.pos + side * (road.width / 2 + 0.4) + 0.5;
          const g = heightAt(Math.floor(x), Math.floor(z));
          if (g <= WORLD.seaLevel) continue;
          batch.add('lampGlass', x, g + 3.0, z, 0.5, 0.3, 0.5);
          batch.add('lampPost', x, g + 3.25, z, 0.18, 0.3, 0.18);
        }
      }
    }

    // Traffic lights only where a collector crosses another road. A narrow
    // residential street has no signals at all, and adding them everywhere is
    // what made the old grid read as a modern arterial.
    const collectors = this.cityNetwork.roads.filter((r) => r.width >= 9);
    for (const v of collectors) {
      for (const h of this.cityNetwork.roads) {
        if (v === h || (v.axis === h.axis && Math.abs(v.pos - h.pos) < 1)) continue;
        const gx = v.axis === 'v' ? v.pos : h.pos;
        const gz = v.axis === 'v' ? h.pos : v.pos;
        const y = heightAt(Math.floor(gx), Math.floor(gz));
        if (y <= WORLD.seaLevel) continue;
        for (const [dx, dz] of [[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]]) {
          batch.add('metalDark', gx + dx, y + 1.7, gz + dz, 0.24, 3.4, 0.24);
          batch.add('neonRed', gx + dx, y + 3.4, gz + dz, 0.4, 0.4, 0.4);
        }
      }
    }

    return batch;
  }
}

// Turns a VoxelBatch into one InstancedMesh per (material, shape) and adds them
// to the scene. Used for the whole-island static set, which is built once and
// never streamed.
//
// Shape matters: a building wants crisp blocks so its structure still reads,
// foliage wants soft blobs. Bucketing by both means each pair gets exactly one
// draw call with the right geometry.
export function instantiateStatics(batch, geometry, materials, scene, shapeGeometries = null) {
  const dummy = new THREE.Object3D();
  const meshes = [];

  const groups = new Map();
  for (const [materialName, list] of batch.entries) {
    for (const box of list) {
      const shape = box.shape ?? 'rounded';
      const key = `${materialName}|${shape}`;
      let group = groups.get(key);
      if (!group) {
        group = { materialName, shape, list: [] };
        groups.set(key, group);
      }
      group.list.push(box);
    }
  }

  for (const group of groups.values()) {
    if (group.list.length === 0) continue;
    const material = getMaterial(materials, group.materialName);
    const geo =
      shapeGeometries && shapeGeometries[group.shape] ? shapeGeometries[group.shape] : geometry;

    const mesh = new THREE.InstancedMesh(geo, material, group.list.length);
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    for (let i = 0; i < group.list.length; i += 1) {
      const b = group.list[i];
      dummy.position.set(b.x, b.y, b.z);
      dummy.scale.set(b.sx, b.sy, b.sz);
      dummy.rotation.set(b.rx ?? 0, b.ry ?? 0, b.rz ?? 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    scene.add(mesh);
    meshes.push(mesh);
  }

  return {
    meshes,
    dispose() {
      for (const mesh of meshes) {
        scene.remove(mesh);
        // Geometry is shared across meshes and cached, so it must not be
        // disposed here; only the InstancedMesh wrapper is per-call.
        mesh.dispose();
      }
      meshes.length = 0;
    }
  };
}

// Builds and unloads terrain chunks around the player, under a time budget so
// walking the island never causes a visible hitch.
export class WorldStreamer {
  constructor(scene, { materials, geometry, shapeGeometries = null }) {
    this.scene = scene;
    this.materials = materials;
    this.geometry = geometry;
    this.shapeGeometries = shapeGeometries;
    this.chunks = new Map();
    this.pending = [];
    this.enabled = true;
  }

  key(cx, cz) {
    return `${cx},${cz}`;
  }

  chunkCoordsFor(playerPos) {
    const size = WORLD.chunkSize;
    return {
      cx: Math.floor(playerPos.x / size),
      cz: Math.floor(playerPos.z / size)
    };
  }

  // Queues any chunk in range that is not loaded yet, nearest first.
  update(playerPos) {
    if (!this.enabled) return;

    const { cx, cz } = this.chunkCoordsFor(playerPos);
    const r = STREAMING.loadRadius;

    this.pending = [];
    for (let dz = -r; dz <= r; dz += 1) {
      for (let dx = -r; dx <= r; dx += 1) {
        const tx = cx + dx;
        const tz = cz + dz;
        if (tx < 0 || tz < 0) continue;
        if (tx * WORLD.chunkSize >= WORLD.size) continue;
        if (tz * WORLD.chunkSize >= WORLD.size) continue;
        const key = this.key(tx, tz);
        if (this.chunks.has(key)) continue;
        this.pending.push({ cx: tx, cz: tz, dist: dx * dx + dz * dz });
      }
    }
    this.pending.sort((a, b) => a.dist - b.dist);

    this.unloadFar(playerPos);
    this.buildBudgeted();
  }

  unloadFar(playerPos) {
    const { cx, cz } = this.chunkCoordsFor(playerPos);
    const limit = STREAMING.unloadRadius;
    for (const [key, chunk] of [...this.chunks]) {
      const dx = Math.abs(chunk.cx - cx);
      const dz = Math.abs(chunk.cz - cz);
      if (dx > limit || dz > limit) {
        chunk.dispose(this.scene);
        this.chunks.delete(key);
      }
    }
  }

  // Builds chunks until the time budget runs out, so a long jump never stalls
  // the frame.
  buildBudgeted() {
    const deadline = performance.now() + STREAMING.buildBudgetMs;
    while (this.pending.length) {
      const next = this.pending.shift();
      const key = this.key(next.cx, next.cz);
      if (this.chunks.has(key)) continue;
      const chunk = buildChunk(next.cx, next.cz, this.geometry, this.materials, this.scene);
      this.chunks.set(key, chunk);
      if (performance.now() > deadline) break;
    }
  }

  get loadedCount() {
    return this.chunks.size;
  }

  get instanceCount() {
    let total = 0;
    for (const chunk of this.chunks.values()) {
      for (const mesh of chunk.meshes) total += mesh.count;
    }
    return total;
  }

  disposeAll() {
    for (const chunk of this.chunks.values()) chunk.dispose(this.scene);
    this.chunks.clear();
  }
}

export function createMaterials(factory = null) {
  return createPaletteMaterials(factory);
}

export function createGeometry() {
  return createBlockGeometry();
}

// The rounding levels the builders select from, as ready-to-use geometries.
// Built lazily and cached, so there is exactly one buffer per shape level no
// matter how many thousand blocks reference it.
let shapeSet = null;
export function createShapeGeometries() {
  if (!shapeSet) {
    shapeSet = {};
    for (const name of Object.keys(SHAPE)) {
      shapeSet[name] = shapeGeometry(name);
    }
  }
  return shapeSet;
}

export function regionNameAt(x, z) {
  return REGIONS[regionAt(x, z)];
}

export { REGION_ORDER };