import registry from "../../data/products.graph.json";
import { handleJoin, handleState, type ProductConfig } from "../demand-capture/handler";
import type { WaitlistState } from "../demand-capture/types";

export type WaitlistProductId = "arcanea-subscription" | "arcanea-mcp";

export type JoinResult = {
  status: number;
  body: WaitlistState | { error: string };
};

export const UNAVAILABLE =
  "The waitlist is offline right now, so your email was not saved. Please try again later.";

export function findProduct(id: unknown): ProductConfig | undefined {
  return (registry.products as ProductConfig[]).find((p) => p.id === id);
}

export function isStoreConfigured(env: NodeJS.ProcessEnv = process.env) {
  return Boolean(env.KV_REST_API_URL && env.KV_REST_API_TOKEN);
}

/**
 * The previous route answered "Welcome to the Founding Circle!" even when the
 * insert failed. A signup we did not store is reported as a failure, always.
 */
export async function joinWaitlist(body: unknown, req: Request): Promise<JoinResult> {
  if (!body || typeof body !== "object") {
    return { status: 400, body: { error: "Invalid request" } };
  }
  const input = body as Record<string, unknown>;
  const product = findProduct(input.productId);
  if (!product) return { status: 404, body: { error: "Unknown product" } };

  if (!isStoreConfigured()) {
    console.error("[waitlist] KV_REST_API_URL or KV_REST_API_TOKEN missing; signup refused");
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
export async function readWaitlistState(id: WaitlistProductId): Promise<WaitlistState | undefined> {
  const product = findProduct(id);
  if (!product || !isStoreConfigured()) return undefined;
  try {
    return (await handleState(product)).body;
  } catch (err) {
    console.error("[waitlist] state read failed", err);
    return undefined;
  }
}
