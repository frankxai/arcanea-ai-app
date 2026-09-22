/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Your AI Prompt Library',
  description:
    'Organize, search, and reuse your best AI prompts across every platform.',
  openGraph: {
    title: 'Your AI Prompt Library',
    description:
      'Organize, search, and reuse your best AI prompts across every platform.',
  },
  alternates: { canonical: '/prompt-books' },
}

export default function PromptBooksLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
