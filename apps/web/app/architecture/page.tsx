'use client';

import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Node categories with Arcanean colors
const COLORS = {
  core: '#00bcd4',
  guardian: '#ffd700',
  feature: '#7c3aed',
  infra: '#10b981',
  content: '#f97316',
  external: '#6b7280',
};

function nodeStyle(color: string, opts?: { dim?: boolean; bold?: boolean; large?: boolean }) {
  return {
    background: color + '15',
    border: `${opts?.bold ? 2 : 1}px solid ${color}${opts?.dim ? '40' : '50'}`,
    color: opts?.dim ? '#a0a0a0' : '#e0e0e0',
    borderRadius: 10,
    padding: opts?.large ? 16 : opts?.dim ? 10 : 12,
    fontSize: opts?.large ? 16 : opts?.dim ? 10 : 11,
    fontWeight: opts?.bold ? 700 : 400,
    whiteSpace: 'pre-line' as const,
  };
}

const initialNodes: Node[] = [
  // Core Platform
  {
    id: 'arcanea',
    position: { x: 500, y: 50 },
    data: { label: 'Arcanea Platform' },
    style: nodeStyle(COLORS.core, { bold: true, large: true }),
  },

  // Main Features
  {
    id: 'chat',
    position: { x: 200, y: 200 },
    data: { label: 'Chat\nAI SDK v6 \u00b7 17+ Models' },
    style: nodeStyle(COLORS.feature),
  },
  {
    id: 'imagine',
    position: { x: 400, y: 200 },
    data: { label: 'Imagine\nGrok \u00b7 Gemini' },
    style: nodeStyle(COLORS.feature),
  },
  {
    id: 'studio',
    position: { x: 600, y: 200 },
    data: { label: 'Studio\nImage \u00b7 Video \u00b7 Music' },
    style: nodeStyle(COLORS.feature),
  },
  {
    id: 'library',
    position: { x: 800, y: 200 },
    data: { label: 'Library\n20 Collections \u00b7 200K words' },
    style: nodeStyle(COLORS.content),
  },

  // Intelligence Layer
  {
    id: 'moe',
    position: { x: 350, y: 380 },
    data: { label: 'MoE Router\nIntent \u2192 Guardian Blend' },
    style: nodeStyle(COLORS.guardian),
  },
  {
    id: 'gateway',
    position: { x: 600, y: 380 },
    data: { label: 'Intelligence Gateway\n17+ Models \u00b7 Auto-routing' },
    style: nodeStyle(COLORS.core),
  },

  // Guardians
  {
    id: 'guardians',
    position: { x: 100, y: 500 },
    data: { label: 'Ten Guardians\nLyssandria \u2192 Shinkami' },
    style: nodeStyle(COLORS.guardian),
  },
  {
    id: 'luminors',
    position: { x: 300, y: 500 },
    data: { label: 'Luminors\nCustom AI Companions' },
    style: nodeStyle(COLORS.guardian),
  },
  {
    id: 'gates',
    position: { x: 500, y: 500 },
    data: { label: 'Ten Gates\n174Hz \u2192 1111Hz' },
    style: nodeStyle(COLORS.guardian),
  },

  // Infrastructure
  {
    id: 'supabase',
    position: { x: 700, y: 500 },
    data: { label: 'Supabase\nAuth \u00b7 DB \u00b7 Realtime' },
    style: nodeStyle(COLORS.infra),
  },
  {
    id: 'vercel',
    position: { x: 900, y: 500 },
    data: { label: 'Vercel\nEdge \u00b7 Blob \u00b7 AI SDK' },
    style: nodeStyle(COLORS.infra),
  },

  // External APIs
  {
    id: 'google',
    position: { x: 150, y: 650 },
    data: { label: 'Google\nGemini \u00b7 Veo \u00b7 Imagen' },
    style: nodeStyle(COLORS.external, { dim: true }),
  },
  {
    id: 'anthropic',
    position: { x: 320, y: 650 },
    data: { label: 'Anthropic\nClaude Opus \u00b7 Sonnet' },
    style: nodeStyle(COLORS.external, { dim: true }),
  },
  {
    id: 'xai',
    position: { x: 490, y: 650 },
    data: { label: 'xAI\nGrok \u00b7 Imagine' },
    style: nodeStyle(COLORS.external, { dim: true }),
  },
  {
    id: 'openai',
    position: { x: 660, y: 650 },
    data: { label: 'OpenAI\nGPT-5 \u00b7 DALL-E' },
    style: nodeStyle(COLORS.external, { dim: true }),
  },
  {
    id: 'others',
    position: { x: 830, y: 650 },
    data: { label: 'More\nDeepSeek \u00b7 Groq \u00b7 Cerebras' },
    style: nodeStyle(COLORS.external, { dim: true }),
  },

  // Content Layer
  {
    id: 'lore',
    position: { x: 850, y: 300 },
    data: { label: 'Lore\nCanon \u00b7 Mythology' },
    style: nodeStyle(COLORS.content),
  },
  {
    id: 'academy',
    position: { x: 1000, y: 300 },
    data: { label: 'Academy\nCourses \u00b7 Gates' },
    style: nodeStyle(COLORS.content),
  },
];

