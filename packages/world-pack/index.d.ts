// Types for @arcanea/world-pack. Kept in sync with schema/worldpack.v1.schema.json.

export type EntityType =
  | "Universe"
  | "World"
  | "Era"
  | "Location"
  | "Faction"
  | "Character"
  | "Creature"
  | "Object"
  | "Law"
  | "Power"
  | "Event"
  | "Scene"
  | "Artifact"
  | "Creator";

export type Layer = "canon" | "user" | "licensed" | "generated" | "contributed";
export type RightsState = "arcanea-owned" | "creator-owned" | "licensed" | "community-contributed" | "unresolved";
export type CanonStatus = "locked" | "staging" | "evolving" | "draft" | "non-canon" | "rejected";
export type Visibility = "public" | "unlisted" | "private";
export type Severity = "info" | "warning" | "error" | "blocker";
export type ContentHash = `sha256:${string}`;

export type RelationshipKind =
  | "part_of"
  | "located_at"
  | "member_of"
  | "bonded_to"
  | "guards"
  | "opposes"
  | "allies_with"
  | "wields"
  | "created_by"
  | "derived_from"
  | "occurs_in"
  | "precedes"
  | "governed_by"
  | "echoes";

export type Scope =
  | "canon:read"
  | "canon:propose"
  | "canon:approve-staging"
  | "canon:escalate-to-creator"
  | "world:read"
  | "world:write"
  | "rights:assign"
  | "pack:export"
  | "pack:merge";

export interface Rights {
  state: RightsState;
  spdx?: string | null;
  licenceRef?: string | null;
  commercial?: boolean;
  attribution?: boolean;
}

export interface Governance {
  owner: string;
  sourceRef?: string | null;
  versionRef?: string | null;
  branchRef?: string | null;
  visibility: Visibility;
  canonStatus: CanonStatus;
  rights: Rights;
  evalRule: string;
}

export interface EntityNode {
  id: string;
  type: EntityType;
  name: string;
  description?: string;
  layer: Layer;
  attributes?: Record<string, unknown>;
  provenance?: { apl?: string; aplVersion?: string; promptHash?: ContentHash };
  governance: Governance;
}

export interface Relationship {
  id: string;
  type: "Relationship";
  kind: RelationshipKind;
  from: string;
  to: string;
  strength?: number;
  governance: Governance;
}

export interface Branch {
  id: string;
  type: "Branch";
  name: string;
  parent: string | null;
  head: string | null;
  forkedFrom?: string | null;
  owner?: string | null;
  createdAt: string;
}

export interface Version {
  id: string;
  type: "Version";
  branch: string;
  parents: string[];
  createdAt: string;
  createdBy?: string | null;
  message?: string | null;
  digest?: ContentHash | null;
}

export interface Source {
  id: string;
  kind: "creator-input" | "canon-document" | "licensed-asset" | "model-output" | "public-contribution" | "external-reference";
  uri?: string | null;
  citation?: string | null;
  retrievedAt?: string | null;
  contentHash?: ContentHash | null;
}

export interface AgentRole {
  id: string;
  type: "AgentRole";
  name: string;
  gate?: number;
  frequencyHz?: number;
  role: string;
  charter?: string;
  authority: { scopes: Scope[]; owns: string[]; maxWaivableSeverity: Severity };
}

export interface WorldPack {
  format: "WorldPack.v1";
  packVersion: string;
  interop?: Record<string, unknown>;
  world: { id: string; name: string; slug?: string; creatorRef: string };
  canon: { document: string; sourceHash: ContentHash | null };
  nodes: EntityNode[];
  relationships: Relationship[];
  branches: Branch[];
  versions: Version[];
  sources: Source[];
  agentRoles: AgentRole[];
}

export interface CanonGate {
  index: number;
  name: string;
  frequencyHz: number;
  god: string;
  godbeast: string;
  domain: string;
}

export interface CanonEntry {
  name: string;
  kind: string;
  status: CanonStatus;
  note?: string;
}

export interface ContradictionTrigger {
  subject: string;
  subjectLabel: string;
  forbidden: string;
  source: string;
}

export interface CanonIndex {
  format: "ArcaneaCanonIndex.v1";
  sourceHash: ContentHash;
  /** Taken from the document's own title; `null` if it has none. */
  universeName: string | null;
  /** The owner id a canon-layer node must carry to be attested. */
  canonOwner: string | null;
  profile: "arcanea" | "custom";
  primordials: Array<{ name: string; aspect: string; nature: string }>;
  elements: string[];
  gates: CanonGate[];
  ranks: Array<{ rank: string; minGates: number; maxGates: number }>;
  wisdoms: Array<{ name: string; archive: string; element: string }>;
  houses: string[];
  originClasses: Array<{ name: string; status: CanonStatus; powerSource: string }>;
  terms: Array<{ term: string; status: CanonStatus; definition: string }>;
  lockedTruths: string[];
  contradictionTriggers: ContradictionTrigger[];
  names: Record<string, CanonEntry>;
  /** Same entries keyed by `normalizeName`, so case, punctuation and diacritics are not a way around a locked name. */
  namesNormalized: Record<string, CanonEntry>;
}

export interface Finding {
  ruleId: string;
  severity: Severity;
  nodeId: string | null;
  nodeName: string | null;
  message: string;
  evidence: Record<string, unknown>;
}

export interface ConflictReport {
  findings: Finding[];
  blockers: number;
  errors: number;
  clean: boolean;
}

