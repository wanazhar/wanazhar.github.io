import * as THREE from 'three';

// Anime-style shading.
//
// The default approach in a lit 3D scene is to darken the base colour by
// multiplying its value. That is exactly wrong for this art direction.
// Measured across Rimsoft's official artwork, the lit and shadowed bands of the
// same surface behave like this:
//
//   lit     #E2F2F4   H187  S0.07  V0.96
//   shadow  #C8E6F1   H196  S0.17  V0.95   <- +9 degrees hue, 2.3x saturation
//
// Shadows are MORE saturated than the lit surface, not less, and value barely
// moves. Multiplying value would give #C0CECF: dead grey-green, which is why
// value-darkened scenes always look washed out.
//
// So shadows here are: rotate hue toward blue by ~8 degrees, multiply
// saturation by ~2.1, and scale value by ~0.94. The result keeps colour
// identity in shadow instead of draining it.
//
// On top of that sit two cheap tricks that do an unusual amount of work:
//
//  * a cool rim (fresnel) term, which is what makes a rounded form read as
//    rounded rather than flat-shaded
//  * a warm bleed just inside the lit side of the terminator and a cooler one
//    just inside the shadow side -- the "artificial subsurface" effect that
//    separates painted shading from computed shading

const UNIFORMS = {
  // The base colour has to be a uniform, not Three's `diffuseColor`.
  // That variable only exists if the shader includes Three's own
  // <color_fragment> chunk; a bare ShaderMaterial does not define it, so
  // reading it silently produced garbage and every surface rendered as fog.
  uBaseColor: { value: new THREE.Color(0xffffff) },
  uLightDir: { value: new THREE.Vector3(0.4, 0.8, 0.35) },
  uLightColor: { value: new THREE.Color(0xfff6e5) },
  uAmbient: { value: new THREE.Color(0xbfe6f5) },
  uShadowHueShift: { value: 8.0 / 360.0 },
  uShadowSaturation: { value: 2.1 },
  uShadowValue: { value: 0.94 },
  // How strongly the ambient colour tints a shadow, and the floor below which
  // that tint is never allowed to darken anything.
  //
  // This exists because multiplying by the raw night ambient turned the whole
  // island into a horror film: grass at L=0.14 with a cold cast. A tint of 0.35
  // with a floor of 0.62 keeps the blue cast without ever losing the value
  // that makes a surface readable.
  uTintAmount: { value: 0.35 },
  uShadowFloor: { value: 0.62 },
  // Overall brightness of the key light, driven by the sun's elevation. The
  // shader had no intensity term at all, so the ground stayed fully lit at
  // midnight while the sky went black: daylight under a night sky.
  uLightStrength: { value: 1.0 },
  // Saturation retained in the final image. Falls off at night.
  uSaturation: { value: 1.0 },
  uDebug: { value: 0.0 },
  uRimColor: { value: new THREE.Color(0xffffff) },
  // A lower exponent gives a wider rim. Wide and soft suits this art
  // direction: a hard thin rim reads as a cel outline, which is the opposite
  // of the painted look being aimed for.
  uRimPower: { value: 1.6 },
  uRimStrength: { value: 0.55 },
  uTerminatorWidth: { value: 0.12 },
  uBleedWarm: { value: 0.22 },
  uBleedCool: { value: 0.16 },
  // Ambient occlusion strength. Corner darkening grounds objects against the
  // ground they stand on, which is what stops a low-poly form reading as
  // pasted on.
  uAoStrength: { value: 0.35 },
  // Height of the ground the scene is standing on, used for contact darkening.
  uGroundY: { value: 0.0 },
  uOpacity: { value: 1.0 }
};

