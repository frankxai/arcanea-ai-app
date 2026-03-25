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
      {/* Meet the Crew Banner */}
      <section className="mb-8">
        <Link
          href="/living-lore/meet"
          className="group block liquid-glass-elevated rounded-2xl p-6 md:p-8 hover:border-atlantean-teal-aqua/20 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(127,255,212,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-atlantean-teal-aqua mb-2">
                New &mdash; Start Here
              </p>
              <h2 className="font-cinzel text-xl md:text-2xl text-text-primary mb-1">
                Meet the Crew
              </h2>
              <p className="text-sm text-text-muted max-w-md">
                Seven beings. Ten Gates. Choose your companion and begin
                the journey.
              </p>
            </div>
            <div className="flex items-center gap-2 text-atlantean-teal-aqua text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Begin
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>
        </Link>
      </section>

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
