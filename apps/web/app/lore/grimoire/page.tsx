import { Metadata } from 'next';
import { GrimoirePage } from '@/components/lore/grimoire/grimoire-page';

export const metadata: Metadata = {
  title: 'The Magic System | Lore of Arcanea',
  description:
    'The Grimoire of Arcanea — every spell classified on four axes: element, discipline (Attack, Defense, Summoning), tier (Light to Divine), and the Gate a caster must have opened to wield it.',
  openGraph: {
    title: 'The Magic System | Lore of Arcanea',
    description:
      'Three disciplines, seven tiers, the Ten Gates. The complete magic system of the Arcanea universe.',
  },
};

export default function Grimoire() {
  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      <main>
        <GrimoirePage />
      </main>
    </div>
  );
}
