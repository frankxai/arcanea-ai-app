import type { Metadata } from "next";
import { WorldSeedExperience } from "./v3/world-seed-experience";

export const metadata: Metadata = {
  title: "Arcanea — A World Engine That Remembers",
  description:
    "A live creative-world proving environment building continuity for canon, characters, relationships, rules, and source lineage across AI tools.",
  openGraph: {
    title: "Arcanea — Build a world that remembers itself",
    description:
      "Persistent Creative Intelligence for narrative studios and game-world teams stewarding long-lived IP.",
    url: "/",
    images: [
      {
        url: "/brand/arcanea-og.jpg",
        width: 1200,
        height: 630,
        alt: "Arcanea World Engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcanea — Build a world that remembers itself",
    description:
      "A live proving environment for continuity infrastructure for narrative IP.",
    images: ["/brand/arcanea-og.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Arcanea",
      url: "https://www.arcanea.ai",
      description:
        "A live creative-world proving environment building continuity infrastructure for narrative IP.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.arcanea.ai/library?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      name: "Arcanea",
      url: "https://www.arcanea.ai",
      logo: "https://www.arcanea.ai/icon",
      sameAs: ["https://github.com/frankxai"],
      description:
        "Persistent Creative Intelligence for narrative IP across AI tools.",
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorldSeedExperience />
    </>
  );
}
