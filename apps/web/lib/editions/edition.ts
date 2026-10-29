/** Local edition assembly. No provider calls, public writes, or verification claims. */
export const EDITION_LIMIT = 1_000_000;
export const EDITION_RECORD_LIMIT = EDITION_LIMIT * 2;
export const SECTION_LIMIT = 24;
export type EditionScope = { owner: string; project: string };
export type EditionSource = { docId: string; revision: number; sha256: string };
export type EditionSection = {
  id: string;
  title: string;
  text: string;
  source: EditionSource | null;
};
export type EditionDraft = {
  version: 1;
  scope: EditionScope;
  title: string;
  sections: EditionSection[];
};
export type EditionStorage = Pick<Storage, "getItem" | "setItem">;

export function editionKey(scope: EditionScope): string {
  return `arcanea-edition:v1:${encodeURIComponent(scope.owner)}:${encodeURIComponent(scope.project)}`;
}

export function emptyEdition(scope: EditionScope, title: string): EditionDraft {
  return { version: 1, scope, title: title.slice(0, 500), sections: [] };
}

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function parseEdition(raw: string, scope: EditionScope): EditionDraft {
  if (new TextEncoder().encode(raw).length > EDITION_LIMIT)
    throw new Error("This edition exceeds the 1 MB draft limit.");
  const value: unknown = JSON.parse(raw);
  if (
    !record(value) ||
    value.version !== 1 ||
    !record(value.scope) ||
    value.scope.owner !== scope.owner ||
    value.scope.project !== scope.project ||
    typeof value.title !== "string" ||
    value.title.length > 500 ||
    !Array.isArray(value.sections) ||
    value.sections.length > SECTION_LIMIT
  )
    throw new Error(
      "The saved edition does not match this account and project.",
    );
  const ids = new Set<string>();
  for (const section of value.sections) {
    if (
      !record(section) ||
      typeof section.id !== "string" ||
      !section.id ||
      section.id.length > 100 ||
      ids.has(section.id) ||
      typeof section.title !== "string" ||
      section.title.length > 500 ||
      typeof section.text !== "string"
    )
      throw new Error("A saved section could not be read.");
    ids.add(section.id);
    if (
      section.source !== null &&
      (!record(section.source) ||
        typeof section.source.docId !== "string" ||
        !section.source.docId ||
        section.source.docId.length > 100 ||
        !Number.isSafeInteger(section.source.revision) ||
        Number(section.source.revision) < 0 ||
        typeof section.source.sha256 !== "string" ||
        !/^[a-f0-9]{64}$/.test(section.source.sha256))
    )
      throw new Error("A saved source reference could not be read.");
  }
  const parsed = value as EditionDraft;
  return {
    version: 1,
    scope: { ...scope },
    title: parsed.title,
    sections: parsed.sections.map((section) => ({
      id: section.id,
      title: section.title,
      text: section.text,
      source:
        section.source === null
          ? null
          : {
              docId: section.source.docId,
              revision: section.source.revision,
              sha256: section.source.sha256,
            },
    })),
  };
}

export function readEditionSource(
  raw: string,
  scope: EditionScope,
  docId: string,
) {
  if (new TextEncoder().encode(raw).length > EDITION_LIMIT)
    throw new Error("This source is too large for the edition draft.");
  const payload: unknown = JSON.parse(raw);
  const doc = record(payload) && record(payload.data) ? payload.data.doc : null;
  if (
    !record(doc) ||
    doc.id !== docId ||
    doc.user_id !== scope.owner ||
    doc.project_id !== scope.project ||
    typeof doc.title !== "string" ||
    doc.title.length > 500 ||
    !record(doc.content) ||
    typeof doc.content.content_text !== "string"
  )
    throw new Error("This source could not be confirmed for your project.");
  const revision = doc.save_revision ?? 0;
  if (
    typeof revision !== "number" ||
    !Number.isSafeInteger(revision) ||
    revision < 0
  )
    throw new Error("This source has an unreadable revision.");
  if (!doc.content.content_text.trim())
    throw new Error(
      "This document has no text yet. Open its editor to add writing first.",
    );
  return { title: doc.title, text: doc.content.content_text, revision };
}

