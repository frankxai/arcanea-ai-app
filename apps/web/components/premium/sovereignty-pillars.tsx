/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { m } from "framer-motion";
import { Keyboard, Shield, Code, ArrowSquareOut } from "@/lib/phosphor-icons";
import type { PhosphorIcon } from "@/lib/phosphor-icons";
import { brand, ambient } from "@arcanea/design-system";

// ---------------------------------------------------------------------------
// SovereigntyPillars — The "Keep your keys. Keep your IP." section.
// Four pillars that define Arcanea's open-source / BYOK promise.
// Elevated from trust line footer to proper section.
// ---------------------------------------------------------------------------

interface Pillar {
  icon: PhosphorIcon;
  title: string;
  body: string;
  accent: string;
}

const PILLARS: Pillar[] = [
  {
    icon: Keyboard,
    title: "BYOK Compute",
    body: "Chat runs on your own provider key, and world drafts run on your Gemini key. You pay the provider directly; Arcanea adds no markup. Image generation in Imagine uses account credits.",
    accent: brand.aquamarine,
  },
  {
    icon: Shield,
    title: "Sovereign Lore",
    body: "Worlds, characters, and scenes are stored in your Arcanea account. You keep ownership of what you make, and Arcanea takes no royalties. Arcanea does not train models on your work without your consent.",
    accent: brand.atlanteanTeal,
  },
  {
    icon: Code,
    title: "MIT-Licensed Tools",
    body: "Clone the Arcanea MCP server and creator skills, run them locally, and change the agent logic. Both are MIT-licensed.",
    accent: brand.arcaneanGold,
  },
  {
    icon: ArrowSquareOut,
    title: "Canon in Your Editor",
    body: "Point Claude, Codex, or Cursor at the Arcanea MCP reader to check drafts against canon. Signed-in world context over MCP is in preview.",
    accent: ambient.lavender,
  },
];

export function SovereigntyPillars() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {PILLARS.map((pillar, i) => {
        const Icon = pillar.icon;
        return (
          <m.div
            key={pillar.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -4 }}
            className="group relative p-6 rounded-2xl bg-white/[0.025] border border-white/[0.06] backdrop-blur-sm hover:border-white/[0.12] transition-colors duration-500"
          >
            {/* Hover glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(400px circle at 50% 0%, ${pillar.accent}10, transparent 50%)`,
              }}
            />

            <div className="relative">
              {/* Icon */}
              <div
                className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5"
                style={{
                  background: `${pillar.accent}10`,
                  border: `1px solid ${pillar.accent}20`,
                }}
              >
                <Icon
                  className="w-5 h-5"
                  weight="duotone"
                  style={{ color: pillar.accent } as React.CSSProperties}
                />
              </div>

              {/* Title */}
              <h3
                className="text-base font-display font-semibold mb-2"
                style={{ color: pillar.accent }}
              >
                {pillar.title}
              </h3>

              {/* Body */}
              <p className="text-[13px] text-white/45 leading-relaxed">
                {pillar.body}
              </p>
            </div>
          </m.div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SovereigntyBadge — small inline badge for use above headlines
// ---------------------------------------------------------------------------

export function SovereigntyBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--arc-brand-atlantean-teal)]/[0.08] border border-[var(--arc-brand-atlantean-teal)]/[0.18] backdrop-blur-sm">
      <span className="relative flex w-1.5 h-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--arc-brand-atlantean-teal)] opacity-50 animate-ping" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--arc-brand-atlantean-teal)]" />
      </span>
      <span className="text-[11px] font-mono tracking-[0.15em] uppercase text-[var(--arc-brand-atlantean-teal)]/80">
        Sovereign World Engine
      </span>
    </div>
  );
}
