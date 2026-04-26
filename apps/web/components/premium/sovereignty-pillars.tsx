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
    title: "Your keys, always",
    body: "BYOK by default. Your OpenAI, Anthropic, or Google key lives in your browser. We never see it, store it, or mark it up.",
    accent: brand.aquamarine,
  },
  {
    icon: Shield,
    title: "Your IP, always",
    body: "Everything you create is yours. No claims on output. No training on your data. Export as markdown, JSON, or fork the whole stack.",
    accent: brand.atlanteanTeal,
  },
  {
    icon: Code,
    title: "Open source core",
    body: "27 repos, 43 packages, MIT licensed. The entire world engine, compiler, and agent framework is forkable. Run it locally if you want.",
    accent: brand.arcaneanGold,
  },
  {
    icon: ArrowSquareOut,
    title: "No lock-in",
    body: "Your worlds, characters, and chats export as portable files. Works with Claude Code, Cursor, GPT, Gemini — anywhere you want to go next.",
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
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7fffd4]/[0.08] border border-[#7fffd4]/[0.18] backdrop-blur-sm">
      <span className="relative flex w-1.5 h-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#7fffd4] opacity-50 animate-ping" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#7fffd4]" />
      </span>
      <span className="text-[11px] font-mono tracking-[0.15em] uppercase text-[#7fffd4]/80">
        Sovereign Creative AI
      </span>
    </div>
  );
}
