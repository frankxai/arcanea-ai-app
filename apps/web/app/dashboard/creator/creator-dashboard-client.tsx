'use client';

/**
 * Creator Dashboard — Client
 *
 * Fetches /api/creator/stats and renders:
 * - Stat strip (invocations, tokens, payout)
 * - Luminor list (forged agents with usage)
 * - Recent activity sparkline
 */

import { useEffect, useState } from 'react';

interface CreatorStats {
  creator: {
    user_id: string;
    display_name: string;
    attribution_score: number;
    total_earned: number;
    agent_count: number;
  };
  agents: Array<{
    id: string;
    name: string;
    title?: string;
    category?: string;
    usage_count?: number;
    rating?: number;
    is_published?: boolean;
    tags?: string[];
  }>;
  usage: {
    totalInvocations30d: number;
    totalTokens30d: number;
    totalCredits30d: number;
    byAgent: Record<string, { invocations: number; tokens: number; credits: number }>;
    daily: Array<{ date: string; invocations: number; tokens: number; credits: number }>;
  };
  revenue: {
    grossAll: number;
    platformFeeAll: number;
    creatorPayoutAll: number;
    byAgent: Record<string, { gross: number; fee: number; payout: number }>;
    daily: Array<{ date: string; gross: number; payout: number }>;
  };
}

export function CreatorDashboardClient() {
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/creator/stats');
        if (!res.ok) {
          throw new Error(
            res.status === 401 ? 'Sign in to view your creator dashboard.' : `Error ${res.status}`
          );
        }
        const data = (await res.json()) as CreatorStats;
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center text-sm text-white/40">
        Loading your forge…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <div className="text-sm text-white/60">{error}</div>
      </div>
    );
  }

  if (!stats) return null;

  const formatNum = (n: number) => n.toLocaleString();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Forged Luminors"
          value={formatNum(stats.agents.length)}
          sub={stats.agents.filter((a) => a.is_published).length + ' published'}
        />
        <StatCard
          label="Invocations (30d)"
          value={formatNum(stats.usage.totalInvocations30d)}
          sub={formatNum(stats.usage.totalTokens30d) + ' tokens'}
        />
        <StatCard
          label="Credits Consumed (30d)"
          value={formatNum(stats.usage.totalCredits30d)}
          sub="by users"
        />
        <StatCard
          label="Creator Payout (30d)"
          value={formatNum(stats.revenue.creatorPayoutAll)}
          sub={`${formatNum(stats.revenue.grossAll)} gross · ${formatNum(stats.revenue.platformFeeAll)} fee`}
          accent
        />
      </div>

      {stats.usage.daily.length > 0 && (
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-sm uppercase tracking-[0.2em] text-white/60">
              Daily Invocations (last 30 days)
            </h2>
            <div className="text-xs text-white/40">
              Peak: {Math.max(...stats.usage.daily.map((d) => d.invocations))}
            </div>
          </div>
          <Sparkline data={stats.usage.daily.map((d) => d.invocations)} color="#00bcd4" />
        </section>
      )}

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="mb-4 font-display text-sm uppercase tracking-[0.2em] text-white/60">
          Your Luminors
        </h2>
        {stats.agents.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-white/40">No Luminors forged yet.</p>
            <a
              href="/forge/luminor"
              className="mt-4 inline-block rounded-lg border border-[#ffd700]/30 bg-[#ffd700]/[0.08] px-4 py-2 text-xs font-medium text-[#ffd700] transition hover:border-[#ffd700]/50 hover:bg-[#ffd700]/[0.15]"
            >
              Forge your first Luminor →
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {stats.agents.map((agent) => {
              const usage = stats.usage.byAgent[agent.id];
              const revenue = stats.revenue.byAgent[agent.id];
              return (
                <div
                  key={agent.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] px-4 py-3 transition hover:border-white/10 hover:bg-white/[0.03]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white/90">{agent.name}</span>
                      {agent.is_published ? (
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-400">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/40">
                          Draft
                        </span>
                      )}
                    </div>
                    {agent.title && (
                      <div className="mt-0.5 truncate text-xs text-white/40">
                        {agent.title}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-6 text-right text-xs">
                    <div>
                      <div className="text-white/30">30d invocations</div>
                      <div className="text-white/80">{formatNum(usage?.invocations ?? 0)}</div>
                    </div>
                    <div>
                      <div className="text-white/30">credits earned</div>
                      <div className="text-white/80">{formatNum(revenue?.payout ?? 0)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="text-center text-[11px] text-white/30">
        Revenue share: 85% creator · 15% platform · Transparent attribution logged in{' '}
        <code className="text-white/50">revenue_events</code>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        accent
          ? 'border-[#ffd700]/20 bg-[#ffd700]/[0.03]'
          : 'border-white/[0.06] bg-white/[0.02]'
      }`}
    >
      <div className="text-[10px] uppercase tracking-widest text-white/40">{label}</div>
      <div
        className={`mt-1 font-display text-2xl font-semibold ${
          accent ? 'text-[#ffd700]' : 'text-white/90'
        }`}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-[11px] text-white/40">{sub}</div>}
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length === 0) return null;
  const max = Math.max(1, ...data);
  const width = 800;
  const height = 80;
  const step = width / Math.max(data.length - 1, 1);
  const points = data
    .map((v, i) => `${(i * step).toFixed(1)},${(height - (v / max) * height).toFixed(1)}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-20 w-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.9"
      />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={i * step}
          cy={height - (v / max) * height}
          r="1.5"
          fill={color}
          opacity="0.6"
        />
      ))}
    </svg>
  );
}
