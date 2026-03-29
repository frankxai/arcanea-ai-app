import { cn } from "@/lib/utils";
import type { AgentStatus } from "@/lib/ops/types";

// ─── Agent Status Colors ───────────────────────────────────────────────────

const STATUS_COLORS: Record<AgentStatus["status"], string> = {
  active: "bg-emerald-400",
  idle: "bg-amber-400",
  error: "bg-red-400",
  offline: "bg-zinc-600",
};

const STATUS_RING: Record<AgentStatus["status"], string> = {
  active: "ring-emerald-400/30",
  idle: "ring-amber-400/20",
  error: "ring-red-400/30",
  offline: "ring-zinc-600/20",
};

const STATUS_TEXT: Record<AgentStatus["status"], string> = {
  active: "text-emerald-400",
  idle: "text-amber-400",
  error: "text-red-400",
  offline: "text-zinc-500",
};

const TYPE_LABELS: Record<string, string> = {
  orchestrator: "Orchestrator",
  coordinator: "Coordinator",
  worker: "Worker",
  specialist: "Specialist",
};

// ─── Panel ─────────────────────────────────────────────────────────────────

interface AgentPanelProps {
  agents: AgentStatus[];
}

export function AgentPanel({ agents }: AgentPanelProps) {
  const activeCount = agents.filter((a) => a.status === "active").length;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[#ffd700] to-[#f59e0b]" />
          <h3 className="font-display text-lg font-semibold tracking-wide text-white/90">
            Agent Orchestrator
          </h3>
          <span className="text-xs text-white/40 font-mono">
            {activeCount} active
          </span>
        </div>
      </div>

      <div
        className="overflow-hidden rounded-xl border border-white/[0.06]"
        style={{
          background:
            "linear-gradient(145deg, rgba(18,18,24,0.75) 0%, rgba(12,12,18,0.85) 100%)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Agent Card ────────────────────────────────────────────────────────────

function AgentCard({ agent }: { agent: AgentStatus }) {
  const relativeTime = formatAgentTime(agent.lastActive);

  return (
    <div className="bg-[rgba(12,12,18,0.6)] p-4 transition-colors hover:bg-white/[0.02]">
      <div className="flex items-start justify-between">
        {/* Identity */}
        <div className="flex items-center gap-3">
          {/* Status dot with ring */}
          <div className="relative">
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full ring-4",
                STATUS_COLORS[agent.status],
                STATUS_RING[agent.status],
              )}
            />
            {agent.status === "active" && (
              <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping opacity-50" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white/85">{agent.name}</p>
            <p className="text-xs text-white/35">
              {TYPE_LABELS[agent.type] ?? agent.type}
            </p>
          </div>
        </div>

        {/* Status label */}
        <span
          className={cn(
            "text-xs font-medium capitalize",
            STATUS_TEXT[agent.status],
          )}
        >
          {agent.status}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-xs text-white/30">
        <span>Last active: {relativeTime}</span>
        {agent.taskCount > 0 && (
          <span className="font-mono">{agent.taskCount} tasks</span>
        )}
      </div>
    </div>
  );
}

// ─── Time Format ───────────────────────────────────────────────────────────

function formatAgentTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
