import assert from "node:assert/strict";
import test from "node:test";
import { loadTypescript, flatten } from "./helpers/load-typescript.mjs";

const rich = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { type: "text", text: "My saved chapter", marks: [{ type: "bold" }] },
      ],
    },
  ],
};
const draft = {
  status: "found",
  draft: {
    content: "My saved chapter",
    contentJson: rich,
    wordCount: 3,
    updatedAt: "2026-09-01T12:00:00.000Z",
  },
};
async function render(result, { published = true } = {}) {
  let lookups = 0;
  const module = loadTypescript(
    "apps/web/app/studio/author/[bookSlug]/[chapterSlug]/page.tsx",
    {
      "fs/promises": {
        access: async () => {},
        readdir: async (path, options) =>
          options?.withFileTypes
            ? [{ name: "sample", isDirectory: () => true }]
            : published
              ? ["chapter-1.md"]
              : [],
        readFile: async (path) =>
          path.endsWith("book.yaml")
            ? "manifest"
            : "# Published chapter\n\nEarlier words.",
      },
      "next/navigation": {
        notFound() {
          throw new Error("NOT_FOUND");
        },
      },
      "js-yaml": { load: () => ({ title: "Sample book" }) },
      remark: {
        remark: () => ({
          use() {
            return this;
          },
          process: async () =>
            "<h1>Published chapter</h1><p>Earlier words.</p>",
        }),
      },
      "remark-html": {},
      "@/lib/content/book-path": { getBookRoot: () => "book-root" },
      "@/lib/author/read-draft": {
        readAuthorDraft: async () => {
          lookups++;
          return result;
        },
      },
      ...Object.fromEntries(
        [
          ["chapter-nav", "ChapterNav"],
          ["author-ai-panel", "AuthorAIPanel"],
          ["book-header", "BookHeader"],
          ["character-tracker", "CharacterTracker"],
          ["author-editor", "AuthorEditor"],
        ].map(([file, name]) => [`../../components/${file}`, { [name]: name }]),
      ),
    },
  );
  const tree = await module.default({
    params: Promise.resolve({ bookSlug: "sample", chapterSlug: "chapter-1" }),
  });
  const nodes = flatten(tree);
  return {
    nodes,
    lookups,
    editor: nodes.find((node) => node?.type === "AuthorEditor"),
  };
}

test("reopening restores the saved rich document and its word count", async () => {
  const { editor, lookups } = await render(draft);
  assert.equal(lookups, 1);
  assert.equal(editor.props.initialContent, rich);
  assert.equal(editor.props.initialWordCount, 3);
  assert.equal(editor.props.initialSavedAt, draft.draft.updatedAt);
  assert.equal(editor.key, "sample/chapter-1");
});

test("an intentionally empty draft is restored instead of published text", async () => {
  const empty = { type: "doc", content: [{ type: "paragraph", content: [] }] };
  const { editor } = await render({
    status: "found",
    draft: {
      ...draft.draft,
      content: "",
      contentJson: empty,
      wordCount: 0,
    },
  });
  assert.equal(editor.props.initialContent, empty);
  assert.equal(editor.props.initialWordCount, 0);
});

test("a failed draft lookup offers retry and does not mount an editable older copy", async () => {
  const { nodes, editor } = await render({ status: "unavailable" });
  assert.equal(editor, undefined);
  assert.ok(nodes.some((node) => node?.props?.role === "alert"));
  assert.ok(
    nodes.some(
      (node) => node?.type === "button" && node.props.children === "Try again",
    ),
  );
  assert.ok(!nodes.some((node) => node?.type === "AuthorAIPanel"));
});

test("a chapter that exists only as the author's draft can reopen", async () => {
  const { editor, nodes } = await render(draft, { published: false });
  assert.equal(editor.props.initialContent, rich);
  const navigation = nodes.find((node) => node?.type === "ChapterNav");
  assert.equal(navigation.props.chapters[0].slug, "chapter-1");
});

test("published content is the starting point only after confirming no draft", async () => {
  const { editor, lookups } = await render({ status: "none" });
  assert.equal(lookups, 1);
  assert.equal(editor.props.initialContent, undefined);
  assert.match(editor.props.initialHtml, /Earlier words/);
  assert.equal(editor.props.initialSource, "published");
});
