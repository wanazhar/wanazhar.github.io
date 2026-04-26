#!/usr/bin/env bash
set -euo pipefail

# Change this if your wanazhar.github.io repo is somewhere else.
PAGES_REPO="${PAGES_REPO:-$HOME/projects/wanazhar.github.io}"
TARGET_DIR="$PAGES_REPO/kualalumpur"

npm install
npm run build

mkdir -p "$TARGET_DIR"
rm -rf "$TARGET_DIR"/*
cp -R dist/* "$TARGET_DIR"/

cd "$PAGES_REPO"
git add kualalumpur
git commit -m "Add voxel Kuala Lumpur prototype" || true
git push

echo "Done. Open: https://wanazhar.github.io/kualalumpur/"
