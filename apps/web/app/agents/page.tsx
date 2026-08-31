/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useState, useMemo } from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { AgentCard, type AgentCardProps } from "@/components/agents/agent-card";
import { CreditBadge } from "@/components/agents/credit-badge";
import { PremiumCard, PREMIUM_PRODUCTS } from "@/components/agents/premium-card";
import { FACTS } from "@/lib/facts";
import {
  SectionShell,
  SectionHeader,
  FeatureCard,
  FeatureIcon,
  StatCard,
  FloatingOrbs,
  GridTexture,
} from "@/components/premium";

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
    color: "var(--arc-fire)",
    gradient: "linear-gradient(135deg, var(--arc-fire), var(--arc-fire))",
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
    color: "var(--arc-brand-arcanean-gold)",
    gradient: "linear-gradient(135deg, var(--arc-brand-arcanean-gold), var(--arc-brand-arcanean-gold))",
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
    color: "var(--arc-wind)",
    gradient: "linear-gradient(135deg, var(--arc-wind), var(--arc-wind))",
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
    color: "var(--arc-brand-cosmic-blue)",
    gradient: "linear-gradient(135deg, var(--arc-brand-cosmic-blue), var(--arc-brand-cosmic-blue))",
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
    color: "var(--arc-fire)",
    gradient: "linear-gradient(135deg, var(--arc-fire), var(--arc-fire))",
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
    color: "var(--arc-text-primary)",
    gradient: "linear-gradient(135deg, var(--arc-void), var(--arc-text-primary))",
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
    color: "var(--arc-brand-cosmic-blue)",
    gradient: "linear-gradient(135deg, var(--arc-brand-cosmic-blue), var(--arc-brand-atlantean-teal))",
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
    color: "var(--arc-void)",
    gradient: "linear-gradient(135deg, var(--arc-void), var(--arc-void))",
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
    color: "var(--arc-wind)",
    gradient: "linear-gradient(135deg, var(--arc-wind), var(--arc-earth))",
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
    color: "var(--arc-text-primary)",
    gradient: "linear-gradient(135deg, var(--arc-earth), var(--arc-void))",
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
    color: "var(--arc-text-primary)",
    gradient: "linear-gradient(135deg, var(--arc-brand-cosmic-blue), var(--arc-brand-atlantean-teal))",
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
    color: "var(--arc-brand-arcanean-gold)",
    gradient: "linear-gradient(135deg, var(--arc-brand-arcanean-gold), var(--arc-brand-arcanean-gold))",
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

const AGENT_DOMAIN_COUNT = new Set(AGENTS_CATALOG.map((a) => a.category)).size;

const CATEGORY_TABS: { key: AgentCategory; label: string }[] = [
  { key: "all",         label: "All" },
  { key: "writing",     label: "Writing" },
  { key: "creative",    label: "Creative" },
  { key: "development", label: "Dev" },
  { key: "knowledge",   label: "Knowledge" },
  { key: "music",       label: "Music" },
  { key: "visual",      label: "Visual" },
  { key: "publishing",  label: "Publishing" },
];

// ---------------------------------------------------------------------------
// How It Works steps
// ---------------------------------------------------------------------------

