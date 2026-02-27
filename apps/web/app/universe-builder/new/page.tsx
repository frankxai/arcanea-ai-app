import { PlaceholderPage } from '@/components/system/placeholder-page';

export default function NewUniversePage() {
  return (
    <PlaceholderPage
      eyebrow="Universe Builder"
      title="Create New Universe"
      description="Universe bootstrap flow is being connected to templates, lore graph, and realm records."
      primaryHref="/universe-builder"
      primaryLabel="Open Universe Builder"
      secondaryHref="/library/graph"
      secondaryLabel="Lore Graph"
    />
  );
}

