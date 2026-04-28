export class SpatialHash {
  constructor(cellSize = 16) {
    this.cellSize = cellSize;
    this.cells = new Map();
  }

  clear() { this.cells.clear(); }

  insert(voxel) {
    const key = this.keyFromWorld(voxel.x, voxel.y, voxel.z);
    if (!this.cells.has(key)) this.cells.set(key, []);
    this.cells.get(key).push(voxel);
  }

  keyFromWorld(x, y, z) {
    return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)},${Math.floor(z / this.cellSize)}`;
  }

  querySphere(position, radius) {
    const result = [];
    const minX = Math.floor((position.x - radius) / this.cellSize);
    const maxX = Math.floor((position.x + radius) / this.cellSize);
    const minY = Math.floor((position.y - radius) / this.cellSize);
    const maxY = Math.floor((position.y + radius) / this.cellSize);
    const minZ = Math.floor((position.z - radius) / this.cellSize);
    const maxZ = Math.floor((position.z + radius) / this.cellSize);
    const radiusSq = radius * radius;
    for (let ix = minX; ix <= maxX; ix++) {
      for (let iy = minY; iy <= maxY; iy++) {
        for (let iz = minZ; iz <= maxZ; iz++) {
          const bucket = this.cells.get(`${ix},${iy},${iz}`);
          if (!bucket) continue;
          for (const voxel of bucket) {
            const dx = voxel.x - position.x;
            const dy = voxel.y - position.y;
            const dz = voxel.z - position.z;
            if (dx * dx + dy * dy + dz * dz <= radiusSq) result.push(voxel);
          }
        }
      }
    }
    return result;
  }
}
