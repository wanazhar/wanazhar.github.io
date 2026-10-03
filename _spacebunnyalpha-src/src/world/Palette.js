import * as THREE from 'three';

// Palette for spacebunnyalpha.
//
// These are not arbitrary picks. They are drawn from real frame samples of
// Studio Ghibli films (the "Movies in Color" quantiles, via the ewenme/ghibli
// dataset), then adjusted for a voxel render. The governing rule from that
// data is a consistent hue/saturation/lightness band per material family:
//
//   sky    hue ~200-205 deg, low saturation, high lightness
//   grass  hue 105-155 deg, ~34% saturation, ~73% lightness
//   wood   hue 21-31 deg,  ~35% saturation, three lightness steps
//
// The single most important property is LIGHTNESS. Minecraft grass is
// #7CBD6B: dark and mid-saturated. Ghibli grass is #ACD2A3: light and pale.
// Swapping one for the other is the biggest "not Minecraft" lever available,
// and it costs nothing.
//
// Two greens are used on purpose. #ACD2A3 is warm sunlit grass; #A2D1BD is a
// cool celadon at hue 154. Mixing them is what makes a field read as painted
// rather than coloured.

export const PALETTE = {
  // Terrain. Note the top/side split for grass and sand: voxel art reads as 3D
  // far more convincingly from a lighter, warmer top face than from lighting
  // alone, and it costs one extra material.
  oceanFloor: 0x8FA8B0,
  water: 0x94C5CC,
  waterShallow: 0xB1D5BB,
  sand: 0xECE28B,
  sandWet: 0xD6C0A9,
  grass: 0xACD2A3,
  grassSide: 0xA2C4A0,
  grassDeep: 0xA2D1BD,
  grassDeepSide: 0x95C0B0,
  meadow: 0xC0CDBC,
  dirt: 0xC5A387,
  dirtDark: 0xAD8152,
  rock: 0x9DAFC3,
  rockDark: 0x7E8C97,
  paddyWater: 0xC3DAEA,
  paddyMud: 0xB1A98C,
  orchardGrass: 0xB8D2A8,
  orchardGrassSide: 0xABC096,

  // ------------------------------------------------------------------- city
  asphalt: 0x8B9098,
  asphaltLight: 0x9BA0A8,
  sidewalk: 0xD9D5CD,
  sidewalkDark: 0xC3BFB7,
  curb: 0xADAAA3,
  laneWhite: 0xF7EABD,
  laneYellow: 0xECE28B,
  crossingWhite: 0xF2EEE2,
  buildingWall: 0xE1D7CB,
  buildingWallAlt: 0xD6C0A9,
  buildingWallGrey: 0xC7C0C8,
  buildingWallBlue: 0xB4DCF5,
  buildingWallPink: 0xDBEBF8,
  buildingRoof: 0x6E7378,
  buildingRoofBlue: 0x8D93A1,
  window: 0x9DAFC3,
  windowLit: 0xF7EABD,
  windowDark: 0x6E7680,
  metal: 0xA8ADB2,
  metalDark: 0x76808A,
  neonPink: 0xD98594,
  neonBlue: 0x86C2DA,
  neonGreen: 0xB1D5BB,
  neonYellow: 0xECE28B,
  neonOrange: 0xEEBCB1,
  neonRed: 0xD05020,
  signWhite: 0xF2EEE2,
  awningRed: 0xC04080,
  awningBlue: 0x86C2DA,
  awningGreen: 0xA2D1BD,
  awningYellow: 0xECE28B,
  fenceWood: 0xAD8152,
  concrete: 0xC0CDBC,

  // ------------------------------------------------------ suburbs / houses
  houseWall: 0xE1D7CB,
  houseWallWood: 0xC5A387,
  houseWallBlue: 0xC0DDE1,
  houseRoof: 0x76808A,
  houseRoofBlue: 0x8D93A1,
  houseRoofGrey: 0x7E8C97,
  houseRoofGreen: 0x88988D,
  schoolWall: 0xECE28B,
  schoolRoof: 0xBA968A,
  schoolYard: 0xC0CDBC,

  // ------------------------------------------------------------------ rural
  riceGreen: 0xA2D1BD,
  riceGold: 0xECE28B,
  barnWall: 0xBA968A,
  barnRoof: 0x8D6B62,
  woodPost: 0xAD8152,
  woodPlank: 0xC5A387,
  bamboo: 0xA2D1BD,
  bambooDark: 0x7FAF94,
  orchardTree: 0xA2D1BD,
  flowerSakura: 0xF4ADB3,
  flowerSakuraDeep: 0xD98594,
  flowerSun: 0xECE28B,
  flowerLav: 0xAFACC9,

  // ------------------------------------------------------- shrine / temple
  toriiRed: 0xE75B64,
  toriiRedDark: 0xC04080,
  shrineWood: 0xBA968A,
  shrineWoodDark: 0x96807A,
  shrineRoof: 0x6E7378,
  shrineRoofEdge: 0x8D93A1,
  stone: 0xB1A98C,
  stoneDark: 0x88988D,
  stoneLight: 0xD0CDBC,
  moss: 0xA2D1BD,
  lanternStone: 0x9DAFC3,

  // ------------------------------------------------------------------ coast
  wetSand: 0xD6C0A9,
  driftwood: 0xAD9583,
  boatHull: 0xE1D7CB,
  boatHullDark: 0xB9AFA2,
  sailCloth: 0xF2EEE2,
  buoy: 0xE75B64,
  buoyBlue: 0x86C2DA,
  foam: 0xF7EABD,
  rockWet: 0x76808A,

  // ------------------------------------------------------------- nature etc
  trunk: 0xAD8152,
  trunkDark: 0x583B2B,
  leafLight: 0xACD2A3,
  leafGreen: 0xA2D1BD,
  leafAutumn: 0xD8AF39,
  leafMaple: 0xE75B64,
  grassTuft: 0xA2D1BD,
  reed: 0xB1D5BB,
  lampPost: 0x76808A,
  lampGlass: 0xF7EABD,
  vending: 0xD05020,
  vendingBody: 0xF2EEE2,
  vendingBlue: 0x86C2DA,
  utilityPole: 0xB1B5B0,
  wire: 0x6E7680,
  signPost: 0xAD9583,
  crate: 0xC5A387,
  barrel: 0x9DAFC3,

  // ------------------------------------------------------------- characters
  skin: 0xF0CBA8,
  skinShadow: 0xDDB18F,
  hairDark: 0x4A4450,
  hairBrown: 0xAD8152,
  hairLight: 0xD6C0A9,
  hairAoi: 0x86C2DA,
  clothBlue: 0x86C2DA,
  clothNavy: 0x6E7680,
  clothWhite: 0xF2EEE2,
  clothCream: 0xF7EABD,
  clothRed: 0xD98594,
  clothYellow: 0xECE28B,
  clothGreen: 0xA2D1BD,
  clothPink: 0xF4ADB3,
  clothGrey: 0x9BA0A8,
  apron: 0xC0CDBC,
  suitNavy: 0x76808A,
  schoolSailor: 0x6E7680,
  ribbon: 0xD98594
};

