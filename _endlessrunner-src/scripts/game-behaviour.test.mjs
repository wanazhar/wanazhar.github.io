import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { OBB } from 'three/addons/math/OBB.js';
import { gsap } from 'gsap';
import { BASE_WORLD_SPEED, MAX_DELTA, LANES, PowerUpType } from '../src/core/Constants.js';
import { sweptWindowHit } from '../src/collision/sweep.js';
import { makeOBB, updateWorldOBB } from '../src/collision/OBBUtils.js';
import { CoinManager } from '../src/world/CoinManager.js';
import { PowerUpManager } from '../src/world/PowerUpManager.js';
import { ObstaclePool } from '../src/world/ObstaclePool.js';
import { CharacterController } from '../src/player/CharacterController.js';
import { Hud } from '../src/ui/Hud.js';
import { FakeElement } from './register-dom.mjs';

// How far the world travels in the worst frame the game allows: the base speed
// at the 3.15x ceiling advanceRun() ramps to, over the delta cap.
const WORST_STEP = BASE_WORLD_SPEED * 3.15 * MAX_DELTA;

function makePlayerRoot({ x = LANES[1], y = 0, z = 0 } = {}) {
  const root = new THREE.Object3D();
  root.position.set(x, y, z);
  return root;
}

function makeHud(state) {
  const strip = new FakeElement('div');
  const hud = new Hud(
    { subscribe: () => () => {}, getState: () => state },
    { subscribe: () => () => {} },
    { getSwipeThreshold: () => 42 }
  );
  hud.powerUps = strip;
  return { hud, strip };
}

test('a full-speed frame outruns every collection window', () => {
  assert.equal(WORST_STEP.toFixed(2), '1.89', 'the capped frame steps ~1.89 units');
  assert.ok(WORST_STEP > 1.24, 'wider than the coin window (0.62 each side)');
  assert.ok(WORST_STEP > 1.84, 'wider than the power-up window (0.92 each side)');

  const previous = -0.5;
  const landing = previous + WORST_STEP;
  assert.equal(Math.abs(landing) < 0.62, false, 'a point test samples the landing spot and misses the coin');
  assert.equal(sweptWindowHit(previous, landing, 0, 0.62), true, 'the swept test catches the coin');
  assert.equal(Math.abs(landing) < 0.92, false, 'a point test misses the power-up the same way');
  assert.equal(sweptWindowHit(previous, landing, 0, 0.92), true, 'the swept test catches the power-up');
});

test('a coin is collected on a frame that steps past it', () => {
  const collected = [];
  const coins = new CoinManager(new THREE.Scene(), { count: 8, onCollect: (value) => collected.push(value) });
  for (const coin of coins.coins) coin.active = false;

  const target = coins.coins[0];
  Object.assign(target, { active: true, laneIndex: 1, x: LANES[1], y: 1.05, baseY: 1.05, z: -0.5 });

  coins.update(MAX_DELTA, BASE_WORLD_SPEED * 3.15, makePlayerRoot(), {});

  assert.equal(collected.length, 1, 'the coin crossed the runner during the frame');
  assert.equal(target.active, false, 'and was consumed, not re-rendered');
  assert.ok(target.z > 0.62, 'its landing spot is outside the window — the point test would have missed it');
});

test('a power-up is collected on a frame that steps past it', () => {
  const collected = [];
  const powerUps = new PowerUpManager(new THREE.Scene(), { size: 4, onCollect: (type) => collected.push(type) });
  for (const item of powerUps.items) item.active = false;

  const target = powerUps.items[0];
  target.active = true;
  target.z = -0.5;
  target.baseY = 1.32;
  target.group.position.set(LANES[1], 1.32, -0.5);

  powerUps.update(MAX_DELTA, BASE_WORLD_SPEED * 3.15, makePlayerRoot());

  assert.deepEqual(collected, [target.type], 'the power-up was collected and handed to the game');
});

