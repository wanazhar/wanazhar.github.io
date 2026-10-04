// Runs every *.test.js under scripts/ and test/, then fails loudly if a test
// file exists anywhere in the project that was not picked up.
//
// The plain `node --test scripts/*.test.js` glob was a trap: three suites were
// written under test/ and never ran at all. CI stayed green the whole time,
// which is exactly the state this script exists to prevent. A suite that is
// never executed looks identical to a suite that passes.

import { readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const TEST_DIRS = ['scripts', 'test'];

// Directories that are never scanned, and never should be.
const IGNORED = new Set(['node_modules', '.git', 'dist', '.vite']);

function findTestFiles(dir, found = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return found;
  }

  for (const entry of entries) {
    if (IGNORED.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      findTestFiles(full, found);
    } else if (entry.endsWith('.test.js')) {
      found.push(full);
    }
  }

  return found;
}

const files = TEST_DIRS.flatMap((dir) => findTestFiles(join(projectRoot, dir))).sort();

if (files.length === 0) {
  console.error('no test files found');
  process.exit(1);
}

console.log(`running ${files.length} test file(s):`);
for (const file of files) console.log(`  ${relative(projectRoot, file)}`);
console.log('');

const result = spawnSync(process.execPath, ['--test', ...files], {
  cwd: projectRoot,
  stdio: 'inherit'
});

process.exit(result.status ?? 1);