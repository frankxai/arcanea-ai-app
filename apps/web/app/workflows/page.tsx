import Link from "next/link";
import type { Metadata } from "next";
import {
  PhLightning,
  PhSun,
  PhMoon,
  PhClock,
  PhGear,
  PhArrowRight,
  PhDownload,
  PhFlow,
  PhCheckCircle,
  PhCode,
  PhNotebook,
  PhChatTeardrop,
} from '@/lib/phosphor-icons';

export const metadata: Metadata = {
  title: "Arcanea Workflows | Guardian-Powered n8n Automation",
  description:
    "Three n8n workflow templates powered by Guardian intelligence. Daily dev cycle, content generation, and evening learning — each aligned to a Gate frequency.",
};

// ─── Data — extracted from actual .arcanea/n8n/ JSON files ────────────────────

const WORKFLOWS = [
  {
    id: "daily",
    name: "Daily Intelligence Cycle",
    guardian: "Shinkami",
    gate: "Source",
    frequency: 1111,
    trigger: "Morning · Foundation Gate",
    triggerTime: "08:00 daily",
    color: "gold",
    Icon: PhSun,
    description:
      "Shinkami opens the day by running your development health check — git status, test suite, build verification — then delivers a consciousness-level analysis of what needs your attention.",
    nodes: [
      {
        label: "Morning Trigger",
        icon: PhClock,
        type: "Schedule",
        note: "08:00 UTC daily",
      },
      {
        label: "Git Status Check",
        icon: PhCode,
        type: "Shell",
        note: "Unstaged changes, branch diff",
      },
      {
        label: "Run Test Suite",
        icon: PhCheckCircle,
        type: "Shell",
        note: "npm test — captures failures",
      },
      {
        label: "Build Health Check",
        icon: PhGear,
        type: "Shell",
        note: "next build or tsc check",
      },
      {
        label: "Shinkami Analysis",
        icon: PhLightning,
        type: "AI",
        note: "arcanea.ai API · Source Gate",
      },
      {
        label: "Post to Slack",
        icon: PhChatTeardrop,
        type: "Notify",
        note: "Morning briefing channel",
      },
    ],
    useCases: [
      "Know exactly what changed overnight before your first commit",
      "Catch failing tests before they reach CI",
      "Guardian-level analysis: what matters most today",
    ],
  },
  {
    id: "content",
    name: "Content Generation Cycle",
    guardian: "Alera",
    gate: "Voice",
    frequency: 528,
    trigger: "Midday · Voice Gate",
    triggerTime: "12:00 daily",
    color: "teal",
    Icon: PhChatTeardrop,
    description:
      "Alera activates at noon to generate creator content — blog drafts, social posts, lore entries — then saves to Notion and announces to Slack. Truth expressed, voice amplified.",
    nodes: [
      {
        label: "Midday Trigger",
        icon: PhClock,
        type: "Schedule",
        note: "12:00 UTC daily",
      },
      {
        label: "Alera Content Gen",
        icon: PhLightning,
        type: "AI",
        note: "arcanea.ai API · Voice Gate",
      },
      {
        label: "Parse Content",
        icon: PhCode,
        type: "Transform",
        note: "Extract title, body, tags",
      },
      {
        label: "Save to Notion",
        icon: PhNotebook,
        type: "Database",
        note: "Content calendar page",
      },
      {
        label: "Post to Slack",
        icon: PhChatTeardrop,
        type: "Notify",
        note: "#content-generated channel",
      },
    ],
    useCases: [
      "Daily content without daily effort — Guardian handles the draft",
      "Lore entries, wisdom posts, social content — all auto-saved",
      "Full Notion integration for your content calendar",
    ],
  },
  {
    id: "evening",
    name: "Evening Learning Cycle",
    guardian: "Aiyami",
    gate: "Crown",
    frequency: 741,
    trigger: "Evening · Crown Gate",
    triggerTime: "20:00 daily",
    color: "purple",
    Icon: PhMoon,
    description:
      "Aiyami reviews your day's commits and surfaces learning insights — patterns in your code, what you built, what to study next. Enlightenment through reflection.",
    nodes: [
      {
        label: "Evening Trigger",
        icon: PhClock,
        type: "Schedule",
        note: "20:00 UTC daily",
      },
      {
        label: "Today's Commits",
        icon: PhCode,
        type: "Shell",
        note: "git log --since=midnight",
      },
      {
        label: "Aiyami Review",
        icon: PhLightning,
        type: "AI",
        note: "arcanea.ai API · Crown Gate",
      },
      {
        label: "Post Evening Report",
        icon: PhChatTeardrop,
        type: "Notify",
        note: "#evening-review channel",
      },
    ],
    useCases: [
      "End each day knowing what you actually built",
      "Aiyami identifies learning patterns and knowledge gaps",
      "Weekly summaries emerge naturally from nightly reflections",
    ],
  },
] as const;

