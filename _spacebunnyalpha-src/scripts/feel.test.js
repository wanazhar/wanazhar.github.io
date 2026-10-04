import test from 'node:test';
import assert from 'node:assert/strict';
import { PlayerController, FollowCamera } from '../src/characters/PlayerController.js';
import { PLAYER } from '../src/config.js';

function makeController(axis = { x: 0, z: 0, magnitude: 0 }) {
  const input = {
    moveAxis: () => axis,
    runRequested: false,
    jumpRequested: false,
    interactRequested: false
  };
  const player = new PlayerController({
    scene: null,
    camera: {},
    input,
    groundHeightAt: () => 0,
    isBlocked: () => false
  });
  Object.defineProperty(player, 'cameraYaw', { value: 0, writable: true });
  player.spawn({ x: 160, y: 9, z: 140 });
  return { player, input };
}

const speedOf = (player) => Math.hypot(player.velocity.x, player.velocity.z);

test('a character accelerates from rest rather than starting at full speed', () => {
  const axis = { x: 0, z: 1, magnitude: 1 };
  const { player } = makeController(axis);

  // One frame in, speed should be a small fraction of walk speed.
  player.update(1 / 60);
  const firstFrame = speedOf(player);
  assert.ok(firstFrame > 0, 'the character should have started moving');
  assert.ok(
    firstFrame < PLAYER.walkSpeed * 0.4,
    `after one frame speed was ${firstFrame.toFixed(2)}, expected well under ${PLAYER.walkSpeed}`
  );

  // After a second it should have settled close to walk speed.
  for (let i = 0; i < 60; i += 1) player.update(1 / 60);
  assert.ok(
    speedOf(player) > PLAYER.walkSpeed * 0.85,
    `after a second speed was ${speedOf(player).toFixed(2)}, expected near ${PLAYER.walkSpeed}`
  );
});

test('braking is slower than accelerating, so stopping has weight', () => {
  const axis = { x: 0, z: 1, magnitude: 1 };
  const { player, input } = makeController(axis);
  for (let i = 0; i < 60; i += 1) player.update(1 / 60);
  const cruising = speedOf(player);
  assert.ok(cruising > PLAYER.walkSpeed * 0.8, 'should be up to speed before braking');

  // Release the input and watch it coast down.
  input.moveAxis = () => ({ x: 0, z: 0, magnitude: 0 });
  for (let i = 0; i < 12; i += 1) player.update(1 / 60);
  const afterShortBrake = speedOf(player);

  assert.ok(
    afterShortBrake > cruising * 0.4,
    `braking dropped to ${afterShortBrake.toFixed(2)} from ${cruising.toFixed(2)} in 0.2s; it should coast, not stop dead`
  );
});

test('the character comes to a full stop when input is released', () => {
  const axis = { x: 0, z: 1, magnitude: 1 };
  const { player, input } = makeController(axis);
  for (let i = 0; i < 60; i += 1) player.update(1 / 60);
  input.moveAxis = () => ({ x: 0, z: 0, magnitude: 0 });
  for (let i = 0; i < 120; i += 1) player.update(1 / 60);
  assert.ok(speedOf(player) < 0.05, `should have stopped, still moving at ${speedOf(player).toFixed(3)}`);
});

test('the character faces the direction it is actually travelling', () => {
  // The rig's face points +z at yaw 0, and a Three.js Y-rotation of yaw about
  // (sin, cos) means "forward" is (sin(yaw), cos(yaw)). This checks the model
  // heading matches the velocity vector rather than trusting the arithmetic.
  for (const [axis, label] of [
    [{ x: 0, z: 1, magnitude: 1 }, 'forward'],
    [{ x: 1, z: 0, magnitude: 1 }, 'strafe right'],
    [{ x: -0.6, z: 0.8, magnitude: 1 }, 'diagonal']
  ]) {
    const { player } = makeController(axis);
    for (let i = 0; i < 60; i += 1) player.update(1 / 60);

    const speed = Math.hypot(player.velocity.x, player.velocity.z);
    assert.ok(speed > 0.5, `${label}: should be moving`);

    // Direction the model faces.
    const faceX = Math.sin(player.yaw);
    const faceZ = Math.cos(player.yaw);
    // Direction of travel.
    const velX = player.velocity.x / speed;
    const velZ = player.velocity.z / speed;

    const dot = faceX * velX + faceZ * velZ;
    assert.ok(
      dot > 0.99,
      `${label}: model faces (${faceX.toFixed(2)},${faceZ.toFixed(2)}) but travels (${velX.toFixed(2)},${velZ.toFixed(2)}), dot ${dot.toFixed(3)}`
    );
  }
});

