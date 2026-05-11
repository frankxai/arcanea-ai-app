/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m } from "framer-motion";
import {
  brand,
  ambient,
  competitorAccent,
} from "@arcanea/design-system";

// ---------------------------------------------------------------------------
// StatusBadge — Honest labels for product state.
// Use on page heroes, section headers, and integration tiles so visitors
// know what's live, what's planned, and what's still a sketch.
//
// Maturity scale:
//   LIVE      — wired end-to-end, works right now
//   BETA      — works with caveats, opted-in
//   PREVIEW   — UX/design done, plumbing pending
//   PLANNED   — on the backlog with a target quarter
//   ROADMAP   — aspirational, no target yet
// ---------------------------------------------------------------------------

export type StatusLevel = "live" | "beta" | "preview" | "planned" | "roadmap";

const STATUS_META: Record<
  StatusLevel,
  { label: string; color: string; dot: string; hint: string }
> = {
  live: {
    label: "LIVE",
    color: brand.aquamarine,
    dot: brand.aquamarine,
    hint: "Wired end-to-end — try it now.",
  },
  beta: {
    label: "BETA",
    color: brand.atlanteanTeal,
    dot: brand.atlanteanTeal,
    hint: "Works with rough edges. Opt-in.",
  },
  preview: {
    label: "PREVIEW",
    color: brand.arcaneanGold,
    dot: brand.arcaneanGold,
    hint: "Design + UX ready. Connective plumbing in progress.",
  },
  planned: {
    label: "PLANNED",
    color: ambient.lavender,
    dot: ambient.lavender,
    hint: "Scheduled on the public backlog.",
  },
  roadmap: {
    label: "ROADMAP",
    color: competitorAccent,
    dot: competitorAccent,
    hint: "On the long-range roadmap — no date yet.",
  },
};

export interface StatusBadgeProps {
  level: StatusLevel;
  /** Optional extra context, e.g. "Q2 2026" or "arrives with Arcanean Protocol v1" */
  note?: string;
  /** Compact render for inline use (in cards, tiles) */
  compact?: boolean;
  className?: string;
}

export function StatusBadge({
  level,
  note,
  compact = false,
  className = "",
}: StatusBadgeProps) {
  const meta = STATUS_META[level];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase border ${className}`}
        style={{
          background: `${meta.color}10`,
          borderColor: `${meta.color}28`,
          color: meta.color,
        }}
        title={meta.hint}
      >
        <span
          className="w-1 h-1 rounded-full"
          style={{
            background: meta.dot,
            boxShadow: level === "live" ? `0 0 4px ${meta.dot}` : "none",
          }}
        />
        {meta.label}
      </span>
    );
  }

  return (
    <m.span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase border backdrop-blur-sm ${className}`}
      style={{
        background: `${meta.color}10`,
        borderColor: `${meta.color}2a`,
        color: meta.color,
      }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      title={meta.hint}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: meta.dot,
          boxShadow: level === "live" ? `0 0 6px ${meta.dot}` : "none",
        }}
      />
      {meta.label}
      {note && (
        <>
          <span className="opacity-40">·</span>
          <span className="opacity-85 tracking-wider">{note}</span>
        </>
      )}
    </m.span>
  );
}

// ---------------------------------------------------------------------------
// StatusNotice — Banner variant for page tops where honesty matters most
// ---------------------------------------------------------------------------

export interface StatusNoticeProps {
  level: StatusLevel;
  title: string;
  body: string;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
}

export function StatusNotice({
  level,
  title,
  body,
  linkHref,
  linkLabel,
  className = "",
}: StatusNoticeProps) {
  const meta = STATUS_META[level];
  return (
    <div
      className={`relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 px-4 py-3 rounded-xl border backdrop-blur-sm ${className}`}
      style={{
        background: `${meta.color}08`,
        borderColor: `${meta.color}22`,
      }}
    >
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase shrink-0"
        style={{
          background: `${meta.color}14`,
          border: `1px solid ${meta.color}30`,
          color: meta.color,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: meta.dot }}
        />
        {meta.label}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className="text-[13px] font-semibold leading-tight mb-0.5"
          style={{ color: meta.color }}
        >
          {title}
        </p>
        <p className="text-[12px] text-white/55 leading-relaxed">{body}</p>
      </div>
      {linkHref && linkLabel && (
        <a
          href={linkHref}
          className="shrink-0 text-[11px] font-medium hover:underline"
          style={{ color: meta.color }}
        >
          {linkLabel} &rarr;
        </a>
      )}
    </div>
  );
}
