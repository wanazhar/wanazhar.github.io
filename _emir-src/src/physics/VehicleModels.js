import * as THREE from 'three';

function box(width, height, depth, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function wedge(width, height, depth, material, x, y, z, tilt) {
  const mesh = box(width, height, depth, material, x, y, z);
  mesh.rotation.x = tilt;
  return mesh;
}

function wheelMesh(radius, width, material, hubMaterial) {
  const group = new THREE.Group();
  const tyre = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 18), material);
  tyre.rotation.z = Math.PI / 2;
  tyre.castShadow = true;
  group.add(tyre);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.54, radius * 0.54, width * 1.1, 14), hubMaterial);
  hub.rotation.z = Math.PI / 2;
  group.add(hub);
  const spoke = new THREE.Mesh(new THREE.BoxGeometry(width * 1.14, radius * 0.14, radius * 1.5), hubMaterial);
  group.add(spoke);
  const spoke2 = spoke.clone();
  spoke2.rotation.x = Math.PI / 2;
  group.add(spoke2);
  return group;
}

function materials(profile) {
  return {
    paint: new THREE.MeshStandardMaterial({ color: profile.visual.color, roughness: 0.32, metalness: 0.45 }),
    paintDark: new THREE.MeshStandardMaterial({
      color: new THREE.Color(profile.visual.color).multiplyScalar(0.72),
      roughness: 0.4,
      metalness: 0.4
    }),
    trim: new THREE.MeshStandardMaterial({ color: 0x1b1f24, roughness: 0.55, metalness: 0.3 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(profile.visual.glass).multiplyScalar(0.55),
      roughness: 0.06,
      metalness: 0.4,
      transparent: true,
      opacity: 0.72
    }),
    accent: new THREE.MeshStandardMaterial({ color: profile.visual.accent, roughness: 0.42, metalness: 0.25 }),
    headlight: new THREE.MeshStandardMaterial({ color: 0xfff4cf, roughness: 0.22, emissive: 0x3a2f10, emissiveIntensity: 0.5 }),
    taillight: new THREE.MeshStandardMaterial({ color: 0xd8392f, roughness: 0.3, emissive: 0x3d0a06, emissiveIntensity: 0.6 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xc8ced4, roughness: 0.25, metalness: 0.85 })
  };
}

/**
 * Dark arch boxes straddling each wheel so the tyres read as sitting inside the body rather than
 * bolted onto the outside of a slab.
 */
function addWheelArches(group, profile, mat, heightScale = 0.26) {
  const { width, height } = profile.dimensions;
  const { wheelBase, axleWidth, wheel } = profile;
  const y = -height * 0.45;
  for (const side of [-1, 1]) {
    for (const end of [-1, 1]) {
      group.add(box(
        width * 0.09,
        wheel.radius * heightScale * 2,
        wheel.radius * 2.5,
        mat,
        side * (axleWidth / 2 + width * 0.02),
        y + wheel.radius * 0.55,
        end * (wheelBase / 2)
      ));
    }
  }
}

function buildSedanBody(profile) {
  const { width, height, length } = profile.dimensions;
  const m = materials(profile);
  const group = new THREE.Group();
  const y = (f) => height * f;

  group.add(box(width * 0.97, y(0.2), length * 0.98, m.trim, 0, -y(0.3), 0));
  group.add(box(width, y(0.52), length, m.paint, 0, -y(0.04), 0));
  group.add(box(width * 0.96, y(0.2), length * 0.34, m.paint, 0, y(0.2), -length * 0.3));
  group.add(box(width * 0.96, y(0.18), length * 0.26, m.paint, 0, y(0.2), length * 0.34));
  group.add(box(width * 0.9, y(0.4), length * 0.44, m.glass, 0, y(0.36), length * 0.03));
  group.add(box(width * 0.84, y(0.1), length * 0.36, m.paint, 0, y(0.55), length * 0.03));
  group.add(wedge(width * 0.88, y(0.06), length * 0.2, m.glass, 0, y(0.3), -length * 0.22, -0.62));
  group.add(wedge(width * 0.88, y(0.06), length * 0.17, m.glass, 0, y(0.32), length * 0.26, 0.5));
  group.add(box(width * 1.02, y(0.18), length * 0.07, m.trim, 0, -y(0.22), -length * 0.49));
  group.add(box(width * 1.02, y(0.18), length * 0.07, m.trim, 0, -y(0.22), length * 0.49));
  group.add(box(width * 0.62, y(0.1), 0.1, m.headlight, 0, y(0.05), -length / 2 - 0.03));
  group.add(box(width * 0.62, y(0.1), 0.1, m.taillight, 0, y(0.05), length / 2 + 0.03));
  group.add(box(width * 1.06, y(0.05), length * 0.3, m.chrome, 0, y(0.03), -length * 0.02));
  for (const side of [-1, 1]) {
    group.add(box(0.16, y(0.1), 0.1, m.trim, side * (width / 2 + 0.08), y(0.32), -length * 0.16));
  }
  addWheelArches(group, profile, m.trim);
  return group;
}

