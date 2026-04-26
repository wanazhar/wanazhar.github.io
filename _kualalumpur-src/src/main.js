import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AdaptiveRenderer } from './render/AdaptiveRenderer.js';
import { createKualaLumpurWorld } from './world/createKualaLumpurWorld.js';
import { PlayerController } from './characters/PlayerController.js';
import { TrainSystem } from './transport/TrainSystem.js';
import { LandmarkProgress } from './game/LandmarkProgress.js';
import { TourRoute } from './game/TourRoute.js';
import { CityActors } from './world/CityActors.js';
import { setupHud } from './ui/hud.js';
import { setupMiniMap } from './ui/miniMap.js';
import { setupPhotoMode } from './ui/photoMode.js';

const canvas = document.getElementById('game-canvas');
const adaptive = new AdaptiveRenderer(canvas);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(64, window.innerWidth / window.innerHeight, 0.1, 900);

const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x25321f, 1.7);
scene.add(hemiLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.38);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xfff3cf, 2.6);
sun.position.set(-55, 96, -75);
scene.add(sun);

const world = createKualaLumpurWorld(scene);
const player = new PlayerController(scene, world.terrain, world.startPosition);
const trainSystem = new TrainSystem(scene, world.transportPaths);
const cityActors = new CityActors(scene, world.terrain);
const landmarkProgress = new LandmarkProgress(world.landmarks);
const tourRoute = new TourRoute(world.landmarks, [
  'Petronas Twin Towers',
  'KL Tower',
  'Merdeka 118',
  'Merdeka Square',
  'Masjid Negara',
  'Lake Gardens'
]);

camera.position.copy(world.startPosition).add(new THREE.Vector3(22, 18, 24));
camera.lookAt(player.group.position);

const controls = new OrbitControls(camera, adaptive.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.minDistance = 7;
controls.maxDistance = 180;
controls.maxPolarAngle = Math.PI * 0.495;
controls.target.copy(player.group.position).add(new THREE.Vector3(0, 2, 0));
controls.update();

let loopRunning = false;
let needsRender = true;
let lastTime = performance.now();
let fps = 0;
let frames = 0;
let fpsClock = performance.now();
let recentCameraTarget = controls.target.clone();
let currentLandmark = world.landmarks[0];
let timeModeIndex = 0;
let trainBoardingAvailable = false;
const timeModes = ['Day', 'Sunset', 'Night'];
const beacon = new THREE.Mesh(
  new THREE.ConeGeometry(3.2, 10, 4),
  new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.52 })
);
beacon.visible = false;
scene.add(beacon);

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

function placeCameraNear(target, distance = 44) {
  controls.target.copy(target);
  recentCameraTarget.copy(target);
  camera.position.copy(target).add(new THREE.Vector3(distance, distance * 0.72, distance));
  camera.lookAt(target);
  controls.update();
}

