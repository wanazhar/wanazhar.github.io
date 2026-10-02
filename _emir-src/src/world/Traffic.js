import * as THREE from 'three';

// The city draws each street as an 11-wide strip starting at a multiple of the block pitch, so a
// street centre line sits at `index * pitch + ROAD_WIDTH / 2`.
const ROAD_WIDTH = 11;
const LANE_OFFSET = 2.7;
const TURN_TIME = 0.7;
const TURN_LEAD = 5;
const CAR_LENGTH = 4.2;
const CAR_WIDTH = 1.8;
const CAR_HEIGHT = 1.2;

const PAINTS = [
  0xd8353f, 0x2f6fb5, 0xe8b23a, 0x2f9e6b, 0xe4e6ea, 0x35393f,
  0x8a4fd0, 0xd97b2f, 0x21b6c9, 0x9aa3ad
];

const AXES = ['x', 'z'];
const UP = new THREE.Vector3(0, 1, 0);

/** Malaysian roads are left-hand drive: keep to the left of the direction of travel. */
function laneOffset(axis, sign) {
  return (axis === 'x' ? -sign : sign) * LANE_OFFSET;
}

export class TrafficSystem {
  constructor({ scene, layout, count = 34, seed = 4242 }) {
    this.scene = scene;
    this.layout = layout;
    this.pitch = layout.blockPitch;
    this.roadHalf = ROAD_WIDTH / 2;
    this.cars = [];
    this.random = mulberry32(seed);
    this.count = count;
  }

  /** Centre line of the nth street running along `axis`. */
  roadCentre(index) {
    return index * this.pitch + this.roadHalf;
  }

