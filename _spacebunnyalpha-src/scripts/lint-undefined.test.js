// Catches undefined free variables, the class of bug that survives a compile:
// the bundler treats an unknown identifier as a global, so nothing complains
// and it only surfaces as a ReferenceError at runtime.
//
// This uses acorn to build a real scope tree, so class methods, arrow
// closures, destructuring and hoisting are all handled by the parser rather
// than by guesswork.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');

function walkFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walkFiles(full));
    else if (extname(full) === '.js') out.push(full);
  }
  return out;
}

const files = walkFiles(ROOT);

// Anything the runtime provides. Anything not here must be bound in the module.
const GLOBALS = new Set([
  'window', 'document', 'console', 'Math', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean',
  'Set', 'Map', 'WeakMap', 'WeakSet', 'Promise', 'Date', 'Error', 'TypeError', 'RangeError',
  'ReferenceError', 'SyntaxError', 'Symbol', 'RegExp', 'Infinity', 'NaN', 'undefined',
  'Float32Array', 'Float64Array', 'Uint8Array', 'Uint8ClampedArray', 'Int32Array', 'Uint32Array',
  'Intl', 'performance', 'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout',
  'clearTimeout', 'setInterval', 'clearInterval', 'localStorage', 'navigator', 'location',
  'globalThis', 'process', 'structuredClone', 'queueMicrotask', 'ResizeObserver', 'Image',
  'Audio', 'AudioContext', 'fetch', 'URL', 'Blob', 'TextEncoder', 'TextDecoder',
  // three.js is imported by name, but keep these in case a name slips through.
  'WebGLRenderingContext', 'HTMLCanvasElement', 'arguments'
]);

// Collect every binding name introduced inside a node, so we can say whether a
// reference resolves to something in scope.
function collectBound(node, out = new Set()) {
  if (!node || typeof node.type !== 'string') return out;

  switch (node.type) {
    case 'VariableDeclaration':
      for (const decl of node.declarations) collectPattern(decl.id, out);
      break;
    case 'FunctionDeclaration':
    case 'FunctionExpression':
    case 'ArrowFunctionExpression':
      if (node.id) out.add(node.id.name);
      for (const param of node.params) collectPattern(param, out);
      break;
    case 'ClassDeclaration':
    case 'ClassExpression':
      if (node.id) out.add(node.id.name);
      break;
    case 'ImportDeclaration':
      for (const spec of node.specifiers) out.add(spec.local.name);
      break;
    case 'CatchClause':
      if (node.param) collectPattern(node.param, out);
      break;
    case 'RestElement':
      collectPattern(node.argument, out);
      break;
    case 'AssignmentPattern':
      collectPattern(node.left, out);
      break;
    case 'ArrayPattern':
      for (const el of node.elements) collectPattern(el, out);
      break;
    case 'ObjectPattern':
      for (const prop of node.properties) {
        if (prop.type === 'RestElement') collectPattern(prop.argument, out);
        else collectPattern(prop.value, out);
      }
      break;
    case 'Property':
      if (node.value) collectPattern(node.value, out);
      break;
    default:
      break;
  }
  return out;
}

function collectPattern(node, out) {
  if (!node) return;
  if (node.type === 'Identifier') out.add(node.name);
  else collectBound(node, out);
}

// The node the reference sits in, which may be nested inside blocks. Block
// declarations (if/else/for) bind names visible to everything inside them, so
// collect them too.
function blockBindings(node, names) {
  if (!node || typeof node.type !== 'string') return;
  if (node.type === 'VariableDeclaration') {
    for (const decl of node.declarations) collectPattern(decl.id, names);
  }
  for (const key of Object.keys(node)) {
    if (['type', 'start', 'end', 'loc'].includes(key)) continue;
    const value = node[key];
    if (Array.isArray(value)) {
      for (const child of value) if (child?.type) blockBindings(child, names);
    } else if (value?.type) {
      blockBindings(value, names);
    }
  }
}

