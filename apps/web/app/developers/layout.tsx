/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { FACTS } from '@/lib/facts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developers — Arcanea Creative Intelligence',
  description:
    `Build on Arcanea — Credits API, an MCP server with ${FACTS.mcpTools} tools, ${FACTS.skills} creator skills, and open-source packages. Extend the intelligence layer with your own agents and integrations.`,
  openGraph: {
    title: 'Arcanea Developers',
    description:
      'Credits API, MCP servers, 97 skills, and open-source packages for creative intelligence.',
    type: 'website',
    url: 'https://arcanea.ai/developers',
  },
  alternates: { canonical: '/developers' },
  twitter: {
    card: 'summary_large_image',
    title: 'Arcanea Developers',
    description:
      'Credits API, MCP servers, 97 skills, and open-source packages for creative intelligence.',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Arcanea Developers",
  description:
    `Build on Arcanea — Credits API, an MCP server with ${FACTS.mcpTools} tools, ${FACTS.skills} creator skills, and open-source packages. Extend the intelligence layer with your own agents and integrations.`,
  url: "https://arcanea.ai/developers",
  publisher: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
  },
};

export default function DevelopersLayout({ children }: { children: React.ReactNode }) {
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
