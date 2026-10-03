/**
 * HUD and menus.
 *
 * Everything is built as DOM rather than drawn into the canvas, because text
 * rendered by WebGL is blurry, cannot be selected by screen readers and fights
 * the browser's own text scaling. The canvas keeps the 3D; the DOM keeps the
 * interface.
 */

import { formatGap, formatLapTime, formatPosition } from '../util/math.js';
import { ACTIONS } from '../core/InputController.js';

const SESSION_LABEL = { qualifying: 'QUALIFYING', race: 'RACE' };

/** Build phases, in order, used to advance the loading bar. */
const LOADING_PHASES = ['track', 'mesh', 'scenery', 'lighting', 'grid'];

export class UIManager {
  constructor(root, { input = null, onAction = () => {} } = {}) {
    this.root = root;
    this.input = input;
    this.onAction = onAction;
    this.hidden = false;
    this.screen = null;
    this.helpSeen = localStorage.getItem('apexgp.helpSeen') === '1';
    this.#build();
  }

  #build() {
    this.root.innerHTML = `
      <div class="hud" data-hud>
        <div class="hud-topleft">
          <div class="hud-session" data-session-label>RACE</div>
          <div class="hud-circuit" data-circuit-name></div>
          <div class="hud-lap"><span data-lap>1</span><span class="hud-lap-total">/1</span></div>
        </div>

        <div class="hud-topright">
          <div class="hud-position"><span data-position>1</span><sup data-position-total></sup></div>
          <div class="hud-gap" data-gap></div>
        </div>

        <div class="hud-timer">
          <div class="hud-time-row">
            <span class="hud-time-label">CURRENT</span>
            <span class="hud-time" data-current-time>0:00.000</span>
          </div>
          <div class="hud-time-row">
            <span class="hud-time-label">LAST</span>
            <span class="hud-time" data-last-time>--:--.---</span>
          </div>
          <div class="hud-time-row hud-time-best">
            <span class="hud-time-label">BEST</span>
            <span class="hud-time" data-best-time>--:--.---</span>
          </div>
          <div class="hud-sectors" data-sectors></div>
        </div>

        <div class="hud-standings" data-standings></div>

        <div class="hud-bottomright">
          <div class="hud-ers">
            <div class="hud-ers-label">ERS</div>
            <div class="hud-ers-track"><div class="hud-ers-fill" data-ers-fill></div></div>
          </div>
          <div class="hud-speed">
            <span class="hud-speed-value" data-speed>0</span>
            <span class="hud-speed-unit">km/h</span>
          </div>
          <div class="hud-gear" data-gear>N</div>
          <div class="hud-revbar" data-revbar></div>
        </div>

        <div class="hud-badges">
          <div class="hud-badge" data-drs>DRS</div>
          <div class="hud-badge hud-badge-ers" data-ers-badge>ERS</div>
        </div>

        <div class="hud-tyres">
          <div class="hud-tyre hud-tyre-front">
            <span>F</span><div class="hud-tyre-track" data-tyre-front></div>
          </div>
          <div class="hud-tyre hud-tyre-rear">
            <span>R</span><div class="hud-tyre-track" data-tyre-rear></div>
          </div>
        </div>

        <div class="hud-alert" data-alert></div>
        <div class="hud-controls-toggle">
          <button type="button" data-action="toggle-ui" aria-label="Hide interface">◧</button>
        </div>
        <button type="button" class="hud-restore" data-action="toggle-ui" aria-label="Show interface">◨</button>
      </div>

      <div class="touch" data-touch>
        <div class="touch-zone" data-steer-zone></div>
        <div class="touch-steer" data-stick>
          <div class="touch-steer-knob" data-stick-knob></div>
          <div class="touch-steer-label">STEER &middot; UP = GAS &middot; DOWN = BRAKE</div>
        </div>
        <div class="touch-pedals" data-pedals hidden>
          <button type="button" class="touch-pedal touch-pedal-brake" data-pedal="brake" aria-label="Brake">BRAKE</button>
          <button type="button" class="touch-pedal touch-pedal-gas" data-pedal="throttle" aria-label="Throttle">GAS</button>
        </div>
        <div class="touch-modes">
          <button type="button" class="touch-mode" data-control="ers" aria-label="Deploy energy recovery">ERS</button>
          <button type="button" class="touch-mode" data-control="drs" aria-label="Drag reduction system">DRS</button>
          <button type="button" class="touch-mode" data-control="reset" aria-label="Recover the car">R</button>
          <button type="button" class="touch-mode" data-control="camera" aria-label="Change camera">CAM</button>
          <button type="button" class="touch-mode touch-mode-pause" data-action="pause" aria-label="Pause">II</button>
        </div>
      </div>

      <div class="overlay" data-overlay hidden>
        <div class="overlay-panel" data-overlay-panel></div>
      </div>

      <div class="vignette" data-vignette></div>
    `;

