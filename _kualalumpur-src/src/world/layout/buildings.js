const FLOOR_HEIGHT = 3;

export function addWindowBands(inst, x0, z0, w, d, yBase, floors, floorHeight, sideKey, step = 2) {
  for (let floor = step; floor < floors; floor += step) {
    const y = yBase + floor * floorHeight;
    inst.addBox(x0 + w / 2, y, z0 - 0.08, Math.max(1, w - 0.8), 0.5, 0.12, sideKey);
    inst.addBox(x0 + w / 2, y, z0 + d + 0.08, Math.max(1, w - 0.8), 0.5, 0.12, sideKey);
    inst.addBox(x0 - 0.08, y, z0 + d / 2, 0.12, 0.5, Math.max(1, d - 0.8), sideKey);
    inst.addBox(x0 + w + 0.08, y, z0 + d / 2, 0.12, 0.5, Math.max(1, d - 0.8), sideKey);
  }
}

export function addRoofClutter(inst, x0, z0, w, d, roofY, random, scale = 1) {
  const cx = x0 + w / 2;
  const cz = z0 + d / 2;
  if (random() < 0.75 * scale) {
    inst.addBox(cx + (random() - 0.5) * w * 0.4, roofY + 0.6, cz + (random() - 0.5) * d * 0.4, 1.6, 1.2, 1.6, 'steel');
  }
  if (random() < 0.6 * scale) {
    inst.addBox(cx + (random() - 0.5) * w * 0.5, roofY + 0.9, cz + (random() - 0.5) * d * 0.5, 1.9, 1.8, 1.9, 'silver');
  }
  if (random() < 0.35 * scale) {
    inst.addBox(cx, roofY + 3.4, cz, 0.22, 6.4, 0.22, 'concreteDark');
    inst.addBox(cx, roofY + 7, cz, 0.4, 0.4, 0.4, 'warning');
  }
}

export function addGenericBuilding(inst, terrain, collision, x0, z0, w, d, height, bodyKey, glassKey = 'glassDark', options = {}) {
  const ground = terrain.surfaceYAt(x0 + w / 2, z0 + d / 2);
  const floors = Math.max(2, Math.round(height / FLOOR_HEIGHT));
  const totalHeight = floors * FLOOR_HEIGHT;
  const random = options.random ?? (() => 0.5);

  inst.addBox(x0 + w / 2, ground + totalHeight / 2, z0 + d / 2, w, totalHeight, d, bodyKey);
  inst.addBox(x0 + w / 2, ground + totalHeight + 0.2, z0 + d / 2, w + 0.7, 0.5, d + 0.7, 'concreteDark');
  inst.addBox(x0 + w / 2, ground + 0.5, z0 + d / 2, w + 0.5, 0.9, d + 0.5, 'concreteDark');
  addWindowBands(inst, x0, z0, w, d, ground + 1.4, floors, FLOOR_HEIGHT, glassKey, totalHeight > 27 ? 2 : 1);

  if (options.podium) {
    const pw = Math.min(w + 4, w * 1.25);
    const pd = Math.min(d + 4, d * 1.25);
    inst.addBox(x0 + w / 2, ground + 2.4, z0 + d / 2 - (pd - d) / 2 - 1, pw, 4.8, 3, 'concrete');
  }
  addRoofClutter(inst, x0, z0, w, d, ground + totalHeight + 0.4, random, totalHeight > 40 ? 1 : 0.7);
  collision.addFootprint(x0, z0, w, d, options.collisionMargin ?? 0);
  return { height: totalHeight, ground };
}

export function addSetbackTower(inst, terrain, collision, x0, z0, w, d, height, bodyKey, glassKey, random) {
  const lower = Math.round(height * 0.42);
  const upper = height - lower;
  const upperW = Math.max(4, w - 2);
  const upperD = Math.max(4, d - 2);
  addGenericBuilding(inst, terrain, collision, x0, z0, w, d, lower, bodyKey, glassKey, { random });
  const ground = terrain.surfaceYAt(x0 + w / 2, z0 + d / 2);
  const ox = x0 + (w - upperW) / 2;
  const oz = z0 + (d - upperD) / 2;
  const floors = Math.max(2, Math.round(upper / FLOOR_HEIGHT));
  const totalHeight = floors * FLOOR_HEIGHT;
  inst.addBox(ox + upperW / 2, ground + lower + totalHeight / 2, oz + upperD / 2, upperW, totalHeight, upperD, bodyKey);
  inst.addBox(ox + upperW / 2, ground + lower + totalHeight + 0.2, oz + upperD / 2, upperW + 0.6, 0.5, upperD + 0.6, bodyKey === 'blackGlass' ? 'silver' : 'concreteDark');
  addWindowBands(inst, ox, oz, upperW, upperD, ground + lower + 1.6, floors, FLOOR_HEIGHT, glassKey, 2);
  if (height > 70) {
    inst.addBox(ox + upperW / 2, ground + height + 4, oz + upperD / 2, 0.3, 8, 0.3, 'silver');
  }
  collision.addFootprint(x0, z0, w, d);
}

