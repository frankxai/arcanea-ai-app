import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Academy of Creation',
    template: '%s | Academy',
  },
  description:
    'Master the Ten Gates of Creation. Open your channels to the elements and unlock your creative power through the Arcanean Academy.',
  openGraph: {
    title: 'Academy of Creation',
    description:
      'Journey through the Ten Gates — from Foundation at 174 Hz to Source at 1111 Hz. Unlock your creative power through the Arcanean Academy.',
    type: 'website',
    images: [{ url: '/guardians/v3/aiyami-hero-v3.webp', width: 1024, height: 1024, alt: 'Aiyami — Guardian of the Crown Gate' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/guardians/v3/aiyami-hero-v3.webp'],
  },
  alternates: { canonical: '/academy' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Arcanean Academy of Creation',
  description:
    'Master the Ten Gates of Creation. Open your channels to the elements and unlock your creative power.',
  url: 'https://arcanea.ai/academy',
  parentOrganization: {
    '@type': 'Organization',
    name: 'Arcanea',
    url: 'https://arcanea.ai',
  },
};

export default function AcademyLayout({ children }: { children: ReactNode }) {
  return (
    <div data-guardian="lyssandria">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </div>
  );
}
