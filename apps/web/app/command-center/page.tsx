'use client';

import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { MotionProvider } from '@/lib/motion';
import {
  Gauge,
  Package,
  Rocket,
  Lightning,
  Target,
  ShieldCheck,
  Clock,
  Warning,
  CheckCircle,
  Circle,
  Eye,
  Lock,
  CaretRight,
  Brain,
  Books,
  Users,
} from '@/lib/phosphor-icons';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth/context';
import {
  MILESTONES,
  PACKAGE_TIERS,
  CURRENT_SPRINT,
  RECENT_ACTIVITY,
  ECOSYSTEM_STATS,
  AUDIT_NOTES,
  type PackageTier,
  type PackageStatus,
  type PackageHealth,
  type ElementVariant,
  type Milestone,
  type ActivityEntry,
} from './data';

// ─── Helpers ────────────────────────────────────────────────────────────────

const ELEMENT_COLORS: Record<ElementVariant, string> = {
  crystal: 'text-[#00bcd4]',
  fire: 'text-[#ff6b35]',
  water: 'text-[#00bcd4]',
  void: 'text-[#9966ff]',
  gold: 'text-[#ffd700]',
  brand: 'text-[#0d47a1]',
};

const ELEMENT_BG: Record<ElementVariant, string> = {
  crystal: 'bg-[#00bcd4]/10 border-[#00bcd4]/20',
  fire: 'bg-[#ff6b35]/10 border-[#ff6b35]/20',
  water: 'bg-[#00bcd4]/10 border-[#00bcd4]/20',
  void: 'bg-[#9966ff]/10 border-[#9966ff]/20',
  gold: 'bg-[#ffd700]/10 border-[#ffd700]/20',
  brand: 'bg-[#0d47a1]/10 border-[#0d47a1]/20',
};

