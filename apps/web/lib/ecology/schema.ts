import type { VisualMedia } from '@/lib/visual-encyclopedia/schema';

import {
  ECOLOGY_GATES as CANONICAL_ECOLOGY_GATES,
  ECOLOGY_KINDS as CANONICAL_ECOLOGY_KINDS,
  createEcologyProposal,
  type CanonState as CanonicalCanonState,
  type EcologyElement,
  type EcologyDimensions,
  type EcologyEntry as CanonicalEcologyEntry,
  type EcologyGate,
  type EcologyKind as CanonicalEcologyKind,
  type EcologyMedia,
  type EcologyRelationship as CanonicalEcologyRelationship,
  type EcologyRelationshipType,
  type EcologySourceClaim,
  type RadianceMechanism,
  type ScaleClass,
  type TrophicRole,
} from '@arcanea/world-engine';

/**
 * World Engine owns every canon-bearing ecology type and vocabulary. This module
 * is only a one-way adapter from the Wave 01 authoring seed to a website view.
 */
export const ECOLOGY_KINDS = CANONICAL_ECOLOGY_KINDS;
export const ECOLOGY_GATES = CANONICAL_ECOLOGY_GATES;
export type EcologyKind = CanonicalEcologyKind;
export type { EcologyGate };
export type CanonState = CanonicalCanonState;

/** `none` is an authoring sentinel. The canonical record expresses it by omitting `radiance`. */
export type AtlasLightMechanismInput = RadianceMechanism | 'none';

/** @internal Migration shape for the hand-authored Wave 01 source inventory. */
export interface AtlasSourceClaimInput {
  claim: string;
  sourcePath: string;
}

/** @internal Relationship prose is normalized into World Engine relationship types. */
export interface AtlasRelationshipInput {
  targetId: string;
  relation: 'pollinates' | 'repairs' | 'feeds' | 'shelters' | 'warns' | 'anchors' | 'records' | 'regulates';
  exchange: string;
  consequence: string;
}

export interface EcologyPromptLanguage {
  worldDNA: {
    spark: string;
    shape: string;
    sharpen: string[];
  };
  spark: string;
  shape: {
    primaryPalette: string;
    secondaryPalette?: string;
    sensoryDescription: string;
  };
  sharpen: string[];
  subject: string;
  biology: string;
  lightBehavior: string;
  materialLanguage: string;
  environmentLanguage: string;
  composition: {
    camera: string;
    scaleCue: string;
    focalAnchor: string;
    negativeSpace: string;
  };
  emotion: string;
  render: string;
  aspectRatio: `${number}:${number}`;
}

/** @internal Presentation-rich seed. It is never exported as canon or sent over MCP. */
export interface AtlasEntrySeed {
  id: string;
  slug: string;
  name: string;
  epithet: string;
  kind: CanonicalEcologyKind;
  gate: EcologyGate;
  world: string;
  realm: string;
  biome: string;
  role: string;
  scale: string;
  morphology: string;
  biology: {
    energySource: string;
    lifecycle: string;
    propagation: string;
  };
  light: {
    mechanism: AtlasLightMechanismInput;
    trigger: string;
    signal: string;
    cost: string;
    failureMode: string;
  };
  covenant: {
    gift: string;
    price: string;
    practice: string;
    exploitationConsequence: string;
  };
  relationships: AtlasRelationshipInput[];
  storyHooks: string[];
  sourceClaims: AtlasSourceClaimInput[];
  proposalMechanics: string[];
  canon: {
    /** Source-attestation state only. Proposed mechanics still force the final record to proposal. */
    state: Exclude<CanonicalCanonState, 'locked'>;
    anchors: string[];
    note: string;
  };
  promptLanguage: EcologyPromptLanguage;
  visualPrompt: string;
  negativePrompt: string;
  media: VisualMedia;
}

export interface AtlasPresentation {
  epithet: string;
  promptLanguage: EcologyPromptLanguage;
  visualPrompt: string;
  negativePrompt: string;
}

/**
 * Website-only read model. `record` is the sole canon-bearing payload;
 * `heroMedia` is selected from `record.media` by canonical role.
 */
