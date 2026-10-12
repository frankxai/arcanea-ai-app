import assert from "node:assert/strict";
import { test } from "node:test";
import {
  requestImages as actualRequestImages,
  requestAnimation as actualRequestAnimation,
  generatedImageSource,
  generatedImageBlob,
} from "../request";
import { createCredentialScope } from "../../ai/provider-preferences";
const testScope = createCredentialScope();
testScope.set("user:native-fixture");
const requestImages = (input: Record<string, unknown>) =>
  actualRequestImages(input, { scope: testScope, token: testScope.get() });
const requestAnimation = (input: Record<string, unknown>) =>
  actualRequestAnimation(input, { scope: testScope, token: testScope.get() });

test("private byte handles require current authority and scoped cookies", async () => {
  const oldFetch = globalThis.fetch;
  const source = "/api/imagine/assets/11111111-1111-4111-8111-111111111111.png";
  const scope = createCredentialScope();
  scope.set("user:a");
  const authority = { scope, token: scope.get() };
  let calls = 0;
  globalThis.fetch = async (_url, options) => {
    calls++;
    assert.equal(options?.credentials, "same-origin");
    assert.equal(options?.redirect, "error");
    return new Response(Buffer.from("fixture"), {
      headers: { "Content-Type": "image/png" },
    });
  };
  try {
    await assert.rejects(generatedImageBlob(source), /Sign in/);
    assert.equal(calls, 0);
    assert.equal(
      await (await generatedImageBlob(source, authority)).text(),
      "fixture",
    );
    scope.set("user:b");
    await assert.rejects(
      generatedImageBlob(source, authority),
      /account changed/,
    );
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test("private bytes returned after an account switch are never delivered", async () => {
  const oldFetch = globalThis.fetch;
  const scope = createCredentialScope();
  scope.set("user:a");
  const authority = { scope, token: scope.get() };
  let cancelled = false;
  globalThis.fetch = async () => {
    scope.set("user:b");
    return new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array([1]));
        },
        cancel() {
          cancelled = true;
        },
      }),
      { headers: { "Content-Type": "image/png" } },
    );
  };
  try {
    await assert.rejects(
      generatedImageBlob(
        "/api/imagine/assets/11111111-1111-4111-8111-111111111111.png",
        authority,
      ),
      /account changed/,
    );
    assert.equal(cancelled, true);
  } finally {
    globalThis.fetch = oldFetch;
  }
});

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
  const requests: {
    endpoint: unknown;
    requestKey: string;
    ownerId?: string;
  }[] = [];
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
    assert.equal(requests[0].ownerId, "native-fixture");
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

test("adding the animation account binding preserves an existing uncertain request identity", async () => {
  const slots = new Map<string, string>();
  const input = { imageUrl: "https://images.test/retained-frame.png" };
  const digest = Array.from(
    new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(JSON.stringify(input)),
      ),
    ),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
  const slot = `arcanea:video-request:v2:${encodeURIComponent("user:native-fixture")}:${digest}`;
  const originalKey = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  slots.set(slot, originalKey);
  const originalFetch = globalThis.fetch;
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
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(String(options?.body));
    assert.equal(body.requestKey, originalKey);
    assert.equal(body.ownerId, "native-fixture");
    return Response.json({ reason: "operation_pending" }, { status: 409 });
  };
  try {
    await requestAnimation(input);
    assert.equal(slots.get(slot), originalKey);
    assert.equal(slots.size, 1);
  } finally {
    globalThis.fetch = originalFetch;
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

test("old account completion preserves the next account's pending key and rejects A-B-A stale responses", async () => {
  const slots = new Map<string, string>();
  const originalFetch = globalThis.fetch;
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
  const scope = createCredentialScope();
  scope.set("user:account-a");
  const tokenA = scope.get();
  let completeA: (response: Response) => void = () => {};
  const keys: string[] = [];
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(String(options?.body));
    keys.push(body.requestKey);
    if (keys.length === 1)
      return new Promise<Response>((resolve) => {
        completeA = resolve;
      });
    return Response.json({ reason: "operation_pending" }, { status: 409 });
  };
  try {
    const a = actualRequestImages(
      { prompt: "Shared input" },
      { scope, token: tokenA },
    );
    const handledA = assert.rejects(a, /account changed/);
    while (!keys.length) await new Promise((resolve) => setTimeout(resolve, 1));
    scope.set("user:account-b");
    await actualRequestImages(
      { prompt: "Shared input" },
      { scope, token: scope.get() },
    );
    assert.notEqual(keys[0], keys[1]);
    scope.set("user:account-a");
    completeA(
      Response.json({
        generationId: `gen_${keys[0]}`,
        images: [{ url: "https://imgen.x.ai/fixture.webp" }],
      }),
    );
    await handledA;
    assert.equal(slots.size, 2);
    scope.set("user:account-b");
    await actualRequestImages(
      { prompt: "Shared input" },
      { scope, token: scope.get() },
    );
    assert.equal(keys[1], keys[2]);
    scope.set(null);
    await assert.rejects(
      actualRequestImages(
        { prompt: "No actor" },
        { scope, token: scope.get() },
      ),
      /account changed/,
    );
    assert.equal(keys.length, 3);
  } finally {
    globalThis.fetch = originalFetch;
    if (descriptor)
      Object.defineProperty(globalThis, "sessionStorage", descriptor);
    else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});

test("legacy pending keys are preserved and adopted without duplicating an existing actor operation", async () => {
  const slots = new Map<string, string>();
  const input = { prompt: "Legacy retry" };
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(JSON.stringify(input)),
  );
  const fingerprint = Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  const legacy = `arcanea:image-request:${fingerprint}`;
  slots.set(legacy, "retained-legacy-key");
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
  globalThis.fetch = async (_url, options) => {
    assert.equal(
      JSON.parse(String(options?.body)).requestKey,
      "retained-legacy-key",
    );
    return Response.json({ reason: "operation_pending" }, { status: 409 });
  };
  try {
    await requestImages(input);
    assert.equal(slots.size, 3);
    assert.equal(slots.get(legacy), "retained-legacy-key");
  } finally {
    globalThis.fetch = oldFetch;
    if (descriptor)
      Object.defineProperty(globalThis, "sessionStorage", descriptor);
    else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});

test("confirmed legacy adoption starts a fresh next request while the unassigned legacy record stays preserved", async () => {
  const slots = new Map<string, string>();
  const input = { prompt: "Resolved legacy" };
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(JSON.stringify(input)),
  );
  const fingerprint = Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  const legacy = `arcanea:image-request:${fingerprint}`;
  slots.set(legacy, "old-operation");
  const originalFetch = globalThis.fetch;
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
  const keys: string[] = [];
  globalThis.fetch = async (_url, options) => {
    const key = JSON.parse(String(options?.body)).requestKey;
    keys.push(key);
    return Response.json({
      generationId: `gen_${key}`,
      images: [{ url: "https://imgen.x.ai/fixture.webp" }],
    });
  };
  try {
    await requestImages(input);
    await requestImages(input);
    assert.equal(keys[0], "old-operation");
    assert.notEqual(keys[0], keys[1]);
    assert.equal(slots.get(legacy), "old-operation");
  } finally {
    globalThis.fetch = originalFetch;
    if (descriptor)
      Object.defineProperty(globalThis, "sessionStorage", descriptor);
    else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});
