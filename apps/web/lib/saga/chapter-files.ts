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

export function countChapterWords(markdown: string): number {
  const { content } = matter(markdown);
  return content.split(/\s+/).filter(Boolean).length;
}
