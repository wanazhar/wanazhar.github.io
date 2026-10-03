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
        await b.try_evaluate("window.__sba.teleport('paddyView', 0, 0.34, 16)", attempts=2)
        await settle(b, 18)

        before = json.loads(await b.try_evaluate(STATE_JS))
        await hold(b, code)
        after = json.loads(await b.try_evaluate(STATE_JS))

        dx = after["x"] - before["x"]
        dz = after["z"] - before["z"]
        camYaw = after["camYaw"]

        # Camera basis.
        look_x = -_sin(camYaw)
        look_z = -_cos(camYaw)
        right_x = look_z
        right_z = -look_x

        along_look = dx * look_x + dz * look_z
        along_right = dx * right_x + dz * right_z

        want = {
            "forward": (along_look, 1),
            "backward": (along_look, -1),
            "strafe right": (along_right, 1),
            "strafe left": (along_right, -1),
        }[expectation]
        value, sign = want

        ok = (value * sign) > 0.6
        status = "PASS" if ok else "FAIL"
        print(
            f"  {status}  {label:12s} ({expectation:12s}) "
            f"delta=({dx:+.2f},{dz:+.2f}) alongLook={along_look:+.2f} alongRight={along_right:+.2f} "
            f"camYaw={camYaw:+.2f}"
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
    dist_before = json.loads(await b.try_evaluate(STATE_JS))["camDist"]
    await b.try_evaluate(
        "document.querySelector('canvas').dispatchEvent(new WheelEvent('wheel', {deltaY: -400, bubbles: true}))",
        attempts=2,
    )
    await settle(b, 15)
    dist_after = json.loads(await b.try_evaluate(STATE_JS))["camDist"]
    zoomed = dist_after > dist_before
    print(f"  {'PASS' if zoomed else 'FAIL'}  wheel zoom      dist {dist_before:.1f} -> {dist_after:.1f}")
    if not zoomed:
        failures.append(f"wheel did not zoom out (dist stayed at {dist_after:.1f})")

    await b.close()

    print()
    if failures:
        print("CONTROL CHECKS FAILED")
        for f in failures:
            print("  -", f)
        sys.exit(1)
    print("all control checks passed")


def _sin(v):
    import math
    return math.sin(v)


def _cos(v):
    import math
    return math.cos(v)


if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "http://100.98.115.95:4174/"
    asyncio.run(run(url))