/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { createOGImage, OG_SIZE } from '@/lib/og'
import { brand } from '@arcanea/design-system'

export const runtime = 'edge'
export const alt = 'The Living Lore — Seven beings. Ten Gates. One journey.'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'The Living Lore',
    subtitle: 'Seven beings. Ten Gates. One journey.',
    accentColor: brand.atlanteanTeal,
    glowPositions: [
      { top: '15%', left: '10%', color: 'rgba(127,255,212,0.14)', size: 420 },
      { bottom: '15%', right: '15%', color: 'rgba(147,112,219,0.10)', size: 350 },
    ],
  })
}
