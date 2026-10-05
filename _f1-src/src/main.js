/**
 * Entry point: wires the championship state machine to the game and the UI.
 *
 * The flow is linear -- calendar, garage, qualifying, race, results -- and every
 * transition goes through `handleAction`, so there is a single dispatch table
 * and no hidden control flow between screens.
 */

import './styles.css';

import { Game } from './core/Game.js';
import { HELP_HTML, UIManager } from './ui/UIManager.js';
import { CIRCUITS, getCircuit } from './track/circuits.js';
import { formatLapTime, formatPosition } from './util/math.js';
import { SESSION_TYPE } from './race/RaceSession.js';
import {
  applySegment,
  createQualifying,
  entriesForSegment,
  gridFrom,
  isComplete,
  segmentName,
  QUALIFYING_LAPS
} from './race/qualifying.js';
import { UPGRADES } from './physics/upgrades.js';
import {
  QUICK_RACE_SCREEN,
  chosenDriver,
  createQuickRace,
  fieldFor,
  quickRaceEntries,
  selectCircuit,
  selectCompound,
  selectDriver,
  selectTeam,
  selectWeather,
  setupSummary
} from './race/quickRace.js';
import { DRIVERS, TEAM_NAMES, teamFor } from './physics/drivers.js';
import { COMPOUNDS, WEATHER, surfaceGripFor } from './physics/compounds.js';
import { centrelineFor } from './track/circuitData.js';
import { buildTrack } from './track/trackGeometry.js';
import { driverAvatar, teamBadge } from './ui/avatars.js';
import { cachedTrackMapPath, startLinePoint } from './ui/trackMap.js';
import { MotionControl } from './core/MotionControl.js';
import {
  SESSION,
  applyRaceResult,
  buyUpgrade,
  calendarView,
  clearSave,
  createChampionship,
  currentRound,
  loadChampionship,
  nextUpgradeCost,
  playerEntry,
  saveChampionship,
  standings
} from './championship/ChampionshipManager.js';

/** How often the finished-session flag is checked, in milliseconds. */
const FINISH_POLL_MS = 200;

const container = document.getElementById('app');
/*
 * Appended to <body>, not to #app.
 *
 * The portrait rule hides `#app` outright, so a hint placed inside it is hidden
 * along with the game -- which is a blank screen with no explanation, which is
 * exactly what this is meant to prevent.
 */
document.body.insertAdjacentHTML(
  'beforeend',
  `<div class="rotate-hint">
     <div class="rotate-icon">📱</div>
     <div class="rotate-text">Rotate your device to landscape</div>
     <div class="rotate-sub">This game needs a wide screen</div>
   </div>`
);

/**
 * Ask the platform to lock to landscape.
 *
 * Best effort, and it has to be: `screen.orientation.lock` works on Android
 * Chrome and desktop Chromium, and is a no-op or throws on iOS Safari, which has
 * no web orientation lock at all on iPhone. The blocking overlay in CSS is the
 * actual mechanism there -- it cannot be dismissed, so a player in portrait gets a
 * clear instruction rather than an unplayable screen.
 *
 * Called on load and again on the first interaction, because a lock requested
 * outside a user gesture is rejected on some platforms.
 */
function lockLandscape() {
  const orientation = screen.orientation;
  if (!orientation?.lock) return;
  orientation.lock('landscape').catch(() => {
    /* Not supported here. The CSS overlay covers it. */
  });
}
lockLandscape();
window.addEventListener('pointerdown', lockLandscape, { once: true });

const championship = createChampionship();
loadChampionship(championship);

const uiRoot = document.createElement('div');
uiRoot.className = 'ui-root';
container.appendChild(uiRoot);

const game = new Game(container, {
  onUpdate: (telemetry) => {
    ui.update(telemetry);
    ui.updateStandings(
      game.session?.order.entries,
      playerEntry(championship).short,
      telemetry.totalLaps
    );
  },
  onImpact: (strength) => {
    ui.flashImpact(strength / 12);
    game.rig?.addShake(Math.min(1, strength / 9));
  },
  // Start lights and the minimap. Both are fed from the session and the track rather
  // than timed in the UI, so the gantry and the hold can never disagree.
  onStartLights: (start) => ui.setStartLights(start),
  onGreenFlag: () => ui.showGreenFlag(),
  onMinimap: (circuit) => ui.setMinimapCircuit(circuit),
  onMinimapFrame: (dt, project, cars) =>
    ui.updateMinimap(dt, project, cars.map((car) => ({ x: car.physics.x, z: car.physics.z })))
});

// Built after the game, because the game owns the input controller. Constructing
// the UI first and attaching input later left `input` null, and the UI's touch
// binding is a silent no-op when input is null -- so the on-screen controls were
// built, styled and visible, and had no event handlers whatsoever.
const ui = new UIManager(uiRoot, { input: game.input });

game.onLap = (lapTime, bestLap) => {
  const isBest = lapTime <= bestLap;
  const delta = bestLap - lapTime;
  ui.alert(
    isBest ? `LAP ${formatLapTime(lapTime)}` : `LAP ${formatLapTime(lapTime)}  ${delta > 0 ? '+' : ''}${delta.toFixed(3)}`,
    isBest ? 'good' : 'neutral'
  );
};

