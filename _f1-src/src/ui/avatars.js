/**
 * Procedural driver avatars.
 *
 * Real driver photographs are licensed and not redistributable, so these are
 * generated instead: a helmet, in the driver's team colours, with a visor and a
 * design pattern seeded from their three-letter code. The same driver always gets
 * the same helmet, so it works as an identifier rather than as decoration.
 *
 * Drawn as inline SVG so they scale, theme and cost nothing to load, and so they
 * work on a canvas the game already renders into.
 *
 * The number generator is the same one the rest of the project uses, so the
 * avatars are deterministic across sessions.
 */

import { createRandom } from '../util/math.js';

/** Seed a generator from a string, so each code gets its own stable helmet. */
function seedFrom(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Number to hex, for building colour variants. */
function hex(value) {
  return `#${Math.max(0, Math.min(0xffffff, value | 0)).toString(16).padStart(6, '0')}`;
}

/** Lighten or darken a packed colour. */
function shade(colour, amount) {
  const r = (colour >> 16) & 0xff;
  const g = (colour >> 8) & 0xff;
  const b = colour & 0xff;
  const mix = amount > 0 ? 255 : 0;
  const t = Math.abs(amount);
  return (
    ((r + (mix - r) * t) << 16) |
    ((g + (mix - g) * t) << 8) |
    (b + (mix - b) * t)
  );
}

/**
 * A driver's helmet as SVG markup.
 *
 * @param {object} driver needs `short`, `colour` and optionally `accent`
 * @param {object} [options]
 * @param {number} [options.size] px
 * @param {boolean} [options.monochrome] drop the livery, for small sizes
 */
export function driverAvatar(driver, { size = 64, monochrome = false } = {}) {
  const random = createRandom(seedFrom(driver.short ?? 'X'));
  const base = monochrome ? 0x9aa3ad : driver.colour ?? 0x6b7280;
  const accent = monochrome ? 0x6b7280 : driver.accent ?? 0xffffff;

  // Three pattern families. Picked per driver so the grid reads as individuals
  // rather than as one helmet recoloured.
  const pattern = Math.floor(random() * 3);

  const shell = hex(base);
  const shellDark = hex(shade(base, -0.35));
  const shellLight = hex(shade(base, 0.28));
  const stripe = hex(accent);

  // Visor: a wide band across the front, with a highlight.
  const visor = hex(0x11151c);
  const visorGlow = hex(shade(base, -0.7));

  const id = `a${seedFrom(driver.short ?? 'X').toString(36)}`;

  let decoration = '';
  if (pattern === 0) {
    // Central stripe.
    decoration = `<path d="M32 6 L40 6 L38 30 L26 30 Z" fill="${stripe}" opacity="0.9"/>`;
  } else if (pattern === 1) {
    // Twin side flashes.
    decoration =
      `<path d="M14 14 L21 10 L24 30 L17 34 Z" fill="${stripe}" opacity="0.85"/>` +
      `<path d="M50 14 L43 10 L40 30 L47 34 Z" fill="${stripe}" opacity="0.85"/>`;
  } else {
    // Chevron across the crown.
    decoration = `<path d="M20 8 L32 22 L44 8 L48 12 L32 30 L16 12 Z" fill="${stripe}" opacity="0.8"/>`;
  }

  return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" role="img" aria-label="${escapeXml(
    driver.name ?? driver.short
  )}" class="avatar">
  <defs>
    <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${shellLight}"/>
      <stop offset="60%" stop-color="${shell}"/>
      <stop offset="100%" stop-color="${shellDark}"/>
    </linearGradient>
    <linearGradient id="${id}v" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="${visorGlow}"/>
      <stop offset="45%" stop-color="${visor}"/>
      <stop offset="100%" stop-color="${visor}"/>
    </linearGradient>
    <clipPath id="${id}c"><circle cx="32" cy="32" r="29"/></clipPath>
  </defs>
  <g clip-path="url(#${id}c)">
    <circle cx="32" cy="32" r="29" fill="url(#${id}g)"/>
    ${decoration}
    <path d="M6 28 L58 28 L58 40 L6 40 Z" fill="url(#${id}v)"/>
    <path d="M12 30 L26 30 L20 33 Z" fill="#ffffff" opacity="0.22"/>
    <rect x="2" y="46" width="60" height="18" fill="#0d1017" opacity="0.9"/>
  </g>
  <circle cx="32" cy="32" r="29" fill="none" stroke="${shellLight}" stroke-width="1.5" opacity="0.5"/>
  <text x="32" y="59" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13"
        font-weight="700" fill="#e8ecf2">${escapeXml(driver.short ?? '?')}</text>
</svg>`;
}

/**
 * A team badge: the team's colours as a simple mark.
 *
 * Deliberately not a logo. Team logos are trademarked, and a generic lozenge in the
 * team colours identifies them just as well for the purpose here.
 */
export function teamBadge(team, colour, size = 28) {
  const id = `t${seedFrom(team).toString(36)}`;
  return `<svg viewBox="0 0 32 32" width="${size}" height="${size}" role="img" aria-label="${escapeXml(team)}" class="badge">
  <defs>
    <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${hex(shade(colour, 0.2))}"/>
      <stop offset="100%" stop-color="${hex(shade(colour, -0.3))}"/>
    </linearGradient>
  </defs>
  <path d="M16 2 L29 9 L29 23 L16 30 L3 23 L3 9 Z" fill="url(#${id}s)"/>
  <path d="M16 2 L29 9 L16 16 L3 9 Z" fill="#ffffff" opacity="0.18"/>
  <path d="M16 2 L29 9 L29 23 L16 30 L3 23 L3 9 Z" fill="none"
        stroke="${hex(shade(colour, 0.45))}" stroke-width="1.2"/>
</svg>`;
}

function escapeXml(value) {
  return String(value).replace(/[<>&"']/g, (character) => {
    switch (character) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      default: return '&#39;';
    }
  });
}