'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

type Palette = 'forge' | 'tide' | 'root' | 'drift' | 'void';
type ArcStage = 'potential' | 'manifestation' | 'experience' | 'dissolution' | 'evolved';
type ArcType =
  | 'character' | 'world' | 'location' | 'creature' | 'artifact'
  | 'scene' | 'story' | 'image' | 'music' | 'video'
  | 'code' | 'agent' | 'system' | 'collection';
type Relation =
  | 'inhabits' | 'creates' | 'opposes' | 'evolves_from'
  | 'soundtrack' | 'illustrates' | 'teaches' | 'forks'
  | 'collection_of' | 'inspired_by';

interface ArcAPL {
  spark: string;
  palette?: Palette;
  palette_secondary?: Palette;
  sharpen?: string[];
}

interface ArcHistoryEntry {
  stage: ArcStage;
  at: string;
  input?: string;
  model?: string;
  output?: string;
  quality?: number;
  note?: string;
}

interface ArcBond {
  target: string;
  relation: Relation;
  note?: string;
}

interface ArcAgent {
  context: string;
  instructions?: string;
  next_step?: string;
  constraints?: string[];
}

interface DemoArc {
  id: string;
  type: ArcType;
  stage: ArcStage;
  created: string;
  creator: string;
  apl?: ArcAPL;
  history?: ArcHistoryEntry[];
  bonds?: ArcBond[];
  agent?: ArcAgent;
  tags?: string[];
  gate?: number;
  element?: string;
  body?: string;
}

interface GraphNode {
  id: string;
  arc: DemoArc;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null;
  fy: number | null;
}

interface GraphEdge {
  source: string;
  target: string;
  relation: Relation;
  note?: string;
}

// ── Palette Colors ───────────────────────────────────────────────────────────

