export class CollisionMap {
  constructor(min = -220, max = 220) {
    this.cells = new Set();
    this.offset = -min;
    this.stride = max - min + 1;
  }

  key(x, z) {
    return (Math.floor(x) + this.offset) * this.stride + (Math.floor(z) + this.offset);
  }

  addRect(x0, z0, width, depth) {
    for (let x = Math.floor(x0); x < Math.floor(x0 + width); x += 1) {
      for (let z = Math.floor(z0); z < Math.floor(z0 + depth); z += 1) {
        this.cells.add(this.key(x, z));
      }
    }
  }

  addFootprint(x0, z0, width, depth, margin = 0) {
    this.addRect(x0 - margin, z0 - margin, width + margin * 2, depth + margin * 2);
  }

  isBlocked(x, z) {
    return this.cells.has(this.key(x, z));
  }

  isAreaClear(x, z, radius = 1) {
    for (let ox = -radius; ox <= radius; ox += 1) {
      for (let oz = -radius; oz <= radius; oz += 1) {
        if (this.isBlocked(x + ox, z + oz)) return false;
      }
    }
    return true;
  }

  get size() {
    return this.cells.size;
  }
}