// A single cube geometry reused by every voxel prop in the game. One geometry
// means one shared buffer, so thousands of instanced blocks cost almost nothing.
export function createBlockGeometry() {
  return new THREE.BoxGeometry(1, 1, 1);
}

const materialCache = new Map();

// Unlit emissive-ish material for neon and window light. Kept separate so it
// can be switched to full brightness at night without touching lit surfaces.
export function createPaletteMaterials() {
  const materials = new Map();

  for (const [name, hex] of Object.entries(PALETTE)) {
    const isGlow = name.startsWith('neon') || name === 'lampGlass' || name === 'windowLit';
    materials.set(
      name,
      new THREE.MeshLambertMaterial({
        color: hex,
        emissive: isGlow ? hex : 0x000000,
        emissiveIntensity: isGlow ? 0.55 : 0,
        transparent: name === 'water' || name === 'waterShallow' || name === 'foam',
        opacity: name === 'foam' ? 0.75 : name === 'water' ? 0.82 : 1
      })
    );
  }

  return materials;
}

export function getMaterial(materials, name) {
  if (!materials.has(name)) {
    throw new Error(`Unknown material "${name}" — add it to PALETTE`);
  }
  return materials.get(name);
}

export function disposeMaterials(materials) {
  for (const material of materials.values()) material.dispose();
  materials.clear();
  materialCache.clear();
}

// Registry used by builders: they push boxes, never touch Three.js directly.
export class VoxelBatch {
  constructor() {
    this.entries = new Map();
  }

  // options may carry per-box rotations (ry for yaw, rz for a roof pitch).
  add(materialName, x, y, z, sx = 1, sy = 1, sz = 1, options = {}) {
    let list = this.entries.get(materialName);
    if (!list) {
      list = [];
      this.entries.set(materialName, list);
    }
    list.push({ x, y, z, sx, sy, sz, ...options });
    return this;
  }

  count() {
    let total = 0;
    for (const list of this.entries.values()) total += list.length;
    return total;
  }

  materials() {
    return [...this.entries.keys()];
  }

  get(materialName) {
    return this.entries.get(materialName) ?? [];
  }

  merge(other) {
    for (const [name, list] of other.entries) {
      let target = this.entries.get(name);
      if (!target) {
        target = [];
        this.entries.set(name, target);
      }
      target.push(...list);
    }
    return this;
  }
}