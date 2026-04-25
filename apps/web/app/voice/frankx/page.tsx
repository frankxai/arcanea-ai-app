import type { Metadata } from 'next';
import VoiceDashboardClient from '../dashboard/dashboard-client';

export const metadata: Metadata = {
  title: 'FrankX — Voice Command Center',
  description:
    'Voice command center for the FrankX operation — pulse, content pipeline, brand.',
  alternates: { canonical: '/voice/frankx' },
};

export default function FrankxPage() {
  return <VoiceDashboardClient tenantId="frankx" />;
}
