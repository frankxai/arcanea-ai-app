import type { Metadata } from 'next';
import { CockpitClient } from './cockpit-client';

export const metadata: Metadata = {
  title: 'Cockpit · Arcanea',
  description:
    'Sir\'s command bridge. Live system signals, open PRs, recent commits, persona dispatch. Voice room one click away.',
};

export const dynamic = 'force-dynamic';

export default function CockpitPage() {
  return <CockpitClient />;
}
