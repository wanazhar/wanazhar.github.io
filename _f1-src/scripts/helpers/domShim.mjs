/**
 * Minimal canvas shim for headless node.
 *
 * `buildTrackMesh` and `buildCarMesh` draw their textures at construction time,
 * which is right for the browser and fatal under node. The benches and the
 * regression tests both need the real render modules, so they install this first.
 *
 * Only the drawing surface is stubbed. Geometry and transforms are untouched, and
 * that is the point: the benches exist to measure the real builder, and
 * re-implementing it would test a copy. That is precisely how the 90-degree mesh
 * orientation bug survived -- every number was self-consistent and only the thing
 * being looked at was wrong.
 */

/** Install the shim. Call before importing anything that touches `document`. */
export function installCanvasShim() {
  const noop = () => {};
  const state = {
    createImageData: (width, height) => ({ data: new Uint8ClampedArray(width * height * 4) }),
    createLinearGradient: () => ({ addColorStop: noop }),
    createRadialGradient: () => ({ addColorStop: noop })
  };
  // A Proxy rather than a fixed object: the texture code sets properties like
  // `fillStyle` and calls `beginPath`, `moveTo`, `stroke` and others. Enumerating
  // them here would mean editing this file every time a texture changes.
  const context = new Proxy(state, {
    get(target, property) {
      if (property in target) return target[property];
      return noop;
    },
    set(target, property, value) {
      target[property] = value;
      return true;
    }
  });

  globalThis.document = {
    createElement: () => ({ width: 0, height: 0, getContext: () => context })
  };
}