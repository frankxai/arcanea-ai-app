"use client";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  PhArrowRight,
  PhBookOpen,
  PhBooks,
  PhFlame,
  PhLightning,
  PhSparkle,
  PhStar,
} from "@/lib/phosphor-icons";
import { GlowCard } from "@/components/ui/glow-card";
import { EXAMPLES as APL_EXAMPLES } from "@/lib/apl/examples";

const DEMO_COLLECTIONS = [
  {
    id: "d1",
    name: "Creative Writing",
    icon: PhSparkle,
    color: "var(--arc-brand-atlantean-teal)",
    promptCount: 12,
    description: "Story prompts, character builders, and narrative frameworks",
  },
  {
    id: "d2",
    name: "World Building",
    icon: PhBooks,
    color: "var(--arc-brand-cosmic-blue)",
    promptCount: 8,
    description: "Universe creation, lore systems, and setting design",
  },
  {
    id: "d3",
    name: "Code & Technical",
    icon: PhLightning,
    color: "var(--arc-brand-arcanean-gold)",
    promptCount: 17,
    description: "Development prompts, debugging helpers, architecture guides",
  },
  {
    id: "d4",
    name: "Vault Imports",
    icon: PhBookOpen,
    color: "var(--arc-brand-atlantean-teal)",
    promptCount: 24,
    description: "Captured from ChatGPT, Claude, and Gemini sessions",
  },
  {
    id: "apl",
    name: "SPARK.SHAPE.SHARPEN",
    icon: PhFlame,
    color: "var(--arc-fire)",
    promptCount: APL_EXAMPLES.length,
    description: "Master prompts using the Arcanean Prompt Language",
  },
];

const APL_CATEGORY_LABELS: Record<string, string> = {
  character: "Character",
  image: "Image",
  music: "Music",
  scene: "Scene",
  world: "World",
};

export function PromptBooksLanding() {
  const [aplExpanded, setAplExpanded] = useState(false);

  return (
    <div className="flex-1 min-w-0 overflow-x-clip overflow-y-auto">
      <div className="max-w-3xl mx-auto min-w-0 px-4 sm:px-8 py-16 sm:py-24">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-atlantean-teal-aqua/20 bg-atlantean-teal-aqua/5 mb-8">
            <PhBookOpen
              className="w-3.5 h-3.5 text-atlantean-teal-aqua"
              weight="duotone"
            />
            <span className="text-xs font-mono tracking-widest text-atlantean-teal-aqua/80">
              Prompt Books
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-5 leading-tight text-balance break-words">
            Your AI Prompt Library
          </h1>
          <p className="text-base sm:text-lg text-text-secondary font-body leading-relaxed max-w-xl mx-auto">
            Organize, search, and reuse your best AI prompts across every
            platform. Import from the Arcanea Vault extension or capture
            directly.
          </p>
        </div>

        {/* Demo grid */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
          {DEMO_COLLECTIONS.map((c) => {
            const Icon = c.icon;
            const isApl = c.id === "apl";
            return (
              <GlowCard
                key={c.id}
                glass="none"
                className={cn(
                  "group rounded-2xl p-5 sm:p-6 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-[color,background-color,border-color,box-shadow,transform] duration-300",
                  isApl && "cursor-pointer sm:col-span-2",
                  isApl &&
                    aplExpanded &&
                    "border-[var(--arc-fire)]/30 bg-[var(--arc-fire)]/[0.03]",
                )}
                onClick={isApl ? () => setAplExpanded((v) => !v) : undefined}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${c.color}12`,
                      border: `1px solid ${c.color}25`,
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: c.color }}
                      weight="duotone"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold text-text-primary text-sm truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {c.promptCount} prompts
                    </p>
                  </div>
                  {isApl && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-[var(--arc-fire)]/10 text-[var(--arc-fire)] border border-[var(--arc-fire)]/20">
                      <PhFlame className="w-3 h-3" />
                      APL
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {c.description}
                </p>
                {isApl && (
                  <p className="text-xs text-text-muted mt-2">
                    {aplExpanded
                      ? "Click to collapse"
                      : "Click to preview prompts"}
                  </p>
                )}
              </GlowCard>
            );
          })}
        </div>

        {/* APL Expanded Examples */}
        {aplExpanded && (
          <div className="mb-14 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 mb-4 px-1">
              <PhFlame className="w-4 h-4 text-[var(--arc-fire)]" />
              <h3 className="font-display font-semibold text-sm text-text-primary">
                SPARK.SHAPE.SHARPEN Prompts
              </h3>
              <span className="text-xs text-text-muted">
                Before & after with Arcanean Prompt Language
              </span>
            </div>
            {APL_EXAMPLES.map((ex) => (
              <div
                key={ex.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/[0.1] transition-[color,background-color,border-color,box-shadow,transform] duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-display font-semibold text-sm text-text-primary">
                        {ex.title}
                      </h4>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider bg-[var(--arc-fire)]/10 text-[var(--arc-fire)] border border-[var(--arc-fire)]/20">
                        <PhStar className="w-2.5 h-2.5" />
                        APL Enhanced
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">
                      {APL_CATEGORY_LABELS[ex.category] || ex.category} &middot;
                      Best on {ex.bestModels.slice(0, 2).join(", ")}
                    </p>
                  </div>
                </div>
                {/* Before */}
                <div className="mb-3">
                  <p className="text-[10px] font-mono tracking-wider text-text-muted/60 mb-1">
                    Before
                  </p>
                  <p className="text-sm text-text-secondary/70 italic">
                    &ldquo;{ex.before}&rdquo;
                  </p>
                </div>
                {/* After */}
                <div>
                  <p className="text-[10px] font-mono tracking-wider text-[var(--arc-fire)]/70 mb-1">
                    After: SPARK.SHAPE.SHARPEN
                  </p>
                  <pre className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap font-body bg-white/[0.02] rounded-lg p-3 border border-white/[0.04] max-h-48 overflow-y-auto">
                    {ex.after}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-4",
            !aplExpanded && "mt-8",
          )}
        >
          <Link
            href="/auth/login?next=/prompt-books"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-aqua/80 text-cosmic-deep font-semibold text-sm hover:shadow-[0_0_30px_rgba(0,188,212,0.25)] hover:scale-[1.02] transition-[color,background-color,border-color,box-shadow,transform] duration-300"
          >
            Sign In to Access
            <PhArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/signup?next=/prompt-books"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-text-primary font-semibold text-sm hover:border-atlantean-teal-aqua/30 hover:bg-white/[0.06] transition-[color,background-color,border-color,box-shadow,transform] duration-300"
          >
            Create Free Account
          </Link>
        </div>

        <p className="text-center text-xs text-text-muted mt-8 max-w-md mx-auto leading-relaxed">
          Vault is a Chrome extension that exports ChatGPT, Claude, and Gemini
          conversations directly into your Prompt Books.
        </p>
      </div>
    </div>
  );
}
