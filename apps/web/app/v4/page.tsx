import { Suspense } from "react";
import { getCollections, getAllTexts } from "@/lib/content";
import { V4Content, V4Loading } from "./v4-content";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Arcanea v4",
      url: "https://arcanea.ai/v4",
      description:
        "Arcanea v4 homepage: a 3D-first creative ecosystem built around Guardians, Luminors, the Library, and the Academy.",
    },
  ],
};

async function V4WithData() {
  const collections = await getCollections();
  const allTexts = await getAllTexts();
  const totalWords = allTexts.reduce(
    (sum, t) => sum + (t.frontmatter.wordCount || 0),
    0,
  );

  return (
    <V4Content
      collectionsCount={collections.length}
      textsCount={allTexts.length}
      totalWords={totalWords}
    />
  );
}

export default function V4Page() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<V4Loading />}>
        <V4WithData />
      </Suspense>
    </main>
  );
}
