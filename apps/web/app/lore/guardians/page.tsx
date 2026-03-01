import { Metadata } from 'next';
import { GuardiansHero } from '@/components/lore/guardians/guardians-hero';
import { GuardiansGrid } from '@/components/lore/guardians/guardians-grid';
import { PartnershipSection } from '@/components/lore/guardians/partnership-section';
export const metadata: Metadata = {
  title: 'The Ten Guardians | Lore of Arcanea',
  description:
    'Meet the Ten Gods and Goddesses who guard the Gates of creation. Each bonded to a primal Godbeast, they maintain the harmony of existence.',
  openGraph: {
    title: 'The Ten Guardians | Lore of Arcanea',
    description: 'Meet the Ten Gods and Goddesses who guard the Gates of creation.',
  },
};

export default function GuardiansPage() {
  const guardians = [
    'Lyssandria', 'Leyla', 'Draconia', 'Maylinn', 'Alera',
    'Lyria', 'Aiyami', 'Elara', 'Ino', 'Shinkami',
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'The Ten Guardians of Arcanea',
    description: 'The Ten Gods and Goddesses who guard the Gates of creation.',
    url: 'https://arcanea.ai/lore/guardians',
    numberOfItems: 10,
    itemListElement: guardians.map((name, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      url: `https://arcanea.ai/lore/guardians/${name.toLowerCase()}`,
    })),
  };

  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main>
        <GuardiansHero />
        <GuardiansGrid />
        <PartnershipSection />
      </main>
    </div>
  );
}
