import * as THREE from 'three';
import { createCityLayout, BLOCK_PITCH, ROAD_WIDTH, CITY_HALF } from './cityLayout.js';
import { buildLandmarks } from './landmarks.js';

const TERRAIN_SIZE = 2600;
const TERRAIN_SEGMENTS = 320;
const ROAD_LIFT = 0.3;
const ROAD_THICKNESS = 4;
const WALK_LIFT = 0.24;
const WALK_THICKNESS = 4;

const PALETTE = {
  asphalt: 0x3f454b,
  asphaltLight: 0x4b5257,
  sidewalk: 0x8b857a,
  sidewalkDark: 0x7d786d,
  kerb: 0x9d968a,
  lanePaint: 0xe8e4d6,
  laneYellow: 0xe8c25a,
  grass: 0x4e7a45,
  grassDark: 0x3f6639,
  dirt: 0x7a6a52,
  water: 0x2f6f8f,
  window: 0x3c5a72,
  windowLit: 0xffd98a,
  awning: 0xc9503f,
  ac: 0x9aa0a6,
  balcony: 0xb9b2a4,
  railing: 0x8d949b,
  tank: 0x9aa2a8,
  tankLid: 0x7d858b,
  mast: 0x878f96,
  trunk: 0x6b4a2c,
  leaf: 0x3f7a3a,
  leafLight: 0x52914a,
  coin: 0xffc93c
};

// InstancedMesh colours arrive via instanceColor, so these materials must NOT also declare
// vertexColors: true — that makes three.js multiply by a missing per-vertex color attribute (all
// zeros) and renders every instance black. Buildings are the one exception: they get an explicit
// white color attribute on their box geometry so per-face and per-instance colours compose.
const MATERIALS = {
  building: new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.82, metalness: 0.04 }),
  window: new THREE.MeshStandardMaterial({ color: PALETTE.window, roughness: 0.35, metalness: 0.2 }),
  roof: new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.9, metalness: 0.02 }),
  road: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, metalness: 0.0 }),
  sidewalk: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, metalness: 0.0 }),
  marking: new THREE.MeshStandardMaterial({ color: PALETTE.lanePaint, roughness: 0.7 }),
  accent: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62, metalness: 0.1 }),
  foliage: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.86, metalness: 0.0 }),
  metal: new THREE.MeshStandardMaterial({ color: 0xb6bec6, roughness: 0.45, metalness: 0.5 }),
  darkMetal: new THREE.MeshStandardMaterial({ color: 0x7c848c, roughness: 0.55, metalness: 0.35 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x8fc6e8, roughness: 0.14, metalness: 0.25, transparent: true, opacity: 0.72, clearcoat: 0.6 }),
  warm: new THREE.MeshStandardMaterial({ color: 0xffd9a0, roughness: 0.4, metalness: 0.1 }),
  coin: new THREE.MeshStandardMaterial({ color: PALETTE.coin, roughness: 0.24, metalness: 0.85, emissive: 0x6b4a00, emissiveIntensity: 0.35 }),
  water: new THREE.MeshStandardMaterial({ color: 0x2f7d9e, roughness: 0.12, metalness: 0.35, transparent: true, opacity: 0.88 }),
  stone: new THREE.MeshStandardMaterial({ color: 0x9d978b, roughness: 0.9, metalness: 0.02 })
};

const WHITE_BOX = new THREE.BoxGeometry(1, 1, 1);
WHITE_BOX.setAttribute('color', new THREE.BufferAttribute(new Float32Array(WHITE_BOX.attributes.position.count * 3).fill(1), 3));
const PLAIN_BOX = new THREE.BoxGeometry(1, 1, 1);

const TMP_COLOR = new THREE.Color();
const UP = new THREE.Vector3(0, 1, 0);

