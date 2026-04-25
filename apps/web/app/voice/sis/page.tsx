import type { Metadata } from 'next';
import VoiceDashboardClient from '../dashboard/dashboard-client';

export const metadata: Metadata = {
  title: 'Starlight Intelligence System — Arcanea',
  description:
    'Voice command center for the Starlight Intelligence System — recall, search, contradict.',
  alternates: { canonical: '/voice/sis' },
};

export default function SisPage() {
  return <VoiceDashboardClient tenantId="sis" />;
}
