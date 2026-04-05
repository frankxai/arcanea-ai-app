import { Metadata } from "next";
import {
  IMAGE_MODELS,
  getImageModels,
  type ImageModel,
} from "@/lib/models-data";
import {
  SectionHeading,
  QualityBadge,
  CategoryDot,
  formatPrice,
  ImagePipeline,
  TextRenderingSection,
  SelfHostingGuide,
  ImageArenaCTA,
} from "./image-arena-components";

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title:
    "Image Generation Arena | Arcanea \u2014 Compare AI Art Models",
  description:
    "Compare AI image generation models side by side. FLUX vs DALL-E vs Midjourney vs Gemini. Transparent pricing, text rendering quality, speed benchmarks, and style control ratings for every major image AI.",
  keywords: [
    "AI image generation comparison",
    "best AI art models",
    "FLUX vs DALL-E vs Midjourney",
    "AI image model pricing",
    "text rendering AI images",
    "AI art generator comparison",
    "image generation API",
    "Stable Diffusion vs FLUX",
  ],
  openGraph: {
    title: "Image Generation Arena | Arcanea",
    description:
      "Transparent comparison of 8 image generation models. Pricing, speed, text rendering, and style control rated side by side.",
    type: "website",
  },
};

/* ------------------------------------------------------------------ */
/*  JSON-LD                                                            */
/* ------------------------------------------------------------------ */

function ImageArenaJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Image Generation Arena",
    description:
      "AI image generation model comparison with pricing, benchmarks, and quality ratings.",
    publisher: {
      "@type": "Organization",
      name: "Arcanea",
      url: "https://arcanea.ai",
    },
    dateModified: "2026-04-04",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Provider Comparison Grid                                           */
/* ------------------------------------------------------------------ */

function ProviderGrid() {
  const models = getImageModels();

  return (
    <section className="mb-24">
      <SectionHeading
        tag="Model Comparison"
        title="Image Generation Models"
        subtitle="Every model we track, with transparent pricing, speed, and quality ratings. No affiliate links, no bias."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {models.map((model) => (
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
              <span className="text-xs font-mono text-[#7fffd4]">
                {formatPrice(model.pricing.perImage)}
              </span>
            </div>

            <div className="space-y-2 text-xs text-white/50">
              <div className="flex justify-between">
                <span>Max Resolution</span>
                <span className="text-white/70">{model.maxResolution}</span>
              </div>
              <div className="flex justify-between">
                <span>Speed</span>
                <span className="text-white/70">~{model.speed}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Text Rendering</span>
                <QualityBadge level={model.textRendering} />
              </div>
              <div className="flex justify-between items-center">
                <span>Style Control</span>
                <QualityBadge level={model.styleControl} />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {model.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-0.5 rounded text-[10px] text-white/40 bg-white/[0.04]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {!model.apiAvailable && (
              <div className="mt-2">
                <span className="text-[10px] text-white/30 uppercase tracking-wider">
                  No direct API
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Comparison Table                                                   */
/* ------------------------------------------------------------------ */

function ComparisonTable() {
  const models = [...IMAGE_MODELS].sort((a, b) => {
    const scoreA =
      (a.textRendering === "excellent" ? 3 : a.textRendering === "good" ? 2 : 1) +
      (a.styleControl === "excellent" ? 3 : a.styleControl === "good" ? 2 : 1) +
      (10 - a.speed) * 0.3;
    const scoreB =
      (b.textRendering === "excellent" ? 3 : b.textRendering === "good" ? 2 : 1) +
      (b.styleControl === "excellent" ? 3 : b.styleControl === "good" ? 2 : 1) +
      (10 - b.speed) * 0.3;
    return scoreB - scoreA;
  });

  return (
    <section className="mb-24">
      <SectionHeading
        tag="Full Specs"
        title="Side-by-Side Comparison"
        subtitle="All models ranked by a composite of text rendering, style control, and speed. Scroll horizontally on mobile."
      />
      <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
        <table className="w-full text-sm text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              {["#", "Model", "Provider", "Resolution", "Price", "Speed", "Text", "Style", "API", "Category"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {models.map((model, i) => (
              <tr
                key={model.id}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3 text-white/30 font-mono text-xs">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>{model.providerLogo}</span>
                    <span className="font-medium text-white">{model.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-white/50">{model.provider}</td>
                <td className="px-4 py-3 text-white/50 font-mono text-xs">{model.maxResolution}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#7fffd4]">{formatPrice(model.pricing.perImage)}</td>
                <td className="px-4 py-3 text-white/50 font-mono text-xs">{model.speed}s</td>
                <td className="px-4 py-3"><QualityBadge level={model.textRendering} /></td>
                <td className="px-4 py-3"><QualityBadge level={model.styleControl} /></td>
                <td className="px-4 py-3 text-xs text-white/40">{model.apiAvailable ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <CategoryDot category={model.category} />
                    <span className="text-xs text-white/40 capitalize">{model.category.replace("-", " ")}</span>
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

export default function ImageArenaPage() {
  const models = getImageModels();
  const providers = new Set(models.map((m) => m.provider));

  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      <ImageArenaJsonLd />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Hero */}
        <header className="text-center mb-20">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-[#7fffd4]/60 mb-4">
            Visual Intelligence
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-[family-name:var(--font-display)] mb-6">
            Image Generation Arena
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Transparent comparison of every major image generation model.
            Pricing, speed, text rendering quality, and style control rated
            without bias for creators who need to choose the right tool.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/30">
            <span>{models.length} models tracked</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{providers.size} providers</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Updated April 2026</span>
          </div>
        </header>

        <ProviderGrid />
        <ComparisonTable />
        <ImagePipeline />
        <TextRenderingSection />
        <SelfHostingGuide />
        <ImageArenaCTA />
      </main>
    </div>
  );
}
