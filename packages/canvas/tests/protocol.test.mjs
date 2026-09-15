import { test } from 'node:test';
import assert from 'node:assert/strict';

import { setPath, unsetPath, getPath } from '../src/protocol/paths.ts';
import { applyOp, emptyState, toSnapshot, fromSnapshot } from '../src/protocol/reducer.ts';
import { CanvasDoc } from '../src/protocol/doc.ts';
import { LocalTransport } from '../src/transport/local.ts';
import { sliceForRun } from '../src/run/slice.ts';
import { OpType } from '../src/protocol/types.ts';

const node = (id, kind, extra = {}) => ({
  id,
  kind,
  position: { x: 0, y: 0 },
  data: {},
  ...extra,
});

const op = (type, fields) => ({ id: `op-${Math.round(performance.now() * 1000)}-${type}`, clientId: 'c1', type, ...fields });

test('setPath writes deeply without mutating the source', () => {
  const before = { data: { input: { model: 'soul-2.0' } } };
  const after = setPath(before, 'data.input.seed', 8812);
  assert.equal(getPath(after, 'data.input.seed'), 8812);
  assert.equal(getPath(after, 'data.input.model'), 'soul-2.0');
  assert.equal(getPath(before, 'data.input.seed'), undefined);
});

test('unsetPath removes a leaf and leaves siblings intact', () => {
  const before = { data: { input: { model: 'soul-2.0', seed: 1 } } };
  const after = unsetPath(before, 'data.input.seed');
  assert.equal('seed' in after.data.input, false);
  assert.equal(after.data.input.model, 'soul-2.0');
});

test('concurrent prop writes to different keys both survive', () => {
  const state = emptyState();
  applyOp(state, op(OpType.NodeAdd, { nodeId: 'n1', node: node('n1', 'generate') }));
  applyOp(state, op(OpType.NodeProp, { nodeId: 'n1', key: 'data.input.model', value: 'soul-2.0' }));
  applyOp(state, op(OpType.NodeProp, { nodeId: 'n1', key: 'data.input.seed', value: 42 }));

  const result = state.nodes.get('n1');
  assert.equal(result.data.input.model, 'soul-2.0');
  assert.equal(result.data.input.seed, 42);
});

test('removing a node removes its edges', () => {
  const state = emptyState();
  applyOp(state, op(OpType.NodeAdd, { nodeId: 'a', node: node('a', 'prompt') }));
  applyOp(state, op(OpType.NodeAdd, { nodeId: 'b', node: node('b', 'generate') }));
  applyOp(state, op(OpType.EdgeAdd, { edgeId: 'e1', edge: { id: 'e1', source: 'a', target: 'b' } }));
  applyOp(state, op(OpType.NodeRemove, { nodeId: 'a' }));

  assert.equal(state.edges.size, 0);
});

test('snapshot round-trips', () => {
  const state = emptyState();
  applyOp(state, op(OpType.NodeAdd, { nodeId: 'n1', node: node('n1', 'lore') }));
  applyOp(state, op(OpType.HistoryAppend, { nodeId: 'n1', resultId: 'r1' }));

  const restored = fromSnapshot(toSnapshot(state));
  assert.equal(restored.nodes.size, 1);
  assert.deepEqual(restored.nodeHistory.get('n1'), ['r1']);
});

test('a rejected op is rolled back out of the view', async () => {
  const transport = new LocalTransport({
    validate: (candidate) => (candidate.type === OpType.ResultUpdate ? 'not_enough_credits' : null),
  });
  const rejections = [];
  const doc = new CanvasDoc('c1', transport, { onReject: (id, reason) => rejections.push(reason) });
  transport.start();
  await new Promise((resolve) => setTimeout(resolve, 0));

  doc.commit([op(OpType.NodeAdd, { nodeId: 'n1', node: node('n1', 'generate') })]);
  doc.commit([
    op(OpType.ResultUpdate, {
      resultId: 'r1',
      entry: {
        id: 'r1',
        nodeId: 'n1',
        state: 'queued',
        provenance: { model: 'soul-2.0', canonRef: 'aeloria@r47', inputs: [], createdAt: '' },
      },
    }),
  ]);
  doc.flush();
  await new Promise((resolve) => setTimeout(resolve, 10));

  assert.deepEqual(rejections, ['not_enough_credits']);
  assert.equal(doc.getState().nodes.size, 1, 'accepted op survives');
  assert.equal(doc.getState().results.size, 0, 'rejected op leaves no trace');
});

test('local edits appear before the server acknowledges them', async () => {
  const transport = new LocalTransport();
  const doc = new CanvasDoc('c1', transport);
  transport.start();
  await new Promise((resolve) => setTimeout(resolve, 0));

  doc.commit([op(OpType.NodeAdd, { nodeId: 'n1', node: node('n1', 'prompt') })]);
  assert.equal(doc.getState().nodes.size, 1, 'visible without waiting for a round trip');
});

test('run slice walks through context nodes so composed lore reaches the model', () => {
  const state = emptyState();
  for (const [id, kind] of [
    ['lore1', 'lore'],
    ['prompt1', 'prompt'],
    ['gen1', 'generate'],
    ['gen2', 'generate'],
    ['unrelated', 'generate'],
  ]) {
    applyOp(state, op(OpType.NodeAdd, { nodeId: id, node: node(id, kind) }));
  }
  const link = (id, source, target) =>
    applyOp(state, op(OpType.EdgeAdd, { edgeId: id, edge: { id, source, target } }));
  link('e1', 'lore1', 'prompt1');
  link('e2', 'prompt1', 'gen1');
  link('e3', 'gen1', 'gen2');

  const slice = sliceForRun(state, ['gen2']);
  assert.deepEqual(
    slice.nodeIds.sort(),
    ['gen1', 'gen2', 'lore1', 'prompt1'],
    'lore reaches the model through the prompt that composes it',
  );
  assert.equal(slice.nodeIds.includes('unrelated'), false, 'disconnected work is never re-run');
  assert.deepEqual(slice.runnableNodeIds, ['gen2']);
});
