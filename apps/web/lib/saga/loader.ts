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

// ============================================
// MULTI-SERIES LOADER
// ============================================

export interface BookSeries {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'active' | 'in-progress' | 'planned';
  contentType: 'novel' | 'novella' | 'serial' | 'anthology' | 'standalone';
  books: SeriesBook[];
  totalWordCount: number;
  totalChapters: number;
}

export interface SeriesBook {
  id: string;
  title: string;
  firstChapterSlug: string | null;
  chapterCount: number;
  wordCount: number;
}

/** Read all .md files directly in a directory (flat structure like Gate-Touched Files, Companions). */
async function loadFlatChapters(dir: string): Promise<{ count: number; wordCount: number; firstSlug: string | null }> {
  if (!(await dirExists(dir))) return { count: 0, wordCount: 0, firstSlug: null };
  const files = await readdir(dir);
  const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'README.md' && f !== 'PITCH.md' && f !== 'CLAUDE.md').sort();
  if (mdFiles.length === 0) return { count: 0, wordCount: 0, firstSlug: null };
  let totalWords = 0;
  for (const f of mdFiles) {
    const raw = await readFile(join(dir, f), 'utf-8');
    totalWords += countWords(raw);
  }
  return { count: mdFiles.length, wordCount: totalWords, firstSlug: mdFiles[0].replace(/\.md$/, '') };
}

/** Read chapters inside a single book subdirectory. */
async function loadBookDir(bookDir: string): Promise<{ count: number; wordCount: number; firstSlug: string | null; title: string }> {
  if (!(await dirExists(bookDir))) return { count: 0, wordCount: 0, firstSlug: null, title: '' };
  const files = await readdir(bookDir);
  const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'README.md' && f !== 'PITCH.md' && f !== 'CLAUDE.md').sort();
  if (mdFiles.length === 0) return { count: 0, wordCount: 0, firstSlug: null, title: '' };
  let totalWords = 0;
  let title = '';
  for (const f of mdFiles) {
    const raw = await readFile(join(bookDir, f), 'utf-8');
    totalWords += countWords(raw);
    if (!title) title = extractTitle(raw, f);
  }
  return { count: mdFiles.length, wordCount: totalWords, firstSlug: mdFiles[0].replace(/\.md$/, ''), title };
}

