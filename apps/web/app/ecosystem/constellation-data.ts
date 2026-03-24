import type { Node, Edge } from '@xyflow/react';

// ─── Color Constants ─────────────────────────────────────────────────────────

export const COLORS = {
  GOLD: '#ffd700',
  TEAL: '#7fffd4',
  BLUE: '#78a6ff',
  VIOLET: '#a855f7',
  PINK: '#f472b6',
  GREEN: '#34d399',
  AMBER: '#fbbf24',
  RED: '#f87171',
  CYAN: '#22d3ee',
  WHITE: '#e2e8f0',
} as const;

const { GOLD, TEAL, BLUE, VIOLET, PINK, GREEN, AMBER, RED, CYAN, WHITE } = COLORS;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ConstellationNodeData {
  label: string;
  description: string;
  color: string;
  size: number;
  ring: 'center' | 'inner' | 'middle' | 'outer' | 'far';
  [key: string]: unknown;
}

export type ConstellationNode = Node<ConstellationNodeData>;

// ─── Ring Legend ──────────────────────────────────────────────────────────────

export const RING_LEGEND = [
  { label: 'Platform', color: GOLD },
  { label: 'Core Systems', color: BLUE },
  { label: 'CLI Harnesses', color: TEAL },
  { label: 'Creative Tools', color: PINK },
  { label: 'Extensions', color: WHITE },
];

// ─── Layout Helpers ──────────────────────────────────────────────────────────

const CX = 600;
const CY = 450;

function radial(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

// ─── Ring Definitions ────────────────────────────────────────────────────────

interface RingNodeDef {
  id: string;
  label: string;
  description: string;
  color: string;
  angle: number;
}

const innerRingNodes: RingNodeDef[] = [
  { id: 'intelligence-os', label: 'Intelligence OS', description: 'Multi-model orchestration, routing, and persona management.', color: BLUE, angle: 0 },
  { id: 'memory-vaults', label: 'Memory Vaults', description: 'AgentDB, HNSW search, cross-session horizon layer.', color: VIOLET, angle: 90 },
  { id: 'guardian-council', label: 'Guardian Council', description: 'AI governance, quality gates, and consensus protocols.', color: GOLD, angle: 180 },
  { id: 'statusline', label: 'Statusline', description: 'Real-time system health, agent monitoring, and diagnostics.', color: GREEN, angle: 270 },
];

const middleRingNodes: RingNodeDef[] = [
  { id: 'claude-arcanea', label: 'claude-arcanea', description: '54 skills overlay for Claude Code. MCP server and agent harness.', color: TEAL, angle: 30 },
  { id: 'arcanea-code', label: 'arcanea-code', description: 'Code intelligence agent with semantic analysis and refactoring.', color: BLUE, angle: 120 },
  { id: 'oh-my-arcanea', label: 'oh-my-arcanea', description: 'Shell integration and terminal experience enhancement.', color: GREEN, angle: 210 },
  { id: 'arcanea-orchestrator', label: 'Orchestrator', description: 'Multi-agent swarm coordination with hierarchical topology.', color: VIOLET, angle: 300 },
];

const outerRingNodes: RingNodeDef[] = [
  { id: 'arcanea-claw', label: 'Arcanea Claw', description: 'Media generation CLI. Image, video, and audio pipelines.', color: PINK, angle: 0 },
  { id: 'arcanea-infogenius', label: 'InfoGenius', description: 'Research synthesis agent. Web search, analysis, visual reports.', color: CYAN, angle: 72 },
  { id: 'author-os', label: 'Author OS', description: 'Book publishing pipeline. 17 collections, 200K+ words of lore.', color: AMBER, angle: 144 },
  { id: 'suno-mcp', label: 'Suno MCP', description: 'Music creation via Suno AI. Frequency-aligned compositions.', color: RED, angle: 216 },
  { id: 'arcanea-vault', label: 'Arcanea Vault', description: 'Knowledge capture and archival with semantic search.', color: GREEN, angle: 288 },
];

const farRingNodes: RingNodeDef[] = [
  { id: 'vscode', label: 'VS Code', description: 'Visual Studio Code extension with embedded agent panels.', color: BLUE, angle: 20 },
  { id: 'chrome', label: 'Chrome', description: 'Browser extension for web research and content capture.', color: TEAL, angle: 92 },
  { id: 'open-webui', label: 'Open WebUI', description: 'Self-hosted chat interface with Arcanea personality layer.', color: WHITE, angle: 164 },
  { id: 'lobechat', label: 'LobeChat', description: 'LobeChat provider integration for multi-model routing.', color: VIOLET, angle: 236 },
  { id: 'mobile', label: 'Mobile', description: 'Companion app for iOS and Android with offline support.', color: PINK, angle: 308 },
];

// ─── Ring Configuration ──────────────────────────────────────────────────────

interface RingConfig {
  radius: number;
  size: number;
  offset: number;
  ring: ConstellationNodeData['ring'];
  nodes: RingNodeDef[];
}

const RING_CONFIGS: RingConfig[] = [
  { radius: 170, size: 48, offset: 24, ring: 'inner', nodes: innerRingNodes },
  { radius: 320, size: 40, offset: 20, ring: 'middle', nodes: middleRingNodes },
  { radius: 470, size: 36, offset: 18, ring: 'outer', nodes: outerRingNodes },
  { radius: 620, size: 28, offset: 14, ring: 'far', nodes: farRingNodes },
];

// ─── Node Generation ─────────────────────────────────────────────────────────

function buildRingNodes(config: RingConfig): ConstellationNode[] {
  return config.nodes.map((n) => {
    const pos = radial(CX, CY, config.radius, n.angle);
    return {
      id: n.id,
      type: 'constellation' as const,
      position: { x: pos.x - config.offset, y: pos.y - config.offset },
      data: { label: n.label, description: n.description, color: n.color, size: config.size, ring: config.ring },
    };
  });
}

const centerNode: ConstellationNode = {
  id: 'arcanea',
  type: 'constellation',
  position: { x: CX - 36, y: CY - 36 },
  data: {
    label: 'Arcanea',
    description: 'The creative superintelligence platform. Chat, imagine, build, publish.',
    color: GOLD,
    size: 72,
    ring: 'center',
  },
};

export const initialNodes: ConstellationNode[] = [
  centerNode,
  ...RING_CONFIGS.flatMap(buildRingNodes),
];

// ─── Edge Generation ─────────────────────────────────────────────────────────

function constellationEdge(source: string, target: string, color: string): Edge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    style: { stroke: color, strokeWidth: 1, opacity: 0.35 },
    type: 'straight',
  };
}

