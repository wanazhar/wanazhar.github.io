import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AdaptiveRenderer } from './render/AdaptiveRenderer.js';
import { DetailPerformanceGovernor } from './render/DetailPerformanceGovernor.js';
import { createKualaLumpurWorld } from './world/createKualaLumpurWorld.js';
import { PlayerController } from './characters/PlayerController.js';
import { TrainSystem } from './transport/TrainSystem.js';
import { LandmarkProgress } from './game/LandmarkProgress.js';
import { TourRoute } from './game/TourRoute.js';
import { CityActors } from './world/CityActors.js';
import { setupHud } from './ui/hud.js';
import { setupMiniMap } from './ui/miniMap.js';
import { setupPhotoMode } from './ui/photoMode.js';
import { tourismZones, travelTips, culturalFacts, glossary } from './data/tourismContent.js';
import { tourismRoutes } from './data/routes.js';
import { quests, achievements } from './data/quests.js';
import { postcardTemplates } from './data/postcards.js';
import { SaveSystem } from './game/SaveSystem.js';
import { QuestSystem } from './game/QuestSystem.js';
import { loadStaticChunkManifest } from './world/chunks/ChunkLoader.js';
import { DETAIL_BUDGETS, getDetailTier } from './world/chunks/chunkVisibility.js';
import { GeneratedDetailLayer } from './world/detail/GeneratedDetailLayer.js';
import { GENERATED_DETAIL_VISIBLE_BUDGET } from './world/detail/generatedDetailConfig.js';

const canvas = document.getElementById('game-canvas');
const detailTier = getDetailTier();
const visibleBudget = DETAIL_BUDGETS[detailTier].visibleInstanceCap;
const propBudget = GENERATED_DETAIL_VISIBLE_BUDGET;
const adaptive = new AdaptiveRenderer(canvas, { lowEndMode: detailTier !== 'desktop' });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(64, window.innerWidth / window.innerHeight, 0.1, 1800);

const hemiLight = new THREE.HemisphereLight(0xe8f4ff, 0x5c6a52, 2.7);
scene.add(hemiLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.95);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xfff3cf, 3.4);
sun.position.set(-55, 96, -75);
scene.add(sun);

const world = createKualaLumpurWorld(scene);
world.chunkManager.update(world.startPosition);
const initialBaseVisibleInstances = world.chunkManager.getStats().visibleInstances;
const generatedDetailLayer = new GeneratedDetailLayer(scene, world.terrain, { baseVisibleInstances: initialBaseVisibleInstances, visibleBudget: propBudget, collision: world.collision });
const detailGovernor = new DetailPerformanceGovernor({ maxBudget: visibleBudget, initialBudget: visibleBudget });
const player = new PlayerController(scene, world.terrain, world.startPosition, world.collision);
const trainSystem = new TrainSystem(scene, world.transportPaths);
const cityActors = new CityActors(scene, world.terrain);
const saveSystem = new SaveSystem();
const landmarkProgress = new LandmarkProgress(world.landmarks, 10, saveSystem.data.visited);
const initialRoute = tourismRoutes.find((route) => route.id === saveSystem.data.activeRoute) ?? tourismRoutes[0];
const tourRoute = new TourRoute(world.landmarks, initialRoute.stops);
tourRoute.routeId = initialRoute.id;
const questSystem = new QuestSystem(quests, achievements, saveSystem, world.landmarks);

camera.position.copy(world.startPosition).add(new THREE.Vector3(22, 18, 24));
camera.lookAt(player.group.position);

