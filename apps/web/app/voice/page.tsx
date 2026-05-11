/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from 'next';
import VoicePage from './voice-client';

export const metadata: Metadata = {
  title: 'Voice — Arcanea',
  description:
    'Speak your creations into existence. Six Guardian voices, real-time transcription, and voice-first workflows for the creative multiverse.',
  openGraph: {
    title: 'Voice — Arcanea Creative Intelligence',
    description:
      'Six Guardian voices. Speak, and the multiverse listens.',
    type: 'website',
    images: [{ url: '/guardians/v3/alera-hero-v3.webp', width: 1024, height: 1024, alt: 'Alera — Guardian of the Voice Gate' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/guardians/v3/alera-hero-v3.webp'],
  },
  alternates: { canonical: '/voice' },
};

export default function Page() {
  return <VoicePage />;
}