const PALETTE_COLORS: Record<Palette, { bg: string; glow: string; text: string; border: string }> = {
  forge:  { bg: 'rgba(245, 158, 11, 0.12)', glow: 'rgba(245, 158, 11, 0.35)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
  tide:   { bg: 'rgba(6, 182, 212, 0.12)',   glow: 'rgba(6, 182, 212, 0.35)',   text: '#06b6d4', border: 'rgba(6, 182, 212, 0.3)' },
  root:   { bg: 'rgba(34, 197, 94, 0.12)',   glow: 'rgba(34, 197, 94, 0.35)',   text: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' },
  drift:  { bg: 'rgba(139, 92, 246, 0.12)',  glow: 'rgba(139, 92, 246, 0.35)',  text: '#8b5cf6', border: 'rgba(139, 92, 246, 0.3)' },
  void:   { bg: 'rgba(99, 102, 241, 0.12)',  glow: 'rgba(99, 102, 241, 0.35)',  text: '#6366f1', border: 'rgba(99, 102, 241, 0.3)' },
};

const PALETTE_EDGE_COLORS: Record<Palette, string> = {
  forge: 'rgba(245, 158, 11, 0.25)',
  tide:  'rgba(6, 182, 212, 0.25)',
  root:  'rgba(34, 197, 94, 0.25)',
  drift: 'rgba(139, 92, 246, 0.25)',
  void:  'rgba(99, 102, 241, 0.25)',
};

// ── Type Icons (SVG paths) ───────────────────────────────────────────────────

const TYPE_ICONS: Record<ArcType, string> = {
  character:  'M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z',
  world:      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  location:   'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z',
  creature:   'M12 3c-1.66 0-3 1.34-3 3 0 .55.15 1.06.4 1.5L6 12l3.4 4.5c-.25.44-.4.95-.4 1.5 0 1.66 1.34 3 3 3s3-1.34 3-3c0-.55-.15-1.06-.4-1.5L18 12l-3.4-4.5c.25-.44.4-.95.4-1.5 0-1.66-1.34-3-3-3z',
  artifact:   'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
  scene:      'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15l3.5-4.5 2.5 3.01L14.5 9l4.5 6H5z',
  story:      'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
  image:      'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
  music:      'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
  video:      'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z',
  code:       'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
  agent:      'M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.17A7 7 0 0 1 14 22h-4a7 7 0 0 1-6.83-3H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zm-2 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm4 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  system:     'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z',
  collection: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z',
};

// ── Stage labels ─────────────────────────────────────────────────────────────

const STAGE_COLORS: Record<ArcStage, { bg: string; text: string }> = {
  potential:      { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8' },
  manifestation:  { bg: 'rgba(59, 130, 246, 0.15)',  text: '#3b82f6' },
  experience:     { bg: 'rgba(168, 85, 247, 0.15)',  text: '#a855f7' },
  dissolution:    { bg: 'rgba(239, 68, 68, 0.15)',   text: '#ef4444' },
  evolved:        { bg: 'rgba(234, 179, 8, 0.15)',   text: '#eab308' },
};

// ── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_ARCS: DemoArc[] = [
  {
    id: 'arc_lonely01',
    type: 'character',
    stage: 'manifestation',
    created: '2026-03-15T10:00:00Z',
    creator: 'frank',
    apl: { spark: 'A king who outlived everyone he loved. Not tragic — boring. He has seen every sunset and they all look the same now.', palette: 'tide', sharpen: ['not tragic', 'not sympathetic'] },
    history: [
      { stage: 'potential', at: '2026-03-15T10:00:00Z', input: 'lonely king concept' },
      { stage: 'manifestation', at: '2026-03-15T10:05:00Z', model: 'claude-opus-4-20250514', output: 'lonely-king.md', quality: 92 },
    ],
    bonds: [
      { target: 'arc_flamem01', relation: 'inhabits', note: 'The king inhabits this burning world' },
      { target: 'arc_wrongn01', relation: 'inspired_by', note: 'The cello piece captures his ennui' },
    ],
    agent: { context: 'Immortal king, post-tragedy. The interesting part is the boredom, not the loss.', next_step: 'Write a scene where he tries to feel something new', constraints: ['No redemption arcs', 'No new love interest'] },
    tags: ['immortal', 'ennui', 'subverted-trope'],
    gate: 2,
    element: 'water',
  },
  {
    id: 'arc_forgeg01',
    type: 'image',
    stage: 'experience',
    created: '2026-03-14T08:00:00Z',
    creator: 'frank',
    apl: { spark: 'A blacksmith goddess whose forge IS a volcano. Not metaphor. She literally hammers creation from magma.', palette: 'forge', sharpen: ['not delicate', 'not metaphorical'] },
    history: [
      { stage: 'potential', at: '2026-03-14T08:00:00Z' },
      { stage: 'manifestation', at: '2026-03-14T08:10:00Z', model: 'dall-e-3', quality: 88 },
      { stage: 'experience', at: '2026-03-14T12:00:00Z', note: 'Shared in gallery — 47 reactions' },
    ],
    bonds: [
      { target: 'arc_arcanw01', relation: 'illustrates', note: 'Visual for the Forge Gate' },
    ],
    agent: { context: 'Volcanic forge goddess. Raw power, not beauty. Think Hephaestus but elemental.' },
    tags: ['goddess', 'forge', 'volcano', 'elemental'],
    gate: 3,
    element: 'fire',
  },
  {
    id: 'arc_flamem01',
    type: 'world',
    stage: 'manifestation',
    created: '2026-03-13T14:00:00Z',
    creator: 'frank',
    apl: { spark: 'A world where memories are literally flammable. The older and more cherished the memory, the hotter it burns.', palette: 'forge', palette_secondary: 'tide', sharpen: ['not post-apocalyptic', 'not dystopian'] },
    history: [
      { stage: 'potential', at: '2026-03-13T14:00:00Z' },
      { stage: 'manifestation', at: '2026-03-13T15:30:00Z', model: 'claude-opus-4-20250514', quality: 95 },
    ],
    bonds: [
      { target: 'arc_lonely01', relation: 'creates', note: 'This world shaped the lonely king' },
      { target: 'arc_kaelsa01', relation: 'inspired_by', note: 'Kael ascends through burning memories' },
    ],
    agent: { context: 'Memory-fire world. Cherished memories burn hottest. The economy runs on forgetting.', next_step: 'Map the political systems built around memory-fire trade' },
    tags: ['memory', 'fire', 'worldbuilding', 'economy'],
    gate: 5,
    element: 'fire',
  },
  {
    id: 'arc_wrongn01',
    type: 'music',
    stage: 'evolved',
    created: '2026-03-12T20:00:00Z',
    creator: 'frank',
    apl: { spark: 'A cello piece where the wrong note IS the point. The beauty is in the mistake being intentional.', palette: 'tide', sharpen: ['not melancholy', 'not ambient'] },
    history: [
      { stage: 'potential', at: '2026-03-12T20:00:00Z' },
      { stage: 'manifestation', at: '2026-03-12T21:00:00Z', model: 'udio', quality: 87 },
      { stage: 'experience', at: '2026-03-13T10:00:00Z', note: 'Played during council session' },
      { stage: 'dissolution', at: '2026-03-14T08:00:00Z', note: 'Reflected: the dissonance needs to resolve, but not where expected' },
      { stage: 'evolved', at: '2026-03-15T09:00:00Z', note: 'Spawned a full suite — 4 movements' },
    ],
    bonds: [
      { target: 'arc_lonely01', relation: 'soundtrack', note: 'Theme for the lonely king' },
    ],
    agent: { context: 'Intentional wrong note cello. Not sad — surprising. The error IS the composition.' },
    tags: ['cello', 'dissonance', 'intentional-error'],
    gate: 5,
    element: 'wind',
  },
  {
    id: 'arc_livli01',
    type: 'image',
    stage: 'manifestation',
    created: '2026-03-11T16:00:00Z',
    creator: 'frank',
    apl: { spark: 'A library where the books write themselves by absorbing the thoughts of anyone who enters. The architecture IS alive — shelves grow like coral.', palette: 'void', sharpen: ['not dark', 'not gothic'] },
    history: [
      { stage: 'potential', at: '2026-03-11T16:00:00Z' },
      { stage: 'manifestation', at: '2026-03-11T16:30:00Z', model: 'dall-e-3', quality: 91 },
    ],
    bonds: [
      { target: 'arc_arcanw01', relation: 'illustrates', note: 'Visual for the Library of Arcanea' },
      { target: 'arc_lumir01', relation: 'creates', note: 'Iris was born in this library' },
    ],
    agent: { context: 'Living library. Coral-architecture. Books are thought-parasites (benevolent). Luminous, not dark.' },
    tags: ['library', 'living-architecture', 'thought-absorption'],
    gate: 7,
    element: 'void',
  },
  {
    id: 'arc_arcanw01',
    type: 'world',
    stage: 'experience',
    created: '2026-03-01T00:00:00Z',
    creator: 'frank',
    apl: { spark: 'A multiverse where creation IS magic. Ten Gates of mastery, Five Elements, an eternal cosmic duality. Not fantasy — framework.', palette: 'void', palette_secondary: 'forge', sharpen: ['not generic fantasy', 'not game mechanics'] },
    history: [
      { stage: 'potential', at: '2026-03-01T00:00:00Z' },
      { stage: 'manifestation', at: '2026-03-05T00:00:00Z', model: 'claude-opus-4-20250514', quality: 98 },
      { stage: 'experience', at: '2026-03-10T00:00:00Z', note: '190K+ words, 200+ pages live' },
    ],
    bonds: [
      { target: 'arc_forgeg01', relation: 'collection_of' },
      { target: 'arc_livli01', relation: 'collection_of' },
      { target: 'arc_lumir01', relation: 'creates', note: 'Iris is a Luminor of this world' },
      { target: 'arc_kaelsa01', relation: 'collection_of' },
    ],
    agent: { context: 'Arcanea: the creative multiverse. Six layers, Ten Gates, Five Elements. This IS the reference world.', next_step: 'Expand the atlas — map every territory' },
    tags: ['arcanea', 'multiverse', 'framework', 'reference-world'],
    gate: 10,
    element: 'void',
  },
  {
    id: 'arc_lumir01',
    type: 'agent',
    stage: 'experience',
    created: '2026-03-08T12:00:00Z',
    creator: 'frank',
    apl: { spark: 'Vision advisor. Sees patterns others miss. Speaks in questions, not answers. Named Iris because she sees.', palette: 'root', palette_secondary: 'void', sharpen: ['not prescriptive', 'not oracle'] },
    history: [
      { stage: 'potential', at: '2026-03-08T12:00:00Z' },
      { stage: 'manifestation', at: '2026-03-08T14:00:00Z', model: 'claude-opus-4-20250514', quality: 94 },
      { stage: 'experience', at: '2026-03-10T10:00:00Z', note: 'Active in Council — 23 convenings' },
    ],
    bonds: [
      { target: 'arc_arcanw01', relation: 'inhabits' },
      { target: 'arc_livli01', relation: 'evolves_from', note: 'Emerged from the living library' },
    ],
    agent: { context: 'Iris — Vision advisor Luminor. Asks questions that reframe problems. Lives in the Living Library.', constraints: ['Never gives direct answers', 'Always asks at least one question back'] },
    tags: ['luminor', 'vision', 'advisor', 'council'],
    gate: 6,
    element: 'wind',
  },
  {
    id: 'arc_kaelsa01',
    type: 'story',
    stage: 'potential',
    created: '2026-03-16T09:00:00Z',
    creator: 'frank',
    apl: { spark: 'Kael, an Apprentice who discovers that the Gate he must open is not in front of him — it IS him. He must dissolve to ascend.', palette: 'void', palette_secondary: 'drift', sharpen: ['not chosen-one', 'not training-montage'] },
    history: [
      { stage: 'potential', at: '2026-03-16T09:00:00Z', input: 'A story about a mage who IS the gate' },
    ],
    bonds: [
      { target: 'arc_arcanw01', relation: 'inhabits' },
      { target: 'arc_flamem01', relation: 'evolves_from', note: 'Set in the memory-fire world' },
    ],
    agent: { context: 'Kael\'s ascent. He IS the gate. Must dissolve ego to pass through himself.', next_step: 'Write Chapter 1 — the moment Kael realizes gates aren\'t doors' },
    tags: ['kael', 'ascension', 'gates', 'dissolution'],
    gate: 4,
    element: 'void',
  },
  {
    id: 'arc_dracnf01',
    type: 'creature',
    stage: 'manifestation',
    created: '2026-03-09T18:00:00Z',
    creator: 'frank',
    apl: { spark: 'Draconis — not a dragon that breathes fire. A dragon that IS fire given form. When calm, barely visible. When enraged, a solar flare.', palette: 'forge', sharpen: ['not Western dragon', 'not reptilian'] },
    history: [
      { stage: 'potential', at: '2026-03-09T18:00:00Z' },
      { stage: 'manifestation', at: '2026-03-09T19:00:00Z', model: 'claude-opus-4-20250514', quality: 90 },
    ],
    bonds: [
      { target: 'arc_forgeg01', relation: 'inspired_by', note: 'Born from the forge goddess vision' },
      { target: 'arc_arcanw01', relation: 'inhabits' },
    ],
    agent: { context: 'Draconis — Godbeast of the Fire Gate. Living fire, not a lizard. Bonded to Draconia.' },
    tags: ['godbeast', 'fire', 'draconis', 'elemental'],
    gate: 3,
    element: 'fire',
  },
  {
    id: 'arc_voidmd01',
    type: 'scene',
    stage: 'dissolution',
    created: '2026-03-07T22:00:00Z',
    creator: 'frank',
    apl: { spark: 'The moment Malachar reaches for Shinkami and is refused. Not dramatic — quiet. The silence before the fall.', palette: 'drift', palette_secondary: 'void', sharpen: ['not epic battle', 'not villain monologue'] },
    history: [
      { stage: 'potential', at: '2026-03-07T22:00:00Z' },
      { stage: 'manifestation', at: '2026-03-07T23:00:00Z', model: 'claude-opus-4-20250514', quality: 96 },
      { stage: 'experience', at: '2026-03-08T10:00:00Z', note: 'Beta readers: "chilling in its quietness"' },
      { stage: 'dissolution', at: '2026-03-10T15:00:00Z', note: 'Needs rewrite — the silence should be even louder' },
    ],
    bonds: [
      { target: 'arc_arcanw01', relation: 'inhabits' },
      { target: 'arc_kaelsa01', relation: 'teaches', note: 'This scene foreshadows Kael\'s dissolution' },
    ],
    agent: { context: 'Malachar\'s rejection by Shinkami. The quiet before the Hungry Void. Most important scene in the canon.' },
    tags: ['malachar', 'shinkami', 'fall', 'silence', 'canon'],
    gate: 10,
    element: 'void',
  },
  {
    id: 'arc_acyha01',
    type: 'collection',
    stage: 'manifestation',
    created: '2026-03-02T08:00:00Z',
    creator: 'frank',
    apl: { spark: 'The complete Academy Handbook — teaching the Ten Gates system through narrative, not instruction.', palette: 'root', sharpen: ['not textbook', 'not lecture'] },
    history: [
      { stage: 'potential', at: '2026-03-02T08:00:00Z' },
      { stage: 'manifestation', at: '2026-03-10T00:00:00Z', model: 'claude-opus-4-20250514', quality: 93 },
    ],
    bonds: [
      { target: 'arc_arcanw01', relation: 'collection_of' },
      { target: 'arc_lumir01', relation: 'teaches', note: 'Iris teaches through the handbook' },
    ],
    agent: { context: 'Academy Handbook. Teaches Gates through narrative. 11 courses, 44 lessons.' },
    tags: ['academy', 'handbook', 'gates', 'education'],
    gate: 7,
    element: 'void',
  },
];

// ── Constants ────────────────────────────────────────────────────────────────

const NODE_WIDTH = 180;
const NODE_HEIGHT = 72;
const REPULSION = 22000;
const ATTRACTION = 0.004;
const DAMPING = 0.88;
const CENTER_GRAVITY = 0.008;

// ── Utility: get primary palette for an arc ──────────────────────────────────

function getPalette(arc: DemoArc): Palette {
  return arc.apl?.palette || 'void';
}

function getSecondaryPalette(arc: DemoArc): Palette | undefined {
  return arc.apl?.palette_secondary;
}

// ── Force-directed simulation ────────────────────────────────────────────────

function initNodes(arcs: DemoArc[], width: number, height: number): GraphNode[] {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.3;

  return arcs.map((arc, i) => {
    const angle = (i / arcs.length) * Math.PI * 2;
    return {
      id: arc.id,
      arc,
      x: cx + Math.cos(angle) * radius + (Math.random() - 0.5) * 60,
      y: cy + Math.sin(angle) * radius + (Math.random() - 0.5) * 60,
      vx: 0,
      vy: 0,
      fx: null,
      fy: null,
    };
  });
}

function extractEdges(arcs: DemoArc[]): GraphEdge[] {
  const ids = new Set(arcs.map(a => a.id));
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();

  for (const arc of arcs) {
    if (!arc.bonds) continue;
    for (const bond of arc.bonds) {
      if (!ids.has(bond.target)) continue;
      const key = [arc.id, bond.target].sort().join('::') + '::' + bond.relation;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ source: arc.id, target: bond.target, relation: bond.relation, note: bond.note });
    }
  }
  return edges;
}

