import { GROUPS_WORLD } from '../physics/collisionGroups.js';

export class WorldColliderManager {
  constructor({ rapier, world, records, radius = 90, refreshDistance = 14 }) {
    this.rapier = rapier;
    this.world = world;
    this.records = records ?? [];
    this.radius = radius;
    this.refreshDistance = refreshDistance;
    this.active = new Map();
    this.lastCenter = { x: Infinity, z: Infinity };
    this.cellSize = 16;
    this.grid = new Map();
    for (const record of this.records) this.#index(record);
  }

  get activeCount() {
    return this.active.size;
  }

  #key(record) {
    return `${record.kind}:${Math.round(record.x * 4)}:${Math.round(record.y * 4)}:${Math.round(record.z * 4)}`;
  }

  #index(record) {
    const cx = Math.floor(record.x / this.cellSize);
    const cz = Math.floor(record.z / this.cellSize);
    for (let x = cx - 1; x <= cx + 1; x += 1) {
      for (let z = cz - 1; z <= cz + 1; z += 1) {
        const key = `${x},${z}`;
        if (!this.grid.has(key)) this.grid.set(key, []);
        this.grid.get(key).push(record);
      }
    }
  }

  #nearby(position) {
    const seen = new Set();
    const result = [];
    const minX = Math.floor((position.x - this.radius) / this.cellSize);
    const maxX = Math.floor((position.x + this.radius) / this.cellSize);
    const minZ = Math.floor((position.z - this.radius) / this.cellSize);
    const maxZ = Math.floor((position.z + this.radius) / this.cellSize);
    for (let cx = minX; cx <= maxX; cx += 1) {
      for (let cz = minZ; cz <= maxZ; cz += 1) {
        const bucket = this.grid.get(`${cx},${cz}`);
        if (!bucket) continue;
        for (const record of bucket) {
          const key = this.#key(record);
          if (seen.has(key)) continue;
          seen.add(key);
          const dx = record.x - position.x;
          const dz = record.z - position.z;
          if (dx * dx + dz * dz <= this.radius * this.radius) result.push(record);
        }
      }
    }
    return result;
  }

  /**
   * Fraction of the segment from `from` to `to` that is not blocked by a building, used to keep
   * the chase camera out of walls. Returns 1 when the whole segment is clear.
   */
  clearFraction(from, to, padding = 0.6) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    const lengthSq = dx * dx + dy * dy + dz * dz;
    if (lengthSq < 1e-6) return 1;

    const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2, z: (from.z + to.z) / 2 };
    const reach = Math.sqrt(lengthSq) / 2 + 2;
    const candidates = [];
    const seen = new Set();
    const minX = Math.floor((mid.x - reach) / this.cellSize);
    const maxX = Math.floor((mid.x + reach) / this.cellSize);
    const minZ = Math.floor((mid.z - reach) / this.cellSize);
    const maxZ = Math.floor((mid.z + reach) / this.cellSize);
    for (let cx = minX; cx <= maxX; cx += 1) {
      for (let cz = minZ; cz <= maxZ; cz += 1) {
        const bucket = this.grid.get(`${cx},${cz}`);
        if (!bucket) continue;
        for (const record of bucket) {
          const key = this.#key(record);
          if (seen.has(key)) continue;
          seen.add(key);
          candidates.push(record);
        }
      }
    }

    let nearest = 1;
    for (const record of candidates) {
      const minXBound = record.x - record.hx - padding;
      const maxXBound = record.x + record.hx + padding;
      const minYBound = record.y - record.hy - padding;
      const maxYBound = record.y + record.hy + padding;
      const minZBound = record.z - record.hz - padding;
      const maxZBound = record.z + record.hz + padding;

      let tMin = 0;
      let tMax = 1;
      let miss = false;
      for (const [origin, direction, low, high] of [
        [from.x, dx, minXBound, maxXBound],
        [from.y, dy, minYBound, maxYBound],
        [from.z, dz, minZBound, maxZBound]
      ]) {
        if (Math.abs(direction) < 1e-6) {
          if (origin < low || origin > high) { miss = true; break; }
          continue;
        }
        let t1 = (low - origin) / direction;
        let t2 = (high - origin) / direction;
        if (t1 > t2) { const swap = t1; t1 = t2; t2 = swap; }
        if (t1 > tMin) tMin = t1;
        if (t2 < tMax) tMax = t2;
        if (tMin > tMax) { miss = true; break; }
      }
      if (!miss && tMin < nearest) nearest = Math.max(0, tMin);
    }
    return nearest;
  }

  update(position) {
    const dx = position.x - this.lastCenter.x;
    const dz = position.z - this.lastCenter.z;
    if (dx * dx + dz * dz < this.refreshDistance * this.refreshDistance) return;
    this.lastCenter = { x: position.x, z: position.z };

    const nearby = this.#nearby(position);
    const wanted = new Set(nearby.map((record) => this.#key(record)));

    for (const [key, body] of this.active.entries()) {
      if (!wanted.has(key)) {
        this.world.removeRigidBody(body);
        this.active.delete(key);
      }
    }

    for (const record of nearby) {
      const key = this.#key(record);
      if (this.active.has(key)) continue;
      const body = this.world.createRigidBody(
        this.rapier.RigidBodyDesc.fixed().setTranslation(record.x, record.y, record.z)
      );
      // Zero-extent cuboids produce invalid inertia and can make the whole island non-finite.
      const hx = Math.max(0.05, record.hx);
      const hy = Math.max(0.05, record.hy);
      const hz = Math.max(0.05, record.hz);
      this.world.createCollider(
        this.rapier.ColliderDesc.cuboid(hx, hy, hz).setFriction(0.7).setRestitution(0.02),
        body
      );
      this.active.set(key, body);
    }
  }
}
