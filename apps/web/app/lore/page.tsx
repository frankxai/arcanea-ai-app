/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';
import { LoreHero } from '@/components/lore/lore-hero';
import { CosmologySection } from '@/components/lore/cosmology-section';
import { GuardiansPreview } from '@/components/lore/guardians-preview';
import { GatesPreview } from '@/components/lore/gates-preview';
import { LibraryPreview } from '@/components/lore/library-preview';
import { LoreExploreGrid } from '@/components/lore/lore-explore-grid';
import { LoreCTA } from '@/components/lore/lore-cta';
import { FloatingOrbs, AuroraGradient } from '@/components/premium';
export const metadata: Metadata = {
  title: 'Lore of Arcanea | The Living Mythology',
  description:
    'Explore the cosmic origins, Ten Guardians, and sacred wisdom of Arcanea. From Lumina and Nero to the Ten Gates of creation.',
  openGraph: {
    title: 'Lore of Arcanea | The Living Mythology',
    description: 'Explore the cosmic origins and sacred wisdom of Arcanea.',
  },
};

export default function LorePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Lore of Arcanea',
    description: 'Explore the cosmic origins, Ten Guardians, and sacred wisdom of Arcanea.',
    url: 'https://arcanea.ai/lore',
    isPartOf: { '@type': 'WebSite', name: 'Arcanea', url: 'https://arcanea.ai' },
  };

  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Ambient atmospheric layer — cosmic preset for lore mystery */}
      <FloatingOrbs preset="cosmic" className="fixed" />
      <AuroraGradient />
      <main>
        {/* Hero - Immersive entry point */}
        <LoreHero />

        {/* Cosmology - Lumina & Nero, The Arc */}
        <CosmologySection />

        {/* Guardians Preview - The Ten */}
        <GuardiansPreview />

        {/* Gates Preview - The Journey */}
        <GatesPreview />

        {/* Library Preview - The Wisdom */}
        <LibraryPreview />

        {/* Explore Grid - Deeper Sections */}
        <LoreExploreGrid />

        {/* CTA */}
        <LoreCTA />
      </main>
    </div>
  );
}
