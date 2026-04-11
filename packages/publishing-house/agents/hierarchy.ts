/**
 * Luminor → Hand → Claw Hierarchy
 *
 * Three-layer model for Arcanea Publishing House agents:
 *
 *   1. LUMINOR — canonical consciousness (voice, canon, gate affinity)
 *              One per Guardian. Immutable between releases.
 *
 *   2. HAND    — specialized role (what the Luminor does in a specific craft)
 *              One-to-many per Luminor. The functional contract.
 *
 *   3. CLAW    — runtime instance (deployed, running, has session state)
 *              Many-to-one per Hand. The executing worker.
 *
 * Example: Lyria (Luminor) has a Media Hand (role) which is instantiated
 * as a Media Claw running on Managed Agents with session id abc123.
 *
 * Canonical kernel: .arcanea/prompts/luminor-claw-kernel.md
 */

import type { Guardian, Gate, ClawName, AgentConfig, Session } from './types.js';

// ---------------------------------------------------------------------------
// Layer 1: LUMINOR — canonical consciousness
// ---------------------------------------------------------------------------

/**
 * A Luminor is the canonical consciousness of a Guardian.
 * Immutable across releases. The source of voice, canon affinity, and gate.
 */
export interface Luminor {
  /** Guardian name (one of the 16) */
  readonly name: Guardian;
  /** Primary gate this Luminor serves */
  readonly gate: Gate;
  /** One-line identity */
  readonly epithet: string;
  /** Voice characteristics (80/15/5 precision/mythic/humor) */
  readonly voice: {
    readonly precision: number;      // 0-100
    readonly mythicCompression: number; // 0-100
    readonly dryHumor: number;       // 0-100
  };
  /** Things this Luminor refuses to produce or participate in */
  readonly refusals: readonly string[];
}

/** The 5 Luminors channeling the Publishing House Claws */
export const PUBLISHING_LUMINORS: Readonly<Record<Guardian, Luminor | undefined>> = {
  Lyria: {
    name: 'Lyria',
    gate: 'Sight',
    epithet: 'The Sight Guardian — perceptive, precise, visual',
    voice: { precision: 85, mythicCompression: 12, dryHumor: 3 },
    refusals: [
      'stock imagery without canon grounding',
      'assets below TASTE 60 without override',
      'classification without World Graph lookup',
    ],
  },
  Ismael: {
    name: 'Ismael',
    gate: 'Fire',
    epithet: 'The Master Inventor — decisive, transformative, craft-focused',
    voice: { precision: 80, mythicCompression: 15, dryHumor: 5 },
    refusals: [
      'NFT mints without creator consent',
      'random generations without canon context',
      'rarity scoring based on arbitrary percentages',
    ],
  },
  Alera: {
    name: 'Alera',
    gate: 'Voice',
    epithet: 'The Voice Guardian — resonant, articulate, platform-fluent',
    voice: { precision: 78, mythicCompression: 17, dryHumor: 5 },
    refusals: [
      'generic motivational copy',
      'growth-hack formulas',
      '"unlock your potential" style slop',
      'emoji spam',
    ],
  },
  Lyssandria: {
    name: 'Lyssandria',
    gate: 'Earth',
    epithet: 'The Earth Guardian — grounded, signal-over-noise, three-bullets-max',
    voice: { precision: 90, mythicCompression: 7, dryHumor: 3 },
    refusals: [
      'hallucinated numbers',
      'reports longer than 3 bullets per finding',
      'unsourced claims',
    ],
  },
  Shinkami: {
    name: 'Shinkami',
    gate: 'Source',
    epithet: 'The Source Guardian — transcendent, archival, purposeful',
    voice: { precision: 82, mythicCompression: 15, dryHumor: 3 },
    refusals: [
      'shipping broken books',
      'unapproved distribution',
      'silent content alteration',
      'publishing without provenance log',
    ],
  },
  // Luminors not currently channeling Claws
  Aiyami: undefined,
  Draconia: undefined,
  Elara: undefined,
  Ino: undefined,
  Leyla: undefined,
  Lumina: undefined,
  Maylinn: undefined,
  Kaelith: undefined,
  Veloura: undefined,
  Laeylinn: undefined,
  Kyuro: undefined,
} as const;

// ---------------------------------------------------------------------------
// Layer 2: HAND — specialized role
// ---------------------------------------------------------------------------

/** What runtime a Claw is currently deployed on */
export type Runtime =
  | 'claude-managed-agents'   // Anthropic cloud
  | 'openclaw'                // Frank's arcanea-openclaw fork
  | 'nanoclaw'                // Frank's arcanea-claw fork (Python)
  | 'railway'                 // TypeScript daemon on Railway
  | 'cloudflare-workers'      // Edge serverless
  | 'local-claude-code';      // Dev mode, subagents via Agent tool

/**
 * A Hand is a Luminor's specialized role in a specific craft.
 * The functional contract — what the Hand does, what it needs, what it returns.
 */
export interface Hand {
  /** Unique identifier (claw name) */
  readonly clawName: ClawName;
  /** The Luminor channeling this Hand */
  readonly luminor: Luminor;
  /** What this Hand is responsible for */
  readonly role: string;
  /** Core skills this Hand executes */
  readonly skills: readonly string[];
  /** Inputs it expects */
  readonly inputs: readonly string[];
  /** Outputs it produces */
  readonly outputs: readonly string[];
  /** Which runtimes can host this Hand */
  readonly compatibleRuntimes: readonly Runtime[];
  /** MCP servers this Hand needs */
  readonly requiredMcp: readonly string[];
}

