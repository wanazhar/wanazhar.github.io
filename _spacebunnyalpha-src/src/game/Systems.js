import { ITEMS, itemCategory, isQuestItem, isTool } from '../data/items.js';
import {
  RECIPES,
  hasInputs,
  missingInputs,
  rollFish,
  rollForage,
  fishingSuccess
} from '../data/recipes.js';

// A stacked inventory. Everything the player carries lives here and every
// other system reads and writes through this one object, so the UI can just
// render `inventory.entries` without knowing where anything came from.
export class Inventory {
  constructor(initial = []) {
    this.entries = [];
    // Comfortably larger than the item table, so a full bag is the player's
    // doing rather than an artefact of the data growing.
    this.maxSlots = 40;
    for (const item of initial) this.add(item.id, item.qty);
  }

  add(id, qty = 1) {
    if (!ITEMS[id]) throw new Error(`Unknown item "${id}"`);
    const existing = this.entries.find((e) => e.id === id);
    if (existing) {
      existing.qty += qty;
      return this;
    }
    if (this.entries.length >= this.maxSlots) return this;
    this.entries.push({ id, qty });
    return this;
  }

  remove(id, qty = 1) {
    const index = this.entries.findIndex((e) => e.id === id);
    if (index === -1) return false;
    const entry = this.entries[index];
    if (entry.qty < qty) return false;
    entry.qty -= qty;
    if (entry.qty <= 0) this.entries.splice(index, 1);
    return true;
  }

  countOf(id) {
    const entry = this.entries.find((e) => e.id === id);
    return entry ? entry.qty : 0;
  }

  // Total of every item in a category, which quests use for "bring me 2 fish".
  countOfCategory(category) {
    return this.entries
      .filter((e) => itemCategory(e.id) === category)
      .reduce((sum, e) => sum + e.qty, 0);
  }

  has(id, qty = 1) {
    return this.countOf(id) >= qty;
  }

  get isFull() {
    return this.entries.length >= this.maxSlots;
  }

  // Whether the player can pick up more of a given item without making room.
  canAccept(id) {
    return this.entries.some((e) => e.id === id) || !this.isFull;
  }

  list({ sellable = true } = {}) {
    return this.entries
      .filter((e) => !isQuestItem(e.id))
      .map((e) => ({
        ...e,
        name: ITEMS[e.id].name,
        nameJa: ITEMS[e.id].nameJa,
        category: itemCategory(e.id),
        sellable
      }));
  }

  tools() {
    return this.entries.filter((e) => isTool(e.id)).map((e) => e.id);
  }

  toJSON() {
    return this.entries.map((e) => ({ id: e.id, qty: e.qty }));
  }
}

// Money. Kept separate from the inventory so a shop transaction is one atomic
// step that can never half-complete.
export class Economy {
  constructor({ bus = null, startingYen = 500 } = {}) {
    this.bus = bus;
    this.yen = startingYen;
    this.earned = 0;
    this.spent = 0;
  }

  canAfford(amount) {
    return this.yen >= amount;
  }

  buy(amount, label = 'purchase') {
    if (!this.canAfford(amount)) return { ok: false, reason: 'funds' };
    this.yen -= amount;
    this.spent += amount;
    this.bus?.emit('economy:changed', { yen: this.yen, delta: -amount, label });
    return { ok: true };
  }

  sell(amount, label = 'sale') {
    this.yen += amount;
    this.earned += amount;
    this.bus?.emit('economy:changed', { yen: this.yen, delta: amount, label });
    return { ok: true };
  }

  toJSON() {
    return { yen: this.yen, earned: this.earned, spent: this.spent };
  }
}

// Cooking and crafting. Consumes inputs, yields output, and refuses cleanly
// rather than leaving the player short of materials.
export class CraftingSystem {
  constructor({ inventory, skills, bus = null }) {
    this.inventory = inventory;
    this.skills = skills;
    this.bus = bus;
  }

