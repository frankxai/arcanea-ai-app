"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { CosmicParticles } from "@/components/magic/particles";
import { TextReveal, AuroraText, GradientText } from "@/components/magic/text-reveal";
import { GlowCard, FloatingCard } from "@/components/magic/glow-card";
import {
  SKILLS_CATALOG,
  SKILL_CATEGORIES,
  CATEGORY_STYLES,
  CATALOG_STATS,
  type SkillCategory,
} from "@/lib/data/skills-catalog";

// ---------------------------------------------------------------------------
// Copy-to-clipboard helper
// ---------------------------------------------------------------------------

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 p-1.5 rounded-md hover:bg-white/10 transition-colors text-text-muted hover:text-atlantean-teal"
      aria-label="Copy install command"
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Skill Card
// ---------------------------------------------------------------------------

function SkillCard({ skill, index }: { skill: (typeof SKILLS_CATALOG)[number]; index: number }) {
  const styles = CATEGORY_STYLES[skill.category];

  return (
    <FloatingCard delay={Math.min(index * 0.03, 0.3)}>
      <GlowCard glowColor={styles.glow}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-lg font-bold text-text-primary leading-tight">
              {skill.name}
            </h3>
            <span
              className={`shrink-0 text-[11px] font-mono px-2 py-0.5 rounded-full border ${styles.badge}`}
            >
              {skill.category}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
            {skill.description}
          </p>

          {/* Install command */}
          <div className="flex items-center gap-2 bg-cosmic-void/60 rounded-lg px-3 py-2 mb-4 border border-white/[0.06]">
            <code className="text-xs font-mono text-atlantean-teal truncate flex-1">
              {skill.installCommand}
            </code>
            <CopyButton text={skill.installCommand} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>{skill.author}</span>
            <div className="flex items-center gap-3">
              <span className="font-mono">v{skill.version}</span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {skill.usageCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/[0.06]">
            {skill.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </GlowCard>
    </FloatingCard>
  );
}

// ---------------------------------------------------------------------------
// Search input
// ---------------------------------------------------------------------------

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative max-w-md mx-auto mb-8">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search skills..."
        className="w-full pl-12 pr-4 py-3 rounded-xl bg-cosmic-void/60 border border-white/[0.08] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-atlantean-teal/50 focus:ring-1 focus:ring-atlantean-teal/30 transition-all"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SkillsMarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSkills = useMemo(() => {
    let results = SKILLS_CATALOG;

    if (activeCategory !== "all") {
      results = results.filter((s) => s.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.includes(q))
      );
    }

    return results;
  }, [activeCategory, searchQuery]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-cosmic-void text-text-primary">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Arcanea Skills Marketplace",
              description: "75+ production-grade skills for Claude Code and AI agents.",
              url: "https://arcanea.ai/skills",
              numberOfItems: CATALOG_STATS.totalSkills,
              publisher: { "@type": "Organization", name: "Arcanea" },
            }),
          }}
        />

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <CosmicParticles />

          {/* Background orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-atlantean-teal/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cosmic-blue/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gold-bright/5 rounded-full blur-3xl animate-pulse-glow" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-atlantean-teal font-mono text-sm tracking-widest mb-4">
                MARKETPLACE
              </p>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
                <span className="text-text-primary">Arcanea </span>
                <AuroraText>Skills</AuroraText>
                <br />
                <span className="text-text-primary">Marketplace</span>
              </h1>

              <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-4">
                75+ production-grade skills for creation
              </p>

              <p className="text-text-muted max-w-2xl mx-auto mb-10">
                From test-driven development to world-building, from swarm orchestration to book publishing.
                Every skill battle-tested across the Arcanea ecosystem.
              </p>
            </m.div>

            {/* Stats */}
            <m.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {[
                { value: String(CATALOG_STATS.totalSkills), label: "Skills" },
                { value: String(CATALOG_STATS.categories), label: "Categories" },
                { value: String(CATALOG_STATS.contributors), label: "Contributors" },
                { value: CATALOG_STATS.totalInstalls, label: "Installs" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl font-display font-bold text-atlantean-teal">
                    {stat.value}
                  </div>
                  <div className="text-sm text-text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </m.div>
          </div>
        </section>

        {/* ── Category Tabs + Search + Grid ─────────────────────── */}
        <section id="catalog" className="py-16 bg-cosmic-deep/40">
          <div className="max-w-7xl mx-auto px-6">
            <TextReveal className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
                Browse <GradientText>Skills</GradientText>
              </h2>
              <p className="text-text-secondary">
                Filter by category or search for exactly what you need
              </p>
            </TextReveal>

            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {SKILL_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      isActive
                        ? "bg-gradient-to-r from-atlantean-teal/20 to-cosmic-blue/20 border-atlantean-teal/40 text-atlantean-teal shadow-lg shadow-atlantean-teal/10"
                        : "border-white/[0.08] text-text-muted hover:text-text-secondary hover:border-white/[0.15] hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {cat.label}
                      {isActive && activeCategory !== "all" && (
                        <span className="text-[10px] font-mono opacity-70">
                          {filteredSkills.length}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <SearchInput value={searchQuery} onChange={setSearchQuery} />

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSkills.map((skill, i) => (
                <SkillCard key={skill.id} skill={skill} index={i} />
              ))}
            </div>

            {/* Empty state */}
            {filteredSkills.length === 0 && (
              <div className="text-center py-20">
                <div className="text-4xl mb-4 opacity-40">
                  <svg className="w-16 h-16 mx-auto text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-text-muted text-lg">
                  No skills match your search. Try a different term.
                </p>
              </div>
            )}

            {/* Browse count */}
            {filteredSkills.length > 0 && (
              <p className="text-center text-sm text-text-muted mt-8">
                Showing {filteredSkills.length} of {CATALOG_STATS.totalSkills}+ skills
              </p>
            )}
          </div>
        </section>

        {/* ── Install Instructions ──────────────────────────────── */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <TextReveal className="text-center mb-16">
              <p className="text-atlantean-teal font-mono text-sm tracking-widest mb-4">
                GET STARTED
              </p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Install <GradientText>Anywhere</GradientText>
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Arcanea skills work with any AI coding agent. Choose your platform.
              </p>
            </TextReveal>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Claude Code */}
              <FloatingCard delay={0}>
                <GlowCard glowColor="rgba(0, 188, 212, 0.15)">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-atlantean-teal/15 flex items-center justify-center">
                      <svg className="w-5 h-5 text-atlantean-teal" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold">Claude Code</h3>
                      <p className="text-xs text-text-muted">Native integration</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-cosmic-void/60 rounded-lg p-3 border border-white/[0.06]">
                      <p className="text-[11px] text-text-muted mb-1.5 font-mono">1. Clone the repository</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-atlantean-teal flex-1 break-all">
                          git clone github.com/frankxai/arcanea
                        </code>
                        <CopyButton text="git clone https://github.com/frankxai/arcanea" />
                      </div>
                    </div>
                    <div className="bg-cosmic-void/60 rounded-lg p-3 border border-white/[0.06]">
                      <p className="text-[11px] text-text-muted mb-1.5 font-mono">2. Copy skills to your project</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-atlantean-teal flex-1 break-all">
                          cp -r .claude/skills/* ~/.claude/skills/
                        </code>
                        <CopyButton text="cp -r .claude/skills/* ~/.claude/skills/" />
                      </div>
                    </div>
                    <div className="bg-cosmic-void/60 rounded-lg p-3 border border-white/[0.06]">
                      <p className="text-[11px] text-text-muted mb-1.5 font-mono">3. Use in Claude Code</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-atlantean-teal flex-1">
                          /skill-name or natural language
                        </code>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </FloatingCard>

              {/* Cursor */}
              <FloatingCard delay={0.1}>
                <GlowCard glowColor="rgba(120, 166, 255, 0.15)">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-cosmic-blue/15 flex items-center justify-center">
                      <svg className="w-5 h-5 text-cosmic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold">Cursor</h3>
                      <p className="text-xs text-text-muted">.cursorrules approach</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-cosmic-void/60 rounded-lg p-3 border border-white/[0.06]">
                      <p className="text-[11px] text-text-muted mb-1.5 font-mono">1. Copy skill content</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-cosmic-blue flex-1 break-all">
                          cat .claude/skills/development/SKILL.md
                        </code>
                        <CopyButton text="cat .claude/skills/development/SKILL.md" />
                      </div>
                    </div>
                    <div className="bg-cosmic-void/60 rounded-lg p-3 border border-white/[0.06]">
                      <p className="text-[11px] text-text-muted mb-1.5 font-mono">2. Add to .cursorrules</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-cosmic-blue flex-1 break-all">
                          Paste skill instructions into .cursorrules
                        </code>
                      </div>
                    </div>
                    <div className="bg-cosmic-void/60 rounded-lg p-3 border border-white/[0.06]">
                      <p className="text-[11px] text-text-muted mb-1.5 font-mono">3. Invoke naturally</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-cosmic-blue flex-1">
                          Reference skill instructions in chat
                        </code>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </FloatingCard>

              {/* Other agents */}
              <FloatingCard delay={0.2}>
                <GlowCard glowColor="rgba(251, 191, 36, 0.15)">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold">Other Agents</h3>
                      <p className="text-xs text-text-muted">Portable format</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-cosmic-void/60 rounded-lg p-3 border border-white/[0.06]">
                      <p className="text-[11px] text-text-muted mb-1.5 font-mono">1. Skills are Markdown</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-amber-400 flex-1 break-all">
                          Each skill = YAML frontmatter + instructions
                        </code>
                      </div>
                    </div>
                    <div className="bg-cosmic-void/60 rounded-lg p-3 border border-white/[0.06]">
                      <p className="text-[11px] text-text-muted mb-1.5 font-mono">2. Use as system prompts</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-amber-400 flex-1 break-all">
                          Inject skill text into agent system message
                        </code>
                      </div>
                    </div>
                    <div className="bg-cosmic-void/60 rounded-lg p-3 border border-white/[0.06]">
                      <p className="text-[11px] text-text-muted mb-1.5 font-mono">3. Works with any LLM</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-amber-400 flex-1">
                          GPT, Gemini, Claude, Llama, Mistral...
                        </code>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </FloatingCard>
            </div>
          </div>
        </section>

        {/* ── Build Your Own CTA ───────────────────────────────── */}
        <section className="py-24 bg-cosmic-deep/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-atlantean-teal/5 via-transparent to-cosmic-blue/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-atlantean-teal/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <TextReveal>
              <p className="text-atlantean-teal font-mono text-sm tracking-widest mb-4">
                EXTEND THE ECOSYSTEM
              </p>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Build Your Own <AuroraText>Skill</AuroraText>
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
                Every skill starts as a Markdown file with YAML frontmatter.
                Define instructions, examples, and triggers.
                Share with the community or keep it private.
              </p>

              <div className="bg-cosmic-void/80 rounded-xl p-6 max-w-lg mx-auto mb-10 border border-white/[0.08] text-left">
                <pre className="text-sm font-mono text-text-secondary overflow-x-auto whitespace-pre">
                  <span className="text-text-muted">---</span>
                  {"\n"}
                  <span className="text-purple-400">name</span>: <span className="text-atlantean-teal">my-custom-skill</span>
                  {"\n"}
                  <span className="text-purple-400">description</span>: <span className="text-atlantean-teal">What it does</span>
                  {"\n"}
                  <span className="text-purple-400">triggers</span>:
                  {"\n"}  - <span className="text-atlantean-teal">when user asks for X</span>
                  {"\n"}
                  <span className="text-text-muted">---</span>
                  {"\n\n"}
                  <span className="text-text-muted"># Instructions</span>
                  {"\n"}
                  <span className="text-text-secondary">Your skill logic goes here...</span>
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="https://github.com/frankxai/arcanea"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-atlantean-teal to-cosmic-blue text-cosmic-void font-bold rounded-xl shadow-atlantean"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    Skill Builder Docs
                  </Link>
                </m.div>
                <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/gallery"
                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-atlantean-teal/50 text-atlantean-teal font-bold rounded-xl hover:bg-atlantean-teal/10 transition-colors"
                  >
                    See What Others Built
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </m.div>
              </div>
            </TextReveal>
          </div>
        </section>

        {/* ── Footer Quote ─────────────────────────────────────── */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <m.p
              className="text-text-muted italic text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              &ldquo;Most tools give you automation. Arcanea gives you transformation.&rdquo;
            </m.p>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
