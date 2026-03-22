'use client';

import Link from 'next/link';
import {
  PhCode,
  PhKey,
  PhLightning,
  PhArrowRight,
  PhShield,
  PhClock,
  PhPackage,
  PhTerminal,
  PhSparkle,
  PhGlobe,
  PhRocket,
  PhChatCircleDots,
  PhImage,
  PhBookOpen,
  PhCompass,
  PhCopy,
} from '@/lib/phosphor-icons';
import { MotionProvider, m } from '@/lib/motion';
import { useState } from 'react';

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/v1/chat/completions',
    description: 'Generate chat completions with any of 26 models. OpenAI-compatible format.',
    icon: PhChatCircleDots,
    color: '#7fffd4',
  },
  {
    method: 'POST',
    path: '/v1/images/generations',
    description: 'Generate images with Flux 2, DALL-E 3, Imagen 4, Ideogram, and Recraft.',
    icon: PhImage,
    color: '#a855f7',
  },
  {
    method: 'GET',
    path: '/v1/luminors',
    description: 'Retrieve the 16 Luminor companion configurations for domain-specific AI chat.',
    icon: PhSparkle,
    color: '#ffd700',
  },
  {
    method: 'GET',
    path: '/v1/library',
    description: 'Access 200K+ words of creative wisdom across 17 Library collections.',
    icon: PhBookOpen,
    color: '#78a6ff',
  },
  {
    method: 'GET',
    path: '/v1/models',
    description: 'List all available models with capabilities, pricing, and context window details.',
    icon: PhGlobe,
    color: '#06b6d4',
  },
];

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
  model: arcanea('arcanea-opus'),
  prompt: 'Write a creation myth for a new world',
});

console.log(text);`;

const CODE_CURL = `curl https://arcanea.ai/api/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "X-Anthropic-Key: $ARCANEA_API_KEY" \\
  -d '{
    "model": "arcanea-opus",
    "messages": [
      { "role": "user", "content": "Hello" }
    ],
    "stream": true
  }'`;

const CODE_PYTHON = `from openai import OpenAI

client = OpenAI(
    base_url="https://arcanea.ai/api/v1",
    api_key=os.environ["ARCANEA_API_KEY"],
    default_headers={
        "X-Anthropic-Key": os.environ.get("ANTHROPIC_KEY", "")
    }
)

response = client.chat.completions.create(
    model="arcanea-auto",
    messages=[{"role": "user", "content": "Hello"}]
)

print(response.choices[0].message.content)`;

const RATE_LIMITS = [
  { plan: 'Free', requests: '100/day', models: '8 models', color: '#a3a3a3', features: ['Basic chat', 'Community models'] },
  { plan: 'Creator', requests: '1,000/day', models: '26 models', color: '#7fffd4', features: ['All models', 'Priority routing', 'Image generation'] },
  { plan: 'Studio', requests: '10,000/day', models: '26 models', color: '#ffd700', features: ['Everything', 'Custom endpoints', 'SLA guarantee', 'Dedicated support'] },
];

const SDK_LIST = [
  { name: '@arcanea/ai-provider', lang: 'TypeScript', description: 'Vercel AI SDK provider', status: 'stable' },
  { name: '@arcanea/mcp-server', lang: 'TypeScript', description: 'Model Context Protocol server', status: 'stable' },
  { name: 'arcanea-py', lang: 'Python', description: 'Python SDK', status: 'coming' },
  { name: '@arcanea/luminors', lang: 'TypeScript', description: 'Luminor companion system', status: 'stable' },
];

type TabKey = 'typescript' | 'curl' | 'python';

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
        >
          <PhCopy className="w-3.5 h-3.5 text-neutral-400" />
        </button>
      </div>
      <pre className="bg-[#0d1117] border border-white/[0.06] rounded-xl p-5 pt-10 overflow-x-auto text-sm leading-relaxed">
        <code className="text-[#e6edf3] font-mono text-xs">{code}</code>
      </pre>
      {copied && (
        <div className="absolute top-3 right-3 text-xs text-[#7fffd4] font-mono">Copied!</div>
      )}
    </div>
  );
}

