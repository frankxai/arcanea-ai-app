/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m } from "framer-motion";
import Link from "next/link";
import type { PhosphorIcon } from "@/lib/phosphor-icons";

// ---------------------------------------------------------------------------
// RevenueStreamCard — Creator economy / monetization pathway card.
// Each card is one way creators earn on Arcanea.
// ---------------------------------------------------------------------------

export interface RevenueStream {
  title: string;
  tagline: string;
  body: string;
  icon: PhosphorIcon;
  accent: string;
  take: string; // e.g. "Keep 90%" or "Keep 100%"
  fee?: string; // e.g. "3% platform" or "free"
  status?: "live" | "beta" | "soon";
  bullets: string[];
  href?: string;
  ctaLabel?: string;
}

const STATUS_LABEL: Record<NonNullable<RevenueStream["status"]>, string> = {
  live: "LIVE",
  beta: "BETA",
  soon: "COMING SOON",
};

const STATUS_COLOR: Record<NonNullable<RevenueStream["status"]>, string> = {
  live: "var(--arc-brand-atlantean-teal)",
  beta: "var(--arc-brand-arcanean-gold)",
  soon: "var(--arc-void)",
};

interface Props {
  stream: RevenueStream;
  index?: number;
}

export function RevenueStreamCard({ stream, index = 0 }: Props) {
  const Icon = stream.icon;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.14] transition-colors duration-500 p-6 md:p-7"
    >
      {/* Accent glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(500px circle at 50% 0%, ${stream.accent}12, transparent 60%)`,
        }}
      />

      {/* Top accent line */}
      <m.div
        className="absolute top-0 left-6 right-6 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${stream.accent}80, transparent)`,
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.08 + 0.2 }}
      />

      <div className="relative">
        {/* Icon + status */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl"
            style={{
              background: `${stream.accent}10`,
              border: `1px solid ${stream.accent}25`,
            }}
          >
            <Icon
              className="w-5 h-5"
              weight="duotone"
              style={{ color: stream.accent } as React.CSSProperties}
            />
          </div>
          {stream.status && (
            <span
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-mono tracking-wider"
              style={{
                background: `${STATUS_COLOR[stream.status]}12`,
                border: `1px solid ${STATUS_COLOR[stream.status]}30`,
                color: STATUS_COLOR[stream.status],
              }}
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{
                  background: STATUS_COLOR[stream.status],
                  boxShadow: stream.status === "live" ? `0 0 6px ${STATUS_COLOR[stream.status]}` : "none",
                }}
              />
              {STATUS_LABEL[stream.status]}
            </span>
          )}
        </div>

        {/* Title + tagline */}
        <h3
          className="text-lg font-display font-semibold mb-1"
          style={{ color: stream.accent }}
        >
          {stream.title}
        </h3>
        <p className="text-[11px] font-mono tracking-wider uppercase text-white/35 mb-4">
          {stream.tagline}
        </p>

        {/* Body */}
        <p className="text-sm text-white/50 leading-relaxed mb-5">
          {stream.body}
        </p>

        {/* Key stats row */}
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/[0.06]">
          <div>
            <p className="text-[10px] font-mono tracking-wider uppercase text-white/30">
              You keep
            </p>
            <p
              className="text-lg font-display font-bold"
              style={{ color: stream.accent }}
            >
              {stream.take}
            </p>
          </div>
          {stream.fee && (
            <div>
              <p className="text-[10px] font-mono tracking-wider uppercase text-white/30">
                Fee
              </p>
              <p className="text-sm font-display font-semibold text-white/60">
                {stream.fee}
              </p>
            </div>
          )}
        </div>

        {/* Bullet list */}
        <ul className="space-y-2 mb-5">
          {stream.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2 text-[13px] text-white/55"
            >
              <span
                className="mt-[7px] w-1 h-1 rounded-full shrink-0"
                style={{ background: `${stream.accent}80` }}
              />
              <span className="leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {stream.href && stream.ctaLabel && (
          <Link
            href={stream.href}
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-transform group-hover:translate-x-0.5"
            style={{ color: stream.accent }}
          >
            {stream.ctaLabel}
            <span className="text-xs">&rarr;</span>
          </Link>
        )}
      </div>
    </m.div>
  );
}
