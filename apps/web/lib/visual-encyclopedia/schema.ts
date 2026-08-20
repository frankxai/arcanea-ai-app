export const GATES = [
  'Foundation',
  'Flow',
  'Fire',
  'Heart',
  'Voice',
  'Sight',
  'Crown',
  'Starweave',
  'Unity',
  'Source',
] as const;

export type GateName = (typeof GATES)[number];
export type EntryKind = 'kinform' | 'character' | 'creature' | 'place' | 'scene';
export type CanonState = 'proposal' | 'staging' | 'locked';
export type ReviewState =
  | 'planned'
  | 'generating'
  | 'review'
  | 'approved'
  | 'revise'
  | 'rejected'
  | 'published';

export interface GateContext {
  guardian: string;
  godbeast: string;
  principle: string;
  materialLanguage: string;
  environmentLanguage: string;
}

export interface VisualQualityScore {
  craft: number;
  composition: number;
  originality: number;
  canonAlignment: number;
  emotionalForce: number;
  accessibility: number;
  total: number;
  verdict: 'ship' | 'iterate' | 'restart';
}

export interface VisualMedia {
  status: 'planned' | 'generated' | 'staged' | 'published';
  url?: string;
  /** @deprecated Legacy planning key retained only while older generation manifests are normalized. */
  blobPath?: string;
  deliveryKey?: string;
  registryAssetId?: string;
  renditionId?: string;
  renditionSha256?: string;
  publicationReviewId?: string;
  rightsRecordId?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  sha256?: string;
  alt?: string;
  generationModel?: string;
  generatedAt?: string;
  publishedAt?: string;
}

export interface VisualEncyclopediaEntry {
  id: string;
  slug: string;
  name: string;
  kind: EntryKind;
  batch: number;
  gate: GateName;
  guardian: string;
  origin: string;
  role: string;
  gift: string;
  cost: string;
  visualDNA: string;
  camera: string;
  emotion: string;
  cinemaUse: string;
  contentUses: string[];
  relationships: string[];
  canon: {
    state: CanonState;
    anchor: string;
    note: string;
  };
  review: {
    state: ReviewState;
    score: VisualQualityScore | null;
    notes: string[];
  };
  media: VisualMedia;
}

