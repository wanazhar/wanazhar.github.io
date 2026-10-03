import * as THREE from 'three';

import './style.css';
import { CAMERA, PLAYER, RENDER, WORLD, REGIONS, SEED } from './config.js';
import { EventBus } from './core/EventBus.js';
import { GameClock } from './core/GameClock.js';
import { SaveSystem } from './core/SaveSystem.js';

import { heightAt, biomeAt, regionAt, regionInfo, findSpawn, BIOMES } from './world/Terrain.js';
import { WorldPlan, WorldStreamer, instantiateStatics, createMaterials, createGeometry, createShapeGeometries } from './world/World.js';
import { PALETTE } from './world/Palette.js';
import { AnimeMaterialFactory } from './render/AnimeMaterial.js';

import { SkySystem } from './render/SkySystem.js';
import { OceanSystem } from './render/OceanSystem.js';
import { AmbienceSystem } from './render/AmbienceSystem.js';
import { WeatherSystem, ambienceFor } from './render/WeatherSystem.js';

import { buildCharacter, CharacterAnimator, Villager } from './characters/CharacterRig.js';
import { InputController, FollowCamera, PlayerController } from './characters/PlayerController.js';

import { Inventory, Economy, CraftingSystem, SkillSet, ActivitySystem } from './game/Systems.js';
import { QuestSystem } from './game/QuestSystem.js';

import { NPCS, npcById, chooseLine, friendshipTier } from './data/npcs.js';
import { ITEMS, itemName } from './data/items.js';
import { ACTIVITY_COST } from './data/recipes.js';

import { HUD, DialogueBox, Nameplate, el } from './ui/HUD.js';
import { openJournal, openInventory, openShop, openCrafting, openMap } from './ui/Menus.js';
import { TouchControls, isTouchDevice } from './ui/TouchControls.js';

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

const app = document.getElementById('app');
const loading = document.getElementById('loading');
const loadingFill = document.getElementById('loading-fill');

function setProgress(fraction) {
  if (loadingFill) loadingFill.style.width = `${Math.round(fraction * 100)}%`;
}

const bus = new EventBus();
const save = new SaveSystem({ bus });
save.load();

const clock = new GameClock({
  startMinutes: save.data.clock.minutes,
  bus
});
clock.day = save.data.clock.day;

const inventory = new Inventory(save.data.inventory);
const economy = new Economy({ bus, startingYen: save.data.yen });
const skills = new SkillSet(save.data.skills, bus);
const quests = new QuestSystem({ save, inventory, economy, bus });
const crafting = new CraftingSystem({ inventory, skills, bus });

let rngState = SEED >>> 0;
function makeRng() {
  rngState = (rngState + 0x6d2b79f5) >>> 0;
  let t = rngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const activities = new ActivitySystem({ inventory, skills, bus, rng: makeRng });

const weather = new WeatherSystem({ bus, seed: SEED, startType: save.data.weather.current ?? 'clear' });
weather.fromJSON(save.data.weather);

// ---------------------------------------------------------------------------
// Renderer and scene
// ---------------------------------------------------------------------------

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, RENDER.maxPixelRatio));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
// Neutral tone mapping, deliberately NOT ACES. ACES desaturates and crushes,
// which is the opposite of what a bright, saturated anime palette needs; it
// turns the greens to mud. Neutral holds saturation and rolls highlights off
// gently.
renderer.toneMapping = THREE.NeutralToneMapping ?? THREE.LinearToneMapping;
renderer.toneMappingExposure = RENDER.exposure;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(CAMERA.fov, window.innerWidth / window.innerHeight, 0.1, 900);
camera.position.set(0, 40, 40);

const sky = new SkySystem(scene, renderer);
const ocean = new OceanSystem(scene);
const ambience = new AmbienceSystem(scene);

// ---------------------------------------------------------------------------
// World
// ---------------------------------------------------------------------------

setProgress(0.1);
const plan = new WorldPlan();
setProgress(0.5);

