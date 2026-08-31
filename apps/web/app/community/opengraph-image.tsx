/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { createOGImage, OG_SIZE } from '@/lib/og'
import { brand } from '@arcanea/design-system'
import { PUBLIC_REPO_SUMMARY } from '@/lib/public-repo-registry'
import { FACTS } from '@/lib/facts'

export const runtime = 'edge'
export const alt = 'Arcanea Community — Join the Creative Civilization'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'Join the Creative Civilization',
    subtitle: `${PUBLIC_REPO_SUMMARY.public} public repos \u00b7 ${FACTS.mcpTools} MCP tools \u00b7 ${FACTS.skills} creator skills`,
    accentColor: brand.arcaneanGold,
    glowPositions: [
      { top: '15%', left: '20%', color: 'rgba(255,215,0,0.12)', size: 400 },
      { bottom: '15%', right: '15%', color: 'rgba(255,215,0,0.08)', size: 350 },
      { top: '40%', right: '30%', color: 'rgba(127,255,212,0.06)', size: 300 },
    ],
  })
}
