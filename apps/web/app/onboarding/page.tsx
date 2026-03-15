import type { Metadata } from 'next'
import ArcanealOnboarding from '@/components/arcanea/onboarding-orchestrator'

export const metadata: Metadata = {
  title: 'Get Started',
  description:
    'Choose what you create, find your AI creative partner, and make your first work on Arcanea.',
}

export default function OnboardingPage() {
  return <ArcanealOnboarding />
}