/** Which screen is showing, and the session the results screens belong to. */
let state = 'boot';
let activeSession = null;
/** Grid decided by qualifying, consumed by the race. */
let qualifyingGrid = null;

/**
 * Qualifying in progress: which segment, who is still in, and the best laps so far.
 *
 * Real qualifying is a knockout (see `race/qualifying.js`), so the session lifecycle has to
 * be able to run a segment, fold the result in, and start the next one.
 */
let qualifyingSession = null;

/** What the qualifying results panel's button should do, set when that panel is shown. */
let onQualifyingContinue = null;

/* ------------------------------------------------------------- screens -- */

function showTitle() {
  state = 'title';
  const inProgress = championship.round > 0 && !championship.finished;
  const finished = championship.finished;

  ui.showPanel(`
    <div class="panel">
      <h1 class="panel-title">APEX GP</h1>
      <p class="panel-sub">Formula 1 Championship</p>
      <p class="panel-note">
        ${CIRCUITS.length} rounds · qualifying then race · upgrades between rounds ·
        full championship points.
      </p>
      <div class="panel-actions">
        <button type="button" class="panel-button" data-action="continue">
          ${finished ? 'Final standings' : inProgress ? 'Continue championship' : 'Start championship'}
        </button>
        <button type="button" class="panel-button" data-action="quick-race">Quick race</button>
        ${inProgress ? '<button type="button" class="panel-button panel-button-secondary" data-action="new-season">New season</button>' : ''}
        ${inProgress || finished ? '<button type="button" class="panel-button panel-button-secondary" data-action="view-standings">Standings</button>' : ''}
        <button type="button" class="panel-button panel-button-secondary" data-action="controls">Controls</button>
      </div>
    </div>
  `);
}

/**
 * Control scheme: on-screen stick or gyroscope.
 *
 * Reachable from the title screen and from the pause menu, because the decision is
 * not permanent -- it depends on whether you are holding the phone in two hands,
 * which is a different answer on a train than it is at a desk, and it depends on
 * which hand the phone is in.
 *
 * Choosing motion asks for the sensor from inside this click handler, because iOS
 * requires the permission request to happen inside a user gesture. Requesting it
 * anywhere else returns `denied` silently, which presents to the player as a
 * control scheme that is selected and does nothing.
 */
function showControls() {
  const supported = MotionControl.isSupported(window);
  const needsPermission = MotionControl.needsPermission(window);
  const current = game.input.controlScheme;
  const motion = game.input.motion;

  /*
   * Anything that would stop motion working has to be visible *before* the player
   * picks it, not after. A control scheme that fails on first use looks broken; one
   * that says "this needs HTTPS" while still on the previous scheme is just
   * information.
   */
  let blocking = '';
  if (MotionControl.isBlockedByPolicy(window)) {
    blocking = '<div class="setup-warning" data-tone="warn">Motion controls need HTTPS. This page is on a plain http:// address, so the browser will never report any movement &mdash; it will not even prompt for permission. Open the https:// address instead.</div>';
  } else if (!supported) {
    blocking = '<div class="setup-warning" data-tone="warn">This browser does not report orientation, so motion controls are unavailable.</div>';
  }

  let status = '';
  if (motionFailure) {
    status = `<div class="setup-warning" data-tone="warn">${motionFailure}</div>`;
  } else if (motion) {
    const failure = motion.describeFailure();
    if (failure) status = `<div class="setup-warning" data-tone="warn">${failure}</div>`;
    else if (motion.active) {
      const calibrated = motion.neutral.x === 0 && motion.neutral.y === 0 && motion.beta === null;
      status = `<div class="setup-note">Motion is live. Tilt the phone to steer; throttle and brake are the two buttons at the bottom of the screen. ${
        calibrated ? 'Hold the phone the way you will drive, then press Calibrate.' : 'Press Calibrate whenever you change how you are holding it.'
      }</div>`;
    }
  } else if (needsPermission) {
    status = '<div class="setup-note">Choosing motion will ask for access to the motion sensor. On iPhone this also needs Settings &gt; Safari &gt; Motion &amp; Orientation Access switched on.</div>';
  }

  ui.showPanel(`
    <div class="panel">
      <h1 class="panel-title">Controls</h1>
      <p class="panel-sub">${current === 'motion' ? 'Motion' : 'On-screen'}</p>

      ${blocking}

      <div class="setup">
        <section class="setup-block">
          <h2 class="setup-label">Scheme</h2>
          <div class="chips">
            <button type="button" class="chip${current === 'touch' ? ' is-selected' : ''}" data-scheme="touch">
              <span><strong>On-screen stick</strong><em>Drag to steer · up is throttle</em></span>
            </button>
            <button type="button" class="chip${current === 'motion' ? ' is-selected' : ''}" data-scheme="motion"
                    ${MotionControl.isBlockedByPolicy(window) ? 'disabled' : ''}>
              <span><strong>Motion</strong><em>${
                MotionControl.isBlockedByPolicy(window)
                  ? 'Needs HTTPS'
                  : 'Tilt to steer · tilt to drive'
              }</em></span>
            </button>
          </div>
        </section>

        ${
          current === 'motion'
            ? `<section class="setup-block">
                 <h2 class="setup-label">Motion</h2>
                 <div class="chips">
                   <button type="button" class="chip" data-calibrate>Calibrate</button>
                   <button type="button" class="chip${motion?.inverted ? ' is-selected' : ''}" data-invert>
                     ${motion?.inverted ? 'Tilt reversed' : 'Reverse tilt'}
                   </button>
                 </div>
                 ${status}
               </section>`
            : ''
        }
      </div>

      ${motionFailure ? `<div class="setup-warning" data-tone="warn">${motionFailure}</div>` : ''}

      <div class="panel-actions">
        <button type="button" class="panel-button panel-button-secondary" data-action="${state === 'paused' ? 'resume' : 'title'}">Back</button>
      </div>
    </div>
  `);

  const panel = ui.overlayPanel;

  panel.querySelectorAll('[data-scheme]').forEach((button) => {
    button.addEventListener('click', async () => {
      await setControlScheme(button.dataset.scheme);
      showControls();
    });
  });

  panel.querySelector('[data-calibrate]')?.addEventListener('click', () => {
    game.input.motion?.calibrate();
    showControls();
  });

  panel.querySelector('[data-invert]')?.addEventListener('click', () => {
    const motionControl = game.input.motion;
    if (motionControl) motionControl.setInverted(!motionControl.inverted);
    showControls();
  });
}

