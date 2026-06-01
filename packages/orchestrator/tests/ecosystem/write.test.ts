import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderDerivedTs } from '../../src/ecosystem/write.js';
import type { EcosystemNode } from '../../src/ecosystem/schema.js';

describe('renderDerivedTs', () => {
  const nodes: EcosystemNode[] = [
    { id: 'x', name: 'X', description: '', layer: 'product', gate: 'soul', hemisphere: 'arc', status: 'orphan', consumes: ['y'], consumedBy: [], isExternal: false, lastVerifiedAt: '2026-05-11T00:00:00Z', links: {} },
    { id: 'y', name: 'Y', description: '', layer: 'substrate', gate: 'source', hemisphere: 'seam', status: 'built', consumes: [], consumedBy: ['x'], isExternal: false, lastVerifiedAt: '2026-05-11T00:00:00Z', links: {} },
  ];

  it('emits NODES + EDGES + GENERATED_AT exports', () => {
    const out = renderDerivedTs(nodes, '2026-05-11T00:00:00Z');
    assert.match(out, /export const NODES/);
    assert.match(out, /export const EDGES/);
    assert.match(out, /export const GENERATED_AT/);
  });

  it('embeds the node ids', () => {
    const out = renderDerivedTs(nodes, '2026-05-11T00:00:00Z');
    assert.match(out, /"id": "x"/);
    assert.match(out, /"id": "y"/);
  });

  it('emits an edge per consumes link', () => {
    const out = renderDerivedTs(nodes, '2026-05-11T00:00:00Z');
    assert.match(out, /"source": "x"/);
    assert.match(out, /"target": "y"/);
    assert.match(out, /"kind": "consumes"/);
  });

  it('exports inlined types (Layer, Gate, Hemisphere, Status)', () => {
    const out = renderDerivedTs(nodes, '2026-05-11T00:00:00Z');
    assert.match(out, /export type Layer/);
    assert.match(out, /export type Gate/);
    assert.match(out, /export type Hemisphere/);
    assert.match(out, /export type Status/);
  });
});
