#!/usr/bin/env node
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const CENTER = {
  lat: Number(process.env.CITY_LAT || 3.1478),
  lon: Number(process.env.CITY_LON || 101.6953)
};
const RADIUS_METERS = Number(process.env.CITY_RADIUS_METERS || 1200);
const CELL_SIZE = Number(process.env.CITY_CELL_SIZE || 4);
const MAX_VOXELS = Number(process.env.CITY_MAX_BLOCKS || 64000);
const OUT = path.resolve('public/data/city-blocks.json');

const query = `
[out:json][timeout:45];
(
  way["building"](around:${RADIUS_METERS},${CENTER.lat},${CENTER.lon});
  way["highway"](around:${RADIUS_METERS},${CENTER.lat},${CENTER.lon});
  way["leisure"="park"](around:${RADIUS_METERS},${CENTER.lat},${CENTER.lon});
);
(._;>;);
out body;
`;

console.log(`Fetching map-data data around KLCC radius=${RADIUS_METERS}m...`);
const response = await fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: {
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'User-Agent': 'EmirCarWorldBot/1.0 (https://wanazhar.github.io/emir)'
  },
  body: new URLSearchParams({ data: query })
});

if (!response.ok) throw new Error(`Overpass request failed: ${response.status} ${response.statusText}`);
const osm = await response.json();
const data = convertOsmToVoxels(osm);
await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(data, null, 2));
console.log(`Wrote ${data.voxels.length.toLocaleString()} voxels to ${OUT}`);

function convertOsmToVoxels(osm) {
  const nodes = new Map();
  const ways = [];
  for (const element of osm.elements || []) {
    if (element.type === 'node') nodes.set(element.id, project(element.lat, element.lon));
    if (element.type === 'way') ways.push(element);
  }

  const voxelMap = new Map();
  const add = (voxel) => {
    if (voxelMap.size >= MAX_VOXELS) return;
    const key = `${Math.round(voxel.x / CELL_SIZE)},${Math.round(voxel.y / CELL_SIZE)},${Math.round(voxel.z / CELL_SIZE)},${voxel.type}`;
    voxelMap.set(key, quantise(voxel));
  };

  for (const way of ways) {
    const pts = (way.nodes || []).map((id) => nodes.get(id)).filter(Boolean);
    if (pts.length < 2) continue;
    const tags = way.tags || {};

    if (tags.highway) {
      rasterRoad(pts, roadWidth(tags.highway), (x, z) => add({ x, y: 0.04, z, type: 'road' }));
      continue;
    }

    if (tags.leisure === 'park') {
      rasterPolygon(pts, CELL_SIZE * 1.5, (x, z) => add({ x, y: 0.02, z, type: 'park' }));
      continue;
    }

    if (tags.building) {
      const levels = estimateLevels(tags);
      const footprintStep = CELL_SIZE;
      rasterPolygon(pts, footprintStep, (x, z) => {
        for (let level = 0; level < levels; level++) {
          const type = level > 7 ? 'tower' : 'building';
          add({ x, y: CELL_SIZE * 0.5 + level * CELL_SIZE, z, type });
        }
      });
    }
  }

  if (voxelMap.size < 500) {
    console.warn('OSM response was sparse. Adding procedural landmarks so the map remains playable.');
    addFallbackDistrict(add);
  }

  return {
    generatedAt: new Date().toISOString(),
    source: 'OpenStreetMap via Overpass API',
    center: CENTER,
    radiusMeters: RADIUS_METERS,
    cellSize: CELL_SIZE,
    voxels: [...voxelMap.values()]
  };
}

function project(lat, lon) {
  const metersPerDegreeLat = 111_320;
  const metersPerDegreeLon = 111_320 * Math.cos(CENTER.lat * Math.PI / 180);
  return { x: (lon - CENTER.lon) * metersPerDegreeLon, z: -(lat - CENTER.lat) * metersPerDegreeLat };
}

function quantise(v) {
  return {
    x: Math.round(v.x / CELL_SIZE) * CELL_SIZE,
    y: Math.round(v.y * 100) / 100,
    z: Math.round(v.z / CELL_SIZE) * CELL_SIZE,
    type: v.type
  };
}

function estimateLevels(tags) {
  const height = Number(String(tags.height || '').replace(/[^0-9.]/g, ''));
  const levels = Number(tags['building:levels'] || tags.levels || 0);
  if (Number.isFinite(height) && height > 0) return clamp(Math.round(height / CELL_SIZE), 1, 24);
  if (Number.isFinite(levels) && levels > 0) return clamp(Math.round((levels * 3.2) / CELL_SIZE), 1, 22);
  return 1 + Math.floor(Math.random() * 5);
}

function roadWidth(type) {
  if (['motorway', 'trunk', 'primary'].includes(type)) return CELL_SIZE * 3;
  if (['secondary', 'tertiary'].includes(type)) return CELL_SIZE * 2;
  return CELL_SIZE * 1.25;
}

function rasterRoad(points, width, emit) {
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i], b = points[i + 1];
    const dx = b.x - a.x, dz = b.z - a.z;
    const len = Math.hypot(dx, dz);
    const steps = Math.max(1, Math.ceil(len / (CELL_SIZE * 0.7)));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const x = a.x + dx * t;
      const z = a.z + dz * t;
      for (let ox = -width; ox <= width; ox += CELL_SIZE) {
        for (let oz = -width; oz <= width; oz += CELL_SIZE) {
          if (ox * ox + oz * oz <= width * width) emit(x + ox, z + oz);
        }
      }
    }
  }
}

function rasterPolygon(points, step, emit) {
  const xs = points.map((p) => p.x), zs = points.map((p) => p.z);
  const minX = Math.floor(Math.min(...xs) / step) * step;
  const maxX = Math.ceil(Math.max(...xs) / step) * step;
  const minZ = Math.floor(Math.min(...zs) / step) * step;
  const maxZ = Math.ceil(Math.max(...zs) / step) * step;
  for (let x = minX; x <= maxX; x += step) {
    for (let z = minZ; z <= maxZ; z += step) {
      if (pointInPolygon({ x, z }, points)) emit(x, z);
    }
  }
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, zi = polygon[i].z;
    const xj = polygon[j].x, zj = polygon[j].z;
    const intersect = ((zi > point.z) !== (zj > point.z)) &&
      (point.x < (xj - xi) * (point.z - zi) / ((zj - zi) || 1e-9) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function addFallbackDistrict(add) {
  for (let x = -180; x <= 180; x += CELL_SIZE) {
    add({ x, y: 0.04, z: 0, type: 'road' });
    add({ x: 0, y: 0.04, z: x, type: 'road' });
  }
  for (let bx = -130; bx <= 130; bx += 22) {
    for (let bz = -130; bz <= 130; bz += 22) {
      if (Math.abs(bx) < 18 || Math.abs(bz) < 18) continue;
      const levels = 2 + Math.abs((bx * 13 + bz * 7) % 10);
      for (let level = 0; level < levels; level++) add({ x: bx, y: 2 + level * CELL_SIZE, z: bz, type: level > 7 ? 'tower' : 'building' });
    }
  }
}

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
