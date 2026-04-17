import type { Metadata } from 'next';
import TraceReplayContent from './trace-content';

export const metadata: Metadata = {
  title: 'Swarm trace · Arcanea',
  description: 'Replay a multi-Luminor swarm run.',
  robots: { index: false, follow: false },
};

export default async function TraceReplayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TraceReplayContent id={id} />;
}
