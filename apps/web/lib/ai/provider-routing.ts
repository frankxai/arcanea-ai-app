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
  /** Vercel AI Gateway id (`provider/model`) when the model is offered on platform credentials. */
  platformGatewayId?: string;
}
export class ProviderRoutingError extends Error {
  status = 400;
}

/** Customer key, sent only to the provider it belongs to. */
export interface ByokRoute {
  kind: "byok";
  providerId: string;
  gatewayModelId: string | undefined;
  apiKey: string;
  apiKeySource: "client-byok";
}

/** Platform credentials. Always Vercel AI Gateway, never a per-provider key. */
export interface PlatformGatewayRoute {
  kind: "platform-gateway";
  providerId: "gateway";
  gatewayModelId: string | undefined;
  /** AI Gateway model id, `provider/model`. */
  platformModelId: string;
  apiKeySource: "platform-gateway";
}

export type ProviderRoute = ByokRoute | PlatformGatewayRoute;

/** Platform default when no model is chosen; matches the former OpenRouter default. */
export const PLATFORM_DEFAULT_MODEL = "google/gemini-2.5-flash";
const GATEWAY_MODEL_ID = /^[a-z0-9][a-z0-9-]*\/[A-Za-z0-9][A-Za-z0-9._:-]*$/;

export function isGatewayModelId(value: unknown): value is string {
  return (
    typeof value === "string" && value.length <= 200 && GATEWAY_MODEL_ID.test(value)
  );
}

/** `ARCANEA_DEFAULT_MODEL` when it is a valid `provider/model` id, else the platform default. */
export function resolvePlatformDefaultModel(
  env: Record<string, string | undefined>,
): string {
  const configured = env.ARCANEA_DEFAULT_MODEL?.trim();
  return isGatewayModelId(configured) ? configured : PLATFORM_DEFAULT_MODEL;
}

/**
 * Explicit key (`AI_GATEWAY_API_KEY`, or the repo's older `AI_GATEWAY_TOKEN`).
 * Undefined means the AI SDK falls back to the Vercel OIDC token.
 */
export function platformGatewayApiKey(
  env: Record<string, string | undefined>,
): string | undefined {
  return env.AI_GATEWAY_API_KEY?.trim() || env.AI_GATEWAY_TOKEN?.trim() || undefined;
}

/** True when AI Gateway can authenticate: an API key, an OIDC token, or a Vercel runtime that issues one. */
export function isPlatformGatewayConfigured(
  env: Record<string, string | undefined>,
): boolean {
  return Boolean(
    platformGatewayApiKey(env) || env.VERCEL_OIDC_TOKEN?.trim() || env.VERCEL === "1",
  );
}

/** Resolve destination and credentials together. Never reuse a key across providers. */
export function resolveProviderRoute(
  request: RoutingRequest,
  providers: Record<string, ProviderConfig>,
  models: Record<string, ModelConfig>,
  env: Record<string, string | undefined>,
): ProviderRoute {
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

  if (!clientApiKey)
    return resolvePlatformRoute(requestedProvider, explicitModel, models, env);

  if (explicitModel && models[explicitModel].provider !== requestedProvider)
    throw new ProviderRoutingError(
      "The API key provider does not match the selected model. Choose a matching provider.",
    );
  const providerId = explicitModel
    ? models[explicitModel].provider
    : (requestedProvider as string);
  if (!Object.hasOwn(providers, providerId))
    throw new ProviderRoutingError(
      "No API key configured. Connect a provider in Settings.",
    );
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
    kind: "byok",
    providerId,
    gatewayModelId,
    apiKey: clientApiKey,
    apiKeySource: "client-byok",
  };
}

function resolvePlatformRoute(
  requestedProvider: string | undefined,
  explicitModel: string | undefined,
  models: Record<string, ModelConfig>,
  env: Record<string, string | undefined>,
): PlatformGatewayRoute {
  if (!isPlatformGatewayConfigured(env)) {
    const error = new ProviderRoutingError(
      requestedProvider
        ? `No API key for ${requestedProvider}. Connect this provider in Settings.`
        : "No API key configured. Connect a provider in Settings.",
    );
    error.status = requestedProvider ? 503 : 400;
    throw error;
  }
  const platformModelId = explicitModel
    ? models[explicitModel].platformGatewayId
    : resolvePlatformDefaultModel(env);
  if (!platformModelId || !isGatewayModelId(platformModelId))
    throw new ProviderRoutingError(
      "This model needs your own provider key. Connect it in Settings.",
    );
  if (
    requestedProvider &&
    explicitModel &&
    models[explicitModel].provider !== requestedProvider
  )
    throw new ProviderRoutingError(
      "The selected provider does not match the selected model. Choose a matching provider.",
    );
  return {
    kind: "platform-gateway",
    providerId: "gateway",
    gatewayModelId: explicitModel,
    platformModelId,
    apiKeySource: "platform-gateway",
  };
}