export const GATE_CONTEXT: Record<GateName, GateContext> = {
  Foundation: {
    guardian: 'Lyssandria',
    godbeast: 'Kaelith',
    principle: 'stability, embodiment, and structures that protect life',
    materialLanguage: 'living stone, moss-dark weave, restrained amber metal, weight-bearing joints',
    environmentLanguage: 'terraced foundations, mineral gardens, load paths made visible',
  },
  Flow: {
    guardian: 'Leyla',
    godbeast: 'Veloura',
    principle: 'adaptation, memory in motion, and change without self-erasure',
    materialLanguage: 'nacre, waterglass, sea-blue weave, fluid silver hinges',
    environmentLanguage: 'aquifer passages, rain rooms, reflective currents and suspended bridges',
  },
  Fire: {
    guardian: 'Draconia',
    godbeast: 'Draconis',
    principle: 'transformation, courage, and precisely directed creative force',
    materialLanguage: 'volcanic glass, ember-gold metal, charcoal ceramic, heat-safe woven armor',
    environmentLanguage: 'cold-flame forges, black-glass ridges, rescue lanes through ember weather',
  },
  Heart: {
    guardian: 'Maylinn',
    godbeast: 'Laeylinn',
    principle: 'care with boundaries, restoration, and courageous connection',
    materialLanguage: 'jade growth, warm ivory ceramic, rose-copper seams, soft structural fabric',
    environmentLanguage: 'repair gardens, wind-lit clinics, living bridges and communal tables',
  },
  Voice: {
    guardian: 'Alera',
    godbeast: 'Otome',
    principle: 'truthful expression, listening, and language that survives distortion',
    materialLanguage: 'resonant silver, ink-black weave, bell glass, fine acoustic vanes',
    environmentLanguage: 'listening chambers, courier corridors, archives shaped by sound',
  },
  Sight: {
    guardian: 'Lyria',
    godbeast: 'Yumiko',
    principle: 'discernment, pattern recognition, and seeing without claiming certainty',
    materialLanguage: 'prismatic mineral, indigo silk, pearl ceramic, adjustable optical petals',
    environmentLanguage: 'lens observatories, shadow-reading labs, mirrored study terraces',
  },
  Crown: {
    guardian: 'Aiyami',
    godbeast: 'Sol',
    principle: 'wisdom, stewardship, and power measured by responsibility',
    materialLanguage: 'solar quartz, cream weave, matte starlight metal, controlled gold radiance',
    environmentLanguage: 'sun courts, charge reservoirs, high observatories and quiet councils',
  },
  Starweave: {
    guardian: 'Elara',
    godbeast: 'Vaelith',
    principle: 'transformation across systems and connection among distant consequences',
    materialLanguage: 'ghost-steel ribs, prismatic seams, obsidian facets, phase-shifting fabric',
    environmentLanguage: 'thread bridges, probability gardens, transformation laboratories',
  },
  Unity: {
    guardian: 'Ino',
    godbeast: 'Kyuro',
    principle: 'cooperation without sameness and bonds that preserve individual agency',
    materialLanguage: 'paired silver filaments, black-gold ceramic, interlocking soft shells',
    environmentLanguage: 'bonding halls, cooperative lifts, shared work yards and chorus chambers',
  },
  Source: {
    guardian: 'Shinkami',
    godbeast: 'Source',
    principle: 'integration, origin awareness, and responsibility for the whole pattern',
    materialLanguage: 'clear crystal cores, white-gold metal, black glass, nearly weightless weave',
    environmentLanguage: 'origin archives, integration chambers, quiet orbital courtyards',
  },
};

export function proposalEntry(
  input: Omit<VisualEncyclopediaEntry, 'guardian' | 'canon' | 'review' | 'media'>,
): VisualEncyclopediaEntry {
  const context = GATE_CONTEXT[input.gate];
  return {
    ...input,
    guardian: context.guardian,
    canon: {
      state: 'proposal',
      anchor: `${input.gate} Gate · ${context.guardian} · ${context.godbeast}`,
      note: 'Original visual-world proposal. It references locked Gate relationships but is not canon until explicit human acceptance.',
    },
    review: {
      state: 'planned',
      score: null,
      notes: [],
    },
    media: {
      status: 'planned',
    },
  };
}

export function buildImagePrompt(entry: VisualEncyclopediaEntry): string {
  const context = GATE_CONTEXT[entry.gate];
  return [
    `Create an original Arcanea ${entry.kind} concept named ${entry.name}.`,
    `Narrative role: ${entry.role}. Gift: ${entry.gift}. Cost or limitation: ${entry.cost}.`,
    `Canon anchor: ${entry.gate} Gate, ${context.guardian}, ${context.godbeast}; treat this new subject as proposal lore only.`,
    `Visual DNA: ${entry.visualDNA}; material language: ${context.materialLanguage}.`,
    `Composition: ${entry.camera}; emotional direction: ${entry.emotion}.`,
    entry.kind === 'kinform'
      ? 'Premium original 3D companion-character design: compact and iconic but not chibi, not Pixar, not toy-plastic; believable engineered articulation, tactile fabrics, ceramic and metal surfaces, expressive non-human silhouette, no mascot franchise likeness.'
      : 'Premium cinematic 3D concept art with believable tactile materials, precise silhouette design, lived-in detail, and original worldbuilding.',
    'Deep cosmic-dark staging, restrained teal and warm-gold accents, layered atmospheric depth, high-end feature-animation rendering quality with mature proportions and subtle surface wear.',
    'Single coherent image, no typography, no labels, no collage, no UI, no watermark, no copied franchise traits, no collectible-monster framing, no generic fantasy armor, no oversaturated purple-pink gradient.',
  ].join(' ');
}
