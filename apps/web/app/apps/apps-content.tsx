"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import {
  FloatingOrbs,
  AppTile,
  FeatureCard,
  StatCard,
  StatusBadge,
  StatusNotice,
} from "@/components/premium";
import {
  APPS,
  CATEGORIES,
  HERO_STATS,
  FEATURED_NAMES,
  type Category,
} from "./apps-data";

// ---------------------------------------------------------------------------
// Category filter pill
// ---------------------------------------------------------------------------

function CategoryPill({
  category,
  active,
  onClick,
}: {
  category: Category;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase border transition-all duration-200 ${
        active
          ? "bg-[#00bcd4]/15 border-[#00bcd4]/40 text-[#7fffd4]"
          : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:border-white/[0.15] hover:text-white/60"
      }`}
    >
      {category}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main content component
// ---------------------------------------------------------------------------

export function AppsContent() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const featuredApps = APPS.filter((a) => FEATURED_NAMES.includes(a.name));

  const filteredApps = APPS.filter((app) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Featured") return Boolean(app.featured);
    return app.filterCategory === activeCategory;
  });

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-[#09090b] text-white">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-28 pb-20">
          <FloatingOrbs preset="aurora" />
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
                "linear-gradient(90deg, transparent 0%, rgba(127,255,212,0.20) 40%, rgba(0,188,212,0.30) 50%, rgba(127,255,212,0.20) 60%, transparent 100%)",
            }}
            aria-hidden
          />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <m.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#7fffd4]/50" />
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#7fffd4]/70">
                Apps
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#7fffd4]/50" />
            </m.div>

            <div className="flex justify-center mb-6">
              <StatusBadge level="preview" note="Install flows Q2-Q3 2026" />
            </div>

            <div className="max-w-2xl mx-auto mb-8">
              <StatusNotice
                level="preview"
                title="Directory today, marketplace soon"
                body="These tiles are an honest map of the creator stack we're integrating. Claude Code, Nano Banana 2, Vercel AI SDK, Supabase are wired today. One-click installs for the rest roll out through 2026. No OAuth flows will claim to work before they do."
                linkHref="/integrations"
                linkLabel="See live integrations"
              />
            </div>

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
                    "linear-gradient(135deg, #7fffd4 0%, #00bcd4 40%, #c084fc 80%)",
                }}
              >
                Install once.
              </span>
              <br />
              <span className="text-white/80">Create forever.</span>
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="text-base md:text-xl text-white/45 max-w-2xl mx-auto leading-relaxed mb-12 font-body"
            >
              One-click connectors to the tools you already use. AI models, game
              engines, social channels, storage — your creative stack, wired
              together.
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

        {/* ── Featured Row ──────────────────────────────────────────────── */}
        <section className="relative pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25 mb-1">
                Featured
              </p>
              <h2 className="text-xl font-display font-semibold text-white/70">
                Most-installed connectors
              </h2>
            </m.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredApps.map((app, i) => (
                <AppTile key={app.name} {...app} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-6 mb-10" aria-hidden>
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 40%, rgba(0,188,212,0.12) 50%, rgba(255,255,255,0.05) 60%, transparent 100%)",
            }}
          />
        </div>

        {/* ── All Apps ──────────────────────────────────────────────────── */}
        <section className="relative pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <m.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-2 mb-10"
            >
              {CATEGORIES.map((cat) => (
                <CategoryPill
                  key={cat}
                  category={cat}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
            </m.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredApps.map((app, i) => (
                <AppTile
                  key={`${app.name}-${activeCategory}`}
                  {...app}
                  index={i}
                />
              ))}
            </div>

            {filteredApps.length === 0 && (
              <div className="text-center py-20 text-white/30 font-body">
                No apps in this category yet.
              </div>
            )}
          </div>
        </section>

        {/* ── Build your own ────────────────────────────────────────────── */}
        <section className="relative pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25 mb-1">
                For developers
              </p>
              <h2 className="text-xl font-display font-semibold text-white/70">
                Build your own connector
              </h2>
            </m.div>

            <FeatureCard glowColor="#7fffd4" delay={0.1}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="flex-1">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 text-xl"
                    style={{
                      background: "#7fffd412",
                      border: "1px solid #7fffd420",
                      color: "#7fffd4",
                    }}
                  >
                    {"</>"}
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-white/90 mb-3">
                    Ship your own connector
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed max-w-lg font-body">
                    Arcanea Apps is an open spec. Any tool can publish a connector
                    to our marketplace. Earn revenue share when creators install —
                    70% to you, 30% to the protocol. MIT licensed, BYOK by design.
                  </p>
                  <ul className="mt-5 flex flex-col gap-2">
                    {[
                      "Open connector spec — implement in any language",
                      "Revenue share when creators install your connector",
                      "Automated review — ships in 24 hours",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-white/40 font-body"
                      >
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#7fffd4]/50 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href="/developers"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7fffd4]/10 border border-[#7fffd4]/20 text-sm font-semibold text-[#7fffd4] hover:bg-[#7fffd4]/15 hover:border-[#7fffd4]/35 transition-all duration-200"
                  >
                    Read developer docs
                    <span className="text-xs">→</span>
                  </Link>
                </div>
              </div>
            </FeatureCard>
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#7fffd4]/[0.07] via-[#00bcd4]/[0.05] to-[#a855f7]/[0.07]" />
              <div className="absolute inset-0 bg-white/[0.02]" />
              <div
                className="absolute top-0 left-12 right-12 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(127,255,212,0.4), transparent)",
                }}
              />
              <div className="relative p-10 md:p-16 text-center">
                <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/25 mb-4">
                  Marketplace
                </p>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 tracking-[-0.02em]">
                  Your entire creative stack,
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #7fffd4, #00bcd4)",
                    }}
                  >
                    in one place.
                  </span>
                </h2>
                <p className="text-base text-white/40 mb-10 max-w-lg mx-auto font-body">
                  Connect your tools, automate your workflow, and create without
                  switching tabs.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/apps"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#7fffd4] to-[#00bcd4] text-sm font-semibold text-[#09090b] hover:shadow-[0_0_40px_rgba(127,255,212,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    Explore all apps
                    <span className="text-xs">→</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-medium text-white/60 hover:border-white/[0.15] hover:text-white/80 transition-all duration-200"
                  >
                    Request an integration
                  </Link>
                </div>
                <p className="mt-8 text-[11px] font-mono text-white/20 tracking-wider">
                  MIT licensed. BYOK. 70/30 revenue share for connector developers.
                </p>
              </div>
            </m.div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
