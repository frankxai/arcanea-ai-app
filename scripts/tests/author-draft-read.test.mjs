import assert from "node:assert/strict";
import test from "node:test";
import { loadTypescript } from "./helpers/load-typescript.mjs";

const path = "apps/web/lib/author/read-draft.ts";
const deadline = loadTypescript(
  "apps/web/lib/async-deadline.ts",
).withAbortDeadline;
const document = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Stored words", marks: [{ type: "italic" }] },
      ],
    },
  ],
};

function reader({
  user = { id: "owner-1" },
  authError = null,
  auth,
  row = null,
  error = null,
  query,
} = {}) {
  const calls = [];
  let signal;
  const chain = {
    select(fields) {
      calls.push(["select", fields]);
      return chain;
    },
    eq(key, value) {
      calls.push(["eq", key, value]);
      return chain;
    },
    abortSignal(value) {
      signal = value;
      return chain;
    },
    maybeSingle: () =>
      query ? query(signal) : Promise.resolve({ data: row, error }),
  };
  const mod = loadTypescript(path, {
    "@/lib/supabase/server": {
      createClient: async () => ({
        auth: {
          getUser: auth ?? (async () => ({ data: { user }, error: authError })),
        },
        from(table) {
          calls.push(["from", table]);
          return chain;
        },
      }),
    },
    "@/lib/async-deadline": {
      withAbortDeadline(label, ms, operation) {
        assert.equal(ms, 4000);
        return deadline(label, 30, operation);
      },
    },
  });
  return { read: () => mod.readAuthorDraft("sample", "chapter-1"), calls };
}

test("restores an account-scoped rich draft regardless of publication or checkout age", async () => {
  const { read, calls } = reader({
    row: {
      content: "Stored words",
      content_json: document,
      word_count: 999,
      updated_at: "2020-01-01T00:00:00Z",
    },
  });
  const result = await read();
  assert.equal(result.status, "found");
  assert.equal(result.draft.contentJson, document);
  assert.equal(result.draft.wordCount, 2);
  assert.equal(result.draft.updatedAt, "2020-01-01T00:00:00Z");
  assert.deepEqual(
    calls.filter(([method]) => method === "eq"),
    [
      ["eq", "book_slug", "sample"],
      ["eq", "chapter_slug", "chapter-1"],
      ["eq", "author_user_id", "owner-1"],
    ],
  );
  assert.ok(
    calls.some(
      ([method, fields]) =>
        method === "select" && fields.includes("content_json"),
    ),
  );
});

test("legacy text remains literal content and an empty draft remains empty", async () => {
  for (const text of [
    "<script>literal manuscript text</script>\nSecond line",
    "",
  ]) {
    const result = await reader({
      row: { content: text, content_json: null },
    }).read();
    assert.equal(result.status, "found");
    assert.equal(result.draft.content, text);
    assert.equal(result.draft.contentJson.type, "doc");
    assert.equal(
      result.draft.contentJson.content[0].content[0]?.text ?? "",
      text.split("\n")[0],
    );
  }
});

test("anonymous readers never query another account's drafts", async () => {
  const { read, calls } = reader({ user: null });
  assert.equal((await read()).status, "none");
  assert.deepEqual(calls, []);
});

test("a missing session is absence, while failed authentication is unavailable", async () => {
  assert.equal(
    (await reader({ authError: { name: "AuthSessionMissingError" } }).read())
      .status,
    "none",
  );
  assert.equal(
    (await reader({ authError: { name: "AuthRetryableFetchError" } }).read())
      .status,
    "unavailable",
  );
});

test("missing row differs from a database error", async () => {
  assert.equal((await reader().read()).status, "none");
  assert.equal(
    (await reader({ error: { code: "unavailable" } }).read()).status,
    "unavailable",
  );
});

test("malformed saved content does not become an editable empty fallback", async () => {
  for (const row of [
    { content: null },
    { content: "Words", content_json: { corrupt: true } },
  ]) {
    assert.equal((await reader({ row }).read()).status, "unavailable");
  }
});

test("corrupt nested or unsupported formatting is held instead of silently normalized", async () => {
  for (const content_json of [
    { type: "doc", content: [null] },
    { type: "doc", content: [{ type: "unknownExtension" }] },
    { type: "doc", content: [{ type: "text", text: "" }] },
    {
      type: "doc",
      content: [
        { type: "text", text: "Words", marks: [{ type: "unknownMark" }] },
      ],
    },
  ]) {
    assert.equal(
      (await reader({ row: { content: "Words", content_json } }).read()).status,
      "unavailable",
    );
  }
});

test("an invalid account identity never starts an unscoped draft lookup", async () => {
  const { read, calls } = reader({ user: {} });
  assert.equal((await read()).status, "unavailable");
  assert.deepEqual(calls, []);
});

test("a stalled database read ends at the deadline and aborts its transport", async () => {
  let aborted = false;
  const { read } = reader({
    query: (signal) =>
      new Promise(() => {
        signal.addEventListener(
          "abort",
          () => {
            aborted = true;
          },
          { once: true },
        );
      }),
  });
  assert.equal((await read()).status, "unavailable");
  assert.equal(aborted, true);
});

test("a stalled authentication call cannot start a database query after the deadline", async () => {
  let finishAuth;
  const { read, calls } = reader({
    auth: () =>
      new Promise((resolve) => {
        finishAuth = resolve;
      }),
  });
  assert.equal((await read()).status, "unavailable");
  finishAuth({ data: { user: { id: "owner-1" } }, error: null });
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(calls, []);
});
