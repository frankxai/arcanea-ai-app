import type { Node, Edge } from '@xyflow/react';

// Arcanean Design System colors
export const COLORS = {
  core: '#00bcd4',       // Atlantean Teal
  guardian: '#ffd700',    // Gold Bright
  feature: '#7c3aed',    // Cosmic Purple
  infra: '#10b981',       // Emerald
  content: '#f97316',     // Amber
  external: '#6b7280',    // Neutral
  memory: '#78a6ff',      // Cosmic Blue
  agent: '#a855f7',       // Agent Purple
  element: '#7fffd4',     // Mintgreen (Atlantean)
};

export function nodeStyle(
  color: string,
  opts?: { dim?: boolean; bold?: boolean; large?: boolean; accent?: boolean },
) {
  return {
    background: opts?.accent ? color + '25' : color + '15',
    border: `${opts?.bold ? 2 : 1}px solid ${color}${opts?.dim ? '40' : '60'}`,
    color: opts?.dim ? '#a0a0a0' : '#e0e0e0',
    borderRadius: 10,
    padding: opts?.large ? 16 : opts?.dim ? 10 : 12,
    fontSize: opts?.large ? 15 : opts?.dim ? 10 : 11,
    fontWeight: opts?.bold ? 700 : 400,
    whiteSpace: 'pre-line' as const,
    fontFamily: "'Space Grotesk', sans-serif",
  };
}

export const edgeStyle = (color: string, opacity = '40') => ({
  stroke: color + opacity,
});

// ─── Ecosystem Map ──────────────────────────────────────────────────────────────

