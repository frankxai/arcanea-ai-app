import { Metadata } from "next";
import Link from "next/link";
import {
  IMAGE_MODELS,
  getImageModels,
  type ImageModel,
} from "@/lib/models-data";

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
/*  Helpers                                                            */
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

const QUALITY_COLORS: Record<string, string> = {
  excellent: "#4ade80",
  good: "#fbbf24",
  poor: "#f87171",
  limited: "#fbbf24",
  none: "#6b7280",
};

function QualityBadge({ level }: { level: string }) {
  const color = QUALITY_COLORS[level] ?? "#7fffd4";
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider"
      style={{ color, backgroundColor: color + "15" }}
    >
      {level}
    </span>
  );
}

function CategoryDot({ category }: { category: ImageModel["category"] }) {
  const colors: Record<string, string> = {
    frontier: "#7fffd4",
    "open-source": "#34d399",
    "free-tier": "#4ade80",
    specialized: "#c084fc",
  };
  return (
    <span
      className="inline-block w-2 h-2 rounded-full mr-2 flex-shrink-0"
      style={{ backgroundColor: colors[category] ?? "#7fffd4" }}
    />
  );
}

function formatPrice(price: number | "free"): string {
  if (price === "free") return "Free";
  return `$${price}`;
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
                <td className="px-4 py-3 text-white/30 font-mono text-xs">
                  {i + 1}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>{model.providerLogo}</span>
                    <span className="font-medium text-white">
                      {model.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-white/50">{model.provider}</td>
                <td className="px-4 py-3 text-white/50 font-mono text-xs">
                  {model.maxResolution}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[#7fffd4]">
                  {formatPrice(model.pricing.perImage)}
                </td>
                <td className="px-4 py-3 text-white/50 font-mono text-xs">
                  {model.speed}s
                </td>
                <td className="px-4 py-3">
                  <QualityBadge level={model.textRendering} />
                </td>
                <td className="px-4 py-3">
                  <QualityBadge level={model.styleControl} />
                </td>
                <td className="px-4 py-3 text-xs text-white/40">
                  {model.apiAvailable ? "Yes" : "No"}
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
/*  Arcanea Image Pipeline                                             */
/* ------------------------------------------------------------------ */

const PIPELINE_STEPS = [
  {
    role: "Primary",
    modelId: "grok-2-image",
    label: "Grok 2 Image",
    reason: "Fast (4s), affordable ($0.02), good general quality. Handles 80% of image requests.",
    color: "#7fffd4",
  },
  {
    role: "Premium",
    modelId: "flux-2-max",
    label: "FLUX.2 Max via OpenRouter",
    reason: "Highest quality output. Used for hero images, marketing assets, and text-in-image needs.",
    color: "#fde047",
  },
  {
    role: "Fallback",
    modelId: "gemini-image",
    label: "Gemini Image",
    reason: "Cheapest option ($0.02), fastest (3s). Catches overflow when primary is rate-limited.",
    color: "#60a5fa",
  },
];

function ImagePipeline() {
  return (
    <section className="mb-24">
      <SectionHeading
        tag="Production Routing"
        title="Arcanea Image Pipeline"
        subtitle="How Arcanea routes image generation requests. Priority chain from models.yaml: grok > openrouter > gemini."
      />
      <div className="grid sm:grid-cols-3 gap-4">
        {PIPELINE_STEPS.map((step, i) => (
          <div
            key={step.role}
            className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold"
                style={{
                  color: step.color,
                  backgroundColor: step.color + "15",
                }}
              >
                {i + 1}
              </span>
              <div>
                <span
                  className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: step.color }}
                >
                  {step.role}
                </span>
                <h3 className="text-base font-semibold text-white font-[family-name:var(--font-display)]">
                  {step.label}
                </h3>
              </div>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              {step.reason}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/30">
        <span>Priority chain:</span>
        {PIPELINE_STEPS.map((step, i) => (
          <span key={step.role} className="flex items-center gap-2">
            <span className="text-white/50">{step.label.split(" via")[0]}</span>
            {i < PIPELINE_STEPS.length - 1 && (
              <span className="text-white/20">&rarr;</span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Text Rendering Comparison                                          */
/* ------------------------------------------------------------------ */

const TEXT_RENDERING_RANKING = [
  { id: "ideogram-2", rank: 1, note: "Purpose-built for typography. Near-perfect text accuracy." },
  { id: "flux-2-max", rank: 2, note: "Best text rendering among general-purpose models." },
  { id: "dall-e-3", rank: 3, note: "Reliable text, especially with clear prompt structure." },
  { id: "gemini-image", rank: 4, note: "Decent text for short words and simple compositions." },
  { id: "grok-2-image", rank: 5, note: "Handles basic text but struggles with longer strings." },
  { id: "sd-3.5-large", rank: 6, note: "Improved over SD 2.x but still inconsistent." },
  { id: "imagen-3", rank: 7, note: "Good for short labels, less reliable for sentences." },
  { id: "midjourney-v7", rank: 8, note: "Avoid for text-heavy compositions. Artistic strength lies elsewhere." },
];

function TextRenderingSection() {
  return (
    <section className="mb-24">
      <SectionHeading
        tag="Text in Images"
        title="Text Rendering Comparison"
        subtitle="Generating readable text inside images is one of the hardest challenges in image AI. Here is how every model ranks for typography accuracy."
      />
      <div className="space-y-2">
        {TEXT_RENDERING_RANKING.map((entry) => {
          const model = IMAGE_MODELS.find((m) => m.id === entry.id);
          if (!model) return null;
          return (
            <div
              key={entry.id}
              className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-3"
            >
              <span className="text-lg font-bold font-mono text-white/20 w-8 text-center flex-shrink-0">
                {entry.rank}
              </span>
              <span className="text-lg flex-shrink-0">{model.providerLogo}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    {model.name}
                  </span>
                  <QualityBadge level={model.textRendering} />
                </div>
                <p className="text-xs text-white/40 mt-0.5 truncate">
                  {entry.note}
                </p>
              </div>
              <span className="text-xs font-mono text-white/30 flex-shrink-0">
                {formatPrice(model.pricing.perImage)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Self-Hosting Guide                                                 */
/* ------------------------------------------------------------------ */

function SelfHostingGuide() {
  return (
    <section className="mb-24">
      <SectionHeading
        tag="Self-Hosting"
        title="Run Image Generation Locally"
        subtitle="Stable Diffusion 3.5 Large is fully open-source. With a decent GPU you can generate unlimited images at zero marginal cost."
      />
      <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 font-[family-name:var(--font-display)]">
              Requirements
            </h3>
            <ul className="space-y-2 text-xs text-white/50">
              <li className="flex items-start gap-2">
                <span className="text-[#7fffd4] mt-0.5 flex-shrink-0">+</span>
                GPU with 12GB+ VRAM (NVIDIA RTX 3060 or better)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7fffd4] mt-0.5 flex-shrink-0">+</span>
                16GB system RAM minimum, 32GB recommended
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7fffd4] mt-0.5 flex-shrink-0">+</span>
                Python 3.10+ with PyTorch and CUDA
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7fffd4] mt-0.5 flex-shrink-0">+</span>
                ~10GB disk space for model weights
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 font-[family-name:var(--font-display)]">
              Recommended Stack
            </h3>
            <ul className="space-y-2 text-xs text-white/50">
              <li className="flex items-start gap-2">
                <span className="text-[#78a6ff] mt-0.5 flex-shrink-0">1.</span>
                <span>
                  <span className="text-white/70">ComfyUI</span> -- Node-based
                  workflow editor. The most flexible local generation UI.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#78a6ff] mt-0.5 flex-shrink-0">2.</span>
                <span>
                  <span className="text-white/70">SD 3.5 Large</span> -- Best
                  open-source base model. Download from Hugging Face.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#78a6ff] mt-0.5 flex-shrink-0">3.</span>
                <span>
                  <span className="text-white/70">ComfyUI MCP</span> -- Connect
                  ComfyUI to AI agents for programmatic generation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#78a6ff] mt-0.5 flex-shrink-0">4.</span>
                <span>
                  <span className="text-white/70">LoRA fine-tunes</span> -- Add
                  specialized styles from CivitAI or train your own.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */

function ImageArenaCTA() {
  return (
    <section className="text-center py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-display)] mb-4">
        Generate images with these models
      </h2>
      <p className="text-white/50 mb-8 max-w-lg mx-auto">
        Arcanea routes to the best model for each request. Fast generation with
        Grok, premium quality with FLUX, and fallback through Gemini.
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Link
          href="/studio/image"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7fffd4] text-[#09090b] font-semibold text-sm hover:shadow-[0_0_30px_rgba(127,255,212,0.2)] transition-all"
        >
          Open Image Studio
        </Link>
        <Link
          href="/models"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.1] text-white/70 font-medium text-sm hover:border-white/[0.2] hover:text-white transition-all"
        >
          Back to Model Arena
        </Link>
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
