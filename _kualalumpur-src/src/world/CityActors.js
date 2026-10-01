import * as THREE from 'three';

function makeBox(material, scale, position) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
  mesh.scale.copy(scale);
  mesh.position.copy(position);
  return mesh;
}

export class CityActors {
  constructor(scene, terrain) {
    this.actors = [];
    this.activeUntil = performance.now() + 10000;
    const materials = {
      taxi: new THREE.MeshLambertMaterial({ color: 0xf7c948 }),
      car: new THREE.MeshLambertMaterial({ color: 0x2c7be5 }),
      pedestrian: new THREE.MeshLambertMaterial({ color: 0xff7b54 }),
      window: new THREE.MeshLambertMaterial({ color: 0x132638 })
    };

    const roadLoops = [
      [new THREE.Vector3(-120, 0, -1.5), new THREE.Vector3(120, 0, -1.5)],
      [new THREE.Vector3(22.5, 0, -96), new THREE.Vector3(22.5, 0, 96)],
      [new THREE.Vector3(-96, 0, 70.5), new THREE.Vector3(96, 0, 70.5)],
      [new THREE.Vector3(-46.5, 0, -72), new THREE.Vector3(-46.5, 0, 72)]
    ];

    roadLoops.forEach((points, index) => {
      for (let i = 0; i < 3; i += 1) {
        const group = new THREE.Group();
        const color = (i + index) % 2 ? 'taxi' : 'car';
        group.add(makeBox(materials[color], new THREE.Vector3(1.4, 0.65, 2.2), new THREE.Vector3(0, 0.45, 0)));
        group.add(makeBox(materials.window, new THREE.Vector3(1.0, 0.35, 1.0), new THREE.Vector3(0, 0.95, -0.2)));
        scene.add(group);
        this.actors.push({ group, points, progress: (i / 3 + index * 0.17) % 1, speed: 0.028 + i * 0.004, terrain });
      }
    });

    const pedestrianLanes = [
      [-34, 2, -6, 2],
      [18, -3, 44, -3],
      [2, 18, 2, 44],
      [21, 6, 21, 30],
      [-54, 2, -30, 2]
    ];

    pedestrianLanes.forEach(([x1, z1, x2, z2], index) => {
      const group = new THREE.Group();
      group.add(makeBox(materials.pedestrian, new THREE.Vector3(0.45, 1.2, 0.45), new THREE.Vector3(0, 0.6, 0)));
      scene.add(group);
      this.actors.push({
        group,
        points: [new THREE.Vector3(x1, 0, z1), new THREE.Vector3(x2, 0, z2)],
        progress: index * 0.21,
        speed: 0.015,
        terrain
      });
    });
  }

  wake(milliseconds = 8000) {
    this.activeUntil = Math.max(this.activeUntil, performance.now() + milliseconds);
  }

  get isActive() {
    return performance.now() < this.activeUntil;
  }

  update(deltaSeconds) {
    if (!this.isActive) return false;
    for (const actor of this.actors) {
      actor.progress = (actor.progress + deltaSeconds * actor.speed) % 1;
      const wave = actor.progress < 0.5 ? actor.progress * 2 : (1 - actor.progress) * 2;
      const from = actor.points[0];
      const to = actor.points[1];
      const x = THREE.MathUtils.lerp(from.x, to.x, wave);
      const z = THREE.MathUtils.lerp(from.z, to.z, wave);
      const y = actor.terrain.surfaceYAt(x, z) + 0.12;
      actor.group.position.set(x, y, z);
      actor.group.lookAt(to.x, y, to.z);
      if (actor.progress >= 0.5) actor.group.rotateY(Math.PI);
    }
    return true;
  }
}
