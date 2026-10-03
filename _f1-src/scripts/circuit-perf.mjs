/**
 * Per-circuit build cost and render load.
 *
 * Circuit building is the one thing that visibly blocks the main thread, so it is
 * split into yielding phases with a progress bar. This reports what each phase
 * actually costs now that the layouts come from real centreline data, which has
 * roughly twice the sample count of the radial profiles it replaced.
 *
 * Run: node scripts/circuit-perf.mjs
 */

import { installCanvasShim } from './helpers/domShim.mjs';

installCanvasShim();

const { buildTrack } = await import('../src/track/trackGeometry.js');
const { CIRCUITS } = await import('../src/track/circuits.js');
const { buildTrackMesh, buildEnvironment } = await import('../src/render/TrackMesh.js');

const ms = (from, to) => Number(to - from) / 1e6;

console.log('circuit           length  samples   build    mesh     env   draw calls   triangles');
let worstBuild = 0;
let worstName = '';

for (const circuit of CIRCUITS) {
  const a = process.hrtime.bigint();
  const track = buildTrack(circuit);
  const b = process.hrtime.bigint();
  const mesh = buildTrackMesh(track);
  const c = process.hrtime.bigint();
  const environment = buildEnvironment(track, circuit.theme);
  const d = process.hrtime.bigint();

  let meshes = 0;
  let triangles = 0;
  for (const group of [mesh, environment]) {
    group.traverse((node) => {
      if (!node.isMesh) return;
      meshes += 1;
      const position = node.geometry.getAttribute('position');
      triangles += node.geometry.index ? node.geometry.index.count / 3 : position.count / 3;
    });
  }

  const build = ms(a, b);
  if (build > worstBuild) {
    worstBuild = build;
    worstName = circuit.id;
  }

  console.log(
    `${circuit.id.padEnd(15)} ${(track.length / 1000).toFixed(2).padStart(6)}km ${String(track.count).padStart(8)} ` +
      `${build.toFixed(0).padStart(7)}ms ${ms(b, c).toFixed(0).padStart(6)}ms ${ms(c, d).toFixed(0).padStart(6)}ms ` +
      `${String(meshes).padStart(12)} ${String(triangles).padStart(12)}`
  );
}

console.log(`\nworst: ${worstName} at ${worstBuild.toFixed(0)}ms`);