import { joinWaitlist } from "@/lib/waitlist/join";
import { parseWaitlistRequest } from "@/lib/waitlist/request";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * Anonymous by design: middleware exempts exactly POST /api/waitlist from auth.
 * Every other method on this path still goes through the session check.
 */
export async function POST(req: Request) {
  const parsed = await parseWaitlistRequest(req);
  if (!parsed.ok)
    return Response.json(
      { error: parsed.error },
      { status: parsed.status, headers: NO_STORE },
    );

  const { status, body, headers } = await joinWaitlist(parsed.body, req);
  return Response.json(body, { status, headers: { ...NO_STORE, ...headers } });
}
