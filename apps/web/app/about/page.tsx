/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Arcanea is a protected living universe and a creator platform for building worlds you own.",
  openGraph: {
    title: "About Arcanea — Universe and Creator Platform",
    description:
      "Enter the Arcanea universe, or use the Arcanea Connector to build a world you own.",
    images: [{ url: '/guardians/v3/shinkami-hero-v3.webp', width: 1024, height: 1024, alt: 'Shinkami of Arcanea' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/guardians/v3/shinkami-hero-v3.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Arcanea',
  description:
    'A protected story universe and a creator platform for building rights-aware worlds with AI.',
  url: 'https://arcanea.ai/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'Arcanea',
    url: 'https://arcanea.ai',
    description:
      'Arcanea separates its protected canon from the Arcanea Connector creator layer and the Starlight technical substrate. Creator worlds remain creator-owned.',
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutContent />
    </>
  );
}
