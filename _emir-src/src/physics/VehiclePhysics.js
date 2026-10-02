import * as THREE from 'three';
import { GROUPS_PLAYER } from './collisionGroups.js';

const UP = new THREE.Vector3(0, 1, 0);
const SPAWN_FALLBACK = { x: -18, z: 18 };
const GRAVITY = 9.81;
const FIXED_DT = 1 / 60;
// Braking slows the car until it is down to this speed; past it the same pedal drives reverse.
const REVERSE_ENGAGE_SPEED = 0.5;
// Reverse is deliberately weaker than forward drive.
const REVERSE_POWER = 0.55;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function damp(current, target, lambda, dt) {
  return target + (current - target) * Math.exp(-lambda * dt);
}

function forwardOf(quaternion, out) {
  return out.set(0, 0, -1).applyQuaternion(quaternion);
}

function rightOf(quaternion, out) {
  return out.set(1, 0, 0).applyQuaternion(quaternion);
}

export class VehiclePhysics {
  constructor({ rapier, world, scene, layout, profile, onImpact }) {
    this.rapier = rapier;
    this.world = world;
    this.scene = scene;
    this.layout = layout;
    this.profile = profile;
    this.onImpact = onImpact;
    this.visual = null;
    this.accumulator = 0;
    this.steerAngle = 0;
    this.speed = 0;
    this.forwardSpeed = 0;
    this.lateralSlip = 0;
    this.heading = 0;
    this.airborne = false;
    this.airTime = 0;
    this.groundTime = 0;
    this.wheelSpin = 0;
    this.odometer = 0;
    this.lastImpact = 0;
    this.groundedWheels = 0;
    this.pitchInput = 0;
    this.rollInput = 0;

    this.tmpForward = new THREE.Vector3();
    this.tmpRight = new THREE.Vector3();
    this.tmpVelocity = new THREE.Vector3();
    this.tmpForce = new THREE.Vector3();
    this.tmpPoint = new THREE.Vector3();
    this.quaternion = new THREE.Quaternion();

    // The wheel centre sits a little below the body, and the collision box wraps down to the
    // ground so the tyres — not the sills — carry the car.
    const { height } = profile.dimensions;
    this.wheelOffsetY = -height * 0.45;
    this.colliderHalfHeight = height * 0.45 + profile.wheel.radius;
  }

  setVisual(visual) {
    this.visual = visual;
  }

  spawn(position) {
    this.#destroyBody();
    const bodyDesc = this.rapier.RigidBodyDesc.dynamic()
      .setTranslation(position.x, position.y, position.z)
      .setCanSleep(false)
      .setLinearDamping(0.02)
      .setAngularDamping(1.4);
    const body = this.world.createRigidBody(bodyDesc);
    const { width, height, length } = this.profile.dimensions;
    // The collision box wraps the whole vehicle including the tyres, so the car rests with its
    // wheels on the ground rather than its sills.
    const halfHeight = this.colliderHalfHeight;
    const density = this.profile.mass / (width * halfHeight * 2 * length);
    const collider = this.world.createCollider(
      this.rapier.ColliderDesc.cuboid(width * 0.5, halfHeight, length * 0.5)
        .setDensity(density)
        .setFriction(0.4)
        .setRestitution(0.06),
      body
    );
    this.body = body;
    this.collider = collider;
    this.heading = position.heading ?? 0;
    this.quaternion.setFromAxisAngle(UP, this.heading);
    body.setRotation({ x: this.quaternion.x, y: this.quaternion.y, z: this.quaternion.z, w: this.quaternion.w }, true);
    this.speed = 0;
    this.forwardSpeed = 0;
    this.lateralSlip = 0;
    this.steerAngle = 0;
    this.airTime = 0;
    this.groundTime = 1;
    this.lastSafePosition = { x: position.x, z: position.z };
    this.#syncVisual();
  }

