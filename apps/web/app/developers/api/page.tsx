import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Intelligence Gateway API",
  description:
    "26 curated AI models from 13 providers through one OpenAI-compatible API. Claude Opus 4.6, GPT-5.2, Gemini 3.1, Grok 4.20, Flux 2, Veo 3.1, Sora 2 — only the best.",
};

// ─── Model data — Verified March 2026 ───────────────────────────────

const FRONTIER_MODELS = [
  { id: "arcanea-opus", name: "Opus", provider: "Anthropic", model: "Claude Opus 4.6", ctx: "200K", speed: "~70 tok/s", price: "$5 / $25", note: "#1 coding (80.8% SWE-bench). #1 human preference (1606 Elo).", color: "#a855f7" },
  { id: "arcanea-sonnet", name: "Sonnet", provider: "Anthropic", model: "Claude Sonnet 4.6", ctx: "200K", speed: "~120 tok/s", price: "$3 / $15", note: "79.6% SWE-bench. Best value frontier model.", color: "#0d47a1" },
  { id: "arcanea-gpt5", name: "GPT-5", provider: "OpenAI", model: "GPT-5.2 Pro", ctx: "400K", speed: "~85 tok/s", price: "$1.75 / $14", note: "100% AIME 2025 (no tools). 80% SWE-bench. #1 math.", color: "#10b981" },
  { id: "arcanea-gemini-pro", name: "Gemini Pro", provider: "Google", model: "Gemini 3.1 Pro Preview", ctx: "1M", speed: "~90 tok/s", price: "$2 / $12", note: "77.1% ARC-AGI-2 — leads 13 of 16 benchmarks. #1 raw reasoning.", color: "#3b82f6" },
  { id: "arcanea-grok", name: "Grok", provider: "xAI", model: "Grok 4.20", ctx: "256K", speed: "TBD", price: "$3 / $15", note: "500B params, 4-agent system. Real-time X knowledge. Wild card.", color: "#ef4444" },
  { id: "arcanea-deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek", model: "DeepSeek R1", ctx: "128K", speed: "~40 tok/s", price: "$0.55 / $2.19", note: "Transparent chain-of-thought. See the reasoning, not just the answer.", color: "#06b6d4" },
  { id: "arcanea-kimi", name: "Kimi", provider: "Moonshot", model: "Kimi K2.5", ctx: "128K", speed: "~50 tok/s", price: "$0.60 / $2.50", note: "1T params, 100 sub-agents, 1,500 tool calls. Open-weight agentic champion.", color: "#f97316" },
  { id: "arcanea-deepseek", name: "DeepSeek V3", provider: "DeepSeek", model: "DeepSeek V3.2", ctx: "128K", speed: "~60 tok/s", price: "$0.27 / $1.10", note: "66% SWE-bench at $0.27/M input. 50-100x cheaper than frontier. THE disruptor.", color: "#22d3ee" },
];

const PERFORMANCE_MODELS = [
  { id: "arcanea-haiku", name: "Haiku", provider: "Anthropic", model: "Claude Haiku 4.5", ctx: "200K", speed: "~200 tok/s", price: "$0.80 / $4", note: "Best speed/intelligence ratio from Anthropic.", color: "#c084fc" },
  { id: "arcanea-gemini-flash", name: "Flash", provider: "Google", model: "Gemini 2.5 Flash", ctx: "1M", speed: "~180 tok/s", price: "$0.15 / $0.60", note: "1M context + native image gen. $0.15/M input. Absurd value.", color: "#60a5fa" },
  { id: "arcanea-maverick", name: "Maverick", provider: "Groq", model: "Llama 4 Maverick", ctx: "128K", speed: "562 tok/s", price: "$0.20 / $0.60", note: "128 experts, 400B active params. Open-source frontier on Groq.", color: "#fb923c" },
  { id: "arcanea-mistral", name: "Mistral", provider: "Mistral", model: "Mistral Large 3", ctx: "128K", speed: "~100 tok/s", price: "$0.50 / $1.50", note: "EU data sovereignty. GDPR-first. Strong structured output.", color: "#f43f5e" },
];

