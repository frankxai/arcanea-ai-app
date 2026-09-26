import type { DemandSignal } from "./types";

/**
 * Talks to Vercel KV and Resend over plain REST so this package installs into
 * any of the estate properties with zero new dependencies.
 */

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const RESEND_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE = process.env.RESEND_AUDIENCE_ID;

/**
 * A product promises its list "nothing from any other list". That only holds
 * with one audience per product, so RESEND_AUDIENCE_ID__<PRODUCT_ID> wins
 * over the shared RESEND_AUDIENCE_ID when it is set.
 */
const audienceFor = (productId: string) =>
  process.env[
    "RESEND_AUDIENCE_ID__" + productId.toUpperCase().replace(/-/g, "_")
  ] ?? RESEND_AUDIENCE;

const key = (productId: string, suffix: string) =>
  `waitlist:${productId}:${suffix}`;

export class KvError extends Error {}

/**
 * Upstash answers a rejected command with HTTP 200 and `{ "error": "..." }`,
 * so the status code alone proves nothing. Only a JSON object carrying a
 * `result` key and no `error` counts as success.
 */
export async function kv(command: unknown[]): Promise<unknown> {
  if (!KV_URL || !KV_TOKEN) throw new KvError("KV not configured");
  const res = await fetch(KV_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new KvError(`KV ${res.status}: reply is not JSON`);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new KvError(`KV ${res.status}: malformed reply`);
  }
  const reply = body as { result?: unknown; error?: unknown };
  if (reply.error !== undefined) {
    throw new KvError(`KV ${res.status}: ${String(reply.error)}`);
  }
  if (!res.ok) throw new KvError(`KV ${res.status}`);
  if (!("result" in reply)) throw new KvError("KV reply has no result");
  return reply.result;
}

const toInt = (value: unknown): number | undefined => {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string" && /^-?\d+$/.test(value)
        ? Number(value)
        : NaN;
  return Number.isSafeInteger(n) ? n : undefined;
};

export async function kvInt(command: unknown[]): Promise<number> {
  const result = await kv(command);
  const n = toInt(result);
  if (n === undefined) {
    throw new KvError(`KV ${String(command[0])}: expected an integer`);
  }
  return n;
}

async function kvStringOrNull(command: unknown[]): Promise<string | null> {
  const result = await kv(command);
  if (result === null || typeof result === "string") return result;
  throw new KvError(`KV ${String(command[0])}: expected a string or null`);
}

/**
 * Position claim and signal save in one Lua script, so a concurrent submit
 * cannot claim two positions and a failed save cannot burn one. Plain string
 * functions only: cjson availability is not documented for Upstash.
 * ARGV[3] = "1" lets an existing record be rewritten (a verified step-2 update).
 */
const JOIN_SCRIPT = `
local pos = redis.call('HGET', KEYS[1], ARGV[1])
if pos then
  if ARGV[3] == '1' then
    redis.call('HSET', KEYS[3], ARGV[1], (string.gsub(ARGV[2], '"__POS__"', pos, 1)))
  end
  return {tonumber(pos), 0}
end
pos = redis.call('INCR', KEYS[2])
redis.call('HSET', KEYS[1], ARGV[1], tostring(pos))
redis.call('HSET', KEYS[3], ARGV[1], (string.gsub(ARGV[2], '"__POS__"', tostring(pos), 1)))
return {pos, 1}
`;

export async function joinSignal(
  signal: Omit<DemandSignal, "position">,
  allowUpdate: boolean,
): Promise<{ position: number; created: boolean }> {
  const json = JSON.stringify({ ...signal, position: "__POS__" });
  const result = await kv([
    "eval",
    JOIN_SCRIPT,
    "3",
    key(signal.productId, "positions"),
    key(signal.productId, "count"),
    key(signal.productId, "signals"),
    signal.email,
    json,
    allowUpdate ? "1" : "0",
  ]);
  const position = Array.isArray(result) ? toInt(result[0]) : undefined;
  const created = Array.isArray(result) ? toInt(result[1]) : undefined;
  if (
    position === undefined ||
    position < 1 ||
    (created !== 0 && created !== 1)
  ) {
    throw new KvError("KV join script: malformed result");
  }
  return { position, created: created === 1 };
}

export async function readSignal(
  productId: string,
  email: string,
): Promise<DemandSignal | null> {
  const raw = await kvStringOrNull(["hget", key(productId, "signals"), email]);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as DemandSignal;
  } catch {
    throw new KvError("KV signal is not valid JSON");
  }
}

export async function getCount(productId: string): Promise<number> {
  const raw = await kvStringOrNull(["get", key(productId, "count")]);
  if (raw === null) return 0;
  const n = toInt(raw);
  if (n === undefined || n < 0) throw new KvError("KV count is not an integer");
  return n;
}

export async function allSignals(productId: string): Promise<DemandSignal[]> {
  const raw = await kv(["hgetall", key(productId, "signals")]);
  if (raw === null) return [];
  if (typeof raw !== "object")
    throw new KvError("KV hgetall: malformed result");
  const values = Array.isArray(raw)
    ? raw.filter((_, i) => i % 2 === 1)
    : Object.values(raw);
  return values.map((v) => JSON.parse(String(v)) as DemandSignal);
}

/**
 * The signal is already stored when this runs, so a Resend failure never fails
 * the signup. It is recorded under `audience-pending` for a retry instead of
 * being swallowed, and cleared on the next successful delivery.
 */
export async function addToAudience(
  email: string,
  name: string | undefined,
  productId: string,
): Promise<void> {
  const audience = audienceFor(productId);
  if (!RESEND_KEY || !audience) return;
  let failure: string | undefined;
  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${audience}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          first_name: name?.split(" ")[0],
          unsubscribed: false,
          properties: { waitlist: productId },
        }),
      },
    );
    if (!res.ok) failure = `Resend HTTP ${res.status}`;
  } catch (err) {
    failure = `Resend unreachable: ${err instanceof Error ? err.message : String(err)}`;
  }
  const pendingKey = key(productId, "audience-pending");
  if (failure) {
    await kvInt([
      "hset",
      pendingKey,
      email,
      JSON.stringify({ failure, at: new Date().toISOString() }),
    ]);
    console.error(
      `[waitlist] audience delivery pending for ${productId}: ${failure}`,
    );
    return;
  }
  await kvInt(["hdel", pendingKey, email]);
}
