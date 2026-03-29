/**
 * Saga Content Loader
 *
 * Reads the structured saga content from book/chapters/, book/worldbuilding/,
 * book/characters/, and book/legends-of-arcanea/. Follows the same disk-based
 * pattern as the Library content loader but is purpose-built for the novel
 * chapter structure (numbered files, book sub-directories).
 */

import { readdir, readFile, access } from 'fs/promises';
import { join } from 'path';

// ============================================
// TYPES
// ============================================

export interface SagaBook {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'complete' | 'in-progress' | 'outlined' | 'planned';
  chapterCount: number;
  wordCount: number;
  chapters: SagaChapter[];
}

export interface SagaChapter {
  id: string;
  bookId: string;
  number: number;
  title: string;
  slug: string;
  wordCount: number;
  content: string;
  excerpt: string;
}

export interface SagaDocument {
  id: string;
  category: 'worldbuilding' | 'characters' | 'legends' | 'reference';
  title: string;
  slug: string;
  wordCount: number;
  content: string;
  excerpt: string;
}

// ============================================
// CONFIGURATION
// ============================================

const BOOK_DIR = join(process.cwd(), '..', '..', 'book');

const BOOK_META: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  status: SagaBook['status'];
}> = {
  book1: {
    title: 'The Five-Fold Fire',
    subtitle: 'Book One of the Arcanea Saga',
    description:
      'A lighthouse keeper discovers they can channel all five elements ' +
      'as the Foundation Gate opens and ancient forces stir beneath the world.',
    status: 'in-progress',
  },
  book2: {
    title: 'The Drowned Archive',
    subtitle: 'Book Two of the Arcanea Saga',
    description:
      'The politics of knowledge unfold as the heroes descend into the ' +
      'flooded libraries where memory and water converge.',
    status: 'outlined',
  },
};

/** Map category name to directory under book/ */
const CATEGORY_DIRS: Record<SagaDocument['category'], string> = {
  worldbuilding: 'worldbuilding',
  characters: 'characters',
  legends: 'legends-of-arcanea',
  reference: 'chronicles-of-arcanea',
};

// ============================================
// HELPERS
// ============================================

