import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getEncounter } from '@/lib/living-lore/episode-loader';
import { getAllCrew } from '@/lib/living-lore/crew-data';
import { EncounterScene } from '@/components/living-lore/encounter-scene';
import { ENCOUNTER_CHOICES } from '@/lib/living-lore/encounter-choices';

interface Props {
  params: Promise<{ encounterId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { encounterId } = await params;
  const encounter = await getEncounter(encounterId);

  if (!encounter) return { title: 'Encounter Not Found' };

  return {
    title: `${encounter.title} | Living Lore`,
    description: `An interactive encounter in Act ${encounter.act} of the Living Lore.`,
  };
}

export default async function EncounterPage({ params }: Props) {
  const { encounterId } = await params;
  const encounter = await getEncounter(encounterId);

  if (!encounter) notFound();

  const allCrew = getAllCrew();
  const choices = ENCOUNTER_CHOICES[encounterId] ?? [];

  return (
    <main className="relative h-[calc(100vh-4rem)]">
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(127,255,212,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      <EncounterScene encounter={encounter} crewMembers={allCrew} choices={choices} />
    </main>
  );
}