const SPEED_MODELS = [
  { id: "arcanea-bolt", name: "Bolt", provider: "Cerebras", model: "Llama 3.1 8B", ctx: "128K", speed: "2,200+ tok/s", price: "$0.10", note: "Fastest model in the world. Cerebras CS-3.", color: "#f59e0b" },
  { id: "arcanea-thunder", name: "Thunder", provider: "Cerebras", model: "Llama 3.3 70B", ctx: "128K", speed: "450 tok/s", price: "$0.60", note: "70B intelligence at impossible speed.", color: "#0d47a1" },
  { id: "arcanea-lightning", name: "Lightning", provider: "Groq", model: "Llama 3.1 8B", ctx: "128K", speed: "750 tok/s", price: "$0.05", note: "Lowest time-to-first-token. $0.05/M input.", color: "#00bcd4" },
  { id: "arcanea-qwen", name: "Qwen", provider: "Cerebras", model: "Qwen 3 235B", ctx: "131K", speed: "1,400 tok/s", price: "$0.60 / $1.20", note: "235B params at 1,400 tok/s. Enterprise reasoning at speed.", color: "#ec4899" },
];

const IMAGE_MODELS = [
  { id: "arcanea-flux-pro", name: "Flux 2 Pro", provider: "Replicate", note: "#1 photorealism. Camera-accurate optics. $0.055/image.", color: "#a855f7" },
  { id: "arcanea-dalle", name: "DALL-E 3", provider: "OpenAI", note: "#1 prompt comprehension. Complex multi-element scenes.", color: "#10b981" },
  { id: "arcanea-imagen", name: "Imagen 4", provider: "Google", note: "#1 text rendering. Perfect typography in images.", color: "#3b82f6" },
  { id: "arcanea-ideogram", name: "Ideogram V3", provider: "Replicate", note: "#1 logos and typography. Design-grade brand assets.", color: "#f97316" },
  { id: "arcanea-recraft", name: "Recraft V3", provider: "Replicate", note: "Only AI that outputs editable SVG vectors.", color: "#ef4444" },
];

const VIDEO_MODELS = [
  { id: "arcanea-veo", name: "Veo 3.1", provider: "Google", note: "#1 realism. Film-grade lighting + native audio. $0.15-$0.75/sec.", color: "#3b82f6" },
  { id: "arcanea-sora", name: "Sora 2", provider: "OpenAI", note: "#1 storytelling. Emotional depth, 60s videos + audio.", color: "#10b981" },
  { id: "arcanea-kling", name: "Kling 2.6", provider: "Replicate", note: "Best value. $0.05/sec. Production-grade at scale.", color: "#f97316" },
];

const PROVIDERS_LIST = [
  { name: "Anthropic", models: "Claude Opus/Sonnet/Haiku", color: "#a855f7" },
  { name: "OpenAI", models: "GPT-5.2, DALL-E 3, Sora 2", color: "#10b981" },
  { name: "Google", models: "Gemini 3.1, Imagen 4, Veo 3.1", color: "#3b82f6" },
  { name: "xAI", models: "Grok 4.20", color: "#ef4444" },
  { name: "Groq", models: "LPU inference, Whisper", color: "#f97316" },
  { name: "Cerebras", models: "CS-3 ultra-fast inference", color: "#f59e0b" },
  { name: "SambaNova", models: "RDU fast inference", color: "#06b6d4" },
  { name: "Replicate", models: "Flux 2, Kling, Recraft", color: "#ec4899" },
  { name: "Together AI", models: "Open-source models", color: "#0d47a1" },
  { name: "DeepSeek", models: "DeepSeek R1/V3.2", color: "#00bcd4" },
  { name: "Moonshot", models: "Kimi K2.5 (1T MoE)", color: "#ffd700" },
  { name: "Mistral", models: "Mistral Large (EU)", color: "#f43f5e" },
  { name: "OpenRouter", models: "500+ model fallback", color: "#a3a3a3" },
];

// ─── Code Examples ───────────────────────────────────────────────────