    this.hud = this.root.querySelector('[data-hud]');
    this.overlay = this.root.querySelector('[data-overlay]');
    this.overlayPanel = this.root.querySelector('[data-overlay-panel]');
    this.vignette = this.root.querySelector('[data-vignette]');
    this.touch = this.root.querySelector('[data-touch]');
    this.steerZone = this.root.querySelector('[data-steer-zone]');
    this.pedals = this.root.querySelector('[data-pedals]');

    const find = (name) => this.root.querySelector(`[data-${name}]`);
    this.elements = {
      sessionLabel: find('session-label'),
      circuitName: find('circuit-name'),
      lap: find('lap'),
      lapTotal: this.root.querySelector('.hud-lap-total'),
      position: find('position'),
      positionTotal: find('position-total'),
      gap: find('gap'),
      currentTime: find('current-time'),
      lastTime: find('last-time'),
      bestTime: find('best-time'),
      sectors: find('sectors'),
      standings: find('standings'),
      speed: find('speed'),
      gear: find('gear'),
      revbar: find('revbar'),
      ersFill: find('ers-fill'),
      drs: find('drs'),
      ersBadge: find('ers-badge'),
      tyreFront: find('tyre-front'),
      tyreRear: find('tyre-rear'),
      alert: find('alert')
    };

    // Rev bar segments, created once and then lit by class.
    this.revSegments = [];
    for (let i = 0; i < 18; i += 1) {
      const segment = document.createElement('span');
      segment.className = 'hud-rev';
      this.elements.revbar.appendChild(segment);
      this.revSegments.push(segment);
    }
    this.sectorEls = [];
    for (let i = 0; i < 3; i += 1) {
      const sector = document.createElement('span');
      sector.className = 'hud-sector';
      this.elements.sectors.appendChild(sector);
      this.sectorEls.push(sector);
    }

