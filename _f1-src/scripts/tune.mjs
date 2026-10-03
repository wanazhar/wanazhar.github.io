// Sweep the base radius of a circuit shape and report lap characteristics.
//   node scripts/tune.mjs            sweep a range
//   node scripts/tune.mjs check      verify the shipped scales only
import { buildTrack } from '../src/track/trackGeometry.js';
import { CIRCUITS } from '../src/track/circuits.js';

const SCALES = [0.56, 0.62, 0.72, 0.75, 0.95, 1.0];

function evaluate(circuit, scale) {
  const probe = { ...circuit };
  const track = buildTrack(probe);
  const speeds = track.samples.map((s) => s.targetSpeed);
  return {
    track,
    length: track.length,
    lap: track.lapRecord,
    vmin: Math.min(...speeds) * 3.6,
    vmax: Math.max(...speeds) * 3.6,
    tight: speeds.filter((v) => v * 3.6 < 120).length / speeds.length,
    lineUse: track.samples.reduce((a, s) => a + Math.abs(s.lineOffset), 0) / track.count
  };
}

const header = ['id', 'scale', 'length', 'lap', 'vmin-vmax', 'corner%', 'line use'];

if (process.argv[2] === 'check') {
  console.log(header.join('       '));
  for (const circuit of CIRCUITS) {
    const r = evaluate(circuit, circuit.scale);
    console.log(
      [
        circuit.id.padEnd(14),
        String(circuit.scale).padEnd(6),
        `${(r.length / 1000).toFixed(2)}km`.padEnd(8),
        `${r.lap.toFixed(1)}s`.padEnd(7),
        `${r.vmin.toFixed(0)}-${r.vmax.toFixed(0)}kph`.padEnd(10),
        `${(r.tight * 100).toFixed(0)}%`.padEnd(10),
        r.lineUse.toFixed(1)
      ].join(' ')
    );
  }
} else {
  for (const circuit of CIRCUITS) {
    for (const scale of SCALES) {
      const r = evaluate(circuit, scale);
      console.log(
        [
          circuit.id.padEnd(14),
          String(scale).padEnd(6),
          `${(r.length / 1000).toFixed(2)}km`.padEnd(8),
          `${r.lap.toFixed(1)}s`.padEnd(7),
          `${r.vmin.toFixed(0)}-${r.vmax.toFixed(0)}kph`.padEnd(10),
          `${(r.tight * 100).toFixed(0)}%`.padEnd(10),
          r.lineUse.toFixed(1)
        ].join(' ')
      );
    }
    console.log('');
  }
}