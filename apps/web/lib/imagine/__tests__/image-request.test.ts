import assert from "node:assert/strict";
import { test } from "node:test";
import { requestImages } from "../request";

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
    return Response.json({ images: [] });
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
