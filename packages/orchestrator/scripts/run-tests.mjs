import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

function collectTests(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectTests(full));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.test.ts')) {
      out.push(full);
    }
  }
  return out;
}

const here = resolve(fileURLToPath(import.meta.url), '..');
const root = resolve(here, '..');
const testsRoot = join(root, 'tests');
const tests = collectTests(testsRoot);

if (!tests.length) {
  console.error('[orchestrator:test] no test files found');
  process.exit(1);
}

console.error(`[orchestrator:test] collected ${tests.length} test files`);
console.error(`[orchestrator:test] runner=node --import tsx --test cwd=${root}`);

const result = spawnSync(process.execPath, ['--import', 'tsx', '--test', ...tests], {
  cwd: root,
  stdio: 'inherit',
  shell: false,
});

if (result.error) {
  console.error(`[orchestrator:test] spawn error: ${result.error.message}`);
}
console.error(`[orchestrator:test] exit=${result.status ?? 'null'}`);
process.exit(result.status ?? 1);
