import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = readFileSync(
  new URL("../../apps/web/lib/books/guardian-scorer.ts", import.meta.url),
  "utf8",
);
const prompts = readFileSync(
  new URL("../../apps/web/lib/books/guardian-prompts.ts", import.meta.url),
  "utf8",
);

// Execute the production exports with only their external boundaries replaced.
// No Supabase credentials, filesystem book reads, AI calls or writes are used.
function evaluate(sourceText, dependencies) {
  const module = { exports: {} };
  const output = ts.transpileModule(sourceText, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  vm.runInNewContext(output, {
    module,
    exports: module.exports,
    require(name) {
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      throw new Error(`Unexpected dependency: ${name}`);
    },
    process: { env: {} },
    console,
  });
  return module.exports;
}

const actualPrompts = evaluate(prompts, {});

function loader(bookResult, reviewResult) {
  const queries = [];
  let clientCalls = 0;
  const forbidden = () => {
    throw new Error("Read-only report must not require admin or run scoring");
  };
  const client = {
    from(table) {
      const query = { table };
      queries.push(query);
      return {
        select(columns) {
          query.columns = columns;
          return this;
        },
        eq(column, value) {
          query.filter = { column, value };
          return this;
        },
        maybeSingle() {
          assert.equal(table, "books");
          return Promise.resolve(bookResult);
        },
        order(column, options) {
          assert.equal(table, "guardian_reviews");
          query.order = { column, options };
          return Promise.resolve(reviewResult);
        },
      };
    },
  };
  const exports = evaluate(source, {
    "fs/promises": require("node:fs/promises"),
    path: { join: resolve },
    "../content/book-path": { getBookRoot: () => "/unused-book-fixture" },
    ai: { generateText: forbidden },
    "gray-matter": forbidden,
    "@/lib/supabase/server": {
      createAdminClient: forbidden,
      createClient: async () => {
        clientCalls += 1;
        return client;
      },
    },
    "./guardian-prompts": actualPrompts,
  });
  return {
    read: exports.loadLatestReport,
    queries,
    clientCalls: () => clientCalls,
  };
}

for (const bookResult of [
  { data: null, error: null },
  { data: null, error: { code: "42501" } },
]) {
  test("missing or RLS-hidden book does not load reviews or require service role", async () => {
    const fixture = loader(bookResult, { data: [], error: null });
    assert.equal(await fixture.read("private-draft"), null);
    assert.equal(fixture.clientCalls(), 1);
    assert.equal(fixture.queries.length, 1);
    assert.deepEqual(fixture.queries[0].filter, {
      column: "slug",
      value: "private-draft",
    });
  });
}

for (const reviewResult of [
  { data: [], error: null },
  { data: null, error: { code: "42501" } },
]) {
  test("empty or denied reviews remain absent without admin fallback", async () => {
    const fixture = loader(
      { data: { id: "book-id" }, error: null },
      reviewResult,
    );
    assert.equal(await fixture.read("public-book"), null);
    assert.equal(fixture.queries.length, 2);
    assert.deepEqual(fixture.queries[1].filter, {
      column: "book_id",
      value: "book-id",
    });
  });
}

test("session-scoped reads retain latest scores, canonical order and grade", async () => {
  const [first, second] = actualPrompts.GUARDIAN_IDS;
  const fixture = loader(
    { data: { id: "book-id" }, error: null },
    {
      error: null,
      data: [
        {
          guardian: second,
          dimension: "voice",
          score: "8",
          assessed_at: "2026-09-30T17:00:00Z",
        },
        {
          guardian: first,
          dimension: "structure",
          score: 6,
          assessment: "Existing review",
          assessed_at: "2026-09-29T17:00:00Z",
        },
        {
          guardian: second,
          dimension: "voice",
          score: 1,
          assessed_at: "2026-09-28T17:00:00Z",
        },
      ],
    },
  );
  const report = await fixture.read("public-book");
  assert.equal(report.bookId, "book-id");
  assert.equal(report.bookSlug, "public-book");
  assert.equal(report.scores.length, 2);
  assert.equal(report.scores[0].guardian, first);
  assert.equal(report.scores[1].guardian, second);
  assert.equal(report.scores[1].score, 8);
  assert.equal(report.scores[1].modelId, "unknown");
  assert.equal(report.composite, 7);
  assert.equal(report.grade, "master");
  assert.equal(report.assessedAt, "2026-09-30T17:00:00Z");
  assert.equal(report.promptVersion, actualPrompts.PROMPT_VERSION);
  assert.equal(fixture.queries[1].order.column, "assessed_at");
  assert.equal(fixture.queries[1].order.options.ascending, false);
});
