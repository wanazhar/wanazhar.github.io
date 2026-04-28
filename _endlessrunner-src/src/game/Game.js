import * as THREE from 'three';
import { gsap } from 'gsap';
import { GameState, BASE_WORLD_SPEED, MAX_DELTA, PowerUpType } from '../core/Constants.js';
import { stateManager } from '../core/StateManager.js';
import { InputManager } from '../core/InputManager.js';
import { PostProcessing } from '../graphics/PostProcessing.js';
import { CharacterController } from '../player/CharacterController.js';
import { WorldGenerator } from '../world/WorldGenerator.js';
import { Hud } from '../ui/Hud.js';
import { ThemeManager } from '../core/ThemeManager.js';
import { getTheme } from '../core/ThemePresets.js';

export class Game {
  constructor({ canvas }) {
    this.canvas = canvas;
    this.stateManager = stateManager;
    this.themeManager = new ThemeManager();
    this.clock = new THREE.Clock();
    this.paused = false;
    this.pixelRatioCap = 1.75;
    this.collisionGrace = 0;

    this.tick = this.tick.bind(this);
    this.resize = this.resize.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
  }

  boot() {
    this.createRenderer();
    this.createScene();
    this.createCamera();
    this.createLights();

    const themeId = this.themeManager.getTheme();
    this.character = new CharacterController(this.scene, { themeId });
    this.world = new WorldGenerator(this.scene, this.stateManager, { themeId });
    this.world.attachPlayer(this.character.root);

    this.post = new PostProcessing(this.renderer, this.scene, this.camera);
    this.input = new InputManager(window);
    this.hud = new Hud(this.stateManager, this.themeManager, {
      onSwipeThresholdChange: (value) => this.input.setSwipeThreshold(value),
      getSwipeThreshold: () => this.input.getSwipeThreshold(),
      onStart: () => this.stateManager.startGame(),
      onResetScores: () => this.stateManager.resetScores(),
      onThemeChange: (theme) => this.themeManager.setTheme(theme)
    });

    this.input.bind({
      left: () => this.whenPlaying(() => this.character.moveLeft()),
      right: () => this.whenPlaying(() => this.character.moveRight()),
      jump: () => this.whenPlaying(() => this.character.jump()),
      roll: () => this.whenPlaying(() => this.character.roll())
    });

    this.stateManager.subscribe((state, previous) => {
      if (state.gameState === GameState.PLAYING && previous.gameState !== GameState.PLAYING) {
        this.resetRun();
      }
    });

    this.unsubscribeTheme = this.themeManager.subscribe((theme) => this.applyTheme(theme));

    window.__runnerGame = this;
    this.installDemoHooks();

    window.addEventListener('resize', this.resize);
    document.addEventListener('visibilitychange', this.handleVisibility);
    this.resize();
    this.renderer.setAnimationLoop(this.tick);
  }

