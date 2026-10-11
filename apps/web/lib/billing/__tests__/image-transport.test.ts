import assert from "node:assert/strict";
import { test } from "node:test";
import { generateImages, resumeImages } from "../../imagine/generate";
import { OperationPendingError } from "../operations";

async function controlled(
  work: (calls: string[]) => Promise<void>,
  response: (
    url: string,
    index: number,
    init?: RequestInit,
  ) => Promise<Response>,
) {
  const names = [
    "OPENROUTER_API_KEY",
    "XAI_API_KEY",
    "GOOGLE_API_KEY",
    "GEMINI_API_KEY",
  ];
  const prior = names.map((name) => process.env[name]);
  const original = globalThis.fetch;
  const calls: string[] = [];
  names.forEach((name) => delete process.env[name]);
  process.env.OPENROUTER_API_KEY = "test-openrouter";
  process.env.XAI_API_KEY = "test-xai";
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    calls.push(url);
    return response(url, calls.length, init);
  };
  try {
    await work(calls);
  } finally {
    globalThis.fetch = original;
    names.forEach((name, index) => {
      if (prior[index] === undefined) delete process.env[name];
      else process.env[name] = prior[index];
    });
  }
}

test("an ambiguous image response cannot submit paid work to a second provider", async () => {
  await controlled(
    async (calls) => {
      await assert.rejects(
        generateImages(
          { prompt: "A lighthouse", count: 1 },
          { reference: "user:key", checkpoint: async () => {} },
        ),
        OperationPendingError,
      );
      assert.equal(calls.length, 1);
    },
    async (_url, index) =>
      index === 1
        ? new Response("Unavailable", { status: 502 })
        : Response.json({
            data: [{ url: "https://images.example.test/result.png" }],
          }),
  );
});

test("a forced provider's lost response preserves the reservation", async () => {
  await controlled(
    async (calls) => {
      await assert.rejects(
        generateImages(
          { prompt: "A lighthouse", forceProvider: "grok" },
          { reference: "user:key", checkpoint: async () => {} },
        ),
        OperationPendingError,
      );
      assert.equal(calls.length, 1);
    },
    async () => {
      throw new Error("Connection lost after submission");
    },
  );
});

const runtime = { reference: "user:key", checkpoint: async () => {} };
const image = { url: "https://images.example.test/result.png" };
const job = {
  provider: "grok",
  requestId: "accepted-1",
  model: "grok-imagine-image-2.0",
  count: 1,
};

test("accepted Grok image work is checkpointed before a fixed-origin GET", async () => {
  let saved: unknown;
  await controlled(
    async (calls) => {
      const output = await generateImages(
        { prompt: "A lighthouse", forceProvider: "grok", aspectRatio: "16:9" },
        {
          ...runtime,
          checkpoint: async (value) => {
            saved = value;
          },
        },
      );
      assert.deepEqual(saved, job);
      assert.deepEqual(output.images, [image]);
      assert.equal(output.model, "grok-imagine-image-2.0");
      assert.equal(calls.length, 2);
    },
    async (url, index, init) => {
      assert.equal(init?.redirect, "error");
      assert.ok(init?.signal);
      if (index === 1) {
        assert.equal(url, "https://api.x.ai/v1/images/generations");
        const body = JSON.parse(String(init?.body));
        assert.equal(body.model, "grok-imagine-image-2.0");
        assert.equal(body.aspect_ratio, "16:9");
        assert.equal(body.n, 1);
        assert.equal(body.deferred, true);
        assert.equal(body.size, undefined);
        return Response.json({ request_id: "accepted-1" });
      }
      assert.deepEqual(saved, job, "checkpoint must precede polling");
      assert.equal(url, "https://api.x.ai/v1/images/accepted-1");
      assert.equal(init?.method, "GET");
      return Response.json({ status: "done", data: [image] });
    },
  );
});

test("same-key image recovery polls the saved job without POST", async () => {
  await controlled(
    async (calls) => {
      assert.deepEqual((await resumeImages(job, runtime)).images, [image]);
      assert.equal(calls.length, 1);
    },
    async (url, _index, init) => {
      assert.equal(url, "https://api.x.ai/v1/images/accepted-1");
      assert.equal(init?.method, "GET");
      return Response.json({ status: "done", data: [image] });
    },
  );
});

test("checkpoint uncertainty stops polling and preserves an accepted job", async () => {
  await controlled(
    async (calls) => {
      await assert.rejects(
        generateImages(
          { prompt: "A lighthouse", forceProvider: "grok" },
          {
            ...runtime,
            checkpoint: async () => {
              throw Error("Lost database acknowledgement");
            },
          },
        ),
        OperationPendingError,
      );
      assert.equal(calls.length, 1);
    },
    async () => Response.json({ request_id: "accepted-1" }),
  );
});

test("pending, expired and malformed image jobs cannot release or resubmit", async () => {
  for (const response of [
    new Response("Expired", { status: 404 }),
    Response.json({ status: "unknown" }),
    Response.json({ status: "done", data: [{ url: "javascript:alert(1)" }] }),
  ]) {
    await controlled(
      async (calls) => {
        await assert.rejects(resumeImages(job, runtime), OperationPendingError);
        assert.equal(calls.length, 1);
      },
      async () => response,
    );
  }
  let now = 0;
  await controlled(
    async (calls) => {
      await assert.rejects(
        resumeImages(job, {
          ...runtime,
          now: () => now,
          sleep: async (ms) => {
            now += ms;
          },
          budgetMs: 4,
        }),
        OperationPendingError,
      );
      assert.equal(calls.length, 1);
    },
    async () => Response.json({ status: "pending" }, { status: 202 }),
  );
});

