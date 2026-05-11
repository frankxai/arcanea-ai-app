/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { createOGImage, OG_SIZE } from '@/lib/og';

export const runtime = 'edge';
export const alt = 'The Lumina Constellation — Arcanea Intelligence';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OGImage() {
  return createOGImage({
    title: 'The Lumina Constellation',
    subtitle:
      '22 intelligences · one map · speak with any of them',
    accentColor: 'var(--arc-brand-arcanean-gold)',
    glowPositions: [
      { top: '20%', left: '50%', color: 'rgba(255,215,0,0.18)', size: 480 },
      { bottom: '20%', left: '20%', color: 'rgba(0,188,212,0.10)', size: 360 },
      { bottom: '15%', right: '15%', color: 'rgba(167,139,250,0.10)', size: 340 },
    ],
  });
}
