import type { Node, Edge } from '@xyflow/react';
import { nodeStyle, edgeStyle } from './colors';

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
    data: { label: 'CHAT / IMAGINE\nTalk to AI \u00b7 Generate images' },
    style: nodeStyle(BIZ_JOURNEY),
  },
  {
    id: 'biz-build',
    position: { x: 200, y: 230 },
    data: { label: 'BUILD WORLD\nGates \u00b7 Archetypes \u00b7 Elements' },
    style: nodeStyle(BIZ_JOURNEY),
  },
  {
    id: 'biz-create',
    position: { x: 200, y: 330 },
    data: { label: 'CREATE CONTENT\nStories \u00b7 Art \u00b7 Music \u00b7 Agents' },
    style: nodeStyle(BIZ_JOURNEY),
  },
  {
    id: 'biz-publish',
    position: { x: 200, y: 430 },
    data: { label: 'PUBLISH\nShare to feed \u00b7 List on marketplace' },
    style: nodeStyle(BIZ_JOURNEY),
  },
  {
    id: 'biz-earn',
    position: { x: 200, y: 530 },
    data: { label: 'EARN\nMonetize creations \u00b7 Subscriptions' },
    style: nodeStyle(BIZ_JOURNEY, { bold: true }),
  },
  {
    id: 'biz-expand',
    position: { x: 200, y: 630 },
    data: { label: 'EXPAND\nGrow multiverse \u00b7 Collaborate' },
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
    data: { label: 'Free Tier\nChat \u00b7 Basic imagine \u00b7 Library access' },
    style: nodeStyle(BIZ_REVENUE, { dim: true }),
  },
  {
    id: 'biz-credits',
    position: { x: 550, y: 230 },
    data: { label: 'Credits \u2014 From $5\nPay per creation \u00b7 Never expire\n50 / 250 / 750 packs' },
    style: nodeStyle(BIZ_REVENUE),
  },
  {
    id: 'biz-forge',
    position: { x: 550, y: 350 },
    data: { label: 'Forge \u2014 $29/mo\nUnlimited creation \u00b7 Priority GPU\nCustom Guardians' },
    style: nodeStyle(BIZ_REVENUE, { bold: true }),
  },
  {
    id: 'biz-enterprise',
    position: { x: 550, y: 470 },
    data: { label: 'Enterprise \u2014 Custom\nWhite-label \u00b7 API access\nDedicated support' },
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
