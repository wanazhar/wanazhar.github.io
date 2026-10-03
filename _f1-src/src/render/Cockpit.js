/**
 * The cockpit interior.
 *
 * Built for the cockpit camera and attached to it, so it exists only when the player is
 * sitting in the car.
 *
 * ## Why this exists
 *
 * Before it, the cockpit camera was just the chase camera at eye level: the same view
 * of the same world, with the player's own car nowhere in it. That is not a cockpit
 * view, it is a floating camera, and the absence is felt more than noticed -- the view
 * looks *wrong* without anything to explain why the horizon sits where it does.
 *
 * The interior gives the eye the reference it is missing. Real cockpit cameras sit
 * behind the halo and below the top of the roll hoop, looking out through a narrow
 * aperture, and it is that narrow aperture -- not the camera position -- that makes the
 * speed read. At 300 kph the world does not appear to move faster because the camera
 * moved; it appears to move faster because the edges of the screen are close to it.
 *
 * ## Cost
 *
 * One draw call's worth of primitives, parented to the camera, built once at startup
 * and toggled by visibility. It is never in the scene graph during a chase-camera race,
 * so it costs nothing there, and in the cockpit it is a handful of triangles.
 */

import * as THREE from 'three';

/*
 * Sized against the actual projection, which is the whole problem with cockpit
 * geometry and why the first attempt filled the screen.
 *
 * At the default 62 degree vertical field of view on a landscape phone the frame is
 * roughly 108 degrees across, so the visible half-width at one metre ahead is about
 * 1.36m. Anything meant to sit at the *edge* of the view therefore has to be at
 * x = +/-0.9m or so, not at +/-0.4m -- at 0.4m it is halfway across the screen and
 * reads as a wall rather than as a pillar. These numbers are deliberately conservative:
 * an interior that occludes less is a worse interior, never a better one.
 */
const HALO_TOP_Y = 0.3;
const PILLAR_X = 0.92;
const APERTURE_Z = -0.66;

/** Materials shared across every part, so the interior is two or three draw calls. */
function materials() {
  return {
    // Matte carbon. Cockpit surfaces are not bodywork, and giving them the same glossy
    // paint as the car reads as a scale model of a cockpit inside a real car.
    carbon: new THREE.MeshStandardMaterial({ color: 0x15181f, roughness: 0.62, metalness: 0.15 }),
    // Very slightly warm, so it separates from the carbon under any sky.
    trim: new THREE.MeshStandardMaterial({ color: 0x2a2f3a, roughness: 0.75, metalness: 0.05 }),
    halo: new THREE.MeshStandardMaterial({ color: 0x1b1e26, roughness: 0.42, metalness: 0.55 }),
    wheel: new THREE.MeshStandardMaterial({ color: 0x0d0f14, roughness: 0.7, metalness: 0.1 }),
    // Emissive so the display is visible in the dark and in daylight, which is the
    // whole reason a real one has a backlight.
    display: new THREE.MeshStandardMaterial({
      color: 0x0a0d12,
      emissive: 0x1f6b3a,
      emissiveIntensity: 0.9,
      roughness: 0.3
    })
  };
}

/**
 * Build the interior.
 *
 * Positioned in camera space: the camera sits at the driver's eye point, so everything
 * here is measured backwards from that -- negative Z is behind the eye, which is where
 * a cockpit actually is.
 *
 * @returns {THREE.Group} attach to the camera, and toggle `.visible` with the mode
 */
