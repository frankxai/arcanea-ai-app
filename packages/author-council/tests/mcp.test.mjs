import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createMcpServer } from "../dist/mcp/server.js";

// This test process never uses ambient credentials or an external provider.
const names = [
  "ARCANEA_COUNCIL_PROVIDER",
  "ARCANEA_COUNCIL_MODEL",
  "ARCANEA_COUNCIL_MAX_CALLS",
  "ARCANEA_COUNCIL_MAX_OUTPUT_TOKENS",
  "ARCANEA_COUNCIL_TIMEOUT_MS",
  "ANTHROPIC_API_KEY",
  "OPENAI_API_KEY",
];
const chapter =
  "A captain refuses the crown because its oath would erase her brother's name.";
let calls = [];
let behavior;
const configure = (extra = {}) => {
  for (const name of names) delete process.env[name];
  Object.assign(process.env, {
    ARCANEA_COUNCIL_PROVIDER: "openai",
    ARCANEA_COUNCIL_MODEL: "fixture-model",
    ARCANEA_COUNCIL_MAX_CALLS: "8",
    ARCANEA_COUNCIL_MAX_OUTPUT_TOKENS: "1024",
    OPENAI_API_KEY: "fixture-openai-credential",
    ANTHROPIC_API_KEY: "fixture-other-credential",
    ...extra,
  });
  calls = [];
  behavior = undefined;
};
globalThis.fetch = async (url, options) => {
  const body = JSON.parse(options.body);
  const index = calls.length;
  calls.push({ url, options, body });
  if (behavior) return behavior(url, options, body, index);
  return reply(body);
};
function reply(body, mutate = (v) => v, finish = "stop") {
  const system = body.system ?? body.messages[0].content;
  const match = system.match(
    /Return only JSON for author (\S+) and role ([^.]+)\./,
  );
  assert.ok(match);
  const critique = mutate({
    author: match[1],
    role: match[2],
    strengths: [],
    concerns: ["The oath needs a visible cost."],
    recommendations: [],
    citations: [],
    confidence: 0.75,
  });
  const data = body.system
    ? {
        id: "fixture-response",
        model: body.model,
        stop_reason: finish === "stop" ? "end_turn" : finish,
        content: [{ type: "text", text: JSON.stringify(critique) }],
        usage: { input_tokens: 100, output_tokens: 80 },
      }
    : {
        id: "fixture-response",
        model: body.model,
        choices: [
          {
            finish_reason: finish,
            message: { content: JSON.stringify(critique) },
          },
        ],
        usage: { prompt_tokens: 100, completion_tokens: 80 },
      };
  return new Response(JSON.stringify(data), { status: 200 });
}
async function deliberate(argumentsOverride = {}) {
  const server = await createMcpServer();
  const client = new Client(
    { name: "council-fixture", version: "1" },
    { capabilities: {} },
  );
  const [a, b] = InMemoryTransport.createLinkedPair();
  try {
    await server.connect(a);
    await client.connect(b);
    const result = await client.callTool({
      name: "deliberate",
      arguments: {
        roster: "fiction",
        mode: "critique",
        text: chapter,
        ...argumentsOverride,
      },
    });
    return {
      result,
      record: JSON.parse(result.content.find((v) => v.type === "text").text),
    };
  } finally {
    await client.close();
    await server.close();
  }
}