export function addShophouseRow(inst, terrain, collision, x0, z0, count, faceAxis, bodyKeys, random) {
  const unitWidth = 4;
  const depth = 6;
  const ground = terrain.surfaceYAt(x0 + unitWidth, z0 + depth / 2);
  for (let i = 0; i < count; i += 1) {
    const floors = 2 + (i % 2 === 0 ? 1 : 0);
    const height = floors * FLOOR_HEIGHT;
    const bx = faceAxis === 'x' ? x0 + i * unitWidth : x0;
    const bz = faceAxis === 'x' ? z0 : z0 + i * unitWidth;
    const w = faceAxis === 'x' ? unitWidth - 0.15 : depth;
    const d = faceAxis === 'x' ? depth : unitWidth - 0.15;
    const bodyKey = bodyKeys[i % bodyKeys.length];
    inst.addBox(bx + w / 2, ground + height / 2, bz + d / 2, w, height, d, bodyKey);
    inst.addBox(bx + w / 2, ground + height + 0.3, bz + d / 2, w + 0.35, 1.1, d + 0.35, 'roofCopper');
    if (faceAxis === 'x') {
      inst.addBox(bx + w / 2, ground + height - 1.4, bz - 0.55, w, 0.35, 1.1, 'awningStripe');
      inst.addBox(bx + w / 2, ground + 3.1, bz - 0.1, w - 0.6, 0.9, 0.3, 'glassDark');
    } else {
      inst.addBox(bx - 0.55, ground + height - 1.4, bz + d / 2, 1.1, 0.35, d, 'awningStripe');
      inst.addBox(bx - 0.1, ground + 3.1, bz + d / 2, 0.3, 0.9, d - 0.6, 'glassDark');
    }
    collision.addFootprint(bx, bz, w, d, 0.6);
  }
  if (random() < 0.8) {
    const signX = faceAxis === 'x' ? x0 + unitWidth : x0 - 0.4;
    const signZ = faceAxis === 'x' ? z0 - 0.4 : z0 + unitWidth;
    inst.addBox(signX, ground + 6.4, signZ, 1.4, 2.6, 0.3, 'marketRed');
  }
}

export function addKampungHouse(inst, terrain, collision, x0, z0, w, d, random) {
  const ground = terrain.surfaceYAt(x0 + w / 2, z0 + d / 2);
  const height = 3.2 + random() * 1.4;
  inst.addBox(x0 + w / 2, ground + height / 2, z0 + d / 2, w, height, d, 'clay');
  inst.addBox(x0 + w / 2, ground + height + 0.45, z0 + d / 2, w + 0.9, 1.1, d + 0.9, random() < 0.5 ? 'roofCopper' : 'stationRoof');
  inst.addBox(x0 + w / 2, ground + height + 1.15, z0 + d / 2, w * 0.55, 0.7, d * 0.55, 'redBrick');
  inst.addBox(x0 + 0.6, ground + 1.3, z0 + d + 0.12, w * 0.5, 1.1, 0.2, 'glassDark');
  collision.addFootprint(x0, z0, w, d);
}

export function addParkBlock(inst, terrain, x0, z0, size, random) {
  const ground = terrain.surfaceYAt(x0 + size / 2, z0 + size / 2);
  const pathKey = 'parkPath';
  inst.addBox(x0 + size / 2, ground + 0.12, z0 + size / 2, size - 1, 0.24, 2.2, pathKey);
  inst.addBox(x0 + size / 2, ground + 0.12, z0 + size / 2, 2.2, 0.24, size - 1, pathKey);
  const treeCount = 5 + Math.floor(random() * 4);
  for (let i = 0; i < treeCount; i += 1) {
    const tx = x0 + 2 + random() * (size - 4);
    const tz = z0 + 2 + random() * (size - 4);
    addLeafyTree(inst, terrain, tx, tz, 3.4 + random() * 1.8);
  }
  for (let i = 0; i < 4; i += 1) {
    const bx = x0 + 2 + random() * (size - 4);
    const bz = z0 + 2 + random() * (size - 4);
    inst.addBox(bx, ground + 0.7, bz, 2.4, 0.5, 0.8, 'clay');
    inst.addBox(bx - 1, ground + 0.55, bz, 0.4, 0.9, 0.8, 'concreteDark');
  }
}

export function addLeafyTree(inst, terrain, x, z, height = 4) {
  const y = terrain.surfaceYAt(x, z);
  inst.addBox(x, y + height / 2, z, 0.6, height, 0.6, 'treeTrunk');
  inst.addBox(x, y + height + 0.5, z, 3.2, 1.8, 3.2, 'treeLeaf');
  inst.addBox(x, y + height + 1.9, z, 2.1, 1.2, 2.1, 'treeLeaf2');
  inst.addBox(x, y + height + 0.2, z, 4.2, 0.6, 1.1, 'treeLeaf');
  inst.addBox(x, y + height + 0.2, z, 1.1, 0.6, 4.2, 'treeLeaf');
}
