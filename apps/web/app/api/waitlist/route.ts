import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Success must mean the signup is stored; placeholder config gets the no-op
// mock client in lib/supabase/server.ts, which resolves as success.
function supabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.length > 0 && !url.includes("example.supabase.co");
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!supabaseConfigured()) {
      console.error("[waitlist] Supabase not configured; refusing signup");
      return NextResponse.json(
        { success: false, error: "The waitlist is temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }

    try {
      const supabase = (await createClient()) as any;
      const { error } = await supabase
        .from("waitlists")
        .insert([{ email, source: "pricing_founding_circle", created_at: new Date() }]);

      if (error) {
        console.error("[waitlist] Supabase insert failed:", error);
        return NextResponse.json(
          { success: false, error: "The waitlist is temporarily unavailable. Please try again shortly." },
          { status: 503 }
        );
      }
    } catch (dbErr) {
      console.error("[waitlist] Supabase connection failed:", dbErr);
      return NextResponse.json(
        { success: false, error: "The waitlist is temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, message: "Welcome to the Founding Circle!" });
  } catch (err) {
    console.error("Waitlist API error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
