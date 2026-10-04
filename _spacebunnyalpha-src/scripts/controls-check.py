#!/usr/bin/env python3
"""Verifies movement in a real browser, using the game's own inspection handle.

The inverted-movement bug was invisible to every existing test: the unit tests
spawned the player at the world origin, where the edge clamp pins them, so they
measured a stationary player rather than a walking one. This drives the actual
game with real key events and checks the direction of travel against where the
camera is looking.

Usage: controls-check.py <url>
"""

import asyncio
import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from cdp import open_game, settle  # noqa: E402


def vec(x, y, z):
    return f"({x}, {y}, {z})"


# Movement direction expressed the way the game does: the camera sits at
# focus + (sin(yaw), cos(yaw)) * dist, so it looks along -(sin, cos).
STATE_JS = r"""
(() => {
  const s = window.__sba.state;
  const c = s.cameraOrbit;
  return JSON.stringify({
    x: s.player.x, y: s.player.y, z: s.player.z,
    camYaw: c.yaw, camDist: c.distance,
    region: s.region, frame: s.frame
  });
})()
"""


def press(code):
    return f"""
    (() => {{
      window.dispatchEvent(new KeyboardEvent('keydown', {{code: {json.dumps(code)}, bubbles: true}}));
      return true;
    }})()
    """


async def hold(b, code, frames=26):
    await b.try_evaluate(press(code), attempts=2)
    # Walk real frames: headless throttles rAF, so time alone advances nothing.
    await settle(b, frames)
    await b.try_evaluate(
        f"window.dispatchEvent(new KeyboardEvent('keyup', {{code: {json.dumps(code)}, bubbles: true}}))",
        attempts=2,
    )
    await settle(b, 4)


# The follow camera slides sideways when it has nowhere to sit (reframeAround),
# which changes the yaw mid-walk. Movement is camera-relative, so a basis read
# after the walk does not match the basis the movement was made in: one run put
# the yaw at 3.00 by the end, and A then looked like an inversion when it was
# the test that was wrong. Pin the yaw for the duration of each hold so the
# basis is fixed and the measurement means something.
PIN_YAW_JS = """(() => {
  const cam = window.__sba.followCamera;
  if (!cam.__realUpdate) {
    cam.__realUpdate = cam.update.bind(cam);
    cam.update = function (dt, pos, h) {
      cam.yaw = 0;
      cam.__realUpdate(dt, pos, h);
      cam.yaw = 0;
    };
  }
  cam.yaw = 0;
  return true;
})()"""

UNPIN_YAW_JS = """(() => {
  const cam = window.__sba.followCamera;
  if (cam.__realUpdate) { cam.update = cam.__realUpdate; delete cam.__realUpdate; }
  return true;
})()"""


