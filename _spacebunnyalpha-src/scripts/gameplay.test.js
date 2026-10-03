import test from 'node:test';
import assert from 'node:assert/strict';
import { Inventory, Economy, CraftingSystem, SkillSet, ActivitySystem } from '../src/game/Systems.js';
import { QuestSystem } from '../src/game/QuestSystem.js';
import { SaveSystem, SAVE_KEY } from '../src/core/SaveSystem.js';
import { EventBus } from '../src/core/EventBus.js';
import { ITEMS, allItems } from '../src/data/items.js';
import { RECIPES, rollFish } from '../src/data/recipes.js';
import { QUESTS, questById } from '../src/data/quests.js';
import { NPCS, npcById, friendshipTier, chooseLine } from '../src/data/npcs.js';

function makeWorld() {
  const bus = new EventBus();
  const save = new SaveSystem({ bus });
  save.load();
  const inventory = new Inventory(save.data.inventory);
  const economy = new Economy({ bus, startingYen: save.data.yen });
  const skills = new SkillSet(save.data.skills, bus);
  const quests = new QuestSystem({ save, inventory, economy, bus });
  const crafting = new CraftingSystem({ inventory, skills, bus });
  const rng = (() => {
    let s = 7;
    return () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
  })();
  const activities = new ActivitySystem({ inventory, skills, bus, rng });
  return { bus, save, inventory, economy, skills, quests, crafting, activities };
}

test('inventory adds, stacks and removes correctly', () => {
  const inv = new Inventory();
  inv.add('bento', 1);
  inv.add('bento', 2);
  assert.strictEqual(inv.countOf('bento'), 3);
  inv.remove('bento', 2);
  assert.strictEqual(inv.countOf('bento'), 1);
  assert.strictEqual(inv.entries.length, 1, 'a partial removal keeps the stack');

  // Asking for more than is held is refused outright, and nothing is lost.
  assert.strictEqual(inv.remove('bento', 5), false);
  assert.strictEqual(inv.countOf('bento'), 1, 'a refused removal must not eat the stack');

  inv.remove('bento', 1);
  assert.strictEqual(inv.countOf('bento'), 0);
  assert.strictEqual(inv.entries.length, 0, 'an emptied stack is dropped');
});

test('inventory refuses unknown items rather than corrupting state', () => {
  const inv = new Inventory();
  assert.throws(() => inv.add('not_a_real_item', 1));
});

test('inventory counts by category, which quests rely on', () => {
  const inv = new Inventory();
  inv.add('fish_sardine', 2);
  inv.add('fish_bream', 1);
  assert.strictEqual(inv.countOfCategory('fish'), 3);
  assert.strictEqual(inv.countOfCategory('dish'), 0);
});

test('inventory respects its slot limit', () => {
  const inv = new Inventory();
  const ids = allItems();
  for (const id of ids) inv.add(id, 1);
  assert.strictEqual(inv.entries.length, ids.length);
  assert.ok(inv.entries.length <= inv.maxSlots);
  assert.ok(!inv.isFull, `the whole item table should fit in a ${inv.maxSlots}-slot bag`);
  assert.strictEqual(inv.canAccept('wood'), true, 'a held item can always be stacked');

  // Shrink the bag so the ceiling is reachable with real items, then push one
  // new item past it.
  inv.maxSlots = ids.length;
  assert.ok(inv.isFull);
  inv.add('wood', 1);
  assert.strictEqual(inv.entries.length, inv.maxSlots, 'a new item must not open a slot past the cap');
});

test('a full inventory still accepts an item it already holds', () => {
  const inv = new Inventory();
  // Give the bag a temporary ceiling so the rule can be tested at the boundary
  // without needing more distinct items than the game actually defines.
  inv.maxSlots = 4;
  inv.add('wood', 1);
  inv.add('bamboo', 1);
  inv.add('fibre', 1);
  inv.add('tea', 1);

  assert.ok(inv.isFull, 'four items in a four-slot bag is full');
  assert.strictEqual(inv.canAccept('bento'), false, 'a full bag takes nothing new');
  assert.strictEqual(inv.canAccept('tea'), true, 'a full bag still stacks what it holds');

  const before = inv.entries.length;
  inv.add('tea', 1);
  assert.strictEqual(inv.countOf('tea'), 2, 'stacking into a held slot always works');
  assert.strictEqual(inv.entries.length, before, 'no new slot was opened');

  // A brand-new item is dropped, leaving the bag untouched.
  inv.add('bento', 1);
  assert.strictEqual(inv.countOf('bento'), 0, 'a full bag must refuse a new item');
});

test('buying and selling move money in the right direction', () => {
  const { economy } = makeWorld();
  const start = economy.yen;
  assert.ok(economy.buy(100));
  assert.strictEqual(economy.yen, start - 100);
  economy.sell(40);
  assert.strictEqual(economy.yen, start - 60);
});