test('an obstacle that crosses the runner inside one frame still collides', () => {
  const pool = new ObstaclePool(new THREE.Scene(), { size: 4 });
  const gate = pool.obstacles[0];
  // The gate's collision box, matching ObstaclePool's `obstacleTypes`.
  gate.localOBB = makeOBB({ x: 0, y: 1.55, z: 0 }, { x: 0.86, y: 1.55, z: 0.42 });
  gate.group.scale.setScalar(1);
  gate.group.position.set(LANES[1], 0, -0.5);
  gate.group.updateMatrixWorld(true);

  const playerOBB = makeOBB({ x: LANES[1], y: 1.05, z: 0 }, { x: 0.48, y: 1.05, z: 0.42 });

  pool.update(MAX_DELTA, BASE_WORLD_SPEED * 3.15);

  const landingOBB = updateWorldOBB(gate.localOBB, gate.group, new OBB());
  assert.equal(landingOBB.intersectsOBB(playerOBB), false, 'the landing spot alone is a clean miss');
  assert.ok(
    pool.getCollisionOBBs().some((obb) => obb.intersectsOBB(playerOBB)),
    'the swept box reports the crash the runner actually had'
  );
});

test('a jetpack collected mid-lane-change still lands on the lane', () => {
  const controller = new CharacterController(new THREE.Scene(), { themeId: 'neon' });
  controller.setLane(0);
  assert.equal(gsap.getTweensOf(controller.root.position).length, 1, 'the lane change is in flight');

  controller.applyPowerUps({ [PowerUpType.JETPACK]: 5 });

  const tweens = gsap.getTweensOf(controller.root.position);
  const flight = tweens[tweens.length - 1];
  assert.ok(flight, 'the flight transition tween exists');
  assert.equal(flight.vars.x, LANES[0], 'it keeps the aborted lane change target');
  assert.equal(flight.vars.y, controller.flyY, 'and it flies to the jetpack height');

  for (const tween of tweens) tween.kill();
  gsap.killTweensOf(controller.root.position);
});

test('the power-up strip reuses its pills while the timers tick', () => {
  const state = { gameState: 'Playing', score: 0, coins: 0, highScore: 0, activePowerUps: {} };
  const { hud, strip } = makeHud(state);

  hud.render({ ...state, activePowerUps: { [PowerUpType.MAGNET]: 6.2, [PowerUpType.MULTIPLIER]: 4.4 } });
  assert.deepEqual(strip.children.map((pill) => pill.textContent), ['Magnet 6.2s', '2x Score 4.4s']);
  const pills = [...strip.children];

  // 6.20s -> 6.18s displays the same tenths: an entire frame that changes
  // nothing must not touch the DOM at all.
  hud.render({ ...state, activePowerUps: { [PowerUpType.MAGNET]: 6.18, [PowerUpType.MULTIPLIER]: 4.38 } });
  assert.equal(strip.children[0], pills[0], 'the magnet pill survived an unchanged frame');
  assert.equal(strip.children[1], pills[1], 'the multiplier pill survived an unchanged frame');

  // The tenth ticks: the text changes on the same nodes, nothing is rebuilt.
  hud.render({ ...state, activePowerUps: { [PowerUpType.MAGNET]: 6.04, [PowerUpType.MULTIPLIER]: 4.24 } });
  assert.equal(strip.children[0], pills[0], 'the magnet pill is reused across the text update');
  assert.equal(strip.children[1], pills[1], 'the multiplier pill is reused across the text update');
  assert.deepEqual(strip.children.map((pill) => pill.textContent), ['Magnet 6.0s', '2x Score 4.2s']);

  // One expires: its pill leaves, the live one keeps its node, and a new
  // pickup lands in sorted order.
  hud.render({ ...state, activePowerUps: { [PowerUpType.MULTIPLIER]: 4.2 } });
  assert.deepEqual(strip.children, [pills[1]], 'the expired pill is the only casualty');
  hud.render({ ...state, activePowerUps: { [PowerUpType.MULTIPLIER]: 3.9, [PowerUpType.SHIELD]: 6.6 } });
  assert.deepEqual(strip.children.map((pill) => pill.textContent), ['Shield 6.6s', '2x Score 3.9s']);
  assert.equal(strip.children[1], pills[1], 'the surviving pill keeps its node while a new one is added');

  hud.render({ ...state, activePowerUps: {} });
  const emptyPill = strip.children[0];
  assert.equal(emptyPill.textContent, 'No active power-ups');
  hud.render({ ...state, activePowerUps: {} });
  assert.equal(strip.children[0], emptyPill, 'the empty state is a persistent pill, not a fresh innerHTML write');
});
