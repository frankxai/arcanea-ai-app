const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");
const next = require(
  require.resolve("next/server", {
    paths: [path.resolve(__dirname, "../../apps/web")],
  }),
);

const source = fs.readFileSync(
  path.resolve(__dirname, "../../apps/web/app/api/studio/ingest/route.ts"),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

// Execute the actual route and NextResponse with controlled Auth/DB/provider
// boundaries. No credentials, network transport or funded inference is admitted.
function fixture({ authenticated = true, databaseError = false } = {}) {
  const calls = { auth: 0, fetch: 0, classify: 0, insert: 0 };
  const modules = {
    "next/server": next,
    "@/lib/supabase/server": {
      createClient: async () => ({
        auth: {
          getUser: async () => {
            calls.auth++;
            return {
              data: { user: authenticated ? { id: "synthetic-owner" } : null },
            };
          },
        },
        from: (table) => {
          assert.equal(table, "ingested_documents");
          return {
            insert: (row) => {
              calls.insert++;
              assert.equal(row.user_id, "synthetic-owner");
              return {
                select: () => ({
                  single: async () => ({
                    data: databaseError
                      ? null
                      : {
                          id: "synthetic-document",
                          title: row.title,
                          classification: row.classification,
                          classification_confidence:
                            row.classification_confidence,
                          tags: row.tags,
                          created_at: "2026-10-12T00:00:00Z",
                        },
                    error: databaseError
                      ? {
                          code: "synthetic-failure",
                          message: "synthetic database failure",
                        }
                      : null,
                  }),
                }),
              };
            },
          };
        },
      }),
    },
    "@/lib/security/safe-fetch": {
      assertPublicUrl: (url) => {
        if (url.includes("127.0.0.1"))
          throw Error("Synthetic private URL denial");
      },
      safeFetchText: async () => {
        calls.fetch++;
        throw Error("Synthetic fetch failure");
      },
    },
    "@/lib/studio/classify": {
      classifyContent: async () => {
        calls.classify++;
        return {
          classification: "reference",
          confidence: 0.5,
          suggested_tags: [],
          summary: "Synthetic summary",
        };
      },
      estimateTokens: () => 4,
      wordCount: () => 3,
    },
    "@/lib/studio/embed": {
      embedStudioDocument: () => {
        throw Error("Embedding is not admitted");
      },
      toPgVector: () => {
        throw Error("Embedding is not admitted");
      },
    },
    "@/lib/studio/world-link": {
      linkToWorldGraph: () => {
        throw Error("World linking is not admitted");
      },
    },
  };
  const exports = {};
  vm.runInNewContext(
    compiled,
    {
      exports,
      module: { exports },
      require: (id) => {
        assert.ok(Object.hasOwn(modules, id), `Unexpected module: ${id}`);
        return modules[id];
      },
      process: { env: {} },
      console: { warn: () => {}, error: () => {} },
    },
    { timeout: 2000 },
  );
  return { route: exports, calls };
}

function request(body) {
  return new Request("https://www.arcanea.ai/api/studio/ingest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const cases = [
  {
    name: "anonymous URL refuses before fetch, classification or insertion",
    options: { authenticated: false },
    body: { kind: "url", url: "http://127.0.0.1/synthetic-only" },
    status: 401,
    calls: { auth: 1, fetch: 0, classify: 0, insert: 0 },
  },
  {
    name: "invalid JSON refusal",
    body: "{",
    status: 400,
    calls: { auth: 0, fetch: 0, classify: 0, insert: 0 },
  },
  {
    name: "unknown kind refusal",
    body: { kind: "unsupported" },
    status: 400,
    calls: { auth: 1, fetch: 0, classify: 0, insert: 0 },
  },
  {
    name: "invalid text refusal",
    body: { kind: "text", content: "" },
    status: 400,
    calls: { auth: 1, fetch: 0, classify: 0, insert: 0 },
  },
  {
    name: "private URL refusal",
    body: { kind: "url", url: "http://127.0.0.1/synthetic-only" },
    status: 400,
    calls: { auth: 1, fetch: 0, classify: 0, insert: 0 },
  },
  {
    name: "uncertain fetch failure",
    body: { kind: "url", url: "https://example.invalid/synthetic-only" },
    status: 502,
    calls: { auth: 1, fetch: 1, classify: 0, insert: 0 },
  },
  {
    name: "database failure",
    options: { databaseError: true },
    body: { kind: "text", content: "Synthetic private document" },
    status: 500,
    calls: { auth: 1, fetch: 0, classify: 1, insert: 1 },
  },
  {
    name: "successful private document receipt",
    body: { kind: "text", content: "Synthetic private document" },
    status: 200,
    calls: { auth: 1, fetch: 0, classify: 1, insert: 1 },
  },
];
for (const scenario of cases) {
  test(`Studio ingestion does not cache ${scenario.name}`, async () => {
    const { route, calls } = fixture(scenario.options);
    const response = await route.POST(request(scenario.body));
    assert.equal(response.status, scenario.status);
    assert.deepEqual(calls, scenario.calls);
    const body = await response.json();
    if (scenario.status === 200) assert.equal(body.id, "synthetic-document");
    else assert.equal(typeof body.error, "string");
    assert.equal(response.headers.get("cache-control"), "private, no-store");
  });
}