function buildHatchbackBody(profile) {
  const { width, height, length } = profile.dimensions;
  const m = materials(profile);
  const group = new THREE.Group();
  const y = (f) => height * f;

  group.add(box(width * 0.97, y(0.2), length * 0.96, m.trim, 0, -y(0.3), 0));
  group.add(box(width, y(0.54), length, m.paint, 0, -y(0.04), 0));
  group.add(box(width * 0.96, y(0.2), length * 0.28, m.paint, 0, y(0.2), -length * 0.3));
  group.add(box(width * 0.9, y(0.5), length * 0.5, m.glass, 0, y(0.38), length * 0.04));
  group.add(box(width * 0.84, y(0.1), length * 0.44, m.paint, 0, y(0.62), length * 0.04));
  group.add(wedge(width * 0.88, y(0.06), length * 0.18, m.glass, 0, y(0.3), -length * 0.24, -0.7));
  group.add(box(width * 1.02, y(0.18), length * 0.07, m.trim, 0, -y(0.22), -length * 0.48));
  group.add(box(width * 1.02, y(0.24), length * 0.06, m.trim, 0, -y(0.16), length * 0.5));
  group.add(box(width * 0.6, y(0.1), 0.1, m.headlight, 0, y(0.03), -length / 2 - 0.03));
  group.add(box(width * 0.52, y(0.22), 0.1, m.taillight, 0, y(0.18), length / 2 + 0.03));
  for (const side of [-1, 1]) {
    group.add(box(0.15, y(0.1), 0.09, m.trim, side * (width / 2 + 0.08), y(0.34), -length * 0.14));
  }
  addWheelArches(group, profile, m.trim, 0.3);
  return group;
}

function buildOffroaderBody(profile) {
  const { width, height, length } = profile.dimensions;
  const m = materials(profile);
  const group = new THREE.Group();
  const y = (f) => height * f;

  group.add(box(width * 1.02, y(0.26), length * 0.98, m.trim, 0, -y(0.3), 0));
  group.add(box(width, y(0.5), length, m.paint, 0, -y(0.02), 0));
  group.add(box(width * 0.98, y(0.42), length * 0.56, m.paint, 0, y(0.44), -length * 0.06));
  group.add(box(width * 0.94, y(0.3), length * 0.5, m.glass, 0, y(0.46), -length * 0.06));
  group.add(box(width * 1.02, y(0.1), length * 0.56, m.accent, 0, y(0.68), -length * 0.06));
  for (const side of [-1, 1]) {
    for (const end of [-1, 1]) {
      group.add(box(0.11, y(0.34), length * 0.72, m.trim, side * (width / 2 + 0.06), y(0.14), end * length * 0.04));
    }
  }
  group.add(box(width * 0.86, y(0.12), 0.12, m.trim, 0, y(0.66), -length * 0.34));
  group.add(box(width * 0.8, y(0.1), length * 0.08, m.trim, 0, -y(0.26), -length * 0.5));
  group.add(box(width * 1.06, y(0.2), length * 0.06, m.trim, 0, -y(0.26), length * 0.5));
  group.add(box(width * 0.5, y(0.14), 0.1, m.headlight, 0, y(0.08), -length / 2 - 0.04));
  group.add(box(width * 0.5, y(0.14), 0.1, m.taillight, 0, y(0.08), length / 2 + 0.04));
  group.add(box(0.14, y(0.5), 0.14, m.chrome, width * 0.34, y(0.2), -length * 0.3));
  addWheelArches(group, profile, m.trim, 0.24);
  return group;
}

