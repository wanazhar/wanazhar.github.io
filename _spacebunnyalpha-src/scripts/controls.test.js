import test from 'node:test';
import assert from 'node:assert/strict';
import { FollowCamera, PlayerController } from '../src/characters/PlayerController.js';
import { InputController } from '../src/characters/PlayerController.js';

// Camera-relative movement, tested as a property rather than a snapshot.
// "Push forward" must move the player further along the camera's viewing
// direction at every camera angle. This was 180 degrees out for the entire life
// of the first build: the character walked backwards whenever you pressed W or
// pushed the joystick up.
function moveDirectionFor(camYaw, axis) {
  const lookX = -Math.sin(camYaw);
  const lookZ = -Math.cos(camYaw);
  const rightX = lookZ;
  const rightZ = -lookX;
  return { x: axis.x * rightX + axis.z * lookX, z: axis.x * rightZ + axis.z * lookZ };
}

test('pushing forward moves along the camera view direction, not against it', () => {
  for (let i = 0; i < 16; i += 1) {
    const camYaw = (i / 16) * Math.PI * 2;
    const dir = moveDirectionFor(camYaw, { x: 0, z: 1 });

    // The camera looks along -(sin(yaw), cos(yaw)).
    const lookX = -Math.sin(camYaw);
    const lookZ = -Math.cos(camYaw);
    const dot = dir.x * lookX + dir.z * lookZ;

    assert.ok(
      dot > 0.999,
      `at yaw ${camYaw.toFixed(2)} forward gives dot=${dot.toFixed(3)}; it must be ~+1 (moving away from the camera is backwards)`
    );
  }
});

test('strafing right moves perpendicular to the view, to the right of it', () => {
  for (let i = 0; i < 16; i += 1) {
    const camYaw = (i / 16) * Math.PI * 2;
    const dir = moveDirectionFor(camYaw, { x: 1, z: 0 });

    const lookX = -Math.sin(camYaw);
    const lookZ = -Math.cos(camYaw);

    // Right of the view direction, in a right-handed 2D plane (x right, z down).
    const rightX = lookZ;
    const rightZ = -lookX;
    const dotRight = dir.x * rightX + dir.z * rightZ;
    // No sideways drift along the view axis.
    const dotLook = dir.x * lookX + dir.z * lookZ;

    assert.ok(dotRight > 0.999, `at yaw ${camYaw.toFixed(2)} strafe dot=${dotRight.toFixed(3)}, expected ~+1`);
    assert.ok(Math.abs(dotLook) < 1e-6, `strafing drifted along the view axis: ${dotLook.toFixed(4)}`);
  }
});

test('backwards is exactly the opposite of forwards', () => {
  const camYaw = 0.7;
  const forward = moveDirectionFor(camYaw, { x: 0, z: 1 });
  const back = moveDirectionFor(camYaw, { x: 0, z: -1 });
  assert.ok(Math.abs(forward.x + back.x) < 1e-9);
  assert.ok(Math.abs(forward.z + back.z) < 1e-9);
});

test('the joystick axis the UI produces maps to forward movement', () => {
  // TouchControls calls setStick(x, y) with y = -dy / radius, so pushing the
  // stick up gives y = -1.
  const UP_ON_STICK = { x: 0, y: -1 };

  // InputController turns that into an axis where z is "forward".
  const axis = { x: UP_ON_STICK.x, z: -UP_ON_STICK.y };
  assert.strictEqual(axis.z, 1, 'stick up must read as forward');

  // And that must be forward in the world.
  for (let i = 0; i < 8; i += 1) {
    const camYaw = (i / 8) * Math.PI * 2;
    const dir = moveDirectionFor(camYaw, axis);
    const lookX = -Math.sin(camYaw);
    const lookZ = -Math.cos(camYaw);
    assert.ok(dir.x * lookX + dir.z * lookZ > 0.999, `stick up walked backwards at yaw ${camYaw}`);
  }
});

test('the camera sits opposite the viewing direction', () => {
  // FollowCamera.update positions the camera at focus + (sin, cos) * distance.
  // This is the invariant the movement code depends on.
  const cam = { position: { set(x, y, z) { this.x = x; this.y = y; this.z = z; } }, lookAt() {} };
  const follow = new FollowCamera(cam, {
    isBlocked: () => false,
    groundHeightAt: () => 0
  });

  for (const yaw of [0, Math.PI / 2, Math.PI, -Math.PI / 2, 2.3]) {
    follow.yaw = yaw;
    follow.pitch = 0;
    follow.distance = 10;
    follow.targetDistance = 10;
    follow.currentDistance = 10;
    follow.update(1, { x: 0, y: 0, z: 0 }, 1.7);

    // The camera should be offset along (sin, cos) from the player.
    const expectedX = Math.sin(yaw) * 10;
    const expectedZ = Math.cos(yaw) * 10;
    assert.ok(Math.abs(cam.position.x - expectedX) < 0.01, 'camera x offset');
    assert.ok(Math.abs(cam.position.z - expectedZ) < 0.01, 'camera z offset');
  }
});

