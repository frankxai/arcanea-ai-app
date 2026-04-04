import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'ArcaneaClaw Fleet Dashboard',
  description: 'Operational dashboard for the ArcaneaClaw media engine fleet.',
};

export const dynamic = 'force-dynamic';

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function relativeTime(iso: string | null): string {
  if (!iso) return 'never';
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === 'online'
      ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
      : status === 'busy'
        ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
        : 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.5)]';
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
}

function ProfileBadge({ profile }: { profile: string }) {
  const colors: Record<string, string> = {
    media: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    forge: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    herald: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
    scout: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    scribe: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  };
  const cls = colors[profile] ?? 'bg-white/5 text-white/50 border-white/10';
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${cls}`}>
      {profile}
    </span>
  );
}

function AssetStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: 'text-sky-400',
    classified: 'text-violet-400',
    processed: 'text-amber-400',
    scored: 'text-teal-400',
    approved: 'text-emerald-400',
    rejected: 'text-red-400',
  };
  return (
    <span className={`text-xs font-mono ${colors[status] ?? 'text-white/40'}`}>
      {status}
    </span>
  );
}

function StatCard({
  label,
  value,
  accent = 'text-teal-400',
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-5">
      <p className={`text-2xl font-display font-bold ${accent}`}>{value}</p>
      <p className="text-xs font-mono text-white/30 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

/* ─── Data Fetching ────────────────────────────────────────────────────────── */

async function getFleetData() {
  const supabase = await createClient();

  // Run all queries in parallel
  const [
    agentsResult,
    assetsCountResult,
    assetsByStatusResult,
    recentAssetsResult,
    socialQueueResult,
  ] = await Promise.all([
    // Agent registry
    supabase
      .from('agent_registry')
      .select('*')
      .order('last_heartbeat', { ascending: false }),

    // Total asset count
    supabase
      .from('asset_metadata')
      .select('*', { count: 'exact', head: true }),

    // Assets grouped by status — fetch all and count client-side
    supabase
      .from('asset_metadata')
      .select('status, quality_tier'),

    // Recent 10 assets
    supabase
      .from('asset_metadata')
      .select('id, file_name, guardian, status, quality_score, quality_tier, created_at')
      .order('created_at', { ascending: false })
      .limit(10),

    // Social queue
    supabase
      .from('social_queue')
      .select('platform, status'),
  ]);

  // Count assets by status
  const statusCounts: Record<string, number> = {};
  const tierCounts: Record<string, number> = {};
  if (assetsByStatusResult.data) {
    for (const row of assetsByStatusResult.data) {
      const s = (row as { status?: string }).status ?? 'unknown';
      const t = (row as { quality_tier?: string }).quality_tier ?? 'unscored';
      statusCounts[s] = (statusCounts[s] ?? 0) + 1;
      tierCounts[t] = (tierCounts[t] ?? 0) + 1;
    }
  }

  // Count social queue by platform+status
  const socialByPlatform: Record<string, Record<string, number>> = {};
  if (socialQueueResult.data) {
    for (const row of socialQueueResult.data) {
      const p = (row as { platform?: string }).platform ?? 'unknown';
      const s = (row as { status?: string }).status ?? 'unknown';
      if (!socialByPlatform[p]) socialByPlatform[p] = {};
      socialByPlatform[p][s] = (socialByPlatform[p][s] ?? 0) + 1;
    }
  }

  return {
    agents: agentsResult.data ?? [],
    totalAssets: assetsCountResult.count ?? 0,
    statusCounts,
    tierCounts,
    recentAssets: recentAssetsResult.data ?? [],
    socialByPlatform,
    // Track errors for graceful degradation
    errors: [
      agentsResult.error,
      assetsCountResult.error,
      assetsByStatusResult.error,
      recentAssetsResult.error,
      socialQueueResult.error,
    ].filter(Boolean),
  };
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default async function ClawDashboardPage() {
  const data = await getFleetData();
  const onlineCount = data.agents.filter(
    (a: { status?: string }) => a.status === 'online'
  ).length;
  const totalAgents = data.agents.length;
  const hasErrors = data.errors.length > 0;

  const STATUS_ORDER = ['new', 'classified', 'processed', 'scored', 'approved', 'rejected'];

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(127,255,212,0.05),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(120,166,255,0.03),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* ── Fleet Header ──────────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
                  ArcaneaClaw Fleet
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono ${
                    onlineCount > 0
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      onlineCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'
                    }`}
                  />
                  {onlineCount > 0
                    ? `${onlineCount}/${totalAgents} online`
                    : totalAgents > 0
                      ? 'all offline'
                      : 'no agents'}
                </span>
              </div>
              <p className="text-sm text-white/40">
                Operational dashboard for the ArcaneaClaw media engine.
              </p>
            </div>
            <Link
              href="/claw"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/60 text-sm hover:border-white/[0.12] hover:text-white/80 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Claw
            </Link>
          </div>
        </section>

        {/* ── Error Banner ──────────────────────────────────────────────── */}
        {hasErrors && (
          <div className="mb-8 rounded-2xl bg-amber-500/5 border border-amber-500/15 px-6 py-4">
            <p className="text-sm text-amber-400/90">
              Some queries failed. Tables may not exist yet — deploy the Claw schema to Supabase to populate this dashboard.
            </p>
          </div>
        )}

        {/* ── Asset Pipeline Stats ──────────────────────────────────────── */}
        <section className="mb-10" aria-labelledby="pipeline-heading">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">
            Asset Pipeline
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <StatCard label="Total Assets" value={data.totalAssets} accent="text-white" />
            {STATUS_ORDER.map((s) => (
              <StatCard
                key={s}
                label={s}
                value={data.statusCounts[s] ?? 0}
                accent={
                  s === 'approved'
                    ? 'text-emerald-400'
                    : s === 'scored'
                      ? 'text-teal-400'
                      : s === 'rejected'
                        ? 'text-red-400'
                        : 'text-white/70'
                }
              />
            ))}
          </div>
        </section>

        {/* ── Quality Tier Breakdown ────────────────────────────────────── */}
        {Object.keys(data.tierCounts).length > 0 && (
          <section className="mb-10">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">
              Quality Tiers
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.entries(data.tierCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([tier, count]) => (
                  <StatCard
                    key={tier}
                    label={tier}
                    value={count}
                    accent="text-[#ffd700]"
                  />
                ))}
            </div>
          </section>
        )}

        {/* ── Agent Registry ────────────────────────────────────────────── */}
        <section className="mb-10" aria-labelledby="agents-heading">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">
            Agent Registry
          </p>

          {data.agents.length === 0 ? (
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.04] p-10 text-center">
              <p className="text-white/30 text-sm">
                No agents registered. Deploy ArcaneaClaw to populate the fleet.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.agents.map((agent: Record<string, unknown>) => (
                <div
                  key={String(agent.id ?? agent.name)}
                  className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-5 hover:border-white/[0.10] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <StatusDot status={String(agent.status ?? 'offline')} />
                      <h3 className="text-sm font-semibold text-white/90">
                        {String(agent.name ?? 'unnamed')}
                      </h3>
                    </div>
                    {agent.profile_type && (
                      <ProfileBadge profile={String(agent.profile_type)} />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span>
                      Heartbeat:{' '}
                      <span className="text-white/50">
                        {relativeTime(agent.last_heartbeat as string | null)}
                      </span>
                    </span>
                    {agent.version && (
                      <span className="text-white/20">v{String(agent.version)}</span>
                    )}
                  </div>
                  {agent.capabilities && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {(Array.isArray(agent.capabilities)
                        ? agent.capabilities
                        : []
                      )
                        .slice(0, 4)
                        .map((cap: unknown) => (
                          <span
                            key={String(cap)}
                            className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/25 border border-white/[0.04]"
                          >
                            {String(cap)}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Recent Activity ───────────────────────────────────────────── */}
        <section className="mb-10" aria-labelledby="recent-heading">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">
            Recent Activity
          </p>

          {data.recentAssets.length === 0 ? (
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.04] p-10 text-center">
              <p className="text-white/30 text-sm">
                No assets processed yet.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.04] overflow-hidden">
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[1fr_120px_100px_80px_100px] gap-4 px-5 py-3 border-b border-white/[0.04] text-xs font-mono text-white/20 uppercase tracking-wider">
                <span>File</span>
                <span>Guardian</span>
                <span>Status</span>
                <span>Score</span>
                <span>When</span>
              </div>

              {data.recentAssets.map((asset: Record<string, unknown>) => (
                <div
                  key={String(asset.id)}
                  className="grid sm:grid-cols-[1fr_120px_100px_80px_100px] gap-2 sm:gap-4 px-5 py-3.5 border-b border-white/[0.02] hover:bg-white/[0.015] transition-colors"
                >
                  <span className="text-sm text-white/70 truncate">
                    {String(asset.file_name ?? '—')}
                  </span>
                  <span className="text-xs text-white/40 truncate">
                    {String(asset.guardian ?? '—')}
                  </span>
                  <AssetStatusBadge status={String(asset.status ?? 'unknown')} />
                  <span className="text-xs font-mono text-teal-400/80">
                    {asset.quality_score != null
                      ? Number(asset.quality_score).toFixed(1)
                      : '—'}
                  </span>
                  <span className="text-xs text-white/25">
                    {relativeTime(asset.created_at as string | null)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Social Queue ──────────────────────────────────────────────── */}
        <section className="mb-10" aria-labelledby="social-heading">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">
            Social Queue
          </p>

          {Object.keys(data.socialByPlatform).length === 0 ? (
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.04] p-10 text-center">
              <p className="text-white/30 text-sm">
                No items in the social queue.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(data.socialByPlatform).map(([platform, statuses]) => {
                const total = Object.values(statuses).reduce((a, b) => a + b, 0);
                return (
                  <div
                    key={platform}
                    className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white/80 capitalize">
                        {platform}
                      </h3>
                      <span className="text-lg font-display font-bold text-[#7fffd4]">
                        {total}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(statuses).map(([s, count]) => (
                        <span
                          key={s}
                          className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-white/30 border border-white/[0.04]"
                        >
                          {s}: {count}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