export interface AtlasEntryView {
  record: CanonicalEcologyEntry;
  presentation: AtlasPresentation;
  heroMedia: EcologyMedia;
}

export interface AtlasLightContractView {
  mechanismLabel: string;
  trigger: string;
  signal: string;
  cost: string;
  failureMode: string;
}

export function selectAtlasHeroMedia(record: CanonicalEcologyEntry): EcologyMedia | undefined {
  return record.media?.find((asset) => asset.role === 'habitat-hero');
}

type AtlasSeedInput = Omit<AtlasEntrySeed, 'canon' | 'media'> & {
  canonAnchors: string[];
  canonState: Exclude<CanonicalCanonState, 'locked'>;
  canonNote?: string;
  media?: VisualMedia;
};

/** Builds an authoring seed. Call `toAtlasEntryView` after all seed reconciliation. */
export function atlasSeed(input: AtlasSeedInput): AtlasEntrySeed {
  const { canonAnchors, canonState, canonNote, media, ...entry } = input;
  return {
    ...entry,
    canon: {
      state: canonState,
      anchors: canonAnchors,
      note:
        canonNote ??
        'Original ecology proposal. It may reference established Arcanea relationships, but remains non-canon until explicit Creator approval.',
    },
    media: media ?? { status: 'planned' },
  };
}

type AtlasProposalSeedInput = Omit<AtlasSeedInput, 'canonState'>;

export function atlasProposalSeed(input: AtlasProposalSeedInput): AtlasEntrySeed {
  return atlasSeed({ ...input, canonState: 'proposal' });
}

const ELEMENT_BY_GATE: Record<EcologyGate, EcologyElement> = {
  Foundation: 'Earth',
  Flow: 'Water',
  Fire: 'Fire',
  Heart: 'Water',
  Voice: 'Wind',
  Sight: 'Wind',
  Crown: 'Fire',
  Starweave: 'Void/Spirit',
  Unity: 'Earth',
  Source: 'Void/Spirit',
};

const SHAPE_BY_GATE: Record<EcologyGate, 'Forge' | 'Tide' | 'Root' | 'Drift' | 'Void'> = {
  Foundation: 'Root',
  Flow: 'Tide',
  Fire: 'Forge',
  Heart: 'Root',
  Voice: 'Drift',
  Sight: 'Drift',
  Crown: 'Forge',
  Starweave: 'Void',
  Unity: 'Root',
  Source: 'Void',
};

const RELATIONSHIP_TYPE: Record<AtlasRelationshipInput['relation'], EcologyRelationshipType> = {
  pollinates: 'pollination',
  repairs: 'mutualism',
  feeds: 'mutualism',
  shelters: 'shelter',
  warns: 'signaling',
  anchors: 'mutualism',
  records: 'commensalism',
  regulates: 'mutualism',
};

function stableToken(value: string, max = 22): string {
  const normalized = value.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  return (normalized || 'ENTRY').slice(0, max).replace(/-$/g, '');
}

function stableSlug(value: string): string {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return normalized || 'unknown';
}

const METRE_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  six: 6,
  twelve: 12,
  eighteen: 18,
  'twenty-eight': 28,
  thirty: 30,
  forty: 40,
};

function dimensions(scale: string): EcologyDimensions {
  const normalized = scale.toLocaleLowerCase();
  const result: EcologyDimensions = { description: scale };
  if (/kilometre-wide|kilometer-wide/.test(normalized)) result.spanM = 1000;
  if (/hair-fine/.test(normalized)) result.spanM = 0.0001;
  if (/hand-sized/.test(normalized)) result.heightM = 0.18;
  if (/ankle-high/.test(normalized)) result.heightM = 0.25;
  if (/knee-high/.test(normalized)) result.heightM = 0.5;
  if (/waist-high/.test(normalized)) result.heightM = 1;
  if (/human-height/.test(normalized)) result.heightM = 1.8;
  if (/shield-wide/.test(normalized)) result.spanM = 1;

  const centimetres = normalized.match(/(\d+(?:\.\d+)?)\s*centimetres?/);
  if (centimetres) result.spanM = Number(centimetres[1]) / 100;
  if (/thirty centimetres?/.test(normalized)) result.spanM = 0.3;

  const numericMetres = normalized.match(/(\d+(?:\.\d+)?)\s*(?:m\b|metres?\b)/);
  const wordMetres = Object.entries(METRE_WORDS).find(([word]) =>
    new RegExp(`\\b${word}(?:-metre| metres?)\\b`).test(normalized),
  );
  const metres = numericMetres ? Number(numericMetres[1]) : wordMetres?.[1];
  if (metres !== undefined) {
    if (/across|apart|span|wingspan|wide/.test(normalized)) result.spanM = metres;
    else result.heightM = metres;
  }
  return result;
}