test("missing explicit provider refuses instead of producing mock approval", async () => {
  configure();
  delete process.env.ARCANEA_COUNCIL_PROVIDER;
  const { result, record } = await deliberate();
  assert.equal(result.isError, true);
  assert.equal(record.status, "refused");
  assert.equal(calls.length, 0);
  assert.deepEqual(record.execution.critiques, []);
});
for (const field of [
  "ARCANEA_COUNCIL_MODEL",
  "ARCANEA_COUNCIL_MAX_CALLS",
  "ARCANEA_COUNCIL_MAX_OUTPUT_TOKENS",
  "OPENAI_API_KEY",
]) {
  test(`missing ${field} refuses before any provider call`, async () => {
    configure();
    delete process.env[field];
    const { result } = await deliberate();
    assert.equal(result.isError, true);
    assert.equal(calls.length, 0);
  });
}
test("unsupported provider and oversized caps refuse before networking", async () => {
  for (const extra of [
    { ARCANEA_COUNCIL_PROVIDER: "auto" },
    { ARCANEA_COUNCIL_MAX_CALLS: "25" },
    { ARCANEA_COUNCIL_MAX_OUTPUT_TOKENS: "4097" },
    { ARCANEA_COUNCIL_TIMEOUT_MS: "60001" },
  ]) {
    configure(extra);
    assert.equal((await deliberate()).result.isError, true);
    assert.equal(calls.length, 0);
  }
});
test("chosen OpenAI model, output cap, usage and chapter identity survive actual MCP dispatch", async () => {
  configure();
  const { result, record } = await deliberate();
  assert.ok(!result.isError);
  assert.ok(record.critiques.length > 0);
  assert.equal(record.execution.requestedModel, "fixture-model");
  assert.equal(
    record.execution.chapterSha256,
    createHash("sha256").update(chapter).digest("hex"),
  );
  assert.equal(record.execution.publicationAllowed, false);
  assert.equal(record.execution.humanReviewRequired, true);
  assert.equal(record.execution.billingReconciled, false);
  for (const call of calls) {
    assert.equal(call.url, "https://api.openai.com/v1/chat/completions");
    assert.equal(call.body.model, "fixture-model");
    assert.equal(call.body.max_completion_tokens, 1024);
    assert.equal(call.options.redirect, "error");
    assert.ok(call.options.signal instanceof AbortSignal);
  }
  assert.ok(
    record.execution.attempts.every(
      (a) =>
        a.state === "succeeded" &&
        a.responseSha256 &&
        a.usage.completion_tokens === 80,
    ),
  );
  assert.ok(!JSON.stringify(record).includes("fixture-openai-credential"));
});
test("selected Anthropic remains selected even when the other credential is present", async () => {
  configure({ ARCANEA_COUNCIL_PROVIDER: "anthropic" });
  const { result } = await deliberate();
  assert.ok(!result.isError);
  assert.ok(calls.length > 0);
  assert.ok(
    calls.every(
      (c) =>
        c.url === "https://api.anthropic.com/v1/messages" &&
        c.body.max_tokens === 1024 &&
        !c.options.headers.Authorization,
    ),
  );
});
test("book and protocol mode aliases dispatch without changing the selected model", async () => {
  for (const mode of [
    "deliberation",
    "convergence",
    "synthesis",
    "sequential",
    "debate",
    "adversarial",
  ]) {
    configure({ ARCANEA_COUNCIL_MAX_CALLS: "24" });
    const { result, record } = await deliberate({ mode });
    assert.ok(!result.isError);
    assert.ok(record.critiques.length > 0);
    assert.ok(calls.every((c) => c.body.model === "fixture-model"));
  }
});
test("unknown mode refuses before provider dispatch", async () => {
  configure();
  await assert.rejects(deliberate({ mode: "misspelled-mode" }));
  assert.equal(calls.length, 0);
});
test("voice overrides select exactly the requested eligible seats", async () => {
  configure();
  const { result, record } = await deliberate({
    voicesOverride: ["sanderson"],
  });
  assert.ok(!result.isError);
  assert.deepEqual(record.roster, ["sanderson"]);
  assert.equal(calls.length, 1);
});
test("HTTP failure never switches provider or fabricates a critique", async () => {
  configure({ ARCANEA_COUNCIL_PROVIDER: "anthropic" });
  behavior = async () => new Response("fixture failure", { status: 503 });
  const { result, record } = await deliberate();
  assert.equal(result.isError, true);
  assert.deepEqual(record.execution.critiques, []);
  assert.equal(record.execution.fallbackAttempted, false);
  assert.ok(calls.every((c) => c.url.includes("anthropic.com")));
  assert.ok(record.execution.attempts.every((a) => a.state === "failed"));
});
for (const [label, mutate] of [
  ["wrong author", (v) => ({ ...v, author: "unselected-author" })],
  ["extra approval instruction", (v) => ({ ...v, publicationAllowed: true })],
  ["injected provider change", (v) => ({ ...v, provider: "anthropic" })],
  ["out-of-range confidence", (v) => ({ ...v, confidence: 9 })],
  [
    "malformed recommendations",
    (v) => ({ ...v, recommendations: [{ action: "publish" }] }),
  ],
  [
    "coerced action array",
    (v) => ({
      ...v,
      recommendations: [
        {
          action: ["rewrite"],
          target: "oath",
          proposal: "show cost",
          rationale: "visible stakes",
        },
      ],
    }),
  ],
]) {
  test(`${label} is rejected at the real MCP boundary`, async () => {
    configure();
    behavior = async (_, __, body) => reply(body, mutate);
    const { result, record } = await deliberate();
    assert.equal(result.isError, true);
    assert.deepEqual(record.execution.critiques, []);
    assert.equal(record.execution.publicationAllowed, false);
    assert.ok(calls.every((c) => c.url.includes("openai.com")));
  });
}
test("truncated or refused responses remain rejected attempts", async () => {
  for (const finish of ["length", "content_filter"]) {
    configure();
    behavior = async (_, __, body) => reply(body, (v) => v, finish);
    const { result, record } = await deliberate();
    assert.equal(result.isError, true);
    assert.deepEqual(record.execution.critiques, []);
  }
});
test("transport interruption remains uncertain and is not automatically retried", async () => {
  configure();
  behavior = async () => {
    throw new DOMException("fixture interruption", "TimeoutError");
  };
  const { result, record } = await deliberate();
  assert.equal(result.isError, true);
  assert.ok(calls.length <= 8);
  assert.ok(record.execution.attempts.every((a) => a.state === "uncertain"));
  assert.equal(record.execution.fallbackAttempted, false);
});
test("configured timeout aborts pending requests and retains uncertain outcomes", async () => {
  configure({ ARCANEA_COUNCIL_TIMEOUT_MS: "10" });
  behavior = async (_, options) =>
    new Promise((_, reject) =>
      options.signal.addEventListener(
        "abort",
        () => reject(options.signal.reason),
        { once: true },
      ),
    );
  const { result, record } = await deliberate();
  assert.equal(result.isError, true);
  assert.ok(record.execution.attempts.length > 0);
  assert.ok(record.execution.attempts.every((a) => a.state === "uncertain"));
});
test("a provider cannot echo the selected credential into a retained critique", async () => {
  configure();
  behavior = async (_, __, body) =>
    reply(body, (v) => ({ ...v, concerns: ["fixture-openai-credential"] }));
  const { result, record } = await deliberate();
  assert.ok(!result.isError);
  assert.ok(
    record.critiques.every((c) => c.concerns[0] === "[redacted credential]"),
  );
  assert.ok(!JSON.stringify(record).includes("fixture-openai-credential"));
});