const controls = new OrbitControls(camera, adaptive.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.14;
controls.enablePan = true;
controls.panSpeed = 0.95;
controls.screenSpacePanning = true;
controls.rotateSpeed = 1.2;
controls.zoomSpeed = 1.7;
controls.zoomToCursor = true;
controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
controls.minDistance = 6;
controls.maxDistance = 460;
controls.maxPolarAngle = Math.PI * 0.495;
controls.target.copy(player.group.position).add(new THREE.Vector3(0, 2, 0));
controls.update();
setupNavigation(adaptive.domElement, controls, camera);

function panCamera(camera, controls, deltaX, deltaY) {
  const scale = camera.position.distanceTo(controls.target) * 0.0016;
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  const move = right.multiplyScalar(-deltaX * scale).addScaledVector(up, deltaY * scale);
  controls.target.add(move);
  camera.position.add(move);

  const limit = world.terrain.max - 20;
  const clampedX = THREE.MathUtils.clamp(controls.target.x, -limit, limit);
  const clampedZ = THREE.MathUtils.clamp(controls.target.z, -limit, limit);
  const correction = new THREE.Vector3(clampedX - controls.target.x, 0, clampedZ - controls.target.z);
  if (correction.lengthSq() > 0) {
    controls.target.add(correction);
    camera.position.add(correction);
  }
}

function setupNavigation(canvas, controls, camera) {
  const isTrackpadScroll = (event) => {
    if (event.ctrlKey || event.shiftKey) return false;
    const integerWheel = event.deltaX === 0 && Math.abs(event.deltaY) >= 40 && Number.isInteger(event.deltaY);
    return !integerWheel;
  };

  window.addEventListener('wheel', (event) => {
    if (event.target !== canvas) return;
    if (!isTrackpadScroll(event)) {
      // Pinch, shift-scroll and integer mouse-wheel steps stay with OrbitControls so pinch-zoom
      // keeps working on touch hardware. Only trackpad two-finger scrolling is remapped to panning.
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    panCamera(camera, controls, event.deltaX, event.deltaY);
    controls.update();
    requestRender();
  }, { capture: true, passive: false });
}

let loopRunning = false;
let needsRender = true;
let controlsActive = false;
let lastTime = performance.now();
let fps = 0;
let frames = 0;
let fpsClock = performance.now();
let lastHudUpdate = 0;
let lastMiniMapDraw = 0;
let recentCameraTarget = controls.target.clone();
let previousWorldFocus = controls.target.clone();
let currentLandmark = world.landmarks[0];
let timeModeIndex = 0;
let trainBoardingAvailable = false;
const timeModes = ['Day', 'Golden Hour', 'Sunset', 'Night', 'Rain', 'Thunderstorm'];
timeModeIndex = Math.max(0, timeModes.indexOf(saveSystem.data.timeMode));
const beacon = new THREE.Mesh(
  new THREE.ConeGeometry(3.2, 10, 4),
  new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.52 })
);
beacon.visible = false;
scene.add(beacon);

const rainGeometry = new THREE.BufferGeometry();
const rainCount = 360;
const rainPositions = new Float32Array(rainCount * 3);
for (let i = 0; i < rainCount; i += 1) {
  rainPositions[i * 3] = world.terrain.min + Math.random() * world.terrain.size;
  rainPositions[i * 3 + 1] = 18 + Math.random() * 95;
  rainPositions[i * 3 + 2] = world.terrain.min + Math.random() * world.terrain.size;
}
rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
const rain = new THREE.Points(rainGeometry, new THREE.PointsMaterial({ color: 0xa9d7ff, size: 0.24, transparent: true, opacity: 0.62 }));
rain.visible = false;
scene.add(rain);

function requestRender() {
  needsRender = true;
  trainSystem.wake(4500);
  cityActors.wake(4500);
  if (!loopRunning) {
    loopRunning = true;
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }
}

function placeCameraNear(target, options = 44) {
  const settings = typeof options === 'number' ? { distance: options } : options;
  const distance = settings.distance ?? 44;
  const heightRatio = settings.heightRatio ?? 0.72;
  controls.target.copy(target);
  recentCameraTarget.copy(target);
  camera.position.copy(target).add(new THREE.Vector3(distance, distance * heightRatio, distance));
  camera.lookAt(target);
  controls.update();
}

function placeCameraOnLandmark(landmark, fallbackTarget) {
  if (!landmark?.position) {
    placeCameraNear(fallbackTarget, 58);
    return;
  }
  const target = landmark.position.clone().add(new THREE.Vector3(0, landmark.height ?? 12, 0));
  placeCameraNear(target, { distance: landmark.distance ?? 72, heightRatio: 0.42 });
}