  availableRecipes() {
    return RECIPES.map((recipe) => {
      const missing = missingInputs(recipe, this.inventory);
      const levelOk = (this.skills.levelOf(recipe.skill) ?? 1) >= recipe.level;
      return {
        recipe,
        canMake: levelOk && missing.length === 0,
        levelOk,
        missing
      };
    });
  }

  craft(recipeId, { station = 'home' } = {}) {
    const recipe = RECIPES.find((r) => r.id === recipeId);
    if (!recipe) return { ok: false, reason: 'unknown' };

    if ((this.skills.levelOf(recipe.skill) ?? 1) < recipe.level) {
      return { ok: false, reason: 'skill' };
    }
    if (recipe.station === 'kitchen' && station !== 'kitchen' && station !== 'home') {
      return { ok: false, reason: 'station' };
    }
    if (!hasInputs(recipe, this.inventory)) {
      return { ok: false, reason: 'inputs', missing: missingInputs(recipe, this.inventory) };
    }
    if (!this.inventory.canAccept(recipe.result)) {
      return { ok: false, reason: 'full' };
    }

    // Consume then produce, so a failure can never destroy materials.
    for (const input of recipe.inputs) this.inventory.remove(input.id, input.qty);
    this.inventory.add(recipe.result, recipe.qty);
    this.skills.grantXp(recipe.skill, 1);

    this.bus?.emit('craft:completed', { recipe, result: recipe.result });
    return { ok: true, recipe, result: recipe.result, qty: recipe.qty };
  }
}

// Skills are simple level counters. Cooking four things takes you from 1 to 2,
// which unlocks the next recipe. No percentage bars, no fail states.
export class SkillSet {
  constructor(levels = { cooking: 1, fishing: 1, farming: 1, foraging: 1 }, bus = null) {
    this.levels = { ...levels };
    this.xp = { cooking: 0, fishing: 0, farming: 0, foraging: 0 };
    this.bus = bus;
    // How much total XP each level costs. Grows slowly so it never feels grindy.
    this.threshold = (level) => 3 + (level - 1) * 3;
  }

  levelOf(skill) {
    return this.levels[skill] ?? 1;
  }

  grantXp(skill, amount) {
    if (!(skill in this.xp)) return null;
    this.xp[skill] += amount;
    let levelled = false;

    while (this.xp[skill] >= this.threshold(this.levels[skill])) {
      this.xp[skill] -= this.threshold(this.levels[skill]);
      this.levels[skill] += 1;
      levelled = true;
    }

    if (levelled) this.bus?.emit('skill:levelled', { skill, level: this.levels[skill] });
    return { levelled, level: this.levels[skill] };
  }

  toJSON() {
    return { levels: { ...this.levels }, xp: { ...this.xp } };
  }
}

// Fishing, foraging and farming all funnel through here so the stamina cost
// and the "did it succeed" roll live in exactly one place.
export class ActivitySystem {
  constructor({ inventory, skills, bus = null, rng = Math.random }) {
    this.inventory = inventory;
    this.skills = skills;
    this.bus = bus;
    this.rng = rng;
  }

  fish(hour) {
    if (!fishingSuccess(this.skills.levelOf('fishing'), this.rng)) {
      this.skills.grantXp('fishing', 1);
      return { ok: true, caught: null, xp: 1 };
    }

    const entry = rollFish(hour, this.rng);
    this.inventory.add(entry.id, 1);
    this.skills.grantXp('fishing', 2);
    this.bus?.emit('activity:caught', { item: entry.id });
    return { ok: true, caught: entry.id, xp: 2 };
  }

  forage(region) {
    const entry = rollForage(region, this.rng);
    this.inventory.add(entry.id, 1);
    this.skills.grantXp('foraging', 1);
    this.bus?.emit('activity:foraged', { item: entry.id });
    return { ok: true, found: entry.id };
  }

  harvest() {
    const entry = rollForage('rural', this.rng);
    this.inventory.add(entry.id, 1);
    this.skills.grantXp('farming', 2);
    this.bus?.emit('activity:harvested', { item: entry.id });
    return { ok: true, found: entry.id };
  }
}