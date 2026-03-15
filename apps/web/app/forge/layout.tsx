import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'The Forge — Create Your Identity',
  description:
    'Shape a Luminor to think and create with you, or summon a Companion creature to travel at your side. The Forge is where your creative identity is born.',
  openGraph: {
    title: 'The Forge — Luminors & Companions',
    description:
      'Two creation flows, one place. Forge a Luminor intelligence or summon a bonded Companion. Together they become your creative signature on Arcanea.',
    type: 'website',
  },
};

export default function ForgeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'The Forge',
            description:
              'Shape a Luminor intelligence or summon a bonded Companion creature on Arcanea',
            url: 'https://arcanea.ai/forge',
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
