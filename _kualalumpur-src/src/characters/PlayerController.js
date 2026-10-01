import * as THREE from 'three';

function cube(geometry, material, position, scale) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  mesh.scale.copy(scale);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  return mesh;
}

function createPlayerLocator() {
  const locator = new THREE.Group();
  locator.name = 'explorer-character-locator';

  const material = new THREE.MeshBasicMaterial({
    color: 0xffd166,
    transparent: true,
    opacity: 0.86,
    depthTest: false,
    depthWrite: false,
    fog: false
  });

  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.055, 6, 28), material);
  halo.rotation.x = Math.PI / 2;
  halo.position.y = 3.65;
  halo.renderOrder = 999;

  const pointer = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.86, 4), material);
  pointer.position.y = 4.55;
  pointer.rotation.y = Math.PI / 4;
  pointer.renderOrder = 1000;

  locator.add(halo, pointer);
  return locator;
}

function createVoxelCharacter() {
  const group = new THREE.Group();
  group.name = 'explorer-character';

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const materials = {
    skin: new THREE.MeshLambertMaterial({ color: 0xdba36b }),
    hair: new THREE.MeshLambertMaterial({ color: 0x222029 }),
    shirt: new THREE.MeshLambertMaterial({ color: 0x2c7be5 }),
    pants: new THREE.MeshLambertMaterial({ color: 0x1f2937 }),
    shoes: new THREE.MeshLambertMaterial({ color: 0x111827 }),
    bag: new THREE.MeshLambertMaterial({ color: 0xf59e0b })
  };

  const torso = cube(geometry, materials.shirt, new THREE.Vector3(0, 1.65, 0), new THREE.Vector3(0.82, 1.15, 0.46));
  const head = cube(geometry, materials.skin, new THREE.Vector3(0, 2.55, 0), new THREE.Vector3(0.62, 0.62, 0.62));
  const hair = cube(geometry, materials.hair, new THREE.Vector3(0, 2.92, -0.03), new THREE.Vector3(0.67, 0.18, 0.68));
  const bag = cube(geometry, materials.bag, new THREE.Vector3(0, 1.65, 0.34), new THREE.Vector3(0.72, 0.86, 0.22));

  const leftArm = new THREE.Group();
  leftArm.position.set(-0.62, 2.0, 0);
  leftArm.add(cube(geometry, materials.skin, new THREE.Vector3(0, -0.42, 0), new THREE.Vector3(0.28, 0.85, 0.28)));

  const rightArm = new THREE.Group();
  rightArm.position.set(0.62, 2.0, 0);
  rightArm.add(cube(geometry, materials.skin, new THREE.Vector3(0, -0.42, 0), new THREE.Vector3(0.28, 0.85, 0.28)));

  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.24, 1.08, 0);
  leftLeg.add(cube(geometry, materials.pants, new THREE.Vector3(0, -0.42, 0), new THREE.Vector3(0.3, 0.86, 0.32)));
  leftLeg.add(cube(geometry, materials.shoes, new THREE.Vector3(0, -0.9, -0.08), new THREE.Vector3(0.34, 0.18, 0.48)));

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.24, 1.08, 0);
  rightLeg.add(cube(geometry, materials.pants, new THREE.Vector3(0, -0.42, 0), new THREE.Vector3(0.3, 0.86, 0.32)));
  rightLeg.add(cube(geometry, materials.shoes, new THREE.Vector3(0, -0.9, -0.08), new THREE.Vector3(0.34, 0.18, 0.48)));

  group.add(torso, head, hair, bag, leftArm, rightArm, leftLeg, rightLeg, createPlayerLocator());
  group.userData.parts = { leftArm, rightArm, leftLeg, rightLeg };
  return group;
}

export class PlayerController {
  constructor(scene, terrain, startPosition, collision = null) {
    this.terrain = terrain;
    this.collision = collision;
    this.group = createVoxelCharacter();
    this.group.position.copy(startPosition);
    this.velocity = new THREE.Vector3();
    this.moveSpeed = 0;
    this.heading = 0;
    this.walkTime = 0;
    this.onGround = true;
    this.keys = new Set();
    this.virtualKeys = new Set();
    this.virtualAxis = new THREE.Vector2(0, 0);
    this.enabled = true;

    scene.add(this.group);

    window.addEventListener('keydown', (event) => this.handleKey(event, true));
    window.addEventListener('keyup', (event) => this.handleKey(event, false));
  }

