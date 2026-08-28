import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developers — Arcanea Interfaces Preview",
  description:
    "Preview interoperable worldbuilding interfaces with explicit licenses, evidence states, and a protected Arcanea canon boundary.",
  openGraph: {
    title: "Developers — Arcanea Interfaces Preview",
    description:
      "Technical interfaces are licensed per component. Arcanea canon and trademarks are not included.",
  },
  alternates: { canonical: "/developers" },
};

const boundaries = [
  {
    title: "Arcanea Universe",
    status: "Protected IP",
    body: "Stories, characters, Guardians, Godbeasts, manuscripts, music, art, screen and game continuity. All rights reserved unless a written license says otherwise.",
  },
  {
    title: "Arcanea Connector",
    status: "Creator experience",
    body: "Guided worldbuilding across writing, images, music, video briefs, and cinematic web. A creator's original world remains separate from Arcanea.",
  },
  {
    title: "Starlight",
    status: "Technical substrate",
    body: "Schemas, validators, adapters, export bundles, provider routing, and receipts. Every component must state its own source and license.",
  },
];

const evidence = [
  ["World Graph", "Preview", "Draft schema and internal implementation evidence"],
  ["Agent / Connector packet", "Preview", "Provider-neutral task and receipt contract"],
  ["Rights manifest", "In review", "Governance proposal; counsel review still required"],
  ["Asset provenance", "Planned", "Contract defined; production implementation pending"],
  ["Portable export", "In review", "Internal build; public conformance evidence pending"],
  ["Canon validator", "Preview", "Repository governance audit exists; broader validators pending"],
];

export default function DevelopersPage() {
  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-cosmic-mesh opacity-40" />

      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-7 py-12 sm:px-12 sm:py-16">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--arc-brand-atlantean-teal)]">
            Developer preview
          </p>
          <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Open interfaces. Protected worlds.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg">
            Arcanea is defining portable interfaces for creator-owned worlds.
            This page intentionally withholds package, tool, skill, command, model,
            and install counts until the current build can generate and verify them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/protocol"
              className="rounded-xl bg-[var(--arc-brand-atlantean-teal)] px-5 py-3 text-sm font-semibold text-[var(--arc-cosmic-void)]"
            >
              Review interface status
            </Link>
            <a
              href="https://github.com/frankxai/arcanea/pull/116"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 hover:border-white/30 hover:text-white"
            >
              Review governance proposal
            </a>
          </div>
        </section>

        <section className="py-16" aria-labelledby="boundaries-heading">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
            The boundary
          </p>
          <h2 id="boundaries-heading" className="font-display text-3xl font-bold">
            Three layers, three different rights surfaces
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {boundaries.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--arc-brand-atlantean-teal)]">
                  {item.status}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/55">
            Using Arcanea tools does not make a creator's world Arcanea canon.
            An open-source license on one technical component does not grant story,
            adaptation, merchandise, training, or trademark rights.
          </p>
        </section>

        <section className="pb-16" aria-labelledby="evidence-heading">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
            Current evidence
          </p>
          <h2 id="evidence-heading" className="font-display text-3xl font-bold">
            Status without roadmap theater
          </h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.035] text-[10px] uppercase tracking-[0.18em] text-white/45">
                <tr>
                  <th className="px-5 py-4">Interface</th>
                  <th className="px-5 py-4">State</th>
                  <th className="px-5 py-4">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {evidence.map(([name, state, proof]) => (
                  <tr key={name} className="border-b border-white/[0.06] last:border-0">
                    <td className="px-5 py-4 font-medium text-white/85">{name}</td>
                    <td className="px-5 py-4 font-mono text-xs text-[var(--arc-brand-atlantean-teal)]">{state}</td>
                    <td className="px-5 py-4 text-white/55">{proof}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--arc-brand-arcanean-gold)]/20 bg-[var(--arc-brand-arcanean-gold)]/[0.035] p-8 sm:p-10">
          <h2 className="font-display text-2xl font-bold">Before adopting a component</h2>
          <ol className="mt-5 grid gap-4 text-sm leading-relaxed text-white/65 sm:grid-cols-3">
            <li><span className="mr-2 font-mono text-[var(--arc-brand-arcanean-gold)]">01</span>Verify the exact repository, version, root license, nested license, and NOTICE.</li>
            <li><span className="mr-2 font-mono text-[var(--arc-brand-arcanean-gold)]">02</span>Confirm protected Arcanea content, private prompts, datasets, and brand assets are excluded.</li>
            <li><span className="mr-2 font-mono text-[var(--arc-brand-arcanean-gold)]">03</span>Run the documented tests and retain a receipt. A successful install is not conformance.</li>
          </ol>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="https://github.com/frankxai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[var(--arc-brand-arcanean-gold)] hover:text-white"
            >
              Inspect the GitHub estate
            </a>
            <span className="text-white/20">·</span>
            <Link href="/contact" className="text-sm font-semibold text-white/65 hover:text-white">
              Discuss an integration
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
