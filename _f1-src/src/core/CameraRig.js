/**
 * Camera rig: a chase camera behind the car that behaves like a real broadcast
 * camera rather than a rigidly attached view.
 *
 * The important behaviours are that it lags the car's heading slightly, so hard
 * direction changes read as the world swinging round, that it pulls back with
 * speed, and that it never ends up inside the track wall.
 */

import * as THREE from 'three';
import { clamp, damp, dampAngle, lerp } from '../util/math.js';
import { locateOnTrack } from '../track/trackGeometry.js';

export const CAMERA_MODES = ['chase', 'cockpit', 'tv'];

const CHASE_DISTANCE = 11.5;
const CHASE_HEIGHT = 4.4;
const COCKPIT_OFFSET = new THREE.Vector3(0, 1.05, 0.35);

export class CameraRig {
  constructor(camera, track) {
    this.camera = camera;
    this.track = track;
    this.mode = 'chase';
    this.distance = CHASE_DISTANCE;
    this.distanceTarget = CHASE_DISTANCE;
    this.height = CHASE_HEIGHT;
    this.yaw = 0;
    this.pitch = 0;
    this.lookAt = new THREE.Vector3();
    this.smoothTarget = new THREE.Vector3();
    this.shake = 0;
    this.shakeTime = 0;
    this.tvAnchor = null;
    this.tvTimer = 0;
    this.initialised = false;
  }

  setMode(mode) {
    if (!CAMERA_MODES.includes(mode)) return;
    this.mode = mode;
    this.initialised = false;
  }

  cycleMode() {
    const index = CAMERA_MODES.indexOf(this.mode);
    this.setMode(CAMERA_MODES[(index + 1) % CAMERA_MODES.length]);
  }

  /** Add a short shake, e.g. on contact with a barrier. */
  addShake(amount) {
    this.shake = Math.min(1.4, this.shake + amount);
  }

  /**
   * @param {object} car physics state to follow
   * @param {number} dt
   * @param {object} [leader] physics state of the car leading, for the TV camera
   */
  update(car, dt, leader = null) {
    if (!this.initialised) {
      this.yaw = car.heading;
      this.smoothTarget.set(car.x, 0.6, car.z);
      this.distance = this.distanceTarget;
      this.initialised = true;
    }

    const speedT = clamp(car.speed / 90, 0, 1);

    switch (this.mode) {
      case 'cockpit':
        this.#updateCockpit(car);
        break;
      case 'tv':
        this.#updateTv(car, leader, dt);
        break;
      default:
        this.#updateChase(car, dt, speedT);
        break;
    }

    // Shake decays quickly so an impact reads as a jolt, not a wobble.
    this.shake = Math.max(0, this.shake - dt * 2.6);
    if (this.shake > 0) {
      this.shakeTime += dt * 42;
      const magnitude = this.shake * this.shake * 0.4;
      this.camera.position.x += Math.sin(this.shakeTime) * magnitude;
      this.camera.position.y += Math.sin(this.shakeTime * 1.7) * magnitude;
      this.camera.position.z += Math.cos(this.shakeTime * 1.3) * magnitude;
    }
  }

  #updateChase(car, dt, speedT) {
    // The camera follows a damped version of the car's heading, which is what
    // makes a quick direction change feel like the world swinging past.
    const followRate = lerp(3.2, 7.5, speedT);
    this.yaw = dampAngle(this.yaw, car.heading, followRate, dt);

    // Pull back and lift slightly with speed.
    this.distanceTarget = CHASE_DISTANCE + speedT * 3.4;
    this.distance = damp(this.distance, this.distanceTarget, 3, dt);
    this.height = CHASE_HEIGHT + speedT * 1.1;

    const behind = this.distance;
    let x = car.x - Math.cos(this.yaw) * behind;
    let z = car.z - Math.sin(this.yaw) * behind;
    // Ride the road: the car's own height, not a fixed altitude. On a circuit with
    // fourteen metres of elevation a fixed-height chase camera spends half the lap
    // underground and half of it looking down at the roof.
    const y = this.height + (car.y ?? 0);

    // Keep the camera above the track surface and out of the barrier.
    const located = locateOnTrack(this.track, x, z, null);
    const limit = located.sample.width * 0.5 + 20;
    if (Math.abs(located.lateral) > limit) {
      const clamped = clamp(located.lateral, -limit, limit);
      x = located.sample.x + located.sample.rightX * clamped;
      z = located.sample.z + located.sample.rightZ * clamped;
    }

    this.smoothTarget.set(x, y, z);
    this.camera.position.x = damp(this.camera.position.x, x, 9, dt);
    this.camera.position.y = damp(this.camera.position.y, y, 9, dt);
    this.camera.position.z = damp(this.camera.position.z, z, 9, dt);

    // Look slightly ahead of the car rather than at it, which reads as speed.
    const lead = clamp(car.speed * 0.16, 0, 9);
    this.lookAt.set(
      car.x + Math.cos(car.heading) * lead,
      (car.y ?? 0) + 1.1,
      car.z + Math.sin(car.heading) * lead
    );
    this.camera.lookAt(this.lookAt);
  }

  #updateCockpit(car) {
    const cos = Math.cos(car.heading);
    const sin = Math.sin(car.heading);
    // Body axes: local +X is right, local +Z is forward in this world layout.
    this.camera.position.set(
      car.x + cos * COCKPIT_OFFSET.z + sin * COCKPIT_OFFSET.x,
      (car.y ?? 0) + COCKPIT_OFFSET.y,
      car.z + sin * COCKPIT_OFFSET.z - cos * COCKPIT_OFFSET.x
    );
    const lead = clamp(car.speed * 0.2, 1, 12);
    this.lookAt.set(
      car.x + cos * lead,
      (car.y ?? 0) + 1.0,
      car.z + sin * lead
    );
    this.camera.lookAt(this.lookAt);
    // A little shake from the car itself, more so on rough surface.
    this.camera.rotation.z += -car.yawRate * 0.08;
  }

  /** Trackside cameras that pan to follow whoever is nearest to them. */
  #updateTv(car, leader, dt) {
    this.tvTimer -= dt;
    if (!this.tvAnchor || this.tvTimer <= 0) {
      this.tvAnchor = this.#pickTvAnchor();
      this.tvTimer = 6.5;
    }

    const anchor = this.tvAnchor;
    const target = this.#nearestCarTo(anchor);
    this.camera.position.set(anchor.x, anchor.y, anchor.z);
    this.lookAt.set(target.x, 0.7, target.z);
    this.camera.lookAt(this.lookAt);
    this.camera.position.x = damp(this.camera.position.x, anchor.x, 8, dt);
    this.camera.position.z = damp(this.camera.position.z, anchor.z, 8, dt);
    void leader;
  }

  #pickTvAnchor() {
    const samples = this.track.samples;
    const index = Math.floor(Math.random() * samples.length);
    const sample = samples[index];
    const side = Math.random() > 0.5 ? 1 : -1;
    const offset = sample.width * 0.5 + 22;
    return {
      x: sample.x + sample.rightX * offset * side,
      y: 7 + Math.random() * 5,
      z: sample.z + sample.rightZ * offset * side
    };
  }

  #nearestCarTo(anchor) {
    // Without a reference to the field this simply looks at the anchor point;
    // the game loop calls `setFocus` with the car being watched.
    return this.focus ?? { x: anchor.x, z: anchor.z };
  }

  /** Tell the TV camera which car to watch. */
  setFocus(physics) {
    this.focus = physics;
  }
}