// Names bound by the enclosing chain of *function and class scopes only*.
// A binding declared elsewhere in the module (a sibling class's method, a
// different top-level function) does NOT count: it must be in scope where it
// is referenced.
function enclosingScopeBindings(ast, node) {
  const names = new Set();

  // Module scope: imports and top-level declarations are visible everywhere.
  // Exported declarations are wrapped in an ExportNamedDeclaration /
  // ExportDefaultDeclaration node, so unwrap before reading the binding.
  for (const stmt of ast.body) {
    if (stmt.type === 'ImportDeclaration') {
      for (const spec of stmt.specifiers) names.add(spec.local.name);
    } else if (stmt.type === 'ExportNamedDeclaration' || stmt.type === 'ExportDefaultDeclaration') {
      const inner = stmt.declaration;
      if (!inner) continue;
      if (inner.type === 'VariableDeclaration') {
        for (const decl of inner.declarations) collectPattern(decl.id, names);
      } else if ((inner.type === 'FunctionDeclaration' || inner.type === 'ClassDeclaration') && inner.id) {
        names.add(inner.id.name);
      } else if (inner.type === 'FunctionDeclaration' || inner.type === 'ClassDeclaration') {
        // Anonymous default export: nothing to bind by name.
      }
    } else if (stmt.type === 'VariableDeclaration') {
      for (const decl of stmt.declarations) collectPattern(decl.id, names);
    } else if ((stmt.type === 'FunctionDeclaration' || stmt.type === 'ClassDeclaration') && stmt.id) {
      names.add(stmt.id.name);
    }
  }

  // Walk ancestors, adding bindings from each enclosing function/class body.
  const ancestors = [];
  const visit = (current, parents) => {
    if (current === node) {
      ancestors.push(...parents);
      return true;
    }
    for (const key of Object.keys(current)) {
      if (key === 'type' || key === 'start' || key === 'end' || key === 'loc') continue;
      const value = current[key];
      if (Array.isArray(value)) {
        for (const child of value) {
          if (child && typeof child.type === 'string' && visit(child, [...parents, current])) return true;
        }
      } else if (value && typeof value.type === 'string') {
        if (visit(value, [...parents, current])) return true;
      }
    }
    return false;
  };
  visit(ast, []);

  for (const parent of ancestors) {
    if (
      parent.type === 'FunctionDeclaration' ||
      parent.type === 'FunctionExpression' ||
      parent.type === 'ArrowFunctionExpression'
    ) {
      for (const param of parent.params) collectPattern(param, names);
      // Declarations in the function body are visible for the whole body.
      // Block-scoped declarations (const/let) cover everything after them in
      // practice for our purposes, so all declarations count here.
      for (const stmt of parent.body?.body ?? []) {
        if (stmt.type === 'VariableDeclaration') {
          for (const decl of stmt.declarations) collectPattern(decl.id, names);
        } else if (stmt.type === 'FunctionDeclaration' && stmt.id) {
          names.add(stmt.id.name);
        } else if (stmt.type === 'ClassDeclaration' && stmt.id) {
          names.add(stmt.id.name);
        }
      }
      // Nested blocks inside the function body (if/try/for) also bind names.
      const collectNested = (node) => {
        if (!node || typeof node.type !== 'string') return;
        if (node.type === 'VariableDeclaration') {
          for (const decl of node.declarations) collectPattern(decl.id, names);
        } else if (node.type === 'FunctionDeclaration' && node.id) {
          names.add(node.id.name);
        } else if (node.type === 'ClassDeclaration' && node.id) {
          names.add(node.id.name);
        }
        for (const key of Object.keys(node)) {
          if (['type', 'start', 'end', 'loc', 'value'].includes(key)) continue;
          const value = node[key];
          if (Array.isArray(value)) {
            for (const child of value) if (child?.type) collectNested(child);
          } else if (value?.type) {
            collectNested(value);
          }
        }
      };
      collectNested(parent.body);
    } else if (parent.type === 'ClassDeclaration' || parent.type === 'ClassExpression') {
      if (parent.id) names.add(parent.id.name);
    } else if (parent.type === 'CatchClause' && parent.param) {
      collectPattern(parent.param, names);
    } else if (parent.type === 'ForStatement' || parent.type === 'ForOfStatement' || parent.type === 'ForInStatement') {
      if (parent.init?.type === 'VariableDeclaration') {
        for (const decl of parent.init.declarations) collectPattern(decl.id, names);
      }
    }
  }

  // Own bindings count too: a name declared and used in the same block.
  let self = node;
  if (self?.type === 'VariableDeclarator') collectPattern(self.id, names);

  // Walk up through block statements (if/else/for/while/try/switch) and the
  // module body, collecting declarations from each. This is what makes a name
  // declared in an `else { const x = ... }` visible to its uses inside it.
  for (const parent of ancestors) {
    if (
      parent.type === 'BlockStatement' ||
      parent.type === 'Program' ||
      parent.type === 'ForStatement' ||
      parent.type === 'ForOfStatement' ||
      parent.type === 'ForInStatement' ||
      parent.type === 'SwitchStatement' ||
      parent.type === 'TryStatement' ||
      parent.type === 'CatchClause'
    ) {
      blockBindings(parent, names);
    }
  }

  return names;
}