// Anime-style materials, sharing one shader program. The factory keeps a
// uniform block per surface name so the sky can push light direction and
// ambient into every material at once.
const animeMaterials = new AnimeMaterialFactory();
const materials = createMaterials(animeMaterials);
const geometry = createGeometry();
const shapeGeometries = createShapeGeometries();
const statics = instantiateStatics(plan.buildAllStatics(), geometry, materials, scene, shapeGeometries);
const streamer = new WorldStreamer(scene, { materials, geometry, shapeGeometries });
setProgress(0.85);

// ---------------------------------------------------------------------------
// Player
// ---------------------------------------------------------------------------

const playerRig = buildCharacter({
  skin: 'light',
  hair: 'black',
  outfit: { top: 0x4a7fc9, bottom: 0x2f4a6e, accent: 0xf2e4c8 },
  hairStyle: 'short'
});
scene.add(playerRig.root);

const playerAnimator = new CharacterAnimator(playerRig);

const input = new InputController(renderer.domElement);

const player = new PlayerController({
  scene,
  camera,
  input,
  groundHeightAt: heightAt,
  isBlocked: (x, z) => plan.collision.isBlocked(x, z)
});

// The camera shares the collision grid so it can never end up inside a wall or
  // a roof. The 3D test matters: a 2D footprint alone lets the camera sit at
  // head height inside a building's upper storey.
const followCamera = new FollowCamera(camera, {
  isBlocked: (x, z) => plan.collision.isBlocked(x, z),
  groundHeightAt: heightAt,
  roofHeightAt: (x, y, z) => plan.collision.isSolidAt(x, y, z)
});

// Restore the save, or start fresh on the spawn.
const savedPos = save.data.position;
if (savedPos && Number.isFinite(savedPos.x)) {
  player.spawn({ x: savedPos.x, y: heightAt(Math.floor(savedPos.x), Math.floor(savedPos.z)), z: savedPos.z });
} else {
  const spawn = findSpawn();
  player.spawn(spawn);
  save.data.position = spawn;
}
player.stamina = save.data.stamina ?? PLAYER.staminaMax;
player.distanceWalked = save.data.stats?.distanceWalked ?? 0;

// Point the camera at the most open direction available from the spawn.
// Starting the game staring at a building wall is the difference between
// "here is an island" and "what is this", so the opening view is chosen by
// how much sky and street each direction gives.
function openestViewYaw(x, z) {
  let bestYaw = Math.PI;
  let bestScore = -Infinity;

  for (let i = 0; i < 24; i += 1) {
    const yaw = (i / 24) * Math.PI * 2;
    let clear = 0;
    const dirX = Math.sin(yaw);
    const dirZ = Math.cos(yaw);

    // Walk outwards and count unobstructed distance.
    for (let step = 1; step <= 14; step += 1) {
      const sx = x + dirX * step;
      const sz = z + dirZ * step;
      if (sx < 2 || sz < 2 || sx > WORLD.size - 2 || sz > WORLD.size - 2) break;
      if (plan.collision.isBlocked(sx, sz)) break;
      // Rising ground counts as a view: it means there is sky behind it.
      const h = heightAt(Math.floor(sx), Math.floor(sz));
      clear += 1 + Math.max(0, h - heightAt(Math.floor(x), Math.floor(z))) * 0.4;
    }

    if (clear > bestScore) {
      bestScore = clear;
      bestYaw = yaw;
    }
  }
  return bestYaw;
}

followCamera.yaw = openestViewYaw(player.position.x, player.position.z);
player.yaw = followCamera.yaw;

// Camera-relative movement needs to know where the camera is facing.
//
// This returns followCamera.yaw unchanged. FollowCamera already positions
// itself at focus + (sin, cos) * distance and therefore looks along
// -(sin, cos), which is exactly the bearing the controller wants. Adding PI
// here -- as an earlier version did -- negates it a second time, which is what
// made forward input move the player backwards.
Object.defineProperty(player, 'cameraYaw', {
  get() {
    return followCamera.yaw;
  }
});

// ---------------------------------------------------------------------------
// Villagers
// ---------------------------------------------------------------------------

const villagerRoot = new THREE.Group();
scene.add(villagerRoot);

