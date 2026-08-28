/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

// ---------------------------------------------------------------------------
// Data + sub-components for the Protocol page.
// Kept separate to hold protocol-content.tsx under 500 lines.
// ---------------------------------------------------------------------------

import type { FlowStep } from "@/components/premium";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SpecStatus = "stable" | "draft" | "review";

export interface SpecRow {
  protocol: string;
  spec: SpecStatus;
  refImpl: SpecStatus;
  testnet: string;
  mainnet: string;
}

// ---------------------------------------------------------------------------
// Hero stats
// ---------------------------------------------------------------------------

export const HERO_STATS = [
  { value: "6",       label: "Interface areas", color: "var(--arc-brand-atlantean-teal)" },
  { value: "Per repo", label: "Licenses",        color: "var(--arc-brand-atlantean-teal)" },
  { value: "Preview", label: "Evidence state",   color: "var(--arc-void)" },
  { value: "0",       label: "Canon grants",     color: "var(--arc-brand-arcanean-gold)" },
] as const;

// ---------------------------------------------------------------------------
// Feature cards
// ---------------------------------------------------------------------------

export const FEATURES = [
  {
    title: "Agent / Connector Interface",
    body: "A provider-neutral envelope for tasks, capabilities, inputs, outputs, evidence states, and release receipts.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
    color: "var(--arc-brand-atlantean-teal)",
    delay: 0,
  },
  {
    title: "World Graph Schema",
    body: "A versioned schema for entities, relationships, continuity, canonicality, and export. Current status: draft.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "var(--arc-brand-atlantean-teal)",
    delay: 0.06,
  },
  {
    title: "Rights Manifest",
    body: "A rights and provenance record for sources, contributors, providers, permitted uses, restrictions, and blockers.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: "var(--arc-void)",
    delay: 0.12,
  },
  {
    title: "Asset Provenance",
    body: "Stable asset IDs separated from versions, renditions, placements, approvals, and superseded outputs.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
      </svg>
    ),
    color: "var(--arc-brand-cosmic-blue)",
    delay: 0.18,
  },
  {
    title: "Portable Export Bundle",
    body: "A creator-owned bundle for lore, manuscripts, media references, metadata, and receipts without an Arcanea canon grant.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "var(--arc-brand-arcanean-gold)",
    delay: 0.24,
  },
  {
    title: "Canon and Release Validators",
    body: "Deterministic checks for naming, continuity, rights, public claims, release gates, and evidence completeness.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    color: "var(--arc-wind)",
    delay: 0.30,
  },
];

// ---------------------------------------------------------------------------
// Spec status table
// ---------------------------------------------------------------------------

export const SPEC_TABLE: SpecRow[] = [
  { protocol: "Agent / Connector", spec: "draft",  refImpl: "draft",  testnet: "Internal packet", mainnet: "Preview" },
  { protocol: "World Graph",       spec: "draft",  refImpl: "review", testnet: "Internal build",  mainnet: "Preview" },
  { protocol: "Rights Manifest",   spec: "review", refImpl: "draft",  testnet: "Governance PR",   mainnet: "Planned" },
  { protocol: "Asset Provenance",  spec: "review", refImpl: "draft",  testnet: "Contract only",   mainnet: "Planned" },
  { protocol: "Export Bundle",     spec: "draft",  refImpl: "review", testnet: "Internal build",  mainnet: "Planned" },
  { protocol: "Canon Validator",   spec: "review", refImpl: "draft",  testnet: "Audit script",    mainnet: "Planned" },
];

export const STATUS_PILL: Record<SpecStatus, { label: string; bg: string; color: string; border: string }> = {
  stable: { label: "Stable",    bg: "rgba(0,188,212,0.09)",  color: "var(--arc-brand-atlantean-teal)", border: "rgba(127,255,212,0.22)" },
  draft:  { label: "Draft",     bg: "rgba(0,188,212,0.07)",  color: "var(--arc-brand-atlantean-teal)", border: "rgba(0,188,212,0.22)"   },
  review: { label: "In review", bg: "rgba(251,191,36,0.08)", color: "var(--arc-brand-arcanean-gold)", border: "rgba(251,191,36,0.22)"  },
};

