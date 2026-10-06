/**
 * Procedural car and track meshes. No GLB loaders, no external assets: every
 * shape is built from primitives at runtime, which keeps the bundle tiny and the
 * load instant.
 */

import * as THREE from 'three';
import {
  BOX_PROGRESS,
  PIT_LANE_WIDTH,
  PIT_SIDE,
  PIT_WINDOW_END,
  PIT_WINDOW_START,
  laneProgress
} from '../race/pit.js';
import {
  asphaltTexture,
  concreteTexture,
  crowdTexture,
  grassTexture,
  runOffTexture,
  tyreTexture,
  toTexture
} from './textures.js';

const CAR_LENGTH = 4.9;
const CAR_WIDTH = 2.0;
const WHEEL_RADIUS = 0.36;
const WHEEL_WIDTH = 0.4;

/** Kerb width and height in metres. */
const KERB_WIDTH = 0.9;
const KERB_HEIGHT = 0.035;
/** The two alternating kerb colours, written into the vertex colour attribute. */
const KERB_RED = new THREE.Color(0xe10600);
const KERB_WHITE = new THREE.Color(0xf5f5f5);

/**
 * A modern open-wheel F1 car: nose cone, monocoque, sidepods, airbox, halo,
 * front and rear wings, and four exposed wheels.
 */