export class VoxelCity {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.layout = createCityLayout({ seed: options.seed });
    this.groups = [];
    this.coinMeshes = [];
    this.landmarkMeshes = new Map();
    this.terrainHeight = this.layout.groundHeight;
    this.chunkSize = 128;
  }

  async load() {
    this.#buildTerrain();
    this.#buildRoadNetwork();
    this.#buildSidewalks();
    this.#buildBuildings();
    this.#buildProps();
    this.#buildStreetFurniture();
    this.#buildRamps();
    this.#buildLandmarks();
    this.#buildCoins();
    return this;
  }

  get groundHeight() {
    return this.terrainHeight;
  }

  sampleGround(x, z) {
    return this.terrainHeight(x, z);
  }

  #buildTerrain() {
    const geometry = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEGMENTS, TERRAIN_SEGMENTS);
    geometry.rotateX(-Math.PI / 2);
    const position = geometry.attributes.position;
    const colors = new Float32Array(position.count * 3);
    const half = TERRAIN_SIZE / 2;

    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const y = this.terrainHeight(x, z);
      position.setY(i, y - 0.06);

      const inCity = Math.hypot(x, z) < CITY_HALF + 30;
      const onRoad = this.layout.isRoadCoord(x, z);
      const patch = Math.sin(x * 0.013) * Math.cos(z * 0.017) + Math.sin(x * 0.007 + z * 0.009);
      let hex;
      if (inCity) hex = onRoad ? PALETTE.asphalt : PALETTE.sidewalk;
      else if (patch > 0.4) hex = PALETTE.grass;
      else if (patch < -0.55) hex = PALETTE.grassDark;
      else hex = PALETTE.grass;

      const shade = 0.9 + (((Math.abs(Math.round(x)) * 7 + Math.abs(Math.round(z)) * 13) % 25) / 250);
      TMP_COLOR.set(hex);
      colors[i * 3] = TMP_COLOR.r * shade;
      colors[i * 3 + 1] = TMP_COLOR.g * shade;
      colors[i * 3 + 2] = TMP_COLOR.b * shade;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 }));
    mesh.name = 'terrain_heightfield';
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    this.terrainMesh = mesh;
  }

  #buildRoadNetwork() {
    const group = new THREE.Group();
    group.name = 'road_network';
    const dummy = new THREE.Object3D();
    const surface = [];
    const paint = [];

    const pushSurface = (x, z, w, d, color) => surface.push({ x, z, w, d, color });

    // Dash the centre line every third tile; index-based rather than a modulo on the running
    // coordinate, which never lined up with the tile grid.
    for (let line = -8; line <= 8; line += 1) {
      const at = line * BLOCK_PITCH;
      for (let step = -CITY_HALF - 30, i = 0; step <= CITY_HALF + 30; step += ROAD_WIDTH, i += 1) {
        if (step < -TERRAIN_SIZE / 2 || step > TERRAIN_SIZE / 2) continue;
        pushSurface(at + ROAD_WIDTH / 2, step + ROAD_WIDTH / 2, ROAD_WIDTH, ROAD_WIDTH, PALETTE.asphalt);
        if (i % 2 === 0) paint.push({ x: at + ROAD_WIDTH / 2, z: step + ROAD_WIDTH / 2, axis: 'z' });
      }
      for (let step = -CITY_HALF - 30, i = 0; step <= CITY_HALF + 30; step += ROAD_WIDTH, i += 1) {
        if (step < -TERRAIN_SIZE / 2 || step > TERRAIN_SIZE / 2) continue;
        pushSurface(step + ROAD_WIDTH / 2, at + ROAD_WIDTH / 2, ROAD_WIDTH, ROAD_WIDTH, PALETTE.asphalt);
        if (i % 2 === 0) paint.push({ x: step + ROAD_WIDTH / 2, z: at + ROAD_WIDTH / 2, axis: 'x' });
      }
    }

    // Zebra stripes on every arm of the junctions.
    for (let line = -8; line <= 8; line += 1) {
      const cross = line * BLOCK_PITCH;
      for (let other = -8; other <= 8; other += 1) {
        const along = other * BLOCK_PITCH;
        if (Math.hypot(cross, along) > CITY_HALF + 40) continue;
        for (let s = -ROAD_WIDTH / 2 + 1; s <= ROAD_WIDTH / 2 - 1; s += 1.6) {
          // Stripes lie along the direction of travel: 'z' roads need stripes elongated in z,
          // 'x' roads need them rotated a quarter turn.
          paint.push({ x: cross + s, z: along - ROAD_WIDTH / 2 - 2.6, axis: 'z', zebra: true });
          paint.push({ x: cross + s, z: along + ROAD_WIDTH / 2 + 2.6, axis: 'z', zebra: true });
          paint.push({ x: cross - ROAD_WIDTH / 2 - 2.6, z: along + s, axis: 'x', zebra: true });
          paint.push({ x: cross + ROAD_WIDTH / 2 + 2.6, z: along + s, axis: 'x', zebra: true });
        }
      }
    }

    // The heightfield's vertices are ~13 units apart, so a road tile sampled at its centre can sit
    // below a neighbouring terrain vertex. Building the slab downward from just above the sampled
    // ground keeps the visible top surface above the terrain everywhere along the street.
    const surfaceMesh = new THREE.InstancedMesh(PLAIN_BOX, MATERIALS.road, surface.length);
    surfaceMesh.name = 'asphalt_surface';
    surfaceMesh.receiveShadow = true;
    surface.forEach((tile, index) => {
      const ground = this.terrainHeight(tile.x, tile.z);
      dummy.position.set(tile.x, ground + ROAD_LIFT - ROAD_THICKNESS / 2, tile.z);
      dummy.scale.set(tile.w, ROAD_THICKNESS, tile.d);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      surfaceMesh.setMatrixAt(index, dummy.matrix);
      surfaceMesh.setColorAt(index, TMP_COLOR.set(tile.color));
    });
    surfaceMesh.instanceMatrix.needsUpdate = true;
    if (surfaceMesh.instanceColor) surfaceMesh.instanceColor.needsUpdate = true;
    group.add(surfaceMesh);

    const paintMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.06, 1), MATERIALS.marking, paint.length);
    paintMesh.name = 'lane_paint';
    paint.forEach((mark, index) => {
      dummy.position.set(mark.x, this.terrainHeight(mark.x, mark.z) + ROAD_LIFT + 0.06, mark.z);
      dummy.rotation.set(0, mark.axis === 'x' ? Math.PI / 2 : 0, 0);
      if (mark.zebra) dummy.scale.set(1.1, 1, 3.0);
      else dummy.scale.set(0.5, 1, 3.2);
      dummy.updateMatrix();
      paintMesh.setMatrixAt(index, dummy.matrix);
    });
    paintMesh.instanceMatrix.needsUpdate = true;
    group.add(paintMesh);

    this.scene.add(group);
  }

  #buildSidewalks() {
    const tiles = [];
    for (let bx = -8; bx <= 8; bx += 1) {
      for (let bz = -8; bz <= 8; bz += 1) {
        const cx = bx * BLOCK_PITCH + BLOCK_PITCH / 2;
        const cz = bz * BLOCK_PITCH + BLOCK_PITCH / 2;
        if (Math.hypot(cx, cz) > CITY_HALF + 10) continue;
        const size = BLOCK_PITCH - ROAD_WIDTH;
        tiles.push({ x: bx * BLOCK_PITCH + ROAD_WIDTH + size / 2, z: bz * BLOCK_PITCH + ROAD_WIDTH + size / 2, size });
      }
    }
    const group = new THREE.Group();
    group.name = 'sidewalks_and_kerbs';
    const dummy = new THREE.Object3D();

    const walk = new THREE.InstancedMesh(PLAIN_BOX, MATERIALS.sidewalk, tiles.length);
    walk.name = 'sidewalk_slabs';
    walk.receiveShadow = true;
    tiles.forEach((tile, index) => {
      dummy.position.set(tile.x, this.terrainHeight(tile.x, tile.z) + WALK_LIFT - WALK_THICKNESS / 2, tile.z);
      dummy.scale.set(tile.size, WALK_THICKNESS, tile.size);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      walk.setMatrixAt(index, dummy.matrix);
    });
    walk.instanceMatrix.needsUpdate = true;
    group.add(walk);

    this.scene.add(group);
  }

  #buildBuildings() {
    const byChunk = new Map();
    for (const building of this.layout.buildings) {
      const key = `${Math.floor(building.x / this.chunkSize)},${Math.floor(building.z / this.chunkSize)}`;
      if (!byChunk.has(key)) byChunk.set(key, []);
      byChunk.get(key).push(building);
    }

    for (const [key, buildings] of byChunk.entries()) {
      const group = new THREE.Group();
      group.name = `city_block_${key}`;
      const body = [];
      const roofs = [];
      const windows = [];
      const accents = [];
      const dummy = new THREE.Object3D();

      for (const b of buildings) {
        const segs = this.#setbackSegments(b);
        segs.forEach((seg, index) => {
          body.push({ ...seg, color: b.color });
          if (index > 0) {
            body.push({ x: seg.x, y: seg.y + seg.h, z: seg.z, w: seg.w + 0.9, d: seg.d + 0.9, h: 0.5, color: b.roof });
          }
          if (b.windows) this.#collectWindows(seg, b, windows);
          if (b.shop && index === 0) {
            // Shopfront awning: a slab tilted out over the footway, plus a fascia band.
            accents.push({ x: b.x + b.w / 2, y: b.ground + 3.2, z: b.z - 0.8, w: b.w * 0.9, d: 1.5, h: 0.16, color: b.shop });
            accents.push({ x: b.x + b.w / 2, y: b.ground + 3.0, z: b.z - 0.1, w: b.w * 0.92, d: 0.24, h: 0.5, color: b.roof });
          }
        });

        roofs.push({ x: b.x + b.w / 2, y: b.ground + b.h + 0.35, z: b.z + b.d / 2, w: b.w * 0.86, d: b.d * 0.86, h: 0.35, color: b.roof });
        if (b.acUnits) {
          const units = 1 + Math.floor(b.floors / 5);
          for (let i = 0; i < units; i += 1) {
            accents.push({
              x: b.x + b.w * (0.2 + 0.3 * ((i + 1) % 2)),
              y: b.ground + b.h + 1.1,
              z: b.z + b.d * (0.25 + 0.35 * (i % 3) / 2),
              w: 1.5, d: 1.2, h: 0.9, color: PALETTE.ac
            });
          }
        }

        // Balconies give the mid-rise facades some relief instead of flat glass bands.
        if (b.floors >= 3 && (b.district === 'residential' || b.district === 'midtown')) {
          for (let floor = 1; floor < Math.min(b.floors, 9); floor += 1) {
            const y = b.ground + floor * 3.4;
            accents.push({ x: b.x + b.w / 2, y, z: b.z - 0.4, w: b.w * 0.8, d: 0.9, h: 0.14, color: PALETTE.balcony });
            accents.push({ x: b.x + b.w / 2, y: y + 0.32, z: b.z - 0.78, w: b.w * 0.8, h: 0.5, d: 0.09, color: PALETTE.railing });
          }
        }

        // A parapet around the roof edge on the taller blocks.
        if (b.h > 13 && !b.setback) {
          const t = 0.32;
          const py = b.ground + b.h + 0.55;
          accents.push({ x: b.x + b.w / 2, y: py, z: b.z + t / 2, w: b.w * 0.9, h: 0.7, d: t, color: b.roof });
          accents.push({ x: b.x + b.w / 2, y: py, z: b.z + b.d - t / 2, w: b.w * 0.9, h: 0.7, d: t, color: b.roof });
          accents.push({ x: b.x + t / 2, y: py, z: b.z + b.d / 2, w: t, h: 0.7, d: b.d * 0.9, color: b.roof });
          accents.push({ x: b.x + b.w - t / 2, y: py, z: b.z + b.d / 2, w: t, h: 0.7, d: b.d * 0.9, color: b.roof });
        }

        // Rooftop water tanks and masts give the skyline some silhouette.
        if (b.h > 9) {
          const tankX = b.x + b.w * (b.h > 30 ? 0.3 : 0.68);
          const tankZ = b.z + b.d * (b.h > 30 ? 0.66 : 0.32);
          const tankSize = 1.6 + Math.max(0, 6 - b.h * 0.1);
          accents.push({ x: tankX, y: b.ground + b.h + 1.4, z: tankZ, w: tankSize, d: tankSize, h: 1.8, color: PALETTE.tank });
          accents.push({ x: tankX, y: b.ground + b.h + 2.7, z: tankZ, w: tankSize * 0.7, d: tankSize * 0.7, h: 0.6, color: PALETTE.tankLid });
          if (b.h > 20) {
            accents.push({
              x: b.x + b.w * 0.5,
              y: b.ground + b.h + 4 + Math.min(b.h * 0.06, 4),
              z: b.z + b.d * 0.5,
              w: 0.24, d: 0.24, h: 8 + Math.min(b.h * 0.12, 10),
              color: PALETTE.mast
            });
          }
        }
      }

      group.add(this.#boxBatch(`building_bodies_${key}`, body, MATERIALS.building, true, true, dummy));
      group.add(this.#boxBatch(`roof_caps_${key}`, roofs, MATERIALS.roof, true, true, dummy));
      group.add(this.#boxBatch(`accents_${key}`, accents, MATERIALS.accent, true, false, dummy));
      if (windows.length) group.add(this.#boxBatch(`windows_${key}`, windows, MATERIALS.window, false, false, dummy));

      this.scene.add(group);
      this.groups.push({ key, group });
    }
  }

  #setbackSegments(building) {
    const segments = [];
    if (!building.setback) {
      segments.push({ x: building.x + building.w / 2, y: building.ground + building.h / 2, z: building.z + building.d / 2, w: building.w, h: building.h, d: building.d });
      return segments;
    }
    const lowerH = building.setback.at;
    segments.push({ x: building.x + building.w / 2, y: building.ground + lowerH / 2, z: building.z + building.d / 2, w: building.w, h: lowerH, d: building.d });
    const upperH = building.h - lowerH;
    const w = Math.max(4, building.w - building.setback.shrink);
    const d = Math.max(4, building.d - building.setback.shrink);
    segments.push({ x: building.x + building.w / 2, y: building.ground + lowerH + upperH / 2, z: building.z + building.d / 2, w, h: upperH, d });
    return segments;
  }

  #collectWindows(segment, building, windows) {
    const floorHeight = 3.4;
    const floors = Math.max(1, Math.floor(segment.h / floorHeight));
    for (let floor = 1; floor < floors; floor += 1) {
      const y = segment.y - segment.h / 2 + floor * floorHeight;
      const inset = 0.12;
      windows.push({ x: segment.x, y, z: segment.z - segment.d / 2 - inset, w: segment.w * 0.72, h: 1.5, d: 0.16 });
      windows.push({ x: segment.x, y, z: segment.z + segment.d / 2 + inset, w: segment.w * 0.72, h: 1.5, d: 0.16 });
      windows.push({ x: segment.x - segment.w / 2 - inset, y, z: segment.z, w: 0.16, h: 1.5, d: segment.d * 0.72 });
      windows.push({ x: segment.x + segment.w / 2 + inset, y, z: segment.z, w: 0.16, h: 1.5, d: segment.d * 0.72 });
    }
  }

  #boxBatch(name, items, material, castShadow, receiveShadow, dummy) {
    const usesVertexColors = Boolean(material.vertexColors);
    const geometry = usesVertexColors ? WHITE_BOX : PLAIN_BOX;
    const mesh = new THREE.InstancedMesh(geometry, material, items.length);
    mesh.name = name;
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    items.forEach((item, index) => {
      dummy.position.set(item.x, item.y, item.z);
      dummy.scale.set(item.w, item.h, item.d);
      dummy.rotation.set(0, item.rotation || 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      // .set() rather than .setHex(): the building palettes are '#rrggbb' strings, and setHex
      // coerces a string to NaN whose bitwise truncation is 0, rendering the instance black.
      if (item.color !== undefined) mesh.setColorAt(index, TMP_COLOR.set(item.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    return mesh;
  }

  #buildProps() {
    const group = new THREE.Group();
    group.name = 'street_props';
    const trunks = [];
    const canopies = [];
    const dummy = new THREE.Object3D();

    const pondWater = [];
    const pondRim = [];
    for (const prop of this.layout.props) {
      if (prop.kind === 'pond') {
        pondWater.push({ x: prop.x, y: prop.y + 0.06, z: prop.z, w: prop.w, h: 0.5, d: prop.d });
        pondRim.push({ x: prop.x, y: prop.y + 0.1, z: prop.z, w: prop.w + 1.4, h: 0.34, d: prop.d + 1.4 });
        continue;
      }
      if (prop.kind === 'tree') {
        const scale = prop.scale ?? 1;
        trunks.push({ x: prop.x, y: prop.y + 1.7 * scale, z: prop.z, w: 0.55, h: 3.4 * scale, d: 0.55, color: PALETTE.trunk });
        canopies.push({ x: prop.x, y: prop.y + 4.2 * scale, z: prop.z, w: 4.1 * scale, h: 2.6 * scale, d: 4.1 * scale, color: randomLeaf(prop) });
        canopies.push({ x: prop.x, y: prop.y + 5.5 * scale, z: prop.z, w: 2.6 * scale, h: 1.5 * scale, d: 2.6 * scale, color: PALETTE.leafLight });
      }
    }

    if (trunks.length) {
      group.add(this.#boxBatch('tree_trunks', trunks, MATERIALS.foliage, true, true, dummy));
      group.add(this.#boxBatch('tree_canopies', canopies, MATERIALS.foliage, true, true, dummy));
    }
    if (pondRim.length) {
      group.add(this.#boxBatch('pond_rims', pondRim, MATERIALS.stone, false, true, dummy));
      group.add(this.#boxBatch('pond_water', pondWater, MATERIALS.water, false, true, dummy));
    }
    this.scene.add(group);
  }

  #buildStreetFurniture() {
    const group = new THREE.Group();
    group.name = 'street_furniture';
    const poles = [];
    const heads = [];
    const dummy = new THREE.Object3D();
    for (const item of this.layout.streetFurniture) {
      poles.push({ x: item.x, y: item.y + 1.4, z: item.z, w: 0.13, h: 2.8, d: 0.13 });
      heads.push({ x: item.x, y: item.y + 2.9, z: item.z, w: 0.55, h: 0.2, d: 0.28 });
    }
    if (poles.length) {
      group.add(this.#boxBatch('lamp_poles', poles, MATERIALS.darkMetal, true, false, dummy));
      group.add(this.#boxBatch('lamp_heads', heads, MATERIALS.warm, true, false, dummy));
    }

    // Traffic signal masts and heads, one colour per head so the junctions read as live.
    const signalPoles = [];
    const signalHeads = [];
    for (const signal of this.layout.signals) {
      signalPoles.push({ x: signal.x, y: signal.y + 1.7, z: signal.z, w: 0.16, h: 3.4, d: 0.16 });
      signalHeads.push({
        x: signal.x,
        y: signal.y + 3.5,
        z: signal.z,
        w: signal.facing === 0 ? 0.34 : 0.86,
        d: signal.facing === 0 ? 0.86 : 0.34,
        h: 0.9,
        color: 0x2c3138
      });
      for (let i = 0; i < 3; i += 1) {
        signalHeads.push({
          x: signal.x,
          y: signal.y + 3.78 - i * 0.28,
          z: signal.z,
          w: signal.facing === 0 ? 0.36 : 0.24,
          d: signal.facing === 0 ? 0.24 : 0.36,
          h: 0.2,
          color: i === 0 ? 0xd6483a : i === 1 ? 0xe0b13c : 0x3fa86a
        });
      }
    }
    if (signalPoles.length) {
      group.add(this.#boxBatch('signal_poles', signalPoles, MATERIALS.darkMetal, true, false, dummy));
      group.add(this.#boxBatch('signal_heads', signalHeads, MATERIALS.accent, true, false, dummy));
    }

    // Street furniture: benches, bins, bollards, planters, signs and bus shelters.
    const batched = { bench: [], bin: [], bollard: [], planter: [], sign: [], shelterRoof: [], shelterSeat: [] };
    for (const item of this.layout.streetFurniture) {
      const { x, y, z, kind, facing = 0 } = item;
      const along = facing % 2 === 0 ? 1 : 0;
      if (kind === 'bench') {
        batched.bench.push({ x, y: y + 0.45, z, w: along ? 1.9 : 0.55, h: 0.14, d: along ? 0.55 : 1.9 });
        batched.bench.push({ x: x - (along ? 0.8 : 0), y: y + 0.24, z: z - (along ? 0 : 0.8), w: 0.14, h: 0.42, d: 0.14 });
        batched.bench.push({ x: x + (along ? 0.8 : 0), y: y + 0.24, z: z + (along ? 0 : 0.8), w: 0.14, h: 0.42, d: 0.14 });
      } else if (kind === 'bin') {
        batched.bin.push({ x, y: y + 0.42, z, w: 0.52, h: 0.84, d: 0.52, color: 0x3f4a44 });
      } else if (kind === 'bollard') {
        batched.bollard.push({ x, y: y + 0.4, z, w: 0.18, h: 0.8, d: 0.18, color: 0x4a5057 });
      } else if (kind === 'planter') {
        batched.planter.push({ x, y: y + 0.3, z, w: 1.2, h: 0.6, d: 1.2, color: 0x9d978b });
        batched.planter.push({ x, y: y + 0.85, z, w: 1.0, h: 0.7, d: 1.0, color: PALETTE.leaf });
      } else if (kind === 'sign') {
        batched.sign.push({ x, y: y + 1.3, z, w: 0.14, h: 2.6, d: 0.14, color: 0x7c848c });
        batched.sign.push({ x, y: y + 2.5, z, w: along ? 1.1 : 0.12, h: 0.5, d: along ? 0.12 : 1.1, color: 0x2f6fb5 });
      } else if (kind === 'shelter') {
        const width = 4.2;
        for (const [ox, oz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          const px = x + ox * (along ? width / 2 - 0.2 : 0.6);
          const pz = z + oz * (along ? 0.6 : width / 2 - 0.2);
          batched.shelterRoof.push({ x: px, y: y + 1.3, z: pz, w: 0.12, h: 2.6, d: 0.12, color: 0x7c848c });
        }
        batched.shelterRoof.push({ x, y: y + 2.7, z, w: along ? width : 1.9, h: 0.16, d: along ? 1.9 : width, color: 0x9aa2a8 });
        batched.shelterSeat.push({ x, y: y + 0.5, z: z - (along ? 0 : 0.5), w: along ? width - 1 : 0.5, h: 0.12, d: along ? 0.5 : width - 1, color: 0xb2764a });
      }
    }
    if (batched.bench.length) group.add(this.#boxBatch('furniture_bench', batched.bench, MATERIALS.accent, true, false, dummy));
    if (batched.bin.length) group.add(this.#boxBatch('furniture_bin', batched.bin, MATERIALS.accent, true, false, dummy));
    if (batched.bollard.length) group.add(this.#boxBatch('furniture_bollard', batched.bollard, MATERIALS.accent, true, false, dummy));
    if (batched.planter.length) group.add(this.#boxBatch('furniture_planter', batched.planter, MATERIALS.accent, true, false, dummy));
    if (batched.sign.length) group.add(this.#boxBatch('furniture_sign', batched.sign, MATERIALS.accent, true, false, dummy));
    if (batched.shelterRoof.length) group.add(this.#boxBatch('furniture_shelter', batched.shelterRoof, MATERIALS.accent, true, false, dummy));
    if (batched.shelterSeat.length) group.add(this.#boxBatch('furniture_shelter_seat', batched.shelterSeat, MATERIALS.accent, true, false, dummy));

    this.scene.add(group);
  }

  #buildRamps() {
    const group = new THREE.Group();
    group.name = 'jump_ramps';
    const dummy = new THREE.Object3D();
    const wedges = this.layout.ramps.map((ramp) => ({
      x: ramp.x,
      y: ramp.y + ramp.height / 2,
      z: ramp.z,
      w: ramp.width,
      h: ramp.height,
      d: ramp.length,
      rotation: ramp.angle
    }));
    if (wedges.length) {
      const mesh = new THREE.InstancedMesh(PLAIN_BOX, MATERIALS.metal, wedges.length);
      mesh.name = 'ramp_blocks';
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      wedges.forEach((wedge, index) => {
        dummy.position.set(wedge.x, wedge.y, wedge.z);
        dummy.scale.set(wedge.w, wedge.h, wedge.d);
        dummy.rotation.set(0, wedge.rotation, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      group.add(mesh);
    }
    this.scene.add(group);
  }

  #buildLandmarks() {
    const group = new THREE.Group();
    group.name = 'kl_landmarks';
    const built = buildLandmarks(this.layout);
    for (const landmark of built) {
      group.add(landmark.object);
      this.landmarkMeshes.set(landmark.id, landmark);
    }
    this.scene.add(group);
  }

  #buildCoins() {
    const group = new THREE.Group();
    group.name = 'coins';
    const geometry = new THREE.CylinderGeometry(0.7, 0.7, 0.18, 12);
    for (const coin of this.layout.coins) {
      const mesh = new THREE.Mesh(geometry, MATERIALS.coin);
      mesh.position.set(coin.x, coin.y, coin.z);
      mesh.castShadow = true;
      mesh.userData.coin = coin;
      mesh.userData.baseY = coin.y;
      group.add(mesh);
      coin.mesh = mesh;
    }
    this.scene.add(group);
    this.coinGroup = group;
  }

  update(elapsed) {
    if (!this.coinGroup) return;
    for (const coin of this.layout.coins) {
      if (coin.collected || !coin.mesh) continue;
      coin.mesh.rotation.y = elapsed * 2.4;
      coin.mesh.position.y = coin.baseY + Math.sin(elapsed * 2.6 + coin.x * 0.1) * 0.22;
    }
  }

  collectCoins(vehiclePosition, radius = 4.2) {
    let collected = 0;
    for (const coin of this.layout.coins) {
      if (coin.collected) continue;
      const dx = coin.x - vehiclePosition.x;
      const dz = coin.z - vehiclePosition.z;
      const dy = coin.y - vehiclePosition.y;
      if (dx * dx + dz * dz + dy * dy < radius * radius) {
        coin.collected = true;
        if (coin.mesh) coin.mesh.visible = false;
        collected += 1;
      }
    }
    return collected;
  }

  nearestLandmark(position) {
    let best = null;
    for (const landmark of this.layout.landmarks) {
      const distance = Math.hypot(landmark.x - position.x, landmark.z - position.z);
      if (!best || distance < best.distance) best = { landmark, distance };
    }
    return best;
  }
}

function randomLeaf(prop) {
  return (Math.abs(Math.round(prop.x * 7 + prop.z * 13)) % 3) === 0 ? PALETTE.leafLight : PALETTE.leaf;
}
