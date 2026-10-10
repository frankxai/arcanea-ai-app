import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";
import { NextRequest } from "next/server";
import { POST as transcribe } from "../../../app/api/ai/transcribe/route";
import { POST as speak } from "../../../app/api/ai/speak/route";
import { voiceCredentialHeaders } from "../customer-credentials";

const originalFetch = globalThis.fetch;
const originalLog = console.error;
const originalGroq = process.env.GROQ_API_KEY;
const originalOpenAI = process.env.OPENAI_API_KEY;
const calls: { url: string; key: string | null; body: unknown }[] = [];
const logs: unknown[][] = [];
let sequence = 0;
let upstream: (url: string) => Response = (url) =>
  url.endsWith("transcriptions")
    ? Response.json({
        text: "A lighthouse keeper loses the chart.",
        language: "en",
      })
    : new Response(new Uint8Array([1, 2, 3]), {
        headers: { "Content-Type": "audio/wav" },
      });

function request(
  kind: "transcribe" | "speak",
  headers: Record<string, string> = {},
  body?: unknown,
  signal?: AbortSignal,
) {
  const data =
    kind === "transcribe"
      ? new FormData()
      : JSON.stringify(
          body === undefined
            ? { text: "Read this scene.", persona: "lumina" }
            : body,
        );
  if (data instanceof FormData)
    data.append(
      "audio",
      new Blob(["dummy audio"], { type: "audio/webm" }),
      "scene.webm",
    );
  return new NextRequest(`https://arcanea.example/api/ai/${kind}`, {
    method: "POST",
    signal,
    headers: {
      "x-forwarded-for": `198.51.100.${++sequence}`,
      ...(kind === "speak" ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: data,
  });
}

beforeEach(() => {
  calls.length = 0;
  logs.length = 0;
  process.env.GROQ_API_KEY = "test-server-only-groq";
  process.env.OPENAI_API_KEY = "test-server-only-openai";
  console.error = (...args: unknown[]) => {
    logs.push(args);
  };
  upstream = (url) =>
    url.endsWith("transcriptions")
      ? Response.json({
          text: "A lighthouse keeper loses the chart.",
          language: "en",
        })
      : new Response(new Uint8Array([1, 2, 3]));
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    assert.match(
      url,
      /^https:\/\/api\.(groq|openai)\.com\/openai\/v1\/audio\/(speech|transcriptions)$|^https:\/\/api\.openai\.com\/v1\/audio\/(speech|transcriptions)$/,
    );
    calls.push({
      url,
      key: new Headers(init?.headers).get("authorization"),
      body:
        init?.body instanceof FormData
          ? init.body
          : JSON.parse(String(init?.body)),
    });
    return upstream(url);
  };
});

after(() => {
  globalThis.fetch = originalFetch;
  console.error = originalLog;
  if (originalGroq === undefined) delete process.env.GROQ_API_KEY;
  else process.env.GROQ_API_KEY = originalGroq;
  if (originalOpenAI === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalOpenAI;
});

test("anonymous voice cannot use configured platform credentials", async () => {
  for (const [kind, handler] of [
    ["transcribe", transcribe],
    ["speak", speak],
  ] as const) {
    const response = await handler(request(kind));
    assert.equal(response.status, 401);
    assert.match(
      response.headers.get("cache-control") ?? "",
      /private.*no-store/,
    );
    assert.equal((await response.json()).cta, "byok");
  }
  assert.equal(calls.length, 0);
});

test("Groq transcription forwards only the customer's audio and key", async () => {
  const response = await transcribe(
    request("transcribe", { "x-groq-key": "test-customer-groq" }),
  );
  assert.equal(response.status, 200);
  assert.equal((await response.json()).provider, "groq");
  assert.equal(calls[0].key, "Bearer test-customer-groq");
  assert.equal(
    (calls[0].body as FormData).get("model"),
    "whisper-large-v3-turbo",
  );
  assert.equal(
    await ((calls[0].body as FormData).get("file") as File).text(),
    "dummy audio",
  );
  assert.match(
    response.headers.get("cache-control") ?? "",
    /private.*no-store/,
  );
});

test("OpenAI transcription cannot fall back to a configured platform Groq key", async () => {
  const response = await transcribe(
    request("transcribe", { "x-openai-key": "sk-test-key" }),
  );
  assert.equal(response.status, 200);
  assert.equal((await response.json()).provider, "openai");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].key, "Bearer sk-test-key");
  assert.equal((calls[0].body as FormData).get("model"), "whisper-1");
});

