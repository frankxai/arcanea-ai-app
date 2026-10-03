import { readFile } from 'fs/promises';
import { dirname, isAbsolute, join, relative, resolve } from 'path';
import yaml from 'js-yaml';
import { getBookRoot } from './book-path';

export type BookVisibility = 'public' | 'private';

/**
 * `status:` cannot carry this signal: every manifest under book/ reads `status: in-progress`,
 * including the memoir of a living person whose own manifest records the surname as withheld
 * pending consent. Publication therefore needs its own key, and anything that is not literally
 * 'public' — missing manifest, unreadable manifest, absent key, typo — resolves to private.
 */
function readVisibility(data: unknown): BookVisibility {
  return (data as { visibility?: unknown } | null)?.visibility === 'public'
    ? 'public'
    : 'private';
}

/** `relative()` returns an absolute path across Windows drives, which does not start with '..'. */
function isWithin(root: string, candidate: string): boolean {
  const rel = relative(root, candidate);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

/**
 * Some books keep prose in a `chapters/` subdirectory while the manifest sits at the book
 * root, so the lookup allows exactly one parent hop. It is deliberately not a full walk to
 * BOOK_ROOT: an unbounded walk would let a single `book/book.yaml` publish every work
 * beneath it that lacks its own manifest.
 */
const MAX_PARENT_HOPS = 1;

export async function getBookVisibility(bookDir: string): Promise<BookVisibility> {
  const root = resolve(getBookRoot());
  let current = resolve(bookDir);

  for (let hop = 0; hop <= MAX_PARENT_HOPS; hop++) {
    // BOOK_ROOT is the content tree, not a book; a manifest there governs nothing.
    if (current === root || !isWithin(root, current)) return 'private';

    try {
      const raw = await readFile(join(current, 'book.yaml'), 'utf-8');
      try {
        return readVisibility(yaml.load(raw));
      } catch {
        return 'private';
      }
    } catch {
      const parent = dirname(current);
      if (parent === current) return 'private';
      current = parent;
    }
  }

  return 'private';
}

export async function isBookPublic(bookDir: string): Promise<boolean> {
  return (await getBookVisibility(bookDir)) === 'public';
}
