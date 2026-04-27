import * as THREE from 'three';
import { gsap } from 'gsap';
import { OBB } from 'three/addons/math/OBB.js';
import { GROUND_Y, LANES, PLAYER_Z } from '../core/Constants.js';
import { makeOBB, updateWorldOBB } from '../collision/OBBUtils.js';

const RUN_DURATION = 0.48;
const JUMP_DURATION = 0.72;
const ROLL_DURATION = 0.52;

export class CharacterController {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.name = 'PlayerRoot';
    this.root.position.set(LANES[1], GROUND_Y, PLAYER_Z);

    this.laneIndex = 1;
    this.groundY = GROUND_Y;
    this.jumpHeight = 3.2;
    this.isJumping = false;
    this.isRolling = false;
    this.jumpDriver = { t: 0 };

    this.parts = this.buildProceduralRunner();
    this.scene.add(this.root);

    this.mixer = new THREE.AnimationMixer(this.root);
    this.actions = this.createActions();
    this.currentAction = null;
    this.playAnimation('run', 0);

    this.playerLocalOBB = makeOBB(
      { x: 0, y: 1.05, z: 0 },
      { x: 0.48, y: 1.05, z: 0.42 }
    );
    this.playerRollingLocalOBB = makeOBB(
      { x: 0, y: 0.62, z: 0 },
      { x: 0.5, y: 0.58, z: 0.52 }
    );
    this.worldOBB = new OBB();
  }

  reset() {
    gsap.killTweensOf(this.root.position);
    gsap.killTweensOf(this.root.scale);
    gsap.killTweensOf(this.jumpDriver);
    this.laneIndex = 1;
    this.isJumping = false;
    this.isRolling = false;
    this.jumpDriver.t = 0;
    this.root.position.set(LANES[1], this.groundY, PLAYER_Z);
    this.root.scale.setScalar(1);
    this.playAnimation('run', 0.08);
  }

  buildProceduralRunner() {
    const material = new THREE.MeshStandardMaterial({
      color: 0x6ef3ff,
      roughness: 0.36,
      metalness: 0.08,
      emissive: 0x112844,
      emissiveIntensity: 0.28
    });
    const accent = new THREE.MeshStandardMaterial({
      color: 0xfff06a,
      roughness: 0.45,
      metalness: 0.2,
      emissive: 0x332500,
      emissiveIntensity: 0.22
    });
    const dark = new THREE.MeshStandardMaterial({ color: 0x161a2f, roughness: 0.5, metalness: 0.2 });

    const hips = new THREE.Group();
    hips.name = 'hips';
    hips.position.y = 0.95;
    this.root.add(hips);

    const torso = new THREE.Group();
    torso.name = 'torso';
    torso.position.y = 0.72;
    hips.add(torso);

    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.96, 0.42), material);
    torsoMesh.castShadow = true;
    torso.add(torsoMesh);

    const chestGlow = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 0.44), accent);
    chestGlow.position.set(0, 0.15, -0.225);
    torso.add(chestGlow);

    const head = new THREE.Group();
    head.name = 'head';
    head.position.y = 0.78;
    torso.add(head);
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.48), material);
    headMesh.castShadow = true;
    head.add(headMesh);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.04), dark);
    visor.position.set(0, 0.04, -0.255);
    head.add(visor);

    const leftArm = this.makeLimb('leftArm', material, 0.18, 0.78, 0.18);
    leftArm.position.set(-0.56, 0.46, -0.02);
    torso.add(leftArm);

    const rightArm = this.makeLimb('rightArm', material, 0.18, 0.78, 0.18);
    rightArm.position.set(0.56, 0.46, -0.02);
    torso.add(rightArm);

    const leftLeg = this.makeLimb('leftLeg', accent, 0.22, 0.86, 0.22);
    leftLeg.position.set(-0.24, -0.43, 0);
    hips.add(leftLeg);

    const rightLeg = this.makeLimb('rightLeg', accent, 0.22, 0.86, 0.22);
    rightLeg.position.set(0.24, -0.43, 0);
    hips.add(rightLeg);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.72, 28),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false })
    );
    shadow.name = 'playerShadow';
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.015;
    this.root.add(shadow);

    return { hips, torso, head, leftArm, rightArm, leftLeg, rightLeg, shadow };
  }

  makeLimb(name, material, width, height, depth) {
    const limb = new THREE.Group();
    limb.name = name;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.y = -height * 0.5;
    mesh.castShadow = true;
    limb.add(mesh);
    return limb;
  }

  createActions() {
    const tracks = {
      run: [
        this.track('leftLeg.rotation[x]', RUN_DURATION, [0, 0.12, 0.24, 0.36, 0.48], [0.72, -0.72, 0.72, -0.72, 0.72]),
        this.track('rightLeg.rotation[x]', RUN_DURATION, [0, 0.12, 0.24, 0.36, 0.48], [-0.72, 0.72, -0.72, 0.72, -0.72]),
        this.track('leftArm.rotation[x]', RUN_DURATION, [0, 0.12, 0.24, 0.36, 0.48], [-0.62, 0.62, -0.62, 0.62, -0.62]),
        this.track('rightArm.rotation[x]', RUN_DURATION, [0, 0.12, 0.24, 0.36, 0.48], [0.62, -0.62, 0.62, -0.62, 0.62]),
        this.track('torso.rotation[x]', RUN_DURATION, [0, 0.24, 0.48], [-0.08, -0.16, -0.08]),
        this.track('head.rotation[x]', RUN_DURATION, [0, 0.24, 0.48], [0.08, 0.0, 0.08])
      ],
      jump: [
        this.track('leftLeg.rotation[x]', JUMP_DURATION, [0, 0.18, 0.5, 0.72], [0.3, -0.55, -0.12, 0.0]),
        this.track('rightLeg.rotation[x]', JUMP_DURATION, [0, 0.18, 0.5, 0.72], [-0.3, -0.42, 0.18, 0.0]),
        this.track('leftArm.rotation[x]', JUMP_DURATION, [0, 0.22, 0.72], [-0.4, -1.25, -0.1]),
        this.track('rightArm.rotation[x]', JUMP_DURATION, [0, 0.22, 0.72], [0.4, -1.05, 0.1]),
        this.track('torso.rotation[x]', JUMP_DURATION, [0, 0.35, 0.72], [-0.08, -0.28, -0.08])
      ],
      roll: [
        this.track('hips.rotation[x]', ROLL_DURATION, [0, 0.16, 0.36, 0.52], [0, -1.15, -1.0, 0]),
        this.track('torso.rotation[x]', ROLL_DURATION, [0, 0.18, 0.36, 0.52], [-0.08, -1.0, -0.82, -0.08]),
        this.track('head.rotation[x]', ROLL_DURATION, [0, 0.18, 0.52], [0.08, -0.5, 0.08]),
        this.track('leftArm.rotation[x]', ROLL_DURATION, [0, 0.18, 0.52], [-0.4, 0.2, -0.4]),
        this.track('rightArm.rotation[x]', ROLL_DURATION, [0, 0.18, 0.52], [0.4, -0.2, 0.4])
      ]
    };

    const clips = {
      run: new THREE.AnimationClip('Run', RUN_DURATION, tracks.run),
      jump: new THREE.AnimationClip('Jump', JUMP_DURATION, tracks.jump),
      roll: new THREE.AnimationClip('Roll', ROLL_DURATION, tracks.roll)
    };

    const actions = {
      run: this.mixer.clipAction(clips.run),
      jump: this.mixer.clipAction(clips.jump),
      roll: this.mixer.clipAction(clips.roll)
    };

    actions.run.setLoop(THREE.LoopRepeat);
    actions.jump.setLoop(THREE.LoopOnce, 1);
    actions.jump.clampWhenFinished = true;
    actions.roll.setLoop(THREE.LoopOnce, 1);
    actions.roll.clampWhenFinished = true;

    return actions;
  }

  track(name, duration, times, values) {
    return new THREE.NumberKeyframeTrack(name, times.map((t) => Math.min(t, duration)), values);
  }

  playAnimation(name, fade = 0.12) {
    const nextAction = this.actions[name];
    if (!nextAction || nextAction === this.currentAction) return;

    nextAction.reset().enabled = true;
    nextAction.setEffectiveTimeScale(1);
    nextAction.setEffectiveWeight(1);
    nextAction.play();

    if (this.currentAction && fade > 0) {
      this.currentAction.crossFadeTo(nextAction, fade, false);
    } else if (this.currentAction) {
      this.currentAction.stop();
    }

    this.currentAction = nextAction;
  }

  moveLeft() {
    this.setLane(this.laneIndex - 1);
  }

  moveRight() {
    this.setLane(this.laneIndex + 1);
  }

  setLane(laneIndex) {
    const clampedLane = THREE.MathUtils.clamp(laneIndex, 0, LANES.length - 1);
    if (clampedLane === this.laneIndex) return;
    this.laneIndex = clampedLane;

    gsap.to(this.root.position, {
      x: LANES[this.laneIndex],
      duration: 0.17,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  jump() {
    if (this.isJumping || this.isRolling) return;
    this.isJumping = true;
    this.jumpDriver.t = 0;
    this.playAnimation('jump', 0.08);

    gsap.killTweensOf(this.jumpDriver);
    gsap.to(this.jumpDriver, {
      t: 1,
      duration: JUMP_DURATION,
      ease: 'none',
      onUpdate: () => {
        const t = this.jumpDriver.t;
        this.root.position.y = this.groundY + this.jumpHeight * 4 * t * (1 - t);
        this.parts.shadow.scale.setScalar(THREE.MathUtils.lerp(1, 0.52, Math.sin(Math.PI * t)));
        this.parts.shadow.material.opacity = THREE.MathUtils.lerp(0.25, 0.1, Math.sin(Math.PI * t));
      },
      onComplete: () => {
        this.root.position.y = this.groundY;
        this.parts.shadow.scale.setScalar(1);
        this.parts.shadow.material.opacity = 0.25;
        this.isJumping = false;
        if (!this.isRolling) this.playAnimation('run', 0.12);
      }
    });
  }

  roll() {
    if (this.isRolling || this.isJumping) return;
    this.isRolling = true;
    this.playAnimation('roll', 0.07);

    gsap.killTweensOf(this.root.scale);
    gsap.timeline({
      onComplete: () => {
        this.isRolling = false;
        this.root.scale.set(1, 1, 1);
        if (!this.isJumping) this.playAnimation('run', 0.1);
      }
    })
      .to(this.root.scale, { y: 0.58, z: 1.08, duration: 0.12, ease: 'power2.out' })
      .to(this.root.scale, { y: 0.58, z: 1.08, duration: ROLL_DURATION - 0.24, ease: 'none' })
      .to(this.root.scale, { y: 1, z: 1, duration: 0.12, ease: 'power2.out' });
  }

  update(deltaSeconds) {
    this.mixer.update(deltaSeconds);
  }

  getOBB() {
    return updateWorldOBB(this.isRolling ? this.playerRollingLocalOBB : this.playerLocalOBB, this.root, this.worldOBB);
  }
}
