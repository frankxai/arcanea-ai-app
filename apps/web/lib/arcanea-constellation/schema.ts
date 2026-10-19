import constellationData from "@/data/arcanea-constellation.v1.json";
import characterData from "@/data/arcanea-character-identities.v1.json";
import campaignData from "@/data/arcanea-visual-campaign.v1.json";
import godbeastData from "@/data/arcanea-godbeast-identities.v1.json";
import guardianData from "@/data/arcanea-guardian-identities.v1.json";
import worldData from "@/data/arcanea-world-identities.v1.json";

export interface ArcaneaAgent {
  id: string;
  name: string;
  order: number;
  domain: string;
  epithet: string;
  oneLiner: string;
  purpose: string;
  perspective: string;
  instrument: string;
  inputs: string[];
  outputs: string[];
  capabilities: string[];
  skillRefs: string[];
  routes: string[];
  stopConditions: string[];
  humanGates: string[];
  authority: {
    identityState: string;
    runtimeState: string;
    canLockCanon: boolean;
    canApproveIdentity: boolean;
    canPublish: boolean;
    humanHoldsFinalAuthority: boolean;
  };
  visualIdentity: {
    state: string;
    silhouette: string;
    material: string;
    light: string;
    motif: string;
    workingBehavior: string;
    spatialRhythm: string;
    avoid: string[];
  };
  downloads: { agent: string; skill: string; card: string };
  sourceRefs: string[];
}

export interface ArcaneaDomain {
  id: string;
  name: string;
  agentIds: string[];
  operatingRule: string;
}

export interface VisualStyle {
  id: string;
  name: string;
  hypothesis: string;
  direction: string;
  avoid: string[];
}

export interface VisualJob {
  id: string;
  round: number;
  slot: number;
  entityId: string;
  name: string;
  subjectKind: string;
  deliverable: string;
  sourceRefs: string[];
  canonState: string;
  identityState: string;
  evidenceState: string;
  openIdentityVariables: string[];
  reviewRequirements: string[];
  sensitivityReviewRequired: boolean;
  releaseEligibility: string;
  rightsState: string;
  releaseState: string;
  generationState: "planned" | "blocked" | "generated" | "review";
  blockedReason: string | null;
  styleState: string;
  promptContract: {
    schema: string;
    intent: string;
    contractHash: string;
    subject: {
      stableId: string;
      displayName: string;
      kind: string;
      identityLock: string;
      evidenceState: string;
      openIdentityVariables: string[];
      allowedVariation: string;
    };
    storyBeat: string;
    composition: string;
    output: {
      assetCount: 1;
      aspectRatio:
        | "1:1"
        | "4:5"
        | "3:2"
        | "2:3"
        | "4:3"
        | "3:4"
        | "16:9"
        | "9:16"
        | "21:9";
      intendedSurface:
        | "agent-dossier-and-identity-atlas"
        | "guardian-dossier-and-identity-atlas"
        | "godbeast-dossier-and-morphology-atlas"
        | "bond-dossier-and-relationship-atlas"
        | "book-character-dossier-and-identity-atlas"
        | "world-dossier-and-environment-atlas"
        | "visual-governance-teaching-plate"
        | "identity-continuity-evidence-sheet";
      deliveryRole: string;
      cropSafety: string;
      generatedTextPolicy: "no-generated-text";
    };
    designSystem: {
      styleMode: string;
      direction: string;
      colorLaw: string;
      escalation: string;
      materialLaw: string;
      typography: string;
    };
    light: string;
    references: {
      sourceRefs: string[];
      imageRefs: string[];
      imageReferencePolicy: string;
    };
    constraints: string[];
    avoid: string[];
    provider: {
      adapter: string;
      preferredCapabilities: string[];
      model: string | null;
      seed: number | null;
      providerParameters: Record<string, unknown>;
    };
    verification: {
      deterministicChecks: string[];
      rubric: string;
      passThreshold: number;
      identityFloor: number;
      canonFloor: number;
      humanApprovalRequired: boolean;
    };
    governance: {
      releaseEligibility: string;
      sensitivityReviewRequired: boolean;
      reviewRequirements: string[];
    };
  };
  output: null | {
    storagePath: string;
    publicUrl: string | null;
    fileName: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    sha256: string;
    revision: number;
    receiptPath: string;
  };
  evaluation: null | { total: number; verdict: string };
  receipts: string[];
  decisionReceipts: string[];
}

export interface ArcaneaCharacterIdentity {
  id: string;
  name: string;
  series: string;
  readiness:
    | "source-complete"
    | "source-complete-review-required"
    | "discovery-only"
    | "blocked";
  evidenceState: string;
  description: string;
  storyBeat: string;
  openIdentityVariables: string[];
  reviewRequirements: string[];
  sensitivityReviewRequired: boolean;
  blockedReason: string | null;
  sourceRefs: string[];
  campaign: {
    jobId: string;
    round: number;
    generationState: string;
    releaseState: string;
    releaseEligibility: string;
    publicImageUrl: string | null;
  };
}

