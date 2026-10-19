import { createClient } from "@/lib/supabase/server";
import { captureEmail } from "@/lib/waitlist/capture-email";
import { joinWaitlist } from "@/lib/waitlist/join";
import {
  isFoundingCircleSignup,
  readWaitlistJson,
  validateWaitlistBody,
} from "@/lib/waitlist/request";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * Anonymous by design: middleware exempts exactly POST /api/waitlist from auth.
 * Every other method on this path still goes through the session check.
 *
 * Two signup shapes share this path: the pricing/MCP `{ email, source? }`
 * Founding Circle / studio form (Supabase `waitlists`, #458/#478) and the
 * per-product /waitlist form (`productId`, shared demand capture in KV).
 */
export async function POST(req: Request) {
  const raw = await readWaitlistJson(req);
  if (!raw.ok)
    return Response.json(
      { error: raw.error },
      { status: raw.status, headers: NO_STORE },
    );

  if (isFoundingCircleSignup(raw.json)) {
    const candidateSource = (raw.json as { source?: unknown }).source;
    const source =
      typeof candidateSource === "string" &&
      /^[a-z0-9_]{1,64}$/.test(candidateSource)
        ? candidateSource
        : "pricing_founding_circle";
    const result = await captureEmail(
      raw.json.email,
      async (row) => {
        try {
          const supabase = await createClient();
          const { error } = await supabase.from("waitlists").insert([row]);
          return { error };
        } catch (error) {
          return { error: { message: String(error) } };
        }
      },
      source,
      "Welcome to the Founding Circle!",
    );
    return Response.json(result.body, {
      status: result.status,
      headers: NO_STORE,
    });
  }

  const parsed = validateWaitlistBody(raw.json);
  if (!parsed.ok)
    return Response.json(
      { error: parsed.error },
      { status: parsed.status, headers: NO_STORE },
    );

  const { status, body, headers } = await joinWaitlist(parsed.body, req);
  return Response.json(body, { status, headers: { ...NO_STORE, ...headers } });
}
