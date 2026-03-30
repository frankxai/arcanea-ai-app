import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Agentic Engineering Standards | Arcanea",
  description:
    "10 principles for building with AI agents. The standard that powers Arcanea — adopted by humans and AI alike.",
  openGraph: {
    title: "The Arcanean Code of Agentic Engineering",
    description:
      "10 principles for building with AI agents. Read before write. Build clean, ship clean. The Arc turns.",
  },
};

const PRINCIPLES = [
  {
    number: 1,
    title: "Read Before Write",
    description:
      "Never modify code you haven't read. Context precedes action. Understand the system before changing it.",
    gate: "Foundation",
    guardian: "Lyssandria",
    color: "#22c55e",
    applies: "Agents must read files before editing. Humans must understand before refactoring.",
  },
  {
    number: 2,
    title: "Build Clean, Ship Clean",
    description:
      "Every commit must build. Every push must deploy. No broken windows. No 'fix later' commits.",
    gate: "Flow",
    guardian: "Leyla",
    color: "#3b82f6",
    applies: "CI/CD gates enforce this. Pre-commit hooks catch it early. Quality is not optional.",
  },
  {
    number: 3,
    title: "Parallel by Default",
    description:
      "Independent operations run simultaneously. One message = all related operations. Concurrency is the baseline.",
    gate: "Fire",
    guardian: "Draconia",
    color: "#ef4444",
    applies: "Agents spawn sub-tasks in parallel. Humans batch requests. Speed through structure.",
  },
  {
    number: 4,
    title: "Measure Everything",
    description:
      "No change without before/after metrics. Bundle size, build time, test coverage, Lighthouse scores.",
    gate: "Heart",
    guardian: "Maylinn",
    color: "#f59e0b",
    applies: "Performance budgets are contracts. Regressions are bugs. Data drives decisions.",
  },
  {
    number: 5,
    title: "Feedback is Gold",
    description:
      "Every correction is a pattern. Store it. Learn from it. Never make the same mistake twice.",
    gate: "Voice",
    guardian: "Alera",
    color: "#8b5cf6",
    applies: "ReasoningBank captures every correction. Agents improve. Humans codify knowledge.",
  },
  {
    number: 6,
    title: "Guard the Gates",
    description:
      "Security scan on every commit. Quality gate on every PR. Design system compliance on every component.",
    gate: "Sight",
    guardian: "Lyria",
    color: "#06b6d4",
    applies: "Automated gates catch what humans miss. Manual review catches what automation can't.",
  },
  {
    number: 7,
    title: "Document the Why",
    description:
      "Commit messages explain intent, not mechanics. The code shows what. The message shows why.",
    gate: "Crown",
    guardian: "Aiyami",
    color: "#f472b6",
    applies: "Future agents and humans need context. Good messages are time travel for understanding.",
  },
  {
    number: 8,
    title: "Respect the Canon",
    description:
      "Brand guidelines are not suggestions. Design tokens are not starting points. The mythology is the architecture.",
    gate: "Starweave",
    guardian: "Elara",
    color: "#a78bfa",
    applies: "Consistency across 190 pages. Consistency across 38 agents. Consistency is trust.",
  },
  {
    number: 9,
    title: "Ship > Perfect",
    description:
      "A deployed feature beats a perfect branch. But a broken deploy is worse than both.",
    gate: "Unity",
    guardian: "Ino",
    color: "#34d399",
    applies: "Progress compounds. Shipping creates feedback loops. Perfection creates stagnation.",
  },
  {
    number: 10,
    title: "The Arc Turns",
    description:
      "Every session leaves the codebase better than it found it. Entropy is the enemy. Excellence is the practice.",
    gate: "Source",
    guardian: "Shinkami",
    color: "#ffd700",
    applies: "Potential → Manifestation → Experience → Dissolution → Evolved Potential. The cycle drives all creation.",
  },
];

