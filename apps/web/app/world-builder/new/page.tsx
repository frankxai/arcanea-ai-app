import { PlaceholderPage } from '@/components/system/placeholder-page';

export default function NewWorldPage() {
  return (
    <PlaceholderPage
      eyebrow="World Builder"
      title="Create New World"
      description="New world creation flow is being merged into the central workspace shell."
      primaryHref="/world-builder"
      primaryLabel="Open World Builder"
      secondaryHref="/library"
      secondaryLabel="Browse Lore"
    />
  );
}

