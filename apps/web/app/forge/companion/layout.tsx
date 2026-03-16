import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forge a Companion',
  description:
    'Summon a bonded creature from 16 elemental archetypes. Choose an archetype, customize its traits, and bring your Companion to life.',
  openGraph: {
    title: 'Forge a Companion',
    description:
      'Summon a bonded creature from 16 elemental archetypes on Arcanea.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