const VERTEX = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewDirW;
  varying vec3 vColor;
  varying float vWorldY;

  #include <common>

  #ifdef USE_INSTANCING_COLOR
    attribute vec3 instanceColor;
  #endif

  void main() {
    vec3 transformed = position;
    vec3 objectNormal = normal;

    #ifdef USE_INSTANCING
      mat4 im = instanceMatrix;
      objectNormal = mat3(im) * objectNormal;
      transformed = (im * vec4(transformed, 1.0)).xyz;
    #endif

    #ifdef USE_INSTANCING_COLOR
      vColor = instanceColor;
    #else
      vColor = vec3(1.0);
    #endif

    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * objectNormal);
    vViewDirW = normalize(cameraPosition - worldPosition.xyz);
    vWorldY = worldPosition.y;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewDirW;
  varying vec3 vColor;
  varying float vWorldY;

  uniform vec3 uBaseColor;
  uniform vec3 uLightDir;
  uniform vec3 uLightColor;
  uniform vec3 uAmbient;
  uniform float uShadowHueShift;
  uniform float uShadowSaturation;
  uniform float uShadowValue;
  uniform float uTintAmount;
  uniform float uShadowFloor;
  uniform float uLightStrength;
  // Debug channel: 0 off, 1 base colour, 2 lit term, 3 shadow term, 4 terminator
  // t, 5 contact darkening. Set from the console to see which term is eating a
  // surface.
  uniform float uDebug;
  // How much saturation survives in the final image. Night desaturates: a
  // fully chromatic scene at midnight reads as an overcast afternoon, because
  // toShadow() deliberately doubles saturation and nothing was taking it back
  // down again.
  uniform float uSaturation;
  uniform vec3 uRimColor;
  uniform float uRimPower;
  uniform float uRimStrength;
  uniform float uTerminatorWidth;
  uniform float uBleedWarm;
  uniform float uBleedCool;
  uniform float uAoStrength;
  uniform float uGroundY;
  uniform float uOpacity;

  #include <common>

  // RGB <-> HSV. H is 0..1 here.
  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 1e-10)), d / (q.x + 1e-10), q.x);
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  // The shadow colour Rimsoft would paint for this surface: hue rotated toward
  // blue, saturation raised, value barely touched.
  vec3 toShadow(vec3 base) {
    vec3 hsv = rgb2hsv(base);
    hsv.x = fract(hsv.x + uShadowHueShift);
    hsv.y = clamp(hsv.y * uShadowSaturation, 0.0, 1.0);
    hsv.z = hsv.z * uShadowValue;
    return hsv2rgb(hsv);
  }

  void main() {
    // Base colour comes from the uniform, not diffuseColor.
    vec3 base = uBaseColor * vColor;
    vec3 n = normalize(vNormalW);
    vec3 l = normalize(uLightDir);
    vec3 v = normalize(vViewDirW);

    // Contact darkening. A surface sitting just above the ground gets a little
    // darker, which is what visually plants an object instead of leaving it
    // looking pasted on. It falls off over roughly a metre and is tinted
    // towards the ambient rather than towards black, because this art
    // direction has no true black anywhere.
    float height = vWorldY - uGroundY;
    float contact = 1.0 - smoothstep(0.0, 1.6, height);
    base *= 1.0 - contact * uAoStrength;

    float ndl = dot(n, l);

    // At night the sun is below the horizon, so the raw dot product is
    // negative on every upward-facing surface and the whole scene falls to the
    // shadow term alone -- which is why midnight rendered as a flat dark slab.
    // Once the sun has set, the key light becomes the moon: same direction,
    // raised above the horizon, cool and dim. Shapes stay modelled at night.
    float keyNdl = (uLightStrength < 0.7) ? max(ndl, 0.0) : ndl;

    // A soft terminator, not a hard step. Measured across anime-style 3D, the
    // light/shadow transition is around 0.1 wide; anything harder reads as
    // unlit geometry rather than paint.
    float t = smoothstep(-uTerminatorWidth, uTerminatorWidth, keyNdl);

    vec3 lit = base * uLightColor * uLightStrength;

    // Shadow is the base colour with its hue shifted and saturation lifted,
    // times a BRIGHTNESS that never falls far. It deliberately does not take
    // the ambient's own colour as a multiplier: at night the sky publishes a
    // deep blue, and multiplying by it drove grass to L=0.14 -- a near-black
    // cold cast that looked like a horror film rather than like night.
    //
    // Instead the ambient only tints, gently and with a floor, and the shadow
    // keeps most of its value. Rimsoft's own shadows sit at roughly the same
    // lightness as their lights; they gain chroma, they do not lose value.
    //
    // The floor is relative to the light: as the sun goes down the whole scene
    // dims together, so night is dark without ever becoming unreadable or
    // falling through into a horror palette.
    float floorValue = uShadowFloor * uLightStrength;
    vec3 tint = mix(vec3(1.0), uAmbient, uTintAmount);
    tint = max(tint, vec3(floorValue));

    vec3 shadow = toShadow(base) * tint;

    vec3 outColor = mix(shadow, lit, t);

    // Artificial subsurface: a warm bleed just inside the lit side of the
    // terminator, a cool one just inside the shadow side. Cheap, and it is what
    // separates "painted" from "computed".
    float warmBand = smoothstep(0.0, uTerminatorWidth * 3.0, ndl) *
                     (1.0 - smoothstep(uTerminatorWidth, uTerminatorWidth * 3.0, ndl));
    float coolBand = smoothstep(-uTerminatorWidth * 3.0, -uTerminatorWidth, ndl) *
                     (1.0 - smoothstep(-uTerminatorWidth, uTerminatorWidth, ndl));
    outColor += uLightColor * warmBand * uBleedWarm;
    outColor += uAmbient * coolBand * uBleedCool * 0.5;

    // Rim light. On rounded geometry this is the single strongest cue that a
    // form is curved rather than faceted.
    float rim = 1.0 - max(dot(n, v), 0.0);
    rim = pow(clamp(rim, 0.0, 1.0), uRimPower);
    outColor += uRimColor * rim * uRimStrength;

    // Desaturate as the light goes. Without this the scene stayed fully
    // chromatic at midnight -- the ground dimmed but its colour did not, so
    // night read as an overcast afternoon rather than as night.
    float lum = dot(outColor, vec3(0.2126, 0.7152, 0.0722));
    outColor = mix(vec3(lum), outColor, uSaturation);

    // Debug channels, off unless uDebug is set.
    if (uDebug > 0.5) {
      if (uDebug < 1.5)      outColor = base;
      else if (uDebug < 2.5) outColor = lit;
      else if (uDebug < 3.5) outColor = shadow;
      else if (uDebug < 4.5) outColor = vec3(t);
      else if (uDebug < 5.5) outColor = vec3(contact * uAoStrength);
      else                    outColor = toShadow(base);
    }

    gl_FragColor = vec4(outColor, uOpacity);
  }
