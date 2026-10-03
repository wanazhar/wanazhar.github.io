import { WORLD, SEED, REGIONS } from '../../config.js';
import { BIOMES, heightAt, biomeAt, cellJitter, onBridge } from '../Terrain.js';
import { hash2, mulberry32 } from '../../util/rng.js';
import { addTree } from './Trees.js';

// Machiya row construction.
//
// The previous city read generic for one reason above all: the street was far
// too wide. A Japanese neighbourhood street is a narrow slot with a continuous
// wall on both sides, not a corridor between detached objects. Measured
// targets, at one world unit per metre:
//
//   machiya frontage   3.6-5.5 wide  (2-3 ken), 12-13 deep
//   machiya height     ~8 to the ridge, 2 storeys
//   eaves              ~6, projecting 0.8, one continuous straight line
//   roof pitch         22-27 degrees. Shallow. A steep roof reads as a chalet.
//   street width       4.5-5.5, one 8-10 collector, alleys 3-4
//   roji alley         under 1.8 wide, eaves overhanging from both sides
//
// The signature is the RATIO: a 3.6-wide, 8-tall building is 1:2.2. So the
// buildings here are narrow and tall, butted party-wall to party-wall with no
// gaps and no setback from the street.
//
// What survives low poly, and what does not, follows a simple rule: anything
// under about a quarter unit becomes a colour field rather than geometry. So
// the lattice is one dark recessed plane, not individual bars; the sign is a
// saturated box, never glyphs.

// ---------------------------------------------------------------------------
// Vertical bands.
//
// The reason a Japanese street reads as crowded but ordered is that every piece
// of clutter lives in one horizontal stratum. Bands 2 and 3 carry all the
// detail; band 4 (4.5 to 6) is nearly empty. Spread detail evenly up a facade
// and it reads as noise instead.
// ---------------------------------------------------------------------------
export const BAND = {
  plinth: [0, 0.3],
  ground: [0.3, 2.4],
  signage: [2.5, 4.5],
  upper: [4.5, 6.0],
  eave: 6.0
};

// Two machiya families. The low one has a 1.5-1.8m second floor you cannot
// stand in, which puts its eave line lower; the tall one has full-height
// storeys and glazed windows. Two discrete heights stop a row being a slab.
const TYPES = [
  { id: 'tsushinikai', eave: 5.4, ridge: 7.0, lattice: true, glazed: false, depth: 12 },
  { id: 'sounikai', eave: 6.4, ridge: 8.4, lattice: true, glazed: true, depth: 13 },
  // The 1960s-80s retrofit: a modern glazed shopfront under an Edo roof. The
  // contrast of a glowing ground floor beneath a tiled roof is the most
  // recognisably Japanese street typology there is.
  { id: 'kanban', eave: 6.0, ridge: 8.0, lattice: false, glazed: false, shop: true, depth: 12 }
];

export const SIGN_COLOURS = ['neonPink', 'neonBlue', 'neonRed', 'neonYellow', 'signWhite'];

// A lot: a narrow frontage on a street, with a depth running into the block.
// `face` records which street edge it fronts onto, so tests can group lots by
// the run they belong to rather than guessing from coordinates.
export function makeLot(x, z, frontage, type, seed, side, face = null, streetAxis = 'v') {
  return {
    x,
    z,
    w: frontage,
    d: type.depth,
    kind: 'machiya',
    type: type.id,
    typeSpec: type,
    side,
    face,
    // Which axis the street runs along. 'v' means the street runs north-south,
    // so the frontage is the narrow X face; 'h' means it is the narrow Z face.
    // Getting this backwards puts the entire facade on the back of the building.
    streetAxis,
    seed
  };
}

// ---------------------------------------------------------------------------
// Street network
// ---------------------------------------------------------------------------

