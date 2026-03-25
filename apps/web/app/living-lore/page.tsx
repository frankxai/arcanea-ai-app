import Link from 'next/link';
import { getAllCrew } from '@/lib/living-lore/crew-data';
import { getActs } from '@/lib/living-lore/episode-loader';
import { JourneyMap } from '@/components/living-lore/journey-map';
import { LivingLoreHero } from '@/components/living-lore/living-lore-hero';
import { CrewSection } from './crew-section';
import { QuickAccessSection } from './quick-access-section';
import { CtaSection } from './cta-section';
import { AnimatedSection } from './animated-section';
import type { ActInfo } from '@/lib/living-lore/types';

export default async function LivingLorePage() {
  const crew = getAllCrew();

  let acts: ActInfo[];
  try {
    acts = await getActs();
  } catch {
    acts = [];
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-8">
      {/* Hero */}
      <LivingLoreHero />

      {/* The Crew */}
      <CrewSection crew={crew} />

      {/* The Chronicle */}
      <AnimatedSection className="mt-16 space-y-6">
        <div>
          <h2 className="text-2xl font-cinzel text-text-primary mb-2">
            The Chronicle
          </h2>
          <p className="text-text-muted text-sm">
            Acts and episodes mapped to the Ten Gates
          </p>
        </div>

        <JourneyMap acts={acts} />

        <div className="text-center">
          <Link
            href="/living-lore/chronicle"
            className="inline-block text-sm text-atlantean-teal-aqua hover:underline"
          >
            View all episodes
          </Link>
        </div>
      </AnimatedSection>

      {/* Quick Access */}
      <QuickAccessSection />

      {/* Begin Your Journey CTA */}
      <CtaSection />
    </main>
  );
}
