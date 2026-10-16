/**
 * Shared rate limit for POST /api/agents/:id/execute.
 *
 * The in-memory limiter in lib/rate-limit/rate-limiter.ts keeps one counter per
 * isolate, so on a serverless or edge deployment a caller can exceed the limit
 * by landing on different isolates. For a route that guards server-funded
 * provider calls the counter has to be shared and atomic.
 *
 * Backend: the Upstash Redis REST API (fetch only, so it runs on the edge).
 * One pipeline call does INCR then PEXPIRE on a per-window key; INCR is atomic,
 * so concurrent requests cannot both read the same count.
 *
 * Fail-closed:
 *   - store configured but unreachable or malformed  -> "unavailable" (503)
 *   - store not configured                           -> "unavailable" (503),
 *     unless an operator sets AGENT_EXECUTE_RATE_LIMIT_LOCAL=true to accept the
 *     per-isolate limiter knowingly.
 *
 * No framework imports, so it can be tested directly.
 */

type Env = Record<string, string | undefined>;

export interface RateWindow {
  maxRequests: number;
  windowMs: number;
}

export type RateDecision =
  | { status: "allowed"; remaining: number; store: "shared" | "local" }
  | { status: "limited"; retryAfterSec: number; store: "shared" | "local" }
  | { status: "unavailable"; reason: string };

export type LocalLimiter = (
  key: string,
  window: RateWindow,
) => { allowed: boolean; resetTime: number; remaining: number };

/** Prefix keys so this route's counters never collide with other routes. */
export const RATE_KEY_PREFIX = "agents.execute:";

export function sharedStoreConfig(
  env: Env = process.env,
): { url: string; token: string } | null {
  const url = env.UPSTASH_REDIS_REST_URL ?? env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN ?? env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  if (!/^https:\/\//i.test(url)) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

export function localRateLimitAccepted(env: Env = process.env): boolean {
  return env.AGENT_EXECUTE_RATE_LIMIT_LOCAL?.trim().toLowerCase() === "true";
}

export async function checkExecuteRateLimit(
  identifier: string,
  window: RateWindow,
  deps: {
    env?: Env;
    fetchImpl?: typeof fetch;
    local?: LocalLimiter;
    now?: () => number;
    timeoutMs?: number;
  } = {},
): Promise<RateDecision> {
  const env = deps.env ?? process.env;
  const now = (deps.now ?? Date.now)();
  const key = `${RATE_KEY_PREFIX}${identifier}`;
  const store = sharedStoreConfig(env);

  if (!store) {
    if (localRateLimitAccepted(env) && deps.local) {
      const r = deps.local(key, window);
      return r.allowed
        ? { status: "allowed", remaining: r.remaining, store: "local" }
        : {
            status: "limited",
            retryAfterSec: Math.max(1, Math.ceil((r.resetTime - now) / 1000)),
            store: "local",
          };
    }
    return { status: "unavailable", reason: "rate_limit_store_unconfigured" };
  }

  // Fixed window: the window number is part of the key, so each window starts
  // from zero and old keys expire on their own.
  const windowIndex = Math.floor(now / window.windowMs);
  const windowKey = `${key}:${windowIndex}`;
  const windowEnd = (windowIndex + 1) * window.windowMs;
  const doFetch = deps.fetchImpl ?? fetch;

  try {
    const res = await doFetch(`${store.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${store.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", windowKey],
        ["PEXPIRE", windowKey, String(window.windowMs * 2)],
      ]),
      signal: AbortSignal.timeout(deps.timeoutMs ?? 2_000),
    });
    if (!res.ok)
      return { status: "unavailable", reason: "rate_limit_store_error" };
    const out = (await res.json()) as Array<{
      result?: unknown;
      error?: unknown;
    }>;
    const count = out?.[0]?.result;
    if (
      out?.[0]?.error ||
      typeof count !== "number" ||
      !Number.isFinite(count)
    ) {
      return { status: "unavailable", reason: "rate_limit_store_malformed" };
    }
    if (count > window.maxRequests) {
      return {
        status: "limited",
        retryAfterSec: Math.max(1, Math.ceil((windowEnd - now) / 1000)),
        store: "shared",
      };
    }
    return {
      status: "allowed",
      remaining: window.maxRequests - count,
      store: "shared",
    };
  } catch {
    return { status: "unavailable", reason: "rate_limit_store_unreachable" };
  }
}
