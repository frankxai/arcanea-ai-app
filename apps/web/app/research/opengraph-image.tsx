/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { createOGImage, OG_SIZE } from '@/lib/og'

export const runtime = 'edge'
export const alt = 'Arcanea Research — 27 repos, 35 packages, 54 skills'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'Arcanea Research',
    subtitle: '27 repos \u00b7 35 packages \u00b7 54 skills',
    stats: ['Open Source', 'TypeScript', 'Multi-Agent'],
    accentColor: 'var(--arc-brand-atlantean-teal)',
    glowPositions: [
      { top: '15%', left: '10%', color: 'rgba(127,255,212,0.10)', size: 450 },
      { bottom: '15%', right: '15%', color: 'rgba(120,166,255,0.08)', size: 380 },
    ],
  })
}
