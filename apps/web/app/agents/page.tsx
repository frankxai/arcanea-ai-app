"use client";

import { useState, useMemo } from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { CosmicParticles } from "@/components/magic/particles";
import { TextReveal, AuroraText, GradientText } from "@/components/magic/text-reveal";
import { AgentCard, type AgentCardProps } from "@/components/agents/agent-card";
import { CreditBadge } from "@/components/agents/credit-badge";
import { PremiumCard, PREMIUM_PRODUCTS } from "@/components/agents/premium-card";

// ---------------------------------------------------------------------------
// Catalog — inline until @/lib/agents/marketplace/catalog is available
// ---------------------------------------------------------------------------

type AgentCategory =
  | "all"
  | "writing"
  | "creative"
  | "development"
  | "knowledge"
  | "music"
  | "visual"
  | "publishing";

interface MarketplaceAgent extends Omit<AgentCardProps, "className"> {
  category: AgentCategory;
  capabilities: string[];
  examplePrompts: string[];
}

const AGENTS_CATALOG: MarketplaceAgent[] = [
  {
    id: "quillblade",
    name: "Quillblade",
    title: "Story Writer",
    description:
      "Crafts compelling narratives, chapters, and complete story arcs with rich character development and world-consistent prose.",
    category: "writing",
    priceCredits: 15,
    element: "Fire",
    icon: "🗡️",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #f97316)",
    rating: 4.8,
    usageCount: 3241,
    isFeatured: true,
    capabilities: ["Long-form narratives", "Chapter generation", "Dialogue writing", "Scene description"],
    examplePrompts: [
      "Write chapter 3 of my fantasy novel where the hero discovers their power",
      "Create a tense confrontation scene between two rivals",
      "Write a prologue that hooks readers from the first sentence",
    ],
  },
  {
    id: "soulforge",
    name: "Soulforge",
    title: "Character Designer",
    description:
      "Builds deep, memorable characters with backstory, motivations, voice, and personality that feel genuinely alive.",
    category: "creative",
    priceCredits: 10,
    element: "Spirit",
    icon: "🔥",
    color: "#fbbf24",
    gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    rating: 4.9,
    usageCount: 2876,
    isFeatured: true,
    capabilities: ["Character backstory", "Personality profiling", "Voice development", "Character sheets"],
    examplePrompts: [
      "Create a morally grey villain who believes they are the hero",
      "Design a side character who steals every scene they appear in",
      "Build a protagonist with a compelling inner conflict",
    ],
  },
  {
    id: "cosmograph",
    name: "Cosmograph",
    title: "World Builder",
    description:
      "Constructs entire fantasy worlds with geography, history, cultures, magic systems, and internal consistency.",
    category: "creative",
    priceCredits: 20,
    element: "Earth",
    icon: "🌍",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
    rating: 4.7,
    usageCount: 1654,
    isFeatured: false,
    capabilities: ["World geography", "History & lore", "Magic systems", "Cultural design"],
    examplePrompts: [
      "Create a world where magic is powered by music",
      "Design the political factions of a steampunk empire",
      "Build a pantheon of gods for my fantasy world",
    ],
  },
  {
    id: "inkwarden",
    name: "Inkwarden",
    title: "Editor",
    description:
      "Refines, polishes, and elevates your writing — fixing structure, voice, pacing, and clarity without losing your style.",
    category: "writing",
    priceCredits: 10,
    element: "Water",
    icon: "📝",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
    rating: 4.6,
    usageCount: 4102,
    isFeatured: false,
    capabilities: ["Line editing", "Structural feedback", "Pacing analysis", "Voice consistency"],
    examplePrompts: [
      "Edit this scene to improve the pacing and tension",
      "Strengthen the dialogue to feel more natural",
      "Rewrite this paragraph to match the chapter's tone",
    ],
  },
  {
    id: "codeweaver",
    name: "Codeweaver",
    title: "Code Builder",
    description:
      "Writes production-quality code for your creative tools, interactive stories, and web experiences.",
    category: "development",
    priceCredits: 15,
    element: "Fire",
    icon: "⚡",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    rating: 4.5,
    usageCount: 987,
    isFeatured: false,
    capabilities: ["TypeScript & React", "API integration", "Interactive fiction engines", "Web components"],
    examplePrompts: [
      "Build a character generator component with randomization",
      "Create an interactive story branching system",
      "Write a REST API for my world-building database",
    ],
  },
  {
    id: "loreseeker",
    name: "Loreseeker",
    title: "Research Agent",
    description:
      "Digs deep into mythology, history, science, and culture to provide rich, accurate reference material for your world.",
    category: "knowledge",
    priceCredits: 10,
    element: "Wind",
    icon: "🔍",
    color: "#f8fafc",
    gradient: "linear-gradient(135deg, #94a3b8, #cbd5e1)",
    rating: 4.4,
    usageCount: 1234,
    isFeatured: false,
    capabilities: ["Mythology research", "Historical accuracy", "Scientific grounding", "Cultural context"],
    examplePrompts: [
      "Research real-world mythology that inspired Norse gods",
      "Find historical precedents for a matriarchal warrior society",
      "Explain how alchemy works to inform my magic system",
    ],
  },
  {
    id: "resonance",
    name: "Resonance",
    title: "Music Composer",
    description:
      "Creates original music concepts, lyrics, chord progressions, and full song structures for your creative universe.",
    category: "music",
    priceCredits: 15,
    element: "Water",
    icon: "🎵",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    rating: 4.7,
    usageCount: 782,
    isFeatured: false,
    capabilities: ["Lyric writing", "Chord progressions", "Song structure", "Musical themes"],
    examplePrompts: [
      "Write a haunting ballad for my villain's backstory",
      "Create a battle hymn with epic orchestral feel",
      "Compose lyrics for a bard character in my fantasy world",
    ],
  },
  {
    id: "visioncraft",
    name: "Visioncraft",
    title: "Cover Artist Director",
    description:
      "Creates detailed visual art direction and prompts for stunning book covers, character art, and world illustrations.",
    category: "visual",
    priceCredits: 10,
    element: "Void",
    icon: "🎨",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    rating: 4.6,
    usageCount: 2341,
    isFeatured: false,
    capabilities: ["Art direction", "Image prompts", "Style guides", "Cover composition"],
    examplePrompts: [
      "Create an art direction brief for my novel's cover",
      "Write detailed prompts for character portrait illustrations",
      "Design a visual style guide for my fantasy world",
    ],
  },
  {
    id: "bindmaster",
    name: "Bindmaster",
    title: "Publisher",
    description:
      "Prepares your work for publication — formatting, metadata, blurbs, query letters, and distribution strategy.",
    category: "publishing",
    priceCredits: 20,
    element: "Earth",
    icon: "📚",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #22c55e, #854d0e)",
    rating: 4.3,
    usageCount: 445,
    isFeatured: false,
    capabilities: ["Book formatting", "Blurb writing", "Query letters", "Distribution planning"],
    examplePrompts: [
      "Write a compelling back-cover blurb for my novel",
      "Create a query letter for literary agents",
      "Format my manuscript for Amazon KDP",
    ],
  },
  {
    id: "heraldspark",
    name: "Heraldspark",
    title: "Social Manager",
    description:
      "Builds your author platform with compelling social content, newsletters, and launch campaigns that resonate with readers.",
    category: "publishing",
    priceCredits: 10,
    element: "Wind",
    icon: "📣",
    color: "#f8fafc",
    gradient: "linear-gradient(135deg, #64748b, #94a3b8)",
    rating: 4.2,
    usageCount: 678,
    isFeatured: false,
    capabilities: ["Social content", "Newsletter writing", "Launch campaigns", "Audience building"],
    examplePrompts: [
      "Write a Twitter thread announcing my book launch",
      "Create a month of social content for a fantasy author",
      "Draft a newsletter for my readers about the next book",
    ],
  },
  {
    id: "tonguebridge",
    name: "Tonguebridge",
    title: "Translator",
    description:
      "Translates your creative works with cultural nuance and narrative faithfulness across 50+ languages.",
    category: "writing",
    priceCredits: 15,
    element: "Wind",
    icon: "🌐",
    color: "#f8fafc",
    gradient: "linear-gradient(135deg, #78a6ff, #7fffd4)",
    rating: 4.5,
    usageCount: 334,
    isFeatured: false,
    capabilities: ["Literary translation", "Cultural adaptation", "Localization", "50+ languages"],
    examplePrompts: [
      "Translate this chapter to Spanish, keeping the poetic tone",
      "Adapt the cultural references for a Japanese audience",
      "Localize the magic system terminology for French readers",
    ],
  },
  {
    id: "gatewarden",
    name: "Gatewarden",
    title: "Curriculum Designer",
    description:
      "Designs structured learning experiences, workshops, and courses that teach world-building and creative craft.",
    category: "knowledge",
    priceCredits: 20,
    element: "Spirit",
    icon: "🎓",
    color: "#fbbf24",
    gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    rating: 4.8,
    usageCount: 221,
    isFeatured: false,
    capabilities: ["Course design", "Workshop curricula", "Learning paths", "Craft exercises"],
    examplePrompts: [
      "Design a 6-week course on fantasy world-building",
      "Create a workshop on writing compelling villains",
      "Build a learning path from beginner to published author",
    ],
  },
];

