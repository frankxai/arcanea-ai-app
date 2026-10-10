/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { readdir, readFile, access } from "fs/promises";
import { join } from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import yaml from "js-yaml";
import { remark } from "remark";
import remarkHtml from "remark-html";

import { ChapterNav } from "../../components/chapter-nav";
import { AuthorWorkspace } from "../../components/author-workspace";
import { CharacterTracker } from "../../components/character-tracker";
import { BookHeader } from "../../components/book-header";
import { createClient } from "@/lib/supabase/server";
import { isBookPublic } from "@/lib/content/book-visibility";
import { getBookRoot } from "@/lib/content/book-path";

export const dynamic = "force-dynamic";

const BOOK_ROOT = getBookRoot();

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Next.js normalises encoded separators out of a dynamic segment today, so `bookSlug`
 * has not been observed to escape BOOK_ROOT. This resolves the slug against the actual
 * directory listing anyway: the guarantee belongs to this route, not to the router's
 * current normalisation behaviour.
 */
async function resolveBookDir(bookSlug: string): Promise<string | null> {
  const entries = await readdir(BOOK_ROOT, { withFileTypes: true });
  const match = entries.find((e) => e.isDirectory() && e.name === bookSlug);
  return match ? join(BOOK_ROOT, match.name) : null;
}

interface BookManifest {
  title?: string;
  slug?: string;
  subtitle?: string;
  status?: string;
}

interface PageProps {
  params: Promise<{ bookSlug: string; chapterSlug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { bookSlug, chapterSlug } = await params;
  const pretty = chapterSlug
    .replace(/^\d+-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Editing ${pretty} — Author Studio`,
    description: `Writing workspace for ${bookSlug}`,
  };
}

export default async function AuthorWorkspacePage({ params }: PageProps) {
  const { bookSlug, chapterSlug } = await params;
  const bookDir = await resolveBookDir(bookSlug);
  if (!bookDir) notFound();
  if (!(await isBookPublic(bookDir))) {
    const db = await createClient();
    const {
      data: { user },
      error: authError,
    } = await db.auth.getUser();
    if (authError || !user) notFound();
    const { data: book, error: bookError } = await db
      .from("books")
      .select("id")
      .eq("slug", bookSlug)
      .maybeSingle();
    if (bookError)
      throw new Error("Book access could not be verified. Try again.");
    if (!book) notFound();
    const { data: author, error: authorError } = await db
      .from("book_authors")
      .select("role")
      .eq("book_id", book.id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (authorError)
      throw new Error("Book access could not be verified. Try again.");
    if (!author) notFound();
  }

  const chaptersDir = join(bookDir, "chapters");
  if (!(await exists(chaptersDir))) notFound();

  // Load book manifest
  let bookTitle = bookSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  let bookSubtitle = "";

  const yamlPath = join(bookDir, "book.yaml");
  if (await exists(yamlPath)) {
    try {
      const raw = await readFile(yamlPath, "utf-8");
      const data = yaml.load(raw) as BookManifest | null;
      if (data?.title) bookTitle = data.title;
      if (data?.subtitle) bookSubtitle = data.subtitle;
    } catch {
      // Fallback to slug-derived title
    }
  }

  // Load all chapters
  const files = await readdir(chaptersDir);
  const mdFiles = files
    .filter((f) => f.endsWith(".md") && f !== "CLAUDE.md")
    .sort();

  const chapters = await Promise.all(
    mdFiles.map(async (filename, idx) => {
      const raw = await readFile(join(chaptersDir, filename), "utf-8");
      const wordCount = raw.split(/\s+/).filter(Boolean).length;
      const titleMatch = raw.match(/^#\s+(.+)$/m);
      return {
        slug: filename.replace(/\.md$/, ""),
        title: titleMatch
          ? titleMatch[1].trim()
          : filename
              .replace(/\.md$/, "")
              .replace(/^\d+-/, "")
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
        wordCount,
        order: idx,
      };
    }),
  );

  const totalWords = chapters.reduce((sum, ch) => sum + ch.wordCount, 0);

  // Load current chapter
  const currentFile = mdFiles.find(
    (f) => f.replace(/\.md$/, "") === chapterSlug,
  );
  if (!currentFile) notFound();

  const chapterContent = await readFile(
    join(chaptersDir, currentFile),
    "utf-8",
  );
  const chapterTitle =
    chapterContent.match(/^#\s+(.+)$/m)?.[1]?.trim() || chapterSlug;

  // Convert markdown to HTML for the rich editor (Tiptap/Novel.js)
  const htmlResult = await remark().use(remarkHtml).process(chapterContent);
  const chapterHtml = String(htmlResult);

  return (
    <div className="h-screen flex flex-col bg-[var(--arc-cosmic-void)] overflow-hidden">
      {/* Top bar */}
      <BookHeader
        title={bookTitle}
        subtitle={bookSubtitle}
        chapterCount={chapters.length}
        totalWords={totalWords}
        currentChapter={chapterTitle}
        bookSlug={bookSlug}
      />

      <details className="border-b border-white/10 px-4 lg:hidden">
        <summary className="flex min-h-11 cursor-pointer items-center text-sm text-white/80">
          Chapters
        </summary>
        <nav aria-label="Chapters" className="max-h-60 overflow-y-auto pb-3">
          {chapters.map((chapter) => (
            <a
              key={chapter.slug}
              href={`/studio/author/${bookSlug}/${chapter.slug}`}
              aria-current={chapter.slug === chapterSlug ? "page" : undefined}
              className="flex min-h-11 items-center rounded-lg px-3 text-sm text-white/80 focus-visible:outline"
            >
              {chapter.title}
            </a>
          ))}
        </nav>
      </details>

      {/* Three-column workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chapter navigation */}
        <div className="hidden lg:contents">
          <ChapterNav
            bookSlug={bookSlug}
            chapters={chapters}
            currentSlug={chapterSlug}
            totalWords={totalWords}
          />
        </div>

        <AuthorWorkspace
          key={`${bookSlug}/${chapterSlug}`}
          bookSlug={bookSlug}
          chapterSlug={chapterSlug}
          initialHtml={chapterHtml}
          initialText={chapterContent}
        >
          <CharacterTracker
            bookSlug={bookSlug}
            chapterContent={chapterContent}
          />
        </AuthorWorkspace>
      </div>
    </div>
  );
}
