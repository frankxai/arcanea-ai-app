import type { Metadata } from "next";
import { join } from "path";
import { notFound } from "next/navigation";
import { IllustratedNovellaReader } from "@/components/books/illustrated-novella-reader";
import { getBookRoot } from "@/lib/content/book-path";
import { isBookPublic } from "@/lib/content/book-visibility";
import { loadOrchardChapters } from "./selene-y-brio-orchard.data";

const BOOK_DIR = join(getBookRoot(), "selene-y-brio-orchard");
const COVER = "/images/books/selene-y-brio-orchard/cover.webp";

export async function generateMetadata(): Promise<Metadata> {
  if (!(await isBookPublic(BOOK_DIR))) return { title: "Book Not Found" };
  return {
    title: "The Orchard of Unspoken Names | Arcanea",
    description: "Book II of Selene & Brío, an illustrated Arcanea novella.",
    openGraph: { images: [COVER] },
  };
}

export default async function SeleneYBrioOrchardPage() {
  if (!(await isBookPublic(BOOK_DIR))) notFound();
  const chapters = await loadOrchardChapters();

  return (
    <IllustratedNovellaReader
      title="The Orchard of Unspoken Names"
      subtitle="Selene & Brío · Book II"
      author="Arcanea"
      cover={{
        src: COVER,
        alt: "Selene and Brío at the threshold of the orchard of unspoken names.",
        caption: "The Orchard of Unspoken Names",
      }}
      chapters={chapters}
      storageKey="arcanea:reader:selene-y-brio-orchard"
    />
  );
}