export const initialEdges: Edge[] = [
  // Center -> Inner
  constellationEdge('arcanea', 'intelligence-os', BLUE),
  constellationEdge('arcanea', 'memory-vaults', VIOLET),
  constellationEdge('arcanea', 'guardian-council', GOLD),
  constellationEdge('arcanea', 'statusline', GREEN),

  // Inner -> Middle
  constellationEdge('intelligence-os', 'claude-arcanea', TEAL),
  constellationEdge('intelligence-os', 'arcanea-code', BLUE),
  constellationEdge('memory-vaults', 'arcanea-orchestrator', VIOLET),
  constellationEdge('guardian-council', 'oh-my-arcanea', GOLD),
  constellationEdge('statusline', 'arcanea-orchestrator', GREEN),

  // Inner cross-connections
  constellationEdge('intelligence-os', 'memory-vaults', `${BLUE}80`),
  constellationEdge('guardian-council', 'statusline', `${GOLD}80`),

  // Middle -> Outer
  constellationEdge('claude-arcanea', 'arcanea-claw', PINK),
  constellationEdge('claude-arcanea', 'arcanea-infogenius', CYAN),
  constellationEdge('arcanea-code', 'author-os', AMBER),
  constellationEdge('arcanea-orchestrator', 'suno-mcp', RED),
  constellationEdge('oh-my-arcanea', 'arcanea-vault', GREEN),

  // Outer -> Far
  constellationEdge('arcanea-claw', 'chrome', TEAL),
  constellationEdge('arcanea-infogenius', 'open-webui', WHITE),
  constellationEdge('arcanea-code', 'vscode', BLUE),
  constellationEdge('arcanea-orchestrator', 'lobechat', VIOLET),
  constellationEdge('arcanea-vault', 'mobile', PINK),

  // Cross-ring connections for visual richness
  constellationEdge('arcanea', 'claude-arcanea', `${TEAL}60`),
  constellationEdge('arcanea', 'arcanea-claw', `${PINK}40`),
  constellationEdge('memory-vaults', 'arcanea-vault', `${VIOLET}50`),
  constellationEdge('intelligence-os', 'arcanea-infogenius', `${CYAN}50`),
];
