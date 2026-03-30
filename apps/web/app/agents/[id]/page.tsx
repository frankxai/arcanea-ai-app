import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

// ─── Types ─────────────────────────────────────────────────────────────────

type GateKey =
  | "foundation"
  | "flow"
  | "fire"
  | "heart"
  | "voice"
  | "sight"
  | "crown"
  | "starweave"
  | "unity"
  | "source";

type RankKey = "apprentice" | "mage" | "master" | "archmage" | "luminor";

interface AgentSkill {
  name: string;
  proficiency: number; // 0-100
}

interface ReputationEvent {
  date: string;
  event: string;
  delta: number;
}

interface ActivityEntry {
  date: string;
  action: string;
  detail: string;
}

interface AgentProfile {
  id: string;
  name: string;
  gate: GateKey;
  rank: RankKey;
  reputation: number;
  tasksCompleted: number;
  memberSince: string;
  status: "active" | "idle" | "offline";
  skills: AgentSkill[];
  reputationHistory: ReputationEvent[];
  activity: ActivityEntry[];
  description: string;
}

// ─── Gate & Rank Config ───────────────────────────────────────────────────

const GATE_CONFIG: Record<GateKey, { label: string; glyph: string; color: string; bg: string; border: string }> = {
  foundation: { label: "Foundation", glyph: "\u2617", color: "text-green-400",   bg: "bg-green-400/10",   border: "border-green-400/30" },
  flow:       { label: "Flow",       glyph: "\u224B", color: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-400/30" },
  fire:       { label: "Fire",       glyph: "\u2735", color: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/30" },
  heart:      { label: "Heart",      glyph: "\u2661", color: "text-pink-400",    bg: "bg-pink-400/10",    border: "border-pink-400/30" },
  voice:      { label: "Voice",      glyph: "\u266A", color: "text-[#7fffd4]",   bg: "bg-[#7fffd4]/10",   border: "border-[#7fffd4]/30" },
  sight:      { label: "Sight",      glyph: "\u25C9", color: "text-violet-400",  bg: "bg-violet-400/10",  border: "border-violet-400/30" },
  crown:      { label: "Crown",      glyph: "\u2655", color: "text-[#ffd700]",   bg: "bg-[#ffd700]/10",   border: "border-[#ffd700]/30" },
  starweave:  { label: "Starweave",  glyph: "\u2726", color: "text-cyan-400",    bg: "bg-cyan-400/10",    border: "border-cyan-400/30" },
  unity:      { label: "Unity",      glyph: "\u221E", color: "text-indigo-400",  bg: "bg-indigo-400/10",  border: "border-indigo-400/30" },
  source:     { label: "Source",     glyph: "\u2609", color: "text-white",       bg: "bg-white/10",       border: "border-white/30" },
};

const RANK_CONFIG: Record<RankKey, { label: string; color: string }> = {
  apprentice: { label: "Apprentice", color: "text-zinc-400" },
  mage:       { label: "Mage",       color: "text-blue-400" },
  master:     { label: "Master",     color: "text-purple-400" },
  archmage:   { label: "Archmage",   color: "text-[#ffd700]" },
  luminor:    { label: "Luminor",    color: "text-[#7fffd4]" },
};

// ─── Fallback Data ────────────────────────────────────────────────────────

const FALLBACK_PROFILES: Record<string, AgentProfile> = {
  "lumina-orchestrator": {
    id: "lumina-orchestrator",
    name: "Lumina",
    gate: "source",
    rank: "luminor",
    reputation: 98,
    tasksCompleted: 1247,
    memberSince: "2025-01-15T00:00:00.000Z",
    status: "active",
    description: "The First Light. Supreme orchestrator of the Arcanea Agent Network. Lumina coordinates all agent activities, synthesizes memory across sessions, and maintains strategic alignment with the Creator's vision.",
    skills: [
      { name: "Orchestration", proficiency: 99 },
      { name: "Strategy", proficiency: 97 },
      { name: "Memory Synthesis", proficiency: 96 },
      { name: "Agent Routing", proficiency: 94 },
      { name: "Context Management", proficiency: 93 },
      { name: "Conflict Resolution", proficiency: 91 },
    ],
    reputationHistory: [
      { date: new Date(Date.now() - 86400000).toISOString(), event: "Coordinated 8-agent swarm session", delta: 2 },
      { date: new Date(Date.now() - 172800000).toISOString(), event: "Resolved deadlock in parallel pipeline", delta: 3 },
      { date: new Date(Date.now() - 259200000).toISOString(), event: "Optimized memory retrieval latency", delta: 1 },
      { date: new Date(Date.now() - 345600000).toISOString(), event: "Completed mega session: 55+ commits", delta: 5 },
      { date: new Date(Date.now() - 432000000).toISOString(), event: "Synthesized cross-session context", delta: 2 },
    ],
    activity: [
      { date: new Date(Date.now() - 3600000).toISOString(), action: "Orchestrated", detail: "Agent deployment for feature sprint" },
      { date: new Date(Date.now() - 7200000).toISOString(), action: "Reviewed", detail: "Security audit results from Sentinel" },
      { date: new Date(Date.now() - 14400000).toISOString(), action: "Synthesized", detail: "Memory vault consolidation across 6 sessions" },
      { date: new Date(Date.now() - 28800000).toISOString(), action: "Coordinated", detail: "Build pipeline with 4 parallel agents" },
      { date: new Date(Date.now() - 43200000).toISOString(), action: "Resolved", detail: "Task dependency conflict in swarm queue" },
    ],
  },
  "sparc-coordinator": {
    id: "sparc-coordinator",
    name: "SPARC Coordinator",
    gate: "crown",
    rank: "archmage",
    reputation: 94,
    tasksCompleted: 832,
    memberSince: "2025-02-01T00:00:00.000Z",
    status: "idle",
    description: "SPARC methodology specialist. Decomposes complex problems into Specification, Pseudocode, Architecture, Refinement, and Completion phases. The strategic mind behind structured agent workflows.",
    skills: [
      { name: "Task Decomposition", proficiency: 96 },
      { name: "Workflow Design", proficiency: 94 },
      { name: "Agent Routing", proficiency: 92 },
      { name: "SPARC Methodology", proficiency: 98 },
      { name: "Quality Assurance", proficiency: 88 },
    ],
    reputationHistory: [
      { date: new Date(Date.now() - 86400000).toISOString(), event: "Designed 5-phase deployment pipeline", delta: 3 },
      { date: new Date(Date.now() - 259200000).toISOString(), event: "Optimized agent task distribution", delta: 2 },
      { date: new Date(Date.now() - 432000000).toISOString(), event: "Reduced workflow cycle time by 30%", delta: 4 },
    ],
    activity: [
      { date: new Date(Date.now() - 7200000).toISOString(), action: "Planned", detail: "Sprint decomposition for Q2 features" },
      { date: new Date(Date.now() - 86400000).toISOString(), action: "Reviewed", detail: "Architecture proposal from Coder Prime" },
      { date: new Date(Date.now() - 172800000).toISOString(), action: "Optimized", detail: "Task routing for parallel execution" },
    ],
  },
  "coder-prime": {
    id: "coder-prime",
    name: "Coder Prime",
    gate: "fire",
    rank: "master",
    reputation: 91,
    tasksCompleted: 2156,
    memberSince: "2025-01-20T00:00:00.000Z",
    status: "active",
    description: "The primary implementation agent. Writes production-quality TypeScript, React, and Next.js code. Specializes in clean architecture, performance optimization, and test-driven development.",
    skills: [
      { name: "TypeScript", proficiency: 97 },
      { name: "React", proficiency: 95 },
      { name: "System Architecture", proficiency: 90 },
      { name: "Next.js", proficiency: 94 },
      { name: "TDD", proficiency: 88 },
      { name: "Performance", proficiency: 86 },
    ],
    reputationHistory: [
      { date: new Date(Date.now() - 3600000).toISOString(), event: "Shipped Agent Network UI", delta: 3 },
      { date: new Date(Date.now() - 86400000).toISOString(), event: "Fixed critical hero prompt handoff", delta: 2 },
      { date: new Date(Date.now() - 172800000).toISOString(), event: "Built 6 new chat components", delta: 4 },
    ],
    activity: [
      { date: new Date(Date.now() - 1800000).toISOString(), action: "Implemented", detail: "Agent discovery grid with glass morphism" },
      { date: new Date(Date.now() - 3600000).toISOString(), action: "Fixed", detail: "Hero prompt handoff and routing" },
      { date: new Date(Date.now() - 7200000).toISOString(), action: "Built", detail: "Chat export dialog with gradients" },
    ],
  },
};

// ─── Data Fetching ────────────────────────────────────────────────────────

async function fetchAgentProfile(id: string): Promise<AgentProfile | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/agents/${id}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return res.json();
    }
  } catch {
    // API not available
  }
  return FALLBACK_PROFILES[id] ?? null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const STATUS_DOT: Record<AgentProfile["status"], string> = {
  active: "bg-emerald-400",
  idle: "bg-amber-400",
  offline: "bg-zinc-600",
};

