import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PLATFORM_DEFAULT_MODEL,
  platformDefaultModelId,
  platformGatewayAvailable,
  platformGatewayOptions,
  platformLanguageModel,
} from "../platform-gateway";

type ModelInfo = { provider: string; modelId: string };

test("platform models are AI Gateway models, never OpenRouter", () => {
  const model = platformLanguageModel(undefined, {
    AI_GATEWAY_API_KEY: "gw",
  }) as unknown as ModelInfo;
  assert.equal(model.provider, "gateway");
  assert.equal(model.modelId, PLATFORM_DEFAULT_MODEL);
  assert.doesNotMatch(model.provider, /openrouter/i);
});

test("the default model follows ARCANEA_DEFAULT_MODEL", () => {
  const env = { ARCANEA_DEFAULT_MODEL: "anthropic/claude-x" };
  assert.equal(platformDefaultModelId(env), "anthropic/claude-x");
  const model = platformLanguageModel(undefined, env) as unknown as ModelInfo;
  assert.equal(model.modelId, "anthropic/claude-x");
  assert.equal(
    platformDefaultModelId({ ARCANEA_DEFAULT_MODEL: "not a model" }),
    PLATFORM_DEFAULT_MODEL,
  );
});

test("malformed platform model ids are rejected before any call", () => {
  assert.throws(
    () => platformLanguageModel("gemini-2.5-flash", {}),
    /provider\/model/,
  );
});

test("gateway availability needs a key, OIDC token or Vercel runtime", () => {
  assert.equal(platformGatewayAvailable({}), false);
  assert.equal(platformGatewayAvailable({ OPENROUTER_API_KEY: "x" }), false);
  assert.equal(platformGatewayAvailable({ AI_GATEWAY_API_KEY: "x" }), true);
  assert.equal(platformGatewayAvailable({ AI_GATEWAY_TOKEN: "x" }), true);
  assert.equal(platformGatewayAvailable({ VERCEL_OIDC_TOKEN: "x" }), true);
  assert.equal(platformGatewayAvailable({ VERCEL: "1" }), true);
});

test("gateway options tag spend by feature only", () => {
  assert.deepEqual(platformGatewayOptions("chat"), {
    gateway: { tags: ["feature:chat"] },
  });
});
