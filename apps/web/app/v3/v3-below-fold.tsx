/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m, useInView, AnimatePresence } from "framer-motion";
import { MotionProvider } from "@/lib/motion";
import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Minus,
  Chat,
  Globe,
  Books,
  Code,
  Diamond,
  Sparkle,
  ArrowRight,
  CheckCircle,
  Compass,
  Wrench,
} from "@/lib/phosphor-icons";
import type { PhosphorIcon as IconComponent } from "@/lib/phosphor-icons";
import { CTASection } from "@/components/landing/cta-section";
import { GuardianShowcase } from "@/components/landing/guardian-showcase";
import { WorldsShowcase } from "@/components/landing/worlds-showcase";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { NumberTicker } from "@/components/motion/number-ticker";
import { FACTS } from "@/lib/facts";
import { Marquee } from "@/components/motion/marquee";
import { SectionShell, SectionHeader } from "@/components/premium/section-shell";
import { ComparisonMatrix } from "@/components/premium/comparison-matrix";
import { SovereigntyPillars } from "@/components/premium/sovereignty-pillars";
import { LuminorTeamPreview } from "@/components/premium/luminor-team-preview";
import { PUBLIC_REPOS, PUBLIC_REPO_SUMMARY } from "@/lib/public-repo-registry";
import { luminorAccents, tierAccents, streamAccents, pillarAccents, brand } from "@arcanea/design-system";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const FAQ_ITEMS = [
  {
    q: "What is a Luminor?",
    a: "A specialized AI agent runtime built to construct worlds, write code, compose music, and design structures. Arcanea currently ships 13 configured Luminor specialists that coordinate through shared context and creator-owned project memory.",
  },
  {
    q: "What makes the Living Worlds engine different?",
    a: "Stateless chats forget who you are after a few thousand words. Arcanea compiles your entire universe into a persistent relational graph (backed by local SQLite databases and strict schemas). Characters remember their history, magic laws remain rigid, and lore never drifts. You own the SQLite file; fork it, query it, or deploy it locally.",
  },
  {
    q: "How do the Luminors work?",
    a: "Each agent is equipped with domain-specific toolkits and system prompts grounded in Arcanea's 190K+ word codebase and philosophy. Runtimes hand off context using structured schemas, passing a cinematic scene from a storyteller to a composer or visual builder without forcing the creator to restart from a blank chat.",
  },
  {
    q: "What is the Library of Arcanea?",
    a: "190K+ words of original creative theory, laws, meditations, and dialogues across 17 collections. This serves as the grounding database for all agent personas, providing a consistent structural and thematic foundation across the platform.",
  },
  {
    q: "What is the Ten Gates system?",
    a: "Our leveling system for creators and builders. You start as an Apprentice at Gate 1 and rank up to a Master world-builder at Gate 10. You unlock developer permissions, advanced model routing, and specialized agents by shipping code, writing canon, and completing creation quests.",
  },
  {
    q: "How does BYOK work?",
    a: "Bring Your Own Keys. Standard platforms lock you into subscription markups. Arcanea runs entirely on API keys stored locally in your browser. You pay Anthropic, Google, and OpenAI directly at cost. Zero markup. Zero middleman. Complete sovereign control over your compute costs.",
  },
  {
    q: "Do you train on my data or log my inputs?",
    a: "Never. Your keys, your database, your IP. Because all API calls route directly from your local browser context to the model provider, we have no servers to log your inputs or steal your lore. We don't train models on your dreams.",
  },
  {
    q: "Can I sell what I create?",
    a: "Absolutely. You build it, you own it. We claim 0% of your IP or royalties. Publish templates, distribute worlds, or sell premium agent kits directly to the community via built-in Gumroad, Whop, and Stripe integrations.",
  },
  {
    q: "What integrations does Arcanea support?",
    a: "Arcanea hooks directly into your workflow: from local CLI tools, Vercel, and Claude Code to Git, SQLite, and ElevenLabs. Check our /integrations grid to see the exact state (production, beta, roadmap) of every bridge we support.",
  },
  {
    q: "How do I publish my work?",
    a: "One-click deployment. Arcanea compiles your world state into markdown for docs, threads for X, script layouts for voice generation, or raw JSON for game engines. Distribute your content automatically using open webhooks and local APIs.",
  },
];

// ---------------------------------------------------------------------------
// Product Pillars Feature Grid
// ---------------------------------------------------------------------------

interface ProductPillar {
  Icon: IconComponent;
  title: string;
  description: string;
  href: string;
  glowColor: string;
  status: SurfaceStatus;
}

