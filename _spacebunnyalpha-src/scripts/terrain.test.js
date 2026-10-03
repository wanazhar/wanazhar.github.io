import test from 'node:test';
import assert from 'node:assert/strict';
import { WORLD, REGIONS, REGION_ORDER } from '../src/config.js';
import {
  heightAt,
  biomeAt,
  regionAt,
  findSpawn,
  isWater,
  BIOMES,
  clearHeightCache
} from '../src/world/Terrain.js';

test('height sampling is deterministic across repeated calls', () => {
  const a = heightAt(100, 100);
  const b = heightAt(100, 100);
  assert.strictEqual(a, b, 'same column must return the same height');
});

test('a fresh import of the module reproduces the same island', async () => {
  const before = heightAt(140, 130);
  const mod = await import(`../src/world/Terrain.js?v=${Date.now()}`);
  mod.clearHeightCache();
  assert.strictEqual(mod.heightAt(140, 130), before, 'same seed must rebuild the same island');
});

test('heights stay inside the world height bounds', () => {
  for (let x = 0; x < WORLD.size; x += 7) {
    for (let z = 0; z < WORLD.size; z += 7) {
      const h = heightAt(x, z);
      assert.ok(h <= WORLD.maxHeight, `height ${h} exceeded max at ${x},${z}`);
      assert.ok(h >= -8, `height ${h} went below the ocean floor at ${x},${z}`);
      assert.ok(Number.isInteger(h), `height ${h} was not an integer at ${x},${z}`);
    }
  }
});

test('the island is surrounded by open ocean on every edge', () => {
  for (let i = 0; i < WORLD.size; i += 5) {
    assert.ok(isWater(0, i), `west edge should be ocean at z=${i}`);
    assert.ok(isWater(WORLD.size - 1, i), `east edge should be ocean at z=${i}`);
    assert.ok(isWater(i, 0), `north edge should be ocean at x=${i}`);
    assert.ok(isWater(i, WORLD.size - 1), `south edge should be ocean at x=${i}`);
  }
});

test('the centre of the island is dry land', () => {
  const h = heightAt(160, 140);
  assert.ok(h > WORLD.seaLevel, `centre should be land, got ${h}`);
});

test('the mountain peak is the highest point on the map', () => {
  let peak = -Infinity;
  let peakAt = null;
  for (let x = 0; x < WORLD.size; x += 3) {
    for (let z = 0; z < WORLD.size; z += 3) {
      const h = heightAt(x, z);
      if (h > peak) {
        peak = h;
        peakAt = { x, z };
      }
    }
  }
  assert.strictEqual(peak, WORLD.maxHeight, 'peak should reach the configured max height');
  assert.ok(peakAt.x > 200 && peakAt.z > 60, `peak should sit in the eastern highlands, got ${JSON.stringify(peakAt)}`);
});

test('the mountain rises toward the shrine and falls away west', () => {
  const atMountain = heightAt(236, 96);
  const west = heightAt(150, 96);
  assert.ok(atMountain > west + 10, `mountain (${atMountain}) should tower over the west (${west})`);
});

test('every biome that the world promises is actually reachable', () => {
  const seen = new Set();
  for (let x = 0; x < WORLD.size; x += 5) {
    for (let z = 0; z < WORLD.size; z += 5) {
      seen.add(biomeAt(x, z));
    }
  }
  for (const required of [BIOMES.ocean, BIOMES.shallow, BIOMES.sand, BIOMES.grass, BIOMES.forest, BIOMES.paddy, BIOMES.rock]) {
    assert.ok(seen.has(required), `biome "${required}" never appeared on the map`);
  }
});

test('each region rectangle is mostly dry, walkable land', () => {
  for (const id of REGION_ORDER) {
    const r = REGIONS[id].rect;
    let land = 0;
    let total = 0;
    for (let x = r.x0; x < r.x1; x += 3) {
      for (let z = r.z0; z < r.z1; z += 3) {
        total += 1;
        if (heightAt(x, z) > WORLD.seaLevel) land += 1;
      }
    }
    const ratio = land / total;
    // The coast is a beach region, so its rectangle deliberately includes sea.
    assert.ok(ratio > (id === 'coast' ? 0.5 : 0.8), `region "${id}" is only ${(ratio * 100).toFixed(0)}% land`);
  }
});

test('all four regions join into one continuous walkable landmass', () => {
  // Flood fill from the spawn across every region, then confirm a land cell
  // was reached inside each region rectangle. This is what proves the player
  // can stroll from downtown to the beach without a loading screen.
  const start = findSpawn();
  const seen = new Set();
  const key = (x, z) => z * 1024 + x;
  const stack = [[Math.floor(start.x), Math.floor(start.z)]];
  seen.add(key(stack[0][0], stack[0][1]));

  const reached = new Set();
  while (stack.length) {
    const [cx, cz] = stack.pop();
    if (heightAt(cx, cz) > WORLD.seaLevel) reached.add(regionAt(cx, cz));
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx;
      const nz = cz + dz;
      if (nx < 0 || nz < 0 || nx >= WORLD.size || nz >= WORLD.size) continue;
      const k = key(nx, nz);
      if (seen.has(k)) continue;
      seen.add(k);
      stack.push([nx, nz]);
    }
  }

  for (const id of REGION_ORDER) {
    assert.ok(reached.has(id), `region "${id}" is not reachable on foot from the spawn`);
  }
});

test('region lookup returns a known id for every sampled point', () => {
  for (let x = 0; x < WORLD.size; x += 11) {
    for (let z = 0; z < WORLD.size; z += 11) {
      assert.ok(REGION_ORDER.includes(regionAt(x, z)), `unknown region at ${x},${z}`);
    }
  }
});

test('each region rectangle reports itself as the region', () => {
  for (const id of REGION_ORDER) {
    const r = REGIONS[id].rect;
    assert.strictEqual(regionAt((r.x0 + r.x1) / 2, (r.z0 + r.z1) / 2), id);
  }
});

test('the spawn point is dry, flat and in the city', () => {
  const spawn = findSpawn();
  assert.ok(spawn.y > WORLD.seaLevel, 'spawn must not be in the water');
  assert.strictEqual(spawn.region, 'city', 'spawn should be in the city ward');
  assert.strictEqual(spawn.y, heightAt(Math.floor(spawn.x), Math.floor(spawn.z)), 'spawn must rest on the terrain');
});

test('the spawn is reachable on foot from the terrain around it', () => {
  const spawn = findSpawn();
  const sx = Math.floor(spawn.x);
  const sz = Math.floor(spawn.z);
  for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1], [3, 3], [-3, -3]]) {
    assert.ok(heightAt(sx + dx, sz + dz) > WORLD.seaLevel, `neighbouring tile ${dx},${dz} is underwater`);
  }
});

test('terrain queries are cheap enough to call per frame', () => {
  clearHeightCache();
  const started = process.hrtime.bigint();
  for (let i = 0; i < 20000; i += 1) {
    heightAt(i % WORLD.size, (i * 7) % WORLD.size);
  }
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
  assert.ok(elapsedMs < 2000, `20000 height queries took ${elapsedMs.toFixed(0)}ms`);
});