export function buildCarMesh(colour = 0xe10600, accent = 0xffd400) {
  const group = new THREE.Group();

  /*
   * Bodywork is glossy painted metal, not matte plastic: roughness 0.28 with a
   * little metalness, so it takes a highlight from the sky and reads as paint.
   * `scene.environment` supplies that reflection -- without it, metalness has
   * nothing to reflect and the car renders close to black.
   */
  const body = new THREE.MeshStandardMaterial({ color: colour, roughness: 0.28, metalness: 0.22 });
  // Was 0x14161c, which is nearly black, and covered most of the car. It now
  // reads as dark trim rather than swallowing the livery.
  const dark = new THREE.MeshStandardMaterial({ color: 0x2a2e38, roughness: 0.6, metalness: 0.2 });
  const accentMat = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.38, metalness: 0.18 });
  const carbon = new THREE.MeshStandardMaterial({ color: 0x2c303a, roughness: 0.45, metalness: 0.35 });
  const glass = new THREE.MeshStandardMaterial({
    color: 0x0b0d12,
    roughness: 0.12,
    metalness: 0.1,
    transparent: true,
    opacity: 0.72
  });

  // Monocoque: a tapered box, narrow at the nose and wide at the sidepods.
  const tubLength = 2.6;
  const tub = new THREE.Mesh(new THREE.BoxGeometry(CAR_WIDTH * 0.52, 0.46, tubLength), body);
  tub.position.set(0, 0.34, -0.1);
  group.add(tub);

  // Nose cone, lower and narrower than the tub.
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.26, 1.5), body);
  nose.position.set(0, 0.28, tubLength * 0.5 + 0.62);
  group.add(nose);

  // Front wing: a wide, low multi-element plank.
  const frontWing = new THREE.Mesh(new THREE.BoxGeometry(CAR_WIDTH * 1.05, 0.06, 0.5), accentMat);
  frontWing.position.set(0, 0.11, tubLength * 0.5 + 1.5);
  group.add(frontWing);
  const frontWingUpper = new THREE.Mesh(new THREE.BoxGeometry(CAR_WIDTH * 0.92, 0.05, 0.34), body);
  frontWingUpper.position.set(0, 0.2, frontWing.position.z - 0.06);
  group.add(frontWingUpper);
  for (const side of [-1, 1]) {
    const endplate = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.26, 0.52), carbon);
    endplate.position.set(side * CAR_WIDTH * 0.53, 0.2, frontWing.position.z);
    group.add(endplate);
  }

  // Sidepods with an undercut, which is what gives an F1 car its silhouette.
  for (const side of [-1, 1]) {
    const pod = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.42, 1.7), body);
    pod.position.set(side * 0.52, 0.34, -0.35);
    group.add(pod);
    const inlet = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.5), dark);
    inlet.position.set(side * 0.75, 0.36, 0.42);
    group.add(inlet);
  }

  // Floor: the flat plate between the wheels, plus the diffuser ramp behind.
  const floor = new THREE.Mesh(new THREE.BoxGeometry(CAR_WIDTH * 0.98, 0.06, 3.0), carbon);
  floor.position.set(0, 0.14, -0.2);
  group.add(floor);
  const diffuser = new THREE.Mesh(new THREE.BoxGeometry(CAR_WIDTH * 0.9, 0.22, 0.6), carbon);
  diffuser.position.set(0, 0.24, -1.72);
  diffuser.rotation.x = -0.34;
  group.add(diffuser);

  // Airbox behind the driver's head.
  const airbox = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.4, 0.6), body);
  airbox.position.set(0, 0.72, -0.62);
  group.add(airbox);

  // Halo: a central pillar and a hoop over the cockpit.
  const haloHoop = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.045, 8, 20, Math.PI), carbon);
  haloHoop.position.set(0, 0.62, 0.16);
  haloHoop.rotation.set(0, 0, 0);
  group.add(haloHoop);
  const haloPillar = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.34, 0.09), carbon);
  haloPillar.position.set(0, 0.56, 0.56);
  group.add(haloPillar);

  // Cockpit opening and driver helmet.
  const cockpit = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.14, 0.8), dark);
  cockpit.position.set(0, 0.55, 0.32);
  group.add(cockpit);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), accentMat);
  helmet.position.set(0, 0.7, 0.3);
  group.add(helmet);

  // Rear wing: main plane plus a flap on an endplate pair.
  const rearWing = new THREE.Mesh(new THREE.BoxGeometry(CAR_WIDTH * 0.9, 0.06, 0.44), accentMat);
  rearWing.position.set(0, 0.9, -1.95);
  group.add(rearWing);
  const rearFlap = new THREE.Mesh(new THREE.BoxGeometry(CAR_WIDTH * 0.86, 0.05, 0.3), body);
  rearFlap.position.set(0, 1.06, -2.02);
  rearFlap.rotation.x = 0.3;
  group.add(rearFlap);
  for (const side of [-1, 1]) {
    const endplate = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.7), body);
    endplate.position.set(side * CAR_WIDTH * 0.45, 0.95, -1.98);
    group.add(endplate);
  }

  // Rear light.
  const light = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.05), new THREE.MeshBasicMaterial({ color: 0xff2222 }));
  light.position.set(0, 0.62, -1.95);
  group.add(light);

  // Four wheels: fronts steer, all four spin.
  const wheelGeometry = new THREE.CylinderGeometry(WHEEL_RADIUS, WHEEL_RADIUS, WHEEL_WIDTH, 18);
  wheelGeometry.rotateZ(Math.PI / 2);
  const rimGeometry = new THREE.CylinderGeometry(WHEEL_RADIUS * 0.55, WHEEL_RADIUS * 0.55, WHEEL_WIDTH + 0.02, 12);
  rimGeometry.rotateZ(Math.PI / 2);
  const tyre = new THREE.MeshStandardMaterial({
    map: toTexture(tyreTexture(), { repeat: [1, 1] }),
    color: 0xffffff,
    roughness: 0.85,
    metalness: 0.05
  });
  const rim = new THREE.MeshStandardMaterial({ color: 0xb8bcc4, roughness: 0.3, metalness: 0.8 });

  const wheels = { frontLeft: null, frontRight: null, rearLeft: null, rearRight: null };
  const positions = [
    ['frontLeft', -0.78, 1.42, true],
    ['frontRight', 0.78, 1.42, true],
    ['rearLeft', -0.82, -1.5, false],
    ['rearRight', 0.82, -1.5, false]
  ];
  for (const [key, x, z, isFront] of positions) {
    const pivot = new THREE.Group();
    pivot.position.set(x, WHEEL_RADIUS, z);
    const spin = new THREE.Mesh(wheelGeometry, tyre);
    const hub = new THREE.Mesh(rimGeometry, rim);
    pivot.add(spin, hub);
    group.add(pivot);
    // Front pivots carry the steering angle; every pivot carries wheel spin.
    wheels[key] = { pivot, spin, isFront };
  }

  group.userData.wheels = wheels;
  group.userData.bodyMaterial = body;
  group.userData.lightMaterial = light.material;
  return group;
}