function setCameraMode(mode, landmark = currentLandmark) {
  const playerTarget = player.getFocusTarget();
  if (mode === 'walk') {
    placeCameraNear(playerTarget, { distance: 24, heightRatio: 1.05 });
    hud?.showToast('Walk camera.');
  } else if (mode === 'landmark') {
    placeCameraOnLandmark(landmark, playerTarget);
    hud?.showToast('Landmark camera.');
  } else {
    const target = new THREE.Vector3(0, 30, 0);
    controls.target.copy(target);
    recentCameraTarget.copy(target);
    camera.position.set(310, 260, 325);
    camera.lookAt(target);
    controls.update();
    hud?.showToast('Skyline overview.');
  }
  requestRender();
}

function focusLandmark(landmark) {
  currentLandmark = landmark;
  const target = landmark.position.clone();
  const walkOffset = new THREE.Vector3(8, 0, 8);
  player.warpTo(target.clone().add(walkOffset));
  landmarkProgress.markVisited(landmark);
  saveSystem.markVisited(landmark.name);
  questSystem.evaluate().forEach((quest) => hud?.showToast(`Quest complete: ${quest.name}`));
  hud?.setProgress(landmarkProgress);
  hud?.setGuidebook(landmark);
  placeCameraOnLandmark(landmark, player.getFocusTarget());
  requestRender();
}

function updateTourHud(result = {}) {
  const current = tourRoute.current;
  const distance = current ? Math.hypot(player.group.position.x - current.position.x, player.group.position.z - current.position.z) : 0;
  hud.setTour({
    active: tourRoute.active,
    nextName: current?.name,
    distance: result.distance ?? distance,
    progressText: tourRoute.progressText
  });
  beacon.visible = Boolean(current);
  if (current) beacon.position.set(current.position.x, current.position.y + 18 + Math.sin(performance.now() / 280) * 2, current.position.z);
}

function setRoute(routeId) {
  const route = tourismRoutes.find((item) => item.id === routeId) ?? tourismRoutes[0];
  tourRoute.setStops(route.stops, route.id);
  saveSystem.setActiveRoute(route.id);
  updateTourHud();
  hud?.showToast(`Route selected: ${route.name}`);
}

function toggleTour() {
  const destination = tourRoute.toggle();
  updateTourHud();
  hud.showToast(destination ? `KL Tour started: ${destination.name}` : 'KL Tour cancelled.');
}

function applyTimeMode(mode) {
  const settings = {
    Day: { bg: 0x8fc4ef, fog: 0xb6d9f5, hemi: 2.7, ambient: 0.95, sun: 3.4, exposure: 1.12, wet: false, rain: false },
    'Golden Hour': { bg: 0xe8b678, fog: 0xf0cc9c, hemi: 2.3, ambient: 0.86, sun: 3.0, exposure: 1.14, wet: false, rain: false },
    Sunset: { bg: 0xc97a6d, fog: 0xd79a86, hemi: 2.0, ambient: 0.8, sun: 2.5, exposure: 1.15, wet: false, rain: false },
    Night: { bg: 0x030714, fog: 0x0a1424, hemi: 0.9, ambient: 0.72, sun: 0.6, exposure: 1.2, wet: false, rain: false },
    Rain: { bg: 0x5f7787, fog: 0x7b93a3, hemi: 1.7, ambient: 0.82, sun: 1.2, exposure: 1.1, wet: true, rain: true },
    Thunderstorm: { bg: 0x39485c, fog: 0x4f6172, hemi: 1.3, ambient: 0.78, sun: 0.7, exposure: 1.14, wet: true, rain: true }
  }[mode];
  scene.background.setHex(settings.bg);
  scene.fog.color.setHex(settings.fog);
  hemiLight.intensity = settings.hemi;
  ambient.intensity = settings.ambient;
  sun.intensity = settings.sun;
  adaptive.renderer.toneMappingExposure = settings.exposure;
  scene.traverse((object) => {
    if (!object.isInstancedMesh || !object.name.includes('voxels_')) return;
    const key = object.userData.voxelMaterialKey ?? object.name.replace('voxels_', '').split('_chunk_')[0];
    if (['glassDark', 'blackGlass', 'trainWindow', 'lampGlow'].includes(key)) {
      object.material.color.setHex(mode === 'Night' ? 0xffd166 : world.palette[key]);
    } else if (key === 'road') {
      object.material.color.setHex(settings.wet ? 0x121a25 : world.palette[key]);
    } else if (world.palette[key]) {
      object.material.color.setHex(world.palette[key]);
    }
  });
  rain.visible = settings.rain;
  saveSystem.setTimeMode(mode);
  questSystem.evaluate().forEach((quest) => hud?.showToast(`Quest complete: ${quest.name}`));
  hud?.setTimeMode(mode);
  requestRender();
}

