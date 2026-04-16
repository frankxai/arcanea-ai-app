"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import {
  SectionShell,
  SectionHeader,
  StatCard,
  FloatingOrbs,
  GridTexture,
  SovereigntyBadge,
  ConnectedFlow,
  IntegrationGrid,
  StackLayerDiagram,
  type FlowStep,
} from "@/components/premium";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const STATS = [
  { value: "30+", label: "Integrations", color: "#7fffd4" },
  { value: "8", label: "Categories", color: "#00bcd4" },
  { value: "MIT", label: "Licensed", color: "#ffd700" },
  { value: "BYOK", label: "Forever", color: "#c084fc" },
];

const FLOW_STEPS: FlowStep[] = [
  {
    number: "01",
    title: "Connect",
    body: "OAuth to tools you already use — GitHub, Discord, Notion, Supabase. Add your AI keys (Anthropic, OpenAI, Gemini) via BYOK. No markup, no lock-in.",
    accent: "#7fffd4",
  },
  {
    number: "02",
    title: "Create",
    body: "Build in Arcanea: write, generate images with Nano Banana 2, compose music with Suno, animate with Hedra. One canvas, every modality.",
    accent: "#00bcd4",
  },
  {
    number: "03",
    title: "Own",
    body: "Export everything as portable files — Markdown, JSON, MP3, PNG. Run locally if you want. Publish to any channel with one click.",
    accent: "#ffd700",
  },
];

interface FeaturedCard {
  title: string;
  category: string;
  tools: string[];
  description: string;
  accent: string;
  glyph: string;
}

const FEATURED_CARDS: FeaturedCard[] = [
  {
    title: "Claude Code + Cursor + VS Code",
    category: "Development",
    tools: ["Claude Code", "Cursor", "VS Code", "Windsurf"],
    description:
      "Luminors live in your IDE via MCP. Write alongside 16 specialists. Context flows from your world graph directly into the cursor.",
    accent: "#00bcd4",
    glyph: "⎈",
  },
  {
    title: "Suno + Nano Banana 2",
    category: "Creative AI",
    tools: ["Suno", "Nano Banana 2", "ElevenLabs", "Hedra"],
    description:
      "Text, image, music — generated inline, stored in your world graph. Every output tagged to its world, character, and moment in the story.",
    accent: "#f472b6",
    glyph: "♪",
  },
  {
    title: "Blotato + n8n + Postiz",
    category: "Distribution",
    tools: ["Blotato", "n8n", "Postiz", "Zapier"],
    description:
      "One-click publish to Discord, Reddit, X, YouTube, and Instagram. Workflows run on your schedule — or triggered by creation events.",
    accent: "#ffd700",
    glyph: "◬",
  },
];

const COMING_SOON = [
  { name: "Obsidian", note: "Vault sync" },
  { name: "Figma", note: "Design bridge" },
  { name: "Pika", note: "Video gen" },
  { name: "Notion AI", note: "Docs co-pilot" },
  { name: "Linear AI", note: "Issue gen" },
  { name: "Warpcast", note: "Social graph" },
];

