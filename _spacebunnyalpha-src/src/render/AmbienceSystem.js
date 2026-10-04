import * as THREE from 'three';
import { mulberry32 } from '../util/rng.js';

// A single pooled Points cloud per ambience type. Recycling positions inside a
// moving box around the camera keeps the particle count fixed, so no system
// ever allocates during play.
class PointPool {
  constructor(scene, count, { color, size, opacity = 0.85, texture = null }) {
    this.count = count;
    this.positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

    this.material = new THREE.PointsMaterial({
      color,
      size,
      transparent: true,
      opacity,
      depthWrite: false,
      sizeAttenuation: true,
      map: texture
    });

    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
    scene.add(this.points);
    this.scene = scene;
  }

  setPosition(i, x, y, z) {
    this.positions[i * 3] = x;
    this.positions[i * 3 + 1] = y;
    this.positions[i * 3 + 2] = z;
  }

  setVelocity(i, x, y, z) {
    this.velocities[i * 3] = x;
    this.velocities[i * 3 + 1] = y;
    this.velocities[i * 3 + 2] = z;
  }

  sync() {
    this.points.geometry.attributes.position.needsUpdate = true;
  }

  setVisible(v) {
    this.points.visible = v;
  }

  dispose() {
    this.scene.remove(this.points);
    this.points.geometry.dispose();
    this.material.dispose();
  }
}

// A soft round dot, used for petals, pollen and fireflies.
function makeDotTexture(inner = '#ffffff', outer = 'rgba(255,255,255,0)') {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, outer);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

export class AmbienceSystem {
  constructor(scene) {
    this.scene = scene;
    this.rng = mulberry32(9182);
    this.elapsed = 0;

    this.dotTexture = makeDotTexture();

    // Sakura petals: the signature of the city and the suburbs.
    this.petals = new PointPool(scene, 220, {
      color: 0xf6c4d8,
      size: 0.28,
      opacity: 0.9,
      texture: this.dotTexture
    });

    // Rain streaks.
    this.rain = new PointPool(scene, 900, {
      color: 0xbcd8ec,
      size: 0.14,
      opacity: 0.55,
      texture: this.dotTexture
    });

    // Fireflies over the fields at night.
    this.fireflies = new PointPool(scene, 90, {
      color: 0xd8f080,
      size: 0.2,
      opacity: 0.95,
      texture: this.dotTexture
    });

    // Pollen drifting in daylight over the farmland.
    this.pollen = new PointPool(scene, 140, {
      color: 0xf4f0c0,
      size: 0.16,
      opacity: 0.6,
      texture: this.dotTexture
    });

    // Sea spray / gulls over the coast.
    this.seabirds = new PointPool(scene, 24, {
      color: 0xf8f8f8,
      size: 0.5,
      opacity: 0.9,
      texture: this.dotTexture
    });

    this.pools = {
      petals: this.petals,
      rain: this.rain,
      fireflies: this.fireflies,
      pollen: this.pollen,
      seabirds: this.seabirds
    };

    this.activeMode = 'none';
    this.rainIntensity = 0;
    this.birdPhase = 0;
  }

  // Resets every particle into a box centred on the camera.
  resetPool(pool, camera, radius, height, floorY) {
    const { x, y, z } = camera.position;
    for (let i = 0; i < pool.count; i += 1) {
      pool.setPosition(
        i,
        x + (this.rng() - 0.5) * radius * 2,
        floorY + this.rng() * height,
        z + (this.rng() - 0.5) * radius * 2
      );
    }
    pool.sync();
  }

  update(deltaSeconds, camera, mode, { rainIntensity = 0, groundHeight = 0 } = {}) {
    this.elapsed += deltaSeconds;
    this.activeMode = mode;
    this.rainIntensity = rainIntensity;

    for (const [name, pool] of Object.entries(this.pools)) {
      pool.setVisible(name === mode);
    }

    const camX = camera.position.x;
    const camY = camera.position.y;
    const camZ = camera.position.z;

    if (mode === 'petals') this.updatePetals(deltaSeconds, camX, camY, camZ);
    else if (mode === 'rain') this.updateRain(deltaSeconds, camX, camY, camZ, rainIntensity);
    else if (mode === 'fireflies') this.updateFireflies(deltaSeconds, camX, groundHeight, camZ);
    else if (mode === 'pollen') this.updatePollen(deltaSeconds, camX, camY, camZ);
    else if (mode === 'seabirds') this.updateBirds(deltaSeconds, camX, camZ);
  }

