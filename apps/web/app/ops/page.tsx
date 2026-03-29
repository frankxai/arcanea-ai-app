import type { JSX } from "react";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────────────

interface SystemStatus {
  label: string;
  status: "healthy" | "degraded" | "down";
  detail: string;
  metric?: string;
  version?: string;
  metrics?: { label: string; value: string | number; unit?: string }[];
}

interface Repo {
  name: string;
  description: string;
  url: string;
  category: RepoCategory;
  lastPush: string;
  openIssues: number;
  openPRs: number;
  buildStatus: BuildStatus;
  healthScore: number;
  health: "healthy" | "warning" | "critical";
}

type BuildStatus = "success" | "failure" | "pending" | "no_status" | "error";

interface RecentCommit {
  repo: string;
  message: string;
  date: string;
  sha: string;
}

interface AgentInfo {
  id: string;
  name: string;
  type: string;
  status: "active" | "idle" | "error" | "offline";
  lastActive: string;
}

interface SessionInfo {
  id: string;
  startTime: string;
  duration: string;
  agentCount: number;
  tasksCompleted: number;
  status: "completed" | "active" | "failed";
  summary?: string;
}

interface OpsData {
  systems: SystemStatus[];
  repos: Repo[];
  recentCommits: RecentCommit[];
  agents: AgentInfo[];
  sessions: SessionInfo[];
  fetchedAt: string;
}

type RepoCategory =
  | "platform"
  | "intelligence"
  | "content"
  | "extensions"
  | "skills"
  | "archive"
  | "other";

const CATEGORY_TABS: { key: RepoCategory | "all"; label: string }[] = [
  { key: "platform", label: "Platform" },
  { key: "intelligence", label: "Intelligence" },
  { key: "content", label: "Content" },
  { key: "extensions", label: "Extensions" },
  { key: "skills", label: "Skills" },
  { key: "archive", label: "Archive" },
  { key: "all", label: "All" },
];

// ─── Fallback Data ─────────────────────────────────────────────────────────

const FALLBACK_SYSTEMS: SystemStatus[] = [
  {
    label: "SIS",
    status: "healthy",
    detail: "5-layer cognitive architecture",
    metric: "99.2% uptime",
    version: "5.0",
    metrics: [
      { label: "Vaults", value: 6, unit: "active" },
      { label: "Agents", value: 7, unit: "registered" },
      { label: "Layers", value: 5, unit: "cognitive" },
    ],
  },
  {
    label: "ACOS",
    status: "healthy",
    detail: "Autonomous Creative OS",
    metric: "98.8% uptime",
    version: "10.0",
    metrics: [
      { label: "Skills", value: 90, unit: "loaded" },
      { label: "Commands", value: 65, unit: "available" },
      { label: "Agents", value: 38, unit: "defined" },
    ],
  },
  {
    label: "AIOS",
    status: "healthy",
    detail: "Mythology-infused orchestration",
    metric: "97.5% uptime",
    version: "3.0",
    metrics: [
      { label: "Orchestrators", value: 4, unit: "active" },
      { label: "Memory", value: "hybrid" },
      { label: "HNSW", value: "enabled" },
    ],
  },
  {
    label: "FLOW",
    status: "healthy",
    detail: "Multi-agent orchestration",
    metric: "99.0% uptime",
    version: "3.0",
    metrics: [
      { label: "Max Agents", value: 15, unit: "slots" },
      { label: "Topology", value: "hierarchical-mesh" },
      { label: "Consensus", value: "raft" },
    ],
  },
];

