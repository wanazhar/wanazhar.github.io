import * as THREE from 'three';
import { WORLD } from '../config.js';
import { BIOMES, heightAt, biomeAt, onBridge } from './Terrain.js';
import { createBlockGeometry, getMaterial } from './Palette.js';
import { cellJitter } from './Terrain.js';

// Maps a biome to its surface material.
const SURFACE_MATERIAL = {
  [BIOMES.ocean]: 'oceanFloor',
  [BIOMES.shallow]: 'sandWet',
  [BIOMES.river]: 'paddyWater',
  [BIOMES.sand]: 'sand',
  [BIOMES.grass]: 'grass',
  [BIOMES.meadow]: 'meadow',
  [BIOMES.forest]: 'grassDeep',
  [BIOMES.paddy]: 'paddyMud',
  [BIOMES.orchard]: 'orchardGrass',
  [BIOMES.dirt]: 'dirt',
  [BIOMES.rock]: 'rock'
};

// Sub-surface materials. Turf has a visible edge: the side of a grass block is
// a slightly cooler, darker green than its top face, which is what makes a flat
// voxel field read as ground with depth rather than as a green plane.
const SUBSURFACE_MATERIAL = {
  [BIOMES.ocean]: 'oceanFloor',
  [BIOMES.shallow]: 'oceanFloor',
  [BIOMES.river]: 'paddyWater',
  [BIOMES.sand]: 'sand',
  [BIOMES.grass]: 'grassSide',
  [BIOMES.meadow]: 'dirt',
  [BIOMES.forest]: 'grassDeepSide',
  [BIOMES.paddy]: 'paddyMud',
  [BIOMES.orchard]: 'orchardGrassSide',
  [BIOMES.dirt]: 'dirt',
  [BIOMES.rock]: 'rockDark'
};

export class ChunkMeshes {
  constructor(cx, cz) {
    this.cx = cx;
    this.cz = cz;
    this.meshes = [];
  }

  add(mesh) {
    this.meshes.push(mesh);
  }

  dispose(scene) {
    for (const mesh of this.meshes) {
      scene.remove(mesh);
      mesh.geometry.dispose();
    }
    this.meshes.length = 0;
  }

  get count() {
    return this.meshes.length;
  }
}

// Emits the static terrain boxes for one chunk as per-material instance lists.
// Kept free of Three.js scene objects so it can be exercised from Node.
export function buildTerrainBoxes(cx, cz) {
  const size = WORLD.chunkSize;
  const originX = cx * size;
  const originZ = cz * size;
  const boxes = new Map();

  const push = (material, x, y, z, sx = 1, sy = 1, sz = 1) => {
    let list = boxes.get(material);
    if (!list) {
      list = [];
      boxes.set(material, list);
    }
    list.push({ x, y, z, sx, sy, sz });
  };

  for (let lx = 0; lx < size; lx += 1) {
    for (let lz = 0; lz < size; lz += 1) {
      const x = originX + lx;
      const z = originZ + lz;
      const h = heightAt(x, z);
      const biome = biomeAt(x, z);

      const surface = SURFACE_MATERIAL[biome] ?? 'dirt';
      const subsurface = SUBSURFACE_MATERIAL[biome] ?? 'dirt';

      // Wet sand darkens right at the waterline.
      const isShore = h <= WORLD.seaLevel + 1 && biome === BIOMES.sand;
      push(isShore ? 'sandWet' : surface, x + 0.5, h, z + 0.5);

      // Fill the visible sides of the column. We only need the top few
      // blocks: everything deeper is hidden by the block above it.
      const depth = Math.min(h - WORLD.seaLevel + 3, 5);
      for (let i = 1; i <= depth; i += 1) {
        const y = h - i;
        if (y < WORLD.seaLevel - 6) break;
        // Skip blocks fully enclosed by their neighbours on all four sides.
        if (
          heightAt(x + 1, z) > y &&
          heightAt(x - 1, z) > y &&
          heightAt(x, z + 1) > y &&
          heightAt(x, z - 1) > y
        ) {
          continue;
        }
        // Bridge decks and stone riverbanks use masonry instead of soil.
        const onBank = h <= WORLD.seaLevel + 2 && onBridge(x, z);
        push(onBank ? 'stone' : subsurface, x + 0.5, y, z + 0.5);
      }
    }
  }

  // Scattered surface detail: grass tufts, reeds, small stones. Uses the
  // per-column hash so the scatter is identical on every machine.
  for (let lx = 0; lx < size; lx += 1) {
    for (let lz = 0; lz < size; lz += 1) {
      const x = originX + lx;
      const z = originZ + lz;
      const h = heightAt(x, z);
      if (h <= WORLD.seaLevel) continue;
      const biome = biomeAt(x, z);

      const r = cellJitter(x, z, 4211);
      if (biome === BIOMES.grass || biome === BIOMES.meadow || biome === BIOMES.forest) {
        if (r > 0.86) push('grassTuft', x + 0.5, h + 0.18, z + 0.5, 0.16, 0.36, 0.16);
      } else if (biome === BIOMES.paddy) {
        if (r > 0.9) push('riceGreen', x + 0.5, h + 0.22, z + 0.5, 0.2, 0.44, 0.2);
      } else if (biome === BIOMES.orchard) {
        if (r > 0.92) push('riceGold', x + 0.5, h + 0.2, z + 0.5, 0.18, 0.4, 0.18);
      } else if (biome === BIOMES.sand) {
        if (r > 0.94) push('rock', x + 0.5, h + 0.1, z + 0.5, 0.18, 0.2, 0.18);
      } else if (biome === BIOMES.rock) {
        if (r > 0.9) push('rockDark', x + 0.5, h + 0.12, z + 0.5, 0.3, 0.24, 0.3);
      }
    }
  }

  return boxes;
}

// Converts per-material box lists into one InstancedMesh per material and
// adds them to the scene.
export function instantiateChunk(cx, cz, boxes, geometry, materials, scene) {
  const chunk = new ChunkMeshes(cx, cz);
  const dummy = new THREE.Object3D();

  for (const [materialName, list] of boxes) {
    if (list.length === 0) continue;
    const material = getMaterial(materials, materialName);
    const mesh = new THREE.InstancedMesh(geometry, material, list.length);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.frustumCulled = true;

    for (let i = 0; i < list.length; i += 1) {
      const b = list[i];
      dummy.position.set(b.x, b.y, b.z);
      dummy.scale.set(b.sx, b.sy, b.sz);
      // Builders may pitch a box (sloped roofs) and/or yaw it (rotated props).
      dummy.rotation.set(b.rx ?? 0, b.ry ?? 0, b.rz ?? 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    scene.add(mesh);
    chunk.add(mesh);
  }

  return chunk;
}

export function buildChunk(cx, cz, geometry, materials, scene) {
  return instantiateChunk(cx, cz, buildTerrainBoxes(cx, cz), geometry, materials, scene);
}