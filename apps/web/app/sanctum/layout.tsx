import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Sanctum | Arcanea',
  description:
    'Discover, forge, and share illuminated AI intelligences. Each Luminor is a creative partner shaped by its creator — with unique voice, domain expertise, and personality.',
  openGraph: {
    title: 'The Sanctum — Where Intelligence Is Born',
    description:
      'Browse AI Luminors forged by creators. Use them in chat, export anywhere.',
    type: 'website',
    images: [{ url: '/guardians/v3/ino-hero-v3.webp', width: 1024, height: 1024, alt: 'Ino — Guardian of the Unity Gate' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/guardians/v3/ino-hero-v3.webp'],
  },
  alternates: { canonical: '/sanctum' },
};

export default function SanctumLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'The Sanctum',
            description:
              'Discover AI Luminors forged by creators on Arcanea',
            url: 'https://arcanea.ai/sanctum',
            isPartOf: {
              '@type': 'WebSite',
              name: 'Arcanea',
              url: 'https://arcanea.ai',
            },
          }),
        }}
      />
      {children}
    </>
  );
}