test("transcription fallback requires the second customer key", async () => {
  upstream = (url) =>
    url === "https://api.groq.com/openai/v1/audio/transcriptions"
      ? new Response("dummy provider failure", { status: 503 })
      : Response.json({ text: "Recovered transcript." });
  const response = await transcribe(
    request("transcribe", {
      "x-provider-keys": JSON.stringify({
        groq: "test-customer-groq",
        openai: "sk-test-key",
      }),
    }),
  );
  assert.equal(response.status, 200);
  assert.equal((await response.json()).text, "Recovered transcript.");
  assert.deepEqual(
    calls.map((call) => call.key),
    ["Bearer test-customer-groq", "Bearer sk-test-key"],
  );
});

test("Groq speech uses the supported Orpheus contract and private audio", async () => {
  const response = await speak(
    request("speak", { "x-groq-key": "test-customer-groq" }),
  );
  assert.equal(response.status, 200);
  assert.equal(calls[0].key, "Bearer test-customer-groq");
  const body = calls[0].body as Record<string, unknown>;
  assert.equal(body.model, "canopylabs/orpheus-v1-english");
  assert.ok(
    ["autumn", "diana", "hannah", "austin", "daniel", "troy"].includes(
      String(body.voice),
    ),
  );
  assert.equal(body.input, "Read this scene.");
  assert.equal(body.response_format, "wav");
  assert.match(
    response.headers.get("cache-control") ?? "",
    /private.*no-store.*no-transform/,
  );
  assert.equal(response.headers.get("X-Accel-Buffering"), "no");
  assert.equal(response.headers.get("content-type"), "audio/wav");
  assert.deepEqual(
    new Uint8Array(await response.arrayBuffer()),
    new Uint8Array([1, 2, 3]),
  );
});

test("long speech uses supplied OpenAI credentials without losing text", async () => {
  const text = "A".repeat(350);
  const response = await speak(
    request(
      "speak",
      { "x-groq-key": "test-customer-groq", "x-openai-key": "sk-test-key" },
      { text, persona: "lumina", speed: 1.5 },
    ),
  );
  assert.equal(response.status, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.openai.com/v1/audio/speech");
  assert.equal(calls[0].key, "Bearer sk-test-key");
  assert.equal((calls[0].body as Record<string, unknown>).input, text);
  assert.equal((calls[0].body as Record<string, unknown>).speed, 1.5);
  assert.equal(response.headers.get("content-type"), "audio/mpeg");
});

test("Groq-only long speech gives recovery before provider execution", async () => {
  const response = await speak(
    request(
      "speak",
      { "x-groq-key": "test-customer-groq" },
      { text: "A".repeat(201) },
    ),
  );
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /200.*OpenAI/);
  assert.equal(calls.length, 0);
});

test("malformed and unrelated credentials are denied before voice transport", async () => {
  for (const [kind, handler] of [
    ["transcribe", transcribe],
    ["speak", speak],
  ] as const) {
    const malformed = await handler(request(kind, { "x-provider-keys": "[]" }));
    assert.equal(malformed.status, 400);
    const unrelated = await handler(
      request(kind, { "x-anthropic-key": "sk-ant-test" }),
    );
    assert.equal(unrelated.status, 401);
  }
  assert.equal(calls.length, 0);
});

test("provider failures cannot disclose provider bodies or platform keys", async () => {
  const leak = "test-customer-groq private-scene-fixture";
  upstream = () => new Response(leak, { status: 500 });
  for (const [kind, handler] of [
    ["transcribe", transcribe],
    ["speak", speak],
  ] as const) {
    const response = await handler(
      request(kind, { "x-groq-key": "test-customer-groq" }),
    );
    assert.equal(response.status, 502);
    assert.ok(!(await response.text()).includes(leak));
    assert.match(
      response.headers.get("cache-control") ?? "",
      /private.*no-store/,
    );
  }
  assert.equal(calls.length, 2);
  assert.ok(!JSON.stringify(logs).includes(leak));
  assert.ok(calls.every((call) => call.key === "Bearer test-customer-groq"));
});