const CODE_CURL = `curl https://arcanea.ai/api/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "X-Anthropic-Key: sk-ant-your-key" \\
  -d '{
    "model": "arcanea-opus",
    "messages": [{"role": "user", "content": "Hello"}],
    "stream": true
  }'`;

const CODE_PYTHON = `from openai import OpenAI

client = OpenAI(
    base_url="https://arcanea.ai/api/v1",
    api_key="your-provider-key",
    default_headers={"X-Anthropic-Key": "sk-ant-xxx"}
)

response = client.chat.completions.create(
    model="arcanea-auto",  # Smart routing picks best model
    messages=[{"role": "user", "content": "Hello"}]
)`;

const CODE_TYPESCRIPT = `import { createArcanea } from '@arcanea/ai-provider';
import { generateText } from 'ai';

const arcanea = createArcanea({
  baseURL: 'https://arcanea.ai/api/v1',
  headers: {
    'X-Anthropic-Key': process.env.ANTHROPIC_API_KEY!,
    'X-Groq-Key': process.env.GROQ_API_KEY!,
  },
});

const { text } = await generateText({
  model: arcanea('arcanea-auto'),
  prompt: 'Write a creation myth',
});`;

const CODE_LOBECHAT = `# In LobeChat Settings > AI Provider > Add Custom:

Provider Name: Arcanea Intelligence Gateway
Base URL:      https://arcanea.ai/api/v1
API Key:       your-provider-key

# Models are auto-discovered via /v1/models`;

// ─── Component ───────────────────────────────────────────────────────

function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <div className="relative group">
      <div className="absolute top-3 right-3 text-[10px] font-mono text-text-muted uppercase tracking-widest">
        {language}
      </div>
      <pre className="bg-[#0d1117] border border-white/[0.06] rounded-xl p-5 overflow-x-auto text-sm leading-relaxed">
        <code className="text-[#e6edf3] font-mono">{code}</code>
      </pre>
    </div>
  );
}

