/**
 * Arcanea Ops — GitHub Data Fetcher
 *
 * Server-side utility that fetches repo health from the GitHub API.
 * Uses GITHUB_TOKEN env var for authenticated requests (5000 req/hr).
 * Falls back to unauthenticated (60 req/hr) with graceful degradation.
 */

import type {
  RepoHealth,
  BuildStatus,
  HealthLevel,
  RepoCategory,
  OpsDashboardData,
  DashboardSummary,
  AgentStatus,
  SystemHealth,
  SessionEntry,
} from "./types";
import { REPO_REGISTRY, GITHUB_ORG, CATEGORY_ORDER } from "./repo-registry";

// ─── GitHub API Types ──────────────────────────────────────────────────────

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  pushed_at: string;
  open_issues_count: number;
  language: string | null;
  stargazers_count: number;
  archived: boolean;
  default_branch: string;
}

interface GitHubPR {
  number: number;
  state: string;
}

interface GitHubCheckRun {
  conclusion: string | null;
  status: string;
}

interface GitHubCheckSuite {
  total_count: number;
  check_runs: GitHubCheckRun[];
}

// ─── Fetcher ───────────────────────────────────────────────────────────────

const GITHUB_API = "https://api.github.com";

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Arcanea-Ops-Dashboard",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function ghFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${GITHUB_API}${path}`, {
      headers: githubHeaders(),
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ─── Build Status ──────────────────────────────────────────────────────────

async function fetchBuildStatus(
  owner: string,
  repo: string,
  defaultBranch: string,
): Promise<BuildStatus> {
  const checks = await ghFetch<GitHubCheckSuite>(
    `/repos/${owner}/${repo}/commits/${defaultBranch}/check-runs?per_page=5`,
  );
  if (!checks || checks.total_count === 0) return "no_status";

  const latest = checks.check_runs[0];
  if (!latest) return "no_status";

  if (latest.status !== "completed") return "pending";
  if (latest.conclusion === "success") return "success";
  if (latest.conclusion === "failure" || latest.conclusion === "timed_out")
    return "failure";
  return "no_status";
}

// ─── PR Count ──────────────────────────────────────────────────────────────

async function fetchOpenPRCount(
  owner: string,
  repo: string,
): Promise<number> {
  const prs = await ghFetch<GitHubPR[]>(
    `/repos/${owner}/${repo}/pulls?state=open&per_page=100`,
  );
  return prs?.length ?? 0;
}

// ─── Health Score Calculation ──────────────────────────────────────────────