export default function ApiReferencePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('typescript');

  const CODE_TABS: Record<TabKey, { code: string; lang: string }> = {
    typescript: { code: CODE_TYPESCRIPT, lang: 'TypeScript' },
    curl: { code: CODE_CURL, lang: 'cURL' },
    python: { code: CODE_PYTHON, lang: 'Python' },
  };

  return (
    <MotionProvider>
      <div className="relative min-h-screen">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/5 via-transparent to-[#78a6ff]/5" />
          <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-[#78a6ff]/5 rounded-full blur-[150px]" />
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <m.section
            className="pt-20 pb-16 lg:pt-28 lg:pb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden px-8 py-16 sm:px-12 sm:py-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#78a6ff]/10 via-transparent to-[#7fffd4]/10 pointer-events-none" />

              <div className="relative max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#78a6ff]/30 bg-[#78a6ff]/10 mb-6">
                  <PhCode className="w-3.5 h-3.5 text-[#78a6ff]" />
                  <span className="text-xs font-mono tracking-widest uppercase text-[#78a6ff]">
                    API Reference
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                  Arcanea{' '}
                  <span className="bg-gradient-to-r from-[#78a6ff] to-[#7fffd4] bg-clip-text text-transparent">
                    API
                  </span>
                </h1>

                <p className="text-lg text-neutral-400 leading-relaxed max-w-2xl mb-8">
                  Integrate creative intelligence into your applications. One OpenAI-compatible
                  API, 26 models from 13 providers.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/developers"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#78a6ff] text-black font-semibold hover:scale-[1.03] transition-all duration-200"
                  >
                    <PhRocket className="w-4 h-4" />
                    Get API Key
                  </Link>
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold hover:border-[#78a6ff]/30 transition-all duration-200"
                  >
                    <PhBookOpen className="w-4 h-4" />
                    Read Docs
                  </Link>
                </div>
              </div>
            </div>
          </m.section>

          {/* Authentication */}
          <section className="py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7fffd4]/20 bg-[#7fffd4]/8 mb-6">
              <PhKey className="w-3 h-3 text-[#7fffd4]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#7fffd4]">
                Authentication
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-4">API Key Setup</h2>
            <p className="text-neutral-400 mb-6 max-w-2xl">
              Arcanea routes to multiple providers. Pass your provider keys as custom headers.
              Arcanea never stores your keys -- they are used only for the duration of the request.
            </p>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <PhShield className="w-5 h-5 text-[#7fffd4] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Required Headers</h4>
                  <p className="text-sm text-neutral-400">
                    Pass provider keys via <code className="text-[#7fffd4] bg-white/5 px-1.5 py-0.5 rounded text-xs">X-Anthropic-Key</code>,{' '}
                    <code className="text-[#7fffd4] bg-white/5 px-1.5 py-0.5 rounded text-xs">X-Groq-Key</code>,{' '}
                    <code className="text-[#7fffd4] bg-white/5 px-1.5 py-0.5 rounded text-xs">X-OpenAI-Key</code>,
                    etc. Only the key for the selected model&apos;s provider is needed.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PhLightning className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Smart Routing</h4>
                  <p className="text-sm text-neutral-400">
                    Use <code className="text-[#ffd700] bg-white/5 px-1.5 py-0.5 rounded text-xs">arcanea-auto</code> as the model
                    to let Arcanea pick the best available model based on your keys and the task.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Endpoints */}
          <section className="py-12 border-t border-white/5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#78a6ff]/20 bg-[#78a6ff]/8 mb-6">
              <PhGlobe className="w-3 h-3 text-[#78a6ff]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#78a6ff]">
                Endpoints
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-8">API Endpoints</h2>
            <div className="space-y-3">
              {ENDPOINTS.map((ep) => {
                const Icon = ep.icon;
                return (
                  <div
                    key={ep.path}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex items-center gap-3 sm:w-64">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        ep.method === 'POST' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'
                      }`}>
                        {ep.method}
                      </span>
                      <code className="text-sm font-mono text-neutral-300">{ep.path}</code>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" style={{ color: ep.color }} />
                      <span className="text-sm text-neutral-400">{ep.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Code Examples */}
          <section className="py-12 border-t border-white/5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ffd700]/20 bg-[#ffd700]/8 mb-6">
              <PhTerminal className="w-3 h-3 text-[#ffd700]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#ffd700]">
                Examples
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-6">Code Examples</h2>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-white/5 rounded-lg p-1 w-fit">
              {(Object.keys(CODE_TABS) as TabKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 rounded-md text-sm font-mono transition-all ${
                    activeTab === key
                      ? 'bg-white/10 text-white'
                      : 'text-neutral-400 hover:text-neutral-300'
                  }`}
                >
                  {CODE_TABS[key].lang}
                </button>
              ))}
            </div>

            <CodeBlock code={CODE_TABS[activeTab].code} language={CODE_TABS[activeTab].lang} />
          </section>

          {/* Rate Limits */}
          <section className="py-12 border-t border-white/5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ec4899]/20 bg-[#ec4899]/8 mb-6">
              <PhClock className="w-3 h-3 text-[#ec4899]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#ec4899]">
                Rate Limits
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-8">Plans & Limits</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {RATE_LIMITS.map((plan) => (
                <div
                  key={plan.plan}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden"
                >
                  <div
                    className="h-1 w-full absolute top-0 left-0 right-0"
                    style={{ background: `linear-gradient(90deg, ${plan.color}, transparent)` }}
                  />
                  <h3 className="font-display text-xl font-bold mb-1" style={{ color: plan.color }}>
                    {plan.plan}
                  </h3>
                  <div className="text-2xl font-display font-bold mb-1">{plan.requests}</div>
                  <div className="text-xs text-neutral-500 mb-4">{plan.models}</div>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-neutral-400">
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: plan.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* SDKs */}
          <section className="py-12 border-t border-white/5 pb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#06b6d4]/20 bg-[#06b6d4]/8 mb-6">
              <PhPackage className="w-3 h-3 text-[#06b6d4]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#06b6d4]">
                SDKs
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-8">Client Libraries</h2>
            <div className="space-y-3">
              {SDK_LIST.map((sdk) => (
                <div
                  key={sdk.name}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex-1">
                    <span className="font-mono text-sm text-[#7fffd4]">{sdk.name}</span>
                    <p className="text-xs text-neutral-400 mt-0.5">{sdk.description}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-neutral-500">{sdk.lang}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      sdk.status === 'stable'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-neutral-500/10 text-neutral-400'
                    }`}>
                      {sdk.status === 'stable' ? 'Stable' : 'Coming Soon'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Back link */}
            <div className="mt-12 text-center">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-[#7fffd4] transition-colors"
              >
                <PhArrowRight className="w-4 h-4 rotate-180" />
                <span>Back to Documentation</span>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </MotionProvider>
  );
}
