import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readReposConfig } from '../../src/ecosystem/scan-siblings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../../..');

describe('readReposConfig', () => {
  it('returns array of repos with required fields', async () => {
    const repos = await readReposConfig(REPO_ROOT);
    assert.ok(Array.isArray(repos));
    assert.ok(repos.length > 5);
    const arc = repos.find((r) => r.name === 'arcanea-ai-app');
    assert.ok(arc);
    assert.ok(arc!.github);
  });

  it('respects layer/gate/hemisphere fields added in Task 2', async () => {
    const repos = await readReposConfig(REPO_ROOT);
    const arc = repos.find((r) => r.name === 'arcanea-ai-app');
    assert.equal(arc?.layer, 'surface');
    assert.equal(arc?.gate, 'unity');
    assert.equal(arc?.hemisphere, 'seam');
  });
});