// ---------------------------------------------------------------------------
// Contributor flow steps
// ---------------------------------------------------------------------------

export const CONTRIBUTOR_STEPS: FlowStep[] = [
  {
    number: "01",
    title: "Check the boundary",
    body: "Confirm the component, source repository, evidence state, controlling license, and whether protected content is excluded.",
    accent: "var(--arc-brand-atlantean-teal)",
    iconNode: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Adopt only what is licensed",
    body: "Use an explicitly licensed schema, SDK, validator, or adapter. A technical license never includes Arcanea canon or marks.",
    accent: "var(--arc-brand-atlantean-teal)",
    iconNode: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Return evidence",
    body: "Attach validation results, provenance, known limitations, and the exact version. Evidence may support approval; it never grants it.",
    accent: "var(--arc-void)",
    iconNode: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Governance cards
// ---------------------------------------------------------------------------

export const GOVERNANCE_CARDS = [
  {
    title: "Versioned decisions",
    body: "Material interface changes require a recorded owner, rationale, compatibility impact, evidence, and effective version.",
    color: "var(--arc-brand-arcanean-gold)",
    delay: 0,
  },
  {
    title: "Evidence before status",
    body: "Preview, generated, inspected, judged, approved, and released are separate states. Public pages may not collapse them.",
    color: "var(--arc-brand-atlantean-teal)",
    delay: 0.08,
  },
  {
    title: "Protected-world boundary",
    body: "Creators own their original worlds. Arcanea remains separate, protected canon unless a written franchise license says otherwise.",
    color: "var(--arc-brand-atlantean-teal)",
    delay: 0.16,
  },
];

// ---------------------------------------------------------------------------
// Sovereignty guarantee items
// ---------------------------------------------------------------------------

export const SOVEREIGNTY_ITEMS = [
  {
    label: "Bring your provider access",
    body: "Where BYOK is supported, current product terms and the deployed implementation control storage, logging, and processing.",
    color: "var(--arc-brand-atlantean-teal)",
  },
  {
    label: "Your world remains yours",
    body: "Creator ownership is the product intent. Current terms must state the minimum service license, export, deletion, and training rules.",
    color: "var(--arc-brand-atlantean-teal)",
  },
  {
    label: "Every asset keeps provenance",
    body: "Sources, providers, model versions, permissions, transformations, and approvals travel with consequential outputs.",
    color: "var(--arc-void)",
  },
  {
    label: "Arcanea stays separate",
    body: "Using the Connector or an open component does not grant Arcanea story, character, adaptation, merchandise, or trademark rights.",
    color: "var(--arc-brand-arcanean-gold)",
  },
];

// ---------------------------------------------------------------------------
// StatusPill sub-component
// ---------------------------------------------------------------------------

export function StatusPill({ status }: { status: SpecStatus }) {
  const s = STATUS_PILL[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono border"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      {s.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// SpecTable sub-component
// ---------------------------------------------------------------------------

export function SpecTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {["Interface", "Spec", "Reference Impl", "Evidence", "Availability"].map((h) => (
              <th
                key={h}
                className="text-left px-5 py-3.5 text-[10px] font-mono tracking-[0.2em] uppercase text-white/30"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SPEC_TABLE.map((row, i) => (
            <tr
              key={row.protocol}
              className={`border-b border-white/[0.04] transition-colors hover:bg-white/[0.025] ${
                i === SPEC_TABLE.length - 1 ? "border-0" : ""
              }`}
            >
              <td className="px-5 py-3.5 font-display font-semibold text-white/80 whitespace-nowrap">
                {row.protocol}
              </td>
              <td className="px-5 py-3.5"><StatusPill status={row.spec} /></td>
              <td className="px-5 py-3.5"><StatusPill status={row.refImpl} /></td>
              <td className="px-5 py-3.5 font-mono text-[12px] text-white/45">{row.testnet}</td>
              <td className="px-5 py-3.5 font-mono text-[12px] text-white/45">{row.mainnet}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
