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
  let keptFrom = 0;
  let prefix = "";
  let omittedHeading = false;
  let otherHeading = false;
  for (const line of content.matchAll(/[^\r\n]*(?:\r\n|\n|\r|$)/g)) {
    if (!line[0]) break;
    const text = line[0].replace(/[\r\n]+$/, "");
    const next = (line.index ?? 0) + line[0].length;
    if (/^[ \t]*$/.test(text)) {
      if (omittedHeading) keptFrom = next;
      continue;
    }
    // Preserve separators around unmatched book/series headings.
    if (
      /^ {0,3}(?:(?:\*[ \t]*){3,}|(?:-[ \t]*){3,}|(?:_[ \t]*){3,})$/.test(text)
    ) {
      if (omittedHeading) keptFrom = next;
      else if (!otherHeading) break;
      continue;
    }
    // Stop at prose, code, quotes, or a repeated title.
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
    if (!titles.has(title)) {
      // Some accepted manuscripts have a different legacy book/series heading.
      // Preserve it, but permit an explicit numbered chapter title below it.
      otherHeading = true;
      omittedHeading = false;
      continue;
    }
    if (consumed.has(title)) break;
    const numberedChapter =
      chapterName !== heading[1] &&
      normalizeTitle(chapterName) === normalizeTitle(chapterTitle);
    if (otherHeading && !numberedChapter) break;
    const kept = content.slice(keptFrom, line.index ?? 0);
    if (prefix || kept.trim()) prefix += kept;
    consumed.add(title);
    keptFrom = next;
    omittedHeading = true;
  }
  return consumed.size ? prefix + content.slice(keptFrom) : content;
}
