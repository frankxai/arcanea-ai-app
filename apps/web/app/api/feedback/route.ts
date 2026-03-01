import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/feedback
 *
 * Saves feedback to Supabase `feedback` table.
 * Works for both authenticated and anonymous users.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { type, message, email } = body as {
      type?: string;
      message?: string;
      email?: string;
    };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const validTypes = ["bug", "feature", "general"];
    const feedbackType = validTypes.includes(type ?? "") ? type : "general";

    // Try to get authenticated user (optional — feedback works without auth)
    let userId: string | null = null;
    const supabaseConfigured =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseConfigured) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );

      const authHeader = req.headers.get("authorization");
      if (authHeader) {
        try {
          const token = authHeader.replace("Bearer ", "");
          const { data: { user } } = await supabase.auth.getUser(token);
          userId = user?.id ?? null;
        } catch {
          // Auth lookup failed — proceed without user ID
        }
      }

      try {
        const { error } = await supabase.from("feedback").insert({
          type: feedbackType,
          message: message.trim().slice(0, 2000),
          email: email?.trim().slice(0, 255) || null,
          user_id: userId,
        });

        if (error) {
          // Table might not exist yet — log and return success anyway
          console.warn("[Feedback] Supabase insert failed:", error.message);
        }
      } catch {
        // createAdminClient throws if service role key is missing — log and continue
        console.warn("[Feedback] Supabase admin client unavailable");
      }
    } else {
      // Fallback: log only
      console.log("[Feedback]", {
        type: feedbackType,
        message: message.trim().slice(0, 500),
        email: email || null,
        userId,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
