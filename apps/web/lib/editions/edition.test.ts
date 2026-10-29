import assert from "node:assert/strict";
import { test } from "node:test";
import {
  emptyEdition,
  parseEdition,
  persistEdition,
  editionKey,
  editionDigest,
  exportEdition,
  importEdition,
  readEditionSource,
  moveSection,
  type EditionDraft,
  EDITION_LIMIT,
} from "./edition.ts";

const scope = { owner: "creator-a", project: "project-a" };
test("an edition at the draft size boundary can restore its own formatted export", async () => {
  const original: EditionDraft = {
    ...emptyEdition(scope, "Boundary edition"),
    sections: Array.from({ length: 24 }, (_, i) => ({
      id: `part-${i}`,
      title: `Scene ${i}`,
      text: "",
      source: null,
    })),
  };
  original.sections[0].text = "x".repeat(
    EDITION_LIMIT - JSON.stringify(original).length - 1,
  );
  const output = await exportEdition(original, () => true);
  assert.ok(new TextEncoder().encode(output.json).length > EDITION_LIMIT);
  const restored = await importEdition(output.json, scope, () => true);
  assert.equal(
    restored.sections[0].text.length,
    original.sections[0].text.length,
  );
});
const draft = () => ({
  ...emptyEdition(scope, "An edition"),
  sections: [
    {
      id: "one",
      title: "First scene",
      text: "An original scene.",
      source: null,
    },
    { id: "two", title: "Second scene", text: "Another scene.", source: null },
  ],
});
function storage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}
test("recovery refuses a different account or project", () => {
  assert.throws(() =>
    parseEdition(JSON.stringify(draft()), { ...scope, owner: "creator-b" }),
  );
  assert.throws(() =>
    parseEdition(JSON.stringify(draft()), { ...scope, project: "project-b" }),
  );
  assert.notEqual(
    editionKey(scope),
    editionKey({ ...scope, owner: "creator-b" }),
  );
});
test("source reads require the exact document, owner, project and valid revision", () => {
  const doc = {
    id: "doc-a",
    user_id: scope.owner,
    project_id: scope.project,
    title: "Source",
    save_revision: 2,
    content: { content_text: "Writing" },
  };
  const raw = (patch = {}) =>
    JSON.stringify({ data: { doc: { ...doc, ...patch } } });
  assert.deepEqual(readEditionSource(raw(), scope, "doc-a"), {
    title: "Source",
    text: "Writing",
    revision: 2,
  });
  assert.throws(() =>
    readEditionSource(raw({ user_id: "someone-else" }), scope, "doc-a"),
  );
  assert.throws(() =>
    readEditionSource(raw({ project_id: "other-project" }), scope, "doc-a"),
  );
  assert.throws(() => readEditionSource(raw(), scope, "other-doc"));
  assert.throws(() =>
    readEditionSource(raw({ save_revision: -1 }), scope, "doc-a"),
  );
  assert.throws(() =>
    readEditionSource(raw({ content: { content_text: "" } }), scope, "doc-a"),
  );
});
test("malformed, oversized and duplicate sections are refused", () => {
  assert.throws(() => parseEdition("broken", scope));
  assert.throws(() =>
    parseEdition(
      JSON.stringify({
        ...draft(),
        sections: [draft().sections[0], draft().sections[0]],
      }),
      scope,
    ),
  );
  assert.throws(() =>
    parseEdition(JSON.stringify({ ...draft(), title: "x".repeat(501) }), scope),
  );
  assert.throws(() => parseEdition("x".repeat(1_000_001), scope));
  assert.throws(() =>
    parseEdition(
      JSON.stringify({
        ...draft(),
        sections: [
          {
            ...draft().sections[0],
            source: { docId: "one", revision: -1, sha256: "wrong" },
          },
        ],
      }),
      scope,
    ),
  );
});
test("stale account, corrupt backup and another tab cannot be overwritten", () => {
  const store = storage();
  assert.throws(() => persistEdition(store, draft(), null, () => false));
  store.setItem(editionKey(scope), "unreadable backup");
  assert.throws(() => persistEdition(store, draft(), null, () => true));
  assert.equal(store.getItem(editionKey(scope)), "unreadable backup");
  assert.throws(() =>
    persistEdition(store, draft(), "unreadable backup", () => true),
  );
  const validStore = storage();
  const saved = persistEdition(validStore, draft(), null, () => true);
  assert.deepEqual(parseEdition(saved, scope), draft());
  validStore.setItem(
    editionKey(scope),
    JSON.stringify({ ...draft(), title: "Other tab" }),
  );
  assert.throws(() => persistEdition(validStore, draft(), saved, () => true));
});
test("a failed storage write leaves the previous draft intact", () => {
  const previous = JSON.stringify(draft());
  const store = {
    getItem: () => previous,
    setItem: () => {
      throw new Error("Quota exceeded");
    },
  };
  assert.throws(
    () =>
      persistEdition(
        store,
        { ...draft(), title: "Revision" },
        previous,
        () => true,
      ),
    /Quota/,
  );
  assert.equal(store.getItem(), previous);
});
test("reordering preserves writing and original state", () => {
  const original = draft();
  const moved = moveSection(original, "two", -1);
  assert.equal(moved.sections[0].text, "Another scene.");
  assert.equal(original.sections[0].id, "one");
  assert.equal(moveSection(original, "one", -1), original);
});
test("export carries original source identity and edited content hashes without owner identity", async () => {
  const original: EditionDraft = draft();
  original.sections[0] = {
    ...original.sections[0],
    source: {
      docId: "doc-a",
      revision: 3,
      sha256: await editionDigest("Original source"),
    },
  };
  const result = await exportEdition(original, () => true);
  const artifact = JSON.parse(result.json);
  assert.equal(
    artifact.sections[0].textSha256,
    await editionDigest("An original scene."),
  );
  assert.equal(artifact.sections[0].source.revision, 3);
  assert.equal(result.json.includes(scope.owner), false);
  assert.match(result.markdown, /Source record/);
  assert.match(artifact.review, /unverified/);
});
test("portable records restore writing and reject tampering, other projects and expired actors", async () => {
  const output = await exportEdition(draft(), () => true);
  assert.deepEqual(
    await importEdition(output.json, scope, () => true),
    draft(),
  );
  const changed = JSON.parse(output.json);
  changed.sections[0].text = "Changed outside the exported record";
  await assert.rejects(
    importEdition(JSON.stringify(changed), scope, () => true),
    /changed or is damaged/,
  );
  await assert.rejects(
    importEdition(output.json, { ...scope, project: "other" }, () => true),
  );
  let calls = 0;
  await assert.rejects(
    importEdition(output.json, scope, () => ++calls === 1),
    /account changed/,
  );
});
test("empty export and account changes during hashing fail closed", async () => {
  await assert.rejects(exportEdition(emptyEdition(scope, ""), () => true));
  let calls = 0;
  await assert.rejects(
    exportEdition(draft(), () => ++calls === 1),
    /account changed/,
  );
});
