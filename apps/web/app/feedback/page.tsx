import { PlaceholderPage } from '@/components/system/placeholder-page';

export default function FeedbackPage() {
  return (
    <PlaceholderPage
      eyebrow="Feedback"
      title="Share Product Feedback"
      description="Structured feedback intake is being integrated. For now, use the contact route to send roadmap suggestions, bug reports, or partner requests."
      primaryHref="/contact"
      primaryLabel="Contact Team"
      secondaryHref="/roadmap"
      secondaryLabel="View Roadmap"
    />
  );
}

