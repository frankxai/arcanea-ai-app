import { Metadata } from "next";
import Link from "next/link";
import {
  AI_MODELS,
  ARCANEAN_WORKFLOWS,
  MODEL_WEEKLY_UPDATES,
  getFreeModels,
  type AIModel,
  type ArcaneanWorkflow,
} from "@/lib/models-data";

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "AI Model Arena | Arcanea \u2014 Benchmarks, Rankings & Free Models",
  description:
    "Compare AI model benchmarks, SWE-Bench scores, pricing, and context windows. Discover free models on Zen routing and see how Arcanea routes models to specialized agents in production.",
  keywords: [
    "AI model benchmarks",
    "free AI models",
    "AI model comparison",
    "best AI models for coding",
    "SWE-Bench scores",
    "Claude vs GPT",
    "AI model arena",
    "LLM leaderboard",
  ],
  openGraph: {
    title: "AI Model Arena | Arcanea",
    description:
      "Live benchmarks, free model tracker, and production routing for 20+ AI models. Updated weekly.",
    type: "website",
  },
};

/* ------------------------------------------------------------------ */
/*  JSON-LD Structured Data                                            */
/* ------------------------------------------------------------------ */

function ArenaJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Model Arena",
    description: "AI model benchmarks, rankings, and free model tracker.",
    publisher: {
      "@type": "Organization",
      name: "Arcanea",
      url: "https://arcanea.ai",
    },
    dateModified: MODEL_WEEKLY_UPDATES[0]?.weekOf ?? "2026-04-04",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SectionHeading({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-10">
      <span className="inline-block text-xs font-medium tracking-widest uppercase text-[#7fffd4]/60 mb-3">
        {tag}
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-[family-name:var(--font-display)]">
        {title}
      </h2>
      <p className="mt-3 text-base text-white/50 max-w-2xl">{subtitle}</p>
    </div>
  );
}

function FreeBadge() {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#7fffd4]/10 text-[#7fffd4] border border-[#7fffd4]/20">
      FREE
    </span>
  );
}

function CategoryDot({ category }: { category: AIModel["category"] }) {
  const colors: Record<string, string> = {
    frontier: "#7fffd4",
    "free-tier": "#4ade80",
    "open-source": "#34d399",
    specialized: "#c084fc",
  };
  return (
    <span
      className="inline-block w-2 h-2 rounded-full mr-2 flex-shrink-0"
      style={{ backgroundColor: colors[category] ?? "#7fffd4" }}
    />
  );
}

function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) return `${tokens / 1_000_000}M`;
  return `${tokens / 1_000}K`;
}

function formatPrice(price: number | "free"): string {
  if (price === "free") return "Free";
  return `$${price}`;
}

/* ------------------------------------------------------------------ */
/*  Free Models Section                                                */
/* ------------------------------------------------------------------ */

