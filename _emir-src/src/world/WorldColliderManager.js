export class WorldColliderManager {
  constructor({ rapier, world, spatialHash, cellSize }) {
    this.rapier = rapier;
    this.world = world;
    this.spatialHash = spatialHash;
    this.cellSize = cellSize;
    this.radius = 56;
    this.refreshDistance = 10;
    this.active = new Map();
    this.lastCenter = { x: Infinity, y: Infinity, z: Infinity };
  }

  get activeCount() { return this.active.size; }

  update(position) {
    const dx = position.x - this.lastCenter.x;
    const dz = position.z - this.lastCenter.z;
    if (dx * dx + dz * dz < this.refreshDistance * this.refreshDistance) return;
    this.lastCenter = { ...position };

    const nearby = this.spatialHash.querySphere(position, this.radius);
    const wanted = new Set(nearby.map((voxel) => voxelKey(voxel)));

    for (const [key, record] of this.active.entries()) {
      if (!wanted.has(key)) {
        this.world.removeRigidBody(record.body);
        this.active.delete(key);
      }
    }

    for (const voxel of nearby) {
      const key = voxelKey(voxel);
      if (this.active.has(key)) continue;
      const body = this.world.createRigidBody(this.rapier.RigidBodyDesc.fixed().setTranslation(voxel.x, voxel.y, voxel.z));
      const half = voxel.halfExtents || { x: this.cellSize * 0.5, y: this.cellSize * 0.5, z: this.cellSize * 0.5 };
      const desc = this.rapier.ColliderDesc.cuboid(half.x, half.y, half.z)
        .setFriction(0.96)
        .setRestitution(0.01);
      const collider = this.world.createCollider(desc, body);
      this.active.set(key, { body, collider });
    }
  }
}

function voxelKey(voxel) { return `${Math.round(voxel.x * 10)},${Math.round(voxel.y * 10)},${Math.round(voxel.z * 10)},${voxel.type}`; }
