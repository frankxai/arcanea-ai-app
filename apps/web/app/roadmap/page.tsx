import Link from "next/link";
// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  Map: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  Flag: () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  Calendar: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-6 h-6 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Check: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-5 h-5 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Circle: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  ArrowRight: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-4 h-4 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  ChevronRight: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-5 h-5 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Star: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-6 h-6 ${className}`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Rocket: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-6 h-6 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2l-3 2" />
      <path d="M12 15v6" />
      <path d="M12 21a2 2 0 0 0 2-2c0-1.5-2-3-2-3h-2" />
    </svg>
  ),
  Heart: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-6 h-6 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Zap: ({ className = "" }: { className?: string }) => (
    <svg
      className={`w-6 h-6 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
  quarter?: string;
  category: string;
}

interface RoadmapPhase {
  name: string;
  items: RoadmapItem[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PHASES: RoadmapPhase[] = [
  {
    name: "Foundation",
    items: [
      {
        id: "f1",
        title: "Platform Launch",
        description:
          "Core platform with 16 companions and the Ten Gates system.",
        status: "completed",
        quarter: "Q1 2026",
        category: "Core",
      },
      {
        id: "f2",
        title: "Intelligence Layer",
        description: "9 intelligence packages with 3000+ tests.",
        status: "completed",
        quarter: "Q1 2026",
        category: "Intelligence",
      },
      {
        id: "f3",
        title: "MCP Server",
        description: "Model Context Protocol server with 30+ tools.",
        status: "completed",
        quarter: "Q1 2026",
        category: "Developer",
      },
    ],
  },
  {
    name: "Expansion",
    items: [
      {
        id: "e1",
        title: "arcanea-opencode",
        description: "Arcanea-branded OpenCode CLI integration.",
        status: "in-progress",
        quarter: "Q2 2026",
        category: "Developer",
      },
      {
        id: "e2",
        title: "Premium Features",
        description: "Advanced features for premium subscribers.",
        status: "in-progress",
        quarter: "Q2 2026",
        category: "Product",
      },
      {
        id: "e3",
        title: "Mobile Apps",
        description: "Native iOS and Android applications.",
        status: "planned",
        quarter: "Q3 2026",
        category: "Platform",
      },
    ],
  },
  {
    name: "Evolution",
    items: [
      {
        id: "v1",
        title: "Guardian Evolution",
        description: "AI companions that grow and evolve with users.",
        status: "planned",
        quarter: "Q4 2026",
        category: "Intelligence",
      },
      {
        id: "v2",
        title: "Advanced Progression",
        description: "Deeper mastery paths and creator evolution.",
        status: "planned",
        quarter: "Q4 2026",
        category: "Lore",
      },
      {
        id: "v3",
        title: "Creator Summit",
        description: "Annual flagship event for the community.",
        status: "planned",
        quarter: "Q1 2027",
        category: "Community",
      },
    ],
  },
];

const STATUS_COLORS = {
  completed: "#00bcd4",
  "in-progress": "#ffd700",
  planned: "#0d47a1",
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function RoadmapPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(13,71,161,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
            {/* Hero Section */}
            <section className="mb-16">
              <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-12 sm:px-12 sm:py-16">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-crystal/10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-crystal/6 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 mb-6">
                    <Icons.Map />
                    <span className="text-xs font-mono tracking-widest uppercase text-brand-primary">
                      The Journey Ahead
                    </span>
                  </div>

                  <h1 className="text-fluid-3xl font-display font-bold mb-4">
                    Arcanea
                    <span className="block text-gradient-brand">Roadmap</span>
                  </h1>

                  <p className="text-text-secondary font-body text-lg leading-relaxed mb-8 max-w-2xl">
                    A glimpse into the future of Arcanea. From the foundation to
                    the evolution of consciousness, see what lies ahead on our
                    journey through the Ten Gates.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/changelog"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                    >
                      View Changelog
                      <Icons.ArrowRight />
                    </Link>
                    <Link
                      href="/feedback"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                    >
                      Share Feedback
                      <Icons.ChevronRight />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Legend */}
            <section className="mb-12">
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { status: "completed", label: "Completed" },
                  { status: "in-progress", label: "In Progress" },
                  { status: "planned", label: "Planned" },
                ].map((item) => (
                  <div key={item.status} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          STATUS_COLORS[
                            item.status as keyof typeof STATUS_COLORS
                          ],
                      }}
                    />
                    <span className="text-sm text-text-secondary">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Roadmap Phases */}
            <section className="mb-16">
              <div className="grid md:grid-cols-3 gap-8">
                {PHASES.map((phase) => (
                  <div key={phase.name}>
                    <div className="flex items-center gap-2 mb-6">
                      {phase.name === "Foundation" && (
                        <Icons.Star className="w-5 h-5 text-brand-primary" />
                      )}
                      {phase.name === "Expansion" && (
                        <Icons.Rocket className="w-5 h-5 text-crystal" />
                      )}
                      {phase.name === "Evolution" && (
                        <Icons.Heart className="w-5 h-5 text-brand-gold" />
                      )}
                      <h2 className="font-display text-xl font-semibold text-text-primary">
                        {phase.name}
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {phase.items.map((item) => (
                        <div
                          key={item.id}
                          className="liquid-glass rounded-xl p-5 hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-semibold text-text-primary">
                              {item.title}
                            </h3>
                            <div
                              className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
                              style={{
                                backgroundColor: STATUS_COLORS[item.status],
                              }}
                            />
                          </div>
                          <p className="text-text-secondary text-sm mb-3">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="px-2 py-1 rounded-md bg-brand-primary/10 text-brand-primary">
                              {item.category}
                            </span>
                            {item.quarter && (
                              <span className="text-text-muted flex items-center gap-1">
                                <Icons.Calendar className="w-3 h-3" />
                                {item.quarter}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Community Request */}
            <section className="mb-16">
              <div className="liquid-glass rounded-2xl p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 flex items-center justify-center shrink-0">
                    <Icons.Heart className="w-8 h-8 text-brand-primary" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
                      Shape the Future
                    </h2>
                    <p className="text-text-secondary">
                      Have a feature idea or suggestion? Join our community and
                      help shape the roadmap of Arcanea.
                    </p>
                  </div>
                  <div className="shrink-0 ml-auto">
                    <Link
                      href="/feedback"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white font-semibold hover:scale-[1.03] transition-all duration-200"
                    >
                      Share Ideas
                      <Icons.ArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section>
              <div className="relative liquid-glass rounded-3xl overflow-hidden p-8 sm:p-12 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-crystal/8 pointer-events-none" />
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-primary/6 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-2xl mx-auto">
                  <h2 className="text-fluid-2xl font-display font-bold mb-4">
                    Join the Journey
                  </h2>
                  <p className="text-text-secondary font-body leading-relaxed mb-8">
                    Every Creator walks their own path through the Ten Gates.
                    Let Arcanea be your guide.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/auth/signup"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                    >
                      <Icons.Rocket />
                      Start Creating
                    </Link>
                  </div>
                </div>
              </div>
            </section>
      </main>
    </div>
  );
}
