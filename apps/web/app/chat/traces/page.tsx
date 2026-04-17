import type { Metadata } from 'next';
import TracesIndexContent from './traces-index-content';

export const metadata: Metadata = {
  title: 'Swarm traces · Arcanea',
  description: 'Your recent multi-Luminor swarm runs.',
  robots: { index: false, follow: false },
};

export default function TracesIndexPage() {
  return <TracesIndexContent />;
}
