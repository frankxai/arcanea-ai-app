export const MAX_PASSAGE_LENGTH = 1200;
export const MAX_BRIEF_LENGTH = 2000;

export interface SceneSource {
  bookId: string;
  bookTitle: string;
  chapterTitle: string;
  path: string;
  chapterHash: string;
  passage: string;
}

export function normalizePassage(text: string): string {
  return text.replace(/\s+/gu, " ").trim();
}

export function sceneBrief(passage: string): string {
  const clean = normalizePassage(passage);
  if (clean.length < 12 || clean.length > MAX_PASSAGE_LENGTH)
    throw new Error(
      `Select 12 to ${MAX_PASSAGE_LENGTH} characters from the chapter.`,
    );
  return [
    "Create a cinematic illustration of this passage.",
    "Preserve the actions, setting and character details stated in the passage. Treat unspecified visual details as an interpretation, not established canon. No lettering or watermarks.",
    "",
    clean,
  ].join("\n");
}

export async function chapterHash(content: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(content),
  );
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

/** Only raster image bytes or HTTPS references may be previewed/exported. */
export function imageSource(image: {
  data?: string;
  mimeType?: string;
  url?: string;
}): string | null {
  if (
    image.data &&
    /^image\/(png|jpeg|webp)$/.test(image.mimeType ?? "") &&
    /^[A-Za-z0-9+/]+={0,2}$/.test(image.data) &&
    image.data.length <= 4_000_000
  )
    return `data:${image.mimeType};base64,${image.data}`;
  if (image.url) {
    try {
      const url = new URL(image.url);
      if (url.protocol === "https:" && !url.username && !url.password)
        return url.href;
    } catch {
      return null;
    }
  }
  return null;
}
