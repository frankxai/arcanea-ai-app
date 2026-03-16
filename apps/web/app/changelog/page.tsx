import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog | Companion System",
  description:
    "The evolution of Arcanea. New features, improvements, and platform updates.",
};

const CHANGES = [
  {
    version: "v3.0.0",
    date: "March 2026",
    type: "major",
    title: "Clarity Update — Competitive Redesign",
    description:
      "A comprehensive update driven by competitive benchmarking against 10 top AI platforms. Navigation, copy, and trust signals redesigned for instant clarity.",
    changes: [
      { type: "added", text: "Pricing added to main navigation" },
      { type: "added", text: "Trust strip with tech stack on homepage" },
      { type: "added", text: "Enterprise AI credential badges on About page" },
      { type: "added", text: "Multi-provider AI support (Google, Anthropic, OpenAI)" },
      { type: "added", text: "5 Academy courses with 20+ lessons" },
      { type: "improved", text: "Homepage hero: outcome-first copy, no jargon" },
      { type: "improved", text: "How It Works section: action-first steps" },
      { type: "improved", text: "Stats: accurate 190K+ words, 364+ artworks" },
      { type: "improved", text: "All metadata descriptions rewritten for SEO" },
      { type: "improved", text: "Gallery: full-size images with generation prompts" },
      { type: "fixed", text: "CTA destination mismatch resolved" },
      { type: "fixed", text: "AI SDK v6 migration: streaming chat restored" },
    ],
  },
  {
    version: "v2.4.0",
    date: "February 2026",
    type: "major",
    title: "Companion System Launch",
    description:
      "The complete companion system is now live. 16 creative companions across four teams, each mastering their domain.",
    changes: [
      { type: "added", text: "16 companions across 4 teams" },
      { type: "added", text: "Seven Wisdoms framework integration" },
      { type: "added", text: "Academy progression system" },
      { type: "added", text: "Library with 17 collections" },
      { type: "improved", text: "New chat interface with companion selection" },
    ],
  },
  {
    version: "v2.3.0",
    date: "January 2026",
    type: "minor",
    title: "Companion System Enhancement",
    description:
      "Expanded the companion system with new archetypes and abilities.",
    changes: [
      { type: "added", text: "16 companion archetypes across 4 teams" },
      { type: "added", text: "Godbeast bonding system" },
      { type: "improved", text: "Companion ability routing" },
      { type: "fixed", text: "Companion memory persistence" },
    ],
  },
  {
    version: "v2.2.0",
    date: "December 2025",
    type: "minor",
    title: "Creative Pipeline Integration",
    description:
      "New creative workflow tools for prompt engineering and asset management.",
    changes: [
      { type: "added", text: "Prompt engine v2" },
      { type: "added", text: "Asset vault system" },
      { type: "added", text: "Creative session management" },
      { type: "improved", text: "Prompt optimization algorithms" },
    ],
  },
  {
    version: "v2.1.0",
    date: "November 2025",
    type: "minor",
    title: "Swarm Coordination",
    description: "Multi-agent orchestration and coordination features.",
    changes: [
      { type: "added", text: "Swarm coordinator" },
      { type: "added", text: "Parallel agent execution" },
      { type: "added", text: "Workflow orchestration" },
      { type: "improved", text: "Agent handoff protocols" },
    ],
  },
  {
    version: "v2.0.0",
    date: "October 2025",
    type: "major",
    title: "Arcanea Creative OS",
    description:
      "Complete platform redesign with the Creative OS architecture.",
    changes: [
      { type: "added", text: "AI Router system" },
      { type: "added", text: "Voice Enforcer" },
      { type: "added", text: "MCP server with 30+ tools" },
      { type: "added", text: "Skill-rules engine" },
      { type: "improved", text: "Full TypeScript rewrite" },
    ],
  },
  {
    version: "v1.5.0",
    date: "September 2025",
    type: "minor",
    title: "Memory & Learning",
    description:
      "Enhanced memory systems with vector search and learning capabilities.",
    changes: [
      { type: "added", text: "HNSW vector search" },
      { type: "added", text: "Companion namespaces" },
      { type: "added", text: "SONA learning engine" },
      { type: "added", text: "Trajectory recording" },
    ],
  },
  {
    version: "v1.0.0",
    date: "August 2025",
    type: "major",
    title: "Arcanea Launch",
    description:
      "Initial release of Arcanea - the creative mythology platform.",
    changes: [
      { type: "added", text: "Core platform" },
      { type: "added", text: "Basic chat interface" },
      { type: "added", text: "Initial Library content" },
      { type: "added", text: "Authentication system" },
    ],
  },
];