const FALLBACK_REPOS: Repo[] = [
  {
    name: "arcanea-ai-app",
    description: "Main platform — Next.js 16, AI chat, imagine, library, creator tools",
    url: "https://github.com/frankxai/arcanea-ai-app",
    category: "platform",
    lastPush: new Date(Date.now() - 3600000).toISOString(),
    openIssues: 2,
    openPRs: 0,
    buildStatus: "success",
    healthScore: 95,
    health: "healthy",
  },
  {
    name: "arcanea",
    description: "Open-source framework — world-building engine, design system, CLI",
    url: "https://github.com/frankxai/arcanea",
    category: "platform",
    lastPush: new Date(Date.now() - 86400000).toISOString(),
    openIssues: 5,
    openPRs: 1,
    buildStatus: "success",
    healthScore: 85,
    health: "healthy",
  },
  {
    name: "arcanea-code",
    description: "Flagship CLI — OpenCode fork, multi-model, agent spawning",
    url: "https://github.com/frankxai/arcanea-code",
    category: "platform",
    lastPush: new Date(Date.now() - 172800000).toISOString(),
    openIssues: 3,
    openPRs: 0,
    buildStatus: "success",
    healthScore: 80,
    health: "healthy",
  },
  {
    name: "oh-my-arcanea",
    description: "Canonical harness overlay — agent configs, skills, hooks",
    url: "https://github.com/frankxai/oh-my-arcanea",
    category: "platform",
    lastPush: new Date(Date.now() - 259200000).toISOString(),
    openIssues: 1,
    openPRs: 0,
    buildStatus: "no_status",
    healthScore: 82,
    health: "healthy",
  },
  {
    name: "Starlight-Intelligence-System",
    description: "5-layer cognitive architecture, 6 vaults, 7 agents",
    url: "https://github.com/frankxai/Starlight-Intelligence-System",
    category: "intelligence",
    lastPush: new Date(Date.now() - 345600000).toISOString(),
    openIssues: 0,
    openPRs: 0,
    buildStatus: "no_status",
    healthScore: 78,
    health: "healthy",
  },
  {
    name: "acos-intelligence-system",
    description: "ACOS v10 — Autonomous Creative OS",
    url: "https://github.com/frankxai/acos-intelligence-system",
    category: "intelligence",
    lastPush: new Date(Date.now() - 432000000).toISOString(),
    openIssues: 2,
    openPRs: 0,
    buildStatus: "no_status",
    healthScore: 72,
    health: "healthy",
  },
  {
    name: "agentic-creator-os",
    description: "90+ skills, 65+ commands, 38 agents, 8 plugins",
    url: "https://github.com/frankxai/agentic-creator-os",
    category: "intelligence",
    lastPush: new Date(Date.now() - 518400000).toISOString(),
    openIssues: 4,
    openPRs: 1,
    buildStatus: "no_status",
    healthScore: 65,
    health: "warning",
  },
  {
    name: "arcanea-claw",
    description: "AI media engine — NanoClaw fork, ComfyUI workflows",
    url: "https://github.com/frankxai/arcanea-claw",
    category: "content",
    lastPush: new Date(Date.now() - 691200000).toISOString(),
    openIssues: 1,
    openPRs: 0,
    buildStatus: "no_status",
    healthScore: 55,
    health: "warning",
  },
  {
    name: "arcanea-author",
    description: "Book production system — semantic chapters, multi-format export",
    url: "https://github.com/frankxai/arcanea-author",
    category: "content",
    lastPush: new Date(Date.now() - 604800000).toISOString(),
    openIssues: 0,
    openPRs: 0,
    buildStatus: "no_status",
    healthScore: 60,
    health: "warning",
  },
  {
    name: "arcanea-records",
    description: "Music studio — Suno integration, album management, streaming",
    url: "https://github.com/frankxai/arcanea-records",
    category: "content",
    lastPush: new Date(Date.now() - 432000000).toISOString(),
    openIssues: 0,
    openPRs: 0,
    buildStatus: "no_status",
    healthScore: 75,
    health: "healthy",
  },
  {
    name: "arcanea-vscode",
    description: "VS Code extension — Kilo Code fork",
    url: "https://github.com/frankxai/arcanea-vscode",
    category: "extensions",
    lastPush: new Date(Date.now() - 604800000).toISOString(),
    openIssues: 4,
    openPRs: 0,
    buildStatus: "no_status",
    healthScore: 50,
    health: "warning",
  },
  {
    name: "arcanea-vault",
    description: "Cross-AI capture — ChatGPT, Claude, Gemini",
    url: "https://github.com/frankxai/arcanea-vault",
    category: "extensions",
    lastPush: new Date(Date.now() - 518400000).toISOString(),
    openIssues: 0,
    openPRs: 0,
    buildStatus: "no_status",
    healthScore: 68,
    health: "warning",
  },
  {
    name: "claude-code-hooks",
    description: "15 production hooks for Claude Code",
    url: "https://github.com/frankxai/claude-code-hooks",
    category: "skills",
    lastPush: new Date(Date.now() - 345600000).toISOString(),
    openIssues: 2,
    openPRs: 0,
    buildStatus: "no_status",
    healthScore: 76,
    health: "healthy",
  },
  {
    name: "arcanean-prompt-language",
    description: "SPARK.SHAPE.SHARPEN prompting methodology",
    url: "https://github.com/frankxai/arcanean-prompt-language",
    category: "skills",
    lastPush: new Date(Date.now() - 691200000).toISOString(),
    openIssues: 0,
    openPRs: 0,
    buildStatus: "no_status",
    healthScore: 55,
    health: "warning",
  },
  {
    name: "arcanea-opencode",
    description: "Superseded by oh-my-arcanea",
    url: "https://github.com/frankxai/arcanea-opencode",
    category: "archive",
    lastPush: new Date(Date.now() - 2592000000).toISOString(),
    openIssues: 0,
    openPRs: 0,
    buildStatus: "no_status",
    healthScore: 30,
    health: "critical",
  },
];

