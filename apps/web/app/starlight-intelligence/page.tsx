import { Metadata } from 'next';
import Link from 'next/link';
import { VAULT_CONFIG, VAULT_CATEGORIES, type VaultCategory } from '@/lib/vault-data';

export const metadata: Metadata = {
  title: 'Starlight Intelligence — The Persistent Memory Layer | Arcanea',
  description: 'A 5-layer cognitive architecture with 6 semantic vaults, 7 specialist agents, and adapters for every AI tool. Local-first. Portable. Yours.',
  openGraph: {
    title: 'Starlight Intelligence System',
    description: 'The persistent memory layer for humans and AI agents.',
    type: 'website',
  },
};

const LAYERS = [
  { name: 'Perception', desc: 'Captures raw context from any AI interaction', color: '#34d399' },
  { name: 'Classification', desc: 'Routes insights to the right vault with confidence scoring', color: '#60a5fa' },
  { name: 'Storage', desc: 'Writes to semantic vaults as local JSONL files', color: '#a78bfa' },
  { name: 'Retrieval', desc: 'Recalls relevant memories via MCP tools or API', color: '#fbbf24' },
  { name: 'Synthesis', desc: 'Compounds insights across sessions into new understanding', color: '#f472b6' },
];

const ADAPTERS = [
  { name: 'Claude Code', desc: 'MCP server integration' },
  { name: 'Cursor', desc: 'Rules file + vault access' },
  { name: 'OpenCode', desc: 'TUI with vault commands' },
  { name: 'Gemini', desc: 'Context injection' },
  { name: 'Codex', desc: 'Thin vault pointer' },
  { name: 'Any MCP Client', desc: 'Universal protocol' },
];

const API_EXAMPLE = `GET /api/vaults/frank

{
  "name": "Frank",
  "vaults": {
    "strategic": { "count": 4, "latest": "BYOK-first is better than managed..." },
    "technical": { "count": 6, "latest": "R2 has free egress..." },
    "creative":  { "count": 3, "latest": "NEVER use Cinzel font..." },
    "operational": { "count": 4, "latest": "Focused sequential engineering..." },
    "wisdom":    { "count": 0 },
    "horizon":   { "count": 1, "latest": "We are building SIS to become..." }
  }
}`;

export default function StarlightIntelligencePage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_50%_20%,rgba(0,188,212,0.1),transparent_60%)]" />
      </div>

      <main className="max-w-5xl mx-auto px-6">
        {/* ── Hero ── */}
        <section className="pt-20 pb-16 text-center">
          <p className="text-xs font-mono tracking-[0.3em] text-[#708094] mb-4 uppercase">Open Source</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#e6eefc] mb-6">
            The persistent memory layer
            <span className="block text-[#00bcd4]">for humans and AI agents.</span>
          </h1>
          <p className="text-lg text-[#9bb1d0] max-w-2xl mx-auto leading-relaxed">
            6 semantic vaults. 5 cognitive layers. Local-first JSONL. Works with every AI tool through MCP.
            Your intelligence compounds instead of resetting.
          </p>
        </section>

        {/* ── 5-Layer Architecture ── */}
        <section className="pb-16">
          <h2 className="text-xs font-mono tracking-[0.2em] text-[#708094] mb-6 uppercase">Cognitive Architecture</h2>
          <div className="space-y-2">
            {LAYERS.map((layer, i) => (
              <div key={layer.name} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold" style={{ backgroundColor: `${layer.color}15`, color: layer.color }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#e6eefc]">{layer.name}</p>
                  <p className="text-xs text-[#708094]">{layer.desc}</p>
                </div>
                {i < LAYERS.length - 1 && (
                  <svg className="w-4 h-4 text-white/10 rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── 6 Vaults ── */}
        <section className="pb-16">
          <h2 className="text-xs font-mono tracking-[0.2em] text-[#708094] mb-6 uppercase">6 Semantic Vaults</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {VAULT_CATEGORIES.map((cat) => {
              const config = VAULT_CONFIG[cat as VaultCategory];
              return (
                <Link
                  key={cat}
                  href={`/vault/${cat}`}
                  className="group p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/[0.1] transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                    <span className="text-sm font-semibold text-[#e6eefc]">{config.label}</span>
                    <span className="text-[10px] text-[#708094] font-mono ml-auto">{config.guardian}</span>
                  </div>
                  <p className="text-xs text-[#708094]">{config.tagline}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="pb-16">
          <h2 className="text-xs font-mono tracking-[0.2em] text-[#708094] mb-6 uppercase">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Store locally', desc: 'Insights save to ~/.starlight/ as plain JSONL files. Human-readable. Git-friendly. No database.' },
              { step: '2', title: 'Connect via MCP', desc: 'The SIS MCP server exposes vault_remember, vault_recall, and horizon_append to any AI tool.' },
              { step: '3', title: 'Intelligence compounds', desc: 'Every session builds on the last. Confidence scores, Guardian routing, and cross-vault synthesis grow over time.' },
            ].map((item) => (
              <div key={item.step} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-[#00bcd4]/10 flex items-center justify-center text-sm font-mono font-bold text-[#00bcd4] mb-3">
                  {item.step}
                </div>
                <p className="text-sm font-semibold text-[#e6eefc] mb-1">{item.title}</p>
                <p className="text-xs text-[#708094] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Privacy ── */}
        <section className="pb-16">
          <h2 className="text-xs font-mono tracking-[0.2em] text-[#708094] mb-6 uppercase">Privacy Model</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-sm font-semibold text-[#e6eefc] mb-1">~/.starlight/</p>
              <p className="text-xs text-[#708094] leading-relaxed">Private. Never leaves your machine. All vault files, profile, and config stay local. You own the files.</p>
            </div>
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-sm font-semibold text-[#e6eefc] mb-1">public-vault/</p>
              <p className="text-xs text-[#708094] leading-relaxed">Opt-in. Push selected insights to a GitHub repo. Powers the constellation at /arcanea-vault and the Agent API.</p>
            </div>
          </div>
        </section>

        {/* ── Platform Adapters ── */}
        <section className="pb-16">
          <h2 className="text-xs font-mono tracking-[0.2em] text-[#708094] mb-6 uppercase">Platform Adapters</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {ADAPTERS.map((a) => (
              <div key={a.name} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-xs font-semibold text-[#e6eefc]">{a.name}</p>
                <p className="text-[10px] text-[#708094]">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Agent API ── */}
        <section className="pb-16">
          <h2 className="text-xs font-mono tracking-[0.2em] text-[#708094] mb-6 uppercase">Agent API</h2>
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-2 border-b border-white/[0.06] flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#34d399] font-bold">GET</span>
              <span className="text-xs font-mono text-[#708094]">/api/vaults/frank</span>
            </div>
            <pre className="p-4 text-xs font-mono text-[#9bb1d0] overflow-x-auto leading-relaxed">
              {API_EXAMPLE}
            </pre>
          </div>
        </section>

        {/* ── CTAs ── */}
        <section className="pb-24 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://starlightintelligence.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] text-[#09090b] font-semibold text-sm hover:shadow-[0_0_30px_rgba(0,188,212,0.25)] transition-all"
            >
              Deploy your vault
            </a>
            <Link
              href="/arcanea-vault"
              className="px-8 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-[#e6eefc] hover:bg-white/[0.08] transition-colors"
            >
              Explore the constellation
            </Link>
            <a
              href="https://github.com/frankxai/Starlight-Intelligence-System"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-[#e6eefc] hover:bg-white/[0.08] transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
