// Public identifiers and sample policy only. Never import manuscript or secrets here.
export const CINEMATIC_BOOK_ID = "the-last-free-path";
export const CINEMATIC_FREE_CHAPTER_IDS = ["01-the-house-that-leaned"] as const;
export const FREE_CHAPTER_COUNT = CINEMATIC_FREE_CHAPTER_IDS.length;

export function cinematicChapterAccess(number: number): "free" | "paid" {
  return Number.isInteger(number) && number >= 1 && number <= FREE_CHAPTER_COUNT
    ? "free"
    : "paid";
}

/** Hide assistant chrome only on this edition's chapter routes, including locales. */
export function isCinematicReaderPath(pathname: string): boolean {
  return /^\/(?:[a-z]{2}\/)?books\/the-last-free-path\/\d{2}-[^/]+\/?$/.test(
    pathname,
  );
}
