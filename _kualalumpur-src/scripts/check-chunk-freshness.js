/**
 * Fails when the committed static-chunk export no longer matches a fresh run
 * of `scripts/export-static-chunks.js`.
 *
 * `public/chunks/**` is generated data that the repository commits and
 * publishes, but no build step regenerates it — `validate:budget` checks the
 * world, not the committed copy — so the export silently ages every time world
 * code changes. The committed manifest once described 284,350 instances while
 * the generator produced 290,515.
 *
 * This check runs the generator into a temp directory and compares the result
 * with the committed files, file by file. `generatedAt` is expected to differ
 * and is ignored; everything else must match. Run `npm run export:chunks` and
 * commit the result when this fails.
 */
import { execFileSync } from 'node:child_process';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const committedDir = path.resolve('public/chunks');
const tempRoot = await mkdtemp(path.join(tmpdir(), 'kl-chunks-'));
const freshDir = path.join(tempRoot, 'public', 'chunks');

async function listFiles(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await listFiles(path.join(dir, entry.name), relative));
    else files.push(relative);
  }
  return files.sort();
}

function withoutTimestamp(text) {
  const { generatedAt, ...rest } = JSON.parse(text);
  return JSON.stringify(rest);
}

try {
  execFileSync(process.execPath, [path.resolve('scripts/export-static-chunks.js')], {
    cwd: tempRoot,
    stdio: ['ignore', 'ignore', 'inherit']
  });

  const committed = await listFiles(committedDir);
  const fresh = await listFiles(freshDir);
  const problems = [];

  for (const file of [...new Set([...committed, ...fresh])].sort()) {
    if (!fresh.includes(file)) problems.push(`only in the committed export: ${file}`);
    else if (!committed.includes(file)) problems.push(`missing from the committed export: ${file}`);
    else {
      const [a, b] = await Promise.all([
        readFile(path.join(committedDir, file), 'utf8'),
        readFile(path.join(freshDir, file), 'utf8')
      ]);
      const differs = file === 'metadata.json' ? withoutTimestamp(a) !== withoutTimestamp(b) : a !== b;
      if (differs) problems.push(`out of date: ${file}`);
    }
  }

  if (problems.length) {
    console.error(`The committed static chunk export is stale: ${problems.length} difference(s) against ${fresh.length} generated files.`);
    for (const problem of problems.slice(0, 12)) console.error(`  - ${problem}`);
    if (problems.length > 12) console.error(`  ...and ${problems.length - 12} more`);
    console.error('Run `npm run export:chunks` and commit the result.');
    process.exitCode = 1;
  } else {
    console.log(`Static chunk export is fresh (${fresh.length} files match a fresh run).`);
  }
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}