export function buildCockpit() {
  const group = new THREE.Group();
  const mat = materials();

  /*
   * The aperture.
   *
   * Two dark panels either side of the view, angled inward. This is the single most
   * important object in the whole interior: it is what makes the speed legible, because
   * it puts something close to the eye at the edges of the frame where the motion is.
   *
   * Deliberately *not* a full windscreen or a roof. A roof would occlude the sky and
   * make the circuit feel indoors; what a real halo view has is a narrow band of
   * structure, and the peripheral reference, not a lid.
   */
  const sideShape = new THREE.Shape();
  sideShape.moveTo(0, -0.3);
  sideShape.lineTo(0.2, -0.36);
  sideShape.lineTo(0.24, 0.3);
  sideShape.lineTo(0, 0.26);
  sideShape.lineTo(0, -0.3);

  for (const side of [-1, 1]) {
    const panel = new THREE.Mesh(
      new THREE.ExtrudeGeometry(sideShape, { depth: 0.04, bevelEnabled: false }),
      mat.carbon
    );
    // Angled inward, so the aperture narrows toward the front of the car the way a
    // halo does. Without the taper it is a box, and a box reads as a box.
    panel.rotation.y = side > 0 ? -0.55 : Math.PI + 0.55;
    panel.position.set(side * PILLAR_X, -0.06, APERTURE_Z);
    group.add(panel);
  }

  // The halo's central pillar, straight ahead and low, below the eyeline.
  const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.11, 0.06), mat.halo);
  pillar.position.set(0, -0.2, APERTURE_Z);
  group.add(pillar);

  // Top edge of the halo, just intruding at the top of the frame. Above the eyeline by
  // enough to sit out of shot at a normal field of view -- present when you look up,
  // absent when you look ahead.
  const haloTop = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.045, 0.09), mat.halo);
  haloTop.position.set(0, HALO_TOP_Y, APERTURE_Z + 0.1);
  haloTop.rotation.x = 0.2;
  group.add(haloTop);

  /*
   * Steering wheel.
   *
   * A modern F1 wheel is a rectangular yoke, not a rim, and building it as a rim is the
   * single most common way a fake cockpit gives itself away. Built as a squared-off
   * shape with grips either side and a display in the middle.
   */
  const wheel = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.045, 0.035), mat.wheel);
  wheel.add(bar);
  for (const side of [-1, 1]) {
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.13, 0.045), mat.wheel);
    grip.position.set(side * 0.155, 0, 0);
    wheel.add(grip);
  }
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.012), mat.display);
  screen.position.set(0, 0.012, 0.026);
  wheel.add(screen);

  wheel.position.set(0, -0.44, -0.58);
  wheel.rotation.x = -0.3;
  group.add(wheel);
  group.userData.wheel = wheel;

  // Mirrors, one each side, in the periphery where they belong.
  for (const side of [-1, 1]) {
    const stalk = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.014, 0.014), mat.carbon);
    stalk.position.set(side * 0.78, -0.1, APERTURE_Z + 0.06);
    stalk.rotation.z = side * -0.35;
    group.add(stalk);

    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.025), mat.trim);
    mirror.position.set(side * 0.86, -0.075, APERTURE_Z + 0.06);
    group.add(mirror);
  }

  /*
   * The bulkhead below the windscreen.
   *
   * Low enough to sit under the horizon, so it frames the view without eating it. No
   * nose of our own: from the cockpit camera the car's real bodywork is already visible
   * ahead, and adding a second one stacks two surfaces in the same part of the frame.
   */
  const dash = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.07, 0.18), mat.carbon);
  dash.position.set(0, -0.52, -0.86);
  dash.rotation.x = 0.14;
  group.add(dash);

  group.traverse((child) => {
    if (!child.isMesh) return;
    child.frustumCulled = false;
    // The interior must not be lit by, or cast shadows from, the directional light in
    // a way that turns it into a silhouette; keeping it receive-only and unlit-ish
    // means it reads as an interior whatever the weather is doing.
    child.receiveShadow = false;
    child.castShadow = false;
  });

  return group;
}

/**
 * Turn the wheel, so it tracks the steering rather than sitting dead straight.
 *
 * A locked-straight wheel in a corner is as effective a tell as no cockpit at all.
 *
 * @param {THREE.Group} cockpit
 * @param {number} steer -1..1
 */
export function steerCockpit(cockpit, steer) {
  const wheel = cockpit?.userData?.wheel;
  if (!wheel) return;
  // Modern wheels rotate only a little; a full lock turns about a fifth of a turn.
  wheel.rotation.z = -steer * 0.7;
}