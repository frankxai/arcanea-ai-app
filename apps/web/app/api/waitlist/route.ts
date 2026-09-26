import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { joinWaitlist } from "@/lib/waitlist/join";

export async function POST(req: NextRequest) {
  let payload: { email?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const result = await joinWaitlist(payload?.email, async (row) => {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("waitlists").insert([row]);
      return { error };
    } catch (error) {
      return { error: { message: String(error) } };
    }
  });
  return NextResponse.json(result.body, { status: result.status });
}