`;

// Builds an anime-style material that works with InstancedMesh and responds to
// the scene's light direction.
export class AnimeMaterialFactory {
  constructor() {
    this.materials = new Map();
    this.uniformSets = new Map();
  }

  // A per-material uniform block, so each surface can be tinted independently
  // while sharing one shader program.
  uniformsFor(name) {
    if (this.uniformSets.has(name)) return this.uniformSets.get(name);
    const set = THREE.UniformsUtils.clone(UNIFORMS);
    this.uniformSets.set(name, set);
    return set;
  }

  get(name, { color = 0xffffff, opacity = 1 } = {}) {
    const key = `${name}`;
    if (this.materials.has(key)) return this.materials.get(key);

    const isGlow =
      name.startsWith('neon') || name === 'lampGlass' || name === 'windowLit';

    const uniforms = this.uniformsFor(name);
    uniforms.uBaseColor.value.setHex(color);
    uniforms.uOpacity.value = opacity;

    const transparent = ['water', 'waterShallow', 'foam'].includes(name);

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent,
      depthWrite: !transparent,
      side: THREE.FrontSide,
      // Anime shading is unlit in the Three.js sense: the shader does its own
      // lighting, so the scene's lights must not also multiply in.
      lights: false
    });

    material.userData.isGlow = isGlow;
    material.userData.name = name;
    this.materials.set(key, material);
    return material;
  }

  // Glowing surfaces -- windows, neon, lamp glass, shoji -- are the one thing
  // that should NOT dim at night. They are what makes a Japanese street read as
  // alive after dark: a row of warm lit windows against a blue-grey street is
  // the whole night-time image, and without them the town just goes black.
  //
  // They are excluded from the global light strength and saturation falloff, so
  // they keep their own colour and brightness whatever the hour.
  glowsFor(name) {
    return (
      name.startsWith('neon') ||
      name === 'lampGlass' ||
      name === 'windowLit' ||
      name === 'lampPostGlass'
    );
  }

  // Called once a frame with the scene's current light setup.
  syncLighting({ lightDir, lightColor, ambientColor, rimStrength, groundY, lightStrength, saturation }) {
    for (const [name, uniforms] of this.uniformSets) {
      const isGlow = this.glowsFor(name);

      if (lightDir) uniforms.uLightDir.value.copy(lightDir);
      if (lightColor) uniforms.uLightColor.value.copy(lightColor);
      // Accept either a THREE.Color or a hex number. The sky publishes
      // horizonColor as a number, and calling .copy() on it produced NaN, which
      // turned every surface black.
      if (ambientColor) uniforms.uAmbient.value.set(ambientColor);
      if (typeof rimStrength === 'number') uniforms.uRimStrength.value = rimStrength;
      // Ground height follows the player, so contact darkening always refers to
      // the surface the player is actually standing on.
      if (typeof groundY === 'number') uniforms.uGroundY.value = groundY;

      // Lit windows, neon and lamp glass ignore the day/night curve entirely:
      // they are their own light source, which is exactly what a street lamp
      // or a shop sign is. Dimming them with the sun meant the town went
      // completely black at night.
      uniforms.uLightStrength.value = isGlow ? 1.0 : (lightStrength ?? 1.0);
      uniforms.uSaturation.value = isGlow ? 1.0 : (saturation ?? 1.0);
    }
  }

  dispose() {
    for (const material of this.materials.values()) material.dispose();
    this.materials.clear();
    this.uniformSets.clear();
  }
}