/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';
import { SisContent } from './sis-content';
import { GradientMesh } from '@/components/motion/gradient-mesh';

export const metadata: Metadata = {
  title: 'Starlight Intelligence — Persistent memory for AI agents',
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
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--arc-cosmic-void)]" />
        <GradientMesh colors={['var(--arc-brand-atlantean-teal)', 'var(--arc-void)', 'var(--arc-void)']} intensity={0.06} />
      </div>
      <SisContent />
    </div>
  );
}
