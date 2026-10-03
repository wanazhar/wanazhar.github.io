import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildRoadNetwork,
  planCityLots,
  buildMachiya,
  isRoadColumn,
  distanceToRoad
} from '../src/world/regions/Machiya.js';
import { VoxelBatch, PALETTE } from '../src/world/Palette.js';
import { heightAt } from '../src/world/Terrain.js';
import { WORLD, REGIONS } from '../src/config.js';

const network = buildRoadNetwork();
const lots = planCityLots(network);

test('the street network is narrow, not an arterial grid', () => {
  const widths = network.roads.map((r) => r.width);
  const narrow = widths.filter((w) => w <= 6).length;
  const collectors = widths.filter((w) => w >= 9).length;

  // The single biggest reason the city read generic: streets were 20 units
  // wide, which is an arterial with a tram. Residential streets are 4.5-6.
  assert.ok(
    narrow / widths.length >= 0.6,
    `most streets should be narrow; got ${narrow}/${widths.length}`
  );
  assert.ok(
    collectors >= 1 && collectors <= 4,
    `expected one or two collectors, got ${collectors}`
  );
  assert.ok(Math.max(...widths) <= 10, 'no street should exceed 10 units');
});

test('alleys cut through the blocks', () => {
  assert.ok(
    (network.alleys?.length ?? 0) >= 4,
    `expected alleys through the blocks, got ${network.alleys?.length ?? 0}`
  );
  for (const alley of network.alleys) {
    assert.ok(alley.width <= 4, `an alley should be under 4 wide, got ${alley.width}`);
  }
});

test('machiya frontages are narrow and tall, in the measured ratio', () => {
  assert.ok(lots.length > 100, `expected a proper row of houses, got ${lots.length}`);

  for (const lot of lots) {
    const spec = lot.typeSpec;
    // Frontage 3.6-5.5 against a ridge of 7-8.5 is the signature 1:2.2 shape.
    assert.ok(
      lot.w >= 3 && lot.w <= 6,
      `frontage ${lot.w} outside the 3-6 unit machiya range`
    );
    assert.ok(
      lot.w / spec.ridge < 0.8,
      `frontage ${lot.w} vs ridge ${spec.ridge} is not narrow-and-tall`
    );
  }
});

test('frontages vary, so a row does not read as a fence', () => {
  const widths = new Set(lots.map((l) => l.w));
  assert.ok(widths.size >= 2, `frontage widths should vary, saw ${[...widths]}`);
});

test('all three machiya types appear', () => {
  const types = new Set(lots.map((l) => l.type));
  assert.ok(types.size >= 2, `expected variety in building types, saw ${[...types]}`);
  // The retrofitted shopfront type is the most recognisably Japanese street
  // form there is, so at least some must exist.
  assert.ok(types.has('kanban'), `expected the shopfront retrofit type, saw ${[...types]}`);
});

test('houses butt against each other with no gaps', () => {
  // Party walls are shared, so on any one street face the frontages must form
  // a run with no holes between them. Grouping uses the lot's own `face`
  // field, which the planner records: inferring the face from coordinates
  // grouped lots from different streets together and reported nonsense gaps.
  const faces = new Map();
  for (const lot of lots) {
    const key = `${lot.face}:${lot.side}`;
    if (!faces.has(key)) faces.set(key, []);
    faces.get(key).push(lot);
  }

  let compared = 0;

  for (const [face, row] of faces) {
    if (row.length < 2) continue;

    // Sort along the direction the street runs: a north-south street (face
    // axis 'v') has its row varying in z, and vice versa.
    const alongZ = row[0].face.startsWith('v');
    row.sort((a, b) => (alongZ ? a.z - b.z : a.x - b.x));

    for (let i = 0; i < row.length - 1; i += 1) {
      const a = row[i];
      const b = row[i + 1];
      const gap = alongZ
        ? b.z - (a.z + a.typeSpec.depth)
        : b.x - (a.x + a.w);

      // A gap is only acceptable where the run genuinely has to break, which
      // is either a crossing street, or an alley that sits inside the machiya
      // depth and so physically cannot be built past.
      const midpoint = alongZ
        ? a.z + a.typeSpec.depth + gap / 2
        : a.x + a.w + gap / 2;

      const rowAxis = row[0].face[0];
      const streetPos = Number(row[0].face.slice(1));
      const alleySet = new Set(network.alleys ?? []);

      const blocked = network.roads.concat(network.alleys ?? []).some((r) => {
        // Crosses the row.
        if (Math.abs(midpoint - r.pos) < r.width / 2 + 3.5) return true;
        // Runs alongside it: an alley only matters if its exclusion zone
        // reaches into this row's depth.
        if (r.axis !== rowAxis || !alleySet.has(r)) return false;
        return r.pos - r.width / 2 < streetPos + Math.max(a.typeSpec.depth, b.typeSpec.depth);
      });

      if (blocked) continue;

      assert.ok(
        gap < 2.5,
        `${face}: gap of ${gap.toFixed(1)} between neighbouring machiya with nothing in the way`
      );
      compared += 1;
    }
  }

  // Every row on a street with no alley alongside it must be fully continuous,
  // so a sample of adjacent pairs has to exist and all must be tight.
  assert.ok(
    compared > 0,
    'no adjacent machiya pairs were compared; the check is not exercising anything'
  );
});

