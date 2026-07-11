/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import { PageTransition } from "./page-transition";

export const metadata: Metadata = {
  title: "Explore Worlds",
  description:
    "Discover living universes built by creators. Fork, star, and build on each other's worlds.",
  openGraph: {
    title: "Explore Worlds",
    description:
      "Discover living universes built by creators. Fork, star, and build on each other's worlds.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Arcanea Worlds",
  description:
    "Discover living universes built by creators. Fork, star, and build on each other's worlds.",
  url: "https://arcanea.ai/worlds",
  provider: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
  },
  about: {
    "@type": "Thing",
    name: "Living Worlds",
    description: "Forkable, shareable creative universes",
  },
};

export default function WorldsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