const edgeStyle = (color: string, opacity = '40') => ({
  stroke: color + opacity,
});

const initialEdges: Edge[] = [
  // Core connections
  { id: 'e1', source: 'arcanea', target: 'chat', animated: true, style: edgeStyle(COLORS.core, '60') },
  { id: 'e2', source: 'arcanea', target: 'imagine', animated: true, style: edgeStyle(COLORS.core, '60') },
  { id: 'e3', source: 'arcanea', target: 'studio', animated: true, style: edgeStyle(COLORS.core, '60') },
  { id: 'e4', source: 'arcanea', target: 'library', style: edgeStyle(COLORS.content) },

  // Chat -> Intelligence
  { id: 'e5', source: 'chat', target: 'moe', style: edgeStyle(COLORS.guardian), label: 'intent', labelStyle: { fill: '#666', fontSize: 9 } },
  { id: 'e6', source: 'chat', target: 'gateway', style: edgeStyle(COLORS.core), label: 'stream', labelStyle: { fill: '#666', fontSize: 9 } },
  { id: 'e7', source: 'imagine', target: 'gateway', style: edgeStyle(COLORS.core) },
  { id: 'e8', source: 'studio', target: 'gateway', style: edgeStyle(COLORS.core) },

  // MoE -> Guardians
  { id: 'e9', source: 'moe', target: 'guardians', style: edgeStyle(COLORS.guardian) },
  { id: 'e10', source: 'moe', target: 'luminors', style: edgeStyle(COLORS.guardian) },
  { id: 'e11', source: 'moe', target: 'gates', style: edgeStyle(COLORS.guardian) },

  // Gateway -> Providers
  { id: 'e12', source: 'gateway', target: 'google', style: edgeStyle(COLORS.external, '30') },
  { id: 'e13', source: 'gateway', target: 'anthropic', style: edgeStyle(COLORS.external, '30') },
  { id: 'e14', source: 'gateway', target: 'xai', style: edgeStyle(COLORS.external, '30') },
  { id: 'e15', source: 'gateway', target: 'openai', style: edgeStyle(COLORS.external, '30') },
  { id: 'e16', source: 'gateway', target: 'others', style: edgeStyle(COLORS.external, '30') },

  // Infra
  { id: 'e17', source: 'arcanea', target: 'supabase', style: edgeStyle(COLORS.infra, '30') },
  { id: 'e18', source: 'arcanea', target: 'vercel', style: edgeStyle(COLORS.infra, '30') },

  // Content
  { id: 'e19', source: 'library', target: 'lore', style: edgeStyle(COLORS.content, '30') },
  { id: 'e20', source: 'library', target: 'academy', style: edgeStyle(COLORS.content, '30') },
  { id: 'e21', source: 'lore', target: 'guardians', style: edgeStyle(COLORS.guardian, '20'), type: 'smoothstep' },
];

const LEGEND: Record<string, string> = {
  Core: COLORS.core,
  Guardians: COLORS.guardian,
  Features: COLORS.feature,
  Infrastructure: COLORS.infra,
  Content: COLORS.content,
  External: COLORS.external,
};

function minimapNodeColor(node: Node): string {
  const border = (node.style?.border as string) || '';
  const match = border.match(/#[0-9a-f]{6}/i);
  return match ? match[0] : '#333';
}

export default function ArchitecturePage() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ height: '100vh', background: '#09090b' }}>
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 24,
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 4,
          }}
        >
          System Architecture
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
          Interactive graph — drag nodes, zoom, explore connections
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          {Object.entries(LEGEND).map(([label, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: color,
                }}
              />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#ffffff08" gap={20} />
        <Controls
          style={{
            background: '#1a1a1f',
            borderColor: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
          }}
        />
        <MiniMap
          nodeColor={minimapNodeColor}
          style={{
            background: '#111',
            borderColor: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
          }}
        />
      </ReactFlow>
    </div>
  );
}