const CHANGELOG_BY_YEAR: Record<string, typeof CHANGES> = {
  "2026": CHANGES.slice(0, 3),
  "2025": CHANGES.slice(3),
};

export default function ChangelogPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(13,71,161,0.15),transparent_50%)]" />
      </div>

      <main className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-gold-bright animate-pulse" />
            <span className="text-sm text-gold-bright font-mono tracking-wider">
              EVOLUTION LOG
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Changelog
            <span className="block bg-gradient-to-r from-gold-bright via-[#00bcd4] to-atlantean-teal bg-clip-text text-transparent">
              The Arcanea's Journey
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
            Every update, improvement, and new capability that brings us closer
            to a better creative platform.
          </p>
        </section>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#00bcd4] via-atlantean-teal to-gold-bright hidden md:block" />

          {Object.entries(CHANGELOG_BY_YEAR).map(([year, changes]) => (
            <section key={year} className="py-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00bcd4] to-[#0d47a1] flex items-center justify-center text-white font-display font-bold text-lg shrink-0">
                  {year}
                </div>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>

              <div className="space-y-8 ml-0 md:ml-20">
                {changes.map((change, index) => (
                  <div
                    key={change.version}
                    className="relative p-6 rounded-2xl liquid-glass"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-[calc(1.5rem+1px)] top-8 w-3 h-3 rounded-full bg-gradient-to-r from-[#00bcd4] to-atlantean-teal hidden md:block" />

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              change.type === "major"
                                ? "bg-[#00bcd4]/20 text-[#00bcd4]"
                                : change.type === "minor"
                                  ? "bg-atlantean-teal/20 text-atlantean-teal"
                                  : "bg-white/[0.06] text-text-muted"
                            }`}
                          >
                            {change.version}
                          </span>
                          <span className="text-text-muted text-sm">
                            {change.date}
                          </span>
                        </div>
                        <h3 className="text-xl font-display font-semibold">
                          {change.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-text-secondary mb-4">
                      {change.description}
                    </p>

                    <ul className="space-y-2">
                      {change.changes.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span
                            className={`w-5 h-5 rounded flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                              item.type === "added"
                                ? "bg-green-500/20 text-green-400"
                                : item.type === "improved"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-orange-500/20 text-orange-400"
                            }`}
                          >
                            {item.type === "added"
                              ? "+"
                              : item.type === "improved"
                                ? "~"
                                : "!"}
                          </span>
                          <span className="text-text-secondary">
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Stats */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Versions", value: "12+" },
              { label: "Companions", value: "16" },
              { label: "Archetypes", value: "10" },
              { label: "Contributors", value: "50+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-xl liquid-glass text-center"
              >
                <div className="text-3xl font-display font-bold text-gold-bright mb-1">
                  {stat.value}
                </div>
                <div className="text-text-muted text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Subscribe */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="p-8 rounded-2xl liquid-glass text-center">
            <h3 className="text-xl font-display font-semibold mb-2">
              Stay Updated
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              Subscribe to get notified about new releases and features.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email address for changelog updates"
                className="flex-1 px-4 py-3 rounded-xl bg-cosmic-void border border-white/[0.06] text-white placeholder:text-text-muted focus:outline-none focus:border-atlantean-teal focus:ring-2 focus:ring-atlantean-teal/30"
              />
              <button className="px-6 py-3 rounded-xl bg-atlantean-teal text-cosmic-deep font-semibold hover:shadow-[0_0_20px_rgba(0,188,212,0.4)] transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
