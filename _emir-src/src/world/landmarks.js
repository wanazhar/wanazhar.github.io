import * as THREE from 'three';

const STEEL = new THREE.MeshStandardMaterial({ color: 0xcdd4da, roughness: 0.32, metalness: 0.78 });
const STEEL_DARK = new THREE.MeshStandardMaterial({ color: 0x6f7880, roughness: 0.44, metalness: 0.6 });
const GLASS = new THREE.MeshPhysicalMaterial({ color: 0x9fd2ef, roughness: 0.12, metalness: 0.3, transparent: true, opacity: 0.74, clearcoat: 0.7 });
const GLASS_DARK = new THREE.MeshStandardMaterial({ color: 0x2b4a60, roughness: 0.3, metalness: 0.4 });
const TRIM = new THREE.MeshStandardMaterial({ color: 0xeef4f8, roughness: 0.28, metalness: 0.5 });
const RED = new THREE.MeshStandardMaterial({ color: 0xc8452f, roughness: 0.7, metalness: 0.08 });
const BRICK = new THREE.MeshStandardMaterial({ color: 0xa9543a, roughness: 0.85, metalness: 0.02 });
const CREAM = new THREE.MeshStandardMaterial({ color: 0xf0e6d2, roughness: 0.8, metalness: 0.03 });
const COPPER = new THREE.MeshStandardMaterial({ color: 0x2f7d64, roughness: 0.55, metalness: 0.25 });
const WHITE = new THREE.MeshStandardMaterial({ color: 0xf7f4ec, roughness: 0.7, metalness: 0.05 });

function box(width, height, depth, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function collider(list, x, y, z, hx, hy, hz, kind) {
  list.push({ x, y, z, hx, hy, hz, kind });
}

function ring(radius, tube, material, y, segments = 20) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 6, segments), material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = y;
  return mesh;
}

function buildTwinTowers(layout, landmark) {
  const group = new THREE.Group();
  const { x, z, ground } = landmark;
  const gap = 40;
  const shaft = 118;
  const segments = [
    { top: 26, radius: 6.0 },
    { top: 56, radius: 5.4 },
    { top: 84, radius: 4.7 },
    { top: 104, radius: 4.0 },
    { top: shaft, radius: 3.2 }
  ];

  for (const side of [-1, 1]) {
    const cx = x + side * (gap / 2);
    let y = ground;
    for (const segment of segments) {
      const height = segment.top - y;
      const shaftMesh = box(segment.radius * 2, height, segment.radius * 2, GLASS, cx, y + height / 2, z);
      group.add(shaftMesh);
      const floorCount = Math.max(1, Math.floor(height / 3.2));
      for (let f = 1; f < floorCount; f += 1) {
        group.add(box(segment.radius * 2 + 0.55, 0.22, segment.radius * 2 + 0.55, TRIM, cx, y + f * 3.2, z));
      }
      [-1, 1].forEach((sx) => [-1, 1].forEach((sz) => {
        group.add(box(1.5, height, 1.5, TRIM, cx + sx * (segment.radius - 0.7), y + height / 2, z + sz * (segment.radius - 0.7)));
      }));
      y = segment.top;
    }
    group.add(box(5.2, 3.4, 5.2, TRIM, cx, shaft + 1.7, z));
    for (let i = 0; i < 12; i += 1) {
      const width = Math.max(0.9, 3.6 - i * 0.24);
      group.add(box(width, 2.4, width, i % 2 ? STEEL : TRIM, cx, shaft + 4.2 + i * 2.4, z));
    }
    group.add(box(0.7, 12, 0.7, STEEL, cx, shaft + 34, z));
  }

  const bridgeY = ground + 58;
  const span = gap - 12;
  const towerHalf = segmentRadius(segments);
  for (const side of [-1, 1]) {
    const cx = x + side * (gap / 2);
    collider(layout.colliders, cx, ground + shaft / 2, z, towerHalf, shaft / 2, towerHalf, 'tower');
  }
  group.add(box(span, 3.4, 5.0, GLASS, x, bridgeY, z));
  group.add(box(span + 1.4, 0.6, 5.8, TRIM, x, bridgeY - 2.0, z));
  group.add(box(span + 1.4, 0.6, 5.8, TRIM, x, bridgeY + 2.0, z));
  [-1, 1].forEach((side) => group.add(box(1.4, 4.2, 3.8, STEEL, x + side * (span / 2 - 2), bridgeY - 0.4, z)));

  group.add(box(54, 10, 18, CREAM, x, ground + 5, z + 26));
  group.add(box(56, 1.2, 19.5, TRIM, x, ground + 10.2, z + 26));
  group.add(box(46, 5, 12, GLASS_DARK, x, ground + 5.4, z + 26));
  collider(layout.colliders, x, ground + 5, z + 26, 27, 5, 9, 'podium');

  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(52, 52, 0.4, 28), new THREE.MeshStandardMaterial({ color: 0xc6bda9, roughness: 0.9 }));
  plaza.position.set(x, ground - 0.1, z + 4);
  plaza.receiveShadow = true;
  group.add(plaza);

  return { object: group, colliders: layout.colliders };
}