// Alleys cut through the blocks. An alley is perpendicular to the street it
// serves and lies strictly BETWEEN two roads, never overlapping one: placing
// them on the same axis as the roads produced overlapping exclusion zones that
// starved the machiya rows, leaving 55-unit holes down the middle of streets.
export function buildRoadNetwork() {
  const rect = REGIONS.city.rect;

  // Block pitch. Two consecutive buildings are 3.7-5.4 wide, and a machiya
  // row needs at least two frontages plus an alley between it and the next
  // street. A 17-unit pitch gives roughly 9 usable units between kerbs, which
  // fits two houses but leaves no room for an alley; 22 gives room for both.
  const PITCH_X = 22;
  const PITCH_Z = 22;
  const ALLEY_WIDTH = 3;
  const CLEARANCE = 1.5;

  // Vertical streets: mostly narrow, with one collector.
  const verticals = [];
  for (let x = rect.x0 + 10; x < rect.x1 - 10; x += PITCH_X) {
    const isCollector = verticals.length === 2;
    verticals.push({ axis: 'v', pos: Math.round(x), width: isCollector ? 9 : 5 });
  }

  const horizontals = [];
  for (let z = rect.z0 + 10; z < rect.z1 - 10; z += PITCH_Z) {
    const isCollector = horizontals.length === 2;
    horizontals.push({ axis: 'h', pos: Math.round(z), width: isCollector ? 9 : 5 });
  }

  const roads = [...verticals, ...horizontals];
  const avenues = roads.filter((r) => r.width >= 9);

  // One alley per block, running north-south through the middle of the space
  // between two vertical streets. It sits wholly inside the block it cuts,
  // which is what stops it colliding with the roads' own exclusion zones.
  const alleys = [];
  for (let i = 0; i < verticals.length - 1; i += 1) {
    const left = verticals[i].pos + verticals[i].width / 2;
    const right = verticals[i + 1].pos - verticals[i + 1].width / 2;
    const usable = right - left;
    // Room for two frontages plus the alley and its clearances.
    if (usable < 3.7 + ALLEY_WIDTH + CLEARANCE + 3.7) continue;
    const mid = (left + right) / 2;

    for (let j = 0; j < horizontals.length - 1; j += 1) {
      const top = horizontals[j].pos + horizontals[j].width / 2;
      const bottom = horizontals[j + 1].pos - horizontals[j + 1].width / 2;
      alleys.push({ axis: 'v', pos: Math.round(mid), width: ALLEY_WIDTH, from: Math.round(top), to: Math.round(bottom) });
    }
  }

  return { roads, avenues, alleys, verticals, horizontals };
}

export function isRoadColumn(x, z, network) {
  for (const road of network.roads) {
    const half = road.width / 2;
    if (road.axis === 'v' && Math.abs(x - road.pos) <= half) return true;
    if (road.axis === 'h' && Math.abs(z - road.pos) <= half) return true;
  }
  for (const alley of network.alleys ?? []) {
    const half = alley.width / 2;
    if (alley.axis === 'v' && Math.abs(x - alley.pos) <= half && z >= alley.from && z <= alley.to) return true;
    if (alley.axis === 'h' && Math.abs(z - alley.pos) <= half && x >= alley.from && x <= alley.to) return true;
  }
  return false;
}

export function distanceToRoad(x, z, network) {
  let best = Infinity;
  for (const road of network.roads) {
    const d = road.axis === 'v' ? Math.abs(x - road.pos) : Math.abs(z - road.pos);
    best = Math.min(best, d);
  }
  return best;
}

// ---------------------------------------------------------------------------
// Lot planning: a continuous row of narrow frontages on each side of each
// street, party walls touching, no gaps.
// ---------------------------------------------------------------------------

// The streets a row running along `alongAxis` must break around. A row on a
// north-south street runs along z, so it has to stop at east-west streets --
// the perpendicular axis, not its own.
function crossStreetsFor(network, alongAxis) {
  const perpendicular = alongAxis === 'v' ? 'h' : 'v';
  const positions = [];
  for (const road of network.roads) {
    if (road.axis !== perpendicular) continue;
    positions.push({ pos: road.pos, half: road.width / 2 + 1.5 });
  }
  for (const alley of network.alleys ?? []) {
    if (alley.axis !== perpendicular) continue;
    positions.push({ pos: alley.pos, half: alley.width / 2 + 1.5 });
  }
  return positions.sort((a, b) => a.pos - b.pos);
}

// True when a frontage starting at `cursor` would cross a perpendicular street.
function wouldCrossCrossStreet(crossings, cursor, frontage) {
  const near = cursor + frontage / 2;
  return crossings.some((c) => near > c.pos - c.half && near < c.pos + c.half);
}