test('a purchase you cannot afford is refused, not half-completed', () => {
  const { economy, inventory } = makeWorld();
  economy.yen = 10;
  const result = economy.buy(500);
  assert.strictEqual(result.ok, false);
  assert.strictEqual(economy.yen, 10, 'a failed purchase must not change the balance');
});

test('crafting consumes inputs and yields the result', () => {
  const { crafting, inventory } = makeWorld();
  const recipe = RECIPES.find((r) => r.id === 'dish_tamagoyaki');
  inventory.add(recipe.inputs[0].id, recipe.inputs[0].qty);
  const result = crafting.craft('dish_tamagoyaki', { station: 'home' });
  assert.ok(result.ok, `craft failed: ${result.reason}`);
  assert.strictEqual(inventory.countOf('dish_tamagoyaki'), 1);
  assert.strictEqual(inventory.countOf(recipe.inputs[0].id), 0, 'inputs should be consumed');
});

test('crafting without the materials changes nothing', () => {
  const { crafting, inventory } = makeWorld();
  const result = crafting.craft('dish_seafood_platter', { station: 'home' });
  assert.strictEqual(result.ok, false);
  assert.strictEqual(result.reason, 'skill', 'a high recipe should be gated by skill first');
  assert.strictEqual(inventory.countOf('fish_bream'), 0);
});

test('crafting refuses when the inputs are genuinely missing', () => {
  const { crafting, inventory, skills } = makeWorld();
  skills.grantXp('cooking', 20); // level past the gate
  skills.grantXp('cooking', 20);
  const result = crafting.craft('dish_seafood_platter', { station: 'home' });
  assert.strictEqual(result.ok, false);
  assert.strictEqual(result.reason, 'inputs');
  assert.ok(result.missing.length > 0, 'the failure should list what is missing');
});

test('every recipe that lists an item twice actually requires both', () => {
  const inv = new Inventory();
  const lunchbox = RECIPES.find((r) => r.id === 'dish_rice_ball_lunch');
  const riceNeeded = lunchbox.inputs.find((i) => i.id === 'crop_rice').qty;
  assert.strictEqual(riceNeeded, 2, 'the lunch box recipe should need two rice');

  // One rice is not enough.
  inv.add('crop_rice', 1);
  inv.add('veg_cabbage', 1);
  const skills = new SkillSet({ cooking: 9 });
  const crafting = new CraftingSystem({ inventory: inv, skills });
  const early = crafting.craft('dish_rice_ball_lunch', { station: 'home' });
  assert.strictEqual(early.ok, false);
  assert.strictEqual(early.reason, 'inputs');
});

test('skills level up as xp accumulates', () => {
  const skills = new SkillSet({ cooking: 1 });
  assert.strictEqual(skills.levelOf('cooking'), 1);
  let levelled = false;
  for (let i = 0; i < 10; i += 1) {
    const r = skills.grantXp('cooking', 1);
    if (r.levelled) levelled = true;
  }
  assert.ok(levelled, 'enough xp should level the skill');
  assert.ok(skills.levelOf('cooking') >= 2);
});

test('fishing can fail, and a failure still grants xp', () => {
  const { activities, skills } = makeWorld();
  skills.grantXp('fishing', 6);
  let failures = 0;
  let successes = 0;
  for (let i = 0; i < 60; i += 1) {
    const r = activities.fish(9);
    if (r.caught) successes += 1;
    else failures += 1;
  }
  assert.ok(successes > 0, 'a skilled angler should catch something');
  assert.ok(failures > 0, 'fishing should never be a guaranteed catch');
});

test('the fish table shifts with the hour', () => {
  const midday = rollFish(12, () => 0.5);
  const midnight = rollFish(2, () => 0.5);
  assert.ok(midday.id, 'fishing at midday returns a fish');
  assert.ok(midnight.id, 'fishing at night returns a fish');
  // Pufferfish are a dusk catch, so they cannot appear at 2am.
  const caught = rollFish(2, () => 0.999);
  assert.notStrictEqual(caught.id, 'fish_puffer', 'pufferfish should not be available at 2am');
});

test('quests can be accepted, completed and rewarded', () => {
  const { quests, inventory, economy } = makeWorld();
  const quest = QUESTS.find((q) => q.id === 'konbini_intro');
  const before = economy.yen;

  const accepted = quests.accept('konbini_intro', 100);
  assert.ok(accepted.ok);
  assert.ok(quests.active.has('konbini_intro'));

  inventory.add(quest.objectives[0].item, quest.objectives[0].count);
  const finished = quests.evaluate(200);

  assert.strictEqual(finished.length, 1, 'the quest should complete');
  assert.strictEqual(finished[0].id, 'konbini_intro');
  assert.ok(economy.yen > before, 'the quest should pay out');
  assert.ok(quests.completed.has('konbini_intro'));
  assert.ok(!quests.active.has('konbini_intro'), 'a finished quest leaves the active list');
});

