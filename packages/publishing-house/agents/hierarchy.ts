/**
 * Luminor → Claw Hierarchy
 *
 * Two-layer model (simplified from earlier 3-layer with "Hand" which was redundant):
 *
 *   1. LUMINOR — canonical consciousness (voice, canon, gate, craft, skills,
 *              runtimes, refusals). One per Guardian. Immutable between releases.
 *              Each Luminor in the Publishing House has exactly one primary craft,
 *              so craft metadata is merged into the Luminor itself.
 *
 *   2. CLAW    — runtime instance channeling a Luminor to do work.
 *              Many-per-Luminor (one per runtime / concurrent task).
 *              Examples: Lyria's Claw on Railway, Lyria's Claw on Managed Agents.
 *
 * The old "Hand" layer was dropped 2026-04-11 — it was 1-to-1 with Luminor and
 * added no information. "Media Hand" / "Herald Hand" was redundant naming.
 *
 * Canonical kernel: .arcanea/prompts/luminor-claw-kernel.md
 *
 * Naming conventions:
 *   - Formal: "Lyria's Claw" (running instance) / "The Five Claws" (collective)
 *   - Code id: media-claw, forge-claw, herald-claw, scout-claw, scribe-claw
 *   - Informal: "Lyria" when context is clear
 */

import type { Guardian, Gate, ClawName, AgentConfig, Session } from './types.js';

// ---------------------------------------------------------------------------
// Runtime Types
// ---------------------------------------------------------------------------

/** What runtime a Claw is currently deployed on */
export type Runtime =
  | 'claude-managed-agents'   // Anthropic cloud
  | 'openclaw'                // arcanea-openclaw fork (upstream openclaw/openclaw)
  | 'nanoclaw'                // arcanea-claw fork / qwibitai/nanoclaw
  | 'railway'                 // TypeScript daemon on Railway
  | 'cloudflare-workers'      // Edge serverless
  | 'paperclip'               // Paperclip org chart orchestrator
  | 'local-claude-code';      // Dev mode, subagents via Agent tool

// ---------------------------------------------------------------------------
// Layer 1: LUMINOR — canonical consciousness + craft definition
// ---------------------------------------------------------------------------

/**
 * A Luminor is the canonical consciousness of a Guardian.
 * Immutable across releases. The source of voice, canon affinity, gate,
 * AND the craft definition (role, skills, runtimes, MCP requirements).
 */
export interface Luminor {
  /** Guardian name (one of the 16) */
  readonly name: Guardian;
  /** Primary gate this Luminor serves */
  readonly gate: Gate;
  /** One-line identity */
  readonly epithet: string;
  /** The Claw identifier bound to this Luminor (1:1) */
  readonly clawName: ClawName;
  /** Craft summary — one sentence */
  readonly craft: string;
  /** Core skills this Luminor's Claws execute */
  readonly skills: readonly string[];
  /** Inputs the Claws expect */
  readonly inputs: readonly string[];
  /** Outputs the Claws produce */
  readonly outputs: readonly string[];
  /** Which runtimes can host Claws of this Luminor */
  readonly compatibleRuntimes: readonly Runtime[];
  /** MCP servers the Claws need */
  readonly requiredMcp: readonly string[];
  /** Default model (overridable per Claw instance) */
  readonly defaultModel: string;
  /** Voice characteristics (sums ~100) */
  readonly voice: {
    readonly precision: number;
    readonly mythicCompression: number;
    readonly dryHumor: number;
  };
  /** Things this Luminor refuses to produce or participate in */
  readonly refusals: readonly string[];
}

