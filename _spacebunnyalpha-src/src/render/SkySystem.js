import * as THREE from 'three';
import { RENDER } from '../config.js';
import { clamp01, lerp, smoothstep } from '../util/math.js';

// Sky and lighting, art-directed from Ghibli background painting rather than
// from physical realism.
//
// The three rules that matter, all taken from how haikei is actually painted:
//
//  1. A sky is a vertical gradient with BANDED values, not a smooth ramp, and
//     it is cool at the zenith but warm at the horizon.
//  2. Shadows are tinted, never black. Ghibli has no pure black anywhere, so
//     the fill light is a HemisphereLight whose sky and ground colours differ.
//     That single light does the temperature split that makes a scene read as
//     painted instead of rendered.
//  3. Fog is the horizon colour exactly. Grey fog is the tell of an unstyled
//     3D scene.
//
// One key light (the sun) casts every shadow. A second weak light opposite it
// lifts silhouettes off the background. Both change colour with the hour.

const SKY_STOPS = [
  // t in hours. Each stop is [zenith, horizon, sunLight, ambientSky, ambientGround].
  { t: 0.0, zen: 0x1B3050, hor: 0x2C3558, sun: 0x4A5A80, sky: 0x2C3558, grd: 0x1E2438 },
  { t: 4.5, zen: 0x2C3558, hor: 0x7E8C97, sun: 0xB4A0A8, sky: 0x5A6478, grd: 0x3A3A44 },
  { t: 5.8, zen: 0x3F6FA8, hor: 0xE1B49A, sun: 0xF2C8A0, sky: 0x9DAFC3, grd: 0xAD8152 },
  { t: 7.0, zen: 0x5E96CC, hor: 0xF6E0C4, sun: 0xF7EABD, sky: 0xC3DAEA, grd: 0xC5A387 },
  { t: 12.0, zen: 0x3F7FC0, hor: 0xBFE0F5, sun: 0xF7EABD, sky: 0xB4DCF5, grd: 0xB1D5BB },
  { t: 16.0, zen: 0x4E8CC8, hor: 0xD7D8E8, sun: 0xF7EABD, sky: 0xBFE0F5, grd: 0xA2D1BD },
  { t: 17.8, zen: 0x4A6AA8, hor: 0xE8A040, sun: 0xF0C060, sky: 0xD7CADE, grd: 0xAD8152 },
  { t: 19.2, zen: 0x2E3A72, hor: 0xD05020, sun: 0xE07030, sky: 0x907080, grd: 0x76808A },
  { t: 21.0, zen: 0x1B3050, hor: 0x3E5A80, sun: 0x6A7090, sky: 0x4A5A80, grd: 0x38404E },
  { t: 24.0, zen: 0x1B3050, hor: 0x2C3558, sun: 0x4A5A80, sky: 0x2C3558, grd: 0x1E2438 }
];

// Fog follows the horizon but washes towards a cool blue-grey when it rains.
const FOG_STOPS = [
  { t: 0.0, c: 0x1B3050 },
  { t: 5.5, c: 0x4E6078 },
  { t: 7.0, c: 0xD7D8E8 },
  { t: 12.0, c: 0xBFE0F5 },
  { t: 17.0, c: 0xD7D8E8 },
  { t: 19.0, c: 0xC08A6A },
  { t: 21.0, c: 0x3E5A80 },
  { t: 24.0, c: 0x1B3050 }
];

function lerpColor(a, b, t) {
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  return (
    (Math.round(lerp(ar, br, t)) << 16) |
    (Math.round(lerp(ag, bg, t)) << 8) |
    Math.round(lerp(ab, bb, t))
  );
}

function sampleStops(stops, hour, keys) {
  let lower = stops[0];
  let upper = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i += 1) {
    if (hour >= stops[i].t && hour <= stops[i + 1].t) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }
  const span = upper.t - lower.t || 1;
  const t = clamp01((hour - lower.t) / span);
  const out = {};
  for (const key of keys) out[key] = lerpColor(lower[key], upper[key], t);
  return out;
}

