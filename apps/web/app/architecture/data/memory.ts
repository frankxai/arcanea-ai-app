import type { Node, Edge } from '@xyflow/react';
import { COLORS, nodeStyle, edgeStyle } from './colors';

// ─── Memory Architecture ────────────────────────────────────────────────────────

export const memoryNodes: Node[] = [
  {
    id: 'mem-system',
    position: { x: 400, y: 30 },
    data: { label: 'Arcanea Memory System\nHybrid Architecture' },
    style: nodeStyle(COLORS.memory, { bold: true, large: true }),
  },
  // Memory tiers
  {
    id: 'agentdb',
    position: { x: 150, y: 180 },
    data: { label: 'AgentDB\nSQLite \u00b7 7 tables\nHNSW vector search' },
    style: nodeStyle(COLORS.memory, { bold: true }),
  },
  {
    id: 'state-files',
    position: { x: 400, y: 180 },
    data: { label: 'State Files\n/tmp/arcanea-*\nReal-time coordination' },
    style: nodeStyle(COLORS.infra),
  },
  {
    id: 'vault',
    position: { x: 650, y: 180 },
    data: { label: 'Memory Vault\nLong-term storage\nClassified recall' },
    style: nodeStyle(COLORS.agent),
  },
  // AgentDB tables
  {
    id: 'mem-entries',
    position: { x: 30, y: 340 },
    data: { label: 'memory_entries\nKey-value store' },
    style: nodeStyle(COLORS.memory, { dim: true }),
  },
  {
    id: 'mem-vectors',
    position: { x: 170, y: 340 },
    data: { label: 'memory_vectors\nHNSW embeddings' },
    style: nodeStyle(COLORS.memory, { dim: true }),
  },
  {
    id: 'mem-sessions',
    position: { x: 310, y: 340 },
    data: { label: 'sessions\nTimeline tracking' },
    style: nodeStyle(COLORS.memory, { dim: true }),
  },
  // State files detail
  {
    id: 'guardian-state',
    position: { x: 420, y: 340 },
    data: { label: 'arcanea-guardian\nActive Guardian name' },
    style: nodeStyle(COLORS.guardian, { dim: true }),
  },
  {
    id: 'context-state',
    position: { x: 570, y: 340 },
    data: { label: 'arcanea-context-status\nToken tracking' },
    style: nodeStyle(COLORS.core, { dim: true }),
  },
  // Vault operations
  {
    id: 'vault-remember',
    position: { x: 720, y: 340 },
    data: { label: 'vault_remember\nStore with embeddings' },
    style: nodeStyle(COLORS.agent, { dim: true }),
  },
  {
    id: 'vault-recall',
    position: { x: 870, y: 340 },
    data: { label: 'vault_recall\nSemantic search' },
    style: nodeStyle(COLORS.agent, { dim: true }),
  },
  // Horizon layer
  {
    id: 'horizon',
    position: { x: 400, y: 480 },
    data: { label: 'Horizon Layer\nCross-session continuity\nhorizon_append \u00b7 horizon_read' },
    style: nodeStyle(COLORS.element, { bold: true }),
  },
  // Consumers
  {
    id: 'consumer-hooks',
    position: { x: 150, y: 480 },
    data: { label: 'Hooks\nRead/write state on events' },
    style: nodeStyle(COLORS.core, { dim: true }),
  },
  {
    id: 'consumer-agents',
    position: { x: 650, y: 480 },
    data: { label: 'Agents\nShared memory namespace' },
    style: nodeStyle(COLORS.core, { dim: true }),
  },
];

export const memoryEdges: Edge[] = [
  { id: 'm1', source: 'mem-system', target: 'agentdb', animated: true, style: edgeStyle(COLORS.memory, '60') },
  { id: 'm2', source: 'mem-system', target: 'state-files', animated: true, style: edgeStyle(COLORS.infra, '50') },
  { id: 'm3', source: 'mem-system', target: 'vault', animated: true, style: edgeStyle(COLORS.agent, '50') },
  // AgentDB detail
  { id: 'm4', source: 'agentdb', target: 'mem-entries', style: edgeStyle(COLORS.memory, '30') },
  { id: 'm5', source: 'agentdb', target: 'mem-vectors', style: edgeStyle(COLORS.memory, '30') },
  { id: 'm6', source: 'agentdb', target: 'mem-sessions', style: edgeStyle(COLORS.memory, '30') },
  // State files detail
  { id: 'm7', source: 'state-files', target: 'guardian-state', style: edgeStyle(COLORS.guardian, '30') },
  { id: 'm8', source: 'state-files', target: 'context-state', style: edgeStyle(COLORS.core, '30') },
  // Vault detail
  { id: 'm9', source: 'vault', target: 'vault-remember', style: edgeStyle(COLORS.agent, '30') },
  { id: 'm10', source: 'vault', target: 'vault-recall', style: edgeStyle(COLORS.agent, '30') },
  // Horizon
  { id: 'm11', source: 'agentdb', target: 'horizon', style: edgeStyle(COLORS.element, '40'), type: 'smoothstep' },
  { id: 'm12', source: 'vault', target: 'horizon', style: edgeStyle(COLORS.element, '40'), type: 'smoothstep' },
  // Consumers
  { id: 'm13', source: 'state-files', target: 'consumer-hooks', style: edgeStyle(COLORS.core, '30') },
  { id: 'm14', source: 'agentdb', target: 'consumer-agents', style: edgeStyle(COLORS.core, '30'), type: 'smoothstep' },
];

export const memoryLegend: Record<string, string> = {
  AgentDB: COLORS.memory,
  'State Protocol': COLORS.infra,
  'Memory Vault': COLORS.agent,
  Horizon: COLORS.element,
  Guardians: COLORS.guardian,
};
