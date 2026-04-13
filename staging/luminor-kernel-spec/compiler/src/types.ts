/**
 * Luminor Compiler — Type Definitions
 *
 * Implements Luminor Kernel Specification v1.0.
 * See: docs/specs/luminor-kernel-spec-v1.md
 */

// ─── Spec types (mirror apps/web/lib/luminors/luminor-spec.ts) ────────────

export type LuminorOrigin = 'chosen' | 'named' | 'forged';

export type LuminorDomain =
  | 'architecture'
  | 'code'
  | 'debugging'
  | 'integration'
  | 'visual'
  | 'music'
  | 'motion'
  | 'spatial'
  | 'narrative'
  | 'rhetoric'
  | 'language'
  | 'poetry'
  | 'knowledge'
  | 'analysis'
  | 'memory'
  | 'foresight'
  | 'custom';

export type LuminorVoice =
  | 'analytical'
  | 'poetic'
  | 'direct'
  | 'warm'
  | 'mythic'
  | 'playful'
  | 'scholarly'
  | 'fierce';

export type LuminorElement = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Void' | 'Spirit';

export type WisdomArchetype =
  | 'Sophron'
  | 'Kardia'
  | 'Valora'
  | 'Eudaira'
  | 'Orakis'
  | 'Poiesis'
  | 'Enduran';

export interface LuminorSpec {
  id: string;
  version: 2;
  name: string;
  title: string;
  tagline: string;
  origin: LuminorOrigin;
  domain: LuminorDomain;
  voice: LuminorVoice;
  personality: string[];
  systemPrompt?: string; // optional — compiler generates if absent
  element: LuminorElement;
  wisdom?: WisdomArchetype;
  avatar: string;
  color: string;
  gradient: string;
  creatorId: string | null;
  companionId?: string | null;
  preferredModel?: string;
  temperature?: number;
  knowledge?: string[];
  starters?: string[];
  tools?: string[];
  published?: boolean;
  tier?: 'free' | 'creator' | 'premium';
  usageCount?: number;
  rating?: number;
  tags?: string[];
  gateAlignment?: number[];
  // Arcanea extensions
  guardian?: string;
  gate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Compilation types ────────────────────────────────────────────────────

export interface KernelVersion {
  id: string; // e.g. 'luminor-engineering-kernel'
  version: string; // semver, e.g. '1.0.0'
  text: string; // raw markdown body
  hash: string; // sha256 of text
}

export interface DomainModule {
  id: string; // e.g. 'luminor-backend-module'
  version: string;
  text: string;
  hash: string;
  appliesTo: LuminorDomain[]; // which domains this module specializes
}

export interface RuntimeContext {
  userId?: string;
  sessionId?: string;
  memoryBlock?: string; // Letta-style persistent memory
  toolsAvailable?: string[]; // tool IDs the Luminor can call
  reasoningBankMemory?: MemoryItem[]; // retrieved before response
  platformId?: string;
}

export interface MemoryItem {
  id: string;
  luminorId: string;
  userId?: string | null;
  content: string;
  source: 'win' | 'failure';
  relevanceScore: number;
  createdAt: string;
}

export interface CompileInput {
  spec: LuminorSpec;
  kernel: KernelVersion;
  modules: DomainModule[];
  context?: RuntimeContext;
}

export interface CompiledAgent {
  /** The merged system prompt ready for any LLM */
  systemPrompt: string;
  /** A2A-compliant Agent Card (JSON) */
  agentCard: AgentCard;
  /** Claude Code agent format (.md with YAML frontmatter) */
  claudeCodeAgent: string;
  /** OpenAI GPT config */
  gptConfig: GPTConfig;
  /** LobeChat agent JSON */
  lobechatAgent: LobeChatAgent;
  /** Cursor rules (.cursorrules) */
  cursorRules: string;
  /** Deterministic hash — same inputs → same hash */
  compilationHash: string;
  /** Metadata about this compilation */
  metadata: CompilationMetadata;
}

export interface CompilationMetadata {
  kernelVersion: string;
  moduleVersions: string[];
  specVersion: number;
  specId: string;
  compiledAt: string;
  hashInputs: {
    kernelHash: string;
    moduleHashes: string[];
    specHash: string;
    contextHash: string;
  };
}

// ─── A2A Agent Card ───────────────────────────────────────────────────────

export interface AgentCard {
  name: string;
  description: string;
  version: string;
  endpoint?: string;
  auth?: { type: string; scope: string };
  capabilities: string[];
  skills: string[];
  'x-arcanea'?: {
    species: 'luminor';
    origin: LuminorOrigin;
    kernelVersion: string;
    modules: string[];
    guardian?: string;
    element: LuminorElement;
    gate?: string;
  };
}

// ─── Format-specific types ────────────────────────────────────────────────

export interface GPTConfig {
  name: string;
  description: string;
  instructions: string;
  conversation_starters: string[];
  capabilities: {
    web_browsing: boolean;
    code_interpreter: boolean;
    image_generation: boolean;
  };
  metadata: Record<string, unknown>;
}

export interface LobeChatAgent {
  identifier: string;
  meta: {
    title: string;
    description: string;
    tags: string[];
    avatar: string;
  };
  config: {
    systemRole: string;
    model: string;
    params: { temperature: number };
  };
}