/**
 * Apply a physics state to a car mesh: position, heading, steering and wheel
 * rotation. Front wheel pivots yaw, every wheel spins at the road speed.
 */
export function syncCarMesh(mesh, physics, steerInput = 0) {
  // On the road surface, not on the plane it was drawn on when the world was flat.
  mesh.position.set(physics.x, physics.y ?? 0, physics.z);
  mesh.rotation.x = physics.pitch ?? 0;
  /*
   * The 90-degree offset is the whole fix, and it is not obvious.
   *
   * Two conventions meet here. Physics (`CarPhysics.step`) advances the car by
   * `vLong * (cos h, sin h)`, and the track's headings come from
   * `atan2(dz, dx)`, so in world (x, z) the direction of travel at heading `h` is
   * `(cos h, sin h)`.
   *
   * The mesh is modelled nose-forward along local +Z (the front wing sits at
   * z = +2.8). A Three.js object rotated by `rotation.y = t` maps local +Z to
   * `(sin t, cos t)`. Setting `t = -h` gives `(-sin h, cos h)`, whose dot product
   * with the direction of travel is zero at every heading: the car is drawn
   * exactly 90 degrees off, broadside, sliding sideways down the road at full
   * throttle while the telemetry reports a perfectly sensible speed.
   *
   * Solving `sin t = cos h` and `cos t = sin h` gives `t = PI/2 - h`.
   *
   * Worth noting the failure mode: the physics, the AI, the timing and the speed
   * readout are all correct, so nothing looks broken except the one thing being
   * looked at. Every numerical check passes.
   */
  mesh.rotation.y = Math.PI / 2 - physics.heading;

  const wheels = mesh.userData.wheels;
  if (!wheels) return;
  const steerAngle = -physics.steerAngle;
  // Wheel spin from distance travelled, so it stays consistent with the body.
  const spinAngle = (physics.odometer ?? 0) / WHEEL_RADIUS;
  for (const key of Object.keys(wheels)) {
    const wheel = wheels[key];
    wheel.spin.rotation.x = spinAngle;
    if (wheel.isFront) wheel.pivot.rotation.y = steerAngle;
  }
}

/**
 * The track surface: asphalt ribbon, red-and-white kerbs on the corner apexes,
 * a start/finish line and painted lane markings, all built from extruded strips
 * along the centreline.
 */
