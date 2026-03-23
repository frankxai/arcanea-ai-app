'use client';

import React, { useState, useCallback } from 'react';
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
import {
  ecosystemNodes,
  ecosystemEdges,
  ecosystemLegend,
  intelligenceNodes,
  intelligenceEdges,
  intelligenceLegend,
  memoryNodes,
  memoryEdges,
  memoryLegend,
  agentNodes,
  agentEdges,
  agentLegend,
  roadmapNodes,
  roadmapEdges,
  roadmapLegend,
  businessNodes,
  businessEdges,
  businessLegend,
} from './graph-data';

type TabKey = 'ecosystem' | 'intelligence' | 'memory' | 'agents' | 'roadmap' | 'business';

interface TabConfig {
  key: TabKey;
  label: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  legend: Record<string, string>;
}

const TABS: TabConfig[] = [
  {
    key: 'ecosystem',
    label: 'Ecosystem Map',
    description: 'Platform architecture — features, intelligence layer, providers, and content',
    nodes: ecosystemNodes,
    edges: ecosystemEdges,
    legend: ecosystemLegend,
  },
  {
    key: 'intelligence',
    label: 'Intelligence OS',
    description: 'Guardian routing, hooks lifecycle, 3-tier model routing, and state protocol',
    nodes: intelligenceNodes,
    edges: intelligenceEdges,
    legend: intelligenceLegend,
  },
  {
    key: 'memory',
    label: 'Memory Systems',
    description: 'AgentDB, state protocol, memory vault, and cross-session horizon layer',
    nodes: memoryNodes,
    edges: memoryEdges,
    legend: memoryLegend,
  },
  {
    key: 'agents',
    label: 'Agent Orchestration',
    description: 'Swarm topology, 60+ agent types, SPARC methodology, and hive-mind consensus',
    nodes: agentNodes,
    edges: agentEdges,
    legend: agentLegend,
  },
  {
    key: 'roadmap',
    label: 'Roadmap',
    description: 'Current state vs future vision — what\'s built today and what we\'re working towards',
    nodes: roadmapNodes,
    edges: roadmapEdges,
    legend: roadmapLegend,
  },
  {
    key: 'business',
    label: 'Business',
    description: 'Creator journey from discovery to expansion, revenue tiers, and ecosystem flywheel',
    nodes: businessNodes,
    edges: businessEdges,
    legend: businessLegend,
  },
];

function minimapNodeColor(node: Node): string {
  const border = (node.style?.border as string) || '';
  const match = border.match(/#[0-9a-f]{6}/i);
  return match ? match[0] : '#333';
}

function GraphView({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
}) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
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
  );
}

export default function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('ecosystem');
  const currentTab = TABS.find((t) => t.key === activeTab)!;

  const handleTabChange = useCallback((key: TabKey) => {
    setActiveTab(key);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#09090b',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '80px 24px 0',
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 4,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          System Architecture
        </h1>
        <p
          style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 20,
          }}
        >
          Interactive graphs — drag nodes, zoom, explore connections
        </p>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                style={{
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#7fffd4' : 'rgba(255,255,255,0.4)',
                  background: isActive ? 'rgba(127,255,212,0.06)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #7fffd4' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  borderRadius: '8px 8px 0 0',
                  transition: 'all 0.15s ease',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab description + legend */}
      <div
        style={{
          padding: '12px 24px',
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.35)',
            margin: 0,
          }}
        >
          {currentTab.description}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {Object.entries(currentTab.legend).map(([label, color]) => (
            <div
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.4)',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Graph container */}
      <div
        style={{
          flex: 1,
          minHeight: 'calc(100vh - 220px)',
          position: 'relative',
        }}
      >
        {/* Key-based remount ensures ReactFlow reinitializes with new data */}
        <GraphView
          key={activeTab}
          initialNodes={currentTab.nodes}
          initialEdges={currentTab.edges}
        />
      </div>
    </div>
  );
}
