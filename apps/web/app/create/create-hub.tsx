/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  SectionShell,
  SectionHeader,
  FeatureCard,
  FloatingOrbs,
  AuroraGradient,
  TemplateCard,
  StatusBadge,
  StatusNotice,
} from "@/components/premium";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";
import {
  TEMPLATE_DATA,
  CATEGORY_FILTERS,
  QUICK_START_ITEMS,
  RECENT_MOCK,
  type CategoryFilterId,
} from "./create-templates";
import { STUDIO_MODES, StudioDirectory } from "@/components/studio";

// ---------------------------------------------------------------------------
// QuickStartCard — large colorful tile, Canva "start a design" style
// ---------------------------------------------------------------------------

function QuickStartCard({
  label,
  symbol,
  description,
  href,
  gradient,
  glowColor,
  accentColor,
  index,
}: (typeof QUICK_START_ITEMS)[number] & { index: number }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl overflow-hidden aspect-square md:aspect-[4/3] border border-white/[0.06] hover:border-white/[0.15] transition-all duration-300 hover:scale-[1.02]"
        style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

        {/* Ambient glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: `radial-gradient(circle at 50% 60%, ${glowColor}18, transparent 70%)`,
          }}
        />

        {/* Symbol */}
        <div
          className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-display font-bold transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `${glowColor}15`,
            border: `1px solid ${glowColor}25`,
            color: accentColor,
          }}
        >
          {symbol}
        </div>

        {/* Label */}
        <div className="relative z-10 text-center px-3">
          <p className="text-sm font-display font-semibold text-white/90 leading-tight">
            {label}
          </p>
          <p
            className="text-[10px] font-mono uppercase tracking-wider mt-0.5"
            style={{ color: `${accentColor}80` }}
          >
            {description}
          </p>
        </div>

        {/* Corner arrow */}
        <span className="absolute top-3 right-3 text-white/20 text-xs transition-all duration-300 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          ↗
        </span>
      </Link>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// CategoryFilter pills
// ---------------------------------------------------------------------------

