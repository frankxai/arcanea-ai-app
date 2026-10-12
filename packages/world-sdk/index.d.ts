// Type surface for @arcanea/world-sdk. Runtime is ESM .mjs; these types are for consumers.

export type JsonValue =
  null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export type RealmEntityType =
  | "character"
  | "place"
  | "faction"
  | "creature"
  | "artifact"
  | "world-rule"
  | "event"
  | "timeline"
  | "series"
  | "work"
  | "scene"
  | "quest"
  | "asset"
  | "release";
export interface RealmEntity {
  readonly id: string;
  readonly type: RealmEntityType;
  readonly label: string;
  readonly workId?: string;
  readonly timelineId?: string;
  readonly moment?: number;
  readonly participants?: readonly string[];
}
export interface RealmSource {
  readonly path: string;
  readonly sha256: string;
  readonly commit?: string;
  readonly lineStart?: number;
  readonly lineEnd?: number;
}
export interface RealmCandidateAssertion {
  readonly id: string;
  readonly subjectId: string;
  readonly predicate: string;
  readonly value: JsonValue;
  readonly cardinality: "one" | "many";
  readonly status: "STAGING" | "CANDIDATE";
  readonly confidence: number;
  readonly validity: {
    readonly timelineId: string;
    readonly from: number;
    readonly to: number | null;
  } | null;
  readonly source: RealmSource;
  readonly affectedArtifacts: readonly string[];
  readonly supersedes: readonly string[];
}
export interface RealmStaging {
  readonly schemaVersion: "realm.arcanea.graph.v0";
  readonly releaseId: string;
  readonly description?: string;
  readonly entities: readonly RealmEntity[];
  readonly assertions: readonly RealmCandidateAssertion[];
  readonly dependencies: readonly {
    readonly dependsOn: string;
    readonly artifactId: string;
  }[];
}
export interface RealmLockedAssertion extends Omit<
  RealmCandidateAssertion,
  "status" | "validity"
> {
  readonly status: "LOCKED";
  readonly validity: null;
  readonly canonTier: "tier-1" | "tier-2";
  readonly sourceVerification: "git-byte-verified";
}
export interface RealmGraphSnapshot {
  readonly schemaVersion: "realm.arcanea.graph.v0";
  readonly releaseId: string;
  readonly canonSource: RealmSource & { readonly commit: string };
  readonly locked: {
    readonly coverage: "primordial-duality-and-ten-gates-tables-only";
    readonly entities: readonly RealmEntity[];
    readonly assertions: readonly RealmLockedAssertion[];
  };
  readonly staging: RealmStaging;
  readonly canonPromotionAllowed: false;
}
declare const realmGraphBrand: unique symbol;
export interface RealmGraph extends RealmGraphSnapshot {
  readonly [realmGraphBrand]: true;
}
export interface RealmContinuity {
  readonly schemaVersion: "realm.arcanea.graph.v0";
  readonly releaseId: string;
  readonly canonSource: RealmSource & { readonly commit: string };
  readonly characterId: string;
  readonly sceneId: string;
  readonly timelineId: string;
  readonly moment: number;
  readonly lockedFacts: readonly RealmLockedAssertion[];
  readonly candidateFacts: readonly (RealmCandidateAssertion & {
    readonly canonTier: "proposal";
    readonly sourceVerification: "declared";
  })[];
  readonly conflicts: readonly {
    readonly subjectId: string;
    readonly predicate: string;
    readonly lockedAssertionIds: readonly string[];
    readonly candidateAssertionIds: readonly string[];
  }[];
  readonly canonPromotionAllowed: false;
}
export interface RealmImpact {
  readonly schemaVersion: "realm.arcanea.graph.v0";
  readonly releaseId: string;
  readonly canonSource: RealmSource & { readonly commit: string };
  readonly changeId: string;
  readonly coverage: "declared-dependencies-only";
  readonly affected: readonly (RealmEntity & {
    readonly via: readonly string[];
  })[];
  readonly canonPromotionAllowed: false;
}
export function openRealmGraph(
  repoRoot: string,
  commit: string,
  staging: unknown,
): Promise<RealmGraph>;
export function realmContinuity(
  graph: RealmGraph,
  characterId: string,
  sceneId: string,
): RealmContinuity;
export function realmImpact(graph: RealmGraph, changeId: string): RealmImpact;
export function exportRealmGraph(graph: RealmGraph): RealmGraphSnapshot;