  reset(position) {
    if (!this.body) return;
    this.heading = position.heading ?? 0;
    this.quaternion.setFromAxisAngle(UP, this.heading);
    this.body.setTranslation(position, true);
    this.body.setRotation({ x: this.quaternion.x, y: this.quaternion.y, z: this.quaternion.z, w: this.quaternion.w }, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.speed = 0;
    this.forwardSpeed = 0;
    this.steerAngle = 0;
    this.#syncVisual();
  }

  step(dt, input) {
    if (!this.body) return;
    this.accumulator += Math.min(dt, 0.1);
    let steps = 0;
    while (this.accumulator >= FIXED_DT && steps < 4) {
      this.#fixedStep(FIXED_DT, input);
      const t = this.body.translation();
      const v = this.body.linvel();
      if (!Number.isFinite(t.x) || !Number.isFinite(t.y) || !Number.isFinite(t.z)
        || !Number.isFinite(v.x) || !Number.isFinite(v.y) || !Number.isFinite(v.z)) {
        this.#recover();
        return;
      }
      this.accumulator -= FIXED_DT;
      steps += 1;
    }
    this.#syncVisual();
  }

  #fixedStep(dt, input) {
    const profile = this.profile;
    // Rapier hands back a reused WASM proxy, so every read has to be copied out immediately;
    // holding on to it and reading later yields recycled (and eventually non-finite) values.
    const t = this.body.translation();
    const translation = { x: t.x, y: t.y, z: t.z };
    const r = this.body.rotation();
    const rotation = { x: r.x, y: r.y, z: r.z, w: r.w };
    this.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    forwardOf(this.quaternion, this.tmpForward);
    rightOf(this.quaternion, this.tmpRight);
    const lv = this.body.linvel();
    const linvel = { x: lv.x, y: lv.y, z: lv.z };
    const av = this.body.angvel();
    const angvel = { x: av.x, y: av.y, z: av.z };
    this.tmpVelocity.set(linvel.x, linvel.y, linvel.z);

    if (!this.#allFinite(translation) || !this.#allFinite(linvel) || !this.#allFinite(angvel) || !this.#allFinite(rotation)) {
      this.#recover();
      return;
    }
    this.lastSafePosition = { x: translation.x, z: translation.z };

    this.forwardSpeed = this.tmpVelocity.dot(this.tmpForward);
    const lateralSpeed = this.tmpVelocity.dot(this.tmpRight);
    this.speed = this.tmpVelocity.length();
    this.lateralSlip = lateralSpeed;

    const suspensionPoints = this.#suspensionPoints(translation);
    let grounded = 0;
    const contacts = [];
    for (const point of suspensionPoints) {
      const contact = this.#sampleGround(point);
      if (contact) {
        grounded += 1;
        contacts.push(contact);
      }
    }
    this.groundedWheels = grounded;
    this.airborne = grounded === 0;
    if (this.airborne) {
      this.airTime += dt;
      this.groundTime = 0;
    } else {
      this.groundTime += dt;
      if (this.airTime > 0.35 && contacts.length) {
        const impactSpeed = -linvel.y;
        if (impactSpeed > 3 && performance.now() - this.lastImpact > 220) {
          this.lastImpact = performance.now();
          this.onImpact?.({ speed: impactSpeed, airTime: this.airTime });
        }
      }
      this.airTime = 0;
    }

    this.#applySuspension(dt, contacts, translation);
    this.#applyEngineAndBrakes(dt, input, grounded);
    this.#applyTireGrip(dt, input, grounded);
    this.#applyAerodynamics(dt, linvel);
    this.#applyAngularDamping(dt, angvel, linvel);

    this.odometer += Math.abs(this.forwardSpeed) * dt;
  }

