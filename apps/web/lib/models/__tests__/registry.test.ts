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
import {
  generateImages,
  resumeImages,
  type ImageJob,
} from "../../imagine/generate";

test("Model Registry contains expected image and video models with required fields and input specs", () => {
  assert.ok(MODEL_REGISTRY[DEFAULT_IMAGE_MODEL_ID]);
  const defaultModel = getModel(DEFAULT_IMAGE_MODEL_ID);
  assert.ok(defaultModel);
  assert.equal(defaultModel.id, "gemini-3.1-flash-image");
  assert.equal(defaultModel.gatewayId, "google/gemini-3.1-flash-image-preview");
  assert.equal(defaultModel.isPlaceholderPrice, true);
  assert.equal(defaultModel.inputs.prompt, true);
  assert.ok(Array.isArray(defaultModel.inputs.aspectRatio));
  assert.ok(defaultModel.creditPrice > 0);
  assert.ok(defaultModel.unitCostUsd > 0);

  const imageModels = getModelsByCapability("image");
  assert.ok(imageModels.length >= 5);

  const t2vModels = getModelsByCapability("text-to-video");
  assert.ok(t2vModels.length >= 1);
  assert.equal(t2vModels[0].id, "veo-3.1");

  const i2vModels = getModelsByCapability("image-to-video");
  assert.ok(i2vModels.length >= 1);
  assert.equal(i2vModels[0].id, "wan-2.5");
  assert.equal(i2vModels[0].inputs.imageUrl, true);

  const fallbacks = getGatewayFallbackChain("gpt-image-2");
  assert.ok(Array.isArray(fallbacks));
  assert.ok(fallbacks.includes("google/gemini-3.1-flash-image-preview"));
});

test("MediaStore handles Starlight Media Platform and fails closed on private upload or promotion errors", async () => {
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

    // Verify private uploads fail closed when R2 key is absent or R2 returns an error
    const unconfiguredStore = createMediaStore("");
    await assert.rejects(
      unconfiguredStore.put(Buffer.from("secret"), {
        key: "private/secret.png",
        contentType: "image/png",
        visibility: "private",
      }),
      /Private media upload failed/,
    );

    await assert.rejects(
      unconfiguredStore.promote(
        "portfolio-media-private",
        "test/item.png",
        "creations",
        "1234",
      ),
      /Media promotion failed/,
    );
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test("generateImages and resumeImages support AI Gateway provider with credential isolation, aspectRatio, and checkpointing", async () => {
  const oldGatewayToken = process.env.AI_GATEWAY_TOKEN;
  const oldXaiKey = process.env.XAI_API_KEY;
  const oldFetch = globalThis.fetch;
  process.env.AI_GATEWAY_TOKEN = "test-gateway-token";
  process.env.XAI_API_KEY = "test-xai-secret-must-not-leak";

  let capturedBody = null as Record<string, unknown> | null;
  let capturedHeaders: Record<string, string> | null = null;
  let checkpointedJob: ImageJob | null = null;

  globalThis.fetch = async (url, init) => {
    const urlStr = String(url);
    if (init?.body) {
      capturedBody = JSON.parse(String(init.body));
    }
    if (init?.headers) {
      capturedHeaders = init.headers as Record<string, string>;
    }
    if (urlStr.includes("/v1/images/gateway_resume_1")) {
      return Response.json({
        status: "done",
        data: [{ url: "https://images.arcanea.test/gateway-resumed.png" }],
      });
    }
    return Response.json({
      created: 123456789,
      data: [
        {
          b64_json:
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        },
      ],
    });
  };

  try {
    const runtime = {
      reference: "user:gateway-test",
      checkpoint: async (job: ImageJob) => {
        checkpointedJob = job;
      },
    };
    const res = await generateImages(
      {
        prompt: "A celestial fortress",
        aspectRatio: "16:9",
        forceProvider: "gateway",
        modelId: "gpt-image-2",
      },
      runtime,
    );

    assert.equal(res.provider, "gateway");
    assert.equal(res.model, "gpt-image-2");
    assert.ok(checkpointedJob);
    assert.equal((checkpointedJob as ImageJob).provider, "gateway");
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

    const resumed = await resumeImages(
      {
        provider: "gateway",
        requestId: "gateway_resume_1",
        model: "gpt-image-2",
        count: 1,
      },
      runtime,
    );
    assert.equal(resumed.provider, "gateway");
    assert.equal(
      resumed.images[0].url,
      "https://images.arcanea.test/gateway-resumed.png",
    );
    assert.equal(capturedHeaders["Authorization"], "Bearer test-gateway-token");
  } finally {
    globalThis.fetch = oldFetch;
    if (oldGatewayToken === undefined) delete process.env.AI_GATEWAY_TOKEN;
    else process.env.AI_GATEWAY_TOKEN = oldGatewayToken;
    if (oldXaiKey === undefined) delete process.env.XAI_API_KEY;
    else process.env.XAI_API_KEY = oldXaiKey;
  }
});