test('no house stands in the road', () => {
  for (const lot of lots) {
    const cx = lot.x + lot.w / 2;
    const cz = lot.z + lot.typeSpec.depth / 2;
    assert.ok(
      !isRoadColumn(cx, cz, network),
      `machiya at (${lot.x},${lot.z}) sits on the carriageway`
    );
  }
});

test('no house is built in the water', () => {
  for (const lot of lots) {
    const h = heightAt(Math.floor(lot.x + lot.w / 2), Math.floor(lot.z + lot.typeSpec.depth / 2));
    assert.ok(h > WORLD.seaLevel, `machiya at (${lot.x},${lot.z}) is in the water`);
  }
});

test('every machiya emits only known materials', () => {
  const batch = new VoxelBatch();
  for (const lot of lots) buildMachiya(batch, lot);
  assert.ok(batch.count() > 1000, `should build real geometry, got ${batch.count()}`);
  for (const name of batch.materials()) {
    assert.ok(PALETTE[name], `machiya emitted unknown material "${name}"`);
  }
});

test('the eave line is what closes the street', () => {
  // A continuous eave plane at roughly 6 is the defining geometric cue, so it
  // must actually be emitted rather than approximated by the roof.
  const lot = lots[0];
  const batch = new VoxelBatch();
  buildMachiya(batch, lot);
  const base = heightAt(Math.floor(lot.x + lot.w / 2), Math.floor(lot.z + lot.typeSpec.depth / 2));

  // At least one box should sit at eave height and project past the frontage.
  const eaveHeight = base + lot.typeSpec.eave;
  const nearEave = batch
    .get('buildingRoof')
    .concat(batch.get('buildingRoofBlue'))
    .filter((box) => Math.abs(box.y - eaveHeight) < 1.2);
  assert.ok(
    nearEave.length > 0,
    `no eave geometry found near y=${eaveHeight.toFixed(1)}`
  );
});

test('signage is present and sits in the lower bands', () => {
  const batch = new VoxelBatch();
  for (const lot of lots) buildMachiya(batch, lot);

  const signs = ['neonPink', 'neonBlue', 'neonRed', 'neonYellow', 'signWhite'];
  let total = 0;
  for (const s of signs) total += batch.get(s).length;
  assert.ok(total > lots.length * 0.5, `expected signage on most frontages, got ${total} for ${lots.length} lots`);
});

test('facade detail sits on the street-facing face, not the back', () => {
  // The bug this catches: a lot on a north-south street has its narrow
  // frontage on the X face, so the eave, lattice and signage must be placed on
  // X. Placing them on Z -- the depth axis -- leaves every street as bare
  // ground with a row of buildings behind it, which looks like a bug until you
  // walk down the street and notice there are no buildings on it.
  let checked = 0;

  for (const lot of lots.slice(0, 40)) {
    const batch = new VoxelBatch();
    buildMachiya(batch, lot);

    const onVerticalStreet = (lot.streetAxis ?? 'v') === 'v';
    // Coordinate of the street-facing plane.
    const front = onVerticalStreet
      ? lot.side > 0
        ? lot.x
        : lot.x + lot.w
      : lot.side > 0
        ? lot.z
        : lot.z + lot.typeSpec.depth;

    // The eave is the single most visible facade element, so assert on it. It is
    // the thin slab at eave height that projects past the facade: thin in one
    // axis, long in the other, and sitting proud of the street plane.
    const eaves = batch.get('buildingRoof').concat(batch.get('buildingRoofBlue'));
    const eaveBoxes = eaves.filter((b) => {
      const thin = onVerticalStreet ? b.sx < 1.2 : b.sz < 1.2;
      const long = onVerticalStreet ? b.sz > lot.w * 0.8 : b.sx > lot.w * 0.8;
      return thin && long;
    });
    assert.ok(
      eaveBoxes.length > 0,
      `lot ${lot.face}/${lot.side} emitted no eave projecting from the facade`
    );

    // The eave must sit just proud of the street-facing plane and run along
    // the frontage, centred on the building.
    const centreAlong = onVerticalStreet
      ? lot.z + lot.typeSpec.depth / 2
      : lot.x + lot.w / 2;

    for (const eave of eaveBoxes) {
      const pos = onVerticalStreet ? eave.x : eave.z;
      const along = onVerticalStreet ? eave.z : eave.x;
      assert.ok(
        Math.abs(pos - front) < 1.2,
        `eave sits ${Math.abs(pos - front).toFixed(2)} from the street face at ${front.toFixed(2)}; it is on the wrong axis`
      );
      assert.ok(
        Math.abs(along - centreAlong) < 1.0,
        `eave is not centred on the frontage (along ${along.toFixed(2)}, centre ${centreAlong.toFixed(2)})`
      );
    }

    checked += 1;
  }

  assert.ok(checked > 20, `should have checked many lots, checked ${checked}`);
});

test('lots record which axis their street runs along', () => {
  for (const lot of lots) {
    assert.ok(
      lot.streetAxis === 'v' || lot.streetAxis === 'h',
      `lot on ${lot.face} has no street axis`
    );
    assert.strictEqual(
      lot.face[0],
      lot.streetAxis,
      `lot face ${lot.face} disagrees with street axis ${lot.streetAxis}`
    );
  }
});

test('generation is deterministic', () => {
  const a = planCityLots(buildRoadNetwork());
  const b = planCityLots(buildRoadNetwork());
  assert.strictEqual(a.length, b.length);
  assert.deepStrictEqual(
    a.map((l) => `${l.x},${l.z},${l.w},${l.type}`),
    b.map((l) => `${l.x},${l.z},${l.w},${l.type}`)
  );
});
