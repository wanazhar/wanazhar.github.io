import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const viteConfig = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const game = readFileSync(new URL('../src/core/Game.js', import.meta.url), 'utf8');
const uiManager = readFileSync(new URL('../src/ui/UIManager.js', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const city = readFileSync(new URL('../src/world/VoxelCity.js', import.meta.url), 'utf8');
const inputController = readFileSync(new URL('../src/core/InputController.js', import.meta.url), 'utf8');
const worldColliderManager = readFileSync(new URL('../src/world/WorldColliderManager.js', import.meta.url), 'utf8');
const assetLoader = readFileSync(new URL('../src/core/AssetLoader.js', import.meta.url), 'utf8');
const vehicleProfiles = readFileSync(new URL('../src/physics/VehicleProfiles.js', import.meta.url), 'utf8');
const vehicleManager = readFileSync(new URL('../src/physics/VehicleManager.js', import.meta.url), 'utf8');

test('Vite app is configured for GitHub Pages emir subpath', () => {
  assert.match(viteConfig, /base:\s*['"]\/emir\/['"]/, 'Vite base should target /emir/');
  assert.match(viteConfig, /outDir:\s*['"]\.\.\/emir['"]/, 'build output should target ../emir');
  assert.match(viteConfig, /emptyOutDir:\s*true/, 'build should replace only the emir route output');
});

test('Emir Car World source remains maintainable and runnable', () => {
  assert.equal(packageJson.name, 'emir-car-world');
  assert.equal(packageJson.type, 'module');
  assert.match(packageJson.description, /Emir’s Car World/, 'package description should use the public game name');
  assert.ok(packageJson.dependencies.three, 'Three dependency should be declared');
  assert.ok(packageJson.dependencies['@dimforge/rapier3d-compat'], 'Rapier dependency should be declared');
  assert.match(main, /new Game\(/, 'main entry should bootstrap Game');
  assert.match(game, /VehicleManager/, 'game should wire the vehicle manager');
  assert.match(game, /__EMIR_DEBUG__/, 'debug query mode should expose navigation state for regression tests');
});

test('HTML and public game assets are present', () => {
  assert.match(indexHtml, /<title>Emir’s Car World<\/title>/, 'page title should identify the game');
  assert.match(indexHtml, /id="app"/, 'app host should be present');
  assert.ok(existsSync(new URL('../public/data/city-blocks.json', import.meta.url)), 'city block data should be present');
  for (const vehicle of ['sedan', 'hatchback', 'offroader', 'truck', 'excavator']) {
    assert.ok(existsSync(new URL(`../public/models/vehicles/${vehicle}.glb`, import.meta.url)), `${vehicle} GLB should be present`);
  }
});

test('UI overlays start hidden with a visible toggle and correct public name', () => {
  assert.match(uiManager, /this\.hidden\s*=\s*true/, 'overlays should be hidden by default');
  assert.match(uiManager, /data-action="toggle-ui"/, 'a visible overlay toggle should be rendered');
  assert.match(uiManager, /Emir’s Car World/, 'UI should show the exact public game name');
  assert.doesNotMatch(uiManager, new RegExp(['Voxel', 'Kuala', 'Lumpur'].join(' ')), 'old heading should not appear in UI');
  assert.doesNotMatch(uiManager, new RegExp(['Instanced', 'OSM', 'voxel', 'chunks'].join(' ')), 'old technical map copy should not appear in UI');
  assert.match(styles, /\.hidden-ui \.ui-overlay/, 'hidden state should target bulky overlays');
  assert.match(styles, /body:not\(\.hidden-ui\) \.touch-controls/, 'touch driving controls should hide when the full HUD is open');
});

test('Touch driving controls are split and readable on mobile', () => {
  assert.match(uiManager, /class="touch-controls"/, 'touch navigation shell should be present');
  assert.match(uiManager, /class="touch-cluster touch-steer"/, 'steering should be split into its own thumb cluster');
  assert.match(uiManager, /class="touch-cluster touch-actions"/, 'pedals should be split into their own thumb cluster');
  assert.match(uiManager, /data-control="throttle"/, 'accelerate control should be touch-bindable');
  assert.match(uiManager, /data-control="steerLeft"/, 'left steering control should be touch-bindable');
  assert.match(uiManager, /data-control="steerRight"/, 'right steering control should be touch-bindable');
  assert.match(uiManager, /data-control="brake"/, 'brake control should be touch-bindable');
  assert.match(uiManager, /data-control="handbrake"/, 'drift handbrake should be touch-bindable');
  assert.match(styles, /@media \(max-width: 680px\), \(pointer: coarse\)/, 'touch controls should have a coarse-pointer/mobile layout');
  assert.match(styles, /body:not\(\.hidden-ui\) \.touch-controls[^}]*pointer-events:\s*none/, 'touch controls should not overlap/capture taps when the HUD is open');
});

test('Vehicle input logic uses deterministic arcade driving controls', () => {
  assert.match(vehicleManager, /driveSpeed/, 'vehicle manager should keep an explicit drive speed so GO/BRAKE are not dependent on fragile impulse stacking');
  assert.match(vehicleManager, /moveToward\(driveSpeed, tuning\.maxForward/, 'GO should accelerate smoothly toward a forward target speed');
  assert.match(vehicleManager, /moveToward\(driveSpeed, target, accel \* safeDt\)/, 'BRAKE should decelerate first, then reverse predictably');
  assert.match(vehicleManager, /this\.active\.yaw -= steerInput/, 'LEFT/RIGHT should directly change heading instead of relying on unstable wheel impulses');
  assert.match(vehicleManager, /handbrake \? 1\.85 : 1/, 'DRIFT should boost steering authority while held');
  assert.match(vehicleManager, /setLinvel\(\{ x: horizontalVelocity\.x/, 'arcade driving should push actual body velocity every frame');
  assert.match(vehicleManager, /getDebugState\(\)/, 'navigation state should be inspectable in browser regression tests');
  assert.match(vehicleManager, /castRay\(ray, maxRay, true, undefined, undefined, this\.active\.collider, body\)/, 'wheel visual rays should still exclude the active vehicle body/collider');
});

test('Solid objects block vehicles while off-road ground remains driveable', () => {
  assert.match(city, /solidSpatialHash/, 'city should expose a dedicated spatial hash for physical blockers');
  assert.match(city, /#addSolidVoxelCollider\(voxel, type, scaleY\)/, 'buildings and towers should register solid colliders');
  assert.match(city, /type:\s*'treeTrunk'/, 'visual trees should register trunk collision');
  assert.match(city, /type:\s*'streetSign'/, 'placed signs should register collision');
  assert.match(game, /spatialHash:\s*this\.city\.solidSpatialHash/, 'world colliders should stream only solid placed objects');
  assert.doesNotMatch(worldColliderManager, /voxel\.type !== 'park'/, 'off-road park/grass driving should not depend on broad park blockers');
});

test('Follow camera can orbit and reset while driving', () => {
  assert.match(inputController, /KeyQ:\s*\['cameraLeft'/, 'Q should rotate the follow camera left');
  assert.match(inputController, /KeyE:\s*\['cameraRight'/, 'E should rotate the follow camera right');
  assert.match(inputController, /KeyC:\s*\['resetCamera'/, 'C should reset the follow camera');
  assert.match(inputController, /bindCameraElement\(element\)/, 'pointer drag should bind to the render canvas');
  assert.match(game, /this\.input\.bindCameraElement\(this\.renderer\.domElement\)/, 'game should wire pointer camera drag');
  assert.match(game, /this\.cameraYawOffset \+=/, 'camera orbit should accumulate while moving');
  assert.match(game, /consumePressed\('resetCamera'\)/, 'camera reset input should restore the default follow view');
});

test('World and vehicles use a colorful toy-car art direction', () => {
  assert.match(game, /0x87ceeb/, 'scene should use a blue sky instead of a white void');
  assert.match(city, /vertexColors:\s*true/, 'city instances should support per-building color variation');
  assert.match(city, /sunny_grass_ground/, 'world should include a colored grass ground plane');
  assert.match(city, /lane_markings/, 'roads should include visible lane markings');
  assert.match(assetLoader, /warm_headlight/, 'vehicles should include headlights');
  assert.match(assetLoader, /cabin_glass/, 'fallback vehicles should include glass cabins');
  assert.match(assetLoader, /roof_rack|bright_cargo_box|excavator_bucket/, 'vehicle classes should get distinctive detail parts');
  assert.match(vehicleProfiles, /0xe63946|0x06d6a0|0x3a86ff/, 'vehicle palette should use saturated colors');
});
