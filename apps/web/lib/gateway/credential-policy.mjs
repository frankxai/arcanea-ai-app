// Public inference is BYOK-only. Managed credentials require a separate durable
// entitlement/reservation boundary; environment keys never enter this policy.
export const PUBLIC_INFERENCE_TIER = "seeker";
const providers = new Set([
  "anthropic",
  "openai",
  "google",
  "xai",
  "groq",
  "cerebras",
  "sambanova",
  "replicate",
  "together",
  "deepseek",
  "moonshot",
  "mistral",
  "openrouter",
]);

export class CredentialPolicyError extends Error {
  status = 400;
}

export function validateCustomerKey(value) {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > 8192 ||
    /[\r\n\0]/.test(value)
  )
    throw new CredentialPolicyError(
      "Invalid provider credential configuration.",
    );
  return value.trim();
}

export function extractCustomerKeys(headers) {
  const keys = Object.create(null);
  function put(provider, value) {
    if (!providers.has(provider))
      throw new CredentialPolicyError(
        "Invalid provider credential configuration.",
      );
    keys[provider] = validateCustomerKey(value);
  }
  const packed = headers.get("x-provider-keys");
  if (packed !== null) {
    if (packed.length > 16384)
      throw new CredentialPolicyError(
        "Provider credential header is too large.",
      );
    let parsed;
    try {
      parsed = JSON.parse(packed);
    } catch {
      throw new CredentialPolicyError(
        "Invalid provider credential configuration.",
      );
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new CredentialPolicyError(
        "Invalid provider credential configuration.",
      );
    for (const [provider, value] of Object.entries(parsed))
      put(provider, value);
  }
  for (const provider of providers) {
    const value = headers.get(`x-${provider}-key`);
    if (value !== null) put(provider, value);
  }
  const auth = headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7);
    const provider = token.startsWith("sk-ant-")
      ? "anthropic"
      : token.startsWith("sk-")
        ? "openai"
        : token.startsWith("gsk_")
          ? "groq"
          : token.startsWith("xai-")
            ? "xai"
            : null;
    if (provider) put(provider, token);
    else if (!Object.keys(keys).length)
      throw new CredentialPolicyError(
        "Provide a supported provider key. Managed Arcanea tokens are not enabled.",
      );
  }
  return keys;
}
