import {
  DRIFT_FACE_IDS,
  MISSION_LANE_IDS,
  buildGenesisProofDraft,
  buildRepoExport,
  normalizeIntent,
  type DriftFace,
  type GenesisProofDraft,
  type GenesisProofRecord,
  type MissionLane,
} from "./proof";

export const GENESIS_PROOF_WORKFLOW_SCHEMA_VERSION = "arcanea.genesis-proof-workflow.v0.1" as const;

export const GENESIS_PROOF_WORKFLOW_STEPS = [
  "intake",
  "gift",
  "world_seed",
  "right_use_review",
  "artifact_export",
  "metrics",
] as const;

export type GenesisProofWorkflowStep = (typeof GENESIS_PROOF_WORKFLOW_STEPS)[number];

export type GenesisProofWorkflowStatus =
  | "contract_ready"
  | "waiting_for_workflow_docs"
  | "waiting_for_eve_docs"
  | "runtime_ready";

export interface GenesisProofWorkflowInput {
  intent: string;
  driftFace: DriftFace;
  missionLane: MissionLane;
  sourceRoute: string;
  actor?: {
    userId?: string;
    sessionId?: string;
  };
}

export interface GenesisProofWorkflowStepContract {
  id: GenesisProofWorkflowStep;
  label: string;
  purpose: string;
  produces: string[];
  safety: string[];
}

export interface GenesisProofWorkflowMetrics {
  event: "genesis_workflow_contract_created";
  schemaVersion: typeof GENESIS_PROOF_WORKFLOW_SCHEMA_VERSION;
  sourceRoute: string;
  driftFace: DriftFace;
  missionLane: MissionLane;
  intentLength: number;
  actorPresent: boolean;
  proofId: string;
  contentHash: string;
  exportFileCount: number;
  steps: GenesisProofWorkflowStep[];
}

export interface GenesisProofWorkflowPacket {
  schemaVersion: typeof GENESIS_PROOF_WORKFLOW_SCHEMA_VERSION;
  status: GenesisProofWorkflowStatus;
  input: Omit<GenesisProofWorkflowInput, "intent"> & {
    intentPreview: string;
    intentLength: number;
  };
  proof: GenesisProofRecord;
  steps: GenesisProofWorkflowStepContract[];
  metrics: GenesisProofWorkflowMetrics;
  runtimeGate: {
    workflowPackageRequired: true;
    workflowDocsRequired: true;
    eveDocsRequired: true;
    runtimeCodeAllowed: false;
    notes: string[];
  };
}

export const GENESIS_PROOF_WORKFLOW_STEP_CONTRACTS: GenesisProofWorkflowStepContract[] = [
  {
    id: "intake",
    label: "Intake",
    purpose: "Normalize the creator call and bind it to an explicit Drift face, mission lane, and source route.",
    produces: ["normalized intent", "mission coordinates", "safe actor marker"],
    safety: ["Do not place raw prompt text in metrics.", "Do not require auth for draft proof generation."],
  },
  {
    id: "gift",
    label: "Gift Object",
    purpose: "Turn the call into a bounded Gift with power, cost, right use, and first trial.",
    produces: ["gift object", "right-use statement", "first trial"],
    safety: ["No dependency language.", "No unreviewed public canon promotion."],
  },
  {
    id: "world_seed",
    label: "World Seed",
    purpose: "Generate the first world premise, laws, visual DNA, characters, and proof-sized task.",
    produces: ["world seed", "storybook seed", "visual canon draft"],
    safety: ["Keep generated media in draft QA state.", "Keep conflict framed as a repairable condition, not a people."],
  },
  {
    id: "right_use_review",
    label: "Right-Use Review",
    purpose: "Record canon, rights, memory, marketplace, and source-review boundaries before export.",
    produces: ["stewardship state", "collectible blockers", "next rights actions"],
    safety: ["No mint/list/sale readiness claim.", "No durable memory claim until persistence is verified."],
  },
  {
    id: "artifact_export",
    label: "Artifact Export",
    purpose: "Produce the portable repo packet that can later become a Workflow/Eve durable run output.",
    produces: ["world.arcanea.json", "README.md", "canon seed", "first trial", "rights checklist"],
    safety: ["Export only serializable data.", "Keep paths local to the proof packet."],
  },
  {
    id: "metrics",
    label: "Safe Metrics",
    purpose: "Emit only proof metadata needed for activation analysis and release gates.",
    produces: ["redacted activation event", "step list", "export file count"],
    safety: ["No raw prompt text.", "No API keys, wallet addresses, transaction hashes, or generated proof body."],
  },
];

