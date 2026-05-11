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
  { value: "6",   label: "Protocol layers", color: "var(--arc-brand-atlantean-teal)" },
  { value: "MIT", label: "Licensed",         color: "var(--arc-brand-atlantean-teal)" },
  { value: "3",   label: "Reference impls",  color: "var(--arc-void)" },
  { value: "EIP", label: "Compatible",       color: "var(--arc-brand-arcanean-gold)" },
] as const;

// ---------------------------------------------------------------------------
// Feature cards
// ---------------------------------------------------------------------------

export const FEATURES = [
  {
    title: "Agent Registry Protocol",
    body: "Every Luminor, Companion, or custom agent gets a portable Agent Card (A2A-compatible). Reputation travels with the agent.",
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
    body: "Open JSONML + Markdown schema for characters, locations, magic, lore. Interoperable with Obsidian, Notion, Logseq.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "var(--arc-brand-atlantean-teal)",
    delay: 0.06,
  },
  {
    title: "IP Licensing (Story Protocol)",
    body: "Every creation can be licensed on-chain. Royalty terms set by creator. Automatic payouts.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: "var(--arc-void)",
    delay: 0.12,
  },
  {
    title: "ERC-8004 Identity",
    body: "Creator identity as NFT. Verifiable on-chain. Links your ENS, Farcaster, Arcanea profile.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
      </svg>
    ),
    color: "var(--arc-brand-cosmic-blue)",
    delay: 0.18,
  },
  {
    title: "x402 Micropayments",
    body: "Pay-per-inference. Pay-per-remix. No subscriptions. Coinbase x402 standard.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "var(--arc-brand-arcanean-gold)",
    delay: 0.24,
  },
  {
    title: "Signed Content",
    body: "Every creation cryptographically signed. Provenance verifiable forever.",
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
  { protocol: "Agent Registry", spec: "draft",  refImpl: "stable", testnet: "Base Sepolia",  mainnet: "Q2 2026" },
  { protocol: "World Graph",    spec: "stable", refImpl: "stable", testnet: "N/A",           mainnet: "Live"    },
  { protocol: "IP Licensing",   spec: "draft",  refImpl: "draft",  testnet: "Story testnet", mainnet: "Live"    },
  { protocol: "Identity",       spec: "draft",  refImpl: "draft",  testnet: "Base Sepolia",  mainnet: "Q3 2026" },
  { protocol: "Micropayments",  spec: "review", refImpl: "review", testnet: "TBD",           mainnet: "Q4 2026" },
  { protocol: "Signing",        spec: "stable", refImpl: "stable", testnet: "N/A",           mainnet: "Live"    },
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
    title: "Read the spec",
    body: "Each protocol is a single Markdown document in the GitHub repo. Spec, rationale, and examples in one place.",
    accent: "var(--arc-brand-atlantean-teal)",
    iconNode: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Implement in your stack",
    body: "Reference implementations in TypeScript, Rust, and Python. All MIT licensed. Fork, adapt, ship.",
    accent: "var(--arc-brand-atlantean-teal)",
    iconNode: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Register a conformance test",
    body: "Submit your test suite results to the Arcanean Protocol Registry. Earn a conformance badge visible on your agent cards.",
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
    title: "Arcanean Improvement Proposals",
    body: "Any change to the protocol starts as an AIP — a structured document modeled on EIPs. Anyone can author one. The community debates it. Core team ratifies.",
    color: "var(--arc-brand-arcanean-gold)",
    delay: 0,
  },
  {
    title: "Public RFC Process",
    body: "Major changes go through a 30-day public comment period before merging. All feedback is on GitHub Issues, in the open.",
    color: "var(--arc-brand-atlantean-teal)",
    delay: 0.08,
  },
  {
    title: "Community Maintainers",
    body: "Core team ships the reference impls. Community maintainers own conformance tests. Merged by reputation, not by company affiliation.",
    color: "var(--arc-brand-atlantean-teal)",
    delay: 0.16,
  },
];

// ---------------------------------------------------------------------------
// Sovereignty guarantee items
// ---------------------------------------------------------------------------

export const SOVEREIGNTY_ITEMS = [
  {
    label: "Your keys, not ours",
    body: "BYOK at every layer. We never hold, log, or mark up your API keys.",
    color: "var(--arc-brand-atlantean-teal)",
  },
  {
    label: "Your IP, not licensed to us",
    body: "Zero claims on your output. No training on your creations. Export anytime.",
    color: "var(--arc-brand-atlantean-teal)",
  },
  {
    label: "Your data, not trained on",
    body: "Inference runs on your keys. Nothing is used to improve our models without consent.",
    color: "var(--arc-void)",
  },
  {
    label: "Your community, not captured",
    body: "Open spec means other platforms can implement it. You are never locked in.",
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
            {["Protocol", "Spec", "Reference Impl", "Testnet", "Mainnet"].map((h) => (
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
