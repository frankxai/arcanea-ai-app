import { cn } from "@/lib/utils";
import type { SystemHealth, SystemMetric } from "@/lib/ops/types";
import { HealthBadge } from "./health-badge";

// ─── System Health Card ────────────────────────────────────────────────────

const SYSTEM_ACCENTS: Record<string, string> = {
  SIS: "border-[#78a6ff]/20 hover:border-[#78a6ff]/35",
  ACOS: "border-[#7fffd4]/20 hover:border-[#7fffd4]/35",
  AIOS: "border-[#a78bfa]/20 hover:border-[#a78bfa]/35",
  FLOW: "border-[#ffd700]/20 hover:border-[#ffd700]/35",
};

const SYSTEM_GLOW: Record<string, string> = {
  SIS: "rgba(120, 166, 255, 0.06)",
  ACOS: "rgba(127, 255, 212, 0.06)",
  AIOS: "rgba(167, 139, 250, 0.06)",
  FLOW: "rgba(255, 215, 0, 0.06)",
};

const ACRONYM_COLORS: Record<string, string> = {
  SIS: "text-[#78a6ff]",
  ACOS: "text-[#7fffd4]",
  AIOS: "text-[#a78bfa]",
  FLOW: "text-[#ffd700]",
};

interface SystemPanelProps {
  systems: SystemHealth[];
}

export function SystemPanel({ systems }: SystemPanelProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 px-1">
        <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[#7fffd4] to-[#a78bfa]" />
        <h3 className="font-display text-lg font-semibold tracking-wide text-white/90">
          Intelligence Systems
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systems.map((system) => (
          <SystemCard key={system.acronym} system={system} />
        ))}
      </div>
    </section>
  );
}

function SystemCard({ system }: { system: SystemHealth }) {
  const accent = SYSTEM_ACCENTS[system.acronym] ?? "border-white/10";
  const glow = SYSTEM_GLOW[system.acronym] ?? "rgba(255,255,255,0.03)";
  const acronymColor = ACRONYM_COLORS[system.acronym] ?? "text-white/70";

  return (
    <div
      className={cn(
        "relative rounded-xl border p-4 transition-all duration-200",
        accent,
      )}
      style={{
        background: `linear-gradient(145deg, rgba(18,18,24,0.8), rgba(12,12,18,0.9))`,
        backdropFilter: "blur(24px)",
        boxShadow: `0 0 40px ${glow}, inset 0 1px 0 rgba(255,255,255,0.03)`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <span
            className={cn(
              "font-display text-xl font-bold tracking-wider",
              acronymColor,
            )}
          >
            {system.acronym}
          </span>
          <p className="text-xs text-white/40 mt-0.5">{system.name}</p>
        </div>
        <HealthBadge level={system.status} />
      </div>

      {/* Version + Uptime */}
      <div className="flex items-center gap-3 text-xs text-white/50 mb-3">
        <span className="font-mono">v{system.version}</span>
        <span className="text-white/20">|</span>
        <span>{system.uptime} uptime</span>
      </div>

      {/* Metrics */}
      <div className="space-y-1.5">
        {system.metrics.map((metric) => (
          <MetricRow key={metric.label} metric={metric} />
        ))}
      </div>
    </div>
  );
}

function MetricRow({ metric }: { metric: SystemMetric }) {
  const trendIcons: Record<string, string> = {
    up: "+",
    down: "-",
    stable: "=",
  };

  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-white/65">{metric.label}</span>
      <span className="text-white/70 font-mono">
        {metric.value}
        {metric.unit ? ` ${metric.unit}` : ""}
        {metric.trend && (
          <span
            className={cn(
              "ml-1",
              metric.trend === "up" && "text-emerald-400",
              metric.trend === "down" && "text-red-400",
              metric.trend === "stable" && "text-white/60",
            )}
          >
            {trendIcons[metric.trend]}
          </span>
        )}
      </span>
    </div>
  );
}
