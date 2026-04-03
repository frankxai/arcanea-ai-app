'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WorldGap {
  type: string;
  severity: 'critical' | 'important' | 'nice_to_have' | string;
  description: string;
  suggestion: string;
  toolToUse: string;
}

export interface WorldNextAction {
  priority: number;
  action: string;
  tool: string;
}

export interface WorldDashboardProps {
  health: number;
  grade: string;
  strengths: string[];
  gaps: WorldGap[];
  nextActions: WorldNextAction[];
  narrativePotential: string;
  worldPersonality: string;
  className?: string;
}

// ─── Health Gauge ─────────────────────────────────────────────────────────────

function getHealthColor(score: number): { stroke: string; glow: string; grade: string } {
  if (score >= 80) return { stroke: '#22c55e', glow: 'rgba(34,197,94,0.4)', grade: 'text-green-400' };
  if (score >= 60) return { stroke: '#7fffd4', glow: 'rgba(127,255,212,0.4)', grade: 'text-[#7fffd4]' };
  if (score >= 40) return { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.4)', grade: 'text-amber-400' };
  return { stroke: '#ef4444', glow: 'rgba(239,68,68,0.4)', grade: 'text-red-400' };
}

const GAUGE_RADIUS = 54;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;
// Arc spans 270 degrees (start at 225deg, end at 135deg going clockwise)
const ARC_FRACTION = 0.75;

