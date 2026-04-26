"use client";

import { m } from "framer-motion";
import { Check, X } from "@/lib/phosphor-icons";
import { brand, competitorAccent } from "@arcanea/design-system";

// ---------------------------------------------------------------------------
// ComparisonMatrix — "Why Arcanea" differentiator table.
// Shows what Arcanea does that mainstream AI chat tools don't.
// Not to trash competitors — to clarify the moat.
// ---------------------------------------------------------------------------

type Cell = true | false | "partial";

interface Feature {
  label: string;
  arcanea: Cell;
  chatgpt: Cell;
  claude: Cell;
  character: Cell;
  note?: string;
}

const FEATURES: Feature[] = [
  {
    label: "Persistent world graph",
    arcanea: true,
    chatgpt: false,
    claude: false,
    character: "partial",
    note: "Characters, locations, magic linked — consistent across sessions",
  },
  {
    label: "Specialist creative agents",
    arcanea: true,
    chatgpt: "partial",
    claude: false,
    character: "partial",
    note: "16 purpose-built agents, not one generic chatbot",
  },
  {
    label: "Text + image + music integrated",
    arcanea: true,
    chatgpt: "partial",
    claude: false,
    character: false,
  },
  {
    label: "BYOK — your keys, no markup",
    arcanea: true,
    chatgpt: false,
    claude: false,
    character: false,
  },
  {
    label: "Export everything as markdown/JSON",
    arcanea: true,
    chatgpt: "partial",
    claude: "partial",
    character: false,
  },
  {
    label: "Open source (MIT) + forkable",
    arcanea: true,
    chatgpt: false,
    claude: false,
    character: false,
  },
  {
    label: "Connected creator community",
    arcanea: "partial",
    chatgpt: false,
    claude: false,
    character: true,
  },
  {
    label: "No data used for training",
    arcanea: true,
    chatgpt: "partial",
    claude: "partial",
    character: false,
  },
];

const COLUMNS = [
  { key: "arcanea", label: "Arcanea", accent: brand.aquamarine },
  { key: "chatgpt", label: "ChatGPT", accent: competitorAccent },
  { key: "claude", label: "Claude", accent: competitorAccent },
  { key: "character", label: "Character.AI", accent: competitorAccent },
] as const;

function CellIcon({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#7fffd4]/15 border border-[#7fffd4]/30">
        <Check className="w-3 h-3 text-[#7fffd4]" weight="bold" />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.06] border border-white/[0.12]">
        <span className="w-2 h-2 rounded-full bg-white/30" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.02] border border-white/[0.06]">
      <X className="w-3 h-3 text-white/20" weight="bold" />
    </span>
  );
}

export function ComparisonMatrix() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
      {/* Highlight column background for Arcanea */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 bg-gradient-to-b from-[#7fffd4]/[0.04] via-[#00bcd4]/[0.02] to-transparent"
        style={{ left: "calc(40% + 0px)", width: "calc(15% - 4px)" }}
      />

      {/* Desktop table */}
      <div className="hidden md:block">
        {/* Header row */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] border-b border-white/[0.06]">
          <div className="px-6 py-5 text-[11px] font-mono tracking-[0.25em] uppercase text-white/30">
            Capability
          </div>
          {COLUMNS.map((col) => (
            <div
              key={col.key}
              className="px-4 py-5 text-center"
              style={{
                background:
                  col.key === "arcanea"
                    ? "linear-gradient(to bottom, rgba(127,255,212,0.06), transparent)"
                    : undefined,
              }}
            >
              <span
                className="text-sm font-display font-semibold"
                style={{ color: col.accent }}
              >
                {col.label}
              </span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {FEATURES.map((feat, i) => (
          <m.div
            key={feat.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.015] transition-colors"
          >
            <div className="px-6 py-5">
              <div className="text-sm font-medium text-white/75">{feat.label}</div>
              {feat.note && (
                <div className="text-[11px] text-white/35 mt-1">{feat.note}</div>
              )}
            </div>
            {COLUMNS.map((col) => (
              <div
                key={col.key}
                className="px-4 py-5 flex items-center justify-center"
              >
                <CellIcon value={feat[col.key]} />
              </div>
            ))}
          </m.div>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-white/[0.06]">
        {FEATURES.map((feat, i) => (
          <m.div
            key={feat.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="p-5"
          >
            <div className="text-sm font-medium text-white/80 mb-1">
              {feat.label}
            </div>
            {feat.note && (
              <div className="text-[11px] text-white/35 mb-3">{feat.note}</div>
            )}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {COLUMNS.map((col) => (
                <div
                  key={col.key}
                  className="flex flex-col items-center gap-1.5"
                >
                  <CellIcon value={feat[col.key]} />
                  <span
                    className="text-[9px] font-mono uppercase tracking-wider"
                    style={{ color: col.accent }}
                  >
                    {col.label}
                  </span>
                </div>
              ))}
            </div>
          </m.div>
        ))}
      </div>
    </div>
  );
}
