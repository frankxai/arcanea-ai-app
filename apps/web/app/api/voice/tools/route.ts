/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Jarvis Tool Dispatcher — Node runtime endpoint
 *
 * The chat route runs on Edge and cannot use child_process / node:fs / os.
 * Vercel AI SDK tools defined for Jarvis call this endpoint to run the actual
 * work in Node, then return data back into the model's tool-call loop.
 *
 * POST /api/voice/tools  body: { action, args? }
 *
 * Available actions:
 *   - system_status      → memory + branch + uptime
 *   - git_today          → last 24h commits across the repo
 *   - list_open_prs      → open PRs via gh CLI
 *   - search_repo        → ripgrep query across the repo (filename + match)
 *   - read_file          → read a file by path, return short summary
 *   - explain_arcanea    → return prepared homepage summary block
 *
 * Safe by design:
 *   - read-only — no writes, no shell side effects
 *   - timeouts on every subprocess
 *   - paths sandboxed to the repo root (no escape)
 *   - graceful failure (returns ok:false rather than throwing)
 */

import { NextResponse } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 15;

const exec = promisify(execFile);

function repoRoot(): string {
  // apps/web cwd → ../.. is the repo root in dev
  return path.resolve(process.cwd(), '..', '..');
}

async function safeExec(cmd: string, args: string[], opts: { cwd?: string; timeout?: number } = {}) {
  try {
    const { stdout } = await exec(cmd, args, {
      cwd: opts.cwd ?? repoRoot(),
      timeout: opts.timeout ?? 4000,
      maxBuffer: 1024 * 1024,
    });
    return { ok: true as const, stdout: stdout.trim() };
  } catch (err) {
    const e = err as { message?: string; stderr?: string };
    return { ok: false as const, error: e.message ?? 'exec failed', stderr: e.stderr ?? '' };
  }
}

// ---------------------------------------------------------------------------
// system_status
// ---------------------------------------------------------------------------

async function systemStatus() {
  const totalGb = +(os.totalmem() / 1024 ** 3).toFixed(1);
  const freeGb = +(os.freemem() / 1024 ** 3).toFixed(1);
  const usedPct = +(((totalGb - freeGb) / totalGb) * 100).toFixed(0);
  const branch = await safeExec('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  const uptimeMin = Math.round(os.uptime() / 60);
  return {
    memory: { totalGb, freeGb, usedPct },
    branch: branch.ok ? branch.stdout : null,
    uptimeMin,
    platform: os.platform(),
    cpuLoad: os.loadavg(),
  };
}

// ---------------------------------------------------------------------------
// git_today
// ---------------------------------------------------------------------------

async function gitToday() {
  const log = await safeExec('git', [
    'log',
    '--since=24 hours ago',
    '--pretty=format:%h|%s|%an',
    '-n',
    '15',
  ]);
  if (!log.ok) return { commits: [], error: log.error };
  const commits = log.stdout
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [hash, subject, author] = line.split('|');
      return { hash, subject, author };
    });
  return { count: commits.length, commits };
}

// ---------------------------------------------------------------------------
// list_open_prs
// ---------------------------------------------------------------------------

async function listOpenPrs() {
  const prs = await safeExec(
    'gh',
    ['pr', 'list', '--state', 'open', '--limit', '15', '--json', 'number,title,headRefName,isDraft'],
    { timeout: 6000 },
  );
  if (!prs.ok) return { count: 0, prs: [], error: prs.error };
  try {
    const parsed = JSON.parse(prs.stdout) as Array<{
      number: number;
      title: string;
      headRefName: string;
      isDraft: boolean;
    }>;
    return { count: parsed.length, prs: parsed };
  } catch (e) {
    return { count: 0, prs: [], error: 'json parse failed' };
  }
}

// ---------------------------------------------------------------------------
// search_repo
// ---------------------------------------------------------------------------

async function searchRepo(query: string) {
  if (!query || query.length < 2) return { matches: [], error: 'query too short' };
  // Use git grep to scope to tracked files; avoids node_modules and gitignored.
  const out = await safeExec(
    'git',
    ['grep', '-n', '--max-count=3', '-i', '-I', '-e', query, '--', ':!*.lock', ':!*.svg'],
    { timeout: 5000 },
  );
  if (!out.ok) return { matches: [], error: out.error };
  const lines = out.stdout.split('\n').filter(Boolean).slice(0, 20);
  const matches = lines.map((line) => {
    const m = line.match(/^([^:]+):(\d+):(.*)$/);
    return m ? { file: m[1], line: +m[2], snippet: m[3].slice(0, 200) } : { raw: line };
  });
  return { count: matches.length, matches };
}

