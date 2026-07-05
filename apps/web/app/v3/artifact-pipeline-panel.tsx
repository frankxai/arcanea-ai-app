"use client";

import Link from "next/link";
import { brand } from "@arcanea/design-system";

const PIPELINE_STAGES = [
  {
    label: "Call",
    action: "Name the pressure",
    detail: "Plain-language mission intake.",
    tone: brand.arcaneanGold,
  },
  {
    label: "Gift",
    action: "Bound the offering",
    detail: "A useful object with clear edges.",
    tone: brand.arcaneanGold,
  },
  {
    label: "Trial",
    action: "Set the proof test",
    detail: "Criteria for the first usable result.",
    tone: brand.arcaneanGold,
  },
  {
    label: "Canon Memory",
    action: "Record lineage",
    detail: "World context, rights, and provenance.",
    tone: brand.atlanteanTeal,
  },
  {
    label: "Agent Route",
    action: "Assign specialists",
    detail: "Research, world, review, edit, publish.",
    tone: brand.atlanteanTeal,
  },
  {
    label: "Artifact Packet",
    action: "Seal the proof",
    detail: "Ready for Atlas, Studio, Worlds, or Store.",
    tone: brand.arcaneanGold,
  },
] as const;

const PIPELINE_DESTINATIONS = [
  { label: "Atlas", href: "/atlas/creatures" },
  { label: "Studio", href: "/studio/image" },
  { label: "Worlds", href: "/worlds/create" },
  { label: "Store", href: "/studio/store" },
] as const;

type ArtifactPipelinePanelProps = {
  variant?: "hero" | "showcase";
};

export function ArtifactPipelinePanel({ variant = "showcase" }: ArtifactPipelinePanelProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={`relative mx-auto scroll-mt-24 overflow-hidden border border-white/[0.08] bg-[var(--arc-cosmic-void)]/55 shadow-[0_24px_90px_color-mix(in_srgb,var(--arc-cosmic-void)_78%,transparent)] backdrop-blur-2xl sm:scroll-mt-28 ${
        isHero
          ? "mt-3 w-full max-w-3xl rounded-2xl p-2 sm:mt-5 sm:p-4"
          : "mb-10 max-w-5xl rounded-3xl p-4 sm:p-5 lg:p-6"
      }`}
      aria-label="Arcanea artifact pipeline from call to sealed proof packet"
      data-testid={`artifact-pipeline-${variant}`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background:
            "radial-gradient(circle at 18% 12%, color-mix(in srgb, var(--arc-brand-arcanean-gold) 12%, transparent), transparent 32%), radial-gradient(circle at 80% 18%, color-mix(in srgb, var(--arc-brand-atlantean-teal) 12%, transparent), transparent 30%)",
        }}
      />
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--arc-brand-arcanean-gold)]/40 to-transparent" />

      {isHero ? (
        <CompactArtifactPipeline />
      ) : (
        <FullArtifactPipeline />
      )}
    </div>
  );
}