export function buildTrackMesh(track) {
  const group = new THREE.Group();
  const samples = track.samples;
  const count = samples.length;

  /*
   * Textured, not flat-coloured. The road is the largest surface on screen and
   * was a single unlit-looking dark grey; the grass a single flat green. Neither
   * reads as a surface without texture, and no lighting rig fixes that.
   *
   * Repeat counts are chosen so one texture tile covers roughly 4m of road and
   * about 12m of grass. Any finer and the mottle turns into noise at speed;
   * any coarser and it visibly tiles.
   */
const roadMaterial = new THREE.MeshStandardMaterial({
    map: toTexture(asphaltTexture(), { repeat: [1, 1] }),
    color: 0xffffff,
    roughness: 0.94,
    metalness: 0.02
  });
  const kerbMaterial = new THREE.MeshStandardMaterial({
    // Vertex-coloured: one draw call for every kerb on the circuit.
    vertexColors: true,
    roughness: 0.7
  });
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xf0f0f0 });
  const runOffMaterial = new THREE.MeshStandardMaterial({
    // Grass, not gravel: the apron is a 26m verge joining the track to the
    // surrounding terrain, and a gravel band all the way round reads as a bug.
    map: toTexture(grassTexture(), { repeat: [2, 1] }),
    color: 0xffffff,
    roughness: 1
  });
  const wallMaterial = new THREE.MeshStandardMaterial({
    map: toTexture(concreteTexture(), { repeat: [16, 1] }),
    color: 0xffffff,
    roughness: 0.85
  });

  // --- Asphalt ribbon --------------------------------------------------------
  const roadPositions = [];
  const roadIndices = [];
  const roadUvs = [];
  for (let i = 0; i <= count; i += 1) {
    const s = samples[i % count];
    const half = s.width * 0.5;
    const leftX = s.x + s.rightX * half;
    const leftZ = s.z + s.rightZ * half;
    const rightX = s.x - s.rightX * half;
    const rightZ = s.z - s.rightZ * half;
    roadPositions.push(leftX, s.y + 0.02, leftZ, rightX, s.y + 0.02, rightZ);
    const v = (i / count) * track.length * 0.08;
    roadUvs.push(0, v, 1, v);
    if (i < count) {
      const a = i * 2;
      roadIndices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const roadGeometry = new THREE.BufferGeometry();
  roadGeometry.setAttribute('position', new THREE.Float32BufferAttribute(roadPositions, 3));
  roadGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(roadUvs, 2));
  roadGeometry.setIndex(roadIndices);
  roadGeometry.computeVertexNormals();
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.receiveShadow = true;
  group.add(road);

  /*
   * The pit lane.
   *
   * `race/pit.js` puts the lane beyond the road edge on the pit side, through a window either
   * side of the start line, with the FIA speed limit applying and a box partway along. Without
   * geometry here a car taking a stop drives onto nothing -- off the end of the run-off into
   * empty space -- which makes the whole mechanic look broken even though it works.
   *
   * Three pieces, all instanced or single-buffer so the draw-call cost is fixed:
   *   - the lane surface, a strip beside the main straight
   *   - a pit wall between the lane and the circuit, with a gap where cars cross
   *   - the garage frontage and the boxes along the far side
   */
  const pitStripPositions = [];
  const pitStripIndices = [];
  const pitStripUvs = [];
  const pitWallPositions = [];
  const pitWallIndices = [];
  const PIT_LANE_RENDER_WIDTH = PIT_LANE_WIDTH;
  const boxes = [];
  let previousIndex = -1;

  for (let i = 0; i <= count; i += 1) {
    const s = samples[i % count];
    const fraction = s.s / track.length;
    // The window wraps the line, so walk it as a contiguous run from just before the line.
    const inWindow = fraction >= PIT_WINDOW_START || fraction <= PIT_WINDOW_END;
    if (!inWindow) {
      if (previousIndex >= 0) previousIndex = -1;
      continue;
    }

    const edge = PIT_SIDE * (s.width * 0.5);
    const outer = edge + PIT_SIDE * PIT_LANE_RENDER_WIDTH;

    // Lane surface.
    pitStripPositions.push(
      s.x + s.rightX * edge, s.y + 0.03, s.z + s.rightZ * edge,
      s.x + s.rightX * outer, s.y + 0.03, s.z + s.rightZ * outer
    );
    const v = (i / count) * track.length * 0.1;
    pitStripUvs.push(0, v, 1, v);

    // Pit wall, 1.2m high, with a gap at the box so cars can reach the far side.
    const atBox = Math.abs(laneProgress(fraction) - BOX_PROGRESS) < 0.06;
    if (!atBox) {
      pitWallPositions.push(
        s.x + s.rightX * edge, s.y, s.z + s.rightZ * edge,
        s.x + s.rightX * edge, s.y + 1.2, s.z + s.rightZ * edge
      );
    }

    // Garages and boxes along the far side, instanced.
    // One garage per team frontage: real complexes have a building per entry, not a wall of them.
    if (i % 10 === 0) {
      boxes.push({
        x: s.x + s.rightX * (outer - PIT_SIDE * 3.5),
        y: s.y,
        z: s.z + s.rightZ * (outer - PIT_SIDE * 3.5),
        heading: s.heading
      });
    }

    previousIndex = i;
  }

  // Indices, now that the runs are known.
  for (let base = 0; base * 2 < pitStripPositions.length / 3; base += 1) {
    const a = base * 2;
    pitStripIndices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  for (let base = 0; base * 2 < pitWallPositions.length / 3; base += 1) {
    const a = base * 2;
    pitWallIndices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  void previousIndex;

  if (pitStripIndices.length) {
    const laneGeometry = new THREE.BufferGeometry();
    laneGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pitStripPositions, 3));
    laneGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(pitStripUvs, 2));
    laneGeometry.setIndex(pitStripIndices);
    laneGeometry.computeVertexNormals();
    const lane = new THREE.Mesh(laneGeometry, runOffMaterial);
    lane.receiveShadow = true;
    group.add(lane);
  }

  if (pitWallIndices.length) {
    const pitWallGeometry = new THREE.BufferGeometry();
    pitWallGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pitWallPositions, 3));
    pitWallGeometry.setIndex(pitWallIndices);
    pitWallGeometry.computeVertexNormals();
    group.add(new THREE.Mesh(pitWallGeometry, wallMaterial));
  }

  if (boxes.length) {
    // One garage block per few samples, instanced: a hundred separate meshes would be a
    // hundred draw calls for scenery.
    const garage = new THREE.InstancedMesh(
      new THREE.BoxGeometry(7, 4.2, 5),
      new THREE.MeshStandardMaterial({ color: 0xd8dce2, roughness: 0.85 }),
      boxes.length
    );
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);
    boxes.forEach((box, index) => {
      quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -box.heading);
      matrix.compose(new THREE.Vector3(box.x, box.y + 2.1, box.z), quaternion, scale);
      garage.setMatrixAt(index, matrix);
    });
    garage.castShadow = true;
    group.add(garage);
  }

  // --- Run-off apron and barrier walls ---------------------------------------
  const apronPositions = [];
  const apronIndices = [];
  const apronUvs = [];
  const APRON = 26;
  for (let i = 0; i <= count; i += 1) {
    const s = samples[i % count];
    const half = s.width * 0.5 + APRON;
    apronPositions.push(
      s.x + s.rightX * half, s.y + 0.01, s.z + s.rightZ * half,
      s.x - s.rightX * half, s.y + 0.01, s.z - s.rightZ * half
    );
    // UVs are mandatory once a material carries a map: without them every
    // vertex samples texel (0,0) and the surface renders as one flat colour --
    // which is exactly what it looked like before, so the texture does nothing.
    const v = (i / count) * track.length * 0.02;
    apronUvs.push(0, v, 1, v);
    if (i < count) {
      const a = i * 2;
      apronIndices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const apronGeometry = new THREE.BufferGeometry();
  apronGeometry.setAttribute('position', new THREE.Float32BufferAttribute(apronPositions, 3));
  apronGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(apronUvs, 2));
  apronGeometry.setIndex(apronIndices);
  apronGeometry.computeVertexNormals();
  const apron = new THREE.Mesh(apronGeometry, runOffMaterial);
  group.add(apron);

  for (const side of [1, -1]) {
    const wallPositions = [];
    const wallIndices = [];
    const wallUvs = [];
    for (let i = 0; i <= count; i += 1) {
      const s = samples[i % count];
      const half = s.width * 0.5 + APRON + 1.5;
      wallPositions.push(
        s.x + s.rightX * half, s.y, s.z + s.rightZ * half,
        s.x + s.rightX * half, s.y + 1.5, s.z + s.rightZ * half
      );
      // One tile every 6m along the barrier, so the panel joints read as a
      // regular structure rather than a smear.
      const u = (i / count) * track.length * 0.17;
      wallUvs.push(u, 0, u, 1);
      if (i < count) {
        const a = i * 2;
        wallIndices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    const wallGeometry = new THREE.BufferGeometry();
    wallGeometry.setAttribute('position', new THREE.Float32BufferAttribute(wallPositions, 3));
    wallGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(wallUvs, 2));
    wallGeometry.setIndex(wallIndices);
    wallGeometry.computeVertexNormals();
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    group.add(wall);
  }

  // --- Kerbs, only where there is a corner to clip ---------------------------
  const kerbSegments = [];
  let current = null;
  for (let i = 0; i < count; i += 1) {
    const s = samples[i];
    const tight = Math.abs(s.lineCurvature) > 0.007;
    if (tight && !current) current = { from: i, to: i };
    else if (tight) current.to = i;
    else if (current) {
      if (current.to - current.from > 4) kerbSegments.push(current);
      current = null;
    }
  }
  if (current && current.to - current.from > 4) kerbSegments.push(current);

  const positions = [];
  const colors = [];
  const indices = [];
  let base = 0;

  for (const segment of kerbSegments) {
    for (let i = segment.from; i <= segment.to; i += 1) {
      const s = samples[((i % count) + count) % count];
      const next = samples[(((i + 1) % count) + count) % count];
      // Kerb goes on the inside of the corner.
      const sign = s.lineCurvature > 0 ? 1 : -1;
      const nextSign = next.lineCurvature > 0 ? 1 : -1;
      const inner = s.width * 0.5 - KERB_WIDTH;
      const outer = s.width * 0.5 + KERB_WIDTH;
      const nextInner = next.width * 0.5 - KERB_WIDTH;
      const nextOuter = next.width * 0.5 + KERB_WIDTH;
      // Alternate red and white along the kerb.
      const tint = (i % 2 === 0 ? KERB_RED : KERB_WHITE).toArray();

      // Every kerb quad goes into one shared buffer, alternating colour by
      // vertex colour rather than by material.
      //
      // Building a mesh per strip looks simpler and is a trap twice over. It was
      // hundreds of draw calls for a few hundred quads, and the positions were
      // fed to `setFromPoints` as raw [x, y, z] arrays rather than {x, y, z}
      // objects -- so every kerb vertex came out NaN, and Three.js logged a
      // bounding-sphere error *per frame* for each of them. The console filled up
      // and the frame rate collapsed, which presented as the game hanging on the
      // loading screen.
      /*
       * Triples, not pairs.
       *
       * This was flat [x0, z0, x1, z1, ...] with a single KERB_HEIGHT for the whole
       * buffer, so a kerb could not follow the road it sits on. Now each vertex carries
       * its own height, sampled from the road surface at that point.
       */
      const quad = [
        s.x + s.rightX * inner * sign, s.y + KERB_HEIGHT, s.z + s.rightZ * inner * sign,
        s.x + s.rightX * outer * sign, s.y + KERB_HEIGHT, s.z + s.rightZ * outer * sign,
        next.x + next.rightX * nextOuter * nextSign, next.y + KERB_HEIGHT, next.z + next.rightZ * nextOuter * nextSign,
        next.x + next.rightX * nextInner * nextSign, next.y + KERB_HEIGHT, next.z + next.rightZ * nextInner * nextSign
      ];
      for (const component of quad) positions.push(component);
      for (const channel of tint) colors.push(channel);
      indices.push(base + 0, base + 2, base + 1, base + 1, base + 2, base + 3);
      base += 4;
    }
  }

  if (positions.length) {
    const kerbGeometry = new THREE.BufferGeometry();
    kerbGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    kerbGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 1));
    kerbGeometry.setIndex(indices);
    kerbGeometry.computeVertexNormals();
    const kerbs = new THREE.Mesh(kerbGeometry, kerbMaterial);
    kerbs.receiveShadow = true;
    group.add(kerbs);
  }

  // --- Start/finish line -----------------------------------------------------
  const line = new THREE.Mesh(
    new THREE.PlaneGeometry(track.width, 1.6),
    new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.6 })
  );
  const startSample = samples[0];
  line.rotation.x = -Math.PI / 2;
  line.rotation.z = -startSample.heading;
  line.position.set(startSample.x, 0.03, startSample.z);
  group.add(line);

  return group;
}