function segmentRadius(segments) {
  return segments[0].radius;
}

function buildTwistingTower(layout, landmark) {
  const group = new THREE.Group();
  const { x, z, ground } = landmark;
  const shaft = 122;
  const rings = 34;
  const segments = [];
  for (let i = 0; i < rings; i += 1) {
    const t = i / (rings - 1);
    const width = 15 - t * 8.2;
    const depth = 12 - t * 6.2;
    const y = ground + t * shaft;
    const twist = t * 3.4;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, shaft / rings + 0.4, depth), GLASS_DARK);
    mesh.position.set(x + Math.sin(twist) * t * 3.4, y + shaft / rings / 2, z + Math.cos(twist * 0.7) * t * 2.4);
    mesh.rotation.y = twist;
    mesh.castShadow = true;
    group.add(mesh);
    if (i % 3 === 0) {
      const trim = new THREE.Mesh(new THREE.BoxGeometry(width + 0.9, 0.42, depth + 0.9), TRIM);
      trim.position.copy(mesh.position);
      trim.rotation.y = twist;
      group.add(trim);
    }
    segments.push(width);
  }
  group.add(box(4.4, 4.5, 4.4, TRIM, x + Math.sin(3.4) * 3.4, ground + shaft + 2.2, z));
  for (let i = 0; i < 6; i += 1) {
    const width = Math.max(0.9, 3.2 - i * 0.42);
    group.add(box(width, 2.6, width, i % 2 ? STEEL : TRIM, x + Math.sin(3.4) * 3.4, ground + shaft + 5.6 + i * 2.6, z));
  }
  group.add(box(1.2, 14, 1.2, TRIM, x + Math.sin(3.4) * 3.4, ground + shaft + 24, z));
  collider(layout.colliders, x, ground + shaft / 2, z, 8, shaft / 2, 7, 'tower');
  return { object: group, colliders: layout.colliders };
}

function buildNeedleTower(layout, landmark) {
  const group = new THREE.Group();
  const { x, z, ground } = landmark;
  group.add(box(12, 5, 12, CREAM, x, ground + 2.5, z));
  group.add(box(9, 1.4, 9, STEEL_DARK, x, ground + 5.6, z));
  const segments = 24;
  const shaft = 74;
  for (let i = 0; i < segments; i += 1) {
    const width = 4.2 - (i / segments) * 1.1;
    const y = ground + 6 + i * (shaft / segments);
    group.add(box(width, shaft / segments + 0.1, width, i % 6 === 5 ? RED : WHITE, x, y + shaft / segments / 2, z));
  }
  const podY = ground + 68;
  group.add(box(15, 5.5, 15, CREAM, x, podY, z));
  const glassRing = new THREE.Mesh(new THREE.CylinderGeometry(8.6, 8.6, 2.6, 20), GLASS);
  glassRing.position.set(x, podY + 0.4, z);
  group.add(glassRing);
  group.add(box(12, 1.8, 12, RED, x, podY + 3.6, z));
  group.add(box(8, 3.2, 8, CREAM, x, podY + 6, z));
  group.add(box(1.7, 20, 1.7, WHITE, x, podY + 17, z));
  group.add(box(0.8, 7, 0.8, RED, x, podY + 30, z));
  group.add(box(0.4, 9, 0.4, STEEL, x, podY + 38, z));
  collider(layout.colliders, x, ground + 40, z, 3, 40, 3, 'tower');
  return { object: group, colliders: layout.colliders };
}

