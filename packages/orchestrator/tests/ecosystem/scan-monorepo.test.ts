import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanMonorepo } from '../../src/ecosystem/scan-monorepo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../../..');

describe('scanMonorepo', () => {
  it('discovers @arcanea/author-council', async () => {
    const result = await scanMonorepo(REPO_ROOT);
    const ac = result.find((p) => p.name === '@arcanea/author-council');
    assert.ok(ac, 'should find @arcanea/author-council');
    assert.match(ac!.version, /^\d+\.\d+\.\d+/);
    assert.equal(ac!.path, 'packages/author-council');
  });

  it('discovers @arcanea/orchestrator (self-reference)', async () => {
    const result = await scanMonorepo(REPO_ROOT);
    const orch = result.find((p) => p.name === '@arcanea/orchestrator');
    assert.ok(orch, 'should find @arcanea/orchestrator');
  });
});
