import type { Metadata } from 'next';
import SwarmChatContent from './swarm-content';

export const metadata: Metadata = {
  title: 'Swarm · Chat · Arcanea',
  description:
    'Multi-Luminor collaboration in real time. Watch specialists think in parallel and Lumina synthesize the result.',
  robots: { index: false, follow: false },
};

export default function SwarmChatPage() {
  return <SwarmChatContent />;
}
