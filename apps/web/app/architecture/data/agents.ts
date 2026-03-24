import type { Node, Edge } from '@xyflow/react';
import { COLORS, nodeStyle, edgeStyle } from './colors';

// ─── Agent Orchestration ────────────────────────────────────────────────────────

export const agentNodes: Node[] = [
  {
    id: 'orchestrator',
    position: { x: 400, y: 30 },
    data: { label: 'Swarm Orchestrator\nHierarchical Mesh Topology' },
    style: nodeStyle(COLORS.agent, { bold: true, large: true }),
  },
  // Coordinator layer
  {
    id: 'hier-coord',
    position: { x: 200, y: 170 },
    data: { label: 'Hierarchical Coordinator\nTask decomposition' },
    style: nodeStyle(COLORS.core, { bold: true }),
  },
  {
    id: 'mesh-coord',
    position: { x: 450, y: 170 },
    data: { label: 'Mesh Coordinator\nPeer-to-peer routing' },
    style: nodeStyle(COLORS.core, { bold: true }),
  },
  {
    id: 'hive-mind',
    position: { x: 700, y: 170 },
    data: { label: 'Hive Mind\nRaft consensus \u00b7 BFT' },
    style: nodeStyle(COLORS.guardian, { bold: true }),
  },
  // Agent types - row 1
  {
    id: 'coder',
    position: { x: 60, y: 320 },
    data: { label: 'Coder\nImplementation' },
    style: nodeStyle(COLORS.feature),
  },
  {
    id: 'reviewer',
    position: { x: 200, y: 320 },
    data: { label: 'Reviewer\nCode quality' },
    style: nodeStyle(COLORS.feature),
  },
  {
    id: 'tester',
    position: { x: 340, y: 320 },
    data: { label: 'Tester\nValidation' },
    style: nodeStyle(COLORS.feature),
  },
  {
    id: 'planner',
    position: { x: 480, y: 320 },
    data: { label: 'Planner\nArchitecture' },
    style: nodeStyle(COLORS.feature),
  },
  {
    id: 'researcher',
    position: { x: 620, y: 320 },
    data: { label: 'Researcher\nContext gathering' },
    style: nodeStyle(COLORS.feature),
  },
  {
    id: 'security',
    position: { x: 760, y: 320 },
    data: { label: 'Security\nAudit \u00b7 Scan' },
    style: nodeStyle(COLORS.content),
  },
  // Specialized agents - row 2
  {
    id: 'sparc',
    position: { x: 100, y: 450 },
    data: { label: 'SPARC Methodology\nSpec \u2192 Pseudo \u2192 Arch \u2192 Refine \u2192 Complete' },
    style: nodeStyle(COLORS.element),
  },
  {
    id: 'pr-manager',
    position: { x: 400, y: 450 },
    data: { label: 'PR Manager\nGitHub integration' },
    style: nodeStyle(COLORS.infra),
  },
  {
    id: 'memory-spec',
    position: { x: 650, y: 450 },
    data: { label: 'Memory Specialist\nHNSW \u00b7 Neural search' },
    style: nodeStyle(COLORS.memory),
  },
  // Shared resources
  {
    id: 'shared-memory',
    position: { x: 250, y: 570 },
    data: { label: 'Shared Memory Namespace\nAgent coordination state' },
    style: nodeStyle(COLORS.memory, { bold: true }),
  },
  {
    id: 'task-queue',
    position: { x: 550, y: 570 },
    data: { label: 'Task Queue\n6-8 concurrent agents' },
    style: nodeStyle(COLORS.core),
  },
];

export const agentEdges: Edge[] = [
  // Orchestrator to coordinators
  { id: 'a1', source: 'orchestrator', target: 'hier-coord', animated: true, style: edgeStyle(COLORS.agent, '60') },
  { id: 'a2', source: 'orchestrator', target: 'mesh-coord', animated: true, style: edgeStyle(COLORS.agent, '60') },
  { id: 'a3', source: 'orchestrator', target: 'hive-mind', animated: true, style: edgeStyle(COLORS.guardian, '50') },
  // Coordinators to agents
  { id: 'a4', source: 'hier-coord', target: 'coder', style: edgeStyle(COLORS.feature, '40') },
  { id: 'a5', source: 'hier-coord', target: 'reviewer', style: edgeStyle(COLORS.feature, '40') },
  { id: 'a6', source: 'hier-coord', target: 'tester', style: edgeStyle(COLORS.feature, '40') },
  { id: 'a7', source: 'mesh-coord', target: 'planner', style: edgeStyle(COLORS.feature, '40') },
  { id: 'a8', source: 'mesh-coord', target: 'researcher', style: edgeStyle(COLORS.feature, '40') },
  { id: 'a9', source: 'hive-mind', target: 'security', style: edgeStyle(COLORS.content, '40') },
  // Specialized connections
  { id: 'a10', source: 'planner', target: 'sparc', style: edgeStyle(COLORS.element, '30') },
  { id: 'a11', source: 'reviewer', target: 'pr-manager', style: edgeStyle(COLORS.infra, '30') },
  { id: 'a12', source: 'researcher', target: 'memory-spec', style: edgeStyle(COLORS.memory, '30') },
  // Shared resources
  { id: 'a13', source: 'coder', target: 'shared-memory', style: edgeStyle(COLORS.memory, '20'), type: 'smoothstep' },
  { id: 'a14', source: 'tester', target: 'shared-memory', style: edgeStyle(COLORS.memory, '20'), type: 'smoothstep' },
  { id: 'a15', source: 'sparc', target: 'shared-memory', style: edgeStyle(COLORS.memory, '20'), type: 'smoothstep' },
  { id: 'a16', source: 'hier-coord', target: 'task-queue', style: edgeStyle(COLORS.core, '30'), type: 'smoothstep' },
  { id: 'a17', source: 'mesh-coord', target: 'task-queue', style: edgeStyle(COLORS.core, '30'), type: 'smoothstep' },
  // Peer connections (mesh)
  { id: 'a18', source: 'coder', target: 'reviewer', style: edgeStyle(COLORS.feature, '15') },
  { id: 'a19', source: 'reviewer', target: 'tester', style: edgeStyle(COLORS.feature, '15') },
];

export const agentLegend: Record<string, string> = {
  Orchestrator: COLORS.agent,
  Coordinators: COLORS.core,
  Agents: COLORS.feature,
  SPARC: COLORS.element,
  Memory: COLORS.memory,
  'Hive Mind': COLORS.guardian,
};