function CategoryFilter({
  active,
  onChange,
}: {
  active: CategoryFilterId;
  onChange: (id: CategoryFilterId) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {CATEGORY_FILTERS.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
            active === f.id
              ? "bg-[var(--arc-brand-atlantean-teal)]/20 border border-[var(--arc-brand-atlantean-teal)]/50 text-[var(--arc-brand-atlantean-teal)]"
              : "bg-white/[0.04] border border-white/[0.06] text-white/40 hover:border-white/[0.15] hover:text-white/70"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BrandKitPreview
// ---------------------------------------------------------------------------

function BrandKitPreview() {
  const swatches = ["var(--arc-brand-atlantean-teal)", "var(--arc-brand-atlantean-teal)", "var(--arc-brand-arcanean-gold)", "var(--arc-brand-cosmic-blue)", "var(--arc-cosmic-void)"];
  return (
    <FeatureCard glowColor="var(--arc-brand-arcanean-gold)" delay={0.1}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: copy */}
        <div className="flex-1">
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--arc-brand-arcanean-gold)]/60 mb-2">
            Brand Identity
          </p>
          <h3 className="text-xl font-display font-bold text-white/90 mb-2">
            Your Brand Kit
          </h3>
          <p className="text-sm text-white/40 leading-relaxed max-w-sm">
            Fonts, colors, voice, and visual identity. Every creation you make
            stays consistent with your brand — automatically.
          </p>
          <div className="mt-4">
            <Magnetic strength={8}>
              <Link
                href="/settings/brand"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--arc-brand-arcanean-gold)]/10 border border-[var(--arc-brand-arcanean-gold)]/30 text-[var(--arc-brand-arcanean-gold)] text-sm font-medium hover:bg-[var(--arc-brand-arcanean-gold)]/15 hover:border-[var(--arc-brand-arcanean-gold)]/50 transition-all duration-200"
              >
                Set up Brand Kit
                <span className="text-[11px]">→</span>
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* Right: mini demo */}
        <div className="flex flex-col gap-4 min-w-[200px]">
          {/* Palette */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-wider text-white/25 mb-2">
              Palette
            </p>
            <div className="flex gap-2">
              {swatches.map((c, swatchIndex) => (
                <div
                  key={`brand-swatch-${swatchIndex}-${c}`}
                  className="w-8 h-8 rounded-lg border border-white/[0.08] shadow-sm"
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Type pair */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-wider text-white/25 mb-1.5">
              Typography
            </p>
            <p className="font-display font-bold text-base text-white/80 leading-none">
              Geist
            </p>
            <p className="font-body text-xs text-white/40 mt-0.5">
              Geist — body text
            </p>
          </div>

          {/* Voice sample */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-wider text-white/25 mb-1.5">
              Voice
            </p>
            <p className="text-xs text-white/50 italic leading-snug">
              &ldquo;Precise. Evocative. Always in motion.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </FeatureCard>
  );
}

// ---------------------------------------------------------------------------
// UniversalCreatePanel -- dense mode router inspired by generation surfaces
// ---------------------------------------------------------------------------

function UniversalCreatePanel() {
  const featured = STUDIO_MODES.slice(0, 8);
  const active = featured[0];

  return (
    <SectionShell ambient="teal" grid size="compact" id="universal-create">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            label="Universal Create"
            title="Choose a studio. Create a connected artifact."
            subtitle="Worlds, books, games, music, video, campaigns, canvases, and MCP workflows share one creation grammar."
            align="left"
            accent="teal"
          />
          <Link
            href="/mcp"
            className="inline-flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-xs font-mono uppercase tracking-[0.16em] text-white/45 hover:border-white/[0.16] hover:text-white/75"
          >
            Arcanea for any AI
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4">
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {featured.map((mode) => (
                <Link
                  key={mode.id}
                  href={mode.href}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-[0.14em] transition-all ${
                    mode.id === active.id
                      ? "border-white/[0.18] bg-white/[0.10] text-white/85"
                      : "border-white/[0.07] bg-white/[0.03] text-white/35 hover:border-white/[0.14] hover:text-white/65"
                  }`}
                >
                  {mode.name}
                </Link>
              ))}
            </div>

            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${active.gradient} p-5`}>
              <Image
                src={active.media.poster}
                alt={`${active.name} preview`}
                fill
                sizes="(min-width: 1024px) 700px, 100vw"
                className="object-cover opacity-42 mix-blend-screen"
                priority
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.16),transparent_32%),linear-gradient(to_top,rgba(0,0,0,0.52),transparent)]" />
              <div className="relative grid min-h-[340px] gap-5 lg:grid-cols-[1fr_260px]">
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-white/45">
                      {active.eyebrow}
                    </p>
                    <h3 className="mt-5 max-w-xl text-3xl font-display font-bold tracking-[-0.035em] text-white md:text-5xl">
                      What are you making?
                    </h3>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/62">
                      Start with one sentence, attach references with <span className="font-mono text-white/90">@asset</span>,
                      then route the output into a studio, a vault, or an MCP handoff.
                    </p>
                  </div>
                  <div className="mt-8 rounded-2xl border border-white/[0.12] bg-black/25 p-3 backdrop-blur-sm">
                    <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-white/35">
                      Prompt
                    </p>
                    <div className="rounded-xl border border-white/[0.10] bg-black/25 p-4 text-sm text-white/75">
                      {active.prompt}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-mono text-white/45">{active.assetHint}</span>
                      <Link
                        href={active.href}
                        className="rounded-full px-5 py-2 text-sm font-semibold text-[var(--arc-cosmic-void)]"
                        style={{ background: active.accent }}
                      >
                        Generate * {active.cost}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="grid content-end gap-3">
                  {active.media.frames.map((step, index) => (
                    <m.div
                      key={step}
                      className="rounded-xl border border-white/[0.10] bg-black/20 p-3 backdrop-blur-sm"
                      initial={{ opacity: 0.55, x: 10 }}
                      animate={{ opacity: [0.55, 1, 0.55], x: [10, 0, 10] }}
                      transition={{ duration: 3.2, repeat: Infinity, delay: index * 0.25, ease: "easeInOut" }}
                    >
                      <span className="text-[10px] font-mono text-white/30">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-1 text-sm font-display font-semibold text-white/80">
                        {step}
                      </p>
                    </m.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[var(--arc-cosmic-void)]/70 p-5">
            <p className="text-[10px] font-mono uppercase tracking-[0.26em] text-white/25">
              Studio outputs
            </p>
            <div className="mt-4 space-y-3">
              {featured.slice(1, 6).map((mode) => (
                <Link
                  key={mode.id}
                  href={mode.href}
                  className="group block rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 hover:border-white/[0.14] hover:bg-white/[0.045]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-black/30">
                        <Image
                          src={mode.media.secondary}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                      <p className="text-sm font-display font-semibold text-white/80">
                        {mode.name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/36">
                        {mode.output}
                      </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-mono" style={{ color: mode.accent }}>
                      * {mode.cost}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <StudioDirectory />
        </div>
      </div>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// CreateHub — Main client component
// ---------------------------------------------------------------------------

export function CreateHub() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilterId>("all");

  const filteredTemplates =
    activeFilter === "all"
      ? TEMPLATE_DATA
      : TEMPLATE_DATA.filter((t) => t.category === activeFilter);

  // Community discovery: last 6 from the full list, shuffled feel
  const communityTemplates = TEMPLATE_DATA.slice(-6);

  return (
    <LazyMotion features={domAnimation}>
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-20">
        <FloatingOrbs preset="aurora" />
        <AuroraGradient />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={0}>
            <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
              <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/30">
                Create
              </p>
              <StatusBadge level="preview" note="Q2 2026" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-2xl mx-auto mb-8">
              <StatusNotice
                level="preview"
                title="Template gallery is a preview"
                body="Design is final. Templates below are design previews — real template storage + one-click instantiation land through Q2 2026. Use /chat or /worlds to build from scratch today."
                linkHref="/worlds"
                linkLabel="Build a world"
              />
            </div>
          </Reveal>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-[-0.03em] leading-[1.06] text-center mb-5">
            <SplitText
              text="What are you"
              as="span"
              className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent"
              delay={0.05}
              stagger={0.022}
            />
            <br />
            <SplitText
              text="making today?"
              as="span"
              className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] bg-clip-text text-transparent"
              delay={0.35}
              stagger={0.022}
            />
          </h1>

          <Reveal delay={0.6}>
            <p className="text-base md:text-lg text-white/40 leading-relaxed text-center max-w-xl mx-auto font-body">
              Start from a studio, a template, or a blank canvas. Worlds,
              books, games, music, scenes, campaigns, and agents -- all
              connected, all yours.
            </p>
          </Reveal>
        </div>
      </section>

      <UniversalCreatePanel />

      {/* ------------------------------------------------------------------ */}
      {/* QUICK START GRID                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Reveal delay={0}>
          <h2 className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/30 mb-5">
            Start something new
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_START_ITEMS.map((item, i) => (
            <QuickStartCard key={item.id} {...item} index={i} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* TEMPLATE GALLERY                                                    */}
      {/* ------------------------------------------------------------------ */}
      <SectionShell ambient="teal" grid id="templates">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <SectionHeader
              label="Templates"
              title="Start from a template"
              subtitle="Curated starting points — world-build, write, generate, or deploy in seconds."
              align="left"
              accent="teal"
            />
          </div>

          {/* Filter pills */}
          <div className="mb-8">
            <CategoryFilter active={activeFilter} onChange={setActiveFilter} />
          </div>

          {/* Template grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTemplates.map((tpl) => (
              <TemplateCard
                key={tpl.href}
                title={tpl.title}
                type={tpl.type}
                subtitle={tpl.subtitle}
                previewGradient={tpl.previewGradient}
                stats={tpl.stats}
                accentColor={tpl.accentColor}
                badge={tpl.badge}
                href={tpl.href}
                isNew={tpl.isNew}
                isPremium={tpl.isPremium}
              />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-white/30 font-body">
                No templates in this category yet.
              </p>
            </div>
          )}

          {/* Browse all CTA */}
          <div className="mt-10 flex justify-center">
            <Magnetic strength={10}>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm font-medium hover:bg-white/[0.07] hover:border-white/[0.15] hover:text-white/90 transition-all duration-200"
              >
                Browse all templates
                <span className="text-xs text-[var(--arc-brand-atlantean-teal)]">→</span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </SectionShell>

      {/* ------------------------------------------------------------------ */}
      {/* BRAND KIT                                                           */}
      {/* ------------------------------------------------------------------ */}
      <SectionShell ambient="gold" grid={false} size="compact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BrandKitPreview />
        </div>
      </SectionShell>

      {/* ------------------------------------------------------------------ */}
      {/* RECENT CREATIONS                                                    */}
      {/* ------------------------------------------------------------------ */}
      <SectionShell ambient="none" grid={false} size="compact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/25 mb-1">
                Recent
              </p>
              <h2 className="text-lg font-display font-semibold text-white/80">
                Continue where you left off
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-mono uppercase tracking-wider text-[var(--arc-brand-atlantean-teal)]/60 hover:text-[var(--arc-brand-atlantean-teal)] transition-colors"
            >
              View all
            </Link>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 scrollbar-none">
            {RECENT_MOCK.map((item) => (
              <div key={item.href} className="min-w-[220px] md:min-w-0">
                <TemplateCard
                  title={item.title}
                  type={item.type}
                  subtitle={item.subtitle}
                  previewGradient={item.previewGradient}
                  stats={item.stats}
                  accentColor={item.accentColor}
                  href={item.href}
                  badge={item.badge}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ------------------------------------------------------------------ */}
      {/* COMMUNITY DISCOVER                                                  */}
      {/* ------------------------------------------------------------------ */}
      <SectionShell ambient="purple" grid id="community">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/25 mb-2">
                Community
              </p>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white/90 tracking-[-0.02em]">
                Discover from creators
              </h2>
              <p className="text-sm text-white/35 mt-1.5 max-w-md">
                Templates made and shared by the Arcanea creator community.
              </p>
            </div>
            <Link
              href="/templates?source=community"
              className="text-xs font-mono uppercase tracking-wider text-[var(--arc-void)]/60 hover:text-[var(--arc-void)] transition-colors whitespace-nowrap"
            >
              Browse community
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityTemplates.map((tpl) => (
              <TemplateCard
                key={`community-${tpl.href}`}
                title={tpl.title}
                type={tpl.type}
                subtitle={tpl.subtitle}
                previewGradient={tpl.previewGradient}
                stats={tpl.stats}
                accentColor={tpl.accentColor}
                badge={tpl.badge}
                href={tpl.href}
                isNew={tpl.isNew}
                isPremium={tpl.isPremium}
              />
            ))}
          </div>

          {/* Contribute CTA */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div>
              <p className="text-sm font-display font-semibold text-white/80 mb-1">
                Share your templates
              </p>
              <p className="text-xs text-white/35 max-w-sm">
                Publish your own worlds, characters, and story templates so
                other creators can build on your work.
              </p>
            </div>
            <Magnetic strength={10}>
              <Link
                href="/contribute"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--arc-void)]/10 border border-[var(--arc-void)]/30 text-[var(--arc-void)] text-sm font-medium hover:bg-[var(--arc-void)]/15 hover:border-[var(--arc-void)]/50 transition-all duration-200 whitespace-nowrap"
              >
                Submit a template
                <span className="text-xs">→</span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </SectionShell>
    </LazyMotion>
  );
}
