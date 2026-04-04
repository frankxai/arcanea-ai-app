/**
 * Gateway Router Tests
 *
 * Tests task classification and model selection logic.
 * Run with: npx tsx apps/web/lib/gateway/__tests__/router.test.ts
 */

import { classifyTask, selectModel } from '../router';
import type { GatewayConfig } from '../types';

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
// classifyTask
// ---------------------------------------------------------------------------

describe('classifyTask: code detection', () => {
  const result = classifyTask([
    { role: 'user', content: 'debug the function and refactor the api endpoint' },
  ]);
  assert(result.taskType === 'code', 'detects code task from keywords');
  assert(result.complexity === 'simple', 'short message = simple complexity');
  assert(result.needsVision === false, 'no vision needed');
  assert(result.estimatedTokens > 0, 'estimates tokens > 0');
});

describe('classifyTask: creative detection', () => {
  const result = classifyTask([
    { role: 'user', content: 'write a story about a character in a narrative dialogue' },
  ]);
  assert(result.taskType === 'creative', 'detects creative task');
});

describe('classifyTask: reasoning detection', () => {
  const result = classifyTask([
    { role: 'user', content: 'analyze the trade-off and evaluate the strategy design' },
  ]);
  assert(result.taskType === 'reasoning', 'detects reasoning task');
});

describe('classifyTask: image-gen detection', () => {
  const result = classifyTask([
    { role: 'user', content: 'generate image of a dragon flying over mountains' },
  ]);
  assert(result.taskType === 'image-gen', 'detects image generation task');
});

describe('classifyTask: video-gen detection', () => {
  const result = classifyTask([
    { role: 'user', content: 'generate video of a sunset over the ocean' },
  ]);
  assert(result.taskType === 'video-gen', 'detects video generation task');
});

describe('classifyTask: translation detection', () => {
  const result = classifyTask([
    { role: 'user', content: 'translate this to Japanese' },
  ]);
  assert(result.taskType === 'translation', 'detects translation task');
});

describe('classifyTask: vision detection', () => {
  const result = classifyTask([
    { role: 'user', content: [{ type: 'image_url', image_url: { url: 'data:...' } }, { type: 'text', text: 'what is this?' }] },
  ]);
  assert(result.taskType === 'vision', 'detects vision task from image content');
  assert(result.needsVision === true, 'needsVision is true');
});

describe('classifyTask: default to chat', () => {
  const result = classifyTask([
    { role: 'user', content: 'hello there' },
  ]);
  assert(result.taskType === 'chat', 'defaults to chat for generic messages');
});

describe('classifyTask: complexity from message count', () => {
  const messages = Array.from({ length: 12 }, (_, i) => ({
    role: i % 2 === 0 ? 'user' as const : 'assistant' as const,
    content: 'message ' + i,
  }));
  const result = classifyTask(messages);
  assert(result.complexity === 'expert', '>10 messages = expert complexity');
});

describe('classifyTask: moderate complexity', () => {
  // Need > 100 total words for 'moderate'
  const messages = [
    { role: 'user' as const, content: 'word '.repeat(120) },
  ];
  const result = classifyTask(messages);
  assert(
    result.complexity === 'moderate' || result.complexity === 'complex',
    `120 words = moderate/complex (got ${result.complexity})`
  );
});

describe('classifyTask: empty message', () => {
  const result = classifyTask([{ role: 'user', content: '' }]);
  assert(result.taskType === 'chat', 'empty content defaults to chat');
  assert(result.complexity === 'simple', 'empty content = simple');
});

describe('classifyTask: single keyword not enough for code', () => {
  // Needs >= 2 code signals to classify as code
  const result = classifyTask([{ role: 'user', content: 'what is an api' }]);
  assert(result.taskType === 'chat', 'single code keyword stays as chat');
});

// ---------------------------------------------------------------------------
// selectModel
// ---------------------------------------------------------------------------

describe('selectModel: returns null when no provider keys', () => {
  const classification = classifyTask([{ role: 'user', content: 'hello' }]);
  const config: GatewayConfig = { providerKeys: {} };
  const result = selectModel(classification, config);
  assert(result === null, 'returns null with no available models');
});

describe('selectModel: prefers speed tier for simple tasks', () => {
  const classification = classifyTask([{ role: 'user', content: 'hello' }]);
  // Provide keys for all providers so all models are available
  const config: GatewayConfig = {
    providerKeys: { google: 'key', anthropic: 'key', openai: 'key', xai: 'key', deepseek: 'key', groq: 'key' },
  };
  const result = selectModel(classification, config);
  assert(result !== null, 'returns a model when keys are available');
  if (result) {
    assert(
      result.model.tier === 'speed' || result.model.tier === 'performance',
      `simple task routes to speed/performance tier (got ${result.model.tier})`
    );
    assert(result.reason.includes('chat'), 'reason mentions chat task type');
    assert(result.alternatives.length > 0, 'provides alternatives');
  }
});

describe('selectModel: expert complexity prefers frontier', () => {
  const messages = Array.from({ length: 12 }, (_, i) => ({
    role: i % 2 === 0 ? 'user' as const : 'assistant' as const,
    content: 'analyze the complex architecture and evaluate the design strategy carefully ' + i,
  }));
  const classification = classifyTask(messages);
  const config: GatewayConfig = {
    providerKeys: { google: 'key', anthropic: 'key', openai: 'key' },
  };
  const result = selectModel(classification, config);
  assert(result !== null, 'returns a model for expert tasks');
  if (result) {
    assert(
      result.reason.includes('expert'),
      `reason mentions expert complexity (got: ${result.reason})`
    );
  }
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('='.repeat(50));

if (failed > 0) process.exit(1);