// A banded sky gradient: a few discrete value steps, the way a painted sky is
// built up in washes, rather than one smooth continuous ramp. A soft dither is
// applied so the banding reads as intentional rather than as an artefact.
function makeSkyTexture() {
  const height = 256;
  const width = 4;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  // Deterministic dither offset so the same sky always looks the same.
  const dither = new Float32Array(width * height);
  let seed = 7;
  for (let i = 0; i < dither.length; i += 1) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    dither[i] = (seed / 0x7fffffff - 0.5) * (1 / height) * 1.6;
  }

  return {
    texture,
    repaint(zenithHex, horizonHex) {
      const top = [(zenithHex >> 16) & 255, (zenithHex >> 8) & 255, zenithHex & 255];
      const bottom = [(horizonHex >> 16) & 255, (horizonHex >> 8) & 255, horizonHex & 255];
      const data = image.data;

      for (let y = 0; y < height; y += 1) {
        // y=0 is the bottom of the texture, which is the horizon.
        const t = y / (height - 1);
        // Soften the very bottom into the horizon band.
        const shaped = Math.pow(t, 0.75);

        // Quantise into bands. This is the Ghibli step: five or so values
        // across the whole sky, not a smooth continuum.
        const bands = 5;
        const stepped = Math.round(shaped * bands) / bands;

        const r = lerp(bottom[0], top[0], stepped);
        const g = lerp(bottom[1], top[1], stepped);
        const b = lerp(bottom[2], top[2], stepped);

        for (let x = 0; x < width; x += 1) {
          const i = (y * width + x) * 4;
          const d = dither[y * width + x] * 255;
          data[i] = clamp01((r + d) / 255) * 255;
          data[i + 1] = clamp01((g + d) / 255) * 255;
          data[i + 2] = clamp01((b + d) / 255) * 255;
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(image, 0, 0);
      texture.needsUpdate = true;
    }
  };
}

// Where the key light points at a given hour, and how high the sun is.
//
// After sunset the key light becomes the moon. Without this the direction
// points below the horizon all night, so every upward-facing surface reads as
// back-facing and the town renders as a flat dark slab with a character
// floating in it. The moon keeps the key above the ground, so shapes stay
// modelled at night; its strength and colour come from elsewhere.
//
// Exported because this is pure arithmetic and it was the source of a bug that
// no test could see -- the whole world rendered blank because of one sign.
export function dayCycle(hour) {
  const angle = ((hour - 6) / 12) * Math.PI;
  const elevation = Math.sin(angle);
  const dir = new THREE.Vector3(Math.cos(angle) * 0.5, elevation, 0.35).normalize();

  // The moon takes over once the sun is at or below the horizon. Without a
  // floor, sunrise and sunset sit the key exactly on the horizon, every
  // surface catches it at a grazing angle, and the whole scene flattens out.
  if (elevation <= 0.02) {
    const moonAngle = ((hour - 18 + 12) / 12) * Math.PI;
    const moonElev = Math.max(0.3, Math.sin(moonAngle));
    dir.set(Math.cos(moonAngle) * 0.5, moonElev, 0.35).normalize();
  }

  return { dir, elevation };
}

// The rim peaks at dusk and falls off through the night.
//
// Rim is additive, so a value that looks reasonable on a lit surface will clip
// to pure white on a dim one. At 0.75 every wall in the suburb row blew out to
// a featureless white blob at 21:00, which is worse than having no rim at all.
export function rimFor(daylight) {
  return lerp(0.34, 0.16, daylight);
}

// Normalises a colour to unit brightness by its brightest channel.
//
// Two reasons this exists. A colour that already encodes its own dimness must
// not be multiplied by an intensity as well, or everything is dimmed twice --
// a wall came out at RGB 47 instead of about 135. And HSL lightness is a poor
// brightness measure for a saturated colour: dividing a deep blue by its HSL
// lightness pushed the blue channel to 1.45 and the scene came out lurid.
export function normaliseToUnitBrightness(colour) {
  const peak = Math.max(colour.r, colour.g, colour.b);
  if (peak > 0.001) colour.multiplyScalar(1 / peak);
  return colour;
}

// How bright and how saturated the scene is at a given sun elevation.
//
// Night dims and desaturates together. Dimming alone left the ground fully
// chromatic at midnight, which reads as an overcast afternoon rather than as
// night. The floor keeps night navigable rather than frightening.
export function sceneExposure(elevation, dim = 1) {
  const t = clamp01(elevation * 2.2);
  return {
    lightStrength: lerp(0.62, 1.0, t) * dim,
    saturation: lerp(0.55, 1.0, t) * (dim < 1 ? 0.9 : 1)
  };
}

export class SkySystem {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;

    const gradient = makeSkyTexture();
    this.gradient = gradient;

    const geo = new THREE.SphereGeometry(700, 32, 20);
    const mat = new THREE.MeshBasicMaterial({
      map: gradient.texture,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false
    });
    this.dome = new THREE.Mesh(geo, mat);
    this.dome.renderOrder = -1000;
    this.dome.frustumCulled = false;
    // The dome must ignore fog. Fog is tuned for world geometry (far ~190),
    // and at a radius of 700 the dome would otherwise be fogged to a single
    // flat colour, which is exactly the "no sky" look this is meant to fix.
    this.dome.material.fog = false;
    scene.add(this.dome);

    // Key light. Everything casts from this one direction, which is what makes
    // the world read as designed rather than assembled.
    this.sun = new THREE.DirectionalLight(0xF7EABD, 1.5);
    this.sun.position.set(120, 220, 80);
    scene.add(this.sun);
    scene.add(this.sun.target);

    // The Ghibli fill. A HemisphereLight with a cool sky and a warm ground
    // bounce tints shadows instead of blacking them out, and gives every
    // upward-facing surface a different temperature from every downward one.
    this.ambient = new THREE.HemisphereLight(0xC3DAEA, 0xB1D5BB, 1.05);
    scene.add(this.ambient);

    // Weak opposing light that lifts silhouettes off the background.
    this.rim = new THREE.DirectionalLight(0xC3DAEA, 0.35);
    this.rim.position.set(-110, 70, -90);
    scene.add(this.rim);

    this.fog = new THREE.Fog(0xBFE0F5, RENDER.fogNear, RENDER.fogFar);
    scene.fog = this.fog;

    this.stars = makeStars();
    scene.add(this.stars);

    this.sunDisc = makeGlowDisc(0xF7EABD, 26);
    scene.add(this.sunDisc);
    this.moonDisc = makeGlowDisc(0xD7D8E8, 18);
    scene.add(this.moonDisc);

    this._sunDir = new THREE.Vector3();

    // Published so other systems (the sea, and the anime materials) can stay in
    // step with the sky instead of guessing at the hour.
    this.sunDirection = new THREE.Vector3(0, 1, 0);
    this.horizonColor = 0xBFE6F5;
    // A unit-brightness version of the sky colour, for use as a TINT on
    // shadows. The raw horizon colour is a dark blue at night, and using it
    // directly as a multiplier is what turned the island into a horror palette.
    this.ambientTint = new THREE.Color(0xBFE6F5);
    this.sunLightColor = new THREE.Color(0xFFF6E5);
    // How bright the key light is overall. The anime shader has no notion of
    // intensity on its own, so this is what stops the ground staying fully lit
    // under a night sky.
    this.lightStrength = 1;
    // Rim strength rises at night and drops in flat daylight, where a strong rim
    // would just wash the surfaces out.
    this.rimStrength = 0.55;
  }

  update(clock, camera, weather = 'clear') {
    const hour = clock.hour;
    const s = sampleStops(SKY_STOPS, hour, ['zen', 'hor', 'sun', 'sky', 'grd']);

    this.gradient.repaint(s.zen, s.hor);
    this.horizonColor = s.hor;

    // Fog takes the horizon colour, exactly. Rain and overcast wash it towards
    // a cool blue-grey: Ghibli rain is green-blue, never neutral grey.
    const fogHex = sampleStops(FOG_STOPS, hour, ['c']).c;
    const washed = weather === 'rain' || weather === 'overcast' || weather === 'storm';
    this.fog.color.setHex(washed ? 0x9FB0BC : fogHex);
    // The distance has to stay generous even in rain. Pulling fog in tight
    // hides the whole world behind a flat grey wall, which reads as a bug
    // rather than as weather.
    this.fog.near = RENDER.fogNear * (weather === 'rain' ? 0.85 : washed ? 0.9 : 1);
    this.fog.far = RENDER.fogFar * (weather === 'rain' ? 0.8 : washed ? 0.85 : 1);

    const { dir: sunDir, elevation } = dayCycle(hour);
    const daylight = clamp01((elevation + 0.15) / 0.5);
    const dim = weather === 'rain' || weather === 'storm' ? 0.5 : weather === 'overcast' ? 0.65 : 1;

    this.sunDirection.copy(sunDir);

    this.sun.position.copy(sunDir).multiplyScalar(300);
    this.sun.target.position.set(0, 0, 0);
    this.sun.color.setHex(s.sun);
    // The anime materials light themselves from these values rather than from
    // the Three.js lights, so keep both describing the same light.
    //
    // The colour is normalised to unit brightness before it is handed over.
    // Multiplying the already-dim night colour by lightStrength as well dimmed
    // everything twice: a wall came out at RGB 47 instead of about 135, which
    // is why midnight rendered as an almost black slab.
    this.sunLightColor.setHex(s.sun);
    normaliseToUnitBrightness(this.sunLightColor);

    const { lightStrength, saturation } = sceneExposure(elevation, dim);
    this.lightStrength = lightStrength;
    this.saturation = saturation;
    // At night the key light is nearly gone and the fill carries the scene.
    this.sun.intensity = Math.max(0, elevation) * 1.55 * dim;

    // Fill stays comparatively high, and rises as the key falls. That ratio is
    // what stops night from being a black screen.
    this.ambient.color.setHex(s.sky);
    this.ambient.groundColor.setHex(s.grd);
    this.ambient.intensity = lerp(0.75, 1.05, daylight) * dim;

    // The tint the anime shader mixes into shadows. Normalised to unit
    // brightness so its darkness cannot become a multiplier.
    this.ambientTint.setHex(s.sky);
    normaliseToUnitBrightness(this.ambientTint);

    this.rim.color.setHex(s.sky);
    this.rim.intensity = lerp(0.18, 0.4, daylight) * dim;
    // Rim is strongest when the key light is weak, which is exactly when a
    // silhouette needs lifting off the background.
    this.rimStrength = rimFor(daylight) * dim;

    if (camera) {
      this.dome.position.copy(camera.position);
      this.stars.position.copy(camera.position);
      this.sunDisc.position.copy(camera.position).add(sunDir.clone().multiplyScalar(420));
      this.moonDisc.position.copy(camera.position).add(sunDir.clone().multiplyScalar(-420));
    }

    this.sunDisc.material.opacity = clamp01(elevation * 1.6) * 0.75 * dim;
    this.moonDisc.material.opacity = clamp01(-elevation * 1.6) * 0.7;
    this.stars.material.opacity = clamp01(-elevation * 1.4) * 0.9 * (weather === 'clear' ? 1 : 0.15);
  }

  dispose() {
    this.scene.remove(this.dome, this.sun, this.sun.target, this.ambient, this.rim, this.stars, this.sunDisc, this.moonDisc);
    this.dome.geometry.dispose();
    this.dome.material.map?.dispose();
    this.dome.material.dispose();
    this.stars.geometry.dispose();
    this.stars.material.dispose();
    this.sunDisc.geometry.dispose();
    this.sunDisc.material.dispose();
    this.moonDisc.geometry.dispose();
    this.moonDisc.material.dispose();
  }
}

function makeStars() {
  const count = 700;
  const positions = new Float32Array(count * 3);
  let seed = 99;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 0; i < count; i += 1) {
    const theta = rnd() * Math.PI * 2;
    const phi = Math.acos(rnd() * 1.4 - 0.4);
    const r = 560;
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    positions[i * 3 + 1] = Math.cos(phi) * r;
    positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xF7EABD,
    size: 1.8,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    fog: false
  });
  const points = new THREE.Points(geo, mat);
  points.renderOrder = -999;
  points.frustumCulled = false;
  return points;
}

function makeGlowDisc(color, size) {
  const geo = new THREE.CircleGeometry(size, 28);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    fog: false,
    blending: THREE.AdditiveBlending
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = -998;
  mesh.frustumCulled = false;
  return mesh;
}