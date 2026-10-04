import { ITEMS } from '../data/items.js';
import { friendshipTier } from '../data/npcs.js';
import { clamp01 } from '../util/math.js';

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
};

// The on-screen HUD: clock, weather, wallet, stamina, and the current objective.
// Deliberately sparse. A chill game should not make you read numbers to relax.
export class HUD {
  constructor(root, { onOpenJournal, onOpenMap, onOpenInventory }) {
    this.root = root;
    this.node = el('div', 'hud');
    root.appendChild(this.node);

    // Top-left: where you are and what time it is.
    const topLeft = el('div', 'hud-panel hud-topleft');
    this.regionName = el('div', 'hud-region', 'Sakura Ward');
    this.regionSub = el('div', 'hud-region-sub', '');
    this.clockLabel = el('div', 'hud-clock', '07:30');
    this.weatherLabel = el('div', 'hud-weather', 'Clear · 晴れ');
    topLeft.append(this.regionName, this.regionSub, this.clockLabel, this.weatherLabel);

    // Top-right: money and day.
    const topRight = el('div', 'hud-panel hud-topright');
    this.wallet = el('div', 'hud-wallet', '¥500');
    this.dayLabel = el('div', 'hud-day', 'Day 1');
    topRight.append(this.wallet, this.dayLabel);

    // Bottom-left: stamina bar.
    const bottom = el('div', 'hud-panel hud-bottom');
    const bar = el('div', 'hud-stamina-bar');
    this.staminaFill = el('div', 'hud-stamina-fill');
    bar.appendChild(this.staminaFill);
    this.staminaLabel = el('div', 'hud-stamina-label', '');
    bottom.append(bar, this.staminaLabel);

    // Bottom-centre: the active objective, or a prompt to talk when close to
    // someone. Only one of the two is ever visible.
    this.centre = el('div', 'hud-centre');

    // Bottom-right: quick buttons.
    const buttons = el('div', 'hud-buttons');
    this.buttons = {};
    for (const [key, label, hint, handler] of [
      ['journal', 'Journal', 'J', onOpenJournal],
      ['map', 'Map', 'M', onOpenMap],
      ['inventory', 'Bag', 'I', onOpenInventory]
    ]) {
      const button = el('button', 'hud-button');
      button.type = 'button';
      button.append(el('span', 'hud-button-label', label), el('span', 'hud-button-key', hint));
      button.addEventListener('click', handler);
      buttons.appendChild(button);
      this.buttons[key] = button;
    }

    // Transient toast messages.
    this.toast = el('div', 'hud-toast');

    this.node.append(topLeft, topRight, bottom, this.centre, buttons, this.toast);
    this.toastTimer = null;
  }

  setRegion(name, sub) {
    this.regionName.textContent = name;
    this.regionSub.textContent = sub ?? '';
  }

  setTime(clockLabel, day) {
    this.clockLabel.textContent = clockLabel;
    this.dayLabel.textContent = `Day ${day}`;
  }

  setWeather(label) {
    this.weatherLabel.textContent = `${label.en} · ${label.ja}`;
  }

  setYen(yen) {
    this.wallet.textContent = `¥${yen.toLocaleString('en-US')}`;
  }

  setStamina(value, max, exhausted) {
    const ratio = clamp01(value / max);
    this.staminaFill.style.width = `${ratio * 100}%`;
    this.staminaFill.classList.toggle('is-low', ratio < 0.3);
    this.staminaFill.classList.toggle('is-out', exhausted);
    this.staminaLabel.textContent = exhausted ? 'Winded — easy does it' : '';
    this.staminaLabel.classList.toggle('is-visible', exhausted);
  }

  // Shows either an interaction prompt or the tracked objective.
  setPrompt(text, onAccept) {
    this.centre.replaceChildren();
    if (!text) return;

    const box = el('div', 'hud-prompt');
    box.appendChild(el('span', 'hud-prompt-key', onAccept ? 'E' : ''));
    box.appendChild(el('span', 'hud-prompt-text', text));
    this.centre.appendChild(box);
  }

