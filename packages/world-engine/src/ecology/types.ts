export const ECOLOGY_SCHEMA_VERSION = "1.0.0" as const;

export const ECOLOGY_KINDS = ["flora", "fauna", "fungus", "symbiote", "colony"] as const;
export type EcologyKind = (typeof ECOLOGY_KINDS)[number];

export const ECOLOGY_GATES = [
  "Foundation",
  "Flow",
  "Fire",
  "Heart",
  "Voice",
  "Sight",
  "Crown",
  "Starweave",
  "Unity",
  "Source",
] as const;
export type EcologyGate = (typeof ECOLOGY_GATES)[number];

export const ECOLOGY_GATE_CONTEXT: Record<
  EcologyGate,
  { guardian: string; godbeast: string }
> = {
  Foundation: { guardian: "Lyssandria", godbeast: "Kaelith" },
  Flow: { guardian: "Leyla", godbeast: "Veloura" },
  Fire: { guardian: "Draconia", godbeast: "Draconis" },
  Heart: { guardian: "Maylinn", godbeast: "Laeylinn" },
  Voice: { guardian: "Alera", godbeast: "Otome" },
  Sight: { guardian: "Lyria", godbeast: "Yumiko" },
  Crown: { guardian: "Aiyami", godbeast: "Sol" },
  Starweave: { guardian: "Elara", godbeast: "Vaelith" },
  Unity: { guardian: "Ino", godbeast: "Kyuro" },
  Source: { guardian: "Shinkami", godbeast: "Source" },
};

/** The five-element canon. Void and Spirit are two names for one element. */
export const ECOLOGY_ELEMENTS = ["Fire", "Water", "Earth", "Wind", "Void/Spirit"] as const;
export type EcologyElement = (typeof ECOLOGY_ELEMENTS)[number];

export type CanonState = "proposal" | "staging" | "locked";
export type ReviewState =
  | "draft"
  | "planned"
  | "generating"
  | "review"
  | "approved"
  | "revise"
  | "rejected"
  | "published";

export interface EcologyOrigin {
  worldId: string;
  worldName: string;
  realmId?: string;
  realmName?: string;
  biome: string;
  range?: string;
}

export type ScaleClass =
  | "microscopic"
  | "minute"
  | "small"
  | "human-scale"
  | "large"
  | "colossal"
  | "landscape";

type EcologyDimensionFields = {
  description?: string;
  heightM?: number;
  spanM?: number;
  massKg?: number;
};

/** At least one qualitative or numeric dimension is required in every authored record. */
export type EcologyDimensions =
  | (EcologyDimensionFields & { description: string })
  | (EcologyDimensionFields & { heightM: number })
  | (EcologyDimensionFields & { spanM: number })
  | (EcologyDimensionFields & { massKg: number });

export interface EcologyTaxonomy {
  morphology: string;
  bodySubstrate: string;
  silhouetteThesis: string;
  scaleClass: ScaleClass;
  dimensions: EcologyDimensions;
  structuralAdaptations: string[];
  sensesOrTropisms: string[];
}

export interface EcologyLifeCycle {
  origin: string;
  reproduction: string;
  dispersal?: string;
  growth: string;
  maturity: string;
  senescence: string;
  deathAndReturn: string;
  typicalLifespan?: string;
}

export interface EcologyEnergyBudget {
  primarySource: string;
  secondarySource?: string;
  intake: string;
  storage: string;
  expenditure: string;
  recovery: string;
  failureMode: string;
}

export type RadianceMechanism =
  | "bioluminescence"
  | "fluorescence"
  | "phosphorescence"
  | "structural-color"
  | "reflected-light"
  | "mechanoluminescence"
  | "thermoluminescence"
  | "vael-resonance";

export interface EcologyRadiance {
  mechanism: RadianceMechanism;
  carrier: string;
  trigger: string;
  appearance: string;
  information: string;
  cost: string;
  failureMode: string;
}

export type EcologyRelationshipType =
  | "mutualism"
  | "commensalism"
  | "predation"
  | "herbivory"
  | "parasitism"
  | "competition"
  | "decomposition"
  | "pollination"
  | "dispersal"
  | "shelter"
  | "signaling"
  | "cultivation";

export interface EcologyRelationship {
  targetId: string;
  targetName?: string;
  type: EcologyRelationshipType;
  direction: "outbound" | "inbound" | "bidirectional";
  effect: "beneficial" | "harmful" | "neutral" | "conditional";
  description: string;
  ifBroken: string;
  evidence?: "canon" | "staging" | "research-inference" | "design-proposal";
}

export type TrophicRole =
  | "primary-producer"
  | "consumer"
  | "apex-consumer"
  | "detritivore"
  | "decomposer"
  | "parasite"
  | "symbiotic-network"
  | "habitat-engineer"
  | "mixed";

export interface EcologyNetwork {
  niche: string;
  trophicRole: TrophicRole;
  habitatFunction: string;
  keystone: boolean;
  populationControls?: string[];
  relationships: EcologyRelationship[];
  removalConsequence: {
    firstOrder: string;
    secondOrder: string;
    cultural: string;
  };
}

export interface EcologyCovenant {
  gift: string;
  cost: string;
  balance: string;
  stewards?: string[];
  taboo: string;
  breachConsequence: string;
}

export interface EcologyNarrative {
  signatureBehavior: string;
  sensorySignature: string;
  encounter: string;
  choicePressure: string;
  storyUses: string[];
}

