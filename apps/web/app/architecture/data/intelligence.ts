import type { Node, Edge } from '@xyflow/react';
import { COLORS, nodeStyle, edgeStyle } from './colors';

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
