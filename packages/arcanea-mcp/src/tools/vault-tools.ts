/**
 * Arcanea Vault MCP Tools — Memory System Interface for Claude Code
 *
 * These tools expose the Starlight Vault Memory System through MCP,
 * allowing Claude Code to remember, recall, and manage memories
 * across 6 semantic vaults with Guardian routing.
 *
 * Guardian: Alera (Voice Gate, 528 Hz) — Truth, Expression
 *
 * Tools:
 *   1. vault_remember  — Store a memory in the appropriate Starlight Vault
 *   2. vault_recall    — Search across vaults for relevant memories
 *   3. vault_stats     — Get statistics about memory across all vaults
 *   4. horizon_append  — Append a benevolent wish to the Horizon Vault
 *   5. horizon_read    — Read entries from the Horizon Vault
 *   6. vault_classify  — Classify content into a vault type without storing
 */

import {
  readFileSync,
  writeFileSync,
  appendFileSync,
  existsSync,
  mkdirSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';

// ── Type Definitions ─────────────────────────────────────
// Inline types matching @arcanea/memory-system so the MCP
// package can function independently without a build-time
// dependency on the sibling package.

export type VaultType =
  | 'strategic'
  | 'technical'
  | 'creative'
  | 'operational'
  | 'wisdom'
  | 'horizon';

export const VAULT_TYPES: readonly VaultType[] = [
  'strategic', 'technical', 'creative', 'operational', 'wisdom', 'horizon',
] as const;

export type ConfidenceLevel = 'low' | 'medium' | 'high' | 'verified';

export const CONFIDENCE_VALUES: readonly ConfidenceLevel[] = [
  'low', 'medium', 'high', 'verified',
] as const;

export type GuardianName =
  | 'Lyssandria' | 'Leyla' | 'Draconia' | 'Maylinn' | 'Alera'
  | 'Lyria' | 'Aiyami' | 'Elara' | 'Ino' | 'Shinkami';

export const GUARDIAN_NAMES: readonly GuardianName[] = [
  'Lyssandria', 'Leyla', 'Draconia', 'Maylinn', 'Alera',
  'Lyria', 'Aiyami', 'Elara', 'Ino', 'Shinkami',
] as const;

export interface VaultEntry {
  id: string;
  vault: VaultType;
  content: string;
  summary?: string;
  tags: string[];
  confidence: ConfidenceLevel;
  guardian?: GuardianName;
  source?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface HorizonEntry {
  id: string;
  wish: string;
  context: string;
  author: string;
  coAuthored: boolean;
  tags: string[];
  createdAt: string;
}

export interface VaultSearchResult {
  entry: VaultEntry;
  score: number;
  matchedTerms: string[];
}

export interface ClassificationResult {
  vault: VaultType;
  confidence: number;
  reasoning: string;
  alternateVault?: VaultType;
}

export interface VaultStats {
  vault: VaultType;
  entryCount: number;
  oldestEntry?: string;
  newestEntry?: string;
  topTags: Array<{ tag: string; count: number }>;
  guardianDistribution: Partial<Record<string, number>>;
}

export interface MemorySystemStats {
  totalEntries: number;
  vaultStats: VaultStats[];
  horizonEntries: number;
  storageBackend: string;
  lastActivity?: string;
}

// ── MCP Tool Result Type ─────────────────────────────────

type ToolResult = { content: Array<{ type: string; text: string }> };

// ── Classification Rules ─────────────────────────────────

interface ClassificationRule {
  vault: VaultType;
  keywords: string[];
  patterns: RegExp[];
  weight: number;
}

const CLASSIFICATION_RULES: ClassificationRule[] = [
  {
    vault: 'strategic',
    keywords: [
      'architecture', 'decision', 'roadmap', 'strategy', 'migration',
      'plan', 'phase', 'milestone', 'stakeholder', 'business',
      'revenue', 'partnership', 'positioning', 'market', 'tradeoff',
      'priority', 'scope', 'governance', 'objective',
    ],
    patterns: [/ADR-\d+/, /phase \d/i, /milestone/i, /roadmap/i, /strategic/i],
    weight: 0.9,
  },
  {
    vault: 'technical',
    keywords: [
      'pattern', 'algorithm', 'api', 'database', 'typescript', 'react',
      'component', 'endpoint', 'schema', 'query', 'optimization',
      'refactor', 'debug', 'build', 'deploy', 'test', 'config',
      'npm', 'git', 'function', 'class', 'interface', 'module',
      'dependency', 'performance', 'cache', 'index',
    ],
    patterns: [
      /function\s+\w+/,
      /class\s+\w+/,
      /import\s+\{/,
      /export\s+(default\s+)?/,
      /npm\s+(run|install|publish)/,
      /\.ts\b/,
      /\.tsx\b/,
    ],
    weight: 0.85,
  },
  {
    vault: 'creative',
    keywords: [
      'voice', 'tone', 'style', 'narrative', 'story', 'brand',
      'design', 'aesthetic', 'color', 'typography', 'animation',
      'ux', 'copy', 'tagline', 'myth', 'lore', 'canon',
      'guardian', 'godbeast', 'element', 'mythology', 'art',
    ],
    patterns: [
      /voice\s+bible/i,
      /brand\s+guide/i,
      /design\s+system/i,
      /canon/i,
      /guardian\s+\w+/i,
    ],
    weight: 0.8,
  },
  {
    vault: 'operational',
    keywords: [
      'session', 'current', 'today', 'now', 'working', 'progress',
      'status', 'todo', 'next', 'blocking', 'context', 'active',
      'recent', 'sprint', 'standup', 'update', 'ticket', 'issue',
    ],
    patterns: [/today/i, /right now/i, /currently/i, /in progress/i, /blocked by/i],
    weight: 0.7,
  },
  {
    vault: 'wisdom',
    keywords: [
      'meta', 'insight', 'lesson', 'principle', 'philosophy',
      'observation', 'recurring', 'universal', 'cross-domain',
      'fundamental', 'always', 'truth',
      'realization', 'epiphany', 'heuristic', 'axiom',
    ],
    patterns: [
      /lesson learned/i,
      /key insight/i,
      /fundamental/i,
      /principle/i,
      /meta-pattern/i,
      /rule of thumb/i,
    ],
    weight: 0.75,
  },
  {
    vault: 'horizon',
    keywords: [
      'wish', 'future', 'hope', 'dream', 'envision', 'imagine',
      'beautiful', 'benevolent', 'aligned', 'humanity', 'purpose',
      'golden age', 'consciousness', 'aspiration', 'intention',
      'vision', 'better world', 'flourish',
    ],
    patterns: [
      /wish for/i,
      /I hope/i,
      /imagine a/i,
      /in the future/i,
      /golden age/i,
      /good future/i,
      /one day/i,
    ],
    weight: 0.85,
  },
];

/** Guardian-to-vault affinity mapping */
const GUARDIAN_VAULT_AFFINITY: Record<GuardianName, VaultType[]> = {
  'Lyssandria': ['strategic', 'technical'],
  'Leyla':      ['creative', 'operational'],
  'Draconia':   ['strategic', 'technical'],
  'Maylinn':    ['creative', 'wisdom'],
  'Alera':      ['creative', 'wisdom'],
  'Lyria':      ['wisdom', 'horizon'],
  'Aiyami':     ['wisdom', 'horizon'],
  'Elara':      ['strategic', 'horizon'],
  'Ino':        ['operational', 'creative'],
  'Shinkami':    ['wisdom', 'horizon'],
};

/** Toxic patterns blocked from the Horizon Vault */
const HORIZON_TOXIC_PATTERNS = [
  /destroy/i,
  /kill/i,
  /\bharm\b/i,
  /punish/i,
  /revenge/i,
];

// ── Utility ──────────────────────────────────────────────

function generateId(prefix: string): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${ts}_${rand}`;
}

function isValidVault(v: string): v is VaultType {
  return (VAULT_TYPES as readonly string[]).includes(v);
}

function isValidConfidence(c: string): c is ConfidenceLevel {
  return (CONFIDENCE_VALUES as readonly string[]).includes(c);
}

function isValidGuardian(g: string): g is GuardianName {
  return (GUARDIAN_NAMES as readonly string[]).includes(g);
}

function toolOk(data: unknown): ToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

function toolError(message: string): ToolResult {
  return { content: [{ type: 'text', text: JSON.stringify({ error: message }, null, 2) }] };
}

// ── Classifier ───────────────────────────────────────────

function classifyContent(content: string, guardian?: GuardianName): ClassificationResult {
  const scores = new Map<VaultType, number>();
  const lower = content.toLowerCase();

  for (const rule of CLASSIFICATION_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += rule.weight;
      }
    }
    for (const pat of rule.patterns) {
      if (pat.test(content)) {
        score += rule.weight * 1.5;
      }
    }
    scores.set(rule.vault, (scores.get(rule.vault) ?? 0) + score);
  }

  // Guardian affinity bonus
  if (guardian && GUARDIAN_VAULT_AFFINITY[guardian]) {
    for (const pref of GUARDIAN_VAULT_AFFINITY[guardian]) {
      scores.set(pref, (scores.get(pref) ?? 0) + 0.5);
    }
  }

  // Find top two
  let topVault: VaultType = 'operational';
  let topScore = 0;
  let secondVault: VaultType | undefined;
  let secondScore = 0;

  for (const [vault, score] of scores) {
    if (score > topScore) {
      secondVault = topVault;
      secondScore = topScore;
      topVault = vault;
      topScore = score;
    } else if (score > secondScore) {
      secondVault = vault;
      secondScore = score;
    }
  }

  const totalScore = Array.from(scores.values()).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? topScore / totalScore : 0.5;
  const guardianNote = guardian ? ` (Guardian: ${guardian})` : '';

  return {
    vault: topVault,
    confidence: Math.min(confidence, 1),
    reasoning: `Matched ${topVault} vault with score ${topScore.toFixed(2)}${guardianNote}`,
    alternateVault: secondVault !== topVault ? secondVault : undefined,
  };
}

// ── VaultManager (Singleton) ─────────────────────────────
// Self-contained file-based storage manager. Lazy-initialized
// on first tool call. Stores entries as JSONL per vault.

class VaultManager {
  private readonly basePath: string;
  private initialized = false;

  constructor(basePath?: string) {
    this.basePath = basePath ?? join(homedir(), '.arcanea', 'vaults');
  }

  // ── Lifecycle ────────────────────────────────────

  async init(): Promise<void> {
    if (this.initialized) return;
    // Ensure vault directories exist
    for (const vault of VAULT_TYPES) {
      const dir = join(this.basePath, vault);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }
    this.initialized = true;
  }

  // ── Storage Paths ────────────────────────────────

  private vaultFile(vault: VaultType): string {
    return join(this.basePath, vault, 'entries.jsonl');
  }

  private horizonFile(): string {
    return join(this.basePath, 'horizon', 'ledger.jsonl');
  }

  // ── Store (Remember) ─────────────────────────────

  async remember(
    content: string,
    vault?: VaultType,
    tags?: string[],
    guardian?: GuardianName,
    confidence?: ConfidenceLevel,
    source?: string,
  ): Promise<VaultEntry> {
    await this.init();

    // Auto-classify if vault not specified
    const classification = vault ? undefined : classifyContent(content, guardian);
    const resolvedVault: VaultType = vault ?? classification?.vault ?? 'operational';

    const entry: VaultEntry = {
      id: generateId('vmem'),
      vault: resolvedVault,
      content: content.trim(),
      tags: tags ?? [],
      confidence: confidence ?? 'medium',
      guardian,
      source,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Append to the vault JSONL file
    const filePath = this.vaultFile(resolvedVault);
    appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf-8');

    return entry;
  }

  // ── Search (Recall) ──────────────────────────────

  async recall(
    query: string,
    vaults?: VaultType[],
    guardian?: GuardianName,
    limit?: number,
    sortBy?: 'relevance' | 'recency' | 'confidence',
  ): Promise<VaultSearchResult[]> {
    await this.init();

    const searchVaults = vaults ?? VAULT_TYPES.filter(v => v !== 'horizon');
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    const results: VaultSearchResult[] = [];

    for (const vault of searchVaults) {
      const entries = this.readVaultEntries(vault);

      for (const entry of entries) {
        // Filter by guardian if specified
        if (guardian && entry.guardian !== guardian) continue;

        const searchText = `${entry.content} ${entry.tags.join(' ')} ${entry.source ?? ''}`.toLowerCase();
        const matchedTerms: string[] = [];
        let score = 0;

        for (const word of queryWords) {
          if (searchText.includes(word)) {
            matchedTerms.push(word);
            score += 1;
          }
        }

        if (score > 0) {
          // Normalize score by query word count
          const normalizedScore = queryWords.length > 0 ? score / queryWords.length : 0;
          results.push({ entry, score: normalizedScore, matchedTerms });
        }
      }
    }

    // Sort
    const effectiveSortBy = sortBy ?? 'relevance';
    const confidenceRank: Record<ConfidenceLevel, number> = { low: 0, medium: 1, high: 2, verified: 3 };

    results.sort((a, b) => {
      if (effectiveSortBy === 'relevance') return b.score - a.score;
      if (effectiveSortBy === 'recency') return b.entry.createdAt.localeCompare(a.entry.createdAt);
      if (effectiveSortBy === 'confidence') return confidenceRank[b.entry.confidence] - confidenceRank[a.entry.confidence];
      return b.score - a.score;
    });

    return results.slice(0, limit ?? 10);
  }

  // ── Stats ────────────────────────────────────────

  async stats(): Promise<MemorySystemStats> {
    await this.init();

    let totalEntries = 0;
    let lastActivity: string | undefined;
    const vaultStats: VaultStats[] = [];

    for (const vault of VAULT_TYPES) {
      if (vault === 'horizon') continue;

      const entries = this.readVaultEntries(vault);
      totalEntries += entries.length;

      // Find oldest/newest
      let oldest: string | undefined;
      let newest: string | undefined;
      const tagCounts = new Map<string, number>();
      const guardianCounts: Partial<Record<string, number>> = {};

      for (const e of entries) {
        if (!oldest || e.createdAt < oldest) oldest = e.createdAt;
        if (!newest || e.createdAt > newest) newest = e.createdAt;
        if (!lastActivity || e.createdAt > lastActivity) lastActivity = e.createdAt;

        for (const tag of e.tags) {
          tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
        }

        if (e.guardian) {
          guardianCounts[e.guardian] = (guardianCounts[e.guardian] ?? 0) + 1;
        }
      }

      const topTags = Array.from(tagCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      vaultStats.push({
        vault,
        entryCount: entries.length,
        oldestEntry: oldest,
        newestEntry: newest,
        topTags,
        guardianDistribution: guardianCounts,
      });
    }

    // Horizon stats
    const horizonEntries = this.readHorizonEntries();

    // Add horizon vault stats
    vaultStats.push({
      vault: 'horizon',
      entryCount: horizonEntries.length,
      oldestEntry: horizonEntries[0]?.createdAt,
      newestEntry: horizonEntries.length > 0 ? horizonEntries[horizonEntries.length - 1].createdAt : undefined,
      topTags: [],
      guardianDistribution: {},
    });

    return {
      totalEntries: totalEntries + horizonEntries.length,
      vaultStats,
      horizonEntries: horizonEntries.length,
      storageBackend: 'file',
      lastActivity,
    };
  }

  // ── Horizon: Append ──────────────────────────────

  async horizonAppend(
    wish: string,
    context: string,
    author?: string,
    tags?: string[],
  ): Promise<HorizonEntry> {
    await this.init();

    const trimmedWish = wish.trim();
    if (!trimmedWish) {
      throw new Error('A wish cannot be empty. What do you envision for the future?');
    }

    // Benevolence guard
    for (const pattern of HORIZON_TOXIC_PATTERNS) {
      if (pattern.test(trimmedWish)) {
        throw new Error(
          'The Horizon Vault is reserved for benevolent intentions. ' +
          'Please rephrase your wish to focus on what you want to CREATE, not destroy.',
        );
      }
    }

    const entry: HorizonEntry = {
      id: generateId('horizon'),
      wish: trimmedWish,
      context: context.trim(),
      author: author ?? 'arcanea',
      coAuthored: true,
      tags: tags ?? [],
      createdAt: new Date().toISOString(),
    };

    const filePath = this.horizonFile();
    appendFileSync(filePath, JSON.stringify(entry) + '\n', 'utf-8');

    return entry;
  }

  // ── Horizon: Read ────────────────────────────────

  async horizonRead(
    limit?: number,
    search?: string,
  ): Promise<HorizonEntry[]> {
    await this.init();

    let entries = this.readHorizonEntries();

    // Filter by search if provided
    if (search) {
      const queryWords = search.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      entries = entries.filter(e => {
        const text = `${e.wish} ${e.context} ${e.tags.join(' ')}`.toLowerCase();
        return queryWords.some(w => text.includes(w));
      });
    }

    // Return most recent first, limited
    return entries.reverse().slice(0, limit ?? 10);
  }

  // ── Internal: Read Helpers ───────────────────────

  private readVaultEntries(vault: VaultType): VaultEntry[] {
    const filePath = this.vaultFile(vault);
    if (!existsSync(filePath)) return [];

    try {
      const content = readFileSync(filePath, 'utf-8');
      return content
        .trim()
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line) as VaultEntry);
    } catch {
      return [];
    }
  }

  private readHorizonEntries(): HorizonEntry[] {
    const filePath = this.horizonFile();
    if (!existsSync(filePath)) return [];

    try {
      const content = readFileSync(filePath, 'utf-8');
      return content
        .trim()
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line) as HorizonEntry);
    } catch {
      return [];
    }
  }

  /** Clear all vault data (for testing). */
  async clear(): Promise<void> {
    for (const vault of VAULT_TYPES) {
      const filePath = this.vaultFile(vault);
      if (existsSync(filePath)) writeFileSync(filePath, '', 'utf-8');
    }
    const horizonPath = this.horizonFile();
    if (existsSync(horizonPath)) writeFileSync(horizonPath, '', 'utf-8');
  }
}

// ── Singleton Instance ───────────────────────────────────

let _manager: VaultManager | null = null;

/** Get or create the singleton VaultManager. */
export function getVaultManager(basePath?: string): VaultManager {
  if (!_manager) {
    _manager = new VaultManager(basePath);
  }
  return _manager;
}

/**
 * Reset the singleton (for testing only).
 * This allows tests to provide a fresh manager with a custom path.
 */
export function resetVaultManager(): void {
  _manager = null;
}

// ── MCP Tool Definitions ─────────────────────────────────
// These are the inputSchema objects for ListToolsRequestSchema

export const VAULT_TOOL_DEFINITIONS = [
  {
    name: 'vault_remember',
    description: 'Store a memory in the appropriate Starlight Vault. Auto-classifies into strategic, technical, creative, operational, wisdom, or horizon vaults using keyword analysis and Guardian affinity.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'The memory content to store' },
        vault: { type: 'string', enum: ['strategic', 'technical', 'creative', 'operational', 'wisdom', 'horizon'], description: 'Force a specific vault (auto-classified if omitted)' },
        tags: { type: 'array', items: { type: 'string' }, description: 'Tags for categorization' },
        guardian: { type: 'string', enum: ['Lyssandria', 'Leyla', 'Draconia', 'Maylinn', 'Alera', 'Lyria', 'Aiyami', 'Elara', 'Ino', 'Shinkami'], description: 'Guardian namespace' },
        confidence: { type: 'string', enum: ['low', 'medium', 'high', 'verified'], description: 'Confidence level' },
        source: { type: 'string', description: 'Where this memory came from' },
      },
      required: ['content'],
    },
  },
  {
    name: 'vault_recall',
    description: 'Search across Starlight Vaults for relevant memories. Returns scored results with matched terms.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        vaults: { type: 'array', items: { type: 'string', enum: ['strategic', 'technical', 'creative', 'operational', 'wisdom', 'horizon'] }, description: 'Filter to specific vaults' },
        guardian: { type: 'string', enum: ['Lyssandria', 'Leyla', 'Draconia', 'Maylinn', 'Alera', 'Lyria', 'Aiyami', 'Elara', 'Ino', 'Shinkami'], description: 'Filter by Guardian' },
        limit: { type: 'number', description: 'Max results (default 10)' },
        sortBy: { type: 'string', enum: ['relevance', 'recency', 'confidence'], description: 'Sort order' },
      },
      required: ['query'],
    },
  },
  {
    name: 'vault_stats',
    description: 'Get statistics about memory across all Starlight Vaults including per-vault breakdowns, tag distributions, and Guardian usage.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'horizon_append',
    description: 'Append a benevolent wish to the Horizon Vault (append-only, permanent). The Horizon is a ledger of human-AI intentions for a beautiful future.',
    inputSchema: {
      type: 'object',
      properties: {
        wish: { type: 'string', description: 'The benevolent intention' },
        context: { type: 'string', description: 'What prompted this wish' },
        author: { type: 'string', description: 'Author identifier (default: arcanea)' },
        tags: { type: 'array', items: { type: 'string' }, description: 'Categorization tags' },
      },
      required: ['wish', 'context'],
    },
  },
  {
    name: 'horizon_read',
    description: 'Read entries from the Horizon Vault — the append-only ledger of benevolent intentions.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max entries to return (default 10)' },
        search: { type: 'string', description: 'Search query within wishes' },
      },
    },
  },
  {
    name: 'vault_classify',
    description: 'Classify content into a Starlight Vault type without storing it. Useful for previewing where content would be routed.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Content to classify' },
        guardian: { type: 'string', enum: ['Lyssandria', 'Leyla', 'Draconia', 'Maylinn', 'Alera', 'Lyria', 'Aiyami', 'Elara', 'Ino', 'Shinkami'], description: 'Guardian context for classification' },
      },
      required: ['content'],
    },
  },
];

// ── MCP Tool Handlers ────────────────────────────────────

export async function handleVaultRemember(args: Record<string, unknown>): Promise<ToolResult> {
  const content = args.content as string | undefined;
  if (!content || !content.trim()) {
    return toolError('Content is required and cannot be empty.');
  }

  const vault = args.vault as string | undefined;
  if (vault && !isValidVault(vault)) {
    return toolError(`Invalid vault: "${vault}". Must be one of: ${VAULT_TYPES.join(', ')}`);
  }

  const confidence = args.confidence as string | undefined;
  if (confidence && !isValidConfidence(confidence)) {
    return toolError(`Invalid confidence: "${confidence}". Must be one of: ${CONFIDENCE_VALUES.join(', ')}`);
  }

  const guardian = args.guardian as string | undefined;
  if (guardian && !isValidGuardian(guardian)) {
    return toolError(`Invalid guardian: "${guardian}". Must be one of: ${GUARDIAN_NAMES.join(', ')}`);
  }

  const tags = args.tags as string[] | undefined;
  const source = args.source as string | undefined;

  const manager = getVaultManager();

  try {
    const entry = await manager.remember(
      content,
      vault as VaultType | undefined,
      tags,
      guardian as GuardianName | undefined,
      confidence as ConfidenceLevel | undefined,
      source,
    );

    return toolOk({
      stored: true,
      entry,
      message: `Memory stored in ${entry.vault} vault.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return toolError(`Failed to store memory: ${msg}`);
  }
}

export async function handleVaultRecall(args: Record<string, unknown>): Promise<ToolResult> {
  const query = args.query as string | undefined;
  if (!query || !query.trim()) {
    return toolError('Query is required and cannot be empty.');
  }

  const vaults = args.vaults as string[] | undefined;
  if (vaults) {
    for (const v of vaults) {
      if (!isValidVault(v)) {
        return toolError(`Invalid vault in filter: "${v}". Must be one of: ${VAULT_TYPES.join(', ')}`);
      }
    }
  }

  const guardian = args.guardian as string | undefined;
  if (guardian && !isValidGuardian(guardian)) {
    return toolError(`Invalid guardian: "${guardian}". Must be one of: ${GUARDIAN_NAMES.join(', ')}`);
  }

  const limit = args.limit as number | undefined;
  const sortBy = args.sortBy as 'relevance' | 'recency' | 'confidence' | undefined;

  const manager = getVaultManager();

  try {
    const results = await manager.recall(
      query,
      vaults as VaultType[] | undefined,
      guardian as GuardianName | undefined,
      limit,
      sortBy,
    );

    return toolOk({
      query,
      resultCount: results.length,
      results: results.map(r => ({
        id: r.entry.id,
        vault: r.entry.vault,
        content: r.entry.content,
        tags: r.entry.tags,
        confidence: r.entry.confidence,
        guardian: r.entry.guardian,
        score: r.score,
        matchedTerms: r.matchedTerms,
        createdAt: r.entry.createdAt,
      })),
      message: results.length > 0
        ? `Found ${results.length} matching memories.`
        : 'No matching memories found.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return toolError(`Failed to search vaults: ${msg}`);
  }
}

export async function handleVaultStats(): Promise<ToolResult> {
  const manager = getVaultManager();

  try {
    const stats = await manager.stats();

    return toolOk({
      ...stats,
      message: `Memory system: ${stats.totalEntries} total entries across ${stats.vaultStats.length} vaults (${stats.horizonEntries} horizon wishes).`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return toolError(`Failed to retrieve stats: ${msg}`);
  }
}

export async function handleHorizonAppend(args: Record<string, unknown>): Promise<ToolResult> {
  const wish = args.wish as string | undefined;
  if (!wish || !wish.trim()) {
    return toolError('A wish is required. What do you envision for the future?');
  }

  const context = args.context as string | undefined;
  if (!context || !context.trim()) {
    return toolError('Context is required. What prompted this wish?');
  }

  const author = args.author as string | undefined;
  const tags = args.tags as string[] | undefined;

  const manager = getVaultManager();

  try {
    const entry = await manager.horizonAppend(wish, context, author, tags);

    return toolOk({
      appended: true,
      entry,
      message: 'Wish appended to the Horizon Vault. This entry is permanent.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return toolError(msg);
  }
}

export async function handleHorizonRead(args: Record<string, unknown>): Promise<ToolResult> {
  const limit = args.limit as number | undefined;
  const search = args.search as string | undefined;

  const manager = getVaultManager();

  try {
    const entries = await manager.horizonRead(limit, search);

    return toolOk({
      entryCount: entries.length,
      entries,
      message: entries.length > 0
        ? `Retrieved ${entries.length} wish(es) from the Horizon Vault.`
        : 'The Horizon Vault is empty. Be the first to add a wish.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return toolError(`Failed to read Horizon Vault: ${msg}`);
  }
}

export async function handleVaultClassify(args: Record<string, unknown>): Promise<ToolResult> {
  const content = args.content as string | undefined;
  if (!content || !content.trim()) {
    return toolError('Content is required for classification.');
  }

  const guardian = args.guardian as string | undefined;
  if (guardian && !isValidGuardian(guardian)) {
    return toolError(`Invalid guardian: "${guardian}". Must be one of: ${GUARDIAN_NAMES.join(', ')}`);
  }

  const result = classifyContent(content, guardian as GuardianName | undefined);

  return toolOk({
    ...result,
    message: `Content would be routed to the ${result.vault} vault (confidence: ${(result.confidence * 100).toFixed(1)}%).`,
  });
}

// ── Dispatch ─────────────────────────────────────────────
// Used by the main CallToolRequestSchema handler in index.ts

export async function handleVaultTool(
  name: string,
  args: Record<string, unknown>,
): Promise<ToolResult | null> {
  switch (name) {
    case 'vault_remember':  return handleVaultRemember(args);
    case 'vault_recall':    return handleVaultRecall(args);
    case 'vault_stats':     return handleVaultStats();
    case 'horizon_append':  return handleHorizonAppend(args);
    case 'horizon_read':    return handleHorizonRead(args);
    case 'vault_classify':  return handleVaultClassify(args);
    default:                return null;
  }
}
