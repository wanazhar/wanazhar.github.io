/**
 * Every name a module calls is a name that module has.
 *
 * `Game.js` called `damageFraction` on every frame of every session, and `buildCockpit` and
 * `steerCockpit` every time the cockpit camera was selected, without importing any of the
 * three. All three exist, all three are exported, and the import lines were simply never
 * written. Nothing in the build notices: a bundler treats an unresolved name as a global
 * rather than an error, so the app built cleanly, and nothing in the suites can construct
 * `Game` to run it, because it owns a WebGL context. The only place those calls execute is a
 * browser, where the first one threw a ReferenceError inside the animation frame callback,
 * took the loop with it, and left the race a blank screen with no error on it.
 *
 * So this reads the source the way the browser has to run it and fails on a call to a name
 * the file neither imports nor defines. It is a scanner rather than a parser, deliberately:
 * it checks *called* names, which is where the invisible failures live, and it knows the
 * globals a browser supplies. A name that is genuinely global and missing from `GLOBALS`
 * shows up as a failure here -- add it there, because nothing else in this repo can tell the
 * difference between it and a typo.
 *
 *   npm test
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const SRC = fileURLToPath(new URL('../src/', import.meta.url));

/** Everything the browser hands a module for free. */
const GLOBALS = new Set(
  `window document navigator screen location history performance console localStorage
   sessionStorage requestAnimationFrame cancelAnimationFrame setTimeout clearTimeout setInterval
   clearInterval queueMicrotask structuredClone fetch btoa atob getComputedStyle matchMedia alert
   ResizeObserver IntersectionObserver MutationObserver Image Path2D DOMParser CustomEvent Event
   MouseEvent KeyboardEvent PointerEvent TouchEvent Touch HTMLElement Element HTMLCanvasElement
   CanvasRenderingContext2D OffscreenCanvas ImageBitmap createImageBitmap WebGLRenderingContext
   WebGL2RenderingContext TextEncoder TextDecoder Blob FileReader URL URLSearchParams AbortController
   DOMMatrix BigInt Date RegExp Function Error RangeError TypeError SyntaxError ReferenceError
   Math JSON Object Array Number String Boolean Symbol Proxy Reflect Promise Set Map WeakMap WeakSet
   Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array
   Float64Array ArrayBuffer DataView Infinity NaN undefined globalThis isFinite isNaN parseFloat
   parseInt encodeURIComponent decodeURIComponent eval this super true false null arguments`
    .split(/\s+/)
    .filter(Boolean)
);

/** Words that can be followed by `(` without being a call to anything. */
const KEYWORDS = new Set(
  `if else for while do switch case default break continue return throw try catch finally
   function class extends new delete void typeof instanceof in of yield await async
   import export from const let var get set static super this
   true false null undefined`
    .split(/\s+/)
    .filter(Boolean)
);

function sourceFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) files.push(...sourceFiles(path));
    else if (path.endsWith('.js')) files.push(path);
  }
  return files;
}

/*
 * The source with comments and literals blanked out.
 *
 * Blanked, not removed: every character is replaced by a space and every newline is kept, so
 * an index into this string is the same index in the file and a reported line number is the
 * line the call is on. Template expressions are kept -- `${badge(team)}` is a real call, and
 * it is exactly the kind of thing that goes untested.
 */
function codeOnly(source) {
  const blank = (text) => text.replace(/[^\n]/g, ' ');
  let out = '';
  let i = 0;
  while (i < source.length) {
    const character = source[i];
    const next = source[i + 1];

    if (character === '/' && next === '/') {
      const end = source.indexOf('\n', i);
      const stop = end === -1 ? source.length : end;
      out += blank(source.slice(i, stop));
      i = stop;
      continue;
    }

    if (character === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2);
      const stop = end === -1 ? source.length : end + 2;
      out += blank(source.slice(i, stop));
      i = stop;
      continue;
    }

    if (character === '/' && startsRegex(source, i)) {
      let j = i + 1;
      let inClass = false;
      while (j < source.length) {
        const c = source[j];
        if (c === '\\') { j += 2; continue; }
        if (c === '[') inClass = true;
        else if (c === ']') inClass = false;
        else if (c === '/' && !inClass) { j += 1; break; }
        else if (c === '\n') break;
        j += 1;
      }
      out += blank(source.slice(i, j));
      i = j;
      continue;
    }

    if (character === '"' || character === "'" || character === '`') {
      let j = i + 1;
      let carried = ' ';
      while (j < source.length) {
        const c = source[j];
        if (c === '\\') { j += 2; continue; }
        if (c === character) { j += 1; break; }
        if (character === '`' && c === '$' && source[j + 1] === '{') {
          let depth = 1;
          let k = j + 2;
          while (k < source.length && depth > 0) {
            const inner = source[k];
            if (inner === '"' || inner === "'" || inner === '`') {
              const quote = inner;
              k += 1;
              while (k < source.length) {
                if (source[k] === '\\') { k += 2; continue; }
                if (source[k] === quote) { k += 1; break; }
                k += 1;
              }
              continue;
            }
            if (inner === '{') depth += 1;
            else if (inner === '}') depth -= 1;
            k += 1;
          }
          carried += ` ${codeOnly(source.slice(j + 2, k - 1))} `;
          j = k;
          continue;
        }
        carried += c === '\n' ? '\n' : ' ';
        j += 1;
      }
      out += carried;
      i = j;
      continue;
    }

    out += character;
    i += 1;
  }
  return out;
}