const villagers = NPCS.map((npc) => {
  const rig = buildCharacter(npc.appearance);
  const animator = new CharacterAnimator(rig);
  villagerRoot.add(rig.root);

  const spawnY = heightAt(npc.x, npc.z);
  const villager = new Villager({
    rig,
    animator,
    npcId: npc.id,
    home: { x: npc.x, z: npc.z },
    x: npc.x,
    z: npc.z,
    y: spawnY,
    schedule: npc.schedule,
    wanderRadius: 8
  });
  rig.root.position.set(npc.x, spawnY, npc.z);
  return villager;
});

// The player character, but named for the journal and the save file.
const playerNpc = { id: 'aoi', name: save.data.playerName ?? 'Aoi', region: 'city' };

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

const uiRoot = document.createElement('div');
uiRoot.className = 'ui-root';
app.appendChild(uiRoot);

const hud = new HUD(uiRoot, {
  onOpenJournal: () => openPanel(openJournal, 'journal'),
  onOpenMap: () => openPanel(openMap, 'map'),
  onOpenInventory: () => openPanel(openInventory, 'bag')
});

const dialogue = new DialogueBox(uiRoot);
const nameplate = new Nameplate(uiRoot);
const photoFrame = el('div', 'photo-frame');
photoFrame.style.display = 'none';
uiRoot.appendChild(photoFrame);
const photoHint = el('div', 'photo-hint', 'photo mode · move the camera · P to save a photo · ESC to exit');
photoHint.style.display = 'none';
uiRoot.appendChild(photoHint);

const flash = el('div', 'flash');
uiRoot.appendChild(flash);

let openPanelInstance = null;
function openPanel(factory, kind) {
  if (openPanelInstance) openPanelInstance.close();

  const args = {
    root: uiRoot,
    onClose: () => {
      openPanelInstance = null;
    }
  };

  if (kind === 'journal') openPanelInstance = factory(uiRoot, { quests, save }, args.onClose);
  else if (kind === 'map') openPanelInstance = factory(uiRoot, { playerPos: player.position }, args.onClose);
  else if (kind === 'bag') openPanelInstance = factory(uiRoot, { inventory, economy }, args.onClose);

  return openPanelInstance;
}

// Title card: the game starts on a gentle front door rather than a menu.
const title = document.createElement('div');
title.className = 'title-card';
title.append(
  el('h1', 'title-name', 'スペースバニー・アルファ'),
  el('p', 'title-tag', 'spacebunnyalpha'),
  el('p', 'title-blurb', 'One island. A city that never quite sleeps, suburbs with a konbini that is always open, highlands with rice and a shrine, and a coast with a torii in the surf. Nothing can go wrong. Take your time.'),
  el('p', 'title-hint', 'WASD to walk · drag to look · E to talk · Shift to run')
);
const startButton = el('button', 'title-start', 'walk outside');
startButton.type = 'button';
startButton.addEventListener('click', startGame);
title.appendChild(startButton);
app.appendChild(title);

// The title card is the player's first click, and it is also what dismisses
// the build overlay. Once the island is actually generated the overlay has
// served its purpose, so fade it out on its own rather than making the player
// click a button they cannot see.
function dismissLoading() {
  if (!loading?.isConnected) return;
  loading.classList.add('is-done');
  setTimeout(() => loading.remove(), 700);
}

let started = false;
function startGame() {
  if (started) return;
  started = true;
  title.remove();
  dismissLoading();
  streamer.update(player.position);
  mountTouchControls();
}

// ---------------------------------------------------------------------------
// Interaction
// ---------------------------------------------------------------------------

let nearbyNpc = null;
let photoMode = false;
const photoIndex = { count: 0 };

function nearestNpc() {
  let best = null;
  let bestDist = Infinity;
  for (const villager of villagers) {
    const d = Math.hypot(villager.x - player.position.x, villager.z - player.position.z);
    if (d < bestDist) {
      bestDist = d;
      best = villager;
    }
  }
  return bestDist <= 4.5 ? best : null;
}