    this.root.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        if (action === 'toggle-ui') this.toggleHud();
        else this.onAction(action);
      });
    });

    this.#bindTouch();
  }

  /**
   * Wire the on-screen controls.
   *
   * All of it goes through `InputController`. The pedals used to be wired here by
   * hand into `input.touch.throttle` / `input.touch.brake`, which `read()` never
   * looked at, so the gas and brake buttons did nothing at all. There is now a
   * single path: `bindButton` for the pedals and modes, `bindStick` for steering.
   */
  #bindTouch() {
    // Throws rather than returning quietly. This guard was `if (!this.input) return`
    // and the UI manager was constructed without an input controller, so it fired
    // on every boot: the controls were built, styled and visible on a phone, and
    // not one of them had an event handler. A dead control layer looks exactly
    // like a broken one, so this must not fail silently.
    if (!this.input) {
      throw new Error('UIManager requires an InputController: on-screen controls cannot bind without it');
    }
    this.input.bindStick(
      this.root.querySelector('[data-stick]'),
      this.root.querySelector('[data-stick-knob]'),
      this.root.querySelector('[data-steer-zone]')
    );
    // Throttle and brake come off the stick's vertical axis, so there are no
    // pedal elements to bind -- only the discrete mode buttons.
    for (const [control, action, mode] of [
      // Both are held, not toggled, and `read()` reports both from both state
      // sets. See the note in `InputController.read` -- binding one as a toggle
      // and reading the other way is what left neither of them working.
      ['ers', ACTIONS.ers, 'hold'],
      ['drs', ACTIONS.drs, 'hold'],
      ['reset', ACTIONS.reset, 'toggle'],
      ['camera', ACTIONS.camera, 'toggle']
    ]) {
      this.input.bindButton(this.root.querySelector(`[data-control="${control}"]`), action, mode);
    }

    /*
     * Pedals for motion mode.
     *
     * In motion mode the stick is hidden because its vertical axis is throttle and
     * brake, and it would fight the gyroscope for steering. That leaves the player
     * with no pedals at all, so they get their own: two large targets at the bottom
     * of the screen, reachable by either thumb, driven through the same
     * `bindButton` path as every other on-screen control.
     *
     * `ACTIONS.throttle` and `ACTIONS.brake` rather than bespoke state, so `read()`
     * needs to know nothing about how they were pressed.
     */
    this.input.bindButton(this.root.querySelector('[data-pedal="throttle"]'), ACTIONS.throttle, 'hold');
    this.input.bindButton(this.root.querySelector('[data-pedal="brake"]'), ACTIONS.brake, 'hold');
  }

  /**
   * Switch between the on-screen stick and gyroscope steering.
   *
   * In motion mode the stick and its dead zone are hidden, not merely ignored.
   * Leaving them on screen would invite the player to grab a stick that does
   * nothing, which reads as the scheme not having taken effect.
   *
   * The DRS, ERS, recover and pause buttons stay either way: those are actions,
   * not steering, and there is no sensible gesture for "deploy DRS" that is
   * distinct from "turn".
   *
   * @param {'touch' | 'motion'} scheme
   */
  setControlScheme(scheme) {
    const motion = scheme === 'motion';
    this.root.classList.toggle('uses-motion', motion);

    /*
     * Release anything currently held.
     *
     * A control that is hidden while a finger is still on it never receives its
     * pointerup, so its action stays stuck down -- and a stuck throttle is a car that
     * drives off on its own. Switching scheme hides the stick and shows the pedals,
     * which is exactly the moment a press can be orphaned.
     */
    this.input.releaseHeld();

    if (this.steerZone) this.steerZone.hidden = motion;
    // The pedals are the replacement for the stick's vertical axis, so they appear
    // exactly when it goes.
    if (this.pedals) this.pedals.hidden = !motion;
    if (this.touch) this.touch.classList.toggle('motion-mode', motion);
  }

  /** Hide the interface entirely, leaving only the car and the road. */
  toggleHud() {
    this.hidden = !this.hidden;
    this.root.classList.toggle('hud-hidden', this.hidden);
  }

  /** Flash the screen edges on impact. */
  flashImpact(strength = 1) {
    this.vignette.classList.remove('is-active');
    // Force a reflow so the animation restarts on consecutive hits.
    void this.vignette.offsetWidth;
    this.vignette.style.setProperty('--impact', String(Math.min(1, strength)));
    this.vignette.classList.add('is-active');
  }

  /** Show a short-lived message, e.g. "LAP 3" or "INVALID LAP". */
  alert(text, tone = 'neutral') {
    const element = this.elements.alert;
    element.textContent = text;
    element.dataset.tone = tone;
    element.classList.remove('is-visible');
    void element.offsetWidth;
    element.classList.add('is-visible');
  }

  setSession({ type, circuitName, totalLaps }) {
    this.elements.sessionLabel.textContent = SESSION_LABEL[type] ?? 'RACE';
    this.elements.circuitName.textContent = circuitName;
    this.elements.lapTotal.textContent = `/${totalLaps}`;
  }

  /** Per-frame HUD refresh. */
  update(telemetry) {
    const e = this.elements;

    e.speed.textContent = String(Math.round(telemetry.speedKph));
    e.gear.textContent = telemetry.gear <= 0 ? 'N' : String(telemetry.gear);
    e.lap.textContent = String(Math.max(1, telemetry.lap));
    e.position.textContent = formatPosition(telemetry.position).replace(/\D/g, '');
    e.positionTotal.textContent = `/${telemetry.totalCars}`;
    e.position.parentElement.dataset.tone =
      telemetry.position === 1 ? 'lead' : telemetry.position <= 3 ? 'podium' : 'neutral';

    e.currentTime.textContent = formatLapTime(telemetry.currentLapTime);
    e.lastTime.textContent = formatLapTime(telemetry.lastLap);
    e.bestTime.textContent = formatLapTime(telemetry.bestLap);

    // Gap to the car ahead. Running first, there is nobody ahead, so it says so.
    e.gap.textContent = telemetry.position === 1 ? 'LEADER' : formatGap(telemetry.gapToAhead);
    e.gap.dataset.tone = telemetry.position <= 3 ? 'podium' : 'neutral';

    // Sector deltas, coloured against the session best.
    const deltas = telemetry.sectorDeltas ?? [];
    this.sectorEls.forEach((element, index) => {
      const delta = deltas[index];
      element.dataset.tone =
        delta === undefined ? 'none' : delta <= 0.0005 ? 'good' : delta < 0.4 ? 'ok' : 'bad';
      element.textContent =
        delta === undefined ? '--' : delta <= 0.0005 ? '---' : `${delta > 0 ? '+' : ''}${delta.toFixed(3)}`;
    });

    // Rev bar, with the last few segments as the shift light.
    const revRatio = telemetry.rpm / telemetry.revLimit;
    const litSegments = Math.round(revRatio * this.revSegments.length);
    this.revSegments.forEach((segment, index) => {
      const shiftLight = index >= this.revSegments.length - 3;
      segment.className = `hud-rev${index < litSegments ? ' is-lit' : ''}${shiftLight && index < litSegments ? ' is-shift' : ''}`;
    });

    e.ersFill.style.height = `${Math.round(telemetry.ersCharge * 100)}%`;
    e.ersBadge.classList.toggle('is-active', telemetry.boosting);
    e.drs.classList.toggle('is-open', telemetry.drsOpen);
    e.drs.classList.toggle('is-available', telemetry.drsAvailable && !telemetry.drsOpen);

    this.#setTyreBar(e.tyreFront, telemetry.frontTemp, telemetry.frontWear);
    this.#setTyreBar(e.tyreRear, telemetry.rearTemp, telemetry.rearWear);

    if (telemetry.invalidLap) this.alert('INVALID LAP', 'bad');
  }

  #setTyreBar(element, temp, wear) {
    // Temperature mapped into the same 0-100% as wear, with a band for the
    // optimum window so the player can see the tyres going off.
    const heat = Math.min(100, Math.max(0, ((temp - 30) / 160) * 100));
    element.style.setProperty('--wear', `${Math.round(wear * 100)}%`);
    element.style.setProperty('--heat', `${Math.round(heat)}%`);
    element.dataset.tone = temp > 160 ? 'hot' : temp < 60 ? 'cold' : 'optimal';
  }

  /** Live timing tower beside the HUD. */
  updateStandings(order, playerShort, totalLaps) {
    if (!order?.length) return;
    const rows = order.slice(0, 5).map((entry) => {
      const isPlayer = entry.id === playerShort;
      return `
        <div class="hud-standing${isPlayer ? ' is-player' : ''}">
          <span class="hud-standing-pos">${entry.position}</span>
          <span class="hud-standing-name">${entry.id}</span>
          <span class="hud-standing-gap">${entry.position === 1 ? 'LEADER' : `+${(entry.gapToAhead ?? 0).toFixed(1)}s`}</span>
        </div>
      `;
    });
    void totalLaps;
    this.elements.standings.innerHTML = rows.join('');
  }

  /**
   * Show a full-screen panel.
   * @param {string} html
   * @param {{dismissible?: boolean}} options
   */
  /** Full-screen loading state, used while a circuit is being built. */
  showLoading(note = 'Loading') {
    if (!this.loading) {
      this.loading = document.createElement('div');
      this.loading.className = 'loading';
      this.loading.innerHTML = `
        <div class="loading-title">APEX GP</div>
        <div class="loading-note" data-loading-note></div>
        <div class="loading-bar"><div class="loading-bar-fill" data-loading-fill></div></div>
        <div class="loading-elapsed" data-loading-elapsed></div>
      `;
      this.root.appendChild(this.loading);
    }
    this.loading.querySelector('[data-loading-note]').textContent = note.toUpperCase();
    this.loading.querySelector('[data-loading-fill]').style.width = '0%';
    this.loading.querySelector('[data-loading-elapsed]').textContent = '';
    this.loading.hidden = false;
  }

  /**
   * Show build progress.
   *
   * The bar is not a real percentage -- the phases are of very different
   * lengths -- so it advances by a fixed amount per phase and shows the elapsed
   * time. An indeterminate spinner that might as well be a freeze tells the
   * player nothing; this at least proves the game is alive.
   */
  setLoadingProgress(phase, note, startedAt = 0) {
    if (!this.loading || this.loading.hidden) return;
    const step = LOADING_PHASES.indexOf(phase);
    const pct = Math.round(((step + 1) / LOADING_PHASES.length) * 100);
    const noteEl = this.loading.querySelector('[data-loading-note]');
    const fillEl = this.loading.querySelector('[data-loading-fill]');
    if (noteEl) noteEl.textContent = note.toUpperCase();
    if (fillEl) fillEl.style.width = `${pct}%`;
    const elapsed = this.loading.querySelector('[data-loading-elapsed]');
    if (elapsed && startedAt) elapsed.textContent = `${((performance.now() - startedAt) / 1000).toFixed(1)}s`;
  }

  hideLoading() {
    if (this.loading) this.loading.hidden = true;
  }

  showPanel(html, options = {}) {
    this.overlayPanel.innerHTML = html;
    this.overlay.hidden = false;
    this.overlay.classList.add('is-open');
    this.overlayPanel.dataset.dismissible = String(Boolean(options.dismissible));

    this.overlayPanel.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        if (action === 'close-panel' && options.dismissible) this.hidePanel();
        else this.onAction(action);
      });
    });
  }

  hidePanel() {
    this.overlay.classList.remove('is-open');
    this.overlay.hidden = true;
  }

  get panelOpen() {
    return !this.overlay.hidden;
  }

  markHelpSeen() {
    localStorage.setItem('apexgp.helpSeen', '1');
    this.helpSeen = true;
  }
}

/** Controls reference, shown on first run. */
export const HELP_HTML = `
  <div class="panel">
    <h1 class="panel-title">Apex GP</h1>
    <p class="panel-sub">Formula 1 Championship</p>
    <div class="panel-grid">
      <div><kbd>W</kbd> / <kbd>↑</kbd><span>Throttle</span></div>
      <div><kbd>S</kbd> / <kbd>↓</kbd><span>Brake</span></div>
      <div><kbd>A</kbd> <kbd>D</kbd><span>Steer</span></div>
      <div><kbd>Shift</kbd><span>DRS (straights only)</span></div>
      <div><kbd>Space</kbd><span>Deploy ERS</span></div>
      <div><kbd>R</kbd><span>Recover to track</span></div>
      <div><kbd>C</kbd><span>Change camera</span></div>
      <div><kbd>Esc</kbd><span>Pause</span></div>
    </div>
    <p class="panel-note">Touch controls appear automatically on touch devices.</p>
    <button type="button" class="panel-button" data-action="close-help">Let's race</button>
  </div>
`;

export { ACTIONS };