/**
 * Grandstands and floodlight pylons around the outside of the lap.
 *
 * Everything out here is identical and static, so it is drawn with
 * `InstancedMesh` rather than as a `Group` per stand and pylon. The naive
 * version was 190-odd separate meshes -- a grandstand is two boxes and a pylon is
 * eight -- which is 190 draw calls per frame for scenery that never moves and is
 * mostly behind the camera. Instancing collapses that to about eight.
 *
 * `frustumCulled` is disabled on the instanced meshes deliberately: one instance
 * mesh spans the whole lap, so Three.js would test it against a bounding sphere
 * covering the entire circuit and only cull it when the camera left the track
 * area entirely, which is never. Per-instance culling is not worth the complexity
 * for scenery.
 */
export function buildEnvironment(track, theme) {
  const group = new THREE.Group();
  const samples = track.samples;
  const count = samples.length;

  const standMaterial = new THREE.MeshStandardMaterial({
    map: toTexture(concreteTexture(), { repeat: [3, 2] }),
    color: 0xffffff,
    roughness: 0.9
  });
  // A stand full of spectators rather than a grey slab. This was the single
  // clearest "placeholder" read in the scene.
  const seatMaterial = new THREE.MeshStandardMaterial({
    map: toTexture(crowdTexture(), { repeat: [4, 1] }),
    color: 0xffffff,
    roughness: 0.95
  });
  const pylonMaterial = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.7, metalness: 0.3 });
  const bulbMaterial = new THREE.MeshBasicMaterial({ color: 0xfff6d0 });

  // Grandstands every so often around the lap, tilted towards the track.
  const standStride = Math.max(1, Math.floor(count / 18));
  const standPlacements = [];
  for (let i = 0; i < count; i += standStride) {
    const s = samples[i];
    const half = s.width * 0.5 + 30;
    for (const side of [1, -1]) {
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(s.x + s.rightX * half * side, 0, s.z + s.rightZ * half * side),
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          -s.heading + (side > 0 ? Math.PI / 2 : -Math.PI / 2)
        ),
        new THREE.Vector3(1, 1, 1)
      );
      standPlacements.push(matrix);
    }
  }
  addInstanced(group, new THREE.BoxGeometry(14, 6, 34), standMaterial, standPlacements, [
    [0, 3, 0]
  ]);
  addInstanced(group, new THREE.BoxGeometry(12, 3.4, 32), seatMaterial, standPlacements, [
    [0, 7.4, 0]
  ]);

  // Floodlight pylons at the widest points.
  const pylonStride = Math.max(1, Math.floor(count / 8));
  const pylonPlacements = [];
  const bulbPlacements = [];
  for (let i = 0; i < count; i += pylonStride) {
    const s = samples[i];
    const half = s.width * 0.5 + 40;
    for (const side of [1, -1]) {
      const position = new THREE.Vector3(s.x + s.rightX * half * side, 0, s.z + s.rightZ * half * side);
      const quaternion = new THREE.Quaternion();
      // Face the rig back at the track: the same effect as the previous
      // lookAt-then-nudge, but written without allocating a throwaway Object3D.
      const toTrack = new THREE.Vector3(s.x - position.x, 0, s.z - position.z).normalize();
      const yaw = Math.atan2(toTrack.x, toTrack.z);
      quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw + Math.PI);
      const matrix = new THREE.Matrix4().compose(position, quaternion, new THREE.Vector3(1, 1, 1));
      pylonPlacements.push(matrix);
      for (let lamp = -2; lamp <= 2; lamp += 1) {
        bulbPlacements.push(
          new THREE.Matrix4().compose(
            new THREE.Vector3(lamp * 1.3, 26, -0.7),
            new THREE.Quaternion(),
            new THREE.Vector3(1, 1, 1)
          )
        );
      }
    }
  }
  addInstanced(group, new THREE.CylinderGeometry(0.5, 0.7, 26, 8), pylonMaterial, pylonPlacements, [
    [0, 13, 0]
  ]);
  addInstanced(group, new THREE.BoxGeometry(7, 2.4, 1.2), pylonMaterial, pylonPlacements, [
    [0, 26, 0]
  ]);
  // Bulbs are lit from within, so they must not cast shadows or the rig shadows
  // its own lamps.
  addInstanced(
    group,
    new THREE.BoxGeometry(1.1, 0.9, 0.3),
    bulbMaterial,
    bulbPlacements,
    [],
    { castShadow: false }
  );

  // Start gantry over the line.
  const gantry = new THREE.Group();
  const legGeometry = new THREE.BoxGeometry(1.2, 9, 1.2);
  const beam = new THREE.Mesh(new THREE.BoxGeometry(track.width + 16, 1.6, 1.6), pylonMaterial);
  beam.position.y = 9;
  gantry.add(beam);
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(legGeometry, pylonMaterial);
    leg.position.set((side * (track.width + 14)) / 2, 4.5, 0);
    gantry.add(leg);
  }
  const banner = new THREE.Mesh(
    new THREE.BoxGeometry(track.width + 10, 3, 0.3),
    new THREE.MeshStandardMaterial({ color: theme.kerb ?? 0xe10600, roughness: 0.6 })
  );
  banner.position.y = 12.2;
  gantry.add(banner);
  const startSample = samples[0];
  gantry.position.set(startSample.x, 0, startSample.z);
  // Same 90-degree offset as `syncCarMesh`, and for the same reason: the track's
  // heading describes travel as `(cos h, sin h)` in world (x, z), while the beam
  // is modelled across local +X. With `-heading` the gantry was rotated to stand
  // *along* the track instead of spanning it.
  gantry.rotation.y = Math.PI / 2 - startSample.heading;
  group.add(gantry);

  /*
   * The ground.
   *
   * There was no ground. Everything past the 26m run-off was the lower half of the sky
   * gradient, so the world outside the barriers was a flat green field with no texture,
   * no horizon and no parallax -- which is why the circuits read as "literally grass"
   * and why the cockpit view looked like the car was floating in a void.
   *
   * A single large quad with the grass texture repeated often enough to survive the
   * magnification. The repeat is the whole trick: at `repeat: [2, 1]` a 256px texture
   * covers the entire circuit, so every texel spans tens of metres and the detail
   * averages out to flat paint. One tile per ~12m is coarse enough not to shimmer at
   * 300kph and fine enough to still read as grass.
   *
   * Kept deliberately featureless. Real terrain -- hills, trees, elevation -- would be
   * a large amount of work for a circuit that is meant to look flat and fast, and
   * anything tall near the track would occlude the barriers and the crowds, which are
   * the things that actually sell the venue.
   */
  const groundSpan = Math.max(1400, (track.circuit?.radius ?? 700) * 4);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(groundSpan, groundSpan, 1, 1),
    new THREE.MeshStandardMaterial({
      map: toTexture(grassTexture(), { repeat: [groundSpan / 12, groundSpan / 12] }),
      color: theme.grass ?? 0xffffff,
      roughness: 1,
      metalness: 0
    })
  );
  ground.rotation.x = -Math.PI / 2;
  // Just below the road surface, so the tarmac always sits on top of it and there is
  // never a z-fighting seam at the edge of the run-off.
  ground.position.y = -0.08;
  group.add(ground);

  return group;
}

