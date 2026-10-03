// Runtime smoke test: loads the real built bundle in a jsdom document with a
// stubbed WebGL context, and fails on any uncaught error. This catches the
// class of bug a compile-only check misses: modules that touch the DOM or the
// renderer at import time.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { JSDOM } from 'jsdom';

// This file lives in _spacebunnyalpha-src/scripts, so the build output is two
// levels up: the sibling spacebunnyalpha/ directory.
const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(PROJECT_ROOT, '..', 'spacebunnyalpha');

function findBundle() {
  const assets = join(OUT_DIR, 'assets');
  if (!existsSync(assets)) return null;
  const file = readdirSync(assets).find((f) => f.endsWith('.js'));
  return file ? join(assets, file) : null;
}

// A WebGL context that satisfies the calls three.js makes during setup.
// Every method is a no-op returning plausible values.
function stubGL() {
  const noop = () => {};

  const gl = {
    // Three.js reads its enums straight off the context object (gl.VERSION),
    // not from a bundled constant table, so the stub has to carry them.
    VERSION: 0x1f02,
    VENDOR: 0x1f00,
    RENDERER: 0x1f01,
    SHADING_LANGUAGE_VERSION: 0x8b8c,
    MAX_COMBINED_TEXTURE_IMAGE_UNITS: 0x8b4d,
    SCISSOR_BOX: 0x0c10,
    VIEWPORT: 0x0ba2,

    canvas: { width: 1280, height: 720, style: {}, addEventListener: noop, getContext: () => null },
    getExtension: () => null,
    getSupportedExtensions: () => [],
    getParameter: (name) => {
      // A handful of pnames must answer with strings or arrays; everything
      // else is a number and 0 is a safe stand-in.
      if (name === 0x1f02) return 'WebGL 2.0';
      if (name === 0x8b8c) return 'WebGL GLSL ES 3.00';
      if (name === 0x0c10) return [0, 0, 1280, 720];
      if (name === 0x0ba2) return [0, 0, 1280, 720];
      if (name === 0x8b4d) return 16;
      if (process.env.SBA_DEBUG_GL) console.log('[gl] getParameter', name);
      return 0;
    },
    getShaderPrecisionFormat: () => ({ precision: 0, rangeMin: 0, rangeMax: 0 }),
    getContextAttributes: () => ({}),
    createBuffer: () => ({}),
    createFramebuffer: () => ({}),
    createProgram: () => ({}),
    createRenderbuffer: () => ({}),
    createShader: () => ({}),
    createTexture: () => ({}),
    createVertexArray: () => ({}),
    checkFramebufferStatus: () => 36053,
    createTexture2D: noop,
    bindTexture: noop,
    activeTexture: noop,
    texParameteri: noop,
    texImage2D: noop,
    texImage3D: noop,
    texSubImage2D: noop,
    texSubImage3D: noop,
    compressedTexImage2D: noop,
    compressedTexImage3D: noop,
    compressedTexSubImage2D: noop,
    copyTexImage2D: noop,
    copyTexSubImage2D: noop,
    copyTexSubImage3D: noop,
    texStorage2D: noop,
    texStorage3D: noop,
    generateMipmap: noop,
    useProgram: noop,
    attachShader: noop,
    linkProgram: noop,
    getProgramParameter: () => true,
    getProgramInfoLog: () => '',
    getShaderParameter: () => true,
    getShaderInfoLog: () => '',
    getAttribLocation: () => 0,
    getUniformLocation: () => ({}),
    uniform1f: noop,
    uniform1i: noop,
    uniform2f: noop,
    uniform3f: noop,
    uniform4f: noop,
    uniformMatrix3fv: noop,
    uniformMatrix4fv: noop,
    bindBuffer: noop,
    bufferData: noop,
    bindFramebuffer: noop,
    framebufferTexture2D: noop,
    renderbufferStorage: noop,
    bindVertexArray: noop,
    enableVertexAttribArray: noop,
    vertexAttribPointer: noop,
    enable: noop,
    disable: noop,
    blendFunc: noop,
    blendFuncSeparate: noop,
    clearColor: noop,
    clearDepth: noop,
    clear: noop,
    colorMask: noop,
    depthMask: noop,
    depthFunc: noop,
    stencilFunc: noop,
    stencilMask: noop,
    stencilOp: noop,
    viewport: noop,
    scissor: noop,
    drawElements: noop,
    drawArrays: noop,
    drawElementsInstanced: noop,
    flush: noop,
    finish: noop,
    pixelStorei: noop,
    isContextLost: () => false
  };

  // Three.js probes far more of the WebGL surface than is worth enumerating.
  // A catch-all keeps an unstubbed entry point from throwing: any lowercase
  // property that is not already defined is assumed to be a callable method.
  // Explicit members above always win, since they shadow the proxy fallback.
  return new Proxy(gl, {
    get(target, prop, receiver) {
      if (prop in target) return Reflect.get(target, prop, receiver);
      if (typeof prop === 'string' && /^[a-z]/.test(prop)) return noop;
      return undefined;
    }
  });
}