const FALLBACK_AGENTS: AgentInfo[] = [
  {
    id: "lumina-orchestrator",
    name: "Lumina",
    type: "orchestrator",
    status: "active",
    lastActive: new Date().toISOString(),
  },
  {
    id: "sparc-coordinator",
    name: "SPARC Coordinator",
    type: "coordinator",
    status: "idle",
    lastActive: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "coder-agent",
    name: "Coder",
    type: "worker",
    status: "idle",
    lastActive: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "reviewer-agent",
    name: "Reviewer",
    type: "worker",
    status: "idle",
    lastActive: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "security-auditor",
    name: "Security Auditor",
    type: "specialist",
    status: "offline",
    lastActive: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "memory-specialist",
    name: "Memory Specialist",
    type: "specialist",
    status: "idle",
    lastActive: new Date(Date.now() - 1800000).toISOString(),
  },
];

const FALLBACK_SESSIONS: SessionInfo[] = [
  {
    id: "session-001",
    startTime: new Date(Date.now() - 3600000).toISOString(),
    duration: "1h 00m",
    agentCount: 4,
    tasksCompleted: 12,
    status: "completed",
    summary: "Mega session: 55+ commits, 210K+ lines",
  },
  {
    id: "session-002",
    startTime: new Date(Date.now() - 86400000).toISOString(),
    duration: "1h 00m",
    agentCount: 6,
    tasksCompleted: 8,
    status: "completed",
    summary: "Codex audit, Hz removal, 3 parallel swarms",
  },
  {
    id: "session-003",
    startTime: new Date(Date.now() - 172800000).toISOString(),
    duration: "2h 00m",
    agentCount: 8,
    tasksCompleted: 25,
    status: "completed",
    summary: "128 files, 25 agents, 17 skills, Intelligence OS build",
  },
];

const FALLBACK_COMMITS: RecentCommit[] = [
  {
    repo: "arcanea-ai-app",
    message: "fix(critical): hero prompt handoff, broken chronica route, imagine retry button",
    date: new Date(Date.now() - 1800000).toISOString(),
    sha: "e143b1e7",
  },
  {
    repo: "arcanea-ai-app",
    message: "polish(ui): upgrade hero chat box gradients, fix imagine stats bar tabs",
    date: new Date(Date.now() - 7200000).toISOString(),
    sha: "547228dd",
  },
  {
    repo: "arcanea-ai-app",
    message: "polish(chat): upgrade export dialog, command palette, mention popup with gradients",
    date: new Date(Date.now() - 14400000).toISOString(),
    sha: "964463b5",
  },
  {
    repo: "claude-flow",
    message: "feat: v3 swarm coordination with hierarchical mesh topology",
    date: new Date(Date.now() - 86400000).toISOString(),
    sha: "a1b2c3d4",
  },
  {
    repo: "oh-my-arcanea",
    message: "chore: sync skills and hooks from upstream",
    date: new Date(Date.now() - 172800000).toISOString(),
    sha: "f5e6d7c8",
  },
];

// ─── Data Fetching ─────────────────────────────────────────────────────────

