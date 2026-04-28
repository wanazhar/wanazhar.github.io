#!/usr/bin/env python3
"""Regenerate the tiny placeholder GLB vehicle assets used by the prototype.
The runtime supports replacing these with proper voxel art GLBs as long as nodes are named:
chassis, wheel_fl, wheel_fr, wheel_rl, wheel_rr.
"""
from pathlib import Path
import sys
sys.path.append(str(Path(__file__).resolve().parent))
from make_glbs import generate_all

generate_all(Path('public/models/vehicles'))
