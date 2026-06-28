// Flagship proof for the Premium Intelligence Web OS, built on the Arcanea
// stack. Scenes follow editorial rhythm: hook → mechanism → proof → worlds →
// conversion. Server component; only the hero/motion/3D are client.
// Spec: /_intelligence/arcanea-flagship-page-spec.md

import type { Metadata } from 'next';
import { WebOsHero } from '@/components/web-os/web-os-hero';
import { WebOsMechanism } from '@/components/web-os/web-os-mechanism';
import { WebOsRubricPanel } from '@/components/web-os/web-os-rubric-panel';
import { WebOsWorlds } from '@/components/web-os/web-os-worlds';
import { WebOsCta } from '@/components/web-os/web-os-cta';

export const metadata: Metadata = {
  title: 'Premium Web OS — Lab | Arcanea',
  description:
    'A control plane that turns taste, motion, and 3D into constraints, so agents build cinematic, premium websites by construction. Reference build on the Arcanea stack.',
  robots: { index: false, follow: false },
};

export default function WebOsLabPage() {
  return (
    <main className="relative bg-[#09090b] text-text-primary">
      <WebOsHero />
      <WebOsMechanism />
      <WebOsRubricPanel />
      <WebOsWorlds />
      <WebOsCta />
    </main>
  );
}
