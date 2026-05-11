/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCrewMember } from '@/lib/living-lore/crew-data';
import { getCrewBackstory, getEncountersForCrewMember } from '@/lib/living-lore/episode-loader';
import { getTextsForCrewMember } from '@/lib/living-lore/lore-connections';
import type { Text } from '@/lib/content/types';
import type { Encounter } from '@/lib/living-lore/types';
import { CrewDetailView } from '@/components/living-lore/crew-detail-view';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ memberId: string }>;
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
