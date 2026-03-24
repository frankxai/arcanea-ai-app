'use client';

import React, { memo, useMemo, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type NodeProps,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  initialNodes,
  initialEdges,
  RING_LEGEND,
  type ConstellationNode,
  type ConstellationNodeData,
} from './constellation-data';

// ─── Custom Node Component ──────────────────────────────────────────────────

const ConstellationNodeComponent = memo(function ConstellationNodeComponent({
  data,
}: NodeProps<ConstellationNode>) {
  const { label, description, color, size, ring } = data;
  const [hovered, setHovered] = useState(false);

  const animationDuration = useMemo(() => {
    return 2 + Math.random() * 2;
  }, []);

  const glowSize = size * 0.6;

  return (
    <div
      className="constellation-node-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', width: size, height: size }}
    >
      {/* Invisible handles for edges */}
      <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1 }} />

      {/* Glow backdrop */}
      <div
        className="constellation-glow"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: size + glowSize,
          height: size + glowSize,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          animation: `pulse-glow ${animationDuration}s ease-in-out infinite`,
          pointerEvents: 'none',
        }}
      />

      {/* Core circle */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${color}30, ${color}10 60%, transparent)`,
          border: `1.5px solid ${color}${ring === 'center' ? 'aa' : '55'}`,
          boxShadow: hovered
            ? `0 0 ${size * 0.8}px ${color}40, inset 0 0 ${size * 0.3}px ${color}15`
            : `0 0 ${size * 0.3}px ${color}20`,
          transition: 'box-shadow 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        {/* Inner dot */}
        <div
          style={{
            width: Math.max(4, size * 0.18),
            height: Math.max(4, size * 0.18),
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 ${size * 0.2}px ${color}`,
          }}
        />
      </div>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: size + 6,
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          fontSize: ring === 'center' ? 13 : ring === 'far' ? 9 : 10,
          fontWeight: ring === 'center' ? 700 : 500,
          color: hovered ? color : `${color}cc`,
          fontFamily: "'Cinzel', 'Georgia', serif",
          letterSpacing: ring === 'center' ? '0.08em' : '0.04em',
          textShadow: `0 0 8px ${color}40`,
          transition: 'color 0.2s ease',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        {label}
      </div>

      {/* Tooltip on hover */}
      {hovered && (
        <div
          role="tooltip"
          aria-label={`${label}: ${description}`}
          style={{
            position: 'absolute',
            bottom: size + 28,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#0f1318ee',
            border: `1px solid ${color}40`,
            borderRadius: 10,
            padding: '10px 14px',
            maxWidth: 220,
            zIndex: 50,
            pointerEvents: 'none',
            boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 12px ${color}15`,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color,
              marginBottom: 4,
              fontFamily: "'Cinzel', serif",
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: 10,
              color: '#94a3b8',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>
      )}
    </div>
  );
});

// ─── Node types map ──────────────────────────────────────────────────────────

const nodeTypes = { constellation: ConstellationNodeComponent };

// ─── MiniMap color ───────────────────────────────────────────────────────────

function minimapNodeColor(node: Node): string {
  const data = node.data as ConstellationNodeData;
  return data?.color || '#333';
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function EcosystemConstellationPage() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const defaultViewport = useMemo(() => ({ x: -100, y: -50, zoom: 0.72 }), []);

  return (
    <>
      {/* Global animation keyframes */}
      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.15);
          }
        }

        .constellation-flow .react-flow__attribution {
          display: none;
        }

        .constellation-flow .react-flow__minimap {
          background: #0b0e14cc !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 8px !important;
        }

        .constellation-flow .react-flow__controls {
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }

        .constellation-flow .react-flow__controls-button {
          background: #0f1318 !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
          fill: #94a3b8 !important;
        }
        .constellation-flow .react-flow__controls-button:hover {
          background: #1a1f28 !important;
          fill: #e2e8f0 !important;
        }

        .constellation-flow .react-flow__edge path {
          stroke-linecap: round;
        }

        .constellation-flow .react-flow__background pattern line {
          stroke: rgba(255, 255, 255, 0.02) !important;
        }
      `}</style>

      <div
        className="constellation-flow"
        style={{
          width: '100%',
          height: 'calc(100vh - 64px)',
          background: '#0b0e14',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Cosmic background gradients */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(120,166,255,0.06) 0%, transparent 50%), ' +
              'radial-gradient(ellipse at 70% 80%, rgba(127,255,212,0.04) 0%, transparent 50%), ' +
              'radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.03) 0%, transparent 40%)',
          }}
        />

        {/* Star field (small dots) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            backgroundImage:
              'radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.15), transparent), ' +
              'radial-gradient(1px 1px at 25% 45%, rgba(255,255,255,0.1), transparent), ' +
              'radial-gradient(1px 1px at 40% 10%, rgba(255,255,255,0.12), transparent), ' +
              'radial-gradient(1px 1px at 55% 70%, rgba(255,255,255,0.08), transparent), ' +
              'radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,0.14), transparent), ' +
              'radial-gradient(1px 1px at 85% 55%, rgba(255,255,255,0.1), transparent), ' +
              'radial-gradient(1px 1px at 15% 80%, rgba(255,255,255,0.09), transparent), ' +
              'radial-gradient(1px 1px at 90% 85%, rgba(255,255,255,0.11), transparent), ' +
              'radial-gradient(1px 1px at 35% 90%, rgba(255,255,255,0.07), transparent), ' +
              'radial-gradient(1.5px 1.5px at 60% 20%, rgba(255,215,0,0.15), transparent), ' +
              'radial-gradient(1px 1px at 5% 50%, rgba(255,255,255,0.1), transparent), ' +
              'radial-gradient(1px 1px at 78% 65%, rgba(127,255,212,0.12), transparent), ' +
              'radial-gradient(1px 1px at 48% 35%, rgba(255,255,255,0.13), transparent), ' +
              'radial-gradient(1px 1px at 92% 12%, rgba(255,255,255,0.08), transparent), ' +
              'radial-gradient(1px 1px at 22% 62%, rgba(120,166,255,0.1), transparent)',
          }}
        />

        {/* Legend overlay */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 10,
            background: '#0f1318dd',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: '14px 18px',
            pointerEvents: 'none',
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 10,
              fontFamily: "'Space Grotesk', monospace",
            }}
          >
            Constellation Map
          </p>
          {RING_LEGEND.map((ring) => (
            <div
              key={ring.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: ring.color,
                  boxShadow: `0 0 6px ${ring.color}60`,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  color: '#94a3b8',
                  fontFamily: "'Space Grotesk', monospace",
                }}
              >
                {ring.label}
              </span>
            </div>
          ))}
        </div>

        {/* Title overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              fontFamily: "'Cinzel', 'Georgia', serif",
              background: 'linear-gradient(135deg, #ffd700, #7fffd4, #78a6ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 2,
            }}
          >
            The Arcanea Ecosystem
          </h1>
          <p
            style={{
              fontSize: 11,
              color: '#64748b',
              fontFamily: "'Space Grotesk', monospace",
            }}
          >
            27 repositories. 35 packages. One creative superintelligence.
          </p>
        </div>

        {/* Screen-reader accessible description */}
        <h1 className="sr-only">Arcanea Ecosystem Map</h1>
        <p className="sr-only">
          Interactive constellation visualization showing 19 systems across 5 layers: the Arcanea
          platform at center, 4 core systems, 4 CLI harnesses, 5 creative tools, and 5 extensions.
          Hover or focus nodes for details. Use zoom controls to navigate.
        </p>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          defaultViewport={defaultViewport}
          minZoom={0.3}
          maxZoom={2}
          fitView={false}
          proOptions={{ hideAttribution: true }}
          style={{ background: 'transparent' }}
          aria-label="Arcanea ecosystem constellation map with 19 interconnected systems"
        >
          <MiniMap
            nodeColor={minimapNodeColor}
            maskColor="#0b0e1499"
            style={{
              width: 140,
              height: 100,
            }}
            pannable
            zoomable
          />
        </ReactFlow>
      </div>
    </>
  );
}