test("malformed speech body recovers privately without transport", async () => {
  const requestBody = new NextRequest("https://arcanea.example/api/ai/speak", {
    method: "POST",
    headers: {
      "x-openai-key": "sk-test-key",
      "content-type": "application/json",
      "x-forwarded-for": `198.51.100.${++sequence}`,
    },
    body: "{",
  });
  const response = await speak(requestBody);
  assert.equal(response.status, 400);
  assert.match(
    response.headers.get("cache-control") ?? "",
    /private.*no-store/,
  );
  for (const body of [
    null,
    [],
    { text: "Read this.", persona: 7 },
    { text: "Read this.", speed: "fast" },
  ])
    assert.equal(
      (await speak(request("speak", { "x-openai-key": "sk-test-key" }, body)))
        .status,
      400,
    );
  assert.equal(calls.length, 0);
});

test("cancelled voice does not start provider execution", async () => {
  const controller = new AbortController();
  controller.abort();
  for (const [kind, handler] of [
    ["transcribe", transcribe],
    ["speak", speak],
  ] as const)
    assert.equal(
      (
        await handler(
          request(
            kind,
            { "x-groq-key": "test-customer-groq" },
            undefined,
            controller.signal,
          ),
        )
      ).status,
      408,
    );
  assert.equal(calls.length, 0);
});

test("deferred audio errors are sanitized before leaving the handler stream", async () => {
  upstream = () =>
    new Response(
      new ReadableStream({
        start(controller) {
          controller.error(
            new Error("test-customer-groq private-scene-fixture"),
          );
        },
      }),
    );
  const response = await speak(
    request("speak", { "x-openai-key": "sk-test-key" }),
  );
  assert.equal(response.status, 200);
  await assert.rejects(response.arrayBuffer(), {
    message: "Voice provider request failed.",
  });
  assert.ok(!JSON.stringify(logs).includes("private-scene-fixture"));
});

test("browser voice reads existing settings and excludes unrelated secrets", () => {
  const storage = {
    getItem: (name: string) =>
      name === "arcanea-provider-keys"
        ? JSON.stringify({
            openai: "sk-test-key",
            groq: "test-customer-groq",
            anthropic: "sk-ant-test",
            tavily: "test-search-key",
          })
        : null,
  };
  assert.deepEqual(voiceCredentialHeaders(storage), {
    "x-groq-key": "test-customer-groq",
    "x-openai-key": "sk-test-key",
  });
  assert.deepEqual(voiceCredentialHeaders({ getItem: () => null }), {});
});

test("legacy room Groq key is retained without overriding provider settings", () => {
  assert.deepEqual(
    voiceCredentialHeaders({
      getItem: (name) =>
        name === "arcanea-voice-groq-key" ? "test-room-groq" : null,
    }),
    { "x-groq-key": "test-room-groq" },
  );
  assert.deepEqual(
    voiceCredentialHeaders({
      getItem: (name) =>
        name === "arcanea-provider-keys"
          ? JSON.stringify({ groq: "test-customer-groq" })
          : "test-room-groq",
    }),
    { "x-groq-key": "test-customer-groq" },
  );
});

test("malformed or blocked browser key storage fails without exposing its content", () => {
  assert.throws(
    () =>
      voiceCredentialHeaders({
        getItem: () => {
          throw new Error("private-storage-fixture");
        },
      }),
    {
      message:
        "Your voice key settings could not be read. Check Settings → Providers.",
    },
  );
  assert.throws(
    () =>
      voiceCredentialHeaders({
        getItem: (name) =>
          name === "arcanea-provider-keys"
            ? JSON.stringify({ openai: "bad\ncredential" })
            : null,
      }),
    {
      message:
        "Your voice key settings could not be read. Check Settings → Providers.",
    },
  );
});

test("rejected customer key returns a private, actionable response without platform fallback", async () => {
  upstream = () =>
    new Response("private-upstream-key-fixture", { status: 401 });
  for (const [kind, handler] of [
    ["transcribe", transcribe],
    ["speak", speak],
  ] as const) {
    const response = await handler(
      request(kind, { "x-openai-key": "sk-test-key" }),
    );
    assert.equal(response.status, 401);
    assert.equal((await response.json()).cta, "byok");
    assert.match(
      response.headers.get("cache-control") ?? "",
      /private.*no-store/,
    );
  }
  assert.equal(calls.length, 2);
  assert.ok(calls.every((call) => call.key === "Bearer sk-test-key"));
  assert.ok(!JSON.stringify(logs).includes("private-upstream-key-fixture"));
});

