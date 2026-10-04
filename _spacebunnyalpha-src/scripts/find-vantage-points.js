// Finds good camera vantage points in the world.
//
// Hand-picked viewpoints repeatedly turned out to be inside a tree canopy, a
// barn, or a hillside, which produced black frames and shots with no player
// visible. This scans candidate positions and reports the ones with real
// clearance in front, behind, and above, so the visual tour uses places that
// are actually photographable.
//
// Run: node scripts/find-vantage-points.js

import { WorldPlan } from '../src/world/World.js';
import { heightAt, biomeAt, regionAt, BIOMES } from '../src/world/Terrain.js';
import { WORLD, REGIONS } from '../src/config.js';
import { CAMERA } from '../src/config.js';

// The camera sits behind and above the player. A spot is good when there is
// clear space along that whole line and open ground in front of the player.
function clearance(plan, x, z, yaw, pitch, want) {
  const cosP = Math.cos(pitch);
  const base = heightAt(Math.floor(x), Math.floor(z));
  const focusY = base + CAMERA.height * 0.62 + 1.7 * 0.4;

  const cast = (dy) => {
    const dirX = Math.sin(yaw) * cosP;
    const dirZ = Math.cos(yaw) * cosP;
    for (let d = 0.35; d <= want; d += 0.35) {
      const px = x + dirX * d;
      const pz = z + dirZ * d;
      const py = focusY + Math.sin(pitch) * d + dy;
      if (plan.collision.isBlocked(px, pz)) return d;
      if (py < heightAt(Math.floor(px), Math.floor(pz)) + 1.3) return d;
    }
    return want;
  };

  return {
    behind: cast(0),
    // A little forward of the player, where the view will actually look.
    ahead: cast(0)
  };
}

// Trees and canopies sit above the collision grid, so clearance against
// buildings alone is not enough: check the sightline is above the tree line.
function canopyClear(plan, x, z, yaw, pitch, want) {
  const cosP = Math.cos(pitch);
  const focusY = heightAt(Math.floor(x), Math.floor(z)) + CAMERA.height * 0.62 + 0.7;
  for (let d = 1; d <= want; d += 0.5) {
    const px = x + Math.sin(yaw) * cosP * d;
    const pz = z + Math.cos(yaw) * cosP * d;
    const py = focusY + Math.sin(pitch) * d;
    // Any ground higher than the sightline blocks it.
    if (heightAt(Math.floor(px), Math.floor(pz)) + 2 > py) return d;
  }
  return want;
}

function scanRegion(plan, regionId, { count = 6, minBehind = 10 } = {}) {
  const rect = REGIONS[regionId].rect;
  const found = [];

  for (let x = rect.x0 + 6; x < rect.x1 - 6; x += 4) {
    for (let z = rect.z0 + 6; z < rect.z1 - 6; z += 4) {
      const h = heightAt(x, z);
      if (h <= WORLD.seaLevel) continue;
      // Not inside a building.
      if (plan.collision.isBlocked(x, z)) continue;

      // Prefer a biome that suits the region.
      const biome = biomeAt(x, z);
      const wanted =
        regionId === 'rural' ? [BIOMES.paddy, BIOMES.grass, BIOMES.meadow]
        : regionId === 'coast' ? [BIOMES.sand, BIOMES.shallow, BIOMES.grass]
        : regionId === 'suburbs' ? [BIOMES.grass, BIOMES.meadow, BIOMES.dirt]
        : [BIOMES.grass, BIOMES.dirt, BIOMES.meadow];
      if (!wanted.includes(biome)) continue;

      // Local flatness: a flat spot reads better than a cliff edge.
      const flat =
        Math.abs(heightAt(x + 3, z) - h) +
        Math.abs(heightAt(x - 3, z) - h) +
        Math.abs(heightAt(x, z + 3) - h) +
        Math.abs(heightAt(x, z - 3) - h);
      if (flat > 4) continue;

      // Find the best yaw: the one with the most open space behind the camera
      // and clear sightlines in front.
      let best = null;
      for (let i = 0; i < 16; i += 1) {
        const yaw = (i / 16) * Math.PI * 2;
        const pitch = 0.34;
        const behind = clearance(plan, x, z, yaw, pitch, 18).behind;
        if (behind < minBehind) continue;
        const canopy = canopyClear(plan, x, z, yaw, pitch, 18);
        const score = behind * 2 + canopy;
        if (!best || score > best.score) best = { yaw, pitch, behind, canopy, score };
      }

      if (best) {
        found.push({ x, z, h, biome, region: regionAt(x, z), ...best });
      }
    }
  }

  // Keep the best-scoring spots that are spread apart, so the tour covers a
  // region rather than five views of the same corner.
  found.sort((a, b) => b.score - a.score);
  const picked = [];
  for (const candidate of found) {
    if (picked.length >= count) break;
    if (picked.some((p) => Math.hypot(p.x - candidate.x, p.z - candidate.z) < 24)) continue;
    picked.push(candidate);
  }
  return picked;
}

const plan = new WorldPlan();

console.log('spacebunnyalpha — camera vantage point scan');
console.log('='.repeat(78));

const suggestions = {};
for (const regionId of ['city', 'suburbs', 'rural', 'coast']) {
  console.log(`\n${REGIONS[regionId].label}:`);
  const spots = scanRegion(plan, regionId, { count: 5, minBehind: 10 });
  suggestions[regionId] = spots.map((s) => ({
    x: s.x, z: s.z, yaw: Number(s.yaw.toFixed(2)),
    pitch: s.pitch, dist: Math.min(18, s.behind), biome: s.biome
  }));

  if (spots.length === 0) {
    console.log('  (none found with enough clearance)');
    continue;
  }
  for (const s of spots) {
    console.log(
      `  x=${String(s.x).padStart(3)} z=${String(s.z).padStart(3)} h=${String(s.h).padStart(2)} ` +
      `yaw=${s.yaw.toFixed(2)} behind=${s.behind.toFixed(1)} canopy=${s.canopy.toFixed(1)} ` +
      `biome=${s.biome}`
    );
  }
}

console.log('\n\nJSON for the tour script:');
console.log(JSON.stringify(suggestions, null, 2));