/** Strip markdown formatting for plain-text excerpts. */
function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+.*$/gm, '')  // headings
    .replace(/\*\*|__/g, '')           // bold
    .replace(/\*|_/g, '')             // italic
    .replace(/~~.*?~~/g, '')          // strikethrough
    .replace(/!\[.*?\]\(.*?\)/g, '')  // images
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1') // links -> text
    .replace(/>`[^`]*`/g, '')         // inline code
    .replace(/^>\s?/gm, '')           // blockquotes
    .replace(/^[-*+]\s/gm, '')        // list markers
    .replace(/^\d+\.\s/gm, '')        // ordered list markers
    .replace(/---+/g, '')             // horizontal rules
    .replace(/\n{2,}/g, '\n')         // collapse blank lines
    .trim();
}

function makeExcerpt(content: string, length = 200): string {
  const plain = stripMarkdown(content);
  if (plain.length <= length) return plain;
  return plain.slice(0, length).replace(/\s+\S*$/, '') + '...';
}

function countWords(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

/**
 * Extract the chapter number from a filename like "01-the-storm-that-remembered.md".
 * Returns 0 for files that start with "00-" (prologues, outlines).
 */
function extractChapterNumber(filename: string): number {
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Extract a human-readable title from markdown content (first # heading)
 * or fall back to the filename.
 */
function extractTitle(content: string, filename: string): string {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) return headingMatch[1].trim();

  // Derive from filename: "01-the-storm-that-remembered.md" -> "The Storm That Remembered"
  return filename
    .replace(/\.md$/, '')
    .replace(/^\d+-/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Convert a filename to a URL-safe slug.
 * "01-the-storm-that-remembered.md" -> "01-the-storm-that-remembered"
 */
function filenameToSlug(filename: string): string {
  return filename.replace(/\.md$/, '').toLowerCase();
}

async function dirExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// BOOK / CHAPTER LOADERS
// ============================================

/**
 * List all saga books with metadata and chapter summaries (no full content).
 */
export async function getSagaBooks(): Promise<SagaBook[]> {
  const chaptersRoot = join(BOOK_DIR, 'chapters');
  if (!(await dirExists(chaptersRoot))) return [];

  const entries = await readdir(chaptersRoot, { withFileTypes: true });
  const bookDirs = entries
    .filter(e => e.isDirectory() && e.name.startsWith('book'))
    .map(e => e.name)
    .sort();

  const books: SagaBook[] = [];

  for (const dir of bookDirs) {
    const book = await loadBookMeta(dir);
    if (book) books.push(book);
  }

  return books;
}

async function loadBookMeta(bookId: string): Promise<SagaBook | null> {
  const bookPath = join(BOOK_DIR, 'chapters', bookId);
  if (!(await dirExists(bookPath))) return null;

  const files = await readdir(bookPath);
  const mdFiles = files
    .filter(f => f.endsWith('.md'))
    .sort();

  let totalWords = 0;
  const chapters: SagaChapter[] = [];

  for (const filename of mdFiles) {
    const filePath = join(bookPath, filename);
    const raw = await readFile(filePath, 'utf-8');
    const wc = countWords(raw);
    totalWords += wc;

    chapters.push({
      id: `${bookId}/${filenameToSlug(filename)}`,
      bookId,
      number: extractChapterNumber(filename),
      title: extractTitle(raw, filename),
      slug: filenameToSlug(filename),
      wordCount: wc,
      content: '',  // omit full content in list view
      excerpt: makeExcerpt(raw),
    });
  }

  chapters.sort((a, b) => a.number - b.number);

  const meta = BOOK_META[bookId] ?? {
    title: bookId.replace(/^book/, 'Book '),
    subtitle: `Book ${bookId.replace('book', '')} of the Arcanea Saga`,
    description: '',
    status: 'planned' as const,
  };

  return {
    id: bookId,
    title: meta.title,
    subtitle: meta.subtitle,
    description: meta.description,
    status: meta.status,
    chapterCount: chapters.length,
    wordCount: totalWords,
    chapters,
  };
}

/**
 * Get a single book with full chapter list (still no full content per chapter).
 */
export async function getSagaBook(bookId: string): Promise<SagaBook | null> {
  return loadBookMeta(bookId);
}

/**
 * Get a single chapter with full markdown content.
 */
export async function getSagaChapter(
  bookId: string,
  chapterSlug: string,
): Promise<SagaChapter | null> {
  const bookPath = join(BOOK_DIR, 'chapters', bookId);
  if (!(await dirExists(bookPath))) return null;

  const files = await readdir(bookPath);
  const filename = files.find(
    f => f.endsWith('.md') && filenameToSlug(f) === chapterSlug,
  );

  if (!filename) return null;

  const filePath = join(bookPath, filename);
  const raw = await readFile(filePath, 'utf-8');

  return {
    id: `${bookId}/${chapterSlug}`,
    bookId,
    number: extractChapterNumber(filename),
    title: extractTitle(raw, filename),
    slug: chapterSlug,
    wordCount: countWords(raw),
    content: raw,
    excerpt: makeExcerpt(raw),
  };
}

// ============================================
// DOCUMENT LOADERS (worldbuilding, characters, etc.)
// ============================================

/**
 * List all documents in a category.
 */
export async function getSagaDocuments(
  category: SagaDocument['category'],
): Promise<SagaDocument[]> {
  const dirName = CATEGORY_DIRS[category];
  if (!dirName) return [];

  const dirPath = join(BOOK_DIR, dirName);
  if (!(await dirExists(dirPath))) return [];

  const files = await readdir(dirPath);
  const mdFiles = files
    .filter(f => f.endsWith('.md') && f !== 'README.md' && f !== 'CLAUDE.md')
    .sort();

  const docs: SagaDocument[] = [];

  for (const filename of mdFiles) {
    const filePath = join(dirPath, filename);
    const raw = await readFile(filePath, 'utf-8');

    docs.push({
      id: `${category}/${filenameToSlug(filename)}`,
      category,
      title: extractTitle(raw, filename),
      slug: filenameToSlug(filename),
      wordCount: countWords(raw),
      content: '',  // omit in list view
      excerpt: makeExcerpt(raw),
    });
  }

  return docs;
}

/**
 * Get a single document with full content.
 */
export async function getSagaDocument(
  category: SagaDocument['category'],
  slug: string,
): Promise<SagaDocument | null> {
  const dirName = CATEGORY_DIRS[category];
  if (!dirName) return null;

  const dirPath = join(BOOK_DIR, dirName);
  if (!(await dirExists(dirPath))) return null;

  const files = await readdir(dirPath);
  const filename = files.find(
    f => f.endsWith('.md') && filenameToSlug(f) === slug,
  );

  if (!filename) return null;

  const filePath = join(dirPath, filename);
  const raw = await readFile(filePath, 'utf-8');

  return {
    id: `${category}/${slug}`,
    category,
    title: extractTitle(raw, filename),
    slug,
    wordCount: countWords(raw),
    content: raw,
    excerpt: makeExcerpt(raw),
  };
}
