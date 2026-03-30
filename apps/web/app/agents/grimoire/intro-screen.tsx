"use client";

import { m } from "framer-motion";
import { GRIMOIRE_TIERS, type GrimoireTier } from "@/lib/agents/grimoire/types";

// ---------------------------------------------------------------------------
// Tier card
// ---------------------------------------------------------------------------

function TierCard({
  tier,
  selected,
  onSelect,
}: {
  tier: GrimoireTier;
  selected: boolean;
  onSelect: () => void;
}) {
  const isArchmage = tier.id === "archmage";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative w-full text-left p-5 rounded-2xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60 ${
        selected
          ? isArchmage
            ? "border-[#ffd700]/50 bg-gradient-to-br from-[#ffd700]/10 to-[#ffd700]/5 shadow-[0_0_30px_rgba(255,215,0,0.15)]"
            : "border-[#7fffd4]/40 bg-[#7fffd4]/[0.06] shadow-[0_0_20px_rgba(127,255,212,0.12)]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      {isArchmage && (
        <span className="absolute top-3 right-3 text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/30">
          Best Value
        </span>
      )}
      <div className="flex items-baseline gap-2 mb-1">
        <span
          className={`text-xl font-display font-bold ${
            isArchmage
              ? selected
                ? "text-[#ffd700]"
                : "text-white/70"
              : selected
                ? "text-[#7fffd4]"
                : "text-white/70"
          }`}
        >
          {tier.name}
        </span>
        <span className="text-2xl font-display font-bold text-white">
          ${tier.price}
        </span>
      </div>
      <p className="text-sm text-white/50 mb-3">{tier.description}</p>
      <ul className="space-y-1">
        {tier.sections.map((s) => (
          <li key={s} className="flex items-start gap-2 text-xs text-white/60">
            <span
              className={`mt-0.5 w-3 h-3 shrink-0 rounded-full ${
                selected
                  ? isArchmage
                    ? "bg-[#ffd700]/60"
                    : "bg-[#7fffd4]/60"
                  : "bg-white/20"
              }`}
              aria-hidden="true"
            />
            {s}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] font-mono text-white/30">
        {tier.agentCount} agents deployed
      </p>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Intro screen
// ---------------------------------------------------------------------------

interface IntroScreenProps {
  selectedTierId: "apprentice" | "mage" | "archmage";
  onSelectTier: (id: "apprentice" | "mage" | "archmage") => void;
  onBegin: () => void;
}

export function IntroScreen({
  selectedTierId,
  onSelectTier,
  onBegin,
}: IntroScreenProps) {
  return (
    <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20">
      <m.div
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-center text-[#7fffd4] font-mono text-xs tracking-widest uppercase mb-6">
          Arcanea Premium
        </p>
        <h1 className="text-center text-5xl md:text-7xl font-display font-bold leading-none mb-6">
          <span className="text-white">The </span>
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #ffd700, #fbbf24, #f59e0b)",
            }}
          >
            Grimoire
          </span>
        </h1>
        <p className="text-center text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-3">
          Answer ten questions. Wake up to a complete creative universe.
        </p>
        <p className="text-center text-white/35 max-w-xl mx-auto mb-12 text-sm leading-relaxed">
          Mythology-powered AI agents build your world, characters, magic
          system, and stories overnight — delivered as a single premium
          document.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {GRIMOIRE_TIERS.map((tier) => (
            <m.div
              key={tier.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
            >
              <TierCard
                tier={tier}
                selected={selectedTierId === tier.id}
                onSelect={() => onSelectTier(tier.id)}
              />
            </m.div>
          ))}
        </div>

        <div className="flex justify-center">
          <m.button
            type="button"
            onClick={onBegin}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-2xl font-display font-bold text-lg text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/60"
            style={{
              background:
                "linear-gradient(135deg, #ffd700 0%, #fbbf24 50%, #f59e0b 100%)",
              boxShadow:
                "0 0 40px rgba(255,215,0,0.25), 0 4px 20px rgba(255,215,0,0.2)",
            }}
          >
            Begin the Ritual
          </m.button>
        </div>
      </m.div>
    </main>
  );
}
