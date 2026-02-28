import { Metadata } from "next";
import Link from "next/link";
import { LibraryBrowse } from "./library-browse";
import { getCollections } from "../../lib/content";
import { Navbar } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Library of Arcanea | Wisdom, Legend, Poetry, and Practice",
  description:
    "Explore the Library of Arcanea - seventeen collections of wisdom, legend, poetry, and practice for the creative soul.",
  openGraph: {
    title: "Library of Arcanea",
    description: "Seventeen collections of wisdom, legend, poetry, and practice.",
  },
};

export default async function LibraryPage() {
  const collections = await getCollections();

  return (
    <div className="relative min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-24">
        {/* Tab Navigation */}
        <nav className="mb-12 flex items-center gap-3 border-b border-white/[0.06] pb-4">
          <Link
            href="/library"
            className="rounded-xl bg-atlantean-teal-aqua/10 border border-atlantean-teal-aqua/20 px-4 py-2 text-sm font-semibold text-atlantean-teal-aqua"
          >
            Browse Library
          </Link>
          <Link
            href="/library/codex"
            className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm text-text-muted hover:border-atlantean-teal-aqua/20 hover:text-atlantean-teal-aqua transition-all duration-300"
          >
            Luminor Codex
          </Link>
          <Link
            href="/library/graph"
            className="rounded-xl border border-white/[0.06] px-4 py-2 text-sm text-text-muted hover:border-atlantean-teal-aqua/20 hover:text-atlantean-teal-aqua transition-all duration-300"
          >
            Relationship Graph
          </Link>
        </nav>

        <LibraryBrowse collections={collections} />
      </main>
    </div>
  );
}
