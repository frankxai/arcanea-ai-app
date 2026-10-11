import matter from "gray-matter";

const NON_CHAPTER_BASENAMES = new Set([
  "README",
  "PITCH",
  "CLAUDE",
  "AUTHORS_NOTE",
  "GLOSSARY",
  "BIBLE",
  "OUTLINE",
]);

const PROLOGUE_BASENAME = /^00-prolog(?:ue|o)?(?:[-_.]|$)/i;

export function isChapterMarkdown(filename: string): boolean {
  if (!filename.endsWith(".md")) {
    return false;
  }

  const basename = filename.slice(0, -3);
  const normalizedBasename = basename.toUpperCase();

  if (NON_CHAPTER_BASENAMES.has(normalizedBasename)) {
    return false;
  }

  return (
    !normalizedBasename.startsWith("00-") || PROLOGUE_BASENAME.test(basename)
  );
}

/** HTML reader ID. Saga API slugs keep their separate numbered contract. */
export function chapterIdFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "").replace(/^\d+-/, "");
}

/** One title contract for the chapter list, reader and previous/next links. */
export function chapterTitleFromMarkdown(
  markdown: string,
  fallbackId: string,
): string {
  const { data, content } = matter(markdown);
  if (typeof data.title === "string" && data.title.trim())
    return data.title.trim();
  const h2WithPrefix = content.match(
    /^##\s+(?:Chapter\s+\w+:\s+|Kapitel\s+\d+:\s+|Capítulo\s+\d+:\s+)(.+)$/m,
  );
  if (h2WithPrefix) return h2WithPrefix[1].trim();
  const h1Chapter = content.match(/^#\s+Chapter\s+\w+:\s+(.+)$/m);
  if (h1Chapter) return h1Chapter[1].trim();
  const h2 = content.match(/^##\s+(.+)$/m);
  if (h2) return h2[1].trim();
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  return fallbackId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function countChapterWords(markdown: string): number {
  const { content } = matter(markdown);
  return content.split(/\s+/).filter(Boolean).length;
}