const CATEGORY_TABS: { key: AgentCategory; label: string }[] = [
  { key: "all",         label: "All Agents" },
  { key: "writing",     label: "Writing" },
  { key: "creative",    label: "Creative" },
  { key: "development", label: "Development" },
  { key: "knowledge",   label: "Knowledge" },
  { key: "music",       label: "Music" },
  { key: "visual",      label: "Visual" },
  { key: "publishing",  label: "Publishing" },
];

// ---------------------------------------------------------------------------
// Search input
// ---------------------------------------------------------------------------

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative max-w-lg mx-auto">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search agents by name or skill..."
        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/30 focus:outline-none focus:border-[#7fffd4]/50 focus:ring-1 focus:ring-[#7fffd4]/20 transition-all backdrop-blur-sm"
        aria-label="Search agents"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AgentsMarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<AgentCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Placeholder credit balance — will come from auth context when wired up
  const creditBalance = 100;

  const filteredAgents = useMemo(() => {
    let results = AGENTS_CATALOG;

    if (activeCategory !== "all") {
      results = results.filter((a) => a.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.capabilities.some((c) => c.toLowerCase().includes(q)),
      );
    }

    return results;
  }, [activeCategory, searchQuery]);

  const featuredAgents = AGENTS_CATALOG.filter((a) => a.isFeatured);
  const totalRuns = AGENTS_CATALOG.reduce((sum, a) => sum + a.usageCount, 0);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Arcanea Agents Marketplace",
              description: "Autonomous AI agents for creators — write, build, compose, design.",
              url: "https://arcanea.ai/agents",
              numberOfItems: AGENTS_CATALOG.length,
              publisher: { "@type": "Organization", name: "Arcanea" },
            }),
          }}
        />

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <CosmicParticles />

          {/* Background orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7fffd4]/8 rounded-full blur-3xl animate-float pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#78a6ff]/8 rounded-full blur-3xl animate-float-slow pointer-events-none" aria-hidden="true" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#ffd700]/5 rounded-full blur-3xl animate-pulse pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
            {/* Credit balance badge */}
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center mb-6"
            >
              <CreditBadge balance={creditBalance} size="md" />
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <p className="text-[#7fffd4] font-mono text-sm tracking-widest mb-4 uppercase">
                Agents Marketplace
              </p>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
                <span className="text-white">AI That </span>
                <AuroraText>Creates</AuroraText>
                <br />
                <span className="text-white">For You</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-4">
                {AGENTS_CATALOG.length} specialized agents ready to write, build, compose, and design
              </p>

              <p className="text-white/40 max-w-2xl mx-auto mb-10">
                Each agent is aligned to one of the Five Elements and trained on a specific creative domain.
                Spend credits, get extraordinary output.
              </p>
            </m.div>

            {/* Stats */}
            <m.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {[
                { value: String(AGENTS_CATALOG.length), label: "Agents" },
                { value: "5", label: "Elements" },
                { value: totalRuns.toLocaleString(), label: "Total Runs" },
                { value: String(creditBalance), label: "Your Credits" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl font-display font-bold text-[#7fffd4]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                </div>
              ))}
            </m.div>
          </div>
        </section>

        {/* ── Premium Experiences ─────────────────────────────────── */}
        <section className="py-16 relative" aria-labelledby="premium-heading">
          {/* Subtle background wash */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(127,255,212,0.03) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <p className="text-[#ffd700] font-mono text-xs tracking-widest uppercase mb-3">
                Premium Experiences
              </p>
              <h2
                id="premium-heading"
                className="text-3xl md:text-4xl font-display font-bold text-white mb-3"
              >
                Beyond the Agent Grid
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                Full-service creative intelligence for creators who want more than a single run.
              </p>
            </m.div>

            <div className="flex flex-col gap-5">
              {PREMIUM_PRODUCTS.map((product, i) => (
                <m.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                >
                  <PremiumCard {...product} />
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 py-4" role="separator" aria-hidden="true">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-white/30 text-sm font-medium whitespace-nowrap">
              Or run individual agents
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>
        </div>

        {/* ── Featured agents ─────────────────────────────────────── */}
        {featuredAgents.length > 0 && (
          <section className="pb-12 bg-white/[0.01]">
            <div className="max-w-7xl mx-auto px-6">
              <TextReveal className="mb-8">
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-[#ffd700]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <h2 className="text-lg font-semibold text-[#ffd700]">Featured</h2>
                </div>
              </TextReveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredAgents.map((agent, i) => (
                  <m.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="h-full"
                  >
                    <AgentCard {...agent} />
                  </m.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Catalog section ─────────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <TextReveal className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
                Browse <GradientText>Agents</GradientText>
              </h2>
              <p className="text-white/50">
                Filter by specialization or search for exactly what you need
              </p>
            </TextReveal>

            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="Agent categories">
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeCategory === tab.key;
                const count = tab.key === "all"
                  ? AGENTS_CATALOG.length
                  : AGENTS_CATALOG.filter((a) => a.category === tab.key).length;
                return (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(tab.key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60 ${
                      isActive
                        ? "bg-gradient-to-r from-[#7fffd4]/20 to-[#78a6ff]/20 border-[#7fffd4]/40 text-[#7fffd4] shadow-lg shadow-[#7fffd4]/10"
                        : "border-white/[0.08] text-white/50 hover:text-white/80 hover:border-white/[0.15] hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {tab.label}
                      <span className={`text-[10px] font-mono rounded-full px-1.5 py-0.5 ${isActive ? "bg-[#7fffd4]/20 text-[#7fffd4]" : "bg-white/5 text-white/30"}`}>
                        {count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="mb-10">
              <SearchInput value={searchQuery} onChange={setSearchQuery} />
            </div>

            {/* Grid */}
            {filteredAgents.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredAgents.map((agent, i) => (
                    <m.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                      className="h-full"
                    >
                      <AgentCard {...agent} />
                    </m.div>
                  ))}
                </div>
                <p className="text-center text-sm text-white/30 mt-8">
                  Showing {filteredAgents.length} of {AGENTS_CATALOG.length} agents
                </p>
              </>
            ) : (
              <div className="text-center py-20">
                <svg
                  className="w-16 h-16 mx-auto text-white/20 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-white/40 text-lg">No agents match your search.</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                  className="mt-4 text-sm text-[#7fffd4] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60 rounded"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-white/[0.02] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#7fffd4]/5 via-transparent to-[#78a6ff]/5 pointer-events-none" aria-hidden="true" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#7fffd4]/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <TextReveal>
              <p className="text-[#7fffd4] font-mono text-sm tracking-widest mb-4 uppercase">Deploy Now</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Your Creation <AuroraText>Awaits</AuroraText>
              </h2>
              <p className="text-lg text-white/50 mb-8">
                Pick an agent, describe what you want, and watch it come to life.
                Each run uses credits — top up anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <m.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <button
                    onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7fffd4] to-[#78a6ff] text-gray-950 font-bold rounded-xl shadow-lg shadow-[#7fffd4]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60"
                  >
                    Browse All Agents
                  </button>
                </m.div>
                <m.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <a
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#7fffd4]/40 text-[#7fffd4] font-bold rounded-xl hover:bg-[#7fffd4]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60"
                  >
                    Get Credits
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </m.div>
              </div>
            </TextReveal>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
