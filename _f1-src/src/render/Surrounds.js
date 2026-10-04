/**
 * Trackside world.
 *
 * Everything outside the barriers. This is what makes a circuit a place rather than a
 * ribbon of tarmac: trees, buildings, gravel, hoardings, a treeline on the horizon and
 * a hint of land beyond it.
 *
 * ## Why this is separate from `TrackMesh`
 *
 * `buildTrackMesh` draws the *circuit* -- the road, the kerbs, the run-off, the
 * barriers, which are all consequences of the racing line. This builds the *place*,
 * which is a consequence of where the circuit happens to be. Splitting them means the
 * circuit can be rebuilt without re-deciding what country it is in.
 *
 * ## Instancing, and the budget
 *
 * A treeline at plausible density is tens of thousands of trees. As individual meshes
 * that is tens of thousands of draw calls and the frame rate dies. As `InstancedMesh`
 * it is one, and the whole of this file costs about eight.
 *
 * That budget is why placement is *sampled* rather than exhaustive: trees are placed at
 * intervals along the track and pushed outward by a randomised distance, not scattered
 * over a bounding box and rejected. It also means density is a per-circuit number from
 * `environments.js` rather than a constant -- a desert circuit gets almost none, and
 * getting that wrong is more obvious than getting the geometry wrong.
 */

import * as THREE from 'three';
import { environmentFor, isStreet } from '../track/environments.js';
import { grassTexture } from './textures.js';

/**
 * Wrap a canvas texture for tiling use.
 *
 * Duplicated from `TrackMesh` rather than imported because that one is not exported,
 * and a two-line helper is a smaller cost than a refactor of a 600-line file mid-change.
 */
function toTexture(canvas, { repeat = [1, 1] } = {}) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Deterministic, so a circuit looks the same every time it is loaded. */
function rng(seed) {
  let state = seed >>> 0 || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0xffffffff;
  };
}

function hash(text) {
  let value = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

/**
 * One `InstancedMesh` from a list of transforms.
 *
 * Not reused from `TrackMesh` because that helper applies several *different* geometries
 * to a single placement list (stand body, seats, pylon head) and so needs one mesh per
 * geometry. Here every placement list belongs to exactly one geometry, which makes a
 * single mesh both correct and cheaper.
 */
function addInstances(parent, geometry, material, placements) {
  if (!placements.length) return null;
  const mesh = new THREE.InstancedMesh(geometry, material, placements.length);
  for (const [index, matrix] of placements.entries()) mesh.setMatrixAt(index, matrix);
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  parent.add(mesh);
  return mesh;
}

/** Compose a transform from a position, a yaw and a uniform-ish scale. */
function place(x, y, z, yaw, scale = 1, scaleY = scale) {
  return new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw),
    new THREE.Vector3(scale, scaleY, scale)
  );
}

/**
 * Build everything outside the barriers.
 *
 * @param {object} track the built track
 * @param {object} theme the circuit's colour theme
 * @param {string} circuitId for the deterministic seed and the profile lookup
 * @returns {THREE.Group}
 */