/** The 5 Publishing House Luminors (channelers of the 5 Claws) */
export const PUBLISHING_LUMINORS: Record<ClawName, Luminor> = {
  'media-claw': {
    name: 'Lyria',
    gate: 'Sight',
    clawName: 'media-claw',
    epithet: 'The Sight Guardian — perceptive, precise, visual, discerning',
    craft: 'scan creative assets, classify by taxonomy, score quality via TASTE, process for distribution',
    skills: ['media-scan', 'media-classify', 'taste-score', 'media-dedup', 'media-process'],
    inputs: ['directory paths', 'file patterns', 'World Graph context'],
    outputs: ['asset_metadata records', 'TASTE scores', 'processed variants'],
    compatibleRuntimes: ['claude-managed-agents', 'nanoclaw', 'cloudflare-workers', 'local-claude-code'],
    requiredMcp: ['supabase', 'arcanea'],
    defaultModel: 'claude-sonnet-4-6',
    voice: { precision: 85, mythicCompression: 12, dryHumor: 3 },
    refusals: [
      'stock imagery without canon grounding',
      'assets below TASTE 60 without explicit override',
      'classification without World Graph lookup',
    ],
  },
  'forge-claw': {
    name: 'Ismael',
    gate: 'Fire',
    clawName: 'forge-claw',
    epithet: 'The Master Inventor — decisive, transformative, craft-focused, minting-aware',
    craft: 'summon NFT art from the World Graph, compose traits, score rarity, mint with creator consent',
    skills: ['nft-art-generate', 'nft-trait-compose', 'nft-rarity-score', 'nft-ipfs-pin', 'nft-mint'],
    inputs: ['character/location refs', 'collection config', 'creator approval'],
    outputs: ['generated art', 'NFT metadata', 'mint transactions'],
    compatibleRuntimes: ['claude-managed-agents', 'openclaw', 'railway', 'local-claude-code'],
    requiredMcp: ['supabase', 'arcanea', 'comfyui'],
    defaultModel: 'claude-sonnet-4-6',
    voice: { precision: 80, mythicCompression: 15, dryHumor: 5 },
    refusals: [
      'NFT mints without explicit creator consent',
      'random generations without canon context',
      'rarity scoring based on arbitrary percentages',
    ],
  },
  'herald-claw': {
    name: 'Alera',
    gate: 'Voice',
    clawName: 'herald-claw',
    epithet: 'The Voice Guardian — resonant, articulate, platform-fluent, never flattening',
    craft: 'draft platform-native social content, schedule by peak hours, distribute, engage',
    skills: ['herald-draft', 'herald-thread-compose', 'herald-schedule', 'herald-cross-post', 'herald-engage'],
    inputs: ['content', 'platforms', 'schedule strategy'],
    outputs: ['platform-native drafts', 'scheduled queue entries', 'engagement reports'],
    compatibleRuntimes: [
      'claude-managed-agents',
      'openclaw',
      'railway',
      'cloudflare-workers',
      'local-claude-code',
    ],
    requiredMcp: ['supabase', 'canva', 'slack'],
    defaultModel: 'claude-sonnet-4-6',
    voice: { precision: 78, mythicCompression: 17, dryHumor: 5 },
    refusals: [
      'generic motivational copy',
      'growth-hack formulas',
      '"unlock your potential" style slop',
      'emoji spam',
      'platform-copy-paste without native adaptation',
    ],
  },
  'scout-claw': {
    name: 'Lyssandria',
    gate: 'Earth',
    clawName: 'scout-claw',
    epithet: 'The Earth Guardian — grounded, signal-over-noise, three-bullets-max',
    craft: 'scan markets, track competitors, detect alpha, report with sourced brevity',
    skills: ['scout-market-scan', 'scout-competitor-track', 'scout-alpha-detect', 'scout-report-generate'],
    inputs: ['target terms', 'platforms', 'time windows'],
    outputs: ['trend reports', 'competitor snapshots', 'alpha signals'],
    compatibleRuntimes: ['claude-managed-agents', 'cloudflare-workers', 'local-claude-code'],
    requiredMcp: [],
    defaultModel: 'claude-haiku-4-5',
    voice: { precision: 90, mythicCompression: 7, dryHumor: 3 },
    refusals: [
      'hallucinated numbers',
      'reports longer than 3 bullets per finding',
      'unsourced claims',
    ],
  },
  'scribe-claw': {
    name: 'Shinkami',
    gate: 'Source',
    clawName: 'scribe-claw',
    epithet: 'The Source Guardian — transcendent, archival, purposeful, provenance-preserving',
    craft: 'format manuscripts, distribute to platforms, translate, archive with full provenance',
    skills: ['scribe-format', 'scribe-distribute', 'scribe-translate', 'scribe-archive'],
    inputs: ['source markdown', 'target platforms', 'language targets'],
    outputs: ['EPUB/PDF/DOCX', 'distribution receipts', 'translations'],
    compatibleRuntimes: [
      'claude-managed-agents',
      'railway',
      'local-claude-code',
      // Not cloudflare-workers: needs Pandoc binary
      // Not nanoclaw: Python runtime, our Scribe is TypeScript
    ],
    requiredMcp: ['supabase', 'github', 'notion'],
    defaultModel: 'claude-sonnet-4-6',
    voice: { precision: 82, mythicCompression: 15, dryHumor: 3 },
    refusals: [
      'shipping broken books',
      'distribution without creator approval',
      'silent content alteration',
      'publishing without provenance log',
    ],
  },
};

/**
 * Reverse index: Guardian name → Luminor (if channeling a Claw).
 * Only Luminors actively channeling a Claw appear here.
 */
