/**
 * Gateway Streaming Tests
 *
 * Tests SSE chunk formatting and helper utilities.
 * Run with: npx tsx apps/web/lib/gateway/__tests__/streaming.test.ts
 */

import {
  formatSSEChunk,
  formatSSEDone,
  generateCompletionId,
  createRoleChunk,
  createContentChunk,
  createFinishChunk,
  sseHeaders,
} from '../streaming';

// ---------------------------------------------------------------------------
// Minimal test harness
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    passed++;
    console.log(`  PASS  ${label}`);
  } else {
    failed++;
    console.error(`  FAIL  ${label}`);
  }
}

function describe(suite: string, fn: () => void) {
  console.log(`\n${suite}`);
  fn();
}

// ---------------------------------------------------------------------------
// formatSSEChunk / formatSSEDone
// ---------------------------------------------------------------------------

describe('formatSSEChunk', () => {
  const chunk = { id: 'test', object: 'chat.completion.chunk' as const, created: 1, model: 'm', choices: [] };
  const result = formatSSEChunk(chunk);
  assert(result.startsWith('data: '), 'starts with "data: "');
  assert(result.endsWith('\n\n'), 'ends with double newline');
  assert(result.includes('"test"'), 'contains chunk id');
});

describe('formatSSEDone', () => {
  const result = formatSSEDone();
  assert(result === 'data: [DONE]\n\n', 'returns exact [DONE] format');
});

// ---------------------------------------------------------------------------
// generateCompletionId
// ---------------------------------------------------------------------------

describe('generateCompletionId', () => {
  const id1 = generateCompletionId();
  const id2 = generateCompletionId();
  assert(id1.startsWith('chatcmpl-arc-'), 'starts with chatcmpl-arc- prefix');
  assert(id1 !== id2, 'generates unique IDs');
  assert(id1.length > 15, 'reasonable length');
});

// ---------------------------------------------------------------------------
// createRoleChunk
// ---------------------------------------------------------------------------

describe('createRoleChunk', () => {
  const chunk = createRoleChunk('test-id', 'test-model');
  assert(chunk.id === 'test-id', 'has correct id');
  assert(chunk.model === 'test-model', 'has correct model');
  assert(chunk.object === 'chat.completion.chunk', 'correct object type');
  assert(chunk.choices[0].delta.role === 'assistant', 'delta has role: assistant');
  assert(chunk.choices[0].finish_reason === null, 'finish_reason is null');
  assert(chunk.created > 0, 'created timestamp is positive');
});

// ---------------------------------------------------------------------------
// createContentChunk
// ---------------------------------------------------------------------------

describe('createContentChunk', () => {
  const chunk = createContentChunk('id', 'model', 'Hello world');
  assert(chunk.choices[0].delta.content === 'Hello world', 'delta has content');
  assert(chunk.choices[0].finish_reason === null, 'finish_reason is null');
});

describe('createContentChunk: empty content', () => {
  const chunk = createContentChunk('id', 'model', '');
  assert(chunk.choices[0].delta.content === '', 'handles empty content');
});

// ---------------------------------------------------------------------------
// createFinishChunk
// ---------------------------------------------------------------------------

describe('createFinishChunk: default stop', () => {
  const chunk = createFinishChunk('id', 'model');
  assert(chunk.choices[0].finish_reason === 'stop', 'default finish reason is stop');
  assert(Object.keys(chunk.choices[0].delta).length === 0, 'delta is empty object');
});

describe('createFinishChunk: custom reason', () => {
  const chunk = createFinishChunk('id', 'model', 'length');
  assert(chunk.choices[0].finish_reason === 'length', 'custom finish reason: length');
});

describe('createFinishChunk: tool_calls reason', () => {
  const chunk = createFinishChunk('id', 'model', 'tool_calls');
  assert(chunk.choices[0].finish_reason === 'tool_calls', 'tool_calls finish reason');
});

// ---------------------------------------------------------------------------
// sseHeaders
// ---------------------------------------------------------------------------

describe('sseHeaders', () => {
  const headers = sseHeaders() as Record<string, string>;
  assert(headers['Content-Type'] === 'text/event-stream', 'correct content type');
  assert(headers['Cache-Control'].includes('no-cache'), 'has no-cache');
  assert(headers['Connection'] === 'keep-alive', 'has keep-alive');
  assert(headers['X-Accel-Buffering'] === 'no', 'disables nginx buffering');
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('='.repeat(50));

if (failed > 0) process.exit(1);
