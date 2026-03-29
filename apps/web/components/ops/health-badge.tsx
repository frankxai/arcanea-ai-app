import { cn } from "@/lib/utils";
import type { HealthLevel, BuildStatus } from "@/lib/ops/types";

// ─── Health Level Badge ────────────────────────────────────────────────────

const HEALTH_COLORS: Record<HealthLevel, string> = {
  healthy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  critical: "bg-red-500/15 text-red-400 border-red-500/25",
  unknown: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25",
};

const HEALTH_DOT: Record<HealthLevel, string> = {
  healthy: "bg-emerald-400",
  warning: "bg-amber-400",
  critical: "bg-red-400",
  unknown: "bg-zinc-400",
};

interface HealthBadgeProps {
  level: HealthLevel;
  label?: string;
  className?: string;
}

export function HealthBadge({ level, label, className }: HealthBadgeProps) {
  const displayLabel = label ?? level.charAt(0).toUpperCase() + level.slice(1);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        HEALTH_COLORS[level],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", HEALTH_DOT[level])} />
      {displayLabel}
    </span>
  );
}

// ─── Build Status Badge ────────────────────────────────────────────────────

const BUILD_STYLES: Record<BuildStatus, string> = {
  success: "text-emerald-400",
  failure: "text-red-400",
  pending: "text-amber-400",
  no_status: "text-zinc-500",
  error: "text-red-400",
};

const BUILD_LABELS: Record<BuildStatus, string> = {
  success: "Passing",
  failure: "Failing",
  pending: "Running",
  no_status: "No CI",
  error: "Error",
};

interface BuildStatusBadgeProps {
  status: BuildStatus;
  className?: string;
}

export function BuildStatusBadge({ status, className }: BuildStatusBadgeProps) {
  return (
    <span className={cn("text-xs font-medium", BUILD_STYLES[status], className)}>
      {BUILD_LABELS[status]}
    </span>
  );
}

// ─── Health Score Indicator ────────────────────────────────────────────────

interface HealthScoreProps {
  score: number;
  level: HealthLevel;
  size?: "sm" | "md";
  className?: string;
}

export function HealthScore({
  score,
  level,
  size = "sm",
  className,
}: HealthScoreProps) {
  const colorMap: Record<HealthLevel, string> = {
    healthy: "text-emerald-400",
    warning: "text-amber-400",
    critical: "text-red-400",
    unknown: "text-zinc-400",
  };

  const barColor: Record<HealthLevel, string> = {
    healthy: "bg-emerald-400",
    warning: "bg-amber-400",
    critical: "bg-red-400",
    unknown: "bg-zinc-400",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "h-1.5 rounded-full bg-white/5 overflow-hidden",
          size === "sm" ? "w-12" : "w-20",
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all", barColor[level])}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className={cn(
          "font-mono font-medium tabular-nums",
          size === "sm" ? "text-xs" : "text-sm",
          colorMap[level],
        )}
      >
        {score}
      </span>
    </div>
  );
}
