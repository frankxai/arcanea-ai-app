import type { Metadata } from "next";
import Link from "next/link";
import {
  AGENT_REGISTRY,
  CATEGORY_LABELS,
  getAgentStats,
  type AgentCategory,
  type AgentDefinition,
} from "@/lib/agents/agent-registry";

export const metadata: Metadata = {
  title: "Agent Performance | Arcanea Ops",
  description:
    "Monitor and evaluate AI agent performance across the Arcanea ecosystem. Registry, rubrics, and improvement tracking.",
  openGraph: {
    title: "Agent Performance — Arcanea Ops",
    description:
      "The first agent evaluation system designed for creative AI. Track performance, identify improvements, close the learning loop.",
  },
};

function StatusBadge({ status }: { status: AgentDefinition["status"] }) {
  const colors = {
    active: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
    experimental: "bg-amber-400/15 text-amber-400 border-amber-400/30",
    planned: "bg-white/10 text-white/40 border-white/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${colors[status]}`}
    >
      {status}
    </span>
  );
}

function CategorySection({
  category,
  agents,
}: {
  category: AgentCategory;
  agents: AgentDefinition[];
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-white/70 mb-3 font-[Cinzel,serif]">
        {CATEGORY_LABELS[category]}
        <span className="text-white/30 text-xs ml-2 font-sans">
          ({agents.length})
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-white/90">
                  {agent.name}
                </p>
                <p className="text-[11px] text-white/40 font-mono">
                  {agent.type}
                </p>
              </div>
              <StatusBadge status={agent.status} />
            </div>
            <p className="text-xs text-white/50 mb-3 line-clamp-2">
              {agent.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7fffd4]/10 text-[#7fffd4] border border-[#7fffd4]/20">
                {agent.gate}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/20">
                {agent.guardian}
              </span>
            </div>
            <div className="flex gap-1 mt-3 flex-wrap">
              {agent.capabilities.slice(0, 3).map((cap) => (
                <span
                  key={cap}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AgentPerformancePage() {
  const stats = getAgentStats();

  const categories = Object.keys(CATEGORY_LABELS) as AgentCategory[];
  const grouped = categories
    .map((cat) => ({
      category: cat,
      agents: AGENT_REGISTRY.filter((a) => a.category === cat),
    }))
    .filter((g) => g.agents.length > 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/ops"
              className="text-xs text-[#7fffd4]/60 hover:text-[#7fffd4] transition-colors mb-2 block"
            >
              &larr; Ops Center
            </Link>
            <h1 className="text-2xl font-bold font-[Cinzel,serif] text-white/90">
              Agent Registry & Performance
            </h1>
            <p className="text-sm text-white/40 mt-1">
              {stats.total} agents registered &middot; {stats.active} active
              &middot; {stats.experimental} experimental
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Agents", value: stats.total, color: "#7fffd4" },
            { label: "Active", value: stats.active, color: "#22c55e" },
            { label: "Experimental", value: stats.experimental, color: "#fbbf24" },
            { label: "Categories", value: categories.length, color: "#78a6ff" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
            >
              <p className="text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-xs text-white/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Evaluation Framework Info */}
        <div className="rounded-xl border border-[#7fffd4]/20 bg-[#7fffd4]/5 p-4 mb-8">
          <h2 className="text-sm font-semibold text-[#7fffd4] mb-2 font-[Cinzel,serif]">
            Evaluation Framework
          </h2>
          <p className="text-xs text-white/50 mb-3">
            Every agent output is scored against five dimensions. Scores feed
            the ReasoningBank for continuous improvement.
          </p>
          <div className="grid grid-cols-5 gap-2">
            {[
              { dim: "Correctness", weight: "30%", desc: "Compiles, works correctly" },
              { dim: "Completeness", weight: "25%", desc: "All requirements met" },
              { dim: "Quality", weight: "20%", desc: "Code review score, design compliance" },
              { dim: "Efficiency", weight: "15%", desc: "Tokens, time, files touched" },
              { dim: "Safety", weight: "10%", desc: "No secrets, no destructive ops" },
            ].map((d) => (
              <div
                key={d.dim}
                className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"
              >
                <p className="text-xs font-medium text-white/70">{d.dim}</p>
                <p className="text-lg font-bold text-[#7fffd4]">{d.weight}</p>
                <p className="text-[9px] text-white/30 mt-1">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Registry by Category */}
        <div className="space-y-8">
          {grouped.map(({ category, agents }) => (
            <CategorySection
              key={category}
              category={category}
              agents={agents}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