function buildTruckBody(profile) {
  const { width, height, length } = profile.dimensions;
  const m = materials(profile);
  const group = new THREE.Group();
  const y = (f) => height * f;
  const cabZ = -length * 0.3;

  group.add(box(width, y(0.2), length * 0.98, m.trim, 0, -y(0.34), 0));
  group.add(box(width, y(0.62), length * 0.4, m.paint, 0, y(0.02), cabZ));
  group.add(box(width * 0.92, y(0.36), length * 0.3, m.glass, 0, y(0.44), cabZ - length * 0.04));
  group.add(box(width * 0.98, y(0.1), length * 0.36, m.paint, 0, y(0.68), cabZ));
  group.add(box(width * 1.04, y(0.2), length * 0.06, m.trim, 0, -y(0.3), -length * 0.49));
  group.add(box(width * 0.98, y(0.16), length * 0.5, m.paintDark, 0, y(0.1), length * 0.22));
  group.add(box(width * 0.9, y(0.06), length * 0.48, m.trim, 0, -y(0.12), length * 0.22));
  group.add(box(width * 1.02, y(0.24), length * 0.05, m.accent, 0, y(0.34), length * 0.48));
  group.add(box(width * 0.3, y(0.1), 0.1, m.headlight, -width * 0.32, y(0.1), -length / 2 - 0.03));
  group.add(box(width * 0.3, y(0.1), 0.1, m.headlight, width * 0.32, y(0.1), -length / 2 - 0.03));
  group.add(box(width * 0.26, y(0.12), 0.1, m.taillight, -width * 0.32, y(0.04), length / 2 + 0.02));
  group.add(box(width * 0.26, y(0.12), 0.1, m.taillight, width * 0.32, y(0.04), length / 2 + 0.02));
  for (const side of [-1, 1]) {
    group.add(box(0.18, y(0.5), 0.12, m.trim, side * (width / 2 + 0.14), y(0.3), cabZ - length * 0.02));
    group.add(box(0.12, y(0.16), length * 0.2, m.chrome, side * (width / 2 + 0.06), y(0.22), cabZ + length * 0.1));
  }
  addWheelArches(group, profile, m.trim, 0.2);
  return group;
}

function buildExcavatorBody(profile) {
  const { width, height, length } = profile.dimensions;
  const m = materials(profile);
  const group = new THREE.Group();
  const y = (f) => height * f;

  group.add(box(width * 1.06, y(0.24), length * 0.96, m.trim, 0, -y(0.32), 0));
  group.add(box(width, y(0.5), length, m.paint, 0, -y(0.02), 0));
  group.add(box(width * 0.66, y(0.4), length * 0.4, m.glass, 0, y(0.42), -length * 0.14));
  group.add(box(width * 0.72, y(0.1), length * 0.46, m.paint, 0, y(0.64), -length * 0.14));
  group.add(box(width * 0.9, y(0.16), length * 0.3, m.paintDark, 0, y(0.2), length * 0.3));
  group.add(wedge(0.6, 0.5, 2.0, m.accent, -width * 0.34, y(0.3), -length * 0.34, 0.5));
  group.add(wedge(0.5, 0.42, 1.5, m.accent, -width * 0.34, y(0.6), -length * 0.5, -0.9));
  group.add(box(1.2, 0.65, 0.8, m.paintDark, -width * 0.34, y(0.14), -length * 0.66));
  group.add(box(0.16, y(0.6), 0.16, m.chrome, width * 0.3, y(0.34), -length * 0.36));
  group.add(box(width * 0.5, y(0.1), 0.1, m.headlight, 0, y(0.06), -length / 2 - 0.04));
  group.add(box(width * 0.5, y(0.1), 0.1, m.taillight, 0, y(0.06), length / 2 + 0.04));
  addWheelArches(group, profile, m.trim, 0.16);
  return group;
}

const BODY_BUILDERS = {
  sedan: buildSedanBody,
  hatchback: buildHatchbackBody,
  offroader: buildOffroaderBody,
  truck: buildTruckBody,
  excavator: buildExcavatorBody
};

export function buildVehicleVisual(profile) {
  const root = new THREE.Group();
  root.name = `vehicle_${profile.id}`;
  const body = (BODY_BUILDERS[profile.id] ?? buildSedanBody)(profile);
  root.add(body);

  const tyreMaterial = new THREE.MeshStandardMaterial({ color: 0x15181b, roughness: 0.92, metalness: 0.05 });
  const hubMaterial = new THREE.MeshStandardMaterial({ color: 0xb9bfc4, roughness: 0.3, metalness: 0.82 });
  const halfBase = profile.wheelBase / 2;
  const halfWidth = profile.axleWidth / 2;
  const wheelY = -profile.dimensions.height * 0.45;

  const wheelSpec = [
    { key: 'fl', x: -halfWidth, z: -halfBase, front: true },
    { key: 'fr', x: halfWidth, z: -halfBase, front: true },
    { key: 'rl', x: -halfWidth, z: halfBase, front: false },
    { key: 'rr', x: halfWidth, z: halfBase, front: false }
  ].map((spec) => {
    const node = wheelMesh(profile.wheel.radius, profile.wheel.width, tyreMaterial, hubMaterial);
    node.position.set(spec.x, wheelY, spec.z);
    root.add(node);
    return { ...spec, node, local: new THREE.Vector3(spec.x, wheelY, spec.z), compression: 0.5 };
  });

  return { root, body: root, wheels: wheelSpec };
}
