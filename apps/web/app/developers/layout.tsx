import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developers — Arcanea Creative Intelligence',
  description:
    'Build on Arcanea — Credits API, MCP servers, 97 skills, and open-source packages. Extend the intelligence layer with your own agents and integrations.',
  openGraph: {
    title: 'Arcanea Developers',
    description:
      'Credits API, MCP servers, 97 skills, and open-source packages for creative intelligence.',
    type: 'website',
    url: 'https://arcanea.ai/developers',
  },
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
    "Build on Arcanea — Credits API, MCP servers, 97 skills, and open-source packages. Extend the intelligence layer with your own agents and integrations.",
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
