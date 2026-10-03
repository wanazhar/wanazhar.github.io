import * as THREE from 'three';

// Palette for spacebunnyalpha, aimed at Rimsoft (That Time I Got Reincarnated as
// a Slime) rather than Ghibli.
//
// The single biggest difference from a muted, filmic look: SATURATION. The
// measured median saturation across official Rimsoft artwork is roughly 0.30
// to 0.45, with a small number of very high-chroma accents. Most of the frame
// is calm, and the chroma budget is spent deliberately on two or three hues.
//
// The second difference is how shadows are made. Rimsoft does not darken by
// multiplying value -- that kills chroma and turns everything grey. Measured
// across several covers, his shadows shift hue toward blue by roughly 6 to 9
// degrees and INCREASE saturation, often doubling it, while value stays high.
// Shadows here are therefore a hue shift plus a saturation lift, not a
// multiply. See ShadowMaterial.js.
//
// The third is value contrast between adjacent surfaces. Adjacent materials
// should differ by at least 0.25 in value, or 40 degrees in hue, so nothing
// merges into its neighbour at gameplay zoom.

export const PALETTE = {
  // ---------------------------------------------------------------- terrain
  // Grass is the biggest departure from a muted palette: genuinely saturated,
  // the way Rimsoft paints a field in sunlight.
  oceanFloor: 0x5F6478,
  water: 0x4FA8E8,
  waterShallow: 0x7FC8E8,
  sand: 0xDDDEB0,
  sandWet: 0xC8C79A,
  grass: 0x7FBF4A,
  grassSide: 0x6FA83C,
  grassDeep: 0x5C9E3A,
  grassDeepSide: 0x4E8A31,
  meadow: 0xA8D84A,
  dirt: 0xB0855C,
  dirtDark: 0x8F6A47,
  rock: 0xC7C9DB,
  rockDark: 0x8E93A8,
  rockShadow: 0x5F6478,
  paddyWater: 0x8FD0E8,
  paddyMud: 0xA89372,
  orchardGrass: 0x8ECB5C,
  orchardGrassSide: 0x7AB84C,

  // ------------------------------------------------------------------- city
  asphalt: 0x6E7386,
  asphaltLight: 0x7E8396,
  sidewalk: 0xDCDCE8,
  sidewalkDark: 0xC2C2D0,
  curb: 0xA8AABC,
  laneWhite: 0xFCF3D4,
  laneYellow: 0xF0D96A,
  crossingWhite: 0xF8F6EC,
  // Walls sit in a calm mid range so the saturated accents can carry the eye.
  buildingWall: 0xE8E4DC,
  buildingWallAlt: 0xD8CDBE,
  // Weathered timber cladding. Machiya are wood-fronted far more often than
  // plaster, and a warm mid brown stops a row of pale walls reading as a fence.
  buildingWallWood: 0xC4A882,
  buildingWallGrey: 0xC4C6D4,
  buildingWallBlue: 0xB4D2E8,
  buildingWallPink: 0xF2D8DC,
  // Roofs are the one deliberately dark structural note, as kawara are.
  buildingRoof: 0x5A5F6E,
  buildingRoofBlue: 0x6B7286,
  window: 0x8FD8F0,
  windowLit: 0xFCF3D4,
  windowDark: 0x4A5060,
  metal: 0xA8AEBC,
  metalDark: 0x6E7484,
  // The chroma budget: these are the only strongly saturated things in the city.
  neonPink: 0xEC718C,
  neonBlue: 0x0DB7D9,
  neonGreen: 0x7ED957,
  neonYellow: 0xF5DC5E,
  neonOrange: 0xE8865A,
  neonRed: 0xD4513B,
  signWhite: 0xFCF3D4,
  awningRed: 0xD4513B,
  awningBlue: 0x4FA8E8,
  awningGreen: 0x5C9E3A,
  awningYellow: 0xF0D96A,
  fenceWood: 0xDDDEB0,
  concrete: 0xC4C6D4,

  // ------------------------------------------------------ suburbs / houses
  houseWall: 0xF2EDE0,
  houseWallWood: 0xDDC9A4,
  houseWallBlue: 0xC8DCE8,
  houseRoof: 0x5A5F6E,
  houseRoofBlue: 0x6B7286,
  houseRoofGrey: 0x747A8A,
  houseRoofGreen: 0x5C7A62,
  schoolWall: 0xE8E2CC,
  schoolRoof: 0xD4513B,
  schoolYard: 0xC4C6D4,

  // ------------------------------------------------------------------ rural
  riceGreen: 0x7FBF4A,
  riceGold: 0xD6C257,
  barnWall: 0xD4513B,
  barnRoof: 0x9C2045,
  woodPost: 0xB0855C,
  woodPlank: 0xDDDEB0,
  bamboo: 0x8CBF5C,
  bambooDark: 0x6FA83C,
  orchardTree: 0x6FA83C,
  flowerSakura: 0xF39CCC,
  flowerSakuraDeep: 0xEC718C,
  flowerSun: 0xF5DC5E,
  flowerLav: 0xB8A8E0,

  // ------------------------------------------------------- shrine / temple
  toriiRed: 0xD4513B,
  toriiRedDark: 0x9C2045,
  shrineWood: 0xB45A48,
  shrineWoodDark: 0x8F3A38,
  shrineRoof: 0x4A5060,
  shrineRoofEdge: 0x6E7484,
  stone: 0xC4C6D4,
  stoneDark: 0x8E93A8,
  stoneLight: 0xE0E2EC,
  moss: 0x6FA83C,
  lanternStone: 0xA8ACBE,

  // ------------------------------------------------------------------ coast
  wetSand: 0xC8C79A,
  driftwood: 0xB8A88E,
  boatHull: 0xF2EDE0,
  boatHullDark: 0xC4BEB0,
  sailCloth: 0xFCF3D4,
  buoy: 0xD4513B,
  buoyBlue: 0x4FA8E8,
  foam: 0xFCF3D4,
  rockWet: 0x6E7484,

  // ------------------------------------------------------------- nature etc
  trunk: 0x9C7A50,
  trunkDark: 0x6E5238,
  leafLight: 0x8ECB5C,
  leafGreen: 0x6FA83C,
  leafAutumn: 0xE0A44E,
  leafMaple: 0xD4513B,
  grassTuft: 0x7FBF4A,
  reed: 0x8CBF5C,
  lampPost: 0x6E7484,
  lampGlass: 0xFCF3D4,
  vending: 0xD4513B,
  vendingBody: 0xF8F4EC,
  vendingBlue: 0x4FA8E8,
  utilityPole: 0xB4B8C4,
  wire: 0x4A5060,
  signPost: 0xB8A88E,
  crate: 0xDDC9A4,
  barrel: 0x8FA8BC,

  // ------------------------------------------------------------- characters
  // Skin and hair are the calmest values in the scene so the face reads.
  skin: 0xFFF6E5,
  skinShadow: 0xF7CAAC,
  hairDark: 0x4A4450,
  hairBrown: 0x9C6A44,
  hairLight: 0xE0C090,
  hairAoi: 0x8FD8F0,
  // Clothing carries the character's accent hue, one per person.
  clothBlue: 0x4FA8E8,
  clothNavy: 0x5A6484,
  clothWhite: 0xFCF3D4,
  clothCream: 0xF0E4C4,
  clothRed: 0xEC718C,
  clothYellow: 0xF5DC5E,
  clothGreen: 0x7FBF4A,
  clothPink: 0xF39CCC,
  clothGrey: 0xA8AEBE,
  apron: 0xE8E4DC,
  suitNavy: 0x4A5060,
  schoolSailor: 0x5A6484,
  ribbon: 0xEC718C,
  eye: 0x2A2320,
  eyeWhite: 0xFFFFFF
};

