// apps/web/app/ecosystem/constellation.ts
//
// Derives the constellation graph from the ecosystem source of truth
// (apps/web/lib/ecosystem/derived.ts), so we can never drift out of sync
// with what's actually in the monorepo / siblings registry.

import type { Node, Edge } from '@xyflow/react';
import { NODES, EDGES, type EcosystemNode } from '@/lib/ecosystem/derived';

export interface ConstellationNodeData {
  label: string;
  description: string;
  color: string;
  size: number;
  ring: 'center' | 'inner' | 'middle' | 'outer' | 'far';
  status: EcosystemNode['status'];
  [key: string]: unknown;
}

export type ConstellationNode = Node<ConstellationNodeData>;

const COLORS = {
  GOLD: 'var(--arc-brand-arcanean-gold)',
  TEAL: 'var(--arc-brand-atlantean-teal)',
  BLUE: 'var(--arc-brand-cosmic-blue)',
  VIOLET: 'var(--arc-void)',
  PINK: 'var(--arc-fire)',
  GREEN: 'var(--arc-wind)',
} as const;

const RING_BY_LAYER: Record<EcosystemNode['layer'], ConstellationNodeData['ring']> = {
  substrate: 'inner',
  product: 'middle',
  surface: 'outer',
};

const COLOR_BY_HEMISPHERE: Record<EcosystemNode['hemisphere'], string> = {
  arc: COLORS.PINK,
  nea: COLORS.GOLD,
  seam: COLORS.TEAL,
};

const CX = 600;
const CY = 450;

function radial(radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

function radiusForRing(ring: ConstellationNodeData['ring']): number {
  switch (ring) {
    case 'center': return 0;
    case 'inner': return 170;
    case 'middle': return 320;
    case 'outer': return 470;
    case 'far': return 620;
  }
}

export function buildConstellation(): { nodes: ConstellationNode[]; edges: Edge[] } {
  const groupedByRing = new Map<ConstellationNodeData['ring'], EcosystemNode[]>();
  for (const node of NODES) {
    const ring = RING_BY_LAYER[node.layer];
    const arr = groupedByRing.get(ring) ?? [];
    arr.push(node);
    groupedByRing.set(ring, arr);
  }

  const nodes: ConstellationNode[] = [];
  for (const [ring, arr] of groupedByRing) {
    const radius = radiusForRing(ring);
    arr.forEach((node, i) => {
      const angle = (360 / Math.max(arr.length, 1)) * i;
      const pos = radial(radius, angle);
      nodes.push({
        id: node.id,
        type: 'constellation',
        position: { x: pos.x - 18, y: pos.y - 18 },
        data: {
          label: node.name,
          description: node.description,
          color: COLOR_BY_HEMISPHERE[node.hemisphere],
          size: ring === 'inner' ? 48 : ring === 'middle' ? 40 : 36,
          ring,
          status: node.status,
        },
      });
    });
  }

  const edges: Edge[] = EDGES.map((e) => ({
    id: `${e.source}-${e.target}`,
    source: e.source,
    target: e.target,
    style: { stroke: COLORS.TEAL, strokeWidth: 1, opacity: 0.35 },
    type: 'straight',
  }));

  return { nodes, edges };
}

// Backwards-compatible exports for any consumer that imports the old names directly.
const built = buildConstellation();
export const initialNodes = built.nodes;
export const initialEdges = built.edges;
