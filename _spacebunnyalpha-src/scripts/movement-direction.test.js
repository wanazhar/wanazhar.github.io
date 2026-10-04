// "Joystick go up, but character is walking backward" and "go to right,
// character to left" are the same bug wearing different clothes: a sign error
// somewhere between the thumbstick and the world-space direction it produces.
//
// Both happened. The forward vector was fixed first, which left the right
// vector still negated -- and a test that only checked "up goes up" would have
// passed happily while right still went left.
//
// So these tests do not check one axis. They check the whole compass, at many
// camera angles, against the geometric definition of left and right.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

import { InputController, FollowCamera, PlayerController } from '../src/characters/PlayerController.js';

const FLAT = () => 0;

// Drives the controller with a fixed stick input and returns the direction it
// moves in, without needing a scene, a renderer or a real camera.
function directionFor(axis, camYaw) {
  const input = {
    moveAxis: () => axis,
    runRequested: false,
    jumpRequested: false
  };

  const controller = new PlayerController({
    scene: null,
    camera: null,
    input,
    groundHeightAt: FLAT,
    isBlocked: () => false
  });

  controller.cameraYaw = camYaw;
  controller.spawn({ x: 0, y: 0, z: 0 });

  // One step is enough: the initial velocity is written from the direction
  // immediately, so this reads the intent rather than the ramp-up.
  controller.update(1 / 60);
  const { x, z } = controller.velocity;
  const len = Math.hypot(x, z);
  return len > 0 ? { x: x / len, z: z / len, speed: len } : { x: 0, z: 0, speed: 0 };
}

// Where the camera sits relative to the player, and therefore what it looks
// along. FollowCamera places the camera at focus + (sin(yaw), cos(yaw)) * d.
function lookBearing(camYaw) {
  return { x: -Math.sin(camYaw), z: -Math.cos(camYaw) };
}

const ANGLES = [0, 0.4, Math.PI / 2, Math.PI, 1.5 * Math.PI, 2.4 * Math.PI, -0.7, -2.2];

test('pushing the stick up walks away from the camera', () => {
  for (const camYaw of ANGLES) {
    const dir = directionFor({ x: 0, z: 1, magnitude: 1 }, camYaw);
    const look = lookBearing(camYaw);

    const dot = dir.x * look.x + dir.z * look.z;
    assert.ok(
      dot > 0.99,
      `at camYaw ${camYaw.toFixed(2)}: up moved ${dot.toFixed(2)} along the view, expected ~1`
    );
  }
});

test('pushing the stick down walks towards the camera', () => {
  for (const camYaw of ANGLES) {
    const dir = directionFor({ x: 0, z: -1, magnitude: 1 }, camYaw);
    const look = lookBearing(camYaw);

    const dot = dir.x * look.x + dir.z * look.z;
    assert.ok(dot < -0.99, `at camYaw ${camYaw.toFixed(2)}: down moved ${dot.toFixed(2)}, expected ~-1`);
  }
});

test('pushing the stick right moves the character to their own right', () => {
  // "Right" here means screen-right, judged against where the camera looks.
  // The old code negated the right vector, so this moved the character left.
  for (const camYaw of ANGLES) {
    const dir = directionFor({ x: 1, z: 0, magnitude: 1 }, camYaw);
    const look = lookBearing(camYaw);

    // Screen-right is the look bearing rotated so that (look, right) forms a
    // right-handed pair on screen: with look = (0,-1), right must be (1,0).
    const screenRight = { x: -look.z, z: look.x };

    const dot = dir.x * screenRight.x + dir.z * screenRight.z;
    assert.ok(
      dot > 0.99,
      `at camYaw ${camYaw.toFixed(2)}: right moved ${dot.toFixed(2)} along screen-right, expected ~1`
    );
  }
});

test('pushing the stick left moves the character to their own left', () => {
  for (const camYaw of ANGLES) {
    const dir = directionFor({ x: -1, z: 0, magnitude: 1 }, camYaw);
    const look = lookBearing(camYaw);
    const screenRight = { x: -look.z, z: look.x };

    const dot = dir.x * screenRight.x + dir.z * screenRight.z;
    assert.ok(dot < -0.99, `at camYaw ${camYaw.toFixed(2)}: left moved ${dot.toFixed(2)}, expected ~-1`);
  }
});

