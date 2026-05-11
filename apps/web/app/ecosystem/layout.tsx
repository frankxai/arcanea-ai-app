/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ecosystem Hub — Arcanea Creative Intelligence',
  description:
    'The Arcanea repo registry: active public repos, private production surfaces, unresolved historical entries, and upstream dependencies labeled honestly.',
  openGraph: {
    title: 'Arcanea Ecosystem',
    description: 'Registry-derived map of the Arcanea repo network and integration state.',
    type: 'website',
    url: 'https://arcanea.ai/ecosystem',
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
    title: 'Arcanea Ecosystem',
    description: 'Registry-derived map of the Arcanea repo network and integration state.',
    images: ['/guardians/v3/elara-hero-v3.webp'],
  },
  alternates: { canonical: '/ecosystem' },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Arcanea Ecosystem",
  description:
    "The Arcanea repo registry: active public repos, private production surfaces, unresolved historical entries, and upstream dependencies labeled honestly.",
  url: "https://arcanea.ai/ecosystem",
  publisher: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
  },
};

export default function EcosystemLayout({ children }: { children: React.ReactNode }) {
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
