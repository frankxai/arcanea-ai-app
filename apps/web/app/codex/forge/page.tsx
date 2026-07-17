import type { Metadata } from 'next';
import Link from 'next/link';
import { CreatureForge } from '@/components/codex/creature-forge';
import { PhArrowLeft, PhInfo, PhSparkle } from '@/lib/phosphor-icons';

export const metadata: Metadata = {
  title: 'Creature Forge — Original Bestiary Blueprint',
  description:
    'Build an original creature from ecology, silhouette, affinity, relationship, and consequence. Export a portable JSON blueprint and media prompt.',
  alternates: { canonical: '/codex/forge' },
};

export default function CreatureForgePage() {
  return (
    <main className="min-h-screen bg-cosmic-deep text-text-primary">
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-28 sm:px-8 sm:pt-36">
        <Link className="inline-flex items-center gap-2 text-sm text-text-muted transition hover:text-brand-primary" href="/codex">
          <PhArrowLeft aria-hidden className="h-4 w-4" />
          Living Codex
        </Link>
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3 py-1.5 text-xs font-medium text-brand-primary">
              <PhSparkle aria-hidden className="h-4 w-4" />
              Creature Forge · local-first
            </div>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-text-primary sm:text-6xl">
              Begin with a life,
              {' '}
              <span className="mt-2 block font-serif font-normal italic text-text-secondary">not a list of powers.</span>
            </h1>
          </div>
          <p className="max-w-xl text-base leading-7 text-text-secondary lg:pb-2">
            Design an original being through ecology, silhouette, bond, and consequence. The Forge creates a portable draft in your browser. It does not call an AI model, publish, or alter Arcanea canon.
          </p>
        </div>

        <div className="mt-10 flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-sm leading-6 text-text-secondary">
          <PhInfo aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
          <p>
            The Godbeasts are canonical beings. Forge output is explicitly marked <strong className="font-medium text-text-primary">private-draft / not-canon</strong> until a creator chooses a separate review path.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <CreatureForge />
      </section>
    </main>
  );
}
