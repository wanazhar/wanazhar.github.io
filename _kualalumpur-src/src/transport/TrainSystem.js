import * as THREE from 'three';

function makeCar(geometry, materials, colorKey, index) {
  const group = new THREE.Group();
  group.name = `voxel-train-car-${index}`;

  const body = new THREE.Mesh(geometry, materials[colorKey]);
  body.scale.set(2.2, 1.8, 5.2);
  body.position.y = 0.8;
  group.add(body);

  const roof = new THREE.Mesh(geometry, materials.trainWhite);
  roof.scale.set(2.35, 0.35, 5.4);
  roof.position.y = 1.9;
  group.add(roof);

  for (let z = -1.7; z <= 1.7; z += 1.7) {
    const window = new THREE.Mesh(geometry, materials.trainWindow);
    window.scale.set(0.08, 0.62, 1.05);
    window.position.set(1.14, 1.05, z);
    group.add(window);

    const windowBack = window.clone();
    windowBack.position.x = -1.14;
    group.add(windowBack);
  }

  const nose = new THREE.Mesh(geometry, materials.trainWhite);
  nose.scale.set(2.0, 1.45, 0.35);
  nose.position.set(0, 0.82, -2.78);
  group.add(nose);

  return group;
}

function createTrainCars(colorKey) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const materials = {
    trainBlue: new THREE.MeshLambertMaterial({ color: 0x1f8eed }),
    trainYellow: new THREE.MeshLambertMaterial({ color: 0xf7c948 }),
    trainWhite: new THREE.MeshLambertMaterial({ color: 0xf5f7fa }),
    trainWindow: new THREE.MeshLambertMaterial({ color: 0x132638 })
  };
  return Array.from({ length: 4 }, (_, index) => makeCar(geometry, materials, colorKey, index));
}

export class TrainSystem {
  constructor(scene, transportPaths) {
    this.trains = [];
    this.stations = [];
    this.ride = null;
    this.motionEnabled = true;
    this.permanentMotion = false;
    this.activeUntil = performance.now() + 9000;

    transportPaths.forEach((path, index) => {
      const curve = new THREE.CatmullRomCurve3(path.points, false, 'catmullrom', 0.1);
      const cars = createTrainCars(path.color === 'yellow' ? 'trainYellow' : 'trainBlue');
      cars.forEach((car) => scene.add(car));
      this.trains.push({
        cars,
        curve,
        progress: index * 0.42,
        speed: index === 0 ? 0.035 : 0.027,
        lengthOffset: 0.024,
        name: path.name
      });
      path.points.forEach((point) => this.stations.push({ point, name: path.name }));
    });
  }

  wake(milliseconds = 8000) {
    this.activeUntil = Math.max(this.activeUntil, performance.now() + milliseconds);
  }

  togglePermanentMotion() {
    this.permanentMotion = !this.permanentMotion;
    this.wake(12000);
    return this.permanentMotion;
  }

  get isActive() {
    return this.motionEnabled && (this.ride || this.permanentMotion || performance.now() < this.activeUntil);
  }

  findBoardingStation(position, radius = 12) {
    let best = null;
    for (const station of this.stations) {
      const distance = Math.hypot(position.x - station.point.x, position.z - station.point.z);
      if (distance < radius && (!best || distance < best.distance)) best = { ...station, distance };
    }
    return best;
  }

  startRide(playerPosition) {
    const station = this.findBoardingStation(playerPosition, 14);
    if (!station || this.trains.length === 0) return null;
    const train = this.trains.find((item) => item.name === station.name) ?? this.trains[0];
    this.ride = { train, elapsed: 0, duration: 9, exitPoint: station.point.clone() };
    this.wake(12000);
    return this.ride;
  }

  exitRide(terrain) {
    if (!this.ride) return null;
    const train = this.ride.train;
    const p = (train.progress + 0.08) % 1;
    const point = train.curve.getPointAt(p);
    const exit = point.clone();
    exit.x += 5;
    exit.z += 5;
    exit.y = terrain.surfaceYAt(exit.x, exit.z) + 0.1;
    this.ride = null;
    return exit;
  }

  update(deltaSeconds) {
    if (!this.isActive) return false;

    for (const train of this.trains) {
      train.progress = (train.progress + deltaSeconds * train.speed) % 1;
      train.cars.forEach((car, carIndex) => {
        const p = (train.progress - train.lengthOffset * carIndex + 1) % 1;
        const carPoint = train.curve.getPointAt(p);
        const nextPoint = train.curve.getPointAt((p + 0.006) % 1);
        car.position.copy(carPoint);
        car.lookAt(nextPoint);
      });
    }

    if (this.ride) {
      this.ride.elapsed += deltaSeconds;
      if (this.ride.elapsed > this.ride.duration) this.ride.elapsed = this.ride.duration;
    }

    return true;
  }
}
