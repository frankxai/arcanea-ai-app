import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getModel,
  getModelsByCapability,
  getGatewayFallbackChain,
  MODEL_REGISTRY,
  DEFAULT_IMAGE_MODEL_ID,
} from "../registry";
import { createMediaStore } from "../../media/media-store";
import { generateImages } from "../../imagine/generate";

test("Model Registry contains expected image and video models with required fields", () => {
  assert.ok(MODEL_REGISTRY[DEFAULT_IMAGE_MODEL_ID]);
  const defaultModel = getModel(DEFAULT_IMAGE_MODEL_ID);
  assert.ok(defaultModel);
  assert.equal(defaultModel.id, "gemini-3.1-flash-image");
  assert.equal(defaultModel.gatewayId, "google/gemini-3.1-flash-image-preview");
  assert.equal(defaultModel.isPlaceholderPrice, true);
  assert.ok(defaultModel.creditPrice > 0);
  assert.ok(defaultModel.unitCostUsd > 0);

  const imageModels = getModelsByCapability("image");
  assert.ok(imageModels.length >= 5);

  const fallbacks = getGatewayFallbackChain("gpt-image-2");
  assert.ok(Array.isArray(fallbacks));
  assert.ok(fallbacks.includes("google/gemini-3.1-flash-image-preview"));
});

test("MediaStore handles Starlight Media Platform and fallback storage without errors", async () => {
  const mediaStore = createMediaStore("test-media-api-key");
  const oldFetch = globalThis.fetch;

  globalThis.fetch = async (url) => {
    const urlStr = String(url);
    if (urlStr.includes("/v1/upload")) {
      return Response.json({
        url: "https://media-api.starlightintelligence.org/v1/media/portfolio-media-private/test/item.png",
      });
    }
    if (urlStr.includes("/v1/signed-url")) {
      return Response.json({
        url: "https://media-api.starlightintelligence.org/signed/test/item.png",
      });
    }
    if (urlStr.includes("/v1/promote")) {
      return Response.json({
        url: "https://media-api.starlightintelligence.org/public/v1/arcanea/creations/abcdef1234567890.png",
      });
    }
    return Response.json({});
  };

  try {
    const putResult = await mediaStore.put(Buffer.from("test-content"), {
      key: "test/item.png",
      contentType: "image/png",
      visibility: "private",
    });
    assert.equal(putResult.provider, "r2");
    assert.ok(putResult.key);
    assert.ok(putResult.url);

    const signedUrl = await mediaStore.signedUrl(
      putResult.bucket,
      putResult.key,
    );
    assert.equal(
      signedUrl,
      "https://media-api.starlightintelligence.org/signed/test/item.png",
    );

    const promoted = await mediaStore.promote(
      putResult.bucket,
      putResult.key,
      "creations",
      "abcdef1234567890",
    );
    assert.equal(promoted.bucket, "portfolio-media-public");
    assert.ok(promoted.key.includes("v1/arcanea/creations/abcdef1234567890"));
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test("generateImages supports AI Gateway provider with AI SDK 7 generateImage", async () => {
  const oldGatewayToken = process.env.AI_GATEWAY_TOKEN;
  const oldFetch = globalThis.fetch;
  process.env.AI_GATEWAY_TOKEN = "test-gateway-token";

  let capturedBody: Record<string, unknown> | null = null;
  let capturedHeaders: Record<string, string> | null = null;
  globalThis.fetch = async (_url, init) => {
    if (init?.body) {
      capturedBody = JSON.parse(String(init.body));
    }
    if (init?.headers) {
      capturedHeaders = init.headers as Record<string, string>;
    }
    return Response.json({
      created: 123456789,
      data: [{ b64_json: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" }],
    });
  };

  try {
    const runtime = { reference: "user:gateway-test", checkpoint: async () => {} };
    const res = await generateImages(
      { prompt: "A celestial fortress", forceProvider: "gateway", modelId: "gpt-image-2" },
      runtime,
    );

    assert.equal(res.provider, "gateway");
    assert.equal(res.model, "gpt-image-2");
    assert.ok(res.images[0].url.startsWith("data:image/png;base64,"));
    assert.ok(capturedBody);
    assert.equal(capturedBody.model, "openai/gpt-image-2");
    assert.ok(capturedHeaders);
    assert.equal(
      capturedHeaders["x-gateway-models"],
      JSON.stringify([
        "google/gemini-3.1-flash-image-preview",
        "bfl/flux-2-pro",
      ]),
    );
  } finally {
    globalThis.fetch = oldFetch;
    if (oldGatewayToken === undefined) delete process.env.AI_GATEWAY_TOKEN;
    else process.env.AI_GATEWAY_TOKEN = oldGatewayToken;
  }
});
