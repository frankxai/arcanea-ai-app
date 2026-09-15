import { createHash } from "node:crypto";
import registry from "../../data/products.graph.json";
import {
  handleJoin,
  handleState,
  type ProductConfig,
} from "../demand-capture/handler";
import { kv } from "../demand-capture/store";
import type { WaitlistState } from "../demand-capture/types";

export type WaitlistProductId = "arcanea-subscription" | "arcanea-mcp";

export type JoinResult = {
  status: number;
  body: WaitlistState | { error: string };
  headers?: Record<string, string>;
};

export const UNAVAILABLE =
  "The waitlist is offline right now, so your email was not saved. Please try again later.";
export const RATE_LIMITED =
  "Too many attempts. Please wait a few minutes and try again.";

export const RATE_WINDOW_SECONDS = 600;
export const MAX_PER_IP = 5;
// Joining and answering both products from one inbox is four requests; more is a loop or a script.
export const MAX_PER_EMAIL = 6;

export function findProduct(id: unknown): ProductConfig | undefined {
  return (registry.products as ProductConfig[]).find((p) => p.id === id);
}

export function isStoreConfigured(env: NodeJS.ProcessEnv = process.env) {
  return Boolean(env.KV_REST_API_URL && env.KV_REST_API_TOKEN);
}

const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex").slice(0, 32);

function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Fixed window in the waitlist's own KV. Raw IPs and emails are never stored, only digests. */
async function hit(bucket: string, limit: number, nowMs: number) {
  const windowStart =
    Math.floor(nowMs / 1000 / RATE_WINDOW_SECONDS) * RATE_WINDOW_SECONDS;
  const key = `waitlist:rl:${bucket}:${windowStart}`;
  const count = Number(await kv(["incr", key]));
  if (count === 1) await kv(["expire", key, String(RATE_WINDOW_SECONDS)]);
  const retryAfter =
    windowStart + RATE_WINDOW_SECONDS - Math.floor(nowMs / 1000);
  return { limited: count > limit, retryAfter: Math.max(1, retryAfter) };
}

/**
 * The previous route answered "Welcome to the Founding Circle!" even when the
 * insert failed. A signup we did not store is reported as a failure, always,
 * and a limiter we cannot reach refuses rather than waving traffic through.
 */
export async function joinWaitlist(
  body: unknown,
  req: Request,
  nowMs: number = Date.now(),
): Promise<JoinResult> {
  if (!body || typeof body !== "object") {
    return { status: 400, body: { error: "Invalid request" } };
  }
  const input = body as Record<string, unknown>;
  const product = findProduct(input.productId);
  if (!product) return { status: 404, body: { error: "Unknown product" } };

  if (!isStoreConfigured()) {
    console.error(
      "[waitlist] KV_REST_API_URL or KV_REST_API_TOKEN missing; signup refused",
    );
    return { status: 503, body: { error: UNAVAILABLE } };
  }

  try {
    const checks = [hit(`ip:${digest(clientIp(req))}`, MAX_PER_IP, nowMs)];
    if (typeof input.email === "string" && input.email.trim()) {
      checks.push(
        hit(
          `email:${digest(input.email.trim().toLowerCase())}`,
          MAX_PER_EMAIL,
          nowMs,
        ),
      );
    }
    const blocked = (await Promise.all(checks)).filter((r) => r.limited);
    if (blocked.length) {
      const retryAfter = Math.max(...blocked.map((r) => r.retryAfter));
      return {
        status: 429,
        body: { error: RATE_LIMITED },
        headers: { "Retry-After": String(retryAfter) },
      };
    }
  } catch (err) {
    console.error("[waitlist] rate limiter unavailable; signup refused", err);
    return { status: 503, body: { error: UNAVAILABLE } };
  }

  try {
    return await handleJoin(product, input, req);
  } catch (err) {
    console.error("[waitlist] store write failed", err);
    return { status: 503, body: { error: UNAVAILABLE } };
  }
}

/** First-paint state. Undefined means "say nothing", never a guessed number. */
export async function readWaitlistState(
  id: WaitlistProductId,
): Promise<WaitlistState | undefined> {
  const product = findProduct(id);
  if (!product || !isStoreConfigured()) return undefined;
  try {
    return (await handleState(product)).body;
  } catch (err) {
    console.error("[waitlist] state read failed", err);
    return undefined;
  }
}
