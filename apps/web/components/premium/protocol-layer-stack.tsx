/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m } from "framer-motion";

// ---------------------------------------------------------------------------
// ProtocolLayerStack — Visual of the Arcanean Protocol architecture.
// Shows the open-protocol layers from app → identity → chain, each with
// what's open, what's Arcanea, what's yours.
// ---------------------------------------------------------------------------

interface ProtocolLayer {
  label: string;
  title: string;
  body: string;
  accent: string;
  items: { name: string; type: "open" | "arcanea" | "yours" }[];
}

const LAYERS: ProtocolLayer[] = [
  {
    label: "L5",
    title: "Creator Applications",
    body: "The surface creators touch. Chat, Worlds, Studio, Forge. All built on the layers below.",
    accent: "var(--arc-brand-arcanean-gold)",
    items: [
      { name: "arcanea.ai", type: "arcanea" },
      { name: "Your portfolio", type: "yours" },
      { name: "Whop storefronts", type: "open" },
      { name: "Discord bots", type: "open" },
    ],
  },
  {
    label: "L4",
    title: "World Graph",
    body: "Persistent, connected creations. Characters, locations, magic, lore — stored as markdown + JSONML, indexed as pgvector embeddings.",
    accent: "var(--arc-brand-atlantean-teal)",
    items: [
      { name: "JSONML schema", type: "open" },
      { name: "Graph API", type: "arcanea" },
      { name: "Your worlds", type: "yours" },
      { name: "Export to Obsidian", type: "open" },
    ],
  },
  {
    label: "L3",
    title: "Agent Registry Protocol",
    body: "Open registry for Luminors, Companions, and custom agents. Each agent has an Agent Card (A2A spec), reputation, and portable identity.",
    accent: "var(--arc-brand-atlantean-teal)",
    items: [
      { name: "Agent Card (A2A)", type: "open" },
      { name: "ERC-8004", type: "open" },
      { name: "Luminor Standard", type: "arcanea" },
      { name: "Your agents", type: "yours" },
    ],
  },
  {
    label: "L2",
    title: "Identity & Licensing",
    body: "Sovereign creator identity. Link your social profiles, on-chain wallets, Suno account, Custom GPTs. IP licensing via Story Protocol.",
    accent: "var(--arc-void)",
    items: [
      { name: "ENS", type: "open" },
      { name: "Farcaster FID", type: "open" },
      { name: "Story Protocol", type: "open" },
      { name: "Your identity", type: "yours" },
    ],
  },
  {
    label: "L1",
    title: "Settlement & Royalties",
    body: "Smart-contract royalties on remixes. x402 micropayments for agent inference. Token-gated content. All optional, all opt-in.",
    accent: "var(--arc-brand-cosmic-blue)",
    items: [
      { name: "Base (L2)", type: "open" },
      { name: "x402 payments", type: "open" },
      { name: "Arcanea Credits", type: "arcanea" },
      { name: "Your payouts", type: "yours" },
    ],
  },
  {
    label: "L0",
    title: "Storage & Compute",
    body: "BYOK inference + portable storage. Run locally, on Vercel, on your own cloud. We never hold your keys.",
    accent: "var(--arc-void)",
    items: [
      { name: "Your LLM keys", type: "yours" },
      { name: "Arweave", type: "open" },
      { name: "Supabase (optional)", type: "open" },
      { name: "Local-first", type: "open" },
    ],
  },
];

const TYPE_STYLE: Record<"open" | "arcanea" | "yours", { bg: string; border: string; color: string; label: string }> = {
  open: {
    bg: "rgba(148,163,184,0.06)",
    border: "rgba(148,163,184,0.18)",
    color: "rgba(148,163,184,0.85)",
    label: "OPEN",
  },
  arcanea: {
    bg: "rgba(127,255,212,0.08)",
    border: "rgba(127,255,212,0.25)",
    color: "rgba(127,255,212,0.9)",
    label: "ARCANEA",
  },
  yours: {
    bg: "rgba(255,215,0,0.08)",
    border: "rgba(255,215,0,0.25)",
    color: "rgba(255,215,0,0.9)",
    label: "YOURS",
  },
};

export function ProtocolLayerStack() {
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="space-y-3">
        {LAYERS.map((layer, i) => (
          <m.div
            key={layer.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden"
          >
            <div
              className="relative p-5 md:p-6 rounded-2xl border bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500"
              style={{ borderColor: `${layer.accent}18` }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ background: `linear-gradient(to bottom, ${layer.accent}80, transparent)` }}
              />

              <div className="flex flex-col md:flex-row md:items-start gap-5">
                {/* Layer number + title */}
                <div className="md:w-56 shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border"
                      style={{
                        background: `${layer.accent}12`,
                        borderColor: `${layer.accent}35`,
                        color: layer.accent,
                      }}
                    >
                      {layer.label}
                    </span>
                    <h3
                      className="text-base font-display font-bold"
                      style={{ color: layer.accent }}
                    >
                      {layer.title}
                    </h3>
                  </div>
                  <p className="text-sm text-white/45 leading-relaxed">
                    {layer.body}
                  </p>
                </div>

                {/* Items row */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map((item) => {
                      const style = TYPE_STYLE[item.type];
                      return (
                        <span
                          key={item.name}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-mono"
                          style={{
                            background: style.bg,
                            border: `1px solid ${style.border}`,
                            color: style.color,
                          }}
                        >
                          <span
                            className="text-[9px] font-bold tracking-[0.15em]"
                            style={{ opacity: 0.7 }}
                          >
                            {style.label}
                          </span>
                          {item.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        ))}
      </div>

      {/* Legend */}
      <m.div
        className="mt-8 flex flex-wrap justify-center gap-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        {(["open", "arcanea", "yours"] as const).map((key) => {
          const s = TYPE_STYLE[key];
          return (
            <div key={key} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }}
              />
              <span className="text-[10px] font-mono tracking-wider text-white/40">
                {s.label} —{" "}
                {key === "open"
                  ? "industry standard, interoperable"
                  : key === "arcanea"
                  ? "Arcanea-maintained, open source"
                  : "your sovereign layer"}
              </span>
            </div>
          );
        })}
      </m.div>
    </div>
  );
}
