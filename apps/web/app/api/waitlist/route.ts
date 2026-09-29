import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { joinWaitlist } from "@/lib/waitlist/join";

export async function POST(req: NextRequest) {
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
    typeof payload.source === "string" &&
    /^[a-z0-9_]{1,64}$/.test(payload.source)
      ? payload.source
      : undefined;

  const result = await joinWaitlist(
    payload?.email,
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
  );
  return NextResponse.json(result.body, { status: result.status });
}