const CATEGORIES = [
  {
    label: "Coding & Dev",
    filter: "coding" as const,
    ambient: "teal" as const,
    description: "Write, review, and deploy from your IDE with Luminors alongside.",
  },
  {
    label: "Creative AI",
    filter: "ai" as const,
    ambient: "purple" as const,
    description: "Specialist models for music, imagery, voice, and video — inline.",
  },
  {
    label: "Distribution",
    filter: "social" as const,
    ambient: "gold" as const,
    description: "Automated pipelines that carry your work to every channel.",
  },
  {
    label: "Communities",
    filter: "community" as const,
    ambient: "teal" as const,
    description: "Discord, Reddit, Whop — where your audience already lives.",
  },
  {
    label: "Game Engines",
    filter: "game" as const,
    ambient: "fire" as const,
    description: "Export world graph data directly into Unreal, Unity, and Godot.",
  },
  {
    label: "Blockchain",
    filter: "chain" as const,
    ambient: "purple" as const,
    description: "Sovereign identity and monetization on Base and Story Protocol.",
  },
  {
    label: "Platforms & Infra",
    filter: "infra" as const,
    ambient: "teal" as const,
    description: "Vercel, Supabase, Stripe, Notion — everything else just works.",
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FeaturedIntegrationCard({ card, index }: { card: FeaturedCard; index: number }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative p-6 md:p-8 rounded-2xl bg-white/[0.025] border border-white/[0.06] backdrop-blur-sm hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-500"
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(500px circle at 50% 0%, ${card.accent}10, transparent 60%)`,
        }}
      />

      <div className="relative">
        {/* Glyph + category */}
        <div className="flex items-center gap-3 mb-5">
          <span
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{
              background: `${card.accent}12`,
              border: `1px solid ${card.accent}25`,
              color: card.accent,
            }}
          >
            {card.glyph}
          </span>
          <span
            className="text-[10px] font-mono tracking-[0.25em] uppercase px-2.5 py-1 rounded-full"
            style={{
              background: `${card.accent}10`,
              border: `1px solid ${card.accent}20`,
              color: `${card.accent}bb`,
            }}
          >
            {card.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-display font-semibold text-white mb-3 leading-tight">
          {card.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/45 leading-relaxed mb-5">
          {card.description}
        </p>

        {/* Tool pills */}
        <div className="flex flex-wrap gap-1.5">
          {card.tools.map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] text-[11px] font-mono text-white/40"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Main content component
// ---------------------------------------------------------------------------

export function IntegrationsContent() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-[#09090b] text-white">
        <GridTexture className="fixed" />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative min-h-[85vh] flex items-center py-20 overflow-hidden">
          <FloatingOrbs preset="cosmic" />

          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
            <m.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <SovereigntyBadge />
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-[-0.03em] leading-[1.05] mb-6">
                <span className="bg-gradient-to-r from-[#7fffd4] via-[#00bcd4] to-[#0d47a1] bg-clip-text text-transparent">
                  The full creator stack
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-base md:text-lg text-white/40 leading-relaxed font-body mb-14">
                From IDE to blockchain. From Suno to Unreal. Arcanea connects the whole pipeline
                so your world reaches every surface creators ship on.
              </p>

              {/* Stats row */}
              <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
                {STATS.map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-8 md:gap-14">
                    {i > 0 && (
                      <span className="hidden sm:block w-px h-5 bg-white/[0.06]" />
                    )}
                    <StatCard
                      value={stat.value}
                      label={stat.label}
                      color={stat.color}
                      delay={i * 0.08}
                    />
                  </div>
                ))}
              </div>
            </m.div>
          </div>
        </section>

        {/* ── Stack Diagram ─────────────────────────────────────────────── */}
        <SectionShell id="stack" ambient="teal" grid={false}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="Architecture"
              title="The full stack, one platform"
              subtitle="Arcanea sits in the middle. You bring your tools — we connect them."
              accent="teal"
            />
            <StackLayerDiagram />
          </div>
        </SectionShell>

        {/* ── By Category ───────────────────────────────────────────────── */}
        {CATEGORIES.map((cat) => (
          <SectionShell
            key={cat.filter}
            id={cat.filter}
            ambient={cat.ambient}
            size="compact"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/25 mb-3">
                  Category
                </p>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                  {cat.label}
                </h2>
                <p className="text-sm text-white/35 font-body">{cat.description}</p>
              </div>
              <IntegrationGrid filter={cat.filter} />
            </div>
          </SectionShell>
        ))}

        {/* ── How It Works ──────────────────────────────────────────────── */}
        <SectionShell id="how-it-works" ambient="gold">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="Workflow"
              title="Connect. Create. Own."
              subtitle="Three steps from your first tool connection to owning your output."
              accent="gold"
            />
            <ConnectedFlow steps={FLOW_STEPS} />
          </div>
        </SectionShell>

        {/* ── Featured Integrations ─────────────────────────────────────── */}
        <SectionShell id="featured" ambient="purple">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label="Deep Dives"
              title="Featured integrations"
              subtitle="The three integrations that change how you ship."
              accent="teal"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {FEATURED_CARDS.map((card, i) => (
                <FeaturedIntegrationCard key={card.title} card={card} index={i} />
              ))}
            </div>
          </div>
        </SectionShell>

        {/* ── Coming Soon + Request ─────────────────────────────────────── */}
        <SectionShell id="upcoming" ambient="teal" size="compact">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Coming soon */}
              <div>
                <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/25 mb-3">
                  On the roadmap
                </p>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8">
                  Coming soon
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COMING_SOON.map((item, i) => (
                    <m.div
                      key={item.name}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0"
                        style={{ boxShadow: "0 0 6px rgba(255,255,255,0.15)" }}
                      />
                      <span className="text-sm font-display text-white/55">{item.name}</span>
                      <span className="text-[10px] font-mono text-white/25 ml-auto">
                        {item.note}
                      </span>
                    </m.div>
                  ))}
                </div>
              </div>

              {/* Request CTA */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative p-8 md:p-10 rounded-2xl bg-white/[0.025] border border-white/[0.06] backdrop-blur-sm overflow-hidden"
              >
                {/* Background glow */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "radial-gradient(400px circle at 30% 40%, rgba(127,255,212,0.06), transparent 60%)",
                  }}
                />

                <div className="relative">
                  <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#7fffd4]/60 mb-4 block">
                    Don't see your tool?
                  </span>

                  <h3 className="text-2xl font-display font-bold text-white mb-3 leading-tight">
                    Request an integration
                  </h3>

                  <p className="text-sm text-white/40 leading-relaxed mb-7">
                    Drop a message in the Discord with what you build with and how it fits
                    the pipeline. The highest-voted tools ship first.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="https://discord.gg/arcanea"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7fffd4] to-[#00bcd4] px-6 py-3 text-sm font-semibold text-[#09090b] transition hover:shadow-[0_0_30px_rgba(127,255,212,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Open Discord
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>

                    <Link
                      href="/community"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/60 transition hover:border-white/[0.18] hover:text-white/80"
                    >
                      View community
                    </Link>
                  </div>
                </div>
              </m.div>
            </div>
          </div>
        </SectionShell>
      </div>
    </LazyMotion>
  );
}
