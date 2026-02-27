import { PlaceholderPage } from '@/components/system/placeholder-page';

export default function TermsPage() {
  return (
    <PlaceholderPage
      eyebrow="Legal"
      title="Terms of Service"
      description="Arcanea terms for this deployment are in progress. Product capabilities in beta are provided without uptime guarantees."
      primaryHref="/pricing"
      primaryLabel="View Plans"
      secondaryHref="/contact"
      secondaryLabel="Get Support"
    />
  );
}

