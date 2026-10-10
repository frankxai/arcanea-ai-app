/**
 * Actual reading-scene route + installed PostgREST client + disposable PostgreSQL.
 * Authentication delivery is the seam: getUser returns a synthetic fixture actor.
 * HTTP queries, RLS, constraints, conflicts and JSON containment are real.
 * Never connect this suite to a production or preview database.
 */
const assert = require("node:assert/strict");
const { createHash, createHmac, randomUUID } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("../../node_modules/typescript");
const {
  NextRequest,
  NextResponse,
} = require("../../apps/web/node_modules/next/server");
const { z } = require("../../apps/web/node_modules/zod");
const supabaseRequire = createRequire(
  require.resolve("../../apps/web/node_modules/@supabase/supabase-js"),
);
const { PostgrestClient } = supabaseRequire("@supabase/postgrest-js");

const endpoint = new URL(
  process.env.READING_SCENE_TEST_API ?? "http://invalid",
);
assert.ok(
  ["127.0.0.1", "localhost"].includes(endpoint.hostname) &&
    endpoint.protocol === "http:" &&
    endpoint.port === "3801" &&
    endpoint.pathname === "/" &&
    !endpoint.username &&
    !endpoint.password &&
    !endpoint.search &&
    !endpoint.hash,
  "Only the disposable loopback PostgREST fixture on port 3801 is allowed",
);
assert.ok(
  process.env.GITHUB_ACTIONS === "true" ||
    process.env.READING_SCENE_ALLOW_DISPOSABLE_TEST === "1",
  "Requires hosted CI or explicit disposable-test opt-in",
);
const signingKey = process.env.READING_SCENE_TEST_JWT_KEY;
assert.ok(
  signingKey?.length >= 32,
  "Requires the ephemeral fixture signing key",
);
const alice = "00000000-0000-4000-8000-000000000001";
const bob = "00000000-0000-4000-8000-000000000002";
const noProfile = "00000000-0000-4000-8000-000000000003";

function jwt(actor) {
  const encode = (v) => Buffer.from(JSON.stringify(v)).toString("base64url");
  const unsigned = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({
    role: "authenticated",
    sub: actor,
    exp: Math.floor(Date.now() / 1000) + 180,
  })}`;
  return `${unsigned}.${createHmac("sha256", signingKey).update(unsigned).digest("base64url")}`;
}
function client(actor) {
  return new PostgrestClient(endpoint.href, {
    headers: actor ? { Authorization: `Bearer ${jwt(actor)}` } : {},
    fetch: (url, options) =>
      fetch(url, { ...options, signal: AbortSignal.timeout(10_000) }),
  });
}
function route(actor) {
  const database = client(actor);
  const source = fs.readFileSync(
    path.join(__dirname, "../../apps/web/app/api/reading-scenes/route.ts"),
    "utf8",
  );
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const module = { exports: {} };
  const imports = {
    "next/server": { NextResponse },
    zod: { z },
    "node:crypto": { createHash },
    "@/lib/rate-limit/rate-limiter": {
      checkRateLimit: () => ({ allowed: true }),
    },
    "@/lib/supabase/server": {
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: actor ? { id: actor } : null },
          }),
        },
        from: database.from.bind(database),
      }),
    },
  };
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {
    Buffer,
    URL,
    process: { env: {} },
  })(
    (name) => {
      assert.ok(
        Object.hasOwn(imports, name),
        `Unexpected route import ${name}`,
      );
      return imports[name];
    },
    module,
    module.exports,
  );
  return module.exports;
}
function scene(chapter = "one") {
  return {
    requestKey: randomUUID(),
    source: {
      bookId: "fixture-book",
      bookTitle: "Disposable source book",
      chapterTitle: `Source chapter ${chapter}`,
      path: `/books/fixture-book/chapter-${chapter}`,
      chapterHash: "a".repeat(64),
      passage: "The river carried a silver bowl.",
    },
    brief: "Illustrate the silver bowl floating in the river.",
    model: "fixture/model",
    provider: "openrouter",
    image: { data: "iVBORw0KGgo=", mimeType: "image/png" },
  };
}
function save(s) {
  return new NextRequest("https://www.arcanea.ai/api/reading-scenes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://www.arcanea.ai",
    },
    body: JSON.stringify(s),
  });
}
function reopen(s) {
  return new NextRequest(
    `https://www.arcanea.ai/api/reading-scenes?path=${encodeURIComponent(s.source.path)}`,
  );
}
function privateResponse(response) {
  assert.equal(response.headers.get("cache-control"), "private, no-store");
}