// Opens the conversation with the nearest villager: a line, plus whatever
// they have for you right now.
function talkTo(villager) {
  const npc = npcById(villager.npcId);
  const result = quests.talkTo(npc.id, clock.minutes);

  const choices = [];
  const offers = quests.offersFor(npc.id, clock.minutes);

  for (const quest of offers) {
    choices.push({
      label: quest.title,
      detail: quest.summary,
      onSelect: () => {
        quests.accept(quest.id, clock.minutes);
        hud.showToast(`Accepted: ${quest.title}`, 'good');
        dialogue.hide();
      }
    });
  }

  if (npc.shop) {
    choices.push({
      label: 'Look at the goods',
      detail: '',
      onSelect: () => {
        dialogue.hide();
        openPanelInstance = openShop(uiRoot, { inventory, economy, stock: npc.shop.stock }, () => {
          openPanelInstance = null;
        });
      }
    });
  }

  choices.push({
    label: 'Eat something',
    detail: 'Restores stamina',
    onSelect: () => {
      dialogue.hide();
      openPanelInstance = openCrafting(uiRoot, { crafting, skills }, () => {
        openPanelInstance = null;
      });
    }
  });

  dialogue.show({
    name: `${npc.name} · ${npc.nameJa}`,
    role: `${npc.role} · ${npc.roleJa}`,
    line: result.line,
    choices
  });
}

// Finds a fishing spot: the water's edge in the coast region.
function tryFishing() {
  const result = activities.fish(clock.hour);
  player.spendStamina(ACTIVITY_COST.fish);

  if (result.caught) {
    hud.showToast(`You caught a ${itemName(result.caught)}.`, 'good');
    save.data.stats.fishCaught += 1;
    save.data.flags.firstCatchDone = true;
  } else {
    hud.showToast('Nothing this time. The water is not in the mood.', 'info');
  }
}

function tryForaging() {
  const region = regionAt(player.position.x, player.position.z);
  const result = activities.forage(region);
  player.spendStamina(ACTIVITY_COST.forage);
  hud.showToast(`You found ${itemName(result.found)}.`, 'good');
}

// The E key does the right thing depending on where you are standing.
function interact() {
  if (dialogue.isOpen) {
    dialogue.hide();
    return;
  }

  if (openPanelInstance) {
    openPanelInstance.close();
    return;
  }

  if (nearbyNpc) {
    talkTo(nearbyNpc);
    return;
  }

  const region = regionAt(player.position.x, player.position.z);
  const biome = biomeAt(Math.floor(player.position.x), Math.floor(player.position.z));

  if (biome === BIOMES.shallow || biome === BIOMES.sand || region === 'coast') tryFishing();
  else if (biome === BIOMES.forest || biome === BIOMES.grass || biome === BIOMES.meadow) tryForaging();
  else if (biome === BIOMES.paddy) {
    const result = activities.harvest();
    player.spendStamina(ACTIVITY_COST.farm);
    hud.showToast(`You gathered ${itemName(result.found)}.`, 'good');
    save.data.flags.firstHarvestDone = true;
  } else {
    hud.showToast('Nothing to do here. Try the water, or the fields.', 'info');
  }
}

// Touch devices get an on-screen stick and buttons instead of a keyboard.
let touch = null;
function mountTouchControls() {
  if (!isTouchDevice() || touch) return;
  touch = new TouchControls(uiRoot, input, { onInteract: interact });
  touch.setMenuHandler(() => {
    // The menu button cycles the three panels, which is enough for a phone.
    if (openPanelInstance) {
      openPanelInstance.close();
      return;
    }
    openPanel(openJournal, 'journal');
  });
}

// Menu keys, handled globally so they work whether or not a panel is open.
window.addEventListener('keydown', (e) => {
  if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;

  if (e.code === 'KeyJ') openPanel(openJournal, 'journal');
  if (e.code === 'KeyM') openPanel(openMap, 'map');
  if (e.code === 'KeyI') openPanel(openInventory, 'bag');

  if (e.code === 'KeyE') interact();

  if (e.code === 'KeyP') {
    photoMode = !photoMode;
    photoFrame.style.display = photoMode ? 'block' : 'none';
    photoHint.style.display = photoMode ? 'block' : 'none';
  }

  if (e.code === 'Escape') {
    if (photoMode) {
      photoMode = false;
      photoFrame.style.display = 'none';
      photoHint.style.display = 'none';
    } else if (dialogue.isOpen) {
      dialogue.hide();
    }
  }
});