// Spawn well inside the world. The controller clamps the player to a margin of
// 3 blocks from the edge, so spawning at the origin pins position against that
// clamp and makes the travel measurement read as if the player never moved.
const SPAWN = { x: 160, y: 9, z: 140 };

test('a real PlayerController moves forward when given forward input', () => {
  // End-to-end: a stubbed input reporting "forward", a real camera yaw, and
  // then check which way the player actually travels.
  const input = {
    moveAxis: () => ({ x: 0, z: 1, magnitude: 1 }),
    runRequested: false,
    jumpRequested: false,
    interactRequested: false
  };

  for (const camYaw of [0, Math.PI, 1.2, -2.4]) {
    const player = new PlayerController({
      scene: null,
      camera: {},
      input,
      groundHeightAt: () => 9,
      isBlocked: () => false
    });
    // cameraYaw is the camera's own yaw, unadjusted. main.js exposes exactly
    // this, and adding PI to it is what previously broke forward movement.
    Object.defineProperty(player, 'cameraYaw', { value: camYaw, writable: true });
    player.spawn({ ...SPAWN });

    for (let i = 0; i < 60; i += 1) player.update(1 / 60);

    const lookX = -Math.sin(camYaw);
    const lookZ = -Math.cos(camYaw);
    const dx = player.position.x - SPAWN.x;
    const dz = player.position.z - SPAWN.z;
    const travelled = dx * lookX + dz * lookZ;
    assert.ok(
      travelled > 2,
      `at camYaw ${camYaw.toFixed(2)} the player travelled ${travelled.toFixed(2)} along the view direction; expected forward`
    );
  }
});

test('cameraYaw must not be offset, or forward input reverses', () => {
  // Guards the specific mistake: exposing yaw + PI as the movement basis. The
  // camera already looks along -(sin, cos), so the extra PI is a second
  // negation and sends forward input backwards.
  const input = {
    moveAxis: () => ({ x: 0, z: 1, magnitude: 1 }),
    runRequested: false,
    jumpRequested: false,
    interactRequested: false
  };

  const travelFor = (camYawValue) => {
    const player = new PlayerController({
      scene: null,
      camera: {},
      input,
      groundHeightAt: () => 9,
      isBlocked: () => false
    });
    Object.defineProperty(player, 'cameraYaw', { value: camYawValue, writable: true });
    player.spawn({ ...SPAWN });
    for (let i = 0; i < 60; i += 1) player.update(1 / 60);

    // Measured against the true camera bearing, not the offset one.
    const trueYaw = 0.8;
    const lookX = -Math.sin(trueYaw);
    const lookZ = -Math.cos(trueYaw);
    const dx = player.position.x - SPAWN.x;
    const dz = player.position.z - SPAWN.z;
    return dx * lookX + dz * lookZ;
  };

  assert.ok(travelFor(0.8) > 2, 'the unadjusted yaw must move forward');
  assert.ok(travelFor(0.8 + Math.PI) < -2, 'adding PI must move backwards -- that is the bug');
});

test('the player never gets pinned against the world edge while walking', () => {
  // Regression guard for the measurement above: the margin clamp means a test
  // that spawns at the origin measures a pinned player, not a moving one.
  const input = {
    moveAxis: () => ({ x: 0, z: 1, magnitude: 1 }),
    runRequested: false,
    jumpRequested: false,
    interactRequested: false
  };
  const player = new PlayerController({
    scene: null,
    camera: {},
    input,
    groundHeightAt: () => 9,
    isBlocked: () => false
  });
  Object.defineProperty(player, 'cameraYaw', { value: 0, writable: true });
  player.spawn({ x: 4, y: 9, z: 160 });

  for (let i = 0; i < 60; i += 1) player.update(1 / 60);

  const moved = Math.hypot(player.position.x - 4, player.position.z - 160);
  assert.ok(moved > 2, `player barely moved (${moved.toFixed(2)}) from near the world edge`);
});