for (const provider of ["openai", "anthropic"]) {
  test(`Unicode-escaped ${provider} credential echoes cannot survive retained JSON`, async () => {
    configure({ ARCANEA_COUNCIL_PROVIDER: provider });
    const selected =
      provider === "openai"
        ? "fixture-openai-credential"
        : "fixture-other-credential";
    const escaped = [...selected]
      .map((c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`)
      .join("");
    behavior = async (_, __, body) => {
      const data = await reply(body, (v) => ({
        ...v,
        concerns: [selected],
      })).json();
      const output = body.system ? data.content[0] : data.choices[0].message;
      const field = body.system ? "text" : "content";
      output[field] = output[field].replaceAll(selected, escaped);
      data.id = selected;
      data.model = selected;
      return new Response(JSON.stringify(data).replaceAll(selected, escaped));
    };
    const { result, record } = await deliberate();
    assert.ok(!result.isError);
    assert.ok(
      record.critiques.every((c) => c.concerns[0] === "[redacted credential]"),
    );
    assert.ok(
      record.execution.attempts.every(
        (a) =>
          a.responseId === "[redacted credential]" &&
          a.returnedModel === "[redacted credential]",
      ),
    );
    assert.ok(!JSON.stringify(record).includes(selected));
  });
}

test("usage metadata cannot inject credential labels or invented financial fields", async () => {
  configure();
  behavior = async (_, __, body) => {
    const data = await reply(body).json();
    data.usage["fixture-openai-credential"] = 1;
    data.usage.cost = 95;
    return new Response(JSON.stringify(data));
  };
  const { result, record } = await deliberate();
  assert.ok(!result.isError);
  assert.ok(!JSON.stringify(record).includes("fixture-openai-credential"));
  assert.ok(
    record.execution.attempts.every(
      (a) =>
        a.usage.completion_tokens === 80 && !Object.hasOwn(a.usage, "cost"),
    ),
  );
});

test("rejected response hash binds body bytes including a UTF-8 BOM", async () => {
  configure();
  const hashes = [];
  behavior = async (_, __, body) => {
    const bytes = Buffer.concat([
      Buffer.from([0xef, 0xbb, 0xbf]),
      Buffer.from(await reply(body).text()),
    ]);
    hashes.push(createHash("sha256").update(bytes).digest("hex"));
    return new Response(bytes);
  };
  const { result, record } = await deliberate();
  assert.equal(result.isError, true);
  assert.deepEqual(
    record.execution.attempts.map((a) => a.responseSha256),
    hashes,
  );
  assert.deepEqual(record.execution.critiques, []);
});
test("parallel dispatch reserves the call cap before starting additional requests", async () => {
  configure({ ARCANEA_COUNCIL_MAX_CALLS: "1" });
  const { result, record } = await deliberate();
  assert.equal(result.isError, true);
  assert.equal(calls.length, 1);
  assert.equal(record.execution.attempts.length, 1);
  assert.ok(record.execution.attempts.every((a) => a.state !== "in_flight"));
});
test("already-dispatched real partial critiques settle and survive a peer failure", async () => {
  configure();
  behavior = async (_, __, body, index) => {
    if (index === 0) return new Response("fixture failure", { status: 503 });
    await new Promise((resolve) => setTimeout(resolve, 20));
    return reply(body);
  };
  const { result, record } = await deliberate();
  assert.equal(result.isError, true);
  assert.ok(record.execution.critiques.length > 0);
  assert.ok(record.execution.attempts.some((a) => a.state === "failed"));
  assert.ok(record.execution.attempts.every((a) => a.state !== "in_flight"));
});