const HOW_IT_WORKS = [
  {
    number: "01",
    title: "Choose",
    description: "Pick a Luminor for your creative domain. Each one is trained for a specific craft — story, music, code, art.",
    color: "var(--arc-brand-atlantean-teal)",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Create",
    description: "Describe your project in plain language. The Luminor generates, iterates, and refines with you in real time.",
    color: "var(--arc-brand-atlantean-teal)",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Own",
    description: "Your creations are yours. Export anytime — markdown, PDF, EPUB, or raw text. No lock-in, ever.",
    color: "var(--arc-brand-arcanean-gold)",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// SearchInput
// ---------------------------------------------------------------------------

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative max-w-lg mx-auto">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none"
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
        placeholder="Search by name or skill..."
        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/40 focus:ring-1 focus:ring-[var(--arc-brand-atlantean-teal)]/15 transition-all backdrop-blur-sm"
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
      <div className="min-h-screen bg-[var(--arc-cosmic-void)] text-white">
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

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative pt-28 pb-20 overflow-hidden" aria-labelledby="hero-heading">
          <FloatingOrbs preset="cosmic" />
          <GridTexture variant="dots" opacity={0.018} />

          {/* Top strip — credit badge */}
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <m.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex justify-center mb-8"
            >
              <CreditBadge balance={creditBalance} size="md" />
            </m.div>

            {/* Label */}
            <m.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-center text-[11px] font-mono tracking-[0.3em] uppercase text-white/30 mb-5"
            >
              Agents Marketplace
            </m.p>

            {/* Headline */}
            <m.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-center text-4xl sm:text-5xl md:text-7xl font-display font-bold tracking-[-0.03em] leading-[1.05] mb-6"
            >
              <span
                className="bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] bg-clip-text text-transparent"
              >
                Meet the Luminors
              </span>
            </m.h1>

            {/* Subtitle */}
            <m.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="text-center text-base md:text-xl text-white/50 max-w-2xl mx-auto mb-14 leading-relaxed font-body"
            >
              {FACTS.luminors} named specialists, each with its own craft, memory, and voice.
              Pick the one whose work is closest to yours.
            </m.p>

            {/* Stats row */}
            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26 }}
              className="grid grid-cols-3 gap-6 max-w-xl mx-auto"
            >
              <StatCard value={String(FACTS.luminors)} label="Luminors" color="var(--arc-brand-atlantean-teal)" delay={0.3} />
              <StatCard value={String(AGENT_DOMAIN_COUNT)} label="Domains" color="var(--arc-brand-atlantean-teal)" delay={0.36} />
              <StatCard value={String(AGENTS_CATALOG.length)} label="Agents live" color="var(--arc-brand-cosmic-blue)" delay={0.42} />
            </m.div>
          </div>
        </section>

        {/* ── Premium Experiences ────────────────────────────────────── */}
        <SectionShell ambient="gold" grid size="compact" id="premium">
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeader
              label="Premium Experiences"
              title="Beyond the Agent Grid"
              subtitle="Full-service creative intelligence for creators who want more than a single run."
              accent="gold"
            />

            <div className="flex flex-col gap-5">
              {PREMIUM_PRODUCTS.map((product, i) => (
                <m.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <PremiumCard {...product} />
                </m.div>
              ))}
            </div>
          </div>
        </SectionShell>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 py-2" role="separator" aria-hidden="true">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/[0.05]" />
            <span className="text-white/20 text-xs font-mono tracking-widest uppercase whitespace-nowrap">
              or run individual agents
            </span>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </div>
        </div>

        {/* ── Featured agents ─────────────────────────────────────────── */}
        {featuredAgents.length > 0 && (
          <section className="py-12" aria-labelledby="featured-heading">
            <div className="max-w-7xl mx-auto px-6">
              <m.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 mb-6"
              >
                <svg className="w-4 h-4 text-[var(--arc-brand-arcanean-gold)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <h2 id="featured-heading" className="text-sm font-semibold text-[var(--arc-brand-arcanean-gold)] tracking-wide uppercase">
                  Featured
                </h2>
              </m.div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredAgents.map((agent, i) => (
                  <m.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="h-full"
                  >
                    <FeatureCard glowColor={agent.color} delay={i * 0.1} compact className="h-full p-0">
                      <AgentCard {...agent} />
                    </FeatureCard>
                  </m.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Catalog section ──────────────────────────────────────────── */}
        <section className="py-16" id="catalog" aria-labelledby="catalog-heading">
          <div className="max-w-7xl mx-auto px-6">
            <m.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 id="catalog-heading" className="text-3xl md:text-4xl font-display font-bold mb-2">
                <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] bg-clip-text text-transparent">
                  Browse Agents
                </span>
              </h2>
              <p className="text-white/40 text-sm font-body">
                Filter by specialization or search for exactly what you need
              </p>
            </m.div>

            {/* Category tabs — glass pills */}
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
                    className={`
                      inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium
                      border backdrop-blur-sm transition-all duration-200
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/50
                      ${isActive
                        ? "bg-[var(--arc-brand-atlantean-teal)]/[0.12] border-[var(--arc-brand-atlantean-teal)]/30 text-[var(--arc-brand-atlantean-teal)] shadow-[0_0_12px_rgba(0,188,212,0.12)]"
                        : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/[0.12] hover:bg-white/[0.06]"
                      }
                    `}
                  >
                    {tab.label}
                    <span
                      className={`text-[9px] font-mono rounded-full px-1.5 py-0.5 min-w-[18px] text-center tabular-nums ${
                        isActive ? "bg-[var(--arc-brand-atlantean-teal)]/20 text-[var(--arc-brand-atlantean-teal)]" : "bg-white/[0.05] text-white/25"
                      }`}
                    >
                      {count}
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
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.28) }}
                      className="h-full"
                    >
                      <AgentCard {...agent} />
                    </m.div>
                  ))}
                </div>
                <p className="text-center text-xs text-white/20 font-mono mt-8">
                  {filteredAgents.length} of {AGENTS_CATALOG.length} agents
                </p>
              </>
            ) : (
              <div className="text-center py-20">
                <svg
                  className="w-12 h-12 mx-auto text-white/15 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-white/30 text-base mb-4">No agents match your search.</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                  className="text-sm text-[var(--arc-brand-atlantean-teal)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/50 rounded"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── How Luminors Work ────────────────────────────────────────── */}
        <SectionShell ambient="teal" grid size="compact" id="how-it-works">
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeader
              label="How it works"
              title="Three steps to creation"
              subtitle="From first idea to finished work — Luminors guide you at every stage."
              accent="teal"
            />

            {/* 3-step flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Connecting lines — visible on md+ */}
              <div className="hidden md:block absolute top-10 left-[calc(33.33%+1.5rem)] right-[calc(33.33%+1.5rem)] h-px" aria-hidden="true">
                <div className="h-full bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/20 via-[var(--arc-brand-atlantean-teal)]/30 to-[var(--arc-brand-atlantean-teal)]/20" />
              </div>

              {HOW_IT_WORKS.map((step, i) => (
                <FeatureCard
                  key={step.number}
                  glowColor={step.color}
                  delay={i * 0.15}
                  compact
                >
                  {/* Numbered badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-mono font-bold shrink-0"
                      style={{
                        background: `${step.color}14`,
                        border: `1px solid ${step.color}22`,
                        color: step.color,
                      }}
                    >
                      {step.number}
                    </div>
                    <FeatureIcon color={step.color} size="sm">
                      {step.icon}
                    </FeatureIcon>
                  </div>

                  <h3
                    className="text-lg font-display font-bold mb-2"
                    style={{ color: step.color }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed font-body">
                    {step.description}
                  </p>
                </FeatureCard>
              ))}
            </div>
          </div>
        </SectionShell>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden" aria-labelledby="cta-heading">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,188,212,0.05) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <GridTexture variant="dots" opacity={0.015} />

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/25 mb-5">
                Deploy Now
              </p>
              <h2
                id="cta-heading"
                className="text-3xl md:text-5xl font-display font-bold mb-5 tracking-[-0.02em]"
              >
                <span className="bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] bg-clip-text text-transparent">
                  Your creation awaits
                </span>
              </h2>
              <p className="text-base text-white/40 mb-10 max-w-lg mx-auto font-body leading-relaxed">
                Pick a Luminor, describe what you want, and watch it come to life.
                Each run uses credits — top up anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <m.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] text-[var(--arc-cosmic-void)] font-semibold text-sm rounded-xl shadow-[0_0_24px_rgba(0,188,212,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/60 transition-shadow hover:shadow-[0_0_32px_rgba(0,188,212,0.3)]"
                >
                  Browse All Agents
                </m.button>
                <m.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[var(--arc-brand-atlantean-teal)]/25 text-[var(--arc-brand-atlantean-teal)] font-semibold text-sm rounded-xl hover:bg-[var(--arc-brand-atlantean-teal)]/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/60"
                >
                  Get Credits
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </m.a>
              </div>
            </m.div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