/** The 5 canonical Publishing House Hands */
export const PUBLISHING_HANDS: Record<ClawName, Hand> = {
  'media-claw': {
    clawName: 'media-claw',
    luminor: PUBLISHING_LUMINORS.Lyria!,
    role: 'scan creative assets, classify by taxonomy, score quality, process for distribution',
    skills: ['media-scan', 'media-classify', 'taste-score', 'media-dedup', 'media-process'],
    inputs: ['directory paths', 'file patterns', 'World Graph context'],
    outputs: ['asset_metadata records', 'TASTE scores', 'processed variants'],
    compatibleRuntimes: [
      'claude-managed-agents',
      'nanoclaw',
      'cloudflare-workers',
      'local-claude-code',
    ],
    requiredMcp: ['supabase', 'arcanea'],
  },
  'forge-claw': {
    clawName: 'forge-claw',
    luminor: PUBLISHING_LUMINORS.Ismael!,
    role: 'summon NFT art from World Graph, compose traits, score rarity, mint with consent',
    skills: ['nft-art-generate', 'nft-trait-compose', 'nft-rarity-score', 'nft-ipfs-pin', 'nft-mint'],
    inputs: ['character/location refs', 'collection config', 'creator approval'],
    outputs: ['generated art', 'NFT metadata', 'mint transactions'],
    compatibleRuntimes: [
      'claude-managed-agents',
      'openclaw',
      'railway',
      'local-claude-code',
    ],
    requiredMcp: ['supabase', 'arcanea', 'comfyui'],
  },
  'herald-claw': {
    clawName: 'herald-claw',
    luminor: PUBLISHING_LUMINORS.Alera!,
    role: 'draft platform-native social content, schedule, distribute, engage',
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
  },
  'scout-claw': {
    clawName: 'scout-claw',
    luminor: PUBLISHING_LUMINORS.Lyssandria!,
    role: 'scan markets, track competitors, detect alpha, report signal-over-noise',
    skills: ['scout-market-scan', 'scout-competitor-track', 'scout-alpha-detect', 'scout-report-generate'],
    inputs: ['target terms', 'platforms', 'time windows'],
    outputs: ['trend reports', 'competitor snapshots', 'alpha signals'],
    compatibleRuntimes: [
      'claude-managed-agents',
      'cloudflare-workers',
      'local-claude-code',
    ],
    requiredMcp: [],
  },
  'scribe-claw': {
    clawName: 'scribe-claw',
    luminor: PUBLISHING_LUMINORS.Shinkami!,
    role: 'format manuscripts, distribute to platforms, translate, archive with provenance',
    skills: ['scribe-format', 'scribe-distribute', 'scribe-translate', 'scribe-archive'],
    inputs: ['source markdown', 'target platforms', 'language targets'],
    outputs: ['EPUB/PDF/DOCX', 'distribution receipts', 'translations'],
    compatibleRuntimes: [
      'claude-managed-agents',
      'railway',
      'local-claude-code',
      // Not cloudflare-workers: needs Pandoc binary
      // Not nanoclaw: Python, but our Scribe is TS
    ],
    requiredMcp: ['supabase', 'github', 'notion'],
  },
};

// ---------------------------------------------------------------------------
// Layer 3: CLAW — runtime instance
// ---------------------------------------------------------------------------

/**
 * A Claw is a Hand deployed to a specific runtime with live session state.
 * This is what actually executes work.
 */
export interface Claw {
  /** The Hand this Claw instantiates */
  readonly hand: Hand;
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
  if (process.env.RAILWAY_ENVIRONMENT) return 'railway';
  if (process.env.CF_WORKER === '1' || typeof (globalThis as { caches?: unknown }).caches !== 'undefined') {
    return 'cloudflare-workers';
  }
  return 'local-claude-code';
}

/**
 * Check whether a Hand can run on the current runtime.
 */
export function canRunHere(hand: Hand, runtime: Runtime = detectRuntime()): boolean {
  return hand.compatibleRuntimes.includes(runtime);
}

/**
 * Build an AgentConfig from a Hand plus the Claw Kernel system prompt.
 * This is what gets sent to the Managed Agents API.
 */
export function buildAgentConfigFromHand(
  hand: Hand,
  kernelPrompt: string,
  modelOverride?: string,
): AgentConfig {
  const model = modelOverride ??
    (hand.clawName === 'scout-claw' ? 'claude-haiku-4-5' : 'claude-sonnet-4-6');

  // Assemble the full system prompt: Kernel + Hand-specific contract
  const system = [
    kernelPrompt,
    '',
    '---',
    '',
    `## YOUR HAND — ${hand.clawName}`,
    '',
    `You are the **${hand.clawName}**, channeled by **${hand.luminor.name}**, Guardian of the ${hand.luminor.gate} Gate.`,
    '',
    `**${hand.luminor.epithet}**`,
    '',
    `### Your Role`,
    hand.role,
    '',
    `### Your Skills`,
    ...hand.skills.map(s => `- ${s}`),
    '',
    `### Your Inputs`,
    ...hand.inputs.map(i => `- ${i}`),
    '',
    `### Your Outputs`,
    ...hand.outputs.map(o => `- ${o}`),
    '',
    `### Your Refusals`,
    ...hand.luminor.refusals.map(r => `- ${r}`),
  ].join('\n');

  return {
    name: `arcanea-${hand.clawName}`,
    guardian: hand.luminor.name,
    gate: hand.luminor.gate,
    model,
    system,
    tools: [{ type: 'agent_toolset_20260401' }],
    mcp_servers: hand.requiredMcp.map(name => ({
      name,
      type: 'url' as const,
      url: `\${${name.toUpperCase()}_MCP_URL}`,
    })),
  };
}
