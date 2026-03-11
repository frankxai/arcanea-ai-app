'use client';

/**
 * Community Create - Collaborative Creation Space
 *
 * A space where creators gather to collaborate on projects.
 */

import Link from "next/link";
import {
  PhUsers,
  PhSparkle,
  PhArrowRight,
  PhPlus,
  PhClock,
  PhHeart,
  PhChatCircle,
  PhLightning,
  PhFlame,
  PhDrop,
  PhLeaf,
  PhWind,
  PhStar,
  PhTarget,
  PhCompass,
  PhLightbulb,
  PhTrophy,
  PhGitBranch,
  PhFileText,
  PhImage,
  PhMusicNote,
} from '@/lib/phosphor-icons';

// Project categories aligned with elements
const CATEGORIES = [
  {
    id: "visual",
    name: "Visual Art",
    icon: PhImage,
    color: "#ef4444",
    description: "Collaborate on artwork, illustrations, and visual narratives",
    projects: 24,
  },
  {
    id: "audio",
    name: "Audio & Music",
    icon: PhMusicNote,
    color: "#3b82f6",
    description: "Create soundscapes, compositions, and audio experiences",
    projects: 18,
  },
  {
    id: "writing",
    name: "Written Works",
    icon: PhFileText,
    color: "#22c55e",
    description: "Co-author stories, lore documents, and creative texts",
    projects: 31,
  },
  {
    id: "code",
    name: "Technical Builds",
    icon: PhGitBranch,
    color: "#ffd700",
    description: "Build features, tools, and applications together",
    projects: 12,
  },
];

const FEATURED_PROJECTS = [
  {
    id: "1",
    title: "The Godbeast Chronicles",
    description:
      "An anthology of tales exploring the origins and adventures of the Ten Godbeasts",
    category: "writing",
    participants: 8,
    status: "active",
    element: "fire",
    elementColor: "#ef4444",
    featured: true,
  },
  {
    id: "2",
    title: "Solfeggio Symphony",
    description:
      "A musical composition series where each piece corresponds to a Gate frequency",
    category: "audio",
    participants: 5,
    status: "active",
    element: "water",
    elementColor: "#3b82f6",
    featured: true,
  },
  {
    id: "3",
    title: "Guardian Art Collection",
    description:
      "Visual interpretations of all Ten Guardians and their bonded Godbeasts",
    category: "visual",
    participants: 12,
    status: "active",
    element: "void",
    elementColor: "#9966ff",
    featured: false,
  },
  {
    id: "4",
    title: "Arcanea CLI Toolkit",
    description:
      "A command-line toolkit for creators to interact with the platform",
    category: "code",
    participants: 4,
    status: "beta",
    element: "wind",
    elementColor: "#a855f7",
    featured: false,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Discover a Project",
    description:
      "Browse active collaborations or find one that matches your vision",
    icon: PhCompass,
  },
  {
    step: "02",
    title: "Join the Circle",
    description:
      "Connect with fellow creators and align on the creative direction",
    icon: PhUsers,
  },
  {
    step: "03",
    title: "Create Together",
    description: "Share your contribution and watch the project come alive",
    icon: PhSparkle,
  },
];

