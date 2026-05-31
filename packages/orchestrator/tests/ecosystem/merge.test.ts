import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mergeAll } from '../../src/ecosystem/merge.js';
import type { Manifest } from '../../src/ecosystem/schema.js';

describe('mergeAll', () => {
  it('produces a node from a manifest entry', () => {
    const manifest: Manifest = {
      nodes: [
        {
          id: 'author-council',
          name: '@arcanea/author-council',
          description: '10 voices',
          layer: 'product',
          gate: 'soul',
          hemisphere: 'arc',
          consumes: ['anthropic-sdk'],
          isExternal: false,
          links: {},
        },
      ],
    };
    const result = mergeAll({
      manifest,
      siblingRepos: [],
      monorepoPackages: [{ name: '@arcanea/author-council', version: '0.1.0', path: 'packages/author-council', hasMcpServer: true }],
      enrichments: new Map(),
      now: '2026-05-11T00:00:00Z',
    });
    const node = result.find((n) => n.id === 'author-council');
    assert.ok(node);
    assert.equal(node.packageVersion, '0.1.0');
    assert.equal(node.lastVerifiedAt, '2026-05-11T00:00:00Z');
  });

  it('back-references consumedBy from consumes graph', () => {
    const manifest: Manifest = {
      nodes: [
        { id: 'a', name: 'A', description: '', layer: 'product', gate: 'form', hemisphere: 'arc', consumes: ['b'], isExternal: false, links: {} },
        { id: 'b', name: 'B', description: '', layer: 'substrate', gate: 'source', hemisphere: 'seam', consumes: [], isExternal: false, links: {} },
      ],
    };
    const result = mergeAll({ manifest, siblingRepos: [], monorepoPackages: [], enrichments: new Map(), now: '2026-05-11T00:00:00Z' });
    const b = result.find((n) => n.id === 'b');
    assert.deepEqual(b?.consumedBy, ['a']);
  });

  it('applies status_override from manifest', () => {
    const manifest: Manifest = {
      nodes: [
        { id: 'x', name: 'X', description: '', layer: 'surface', gate: 'soul', hemisphere: 'arc', consumes: [], isExternal: false, links: {}, status_override: 'wip' },
      ],
    };
    const result = mergeAll({ manifest, siblingRepos: [], monorepoPackages: [], enrichments: new Map(), now: '2026-05-11T00:00:00Z' });
    assert.equal(result[0].status, 'wip');
  });

  it('sorts by id', () => {
    const manifest: Manifest = {
      nodes: [
        { id: 'zebra', name: 'Z', description: '', layer: 'product', gate: 'form', hemisphere: 'arc', consumes: [], isExternal: false, links: {} },
        { id: 'apple', name: 'A', description: '', layer: 'product', gate: 'form', hemisphere: 'arc', consumes: [], isExternal: false, links: {} },
      ],
    };
    const result = mergeAll({ manifest, siblingRepos: [], monorepoPackages: [], enrichments: new Map(), now: '2026-05-11T00:00:00Z' });
    assert.deepEqual(result.map((n) => n.id), ['apple', 'zebra']);
  });
});
