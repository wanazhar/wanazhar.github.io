import * as THREE from 'three';
import { DEFAULT_CHUNK_SIZE, chunkIdForPosition } from './chunkVisibility.js';

export class MaterialRegistry {
  constructor(palette) {
    this.palette = palette;
    this.materials = new Map();
  }

  get(key) {
    if (this.materials.has(key)) return this.materials.get(key);
    const color = this.palette[key];
    if (color === undefined) return null;
    const material = new THREE.MeshLambertMaterial({
      color,
      flatShading: true,
      fog: true
    });
    this.materials.set(key, material);
    return material;
  }

  dispose() {
    this.materials.forEach((material) => material.dispose());
    this.materials.clear();
  }
}

export function bucketInstancesByChunk(instancesByMaterial, options = {}) {
  const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const chunks = new Map();

  for (const [materialKey, data] of instancesByMaterial.entries()) {
    for (const item of data) {
      const chunkId = chunkIdForPosition(item.x, item.z, chunkSize);
      if (!chunks.has(chunkId)) {
        const [cx, cz] = chunkId.split('_').map(Number);
        chunks.set(chunkId, {
          id: chunkId,
          cx,
          cz,
          count: 0,
          materials: new Map()
        });
      }
      const chunk = chunks.get(chunkId);
      if (!chunk.materials.has(materialKey)) chunk.materials.set(materialKey, []);
      chunk.materials.get(materialKey).push(item);
      chunk.count += 1;
    }
  }

  return [...chunks.values()].sort((a, b) => a.cx - b.cx || a.cz - b.cz);
}

export class ChunkInstancer {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.palette = options.palette;
    this.castShadow = options.castShadow ?? false;
    this.receiveShadow = options.receiveShadow ?? true;
    this.geometry = options.geometry ?? new THREE.BoxGeometry(1, 1, 1);
    this.geometry.computeBoundingBox();
    this.materialRegistry = options.materialRegistry ?? new MaterialRegistry(this.palette);
  }

  createChunkGroup(chunk) {
    const group = new THREE.Group();
    group.name = `voxel_chunk_${chunk.id}`;
    const materialCounts = {};
    group.userData.voxelChunk = { id: chunk.id, count: chunk.count, cx: chunk.cx, cz: chunk.cz, materialCounts };

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    let meshCount = 0;

    for (const [key, data] of chunk.materials.entries()) {
      const material = this.materialRegistry.get(key);
      if (!material) {
        console.warn(`Missing voxel palette color: ${key}`);
        continue;
      }

      materialCounts[key] = data.length;
      const mesh = new THREE.InstancedMesh(this.geometry, material, data.length);
      mesh.name = `voxels_${key}_chunk_${chunk.id}`;
      mesh.userData.voxelMaterialKey = key;
      mesh.castShadow = this.castShadow;
      mesh.receiveShadow = this.receiveShadow;
      mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);

      data.forEach((item, index) => {
        position.set(item.x, item.y, item.z);
        scale.set(item.sx, item.sy, item.sz);
        matrix.compose(position, quaternion, scale);
        mesh.setMatrixAt(index, matrix);
      });

      mesh.computeBoundingSphere();
      group.add(mesh);
      meshCount += 1;
    }

    this.scene.add(group);
    return { group, meshCount, materialCounts };
  }
}
