import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Arcanea',
  description: 'Your creative command center. Track progress, manage creations, and work with your Luminors.',
  openGraph: {
    title: 'Dashboard | Arcanea',
    description: 'Your creative command center on Arcanea.',
  },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