  build() {
    const group = new THREE.Group();
    group.name = 'traffic';

    for (let i = 0; i < this.count * 3 && this.cars.length < this.count; i += 1) {
      const car = this.#makeCar();
      if (car) this.cars.push(car);
    }
    const n = this.cars.length;
    if (!n) return this;

    const paint = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.34, metalness: 0.42 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x2c3f52, roughness: 0.14, metalness: 0.4 });
    const tyre = new THREE.MeshStandardMaterial({ color: 0x15181b, roughness: 0.9, metalness: 0.05 });

    this.bodyMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(CAR_WIDTH, 0.62, CAR_LENGTH), paint, n);
    this.cabinMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(CAR_WIDTH * 0.86, 0.5, CAR_LENGTH * 0.46), glass, n);
    this.wheelMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.26, 0.6, 0.6), tyre, n * 4);
    for (const mesh of [this.bodyMesh, this.cabinMesh, this.wheelMesh]) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      group.add(mesh);
    }
    const colour = new THREE.Color();
    this.cars.forEach((car, index) => {
      this.bodyMesh.setColorAt(index, colour.set(car.color));
    });
    if (this.bodyMesh.instanceColor) this.bodyMesh.instanceColor.needsUpdate = true;

    this.group = group;
    this.scene.add(group);
    this.#syncMeshes();
    return this;
  }

  #makeCar() {
    const axis = AXES[Math.floor(this.random() * 2)];
    const sign = this.random() < 0.5 ? 1 : -1;
    const lineIndex = Math.floor(this.random() * 7) - 3;
    const centre = this.roadCentre(lineIndex);
    const lateral = centre + laneOffset(axis, sign);
    const along = (Math.floor(this.random() * 9) - 4 + 0.5) * this.pitch;
    const x = axis === 'x' ? along : lateral;
    const z = axis === 'x' ? lateral : along;
    if (!this.layout.isRoadCoord(x, z)) return null;

    const ground = this.layout.groundHeight(x, z);
    const car = {
      axis,
      sign,
      centre,
      along,
      x,
      z,
      ground,
      heading: this.#headingFor(axis, sign),
      speed: 6 + this.random() * 6,
      cruise: 0,
      turn: null,
      body: null,
      color: PAINTS[Math.floor(this.random() * PAINTS.length)]
    };
    car.cruise = car.speed;
    return car;
  }

  #headingFor(axis, sign) {
    if (axis === 'x') return sign > 0 ? Math.PI / 2 : -Math.PI / 2;
    return sign > 0 ? Math.PI : 0;
  }

  update(dt, playerPosition, vehicle) {
    if (!this.cars.length) return;
    for (const car of this.cars) this.#advance(car, dt, playerPosition);
    if (vehicle) this.#resolvePlayerContact(vehicle, dt);
    this.#syncMeshes();
  }

  /**
   * Traffic is visual-only so it cannot destabilise Rapier, so the player is pushed out of a car
   * here instead: a capsule-vs-capsule test, a spring push along the contact normal and a little
   * speed loss on impact.
   */
  #resolvePlayerContact(vehicle, dt) {
    const body = vehicle.body;
    if (!body) return;
    const t = body.translation();
    const forward = vehicle.getForwardVector();
    const playerHalf = vehicle.profile.dimensions.length * 0.5 - CAR_WIDTH * 0.45;
    const playerRadius = vehicle.profile.dimensions.width * 0.5;

    for (const car of this.cars) {
      if (Math.abs(car.x - t.x) > 12 || Math.abs(car.z - t.z) > 12) continue;
      const heading = car.heading;
      const fx = Math.sin(heading);
      const fz = Math.cos(heading);
      const carHalf = CAR_LENGTH * 0.5 - CAR_WIDTH * 0.45;

      const hit = segmentContact(
        t.x - forward.x * playerHalf, t.z - forward.z * playerHalf,
        t.x + forward.x * playerHalf, t.z + forward.z * playerHalf,
        car.x - fx * carHalf, car.z - fz * carHalf,
        car.x + fx * carHalf, car.z + fz * carHalf,
        playerRadius + CAR_WIDTH * 0.5
      );
      if (!hit) continue;

      const v = body.linvel();
      const closing = v.x * hit.nx + v.z * hit.nz;
      const mass = vehicle.profile.mass;
      // Spring push out of the overlap plus a damped response to the closing speed.
      const push = Math.min(hit.depth, 1.2) * 26 * mass * dt;
      const bounce = closing < 0 ? -closing * 0.55 * mass : 0;
      body.applyImpulse({ x: hit.nx * (push + bounce), y: 0, z: hit.nz * (push + bounce) }, true);
      // Scrub speed on the hit so a collision actually costs momentum.
      if (closing < -1) {
        body.applyImpulse({ x: v.x * 0.06 * mass, y: 0, z: v.z * 0.06 * mass }, true);
        vehicle.impactPulse = Math.min(1, -closing / 12);
      }
    }
  }

  #advance(car, dt, playerPosition) {
    if (car.turn) {
      car.turn.t = Math.min(1, car.turn.t + dt / TURN_TIME);
      const t = car.turn.t;
      const inv = 1 - t;
      const { p0, p1, p2 } = car.turn;
      car.x = inv * inv * p0.x + 2 * inv * t * p1.x + t * t * p2.x;
      car.z = inv * inv * p0.z + 2 * inv * t * p1.z + t * t * p2.z;
      // Steer along the curve so the car visually points where it is going.
      const tangentX = 2 * inv * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
      const tangentZ = 2 * inv * (p1.z - p0.z) + 2 * t * (p2.z - p1.z);
      car.heading = Math.atan2(tangentX, tangentZ);
      if (t >= 1) {
        car.axis = car.turn.next.axis;
        car.sign = car.turn.next.sign;
        car.centre = car.turn.next.centre;
        car.along = car.turn.next.along;
        car.heading = this.#headingFor(car.axis, car.sign);
        car.turn = null;
      }
    } else {
      car.along += car.sign * car.speed * dt;
      const lateral = car.centre + laneOffset(car.axis, car.sign);
      car.x = car.axis === 'x' ? car.along : lateral;
      car.z = car.axis === 'x' ? lateral : car.along;
    }

    car.ground = this.layout.groundHeight(car.x, car.z);

    // Hold a gap behind whatever is directly ahead in the same lane.
    let target = car.cruise;
    for (const other of this.cars) {
      if (other === car || other.turn) continue;
      if (other.axis !== car.axis || other.sign !== car.sign) continue;
      if (Math.abs(other.centre - car.centre) > 1) continue;
      const gap = (other.along - car.along) * car.sign;
      if (gap > 0 && gap < 12) target = Math.min(target, Math.max(0, (gap - 5.5) * 1.4));
    }
    car.speed += (target - car.speed) * Math.min(1, dt * 3);

    if (!car.turn && this.#shouldTurn(car, playerPosition)) this.#beginTurn(car, playerPosition);

  }

  #shouldTurn(car) {
    // Start the turn one lead-length before the lane lines cross, so the arc has room.
    const relative = (car.along - this.roadHalf) / this.pitch;
    const nextIndex = car.sign > 0 ? Math.floor(relative) + 1 : Math.ceil(relative) - 1;
    car.junction = this.roadCentre(nextIndex);
    const trigger = car.junction - car.sign * TURN_LEAD;
    const distance = (trigger - car.along) * car.sign;
    return distance <= 0.4 && distance > -2;
  }

  #beginTurn(car, playerPosition) {
    if (this.random() > 0.45) return; // most cars carry straight on

    const perpendicular = car.axis === 'x' ? 'z' : 'x';
    const sign = this.random() < 0.5 ? 1 : -1;
    const entryLateral = car.centre + laneOffset(car.axis, car.sign);
    const exitLateral = car.junction + laneOffset(perpendicular, sign);

    // Entry and exit lane lines cross at the corner of the turn; a quadratic through it gives a
    // smooth arc instead of a right-angle snap.
    const corner = car.axis === 'x'
      ? { x: exitLateral, z: entryLateral }
      : { x: entryLateral, z: exitLateral };
    const p2 = perpendicular === 'x'
      ? { x: corner.x + sign * TURN_LEAD, z: corner.z }
      : { x: corner.x, z: corner.z + sign * TURN_LEAD };

    const exitAlong = perpendicular === 'x' ? p2.x : p2.z;
    if (playerPosition && Math.hypot(corner.x - playerPosition.x, corner.z - playerPosition.z) < 6) return;
    if (playerPosition && Math.hypot(p2.x - playerPosition.x, p2.z - playerPosition.z) < 6) return;

    car.turn = {
      t: 0,
      p0: { x: car.x, z: car.z },
      p1: corner,
      p2,
      next: {
        axis: perpendicular,
        sign,
        centre: car.junction,
        along: exitAlong
      }
    };
  }

  #syncMeshes() {
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3(1, 1, 1);
    const local = new THREE.Vector3();
    const wheels = [
      [-CAR_WIDTH / 2 + 0.08, -CAR_LENGTH / 2 + 0.95],
      [CAR_WIDTH / 2 - 0.08, -CAR_LENGTH / 2 + 0.95],
      [-CAR_WIDTH / 2 + 0.08, CAR_LENGTH / 2 - 0.95],
      [CAR_WIDTH / 2 - 0.08, CAR_LENGTH / 2 - 0.95]
    ];

    this.cars.forEach((car, index) => {
      quaternion.setFromAxisAngle(UP, car.heading);
      position.set(car.x, car.ground + 0.72, car.z);
      matrix.compose(position, quaternion, scale);
      this.bodyMesh.setMatrixAt(index, matrix);

      position.set(car.x, car.ground + 1.12, car.z);
      matrix.compose(position, quaternion, scale);
      this.cabinMesh.setMatrixAt(index, matrix);

      wheels.forEach((wheel, wheelIndex) => {
        local.set(wheel[0], 0, wheel[1]).applyQuaternion(quaternion);
        position.set(car.x + local.x, car.ground + 0.31, car.z + local.z);
        matrix.compose(position, quaternion, scale);
        this.wheelMesh.setMatrixAt(index * 4 + wheelIndex, matrix);
      });
    });
    this.bodyMesh.instanceMatrix.needsUpdate = true;
    this.cabinMesh.instanceMatrix.needsUpdate = true;
    this.wheelMesh.instanceMatrix.needsUpdate = true;
  }
}

