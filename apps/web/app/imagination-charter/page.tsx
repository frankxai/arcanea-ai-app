import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Imagination Is Infrastructure",
  description:
    "The Arcanea Imagination Charter: seven commitments for human authorship, provenance, cultural plurality, youth dignity, and participatory worldbuilding with AI.",
  alternates: { canonical: "https://arcanea.ai/imagination-charter" },
  openGraph: {
    title: "Imagination Is Infrastructure",
    description:
      "Before humanity builds a future, someone must imagine one worth living in.",
    url: "https://arcanea.ai/imagination-charter",
    type: "article",
    images: [
      {
        url: "/brand/arcanea-og.jpg",
        width: 1200,
        height: 630,
        alt: "The Arcanea Imagination Charter",
      },
    ],
  },
};

const covenant = [
  [
    "AIC-01",
    "Authorship remains visible",
    "Human creators remain attributable and economically legible. Intelligence can extend the canvas without erasing the hand that chose its meaning.",
  ],
  [
    "AIC-02",
    "Canon has state",
    "Official canon, community canon, experiments, and generated variations are visibly distinguished so contribution does not become confusion.",
  ],
  [
    "AIC-03",
    "Sources keep their history",
    "Training rights, reference rights, consent, and provenance travel with the work. A beautiful result does not cancel its obligations.",
  ],
  [
    "AIC-04",
    "Characters do not coerce",
    "Synthetic characters never use deceptive intimacy, dependency loops, or attachment mechanics to hold attention.",
  ],
  [
    "AIC-05",
    "Children retain the right to change",
    "Youth experiences minimize data, support guardianship, explain machine behavior, and avoid permanent identity profiles.",
  ],
  [
    "AIC-06",
    "Culture is relationship",
    "Inspiration is researched, credited, and transformed with respect. Plural worlds should deepen context rather than turn it into aesthetic inventory.",
  ],
  [
    "AIC-07",
    "Wonder carries consequence",
    "Beauty, strangeness, hope, and moral complexity outrank spectacle. A world should reveal choices, not hide them.",
  ],
];

const worlds = [
  [
    "Canon",
    "An authoritative lore graph with named authors, sources, states, and revisions.",
  ],
  [
    "Academy",
    "Worldbuilding, story intelligence, and creative practice that transfer skill to the creator.",
  ],
  [
    "Cinema",
    "Films and narrative experiences where continuity, provenance, and human direction remain inspectable.",
  ],
  [
    "Open protocols",
    "Portable tools for contribution, canon state, attribution, and collaborative creation.",
  ],
];