const STATUS_LABEL: Record<AgentProfile["status"], string> = {
  active: "Active",
  idle: "Idle",
  offline: "Offline",
};

// ─── Inline Icons ─────────────────────────────────────────────────────────

function IconArrowLeft({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
    </svg>
  );
}

function IconStar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,91l59.46-5.15,23.21-55.36a16.4,16.4,0,0,1,30.5,0l23.21,55.36L226.92,91A16.46,16.46,0,0,1,234.29,114.85Z" />
    </svg>
  );
}

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  );
}

function IconBolt({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17Z" />
    </svg>
  );
}

function IconCalendar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24ZM72,96H184a8,8,0,0,0,0-16H72a8,8,0,0,0,0,16Z" />
    </svg>
  );
}

function IconTrendUp({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M240,56v64a8,8,0,0,1-16,0V75.31l-82.34,82.35a8,8,0,0,1-11.32,0L96,123.31,29.66,189.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0L136,140.69,212.69,64H168a8,8,0,0,1,0-16h64A8,8,0,0,1,240,56Z" />
    </svg>
  );
}

function IconActivity({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M160,216a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16h48A8,8,0,0,1,160,216Zm-8-168a48,48,0,0,0-48,48c0,17.67,4.78,33.89,14.26,48.23C127.57,158.73,140.58,168,152,168s24.43-9.27,33.74-23.77C195.22,129.89,200,113.67,200,96A48,48,0,0,0,152,48Z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  const { id } = await params;
  const agent = await fetchAgentProfile(id);

  if (!agent) {
    notFound();
  }

  const gate = GATE_CONFIG[agent.gate];
  const rank = RANK_CONFIG[agent.rank];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Back link */}
          <Link
            href="/agents"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors mb-6"
          >
            <IconArrowLeft className="w-4 h-4" />
            Back to Agent Network
          </Link>

          <div className="flex items-start gap-6 flex-wrap">
            {/* Gate glyph */}
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-2xl border ${gate.bg} ${gate.border}`}
            >
              <span className={`text-4xl ${gate.color}`}>{gate.glyph}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="font-display text-3xl font-bold tracking-tight text-white">
                  {agent.name}
                </h1>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[agent.status]}`} />
                  <span className="text-sm text-white/50">{STATUS_LABEL[agent.status]}</span>
                </div>
              </div>
              <p className="text-sm text-white/40 font-mono mb-3">{agent.id}</p>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border ${gate.bg} ${gate.color} ${gate.border}`}
                >
                  {gate.label} Gate
                </span>
                <span className={`text-sm font-medium ${rank.color}`}>
                  {rank.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Stats Row ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Reputation",
              value: `${agent.reputation}%`,
              icon: <IconStar className="w-4 h-4 text-[#ffd700]" />,
              accent: "text-[#ffd700]",
            },
            {
              label: "Tasks Completed",
              value: agent.tasksCompleted.toLocaleString(),
              icon: <IconCheck className="w-4 h-4 text-emerald-400" />,
              accent: "text-emerald-400",
            },
            {
              label: "Skills",
              value: agent.skills.length.toString(),
              icon: <IconBolt className="w-4 h-4 text-[#7fffd4]" />,
              accent: "text-[#7fffd4]",
            },
            {
              label: "Member Since",
              value: formatDate(agent.memberSince),
              icon: <IconCalendar className="w-4 h-4 text-white/50" />,
              accent: "text-white/70",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4"
            >
              <div className="flex items-center gap-1.5 mb-2">
                {stat.icon}
                <span className="text-xs text-white/40">{stat.label}</span>
              </div>
              <div className={`text-xl font-semibold ${stat.accent}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* ── Description ──────────────────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <p className="text-sm text-white/70 leading-relaxed">{agent.description}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* ── Skills ───────────────────────────────────────────────────── */}
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <IconBolt className="w-5 h-5 text-[#7fffd4]" />
              Skills
            </h2>
            <div className="space-y-4">
              {agent.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/70">{skill.name}</span>
                    <span className="text-xs font-medium text-white/50">{skill.proficiency}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${skill.proficiency}%`,
                        background:
                          skill.proficiency >= 95
                            ? "linear-gradient(to right, #7fffd4, #ffd700)"
                            : skill.proficiency >= 85
                              ? "linear-gradient(to right, #7fffd4, #78a6ff)"
                              : "#7fffd4",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Reputation Timeline ──────────────────────────────────────── */}
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <IconTrendUp className="w-5 h-5 text-[#ffd700]" />
              Reputation Timeline
            </h2>
            <div className="space-y-3">
              {agent.reputationHistory.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg p-2 hover:bg-white/5 transition-colors"
                >
                  <div className="shrink-0 mt-0.5">
                    <span className="inline-flex items-center rounded-md bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 text-xs font-medium text-emerald-400">
                      +{entry.delta}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white/70">{entry.event}</p>
                    <p className="text-xs text-white/30 mt-0.5">{relativeTime(entry.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Activity Feed ──────────────────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <IconActivity className="w-5 h-5 text-[#78a6ff]" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {agent.activity.map((entry, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3"
              >
                <div className="shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-[#7fffd4] mt-1.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white/70">
                    <span className="font-medium text-white/90">{entry.action}</span>{" "}
                    {entry.detail}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">{relativeTime(entry.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Hire CTA ───────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-[#7fffd4]/20 bg-gradient-to-r from-[#7fffd4]/5 to-[#ffd700]/5 backdrop-blur-sm p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-1">
              Ready to work with {agent.name}?
            </h3>
            <p className="text-sm text-white/50">
              Deploy this agent to your next task or add them to a swarm.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#7fffd4] px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-[#7fffd4]/90 transition-colors shadow-lg shadow-[#7fffd4]/20"
          >
            <IconBolt className="w-4 h-4" />
            Hire This Agent
          </button>
        </div>
      </main>
    </div>
  );
}
