'use client';

import dynamic from 'next/dynamic';

const EvolutionScene = dynamic(
  () => import('./evolution-scene').then((mod) => mod.EvolutionScene),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full animate-pulse rounded-2xl bg-white/[0.02]" />
    ),
  },
);

export function EvolutionSceneLoader() {
  return <EvolutionScene />;
}
