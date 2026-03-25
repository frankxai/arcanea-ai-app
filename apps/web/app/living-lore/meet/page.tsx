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
