import { VEHICLE_ORDER, VEHICLE_PROFILES } from '../physics/VehicleProfiles.js';
import { hasSupabaseConfig } from '../services/supabaseClient.js';

export class UIManager {
  constructor({ input, garageStore, vehicleManager, stats, onVehicleSelect, onReset }) {
    this.input = input;
    this.garageStore = garageStore;
    this.vehicleManager = vehicleManager;
    this.stats = stats;
    this.onVehicleSelect = onVehicleSelect;
    this.onReset = onReset;
    this.hidden = true;
    this.elapsed = 0;
  }

  mount(parent) {
    this.root = document.createElement('div');
    this.root.className = 'ui-shell';
    this.root.innerHTML = `
      <button class="ui-toggle" data-action="toggle-ui" aria-pressed="false" aria-label="Show overlays">HUD</button>

      <header class="ui-panel ui-overlay absolute left-4 top-16 w-[min(420px,calc(100vw-32px))] p-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="label-kicker">Emir’s Car World</p>
            <h1 class="mt-1 text-2xl font-semibold">Drive KL-inspired streets</h1>
          </div>
          <button class="ui-button" data-action="reset">Reset</button>
        </div>
        <div class="mt-4 grid grid-cols-4 gap-2" aria-label="performance telemetry">
          <span class="perf-pill" data-stat="fps">FPS --</span>
          <span class="perf-pill" data-stat="speed">0 KM/H</span>
          <span class="perf-pill" data-stat="chunks">0 CH</span>
          <span class="perf-pill" data-stat="colliders">0 COL</span>
        </div>
      </header>

      <aside class="garage-drawer ui-panel ui-overlay absolute bottom-4 left-4 w-[min(420px,calc(100vw-32px))] p-4">
        <div class="flex items-end justify-between gap-3">
          <div>
            <p class="label-kicker">Garage</p>
            <h2 class="text-xl font-semibold tracking-[-0.04em]">Select machine</h2>
          </div>
          <button class="ui-button" data-action="save">Save</button>
        </div>
        <div class="mt-4 grid grid-cols-1 gap-2" data-vehicle-list></div>
        <div class="mt-4 border-t border-black pt-4">
          <p class="label-kicker">Persistence</p>
          <div class="mt-2 flex gap-2">
            <input class="ui-input" data-email-input placeholder="email for Supabase magic link" inputmode="email" />
            <button class="ui-button whitespace-nowrap" data-action="login">Login</button>
          </div>
          <p class="mt-2 text-xs leading-5" data-save-status>${hasSupabaseConfig ? 'Supabase configured. RLS-protected saves available after login.' : 'No Supabase env vars detected. Saving locally in this browser.'}</p>
        </div>
      </aside>

      <section class="ui-panel ui-overlay absolute right-4 top-16 hidden w-[min(360px,calc(100vw-32px))] p-4 md:block">
        <p class="label-kicker">Map</p>
        <div class="mt-3 aspect-square border border-black bg-[#ede8dc] p-3">
          <div class="relative h-full w-full overflow-hidden border border-black/30">
            <div class="absolute left-1/2 top-0 h-full w-px bg-black/40"></div>
            <div class="absolute left-0 top-1/2 h-px w-full bg-black/40"></div>
            <div class="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 border border-black bg-black" data-map-dot></div>
          </div>
        </div>
        <p class="mt-3 text-xs leading-5">Drive off-road freely through a KL-inspired city, but buildings, trees, and signs are solid. Drag the world or use Q/E to orbit, mouse wheel or +/- to zoom, C to focus follow view.</p>
      </section>

      <nav class="touch-controls" aria-label="touch driving controls">
        <div class="touch-cluster touch-steer" aria-label="steering controls">
          <button class="touch-button touch-button--steer" data-control="steerLeft" aria-label="Steer left">‹</button>
          <button class="touch-button touch-button--steer" data-control="steerRight" aria-label="Steer right">›</button>
        </div>
        <div class="touch-cluster touch-actions" aria-label="pedal controls">
          <button class="touch-button touch-button--go" data-control="throttle" aria-label="Accelerate">GO</button>
          <button class="touch-button" data-control="brake" aria-label="Brake">BRAKE</button>
          <button class="touch-button touch-button--drift" data-control="handbrake" aria-label="Drift handbrake">DRIFT</button>
        </div>
        <div class="touch-cluster touch-camera" aria-label="camera controls">
          <button class="touch-button touch-button--camera" data-control="cameraZoomIn" aria-label="Zoom camera in">+</button>
          <button class="touch-button touch-button--camera" data-control="cameraZoomOut" aria-label="Zoom camera out">-</button>
          <button class="touch-button touch-button--camera" data-control="resetCamera" aria-label="Focus follow camera">C</button>
        </div>
      </nav>
    `;
    parent.appendChild(this.root);
    this.#syncOverlayVisibility();

    this.root.querySelector('[data-action="toggle-ui"]').addEventListener('click', () => this.toggleHidden());
    this.root.querySelector('[data-action="reset"]').addEventListener('click', () => this.onReset());
    this.root.querySelector('[data-action="save"]').addEventListener('click', () => this.#saveGarage());
    this.root.querySelector('[data-action="login"]').addEventListener('click', () => this.#login());
    this.root.querySelectorAll('[data-control]').forEach((element) => this.input.bindTouchElement(element));
    this.#renderVehicles();
  }

  update(dt) {
    this.elapsed += dt;
    if (this.elapsed < 0.12) return;
    this.elapsed = 0;
    const speed = Math.round(this.vehicleManager.getSpeedKph());
    this.root.querySelector('[data-stat="fps"]').textContent = `FPS ${this.stats.fps}`;
    this.root.querySelector('[data-stat="speed"]').textContent = `${speed} KM/H`;
    this.root.querySelector('[data-stat="chunks"]').textContent = `${this.stats.visibleChunks} CH`;
    this.root.querySelector('[data-stat="colliders"]').textContent = `${this.stats.activeColliders} COL`;
    const p = this.vehicleManager.getPosition();
    const dot = this.root.querySelector('[data-map-dot]');
    const x = Math.max(6, Math.min(94, 50 + p.x / 6));
    const y = Math.max(6, Math.min(94, 50 + p.z / 6));
    dot.style.left = `${x}%`; dot.style.top = `${y}%`;
    this.root.querySelectorAll('[data-vehicle-id]').forEach((button) => {
      button.dataset.active = button.dataset.vehicleId === this.vehicleManager.getCurrentProfile().id ? 'true' : 'false';
    });
  }

  toggleHidden() {
    this.hidden = !this.hidden;
    this.#syncOverlayVisibility();
  }

  #syncOverlayVisibility() {
    document.body.classList.toggle('hidden-ui', this.hidden);
    const toggle = this.root.querySelector('[data-action="toggle-ui"]');
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(!this.hidden));
    toggle.setAttribute('aria-label', this.hidden ? 'Show overlays' : 'Hide overlays');
    toggle.textContent = this.hidden ? 'HUD' : 'Hide';
  }

