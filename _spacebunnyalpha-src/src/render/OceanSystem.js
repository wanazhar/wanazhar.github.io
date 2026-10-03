import * as THREE from 'three';
import { WORLD } from '../config.js';

// Water, art-directed rather than simulated.
//
// The brief here is calm, not physical. Ghibli water is a large, mostly
// uniform reflective field: the sky's own colour, a brighter path toward the
// sun, and a few drawn ripple lines. Displacing a blue vertex grid to fake
// swell is the thing that reads as "game water"; a flat toon plane in the sky's
// colour with a sun path on it reads as painted water, and costs less.
export class OceanSystem {
  constructor(scene) {
    this.scene = scene;

    const size = WORLD.size * 4;
    const flatGeo = new THREE.PlaneGeometry(size, size, 1, 1);
    flatGeo.rotateX(-Math.PI / 2);

    // The sea takes the sky colour. Fog then blends it into the horizon, so
    // sea and sky meet without a seam.
    this.material = new THREE.MeshLambertMaterial({
      color: 0x94C5CC,
      transparent: true,
      opacity: 0.92,
      depthWrite: false
    });
    this.surface = new THREE.Mesh(flatGeo.clone(), this.material);
    this.surface.position.y = WORLD.seaLevel;
    this.surface.renderOrder = 1;
    scene.add(this.surface);

    // Deep water beneath, so shallows read as translucent rather than flat.
    this.deep = new THREE.Mesh(
      flatGeo.clone(),
      new THREE.MeshLambertMaterial({ color: 0x7E8C97 })
    );
    this.deep.position.y = WORLD.seaLevel - 5;
    scene.add(this.deep);

    // The sun path: a bright streak pointing at the sun. This one element is
    // most of what makes flat water read as reflective.
    this.glitter = new THREE.Mesh(
      flatGeo.clone(),
      new THREE.MeshBasicMaterial({
        color: 0xF7EABD,
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false
      })
    );
    this.glitter.position.y = WORLD.seaLevel + 0.04;
    this.glitter.renderOrder = 2;
    scene.add(this.glitter);

    // Surf that breathes against the shore.
    this.foam = new THREE.Mesh(
      flatGeo.clone(),
      new THREE.MeshBasicMaterial({
        color: 0xF7EABD,
        transparent: true,
        opacity: 0.05,
        depthWrite: false,
        fog: false
      })
    );
    this.foam.position.y = WORLD.seaLevel + 0.08;
    this.foam.renderOrder = 3;
    scene.add(this.foam);

    flatGeo.dispose();

    this.elapsed = 0;
  }

  // Orients the sun path so it stays correct across the whole day.
  setSunDirection(x, y, z) {
    const len = Math.hypot(x, z) || 1;
    this.glitter.rotation.y = Math.atan2(x / len, z / len);
  }

  // Water colour follows the hour so sea and sky always agree.
  setHorizonColor(hex) {
    this.material.color.setHex(hex);
  }

  update(deltaSeconds, camera) {
    this.elapsed += deltaSeconds;

    // Slow, shallow breathing on the surf and the glitter.
    const pulse = (Math.sin(this.elapsed * 0.4) + 1) / 2;
    this.foam.material.opacity = 0.03 + pulse * 0.045;
    this.glitter.material.opacity = 0.05 + pulse * 0.05;

    if (camera) {
      for (const mesh of [this.surface, this.deep, this.glitter, this.foam]) {
        mesh.position.x = camera.position.x;
        mesh.position.z = camera.position.z;
      }
    }
  }

  // Waves push the player back if they try to walk out too far.
  surgeStrength(playerX, playerZ, seaLevel, heightAt) {
    const edge = WORLD.size / 2 - 12;
    const overEdge = Math.max(Math.abs(playerX), Math.abs(playerZ)) - edge;
    if (overEdge <= 0) return 0;

    const h = heightAt(Math.floor(playerX), Math.floor(playerZ));
    const deepness = seaLevel - h;
    if (deepness <= WORLD.beachTolerance) return 0;
    return Math.min(1, (overEdge + deepness - WORLD.beachTolerance) / 6);
  }

  dispose() {
    this.scene.remove(this.surface, this.deep, this.glitter, this.foam);
    for (const mesh of [this.surface, this.deep, this.glitter, this.foam]) {
      mesh.geometry.dispose();
    }
    this.material.dispose();
    this.deep.material.dispose();
    this.glitter.material.dispose();
    this.foam.material.dispose();
  }
}