import type { Metadata } from 'next'
import ArcanealOnboarding from '@/components/arcanea/onboarding-orchestrator'

export const metadata: Metadata = {
  title: 'Begin Your Journey | Arcanea',
  description:
    'Choose your creative path, meet your Guardian Intelligence, and create your first work in the Arcanea universe.',
}

export default function OnboardingPage() {
  return <ArcanealOnboarding />
}