export interface ArcaneaCharacterIdentityAtlas {
  meta: {
    schema: string;
    version: string;
    generatedAt: string;
    sourceOfTruth: string;
    truthBoundary: string;
  };
  characters: ArcaneaCharacterIdentity[];
}

export interface ArcaneaGuardianIdentity {
  id: string;
  name: string;
  gate: string;
  gateIndex: number;
  domain: string;
  bondedGodbeast: {
    id: string;
    name: string;
    chordCount: number;
  };
  readiness: "discovery-only";
  evidenceState: string;
  behaviorThesis: string;
  storyBeat: string;
  discoveryFocus: string;
  openIdentityVariables: string[];
  reviewRequirements: string[];
  sensitivityReviewRequired: boolean;
  sourceRefs: string[];
  campaign: {
    identityJobId: string;
    identityRound: number;
    dyadJobId: string;
    dyadRound: number;
    generationState: string;
    releaseState: string;
    releaseEligibility: string;
    publicImageUrl: string | null;
  };
}

export interface ArcaneaGuardianIdentityAtlas {
  meta: {
    schema: string;
    version: string;
    generatedAt: string;
    sourceOfTruth: string;
    truthBoundary: string;
  };
  guardians: ArcaneaGuardianIdentity[];
}

export interface ArcaneaGodbeastIdentity {
  id: string;
  name: string;
  gate: string;
  gateIndex: number;
  chordCount: number;
  bondedGuardian: { id: string; name: string };
  readiness: "discovery-only" | "blocked";
  identityState: string;
  evidenceState: string;
  morphologyCandidate: string;
  functionalTruth: string;
  storyBeat: string;
  openIdentityVariables: string[];
  reviewRequirements: string[];
  sensitivityReviewRequired: boolean;
  blockedReason: string | null;
  sourceRefs: string[];
  campaign: {
    morphologyJobId: string;
    morphologyRound: number;
    dyadJobId: string;
    dyadRound: number;
    generationState: string;
    releaseState: string;
    releaseEligibility: string;
    publicImageUrl: string | null;
  };
}

export interface ArcaneaGodbeastIdentityAtlas {
  meta: {
    schema: string;
    version: string;
    generatedAt: string;
    sourceOfTruth: string;
    truthBoundary: string;
  };
  godbeasts: ArcaneaGodbeastIdentity[];
}

export interface ArcaneaWorldIdentity {
  id: string;
  name: string;
  readiness:
    | "source-complete"
    | "source-complete-review-required"
    | "discovery-only"
    | "blocked";
  canonState: string;
  identityState: string;
  evidenceState: string;
  systemThesis: string;
  storyBeat: string;
  openIdentityVariables: string[];
  reviewRequirements: string[];
  sensitivityReviewRequired: boolean;
  blockedReason: string | null;
  sourceRefs: string[];
  campaign: {
    jobId: string;
    round: number;
    generationState: string;
    releaseState: string;
    releaseEligibility: string;
    publicImageUrl: string | null;
  };
}

export interface ArcaneaWorldIdentityAtlas {
  meta: {
    schema: string;
    version: string;
    generatedAt: string;
    sourceOfTruth: string;
    truthBoundary: string;
  };
  worlds: ArcaneaWorldIdentity[];
}

export interface VisualRound {
  round: number;
  status: string;
  purpose: string;
  adaptiveDecision: string;
  jobs: VisualJob[];
}

export interface ArcaneaConstellation {
  meta: {
    schema: string;
    version: string;
    generatedAt: string;
    status: string;
    sourceOfTruth: string;
    truthBoundary: string;
  };
  visualDirector: {
    operationalId: string;
    publicFaceAgentId: string;
    skillRef: string;
    mandate: string;
    authority: string;
  };
  domains: ArcaneaDomain[];
  agents: ArcaneaAgent[];
  routing: {
    defaultCouncil: string[];
    optionalSpecialist: string;
    approvalPath: string[];
  };
}

