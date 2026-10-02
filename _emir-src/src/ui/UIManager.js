import { VEHICLE_ORDER, VEHICLE_PROFILES } from '../physics/VehicleProfiles.js';
import { hasSupabaseConfig } from '../services/supabaseClient.js';

const GARAGE_ICON = {
  sedan: '🚗', hatchback: '🚙', offroader: '🛻', truck: '🚚', excavator: '🚜'
};

export class UIManager {
  constructor({ input, garageStore, game, onVehicleSelect, onReset, onCameraMode }) {
    this.input = input;
    this.garageStore = garageStore;
    this.game = game;
    this.onVehicleSelect = onVehicleSelect;
    this.onReset = onReset;
    this.onCameraMode = onCameraMode;
    this.hidden = false;
    this.elapsed = 0;
    this.toastTimer = 0;
    this.mapZoom = 1;
  }

  mount(parent) {
    this.root = document.createElement('div');
    this.root.className = 'hud';
    this.root.innerHTML = `
      <div class="hud-top">
        <div class="hud-brand">
          <span class="hud-brand-mark">EMIR</span>
          <div>
            <strong>Emir's Car World</strong>
            <span data-hint>Drive the rebuilt city</span>
          </div>
        </div>
        <div class="hud-pill-row">
          <span class="hud-pill" data-stat="fps">FPS --</span>
          <span class="hud-pill" data-stat="score">0 pts</span>
          <span class="hud-pill" data-stat="coins">0 coins</span>
          <span class="hud-pill" data-stat="landmarks">0/6 spots</span>
        </div>
        <button class="hud-icon-button" data-action="help" aria-label="Controls">?</button>
        <button class="hud-icon-button" data-action="open-garage" aria-label="Open garage">Garage</button>
        <button class="hud-icon-button" data-action="toggle-ui" aria-label="Toggle HUD">HUD</button>
      </div>

      <div class="hud-speedo">
        <div class="speedo-dial">
          <svg viewBox="0 0 120 120" class="speedo-svg">
            <path d="M 18 96 A 52 52 0 1 1 102 96" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="9" stroke-linecap="round"/>
            <path data-arc d="M 18 96 A 52 52 0 1 1 102 96" fill="none" stroke="url(#speedGrad)" stroke-width="9" stroke-linecap="round"/>
            <defs>
              <linearGradient id="speedGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stop-color="#4ade80"/>
                <stop offset="55%" stop-color="#facc15"/>
                <stop offset="100%" stop-color="#ef4444"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="speedo-readout">
            <strong data-stat="speed">0</strong>
            <span>km/h</span>
          </div>
        </div>
        <div class="gear-badge" data-stat="gear">N</div>
        <div class="hud-badges">
          <span class="hud-tag" data-stat="vehicle">Ruby Sedan</span>
          <span class="hud-tag" data-stat="ground">grounded</span>
        </div>
      </div>

      <div class="hud-map">
        <canvas data-map width="190" height="190"></canvas>
        <div class="hud-map-legend">
          <span data-stat="coordinates">x 0 · z 0</span>
          <span data-stat="next">nearest: —</span>
        </div>
      </div>

      <div class="hud-scrim" data-scrim hidden></div>

      <div class="hud-garage" data-garage role="dialog" aria-label="Garage">
        <header>
          <span class="hud-kicker">Garage</span>
          <button class="hud-icon-button" data-action="close-garage" aria-label="Close garage">×</button>
        </header>
        <div class="garage-list" data-vehicle-list></div>
        <div class="garage-save">
          <span class="hud-kicker">Save</span>
          <div class="garage-save-row">
            <input data-email-input placeholder="email (optional)" inputmode="email" />
            <button class="hud-button" data-action="save">Save</button>
            <button class="hud-button" data-action="login">Login</button>
          </div>
          <p class="garage-status" data-save-status>${hasSupabaseConfig ? 'Supabase ready.' : 'Saving to this browser.'}</p>
        </div>
      </div>

      <div class="hud-vignette" data-vignette></div>
      <div class="hud-toast" data-toast></div>

      <button class="hud-icon-button hud-restore" data-action="toggle-ui" aria-label="Show HUD">Show HUD</button>

      <div class="hud-help" data-help hidden>
        <header>
          <span class="hud-kicker">How to play</span>
          <button class="hud-icon-button" data-action="close-help" aria-label="Close help">×</button>
        </header>
        <ul class="help-list">
          <li><b>GO</b> accelerate · <b>BRAKE</b> slow down, then reverse</li>
          <li><b>Steer</b> drag the slider left and right</li>
          <li><b>DRIFT</b> handbrake, to slide round corners</li>
          <li><b>Drag the world</b> to look around · <b>pinch</b> to zoom</li>
          <li><b>two-finger drag</b> to roam the city · <b>CAR</b> to snap back</li>
          <li class="help-keys">Keyboard: <b>W A S D</b> drive · <b>Space</b> drift · <b>C</b> recentre · <b>V</b> free camera · <b>R</b> reset</li>
          <li class="help-goal">Find all <b>6 landmarks</b> and collect coins — jumps pay out too.</li>
        </ul>
        <button class="hud-button help-cta" data-action="close-help">Got it</button>
      </div>

      <div class="hud-touch">
        <div class="touch-cluster touch-steer">
          <div class="steer-track" data-stick role="slider" aria-label="Steering" aria-valuemin="-100" aria-valuemax="100">
            <span class="steer-knob" data-knob></span>
          </div>
        </div>
        <div class="touch-cluster touch-pedals">
          <button class="touch-button touch-pedal" data-control="brake" aria-label="Brake and reverse">BRAKE</button>
          <button class="touch-button touch-pedal touch-pedal--go" data-control="throttle" aria-label="Accelerate">GO</button>
          <button class="touch-button touch-pedal touch-pedal--drift" data-control="handbrake" aria-label="Drift">DRIFT</button>
        </div>
        <div class="touch-cluster touch-cam">
          <button class="touch-button touch-small" data-control="cameraZoomIn" aria-label="Zoom in">＋</button>
          <button class="touch-button touch-small" data-control="cameraZoomOut" aria-label="Zoom out">－</button>
          <button class="touch-button touch-small" data-action="camera" aria-label="Free look or follow the car">FREE</button>
          <button class="touch-button touch-small touch-small--accent" data-action="recenter" aria-label="Back to the car">CAR</button>
        </div>
      </div>
    `;
    parent.appendChild(this.root);

    this.garageEl = this.root.querySelector('[data-garage]');
    this.scrimEl = this.root.querySelector('[data-scrim]');
    this.mapCanvas = this.root.querySelector('[data-map]');
    this.mapContext = this.mapCanvas.getContext('2d');
    this.toastEl = this.root.querySelector('[data-toast]');
    this.vignetteEl = this.root.querySelector('[data-vignette]');
    this.speedArc = this.root.querySelector('[data-arc]');
    this.arcLength = this.speedArc.getTotalLength();
    this.speedArc.style.strokeDasharray = `${this.arcLength}`;

    // Both the top-bar button and the floating restore button toggle the HUD.
    this.root.querySelectorAll('[data-action="toggle-ui"]').forEach((button) => {
      button.addEventListener('click', () => this.toggleHidden());
    });
    this.root.querySelector('[data-action="open-garage"]').addEventListener('click', () => this.toggleGarage());
    this.helpEl = this.root.querySelector('[data-help]');
    this.root.querySelector('[data-action="help"]').addEventListener('click', () => this.openHelp());
    window.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (this.garageOpen) this.closeGarage();
      else if (this.helpEl && !this.helpEl.hidden) this.closeHelp();
    });
    this.root.querySelectorAll('[data-action="close-help"]').forEach((button) => {
      button.addEventListener('click', () => this.closeHelp());
    });
    this.root.querySelector('[data-action="close-garage"]').addEventListener('click', () => this.closeGarage());
    this.scrimEl.addEventListener('click', () => this.closeGarage());
    const stick = this.root.querySelector('[data-stick]');
    if (stick) this.input.bindStickElement(stick);
    this.root.querySelector('[data-action="save"]').addEventListener('click', () => this.#saveGarage());
    this.root.querySelector('[data-action="login"]').addEventListener('click', () => this.#login());
    this.root.querySelectorAll('[data-control]').forEach((element) => this.input.bindTouchElement(element));
    this.root.querySelector('[data-action="camera"]')?.addEventListener('click', () => this.onCameraMode?.('toggle'));
    this.root.querySelector('[data-action="recenter"]')?.addEventListener('click', () => this.onCameraMode?.('recenter'));

    this.#renderVehicles();
    this.#syncVisibility();
    // Show the controls once, then stay out of the way.
    if (!this.#helpSeen()) this.openHelp();

    // The minimap is a fixed-size panel whose on-screen size depends on the viewport, so the
    // backing store is matched to it (times the device pixel ratio) to stay crisp.
    this.#fitMapCanvas();
    window.addEventListener('resize', () => this.#fitMapCanvas());
    window.addEventListener('orientationchange', () => setTimeout(() => this.#fitMapCanvas(), 60));
  }

  #fitMapCanvas() {
    if (!this.mapCanvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const box = this.mapCanvas.getBoundingClientRect();
    const size = Math.max(96, Math.round((box.width || 176) * ratio));
    if (this.mapCanvas.width !== size) {
      this.mapCanvas.width = size;
      this.mapCanvas.height = size;
    }
    // Keep the same slice of world visible no matter how large the panel renders.
    this.mapScale = size / 860;
  }

  #helpSeen() {
    try {
      return window.localStorage.getItem('emir.helpSeen') === '1';
    } catch {
      return true;
    }
  }

  openHelp() {
    this.#setExclusive('help');
  }

  closeHelp() {
    this.#setExclusive(null);
    try {
      window.localStorage.setItem('emir.helpSeen', '1');
    } catch {
      /* private mode: just do not remember */
    }
  }

  /** Only one panel is ever up: opening one puts the other away. */
  #setExclusive(panel) {
    const garage = panel === 'garage';
    const help = panel === 'help';
    this.garageEl.classList.toggle('garage-open', garage);
    this.root.classList.toggle('garage-open', garage);
    if (this.helpEl) this.helpEl.hidden = !help;
    if (this.scrimEl) this.scrimEl.hidden = !(garage || help);
    if (garage) this.#markActiveVehicle();
  }

  get garageOpen() {
    return this.garageEl.classList.contains('garage-open');
  }

  // Tapping the Garage button again puts it away, so the button is its own close control.
  toggleGarage() {
    this.#setExclusive(this.garageOpen ? null : 'garage');
  }

  closeGarage() {
    this.#setExclusive(null);
  }

  update(dt) {
    try {
      this.#update(dt);
    } catch (error) {
      this.updateErrors = (this.updateErrors ?? 0) + 1;
      if (this.updateErrors <= 2) console.error('UIManager.update failed', error?.stack || error);
    }
  }

  #update(dt) {
    this.elapsed += dt;
    if (this.toastTimer > 0) {
      this.toastTimer -= dt;
      if (this.toastTimer <= 0) this.toastEl.classList.remove('is-visible');
    }
    if (this.elapsed < 0.08) return;
    this.elapsed = 0;

    const game = this.game;
    const speed = Math.round(game.vehicle?.getSpeedKph() ?? 0);
    const maxSpeed = game.vehicle?.profile?.maxSpeed * 3.6 || 100;
    const speedRatio = Math.min(1, speed / maxSpeed);

    this.root.querySelector('[data-stat="speed"]').textContent = speed;
    this.root.querySelector('[data-stat="fps"]').textContent = `FPS ${game.stats.fps}`;
    this.root.querySelector('[data-stat="score"]').textContent = `${game.score.toLocaleString()} pts`;
    this.root.querySelector('[data-stat="coins"]').textContent = `${game.coinsCollected} coins`;
    this.root.querySelector('[data-stat="landmarks"]').textContent = `${game.landmarksFound.size}/6 spots`;
    this.root.querySelector('[data-stat="vehicle"]').textContent = game.vehicle?.profile?.label ?? '—';
    this.root.querySelector('[data-stat="gear"]').textContent = this.#gearLabel(speed);
    this.root.querySelector('[data-stat="ground"]').textContent = game.vehicle?.airborne
      ? (game.vehicle.airTime > 0.6 ? 'airborne' : 'air')
      : (game.driftActive ? 'drifting' : 'grounded');

    if (this.speedArc) {
      this.speedArc.style.strokeDashoffset = `${this.arcLength * (1 - speedRatio * 0.98)}`;
    }

    const freeButton = this.root.querySelector('[data-action="camera"]');
    if (freeButton) {
      const free = game.cameraMode === 'free';
      if (freeButton.dataset.state !== String(free)) {
        freeButton.dataset.state = String(free);
        freeButton.textContent = free ? 'FOLLOW' : 'FREE';
      }
    }

    this.#drawMap();
  }

  #gearLabel(speed) {
    const vehicle = this.game.vehicle;
    if (!vehicle) return 'N';
    if (vehicle.forwardSpeed < -0.4) return 'R';
    if (speed < 1) return 'N';
    const ratio = speed / ((vehicle.profile.maxSpeed * 3.6) || 1);
    if (ratio < 0.22) return '1';
    if (ratio < 0.45) return '2';
    if (ratio < 0.7) return '3';
    return '4';
  }

  #drawMap() {
    const game = this.game;
    if (!game.city || !this.mapContext) return;
    const ctx = this.mapContext;
    const size = this.mapCanvas.width;
    const center = size / 2;
    const scale = this.mapScale ?? size / 860;
    // Every stroke and marker is expressed against a 190px reference so the map looks the same
    // at any device pixel ratio.
    const u = size / 190;
    const position = game.vehicle.getPosition();

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(14, 26, 34, 0.72)';
    ctx.fillRect(0, 0, size, size);

    // Street grid, clipped to the panel.
    ctx.strokeStyle = 'rgba(190, 210, 225, 0.35)';
    ctx.lineWidth = 3.5 * u;
    const pitch = game.city.layout.blockPitch;
    const span = Math.ceil(center / (pitch * scale)) + 1;
    for (let line = -span; line <= span; line += 1) {
      const offset = line * pitch * scale;
      ctx.beginPath();
      ctx.moveTo(center + offset, 0);
      ctx.lineTo(center + offset, size);
      ctx.moveTo(0, center + offset);
      ctx.lineTo(size, center + offset);
      ctx.stroke();
    }

    const toMap = (x, z) => [center + x * scale, center + z * scale];

    // Landmarks the player has still to find sit dim; found ones get a label.
    for (const landmark of game.city.layout.landmarks) {
      const [lx, ly] = toMap(landmark.x, landmark.z);
      if (lx < -20 || ly < -20 || lx > size + 20 || ly > size + 20) continue;
      const found = game.landmarksFound.has(landmark.id);
      ctx.fillStyle = found ? '#facc15' : 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.arc(lx, ly, (found ? 4.6 : 3) * u, 0, Math.PI * 2);
      ctx.fill();
      if (found) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.92)';
        ctx.font = `${8 * u}px system-ui, sans-serif`;
        ctx.fillText(landmark.name, lx + 6 * u, ly + 3 * u);
      }
    }

    // Nearby traffic and uncollected coins, so the map reads as a live picture of the area.
    if (game.traffic?.cars) {
      ctx.fillStyle = 'rgba(226, 232, 240, 0.55)';
      for (const car of game.traffic.cars) {
        const [tx, ty] = toMap(car.x, car.z);
        if (tx < 0 || ty < 0 || tx > size || ty > size) continue;
        ctx.fillRect(tx - 1.6 * u, ty - 1.6 * u, 3.2 * u, 3.2 * u);
      }
    }
    ctx.fillStyle = 'rgba(250, 204, 21, 0.85)';
    for (const coin of game.city.layout.coins) {
      if (coin.collected) continue;
      const [cx2, cy2] = toMap(coin.x, coin.z);
      if (cx2 < 0 || cy2 < 0 || cx2 > size || cy2 > size) continue;
      ctx.beginPath();
      ctx.arc(cx2, cy2, 1.7 * u, 0, Math.PI * 2);
      ctx.fill();
    }

    // Player arrow. The sprite points up, so the rotation that aims it along the mapped forward
    // vector (x → right, z → down) is atan2(fx, -fz).
    const [px, py] = toMap(position.x, position.z);
    const forward = game.vehicle.getForwardVector();
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(Math.atan2(forward.x, -forward.z));
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.moveTo(0, -7 * u);
    ctx.lineTo(4.8 * u, 5.6 * u);
    ctx.lineTo(-4.8 * u, 5.6 * u);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const xLabel = Number.isFinite(position.x) ? Math.round(position.x) : 0;
    const zLabel = Number.isFinite(position.z) ? Math.round(position.z) : 0;
    this.root.querySelector('[data-stat="coordinates"]').textContent = `x ${xLabel} · z ${zLabel}`;
    const nearest = game.city.nearestLandmark(position);
    const nextEl = this.root.querySelector('[data-stat="next"]');
    if (nextEl) {
      nextEl.textContent = nearest
        ? `${nearest.landmark.name} · ${Math.round(nearest.distance)}m`
        : 'nearest: —';
    }
  }

  showToast(message) {
    if (!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.classList.add('is-visible');
    this.toastTimer = 2.2;
  }

  setImpact(strength = 0.5) {
    this.root.classList.remove('impact');
    void this.root.offsetWidth;
    this.root.classList.add('impact');
    if (!this.vignetteEl) return;
    this.vignetteEl.style.setProperty('--impact', String(Math.min(1, strength)));
    this.vignetteEl.classList.remove('is-hit');
    void this.vignetteEl.offsetWidth;
    this.vignetteEl.classList.add('is-hit');
  }

  toggleHidden() {
    this.hidden = !this.hidden;
    this.#syncVisibility();
  }

  #syncVisibility() {
    document.body.classList.toggle('hidden-ui', this.hidden);
    if (this.hidden) this.closeGarage();
    // Only the in-bar button gets relabelled; the floating one always reads "Show HUD".
    const barToggle = this.root.querySelector('.hud-top [data-action="toggle-ui"]');
    if (barToggle) {
      barToggle.textContent = this.hidden ? 'HUD' : 'Hide';
      barToggle.setAttribute('aria-pressed', String(!this.hidden));
    }
  }

  #renderVehicles() {
    const list = this.root.querySelector('[data-vehicle-list]');
    if (!list) return;
    list.innerHTML = '';
    for (const id of VEHICLE_ORDER) {
      const profile = VEHICLE_PROFILES[id];
      const button = document.createElement('button');
      button.className = 'garage-card';
      button.dataset.vehicleId = id;
      button.innerHTML = `
        <span class="garage-icon">${GARAGE_ICON[id]}</span>
        <span class="garage-copy">
          <strong>${profile.label}</strong>
          <em>${profile.className}</em>
          <span class="garage-bars">
            <i style="--v:${profile.stats.speed}"></i>
            <i style="--v:${profile.stats.accel}"></i>
            <i style="--v:${profile.stats.grip}"></i>
          </span>
        </span>
        <span class="garage-mass">${(profile.mass / 1000).toFixed(1)}t</span>
      `;
      button.addEventListener('click', () => {
        this.onVehicleSelect(id);
        this.closeGarage();
      });
      list.appendChild(button);
    }
    this.#markActiveVehicle();
  }

  #markActiveVehicle() {
    const active = this.game.vehicle?.profile?.id;
    this.root.querySelectorAll('.garage-card').forEach((card) => {
      card.dataset.active = String(card.dataset.vehicleId === active);
    });
  }

  async #saveGarage() {
    const status = this.root.querySelector('[data-save-status]');
    try {
      const result = await this.garageStore.save({
        selected_vehicle: this.game.vehicle.profile.id,
        selectedVehicle: this.game.vehicle.profile.id,
        odometer_meters: Math.round(this.game.vehicle.odometer),
        score: this.game.score
      });
      status.textContent = result.mode === 'supabase'
        ? 'Saved to Supabase.'
        : 'Saved in this browser.';
    } catch (error) {
      status.textContent = `Save failed: ${error.message}`;
    }
  }

  async #login() {
    const status = this.root.querySelector('[data-save-status]');
    const email = this.root.querySelector('[data-email-input]').value.trim();
    if (!email) {
      status.textContent = 'Enter an email first.';
      return;
    }
    try {
      await this.garageStore.signInWithMagicLink(email);
      status.textContent = 'Magic link sent. Open it, then press Save.';
    } catch (error) {
      status.textContent = error.message;
    }
  }
}