function CompactArtifactPipeline() {
  const visibleStages = PIPELINE_STAGES.filter((stage) =>
    ["Call", "Trial", "Agent Route", "Artifact Packet"].includes(stage.label),
  );

  return (
    <div className="relative">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-left sm:mb-3">
        <span className="font-body text-[10px] uppercase tracking-normal text-[var(--arc-brand-arcanean-gold)]/78">
          proof pipeline
        </span>
        <span className="rounded-full border border-[var(--arc-brand-atlantean-teal)]/20 bg-[var(--arc-brand-atlantean-teal)]/8 px-2.5 py-1 text-[10px] text-[var(--arc-brand-atlantean-teal)]/78">
          Call to artifact
        </span>
      </div>

      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {visibleStages.map((stage, index) => {
          const isFinal = stage.label === "Artifact Packet";
          return (
            <li
              key={stage.label}
              className={`relative min-h-[62px] rounded-xl border px-2.5 py-1 text-left sm:min-h-[92px] sm:px-3 sm:py-2.5 ${
                isFinal
                  ? "border-[var(--arc-brand-arcanean-gold)]/26 bg-[var(--arc-brand-arcanean-gold)]/8"
                  : "border-white/[0.06] bg-white/[0.025]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: stage.tone }}
                />
                <span className="text-[10px] text-white/24">0{index + 1}</span>
              </div>
              <p className="mt-2 font-display text-xs font-semibold leading-tight text-white/82">
                {stage.label}
              </p>
              <p className="mt-1 text-[10px] leading-snug text-white/42">
                {stage.action}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="mt-2 h-px w-full origin-left rounded-full bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)]/20 via-[var(--arc-brand-atlantean-teal)]/80 to-[var(--arc-brand-arcanean-gold)]/35 sm:mt-3" />
    </div>
  );
}

function FullArtifactPipeline() {
  return (
    <div className="relative grid gap-5 lg:grid-cols-[0.95fr_1.65fr_0.95fr] lg:items-stretch">
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="font-body text-[10px] uppercase tracking-normal text-[var(--arc-brand-arcanean-gold)]/75">
            call intake
          </span>
          <span className="rounded-full border border-[var(--arc-brand-arcanean-gold)]/20 bg-[var(--arc-brand-arcanean-gold)]/8 px-2 py-1 text-[10px] text-[var(--arc-brand-arcanean-gold)]/80">
            Genesis
          </span>
        </div>
        <p className="mt-4 font-editorial text-xl italic leading-tight text-white/82">
          "A creator names the part of The Drift they will answer."
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/42">
          The first input becomes a bounded Gift and a proof-sized Trial before Arcanea routes it anywhere else.
        </p>
      </div>

      <div className="relative rounded-2xl border border-white/[0.07] bg-black/20 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="font-body text-[10px] uppercase tracking-normal text-[var(--arc-brand-atlantean-teal)]/75">
            artifact pipeline
          </span>
          <span className="text-xs text-white/32">Call - Gift - Trial - Canon - Agents - Artifact</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {PIPELINE_STAGES.map((stage, index) => {
            const isFinal = index === PIPELINE_STAGES.length - 1;
            return (
              <div
                key={stage.label}
                className={`relative min-h-[136px] rounded-xl border p-3 transition-colors duration-300 ${
                  isFinal
                    ? "border-[var(--arc-brand-arcanean-gold)]/28 bg-[var(--arc-brand-arcanean-gold)]/8"
                    : "border-white/[0.06] bg-white/[0.025]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: stage.tone }}
                  />
                  <span className="text-[10px] text-white/22">0{index + 1}</span>
                </div>
                <p className="mt-3 font-display text-sm font-semibold leading-tight text-white/82">
                  {stage.label}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-white/46">
                  {stage.action}
                </p>
                <p className="mt-2 text-[10px] leading-snug text-white/28">
                  {stage.detail}
                </p>
                {isFinal && (
                  <span className="mt-3 inline-flex rounded-full border border-[var(--arc-brand-arcanean-gold)]/20 bg-black/25 px-2 py-0.5 text-[10px] text-[var(--arc-brand-arcanean-gold)]/80">
                    proof sealed
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div
          className="mt-4 h-px w-full origin-left rounded-full bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)]/20 via-[var(--arc-brand-atlantean-teal)]/80 to-[var(--arc-brand-arcanean-gold)]/35"
        />
      </div>

      <div className="rounded-2xl border border-[var(--arc-brand-arcanean-gold)]/16 bg-[var(--arc-brand-arcanean-gold)]/[0.045] p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="font-body text-[10px] uppercase tracking-normal text-[var(--arc-brand-arcanean-gold)]/75">
            artifact packet
          </span>
          <span className="h-2 w-2 rounded-full bg-[var(--arc-brand-atlantean-teal)] shadow-[0_0_18px_var(--arc-brand-atlantean-teal)]" />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-white/56">
          A finished proof carries the call, trial, canon note, right-use boundary, and specialist route.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {PIPELINE_DESTINATIONS.map((destination) => (
            <Link
              key={destination.label}
              href={destination.href}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/45 transition-colors hover:border-[var(--arc-brand-atlantean-teal)]/30 hover:text-white/72"
            >
              {destination.label}
            </Link>
          ))}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-white/28">
          Reduced motion keeps every stage visible and holds this packet as the final state.
        </p>
      </div>
    </div>
  );
}
