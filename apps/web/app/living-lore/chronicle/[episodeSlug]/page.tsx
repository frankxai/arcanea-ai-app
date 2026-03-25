import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getEpisode, getActs, getEncountersForEpisode, getEpisodesForAct } from '@/lib/living-lore/episode-loader';
import { getConnectedLore } from '@/lib/living-lore/lore-connections';
import { EpisodeReader } from '@/components/living-lore/episode-reader';
import type { Text } from '@/lib/content/types';

interface Props {
  params: Promise<{ episodeSlug: string }>;
}

export async function generateStaticParams(): Promise<
  { episodeSlug: string }[]
> {
  try {
    const acts = await getActs();
    return acts.flatMap((act) =>
      act.episodes.map((ep) => ({ episodeSlug: ep.slug }))
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { episodeSlug } = await params;
  const episode = await getEpisode(episodeSlug);

  if (!episode) return { title: 'Episode Not Found' };

  return {
    title: `${episode.title} — Act ${episode.act}: ${episode.actTitle} | Living Lore`,
    description: episode.excerpt,
  };
}

export default async function EpisodePage({ params }: Props) {
  const { episodeSlug } = await params;
  const episode = await getEpisode(episodeSlug);

  if (!episode) notFound();

  // Load connected lore, encounters, and next episode in parallel
  const [connectedLore, encounters, actEpisodes] = await Promise.all([
    getConnectedLore(episode.connectedLore).catch(() => [] as Text[]),
    getEncountersForEpisode(episodeSlug).catch(() => []),
    getEpisodesForAct(episode.act).catch(() => []),
  ]);

  // Find next episode (same act, next number — or first episode of next act)
  let nextEpisode: { slug: string; title: string } | null = null;
  const currentIdx = actEpisodes.findIndex((ep) => ep.slug === episodeSlug);
  if (currentIdx >= 0 && currentIdx < actEpisodes.length - 1) {
    const next = actEpisodes[currentIdx + 1];
    nextEpisode = { slug: next.slug, title: next.title };
  } else {
    // Try first episode of the next act
    try {
      const nextActEpisodes = await getEpisodesForAct(episode.act + 1);
      if (nextActEpisodes.length > 0) {
        nextEpisode = { slug: nextActEpisodes[0].slug, title: nextActEpisodes[0].title };
      }
    } catch {
      // No next act
    }
  }

  return (
    <EpisodeReader
      episode={episode}
      connectedLore={connectedLore}
      encounters={encounters}
      nextEpisode={nextEpisode}
    />
  );
}
