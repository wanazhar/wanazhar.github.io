import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.js')) files.push(full);
  }
}
walk(root);

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  for (const match of src.matchAll(/from ['"](\.\.?\/[^'"]+)['"]/g)) {
    const target = path.resolve(path.dirname(file), match[1]);
    if (!fs.existsSync(target)) {
      console.error(`Missing import in ${file}: ${match[1]}`);
      process.exitCode = 1;
    }
  }
}

if (!process.exitCode) console.log(`Checked ${files.length} ES modules.`);
