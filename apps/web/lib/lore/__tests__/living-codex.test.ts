import assert from 'node:assert/strict';
import { CODEX_ELEMENTS, CODEX_ENTITIES, getCodexEntity } from '../living-codex';

assert.equal(CODEX_ENTITIES.length, 10, 'The Living Codex must expose ten locked Godbeast anchors');
assert.equal(new Set(CODEX_ENTITIES.map((entity) => entity.id)).size, CODEX_ENTITIES.length, 'Entity ids must be unique');
assert.equal(new Set(CODEX_ENTITIES.map((entity) => entity.name)).size, CODEX_ENTITIES.length, 'Entity names must be unique');

for (const entity of CODEX_ENTITIES) {
  assert.equal(entity.canonStatus, 'locked-anchor');
  assert.ok(entity.image.startsWith('/guardians/v2/'));
  assert.ok(CODEX_ELEMENTS.includes(entity.element));
  assert.ok(entity.designSignals.length >= 3);
  assert.equal(getCodexEntity(entity.id)?.name, entity.name);
}

assert.equal(getCodexEntity('not-a-being'), undefined);
console.log('Living Codex contract: 10 entities, unique ids, valid affinities, traceable assets');
