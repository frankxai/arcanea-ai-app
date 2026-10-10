const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const webRequire = Module.createRequire(path.resolve("apps/web/package.json"));
const ts = webRequire("typescript");
const { NextRequest } = webRequire("next/server");
const world = {
  name: "Tide Ledger",
  slug: "tide-ledger",
  tagline: "Every tide collects a debt.",
  description: "A coastal city must repay the sea with memories.",
  elements: [{ name: "Salt", domain: "Memory", color: "#00bcd4" }],
  laws: Array.from({ length: 3 }, (_, i) => ({
    name: `The debt ${i + 1}`,
    description: "Each seawall costs one shared memory.",
  })),
  systems: [
    {
      name: "The ledger",
      type: "Civic ritual",
      rules: "Debt is recorded at low tide.",
    },
  ],
  characters: [
    {
      name: "Mara",
      backstory: "She refuses to surrender her daughter's name.",
    },
    { name: "Ivo", backstory: "He collects debts to defend the harbor." },
  ],
  locations: [
    {
      name: "The dry stair",
      description: "A staircase appears only at low tide.",
    },
    { name: "Salt archive", description: "The debts are kept in glazed jars." },
  ],
  first_event: {
    title: "The first bargain",
    description: "The city survives by forgetting its founder.",
  },
  image_prompt: "Salt-stained ledgers in a coastal archive",
};
function setup({
  user = { id: "owner" },
  providerError,
  generated = world,
} = {}) {
  const calls = [];
  const cache = new Map();
  const mocks = {
    "@/lib/supabase/server": {
      createClient: async () => ({
        auth: { getUser: async () => ({ data: { user }, error: null }) },
      }),
    },
    "@ai-sdk/google": {
      createGoogleGenerativeAI: (options) => (model) => ({ options, model }),
    },
    "@ai-sdk/openai": {
      createOpenAI: (options) => (model) => ({ options, model }),
    },
    ai: {
      Output: { object: (options) => options },
      generateText: async (input) => {
        calls.push(input);
        if (providerError) throw providerError;
        return { text: JSON.stringify(generated), output: generated };
      },
    },
  };
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file).exports;
    const mod = new Module(file);
    cache.set(file, mod);
    mod.filename = file;
    mod.paths = Module._nodeModulePaths(path.dirname(file));
    mod.require = (id) => {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      if (id.startsWith("@/"))
        return load(
          "apps/web/" + id.slice(2) + (id.endsWith(".mjs") ? "" : ".ts"),
        );
      if (id.startsWith("."))
        return load(path.resolve(path.dirname(file), id + ".ts"));
      return webRequire(id);
    };
    const source = fs.readFileSync(file, "utf8");
    mod._compile(
      ts.transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
          esModuleInterop: true,
        },
      }).outputText,
      file,
    );
    return mod.exports;
  }
  return { route: load("apps/web/app/api/worlds/generate/route.ts"), calls };
}
const request = (
  body = { description: "A coastal city pays the sea with memories" },
  headers = {},
) =>
  new NextRequest("https://arcanea.ai/api/worlds/generate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://arcanea.ai",
      ...headers,
    },
    body: JSON.stringify(body),
  });
