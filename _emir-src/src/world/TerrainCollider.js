/**
 * Physics ground for the city.
 *
 * This uses Rapier's heightfield shape rather than a trimesh built from the render mesh: a
 * trimesh of tens of thousands of triangles makes Rapier's solver trap when a vehicle settles on
 * it, which poisons the whole world and freezes the car. A heightfield is the shape Rapier
 * intends for terrain, and it is far cheaper.
 */
export class TerrainCollider {
  constructor({ rapier, world, layout }) {
    this.rapier = rapier;
    this.world = world;
    this.layout = layout;
    // A 6-unit grid over ±756 units covers the drivable city (radius 434) with margin to spare.
    this.rows = 252;
    this.cols = 252;
    this.halfExtent = 756;
    this.body = null;
    this.collider = null;
  }

  build() {
    const { rows, cols, halfExtent } = this;
    const scaleX = halfExtent * 2;
    const scaleZ = halfExtent * 2;
    const heights = new Float32Array((rows + 1) * (cols + 1));

    // Column-major, matching Rapier's layout: heights[j * (rows + 1) + i].
    for (let i = 0; i <= rows; i += 1) {
      const x = -halfExtent + (i / rows) * scaleX;
      for (let j = 0; j <= cols; j += 1) {
        const z = -halfExtent + (j / cols) * scaleZ;
        heights[j * (rows + 1) + i] = this.layout.groundHeight(x, z);
      }
    }

    this.body = this.world.createRigidBody(this.rapier.RigidBodyDesc.fixed());
    this.collider = this.world.createCollider(
      this.rapier.ColliderDesc.heightfield(rows, cols, heights, { x: scaleX, y: 1, z: scaleZ })
        .setFriction(0.95)
        .setRestitution(0.02),
      this.body
    );

    // Safety floor beyond the heightfield, so a car driven off the edge still lands somewhere.
    const floor = this.world.createRigidBody(this.rapier.RigidBodyDesc.fixed().setTranslation(0, -60, 0));
    this.world.createCollider(this.rapier.ColliderDesc.cuboid(4000, 4, 4000).setFriction(0.9), floor);
    this.floor = floor;
    return this;
  }

  /** Ground height under a point; the analytic field is the same surface the heightfield samples. */
  heightAt(x, z) {
    return this.layout.groundHeight(x, z);
  }
}
