import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyPreference, type Tier } from '../src/config.js';

const modelTiers = new Map<string, Tier>([
  ['claude-opus-4-7', 'sub'],
  ['minimax-m2.5-free', 'free'],
  ['gpt-5', 'byok'],
  ['claude-sonnet-4-6', 'sub'],
  ['qwen3.6-plus-free', 'free'],
]);

test('applyPreference sub-first puts sub models before byok and free', () => {
  const input = ['minimax-m2.5-free', 'gpt-5', 'claude-opus-4-7'];
  const out = applyPreference(input, modelTiers, 'sub-first');
  assert.equal(out[0], 'claude-opus-4-7', 'sub model should be first');
});

test('applyPreference free-first puts free models before sub and byok', () => {
  const input = ['claude-opus-4-7', 'gpt-5', 'qwen3.6-plus-free'];
  const out = applyPreference(input, modelTiers, 'free-first');
  assert.equal(out[0], 'qwen3.6-plus-free', 'free model should be first');
});

test('applyPreference byok-first puts byok models first', () => {
  const input = ['claude-opus-4-7', 'gpt-5', 'qwen3.6-plus-free'];
  const out = applyPreference(input, modelTiers, 'byok-first');
  assert.equal(out[0], 'gpt-5', 'byok model should be first');
});

test('applyPreference cheapest is equivalent to free-first', () => {
  const input = ['claude-opus-4-7', 'gpt-5', 'qwen3.6-plus-free'];
  const cheap = applyPreference(input, modelTiers, 'cheapest');
  const free = applyPreference(input, modelTiers, 'free-first');
  assert.deepEqual(cheap, free);
});

test('applyPreference does not drop candidates, only reorders', () => {
  const input = ['claude-opus-4-7', 'minimax-m2.5-free', 'gpt-5'];
  const out = applyPreference(input, modelTiers, 'sub-first');
  assert.equal(out.length, 3);
  assert.deepEqual(new Set(out), new Set(input));
});

test('applyPreference handles unknown models by leaving them in place', () => {
  const input = ['unknown-model', 'claude-opus-4-7'];
  const out = applyPreference(input, modelTiers, 'sub-first');
  // Unknown models don't have tier, sort comparator returns 0; order is stable.
  assert.equal(out.length, 2);
  assert.ok(out.includes('claude-opus-4-7'));
});
