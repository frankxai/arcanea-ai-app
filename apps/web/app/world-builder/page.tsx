/**
 * World Builder - Create Immersive Worlds
 *
 * A creative tool for building detailed fictional worlds with AI assistance.
 */

import { Metadata } from "next";
import Link from "next/link";
import {
  PhSparkle,
  PhArrowRight,
  PhGlobe,
  PhMountains,
  PhCloud,
  PhSun,
  PhMoon,
  PhStar,
  PhMapTrifold,
  PhUsers,
  PhTranslate,
  PhSword,
  PhHeart,
  PhFlame,
  PhDrop,
  PhLeaf,
  PhWind,
  PhCrown,
  PhEye,
  PhCompass,
  PhMapPin,
  PhBuildings,
  PhTree,
  PhWaves,
  PhWind as WindIcon,
  PhLightning,
  PhPlus,
  PhGear,
  PhFloppyDisk,
  PhDownload,
  PhShare,
  PhClock,
} from "@phosphor-icons/react";

export const metadata: Metadata = {
  title: "World Builder | Arcanea",
  description:
    "Create immersive fictional worlds with AI-assisted worldbuilding. Design continents, cultures, magic systems, and histories.",
};

const WORLD_ELEMENTS = [
  {
    id: "geography",
    name: "Geography",
    icon: PhGlobe,
    color: "#22c55e",
    description: "Landscapes, climates, and natural features",
    elements: ["Continents", "Oceans", "Mountains", "Forests", "Deserts"],
  },
  {
    id: "cultures",
    name: "Cultures",
    icon: PhUsers,
    color: "#8b5cf6",
    description: "Societies, traditions, and belief systems",
    elements: ["Nations", "Languages", "Religions", "Customs", "Art"],
  },
  {
    id: "magic",
    name: "Magic Systems",
    icon: Sparkles,
    color: "#a855f7",
    description: "Supernatural rules and abilities",
    elements: ["Sources", "Abilities", "Limitations", "Users", "Artifacts"],
  },
  {
    id: "history",
    name: "History",
    icon: Clock,
    color: "#ffd700",
    description: "Timelines, events, and legacies",
    elements: ["Eras", "Conflicts", "Heroes", "Cataclysms", "Legends"],
  },
];

const RECENT_WORLDS = [
  {
    id: "1",
    name: "The Aether Chronicles",
    genre: "High Fantasy",
    created: "2 days ago",
    elements: 4,
    preview: "A world where magic flows from the stars...",
    color: "#8b5cf6",
  },
  {
    id: "2",
    name: "Neon Districts",
    genre: "Cyberpunk",
    created: "1 week ago",
    elements: 3,
    preview: "Mega-corporations control humanity's dreams...",
    color: "#3b82f6",
  },
  {
    id: "3",
    name: "Shattered Realms",
    genre: "Dark Fantasy",
    created: "2 weeks ago",
    elements: 4,
    preview: "A broken world held together by ancient pacts...",
    color: "#ef4444",
  },
];

const WORLD_TEMPLATES = [
  {
    id: "fantasy",
    name: "High Fantasy",
    icon: PhCrown,
    color: "#ffd700",
    description: "Epic quests, magic systems, and legendary heroes",
  },
  {
    id: "scifi",
    name: "Science Fiction",
    icon: Zap,
    color: "#3b82f6",
    description: "Future worlds, technology, and space exploration",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    icon: PhWindIcon,
    color: "#a855f7",
    description: "High tech, low life, and corporate dystopias",
  },
  {
    id: "historical",
    name: "Historical",
    icon: Castle,
    color: "#22c55e",
    description: "Real-world periods with creative interpretation",
  },
];

export default function WorldBuilderPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(127,255,212,0.08),transparent_55%)]" />
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
                <PhGlobe className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                  World Builder
                </span>
              </div>

              <h1 className="text-fluid-hero font-display font-bold mb-6">
                Craft infinite
                <span className="block text-gradient-brand">worlds</span>
              </h1>

              <p className="text-fluid-lg text-text-secondary leading-relaxed max-w-2xl font-body mb-8">
                Build immersive worlds from the ground up. Design geography,
                cultures, magic systems, and histories with AI-guided
                worldbuilding assistance.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/world-builder/new"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  <PhPlus className="w-4 h-4" />
                  New World
                </Link>
                <Link
                  href="/world-builder/templates"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                >
                  <PhCompass className="w-4 h-4" />
                  Templates
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Templates */}
        <section className="py-8 border-t border-white/5">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-crystal/20 bg-crystal/8 mb-4">
              <PhSparkle className="w-3 h-3 text-crystal" />
              <span className="text-xs font-mono tracking-widest uppercase text-crystal">
                Start With
              </span>
            </div>
            <h2 className="font-display text-lg font-semibold">
              World Templates
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WORLD_TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <Link
                  key={template.id}
                  href={`/world-builder/new?template=${template.id}`}
                  className="group glass rounded-2xl p-5 hover-lift transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${template.color}18` }}
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

        {/* World Elements */}
        <section className="py-8 border-t border-white/5">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/20 bg-brand-gold/8 mb-4">
              <PhMapTrifold className="w-3 h-3 text-brand-gold" />
              <span className="text-xs font-mono tracking-widest uppercase text-brand-gold">
                Build With
              </span>
            </div>
            <h2 className="font-display text-lg font-semibold">
              World Elements
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WORLD_ELEMENTS.map((element) => {
              const Icon = element.icon;
              return (
                <div
                  key={element.id}
                  className="group glass rounded-2xl p-6 hover-lift transition-all cursor-pointer"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${element.color}18` }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: element.color }}
                    />
                  </div>
                  <h3 className="font-display font-semibold mb-1">
                    {element.name}
                  </h3>
                  <p className="text-xs text-text-muted font-sans mb-3">
                    {element.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {element.elements.slice(0, 3).map((sub) => (
                      <span
                        key={sub}
                        className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted"
                      >
                        {sub}
                      </span>
                    ))}
                    {element.elements.length > 3 && (
                      <span className="text-xs text-text-muted">
                        +{element.elements.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Worlds */}
        <section className="py-8 border-t border-white/5 pb-16">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-water/20 bg-water/8 mb-4">
              <PhStar className="w-3 h-3 text-water" />
              <span className="text-xs font-mono tracking-widest uppercase text-water">
                Your Worlds
              </span>
            </div>
            <h2 className="font-display text-lg font-semibold">
              Recent Creations
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {RECENT_WORLDS.map((world) => (
              <Link
                key={world.id}
                href={`/world-builder/${world.id}`}
                className="group glass rounded-2xl p-6 hover-lift transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: world.color }}
                  />
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <PhClock />
                    {world.created}
                  </div>
                </div>

                <h3 className="font-display text-lg font-semibold mb-1">
                  {world.name}
                </h3>
                <span
                  className="text-xs font-mono mb-3 inline-block"
                  style={{ color: world.color }}
                >
                  {world.genre}
                </span>
                <p className="text-text-muted text-sm font-sans line-clamp-2 mb-4">
                  {world.preview}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs text-text-muted">
                    {world.elements} elements
                  </span>
                  <span className="text-sm text-crystal opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Open <PhArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}

            {/* New World Card */}
            <Link
              href="/world-builder/new"
              className="group glass rounded-2xl p-6 border-2 border-dashed border-white/20 hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all flex flex-col items-center justify-center text-center min-h-[200px]"
            >
              <PhPlus className="w-8 h-8 text-text-muted group-hover:text-brand-primary transition-colors mb-3" />
              <span className="text-text-muted group-hover:text-brand-primary transition-colors font-sans">
                Create New World
              </span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
