import { Suspense } from "react";
import { getCollections, getAllTexts } from "@/lib/content";
import { V1Content, V1Loading } from "./v1-content";

async function V1WithData() {
  const collections = await getCollections();
  const allTexts = await getAllTexts();
  const totalWords = allTexts.reduce(
    (sum, t) => sum + (t.frontmatter.wordCount || 0),
    0,
  );

  return (
    <V1Content
      collectionsCount={collections.length}
      textsCount={allTexts.length}
      totalWords={totalWords}
    />
  );
}

export default function V1Page() {
  return (
    <main>
      <Suspense fallback={<V1Loading />}>
        <V1WithData />
      </Suspense>
    </main>
  );
}
