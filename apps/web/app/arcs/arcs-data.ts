export type Palette = 'forge' | 'tide' | 'root' | 'drift' | 'void';
export type ArcStage = 'potential' | 'manifestation' | 'experience' | 'dissolution' | 'evolved';
export type ArcType =
  | 'character' | 'world' | 'location' | 'creature' | 'artifact'
  | 'scene' | 'story' | 'image' | 'music' | 'video'
  | 'code' | 'agent' | 'system' | 'collection';
export type Relation =
  | 'inhabits' | 'creates' | 'opposes' | 'evolves_from'
  | 'soundtrack' | 'illustrates' | 'teaches' | 'forks'
  | 'collection_of' | 'inspired_by';

export interface ArcAPL {
  spark: string;
  palette?: Palette;
  palette_secondary?: Palette;
  sharpen?: string[];
}

export interface ArcHistoryEntry {
  stage: ArcStage;
  at: string;
  input?: string;
  model?: string;
  output?: string;
  quality?: number;
  note?: string;
}

export interface ArcBond {
  target: string;
  relation: Relation;
  note?: string;
}

export interface ArcAgent {
  context: string;
  instructions?: string;
  next_step?: string;
  constraints?: string[];
}

export interface DemoArc {
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

export interface GraphNode {
  id: string;
  arc: DemoArc;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null;
  fy: number | null;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: Relation;
  note?: string;
}

export const PALETTE_COLORS: Record<Palette, { bg: string; glow: string; text: string; border: string }> = {
  forge:  { bg: 'rgba(245, 158, 11, 0.12)', glow: 'rgba(245, 158, 11, 0.35)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
  tide:   { bg: 'rgba(6, 182, 212, 0.12)',   glow: 'rgba(6, 182, 212, 0.35)',   text: '#06b6d4', border: 'rgba(6, 182, 212, 0.3)' },
  root:   { bg: 'rgba(34, 197, 94, 0.12)',   glow: 'rgba(34, 197, 94, 0.35)',   text: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' },
  drift:  { bg: 'rgba(139, 92, 246, 0.12)',  glow: 'rgba(139, 92, 246, 0.35)',  text: '#8b5cf6', border: 'rgba(139, 92, 246, 0.3)' },
  void:   { bg: 'rgba(99, 102, 241, 0.12)',  glow: 'rgba(99, 102, 241, 0.35)',  text: '#6366f1', border: 'rgba(99, 102, 241, 0.3)' },
};

export const PALETTE_EDGE_COLORS: Record<Palette, string> = {
  forge: 'rgba(245, 158, 11, 0.25)',
  tide:  'rgba(6, 182, 212, 0.25)',
  root:  'rgba(34, 197, 94, 0.25)',
  drift: 'rgba(139, 92, 246, 0.25)',
  void:  'rgba(99, 102, 241, 0.25)',
};

export const TYPE_ICONS: Record<ArcType, string> = {
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

export const STAGE_COLORS: Record<ArcStage, { bg: string; text: string }> = {
  potential:      { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8' },
  manifestation:  { bg: 'rgba(59, 130, 246, 0.15)',  text: '#3b82f6' },
  experience:     { bg: 'rgba(168, 85, 247, 0.15)',  text: '#a855f7' },
  dissolution:    { bg: 'rgba(239, 68, 68, 0.15)',   text: '#ef4444' },
  evolved:        { bg: 'rgba(234, 179, 8, 0.15)',   text: '#eab308' },
};

export const DEMO_ARCS: DemoArc[] = [
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

export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 72;
const REPULSION = 22000;
const ATTRACTION = 0.004;
const DAMPING = 0.88;
const CENTER_GRAVITY = 0.008;

export function getPalette(arc: DemoArc): Palette {
  return arc.apl?.palette || 'void';
}

export function getSecondaryPalette(arc: DemoArc): Palette | undefined {
  return arc.apl?.palette_secondary;
}

export function initNodes(arcs: DemoArc[], width: number, height: number): GraphNode[] {
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

export function extractEdges(arcs: DemoArc[]): GraphEdge[] {
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

export function simulate(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;

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

  for (const node of nodes) {
    if (node.fx === null) {
      node.vx += (cx - node.x) * CENTER_GRAVITY;
    }
    if (node.fy === null) {
      node.vy += (cy - node.y) * CENTER_GRAVITY;
    }
  }

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

    const pad = 40;
    node.x = Math.max(pad, Math.min(width - NODE_WIDTH - pad, node.x));
    node.y = Math.max(pad, Math.min(height - NODE_HEIGHT - pad, node.y));
  }
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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