async function fetchOpsData(): Promise<OpsData> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/ops`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return res.json();
    }
  } catch {
    // API not available -- use fallback data
  }
  return {
    systems: FALLBACK_SYSTEMS,
    repos: FALLBACK_REPOS,
    recentCommits: FALLBACK_COMMITS,
    agents: FALLBACK_AGENTS,
    sessions: FALLBACK_SESSIONS,
    fetchedAt: new Date().toISOString(),
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function truncateStr(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "..." : str;
}

function healthDotColor(health: "healthy" | "warning" | "critical"): string {
  switch (health) {
    case "healthy":
      return "bg-emerald-400";
    case "warning":
      return "bg-amber-400";
    case "critical":
      return "bg-red-400";
  }
}

function healthTextColor(health: "healthy" | "warning" | "critical"): string {
  switch (health) {
    case "healthy":
      return "text-emerald-400";
    case "warning":
      return "text-amber-400";
    case "critical":
      return "text-red-400";
  }
}

function healthBarColor(health: "healthy" | "warning" | "critical"): string {
  switch (health) {
    case "healthy":
      return "bg-emerald-400";
    case "warning":
      return "bg-amber-400";
    case "critical":
      return "bg-red-400";
  }
}

function statusColor(status: "healthy" | "degraded" | "down"): string {
  switch (status) {
    case "healthy":
      return "text-[#7fffd4]";
    case "degraded":
      return "text-[#ffd700]";
    case "down":
      return "text-[#ef4444]";
  }
}

function statusBg(status: "healthy" | "degraded" | "down"): string {
  switch (status) {
    case "healthy":
      return "bg-[#7fffd4]/10 border-[#7fffd4]/20";
    case "degraded":
      return "bg-[#ffd700]/10 border-[#ffd700]/20";
    case "down":
      return "bg-[#ef4444]/10 border-[#ef4444]/20";
  }
}

const BUILD_LABELS: Record<BuildStatus, string> = {
  success: "Passing",
  failure: "Failing",
  pending: "Running",
  no_status: "No CI",
  error: "Error",
};

const BUILD_COLORS: Record<BuildStatus, string> = {
  success: "text-emerald-400",
  failure: "text-red-400",
  pending: "text-amber-400",
  no_status: "text-white/25",
  error: "text-red-400",
};

function sortRepos(
  repos: Repo[],
  sortKey: "health" | "activity" | "name",
): Repo[] {
  const sorted = [...repos];
  switch (sortKey) {
    case "health":
      return sorted.sort((a, b) => a.healthScore - b.healthScore);
    case "activity":
      return sorted.sort(
        (a, b) =>
          new Date(b.lastPush).getTime() - new Date(a.lastPush).getTime(),
      );
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}

// ─── Agent Status Helpers ──────────────────────────────────────────────────

const AGENT_STATUS_DOT: Record<AgentInfo["status"], string> = {
  active: "bg-emerald-400",
  idle: "bg-amber-400",
  error: "bg-red-400",
  offline: "bg-zinc-600",
};

const AGENT_STATUS_TEXT: Record<AgentInfo["status"], string> = {
  active: "text-emerald-400",
  idle: "text-amber-400",
  error: "text-red-400",
  offline: "text-zinc-500",
};

const AGENT_STATUS_RING: Record<AgentInfo["status"], string> = {
  active: "ring-emerald-400/30",
  idle: "ring-amber-400/20",
  error: "ring-red-400/30",
  offline: "ring-zinc-600/20",
};

const SESSION_STATUS_DOT: Record<SessionInfo["status"], string> = {
  completed: "bg-emerald-400",
  active: "bg-[#7fffd4]",
  failed: "bg-red-400",
};

const SESSION_STATUS_TEXT: Record<SessionInfo["status"], string> = {
  completed: "text-emerald-400",
  active: "text-[#7fffd4]",
  failed: "text-red-400",
};

// ─── Inline Icons ──────────────────────────────────────────────────────────

function IconShield({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M224,56a8,8,0,0,0-8-8H40a8,8,0,0,0-8,8v58.67c0,89.44,75.82,119.12,91,124a8.19,8.19,0,0,0,5.1,0c15.14-4.83,91-34.52,91-124ZM128,222.84C113.33,217.51,48,192.85,48,114.67V64H208v50.67C208,192.85,142.67,217.51,128,222.84Zm37.66-118.5a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,147l42.34-42.34A8,8,0,0,1,165.66,104.34Z" />
    </svg>
  );
}

function IconCpu({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M152,96H104a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V104A8,8,0,0,0,152,96Zm-8,48H112V112h32Zm88,0H216V120h16a8,8,0,0,0,0-16H216V80a16,16,0,0,0-16-16H176V48a8,8,0,0,0-16,0V64H136V48a8,8,0,0,0-16,0V64H96V48A8,8,0,0,0,80,48V64H56A16,16,0,0,0,40,80v24H24a8,8,0,0,0,0,16H40v24H24a8,8,0,0,0,0,16H40v16a16,16,0,0,0,16,16H80v16a8,8,0,0,0,16,0V192h24v16a8,8,0,0,0,16,0V192h24v16a8,8,0,0,0,16,0V192h24a16,16,0,0,0,16-16V160h16a8,8,0,0,0,0-16Zm-32,32H56V80H200Z" />
    </svg>
  );
}

function IconBrain({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M248,124a56.11,56.11,0,0,0-32-50.61V72a48,48,0,0,0-88-26.49A48,48,0,0,0,40,72v1.39A56,56,0,0,0,64,180h0v36a16,16,0,0,0,16,16h96a16,16,0,0,0,16-16V180h0A56.09,56.09,0,0,0,248,124ZM64,164a40,40,0,0,1-8-79.23V72a32,32,0,0,1,64,0v52.77A56.3,56.3,0,0,0,64,164Zm112,52H80V185.07a55.87,55.87,0,0,0,16,2.93h64a55.87,55.87,0,0,0,16-2.93Zm16-52a56.3,56.3,0,0,0-56-39.23V72a32,32,0,0,1,64,0v12.77A40,40,0,0,1,192,164Z" />
    </svg>
  );
}

function IconRocket({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M152,224a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,224ZM128,112a12,12,0,1,0-12-12A12,12,0,0,0,128,112Zm95.62,43.83-12.36,55.63a16,16,0,0,1-25.51,9.11L158.51,200H97.49L70.25,220.57a16,16,0,0,1-25.51-9.11L32.38,155.83a16.09,16.09,0,0,1,3.32-13.71l28.56-34.26a123.07,123.07,0,0,1,8.57-36.67c12.9-30.94,33.73-50.12,40.43-55.86a16,16,0,0,1,21.48,0c6.7,5.74,27.53,24.92,40.43,55.86a123.07,123.07,0,0,1,8.57,36.67l28.56,34.26A16.09,16.09,0,0,1,223.62,155.83Z" />
    </svg>
  );
}

function IconGitBranch({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M224,64a32,32,0,1,0-40,31v17a8,8,0,0,1-8,8H80a8,8,0,0,1-8-8V95a32,32,0,1,0-16,0v66a32,32,0,1,0,16,0V144h112a24,24,0,0,0,24-24V95A32.06,32.06,0,0,0,224,64ZM48,64A16,16,0,1,1,64,80,16,16,0,0,1,48,64Zm32,128a16,16,0,1,1-16-16A16,16,0,0,1,80,192ZM192,80a16,16,0,1,1,16-16A16,16,0,0,1,192,80Z" />
    </svg>
  );
}

function IconArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}

function IconExternalLink({
  className = "w-3.5 h-3.5",
}: {
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z" />
    </svg>
  );
}

function IconRefresh({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M197.67,186.37a8,8,0,0,1,0,11.29C196.58,198.73,170.82,224,128,224c-37.39,0-64-22.87-80-47.22V200a8,8,0,0,1-16,0V160a8,8,0,0,1,8-8H80a8,8,0,0,1,0,16H54.29C67.44,190.7,90.78,208,128,208c35.71,0,57.49-20.27,58.38-21.08A8,8,0,0,1,197.67,186.37ZM216,48a8,8,0,0,0-8,8V79.22C192,54.87,165.39,32,128,32,85.18,32,59.42,57.27,58.34,58.34a8,8,0,0,0,11.3,11.34C70.51,68.72,92.29,48,128,48c37.22,0,60.56,17.3,73.71,40H176a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V56A8,8,0,0,0,216,48Z" />
    </svg>
  );
}

function IconSync({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L163.31,54.63A80,80,0,0,0,48,128a8,8,0,0,1-16,0A96,96,0,0,1,170.59,43.17L208,80.58V48a8,8,0,0,1,16,0Zm-8,120a8,8,0,0,0-8,8v32.58L170.59,171.17a96,96,0,0,0-138.59,43A8,8,0,1,0,46.63,221.8,80,80,0,0,1,163.31,201.37L128,166H88a8,8,0,0,0,0,16h28.69l-33.38,33.37A80.15,80.15,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,109.74,44.69L208,207.42V176A8,8,0,0,0,216,168Z" />
    </svg>
  );
}

function IconClock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
    </svg>
  );
}

function IconWarning({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z" />
    </svg>
  );
}

// ─── System Icon Map ───────────────────────────────────────────────────────

const SYSTEM_ICONS: Record<string, (p: { className?: string }) => JSX.Element> =
  {
    SIS: IconShield,
    ACOS: IconCpu,
    AIOS: IconBrain,
    FLOW: IconRocket,
  };

const SYSTEM_ACCENTS: Record<string, { border: string; glow: string; text: string }> = {
  SIS: {
    border: "border-[#78a6ff]/20 hover:border-[#78a6ff]/35",
    glow: "0 0 40px rgba(120, 166, 255, 0.06)",
    text: "text-[#78a6ff]",
  },
  ACOS: {
    border: "border-[#7fffd4]/20 hover:border-[#7fffd4]/35",
    glow: "0 0 40px rgba(127, 255, 212, 0.06)",
    text: "text-[#7fffd4]",
  },
  AIOS: {
    border: "border-[#a78bfa]/20 hover:border-[#a78bfa]/35",
    glow: "0 0 40px rgba(167, 139, 250, 0.06)",
    text: "text-[#a78bfa]",
  },
  FLOW: {
    border: "border-[#ffd700]/20 hover:border-[#ffd700]/35",
    glow: "0 0 40px rgba(255, 215, 0, 0.06)",
    text: "text-[#ffd700]",
  },
};

// ─── Sub-Components ────────────────────────────────────────────────────────

function SystemHealthCard({ system }: { system: SystemStatus }) {
  const Icon = SYSTEM_ICONS[system.label] || IconShield;
  const accent = SYSTEM_ACCENTS[system.label] || SYSTEM_ACCENTS.SIS;

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border p-5
        ${accent.border}
        transition-all duration-200
      `}
      style={{
        background: "linear-gradient(145deg, rgba(18,18,24,0.8), rgba(12,12,18,0.9))",
        backdropFilter: "blur(24px)",
        boxShadow: `${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.03)`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className={`font-display text-xl font-bold tracking-wider ${accent.text}`}>
            {system.label}
          </span>
          {system.version && (
            <span className="ml-2 text-xs text-white/30 font-mono">v{system.version}</span>
          )}
        </div>
        <span
          className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
            ${statusBg(system.status)} ${statusColor(system.status)}
          `}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              system.status === "healthy"
                ? "bg-[#7fffd4]"
                : system.status === "degraded"
                  ? "bg-[#ffd700]"
                  : "bg-[#ef4444]"
            }`}
          />
          {system.status}
        </span>
      </div>

      <p className="text-xs text-white/50 mb-1">{system.detail}</p>
      {system.metric && (
        <p className="text-xs font-mono text-white/30 mb-3">{system.metric}</p>
      )}

      {/* Expanded metrics */}
      {system.metrics && system.metrics.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-1.5">
          {system.metrics.map((m) => (
            <div key={m.label} className="flex items-center justify-between text-xs">
              <span className="text-white/40">{m.label}</span>
              <span className="text-white/70 font-mono">
                {m.value}{m.unit ? ` ${m.unit}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RepoRow({ repo }: { repo: Repo }) {
  return (
    <tr className="transition-colors hover:bg-white/[0.02] group">
      {/* Name + Description */}
      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-white/90 hover:text-[#7fffd4] transition-colors font-mono text-sm"
          >
            {repo.name}
            <IconExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <span className="text-xs text-white/35 line-clamp-1">
            {repo.description}
          </span>
        </div>
      </td>

      {/* Last Push */}
      <td className="px-4 py-3 text-xs text-white/50 whitespace-nowrap">
        {relativeTime(repo.lastPush)}
      </td>

      {/* Issues */}
      <td className="px-4 py-3 text-center">
        <span
          className={`font-mono text-xs tabular-nums ${
            repo.openIssues > 10
              ? "text-amber-400"
              : repo.openIssues > 0
                ? "text-white/60"
                : "text-white/25"
          }`}
        >
          {repo.openIssues}
        </span>
      </td>

      {/* PRs */}
      <td className="px-4 py-3 text-center">
        <span
          className={`font-mono text-xs tabular-nums ${
            repo.openPRs > 5
              ? "text-amber-400"
              : repo.openPRs > 0
                ? "text-white/60"
                : "text-white/25"
          }`}
        >
          {repo.openPRs}
        </span>
      </td>

      {/* Build */}
      <td className="px-4 py-3 text-center">
        <span className={`text-xs font-medium ${BUILD_COLORS[repo.buildStatus]}`}>
          {BUILD_LABELS[repo.buildStatus]}
        </span>
      </td>

      {/* Health Score */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <div className="h-1.5 w-12 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${healthBarColor(repo.health)}`}
              style={{ width: `${repo.healthScore}%` }}
            />
          </div>
          <span className={`font-mono text-xs tabular-nums ${healthTextColor(repo.health)}`}>
            {repo.healthScore}
          </span>
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${
              repo.health === "healthy"
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                : repo.health === "warning"
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                  : "bg-red-500/15 text-red-400 border-red-500/25"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${healthDotColor(repo.health)}`} />
            {repo.health}
          </span>
        </div>
      </td>
    </tr>
  );
}

function AgentCard({ agent }: { agent: AgentInfo }) {
  return (
    <div className="bg-[rgba(12,12,18,0.6)] p-4 transition-colors hover:bg-white/[0.02]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`h-2.5 w-2.5 rounded-full ring-4 ${AGENT_STATUS_DOT[agent.status]} ${AGENT_STATUS_RING[agent.status]}`}
            />
            {agent.status === "active" && (
              <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping opacity-50" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white/85">{agent.name}</p>
            <p className="text-xs text-white/35 capitalize">{agent.type}</p>
          </div>
        </div>
        <span className={`text-xs font-medium capitalize ${AGENT_STATUS_TEXT[agent.status]}`}>
          {agent.status}
        </span>
      </div>
      <div className="mt-3 text-xs text-white/30">
        Last active: {relativeTime(agent.lastActive)}
      </div>
    </div>
  );
}

function SessionRow({ session }: { session: SessionInfo }) {
  const startDate = new Date(session.startTime);
  const dateStr = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const timeStr = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white/[0.02]">
      <div className={`h-2 w-2 rounded-full shrink-0 ${SESSION_STATUS_DOT[session.status]}`} />
      <div className="w-24 shrink-0">
        <p className="text-xs text-white/60 font-mono">{dateStr}</p>
        <p className="text-xs text-white/35 font-mono">{timeStr}</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/75 truncate">
          {session.summary || "Untitled session"}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-4 text-xs text-white/40 shrink-0">
        <span className="font-mono">{session.duration}</span>
        <span>{session.agentCount} agent{session.agentCount !== 1 ? "s" : ""}</span>
        <span>{session.tasksCompleted} tasks</span>
      </div>
      <span className={`text-xs font-medium capitalize shrink-0 ${SESSION_STATUS_TEXT[session.status]}`}>
        {session.status}
      </span>
    </div>
  );
}

function CommitLine({ commit }: { commit: RecentCommit }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="mt-1.5 flex-shrink-0">
        <IconGitBranch className="w-3.5 h-3.5 text-white/30" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-white/70 leading-relaxed truncate">
          {commit.message}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-mono text-[#7fffd4]/60">
            {commit.sha.slice(0, 8)}
          </span>
          <span className="text-[10px] text-white/30">{commit.repo}</span>
          <span className="text-[10px] text-white/20">{relativeTime(commit.date)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Category Table Section ────────────────────────────────────────────────

const CATEGORY_ACCENT: Record<string, string> = {
  platform: "from-[#7fffd4] to-[#78a6ff]",
  intelligence: "from-[#78a6ff] to-[#a78bfa]",
  content: "from-[#ffd700] to-[#f59e0b]",
  extensions: "from-[#7fffd4] to-[#34d399]",
  skills: "from-[#a78bfa] to-[#f472b6]",
  archive: "from-zinc-500 to-zinc-600",
  all: "from-[#78a6ff] to-[#7fffd4]",
};

function RepoTableSection({
  category,
  repos,
}: {
  category: string;
  repos: Repo[];
}) {
  if (repos.length === 0) return null;

  const healthyCount = repos.filter((r) => r.health === "healthy").length;
  const accent = CATEGORY_ACCENT[category] || CATEGORY_ACCENT.all;

  return (
    <div
      className="overflow-hidden rounded-xl border border-white/[0.06]"
      style={{
        background:
          "linear-gradient(145deg, rgba(18,18,24,0.75) 0%, rgba(12,12,18,0.85) 100%)",
        backdropFilter: "blur(24px)",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">
                Repository
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">
                Last Push
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-white/40">
                Issues
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-white/40">
                PRs
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-white/40">
                Build
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">
                Health
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {repos.map((repo) => (
              <RepoRow key={repo.name} repo={repo} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Summary Stat ──────────────────────────────────────────────────────────

function SummaryStat({
  value,
  label,
  color,
  suffix,
}: {
  value: number;
  label: string;
  color: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`text-2xl font-bold font-mono tabular-nums ${color}`}>
        {value}
        {suffix && <span className="text-sm text-white/30">{suffix}</span>}
      </span>
      <span className="text-xs text-white/40">{label}</span>
    </div>
  );
}

// ─── Page Component ────────────────────────────────────────────────────────

export default async function OpsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const activeTab = (params.tab as RepoCategory | "all") || "all";
  const sortKey = (params.sort as "health" | "activity" | "name") || "activity";

  const data = await fetchOpsData();

  const filteredRepos =
    activeTab === "all"
      ? data.repos
      : data.repos.filter((r) => r.category === activeTab);

  const sortedRepos = sortRepos(filteredRepos, sortKey);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  // Aggregate stats
  const totalRepos = data.repos.length;
  const healthyCount = data.repos.filter((r) => r.health === "healthy").length;
  const warningCount = data.repos.filter((r) => r.health === "warning").length;
  const criticalCount = data.repos.filter((r) => r.health === "critical").length;
  const totalIssues = data.repos.reduce((sum, r) => sum + r.openIssues, 0);
  const totalPRs = data.repos.reduce((sum, r) => sum + r.openPRs, 0);
  const avgHealth = totalRepos > 0
    ? Math.round(data.repos.reduce((sum, r) => sum + r.healthScore, 0) / totalRepos)
    : 0;
  const activeAgents = data.agents.filter((a) => a.status === "active").length;
  const systemsOnline = data.systems.filter((s) => s.status === "healthy").length;

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* ── Header ──────────────────────────────────────────────── */}
        <header>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[#7fffd4] to-[#78a6ff]" />
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-white/95 tracking-tight">
                  Ops Dashboard
                </h1>
              </div>
              <p className="text-sm text-white/40 pl-5">
                {dateStr} -- {timeStr}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/30 font-mono">
              <span>{healthyCount}/{totalRepos} healthy</span>
              <span className="text-white/10">|</span>
              <span>{totalIssues} issues</span>
              <span className="text-white/10">|</span>
              <span>{totalPRs} PRs</span>
            </div>
          </div>
        </header>

        {/* ── Summary Bar ─────────────────────────────────────────── */}
        <section
          className="rounded-xl border border-white/[0.06] p-4 sm:p-6"
          style={{
            background: "linear-gradient(145deg, rgba(18,18,24,0.8), rgba(12,12,18,0.9))",
            backdropFilter: "blur(32px)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 16px 48px rgba(0,0,0,0.2)",
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
            <SummaryStat value={totalRepos} label="Total Repos" color="text-white/90" />
            <SummaryStat value={healthyCount} label="Healthy" color="text-emerald-400" />
            <SummaryStat value={warningCount} label="Warning" color="text-amber-400" />
            <SummaryStat value={criticalCount} label="Critical" color="text-red-400" />
            <SummaryStat value={totalIssues} label="Open Issues" color="text-white/70" />
            <SummaryStat value={totalPRs} label="Open PRs" color="text-white/70" />
            <SummaryStat value={activeAgents} label="Active Agents" color="text-[#ffd700]" />
            <SummaryStat value={avgHealth} label="Avg Health" color="text-[#7fffd4]" suffix="/100" />
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-white/25">
            <span>Data fetched {relativeTime(data.fetchedAt)} -- Cached for 5 minutes</span>
            <span className="font-mono">{systemsOnline}/{data.systems.length} systems online</span>
          </div>
        </section>

        {/* ── Intelligence Systems ────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[#7fffd4] to-[#a78bfa]" />
            <h2 className="font-display text-lg font-semibold tracking-wide text-white/90">
              Intelligence Systems
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.systems.map((system) => (
              <SystemHealthCard key={system.label} system={system} />
            ))}
          </div>
        </section>

        {/* ── Agent Orchestrator ───────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[#ffd700] to-[#f59e0b]" />
              <h2 className="font-display text-lg font-semibold tracking-wide text-white/90">
                Agent Orchestrator
              </h2>
              <span className="text-xs text-white/40 font-mono">
                {activeAgents} active
              </span>
            </div>
          </div>
          <div
            className="overflow-hidden rounded-xl border border-white/[0.06]"
            style={{
              background: "linear-gradient(145deg, rgba(18,18,24,0.75), rgba(12,12,18,0.85))",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
              {data.agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Repository Health ────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[#78a6ff] to-[#7fffd4]" />
            <h2 className="font-display text-lg font-semibold tracking-wide text-white/90">
              Repository Health
            </h2>
          </div>

          {/* Tab bar + sort */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <nav className="flex flex-wrap gap-1.5">
              {CATEGORY_TABS.map((tab) => {
                const isActive = tab.key === activeTab;
                const count =
                  tab.key === "all"
                    ? data.repos.length
                    : data.repos.filter((r) => r.category === tab.key).length;
                return (
                  <Link
                    key={tab.key}
                    href={`/ops?tab=${tab.key}&sort=${sortKey}`}
                    className={`
                      inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-[#7fffd4]/15 text-[#7fffd4] border border-[#7fffd4]/20"
                          : "bg-white/[0.04] text-white/40 border border-transparent hover:bg-white/[0.06] hover:text-white/60"
                      }
                    `}
                  >
                    {tab.label}
                    <span
                      className={`text-[10px] ${isActive ? "text-[#7fffd4]/60" : "text-white/20"}`}
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-white/20 mr-1">
                Sort
              </span>
              {(["activity", "health", "name"] as const).map((s) => (
                <Link
                  key={s}
                  href={`/ops?tab=${activeTab}&sort=${s}`}
                  className={`
                    px-2.5 py-1 rounded text-[11px] font-medium transition-colors
                    ${
                      s === sortKey
                        ? "bg-white/[0.08] text-white/70"
                        : "text-white/30 hover:text-white/50"
                    }
                  `}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Repo table */}
          {sortedRepos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-white/30">No repositories in this category.</p>
            </div>
          ) : (
            <RepoTableSection category={activeTab} repos={sortedRepos} />
          )}
        </section>

        {/* ── Session History ──────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[#a78bfa] to-[#f472b6]" />
            <h2 className="font-display text-lg font-semibold tracking-wide text-white/90">
              Session History
            </h2>
            <span className="text-xs text-white/40 font-mono">
              {data.sessions.length} recent
            </span>
          </div>
          <div
            className="overflow-hidden rounded-xl border border-white/[0.06]"
            style={{
              background: "linear-gradient(145deg, rgba(18,18,24,0.75), rgba(12,12,18,0.85))",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="divide-y divide-white/[0.04]">
              {data.sessions.map((session) => (
                <SessionRow key={session.id} session={session} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Sidebar Row: Quick Actions + Recent Activity ────────── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-[0.15em] text-white/30 font-mono">
              Quick Actions
            </h2>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#7fffd4]/10 border border-[#7fffd4]/20 text-[#7fffd4] text-sm font-medium hover:bg-[#7fffd4]/15 transition-colors cursor-pointer"
              >
                <IconRefresh className="w-4 h-4" />
                Run Health Check
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm font-medium hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <IconSync className="w-4 h-4" />
                Sync All Repos
              </button>
              <Link
                href="/status"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm font-medium hover:bg-white/[0.06] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <IconClock className="w-4 h-4" />
                  View Full Session History
                </span>
                <IconArrowRight className="w-3.5 h-3.5 text-white/30" />
              </Link>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-[0.15em] text-white/30 font-mono">
              Recent Activity
            </h2>
            <div
              className="rounded-xl border p-5 bg-white/[0.03] backdrop-blur-sm border-white/[0.08]"
            >
              <div className="divide-y divide-white/[0.06]">
                {data.recentCommits.slice(0, 5).map((commit, i) => (
                  <CommitLine key={`${commit.sha}-${i}`} commit={commit} />
                ))}
              </div>
              {data.recentCommits.length === 0 && (
                <p className="text-xs text-white/20 text-center py-4">
                  No recent commits
                </p>
              )}
            </div>
          </section>
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <div className="text-center py-4">
          <p className="text-[10px] text-white/15 font-mono">
            Arcanea Ops Dashboard -- Data from GitHub API -- Cached 5 min
          </p>
        </div>
      </main>
    </div>
  );
}
