import * as THREE from 'three';

// Rounded geometry.
//
// The whole world used to be BoxGeometry, which is why it read as Minecraft no
// matter how the colours were tuned. A hard 90-degree edge catches light in a
// way that draws the eye straight to it and makes everything look like a
// placeholder.
//
// These are superellipsoids: the same box family, but with a per-axis exponent
// that rounds the corners. x = y = z = 1 is a plain box; higher values push the
// surface towards a sphere. Small values like 4 give a crisp block that still
// reads as a block, which is what architecture wants. Large values give the
// soft, pillowy forms that character work needs.
//
// One geometry per (exponent, segments) pair is cached and shared, so a world
// built from thousands of rounded blocks still only uploads a handful of
// buffers.

const cache = new Map();

function superellipsoidGeometry(exponent, segments = 8) {
  const key = `${exponent}:${segments}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const e = Math.max(0.2, exponent);
  // Impostor formula: |x|^e + |y|^e + |z|^e = 1, solved for z.
  //
  // t is the polar angle. As t goes 0..PI we sweep pole to pole; phi goes
  // around. Exponent controls how boxy the result is.
  const positions = [];
  const normals = [];
  const indices = [];

  const sign = (v) => (v < 0 ? -1 : 1);
  const pow = (v, p) => Math.pow(Math.abs(v), p);

  const rings = segments * 2;
  const sides = segments * 4;

  for (let i = 0; i <= rings; i += 1) {
    // Latitude from the top pole, avoiding an exact 0/PI so we do not divide by
    // zero at the poles.
    const v = (i / rings) * Math.PI - Math.PI / 2;
    const cv = Math.cos(v);
    const sv = Math.sin(v);

    for (let j = 0; j <= sides; j += 1) {
      const u = (j / sides) * Math.PI * 2 - Math.PI;
      const cu = Math.cos(u);
      const su = Math.sin(u);

      const x = sign(cu) * pow(Math.abs(cu), 2 / e) * pow(Math.abs(cv), 2 / e);
      const y = sign(sv) * pow(Math.abs(sv), 2 / e);
      const z = sign(su) * pow(Math.abs(su), 2 / e) * pow(Math.abs(cv), 2 / e);

      positions.push(x, y, z);

      // Analytic-ish normal for a superellipsoid is messy; the gradient of the
      // implicit form gives a good approximation and is cheap.
      const gx = Math.sign(x) * Math.pow(Math.abs(x), e - 1) / (e || 1);
      const gy = Math.sign(y) * Math.pow(Math.abs(y), e - 1) / (e || 1);
      const gz = Math.sign(z) * Math.pow(Math.abs(z), e - 1) / (e || 1);
      const len = Math.hypot(gx, gy, gz) || 1;
      normals.push(gx / len, gy / len, gz / len);
    }
  }

  for (let i = 0; i < rings; i += 1) {
    for (let j = 0; j < sides; j += 1) {
      const a = i * (sides + 1) + j;
      const b = a + sides + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setIndex(indices);

  // Normalise to a unit bounding box. The raw superellipsoid form extends past
  // 1.0 along the axes for a low exponent (a "block" at exponent 6 reaches
  // ~1.44), and every caller scales these the same way it scaled a box, so an
  // unexpected 44% oversize would silently inflate the whole world.
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const cx = (bb.min.x + bb.max.x) / 2;
  const cy = (bb.min.y + bb.max.y) / 2;
  const cz = (bb.min.z + bb.max.z) / 2;
  const sx = bb.max.x - bb.min.x || 1;
  const sy = bb.max.y - bb.min.y || 1;
  const sz = bb.max.z - bb.min.z || 1;

  const pos = geo.attributes.position;
  const nor = geo.attributes.normal;
  for (let i = 0; i < pos.count; i += 1) {
    pos.setXYZ(
      i,
      (pos.getX(i) - cx) / sx,
      (pos.getY(i) - cy) / sy,
      (pos.getZ(i) - cz) / sz
    );
    // Normals have to follow the same non-uniform scaling.
    nor.setXYZ(
      i,
      nor.getX(i) / sx,
      nor.getY(i) / sy,
      nor.getZ(i) / sz
    );
  }
  pos.needsUpdate = true;
  nor.needsUpdate = true;
  geo.computeVertexNormals();

  geo.computeBoundingSphere();

  cache.set(key, geo);
  return geo;
}

// Named rounding levels. Keeping these as vocabulary rather than raw numbers
// means the builders read as intent ("a soft blob") rather than arithmetic.
//
// Segment counts are deliberately low. A rounded corner only needs enough
// geometry to catch the rim light along its edge; past that the extra vertices
// cost triangles and buy nothing. At these settings 'rounded' is 200 triangles
// against a cube's 12, which is the price of not looking like Minecraft. Going
// higher (an early version used 4x the segments and cost 12 million triangles
// on screen) buys visible curvature nobody can see at gameplay distance.
export const SHAPE = {
  // Crisp. Still unmistakably a block, so architecture keeps its structure.
  block: { exponent: 5, segments: 2 },
  // The workhorse for buildings, ground and props.
  rounded: { exponent: 3, segments: 3 },
  // Pillowy. Organic forms: foliage, cushions, food.
  soft: { exponent: 1.8, segments: 4 },
  // Almost a sphere. Heads and small round props.
  blob: { exponent: 1.2, segments: 5 }
};

export function shapeGeometry(name) {
  const shape = SHAPE[name] ?? SHAPE.rounded;
  return superellipsoidGeometry(shape.exponent, shape.segments);
}

// Unit geometry for instancing. Returned centred on the origin with a 1x1x1
// bounding box, so a caller scales it the same way it scaled a box.
export function roundedBlockGeometry(name = 'rounded') {
  return shapeGeometry(name);
}

export function disposeShapeCache() {
  for (const geo of cache.values()) geo.dispose();
  cache.clear();
}

export function shapeCacheSize() {
  return cache.size;
}