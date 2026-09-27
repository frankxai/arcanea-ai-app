export function creationMediaUrl(
  content: unknown,
  type: string,
): string | null {
  if (typeof content === "string") return content || null;
  if (!content || typeof content !== "object" || Array.isArray(content))
    return null;

  const fields =
    type === "video"
      ? ["videoUrl", "fileUrl", "url"]
      : type === "music" || type === "audio"
        ? ["audioUrl", "fileUrl", "url"]
        : ["imageUrl", "fileUrl", "url"];
  const record = content as Record<string, unknown>;
  for (const field of fields) {
    const value = record[field];
    if (typeof value === "string" && value) return value;
  }
  return null;
}

export function creationTypeForMime(
  mime: string,
): "image" | "video" | "audio" | "text" {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return "text";
}

export function isDefiniteInsertRejection(code: unknown): boolean {
  return (
    typeof code === "string" &&
    [
      "22P02",
      "23502",
      "23503",
      "23505",
      "23514",
      "42501",
      "42P01",
      "PGRST204",
      "PGRST301",
    ].includes(code)
  );
}

export function safeCreationUrl(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  if (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\")
  )
    return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

export function previewableCreationUrl(
  value: string | null | undefined,
  origin: string | null,
): string | null {
  const safeUrl = safeCreationUrl(value);
  if (!safeUrl || safeUrl.startsWith("/")) return safeUrl;
  const parsed = new URL(safeUrl);
  const hostname = parsed.hostname;
  if (origin && parsed.origin === origin)
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  return hostname.endsWith(".supabase.co") ||
    hostname.endsWith(".public.blob.vercel-storage.com") ||
    hostname === "media.starlightintelligence.org" ||
    hostname === "arcanea.ai" ||
    hostname === "www.arcanea.ai"
    ? safeUrl
    : null;
}

export function ownedCreationStoragePaths(
  content: unknown,
  thumbnailUrl: string | null,
  userId: string,
  supabaseUrl: string,
): string[] {
  const values: unknown[] = [thumbnailUrl];
  if (typeof content === "string") values.push(content);
  if (content && typeof content === "object" && !Array.isArray(content)) {
    const record = content as Record<string, unknown>;
    for (const key of [
      "imageUrl",
      "videoUrl",
      "audioUrl",
      "fileUrl",
      "url",
      "thumbnailUrl",
      "captionsUrl",
      "transcriptUrl",
    ])
      values.push(record[key]);
  }

  const paths = new Set<string>();
  for (const value of values) {
    const path = ownedCreationStoragePath(value, userId, supabaseUrl);
    if (path) paths.add(path);
  }
  return [...paths];
}

export function ownedCreationStoragePath(
  value: unknown,
  userId: string,
  supabaseUrl: string,
): string | null {
  if (typeof value !== "string") return null;
  try {
    const origin = new URL(supabaseUrl).origin;
    const url = new URL(value);
    const prefix = "/storage/v1/object/public/creations/";
    if (url.origin !== origin || !url.pathname.startsWith(prefix)) return null;
    const path = decodeURIComponent(url.pathname.slice(prefix.length));
    if (
      !path.startsWith(`${userId}/`) ||
      path.split("/").some((segment) => segment === ".." || segment === ".") ||
      path.includes("\\")
    )
      return null;
    return path;
  } catch {
    return null;
  }
}
