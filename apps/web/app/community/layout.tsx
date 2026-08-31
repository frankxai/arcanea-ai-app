/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { PUBLIC_REPO_SUMMARY } from '@/lib/public-repo-registry';
import { FACTS } from '@/lib/facts';
import type { Metadata } from 'next';

const communityDescription = `Not just users — co-creators. Contribute lore, agents, skills, code, art, music. ${PUBLIC_REPO_SUMMARY.public} public repos, ${FACTS.mcpTools} MCP tools, ${FACTS.skills} creator skills, and the Library of Arcanea. Built in the open.`;

export const metadata: Metadata = {
  title: 'Arcanea Community — Join the Creative Civilization',
  description: communityDescription,
  openGraph: {
    title: 'Arcanea Community — Join the Creative Civilization',
    description: communityDescription,
    type: 'website',
    images: [
      {
        url: '/guardians/v3/elara-hero-v3.webp',
        width: 1024,
        height: 1024,
        alt: 'Elara — Guardian of the Starweave Gate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the Creative Civilization — Arcanea Community',
    description: `Not just users — co-creators. ${PUBLIC_REPO_SUMMARY.public} public repos, ${PUBLIC_REPO_SUMMARY.packages} npm packages, ${FACTS.skills} creator skills. Built in the open.`,
    images: ['/guardians/v3/elara-hero-v3.webp'],
  },
  alternates: { canonical: '/community' },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Arcanea Community — Join the Creative Civilization",
  description: communityDescription,
  url: "https://arcanea.ai/community",
  publisher: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
  },
  about: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
    description:
      "Creative multiverse platform where creators chat with AI, build fantasy worlds, share what they make, and turn imagination into products.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