test('the project builds to an output directory with a bundle', () => {
  const bundle = findBundle();
  assert.ok(bundle, 'run "npm run build" first: no bundle found in spacebunnyalpha/assets');
  assert.ok(readFileSync(bundle, 'utf8').length > 1000, 'bundle looks empty');
});

test('the built bundle runs without throwing at startup', async (t) => {
  const bundle = findBundle();
  if (!bundle) {
    t.skip('no bundle built');
    return;
  }
  const code = readFileSync(bundle, 'utf8');

  const errors = [];
  const dom = new JSDOM(
    `<!DOCTYPE html><html><head></head><body><div id="app"><div class="loading" id="loading"><div id="loading-fill"></div></div></div></body></html>`,
    { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'outside-only' }
  );

  const { window } = dom;
  const noop = () => {};

  // Canvas + WebGL stubs.
  window.HTMLCanvasElement.prototype.getContext = function getContext(kind) {
    if (kind === '2d') {
      return {
        createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h }),
        putImageData: noop,
        fillRect: noop,
        createRadialGradient: () => ({ addColorStop: noop }),
        createLinearGradient: () => ({ addColorStop: noop }),
        canvas: this
      };
    }
    return stubGL();
  };
  window.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,';

  // requestAnimationFrame is driven manually so we can step a few frames.
  let frameCallback = null;
  window.requestAnimationFrame = (cb) => {
    frameCallback = cb;
    return 1;
  };
  window.cancelAnimationFrame = () => {};

  // jsdom supplies window.performance already; only the raf loop needs driving.

  window.addEventListener('error', (e) => errors.push(e.error ?? new Error(e.message)));
  window.addEventListener('unhandledrejection', (e) => errors.push(e.reason));

  // Run the bundle with the jsdom window as its global.
  const originalConsoleError = console.error;
  const consoleErrors = [];
  console.error = (...args) => {
    consoleErrors.push(args.map(String).join(' '));
    originalConsoleError(...args);
  };

  try {
    dom.window.eval(code);
  } catch (error) {
    console.error = originalConsoleError;
    assert.fail(`bundle threw during startup: ${error.stack ?? error.message}`);
  }

  // The title card and loading screen should both be in the document.
  const html = dom.serialize();
  assert.ok(html.includes('title-start'), 'the title card should be rendered');
  assert.ok(html.includes('スペースバニー'), 'the Japanese title should be rendered');

  // The build overlay must retire on its own once the island exists. It used to
  // stay up at a higher z-index than the title card, which covered the start
  // button and left the player stuck staring at "building the island".
  const loadingNode = window.document.querySelector('.loading');
  assert.ok(loadingNode, 'the loading overlay should exist during boot');
  assert.ok(
    loadingNode.classList.contains('is-done'),
    'the loading overlay should be dismissed automatically, not only on click'
  );

  // Step a few frames, which exercises the game loop, streamer and HUD.
  for (let i = 0; i < 5; i += 1) {
    const cb = frameCallback;
    frameCallback = null;
    if (typeof cb === 'function') cb(performance.now() + i * 16);
  }

  console.error = originalConsoleError;

  // Clicking "walk outside" must dismiss the title card and start the loop.
  const startButton = window.document.querySelector('.title-start');
  assert.ok(startButton, 'the title card should offer a start button');
  startButton.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.strictEqual(
    window.document.querySelector('.title-start'),
    null,
    'starting the game should remove the title card'
  );

  if (errors.length) {
    assert.fail(`uncaught error at runtime: ${errors.map((e) => e.stack ?? String(e)).join('\n')}`);
  }

  const realErrors = consoleErrors.filter((line) => !line.includes('[bus]'));
  if (realErrors.length) {
    assert.fail(`console errors during startup:\n${realErrors.join('\n')}`);
  }

  dom.window.close();
});