function cycleTimeMode() {
  timeModeIndex = (timeModeIndex + 1) % timeModes.length;
  const mode = timeModes[timeModeIndex];
  applyTimeMode(mode);
  hud.showToast(`${mode} mode.`);
}

function boardTrain() {
  if (trainSystem.ride) {
    const exit = trainSystem.exitRide(world.terrain);
    player.enabled = true;
    controls.enabled = true;
    if (exit) player.warpTo(exit);
    hud.showToast('Exited train.');
    requestRender();
    return;
  }
  if (!trainSystem.startRide(player.group.position)) return;
  saveSystem.addTrainRide(trainSystem.ride.train.name);
  questSystem.evaluate().forEach((quest) => hud?.showToast(`Quest complete: ${quest.name}`));
  player.enabled = false;
  controls.enabled = false;
  hud.showToast('Boarded train cinematic. Press E or Exit to leave.');
  requestRender();
}

const hud = setupHud({
  landmarks: world.landmarks,
  player,
  trainSystem,
  requestRender,
  focusLandmark,
  refocusPlayer: () => placeCameraNear(player.group.position.clone().add(new THREE.Vector3(0, 2, 0)), 34),
  setCameraMode,
  toggleTour,
  cycleTimeMode,
  boardTrain
  ,
  tourismContent: { zones: tourismZones, tips: travelTips, facts: culturalFacts, glossary },
  routes: tourismRoutes,
  questSystem,
  saveSystem,
  setRoute,
  fastTravel: (stationName) => {
    const target = trainSystem.fastTravelTo(stationName, world.terrain);
    if (!target) return;
    player.warpTo(target);
    placeCameraNear(target.clone().add(new THREE.Vector3(0, 2, 0)), 34);
    hud.showToast(`Fast travel: ${stationName}`);
  },
  resetProgress: () => {
    saveSystem.reset();
    landmarkProgress.visited.clear();
    hud.setProgress(landmarkProgress);
    hud.renderQuests();
  }
});
hud.setVoxelStats({
  ...world.voxelStats,
  authoredTotal: world.voxelStats.total,
  visibleInstances: initialBaseVisibleInstances,
  generatedDetail: generatedDetailLayer.getStats()
});
hud.setProgress(landmarkProgress);
updateTourHud();
hud.setTimeMode(timeModes[timeModeIndex]);
applyTimeMode(timeModes[timeModeIndex]);
hud.showToast('Explore Kuala Lumpur: WASD to move, touch joystick on mobile, routes and guidebook in panels.');

loadStaticChunkManifest()
  .then((manifest) => {
    if (!manifest) return;
    world.staticChunkManifest = manifest;
    const total = manifest.totalAuthoredWithGeneratedDetail ?? manifest.totalInstances;
    console.info(`Static chunk manifest ready: ${manifest.chunks.length} base chunks + ${manifest.generatedDetailChunks?.length ?? 0} generated detail chunks / ${total.toLocaleString()} authored instances`);
  })
  .catch((error) => {
    console.info('Static chunk manifest not available yet; using bundled world.', error.message);
  });

