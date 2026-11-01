import type { Metadata } from 'next';
import { PianoPractice } from './piano-practice';

export const metadata: Metadata = {
  title: 'Piano Practice | Arcanea Music Mentor',
  description: 'Practice a four-note piano motif and receive evidence-based rhythm feedback.',
  alternates: { canonical: '/academy/music' },
};

export default function MusicMentorPage() {
  return <PianoPractice />;
}
