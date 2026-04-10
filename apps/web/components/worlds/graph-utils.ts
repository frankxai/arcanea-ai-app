import type { Node as ReactFlowNode, Edge as ReactFlowEdge } from '@xyflow/react';

// ─── Domain types ────────────────────────────────────────────────────────────

export type ElementType = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Void' | 'Spirit';
export type NodeType = 'character' | 'location' | 'creature' | 'artifact';

export interface WorldGraphNode {
  id: string;
  name: string;
  type: NodeType;
  element: ElementType;
  gate: number; // 1-10
}

export interface WorldGraphEdge {
  source: string;
  target: string;
  relationship: string;
  strength: number; // 0-1
}

export interface WorldGraphData {
  nodes: WorldGraphNode[];
  edges: WorldGraphEdge[];
}

// ─── Style maps ──────────────────────────────────────────────────────────────

export const ELEMENT_COLORS: Record<ElementType, { bg: string; border: string; glow: string }> = {
  Fire:   { bg: '#3d1a0e', border: '#f97316', glow: 'rgba(249,115,22,0.35)' },
  Water:  { bg: '#0e1e3d', border: '#78a6ff', glow: 'rgba(120,166,255,0.35)' },
  Earth:  { bg: '#0e2a12', border: '#4ade80', glow: 'rgba(74,222,128,0.35)' },
  Wind:   { bg: '#1a1f28', border: '#e2e8f0', glow: 'rgba(226,232,240,0.30)' },
  Void:   { bg: '#1a0e2e', border: '#a78bfa', glow: 'rgba(167,139,250,0.35)' },
  Spirit: { bg: '#2a1e0a', border: '#ffd700', glow: 'rgba(255,215,0,0.35)'  },
};

export const NODE_TYPE_SHAPES: Record<NodeType, string> = {
  character: 'circle',
  location:  'hexagon',
  creature:  'diamond',
  artifact:  'star',
};

// ─── Layout helpers ───────────────────────────────────────────────────────────

/**
 * Produces a simple circular layout so nodes don't stack on top of each other
 * before the user starts dragging. A force-directed dagre pass can be applied
 * client-side on top of this.
 */
function circularLayout(count: number, radius = 320): Array<{ x: number; y: number }> {
  if (count === 0) return [];
  if (count === 1) return [{ x: 0, y: 0 }];
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return {
      x: Math.round(Math.cos(angle) * radius),
      y: Math.round(Math.sin(angle) * radius),
    };
  });
}

// ─── Converter ───────────────────────────────────────────────────────────────

/**
 * Converts the MCP export_world JSON format to React Flow nodes and edges.
 * Positions are seeded with a circular layout; the WorldGraph component applies
 * interactive repositioning from there.
 */
export function mcpGraphToReactFlow(mcpData: {
  nodes: WorldGraphNode[];
  edges: WorldGraphEdge[];
}): { nodes: ReactFlowNode[]; edges: ReactFlowEdge[] } {
  const positions = circularLayout(mcpData.nodes.length);

  const nodes: ReactFlowNode[] = mcpData.nodes.map((node, i) => {
    const element = (node.element ?? 'Void') as ElementType;
    const colors = ELEMENT_COLORS[element] ?? ELEMENT_COLORS.Void;

    return {
      id: node.id,
      type: 'worldNode',
      position: positions[i] ?? { x: 0, y: 0 },
      data: {
        label: node.name,
        nodeType: node.type as NodeType,
        element,
        gate: node.gate ?? 0,
        colors,
      },
    };
  });

  const edges: ReactFlowEdge[] = mcpData.edges.map((edge, i) => {
    const strength = Math.max(0, Math.min(1, edge.strength ?? 0.5));
    const strokeWidth = 1 + strength * 3; // 1px–4px

    return {
      id: `e-${i}-${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      label: edge.relationship ?? '',
      animated: strength > 0.7,
      style: {
        strokeWidth,
        stroke: 'rgba(127,255,212,0.45)',
      },
      labelStyle: {
        fill: '#94a3b8',
        fontSize: 10,
        fontFamily: 'Inter, sans-serif',
      },
      labelBgStyle: {
        fill: 'rgba(9,9,11,0.75)',
        fillOpacity: 1,
      },
      markerEnd: undefined,
    };
  });

  return { nodes, edges };
}
