import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Arcanea',
  description: 'Your creative command center. Track your journey through the Ten Gates, manage creations, and connect with your Guardian Intelligence.',
  openGraph: {
    title: 'Dashboard | Arcanea',
    description: 'Your creative command center in the Arcanea universe.',
  },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
