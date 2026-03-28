import Link from 'next/link';

export const metadata = {
  title: 'Encounters | Living Lore',
  description:
    'Interactive scenes from the Living Lore. Step into an encounter, meet the crew, and continue through the Chronicle.',
};

export default function EncounterLandingPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      <nav className="mb-8 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-text-muted">
          <li>
            <Link href="/living-lore" className="hover:text-atlantean-teal-aqua transition-colors">
              Living Lore
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text-primary">Encounter</li>
        </ol>
      </nav>

      <section className="liquid-glass-elevated rounded-2xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.25em] text-atlantean-teal-aqua mb-4">
          Interactive Narrative
        </p>
        <h1 className="font-cinzel text-3xl md:text-4xl text-text-primary mb-4">
          Encounters live inside the Chronicle.
        </h1>
        <p className="text-text-muted leading-relaxed mb-8">
          Arcanea&apos;s encounter scenes are tied to specific episodes, crew choices, and gate progression.
          Start from the Chronicle to enter a real scene, or meet the crew first if you want a cleaner way into the story.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/living-lore/chronicle"
            className="rounded-xl border border-atlantean-teal-aqua/20 bg-atlantean-teal-aqua/10 px-5 py-4 text-sm font-semibold text-atlantean-teal-aqua hover:bg-atlantean-teal-aqua/15 transition-colors"
          >
            Open the Chronicle
          </Link>
          <Link
            href="/living-lore/meet"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-sm font-semibold text-text-primary hover:bg-white/[0.05] transition-colors"
          >
            Meet the Crew First
          </Link>
        </div>
      </section>
    </main>
  );
}
