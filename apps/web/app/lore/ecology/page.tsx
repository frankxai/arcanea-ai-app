import type { Metadata } from 'next';

import { LivingAtlas } from '@/components/ecology/living-atlas';
import { ECOLOGY_ENTRIES } from '@/lib/ecology/catalog';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Living Atlas · Covenant Ecology',
  description: 'Explore the plants, creatures, fungi, signals, and costly ecological relationships that make Arcanea a living world.',
  alternates: { canonical: '/lore/ecology' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'The Living Atlas of Arcanea',
    description: 'Nothing here glows without reason. Trace the covenants that keep Arcanea alive.',
    type: 'website',
  },
};

export default function EcologyPage() {
  return <LivingAtlas entries={ECOLOGY_ENTRIES} />;
}
