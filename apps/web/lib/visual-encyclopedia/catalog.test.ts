import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CINEMA_USE_MAP,
  ENCYCLOPEDIA_STATS,
  VISUAL_BATCHES,
  VISUAL_ENCYCLOPEDIA_ENTRIES,
  VISUAL_GRAPH_EDGES,
  validateVisualCatalog,
} from './catalog';

test('visual encyclopedia catalog is complete and internally connected', () => {
  assert.equal(VISUAL_ENCYCLOPEDIA_ENTRIES.length, 130);
  assert.equal(VISUAL_BATCHES.length, 10);
  assert.ok(VISUAL_BATCHES.every((batch) => batch.entries.length === 10));
  assert.deepEqual(ENCYCLOPEDIA_STATS.byKind, {
    kinform: 42,
    character: 28,
    creature: 25,
    place: 15,
    scene: 20,
  });
  assert.equal(CINEMA_USE_MAP.length, 10);
  assert.ok(
    VISUAL_ENCYCLOPEDIA_ENTRIES.every(
      (entry) =>
        entry.media.status === 'generated' &&
        /^[a-f0-9]{64}$/u.test(entry.media.sha256 ?? '') &&
        Boolean(entry.media.width) &&
        Boolean(entry.media.height) &&
        entry.media.mimeType === 'image/png',
    ),
    'Every approved master must carry a verified PNG checksum and dimensions.',
  );

  const graphKeys = new Set(
    VISUAL_GRAPH_EDGES.map(({ source, target }) => [source, target].sort().join('::')),
  );
  for (const entry of VISUAL_ENCYCLOPEDIA_ENTRIES) {
    for (const relationship of entry.relationships) {
      assert.ok(
        graphKeys.has([entry.id, relationship].sort().join('::')),
        `Missing graph edge for ${entry.id} ↔ ${relationship}`,
      );
    }
  }

  assert.deepEqual(validateVisualCatalog(), []);
});
