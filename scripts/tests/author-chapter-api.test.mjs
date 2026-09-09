import assert from "node:assert/strict";
import test from "node:test";
import { loadTypescript } from "./helpers/load-typescript.mjs";

const contentJson = {
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text: "Saved" }] }],
};
const found = {
  status: "found",
  draft: {
    content: "Saved",
    contentJson,
    wordCount: 1,
    updatedAt: "2020-01-01T00:00:00Z",
  },
};
async function get(
  result,
  { bookSlug = "sample", chapterSlug = "chapter-1", published = true } = {},
) {
  const reads = [];
  const chain = {
    select() {
      return chain;
    },
    eq() {
      return chain;
    },
    maybeSingle: async () => ({
      data:
        result.status === "found"
          ? {
              content: result.draft.content,
              content_json: result.draft.contentJson,
              word_count: result.draft.wordCount,
              updated_at: result.draft.updatedAt,
            }
          : null,
      error: result.status === "unavailable" ? { code: "unavailable" } : null,
    }),
  };
  const module = loadTypescript(
    "apps/web/app/api/author/[bookSlug]/chapters/[chapterSlug]/route.ts",
    {
      "fs/promises": {
        access: async () => {
          if (!published) throw new Error("ENOENT");
        },
        readdir: async (path, options) =>
          options?.withFileTypes
            ? [{ name: "sample", isDirectory: () => true }]
            : ["chapter-1.md", "CLAUDE.md"],
        readFile: async (path) => {
          reads.push(path);
          return "# Published\nEarlier words.";
        },
        stat: async () => ({ mtime: new Date("2035-01-01T00:00:00Z") }),
      },
      "next/server": {
        NextResponse: {
          json: (body, init) => new Response(JSON.stringify(body), init),
        },
      },
      "@/lib/content/book-path": { getBookRoot: () => "book-root" },
      "@/lib/author/read-draft": { readAuthorDraft: async () => result },
      "@/lib/supabase/server": {
        createClient: async () => ({
          auth: {
            getUser: async () => ({ data: { user: { id: "owner-1" } } }),
          },
          from: () => chain,
        }),
      },
    },
  );
  const response = await module.GET(
    new Request("https://example.test/api/author"),
    {
      params: Promise.resolve({ bookSlug, chapterSlug }),
    },
  );
  return { response, body: await response.json(), reads };
}

test("GET restores rich draft content even after a newer filesystem checkout", async () => {
  const { body, response } = await get(found);
  assert.equal(body.source, "draft");
  assert.deepEqual(body.contentJson, contentJson);
  assert.equal(body.content, "Saved");
  assert.match(response.headers.get("cache-control"), /private/);
  assert.match(response.headers.get("cache-control"), /no-store/);
});

test("GET restores an empty draft and a chapter without a published file", async () => {
  const { response, body } = await get(
    {
      status: "found",
      draft: {
        ...found.draft,
        content: "",
        wordCount: 0,
      },
    },
    { published: false },
  );
  assert.equal(response.status, 200);
  assert.equal(body.content, "");
  assert.equal(body.source, "draft");
  assert.equal(body.wordCount, 0);
});

test("GET fails visibly instead of returning an older editable copy after a lookup error", async () => {
  const { response, body } = await get({ status: "unavailable" });
  assert.equal(response.status, 503);
  assert.equal(body.content, undefined);
  assert.match(response.headers.get("cache-control"), /no-store/);
});

test("GET returns published content only after confirming no account draft", async () => {
  const { response, body } = await get({ status: "none" });
  assert.equal(response.status, 200);
  assert.equal(body.source, "published");
  assert.equal(body.contentJson, null);
  assert.equal(body.draftUpdatedAt, null);
});

test("GET does not resolve a book slug outside the listed book directory", async () => {
  const { response, reads } = await get({ status: "none" }, { bookSlug: ".." });
  assert.equal(response.status, 404);
  assert.deepEqual(reads, []);
});

test("GET does not expose chapter-directory agent instructions as a chapter", async () => {
  const { response, reads } = await get(
    { status: "none" },
    { chapterSlug: "CLAUDE" },
  );
  assert.equal(response.status, 404);
  assert.deepEqual(reads, []);
});
