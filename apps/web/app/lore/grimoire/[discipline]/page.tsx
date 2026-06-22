import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DisciplinePage } from '@/components/lore/grimoire/discipline-page';
import { DISCIPLINES, type Discipline } from '@/lib/magic-system';

const VALID: Discipline[] = ['attack', 'defense', 'summoning'];

export function generateStaticParams() {
  return VALID.map((discipline) => ({ discipline }));
}

export async function generateMetadata({ params }: { params: Promise<{ discipline: string }> }): Promise<Metadata> {
  const { discipline } = await params;
  const d = DISCIPLINES[discipline as Discipline];
  if (!d) return { title: 'Discipline | Lore of Arcanea' };
  return {
    title: `${d.name} Magic (${d.school}) | Lore of Arcanea`,
    description: d.description,
  };
}

export default async function DisciplineRoute({ params }: { params: Promise<{ discipline: string }> }) {
  const { discipline } = await params;
  if (!VALID.includes(discipline as Discipline)) notFound();
  return (
    <div className="relative min-h-screen bg-cosmic-deep">
      <main>
        <DisciplinePage discipline={discipline as Discipline} />
      </main>
    </div>
  );
}