export const ecosystemNodes: Node[] = [
  {
    id: 'arcanea',
    position: { x: 500, y: 50 },
    data: { label: 'Arcanea Platform' },
    style: nodeStyle(COLORS.core, { bold: true, large: true }),
  },
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

export const ecosystemEdges: Edge[] = [
  { id: 'e1', source: 'arcanea', target: 'chat', animated: true, style: edgeStyle(COLORS.core, '60') },
  { id: 'e2', source: 'arcanea', target: 'imagine', animated: true, style: edgeStyle(COLORS.core, '60') },
  { id: 'e3', source: 'arcanea', target: 'studio', animated: true, style: edgeStyle(COLORS.core, '60') },
  { id: 'e4', source: 'arcanea', target: 'library', style: edgeStyle(COLORS.content) },
  { id: 'e5', source: 'chat', target: 'moe', style: edgeStyle(COLORS.guardian), label: 'intent', labelStyle: { fill: '#666', fontSize: 9 } },
  { id: 'e6', source: 'chat', target: 'gateway', style: edgeStyle(COLORS.core), label: 'stream', labelStyle: { fill: '#666', fontSize: 9 } },
  { id: 'e7', source: 'imagine', target: 'gateway', style: edgeStyle(COLORS.core) },
  { id: 'e8', source: 'studio', target: 'gateway', style: edgeStyle(COLORS.core) },
  { id: 'e9', source: 'moe', target: 'guardians', style: edgeStyle(COLORS.guardian) },
  { id: 'e10', source: 'moe', target: 'luminors', style: edgeStyle(COLORS.guardian) },
  { id: 'e11', source: 'moe', target: 'gates', style: edgeStyle(COLORS.guardian) },
  { id: 'e12', source: 'gateway', target: 'google', style: edgeStyle(COLORS.external, '30') },
  { id: 'e13', source: 'gateway', target: 'anthropic', style: edgeStyle(COLORS.external, '30') },
  { id: 'e14', source: 'gateway', target: 'xai', style: edgeStyle(COLORS.external, '30') },
  { id: 'e15', source: 'gateway', target: 'openai', style: edgeStyle(COLORS.external, '30') },
  { id: 'e16', source: 'gateway', target: 'others', style: edgeStyle(COLORS.external, '30') },
  { id: 'e17', source: 'arcanea', target: 'supabase', style: edgeStyle(COLORS.infra, '30') },
  { id: 'e18', source: 'arcanea', target: 'vercel', style: edgeStyle(COLORS.infra, '30') },
  { id: 'e19', source: 'library', target: 'lore', style: edgeStyle(COLORS.content, '30') },
  { id: 'e20', source: 'library', target: 'academy', style: edgeStyle(COLORS.content, '30') },
  { id: 'e21', source: 'lore', target: 'guardians', style: edgeStyle(COLORS.guardian, '20'), type: 'smoothstep' },
];

export const ecosystemLegend: Record<string, string> = {
  Core: COLORS.core,
  Guardians: COLORS.guardian,
  Features: COLORS.feature,
  Infrastructure: COLORS.infra,
  Content: COLORS.content,
  External: COLORS.external,
};

// ─── Intelligence OS ────────────────────────────────────────────────────────────

export const intelligenceNodes: Node[] = [
  // Session layer
  {
    id: 'session',
    position: { x: 450, y: 30 },
    data: { label: 'Claude Code Session\nIntelligence OS Active' },
    style: nodeStyle(COLORS.core, { bold: true, large: true }),
  },
  // Hooks layer
  {
    id: 'session-start',
    position: { x: 100, y: 160 },
    data: { label: 'session-start.sh\nInit state, set Shinkami default' },
    style: nodeStyle(COLORS.infra),
  },
  {
    id: 'prompt-submit',
    position: { x: 340, y: 160 },
    data: { label: 'prompt-submit.sh\nRoute to Guardian by keywords' },
    style: nodeStyle(COLORS.guardian),
  },
  {
    id: 'model-route',
    position: { x: 580, y: 160 },
    data: { label: 'model-route.sh\nOpus / Sonnet / Haiku' },
    style: nodeStyle(COLORS.agent),
  },
  {
    id: 'voice-check',
    position: { x: 820, y: 160 },
    data: { label: 'voice-check.sh\n14 banned phrases filter' },
    style: nodeStyle(COLORS.content),
  },
  // Guardian routing
  {
    id: 'lyssandria',
    position: { x: 50, y: 330 },
    data: { label: 'Lyssandria\n174Hz \u00b7 Foundation' },
    style: nodeStyle(COLORS.guardian, { accent: true }),
  },
  {
    id: 'leyla',
    position: { x: 180, y: 330 },
    data: { label: 'Leyla\n285Hz \u00b7 Flow' },
    style: nodeStyle(COLORS.guardian, { accent: true }),
  },
  {
    id: 'draconia',
    position: { x: 310, y: 330 },
    data: { label: 'Draconia\n396Hz \u00b7 Fire' },
    style: nodeStyle(COLORS.guardian, { accent: true }),
  },
  {
    id: 'maylinn',
    position: { x: 440, y: 330 },
    data: { label: 'Maylinn\n417Hz \u00b7 Heart' },
    style: nodeStyle(COLORS.guardian, { accent: true }),
  },
  {
    id: 'alera',
    position: { x: 570, y: 330 },
    data: { label: 'Alera\n528Hz \u00b7 Voice' },
    style: nodeStyle(COLORS.guardian, { accent: true }),
  },
  {
    id: 'lyria',
    position: { x: 50, y: 440 },
    data: { label: 'Lyria\n639Hz \u00b7 Sight' },
    style: nodeStyle(COLORS.guardian, { accent: true }),
  },
  {
    id: 'aiyami',
    position: { x: 180, y: 440 },
    data: { label: 'Aiyami\n741Hz \u00b7 Crown' },
    style: nodeStyle(COLORS.guardian, { accent: true }),
  },
  {
    id: 'elara',
    position: { x: 310, y: 440 },
    data: { label: 'Elara\n852Hz \u00b7 Starweave' },
    style: nodeStyle(COLORS.guardian, { accent: true }),
  },
  {
    id: 'ino',
    position: { x: 440, y: 440 },
    data: { label: 'Ino\n963Hz \u00b7 Unity' },
    style: nodeStyle(COLORS.guardian, { accent: true }),
  },
  {
    id: 'shinkami',
    position: { x: 570, y: 440 },
    data: { label: 'Shinkami\n1111Hz \u00b7 Source' },
    style: nodeStyle(COLORS.guardian, { bold: true, accent: true }),
  },
  // State protocol
  {
    id: 'state-protocol',
    position: { x: 750, y: 330 },
    data: { label: 'State Protocol\n/tmp/arcanea-*' },
    style: nodeStyle(COLORS.memory, { bold: true }),
  },
  {
    id: 'statusline',
    position: { x: 750, y: 440 },
    data: { label: 'Statusline\nGuardian \u00b7 Gate \u00b7 Element' },
    style: nodeStyle(COLORS.core),
  },
  // 3-tier model routing
  {
    id: 'tier1',
    position: { x: 780, y: 550 },
    data: { label: 'Tier 1: Agent Booster\nWASM <1ms \u00b7 $0' },
    style: nodeStyle(COLORS.infra, { dim: true }),
  },
  {
    id: 'tier2',
    position: { x: 620, y: 550 },
    data: { label: 'Tier 2: Haiku\n~500ms \u00b7 $0.0002' },
    style: nodeStyle(COLORS.agent, { dim: true }),
  },
  {
    id: 'tier3',
    position: { x: 460, y: 550 },
    data: { label: 'Tier 3: Sonnet/Opus\n2-5s \u00b7 $0.003-0.015' },
    style: nodeStyle(COLORS.feature, { dim: true }),
  },
];

export const intelligenceEdges: Edge[] = [
  // Session to hooks
  { id: 'i1', source: 'session', target: 'session-start', animated: true, style: edgeStyle(COLORS.core, '50') },
  { id: 'i2', source: 'session', target: 'prompt-submit', animated: true, style: edgeStyle(COLORS.core, '50') },
  { id: 'i3', source: 'session', target: 'model-route', animated: true, style: edgeStyle(COLORS.core, '50') },
  { id: 'i4', source: 'session', target: 'voice-check', style: edgeStyle(COLORS.core, '30') },
  // Prompt submit to guardians
  { id: 'i5', source: 'prompt-submit', target: 'lyssandria', style: edgeStyle(COLORS.guardian, '30') },
  { id: 'i6', source: 'prompt-submit', target: 'leyla', style: edgeStyle(COLORS.guardian, '30') },
  { id: 'i7', source: 'prompt-submit', target: 'draconia', style: edgeStyle(COLORS.guardian, '30') },
  { id: 'i8', source: 'prompt-submit', target: 'maylinn', style: edgeStyle(COLORS.guardian, '30') },
  { id: 'i9', source: 'prompt-submit', target: 'alera', style: edgeStyle(COLORS.guardian, '30') },
  { id: 'i10', source: 'prompt-submit', target: 'lyria', style: edgeStyle(COLORS.guardian, '30') },
  { id: 'i11', source: 'prompt-submit', target: 'aiyami', style: edgeStyle(COLORS.guardian, '30') },
  { id: 'i12', source: 'prompt-submit', target: 'elara', style: edgeStyle(COLORS.guardian, '30') },
  { id: 'i13', source: 'prompt-submit', target: 'ino', style: edgeStyle(COLORS.guardian, '30') },
  { id: 'i14', source: 'prompt-submit', target: 'shinkami', animated: true, style: edgeStyle(COLORS.guardian, '60') },
  // Guardians to state
  { id: 'i15', source: 'shinkami', target: 'state-protocol', style: edgeStyle(COLORS.memory, '50') },
  { id: 'i16', source: 'alera', target: 'state-protocol', style: edgeStyle(COLORS.memory, '30') },
  { id: 'i17', source: 'state-protocol', target: 'statusline', style: edgeStyle(COLORS.core, '50') },
  // Model routing to tiers
  { id: 'i18', source: 'model-route', target: 'tier1', style: edgeStyle(COLORS.infra, '30') },
  { id: 'i19', source: 'model-route', target: 'tier2', style: edgeStyle(COLORS.agent, '30') },
  { id: 'i20', source: 'model-route', target: 'tier3', style: edgeStyle(COLORS.feature, '40') },
];

export const intelligenceLegend: Record<string, string> = {
  Session: COLORS.core,
  Hooks: COLORS.infra,
  Guardians: COLORS.guardian,
  'State Protocol': COLORS.memory,
  'Model Tiers': COLORS.agent,
};

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

// ─── Roadmap: Now vs Next ───────────────────────────────────────────────────────

const ROADMAP_NOW = '#10b981';
const ROADMAP_NEXT = '#ffd700';

export const roadmapNodes: Node[] = [
  // Header labels
  {
    id: 'rm-title-now',
    position: { x: 150, y: 20 },
    data: { label: 'NOW — What\'s Built' },
    style: nodeStyle(ROADMAP_NOW, { bold: true, large: true }),
  },
  {
    id: 'rm-title-next',
    position: { x: 700, y: 20 },
    data: { label: 'NEXT — Working Towards' },
    style: nodeStyle(ROADMAP_NEXT, { bold: true, large: true }),
  },
  // NOW column (left)
  {
    id: 'rm-now-site',
    position: { x: 50, y: 110 },
    data: { label: 'arcanea.ai\nDeployed · 200 response' },
    style: nodeStyle(ROADMAP_NOW, { accent: true }),
  },
  {
    id: 'rm-now-guardians',
    position: { x: 250, y: 110 },
    data: { label: '10 Guardians\nActive in hooks' },
    style: nodeStyle(ROADMAP_NOW, { accent: true }),
  },
  {
    id: 'rm-now-statusline',
    position: { x: 50, y: 210 },
    data: { label: 'Statusline v5\nRate limits · Dynamic routing' },
    style: nodeStyle(ROADMAP_NOW, { accent: true }),
  },
  {
    id: 'rm-now-skills',
    position: { x: 250, y: 210 },
    data: { label: '54+ Skills\nAuto-activating' },
    style: nodeStyle(ROADMAP_NOW, { accent: true }),
  },
  {
    id: 'rm-now-cli',
    position: { x: 50, y: 310 },
    data: { label: 'claude-arcanea CLI\nv2.0.0' },
    style: nodeStyle(ROADMAP_NOW, { accent: true }),
  },
  {
    id: 'rm-now-ohmyarcanea',
    position: { x: 250, y: 310 },
    data: { label: 'oh-my-arcanea\nv4.0.0' },
    style: nodeStyle(ROADMAP_NOW, { accent: true }),
  },
  {
    id: 'rm-now-orchestrator',
    position: { x: 50, y: 410 },
    data: { label: 'arcanea-orchestrator\nGuardian plugin' },
    style: nodeStyle(ROADMAP_NOW, { accent: true }),
  },
  {
    id: 'rm-now-session',
    position: { x: 250, y: 410 },
    data: { label: 'Session Continuity\nHooks wired' },
    style: nodeStyle(ROADMAP_NOW, { accent: true }),
  },
  {
    id: 'rm-now-memory',
    position: { x: 50, y: 510 },
    data: { label: '6 Memory Vaults\nFile-based' },
    style: nodeStyle(ROADMAP_NOW, { accent: true }),
  },
  {
    id: 'rm-now-library',
    position: { x: 250, y: 510 },
    data: { label: '200K+ Words Library\n20 collections' },
    style: nodeStyle(ROADMAP_NOW, { accent: true }),
  },
  // NEXT column (right)
  {
    id: 'rm-next-starlight',
    position: { x: 600, y: 110 },
    data: { label: 'Starlight SDK\nPublish to npm' },
    style: nodeStyle(ROADMAP_NEXT, { accent: true }),
  },
  {
    id: 'rm-next-orchestrator',
    position: { x: 800, y: 110 },
    data: { label: 'arcanea-orchestrator\nReal agent spawning' },
    style: nodeStyle(ROADMAP_NEXT, { accent: true }),
  },
  {
    id: 'rm-next-statusline',
    position: { x: 600, y: 210 },
    data: { label: '@arcanea/statusline\nnpm package' },
    style: nodeStyle(ROADMAP_NEXT, { accent: true }),
  },
  {
    id: 'rm-next-mem0',
    position: { x: 800, y: 210 },
    data: { label: 'Mem0 Integration\nPersistent agent memory' },
    style: nodeStyle(ROADMAP_NEXT, { accent: true }),
  },
  {
    id: 'rm-next-comfyui',
    position: { x: 600, y: 310 },
    data: { label: 'ComfyUI Pipeline\nGuardian art generation' },
    style: nodeStyle(ROADMAP_NEXT, { accent: true }),
  },
  {
    id: 'rm-next-musicgen',
    position: { x: 800, y: 310 },
    data: { label: 'MusicGen Integration\nGate frequencies' },
    style: nodeStyle(ROADMAP_NEXT, { accent: true }),
  },
  {
    id: 'rm-next-vscode',
    position: { x: 600, y: 410 },
    data: { label: 'arcanea-vscode\nExtension' },
    style: nodeStyle(ROADMAP_NEXT, { accent: true }),
  },
  {
    id: 'rm-next-chrome',
    position: { x: 800, y: 410 },
    data: { label: 'arcanea-chrome\nExtension' },
    style: nodeStyle(ROADMAP_NEXT, { accent: true }),
  },
  {
    id: 'rm-next-swarms',
    position: { x: 600, y: 510 },
    data: { label: 'Multi-Agent Swarms\nCode + Lore + Art + Music' },
    style: nodeStyle(ROADMAP_NEXT, { accent: true }),
  },
  {
    id: 'rm-next-marketplace',
    position: { x: 800, y: 510 },
    data: { label: 'Community Marketplace\nSkills · Worlds · Agents' },
    style: nodeStyle(ROADMAP_NEXT, { accent: true }),
  },
];

const dashedEdge = (color: string) => ({
  stroke: color + '50',
  strokeDasharray: '6 4',
});

export const roadmapEdges: Edge[] = [
  // NOW → NEXT progression (dashed)
  { id: 'rm-e1', source: 'rm-now-site', target: 'rm-next-starlight', style: dashedEdge(ROADMAP_NEXT), type: 'smoothstep', label: 'SDK', labelStyle: { fill: '#666', fontSize: 9 } },
  { id: 'rm-e2', source: 'rm-now-guardians', target: 'rm-next-orchestrator', style: dashedEdge(ROADMAP_NEXT), type: 'smoothstep' },
  { id: 'rm-e3', source: 'rm-now-statusline', target: 'rm-next-statusline', style: dashedEdge(ROADMAP_NEXT), type: 'smoothstep', label: 'npm', labelStyle: { fill: '#666', fontSize: 9 } },
  { id: 'rm-e4', source: 'rm-now-memory', target: 'rm-next-mem0', style: dashedEdge(ROADMAP_NEXT), type: 'smoothstep', label: 'upgrade', labelStyle: { fill: '#666', fontSize: 9 } },
  { id: 'rm-e5', source: 'rm-now-skills', target: 'rm-next-comfyui', style: dashedEdge(ROADMAP_NEXT), type: 'smoothstep' },
  { id: 'rm-e6', source: 'rm-now-library', target: 'rm-next-musicgen', style: dashedEdge(ROADMAP_NEXT), type: 'smoothstep' },
  { id: 'rm-e7', source: 'rm-now-cli', target: 'rm-next-vscode', style: dashedEdge(ROADMAP_NEXT), type: 'smoothstep', label: 'extend', labelStyle: { fill: '#666', fontSize: 9 } },
  { id: 'rm-e8', source: 'rm-now-ohmyarcanea', target: 'rm-next-chrome', style: dashedEdge(ROADMAP_NEXT), type: 'smoothstep' },
  { id: 'rm-e9', source: 'rm-now-orchestrator', target: 'rm-next-swarms', style: dashedEdge(ROADMAP_NEXT), type: 'smoothstep' },
  { id: 'rm-e10', source: 'rm-now-session', target: 'rm-next-marketplace', style: dashedEdge(ROADMAP_NEXT), type: 'smoothstep' },
  // Internal NOW connections (subtle)
  { id: 'rm-e11', source: 'rm-now-site', target: 'rm-now-guardians', style: edgeStyle(ROADMAP_NOW, '20') },
  { id: 'rm-e12', source: 'rm-now-guardians', target: 'rm-now-session', style: edgeStyle(ROADMAP_NOW, '20') },
  { id: 'rm-e13', source: 'rm-now-cli', target: 'rm-now-skills', style: edgeStyle(ROADMAP_NOW, '20') },
  // Internal NEXT connections (subtle)
  { id: 'rm-e14', source: 'rm-next-starlight', target: 'rm-next-marketplace', style: edgeStyle(ROADMAP_NEXT, '20'), type: 'smoothstep' },
  { id: 'rm-e15', source: 'rm-next-swarms', target: 'rm-next-marketplace', style: edgeStyle(ROADMAP_NEXT, '20') },
];

export const roadmapLegend: Record<string, string> = {
  'Built (Now)': ROADMAP_NOW,
  'Planned (Next)': ROADMAP_NEXT,
};

// ─── Business: Creator Journey & Revenue ────────────────────────────────────────

const BIZ_JOURNEY = '#7fffd4';   // Atlantean Teal
const BIZ_REVENUE = '#ffd700';   // Gold
const BIZ_FLYWHEEL = '#78a6ff';  // Cosmic Blue

export const businessNodes: Node[] = [
  // Creator Journey (top-to-bottom, left side)
  {
    id: 'biz-discover',
    position: { x: 200, y: 30 },
    data: { label: 'DISCOVER\nFind Arcanea via community or content' },
    style: nodeStyle(BIZ_JOURNEY, { bold: true }),
  },
  {
    id: 'biz-chat',
    position: { x: 200, y: 130 },
    data: { label: 'CHAT / IMAGINE\nTalk to AI · Generate images' },
    style: nodeStyle(BIZ_JOURNEY),
  },
  {
    id: 'biz-build',
    position: { x: 200, y: 230 },
    data: { label: 'BUILD WORLD\nGates · Archetypes · Elements' },
    style: nodeStyle(BIZ_JOURNEY),
  },
  {
    id: 'biz-create',
    position: { x: 200, y: 330 },
    data: { label: 'CREATE CONTENT\nStories · Art · Music · Agents' },
    style: nodeStyle(BIZ_JOURNEY),
  },
  {
    id: 'biz-publish',
    position: { x: 200, y: 430 },
    data: { label: 'PUBLISH\nShare to feed · List on marketplace' },
    style: nodeStyle(BIZ_JOURNEY),
  },
  {
    id: 'biz-earn',
    position: { x: 200, y: 530 },
    data: { label: 'EARN\nMonetize creations · Subscriptions' },
    style: nodeStyle(BIZ_JOURNEY, { bold: true }),
  },
  {
    id: 'biz-expand',
    position: { x: 200, y: 630 },
    data: { label: 'EXPAND\nGrow multiverse · Collaborate' },
    style: nodeStyle(BIZ_JOURNEY, { bold: true }),
  },
  // Revenue Streams (right side)
  {
    id: 'biz-rev-title',
    position: { x: 600, y: 30 },
    data: { label: 'Revenue Streams' },
    style: nodeStyle(BIZ_REVENUE, { bold: true, large: true }),
  },
  {
    id: 'biz-free',
    position: { x: 550, y: 130 },
    data: { label: 'Free Tier\nChat · Basic imagine · Library access' },
    style: nodeStyle(BIZ_REVENUE, { dim: true }),
  },
  {
    id: 'biz-credits',
    position: { x: 550, y: 230 },
    data: { label: 'Credits — From $5\nPay per creation · Never expire\n50 / 250 / 750 packs' },
    style: nodeStyle(BIZ_REVENUE),
  },
  {
    id: 'biz-forge',
    position: { x: 550, y: 350 },
    data: { label: 'Forge — $29/mo\nUnlimited creation · Priority GPU\nCustom Guardians' },
    style: nodeStyle(BIZ_REVENUE, { bold: true }),
  },
  {
    id: 'biz-enterprise',
    position: { x: 550, y: 470 },
    data: { label: 'Enterprise — Custom\nWhite-label · API access\nDedicated support' },
    style: nodeStyle(BIZ_REVENUE, { accent: true }),
  },
  // Ecosystem Flywheel (bottom center)
  {
    id: 'biz-fly-title',
    position: { x: 350, y: 720 },
    data: { label: 'Ecosystem Flywheel' },
    style: nodeStyle(BIZ_FLYWHEEL, { bold: true, large: true }),
  },
  {
    id: 'biz-fly-create',
    position: { x: 150, y: 820 },
    data: { label: 'Creators make\ncontent' },
    style: nodeStyle(BIZ_FLYWHEEL, { accent: true }),
  },
  {
    id: 'biz-fly-attract',
    position: { x: 400, y: 820 },
    data: { label: 'Content attracts\nusers' },
    style: nodeStyle(BIZ_FLYWHEEL, { accent: true }),
  },
  {
    id: 'biz-fly-convert',
    position: { x: 650, y: 820 },
    data: { label: 'Users become\ncreators' },
    style: nodeStyle(BIZ_FLYWHEEL, { accent: true }),
  },
];

export const businessEdges: Edge[] = [
  // Creator Journey flow (top to bottom)
  { id: 'biz-e1', source: 'biz-discover', target: 'biz-chat', animated: true, style: edgeStyle(BIZ_JOURNEY, '60') },
  { id: 'biz-e2', source: 'biz-chat', target: 'biz-build', animated: true, style: edgeStyle(BIZ_JOURNEY, '60') },
  { id: 'biz-e3', source: 'biz-build', target: 'biz-create', animated: true, style: edgeStyle(BIZ_JOURNEY, '60') },
  { id: 'biz-e4', source: 'biz-create', target: 'biz-publish', animated: true, style: edgeStyle(BIZ_JOURNEY, '60') },
  { id: 'biz-e5', source: 'biz-publish', target: 'biz-earn', animated: true, style: edgeStyle(BIZ_JOURNEY, '60') },
  { id: 'biz-e6', source: 'biz-earn', target: 'biz-expand', animated: true, style: edgeStyle(BIZ_JOURNEY, '60') },
  // Expand loops back to discover
  { id: 'biz-e7', source: 'biz-expand', target: 'biz-discover', style: { stroke: BIZ_JOURNEY + '30', strokeDasharray: '6 4' }, type: 'smoothstep' },
  // Revenue tiers connected
  { id: 'biz-e8', source: 'biz-rev-title', target: 'biz-free', style: edgeStyle(BIZ_REVENUE, '40') },
  { id: 'biz-e9', source: 'biz-free', target: 'biz-credits', style: edgeStyle(BIZ_REVENUE, '40') },
  { id: 'biz-e10', source: 'biz-credits', target: 'biz-forge', style: edgeStyle(BIZ_REVENUE, '50') },
  { id: 'biz-e11', source: 'biz-forge', target: 'biz-enterprise', style: edgeStyle(BIZ_REVENUE, '40') },
  // Journey to Revenue connections
  { id: 'biz-e12', source: 'biz-chat', target: 'biz-free', style: edgeStyle(BIZ_REVENUE, '20'), type: 'smoothstep', label: 'free', labelStyle: { fill: '#666', fontSize: 9 } },
  { id: 'biz-e13', source: 'biz-build', target: 'biz-credits', style: edgeStyle(BIZ_REVENUE, '20'), type: 'smoothstep', label: 'buy credits', labelStyle: { fill: '#666', fontSize: 9 } },
  { id: 'biz-e14', source: 'biz-publish', target: 'biz-forge', style: edgeStyle(BIZ_REVENUE, '20'), type: 'smoothstep', label: 'go unlimited', labelStyle: { fill: '#666', fontSize: 9 } },
  // Flywheel circular connections
  { id: 'biz-e15', source: 'biz-fly-create', target: 'biz-fly-attract', animated: true, style: edgeStyle(BIZ_FLYWHEEL, '60') },
  { id: 'biz-e16', source: 'biz-fly-attract', target: 'biz-fly-convert', animated: true, style: edgeStyle(BIZ_FLYWHEEL, '60') },
  { id: 'biz-e17', source: 'biz-fly-convert', target: 'biz-fly-create', animated: true, style: edgeStyle(BIZ_FLYWHEEL, '60'), type: 'smoothstep' },
  // Flywheel connects to journey
  { id: 'biz-e18', source: 'biz-expand', target: 'biz-fly-title', style: edgeStyle(BIZ_FLYWHEEL, '30') },
];

export const businessLegend: Record<string, string> = {
  'Creator Journey': BIZ_JOURNEY,
  Revenue: BIZ_REVENUE,
  Flywheel: BIZ_FLYWHEEL,
};
