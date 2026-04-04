import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Research Hub',
    template: '%s | Research',
  },
  description:
    'Science-backed mythology — where neuroscience validates the Ten Gates framework. Papers, tools, benchmarks, and cross-domain synthesis.',
  openGraph: {
    title: 'Research Hub | Arcanea',
    description:
      'Science-backed mythology — where neuroscience validates the Ten Gates framework. Papers, tools, benchmarks, and cross-domain synthesis.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: { canonical: '/research' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Arcanea Research Hub',
  description:
    'Science-backed mythology — papers, tools, benchmarks, and cross-domain synthesis mapped to the Ten Gates framework.',
  url: 'https://arcanea.ai/research',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Arcanea',
    url: 'https://arcanea.ai',
  },
};

export default function ResearchLayout({ children }: { children: ReactNode }) {
  return (
    <div data-section="research">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </div>
  );
}
