"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import {
  SectionShell,
  SectionHeader,
  FeatureCard,
  FeatureIcon,
  StatCard,
  FloatingOrbs,
  ConnectedFlow,
  type FlowStep,
  IntegrationGrid,
  SovereigntyBadge,
  DropZone,
} from "@/components/premium";
import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";
import {
  FileText,
  User,
  ImageSquare,
  MusicNote,
  PencilSimple,
  GameController,
  Database,
  ArrowRight,
  MagnifyingGlass,
} from "@/lib/phosphor-icons";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const HERO_STATS = [
  { value: "12+", label: "Formats", color: "#7fffd4" },
  { value: "6", label: "Sources", color: "#00bcd4" },
  { value: "MD + JSONML", label: "Storage", color: "#ffd700" },
  { value: "pgvector", label: "Search", color: "#a855f7" },
];

const FLOW_STEPS: FlowStep[] = [
  {
    number: "01",
    title: "Ingest",
    body: "Drop in a PDF, a YouTube link, an Obsidian vault. Anything. The Studio accepts files, URLs, paste, and direct source pulls.",
    accent: "#7fffd4",
  },
  {
    number: "02",
    title: "Classify",
    body: "The Studio auto-detects: is this a character? a location? a scene? a chapter? Type inference runs before a single byte is stored.",
    accent: "#00bcd4",
  },
  {
    number: "03",
    title: "Store",
    body: "Written to Markdown and JSONML. Embedded with pgvector. Ready for semantic search across your entire world graph.",
    accent: "#ffd700",
  },
  {
    number: "04",
    title: "Connect",
    body: "Linked to your world graph. Referenced by your Luminors. Exported on demand in any open format. Yours to take anywhere.",
    accent: "#0d47a1",
  },
];

interface TransformCard {
  icon: React.ComponentType<{ size?: number; weight?: string; style?: React.CSSProperties }>;
  title: string;
  body: string;
  color: string;
  delay: number;
}

const TRANSFORMS: TransformCard[] = [
  {
    icon: FileText,
    title: "Summarize",
    body: "Long doc to one-page brief with key characters, locations, and lore tagged automatically.",
    color: "#00bcd4",
    delay: 0,
  },
  {
    icon: User,
    title: "Extract Characters",
    body: "Auto-identify everyone mentioned, pull their quotes, add them to your world roster.",
    color: "#a855f7",
    delay: 0.06,
  },
  {
    icon: ImageSquare,
    title: "Generate World Art",
    body: "From a text description to four generated images via Nano Banana 2. One prompt, four visions.",
    color: "#f472b6",
    delay: 0.12,
  },
  {
    icon: MusicNote,
    title: "Compose Soundtrack",
    body: "Scene description to Suno-generated track matching the vibe. Atmosphere becomes audio in seconds.",
    color: "#ef4444",
    delay: 0.18,
  },
  {
    icon: PencilSimple,
    title: "Translate to Scene",
    body: "Plot outline to full scene prose in your established voice. The Studio learns how you write.",
    color: "#7fffd4",
    delay: 0.24,
  },
  {
    icon: GameController,
    title: "Map to Game Engine",
    body: "Character and location data to Unreal or Unity-ready asset JSON. Build and ship without re-keying.",
    color: "#34d399",
    delay: 0.3,
  },
];

const STORAGE_GUARANTEES = [
  {
    title: "Markdown",
    body: "Every text asset written as portable .md. Frontmatter for metadata. Obsidian and Notion-compatible out of the box.",
    color: "#7fffd4",
    delay: 0,
  },
  {
    title: "JSONML",
    body: "Structured content as JSON. SIS-compatible. Deterministic shape. Fully programmable — pipe it anywhere.",
    color: "#00bcd4",
    delay: 0.08,
  },
  {
    title: "Open graph schema",
    body: "Your world exports as W3C-compatible linked data. Import into anything that speaks JSON-LD or RDF.",
    color: "#ffd700",
    delay: 0.16,
  },
  {
    title: "Your object storage",
    body: "Arweave, S3, Google Drive, Syncthing — bring your own backend. Arcanea never holds your data hostage.",
    color: "#a855f7",
    delay: 0.24,
  },
];

