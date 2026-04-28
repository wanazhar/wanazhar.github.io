import * as THREE from 'three';
import { gsap } from 'gsap';
import { OBB } from 'three/addons/math/OBB.js';
import { GROUND_Y, LANES, PLAYER_Z, PowerUpType } from '../core/Constants.js';
import { makeOBB, updateWorldOBB } from '../collision/OBBUtils.js';
import { getTheme } from '../core/ThemePresets.js';

const RUN_DURATION = 0.48;
const JUMP_DURATION = 0.72;
const ROLL_DURATION = 0.52;

export class CharacterController {
  constructor(scene, { themeId = 'neon' } = {}) {
    this.scene = scene;
    this.themeId = themeId;
    this.scene = scene;
    this.root = new THREE.Group();
    this.root.name = 'PlayerRoot';
    this.root.position.set(LANES[1], GROUND_Y, PLAYER_Z);

    this.laneIndex = 1;
    this.groundY = GROUND_Y;
    this.jumpHeight = 3.2;
    this.isJumping = false;
    this.isRolling = false;
    this.isFlying = false;
    this.flyY = 4.35;
    this.jumpDriver = { t: 0 };
    this.motionMode = 'run';

    this.scene.add(this.root);
    this.buildTheme(this.themeId);

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

  buildTheme(themeId) {
    this.themeId = themeId;
    this.theme = getTheme(themeId);
    this.root.clear();

    const built = themeId === 'anime'
      ? this.buildAnimeRunner(this.theme)
      : this.buildNeonRunner(this.theme);

    this.parts = built.parts;
    this.root.add(built.avatar);
    this.powerVisuals = this.buildPowerVisuals();

    this.mixer = new THREE.AnimationMixer(this.root);
    this.actions = this.createActions();
    this.currentAction = null;
    this.playAnimation('run', 0);
    this.updateMotionVisuals();
  }

  setTheme(themeId) {
    const currentPosition = this.root.position.clone();
    const currentScale = this.root.scale.clone();
    const wasFlying = this.isFlying;
    this.buildTheme(themeId);
    this.root.position.copy(currentPosition);
    this.root.scale.copy(currentScale);
    this.setPowerVisuals({ [PowerUpType.JETPACK]: wasFlying ? 1 : 0 });
  }

  reset() {
    gsap.killTweensOf(this.root.position);
    gsap.killTweensOf(this.root.scale);
    gsap.killTweensOf(this.jumpDriver);
    this.laneIndex = 1;
    this.isJumping = false;
    this.isRolling = false;
    this.isFlying = false;
    this.motionMode = 'run';
    this.jumpDriver.t = 0;
    this.root.position.set(LANES[1], this.groundY, PLAYER_Z);
    this.root.scale.setScalar(1);
    this.setPowerVisuals({});
    this.updateMotionVisuals();
    this.playAnimation('run', 0.08);
  }

  buildNeonRunner(theme) {
    const avatar = new THREE.Group();
    avatar.name = 'avatar';
    const primary = new THREE.MeshStandardMaterial({ color: theme.player.primary, roughness: 0.36, metalness: 0.08, emissive: 0x0e1558, emissiveIntensity: 0.28 });
    const accent = new THREE.MeshStandardMaterial({ color: theme.player.accent, roughness: 0.42, metalness: 0.18, emissive: 0x4a0f27, emissiveIntensity: 0.2 });
    const dark = new THREE.MeshStandardMaterial({ color: theme.player.dark, roughness: 0.52, metalness: 0.2 });
    const faceMat = new THREE.MeshStandardMaterial({ color: theme.player.face, roughness: 0.26, metalness: 0.06, emissive: 0x16234d, emissiveIntensity: 0.1 });

    const hips = new THREE.Group();
    hips.name = 'hips';
    hips.position.y = 0.95;
    avatar.add(hips);

    const torso = new THREE.Group();
    torso.name = 'torso';
    torso.position.y = 0.72;
    hips.add(torso);

    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.98, 0.44), primary);
    torsoMesh.castShadow = true;
    torso.add(torsoMesh);

