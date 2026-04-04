/**
 * Chat Route — extractMessageText Tests
 *
 * Tests the AI SDK v6 parts[] → text extraction logic
 * that lives in the chat API route.
 * Run with: npx tsx apps/web/lib/chat/__tests__/extract-message.test.ts
 */

// ---------------------------------------------------------------------------
// Inline the function under test (it's not exported from route.ts)
// ---------------------------------------------------------------------------

function extractMessageText(message: {
  parts?: Array<{ type: string; text?: string }>;
  content?: string;
}): string {
  if (Array.isArray(message.parts)) {
    const text = message.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text ?? '')
      .join('');

    if (text) return text;
  }

  return typeof message.content === 'string' ? message.content : '';
}

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
// AI SDK v6 parts[] format
// ---------------------------------------------------------------------------

describe('extractMessageText: parts with single text', () => {
  const result = extractMessageText({
    parts: [{ type: 'text', text: 'Hello world' }],
  });
  assert(result === 'Hello world', 'extracts text from single part');
});

describe('extractMessageText: parts with multiple text parts', () => {
  const result = extractMessageText({
    parts: [
      { type: 'text', text: 'Hello ' },
      { type: 'text', text: 'world' },
    ],
  });
  assert(result === 'Hello world', 'concatenates multiple text parts');
});

describe('extractMessageText: parts with mixed types', () => {
  const result = extractMessageText({
    parts: [
      { type: 'text', text: 'Look at this: ' },
      { type: 'image', text: undefined },
      { type: 'text', text: 'Description' },
    ],
  });
  assert(result === 'Look at this: Description', 'skips non-text parts');
});

describe('extractMessageText: parts with no text parts', () => {
  const result = extractMessageText({
    parts: [
      { type: 'image' },
      { type: 'file' },
    ],
  });
  assert(result === '', 'returns empty string when no text parts');
});

describe('extractMessageText: parts with text undefined', () => {
  const result = extractMessageText({
    parts: [{ type: 'text', text: undefined }],
  });
  // text is undefined, so part.text ?? '' = '', which is falsy
  // so it falls through to content check
  assert(result === '', 'handles undefined text in part');
});

describe('extractMessageText: empty parts array', () => {
  const result = extractMessageText({ parts: [] });
  assert(result === '', 'returns empty for empty parts array');
});

// ---------------------------------------------------------------------------
// Legacy content string format
// ---------------------------------------------------------------------------

describe('extractMessageText: content string', () => {
  const result = extractMessageText({ content: 'Hello content' });
  assert(result === 'Hello content', 'extracts from content string');
});

describe('extractMessageText: empty content string', () => {
  const result = extractMessageText({ content: '' });
  assert(result === '', 'returns empty for empty content');
});

// ---------------------------------------------------------------------------
// Priority: parts over content
// ---------------------------------------------------------------------------

describe('extractMessageText: parts take priority over content', () => {
  const result = extractMessageText({
    parts: [{ type: 'text', text: 'from parts' }],
    content: 'from content',
  });
  assert(result === 'from parts', 'parts[] takes priority over content');
});

describe('extractMessageText: falls back to content when parts have no text', () => {
  const result = extractMessageText({
    parts: [{ type: 'image' }],
    content: 'fallback content',
  });
  assert(result === 'fallback content', 'falls back to content when parts have no text');
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('extractMessageText: no parts and no content', () => {
  const result = extractMessageText({});
  assert(result === '', 'returns empty for empty object');
});

describe('extractMessageText: content is not a string', () => {
  const result = extractMessageText({ content: 123 as unknown as string });
  assert(result === '', 'returns empty when content is not a string');
});

describe('extractMessageText: parts with empty text strings', () => {
  const result = extractMessageText({
    parts: [
      { type: 'text', text: '' },
      { type: 'text', text: '' },
    ],
    content: 'fallback',
  });
  // Empty joined text is falsy, so falls through to content
  assert(result === 'fallback', 'empty text parts fall through to content');
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('='.repeat(50));

if (failed > 0) process.exit(1);
