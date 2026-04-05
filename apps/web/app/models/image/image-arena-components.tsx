import Link from "next/link";
import { IMAGE_MODELS, type ImageModel } from "@/lib/models-data";
import { PIPELINE_STEPS, TEXT_RENDERING_RANKING } from "./image-arena-data";

/* ------------------------------------------------------------------ */
/*  Shared Helpers                                                     */
/* ------------------------------------------------------------------ */

export function SectionHeading({
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

export function QualityBadge({ level }: { level: string }) {
  const QUALITY_COLORS: Record<string, string> = {
    excellent: "#4ade80",
    good: "#fbbf24",
    poor: "#f87171",
    limited: "#fbbf24",
    none: "#6b7280",
  };
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

export function CategoryDot({ category }: { category: ImageModel["category"] }) {
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

export function formatPrice(price: number | "free"): string {
  if (price === "free") return "Free";
  return `$${price}`;
}

/* ------------------------------------------------------------------ */
/*  Image Pipeline                                                     */
/* ------------------------------------------------------------------ */

export function ImagePipeline() {
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
/*  Text Rendering Section                                             */
/* ------------------------------------------------------------------ */

export function TextRenderingSection() {
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

export function SelfHostingGuide() {
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

export function ImageArenaCTA() {
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
