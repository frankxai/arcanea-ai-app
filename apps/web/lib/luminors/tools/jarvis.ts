/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Jarvis tools — Vercel AI SDK wrappers around the Node-runtime dispatcher.
 *
 * The chat route runs on Edge and cannot use child_process / node:fs / os.
 * These tool wrappers fetch `/api/voice/tools` (Node runtime) which actually
 * executes the work. The model's tool-call loop then receives the data and
 * narrates it.
 *
 * Why per-tool wrappers (vs one big "jarvis_action" tool): the model picks
 * tools by description. Specific tools = specific descriptions = correct
 * calls. One generic tool means the model has to guess at action names.
 */

import { tool } from 'ai';
import { z } from 'zod';

function getOrigin(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return 'http://localhost:3000';
}

async function dispatch(action: string, args: Record<string, unknown> = {}) {
  const res = await fetch(`${getOrigin()}/api/voice/tools`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action, args }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    return { ok: false as const, error: `tool dispatch failed (${res.status}): ${text}` };
  }
  return (await res.json()) as { ok: boolean; data?: unknown; error?: string };
}

// ---------------------------------------------------------------------------
// system_status
// ---------------------------------------------------------------------------

export function buildSystemStatusTool() {
  return tool({
    description:
      'Read the host system status — RAM in use, disk, current git branch, uptime, CPU load. Use when Sir asks about the machine, the system, or wants a quick health snapshot. Server-side; only works in local dev (returns useful data on Vercel but RAM/disk reflect serverless container, not Sir\'s machine).',
    inputSchema: z.object({}).optional(),
    execute: async () => dispatch('system_status'),
  });
}

// ---------------------------------------------------------------------------
// git_today
// ---------------------------------------------------------------------------

export function buildGitTodayTool() {
  return tool({
    description:
      'List commits in the Arcanea repo from the last 24 hours. Returns hash, subject, and author for each. Use when Sir asks "what was I working on", "what shipped today", or wants to recall recent commits.',
    inputSchema: z.object({}).optional(),
    execute: async () => dispatch('git_today'),
  });
}

// ---------------------------------------------------------------------------
// list_open_prs
// ---------------------------------------------------------------------------

export function buildListOpenPrsTool() {
  return tool({
    description:
      'List currently open pull requests on github.com/frankxai/arcanea-ai-app. Returns number, title, branch name, and draft status. Use when Sir asks about pending PRs, what is awaiting review, or wants to triage merge readiness.',
    inputSchema: z.object({}).optional(),
    execute: async () => dispatch('list_open_prs'),
  });
}

// ---------------------------------------------------------------------------
// search_repo
// ---------------------------------------------------------------------------

const searchRepoSchema = z.object({
  query: z.string().min(2).max(120).describe('Search term — symbol, phrase, or short string. Case-insensitive.'),
});

export function buildSearchRepoTool() {
  return tool({
    description:
      'Search the Arcanea codebase for a string or symbol. Returns up to 20 matches with file path, line number, and a short snippet. Scoped to git-tracked files (excludes node_modules and gitignored). Use when Sir asks "where is X" or "find Y in the code".',
    inputSchema: searchRepoSchema,
    execute: async ({ query }) => dispatch('search_repo', { query }),
  });
}

// ---------------------------------------------------------------------------
// read_file
// ---------------------------------------------------------------------------

const readFileSchema = z.object({
  path: z
    .string()
    .min(1)
    .max(300)
    .describe(
      'Repo-relative path. Sandboxed to the Arcanea root. May be a file or a directory. Files >200KB are truncated.',
    ),
});

export function buildReadFileTool() {
  return tool({
    description:
      'Read a file or list a directory by repo-relative path. Use to verify the existence or contents of a specific file Sir mentions. Sandboxed — paths that escape the repo root are rejected. Files over 200 KB are truncated.',
    inputSchema: readFileSchema,
    execute: async ({ path }) => dispatch('read_file', { path }),
  });
}

// ---------------------------------------------------------------------------
// explain_arcanea
// ---------------------------------------------------------------------------

const explainArcaneaSchema = z.object({
  section: z
    .string()
    .optional()
    .describe(
      'Optional section: "oneLine", "what", "who", or "positioning". Omit for the full brief.',
    ),
});

export function buildExplainArcaneaTool() {
  return tool({
    description:
      'Return a curated explanation of Arcanea — what it is, what it offers, who built it, how it is positioned. Use when Sir asks you to explain Arcanea to someone (a friend, brother, investor) or when narrating the homepage. Returns prepared content; does not fetch the live site.',
    inputSchema: explainArcaneaSchema,
    execute: async ({ section }) => dispatch('explain_arcanea', { section }),
  });
}

// ---------------------------------------------------------------------------
// Factory — build the full Jarvis tool set
// ---------------------------------------------------------------------------

export function buildJarvisTools() {
  return {
    system_status: buildSystemStatusTool(),
    git_today: buildGitTodayTool(),
    list_open_prs: buildListOpenPrsTool(),
    search_repo: buildSearchRepoTool(),
    read_file: buildReadFileTool(),
    explain_arcanea: buildExplainArcaneaTool(),
  };
}

export const JARVIS_TOOL_NAMES = [
  'system_status',
  'git_today',
  'list_open_prs',
  'search_repo',
  'read_file',
  'explain_arcanea',
] as const;

export type JarvisToolName = (typeof JARVIS_TOOL_NAMES)[number];
