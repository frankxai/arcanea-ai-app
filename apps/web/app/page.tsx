/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Suspense } from "react";
import { getCollections, getAllTexts } from "@/lib/content";
import {
  V3Content as HomeContent,
  V3Loading as HomeLoading,
} from "./v3/v3-content";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Arcanea",
      url: "https://arcanea.ai",
      description:
        "A creative multiverse where creators chat with AI, build fantasy worlds, share what they make, and turn imagination into products.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://arcanea.ai/library?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      name: "Arcanea",
      url: "https://arcanea.ai",
      logo: "https://arcanea.ai/icon",
      sameAs: ["https://github.com/frankxai"],
      description:
        "Creative multiverse for builders: chat with AI, build worlds, share creations, and turn imagination into products.",
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
