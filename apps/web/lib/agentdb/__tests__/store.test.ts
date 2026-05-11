/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.ARCANEA_AGENTDB_BACKEND = 'starlight';
process.env.STARLIGHT_HOME = mkdtempSync(join(tmpdir(), 'arcanea-agentdb-'));

async function run(): Promise<void> {
  const {
    storeMemory,
    getMemory,
    updateMemory,
    deleteMemory,
    listMemories,
    searchMemories,
    getStats,
  } = await import('../store');

  const agentId = 'agent.alpha';

  const first = await storeMemory(
    agentId,
    'favorite-workflow',
    'Frank prefers deep focus blocks in the morning.',
    'preferences',
    ['focus', 'morning'],
    null,
  );
  assert.equal(first.namespace, 'preferences');

  const fetched = await getMemory(agentId, 'favorite-workflow', 'preferences');
  assert.ok(fetched);
  assert.equal(fetched?.value, 'Frank prefers deep focus blocks in the morning.');

  const updated = await updateMemory(
    agentId,
    'favorite-workflow',
    { value: 'Frank prefers deep focus blocks before noon.', tags: ['focus', 'morning', 'deep-work'] },
    'preferences',
  );
  assert.ok(updated);
  assert.equal(updated?.tags.length, 3);

  const listed = await listMemories(agentId, 'preferences', 10);
  assert.equal(listed.length, 1);

  const searchResults = await searchMemories(agentId, 'deep focus noon', 'preferences', 5, 0.2);
  assert.equal(searchResults.length, 1);

  const stats = await getStats(agentId);
  assert.equal(stats.total_memories, 1);
  assert.deepEqual(stats.namespaces, ['preferences']);

  const deleted = await deleteMemory(agentId, 'favorite-workflow', 'preferences');
  assert.equal(deleted, true);

  const afterDelete = await getMemory(agentId, 'favorite-workflow', 'preferences');
  assert.equal(afterDelete, null);
}

run()
  .then(() => {
    console.log('agentdb store test passed');
  })
  .finally(() => {
    rmSync(process.env.STARLIGHT_HOME!, { recursive: true, force: true });
  });
