import { ChunkInstancer, bucketInstancesByChunk } from './chunks/ChunkInstancer.js';
import { ChunkManager } from './chunks/ChunkManager.js';
import { DEFAULT_CHUNK_SIZE } from './chunks/chunkVisibility.js';

export const VOXEL_PALETTE = {
  grass: 0x3f9b4f,
  grass2: 0x58b65f,
  grassDark: 0x2f7440,
  dirt: 0x7a5638,
  clay: 0x9b7352,
  stone: 0x777c83,
  stoneDark: 0x4f5964,
  road: 0x222733,
  roadLight: 0x3a4250,
  lineWhite: 0xf1f6ff,
  lineYellow: 0xffd166,
  rail: 0x8e98a7,
  concrete: 0xaeb6bd,
  concreteDark: 0x707984,
  glass: 0x6bb8d6,
  glassDark: 0x23485d,
  glassGreen: 0x43a79b,
  silver: 0xcfd7df,
  steel: 0x96a0aa,
  blackGlass: 0x111927,
  petronasTrim: 0xe9f2f8,
  merdekaGlass: 0x385c83,
  merdekaTrim: 0xffe29d,
  klTowerWhite: 0xe8e1cf,
  klTowerRed: 0xd83d3d,
  roofCopper: 0xb46a3c,
  mosqueBlue: 0x2667d8,
  mosqueWhite: 0xf4f7f5,
  monumentBronze: 0x8b5f32,
  treeTrunk: 0x7a4e2d,
  treeLeaf: 0x2b8f4a,
  treeLeaf2: 0x1f6d3f,
  water: 0x1976a3,
  trainBlue: 0x1f8eed,
  trainYellow: 0xf7c948,
  trainWhite: 0xf5f7fa,
  trainWindow: 0x132638,
  station: 0xd8d2c4,
  stationRoof: 0x5b6573,
  plaza: 0xbcaa87,
  redBrick: 0x9f4d38,
  lantern: 0xff7b54,
  warning: 0xffa630,
  mallGold: 0xd7a94d,
  templeRed: 0xc83f35,
  templeGold: 0xffcf66,
  marketBlue: 0x2f6f9f,
  museumBrown: 0x8a5a35,
  lampGlow: 0xfff0a8,
  busGreen: 0x2aa876
  ,
  parkPath: 0xc8b98c,
  riverBlue: 0x0f8fb5,
  marketRed: 0xd64545,
  awningStripe: 0xf8f2d8,
  palaceGold: 0xe1b85d,
  palaceWall: 0xf1ead2,
  caveLimestone: 0xb6afa0,
  littleIndiaPink: 0xd85c9f,
  pavilionRed: 0xb31f35,
  gatewayPurple: 0x7f5af0
};

export class VoxelInstancer {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.palette = options.palette ?? VOXEL_PALETTE;
    this.castShadow = options.castShadow ?? false;
    this.receiveShadow = options.receiveShadow ?? true;
    this.instances = new Map();
    this.meshes = [];
    this.total = 0;
    this.sectionCounts = new Map();
    this.currentSection = 'world';
    this.chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
    this.chunkManager = options.chunkManager ?? new ChunkManager({ chunkSize: this.chunkSize });
  }

  withSection(name, callback) {
    const previous = this.currentSection;
    this.currentSection = name;
    try {
      return callback();
    } finally {
      this.currentSection = previous;
    }
  }

  addVoxel(x, y, z, materialKey) {
    this.addBox(x + 0.5, y + 0.5, z + 0.5, 1, 1, 1, materialKey);
  }

  addBox(x, y, z, sx, sy, sz, materialKey) {
    if (sx <= 0 || sy <= 0 || sz <= 0) return;
    if (!this.instances.has(materialKey)) this.instances.set(materialKey, []);
    this.instances.get(materialKey).push({ x, y, z, sx, sy, sz });
    this.total += 1;
    this.sectionCounts.set(this.currentSection, (this.sectionCounts.get(this.currentSection) ?? 0) + 1);
  }

  addColumn(x, z, y0, y1, materialKey) {
    for (let y = y0; y <= y1; y += 1) this.addVoxel(x, y, z, materialKey);
  }

  addVoxelBox(x0, y0, z0, width, height, depth, materialKey) {
    for (let x = x0; x < x0 + width; x += 1) {
      for (let y = y0; y < y0 + height; y += 1) {
        for (let z = z0; z < z0 + depth; z += 1) {
          this.addVoxel(x, y, z, materialKey);
        }
      }
    }
  }

  addWireVoxelBox(x0, y0, z0, width, height, depth, materialKey) {
    for (let x = x0; x < x0 + width; x += 1) {
      for (let y = y0; y < y0 + height; y += 1) {
        for (let z = z0; z < z0 + depth; z += 1) {
          const edgeCount =
            Number(x === x0 || x === x0 + width - 1) +
            Number(y === y0 || y === y0 + height - 1) +
            Number(z === z0 || z === z0 + depth - 1);
          if (edgeCount >= 2) this.addVoxel(x, y, z, materialKey);
        }
      }
    }
  }

  finalize() {
    const chunks = bucketInstancesByChunk(this.instances, { chunkSize: this.chunkSize });
    const instancer = new ChunkInstancer(this.scene, {
      palette: this.palette,
      castShadow: this.castShadow,
      receiveShadow: this.receiveShadow
    });

    const chunkManifest = [];
    for (const chunk of chunks) {
      const { group, meshCount, materialCounts: chunkMaterialCounts } = instancer.createChunkGroup(chunk);
      this.chunkManager.addChunk({ id: chunk.id, cx: chunk.cx, cz: chunk.cz, count: chunk.count, group, materialCounts: chunkMaterialCounts });
      this.meshes.push(...group.children);
      chunk.meshCount = meshCount;
      chunkManifest.push({
        id: chunk.id,
        cx: chunk.cx,
        cz: chunk.cz,
        count: chunk.count,
        meshCount,
        materialCounts: chunkMaterialCounts
      });
    }

    const materialCounts = Object.fromEntries([...this.instances.entries()].map(([key, data]) => [key, data.length]));
    const sectionCounts = Object.fromEntries([...this.sectionCounts.entries()].sort((a, b) => b[1] - a[1]));

    this.instances.clear();

    return {
      total: this.total,
      meshes: this.meshes.length,
      chunks: chunks.length,
      chunkSize: this.chunkSize,
      materials: materialCounts,
      sections: sectionCounts,
      chunkManifest,
      chunkManager: this.chunkManager
    };
  }
}
