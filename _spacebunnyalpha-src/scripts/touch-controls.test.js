import test from 'node:test';
import assert from 'node:assert/strict';
import { PlayerController } from '../src/characters/PlayerController.js';
import { TouchControls } from '../src/ui/TouchControls.js';

// The touch path specifically. TouchControls computes
//
//   setStick(nx / radius, -ny / radius)
//
// and InputController reads forward as -stick.y, which means a push upwards
// (ny negative) must produce forward movement. This is the exact chain that
// produced "joystick goes up, character walks backward".
//
// The DOM is stubbed just enough for TouchControls to construct; the geometry
// maths under test is pure and does not depend on a real layout.

// Minimal stand-ins for the handful of DOM APIs TouchControls touches.
class FakeElement {
  constructor() {
    this.style = {};
    this.className = "";
    this.children = [];
    this.listeners = {};
    this.attributes = {};
    this.classList = { add() {}, remove() {}, toggle() {} };
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  getAttribute(name) {
    return this.attributes[name];
  }
  addEventListener(type, fn) {
    this.listeners[type] = fn;
  }
  dispatch(type, event) {
    if (this.listeners[type]) this.listeners[type](event);
  }
  appendChild(child) {
    this.children.push(child);
    return child;
  }
  // TouchControls uses ParentNode.append, not appendChild.
  append(...kids) {
    this.children.push(...kids);
  }
  replaceChildren(...kids) {
    this.children = kids;
  }
  getBoundingClientRect() {
    // The stick is 128px, so its centre is 64 from the left/top edge.
    return { left: 0, top: 0, width: 128, height: 128 };
  }
}

function makeTouchControls(captured) {
  global.document = { createElement: () => new FakeElement() };
  const input = {
    setStick(x, y, active) {
      captured.x = x;
      captured.y = y;
      captured.active = active;
    }
  };
  const root = new FakeElement();
  const controls = new TouchControls(root, input, { onInteract() {} });
  return { controls, root };
}

// Simulates a touch at a point on the stick, in stick-local coordinates.
// The identifier must match, because TouchControls looks the active touch up by
// identifier inside move() and silently returns when it cannot find it.
function dragStick(controls, nx, ny) {
  const point = { identifier: 7, clientX: 64 + nx, clientY: 64 + ny };
  const start = { changedTouches: [point], touches: [point], preventDefault() {} };
  controls.stick.dispatch("touchstart", start);
  controls.stick.dispatch("touchmove", start);
  return point;
}

function endStick(controls) {
  controls.stick.dispatch("touchend", { touches: [] });
}

test('pushing the stick up produces positive forward input', () => {
  const captured = {};
  const { controls } = makeTouchControls(captured);

  dragStick(controls, 0, -52);

  assert.strictEqual(captured.active, true, 'the stick must be active while touched');
  assert.ok(captured.y < -0.9, `stick up should give y near -1, got ${captured.y}`);
  assert.ok(Math.abs(captured.x) < 0.01, 'stick up must not add sideways');
});

test('pushing the stick down produces negative forward input', () => {
  const captured = {};
  const { controls } = makeTouchControls(captured);

  dragStick(controls, 0, 52);

  assert.ok(captured.y > 0.9, `stick down should give y near +1, got ${captured.y}`);
});

test('pushing the stick right produces positive sideways input', () => {
  const captured = {};
  const { controls } = makeTouchControls(captured);

  dragStick(controls, 52, 0);

  assert.ok(captured.x > 0.9, `stick right should give x near +1, got ${captured.x}`);
  assert.ok(Math.abs(captured.y) < 0.01, 'stick right must not add forward');
});

test('releasing the stick recentres it', () => {
  const captured = {};
  const { controls } = makeTouchControls(captured);

  dragStick(controls, 30, -30);
  endStick(controls);

  assert.strictEqual(captured.active, false);
  assert.strictEqual(captured.x, 0);
  assert.strictEqual(captured.y, 0);
});

test('the stick is clamped to its radius', () => {
  const captured = {};
  const { controls } = makeTouchControls(captured);

  // Drag far past the edge; the reported input must not exceed 1.
  dragStick(controls, 400, -400);

  assert.ok(captured.x <= 1.0001, `stick x must clamp to 1, got ${captured.x}`);
  assert.ok(captured.y >= -1.0001, `stick y must clamp to -1, got ${captured.y}`);
});

test('joystick up moves the character forward, not backward', () => {
  const captured = {};
  const { controls } = makeTouchControls(captured);

  // Simulate the push, then feed exactly what the UI produced into a real
  // controller, standing in for InputController's axis mapping.
  dragStick(controls, 0, -52);
  assert.ok(captured.y < -0.9, 'precondition: stick up reports a negative y');

  // InputController.moveAxis: forward += -stick.y, and the magnitude is the
  // normalised stick length.
  const axis = {
    x: captured.x,
    z: -captured.y,
    magnitude: Math.hypot(captured.x, captured.y)
  };
  assert.ok(axis.z > 0.9, 'precondition: the axis reads as forward');

  const input = {
    moveAxis: () => axis,
    runRequested: false,
    jumpRequested: false,
    interactRequested: false
  };

  for (const camYaw of [0, Math.PI, 1.9]) {
    const player = new PlayerController({
      scene: null,
      camera: {},
      input,
      groundHeightAt: () => 9,
      isBlocked: () => false
    });
    Object.defineProperty(player, 'cameraYaw', { value: camYaw, writable: true });
    player.spawn({ x: 160, y: 9, z: 140 });

    for (let i = 0; i < 40; i += 1) player.update(1 / 60);

    const lookX = -Math.sin(camYaw);
    const lookZ = -Math.cos(camYaw);
    const dx = player.position.x - 160;
    const dz = player.position.z - 140;
    const alongLook = dx * lookX + dz * lookZ;

    assert.ok(
      alongLook > 1,
      `joystick up at camYaw ${camYaw.toFixed(2)} travelled ${alongLook.toFixed(2)} along the view; it must be forward`
    );
  }
});