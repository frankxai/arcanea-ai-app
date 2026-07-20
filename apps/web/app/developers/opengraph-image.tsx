/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { createOGImage, OG_SIZE } from '@/lib/og'
import { brand } from '@arcanea/design-system'

export const runtime = 'edge'
export const alt = 'Arcanea Developer Documentation — Credits API, MCP Servers, 97 Skills, Open Source'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'Developer Documentation',
    subtitle: 'Credits API \u00b7 MCP Servers \u00b7 97 Skills \u00b7 Open Source',
    accentColor: brand.atlanteanTeal,
    glowPositions: [
      { top: '15%', left: '10%', color: 'rgba(127,255,212,0.14)', size: 420 },
      { bottom: '15%', right: '15%', color: 'rgba(120,166,255,0.10)', size: 350 },
      { top: '45%', right: '35%', color: 'rgba(255,215,0,0.05)', size: 280 },
    ],
  })
}
