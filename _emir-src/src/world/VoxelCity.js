import * as THREE from 'three';
import { SpatialHash } from './SpatialHash.js';

const MATERIALS = {
  building: new THREE.MeshStandardMaterial({ roughness: 0.78, metalness: 0.03, vertexColors: true }),
  tower: new THREE.MeshStandardMaterial({ roughness: 0.54, metalness: 0.18, vertexColors: true }),
  road: new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0.0, vertexColors: true }),
  park: new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0.0, vertexColors: true }),
  sidewalk: new THREE.MeshStandardMaterial({ color: 0xd8c8a8, roughness: 0.9, metalness: 0.0 }),
  marking: new THREE.MeshStandardMaterial({ color: 0xffe066, roughness: 0.72, metalness: 0.0 }),
  treeTrunk: new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.88, metalness: 0.0 }),
  treeCanopy: new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.82, metalness: 0.0 }),
  palmFrond: new THREE.MeshStandardMaterial({ color: 0x168f52, roughness: 0.78, metalness: 0.0 }),
  sign: new THREE.MeshStandardMaterial({ color: 0xff5a5f, roughness: 0.55, metalness: 0.05 }),
  landmarkGlass: new THREE.MeshPhysicalMaterial({ color: 0x9bd8ff, roughness: 0.18, metalness: 0.32, transmission: 0.08, transparent: true, opacity: 0.86, clearcoat: 0.45 }),
  landmarkSteel: new THREE.MeshStandardMaterial({ color: 0xd7dde4, roughness: 0.31, metalness: 0.74 }),
  warmShop: new THREE.MeshStandardMaterial({ color: 0xf4c36b, roughness: 0.72, metalness: 0.02 })
};

const PALETTES = {
  building: [0xff7a59, 0xffb84d, 0x6c5ce7, 0x00b8a9, 0x4dabf7, 0xf06595, 0xf8f1e5],
  tower: [0x48dbfb, 0x5f27cd, 0xff9f43, 0x10ac84, 0xee5253],
  road: [0x4a5568, 0x56616f, 0x384152],
  park: [0x35c76f, 0x55efc4, 0x88d46b, 0x2ecc71]
};

const CHUNK_SIZE = 64;
const TMP_COLOR = new THREE.Color();

export class VoxelCity {
  constructor(scene) {
    this.scene = scene;
    this.cellSize = 4;
    this.voxels = [];
    this.spatialHash = new SpatialHash(20);
    this.solidSpatialHash = new SpatialHash(20);
    this.chunkMeshes = [];
    this.frustum = new THREE.Frustum();
    this.projectionMatrix = new THREE.Matrix4();
  }

  async load() {
    const base = import.meta.env.BASE_URL || '/';
    try {
      const response = await fetch(`${base}data/city-blocks.json`);
      if (!response.ok) throw new Error(`City data HTTP ${response.status}`);
      const data = await response.json();
      this.cellSize = data.cellSize || 4;
      this.voxels = data.voxels || [];
    } catch (error) {
      console.warn('Falling back to procedural toy city grid', error);
      this.voxels = makeFallbackVoxels();
      this.cellSize = 4;
    }
    this.spatialHash = new SpatialHash(this.cellSize * 5);
    for (const voxel of this.voxels) this.spatialHash.insert(voxel);
    this.solidSpatialHash = new SpatialHash(this.cellSize * 5);
    this.#addGroundPlane();
    this.#buildInstancedChunks();
    this.#addKualaLumpurLandmarks();
  }

