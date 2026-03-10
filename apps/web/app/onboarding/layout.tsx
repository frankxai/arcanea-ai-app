import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get Started',
  description: 'Choose what you create, find your AI creative partner, and make your first work on Arcanea.',
  openGraph: {
    title: 'Get Started',
    description: 'Choose what you create, find your AI creative partner, and get started on Arcanea.',
  },
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children
}