/**
 * Switch control scheme, requesting sensor access if motion is being turned on.
 *
 * Turning motion *off* stops the listener rather than just ignoring it: a
 * gyroscope left running drains battery noticeably, and the player explicitly
 * asked to stop using it.
 *
 * @param {'touch' | 'motion'} scheme
 */
async function setControlScheme(scheme) {
  const input = game.input;
  motionFailure = null;

  if (scheme === 'motion') {
    if (MotionControl.isBlockedByPolicy(window)) {
      motionFailure = 'Motion sensors need HTTPS, and this page is not on a secure connection.';
      input.controlScheme = 'touch';
      ui.setControlScheme('touch');
      return false;
    }
    if (!MotionControl.isSupported(window)) {
      motionFailure = 'This browser does not report orientation, so motion controls are unavailable.';
      input.controlScheme = 'touch';
      ui.setControlScheme('touch');
      return false;
    }

    if (!input.motion) input.motion = new MotionControl({ target: window });
    const inverted = input.motion.inverted;
    const neutral = input.motion.neutral;

    // Must happen inside the click handler. See the note on showControls.
    const granted = MotionControl.needsPermission(window)
      ? await MotionControl.requestPermission(window)
      : true;
    if (!granted) {
      input.motion.status = 'denied';
      motionFailure = 'Motion access was declined. On iPhone this has to be allowed in Settings, then try again.';
      input.controlScheme = 'touch';
      ui.setControlScheme('touch');
      return false;
    }

    const started = await input.motion.start();
    if (!started) {
      motionFailure = input.motion.describeFailure() ?? 'Motion controls did not start.';
      // Put the on-screen controls back. A previous successful attempt may have left
      // the stick hidden, and a scheme that was refused must not also take away the
      // scheme that was already working -- that leaves the player with no steering
      // at all, which is worse than never having offered motion.
      input.controlScheme = 'touch';
      ui.setControlScheme('touch');
      return false;
    }

    // Re-apply the pose settings, because `start()` may have been called earlier in
    // this session and a failed attempt should not have cost the player their
    // calibration or their chosen axis direction.
    input.motion.setInverted(inverted);
    input.motion.neutral = { ...neutral };
    input.controlScheme = 'motion';
    motionFailure = null;
    saveControlScheme('motion');
    ui.setControlScheme('motion');
    return true;
  }

  input.motion?.stop();
  input.controlScheme = 'touch';
  saveControlScheme('touch');
  ui.setControlScheme('touch');
  return true;
}

/** Remember the choice. Absent or blocked storage is not worth reporting. */
function saveControlScheme(scheme) {
  try {
    window.localStorage?.setItem('apexgp.controls', scheme);
  } catch {
    // Private browsing, or storage disabled. The scheme still applies this session.
  }
}

function loadControlScheme() {
  try {
    return window.localStorage?.getItem('apexgp.controls') === 'motion' ? 'motion' : 'touch';
  } catch {
    return 'touch';
  }
}

/**
 * Why the last attempt to switch to motion controls failed.
 *
 * Without this, choosing motion on a device with no gyroscope silently does
 * nothing at all: the switch is refused, the screen re-renders looking unchanged,
 * and the player is left tapping a button that appears broken. The whole point of
 * detecting these cases is to be able to say what went wrong.
 */
let motionFailure = null;

/* --------------------------------------------------------- quick race -- */

