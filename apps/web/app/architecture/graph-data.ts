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
    position: { x: 340, y: 340 },
    data: { label: 'arcanea-guardian\nActive Guardian name' },
    style: nodeStyle(COLORS.guardian, { dim: true }),
  },
  {
    id: 'context-state',
    position: { x: 480, y: 340 },
    data: { label: 'arcanea-context-status\nToken tracking' },
    style: nodeStyle(COLORS.core, { dim: true }),
  },
  // Vault operations
  {
    id: 'vault-remember',
    position: { x: 590, y: 340 },
    data: { label: 'vault_remember\nStore with embeddings' },
    style: nodeStyle(COLORS.agent, { dim: true }),
  },
  {
    id: 'vault-recall',
    position: { x: 730, y: 340 },
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
