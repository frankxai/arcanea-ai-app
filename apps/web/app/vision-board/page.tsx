'use client';

/**
 * Vision Board - Personal Creative Goals
 *
 * A personal space for creators to visualize and track their creative goals.
 */

import Link from "next/link";
import {
  PhSparkle,
  PhArrowRight,
  PhTarget,
  PhEye,
  PhStar,
  PhHeart,
  PhFlame,
  PhDrop,
  PhLeaf,
  PhWind,
  PhLightning,
  PhPlus,
  PhCheckCircle,
  PhClock,
  PhTrendUp,
  PhTrophy,
  PhCalendar,
  PhLightbulb,
  PhPalette,
  PhBookOpen,
  PhMusicNote,
  PhCode,
  PhVideo,
} from '@/lib/phosphor-icons';

const QUICK_GOALS = [
  {
    id: 1,
    title: "Complete 10 pieces",
    category: "visual",
    progress: 70,
    color: "#ef4444",
  },
  {
    id: 2,
    title: "Learn new technique",
    category: "skills",
    progress: 45,
    color: "#0d47a1",
  },
  {
    id: 3,
    title: "Join collaboration",
    category: "community",
    progress: 100,
    color: "#00bcd4",
  },
];

const UPCOMING_MILESTONES = [
  {
    id: 1,
    title: "Create first godbeast art series",
    date: "Mar 15",
    type: "project",
    color: "#ef4444",
  },
  {
    id: 2,
    title: "Complete Foundation Gate journey",
    date: "Mar 28",
    type: "academy",
    color: "#22c55e",
  },
  {
    id: 3,
    title: "Share work in Discord",
    date: "Apr 1",
    type: "community",
    color: "#00bcd4",
  },
];

const CREATIVE_AREAS = [
  {
    id: "visual",
    name: "Visual Art",
    icon: PhPalette,
    color: "#ef4444",
    goals: 12,
    completed: 8,
    description: "Paintings, illustrations, and digital art",
  },
  {
    id: "writing",
    name: "Writing",
    icon: PhBookOpen,
    color: "#22c55e",
    goals: 8,
    completed: 5,
    description: "Stories, lore, and creative texts",
  },
  {
    id: "music",
    name: "Music",
    icon: PhMusicNote,
    color: "#3b82f6",
    goals: 6,
    completed: 2,
    description: "Compositions and soundscapes",
  },
  {
    id: "code",
    name: "Technical",
    icon: PhCode,
    color: "#ffd700",
    goals: 4,
    completed: 1,
    description: "Tools and applications",
  },
];

const ACHIEVEMENTS = [
  {
    id: 1,
    title: "First Creation",
    description: "Created your first piece",
    unlocked: true,
    icon: PhSparkle,
  },
  {
    id: 2,
    title: "Community Joined",
    description: "Connected with fellow creators",
    unlocked: true,
    icon: PhHeart,
  },
  {
    id: 3,
    title: "Gate Initiated",
    description: "Started your first Gate journey",
    unlocked: true,
    icon: PhStar,
  },
  {
    id: 4,
    title: "Collaboration Master",
    description: "Completed 5 collaborations",
    unlocked: false,
    icon: PhTarget,
  },
  {
    id: 5,
    title: "Luminor Prospect",
    description: "Opened 5 Gates",
    unlocked: false,
    icon: PhTrophy,
  },
];

const MONTHLY_FOCUS = {
  title: "Visual Storytelling",
  description:
    "Focus on creating art that tells stories through visual narrative",
  progress: 65,
  daysLeft: 8,
};

