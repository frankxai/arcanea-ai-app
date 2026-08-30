/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import { Suspense } from "react";
import { getCollections, getAllTexts } from "@/lib/content";
import {
  V3Content as HomeContent,
  V3Loading as HomeLoading,
} from "./v3/v3-content";

export const metadata: Metadata = {
  title: "Arcanea — A World Engine That Remembers",
  description:
    "Arcanea keeps canon, characters, relationships, rules, and creative lineage coherent across changing AI models, sessions, and media.",
  openGraph: {
    title: "Arcanea — Build a world that remembers itself",
    description:
      "Persistent Creative Intelligence for creators and studios building narrative IP across models, tools, and media.",
    url: "/",
    images: [{ url: "/brand/arcanea-og.jpg", width: 1200, height: 630, alt: "Arcanea World Engine" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcanea — Build a world that remembers itself",
    description:
      "A World Engine for narrative IP that must remain coherent across models, tools, and time.",
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
        "A BYOK-first World Engine for creators building persistent narrative IP across models, tools, and media.",
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
        "Persistent Creative Intelligence for keeping canon, characters, relationships, rules, and creative lineage coherent across AI tools.",
    },
  ],
};

async function HomeWithData() {
  const collections = await getCollections();
  const allTexts = await getAllTexts();
  const totalWords = allTexts.reduce(
    (sum, t) => sum + (t.frontmatter.wordCount || 0),
    0,
  );

  return (
    <HomeContent
      collectionsCount={collections.length}
      textsCount={allTexts.length}
      totalWords={totalWords}
    />
  );
}

export default function Page() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<HomeLoading />}>
        <HomeWithData />
      </Suspense>
    </main>
  );
}