/** Closest approach between two 2D segments, returning the overlap normal and depth. */
function segmentContact(ax, az, bx, bz, cx, cz, dx, dz, radius) {
  const ux = bx - ax;
  const uz = bz - az;
  const vx = dx - cx;
  const vz = dz - cz;
  const wx = ax - cx;
  const wz = az - cz;
  const a = ux * ux + uz * uz;
  const b = ux * vx + uz * vz;
  const c = vx * vx + vz * vz;
  const d = ux * wx + uz * wz;
  const e = vx * wx + vz * wz;
  const denom = a * c - b * b;
  let sN = denom > 1e-6 ? (b * e - c * d) / denom : 0;
  let tN = denom > 1e-6 ? (a * e - b * d) / denom : 0;
  sN = Math.max(0, Math.min(1, sN));
  tN = Math.max(0, Math.min(1, tN));
  const px = ax + ux * sN;
  const pz = az + uz * sN;
  const qx = cx + vx * tN;
  const qz = cz + vz * tN;
  const nx = px - qx;
  const nz = pz - qz;
  const distance = Math.hypot(nx, nz);
  if (distance >= radius) return null;
  if (distance < 1e-4) return { nx: 0, nz: 1, depth: radius };
  return { nx: nx / distance, nz: nz / distance, depth: radius - distance };
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
