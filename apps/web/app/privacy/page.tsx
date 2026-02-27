import { PlaceholderPage } from '@/components/system/placeholder-page';

export default function PrivacyPage() {
  return (
    <PlaceholderPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="Arcanea privacy terms are being finalized for this environment. Use authenticated routes only with data you are comfortable sharing during development."
      primaryHref="/auth/signup"
      primaryLabel="Create Profile"
      secondaryHref="/contact"
      secondaryLabel="Contact Arcanea"
    />
  );
}

