/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from 'next';
import Link from 'next/link';

const TITLE = 'Arcanea Orchestrator — the routing brain for multi-CLI AI coding';
const DESCRIPTION =
  'Install one command. Route tasks across Claude, OpenCode, Codex, and Gemini. Respect your subscription mix. Learn over time. @arcanea/orchestrator is open source and lives on npm.';
const ACCENT = 'var(--arc-brand-atlantean-teal)';

export const metadata: Metadata = {
  title: `${TITLE} | Arcanea`,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: 'https://arcanea.ai/orchestrator',
  },
  alternates: { canonical: 'https://arcanea.ai/orchestrator' },
};

export default function OrchestratorPage() {
  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 -z-10 bg-[var(--arc-cosmic-void)]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,rgba(127,255,212,0.15),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(120,166,255,0.08),transparent_55%)]" />
      </div>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span
              className="text-xs font-mono px-3 py-1 rounded-full border"
              style={{ backgroundColor: `${ACCENT}20`, color: ACCENT, borderColor: `${ACCENT}40` }}
            >
              Open Source
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-white/20 bg-white/5 text-white">
              v1.x on npm
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-brand-gold/40 bg-brand-gold/20 text-brand-gold">
              MIT
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight">
            The routing brain for your AI coding CLIs.
          </h1>
          <p className="text-xl sm:text-2xl font-mono mb-6 max-w-3xl" style={{ color: ACCENT }}>
            Claude + OpenCode + Codex + Gemini — orchestrated.
          </p>
          <p className="text-lg text-text-secondary mb-8 max-w-3xl leading-relaxed">
            Install one command. The Arcanea Orchestrator detects which AI CLIs you have, which
            subscriptions you own, and which tasks you're running — then routes each task to the
            right model via the right sub-CLI. Claude Max does the heavy reasoning. Free tier
            handles bulk. BYOK gets the second opinion. You never think about it again.
          </p>

          {/* Install block */}
          <div className="rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-sm p-5 font-mono text-sm mb-6 overflow-x-auto">
            <div className="text-text-muted mb-2"># Install once:</div>
            <div className="text-white">$ npm i -g @arcanea/orchestrator</div>
            <div className="text-text-muted mt-3 mb-2"># Detect CLIs and set your preference:</div>
            <div className="text-white">$ arco doctor</div>
            <div className="text-text-muted mt-3 mb-2"># Route any task to the best model:</div>
            <div className="text-white">$ arco run --task code.debug "fix the null-deref in auth"</div>
          </div>

          <div className="flex gap-3 flex-wrap text-sm">
            <a
              href="https://www.npmjs.com/package/@arcanea/orchestrator"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-colors"
            >
              npm package →
            </a>
            <a
              href="https://github.com/frankxai/arcanea-orchestrator"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-colors"
            >
              GitHub repo →
            </a>
            <Link
              href="/ops/agents"
              className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-colors"
            >
              Live dashboard →
            </Link>
          </div>
        </header>

        {/* What it does */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-6">What it does</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: 'Routes by task class',
                body:
                  '16 task classes (code.debug, world.canon, research.deep…). Each declares primary + fallback models. You pick the class; the orchestrator picks the model.',
              },
              {
                title: 'Respects your subs',
                body:
                  'Max sub on → claude -p uses it. OpenCode Zen free → opencode runs free. BYOK keys for Codex + Gemini get used when relevant. No wasted spend.',
              },
              {
                title: 'Learns over time',
                body:
                  'Every run writes to ~/.arcanea/history.jsonl. After 10 events, adaptive routing re-ranks candidates by local success rate + speed + recent-failure penalty.',
              },
              {
                title: 'Decomposes goals',
                body:
                  '`arco plan "build a landing page"` calls claude -p to break the goal into 3-7 concrete sub-tasks, each mapped to a task class with a concrete prompt.',
              },
              {
                title: 'Workflow templates',
                body:
                  '`arco workflow` ships reusable compositions (build-landing-page, refactor-ts, add-feature). Fill in --var placeholders, get an expanded plan.',
              },
              {
                title: 'Zero data collection',
                body:
                  'Prompts never touch Arcanea infrastructure. They go straight from your shell to whichever vendor CLI you invoked. We only log locally.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-5"
              >
                <h3 className="font-display text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Example */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-6">A full example in one shell</h2>
          <div className="rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-sm p-5 font-mono text-xs sm:text-sm overflow-x-auto">
            <pre className="whitespace-pre">{`$ arco doctor
  claude     sub                  /path/to/claude
  opencode   free                 /path/to/opencode
  codex      byok                 /path/to/codex
  gemini     unknown              /path/to/gemini
  Preference: sub-first

$ arco explain code.debug --surface claude-arcanea
  Task: code.debug
  → claude-opus-4-7              claude     sub
    claude-sonnet-4-6            claude     sub
    minimax-m2.5-free            opencode   free

$ arco run --task code.debug "find the null-deref in apps/web/app/api/auth/route.ts"
  [arcanea] task=code.debug pref=sub-first → claude-opus-4-7 via claude [auth: sub]
  (claude streams the fix, orchestrator logs the event to ~/.arcanea/history.jsonl)

$ arco stats
  TASK          MODEL                 RUNS  SUCCESS   AVG
  code.debug    claude-opus-4-7       7     100%      8214ms
  code.debug    minimax-m2.5-free     4     75%       3420ms
  world.canon   claude-opus-4-7       12    92%       14502ms

$ arco workflow run build-landing-page --var page=/pricing --var pitch="..."
  (JSON plan with 5 tasks streams to stdout)
`}</pre>
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-6">How it's wired</h2>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 font-mono text-xs sm:text-sm overflow-x-auto">
            <pre className="text-text-secondary whitespace-pre">{`YOU (any terminal)
     │
     ▼
┌────────────────────────────────────────────────────────┐
│ @arcanea/orchestrator  (headless brain, ~1000 LOC)     │
│                                                        │
│  - routes by task class + surface + your preference    │
│  - planner: claude -p breaks goals into sub-tasks      │
│  - reasoning bank: learns from ~/.arcanea/history      │
│  - workflow templates: reusable compositions           │
└────────────────┬───────────────────────────────────────┘
                 │ execs via -p headless mode
        ┌────────┼──────────┬──────────┬──────────┐
        ▼        ▼          ▼          ▼          ▼
    claude    opencode    codex      gemini      ao
   (Max sub) (Zen free)  (OpenAI)   (Google)   (swarm)

         ↑ each uses its OWN auth — no proxy ↑

Source of truth: @arcanea/router-spec/models.yaml
Single YAML declares 14 models × 16 tasks × 7 surfaces.
Edit it, every surface re-reads on next invocation.
`}</pre>
          </div>
        </section>

        {/* Philosophy */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-6">Why it exists</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-text-secondary leading-relaxed text-lg">
              Nobody ships a routing layer that spans Claude, OpenCode, Codex, and Gemini with a
              single spec. Composio's AO handles claude-code only. Kilo Code forked OpenCode and
              stayed inside OpenCode. aider is single-model. This is the gap.
            </p>
            <p className="text-text-secondary leading-relaxed text-lg">
              The orchestrator doesn't replace any CLI. It coordinates them. Your Max sub covers
              `claude -p`. Your free Zen tier covers bulk. Your BYOK keys get used for
              second-opinion review. Every decision is declared in one YAML file you can read,
              edit, and fork. If you disagree with our routing, override with `--model`. If our
              spec is stale, patch the spec.
            </p>
            <p className="text-text-secondary leading-relaxed text-lg">
              And it learns. Not via a remote service — right there on your disk. The adaptive
              ranker reads your own history and re-ranks candidates by what actually worked. No
              data leaves your machine.
            </p>
          </div>
        </section>

        {/* Docs / Community */}
        <section className="mb-12">
          <h2 className="font-display text-3xl font-bold mb-6">Go deeper</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <a
              href="https://github.com/frankxai/arcanea-ai-app/blob/main/docs/orchestrator/QUICKSTART.md"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-sm p-4 transition-colors"
            >
              <div className="font-mono text-sm mb-1" style={{ color: ACCENT }}>
                QUICKSTART →
              </div>
              <div className="text-sm text-text-secondary">
                5-minute install → first run → plan → workflow → history.
              </div>
            </a>
            <a
              href="https://github.com/frankxai/arcanea-ai-app/blob/main/packages/orchestrator/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-sm p-4 transition-colors"
            >
              <div className="font-mono text-sm mb-1" style={{ color: ACCENT }}>
                Package README →
              </div>
              <div className="text-sm text-text-secondary">
                Full command reference, roadmap, legal disclaimer.
              </div>
            </a>
            <a
              href="https://github.com/frankxai/arcanea-orchestrator"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-sm p-4 transition-colors"
            >
              <div className="font-mono text-sm mb-1" style={{ color: ACCENT }}>
                Source repo →
              </div>
              <div className="text-sm text-text-secondary">
                frankxai/arcanea-orchestrator. PRs welcome for workflow templates.
              </div>
            </a>
            <Link
              href="/ops/agents"
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-sm p-4 transition-colors"
            >
              <div className="font-mono text-sm mb-1" style={{ color: ACCENT }}>
                Live ops dashboard →
              </div>
              <div className="text-sm text-text-secondary">
                See AO sessions, surfaces, terminal cheat-sheet.
              </div>
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="text-xs text-text-muted border-t border-white/[0.08] pt-6">
          MIT licensed, provided &quot;AS IS&quot; without warranty. Not affiliated with Anthropic,
          OpenAI, Google, or any other model provider. Prompts never touch Arcanea infrastructure —
          they go directly from your shell to the CLI you invoked. Model metadata (benchmarks,
          context windows) is aggregated from public sources and is best-effort. Verify
          independently before production use.
        </section>
      </main>
    </div>
  );
}