export default function ImaginationCharterPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "The Arcanea Imagination Charter",
    headline: "Imagination Is Infrastructure",
    description:
      "A creative covenant for participatory worldbuilding with artificial intelligence.",
    datePublished: "2026-08-12",
    dateModified: "2026-08-12",
    creator: {
      "@type": "Organization",
      name: "Arcanea",
      url: "https://arcanea.ai",
    },
    isPartOf: {
      "@type": "DigitalDocument",
      name: "The Starlight Accord",
      url: "https://starlight-intelligence.vercel.app/constitution",
    },
    mainEntityOfPage: "https://arcanea.ai/imagination-charter",
  };

  return (
    <main
      id="main-content"
      className="overflow-hidden bg-cosmic-deep text-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="relative min-h-[88svh] border-b border-white/[0.07] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute left-[-12%] top-[38%] h-px w-[72%] rotate-[-8deg] bg-gradient-to-r from-transparent via-[var(--arc-brand-atlantean-aqua)]/60 to-transparent" />
          <div className="absolute right-[-16%] top-[49%] h-px w-[72%] rotate-[11deg] bg-gradient-to-r from-transparent via-[var(--arc-brand-arcanean-gold)]/45 to-transparent" />
        </div>
        <div className="relative mx-auto grid min-h-[68svh] max-w-7xl gap-16 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--arc-brand-atlantean-aqua)]">
              Arcanea protocol · Imagination charter 1.0
            </p>
            <h1 className="mt-8 max-w-5xl font-display text-6xl font-semibold leading-[0.88] tracking-[-0.055em] sm:text-7xl lg:text-9xl">
              Imagination is
              <br />
              <span className="font-editorial font-normal italic text-[var(--arc-brand-arcanean-gold)]">
                infrastructure.
              </span>
            </h1>
            <p className="mt-9 max-w-2xl text-lg leading-8 text-white/65 md:text-xl">
              Before humanity builds a future, someone must imagine one worth
              living in. Arcanea is a living universe for participatory myth,
              benevolent futures, and human–AI creation.
            </p>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/worlds"
                className="rounded-lg border border-[var(--arc-brand-atlantean-aqua)]/40 bg-[var(--arc-brand-atlantean-aqua)]/[0.1] px-5 py-3 text-sm font-medium text-[var(--arc-brand-atlantean-aqua)] transition hover:bg-[var(--arc-brand-atlantean-aqua)]/[0.16]"
              >
                Enter the worlds
              </Link>
              <a
                href="#covenant"
                className="text-sm text-white/60 underline decoration-white/20 underline-offset-8 transition hover:text-white"
              >
                Read the covenant
              </a>
            </div>
          </div>
          <div className="lg:pb-2">
            <div className="border-l border-white/10 pl-6 sm:pl-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                WORLD PROTOTYPE / VALUE TRACE
              </p>
              <div className="mt-8 space-y-7">
                {[
                  "Power becomes relationship",
                  "Abundance retains meaning",
                  "Memory preserves consent",
                  "Intelligence learns stewardship",
                ].map((line, index) => (
                  <div key={line} className="grid grid-cols-[30px_1fr] gap-4">
                    <span className="font-mono text-xs text-[var(--arc-brand-arcanean-gold)]/70">
                      0{index + 1}
                    </span>
                    <p className="border-b border-white/[0.07] pb-7 font-editorial text-2xl text-white/85">
                      {line}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-8 max-w-sm text-sm leading-6 text-white/40">
                A world is not a prediction. It is a place to examine what a
                value costs when it becomes real.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[.62fr_1fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--arc-brand-atlantean-aqua)]">
              The cultural layer
            </p>
            <h2 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-6xl">
              Every technical future arrives inside a story.
            </h2>
          </div>
          <div className="space-y-7 text-lg leading-8 text-white/65">
            <p>
              When the dominant stories of advanced intelligence are domination,
              extinction, replacement, or escape, civilization rehearses fear
              long before it chooses policy or product. Risk must be confronted
              honestly. But a culture unable to describe desirable futures
              cannot deliberately build them.
            </p>
            <p>
              Arcanea creates worlds, characters, music, artifacts, schools, and
              participatory stories that let people experience futures where
              intelligence deepens creativity, courage, relationship,
              stewardship, and wonder. These worlds are not official
              predictions. They are prototypes for values.
            </p>
            <p>
              Generative systems let more people become worldbuilders. That
              power carries obligations. A living canon needs provenance,
              consent, cultural respect, developmental care, and a clear
              relationship between official story, community contribution, and
              machine variation.
            </p>
            <blockquote className="border-l-2 border-[var(--arc-brand-arcanean-gold)]/60 pl-8 font-editorial text-3xl leading-tight text-white/90 md:text-4xl">
              AI can extend the canvas. It does not remove the responsibility to
              decide what the world means.
            </blockquote>
          </div>
        </div>
      </section>

      <section
        id="covenant"
        className="border-y border-white/[0.07] bg-white/[0.018] px-5 py-24 sm:px-8 lg:px-12 lg:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <header className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--arc-brand-atlantean-aqua)]">
              The creative covenant
            </p>
            <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              Seven constraints for living worlds.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/60">
              The covenant separates generative spectacle from a culture people
              can trust, contribute to, and carry forward.
            </p>
          </header>
          <div className="mt-16 divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {covenant.map(([id, title, body]) => (
              <article
                key={id}
                className="grid gap-5 py-8 md:grid-cols-[90px_300px_1fr] md:gap-10 md:py-10"
              >
                <span className="font-mono text-xs text-[var(--arc-brand-arcanean-gold)]/70">
                  {id}
                </span>
                <h3 className="font-display text-2xl font-semibold text-white/90">
                  {title}
                </h3>
                <p className="max-w-2xl leading-7 text-white/55">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <header className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--arc-brand-atlantean-aqua)]">
                The world system
              </p>
              <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                From imagination to inspectable canon.
              </h2>
            </div>
            <p className="max-w-xl self-end text-lg leading-8 text-white/60">
              The product is not a stream of disconnected generations. It is a
              system where creators can see what is official, what is proposed,
              who contributed, and how an idea became part of the world.
            </p>
          </header>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-2">
            {worlds.map(([title, body], index) => (
              <article key={title} className="min-h-64 bg-cosmic-deep p-8">
                <span className="font-mono text-[11px] text-[var(--arc-brand-atlantean-aqua)]">
                  0{index + 1}
                </span>
                <h3 className="mt-16 font-display text-2xl font-semibold text-white/90">
                  Arcanea {title}
                </h3>
                <p className="mt-3 max-w-md leading-7 text-white/50">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.07] px-5 py-24 text-center sm:px-8 lg:py-36">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--arc-brand-atlantean-aqua)]">
          Inherited from the Starlight Accord
        </p>
        <h2 className="mx-auto mt-7 max-w-5xl font-editorial text-5xl leading-[1.03] text-white/95 md:text-7xl">
          Intelligence gives civilization more power to build.
          <br />
          <em className="text-[var(--arc-brand-arcanean-gold)]">
            Imagination determines what that power is for.
          </em>
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/worlds"
            className="rounded-lg border border-[var(--arc-brand-atlantean-aqua)]/40 bg-[var(--arc-brand-atlantean-aqua)]/[0.1] px-5 py-3 text-sm font-medium text-[var(--arc-brand-atlantean-aqua)]"
          >
            Explore Arcanea
          </Link>
          <a
            href="https://starlight-intelligence.vercel.app/constitution"
            className="text-sm text-white/60 underline decoration-white/20 underline-offset-8"
          >
            Read the Starlight Accord
          </a>
        </div>
      </section>
    </main>
  );
}
