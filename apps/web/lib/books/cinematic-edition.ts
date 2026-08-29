import 'server-only';

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { getBookRoot } from '@/lib/content/book-path';
import { countChapterWords, isChapterMarkdown } from '@/lib/saga/chapter-files';

export const CINEMATIC_BOOK_ID = 'the-last-free-path';
export const CINEMATIC_BOOK_TITLE = 'The Last Free Path';
export const CINEMATIC_BOOK_SERIES = 'Chronicles of Arcanea';
export const CINEMATIC_EDITION_ID = 'book-01-founding-cinematic';
export const CINEMATIC_EDITION_PRICE = '€17';
export const FREE_CHAPTER_COUNT = 4;

export function isCinematicEditionReleased(): boolean {
  return process.env.CINEMATIC_BOOK_PUBLICATION_STATE === 'released';
}

export const CINEMATIC_BOOK_DESCRIPTION =
  'After one impossible act saves a street and breaks the trust beneath it, a young mason is taken into a joint Academy inquiry where every lesson is also a claim on his future. Arion, Mera, and Emilia must decide whether power can be taught without becoming property.';

export const CINEMATIC_CHAPTER_DIR = join(
  getBookRoot(),
  'chronicles-of-arcanea',
  'book-01-the-three-academies',
  'cinematic-edition',
  'chapters',
);

export interface CinematicChapterSummary {
  id: string;
  filename: string;
  number: number;
  title: string;
  pov: string | null;
  movement: string | null;
  access: 'free' | 'paid';
  wordCount: number;
  readTime: number;
}

export interface CinematicChapter extends CinematicChapterSummary {
  content: string;
  totalChapters: number;
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}

function chapterId(filename: string): string {
  return filename
    .replace(/\.md$/i, '')
    .replace(/^chapter-/i, '');
}

function chapterNumber(filename: string, fallback: number): number {
  const match = filename.match(/^chapter-(\d+)-/i);
  return match ? Number.parseInt(match[1], 10) : fallback;
}

function fallbackTitle(id: string): string {
  return id
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function getCinematicChapterSummaries(): Promise<CinematicChapterSummary[]> {
  const files = (await readdir(CINEMATIC_CHAPTER_DIR))
    .filter(isChapterMarkdown)
    .sort();

  const chapters = await Promise.all(
    files.map(async (filename, index) => {
      const raw = await readFile(join(CINEMATIC_CHAPTER_DIR, filename), 'utf-8');
      const { data, content } = matter(raw);
      const number = chapterNumber(filename, index + 1);
      const words = countChapterWords(raw);
      const id = chapterId(filename);

      return {
        id,
        filename,
        number,
        title: typeof data.title === 'string' && data.title.trim()
          ? data.title.trim()
          : fallbackTitle(id),
        pov: typeof data.pov === 'string' ? data.pov : null,
        movement: typeof data.movement === 'string' ? data.movement : null,
        access: number <= FREE_CHAPTER_COUNT ? 'free' as const : 'paid' as const,
        wordCount: words,
        readTime: Math.max(1, Math.ceil(words / 250)),
      };
    }),
  );

  return chapters.sort((a, b) => a.number - b.number);
}

export async function getCinematicChapter(
  id: string,
  includeContent: boolean,
): Promise<CinematicChapter | null> {
  const chapters = await getCinematicChapterSummaries();
  const index = chapters.findIndex((chapter) => chapter.id === id);
  if (index < 0) return null;

  const chapter = chapters[index];
  const raw = includeContent
    ? await readFile(join(CINEMATIC_CHAPTER_DIR, chapter.filename), 'utf-8')
    : '';
  const content = includeContent
    ? matter(raw).content.replace(/^#\s+.+\r?\n+/, '')
    : '';

  return {
    ...chapter,
    content,
    totalChapters: chapters.length,
    prev: index > 0
      ? { id: chapters[index - 1].id, title: chapters[index - 1].title }
      : null,
    next: index < chapters.length - 1
      ? { id: chapters[index + 1].id, title: chapters[index + 1].title }
      : null,
  };
}

export async function getCinematicBookStats() {
  const chapters = await getCinematicChapterSummaries();
  return {
    chapters,
    chapterCount: chapters.length,
    wordCount: chapters.reduce((total, chapter) => total + chapter.wordCount, 0),
    readTime: chapters.reduce((total, chapter) => total + chapter.readTime, 0),
  };
}
