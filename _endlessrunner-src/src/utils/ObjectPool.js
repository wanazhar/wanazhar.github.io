export class ObjectPool {
  constructor({ create, onAcquire = null, onRelease = null, initialSize = 0 }) {
    this.create = create;
    this.onAcquire = onAcquire;
    this.onRelease = onRelease;
    this.available = [];
    this.active = new Set();

    for (let i = 0; i < initialSize; i += 1) {
      const object = this.create(i);
      object.userData ??= {};
      object.userData.poolIndex = i;
      this.available.push(object);
    }
  }

  acquire() {
    const object = this.available.pop() ?? this.create(this.available.length + this.active.size);
    this.active.add(object);
    if (this.onAcquire) this.onAcquire(object);
    return object;
  }

  release(object) {
    if (!this.active.has(object)) return;
    this.active.delete(object);
    if (this.onRelease) this.onRelease(object);
    this.available.push(object);
  }

  forEachActive(callback) {
    for (const object of this.active) callback(object);
  }
}
