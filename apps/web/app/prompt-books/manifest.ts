/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arcanea Prompt Books',
    short_name: 'Prompt Books',
    description: 'Cross-device AI prompt management with context engineering',
    start_url: '/prompt-books',
    display: 'standalone',
    background_color: 'var(--arc-cosmic-void)',
    theme_color: 'var(--arc-brand-atlantean-teal)',
    orientation: 'any',
    categories: ['productivity', 'utilities'],
    icons: [
      { src: '/icons/prompt-books-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/prompt-books-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/prompt-books-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    share_target: {
      action: '/prompt-books/share',
      method: 'POST',
      enctype: 'multipart/form-data',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
        files: [
          {
            name: 'files',
            accept: ['text/plain', 'text/markdown', 'application/json', '.md', '.txt', '.json'],
          },
        ],
      },
    },
  }
}
