import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runtimeFor, getRuntime } from '../src/runtimes.js';
import type { Model } from '@arcanea/router-spec';

function m(provider: Model['provider']): Model {
  return {
    provider,
    family: 'test',
    context: 100_000,
    tier: 'free',
    strengths: [],
  };
}

test('runtimeFor maps anthropic → claude', () => {
  assert.equal(runtimeFor(m('anthropic')), 'claude');
});

test('runtimeFor maps opencode-zen → opencode', () => {
  assert.equal(runtimeFor(m('opencode-zen')), 'opencode');
});

test('runtimeFor maps openai → codex', () => {
  assert.equal(runtimeFor(m('openai')), 'codex');
});

test('runtimeFor maps google → gemini', () => {
  assert.equal(runtimeFor(m('google')), 'gemini');
});

test('runtimeFor unknown provider defaults to claude (safest auth path)', () => {
  assert.equal(runtimeFor(m('mystery' as Model['provider'])), 'claude');
});

test('getRuntime(claude) returns binary=claude and -p argv shape', () => {
  const rt = getRuntime('claude');
  assert.equal(rt.binary, 'claude');
  const argv = rt.argv('claude-opus-4-7', 'hello');
  assert.deepEqual(argv, ['-p', 'hello', '--model', 'claude-opus-4-7']);
});

test('getRuntime(opencode) returns binary=opencode and run -p -m argv shape', () => {
  const rt = getRuntime('opencode');
  const argv = rt.argv('minimax-m2.5-free', 'hello');
  assert.deepEqual(argv, ['run', '-p', 'hello', '-m', 'minimax-m2.5-free']);
});

test('getRuntime(codex) uses exec without --model flag', () => {
  const rt = getRuntime('codex');
  const argv = rt.argv('gpt-5', 'hello');
  assert.deepEqual(argv, ['exec', 'hello']);
});

test('getRuntime(gemini) uses -p flag without --model', () => {
  const rt = getRuntime('gemini');
  const argv = rt.argv('gemini-3-pro', 'hello');
  assert.deepEqual(argv, ['-p', 'hello']);
});
