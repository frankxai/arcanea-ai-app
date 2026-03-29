/**
 * Ops Dashboard Endpoint
 *
 * Fetches all repos for frankxai from GitHub, groups them by category,
 * calculates health scores, and returns system health metadata.
 * Cached in-memory for 5 minutes.
 *
 * @route GET /api/ops
 * @returns {Object} Categorized repos with health scores and system status
 */

import { NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type HealthColor = 'green' | 'yellow' | 'red';

interface RepoHealth {
  color: HealthColor;
  score: number; // 0-100
  daysSincePush: number;
}

interface RepoEntry {
  name: string;
  description: string | null;
  visibility: 'public' | 'private';
  pushedAt: string;
  openIssuesCount: number;
  defaultBranch: string;
  topics: string[];
  health: RepoHealth;
}

type Category =
  | 'Platform'
  | 'Intelligence'
  | 'Content'
  | 'Extensions'
  | 'Skills'
  | 'Archive'
  | 'Uncategorized';

interface SystemHealth {
  sis: {
    ok: boolean;
    lastSummaryAge: string | null;
    error?: string;
  };
  hookCount: number;
  agentCount: number;
}

interface OpsResponse {
  timestamp: string;
  cachedAt: string;
  ttlSeconds: number;
  totalRepos: number;
  categories: Record<Category, RepoEntry[]>;
  system: SystemHealth;
}

// ---------------------------------------------------------------------------
// Category mapping
// ---------------------------------------------------------------------------

const CATEGORY_MAP: Record<string, Category> = {
  // Platform
  'arcanea-ai-app': 'Platform',
  'arcanea-code': 'Platform',
  'oh-my-arcanea': 'Platform',
  'claude-arcanea': 'Platform',
  'arcanea-orchestrator': 'Platform',
  arcanea: 'Platform',
  'arcanea-records': 'Platform',

  // Intelligence
  'Starlight-Intelligence-System': 'Intelligence',
  'acos-intelligence-system': 'Intelligence',
  'agentic-creator-os': 'Intelligence',
  'arcanea-intelligence-os': 'Intelligence',
  'arcanea-flow': 'Intelligence',

  // Content
  'arcanea-claw': 'Content',
  'arcanea-author': 'Content',
  'author-os': 'Content',
  'arcanea-infogenius': 'Content',
  'suno-mcp-server': 'Content',
  'arcanea-video-pipeline': 'Content',

  // Extensions
  'arcanea-vscode': 'Extensions',
  'arcanea-openclaw': 'Extensions',
  'arcanean-open-webui': 'Extensions',
  'arcanea-lobechat-labs': 'Extensions',
  'arcanea-vault': 'Extensions',

  // Skills
  'agentic-creator-skills': 'Skills',
  'claude-code-hooks': 'Skills',
  'claude-code-config': 'Skills',
  'arcanean-prompt-language': 'Skills',

  // Archive
  'arcanea-opencode': 'Archive',
  'arcanea-platform': 'Archive',
  'arcanea-ecosystem': 'Archive',
  'gemini-arcanea': 'Archive',
  'codex-arcanea': 'Archive',
};

// ---------------------------------------------------------------------------
// In-memory cache
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cache: { data: OpsResponse; expiresAt: number } | null = null;

// ---------------------------------------------------------------------------
// Health score calculation
// ---------------------------------------------------------------------------

function calculateHealth(pushedAt: string, openIssues: number): RepoHealth {
  const now = Date.now();
  const pushed = new Date(pushedAt).getTime();
  const daysSincePush = Math.floor((now - pushed) / (1000 * 60 * 60 * 24));

  // Base score from recency
  let score: number;
  let color: HealthColor;

  if (daysSincePush < 7) {
    color = 'green';
    score = 90 + Math.max(0, 10 - daysSincePush); // 90-100
  } else if (daysSincePush < 30) {
    color = 'yellow';
    score = 50 + Math.round((30 - daysSincePush) * (40 / 23)); // ~50-90
  } else {
    color = 'red';
    score = Math.max(0, 50 - Math.floor((daysSincePush - 30) / 7) * 5); // decays from 50
  }

  // Issue adjustment: penalty for many open issues, small bonus for zero
  if (openIssues === 0) {
    score = Math.min(100, score + 5);
  } else if (openIssues > 10) {
    score = Math.max(0, score - 10);
  } else if (openIssues > 5) {
    score = Math.max(0, score - 5);
  }

  return { color, score, daysSincePush };
}

// ---------------------------------------------------------------------------
// GitHub fetch — paginated
// ---------------------------------------------------------------------------

async function fetchAllRepos(token: string): Promise<RepoEntry[]> {
  const repos: RepoEntry[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `https://api.github.com/users/frankxai/repos?per_page=${perPage}&page=${page}&sort=pushed&direction=desc`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as Array<{
      name: string;
      description: string | null;
      visibility: 'public' | 'private';
      pushed_at: string;
      open_issues_count: number;
      default_branch: string;
      topics: string[];
    }>;

    if (data.length === 0) break;

    for (const repo of data) {
      repos.push({
        name: repo.name,
        description: repo.description,
        visibility: repo.visibility,
        pushedAt: repo.pushed_at,
        openIssuesCount: repo.open_issues_count,
        defaultBranch: repo.default_branch,
        topics: repo.topics ?? [],
        health: calculateHealth(repo.pushed_at, repo.open_issues_count),
      });
    }

    if (data.length < perPage) break;
    page++;
  }

  return repos;
}

// ---------------------------------------------------------------------------
// System health checks
// ---------------------------------------------------------------------------

async function checkSystemHealth(): Promise<SystemHealth> {
  const system: SystemHealth = {
    sis: { ok: false, lastSummaryAge: null },
    hookCount: 0,
    agentCount: 0,
  };

  // Check SIS: ~/.arcanea/sessions/last-summary.md
  try {
    const summaryPath = join(homedir(), '.arcanea', 'sessions', 'last-summary.md');
    const fileStat = await stat(summaryPath);
    const ageMs = Date.now() - fileStat.mtimeMs;
    const ageHours = Math.round(ageMs / (1000 * 60 * 60) * 10) / 10;
    const isRecent = ageMs < 24 * 60 * 60 * 1000;

    system.sis = {
      ok: isRecent,
      lastSummaryAge: `${ageHours}h`,
    };
  } catch {
    system.sis = {
      ok: false,
      lastSummaryAge: null,
      error: 'last-summary.md not found',
    };
  }

  // Count hooks: ~/.claude/settings.json -> hooks
  try {
    const settingsPath = join(homedir(), '.claude', 'settings.json');
    const raw = await readFile(settingsPath, 'utf-8');
    const settings = JSON.parse(raw);
    if (settings.hooks && typeof settings.hooks === 'object') {
      system.hookCount = Object.values(settings.hooks).reduce(
        (sum: number, arr: unknown) => sum + (Array.isArray(arr) ? arr.length : 0),
        0
      );
    }
  } catch {
    // Hooks file missing or malformed — count stays 0
  }

  // Count agents: ~/.arcanea/agents/ directory entries
  try {
    const agentsDir = join(homedir(), '.arcanea', 'agents');
    const { readdir } = await import('fs/promises');
    const entries = await readdir(agentsDir);
    system.agentCount = entries.length;
  } catch {
    // Agents directory missing — count stays 0
  }

  return system;
}

// ---------------------------------------------------------------------------
// Categorize repos
// ---------------------------------------------------------------------------

function categorizeRepos(repos: RepoEntry[]): Record<Category, RepoEntry[]> {
  const categories: Record<Category, RepoEntry[]> = {
    Platform: [],
    Intelligence: [],
    Content: [],
    Extensions: [],
    Skills: [],
    Archive: [],
    Uncategorized: [],
  };

  for (const repo of repos) {
    const category = CATEGORY_MAP[repo.name] ?? 'Uncategorized';
    categories[category].push(repo);
  }

  // Sort each category by health score descending
  for (const cat of Object.keys(categories) as Category[]) {
    categories[cat].sort((a, b) => b.health.score - a.health.score);
  }

  return categories;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET() {
  // Return cached data if still valid
  if (cache && Date.now() < cache.expiresAt) {
    return NextResponse.json(
      { ...cache.data, timestamp: new Date().toISOString() },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, s-maxage=${Math.floor(CACHE_TTL_MS / 1000)}, stale-while-revalidate=60`,
          'X-Cache': 'HIT',
        },
      }
    );
  }

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: 'GITHUB_TOKEN not configured', timestamp: new Date().toISOString() },
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  try {
    const [repos, system] = await Promise.all([fetchAllRepos(token), checkSystemHealth()]);

    const categories = categorizeRepos(repos);
    const cachedAt = new Date().toISOString();

    const response: OpsResponse = {
      timestamp: cachedAt,
      cachedAt,
      ttlSeconds: CACHE_TTL_MS / 1000,
      totalRepos: repos.length,
      categories,
      system,
    };

    cache = { data: response, expiresAt: Date.now() + CACHE_TTL_MS };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, s-maxage=${Math.floor(CACHE_TTL_MS / 1000)}, stale-while-revalidate=60`,
        'X-Cache': 'MISS',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: message, timestamp: new Date().toISOString() },
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
