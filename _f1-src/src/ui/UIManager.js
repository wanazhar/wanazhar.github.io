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

/**
 * Conditions, as the HUD shows them.
 *
 * The ids match `physics/compounds.js` WEATHER presets, so the chip cannot drift from the
 * grip the car actually gets.
 */
const WEATHER_LABEL = {
  clear: 'DRY',
  cloudy: 'OVERCAST',
  'light-rain': 'LIGHT RAIN',
  'heavy-rain': 'HEAVY RAIN'
};

/** What gets announced when the forecast arrives. The first rain is the headline. */
const WEATHER_ANNOUNCE = {
  cloudy: 'OVERCAST',
  'light-rain': 'RAIN',
  'heavy-rain': 'HEAVY RAIN'
};

/** Build phases, in order, used to advance the loading bar. */
const LOADING_PHASES = ['track', 'mesh', 'scenery', 'lighting', 'grid'];

/**
 * How often the minimap redraws, seconds.
 *
 * See `updateMinimap`. Twenty is well past the point where the movement reads as
 * continuous, and it is a fifth of the DOM work.
 */
const MINIMAP_INTERVAL = 1 / 20;

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
          <!--
            Conditions. Present from the lights, because knowing the track is dry when it is
            dry is half the information: the player can see the change coming rather than
            discovering it as a slide. The bar fills as the forecast builds.
          -->
          <div class="hud-weather" data-weather hidden>
            <span class="hud-weather-icon" data-weather-icon></span>
            <span class="hud-weather-label" data-weather-label>DRY</span>
            <span class="hud-weather-bar"><i data-weather-fill></i></span>
          </div>
        </div>

        <!--
          Position, gap and the timing tower live in one column so they stack instead
          of being positioned independently. They used to be two absolutely-positioned
          elements with a hand-computed offset between them, and the offset silently
          evaluated to nothing -- so the timer panel sat on top of the position number.
          A column cannot overlap itself.
        -->
        <div class="hud-right" data-hud-right>
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
        </div>

        <div class="hud-standings" data-standings></div>

        <div class="hud-minimap" data-minimap hidden>
          <svg class="minimap-svg" data-minimap-svg viewBox="0 0 100 100" aria-hidden="true">
            <path class="minimap-track" data-minimap-track fill="none" stroke="currentColor"
                  stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" opacity="0.55"/>
            <path class="minimap-line" data-minimap-line fill="none" stroke="var(--accent)"
                  stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" opacity="0.5"/>
            <g data-minimap-cars></g>
            <circle class="minimap-start" data-minimap-start r="2.4" />
          </svg>
          <div class="minimap-label" data-minimap-label></div>
        </div>

        <div class="hud-lights" data-lights hidden>
          <div class="light-gantry">
            <div class="light-lamp" data-lamp></div>
            <div class="light-lamp" data-lamp></div>
            <div class="light-lamp" data-lamp></div>
            <div class="light-lamp" data-lamp></div>
            <div class="light-lamp" data-lamp></div>
          </div>
          <div class="light-caption" data-light-caption></div>
        </div>

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

        <!--
          Damage. Beside the tyre bars rather than in a corner, because it is the same kind
          of thing: the car telling you what condition it is in. Hidden while undamaged, so a
          clean race does not spend the space on a bar that is always empty.
        -->
        <div class="hud-damage" data-damage hidden>
          <span class="hud-damage-label">DAMAGE</span>
          <span class="hud-damage-track"><i data-damage-fill></i></span>
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
    this.lights = this.root.querySelector('[data-lights]');
    this.lightLamps = [...this.root.querySelectorAll('[data-lamp]')];
    this.lightCaption = this.root.querySelector('[data-light-caption]');
    this.minimap = this.root.querySelector('[data-minimap]');
    this.minimapTrack = this.root.querySelector('[data-minimap-track]');
    this.minimapLine = this.root.querySelector('[data-minimap-line]');
    this.minimapCars = this.root.querySelector('[data-minimap-cars]');
    this.minimapStart = this.root.querySelector('[data-minimap-start]');
    this.minimapLabel = this.root.querySelector('[data-minimap-label]');
    this.minimapDots = [];
    this.greenTimer = null;

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
      damage: find('damage'),
      damageFill: find('damage-fill'),
      weather: find('weather'),
      weatherIcon: find('weather-icon'),
      weatherLabel: find('weather-label'),
      weatherFill: find('weather-fill'),
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

  /**
   * Show the start lights.
   *
   * @param {{state: string, lightsOn: number}} start the session's start sequence
   */
  setStartLights(start) {
    const holding = start.state !== 'green';
    if (this.lights) this.lights.hidden = !holding;
    if (!holding) return;

    for (const [index, lamp] of this.lightLamps.entries()) {
      // Lit lamps are the first N. A light pair is on or off -- never half-lit -- so
      // this is a threshold rather than a ramp.
      lamp.classList.toggle('is-lit', index < start.lightsOn);
    }

    if (this.lightCaption && !this.lightCaption.classList.contains('is-go')) {
      this.lightCaption.textContent =
        start.state === 'pending' ? 'GET READY' : start.state === 'hold' ? 'HOLD' : 'LIGHTS';
    }
  }

  /**
   * Flash the caption green at lights out, then get out of the way.
   *
   * Timed rather than cleared on the next frame: a "GO" that appears for one frame is
   * not seen at all, and one that lingers is a HUD element competing with the corner
   * the player is trying to take.
   */
  showGreenFlag() {
    if (!this.lights) return;
    this.lights.hidden = false;
    for (const lamp of this.lightLamps) lamp.classList.remove('is-lit');
    if (this.lightCaption) {
      this.lightCaption.textContent = 'GO';
      this.lightCaption.classList.add('is-go');
    }
    clearTimeout(this.greenTimer);
    this.greenTimer = setTimeout(() => {
      if (this.lights) this.lights.hidden = true;
    }, 1400);
  }

  /**
   * Build the minimap for a circuit.
   *
   * The outline and the car dots must come from the *same* projection, or the dots
   * drift off the line they belong to. `TrackProjection` exists for exactly that.
   *
   * @param {object} circuit
   * @param {string} circuit.path SVG outline path data
   * @param {string} [circuit.linePath] racing line, drawn under the cars
   * @param {{x: number, y: number}} circuit.start start/finish marker
   * @param {Array<{isPlayer: boolean}>} circuit.cars
   * @param {string} [circuit.name]
   */
  setMinimapCircuit(circuit) {
    if (!this.minimap) return;
    this.minimapTrack?.setAttribute('d', circuit.path ?? '');
    this.minimapLine?.setAttribute('d', circuit.linePath ?? circuit.path ?? '');
    if (this.minimapStart) {
      this.minimapStart.setAttribute('cx', circuit.start.x.toFixed(2));
      this.minimapStart.setAttribute('cy', circuit.start.y.toFixed(2));
    }
    if (this.minimapLabel) this.minimapLabel.textContent = circuit.name ?? '';
    this.minimap.hidden = false;

    if (!this.minimapCars) return;
    const cars = circuit.cars ?? [];
    // Rebuilt only when the field size changes, not every frame.
    if (this.minimapDots.length !== cars.length) {
      this.minimapCars.replaceChildren();
      this.minimapDots = cars.map((car) => {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', car.isPlayer ? '3' : '2');
        dot.setAttribute('fill', car.isPlayer ? 'var(--accent)' : 'rgba(255,255,255,0.6)');
        if (car.isPlayer) {
          dot.setAttribute('stroke', '#0b0e14');
          dot.setAttribute('stroke-width', '1');
        }
        this.minimapCars.append(dot);
        return dot;
      });
    }
  }

  /**
   * Move the minimap dots.
   *
   * Throttled to 20Hz. 23 dots rewritten every frame is 23 DOM attribute writes per
   * frame for something nobody can read at that rate -- the field is spread over a few
   * hundred metres, so 20Hz is well past the point where it reads as continuous.
   *
   * @param {number} dt seconds
   * @param {(x: number, z: number) => {x: number, y: number}} project
   * @param {Array<{x: number, z: number}>} cars
   */
  updateMinimap(dt, project, cars) {
    if (!this.minimap || this.minimap.hidden) return;

    this.minimapAccumulator += dt;
    if (this.minimapAccumulator < MINIMAP_INTERVAL) return;
    this.minimapAccumulator = 0;

    for (const [index, dot] of this.minimapDots.entries()) {
      const car = cars[index];
      if (!car) {
        dot.setAttribute('opacity', '0');
        continue;
      }
      const point = project(car.x, car.z);
      dot.setAttribute('cx', point.x.toFixed(2));
      dot.setAttribute('cy', point.y.toFixed(2));
      dot.setAttribute('opacity', '1');
    }
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
    this.#setWeather(telemetry.weather, telemetry.weatherPhase);
    this.#setDamage(telemetry.damage, telemetry.retireReason);
  }

  /**
   * Damage readout.
   *
   * Carries the reason for retirement as well as the level, because "the car is finished" is
   * a different piece of information from "the nose is bent" and the player is entitled to
   * both. The bar is hidden below 2%, where it is all noise.
   */
  #setDamage(damage = 0, retireReason = null) {
    const e = this.elements;
    if (!e.damage) return;
    const fraction = Math.min(1, Math.max(0, damage));
    e.damage.hidden = fraction < 0.02 && !retireReason;
    e.damage.dataset.tone = retireReason ? 'terminal' : fraction > 0.6 ? 'severe' : fraction > 0.3 ? 'bad' : 'minor';
    e.damageFill.style.width = `${Math.round(fraction * 100)}%`;

    // The transition into terminal is worth saying out loud, once.
    if (retireReason && retireReason !== this.lastRetirement) {
      this.lastRetirement = retireReason;
      this.alert(retireReason === 'MECHANICAL' ? 'MECHANICAL FAILURE' : 'CAR RETIRED', 'bad');
    }
  }

  /**
   * Conditions readout, and a one-shot alert when the forecast actually arrives.
   *
   * The alert is what makes this a mechanic rather than an ambience setting: without it the
   * rain shows up as the car suddenly not gripping and the player has to guess why.
   */
  #setWeather(weather = 'clear', phase = 1) {
    const e = this.elements;
    if (!e.weather) return;
    // Hidden on a circuit that cannot change, so a permanently dry race does not spend a
    // HUD region telling the player something that will not happen.
    const changeable = weather !== 'clear' || phase < 1;
    e.weather.hidden = !changeable;
    e.weather.dataset.tone = weather;
    e.weatherLabel.textContent = WEATHER_LABEL[weather] ?? 'DRY';
    e.weatherFill.style.width = `${Math.round(phase * 100)}%`;
    if (weather !== this.lastWeather) {
      // `clear` -> `cloudy` is not worth interrupting for; the first rain is.
      if (this.lastWeather !== undefined && WEATHER_LABEL[weather] !== 'DRY') {
        this.alert(WEATHER_ANNOUNCE[weather] ?? 'WEATHER CHANGE', weather === 'heavy-rain' ? 'bad' : 'warn');
      }
      this.lastWeather = weather;
    }
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