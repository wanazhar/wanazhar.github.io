import * as THREE from 'three';
import { VOXEL_PALETTE } from '../VoxelInstancer.js';
import { createGeneratedDetailChunkPlan, GENERATED_DETAIL_VISIBLE_BUDGET, GENERATED_DETAIL_MATERIALS } from './generatedDetailConfig.js';
import { chunkDistance, chunkCoordsForPosition } from '../chunks/chunkVisibility.js';
import { BLOCK_PITCH, isStreetCoord, streetLinesWithin } from '../layout/streetGrid.js';

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

function createMaterial(key) {
  return new THREE.MeshLambertMaterial({
    color: VOXEL_PALETTE[key],
    flatShading: true,
    fog: true
  });
}

const SIDEWALK_OFFSET = 2.5;
const SPACING = 7;

function addPropBox(list, x, y, z, sx, sy, sz, key) {
  list.push({ x, y, z, sx, sy, sz, key });
}

function buildProp(kind, x, z, ground) {
  const boxes = [];
  const put = (y, sx, sy, sz, key) => addPropBox(boxes, x, y, z, sx, sy, sz, key);

  switch (kind) {
    case 'lamp':
      put(ground + 2.1, 0.3, 4.2, 0.3, 'concreteDark');
      put(ground + 4.4, 0.9, 0.4, 0.9, 'lampGlow');
      break;
    case 'tree':
      put(ground + 1.6, 0.6, 3.2, 0.6, 'treeTrunk');
      put(ground + 3.6, 3, 2, 3, 'treeLeaf');
      put(ground + 4.8, 2, 1.2, 2, 'treeLeaf2');
      break;
    case 'bench':
      put(ground + 0.65, 2.2, 0.4, 0.8, 'silver');
      put(ground + 0.3, 0.3, 0.6, 0.7, 'concreteDark');
      put(ground + 0.3, 0.3, 0.6, 0.7, 'concreteDark');
      break;
    case 'bin':
      put(ground + 0.6, 0.9, 1.2, 0.9, 'stationRoof');
      break;
    case 'car':
      put(ground + 0.65, 2.6, 0.9, 1.3, 'silver');
      put(ground + 1.25, 1.4, 0.5, 1.1, 'concreteDark');
      break;
    case 'sign':
      put(ground + 1.7, 0.25, 3.4, 0.25, 'concreteDark');
      put(ground + 3.5, 1.7, 1, 0.22, 'warning');
      break;
    case 'hydrant':
      put(ground + 0.6, 0.5, 1.2, 0.5, 'warning');
      break;
    case 'planter':
      put(ground + 0.35, 1.7, 0.7, 1.7, 'concreteDark');
      put(ground + 0.85, 1.4, 0.5, 1.4, 'treeLeaf');
      break;
    default:
      put(ground + 0.5, 0.9, 1, 0.9, 'stationRoof');
  }
  return boxes;
}

function chooseKind(random) {
  const roll = random();
  if (roll < 0.3) return 'lamp';
  if (roll < 0.55) return 'tree';
  if (roll < 0.62) return 'bench';
  if (roll < 0.68) return 'bin';
  if (roll < 0.78) return 'car';
  if (roll < 0.86) return 'sign';
  if (roll < 0.92) return 'planter';
  if (roll < 0.96) return 'hydrant';
  return 'bin';
}

export class GeneratedDetailLayer {
  constructor(scene, terrain, options = {}) {
    this.scene = scene;
    this.terrain = terrain;
    this.collision = options.collision ?? null;
    this.chunkSize = options.chunkSize ?? 64;
    this.baseVisibleInstances = options.baseVisibleInstances ?? 0;
    this.visibleBudget = options.visibleBudget ?? GENERATED_DETAIL_VISIBLE_BUDGET;
    this.detailBudget = this.visibleBudget;
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
    this.baseVisibleInstances = Math.max(0, count ?? 0);
  }

  setVisibleBudget(budget) {
    const next = Math.max(0, budget ?? 0);
    if (next !== this.visibleBudget) this.lastOrigin = null;
    this.visibleBudget = next;
    this.detailBudget = next;
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
      if (chunk.authoredCount <= 0) continue;
      if (authored >= this.detailBudget && chosen.length > 0) break;
      if (chunk.distance > 3 && authored > this.detailBudget * 0.85) break;
      chosen.push(chunk);
      authored += chunk.authoredCount;
    }
    return { origin, chunks: chosen, authored };
  }

  collectProps(chunk) {
    const props = [];
    const x0 = chunk.cx * this.chunkSize;
    const z0 = chunk.cz * this.chunkSize;
    const x1 = x0 + this.chunkSize;
    const z1 = z0 + this.chunkSize;
    const random = mulberry32(seedForChunk(chunk.cx, chunk.cz));

    const verticalLines = streetLinesWithin(x0 - BLOCK_PITCH, x1 + BLOCK_PITCH);
    for (const line of verticalLines) {
      let index = 0;
      for (let z = z0; z < z1; z += SPACING, index += 1) {
        if (isStreetCoord(z)) continue;
        const side = index % 2 === 0 ? 1 : -1;
        const x = line + side * SIDEWALK_OFFSET;
        if (this.isBlocked(x, z)) continue;
        props.push(...buildProp(chooseKind(random), x, z, this.terrain.surfaceYAt(x, z)));
      }
    }

    const horizontalLines = streetLinesWithin(z0 - BLOCK_PITCH, z1 + BLOCK_PITCH);
    for (const line of horizontalLines) {
      let index = 0;
      for (let x = x0; x < x1; x += SPACING, index += 1) {
        if (isStreetCoord(x)) continue;
        const side = index % 2 === 0 ? -1 : 1;
        const z = line + side * SIDEWALK_OFFSET;
        if (this.isBlocked(x, z)) continue;
        props.push(...buildProp(chooseKind(random), x, z, this.terrain.surfaceYAt(x, z)));
      }
    }

    return props;
  }

  isBlocked(x, z) {
    return this.collision ? this.collision.isBlocked(x, z) : false;
  }

  createChunkGroup(chunk, renderCount) {
    const group = new THREE.Group();
    group.name = `generated_detail_${chunk.id}`;

    const props = this.collectProps(chunk);
    const limit = Math.min(renderCount, props.length * 1);
    const byMaterial = new Map(GENERATED_DETAIL_MATERIALS.map((key) => [key, []]));
    for (let index = 0; index < props.length && byMaterial.get(props[index].key).length < limit; index += 1) {
      const prop = props[index];
      byMaterial.get(prop.key).push(prop);
    }

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    let rendered = 0;

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
      rendered += data.length;
    }

    group.userData.generatedDetail = { id: chunk.id, authoredCount: chunk.authoredCount, renderCount: rendered };
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
