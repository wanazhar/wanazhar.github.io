import { WORLD } from '../config.js';
import { heightAt } from './Terrain.js';

// Buildings, fences and cliffs all block the player. Rather than store an
// exact mesh, we keep a coarse grid of blocked cells derived from the same
// layout data the visuals are built from, so collision and visuals can never
// drift apart.

const CELL = 1;

export class CollisionGrid {
  constructor(size = WORLD.size) {
    this.size = size;
    this.blocked = new Set();
    // Top height of solid geometry per column, used by the camera to avoid
    // ending up inside a roof or an upper storey. A 2D footprint alone cannot
    // express "the wall here is 3 blocks tall", so the camera needs this.
    this.tops = new Map();
  }

  key(x, z) {
    return z * this.size + x;
  }

  inBounds(x, z) {
    return x >= 0 && z >= 0 && x < this.size && z < this.size;
  }

  addBox(x0, z0, w, d, topY = 0) {
    const ix0 = Math.floor(x0);
    const iz0 = Math.floor(z0);
    const ix1 = Math.floor(x0 + w);
    const iz1 = Math.floor(z0 + d);
    for (let x = ix0; x < ix1; x += 1) {
      for (let z = iz0; z < iz1; z += 1) {
        if (!this.inBounds(x, z)) continue;
        this.blocked.add(this.key(x, z));
        if (topY > 0) {
          const k = this.key(x, z);
          const current = this.tops.get(k);
          if (current === undefined || topY > current) this.tops.set(k, topY);
        }
      }
    }
  }

  // Marks a footprint as blocking, inflated by a radius so the player stops
  // slightly before touching the wall. `height` lets the camera know how tall
  // the structure is.
  addFootprint(lot, inflate = 0.4, height = 0) {
    this.addBox(lot.x - inflate, lot.z - inflate, lot.w + inflate * 2, lot.d + inflate * 2, height);
  }

  isBlocked(x, z) {
    return this.blocked.has(this.key(Math.floor(x), Math.floor(z)));
  }

  // True when a world-space point sits inside solid geometry. Used by the
  // camera so it never renders from inside a roof.
  isSolidAt(x, y, z) {
    const ix = Math.floor(x);
    const iz = Math.floor(z);
    if (!this.blocked.has(this.key(ix, iz))) return false;
    const top = this.tops.get(this.key(ix, iz));
    // Without a recorded height, treat the column as tall enough to matter.
    if (top === undefined) return true;
    return y < top;
  }

  clear() {
    this.blocked.clear();
  }

  get count() {
    return this.blocked.size;
  }
}

// Builds the full collision grid for the island. Called once at load, since
// the world is static.
export function buildCollisionGrid({ lots, houses, coastHouses, describeCityLot, describeHouse, landmarks }) {
  const grid = new CollisionGrid();

  for (const lot of lots ?? []) {
    if (lot.kind === 'lotus') continue; // parks are walkable
    // Record how tall the building is so the camera can stay outside its roof.
    const spec = describeCityLot ? describeCityLot(lot) : null;
    const top = spec ? heightAt(lot.x + lot.w / 2, lot.z + lot.d / 2) + spec.height + 1.5 : 0;
    grid.addFootprint(lot, 0.4, top);
  }

  for (const house of houses ?? []) {
    // Suburban houses are two storeys at most, plus the stepped gable.
    const spec = describeHouse ? describeHouse(house) : null;
    const storeys = spec?.twoStorey ? 6 : 4;
    const top = heightAt(house.x + 5, house.z + 4) + storeys + 2.5;
    grid.addFootprint(house, 0.5, top);
  }

  for (const house of coastHouses ?? []) {
    const top = heightAt(house.x + 4, house.z + 4) + 1.2 + 4 + 2.5;
    grid.addFootprint(house, 0.5, top);
  }

  // Landmarks: the shrine hall, konbini, school, station, barn. These are drawn
  // as loose stacks of boxes rather than as lots, so nothing else would put
  // them in the grid, and the camera would then sit inside them.
  for (const box of landmarks ?? []) {
    const base = heightAt(box.x + box.w / 2, box.z + box.d / 2);
    grid.addBox(box.x, box.z, box.w, box.d, base + box.height);
  }

  // Cliffs: any column with a big height difference on one side is a wall.
  for (let x = 1; x < WORLD.size - 1; x += 1) {
    for (let z = 1; z < WORLD.size - 1; z += 1) {
      const h = heightAt(x, z);
      if (h < WORLD.seaLevel) continue;
      const stepX = Math.abs(heightAt(x + 1, z) - h);
      const stepZ = Math.abs(heightAt(x, z + 1) - h);
      // A 3-block drop in one block is a cliff the player should not climb.
      if (stepX >= 3 || stepZ >= 3) {
        grid.blocked.add(grid.key(x, z));
        // A cliff is as tall as the ground it sits on, so the camera stays out
        // of the rock rather than clipping through it.
        grid.tops.set(grid.key(x, z), h + 2);
      }
    }
  }

  return grid;
}