export function planCityLots(network) {
  const rect = REGIONS.city.rect;
  const rng = mulberry32(SEED + 2002);
  const lots = [];

  const groundOk = (x, z) => heightAt(x, z) > WORLD.seaLevel;

  // Frontage widths: two-ken mostly, three-ken occasionally. Never uniform --
  // that variation is what stops the row reading as a fence.
  const pickFrontage = () => (rng() < 0.3 ? 5.4 : 3.7);

  for (const road of network.roads) {
    const along = road.axis;
    const from = road.axis === 'v' ? rect.z0 : rect.x0;
    const to = road.axis === 'v' ? rect.z1 : rect.x1;

    // Perpendicular streets and alleys this row has to break around.
    const crossings = crossStreetsFor(network, along);

    for (const side of [-1, 1]) {
      let cursor = from + 2;
      while (cursor < to - 3) {
        const w = pickFrontage();
        if (cursor + w > to) break;

        // Break the row at every intersection, leaving the corner open. Find
        // the nearest blocking street ahead and jump the cursor past it, rather
        // than advancing by one frontage -- which repeatedly retried the same
        // blocked span and starved later stretches of the row (one street ended
        // up with a single house while its neighbour had 29).
        const blocking = crossings.find(
          (c) => cursor + w > c.pos - c.half && cursor < c.pos + c.half
        );
        if (blocking) {
          cursor = Math.max(cursor + w, blocking.pos + blocking.half);
          continue;
        }

        // The wall face sits ON the road boundary: no setback at all.
        const wallX = road.axis === 'v' ? road.pos + side * (road.width / 2) : cursor;
        const wallZ = road.axis === 'v' ? cursor : road.pos + side * (road.width / 2);

        const type = TYPES[Math.floor(rng() * TYPES.length)];
        const d = type.depth;

        // Depth runs back into the block, away from the street.
        const lx = road.axis === 'v' ? (side > 0 ? wallX : wallX - d) : wallX;
        const lz = road.axis === 'h' ? (side > 0 ? wallZ : wallZ - d) : wallZ;

        const cx = lx + w / 2;
        const cz = lz + d / 2;
        if (groundOk(cx, cz) && groundOk(lx + 1, lz + 1)) {
          // Reject a lot only if it runs *across* a carriageway, which would
          // leave a house standing in the middle of the road. The face it turns
          // towards sits flush against its own street by design, so the front
          // edge is deliberately allowed to touch; only the depth is tested.
          let clear = true;
          for (let sx = lx + 0.5; sx <= lx + w - 0.5 && clear; sx += Math.max(1, w / 3)) {
            for (let sz = lz + 0.5; sz <= lz + d - 0.5 && clear; sz += Math.max(1, d / 3)) {
              // Skip the strip in front of this lot's own frontage.
              const inFrontOfOwnStreet =
                road.axis === 'v'
                  ? side > 0
                    ? sx > lx + w - 1.5
                    : sx < lx + 1.5
                  : side > 0
                    ? sz > lz + d - 1.5
                    : sz < lz + 1.5;
              if (inFrontOfOwnStreet) continue;
              if (isRoadColumn(sx, sz, network)) clear = false;
            }
          }
          if (clear) {
            lots.push(
              makeLot(
                lx,
                lz,
                w,
                type,
                Math.floor(rng() * 1e6),
                side,
                `${road.axis}${road.pos}`,
                road.axis
              )
            );
          }
        }

        cursor += w;
      }
    }
  }

  return lots;
}

// ---------------------------------------------------------------------------
// Building geometry
// ---------------------------------------------------------------------------

const ROUND = 'rounded';
const SLAB = 'block';