/**
 * Quick Race: pick any circuit and any team and race immediately.
 *
 * Kept deliberately separate from the championship flow. The season is strictly
 * sequential by design -- rounds are raced in order, points accumulate, upgrades
 * cost development points earned from the previous round -- and being unable to
 * jump to Silverstone in round one is correct behaviour for that mode, not an
 * oversight. This is the escape hatch: a standalone race with no season
 * consequences, no development economy and no save.
 */

const quickRace = createQuickRace();

function showQuickRaceVenues() {
  state = 'quick-venue';
  quickRace.screen = QUICK_RACE_SCREEN.circuit;

  // The preview is the real centreline, drawn as an SVG outline. Building the map
  // path costs a few hundred point projections, so they are cached per circuit --
  // otherwise every card redraws its shape each time the menu opens.
  const previews = new Map();
  for (const circuit of CIRCUITS) {
    if (!previews.has(circuit.id)) {
      const points = centrelineFor(circuit.id);
      previews.set(circuit.id, {
        path: cachedTrackMapPath(circuit.id, points, circuit.length * 1000),
        start: startLinePoint(points)
      });
    }
  }

  const cards = CIRCUITS.map((circuit) => {
    const selected = circuit.id === quickRace.circuitId;
    const preview = previews.get(circuit.id);
    return `
      <button type="button" class="venue${selected ? ' is-selected' : ''}" data-venue="${circuit.id}">
        <svg class="venue-map" viewBox="0 0 100 100" aria-hidden="true">
          <path d="${preview.path}" fill="none" stroke="currentColor" stroke-width="3.5"
                stroke-linejoin="round" stroke-linecap="round" opacity="0.85"/>
          <circle cx="${preview.start.x.toFixed(2)}" cy="${preview.start.y.toFixed(2)}" r="4" fill="var(--accent)"/>
        </svg>
        <span class="venue-body">
          <span class="venue-round">${circuit.venue}</span>
          <span class="venue-name">${circuit.name}</span>
          <span class="venue-meta">${circuit.country} · ${circuit.length.toFixed(3)} km · ${circuit.cornerCount} corners</span>
          <span class="venue-tag">${circuit.tag}</span>
        </span>
      </button>`;
  }).join('');

  ui.showPanel(`
    <div class="panel">
      <h1 class="panel-title">Quick Race</h1>
      <p class="panel-sub">Choose a circuit</p>
      <p class="panel-note">
        ${CIRCUITS.length} real circuits, drawn to scale from the real layout. A single race, no effect on the championship.
      </p>
      <div class="venues">${cards}</div>
      <div class="panel-actions">
        <button type="button" class="panel-button" data-action="quick-race-setup">
          Next · setup
        </button>
        <button type="button" class="panel-button panel-button-secondary" data-action="title">Back</button>
      </div>
    </div>
  `);

  ui.overlayPanel.querySelectorAll('[data-venue]').forEach((button) => {
    button.addEventListener('click', () => {
      selectCircuit(quickRace, button.dataset.venue);
      showQuickRaceSetup();
    });
  });
}

/**
 * The setup screen: team, driver, tyre compound, weather.
 *
 * All four are choices that change how the race is driven rather than what it is,
 * so they sit together. The circuit is fixed by the time this screen is reached.
 */