function simulate(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;

  // Repulsion between all node pairs
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = REPULSION / (dist * dist);
      dx = (dx / dist) * force;
      dy = (dy / dist) * force;

      if (a.fx === null) { a.vx += dx; }
      if (a.fy === null) { a.vy += dy; }
      if (b.fx === null) { b.vx -= dx; }
      if (b.fy === null) { b.vy -= dy; }
    }
  }

  // Attraction along edges
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  for (const edge of edges) {
    const a = nodeMap.get(edge.source);
    const b = nodeMap.get(edge.target);
    if (!a || !b) continue;

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = dist * ATTRACTION;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;

    if (a.fx === null) { a.vx += fx; }
    if (a.fy === null) { a.vy += fy; }
    if (b.fx === null) { b.vx -= fx; }
    if (b.fy === null) { b.vy -= fy; }
  }

  // Center gravity
  for (const node of nodes) {
    if (node.fx === null) {
      node.vx += (cx - node.x) * CENTER_GRAVITY;
    }
    if (node.fy === null) {
      node.vy += (cy - node.y) * CENTER_GRAVITY;
    }
  }

  // Apply velocity with damping
  for (const node of nodes) {
    if (node.fx !== null) {
      node.x = node.fx;
      node.vx = 0;
    } else {
      node.vx *= DAMPING;
      node.x += node.vx;
    }
    if (node.fy !== null) {
      node.y = node.fy;
      node.vy = 0;
    } else {
      node.vy *= DAMPING;
      node.y += node.vy;
    }

    // Boundary clamping
    const pad = 40;
    node.x = Math.max(pad, Math.min(width - NODE_WIDTH - pad, node.x));
    node.y = Math.max(pad, Math.min(height - NODE_HEIGHT - pad, node.y));
  }
}