  #renderVehicles() {
    const list = this.root.querySelector('[data-vehicle-list]');
    list.innerHTML = '';
    for (const id of VEHICLE_ORDER) {
      const profile = VEHICLE_PROFILES[id];
      const button = document.createElement('button');
      button.className = 'ui-button flex min-h-[56px] items-center justify-between text-left';
      button.dataset.vehicleId = id;
      button.innerHTML = `<span><strong class="block text-sm normal-case tracking-normal">${profile.label}</strong><span class="label-kicker">${profile.className}</span></span><span class="font-mono text-[10px] tracking-normal">${Math.round(profile.mass)}kg</span>`;
      button.addEventListener('click', () => this.onVehicleSelect(id));
      list.appendChild(button);
    }
  }

  async #saveGarage() {
    const status = this.root.querySelector('[data-save-status]');
    try {
      const profile = this.vehicleManager.getCurrentProfile();
      const result = await this.garageStore.save({ selected_vehicle: profile.id, selectedVehicle: profile.id, odometer_meters: this.vehicleManager.active?.odometer || 0 });
      status.textContent = result.mode === 'supabase' ? 'Saved to Supabase through RLS-authenticated browser request.' : 'Saved locally. Login to sync with Supabase.';
    } catch (error) {
      status.textContent = `Save failed: ${error.message}`;
    }
  }

  async #login() {
    const status = this.root.querySelector('[data-save-status]');
    const email = this.root.querySelector('[data-email-input]').value.trim();
    if (!email) { status.textContent = 'Enter an email first.'; return; }
    try {
      await this.garageStore.signInWithMagicLink(email);
      status.textContent = 'Magic link sent. Open it, return here, then press Save.';
    } catch (error) {
      status.textContent = error.message;
    }
  }
}
