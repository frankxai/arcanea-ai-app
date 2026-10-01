/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getClientIdentifier,
  checkRateLimit,
} from "@/lib/rate-limit/rate-limiter";

const FEEDBACK_RATE_LIMIT = { maxRequests: 5, windowMs: 60_000 };

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(getClientIdentifier(req), FEEDBACK_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();

    const { type, message, email } = body as {
      type?: string;
      message?: string;
      email?: string;
    };

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
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
          const {
            data: { user },
          } = await supabase.auth.getUser(token);
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
          console.warn("[Feedback] Supabase insert failed");
          return NextResponse.json(
            { error: "Feedback is temporarily unavailable. Please try again." },
            { status: 503, headers: { "retry-after": "60" } },
          );
        }
      } catch {
        console.warn("[Feedback] Supabase admin client unavailable");
        return NextResponse.json(
          { error: "Feedback is temporarily unavailable. Please try again." },
          { status: 503, headers: { "retry-after": "60" } },
        );
      }
    } else {
      return NextResponse.json(
        { error: "Feedback is temporarily unavailable. Please try again." },
        { status: 503, headers: { "retry-after": "60" } },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
