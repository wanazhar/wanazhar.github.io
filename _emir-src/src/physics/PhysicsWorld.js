export class PhysicsWorld {
  constructor(rapier) {
    this.rapier = rapier;
    this.fixedDt = 1 / 60;
    this.accumulator = 0;
    this.builds = 0;
    this.world = this.createWorld();
  }

  createWorld() {
    this.builds += 1;
    return new this.rapier.World({ x: 0, y: -9.81, z: 0 });
  }

  // Rapier can hand back a world whose first step produces non-finite state; swapping in a
  // freshly constructed world is the reliable way out, so callers rebuild their colliders against
  // this new instance. The outgoing world is abandoned rather than freed: calling free() on it
  // leaves Rapier's global state poisoned, and every world created afterwards integrates into
  // NaN. The abandoned world is empty of references and gets collected with the page.
  rebuild() {
    this.world = this.createWorld();
    this.accumulator = 0;
    return this.world;
  }

  step(dt) {
    this.accumulator += Math.min(dt, 0.05);
    let steps = 0;
    while (this.accumulator >= this.fixedDt && steps < 4) {
      this.world.timestep = this.fixedDt;
      this.world.step();
      this.accumulator -= this.fixedDt;
      steps += 1;
    }
  }
}
