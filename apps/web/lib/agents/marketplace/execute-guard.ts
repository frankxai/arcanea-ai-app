/**
 * Metered-cost guard for POST /api/agents/:id/execute.
 *
 * Every call that reaches a provider is billable. This module holds the
 * decisions that keep that bounded, in a file with no framework or network
 * imports so it can be tested directly:
 *
 *   - one declared model, no silent fall-through to other paid providers
 *   - credits are reserved atomically before the call and refunded if it
 *     does not complete; an error denies, it never allows
 *   - hard caps on input, output and tool steps
 *   - the hidden second model call (ReasoningBank distillation) is opt-in
 *   - one structured log line per decision
 */

import { GATEWAY_MODELS, EXTENDED_PROVIDERS } from "@/lib/gateway/catalog";

export const EXECUTE_LIMITS = {
  maxInputChars: 8_000,
  maxContextChars: 2_000,
  /** Whole composed prompt: agent system prompt, memory block and user input. */
  maxPromptChars: 24_000,
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
 * Kill switch, fail-closed. Provider calls are refused unless an operator sets
 * AI_METERED_ALLOWED=true. A missing, misspelled or lost variable keeps spend
 * off; setting it to anything else (including "false") also refuses.
 */
export function meteredCallsAllowed(env: Env = process.env): boolean {
  return env.AI_METERED_ALLOWED?.trim().toLowerCase() === "true";
}

/**
 * ReasoningBank is opt-in. Retrieval embeds the input through a paid provider
 * and distillation makes a second model call, so neither runs by default.
 */
export function learningEnabled(env: Env = process.env): boolean {
  return env.AGENT_EXECUTE_LEARNING === "true";
}

/**
 * Allowlist of tools this route may offer. Each one is local or free: a
 * stateless handoff, the zero-cost /imagine handoff, a Supabase write, and
 * static domain helpers. Anything not listed (web_search, deep_research,
 * memory_store, and every tool added later) is withheld, because a tool that
 * calls a paid provider with a server key spends outside the flat credit price.
 */
export const FREE_TOOL_NAMES = [
  "handoff_to_luminor",
  "image_generate",
  "update_memory",
  "suggest_code",
  "describe_asset",
  "create_outline",
  "cite_source",
] as const;

export function onlyFreeTools<T>(
  tools: Record<string, T>,
): Record<string, T> | undefined {
  const allowed: readonly string[] = FREE_TOOL_NAMES;
  const kept = Object.fromEntries(
    Object.entries(tools).filter(([name]) => allowed.includes(name)),
  );
  return Object.keys(kept).length > 0 ? kept : undefined;
}

/** The composed prompt, not only the request fields, must stay inside the cap. */
export function checkPromptCap(systemPrompt: string, input: string): boolean {
  return systemPrompt.length + input.length <= EXECUTE_LIMITS.maxPromptChars;
}

function decodeBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return new TextDecoder().decode(
    Uint8Array.from(binary, (c) => c.charCodeAt(0)),
  );
}

function tokenFromCookieValue(raw: string): string | null {
  let value = raw;
  try {
    value = decodeURIComponent(value);
  } catch {
    // keep the raw value
  }
  if (value.startsWith("base64-")) {
    try {
      value = decodeBase64Url(value.slice("base64-".length));
    } catch {
      return null;
    }
  }
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed?.access_token === "string") return parsed.access_token;
    if (Array.isArray(parsed) && typeof parsed[0]?.access_token === "string") {
      return parsed[0].access_token;
    }
    return null;
  } catch {
    // not JSON: accept only something shaped like a JWT
  }
  return /^[\w-]+\.[\w-]+\.[\w-]+$/.test(value) ? value : null;
}

/**
 * Pull the Supabase access token out of a Cookie header. Handles what
 * @supabase/ssr writes (base64url with a "base64-" prefix, split into numbered
 * chunks) as well as the older JSON and raw-JWT forms.
 */