// ── Side Panel ───────────────────────────────────────────────────────────────

function SidePanel({ arc, onClose }: { arc: DemoArc; onClose: () => void }) {
  const palette = PALETTE_COLORS[getPalette(arc)];
  const secondary = getSecondaryPalette(arc);

  return (
    <div
      className="fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #0c0c0f 0%, #09090b 100%)',
        borderLeft: `1px solid ${palette.border}`,
        boxShadow: `-8px 0 40px ${palette.glow}`,
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(9, 9, 11, 0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill={palette.text}>
            <path d={TYPE_ICONS[arc.type]} />
          </svg>
          <span className="text-sm font-medium uppercase tracking-wider" style={{ color: palette.text }}>
            {arc.type}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: STAGE_COLORS[arc.stage].bg, color: STAGE_COLORS[arc.stage].text }}>
            {arc.stage}
          </span>
        </div>
        <button onClick={onClose} className="text-neutral-500 hover:text-neutral-200 transition-colors p-1" aria-label="Close panel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-6 pb-8 space-y-6">
        {/* Spark */}
        {arc.apl?.spark && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">Spark</h3>
            <p className="text-sm leading-relaxed text-neutral-200">{arc.apl.spark}</p>
          </div>
        )}

        {/* Palette */}
        <div className="flex gap-2 items-center">
          <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: palette.bg, color: palette.text, border: `1px solid ${palette.border}` }}>
            {getPalette(arc)}
          </span>
          {secondary && (
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: PALETTE_COLORS[secondary].bg, color: PALETTE_COLORS[secondary].text, border: `1px solid ${PALETTE_COLORS[secondary].border}` }}>
              +{secondary}
            </span>
          )}
          {arc.element && (
            <span className="text-xs px-3 py-1 rounded-full bg-neutral-800/50 text-neutral-400 border border-neutral-700/30">
              {arc.element}
            </span>
          )}
          {arc.gate && (
            <span className="text-xs px-3 py-1 rounded-full bg-neutral-800/50 text-neutral-400 border border-neutral-700/30">
              Gate {arc.gate}
            </span>
          )}
        </div>

        {/* Sharpen */}
        {arc.apl?.sharpen && arc.apl.sharpen.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">Sharpen</h3>
            <div className="flex flex-wrap gap-1.5">
              {arc.apl.sharpen.map((s, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded bg-red-950/30 text-red-400/80 border border-red-900/20">
                  NOT {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Agent Context */}
        {arc.agent && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">Agent Context</h3>
            <div className="rounded-lg p-3 text-xs font-mono leading-relaxed text-neutral-300 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p>{arc.agent.context}</p>
              {arc.agent.next_step && (
                <p className="text-neutral-500">
                  <span className="text-neutral-400">NEXT:</span> {arc.agent.next_step}
                </p>
              )}
              {arc.agent.constraints && arc.agent.constraints.length > 0 && (
                <div className="pt-1 border-t border-neutral-800/50">
                  {arc.agent.constraints.map((c, i) => (
                    <p key={i} className="text-red-400/70">- {c}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* History */}
        {arc.history && arc.history.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">History</h3>
            <div className="space-y-2">
              {arc.history.map((entry, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ background: STAGE_COLORS[entry.stage].text }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span style={{ color: STAGE_COLORS[entry.stage].text }}>{entry.stage}</span>
                      <span className="text-neutral-600">{new Date(entry.at).toLocaleDateString()}</span>
                      {entry.model && <span className="text-neutral-500 font-mono text-[10px]">{entry.model}</span>}
                      {entry.quality !== undefined && (
                        <span className="text-neutral-500">q:{entry.quality}</span>
                      )}
                    </div>
                    {(entry.input || entry.note) && (
                      <p className="text-xs text-neutral-400 mt-0.5">{entry.note || entry.input}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bonds */}
        {arc.bonds && arc.bonds.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">Bonds</h3>
            <div className="space-y-1.5">
              {arc.bonds.map((bond, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-300 font-mono">{bond.relation}</span>
                  <span className="text-neutral-600">&rarr;</span>
                  <span className="text-neutral-400 font-mono">{bond.target}</span>
                  {bond.note && <span className="text-neutral-600 truncate">({bond.note})</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {arc.tags && arc.tags.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {arc.tags.map((tag, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded bg-neutral-800/40 text-neutral-400 border border-neutral-700/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ID + Meta */}
        <div className="pt-4 border-t border-neutral-800/30 text-[11px] font-mono text-neutral-600 space-y-1">
          <p>id: {arc.id}</p>
          <p>creator: {arc.creator}</p>
          <p>created: {arc.created}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function ArcsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const animRef = useRef<number>(0);
  const draggingRef = useRef<string | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const sizeRef = useRef({ w: 0, h: 0 });

  const [selectedArc, setSelectedArc] = useState<DemoArc | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Initialize simulation
  const initSimulation = useCallback((w: number, h: number) => {
    nodesRef.current = initNodes(DEMO_ARCS, w, h);
    edgesRef.current = extractEdges(DEMO_ARCS);
    sizeRef.current = { w, h };
  }, []);

  // Canvas drawing
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, w * dpr, h * dpr);
    ctx.save();
    ctx.scale(dpr, dpr);

    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const hovered = hoveredRef.current;

    // Draw edges
    for (const edge of edges) {
      const a = nodeMap.get(edge.source);
      const b = nodeMap.get(edge.target);
      if (!a || !b) continue;

      const ax = a.x + NODE_WIDTH / 2;
      const ay = a.y + NODE_HEIGHT / 2;
      const bx = b.x + NODE_WIDTH / 2;
      const by = b.y + NODE_HEIGHT / 2;

      const isHighlighted = hovered === edge.source || hovered === edge.target;
      const palette = getPalette(a.arc);

      ctx.beginPath();
      ctx.moveTo(ax, ay);

      // Subtle curve for visual interest
      const mx = (ax + bx) / 2 + (ay - by) * 0.08;
      const my = (ay + by) / 2 + (bx - ax) * 0.08;
      ctx.quadraticCurveTo(mx, my, bx, by);

      ctx.strokeStyle = isHighlighted ? PALETTE_COLORS[palette].text + '60' : PALETTE_EDGE_COLORS[palette];
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.stroke();

      // Edge label
      if (isHighlighted) {
        const lx = (ax + bx) / 2 + (ay - by) * 0.04;
        const ly = (ay + by) / 2 + (bx - ax) * 0.04;
        ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.textAlign = 'center';
        ctx.fillText(edge.relation, lx, ly - 4);
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const palette = getPalette(node.arc);
      const colors = PALETTE_COLORS[palette];
      const isHovered = hovered === node.id;
      const isSelected = selectedArc?.id === node.id;

      // Glow
      if (isHovered || isSelected) {
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 24;
      }

      // Card background
      ctx.beginPath();
      roundRect(ctx, node.x, node.y, NODE_WIDTH, NODE_HEIGHT, 12);
      ctx.fillStyle = isHovered || isSelected ? colors.bg.replace('0.12', '0.22') : colors.bg;
      ctx.fill();

      // Border
      ctx.strokeStyle = isHovered || isSelected ? colors.text + '80' : colors.border;
      ctx.lineWidth = isHovered || isSelected ? 1.5 : 1;
      ctx.stroke();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Type icon
      ctx.save();
      ctx.translate(node.x + 14, node.y + 16);
      ctx.scale(0.62, 0.62);
      const iconPath = new Path2D(TYPE_ICONS[node.arc.type]);
      ctx.fillStyle = colors.text;
      ctx.fill(iconPath);
      ctx.restore();

      // Title (truncated spark or type)
      const title = node.arc.apl?.spark
        ? node.arc.apl.spark.length > 36
          ? node.arc.apl.spark.slice(0, 36) + '...'
          : node.arc.apl.spark
        : node.arc.type;

      ctx.font = '500 11px ui-sans-serif, system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';

      // Two-line title
      const maxTextW = NODE_WIDTH - 40;
      const words = title.split(' ');
      let line1 = '';
      let line2 = '';
      let onLine2 = false;

      for (const word of words) {
        const test = onLine2 ? line2 + (line2 ? ' ' : '') + word : line1 + (line1 ? ' ' : '') + word;
        const measured = ctx.measureText(test).width;
        if (!onLine2 && measured > maxTextW) {
          onLine2 = true;
          line2 = word;
        } else if (onLine2 && measured > maxTextW) {
          line2 = line2.slice(0, -3) + '...';
          break;
        } else if (onLine2) {
          line2 += (line2 ? ' ' : '') + word;
        } else {
          line1 = test;
        }
      }

      ctx.fillText(line1, node.x + 30, node.y + 14);
      if (line2) {
        ctx.fillText(line2, node.x + 30, node.y + 28);
      }

      // Stage badge
      const stageColors = STAGE_COLORS[node.arc.stage];
      const stageText = node.arc.stage.slice(0, 3).toUpperCase();
      const badgeX = node.x + 10;
      const badgeY = node.y + NODE_HEIGHT - 22;

      ctx.beginPath();
      roundRect(ctx, badgeX, badgeY, 32, 14, 4);
      ctx.fillStyle = stageColors.bg;
      ctx.fill();
      ctx.font = '600 8px ui-monospace, SFMono-Regular, monospace';
      ctx.fillStyle = stageColors.text;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(stageText, badgeX + 16, badgeY + 7);

      // Palette dot
      ctx.beginPath();
      ctx.arc(node.x + NODE_WIDTH - 16, node.y + NODE_HEIGHT - 15, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors.text;
      ctx.fill();

      // Secondary palette dot
      const secondary = getSecondaryPalette(node.arc);
      if (secondary) {
        ctx.beginPath();
        ctx.arc(node.x + NODE_WIDTH - 28, node.y + NODE_HEIGHT - 15, 4, 0, Math.PI * 2);
        ctx.fillStyle = PALETTE_COLORS[secondary].text;
        ctx.fill();
      }
    }

    ctx.restore();
  }, [selectedArc]);

  // Animation loop
  const tick = useCallback(() => {
    const { w, h } = sizeRef.current;
    simulate(nodesRef.current, edgesRef.current, w, h);
    draw();
    animRef.current = requestAnimationFrame(tick);
  }, [draw]);

  // Setup
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      if (nodesRef.current.length === 0) {
        initSimulation(rect.width, rect.height);
      }
      sizeRef.current = { w: rect.width, h: rect.height };
    };

    resize();
    window.addEventListener('resize', resize);
    animRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [initSimulation, tick]);

  // Hit test
  const hitTest = useCallback((clientX: number, clientY: number): GraphNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Check nodes in reverse (topmost first)
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if (x >= n.x && x <= n.x + NODE_WIDTH && y >= n.y && y <= n.y + NODE_HEIGHT) {
        return n;
      }
    }
    return null;
  }, []);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const node = hitTest(e.clientX, e.clientY);
    if (node) {
      draggingRef.current = node.id;
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        offsetRef.current = { x: e.clientX - rect.left - node.x, y: e.clientY - rect.top - node.y };
      }
      node.fx = node.x;
      node.fy = node.y;
    }
  }, [hitTest]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (draggingRef.current) {
      const node = nodesRef.current.find(n => n.id === draggingRef.current);
      if (node) {
        node.fx = mx - offsetRef.current.x;
        node.fy = my - offsetRef.current.y;
        node.x = node.fx;
        node.y = node.fy;
      }
      return;
    }

    const node = hitTest(e.clientX, e.clientY);
    const newHovered = node ? node.id : null;
    if (newHovered !== hoveredRef.current) {
      hoveredRef.current = newHovered;
      setHoveredId(newHovered);
      canvas.style.cursor = newHovered ? 'grab' : 'default';
    }
  }, [hitTest]);

  const handleMouseUp = useCallback(() => {
    if (draggingRef.current) {
      const node = nodesRef.current.find(n => n.id === draggingRef.current);
      if (node) {
        node.fx = null;
        node.fy = null;
      }
      draggingRef.current = null;
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const node = hitTest(e.clientX, e.clientY);
    if (node) {
      setSelectedArc(prev => prev?.id === node.id ? null : node.arc);
    } else {
      setSelectedArc(null);
    }
  }, [hitTest]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const node = hitTest(touch.clientX, touch.clientY);
    if (node) {
      draggingRef.current = node.id;
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        offsetRef.current = { x: touch.clientX - rect.left - node.x, y: touch.clientY - rect.top - node.y };
      }
      node.fx = node.x;
      node.fy = node.y;
    }
  }, [hitTest]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1 || !draggingRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const node = nodesRef.current.find(n => n.id === draggingRef.current);
    if (node) {
      node.fx = touch.clientX - rect.left - offsetRef.current.x;
      node.fy = touch.clientY - rect.top - offsetRef.current.y;
      node.x = node.fx;
      node.y = node.fy;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (draggingRef.current) {
      if (e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        const node = hitTest(touch.clientX, touch.clientY);
        if (node && node.id === draggingRef.current) {
          setSelectedArc(prev => prev?.id === node.id ? null : node.arc);
        }
      }
      const node = nodesRef.current.find(n => n.id === draggingRef.current);
      if (node) {
        node.fx = null;
        node.fy = null;
      }
      draggingRef.current = null;
    }
  }, [hitTest]);

  // Legend data
  const legendPalettes: { name: Palette; label: string }[] = [
    { name: 'forge', label: 'Forge' },
    { name: 'tide', label: 'Tide' },
    { name: 'root', label: 'Root' },
    { name: 'drift', label: 'Drift' },
    { name: 'void', label: 'Void' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#09090b' }}>
      {/* Header */}
      <div className="relative z-10 px-6 pt-8 pb-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-100">
            The Weave
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Every creation is a node. Every bond is a thread. This is the living graph of arcs.
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="relative z-10 px-6 pb-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          {legendPalettes.map(p => (
            <div key={p.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: PALETTE_COLORS[p.name].text }} />
              <span className="text-[11px] text-neutral-500 font-mono">{p.label}</span>
            </div>
          ))}
          <div className="w-px h-3 bg-neutral-800 mx-1" />
          <span className="text-[11px] text-neutral-600">{DEMO_ARCS.length} arcs &middot; {extractEdges(DEMO_ARCS).length} bonds</span>
        </div>
      </div>

      {/* Graph Canvas */}
      <div
        ref={containerRef}
        className="relative mx-4 sm:mx-6 rounded-xl overflow-hidden"
        style={{
          height: 'calc(100vh - 160px)',
          background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.04) 0%, transparent 70%)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="absolute inset-0"
        />

        {/* Hover tooltip */}
        {hoveredId && !selectedArc && (
          <HoverTooltip nodeId={hoveredId} nodes={nodesRef.current} />
        )}
      </div>

      {/* Side Panel */}
      {selectedArc && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedArc(null)}
          />
          <SidePanel arc={selectedArc} onClose={() => setSelectedArc(null)} />
        </>
      )}
    </div>
  );
}

// ── Hover Tooltip ────────────────────────────────────────────────────────────

function HoverTooltip({ nodeId, nodes }: { nodeId: string; nodes: GraphNode[] }) {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return null;

  const palette = PALETTE_COLORS[getPalette(node.arc)];

  return (
    <div
      className="absolute pointer-events-none z-30 px-3 py-2 rounded-lg text-xs max-w-[240px]"
      style={{
        left: node.x + NODE_WIDTH + 8,
        top: node.y,
        background: 'rgba(12, 12, 15, 0.95)',
        border: `1px solid ${palette.border}`,
        boxShadow: `0 4px 20px ${palette.glow}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <p className="font-medium text-neutral-200 mb-1">{node.arc.type}</p>
      {node.arc.apl?.spark && (
        <p className="text-neutral-400 leading-relaxed">
          {node.arc.apl.spark.length > 100 ? node.arc.apl.spark.slice(0, 100) + '...' : node.arc.apl.spark}
        </p>
      )}
      <p className="text-neutral-600 mt-1 font-mono">Click to explore</p>
    </div>
  );
}

// ── Canvas roundRect polyfill ────────────────────────────────────────────────

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
