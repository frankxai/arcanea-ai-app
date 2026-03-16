import type { Metadata } from 'next';
import { VariationsShowcase } from './variations-showcase';

export const metadata: Metadata = {
  title: 'Design Arena — Homepage Variations',
  description: '10 competing homepage designs for Arcanea.',
  robots: { index: false },
};

export const dynamic = 'force-dynamic';

export default function VariationsPage() {
  return <VariationsShowcase />;
}
