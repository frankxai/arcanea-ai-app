/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import {
  FloatingOrbs,
  TeamCard,
  StatCard,
  FeatureCard,
} from "@/components/premium";
import {
  Brain,
  Globe,
  Palette,
  Lightning,
  Code,
  Users,
  Sparkle,
} from "@/lib/phosphor-icons";
import {
  HERO_STATS,
  PRINCIPLES,
  STACK_ROWS,
  TEAM_MEMBERS,
} from "./teams-data";
import type { ComponentType } from "react";

// ---------------------------------------------------------------------------
// Teams with inline icons (Phosphor components can't be in a plain .ts file)
// ---------------------------------------------------------------------------

// TeamCardProps expects a narrow icon signature; Phosphor exports a wider one.
// Casting through unknown is the canonical escape hatch for icon library mismatches.
type NarrowIcon = ComponentType<{
  className?: string;
  weight?: string;
  style?: React.CSSProperties;
}>;

interface TeamDef {
  name: string;
  charter: string;
  owns: string[];
  icon: NarrowIcon;
  accent: string;
  stats: { label: string; value: string }[];
  members: { name: string; role: string }[];
  blogHref: string;
  repoHref: string;
}

const TEAMS: TeamDef[] = [
  {
    name: "Luminor Intelligence",
    charter: "Design the 16 specialist AI minds, train them on Arcanea's philosophy, and ship the Luminor Standard.",
    owns: ["Luminor Kernel", "Chosen specs", "Swarm Engine", "ReasoningBank", "Quality Gates"],
    icon: Brain as unknown as NarrowIcon,
    accent: "var(--arc-brand-atlantean-teal)",
    stats: [{ label: "members", value: "5" }, { label: "repos", value: "4" }],
    members: [...TEAM_MEMBERS["Luminor Intelligence"]],
    blogHref: "/blog?tag=luminor",
    repoHref: "https://github.com/frankxai/arcanea",
  },
  {
    name: "World Engine",
    charter: "The living world graph. Characters, locations, magic schemas, persistence, semantic search.",
    owns: ["world-graph schema", "pgvector integration", "world API", "cross-world linking"],
    icon: Globe as unknown as NarrowIcon,
    accent: "var(--arc-brand-atlantean-teal)",
    stats: [{ label: "members", value: "4" }, { label: "repos", value: "3" }],
    members: [...TEAM_MEMBERS["World Engine"]],
    blogHref: "/blog?tag=world-engine",
    repoHref: "https://github.com/frankxai/arcanea",
  },
  {
    name: "Creator Platform",
    charter: "Chat, Imagine, Studio, Worlds UI. The Next.js app, component library, and design system.",
    owns: ["apps/web", "component library", "design system", "onboarding"],
    icon: Palette as unknown as NarrowIcon,
    accent: "var(--arc-void)",
    stats: [{ label: "members", value: "4" }, { label: "repos", value: "5" }],
    members: [...TEAM_MEMBERS["Creator Platform"]],
    blogHref: "/blog?tag=platform",
    repoHref: "https://github.com/frankxai/arcanea",
  },
  {
    name: "Protocol & Chain",
    charter: "Arcanean Protocol spec, smart contracts, on-chain identity, royalties, and IP licensing.",
    owns: ["AIPs", "Agent Registry contracts", "Story Protocol integration", "x402 micropayments"],
    icon: Lightning as unknown as NarrowIcon,
    accent: "var(--arc-brand-arcanean-gold)",
    stats: [{ label: "members", value: "3" }, { label: "repos", value: "2" }],
    members: [...TEAM_MEMBERS["Protocol & Chain"]],
    blogHref: "/blog?tag=protocol",
    repoHref: "https://github.com/frankxai/arcanea-ai-app",
  },
  {
    name: "Infra & Ops",
    charter: "Deploy pipelines, Supabase, Vercel, observability, and performance budgets.",
    owns: ["CI/CD", "Supabase migrations", "Sentry", "performance budgets"],
    icon: Code as unknown as NarrowIcon,
    accent: "var(--arc-brand-cosmic-blue)",
    stats: [{ label: "members", value: "3" }, { label: "repos", value: "3" }],
    members: [...TEAM_MEMBERS["Infra & Ops"]],
    blogHref: "/blog?tag=infra",
    repoHref: "https://github.com/frankxai/arcanea-ai-app",
  },
  {
    name: "Creator Success",
    charter: "Community managers, Discord moderation, contests, creator onboarding, and Whop tiers.",
    owns: ["Discord", "Reddit", "Whop communities", "Creator Dashboard", "template review"],
    icon: Users as unknown as NarrowIcon,
    accent: "var(--arc-fire)",
    stats: [{ label: "members", value: "4" }, { label: "repos", value: "1" }],
    members: [...TEAM_MEMBERS["Creator Success"]],
    blogHref: "/blog?tag=community",
    repoHref: "https://github.com/frankxai/arcanea",
  },
  {
    name: "Author & Lore",
    charter: "The 190K-word library, Guardian lore, canon maintenance, and book production pipeline.",
    owns: ["book/ collections", "CANON_LOCKED.md", "publishing-house CLI", "editorial standards"],
    icon: Sparkle as unknown as NarrowIcon,
    accent: "var(--arc-void)",
    stats: [{ label: "members", value: "4" }, { label: "repos", value: "4" }],
    members: [...TEAM_MEMBERS["Author & Lore"]],
    blogHref: "/blog?tag=lore",
    repoHref: "https://github.com/frankxai/arcanea",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export function TeamsContent() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-[var(--arc-cosmic-void)] text-white">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-28 pb-20">
          <FloatingOrbs preset="cosmic" />
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.022]"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div
            className="pointer-events-none absolute top-0 left-0 right-0 h-px -z-10"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(0,188,212,0.20) 40%, rgba(124,58,237,0.25) 50%, rgba(0,188,212,0.20) 60%, transparent 100%)",
            }}
            aria-hidden
          />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <m.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--arc-void)]/50" />
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[var(--arc-void)]/70">
                Teams · building in the open
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--arc-void)]/50" />
            </m.div>

            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-[-0.03em] leading-[1.04] mb-6"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--arc-void) 0%, var(--arc-void) 35%, var(--arc-brand-atlantean-teal) 70%, var(--arc-brand-atlantean-teal) 100%)",
                }}
              >
                How we build
              </span>
              <br />
              <span className="text-white/80">Arcanea</span>
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="text-base md:text-xl text-white/45 max-w-2xl mx-auto leading-relaxed mb-12 font-body"
            >
              Seven teams. One protocol. Transparent ownership, public blog,
              open-source everything. We work the way Canva works — but with the
              creators as co-authors.
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
            >
              {HERO_STATS.map(({ value, label, color }, i) => (
                <StatCard
                  key={label}
                  value={value}
                  label={label}
                  color={color}
                  delay={0.24 + i * 0.06}
                />
              ))}
            </m.div>
          </div>
        </section>

        {/* ── Teams Grid ────────────────────────────────────────────────── */}
        <section className="relative pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25 mb-1">
                Organization
              </p>
              <h2 className="text-xl font-display font-semibold text-white/70">
                Seven teams, one mission
              </h2>
            </m.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TEAMS.map((team, i) => (
                <TeamCard key={team.name} {...team} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-6 mb-16" aria-hidden>
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 40%, rgba(124,58,237,0.12) 50%, rgba(255,255,255,0.05) 60%, transparent 100%)",
            }}
          />
        </div>

        {/* ── How we work ───────────────────────────────────────────────── */}
        <section className="relative pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25 mb-1">
                Culture
              </p>
              <h2 className="text-xl font-display font-semibold text-white/70">
                How we work
              </h2>
            </m.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRINCIPLES.map(({ title, body, color, glyph }, i) => (
                <FeatureCard key={title} glowColor={color} delay={0.06 + i * 0.08}>
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-base mb-4"
                    style={{
                      background: `${color}12`,
                      border: `1px solid ${color}22`,
                      color,
                    }}
                  >
                    {glyph}
                  </div>
                  <h3
                    className="text-base font-display font-semibold mb-2"
                    style={{ color }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed font-body">
                    {body}
                  </p>
                </FeatureCard>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stack per team ────────────────────────────────────────────── */}
        <section className="relative pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25 mb-1">
                Daily tools
              </p>
              <h2 className="text-xl font-display font-semibold text-white/70">
                Stack per team
              </h2>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            >
              <div className="grid grid-cols-5 gap-0 border-b border-white/[0.06] px-5 py-3">
                {["Team", "IDE", "AI", "Deploy", "Docs"].map((h) => (
                  <p
                    key={h}
                    className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/25"
                  >
                    {h}
                  </p>
                ))}
              </div>
              {STACK_ROWS.map((row, i) => (
                <div
                  key={row.team}
                  className={`grid grid-cols-5 gap-0 px-5 py-3.5 ${
                    i < STACK_ROWS.length - 1 ? "border-b border-white/[0.04]" : ""
                  } hover:bg-white/[0.02] transition-colors duration-200`}
                >
                  <p className="text-xs font-display font-medium text-white/70 truncate pr-2">{row.team}</p>
                  <p className="text-xs font-mono text-white/35 truncate pr-2">{row.ide}</p>
                  <p className="text-xs font-mono text-white/35 truncate pr-2">{row.ai}</p>
                  <p className="text-xs font-mono text-white/35 truncate pr-2">{row.deploy}</p>
                  <p className="text-xs font-mono text-white/35 truncate">{row.docs}</p>
                </div>
              ))}
            </m.div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────── */}
        <section className="relative pb-32">
          <div className="max-w-4xl mx-auto px-6">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--arc-void)]/[0.07] via-[var(--arc-brand-atlantean-teal)]/[0.05] to-[var(--arc-void)]/[0.06]" />
              <div className="absolute inset-0 bg-white/[0.02]" />
              <div
                className="absolute top-0 left-12 right-12 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(192,132,252,0.4), transparent)",
                }}
              />
              <div className="relative p-10 md:p-16 text-center">
                <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25 mb-4">
                  Open team
                </p>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 tracking-[-0.02em]">
                  Build Arcanea with us.
                </h2>
                <p className="text-base text-white/40 mb-10 max-w-lg mx-auto font-body">
                  Every team is open to contributors. Join the Discord, pick a
                  repo, and start shipping.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[var(--arc-void)] to-[var(--arc-void)] text-sm font-semibold text-white hover:shadow-[0_0_40px_rgba(192,132,252,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    Contact about teams
                    <span className="text-xs">→</span>
                  </Link>
                  <a
                    href="https://github.com/frankxai/arcanea"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-medium text-white/60 hover:border-white/[0.15] hover:text-white/80 transition-all duration-200"
                  >
                    Contribute to a repo
                    <span className="text-xs">↗</span>
                  </a>
                </div>
                <p className="mt-8 text-[11px] font-mono text-white/20 tracking-wider">
                  27 repos. MIT license. All issues are public.
                </p>
              </div>
            </m.div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