test("fixture requests run as real non-owner, non-bypass database roles", async () => {
  for (const actor of [alice, bob, null]) {
    const { data, error } = await client(actor).rpc(
      "reading_scene_fixture_contract",
    );
    assert.equal(error, null);
    assert.equal(data.database, "reading_scene_fixture");
    assert.equal(data.role, actor ? "authenticated" : "anon");
    assert.equal(data.uid, actor);
    assert.equal(data.rlsEnabled, true);
    assert.equal(data.roleBypass, false);
    assert.equal(data.roleSuperuser, false);
    assert.notEqual(data.tableOwner, data.role);
    assert.equal(data.policyCount, 4);
  }
});

test("concurrent real route saves and lost acknowledgement retries produce one private row", async () => {
  const s = scene();
  const subject = route(alice);
  const responses = await Promise.all([
    subject.POST(save(s)),
    subject.POST(save(s)),
  ]);
  for (const response of responses) {
    assert.equal(response.status, 200);
    privateResponse(response);
    assert.equal((await response.json()).creationId, s.requestKey);
  }
  const retry = await subject.POST(save(s));
  assert.equal(retry.status, 200);
  const { data, error } = await client(alice)
    .from("creations")
    .select()
    .eq("id", s.requestKey);
  assert.equal(error, null);
  assert.equal(data.length, 1);
  assert.equal(data[0].user_id, alice);
  assert.equal(data[0].visibility, "private");
  assert.equal(data[0].status, "draft");
  assert.equal(data[0].content.image.data, s.image.data);
  assert.equal(data[0].content.source.chapterHash, s.source.chapterHash);
  const opened = await subject.GET(reopen(s));
  assert.equal(opened.status, 200);
  privateResponse(opened);
  assert.equal((await opened.json()).scene.creationId, s.requestKey);
  const changed = await subject.POST(
    save({ ...s, brief: "A different visual composition." }),
  );
  assert.equal(changed.status, 409);
  assert.equal((await route(bob).POST(save(s))).status, 409);
});

test("database denies private reads, forged ownership, owner transfer and foreign changes", async () => {
  const s = scene("private");
  assert.equal((await route(alice).POST(save(s))).status, 200);
  for (const actor of [bob, null]) {
    const database = client(actor);
    const read = await database
      .from("creations")
      .select()
      .eq("id", s.requestKey);
    assert.equal(read.error, null);
    assert.deepEqual(read.data, []);
    const forged = await database.from("creations").insert({
      id: randomUUID(),
      user_id: alice,
      title: "Forged ownership",
      type: "image",
    });
    assert.equal(forged.error?.code, "42501");
    const update = await database
      .from("creations")
      .update({ title: "Foreign change" })
      .eq("id", s.requestKey)
      .select();
    assert.equal(update.error, null);
    assert.deepEqual(update.data, []);
    const deleted = await database
      .from("creations")
      .delete()
      .eq("id", s.requestKey)
      .select();
    assert.equal(deleted.error, null);
    assert.deepEqual(deleted.data, []);
  }
  const transfer = await client(alice)
    .from("creations")
    .update({ user_id: bob })
    .eq("id", s.requestKey);
  assert.equal(transfer.error?.code, "42501");
  const foreignReopen = await route(bob).GET(reopen(s));
  assert.equal(foreignReopen.status, 200);
  assert.equal((await foreignReopen.json()).scene, null);
  const owned = await client(alice)
    .from("creations")
    .select("user_id,title")
    .eq("id", s.requestKey)
    .single();
  assert.equal(owned.error, null);
  assert.equal(owned.data.user_id, alice);
  assert.equal(
    owned.data.title,
    "Source chapter private: scene interpretation",
  );
});

test("JSON chapter filtering and latest private draft reopening use the actual query engine", async () => {
  const first = scene("latest");
  const second = {
    ...first,
    requestKey: randomUUID(),
    brief: "Show the bowl from a lower river viewpoint.",
  };
  const other = scene("elsewhere");
  const subject = route(alice);
  for (const s of [first, second, other])
    assert.equal((await subject.POST(save(s))).status, 200);
  const response = await subject.GET(reopen(first));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.scene.creationId, second.requestKey);
  assert.equal(body.scene.brief, second.brief);
  assert.equal(body.imageGeneration.providerConfigured, false);
});

test("missing owner profile fails as unavailable rather than acknowledging a lost save", async () => {
  const s = scene("missing-profile");
  const response = await route(noProfile).POST(save(s));
  assert.equal(response.status, 503);
  privateResponse(response);
  const read = await client(noProfile)
    .from("creations")
    .select()
    .eq("id", s.requestKey);
  assert.equal(read.error, null);
  assert.deepEqual(read.data, []);
});

test("a saved row later made public cannot silently satisfy a private save retry", async () => {
  const s = scene("changed-visibility");
  const subject = route(alice);
  assert.equal((await subject.POST(save(s))).status, 200);
  const update = await client(alice)
    .from("creations")
    .update({ visibility: "public" })
    .eq("id", s.requestKey);
  assert.equal(update.error, null);
  assert.equal((await subject.POST(save(s))).status, 409);
  const response = await subject.GET(reopen(s));
  assert.equal((await response.json()).scene, null);
});
