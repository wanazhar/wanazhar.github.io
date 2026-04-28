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
  sign: new THREE.MeshStandardMaterial({ color: 0xff5a5f, roughness: 0.55, metalness: 0.05 })
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
    this.#addGroundPlane();
    this.#buildInstancedChunks();
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

  #addCitySigns(group, voxels) {
    const anchor = voxels.find((voxel) => voxel.type === 'road') || voxels[0];
    if (!anchor || Math.abs(Math.round(anchor.x + anchor.z)) % 128 !== 0) return;
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.2, 0.22), MATERIALS.treeTrunk);
    const sign = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.2, 0.18), MATERIALS.sign);
    pole.name = `street_sign_pole_${group.name}`;
    sign.name = `colorful_street_sign_${group.name}`;
    pole.position.set(anchor.x + 3.2, 1.6, anchor.z + 3.2);
    sign.position.set(anchor.x + 3.2, 3.1, anchor.z + 3.2);
    pole.castShadow = true;
    sign.castShadow = true;
    group.add(pole, sign);
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
