/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { PUBLIC_REPO_SUMMARY } from '@/lib/public-repo-registry';
import { FACTS } from '@/lib/facts';
import { createOGImage, OG_SIZE } from '@/lib/og'

export const runtime = 'edge'
export const alt = `Arcanea Research — ${PUBLIC_REPO_SUMMARY.tracked} repos, ${PUBLIC_REPO_SUMMARY.packages} packages, ${FACTS.skills} skills`
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OGImage() {
  return createOGImage({
    title: 'Arcanea Research',
    subtitle: `${PUBLIC_REPO_SUMMARY.tracked} repos \u00b7 ${PUBLIC_REPO_SUMMARY.packages} packages \u00b7 ${FACTS.skills} skills`,
    stats: ['Open Source', 'TypeScript', 'Multi-Agent'],
    accentColor: 'var(--arc-brand-atlantean-teal)',
    glowPositions: [
      { top: '15%', left: '10%', color: 'rgba(127,255,212,0.10)', size: 450 },
      { bottom: '15%', right: '15%', color: 'rgba(120,166,255,0.08)', size: 380 },
    ],
  })
}