test('turning is eased rather than instant', () => {
  const { player } = makeController({ x: 0, z: 1, magnitude: 1 });

  // Let the heading settle on forward before measuring a turn.
  for (let i = 0; i < 60; i += 1) player.update(1 / 60);
  const before = player.yaw;

  // A 0.7/0.7 diagonal is 45 degrees off pure forward, so the settled target
  // is a 45 degree turn, not a quarter turn.
  player.input.moveAxis = () => ({ x: 0.7, z: 0.7, magnitude: 1 });
  player.update(1 / 60);

  const turned = Math.abs(
    Math.atan2(Math.sin(player.yaw - before), Math.cos(player.yaw - before))
  );
  assert.ok(turned > 0.001, 'the heading should have begun to move towards the input');

  // The target turn is 45 degrees (0.785 rad). One frame must not complete it.
  const targetTurn = Math.atan2(0.7, 0.7);
  assert.ok(
    turned < targetTurn * 0.9,
    `a single 1/60s frame should not snap a 45 degree turn; it moved ${((turned * 180) / Math.PI).toFixed(1)} degrees`
  );

  // Over half a second it should arrive.
  for (let i = 0; i < 30; i += 1) player.update(1 / 60);

  // The settled heading is whatever the camera-relative basis actually produces
  // for an up-right input. Hard-coding +45 degrees baked in the old, wrong
  // right-vector: it turned the character LEFT for rightward input, which was
  // the same sign error as "go right, character goes left".
  const expected = settledHeading(player, 0.7, 0.7);
  const settled = Math.abs(
    Math.atan2(Math.sin(player.yaw - expected), Math.cos(player.yaw - expected))
  );
  assert.ok(
    settled < 0.15,
    `should have settled on the new heading, off by ${settled.toFixed(3)} rad (yaw ${player.yaw.toFixed(2)}, wanted ${expected.toFixed(2)})`
  );
});

// The world-space heading a given input should settle on, derived from the same
// camera-relative basis the controller uses.
function settledHeading(player, axisX, axisZ) {
  const camYaw = player.cameraYaw ?? 0;
  const lookX = -Math.sin(camYaw);
  const lookZ = -Math.cos(camYaw);
  const rightX = -lookZ;
  const rightZ = lookX;
  return Math.atan2(axisX * rightX + axisZ * lookX, axisX * rightZ + axisZ * lookZ);
}

test('the lean builds up with speed and relaxes when stopped', () => {
  const { player, input } = makeController({ x: 0, z: 1, magnitude: 1 });
  assert.strictEqual(player.lean, 0, 'no lean at rest');

  for (let i = 0; i < 60; i += 1) player.update(1 / 60);
  const moving = Math.abs(player.lean);
  assert.ok(moving > 0.01, `lean should build while moving, got ${moving.toFixed(4)}`);
  assert.ok(moving < 0.2, `lean should stay subtle, got ${moving.toFixed(4)}`);

  input.moveAxis = () => ({ x: 0, z: 0, magnitude: 0 });
  for (let i = 0; i < 120; i += 1) player.update(1 / 60);
  assert.ok(Math.abs(player.lean) < 0.01, `lean should relax at rest, got ${player.lean.toFixed(4)}`);
});

test('the lean axis follows the direction of travel', () => {
  const { player } = makeController({ x: 1, z: 0, magnitude: 1 });
  for (let i = 0; i < 60; i += 1) player.update(1 / 60);

  // Travelling +x at yaw ~+PI/2 means the lean should be mostly on z, not x.
  assert.ok(
    Math.abs(player.lean) > 0.01,
    'a sideways walk should still lean'
  );

  // Apply it to a stub rig and confirm the rotation is applied, not dropped.
  const rig = { root: { position: { set() {} }, rotation: { x: 0, y: 0, z: 0 } } };
  player.applyToRig(rig, 1 / 60);
  const rotated = Math.abs(rig.root.rotation.z) + Math.abs(rig.root.rotation.x);
  assert.ok(rotated > 0.001, 'applyToRig should transfer the lean to the rig');
});

test('exhaustion slows rather than stopping the player', () => {
  const axis = { x: 0, z: 1, magnitude: 1 };
  const { player, input } = makeController(axis);
  input.runRequested = true;

  for (let i = 0; i < 600; i += 1) player.update(1 / 60);
  assert.ok(player.exhausted, 'running long enough should exhaust the player');
  assert.ok(
    speedOf(player) > 0,
    'an exhausted player must still be able to move; this is a chill game'
  );
});

test('the camera still keeps a floor under the terrain', () => {
  // Regression guard: raising the camera's aim height once broke the terrain
  // check, which then yanked the camera to minimum distance constantly.
  const cam = { position: { set(x, y, z) { this.x = x; this.y = y; this.z = z; } }, lookAt() {} };
  const flat = new FollowCamera(cam, { isBlocked: () => false, groundHeightAt: () => 0 });
  flat.update(1 / 60, { x: 0, y: 0, z: 0 }, PLAYER.height);
  assert.ok(flat.currentDistance > 4, `open ground should allow full distance, got ${flat.currentDistance.toFixed(2)}`);
});
