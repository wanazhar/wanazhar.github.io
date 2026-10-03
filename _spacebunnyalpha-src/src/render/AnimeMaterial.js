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
  uRimColor: { value: new THREE.Color(0xffffff) },
  uRimPower: { value: 2.4 },
  uRimStrength: { value: 0.55 },
  uTerminatorWidth: { value: 0.12 },
  uBleedWarm: { value: 0.22 },
  uBleedCool: { value: 0.16 },
  uOpacity: { value: 1.0 }
};

const VERTEX = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewDirW;
  varying vec3 vColor;

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

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewDirW;
  varying vec3 vColor;

  uniform vec3 uBaseColor;
  uniform vec3 uLightDir;
  uniform vec3 uLightColor;
  uniform vec3 uAmbient;
  uniform float uShadowHueShift;
  uniform float uShadowSaturation;
  uniform float uShadowValue;
  uniform vec3 uRimColor;
  uniform float uRimPower;
  uniform float uRimStrength;
  uniform float uTerminatorWidth;
  uniform float uBleedWarm;
  uniform float uBleedCool;
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

    float ndl = dot(n, l);

    // A soft terminator, not a hard step. Measured across anime-style 3D, the
    // light/shadow transition is around 0.1 wide; anything harder reads as
    // unlit geometry rather than paint.
    float t = smoothstep(-uTerminatorWidth, uTerminatorWidth, ndl);

    vec3 lit = base * uLightColor;
    vec3 shadow = toShadow(base) * uAmbient;

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

  // Called once a frame with the scene's current light setup.
  syncLighting({ lightDir, lightColor, ambientColor, rimStrength }) {
    for (const uniforms of this.uniformSets.values()) {
      if (lightDir) uniforms.uLightDir.value.copy(lightDir);
      if (lightColor) uniforms.uLightColor.value.copy(lightColor);
      // Accept either a THREE.Color or a hex number. The sky publishes
      // horizonColor as a number, and calling .copy() on it produced NaN, which
      // turned every surface black.
      if (ambientColor) uniforms.uAmbient.value.set(ambientColor);
      if (typeof rimStrength === 'number') uniforms.uRimStrength.value = rimStrength;
    }
  }

  dispose() {
    for (const material of this.materials.values()) material.dispose();
    this.materials.clear();
    this.uniformSets.clear();
  }
}