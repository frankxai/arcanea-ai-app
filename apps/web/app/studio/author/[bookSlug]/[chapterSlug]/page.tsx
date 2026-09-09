import { readdir, readFile, access } from "fs/promises";
import { join } from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import yaml from "js-yaml";
import { remark } from "remark";
import remarkHtml from "remark-html";

import { ChapterNav } from "../../components/chapter-nav";
import { AuthorAIPanel } from "../../components/author-ai-panel";
import { BookHeader } from "../../components/book-header";
import { CharacterTracker } from "../../components/character-tracker";
import { AuthorEditor } from "../../components/author-editor";
import { getBookRoot } from "@/lib/content/book-path";
import { readAuthorDraft } from "@/lib/author/read-draft";

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

  const chaptersDir = join(bookDir, "chapters");

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
  const files = (await exists(chaptersDir)) ? await readdir(chaptersDir) : [];
  const mdFiles = files
    .filter((f) => f.endsWith(".md") && !["CLAUDE.md", "AGENTS.md"].includes(f))
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

  // Load current chapter
  const currentFile = mdFiles.find(
    (f) => f.replace(/\.md$/, "") === chapterSlug,
  );
  const draftRead = await readAuthorDraft(bookSlug, chapterSlug);
  if (!currentFile && draftRead.status === "none") notFound();
  const draft = draftRead.status === "found" ? draftRead.draft : null;

  const chapterContent = currentFile
    ? await readFile(join(chaptersDir, currentFile), "utf-8")
    : "";
  const activeContent = draft?.content ?? chapterContent;
  const chapterTitle =
    activeContent.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
    chapterContent.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
    chapterSlug;
  const currentWords =
    draft?.wordCount ?? chapterContent.split(/\s+/).filter(Boolean).length;
  const chapterIndex = chapters.findIndex(
    (chapter) => chapter.slug === chapterSlug,
  );
  if (draft) {
    const entry = {
      slug: chapterSlug,
      title: chapterTitle,
      wordCount: currentWords,
      order: chapterIndex < 0 ? chapters.length : chapterIndex,
    };
    if (chapterIndex < 0) chapters.push(entry);
    else chapters[chapterIndex] = entry;
  }
  const totalWords = chapters.reduce((sum, ch) => sum + ch.wordCount, 0);

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

      {/* Three-column workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chapter navigation */}
        <ChapterNav
          bookSlug={bookSlug}
          chapters={chapters}
          currentSlug={chapterSlug}
          totalWords={totalWords}
        />

        {/* Center: Editor */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-12">
            {draftRead.status === "unavailable" ? (
              <div
                role="alert"
                className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-6 text-sm leading-relaxed text-amber-200"
              >
                <h1 className="mb-2 text-lg font-semibold">
                  Your draft could not be loaded
                </h1>
                <p>
                  Try again before editing so you can continue from your saved
                  work.
                </p>
                <form
                  method="get"
                  action={`/studio/author/${encodeURIComponent(bookSlug)}/${encodeURIComponent(chapterSlug)}`}
                >
                  <button
                    type="submit"
                    className="mt-4 min-h-11 rounded-lg border border-white/20 px-4 text-white/90 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Try again
                  </button>
                </form>
              </div>
            ) : (
              <AuthorEditor
                key={`${bookSlug}/${chapterSlug}`}
                bookSlug={bookSlug}
                chapterSlug={chapterSlug}
                initialHtml={chapterHtml}
                initialContent={draft?.contentJson}
                initialWordCount={currentWords}
                initialSavedAt={draft?.updatedAt}
                initialSource={draft ? "draft" : "published"}
              />
            )}
          </div>
        </main>

        {/* Right: AI + Characters */}
        <div className="flex flex-col">
          {draftRead.status !== "unavailable" && (
            <>
              <CharacterTracker
                bookSlug={bookSlug}
                chapterContent={activeContent}
              />
              <AuthorAIPanel bookSlug={bookSlug} currentChapter={chapterSlug} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