type SurfaceStatus = "Live" | "Preview" | "Roadmap" | "Guide";

const STATUS_COLORS: Record<SurfaceStatus, string> = {
  Live: brand.aquamarine,
  Preview: brand.atlanteanTeal,
  Roadmap: "var(--arc-void)",
  Guide: "var(--arc-brand-cosmic-blue)",
};

function SurfaceStatusPill({ status }: { status: SurfaceStatus }) {
  const color = STATUS_COLORS[status];
  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-body leading-none"
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 28%, transparent)`,
        background: `color-mix(in srgb, ${color} 8%, transparent)`,
      }}
    >
      {status}
    </span>
  );
}

const CREATOR_FLOW_STEPS: Array<{
  Icon: IconComponent;
  status: SurfaceStatus;
  title: string;
  body: string;
  href: string;
  cta: string;
  accent: string;
}> = [
  {
    Icon: Chat,
    status: "Live",
    title: "Brief the universe",
    body: "Start with a scene, mechanic, faction, or unfinished idea. Chat is the fastest live path into Arcanea today.",
    href: "/chat",
    cta: "Start in chat",
    accent: brand.aquamarine,
  },
  {
    Icon: Globe,
    status: "Live",
    title: "Compile the first world graph",
    body: "Generate a named world with characters, locations, founding events, palette, and structured state.",
    href: "/worlds/create",
    cta: "Create a world",
    accent: brand.atlanteanTeal,
  },
  {
    Icon: Compass,
    status: "Guide",
    title: "Review canon and progression",
    body: "Use Living Lore and Academy as guided references while the active product loop matures.",
    href: "/living-lore",
    cta: "Open the canon",
    accent: "var(--arc-brand-cosmic-blue)",
  },
  {
    Icon: Wrench,
    status: "Preview",
    title: "Hand off to agent tools",
    body: "MCP, install docs, image/audio studios, canvas, cinema, and music are preview paths for builders.",
    href: "/mcp",
    cta: "Open MCP preview",
    accent: "var(--arc-void)",
  },
];

const FLOW_LANES: Array<{
  title: string;
  body: string;
  status: SurfaceStatus;
  links: Array<{ label: string; href: string }>;
}> = [
  {
    title: "Start creating now",
    body: "Chat, world creation, and the shared gallery are live. Start here and make something real in minutes.",
    status: "Live",
    links: [
      { label: "Chat", href: "/chat" },
      { label: "Create World", href: "/worlds/create" },
      { label: "World Gallery", href: "/worlds" },
    ],
  },
  {
    title: "For builders, in preview",
    body: "MCP, install, and the studios are hands-on previews — powerful today, tightened weekly. Expect sharp edges.",
    status: "Preview",
    links: [
      { label: "MCP", href: "/mcp" },
      { label: "Install", href: "/install" },
      { label: "Image Studio", href: "/studio/image" },
    ],
  },
  {
    title: "On the roadmap",
    body: "Storefronts, royalties, memberships, and gated drops open once the creation loop is proven. Join the waitlist to hear the moment they are real.",
    status: "Roadmap",
    links: [
      { label: "Creator Economy", href: "/creator-economy" },
      { label: "Pricing", href: "/pricing" },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
];

function CreatorFlowBoard() {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.075] bg-[linear-gradient(135deg,rgba(255,255,255,0.045),rgba(255,255,255,0.016))] shadow-[0_24px_120px_color-mix(in_srgb,var(--arc-cosmic-void)_76%,transparent)] backdrop-blur-xl">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(760px circle at 18% 0%, color-mix(in srgb, var(--arc-brand-atlantean-teal) 13%, transparent), transparent 58%), radial-gradient(580px circle at 88% 18%, color-mix(in srgb, var(--arc-void) 10%, transparent), transparent 54%)",
        }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="p-5 sm:p-7 md:p-9 lg:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-editorial text-xl italic leading-none" style={{ color: brand.aquamarine }}>
                Today&apos;s creator path
              </p>
              <h3 className="mt-3 max-w-xl text-2xl font-display font-semibold leading-tight tracking-tight text-white md:text-4xl">
                From loose prompt to portable world memory.
              </h3>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--arc-brand-atlantean-teal)]/18 bg-[var(--arc-brand-atlantean-teal)]/[0.07] px-3 py-1.5 text-sm text-white/58">
              <CheckCircle size={15} weight="duotone" color={brand.aquamarine} />
              Live path first
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {CREATOR_FLOW_STEPS.map((step, i) => {
              const Icon = step.Icon;
              return (
                <m.div
                  key={step.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={step.href}
                    className="group flex min-h-[116px] items-start gap-4 rounded-2xl border border-white/[0.06] bg-black/[0.16] p-4 transition-colors hover:border-white/[0.16] hover:bg-white/[0.035] sm:items-center sm:p-5"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border"
                      style={{
                        color: step.accent,
                        borderColor: `color-mix(in srgb, ${step.accent} 28%, transparent)`,
                        background: `color-mix(in srgb, ${step.accent} 9%, transparent)`,
                        boxShadow: `0 0 28px color-mix(in srgb, ${step.accent} 10%, transparent)`,
                      }}
                    >
                      <Icon size={20} weight="duotone" color={step.accent} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-display font-semibold text-white/90">
                          {step.title}
                        </h4>
                        <SurfaceStatusPill status={step.status} />
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/45">
                        {step.body}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-[var(--arc-brand-atlantean-teal)]/82">
                        {step.cta}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </m.div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-white/[0.07] bg-black/[0.18] p-5 sm:p-7 md:p-9 lg:border-l lg:border-t-0 lg:p-10">
          <p className="font-editorial text-xl italic leading-none text-white/50">
            Every door tells you what is behind it
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/42">
            Live means you can create with it right now. Preview means builders can get hands-on while we tighten it. Roadmap means it ships when it is real — no mystery doors.
          </p>

          <div className="mt-8 space-y-4">
            {FLOW_LANES.map((lane, i) => (
              <m.div
                key={lane.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: 0.16 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.022] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-display font-semibold text-white/82">
                    {lane.title}
                  </h4>
                  <SurfaceStatusPill status={lane.status} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/40">
                  {lane.body}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {lane.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-xs text-white/48 transition-colors hover:border-[var(--arc-brand-atlantean-teal)]/25 hover:text-white/75"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LivingWorldSection() {
  return (
    <SectionShell ambient="teal" size="default" id="living-world">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          label="The Living Worlds Engine"
          title="Compile a world that remembers."
          subtitle={<>A persistent graph for canon, locations, rules, and agent handoffs. Stop scattering your work across stateless chats. Build inside a <span className="font-editorial italic font-normal text-lg md:text-xl" style={{ color: brand.aquamarine }}>stateful universe</span> where every path is live today or clearly marked preview.</>}
          accent="teal"
        />
        <CreatorFlowBoard />
      </div>
    </SectionShell>
  );
}

function WhyArcaneaSection() {
  return (
    <SectionShell ambient="purple" size="default" id="why-arcanea">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          label="Why Arcanea"
          title="When chat forgets, worlds drift"
          subtitle={<>Standard AI chat tools are useful, but they are not built as a long-term canon engine. Arcanea compiles a persistent, <span className="font-editorial italic text-[var(--arc-brand-arcanean-gold)] font-normal text-lg md:text-xl">relational database</span> of your world graph so characters, places, rules, and release tasks can stay connected.</>}
          accent="purple"
        />
        <Reveal y={20}>
          <ComparisonMatrix />
        </Reveal>
        <Reveal y={10} delay={0.3}>
          <p className="mt-8 text-center text-sm text-white/32">
            Not a knock on alternatives — a clear statement of what Arcanea is built for.
          </p>
        </Reveal>
      </div>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Luminor Team Preview — The 13 Chosen made visible
// ---------------------------------------------------------------------------

function LuminorTeamSection() {
  return (
    <SectionShell ambient="teal" size="compact" id="luminor-team">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          label="Luminor Specialists"
          title="13 specialized AI agents"
          subtitle={<>Start with one specialist or route work across the council. From Systems Architects to Composers, Storytellers, and Motion Designers, each agent carries its own <span className="font-editorial italic text-[var(--arc-brand-arcanean-gold)] font-normal text-lg md:text-xl">project context, toolset</span>, and distinct creative voice.</>}
          accent="teal"
        />
        <Reveal y={16}>
          <LuminorTeamPreview />
        </Reveal>
        <Reveal y={10} delay={0.4}>
          <div className="mt-10 text-center">
            <Magnetic>
              <Link
                href="/luminors"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
              >
                Meet the agent team
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Personas — "Who Arcanea is for"
// ---------------------------------------------------------------------------

function SovereigntySection() {
  return (
    <SectionShell ambient="gold" size="default" id="sovereignty">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          label="Sovereign Posture"
          title="Absolute creator sovereignty"
          subtitle={<>Keep your keys. Keep your IP. Run your graphs locally via SQLite. Arcanea is built on local-first localStorage keys and MIT-licensed clients. <span className="font-editorial italic text-[var(--arc-brand-arcanean-gold)] font-normal text-lg md:text-xl">Zero vendor lock-in</span>. Zero training on your creations.</>}
          accent="gold"
        />
        <SovereigntyPillars />
        <Reveal y={12} delay={0.5}>
          <div className="mt-12 text-center">
            <Magnetic>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)]/15 to-[var(--arc-brand-arcanean-gold)]/10 border border-[var(--arc-brand-atlantean-teal)]/25 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] hover:from-[var(--arc-brand-atlantean-teal)]/25 hover:to-[var(--arc-brand-arcanean-gold)]/15 transition-colors"
              >
                Read the sovereignty promise
                <span className="text-xs">&rarr;</span>
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Voice & Presence — talk to the Luminors. Lumina orb + 7 personas.
// Surfaces the major Apr 2026 ship: shipped voice room, BYOK, audio-reactive orb.
// ---------------------------------------------------------------------------

interface PersonaTile {
  id: string;
  name: string;
  tagline: string;
  accent: string;
}

function AtmosphericDivider({
  variant = "teal",
}: {
  variant?: "teal" | "purple" | "gold";
}) {
  const colors = {
    teal: "rgba(0,188,212,0.06)",
    purple: "rgba(13,71,161,0.06)",
    gold: "rgba(255,215,0,0.04)",
  };
  return (
    <div className="relative h-px">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${colors[variant]}, transparent 70%)`,
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

