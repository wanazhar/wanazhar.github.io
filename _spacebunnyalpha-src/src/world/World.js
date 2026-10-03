import * as THREE from 'three';
import { STREAMING, WORLD, REGIONS, REGION_ORDER } from '../config.js';
import { heightAt, biomeAt, regionAt } from './Terrain.js';
import { buildChunk } from './ChunkMeshes.js';
import { buildRoadNetwork, planCityLots, buildLot, buildLotusBlock, describeLot } from './regions/CityRegion.js';
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
      describeCityLot: describeLot,
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

    // City.
    for (const lot of this.cityLots) {
      if (lot.kind === 'lotus') buildLotusBlock(batch, lot);
      else buildLot(batch, lot);
    }
    this.buildCityStreets(batch);
    this.buildStreetDetail(batch);
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

  // Roofscape furniture. Water tanks and kawara ridge caps are what stop a
    // Japanese roofscape reading as a row of flat rectangles.
    addRoofClutter(batch) {
      let added = 0;
      for (const lot of this.cityLots) {
        if (lot.kind === 'lotus') continue;
        const spec = describeLot(lot);
        if (spec.height < 6) continue;

        const cx = lot.x + lot.w / 2;
        const cz = lot.z + lot.d / 2;
        const topY = heightAt(Math.floor(cx), Math.floor(cz)) + spec.height;

        // Tanks on roughly a third of the roofs.
        if (added % 3 === 0 && lot.w >= 10 && lot.d >= 10) {
          buildRoofTank(batch, cx - 2, topY + 0.3, cz - 2);
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

  // Street surfacing. A city street that is one flat slab of asphalt reads as
    // unfinished, so every road gets a centre line, kerbs, pavement banding and
    // a manhole or two. Cheap boxes, and they give the eye something to read.
    dressStreet(batch, axis, pos, from, to, width) {
      const centre = (from + to) / 2;
      const length = to - from;
      const half = width / 2;

      for (let t = from; t < to; t += 1) {
        const x = axis === 'v' ? pos : t + 0.5;
        const z = axis === 'v' ? t + 0.5 : pos;
        const ground = heightAt(Math.floor(x), Math.floor(z));
        if (ground <= WORLD.seaLevel) continue;

        // Pavement either side, raised a little above the road.
        for (const side of [-1, 1]) {
          const px = axis === 'v' ? pos + side * (half + 1) : x;
          const pz = axis === 'v' ? z : pos + side * (half + 1);
          const pg = heightAt(Math.floor(px), Math.floor(pz));
          if (pg <= WORLD.seaLevel) continue;
          batch.add('sidewalk', px, pg + 0.18, pz, axis === 'v' ? 2 : 1, 0.24, axis === 'v' ? 1 : 2);
          // Kerb edge, slightly darker.
          batch.add(
            'curb',
            axis === 'v' ? pos + side * (half + 0.1) : x,
            pg + 0.22,
            axis === 'v' ? z : pos + side * (half + 0.1),
            axis === 'v' ? 0.25 : 1,
            0.2,
            axis === 'v' ? 1 : 0.25
          );
        }
      }
    }

    // Pavements and markings, built after the carriageway so they sit on top.
    buildStreetDetail(batch) {
      const rect = REGIONS.city.rect;
      for (const road of this.cityNetwork.roads) {
        const axis = road.axis;
        const from = axis === 'v' ? rect.z0 : rect.x0;
        const to = axis === 'v' ? rect.z1 : rect.x1;
        this.dressStreet(batch, axis, road.pos, from + 4, to - 4, road.width);

        // Centre line: dashed on wide roads, omitted on narrow ones.
        if (road.width >= 5) {
          for (let t = from + 6; t < to - 6; t += 6) {
            const x = axis === 'v' ? road.pos : t;
            const z = axis === 'v' ? t : road.pos;
            const g = heightAt(Math.floor(x), Math.floor(z));
            if (g <= WORLD.seaLevel) continue;
            batch.add('laneYellow', x + 0.5, g + 0.16, z + 0.5, axis === 'v' ? 0.22 : 2.6, 0.08, axis === 'v' ? 2.6 : 0.22);
          }
        }

        // Scattered manhole covers and drain grates break the repetition.
        const rngSeed = road.pos * 31 + (axis === 'v' ? 7 : 13);
        const rng = ((n) => ((Math.sin(n * 12.9898 + rngSeed) * 43758.5453) % 1 + 1) % 1);
        for (let t = from + 9; t < to - 9; t += 11) {
          const x = axis === 'v' ? road.pos + (rng(t) - 0.5) * 1.2 : t;
          const z = axis === 'v' ? t : road.pos + (rng(t) - 0.5) * 1.2;
          const g = heightAt(Math.floor(x), Math.floor(z));
          if (g <= WORLD.seaLevel) continue;
          batch.add('metalDark', x + 0.5, g + 0.15, z + 0.5, 0.7, 0.1, 0.7);
        }
      }
    }

  // Roads, pavements, crossings and lamps for the city grid.
  buildCityStreets(batch) {
    const roads = this.cityNetwork.roads;
    const rect = REGIONS.city.rect;

    for (const road of roads) {
      const horizontal = road.axis === 'h';
      const half = road.width / 2;

      if (horizontal) {
        const cx = (rect.x0 + rect.x1) / 2;
        const len = rect.x1 - rect.x0 - 8;
        batch.add(road.width >= 5 ? 'asphalt' : 'asphaltLight', cx, heightAt(Math.floor(cx), road.pos) + 0.07, road.pos, len, 0.14, road.width);
        // Pavements.
        for (const side of [-1, 1]) {
          const pz = road.pos + side * (half + 1);
          batch.add('sidewalk', cx, heightAt(Math.floor(cx), Math.round(pz)) + 0.14, pz, len, 0.2, 2);
          batch.add('curb', cx, heightAt(Math.floor(cx), Math.round(pz)) + 0.2, pz + side * 1, len, 0.16, 0.2);
        }
        // Centre line.
        if (road.width >= 5) {
          for (let x = rect.x0 + 8; x < rect.x1 - 8; x += 6) {
            batch.add('laneYellow', x, heightAt(Math.floor(x), road.pos) + 0.15, road.pos, 2.6, 0.08, 0.22);
          }
        }
        // Street lamps on the pavement.
        for (let x = rect.x0 + 12; x < rect.x1 - 12; x += 24) {
          const side = Math.floor((x - rect.x0) / 24) % 2 === 0 ? -1 : 1;
          const lz = road.pos + side * (half + 1);
          const ly = heightAt(Math.floor(x), Math.round(lz));
          batch.add('lampPost', x, ly + 2.6, lz, 0.24, 5.2, 0.24);
          batch.add('lampGlass', x, ly + 5.3, lz, 0.6, 0.35, 0.6);
        }
        // A crossing at every intersection.
        for (const v of roads.filter((r) => r.axis === 'v')) {
          for (let i = -2; i <= 2; i += 1) {
            batch.add('crossingWhite', v.pos + i * 0.9, heightAt(Math.floor(v.pos), road.pos) + 0.16, road.pos, 0.5, 0.08, road.width);
          }
        }
      } else {
        const cz = (rect.z0 + rect.z1) / 2;
        const len = rect.z1 - rect.z0 - 8;
        batch.add(road.width >= 5 ? 'asphalt' : 'asphaltLight', road.pos, heightAt(road.pos, Math.floor(cz)) + 0.07, cz, road.width, 0.14, len);
        for (const side of [-1, 1]) {
          const px = road.pos + side * (half + 1);
          batch.add('sidewalk', px, heightAt(Math.round(px), Math.floor(cz)) + 0.14, cz, 2, 0.2, len);
          batch.add('curb', px + side * 1, heightAt(Math.round(px), Math.floor(cz)) + 0.2, cz, 0.2, 0.16, len);
        }
        if (road.width >= 5) {
          for (let z = rect.z0 + 8; z < rect.z1 - 8; z += 6) {
            batch.add('laneYellow', road.pos, heightAt(road.pos, Math.floor(z)) + 0.15, z, 0.22, 0.08, 2.6);
          }
        }
      }
    }

    // Traffic lights at the busier intersections.
    for (const v of roads.filter((r) => r.axis === 'v')) {
      for (const h of roads.filter((r) => r.axis === 'h')) {
        if ((v.pos + h.pos) % 3 !== 0) continue;
        const y = heightAt(v.pos, h.pos);
        for (const [dx, dz] of [[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]]) {
          batch.add('metalDark', v.pos + dx, y + 1.7, h.pos + dz, 0.24, 3.4, 0.24);
          batch.add('neonRed', v.pos + dx, y + 3.4, h.pos + dz, 0.4, 0.4, 0.4);
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