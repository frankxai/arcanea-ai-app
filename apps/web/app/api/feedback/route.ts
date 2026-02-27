import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/feedback
 *
 * Placeholder endpoint for feedback submissions.
 * TODO: Wire to Supabase `feedback` table or external service.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { type, message, email } = body as {
      type?: string;
      message?: string;
      email?: string;
    };

    // Basic validation
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const validTypes = ["bug", "feature", "general"];
    const feedbackType = validTypes.includes(type ?? "") ? type : "general";

    // Log for now — replace with database insert when ready
    console.log("[Feedback Received]", {
      type: feedbackType,
      message: message.trim().slice(0, 500),
      email: email || null,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
