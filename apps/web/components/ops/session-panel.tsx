import { cn } from "@/lib/utils";
import type { SessionEntry } from "@/lib/ops/types";

// ─── Session History Panel ─────────────────────────────────────────────────

const SESSION_STATUS_COLORS: Record<SessionEntry["status"], string> = {
  completed: "text-emerald-400",
  active: "text-[#7fffd4]",
  failed: "text-red-400",
};

const SESSION_STATUS_DOT: Record<SessionEntry["status"], string> = {
  completed: "bg-emerald-400",
  active: "bg-[#7fffd4]",
  failed: "bg-red-400",
};

interface SessionPanelProps {
  sessions: SessionEntry[];
}

export function SessionPanel({ sessions }: SessionPanelProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[#a78bfa] to-[#f472b6]" />
        <h3 className="font-display text-lg font-semibold tracking-wide text-white/90">
          Session History
        </h3>
        <span className="text-xs text-white/40 font-mono">
          {sessions.length} recent
        </span>
      </div>

      <div
        className="overflow-hidden rounded-xl border border-white/[0.06]"
        style={{
          background:
            "linear-gradient(145deg, rgba(18,18,24,0.75) 0%, rgba(12,12,18,0.85) 100%)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="divide-y divide-white/[0.04]">
          {sessions.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Session Row ───────────────────────────────────────────────────────────

function SessionRow({ session }: { session: SessionEntry }) {
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
      {/* Status dot */}
      <div
        className={cn(
          "h-2 w-2 rounded-full shrink-0",
          SESSION_STATUS_DOT[session.status],
        )}
      />

      {/* Time */}
      <div className="w-24 shrink-0">
        <p className="text-xs text-white/60 font-mono">{dateStr}</p>
        <p className="text-xs text-white/60 font-mono">{timeStr}</p>
      </div>

      {/* Summary */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/75 truncate">
          {session.summary || "Untitled session"}
        </p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-4 text-xs text-white/40 shrink-0">
        <span className="font-mono">{session.duration}</span>
        <span>
          {session.agentCount} agent{session.agentCount !== 1 ? "s" : ""}
        </span>
        <span>{session.tasksCompleted} tasks</span>
      </div>

      {/* Status */}
      <span
        className={cn(
          "text-xs font-medium capitalize shrink-0",
          SESSION_STATUS_COLORS[session.status],
        )}
      >
        {session.status}
      </span>
    </div>
  );
}
