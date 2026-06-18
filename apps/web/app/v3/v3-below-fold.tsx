/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m, useInView, AnimatePresence } from "framer-motion";
import { MotionProvider } from "@/lib/motion";
import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Minus,
  Chat,
  Globe,
  Books,
  GraduationCap,
  MagicWand,
  Code,
  Diamond,
  Crown,
  Sparkle,
  Coins,
  Lightning,
  ArrowsClockwise,
  Microphone,
  Brain,
  Waveform,
} from "@/lib/phosphor-icons";
import type { PhosphorIcon as IconComponent } from "@/lib/phosphor-icons";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CTASection } from "@/components/landing/cta-section";
import { GuardianShowcase } from "@/components/landing/guardian-showcase";
import { WorldsShowcase } from "@/components/landing/worlds-showcase";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { NumberTicker } from "@/components/motion/number-ticker";
import { Marquee } from "@/components/motion/marquee";
import { FeatureCard, FeatureIcon } from "@/components/premium/feature-card";
import { SectionShell, SectionHeader } from "@/components/premium/section-shell";
import { WorldGraphCanvas } from "@/components/premium/world-graph-canvas";
import { ComparisonMatrix } from "@/components/premium/comparison-matrix";
import { SovereigntyPillars } from "@/components/premium/sovereignty-pillars";
import { PersonasShowcase } from "@/components/premium/personas-showcase";
import { LuminorTeamPreview } from "@/components/premium/luminor-team-preview";
import { IntegrationGrid } from "@/components/premium/integration-grid";
import { PUBLIC_REPOS, PUBLIC_REPO_SUMMARY } from "@/lib/public-repo-registry";
import { luminorAccents, tierAccents, streamAccents, pillarAccents, brand } from "@arcanea/design-system";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const FAQ_ITEMS = [
  {
    q: "What is a Luminor?",
    a: "A Luminor is a specialist AI partner — think \"GPT tuned for one craft.\" We have 16 of them: Story Writer, Character Designer, World Builder, Composer, Debugger, Strategist, and more. Each carries its own voice, memory, and toolset. You pick the Luminor for the job.",
  },
  {
    q: "What makes the Living Worlds engine different?",
    a: "Most AI tools forget. Arcanea builds a persistent graph of your world — characters, locations, magic, lore — all linked. Reference a character next session and the AI still knows them. Export as markdown, fork the world, run it locally. This is the moat.",
  },
  {
    q: "How do the Luminors work?",
    a: "Each Luminor is specialized for a creative domain — writing, research, design, music, strategy. Trained on Arcanea's 190K-word philosophy corpus, not generic datasets. Pick one, describe your project, and build together. Each can hand off to another mid-conversation.",
  },
  {
    q: "What is the Library of Arcanea?",
    a: "190K+ words of original creative philosophy across 17 collections. Laws, meditations, parables, and dialogues — the knowledge foundation that shapes every Luminor in the system.",
  },
  {
    q: "What is the Ten Gates system?",
    a: "A progression framework from Apprentice to Luminor. Each Gate maps to a creative capacity. Progress is earned through creation, not purchases.",
  },
  {
    q: "How does BYOK work?",
    a: "Bring your own API key. Your key lives in your browser's localStorage — we never see it or store it on our servers. Pay OpenAI, Anthropic, or Google directly at cost. No markup, no middleman, no vendor lock-in. You own your usage, billing, and data.",
  },
  {
    q: "Do you train on my data?",
    a: "No. Never. Your creations, conversations, and worlds are yours. Export anytime as markdown, JSON, or your preferred format. The database is yours to run locally too if you want full sovereignty.",
  },
  {
    q: "Is my work private?",
    a: "Yes. We do not train on your data. What you build stays yours — keep it in Arcanea or export it.",
  },
  {
    q: "Can I sell what I create?",
    a: "Yes. Seven revenue streams — template marketplace (keep 90%), Whop memberships (97%), NFT collections (92.5% + smart-contract royalties), commissions, token-gated drops, direct Gumroad/Stripe storefronts, and companion licensing. See /creator-economy.",
  },
  {
    q: "What integrations does Arcanea support?",
    a: "Arcanea tracks 30+ integrations across coding, creative AI, distribution, communities, game engines, infra, and chain. The integrations page labels each one as live, beta, or planned.",
  },
  {
    q: "How do I publish my work?",
    a: "One world → many channels. Arcanea prepares native formats for Discord posts, X threads, Instagram carousels, YouTube narrations, TikTok reels — all from the same source. You publish via your own accounts (tokens stay yours). Distribution flows are built on Blotato/n8n/Postiz.",
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
}

const PRODUCT_PILLARS: ProductPillar[] = [
  {
    Icon: Chat,
    title: "Chat",
    description: "16 specialist AI partners — one for every craft",
    href: "/chat",
    glowColor: pillarAccents.chat,
  },
  {
    Icon: Globe,
    title: "Worlds",
    description: "A graph of characters, locations, magic — all connected",
    href: "/worlds",
    glowColor: pillarAccents.worlds,
  },
  {
    Icon: Books,
    title: "Library",
    description: "190K+ words of original creative philosophy",
    href: "/library",
    glowColor: pillarAccents.library,
  },
  {
    Icon: GraduationCap,
    title: "Academy",
    description: "A structured path from beginner to Luminor",
    href: "/academy",
    glowColor: pillarAccents.academy,
  },
  {
    Icon: MagicWand,
    title: "Forge",
    description: "Forge your own Luminor, companion, or character",
    href: "/forge",
    glowColor: pillarAccents.forge,
  },
  {
    Icon: Code,
    title: "Code",
    description: `${PUBLIC_REPO_SUMMARY.public} public repos. Fork the open pieces.`,
    href: "/ecosystem",
    glowColor: pillarAccents.code,
  },
];

function ProductPillarsGrid() {
  return (
    <SectionShell ambient="teal" size="compact" id="what-arcanea-does">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          label="What Arcanea Does"
          title="Six ways to create"
          subtitle="Modular components for lore synthesis, orchestration, media compilation, and distribution. Zero locked APIs."
          accent="teal"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PRODUCT_PILLARS.map((pillar, i) => {
            const Icon = pillar.Icon;
            return (
              <a key={pillar.title} href={pillar.href} className="block">
                <FeatureCard
                  glowColor={pillar.glowColor}
                  delay={i * 0.08}
                  compact
                >
                  <FeatureIcon color={pillar.glowColor} size="sm">
                    <Icon size={18} weight="duotone" color={pillar.glowColor} />
                  </FeatureIcon>
                  <h3 className="text-base font-display font-semibold text-white/90 mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-white/40 font-body leading-snug">
                    {pillar.description}
                  </p>
                </FeatureCard>
              </a>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Living World Engine — Animated graph visualization
// ---------------------------------------------------------------------------

function LivingWorldSection() {
  return (
    <SectionShell ambient="teal" size="default" id="living-world">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          label="The Living Worlds Engine"
          title="One sentence becomes a universe"
          subtitle="Compile character profiles, spatial mappings, and logical rules into a persistent, relational graph. Query with natural language. Export to markdown."
          accent="teal"
        />
        <Reveal y={20}>
          <WorldGraphCanvas />
        </Reveal>
        <Reveal y={12} delay={0.3}>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Connected", body: "Characters reference the same locations, magic follows consistent rules, lore propagates.", color: brand.aquamarine },
              { label: "Persistent", body: "Your world survives every session. Come back in a year — it still remembers everything.", color: brand.atlanteanTeal },
              { label: "Forkable", body: "Export to markdown/JSON. Fork a world. Run the engine locally. Nothing locked.", color: brand.arcaneanGold },
            ].map(({ label, body, color }, i) => (
              <m.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]"
              >
                <p className="text-[10px] font-mono tracking-[0.25em] uppercase mb-2" style={{ color }}>
                  {label}
                </p>
                <p className="text-sm text-white/50 leading-relaxed">{body}</p>
              </m.div>
            ))}
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Why Arcanea — Comparison matrix
// ---------------------------------------------------------------------------

function WhyArcaneaSection() {
  return (
    <SectionShell ambient="purple" size="default" id="why-arcanea">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          label="Why Arcanea"
          title="The moat is the world graph"
          subtitle="Standard chatbots operate on stateless contexts. Arcanea persists connections between entities—characters, events, parameters—across all sessions."
          accent="purple"
        />
        <Reveal y={20}>
          <ComparisonMatrix />
        </Reveal>
        <Reveal y={10} delay={0.3}>
          <p className="mt-8 text-center text-xs text-white/25 font-mono tracking-wider">
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
          title="13 dedicated craft runtimes"
          subtitle="Each specialist implements a scoped role—system architecture, narrative prose, spatial design, sound composition—with distinct system instructions, memory stores, and local toolkits."
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
                Meet all 16 Luminors
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
// Personas — "Who Arcanea is for"
// ---------------------------------------------------------------------------

function PersonasSection() {
  return (
    <SectionShell ambient="purple" size="default" id="who-its-for">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          label="Who it's for"
          title="Built for makers"
          subtitle="Novelists, game designers, filmmakers, developers, solo creators — Arcanea meets you where you work."
          accent="purple"
        />
        <PersonasShowcase />
      </div>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------------
// Sovereignty — Keep your keys, keep your IP
// ---------------------------------------------------------------------------

function SovereigntySection() {
  return (
    <SectionShell ambient="gold" size="default" id="sovereignty">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          label="Sovereign Posture"
          title="Data ownership by design"
          subtitle="Local-first localStorage keys, exportable schema graphs, and MIT-licensed client adapters. Your IP stays yours; no centralized model training on creator data."
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

const VOICE_PERSONAS: PersonaTile[] = [
  { id: "lumina", name: "Lumina", tagline: "First Light · orchestrator", accent: luminorAccents.lumina },
  { id: "jarvis", name: "Jarvis", tagline: "Just A Rather Very Intelligent System", accent: luminorAccents.jarvis },
  { id: "draconia", name: "Draconia", tagline: "Fire Gate · forge & willpower", accent: luminorAccents.draconia },
  { id: "lyria", name: "Lyria", tagline: "Sight Gate · pattern + vision", accent: luminorAccents.lyria },
  { id: "alera", name: "Alera", tagline: "Voice Gate · clarity + concision", accent: luminorAccents.alera },
  { id: "shinkami", name: "Shinkami", tagline: "Source Gate · meta-awareness", accent: luminorAccents.shinkami },
  { id: "nero", name: "Nero", tagline: "Shadow Gate · contrarian edge", accent: luminorAccents.nero },
];

function PersonaOrb({ accent }: { accent: string }) {
  return (
    <div className="relative w-12 h-12 shrink-0">
      <div
        className="absolute inset-0 rounded-full blur-[10px] opacity-70 animate-[breathe_3s_ease-in-out_infinite]"
        style={{ background: `radial-gradient(circle, ${accent}55, transparent 70%)` }}
      />
      <div
        className="absolute inset-[6px] rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${accent}cc, ${accent}22 60%, transparent 80%)`,
          boxShadow: `inset 0 0 12px ${accent}66, 0 0 18px ${accent}44`,
        }}
      />
      <div
        className="absolute inset-[14px] rounded-full bg-white/90 mix-blend-overlay"
        style={{ filter: "blur(2px)" }}
      />
    </div>
  );
}

function VoicePresenceSection() {
  return (
    <SectionShell ambient="purple" size="default" id="voice-presence">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          label="Voice & Telemetry"
          title="Real-time voice stream"
          subtitle="Low-latency speech pipelines using Whisper STT and ElevenLabs TTS. Features WebGL audio-reactive particle shell, custom browser key bindings, and native CLI support."
          accent="purple"
        />
        <Reveal y={20}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VOICE_PERSONAS.map((p, i) => (
              <m.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                className="group relative"
              >
                <Link
                  href={`/room/${p.id}`}
                  className="block h-full p-5 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.16] backdrop-blur-sm transition-colors duration-300"
                  style={{ ["--persona-accent" as string]: p.accent }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(380px circle at 50% 0%, ${p.accent}14, transparent 60%)` }}
                  />
                  <div className="relative flex items-start gap-4">
                    <PersonaOrb accent={p.accent} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-base font-display font-semibold text-white/90 leading-tight">
                          {p.name}
                        </h3>
                        <span
                          className="text-[9px] font-mono tracking-[0.2em] uppercase"
                          style={{ color: `${p.accent}99` }}
                        >
                          live
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/45 font-body leading-snug">
                        {p.tagline}
                      </p>
                    </div>
                  </div>
                </Link>
              </m.div>
            ))}
          </div>
        </Reveal>
        <Reveal y={12} delay={0.4}>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Audio-reactive orb", body: "Custom GLSL · 4096-particle shell · subsurface glow · sticky-mounted WebGL.", color: brand.aquamarine, Icon: Waveform },
              { label: "BYOK presence room", body: "Groq Whisper STT · ElevenLabs TTS · keys live in your browser, never our servers.", color: brand.atlanteanTeal, Icon: Microphone },
              { label: "Local agent CLI", body: "voice jarvis · voice lumina · multi-round tool chaining · open URL · launch Claude Code.", color: brand.arcaneanGold, Icon: Brain },
            ].map(({ label, body, color, Icon }, i) => (
              <m.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} weight="duotone" color={color} />
                  <p className="text-[10px] font-mono tracking-[0.25em] uppercase" style={{ color }}>
                    {label}
                  </p>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">{body}</p>
              </m.div>
            ))}
          </div>
        </Reveal>
        <Reveal y={10} delay={0.6}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Magnetic>
              <Link
                href="/voice"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--arc-void)]/15 to-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-void)]/25 text-sm font-medium text-[var(--arc-void)] hover:from-[var(--arc-void)]/25 hover:to-[var(--arc-brand-atlantean-teal)]/15 transition-colors"
              >
                Open the voice dashboard
                <span className="text-xs">&rarr;</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/room/jarvis"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
              >
                Talk to Jarvis
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
// Stack Teaser — "Connects to every tool you use"
// ---------------------------------------------------------------------------

function StackTeaserSection() {
  return (
    <SectionShell ambient="teal" size="compact" id="stack-teaser">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          label="The Creator Stack"
          title="Built to connect everywhere"
          subtitle="Claude Code, Nano Banana 2, Supabase, Vercel AI SDK, and GitHub are wired today. Other tiles are marked beta or soon when the app sync is partial or planned."
          accent="teal"
        />
        <Reveal y={16}>
          <IntegrationGrid limit={18} />
        </Reveal>
        <Reveal y={10} delay={0.4}>
          <div className="mt-10 text-center">
            <Magnetic>
              <Link
                href="/integrations"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
              >
                See integration status
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
// Earn Teaser — "Make a living from your worlds"
// ---------------------------------------------------------------------------

function EarnTeaserSection() {
  const STREAMS: Array<{ Icon: IconComponent; label: string; take: string; accent: string }> = [
    { Icon: Diamond, label: "Template Marketplace", take: "90%", accent: streamAccents.marketplace },
    { Icon: Crown, label: "Memberships (Whop)", take: "97%", accent: streamAccents.membership },
    { Icon: Sparkle, label: "NFT Collections", take: "92%", accent: streamAccents.nft },
    { Icon: Coins, label: "Commissions", take: "88%", accent: streamAccents.commission },
    { Icon: Lightning, label: "Token-gated drops", take: "100%", accent: streamAccents.tokenGated },
    { Icon: ArrowsClockwise, label: "Royalties on remixes", take: "perpetual", accent: streamAccents.royalty },
  ];
  return (
    <SectionShell ambient="gold" size="compact" id="earn-teaser">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase border bg-[var(--arc-void)]/10 border-[var(--arc-void)]/25 text-[var(--arc-void)]">
            <span className="w-1 h-1 rounded-full bg-[var(--arc-void)]" />
            ROADMAP · rolling out 2026
          </span>
        </div>
        <SectionHeader
          label="Creator Posture"
          title="Monetize sovereign IP"
          subtitle="Distribute creations via integrated storefronts. Smart-contract royalties on remixes, template sales at 90% creator share, and memberships at 97% share. Shipped states tracked on public roadmap."
          accent="gold"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {STREAMS.map((s, i) => {
            const Icon = s.Icon;
            return (
            <m.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.14] transition-colors"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: `${s.accent}10`,
                  border: `1px solid ${s.accent}25`,
                  color: s.accent,
                }}
              >
                <Icon size={16} weight="duotone" color={s.accent} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display font-semibold text-white/80 truncate">
                  {s.label}
                </p>
                <p
                  className="text-[11px] font-mono tracking-wider"
                  style={{ color: `${s.accent}bb` }}
                >
                  you keep {s.take}
                </p>
              </div>
            </m.div>
            );
          })}
        </div>
        <Reveal y={10} delay={0.4}>
          <div className="mt-10 text-center">
            <Magnetic>
              <Link
                href="/creator-economy"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)]/15 to-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-arcanean-gold)]/25 text-sm font-medium text-[var(--arc-brand-arcanean-gold)] hover:from-[var(--arc-brand-arcanean-gold)]/25 hover:to-[var(--arc-brand-atlantean-teal)]/15 transition-colors"
              >
                Explore creator economy
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
// Atmospheric Divider
// ---------------------------------------------------------------------------

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
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-4">
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
        {/* 0. Living World Engine demo — the differentiator visualized */}
        <LivingWorldSection />

        <AtmosphericDivider variant="teal" />

        {/* 1. Product pillars — "What Arcanea Does" */}
        <ProductPillarsGrid />

        <AtmosphericDivider variant="teal" />

        {/* 1b. Luminor team preview — 13 specialists made visible */}
        <LuminorTeamSection />

        <AtmosphericDivider variant="purple" />

        {/* 1c. Voice & Presence — Apr 2026 ship: shipped voice room + audio-reactive orb */}
        <VoicePresenceSection />

        <AtmosphericDivider variant="purple" />

        {/* 2. Why Arcanea — the moat */}
        <WhyArcaneaSection />

        <AtmosphericDivider variant="teal" />

        {/* 2b. Personas — who it's for */}
        <PersonasSection />

        <AtmosphericDivider variant="purple" />

        {/* 3. Guardian showcase — visual proof */}
        <GuardianShowcase />

        <AtmosphericDivider variant="teal" />

        {/* 4. How it works — 4 clear steps */}
        <HowItWorks />

        {/* 5. Worlds showcase — multiverse teaser */}
        <WorldsShowcase />

        <AtmosphericDivider variant="teal" />

        {/* 5b. Stack Teaser — connects to every tool you use */}
        <StackTeaserSection />

        <AtmosphericDivider variant="gold" />

        {/* 5c. Earn Teaser — creator economy preview */}
        <EarnTeaserSection />

        <AtmosphericDivider variant="gold" />

        {/* 6. Sovereignty pillars — Keep your keys, keep your IP */}
        <SovereigntySection />

        <AtmosphericDivider variant="teal" />

        {/* 7. FAQ — objection handling */}
        <FAQInline />

        {/* 4b. Built in the open — ecosystem narrative */}
        <SectionShell ambient="teal" size="default">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Reveal y={12} blur>
              <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[var(--arc-brand-atlantean-teal)]/60 mb-5">
                Open Source · Sovereign · Forkable
              </p>
            </Reveal>

            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight leading-[1.1]">
              <SplitText as="span" text="Built in the open." className="text-white" delay={0.1} stagger={0.035} />
            </h2>

            <Reveal y={12} delay={0.4}>
              <p className="text-lg text-white/45 max-w-2xl mx-auto mb-12 leading-relaxed">
                {PUBLIC_REPO_SUMMARY.active} active Arcanea repos tracked. {PUBLIC_REPO_SUMMARY.public} public on GitHub today.
                MIT licensed where public. Run the open pieces locally. Keep your keys. Own your data.
              </p>
            </Reveal>

            <Reveal y={16} delay={0.6}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto mb-12">
                {[
                  { value: PUBLIC_REPO_SUMMARY.public, suffix: "", label: "public repos", fixed: false },
                  { value: PUBLIC_REPO_SUMMARY.packages, suffix: "", label: "published refs", fixed: false },
                  { value: 80, suffix: "+", label: "skills", fixed: false },
                  { value: 0, suffix: "", label: "license", fixed: true },
                ].map(({ value, suffix, label, fixed }, i) => (
                  <div key={label} className="text-center px-3 py-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-b from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] bg-clip-text text-transparent">
                      {fixed ? "MIT" : <NumberTicker value={value} delay={0.6 + i * 0.1} suffix={suffix} />}
                    </p>
                    <p className="text-[10px] font-mono tracking-widest uppercase text-white/25 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Featured GitHub Repositories Grid */}
            <Reveal y={16} delay={0.75}>
              <div className="text-left mt-12 mb-16 max-w-4xl mx-auto">
                <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/20 text-center mb-6">
                  Featured Open Source Repositories
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
                          className="text-[10px] font-semibold text-[var(--arc-brand-atlantean-teal)] hover:underline font-mono"
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
                <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/20 text-center mb-4">
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
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-white/55 whitespace-nowrap hover:bg-white/[0.06] hover:text-white/80 transition-colors duration-300"
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
