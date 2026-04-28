import * as THREE from 'three';
import { SpatialHash } from './SpatialHash.js';

const MATERIALS = {
  building: new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.86, metalness: 0.02 }),
  tower: new THREE.MeshStandardMaterial({ color: 0x2f2f2f, roughness: 0.78, metalness: 0.07 }),
  road: new THREE.MeshStandardMaterial({ color: 0x6f695d, roughness: 0.95, metalness: 0.0 }),
  park: new THREE.MeshStandardMaterial({ color: 0x6d7756, roughness: 0.92, metalness: 0.0 })
};

const CHUNK_SIZE = 64;

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
      const response = await fetch(`${base}data/kl-voxels.json`);
      if (!response.ok) throw new Error(`City data HTTP ${response.status}`);
      const data = await response.json();
      this.cellSize = data.cellSize || 4;
      this.voxels = data.voxels || [];
    } catch (error) {
      console.warn('Falling back to procedural KL micro-grid', error);
      this.voxels = makeFallbackVoxels();
      this.cellSize = 4;
    }
    this.spatialHash = new SpatialHash(this.cellSize * 5);
    for (const voxel of this.voxels) this.spatialHash.insert(voxel);
    this.#buildInstancedChunks();
  }

  updateVisibility(camera, focusPosition) {
    this.projectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.projectionMatrix);
    let visible = 0;
    for (const chunk of this.chunkMeshes) {
      const distance = chunk.center.distanceTo(new THREE.Vector3(focusPosition.x, focusPosition.y, focusPosition.z));
      const inRange = distance < 330;
      const inFrustum = this.frustum.intersectsSphere(chunk.sphere);
      chunk.group.visible = inRange && inFrustum;
      if (chunk.group.visible) visible++;
    }
    return visible;
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
    const road = new THREE.BoxGeometry(this.cellSize, 0.22, this.cellSize);
    const dummy = new THREE.Object3D();

    for (const [key, voxels] of grouped.entries()) {
      const group = new THREE.Group();
      group.name = `kl_chunk_${key}`;
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
        mesh.castShadow = type !== 'road';
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        items.forEach((voxel, index) => {
          dummy.position.set(voxel.x, voxel.y, voxel.z);
          dummy.rotation.set(0, voxel.r || 0, 0);
          const scaleY = voxel.hScale || 1;
          dummy.scale.set(1, scaleY, 1);
          dummy.updateMatrix();
          mesh.setMatrixAt(index, dummy.matrix);
          bounds.expandByPoint(dummy.position);
        });
        mesh.instanceMatrix.needsUpdate = true;
        group.add(mesh);
      }

      bounds.expandByScalar(this.cellSize * 2);
      const sphere = new THREE.Sphere();
      bounds.getBoundingSphere(sphere);
      this.scene.add(group);
      this.chunkMeshes.push({ key, group, bounds, sphere, center: sphere.center.clone() });
    }
  }
}

function makeFallbackVoxels() {
  const voxels = [];
  for (let x = -160; x <= 160; x += 4) {
    voxels.push({ x, y: 0.05, z: 0, type: 'road' });
    voxels.push({ x: 0, y: 0.05, z: x, type: 'road' });
  }
  for (let bx = -120; bx <= 120; bx += 24) {
    for (let bz = -120; bz <= 120; bz += 24) {
      if (Math.abs(bx) < 18 || Math.abs(bz) < 18) continue;
      const levels = 2 + Math.abs((bx * 13 + bz * 7) % 9);
      for (let level = 0; level < levels; level++) voxels.push({ x: bx, y: 2 + level * 4, z: bz, type: level > 7 ? 'tower' : 'building' });
    }
  }
  return voxels;
}
