/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from 'next';
import { IntelligenceExperience } from './intelligence-experience';
import { AGENTS } from '@/lib/intelligence/agents';

export const metadata: Metadata = {
  title: 'Intelligence · The Lumina Constellation',
  description:
    'The full architecture of Arcanea — Lumina at the center, the Guardian Council, the Specialist Council, the voice personas. One constellation. Speak with any of them.',
  openGraph: {
    title: 'The Lumina Constellation · Arcanea',
    description:
      'Every intelligence in Arcanea, mapped and reachable. Click a star to speak with it.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Arcanea Intelligence Constellation',
  description:
    'Every named intelligence inside the Arcanea fabric, organized by tier.',
  url: 'https://arcanea.ai/intelligence',
  numberOfItems: AGENTS.length,
  itemListElement: AGENTS.map((a, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: a.name,
    description: a.tagline,
  })),
};

export default function IntelligencePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IntelligenceExperience />
    </>
  );
}
