export class PhysicsWorld {
  constructor(rapier) {
    this.rapier = rapier;
    this.world = new rapier.World({ x: 0, y: -9.81, z: 0 });
    this.fixedDt = 1 / 60;
    this.accumulator = 0;
    this.#createWorldFloor();
  }

  #createWorldFloor() {
    const groundBody = this.world.createRigidBody(this.rapier.RigidBodyDesc.fixed().setTranslation(0, -0.12, 0));
    const groundCollider = this.rapier.ColliderDesc.cuboid(720, 0.1, 720).setFriction(1.05).setRestitution(0.02);
    this.world.createCollider(groundCollider, groundBody);
  }

  step(dt) {
    this.accumulator += Math.min(dt, 0.05);
    while (this.accumulator >= this.fixedDt) {
      this.world.timestep = this.fixedDt;
      this.world.step();
      this.accumulator -= this.fixedDt;
    }
  }
}
