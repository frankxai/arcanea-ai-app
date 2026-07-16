/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from 'next';
import VoiceDashboardClient from './dashboard-client';

export const metadata: Metadata = {
  title: 'Voice Dashboard',
  description:
    'The voice command center for Arcanea. Pick a persona, set an activation mode (push-to-talk, voice, or double-clap), and summon the Guardian of your choice.',
  openGraph: {
    title: 'Voice Dashboard',
    description: 'Summon any Guardian by clap, voice, or click.',
    type: 'website',
  },
  alternates: { canonical: '/voice/dashboard' },
};

export default function Page() {
  return <VoiceDashboardClient />;
}
