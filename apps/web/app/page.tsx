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
        "A creative intelligence platform with Luminor intelligences, a philosophy library, and studio workflows for modern creators.",
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
        "Creative intelligence for builders: Luminor intelligences, a philosophy library, and creation tools in one platform.",
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