/** Scan a series directory for book subdirectories, returning one SeriesBook per subdir. */
async function loadSeriesBooks(seriesDir: string): Promise<SeriesBook[]> {
  if (!(await dirExists(seriesDir))) return [];
  const entries = await readdir(seriesDir, { withFileTypes: true });
  const bookDirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();
  if (bookDirs.length === 0) return [];
  const books: SeriesBook[] = [];
  for (const dirName of bookDirs) {
    const fullPath = join(seriesDir, dirName);
    const info = await loadBookDir(fullPath);
    books.push({
      id: dirName,
      title: info.title || dirName.replace(/^book-\d+-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      firstChapterSlug: info.firstSlug,
      chapterCount: info.count,
      wordCount: info.wordCount,
    });
  }
  return books;
}

/**
 * Return metadata for all eight series in the Arcanea multiverse.
 * Each entry includes live chapter/word counts read from disk.
 */
export async function getAllSeries(): Promise<BookSeries[]> {
  const SERIES_CONFIGS: Array<{
    id: string;
    dir: string;
    title: string;
    subtitle: string;
    description: string;
    status: BookSeries['status'];
    contentType: BookSeries['contentType'];
    /** 'books' = has book subdirectories; 'flat' = .md files directly in dir; 'sagas' = sagas subdir with episode subdirs */
    layout: 'books' | 'flat' | 'sagas';
  }> = [
    {
      id: 'chronicles',
      dir: join(BOOK_DIR, 'chronicles-of-arcanea'),
      title: 'Chronicles of Arcanea',
      subtitle: 'The main series',
      description: 'A ten-book epic following Kael and the Five-Fold Five through every Academy, Gate, and the shadow of Malachar.',
      status: 'active',
      contentType: 'novel',
      layout: 'books',
    },
    {
      id: 'starbound',
      dir: join(BOOK_DIR, 'starbound'),
      title: 'Starbound',
      subtitle: 'Crew missions across Arcanea',
      description: 'A series of novellas following specialist crews as they take on missions across the Arcanean world — monster hunts, Dungeon dives, diplomatic escorts, and the strange cases that fall between.',
      status: 'in-progress',
      contentType: 'novella',
      layout: 'books',
    },
    {
      id: 'dragonborne',
      dir: join(BOOK_DIR, 'dragonborne'),
      title: 'Dragonborne',
      subtitle: 'The dragon bond series',
      description: 'Stories from inside the bond between a dragon and the person who earned their trust. Each novella follows a different rider navigating loyalty, instinct, and the weight of being chosen by fire.',
      status: 'in-progress',
      contentType: 'novella',
      layout: 'books',
    },
    {
      id: 'dungeon-scrolls',
      dir: join(BOOK_DIR, 'dungeon-scrolls'),
      title: 'The Dungeon Scrolls',
      subtitle: 'Corrupted Gate temples',
      description: 'An anthology of stories set inside the Dungeons — ancient Gate temples warped by millennia of corrupted magic. Each story is a descent into a different ruin, a different kind of broken.',
      status: 'in-progress',
      contentType: 'anthology',
      layout: 'books',
    },
    {
      id: 'gate-touched-files',
      dir: join(BOOK_DIR, 'gate-touched-files'),
      title: 'Gate-Touched Files',
      subtitle: 'Street-level mutant stories',
      description: 'A serial following Gate-Touched people — those whose channels manifested wrong, too early, or outside any Academy — as they navigate a world that does not have a category for what they are.',
      status: 'active',
      contentType: 'serial',
      layout: 'flat',
    },
    {
      id: 'void-ascending',
      dir: join(BOOK_DIR, 'void-ascending'),
      title: 'Void Ascending',
      subtitle: 'The other side of the story',
      description: 'Told entirely from the perspective of those who serve the Hungry Void — not as villains, but as believers. A literary counterpoint to the Chronicles that complicates every easy answer.',
      status: 'in-progress',
      contentType: 'novel',
      layout: 'books',
    },
    {
      id: 'companions',
      dir: join(BOOK_DIR, 'companions'),
      title: 'Companions of Arcanea',
      subtitle: 'Stories from the bond',
      description: 'Short stories told from the perspective of the bonded creatures — familiars, mounts, companions — who share the journey but rarely get to tell their side of it.',
      status: 'in-progress',
      contentType: 'anthology',
      layout: 'flat',
    },
    {
      id: 'sagas',
      dir: join(BOOK_DIR, 'chronicles-of-arcanea', 'sagas'),
      title: 'Standalone Sagas',
      subtitle: 'Luminor Falling, The Drowned Archive, Pyralis',
      description: 'Three standalone novellas set in the Chronicles universe — each complete in itself, each illuminating a corner of Arcanea that the main series glimpses but never fully enters.',
      status: 'active',
      contentType: 'standalone',
      layout: 'sagas',
    },
  ];

  const result: BookSeries[] = [];

  for (const cfg of SERIES_CONFIGS) {
    let books: SeriesBook[] = [];

    if (cfg.layout === 'flat') {
      // Files sit directly in the series dir
      const info = await loadFlatChapters(cfg.dir);
      books = [{
        id: cfg.id,
        title: cfg.title,
        firstChapterSlug: info.firstSlug,
        chapterCount: info.count,
        wordCount: info.wordCount,
      }];
    } else if (cfg.layout === 'sagas') {
      // Each subdir is a standalone saga with its own chapter files
      books = await loadSeriesBooks(cfg.dir);
    } else {
      // 'books' — subdirectories named book-01-*, book-02-*, etc.
      books = await loadSeriesBooks(cfg.dir);
    }

    const totalChapters = books.reduce((sum, b) => sum + b.chapterCount, 0);
    const totalWordCount = books.reduce((sum, b) => sum + b.wordCount, 0);

    result.push({
      id: cfg.id,
      title: cfg.title,
      subtitle: cfg.subtitle,
      description: cfg.description,
      status: cfg.status,
      contentType: cfg.contentType,
      books,
      totalChapters,
      totalWordCount,
    });
  }

  return result;
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