function showQuickRaceSetup() {
  state = 'quick-setup';
  quickRace.screen = QUICK_RACE_SCREEN.setup;
  const summary = setupSummary(quickRace);
  const { circuit, compound, weather, driver } = summary;

  const teamCards = TEAM_NAMES.map((team) => {
    const rating = teamFor(team);
    const selected = team === quickRace.team;
    return `
      <button type="button" class="chip${selected ? ' is-selected' : ''}" data-team="${team}">
        ${teamBadge(team, rating.base, 18)}
        <span>${team}</span>
      </button>`;
  }).join('');

  // Only the chosen team's real drivers, plus a reserve seat.
  const teamDrivers = DRIVERS.filter((candidate) => candidate.team === quickRace.team);
  const driverCards = [
    `<button type="button" class="chip chip-driver${!quickRace.driverShort ? ' is-selected' : ''}" data-driver="">
       <span class="chip-avatar">${driverAvatar({ short: 'YOU', colour: teamFor(quickRace.team).base, accent: 0xffffff }, { size: 30 })}</span>
       <span>Reserve seat</span>
     </button>`,
    ...teamDrivers.map(
      (candidate) => `
      <button type="button" class="chip chip-driver${quickRace.driverShort === candidate.short ? ' is-selected' : ''}" data-driver="${candidate.short}">
        <span class="chip-avatar">${driverAvatar(candidate, { size: 30 })}</span>
        <span>${candidate.name}</span>
      </button>`
    )
  ].join('');

  const compoundCards = COMPOUNDS.map((option) => {
    const selected = option.id === quickRace.compound;
    return `
      <button type="button" class="chip chip-compound${selected ? ' is-selected' : ''}" data-compound="${option.id}">
        <span class="compound-band" style="background:${numberToCss(option.colour)}"></span>
        <span>
          <strong>${option.name}</strong>
          <em>~${summary.lifeLaps === 0 ? '' : ''}${
            COMPOUNDS.find((c) => c.id === option.id) ? Math.max(1, Math.round(0.2 / (option.wearRate * (1 + (1 - weather.grip) * 0.5)))) : 1
          } laps</em>
        </span>
      </button>`;
  }).join('');

  const weatherCards = WEATHER.map((option) => {
    const selected = option.id === quickRace.weather;
    return `
      <button type="button" class="chip chip-weather${selected ? ' is-selected' : ''}" data-weather="${option.id}">
        <span class="weather-swatch" style="background:${numberToCss(option.sky)}"></span>
        <span><strong>${option.name}</strong><em>${Math.round(surfaceGripFor(quickRace.compound, option.id) * 100)}% grip</em></span>
      </button>`;
  }).join('');

  const warning = summary.suitability.ok
    ? ''
    : `<div class="setup-warning" data-tone="warn">${summary.suitability.note}</div>`;

  ui.showPanel(`
    <div class="panel">
      <h1 class="panel-title">${circuit.name}</h1>
      <p class="panel-sub">${circuit.venue} · ${weather.name.toLowerCase()} · ${compound.name}s</p>

      <div class="setup">
        <section class="setup-block">
          <h2 class="setup-label">Team</h2>
          <div class="chips">${teamCards}</div>
        </section>
        <section class="setup-block">
          <h2 class="setup-label">Driver</h2>
          <div class="chips">${driverCards}</div>
          <p class="setup-note">
            Taking a named driver's seat puts you in their car for this race only. The rest of the grid stays full.
          </p>
        </section>
        <section class="setup-block">
          <h2 class="setup-label">Tyres</h2>
          <div class="chips">${compoundCards}</div>
          ${warning}
        </section>
        <section class="setup-block">
          <h2 class="setup-label">Weather</h2>
          <div class="chips">${weatherCards}</div>
        </section>
      </div>

      <div class="panel-actions">
        <button type="button" class="panel-button" data-action="quick-race-start">Go racing</button>
        <button type="button" class="panel-button panel-button-secondary" data-action="quick-race-venues">Change circuit</button>
        <button type="button" class="panel-button panel-button-secondary" data-action="title">Back</button>
      </div>
    </div>
  `);

  const panel = ui.overlayPanel;
  panel.querySelectorAll('[data-team]').forEach((button) =>
    button.addEventListener('click', () => {
      selectTeam(quickRace, button.dataset.team);
      showQuickRaceSetup();
    })
  );
  panel.querySelectorAll('[data-driver]').forEach((button) =>
    button.addEventListener('click', () => {
      selectDriver(quickRace, button.dataset.driver || null);
      showQuickRaceSetup();
    })
  );
  panel.querySelectorAll('[data-compound]').forEach((button) =>
    button.addEventListener('click', () => {
      selectCompound(quickRace, button.dataset.compound);
      showQuickRaceSetup();
    })
  );
  panel.querySelectorAll('[data-weather]').forEach((button) =>
    button.addEventListener('click', () => {
      selectWeather(quickRace, button.dataset.weather);
      showQuickRaceSetup();
    })
  );
}

function numberToCss(value) {
  return `#${value.toString(16).padStart(6, '0')}`;
}

function showCalendar() {
  state = 'calendar';
  const rows = calendarView(championship)
    .map((round) => {
      const badge = round.state === 'done' ? 'COMPLETE' : round.state === 'next' ? 'NEXT' : `ROUND ${round.round}`;
      const detail =
        round.state === 'done'
          ? `Winner ${round.results.find((r) => r.position === 1)?.short ?? '—'}`
          : `${round.circuit.tag} · ${round.circuit.laps} laps`;
      return `
        <div class="calendar-row" data-state="${round.state}">
          <span class="calendar-round">R${round.round}</span>
          <span>
            <span class="calendar-name">${round.circuit.name}</span><br>
            <span class="calendar-meta">${round.circuit.country} · ${round.circuit.blurb}</span>
          </span>
          <span class="calendar-meta">${badge}<br>${detail}</span>
        </div>`;
    })
    .join('');

  const next = currentRound(championship);

  ui.showPanel(`
    <div class="panel">
      <h1 class="panel-title">${championship.finished ? 'Season complete' : `Round ${championship.round + 1}`}</h1>
      <p class="panel-sub">${championship.finished ? 'All rounds raced' : next?.name ?? ''}</p>
      <div class="calendar">${rows}</div>
      <div class="panel-actions">
        ${
          championship.finished
            ? '<button type="button" class="panel-button" data-action="view-standings">Final standings</button>'
            : '<button type="button" class="panel-button" data-action="open-garage">Pre-race garage</button>'
        }
        <button type="button" class="panel-button panel-button-secondary" data-action="view-standings">Standings</button>
        <button type="button" class="panel-button panel-button-secondary" data-action="title">Back</button>
      </div>
    </div>
  `);
}