function ModelRow({ m }: { m: { id: string; name: string; provider: string; model: string; ctx: string; speed: string; price: string; note: string; color: string } }) {
  return (
    <div className="liquid-glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-3 sm:w-56">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
        <div>
          <div className="font-mono text-sm text-text-primary">{m.id}</div>
          <div className="text-[10px] text-text-muted">{m.provider} &middot; {m.model}</div>
        </div>
      </div>
      <div className="flex-1 text-xs text-text-secondary">{m.note}</div>
      <div className="flex gap-4 text-xs font-mono text-text-muted shrink-0">
        <span>{m.ctx} ctx</span>
        <span className="text-crystal">{m.speed}</span>
        <span>{m.price}/M tok</span>
      </div>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(13,71,161,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,188,212,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Hero */}
        <section className="mb-16">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-12 sm:px-12 sm:py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-crystal/10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-crystal/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-crystal/30 bg-crystal/10 mb-6">
                <span className="text-xs font-mono tracking-widest uppercase text-crystal">
                  Intelligence Gateway
                </span>
              </div>

              <h1 className="text-fluid-3xl font-display font-bold mb-4">
                One API.
                <span className="block text-gradient-brand">26 Curated Models.</span>
              </h1>

              <p className="text-text-secondary font-body text-lg leading-relaxed mb-4 max-w-2xl">
                The Arcanea Intelligence Gateway gives you access to the absolute best AI models
                across 13 providers through a single OpenAI-compatible endpoint. Bring your own
                API keys. Smart routing picks the best model for every task.
              </p>

              <p className="text-sm text-text-muted mb-6 max-w-2xl">
                Every model verified against March 2026 benchmarks: ARC-AGI-2, AIME 2025, SWE-bench, GPQA Diamond, Terminal-Bench 2.0.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {["OpenAI Compatible", "13 Providers", "Smart Routing", "BYOK", "Streaming", "Text + Image + Video + Audio"].map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-text-secondary font-mono">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="#quickstart"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  Get Started
                </Link>
                <Link
                  href="#models"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                >
                  View Models
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Arcanea — Differentiators */}
        <section className="mb-16">
          <h2 className="text-xs font-mono tracking-[0.35em] uppercase text-crystal mb-2">Why Arcanea</h2>
          <h3 className="text-fluid-2xl font-display font-bold mb-8">We tested hundreds. You get the 26 best.</h3>

          <div className="grid md:grid-cols-3 gap-5 mb-6">
            {[
              { title: "Curated, Not Aggregated", desc: "26 hand-picked models. Each is #1 at something specific. We benchmark, verify, and update monthly. No filler, no mediocre models.", color: "#0d47a1" },
              { title: "Smart Routing", desc: "Use \"arcanea-auto\" — our task classifier detects reasoning, code, creative, vision, image/video gen and routes to the optimal model automatically.", color: "#00bcd4" },
              { title: "BYOK — Zero Markup", desc: "Bring Your Own Keys. You pay providers directly at their prices. Arcanea adds routing intelligence, not cost. Your keys, your data, your control.", color: "#ffd700" },
            ].map((item) => (
              <div key={item.title} className="liquid-glass rounded-2xl p-6">
                <div className="w-2 h-2 rounded-full mb-4" style={{ backgroundColor: item.color }} />
                <h4 className="font-display font-semibold text-text-primary mb-2">{item.title}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "Works With Everything", desc: "OpenAI-compatible = works with LobeChat, Cursor, Continue.dev, LangChain, CrewAI, AutoGen, Vercel AI SDK, and 30+ tools. One config change.", color: "#3b82f6" },
              { title: "Text + Image + Video + Audio", desc: "Not just chat. Generate images with Flux 2 Pro, videos with Veo 3.1 and Sora 2, transcribe audio with Whisper. All through one gateway.", color: "#ef4444" },
              { title: "Speed When You Need It", desc: "Cerebras CS-3 at 2,200+ tok/s. Groq LPU at 750 tok/s. Route simple tasks to speed demons, complex tasks to frontier models. Automatically.", color: "#f59e0b" },
            ].map((item) => (
              <div key={item.title} className="liquid-glass rounded-2xl p-6">
                <div className="w-2 h-2 rounded-full mb-4" style={{ backgroundColor: item.color }} />
                <h4 className="font-display font-semibold text-text-primary mb-2">{item.title}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Start */}
        <section id="quickstart" className="mb-16 scroll-mt-8">
          <h2 className="text-xs font-mono tracking-[0.35em] uppercase text-brand-gold mb-2">Quick Start</h2>
          <h3 className="text-fluid-2xl font-display font-bold mb-8">Three ways to connect</h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-display font-semibold text-text-primary mb-3">cURL (works everywhere)</h4>
              <CodeBlock code={CODE_CURL} language="bash" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-text-primary mb-3">Python (OpenAI SDK)</h4>
              <CodeBlock code={CODE_PYTHON} language="python" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-text-primary mb-3">TypeScript (Vercel AI SDK)</h4>
              <CodeBlock code={CODE_TYPESCRIPT} language="typescript" />
              <p className="text-xs text-text-muted mt-2 font-mono">npm install @arcanea/ai-provider ai</p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-text-primary mb-3">LobeChat / Open WebUI / Any Tool</h4>
              <CodeBlock code={CODE_LOBECHAT} language="config" />
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-16">
          <div className="liquid-glass rounded-2xl p-6">
            <h3 className="font-display font-semibold text-text-primary mb-4">API Reference</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <span className="text-xs font-mono bg-green-500/20 text-green-400 px-2 py-1 rounded">POST</span>
                <div>
                  <code className="text-sm text-crystal font-mono">/api/v1/chat/completions</code>
                  <p className="text-xs text-text-muted mt-1">Chat completions (streaming + non-streaming)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2 py-1 rounded">GET</span>
                <div>
                  <code className="text-sm text-crystal font-mono">/api/v1/models</code>
                  <p className="text-xs text-text-muted mt-1">List curated model catalog (OpenAI-compatible format)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2 py-1 rounded">POST</span>
                <div>
                  <code className="text-sm text-crystal font-mono">/api/v1/models</code>
                  <span className="text-[10px] ml-2 text-text-muted">{`{ "extended": true }`}</span>
                  <p className="text-xs text-text-muted mt-1">Full catalog with pricing, speeds, benchmarks, and curator notes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Auth */}
        <section className="mb-16">
          <h2 className="text-xs font-mono tracking-[0.35em] uppercase text-brand-primary mb-2">Authentication</h2>
          <h3 className="text-fluid-xl font-display font-bold mb-6">Bring Your Own Keys (BYOK)</h3>

          <div className="liquid-glass rounded-2xl p-6 mb-6">
            <p className="text-sm text-text-secondary mb-4">Pass provider API keys via headers. The gateway routes to the provider and never stores your keys.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-2 pr-4 text-text-muted font-mono text-xs">Header</th>
                    <th className="text-left py-2 pr-4 text-text-muted font-mono text-xs">Provider</th>
                    <th className="text-left py-2 text-text-muted font-mono text-xs">Models Unlocked</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {[
                    ["X-Anthropic-Key", "Anthropic", "arcanea-opus, arcanea-sonnet, arcanea-haiku"],
                    ["X-OpenAI-Key", "OpenAI", "arcanea-gpt5, arcanea-dalle, arcanea-sora"],
                    ["X-Google-Key", "Google", "arcanea-gemini-pro, arcanea-gemini-flash, arcanea-imagen, arcanea-veo"],
                    ["X-XAI-Key", "xAI", "arcanea-grok"],
                    ["X-Groq-Key", "Groq", "arcanea-maverick, arcanea-lightning, arcanea-whisper"],
                    ["X-Cerebras-Key", "Cerebras", "arcanea-bolt, arcanea-thunder, arcanea-qwen"],
                    ["X-SambaNova-Key", "SambaNova", "Fast open-source models"],
                    ["X-Replicate-Key", "Replicate", "arcanea-flux-pro, arcanea-ideogram, arcanea-recraft, arcanea-kling"],
                    ["X-DeepSeek-Key", "DeepSeek", "arcanea-deepseek, arcanea-deepseek-r1"],
                    ["X-Moonshot-Key", "Moonshot", "arcanea-kimi"],
                    ["X-Mistral-Key", "Mistral", "arcanea-mistral"],
                  ].map(([header, provider, models]) => (
                    <tr key={header} className="border-b border-white/[0.03]">
                      <td className="py-2.5 pr-4 text-crystal">{header}</td>
                      <td className="py-2.5 pr-4 text-text-primary">{provider}</td>
                      <td className="py-2.5 text-text-muted">{models}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-6">
            <h4 className="font-display font-semibold text-text-primary mb-3">Auto-Detection</h4>
            <p className="text-sm text-text-secondary mb-3">
              You can also pass a single Bearer token. The gateway auto-detects the provider by key prefix:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              {[
                ["sk-ant-*", "Anthropic"],
                ["sk-*", "OpenAI"],
                ["gsk_*", "Groq"],
                ["xai-*", "xAI"],
              ].map(([prefix, provider]) => (
                <div key={prefix} className="bg-white/[0.03] rounded-lg p-3 text-center">
                  <div className="text-crystal">{prefix}</div>
                  <div className="text-text-muted mt-1">{provider}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Models — Frontier */}
        <section id="models" className="mb-12 scroll-mt-8">
          <h2 className="text-xs font-mono tracking-[0.35em] uppercase text-crystal mb-2">Curated Catalog</h2>
          <h3 className="text-fluid-2xl font-display font-bold mb-2">Frontier Reasoning</h3>
          <p className="text-sm text-text-muted mb-6">The 8 most intelligent models alive. Verified against March 2026 benchmarks.</p>

          <div className="space-y-3">
            {FRONTIER_MODELS.map((m) => (
              <ModelRow key={m.id} m={m} />
            ))}
          </div>
        </section>

        {/* Models — Performance */}
        <section className="mb-12">
          <h3 className="text-fluid-xl font-display font-bold mb-2">Performance</h3>
          <p className="text-sm text-text-muted mb-6">Smart AND fast. The workhorses for production applications.</p>

          <div className="space-y-3">
            {PERFORMANCE_MODELS.map((m) => (
              <ModelRow key={m.id} m={m} />
            ))}
          </div>
        </section>

        {/* Models — Speed */}
        <section className="mb-12">
          <h3 className="text-fluid-xl font-display font-bold mb-2">Speed Demons</h3>
          <p className="text-sm text-text-muted mb-6">Custom silicon inference. Cerebras CS-3 and Groq LPU. When milliseconds matter.</p>

          <div className="space-y-3">
            {SPEED_MODELS.map((m) => (
              <ModelRow key={m.id} m={m} />
            ))}
          </div>
        </section>

        {/* Models — Image */}
        <section className="mb-12">
          <h3 className="text-fluid-xl font-display font-bold mb-2">Image Generation</h3>
          <p className="text-sm text-text-muted mb-6">Only the best visual AI. Each model is #1 at something specific.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {IMAGE_MODELS.map((m) => (
              <div key={m.id} className="liquid-glass rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="font-mono text-sm text-text-primary">{m.id}</span>
                </div>
                <div className="text-[10px] text-text-muted font-mono mb-2">{m.provider}</div>
                <p className="text-xs text-text-secondary">{m.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Models — Video */}
        <section className="mb-12">
          <h3 className="text-fluid-xl font-display font-bold mb-2">Video Generation</h3>
          <p className="text-sm text-text-muted mb-6">Film-grade video AI. All three support native audio generation (new in 2026).</p>

          <div className="grid sm:grid-cols-3 gap-4">
            {VIDEO_MODELS.map((m) => (
              <div key={m.id} className="liquid-glass rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="font-mono text-sm text-text-primary">{m.id}</span>
                </div>
                <div className="text-[10px] text-text-muted font-mono mb-2">{m.provider}</div>
                <p className="text-xs text-text-secondary">{m.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Audio */}
        <section className="mb-12">
          <h3 className="text-fluid-xl font-display font-bold mb-2">Audio</h3>
          <div className="liquid-glass rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="font-mono text-sm text-text-primary">arcanea-whisper</span>
            </div>
            <div className="text-[10px] text-text-muted font-mono mb-2">Groq &middot; Whisper V3 Turbo</div>
            <p className="text-xs text-text-secondary">217x realtime speech-to-text on Groq LPU. Transcribe 1 hour in 17 seconds. $0.111/min.</p>
          </div>
        </section>

        {/* Smart Routing */}
        <section className="mb-16">
          <h2 className="text-xs font-mono tracking-[0.35em] uppercase text-brand-gold mb-2">Smart Routing</h2>
          <h3 className="text-fluid-xl font-display font-bold mb-6">Let Arcanea pick the best model</h3>

          <div className="liquid-glass rounded-2xl p-6">
            <p className="text-sm text-text-secondary mb-4">
              Use <code className="text-crystal font-mono bg-white/[0.06] px-1.5 py-0.5 rounded">arcanea-auto</code> as your model ID.
              The gateway classifies your task type and complexity, then routes to the optimal model from your configured providers.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { task: "Quick chat", routes: "arcanea-bolt", why: "2,200 tok/s speed" },
                { task: "Code review", routes: "arcanea-opus", why: "80.8% SWE-bench" },
                { task: "Creative writing", routes: "arcanea-sonnet", why: "Best creative value" },
                { task: "Image analysis", routes: "arcanea-gemini-pro", why: "1M ctx, multimodal" },
                { task: "Math/logic", routes: "arcanea-gpt5", why: "100% AIME 2025" },
                { task: "Translation", routes: "arcanea-qwen", why: "235B multilingual" },
                { task: "Generate image", routes: "arcanea-flux-pro", why: "#1 photorealism" },
                { task: "Simple Q&A", routes: "arcanea-lightning", why: "$0.05/M, fast" },
              ].map((r) => (
                <div key={r.task} className="bg-white/[0.03] rounded-lg p-3">
                  <div className="text-xs text-text-muted mb-1">{r.task}</div>
                  <div className="font-mono text-xs text-crystal">{r.routes}</div>
                  <div className="text-[10px] text-text-muted mt-0.5">{r.why}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Providers Grid */}
        <section className="mb-16">
          <h2 className="text-xs font-mono tracking-[0.35em] uppercase text-brand-primary mb-2">13 Providers</h2>
          <h3 className="text-fluid-xl font-display font-bold mb-6">Every major AI lab, one endpoint</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {PROVIDERS_LIST.map((p) => (
              <div key={p.name} className="liquid-glass rounded-xl p-4 text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: p.color }} />
                <div className="font-display font-semibold text-text-primary text-sm">{p.name}</div>
                <div className="text-[10px] text-text-muted mt-1">{p.models}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Compatible Tools */}
        <section className="mb-16">
          <h2 className="text-xs font-mono tracking-[0.35em] uppercase text-crystal mb-2">Compatibility</h2>
          <h3 className="text-fluid-xl font-display font-bold mb-6">Works with everything</h3>

          <div className="liquid-glass rounded-2xl p-6">
            <p className="text-sm text-text-secondary mb-4">
              The Arcanea Gateway is fully OpenAI-compatible. Any tool that supports a custom base URL works instantly:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                "LobeChat", "Open WebUI", "Cursor", "Continue.dev",
                "LiteLLM", "LangChain", "CrewAI", "AutoGen",
                "Vercel AI SDK", "OpenAI SDK", "LibreChat", "Jan",
                "LM Studio", "TypingMind", "AnythingLLM", "Google ADK",
              ].map((tool) => (
                <div key={tool} className="bg-white/[0.03] rounded-lg p-2.5 text-xs text-text-secondary font-mono">
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16">
          <h2 className="text-xs font-mono tracking-[0.35em] uppercase text-brand-gold mb-2">Pricing</h2>
          <h3 className="text-fluid-xl font-display font-bold mb-2">Free with BYOK. Premium for power.</h3>
          <p className="text-sm text-text-muted mb-6">You pay providers directly at their prices. Arcanea charges for routing intelligence, not model access.</p>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { tier: "Seeker", price: "Free", features: ["100K tokens/day", "All 26 models (BYOK)", "10 req/min", "Smart routing", "Community support"], color: "#00bcd4", cta: "Start Free" },
              { tier: "Creator", price: "$19/mo", features: ["5M tokens/day", "Priority routing", "60 req/min", "Semantic caching (60-85% savings)", "Usage analytics dashboard"], color: "#0d47a1", cta: "Coming Soon" },
              { tier: "Studio", price: "$49/mo", features: ["Unlimited tokens", "Fallback chains", "300 req/min", "API key management", "Team access + SSO", "Dedicated support"], color: "#ffd700", cta: "Coming Soon" },
            ].map((t) => (
              <div key={t.tier} className="liquid-glass rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: t.color }} />
                <div className="relative">
                  <div className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: t.color }}>{t.tier}</div>
                  <div className="text-3xl font-display font-bold text-text-primary mb-4">{t.price}</div>
                  <ul className="space-y-2 mb-6">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                        <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="text-center">
                    <span className="inline-block px-5 py-2 rounded-lg text-sm font-semibold border" style={{ borderColor: `${t.color}40`, color: t.color }}>
                      {t.cta}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="relative liquid-glass rounded-3xl overflow-hidden p-8 sm:p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-crystal/8 pointer-events-none" />
            <div className="relative max-w-2xl mx-auto">
              <h2 className="text-fluid-2xl font-display font-bold mb-4">
                Start Building Now
              </h2>
              <p className="text-text-secondary font-body leading-relaxed mb-8">
                One endpoint. 26 curated models. 13 providers. Text, image, video, and audio.
                Works with every tool. Bring your own keys and start in 30 seconds.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="#quickstart"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  View Quick Start
                </Link>
                <Link
                  href="/developers"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 hover:bg-crystal/5 transition-all duration-200"
                >
                  Developer Hub
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