function HealthGauge({ score, grade }: { score: number; grade: string }) {
  const clampedScore = Math.min(100, Math.max(0, score));
  const colors = getHealthColor(clampedScore);
  const filled = (clampedScore / 100) * ARC_FRACTION * GAUGE_CIRCUMFERENCE;
  const dashOffset = GAUGE_CIRCUMFERENCE * (1 - ARC_FRACTION);

  // SVG: rotate so the gap is at the bottom
  // strokeDasharray: [filled, gap_to_empty_arc, remainder_of_circle]
  const trackDash = `${ARC_FRACTION * GAUGE_CIRCUMFERENCE} ${GAUGE_CIRCUMFERENCE * (1 - ARC_FRACTION)}`;
  const fillDash = `${filled} ${GAUGE_CIRCUMFERENCE - filled}`;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width="136"
        height="136"
        viewBox="0 0 136 136"
        className="overflow-visible"
        aria-label={`World health: ${clampedScore} out of 100`}
        role="img"
      >
        {/* Track */}
        <circle
          cx="68"
          cy="68"
          r={GAUGE_RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={trackDash}
          strokeDashoffset={`-${dashOffset / 2}`}
          transform="rotate(135 68 68)"
        />
        {/* Fill */}
        <circle
          cx="68"
          cy="68"
          r={GAUGE_RADIUS}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={fillDash}
          strokeDashoffset={`-${dashOffset / 2}`}
          transform="rotate(135 68 68)"
          style={{
            filter: `drop-shadow(0 0 8px ${colors.glow})`,
            transition: 'stroke-dasharray 1s cubic-bezier(0.22,1,0.36,1)',
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn('font-display text-3xl font-bold leading-none', colors.grade)}
          style={{ textShadow: `0 0 20px ${colors.glow}` }}
        >
          {grade}
        </span>
        <span className="font-mono text-sm text-white/40 tabular-nums mt-1">{clampedScore}</span>
      </div>
    </div>
  );
}

// ─── Severity Badge ───────────────────────────────────────────────────────────

const SEVERITY_CLASSES: Record<string, string> = {
  critical: 'bg-red-500/15 border-red-500/30 text-red-400',
  important: 'bg-amber-400/15 border-amber-400/30 text-amber-400',
  nice_to_have: 'bg-white/5 border-white/10 text-white/40',
};

function SeverityBadge({ severity }: { severity: string }) {
  const classes = SEVERITY_CLASSES[severity] ?? SEVERITY_CLASSES.nice_to_have;
  const label = severity === 'nice_to_have' ? 'Nice to Have' : severity.charAt(0).toUpperCase() + severity.slice(1);

  return (
    <span
      className={cn(
        'inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold font-sans border',
        classes
      )}
    >
      {label}
    </span>
  );
}

// ─── Gap Card ─────────────────────────────────────────────────────────────────

function GapCard({ gap }: { gap: WorldGap }) {
  const isCritical = gap.severity === 'critical';
  const isImportant = gap.severity === 'important';

  return (
    <div
      className={cn(
        'rounded-xl p-4 space-y-3 transition-all duration-200',
        'hover:bg-white/[0.025]',
      )}
      style={{
        background: isCritical
          ? 'rgba(239,68,68,0.04)'
          : isImportant
          ? 'rgba(245,158,11,0.04)'
          : 'rgba(255,255,255,0.02)',
        border: isCritical
          ? '1px solid rgba(239,68,68,0.15)'
          : isImportant
          ? '1px solid rgba(245,158,11,0.12)'
          : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white/80 font-sans leading-snug">{gap.type}</p>
          <p className="text-xs text-white/40 font-sans mt-0.5 leading-relaxed">{gap.description}</p>
        </div>
        <SeverityBadge severity={gap.severity} />
      </div>

      {/* Suggestion */}
      <p className="text-xs text-white/55 font-sans leading-relaxed pl-0">
        {gap.suggestion}
      </p>

      {/* Fix button */}
      <button
        type="button"
        className={cn(
          'flex items-center gap-2 text-xs font-medium font-sans',
          'px-3 py-1.5 rounded-lg border transition-all duration-150',
          'hover:scale-[1.02] active:scale-[0.99]',
          isCritical
            ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/15'
            : isImportant
            ? 'bg-amber-400/10 border-amber-400/20 text-amber-400 hover:bg-amber-400/15'
            : 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:bg-white/[0.07]'
        )}
      >
        <span className="w-3 h-3 rounded-sm border border-current opacity-60 flex items-center justify-center text-[8px]">
          ▶
        </span>
        Fix with {gap.toolToUse}
      </button>
    </div>
  );
}

// ─── WorldDashboard ───────────────────────────────────────────────────────────

const NARRATIVE_POTENTIAL_CLASSES: Record<string, string> = {
  Excellent: 'bg-[#7fffd4]/10 border-[#7fffd4]/30 text-[#7fffd4]',
  High: 'bg-[#78a6ff]/10 border-[#78a6ff]/30 text-[#78a6ff]',
  Moderate: 'bg-amber-400/10 border-amber-400/30 text-amber-400',
  Low: 'bg-white/5 border-white/10 text-white/40',
};

export function WorldDashboard({
  health,
  grade,
  strengths,
  gaps,
  nextActions,
  narrativePotential,
  worldPersonality,
  className,
}: WorldDashboardProps) {
  const sortedGaps = [...gaps].sort((a, b) => {
    const order = { critical: 0, important: 1, nice_to_have: 2 };
    const aOrder = order[a.severity as keyof typeof order] ?? 3;
    const bOrder = order[b.severity as keyof typeof order] ?? 3;
    return aOrder - bOrder;
  });

  const sortedActions = [...nextActions].sort((a, b) => a.priority - b.priority);

  const narrativeBadgeClass =
    NARRATIVE_POTENTIAL_CLASSES[narrativePotential] ??
    'bg-white/5 border-white/10 text-white/40';

  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden',
        'backdrop-blur-xl',
        className
      )}
      style={{
        background: 'linear-gradient(145deg, rgba(12,12,20,0.94) 0%, rgba(9,9,11,0.97) 100%)',
        border: '1px solid rgba(127,255,212,0.08)',
        boxShadow: [
          'inset 0 1px 0 rgba(255,255,255,0.04)',
          '0 24px 64px rgba(0,0,0,0.45)',
          '0 0 0 1px rgba(127,255,212,0.03)',
        ].join(', '),
      }}
    >
      {/* Top iridescent edge */}
      <div
        className="h-px w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(127,255,212,0.3), rgba(120,166,255,0.2), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="p-6 space-y-6">

        {/* Header: gauge + personality + narrative */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <HealthGauge score={health} grade={grade} />

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-lg font-bold text-white leading-tight">
                World Health Report
              </h2>
              <span
                className={cn(
                  'inline-flex items-center h-5 px-2.5 rounded-full text-[11px] font-semibold font-sans border',
                  narrativeBadgeClass
                )}
              >
                {narrativePotential} Potential
              </span>
            </div>

            <p className="text-sm text-white/50 font-sans leading-relaxed">
              {worldPersonality}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/[0.05]" aria-hidden="true" />

        {/* Two-column layout on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Strengths */}
          {strengths.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest font-sans">
                Strengths
              </h3>
              <ul className="space-y-2">
                {strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="mt-[3px] flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{
                        background: 'rgba(34,197,94,0.12)',
                        border: '1px solid rgba(34,197,94,0.25)',
                        color: '#86efac',
                      }}
                    >
                      ✓
                    </span>
                    <span className="text-sm text-white/60 font-sans leading-snug">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Actions */}
          {sortedActions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest font-sans">
                Next Actions
              </h3>
              <ol className="space-y-2">
                {sortedActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-[1px] flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono tabular-nums"
                      style={{
                        background: 'rgba(120,166,255,0.1)',
                        border: '1px solid rgba(120,166,255,0.2)',
                        color: '#78a6ff',
                      }}
                    >
                      {action.priority}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-white/65 font-sans leading-snug">{action.action}</p>
                      <p className="text-[11px] text-[#7fffd4]/40 font-sans mt-0.5">{action.tool}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Gaps — full width */}
        {sortedGaps.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest font-sans">
                Gaps to Address
              </h3>
              <span className="text-xs text-white/25 font-sans">
                {sortedGaps.filter((g) => g.severity === 'critical').length} critical
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sortedGaps.map((gap, i) => (
                <GapCard key={i} gap={gap} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
