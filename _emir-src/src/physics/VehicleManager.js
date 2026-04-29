import * as THREE from 'three';
import { VEHICLE_PROFILES } from './VehicleProfiles.js';

const TMP_VECTOR = new THREE.Vector3();
const DOWN = { x: 0, y: -1, z: 0 };
const WHEEL_KEYS = ['fl', 'fr', 'rl', 'rr'];
const GROUND_TOP_Y = -0.02;

export class VehicleManager {
  constructor({ rapier, scene, physics, assetLoader }) {
    this.rapier = rapier;
    this.scene = scene;
    this.physics = physics;
    this.world = physics.world;
    this.assetLoader = assetLoader;
    this.active = null;
    this.forwardVector = new THREE.Vector3(0, 0, -1);
  }

  async spawn(profileId = 'sedan') {
    const profile = VEHICLE_PROFILES[profileId] || VEHICLE_PROFILES.sedan;
    this.#disposeActive();

    const rideHeight = rideHeightFor(profile);
    const bodyDesc = this.rapier.RigidBodyDesc.dynamic()
      .setTranslation(0, rideHeight, 8)
      .setCanSleep(false)
      .setLinearDamping(0.08)
      .setAngularDamping(0.92);
    if (typeof bodyDesc.setGravityScale === 'function') bodyDesc.setGravityScale(0);

    const body = this.world.createRigidBody(bodyDesc);
    const density = Math.max(80, profile.mass / (profile.dimensions.width * profile.dimensions.height * profile.dimensions.length));
    const colliderDesc = this.rapier.ColliderDesc
      .cuboid(profile.dimensions.width * 0.5, profile.dimensions.height * 0.5, profile.dimensions.length * 0.5)
      .setDensity(density)
      .setFriction(0.92)
      .setRestitution(0.02);
    const collider = this.world.createCollider(colliderDesc, body);

    if (typeof body.setAdditionalMassProperties === 'function') {
      body.setAdditionalMassProperties(profile.mass, profile.centerOfMass, { x: profile.mass, y: profile.mass, z: profile.mass }, { x: 0, y: 0, z: 0, w: 1 }, true);
    }

    const model = await this.assetLoader.createVehicleInstance(profile.id);
    this.scene.add(model.root);

    const wheels = this.#makeWheels(profile, model.parts);
    this.active = {
      profile,
      body,
      collider,
      model,
      wheels,
      speedKph: 0,
      steerAngle: 0,
      odometer: 0,
      driveSpeed: 0,
      yaw: 0,
      rideHeight,
      driftAmount: 0,
      lastGroundedCount: 0,
      lastVerticalCorrection: 0,
      lastThrottle: 0,
      previousPosition: new THREE.Vector3(),
      commandedHorizontalVelocity: new THREE.Vector3(),
      blockedFrames: 0
    };
    this.resetActiveVehicle({ x: 0, y: rideHeight, z: 8 });
  }

  resetActiveVehicle(position = null) {
    if (!this.active) return;
    const { body } = this.active;
    const spawnPosition = position || { x: 0, y: this.active.rideHeight, z: 8 };
    this.active.driveSpeed = 0;
    this.active.speedKph = 0;
    this.active.steerAngle = 0;
    this.active.driftAmount = 0;
    this.active.yaw = 0;
    this.active.blockedFrames = 0;
    this.active.commandedHorizontalVelocity.set(0, 0, 0);
    this.active.lastVerticalCorrection = 0;
    this.active.previousPosition.set(spawnPosition.x, spawnPosition.y, spawnPosition.z);
    body.setTranslation(spawnPosition, true);
    body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }

  update(dt, input) {
    if (!this.active) return;
    const { body, profile, wheels } = this.active;
    const safeDt = Math.min(dt, 0.05);
    const translation = body.translation();
    this.active.previousPosition.set(translation.x, translation.y, translation.z);
    this.#stabilizeRideHeight(translation);

    const tuning = this.#driveTuning(profile);
    const forwardInput = input.throttle > 0 ? 1 : 0;
    const reverseInput = input.brake > 0 ? 1 : 0;
    const steerInput = input.steer || 0;
    const handbrake = input.handbrake > 0 ? 1 : 0;

    let driveSpeed = this.active.driveSpeed;
    if (forwardInput) {
      const accel = driveSpeed < -0.4 ? tuning.brakeDecel * 1.9 : tuning.accel;
      driveSpeed = moveToward(driveSpeed, tuning.maxForward, accel * safeDt);
    } else if (reverseInput) {
      const target = driveSpeed > 0.7 ? 0 : -tuning.maxReverse;
      const accel = driveSpeed > 0.7 ? tuning.brakeDecel : tuning.reverseAccel;
      driveSpeed = moveToward(driveSpeed, target, accel * safeDt);
    } else {
      driveSpeed = moveToward(driveSpeed, 0, tuning.coastDecel * safeDt);
    }

    if (handbrake && Math.abs(driveSpeed) > 1.5) {
      driveSpeed = moveToward(driveSpeed, 0, tuning.coastDecel * 0.48 * safeDt);
    }

    const speedAbs = Math.abs(driveSpeed);
    const steerTarget = steerInput * profile.maxSteer;
    this.active.steerAngle = THREE.MathUtils.lerp(this.active.steerAngle, steerTarget, 1 - Math.pow(0.00002, safeDt));
    const steerAuthority = THREE.MathUtils.clamp(speedAbs / tuning.maxForward, 0.18, 1);
    const driftBoost = handbrake ? 1.85 : 1;
    const reverseSteer = driveSpeed < -0.2 ? -1 : 1;
    this.active.yaw -= steerInput * tuning.turnRate * steerAuthority * driftBoost * reverseSteer * safeDt;
    this.active.driftAmount = THREE.MathUtils.lerp(this.active.driftAmount, handbrake ? Math.abs(steerInput) : 0, 1 - Math.pow(0.0001, safeDt));

    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.active.yaw);
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(q).normalize();
    this.forwardVector.copy(forward);

