/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Bestiary of Creation - Creative Obstacles Library
 *
 * The Bestiary catalogs the creatures that inhabit every creator's journey:
 * Blocks, fears, resistances, and the inner dragons we must face.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { CREATURES, DANGER_COLORS } from './creatures-data';

export const metadata: Metadata = {
  title: 'Bestiary of Creation',
  description:
    'Know your creative obstacles. The Bestiary catalogs the creatures every creator must face.',
  openGraph: {
    title: 'Bestiary of Creation',
    description: 'Know your creative obstacles to overcome them.',
  },
};

export default function BestiaryPage() {
  return (
    <>
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-8">
      {/* Hero Section */}
      <section className="relative mb-16 overflow-hidden rounded-3xl liquid-glass p-10">
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
          <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-draconic-crimson/30 blur-3xl" />
          <div className="absolute right-[-10%] top-1/3 h-80 w-80 rounded-full bg-cosmic-purple/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-gold-bright/10 blur-2xl" />
        </div>

        <div className="relative max-w-3xl">
          <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-draconic-crimson">
            <span>The Bestiary of Creation</span>
            <span className="hidden h-px flex-1 bg-cosmic-border sm:block" aria-hidden="true" />
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-draconic-crimson via-cosmic-purple to-atlantean-teal bg-clip-text text-transparent">
              Know Your Obstacles
            </span>
          </h1>

          <p className="mt-6 text-xl text-text-secondary leading-relaxed">
            Every creator faces inner creatures that block the path. The Bestiary catalogs these
            obstacles so you may recognize them—and overcome them.
          </p>

          <blockquote className="mt-8 border-l-4 border-gold-bright/60 pl-6 italic text-gold-bright">
            "To name a thing is to gain power over it."
            <footer className="mt-2 text-sm text-text-muted not-italic">
              — Ancient Arcanean Wisdom
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Danger Level Legend */}
      <section className="mb-8">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-text-muted">Danger Level:</span>
          {Object.entries(DANGER_COLORS).map(([level, colors]) => (
            <span
              key={level}
              className="rounded-full px-3 py-1 text-xs uppercase tracking-wider"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {level}
            </span>
          ))}
        </div>
      </section>

      {/* Creatures Grid */}
      <section className="mb-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {CREATURES.map((creature) => (
            <CreatureCard key={creature.id} creature={creature} />
          ))}
        </div>
      </section>

      {/* How to Use */}
      <section className="rounded-3xl liquid-glass p-8">
        <h2 className="mb-6 font-display text-2xl font-semibold text-text-primary">
          How to Use the Bestiary
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-atlantean-teal">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-atlantean-teal/20 text-sm">1</span>
              Recognize
            </h3>
            <p className="text-sm text-text-secondary">
              When you feel blocked, consult the Bestiary. Name the creature you are facing.
              Recognition is the first step to power.
            </p>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gold-bright">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-bright/20 text-sm">2</span>
              Understand
            </h3>
            <p className="text-sm text-text-secondary">
              Study its habitat and symptoms. Understand that this creature visits all creators.
              You are not alone in facing it.
            </p>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-draconic-crimson">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-draconic-crimson/20 text-sm">3</span>
              Apply Weakness
            </h3>
            <p className="text-sm text-text-secondary">
              Every creature has a weakness. Apply the antidote directly. The creature may resist,
              but persistence prevails.
            </p>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}

interface CreatureCardProps {
  creature: (typeof CREATURES)[0];
}

function CreatureCard({ creature }: CreatureCardProps) {
  const dangerColors = DANGER_COLORS[creature.danger as keyof typeof DANGER_COLORS];

  return (
    <Link
      href={`/bestiary/${creature.id}`}
      className="group relative overflow-hidden rounded-2xl liquid-glass p-6 transition-all hover:border-draconic-crimson/50 hover:shadow-[0_0_50px_rgba(220,38,38,0.15)] hover-lift"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true">
        <div
          className="absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: `${creature.color}20` }}
        />
      </div>

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-4xl">{creature.icon}</span>
          <span
            className="rounded-full px-3 py-1 text-xs uppercase tracking-wider"
            style={{ backgroundColor: dangerColors.bg, color: dangerColors.text }}
          >
            {creature.danger}
          </span>
        </div>

        <h3 className="font-display text-xl font-semibold text-text-primary group-hover:text-draconic-crimson transition-colors">
          {creature.name}
        </h3>
        <p className="mt-1 text-sm italic text-text-muted">{creature.subtitle}</p>

        <p className="mt-3 text-sm text-text-secondary line-clamp-3">{creature.description}</p>

        <div className="mt-4">
          <p className="text-xs text-text-muted">
            <span className="font-semibold text-atlantean-teal">Weakness:</span>{' '}
            {creature.weakness}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {creature.symptoms.slice(0, 2).map((symptom) => (
            <span
              key={symptom}
              className="rounded-full border border-cosmic-border bg-cosmic-raised px-2 py-1 text-xs text-text-muted"
            >
              {symptom}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-draconic-crimson opacity-0 transition-opacity group-hover:opacity-100">
          <span>Study creature</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
