import { Metadata } from 'next';
import { LoreHero } from '@/components/lore/lore-hero';
import { CosmologySection } from '@/components/lore/cosmology-section';
import { GuardiansPreview } from '@/components/lore/guardians-preview';
import { GatesPreview } from '@/components/lore/gates-preview';
import { LibraryPreview } from '@/components/lore/library-preview';
import { LoreCTA } from '@/components/lore/lore-cta';
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

        {/* CTA */}
        <LoreCTA />
      </main>
    </div>
  );
}