function FAQItem({
  item,
  index,
}: {
  item: (typeof FAQ_ITEMS)[0];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const measureRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setContentHeight(node.scrollHeight);
    }
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full text-left py-6 flex items-start justify-between gap-4 border-b border-white/[0.06] group cursor-pointer min-h-[56px]"
      >
        <span className="text-base font-medium text-white/80 group-hover:text-white transition-colors leading-snug">
          {item.q}
        </span>
        <span className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full border border-white/[0.10] flex items-center justify-center group-hover:border-white/[0.20] transition-colors">
          {open ? (
            <Minus className="w-3.5 h-3.5 text-white/40" />
          ) : (
            <Plus className="w-3.5 h-3.5 text-white/40" />
          )}
        </span>
      </button>
      <m.div
        ref={measureRef}
        initial={false}
        animate={{
          height: open ? contentHeight : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="py-5 text-sm text-white/45 leading-relaxed max-w-2xl font-body">
          {item.a}
        </p>
      </m.div>
    </m.div>
  );
}

function FAQInline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <m.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 font-editorial text-lg italic leading-none text-white/35">
            Questions
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            Frequently asked
          </h2>
        </m.div>

        <div>
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={item.q} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Exported below-fold composition
// ---------------------------------------------------------------------------

export interface V3BelowFoldProps {
  collectionsCount: number;
  textsCount: number;
  totalWords: number;
}

export function V3BelowFold({
  collectionsCount,
  textsCount,
  totalWords,
}: V3BelowFoldProps) {
  return (
    <MotionProvider>
      <>
        {/* 1. Living World Engine — the differentiator, with honest doors */}
        <LivingWorldSection />

        <AtmosphericDivider variant="teal" />

        {/* 2. Luminor team — the specialists behind every brief */}
        <LuminorTeamSection />

        <AtmosphericDivider variant="gold" />

        {/* 3. Guardians — canon made visible */}
        <GuardianShowcase />

        <AtmosphericDivider variant="teal" />

        {/* 4. Why Arcanea — the moat */}
        <WhyArcaneaSection />

        {/* 5. Explore living worlds */}
        <WorldsShowcase />

        <AtmosphericDivider variant="teal" />

        {/* 6. Sovereignty — your keys, your IP, your exports */}
        <SovereigntySection />

        <AtmosphericDivider variant="teal" />

        {/* 7. FAQ — objection handling */}
        <FAQInline />

        {/* 4b. Built in the open — ecosystem narrative */}
        <SectionShell ambient="teal" size="default">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Reveal y={12} blur>
              <p className="mb-5 font-editorial text-lg italic leading-none text-[var(--arc-brand-atlantean-teal)]/70">
                Open source, sovereign, forkable
              </p>
            </Reveal>

            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight leading-[1.1]">
              <SplitText as="span" text="Built in the open." className="text-white" delay={0.1} stagger={0.035} />
            </h2>

            <Reveal y={12} delay={0.4}>
              <p className="text-lg text-white/45 max-w-2xl mx-auto mb-12 leading-relaxed">
                We track {PUBLIC_REPO_SUMMARY.active} active repositories, with {PUBLIC_REPO_SUMMARY.public} public on GitHub under the MIT license. Pull the code, run components locally, interface via open APIs, and retain absolute data sovereignty.
              </p>
            </Reveal>

            <Reveal y={16} delay={0.6}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto mb-12">
                {[
                  { value: PUBLIC_REPO_SUMMARY.public, suffix: "", label: "public repos", fixed: false },
                  { value: PUBLIC_REPO_SUMMARY.packages, suffix: "", label: "npm packages", fixed: false },
                  { value: FACTS.skills, suffix: "", label: "creator skills", fixed: false },
                  { value: 0, suffix: "", label: "license", fixed: true },
                ].map(({ value, suffix, label, fixed }, i) => (
                  <div key={label} className="text-center px-3 py-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-b from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] bg-clip-text text-transparent">
                      {fixed ? "MIT" : <NumberTicker value={value} delay={0.6 + i * 0.1} suffix={suffix} />}
                    </p>
                    <p className="mt-1 text-xs font-body text-white/35">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Featured GitHub Repositories Grid */}
            <Reveal y={16} delay={0.75}>
              <div className="text-left mt-12 mb-16 max-w-4xl mx-auto">
                <p className="mb-6 text-center font-editorial text-lg italic leading-none text-white/30">
                  Featured open-source repositories
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {PUBLIC_REPOS.filter((r) =>
                    [
                      "arcanea",
                      "starlight-intelligence-system",
                      "arcanea-orchestrator",
                      "arcanea-vault",
                      "arcanea-flow",
                      "arcanea-mobile",
                    ].includes(r.name),
                  ).map((repo, idx) => (
                    <div
                      key={repo.name}
                      className="group relative p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.14] hover:bg-white/[0.035] transition-all duration-300 backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="font-mono text-xs font-semibold text-white/85 group-hover:text-[var(--arc-brand-atlantean-teal)] transition-colors truncate">
                          {repo.name}
                        </span>
                        <svg
                          className="w-3.5 h-3.5 text-white/20 shrink-0 group-hover:text-white/40 transition-colors"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed mb-4 min-h-[32px] line-clamp-2 font-body">
                        {repo.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10px] text-white/25">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--arc-brand-atlantean-teal)]/60" />
                          {repo.language}
                        </span>
                        <a
                          href={repo.url || `https://github.com/${repo.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-semibold text-[var(--arc-brand-atlantean-teal)] hover:underline"
                        >
                          view source &rarr;
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal y={12} delay={1.0}>
              <div className="mt-4 mb-10">
                <p className="mb-4 text-center font-editorial text-lg italic leading-none text-white/30">
                  The stack that makes it possible
                </p>
                <Marquee duration={40}>
                  {([
                    { name: "Next.js 16", tier: "framework" },
                    { name: "React 19", tier: "framework" },
                    { name: "TypeScript", tier: "language" },
                    { name: "Tailwind", tier: "framework" },
                    { name: "Framer Motion", tier: "motion" },
                    { name: "Three.js", tier: "motion" },
                    { name: "Supabase", tier: "infra" },
                    { name: "Vercel", tier: "infra" },
                    { name: "Claude", tier: "ai" },
                    { name: "Gemini", tier: "ai" },
                    { name: "OpenRouter", tier: "ai" },
                    { name: "MCP", tier: "ai" },
                  ] as const).map((t) => {
                    const tierColor = tierAccents[t.tier];
                    return (
                      <span
                        key={t.name}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-body text-white/55 whitespace-nowrap hover:bg-white/[0.06] hover:text-white/80 transition-colors duration-300"
                        style={{ ["--tier-color" as string]: tierColor }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: tierColor,
                            boxShadow: `0 0 6px ${tierColor}80`,
                          }}
                          aria-hidden="true"
                        />
                        {t.name}
                      </span>
                    );
                  })}
                </Marquee>
              </div>
            </Reveal>

            <Reveal y={8} delay={0.8}>
              <div className="flex flex-wrap justify-center gap-3">
                <Magnetic>
                  <Link
                    href="/ecosystem"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/25 text-sm font-medium text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/20 transition-colors"
                  >
                    Explore the ecosystem
                  </Link>
                </Magnetic>
                <Magnetic>
                  <a
                    href="https://github.com/frankxai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/70 hover:bg-white/[0.08] transition-colors"
                  >
                    View on GitHub
                  </a>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </SectionShell>

        <AtmosphericDivider variant="purple" />

        {/* 5. Final CTA */}
        <CTASection />
      </>
    </MotionProvider>
  );
}