// Camera drag / zoom.
input.on('look', ({ dx, dy }) => followCamera.orbit(dx, dy));
input.on('zoom', ({ delta }) => followCamera.zoom(delta));

// ---------------------------------------------------------------------------
// Ambient feedback
// ---------------------------------------------------------------------------

bus.on('quest:completed', ({ quest }) => {
  hud.showToast(`Done: ${quest.title}`, 'good');
  const finished = quests.evaluate(clock.minutes);
  for (const f of finished) hud.showToast(`+ ${f.title}`, 'good');
});

bus.on('skill:levelled', ({ skill, level }) => {
  hud.showToast(`${skill} is now level ${level}.`, 'good');
});

bus.on('economy:changed', ({ yen }) => hud.setYen(yen));

bus.on('weather:changed', ({ current }) => {
  const label = { clear: 'Clear', cloudy: 'Cloudy', overcast: 'Overcast', rain: 'Rain', storm: 'Storm' }[current];
  hud.showToast(`${label}.`, 'info');
});

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------

const regionTracker = { last: null };

function updateHUD() {
  const region = regionInfo(player.position.x, player.position.z);
  const biome = biomeAt(Math.floor(player.position.x), Math.floor(player.position.z));

  hud.setRegion(region.label, region.labelJa);
  hud.setTime(clock.label, clock.day);
  hud.setWeather(weather.label());
  hud.setYen(economy.yen);
  hud.setStamina(player.stamina, PLAYER.staminaMax, player.exhausted);

  // Nameplate over a nearby villager, in screen space.
  nearbyNpc = nearestNpc();
  if (nearbyNpc) {
    const npc = npcById(nearbyNpc.npcId);
    const projected = new THREE.Vector3(nearbyNpc.x, nearbyNpc.y + 2.4, nearbyNpc.z).project(camera);
    const sx = (projected.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-projected.y * 0.5 + 0.5) * window.innerHeight;
    nameplate.show(`${npc.name} · ${npc.nameJa}`, sx, sy);
    hud.setPrompt(`Talk to ${npc.name}`, true);
  } else {
    nameplate.hide();
    if (biome === BIOMES.shallow || biome === BIOMES.sand) hud.setPrompt('Cast a line', true);
    else if (biome === BIOMES.paddy) hud.setPrompt('Tend the field', true);
    else hud.setPrompt('');
  }

  // Track the first unfinished objective so there is always something to do.
  const journal = quests.journal();
  const next = journal.active[0];
  if (next && !nearbyNpc) {
    const objective = next.objectives.find((o) => !o.done);
    if (objective) hud.setObjective(describeObjective(objective));
  } else if (!next) {
    hud.setObjective('');
  }

  // Discover a region the first time you set foot in it.
  if (regionTracker.last !== region.id) {
    regionTracker.last = region.id;
    if (quests.visitRegion(region.id)) {
      hud.showToast(`Found: ${region.label} · ${region.labelJa}`, 'good');
    }
  }
}

function describeObjective(objective) {
  if (objective.type === 'haveItem') {
    const what = objective.item ? ITEMS[objective.item]?.name ?? objective.item : objective.category;
    return `Bring ${objective.count} ${what}`;
  }
  if (objective.type === 'visitRegion') return `Visit ${REGIONS[objective.region]?.label ?? objective.region}`;
  if (objective.type === 'talkedTo') return `Talk to ${npcById(objective.npc)?.name ?? objective.npc}`;
  return '';
}

let last = performance.now();
let saveAccumulator = 0;
let frameCount = 0;

