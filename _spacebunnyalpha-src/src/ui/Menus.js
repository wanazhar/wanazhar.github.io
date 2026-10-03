import { Panel, el } from './HUD.js';
import { ITEMS } from '../data/items.js';
import { NPCS, npcById, friendshipTier } from '../data/npcs.js';
import { REGIONS, REGION_ORDER, WORLD } from '../config.js';
import { heightAt } from '../world/Terrain.js';

const TIER_LABEL = {
  stranger: 'Stranger',
  acquaintance: 'Acquaintance',
  friend: 'Friend',
  close: 'Close'
};

// The journal: active quests, who you know, and what you have discovered.
export function openJournal(root, { quests, save }, onClose) {
  const panel = new Panel(root, { title: 'Journal', onClose, wide: true });
  const data = quests.journal();

  const tabs = el('div', 'tabs');
  const content = el('div', 'journal-content');

  const renderQuests = () => {
    content.replaceChildren();
    if (data.active.length === 0) {
      content.appendChild(el('p', 'muted', 'Nothing pressing. Walk around and someone will ask you for something.'));
      return;
    }
    for (const entry of data.active) {
      const card = el('article', 'quest-card');
      card.appendChild(el('h3', 'quest-title', entry.quest.title));
      card.appendChild(el('p', 'quest-summary', entry.quest.summary));
      const list = el('ul', 'quest-objectives');
      for (const objective of entry.objectives) {
        const item = el('li', objective.done ? 'is-done' : '');
        item.appendChild(el('span', 'quest-mark', objective.done ? '✓' : '○'));
        item.appendChild(el('span', '', describeObjective(objective)));
        item.appendChild(el('span', 'quest-count', `${objective.progress}/${objective.count}`));
        list.appendChild(item);
      }
      card.appendChild(list);
      content.appendChild(card);
    }
  };

  const renderPeople = () => {
    content.replaceChildren();
    const known = NPCS.filter((n) => data.talkedTo.includes(n.id));
    if (known.length === 0) {
      content.appendChild(el('p', 'muted', 'You have not met anyone yet. Try the konbini.'));
      return;
    }
    for (const npc of known) {
      const friendship = data.friendship[npc.id] ?? 0;
      const card = el('article', 'person-card');
      const header = el('header', 'person-header');
      header.appendChild(el('h3', 'person-name', npc.name));
      header.appendChild(el('span', 'person-role', npc.role));
      card.appendChild(header);

      const bar = el('div', 'friendship-bar');
      const fill = el('div', 'friendship-fill');
      // Ten hearts is the practical ceiling, so the bar fills visibly over time.
      fill.style.width = `${Math.min(100, (friendship / 10) * 100)}%`;
      bar.appendChild(fill);
      card.appendChild(bar);
      card.appendChild(el('p', 'person-tier', `${TIER_LABEL[friendshipTier(friendship)]} · ${REGIONS[npc.region]?.label ?? ''}`));
      content.appendChild(card);
    }
  };

  const renderRegions = () => {
    content.replaceChildren();
    for (const id of REGION_ORDER) {
      const region = REGIONS[id];
      const visited = data.visitedRegions.includes(id);
      const card = el('article', `region-card${visited ? '' : ' is-locked'}`);
      card.appendChild(el('h3', 'person-name', visited ? region.label : '???'));
      card.appendChild(el('p', 'quest-summary', visited ? region.blurb : 'You have not been here yet.'));
      content.appendChild(card);
    }
  };

  for (const [key, label, render] of [
    ['quests', 'Quests', renderQuests],
    ['people', 'People', renderPeople],
    ['regions', 'Regions', renderRegions]
  ]) {
    const button = el('button', 'tab', label);
    button.type = 'button';
    button.addEventListener('click', () => {
      tabs.querySelectorAll('.tab').forEach((t) => t.classList.remove('is-active'));
      button.classList.add('is-active');
      render();
    });
    tabs.appendChild(button);
  }
  tabs.querySelector('.tab').classList.add('is-active');
  renderQuests();

  panel.body.append(tabs, content);
  return panel;
}

