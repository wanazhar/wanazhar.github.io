import { DEFAULT_CHUNK_SIZE, DETAIL_BUDGETS, chunkCoordsForPosition, chunkDistance, getDetailTier } from './chunkVisibility.js';

export class ChunkManager {
  constructor(options = {}) {
    this.chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
    this.tier = options.tier ?? getDetailTier();
    this.budget = options.budget ?? DETAIL_BUDGETS[this.tier];
    this.visibleRadius = options.visibleRadius ?? 8;
    this.chunks = [];
    this.lastOrigin = null;
    this.visibleInstances = 0;
  }

  addChunk(chunk) {
    this.chunks.push(chunk);
  }

  update(target) {
    const position = target?.position ?? target;
    if (!position) return { changed: false, visibleInstances: this.visibleInstances };

    const origin = chunkCoordsForPosition(position.x, position.z, this.chunkSize);
    if (this.lastOrigin && this.lastOrigin.cx === origin.cx && this.lastOrigin.cz === origin.cz) {
      return { changed: false, visibleInstances: this.visibleInstances };
    }

    this.lastOrigin = origin;
    this.visibleInstances = 0;
    let changed = false;

    for (const chunk of this.chunks) {
      const distance = chunkDistance(chunk, origin);
      const visible = distance <= this.visibleRadius;
      if (chunk.group.visible !== visible) {
        chunk.group.visible = visible;
        changed = true;
      }
      if (visible) this.visibleInstances += chunk.count;
    }

    return { changed, visibleInstances: this.visibleInstances };
  }

  getStats() {
    const visibleChunks = this.chunks.filter((chunk) => chunk.group.visible).length;
    return {
      tier: this.tier,
      chunkSize: this.chunkSize,
      chunks: this.chunks.length,
      visibleChunks,
      visibleInstances: this.visibleInstances,
      visibleInstanceCap: this.budget.visibleInstanceCap,
      visibleRadius: this.visibleRadius
    };
  }
}
