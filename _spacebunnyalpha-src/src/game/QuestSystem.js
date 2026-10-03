import { QUESTS, questById, questsFrom } from '../data/quests.js';
import { npcById, friendshipGain, friendshipTier, chooseLine } from '../data/npcs.js';
import { itemCategory } from '../data/items.js';

// Tracks quests, friendship and who you have met. All of it lives in the save
// file, so a conversation with Mimi in the city is still remembered when you
// come back from the coast three in-game days later.
export class QuestSystem {
  constructor({ save, inventory, economy, bus = null }) {
    this.save = save;
    this.inventory = inventory;
    this.economy = economy;
    this.bus = bus;
    this.active = new Set(save.data.quests.active);
    this.completed = new Set(save.data.quests.completed);
    // Persisted as a plain object because JSON has no map type.
    this.completedAt = new Map(Object.entries(save.data.quests.completedAt ?? {}));
    this.talkedTo = new Set(save.data.journal.talkedTo);
    this.friendship = { ...save.data.friendship };
    this.visitedRegions = new Set(save.data.journal.visitedRegions ?? []);
  }

  // Which quests an NPC is currently offering.
  offersFor(npcId, currentMinutes) {
    return questsFrom(npcId).filter((quest) => this.canOffer(quest, currentMinutes));
  }

  canOffer(quest, currentMinutes) {
    if (this.completed.has(quest.id) && !quest.repeatable) return false;
    if (!this.completed.has(quest.id) && this.active.has(quest.id)) return false;

    if (quest.repeatable && this.completed.has(quest.id)) {
      const doneAt = this.completedAt.get(quest.id);
      // A repeatable quest is off the books until its cooldown expires.
      if (doneAt !== undefined) {
        const elapsed = currentMinutes - doneAt;
        if (elapsed >= 0 && elapsed < quest.cooldownMinutes) return false;
      }
    }
    return true;
  }

  accept(questId, currentMinutes) {
    const quest = questById(questId);
    if (!quest) return { ok: false, reason: 'unknown' };
    if (!this.canOffer(quest, currentMinutes)) return { ok: false, reason: 'unavailable' };

    this.active.add(questId);
    this.save.data.quests.active = [...this.active];
    this.bus?.emit('quest:accepted', { quest });
    return { ok: true, quest };
  }

  // Progress on each objective, so the journal can show partial credit.
  objectiveProgress(objective) {
    if (objective.type === 'haveItem') {
      const have =
        objective.item != null
          ? this.inventory.countOf(objective.item)
          : this.inventory.countOfCategory(objective.category);
      return Math.min(have, objective.count);
    }
    if (objective.type === 'visitRegion') {
      return this.visitedRegions.has(objective.region) ? objective.count : 0;
    }
    if (objective.type === 'talkedTo') {
      return this.talkedTo.has(objective.npc) ? objective.count : 0;
    }
    return 0;
  }

  isComplete(quest) {
    return quest.objectives.every((o) => this.objectiveProgress(o) >= o.count);
  }

  questStatus(questId) {
    const quest = questById(questId);
    if (!quest) return null;
    const objectives = quest.objectives.map((o) => ({
      ...o,
      progress: this.objectiveProgress(o),
      done: this.objectiveProgress(o) >= o.count
    }));
    return {
      quest,
      objectives,
      complete: objectives.every((o) => o.done),
      active: this.active.has(questId),
      completed: this.completed.has(questId)
    };
  }

  // Checks every active quest and turns in anything now finished.
  evaluate(currentMinutes) {
    const finished = [];

    for (const questId of [...this.active]) {
      const quest = questById(questId);
      if (!quest || !this.isComplete(quest)) continue;

      this.active.delete(questId);
      this.completed.add(questId);
      this.completedAt.set(questId, currentMinutes);
      this.consumeQuestItems(quest);
      this.grantRewards(quest);
      finished.push(quest);
      this.bus?.emit('quest:completed', { quest });
    }

    this.persist();
    return finished;
  }

  grantRewards(quest) {
    const rewards = quest.rewards ?? {};
    if (rewards.yen) this.economy.sell(rewards.yen, `quest:${quest.id}`);
    if (rewards.items) {
      for (const entry of rewards.items) this.inventory.add(entry.id, entry.qty);
    }
    if (rewards.friendship) {
      for (const [npcId, amount] of Object.entries(rewards.friendship)) {
        this.addFriendship(npcId, amount);
      }
    }
  }

  // Quest items are handed over on completion so they do not clutter the bag.
  consumeQuestItems(quest) {
    for (const objective of quest.objectives) {
      if (objective.type === 'haveItem' && objective.item) {
        const have = this.inventory.countOf(objective.item);
        if (have > 0 && itemCategory(objective.item) === 'quest') {
          this.inventory.remove(objective.item, have);
        }
      }
    }
  }

  // Registers a conversation: meets the NPC, nudges friendship, checks quests.
  talkTo(npcId, currentMinutes) {
    const npc = npcById(npcId);
    if (!npc) return null;

    const firstMeeting = !this.talkedTo.has(npcId);
    this.talkedTo.add(npcId);

    if (!firstMeeting) this.addFriendship(npcId, friendshipGain('talk'));

    const friendship = this.friendship[npcId] ?? 0;
    this.bus?.emit('npc:talked', { npcId, firstMeeting, friendship });

    return {
      npc,
      firstMeeting,
      friendship,
      tier: friendshipTier(friendship),
      line: chooseLine(npc, { phase: null, weather: null, friendship, firstMeeting })
    };
  }

  addFriendship(npcId, amount) {
    this.friendship[npcId] = (this.friendship[npcId] ?? 0) + amount;
    this.save.data.friendship = this.friendship;
  }

  visitRegion(region) {
    if (this.visitedRegions.has(region)) return false;
    this.visitedRegions.add(region);
    this.save.data.journal.visitedRegions = [...this.visitedRegions];
    return true;
  }

  persist() {
    this.save.data.quests.active = [...this.active];
    this.save.data.quests.completed = [...this.completed];
    this.save.data.quests.completedAt = Object.fromEntries(this.completedAt);
    this.save.data.journal.talkedTo = [...this.talkedTo];
    this.save.data.journal.visitedRegions = [...this.visitedRegions];
    this.save.data.friendship = this.friendship;
  }

  // Everything the journal screen needs, in one call.
  journal() {
    return {
      active: [...this.active].map((id) => this.questStatus(id)).filter(Boolean),
      completed: [...this.completed],
      talkedTo: [...this.talkedTo],
      friendship: { ...this.friendship },
      visitedRegions: [...this.visitedRegions]
    };
  }
}