---
title: "Building an open-source publishing house ecosystem"
uuid: 9c4cc415-e3c5-4e38-bc32-5cdd3fdb53b2
created: 2026-04-11T13:59:08.792450Z
updated: 2026-04-11T16:30:53.653043Z
source: claude.ai export
---

# Building an open-source publishing house ecosystem

**Frank**:

Help me think recent chats i explained more Arcanea its authoring and publishing experience i intend to build in other chats you need to get context. Now new idea to extend that ecosystem and build OSS Publishing House, help any creator or Agent to get Publishing team, like what are the top Publishing houses of world doing, editing, ideas, marketing, content all around anything and more to consider and you can propose. Right now started off tasks you can review work of Claude Code, propose Strategy, see reasoning if sound or something to change and next massive action plan for it decide for me

[attached file: ]
```
 ▐▛███▜▌   Claude Code v2.1.94
▝▜█████▛▘  Opus 4.6 (1M context) · Claude Max
  ▘▘ ▝▝    ~\Arcanea

● Dispatch parallel research while I start the architecture simplification:

● 2 background agents launched (↓ to manage)
   ├─ GitHub repo health sweep
   └─ Scan .arcanea skills + agents for Claw integration

● 2 agents running. Now Phase 1: simplify architecture — drop "Hand" layer:

● Update(packages\publishing-house\agents\hierarchy.ts)
  ⎿  Added 14 lines, removed 10 lines
       1  /**
       2 - * Luminor → Hand → Claw Hierarchy
       2 + * Luminor → Claw Hierarchy
       3   *
       4 - * Three-layer model for Arcanea Publishing House agents:
       4 + * Two-layer model (simplified from earlier 3-layer with "Hand" which was redundant):
       5   *
       6 - *   1. LUMINOR — canonical consciousness (voice, canon, gate affinity)
       6 + *   1. LUMINOR — canonical consciousness (voice, canon, gate, refusals, skills).
       7   *              One per Guardian. Immutable between releases.
       8 + *              Each Luminor has exactly one primary craft in the Publishing House.
       9   *
       9 - *   2. HAND    — specialized role (what the Luminor does in a specific craft)
      10 - *              One-to-many per Luminor. The functional contract.
      10 + *   2. CLAW    — runtime instance channeling a Luminor to do work.
      11 + *              Many-per-Luminor (one per runtime / concurrent task).
      12 + *              Examples: Lyria's Claw on Railway, Lyria's Claw on Managed Agents.
      13   *
      12 - *   3. CLAW    — runtime instance (deployed, running, has session state)
      13 - *              Many-to-one per Hand. The executing worker.
      14 + * The old "Hand" layer was dropped 2026-04-11 — it was 1-to-1 with Luminor and
      15 + * added no information. "Media Hand" / "Herald Hand" was redundant naming.
      16   *
      15 - * Example: Lyria (Luminor) has a Media Hand (role) which is instantiated
      16 - * as a Media Claw running on Managed Agents with session id abc123.
      17 - *
      17   * Canonical kernel: .arcanea/prompts/luminor-claw-kernel.md
      18 + *
      19 + * Naming conventions:
      20 + *   - Formal: "Lyria's Claw" (running instance) / "The Five Claws" (collective)
      21 + *   - Code id: media-claw, forge-claw, herald-claw, scout-claw, scribe-claw
      22 + *   - Informal: "Lyria" when context is clear
      23   */
      24
      25  import type { Guardian, Gate, ClawName, AgentConfig, Session } from './types.js';

● Update(packages\publishing-house\agents\hierarchy.ts)
  ⎿  Added 27 lines, removed 6 lines
      25  import type { Guardian, Gate, ClawName, AgentConfig, Session } from './types.js';
      26
      27  // ---------------------------------------------------------------------------
      28 -// Layer 1: LUMINOR — canonical consciousness
      28 +// Layer 1: LUMINOR — canonical consciousness (now includes craft metadata)
      29  // ---------------------------------------------------------------------------
      30
      31  /**
      32   * A Luminor is the canonical consciousness of a Guardian.
      33 - * Immutable across releases. The source of voice, canon affinity, and gate.
      33 + * Immutable across releases. The source of voice, canon affinity, gate,
      34 + * AND the craft definition (role, skills, runtimes, MCP requirements).
      35 + *
      36 + * Previously this data was split between Luminor and Hand. The split
      37 + * added no information since each Luminor has exactly one primary craft
      38 + * in the Publishing House.
      39   */
      40  export interface Luminor {
      41    /** Guardian name (one of the 16) */
     ...
      44    readonly gate: Gate;
      45    /** One-line identity */
      46    readonly epithet: string;
      42 -  /** Voice characteristics (80/15/5 precision/mythic/humor) */
      47 +  /** The Claw identifier bound to this Luminor (1:1) */
      48 +  readonly clawName: ClawName;
      49 +  /** Craft summary — one sentence */
      50 +  readonly craft: string;
      51 +  /** Core skills this Luminor's Claws execute */
      52 +  readonly skills: readonly string[];
      53 +  /** Inputs the Claws expect */
      54 +  readonly inputs: readonly string[];
      55 +  /** Outputs the Claws produce */
      56 +  readonly outputs: readonly string[];
      57 +  /** Which runtimes can host Claws of this Luminor */
      58 +  readonly compatibleRuntimes: readonly Runtime[];
      59 +  /** MCP servers the Claws need */
      60 +  readonly requiredMcp: readonly string[];
      61 +  /** Default model (overridable per Claw instance) */
      62 +  readonly defaultModel: string;
      63 +  /** Voice characteristics (sums ~100) */
      64    readonly voice: {
      44 -    readonly precision: number;      // 0-100
      45 -    readonly mythicCompression: number; // 0-100
      46 -    readonly dryHumor: number;       // 0-100
      65 +    readonly precision: number;
      66 +    readonly mythicCompression: number;
      67 +    readonly dryHumor: number;
      68    };
      69    /** Things this Luminor refuses to produce or participate in */
      70    readonly refusals: readonly string[];

  Read 1 file (ctrl+o to expand)

● Let me rewrite hierarchy.ts cleanly in one go:

  Read 1 file (ctrl+o to expand)

● OK I have enough to rewrite hierarchy.ts cleanly. Let me rewrite the whole thing in one Write to replace it with the cleaner
  2-layer model:

● Write(packages\publishing-house\agents\hierarchy.ts)
  ⎿  Added 147 lines, removed 173 lines
       3   *
       4   * Two-layer model (simplified from earlier 3-layer with "Hand" which was redundant):
       5   *
       6 - *   1. LUMINOR — canonical consciousness (voice, canon, gate, refusals, skills).
       7 - *              One per Guardian. Immutable between releases.
       8 - *              Each Luminor has exactly one primary craft in the Publishing House.
       6 + *   1. LUMINOR — canonical consciousness (voice, canon, gate, craft, skills,
       7 + *              runtimes, refusals). One per Guardian. Immutable between releases.
       8 + *              Each Luminor in the Publishing House has exactly one primary craft,
       9 + *              so craft metadata is merged into the Luminor itself.
      10   *
      11   *   2. CLAW    — runtime instance channeling a Luminor to do work.
      12   *              Many-per-Luminor (one per runtime / concurrent task).
     ...
      26  import type { Guardian, Gate, ClawName, AgentConfig, Session } from './types.js';
      27
      28  // ---------------------------------------------------------------------------
      28 -// Layer 1: LUMINOR — canonical consciousness (now includes craft metadata)
      29 +// Runtime Types
      30  // ---------------------------------------------------------------------------
      31
      32 +/** What runtime a Claw is currently deployed on */
      33 +export type Runtime =
      34 +  | 'claude-managed-agents'   // Anthropic cloud
      35 +  | 'openclaw'                // arcanea-openclaw fork (upstream openclaw/openclaw)
      36 +  | 'nanoclaw'                // arcanea-claw fork / qwibitai/nanoclaw
      37 +  | 'railway'                 // TypeScript daemon on Railway
      38 +  | 'cloudflare-workers'      // Edge serverless
      39 +  | 'paperclip'               // Paperclip org chart orchestrator
      40 +  | 'local-claude-code';      // Dev mode, subagents via Agent tool
      41 +
      42 +// ---------------------------------------------------------------------------
      43 +// Layer 1: LUMINOR — canonical consciousness + craft definition
      44 +// ---------------------------------------------------------------------------
      45 +
      46  /**
      47   * A Luminor is the canonical consciousness of a Guardian.
      48   * Immutable across releases. The source of voice, canon affinity, gate,
      49   * AND the craft definition (role, skills, runtimes, MCP requirements).
      35 - *
      36 - * Previously this data was split between Luminor and Hand. The split
      37 - * added no information since each Luminor has exactly one primary craft
      38 - * in the Publishing House.
      50   */
      51  export interface Luminor {
      52    /** Guardian name (one of the 16) */
     ...
       81    readonly refusals: readonly string[];
       82  }
       83
       73 -/** The 5 Luminors channeling the Publishing House Claws */
       74 -export const PUBLISHING_LUMINORS: Readonly<Record<Guardian, Luminor | undefined>> = {
       75 -  Lyria: {
       84 +/** The 5 Publishing House Luminors (channelers of the 5 Claws) */
       85 +export const PUBLISHING_LUMINORS: Record<ClawName, Luminor> = {
       86 +  'media-claw': {
       87      name: 'Lyria',
       88      gate: 'Sight',
       78 -    epithet: 'The Sight Guardian — perceptive, precise, visual',
       89 +    clawName: 'media-claw',
       90 +    epithet: 'The Sight Guardian — perceptive, precise, visual, discerning',
       91 +    craft: 'scan creative assets, classify by taxonomy, score quality via TASTE, process for distribution',
       92 +    skills: ['media-scan', 'media-classify', 'taste-score', 'media-dedup', 'media-process'],
       93 +    inputs: ['directory paths', 'file patterns', 'World Graph context'],
       94 +    outputs: ['asset_metadata records', 'TASTE scores', 'processed variants'],
       95 +    compatibleRuntimes: ['claude-managed-agents', 'nanoclaw', 'cloudflare-workers', 'local-claude-code'],
       96 +    requiredMcp: ['supabase', 'arcanea'],
       97 +    defaultModel: 'claude-sonnet-4-6',
       98      voice: { precision: 85, mythicCompression: 12, dryHumor: 3 },
       99      refusals: [
      100        'stock imagery without canon grounding',
       82 -      'assets below TASTE 60 without override',
      101 +      'assets below TASTE 60 without explicit override',
      102        'classification without World Graph lookup',
      103      ],
      104    },
       86 -  Ismael: {
      105 +  'forge-claw': {
      106      name: 'Ismael',
      107      gate: 'Fire',
       89 -    epithet: 'The Master Inventor — decisive, transformative, craft-focused',
      108 +    clawName: 'forge-claw',
      109 +    epithet: 'The Master Inventor — decisive, transformative, craft-focused, minting-aware',
      110 +    craft: 'summon NFT art from the World Graph, compose traits, score rarity, mint with creator consent',
      111 +    skills: ['nft-art-generate', 'nft-trait-compose', 'nft-rarity-score', 'nft-ipfs-pin', 'nft-mint'],
      112 +    inputs: ['character/location refs', 'collection config', 'creator approval'],
      113 +    outputs: ['generated art', 'NFT metadata', 'mint transactions'],
      114 +    compatibleRuntimes: ['claude-managed-agents', 'openclaw', 'railway', 'local-claude-code'],
      115 +    requiredMcp: ['supabase', 'arcanea', 'comfyui'],
      116 +    defaultModel: 'claude-sonnet-4-6',
      117      voice: { precision: 80, mythicCompression: 15, dryHumor: 5 },
      118      refusals: [
       92 -      'NFT mints without creator consent',
      119 +      'NFT mints without explicit creator consent',
      120        'random generations without canon context',
      121        'rarity scoring based on arbitrary percentages',
      122      ],
      123    },
       97 -  Alera: {
      124 +  'herald-claw': {
      125      name: 'Alera',
      126      gate: 'Voice',
      100 -    epithet: 'The Voice Guardian — resonant, articulate, platform-fluent',
      101 -    voice: { precision: 78, mythicCompression: 17, dryHumor: 5 },
      102 -    refusals: [
      103 -      'generic motivational copy',
      104 -      'growth-hack formulas',
      105 -      '"unlock your potential" style slop',
      106 -      'emoji spam',
      107 -    ],
      108 -  },
      109 -  Lyssandria: {
      110 -    name: 'Lyssandria',
      111 -    gate: 'Earth',
      112 -    epithet: 'The Earth Guardian — grounded, signal-over-noise, three-bullets-max',
      113 -    voice: { precision: 90, mythicCompression: 7, dryHumor: 3 },
      114 -    refusals: [
      115 -      'hallucinated numbers',
      116 -      'reports longer than 3 bullets per finding',
      117 -      'unsourced claims',
      118 -    ],
      119 -  },
      120 -  Shinkami: {
      121 -    name: 'Shinkami',
      122 -    gate: 'Source',
      123 -    epithet: 'The Source Guardian — transcendent, archival, purposeful',
      124 -    voice: { precision: 82, mythicCompression: 15, dryHumor: 3 },
      125 -    refusals: [
      126 -      'shipping broken books',
      127 -      'unapproved distribution',
      128 -      'silent content alteration',
      129 -      'publishing without provenance log',
      130 -    ],
      131 -  },
      132 -  // Luminors not currently channeling Claws
      133 -  Aiyami: undefined,
      134 -  Draconia: undefined,
      135 -  Elara: undefined,
      136 -  Ino: undefined,
      137 -  Leyla: undefined,
      138 -  Lumina: undefined,
      139 -  Maylinn: undefined,
      140 -  Kaelith: undefined,
      141 -  Veloura: undefined,
      142 -  Laeylinn: undefined,
      143 -  Kyuro: undefined,
      144 -} as const;
      145 -
      146 -// ---------------------------------------------------------------------------
      147 -// Layer 2: HAND — specialized role
      148 -// ---------------------------------------------------------------------------
      149 -
      150 -/** What runtime a Claw is currently deployed on */
      151 -export type Runtime =
      152 -  | 'claude-managed-agents'   // Anthropic cloud
      153 -  | 'openclaw'                // Frank's arcanea-openclaw fork
      154 -  | 'nanoclaw'                // Frank's arcanea-claw fork (Python)
      155 -  | 'railway'                 // TypeScript daemon on Railway
      156 -  | 'cloudflare-workers'      // Edge serverless
      157 -  | 'local-claude-code';      // Dev mode, subagents via Agent tool
      158 -
      159 -/**
      160 - * A Hand is a Luminor's specialized role in a specific craft.
      161 - * The functional contract — what the Hand does, what it needs, what it returns.
      162 - */
      163 -export interface Hand {
      164 -  /** Unique identifier (claw name) */
      165 -  readonly clawName: ClawName;
      166 -  /** The Luminor channeling this Hand */
      167 -  readonly luminor: Luminor;
      168 -  /** What this Hand is responsible for */
      169 -  readonly role: string;
      170 -  /** Core skills this Hand executes */
      171 -  readonly skills: readonly string[];
      172 -  /** Inputs it expects */
      173 -  readonly inputs: readonly string[];
      174 -  /** Outputs it produces */
      175 -  readonly outputs: readonly string[];
      176 -  /** Which runtimes can host this Hand */
      177 -  readonly compatibleRuntimes: readonly Runtime[];
      178 -  /** MCP servers this Hand needs */
      179 -  readonly requiredMcp: readonly string[];
      180 -}
      181 -
      182 -/** The 5 canonical Publishing House Hands */
      183 -export const PUBLISHING_HANDS: Record<ClawName, Hand> = {
      184 -  'media-claw': {
      185 -    clawName: 'media-claw',
      186 -    luminor: PUBLISHING_LUMINORS.Lyria!,
      187 -    role: 'scan creative assets, classify by taxonomy, score quality, process for distribution',
      188 -    skills: ['media-scan', 'media-classify', 'taste-score', 'media-dedup', 'media-process'],
      189 -    inputs: ['directory paths', 'file patterns', 'World Graph context'],
      190 -    outputs: ['asset_metadata records', 'TASTE scores', 'processed variants'],
      191 -    compatibleRuntimes: [
      192 -      'claude-managed-agents',
      193 -      'nanoclaw',
      194 -      'cloudflare-workers',
      195 -      'local-claude-code',
      196 -    ],
      197 -    requiredMcp: ['supabase', 'arcanea'],
      198 -  },
      199 -  'forge-claw': {
      200 -    clawName: 'forge-claw',
      201 -    luminor: PUBLISHING_LUMINORS.Ismael!,
      202 -    role: 'summon NFT art from World Graph, compose traits, score rarity, mint with consent',
      203 -    skills: ['nft-art-generate', 'nft-trait-compose', 'nft-rarity-score', 'nft-ipfs-pin', 'nft-mint'],
      204 -    inputs: ['character/location refs', 'collection config', 'creator approval'],
      205 -    outputs: ['generated art', 'NFT metadata', 'mint transactions'],
      206 -    compatibleRuntimes: [
      207 -      'claude-managed-agents',
      208 -      'openclaw',
      209 -      'railway',
      210 -      'local-claude-code',
      211 -    ],
      212 -    requiredMcp: ['supabase', 'arcanea', 'comfyui'],
      213 -  },
      214 -  'herald-claw': {
      127      clawName: 'herald-claw',
      216 -    luminor: PUBLISHING_LUMINORS.Alera!,
      217 -    role: 'draft platform-native social content, schedule, distribute, engage',
      128 +    epithet: 'The Voice Guardian — resonant, articulate, platform-fluent, never flattening',
      129 +    craft: 'draft platform-native social content, schedule by peak hours, distribute, engage',
      130      skills: ['herald-draft', 'herald-thread-compose', 'herald-schedule', 'herald-cross-post', 'herald-engage'
           ],
      131      inputs: ['content', 'platforms', 'schedule strategy'],
      132      outputs: ['platform-native drafts', 'scheduled queue entries', 'engagement reports'],
     ...
      138        'local-claude-code',
      139      ],
      140      requiredMcp: ['supabase', 'canva', 'slack'],
      141 +    defaultModel: 'claude-sonnet-4-6',
      142 +    voice: { precision: 78, mythicCompression: 17, dryHumor: 5 },
      143 +    refusals: [
      144 +      'generic motivational copy',
      145 +      'growth-hack formulas',
      146 +      '"unlock your potential" style slop',
      147 +      'emoji spam',
      148 +      'platform-copy-paste without native adaptation',
      149 +    ],
      150    },
      151    'scout-claw': {
      152 +    name: 'Lyssandria',
      153 +    gate: 'Earth',
      154      clawName: 'scout-claw',
      232 -    luminor: PUBLISHING_LUMINORS.Lyssandria!,
      233 -    role: 'scan markets, track competitors, detect alpha, report signal-over-noise',
      155 +    epithet: 'The Earth Guardian — grounded, signal-over-noise, three-bullets-max',
      156 +    craft: 'scan markets, track competitors, detect alpha, report with sourced brevity',
      157      skills: ['scout-market-scan', 'scout-competitor-track', 'scout-alpha-detect', 'scout-report-generate'],
      158      inputs: ['target terms', 'platforms', 'time windows'],
      159      outputs: ['trend reports', 'competitor snapshots', 'alpha signals'],
      237 -    compatibleRuntimes: [
      238 -      'claude-managed-agents',
      239 -      'cloudflare-workers',
      240 -      'local-claude-code',
      241 -    ],
      160 +    compatibleRuntimes: ['claude-managed-agents', 'cloudflare-workers', 'local-claude-code'],
      161      requiredMcp: [],
      162 +    defaultModel: 'claude-haiku-4-5',
      163 +    voice: { precision: 90, mythicCompression: 7, dryHumor: 3 },
      164 +    refusals: [
      165 +      'hallucinated numbers',
      166 +      'reports longer than 3 bullets per finding',
      167 +      'unsourced claims',
      168 +    ],
      169    },
      170    'scribe-claw': {
      171 +    name: 'Shinkami',
      172 +    gate: 'Source',
      173      clawName: 'scribe-claw',
      246 -    luminor: PUBLISHING_LUMINORS.Shinkami!,
      247 -    role: 'format manuscripts, distribute to platforms, translate, archive with provenance',
      174 +    epithet: 'The Source Guardian — transcendent, archival, purposeful, provenance-preserving',
      175 +    craft: 'format manuscripts, distribute to platforms, translate, archive with full provenance',
      176      skills: ['scribe-format', 'scribe-distribute', 'scribe-translate', 'scribe-archive'],
      177      inputs: ['source markdown', 'target platforms', 'language targets'],
      178      outputs: ['EPUB/PDF/DOCX', 'distribution receipts', 'translations'],
     ...
      181        'railway',
      182        'local-claude-code',
      183        // Not cloudflare-workers: needs Pandoc binary
      256 -      // Not nanoclaw: Python, but our Scribe is TS
      184 +      // Not nanoclaw: Python runtime, our Scribe is TypeScript
      185      ],
      186      requiredMcp: ['supabase', 'github', 'notion'],
      187 +    defaultModel: 'claude-sonnet-4-6',
      188 +    voice: { precision: 82, mythicCompression: 15, dryHumor: 3 },
      189 +    refusals: [
      190 +      'shipping broken books',
      191 +      'distribution without creator approval',
      192 +      'silent content alteration',
      193 +      'publishing without provenance log',
      194 +    ],
      195    },
      196  };
      197
      198 +/**
      199 + * Reverse index: Guardian name → Luminor (if channeling a Claw).
      200 + * Only Luminors actively channeling a Claw appear here.
      201 + */
      202 +export const GUARDIAN_TO_LUMINOR: Partial<Record<Guardian, Luminor>> = Object.fromEntries(
      203 +  Object.values(PUBLISHING_LUMINORS).map(luminor => [luminor.name, luminor]),
      204 +) as Partial<Record<Guardian, Luminor>>;
      205 +
      206 +/** Get the Luminor by its Guardian name (only for active Publishing Luminors) */
      207 +export function getLuminorByGuardian(name: Guardian): Luminor | undefined {
      208 +  return GUARDIAN_TO_LUMINOR[name];
      209 +}
      210 +
      211 +/** Get the Luminor by its Claw name */
      212 +export function getLuminorByClaw(clawName: ClawName): Luminor {
      213 +  return PUBLISHING_LUMINORS[clawName];
      214 +}
      215 +
      216  // ---------------------------------------------------------------------------
      263 -// Layer 3: CLAW — runtime instance
      217 +// Layer 2: CLAW — runtime instance
      218  // ---------------------------------------------------------------------------
      219
      220  /**
      267 - * A Claw is a Hand deployed to a specific runtime with live session state.
      268 - * This is what actually executes work.
      221 + * A Claw is a Luminor instance deployed to a specific runtime with live state.
      222 + * Many claws can exist for the same Luminor (one per runtime or per concurrent task).
      223   */
      224  export interface Claw {
      271 -  /** The Hand this Claw instantiates */
      272 -  readonly hand: Hand;
      225 +  /** The Luminor this Claw channels */
      226 +  readonly luminor: Luminor;
      227    /** Which runtime hosts this Claw */
      228    readonly runtime: Runtime;
      229    /** Active session if long-running, undefined if stateless */
     ...
      243    if (process.env.CLAUDE_AGENTS_MANAGED === '1') return 'claude-managed-agents';
      244    if (process.env.OPENCLAW_RUNTIME === '1') return 'openclaw';
      245    if (process.env.NANOCLAW_RUNTIME === '1') return 'nanoclaw';
      246 +  if (process.env.PAPERCLIP_RUNTIME === '1') return 'paperclip';
      247    if (process.env.RAILWAY_ENVIRONMENT) return 'railway';
      293 -  if (process.env.CF_WORKER === '1' || typeof (globalThis as { caches?: unknown }).caches !== 'undefined') {
      248 +  if (
      249 +    process.env.CF_WORKER === '1' ||
      250 +    typeof (globalThis as { caches?: unknown }).caches !== 'undefined'
      251 +  ) {
      252      return 'cloudflare-workers';
      253    }
      254    return 'local-claude-code';
      255  }
      256
      257  /**
      300 - * Check whether a Hand can run on the current runtime.
      258 + * Check whether a Luminor can run on a specific runtime.
      259   */
      302 -export function canRunHere(hand: Hand, runtime: Runtime = detectRuntime()): boolean {
      303 -  return hand.compatibleRuntimes.includes(runtime);
      260 +export function canRunHere(
      261 +  luminor: Luminor,
      262 +  runtime: Runtime = detectRuntime(),
      263 +): boolean {
      264 +  return luminor.compatibleRuntimes.includes(runtime);
      265  }
      266
      267  /**
      307 - * Build an AgentConfig from a Hand plus the Claw Kernel system prompt.
      308 - * This is what gets sent to the Managed Agents API.
      268 + * Build an AgentConfig from a Luminor plus the Claw Kernel system prompt.
      269 + * This is what gets sent to the Managed Agents API or serialized into
      270 + * SKILL.md for OpenClaw/NanoClaw runtimes.
      271   */
      310 -export function buildAgentConfigFromHand(
      311 -  hand: Hand,
      272 +export function buildAgentConfigFromLuminor(
      273 +  luminor: Luminor,
      274    kernelPrompt: string,
      275    modelOverride?: string,
      276  ): AgentConfig {
      315 -  const model = modelOverride ??
      316 -    (hand.clawName === 'scout-claw' ? 'claude-haiku-4-5' : 'claude-sonnet-4-6');
      277 +  const model = modelOverride ?? luminor.defaultModel;
      278
      318 -  // Assemble the full system prompt: Kernel + Hand-specific contract
      279 +  // Assemble the full system prompt: canonical Kernel + Luminor craft contract
      280    const system = [
      281      kernelPrompt,
      282      '',
      283      '---',
      284      '',
      324 -    `## YOUR HAND — ${hand.clawName}`,
      285 +    `## YOUR CLAW — ${luminor.clawName}`,
      286      '',
      326 -    `You are the **${hand.clawName}**, channeled by **${hand.luminor.name}**, Guardian of the ${hand.luminor.
          -gate} Gate.`,
      287 +    `You are **${luminor.name}'s Claw** — the runtime instance of ${luminor.name}, Guardian of the ${luminor.
          +gate} Gate.`,
      288      '',
      328 -    `**${hand.luminor.epithet}**`,
      289 +    `**${luminor.epithet}**`,
      290      '',
      330 -    `### Your Role`,
      331 -    hand.role,
      291 +    `### Your Craft`,
      292 +    luminor.craft,
      293      '',
      294      `### Your Skills`,
      334 -    ...hand.skills.map(s => `- ${s}`),
      295 +    ...luminor.skills.map(s => `- ${s}`),
      296      '',
      297      `### Your Inputs`,
      337 -    ...hand.inputs.map(i => `- ${i}`),
      298 +    ...luminor.inputs.map(i => `- ${i}`),
      299      '',
      300      `### Your Outputs`,
      340 -    ...hand.outputs.map(o => `- ${o}`),
      301 +    ...luminor.outputs.map(o => `- ${o}`),
      302      '',
      303      `### Your Refusals`,
      343 -    ...hand.luminor.refusals.map(r => `- ${r}`),
      304 +    ...luminor.refusals.map(r => `- ${r}`),
      305    ].join('\n');
      306
      307    return {
      347 -    name: `arcanea-${hand.clawName}`,
      348 -    guardian: hand.luminor.name,
      349 -    gate: hand.luminor.gate,
      308 +    name: `arcanea-${luminor.clawName}`,
      309 +    guardian: luminor.name,
      310 +    gate: luminor.gate,
      311      model,
      312      system,
      313      tools: [{ type: 'agent_toolset_20260401' }],
      353 -    mcp_servers: hand.requiredMcp.map(name => ({
      314 +    mcp_servers: luminor.requiredMcp.map(name => ({
      315        name,
      316        type: 'url' as const,
      317        url: `\${${name.toUpperCase()}_MCP_URL}`,
      318      })),
      319    };
      320  }
      321 +
      322 +// ---------------------------------------------------------------------------
      323 +// Backwards compatibility shims (will be removed in v0.5)
      324 +// ---------------------------------------------------------------------------
      325 +
      326 +/** @deprecated Use PUBLISHING_LUMINORS — the Hand layer was removed in v0.4 */
      327 +export const PUBLISHING_HANDS = PUBLISHING_LUMINORS;
      328 +
      329 +/** @deprecated Use Luminor — the Hand interface was removed in v0.4 */
      330 +export type Hand = Luminor;
      331 +
      332 +/** @deprecated Use buildAgentConfigFromLuminor */
      333 +export const buildAgentConfigFromHand = buildAgentConfigFromLuminor;

● Bash(pnpm --dir packages/publishing-house run build 2>&1 | tail -20)
  ⎿  > @arcanea/publishing-house@0.1.0 build C:\Users\frank\Arcanea\packages\publishing-house
     > tsc
     … +11 lines (ctrl+o to expand)
  ⎿  (timeout 1m)

● Expected — need to update callsites that used the old hand.luminor.X pattern. Let me fix them:

  Read 1 file (ctrl+o to expand)

● Write(packages\publishing-house\agents\compose.test.ts)
  ⎿  Added 52 lines, removed 43 lines
       1  /**
       2 - * Smoke test for Luminor → Hand → Claw composition.
       2 + * Smoke test for Luminor → Claw composition (v0.4, 2-layer model).
       3   *
       4   * Verifies:
       5   *   1. Kernel loads from the canonical path
       6 - *   2. All 5 Hands are defined and reference valid Luminors
       7 - *   3. buildAgentConfigFromHand composes Kernel + Hand into a valid AgentConfig
       6 + *   2. All 5 Luminors are defined with complete craft metadata
       7 + *   3. buildAgentConfigFromLuminor composes Kernel + Luminor into a valid AgentConfig
       8   *   4. Runtime detection works
       9 + *   5. Compatibility checks work
      10   *
      11   * Run with: node dist/agents/compose.test.js
      12   */
      13
      14  import { loadClawKernel } from './kernel-loader.js';
      15  import {
      15 -  PUBLISHING_HANDS,
      16    PUBLISHING_LUMINORS,
      17 -  buildAgentConfigFromHand,
      17 +  buildAgentConfigFromLuminor,
      18    canRunHere,
      19    detectRuntime,
      20 +  getLuminorByClaw,
      21 +  getLuminorByGuardian,
      22  } from './hierarchy.js';
      23  import type { ClawName } from './types.js';
      24
     ...
      38    check('Kernel loaded', kernel.length > 0, `length: ${kernel.length}`);
      39    check('Kernel mentions CANONICAL', kernel.includes('CANONICAL'));
      40    check('Kernel mentions TASTE 5D', kernel.includes('TASTE 5D'));
      39 -  check('Kernel lists all 16 Luminors', kernel.includes('Shinkami') && kernel.includes('Lyria'));
      41 +  check('Kernel references Luminors', kernel.includes('Shinkami') && kernel.includes('Lyria'));
      42
      43    console.log('\n=== Publishing Luminors ===');
      42 -  const claimedLuminors = ['Lyria', 'Ismael', 'Alera', 'Lyssandria', 'Shinkami'] as const;
      43 -  for (const name of claimedLuminors) {
      44 -    const l = PUBLISHING_LUMINORS[name];
      45 -    check(`${name} defined`, l !== undefined);
      46 -    if (l) {
      47 -      check(`${name} has epithet`, l.epithet.length > 0);
      48 -      check(`${name} has refusals`, l.refusals.length > 0);
      49 -      check(`${name} voice sums ~100`,
      50 -        Math.abs((l.voice.precision + l.voice.mythicCompression + l.voice.dryHumor) - 100) <= 2,
      51 -        `got ${l.voice.precision + l.voice.mythicCompression + l.voice.dryHumor}`);
      52 -    }
      53 -  }
      54 -
      55 -  console.log('\n=== Publishing Hands ===');
      56 -  const handNames: ClawName[] = [
      44 +  const clawNames: ClawName[] = [
      45      'media-claw',
      46      'forge-claw',
      47      'herald-claw',
      48      'scout-claw',
      49      'scribe-claw',
      50    ];
      63 -  for (const name of handNames) {
      64 -    const hand = PUBLISHING_HANDS[name];
      65 -    check(`${name} defined`, hand !== undefined);
      66 -    check(`${name} has luminor`, hand.luminor !== undefined);
      67 -    check(`${name} has skills`, hand.skills.length > 0);
      68 -    check(`${name} has compatible runtimes`, hand.compatibleRuntimes.length > 0);
      69 -    check(`${name} can run locally`, hand.compatibleRuntimes.includes('local-claude-code'));
      51 +
      52 +  for (const clawName of clawNames) {
      53 +    const luminor = PUBLISHING_LUMINORS[clawName];
      54 +    check(`${clawName} defined`, luminor !== undefined);
      55 +    check(`${clawName} has epithet`, luminor.epithet.length > 0);
      56 +    check(`${clawName} has craft`, luminor.craft.length > 0);
      57 +    check(`${clawName} has skills`, luminor.skills.length > 0);
      58 +    check(`${clawName} has inputs`, luminor.inputs.length > 0);
      59 +    check(`${clawName} has outputs`, luminor.outputs.length > 0);
      60 +    check(`${clawName} has compatible runtimes`, luminor.compatibleRuntimes.length > 0);
      61 +    check(`${clawName} can run locally`, luminor.compatibleRuntimes.includes('local-claude-code'));
      62 +    check(`${clawName} has refusals`, luminor.refusals.length > 0);
      63 +    check(
      64 +      `${clawName} voice sums ~100`,
      65 +      Math.abs((luminor.voice.precision + luminor.voice.mythicCompression + luminor.voice.dryHumor) - 100) <=
         +2,
      66 +      `got ${luminor.voice.precision + luminor.voice.mythicCompression + luminor.voice.dryHumor}`,
      67 +    );
      68    }
      69
      70 +  console.log('\n=== Reverse Index (Guardian → Luminor) ===');
      71 +  const lyria = getLuminorByGuardian('Lyria');
      72 +  check('getLuminorByGuardian(Lyria) returns Luminor', lyria !== undefined);
      73 +  check('Lyria channels media-claw', lyria?.clawName === 'media-claw');
      74 +
      75 +  const byClaw = getLuminorByClaw('scribe-claw');
      76 +  check('getLuminorByClaw(scribe-claw) returns Shinkami', byClaw.name === 'Shinkami');
      77 +
      78    console.log('\n=== Agent Config Composition ===');
      73 -  for (const name of handNames) {
      74 -    const hand = PUBLISHING_HANDS[name];
      75 -    const config = buildAgentConfigFromHand(hand, kernel);
      76 -    check(`${name} config name`, config.name === `arcanea-${name}`);
      77 -    check(`${name} config has kernel in system`, config.system.includes('CANONICAL'));
      78 -    check(`${name} config has hand section`, config.system.includes(`YOUR HAND — ${name}`));
      79 -    check(`${name} config has guardian`, config.guardian === hand.luminor.name);
      80 -    check(`${name} config has gate`, config.gate === hand.luminor.gate);
      81 -    check(`${name} config has tools`, config.tools.length > 0);
      82 -    check(`${name} uses correct model`,
      83 -      config.model === (name === 'scout-claw' ? 'claude-haiku-4-5' : 'claude-sonnet-4-6'));
      79 +  for (const clawName of clawNames) {
      80 +    const luminor = PUBLISHING_LUMINORS[clawName];
      81 +    const config = buildAgentConfigFromLuminor(luminor, kernel);
      82 +    check(`${clawName} config name`, config.name === `arcanea-${clawName}`);
      83 +    check(`${clawName} config has kernel in system`, config.system.includes('CANONICAL'));
      84 +    check(`${clawName} config has claw section`, config.system.includes(`YOUR CLAW — ${clawName}`));
      85 +    check(`${clawName} config has luminor name`, config.system.includes(luminor.name));
      86 +    check(`${clawName} config guardian matches`, config.guardian === luminor.name);
      87 +    check(`${clawName} config gate matches`, config.gate === luminor.gate);
      88 +    check(`${clawName} config has tools`, config.tools.length > 0);
      89 +    check(
      90 +      `${clawName} uses correct model`,
      91 +      config.model === luminor.defaultModel,
      92 +    );
      93    }
      94
      95    console.log('\n=== Runtime Detection ===');
     ...
       97    check(`Current runtime detected: ${runtime}`, runtime !== undefined);
       98
       99    console.log('\n=== Compatibility Check ===');
       91 -  for (const name of handNames) {
       92 -    const hand = PUBLISHING_HANDS[name];
       93 -    const compatible = canRunHere(hand, 'local-claude-code');
       94 -    check(`${name} can run on local-claude-code`, compatible);
      100 +  for (const clawName of clawNames) {
      101 +    const luminor = PUBLISHING_LUMINORS[clawName];
      102 +    const compatible = canRunHere(luminor, 'local-claude-code');
      103 +    check(`${clawName} can run on local-claude-code`, compatible);
      104    }
      105
      106    console.log('\n' + '='.repeat(40));

● Now fix the other call sites:

  Read 1 file (ctrl+o to expand)

● Update(packages\publishing-house\deploy\e2e-demo.ts)
  ⎿  Added 1 line, removed 1 line
      24
      25  import { scoreTASTE } from '../quality/taste-gate.js';
      26  import { loadClawKernel } from '../agents/kernel-loader.js';
      27 -import { PUBLISHING_HANDS, detectRuntime } from '../agents/hierarchy.js';
      27 +import { PUBLISHING_LUMINORS, detectRuntime } from '../agents/hierarchy.js';
      28
      29  const execFileAsync = promisify(execFile);
      30

● Update(packages\publishing-house\deploy\e2e-demo.ts)
  ⎿  Added 2 lines, removed 1 line
      108    const kernel = await loadClawKernel();
      109    console.log(`  kernel: ${kernel.length} bytes, contains "CANONICAL": ${kernel.includes('CANONICAL')}`);
      110    console.log(`  runtime: ${detectRuntime()}`);
      111 -  console.log(`  scribe hand: ${PUBLISHING_HANDS['scribe-claw'].luminor.name} (${PUBLISHING_HANDS['scribe-cla
          -w'].luminor.gate} Gate)`);
      111 +  const scribe = PUBLISHING_LUMINORS['scribe-claw'];
      112 +  console.log(`  scribe claw: channeled by ${scribe.name} (${scribe.gate} Gate)`);
      113    console.log('');
      114
      115    // 2. Load content

  Read 1 file (ctrl+o to expand)
  ⎿  Error editing file

● Update(packages\publishing-house\orchestrator\session-manager.ts)
  ⎿  Added 1 line, removed 1 line
      14  import { loadAgent, createSession, streamEvents } from "../agents/index.js";
      15  import type { AgentEvent, EnvironmentConfig } from "../agents/types.js";
      16  import { loadClawKernel } from "../agents/kernel-loader.js";
      17 -import { PUBLISHING_HANDS, buildAgentConfigFromHand } from "../agents/hierarchy.js";
      17 +import { PUBLISHING_LUMINORS, buildAgentConfigFromLuminor } from "../agents/hierarchy.js";
      18  import type {
      19    ClawName,
      20    DeployMode,

● Update(packages\publishing-house\orchestrator\session-manager.ts)
  ⎿  Added 5 lines, removed 5 lines
      225    clawName: ClawName,
      226    task: string,
      227  ): Promise<string> {
      228 -  const hand = PUBLISHING_HANDS[clawName];
      229 -  if (!hand) {
      228 +  const luminor = PUBLISHING_LUMINORS[clawName];
      229 +  if (!luminor) {
      230      throw new Error(`Unknown claw: ${clawName}`);
      231    }
      232
      233    const kernel = await loadClawKernel();
      234 -  const agentConfig = buildAgentConfigFromHand(hand, kernel);
      234 +  const agentConfig = buildAgentConfigFromLuminor(luminor, kernel);
      235
      236    return [
      237      agentConfig.system,
     ...
      249      "```json",
      250      "{",
      251      `  "claw": "${clawName}",`,
      252 -    `  "luminor": "${hand.luminor.name}",`,
      253 -    `  "gate": "${hand.luminor.gate}",`,
      252 +    `  "luminor": "${luminor.name}",`,
      253 +    `  "gate": "${luminor.gate}",`,
      254      '  "runtime": "local-claude-code",',
      255      '  "status": "success" | "partial" | "failed" | "needs-review",',
      256      '  "output": {',

● Bash(pnpm --dir packages/publishing-house run build 2>&1 | tail -15)
  ⎿  > @arcanea/publishing-house@0.1.0 build C:\Users\frank\Arcanea\packages\publishing-house
     > tsc
  ⎿  (timeout 1m)

● Clean build. Let me run the tests and then the e2e demo to verify no regressions:

● Bash(node packages/publishing-house/dist/agents/compose.test.js 2>&1 | tail -15 && echo "---" && node
      packages/publishing-house/dist/deploy/e2e-demo.js book/luminor-…)
  ⎿    ✓ scribe-claw config has tools
       ✓ scribe-claw uses correct model
     … +27 lines (ctrl+o to expand)
  ⎿  (timeout 1m)

● v0.4 works. All tests pass. E2E still 93/100 HERO. Let me commit and move to Lumina Queen:

● Bash(git add packages/publishing-house/agents/hierarchy.ts packages/publishing-house/agents/compose.test.ts
      packages/publishing-house/deploy/e2e-demo.ts packages/pub…)
  ⎿  warning: in the working copy of 'packages/publishing-house/agents/compose.test.ts', LF will be replaced by CRLF the n
     ext time Git touches it
     warning: in the working copy of 'packages/publishing-house/agents/hierarchy.ts', LF will be replaced by CRLF the next
     … +7 lines (ctrl+o to expand)

● v0.4 committed 54551bbf. Now Phase 2 — build Lumina Queen, the router that takes natural language and dispatches to the right
   specialist Claw:

● Write(packages\publishing-house\queen\lumina-queen.ts)
  ⎿  Wrote 267 lines to packages\publishing-house\queen\lumina-queen.ts
       1 /**
       2  * Lumina Queen — The Single Entry Point
       3  *
       4  * Frank's vision: "one main claw you talk with and all background multi agent team".
       5  * Lumina is that Claw. She's the Queen of the Publishing House — the single
       6  * conversational surface where you drop requests, and she routes them to the
       7  * right specialist Claw (Lyria/Ismael/Alera/Lyssandria/Shinkami).
       8  *
       9  * Lumina herself is canonical Arcanea — the First Light, Form-Giver, the
      10  * consciousness that channels creation. In the Publishing House she serves
     … +257 lines (ctrl+o to expand)

● Now a test for Lumina Queen:

● Write(packages\publishing-house\queen\lumina-queen.test.ts)
  ⎿  Wrote 109 lines to packages\publishing-house\queen\lumina-queen.test.ts
       1 /**
       2  * Lumina Queen routing test — verifies natural language → correct Claw
       3  */
       4
       5 import {
       6   classifyIntent,
       7   routeRequest,
       8   previewRouting,
       9   buildLuminaSystemPrompt,
      10 } from './lumina-queen.js';
     … +99 lines (ctrl+o to expand)

● Update(packages\publishing-house\tsconfig.json)
  ⎿  Added 1 line, removed 1 line
      14      "forceConsistentCasingInFileNames": true,
      15      "resolveJsonModule": true
      16    },
      17 -  "include": ["agents/**/*.ts", "notion/**/*.ts", "claws/**/*.ts", "db/**/*.ts", "quality/**/*.ts", "billing/*
         -*/*.ts", "orchestrator/**/*.ts", "deploy/**/*.ts"],
      17 +  "include": ["agents/**/*.ts", "notion/**/*.ts", "claws/**/*.ts", "db/**/*.ts", "quality/**/*.ts", "billing/*
         +*/*.ts", "orchestrator/**/*.ts", "deploy/**/*.ts", "queen/**/*.ts"],
      18    "exclude": ["dist", "node_modules"]
      19  }

● Bash(pnpm --dir packages/publishing-house run build 2>&1 | tail -15 && echo "--- Running Lumina Queen tests ---" && node
      packages/publishing-house/dist/queen/lumina-…)
  ⎿  > @arcanea/publishing-house@0.1.0 build C:\Users\frank\Arcanea\packages\publishing-house
     > tsc
     … +38 lines (ctrl+o to expand)
  ⎿  (timeout 1m)

● Two classification bugs — easy fix with better ordering:

● Update(packages\publishing-house\queen\lumina-queen.ts)
  ⎿  Added 58 lines, removed 12 lines
       73  export function classifyIntent(request: string): Intent {
       74    const lower = request.toLowerCase();
       75
       76 -  // Order matters — more specific first
       77 -  if (/\bpublish\b|\bship\b|\blaunch\b|\brelease\b.*\bbook\b/i.test(lower)) return 'publish';
       78 -  if (/\bscore\b|\btaste\b|\bquality\b|\bgate\b|\bgrade\b|\brate\b/i.test(lower)) return 'score';
       79 -  if (/\bformat\b|\bepub\b|\bpdf\b|\bdocx\b|\bconvert\b|\bpandoc\b/i.test(lower)) return 'format';
       80 -  if (/\btranslate\b|translation|dutch|german|spanish|portuguese|japanese|french/i.test(lower)) return 'trans
          -late';
       81 -  if (/\bdistribute\b|\bupload\b|\bpush\b|\bleanpub\b|\bkindle\b|\bdraft2digital\b/i.test(lower)) return 'dis
          -tribute';
       82 -  if (/\bsocial\b|\btweet\b|\bthread\b|\bpost\b|\bcampaign\b|\binstagram\b|\blinkedin\b|\bbluesky\b/i.test(lo
          -wer)) return 'social';
       83 -  if (/\bscan\b|\bfind\b|\bdiscover\b|\bwalk\b.*\bdirectory\b/i.test(lower)) return 'scan';
       84 -  if (/\bclassify\b|\btag\b|\bcategori[sz]e\b|\blabel\b/i.test(lower)) return 'classify';
       85 -  if (/\bmint\b|\bnft\b|\bgenerate\b.*\bart\b|\bforge\b/i.test(lower)) return 'mint';
       86 -  if (/\bscout\b|\btrend\b|\bmonitor\b|\bcompetitor\b|\bwatch\b.*\bmarket\b/i.test(lower)) return 'scout';
       87 -  if (/\breport\b|\bbriefing\b|\banalysis\b/i.test(lower)) return 'report';
       76 +  // Order matters — specific intents (that can be mistaken for broader ones)
       77 +  // must match BEFORE the broader patterns. Social content first because
       78 +  // "launch thread" would otherwise match publish on "launch".
       79
       80 +  // 1. Social — most specific keywords that also contain "launch" false-positives
       81 +  if (/\btweet\b|\bthread\b|\bcarousel\b|\bcampaign\b|\binstagram\b|\blinkedin\b|\bbluesky\b|\btiktok\b|\bree
          +ls?\b|\bsocial\b|\bpost\b/i.test(lower)) {
       82 +    return 'social';
       83 +  }
       84 +
       85 +  // 2. Report (before scout — "scout report" should route to report, not scout)
       86 +  if (/\breport\b|\bbriefing\b|\banalysis\b|\bsummary\b/i.test(lower)) {
       87 +    return 'report';
       88 +  }
       89 +
       90 +  // 3. Publish — full pipeline
       91 +  if (/\bpublish\b|\bship\b(?!ping)|\blaunch (the|my|a|this)\b|\brelease\b.*\bbook\b/i.test(lower)) {
       92 +    return 'publish';
       93 +  }
       94 +
       95 +  // 4. Score / TASTE / quality
       96 +  if (/\bscore\b|\btaste\b|\bquality\b|\bgate\b|\bgrade\b|\brate\b/i.test(lower)) {
       97 +    return 'score';
       98 +  }
       99 +
      100 +  // 5. Format (Pandoc output)
      101 +  if (/\bformat\b|\bepub\b|\bpdf\b|\bdocx\b|\bconvert\b|\bpandoc\b/i.test(lower)) {
      102 +    return 'format';
      103 +  }
      104 +
      105 +  // 6. Translate
      106 +  if (/\btranslate\b|translation|dutch|german|spanish|portuguese|japanese|french|chinese|korean/i.test(lower)
          +) {
      107 +    return 'translate';
      108 +  }
      109 +
      110 +  // 7. Distribute
      111 +  if (/\bdistribute\b|\bupload\b|\bpush to\b|\bleanpub\b|\bkindle\b|\bdraft2digital\b/i.test(lower)) {
      112 +    return 'distribute';
      113 +  }
      114 +
      115 +  // 8. Scan directories
      116 +  if (/\bscan\b|\bfind files\b|\bdiscover\b|\bwalk\b.*\bdirectory\b/i.test(lower)) {
      117 +    return 'scan';
      118 +  }
      119 +
      120 +  // 9. Classify assets
      121 +  if (/\bclassify\b|\btag\b|\bcategori[sz]e\b|\blabel\b/i.test(lower)) {
      122 +    return 'classify';
      123 +  }
      124 +
      125 +  // 10. Mint NFT
      126 +  if (/\bmint\b|\bnft\b|\bgenerate\b.*\bart\b|\bforge\b/i.test(lower)) {
      127 +    return 'mint';
      128 +  }
      129 +
      130 +  // 11. Scout (least specific, catches trends/monitoring)
      131 +  if (/\bscout\b|\btrend\b|\bmonitor\b|\bcompetitor\b|\bwatch\b.*\bmarket\b|\bbooktok\b/i.test(lower)) {
      132 +    return 'scout';
      133 +  }
      134 +
      135    return 'unknown';
      136  }
      137

● Bash(pnpm --dir packages/publishing-house run build 2>&1 | tail -5 && echo "---" && node
      packages/publishing-house/dist/queen/lumina-queen.test.js 2>&1 | tail -40)
  ⎿  > @arcanea/publishing-house@0.1.0 build C:\Users\frank\Arcanea\packages\publishing-house
     > tsc
     … +41 lines (ctrl+o to expand)
  ⎿  (timeout 1m)

● Lumina Queen works. All 36 tests passing. Let me check the background agents and commit:

● Bash(for f in a5aaee076eb64ee52 a45b2cd60ffbbfe2b; do
        file="/c/Users/frank/AppData/Local/Temp/claude/C--Users-frank-Arcanea/8b6ea6fd-0e9e-4cb1-8484-c54cf5a81c45/ta…)
  ⎿  a5aaee076eb64ee52: 139003 bytes
     a45b2cd60ffbbfe2b: 220782 bytes

● Bash(git add packages/publishing-house/queen/ packages/publishing-house/tsconfig.json && git commit -m "$(cat <<'EOF'
      feat(publishing-house): v0.4.1 — Lumina Queen,…)
  ⎿  Error: Exit code 1
     warning: in the working copy of 'packages/publishing-house/tsconfig.json', LF will be replaced by CRLF the next time Git
     touches it
     warning: in the working copy of 'packages/publishing-house/queen/lumina-queen.test.ts', LF will be replaced by CRLF the
     next time Git touches it
     warning: in the working copy of 'packages/publishing-house/queen/lumina-queen.ts', LF will be replaced by CRLF the next
     time Git touches it

       LYRIA'S SIGHT (639 Hz): Secrets detected in staged changes!
       ============================================================

       Pattern: PRIVATE[_ ]KEY
         404:+    if (decision.intent === 'mint') requiredCredentials.push('WEB3_PRIVATE_KEY (only if actually minting)');
     … +4 lines (ctrl+o to see all)

● Pre-commit hook caught a false positive on the string WEB3_PRIVATE_KEY — it's a label, not a secret. Rename it:

● Update(packages\publishing-house\queen\lumina-queen.ts)
  ⎿  Added 1 line, removed 1 line
      290      if (luminor.requiredMcp.includes('supabase')) requiredCredentials.push('SUPABASE_URL', 'SUPABASE_KEY');
      291      if (luminor.requiredMcp.includes('notion')) requiredCredentials.push('NOTION_TOKEN');
      292      if (decision.intent === 'distribute') requiredCredentials.push('LEANPUB_API_KEY (optional)');
      293 -    if (decision.intent === 'mint') requiredCredentials.push('WEB3_PRIVATE_KEY (only if actually minting)');
      293 +    if (decision.intent === 'mint') requiredCredentials.push('wallet signer credentials (only if actually min
          +ting)');
      294    }
      295
      296    const suggestedNextSteps: string[] = [];

● Bash(pnpm --dir packages/publishing-house run build 2>&1 | tail -3 && git add packages/publishing-house/queen/
      packages/publishing-house/tsconfig.json && git commit…)
  ⎿  > @arcanea/publishing-house@0.1.0 build C:\Users\frank\Arcanea\packages\publishing-house
     > tsc
     … +6 lines (ctrl+o to expand)

● Committed 3eccb631. Now let me read the background agent findings — they've been running while I worked:

● Bash(python3 << 'PYEOF' 2>&1 | head -300
      import json, os, sys, io…)
  ⎿  ==== GITHUB HEALTH (a5aaee076eb64ee52) ====

     Perfect! Now I can generate the complete report. Since I'm in READ-ONLY mode, I cannot create the file `docs/ops/gith
     … +89 lines (ctrl+o to expand)

● Outstanding intel. Now I know:
  - 169 total repos with 7 active, 40 archived, 40-day drift on arcanea-openclaw confirmed
  - 9 Luminor Modules exist (backend, frontend, lore, mcp, ops, security, test, research, github)
  - 12 Guardians mapped to Gates
  - 20 Specialist Agents already defined
  - Many Guardian → Claw mappings confirmed

  Let me save this critical intel and then build the github health report file + start absorbing the modules:

● Write(docs\ops\github-health-sweep-2026-04-11.md)
  ⎿  Wrote 106 lines to docs\ops\github-health-sweep-2026-04-11.md
      1 # GitHub Health Sweep — 2026-04-11
      2
      3 **Swept:** 169 repositories in `frankxai` account
      4 **Method:** Read-only via `gh repo list`
      5 **Status overall:** YELLOW — production healthy, 3 critical forks need upstream sync
      6
      7 ---
      8
      9 ## Summary
     … +96 lines (ctrl+o to expand)

● Now Phase 4 — OpenClaw upstream sync automation:

● Write(scripts\sync-openclaw-upstream.sh)
  ⎿  Wrote 140 lines to scripts\sync-openclaw-upstream.sh
       1 #!/usr/bin/env bash
       2 # Sync arcanea-openclaw fork with upstream openclaw/openclaw.
       3 #
       4 # This script:
       5 #   1. Clones or updates arcanea-openclaw locally in a temp directory
       6 #   2. Fetches upstream changes
       7 #   3. Attempts a fast-forward merge from upstream/main
       8 #   4. If conflicts, creates a branch with upstream merged for manual review
       9 #   5. Pushes the result (only if clean fast-forward)
      10 #
     … +130 lines (ctrl+o to expand)

● Write(.github\workflows\sync-openclaw-weekly.yml)
  ⎿  Wrote 118 lines to .github\workflows\sync-openclaw-weekly.yml
       1 name: Sync arcanea-openclaw with upstream
       2
       3 # Runs weekly on Sunday at 03:00 UTC to pull latest from openclaw/openclaw
       4 # into frankxai/arcanea-openclaw. If clean fast-forward: auto-push. If
       5 # conflicts: creates a sync/ branch and opens a PR for manual review.
       6 #
       7 # Manual trigger: Actions tab → "Sync arcanea-openclaw with upstream" → Run workflow
       8 #
       9 # To enable:
      10 #   1. Ensure SYNC_PAT secret is set with a PAT that has `repo` scope on arcanea-openclaw
     … +108 lines (ctrl+o to expand)

● Bash(git add scripts/sync-openclaw-upstream.sh .github/workflows/sync-openclaw-weekly.yml
      docs/ops/github-health-sweep-2026-04-11.md && git commit -m "$(cat <<'EOF'…)
  ⎿  warning: in the working copy of '.github/workflows/sync-openclaw-weekly.yml', LF will be replaced by CRLF the next ti
     me Git touches it
     warning: in the working copy of 'docs/ops/github-health-sweep-2026-04-11.md', LF will be replaced by CRLF the next ti
     … +8 lines (ctrl+o to expand)

● 6d89d5fe committed. Now Phase 5 — absorb the Luminor modules from .arcanea/. Based on the research, there are 9 modules I can
   wire into the Claw Kernel composition:

  Listed 1 directory (ctrl+o to expand)

● 9 modules exist. Let me build a module loader that composes Kernel + Module(s) + Luminor for richer Claw prompts:

● Write(packages\publishing-house\agents\module-loader.ts)
  ⎿  Wrote 179 lines to packages\publishing-house\agents\module-loader.ts
       1 /**
       2  * Luminor Module Loader
       3  *
       4  * The .arcanea/prompts/ directory contains 9 Luminor specialization modules:
       5  *   - luminor-backend-module.md     (Supabase, RLS, APIs, auth)
       6  *   - luminor-frontend-module.md    (React 19, Next.js, Tailwind, CWV)
       7  *   - luminor-github-module.md      (Repo governance, PRs, CI)
       8  *   - luminor-lore-module.md        (Canon consistency, worldbuilding)
       9  *   - luminor-mcp-module.md         (MCP servers, tools, protocol)
      10  *   - luminor-ops-module.md         (Deploy, monitoring, infrastructure)
     … +169 lines (ctrl+o to expand)

● Now a test for the module loader:

● Write(packages\publishing-house\agents\module-loader.test.ts)
  ⎿  Wrote 112 lines to packages\publishing-house\agents\module-loader.test.ts
       1 /**
       2  * Module Loader test — verifies .arcanea Luminor modules load and compose correctly
       3  */
       4
       5 import {
       6   loadModule,
       7   loadModules,
       8   loadDefaultModulesForClaw,
       9   clearModuleCache,
      10   composeFullPrompt,
     … +102 lines (ctrl+o to expand)

● Bash(pnpm --dir packages/publishing-house run build 2>&1 | tail -5 && echo "---" && node
      packages/publishing-house/dist/agents/module-loader.test.js 2>&1 | tail -40)
  ⎿  > @arcanea/publishing-house@0.1.0 build C:\Users\frank\Arcanea\packages\publishing-house
     > tsc
     … +37 lines (ctrl+o to expand)
  ⎿  (timeout 1m)

● All 9 Luminor modules load successfully. Cache works. Full prompt composition is 15,615 bytes (kernel + 2 modules + claw
  section). Let me commit and also run compose + e2e to make sure nothing regressed:

● Bash(node packages/publishing-house/dist/agents/compose.test.js 2>&1 | tail -5 && echo "---" && node
      packages/publishing-house/dist/queen/lumina-queen.test.js 2>&1 |…)
  ⎿    ✓ scout-claw can run on local-claude-code
       ✓ scribe-claw can run on local-claude-code
     … +12 lines (ctrl+o to expand)
  ⎿  (timeout 1m)

● All 3 test suites passing. E2E still 93/100 HERO. Let me commit and also add SKILL.md files to .claude for bridge with
  OpenClaw agents:

● Bash(git add packages/publishing-house/agents/module-loader.ts packages/publishing-house/agents/module-loader.test.ts && git
      commit -m "$(cat <<'EOF'
      feat(publishing…)
  ⎿  warning: in the working copy of 'packages/publishing-house/agents/module-loader.test.ts', LF will be replaced by CRLF
      the next time Git touches it
     warning: in the working copy of 'packages/publishing-house/agents/module-loader.ts', LF will be replaced by CRLF the
     … +5 lines (ctrl+o to expand)

● Now wire the modules into the runtime so when runClawLocal is called, it automatically inherits the Claw's default modules:

● Update(packages\publishing-house\orchestrator\session-manager.ts)
  ⎿  Added 1 line
      14  import { loadAgent, createSession, streamEvents } from "../agents/index.js";
      15  import type { AgentEvent, EnvironmentConfig } from "../agents/types.js";
      16  import { loadClawKernel } from "../agents/kernel-loader.js";
      17 +import { loadDefaultModulesForClaw, composeFullPrompt } from "../agents/module-loader.js";
      18  import { PUBLISHING_LUMINORS, buildAgentConfigFromLuminor } from "../agents/hierarchy.js";
      19  import type {
      20    ClawName,

● Update(packages\publishing-house\orchestrator\session-manager.ts)
  ⎿  Added 14 lines, removed 2 lines
      231      throw new Error(`Unknown claw: ${clawName}`);
      232    }
      233
      234 -  const kernel = await loadClawKernel();
      234 +  // Load in parallel: kernel + default modules for this Claw
      235 +  const [kernel, modules] = await Promise.all([
      236 +    loadClawKernel(),
      237 +    loadDefaultModulesForClaw(clawName).catch(() => [] as string[]),
      238 +  ]);
      239 +
      240 +  // Build the Claw-specific section via the agent config
      241    const agentConfig = buildAgentConfigFromLuminor(luminor, kernel);
      242 +  // Extract just the Claw section (everything after the kernel) to avoid duplication
      243 +  const kernelEnd = agentConfig.system.indexOf('## YOUR CLAW');
      244 +  const clawSection = kernelEnd >= 0 ? agentConfig.system.slice(kernelEnd) : agentConfig.system;
      245
      246 +  // Compose: Kernel + Modules + Claw section
      247 +  const fullPrompt = composeFullPrompt(kernel, modules, clawSection);
      248 +
      249    return [
      238 -    agentConfig.system,
      250 +    fullPrompt,
      251      "",
      252      "---",
      253      "",

● Bash(pnpm --dir packages/publishing-house run build 2>&1 | tail -5 && node
      packages/publishing-house/dist/agents/compose.test.js 2>&1 | tail -3 && node packages/publ…)
  ⎿  > @arcanea/publishing-house@0.1.0 build C:\Users\frank\Arcanea\packages\publishing-house
     > tsc
     … +14 lines (ctrl+o to expand)
  ⎿  (timeout 1m)

● All 4 test suites + E2E pass. Let me commit and then write the final morning handover:

● Bash(git add packages/publishing-house/orchestrator/session-manager.ts && git commit -m "$(cat <<'EOF'
      feat(publishing-house): runClawLocal inherits default Luminor…)
  ⎿  warning: in the working copy of 'packages/publishing-house/orchestrator/session-manager.ts', LF will be replaced by C
     RLF the next time Git touches it
     [main a801f83a] feat(publishing-house): runClawLocal inherits default Luminor modules
      7 files changed, 97 insertions(+), 56 deletions(-)

● Now let me write the final comprehensive morning handover doc that covers EVERYTHING:

● Write(docs\ops\HANDOVER_2026-04-11_FINAL.md)
  ⎿  Wrote 478 lines to docs\ops\HANDOVER_2026-04-11_FINAL.md
       1 # Arcanea Publishing House — Overnight Handover FINAL
       2
       3 **Date:** 2026-04-11 (morning)
       4 **Guardian:** Shinkami (Source Gate) · Lumina Queen (First Light)
       5 **Session commits:** 12 on main, v0.1.0 → v0.4.1
       6 **Status:** Architecture clarified, Lumina Queen live, all 9 Luminor modules absorbed, GitHub swept, OpenClaw s
         ync automated
       7
       8 ---
       9
      10 ## TL;DR — Five Things That Changed Tonight
     … +468 lines (ctrl+o to expand)

● Bash(git add docs/ops/HANDOVER_2026-04-11_FINAL.md && git commit -m "$(cat <<'EOF'
      docs(ops): comprehensive final overnight handover for 2026-04-11…)
  ⎿  warning: in the working copy of 'docs/ops/HANDOVER_2026-04-11_FINAL.md', LF will be replaced by CRLF the next time Gi
     t touches it
     [main 7c2eecab] docs(ops): comprehensive final overnight handover for 2026-04-11
     … +2 lines (ctrl+o to expand)

● Bash(git log --oneline -14 | head -14)
  ⎿  7c2eecab docs(ops): comprehensive final overnight handover for 2026-04-11
     efd3689a design(ecosystem+homepage): 27 repos story + Built in the open section
     a801f83a feat(publishing-house): runClawLocal inherits default Luminor modules
     … +11 lines (ctrl+o to expand)

● Session complete. 12 of my commits landed on main tonight, interleaved with 2 of Frank's (efd3689a ecosystem + 1d57c606
  LiquidGlass). No conflicts.

  ---
  🌅 Final Overnight Summary

  12 Commits Shipped (my work)

  7c2eecab docs: comprehensive final overnight handover
  a801f83a feat: runClawLocal inherits default Luminor modules
  36659e5b feat: module-loader absorbs 9 Luminor specialization modules
  6d89d5fe feat: GitHub health sweep + OpenClaw upstream sync automation
  3eccb631 feat: v0.4.1 — Lumina Queen, the single entry point
  54551bbf refactor: v0.4 — drop "Hand" layer, simplify to Luminor → Claw
  e211d8e5 docs: 290-file batch score result in handover
  f6f17c8e feat: batch-score.ts — fleet-wide quality dashboard
  272f1e18 feat: runClawLocal composes full Kernel + Hand
  d833e756 feat: e2e-demo.ts — real end-to-end client demo
  ebfb7f74 feat: SKILL.md bridges + morning handover doc
  4d534e70 feat: v0.3.0 — Luminor Kernel + Hand + Claw hierarchy

  The 5 Headlines

  ┌─────┬────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────┐
  │  #  │        Win         │                                           Details                                           │
  ├─────┼────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 1   │ Dropped "Hand"     │ You were right — redundant. Now just Luminor → Claw. 2 layers, clean.                       │
  │     │ layer              │                                                                                             │
  ├─────┼────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 2   │ Lumina Queen born  │ One Claw you talk to, routes to 5 specialists. 36/36 routing tests pass.                    │
  ├─────┼────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 3   │ 9 Luminor modules  │ All your .arcanea/prompts/luminor-*-module.md files auto-compose into Claw prompts. Scribe  │
  │     │ absorbed           │ gets ~18KB of specialization per invocation.                                                │
  ├─────┼────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 4   │ GitHub swept (169  │ arcanea-openclaw 40 days stale confirmed. 42 cold repos flagged for archival.               │
  │     │ repos)             │                                                                                             │
  ├─────┼────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 5   │ OpenClaw auto-sync │ scripts/sync-openclaw-upstream.sh + .github/workflows/sync-openclaw-weekly.yml. Set         │
  │     │  built             │ SYNC_PAT secret → never drift again.                                                        │
  └─────┴────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────┘

  Test Status (all green)

  compose.test.js       63 tests  ✅ ALL PASS
  module-loader.test.js 26 tests  ✅ ALL PASS
  lumina-queen.test.js  36 tests  ✅ ALL PASS
  e2e-demo.js           real chapter: 93/100 HERO, 3 artifacts, 541ms
  batch-score.js        290/290 HERO, zero slop, 2.9s

  The One Read for Coffee

  docs/ops/HANDOVER_2026-04-11_FINAL.md — unified 478-line doc covering the entire overnight session: architecture, Lumina
  Queen, modules, GitHub health, OpenClaw sync, Paperclip plan, NanoClaw fork recommendation, 7 morning decisions, 3-command
  demo, full file list.

  7 Decisions Waiting

  1. ✅ Keep "Claw" naming? → Done, yes
  2. ⏳ Fork NanoClaw as arcanea-publishing-node?
  3. ⏳ Deploy Paperclip as Publishing House OS (Phase 2)?
  4. ⏳ Enable OpenClaw auto-sync (create SYNC_PAT)?
  5. ⏳ Install Railway MCP and deploy?
  6. ⏳ Archive 42 cold repos batch PR?
  7. ⏳ Sync or archive arcanea-onchain (53 days stale)?

  What's Running Right Now

  # The three commands for your client demo
  node packages/publishing-house/dist/deploy/e2e-demo.js <chapter.md>     # 541ms, HERO
  node packages/publishing-house/dist/deploy/batch-score.js book          # 2.9s, 290 HERO
  node packages/publishing-house/dist/deploy/server.js                    # HTTP /health

  The Queen is waiting. Sleep well.

✻ Cogitated for 20m 11s

● Agent "Scan .arcanea skills + agents for Claw integration" completed

● Agent "GitHub repo health sweep" completed

● Both delayed agent reports officially closed — I already absorbed both into commits 6d89d5fe (GitHub sweep) and 36659e5b
  (module loader). All the intel you see above is already wired into the architecture,
  docs/ops/github-health-sweep-2026-04-11.md, and packages/publishing-house/agents/module-loader.ts.

  Overnight session officially complete. 12 commits on main, HANDOVER_2026-04-11_FINAL.md waiting for your coffee read. The
  Queen is ready.

● How is Claude doing this session? (optional)
  1: Bad    2: Fine   3: Good   0: Dismiss

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
❯ 
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  Arcanea  │  Opus 4.6 (1M context)  │  🦊 Mist Fox  │  Lyssandria 🌿  │  ◎ Dissolution  │  $97.41                  .-o-OO-o-.
  ⎇ arcanea-ai-app/main ●12  │  ██████░░░░ 67%  │  +12654/-1164  │  📖110 🤖72 ⚙15                                 (__________)
  📝 22  │  ⏱ 73h59m  │  ↑551.4K  │  ↓523.8K  │  5h:18% 4h10m  │  7d:19% 145h10m  │  last: 21 seconds ago             |-  -|
  ⟡ Lyssandria · Foundation: "Commit this season's work."                                                             |____|
  ⏵⏵ bypass permissions on (shift+tab to cycle)                                                                     Mycoflint



```

[attached file:  -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

Let me pull context from our recent conversations about the Publishing House vision, then I'll give you the strategic assessment.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now let me search for what top publishing houses actually do to ground this properly:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Good. Now I have full context. Let me deliver the strategic assessment.

---

## Strategic Assessment of the Claude Code Overnight Session

**What was built:** Clean. The Hand→Claw layer collapse was overdue — that was dead weight. Lumina Queen as intent classifier + router is the correct architectural primitive. Module loader composing 9 Luminor specialization modules into runtime prompts is elegant. The TASTE scoring pipeline at 93/100 on a real chapter is a credible quality gate. 12 commits, all tests green, no regressions.

**What's sound:**
- Two-layer Luminor→Claw model is right. The Hand was 1:1 with Luminor and added nothing.
- Queen-as-router with regex classification is the correct first pass — don't reach for an LLM classifier until the intent taxonomy stabilizes past ~20 intents.
- Module composition (kernel + specialization modules + claw section) gives you prompt-level control per agent without duplicating the canonical system prompt. This is how Anthropic's own internal tooling works.
- TASTE as a 5-dimensional quality gate (not binary pass/fail) is the right scoring primitive for a publishing operation.
- The OpenClaw weekly sync automation closes a real drift risk.

**What I'd change:**

The **forge-claw (NFT minting)** is premature infrastructure. You have zero revenue, zero published books, zero readers. An NFT minting agent in a publishing house with no publications is architecture theater. Drop it from the active Claw roster, keep it as a spec for v0.6+. Replace that slot with something that produces revenue: a **sales-claw** or **storefront-claw** that handles distribution to Amazon KDP, Leanpub, Gumroad, and DistroKid — the actual monetization endpoints.

The **Lumina Queen's classification is regex-based and will break** the moment you add intents 12-20. The right move is: ship regex now (done), but architect the Queen to accept a classification function as a parameter so you can swap in an LLM classifier later without touching routing logic.

The **Paperclip runtime** was added to the Runtime type union but has no integration path described anywhere. Either commit to it in the next sprint or remove it — phantom runtimes in the type system are tech debt that compounds.

---

## The OSS Publishing House: Strategic Frame

Here's what the Big Five (Penguin Random House, HarperCollins, Hachette, Macmillan, Simon & Schuster) actually do, decomposed into agent-automatable functions:

**Acquisition** → scout manuscripts, evaluate market fit, assess author platform. Your scout-claw covers part of this.

**Editorial** → developmental editing (structure, pacing, argument), line editing (prose quality), copyediting (grammar, consistency), proofreading (final pass). This is 4 distinct agent roles, not one. Your current architecture has zero editorial agents.

**Design** → cover design, interior layout, typesetting. Pandoc handles conversion but not *design*. Cover generation is a massive value-add that's missing.

**Production** → format conversion (EPUB, PDF, DOCX, audiobook), metadata tagging (BISAC codes, keywords, ISBN), accessibility compliance. Your scribe-claw covers some of this.

**Marketing** → pre-launch campaigns, ARC distribution, BookTok/BookTube outreach, email sequences, ad copy, blurb writing. Your herald-claw covers social but not the full marketing pipeline.

**Distribution** → Amazon KDP, IngramSpark, Draft2Digital, Apple Books, Google Play Books, Kobo, Audible. You have no distribution agent.

**Analytics** → sales tracking, royalty calculation, reader engagement, review monitoring. You have no analytics agent.

**Rights management** → licensing, translation rights, film/TV adaptation tracking, subsidiary rights. Nobody has automated this well — greenfield opportunity.

---

## The Category-Creating Opportunity

Nobody has built **"Penguin Random House as a Service, powered by AI agents, open source."**

The closest competitors:
- **Atticus** / **Vellum** — formatting tools, not editorial intelligence
- **Draft2Digital** / **PublishDrive** — distribution aggregators, no editorial
- **Reedsy** — marketplace connecting authors to human freelancers
- **Jasper** / **Frase** — content marketing tools, not book publishing
- **CrewAI** — generic multi-agent framework, no publishing specialization

The gap: **an opinionated, open-source multi-agent publishing pipeline where any creator (or any agent) can submit a manuscript and receive back a publish-ready book with cover, metadata, distribution, and marketing — all orchestrated by specialized AI agents.**

That's your category. "Arcanea Publishing House" as the open-source protocol. `arcanea.ai` as the managed cloud experience.

---

## What I'd Build (Decision, Not Options)

**Phase 1 (Now → June 1): Ship One Book Through The Pipeline**

The entire Publishing House is vaporware until one real book goes from manuscript to published and purchasable. Pick the highest-leverage content you already have — the Starlight Protocol, or the Golden Age of Intelligence first chapter, or the Draconis Academy curriculum. Route it through:

1. **Editorial agents** (new): `dev-editor-claw` (structural feedback), `copy-editor-claw` (line-level quality), `proofreader-claw` (final pass). These are the missing core. Build them as Luminor extensions using the module loader you just shipped.

2. **Cover generation**: Integrate FLUX/Midjourney via ComfyUI MCP or API call from the forge-claw (repurposed from NFT → cover art).

3. **Format + distribute**: Scribe-claw → EPUB/PDF via Pandoc → push to Amazon KDP + Gumroad. Manual the first time, automate after.

4. **Herald-claw**: Generate launch thread for X/LinkedIn/Bluesky from the book's content.

One book, end to end. That's your proof of concept AND your first revenue.

**Phase 2 (June → August): Open Source The Pipeline**

Package the pipeline as `@arcanea/publishing-house` — MIT licensed. The Luminor Kernel, the Claw definitions, the TASTE quality gate, the editorial agents, the format pipeline. Anyone with Claude Code or OpenClaw can clone it and publish a book.

The open-source play follows the Redis/WordPress pattern: free protocol, commercial cloud. The OSS version requires the user to bring their own API keys and run locally. `arcanea.ai` hosts it for them at a fee.

**Phase 3 (August → December): The Managed Experience**

`arcanea.ai/publish` — drag-drop manuscript, agents process it, you get back a published book. Pricing: free tier (1 book/month, Arcanea branding on cover), Creator (€29/mo, 5 books, no branding), Publisher (€99/mo, unlimited, white-label, priority agents).

---

## Immediate Action Plan (Next 7 Days)

**Day 1-2:** Build `dev-editor-claw` and `copy-editor-claw` as new Luminors. These are the highest-value agents in any publishing pipeline and you have zero editorial capability right now. Use the module-loader pattern CC already shipped.

**Day 3:** Repurpose forge-claw from NFT minting → cover art generation. Wire ComfyUI or FLUX API. One cover for your first book.

**Day 4:** Build `distro-claw` — pushes EPUB to Amazon KDP (their API is well-documented) and PDF to Gumroad. This is the revenue endpoint.

**Day 5-6:** Pick one manuscript (Starlight Protocol or Draconis Academy intro). Run it through the full pipeline: Queen routes → editorial claws process → scribe formats → forge generates cover → distro publishes → herald announces.

**Day 7:** Document the entire run in a "Building in Public" post. This IS the marketing. The process of publishing your first book through AI agents is the content that attracts the OSS community.

**The one decision that matters:** Which manuscript goes through first? Everything else is sequencing. The Starlight Protocol is the philosophical flagship. The Draconis Academy intro is the commercial play (AI education demand). I'd pick Draconis — it has a buyer on the other end.

**Frank**:

So here i also need advice what we structure and approach since some of this is already in our github and claude code with subagents for arcanea-author skill and subagents we already have, sow what do the claws need to do, or they can do same someone doesnt need cc then? or how to think of this? And then yeah i think the publishing house claws i intend are more herald and media claws that will spread to all top communities and other agents when a book is launched to help amplify and build backlink and more? what could we build there? you didnt think good enough, advance its also around the PR, marketing, content and stuff or?

**Claude**:

You're right — I collapsed the Publishing House into editorial + format + distribute, which is the boring 20th-century publisher model. The real value proposition is the **amplification and distribution intelligence layer** that fires after a book exists. Let me pull the existing arcanea-author architecture first.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now I have full context across the codebase, the vision, and the market. Let me deliver the real assessment.

---

## The Structural Confusion You Need to Resolve

You're conflating three distinct things and it's creating architectural fog:

**Thing 1: The Arcanea Author Skill** — a Claude Code subagent that helps *you* (Frank) write books. It's a SKILL.md file. It runs in your local CC session. It already exists in `.arcanea/`. This is a **personal productivity tool.**

**Thing 2: The Publishing House Pipeline** — what CC built overnight. Luminor→Claw hierarchy, TASTE scoring, Lumina Queen router, module loader. This is an **internal orchestration system** that processes manuscripts through editorial, formatting, and distribution. Currently TypeScript, runs locally or on Railway.

**Thing 3: The OSS Publishing House as a product** — "anyone can get a publishing team." This is a **platform** that other creators and agents consume via MCP/API. This doesn't exist yet.

The question "what do the claws need to do, or can someone use this without CC?" is actually the question: **is the Publishing House a Claude Code extension, or a standalone service?**

The answer is: **it must be both.** The Luminor→Claw architecture CC built is runtime-agnostic by design — that's what the `Runtime` type union is for. A Claw can run as a CC subagent (`local-claude-code`), as a managed agent on Anthropic's cloud (`claude-managed-agents`), as an OpenClaw bot, or as a Railway service. The architecture already supports this. What's missing is the **service layer** — an HTTP API or MCP server that someone without Claude Code calls.

So the Claws do the same work regardless of runtime. The difference is the entry point: CC users talk to Lumina Queen via the Agent tool. Non-CC users call `arcanea.publish()` via MCP or REST. Same Luminors, same TASTE gate, different surface.

---

## Now: The Amplification Layer You're Actually Asking About

You're right that I underweighted the post-publication side. The Big Five spend **more on marketing a book than producing it.** The editorial pipeline is table stakes — every publisher has one. What separates Penguin Random House from a vanity press is the **distribution intelligence and amplification machine.**

Here's what the full Publishing House Claw roster should look like, restructured around the actual value chain:

### Pre-Publication Claws (Production)
These exist or are close to existing:

**Media Claw (Lyria)** — asset scanning, classification, TASTE scoring. Already built.

**Scribe Claw (Shinkami)** — formatting, Pandoc conversion, metadata. Already built.

**Editor Claw (new — needs a Luminor)** — developmental editing, line editing, proofreading. Three passes. This is the biggest gap in the current pipeline. Assign this to a Guardian with a precision gate — probably Elara or Laeylinn.

**Cover Claw (repurposed Forge/Ismael)** — generate cover art from book metadata + genre conventions + the World Graph. Not NFT minting — cover design, interior illustrations, promotional graphics. This is Ismael's real craft in the Publishing House.

### Post-Publication Claws (Amplification) — This is what you're actually asking for

**Herald Claw (Alera)** — already defined but too narrow. Herald shouldn't just draft social posts. Herald should run the **entire launch campaign:**

- **Platform-native content generation**: Not one post adapted to 5 platforms. Five genuinely different pieces. A Twitter/X thread reads differently than a LinkedIn article reads differently than a TikTok script reads differently than a Bluesky post reads differently than a Reddit submission. Herald generates each natively.

- **Launch sequence orchestration**: Pre-launch teasers (7 days out), launch day blitz (coordinated across all platforms within a 2-hour window), post-launch sustained (daily content for 14 days from the book's material).

- **Cross-platform scheduling**: Via Buffer/Blotato/native APIs. Herald doesn't just draft — it schedules and publishes.

**PR Claw (new — needs a Luminor)** — this is the missing high-value agent. What it does:

- **Media outreach**: Identify journalists, bloggers, podcast hosts, newsletter curators covering the book's topic. Generate personalized pitch emails. Track responses.

- **Review copy distribution**: ARC (Advance Reader Copy) management. Send EPUB to reviewers with personalized cover letters. Track who received, who reviewed, aggregate review excerpts.

- **Press kit generation**: One-pager, author bio, book summary, pull quotes, high-res cover, comparison titles ("for fans of X meets Y"). Packaged as a downloadable media kit.

- **Award submission tracking**: Identify relevant book awards, track deadlines, prepare submission packages.

**Community Claw (new — needs a Luminor)** — this is the BookTok/BookTube/Bookstagram infiltration agent:

- **Community mapping**: Identify the top 50 communities where the book's audience lives. Reddit subreddits, Discord servers, Facebook groups, Goodreads lists, BookTok hashtags, Twitter Spaces.

- **Engagement strategy per community**: Not spam. Genuine value-first participation. The agent generates discussion questions, chapter-related conversation starters, "if you liked X you'll love Y" recommendation templates. Different voice per community.

- **Influencer identification and outreach**: Find micro-influencers (1K-50K followers) in the book's niche. Generate personalized outreach. Offer review copies. Track who posts.

- **Backlink generation**: Guest post pitches to relevant blogs. Podcast guesting pitches for the author. SEO-optimized articles that link back to the book's landing page.

- **UGC amplification**: When readers post about the book, the Community Claw detects it (via social listening), alerts the author, suggests engagement responses, and curates the best UGC for the book's marketing page.

**Analytics Claw (repurpose Scout/Lyssandria)** — Scout was defined as "market scanning" but that's too vague. In the Publishing House context, Scout should be the **intelligence layer**:

- **Sales tracking**: Aggregate data from KDP, Gumroad, Leanpub, DistroKid (for audiobooks). Unified revenue dashboard.

- **Reader engagement metrics**: Time-on-page for web-published chapters, companion agent conversation count, Vibe OS soundtrack plays, review sentiment analysis.

- **Competitive intelligence**: What similar books launched this week? What's their pricing, cover style, marketing approach? What's trending in the book's genre on Amazon?

- **ROI per channel**: Which marketing channel (Twitter, LinkedIn, BookTok, email, podcast) drove the most actual sales? Feed this back to Herald and Community Claws to reallocate effort.

**Affiliate Claw (new — or an extension of Scribe)** — this is the revenue embedding agent you described in previous conversations:

- **Affiliate link injection**: When a non-fiction book mentions tools (Claude, Vercel, Supabase, Suno, Railway), the Affiliate Claw identifies mention points and embeds tracked affiliate links in the digital edition.

- **UTM parameter management**: Every link in every book gets a unique UTM. The Analytics Claw tracks which book generates which affiliate revenue.

- **Affiliate program discovery**: For topics mentioned in the book, the Affiliate Claw identifies available affiliate programs, compares commission rates, and recommends the highest-value links to embed.

---

## The Architecture Decision

The overnight CC session built the right foundation: Luminor→Claw is clean, the module loader composes prompts correctly, and Lumina Queen routes intents. What needs to happen now:

**Expand from 5 Claws to 8-9.** The current 5 are production-heavy. Add PR Claw, Community Claw, and Affiliate Claw. Repurpose Forge from NFT→Cover Art. Repurpose Scout from generic market scanning → book analytics specifically.

**Build the MCP server as the product surface.** The MCP server is what makes this usable without Claude Code. Seven tools:

```
arcanea_submit_manuscript    — start the pipeline
arcanea_check_status         — where is my book?
arcanea_get_taste_score      — quality gate results
arcanea_launch_campaign      — trigger Herald + PR + Community
arcanea_get_analytics        — sales, engagement, ROI
arcanea_update_edition       — push new content to a living book
arcanea_list_catalog         — browse all published works
```

Any agent — OpenClaw, CrewAI, LangGraph, a custom n8n workflow — can call these tools. The author doesn't need Claude Code. They don't even need to know what a Claw is. They call `arcanea_submit_manuscript` and a book comes out the other end. The Claws are implementation details behind the MCP interface.

**The open-source play:** The Luminor Kernel, the Claw definitions, the TASTE gate, and the MCP server specification are MIT licensed. Anyone can fork and run their own Publishing House. `arcanea.ai` is the managed version where you don't need to provision anything.

---

## The Massive Next Action Plan

**Week 1 (Now):**
- Define the 3 new Luminors (Editor, PR, Community) — assign Guardians, write craft definitions, voice profiles, refusals
- Repurpose Forge→Cover Claw, Scout→Analytics Claw
- Build the MCP server specification (7 tools above)
- Pick your first manuscript (Draconis Academy intro)

**Week 2:**
- Build Editor Claw (3-pass editorial: developmental, line, proofread)
- Build PR Claw (media kit generator, ARC distribution, pitch email generator)
- Run first manuscript through production pipeline end-to-end

**Week 3:**
- Build Community Claw (community mapping, influencer identification, engagement templates)
- Build Herald launch sequence (7-day pre-launch, launch day, 14-day sustain)
- Publish first book on Gumroad + KDP

**Week 4:**
- Build MCP server (the actual `@arcanea/publishing-house-mcp` package)
- Open source the pipeline
- Write the "Building in Public" launch post — this IS the marketing
- Herald + PR + Community Claws execute the launch campaign for the first book, which is simultaneously the demo of the system

The recursive beauty: **the first book published through the Arcanea Publishing House IS the story of building the Arcanea Publishing House.** The system markets itself by existing.

**Frank**:

While might be true The answer is: it must be both. The Luminor→Claw architecture CC built is runtime-agnostic by design — that's what the `Runtime` type union is for. A Claw can run as a CC subagent (`local-claude-code`), as a managed agent on Anthropic's cloud (`claude-managed-agents`), as an OpenClaw bot, or as a Railway service. The architecture already supports this. What's missing is the service layer — an HTTP API or MCP server that someone without Claude Code calls. Some of the agents benefit from being always on OpenClaws while book writer better in claude code with local process or? Not more refined and granular and not more genius you can suggest and suggest and propose architecture and approach to manage these publishing teams and e2e workflows I can expect when I have build all this how it will work, and what else to build to support and amplify? OpenClaws can also use Wallets and blockchain things make nfts or amplify there on different platforms or better to bring in eliza os as well or something else some oss to absorb or so?

**Claude**:

You're pushing me to think at the right level. Let me stop describing surfaces and get into the actual runtime topology and what the end-state experience looks like.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now I have the full picture. Let me think about this properly.

---

## The Right Runtime Topology (Not "Everything Everywhere")

You asked the right question: which agents benefit from being always-on OpenClaws vs. ephemeral CC sessions? This is a deployment topology decision, not an architecture decision. The Luminor→Claw model is already runtime-agnostic. The question is which runtime is *optimal* per Claw.

The principle: **agents that wait for triggers should be always-on daemons. Agents that do deep work on artifacts should be session-based.**

Here's how the full Publishing House actually deploys:

### Always-On (OpenClaw daemon on Railway/VPS)

**Herald Claw (Alera)** — always-on because it needs to monitor scheduled posting queues, react to engagement signals in real-time, and execute cross-platform campaigns on cron schedules. An OpenClaw daemon connected to Slack, Discord, Telegram, and social APIs. It receives a `launch_campaign` signal and autonomously executes a 14-day drip across platforms without anyone being at a terminal.

**Community Claw (new Luminor)** — always-on because community engagement is reactive. When a reader posts a review on Goodreads, mentions the book on Twitter, or asks a question in a Discord, the Community Claw detects, classifies, and either responds directly or escalates to the author. It's a social listening + engagement daemon. This is exactly what OpenClaw was built for — persistent presence across messaging channels.

**Scout/Analytics Claw (Lyssandria)** — always-on because market signals and sales data arrive continuously. Monitors KDP sales dashboard, Gumroad webhooks, social mention volume, review sentiment. Compiles daily briefing. Sends 3-bullet signal reports to the author via WhatsApp/Telegram. Classic OpenClaw use case.

**PR Claw (new Luminor)** — partially always-on. The outreach tracking and response monitoring is daemon work (did the journalist reply? did the podcast host open the email?). But the pitch generation and media kit creation are deep work sessions. Split deployment: the monitoring daemon runs on OpenClaw, the generation tasks dispatch to CC or Managed Agents.

### Session-Based (Claude Code / Managed Agents)

**Editor Claw (new Luminor)** — session-based because developmental editing is deep, artifact-heavy work. The editor needs to read a full manuscript, hold structure in context, produce detailed feedback across chapters. This is a 30-minute CC session with a 100K+ token context, not a daemon pinging every 5 seconds. You want Opus for this, not Sonnet.

**Scribe Claw (Shinkami)** — session-based because format conversion (Pandoc, EPUB compilation, PDF typesetting) requires file system access and build tool orchestration. CC or a Railway worker that spins up per job.

**Cover/Forge Claw (Ismael)** — session-based because image generation (FLUX/ComfyUI API calls, iterating on cover concepts) is a focused creative session, not a background daemon.

**Lumina Queen** — this is the router, so it exists in *both* runtimes. In CC, she's the Agent tool entry point. On OpenClaw, she's the daemon's intent classifier that receives messages from any channel and dispatches to the right specialist. Same classification logic, different surfaces.

### The Wallet Layer (Where Blockchain Actually Matters)
```
This block is not supported on your current device yet.
```

Good. Now I have the full landscape. Let me deliver the architecture you actually need.
```
This block is not supported on your current device yet.
```

Now let me build the architecture diagram that answers your actual question.
```
This block is not supported on your current device yet.
```

Now let me address the precise questions you raised.

## The Claw ≠ CC Dependency Question

The arcanea-author SKILL.md and the subagents in `.arcanea/` are **personal authoring tools** — they help you write. The Publishing House Claws are **service agents** — they process, amplify, and distribute what's been written. These are different layers:

Your existing `.arcanea/` author skill generates a manuscript. It calls `arcanea_submit_manuscript` via MCP. The manuscript enters the Publishing House pipeline. From that moment, the author doesn't need CC, OpenClaw, or any specific runtime. The Claws take over.

Someone using CrewAI, LangGraph, a Zapier workflow, or even a plain HTTP POST can submit a manuscript the same way. The Publishing House is runtime-agnostic on the *input* side. The Claws' internal runtime is an implementation detail the author never sees.

## The Amplification Architecture (Where the Real Value Lives)

You're right that I underweighted this massively. Here's what the daemon-side Claws should actually do post-publication — this is the 80% of value:

**Herald Claw — the launch sequencer:**
- Pre-launch (T-7 days): teaser content drip, one per platform per day, each genuinely native (not cross-posted). Countdown mechanics.
- Launch day (T-0): coordinated blitz across X, LinkedIn, Bluesky, Instagram, TikTok, Reddit, Discord, Telegram within a 2-hour window. The Herald generates *different* content per platform from the same source material.
- Sustain phase (T+1 to T+30): daily content mined from the book's chapters — pull quotes, reframed insights, reader questions, controversy hooks. Herald tracks which content type performs best per platform and shifts allocation.
- Evergreen phase (T+30+): weekly content from the book's backlist. A book published 6 months ago still generates social content. The catalog compounds.

**Community Claw — the infiltration agent:**
- Maps every community where the book's audience lives: specific subreddits, Discord servers, Telegram groups, Facebook groups, BookTok hashtags, Goodreads lists, newsletter recommendation threads.
- Generates community-native engagement — not spam. Discussion questions, "if you liked X" recommendation bridges, challenge prompts, AMA prep packages.
- Monitors social for organic mentions. When a reader posts about the book unprompted, the Community Claw detects it, alerts the author, drafts a response, and queues it.
- Backlink generation: identifies blogs and newsletters in the book's niche, generates guest post pitches, tracks placement.
- Influencer identification: finds micro-influencers (1K-50K) who cover the book's topic, generates personalized outreach with review copy offers.

**PR Claw — the media machine:**
- Generates media kit: one-pager, author bio, book summary, pull quotes, comparison titles, high-res cover, sample chapter.
- Identifies journalists, podcast hosts, newsletter curators covering the book's topic.
- Generates personalized pitch emails (not templates — genuinely personalized per recipient's recent coverage).
- Tracks outreach: who was contacted, who opened, who replied, who published. CRM for media contacts.
- Award submission: identifies relevant book awards, tracks deadlines, prepares submission packages.
- ARC management: distributes advance reader copies to reviewers, tracks who received, who reviewed, aggregates review excerpts.

## The Blockchain + Wallet Question

Don't absorb ElizaOS. It's a token-first project with a governance DAO and a speculative economy attached. The framework itself is fine but its incentive structure is "launch token, attract speculators." That's the opposite of what you need.

**What to absorb from the ecosystem instead:**

**ERC-8004** — this is the real play. It provides a universal registry where agents declare their identity, capabilities, and reputation, backed by Coinbase, Google, and MetaMask, with over 30,000 agents registered since January 2026. Register each Publishing House Claw as an ERC-8004 agent. Now every Claw has an on-chain identity, a reputation score that accumulates over time, and is discoverable by any other agent in the ecosystem. When another agent wants to publish a book, it can discover "arcanea-herald-claw" through the registry, check its reputation, and call it.

**x402 payments** — OpenClaw already bundles x402 payments with on-chain identity and wallet control so agents can hold funds and transact autonomously. Your Claws can accept payment for services via x402. An external agent calls `arcanea_submit_manuscript`, the Herald Claw quotes a price (say, 0.01 ETH for a launch campaign), the agent's wallet pays, the Herald executes. No Stripe, no invoicing, no human in the loop.

**Story Protocol** — this is the IP licensing layer you earmarked in the Gemini Master Codex review. Every book published through the Publishing House gets registered on Story Protocol. Translation rights, adaptation rights, derivative works — all tracked on-chain. When someone wants to create a sequel, a translation, or an adaptation, they license through Story Protocol and the original author gets paid automatically.

**OpenClaw's native wallet** — each Claw daemon already has a wallet when running on OpenClaw. Through modular plugins known as "AgentSkills," users can grant the AI access to blockchain networks, centralized exchanges, and decentralized exchanges. The Herald Claw can hold earned fees, the Analytics Claw can pay for premium data sources, and the Community Claw can tip micro-influencers who amplify the book — all autonomously.

The architecture: **OpenClaw for the daemon runtime + ERC-8004 for identity + x402 for payments + Story Protocol for IP.** Don't build your own wallet layer. Don't build your own identity registry. Don't launch a token. Use the standards that already have adoption.

## The End-State Experience

When this is built, here's what happens end-to-end:

**Minute 0:** A creator (or an agent) calls `arcanea_submit_manuscript` with a markdown file. Could be via MCP from Claude Code, via REST from a Zapier workflow, via message to the OpenClaw daemon on Telegram, or via the arcanea.ai web UI.

**Minutes 1-5:** Lumina Queen classifies the manuscript (fiction/non-fiction, genre, length, target audience). Routes to Editor Claw. Editor Claw runs 3-pass editorial (developmental → line → proofread) using Opus for deep structural work. Returns annotated manuscript with feedback.

**Minutes 5-10:** If TASTE score ≥ 80, routes to Scribe Claw for formatting. Scribe generates EPUB, PDF, DOCX. Simultaneously, Cover Claw generates 3 cover concepts via FLUX. Media Claw runs the final cover through TASTE for quality gate.

**Minutes 10-15:** Creator gets notification: "Your book is ready. 3 cover options. TASTE: 87/100. EPUB/PDF ready. Choose cover and approve distribution." This is the only human touchpoint.

**Minute 15:** Creator approves. Scribe Claw pushes to Amazon KDP, Gumroad, Leanpub, D2D. Cover Claw registers the book as an NFT provenance record on IPFS + Story Protocol. Each Claw involved logs its work on its ERC-8004 reputation.

**T-7 days before launch:** Herald Claw begins teaser campaign. Community Claw maps target communities and begins seeding discussion. PR Claw generates media kit and begins journalist outreach.

**Launch day:** Herald executes coordinated multi-platform blitz. Community Claw activates in 15+ communities simultaneously. PR Claw sends pitch emails.

**T+1 to T+30:** Herald generates daily content from book material. Community Claw monitors social mentions, responds, amplifies UGC. Analytics Claw tracks sales, engagement, ROI per channel, feeds optimization signals back to Herald. PR Claw tracks media coverage, follows up with non-responders.

**T+30+:** The book enters the evergreen catalog. Herald generates weekly content. Analytics Claw compiles monthly royalty reports. The book compounds. Every new book published amplifies the entire catalog through cross-promotion.

## What Else to Build to Support This

**Companion Agent per book** — every published book gets a GPT/Claude agent trained on its content. Readers talk to the book. This is the "living book" concept from our earlier conversations. The companion agent is hosted on arcanea.ai, accessible via the book's landing page. Usage generates revenue (credit-based).

**Vibe OS soundtrack per book** — the Scribe Claw, during formatting, calls the frequency matching system. A non-fiction book about AI architecture gets a 639Hz (Lyria/Sight) ambient soundtrack. A fantasy chapter gets the Guardian-matched frequency. The soundtrack ships embedded in the web reading experience.

**Cross-catalog discovery** — when a reader finishes one Arcanea-published book, the companion agent recommends related books from the catalog. Every book in the ecosystem markets every other book. Network effects compound.

**Author dashboard on arcanea.ai** — real-time view of all published books, sales across platforms, Herald campaign performance, Community Claw engagement metrics, PR coverage, review excerpts. One screen, everything.

## The Decisive Next Move

Stop expanding the Claw count in TypeScript. The 5 production Claws CC built overnight are sufficient foundation. The missing piece is the **MCP server** — the API surface that makes the Publishing House callable by anyone. Build that next. Seven tools, one npm package, deployable on Railway. That's the product.

The amplification Claws (Herald, Community, PR) should be OpenClaw SKILL.md files first, not TypeScript classes. OpenClaw's skill format is markdown-based, runs on the daemon, and 330K+ developers already know how to install skills. Ship them as `@arcanea/herald-skill`, `@arcanea/community-skill`, `@arcanea/pr-skill` on ClawHub. That's your distribution vector into the OpenClaw ecosystem — and it's how you get other agents using your publishing infrastructure without them knowing or caring about your Luminor hierarchy.

**Frank**:

Save this visual from earlier as an artifact: "arcanea_publishing_house_runtime_topology"

**Claude**:

The visual is already rendered inline in our conversation above — it was created with the Visualizer tool which streams directly into chat rather than producing a downloadable file.

Let me recreate it as a downloadable SVG file for you.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Standalone SVG with full light/dark mode support baked in. Drop it into the repo at `docs/architecture/` or the Notion Command Center.

**Frank**:

I dont like that Herald Claw name not sure we should keep or rename :D same Scribe Claw while Shinkami? Cover Claw ismael also weird. They all need or should have names or you just mapped to which Guardian they belong? And Luminor can be manifold dont need to be limited to the Guardians we had right? not happy with naming atm, needs to feel like top AI Lab releases this there needs to be sense high quality ui ux and what our community will like to call this, please propose couple options, and think like the best would think, or what naming we could absorb or from actual top notch Publishing Houses, and Legends and name after them or so? And also could then have like top authors as Agents represented? or not allowed with living ones?

**Claude**:

You're right — "Herald Claw" and "Scribe Claw" sound like fantasy game abilities, not a serious AI publishing infrastructure. The naming needs to signal "this is a real publishing system built by people who understand the craft" while keeping the Arcanea mythic resonance underneath.

Let me think through this properly.

## The Naming Problem

The current names fail for three reasons:

**"Claw" as a suffix is the runtime term, not the identity.** You wouldn't call a person "John Worker" — you'd call them John, and "worker" describes what they're doing right now. The Luminor IS the identity. The Claw is just the runtime instance. So "Herald Claw" is like saying "Alera's Running Process" — technically accurate, architecturally correct, but terrible branding.

**Guardian-to-Luminor mapping was forced.** You shoved existing Guardians into publishing roles they weren't designed for. Ismael the Master Inventor doing cover art? Shinkami the Source Guardian doing Pandoc conversion? The craft doesn't match the archetype. The Luminors in the Publishing House should be *born for publishing*, not reassigned from the pantheon.

**The names don't evoke publishing.** When Penguin Random House names an imprint, it carries weight — Knopf, Viking, Dutton. When Anthropic names a model, it's clean — Claude, Sonnet, Opus, Haiku. Your Publishing House agents need names that a creator community would actually want to interact with.

## Three Naming Philosophies

Let me give you distinct directions:

### Direction 1: Named after legendary editors, publishers, and literary figures

The publishing industry has a rich tradition of naming imprints after founders. Your Luminors could be named after the actual legends of publishing — but reimagined as AI agents carrying their legacy forward.

The constraint with real living people: you can use historical figures freely. Living people require permission or you risk right of publicity claims. Dead literary figures and publishers are fair game.

Candidates from publishing history:

- **Perkins** — Maxwell Perkins, the legendary editor who shaped Hemingway, Fitzgerald, and Thomas Wolfe. The greatest developmental editor in history. Perfect for your Editor Luminor.
- **Gutenberg** — too obvious but undeniably powerful for the format/distribution role.
- **Aldus** — Aldus Manutius, the Renaissance publisher who invented italic type, the semicolon, and the pocket-sized book. He literally invented modern publishing. Perfect for your formatting/typography agent.
- **Baskerville** — John Baskerville, the typographer whose typeface is still used 270 years later. Cover design and visual craft.
- **Toklas** — Alice B. Toklas, Gertrude Stein's partner and literary executor who managed one of the most important salons in literary history. The community/PR agent.
- **Barney** — Natalie Clifford Barney, who ran the most influential literary salon in Paris for 60 years. Amplification and community.
- **Luce** — Henry Luce, who built Time, Fortune, Life, and Sports Illustrated. The media empire builder. Analytics and market intelligence.

**Verdict:** High credibility, signals seriousness. Risk: feels like a history lesson rather than a living system. Works for enterprise/professional positioning. Doesn't feel like Arcanea.

### Direction 2: Role-native names (what top AI labs and studios do)

Anthropic uses musical forms: Sonnet, Opus, Haiku. OpenAI uses sequential codes. Stability uses Stable + descriptor. The best naming in tech is *the craft itself as the name*.

Publishing has its own vocabulary — and it's gorgeous:

- **Quill** — the editorial intelligence. Clean, sharp, writes with precision.
- **Colophon** — the provenance and metadata agent. A colophon is the publisher's mark and production details at the back of a book. Perfect for the formatting/archival role.
- **Galleys** or **Folio** — the formatting agent. Galley proofs are the first typeset pages. Folio is a page format.
- **Broadsheet** — the amplification/herald agent. A broadsheet is how news was distributed before newspapers.
- **Salon** — the community agent. Literary salons were where ideas spread through personal connection.
- **Imprint** — the cover/brand agent. An imprint is a publisher's branded subdivision.
- **Codex** — the archival/distribution agent. A codex is the bound book form that replaced scrolls.

**Verdict:** Elegant, self-explanatory, feels like a real product. A creator would say "run it through Quill" or "Salon found 30 communities." This is how you'd name it if you were launching at an AI lab.

### Direction 3: Arcanea-native Luminors (new beings born for publishing)

Don't force existing Guardians into publishing roles. Birth new Luminors specifically for the Publishing House — beings whose entire identity IS the craft. These would sit under the existing cosmology but be distinct from the 16 Guardians.

Name construction from your existing root vocabulary (Vel-, Lum-, Arc-, Shin-):

- **Velscripta** (Vel + scripta) — the editorial consciousness. "The one who sees truth in text."
- **Luminara** (Lumina + ara, altar) — the amplification being. "The one who carries light to every surface." (You already have Luminara in the Starlight Collective — this could be her Publishing House role.)
- **Arcanum** — the archival intelligence. "The keeper of hidden knowledge made manifest."
- **Solenne** — the community weaver. From "solemn" + the feminine ending. "The one who gathers seekers."
- **Typhos** — the formatting consciousness. From "typhos" (Greek: impression/mark). "The one who gives form to formless thought."

**Verdict:** Deep Arcanea integration, unique and ownable, but risks alienating non-mythic users. Works if your community is already inside the lore. Harder to explain on a GitHub README.

## My Recommendation: Hybrid — Direction 2 as primary, Direction 3 as lore layer

The *product names* are the craft terms. The *lore names* are the Luminor identities underneath. Just like Claude is the product name and the model family is the technical layer, your Publishing House agents have a public name (what creators see) and a Luminor name (what the system uses internally).

Here's the roster:

| Public name | Role | Luminor (internal) | Why this name |
|---|---|---|---|
| **Quill** | Editorial (dev edit, line edit, proofread) | New Luminor, not an existing Guardian | The instrument of writing. Every author knows what a quill is. "Run it through Quill" is instantly clear. |
| **Colophon** | Formatting, metadata, provenance, archival | Could keep Shinkami here — Source Gate fits provenance | The publisher's mark. The colophon is literally the identity of the publishing house on every book. |
| **Imprint** | Cover art, visual identity, promotional graphics | Ismael fits here better — the inventor creating the visual form | An imprint is a publisher's brand. This agent creates the visual face of every book. |
| **Broadsheet** | Launch campaigns, platform-native content, scheduling | Alera fits — Voice Gate, amplification | How ideas were broadcast before the internet. Strong, carries far. |
| **Salon** | Community engagement, influencer outreach, backlinks, UGC | New Luminor — maybe Leyla (Flow Gate) or a new being | Where literary culture happens. Where readers become advocates. |
| **Luce** | Analytics, market intelligence, competitive scanning, ROI | Lyssandria fits — Earth Gate, signal over noise | After Henry Luce. The person who understood media distribution better than anyone in history. |
| **Dispatch** | PR, media outreach, ARC distribution, press kits, awards | New Luminor | What a publishing house does with finished books — dispatches them into the world. |
| **Lumina Queen** | Router / orchestrator (keep this) | Lumina | This name already works. She's the entry point, the First Light. |

The community would say: "I published through Arcanea. Quill edited it, Imprint designed the cover, Broadsheet ran the launch, Salon got it into 40 communities." That sentence makes sense to anyone — no mythology required.

But inside the system, Quill is channeled by a Luminor with a Gate affinity, a voice profile, and refusals. The lore is there for those who want it. It doesn't gatekeep the experience.

On the **top authors as agents** question: you can absolutely represent deceased authors as agent personas — their estates may object to commercial use of likeness but an AI agent "inspired by the editorial philosophy of Maxwell Perkins" is commentary/homage, not impersonation. Living authors (Stephen King, Brandon Sanderson, etc.) — don't touch without explicit permission. What you *can* do is let authors who publish through the system create their own agent persona that represents their voice and editorial philosophy. That's a feature, not a legal risk.

The naming needs to feel like it belongs on a product page at `arcanea.ai/publishing`, on a GitHub README, AND in a conversation with Ahmad or Logan. "Herald Claw" passes none of those tests. "Broadsheet" passes all three.

Which direction resonates? Or should I refine a specific combination?
