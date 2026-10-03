// Design bench for circuit layouts. Not part of the shipped game.
//   node scripts/circuit-lab.mjs          report the shipped calendar
//   node scripts/circuit-lab.mjs plot id  ASCII-render one layout
import { buildTrack, SAMPLE_SPACING } from '../src/track/trackGeometry.js';
import { CIRCUITS } from '../src/track/circuits.js';

export function report(circuit) {
  const t0 = Date.now();
  const track = buildTrack(circuit);
  const ms = Date.now() - t0;
  const minSpeed = Math.min(...track.samples.map((s) => s.targetSpeed));
  const maxSpeed = Math.max(...track.samples.map((s) => s.targetSpeed));
  const hairpins = track.samples.filter((s) => Math.abs(s.lineCurvature) > 0.022).length;
  const lineUse = track.samples.reduce((a, s) => a + Math.abs(s.lineOffset), 0) / track.count;
  console.log(
    [
      circuit.id.padEnd(14),
      `${(track.length / 1000).toFixed(2)}km`.padEnd(8),
      `n=${String(track.count).padEnd(5)}`,
      `v ${(minSpeed * 3.6).toFixed(0)}-${(maxSpeed * 3.6).toFixed(0)}kph`.padEnd(14),
      `line ${lineUse.toFixed(1)}m`.padEnd(11),
      `hairpin ${String(hairpins).padEnd(5)}`,
      `lap ~${track.lapRecord.toFixed(1)}s`.padEnd(11),
      `sep ${track.minSelfDistance.toFixed(0)}m`.padEnd(10),
      `${ms}ms`
    ].join(' ')
  );
  return track;
}

export function plot(track, cols = 74, rows = 30) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const s of track.samples) {
    minX = Math.min(minX, s.x); maxX = Math.max(maxX, s.x);
    minZ = Math.min(minZ, s.z); maxZ = Math.max(maxZ, s.z);
  }
  const spanX = maxX - minX || 1;
  const spanZ = maxZ - minZ || 1;
  const grid = Array.from({ length: rows }, () => new Array(cols).fill(' '));
  // Curl the line with direction glyphs so flow direction is readable.
  const glyphs = '->^<-v';
  track.samples.forEach((s, i) => {
    const cx = Math.round(((s.x - minX) / spanX) * (cols - 1));
    const cy = Math.round(((s.z - minZ) / spanZ) * (rows - 1));
    const dir = glyphs[Math.round(((s.heading / (Math.PI * 2)) % 1) * 4 + 4) % 4];
    grid[rows - 1 - cy][cx] = dir;
    void i;
  });
  console.log(grid.map((r) => `|${r.join('')}|`).join('\n'));
  void SAMPLE_SPACING;
}

if (process.argv[2] === 'plot') {
  const id = process.argv[3];
  plot(buildTrack(CIRCUITS.find((c) => c.id === id)));
} else {
  console.log('circuit          length    samples  speed          line use   hairpins  lap         separation');
  for (const circuit of CIRCUITS) report(circuit);
}