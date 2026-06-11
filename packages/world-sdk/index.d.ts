// Type surface for @arcanea/world-sdk. Runtime is ESM .mjs; these types are for consumers.

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
  mood?: "fantasy" | "sci-fi" | "horror" | "steampunk" | "mythological" | "cosmic" | "other";
  visualDna?: { palette?: string[]; style?: string; motifs?: string[] };
  theme?: { audio?: string; prompt?: string };
  cover?: string;
  creator: { handle: string; wallet?: string };
  license?: { spdx: string; pointer?: string; commercial?: boolean; remix?: "allow" | "allow-attribution" | "deny" };
  royalty?: { policy?: string; splits?: { to: string; bps: number }[] };
  content: Record<string, string>;
  agents?: WorldAgent[];
  index?: { embeddingModel?: string; dim?: number };
  provenance?: ProvenanceEntry[];
  visibility?: "public" | "unlisted" | "private";
  hosting?: "repo" | "hosted_private" | "hosted_public";
  snapshot?: { ipfs?: string; arweave?: string };
}

export interface WorldAgent {
  id: string;
  harness: "claude" | "codex" | "gemini" | "antigravity" | "any";
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

export interface World {
  dir: string;
  manifest: WorldManifest;
  files: WorldFile[];
}

export interface WorldSpec {
  name?: string;
  genesisPrompt?: string;
  premise?: string;
  laws?: string[];
  mood?: WorldManifest["mood"];
  visualDna?: WorldManifest["visualDna"];
  theme?: WorldManifest["theme"];
  characters?: { name: string; role?: string; persona?: string; backstory?: string }[];
  locations?: { name: string; description?: string }[];
  agents?: WorldAgent[];
  creator?: { handle: string; wallet?: string };
  idSeed?: string;
}

export interface ChainAdapter {
  chain: string;
  getOrCreateWallet(handle: string): Promise<{ pubkey: string }>;
  mint(proof: object): Promise<{ ref: string; standard: string }>;
}

export function worldId(seed: string): string;
export function slugify(name: string): string;
export function buildManifest(spec: WorldSpec & Partial<WorldManifest>): WorldManifest;
export function validateManifest(m: WorldManifest): { valid: boolean; errors: string[] };
export function contentHash(files: WorldFile[], manifest: WorldManifest): string;
export function readWorld(dir: string): Promise<World>;
export function writeManifest(dir: string, manifest: WorldManifest): Promise<void>;
export function genesis(sentence: string, opts?: { llm?: (p: string) => Promise<object>; idSeed?: string }): Promise<WorldSpec>;
export function genesisOffline(sentence: string, opts?: { idSeed?: string }): WorldSpec;
export function scaffoldWorld(dir: string, spec: WorldSpec, opts?: { useWorldEngine?: boolean }): Promise<WorldManifest>;
export function createWorld(dir: string, sentence: string, opts?: { llm?: (p: string) => Promise<object>; idSeed?: string; creator?: { handle: string }; useWorldEngine?: boolean }): Promise<{ dir: string; manifest: WorldManifest }>;
export function assignmentsFor(manifest: WorldManifest, harness: string): WorldAgent[];
export function harnessContext(args: { dir: string; harness: string; manifest: WorldManifest }): {
  harness: string;
  assignments: WorldAgent[];
  addCharacter(c: object): Promise<string>;
  appendLore(l: { title: string; body: string; canonLevel?: number }): Promise<string>;
  addQuest(q: { title: string; body: string }): Promise<string>;
  commit(msg: string): Promise<{ sha: string } | null>;
};
export function buildIndex(world: World): { worldId: string; embedding: { model: string; dim: number }; nodes: object[]; chunks: object[] };
export function verifySignature(secret: string, rawBody: string | Buffer, signatureHeader: string): boolean;
export function handlePush(args: {
  rawBody: string | Buffer;
  signature?: string;
  secret?: string;
  loadWorld: (payload: object) => Promise<World>;
  persistIndex: (index: object, meta: object) => Promise<void>;
}): Promise<{ ok: boolean; status: number; worldId?: string; sha?: string; nodes?: number; chunks?: number; error?: string }>;
export function mockChain(chain?: string, standard?: string): ChainAdapter;
export function claimWorldProof(args: { dir: string; adapter?: ChainAdapter; chain?: string; repoPointer?: string; now?: string }): Promise<{
  entry: ProvenanceEntry;
  contentHash: string;
  wallet: string;
  manifest: WorldManifest;
}>;
