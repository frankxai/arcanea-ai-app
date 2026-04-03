#!/usr/bin/env node
/**
 * @arcanea/memory-mcp — Starlight Vaults MCP Server
 *
 * Exposes 6 semantic memory vaults to any MCP-compatible AI tool via
 * the MCP SDK 1.29 stdio transport.
 *
 * Add to Claude Code:
 *   claude mcp add arcanea-memory npx @arcanea/memory-mcp
 *
 * Add to Cursor / Cline / Windsurf — mcp.json:
 *   { "arcanea-memory": { "command": "npx", "args": ["@arcanea/memory-mcp"] } }
 *
 * Tools provided:
 *   vault_remember   — Store a memory (auto-classified or explicit vault)
 *   vault_recall     — Search across vaults
 *   vault_recent     — Get recent memories
 *   vault_stats      — Memory system statistics
 *   horizon_append   — Add to the Horizon Vault (permanent)
 *   horizon_read     — Read Horizon wishes
 *   vault_classify   — Classify content without storing
 *   memory_sync      — Sync vaults to MEMORY.md
 *
 * Environment:
 *   STARLIGHT_PATH   — Override vault storage directory
 *                      Default: {cwd}/.arcanea/memory
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { join } from 'node:path';
import {
  StarlightVaults,
  MemoryBridge,
} from '@arcanea/memory-system';
import type {
  VaultType,
  GuardianName,
  VaultEntry,
  VaultSearchResult,
  HorizonEntry,
  MemorySystemStats,
  ClassificationResult,
  SyncResult,
} from '@arcanea/memory-system';

// ── Vault Shortcut Map ───────────────────────────────────────────────────────

type VaultShortcutKey = Exclude<VaultType, 'horizon'>;

type VaultShortcutMethod = (
  content: string,
  tags?: string[],
) => Promise<VaultEntry>;

// ── Server State ─────────────────────────────────────────────────────────────

let vaults: StarlightVaults | null = null;

async function getVaults(): Promise<StarlightVaults> {
  if (!vaults) {
    const storagePath =
      process.env['STARLIGHT_PATH'] ??
      join(process.cwd(), '.arcanea', 'memory');
    vaults = await StarlightVaults.create({ storagePath });
  }
  return vaults;
}

// ── Tool Handlers ─────────────────────────────────────────────────────────────

interface VaultRememberArgs {
  content: string;
  vault?: VaultType;
  guardian?: GuardianName;
  tags?: string[];
}

interface VaultRecallArgs {
  query: string;
  vault?: VaultType;
  guardian?: GuardianName;
  limit?: number;
}

interface VaultRecentArgs {
  vault?: VaultType;
  limit?: number;
}

interface HorizonAppendArgs {
  wish: string;
  context: string;
  tags?: string[];
}

interface HorizonReadArgs {
  limit?: number;
  search?: string;
}

interface VaultClassifyArgs {
  content: string;
  guardian?: GuardianName;
}

async function handleVaultRemember(args: VaultRememberArgs): Promise<unknown> {
  const v = await getVaults();
  const { content, vault, guardian, tags } = args;

  const instance = guardian ? v.as(guardian) : v;

  let entry: VaultEntry;

  if (!vault) {
    // Auto-classify
    entry = await instance.remember(content, tags);
  } else if (vault === 'horizon') {
    // Horizon via the append-only ledger
    const wish = content;
    const context = tags?.[0] ?? 'stored via vault_remember';
    const horizonEntry = await instance.horizon.append(wish, context, tags);
    return {
      id: horizonEntry.id,
      vault: 'horizon',
      guardian: guardian ?? null,
      tags: horizonEntry.tags,
      createdAt: horizonEntry.createdAt,
      preview: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
      message: 'Permanently appended to the Horizon Vault.',
    };
  } else {
    // Explicit non-horizon vault — call the shortcut method
    const shortcuts: Record<VaultShortcutKey, VaultShortcutMethod> = {
      strategic:   (c, t) => instance.strategic(c, t),
      technical:   (c, t) => instance.technical(c, t),
      creative:    (c, t) => instance.creative(c, t),
      operational: (c, t) => instance.operational(c, t),
      wisdom:      (c, t) => instance.wisdom(c, t),
    };
    entry = await shortcuts[vault as VaultShortcutKey](content, tags);
  }

  return {
    id: entry.id,
    vault: entry.vault,
    guardian: entry.guardian ?? null,
    tags: entry.tags,
    createdAt: entry.createdAt,
    preview: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
    message: `Stored in ${entry.vault} vault${guardian ? ` (${guardian})` : ''}`,
  };
}

async function handleVaultRecall(args: VaultRecallArgs): Promise<unknown> {
  const v = await getVaults();
  const { query, vault, guardian, limit = 10 } = args;

  const results: VaultSearchResult[] = await v.recall(query, {
    vault,
    guardian: guardian as GuardianName | undefined,
    limit,
  });

  return results.map((r) => ({
    id: r.entry.id,
    vault: r.entry.vault,
    guardian: r.entry.guardian ?? null,
    score: Math.round(r.score * 100) / 100,
    content:
      r.entry.content.slice(0, 200) +
      (r.entry.content.length > 200 ? '...' : ''),
    tags: r.entry.tags,
    createdAt: r.entry.createdAt,
  }));
}

async function handleVaultRecent(args: VaultRecentArgs): Promise<unknown> {
  const v = await getVaults();
  const { vault, limit = 10 } = args;

  const entries: VaultEntry[] = await v.recent(vault, limit);

  return entries.map((e) => ({
    id: e.id,
    vault: e.vault,
    guardian: e.guardian ?? null,
    content: e.content.slice(0, 150) + (e.content.length > 150 ? '...' : ''),
    tags: e.tags,
    createdAt: e.createdAt,
  }));
}

async function handleVaultStats(): Promise<MemorySystemStats> {
  const v = await getVaults();
  return v.stats();
}

async function handleHorizonAppend(args: HorizonAppendArgs): Promise<unknown> {
  const v = await getVaults();
  const { wish, context, tags } = args;

  const entry: HorizonEntry = await v.horizon.append(wish, context, tags);

  return {
    id: entry.id,
    wish: entry.wish,
    createdAt: entry.createdAt,
    totalWishes: v.horizon.count(),
    message:
      'Permanently appended to the Horizon Vault. This wish cannot be deleted.',
  };
}

async function handleHorizonRead(args: HorizonReadArgs): Promise<unknown> {
  const v = await getVaults();
  const { limit = 10, search } = args;

  const entries: HorizonEntry[] = search
    ? await v.horizon.search(search, limit)
    : await v.horizon.recent(limit);

  return {
    wishes: entries,
    total: v.horizon.count(),
  };
}

async function handleVaultClassify(
  args: VaultClassifyArgs,
): Promise<ClassificationResult> {
  const v = await getVaults();
  const { content, guardian } = args;

  const instance = guardian ? v.as(guardian as GuardianName) : v;
  return instance.classify(content);
}

async function handleMemorySync(): Promise<SyncResult> {
  const storagePath =
    process.env['STARLIGHT_PATH'] ?? join(process.cwd(), '.arcanea', 'memory');
  const bridge = new MemoryBridge({ vaultStoragePath: storagePath });
  return bridge.sync();
}

// ── Shared Zod Enums ─────────────────────────────────────────────────────────

const VAULT_ENUM = z.enum([
  'strategic',
  'technical',
  'creative',
  'operational',
  'wisdom',
  'horizon',
]);

const GUARDIAN_ENUM = z.enum([
  'Lyssandria',
  'Leyla',
  'Draconia',
  'Maylinn',
  'Alera',
  'Lyria',
  'Aiyami',
  'Elara',
  'Ino',
  'Shinkami',
]);

// ── Helper: serialize result to MCP text content ──────────────────────────────

function toTextContent(value: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
  };
}

// ── MCP Server ────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'arcanea-memory',
  version: '0.1.0',
});

// vault_remember
server.registerTool(
  'vault_remember',
  {
    description:
      'Store a memory in Starlight Vaults. Auto-classifies into the right vault ' +
      '(strategic, technical, creative, operational, wisdom, horizon) unless vault ' +
      'is specified. Optionally tag a Guardian namespace for domain routing.',
    inputSchema: {
      content: z.string().describe('The memory content to store'),
      vault: VAULT_ENUM.optional().describe(
        'Force a specific vault (optional — omit for auto-classification)',
      ),
      guardian: GUARDIAN_ENUM.optional().describe(
        'Guardian namespace for domain routing (optional)',
      ),
      tags: z
        .array(z.string())
        .optional()
        .describe('Tags for categorization (optional)'),
    },
  },
  async (args) => {
    const result = await handleVaultRemember(args as VaultRememberArgs);
    return toTextContent(result);
  },
);

// vault_recall
server.registerTool(
  'vault_recall',
  {
    description:
      'Search across Starlight Vaults for relevant memories. Returns scored results ' +
      'ranked by relevance. Optionally filter to a specific vault or Guardian.',
    inputSchema: {
      query: z.string().describe('Search query'),
      vault: VAULT_ENUM.optional().describe(
        'Filter to specific vault (optional)',
      ),
      guardian: z
        .string()
        .optional()
        .describe('Filter by Guardian namespace (optional)'),
      limit: z
        .number()
        .optional()
        .describe('Max results to return (default: 10)'),
    },
  },
  async (args) => {
    const result = await handleVaultRecall(args as VaultRecallArgs);
    return toTextContent(result);
  },
);

// vault_recent
server.registerTool(
  'vault_recent',
  {
    description:
      'Get the most recent memories from a specific vault or all vaults combined.',
    inputSchema: {
      vault: VAULT_ENUM.optional().describe(
        'Filter to specific vault (optional)',
      ),
      limit: z
        .number()
        .optional()
        .describe('Max results to return (default: 10)'),
    },
  },
  async (args) => {
    const result = await handleVaultRecent(args as VaultRecentArgs);
    return toTextContent(result);
  },
);

// vault_stats
server.registerTool(
  'vault_stats',
  {
    description:
      'Get statistics about the Starlight Vault memory system — entry counts per ' +
      'vault, top tags, Guardian distribution, and last activity.',
    inputSchema: {},
  },
  async () => {
    const result = await handleVaultStats();
    return toTextContent(result);
  },
);

// horizon_append
server.registerTool(
  'horizon_append',
  {
    description:
      'Append a benevolent wish or intention to the Horizon Vault. ' +
      'This is PERMANENT — Horizon entries cannot be deleted. ' +
      'Use for recording constructive visions, AI alignment intentions, or ' +
      'creative aspirations. Destructive intentions are not accepted.',
    inputSchema: {
      wish: z
        .string()
        .describe(
          'The benevolent intention or wish (must be constructive, not destructive)',
        ),
      context: z.string().describe('What prompted this wish'),
      tags: z
        .array(z.string())
        .optional()
        .describe('Categorization tags (optional)'),
    },
  },
  async (args) => {
    const result = await handleHorizonAppend(args as HorizonAppendArgs);
    return toTextContent(result);
  },
);

// horizon_read
server.registerTool(
  'horizon_read',
  {
    description:
      'Read recent wishes and intentions from the Horizon Vault. ' +
      'Optionally search within wishes by keyword.',
    inputSchema: {
      limit: z
        .number()
        .optional()
        .describe('Max wishes to return (default: 10)'),
      search: z
        .string()
        .optional()
        .describe('Search query within wishes (optional)'),
    },
  },
  async (args) => {
    const result = await handleHorizonRead(args as HorizonReadArgs);
    return toTextContent(result);
  },
);

// vault_classify
server.registerTool(
  'vault_classify',
  {
    description:
      'Classify content into the appropriate vault type without storing it. ' +
      'Returns the predicted vault, confidence score, and reasoning.',
    inputSchema: {
      content: z.string().describe('Content to classify'),
      guardian: z
        .string()
        .optional()
        .describe('Guardian context for classification (optional)'),
    },
  },
  async (args) => {
    const result = await handleVaultClassify(args as VaultClassifyArgs);
    return toTextContent(result);
  },
);

// memory_sync
server.registerTool(
  'memory_sync',
  {
    description:
      "Sync Starlight Vaults to MEMORY.md — creates a structured summary in " +
      "Claude Code's native memory format at .arcanea/memory/MEMORY.md. " +
      'Returns sync metadata (lines written, entries included per vault).',
    inputSchema: {},
  },
  async () => {
    const result = await handleMemorySync();
    return toTextContent(result);
  },
);

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(
    '[arcanea-memory-mcp] Starlight Vaults MCP server started (SDK 1.29)\n',
  );
}

main().catch((err: unknown) => {
  process.stderr.write(
    `[arcanea-memory-mcp] Fatal error: ${String(err)}\n`,
  );
  process.exit(1);
});
