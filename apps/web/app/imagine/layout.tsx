/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
