'use client';

import type { CommandCenterStats, Guardian } from '@/lib/command-center/types';

const ELEMENT_COLORS: Record<string, string> = {
  Earth: '#22c55e',
  Water: '#3b82f6',
  Fire: '#ef4444',
  Wind: '#a855f7',
  Void: '#ffd700',
};

const TIER_COLORS: Record<string, string> = {
  hero: '#22c55e',
  gallery: '#3b82f6',
  thumbnail: '#eab308',
  reject: '#ef4444',
  unscored: '#6b7280',
};

const GUARDIANS: Guardian[] = [
  'Lyssandria',
  'Leyla',
  'Draconia',
  'Maylinn',
  'Alera',
  'Lyria',
  'Aiyami',
  'Elara',
  'Ino',
  'Shinkami',
];

interface StatsOverviewProps {
  stats: CommandCenterStats | null;
  loading: boolean;
}

export function StatsOverview({ stats, loading }: StatsOverviewProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse"
          >
            <div className="h-3 w-16 bg-white/10 rounded mb-3" />
            <div className="h-8 w-20 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const classifiedPercent =
    stats.total_assets > 0
      ? Math.round((stats.classified_count / stats.total_assets) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Top-level stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Total Assets" value={stats.total_assets} accent="teal" />
        <StatCard label="Classified" value={`${classifiedPercent}%`} accent="teal" />
        <StatCard
          label="Agents Online"
          value={stats.agents_online}
          accent="green"
        />
        <StatCard
          label="Hero Tier"
          value={stats.tier_breakdown.hero ?? 0}
          accent="gold"
        />
        <StatCard
          label="Social Queued"
          value={stats.social_queued}
          accent="blue"
        />
      </div>

      {/* Classification progress */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
        <h3
          className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Classification Progress
        </h3>
        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7fffd4] to-[#3b82f6] transition-all duration-700"
            style={{ width: `${classifiedPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/50 mt-2">
          <span>
            {stats.classified_count} of {stats.total_assets} classified
          </span>
          <span>{classifiedPercent}%</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Guardian coverage */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
          <h3
            className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Guardian Coverage
          </h3>
          <div className="space-y-2">
            {GUARDIANS.map((name) => {
              const count = stats.guardian_coverage[name] ?? 0;
              const maxCount = Math.max(
                ...Object.values(stats.guardian_coverage),
                1
              );
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-xs text-white/60 w-24 truncate">
                    {name}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: '#7fffd4',
                        opacity: 0.4 + (pct / 100) * 0.6,
                      }}
                    />
                  </div>
                  <span className="text-xs text-white/50 w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality tier breakdown */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
          <h3
            className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Quality Tiers
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.tier_breakdown).map(([tier, count]) => {
              const pct =
                stats.total_assets > 0
                  ? Math.round((count / stats.total_assets) * 100)
                  : 0;
              return (
                <div key={tier}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70 capitalize">{tier}</span>
                    <span className="text-white/50">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor:
                          TIER_COLORS[tier] ?? '#6b7280',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat card atom
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: 'teal' | 'gold' | 'green' | 'blue';
}) {
  const colors = {
    teal: 'text-[#7fffd4]',
    gold: 'text-[#ffd700]',
    green: 'text-green-400',
    blue: 'text-blue-400',
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-[#7fffd4]/30 transition-all">
      <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-2xl font-bold ${colors[accent]}`}>{value}</p>
    </div>
  );
}