/** Detect stored conflicts; callers serialize cooperating tabs with Web Locks. */
export function persistEdition(
  storage: EditionStorage,
  draft: EditionDraft,
  expected: string | null,
  current: () => boolean,
): string {
  if (!current())
    throw new Error(
      "Your account changed. Reopen this project before editing.",
    );
  const raw = JSON.stringify(draft);
  parseEdition(raw, draft.scope);
  const key = editionKey(draft.scope);
  if (expected !== null) parseEdition(expected, draft.scope);
  if (storage.getItem(key) !== expected)
    throw new Error(
      "Another tab changed this draft. Download your current copy before reloading.",
    );
  storage.setItem(key, raw);
  return raw;
}

/** Restore a portable record into this project; hashes detect corruption, not authorship. */
export async function importEdition(
  raw: string,
  scope: EditionScope,
  current: () => boolean,
): Promise<EditionDraft> {
  if (!current()) throw new Error("Your account changed. Import stopped.");
  if (new TextEncoder().encode(raw).length > EDITION_RECORD_LIMIT)
    throw new Error("This source record exceeds the 2 MB import limit.");
  const value: unknown = JSON.parse(raw);
  if (
    !record(value) ||
    value.schema !== "arcanea.edition.v1" ||
    value.projectId !== scope.project ||
    !Array.isArray(value.sections)
  )
    throw new Error(
      "Choose an edition source record exported from this project.",
    );
  const draft = parseEdition(
    JSON.stringify({
      version: 1,
      scope,
      title: value.title,
      sections: value.sections.map((section: unknown) => {
        if (!record(section))
          throw new Error("A saved section could not be read.");
        return {
          id: section.id,
          title: section.title,
          text: section.text,
          source: section.source,
        };
      }),
    }),
    scope,
  );
  for (let index = 0; index < draft.sections.length; index++) {
    const section = value.sections[index];
    if (
      !record(section) ||
      section.textSha256 !== (await editionDigest(draft.sections[index].text))
    )
      throw new Error(
        "The source record has changed or is damaged. Your current draft is unchanged.",
      );
  }
  if (!current()) throw new Error("Your account changed. Import stopped.");
  // Only accepted data fields enter local storage, never arbitrary export metadata.
  return {
    ...draft,
    sections: draft.sections.map((section) => ({
      id: section.id,
      title: section.title,
      text: section.text,
      source: section.source,
    })),
  };
}

export async function editionDigest(text: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export function moveSection(
  draft: EditionDraft,
  id: string,
  direction: -1 | 1,
): EditionDraft {
  const sections = [...draft.sections];
  const index = sections.findIndex((section) => section.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= sections.length) return draft;
  [sections[index], sections[target]] = [sections[target], sections[index]];
  return { ...draft, sections };
}

export async function exportEdition(
  draft: EditionDraft,
  current: () => boolean,
) {
  parseEdition(JSON.stringify(draft), draft.scope);
  if (!current())
    throw new Error(
      "Your account changed. Reopen the edition before exporting.",
    );
  const title = draft.title.trim();
  if (!title || !draft.sections.some((section) => section.text.trim()))
    throw new Error("Add a title and some writing before exporting.");
  const sections = await Promise.all(
    draft.sections.map(async (section) => ({
      ...section,
      textSha256: await editionDigest(section.text),
    })),
  );
  const artifact = {
    schema: "arcanea.edition.v1",
    title,
    projectId: draft.scope.project,
    exportedAt: new Date().toISOString(),
    review: "Draft; editorial quality and reuse rights are unverified.",
    media:
      "Text edition only. Images and music remain in their source records.",
    sections,
  };
  const markdown =
    `# ${title}\n\n${sections
      .map((section) => `## ${section.title}\n\n${section.text}\n`)
      .join("\n")}\n## Source record\n\n` +
    sections
      .map((section) =>
        section.source
          ? `- ${section.title}: document ${section.source.docId}, revision ${section.source.revision}, source SHA-256 ${section.source.sha256}; edited text SHA-256 ${section.textSha256}.`
          : `- ${section.title}: written in this edition; text SHA-256 ${section.textSha256}.`,
      )
      .join("\n") +
    `\n\n${artifact.review}\n${artifact.media}\n`;
  if (!current()) throw new Error("Your account changed. Export stopped.");
  return {
    json: JSON.stringify(artifact, null, 2),
    markdown,
    filename:
      title
        .normalize("NFKD")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80) || "edition",
  };
}