function calculateHealthScore(
  repo: GitHubRepo,
  openPRs: number,
  buildStatus: BuildStatus,
): { score: number; level: HealthLevel } {
  let score = 100;

  // Recency penalty: lose points for stale repos
  const daysSinceLastPush = Math.floor(
    (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysSinceLastPush > 90) score -= 30;
  else if (daysSinceLastPush > 30) score -= 15;
  else if (daysSinceLastPush > 14) score -= 5;

  // Issue penalty
  if (repo.open_issues_count > 20) score -= 20;
  else if (repo.open_issues_count > 10) score -= 10;
  else if (repo.open_issues_count > 5) score -= 5;

  // PR penalty
  if (openPRs > 10) score -= 15;
  else if (openPRs > 5) score -= 8;
  else if (openPRs > 2) score -= 3;

  // Build penalty
  if (buildStatus === "failure") score -= 25;
  else if (buildStatus === "error") score -= 15;
  else if (buildStatus === "pending") score -= 5;

  // Archive bonus: archived repos are neutral
  if (repo.archived) score = 50;

  score = Math.max(0, Math.min(100, score));

  let level: HealthLevel;
  if (score >= 70) level = "healthy";
  else if (score >= 40) level = "warning";
  else level = "critical";

  return { score, level };
}

// ─── Fetch Single Repo ─────────────────────────────────────────────────────

async function fetchRepoHealth(
  repoName: string,
  category: RepoCategory,
  fallbackDescription: string,
): Promise<RepoHealth> {
  const repo = await ghFetch<GitHubRepo>(
    `/repos/${GITHUB_ORG}/${repoName}`,
  );

  if (!repo) {
    return {
      name: repoName,
      fullName: `${GITHUB_ORG}/${repoName}`,
      category,
      description: fallbackDescription,
      url: `https://github.com/${GITHUB_ORG}/${repoName}`,
      lastPush: "unknown",
      openIssues: 0,
      openPRs: 0,
      buildStatus: "no_status",
      healthScore: 0,
      healthLevel: "unknown",
      language: null,
      stars: 0,
      isArchived: false,
      defaultBranch: "main",
    };
  }

  const [openPRs, buildStatus] = await Promise.all([
    fetchOpenPRCount(GITHUB_ORG, repoName),
    fetchBuildStatus(GITHUB_ORG, repoName, repo.default_branch),
  ]);

  const { score, level } = calculateHealthScore(repo, openPRs, buildStatus);

  return {
    name: repo.name,
    fullName: repo.full_name,
    category,
    description: repo.description || fallbackDescription,
    url: repo.html_url,
    lastPush: repo.pushed_at,
    openIssues: repo.open_issues_count,
    openPRs,
    buildStatus,
    healthScore: score,
    healthLevel: level,
    language: repo.language,
    stars: repo.stargazers_count,
    isArchived: repo.archived,
    defaultBranch: repo.default_branch,
  };
}

// ─── System Health Stubs ───────────────────────────────────────────────────

function getSystemsHealth(): SystemHealth[] {
  return [
    {
      name: "Starlight Intelligence System",
      acronym: "SIS",
      status: "healthy",
      version: "5.0",
      uptime: "99.2%",
      metrics: [
        { label: "Vaults", value: 6, unit: "active" },
        { label: "Agents", value: 7, unit: "registered" },
        { label: "Cognitive Layers", value: 5, unit: "layers" },
      ],
    },
    {
      name: "Agentic Creator OS",
      acronym: "ACOS",
      status: "healthy",
      version: "10.0",
      uptime: "98.8%",
      metrics: [
        { label: "Skills", value: 90, unit: "loaded", trend: "up" },
        { label: "Commands", value: 65, unit: "available" },
        { label: "Agents", value: 38, unit: "defined" },
      ],
    },
    {
      name: "Arcanea Intelligence OS",
      acronym: "AIOS",
      status: "healthy",
      version: "3.0",
      uptime: "97.5%",
      metrics: [
        { label: "Orchestrators", value: 4, unit: "active" },
        { label: "Memory", value: "hybrid", trend: "stable" },
        { label: "HNSW Index", value: "enabled" },
      ],
    },
    {
      name: "Claude Flow",
      acronym: "FLOW",
      status: "healthy",
      version: "3.0",
      uptime: "99.0%",
      metrics: [
        { label: "Max Agents", value: 15, unit: "slots" },
        { label: "Topology", value: "hierarchical-mesh" },
        { label: "Consensus", value: "raft" },
      ],
    },
  ];
}

// ─── Agent Status Stubs (would read from daemon in production) ─────────

function getAgentStatuses(): AgentStatus[] {
  return [
    {
      id: "lumina-orchestrator",
      name: "Lumina",
      type: "orchestrator",
      status: "active",
      lastActive: new Date().toISOString(),
      taskCount: 0,
    },
    {
      id: "sparc-coordinator",
      name: "SPARC Coordinator",
      type: "coordinator",
      status: "idle",
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      taskCount: 0,
    },
    {
      id: "coder-agent",
      name: "Coder",
      type: "worker",
      status: "idle",
      lastActive: new Date(Date.now() - 7200000).toISOString(),
      taskCount: 0,
    },
    {
      id: "reviewer-agent",
      name: "Reviewer",
      type: "worker",
      status: "idle",
      lastActive: new Date(Date.now() - 7200000).toISOString(),
      taskCount: 0,
    },
    {
      id: "security-auditor",
      name: "Security Auditor",
      type: "specialist",
      status: "offline",
      lastActive: new Date(Date.now() - 86400000).toISOString(),
      taskCount: 0,
    },
    {
      id: "memory-specialist",
      name: "Memory Specialist",
      type: "specialist",
      status: "idle",
      lastActive: new Date(Date.now() - 1800000).toISOString(),
      taskCount: 0,
    },
  ];
}

// ─── Session History Stub ──────────────────────────────────────────────────

function getSessionHistory(): SessionEntry[] {
  // In production, this would read from ~/.arcanea/sessions/
  return [
    {
      id: "session-001",
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date().toISOString(),
      duration: "1h 00m",
      agentCount: 4,
      tasksCompleted: 12,
      status: "completed",
      summary: "Mega session: 55+ commits, 210K+ lines",
    },
    {
      id: "session-002",
      startTime: new Date(Date.now() - 86400000).toISOString(),
      endTime: new Date(Date.now() - 82800000).toISOString(),
      duration: "1h 00m",
      agentCount: 6,
      tasksCompleted: 8,
      status: "completed",
      summary: "Codex audit, Hz removal, 3 parallel swarms",
    },
    {
      id: "session-003",
      startTime: new Date(Date.now() - 172800000).toISOString(),
      endTime: new Date(Date.now() - 165600000).toISOString(),
      duration: "2h 00m",
      agentCount: 8,
      tasksCompleted: 25,
      status: "completed",
      summary: "128 files, 25 agents, 17 skills, Intelligence OS build",
    },
  ];
}

// ─── Main Fetch ────────────────────────────────────────────────────────────

export async function fetchOpsDashboard(): Promise<OpsDashboardData> {
  // Fetch all repos in parallel (batched to avoid rate limits)
  const repos = await Promise.all(
    REPO_REGISTRY.map((entry) =>
      fetchRepoHealth(entry.name, entry.category, entry.description),
    ),
  );

  // Group by category
  const reposByCategory = {} as Record<RepoCategory, RepoHealth[]>;
  for (const cat of CATEGORY_ORDER) {
    reposByCategory[cat as RepoCategory] = repos.filter(
      (r) => r.category === cat,
    );
  }

  const agents = getAgentStatuses();
  const systems = getSystemsHealth();
  const sessions = getSessionHistory();

  // Build summary
  const healthyRepos = repos.filter((r) => r.healthLevel === "healthy").length;
  const warningRepos = repos.filter((r) => r.healthLevel === "warning").length;
  const criticalRepos = repos.filter(
    (r) => r.healthLevel === "critical",
  ).length;
  const totalOpenIssues = repos.reduce((sum, r) => sum + r.openIssues, 0);
  const totalOpenPRs = repos.reduce((sum, r) => sum + r.openPRs, 0);
  const avgHealth =
    repos.length > 0
      ? Math.round(repos.reduce((sum, r) => sum + r.healthScore, 0) / repos.length)
      : 0;

  const summary: DashboardSummary = {
    totalRepos: repos.length,
    healthyRepos,
    warningRepos,
    criticalRepos,
    totalOpenIssues,
    totalOpenPRs,
    activeAgents: agents.filter((a) => a.status === "active").length,
    systemsOnline: systems.filter((s) => s.status === "healthy").length,
    averageHealthScore: avgHealth,
  };

  return {
    repos,
    reposByCategory,
    agents,
    systems,
    sessions,
    summary,
    fetchedAt: new Date().toISOString(),
  };
}