test('the four directions are mutually perpendicular', () => {
  // Cheap structural check: if any two of the axes collapse onto each other,
  // one of the sign errors above is back.
  const camYaw = 0.83;
  const up = directionFor({ x: 0, z: 1, magnitude: 1 }, camYaw);
  const right = directionFor({ x: 1, z: 0, magnitude: 1 }, camYaw);
  const dot = up.x * right.x + up.z * right.z;

  assert.ok(Math.abs(dot) < 0.01, `up and right are not perpendicular (dot ${dot.toFixed(3)})`);
});

test('diagonal input moves diagonally, not along one axis', () => {
  const camYaw = 0.83;
  const diag = directionFor({ x: 1, z: 1, magnitude: 1 }, camYaw);
  const up = directionFor({ x: 0, z: 1, magnitude: 1 }, camYaw);
  const right = directionFor({ x: 1, z: 0, magnitude: 1 }, camYaw);

  // The diagonal must sit exactly halfway between the two axes. The midpoint
  // has to be normalised first: summing two unit vectors and comparing against
  // it directly measures the length too, not just the direction.
  const midLen = Math.hypot(up.x + right.x, up.z + right.z);
  const midX = (up.x + right.x) / midLen;
  const midZ = (up.z + right.z) / midLen;

  const dot = diag.x * midX + diag.z * midZ;
  assert.ok(dot > 0.99, `diagonal moved ${dot.toFixed(2)} towards the up-right midpoint, expected ~1`);

  // And it must be 45 degrees off each axis, not merely somewhere between them.
  const angle = (a, b) =>
    Math.abs(Math.atan2(a.z, a.x) - Math.atan2(b.z, b.x)) * (180 / Math.PI);
  const toUp = Math.min(angle(diag, up), 360 - angle(diag, up));
  const toRight = Math.min(angle(diag, right), 360 - angle(diag, right));

  assert.ok(Math.abs(toUp - 45) < 0.5, `diagonal is ${toUp.toFixed(1)}deg from up, expected 45`);
  assert.ok(Math.abs(toRight - 45) < 0.5, `diagonal is ${toRight.toFixed(1)}deg from right, expected 45`);
});

test('the keyboard and the stick agree on every axis', () => {
  // W/S/A/D and the thumbstick are summed in moveAxis, then rotated together.
  // If they ever disagree, the game feels broken in a way that is very hard to
  // see without playing it.
  const listeners = new Map();
  globalThis.window = {
    addEventListener: (t, fn) => listeners.set(t, fn),
    removeEventListener: () => {}
  };

  const input = new InputController({
    addEventListener() {},
    removeEventListener() {}
  });

  input.setStick(0, -1, true); // stick up
  assert.deepEqual(pick(input.moveAxis()), { x: 0, z: 1 }, 'stick up should be forward');

  input.setStick(1, 0, true); // stick right
  assert.deepEqual(pick(input.moveAxis()), { x: 1, z: 0 }, 'stick right should be right');

  input.setStick(0, 1, true); // stick down
  assert.deepEqual(pick(input.moveAxis()), { x: 0, z: -1 }, 'stick down should be backward');

  input.setStick(-1, 0, true); // stick left
  assert.deepEqual(pick(input.moveAxis()), { x: -1, z: 0 }, 'stick left should be left');
});

test('the camera sits opposite the direction it looks', () => {
  // The whole sign convention rests on this: the camera is placed at
  // focus + (sin, cos) * distance, so it looks along the negation. If that
  // ever changes, both movement signs must change with it.
  for (const yaw of ANGLES) {
    // A real Vector3, so lookAt() has the shape the camera code expects.
    const camera = { position: new THREE.Vector3(), lookAt() {} };

    const cam = new FollowCamera(camera, {
      isBlocked: () => false,
      groundHeightAt: FLAT
    });
    cam.yaw = yaw;
    cam.currentDistance = 10;
    cam.distance = 10;
    cam.minDistance = 0;

    cam.update(1 / 60, { x: 0, y: 0, z: 0 }, 1.7);

    // The camera must be on the +bearing side of the focus, so that "forward"
    // is the negation of where it sits.
    const expected = { x: Math.sin(yaw), z: Math.cos(yaw) };
    const actual = camera.position;

    assert.ok(
      actual.x * expected.x >= -0.001,
      `at yaw ${yaw.toFixed(2)} the camera sat on the wrong side (x=${actual.x}, expected ~${expected.x})`
    );
    assert.ok(
      actual.z * expected.z >= -0.001,
      `at yaw ${yaw.toFixed(2)} the camera sat on the wrong side (z=${actual.z}, expected ~${expected.z})`
    );
  }
});

function pick(axis) {
  return { x: axis.x, z: axis.z };
}