function scaleClass(scale: string, measured: EcologyDimensions): ScaleClass {
  if (/kilomet|landscape|valley|river bend|entire (?:plain|world)/i.test(scale)) return 'landscape';
  const maximumLinearDimension = Math.max(measured.heightM ?? 0, measured.spanM ?? 0);
  if (maximumLinearDimension >= 10) return 'colossal';
  if (maximumLinearDimension >= 2) return 'large';
  if (/microscop|hair-fine|pollen-sized/i.test(scale)) return 'microscopic';
  if (maximumLinearDimension > 0 && maximumLinearDimension < 0.5) return 'small';
  if (/hand-sized|ankle|knee/i.test(scale)) return 'small';
  return 'human-scale';
}

function materials(seed: AtlasEntrySeed): string[] {
  const parts = seed.promptLanguage.materialLanguage
    .split(/[,;]/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 3);
  if (parts.length < 2) parts.push(seed.morphology);
  return [...new Set(parts)].slice(0, 8);
}

function trophicRole(kind: CanonicalEcologyKind, role: string): TrophicRole {
  if (/keystone|habitat|refuge|pioneer|shoreline|shade|nursery/i.test(role)) return 'habitat-engineer';
  if (kind === 'flora') return 'primary-producer';
  if (kind === 'fungus' || kind === 'symbiote') return 'symbiotic-network';
  if (kind === 'fauna') return 'consumer';
  return 'mixed';
}

function relationship(seed: AtlasRelationshipInput): CanonicalEcologyRelationship {
  return {
    targetId: seed.targetId,
    type: RELATIONSHIP_TYPE[seed.relation],
    direction: 'bidirectional',
    effect: 'conditional',
    description: seed.exchange,
    ifBroken: seed.consequence,
    evidence: 'design-proposal',
  };
}

function canonicalMedia(media: VisualMedia): EcologyMedia {
  const url = typeof media.url === 'string' && /^[a-z][a-z0-9+.-]*:\/\//i.test(media.url) ? media.url : undefined;
  const deliveryKey = typeof media.url === 'string' && media.url.startsWith('/') ? media.url : undefined;
  return {
    role: 'habitat-hero',
    status:
      media.status === 'published'
        ? 'published'
        : media.status === 'staged'
          ? 'staged'
          : media.status === 'generated'
            ? 'generated'
            : 'planned',
    ...(url ? { url } : {}),
    ...(deliveryKey ? { deliveryKey } : {}),
    ...(media.width ? { width: media.width } : {}),
    ...(media.height ? { height: media.height } : {}),
    ...(media.mimeType ? { mimeType: media.mimeType } : {}),
    ...(media.sha256 ? { sha256: media.sha256 } : {}),
    ...(media.alt ? { alt: media.alt } : {}),
    ...(media.generationModel ? { generationModel: media.generationModel } : {}),
    ...(media.rightsRecordId ? { rightsRecordId: media.rightsRecordId } : {}),
    ...(media.generatedAt ? { generatedAt: media.generatedAt } : {}),
    ...(media.publishedAt ? { publishedAt: media.publishedAt } : {}),
  };
}

/**
 * Normalizes a reconciled Wave 01 seed into the World Engine contract, then
 * creates the derived Atlas view. Proposal mechanics always keep the whole
 * record in proposal state, even when individual names are source-attested.
 */
