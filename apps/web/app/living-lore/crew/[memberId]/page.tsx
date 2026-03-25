import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCrewMember, getAllCrew } from '@/lib/living-lore/crew-data';
import { getCrewBackstory, getEncountersForCrewMember } from '@/lib/living-lore/episode-loader';
import { getTextsForCrewMember } from '@/lib/living-lore/lore-connections';
import type { Text } from '@/lib/content/types';
import type { Encounter } from '@/lib/living-lore/types';
import { CrewDetailView } from '@/components/living-lore/crew-detail-view';

interface Props {
  params: Promise<{ memberId: string }>;
}

export function generateStaticParams() {
  return getAllCrew().map((member) => ({ memberId: member.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { memberId } = await params;
  const member = getCrewMember(memberId);
  if (!member) return { title: 'Crew Member Not Found' };

  return {
    title: `${member.name} — ${member.title} | Living Lore`,
    description: member.backstoryHook,
  };
}

export default async function CrewMemberPage({ params }: Props) {
  const { memberId } = await params;
  const member = getCrewMember(memberId);
  if (!member) notFound();

  // Load backstory, connected texts, and encounters in parallel
  const [backstory, connectedTexts, memberEncounters] = await Promise.all([
    getCrewBackstory(memberId).catch(() => null as string | null),
    getTextsForCrewMember(memberId).catch(() => [] as Text[]),
    getEncountersForCrewMember(memberId).catch(() => [] as Encounter[]),
  ]);

  return (
    <CrewDetailView
      member={member}
      backstory={backstory}
      connectedTexts={connectedTexts}
      encounters={memberEncounters}
    />
  );
}