// Identifier references that are neither property keys nor member properties.
function isFreeReference(node, parent) {
  if (!parent) return false;
  // `obj.prop` -> the property name is not a reference
  if (parent.type === 'MemberExpression' && parent.property === node && !parent.computed) return false;
  // `{ key: value }` -> the key is not a reference
  if (parent.type === 'Property' && parent.key === node && !parent.computed && !parent.shorthand) return false;
  // Object/class method or property key
  if ((parent.type === 'PropertyDefinition' || parent.type === 'MethodDefinition') && parent.key === node && !parent.computed) return false;
  if (parent.type === 'LabeledStatement' && parent.label === node) return false;
  if (parent.type === 'BreakStatement' && parent.label === node) return false;
  if (parent.type === 'ContinueStatement' && parent.label === node) return false;
  return true;
}

test('no module references an identifier it never binds', () => {
  const problems = [];

  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    let ast;
    try {
      ast = acorn.parse(source, {
        ecmaVersion: 2023,
        sourceType: 'module',
        locations: true
      });
    } catch (error) {
      problems.push(`${relative(ROOT, file)}: parse failed: ${error.message}`);
      continue;
    }

    // `walk.simple` does not hand the visitor a parent node, so use
    // `walk.ancestor` and read the immediate parent off the stack. Without a
    // real parent, every reference looks like a property key and the check
    // silently passes everything.
    walk.ancestor(ast, {
      Identifier(node, ancestors) {
        const parent = ancestors[ancestors.length - 2];
        if (!isFreeReference(node, parent)) return;
        if (GLOBALS.has(node.name)) return;

        const inScope = enclosingScopeBindings(ast, node);
        if (inScope.has(node.name)) return;

        problems.push(
          `${relative(ROOT, file)}:${node.loc?.start.line ?? '?'}: "${node.name}" is not defined`
        );
      }
    });
  }

  const unique = [...new Set(problems)];
  assert.deepStrictEqual(unique, [], `\nundefined identifiers:\n${unique.join('\n')}`);
});

test('every module except main.js imports cleanly in Node', async () => {
  const failures = [];
  for (const file of files.filter((f) => !f.endsWith('main.js'))) {
    try {
      await import(file);
    } catch (error) {
      failures.push(`${relative(ROOT, file)}: ${error.message}`);
    }
  }
  assert.deepStrictEqual(failures, [], `\nmodules failed to import:\n${failures.join('\n')}`);
});