export interface WorldManifest {
  $schema?: string;
  schemaVersion: string;
  id: string;
  slug?: string;
  name: string;
  tagline?: string;
  genesisPrompt?: string;
  premise?: string;
  laws?: string[];
  mood?:
    | "fantasy"
    | "sci-fi"
    | "horror"
    | "steampunk"
    | "mythological"
    | "cosmic"
    | "other";
  visualDna?: { palette?: string[]; style?: string; motifs?: string[] };
  theme?: { audio?: string; prompt?: string };
  cover?: string;
  creator: { handle: string; wallet?: string };
  license?: {
    spdx: string;
    pointer?: string;
    commercial?: boolean;
    remix?: "allow" | "allow-attribution" | "deny";
  };
  royalty?: { policy?: string; splits?: { to: string; bps: number }[] };
  content: Record<string, string>;
  agents?: WorldAgent[];
  index?: { embeddingModel?: string; dim?: number };
  provenance?: ProvenanceEntry[];
  visibility?: "public" | "unlisted" | "private";
  hosting?: "repo" | "hosted_private" | "hosted_public";
  snapshot?: { ipfs?: string; arweave?: string };
  game?: {
    seedPrompt?: string;
    genre?:
      "rpg" | "action" | "adventure" | "strategy" | "simulation" | "hybrid";
    mechanics?: string[];
    higgsfieldAssets?: Record<string, JsonValue> & {
      characterRefs?: string[];
      environmentPrompts?: string[];
      cinematicScenes?: string[];
    };
    proceduralMap?: Record<string, JsonValue>;
    memoryInjection?: boolean;
    lastGenerated?: string;
    playableUrl?: string;
  };
  memory?: {
    vaults?: string[];
    embeddingsModel?: string;
    evolution?: Record<string, JsonValue>[];
    persistentStates?: Record<string, JsonValue>;
  };
  meaning?: {
    pillars?: string[];
    coreBeliefs?: string[];
    emotionalAnchors?: string[];
    tensions?: string[];
  };
  community?: {
    contributors?: Record<string, JsonValue>[];
    forks?: string[];
    contributionPolicy?: string;
    reputation?: Record<string, JsonValue>;
    events?: string[];
  };
  mapper?: {
    version?: string;
    lastRun?: string;
    harnessesUsed?: string[];
    outputs?: string[];
  };
}

export interface WorldAgent {
  id: string;
  harness: "claude" | "codex" | "gemini" | "antigravity" | "grok" | "any";
  role: string;
  skill?: string;
}

export interface ProvenanceEntry {
  contentHash: string;
  chain: "solana" | "polygon" | "base" | "other";
  standard?: string;
  ref?: string;
  schemaVersion?: string;
  timestamp: string;
}

export interface WorldFile {
  path: string;
  bytes: Buffer | Uint8Array | string;
  isText?: boolean;
  visibility?: string;
}

export interface SceneDraftSpec {
  sceneId: string;
  title: string;
  characterPath: string;
  sourcePaths?: string[];
  brief: string;
  author: string;
}
export interface SceneProducer {
  kind: "author" | "model";
  name: string;
  harness?: string;
  model?: string;
}
export interface SceneDraftRecord {
  schema: "arcanea.scene-draft.v1";
  sceneId: string;
  revision: number;
  parentSha256: string | null;
  world: { id: string; name: string };
  sources: {
    path: string;
    sha256: string;
    utf8: string;
    authority: "creator-working-source";
  }[];
  characterPath: string;
  title: string;
  brief: string;
  author: string;
  prose: string;
  producer: SceneProducer;
  createdAt: string;
  approval: { canon: false; publication: false };
}
export interface SceneDraft {
  record: SceneDraftRecord;
  sha256: string;
}
export function createSceneDraft(
  dir: string,
  spec: SceneDraftSpec,
): Promise<SceneDraft>;
export function readSceneDraft(
  dir: string,
  sceneId: string,
): Promise<SceneDraft>;
export function reviseSceneDraft(
  dir: string,
  sceneId: string,
  update: { expectedSha256: string; prose: string; producer: SceneProducer },
): Promise<SceneDraft>;
export function scenePrompt(dir: string, sceneId: string): Promise<string>;
export function exportSceneDraft(
  dir: string,
  sceneId: string,
): Promise<{ markdown: string; receipt: string }>;

export interface World {
  dir: string;
  manifest: WorldManifest;
  files: WorldFile[];
}

