/**
 * Voice Briefing API Route
 *
 * Returns a compact "Today's Context" block for Jarvis-class personas to ground
 * their replies in the user's actual current state — without tool calling. Runs
 * server-side (Node runtime, NOT edge) so it can shell out to git and read the
 * planning-with-files/ directory.
 *
 * Returns JSON: { brief: string, generatedAt: ISO8601, source: ... }
 *
 * Used by /room/jarvis (and any persona that wants daily situational awareness).
 * The room-client fetches this once on mount and prepends to systemPrompt.
 *
 * Safe by design:
 *  - read-only — no writes, no shell side effects
 *  - timeouts on every subprocess (git can hang on huge repos)
 *  - never returns absolute paths (privacy/footprint)
 *  - falls back gracefully if anything fails (returns brief: '' rather than 5xx)
 *
 * In production (Vercel), git/fs aren't available — endpoint returns a static
 * "remote mode" briefing pointing at public arcanea.ai context. The whole point
 * of this route is local-dev richness.
 */

import { NextResponse } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

const exec = promisify(execFile);

interface Brief {
  brief: string;
  generatedAt: string;
  source: 'local' | 'remote' | 'partial';
  signals: {
    gitToday?: number;
    branch?: string;
    planningFiles?: number;
    memTotalGb?: number;
    memFreeGb?: number;
  };
}

async function safeExec(cmd: string, args: string[], cwd: string, timeoutMs = 2500): Promise<string | null> {
  try {
    const { stdout } = await exec(cmd, args, { cwd, timeout: timeoutMs, maxBuffer: 256 * 1024 });
    return stdout.trim();
  } catch {
    return null;
  }
}

async function gitToday(repoRoot: string): Promise<{ count: number; lines: string[]; branch: string | null }> {
  const branch = await safeExec('git', ['rev-parse', '--abbrev-ref', 'HEAD'], repoRoot);
  const log = await safeExec(
    'git',
    ['log', '--since=yesterday', '--pretty=format:%h %s', '-n', '8'],
    repoRoot,
  );
  if (!log) return { count: 0, lines: [], branch };
  const lines = log.split('\n').filter(Boolean);
  return { count: lines.length, lines, branch };
}

async function recentPlanning(repoRoot: string): Promise<string[]> {
  try {
    const dir = path.join(repoRoot, 'planning-with-files');
    const entries = await fs.readdir(dir);
    return entries.filter((n) => /\.md$/.test(n)).sort().slice(-5);
  } catch {
    return [];
  }
}

function memSnapshot(): { totalGb: number; freeGb: number } {
  const totalGb = +(os.totalmem() / 1024 ** 3).toFixed(1);
  const freeGb = +(os.freemem() / 1024 ** 3).toFixed(1);
  return { totalGb, freeGb };
}

function detectRepoRoot(): string {
  // The web app lives at apps/web; the repo root is two parents up.
  // process.cwd() in Next.js = apps/web during dev.
  const cwd = process.cwd();
  const guess = path.resolve(cwd, '..', '..');
  return guess;
}

export async function GET() {
  const isVercel = Boolean(process.env.VERCEL);
  const generatedAt = new Date().toISOString();

  if (isVercel) {
    const remote: Brief = {
      brief: [
        'Sir is on the production deployment. Local filesystem and git are unavailable.',
        'Public surface: arcanea.ai — operating system for generative creators.',
        'Voice room is running on Vercel; tools that need disk access are inert here.',
      ].join(' '),
      generatedAt,
      source: 'remote',
      signals: {},
    };
    return NextResponse.json(remote);
  }

  const repoRoot = detectRepoRoot();
  const [git, planning] = await Promise.all([
    gitToday(repoRoot),
    recentPlanning(repoRoot),
  ]);
  const mem = memSnapshot();

  const lines: string[] = [];
  lines.push("Today's context for Sir, compiled fresh on this request:");

  if (git.branch) {
    lines.push(`Current branch: ${git.branch}.`);
  }

  if (git.count > 0) {
    const recent = git.lines.slice(0, 5).map((l) => `  - ${l}`).join('\n');
    lines.push(`Commits in the last day (${git.count}):\n${recent}`);
  } else {
    lines.push('No commits in the last day.');
  }

  if (planning.length) {
    lines.push(`Latest planning files: ${planning.join(', ')}.`);
  }

  lines.push(
    `System: ${mem.freeGb.toFixed(1)} of ${mem.totalGb.toFixed(1)} GB free. ` +
      `Voice room is running locally; you have full filesystem awareness.`,
  );

  lines.push(
    'Reference these signals only when Sir asks about state, status, or what he was working on. ' +
      'Otherwise stay silent on them. They are situational awareness, not script.',
  );

  const brief: Brief = {
    brief: lines.join(' '),
    generatedAt,
    source: 'local',
    signals: {
      gitToday: git.count,
      branch: git.branch ?? undefined,
      planningFiles: planning.length,
      memTotalGb: mem.totalGb,
      memFreeGb: mem.freeGb,
    },
  };

  return NextResponse.json(brief, {
    headers: {
      'Cache-Control': 'private, max-age=300',
    },
  });
}