export default function VisionBoardPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(13,71,161,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="pt-20 pb-12 lg:pt-28 lg:pb-16">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-16 sm:px-12 sm:py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-crystal/10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-crystal/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 mb-6">
                <PhEye className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                  Vision Board
                </span>
              </div>

              <h1 className="text-fluid-hero font-display font-bold mb-6">
                Visualize your
                <span className="block text-gradient-brand">
                  creative future
                </span>
              </h1>

              <p className="text-fluid-lg text-text-secondary leading-relaxed max-w-2xl font-body mb-8">
                Set intentions, track milestones, and watch your creative
                journey unfold. Every goal is a step toward mastery.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200">
                  <PhPlus className="w-4 h-4" />
                  Add Goal
                </button>
                <Link
                  href="/vision-board"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                >
                  <PhPalette className="w-4 h-4" />
                  Customize Board
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Monthly Focus */}
        <section className="py-8 border-t border-white/[0.04]">
          <div className="relative liquid-glass rounded-2xl p-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/5 rounded-full blur-3xl" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/15 flex items-center justify-center">
                  <PhStar className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <span className="text-xs font-mono text-brand-gold uppercase tracking-wider">
                    Monthly Focus
                  </span>
                  <h3 className="font-display text-xl font-semibold mt-1">
                    {MONTHLY_FOCUS.title}
                  </h3>
                  <p className="text-text-muted text-sm mt-1">
                    {MONTHLY_FOCUS.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <div className="text-2xl font-display font-bold text-brand-gold">
                    {MONTHLY_FOCUS.progress}%
                  </div>
                  <div className="text-xs text-text-muted">Complete</div>
                </div>
                <div className="w-24">
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-gold rounded-full"
                      style={{ width: `${MONTHLY_FOCUS.progress}%` }}
                    />
                  </div>
                  <p className="flex items-center gap-1 text-xs text-text-muted mt-1.5">
                    <PhFlame className="w-3 h-3 text-brand-gold" />
                    {MONTHLY_FOCUS.daysLeft} days remain
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-display font-semibold text-text-primary">
                    {MONTHLY_FOCUS.daysLeft}
                  </div>
                  <div className="text-xs text-text-muted">days left</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Goals & Milestones */}
        <section className="py-8 border-t border-white/[0.04]">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quick Goals */}
            <div className="liquid-glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-semibold">
                  Active Goals
                </h2>
                <button className="text-xs text-crystal hover:text-crystal-bright transition-colors">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {QUICK_GOALS.map((goal) => (
                  <div key={goal.id} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-sans">{goal.title}</span>
                      <span
                        className="text-xs font-mono"
                        style={{ color: goal.color }}
                      >
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 group-hover:opacity-80"
                        style={{
                          width: `${goal.progress}%`,
                          backgroundColor: goal.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full py-2 rounded-lg border border-dashed border-white/[0.12] text-text-muted text-sm hover:border-crystal/30 hover:text-crystal transition-all flex items-center justify-center gap-2">
                <PhPlus className="w-4 h-4" />
                Add Goal
              </button>
            </div>

            {/* Upcoming Milestones */}
            <div className="liquid-glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-semibold">
                  Upcoming Milestones
                </h2>
                <PhCalendar className="w-4 h-4 text-text-muted" />
              </div>

              <div className="space-y-4">
                {UPCOMING_MILESTONES.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] transition-colors"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: milestone.color }}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-sans">
                        {milestone.title}
                      </span>
                    </div>
                    <span className="text-xs text-text-muted">
                      {milestone.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Creative Areas */}
        <section className="py-8 border-t border-white/[0.04]">
          <div className="mb-6">
            <h2 className="font-display text-lg font-semibold mb-1">
              Creative Areas
            </h2>
            <p className="text-sm text-text-muted">
              Track goals across different creative disciplines
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CREATIVE_AREAS.map((area) => {
              const Icon = area.icon;
              const progressPercent = Math.round(
                (area.completed / area.goals) * 100,
              );

              return (
                <div
                  key={area.id}
                  className="group card-3d liquid-glass rounded-2xl p-5 hover-lift transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${area.color}18` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: area.color }} />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold">
                        {area.name}
                      </h3>
                      <p className="text-xs text-text-muted">
                        {area.description}
                      </p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-muted">Progress</span>
                      <span style={{ color: area.color }}>
                        {area.completed}/{area.goals} &mdash; {progressPercent}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progressPercent}%`,
                          backgroundColor: area.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Achievements */}
        <section className="py-8 border-t border-white/[0.04] pb-16">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/20 bg-brand-gold/8 mb-4">
              <PhTrophy className="w-3 h-3 text-brand-gold" />
              <span className="text-xs font-mono tracking-widest uppercase text-brand-gold">
                Achievements
              </span>
            </div>
            <h2 className="font-display text-lg font-semibold">Your Journey</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`relative card-3d liquid-glass rounded-2xl p-5 text-center transition-all ${
                    achievement.unlocked
                      ? "hover-lift cursor-pointer"
                      : "opacity-50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                      achievement.unlocked ? "bg-brand-gold/15" : "bg-white/[0.04]"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        achievement.unlocked
                          ? "text-brand-gold animate-pulse"
                          : "text-text-muted"
                      }`}
                    />
                  </div>
                  <h3 className="font-display font-semibold text-sm mb-1">
                    {achievement.title}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {achievement.description}
                  </p>
                  {achievement.unlocked && (
                    <PhCheckCircle className="w-4 h-4 text-brand-gold absolute top-3 right-3" />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
