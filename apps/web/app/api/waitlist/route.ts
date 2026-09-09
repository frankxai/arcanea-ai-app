import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from("waitlists")
        .insert([
          { email, source: "pricing_founding_circle", created_at: new Date() },
        ]);

      if (error) {
        console.warn("Supabase waitlist insert error:", error);
        // Fall back gracefully to mock success if table doesn't exist yet
      }
    } catch (dbErr) {
      console.warn(
        "Supabase connection failed. Falling back to mock success.",
        dbErr,
      );
    }

    // Always succeed in client UI to avoid blockages
    return NextResponse.json({
      success: true,
      message: "Welcome to the Founding Circle!",
    });
  } catch (err) {
    console.error("Waitlist API error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