export type AplShapePalette = "Forge" | "Tide" | "Root" | "Drift" | "Void";

export interface EcologyVisualDirection {
  spark: string;
  shapePalettes: AplShapePalette[];
  sharpen: string[];
  visualDNA: string;
  silhouetteTest: string;
  materialLanguage: string[];
  lightBehavior: string;
  scaleEvidence: string;
  camera: string;
  renderIntent: string;
}

export type EcologySourceType =
  | "locked-canon"
  | "staging-lore"
  | "creator-approval"
  | "research"
  | "inspiration"
  | "generated";

export interface EcologySource {
  id: string;
  type: EcologySourceType;
  reference: string;
  note: string;
  accessedAt?: string;
}

export interface EcologySourceClaim {
  id: string;
  claim: string;
  sourceIds: string[];
  /** RFC 6901-style paths to entry fields supported by the claim. */
  fieldPaths: string[];
}

export interface EcologyProposalMechanic {
  id: string;
  mechanic: string;
  rationale: string;
  /** RFC 6901-style paths to fields introduced or changed by this proposal. */
  fieldPaths: string[];
  supportedByClaimIds: string[];
  state: "proposal";
}

export interface EcologyProvenance {
  sources: EcologySource[];
  sourceClaims: EcologySourceClaim[];
  proposalMechanics: EcologyProposalMechanic[];
  originalityNotes: string[];
}

export type EcologyCanon =
  | {
      state: "proposal" | "staging";
      anchors: string[];
      note: string;
      approvedBy?: never;
      approvedAt?: never;
    }
  | {
      state: "locked";
      anchors: string[];
      note: string;
      approvedBy: string;
      approvedAt: string;
    };

export interface EcologyQualityScore {
  biologicalCoherence: number;
  ecologicalClosure: number;
  covenantLogic: number;
  originality: number;
  canonAlignment: number;
  visualReadiness: number;
  total: number;
  verdict: "ship" | "iterate" | "restart";
}

export interface EcologyReview {
  state: ReviewState;
  score: EcologyQualityScore | null;
  notes: string[];
}

export type EcologyMediaRole =
  | "habitat-hero"
  | "specimen"
  | "relationship"
  | "macro"
  | "lifecycle"
  | "diagram";

export interface EcologyMedia {
  role: EcologyMediaRole;
  status: "planned" | "generated" | "staged" | "published";
  url?: string;
  deliveryKey?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  sha256?: string;
  alt?: string;
  generationModel?: string;
  promptHash?: string;
  rightsRecordId?: string;
  generatedAt?: string;
  publishedAt?: string;
}

export interface EcologyEntry {
  schemaVersion: typeof ECOLOGY_SCHEMA_VERSION;
  id: string;
  slug: string;
  name: string;
  kind: EcologyKind;
  origin: EcologyOrigin;
  gate: EcologyGate;
  elementAffinity: EcologyElement[];
  taxonomy: EcologyTaxonomy;
  lifeCycle: EcologyLifeCycle;
  energy: EcologyEnergyBudget;
  radiance?: EcologyRadiance;
  ecology: EcologyNetwork;
  covenant: EcologyCovenant;
  narrative: EcologyNarrative;
  visual: EcologyVisualDirection;
  provenance: EcologyProvenance;
  canon: EcologyCanon;
  review: EcologyReview;
  media?: EcologyMedia[];
}

export interface EcologyProposalInput
  extends Omit<EcologyEntry, "schemaVersion" | "canon" | "review" | "media"> {
  canonAnchors: string[];
  canonNote?: string;
  media?: EcologyMedia[];
}

export interface EcologyValidationIssue {
  path: string;
  code: string;
  severity: "error" | "warning";
  message: string;
}

export interface EcologyValidationResult {
  valid: boolean;
  errors: EcologyValidationIssue[];
  warnings: EcologyValidationIssue[];
}

export type EcologyValidationMode = "draft" | "publish";

export type EcologyImageShot =
  | "habitat-hero"
  | "specimen"
  | "relationship"
  | "macro"
  | "lifecycle";

export interface EcologyVisualPromptOptions {
  shot?: EcologyImageShot;
  aspectRatio?: "1:1" | "4:3" | "4:5" | "16:9" | "9:16";
  relationshipTargetId?: string;
}

export interface EcologyVisualPromptResult {
  prompt: string;
  negativePrompt: string;
  shot: EcologyImageShot;
  aspectRatio: NonNullable<EcologyVisualPromptOptions["aspectRatio"]>;
  canonState: CanonState;
  sourceEntryId: string;
}

export interface ForgeEcologyRequest {
  kind: EcologyKind;
  worldId: string;
  worldName: string;
  realmId?: string;
  realmName?: string;
  biome: string;
  gate: EcologyGate;
  elementAffinity: EcologyElement[];
  spark: string;
  scaleClass?: ScaleClass;
  radianceMechanism?: RadianceMechanism;
  canonAnchors: string[];
  relationshipTargets?: Array<{ id: string; name?: string }>;
}

export interface WeaveEcosystemRequest {
  entries: EcologyEntry[];
  minimumRelationships?: number;
}

export interface EcosystemGraphReport {
  entryIds: string[];
  edgeCount: number;
  danglingTargetIds: string[];
  isolatedEntryIds: string[];
  keystoneEntryIds: string[];
  trophicRolesPresent: TrophicRole[];
  missingFunctions: string[];
}
