const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("../../node_modules/typescript");
const {
  NextRequest,
  NextResponse,
} = require("../../apps/web/node_modules/next/server");
const { z } = require("../../apps/web/node_modules/zod");
const { createHash, randomUUID } = require("node:crypto");

const actor = "00000000-0000-4000-8000-000000000001";
const scene = {
  requestKey: randomUUID(),
  source: {
    bookId: "book1",
    bookTitle: "A source book",
    chapterTitle: "A source chapter",
    path: "/books/book1/chapter-one",
    chapterHash: "a".repeat(64),
    passage: "The river carried a silver bowl.",
  },
  brief: "Illustrate the silver bowl in the river.",
  model: "provider/model",
  provider: "openrouter",
  image: { data: "iVBORw0KGgo=", mimeType: "image/png" },
};

function subject(user = { id: actor }, fail = false) {
  const rows = new Map();
  const calls = [];
  let activeUser = user;
  const client = {
    auth: { getUser: async () => ({ data: { user: activeUser } }) },
    from(table) {
      assert.equal(table, "creations");
      let insertion;
      const filters = [];
      const query = {
        insert(row) {
          insertion = row;
          calls.push(row);
          return query;
        },
        select() {
          return query;
        },
        eq(key, value) {
          filters.push([key, value]);
          return query;
        },
        contains(key, value) {
          filters.push([key, value]);
          return query;
        },
        order() {
          return query;
        },
        limit(value) {
          assert.equal(value, 1);
          return query;
        },
        async single() {
          if (fail)
            return { data: null, error: { code: "database-unavailable" } };
          if (insertion) {
            if (rows.has(insertion.id))
              return { data: null, error: { code: "23505" } };
            rows.set(insertion.id, insertion);
            return { data: { id: insertion.id }, error: null };
          }
          assert.ok(
            filters.some(
              ([key, value]) => key === "user_id" && value === activeUser.id,
            ),
          );
          const id = filters.find(([key]) => key === "id")[1];
          const row = rows.get(id);
          return {
            data: row?.user_id === activeUser.id ? row : null,
            error: null,
          };
        },
        async maybeSingle() {
          assert.ok(
            filters.some(
              ([key, value]) => key === "user_id" && value === activeUser.id,
            ),
          );
          assert.ok(
            filters.some(
              ([key, value]) => key === "visibility" && value === "private",
            ),
          );
          const path = filters.find(([key]) => key === "content")[1].source
            .path;
          return {
            data:
              [...rows.values()].find(
                (row) =>
                  row.user_id === activeUser.id &&
                  row.content.source.path === path,
              ) ?? null,
            error: fail ? { code: "database-unavailable" } : null,
          };
        },
      };
      return query;
    },
  };
  const source = fs.readFileSync(
    require("node:path").join(
      __dirname,
      "../../apps/web/app/api/reading-scenes/route.ts",
    ),
    "utf8",
  );
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const module = { exports: {} };
  const requireMock = (name) => {
    if (name === "next/server") return { NextResponse };
    if (name === "zod") return { z };
    if (name === "node:crypto") return { createHash };
    if (name === "@/lib/rate-limit/rate-limiter")
      return { checkRateLimit: () => ({ allowed: true }) };
    if (name === "@/lib/supabase/server")
      return { createClient: async () => client };
    throw Error(`Unexpected route import ${name}`);
  };
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {
    Buffer,
    URL,
  })(requireMock, module, module.exports);
  return {
    ...module.exports,
    calls,
    setUser(value) {
      activeUser = value;
    },
  };
}
function request(body = scene, origin = "https://www.arcanea.ai") {
  return new NextRequest("https://www.arcanea.ai/api/reading-scenes", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(body),
  });
}
function privateResponse(response) {
  assert.equal(response.headers.get("cache-control"), "private, no-store");
}

test("anonymous and cross-origin scene saves are denied before writing", async () => {
  const s = subject(null);
  const response = await s.POST(request());
  assert.equal(response.status, 401);
  privateResponse(response);
  assert.equal(
    (await s.POST(request(scene, "https://attacker.invalid"))).status,
    403,
  );
  assert.equal(s.calls.length, 0);
});
test("save derives its actor from authentication and always creates a private draft", async () => {
  const s = subject();
  const response = await s.POST(
    request({
      ...scene,
      userId: "foreign-user",
      visibility: "public",
      status: "published",
    }),
  );
  assert.equal(response.status, 200);
  privateResponse(response);
  assert.equal(s.calls[0].user_id, actor);
  assert.equal(s.calls[0].visibility, "private");
  assert.equal(s.calls[0].status, "draft");
  assert.equal(s.calls[0].content.canonStatus, "personal-interpretation");
  assert.equal(s.calls[0].content.rightsStatus, "not-reviewed");
});
test("lost save acknowledgement retries the same row, while changed content and another actor conflict", async () => {
  const s = subject();
  assert.equal((await s.POST(request())).status, 200);
  assert.equal((await s.POST(request())).status, 200);
  assert.equal(
    (
      await s.POST(
        request({ ...scene, brief: "A different visual composition." }),
      )
    ).status,
    409,
  );
  s.setUser({ id: "00000000-0000-4000-8000-000000000002" });
  assert.equal((await s.POST(request())).status, 409);
});
test("scene reopening is bound to the account and chapter, with private/no-store responses", async () => {
  const s = subject();
  await s.POST(request());
  const req = new NextRequest(
    `https://www.arcanea.ai/api/reading-scenes?path=${encodeURIComponent(scene.source.path)}`,
  );
  const response = await s.GET(req);
  privateResponse(response);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.scene.owner, actor);
  assert.equal(body.scene.creationId, scene.requestKey);
  s.setUser({ id: "00000000-0000-4000-8000-000000000002" });
  assert.equal((await (await s.GET(req)).json()).scene, null);
  s.setUser(null);
  assert.equal((await s.GET(req)).status, 401);
});
test("invalid, oversized and non-raster data never reaches the database", async () => {
  const s = subject();
  assert.equal(
    (
      await s.POST(
        request({
          ...scene,
          source: { ...scene.source, path: "/books/../private" },
        }),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await s.POST(
        request({
          ...scene,
          image: { data: "PHN2Zz4=", mimeType: "image/png" },
        }),
      )
    ).status,
    400,
  );
  assert.equal(
    (await s.POST(request({ data: "x".repeat(3 * 1024 * 1024 + 1) }))).status,
    413,
  );
  assert.equal(s.calls.length, 0);
});
test("database failure remains retryable and reveals no provider or database details", async () => {
  const s = subject({ id: actor }, true);
  const response = await s.POST(request());
  assert.equal(response.status, 503);
  privateResponse(response);
  assert.doesNotMatch(
    JSON.stringify(await response.json()),
    /database-unavailable/,
  );
});
