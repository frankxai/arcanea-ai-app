import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { createClient, type User } from "@supabase/supabase-js";
import { ensureProfileForUser } from "../profile-bootstrap";

const user: User = {
  id: "11111111-1111-4111-8111-111111111111",
  email: "private-local-part@private.invalid",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2026-10-29T00:00:00Z",
};

type Insert = { body: Record<string, unknown>; headers: Headers; url: URL };

function fixture(t: TestContext, statuses: number[], admin = false) {
  const inserts: Insert[] = [];
  for (const [key, value] of Object.entries({
    NEXT_PUBLIC_SUPABASE_URL: "https://profile-fixture.invalid",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "fixture-anon-key",
    SUPABASE_SERVICE_ROLE_KEY: admin ? "fixture-admin-key" : undefined,
  })) {
    const previous = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
    t.after(() => {
      if (previous === undefined) delete process.env[key];
      else process.env[key] = previous;
    });
  }
  t.mock.method(console, "warn", () => {});
  t.mock.method(
    globalThis,
    "fetch",
    async (input: Parameters<typeof fetch>[0], init?: RequestInit) => {
      assert.equal(init?.method, "POST");
      const url = new URL(String(input));
      assert.equal(url.origin, "https://profile-fixture.invalid");
      assert.equal(url.pathname, "/rest/v1/profiles");
      inserts.push({
        body: JSON.parse(String(init?.body)),
        headers: new Headers(init?.headers),
        url,
      });
      const status = statuses.shift();
      assert.ok(status, "unexpected extra request");
      return new Response(
        status === 201
          ? null
          : JSON.stringify({ message: "fixture insert denied" }),
        { status, headers: { "Content-Type": "application/json" } },
      );
    },
  );
  const session = createClient(
    "https://profile-fixture.invalid",
    "fixture-anon-key",
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
  return { session, inserts };
}

function assertPrivateInsert(insert: Insert) {
  assert.equal(insert.body.display_name, "Creator");
  assert.equal(insert.body.id, user.id);
  assert.equal(insert.body.avatar_url, null);
  assert.equal(
    JSON.stringify(insert.body).includes("private-local-part"),
    false,
  );
  assert.equal(JSON.stringify(insert.body).includes(user.email!), false);
  assert.equal(insert.url.searchParams.get("on_conflict"), "id");
  // The real SDK must emit DO NOTHING semantics for existing profiles.
  assert.match(
    insert.headers.get("prefer") ?? "",
    /resolution=ignore-duplicates/,
  );
  assert.doesNotMatch(insert.headers.get("prefer") ?? "", /merge-duplicates/);
}

test("session bootstrap inserts a private default without invoking admin", async (t) => {
  const { session, inserts } = fixture(t, [201], true);
  assert.deepEqual(await ensureProfileForUser(user, session), {
    ok: true,
    via: "session",
  });
  assert.equal(inserts.length, 1);
  assertPrivateInsert(inserts[0]);
  assert.equal(inserts[0].headers.get("apikey"), "fixture-anon-key");
});

test("optional admin retry inserts the same private row after session failure", async (t) => {
  const { session, inserts } = fixture(t, [403, 201], true);
  assert.deepEqual(await ensureProfileForUser(user, session), {
    ok: true,
    via: "admin",
  });
  assert.equal(inserts.length, 2);
  inserts.forEach(assertPrivateInsert);
  assert.deepEqual(inserts[1].body, inserts[0].body);
  assert.equal(inserts[0].headers.get("apikey"), "fixture-anon-key");
  assert.equal(inserts[1].headers.get("apikey"), "fixture-admin-key");
});

test("explicit display metadata retains precedence and avatar", async (t) => {
  const { session, inserts } = fixture(t, [201, 201, 201]);
  for (const metadata of [
    { display_name: "Chosen", name: "Name", full_name: "Full" },
    { name: "Name", full_name: "Full" },
    { full_name: "Full" },
  ]) {
    const result = await ensureProfileForUser(
      {
        ...user,
        user_metadata: {
          ...metadata,
          avatar_url: "https://avatar.invalid/chosen.png",
        },
      },
      session,
    );
    assert.equal(result.ok, true);
  }
  assert.deepEqual(
    inserts.map(({ body }) => body.display_name),
    ["Chosen", "Name", "Full"],
  );
  assert.ok(
    inserts.every(
      ({ body }) => body.avatar_url === "https://avatar.invalid/chosen.png",
    ),
  );
});

test("session failure without admin remains best effort", async (t) => {
  const { session, inserts } = fixture(t, [403]);
  assert.deepEqual(await ensureProfileForUser(user, session), {
    ok: false,
    reason: "fixture insert denied",
  });
  assert.equal(inserts.length, 1);
});

test("both insert failures return a reason without rejecting sign-in", async (t) => {
  const { session, inserts } = fixture(t, [403, 403], true);
  assert.deepEqual(await ensureProfileForUser(user, session), {
    ok: false,
    reason: "fixture insert denied",
  });
  assert.equal(inserts.length, 2);
  inserts.forEach(assertPrivateInsert);
});
