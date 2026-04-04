import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Imagine — Arcanea',
  description: 'Generative image creation. Describe what you see — Guardian Portraits, Godbeast Summons, Cosmic Vistas, and twelve more styles.',
  openGraph: {
    title: 'Imagine — Arcanea',
    description: 'Describe what you see. The vision appears. Twelve style presets, animation, and favorites.',
    images: [{ url: '/guardians/v3/leyla-hero-v3.webp', width: 1024, height: 1024, alt: 'Leyla — Guardian of the Flow Gate' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/guardians/v3/leyla-hero-v3.webp'],
  },
  alternates: { canonical: '/imagine' },
};

export default function ImagineLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
