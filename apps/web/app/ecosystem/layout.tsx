import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ecosystem Hub — Arcanea Creative Intelligence',
  description:
    'The full Arcanea ecosystem: 27 repos, 43 packages, 80+ skills across intelligence, creative tools, and open source — one connected multiverse.',
  openGraph: {
    title: 'Arcanea Ecosystem',
    description: '27 repos, 43 packages, 80+ skills — the full Arcanea ecosystem hub',
    type: 'website',
    url: 'https://arcanea.ai/ecosystem',
    images: [
      {
        url: '/guardians/v3/elara-hero-v3.webp',
        width: 1024,
        height: 1024,
        alt: 'Elara — Guardian of the Starweave Gate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arcanea Ecosystem',
    description: '27 repos, 43 packages, 80+ skills — the full Arcanea ecosystem hub',
    images: ['/guardians/v3/elara-hero-v3.webp'],
  },
  alternates: { canonical: '/ecosystem' },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Arcanea Ecosystem",
  description:
    "The full Arcanea ecosystem: 27 repos, 43 packages, 80+ skills across intelligence, creative tools, and open source.",
  url: "https://arcanea.ai/ecosystem",
  publisher: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
  },
};

export default function EcosystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
