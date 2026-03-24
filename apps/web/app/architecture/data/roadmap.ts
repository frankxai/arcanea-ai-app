import type { Node, Edge } from '@xyflow/react';
import { nodeStyle, edgeStyle } from './colors';

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
