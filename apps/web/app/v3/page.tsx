import { Suspense } from "react";
import { getCollections, getAllTexts } from "@/lib/content";
import { V3Content, V3Loading } from "./v3-content";

async function V3WithData() {
  const collections = await getCollections();
  const allTexts = await getAllTexts();
  const totalWords = allTexts.reduce(
    (sum, t) => sum + (t.frontmatter.wordCount || 0),
    0,
  );

  return (
    <V3Content
      collectionsCount={collections.length}
      textsCount={allTexts.length}
      totalWords={totalWords}
    />
  );
}

export default function V3Page() {
  return (
    <main>
      <Suspense fallback={<V3Loading />}>
        <V3WithData />
      </Suspense>
    </main>
  );
}
