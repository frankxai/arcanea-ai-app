/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { FloatingOrbs } from "@/components/premium/animated-background";
import { SovereigntyBadge } from "@/components/premium/sovereignty-pillars";
import { StatusBadge, StatusNotice } from "@/components/premium/status-badge";

const STATS = [
  { value: "Markdown + JSONML", label: "Open formats" },
  { value: "pgvector HNSW", label: "Semantic index" },
  { value: "150x faster", label: "vs keyword search" },
  { value: "Obsidian native", label: "Sync compatible" },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function StorageHero() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative min-h-[88vh] flex items-center overflow-hidden py-20">
        <FloatingOrbs preset="aurora" />

        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-8">
            {/* Badge */}
            <m.div
              className="flex flex-wrap justify-center items-center gap-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <SovereigntyBadge />
              <StatusBadge level="beta" note="Supabase live · rest Q2 2026" />
            </m.div>

            <m.div
              className="max-w-2xl w-full"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
            >
              <StatusNotice
                level="beta"
                title="Supabase + pgvector are live. Rest is planned."
                body="Markdown + JSONML + pgvector HNSW work today inside Arcanea. Arweave, S3, Google Drive, Syncthing, and Obsidian export arrive through Q2 2026 as part of the ingestion workstream."
              />
            </m.div>

            {/* Eyebrow */}
            <m.p
              className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/30"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
            >
              Storage &amp; Knowledge Graph
            </m.p>

            {/* Headline */}
            <m.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold tracking-[-0.03em] leading-[1.06] max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              Your world persists,{" "}
              <span className="bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] bg-clip-text text-transparent">
                everywhere
              </span>
            </m.h1>

            {/* Subtitle */}
            <m.p
              className="max-w-2xl text-base sm:text-lg text-white/45 leading-relaxed font-body"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
            >
              Markdown + JSONML for content. pgvector for semantic search. Your
              choice of backend — Supabase, Arweave, S3, Google Drive, or local
              files. Open standards top to bottom.
            </m.p>

            {/* CTAs */}
            <m.div
              className="flex flex-col sm:flex-row items-center gap-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
            >
              <Link
                href="/settings/storage"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] px-7 py-3.5 text-sm font-semibold text-[var(--arc-cosmic-void)] transition hover:shadow-[0_0_40px_rgba(127,255,212,0.25)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Set up sync
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white/70 backdrop-blur-sm transition hover:border-white/20 hover:text-white"
              >
                See storage docs
              </Link>
            </m.div>

            {/* Stats row */}
            <m.div
              className="flex flex-wrap justify-center gap-8 md:gap-12 mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
            >
              {STATS.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-8 md:gap-12">
                  {i > 0 && (
                    <span className="hidden md:block w-px h-5 bg-white/[0.06]" />
                  )}
                  <div className="text-center">
                    <p className="text-sm md:text-base font-display font-bold bg-gradient-to-b from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-atlantean-teal)] bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p className="text-[10px] font-mono tracking-wider uppercase text-white/25 mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </m.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--arc-cosmic-void)] to-transparent" />
      </section>
    </LazyMotion>
  );
}
