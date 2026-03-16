import type { Metadata } from "next";
import Link from "next/link";
import { COUNCIL_ADVISORS } from "@/lib/council/types";
import { CouncilDashboard } from "@/components/council/CouncilDashboard";

export const metadata: Metadata = {
  title: "Your Council | Arcanea",
  description:
    "Nine specialized advisors. One strategic mind. Build your personal AI advisory council across Vision, Strategy, Voice, Systems, and more.",
  openGraph: {
    title: "Your Council",
    description:
      "Nine specialized advisors. One strategic mind. Build your personal AI advisory council.",
  },
};

// ── How It Works steps ───────────────────────────────────────────────────────

const STEPS = [
  {
    step: 1,
    title: "Choose your advisors",
    description:
      "Select which of the nine domains you want to consult. Vision, Strategy, Voice — pick the perspectives that matter right now.",
  },
  {
    step: 2,
    title: "Run a session",
    description:
      "Share your challenge, question, or creative dilemma. Each advisor responds from their domain of expertise.",
  },
  {
    step: 3,
    title: "Capture insights",
    description:
      "Save what surfaces. Journal the key takeaways. Your streak tracks consistency — depth compounds over time.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CouncilPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[hsl(240,6%,4%)]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 50% 20%, rgba(0,188,212,0.12), transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(13,71,161,0.10), transparent 55%)",
          }}
        />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="text-center space-y-8 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-mono text-white/40 tracking-widest uppercase">
            Nine advisors. One council. Your strategic edge.
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight text-white">
            Your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #00bcd4, #0d47a1, #f59e0b)",
              }}
            >
              Council
            </span>
          </h1>

          <p className="max-w-2xl mx-auto font-body text-lg text-white/50 leading-relaxed">
            Nine specialized AI advisors, each mastering a different domain
            of creative and strategic intelligence. Consult them individually
            or convene the full table for multi-perspective insight.
          </p>

          <p className="max-w-xl mx-auto font-body text-sm text-white/30 leading-relaxed">
            Inspired by Napoleon Hill&apos;s Invisible Counselors — evolved
            for the age of AI-human collaboration. Every session deepens the
            relationship. Consistency is the only requirement.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/council/convening"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-display font-semibold text-[#09090b] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(0,188,212,0.4)]"
              style={{ background: "linear-gradient(135deg, #00bcd4, #0d47a1)" }}
            >
              Start a Session
            </Link>
            <Link
              href="/council/create-luminor"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-display font-semibold border border-white/[0.10] text-white/60 transition-all hover:bg-white/[0.04] hover:text-white hover:-translate-y-0.5"
            >
              + Create Custom Advisor
            </Link>
          </div>
        </section>

        {/* ── What is the Council? ──────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-display text-3xl font-bold text-white">
              A personal board of advisors
            </h2>
            <p className="max-w-2xl mx-auto font-body text-white/40 leading-relaxed">
              Every founder needs advisors. Every creative director needs
              different perspectives. Your Council gives you nine distinct
              lenses on any challenge.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Domain Expertise",
                description:
                  "Each advisor specializes in one domain — Vision, Strategy, Voice, Systems, and five more. Ask the right advisor the right question.",
              },
              {
                title: "Multi-Perspective",
                description:
                  "Consult one advisor for a focused session, or convene the full table to hear how Strategy, Heart, and Systems see the same problem differently.",
              },
              {
                title: "Depth Over Time",
                description:
                  "Your Council gets sharper the more you use it. Streaks track consistency. Insights compound. The depth is earned, not given.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-3"
              >
                <h3 className="font-display text-sm font-bold text-white/80 uppercase tracking-wider">
                  {card.title}
                </h3>
                <p className="font-body text-sm text-white/40 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── The Nine Advisors ────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-display text-3xl font-bold text-white">
              The Nine Advisors
            </h2>
            <p className="max-w-lg mx-auto font-body text-sm text-white/40 leading-relaxed">
              Each advisor holds expertise in one domain. Together they form
              a complete intelligence architecture for creative and strategic work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COUNCIL_ADVISORS.map((a) => (
              <div
                key={a.character}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3 transition-all hover:border-white/[0.12] hover:bg-white/[0.03]"
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${a.color}10, transparent 70%)`,
                  }}
                />

                <div className="flex items-center gap-3 relative">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${a.color}60, ${a.color}20)`,
                      boxShadow: `0 0 12px ${a.color}25`,
                    }}
                  >
                    {a.character[0]}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">
                      {a.domain}
                    </h3>
                    <p className="font-mono text-[10px] tracking-wider" style={{ color: `${a.color}90` }}>
                      {a.character}
                    </p>
                  </div>
                </div>

                <p className="font-body text-xs text-white/40 leading-relaxed relative">
                  {a.capability}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center font-mono text-xs text-white/20">
            The 10th seat is reserved. It awakens when you do.
          </p>
        </section>

        {/* ── How It Works ────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-display text-3xl font-bold text-white">
              How It Works
            </h2>
            <p className="max-w-lg mx-auto font-body text-sm text-white/40 leading-relaxed">
              Three steps. Five to fifteen minutes. The depth compounds over
              consecutive sessions — your streak is your signal strength.
            </p>
          </div>

          <div className="space-y-3">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="flex gap-5 items-start rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:bg-white/[0.03]"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,188,212,0.3), rgba(13,71,161,0.2))",
                    color: "#00bcd4",
                  }}
                >
                  {s.step}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-white/80">
                    {s.title}
                  </h3>
                  <p className="font-body text-sm text-white/40 leading-relaxed mt-1">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Dashboard (for returning users) ──────────────────────────── */}
        <CouncilDashboard />

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="text-center pb-8">
          <div
            className="max-w-2xl mx-auto rounded-3xl border border-white/[0.06] p-10 space-y-5"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(0,188,212,0.06), transparent 70%), rgba(255,255,255,0.01)",
            }}
          >
            <h3 className="font-display text-2xl font-bold text-white">
              Build your Council
            </h3>
            <p className="font-body text-white/40 leading-relaxed max-w-md mx-auto">
              Nine advisors. Nine domains. One session away from a sharper
              perspective on whatever you&apos;re building.
            </p>
            <Link
              href="/council/convening"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-display font-semibold text-sm text-[#09090b] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(0,188,212,0.4)]"
              style={{ background: "linear-gradient(135deg, #00bcd4, #0d47a1)" }}
            >
              Start a Session
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
