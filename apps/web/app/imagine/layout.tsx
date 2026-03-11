import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Imagine — Arcanea',
  description: 'AI-powered image generation. Describe what you see, generate it, animate it.',
  openGraph: {
    title: 'Imagine — Arcanea',
    description: 'AI-powered generative art. Describe. Create. Animate.',
  },
};

export default function ImagineLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