  installDemoHooks() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('autoplay')) return;

    window.setTimeout(() => this.stateManager.startGame(), 120);

    const demo = params.get('demo');
    if (demo === 'jump') window.setTimeout(() => this.character.jump(), 850);
    if (demo === 'lane') {
      window.setTimeout(() => this.character.moveLeft(), 580);
      window.setTimeout(() => this.character.moveRight(), 1050);
    }
    if (demo === 'roll') window.setTimeout(() => this.character.roll(), 900);
    if (demo === 'jetpack') window.setTimeout(() => this.stateManager.activatePowerUp(PowerUpType.JETPACK), 700);
    if (demo === 'magnet') window.setTimeout(() => this.stateManager.activatePowerUp(PowerUpType.MAGNET), 700);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  createScene() {
    this.scene = new THREE.Scene();
    const theme = getTheme(this.themeManager.getTheme());
    this.scene.background = new THREE.Color(theme.scene.background);
    this.scene.fog = new THREE.FogExp2(theme.scene.fog, this.themeManager.getTheme() === 'anime' ? 0.015 : 0.019);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 340);
    this.camera.position.set(0, 4.65, 8.8);
    this.camera.lookAt(0, 1.35, -12);
  }

  createLights() {
    this.hemi = new THREE.HemisphereLight(0x87c6ff, 0x171520, 2.0);
    this.scene.add(this.hemi);

    this.sun = new THREE.DirectionalLight(0xffffff, 2.2);
    this.sun.position.set(-5.5, 10, 6.5);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.camera.left = -10;
    this.sun.shadow.camera.right = 10;
    this.sun.shadow.camera.top = 10;
    this.sun.shadow.camera.bottom = -10;
    this.sun.shadow.camera.near = 0.5;
    this.sun.shadow.camera.far = 40;
    this.scene.add(this.sun);

    this.magentaFill = new THREE.PointLight(0xff5ea8, 14, 20, 2);
    this.magentaFill.position.set(4.5, 2.5, -6);
    this.scene.add(this.magentaFill);

    this.cyanRim = new THREE.PointLight(0x55d8ff, 18, 22, 2);
    this.cyanRim.position.set(-1.5, 3.8, -4.5);
    this.scene.add(this.cyanRim);
  }

  applyTheme(themeId) {
    const theme = getTheme(themeId);
    this.scene.background = new THREE.Color(theme.scene.background);
    if (this.scene.fog) this.scene.fog.color.setHex(theme.scene.fog);
    this.scene.fog.density = themeId === 'anime' ? 0.015 : 0.019;
    this.hemi.color.setHex(theme.scene.hemiSky);
    this.hemi.groundColor.setHex(theme.scene.hemiGround);
    this.magentaFill.color.setHex(theme.scene.magenta);
    this.cyanRim.color.setHex(theme.scene.cyan);
    document.documentElement.dataset.theme = themeId;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeId === 'anime' ? '#ffdced' : '#060712');
    this.character?.setTheme(themeId);
    this.world?.setTheme(themeId);
  }

  whenPlaying(callback) {
    if (this.stateManager.getState().gameState === GameState.PLAYING) callback();
  }

  resetRun() {
    gsap.globalTimeline.resume();
    this.collisionGrace = 0;
    this.clock.getDelta();
    this.character.reset();
    this.world.reset();
  }

  tick() {
    if (this.paused) return;
    const deltaSeconds = Math.min(this.clock.getDelta(), MAX_DELTA);
    const state = this.stateManager.getState();
    this.collisionGrace = Math.max(0, this.collisionGrace - deltaSeconds);

    if (state.gameState === GameState.PLAYING) {
      this.stateManager.tickPowerUps(deltaSeconds);
      const liveState = this.stateManager.getState();
      this.character.applyPowerUps(liveState.activePowerUps);
      this.character.update(deltaSeconds);
      this.world.update(deltaSeconds);
      this.stateManager.advanceRun(deltaSeconds, BASE_WORLD_SPEED);
      this.checkCollisions();
    } else {
      this.character.update(deltaSeconds);
    }

    this.post.render(deltaSeconds);
  }

  checkCollisions() {
    if (this.collisionGrace > 0) return;
    if (this.stateManager.hasPowerUp(PowerUpType.JETPACK)) return;

    const playerOBB = this.character.getOBB();
    const obstacleOBBs = this.world.getObstacleOBBs();

    for (const obstacleOBB of obstacleOBBs) {
      if (playerOBB.intersectsOBB(obstacleOBB, Number.EPSILON)) {
        if (this.stateManager.consumeShield()) {
          this.collisionGrace = 1.2;
          this.character.flashShield();
          return;
        }
        this.handleGameOver();
        return;
      }
    }
  }

  handleGameOver() {
    gsap.globalTimeline.pause();
    this.stateManager.gameOver();
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, this.pixelRatioCap);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(ratio);
    this.renderer.setSize(width, height, false);
    this.post?.resize(width, height, ratio);
  }

  handleVisibility() {
    this.paused = document.hidden;
    if (this.paused) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
      this.clock.getDelta();
    }
  }
}