const STATUS_BADGE: Record<PackageStatus, { label: string; className: string }> = {
  published: { label: 'Published', className: 'bg-[#00bcd4]/15 text-[#00bcd4] border-[#00bcd4]/30' },
  private: { label: 'Private', className: 'bg-white/[0.04] text-text-muted border-white/[0.06]' },
  alpha: { label: 'Alpha', className: 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30' },
  stale: { label: 'Stale', className: 'bg-[#ff6b35]/15 text-[#ff6b35] border-[#ff6b35]/30' },
};

const HEALTH_ICON: Record<PackageHealth, { icon: typeof CheckCircle; className: string }> = {
  good: { icon: CheckCircle, className: 'text-[#00bcd4]' },
  warning: { icon: Warning, className: 'text-[#ffd700]' },
  stale: { icon: Circle, className: 'text-[#ff6b35]' },
};

const ACTIVITY_ICONS: Record<ActivityEntry['category'], { icon: typeof Rocket; className: string }> = {
  feature: { icon: Rocket, className: 'text-[#00bcd4]' },
  build: { icon: Package, className: 'text-[#00bcd4]' },
  deploy: { icon: Lightning, className: 'text-[#ffd700]' },
  milestone: { icon: Target, className: 'text-[#9966ff]' },
  fix: { icon: ShieldCheck, className: 'text-[#ff6b35]' },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
};

// ─── Section Components ─────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accent }: {
  icon: typeof Package;
  label: string;
  value: number | string;
  accent: string;
}) {
  return (
    <m.div
      variants={fadeUp}
      className="liquid-glass rounded-xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition-colors"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon weight="duotone" className="w-5 h-5" />
        </div>
        <span className="text-xs font-mono uppercase tracking-wider text-text-muted">{label}</span>
      </div>
      <span className="text-2xl font-bold text-text-primary tabular-nums">{value}</span>
    </m.div>
  );
}

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const colorClass = ELEMENT_COLORS[milestone.element];
  const bgClass = ELEMENT_BG[milestone.element];

  return (
    <m.div
      variants={fadeUp}
      className={`rounded-xl p-5 border transition-colors hover:bg-white/[0.02] ${bgClass}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-text-muted">{milestone.id}</span>
            {milestone.status === 'active' && (
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded-full bg-[#00bcd4]/15 text-[#00bcd4]">
                Active
              </span>
            )}
            {milestone.status === 'planned' && (
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded-full bg-white/[0.04] text-text-muted">
                Planned
              </span>
            )}
          </div>
          <h3 className="font-semibold text-text-primary">{milestone.name}</h3>
        </div>
        <span className={`text-xs font-mono ${colorClass}`}>{milestone.guardian}</span>
      </div>

      <p className="text-sm text-text-secondary mb-4 line-clamp-2">{milestone.description}</p>

      <Progress
        value={milestone.progress}
        variant={milestone.element}
        size="sm"
        showLabel
        label={`${milestone.tasksDone}/${milestone.tasksTotal} tasks`}
      />

      <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <Target weight="bold" className="w-3.5 h-3.5" />
          Target: {milestone.target}
        </span>
        {milestone.blocked > 0 && (
          <span className="flex items-center gap-1 text-[#ff6b35]">
            <Warning weight="bold" className="w-3.5 h-3.5" />
            {milestone.blocked} blocked
          </span>
        )}
      </div>
    </m.div>
  );
}

function PackageTable({ tierId }: { tierId: PackageTier }) {
  const tier = PACKAGE_TIERS.find((t) => t.id === tierId);
  if (!tier) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.04] text-text-muted text-xs font-mono uppercase tracking-wider">
            <th className="text-left py-3 px-4">Package</th>
            <th className="text-left py-3 px-4">Version</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-center py-3 px-4">Deps</th>
            <th className="text-center py-3 px-4">Health</th>
          </tr>
        </thead>
        <tbody>
          {tier.packages.map((pkg) => {
            const badge = STATUS_BADGE[pkg.status];
            const health = HEALTH_ICON[pkg.health];
            const HealthIcon = health.icon;
            return (
              <tr key={pkg.name} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4 font-mono text-text-primary text-xs">{pkg.name}</td>
                <td className="py-3 px-4 font-mono text-text-secondary text-xs tabular-nums">{pkg.version}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2 py-0.5 text-[10px] font-mono uppercase rounded-full border ${badge.className}`}>
                    {badge.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-mono text-text-muted text-xs tabular-nums">{pkg.deps}</td>
                <td className="py-3 px-4 text-center">
                  <HealthIcon weight="fill" className={`w-4 h-4 mx-auto ${health.className}`} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function CommandCenterPage() {
  const { user } = useAuth();
  const [activeTier, setActiveTier] = useState<PackageTier>('foundation');
  const [liveMilestones, setLiveMilestones] = useState<Milestone[] | null>(null);
  const [dataSource, setDataSource] = useState<'static' | 'live'>('static');
  const isBuilder = !!user;

  // Fetch live data from API (reads .arc files server-side)
  useEffect(() => {
    fetch('/api/command-center')
      .then(res => res.json())
      .then(data => {
        if (data.source === 'filesystem' && data.milestones?.length > 0) {
          setLiveMilestones(data.milestones);
          setDataSource('live');
        }
      })
      .catch(() => { /* static fallback — no action needed */ });
  }, []);

  const milestones = liveMilestones || MILESTONES;
  const sprintPercent = Math.round((CURRENT_SPRINT.completed / CURRENT_SPRINT.capacity) * 100);

  return (
    <MotionProvider>
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(13,71,161,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <m.div initial="hidden" animate="visible" variants={stagger}>

          {/* ── Section A: Hero + Stats ─────────────────────────────── */}
          <section className="mb-12">
            <m.div
              variants={fadeUp}
              className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-10 sm:px-12 sm:py-14 mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-crystal/10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ffd700]/30 bg-[#ffd700]/10 mb-5">
                  <Gauge weight="duotone" className="w-4 h-4 text-[#ffd700]" />
                  <span className="text-xs font-mono tracking-widest uppercase text-[#ffd700]">
                    Shinkami &middot; Source Gate
                  </span>
                </div>

                <h1 className="text-fluid-3xl font-display font-bold mb-3">
                  Command
                  <span className="block text-gradient-brand">Center</span>
                </h1>

                <p className="text-text-secondary font-body text-lg leading-relaxed max-w-2xl">
                  Full ecosystem visibility — milestones, packages, sprint progress, and system health.
                  Everything at a glance.
                </p>

                {dataSource === 'live' && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00bcd4]/10 border border-[#00bcd4]/20">
                    <div className="w-2 h-2 rounded-full bg-[#00bcd4] animate-pulse" />
                    <span className="text-xs font-mono text-[#00bcd4]">Live from .arc files</span>
                  </div>
                )}
              </div>
            </m.div>

            {/* Stats Strip */}
            <m.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Package} label="Workspace Packages" value={ECOSYSTEM_STATS.workspacePackages} accent="bg-[#00bcd4]/10 text-[#00bcd4]" />
              <StatCard icon={Eye} label="Pages Live" value={ECOSYSTEM_STATS.pagesLive} accent="bg-[#00bcd4]/10 text-[#00bcd4]" />
              <StatCard icon={Rocket} label="Published to npm" value={ECOSYSTEM_STATS.publishedNpm} accent="bg-[#9966ff]/10 text-[#9966ff]" />
              <StatCard icon={Target} label="Active Milestones" value={ECOSYSTEM_STATS.activeMilestones} accent="bg-[#ffd700]/10 text-[#ffd700]" />
            </m.div>
          </section>

          {/* ── Section B: Milestones ──────────────────────────────── */}
          <section className="mb-12">
            <m.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <Target weight="duotone" className="w-6 h-6 text-[#ffd700]" />
              <h2 className="text-xl font-display font-semibold text-text-primary">Milestones</h2>
            </m.div>

            <m.div variants={stagger} className="grid md:grid-cols-2 gap-6">
              {milestones.map((ms) => (
                <MilestoneCard key={ms.id} milestone={ms} />
              ))}
            </m.div>
          </section>

          {/* ── Section C: Package Registry ────────────────────────── */}
          <section className="mb-12">
            <m.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <Package weight="duotone" className="w-6 h-6 text-[#00bcd4]" />
              <h2 className="text-xl font-display font-semibold text-text-primary">Package Registry</h2>
            </m.div>

            {/* Tier Tabs */}
            <m.div variants={fadeUp} className="flex flex-wrap gap-2 mb-4">
              {PACKAGE_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setActiveTier(tier.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTier === tier.id
                      ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                      : 'bg-white/[0.04] text-text-secondary border border-white/[0.04] hover:bg-white/[0.06]'
                  }`}
                >
                  {tier.label}
                  <span className="ml-2 text-xs text-text-muted tabular-nums">
                    {tier.packages.length}
                  </span>
                </button>
              ))}
            </m.div>

            {/* Active Tier Description */}
            <m.div variants={fadeUp}>
              {PACKAGE_TIERS.filter((t) => t.id === activeTier).map((tier) => (
                <div key={tier.id}>
                  <p className="text-sm text-text-muted mb-4 flex items-center gap-2">
                    {tier.id === 'intelligence' && <Brain weight="duotone" className="w-4 h-4 text-[#ffd700]" />}
                    {tier.description}
                    {tier.id === 'intelligence' && (
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded-full bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/30">
                        Your Moat
                      </span>
                    )}
                  </p>
                  <div className="liquid-glass rounded-xl border border-white/[0.06] overflow-hidden">
                    <PackageTable tierId={tier.id} />
                  </div>
                </div>
              ))}
            </m.div>
          </section>

          {/* ── Section D: Sprint & Activity ───────────────────────── */}
          <section className="mb-12">
            <m.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <Lightning weight="duotone" className="w-6 h-6 text-[#00bcd4]" />
              <h2 className="text-xl font-display font-semibold text-text-primary">Sprint & Activity</h2>
            </m.div>

            <m.div variants={stagger} className="grid md:grid-cols-2 gap-6">
              {/* Sprint Progress */}
              <m.div variants={fadeUp} className="liquid-glass rounded-xl border border-white/[0.06] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-text-primary">{CURRENT_SPRINT.id}: {CURRENT_SPRINT.name}</h3>
                    <p className="text-xs text-text-muted mt-1">{CURRENT_SPRINT.arc} &middot; {CURRENT_SPRINT.startDate} to {CURRENT_SPRINT.endDate}</p>
                  </div>
                  <span className="text-2xl font-bold text-[#00bcd4] tabular-nums">{sprintPercent}%</span>
                </div>

                <Progress
                  value={CURRENT_SPRINT.completed}
                  max={CURRENT_SPRINT.capacity}
                  variant="crystal"
                  size="lg"
                  showLabel
                  label={`${CURRENT_SPRINT.completed}/${CURRENT_SPRINT.capacity} points`}
                />

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <span className="text-lg font-bold text-text-primary tabular-nums">{CURRENT_SPRINT.completed}</span>
                    <p className="text-[10px] font-mono uppercase text-text-muted mt-1">Completed</p>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-bold text-text-primary tabular-nums">{CURRENT_SPRINT.capacity - CURRENT_SPRINT.completed}</span>
                    <p className="text-[10px] font-mono uppercase text-text-muted mt-1">Remaining</p>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-bold text-text-primary tabular-nums">{CURRENT_SPRINT.capacity}</span>
                    <p className="text-[10px] font-mono uppercase text-text-muted mt-1">Capacity</p>
                  </div>
                </div>

                {/* Additional ecosystem stats for builders */}
                {isBuilder && (
                  <div className="mt-6 pt-4 border-t border-white/[0.04] grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <span className="text-sm font-bold text-[#9966ff] tabular-nums">{ECOSYSTEM_STATS.agents}</span>
                      <p className="text-[10px] font-mono uppercase text-text-muted mt-1">Agents</p>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-bold text-[#00bcd4] tabular-nums">{ECOSYSTEM_STATS.loreTexts}</span>
                      <p className="text-[10px] font-mono uppercase text-text-muted mt-1">Lore Texts</p>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-bold text-[#00bcd4] tabular-nums">{ECOSYSTEM_STATS.totalTests}+</span>
                      <p className="text-[10px] font-mono uppercase text-text-muted mt-1">Tests</p>
                    </div>
                  </div>
                )}
              </m.div>

              {/* Activity Timeline */}
              <m.div variants={fadeUp} className="liquid-glass rounded-xl border border-white/[0.06] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text-primary">Recent Activity</h3>
                  {!isBuilder && (
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Lock weight="bold" className="w-3 h-3" />
                      Full log requires sign-in
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {RECENT_ACTIVITY.slice(0, isBuilder ? 8 : 4).map((entry) => {
                    const activityMeta = ACTIVITY_ICONS[entry.category];
                    const ActivityIcon = activityMeta.icon;
                    return (
                      <div
                        key={entry.id}
                        className="flex items-start gap-3 py-2.5 border-b border-white/[0.03] last:border-0"
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-white/[0.04] ${activityMeta.className}`}>
                          <ActivityIcon weight="bold" className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-text-primary font-medium truncate">{entry.action}</p>
                          <p className="text-xs text-text-muted truncate">{entry.detail}</p>
                        </div>
                        <span className="text-[10px] font-mono text-text-muted shrink-0 mt-1">
                          {entry.timestamp.split(' ')[1]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </m.div>
            </m.div>
          </section>

          {/* ── Audit Notes (builder-only) ─────────────────────────── */}
          {isBuilder && (
            <section className="mb-12">
              <m.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <Warning weight="duotone" className="w-6 h-6 text-[#ff6b35]" />
                <h2 className="text-xl font-display font-semibold text-text-primary">Audit Notes</h2>
                <span className="text-xs text-text-muted">(builder-only)</span>
              </m.div>

              <m.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {AUDIT_NOTES.map((note) => (
                  <m.div
                    key={note.id}
                    variants={fadeUp}
                    className={`liquid-glass rounded-xl p-4 border transition-colors ${
                      note.severity === 'high'
                        ? 'border-[#ff6b35]/20'
                        : note.severity === 'medium'
                        ? 'border-[#ffd700]/20'
                        : 'border-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded-full border ${
                        note.severity === 'high'
                          ? 'bg-[#ff6b35]/15 text-[#ff6b35] border-[#ff6b35]/30'
                          : note.severity === 'medium'
                          ? 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/30'
                          : 'bg-white/[0.04] text-text-muted border-white/[0.06]'
                      }`}>
                        {note.severity}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-text-primary mb-1">{note.title}</h4>
                    <p className="text-xs text-text-muted">{note.detail}</p>
                  </m.div>
                ))}
              </m.div>
            </section>
          )}

        </m.div>
      </main>
    </div>
    </MotionProvider>
  );
}