export interface WorldSpec {
  schemaVersion?: string;
  name?: string;
  genesisPrompt?: string;
  premise?: string;
  laws?: string[];
  mood?: WorldManifest["mood"];
  visualDna?: WorldManifest["visualDna"];
  theme?: WorldManifest["theme"];
  characters?: {
    name: string;
    role?: string;
    persona?: string;
    backstory?: string;
  }[];
  locations?: { name: string; description?: string }[];
  agents?: WorldAgent[];
  creator?: { handle: string; wallet?: string };
  idSeed?: string;
  game?: WorldManifest["game"];
  memory?: WorldManifest["memory"];
  meaning?: WorldManifest["meaning"];
  community?: WorldManifest["community"];
  mapper?: WorldManifest["mapper"];
}

export interface ChainAdapter {
  chain: string;
  getOrCreateWallet(handle: string): Promise<{ pubkey: string }>;
  mint(proof: object): Promise<{ ref: string; standard: string }>;
}

export function worldId(seed: string): string;
export function slugify(name: string): string;
export function buildManifest(
  spec: WorldSpec & Partial<WorldManifest>,
): WorldManifest;
/** Checks JSON shape only. No URI retrieval, permission, rights or canon approval. */
export function validateManifest(m: unknown): {
  valid: boolean;
  errors: string[];
};
export function contentHash(
  files: WorldFile[],
  manifest: WorldManifest,
): string;
/** Local declared-source profile; shared proof-contract approval is pending. */
export const CONTENT_HASH_PROFILE: "arcanea-world-sdk/declared-public-v1";
export function readWorld(dir: string): Promise<World>;
export function checkWorldFiles(
  dir: string,
  paths: string[],
): Promise<{ dir: string; paths: string[] }>;
export function writeFiles(
  dir: string,
  files: WorldFile[],
  options?: { exclusive?: boolean },
): Promise<void>;
export function writeManifest(
  dir: string,
  manifest: WorldManifest,
): Promise<void>;
export function genesis(
  sentence: string,
  opts?: { llm?: (p: string) => Promise<object>; idSeed?: string },
): Promise<WorldSpec>;
export function genesisOffline(
  sentence: string,
  opts?: { idSeed?: string },
): WorldSpec;
export function scaffoldWorld(
  dir: string,
  spec: WorldSpec,
  opts?: { useWorldEngine?: boolean },
): Promise<WorldManifest>;
export function createWorld(
  dir: string,
  sentence: string,
  opts?: {
    llm?: (p: string) => Promise<object>;
    idSeed?: string;
    creator?: { handle: string };
    useWorldEngine?: boolean;
  },
): Promise<{ dir: string; manifest: WorldManifest }>;
export function assignmentsFor(
  manifest: WorldManifest,
  harness: string,
): WorldAgent[];
export type WorldCommitResult =
  | { status: "committed"; sha: string; paths: string[] }
  | { status: "unchanged" | "not-a-repository"; paths: string[] };
export function commitWorld(
  dir: string,
  message: string,
  options: { paths: string[] },
): Promise<WorldCommitResult>;
export function harnessContext(args: {
  dir: string;
  harness: string;
  manifest: WorldManifest;
}): {
  harness: string;
  assignments: WorldAgent[];
  addCharacter(c: object): Promise<string>;
  appendLore(l: {
    title: string;
    body: string;
    canonLevel?: number;
  }): Promise<string>;
  addQuest(q: { title: string; body: string }): Promise<string>;
  commit(msg: string): Promise<WorldCommitResult>;
};
export function buildIndex(world: World): {
  worldId: string;
  embedding: { model: string; dim: number };
  nodes: object[];
  chunks: object[];
};
export function verifySignature(
  secret: string,
  rawBody: string | Buffer,
  signatureHeader: string,
): boolean;
export function handlePush(args: {
  rawBody: string | Buffer;
  signature?: string;
  secret?: string;
  loadWorld: (payload: object) => Promise<World>;
  persistIndex: (index: object, meta: object) => Promise<void>;
}): Promise<{
  ok: boolean;
  status: number;
  worldId?: string;
  sha?: string;
  nodes?: number;
  chunks?: number;
  error?: string;
}>;
export function mockChain(chain?: string, standard?: string): ChainAdapter;
/** Local tagged proposal only. Does not invoke adapters or establish approved rights. */
export function computeProof(args: {
  manifest: WorldManifest;
  hash: string;
  chain?: string;
  repoPointer?: string;
  wallet?: string;
  now?: string;
}): {
  worldId: string;
  contentHash: string;
  hashProfile: typeof CONTENT_HASH_PROFILE;
  [field: string]: unknown;
};
/** @deprecated Always rejects before access until a profile-aware contract is accepted. */
export function claimWorldProof(args: {
  dir: string;
  adapter?: ChainAdapter;
  chain?: string;
  repoPointer?: string;
  now?: string;
}): Promise<never>;
