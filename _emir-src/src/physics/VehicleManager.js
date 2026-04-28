import * as THREE from 'three';
import { VEHICLE_PROFILES } from './VehicleProfiles.js';

const TMP_VECTOR = new THREE.Vector3();
const DOWN = { x: 0, y: -1, z: 0 };
const WHEEL_KEYS = ['fl', 'fr', 'rl', 'rr'];

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

    const bodyDesc = this.rapier.RigidBodyDesc.dynamic()
      .setTranslation(0, 4.2, 8)
      .setCanSleep(false)
      .setLinearDamping(profile.drag)
      .setAngularDamping(0.72);

    const body = this.world.createRigidBody(bodyDesc);
    const density = Math.max(80, profile.mass / (profile.dimensions.width * profile.dimensions.height * profile.dimensions.length));
    const colliderDesc = this.rapier.ColliderDesc
      .cuboid(profile.dimensions.width * 0.5, profile.dimensions.height * 0.5, profile.dimensions.length * 0.5)
      .setDensity(density)
      .setFriction(0.82)
      .setRestitution(0.03);
    const collider = this.world.createCollider(colliderDesc, body);

    if (typeof body.setAdditionalMassProperties === 'function') {
      body.setAdditionalMassProperties(profile.mass, profile.centerOfMass, { x: profile.mass, y: profile.mass, z: profile.mass }, { x: 0, y: 0, z: 0, w: 1 }, true);
    }

    const model = await this.assetLoader.createVehicleInstance(profile.id);
    this.scene.add(model.root);

    const wheels = this.#makeWheels(profile, model.parts);
    this.active = { profile, body, collider, model, wheels, speedKph: 0, steerAngle: 0, odometer: 0 };
    this.resetActiveVehicle();
  }

  resetActiveVehicle(position = { x: 0, y: 4.2, z: 8 }) {
    if (!this.active) return;
    const { body } = this.active;
    body.setTranslation(position, true);
    body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }

  update(dt, input) {
    if (!this.active) return;
    const { body, profile, wheels } = this.active;
    const translation = body.translation();
    const rotation = body.rotation();
    const q = new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
    const linvel = body.linvel();
    const velocity = new THREE.Vector3(linvel.x, linvel.y, linvel.z);
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(q).normalize();
    const side = new THREE.Vector3(1, 0, 0).applyQuaternion(q).normalize();
    this.forwardVector.copy(forward);

    const steerTarget = input.steer * profile.maxSteer;
    this.active.steerAngle = THREE.MathUtils.lerp(this.active.steerAngle, steerTarget, 1 - Math.pow(0.0001, dt));
    const throttle = input.throttle - input.brake * 0.55;
    const speedForward = velocity.dot(forward);
    this.active.speedKph = velocity.length() * 3.6;
    this.active.odometer += Math.abs(speedForward) * dt;

    for (const wheel of wheels) {
      wheel.steer = wheel.front ? this.active.steerAngle : 0;
      const local = wheel.local.clone();
      const worldMount = local.applyQuaternion(q).add(new THREE.Vector3(translation.x, translation.y, translation.z));
      const maxRay = profile.suspension.restLength + profile.wheel.radius + profile.suspension.travel;
      const ray = new this.rapier.Ray(worldMount, DOWN);
      const hit = this.world.castRay(ray, maxRay, true);
      wheel.grounded = Boolean(hit && hit.toi < maxRay);
      wheel.compression = 0;

      if (wheel.grounded) {
        const distance = hit.toi;
        const compression = THREE.MathUtils.clamp((profile.suspension.restLength + profile.wheel.radius - distance) / profile.suspension.restLength, 0, 1.3);
        wheel.compression = compression;
        const suspensionImpulse = (profile.suspension.stiffness * compression - velocity.y * profile.suspension.damping) * dt;
        this.#applyImpulseAtPoint(body, { x: 0, y: Math.max(0, suspensionImpulse), z: 0 }, worldMount);

        const driven = profile.drivenWheels.includes(wheel.key);
        const steeringForward = forward.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), wheel.steer).normalize();
        if (driven && Math.abs(throttle) > 0.001) {
          const limiter = profile.accelerationLimiter ?? 1;
          const engineImpulse = profile.torque * throttle * limiter * dt;
          this.#applyImpulseAtPoint(body, vectorToRapier(steeringForward.multiplyScalar(engineImpulse)), worldMount);
        }

        if (input.brake > 0 || input.handbrake > 0) {
          const brakeFactor = input.handbrake ? 1.65 : 1;
          const brakeImpulse = -Math.sign(speedForward || throttle || 1) * Math.min(Math.abs(speedForward) * profile.brakeForce * dt, profile.brakeForce * 0.025) * brakeFactor;
          this.#applyImpulseAtPoint(body, vectorToRapier(forward.clone().multiplyScalar(brakeImpulse)), worldMount);
        }

        const lateralSpeed = velocity.dot(side);
        const lateralGrip = profile.friction.lateral * (input.handbrake && !wheel.front ? 0.38 : 1);
        const lateralImpulse = -lateralSpeed * lateralGrip * profile.mass * 0.012 * dt;
        this.#applyImpulseAtPoint(body, vectorToRapier(side.clone().multiplyScalar(lateralImpulse)), worldMount);
      }

      wheel.spin += speedForward / Math.max(profile.wheel.radius, 0.1) * dt;
    }

    this.#updateVisuals(q, translation);
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
    const { model, wheels, profile } = this.active;
    model.root.position.set(translation.x, translation.y, translation.z);
    model.root.quaternion.copy(q);
    for (const wheel of wheels) {
      if (!wheel.node) continue;
      const restDrop = profile.suspension.restLength * (1 - wheel.compression) - profile.wheel.radius * 0.1;
      wheel.node.position.copy(wheel.local);
      wheel.node.position.y -= THREE.MathUtils.clamp(restDrop, 0, profile.suspension.restLength + profile.suspension.travel);
      wheel.node.rotation.set(wheel.spin, wheel.steer, Math.PI / 2);
    }
  }

  #applyImpulseAtPoint(body, impulse, point) {
    if (typeof body.applyImpulseAtPoint === 'function') {
      body.applyImpulseAtPoint(impulse, point, true);
    } else {
      body.applyImpulse(impulse, true);
    }
  }

  #disposeActive() {
    if (!this.active) return;
    this.scene.remove(this.active.model.root);
    this.world.removeRigidBody(this.active.body);
    this.active = null;
  }
}

function vectorToRapier(v) { return { x: v.x, y: v.y, z: v.z }; }
