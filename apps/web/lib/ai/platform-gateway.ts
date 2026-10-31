/**
 * Platform model access through Vercel AI Gateway.
 *
 * Every model call paid with Arcanea's own credentials goes through here.
 * Customer keys (BYOK) never do: they stay bound to their own provider in
 * `provider-routing.ts`.
 *
 * Auth: `AI_GATEWAY_API_KEY` (or the older `AI_GATEWAY_TOKEN`) when set;
 * otherwise the AI SDK uses the Vercel OIDC token issued to the deployment.
 */

import { createGateway, type LanguageModel } from "ai";
import {
  isGatewayModelId,
  isPlatformGatewayConfigured,
  platformGatewayApiKey,
  resolvePlatformDefaultModel,
} from "./provider-routing";

export {
  isGatewayModelId,
  isPlatformGatewayConfigured,
  PLATFORM_DEFAULT_MODEL,
} from "./provider-routing";

type Env = Record<string, string | undefined>;

/** Default platform model id (`ARCANEA_DEFAULT_MODEL` or the built-in default). */
export function platformDefaultModelId(env: Env = process.env): string {
  return resolvePlatformDefaultModel(env);
}

/** True when platform model calls can authenticate with AI Gateway. */
export function platformGatewayAvailable(env: Env = process.env): boolean {
  return isPlatformGatewayConfigured(env);
}

/** Language model on AI Gateway. `modelId` is `provider/model`; omit for the default. */
export function platformLanguageModel(
  modelId?: string,
  env: Env = process.env,
): LanguageModel {
  const id = modelId ?? resolvePlatformDefaultModel(env);
  if (!isGatewayModelId(id))
    throw new Error("Platform model id must be provider/model.");
  return createGateway({ apiKey: platformGatewayApiKey(env) })(id);
}

/** `providerOptions.gateway` tags so platform spend is attributable per feature. */
export function platformGatewayOptions(feature: string) {
  return { gateway: { tags: [`feature:${feature}`] } };
}
