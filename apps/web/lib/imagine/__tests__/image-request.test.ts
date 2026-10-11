import assert from "node:assert/strict";
import { test } from "node:test";
import {
  requestImages,
  requestAnimation,
  generatedImageSource,
  generatedImageBlob,
} from "../request";

test("lost transport response retains the same request key; confirmed success starts a new operation", async () => {
  const slots = new Map<string, string>();
  const requests: { requestKey: string }[] = [];
  const oldFetch = globalThis.fetch;
  const descriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    "sessionStorage",
  );
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem: (k: string) => slots.get(k) ?? null,
      setItem: (k: string, v: string) => slots.set(k, v),
      removeItem: (k: string) => slots.delete(k),
    },
  });
  globalThis.fetch = async (_url, options) => {
    requests.push(JSON.parse(options!.body as string));
    if (requests.length === 1) throw Error("connection lost");
    return Response.json({
      generationId: `gen_${requests.at(-1)!.requestKey}`,
      images: [{ url: "https://images.test/result.png" }],
    });
  };
  try {
    await assert.rejects(requestImages({ prompt: "private draft", count: 1 }));
    assert.equal(slots.size, 1);
    assert.ok([...slots.keys()].every((k) => !k.includes("private draft")));
    await requestImages({ prompt: "private draft", count: 1 });
    await requestImages({ prompt: "private draft", count: 1 });
    assert.equal(requests[0].requestKey, requests[1].requestKey);
    assert.notEqual(requests[1].requestKey, requests[2].requestKey);
  } finally {
    globalThis.fetch = oldFetch;
    if (descriptor)
      Object.defineProperty(globalThis, "sessionStorage", descriptor);
    else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});

test("unavailable storage refuses generation before any request", async () => {
  const oldFetch = globalThis.fetch;
  const descriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    "sessionStorage",
  );
  let calls = 0;
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: { getItem: () => null, setItem: () => undefined },
  });
  globalThis.fetch = async () => {
    calls++;
    return Response.json({});
  };
  try {
    await assert.rejects(requestImages({ prompt: "draft" }), /session storage/);
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = oldFetch;
    if (descriptor)
      Object.defineProperty(globalThis, "sessionStorage", descriptor);
    else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});
test("pending video recovery retains its key and is separate from image generation", async () => {
  const slots = new Map<string, string>();
  const requests: { endpoint: unknown; requestKey: string }[] = [];
  const oldFetch = globalThis.fetch;
  const descriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    "sessionStorage",
  );
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => slots.get(key) ?? null,
      setItem: (key: string, value: string) => slots.set(key, value),
      removeItem: (key: string) => slots.delete(key),
    },
  });
  globalThis.fetch = async (endpoint, options) => {
    requests.push({ endpoint, ...JSON.parse(String(options?.body)) });
    return Response.json({ reason: "operation_pending" }, { status: 409 });
  };
  try {
    const input = { imageUrl: "https://private.test/asset.png" };
    await requestAnimation(input);
    await requestAnimation(input);
    await requestImages(input);
    assert.equal(requests[0].endpoint, "/api/imagine/animate");
    assert.equal(requests[0].requestKey, requests[1].requestKey);
    assert.notEqual(requests[0].requestKey, requests[2].requestKey);
    assert.ok([...slots.keys()].every((key) => !key.includes("private.test")));
  } finally {
    globalThis.fetch = oldFetch;
    if (descriptor)
      Object.defineProperty(globalThis, "sessionStorage", descriptor);
    else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});

test("canonical receipt decodes external and inline image sources without fabricated fallback output", () => {
  assert.equal(
    generatedImageSource({ url: "https://images.test/generated.png" }),
    "https://images.test/generated.png",
  );
  assert.equal(
    generatedImageSource({ data: "aGVsbG8=", mimeType: "image/png" }),
    "data:image/png;base64,aGVsbG8=",
  );
  for (const value of [
    { url: "javascript:alert(1)" },
    { url: "https://user:password@images.test/image.png" },
    { data: "aGVsbG8=", mimeType: "image/svg+xml" },
    {},
    null,
  ])
    assert.equal(generatedImageSource(value), null);
});

