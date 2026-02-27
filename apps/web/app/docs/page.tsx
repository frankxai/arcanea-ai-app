import { PlaceholderPage } from '@/components/system/placeholder-page';

export default function DocsPage() {
  return (
    <PlaceholderPage
      eyebrow="Documentation"
      title="Arcanea Docs"
      description="Documentation is being consolidated into a unified portal. Developer references currently live across Hub, Arcanea Code, and package READMEs."
      primaryHref="/hub/guides"
      primaryLabel="Open Guides"
      secondaryHref="/arcanea-code"
      secondaryLabel="Arcanea Code"
    />
  );
}