function describeObjective(objective) {
  if (objective.type === 'haveItem') {
    const what = objective.item ? ITEMS[objective.item]?.name ?? objective.item : objective.category;
    return `Bring ${objective.count} ${what}`;
  }
  if (objective.type === 'visitRegion') return `Visit ${REGIONS[objective.region]?.label ?? objective.region}`;
  if (objective.type === 'talkedTo') return `Talk to ${npcById(objective.npc)?.name ?? objective.npc}`;
  return objective.type;
}

// The bag. Simple list with a sell action, because a shop sells back to you.
export function openInventory(root, { inventory, economy }, onClose) {
  const panel = new Panel(root, { title: 'Bag', onClose });
  const list = el('div', 'item-list');

  const render = () => {
    list.replaceChildren();
    const entries = inventory.entries;
    if (entries.length === 0) {
      list.appendChild(el('p', 'muted', 'Your bag is empty.'));
      return;
    }

    for (const entry of entries) {
      const item = ITEMS[entry.id];
      const row = el('div', 'item-row');
      const main = el('div', 'item-main');
      main.appendChild(el('span', 'item-name', item?.name ?? entry.id));
      main.appendChild(el('span', 'item-qty', `×${entry.qty}`));
      row.appendChild(main);

      const sellable = (item?.sell ?? 0) > 0;
      if (sellable) {
        const sell = el('button', 'item-action', `Sell ¥${item.sell}`);
        sell.type = 'button';
        sell.addEventListener('click', () => {
          inventory.remove(entry.id, 1);
          economy.sell(item.sell, `sell:${entry.id}`);
          render();
        });
        row.appendChild(sell);
      }
      list.appendChild(row);
    }
  };

  render();
  panel.body.appendChild(list);
  return panel;
}

// The shop. Buying and selling in one screen, the way a konbini works.
export function openShop(root, { inventory, economy, stock }, onClose) {
  const panel = new Panel(root, { title: 'Shop', onClose, wide: true });
  const columns = el('div', 'shop-columns');

  const render = () => {
    columns.replaceChildren();

    const buyCol = el('section', 'shop-column');
    buyCol.appendChild(el('h3', 'shop-heading', 'For sale'));
    const buyList = el('div', 'item-list');
    for (const id of stock) {
      const item = ITEMS[id];
      if (!item) continue;
      const row = el('div', 'item-row');
      const main = el('div', 'item-main');
      main.appendChild(el('span', 'item-name', item.name));
      main.appendChild(el('span', 'item-qty', item.nameJa));
      row.appendChild(main);

      const button = el('button', 'item-action', `¥${item.price}`);
      button.type = 'button';
      button.disabled = !economy.canAfford(item.price) || !inventory.canAccept(id);
      button.addEventListener('click', () => {
        // Spend and stock together: if the purchase fails, nothing changes.
        if (!economy.buy(item.price, `buy:${id}`)) return;
        inventory.add(id, 1);
        render();
      });
      row.appendChild(button);
      buyList.appendChild(row);
    }
    buyCol.appendChild(buyList);

    const sellCol = el('section', 'shop-column');
    sellCol.appendChild(el('h3', 'shop-heading', 'Sell'));
    const sellList = el('div', 'item-list');
    const sellable = inventory.entries.filter((e) => (ITEMS[e.id]?.sell ?? 0) > 0);
    if (sellable.length === 0) {
      sellList.appendChild(el('p', 'muted', 'Nothing to sell.'));
    }
    for (const entry of sellable) {
      const item = ITEMS[entry.id];
      const row = el('div', 'item-row');
      const main = el('div', 'item-main');
      main.appendChild(el('span', 'item-name', item.name));
      main.appendChild(el('span', 'item-qty', `×${entry.qty}`));
      row.appendChild(main);

      const button = el('button', 'item-action', `Sell ¥${item.sell}`);
      button.type = 'button';
      button.addEventListener('click', () => {
        inventory.remove(entry.id, 1);
        economy.sell(item.sell, `sell:${entry.id}`);
        render();
      });
      row.appendChild(button);
      sellList.appendChild(row);
    }
    sellCol.appendChild(sellList);

    const wallet = el('p', 'shop-wallet', `You have ¥${economy.yen.toLocaleString('en-US')}`);
    columns.append(buyCol, sellCol);
    panel.body.append(wallet, columns);
  };

  render();
  return panel;
}