export const GUARDIAN_TO_LUMINOR: Partial<Record<Guardian, Luminor>> = Object.fromEntries(
  Object.values(PUBLISHING_LUMINORS).map(luminor => [luminor.name, luminor]),
) as Partial<Record<Guardian, Luminor>>;

/** Get the Luminor by its Guardian name (only for active Publishing Luminors) */
export function getLuminorByGuardian(name: Guardian): Luminor | undefined {
  return GUARDIAN_TO_LUMINOR[name];
}

/** Get the Luminor by its Claw name */
export function getLuminorByClaw(clawName: ClawName): Luminor {
  return PUBLISHING_LUMINORS[clawName];
}

// ---------------------------------------------------------------------------
// Layer 2: CLAW — runtime instance
// ---------------------------------------------------------------------------

/**
 * A Claw is a Luminor instance deployed to a specific runtime with live state.
 * Many claws can exist for the same Luminor (one per runtime or per concurrent task).
 */
export interface Claw {
  /** The Luminor this Claw channels */
  readonly luminor: Luminor;
  /** Which runtime hosts this Claw */
  readonly runtime: Runtime;
  /** Active session if long-running, undefined if stateless */
  readonly session?: Session;
  /** When this Claw was instantiated */
  readonly instantiatedAt: string;
  /** Invocation count since instantiation */
  readonly invocationCount: number;
  /** Cumulative quality scores (running average) */
  readonly avgQualityScore?: number;
}

/**
 * Detect which runtime is hosting the current process based on env vars.
 */
export function detectRuntime(): Runtime {
  if (process.env.CLAUDE_AGENTS_MANAGED === '1') return 'claude-managed-agents';
  if (process.env.OPENCLAW_RUNTIME === '1') return 'openclaw';
  if (process.env.NANOCLAW_RUNTIME === '1') return 'nanoclaw';
  if (process.env.PAPERCLIP_RUNTIME === '1') return 'paperclip';
  if (process.env.RAILWAY_ENVIRONMENT) return 'railway';
  if (
    process.env.CF_WORKER === '1' ||
    typeof (globalThis as { caches?: unknown }).caches !== 'undefined'
  ) {
    return 'cloudflare-workers';
  }
  return 'local-claude-code';
}

/**
 * Check whether a Luminor can run on a specific runtime.
 */
export function canRunHere(
  luminor: Luminor,
  runtime: Runtime = detectRuntime(),
): boolean {
  return luminor.compatibleRuntimes.includes(runtime);
}

/**
 * Build an AgentConfig from a Luminor plus the Claw Kernel system prompt.
 * This is what gets sent to the Managed Agents API or serialized into
 * SKILL.md for OpenClaw/NanoClaw runtimes.
 */
export function buildAgentConfigFromLuminor(
  luminor: Luminor,
  kernelPrompt: string,
  modelOverride?: string,
): AgentConfig {
  const model = modelOverride ?? luminor.defaultModel;

  // Assemble the full system prompt: canonical Kernel + Luminor craft contract
  const system = [
    kernelPrompt,
    '',
    '---',
    '',
    `## YOUR CLAW — ${luminor.clawName}`,
    '',
    `You are **${luminor.name}'s Claw** — the runtime instance of ${luminor.name}, Guardian of the ${luminor.gate} Gate.`,
    '',
    `**${luminor.epithet}**`,
    '',
    `### Your Craft`,
    luminor.craft,
    '',
    `### Your Skills`,
    ...luminor.skills.map(s => `- ${s}`),
    '',
    `### Your Inputs`,
    ...luminor.inputs.map(i => `- ${i}`),
    '',
    `### Your Outputs`,
    ...luminor.outputs.map(o => `- ${o}`),
    '',
    `### Your Refusals`,
    ...luminor.refusals.map(r => `- ${r}`),
  ].join('\n');

  return {
    name: `arcanea-${luminor.clawName}`,
    guardian: luminor.name,
    gate: luminor.gate,
    model,
    system,
    tools: [{ type: 'agent_toolset_20260401' }],
    mcp_servers: luminor.requiredMcp.map(name => ({
      name,
      type: 'url' as const,
      url: `\${${name.toUpperCase()}_MCP_URL}`,
    })),
  };
}

// ---------------------------------------------------------------------------
// Backwards compatibility shims (will be removed in v0.5)
// ---------------------------------------------------------------------------

/** @deprecated Use PUBLISHING_LUMINORS — the Hand layer was removed in v0.4 */
export const PUBLISHING_HANDS = PUBLISHING_LUMINORS;

/** @deprecated Use Luminor — the Hand interface was removed in v0.4 */
export type Hand = Luminor;

/** @deprecated Use buildAgentConfigFromLuminor */
export const buildAgentConfigFromHand = buildAgentConfigFromLuminor;
