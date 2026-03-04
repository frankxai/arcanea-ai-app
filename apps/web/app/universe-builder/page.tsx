'use client';

/**
 * Universe Builder - Create Multi-World Canon
 *
 * A space for building interconnected universes across multiple worlds and stories.
 */

import Link from "next/link";
import {
  PhSparkle,
  PhArrowRight,
  PhInfinity,
  PhGlobe,
  PhStack,
  PhGraphNetwork,
  PhStar,
  PhSpiral,
  PhPlanet,
  PhPlus,
  PhGitBranch,
  PhEye,
  PhHeart,
  PhUsers,
  PhCrown,
} from '@/lib/phosphor-icons';

const UNIVERSE_TEMPLATES = [
  {
    id: "multiverse",
    name: "Multiverse",
    icon: PhInfinity,
    color: "#8b5cf6",
    description: "Infinite parallel realities and dimensional planes",
  },
  {
    id: "galaxy",
    name: "Galaxy Cluster",
    icon: PhPlanet,
    color: "#3b82f6",
    description: "Interstellar empires across star systems",
  },
  {
    id: "planar",
    name: "Planar World",
    icon: PhStack,
    color: "#22c55e",
    description: "Multiple dimensions and reality planes",
  },
  {
    id: "chronicles",
    name: "Epic Chronicles",
    icon: PhSpiral,
    color: "#ffd700",
    description: "Interconnected sagas across ages",
  },
];

const YOUR_UNIVERSES = [
  {
    id: "1",
    name: "The Arcaneaverse",
    tagline: "Ten Gods, One Destiny",
    worlds: 12,
    characters: 48,
    timeline: "Ancient to Future",
    color: "#8b5cf6",
    lastEdited: "2 hours ago",
  },
  {
    id: "2",
    name: "Stellar Dominion",
    tagline: "Empires rise among the stars",
    worlds: 8,
    characters: 32,
    timeline: "Space Age",
    color: "#3b82f6",
    lastEdited: "1 day ago",
  },
  {
    id: "3",
    name: "The Fallen Realms",
    tagline: "Swords, sorcery, and shadows",
    worlds: 5,
    characters: 24,
    timeline: "Medieval Fantasy",
    color: "#ef4444",
    lastEdited: "3 days ago",
  },
];

const CANON_ELEMENTS = [
  {
    id: "worlds",
    name: "Worlds",
    icon: PhGlobe,
    count: 25,
    color: "#22c55e",
  },
  {
    id: "characters",
    name: "Characters",
    icon: PhUsers,
    count: 104,
    color: "#8b5cf6",
  },
  {
    id: "timelines",
    name: "Timelines",
    icon: PhSpiral,
    count: 8,
    color: "#ffd700",
  },
  {
    id: "artifacts",
    name: "Artifacts",
    icon: PhStar,
    count: 36,
    color: "#ef4444",
  },
];

export default function UniverseBuilderPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section id="hero" className="pt-20 pb-16 lg:pt-28 lg:pb-20">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-16 sm:px-12 sm:py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-crystal/10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-crystal/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 mb-6">
                <PhInfinity className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                  Universe Builder
                </span>
              </div>

              <h1 className="text-fluid-hero font-display font-bold mb-6">
                Build infinite worlds
                <span className="block text-gradient-brand">
                  across infinite realities
                </span>
              </h1>

              <p className="text-fluid-lg text-text-secondary leading-relaxed max-w-2xl font-body mb-8">
                Create vast, interconnected universes spanning multiple worlds,
                timelines, and dimensions. Connect your stories into a unified
                canon that spans ages.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/universe-builder"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  <PhPlus className="w-4 h-4" />
                  New Universe
                </Link>
                <Link
                  href="/universe-builder"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                >
                  <PhGraphNetwork className="w-4 h-4" />
                  Explore Templates
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Canon Stats */}
        <section id="stats" className="py-8 border-t border-white/[0.04]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CANON_ELEMENTS.map((element) => {
              const Icon = element.icon;
              return (
                <div
                  key={element.id}
                  className="liquid-glass rounded-xl p-5 text-center"
                >
                  <Icon
                    className="w-6 h-6 mx-auto mb-2"
                    style={{ color: element.color }}
                  />
                  <div className="text-2xl font-display font-bold text-text-primary">
                    {element.count}
                  </div>
                  <div className="text-xs text-text-muted font-sans">
                    {element.name}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Universe Templates */}
        <section id="templates" className="py-8 border-t border-white/[0.04]">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-crystal/20 bg-crystal/8 mb-4">
              <PhSparkle className="w-3 h-3 text-crystal" />
              <span className="text-xs font-mono tracking-widest uppercase text-crystal">
                Start With
              </span>
            </div>
            <h2 className="font-display text-lg font-semibold">
              Universe Types
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {UNIVERSE_TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <Link
                  key={template.id}
                  href={`/universe-builder/new?template=${template.id}`}
                  className="group card-3d liquid-glass rounded-2xl p-5 hover-lift transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ '--accent': template.color, backgroundColor: 'color-mix(in srgb, var(--accent) 12%, transparent)' } as React.CSSProperties}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: template.color }}
                    />
                  </div>
                  <h3 className="font-display font-semibold mb-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-text-muted font-sans">
                    {template.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Your Universes */}
        <section id="your-universes" className="py-8 border-t border-white/[0.04] pb-16">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/20 bg-brand-gold/8 mb-4">
              <PhCrown className="w-3 h-3 text-brand-gold" />
              <span className="text-xs font-mono tracking-widest uppercase text-brand-gold">
                Your Universes
              </span>
            </div>
            <h2 className="font-display text-lg font-semibold">
              Active Canons
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {YOUR_UNIVERSES.map((universe) => (
              <Link
                key={universe.id}
                href={`/universe-builder/${universe.id}`}
                className="group card-3d liquid-glass rounded-2xl p-6 hover-lift transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${universe.color}40, ${universe.color}10)` }}
                  >
                    <PhPlanet className="w-5 h-5 m-2.5" style={{ color: universe.color }} />
                  </div>
                  <span className="text-xs text-text-muted">
                    {universe.lastEdited}
                  </span>
                </div>

                <h3 className="font-display text-xl font-semibold mb-1">
                  {universe.name}
                </h3>
                <p className="text-text-muted text-sm mb-4">
                  {universe.tagline}
                </p>

                <div className="flex gap-4 text-xs text-text-muted mb-4">
                  <span className="flex items-center gap-1">
                    <PhGlobe className="w-3 h-3" />
                    {universe.worlds} worlds
                  </span>
                  <span className="flex items-center gap-1">
                    <PhUsers className="w-3 h-3" />
                    {universe.characters} characters
                  </span>
                </div>

                <div className="pt-4 border-t border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-mono"
                      style={{ color: universe.color }}
                    >
                      {universe.timeline}
                    </span>
                    <span className="text-sm text-crystal opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Open <PhArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* New Universe Card */}
            <Link
              href="/universe-builder"
              className="group card-3d liquid-glass rounded-2xl p-6 border-2 border-dashed border-white/[0.12] hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all flex flex-col items-center justify-center text-center min-h-[220px]"
            >
              <PhPlus className="w-8 h-8 text-text-muted group-hover:text-brand-primary transition-colors mb-3" />
              <span className="text-text-muted group-hover:text-brand-primary transition-colors font-sans">
                Create New Universe
              </span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