export interface VisualCampaign {
  meta: {
    schema: string;
    version: string;
    campaignId: string;
    createdAt: string;
    status: string;
    totalJobs: number;
    roundSize: number;
    generatedCount: number;
    approvedCount: number;
    publishedCount: number;
    blockedCount: number;
    machineGate: string;
    previousWave: {
      name: string;
      evidence: string;
      inspectedImages: number;
      totalPublicationPacketAssets: number;
      decision: string;
      campaignRelationship: string;
      rightsState: string;
      publicationState: string;
      legacyDossierPathRepairsRequired: number;
      releaseBoundary: string;
    };
    releaseTruth: string;
  };
  adaptiveProtocol: {
    cadence: string;
    firstDecision: string;
    benchmarkAnchors: Array<{ entityId: string; role: string }>;
    benchmarkLimitation: string;
    laterDecision: string;
    laterAllocation: string;
    probeInterpretation: string;
    providerRule: string;
    humanGates: string[];
  };
  proofProtocol: {
    reviewMethod: string;
    identityRule: string;
    stages: Array<{
      id: string;
      label: string;
      count: number;
      meaning: string;
    }>;
  };
  styles: VisualStyle[];
  rubric: {
    id: string;
    scale: string;
    dimensions: string[];
    threshold: number;
    hardFloors: Record<string, number>;
    decision: string;
  };
  rounds: VisualRound[];
}

export const ARCANEAN_CONSTELLATION = constellationData as ArcaneaConstellation;
export const ARCANEAN_VISUAL_CAMPAIGN = campaignData as VisualCampaign;
export const ARCANEAN_GUARDIAN_IDENTITIES =
  guardianData as ArcaneaGuardianIdentityAtlas;
export const ARCANEAN_GODBEAST_IDENTITIES =
  godbeastData as ArcaneaGodbeastIdentityAtlas;
export const ARCANEAN_CHARACTER_IDENTITIES =
  characterData as ArcaneaCharacterIdentityAtlas;
export const ARCANEAN_WORLD_IDENTITIES = worldData as ArcaneaWorldIdentityAtlas;

export function getArcaneaAgent(id: string): ArcaneaAgent | undefined {
  return ARCANEAN_CONSTELLATION.agents.find((agent) => agent.id === id);
}

export function getArcaneaCharacter(
  id: string,
): ArcaneaCharacterIdentity | undefined {
  return ARCANEAN_CHARACTER_IDENTITIES.characters.find(
    (character) => character.id === id,
  );
}

export function getArcaneaGuardian(
  id: string,
): ArcaneaGuardianIdentity | undefined {
  return ARCANEAN_GUARDIAN_IDENTITIES.guardians.find(
    (guardian) => guardian.id === id,
  );
}

export function getArcaneaGodbeast(
  id: string,
): ArcaneaGodbeastIdentity | undefined {
  return ARCANEAN_GODBEAST_IDENTITIES.godbeasts.find(
    (godbeast) => godbeast.id === id,
  );
}

export function getArcaneaWorld(id: string): ArcaneaWorldIdentity | undefined {
  return ARCANEAN_WORLD_IDENTITIES.worlds.find((world) => world.id === id);
}

export function getGuardianVisualJobs(guardian: ArcaneaGuardianIdentity): {
  identity: VisualJob | undefined;
  dyad: VisualJob | undefined;
} {
  const jobs = ARCANEAN_VISUAL_CAMPAIGN.rounds.flatMap((round) => round.jobs);
  return {
    identity: jobs.find((job) => job.id === guardian.campaign.identityJobId),
    dyad: jobs.find((job) => job.id === guardian.campaign.dyadJobId),
  };
}

export function getCharacterVisualJob(
  character: ArcaneaCharacterIdentity,
): VisualJob | undefined {
  return ARCANEAN_VISUAL_CAMPAIGN.rounds
    .flatMap((round) => round.jobs)
    .find((job) => job.id === character.campaign.jobId);
}

export function getGodbeastVisualJobs(godbeast: ArcaneaGodbeastIdentity): {
  morphology: VisualJob | undefined;
  dyad: VisualJob | undefined;
} {
  const jobs = ARCANEAN_VISUAL_CAMPAIGN.rounds.flatMap((round) => round.jobs);
  return {
    morphology: jobs.find(
      (job) => job.id === godbeast.campaign.morphologyJobId,
    ),
    dyad: jobs.find((job) => job.id === godbeast.campaign.dyadJobId),
  };
}

export function getWorldVisualJob(
  world: ArcaneaWorldIdentity,
): VisualJob | undefined {
  return ARCANEAN_VISUAL_CAMPAIGN.rounds
    .flatMap((round) => round.jobs)
    .find((job) => job.id === world.campaign.jobId);
}

export function getAgentVisualJobs(agent: ArcaneaAgent): VisualJob[] {
  return ARCANEAN_VISUAL_CAMPAIGN.rounds
    .flatMap((round) => round.jobs)
    .filter(
      (job) =>
        job.entityId === agent.id ||
        job.promptContract.subject.identityLock.includes(agent.name),
    );
}

export function getVisualJob(id: string): VisualJob | undefined {
  return ARCANEAN_VISUAL_CAMPAIGN.rounds
    .flatMap((round) => round.jobs)
    .find((job) => job.id.toLowerCase() === id.toLowerCase());
}
