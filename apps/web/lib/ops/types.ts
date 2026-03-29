/**
 * Arcanea Ops Dashboard — Type Definitions
 *
 * Strict types for repo health, agent status, and system health indicators.
 */

// ─── Health Levels ──────────────────────────────────────────────────────────

export type HealthLevel = "healthy" | "warning" | "critical" | "unknown";

// ─── Repository Categories ─────────────────────────────────────────────────

export type RepoCategory =
  | "Platform"
  | "Intelligence"
  | "Content"
  | "Extensions"
  | "Skills"
  | "Archive";

// ─── Repository Health ─────────────────────────────────────────────────────

export interface RepoHealth {
  name: string;
  fullName: string;
  category: RepoCategory;
  description: string;
  url: string;
  lastPush: string;
  openIssues: number;
  openPRs: number;
  buildStatus: BuildStatus;
  healthScore: number; // 0-100
  healthLevel: HealthLevel;
  language: string | null;
  stars: number;
  isArchived: boolean;
  defaultBranch: string;
}

export type BuildStatus =
  | "success"
  | "failure"
  | "pending"
  | "no_status"
  | "error";

// ─── Agent Status ──────────────────────────────────────────────────────────

export interface AgentStatus {
  id: string;
  name: string;
  type: string;
  status: "active" | "idle" | "error" | "offline";
  lastActive: string;
  taskCount: number;
  memoryUsage?: number;
}

// ─── System Health ─────────────────────────────────────────────────────────

export interface SystemHealth {
  name: string;
  acronym: string;
  status: HealthLevel;
  version: string;
  uptime: string;
  metrics: SystemMetric[];
}

export interface SystemMetric {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
}

// ─── Session History ───────────────────────────────────────────────────────

export interface SessionEntry {
  id: string;
  startTime: string;
  endTime?: string;
  duration: string;
  agentCount: number;
  tasksCompleted: number;
  status: "completed" | "active" | "failed";
  summary?: string;
}

// ─── Dashboard Aggregate ───────────────────────────────────────────────────

export interface OpsDashboardData {
  repos: RepoHealth[];
  reposByCategory: Record<RepoCategory, RepoHealth[]>;
  agents: AgentStatus[];
  systems: SystemHealth[];
  sessions: SessionEntry[];
  summary: DashboardSummary;
  fetchedAt: string;
}

export interface DashboardSummary {
  totalRepos: number;
  healthyRepos: number;
  warningRepos: number;
  criticalRepos: number;
  totalOpenIssues: number;
  totalOpenPRs: number;
  activeAgents: number;
  systemsOnline: number;
  averageHealthScore: number;
}

// ─── Repo Registry ─────────────────────────────────────────────────────────

export interface RepoRegistryEntry {
  name: string;
  category: RepoCategory;
  description: string;
}
