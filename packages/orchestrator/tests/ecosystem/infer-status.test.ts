import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { inferStatus, type InferenceInput } from '../../src/ecosystem/infer-status.js';

const NOW = '2026-05-11T00:00:00Z';

function input(overrides: Partial<InferenceInput> = {}): InferenceInput {
  return { layer: 'product', consumedByCount: 0, isExternal: false, now: NOW, ...overrides };
}

describe('inferStatus', () => {
  it('respects statusOverride', () => {
    assert.equal(inferStatus(input({ statusOverride: 'wip' })), 'wip');
  });
  it('returns external when isExternal', () => {
    assert.equal(inferStatus(input({ isExternal: true })), 'external');
  });
  it('returns orphan for product with no consumers', () => {
    assert.equal(inferStatus(input({ layer: 'product', consumedByCount: 0 })), 'orphan');
  });
  it('returns built for product with consumers', () => {
    assert.equal(inferStatus(input({ layer: 'product', consumedByCount: 2 })), 'built');
  });
  it('returns shipped for product with publicUrl + consumers', () => {
    assert.equal(inferStatus(input({ layer: 'product', consumedByCount: 2, publicUrl: 'https://arcanea.ai' })), 'shipped');
  });
  it('returns sunset for >365 day stale', () => {
    assert.equal(inferStatus(input({ lastCommitAt: '2024-01-01T00:00:00Z', consumedByCount: 1 })), 'sunset');
  });
  it('returns wip for 90-365 day stale', () => {
    assert.equal(inferStatus(input({ lastCommitAt: '2025-12-01T00:00:00Z', consumedByCount: 1 })), 'wip');
  });
});
