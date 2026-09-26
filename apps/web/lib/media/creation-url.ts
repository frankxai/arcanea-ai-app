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
