import type { Metadata } from "next";
import { PageTransition } from "./page-transition";

export const metadata: Metadata = {
  title: "Explore Worlds — Arcanea",
  description:
    "Discover living universes built by creators. Fork, star, and build on each other's worlds.",
  openGraph: {
    title: "Explore Worlds — Arcanea",
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
    description: "Forkable, shareable AI-powered creative universes",
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