  // Petals fall slowly, swinging side to side as they descend.
  updatePetals(dt, cx, cy, cz) {
    const p = this.petals;
    const radius = 26;
    if (p.count === 0) return;

    for (let i = 0; i < p.count; i += 1) {
      let x = p.positions[i * 3];
      let y = p.positions[i * 3 + 1];
      let z = p.positions[i * 3 + 2];

      y -= (0.6 + (i % 5) * 0.08) * dt;
      x += Math.sin(this.elapsed * 1.3 + i) * 0.5 * dt;
      z += Math.cos(this.elapsed * 1.1 + i * 0.7) * 0.5 * dt;

      // Recycle when it drifts out of the box or lands.
      if (y < cy - 6 || Math.abs(x - cx) > radius || Math.abs(z - cz) > radius) {
        x = cx + (this.rng() - 0.5) * radius * 2;
        z = cz + (this.rng() - 0.5) * radius * 2;
        y = cy + 12 + this.rng() * 8;
      }

      p.setPosition(i, x, y, z);
    }
    p.sync();
  }

  // Rain falls fast and slightly slanted, recycled from above the camera.
  updateRain(dt, cx, cy, cz, intensity) {
    const p = this.rain;
    const radius = 22;
    // Fade the whole layer rather than culling particles, so light rain still
    // reads as light rain.
    p.material.opacity = 0.15 + intensity * 0.45;

    for (let i = 0; i < p.count; i += 1) {
      let x = p.positions[i * 3];
      let y = p.positions[i * 3 + 1];
      let z = p.positions[i * 3 + 2];

      y -= (14 + (i % 7)) * dt;
      x -= 1.6 * dt;

      if (y < cy - 8) {
        x = cx + (this.rng() - 0.5) * radius * 2;
        z = cz + (this.rng() - 0.5) * radius * 2;
        y = cy + 14 + this.rng() * 6;
      }

      p.setPosition(i, x, y, z);
    }
    p.sync();
  }

  // Fireflies drift in lazy loops and pulse in brightness.
  updateFireflies(dt, cx, groundY, cz) {
    const p = this.fireflies;
    const radius = 22;
    p.material.opacity = 0.55 + Math.sin(this.elapsed * 2.2) * 0.3;

    for (let i = 0; i < p.count; i += 1) {
      let x = p.positions[i * 3];
      let y = p.positions[i * 3 + 1];
      let z = p.positions[i * 3 + 2];

      x += Math.sin(this.elapsed * 0.6 + i * 1.7) * 0.35 * dt;
      z += Math.cos(this.elapsed * 0.5 + i * 1.3) * 0.35 * dt;
      y += Math.sin(this.elapsed * 0.9 + i) * 0.2 * dt;

      if (Math.abs(x - cx) > radius || Math.abs(z - cz) > radius) {
        x = cx + (this.rng() - 0.5) * radius * 2;
        y = groundY + 1 + this.rng() * 3;
        z = cz + (this.rng() - 0.5) * radius * 2;
      }

      p.setPosition(i, x, y, z);
    }
    p.sync();
  }

  updatePollen(dt, cx, cy, cz) {
    const p = this.pollen;
    const radius = 24;
    for (let i = 0; i < p.count; i += 1) {
      let x = p.positions[i * 3];
      let y = p.positions[i * 3 + 1];
      let z = p.positions[i * 3 + 2];

      y += 0.15 * dt;
      x += Math.sin(this.elapsed * 0.8 + i) * 0.3 * dt;
      z += Math.cos(this.elapsed * 0.7 + i) * 0.3 * dt;

      if (y > cy + 8 || Math.abs(x - cx) > radius || Math.abs(z - cz) > radius) {
        x = cx + (this.rng() - 0.5) * radius * 2;
        z = cz + (this.rng() - 0.5) * radius * 2;
        y = cy + 1 + this.rng() * 2;
      }

      p.setPosition(i, x, y, z);
    }
    p.sync();
  }

  // Gulls circling the bay: each bird orbits a centre at its own radius.
  updateBirds(dt, cx, cz) {
    const p = this.seabirds;
    this.birdPhase += dt * 0.25;

    for (let i = 0; i < p.count; i += 1) {
      const orbit = this.elapsed * 0.4 + i * 0.9;
      const radius = 14 + (i % 6) * 4;
      const x = cx + Math.cos(orbit) * radius;
      const z = cz + Math.sin(orbit) * radius;
      const y = 14 + Math.sin(this.elapsed * 0.8 + i) * 2.5;
      p.setPosition(i, x, y, z);
    }
    p.sync();
  }

  dispose() {
    for (const pool of Object.values(this.pools)) pool.dispose();
    this.dotTexture.dispose();
  }
}