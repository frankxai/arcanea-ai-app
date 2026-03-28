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
        "Arcanea is a creative intelligence platform for chat, creation, research, world-building, and a living philosophy library.",
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
        "Creative intelligence platform for builders and artists: a product surface, developer ecosystem, and philosophy library in one system.",
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