export default function CommunityCreatePage() {
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
        <section className="pt-20 pb-16 lg:pt-28 lg:pb-20">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-16 sm:px-12 sm:py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-crystal/10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-crystal/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 mb-6">
                <PhSparkle className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                  Create Together
                </span>
              </div>

              <h1 className="text-fluid-hero font-display font-bold mb-6">
                Manifest visions
                <span className="block text-gradient-brand">
                  with fellow creators
                </span>
              </h1>

              <p className="text-fluid-lg text-text-secondary leading-relaxed max-w-2xl font-body mb-8">
                The strongest creations emerge from collaboration. Join circles
                of creators aligned by element, vision, and purpose. Your
                contribution becomes part of something greater.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  <PhPlus className="w-4 h-4" />
                  Start a Project
                </Link>
                <Link
                  href="#browse"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                >
                  <PhCompass className="w-4 h-4" />
                  Browse Projects
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 border-t border-white/[0.04]">
          <div className="mb-10">
            <h2 className="text-xs font-mono tracking-[0.35em] uppercase text-crystal mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative card-3d liquid-glass rounded-2xl p-6 overflow-hidden group hover-lift transition-all"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-all" />

                  <div className="relative">
                    <span className="text-6xl font-display font-black text-brand-primary/10 mb-2 block select-none">
                      {item.step}
                    </span>

                    <div className="w-10 h-10 rounded-xl bg-brand-primary/15 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-brand-primary" />
                    </div>

                    <h3 className="font-display text-lg font-semibold mb-2">
                      {item.title}
                    </h3>

                    <p className="text-text-secondary text-sm leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Categories */}
        <section id="browse" className="py-12 border-t border-white/[0.04]">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-crystal/20 bg-crystal/8 mb-5">
              <PhTarget className="w-3 h-3 text-crystal" />
              <span className="text-xs font-mono tracking-widest uppercase text-crystal">
                By Element
              </span>
            </div>
            <h2 className="text-fluid-3xl font-display font-bold mb-4">
              Choose Your Path
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/community/create?category=${cat.id}`}
                  className="group card-3d liquid-glass rounded-2xl p-6 hover-lift transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: cat.color }} />
                  </div>

                  <h3 className="font-display font-semibold mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-text-muted mb-3 font-sans">
                    {cat.description}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                  >
                    ● {cat.projects}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Projects */}
        <section id="projects" className="py-12 border-t border-white/[0.04]">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/20 bg-brand-gold/8 mb-5">
              <PhTrophy className="w-3 h-3 text-brand-gold" />
              <span className="text-xs font-mono tracking-widest uppercase text-brand-gold">
                Featured Projects
              </span>
            </div>
            <h2 className="text-fluid-3xl font-display font-bold mb-4">
              Active Collaborations
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURED_PROJECTS.map((project) => (
              <div
                key={project.id}
                className={`group relative card-3d liquid-glass rounded-2xl p-6 overflow-hidden transition-all hover-lift ${
                  project.featured ? "ring-1 ring-brand-gold/30" : ""
                }`}
              >
                {project.featured && (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-transparent pointer-events-none" />
                )}

                <div className="relative">
                  {project.featured && (
                    <div className="absolute top-3 left-3">
                      <PhStar className="w-3 h-3 text-brand-gold" weight="fill" />
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs font-mono px-2.5 py-1 rounded-full border"
                      style={{
                        backgroundColor: `${project.elementColor}15`,
                        color: project.elementColor,
                        borderColor: `${project.elementColor}30`,
                      }}
                    >
                      {project.category}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <PhUsers className="w-3 h-3" />
                        {project.participants}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          project.status === "active"
                            ? "bg-crystal/15 text-crystal"
                            : "bg-brand-gold/15 text-brand-gold"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-semibold mb-2">
                    {project.title}
                  </h3>

                  <p className="text-text-secondary text-sm leading-relaxed font-sans mb-4">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                    <button className="flex items-center gap-2 text-sm text-crystal opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Join Project</span>
                      <PhArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="relative liquid-glass rounded-3xl overflow-hidden p-10 sm:p-14">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-crystal/8 pointer-events-none" />

            <div className="relative max-w-2xl text-center mx-auto">
              <PhLightbulb className="w-10 h-10 text-brand-gold mx-auto mb-6 animate-pulse" />
              <h2 className="text-fluid-3xl font-display font-bold mb-4">
                Have a vision?
              </h2>
              <p className="text-text-secondary font-body leading-relaxed mb-8 max-w-xl mx-auto">
                Start a new collaborative project and invite creators to join
                your circle. Every great work begins with a single spark.
              </p>
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
              >
                <PhLightning className="w-4 h-4" />
                Start a Project
                <PhArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