function buildHeritageBlock(layout, landmark) {
  const group = new THREE.Group();
  const { x, z, ground } = landmark;
  const width = 56;
  group.add(box(width, 9, 9, BRICK, x, ground + 4.5, z));
  group.add(box(width + 1.4, 1, 10, CREAM, x, ground + 9.2, z));
  for (let i = -width / 2 + 4; i < width / 2 - 2; i += 7) {
    [-1, 1].forEach((side) => {
      const arch = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.24, 6, 12, Math.PI), CREAM);
      arch.position.set(x + i, ground + 5.2, z + side * 4.6);
      arch.rotation.z = Math.PI;
      group.add(arch);
    });
  }
  group.add(box(8, 26, 8, BRICK, x, ground + 13, z));
  [-1, 1].forEach((side) => {
    const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 0.3, 16), CREAM);
    clockFace.rotation.x = Math.PI / 2;
    clockFace.position.set(x + side * 4.2, ground + 20, z);
    group.add(clockFace);
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(4.6, 16, 10), COPPER);
  dome.scale.y = 0.62;
  dome.position.set(x, ground + 27.5, z);
  group.add(dome);
  group.add(box(0.6, 4, 0.6, COPPER, x, ground + 31.5, z));
  [-1, 1].forEach((side) => {
    group.add(box(5.6, 16, 5.6, BRICK, x + side * 22, ground + 8, z));
    group.add(box(7, 2.2, 7, COPPER, x + side * 22, ground + 17, z));
    group.add(box(3.6, 3, 3.6, COPPER, x + side * 22, ground + 19.6, z));
  });
  collider(layout.colliders, x, ground + 5, z, width / 2, 5, 5, 'building');
  collider(layout.colliders, x, ground + 14, z, 4, 14, 4, 'building');
  return { object: group, colliders: layout.colliders };
}

function buildDomeMosque(layout, landmark) {
  const group = new THREE.Group();
  const { x, z, ground } = landmark;
  group.add(box(30, 8, 20, CREAM, x, ground + 4, z));
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(7, 8.4, 6, 16), CREAM);
  drum.position.set(x, ground + 11, z);
  drum.castShadow = true;
  group.add(drum);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(7.6, 18, 12), COPPER);
  dome.scale.y = 0.78;
  dome.position.set(x, ground + 16.5, z);
  dome.castShadow = true;
  group.add(dome);
  const crescent = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.28, 6, 14, Math.PI * 1.35), COPPER);
  crescent.position.set(x, ground + 24.6, z);
  group.add(crescent);
  group.add(box(0.5, 3, 0.5, COPPER, x, ground + 22.6, z));
  [-1, 1].forEach((side) => {
    group.add(box(1.5, 34, 1.5, CREAM, x + side * 12, ground + 17, z + 7));
    group.add(box(2.2, 2.2, 2.2, COPPER, x + side * 12, ground + 35, z + 7));
  });
  for (let i = 0; i < 6; i += 1) {
    group.add(box(28 - i * 4.2, 0.8, 18 - i * 2.8, COPPER, x, ground + 8.4 + i * 0.85, z));
  }
  collider(layout.colliders, x, ground + 5, z, 15, 5, 10, 'building');
  return { object: group, colliders: layout.colliders };
}

function buildTruncatedTower(layout, landmark) {
  const group = new THREE.Group();
  const { x, z, ground } = landmark;
  const shaft = 92;
  const rings = 28;
  for (let i = 0; i < rings; i += 1) {
    const t = i / (rings - 1);
    const width = 17 - t * 9.5;
    const depth = 14 - t * 7.4;
    const y = ground + t * shaft;
    const mesh = box(width, shaft / rings + 0.3, depth, GLASS, x, y + shaft / rings / 2, z);
    group.add(mesh);
    if (i % 3 === 0) group.add(box(width + 0.8, 0.4, depth + 0.8, TRIM, x, y + 0.6, z));
  }
  group.add(box(4, 4.5, 4, TRIM, x, ground + shaft + 2.2, z));
  group.add(box(1.1, 12, 1.1, STEEL, x, ground + shaft + 10, z));
  group.add(box(16, 6, 12, CREAM, x + 20, ground + 3, z));
  group.add(box(17, 1, 13, TRIM, x + 20, ground + 6.2, z));
  collider(layout.colliders, x, ground + shaft / 2, z, 7, shaft / 2, 6, 'tower');
  collider(layout.colliders, x + 20, ground + 3, z, 8, 3, 6, 'building');
  return { object: group, colliders: layout.colliders };
}

const BUILDERS = {
  twinTowers: buildTwinTowers,
  twistingTower: buildTwistingTower,
  needleTower: buildNeedleTower,
  heritageBlock: buildHeritageBlock,
  domeMosque: buildDomeMosque,
  truncatedTower: buildTruncatedTower
};

export function buildLandmarks(layout) {
  const results = [];
  for (const landmark of layout.landmarks) {
    const builder = BUILDERS[landmark.kind];
    if (!builder) continue;
    const built = builder(layout, landmark);
    built.object.name = `landmark_${landmark.id}`;
    built.object.position.set(0, 0, 0);
    results.push({ ...landmark, object: built.object });
  }
  return results;
}
