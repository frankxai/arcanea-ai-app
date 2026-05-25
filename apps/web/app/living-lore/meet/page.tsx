/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { CrewOnboarding } from '@/components/living-lore/crew-onboarding';

export default function MeetTheCrewPage() {
  const router = useRouter();

  const handleComplete = useCallback(
    (selectedCompanion: string) => {
      // Store the chosen companion in localStorage for later use
      try {
        localStorage.setItem('arcanea-companion', selectedCompanion);
      } catch {
        // Storage unavailable — continue anyway
      }
      router.push('/living-lore/chronicle/the-assembly');
    },
    [router],
  );

  const handleSkip = useCallback(() => {
    router.push('/living-lore');
  }, [router]);

  return (
    <CrewOnboarding onComplete={handleComplete} onSkip={handleSkip} />
  );
}
