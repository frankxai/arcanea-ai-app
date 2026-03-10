/**
 * Arcanea Media MCP Tools
 * Exposes @arcanea/media through the MCP server so I (Claude) can manage
 * your media library directly without leaving the conversation.
 *
 * Guardian: Elara (Shift Gate, 852 Hz) — Transformation
 *
 * Tools:
 *   media_scan    — Scan a directory and catalog all media
 *   media_stats   — Get stats from the manifest
 *   media_search  — Search the catalog by query
 *   media_approve — Set status on entries
 *   media_dedup   — Archive all duplicates
 *   media_process — Run image conversion + thumbnails
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MANIFEST_DEFAULT = join(process.env.HOME ?? '~', 'arcanea-manifest.json');

function loadManifest(manifestPath: string) {
  if (!existsSync(manifestPath)) return null;
  try { return JSON.parse(readFileSync(manifestPath, 'utf-8')); }
  catch { return null; }
}

function saveManifest(data: unknown, manifestPath: string): void {
  writeFileSync(manifestPath, JSON.stringify(data, null, 2), 'utf-8');
}

// ── Tool definitions for MCP server registration ──────────────────────────────

export const MEDIA_TOOLS = [
  {
    name:        'media_scan',
    description: 'Scan a directory tree for images and videos, build the Arcanea media catalog with Guardian tags, scene descriptions, and deduplication.',
    inputSchema: {
      type:       'object',
      properties: {
        root_path: {
          type:        'string',
          description: 'Directory to scan (e.g. "G:/My Drive/Arcanea")',
        },
        manifest_path: {
          type:        'string',
          description: 'Where to save the manifest JSON',
          default:     MANIFEST_DEFAULT,
        },
      },
      required: ['root_path'],
    },
  },
  {
    name:        'media_stats',
    description: 'Get statistics from the Arcanea media catalog: total files, size, Guardian breakdown, source breakdown, duplicate count.',
    inputSchema: {
      type:       'object',
      properties: {
        manifest_path: { type: 'string', description: 'Path to manifest JSON' },
      },
    },
  },
  {
    name:        'media_search',
    description: 'Search the media catalog by Guardian name, scene description, or tag.',
    inputSchema: {
      type:       'object',
      properties: {
        query:         { type: 'string', description: 'Search query (Guardian name, scene, tag)' },
        manifest_path: { type: 'string' },
        limit:         { type: 'number', default: 20 },
      },
      required: ['query'],
    },
  },
  {
    name:        'media_approve',
    description: 'Set status (approved/archived/review) and quality tier (1=hero, 2=gallery, 3=archive) on media entries.',
    inputSchema: {
      type:       'object',
      properties: {
        ids:           { type: 'array', items: { type: 'string' }, description: 'Entry IDs to update' },
        status:        { type: 'string', enum: ['approved', 'archived', 'review'] },
        quality_tier:  { type: 'number', enum: [1, 2, 3] },
        manifest_path: { type: 'string' },
      },
      required: ['ids'],
    },
  },
  {
    name:        'media_dedup',
    description: 'Find and optionally archive all duplicate media files in the catalog.',
    inputSchema: {
      type:       'object',
      properties: {
        apply:         { type: 'boolean', description: 'Actually archive dupes (default: dry run)', default: false },
        manifest_path: { type: 'string' },
      },
    },
  },
];

// ── Tool handlers ─────────────────────────────────────────────────────────────

export async function handleMediaTool(name: string, args: Record<string, unknown>): Promise<string> {
  const manifestPath = (args.manifest_path as string) ?? MANIFEST_DEFAULT;

  switch (name) {

    case 'media_scan': {
      const root = args.root_path as string;
      if (!existsSync(root)) return `ERROR: Path not found: ${root}`;
      try {
        const cmd = `node "${join(import.meta.dirname ?? '.', '../../../media/dist/cli.js')}" scan "${root}" --manifest "${manifestPath}"`;
        const output = execSync(cmd, { timeout: 300_000, encoding: 'utf-8' });
        return output;
      } catch {
        // Fallback: use PowerShell catalog if Node not built
        const ps = `powershell.exe -ExecutionPolicy Bypass -File "C:\\Users\\frank\\Arcanea\\scripts\\media-catalog.ps1" -Root "${root}" -Output "${manifestPath}"`;
        try {
          execSync(ps, { timeout: 300_000 });
          const manifest = loadManifest(manifestPath);
          if (!manifest) return 'Scan complete but manifest unreadable.';
          return `Scanned ${manifest.total_files} files (${manifest.total_size_mb} MB). Manifest: ${manifestPath}`;
        } catch (e2) {
          return `Scan error: ${String(e2).slice(0, 200)}`;
        }
      }
    }

    case 'media_stats': {
      const manifest = loadManifest(manifestPath);
      if (!manifest) return `No manifest found at: ${manifestPath}\nRun media_scan first.`;
      const s = manifest;
      const lines = [
        `Total files: ${s.total_files}`,
        `Total size:  ${s.total_size_mb} MB`,
        `Duplicates:  ${s.duplicates}`,
        `Generated:   ${s.generated?.slice(0, 10)}`,
        '',
        'BY GUARDIAN:',
        ...Object.entries(s.by_guardian ?? {})
          .sort(([,a],[,b]) => (b as number) - (a as number))
          .map(([g, c]) => `  ${g.padEnd(14)} ${c}`),
        '',
        'BY TYPE:',
        ...Object.entries(s.by_type ?? {}).map(([k, v]) => `  ${k}: ${v}`),
        '',
        'BY SOURCE:',
        ...Object.entries(s.by_source ?? {}).map(([k, v]) => `  ${k}: ${v}`),
      ];
      return lines.join('\n');
    }

    case 'media_search': {
      const manifest = loadManifest(manifestPath);
      if (!manifest) return `No manifest found at: ${manifestPath}`;
      const q     = (args.query as string).toLowerCase();
      const limit = (args.limit as number) ?? 20;
      const hits  = (manifest.media as Array<Record<string, unknown>>)
        .filter((e) =>
          (e.scene as string)?.toLowerCase().includes(q) ||
          (e.original_name as string)?.toLowerCase().includes(q) ||
          (e.guardian as string ?? '').toLowerCase().includes(q) ||
          (e.tags as string[])?.some((t: string) => t.includes(q))
        )
        .slice(0, limit);
      if (!hits.length) return `No results for: ${q}`;
      return hits.map(e =>
        `[${e.id}] ${e.suggested_name}\n  scene: ${e.scene}\n  guardian: ${e.guardian ?? 'none'}  status: ${e.status}`
      ).join('\n\n');
    }

    case 'media_approve': {
      const manifest = loadManifest(manifestPath);
      if (!manifest) return `No manifest found at: ${manifestPath}`;
      const ids    = args.ids as string[];
      const status = args.status as string | undefined;
      const tier   = args.quality_tier as number | undefined;
      let updated  = 0;
      for (const entry of manifest.media as Array<Record<string, unknown>>) {
        if (ids.includes(entry.id as string)) {
          if (status) entry.status = status;
          if (tier)   entry.quality_tier = tier;
          updated++;
        }
      }
      saveManifest(manifest, manifestPath);
      return `Updated ${updated} entries.`;
    }

    case 'media_dedup': {
      const manifest = loadManifest(manifestPath);
      if (!manifest) return `No manifest found at: ${manifestPath}`;
      const dupes = (manifest.media as Array<Record<string, unknown>>)
        .filter((e) => e.duplicate_of);
      if (!args.apply) {
        return `Found ${dupes.length} duplicates.\nSample:\n` +
          dupes.slice(0, 5).map(e => `  ${e.original_name}`).join('\n') +
          '\n\nCall with apply:true to archive them.';
      }
      let count = 0;
      for (const e of manifest.media as Array<Record<string, unknown>>) {
        if (e.duplicate_of && e.status !== 'archived') { e.status = 'archived'; count++; }
      }
      saveManifest(manifest, manifestPath);
      return `Archived ${count} duplicates in manifest.`;
    }

    default:
      return `Unknown media tool: ${name}`;
  }
}