function FreeModelsSection() {
  const freeModels = getFreeModels();
  const sorted = [...freeModels].sort(
    (a, b) => (b.sweBench ?? 0) - (a.sweBench ?? 0),
  );

  return (
    <section className="mb-24">
      <SectionHeading
        tag="Free This Week"
        title="Free Models on Zen"
        subtitle="These models are available at zero cost through Zen routing. No API key required. Updated weekly."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map((model) => (
          <div
            key={model.id}
            className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 hover:border-[#7fffd4]/20 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{model.providerLogo}</span>
                  <h3 className="text-sm font-semibold text-white">
                    {model.name}
                  </h3>
                </div>
                <p className="text-xs text-white/40 mt-0.5">
                  {model.provider}
                </p>
              </div>
              <FreeBadge />
            </div>
            <div className="space-y-2 text-xs text-white/50">
              <div className="flex justify-between">
                <span>Context</span>
                <span className="text-white/70">
                  {formatContext(model.contextWindow)}
                </span>
              </div>
              {model.sweBench !== null && (
                <div className="flex justify-between">
                  <span>SWE-Bench</span>
                  <span className="text-[#7fffd4] font-medium">
                    {model.sweBench}%
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Speed</span>
                <span className="text-white/70">{model.speed} tok/s</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {model.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-0.5 rounded text-[10px] text-white/40 bg-white/[0.04]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Benchmark Table                                                    */
/* ------------------------------------------------------------------ */

function BenchmarkTable() {
  const sorted = [...AI_MODELS].sort(
    (a, b) => (b.sweBench ?? 0) - (a.sweBench ?? 0),
  );

  return (
    <section className="mb-24">
      <SectionHeading
        tag="Benchmarks"
        title="Full Model Rankings"
        subtitle="Every model we track, sorted by SWE-Bench Verified score. Pricing is per million tokens."
      />
      <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
                Model
              </th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider text-right">
                Context
              </th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider text-right">
                SWE-Bench
              </th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider text-right">
                Input
              </th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider text-right">
                Output
              </th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider text-right">
                Speed
              </th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((model, i) => (
              <tr
                key={model.id}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3 text-white/30 font-mono text-xs">
                  {i + 1}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>{model.providerLogo}</span>
                    <span className="font-medium text-white">
                      {model.name}
                    </span>
                    {model.pricing.input === "free" && <FreeBadge />}
                  </div>
                </td>
                <td className="px-4 py-3 text-white/50">{model.provider}</td>
                <td className="px-4 py-3 text-white/50 text-right font-mono text-xs">
                  {formatContext(model.contextWindow)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs">
                  {model.sweBench !== null ? (
                    <span
                      className="font-medium"
                      style={{
                        color:
                          model.sweBench >= 70
                            ? "#7fffd4"
                            : model.sweBench >= 50
                              ? "#fbbf24"
                              : "#f87171",
                      }}
                    >
                      {model.sweBench}%
                    </span>
                  ) : (
                    <span className="text-white/20">--</span>
                  )}
                </td>
                <td className="px-4 py-3 text-white/50 text-right font-mono text-xs">
                  {formatPrice(model.pricing.input)}
                </td>
                <td className="px-4 py-3 text-white/50 text-right font-mono text-xs">
                  {formatPrice(model.pricing.output)}
                </td>
                <td className="px-4 py-3 text-white/50 text-right font-mono text-xs">
                  {model.speed} t/s
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <CategoryDot category={model.category} />
                    <span className="text-xs text-white/40 capitalize">
                      {model.category.replace("-", " ")}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Workflow Map                                                       */
/* ------------------------------------------------------------------ */

const WORKFLOW_CATEGORY_COLORS: Record<ArcaneanWorkflow["category"], string> = {
  orchestration: "#fde047",
  coding: "#f87171",
  review: "#c084fc",
  research: "#60a5fa",
  coordination: "#34d399",
  quick: "#fbbf24",
};

function WorkflowMap() {
  return (
    <section className="mb-24">
      <SectionHeading
        tag="Production Routing"
        title="Arcanean Workflow Map"
        subtitle="How Arcanea routes models to specialized agents in production. Each agent is assigned to an Arcanean Gate with a primary model and fallback chain."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ARCANEAN_WORKFLOWS.map((wf) => {
          const color = WORKFLOW_CATEGORY_COLORS[wf.category];
          return (
            <div
              key={wf.id}
              className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-white font-[family-name:var(--font-display)]">
                    {wf.name}
                  </h3>
                  <span className="text-[10px] text-white/30">
                    Guardian: {wf.guardian}
                  </span>
                </div>
                <span
                  className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    color,
                    backgroundColor: color + "15",
                  }}
                >
                  {wf.category}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">Gate</span>
                  <span className="text-white/70">{wf.gate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Primary Model</span>
                  <span className="text-[#7fffd4] font-medium">
                    {AI_MODELS.find((m) => m.id === wf.model)?.name ??
                      wf.model}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-white/40 flex-shrink-0">Fallbacks</span>
                  <span className="text-white/50 text-right ml-2">
                    {wf.fallbackModels
                      .map(
                        (id) => AI_MODELS.find((m) => m.id === id)?.name ?? id,
                      )
                      .join(", ")}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/40 leading-relaxed">
                {wf.rationale}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Model Deep Dives                                                   */
/* ------------------------------------------------------------------ */

function ModelDeepDives() {
  const top = [...AI_MODELS]
    .sort((a, b) => (b.sweBench ?? 0) - (a.sweBench ?? 0))
    .slice(0, 10);

  return (
    <section className="mb-24">
      <SectionHeading
        tag="Deep Dives"
        title="Model Analysis"
        subtitle="Strengths, weaknesses, and recommended use cases for the top models."
      />
      <div className="space-y-3">
        {top.map((model) => (
          <details
            key={model.id}
            className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden"
          >
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-3">
                <span className="text-lg">{model.providerLogo}</span>
                <div>
                  <span className="font-medium text-white">{model.name}</span>
                  <span className="text-xs text-white/40 ml-2">
                    {model.provider}
                  </span>
                </div>
                {model.pricing.input === "free" && (
                  <span className="ml-2">
                    <FreeBadge />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {model.sweBench !== null && (
                  <span className="text-sm font-mono text-[#7fffd4]">
                    {model.sweBench}%
                  </span>
                )}
                <svg
                  className="w-4 h-4 text-white/30 group-open:rotate-180 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </summary>
            <div className="px-5 pb-5 border-t border-white/[0.04]">
              <div className="grid sm:grid-cols-3 gap-6 pt-4">
                <div>
                  <h4 className="text-xs font-medium text-[#4ade80] uppercase tracking-wider mb-2">
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {model.strengths.map((s, i) => (
                      <li
                        key={i}
                        className="text-xs text-white/50 flex items-start gap-1.5"
                      >
                        <span className="text-[#4ade80] mt-0.5 flex-shrink-0">
                          +
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#f87171] uppercase tracking-wider mb-2">
                    Weaknesses
                  </h4>
                  <ul className="space-y-1">
                    {model.weaknesses.map((w, i) => (
                      <li
                        key={i}
                        className="text-xs text-white/50 flex items-start gap-1.5"
                      >
                        <span className="text-[#f87171] mt-0.5 flex-shrink-0">
                          -
                        </span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#78a6ff] uppercase tracking-wider mb-2">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {model.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-0.5 rounded text-[10px] text-white/40 bg-white/[0.04]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-white/40">
                    <div className="flex justify-between">
                      <span>Context</span>
                      <span className="text-white/60">
                        {formatContext(model.contextWindow)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Speed</span>
                      <span className="text-white/60">
                        {model.speed} tok/s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Released</span>
                      <span className="text-white/60">
                        {model.releaseDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Update Log                                                         */
/* ------------------------------------------------------------------ */

function UpdateLog() {
  const latest = MODEL_WEEKLY_UPDATES[0];
  if (!latest) return null;

  return (
    <section className="mb-24">
      <SectionHeading
        tag="Changelog"
        title="Weekly Update Log"
        subtitle="Track changes to the model roster, free tier availability, and routing decisions."
      />
      <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[#7fffd4]/60">
            Week of {latest.weekOf}
          </span>
        </div>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          {latest.notes}
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-white/30">
            Free models this week:
          </span>
          {latest.models.map((id) => {
            const model = AI_MODELS.find((m) => m.id === id);
            return (
              <span
                key={id}
                className="inline-block px-2 py-0.5 rounded text-[10px] text-[#7fffd4]/70 bg-[#7fffd4]/5 border border-[#7fffd4]/10"
              >
                {model?.name ?? id}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */

function ImageArenaTeaser() {
  return (
    <section className="mb-24">
      <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="inline-block text-xs font-medium tracking-widest uppercase text-[#c084fc]/60 mb-3">
              Also in the Arena
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-display)] mb-2">
              Image Generation Arena
            </h2>
            <p className="text-white/50 max-w-lg">
              Compare FLUX.2, Grok Image, DALL-E 3, Stable Diffusion, and more.
              Pricing, speed, text rendering quality, and Arcanea pipeline routing.
            </p>
          </div>
          <Link
            href="/models/image"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c084fc]/10 border border-[#c084fc]/20 text-[#c084fc] font-medium text-sm hover:bg-[#c084fc]/20 transition-all flex-shrink-0"
          >
            View Image Arena
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArenaCTA() {
  return (
    <section className="text-center py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-display)] mb-4">
        Start creating with these models
      </h2>
      <p className="text-white/50 mb-8 max-w-lg mx-auto">
        Every model in the Arena is available through Arcanea. Free models run
        on Zen routing. Premium models run through your own API keys.
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7fffd4] text-[#09090b] font-semibold text-sm hover:shadow-[0_0_30px_rgba(127,255,212,0.2)] transition-all"
        >
          Open Chat
        </Link>
        <Link
          href="/studio/image"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.1] text-white/70 font-medium text-sm hover:border-white/[0.2] hover:text-white transition-all"
        >
          Image Studio
        </Link>
        <Link
          href="/models/image"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.1] text-white/70 font-medium text-sm hover:border-white/[0.2] hover:text-white transition-all"
        >
          Image Arena
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ModelsArenaPage() {
  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      <ArenaJsonLd />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Hero */}
        <header className="text-center mb-20">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-[#7fffd4]/60 mb-4">
            Intelligence Layer
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-[family-name:var(--font-display)] mb-6">
            AI Model Arena
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Transparent model intelligence for creators. Live benchmarks, free
            model tracking, and production routing across {AI_MODELS.length}{" "}
            models from{" "}
            {new Set(AI_MODELS.map((m) => m.provider)).size} providers.
            Updated weekly.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/30">
            <span>{AI_MODELS.length} models tracked</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{getFreeModels().length} free on Zen</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>
              Last updated {MODEL_WEEKLY_UPDATES[0]?.weekOf ?? "recently"}
            </span>
          </div>
        </header>

        <FreeModelsSection />
        <BenchmarkTable />
        <WorkflowMap />
        <ModelDeepDives />
        <UpdateLog />
        <ImageArenaTeaser />
        <ArenaCTA />
      </main>
    </div>
  );
}
