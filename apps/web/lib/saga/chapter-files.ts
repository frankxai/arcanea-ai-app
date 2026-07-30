import matter from 'gray-matter';

const NON_CHAPTER_FILES = new Set([
  'README.MD',
  'PITCH.MD',
  'CLAUDE.MD',
  'AUTHORS_NOTE.MD',
  'GLOSSARY.MD',
]);

const PROLOGUE_FILE = /^00-prolog(?:ue|o)?(?:[-_.]|$)/i;

export function isChapterMarkdown(filename: string): boolean {
  const normalized = filename.toUpperCase();

  if (!normalized.endsWith('.MD') || NON_CHAPTER_FILES.has(normalized)) {
    return false;
  }

  return !normalized.startsWith('00-') || PROLOGUE_FILE.test(filename);
}

export function countChapterWords(markdown: string): number {
  const { content } = matter(markdown);
  return content.split(/\s+/).filter(Boolean).length;
}