export function toAtlasEntryView(seed: AtlasEntrySeed): AtlasEntryView {
  const entryToken = stableToken(seed.id.replace(/^ECO-/, ''));
  const sourceRecords = seed.sourceClaims.map((claim, index) => ({
    id: `SRC-${entryToken}-${index + 1}`,
    type: 'staging-lore' as const,
    reference: claim.sourcePath,
    note: 'Source inventory reference. It substantiates only the linked claim, never generated or inferred mechanics.',
  }));
  const generationSource = {
    id: `SRC-${entryToken}-GEN`,
    type: 'generated' as const,
    reference: `arcanea-ecology-forge:${seed.slug}:wave-01`,
    note: 'Records proposal authoring and visual development. Generated material cannot substantiate source claims.',
  };
  const sourceClaims = seed.sourceClaims.map((claim, index) => ({
    id: `CLAIM-${entryToken}-${index + 1}`,
    claim: claim.claim,
    sourceIds: [sourceRecords[index].id],
    fieldPaths: ['/name', '/canon/anchors'],
  }));
  const proposalMechanics = seed.proposalMechanics.map((mechanic, index) => ({
    id: `MECH-${entryToken}-${index + 1}`,
    mechanic,
    rationale: 'Wave 01 design extension; it remains a proposal until an explicit Creator approval artifact promotes it.',
    fieldPaths: ['/taxonomy', '/lifeCycle', '/energy', '/ecology', '/covenant', '/narrative', '/visual'],
    supportedByClaimIds: [],
    state: 'proposal' as const,
  }));
  const normalizedRelationships = seed.relationships.map(relationship);
  const media = canonicalMedia(seed.media);
  const materialLanguage = materials(seed);
  const measuredDimensions = dimensions(seed.scale);
  const radiance =
    seed.light.mechanism === 'none'
      ? undefined
      : {
          mechanism: seed.light.mechanism,
          carrier: materialLanguage.join(', '),
          trigger: seed.light.trigger,
          appearance: seed.light.signal,
          information: seed.light.signal,
          cost: seed.light.cost,
          failureMode: seed.light.failureMode,
        };

  const record = createEcologyProposal({
    id: seed.id,
    slug: seed.slug,
    name: seed.name,
    kind: seed.kind,
    origin: {
      worldId: stableSlug(seed.world),
      worldName: seed.world,
      realmId: stableSlug(seed.realm),
      realmName: seed.realm,
      biome: seed.biome,
    },
    gate: seed.gate,
    elementAffinity: [ELEMENT_BY_GATE[seed.gate]],
    taxonomy: {
      morphology: seed.morphology,
      bodySubstrate: materialLanguage.join(', '),
      silhouetteThesis: `${seed.scale}. ${seed.epithet}.`,
      scaleClass: scaleClass(seed.scale, measuredDimensions),
      dimensions: measuredDimensions,
      structuralAdaptations: [seed.morphology, `Scale evidence: ${seed.scale}`],
      sensesOrTropisms: [seed.light.trigger],
    },
    lifeCycle: {
      origin: seed.biology.propagation,
      reproduction: seed.biology.propagation,
      growth: seed.biology.lifecycle,
      maturity: seed.biology.lifecycle,
      senescence: seed.light.failureMode,
      deathAndReturn: seed.covenant.exploitationConsequence,
    },
    energy: {
      primarySource: seed.biology.energySource,
      intake: seed.biology.energySource,
      storage: seed.biology.lifecycle,
      expenditure: seed.light.cost,
      recovery: seed.covenant.practice,
      failureMode: seed.light.failureMode,
    },
    ...(radiance ? { radiance } : {}),
    ecology: {
      niche: seed.role,
      trophicRole: trophicRole(seed.kind, seed.role),
      habitatFunction: seed.covenant.gift,
      keystone: /keystone/i.test(seed.role),
      relationships: normalizedRelationships,
      removalConsequence: {
        firstOrder: seed.covenant.exploitationConsequence,
        secondOrder: normalizedRelationships[0]?.ifBroken ?? seed.light.failureMode,
        cultural: seed.covenant.practice,
      },
    },
    covenant: {
      gift: seed.covenant.gift,
      cost: seed.covenant.price,
      balance: seed.covenant.practice,
      taboo: `Do not violate this stewardship constraint: ${seed.covenant.practice}`,
      breachConsequence: seed.covenant.exploitationConsequence,
    },
    narrative: {
      signatureBehavior: seed.light.trigger,
      sensorySignature: seed.promptLanguage.shape.sensoryDescription,
      encounter: `${seed.name} encountered as ${seed.role} in ${seed.biome}.`,
      choicePressure: `${seed.covenant.price} ${seed.covenant.exploitationConsequence}`,
      storyUses: seed.storyHooks,
    },
    visual: {
      spark: seed.promptLanguage.spark,
      shapePalettes: [SHAPE_BY_GATE[seed.gate]],
      sharpen: [...seed.promptLanguage.worldDNA.sharpen, ...seed.promptLanguage.sharpen].slice(0, 8),
      visualDNA: `${seed.morphology} ${seed.promptLanguage.shape.sensoryDescription}`,
      silhouetteTest: `${seed.scale}; focal anchor: ${seed.promptLanguage.composition.focalAnchor}`,
      materialLanguage,
      lightBehavior: seed.promptLanguage.lightBehavior,
      scaleEvidence: seed.promptLanguage.composition.scaleCue,
      camera: seed.promptLanguage.composition.camera,
      renderIntent: seed.promptLanguage.render,
    },
    provenance: {
      sources: [...sourceRecords, generationSource],
      sourceClaims,
      proposalMechanics,
      originalityNotes: [
        seed.epithet,
        'All detailed anatomy, lifecycle, signal, relationship, covenant, and visual mechanics remain explicit proposals.',
      ],
    },
    canonAnchors: seed.canon.anchors,
    canonNote:
      proposalMechanics.length > 0
        ? 'Source-attested claims, when present, remain individually cited. Every Wave 01 mechanism and the combined organism record remain proposal-state pending explicit Creator approval.'
        : seed.canon.note,
    media: [media],
  });
  const heroMedia = selectAtlasHeroMedia(record);
  if (!heroMedia) throw new Error(`${record.id} is missing its canonical habitat-hero media record.`);

  return {
    record,
    presentation: {
      epithet: seed.epithet,
      promptLanguage: seed.promptLanguage,
      visualPrompt: seed.visualPrompt,
      negativePrompt: seed.negativePrompt,
    },
    heroMedia,
  };
}