test("a tampered checkpoint cannot redirect provider credentials", async () => {
  for (const value of [
    { ...job, requestId: "../other" },
    { ...job, model: "grok-2-image" },
    { ...job, count: 5 },
    null,
  ]) {
    await controlled(
      async (calls) => {
        await assert.rejects(
          resumeImages(value, runtime),
          OperationPendingError,
        );
        assert.equal(calls.length, 0);
      },
      async () => {
        throw Error("Unexpected network");
      },
    );
  }
});

test("only a definite provider rejection permits an ordinary failure", async () => {
  await controlled(
    async (calls) => {
      await assert.rejects(
        generateImages(
          { prompt: "A lighthouse", forceProvider: "grok" },
          runtime,
        ),
        (error: unknown) =>
          error instanceof Error && !(error instanceof OperationPendingError),
      );
      assert.equal(calls.length, 1);
    },
    async () => new Response("Rejected", { status: 429 }),
  );
  await controlled(
    async () => {
      await assert.rejects(
        resumeImages(job, runtime),
        (error: unknown) =>
          error instanceof Error && !(error instanceof OperationPendingError),
      );
    },
    async () =>
      Response.json({
        status: "failed",
        error: { message: "private provider details" },
      }),
  );
});

test("no image provider can run without durable admission", async () => {
  await controlled(
    async (calls) => {
      await assert.rejects(
        generateImages({ prompt: "A lighthouse" }),
        /Durable image admission/,
      );
      assert.equal(calls.length, 0);
    },
    async () => {
      throw Error("Unexpected network");
    },
  );
});

test("OpenRouter success uses one model with upstream fallback disabled", async () => {
  await controlled(
    async (calls) => {
      assert.deepEqual(
        (await generateImages({ prompt: "A lighthouse" }, runtime)).images,
        [image],
      );
      assert.equal(calls.length, 1);
    },
    async (_url, _index, init) => {
      const body = JSON.parse(String(init?.body));
      assert.equal(body.model, "google/gemini-3.1-flash-image-preview");
      assert.deepEqual(body.provider, { allow_fallbacks: false });
      return Response.json({
        choices: [{ message: { images: [{ image_url: image }] } }],
      });
    },
  );
});

test("a lost response in a batch cannot turn a partial result into a settled charge", async () => {
  await controlled(
    async (calls) => {
      await assert.rejects(
        generateImages({ prompt: "A lighthouse", count: 2 }, runtime),
        OperationPendingError,
      );
      assert.equal(calls.length, 2);
    },
    async (_url, index) =>
      index === 1
        ? Response.json({
            choices: [{ message: { images: [{ image_url: image }] } }],
          })
        : new Response("Lost", { status: 502 }),
  );
});

test("a definite rejected variation allows settlement for known delivered images only", async () => {
  await controlled(
    async (calls) => {
      assert.equal(
        (await generateImages({ prompt: "A lighthouse", count: 2 }, runtime))
          .images.length,
        1,
      );
      assert.equal(calls.length, 2);
    },
    async (_url, index) =>
      index === 1
        ? Response.json({
            choices: [{ message: { images: [{ image_url: image }] } }],
          })
        : new Response("Rejected", { status: 422 }),
  );
});

test("Gemini uses current Nano Banana 2 REST settings and private key headers", async () => {
  await controlled(
    async () => {
      process.env.GEMINI_API_KEY = "test-gemini";
      const output = await generateImages(
        {
          prompt: "A lighthouse",
          forceProvider: "gemini",
          aspectRatio: "9:16",
        },
        runtime,
      );
      assert.equal(output.model, "gemini-3.1-flash-image");
      assert.equal(output.images[0].url, "data:image/png;base64,aGVsbG8=");
    },
    async (url, _index, init) => {
      assert.equal(
        url,
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent",
      );
      assert.equal(
        new Headers(init?.headers).get("x-goog-api-key"),
        "test-gemini",
      );
      assert.equal(new Headers(init?.headers).has("Authorization"), false);
      assert.deepEqual(
        JSON.parse(String(init?.body)).generationConfig.imageConfig,
        { aspectRatio: "9:16" },
      );
      return Response.json({
        candidates: [
          {
            content: {
              parts: [
                { inlineData: { mimeType: "image/png", data: "aGVsbG8=" } },
              ],
            },
          },
        ],
      });
    },
  );
});

test("malformed success bodies remain pending and never fall back", async () => {
  for (const response of [
    new Response("not JSON"),
    Response.json({ choices: [] }),
    Response.json({
      choices: [
        {
          message: {
            images: [
              { image_url: { url: "https://user:pass@images.test/image.png" } },
            ],
          },
        },
      ],
    }),
  ]) {
    await controlled(
      async (calls) => {
        await assert.rejects(
          generateImages({ prompt: "A lighthouse" }, runtime),
          OperationPendingError,
        );
        assert.equal(calls.length, 1);
      },
      async () => response,
    );
  }
});

test("a stalled response body shares the submission timeout and stays pending", async () => {
  await controlled(
    async (calls) => {
      await assert.rejects(
        generateImages({ prompt: "A lighthouse" }, { ...runtime, budgetMs: 8 }),
        OperationPendingError,
      );
      assert.equal(calls.length, 1);
    },
    async (_url, _index, init) =>
      new Response(
        new ReadableStream({
          start(controller) {
            init?.signal?.addEventListener(
              "abort",
              () => controller.error(new Error("Body transport aborted")),
              { once: true },
            );
          },
        }),
      ),
  );
});
