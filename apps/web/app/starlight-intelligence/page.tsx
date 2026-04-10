import { Metadata } from 'next';
import { SisContent } from './sis-content';
import { GradientMesh } from '@/components/motion/gradient-mesh';

export const metadata: Metadata = {
  title: 'Starlight Intelligence — Persistent memory for AI agents | Arcanea',
  description: 'A 5-layer cognitive architecture with 6 semantic vaults and adapters for every AI tool. Local-first. Portable. Yours.',
  openGraph: {
    title: 'Starlight Intelligence System',
    description: 'Persistent memory for AI agents. Every session builds on the last.',
    type: 'website',
  },
};

export default function StarlightIntelligencePage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <GradientMesh colors={['#00bcd4', '#a78bfa', '#f472b6']} intensity={0.06} />
      </div>
      <SisContent />
    </div>
  );
}