export function atlasMediaUrl(entry: AtlasEntryView): string | undefined {
  return entry.heroMedia.url ?? entry.heroMedia.deliveryKey;
}

/** Only reviewed hero-role media may enter the public specimen grid or its dossiers. */
export function isAtlasVisualReady(entry: AtlasEntryView): boolean {
  return (
    entry.heroMedia.role === 'habitat-hero' &&
    (entry.heroMedia.status === 'staged' || entry.heroMedia.status === 'published') &&
    typeof atlasMediaUrl(entry) === 'string'
  );
}

export function atlasLightContract(entry: AtlasEntryView): AtlasLightContractView {
  const { record } = entry;
  return record.radiance
    ? {
        mechanismLabel: record.radiance.mechanism,
        trigger: record.radiance.trigger,
        signal: record.radiance.information,
        cost: record.radiance.cost,
        failureMode: record.radiance.failureMode,
      }
    : {
        mechanismLabel: 'non-radiant',
        trigger: record.narrative.signatureBehavior,
        signal: record.visual.lightBehavior,
        cost: record.energy.expenditure,
        failureMode: record.energy.failureMode,
      };
}

export function atlasSourceReferences(entry: AtlasEntryView, claim: EcologySourceClaim): string[] {
  const sourcesById = new Map(entry.record.provenance.sources.map((source) => [source.id, source.reference]));
  return claim.sourceIds.flatMap((sourceId) => {
    const reference = sourcesById.get(sourceId);
    return reference ? [reference] : [];
  });
}
