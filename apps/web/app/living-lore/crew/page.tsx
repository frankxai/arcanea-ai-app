import { getAllCrew } from '@/lib/living-lore/crew-data';
import { CrewCard } from '@/components/living-lore/crew-card';
import { CrewPageAnimated } from './animated';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Crew — Living Lore',
  description:
    'Meet the seven companions who journey through the Ten Gates of Arcanea.',
};

export default function CrewPage() {
  const crew = getAllCrew();

  return (
    <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-8">
      {/* Ambient orbs */}
      <div className="absolute top-[5%] left-[8%] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(127,255,212,0.10)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(147,112,219,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      {/* Header */}
      <section className="mb-12 text-center">
        <h1 className="font-display text-4xl font-semibold text-gradient-cosmic md:text-5xl">
          The Crew
        </h1>
        <p className="mt-3 text-lg text-text-muted">
          Seven perspectives on one journey
        </p>
      </section>

      {/* Crew Grid */}
      <CrewPageAnimated crew={crew} />
    </main>
  );
}
