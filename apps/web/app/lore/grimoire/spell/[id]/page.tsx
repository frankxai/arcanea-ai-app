import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SpellDetail } from '@/components/lore/grimoire/spell-detail';
import { SPELLS, getSpell } from '@/lib/magic-system';

export function generateStaticParams() {
  return SPELLS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const spell = getSpell(id);
  if (!spell) return { title: 'Spell | Lore of Arcanea' };
  return {
    title: `${spell.name} — "${spell.incantation}" | Grimoire of Arcanea`,
    description: spell.description,
  };
}

export default async function SpellRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const spell = getSpell(id);
  if (!spell) notFound();
  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      <main>
        <SpellDetail spell={spell} />
      </main>
    </div>
  );
}