const miniMap = setupMiniMap({
  canvas: document.getElementById('mini-map'),
  terrain: world.terrain,
  landmarks: world.landmarks,
  postcards: postcardTemplates,
  getCurrentLandmark: () => currentLandmark,
  getTimeMode: () => timeModes[timeModeIndex],
  player,
  onLandmarkClick: focusLandmark
});

const photoMode = setupPhotoMode({
  renderer: adaptive.renderer,
  scene,
  camera,
  controls,
  hudRoot: document.getElementById('app'),
  landmarks: world.landmarks,
  postcards: postcardTemplates,
  getCurrentLandmark: () => currentLandmark,
  getTimeMode: () => timeModes[timeModeIndex],
  applyPreset: (name, landmark) => {
    if (name === 'Skyline' || name === 'Tour Poster') setCameraMode('skyline');
    else setCameraMode('landmark', landmark ?? currentLandmark);
  },
  requestRender,
  showToast: hud.showToast,
  onCapture: ({ postcardId }) => {
    saveSystem.addPhotoCapture({ postcardId, timeMode: timeModes[timeModeIndex] });
    questSystem.evaluate().forEach((quest) => hud.showToast(`Quest complete: ${quest.name}`));
    hud.renderQuests();
  }
});

function getWorldFocusPosition() {
  if (trainSystem.ride) return trainSystem.ride.train.cars[0].position;
  return controls.target;
}

function updateCameraTarget(deltaSeconds) {
  const desired = player.getFocusTarget();
  const before = controls.target.clone();
  controls.target.lerp(desired, 1 - Math.exp(-11 * deltaSeconds));
  const delta = controls.target.clone().sub(before);
  camera.position.add(delta);
  recentCameraTarget.copy(controls.target);
}