  setObjective(text) {
    if (this.centre.querySelector('.hud-prompt')) return;
    this.centre.replaceChildren();
    if (!text) return;
    const box = el('div', 'hud-objective');
    box.appendChild(el('span', 'hud-objective-label', 'Now'));
    box.appendChild(el('span', 'hud-objective-text', text));
    this.centre.appendChild(box);
  }

  showToast(text, tone = 'info') {
    this.toast.textContent = text;
    this.toast.className = `hud-toast is-visible tone-${tone}`;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toast.className = 'hud-toast';
    }, 2600);
  }

  setVisible(v) {
    this.node.classList.toggle('is-hidden', !v);
  }
}

// A generic modal panel used by the journal, map, bag, shop and dialogue.
// One implementation, so every screen looks and closes the same way.
export class Panel {
  constructor(root, { title, onClose, wide = false }) {
    this.onClose = onClose;
    this.node = el('div', `panel${wide ? ' panel-wide' : ''}`);
    this.node.setAttribute('role', 'dialog');
    this.node.setAttribute('aria-label', title);

    const header = el('header', 'panel-header');
    header.appendChild(el('h2', 'panel-title', title));
    const close = el('button', 'panel-close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close');
    close.addEventListener('click', () => this.close());
    header.appendChild(close);

    this.body = el('div', 'panel-body');
    this.node.append(header, this.body);
    root.appendChild(this.node);

    this.onKey = (e) => {
      if (e.key === 'Escape') this.close();
    };
    window.addEventListener('keydown', this.onKey);
  }

  close() {
    if (!this.node.isConnected) return;
    window.removeEventListener('keydown', this.onKey);
    this.node.remove();
    this.onClose?.();
  }

  get isOpen() {
    return this.node.isConnected;
  }
}

// The dialogue box. Shows one line of speech plus contextual choices.
export class DialogueBox {
  constructor(root) {
    this.node = el('div', 'dialogue');
    this.speaker = el('div', 'dialogue-speaker');
    this.role = el('div', 'dialogue-role');
    this.line = el('p', 'dialogue-line');
    this.choices = el('div', 'dialogue-choices');
    this.node.append(el('div', 'dialogue-header-group'), this.line, this.choices);
    this.node.querySelector('.dialogue-header-group').append(this.speaker, this.role);
    root.appendChild(this.node);
    this.isOpen = false;
  }

  show({ name, role, line, choices = [] }) {
    this.speaker.textContent = name;
    this.role.textContent = role ?? '';
    this.line.textContent = line;
    this.choices.replaceChildren();
    this.isOpen = true;
    this.node.classList.add('is-open');

    for (const choice of choices) {
      const button = el('button', 'dialogue-choice');
      button.type = 'button';
      button.appendChild(el('span', 'dialogue-choice-label', choice.label));
      if (choice.detail) button.appendChild(el('span', 'dialogue-choice-detail', choice.detail));
      button.addEventListener('click', choice.onSelect);
      this.choices.appendChild(button);
    }

    if (choices.length === 0) {
      const button = el('button', 'dialogue-choice');
      button.type = 'button';
      button.appendChild(el('span', 'dialogue-choice-label', 'Goodbye'));
      button.addEventListener('click', () => this.hide());
      this.choices.appendChild(button);
    }
  }

  hide() {
    this.isOpen = false;
    this.node.classList.remove('is-open');
    this.choices.replaceChildren();
  }
}

// A small floating nameplate shown when you walk near an NPC.
export class Nameplate {
  constructor(root) {
    this.node = el('div', 'nameplate');
    root.appendChild(this.node);
    this.node.style.display = 'none';
  }

  show(text, x, y) {
    this.node.textContent = text;
    this.node.style.display = 'block';
    this.node.style.left = `${x}px`;
    this.node.style.top = `${y}px`;
  }

  hide() {
    this.node.style.display = 'none';
  }
}

export { el };