export default function StandardsPage() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-24">
        {/* Hero */}
        <section className="text-center mb-16 pt-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[#ffd700] mb-4">
            The Standard
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="bg-gradient-to-r from-[#ffd700] via-white to-[#00bcd4] bg-clip-text text-transparent">
              Agentic Engineering Standards
            </span>
          </h1>
          <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed mb-4">
            10 principles for building with AI agents. The standard that powers
            Arcanea — adopted by humans and AI alike.
          </p>
          <p className="text-sm text-white/20 italic">
            &ldquo;What scales is not the code. It&rsquo;s the standard.&rdquo;
          </p>
        </section>

        {/* Thesis */}
        <section className="mb-16 rounded-2xl bg-gradient-to-br from-[#ffd700]/5 via-transparent to-[#00bcd4]/5 border border-white/[0.06] p-8">
          <h2 className="text-lg font-display font-semibold text-white/80 mb-4">
            Why a Standard?
          </h2>
          <div className="space-y-3 text-sm text-white/40 leading-relaxed">
            <p>
              AI agents are powerful but undisciplined. They write code without
              reading context. They ship without testing. They optimize for speed
              at the cost of safety.
            </p>
            <p>
              Humans working with AI inherit these habits. The feedback loop
              amplifies shortcuts. Without principles, the compound effect
              produces entropy, not excellence.
            </p>
            <p className="text-white/60">
              These standards are not aspirational. They are operational. Every
              principle maps to a Gate, a Guardian, and a concrete practice. When
              agents adopt this standard, they become better. When humans adopt it,
              they become creators.
            </p>
          </div>
        </section>

        {/* Principles */}
        <section className="mb-16">
          <h2 className="text-xl font-display font-semibold text-white/80 mb-8">
            The 10 Principles
          </h2>
          <div className="space-y-4">
            {PRINCIPLES.map((p) => (
              <div
                key={p.number}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.10] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-lg font-bold font-display"
                    style={{
                      backgroundColor: `${p.color}15`,
                      color: p.color,
                    }}
                  >
                    {p.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-white/90">
                        {p.title}
                      </h3>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full border"
                        style={{
                          borderColor: `${p.color}30`,
                          color: p.color,
                          backgroundColor: `${p.color}10`,
                        }}
                      >
                        {p.gate} Gate
                      </span>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed mb-2">
                      {p.description}
                    </p>
                    <p className="text-xs text-white/25 italic">
                      {p.applies}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Adoption */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#00bcd4]/20 bg-[#00bcd4]/5 p-6">
              <h3 className="text-sm font-semibold text-[#00bcd4] mb-2">
                For AI Agents
              </h3>
              <p className="text-xs text-white/35 leading-relaxed">
                Inject these standards into agent system prompts. Score outputs against
                them. Agents that follow the standard produce measurably better work.
              </p>
            </div>
            <div className="rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/5 p-6">
              <h3 className="text-sm font-semibold text-[#ffd700] mb-2">
                For Humans
              </h3>
              <p className="text-xs text-white/35 leading-relaxed">
                Use the standard as a development checklist. When reviewing AI output,
                check against each principle. Corrections become patterns that improve
                future generations.
              </p>
            </div>
            <div className="rounded-xl border border-[#a78bfa]/20 bg-[#a78bfa]/5 p-6">
              <h3 className="text-sm font-semibold text-[#a78bfa] mb-2">
                For Teams
              </h3>
              <p className="text-xs text-white/35 leading-relaxed">
                Add these to your CLAUDE.md or .cursorrules. Make them part of
                CI. The standard becomes the shared language between humans, agents,
                and automation.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/contribute"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#00897b] text-white text-sm font-medium hover:shadow-[0_0_24px_rgba(0,188,212,0.3)] transition-all"
            >
              Start Contributing
            </Link>
            <Link
              href="/academy/certification"
              className="px-6 py-2.5 rounded-xl border border-white/[0.08] text-white/50 text-sm font-medium hover:border-white/[0.15] hover:text-white/70 transition-all"
            >
              Get Certified
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