function frame(now) {
  requestAnimationFrame(frame);
  const delta = Math.min((now - last) / 1000, 0.1);
  last = now;

  if (!started) return;
  frameCount += 1;

  // Simulation.
  clock.update(delta);
  weather.update(clock.minutesPerSecond * delta);
  player.update(delta);

  // The surf pushes you back if you try to swim out.
  const surge = ocean.surgeStrength(player.position.x, player.position.z, WORLD.seaLevel, heightAt);
  if (surge > 0) {
    const push = surge * 6 * delta;
    const dx = player.position.x - 160;
    const dz = player.position.z - 140;
    const len = Math.hypot(dx, dz) || 1;
    player.position.x -= (dx / len) * push;
    player.position.z -= (dz / len) * push;
  }

  // Follow, animate. Order matters: the rig is placed first, then the animator
  // adds its bob on top of that height. Reversing them leaves the character a
  // frame behind the camera and can sink it below the ground.
  player.applyToRig(playerRig, delta);
  followCamera.update(delta, player.position, player.eyeHeight);
  playerAnimator.update(delta, player.speedScalar, { running: player.running });

  // Villagers drift to their scheduled spot for the current hour.
  for (const villager of villagers) {
    const npc = npcById(villager.npcId);
    let spot = null;
    for (const entry of npc.schedule) {
      if (clock.hour >= entry.fromHour && clock.hour < entry.toHour) spot = entry;
    }
    if (spot && Math.hypot(villager.x - spot.x, villager.z - spot.z) > 2) {
      villager.setTarget(spot.x, spot.z);
    } else {
      villager.clearTarget();
    }
    villager.update(delta, heightAt);
    if (villager === nearbyNpc) villager.faceTowards(player.position.x, player.position.z);
  }

  // World streaming and rendering.
  streamer.update(player.position);
  sky.update(clock, camera, weather.current);
  // Feed the sky's current light into every anime material, so one source of
  // truth drives the sun, the shadows and the rim light together.
  animeMaterials.syncLighting({
    lightDir: sky.sunDirection,
    lightColor: sky.sunLightColor,
    ambientColor: sky.horizonColor,
    rimStrength: sky.rimStrength
  });
  // Keep the sea in step with the sky: same sun direction, same horizon hue.
  ocean.setSunDirection(sky.sunDirection.x, sky.sunDirection.y, sky.sunDirection.z);
  ocean.setHorizonColor(sky.horizonColor);
  ocean.update(delta, camera);

  const mood = ambienceFor(regionAt(player.position.x, player.position.z), weather.current, clock);
  ambience.update(delta, camera, mood.particles, {
    rainIntensity: weather.rainIntensity,
    groundHeight: player.position.y
  });

  updateHUD();

  // Quests that can complete themselves (visited a region, got an item).
  quests.evaluate(clock.minutes);

  // Autosave every few seconds and on the way out.
  saveAccumulator += delta;
  if (saveAccumulator > 5) {
    saveAccumulator = 0;
    persist();
  }

  renderer.render(scene, camera);
}

