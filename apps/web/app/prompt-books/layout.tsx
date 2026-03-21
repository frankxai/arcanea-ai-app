import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Prompt Books',
  description: 'Cross-device AI prompt management with context engineering.',
  openGraph: {
    title: 'Prompt Books',
    description: 'Cross-device AI prompt management with context engineering.',
  },
  alternates: { canonical: '/prompt-books' },
}

export default function PromptBooksLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