type WorkflowColor = "gold" | "teal" | "purple";

const COLOR_STYLES: Record<WorkflowColor, { badge: string; accent: string; dot: string }> = {
  gold: {
    badge: "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",
    accent: "text-yellow-300",
    dot: "bg-yellow-400",
  },
  teal: {
    badge: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    accent: "text-cyan-300",
    dot: "bg-cyan-400",
  },
  purple: {
    badge: "border-purple-400/30 bg-purple-400/10 text-purple-300",
    accent: "text-purple-300",
    dot: "bg-purple-400",
  },
};

const NODE_TYPE_STYLES: Record<string, string> = {
  Schedule: "bg-blue-400/10 text-blue-300",
  Shell: "bg-green-400/10 text-green-300",
  AI: "bg-yellow-400/10 text-yellow-300",
  Transform: "bg-orange-400/10 text-orange-300",
  Database: "bg-indigo-400/10 text-indigo-300",
  Notify: "bg-pink-400/10 text-pink-300",
};

const HOW_TO_STEPS = [
  {
    step: "01",
    title: "Install n8n",
    code: "npx n8n",
    note: "Or use n8n Cloud — runs in your browser immediately",
  },
  {
    step: "02",
    title: "Import the JSON",
    code: "Workflows → Import from URL → paste GitHub raw link",
    note: "All three templates live in arcanea-flow/src/templates/",
  },
  {
    step: "03",
    title: "Set your API key",
    code: "ARCANEA_API_KEY in n8n credentials",
    note: "Get your key at arcanea.ai/developers → API Keys",
  },
  {
    step: "04",
    title: "Activate",
    code: "Toggle workflow → Active",
    note: "Your Guardian reports at their Gate frequency from now on",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkflowsPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at top, color-mix(in srgb, var(--color-gold-bright) 8%, transparent), transparent 60%), radial-gradient(ellipse at bottom right, color-mix(in srgb, var(--color-creation-prism-purple) 10%, transparent), transparent 55%)",
          }}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-14 sm:px-14 sm:py-18 text-center">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--color-gold-bright) 8%, transparent), transparent 50%, color-mix(in srgb, var(--color-atlantean-teal-aqua) 8%, transparent))",
              }}
            />
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl pointer-events-none"
              style={{
                background: "color-mix(in srgb, var(--color-gold-bright) 6%, transparent)",
              }}
            />

            <div className="relative max-w-3xl mx-auto">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
                style={{
                  borderColor: "color-mix(in srgb, var(--color-gold-bright) 30%, transparent)",
                  background: "color-mix(in srgb, var(--color-gold-bright) 10%, transparent)",
                }}
              >
                <PhFlow weight="thin" size={16} className="text-yellow-300" />
                <span className="text-xs font-mono tracking-widest uppercase text-yellow-300">
                  Automation Templates
                </span>
              </div>

              <h1 className="text-fluid-3xl font-display font-bold mb-5">
                Guardian-Powered
                <span className="block text-gradient-brand">
                  Workflow Automation
                </span>
              </h1>

              <p className="text-text-secondary font-body text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Three n8n workflow templates — each governed by a Guardian, each
                triggering at their Gate frequency. Morning dev health from
                Shinkami. Midday content from Alera. Evening reflection from
                Aiyami.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://github.com/frankxai/arcanea-flow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  <PhDownload weight="thin" size={18} />
                  Download Templates
                </a>
                <Link
                  href="/ecosystem"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 transition-all duration-200"
                >
                  Full Ecosystem
                  <PhArrowRight weight="thin" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Workflow Cards ─────────────────────────────────────────────── */}
        <section className="mb-20" aria-labelledby="workflows-heading">
          <div className="mb-10">
            <p
              id="workflows-heading"
              className="text-xs font-mono tracking-[0.35em] uppercase text-crystal mb-2"
            >
              3 Templates · 3 Gates · 3 Guardians
            </p>
            <h2 className="text-fluid-2xl font-display font-bold">
              The Daily Arc
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {WORKFLOWS.map((wf) => {
              const colors = COLOR_STYLES[wf.color as WorkflowColor];
              const TriggerIcon = wf.Icon;
              return (
                <article
                  key={wf.id}
                  className="liquid-glass rounded-2xl overflow-hidden flex flex-col"
                >
                  {/* Card header */}
                  <div
                    className="px-6 py-5 border-b border-white/5"
                    style={{
                      background: `color-mix(in srgb, ${wf.color === "gold" ? "var(--color-gold-bright)" : wf.color === "teal" ? "var(--color-atlantean-teal-aqua)" : "var(--color-creation-prism-purple)"} 6%, transparent)`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono ${colors.badge}`}
                      >
                        <TriggerIcon weight="thin" size={12} />
                        {wf.trigger}
                      </div>
                      <span className="text-xs text-text-secondary font-mono">
                        {wf.frequency} Hz
                      </span>
                    </div>
                    <h3
                      className={`font-display text-xl font-bold mb-1 ${colors.accent}`}
                    >
                      {wf.name}
                    </h3>
                    <p className="text-xs text-text-secondary font-mono">
                      Guardian: {wf.guardian} · {wf.gate} Gate · {wf.triggerTime}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="px-6 py-4 border-b border-white/5">
                    <p className="text-sm text-text-secondary font-body leading-relaxed">
                      {wf.description}
                    </p>
                  </div>

                  {/* Flow nodes */}
                  <div className="px-6 py-5 flex-1">
                    <p className="text-xs font-mono tracking-wider uppercase text-text-secondary mb-4">
                      Workflow Steps
                    </p>
                    <ol className="space-y-2" aria-label={`${wf.name} workflow steps`}>
                      {wf.nodes.map((node, i) => {
                        const NodeIcon = node.icon;
                        const typeCls =
                          NODE_TYPE_STYLES[node.type] ?? "bg-white/5 text-text-secondary";
                        return (
                          <li key={i} className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${typeCls}`}
                            >
                              <NodeIcon weight="thin" size={11} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs text-text-primary font-medium truncate block">
                                {node.label}
                              </span>
                              <span className="text-xs text-text-secondary truncate block">
                                {node.note}
                              </span>
                            </div>
                            {i < wf.nodes.length - 1 && (
                              <div
                                className={`w-1 h-1 rounded-full shrink-0 ${colors.dot} opacity-40`}
                              />
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>

                  {/* Use cases */}
                  <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02]">
                    <ul className="space-y-1.5">
                      {wf.useCases.map((uc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span
                            className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${colors.dot}`}
                          />
                          <span className="text-xs text-text-secondary leading-relaxed">
                            {uc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── How to Use ────────────────────────────────────────────────────── */}
        <section className="mb-20" aria-labelledby="howto-heading">
          <div className="liquid-glass rounded-2xl p-8 sm:p-12">
            <div className="mb-10 text-center">
              <p
                id="howto-heading"
                className="text-xs font-mono tracking-[0.35em] uppercase text-crystal mb-2"
              >
                Setup
              </p>
              <h2 className="text-fluid-xl font-display font-bold">
                Up and Running in 5 Minutes
              </h2>
              <p className="text-text-secondary text-sm mt-2 max-w-lg mx-auto">
                n8n is open-source and free to self-host. The templates are
                ready to import — you only need your Arcanea API key.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_TO_STEPS.map((step) => (
                <div key={step.step} className="relative">
                  <div
                    className="absolute -top-3 -left-3 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs font-mono z-10"
                    style={{ background: "var(--color-brand-primary)" }}
                  >
                    {step.step}
                  </div>
                  <div className="glass-subtle rounded-xl p-5 pt-6 h-full">
                    <h3 className="font-semibold text-text-primary mb-3 font-display text-sm">
                      {step.title}
                    </h3>
                    <code
                      className="block rounded-lg p-2.5 text-xs font-mono overflow-x-auto mb-2 leading-relaxed"
                      style={{
                        background: "color-mix(in srgb, var(--color-cosmic-void) 60%, transparent)",
                        color: "var(--color-atlantean-teal-aqua)",
                      }}
                    >
                      {step.code}
                    </code>
                    <p className="text-xs text-text-secondary">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section>
          <div className="relative liquid-glass rounded-3xl overflow-hidden p-8 sm:p-12 text-center">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--color-brand-primary) 10%, transparent), transparent 50%, color-mix(in srgb, var(--color-gold-bright) 8%, transparent))",
              }}
            />
            <div className="relative max-w-2xl mx-auto">
              <h2 className="text-fluid-2xl font-display font-bold mb-4">
                Automate Your Creative Practice
              </h2>
              <p className="text-text-secondary font-body leading-relaxed mb-8">
                The Guardians run when you sleep. Download the templates, add
                your API key, and let the gates open on their own schedule.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://github.com/frankxai/arcanea-flow/tree/main/src/templates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary text-white font-semibold shadow-glow-brand hover:scale-[1.03] transition-all duration-200"
                >
                  <PhDownload weight="thin" size={18} />
                  Download All Templates
                </a>
                <Link
                  href="/arcanea-code"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl card-3d liquid-glass border border-white/[0.06] text-text-primary font-semibold hover:border-crystal/30 transition-all duration-200"
                >
                  Explore Dev Platform
                  <PhArrowRight weight="thin" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