export function extractAccessToken(cookieHeader: string): string | null {
  const jar = new Map<string, string>();
  for (const part of cookieHeader.split(";")) {
    const at = part.indexOf("=");
    if (at < 0) continue;
    jar.set(part.slice(0, at).trim(), part.slice(at + 1).trim());
  }
  const bases = new Set<string>();
  for (const name of jar.keys()) {
    const match = /^(sb-.+-auth-token)(?:\.\d+)?$/.exec(name);
    if (match) bases.add(match[1]);
  }
  for (const base of bases) {
    let raw = jar.get(base);
    if (raw === undefined) {
      const chunks: string[] = [];
      for (let i = 0; jar.has(`${base}.${i}`); i++) {
        chunks.push(jar.get(`${base}.${i}`) as string);
      }
      if (chunks.length === 0) continue;
      raw = chunks.join("");
    }
    const token = tokenFromCookieValue(raw);
    if (token) return token;
  }
  return null;
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
  // `arcanea-auto` is a supported "let the platform choose" sentinel. Here it
  // means the one default model, never a search across paid providers.
  const gatewayId =
    !preferredGatewayId || preferredGatewayId === "arcanea-auto"
      ? DEFAULT_EXECUTE_MODEL
      : preferredGatewayId;
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
  // A creator-set price must be a finite, non-negative number. A negative price
  // would read as "sufficient" and the fallback debit would add credits.
  if (!Number.isFinite(required) || required < 0)
    return { status: "unavailable" };
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

export type CreditReservation =
  | { status: "reserved"; amount: number; balance: number }
  | { status: "insufficient"; balance: number }
  | { status: "unavailable" };

const RESERVE_ATTEMPTS = 4;

/**
 * Take the price out of the balance before the provider is called.
 *
 * The update only applies if the balance is still the value that was read
 * (`.eq("balance", observed)`), so it is a single-row compare-and-set. Two
 * parallel requests cannot both spend the same credits: the loser re-reads and
 * either succeeds against the lower balance or is refused as insufficient. A
 * run that never completes is returned with `refundCredits`.
 *
 * Reads go through `supabase` (the caller's session). Writes go through
 * `writer`, which defaults to the same client.
 */
export async function reserveCredits(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
  amount: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writer: any = supabase,
): Promise<CreditReservation> {
  // Credits are an integer column; a fractional or negative price is refused.
  if (!Number.isInteger(amount) || amount < 0) return { status: "unavailable" };

  for (let attempt = 0; attempt < RESERVE_ATTEMPTS; attempt++) {
    const seen = await checkCreditsFailClosed(supabase, userId, amount);
    if (seen.status === "unavailable") return seen;
    if (seen.status === "insufficient") return seen;
    if (amount === 0)
      return { status: "reserved", amount: 0, balance: seen.balance };

    try {
      const { data, error } = await writer
        .from("credits")
        .update({
          balance: seen.balance - amount,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("balance", seen.balance)
        .select("balance");
      if (error) return { status: "unavailable" };
      if (Array.isArray(data) && data.length === 1) {
        return {
          status: "reserved",
          amount,
          balance: Number(data[0]?.balance ?? seen.balance - amount),
        };
      }
      // No row matched: another request changed the balance. Read again.
    } catch {
      return { status: "unavailable" };
    }
  }
  // Still contended after several reads: refuse rather than guess.
  return { status: "unavailable" };
}

/** Give a reservation back. Returns false if it could not be applied. */
export async function refundCredits(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writer: any,
  userId: string,
  amount: number,
): Promise<boolean> {
  if (!Number.isInteger(amount) || amount <= 0) return amount === 0;
  for (let attempt = 0; attempt < RESERVE_ATTEMPTS; attempt++) {
    try {
      const { data: row, error: readError } = await writer
        .from("credits")
        .select("balance")
        .eq("user_id", userId)
        .single();
      if (readError || typeof row?.balance !== "number") return false;
      const { data, error } = await writer
        .from("credits")
        .update({
          balance: row.balance + amount,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("balance", row.balance)
        .select("balance");
      if (error) return false;
      if (Array.isArray(data) && data.length === 1) return true;
    } catch {
      return false;
    }
  }
  return false;
}

export interface ExecuteLogEvent {
  event:
    | "denied"
    | "started"
    | "finished"
    | "credits_reserved"
    | "credits_refunded"
    | "credits_refund_failed";
  reason?: string;
  status?: number;
  agentId?: string;
  userId?: string | null;
  model?: string;
  finishReason?: string;
  inputTokens?: number;
  outputTokens?: number;
  durationMs?: number;
  credits?: number;
  /** Which rate-limit store served the decision. */
  limiter?: string;
}

/** One JSON line per decision so spend can be audited from the host logs. */
export function logExecute(event: ExecuteLogEvent): void {
  console.info(
    JSON.stringify({
      route: "agents.execute",
      at: new Date().toISOString(),
      ...event,
    }),
  );
}
