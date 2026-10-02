import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createCityLayout, BLOCK_PITCH, ROAD_WIDTH, LANDMARKS } from '../src/world/cityLayout.js';

const viteConfig = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const game = readFileSync(new URL('../src/core/Game.js', import.meta.url), 'utf8');
const uiManager = readFileSync(new URL('../src/ui/UIManager.js', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const city = readFileSync(new URL('../src/world/VoxelCity.js', import.meta.url), 'utf8');
const layoutModule = readFileSync(new URL('../src/world/cityLayout.js', import.meta.url), 'utf8');
const physics = readFileSync(new URL('../src/physics/VehiclePhysics.js', import.meta.url), 'utf8');
const models = readFileSync(new URL('../src/physics/VehicleModels.js', import.meta.url), 'utf8');
const profiles = readFileSync(new URL('../src/physics/VehicleProfiles.js', import.meta.url), 'utf8');
const input = readFileSync(new URL('../src/core/InputController.js', import.meta.url), 'utf8');
const landmarksModule = readFileSync(new URL('../src/world/landmarks.js', import.meta.url), 'utf8');

test('Vite app is configured for GitHub Pages emir subpath', () => {
  assert.match(viteConfig, /base:\s*['"]\/emir\/['"]/, 'Vite base should target /emir/');
  assert.match(viteConfig, /outDir:\s*['"]\.\.\/emir['"]/, 'build output should target ../emir');
  assert.match(viteConfig, /emptyOutDir:\s*true/, 'build should replace only the emir route output');
});

test('Emir Car World source remains runnable', () => {
  assert.equal(packageJson.name, 'emir-car-world');
  assert.equal(packageJson.type, 'module');
  assert.match(main, /new Game\(/, 'main entry should bootstrap Game');
  assert.match(game, /__EMIR_DEBUG__/, 'debug query mode should expose state for regression tests');
  assert.match(indexHtml, /id="app"/, 'app host should be present');
});

test('city layout is generated deterministically on a street grid', () => {
  const first = createCityLayout();
  const second = createCityLayout();
  assert.equal(first.buildings.length, second.buildings.length, 'same seed should produce the same layout');
  assert.ok(first.buildings.length > 200, 'city should contain a real number of buildings');
  assert.equal(first.buildings.length, second.buildings.length);
  assert.deepEqual(
    first.buildings.slice(0, 12).map((b) => [b.x, b.z, Math.round(b.h)]),
    second.buildings.slice(0, 12).map((b) => [b.x, b.z, Math.round(b.h)]),
    'building placement should be stable across runs'
  );

  const tower = first.buildings.find((b) => b.h > 40);
  assert.ok(tower, 'downtown should contain genuine towers');
  assert.match(layoutModule, /BLOCK_PITCH = \d+/, 'block pitch should be explicit');
  assert.match(layoutModule, /ROAD_WIDTH = \d+/, 'road width should be explicit');
  assert.ok(BLOCK_PITCH > ROAD_WIDTH * 3, 'blocks should be much wider than the roads that separate them');
});

test('landmarks get their own plots and real structures', () => {
  const layout = createCityLayout();
  assert.equal(layout.landmarks.length, 6, 'six KL landmarks should be placed');
  for (const landmark of layout.landmarks) {
    assert.ok(Number.isFinite(landmark.ground), `${landmark.id} should sit on the terrain`);
    const overlapping = layout.colliders.some(
      (c) => c.kind === 'building' && Math.hypot(c.x - landmark.x, c.z - landmark.z) < 6
    );
    assert.equal(overlapping, false, `${landmark.id} should not have regular blocks on top of it`);
  }
  assert.match(landmarksModule, /function buildTwinTowers/, 'twin towers should have a dedicated builder');
  assert.match(landmarksModule, /skybridge|bridgeY/, 'twin towers should include a skybridge');
  assert.match(landmarksModule, /function buildDomeMosque/, 'mosque should have a dedicated builder');
  assert.match(landmarksModule, /function buildNeedleTower/, 'KL Tower should have a dedicated builder');
});

test('driving uses real suspension, tires and gravity', () => {
  assert.match(physics, /GRAVITY/, 'physics should define gravity explicitly');
  assert.match(physics, /#applySuspension/, 'suspension forces should be applied per wheel');
  assert.match(physics, /#applyTireGrip/, 'lateral tire grip should be modelled');
  assert.match(physics, /#torque\(0, yawTorque/, 'steering must yaw the chassis, not push it vertically');
  assert.doesNotMatch(physics, /yawAssist/, 'the old vertical-impulse steering must not come back');
  // A torque missing an axis arrives in wasm as undefined and NaNs the whole body.
  assert.match(physics, /#torque\(x, y, z\) \{\s*this\.body\.applyTorqueImpulse\(\{ x, y, z \}/, 'torque impulses must carry all three axes');
  assert.doesNotMatch(physics, /applyImpulse\(\{\s*x: 0,\s*y: [^,}]*\}/, 'impulses must not omit an axis');
  assert.match(physics, /#applyEngineAndBrakes/, 'engine and brakes should be modelled');
  assert.match(physics, /applyImpulseAtPoint/, 'suspension should push at the contact point');
  assert.match(physics, /#sampleGround/, 'wheel contact should come from the analytic height field');
  assert.doesNotMatch(physics, /\.castRay\(/, 'contact must not go through Rapier ray queries, which corrupt the world');
  assert.doesNotMatch(physics, /setGravityScale\(0\)/, 'gravity should not be disabled on the chassis');
  assert.doesNotMatch(physics, /setLinvel\(\{ x: horizontalVelocity/, 'velocity should not be overwritten every frame');
  assert.doesNotMatch(physics, /#stabilizeRideHeight/, 'ride height should not be pinned artificially');

  for (const vehicle of ['sedan', 'hatchback', 'offroader', 'truck', 'excavator']) {
    assert.match(profiles, new RegExp(`${vehicle}:\\s*{`), `${vehicle} profile should exist`);
  }
  assert.match(profiles, /maxSpeed/, 'profiles should define a real top speed');
  assert.match(profiles, /grip/, 'profiles should define grip');
});

test('brake doubles as reverse once stopped', () => {
  assert.match(physics, /REVERSE_ENGAGE_SPEED/, 'there should be a speed below which braking becomes reverse');
  assert.match(physics, /REVERSE_POWER/, 'reverse drive should have its own power factor');
  // Reverse thrust must not be scaled by throttle — that leaves the car with no power while the
  // brake pedal is held, which is how reverse silently did nothing.
  const reverseBlock = physics.slice(physics.indexOf('Stopped, or already rolling back'), physics.indexOf('} else if (throttle === 0 && brake === 0'));
  assert.match(reverseBlock, /profile\.engineForce \* REVERSE_POWER/, 'reverse must derive force from the engine, not the throttle');
  assert.doesNotMatch(reverseBlock, /throttle \*/, 'reverse must not be gated on throttle');
});

test('vehicles are built from code, not placeholder boxes', () => {
  assert.match(models, /function buildSedanBody/, 'sedan body should be built from primitives');
  assert.match(models, /function buildExcavatorBody/, 'excavator should have its own shape');
  assert.match(models, /MeshPhysicalMaterial/, 'vehicles should use glass materials');
  assert.match(models, /wheelMesh/, 'wheels should be round meshes');
  assert.doesNotMatch(game, /GLTFLoader/, 'the game should not depend on external GLB placeholders');
});

test('terrain is a real heightfield, not a flat plane', () => {
  const layout = createCityLayout();
  const heights = [
    layout.groundHeight(0, 0),
    layout.groundHeight(200, 200),
    layout.groundHeight(-320, 260),
    layout.groundHeight(420, -380)
  ];
  assert.ok(new Set(heights.map((h) => h.toFixed(2))).size > 1, 'ground height should vary across the map');
  assert.match(game, /TerrainCollider/, 'game should build a terrain collider');
  assert.match(city, /terrain_heightfield/, 'city should build a heightfield terrain mesh');
  assert.doesNotMatch(city, /sunny_grass_ground/, 'the flat grass placeholder should be gone');
});

test('HUD exposes speed, minimap, score and a garage without Tailwind', () => {
  assert.match(uiManager, /this\.hidden\s*=\s*false/, 'the HUD should be visible at startup');
  assert.match(uiManager, /data-action="toggle-ui"/, 'a visible HUD toggle should be rendered');
  assert.match(uiManager, /data-map/, 'minimap canvas should be present');
  assert.match(uiManager, /data-stat="speed"/, 'speed readout should be present');
  assert.match(uiManager, /data-stat="score"/, 'score readout should be present');
  assert.doesNotMatch(styles, /@tailwind/, 'Tailwind directives should be gone from the stylesheet');
  assert.doesNotMatch(styles, /ui-overlay/, 'old Tailwind-oriented class names should be gone');
  assert.match(styles, /\.hud-touch/, 'touch controls should be styled');
  assert.match(styles, /any-pointer: coarse/, 'touch controls should appear on any coarse-pointer device');
  assert.match(styles, /orientation: landscape/, 'short landscape screens should get their own layout');
});

test('chase camera follows the car and stays out of geometry', () => {
  assert.match(game, /cameraFollowYaw/, 'camera should track a follow yaw');
  assert.match(game, /cameraOrbitOffset/, 'user orbit should be a separate offset from the follow yaw');
  assert.match(game, /cameraPitch/, 'camera should expose a controllable pitch');
  assert.match(game, /dampAngle/, 'yaw should be damped along the shortest arc');
  assert.match(game, /clearFraction/, 'camera should shorten its boom when a building blocks the view');
  assert.match(input, /cameraPitch/, 'vertical drags should drive pitch');
  assert.match(input, /Math\.log\(this\.pinchDistance \/ span\)/, 'pinch zoom should use the finger-span ratio');
  assert.match(input, /DOUBLE_TAP_MS/, 'double tap should reset the camera');
});

test('minimap and garage are usable on every screen size', () => {
  assert.match(uiManager, /data-action="open-garage"/, 'the garage needs a button that opens it');
  assert.match(uiManager, /toggleGarage/, 'garage open/close should be handled in one place');
  assert.match(uiManager, /#fitMapCanvas|fitMapCanvas/, 'the minimap should size its backing store to the viewport');
  assert.match(uiManager, /Math\.atan2\(forward\.x, -forward\.z\)/, 'the player arrow should point along the driving direction');
  assert.match(styles, /--ui-\w+: clamp\(/, 'HUD metrics should be clamp() sizes that scale with the viewport');
  assert.match(styles, /env\(safe-area-inset/, 'HUD should respect device safe areas');
});

test('touch controls drive the car and always leave a way back to the HUD', () => {
  assert.match(uiManager, /data-stick/, 'steering should use an analogue stick');
  assert.match(input, /bindStickElement/, 'the stick should be bound in the input controller');
  assert.match(input, /this\.stickSteer \+ digital/, 'analogue steering should combine with the arrow keys');
  assert.match(uiManager, /data-control="throttle"/, 'accelerate should be touch-bindable');
  assert.match(uiManager, /data-control="brake"/, 'brake should be touch-bindable');
  assert.match(uiManager, /data-control="handbrake"/, 'drift should be touch-bindable');
  assert.match(uiManager, /hud-restore/, 'a restore button must survive hiding the HUD');
  assert.match(styles, /body\.hidden-ui \.hud-restore \{ display: inline-flex/, 'the restore button shows while the HUD is hidden');
  assert.match(styles, /\.steer-track/, 'the steering stick should be styled');
});

test('camera can leave the car and come back', () => {
  assert.match(game, /cameraMode = 'follow'/, 'the camera should start locked to the car');
  assert.match(game, /enterFreeLook/, 'there must be a detached camera mode');
  assert.match(game, /recenterCamera/, 'there must be a one-press return to the car');
  assert.match(game, /#panFreeFocus/, 'free mode should pan the focus across the world');
  // Coming back to the car has to restore the drive-view boom too, otherwise the camera stays
  // wherever the free look left it and the car is still a speck.
  const recenter = game.slice(game.indexOf('recenterCamera() {'), game.indexOf('recenterCamera() {') + 600);
  assert.match(recenter, /cameraDistanceTarget = CAMERA_CHASE_DISTANCE/, 'recentre must restore the chase distance');
  assert.match(recenter, /cameraDistance = CAMERA_CHASE_DISTANCE/, 'recentre must apply the chase distance immediately');
  // Snap and follow must agree, or the camera lands in front of the car and swings round.
  assert.match(game, /#behindYaw\(\)/, 'there should be one shared "behind the car" yaw');
  assert.match(game, /this\.cameraFollowYaw = this\.#behindYaw\(\)/, 'the snap must use the shared yaw');
  assert.doesNotMatch(game, /cameraFollowYaw = heading \+ Math\.PI/, 'the snap must not offset the yaw by a half turn');
  // Enough boom to actually take in the towers and the city.
  const maxDistance = Number(game.match(/CAMERA_DISTANCE_MAX = (\d+)/)[1]);
  assert.ok(maxDistance >= 200, `zoom should reach the skyline, got ${maxDistance}`);
  assert.match(game, /Math\.exp\(input\.cameraZoom/, 'zoom should be multiplicative and pull back on positive input');
  assert.match(input, /cameraPanX/, 'two-finger drag should produce a pan');
  assert.match(uiManager, /data-action="recenter"/, 'the HUD needs a back-to-car button');
  assert.match(uiManager, /data-action="camera"/, 'the HUD needs a follow/free toggle');
  // Zoom must not drag the focus back to the car.
  const zoomBlock = game.slice(game.indexOf('this.cameraDistanceTarget = THREE.MathUtils.clamp'), game.indexOf('const speed = vehicle.getSpeedKph()'));
  assert.doesNotMatch(zoomBlock, /cameraFocus/, 'zooming must not touch the focus point');
});

test('the brand chip sizes to its label and can never spill', () => {
  const rule = styles.match(/\.hud-brand-mark\s*\{[^}]*\}/)[0];
  assert.doesNotMatch(rule, /(^|[^-])width:\s*clamp/, 'a fixed width is what let EMIR overflow');
  assert.match(rule, /min-width:/, 'the chip needs a minimum size');
  assert.match(rule, /min-height:/, 'a fixed height would crop the label');
  assert.match(rule, /padding:/, 'padding is what keeps the label off the edges');
  assert.match(rule, /overflow:\s*hidden/, 'a hard guard in case a font is wider than expected');
  assert.match(rule, /white-space:\s*nowrap/, 'the label must stay on one line');
  assert.match(rule, /text-size-adjust:\s*none/, 'iOS must not inflate the label out of the chip');
  assert.match(rule, /font-size:\s*\d+px/, 'an explicit px size keeps it predictable across devices');
  assert.match(styles, /-webkit-text-size-adjust:\s*100%/, 'the whole HUD should opt out of iOS text inflation');
});

test('the wordmark styles cannot capture the brand chip', () => {
  // `.hud-brand span` used to match the chip too and, having one more type selector, overrode its
  // display and font size with viewport-derived values.
  assert.doesNotMatch(styles, /(^|\n)\.hud-brand span\s*\{/,
    'an unscoped .hud-brand span rule outranks .hud-brand-mark');
  assert.match(styles, /\.hud-brand div span\s*\{/, 'the wordmark span rule should be scoped');
});

test('the page asks phones not to cache it', () => {
  assert.match(indexHtml, /viewport-fit=cover/, 'safe-area insets need viewport-fit');
  assert.match(indexHtml, /http-equiv="Cache-Control"/, 'a stale cached page hides every fix');
});

test('new players get controls help and impacts give feedback', () => {
  assert.match(uiManager, /data-help/, 'there should be a controls overlay');
  assert.match(uiManager, /openHelp/, 'the overlay should be openable');
  assert.match(uiManager, /emir\.helpSeen/, 'the overlay should only auto-open once');
  assert.match(uiManager, /data-action="help"/, 'there should be a button to reopen it');
  assert.match(uiManager, /data-vignette/, 'impacts should flash a vignette');
  assert.match(styles, /impact-flash/, 'the vignette needs an animation');
  assert.match(styles, /\.hud-help/, 'the overlay should be styled');
  assert.match(game, /addCameraShake/, 'impacts should shake the camera');
});

test('the garage sits above the controls it used to overlap', () => {
  assert.match(uiManager, /data-scrim/, 'the garage needs a scrim to catch outside taps');
  assert.match(uiManager, /setExclusive/, 'one place should decide which panel is open');
  assert.match(uiManager, /this\.garageOpen \? null : 'garage'/, 'the Garage button must toggle');
  assert.match(styles, /\.hud-scrim\s*\{[^}]*z-index:\s*2/, 'scrim under the panels');
  assert.match(styles, /\.hud-garage\s*\{[^}]*z-index:\s*3/s, 'garage above the scrim');
  assert.match(styles, /\.hud-top\s*\{\s*z-index:\s*3/, 'the top bar must stay tappable to toggle it off');
  assert.match(styles, /\.hud\.garage-open \.hud-touch/, 'driving controls should stand down while it is open');
  assert.match(styles, /\.hud\.garage-open \.touch-cam/, 'so should the camera pad');
});

test('live readouts cannot shift the buttons beside them', () => {
  assert.match(styles, /\.hud-pill \{ font-variant-numeric: tabular-nums/,
    'proportional digits make the top bar jitter as the values tick');
  assert.match(styles, /\.hud-pill\[data-stat="fps"\]/, 'the fps counter changes width most often');
});

test('garage open state lands on the panel and the root, and both are used', () => {
  // The panel needs the class to open itself; the root needs it so its siblings can stand down.
  // Either toggle is a no-op if the stylesheet does not actually target it.
  assert.match(uiManager, /garageEl\.classList\.toggle\('garage-open',/, 'the panel must carry its own open class');
  assert.match(uiManager, /root\.classList\.toggle\('garage-open',/, 'the root class is what stands the controls down');
  assert.match(styles, /\.hud-garage\.garage-open/, 'the panel class must be styled');
  assert.match(styles, /\.hud\.garage-open/, 'the root class must be styled, or it does nothing');
});

test('objectives give the drive a purpose', () => {
  const layout = createCityLayout();
  assert.ok(layout.coins.length > 20, 'there should be coins to collect');
  assert.ok(layout.ramps.length > 0, 'there should be ramps to jump');
  assert.match(game, /landmarksFound/, 'landmark discovery should be tracked');
  assert.match(game, /airtimeBest/, 'air time should be tracked');
  assert.match(city, /collectCoins/, 'city should expose coin collection');
});