export function buildCanonIndex(markdown: string): CanonIndex;
export function loadCanonIndex(path: string): Promise<CanonIndex>;
export function canonName(index: CanonIndex, name: string): CanonEntry | null;
export function canonNameLoose(index: CanonIndex, candidate: string): { entry: CanonEntry; match: "exact" | "contains"; canonName: string } | null;
export function normalizeName(name: string): string;
export function rankForGates(index: CanonIndex, gatesOpen: number): string | null;
export function gateByIndex(index: CanonIndex, n: number): CanonGate | null;

/**
 * The layer a node actually has. `layer: "canon"` is never taken on the node's
 * word: it must resolve to a locked canon entry and carry the canon owner.
 */
export function deriveLayer(index: CanonIndex, node: Partial<EntityNode>): {
  layer: Layer;
  declared: Layer | null;
  attested: boolean;
  entry: CanonEntry | null;
  reason: string | null;
};
export function contradictionsIn(prose: string, triggers: ContradictionTrigger[]): ContradictionTrigger[];

export function createWorldSeed(spec: {
  name: string;
  creator: { id?: string; handle: string; displayName?: string };
  premise?: string;
  mood?: string;
  visibility?: Visibility;
  spdx?: string;
  canonSourceHash?: ContentHash;
  createdAt?: string;
  worldId?: string;
}): WorldPack;
export function addNode(pack: WorldPack, node: Partial<EntityNode> & { id: string; type: EntityType; name: string; layer: Layer }, opts?: { governanceFrom?: string }): WorldPack;
export function addRelationship(pack: WorldPack, rel: Partial<Relationship> & { id: string; kind: RelationshipKind; from: string; to: string }): WorldPack;
export function commit(pack: WorldPack, opts: { branch?: string; message: string; by: string; at?: string }): WorldPack;
export function exportPack(pack: WorldPack, opts?: { exportedAt?: string }): Record<string, unknown>;
export interface AgentRoleProblem {
  id: string | null;
  name: string | null;
  reason: string;
}

/** Digest, declared counts, and the authority model — three independent checks. */
export function verifyExport(exported: Record<string, unknown>): {
  valid: boolean;
  digestOk: boolean;
  countsOk: boolean;
  agentRolesOk: boolean;
  expected: string;
  actual: string;
  countsDeclared: Record<string, number> | null;
  countsActual: Record<string, number>;
  agentRoleProblems: AgentRoleProblem[];
};
export function contentHash(value: unknown): ContentHash;
export function packDigest(pack: WorldPack | Record<string, unknown>): ContentHash;
export function countNodes(nodes: EntityNode[]): Record<string, number>;
export function deterministicId(prefix: string, seed: string): string;

export function detectConflicts(
  pack: WorldPack,
  canon: CanonIndex,
  options?: { canonBinding?: "required" | "foreign" },
): ConflictReport;
/** Run the same rules against a creator's own canon document. */
export function checkAgainst(pack: WorldPack, canonDocument: string): { canon: CanonIndex; report: ConflictReport };
export function proseOf(node: Partial<EntityNode>): string;
/** Every rule id the conflict detector can emit, with its severity. */
export const RULES: Readonly<Record<string, Severity>>;
export const SEVERITIES: readonly Severity[];

/** Structure only; canon legality is detectConflicts' job. */
export function validatePack(pack: unknown): { valid: boolean; errors: string[] };

export function diffPacks(base: WorldPack, head: WorldPack): {
  added: EntityNode[];
  removed: EntityNode[];
  changed: Array<{ id: string; type: EntityType; name: string; fields: Array<{ path: string; base: unknown; head: unknown }> }>;
};
export function branchPack(pack: WorldPack, opts: { name: string; from?: string; owner: string; at?: string }): WorldPack;
export function mergeBranch(
  ancestor: WorldPack,
  ours: WorldPack,
  theirs: WorldPack,
  opts?: { by?: string; at?: string; intoBranch?: string; canon?: CanonIndex | null },
): { merged: WorldPack | null; conflicts: Array<{ ruleId: string; nodeId: string; path?: string; message: string }>; pack: WorldPack };

export const GUARDIAN_ROLES: readonly AgentRole[];
export function guardianById(id: string): AgentRole | null;
export function hasScope(role: AgentRole, scope: Scope): boolean;
export function decide(role: AgentRole, report: { findings: Finding[] }): { verdict: "approve" | "reject" | "escalate"; reasons: string[]; owned: Finding[] };
export function runGuardianEvals(cases?: unknown[]): { passed: number; failed: unknown[] };
/** Check the roles a pack carries against the Guardian definitions in code. */
export function verifyAgentRoles(roles: AgentRole[]): AgentRoleProblem[];
export function withGuardianRoles(pack: WorldPack): WorldPack;

export const ENTITY_TYPES: readonly EntityType[];
export const NODE_KINDS: readonly string[];
export const LAYERS: readonly Layer[];
export const RIGHTS_STATES: readonly RightsState[];
export const CANON_STATUSES: readonly CanonStatus[];

export namespace apl {
  interface Compiled {
    templateId: string;
    prompt: string;
    contract: { format: "AplOutputContract.v1"; produces: EntityType; required: string[]; attributes: Record<string, unknown>; rules: string[] };
    constraints: string[];
    bindings: Record<string, unknown>;
    hash: ContentHash;
  }
  const APL_VERSION: string;
  const TEMPLATES: Record<string, unknown>;
  class AplError extends Error {}
  function compile(templateId: string, bindings: Record<string, unknown>, ctx: { canon: CanonIndex; pack?: WorldPack }): Compiled;
  function materialize(
    compiled: Compiled,
    answer: { name: string; description?: string; attributes?: Record<string, unknown> },
    opts: { id: string; layer?: Layer; governance: Governance },
  ): EntityNode;
}
