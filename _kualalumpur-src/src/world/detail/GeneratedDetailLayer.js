import * as THREE from 'three';
import { VOXEL_PALETTE } from '../VoxelInstancer.js';
import { createGeneratedDetailChunkPlan, GENERATED_DETAIL_VISIBLE_BUDGET, GENERATED_DETAIL_MATERIALS } from './generatedDetailConfig.js';
import { chunkDistance, chunkCoordsForPosition } from '../chunks/chunkVisibility.js';

function mulberry32(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedForChunk(cx, cz) {
  return ((cx + 101) * 73856093) ^ ((cz + 103) * 19349663) ^ 0x9e3779b9;
}

function sampleUrbanUse(random, localZ) {
  const roll = random();
  if (Math.abs(localZ) < 0.055 && roll < 0.55) return 'road';
  if (roll < 0.035) return 'grassDark';
  if (roll < 0.075) return 'lampGlow';
  if (roll < 0.48) return 'concrete';
  return 'glassDark';
}

function materialForSample(random, localZ) {
  return sampleUrbanUse(random, localZ);
}

function createMaterial(key) {
  return new THREE.MeshLambertMaterial({
    color: VOXEL_PALETTE[key],
    flatShading: true,
    fog: true
  });
}

export class GeneratedDetailLayer {
  constructor(scene, terrain, options = {}) {
    this.scene = scene;
    this.terrain = terrain;
    this.chunkSize = options.chunkSize ?? 64;
    this.baseVisibleInstances = options.baseVisibleInstances ?? 0;
    this.visibleBudget = options.visibleBudget ?? GENERATED_DETAIL_VISIBLE_BUDGET;
    this.detailBudget = Math.max(0, this.visibleBudget - this.baseVisibleInstances);
    this.chunkPlan = options.chunkPlan ?? createGeneratedDetailChunkPlan();
    this.loaded = new Map();
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry.computeBoundingBox();
    this.materials = new Map(GENERATED_DETAIL_MATERIALS.map((key) => [key, createMaterial(key)]));
    this.lastOrigin = null;
    this.visibleAuthored = 0;
    this.visibleRendered = 0;
  }

  setBaseVisibleInstances(count) {
    const next = Math.max(0, count ?? 0);
    if (next !== this.baseVisibleInstances) this.lastOrigin = null;
    this.baseVisibleInstances = next;
    this.detailBudget = Math.max(0, this.visibleBudget - this.baseVisibleInstances);
  }

  setVisibleBudget(budget) {
    const next = Math.max(0, budget ?? 0);
    if (next !== this.visibleBudget) this.lastOrigin = null;
    this.visibleBudget = next;
    this.detailBudget = Math.max(0, this.visibleBudget - this.baseVisibleInstances);
  }

  chooseChunks(position) {
    const origin = chunkCoordsForPosition(position.x, position.z, this.chunkSize);
    const ranked = this.chunkPlan
      .map((chunk) => ({ ...chunk, distance: chunkDistance(chunk, origin) }))
      .sort((a, b) => a.distance - b.distance || b.authoredCount - a.authoredCount);

    const chosen = [];
    let authored = 0;
    if (this.detailBudget <= 0) return { origin, chunks: [], authored };
    for (const chunk of ranked) {
      if (authored >= this.detailBudget && chosen.length > 0) break;
      if (chunk.distance > 4 && authored > this.detailBudget * 0.85) break;
      chosen.push(chunk);
      authored += chunk.authoredCount;
    }
    return { origin, chunks: chosen, authored };
  }

  createChunkGroup(chunk, renderCount) {
    const group = new THREE.Group();
    group.name = `generated_detail_${chunk.id}`;
    group.userData.generatedDetail = { id: chunk.id, authoredCount: chunk.authoredCount, renderCount };

    const byMaterial = new Map(GENERATED_DETAIL_MATERIALS.map((key) => [key, []]));
    const random = mulberry32(seedForChunk(chunk.cx, chunk.cz));
    const originX = chunk.cx * this.chunkSize;
    const originZ = chunk.cz * this.chunkSize;

    for (let index = 0; index < renderCount; index += 1) {
      const lx = random();
      const lz = random();
      const worldX = originX + lx * this.chunkSize;
      const worldZ = originZ + lz * this.chunkSize;
      const y = this.terrain.surfaceYAt(worldX, worldZ);
      const localZ = lz - 0.5;
      const key = materialForSample(random, localZ);
      const towerish = key === 'glassDark';
      const midRise = key === 'concrete';
      const sx = towerish ? 1.1 + random() * 1.9 : midRise ? 1.2 + random() * 2.2 : 0.8 + random() * 1.8;
      const sz = towerish ? 1.1 + random() * 1.9 : midRise ? 1.2 + random() * 2.2 : 0.8 + random() * 1.8;
      const sy = key === 'road' ? 0.08 : key === 'lampGlow' ? 0.5 : towerish ? 5 + random() * 18 : midRise ? 2 + random() * 7 : 0.35 + random() * 1.1;
      byMaterial.get(key).push({ x: worldX, y: y + sy / 2 + 0.08, z: worldZ, sx, sy, sz });
    }

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    for (const [key, data] of byMaterial.entries()) {
      if (!data.length) continue;
      const mesh = new THREE.InstancedMesh(this.geometry, this.materials.get(key), data.length);
      mesh.name = `generated_detail_${key}_${chunk.id}`;
      mesh.userData.voxelMaterialKey = key;
      mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      mesh.castShadow = false;
      mesh.receiveShadow = true;
      data.forEach((item, index) => {
        position.set(item.x, item.y, item.z);
        scale.set(item.sx, item.sy, item.sz);
        matrix.compose(position, quaternion, scale);
        mesh.setMatrixAt(index, matrix);
      });
      mesh.computeBoundingSphere();
      group.add(mesh);
    }

    this.scene.add(group);
    return group;
  }

  update(position) {
    const { origin, chunks, authored } = this.chooseChunks(position);
    if (this.lastOrigin && this.lastOrigin.cx === origin.cx && this.lastOrigin.cz === origin.cz) {
      return { changed: false, visibleAuthored: this.visibleAuthored, visibleRendered: this.visibleRendered };
    }
    this.lastOrigin = origin;
    const active = new Set(chunks.map((chunk) => chunk.id));
    let changed = false;
    let rendered = 0;

    const renderScale = authored > this.detailBudget ? this.detailBudget / authored : 1;
    for (const chunk of chunks) {
      const renderCount = Math.max(1, Math.floor(chunk.authoredCount * renderScale));
      const loadedGroup = this.loaded.get(chunk.id);
      if (loadedGroup && loadedGroup.userData.generatedDetail.renderCount !== renderCount) {
        this.scene.remove(loadedGroup);
        this.loaded.delete(chunk.id);
        changed = true;
      }
      if (!this.loaded.has(chunk.id)) {
        this.loaded.set(chunk.id, this.createChunkGroup(chunk, renderCount));
        changed = true;
      }
      const group = this.loaded.get(chunk.id);
      if (!group.visible) {
        group.visible = true;
        changed = true;
      }
      rendered += group.userData.generatedDetail.renderCount;
    }

    for (const [id, group] of this.loaded.entries()) {
      if (!active.has(id) && group.visible) {
        group.visible = false;
        changed = true;
      }
    }

    this.visibleAuthored = authored;
    this.visibleRendered = rendered;
    return { changed, visibleAuthored: authored, visibleRendered: rendered };
  }

  getStats() {
    const activeChunks = [...this.loaded.values()].filter((group) => group.visible).length;
    return {
      authoredTotal: this.chunkPlan.reduce((sum, chunk) => sum + chunk.authoredCount, 0),
      chunks: this.chunkPlan.length,
      loadedChunks: this.loaded.size,
      activeChunks,
      visibleAuthored: this.visibleAuthored,
      visibleRendered: this.visibleRendered,
      visibleBudget: this.visibleBudget,
      detailBudget: this.detailBudget
    };
  }
}
