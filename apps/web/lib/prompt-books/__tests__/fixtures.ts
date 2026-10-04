import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

// Real pinned SDK and app service, with a disposable in-memory HTTP transport.
// This verifies caller/response behavior, never hosted RLS or owner acceptance.
export const owner = "00000000-0000-4000-8000-000000000001";
export const other = "00000000-0000-4000-8000-000000000002";
export const row = (userId = owner) => ({
  id: "prompt-1",
  user_id: userId,
  title: "Recovery prompt",
  content: "Original",
  prompt_type: "general",
  updated_at: "2026-10-04T12:00:00.000Z",
  created_at: "2026-10-04T12:00:00.000Z",
});

export function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

export async function fixture(userId = owner) {
  let saved = row(userId);
  const assignedTags = new Set<string>();
  let fail = false;
  let readFailure: string | null = null;
  let held: {
    method: string;
    table: string;
    entered: ReturnType<typeof deferred<void>>;
    release: ReturnType<typeof deferred<void>>;
  } | null = null;
  const requests: { url: URL; method: string }[] = [];
  const user = {
    id: userId,
    aud: "authenticated",
    role: "authenticated",
    email: "owner@example.test",
    app_metadata: {},
    user_metadata: {},
    created_at: "2026-10-04T12:00:00Z",
  };
  const token = [
    Buffer.from('{"alg":"HS256","typ":"JWT"}').toString("base64url"),
    Buffer.from(
      JSON.stringify({
        sub: userId,
        exp: Math.floor(Date.now() / 1000) + 3600,
        aud: "authenticated",
        role: "authenticated",
      }),
    ).toString("base64url"),
    "fixture-signature",
  ].join(".");
  const client = createClient(
    "https://fixture.supabase.co",
    "fixture-anon-key",
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: async (input, init) => {
          const url = new URL(String(input));
          const method = init?.method ?? "GET";
          requests.push({ url, method });
          if (url.pathname.endsWith("/token"))
            return Response.json({
              access_token: token,
              refresh_token: "fixture-refresh",
              token_type: "bearer",
              expires_in: 3600,
              user,
            });
          if (url.pathname.endsWith("/user")) return Response.json(user);
          if (!url.pathname.includes("/rest/v1/"))
            throw new Error("Unexpected fixture endpoint");
          let result: unknown = [];
          let status = 200;
          if (
            url.pathname.endsWith("/pb_collections") ||
            url.pathname.endsWith("/pb_tags")
          ) {
            result = [
              {
                id: url.pathname.endsWith("/pb_tags")
                  ? "tag-1"
                  : "collection-1",
                user_id: userId,
                name: "Owned fixture row",
                is_global: true,
                created_at: saved.created_at,
                updated_at: saved.updated_at,
              },
            ];
          }
          if (url.pathname.endsWith("/pb_prompts")) {
            if (method === "PATCH" || method === "POST") {
              if (fail) {
                fail = false;
                result = {
                  message: "Disposable write failure",
                  code: "fixture",
                };
                status = 400;
              } else
                saved = {
                  ...saved,
                  ...JSON.parse(String(init?.body)),
                  updated_at: new Date(
                    Date.parse(saved.updated_at) + 1000,
                  ).toISOString(),
                };
            }
            if (status === 200)
              result = new Headers(init?.headers)
                .get("accept")
                ?.includes("object")
                ? { ...saved }
                : [{ ...saved }];
          }
          if (url.pathname.endsWith("/pb_templates")) {
            result =
              method === "GET"
                ? {
                    id: "template-1",
                    user_id: userId,
                    name: "Recovered template",
                    content: "Write {{subject}}",
                    variables: [{ name: "subject", type: "text" }],
                    prompt_type: "general",
                    use_count: 0,
                  }
                : [];
          }
          if (url.pathname.endsWith("/pb_tags") && Array.isArray(result))
            result = [...result, { ...result[0], id: "tag-2" }];
          if (url.pathname.endsWith("/pb_prompt_tags")) {
            if (method === "POST")
              assignedTags.add(JSON.parse(String(init?.body)).tag_id);
            if (method === "DELETE")
              assignedTags.delete(
                (url.searchParams.get("tag_id") ?? "eq.tag-1").slice(3),
              );
            result = [...assignedTags].map((tag_id) => ({ tag_id }));
          }
          const gate = held;
          if (
            readFailure &&
            method === "GET" &&
            url.pathname.endsWith(`/${readFailure}`)
          ) {
            readFailure = null;
            status = 400;
            result = { message: "Disposable read failure", code: "fixture" };
          }
          if (
            gate?.method === method &&
            url.pathname.endsWith(`/${gate.table}`)
          ) {
            held = null;
            gate.entered.resolve();
            await gate.release.promise;
          }
          return Response.json(result, { status });
        },
      },
    },
  );
  assert.equal(
    (
      await client.auth.signInWithPassword({
        email: user.email,
        password: "disposable-fixture",
      })
    ).error,
    null,
  );
  return {
    client,
    requests,
    saved: () => saved,
    fail: () => {
      fail = true;
    },
    failRead: (table = "pb_prompts") => {
      readFailure = table;
    },
    hold: (method: string, table = "pb_prompts") => {
      const gate = {
        method,
        table,
        entered: deferred<void>(),
        release: deferred<void>(),
      };
      held = gate;
      return gate;
    },
  };
}