  handleKey(event, down) {
    const key = event.key.toLowerCase();
    const mapped = {
      w: 'forward',
      arrowup: 'forward',
      s: 'back',
      arrowdown: 'back',
      a: 'left',
      arrowleft: 'left',
      d: 'right',
      arrowright: 'right',
      shift: 'sprint',
      ' ': 'jump'
    }[key];

    if (!mapped) return;
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) event.preventDefault();
    if (down) this.keys.add(mapped);
    else this.keys.delete(mapped);
  }

  setVirtualKey(name, down) {
    if (down) this.virtualKeys.add(name);
    else this.virtualKeys.delete(name);
  }

  setVirtualAxis(x = 0, y = 0) {
    this.virtualAxis.set(THREE.MathUtils.clamp(x, -1, 1), THREE.MathUtils.clamp(y, -1, 1));
  }

  hasInput(name) {
    return this.keys.has(name) || this.virtualKeys.has(name);
  }

  isSpaceFree(x, z, radius = 0.42) {
    if (!this.collision) return true;
    return (
      !this.collision.isBlocked(x - radius, z - radius) &&
      !this.collision.isBlocked(x + radius, z - radius) &&
      !this.collision.isBlocked(x - radius, z + radius) &&
      !this.collision.isBlocked(x + radius, z + radius)
    );
  }

  findFreeSpot(position) {
    if (this.isSpaceFree(position.x, position.z)) return position;
    for (let radius = 1; radius <= 16; radius += 1) {
      for (let step = 0; step < 16; step += 1) {
        const angle = (step / 16) * Math.PI * 2;
        const x = position.x + Math.cos(angle) * radius;
        const z = position.z + Math.sin(angle) * radius;
        if (this.isSpaceFree(x, z)) return { x, z };
      }
    }
    return position;
  }

  warpTo(position) {
    const target = this.findFreeSpot({ x: position.x, z: position.z });
    const ground = this.terrain.surfaceYAt(target.x, target.z);
    this.group.position.set(target.x, ground + 0.05, target.z);
    this.velocity.set(0, 0, 0);
    this.onGround = true;
  }

  getFocusTarget() {
    return this.group.position.clone().add(new THREE.Vector3(0, 4.25, 0));
  }

  update(deltaSeconds, camera) {
    if (!this.enabled) return false;

    const keyboardForward = Number(this.hasInput('forward')) - Number(this.hasInput('back'));
    const keyboardStrafe = Number(this.hasInput('right')) - Number(this.hasInput('left'));
    const forwardInput = THREE.MathUtils.clamp(keyboardForward + this.virtualAxis.y, -1, 1);
    const strafeInput = THREE.MathUtils.clamp(keyboardStrafe + this.virtualAxis.x, -1, 1);
    const inputStrength = THREE.MathUtils.clamp(Math.hypot(forwardInput, strafeInput), 0, 1);
    const wantsMove = inputStrength > 0.03;

    const cameraForward = new THREE.Vector3();
    camera.getWorldDirection(cameraForward);
    cameraForward.y = 0;
    cameraForward.normalize();
    // right = normalize(cross(forward, up)); the previous (z, 0, -x) form pointed left,
    // which inverted both the thumb-stick and the A/D keys.
    const cameraRight = new THREE.Vector3(-cameraForward.z, 0, cameraForward.x).normalize();

    const move = new THREE.Vector3();
    move.addScaledVector(cameraForward, forwardInput);
    move.addScaledVector(cameraRight, strafeInput);
    if (move.lengthSq() > 0) move.normalize();

    const sprint = this.hasInput('sprint') ? 2.05 : 1;
    const targetSpeed = 16 * sprint * (wantsMove ? inputStrength : 0);
    this.moveSpeed = THREE.MathUtils.damp(this.moveSpeed, targetSpeed, wantsMove ? 14 : 20, deltaSeconds);
    const speed = this.moveSpeed;
    const previous = this.group.position.clone();
    const nextX = this.group.position.x + move.x * speed * deltaSeconds;
    const nextZ = this.group.position.z + move.z * speed * deltaSeconds;
    if (this.isSpaceFree(nextX, nextZ)) {
      this.group.position.x = nextX;
      this.group.position.z = nextZ;
    } else if (this.isSpaceFree(nextX, this.group.position.z)) {
      this.group.position.x = nextX;
    } else if (this.isSpaceFree(this.group.position.x, nextZ)) {
      this.group.position.z = nextZ;
    }
    this.terrain.clampXZ(this.group.position);

    if (wantsMove) {
      const targetHeading = Math.atan2(move.x, move.z);
      const delta = ((targetHeading - this.heading + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      this.heading += delta * (1 - Math.exp(-14 * deltaSeconds));
      this.group.rotation.y = this.heading;
      this.walkTime += deltaSeconds * speed * 0.9;
    }

    const groundY = this.terrain.surfaceYAt(this.group.position.x, this.group.position.z) + 0.05;
    if (this.onGround && this.hasInput('jump')) {
      this.velocity.y = 10.5;
      this.onGround = false;
    }

    this.velocity.y -= 28 * deltaSeconds;
    this.group.position.y += this.velocity.y * deltaSeconds;

    if (this.group.position.y <= groundY) {
      this.group.position.y = groundY;
      this.velocity.y = 0;
      this.onGround = true;
    }

    const parts = this.group.userData.parts;
    const swing = wantsMove ? Math.sin(this.walkTime) * 0.62 : 0;
    parts.leftLeg.rotation.x = swing;
    parts.rightLeg.rotation.x = -swing;
    parts.leftArm.rotation.x = -swing * 0.85;
    parts.rightArm.rotation.x = swing * 0.85;

    if (!wantsMove) this.walkTime += deltaSeconds * 1.3;

    return previous.distanceToSquared(this.group.position) > 0.000001 || wantsMove || !this.onGround;
  }
}
