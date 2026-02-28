import { Suspense } from "react";
import { getCollections, getAllTexts } from "@/lib/content";
import { V3Content as HomeContent, V3Loading as HomeLoading } from "./v3/v3-content";

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
      <Suspense fallback={<HomeLoading />}>
        <HomeWithData />
      </Suspense>
    </main>
  );
}
