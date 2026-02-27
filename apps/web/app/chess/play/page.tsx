import { PlaceholderPage } from '@/components/system/placeholder-page';

export default function ChessPlayPage() {
  return (
    <PlaceholderPage
      eyebrow="Chess"
      title="Play Chess"
      description="Dedicated live-play mode is being connected to the current chess system."
      primaryHref="/chess"
      primaryLabel="Open Chess"
      secondaryHref="/community"
      secondaryLabel="Community"
    />
  );
}