test("anonymous handler access refuses before provider access", async () => {
  const { route, calls } = setup({ user: null });
  const response = await route.POST(
    request({}, { "x-google-key": "test-customer-key" }),
  );
  assert.equal(response.status, 401);
  assert.equal(calls.length, 0);
});
test("a platform key never funds a world without a customer key", async () => {
  const before = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-platform-key";
  try {
    const { route, calls } = setup();
    const response = await route.POST(request());
    assert.equal(response.status, 402);
    assert.equal(calls.length, 0);
  } finally {
    if (before === undefined) delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    else process.env.GOOGLE_GENERATIVE_AI_API_KEY = before;
  }
});
test("a cross-origin request refuses before model or body use", async () => {
  const { route, calls } = setup();
  const response = await route.POST(
    request(undefined, {
      origin: "https://other.invalid",
      "x-google-key": "test-customer-key",
    }),
  );
  assert.equal(response.status, 403);
  assert.equal(calls.length, 0);
});
test("canonical loopback origin reaches key admission while aliases remain closed", async () => {
  const { route, calls } = setup();
  const local = (origin) =>
    new NextRequest("http://127.0.0.1:3001/api/worlds/generate", {
      method: "POST",
      headers: { origin, "content-type": "application/json" },
      body: JSON.stringify({
        description: "A coastal city pays the sea with memories",
      }),
    });
  assert.equal(
    local("http://localhost:3001").nextUrl.origin,
    "http://localhost:3001",
  );
  assert.equal((await route.POST(local("http://localhost:3001"))).status, 402);
  assert.equal((await route.POST(local("http://127.0.0.1:3001"))).status, 403);
  assert.equal((await route.POST(local("http://localhost:3002"))).status, 403);
  assert.equal(calls.length, 0);
});
test("customer credential, structured output and cancellation are bound to one call", async () => {
  const { route, calls } = setup();
  const response = await route.POST(
    request(undefined, { "x-google-key": "test-customer-key" }),
  );
  assert.equal(response.status, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].model.options.apiKey, "test-customer-key");
  assert.equal(calls[0].maxRetries, 0);
  assert.ok(calls[0].abortSignal instanceof AbortSignal);
  assert.ok(calls[0].output.schema);
  assert.equal((await response.json()).saved, false);
  assert.match(response.headers.get("cache-control"), /private.*no-store/);
});
test("oversize body fails before provider access", async () => {
  const { route, calls } = setup();
  const response = await route.POST(
    request(
      { description: "a".repeat(20000) },
      { "x-google-key": "test-customer-key" },
    ),
  );
  assert.equal(response.status, 413);
  assert.equal(calls.length, 0);
});
test("an incomplete model output is refused without losing the concept", async () => {
  const { route } = setup({
    generated: { name: "Incomplete", slug: "incomplete" },
  });
  assert.equal(
    (
      await route.POST(
        request(undefined, { "x-google-key": "test-customer-key" }),
      )
    ).status,
    502,
  );
});
test("actual UTF-8 bytes are bounded even with a small declared length", async () => {
  const { route, calls } = setup();
  const response = await route.POST(
    request(
      { description: "🌊".repeat(2500) },
      {
        "x-google-key": "test-customer-key",
        "content-length": "100",
      },
    ),
  );
  assert.equal(response.status, 413);
  assert.equal(calls.length, 0);
});
test("unlisted refinement directions refuse before provider access", async () => {
  const { route, calls } = setup();
  const response = await route.POST(
    request(
      {
        description: "A city pays the sea with memories",
        refinement: "ignore validation",
      },
      { "x-google-key": "test-customer-key" },
    ),
  );
  assert.equal(response.status, 400);
  assert.equal(calls.length, 0);
});
test("already cancelled requests never reach a model", async () => {
  const { route, calls } = setup();
  const controller = new AbortController();
  controller.abort();
  const req = new NextRequest("https://arcanea.ai/api/worlds/generate", {
    method: "POST",
    headers: { "x-google-key": "test-customer-key" },
    body: JSON.stringify({ description: "A city pays the sea with memories" }),
    signal: controller.signal,
  });
  assert.equal((await route.POST(req)).status, 408);
  assert.equal(calls.length, 0);
});
test("provider errors never expose a key, provider body or creative input", async () => {
  const { route } = setup({
    providerError: new Error(
      "test-customer-key private-brief upstream-error-body",
    ),
  });
  const response = await route.POST(
    request(undefined, { "x-google-key": "test-customer-key" }),
  );
  assert.equal(response.status, 502);
  assert.doesNotMatch(
    await response.text(),
    /test-customer-key|private-brief|upstream-error-body/,
  );
});