function showGarage() {
  state = 'garage';
  const entry = playerEntry(championship);

  const cards = UPGRADES.map((upgrade) => {
    const level = entry.upgrades[upgrade.id] ?? 0;
    const maxTier = upgrade.values.length - 1;
    const cost = nextUpgradeCost(championship, upgrade.id);
    const affordable = cost !== null && entry.developmentPoints >= cost;
    const pips = upgrade.values
      .map((_, index) => `<span class="upgrade-pip${index <= level ? ' is-on' : ''}"></span>`)
      .join('');
    return `
      <div class="upgrade">
        <div class="upgrade-head">
          <span class="upgrade-name">${upgrade.name}</span>
          <span class="upgrade-tier">${level}/${maxTier}</span>
        </div>
        <div class="upgrade-desc">${upgrade.description}</div>
        <div class="upgrade-pips">${pips}</div>
        <button type="button" class="upgrade-buy" data-buy="${upgrade.id}" ${affordable ? '' : 'disabled'}>
          ${cost === null ? 'Fully upgraded' : `Upgrade · ${cost} pts`}
        </button>
      </div>`;
  }).join('');

  ui.showPanel(`
    <div class="panel">
      <h1 class="panel-title">Pre-race garage</h1>
      <p class="panel-sub">${currentRound(championship)?.name ?? ''}</p>
      <p class="panel-note">
        Development points: <span class="points-badge">${entry.developmentPoints}</span>
        <span class="panel-meta">Earned by finishing races. Changes apply from this race onwards.</span>
      </p>
      <div class="upgrades">${cards}</div>
      <div class="panel-actions">
        <button type="button" class="panel-button" data-action="start-qualifying">To qualifying</button>
        <button type="button" class="panel-button panel-button-secondary" data-action="calendar">Calendar</button>
      </div>
    </div>
  `);

  ui.overlayPanel.querySelectorAll('[data-buy]').forEach((button) => {
    button.addEventListener('click', () => {
      if (buyUpgrade(championship, button.dataset.buy)) {
        saveChampionship(championship);
        showGarage();
      }
    });
  });
}

function showStandings() {
  state = 'standings';
  const rows = standings(championship)
    .map(
      (row, index) => `
      <tr class="${row.isPlayer ? 'is-player' : ''}">
        <td class="num">${index + 1}</td>
        <td>${row.short} <span class="calendar-meta">${row.team}</span></td>
        <td class="num">${row.wins}</td>
        <td class="num">${row.podiums}</td>
        <td class="num"><b>${row.points}</b></td>
      </tr>`
    )
    .join('');

  ui.showPanel(`
    <div class="panel">
      <h1 class="panel-title">Championship standings</h1>
      <p class="panel-sub">Round ${Math.min(championship.round + 1, CIRCUITS.length)} of ${CIRCUITS.length}</p>
      <table class="table">
        <thead>
          <tr><th class="num">#</th><th>Driver</th><th class="num">Wins</th><th class="num">Podiums</th><th class="num">Pts</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="panel-actions">
        <button type="button" class="panel-button" data-action="calendar">Back to calendar</button>
        <button type="button" class="panel-button panel-button-secondary" data-action="title">Title</button>
      </div>
    </div>
  `);
}

function showPause() {
  if (state !== 'racing') return;
  state = 'paused';
  // Release everything still held, so nothing is stuck down across the pause.
  game.input.clear();
  game.stop();
  ui.showPanel(`
    <div class="panel">
      <h1 class="panel-title">Paused</h1>
      <div class="panel-actions">
        <button type="button" class="panel-button" data-action="resume">Resume</button>
        <button type="button" class="panel-button panel-button-secondary" data-action="controls">Controls</button>
        <button type="button" class="panel-button panel-button-secondary" data-action="restart">Restart session</button>
        <button type="button" class="panel-button panel-button-secondary" data-action="quit">Abandon round</button>
      </div>
    </div>
  `);
}

/**
 * Results panel.
 *
 * `options.title` / `options.note` / `options.onContinue` exist for qualifying, which is a
 * knockout: the panel has to say who went home and then put the survivors back out, rather
 * than jumping straight to the grid the way a race result does.
 */
function showResults(results, fastest, options = {}) {
  state = 'results';
  onQualifyingContinue = options.onContinue ?? null;
  const isRace = activeSession?.type === SESSION_TYPE.race;
  const { title, note, onContinue } = options;

  const rows = results
    .map((result) => {
      const move = result.retired ? 0 : result.gained;
      const tone = move > 0 ? 'up' : move < 0 ? 'down' : '';
      return `
        <div class="result-row ${result.isPlayer ? 'is-player' : ''}">
          <span class="result-pos">${result.retired ? 'DNF' : result.position}</span>
          <span>${result.short} <span class="calendar-meta">${result.team}</span></span>
          <span class="result-move" data-tone="${tone}">${move > 0 ? `▲${move}` : move < 0 ? `▼${-move}` : '–'}</span>
          <span class="result-points">${result.points ?? 0} pts</span>
        </div>`;
    })
    .join('');

  const playerResult = results.find((result) => result.isPlayer);
  const headline = !playerResult
    ? ''
    : playerResult.retired
      ? 'Retired from the race'
      : `Finished ${formatPosition(playerResult.position)}`;
  const fastestNote = fastest?.holder === playerEntry(championship).short ? ' · fastest lap' : '';

  ui.showPanel(`
    <div class="panel">
      <h1 class="panel-title">${title ?? (isRace ? 'Race result' : 'Qualifying result')}</h1>
      <p class="panel-sub">${note ?? `${headline}${fastestNote}`}</p>
      <div>${rows}</div>
      <div class="panel-actions">
        <button type="button" class="panel-button" data-action="${onContinue ? 'qualifying-next' : 'next-round'}">
          ${onContinue ? 'Next session' : isRace ? 'Next round' : 'To the race'}
        </button>
      </div>
    </div>
  `);
}

