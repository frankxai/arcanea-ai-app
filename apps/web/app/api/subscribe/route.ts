import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getClientIdentifier,
  checkRateLimit,
} from "@/lib/rate-limit/rate-limiter";
import { joinWaitlist } from "@/lib/waitlist/join";

const SUBSCRIBE_RATE_LIMIT = { maxRequests: 3, windowMs: 60_000 };

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(getClientIdentifier(req), SUBSCRIBE_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 },
    );
  }

  let payload: { email?: unknown; source?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const source =
    typeof payload?.source === "string" && payload.source.trim()
      ? payload.source.trim().slice(0, 50)
      : "footer";
  const result = await joinWaitlist(
    payload?.email,
    async (row) => {
      try {
        const supabase = await createClient();
        const { error } = await supabase.from("subscribers").insert([row]);
        return { error };
      } catch (error) {
        return { error: { message: String(error) } };
      }
    },
    source,
    "Welcome to the multiverse.",
  );
  return NextResponse.json(result.body, { status: result.status });
}