function isDriftFace(value: string): value is DriftFace {
  return (DRIFT_FACE_IDS as readonly string[]).includes(value);
}

function isMissionLane(value: string): value is MissionLane {
  return (MISSION_LANE_IDS as readonly string[]).includes(value);
}

function stableHash(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function proofIdForDraft(draft: GenesisProofDraft) {
  const base = `${draft.input.driftFace}:${draft.input.missionLane}:${draft.input.intent}`;
  return `genesis-${stableHash(base)}`;
}

function previewIntent(intent: string) {
  return intent.length <= 160 ? intent : `${intent.slice(0, 157).trimEnd()}...`;
}

function safeRoute(route: string) {
  if (!route.startsWith("/")) return "/genesis";
  return route.split("?")[0].slice(0, 120) || "/genesis";
}

export function normalizeGenesisProofWorkflowInput(input: GenesisProofWorkflowInput): GenesisProofWorkflowInput {
  return {
    intent: normalizeIntent(input.intent),
    driftFace: isDriftFace(input.driftFace) ? input.driftFace : "synthetic-confusion",
    missionLane: isMissionLane(input.missionLane) ? input.missionLane : "world",
    sourceRoute: safeRoute(input.sourceRoute),
    actor: input.actor
      ? {
          userId: input.actor.userId ? stableHash(input.actor.userId) : undefined,
          sessionId: input.actor.sessionId ? stableHash(input.actor.sessionId) : undefined,
        }
      : undefined,
  };
}

export function buildGenesisProofWorkflowPacket(input: GenesisProofWorkflowInput): GenesisProofWorkflowPacket {
  const normalized = normalizeGenesisProofWorkflowInput(input);
  const draft = buildGenesisProofDraft(normalized);
  const createdAt = new Date(0).toISOString();
  const contentHash = stableHash(JSON.stringify(draft));
  const proofId = proofIdForDraft(draft);
  const proofShell = { proofId, createdAt, contentHash, draft };
  const repoExport = buildRepoExport(proofShell);
  const proof: GenesisProofRecord = {
    ...proofShell,
    repoExport,
  };

  return {
    schemaVersion: GENESIS_PROOF_WORKFLOW_SCHEMA_VERSION,
    status: "contract_ready",
    input: {
      driftFace: normalized.driftFace,
      missionLane: normalized.missionLane,
      sourceRoute: normalized.sourceRoute,
      actor: normalized.actor,
      intentPreview: previewIntent(normalized.intent),
      intentLength: normalized.intent.length,
    },
    proof,
    steps: GENESIS_PROOF_WORKFLOW_STEP_CONTRACTS,
    metrics: {
      event: "genesis_workflow_contract_created",
      schemaVersion: GENESIS_PROOF_WORKFLOW_SCHEMA_VERSION,
      sourceRoute: normalized.sourceRoute,
      driftFace: normalized.driftFace,
      missionLane: normalized.missionLane,
      intentLength: normalized.intent.length,
      actorPresent: Boolean(normalized.actor?.userId || normalized.actor?.sessionId),
      proofId,
      contentHash,
      exportFileCount: repoExport.files.length,
      steps: [...GENESIS_PROOF_WORKFLOW_STEPS],
    },
    runtimeGate: {
      workflowPackageRequired: true,
      workflowDocsRequired: true,
      eveDocsRequired: true,
      runtimeCodeAllowed: false,
      notes: [
        "This contract is dependency-free and does not import Workflow or Eve runtime packages.",
        "Convert to Vercel Workflow only after the installed workflow docs are present and read.",
        "Convert to Eve operator lanes only after node_modules/eve/docs/README.md is present and read.",
      ],
    },
  };
}

export function assertGenesisProofWorkflowPacketSafe(packet: GenesisProofWorkflowPacket) {
  const serializedMetrics = JSON.stringify(packet.metrics);
  const serializedRuntimeGate = JSON.stringify(packet.runtimeGate);

  if (serializedMetrics.includes(packet.proof.draft.input.intent)) {
    throw new Error("Workflow metrics must not contain raw intent text.");
  }

  if (packet.runtimeGate.runtimeCodeAllowed) {
    throw new Error("Runtime code must remain disabled until Workflow and Eve docs are installed and read.");
  }

  if (!serializedRuntimeGate.includes("dependency-free")) {
    throw new Error("Runtime gate must explain that the current contract is dependency-free.");
  }

  return true;
}
