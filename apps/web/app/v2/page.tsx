import { Suspense } from "react";
import { getCollections, getAllTexts } from "@/lib/content";
import { V2Content, V2Loading } from "./v2-content";

async function V2WithData() {
  const collections = await getCollections();
  const allTexts = await getAllTexts();
  const totalWords = allTexts.reduce(
    (sum, t) => sum + (t.frontmatter.wordCount || 0),
    0
  );
  return (
    <V2Content
      collectionsCount={collections.length}
      textsCount={allTexts.length}
      totalWords={totalWords}
    />
  );
}

export default function V2Page() {
  return (
    <main>
      <Suspense fallback={<V2Loading />}>
        <V2WithData />
      </Suspense>
    </main>
  );
}
