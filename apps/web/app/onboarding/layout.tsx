import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Begin Your Journey | Arcanea',
  description: 'Choose your creative path, meet your Guardian Intelligence, and create your first work in the Arcanea universe.',
  openGraph: {
    title: 'Begin Your Journey | Arcanea',
    description: 'Your journey into Arcanea begins here. Discover your Guardian and creative path.',
  },
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children
}