/* ---------------------------------------------------------- transitions -- */


/**
 * Start a session on a given circuit with a given field.
 *
 * Both the championship and Quick Race come through here, so the build, the
 * loading progress and the error handling are written once. `quickRace` is the
 * only behavioural difference: it selects the circuit and entries rather than
 * reading them from the championship, and it marks the session so results are not
 * applied to the standings.
 */
/**
 * Weather for a championship round when the player did not choose any.
 *
 * Derived from the circuit's own theme rather than picked at random, so a round is
 * reproducible and a night circuit does not inexplicably race in daylight. Only
 * the rainy circuits get rain, because a season where a third of the rounds are wet
 * is not a season anyone recognises.
 *
 * @param {{weather?: string}} circuit
 */
function pickDefaultWeather(circuit) {
  const daylight = circuit.theme?.daylight ?? 1;
  if (daylight < 0.45) return 'clear';          // night rounds stay dry and lit
  if (circuit.id === 'suzuka' || circuit.id === 'interlagos' || circuit.id === 'singapore') {
    return 'light-rain';
  }
  return daylight < 0.85 ? 'cloudy' : 'clear';
}

async function startSession(type, options = {}) {
  const { quickRace = null } = options;

  const round = quickRace ? getCircuit(quickRace.circuitId) : currentRound(championship);
  if (!round) {
    showCalendar();
    return;
  }

  // A qualifying segment runs only the cars that survived the one before it.
  const entries = options.entries
    ?? (quickRace ? quickRaceEntries(quickRace) : championship.entries);
  const totalLaps = type === SESSION_TYPE.race ? round.laps : QUALIFYING_LAPS;
  const startedAt = performance.now();

  // Everything from here is wrapped: an exception during the build would
  // otherwise leave the loading screen up forever with nothing to click, which
  // is indistinguishable from a hang.
  try {
    ui.showLoading(`Building ${round.name}`);
    ui.setLoadingProgress('track', 'Surveying the circuit', startedAt);

    await game.prepareCircuit(round.id, (phase, note) => {
      ui.setLoadingProgress(phase, note, startedAt);
    });

    ui.setLoadingProgress('grid', 'Calling the cars to the grid', startedAt);
    game.startSession({
      entries,
      type,
      totalLaps,
      gridOrder: type === SESSION_TYPE.race ? qualifyingGrid : null,
      // Conditions apply to the whole field, not just the player, so the AI faces the
      // same rain and the same tyre choice it would in a real race.
      conditions: quickRace
        ? { compound: quickRace.compound, weather: quickRace.weather }
        : { compound: 'medium', weather: pickDefaultWeather(round) }
    });

    activeSession = { type, round: round.id, quickRace };
    ui.setSession({ type, circuitName: round.name, totalLaps });
    ui.hidePanel();
    ui.hideLoading();
    ui.root.classList.add('is-racing');
    state = 'racing';
    game.start();
  } catch (error) {
    console.error('Failed to start the session', error);
    ui.hideLoading();
    ui.root.classList.remove('is-racing');
    state = 'title';
    ui.showPanel(`
      <div class="panel">
        <h1 class="panel-title">Could not start the race</h1>
        <p class="panel-note">${String(error?.message ?? error)}</p>
        <div class="panel-actions">
          <button type="button" class="panel-button" data-action="${quickRace ? 'quick-race-venues' : 'calendar'}">
            ${quickRace ? 'Pick another circuit' : 'Back to the calendar'}
          </button>
        </div>
      </div>
    `);
  }
}