/** Whether the `/` at `index` opens a regex literal rather than dividing. */
function startsRegex(source, index) {
  const before = source.slice(0, index).trimEnd();
  if (!before) return true;
  const last = before[before.length - 1];
  if ('([{,;=:!&|?+-*%<>~^'.includes(last)) return true;
  return /(?:^|\W)(?:return|typeof|case|in|of|new|delete|void|do|else|yield|await)$/.test(before);
}

/** Every name the file defines, imports, re-exports, takes as a parameter or assigns to. */
function declaredNames(code) {
  const names = new Set();
  const add = (text) => {
    for (const match of text.matchAll(/[A-Za-z_$][\w$]*/g)) names.add(match[0]);
  };

  for (const match of code.matchAll(/\b(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/g)) {
    names.add(match[1]);
  }
  for (const match of code.matchAll(/\b(?:const|let|var)\s*[{[][\s\S]*?[}\]]\s*=/g)) add(match[0]);
  for (const match of code.matchAll(/\bimport\s+([\s\S]*?)\s+from\b/g)) add(match[1]);
  for (const match of code.matchAll(/\bexport\s*\{([^}]*)\}/g)) add(match[1]);
  for (const match of code.matchAll(/(?:^|[^\w$.#])([A-Za-z_$][\w$]*)\s*=(?!=)/g)) names.add(match[1]);
  for (const match of code.matchAll(/(?:^|[^\w$.#])([A-Za-z_$][\w$]*)\s*=>/g)) names.add(match[1]);
  for (const match of code.matchAll(/(?:^|[^\w$.#])([A-Za-z_$][\w$]*)\s*:/g)) names.add(match[1]);

  // Parameters and loop headers: any balanced paren group followed by `=>` or a block.
  for (let i = 0; i < code.length; i += 1) {
    if (code[i] !== '(') continue;
    let depth = 1;
    let j = i + 1;
    while (j < code.length && depth > 0) {
      if (code[j] === '(') depth += 1;
      else if (code[j] === ')') depth -= 1;
      j += 1;
    }
    if (depth !== 0) continue;
    if (/^\s*(=>|\{)/.test(code.slice(j))) add(code.slice(i + 1, j - 1));
  }
  return names;
}

/**
 * Every `name(...)` in the file that is a call rather than a definition.
 *
 * A paren group followed by a block is a method, a getter or a function declaration, and the
 * name before it belongs to the definition; a call is followed by anything else.
 */
function calledNames(code) {
  const calls = [];
  for (const match of code.matchAll(/(?:^|[^\w$.#])([A-Za-z_$][\w$]*)\s*\(/g)) {
    const open = match.index + match[0].length - 1;
    let depth = 1;
    let j = open + 1;
    while (j < code.length && depth > 0) {
      if (code[j] === '(') depth += 1;
      else if (code[j] === ')') depth -= 1;
      j += 1;
    }
    if (depth !== 0) continue;
    if (/^\s*\{/.test(code.slice(j))) continue;
    calls.push({ name: match[1], line: code.slice(0, match.index).split('\n').length });
  }
  return calls;
}

test('no module calls a name it never imports or defines', () => {
  const violations = [];
  for (const file of sourceFiles(SRC)) {
    const code = codeOnly(readFileSync(file, 'utf8'));
    const declared = declaredNames(code);
    for (const call of calledNames(code)) {
      if (declared.has(call.name) || KEYWORDS.has(call.name) || GLOBALS.has(call.name)) continue;
      violations.push(`${relative(SRC, file)}:${call.line} calls ${call.name}()`);
    }
  }

  assert.deepEqual(
    violations,
    [],
    `called but never imported or defined (import it, define it, or add it to GLOBALS):\n  ${violations.join('\n  ')}`
  );
});
