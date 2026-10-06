interface RoutingRequest {
  requestedProvider?: string;
  gatewayModel?: string | null;
  clientApiKey?: string;
}
interface ProviderConfig {
  envKeys: string[];
}
interface ModelConfig {
  provider: string;
}
export class ProviderRoutingError extends Error {
  status = 400;
}

/** Resolve destination and credentials together. Never reuse a key across providers. */
export function resolveProviderRoute(
  request: RoutingRequest,
  providers: Record<string, ProviderConfig>,
  models: Record<string, ModelConfig>,
  env: Record<string, string | undefined>,
) {
  const { requestedProvider, gatewayModel, clientApiKey } = request;
  for (const value of [requestedProvider, gatewayModel, clientApiKey]) {
    if (
      value !== undefined &&
      value !== null &&
      (typeof value !== "string" || !value.trim())
    )
      throw new ProviderRoutingError("Invalid provider configuration.");
  }
  if (requestedProvider && !Object.hasOwn(providers, requestedProvider))
    throw new ProviderRoutingError(
      "Unknown provider. Choose a provider in Settings.",
    );
  if (clientApiKey && !requestedProvider)
    throw new ProviderRoutingError("A provider is required with your API key.");
  const explicitModel =
    gatewayModel && gatewayModel !== "arcanea-auto" ? gatewayModel : undefined;
  if (explicitModel && !Object.hasOwn(models, explicitModel))
    throw new ProviderRoutingError("Unknown model. Choose a model in chat.");
  if (
    explicitModel &&
    clientApiKey &&
    models[explicitModel].provider !== requestedProvider
  )
    throw new ProviderRoutingError(
      "The API key provider does not match the selected model. Choose a matching provider.",
    );

  const serverKey = (id: string) =>
    providers[id]?.envKeys.map((key) => env[key]).find(Boolean);
  const providerId = explicitModel
    ? models[explicitModel].provider
    : requestedProvider || Object.keys(providers).find((id) => serverKey(id));
  if (!providerId || !Object.hasOwn(providers, providerId))
    throw new ProviderRoutingError(
      "No API key configured. Connect a provider in Settings.",
    );
  const apiKey = clientApiKey || serverKey(providerId);
  if (!apiKey) {
    const error = new ProviderRoutingError(
      `No API key for ${providerId}. Connect this provider in Settings.`,
    );
    error.status = 503;
    throw error;
  }
  const preferred = [
    "arcanea-gemini-flash",
    "arcanea-sonnet",
    "arcanea-gpt5",
    "arcanea-deepseek",
    "arcanea-grok",
    "arcanea-mistral",
    "arcanea-bolt",
    "arcanea-lightning",
  ];
  const gatewayModelId =
    explicitModel ||
    [...preferred, ...Object.keys(models)].find(
      (id) => Object.hasOwn(models, id) && models[id].provider === providerId,
    );
  return {
    providerId,
    gatewayModelId,
    apiKey,
    apiKeySource: clientApiKey
      ? ("client-byok" as const)
      : ("server-env" as const),
  };
}
