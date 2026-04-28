import * as THREE from 'three';
import { gsap } from 'gsap';
import { GameState, BASE_WORLD_SPEED, MAX_DELTA } from '../core/Constants.js';
import { stateManager } from '../core/StateManager.js';
import { InputManager } from '../core/InputManager.js';
import { PostProcessing } from '../graphics/PostProcessing.js';
import { CharacterController } from '../player/CharacterController.js';
import { WorldGenerator } from '../world/WorldGenerator.js';
import { Hud } from '../ui/Hud.js';

export class Game {
  constructor({ canvas }) {
    this.canvas = canvas;
    this.stateManager = stateManager;
    this.clock = new THREE.Clock();
    this.paused = false;
    this.pixelRatioCap = 1.75;

    this.tick = this.tick.bind(this);
    this.resize = this.resize.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
  }

  boot() {
    this.createRenderer();
    this.createScene();
    this.createCamera();
    this.createLights();

    this.character = new CharacterController(this.scene);
    this.world = new WorldGenerator(this.scene, this.stateManager);
    this.world.attachPlayer(this.character.root);

    this.post = new PostProcessing(this.renderer, this.scene, this.camera);
    this.input = new InputManager(window);
    this.hud = new Hud(this.stateManager, {
      onSwipeThresholdChange: (value) => this.input.setSwipeThreshold(value),
      getSwipeThreshold: () => this.input.getSwipeThreshold()
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
    if (demo === 'jump') {
      window.setTimeout(() => this.character.jump(), 850);
    }
    if (demo === 'lane') {
      window.setTimeout(() => this.character.moveLeft(), 580);
      window.setTimeout(() => this.character.moveRight(), 1050);
    }
    if (demo === 'roll') {
      window.setTimeout(() => this.character.roll(), 900);
    }
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
    this.scene.background = new THREE.Color(0x08101f);
    this.scene.fog = new THREE.FogExp2(0x08101f, 0.019);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 340);
    this.camera.position.set(0, 4.65, 8.8);
    this.camera.lookAt(0, 1.35, -12);
  }

  createLights() {
    const hemi = new THREE.HemisphereLight(0x87c6ff, 0x171520, 2.0);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffffff, 2.35);
    sun.position.set(-5.5, 10, 6.5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -10;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 40;
    this.scene.add(sun);

    const magentaFill = new THREE.PointLight(0xff5ea8, 14, 20, 2);
    magentaFill.position.set(4.5, 2.5, -6);
    this.scene.add(magentaFill);

    const cyanRim = new THREE.PointLight(0x55d8ff, 18, 22, 2);
    cyanRim.position.set(-1.5, 3.8, -4.5);
    this.scene.add(cyanRim);
  }

  whenPlaying(callback) {
    if (this.stateManager.getState().gameState === GameState.PLAYING) callback();
  }

  resetRun() {
    gsap.globalTimeline.resume();
    this.clock.getDelta();
    this.character.reset();
    this.world.reset();
  }

  tick() {
    if (this.paused) return;
    const deltaSeconds = Math.min(this.clock.getDelta(), MAX_DELTA);
    const state = this.stateManager.getState();

    if (state.gameState === GameState.PLAYING) {
      this.character.update(deltaSeconds);
      const speed = this.world.update(deltaSeconds);
      this.stateManager.advanceRun(deltaSeconds, BASE_WORLD_SPEED);
      this.checkCollisions(speed);
    } else {
      this.character.update(deltaSeconds);
    }

    this.post.render(deltaSeconds);
  }

  checkCollisions(speed) {
    const playerOBB = this.character.getOBB();
    const obstacleOBBs = this.world.getObstacleOBBs();

    for (const obstacleOBB of obstacleOBBs) {
      if (playerOBB.intersectsOBB(obstacleOBB, Number.EPSILON)) {
        this.handleGameOver(speed);
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
