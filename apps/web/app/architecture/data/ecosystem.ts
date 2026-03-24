import type { Node, Edge } from '@xyflow/react';
import { COLORS, nodeStyle, edgeStyle } from './colors';

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