test("an unrenderable success receipt retains the same operation key on retry", async () => {
  const slots = new Map<string, string>();
  const keys: string[] = [];
  const originalFetch = globalThis.fetch;
  const descriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    "sessionStorage",
  );
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem: (slot: string) => slots.get(slot) ?? null,
      setItem: (slot: string, key: string) => slots.set(slot, key),
      removeItem: (slot: string) => slots.delete(slot),
    },
  });
  globalThis.fetch = async (_url, options) => {
    const { requestKey } = JSON.parse(String(options?.body));
    keys.push(requestKey);
    return Response.json({ generationId: `gen_${requestKey}`, images: [{}] });
  };
  try {
    await requestImages({ prompt: "Retained request", count: 1 });
    await requestImages({ prompt: "Retained request", count: 1 });
    assert.equal(keys[0], keys[1]);
    assert.equal(slots.size, 1);
  } finally {
    globalThis.fetch = originalFetch;
    if (descriptor)
      Object.defineProperty(globalThis, "sessionStorage", descriptor);
    else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});

test("inline PNG/JPEG/WEBP exports decode locally without fetch or connect-src data permission", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    throw Error("Inline export must not fetch");
  };
  try {
    for (const type of ["image/png", "image/jpeg", "image/webp"]) {
      const blob = await generatedImageBlob(`data:${type};base64,aGVsbG8=`);
      assert.equal(blob.type, type);
      assert.equal(await blob.text(), "hello");
    }
    for (const source of [
      "data:image/svg+xml;base64,aGVsbG8=",
      "http://images.test/result.png",
      "https://secret@images.test/result.png",
      "data:image/png;base64,a",
    ]) {
      await assert.rejects(generatedImageBlob(source));
    }
  } finally {
    globalThis.fetch = original;
  }
});

test("CDN export checks status, format, stream bounds and uses no cookies or referrer", async () => {
  const original = globalThis.fetch;
  let cancelled = false;
  try {
    globalThis.fetch = async (_url, options) => {
      assert.equal(options?.credentials, "omit");
      assert.equal(options?.redirect, "error");
      assert.equal(options?.referrerPolicy, "no-referrer");
      assert.ok(options?.signal instanceof AbortSignal);
      return new Response("fixture bytes", {
        headers: { "content-type": "image/webp" },
      });
    };
    const blob = await generatedImageBlob("https://imgen.x.ai/fixture.webp");
    assert.equal(blob.type, "image/webp");
    assert.equal(await blob.text(), "fixture bytes");
    for (const response of [
      new Response("not an image", {
        headers: { "content-type": "text/html" },
      }),
      new Response("", { status: 403 }),
      new Response("", { headers: { "content-type": "image/png" } }),
    ]) {
      globalThis.fetch = async () => response;
      await assert.rejects(
        generatedImageBlob("https://imgen.x.ai/fixture.webp"),
      );
    }
    globalThis.fetch = async () =>
      new Response(
        new ReadableStream({
          pull(controller) {
            controller.enqueue(new Uint8Array(9 * 1024 * 1024));
          },
          cancel() {
            cancelled = true;
          },
        }),
        { headers: { "content-type": "image/png" } },
      );
    await assert.rejects(
      generatedImageBlob("https://imgen.x.ai/fixture.webp"),
      /too large/,
    );
    assert.equal(cancelled, true);
    globalThis.fetch = async () => {
      throw new TypeError("CORS refused");
    };
    await assert.rejects(
      generatedImageBlob("https://imgen.x.ai/fixture.webp"),
      /CORS/,
    );
  } finally {
    globalThis.fetch = original;
  }
});
