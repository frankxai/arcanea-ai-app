import { z } from "zod";
import { HONEYPOT_FIELD } from "../demand-capture/types";

export const MAX_BODY_BYTES = 4096;
export const INVALID_REQUEST = "Invalid request";

const optionalText = (max: number) => z.string().max(max).optional();

/**
 * Every key the two-step form can send, and nothing else. Semantic checks
 * (email shape, consent, known product, token) stay in the shared handler so
 * the estate package remains the single definition of a valid DemandSignal.
 */
const WaitlistBody = z
  .object({
    productId: z.string().min(1).max(64),
    email: z.string().min(1).max(320),
    consent: z.boolean(),
    source: optionalText(160),
    updateToken: optionalText(128),
    name: optionalText(100),
    role: optionalText(100),
    pain: optionalText(400),
    alternative: optionalText(200),
    urgency: z.enum(["now", "this-quarter", "exploring"]).optional(),
    priceBand: z
      .enum([
        "free-only",
        "under-25",
        "25-99",
        "100-299",
        "300-999",
        "over-1000",
        "company-pays",
      ])
      .optional(),
    [HONEYPOT_FIELD]: optionalText(200),
  })
  .strict();

export type WaitlistRequest =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; status: 400 | 413; error: string };

/**
 * Content-Length is client-supplied and may be absent (chunked), so the stream
 * itself is counted and abandoned as soon as it passes the cap.
 */
async function readCapped(req: Request, max: number): Promise<string | null> {
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Runs before any store call, so oversized, malformed or bot-filled bodies
 * cost nothing and never touch the rate limiter or KV.
 */
export async function parseWaitlistRequest(
  req: Request,
): Promise<WaitlistRequest> {
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES)
    return { ok: false, status: 413, error: INVALID_REQUEST };

  const text = await readCapped(req, MAX_BODY_BYTES);
  if (text === null) return { ok: false, status: 413, error: INVALID_REQUEST };

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, status: 400, error: INVALID_REQUEST };
  }

  const parsed = WaitlistBody.safeParse(json);
  if (!parsed.success)
    return { ok: false, status: 400, error: INVALID_REQUEST };

  const { [HONEYPOT_FIELD]: trap, ...body } = parsed.data;
  if (trap && trap.trim())
    return { ok: false, status: 400, error: INVALID_REQUEST };

  return { ok: true, body };
}
