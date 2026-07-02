import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CREATURES, DANGER_COLORS, getCreature } from '../creatures-data';

export function generateStaticParams() {
  return CREATURES.map((creature) => ({ id: creature.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const creature = getCreature(id);

  if (!creature) {
    return { title: 'Creature Not Found — Bestiary of Creation' };
  }

  return {
    title: `${creature.name} — Bestiary of Creation`,
    description: creature.description,
    openGraph: {
      title: `${creature.name} — ${creature.subtitle}`,
      description: creature.description,
    },
  };
}

export default async function CreatureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creature = getCreature(id);

  if (!creature) {
    notFound();
  }

  const dangerColors = DANGER_COLORS[creature.danger];
  const related = CREATURES.filter(
    (c) => c.category === creature.category && c.id !== creature.id,
  ).slice(0, 3);

  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-8">
      <Link
        href="/bestiary"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-draconic-crimson transition-colors mb-8"
      >
        &larr; Back to the Bestiary
      </Link>

      <section className="relative overflow-hidden rounded-3xl liquid-glass p-10">
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
          <div
            className="absolute -left-24 top-16 h-72 w-72 rounded-full blur-3xl"
            style={{ backgroundColor: `${creature.color}30` }}
          />
        </div>

        <div className="relative">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-6xl">{creature.icon}</span>
            <span
              className="rounded-full px-3 py-1 text-xs uppercase tracking-wider"
              style={{ backgroundColor: dangerColors.bg, color: dangerColors.text }}
            >
              {creature.danger} danger
            </span>
          </div>

          <p className="text-xs uppercase tracking-[0.3em] text-draconic-crimson mb-2">
            {creature.category}
          </p>

          <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            {creature.name}
          </h1>
          <p className="mt-2 text-lg italic text-text-muted">{creature.subtitle}</p>

          <p className="mt-6 text-lg text-text-secondary leading-relaxed">
            {creature.description}
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl liquid-glass p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-atlantean-teal">
            Habitat
          </h2>
          <p className="text-text-secondary">{creature.habitat}</p>
        </div>
        <div className="rounded-2xl liquid-glass p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold-bright">
            Weakness
          </h2>
          <p className="text-text-secondary">{creature.weakness}</p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl liquid-glass p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-draconic-crimson">
          Symptoms
        </h2>
        <div className="flex flex-wrap gap-2">
          {creature.symptoms.map((symptom) => (
            <span
              key={symptom}
              className="rounded-full border border-cosmic-border bg-cosmic-raised px-3 py-1.5 text-sm text-text-muted"
            >
              {symptom}
            </span>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-xl font-semibold text-text-primary">
            More {creature.category}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/bestiary/${r.id}`}
                className="rounded-xl liquid-glass p-4 hover:border-draconic-crimson/40 transition-colors"
              >
                <span className="text-2xl">{r.icon}</span>
                <p className="mt-2 text-sm font-semibold text-text-primary">{r.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