export function buildMachiya(batch, lot) {
  const t = lot.typeSpec ?? TYPES[0];
  const rng = mulberry32(lot.seed);
  const base = heightAt(lot.x + lot.w / 2, lot.z + t.depth / 2);

  const w = lot.w;
  const d = t.depth;
  const cx = lot.x + w / 2;
  const cz = lot.z + d / 2;

  // Where the facade is, and which way it looks out towards the street.
  //
  // This is axis-sensitive and getting it wrong is invisible until you look:
  // a lot on a north-south street has its narrow frontage on the X face, so the
  // entire facade, eave, lattice and signage must be placed on X. The first
  // version always used Z, which put every detail on the back of the building
  // and left each street as bare ground.
  const onVerticalStreet = (lot.streetAxis ?? 'v') === 'v';
  // `front` is the coordinate of the street-facing plane; `outward` is the sign
  // of the direction that plane faces as it approaches the street.
  const front = onVerticalStreet ? (lot.side > 0 ? lot.x : lot.x + w) : lot.side > 0 ? lot.z : lot.z + d;
  const outward = lot.side > 0 ? -1 : 1;

  // The coordinate that runs ALONG the street, i.e. the axis the frontage
  // spans. On a north-south street the frontage is the narrow X face, so the
  // span runs along Z at cz; on an east-west street it runs along X at cx.
  // Passing cx unconditionally is the same class of axis bug as before, and
  // puts every piece of facade detail at the wrong end of the building.
  const alongCentre = onVerticalStreet ? cz : cx;

  // Places something on the facade, `offset` units proud of it.
  const onFacade = (material, along, y, offset, spanW, h, thick, options = {}) => {
    if (onVerticalStreet) {
      // Facade plane is X; the detail extends along Z and is `thick` deep in X.
      batch.add(material, front + outward * offset, y, along, thick, h, spanW, options);
    } else {
      // Facade plane is Z; the detail extends along X and is `thick` deep in Z.
      batch.add(material, along, y, front + outward * offset, spanW, h, thick, options);
    }
  };

  // Ground floor: a shallow recess creates a shadow line at human height,
  // which is one of the cheapest ways to stop a facade reading as a flat plane.
  const body = t.shop ? 'buildingWall' : rng() < 0.4 ? 'buildingWallWood' : 'buildingWall';
  batch.add(body, cx, base + 1.2, cz, w, 2.4, d, { shape: ROUND });

  // Dark plinth. A slightly darker skirting grounds the building.
  batch.add('stoneDark', cx, base + 0.15, cz, w + 0.1, 0.3, d + 0.1, { shape: SLAB });

  // Upper floor, set back a touch on the tsushinikai type so the eave below
  // still reads.
  const upperInset = t.id === 'tsushinikai' ? 0.15 : 0;
  const upperBase = base + 2.4;
  const upperH = t.eave - 2.4;
  batch.add(body, cx, upperBase + upperH / 2, cz, w - upperInset * 2, upperH, d - upperInset * 2, { shape: ROUND });

  // ---- kōshi lattice: one dark recessed plane, not individual bars. Real
  // bars are 3cm at a 3-4.5cm pitch, which is far below a voxel and reads as
  // grey mush. The presence, the height band and the colour are what survive.
  if (t.lattice) {
    // 紅殻格子: dark iron-oxide red-brown, near-black in shade.
    onFacade('shrineWoodDark', alongCentre, base + 1.25, 0.16, w - 0.7, 1.9, 0.12);
    // Three chunky ribs, which is the most the eye can resolve.
    for (let i = -1; i <= 1; i += 1) {
      onFacade('woodPost', alongCentre + i * (w * 0.26), base + 1.25, 0.22, 0.14, 1.9, 0.14);
    }
    // 出格子: the lattice projects in front of the facade on small stone feet.
    // A second vertical plane half a metre proud is what makes a machiya street
    // feel soft rather than planar.
    onFacade('shrineWoodDark', alongCentre, base + 0.1, 0.4, w - 0.7, 0.2, 0.5);
  }

  // Ground-floor glazing for the retrofitted shop type.
  if (t.shop) {
    onFacade('window', alongCentre, base + 1.35, 0.2, w - 0.5, 1.9, 0.12);
    onFacade('lampGlass', alongCentre, base + 0.5, 0.3, w - 1.2, 0.5, 0.06);
    // Fascia band at 3.2-3.8, carrying the big sign.
    onFacade('signWhite', alongCentre, base + 3.5, 0.2, w + 0.2, 1.1, 0.3);
  }

  // ---- mushiko-mado: a small dark rectangle high in the second floor wall.
  // The basket weave is invisible at distance; the dark rectangle is not.
  if (t.glazed) {
    for (let i = -1; i <= 1; i += 1) {
      onFacade('window', alongCentre + i * (w * 0.28), base + 4.4, 0.1, 0.9, 1.1, 0.1);
    }
  } else {
    onFacade('shrineWoodDark', alongCentre, base + t.eave - 1.1, 0.1, 0.6, 0.7, 0.1);
  }

  // ---- the eave. This is the defining geometric cue: a perfectly straight,
  // unadorned horizontal line, projecting about 0.8, running the whole
  // frontage. Neighbours overlap slightly, which is deliberate.
  const eaveProject = 0.8;
  onFacade('buildingRoof', alongCentre, base + t.eave + 0.2, eaveProject * 0.5, w + 0.3, 0.35, eaveProject);
  // A darker fascia under it, so the line has an edge.
  onFacade('buildingRoofBlue', alongCentre, base + t.eave - 0.05, eaveProject * 0.5, w + 0.34, 0.2, eaveProject + 0.1);

  // Roof: a shallow prism. 22-27 degrees, so rise over run is small.
  const roofRise = (d / 2) * 0.42;
  const ridgeY = base + t.ridge;
  batch.add('buildingRoof', cx, base + t.eave + 0.45, cz - d * 0.22, w + 0.6, 0.3, d * 0.56, { shape: SLAB });
  batch.add('buildingRoof', cx, base + t.eave + 0.45, cz + d * 0.22, w + 0.6, 0.3, d * 0.56, { shape: SLAB });
  batch.add('buildingRoofBlue', cx, (base + t.eave + ridgeY) / 2, cz, w + 0.7, ridgeY - base - t.eave, 0.9, { shape: SLAB });

  // ---- noren: a split fabric curtain in the doorway.
  if (rng() < 0.3 || t.shop) {
    for (let i = -1; i <= 1; i += 1) {
      onFacade(i === 0 ? 'clothRed' : 'clothCream', alongCentre + i * 0.32, base + 2.0, 0.3, 0.3, 0.7, 0.06);
    }
    onFacade('woodPost', alongCentre, base + 2.5, 0.3, w - 0.8, 0.12, 0.12);
  }

  // ---- signage, in three stacked bands between 0 and 6.5. This is the single
  // highest value-per-vertex detail in the whole street.
  const signColour = SIGN_COLOURS[lot.seed % SIGN_COLOURS.length];
  if (rng() < 0.55) {
    // Band 3: a projecting sodate-kanban, 1:2 aspect, projecting up to 1.0.
    const sy = base + 2.9 + rng() * 0.6;
    onFacade('signWhite', alongCentre, sy, 0.55, 0.7, 1.4, 0.14);
    onFacade(signColour, alongCentre, sy, 0.65, 0.5, 1.1, 0.06);
    // A thin bracket, because a sign with no bracket reads as a floating box.
    onFacade('metalDark', alongCentre, sy + 0.7, 0.28, 0.1, 0.1, 0.55);
  }
  if (rng() < 0.3) {
    // A tall vertical sign rising past the eave line.
    const sy = base + 4.6;
    onFacade('signWhite', alongCentre + w * 0.3, sy, 0.5, 0.55, 2.6, 0.12);
    onFacade(signColour, alongCentre + w * 0.3, sy, 0.59, 0.4, 2.3, 0.05);
  }
  // A pole sign on shopfronts, rising well above the roof.
  if (t.shop) {
    batch.add('metalDark', cx, base + t.eave + 2.0, cz, 0.18, 4.0, 0.18, { shape: SLAB });
    batch.add(signColour, cx, base + t.eave + 3.4, cz, w * 0.8, 1.2, 0.3, { shape: SLAB });
  }

  // ---- band 2 and 3 clutter: downpipes, AC units, crates. These live low,
  // between roughly 2 and 4.5, and are what fill the texture.
  const bay = 3.7;
  for (let dx = -d / 2 + 0.4; dx < d / 2 - 0.2; dx += bay) {
    // A downpipe at the bay edge, running vertically on the facade.
    onFacade('metal', alongCentre + dx, base + 2.6, 0.14, 0.16, 2.6, 0.16);
  }
  if (rng() < 0.5) {
    // Outdoor AC condenser, wall mounted at 2-3.5.
    onFacade('metal', alongCentre + (rng() - 0.5) * w * 0.5, base + 3.0, 0.3, 0.8, 0.55, 0.5, { shape: ROUND });
  }
  if (rng() < 0.35) {
    // A crate or bin stack at the wall foot.
    onFacade('crate', alongCentre + (rng() - 0.5) * w * 0.5, base + 0.4, 0.45, 0.7, 0.7, 0.6, { shape: ROUND });
  }

  // ---- onigawara: a small ridge-end block, on some roofs only.
  if (rng() < 0.4) {
    batch.add('metalDark', cx, ridgeY + 0.25, cz + d * 0.42, 0.45, 0.45, 0.45, { shape: SLAB });
  }

  return { base, eave: base + t.eave, ridge: ridgeY, front, outward, onVerticalStreet, cx, cz };
}
