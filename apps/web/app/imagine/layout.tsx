import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Imagine — Arcanea',
  description: 'AI-powered image generation. Describe what you see, generate it, animate it.',
  openGraph: {
    title: 'Imagine — Arcanea',
    description: 'AI-powered generative art. Describe. Create. Animate.',
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