const SEMANTIC_QUERIES = [
  "What characters feel like Kael?",
  "Scenes set in underground locations",
  "Factions with ambiguous loyalties",
  "Chapters with unresolved conflict",
];

// ---------------------------------------------------------------------------
// StudioHub
// ---------------------------------------------------------------------------

export function StudioHub() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="relative bg-[#09090b] min-h-screen">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          <FloatingOrbs preset="aurora" className="pointer-events-none absolute inset-0" />

          {/* Dot grid */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.02]"
            aria-hidden
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-24">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6"
            >
              <SovereigntyBadge />
            </m.div>

            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[11px] font-mono tracking-[0.35em] uppercase text-white/30 mb-5"
            >
              Arcanea Studio
            </m.p>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-[-0.04em] leading-[0.95] mb-6">
              <SplitText
                text="The Studio"
                className="bg-gradient-to-r from-[#7fffd4] via-[#00bcd4] to-white/70 bg-clip-text text-transparent"
                as="span"
                delay={0.15}
                stagger={0.025}
              />
            </h1>

            <Reveal delay={0.35} y={16}>
              <p className="text-lg md:text-xl text-white/45 leading-relaxed max-w-2xl font-body mb-12">
                Drop anything in. Everything becomes connected. Files, URLs, embeds, API pulls — the
                Studio classifies, stores in Markdown and JSONML, and routes to your world graph.
                Open formats. Semantic search. Yours forever.
              </p>
            </Reveal>

            {/* Stats row */}
            <Reveal delay={0.5} y={12}>
              <div className="flex flex-wrap gap-10 md:gap-16">
                {HERO_STATS.map((s, i) => (
                  <StatCard
                    key={s.label}
                    value={s.value}
                    label={s.label}
                    color={s.color}
                    delay={0.55 + i * 0.07}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── DropZone ─────────────────────────────────────────── */}
        <SectionShell ambient="teal" size="compact" id="ingest">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader
              label="Ingestion"
              title="Drop anything in"
              subtitle="Files, URLs, paste — or connect an entire source. The Studio takes it from there."
            />
            <DropZone />
          </div>
        </SectionShell>

        {/* ── Four Acts ────────────────────────────────────────── */}
        <SectionShell ambient="none" size="default" id="how-it-works">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader
              label="The Process"
              title="Four acts of Studio"
              subtitle="Every piece of content travels the same path — ingest, classify, store, connect. Nothing falls through the cracks."
            />
            <ConnectedFlow steps={FLOW_STEPS} />
          </div>
        </SectionShell>

        {/* ── Transformation Showcase ──────────────────────────── */}
        <SectionShell ambient="purple" size="default" id="transforms">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader
              label="Magic Transforms"
              title="One asset, infinite forms"
              subtitle="The Studio does not just store — it transforms. Pick any ingested asset and run a magic transform to generate new creative work."
              accent="purple"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TRANSFORMS.map((t) => {
                const Icon = t.icon;
                return (
                  <FeatureCard key={t.title} glowColor={t.color} delay={t.delay} compact>
                    <FeatureIcon color={t.color} size="md">
                      <Icon size={20} weight="duotone" style={{ color: t.color }} />
                    </FeatureIcon>
                    <h3
                      className="text-base font-display font-semibold mb-1.5"
                      style={{ color: t.color }}
                    >
                      {t.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">{t.body}</p>
                  </FeatureCard>
                );
              })}
            </div>
          </div>
        </SectionShell>

        {/* ── Storage Standards ────────────────────────────────── */}
        <SectionShell ambient="gold" size="default" id="storage">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader
              label="Open by default"
              title="Your content, your formats"
              subtitle="Everything the Studio writes is portable and open. No proprietary lock-in, no vendor dependencies."
              accent="gold"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {STORAGE_GUARANTEES.map((g) => (
                <FeatureCard key={g.title} glowColor={g.color} delay={g.delay} compact>
                  <div
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg mb-4 text-xs font-mono font-bold"
                    style={{
                      background: `${g.color}12`,
                      border: `1px solid ${g.color}20`,
                      color: g.color,
                    }}
                  >
                    <Database size={16} weight="duotone" style={{ color: g.color }} />
                  </div>
                  <h3
                    className="text-sm font-display font-semibold mb-2"
                    style={{ color: g.color }}
                  >
                    {g.title}
                  </h3>
                  <p className="text-xs text-white/45 leading-relaxed">{g.body}</p>
                </FeatureCard>
              ))}
            </div>
          </div>
        </SectionShell>

        {/* ── Integrations ─────────────────────────────────────── */}
        <SectionShell ambient="teal" size="compact" id="integrations">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader
              label="Connected sources"
              title="Bring in what you already have"
              subtitle="The Studio connects to your existing creative stack. Pull in entire vaults, repos, and drives — not just one file at a time."
            />
            <IntegrationGrid limit={12} />
          </div>
        </SectionShell>

        {/* ── Semantic Intelligence ────────────────────────────── */}
        <SectionShell ambient="purple" size="default" id="semantic">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: copy */}
              <div>
                <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/30 mb-4">
                  Semantic Intelligence
                </p>
                <h2 className="text-3xl md:text-5xl font-display font-bold tracking-[-0.03em] leading-[1.08] mb-5">
                  <span className="bg-gradient-to-r from-[#c084fc] via-[#7c3aed] to-[#0d47a1] bg-clip-text text-transparent">
                    Semantic intelligence woven through
                  </span>
                </h2>
                <p className="text-base text-white/40 leading-relaxed mb-8 font-body">
                  Every ingested asset gets embedded. Ask{" "}
                  <span className="text-white/70 italic">&ldquo;what characters feel like Kael?&rdquo;</span>{" "}
                  and the Studio finds them across every world, every note, every chat.
                  pgvector with HNSW indexing runs approximately 150x faster than keyword search.
                </p>

                {/* Pipeline diagram */}
                <div className="flex items-center gap-2 flex-wrap">
                  {["Ingest", "Embed", "Index", "Retrieve", "Reference"].map((step, i, arr) => (
                    <div key={step} className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-[11px] font-mono text-white/60">
                        {step}
                      </span>
                      {i < arr.length - 1 && (
                        <ArrowRight size={12} className="text-white/20 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: mock search */}
              <div className="space-y-3">
                <div className="rounded-2xl bg-white/[0.025] border border-white/[0.07] backdrop-blur-sm p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <MagnifyingGlass size={16} className="text-[#a855f7]/70 shrink-0" />
                    <span className="text-sm text-white/30 font-mono">Semantic search</span>
                  </div>
                  <div className="space-y-2">
                    {SEMANTIC_QUERIES.map((q, i) => (
                      <m.div
                        key={q}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] group hover:border-[#a855f7]/30 hover:bg-[#a855f7]/[0.04] transition-all cursor-pointer"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: "#a855f7", opacity: 0.6 }}
                        />
                        <span className="text-sm text-white/55 group-hover:text-white/85 transition-colors font-body">
                          {q}
                        </span>
                      </m.div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-white/[0.015] border border-white/[0.05] px-4 py-3 flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: "#a855f7" }}
                  />
                  <span className="text-xs text-white/30 font-mono">
                    pgvector + HNSW — ~150x faster than keyword search
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* ── Final CTA ────────────────────────────────────────── */}
        <SectionShell ambient="teal" size="compact" id="cta">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <Reveal>
              <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/25 mb-6">
                Ready to build
              </p>
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-[-0.04em] leading-[1.05] mb-6">
                <span className="bg-gradient-to-r from-[#7fffd4] via-[#00bcd4] to-white/80 bg-clip-text text-transparent">
                  Open your Studio
                </span>
              </h2>
              <p className="text-base text-white/35 leading-relaxed mb-10 font-body">
                Your content, your formats, your world. Start with a single drop.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/chat"
                  className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-base font-semibold transition-all"
                  style={{
                    background: "linear-gradient(135deg, #7fffd4, #00bcd4)",
                    color: "#09090b",
                    boxShadow: "0 0 0 rgba(127,255,212,0)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      "0 0 32px rgba(127,255,212,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                      "0 0 0 rgba(127,255,212,0)";
                  }}
                >
                  Start creating
                  <ArrowRight size={18} weight="bold" />
                </Link>
                <Link
                  href="/storage"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/60 hover:bg-white/[0.07] hover:text-white/90 hover:border-white/[0.14] transition-all"
                >
                  See storage docs
                </Link>
              </div>
            </Reveal>
          </div>
        </SectionShell>

      </div>
    </LazyMotion>
  );
}