  #suspensionPoints(translation) {
    const { wheelBase, axleWidth, wheel } = this.profile;
    const halfBase = wheelBase / 2;
    const halfWidth = axleWidth / 2;
    // The strut is measured from the wheel centre.
    const y = translation.y + this.wheelOffsetY;
    const points = [
      { key: 'fl', local: new THREE.Vector3(-halfWidth, 0, -halfBase), front: true },
      { key: 'fr', local: new THREE.Vector3(halfWidth, 0, -halfBase), front: true },
      { key: 'rl', local: new THREE.Vector3(-halfWidth, 0, halfBase), front: false },
      { key: 'rr', local: new THREE.Vector3(halfWidth, 0, halfBase), front: false }
    ];
    return points.map((point) => ({
      key: point.key,
      front: point.front,
      world: point.local.clone().applyQuaternion(this.quaternion).add(new THREE.Vector3(translation.x, y, translation.z))
    }));
  }

  /**
   * Contact comes from the analytic height field rather than a Rapier ray query: the height field
   * is the same surface the collision mesh is built from, and Rapier's castRay leaves the world in
   * a state where integration produces non-finite values.
   */
  #sampleGround(point) {
    const { suspension, wheel } = this.profile;
    const groundY = this.#groundHeightAt(point.world.x, point.world.z);
    const distance = point.world.y - groundY;
    const reach = wheel.radius + suspension.travel;
    if (distance > reach + 1.2) return null;
    const compression = clamp((reach - distance) / suspension.travel, 0, 1.2);
    return {
      point,
      toi: distance,
      surfaceY: groundY,
      compression
    };
  }

  #groundHeightAt(x, z) {
    return this.layout.groundHeight(x, z);
  }

  #applySuspension(dt, contacts, translation) {
    if (!contacts.length) return;
    const { stiffness, damping, restLength } = this.profile.suspension;
    const linvel = this.body.linvel();
    const angvel = this.body.angvel();
    const angMag = Math.hypot(angvel.x, angvel.y, angvel.z);
    if (angMag > 24) {
      const k = 24 / angMag;
      this.body.setAngvel({ x: angvel.x * k, y: angvel.y * k, z: angvel.z * k }, true);
    }
    for (const contact of contacts) {
      // Spring force alone supports the car; adding a gravity-compensation term on top of it
      // doubles the ride force at equilibrium and pumps the springs until they diverge.
      const springForce = stiffness * (contact.compression * restLength);
      const rx = contact.point.world.x - translation.x;
      const ry = contact.point.world.y - translation.y;
      const rz = contact.point.world.z - translation.z;
      const vyAtPoint = linvel.y + (angvel.z * rx - angvel.x * rz);
      const dampingForce = damping * clamp(-vyAtPoint, -30, 30) * 0.35;
      const impulse = clamp((springForce + dampingForce) * dt, 0, 1400);
      this.body.applyImpulseAtPoint(
        { x: 0, y: impulse, z: 0 },
        { x: contact.point.world.x, y: contact.point.world.y, z: contact.point.world.z },
        true
      );
      contact.point.compression = contact.compression;
    }
  }

  // Rapier's wasm bindings must not be handed THREE objects; copy to a plain literal with every
  // axis present, because a missing component reaches wasm as undefined and poisons the body.
  #impulse(vec) {
    this.body.applyImpulse({ x: vec.x, y: vec.y, z: vec.z }, true);
  }

  #torque(x, y, z) {
    this.body.applyTorqueImpulse({ x, y, z }, true);
  }

  #applyEngineAndBrakes(dt, input, grounded) {
    const profile = this.profile;
    const throttle = clamp(input.throttle, 0, 1);
    const brake = clamp(input.brake, 0, 1);
    // Off-road wheels still drive a little, so the car is never completely stranded.
    const traction = grounded > 0 ? 1 : 0.05;
    const mass = profile.mass;

    let target = this.forwardSpeed;

    if (throttle > 0 && brake === 0) {
      const accel = (profile.engineForce * traction) / mass;
      target = Math.min(profile.maxSpeed, this.forwardSpeed + accel * dt);
    } else if (brake > 0 && throttle === 0) {
      if (this.forwardSpeed > REVERSE_ENGAGE_SPEED) {
        // Still rolling forward: this is a brake pedal.
        const decel = (profile.brakeForce / mass) * dt;
        target = Math.max(0, this.forwardSpeed - decel);
      } else {
        // Stopped, or already rolling back: hold the pedal and the car reverses. This uses the
        // engine force directly — scaling it by throttle left reverse with no power at all.
        const accel = (profile.engineForce * REVERSE_POWER * traction) / mass;
        target = Math.max(-profile.maxReverse, this.forwardSpeed - accel * dt);
      }
    } else if (throttle === 0 && brake === 0 && grounded > 0) {
      const rolling = profile.rollingResistance * GRAVITY * dt;
      target = Math.abs(this.forwardSpeed) <= rolling
        ? 0
        : this.forwardSpeed - Math.sign(this.forwardSpeed) * rolling;
    }

    if (input.handbrake > 0 && grounded > 0) {
      const decel = (profile.brakeForce * 0.55 / mass) * dt;
      target = Math.abs(target) <= decel ? 0 : target - Math.sign(target) * decel;
    }

    if (grounded > 0) {
      const delta = (target - this.forwardSpeed) * mass;
      this.tmpForce.copy(this.tmpForward).multiplyScalar(delta);
      this.#impulse(this.tmpForce);
    }
  }

  #applyTireGrip(dt, input, grounded) {
    if (grounded === 0) return;
    const profile = this.profile;
    const speedAbs = Math.abs(this.forwardSpeed);
    // Keep useful steering authority at speed instead of fading almost to nothing near top speed.
    const speedFactor = clamp(1 - speedAbs / (profile.maxSpeed * 1.35), 0.35, 1);

    const steerTarget = input.steer * profile.maxSteer * (0.3 + 0.7 * speedFactor);
    // Ease the wheels toward the target so a flick of the stick is not an instant snap.
    this.steerAngle = damp(this.steerAngle, steerTarget, 9, dt);

    // Lateral grip: bleed off sideways slip so the car tracks instead of skating. The handbrake
    // cuts grip so the back steps out.
    const handbrake = input.handbrake > 0 ? 0.32 : 1;
    const lateralImpulse = -this.lateralSlip * profile.mass * profile.grip * handbrake * dt * (grounded / 4);
    this.tmpForce.copy(this.tmpRight).multiplyScalar(lateralImpulse);
    this.#impulse(this.tmpForce);

    // Cornering is a yaw torque about the vertical axis. Scaling by road speed keeps a parked car
    // from pivoting on the spot, and the sign matches three.js: steering right lowers the heading.
    const authority = clamp(Math.abs(this.forwardSpeed) / 3, 0.15, 1);
    const yawTorque = -this.steerAngle * this.forwardSpeed * profile.mass * profile.grip * 0.34 * authority * dt;
    this.#torque(0, yawTorque * (input.handbrake > 0 ? 1.6 : 1), 0);

    if (grounded >= 2) {
      // Settle pitch, roll and yaw wobble instead of letting the chassis tumble.
      const av = this.body.angvel();
      // Settle the chassis: enough yaw damping that the car stops rotating when you release the
      // stick, but not so much that it fights the steering.
      this.#torque(
        -av.x * profile.mass * 0.5 * dt,
        -av.y * profile.mass * 0.3 * dt,
        -av.z * profile.mass * 0.5 * dt
      );
    }
  }

  #applyAerodynamics(dt, linvel) {
    const horizontalSpeed = Math.hypot(linvel.x, linvel.z);
    const drag = this.profile.drag * horizontalSpeed * horizontalSpeed * dt * 0.02;
    if (drag > 0) {
      this.tmpForce.set(-linvel.x, 0, -linvel.z).multiplyScalar(drag);
      this.#impulse(this.tmpForce);
    }
    if (linvel.y < 0) {
      this.body.applyImpulse({ x: 0, y: linvel.y * 0.02, z: 0 }, true);
    }
  }

  #applyAngularDamping(dt, angvel, linvel) {
    const stabilizer = (2.2 + Math.abs(this.forwardSpeed) * 0.08) * dt;
    this.#torque(-angvel.x * stabilizer, 0, -angvel.z * stabilizer);
  }

  #allFinite(object) {
    if (!object) return false;
    if (object.isVector3) return Number.isFinite(object.x) && Number.isFinite(object.y) && Number.isFinite(object.z);
    return Number.isFinite(object.x) && Number.isFinite(object.y) && Number.isFinite(object.z)
      && (object.w === undefined || Number.isFinite(object.w));
  }

  recover() {
    this.#recover();
  }

  syncVisual() {
    this.#syncVisual();
  }

  #recover() {
    // Settle on the analytic ground height, not a hard-coded fallback: the collider mesh can
    // disagree with it, which would drop the car through the world again.
    const x = this.lastSafePosition?.x ?? SPAWN_FALLBACK.x;
    const z = this.lastSafePosition?.z ?? SPAWN_FALLBACK.z;
    const ground = this.layout.groundHeight(x, z);
    const rideHeight = this.colliderHalfHeight + 0.4;
    this.body.setTranslation({ x, y: ground + rideHeight + 0.25, z }, true);
    this.body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.quaternion.identity();
    this.speed = 0;
    this.forwardSpeed = 0;
    this.lateralSlip = 0;
    this.steerAngle = 0;
    this.heading = 0;
    this.odometer = 0;
    this.airTime = 0;
    this.groundedWheels = 4;
    this.airborne = false;
    this.lastSafePosition = { x, z };
  }

  #syncVisual() {
    if (!this.visual || !this.body) return;
    const t = this.body.translation();
    const translation = { x: t.x, y: t.y, z: t.z };
    if (!this.#allFinite(translation)) {
      this.#recover();
    }
    const r = this.body.rotation();
    this.visual.root.position.set(translation.x, translation.y, translation.z);
    this.visual.root.quaternion.set(r.x, r.y, r.z, r.w);
    this.visual.root.updateMatrixWorld();

    this.wheelSpin += this.forwardSpeed / Math.max(this.profile.wheel.radius, 0.1) * (1 / 60);
    const suspension = this.profile.suspension;
    for (const wheel of this.visual.wheels) {
      const node = wheel.node;
      if (!node) continue;
      const compression = wheel.compression ?? 0.5;
      const drop = suspension.restLength * (1 - compression) * 0.9;
      node.position.set(wheel.local.x, wheel.local.y - drop, wheel.local.z);
      node.rotation.set(this.wheelSpin, wheel.front ? this.steerAngle : 0, 0);
    }
  }

  getPosition() {
    if (!this.body) return { x: 0, y: 0, z: 0 };
    const t = this.body.translation();
    return { x: t.x, y: t.y, z: t.z };
  }

  getPositionVector() {
    const p = this.getPosition();
    return new THREE.Vector3(p.x, p.y, p.z);
  }

  getVelocity() {
    if (!this.body) return new THREE.Vector3();
    const v = this.body.linvel();
    return new THREE.Vector3(v.x, v.y, v.z);
  }

  getAngularVelocity() {
    if (!this.body) return new THREE.Vector3();
    const w = this.body.angvel();
    return new THREE.Vector3(w.x, w.y, w.z);
  }

  getSpeedKph() {
    return Math.abs(this.forwardSpeed) * 3.6;
  }

  getForwardVector() {
    return forwardOf(this.quaternion, new THREE.Vector3());
  }

  getRightVector() {
    return rightOf(this.quaternion, new THREE.Vector3());
  }

  isSliding() {
    return this.groundedWheels >= 2 && Math.abs(this.lateralSlip) > 3.4;
  }

  setWheelCompression(key, compression) {
    if (!this.visual) return;
    const wheel = this.visual.wheels.find((w) => w.key === key);
    if (wheel) wheel.compression = compression;
  }

  getDebugState() {
    const position = this.getPosition();
    const forward = this.getForwardVector();
    return {
      forward: { x: Number(forward.x.toFixed(3)), z: Number(forward.z.toFixed(3)) },
      vehicle: this.profile.id,
      position: { x: Number(position.x.toFixed(2)), y: Number(position.y.toFixed(2)), z: Number(position.z.toFixed(2)) },
      speedKph: Number(this.getSpeedKph().toFixed(1)),
      forwardSpeed: Number(this.forwardSpeed.toFixed(2)),
      lateralSlip: Number(this.lateralSlip.toFixed(2)),
      steerAngle: Number(this.steerAngle.toFixed(3)),
      groundedWheels: this.groundedWheels,
      airborne: this.airborne,
      airTime: Number(this.airTime.toFixed(2)),
      odometer: Number(this.odometer.toFixed(1))
    };
  }

  // Drop references to a world that is about to be discarded without touching it.
  detach() {
    this.body = null;
    this.collider = null;
    this.visual?.root?.position?.set(SPAWN_FALLBACK.x, 10, SPAWN_FALLBACK.z);
  }

  #destroyBody() {
    if (this.body) {
      this.world.removeRigidBody(this.body);
      this.body = null;
      this.collider = null;
    }
  }

  dispose() {
    this.#destroyBody();
  }
}
