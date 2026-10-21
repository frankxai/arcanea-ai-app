import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  PLATFORM_DEFAULT_MODEL,
  resolvePlatformDefaultModel,
  resolveProviderRoute,
} from "../../apps/web/lib/ai/provider-routing.ts";

const providers = {
  google: { envKeys: ["GOOGLE_KEY"] },
  openai: { envKeys: ["OPENAI_KEY"] },
  openrouter: { envKeys: ["OPENROUTER_KEY"] },
  xai: { envKeys: ["XAI_KEY"] },
};
const models = {
  "google-model": { provider: "google" },
  "openai-model": { provider: "openai" },
  "xai-model": { provider: "xai" },
};
const route = (request, env = {}) =>
  resolveProviderRoute(request, providers, models, env);

test("an explicit provider never loses its key to automatic routing", () => {
  const result = route(
    { requestedProvider: "openai", clientApiKey: "openai-only" },
    { GOOGLE_KEY: "server-google" },
  );
  assert.equal(result.providerId, "openai");
  assert.equal(result.apiKey, "openai-only");
});
test("the existing chat payload permits a null gateway model", () => {
  assert.equal(
    route({
      requestedProvider: "openai",
      gatewayModel: null,
      clientApiKey: "own-key",
    }).providerId,
    "openai",
  );
});
test("auto uses the provider attached to a customer key", () => {
  const result = route({
    requestedProvider: "openai",
    gatewayModel: "arcanea-auto",
    clientApiKey: "openai-only",
  });
  assert.equal(result.providerId, "openai");
  assert.equal(result.gatewayModelId, "openai-model");
});
test("a model cannot send another provider’s key upstream", () => {
  assert.throws(
    () =>
      route({
        requestedProvider: "openai",
        gatewayModel: "google-model",
        clientApiKey: "openai-only",
      }),
    /does not match/,
  );
});
test("explicit customer keys take precedence without silent billing fallback", () => {
  const result = route(
    { requestedProvider: "openai", clientApiKey: "customer" },
    { OPENAI_KEY: "server" },
  );
  assert.equal(result.apiKey, "customer");
  assert.equal(result.apiKeySource, "client-byok");
});
test("unknown model/provider and untagged keys fail closed", () => {
  for (const input of [
    { requestedProvider: "unknown" },
    { gatewayModel: "unknown" },
    { clientApiKey: "untagged" },
    { requestedProvider: "constructor" },
  ]) {
    assert.throws(() => route(input));
  }
});
test("extended providers select a model from their own catalog", () => {
  assert.equal(
    route({ requestedProvider: "xai", clientApiKey: "xai-only" })
      .gatewayModelId,
    "xai-model",
  );
});
test("missing keys fail closed when no platform gateway is configured", () => {
  assert.throws(() => route({ requestedProvider: "openai" }), /No API key/);
  assert.throws(() => route({}), /No API key configured/);
  // Per-provider server keys no longer route anything.
  assert.throws(
    () => route({}, { GOOGLE_KEY: "server", OPENROUTER_KEY: "server" }),
    /No API key configured/,
  );
});

test("an OpenRouter customer key still routes to OpenRouter unchanged", () => {
  const result = route(
    { requestedProvider: "openrouter", clientApiKey: "or-customer" },
    { AI_GATEWAY_API_KEY: "platform" },
  );
  assert.deepEqual(result, {
    kind: "byok",
    providerId: "openrouter",
    gatewayModelId: undefined,
    apiKey: "or-customer",
    apiKeySource: "client-byok",
  });
});

test("platform credentials route only through AI Gateway", () => {
  for (const env of [
    { AI_GATEWAY_API_KEY: "gw" },
    { AI_GATEWAY_TOKEN: "gw" },
    { VERCEL_OIDC_TOKEN: "oidc" },
    { VERCEL: "1" },
  ]) {
    const result = route({}, { ...env, OPENROUTER_KEY: "server" });
    assert.equal(result.kind, "platform-gateway");
    assert.equal(result.providerId, "gateway");
    assert.equal(result.apiKeySource, "platform-gateway");
    assert.equal(result.platformModelId, PLATFORM_DEFAULT_MODEL);
    assert.equal("apiKey" in result, false);
  }
});

test("platform default model is configurable and validated", () => {
  const gw = { AI_GATEWAY_API_KEY: "gw" };
  assert.equal(
    route({}, { ...gw, ARCANEA_DEFAULT_MODEL: "anthropic/claude-x" })
      .platformModelId,
    "anthropic/claude-x",
  );
  for (const invalid of ["", "no-slash", "a/b/c", "https://evil/x", " /x"]) {
    assert.equal(
      resolvePlatformDefaultModel({ ARCANEA_DEFAULT_MODEL: invalid }),
      PLATFORM_DEFAULT_MODEL,
    );
  }
});

test("explicit platform models need a gateway id or fail closed", () => {
  const gwModels = {
    ...models,
    "google-gw": { provider: "google", platformGatewayId: "google/gw-model" },
  };
  const env = { AI_GATEWAY_API_KEY: "gw" };
  const result = resolveProviderRoute(
    { gatewayModel: "google-gw" },
    providers,
    gwModels,
    env,
  );
  assert.equal(result.platformModelId, "google/gw-model");
  assert.equal(result.gatewayModelId, "google-gw");
  assert.throws(
    () =>
      resolveProviderRoute(
        { gatewayModel: "openai-model" },
        providers,
        gwModels,
        env,
      ),
    /needs your own provider key/,
  );
  assert.throws(
    () =>
      resolveProviderRoute(
        { requestedProvider: "openai", gatewayModel: "google-gw" },
        providers,
        gwModels,
        env,
      ),
    /does not match/,
  );
});

test("migrated platform call sites never reach OpenRouter", () => {
  for (const file of [
    "apps/web/lib/ai/provider-routing.ts",
    "apps/web/lib/ai/platform-gateway.ts",
    "apps/web/app/api/imagine/enhance/route.ts",
    "apps/web/app/api/apl/enhance/route.ts",
    "apps/web/app/api/forge/luminor/route.ts",
    "apps/web/lib/imagine/enhance-image-prompt.ts",
  ]) {
    const source = readRepoFile(file);
    assert.doesNotMatch(source, /openrouter\.ai|OPENROUTER_API_KEY/, file);
  }
});

const readRepoFile = (relativePath) =>
  readFileSync(new URL(`../../${relativePath}`, import.meta.url), "utf8");

const UNSOURCED_CLAIMS = [
  /#1\b/,
  /\bbest\b/i,
  /\bfastest\b/i,
  /\bsmartest\b/i,
  /most (powerful|capable)/i,
  /\bflagship\b/i,
  /\bunmatched\b/i,
  /\bunrivall?ed\b/i,
  /\bflawless/i,
  /gold standard/i,
  /\bsupreme\b/i,
  /in the world/i,
  /on earth/i,
  /\bking\b/i,
  /SWE-?bench/i,
  /\bElo\b/,
  /\bAIME\b/,
  /ARC-AGI/,
  /tok\/s/,
];

test("model catalog copy carries no rankings or unsourced benchmark figures", () => {
  for (const file of [
    "apps/web/lib/gateway/models.ts",
    "packages/ai-provider/src/arcanea-models.ts",
  ]) {
    const source = readRepoFile(file);
    for (const pattern of UNSOURCED_CLAIMS) {
      assert.doesNotMatch(source, pattern, `${file} matches ${pattern}`);
    }
  }
});