test("speech fallback uses only supplied customer keys and cancels the rejected body", async () => {
  let cancelled = false;
  upstream = (url) =>
    url === "https://api.groq.com/openai/v1/audio/speech"
      ? new Response(
          new ReadableStream({
            cancel() {
              cancelled = true;
            },
          }),
          { status: 503 },
        )
      : new Response(new Uint8Array([9, 8]));
  const response = await speak(
    request("speak", {
      "x-provider-keys": JSON.stringify({
        groq: "test-customer-groq",
        openai: "sk-test-key",
      }),
    }),
  );
  assert.equal(response.status, 200);
  assert.ok(cancelled);
  assert.deepEqual(
    calls.map((call) => call.key),
    ["Bearer test-customer-groq", "Bearer sk-test-key"],
  );
  assert.deepEqual(
    new Uint8Array(await response.arrayBuffer()),
    new Uint8Array([9, 8]),
  );
});

test("invalid audio, oversized speech and prototype persona are rejected before provider execution", async () => {
  for (const audio of [undefined, "not a file", new Blob([])]) {
    const form = new FormData();
    if (audio !== undefined) form.append("audio", audio);
    const req = new NextRequest("https://arcanea.example/api/ai/transcribe", {
      method: "POST",
      headers: {
        "x-openai-key": "sk-test-key",
        "x-forwarded-for": `198.51.100.${++sequence}`,
      },
      body: form,
    });
    assert.equal((await transcribe(req)).status, 400);
  }
  for (const body of [
    { text: "A".repeat(4097) },
    { text: "Read this.", persona: "constructor" },
  ])
    assert.equal(
      (await speak(request("speak", { "x-openai-key": "sk-test-key" }, body)))
        .status,
      400,
    );
  assert.equal(calls.length, 0);
});

test("voice rate limits are private and isolated between transcription and speech", async () => {
  const transcribeRequest = request("transcribe", {
    "x-openai-key": "sk-test-key",
  });
  const ip = transcribeRequest.headers.get("x-forwarded-for")!;
  for (let i = 0; i < 5; i++)
    assert.equal(
      (
        await transcribe(
          request("transcribe", {
            "x-openai-key": "sk-test-key",
            "x-forwarded-for": ip,
          }),
        )
      ).status,
      200,
    );
  const blocked = await transcribe(
    request("transcribe", {
      "x-openai-key": "sk-test-key",
      "x-forwarded-for": ip,
    }),
  );
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get("retry-after")) > 0);
  assert.match(blocked.headers.get("cache-control") ?? "", /private.*no-store/);
  assert.equal(calls.length, 5);
  assert.equal(
    (
      await speak(
        request("speak", {
          "x-openai-key": "sk-test-key",
          "x-forwarded-for": ip,
        }),
      )
    ).status,
    200,
  );
});

test("unexpected JSON audio responses cannot expose provider error content", async () => {
  upstream = () =>
    Response.json({ error: "test-customer-groq private-scene-fixture" });
  const response = await speak(
    request("speak", { "x-groq-key": "test-customer-groq" }),
  );
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes("private-scene-fixture"));
  assert.ok(!JSON.stringify(logs).includes("private-scene-fixture"));
});

test("transport exceptions are masked for both audio handlers", async () => {
  upstream = () => {
    throw new Error("test-customer-groq private-scene-fixture");
  };
  for (const [kind, handler] of [
    ["transcribe", transcribe],
    ["speak", speak],
  ] as const) {
    const response = await handler(
      request(kind, { "x-groq-key": "test-customer-groq" }),
    );
    assert.equal(response.status, 502);
    assert.ok(!(await response.text()).includes("private-scene-fixture"));
  }
  assert.ok(!JSON.stringify(logs).includes("private-scene-fixture"));
});

test("aborting an in-flight request cannot start a second-provider fallback", async () => {
  const transport = globalThis.fetch;
  const controller = new AbortController();
  globalThis.fetch = async (input, init) => {
    await transport(input, init);
    assert.ok(init?.signal);
    return new Promise<Response>((_resolve, reject) => {
      init.signal!.addEventListener(
        "abort",
        () => reject(new Error("private-abort-fixture")),
        { once: true },
      );
      queueMicrotask(() => controller.abort());
    });
  };
  const response = await speak(
    request(
      "speak",
      { "x-groq-key": "test-customer-groq", "x-openai-key": "sk-test-key" },
      undefined,
      controller.signal,
    ),
  );
  assert.equal(response.status, 408);
  assert.equal(calls.length, 1);
  assert.ok(!JSON.stringify(logs).includes("private-abort-fixture"));
});