// Ink is used for line work and the smallest darks only. Scattering this
// through the terrain is what makes a scene read as comic rather than clean.
export const INK = 0x2A2320;

// A single geometry reused by everything. RoundedBoxGeometry is what stops the
// world reading as Minecraft; see RoundedGeometry.js.
export function createBlockGeometry() {
  return new THREE.BoxGeometry(1, 1, 1);
}

const materialCache = new Map();

// Builds the material set the world renders with.
//
// Given an AnimeMaterialFactory, every surface shares one anime-style shader
// (hue-shifted shadows, rim light, subsurface bleed). Without one it falls back
// to plain Lambert, which is what the Node-side tests use since they have no
// WebGL context at all.
export function createPaletteMaterials(factory = null) {
  if (factory) {
    const materials = new Map();
    for (const [name, hex] of Object.entries(PALETTE)) {
      // The colour has to be handed to the material explicitly: a bare
      // ShaderMaterial has no diffuseColor to read it from.
      materials.set(name, factory.get(name, { color: hex }));
    }
    return materials;
  }

  const materials = new Map();
  for (const [name, hex] of Object.entries(PALETTE)) {
    const isGlow = name.startsWith('neon') || name === 'lampGlass' || name === 'windowLit';
    materials.set(
      name,
      new THREE.MeshLambertMaterial({
        color: hex,
        emissive: isGlow ? hex : 0x000000,
        emissiveIntensity: isGlow ? 0.65 : 0,
        transparent: name === 'water' || name === 'waterShallow' || name === 'foam',
        opacity: name === 'foam' ? 0.8 : name === 'water' ? 0.85 : 1
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

  // options may carry per-box rotations (ry for yaw, rz for a roof pitch) and a
  // `shape` selecting a rounding level from RoundedGeometry.js.
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