function loop(now) {
  if (document.hidden) {
    loopRunning = false;
    return;
  }

  const deltaSeconds = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
  lastTime = now;

  const playerMoved = player.update(deltaSeconds, camera);
  if (playerMoved && !controlsActive) updateCameraTarget(deltaSeconds);
  const controlsChanged = controls.update();
  const worldFocusPosition = getWorldFocusPosition();
  const focusMoved = worldFocusPosition.distanceToSquared(previousWorldFocus) > 1.0;
  if (focusMoved) previousWorldFocus.copy(worldFocusPosition);

  const trainsMoved = trainSystem.update(deltaSeconds);
  const actorsMoved = cityActors.update(deltaSeconds);
  if (rain.visible) {
    const positions = rain.geometry.attributes.position.array;
    for (let i = 0; i < rainCount; i += 1) {
      positions[i * 3 + 1] -= deltaSeconds * (timeModes[timeModeIndex] === 'Thunderstorm' ? 46 : 30);
      if (positions[i * 3 + 1] < 4) {
        positions[i * 3] = world.terrain.min + Math.random() * world.terrain.size;
        positions[i * 3 + 1] = 108;
        positions[i * 3 + 2] = world.terrain.min + Math.random() * world.terrain.size;
      }
    }
    rain.geometry.attributes.position.needsUpdate = true;
  }
  const chunkUpdate = world.chunkManager?.update(worldFocusPosition) ?? { changed: false, visibleInstances: world.voxelStats.total };
  const chunksChanged = chunkUpdate.changed;
  generatedDetailLayer.setBaseVisibleInstances(chunkUpdate.visibleInstances);
  const detailChanged = generatedDetailLayer.update(worldFocusPosition).changed;
  if (trainSystem.ride) {
    const lead = trainSystem.ride.train.cars[0];
    const target = lead.position.clone();
    controls.target.copy(target);
    camera.position.copy(target).add(new THREE.Vector3(12, 8, 16));
    camera.lookAt(target);
    if (trainSystem.ride.elapsed >= trainSystem.ride.duration) boardTrain();
  }
  const stamp = landmarkProgress.check(player.group.position);
  if (stamp) {
    hud.setProgress(landmarkProgress);
    saveSystem.markVisited(stamp.name);
    questSystem.evaluate().forEach((quest) => hud.showToast(`Quest complete: ${quest.name}`));
    hud.showToast(`Stamp collected: ${stamp.name}`);
  }
  const tourUpdate = tourRoute.update(player.group.position);
  if (tourUpdate.advanced) {
    if (tourUpdate.complete) saveSystem.completeRoute(tourRoute.routeId);
    hud.showToast(tourUpdate.complete ? 'KL Tour complete.' : `Next stop: ${tourUpdate.destination.name}`);
  }
  updateTourHud(tourUpdate);
  const station = trainSystem.findBoardingStation(player.group.position);
  trainBoardingAvailable = Boolean(station) || Boolean(trainSystem.ride);
  hud.setBoardTrainAvailable(trainBoardingAvailable);
  const mapSheet = document.getElementById('map-sheet');
  const miniMapVisible = !mapSheet?.hidden;
  if (miniMapVisible && (playerMoved || focusMoved || chunksChanged || needsRender || tourUpdate.advanced || now - lastMiniMapDraw > 500)) {
    miniMap.draw({ nextLandmark: tourRoute.current, visited: (landmark) => landmarkProgress.isVisited(landmark) });
    lastMiniMapDraw = now;
  }
  if (playerMoved || trainsMoved || actorsMoved || controlsChanged || focusMoved || chunksChanged || detailChanged || needsRender || tourRoute.active || trainSystem.ride || rain.visible) {
    adaptive.render(scene, camera);
    frames += 1;
  }

  if (now - fpsClock > 500) {
    fps = (frames * 1000) / (now - fpsClock);
    frames = 0;
    fpsClock = now;
    const budgetUpdate = detailGovernor.update({ fps, now });
    if (budgetUpdate.changed) {
      const ratio = visibleBudget > 0 ? budgetUpdate.budget / visibleBudget : 1;
      generatedDetailLayer.setVisibleBudget(Math.max(600, Math.round(propBudget * ratio)));
      needsRender = true;
    }
  }

  const stillActive = playerMoved || trainsMoved || actorsMoved || controlsChanged || focusMoved || chunksChanged || detailChanged || needsRender || tourRoute.active || trainSystem.ride || rain.visible;
  if (now - lastHudUpdate > 250 || !stillActive) {
    hud.update({
      fps,
      pixelRatio: adaptive.pixelRatio,
      running: stillActive,
      trainsActive: trainSystem.isActive,
      baseVisibleInstances: chunkUpdate.visibleInstances,
      generatedDetail: generatedDetailLayer.getStats()
    });
    lastHudUpdate = now;
  }
  needsRender = false;

  if (stillActive) {
    requestAnimationFrame(loop);
  } else {
    loopRunning = false;
    hud.update({ fps, pixelRatio: adaptive.pixelRatio, running: false, trainsActive: false, baseVisibleInstances: chunkUpdate.visibleInstances, generatedDetail: generatedDetailLayer.getStats() });
  }
}

controls.addEventListener('start', () => {
  controlsActive = true;
  trainSystem.wake();
  requestRender();
});
controls.addEventListener('change', requestRender);
controls.addEventListener('end', () => {
  controlsActive = false;
  requestRender();
});

window.addEventListener('resize', () => {
  adaptive.resize(camera);
  requestRender();
});

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'f') {
    placeCameraNear(player.group.position.clone().add(new THREE.Vector3(0, 2, 0)), 34);
    hud.showToast('Camera refocused on the explorer.');
  }
  if (key === '1') setCameraMode('walk');
  if (key === '2') setCameraMode('landmark');
  if (key === '3') setCameraMode('skyline');
  if (key === 'e' && trainBoardingAvailable) boardTrain();
  if (key === 'p') {
    const permanent = trainSystem.togglePermanentMotion();
    hud.showToast(permanent ? 'Continuous train motion enabled.' : 'Train motion now auto-pauses when idle.');
  }
  requestRender();
});

window.addEventListener('keyup', requestRender);
window.addEventListener('pointerdown', requestRender);
window.addEventListener('wheel', requestRender, { passive: true });
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) requestRender();
});

// Initial render. After the intro transit animation expires, the loop pauses until input.
requestRender();
