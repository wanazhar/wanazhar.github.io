#!/usr/bin/env python3
"""Photographs the game from a set of named viewpoints.

Uses the window.__sba inspection handle to jump to each spot with a chosen
camera angle, so the shots are reproducible and cover every region rather than
whatever happened to be in front of the camera at spawn.

Usage: tour.py <url> <outdir> [--analyze]
"""

import asyncio
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import open_game, settle  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))

# name, spot key, camera yaw (rad, 0 = +z), pitch, distance
# Every spot here came from scripts/find-vantage-points.js, which checks for
# real clearance behind and in front of the camera. Hand-picked coordinates kept
# landing inside a tree canopy, a barn or a hillside, which produced black
# frames and shots with no player visible.
VIEWS = [
    ("city-street", "cityStreet", 0.00, 0.34, 16),
    ("city-crossing", "cityAlt", 1.18, 0.36, 16),
    ("city-north", "cityNorth", 0.00, 0.34, 16),
    ("suburb-street", "suburbStreet", 0.39, 0.34, 16),
    ("suburb-homes", "suburbAlt", 1.57, 0.34, 16),
    ("suburb-gate", "suburbGate", 0.79, 0.34, 16),
    ("station", "station", 0.00, 0.34, 14),
    ("paddy-fields", "paddyView", 0.00, 0.32, 16),
    ("rural-road", "ruralRoad", 0.00, 0.32, 16),
    ("highlands", "highlands", 1.57, 0.34, 16),
    ("coast-shore", "coastShore", 0.00, 0.30, 16),
    ("coast-village", "coastVillage", 0.00, 0.32, 16),
]

# Landmarks, aimed rather than merely stood next to: window.__sba.view() places
# the player and points the camera at the subject, so it lands in frame.
LANDMARKS = [
    ("lm-torii", "torii"),
    ("lm-shrine", "shrine"),
    ("lm-konbini", "konbini"),
    ("lm-school", "school"),
    ("lm-mountain", "mountain"),
]


async def run(url, outdir, analyze=False):
    os.makedirs(outdir, exist_ok=True)
    b = await open_game(url)

    state = await b.try_evaluate("JSON.stringify(window.__sba.state)")
    print("state:", state)

    # Move, settle, shoot -- in that order, one view at a time. Queuing all the
    # teleports first and shooting afterwards would photograph the last position
    # from every angle.
    plan = []
    for i, (name, spot, yaw, pitch, dist) in enumerate(VIEWS):
        expr = f"window.__sba.teleport({json.dumps(spot)}, {yaw}, {pitch}, {dist})"
        plan.append((name, expr, f"{i:02d}-{name}.png"))
    offset = len(plan)
    for i, (name, key) in enumerate(LANDMARKS):
        expr = f"window.__sba.view({json.dumps(key)})"
        plan.append((name, expr, f"{offset + i:02d}-{name}.png"))

    for name, expr, filename in plan:
        result = await b.try_evaluate(expr)
        await settle(b, 35)
        path = os.path.join(outdir, filename)

        # Screenshots occasionally fail on a busy shared browser; retry rather
        # than losing the shot.
        shot_ok = False
        for attempt in range(4):
            try:
                await b.screenshot(path)
                shot_ok = True
                break
            except Exception:
                await asyncio.sleep(2)

        st = await b.try_evaluate("JSON.stringify(window.__sba.state)")
        try:
            s = json.loads(st or "{}")
            orbit = s.get("cameraOrbit", {})
            note = "" if shot_ok else "  [SHOT FAILED]"
            print(
                f"  {name:16s} region={s.get('region','?'):8s} "
                f"inst={s.get('instanceCount'):6} draws={s.get('drawCalls'):4} "
                f"camDist={orbit.get('distance'):.1f}{note}"
            )
        except Exception:
            print(f"  {name:16s} state={st}")

        if analyze:
            out = subprocess.run(
                [sys.executable, os.path.join(HERE, "analyze.py"), path],
                capture_output=True, text=True, timeout=120,
            )
            for line in out.stdout.splitlines():
                if "mean lightness" in line:
                    print(f"      {line.strip()}")

    await b.close()
    print("shots written to", outdir)


def main():
    url = sys.argv[1] if len(sys.argv) > 1 else "http://100.98.115.95:4174/"
    outdir = sys.argv[2] if len(sys.argv) > 2 else "/tmp/sba-tour"
    asyncio.run(run(url, outdir, "--analyze" in sys.argv))


if __name__ == "__main__":
    main()