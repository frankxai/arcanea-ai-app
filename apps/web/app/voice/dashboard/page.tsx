import type { Metadata } from 'next';
import VoiceDashboardClient from './dashboard-client';

export const metadata: Metadata = {
  title: 'Voice Dashboard — Arcanea',
  description:
    'The voice command center for Arcanea. Pick a persona, set an activation mode (push-to-talk, voice, or double-clap), and summon the Guardian of your choice.',
  openGraph: {
    title: 'Voice Dashboard — Arcanea',
    description: 'Summon any Guardian by clap, voice, or click.',
    type: 'website',
  },
  alternates: { canonical: '/voice/dashboard' },
};

export default function Page() {
  return <VoiceDashboardClient />;
}