// A small inspection handle. Debugging a 3D scene through the DOM alone is
// guesswork: this lets the screenshot tooling read the real camera, player and
// world state, and jump the player to a named place, so visual checks are
// measurements rather than opinions.
window.__sba = {
  // Direct handles, so visual tooling can inspect the actual scene graph
  // rather than inferring from the DOM.
  scene,
  camera,
  renderer,
  playerRig,
  player,
  followCamera,

  get state() {
    return {
      player: { x: player.position.x, y: player.position.y, z: player.position.z, yaw: player.yaw },
      camera: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
      cameraOrbit: { yaw: followCamera.yaw, pitch: followCamera.pitch, distance: followCamera.currentDistance },
      region: regionAt(player.position.x, player.position.z),
      clock: clock.label,
      weather: weather.current,
      chunkCount: streamer.loadedCount,
      instanceCount: streamer.instanceCount,
      drawCalls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      frame: frameCount
    };
  },
  // Places worth looking at, by name. These come from
  // scripts/find-vantage-points.js, which scans the world for spots with real
  // camera clearance in front, behind and above. Hand-picked coordinates kept
  // landing inside a tree canopy, a barn or a hillside.
  spots: {
    cityStreet: { x: 30, z: 90 },
    cityAlt: { x: 54, z: 90 },
    cityNorth: { x: 34, z: 114 },
    suburbStreet: { x: 38, z: 146 },
    suburbAlt: { x: 82, z: 190 },
    suburbGate: { x: 86, z: 150 },
    paddyView: { x: 178, z: 66 },
    ruralRoad: { x: 178, z: 42 },
    highlands: { x: 178, z: 114 },
    coastShore: { x: 62, z: 246 },
    coastVillage: { x: 74, z: 222 },
    seaTorii: { x: 120, z: 262 },
    // Kept for the landmarks, which are worth a look even though the camera
    // has to sit close.
    shrine: { x: 232, z: 100 },
    konbini: { x: 148, z: 176 },
    school: { x: 46, z: 170 },
    station: { x: 146, z: 118 }
  },
  // Spots that stand back from a landmark and aim the camera at it. The
  // scanner picks spots with clearance, but clearance alone says nothing about
  // whether the thing worth photographing is actually in frame.
  landmarkViews: {
    // Both tōrii stand in the approach, so they are framed from the path rather
    // than from the mountain side.
    torii: { from: { x: 120, z: 244 }, look: { x: 120, z: 286 }, pitch: 0.14, dist: 26 },
    // The shrine hall sits on the summit plateau, so the viewpoint has to be on
    // that plateau too. Approaching from lower ground just frames the hillside.
    shrine: { from: { x: 244, z: 110 }, look: { x: 232, z: 98 }, pitch: 0.14, dist: 14 },
    konbini: { from: { x: 148, z: 192 }, look: { x: 148, z: 176 }, pitch: 0.26, dist: 14 },
    school: { from: { x: 46, z: 186 }, look: { x: 46, z: 170 }, pitch: 0.26, dist: 16 },
    mountain: { from: { x: 196, z: 170 }, look: { x: 232, z: 100 }, pitch: 0.20, dist: 22 }
  },

  // Stands the player at a spot and points the camera at a target, so landmarks
  // land in frame instead of off to one side.
  view(name) {
    const v = this.landmarkViews[name];
    if (!v) return `unknown landmark: ${name}`;

    const placed = this.place(v.from.x, v.from.z, 0, v.pitch, v.dist, name);
    if (!placed.ok) return `viewing ${name}: ${placed.reason}`;

    const dx = v.look.x - player.position.x;
    const dz = v.look.z - player.position.z;
    // The camera is positioned at focus + (sin(yaw), cos(yaw)) * distance, so
    // to look from the player towards the target the camera must sit on the
    // opposite bearing. Getting this backwards aims the camera 180 degrees away
    // from the landmark, which is how the shrine shot ended up framing a torii.
    followCamera.yaw = Math.atan2(dx, dz);
    player.yaw = Math.atan2(dx, dz);
    followCamera.update(0.016, player.position, player.eyeHeight);
    return `viewing ${name} at ${player.position.x.toFixed(0)},${player.position.z.toFixed(0)}`;
  },

  teleport(name, yaw, pitch, distance) {
    const entry = this.spots[name];
    if (!entry) return `unknown spot: ${name}`;
    return this.place(entry.x, entry.z, yaw, pitch, distance, name);
  },

  // Shared placement logic. Steps off water and out of buildings so a shot is
  // never taken with the player standing in the sea or inside a wall.
  place(x, z, yaw, pitch, distance, label = 'spot') {
    let spot = { x, z };

    // Several otherwise-good vantage points sit on the shoreline, and dropping
    // the character into the water looks like a bug rather than a viewpoint.
    // Spiral outward until we find dry, unoccupied ground.
    const needsMove =
      heightAt(Math.floor(x), Math.floor(z)) <= WORLD.seaLevel ||
      plan.collision.isBlocked(x, z);

    if (needsMove) {
      let found = null;
      for (let r = 1; r <= 24 && !found; r += 1) {
        for (let a = 0; a < 16; a += 1) {
          const ang = (a / 16) * Math.PI * 2;
          const nx = Math.floor(x + Math.cos(ang) * r);
          const nz = Math.floor(z + Math.sin(ang) * r);
          if (nx < 2 || nz < 2 || nx > WORLD.size - 2 || nz > WORLD.size - 2) continue;
          if (heightAt(nx, nz) > WORLD.seaLevel && !plan.collision.isBlocked(nx, nz)) {
            found = { x: nx + 0.5, z: nz + 0.5 };
            break;
          }
        }
      }
      if (!found) return { ok: false, reason: `${label}: no dry ground nearby` };
      spot = found;
    }

    const h = heightAt(Math.floor(spot.x), Math.floor(spot.z));
    player.spawn({ x: spot.x, y: h, z: spot.z });
    if (typeof yaw === 'number') {
      followCamera.yaw = yaw;
      player.yaw = yaw;
    }
    if (typeof pitch === 'number') followCamera.pitch = pitch;
    if (typeof distance === 'number') {
      followCamera.distance = distance;
      followCamera.targetDistance = distance;
      followCamera.currentDistance = distance;
    }
    // Rebuild the surrounding chunks immediately so the shot is not empty.
    streamer.update(player.position);
    followCamera.update(0.016, player.position, player.eyeHeight);
    player.applyToRig(playerRig, 0.016);
    return { ok: true, x: spot.x, z: spot.z, h };
  },
  // Puts the camera where a character reads best, for the visual tooling, so
  // character work is judged from a consistent angle instead of whatever the
  // scene happened to offer.
  //
  // The camera sits at focus + (sin(yaw), cos(yaw)) * distance. A character
  // faces +z at yaw 0, so to face the camera its yaw must be exactly camYaw --
  // adding PI turns it to face away, which is exactly what it did.
  portrait(distance = 4.6, yaw = 0.5) {
    const p = player.position;

    followCamera.yaw = yaw;
    // Steep enough to clear a ridge between the camera and the feet.
    followCamera.pitch = 0.44;

    // Stay above CAMERA.minDistance; anything nearer puts the near plane
    // inside the character's head, which is nearly half the body width here.
    const dist = Math.max(distance, CAMERA.minDistance + 1.1);
    followCamera.distance = dist;
    followCamera.targetDistance = dist;
    followCamera.currentDistance = dist;
    followCamera.minDistance = dist;

    // Face the camera. Same bearing, no offset.
    player.yaw = yaw;
    playerRig.root.rotation.y = yaw;

    followCamera.update(0.016, p, player.eyeHeight);
    hud.setVisible(false);
    return `portrait: yaw=${yaw.toFixed(2)} pitch=0.44 dist=${dist.toFixed(1)}`;
  },

  hud(show = true) {
    hud.setVisible(show);
    return `hud ${show ? 'on' : 'off'}`;
  },

  camera(yaw, pitch, distance) {
    if (typeof yaw === 'number') followCamera.yaw = yaw;
    if (typeof pitch === 'number') followCamera.pitch = pitch;
    if (typeof distance === 'number') {
      followCamera.distance = distance;
      followCamera.targetDistance = distance;
    }
    return 'camera set';
  },

  // Pins the weather and the hour, so a visual check judges the art rather
  // than whatever the weather system happened to roll.
  setConditions(weatherType, hour) {
    if (weatherType) {
      weather.current = weatherType;
      weather.minutesUntilChange = 99999;
      weather.wetness = 0;
    }
    if (typeof hour === 'number') clock.setMinutes(hour * 60);
    return `weather=${weather.current} hour=${clock.label}`;
  }
};

function persist() {
  save.commitRuntimeState({
    clock,
    position: player.position,
    region: regionAt(player.position.x, player.position.z),
    stamina: player.stamina
  });
  save.data.stats.distanceWalked = player.distanceWalked;
  save.data.inventory = inventory.toJSON();
  save.data.yen = economy.yen;
  save.data.skills = skills.toJSON();
  save.data.weather = weather.toJSON();
  quests.persist();
  save.save();
}

window.addEventListener('beforeunload', persist);
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

setProgress(1);
// The island is built: retire the overlay on its own. The title card is still
// up, so the player reads it over a live scene rather than a dead one.
dismissLoading();
requestAnimationFrame(frame);