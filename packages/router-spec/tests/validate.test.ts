import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSpec, resolveTask, pickModel } from '../src/index.js';

test('loadSpec returns declared counts', () => {
  const spec = loadSpec();
  assert.ok(Object.keys(spec.models).length >= 10);
  assert.ok(Object.keys(spec.tasks).length >= 10);
  assert.ok(Object.keys(spec.surfaces).length >= 5);
});

test('every task.primary references a declared model', () => {
  const spec = loadSpec();
  for (const [taskId, task] of Object.entries(spec.tasks)) {
    for (const modelId of task.primary) {
      assert.ok(
        spec.models[modelId],
        `task[${taskId}].primary references undeclared model: ${modelId}`,
      );
    }
  }
});

test('every surface.taskOverrides references declared tasks', () => {
  const spec = loadSpec();
  for (const [surfaceId, surface] of Object.entries(spec.surfaces)) {
    for (const taskId of Object.keys(surface.taskOverrides ?? {})) {
      assert.ok(
        spec.tasks[taskId],
        `surface[${surfaceId}].taskOverrides references undeclared task: ${taskId}`,
      );
    }
  }
});

test('resolveTask returns valid candidates for known task+surface', () => {
  const spec = loadSpec();
  const candidates = resolveTask('world.canon', 'claude-arcanea', spec);
  assert.ok(candidates.length > 0);
  assert.ok(candidates.includes('claude-opus-4-7'));
});

test('pickModel returns first non-deprecated model', () => {
  const spec = loadSpec();
  const picked = pickModel(['claude-opus-4-7', 'claude-sonnet-4-6'], spec);
  assert.equal(picked, 'claude-opus-4-7');
});

test('pickModel skips deprecated and picks next', () => {
  const spec = loadSpec();
  // glm-4.7-free is marked deprecated in models.yaml
  const picked = pickModel(['glm-4.7-free', 'glm-5-free'], spec);
  assert.equal(picked, 'glm-5-free');
});

test('resolveTask throws on unknown surface', () => {
  const spec = loadSpec();
  assert.throws(() => resolveTask('world.canon', 'fake-surface', spec));
});

test('resolveTask throws on unknown task', () => {
  const spec = loadSpec();
  assert.throws(() => resolveTask('fake.task', 'claude-arcanea', spec));
});