    const chestGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.09, 8), accent);
    chestGlow.rotation.z = Math.PI / 2;
    chestGlow.position.set(0, 0.12, -0.255);
    torso.add(chestGlow);

    const skirt = new THREE.Group();
    skirt.name = 'skirt';
    skirt.position.y = -0.38;
    const skirtMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.54, 0.36, 6, 1, true), dark);
    skirtMesh.castShadow = true;
    skirt.add(skirtMesh);
    hips.add(skirt);

    const head = new THREE.Group();
    head.name = 'head';
    head.position.y = 0.82;
    torso.add(head);
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.33, 22, 18), faceMat);
    headMesh.castShadow = true;
    head.add(headMesh);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 0.05), accent);
    visor.position.set(0, 0.02, -0.295);
    head.add(visor);

    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.34, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), dark);
    hairCap.position.y = 0.08;
    head.add(hairCap);

    const twinTailL = new THREE.Group();
    twinTailL.name = 'twinTailL';
    twinTailL.position.set(-0.25, -0.08, 0.03);
    const twinMeshL = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.38, 4, 10), accent);
    twinMeshL.rotation.z = 0.52;
    twinMeshL.position.set(-0.08, -0.22, 0);
    twinTailL.add(twinMeshL);
    head.add(twinTailL);

    const twinTailR = new THREE.Group();
    twinTailR.name = 'twinTailR';
    twinTailR.position.set(0.25, -0.08, 0.03);
    const twinMeshR = twinMeshL.clone();
    twinMeshR.rotation.z = -0.52;
    twinMeshR.position.set(0.08, -0.22, 0);
    twinTailR.add(twinMeshR);
    head.add(twinTailR);

    const leftArm = this.makeLimb('leftArm', primary, 0.18, 0.78, 0.18, 0.06);
    leftArm.position.set(-0.58, 0.46, -0.02);
    torso.add(leftArm);

    const rightArm = this.makeLimb('rightArm', primary, 0.18, 0.78, 0.18, -0.06);
    rightArm.position.set(0.58, 0.46, -0.02);
    torso.add(rightArm);

    const leftLeg = this.makeLimb('leftLeg', accent, 0.22, 0.9, 0.22, 0.06);
    leftLeg.position.set(-0.24, -0.42, 0);
    hips.add(leftLeg);
    const rightLeg = this.makeLimb('rightLeg', accent, 0.22, 0.9, 0.22, -0.06);
    rightLeg.position.set(0.24, -0.42, 0);
    hips.add(rightLeg);

    const flightPack = this.makeFlightPack(theme, 'neon');
    flightPack.name = 'flightPack';
    flightPack.position.set(0, 0.16, 0.28);
    flightPack.visible = false;
    torso.add(flightPack);

    const runTrail = new THREE.Mesh(new THREE.RingGeometry(0.48, 0.72, 28), new THREE.MeshBasicMaterial({ color: theme.player.accent, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }));
    runTrail.name = 'runTrail';
    runTrail.rotation.x = -Math.PI / 2;
    runTrail.position.y = 0.08;
    runTrail.visible = true;
    avatar.add(runTrail);

    const jumpHalo = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.035, 8, 42), new THREE.MeshBasicMaterial({ color: theme.player.jetpack, transparent: true, opacity: 0.55, depthWrite: false }));
    jumpHalo.name = 'jumpHalo';
    jumpHalo.rotation.x = Math.PI / 2;
    jumpHalo.position.y = 1.1;
    jumpHalo.visible = false;
    avatar.add(jumpHalo);

    const shadow = this.makeShadow();
    avatar.add(shadow);

    return { avatar, parts: { hips, torso, head, leftArm, rightArm, leftLeg, rightLeg, skirt, twinTailL, twinTailR, shadow, flightPack, runTrail, jumpHalo } };
  }

  buildAnimeRunner(theme) {
    const avatar = new THREE.Group();
    avatar.name = 'avatar';
    const skin = new THREE.MeshStandardMaterial({ color: theme.player.skin, roughness: 0.72, metalness: 0.02 });
    const hair = new THREE.MeshStandardMaterial({ color: theme.player.hair, roughness: 0.5, metalness: 0.05, emissive: 0x6a2348, emissiveIntensity: 0.05 });
    const hairDark = new THREE.MeshStandardMaterial({ color: theme.player.hairDark, roughness: 0.56, metalness: 0.04 });
    const uniform = new THREE.MeshStandardMaterial({ color: theme.player.primary, roughness: 0.42, metalness: 0.05 });
    const accent = new THREE.MeshStandardMaterial({ color: theme.player.accent, roughness: 0.38, metalness: 0.05, emissive: 0x8e345e, emissiveIntensity: 0.08 });
    const skirtMat = new THREE.MeshStandardMaterial({ color: theme.player.skirt, roughness: 0.38, metalness: 0.04 });
    const boot = new THREE.MeshStandardMaterial({ color: theme.player.boot, roughness: 0.36, metalness: 0.05 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x364b9c, roughness: 0.2, metalness: 0.05, emissive: 0x0c163d, emissiveIntensity: 0.08 });
    const blushMat = new THREE.MeshStandardMaterial({ color: theme.player.blush, roughness: 0.55, metalness: 0.02 });

    const hips = new THREE.Group();
    hips.name = 'hips';
    hips.position.y = 0.98;
    avatar.add(hips);

    const torso = new THREE.Group();
    torso.name = 'torso';
    torso.position.y = 0.76;
    hips.add(torso);

    const torsoMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.55, 4, 12), uniform);
    torsoMesh.scale.set(1.25, 1.18, 1);
    torsoMesh.castShadow = true;
    torso.add(torsoMesh);

    const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.08), accent);
    ribbon.position.set(0, 0.15, -0.2);
    torso.add(ribbon);

    const skirt = new THREE.Group();
    skirt.name = 'skirt';
    skirt.position.y = -0.42;
    const skirtMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.52, 0.34, 10, 1, true), skirtMat);
    skirtMesh.castShadow = true;
    skirt.add(skirtMesh);
    const skirtHem = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.03, 6, 18), accent);
    skirtHem.rotation.x = Math.PI / 2;
    skirtHem.position.y = -0.17;
    skirt.add(skirtHem);
    hips.add(skirt);

    const head = new THREE.Group();
    head.name = 'head';
    head.position.y = 0.82;
    torso.add(head);
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 20), skin);
    headMesh.scale.set(1, 1.08, 1);
    headMesh.castShadow = true;
    head.add(headMesh);

    const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.44, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.6), hair);
    fringe.position.y = 0.06;
    head.add(fringe);

    const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.18, 0.14), hair);
    bangs.position.set(0, 0.11, -0.28);
    head.add(bangs);

    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), eyeMat);
    eyeL.scale.set(0.85, 1.35, 0.35);
    eyeL.position.set(-0.12, 0.02, -0.38);
    head.add(eyeL);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.12;
    head.add(eyeR);

    const blushL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), blushMat);
    blushL.scale.set(1.4, 0.5, 0.2);
    blushL.position.set(-0.18, -0.1, -0.35);
    head.add(blushL);
    const blushR = blushL.clone();
    blushR.position.x = 0.18;
    head.add(blushR);

    const twinTailL = new THREE.Group();
    twinTailL.name = 'twinTailL';
    twinTailL.position.set(-0.32, 0.02, 0.02);
    const tailRibbonL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.08), accent);
    tailRibbonL.position.set(-0.02, -0.05, 0.02);
    twinTailL.add(tailRibbonL);
    const tailMeshL = new THREE.Mesh(new THREE.CapsuleGeometry(0.095, 0.68, 4, 12), hairDark);
    tailMeshL.rotation.z = 0.38;
    tailMeshL.position.set(-0.14, -0.34, 0.02);
    twinTailL.add(tailMeshL);
    head.add(twinTailL);

    const twinTailR = new THREE.Group();
    twinTailR.name = 'twinTailR';
    twinTailR.position.set(0.32, 0.02, 0.02);
    const tailRibbonR = tailRibbonL.clone();
    tailRibbonR.position.x = 0.02;
    twinTailR.add(tailRibbonR);
    const tailMeshR = tailMeshL.clone();
    tailMeshR.rotation.z = -0.38;
    tailMeshR.position.x = 0.14;
    twinTailR.add(tailMeshR);
    head.add(twinTailR);

    const leftArm = this.makeAnimeLimb('leftArm', skin, uniform, 0.13, 0.75);
    leftArm.position.set(-0.45, 0.4, 0);
    torso.add(leftArm);
    const rightArm = this.makeAnimeLimb('rightArm', skin, uniform, 0.13, 0.75);
    rightArm.position.set(0.45, 0.4, 0);
    torso.add(rightArm);

    const leftLeg = this.makeAnimeLeg('leftLeg', skin, boot, 0.14, 0.88);
    leftLeg.position.set(-0.18, -0.4, 0);
    hips.add(leftLeg);
    const rightLeg = this.makeAnimeLeg('rightLeg', skin, boot, 0.14, 0.88);
    rightLeg.position.set(0.18, -0.4, 0);
    hips.add(rightLeg);

    const flightPack = this.makeFlightPack(theme, 'anime');
    flightPack.name = 'flightPack';
    flightPack.position.set(0, 0.18, 0.24);
    flightPack.visible = false;
    torso.add(flightPack);

    const runTrail = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.66, 32), new THREE.MeshBasicMaterial({ color: theme.player.accent, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }));
    runTrail.name = 'runTrail';
    runTrail.rotation.x = -Math.PI / 2;
    runTrail.position.y = 0.08;
    avatar.add(runTrail);

    const jumpHalo = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.04, 8, 42), new THREE.MeshBasicMaterial({ color: theme.player.jetpack, transparent: true, opacity: 0.62, depthWrite: false }));
    jumpHalo.name = 'jumpHalo';
    jumpHalo.rotation.x = Math.PI / 2;
    jumpHalo.position.y = 1.16;
    jumpHalo.visible = false;
    avatar.add(jumpHalo);

    const shadow = this.makeShadow();
    avatar.add(shadow);

    return { avatar, parts: { hips, torso, head, leftArm, rightArm, leftLeg, rightLeg, skirt, twinTailL, twinTailR, shadow, flightPack, runTrail, jumpHalo } };
  }

  makeShadow() {
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.72, 28),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false })
    );
    shadow.name = 'playerShadow';
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.015;
    return shadow;
  }

  makeLimb(name, material, width, height, depth, handOffset = 0) {
    const limb = new THREE.Group();
    limb.name = name;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.y = -height * 0.5;
    mesh.castShadow = true;
    limb.add(mesh);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(width * 0.48, 10, 8), material);
    hand.position.set(handOffset, -height, 0);
    hand.castShadow = true;
    limb.add(hand);
    return limb;
  }

  makeAnimeLimb(name, skinMat, sleeveMat, radius, height) {
    const limb = new THREE.Group();
    limb.name = name;
    const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(radius * 1.08, height * 0.24, 4, 10), sleeveMat);
    sleeve.position.y = -height * 0.22;
    sleeve.castShadow = true;
    limb.add(sleeve);
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(radius, height * 0.54, 4, 10), skinMat);
    arm.position.y = -height * 0.58;
    arm.castShadow = true;
    limb.add(arm);
    return limb;
  }

  makeAnimeLeg(name, skinMat, bootMat, radius, height) {
    const limb = new THREE.Group();
    limb.name = name;
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(radius, height * 0.52, 4, 10), skinMat);
    leg.position.y = -height * 0.52;
    leg.castShadow = true;
    limb.add(leg);
    const boot = new THREE.Mesh(new THREE.CapsuleGeometry(radius * 1.05, height * 0.2, 4, 8), bootMat);
    boot.position.y = -height * 0.94;
    boot.scale.set(1.1, 0.92, 1.55);
    boot.castShadow = true;
    limb.add(boot);
    return limb;
  }

  makeFlightPack(theme, flavor) {
    const group = new THREE.Group();
    const main = new THREE.MeshStandardMaterial({ color: flavor === 'anime' ? theme.player.accent : theme.player.primary, roughness: 0.28, metalness: 0.22, emissive: 0x3c1235, emissiveIntensity: 0.16 });
    const side = new THREE.MeshStandardMaterial({ color: theme.player.jetpack, roughness: 0.24, metalness: 0.12, emissive: 0x5a3d00, emissiveIntensity: 0.2 });

    const core = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.56, 0.22), main);
    group.add(core);
    const tankL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.46, 10), side);
    tankL.rotation.z = Math.PI / 2;
    tankL.position.set(-0.23, 0, 0);
    group.add(tankL);
    const tankR = tankL.clone();
    tankR.position.x = 0.23;
    group.add(tankR);

    if (flavor === 'anime') {
      const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 0.16), main);
      wingL.position.set(-0.33, 0.12, 0.04);
      wingL.rotation.z = 0.35;
      group.add(wingL);
      const wingR = wingL.clone();
      wingR.position.x = 0.33;
      wingR.rotation.z = -0.35;
      group.add(wingR);
    }

    return group;
  }

  buildPowerVisuals() {
    const shield = new THREE.Mesh(
      new THREE.SphereGeometry(1.05, 18, 12),
      new THREE.MeshBasicMaterial({ color: this.theme.player.shield, transparent: true, opacity: 0.16, wireframe: true, depthWrite: false })
    );
    shield.name = 'ShieldBubble';
    shield.position.y = 1.1;
    shield.visible = false;
    this.root.add(shield);

    const magnetAura = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.035, 8, 42),
      new THREE.MeshBasicMaterial({ color: this.theme.player.magnet, transparent: true, opacity: 0.42, depthWrite: false })
    );
    magnetAura.name = 'MagnetAura';
    magnetAura.position.y = 1.05;
    magnetAura.rotation.x = Math.PI / 2;
    magnetAura.visible = false;
    this.root.add(magnetAura);

    const flameMat = new THREE.MeshBasicMaterial({ color: this.theme.player.jetpack, transparent: true, opacity: 0.86, depthWrite: false });
    const jetpackFlameLeft = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.55, 10), flameMat);
    jetpackFlameLeft.name = 'JetpackFlameLeft';
    jetpackFlameLeft.position.set(-0.22, 1.42, 0.52);
    jetpackFlameLeft.rotation.x = Math.PI;
    const jetpackFlameRight = jetpackFlameLeft.clone();
    jetpackFlameRight.name = 'JetpackFlameRight';
    jetpackFlameRight.position.x = 0.22;
    jetpackFlameLeft.visible = false;
    jetpackFlameRight.visible = false;
    this.root.add(jetpackFlameLeft, jetpackFlameRight);

    return { shield, magnetAura, jetpackFlameLeft, jetpackFlameRight };
  }

  setPowerVisuals(activePowerUps = {}) {
    if (!this.powerVisuals) return;
    const shieldActive = (activePowerUps[PowerUpType.SHIELD] ?? 0) > 0;
    const magnetActive = (activePowerUps[PowerUpType.MAGNET] ?? 0) > 0;
    const jetpackActive = (activePowerUps[PowerUpType.JETPACK] ?? 0) > 0;
    this.powerVisuals.shield.visible = shieldActive;
    this.powerVisuals.magnetAura.visible = magnetActive;
    this.powerVisuals.jetpackFlameLeft.visible = jetpackActive;
    this.powerVisuals.jetpackFlameRight.visible = jetpackActive;
    if (this.parts?.flightPack) this.parts.flightPack.visible = jetpackActive;
  }

  applyPowerUps(activePowerUps = {}) {
    this.setPowerVisuals(activePowerUps);
    const shouldFly = (activePowerUps[PowerUpType.JETPACK] ?? 0) > 0;
    if (shouldFly === this.isFlying) return;

    this.isFlying = shouldFly;
    this.isJumping = false;
    this.isRolling = false;
    this.motionMode = shouldFly ? 'fly' : 'run';
    gsap.killTweensOf(this.jumpDriver);
    gsap.killTweensOf(this.root.position);

    gsap.to(this.root.position, {
      y: shouldFly ? this.flyY : this.groundY,
      duration: shouldFly ? 0.42 : 0.34,
      ease: shouldFly ? 'power3.out' : 'power2.inOut',
      overwrite: 'auto',
      onUpdate: () => this.updateMotionVisuals(),
      onComplete: () => {
        if (!this.isFlying) this.root.position.y = this.groundY;
        this.motionMode = this.isFlying ? 'fly' : 'run';
        this.updateMotionVisuals();
      }
    });
    this.playAnimation('run', 0.12);
  }

  flashShield() {
    if (!this.powerVisuals?.shield) return;
    const shield = this.powerVisuals.shield;
    shield.visible = true;
    gsap.fromTo(shield.scale, { x: 1.6, y: 1.6, z: 1.6 }, { x: 1, y: 1, z: 1, duration: 0.35, ease: 'power2.out' });
    gsap.fromTo(shield.material, { opacity: 0.42 }, { opacity: 0.16, duration: 0.35, ease: 'power2.out' });
  }

  createActions() {
    const tracks = {
      run: [
        this.track('leftLeg.rotation[x]', RUN_DURATION, [0, 0.12, 0.24, 0.36, 0.48], [0.78, -0.78, 0.78, -0.78, 0.78]),
        this.track('rightLeg.rotation[x]', RUN_DURATION, [0, 0.12, 0.24, 0.36, 0.48], [-0.78, 0.78, -0.78, 0.78, -0.78]),
        this.track('leftArm.rotation[x]', RUN_DURATION, [0, 0.12, 0.24, 0.36, 0.48], [-0.66, 0.66, -0.66, 0.66, -0.66]),
        this.track('rightArm.rotation[x]', RUN_DURATION, [0, 0.12, 0.24, 0.36, 0.48], [0.66, -0.66, 0.66, -0.66, 0.66]),
        this.track('torso.rotation[x]', RUN_DURATION, [0, 0.24, 0.48], [-0.06, -0.15, -0.06]),
        this.track('head.rotation[x]', RUN_DURATION, [0, 0.24, 0.48], [0.05, -0.03, 0.05]),
        this.track('hips.position[y]', RUN_DURATION, [0, 0.12, 0.24, 0.36, 0.48], [0.95, 0.9, 0.95, 0.9, 0.95]),
        this.track('skirt.rotation[x]', RUN_DURATION, [0, 0.24, 0.48], [0.06, -0.08, 0.06]),
        this.track('twinTailL.rotation[z]', RUN_DURATION, [0, 0.24, 0.48], [0.16, -0.12, 0.16]),
        this.track('twinTailR.rotation[z]', RUN_DURATION, [0, 0.24, 0.48], [-0.16, 0.12, -0.16])
      ],
      jump: [
        this.track('leftLeg.rotation[x]', JUMP_DURATION, [0, 0.18, 0.5, 0.72], [0.3, -0.62, -0.2, 0.0]),
        this.track('rightLeg.rotation[x]', JUMP_DURATION, [0, 0.18, 0.5, 0.72], [-0.3, -0.52, 0.22, 0.0]),
        this.track('leftArm.rotation[x]', JUMP_DURATION, [0, 0.22, 0.72], [-0.5, -1.25, -0.12]),
        this.track('rightArm.rotation[x]', JUMP_DURATION, [0, 0.22, 0.72], [0.5, -1.05, 0.12]),
        this.track('torso.rotation[x]', JUMP_DURATION, [0, 0.35, 0.72], [-0.08, -0.32, -0.08]),
        this.track('head.rotation[x]', JUMP_DURATION, [0, 0.35, 0.72], [0.08, -0.12, 0.04]),
        this.track('skirt.rotation[x]', JUMP_DURATION, [0, 0.25, 0.72], [0.08, -0.28, 0.04]),
        this.track('twinTailL.rotation[z]', JUMP_DURATION, [0, 0.25, 0.72], [0.1, 0.36, 0.1]),
        this.track('twinTailR.rotation[z]', JUMP_DURATION, [0, 0.25, 0.72], [-0.1, -0.36, -0.1])
      ],
      roll: [
        this.track('hips.rotation[x]', ROLL_DURATION, [0, 0.16, 0.36, 0.52], [0, -1.15, -1.0, 0]),
        this.track('torso.rotation[x]', ROLL_DURATION, [0, 0.18, 0.36, 0.52], [-0.08, -1.0, -0.82, -0.08]),
        this.track('head.rotation[x]', ROLL_DURATION, [0, 0.18, 0.52], [0.08, -0.5, 0.08]),
        this.track('leftArm.rotation[x]', ROLL_DURATION, [0, 0.18, 0.52], [-0.4, 0.2, -0.4]),
        this.track('rightArm.rotation[x]', ROLL_DURATION, [0, 0.18, 0.52], [0.4, -0.2, 0.4]),
        this.track('skirt.rotation[x]', ROLL_DURATION, [0, 0.18, 0.52], [0.06, 0.42, 0.06])
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
    if (this.isJumping || this.isRolling || this.isFlying) return;
    this.isJumping = true;
    this.motionMode = 'jump';
    this.jumpDriver.t = 0;
    this.playAnimation('jump', 0.08);
    this.updateMotionVisuals();

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
        if (this.parts.jumpHalo) {
          this.parts.jumpHalo.scale.setScalar(1 + Math.sin(Math.PI * t) * 0.22);
          this.parts.jumpHalo.material.opacity = 0.25 + Math.sin(Math.PI * t) * 0.4;
        }
      },
      onComplete: () => {
        this.root.position.y = this.groundY;
        this.parts.shadow.scale.setScalar(1);
        this.parts.shadow.material.opacity = 0.25;
        this.isJumping = false;
        this.motionMode = this.isFlying ? 'fly' : 'run';
        this.updateMotionVisuals();
        if (!this.isRolling) this.playAnimation('run', 0.12);
      }
    });
  }

  roll() {
    if (this.isRolling || this.isJumping || this.isFlying) return;
    this.isRolling = true;
    this.motionMode = 'roll';
    this.playAnimation('roll', 0.07);
    this.updateMotionVisuals();

    gsap.killTweensOf(this.root.scale);
    gsap.timeline({
      onComplete: () => {
        this.isRolling = false;
        this.motionMode = this.isFlying ? 'fly' : 'run';
        this.root.scale.set(1, 1, 1);
        this.updateMotionVisuals();
        if (!this.isJumping) this.playAnimation('run', 0.1);
      }
    })
      .to(this.root.scale, { y: 0.58, z: 1.08, duration: 0.12, ease: 'power2.out' })
      .to(this.root.scale, { y: 0.58, z: 1.08, duration: ROLL_DURATION - 0.24, ease: 'none' })
      .to(this.root.scale, { y: 1, z: 1, duration: 0.12, ease: 'power2.out' });
  }

  updateMotionVisuals() {
    if (!this.parts) return;
    if (this.parts.runTrail) this.parts.runTrail.visible = this.motionMode === 'run';
    if (this.parts.jumpHalo) this.parts.jumpHalo.visible = this.motionMode === 'jump';
    if (this.parts.flightPack) this.parts.flightPack.visible = this.isFlying;
  }

  update(deltaSeconds) {
    this.mixer.update(deltaSeconds);
    if (this.parts?.runTrail?.visible) {
      this.parts.runTrail.rotation.z += deltaSeconds * 1.8;
      const pulse = 1 + Math.sin(performance.now() * 0.012) * 0.08;
      this.parts.runTrail.scale.setScalar(pulse);
    }
    if (this.parts?.jumpHalo?.visible) {
      this.parts.jumpHalo.rotation.z += deltaSeconds * 2.4;
    }
    if (this.parts?.flightPack?.visible) {
      this.parts.flightPack.rotation.z = Math.sin(performance.now() * 0.01) * 0.06;
    }
    if (this.powerVisuals?.magnetAura?.visible) {
      this.powerVisuals.magnetAura.rotation.z += deltaSeconds * 4.4;
      const pulse = 1 + Math.sin(performance.now() * 0.008) * 0.08;
      this.powerVisuals.magnetAura.scale.setScalar(pulse);
    }
    if (this.powerVisuals?.shield?.visible) {
      this.powerVisuals.shield.rotation.y += deltaSeconds * 1.8;
      this.powerVisuals.shield.rotation.x += deltaSeconds * 0.9;
    }
    if (this.powerVisuals?.jetpackFlameLeft?.visible) {
      const scale = 0.75 + Math.sin(performance.now() * 0.03) * 0.2;
      this.powerVisuals.jetpackFlameLeft.scale.setScalar(scale);
      this.powerVisuals.jetpackFlameRight.scale.setScalar(1.05 - scale * 0.18);
      this.parts.shadow.scale.setScalar(THREE.MathUtils.lerp(this.parts.shadow.scale.x, 0.46, deltaSeconds * 4));
      this.parts.shadow.material.opacity = THREE.MathUtils.lerp(this.parts.shadow.material.opacity, 0.1, deltaSeconds * 4);
    } else if (!this.isJumping) {
      this.parts.shadow.scale.setScalar(THREE.MathUtils.lerp(this.parts.shadow.scale.x, 1, deltaSeconds * 4));
      this.parts.shadow.material.opacity = THREE.MathUtils.lerp(this.parts.shadow.material.opacity, 0.25, deltaSeconds * 4);
    }
  }

  getOBB() {
    return updateWorldOBB(this.isRolling ? this.playerRollingLocalOBB : this.playerLocalOBB, this.root, this.worldOBB);
  }
}
