import { ECONOMY } from '../config.js';

export const SAVE_KEY = 'spacebunnyalpha.save.v1';

// A fresh save: enough money to buy lunch, a starter tool, and an empty journal.
export function createDefaultSave() {
  return {
    version: 1,
    createdAt: Date.now(),
    playerName: 'Aoi',
    yen: ECONOMY.startingYen,
    stamina: 100,
    clock: { minutes: 7.5 * 60, day: 1 },
    position: { x: 96, y: 0, z: 96, region: 'city' },
    inventory: [
      { id: 'bento', qty: 1 },
      { id: 'seed_rice', qty: 3 }
    ],
    equipped: { tool: 'hoe', charm: null },
    skills: { cooking: 1, fishing: 1, farming: 1, foraging: 1 },
    friendship: {},
    quests: { active: [], completed: [], completedAt: {} },
    journal: { discovered: [], talkedTo: [], visitedRegions: [] },
    flags: { tutorialSeen: false, firstCatchDone: false, firstHarvestDone: false },
    stats: { daysPlayed: 1, distanceWalked: 0, fishCaught: 0, dishesCooked: 0, yenEarned: 0, yenSpent: 0 },
    weather: { current: 'clear', nextChangeMinutes: 240 }
  };
}

// Deep-merges a loaded save onto defaults so a save written by an older build
// still loads after new fields are added, instead of throwing on undefined.
function mergeDefaults(target, defaults) {
  if (Array.isArray(defaults)) return Array.isArray(target) ? target : defaults;
  if (defaults === null || typeof defaults !== 'object') return target === undefined ? defaults : target;

  const out = {};
  for (const key of Object.keys(defaults)) {
    out[key] = mergeDefaults(target?.[key], defaults[key]);
  }
  // Preserve any keys the save has that defaults do not know about yet.
  if (target && typeof target === 'object') {
    for (const key of Object.keys(target)) {
      if (!(key in out)) out[key] = target[key];
    }
  }
  return out;
}

export class SaveSystem {
  constructor({ storage = null, bus = null } = {}) {
    // Falls back to an in-memory shim so the game is playable and testable in
    // Node where localStorage does not exist.
    this.storage = storage ?? (typeof localStorage !== 'undefined' ? localStorage : new MapShim());
    this.bus = bus;
    this.data = createDefaultSave();
    this.lastError = null;
  }

  hasSave() {
    try {
      return this.storage.getItem(SAVE_KEY) !== null;
    } catch {
      return false;
    }
  }

  load() {
    try {
      const raw = this.storage.getItem(SAVE_KEY);
      if (!raw) {
        this.data = createDefaultSave();
        return false;
      }
      const parsed = JSON.parse(raw);
      this.data = mergeDefaults(parsed, createDefaultSave());
      this.bus?.emit('save:loaded', this.data);
      return true;
    } catch (error) {
      this.lastError = error;
      // A corrupt save should never block play; fall back to a clean one.
      this.data = createDefaultSave();
      return false;
    }
  }

  save() {
    try {
      this.data.updatedAt = Date.now();
      this.storage.setItem(SAVE_KEY, JSON.stringify(this.data));
      this.bus?.emit('save:written', this.data);
      return true;
    } catch (error) {
      this.lastError = error;
      return false;
    }
  }

  reset() {
    this.data = createDefaultSave();
    try {
      this.storage.removeItem(SAVE_KEY);
    } catch {
      // Ignore: a missing storage backend just means nothing was persisted.
    }
    this.bus?.emit('save:reset', this.data);
  }

  // Flat snapshot of the fields the auto-save should persist most often.
  commitRuntimeState({ clock, position, region, stamina }) {
    if (clock) {
      this.data.clock.minutes = clock.minutes;
      this.data.clock.day = clock.day;
    }
    if (position) {
      this.data.position.x = position.x;
      this.data.position.y = position.y;
      this.data.position.z = position.z;
    }
    if (region) this.data.position.region = region;
    if (typeof stamina === 'number') this.data.stamina = stamina;
  }
}

// Minimal localStorage stand-in for Node.
class MapShim {
  constructor() {
    this.map = new Map();
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  setItem(key, value) {
    this.map.set(key, String(value));
  }
  removeItem(key) {
    this.map.delete(key);
  }
}