async def run(url):
    b = await open_game(url)
    failures = []

    cases = [
        ("W", "KeyW", "forward"),
        ("S", "KeyS", "backward"),
        ("D", "KeyD", "strafe right"),
        ("A", "KeyA", "strafe left"),
    ]

    for label, code, expectation in cases:
        # Start each case from the same spot so the measurement is clean.
        await b.try_evaluate(UNPIN_YAW_JS, attempts=2)
        await b.try_evaluate("window.__sba.teleport('paddyView', 0, 0.34, 16)", attempts=2)
        await settle(b, 18)

        # A blocked tile stops the player dead, which then reads as "wrong
        # direction" rather than "nowhere to walk". Report it as its own
        # problem instead of silently mislabelling it.
        blocked = json.loads(
            await b.try_evaluate(
                "JSON.stringify(window.__sba.player.isBlocked("
                "window.__sba.player.position.x, window.__sba.player.position.z))",
                attempts=2,
            )
        )
        if blocked is True:
            failures.append(f"{label}: the probe spot is inside a collision footprint")
            print(f"  FAIL  {label:12s} ({expectation:12s}) probe tile is blocked")
            continue

        before = json.loads(await b.try_evaluate(STATE_JS))
        await b.try_evaluate(PIN_YAW_JS, attempts=2)
        await hold(b, code)
        after = json.loads(await b.try_evaluate(STATE_JS))
        await b.try_evaluate(UNPIN_YAW_JS, attempts=2)

        dx = after["x"] - before["x"]
        dz = after["z"] - before["z"]
        camYaw = after["camYaw"]

        # Walking into a wall along the intended axis still shows the right
        # sign, just a short distance. Walking sideways into one shows the
        # wrong sign. Only the direction is judged, but a near-zero move is
        # worth calling out because it usually means the probe is somewhere
        # enclosed.
        moved = math.hypot(dx, dz)

        # Camera basis. The yaw is pinned to 0 for the whole hold, so the
        # camera sits at focus + (0, +dist), i.e. at +z, and looks towards -z.
        #
        # FollowCamera places the camera at focus + (sin(yaw), cos(yaw)) * dist,
        # so the look bearing is the NEGATION, and screen-right is that bearing
        # rotated the other way: right = (-lookZ, lookX). At yaw 0 that gives
        # look = (0,-1) and right = (1,0).
        #
        # This check used to read right = (lookZ, -lookX), which is the same
        # sign error the game had. A check that shares the bug's assumption
        # agrees with the bug and reports PASS on an inverted control, which is
        # exactly what happened.
        look_x = -math.sin(camYaw)
        look_z = -math.cos(camYaw)
        right_x = -look_z
        right_z = look_x

        along_look = dx * look_x + dz * look_z
        along_right = dx * right_x + dz * right_z

        want = {
            "forward": (along_look, 1),
            "backward": (along_look, -1),
            "strafe right": (along_right, 1),
            "strafe left": (along_right, -1),
        }[expectation]
        value, sign = want

        # Only judge the axis the input is meant to move along. Holding A while
        # drifting into a fence produces a large sideways delta with a near
        # zero intended-axis component; that is a collision, not an inversion.
        ok = (value * sign) > 0.6 and abs(value) > 0.15 * max(moved, 0.001)
        status = "PASS" if ok else "FAIL"
        note = "" if moved > 1.0 else "  (barely moved - likely blocked)"
        print(
            f"  {status}  {label:12s} ({expectation:12s}) "
            f"delta=({dx:+.2f},{dz:+.2f}) alongLook={along_look:+.2f} alongRight={along_right:+.2f} "
            f"camYaw={camYaw:+.2f}{note}"
        )
        if not ok:
            failures.append(
                f"{label} moved the wrong way: along-look {along_look:+.2f}, along-right {along_right:+.2f}"
            )

    # The thumbstick, not just the keyboard. The report that prompted all of
    # this was about the on-screen joystick, and it takes a different route into
    # the controller than W/A/S/D does.
    for label, sx, sy, expectation in [
        ("stick up", 0, -1, "forward"),
        ("stick down", 0, 1, "backward"),
        ("stick right", 1, 0, "strafe right"),
        ("stick left", -1, 0, "strafe left"),
    ]:
        await b.try_evaluate("window.__sba.teleport('paddyView', 0, 0.34, 16)", attempts=2)
        await settle(b, 16)

        result = json.loads(
            await b.try_evaluate(
                f"""(() => {{
                  const S = window.__sba;
                  // Pin the camera so the expected basis is known exactly and
                  // cannot drift between probes.
                  S.followCamera.yaw = 0;
                  const r = S.probeMovement({sx}, {sy}, 90);
                  return JSON.stringify({{ x: r.x, z: r.z, distance: r.distance, camYaw: r.camYaw }});
                }})()""",
                attempts=2,
            )
        )

        if abs(result["camYaw"]) > 1e-6:
            failures.append(f"{label}: camera yaw was {result['camYaw']}, expected 0")
            continue

        dx, dz = result["x"], result["z"]
        # At yaw 0 the camera sits at +z looking towards -z, so screen-right
        # is +x.
        along_look = -dz
        along_right = dx

        want = {
            "forward": (along_look, 1),
            "backward": (along_look, -1),
            "strafe right": (along_right, 1),
            "strafe left": (along_right, -1),
        }[expectation]
        value, sign = want

        ok = (value * sign) > 0.9
        status = "PASS" if ok else "FAIL"
        print(
            f"  {status}  {label:12s} ({expectation:12s}) "
            f"delta=({dx:+.2f},{dz:+.2f}) alongLook={along_look:+.2f} alongRight={along_right:+.2f}"
        )
        if not ok:
            failures.append(
                f"{label} moved the wrong way: along-look {along_look:+.2f}, along-right {along_right:+.2f}"
            )

    # Also check the camera actually responds to a drag.
    await b.try_evaluate("window.__sba.teleport('paddyView', 0, 0.34, 16)", attempts=2)
    await settle(b, 15)
    yaw_before = json.loads(await b.try_evaluate(STATE_JS))["camYaw"]

    await b.try_evaluate(
        """(() => {
          const c = document.querySelector('canvas');
          const mk = (t, x, y) => new PointerEvent(t, {clientX:x, clientY:y, bubbles:true, pointerId:1});
          c.dispatchEvent(mk('pointerdown', 640, 300));
          for (let i = 1; i <= 12; i++) window.dispatchEvent(mk('pointermove', 640 + i*14, 300));
          window.dispatchEvent(mk('pointerup', 640 + 168, 300));
        })()""",
        attempts=2,
    )
    await settle(b, 14)
    yaw_after = json.loads(await b.try_evaluate(STATE_JS))["camYaw"]

    rotated = abs(yaw_after - yaw_before) > 0.2
    print(
        f"  {'PASS' if rotated else 'FAIL'}  camera drag    yaw {yaw_before:+.2f} -> {yaw_after:+.2f}"
    )
    if not rotated:
        failures.append("dragging on the canvas did not rotate the camera")

    # And zoom.
    #
    # Read targetDistance, and compare it against targetDistance. Two reasons:
    #   1. The wheel drives targetDistance; currentDistance is the damped value
    #      easing towards it, and headless Chrome renders at roughly 1 fps, so
    #      the easing never arrives no matter how many frames are waited for.
    #   2. state.cameraOrbit.distance reports currentDistance, which camera
    #      collision has already pulled in from whatever the teleport asked
    #      for. Comparing a target against a current produces a number that
    #      means nothing -- the previous version of this check did exactly that
    #      and reported a correct zoom as a failure.
    #
    # The teleport above asks for distance 16, so that is the baseline.
    target_before = json.loads(
        await b.try_evaluate("String(window.__sba.followCamera.targetDistance)")
    )
    await b.try_evaluate(
        "document.querySelector('canvas').dispatchEvent(new WheelEvent('wheel', {deltaY: -400, bubbles: true}))",
        attempts=2,
    )
    await settle(b, 6)
    target_after = json.loads(
        await b.try_evaluate("String(window.__sba.followCamera.targetDistance)")
    )

    # deltaY -400 at 0.012 per unit pulls the camera 4.8 units closer.
    expected_target = max(target_before - 400 * 0.012, 3.5)
    zoomed = abs(target_after - expected_target) < 0.05

    print(
        f"  {'PASS' if zoomed else 'FAIL'}  wheel zoom      "
        f"target {target_before:.1f} -> {target_after:.1f} (expected {expected_target:.1f})"
    )
    if not zoomed:
        failures.append(
            f"wheel zoom did not move the target distance correctly "
            f"(got {target_after}, expected {expected_target})"
        )

    await b.close()

    print()
    if failures:
        print("CONTROL CHECKS FAILED")
        for f in failures:
            print("  -", f)
        sys.exit(1)
    print("all control checks passed")


if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "http://100.98.115.95:4174/"
    asyncio.run(run(url))