function setCameraMode(mode, landmark = currentLandmark) {
  const playerTarget = player.group.position.clone().add(new THREE.Vector3(0, 2, 0));
  if (mode === 'walk') {
    placeCameraNear(playerTarget, 22);
    hud?.showToast('Walk camera.');
  } else if (mode === 'landmark') {
    const target = landmark?.position?.clone() ?? playerTarget;
    placeCameraNear(target, 58);
    hud?.showToast('Landmark camera.');
  } else {
    const target = new THREE.Vector3(0, 18, 4);
    controls.target.copy(target);
    recentCameraTarget.copy(target);
    camera.position.set(125, 112, 132);
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
  hud?.setProgress(landmarkProgress);
  placeCameraNear(target, 58);
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

function toggleTour() {
  const destination = tourRoute.toggle();
  updateTourHud();
  hud.showToast(destination ? `KL Tour started: ${destination.name}` : 'KL Tour cancelled.');
}

function applyTimeMode(mode) {
  const settings = {
    Day: { bg: 0x07101f, fog: 0x07101f, hemi: 1.7, ambient: 0.38, sun: 2.6, exposure: 1.05 },
    Sunset: { bg: 0x24142a, fog: 0x39233b, hemi: 1.35, ambient: 0.48, sun: 2.2, exposure: 1.08 },
    Night: { bg: 0x030714, fog: 0x050816, hemi: 0.72, ambient: 0.62, sun: 0.55, exposure: 1.18 }
  }[mode];
  scene.background.setHex(settings.bg);
  scene.fog.color.setHex(settings.fog);
  hemiLight.intensity = settings.hemi;
  ambient.intensity = settings.ambient;
  sun.intensity = settings.sun;
  adaptive.renderer.toneMappingExposure = settings.exposure;
  scene.traverse((object) => {
    if (!object.isInstancedMesh || !object.name.includes('voxels_')) return;
    const key = object.name.replace('voxels_', '');
    if (['glassDark', 'blackGlass', 'trainWindow', 'lampGlow'].includes(key)) {
      object.material.color.setHex(mode === 'Night' ? 0xffd166 : world.palette[key]);
    } else if (world.palette[key]) {
      object.material.color.setHex(world.palette[key]);
    }
  });
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
});
hud.setVoxelStats(world.voxelStats);
hud.setProgress(landmarkProgress);
updateTourHud();
hud.setTimeMode(timeModes[timeModeIndex]);
hud.showToast('Explore KL: WASD to move, drag to orbit, P toggles continuous trains.');

const miniMap = setupMiniMap({
  canvas: document.getElementById('mini-map'),
  terrain: world.terrain,
  landmarks: world.landmarks,
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
  applyPreset: (name, landmark) => {
    if (name === 'Skyline' || name === 'Tour Poster') setCameraMode('skyline');
    else setCameraMode('landmark', landmark ?? currentLandmark);
  },
  requestRender,
  showToast: hud.showToast
});

function updateCameraTarget() {
  const desired = player.group.position.clone().add(new THREE.Vector3(0, 2.05, 0));
  const before = controls.target.clone();
  controls.target.lerp(desired, 0.24);
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
  if (playerMoved) updateCameraTarget();

  const trainsMoved = trainSystem.update(deltaSeconds);
  const actorsMoved = cityActors.update(deltaSeconds);
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
    hud.showToast(`Stamp collected: ${stamp.name}`);
  }
  const tourUpdate = tourRoute.update(player.group.position);
  if (tourUpdate.advanced) {
    hud.showToast(tourUpdate.complete ? 'KL Tour complete.' : `Next stop: ${tourUpdate.destination.name}`);
  }
  updateTourHud(tourUpdate);
  const station = trainSystem.findBoardingStation(player.group.position);
  trainBoardingAvailable = Boolean(station) || Boolean(trainSystem.ride);
  hud.setBoardTrainAvailable(trainBoardingAvailable);
  miniMap.draw({ nextLandmark: tourRoute.current, visited: (landmark) => landmarkProgress.isVisited(landmark) });
  const controlsChanged = controls.update();

  if (playerMoved || trainsMoved || actorsMoved || controlsChanged || needsRender || tourRoute.active || trainSystem.ride) {
    adaptive.render(scene, camera);
    frames += 1;
  }

  if (now - fpsClock > 500) {
    fps = (frames * 1000) / (now - fpsClock);
    frames = 0;
    fpsClock = now;
  }

  const stillActive = playerMoved || trainsMoved || actorsMoved || controlsChanged || needsRender || tourRoute.active || trainSystem.ride;
  hud.update({
    fps,
    pixelRatio: adaptive.pixelRatio,
    running: stillActive,
    trainsActive: trainSystem.isActive
  });
  needsRender = false;

  if (stillActive) {
    requestAnimationFrame(loop);
  } else {
    loopRunning = false;
    hud.update({ fps, pixelRatio: adaptive.pixelRatio, running: false, trainsActive: false });
  }
}

controls.addEventListener('start', () => {
  trainSystem.wake();
  requestRender();
});
controls.addEventListener('change', requestRender);
controls.addEventListener('end', requestRender);

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
