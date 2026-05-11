import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EcosystemNodeSchema, ManifestSchema, GATES } from '../../src/ecosystem/schema.ts';

describe('EcosystemNodeSchema', () => {
  it('parses a valid node', () => {
    const node = {
      id: 'author-council',
      name: '@arcanea/author-council',
      description: '10 author voices · 8 rosters',
      layer: 'product',
      gate: 'soul',
      hemisphere: 'arc',
      status: 'orphan',
      consumes: ['anthropic-sdk'],
      consumedBy: [],
      isExternal: false,
      lastVerifiedAt: '2026-05-11T00:00:00Z',
      links: {},
    };
    assert.doesNotThrow(() => EcosystemNodeSchema.parse(node));
  });

  it('rejects an invalid gate', () => {
    assert.throws(() => EcosystemNodeSchema.parse({
      id: 'x', name: 'X', description: '', layer: 'product', gate: 'INVALID',
      hemisphere: 'arc', status: 'built', consumes: [], consumedBy: [],
      isExternal: false, lastVerifiedAt: '', links: {},
    }));
  });

  it('exposes the 10 gate constants', () => {
    assert.deepEqual([...GATES], ['source', 'form', 'pattern', 'voice', 'vision', 'story', 'world', 'soul', 'unity', 'mastery']);
  });
});

describe('ManifestSchema', () => {
  it('parses an empty manifest', () => {
    assert.doesNotThrow(() => ManifestSchema.parse({ nodes: [] }));
  });
});
