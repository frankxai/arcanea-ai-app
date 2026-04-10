'use client';

import * as React from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeProps,
  type Node as ReactFlowNode,
  type Edge as ReactFlowEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { m } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  type ElementType,
  type NodeType,
  type WorldGraphNode,
  type WorldGraphEdge,
  ELEMENT_COLORS,
  mcpGraphToReactFlow,
} from './graph-utils';
import { WorldGraphPanel, type PanelNode } from './WorldGraphPanel';

// ─── Custom node shapes ───────────────────────────────────────────────────────

interface WorldNodeData {
  label: string;
  nodeType: NodeType;
  element: ElementType;
  gate: number;
  colors: { bg: string; border: string; glow: string };
}

/**
 * Renders the SVG clip path for a given node type:
 * character=circle, location=hexagon, creature=diamond, artifact=star
 */
function NodeShape({
  type,
  size,
  bg,
  border,
  glow,
}: {
  type: NodeType;
  size: number;
  bg: string;
  border: string;
  glow: string;
}) {
  const s = size;
  const h = s / 2;

  const sharedProps = {
    fill: bg,
    stroke: border,
    strokeWidth: 1.5,
    style: { filter: `drop-shadow(0 0 6px ${glow})` },
  };

  if (type === 'character') {
    return <circle cx={h} cy={h} r={h - 1} {...sharedProps} />;
  }

  if (type === 'location') {
    // Regular hexagon
    const r = h - 2;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      return `${h + r * Math.cos(angle)},${h + r * Math.sin(angle)}`;
    }).join(' ');
    return <polygon points={pts} {...sharedProps} />;
  }

  if (type === 'creature') {
    // Diamond
    return (
      <polygon
        points={`${h},2 ${s - 2},${h} ${h},${s - 2} 2,${h}`}
        {...sharedProps}
      />
    );
  }

  // artifact — 5-point star
  const outer = h - 2;
  const inner = outer * 0.4;
  const starPts = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    return `${h + r * Math.cos(angle)},${h + r * Math.sin(angle)}`;
  }).join(' ');
  return <polygon points={starPts} {...sharedProps} />;
}

// ─── React Flow custom node ───────────────────────────────────────────────────

const NODE_SIZE = 48;

function WorldNodeRenderer({ data, selected }: NodeProps<WorldNodeData>) {
  const { label, nodeType, colors } = data;
  const size = selected ? NODE_SIZE + 6 : NODE_SIZE;

  return (
    <div className="flex flex-col items-center" style={{ userSelect: 'none' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transition-all duration-200"
        style={{
          overflow: 'visible',
          filter: selected ? `drop-shadow(0 0 10px ${colors.glow})` : 'none',
        }}
      >
        <NodeShape
          type={nodeType}
          size={size}
          bg={colors.bg}
          border={selected ? colors.border : colors.border + 'cc'}
          glow={colors.glow}
        />
      </svg>
      <span
        className="mt-1.5 max-w-[90px] text-center text-[10px] leading-tight font-sans"
        style={{
          color: selected ? colors.border : 'rgba(226,232,240,0.75)',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          wordBreak: 'break-word',
        }}
      >
        {label}
      </span>
    </div>
  );
}

const nodeTypes = { worldNode: WorldNodeRenderer };

// ─── Props ────────────────────────────────────────────────────────────────────

export interface WorldGraphProps {
  nodes: WorldGraphNode[];
  edges: WorldGraphEdge[];
  className?: string;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WorldGraph({ nodes: rawNodes, edges: rawEdges, className }: WorldGraphProps) {
  // Convert once, then hand off to React Flow state
  const { nodes: initialNodes, edges: initialEdges } = React.useMemo(
    () => mcpGraphToReactFlow({ nodes: rawNodes, edges: rawEdges }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(rawNodes), JSON.stringify(rawEdges)],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedPanel, setSelectedPanel] = React.useState<PanelNode | null>(null);

  // Keep RF state in sync when props change
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleNodeClick = React.useCallback(
    (_: React.MouseEvent, node: ReactFlowNode) => {
      const data = node.data as WorldNodeData;

      // Collect connected node labels
      const connectedIds = edges
        .filter((e) => e.source === node.id || e.target === node.id)
        .map((e) => (e.source === node.id ? e.target : e.source));

      const connectedLabels = connectedIds.map((id) => {
        const found = nodes.find((n) => n.id === id);
        return found ? (found.data as WorldNodeData).label : id;
      });

      setSelectedPanel({
        id: node.id,
        label: data.label,
        nodeType: data.nodeType,
        element: data.element,
        gate: data.gate,
        connectedIds,
        connectedLabels,
      });
    },
    [edges, nodes],
  );

  const handlePaneClick = React.useCallback(() => {
    setSelectedPanel(null);
  }, []);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'relative w-full h-full min-h-[480px] rounded-xl overflow-hidden',
        'border border-white/[0.06]',
        className,
      )}
      style={{ background: '#09090b' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.2}
        maxZoom={2.5}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'transparent' }}
      >
        {/* Subtle dot grid */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(127,255,212,0.07)"
        />

        {/* Zoom / fit controls — bottom-left */}
        <Controls
          position="bottom-left"
          showInteractive={false}
          style={{
            background: 'rgba(14,14,20,0.85)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        />

        {/* Minimap — bottom-right, hidden while panel is open to avoid overlap */}
        {!selectedPanel && (
          <MiniMap
            position="bottom-right"
            nodeStrokeWidth={2}
            nodeColor={(n) => {
              const d = n.data as WorldNodeData;
              return d?.colors?.border ?? '#7fffd4';
            }}
            maskColor="rgba(9,9,11,0.75)"
            style={{
              background: 'rgba(14,14,20,0.85)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              backdropFilter: 'blur(16px)',
            }}
          />
        )}
      </ReactFlow>

      {/* Detail panel */}
      <WorldGraphPanel
        node={selectedPanel}
        onClose={() => setSelectedPanel(null)}
      />

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-slate-500 text-sm font-sans">No creations in this world yet.</p>
        </div>
      )}
    </m.div>
  );
}
