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
