const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("../../apps/web/node_modules/typescript");
const {
  NextRequest,
  NextResponse,
} = require("../../apps/web/node_modules/next/server");

function middleware(user, refreshCookie = false) {
  let authCalls = 0;
  const source = fs.readFileSync(
    path.join(__dirname, "../../apps/web/lib/supabase/middleware.ts"),
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
    if (name === "@supabase/ssr")
      return {
        createServerClient: (_url, _key, { cookies }) => ({
          auth: {
            getUser: async () => {
              authCalls++;
              if (user instanceof Error) throw user;
              if (refreshCookie) {
                cookies.set("sb-fixture", "refreshed-fixture", {
                  path: "/",
                  httpOnly: true,
                  secure: true,
                  sameSite: "lax",
                });
              }
              return { data: { user } };
            },
          },
        }),
      };
    if (name === "@/lib/supabase/env")
      return {
        getSupabaseEnv: () => ({
          url: "https://placeholder.supabase.co",
          anonKey: "public-fixture",
        }),
      };
    throw Error(`Unexpected middleware import: ${name}`);
  };
  // No real timer or auth network: test actual routing/response code, not timeout behavior.
  const wrapper = vm.runInNewContext(
    `(function(require,module,exports){${code}\n})`,
    { setTimeout: () => 0 },
  );
  wrapper(requireMock, module, module.exports);
  return {
    updateSession: module.exports.updateSession,
    authCalls: () => authCalls,
  };
}

const options = {
  protectedPrefixes: ["/studio"],
  authPrefixes: ["/auth/login"],
  publicApiPrefixes: ["/api/ai"],
};
function privateResponse(response) {
  assert.match(response.headers.get("cache-control"), /private/);
  assert.match(response.headers.get("cache-control"), /no-store/);
}

for (const method of ["GET", "POST"])
  test(`anonymous author ${method} is denied without caching`, async () => {
    const subject = middleware(null);
    const response = await subject.updateSession(
      new NextRequest(
        "https://www.arcanea.ai/api/author/forge-of-ruin/chapters/01-the-forty-seven-names",
        { method },
      ),
      options,
    );
    assert.equal(response.status, 401);
    assert.equal((await response.json()).error.code, "UNAUTHORIZED");
    privateResponse(response);
  });

test("failed authentication stays denied and private", async () => {
  const response = await middleware(
    new Error("untrusted upstream detail"),
  ).updateSession(
    new NextRequest("https://www.arcanea.ai/api/author/private/chapters/one"),
    options,
  );
  assert.equal(response.status, 401);
  assert.doesNotMatch(await response.text(), /untrusted upstream detail/);
  privateResponse(response);
});

test("sign-in and signed-in redirects are private", async () => {
  for (const [user, pathname, destination] of [
    [null, "/studio/author/forge-of-ruin", "/auth/login"],
    [{ id: "fixture" }, "/auth/login", "/chat"],
  ]) {
    const response = await middleware(user).updateSession(
      new NextRequest(`https://www.arcanea.ai${pathname}`),
      options,
    );
    assert.equal(response.status, 307);
    assert.equal(
      new URL(response.headers.get("location")).pathname,
      destination,
    );
    privateResponse(response);
  }
});

test("authenticated protected requests continue with private caching", async () => {
  const response = await middleware({ id: "fixture" }).updateSession(
    new NextRequest(
      "https://www.arcanea.ai/api/author/forge-of-ruin/chapters/one",
    ),
    options,
  );
  assert.equal(response.headers.get("x-middleware-next"), "1");
  privateResponse(response);
});

test("public provider routes still bypass cookie authentication", async () => {
  const subject = middleware(new Error("must not call auth"));
  const response = await subject.updateSession(
    new NextRequest("https://www.arcanea.ai/api/ai/author-chat"),
    options,
  );
  assert.equal(response.headers.get("x-middleware-next"), "1");
  assert.equal(subject.authCalls(), 0);
});

test("session refresh cookies survive private pass-through", async () => {
  const response = await middleware({ id: "fixture" }, true).updateSession(
    new NextRequest(
      "https://www.arcanea.ai/api/author/forge-of-ruin/chapters/one",
    ),
    options,
  );
  assert.equal(response.headers.get("x-middleware-next"), "1");
  assert.equal(response.cookies.get("sb-fixture").value, "refreshed-fixture");
  assert.match(response.headers.get("set-cookie"), /HttpOnly/);
  assert.match(response.headers.get("set-cookie"), /Secure/);
  privateResponse(response);
});
