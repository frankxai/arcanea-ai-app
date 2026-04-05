import { Metadata } from "next";
import {
  AI_MODELS,
  MODEL_WEEKLY_UPDATES,
  getFreeModels,
  type AIModel,
} from "@/lib/models-data";
import {
  SectionHeading,
  FreeBadge,
  formatContext,
  formatPrice,
  WorkflowMap,
  ModelDeepDives,
  UpdateLog,
  ImageArenaTeaser,
  ArenaCTA,
} from "./models-arena-components";

export const revalidate = 3600;

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
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Model</th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Provider</th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider text-right">Context</th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider text-right">SWE-Bench</th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider text-right">Input</th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider text-right">Output</th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider text-right">Speed</th>
              <th className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Category</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((model, i) => (
              <tr
                key={model.id}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3 text-white/30 font-mono text-xs">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>{model.providerLogo}</span>
                    <span className="font-medium text-white">{model.name}</span>
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