export function buildSurrounds(track, theme, circuitId) {
  const group = new THREE.Group();
  const profile = environmentFor(circuitId);
  const random = rng(hash(circuitId));
  const samples = track.samples;
  const count = samples.length;
  const street = isStreet(profile.setting);

  /*
   * Run-off.
   *
   * A street circuit has effectively none -- the barrier is at the edge of the road.
   * Everywhere else it is generous. This is the difference between Monaco, which you
   * drive with your mirrors in your ears, and Silverstone, which has room to put a car
   * off and recover, and it comes from the profile rather than a constant.
   */
  const runOff = street ? 2.5 : 14;

  // ---------------------------------------------------------------- run-off --
  const runOffPlacements = [];
  for (let i = 0; i < count; i += 1) {
    const s = samples[i];
    for (const side of [1, -1]) {
      const offset = s.width * 0.5 + runOff * 0.5;
      runOffPlacements.push(
        place(s.x + s.rightX * offset * side, s.y + 0.01, s.z + s.rightZ * offset * side, -s.heading)
      );
    }
  }
  /*
   * Textured, and tinted rather than replaced.
   *
   * This was a flat untextured band of bright green with a hard edge where it met the
   * surrounding ground, which read as a painted lane rather than as grass -- and the
   * eye went straight to it, because a hard-edged bright stripe either side of the road
   * is the single most unnatural thing a circuit can look like.
   *
   * Reusing the ground's own grass texture at a finer repeat is what makes it read as
   * the same field, mown differently, which is what a run-off is. The tint is then a
   * small shift toward the circuit's dust rather than a different colour entirely.
   */
  const runOffMaterial = new THREE.MeshStandardMaterial({
    map: toTexture(grassTexture(), { repeat: [1, Math.max(2, track.length / 30)] }),
    color: new THREE.Color(profile.groundTint).lerp(new THREE.Color(profile.dust > 0.35 ? 0xbfae8c : 0x8a9a66), 0.45),
    roughness: 1,
    metalness: 0
  });
  // Thin, and sitting a hair above the ground plane rather than proud of it, so there
  // is no lit top edge to give the band away.
  addInstances(group, new THREE.BoxGeometry(runOff, 0.012, track.step * 1.15), runOffMaterial, runOffPlacements);

  // -------------------------------------------------------------- barriers --
  /*
   * Concrete walls for street circuits, armco elsewhere.
   *
   * Street circuits genuinely have solid walls; so does Suzuka's esses and a handful of
   * permanent venues, but drawing a wall round everything flattens the difference
   * between Monaco and Monza more than any amount of scenery can put back.
   */
  const barrierPlacements = [];
  const wallPlacements = [];
  const barrierOffset = s => s.width * 0.5 + runOff + (street ? 1.5 : 4.5);
  for (let i = 0; i < count; i += 1) {
    const s = samples[i];
    for (const side of [1, -1]) {
      const offset = barrierOffset(s);
      const yaw = -s.heading + (side > 0 ? Math.PI / 2 : -Math.PI / 2);
      barrierPlacements.push(place(s.x + s.rightX * offset * side, s.y + 0.65, s.z + s.rightZ * offset * side, yaw));
    }
  }
  if (street) {
    // Push the wall out and put it taller and taller as it leaves the road, which is
    // what makes a street circuit feel enclosed rather than merely narrow.
    wallPlacements.push(...barrierPlacements);
    addInstances(
      group,
      new THREE.BoxGeometry(0.9, 4.2, track.step * 1.2),
      new THREE.MeshStandardMaterial({ color: 0x9aa0a8, roughness: 0.92 }),
      wallPlacements
    );
  } else {
    addInstances(
      group,
      new THREE.BoxGeometry(0.35, 1.3, track.step * 1.2),
      new THREE.MeshStandardMaterial({ color: 0xb8bec6, roughness: 0.6, metalness: 0.4 }),
      barrierPlacements
    );
  }

  // ------------------------------------------------------------- buildings --
  /*
   * Street circuits are buildings. This is the difference between Monaco and Sepang:
   * a wall of facades pressed against the barrier, with windows, that you can almost
   * touch at the apex of a hairpin.
   */
  if (profile.buildingDensity > 0.3) {
    const buildingPlacements = [];
    const windowPlacements = [];
    const stride = Math.max(1, Math.floor(count / (140 * profile.buildingDensity)));
    for (let i = 0; i < count; i += stride) {
      const s = samples[i];
      for (const side of [1, -1]) {
        const distance = barrierOffset(s) + 9 + random() * 26;
        const height = 8 + random() * (street ? 26 : 14);
        const yaw = -s.heading + (side > 0 ? Math.PI / 2 : -Math.PI / 2);
        buildingPlacements.push(
          place(s.x + s.rightX * distance * side, s.y + height * 0.5, s.z + s.rightZ * distance * side, yaw)
        );
        // A band of windows, so the facade is not a blank slab.
        windowPlacements.push(
          place(s.x + s.rightX * (distance - 0.6) * side, s.y + height * 0.55, s.z + s.rightZ * (distance - 0.6) * side, yaw)
        );
      }
    }
    addInstances(
      group,
      new THREE.BoxGeometry(9, 1, 12),
      new THREE.MeshStandardMaterial({ color: 0xb9b2a4, roughness: 0.95 }),
      buildingPlacements.map((matrix) => {
        const scale = new THREE.Vector3().setFromMatrixScale(matrix);
        return matrix.clone().multiply(new THREE.Matrix4().makeScale(1, 1, 1));
      })
    );
    // Buildings need varied heights, which a single instanced mesh cannot do, so they
    // are scaled into the matrix rather than rebuilt as separate meshes.
    const buildingMesh = group.children[group.children.length - 1];
    for (const [index, matrix] of buildingPlacements.entries()) {
      const position = new THREE.Vector3();
      const quaternion = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      matrix.decompose(position, quaternion, scale);
      const height = 8 + random() * (street ? 26 : 14);
      buildingMesh.setMatrixAt(
        index,
        new THREE.Matrix4().compose(position, quaternion, new THREE.Vector3(1 + random() * 0.6, height, 1))
      );
    }
    buildingMesh.instanceMatrix.needsUpdate = true;
    addInstances(
      group,
      new THREE.BoxGeometry(9.3, 1, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x2b3340, roughness: 0.4, metalness: 0.3 }),
      windowPlacements
    );
  }

  // ----------------------------------------------------------------- trees --
  const treePlacements = [];
  const trunkPlacements = [];
  if (profile.treeDensity > 0.05) {
    const stride = Math.max(1, Math.floor(count / Math.round(420 * profile.treeDensity)));
    for (let i = 0; i < count; i += stride) {
      const s = samples[i];
      for (const side of [1, -1]) {
        const distance = barrierOffset(s) + 6 + random() * 70;
        const scale = 0.8 + random() * 1.5;
        treePlacements.push(
          place(s.x + s.rightX * distance * side, s.y, s.z + s.rightZ * distance * side, random() * 6.28, scale, scale)
        );
        trunkPlacements.push(
          place(s.x + s.rightX * distance * side, s.y, s.z + s.rightZ * distance * side, 0, scale)
        );
      }
    }
    const foliage = new THREE.MeshStandardMaterial({
      // A darker, cooler green than the ground, so a treeline reads as depth rather
      // than as a stain on the grass.
      color: street ? 0x2f5533 : 0x33612f,
      roughness: 0.95
    });
    addInstances(group, new THREE.CylinderGeometry(0.28, 0.42, 5, 6), new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 1 }), trunkPlacements);
    addInstances(group, new THREE.ConeGeometry(2.4, 8.5, 7), foliage, treePlacements.map((m) => {
      const position = new THREE.Vector3();
      const quaternion = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      m.decompose(position, quaternion, scale);
      return new THREE.Matrix4().compose(
        new THREE.Vector3(position.x, 6.6 * scale.y, position.z),
        quaternion,
        scale
      );
    }));
  }

  // ------------------------------------------------------------- treeline --
  /*
   * A ring of trees well beyond the circuit.
   *
   * This is doing more work than its cost suggests. Without a horizon reference the
   * world simply *stops* at the edge of the ground plane and the circuit reads as a
   * diorama on a table; with one it has a middle distance and the eye has somewhere to
   * put the far side of the lap. It is the cheapest available depth cue.
   */
  /*
   * Centred on the circuit's actual middle, not on its first sample.
   *
   * It used to be centred on `samples[0]` -- the start/finish line -- which makes the
   * clearance between the ring and the track depend on where the lap happens to begin.
   * At Monaco that left the treeline barely 50m beyond the furthest corner, with 20m-tall
   * cones on it, which is exactly how you get trees standing in the road.
   */
  let centreX = 0;
  let centreZ = 0;
  let groundLevel = 0;
  for (const sample of samples) {
    centreX += sample.x;
    centreZ += sample.z;
    groundLevel += sample.y ?? 0;
  }
  centreX /= count;
  centreZ /= count;
  groundLevel /= count;

  // The ring must clear the furthest *point* of the circuit by a wide margin, since the
  // trees are up to 20m tall and 21m across.
  let extent = 0;
  for (const sample of samples) {
    const distance = Math.hypot(sample.x - centreX, sample.z - centreZ);
    if (distance > extent) extent = distance;
  }
  const rimRadius = Math.max(700, extent + 260);

  const rimPlacements = [];
  for (let i = 0; i < 900; i += 1) {
    const angle = random() * Math.PI * 2;
    // Banded so the treeline reads as a ring rather than a disc of trees round the car.
    // The band only ever goes *outward* from `rimRadius`, so it can never creep inside
    // the clearance computed above.
    const radius = rimRadius * (1 + random() * 0.3);
    rimPlacements.push(
      place(
        Math.cos(angle) * radius + centreX,
        // The rim is a ring, not a follow-the-road ribbon: it is placed against the
        // circuit's own ground level, so a circuit at 190m does not appear to float
        // above a forest growing out of the plane.
        groundLevel,
        Math.sin(angle) * radius + centreZ,
        random() * 6.28,
        1.4 + random() * 1.6,
        1.4 + random() * 1.6
      )
    );
  }
  addInstances(
    group,
    new THREE.ConeGeometry(7, 22, 6),
    // Heavily fog-tinted, so the far treeline sits behind the atmosphere rather than
    // competing with the circuit in the middle distance.
    new THREE.MeshStandardMaterial({ color: street ? 0x51705a : 0x4d6b45, roughness: 1 }),
    rimPlacements
  );

  // ------------------------------------------------------------- hoardings --
  /*
   * Trackside advertising boards.
   *
   * Not branded -- nobody's marks are in here. The point is the *rhythm* of coloured
   * rectangles along the barrier, which is one of the strongest visual cues that a
   * circuit is a real venue rather than a private test track.
   */
  const boardPlacements = [];
  const boardStride = Math.max(1, Math.floor(count / 90));
  const boardColours = [0xd0342c, 0x1f5fb4, 0xe8b21f, 0xf2f2f2, 0x1d1d1d, 0x2e8b57];
  for (let i = 0; i < count; i += boardStride) {
    const s = samples[i];
    for (const side of [1, -1]) {
      if (random() < 0.35) continue;
      const offset = barrierOffset(s) + 0.9;
      boardPlacements.push(
        place(s.x + s.rightX * offset * side, s.y + 1.5, s.z + s.rightZ * offset * side, -s.heading + Math.PI / 2)
      );
    }
  }
  if (boardPlacements.length) {
    const meshes = [];
    const perColour = new Map();
    for (const matrix of boardPlacements) {
      const colour = boardColours[Math.floor(random() * boardColours.length)];
      if (!perColour.has(colour)) perColour.set(colour, []);
      perColour.get(colour).push(matrix);
    }
    for (const [colour, matrices] of perColour) {
      meshes.push(
        addInstances(
          group,
          new THREE.BoxGeometry(0.2, 1.1, track.step * 3),
          new THREE.MeshStandardMaterial({ color: colour, roughness: 0.8 }),
          matrices
        )
      );
    }
  }

  return group;
}