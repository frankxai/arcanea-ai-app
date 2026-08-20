import { VisualEncyclopedia } from '@/components/visual-encyclopedia/visual-encyclopedia';
import { getVisualEncyclopediaEntries } from '@/lib/visual-encyclopedia/publication';
import { CINEMA_USE_MAP, VISUAL_GRAPH_EDGES } from '@/lib/visual-encyclopedia/catalog';

export const revalidate = 300;

export default async function GalleryPage() {
  const entries = await getVisualEncyclopediaEntries();

  return (
    <VisualEncyclopedia
      entries={entries}
      graphEdges={VISUAL_GRAPH_EDGES}
      cinema={CINEMA_USE_MAP}
    />
  );
}