/**
 * Add an instanced mesh, optionally offsetting each instance within its own
 * group's local space.
 *
 * @param {THREE.Object3D} parent
 * @param {THREE.BufferGeometry} geometry Shared by every instance.
 * @param {THREE.Material} material
 * @param {THREE.Matrix4[]} placements World transforms, one per instance.
 * @param {[number, number, number][]} [localOffsets] Per-copy offsets within the
 *   placement's local frame.
 * @param {{castShadow?: boolean}} [options]
 */
function addInstanced(parent, geometry, material, placements, localOffsets = [[0, 0, 0]], options = {}) {
  if (!placements.length) return null;
  const copies = placements.length * localOffsets.length;
  const mesh = new THREE.InstancedMesh(geometry, material, copies);
  const offsetMatrix = new THREE.Matrix4();
  let index = 0;
  for (const placement of placements) {
    for (const [x, y, z] of localOffsets) {
      offsetMatrix.makeTranslation(x, y, z);
      mesh.setMatrixAt(index, placement.clone().multiply(offsetMatrix));
      index += 1;
    }
  }
  mesh.instanceMatrix.needsUpdate = true;
  // One instance mesh spans the whole lap, so its bounding sphere would cover the
  // entire circuit and Three.js would only cull it when the camera left the track
  // area entirely -- never. Per-instance culling is not worth it for scenery.
  mesh.frustumCulled = false;
  mesh.castShadow = options.castShadow ?? true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}