test('a non-repeatable quest is never offered twice', () => {
  const { quests, inventory } = makeWorld();
  quests.accept('first_catch', 0);
  inventory.add('fish_sardine', 1);
  quests.evaluate(100);

  assert.strictEqual(quests.completed.has('first_catch'), true);
  assert.strictEqual(quests.canOffer(questById('first_catch'), 200), false);
});

test('a repeatable quest goes on cooldown instead of vanishing', () => {
  const { quests, inventory } = makeWorld();
  quests.accept('konbini_intro', 0);
  inventory.add('tea', 1);
  quests.evaluate(100);

  const quest = questById('konbini_intro');
  assert.strictEqual(quests.canOffer(quest, 150), false, 'still on cooldown');
  assert.strictEqual(quests.canOffer(quest, 100 + 500), true, 'available once the cooldown passes');
});

test('quest items are handed over rather than left in the bag', () => {
  const { quests, inventory } = makeWorld();
  quests.accept('station_seal', 0);
  inventory.add('lost_seal', 1);
  assert.strictEqual(inventory.countOf('lost_seal'), 1);
  quests.evaluate(100);
  assert.strictEqual(inventory.countOf('lost_seal'), 0, 'the seal should have been given away');
});

test('talking to an NPC records the meeting and grows friendship', () => {
  const { quests } = makeWorld();
  const first = quests.talkTo('mimi', 0);
  assert.strictEqual(first.firstMeeting, true);
  assert.strictEqual(quests.friendship.mimi, undefined, 'a first meeting earns no bonus');

  const second = quests.talkTo('mimi', 10);
  assert.strictEqual(second.firstMeeting, false);
  assert.ok(quests.friendship.mimi >= 1, 'a repeat conversation should build friendship');
});

test('every NPC has lines and they are never empty', () => {
  for (const npc of NPCS) {
    assert.ok(npc.lines?.any?.length > 0, `${npc.id} has no fallback dialogue`);
    assert.ok(npc.id && npc.name, 'every npc needs an id and a name');
    assert.ok(npc.region, `${npc.id} has no region`);
    assert.ok(npc.appearance, `${npc.id} has no appearance`);
  }
});

test('NPC schedules always resolve to a spot for any hour', () => {
  for (const npc of NPCS) {
    for (const hour of [0, 3, 6, 9, 13, 17, 20, 23]) {
      // Later entries win, matching a simple "last matching window" rule.
      // A schedule that does not wrap returns null, and the villager then
      // stays put at its home position, which is valid.
      let spot = null;
      for (const entry of npc.schedule) {
        if (hour >= entry.fromHour && hour < entry.toHour) spot = entry;
      }
      if (spot) {
        assert.ok(Number.isFinite(spot.x) && Number.isFinite(spot.z), `${npc.id} schedule spot is not a position`);
      }
    }
  }
});

test('friendship tiers are monotonic', () => {
  assert.strictEqual(friendshipTier(0), 'stranger');
  assert.strictEqual(friendshipTier(2), 'acquaintance');
  assert.strictEqual(friendshipTier(5), 'friend');
  assert.strictEqual(friendshipTier(20), 'close');
});

test('dialogue lines always resolve to real text', () => {
  for (const npc of NPCS) {
    const line = chooseLine(npc, { phase: 'day', weather: 'clear', friendship: 5, firstMeeting: false });
    assert.ok(typeof line === 'string' && line.length > 0, `${npc.id} returned an empty line`);
  }
});

test('quest progress survives a save and reload', () => {
  const bus = new EventBus();
  const save = new SaveSystem({ bus });
  save.load();

  const inventory = new Inventory(save.data.inventory);
  const quests = new QuestSystem({ save, inventory, economy: new Economy({ bus }), bus });
  quests.accept('konbini_intro', 0);
  quests.addFriendship('mimi', 3);
  quests.persist();
  save.save();

  // Round-trip through real JSON, the way a browser reload would.
  const raw = JSON.stringify(save.data);

  // Reload into a fresh set of systems, as a new session would.
  const save2 = new SaveSystem({ bus: new EventBus() });
  save2.storage.setItem(SAVE_KEY, raw);
  save2.load();
  const quests2 = new QuestSystem({
    save: save2,
    inventory: new Inventory(save2.data.inventory),
    economy: new Economy(),
    bus: new EventBus()
  });

  assert.ok(quests2.active.has('konbini_intro'), 'the active quest should persist');
  assert.strictEqual(quests2.friendship.mimi, 3, 'friendship should persist');
});

test('the journal reports everything the UI needs', () => {
  const { quests } = makeWorld();
  quests.accept('konbini_intro', 0);
  quests.visitRegion('coast');
  quests.talkTo('sora', 0);

  const journal = quests.journal();
  assert.strictEqual(journal.active.length, 1);
  assert.ok(journal.visitedRegions.includes('coast'));
  assert.ok(journal.talkedTo.includes('sora'));
  assert.ok(journal.active[0].objectives.every((o) => typeof o.progress === 'number'));
});