function finishSession(results) {
  game.stop();
  ui.root.classList.remove('is-racing');
  const fastest = game.session.fastestLap();
  const type = activeSession.type;

  if (type === SESSION_TYPE.qualifying) {
    const outcome = applySegment(qualifyingSession, results);
    const record = qualifyingSession.history[qualifyingSession.history.length - 1];

    if (!isComplete(qualifyingSession)) {
      // Still to come: say who went home, then put the survivors back out.
      showResults(results, fastest, {
        title: `${record.segment} complete`,
        note: record.eliminated.length
          ? `Eliminated: ${record.eliminated.join(', ')}. ${qualifyingSession.remaining.length} through to the next session.`
          : `${qualifyingSession.remaining.length} through to the next session.`,
        onContinue: () => startSession(SESSION_TYPE.qualifying, {
          entries: entriesForSegment(qualifyingSession)
        })
      });
      return;
    }

    // The grid for the race comes from here; the race itself is not the same
    // session, so this is stored rather than applied immediately.
    qualifyingGrid = gridFrom(qualifyingSession);
    showResults(results, fastest, { title: 'Qualifying' });
    return;
  }

  /*
   * A Quick Race result is not a championship result.
   *
   * Nothing below this line is reached in Quick Race mode: the championship is
   * neither read for points nor written to, and no save happens. Racing at
   * Monaco therefore cannot advance the season or spend development points, which
   * is the whole point of having a mode that is not the season.
   */
  if (!activeSession.quickRace) {
    applyRaceResult(
      championship,
      results.map((result) => ({
        short: result.short,
        position: result.position,
        retired: result.retired,
        fastestLap: result.short === fastest.holder
      })),
      fastest.holder
    );
    saveChampionship(championship);
  }
  showResults(results, fastest);
}

/* ------------------------------------------------------------- dispatch -- */

function handleAction(action) {
  switch (action) {
    case 'title':
      game.stop();
      ui.root.classList.remove('is-racing');
      showTitle();
      break;

    case 'continue':
      showCalendar();
      break;

    case 'quick-race':
      game.stop();
      ui.root.classList.remove('is-racing');
      showQuickRaceVenues();
      break;

    case 'quick-race-venues':
      showQuickRaceVenues();
      break;

    case 'quick-race-setup':
      showQuickRaceSetup();
      break;
    case 'controls':
      showControls();
      break;

    case 'quick-race-start':
      // Straight into the race, no qualifying. The point of this mode is to be
      // racing in a few seconds, and a standalone grid does not need a session to
      // decide the order.
      qualifyingGrid = null;
      startSession(SESSION_TYPE.race, { quickRace });
      break;

    case 'new-season':
      Object.assign(championship, clearSave(championship));
      qualifyingGrid = null;
      showCalendar();
      break;

    case 'calendar':
      showCalendar();
      break;

    case 'view-standings':
      showStandings();
      break;

    case 'open-garage':
      showGarage();
      break;

    case 'start-qualifying':
      qualifyingGrid = null;
      qualifyingSession = createQualifying(championship.entries);
      startSession(SESSION_TYPE.qualifying, { entries: entriesForSegment(qualifyingSession) });
      break;

    case 'qualifying-next':
      onQualifyingContinue?.();
      break;

    case 'start-race':
      startSession(SESSION_TYPE.race);
      break;

    case 'pause':
      // Reachable on touch. Escape does not exist on a phone, so without this
      // there was no way to pause a race on a mobile device at all.
      showPause();
      break;

    case 'resume':
      ui.hidePanel();
      // Drop any input still held, otherwise a thumb that was on the throttle
      // when the pause happened keeps the throttle pinned on resume.
      game.input.clear();
      state = 'racing';
      // `showPause` stops the render loop, which is what actually freezes the
      // race. Restart it here or the screen stays frozen after resuming.
      game.start();
      break;

    case 'restart':
      startSession(activeSession.type, { quickRace: activeSession.quickRace });
      break;

    case 'quit':
      qualifyingGrid = null;
      // A Quick Race has no season to go back to, so it returns to its own entry
      // screen rather than to the calendar. Sending it to the calendar would imply
      // the round had been abandoned part-way through a championship.
      if (activeSession.quickRace) showQuickRaceVenues();
      else showCalendar();
      break;

    case 'next-round':
      if (activeSession.quickRace) {
        showQuickRaceVenues();
      } else if (activeSession.type === SESSION_TYPE.qualifying) {
        startSession(SESSION_TYPE.race);
      } else if (championship.finished) {
        showStandings();
      } else {
        // Qualifying grid is only valid for the race it was set for.
        qualifyingGrid = null;
        showGarage();
      }
      break;

    case 'close-help':
      ui.hidePanel();
      ui.markHelpSeen();
      if (state === 'help') showTitle();
      break;

    default:
      break;
  }
}

ui.onAction = handleAction;
game.onPause = showPause;

// The session signals completion through a flag on its own state, so it is
// polled here rather than pushed through the render callback.
setInterval(() => {
  const session = game.session;
  if (!session || state !== 'racing' || !session.finished || session.reported) return;
  session.reported = true;
  finishSession(session.results());
}, FINISH_POLL_MS);

game.start();

/*
 * Restore the control scheme chosen last session.
 *
 * Deliberately attempted rather than assumed. On a device that grants orientation
 * without asking, motion comes back on its own; on iOS, where the permission has to
 * be requested from inside a user gesture, the request is refused here and the
 * scheme stays on the stick, which is the correct outcome -- better a working
 * thumbstick than a selected-but-dead gyroscope. The controls screen asks again.
 */
if (loadControlScheme() === 'motion') {
  setControlScheme('motion');
}

if (ui.helpSeen) {
  showTitle();
} else {
  state = 'help';
  ui.showPanel(HELP_HTML, { dismissible: true });
}

export { championship, game, ui };