    const horizontalVelocity = forward.multiplyScalar(driveSpeed);
    this.active.commandedHorizontalVelocity.copy(horizontalVelocity);
    body.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }, true);
    body.setLinvel({ x: horizontalVelocity.x, y: 0, z: horizontalVelocity.z }, true);
    body.setAngvel({ x: 0, y: steerInput * tuning.turnRate * driftBoost * steerAuthority, z: 0 }, true);

    this.active.speedKph = speedAbs * 3.6;
    this.active.driveSpeed = driveSpeed;
    this.active.odometer += speedAbs * safeDt;
    this.active.lastThrottle = forwardInput - reverseInput;
  }

  syncAfterPhysics(dt = 1 / 60) {
    if (!this.active) return;
    const { body, profile, wheels } = this.active;
    const safeDt = Math.min(Math.max(dt, 1 / 120), 0.05);
    let translation = body.translation();
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.active.yaw);

    this.#settleBlockedMotion(translation, safeDt);
    this.#stabilizeRideHeight(body.translation());
    translation = body.translation();
    let groundedCount = 0;
    for (const wheel of wheels) {
      wheel.steer = wheel.front ? this.active.steerAngle : 0;
      const local = wheel.local.clone();
      const worldMount = local.applyQuaternion(q).add(new THREE.Vector3(translation.x, translation.y, translation.z));
      const maxRay = profile.suspension.restLength + profile.wheel.radius + profile.suspension.travel + 0.35;
      const ray = new this.rapier.Ray(worldMount, DOWN);
      const hit = this.world.castRay(ray, maxRay, true, undefined, undefined, this.active.collider, body)
        || this.world.castRay(ray, maxRay, false, undefined, undefined, this.active.collider, body);
      const groundToi = worldMount.y - GROUND_TOP_Y;
      const visualToi = hit?.toi ?? groundToi;
      wheel.grounded = visualToi >= 0 && visualToi < maxRay;
      if (wheel.grounded) groundedCount += 1;
      wheel.compression = wheel.grounded
        ? THREE.MathUtils.clamp((profile.suspension.restLength + profile.wheel.radius - visualToi) / profile.suspension.restLength, 0, 1.15)
        : 0;
      wheel.spin += this.active.driveSpeed / Math.max(profile.wheel.radius, 0.1) * safeDt;
    }
    this.active.lastGroundedCount = groundedCount;

    this.#updateVisuals(q, body.translation());
  }

  getPosition() {
    const p = this.active?.body.translation() || { x: 0, y: 0, z: 0 };
    return { x: p.x, y: p.y, z: p.z };
  }

  getPositionVector() {
    const p = this.getPosition();
    return TMP_VECTOR.set(p.x, p.y, p.z).clone();
  }

  getForwardVector() { return this.forwardVector.clone(); }
  getSpeedKph() { return this.active?.speedKph || 0; }
  getCurrentProfile() { return this.active?.profile || VEHICLE_PROFILES.sedan; }
  getDebugState() {
    if (!this.active) return null;
    const p = this.getPosition();
    return {
      vehicle: this.active.profile.id,
      speedKph: this.active.speedKph,
      driveSpeed: this.active.driveSpeed,
      yaw: this.active.yaw,
      steerAngle: this.active.steerAngle,
      driftAmount: this.active.driftAmount,
      groundedWheels: this.active.lastGroundedCount,
      rideHeight: this.active.rideHeight,
      verticalCorrection: this.active.lastVerticalCorrection,
      cameraHint: 'Use wheel/buttons to zoom, drag/Q/E to orbit, C to focus follow view.',
      blockedFrames: this.active.blockedFrames,
      position: p
    };
  }

  #settleBlockedMotion(translation, safeDt) {
    const commanded = this.active.commandedHorizontalVelocity;
    const commandedSpeed = commanded.length();
    if (commandedSpeed < 0.35) {
      this.active.blockedFrames = 0;
      return;
    }

    const actual = new THREE.Vector3(
      translation.x - this.active.previousPosition.x,
      0,
      translation.z - this.active.previousPosition.z
    );
    const expectedDistance = commandedSpeed * safeDt;
    const progress = expectedDistance > 0 ? actual.dot(commanded.clone().normalize()) / expectedDistance : 1;
    const blocked = progress < 0.22 && actual.length() < expectedDistance * 0.45;
    this.active.blockedFrames = blocked ? this.active.blockedFrames + 1 : 0;

    if (this.active.blockedFrames >= 2) {
      this.active.driveSpeed = moveToward(this.active.driveSpeed, 0, commandedSpeed * 0.85);
      const linvel = this.active.body.linvel();
      this.active.body.setLinvel({ x: 0, y: Math.min(linvel.y, 0), z: 0 }, true);
      this.active.speedKph = Math.abs(this.active.driveSpeed) * 3.6;
    }
  }

  #stabilizeRideHeight(translation) {
    const targetY = this.active.rideHeight;
    const correction = targetY - translation.y;
    this.active.lastVerticalCorrection = correction;
    if (Math.abs(correction) < 0.0005) return;
    this.active.body.setTranslation({ x: translation.x, y: targetY, z: translation.z }, true);
    const linvel = this.active.body.linvel();
    this.active.body.setLinvel({ x: linvel.x, y: 0, z: linvel.z }, true);
  }

  #driveTuning(profile) {
    const massFactor = THREE.MathUtils.clamp(1350 / profile.mass, 0.34, 1.18);
    const limiter = profile.accelerationLimiter ?? 1;
    return {
      maxForward: THREE.MathUtils.clamp(24 * massFactor + 8, 12, 34) * limiter,
      maxReverse: THREE.MathUtils.clamp(8.5 * massFactor + 2.5, 4.5, 12),
      accel: THREE.MathUtils.clamp(28 * massFactor + 7, 9, 38) * limiter,
      reverseAccel: THREE.MathUtils.clamp(16 * massFactor + 5, 7, 24),
      brakeDecel: THREE.MathUtils.clamp(42 * massFactor + 12, 20, 58),
      coastDecel: THREE.MathUtils.clamp(8 * massFactor + 3.5, 4.5, 13),
      turnRate: THREE.MathUtils.clamp(2.8 * massFactor + profile.maxSteer, 1.45, 3.55)
    };
  }

  #makeWheels(profile, parts) {
    const positions = {
      fl: [-profile.axleWidth * 0.5, -profile.dimensions.height * 0.45, -profile.wheelBase * 0.5],
      fr: [profile.axleWidth * 0.5, -profile.dimensions.height * 0.45, -profile.wheelBase * 0.5],
      rl: [-profile.axleWidth * 0.5, -profile.dimensions.height * 0.45, profile.wheelBase * 0.5],
      rr: [profile.axleWidth * 0.5, -profile.dimensions.height * 0.45, profile.wheelBase * 0.5]
    };
    return WHEEL_KEYS.map((key) => ({
      key,
      node: parts.wheels[key],
      local: new THREE.Vector3(...positions[key]),
      front: key === 'fl' || key === 'fr',
      steer: 0,
      spin: 0,
      compression: 0,
      grounded: false
    }));
  }

  #updateVisuals(q, translation) {
    const { model, wheels, profile, driftAmount } = this.active;
    model.root.position.set(translation.x, translation.y, translation.z);
    model.root.quaternion.copy(q);
    if (driftAmount > 0.01) {
      model.root.rotateY(THREE.MathUtils.lerp(0, this.active.steerAngle * 0.42, driftAmount));
    }
    for (const wheel of wheels) {
      if (!wheel.node) continue;
      const restDrop = profile.suspension.restLength * (1 - wheel.compression) - profile.wheel.radius * 0.1;
      wheel.node.position.copy(wheel.local);
      wheel.node.position.y -= THREE.MathUtils.clamp(restDrop, 0, profile.suspension.restLength + profile.suspension.travel);
      wheel.node.rotation.set(wheel.spin, wheel.steer, 0);
    }
  }

  #disposeActive() {
    if (!this.active) return;
    this.scene.remove(this.active.model.root);
    this.world.removeRigidBody(this.active.body);
    this.active = null;
  }
}

function rideHeightFor(profile) {
  return GROUND_TOP_Y
    + profile.suspension.restLength
    + profile.wheel.radius
    + profile.dimensions.height * 0.45;
}

function moveToward(current, target, delta) {
  if (current < target) return Math.min(current + delta, target);
  if (current > target) return Math.max(current - delta, target);
  return target;
}
