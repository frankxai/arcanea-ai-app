function normalizeTitle(title: string): string {
  return title.normalize("NFC").trim().replace(/\s+/gu, " ").toLowerCase();
}

/**
 * Omit plain opening title headings already present in the reader header.
 * This is a display projection. Keep the original manuscript for selection,
 * source identity, scene creation and export; never rewrite authored content.
 */
export function getReaderContent(
  content: string,
  bookTitle: string,
  chapterTitle: string,
): string {
  const titles = new Set(
    [bookTitle, chapterTitle].map(normalizeTitle).filter(Boolean),
  );
  const consumed = new Set<string>();
  let end = 0;
  for (const line of content.matchAll(/[^\r\n]*(?:\r\n|\n|\r|$)/g)) {
    if (!line[0]) break;
    const text = line[0].replace(/[\r\n]+$/, "");
    const next = (line.index ?? 0) + line[0].length;
    if (/^[ \t]*$/.test(text)) {
      if (consumed.size) end = next;
      continue;
    }
    // Separators are part of the opening title block only after a match.
    if (
      consumed.size &&
      /^ {0,3}(?:(?:\*[ \t]*){3,}|(?:-[ \t]*){3,}|(?:_[ \t]*){3,})$/.test(text)
    ) {
      end = next;
      continue;
    }
    // Stop at prose, code, quotes, an unrelated heading, or a repeated title.
    // H3 and deeper headings are meaningful sections, even if names match.
    const heading = text.match(/^ {0,3}#{1,2}[ \t]+(.+?)[ \t]*$/);
    if (!heading) break;
    const headingTitle = normalizeTitle(heading[1]);
    // Match the chapter loader's existing numbered-title conventions. Only
    // remove a prefix when the remainder equals this chapter's exact title.
    const chapterName = heading[1].replace(
      /^(?:Chapter\s+\w+:\s+|Kapitel\s+\d+:\s+|Capítulo\s+\d+:\s+)/,
      "",
    );
    const title =
      normalizeTitle(chapterName) === normalizeTitle(chapterTitle)
        ? normalizeTitle(chapterTitle)
        : headingTitle;
    if (!titles.has(title) || consumed.has(title)) break;
    consumed.add(title);
    end = next;
  }
  return consumed.size ? content.slice(end) : content;
}