// Cooking and crafting. Shows what you can make right now and why not.
export function openCrafting(root, { crafting, skills }, onClose) {
  const panel = new Panel(root, { title: 'Cooking & Crafting', onClose, wide: true });
  const list = el('div', 'item-list');
  const skillRow = el('p', 'shop-wallet');
  const render = () => {
    skillRow.textContent = Object.entries(skills.levels)
      .map(([skill, level]) => `${skill} ${level}`)
      .join(' · ');

    list.replaceChildren();
    for (const entry of crafting.availableRecipes()) {
      const row = el('div', 'item-row');
      const main = el('div', 'item-main');
      main.appendChild(el('span', 'item-name', ITEMS[entry.recipe.result]?.name ?? entry.recipe.result));
      const inputs = entry.recipe.inputs
        .map((i) => `${ITEMS[i.id]?.name ?? i.id} ×${i.qty}`)
        .join(' + ');
      main.appendChild(el('span', 'item-qty', `${inputs} · ${entry.recipe.minutes} min`));
      row.appendChild(main);

      const button = el('button', 'item-action', entry.canMake ? 'Cook' : blockedReason(entry));
      button.type = 'button';
      button.disabled = !entry.canMake;
      button.addEventListener('click', () => {
        const result = crafting.craft(entry.recipe.id, { station: 'home' });
        if (result.ok) render();
      });
      row.appendChild(button);
      list.appendChild(row);
    }
  };

  render();
  panel.body.append(skillRow, list);
  return panel;
}

function blockedReason(entry) {
  if (!entry.levelOk) return `Lv ${entry.recipe.level}`;
  return entry.missing.map((m) => `${ITEMS[m.id]?.name ?? m.id} ×${m.need}`).join(', ');
}

// The map. A schematic of the island, drawn as an inline SVG grid.
export function openMap(root, { playerPos, onClose }) {
  const panel = new Panel(root, { title: 'Island Map', onClose, wide: true });
  const wrap = el('div', 'map-wrap');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('class', 'map-svg');

  const cell = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  // A coarse land/sea map sampled straight from the terrain.
  for (let x = 0; x < 100; x += 1) {
    for (let y = 0; y < 100; y += 1) {
      const worldX = Math.floor((x / 100) * WORLD.size);
      const worldZ = Math.floor((y / 100) * WORLD.size);
      const h = heightAt(worldX, worldZ);
      const rect = cell.cloneNode();
      rect.setAttribute('x', String(x));
      rect.setAttribute('y', String(y));
      rect.setAttribute('width', '1');
      rect.setAttribute('height', '1');
      rect.setAttribute('class', `map-cell ${h < WORLD.seaLevel ? 'is-sea' : h > 20 ? 'is-mountain' : h > 10 ? 'is-high' : 'is-land'}`);
      svg.appendChild(rect);
    }
  }

  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  marker.setAttribute('r', '2');
  marker.setAttribute('class', 'map-marker');
  marker.setAttribute('cx', String((playerPos.x / WORLD.size) * 100));
  marker.setAttribute('cy', String((playerPos.z / WORLD.size) * 100));

  wrap.append(svg, marker, el('p', 'muted', 'You are here. The four districts run from the city in the north-west down to the coast in the south.'));

  panel.body.appendChild(wrap);
  return panel;
}