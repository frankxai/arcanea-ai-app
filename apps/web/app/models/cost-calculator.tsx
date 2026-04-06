"use client";

import { useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ModelPricing {
  id: string;
  name: string;
  provider: string;
  pricing_prompt_per_mtok: number;
  pricing_completion_per_mtok: number;
  is_free: boolean;
}

interface CostCalculatorProps {
  models: ModelPricing[];
}

/* ------------------------------------------------------------------ */
/*  Use-case presets                                                    */
/* ------------------------------------------------------------------ */

const USE_CASES = [
  { id: "chat", label: "Chat app", input: 500, output: 200 },
  { id: "code", label: "Code assistant", input: 2000, output: 1000 },
  { id: "docs", label: "Document analysis", input: 10000, output: 500 },
  { id: "custom", label: "Custom", input: 0, output: 0 },
] as const;

type UseCaseId = (typeof USE_CASES)[number]["id"];

const VOLUME_OPTIONS = [10, 100, 1000, 10000];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function monthlyCost(
  inputTok: number,
  outputTok: number,
  reqPerDay: number,
  promptPrice: number,
  completionPrice: number,
): number {
  const monthly = reqPerDay * 30;
  return (
    monthly *
    ((inputTok * promptPrice) / 1_000_000 +
      (outputTok * completionPrice) / 1_000_000)
  );
}

function formatUsd(n: number): string {
  if (n < 0.01) return "<$0.01";
  if (n < 1) return `$${n.toFixed(2)}`;
  if (n < 100) return `$${n.toFixed(2)}`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function formatMicro(n: number): string {
  if (n < 0.0001) return "<$0.0001";
  if (n < 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(4)}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CostCalculator({ models }: CostCalculatorProps) {
  const [useCase, setUseCase] = useState<UseCaseId>("chat");
  const [volume, setVolume] = useState(100);
  const [customInput, setCustomInput] = useState(1000);
  const [customOutput, setCustomOutput] = useState(500);

  const preset = USE_CASES.find((u) => u.id === useCase)!;
  const inputTokens = useCase === "custom" ? customInput : preset.input;
  const outputTokens = useCase === "custom" ? customOutput : preset.output;

  const freeModels = useMemo(
    () => models.filter((m) => m.is_free),
    [models],
  );

  const ranked = useMemo(() => {
    const paid = models.filter((m) => !m.is_free);
    return paid
      .map((m) => ({
        ...m,
        monthly: monthlyCost(
          inputTokens,
          outputTokens,
          volume,
          m.pricing_prompt_per_mtok,
          m.pricing_completion_per_mtok,
        ),
        perRequest:
          (inputTokens * m.pricing_prompt_per_mtok) / 1_000_000 +
          (outputTokens * m.pricing_completion_per_mtok) / 1_000_000,
      }))
      .sort((a, b) => a.monthly - b.monthly)
      .slice(0, 10);
  }, [models, inputTokens, outputTokens, volume]);

  const cheapest = ranked[0];
  const useCaseLabel = USE_CASES.find((u) => u.id === useCase)?.label ?? useCase;

  return (
    <section className="mb-24">
      {/* Section heading */}
      <div className="mb-10">
        <span className="inline-block text-xs font-medium tracking-widest uppercase text-[#ffd700]/60 mb-3">
          Cost Estimator
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-[family-name:var(--font-display)]">
          Cost Calculator
        </h2>
        <p className="mt-3 text-base text-white/50 max-w-2xl">
          Estimate monthly costs for any use case. Choose a preset or enter
          custom token counts to compare models side by side.
        </p>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
        <div className="grid lg:grid-cols-[340px_1fr] gap-8">
          {/* ---- Left: Inputs ---- */}
          <div className="space-y-6">
            {/* Use case */}
            <div>
              <label className="block text-xs font-medium tracking-widest uppercase text-[#ffd700]/60 mb-3">
                Use Case
              </label>
              <div className="flex flex-wrap gap-2">
                {USE_CASES.map((uc) => (
                  <button
                    key={uc.id}
                    onClick={() => setUseCase(uc.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      useCase === uc.id
                        ? "bg-[#7fffd4]/10 text-[#7fffd4] border-[#7fffd4]/20"
                        : "bg-white/[0.06] text-white/50 border-transparent hover:border-white/[0.1]"
                    }`}
                  >
                    {uc.label}
                  </button>
                ))}
              </div>
              {useCase !== "custom" && (
                <p className="mt-2 text-[11px] text-white/30">
                  ~{preset.input.toLocaleString()} input + {preset.output.toLocaleString()} output tokens per request
                </p>
              )}
            </div>

            {/* Custom inputs */}
            {useCase === "custom" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-white/40 mb-1">
                    Avg input tokens
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={customInput}
                    onChange={(e) =>
                      setCustomInput(Math.max(1, Number(e.target.value)))
                    }
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7fffd4]/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/40 mb-1">
                    Avg output tokens
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={customOutput}
                    onChange={(e) =>
                      setCustomOutput(Math.max(1, Number(e.target.value)))
                    }
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7fffd4]/30"
                  />
                </div>
              </div>
            )}

            {/* Volume */}
            <div>
              <label className="block text-xs font-medium tracking-widest uppercase text-[#ffd700]/60 mb-3">
                Requests per Day
              </label>
              <div className="flex flex-wrap gap-2">
                {VOLUME_OPTIONS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVolume(v)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      volume === v
                        ? "bg-[#7fffd4]/10 text-[#7fffd4] border-[#7fffd4]/20"
                        : "bg-white/[0.06] text-white/50 border-transparent hover:border-white/[0.1]"
                    }`}
                  >
                    {v.toLocaleString()}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-white/30">
                {(volume * 30).toLocaleString()} requests/month
              </p>
            </div>
          </div>

          {/* ---- Right: Results ---- */}
          <div>
            {/* Free models callout */}
            {freeModels.length > 0 && (
              <div className="mb-4 rounded-xl bg-[#7fffd4]/[0.04] border border-[#7fffd4]/10 px-4 py-3">
                <p className="text-xs text-[#7fffd4]/80">
                  <span className="font-semibold text-[#7fffd4]">
                    {freeModels.length} free model{freeModels.length > 1 ? "s" : ""}
                  </span>{" "}
                  available for this use case:{" "}
                  {freeModels.map((m) => m.name).join(", ")}
                </p>
              </div>
            )}

            {/* Results table */}
            <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider text-right">
                      Monthly
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider text-right">
                      Per Request
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ranked.map((m, i) => (
                    <tr
                      key={m.id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 text-white/30 font-mono text-xs">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-white">{m.name}</span>
                        <span className="ml-2 text-xs text-white/30">
                          {m.provider}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-white/70">
                        {formatUsd(m.monthly)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-white/50">
                        {formatMicro(m.perRequest)}
                      </td>
                    </tr>
                  ))}
                  {ranked.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-sm text-white/30"
                      >
                        No paid models available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ---- Bottom: Summary ---- */}
        {cheapest && (
          <p className="mt-6 pt-6 border-t border-white/[0.06] text-sm text-white/50">
            For{" "}
            <span className="text-white/80 font-medium">
              {volume.toLocaleString()} {useCaseLabel.toLowerCase()}
            </span>{" "}
            requests/day, the cheapest paid model is{" "}
            <span className="text-[#7fffd4] font-medium">{cheapest.name}</span>{" "}
            at{" "}
            <span className="text-white/80 font-medium">
              {formatUsd(cheapest.monthly)}/month
            </span>
            .{" "}
            {freeModels.length > 0 && (
              <span className="text-[#7fffd4]/70">
                {freeModels.length} model{freeModels.length > 1 ? "s are" : " is"} free.
              </span>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