// ---------------------------------------------------------------------------
// read_file
// ---------------------------------------------------------------------------

async function readFileSafe(filePath: string) {
  if (!filePath) return { error: 'path required' };
  // Sandbox: resolve and ensure within repo root.
  const root = repoRoot();
  const abs = path.resolve(root, filePath);
  if (!abs.startsWith(root)) return { error: 'path escapes repo root' };
  try {
    const stat = await fs.stat(abs);
    if (stat.isDirectory()) {
      const entries = await fs.readdir(abs);
      return {
        path: filePath,
        type: 'directory' as const,
        entries: entries.slice(0, 50),
      };
    }
    if (stat.size > 200_000) {
      return {
        path: filePath,
        type: 'file' as const,
        bytes: stat.size,
        truncated: true,
        excerpt: await fs.readFile(abs, 'utf-8').then((t) => t.slice(0, 5000)),
      };
    }
    const content = await fs.readFile(abs, 'utf-8');
    return {
      path: filePath,
      type: 'file' as const,
      bytes: stat.size,
      content,
    };
  } catch (e) {
    const err = e as { code?: string; message?: string };
    return { error: err.code ?? err.message ?? 'read failed' };
  }
}

// ---------------------------------------------------------------------------
// explain_arcanea — prepared brand context, no live fetch
// ---------------------------------------------------------------------------

const ARCANEA_BRIEF = {
  oneLine:
    'Arcanea is the operating system for generative creators — a platform where humans and AI co-build entire universes.',
  what: [
    'Living Worlds — fork-able universes with characters, magic, factions, locations, and conflicts that compose like code.',
    'Luminors — AI guardians (Lumina, Draconia, Lyria, Alera, Shinkami, Nero, Jarvis) you can chat with, hand off between, and assemble into councils.',
    'Voice Room — speak directly to any Luminor at /room/<persona>; clap to summon, mic-toggle, persona switch.',
    'Library OS — every book Frank reads becomes a permanent deep-dive page on the site, with quote extraction and chapter distillation.',
    'Open architecture — MIT primitives (`@arcanea/design-system`, `@arcanea/voice`, `@arcanea/multilingual`, peak-performance, NFT forge) on npm; Studio + Forge as commercial layer.',
  ],
  who: 'Frank built Arcanea after 7+ years at Oracle and a severance in 2026. Full-time creator now, based Amsterdam, Dutch BV.',
  positioning:
    'Not a chatbot wrapper. Not a no-code builder. The substrate where creator-civilizations get authored — consciously, sovereignly, in your voice.',
};

function explainArcanea(section?: string) {
  if (!section) return { brief: ARCANEA_BRIEF };
  const key = section.toLowerCase() as keyof typeof ARCANEA_BRIEF;
  if (key in ARCANEA_BRIEF) {
    return { section: key, content: ARCANEA_BRIEF[key] };
  }
  return { brief: ARCANEA_BRIEF, note: `Unknown section "${section}". Returning full brief.` };
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

interface ToolRequest {
  action: string;
  args?: Record<string, unknown>;
}

export async function POST(req: Request) {
  let body: ToolRequest;
  try {
    body = (await req.json()) as ToolRequest;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json body' }, { status: 400 });
  }

  const { action, args = {} } = body;

  try {
    switch (action) {
      case 'system_status': {
        return NextResponse.json({ ok: true, action, data: await systemStatus() });
      }
      case 'git_today': {
        return NextResponse.json({ ok: true, action, data: await gitToday() });
      }
      case 'list_open_prs': {
        return NextResponse.json({ ok: true, action, data: await listOpenPrs() });
      }
      case 'search_repo': {
        const q = typeof args.query === 'string' ? args.query : '';
        return NextResponse.json({ ok: true, action, data: await searchRepo(q) });
      }
      case 'read_file': {
        const p = typeof args.path === 'string' ? args.path : '';
        return NextResponse.json({ ok: true, action, data: await readFileSafe(p) });
      }
      case 'explain_arcanea': {
        const s = typeof args.section === 'string' ? args.section : undefined;
        return NextResponse.json({ ok: true, action, data: explainArcanea(s) });
      }
      default:
        return NextResponse.json(
          { ok: false, error: `unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (e) {
    const err = e as Error;
    return NextResponse.json(
      { ok: false, error: err.message ?? 'tool execution failed' },
      { status: 500 },
    );
  }
}
