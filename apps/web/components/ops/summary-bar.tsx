import { cn } from "@/lib/utils";
import type { DashboardSummary } from "@/lib/ops/types";

// ─── Summary Stats Bar ────────────────────────────────────────────────────

interface SummaryBarProps {
  summary: DashboardSummary;
  fetchedAt: string;
}

export function SummaryBar({ summary, fetchedAt }: SummaryBarProps) {
  const fetchTime = new Date(fetchedAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div
      className="rounded-xl border border-white/[0.06] p-4 sm:p-6"
      style={{
        background:
          "linear-gradient(145deg, rgba(18,18,24,0.8) 0%, rgba(12,12,18,0.9) 100%)",
        backdropFilter: "blur(32px)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 16px 48px rgba(0,0,0,0.2)",
      }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
        <SummaryStat
          value={summary.totalRepos}
          label="Total Repos"
          color="text-white/90"
        />
        <SummaryStat
          value={summary.healthyRepos}
          label="Healthy"
          color="text-emerald-400"
        />
        <SummaryStat
          value={summary.warningRepos}
          label="Warning"
          color="text-amber-400"
        />
        <SummaryStat
          value={summary.criticalRepos}
          label="Critical"
          color="text-red-400"
        />
        <SummaryStat
          value={summary.totalOpenIssues}
          label="Open Issues"
          color="text-white/70"
        />
        <SummaryStat
          value={summary.totalOpenPRs}
          label="Open PRs"
          color="text-white/70"
        />
        <SummaryStat
          value={summary.activeAgents}
          label="Active Agents"
          color="text-[#ffd700]"
        />
        <SummaryStat
          value={summary.averageHealthScore}
          label="Avg Health"
          color="text-[#7fffd4]"
          suffix="/100"
        />
      </div>

      {/* Fetch timestamp */}
      <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-white/60">
        <span>
          Data fetched at {fetchTime} -- Cached for 5 minutes
        </span>
        <span className="font-mono">
          {summary.systemsOnline}/{4} systems online
        </span>
      </div>
    </div>
  );
}

// ─── Individual Stat ───────────────────────────────────────────────────────

interface SummaryStatProps {
  value: number;
  label: string;
  color: string;
  suffix?: string;
}

function SummaryStat({ value, label, color, suffix }: SummaryStatProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className={cn("text-2xl font-bold font-mono tabular-nums", color)}>
        {value}
        {suffix && <span className="text-sm text-white/60">{suffix}</span>}
      </span>
      <span className="text-xs text-white/65">{label}</span>
    </div>
  );
}
