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
  let failPromptAfterCommit = false;
  let failTemplate = false;
  let storedTemplate: Record<string, unknown> | null = null;
  const templateRows = new Map<string, Record<string, unknown>>();
  let failTemplateAfterCommit = false;
  let readFailure: string | null = null;
  let searchOwner: string | null = null;
  let missingSearchRpc = false;
  let omitSearchOwner = false;
  type RequestGate = {
    method: string;
    table: string;
    entered: ReturnType<typeof deferred<void>>;
    release: ReturnType<typeof deferred<void>>;
  };
  let held: RequestGate | null = null;
  let heldBefore: RequestGate | null = null;
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
          const before = heldBefore;
          if (
            before?.method === method &&
            url.pathname.endsWith(`/${before.table}`)
          ) {
            heldBefore = null;
            before.entered.resolve();
            await before.release.promise;
          }
          let result: unknown = [];
          let status = 200;
          if (url.pathname.endsWith("/rpc/pb_search_prompts")) {
            const body = JSON.parse(String(init?.body));
            assert.equal(body.p_user_id, userId);
            if (missingSearchRpc) {
              status = 404;
              result = { code: "PGRST202", message: "Search function absent" };
            } else
              result = [
                {
                  id: saved.id,
                  title: saved.title,
                  content: saved.content,
                  prompt_type: saved.prompt_type,
                  collection_id: null,
                  is_favorite: false,
                  use_count: 0,
                  updated_at: saved.updated_at,
                  rank: 1,
                  ...(searchOwner ? { user_id: searchOwner } : {}),
                },
              ];
          }
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
              if (
                url.searchParams.has("updated_at") &&
                url.searchParams.get("updated_at") !== `eq.${saved.updated_at}`
              ) {
                result = null;
              } else if (fail) {
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
            if (
              failPromptAfterCommit &&
              method === "PATCH" &&
              status === 200 &&
              result !== null
            ) {
              failPromptAfterCommit = false;
              status = 500;
              result = {
                message: "Lost prompt acknowledgement",
                code: "fixture",
              };
            }
            if (status === 200 && result !== null)
              result = new Headers(init?.headers)
                .get("accept")
                ?.includes("object")
                ? { ...saved }
                : [{ ...saved }];
          }
          if (
            url.pathname.endsWith("/pb_prompts") &&
            url.searchParams.has("or") &&
            searchOwner &&
            Array.isArray(result)
          )
            result = result.map((row) => ({ ...row, user_id: searchOwner }));
          if (
            omitSearchOwner &&
            url.searchParams.has("or") &&
            Array.isArray(result)
          )
            result = result.map((row) => {
              const copy = { ...row };
              delete copy.user_id;
              return copy;
            });

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
            if (method === "POST") {
              if (failTemplate) {
                failTemplate = false;
                status = 400;
                result = {
                  message: "Disposable template failure",
                  code: "fixture",
                };
              } else {
                const input = JSON.parse(String(init?.body));
                storedTemplate = templateRows.get(input.id) ?? {
                  ...input,
                  created_at: saved.created_at,
                  updated_at: saved.updated_at,
                };
                templateRows.set(input.id, storedTemplate!);
                result = storedTemplate;
                if (failTemplateAfterCommit) {
                  failTemplateAfterCommit = false;
                  status = 500;
                  result = {
                    message: "Lost template acknowledgement",
                    code: "fixture",
                  };
                }
              }
            }
            if (
              method === "GET" &&
              templateRows.has((url.searchParams.get("id") ?? "").slice(3))
            )
              result = templateRows.get(
                (url.searchParams.get("id") ?? "").slice(3),
              );
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
    template: () => storedTemplate,
    templateRows: () => [...templateRows.values()],
    failTemplateAfterCommit: () => {
      failTemplateAfterCommit = true;
    },
    failTemplate: () => {
      failTemplate = true;
    },
    replaceStored: (patch: Record<string, unknown>) => {
      saved = { ...saved, ...patch };
    },
    failPromptAfterCommit: () => {
      failPromptAfterCommit = true;
    },
    fail: () => {
      fail = true;
    },
    missingSearchRpc: () => {
      missingSearchRpc = true;
    },
    omitSearchOwner: () => {
      omitSearchOwner = true;
    },
    searchOwner: (value: string) => {
      searchOwner = value;
    },
    failRead: (table = "pb_prompts") => {
      readFailure = table;
    },
    holdBefore: (method: string, table: string) => {
      const gate = {
        method,
        table,
        entered: deferred<void>(),
        release: deferred<void>(),
      };
      heldBefore = gate;
      return gate;
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