  updateVisibility(camera, focusPosition) {
    this.projectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.projectionMatrix);
    let visible = 0;
    for (const chunk of this.chunkMeshes) {
      const distance = chunk.center.distanceTo(new THREE.Vector3(focusPosition.x, focusPosition.y, focusPosition.z));
      const inRange = distance < 360;
      const inFrustum = this.frustum.intersectsSphere(chunk.sphere);
      chunk.group.visible = inRange && inFrustum;
      if (chunk.group.visible) visible++;
    }
    return visible;
  }

  #addGroundPlane() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(960, 960, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x9be27f, roughness: 0.94, metalness: 0 })
    );
    ground.name = 'sunny_grass_ground';
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.13;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  #buildInstancedChunks() {
    const grouped = new Map();
    for (const voxel of this.voxels) {
      const cx = Math.floor(voxel.x / CHUNK_SIZE);
      const cz = Math.floor(voxel.z / CHUNK_SIZE);
      const key = `${cx},${cz}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(voxel);
    }

    const cube = new THREE.BoxGeometry(this.cellSize, this.cellSize, this.cellSize);
    const road = new THREE.BoxGeometry(this.cellSize, 0.24, this.cellSize);
    const dummy = new THREE.Object3D();

    for (const [key, voxels] of grouped.entries()) {
      const group = new THREE.Group();
      group.name = `city_chunk_${key}`;
      const byType = new Map();
      for (const voxel of voxels) {
        const type = voxel.type || 'building';
        if (!byType.has(type)) byType.set(type, []);
        byType.get(type).push(voxel);
      }

      const bounds = new THREE.Box3();
      for (const [type, items] of byType.entries()) {
        const mesh = new THREE.InstancedMesh(type === 'road' ? road : cube, MATERIALS[type] || MATERIALS.building, items.length);
        mesh.name = `instanced_${type}_${key}`;
        mesh.castShadow = type !== 'road' && type !== 'park';
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        items.forEach((voxel, index) => {
          dummy.position.set(voxel.x, voxel.y, voxel.z);
          dummy.rotation.set(0, voxel.r || 0, 0);
          const scaleY = voxel.hScale || 1;
          dummy.scale.set(1, scaleY, 1);
          dummy.updateMatrix();
          mesh.setMatrixAt(index, dummy.matrix);
          mesh.setColorAt(index, colorForVoxel(type, voxel));
          bounds.expandByPoint(dummy.position);
          this.#addSolidVoxelCollider(voxel, type, scaleY);
        });
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        group.add(mesh);
      }

      this.#addRoadDetails(group, byType.get('road') || []);
      this.#addParkDetails(group, byType.get('park') || []);
      this.#addCitySigns(group, voxels);

      bounds.expandByScalar(this.cellSize * 3);
      const sphere = new THREE.Sphere();
      bounds.getBoundingSphere(sphere);
      this.scene.add(group);
      this.chunkMeshes.push({ key, group, bounds, sphere, center: sphere.center.clone() });
    }
  }

  #addRoadDetails(group, roads) {
    if (!roads.length) return;
    const markings = roads.filter((voxel, index) => index % 7 === 0 && (Math.abs(voxel.x) < 16 || Math.abs(voxel.z) < 16));
    if (markings.length) {
      const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(this.cellSize * 0.18, 0.04, this.cellSize * 0.78), MATERIALS.marking, markings.length);
      mesh.name = `lane_markings_${group.name}`;
      mesh.receiveShadow = false;
      const dummy = new THREE.Object3D();
      markings.forEach((voxel, index) => {
        dummy.position.set(voxel.x, 0.2, voxel.z);
        dummy.rotation.y = Math.abs(voxel.x) < Math.abs(voxel.z) ? Math.PI / 2 : 0;
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      group.add(mesh);
    }

    const sidewalks = roads.filter((voxel, index) => index % 5 === 0);
    if (sidewalks.length) {
      const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(this.cellSize * 0.92, 0.16, this.cellSize * 0.16), MATERIALS.sidewalk, sidewalks.length * 2);
      mesh.name = `warm_sidewalk_edges_${group.name}`;
      const dummy = new THREE.Object3D();
      let index = 0;
      for (const voxel of sidewalks) {
        const eastWest = Math.abs(voxel.x) > Math.abs(voxel.z);
        for (const side of [-1, 1]) {
          dummy.position.set(voxel.x + (eastWest ? 0 : side * this.cellSize * 0.52), 0.22, voxel.z + (eastWest ? side * this.cellSize * 0.52 : 0));
          dummy.rotation.y = eastWest ? 0 : Math.PI / 2;
          dummy.updateMatrix();
          mesh.setMatrixAt(index++, dummy.matrix);
        }
      }
      mesh.instanceMatrix.needsUpdate = true;
      group.add(mesh);
    }
  }

  #addParkDetails(group, parks) {
    const trees = parks.filter((_, index) => index % 3 === 0).slice(0, 18);
    if (!trees.length) return;
    const trunk = new THREE.InstancedMesh(new THREE.BoxGeometry(0.7, 2.2, 0.7), MATERIALS.treeTrunk, trees.length);
    const canopy = new THREE.InstancedMesh(new THREE.BoxGeometry(2.8, 2.4, 2.8), MATERIALS.treeCanopy, trees.length);
    const dummy = new THREE.Object3D();
    trees.forEach((voxel, index) => {
      dummy.position.set(voxel.x, 1.05, voxel.z);
      dummy.rotation.y = hashUnit(voxel.x, voxel.z, 31) * Math.PI;
      dummy.updateMatrix();
      trunk.setMatrixAt(index, dummy.matrix);
      this.#insertSolidCollider({
        x: voxel.x,
        y: 1.1,
        z: voxel.z,
        type: 'treeTrunk',
        halfExtents: { x: 0.42, y: 1.1, z: 0.42 }
      });
      dummy.position.y = 2.85;
      dummy.scale.setScalar(0.78 + hashUnit(voxel.x, voxel.z, 41) * 0.42);
      dummy.updateMatrix();
      canopy.setMatrixAt(index, dummy.matrix);
      dummy.scale.setScalar(1);
    });
    trunk.instanceMatrix.needsUpdate = true;
    canopy.instanceMatrix.needsUpdate = true;
    trunk.castShadow = true;
    canopy.castShadow = true;
    group.add(trunk, canopy);
  }

  #addKualaLumpurLandmarks() {
    const group = new THREE.Group();
    group.name = 'kl_inspired_model_kit_landmarks';
    this.#addPetronasTwinTowers(group, -20, -72);
    this.#addKLTowerNeedle(group, 32, -72);
    this.#addMerdeka118Spire(group, 8, -126);
    this.#addTrxGlassTowers(group, 58, -34);
    this.#addShophouseRows(group, -74, 42);
    this.#addKLCCGatewaySign(group, -6, -46);
    this.#addMonorailGuideway(group);
    this.#addTropicalTerrainDetails(group);
    this.scene.add(group);
  }

  #addPetronasTwinTowers(group, x, z) {
    for (const side of [-1, 1]) {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 6.4, 74, 8), MATERIALS.landmarkGlass);
      tower.name = side < 0 ? 'petronas_twin_tower_left_faceted_silver' : 'petronas_twin_tower_right_faceted_silver';
      tower.position.set(x + side * 8, 37, z);
      tower.castShadow = true;
      tower.receiveShadow = true;
      group.add(tower);
      for (let y = 8; y < 72; y += 8) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(5.55, 0.08, 6, 8), MATERIALS.landmarkSteel);
        ring.name = 'petronas_tower_skyline_ring';
        ring.position.set(tower.position.x, y, z);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
      }
      const crown = new THREE.Mesh(new THREE.ConeGeometry(3.4, 14, 8), MATERIALS.landmarkSteel);
      crown.name = 'petronas_pointed_crown';
      crown.position.set(tower.position.x, 81, z);
      crown.castShadow = true;
      group.add(crown);
    }
    const skybridge = new THREE.Mesh(new THREE.BoxGeometry(17, 2.2, 2.8), MATERIALS.landmarkSteel);
    skybridge.name = 'petronas_twin_towers_skybridge';
    skybridge.position.set(x, 43, z);
    skybridge.castShadow = true;
    group.add(skybridge);
    this.#insertSolidCollider({ x, y: 34, z, type: 'petronasTwinTowers', halfExtents: { x: 19, y: 36, z: 8 } });
  }

  #addKLTowerNeedle(group, x, z) {
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.8, 70, 12), MATERIALS.landmarkSteel);
    shaft.name = 'kl_tower_needle_shaft';
    shaft.position.set(x, 35, z);
    shaft.castShadow = true;
    group.add(shaft);
    const deck = new THREE.Mesh(new THREE.SphereGeometry(6.2, 16, 8), MATERIALS.landmarkGlass);
    deck.name = 'kl_tower_observation_pod';
    deck.scale.y = 0.42;
    deck.position.set(x, 64, z);
    group.add(deck);
    const needle = new THREE.Mesh(new THREE.ConeGeometry(0.9, 24, 12), MATERIALS.landmarkSteel);
    needle.name = 'kl_tower_needle_spire';
    needle.position.set(x, 83, z);
    group.add(needle);
    this.#insertSolidCollider({ x, y: 32, z, type: 'klTowerNeedle', halfExtents: { x: 4, y: 32, z: 4 } });
  }

  #addMerdeka118Spire(group, x, z) {
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 9.4, 88, 5), MATERIALS.landmarkGlass);
    tower.name = 'merdeka_118_faceted_tower';
    tower.position.set(x, 44, z);
    tower.rotation.y = Math.PI / 5;
    tower.castShadow = true;
    group.add(tower);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(1.4, 32, 5), MATERIALS.landmarkSteel);
    spire.name = 'merdeka_118_long_spire';
    spire.position.set(x, 104, z);
    group.add(spire);
    this.#insertSolidCollider({ x, y: 44, z, type: 'merdeka118Spire', halfExtents: { x: 9, y: 44, z: 9 } });
  }

  #addTrxGlassTowers(group, x, z) {
    for (let i = 0; i < 5; i++) {
      const tower = new THREE.Mesh(new THREE.BoxGeometry(9 - i * 0.7, 34 + i * 7, 9 - i * 0.4), MATERIALS.landmarkGlass);
      tower.name = 'trx_style_glass_tower_cluster';
      tower.position.set(x + i * 10, (34 + i * 7) * 0.5, z + (i % 2) * 10);
      tower.rotation.y = (i - 2) * 0.13;
      tower.castShadow = true;
      group.add(tower);
      this.#insertSolidCollider({ x: tower.position.x, y: tower.position.y, z: tower.position.z, type: 'trxGlassTower', halfExtents: { x: 5, y: tower.position.y, z: 5 } });
    }
  }

  #addShophouseRows(group, x, z) {
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 7; i++) {
        const shop = new THREE.Mesh(new THREE.BoxGeometry(6, 5.2, 7), MATERIALS.warmShop);
        shop.name = 'heritage_shophouse_row_arch_window';
        shop.position.set(x + i * 6.4, 2.6, z + row * 10);
        shop.castShadow = true;
        group.add(shop);
        const arch = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.08, 6, 12, Math.PI), MATERIALS.landmarkSteel);
        arch.name = 'shophouse_arcade_arch';
        arch.position.set(shop.position.x, 3.4, shop.position.z - 3.56);
        arch.rotation.z = Math.PI;
        group.add(arch);
        this.#insertSolidCollider({ x: shop.position.x, y: 2.6, z: shop.position.z, type: 'shophouseRow', halfExtents: { x: 3, y: 2.6, z: 3.5 } });
      }
    }
  }

  #addKLCCGatewaySign(group, x, z) {
    const signMat = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.48, metalness: 0.08, emissive: 0x4a2f00, emissiveIntensity: 0.16 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.38, metalness: 0.36 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(12, 4.8, 0.42), frameMat);
    frame.name = 'klcc_gateway_arch_frame';
    frame.position.set(x, 4.2, z);
    frame.castShadow = true;
    group.add(frame);
    const face = new THREE.Mesh(new THREE.BoxGeometry(10.8, 3.5, 0.48), signMat);
    face.name = 'klcc_drive_landmark_sign';
    face.position.set(x, 4.25, z - 0.08);
    face.castShadow = true;
    group.add(face);
    for (const side of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 7.6, 8), frameMat);
      post.name = 'klcc_gateway_sign_post';
      post.position.set(x + side * 6.2, 3.8, z);
      post.castShadow = true;
      group.add(post);
      this.#insertSolidCollider({ x: post.position.x, y: 3.8, z, type: 'klccGatewayPost', halfExtents: { x: 0.42, y: 3.8, z: 0.42 } });
    }
  }

  #addMonorailGuideway(group) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(220, 1.3, 2.2), MATERIALS.landmarkSteel);
    rail.name = 'elevated_monorail_guideway_over_road';
    rail.position.set(0, 9.8, 28);
    rail.castShadow = true;
    group.add(rail);
    for (let x = -104; x <= 104; x += 16) {
      const pier = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.9, 9.5, 8), MATERIALS.landmarkSteel);
      pier.name = 'monorail_concrete_pier';
      pier.position.set(x, 4.8, 28);
      pier.castShadow = true;
      group.add(pier);
      this.#insertSolidCollider({ x, y: 4.8, z: 28, type: 'monorailPier', halfExtents: { x: 0.9, y: 4.8, z: 0.9 } });
    }
  }

  #addTropicalTerrainDetails(group) {
    for (let i = 0; i < 42; i++) {
      const x = -130 + hashUnit(i, 17, 5) * 260;
      const z = -118 + hashUnit(i, 31, 9) * 236;
      if (Math.abs(x) < 20 || Math.abs(z) < 20) continue;
      const palm = new THREE.Group();
      palm.name = 'tropical_palm_cluster';
      palm.position.set(x, 0, z);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 5.8, 7), MATERIALS.treeTrunk);
      trunk.position.y = 2.9;
      trunk.rotation.z = (hashUnit(i, 0, 19) - 0.5) * 0.18;
      const fronds = new THREE.Group();
      fronds.name = 'palm_frond_star';
      fronds.position.y = 5.9;
      for (let arm = 0; arm < 7; arm++) {
        const frond = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 3.6), MATERIALS.palmFrond);
        frond.position.z = 1.35;
        frond.rotation.x = -0.34;
        frond.rotation.y = arm / 7 * Math.PI * 2;
        fronds.add(frond);
      }
      palm.add(trunk, fronds);
      group.add(palm);
      this.#insertSolidCollider({ x, y: 2.8, z, type: 'tropicalPalm', halfExtents: { x: 0.45, y: 2.8, z: 0.45 } });
    }
  }

  #addCitySigns(group, voxels) {
    const anchor = voxels.find((voxel) => voxel.type === 'road') || voxels[0];
    if (!anchor || Math.abs(Math.round(anchor.x + anchor.z)) % 128 !== 0) return;
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.2, 0.22), MATERIALS.treeTrunk);
    const sign = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.2, 0.18), MATERIALS.sign);
    pole.name = `street_sign_pole_${group.name}`;
    sign.name = `colorful_street_sign_${group.name}`;
    pole.position.set(anchor.x + 3.2, 1.6, anchor.z + 3.2);
    sign.position.set(anchor.x + 3.2, 3.1, anchor.z + 3.2);
    this.#insertSolidCollider({
      x: pole.position.x,
      y: pole.position.y,
      z: pole.position.z,
      type: 'streetSignPole',
      halfExtents: { x: 0.18, y: 1.6, z: 0.18 }
    });
    this.#insertSolidCollider({
      x: sign.position.x,
      y: sign.position.y,
      z: sign.position.z,
      type: 'streetSign',
      halfExtents: { x: 1.55, y: 0.6, z: 0.14 }
    });
    pole.castShadow = true;
    sign.castShadow = true;
    group.add(pole, sign);
  }

  #addSolidVoxelCollider(voxel, type, scaleY = 1) {
    if (type !== 'building' && type !== 'tower') return;
    const half = this.cellSize * 0.5;
    this.#insertSolidCollider({
      x: voxel.x,
      y: voxel.y,
      z: voxel.z,
      type,
      halfExtents: { x: half, y: half * scaleY, z: half }
    });
  }

  #insertSolidCollider(record) {
    this.solidSpatialHash.insert(record);
  }
}

function colorForVoxel(type, voxel) {
  const palette = PALETTES[type] || PALETTES.building;
  const base = palette[Math.floor(hashUnit(voxel.x, voxel.z, voxel.y || 0) * palette.length) % palette.length];
  TMP_COLOR.setHex(base);
  const lift = type === 'building' || type === 'tower'
    ? 0.86 + Math.min(0.24, (voxel.y || 0) / 80) + hashUnit(voxel.z, voxel.x, 7) * 0.14
    : 0.9 + hashUnit(voxel.x, voxel.z, 11) * 0.12;
  return TMP_COLOR.clone().multiplyScalar(lift);
}

function hashUnit(x, z, salt = 0) {
  const n = Math.sin(x * 12.9898 + z * 78.233 + salt * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

function makeFallbackVoxels() {
  const voxels = [];
  for (let x = -180; x <= 180; x += 4) {
    voxels.push({ x, y: 0.05, z: 0, type: 'road' });
    voxels.push({ x: 0, y: 0.05, z: x, type: 'road' });
    if (x % 24 === 0) {
      voxels.push({ x, y: 0.05, z: 24, type: 'park' });
      voxels.push({ x: -24, y: 0.05, z: x, type: 'park' });
    }
  }
  for (let bx = -144; bx <= 144; bx += 24) {
    for (let bz = -144; bz <= 144; bz += 24) {
      if (Math.abs(bx) < 18 || Math.abs(bz) < 18) continue;
      const levels = 2 + Math.abs((bx * 13 + bz * 7) % 9);
      for (let level = 0; level < levels; level++) voxels.push({ x: bx, y: 2 + level * 4, z: bz, type: level > 7 ? 'tower' : 'building' });
    }
  }
  return voxels;
}
