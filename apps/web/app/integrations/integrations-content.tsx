/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
import { INTEGRATIONS } from "@/components/premium/integration-grid";

const LIVE_INTEGRATIONS = INTEGRATIONS.filter((integration) => integration.status === "live").length;
const BETA_INTEGRATIONS = INTEGRATIONS.filter((integration) => integration.status === "beta").length;
const PLANNED_INTEGRATIONS = INTEGRATIONS.filter((integration) => integration.status === "soon").length;

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const STATS = [
  { value: String(LIVE_INTEGRATIONS), label: "Live", color: "var(--arc-brand-atlantean-teal)" },
  { value: String(BETA_INTEGRATIONS), label: "Beta", color: "var(--arc-brand-arcanean-gold)" },
  { value: String(PLANNED_INTEGRATIONS), label: "Planned", color: "var(--arc-void)" },
  { value: "8", label: "Categories", color: "var(--arc-brand-atlantean-teal)" },
  { value: "MIT", label: "Licensed", color: "var(--arc-brand-arcanean-gold)" },
];

const FLOW_STEPS: FlowStep[] = [
  {
    number: "01",
    title: "Connect",
    body: "Use the live stack today: GitHub public repos, Supabase, Vercel, Vercel AI SDK, Claude, Gemini, and Nano Banana 2. OAuth and sync integrations stay labeled beta or planned until they ship.",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    number: "02",
    title: "Create",
    body: "Build in Arcanea: write, chat, and generate images where the app is wired. Music, avatar, distribution, and game-engine sync are roadmap or beta surfaces.",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    number: "03",
    title: "Own",
    body: "Keep your keys and IP. Exportable formats and public repos are the shipped sovereignty layer; one-click publishing remains planned.",
    accent: "var(--arc-brand-arcanean-gold)",
  },
];

interface FeaturedCard {
  title: string;
  category: string;
  tools: string[];
  description: string;
  accent: string;
}

const FEATURED_CARDS: FeaturedCard[] = [
  {
    title: "Claude Code + Cursor + VS Code",
    category: "Development",
    tools: ["Claude Code", "Cursor", "VS Code", "Windsurf"],
    description:
      "Claude Code is the strongest live path. Cursor, VS Code, and Windsurf are beta MCP/rules surfaces until extension-level sync lands.",
    accent: "var(--arc-brand-atlantean-teal)",
  },
  {
    title: "Suno + Nano Banana 2",
    category: "Creative AI",
    tools: ["Suno", "Nano Banana 2", "ElevenLabs", "Hedra"],
    description:
      "Nano Banana 2 is live for image generation. Suno is represented by the arcanea-records repo; app-level music sync is still beta.",
    accent: "var(--arc-void)",
  },
  {
    title: "Blotato + n8n + Postiz",
    category: "Distribution",
    tools: ["Blotato", "n8n", "Postiz", "Zapier"],
    description:
      "Distribution tools are tracked, not shipped. Blotato, n8n, Postiz, and Zapier stay planned until account sync and posting flows are live.",
    accent: "var(--arc-brand-arcanean-gold)",
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
    description: "Claude Code is live; other IDE surfaces are beta or planned.",
  },
  {
    label: "Creative AI",
    filter: "ai" as const,
    ambient: "purple" as const,
    description: "Image and chat paths are live; music, voice, and video are labeled by shipped state.",
  },
  {
    label: "Distribution",
    filter: "social" as const,
    ambient: "gold" as const,
    description: "Tracked distribution targets; not one-click publishing yet.",
  },
  {
    label: "Communities",
    filter: "community" as const,
    ambient: "teal" as const,
    description: "Community destinations with beta/manual status where bot sync is not shipped.",
  },
  {
    label: "Game Engines",
    filter: "game" as const,
    ambient: "fire" as const,
    description: "Exporter targets on the roadmap; no game-engine bridge is marked live.",
  },
  {
    label: "Blockchain",
    filter: "chain" as const,
    ambient: "purple" as const,
    description: "On-chain targets remain planned until contracts and flows are public.",
  },
  {
    label: "Platforms & Infra",
    filter: "infra" as const,
    ambient: "teal" as const,
    description: "Vercel and Supabase are live. Others are labeled beta or planned.",
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
        {/* Monogram + category */}
        <div className="flex items-center gap-3 mb-5">
          <span
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{
              background: `${card.accent}12`,
              border: `1px solid ${card.accent}25`,
              color: card.accent,
            }}
          >
            {card.title.slice(0, 2)}
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
      <div className="relative min-h-screen bg-[var(--arc-cosmic-void)] text-white">
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
                <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] bg-clip-text text-transparent">
                  The full creator stack
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-base md:text-lg text-white/40 leading-relaxed font-body mb-14">
                Live integrations are marked live. Partial work is beta. Planned sync stays planned.
                The grid is a status map, not a promise that every tool is wired today.
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
              subtitle="Arcanea sits in the middle. Live, beta, and planned labels show what is actually wired."
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
              subtitle="Three integration clusters with their shipped state called out directly."
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
                  <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[var(--arc-brand-atlantean-teal)]/60 mb-4 block">
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
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] px-6 py-3 text-sm font-semibold text-[var(--arc-cosmic-void)] transition hover:shadow-[0_0_30px_rgba(127,255,212,0.2)] hover:scale-[1.02] active:scale-[0.98]"
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
