import test from "node:test";
import assert from "node:assert/strict";
import { resolveProviderRoute } from "../../apps/web/lib/ai/provider-routing.ts";

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
test("missing keys fail and automatic server routing remains available", () => {
  assert.throws(() => route({ requestedProvider: "openai" }), /No API key/);
  assert.equal(route({}, { GOOGLE_KEY: "server" }).providerId, "google");
});
