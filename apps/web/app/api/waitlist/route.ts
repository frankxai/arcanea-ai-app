import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    try {
      const supabase = (await createClient()) as any;
      const { error } = await supabase
        .from("waitlists")
        .insert([{ email, source: "pricing_founding_circle", created_at: new Date() }]);

      if (error) {
        console.error("Supabase waitlist insert error:", error);
        return NextResponse.json(
          { success: false, error: "Failed to join waitlist. Please try again later." },
          { status: 500 }
        );
      }
    } catch (dbErr) {
      console.error("Supabase connection failed.", dbErr);
      return NextResponse.json(
        { success: false, error: "Failed to connect to database. Please try again later." },
        { status: 500 }
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
