/**
 * Metered-cost guard for POST /api/agents/:id/execute.
 *
 * Every call that reaches a provider is billable. This module holds the
 * decisions that keep that bounded, in a file with no framework or network
 * imports so it can be tested directly:
 *
 *   - one declared model, no silent fall-through to other paid providers
 *   - credits are checked fail-closed (an error denies, it never allows)
 *   - hard caps on input, output and tool steps
 *   - the hidden second model call (ReasoningBank distillation) is opt-in
 *   - one structured log line per decision
 */

import { GATEWAY_MODELS, EXTENDED_PROVIDERS } from "@/lib/gateway/catalog";

export const EXECUTE_LIMITS = {
  maxInputChars: 8_000,
  maxContextChars: 2_000,
  maxOutputTokens: 2_048,
  maxToolSteps: 3,
  perUser: { maxRequests: 10, windowMs: 60_000 },
  perIp: { maxRequests: 30, windowMs: 60_000 },
} as const;

/** The only model this route may call unless the agent names a gateway model. */
export const DEFAULT_EXECUTE_MODEL = "arcanea-gemini-flash";

const STANDARD_ENV_KEYS: Record<string, string[]> = {
  google: ["GOOGLE_GENERATIVE_AI_API_KEY", "GEMINI_API_KEY"],
  anthropic: ["ANTHROPIC_API_KEY"],
  openai: ["OPENAI_API_KEY"],
  openrouter: ["OPENROUTER_API_KEY"],
};

type Env = Record<string, string | undefined>;

/**
 * Kill switch. Provider calls stay on unless an operator sets
 * AI_METERED_ALLOWED=false, which turns every call into a 503 without a
 * deploy. Flip the default here if the product should ship default-off.
 */
export function meteredCallsAllowed(env: Env = process.env): boolean {
  return env.AI_METERED_ALLOWED !== "false";
}

/** ReasoningBank distillation makes a second provider call per request. */
export function learningEnabled(env: Env = process.env): boolean {
  return env.AGENT_EXECUTE_LEARNING === "true";
}

export type InputCheck =
  | { ok: true; input: string; context: Record<string, unknown> }
  | { ok: false; status: number; error: string };

export function checkInputCaps(
  rawInput: unknown,
  rawContext: unknown,
): InputCheck {
  if (typeof rawInput !== "string" || rawInput.trim().length === 0) {
    return {
      ok: false,
      status: 400,
      error: "input is required and must be a non-empty string",
    };
  }
  const input = rawInput.trim();
  if (input.length > EXECUTE_LIMITS.maxInputChars) {
    return {
      ok: false,
      status: 413,
      error: `input is limited to ${EXECUTE_LIMITS.maxInputChars} characters`,
    };
  }
  const context =
    typeof rawContext === "object" &&
    rawContext !== null &&
    !Array.isArray(rawContext)
      ? (rawContext as Record<string, unknown>)
      : {};
  let contextSize = 0;
  try {
    contextSize = JSON.stringify(context).length;
  } catch {
    contextSize = Number.POSITIVE_INFINITY;
  }
  if (contextSize > EXECUTE_LIMITS.maxContextChars) {
    return {
      ok: false,
      status: 413,
      error: `context is limited to ${EXECUTE_LIMITS.maxContextChars} characters`,
    };
  }
  return { ok: true, input, context };
}

export type DeclaredModel =
  | {
      ok: true;
      gatewayId: string;
      provider: string;
      modelId: string;
      label: string;
      apiKey: string;
      baseUrl?: string;
    }
  | { ok: false; reason: string };

/**
 * Resolve exactly one model: the agent's preferred gateway model, otherwise
 * the default. If its key is missing the call is refused. There is no walk
 * down a list of other providers.
 */
export function resolveDeclaredModel(
  preferredGatewayId: string | undefined,
  env: Env = process.env,
): DeclaredModel {
  const gatewayId = preferredGatewayId || DEFAULT_EXECUTE_MODEL;
  const gw = GATEWAY_MODELS[gatewayId];
  if (!gw) return { ok: false, reason: `unknown model ${gatewayId}` };

  const ext = EXTENDED_PROVIDERS[gw.provider];
  const keys = STANDARD_ENV_KEYS[gw.provider] ?? ext?.envKeys ?? [];
  const apiKey = keys.map((k) => env[k]).find(Boolean);
  if (!apiKey) {
    return { ok: false, reason: `no API key configured for ${gw.provider}` };
  }
  return {
    ok: true,
    gatewayId,
    provider: gw.provider,
    modelId: gw.modelId,
    label: gw.label,
    apiKey,
    baseUrl: STANDARD_ENV_KEYS[gw.provider] ? undefined : ext?.baseUrl,
  };
}

export type CreditCheck =
  | { status: "ok"; balance: number }
  | { status: "insufficient"; balance: number }
  | { status: "unavailable" };

const STARTER_CREDITS = 100;

/**
 * Fail-closed credit check. Any error reading or initialising the balance is
 * "unavailable", which the route turns into a 503. It never allows a call it
 * could not price.
 */
export async function checkCreditsFailClosed(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
  required: number,
): Promise<CreditCheck> {
  try {
    const { data, error } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", userId)
      .single();

    // PGRST116 = no row yet. Anything else is a real failure.
    if (error && error.code !== "PGRST116") return { status: "unavailable" };

    if (!data) {
      const created = await supabase
        .from("credits")
        .insert({ user_id: userId, balance: STARTER_CREDITS })
        .select()
        .single();
      if (created?.error) return { status: "unavailable" };
      return required <= STARTER_CREDITS
        ? { status: "ok", balance: STARTER_CREDITS }
        : { status: "insufficient", balance: STARTER_CREDITS };
    }

    if (typeof data.balance !== "number" || Number.isNaN(data.balance)) {
      return { status: "unavailable" };
    }
    return data.balance >= required
      ? { status: "ok", balance: data.balance }
      : { status: "insufficient", balance: data.balance };
  } catch {
    return { status: "unavailable" };
  }
}

export interface ExecuteLogEvent {
  event: "denied" | "started" | "finished";
  reason?: string;
  status?: number;
  agentId?: string;
  userId?: string | null;
  model?: string;
  finishReason?: string;
  inputTokens?: number;
  outputTokens?: number;
  durationMs?: number;
}

/** One JSON line per decision so spend can be audited from the host logs. */
export function logExecute(event: ExecuteLogEvent): void {
  console.info(
    JSON.stringify({ route: "agents.execute", at: new Date().toISOString(), ...event }),
  );
}
