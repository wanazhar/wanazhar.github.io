/**
 * End-to-end check: run a car round a circuit and confirm the rendered mesh
 * always points where the car is travelling.
 *
 * Uses the real `CarPhysics`, the real `buildTrack`, and the real
 * `buildCarMesh` / `syncCarMesh` -- the same functions the game runs. The only
 * thing stubbed is the renderer's `requestAnimationFrame`, which Three.js does
 * not need to compute world matrices.
 */

import * as THREE from 'three';

/*
 * Minimal DOM shim, installed before the render module loads.
 *
 * `buildCarMesh` draws its textures into a canvas at construction time, which is
 * correct for the browser and fatal under node. This bench only cares about
 * geometry and transforms, so the textures are irrelevant -- they just have to
 * not throw.
 *
 * Stubbed rather than skipped because the point of the bench is to exercise the
 * real `buildCarMesh` and the real `syncCarMesh`. Re-implementing them here would
 * test the copy instead of the thing that shipped, which is exactly how the 90
 * degree bug survived in the first place.
 */
globalThis.document = {
  createElement: () => ({
    width: 0,
    height: 0,
    getContext: () => ({
      createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
      putImageData() {},
      createLinearGradient: () => ({ addColorStop() {} }),
      createRadialGradient: () => ({ addColorStop() {} }),
      fillRect() {},
      fillStyle: '',
      globalAlpha: 1
    })
  })
};

import { buildTrack } from '../src/track/trackGeometry.js';
import { CIRCUITS } from '../src/track/circuits.js';
import { CarPhysics } from '../src/physics/CarPhysics.js';
import { buildCarMesh, syncCarMesh } from '../src/render/TrackMesh.js';

const DT = 1 / 60;

for (const circuit of CIRCUITS) {
  const track = buildTrack(circuit);
  const mesh = buildCarMesh();
  const car = new CarPhysics();

  // Start on the racing line at the start line, at racing speed.
  let hint = 0;
  car.reset(track.samples[0].x, track.samples[0].z, track.samples[0].heading, 55);

  let worstDot = 1;
  let worstAt = null;
  let samples = 0;
  let totalDistance = 0;

  // Simple steering: aim at a point down the road, like a lazy driver.
  for (let step = 0; step < 60 * 200; step += 1) {
    const lookAhead = 18 + Math.abs(car.vLong) * 0.45;
    let bestIndex = -1;
    let bestDistance = Infinity;
    for (let i = 0; i < track.count; i += 1) {
      let d = track.samples[i].s - (hint % track.length);
      if (d < 0) d += track.length;
      const gap = Math.abs(d - lookAhead);
      if (gap < bestDistance) { bestDistance = gap; bestIndex = i; }
    }
    hint = bestIndex;
    const target = track.samples[bestIndex];
    const toTarget = Math.atan2(target.z - car.z, target.x - car.x);
    let error = toTarget - car.heading;
    while (error > Math.PI) error -= Math.PI * 2;
    while (error < -Math.PI) error += Math.PI * 2;

    const speed = Math.abs(car.vLong);
    const targetSpeed = 70;
    car.step(DT, {
      throttle: speed < targetSpeed ? 1 : 0,
      brake: speed > targetSpeed + 8 ? 0.5 : 0,
      steer: Math.max(-1, Math.min(1, error * 1.8)),
      handbrake: false
    });

    totalDistance += Math.abs(car.vLong) * DT;

    syncCarMesh(mesh, car);
    mesh.updateMatrixWorld(true);

    // Where the mesh says the nose points, in world space.
    const nose = new THREE.Vector3(0, 0, 1).applyQuaternion(mesh.quaternion);
    nose.y = 0;
    nose.normalize();

    // Where the car is actually going. Use the velocity, not the heading: if the
    // body were rendered sideways while travelling straight the two disagree,
    // and if it were rendered correctly while sliding they would disagree too.
    const vx = car.vLong * Math.cos(car.heading) - car.vLat * Math.sin(car.heading);
    const vz = car.vLong * Math.sin(car.heading) + car.vLat * Math.cos(car.heading);
    const travel = new THREE.Vector3(vx, 0, vz);
    if (travel.lengthSq() < 4) continue;   // ignore standing starts
    travel.normalize();

    const dot = nose.dot(travel);
    samples += 1;
    if (dot < worstDot) {
      worstDot = dot;
      worstAt = { step, speed: +speed.toFixed(1), dot: +dot.toFixed(4) };
    }
  }

  const laps = (totalDistance / track.length).toFixed(2);
  /*
   * Threshold is 0.99, not 1.0.
   *
   * The residual disagreement is real physics, not residual misorientation: a
   * car at a slip angle is *supposed* to point somewhere other than where it is
   * travelling, and drifting through a corner means exactly that. A rendered
   * 90 degrees off would score 0.000 and is nowhere near this.
   */
  const worstErrorDegrees = (Math.acos(Math.min(1, Math.max(-1, worstDot))) * 180) / Math.PI;
  const verdict = worstDot > 0.99 ? 'aligned' : worstDot > 0.9 ? 'suspicious' : 'MISALIGNED';
  console.log(
    `${circuit.id.padEnd(14)} ${laps.padStart(5)} laps  ${String(samples).padStart(5)} samples  ` +
      `worst dot ${worstDot.toFixed(4)} (${worstErrorDegrees.toFixed(1)}deg slip)  ${verdict}` +
      (worstAt ? `  at ${worstAt.speed} kph` : '')
  );
  if (worstDot <= 0.9) {
    console.log(`   worst sample: ${JSON.stringify(worstAt)}`);
  }
}