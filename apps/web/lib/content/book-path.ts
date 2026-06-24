import { existsSync } from 'fs';
import { join } from 'path';

let cachedBookRoot: string | null = null;

/**
 * Dynamically resolves the absolute path to the 'book' directory.
 * Looks in the two supported execution roots:
 * - monorepo root
 * - apps/web package root
 */
export function getBookRoot(): string {
  if (cachedBookRoot) return cachedBookRoot;

  const cwd = process.cwd();

  // Option A: book is directly under process.cwd() (monorepo root context)
  const pathA = join(/*turbopackIgnore: true*/ cwd, 'book');
  if (existsSync(pathA)) {
    cachedBookRoot = pathA;
    return pathA;
  }

  // Option B: book is two levels up (apps/web context)
  const pathB = join(/*turbopackIgnore: true*/ cwd, '..', '..', 'book');
  if (existsSync(pathB)) {
    cachedBookRoot = pathB;
    return pathB;
  }

  // Fallback to option B
  cachedBookRoot = pathB;
  return pathB;
}
