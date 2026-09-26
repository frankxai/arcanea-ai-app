/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getClientIdentifier,
  checkRateLimit,
} from "@/lib/rate-limit/rate-limiter";

const FEEDBACK_RATE_LIMIT = { maxRequests: 5, windowMs: 60_000 };

function storageUnavailable() {
  return NextResponse.json(
    { error: "Feedback is temporarily unavailable. Please try again." },
    { status: 503, headers: { "Retry-After": "60" } },
  );
}

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(getClientIdentifier(req), FEEDBACK_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { type?: string; message?: string; email?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (
    !body ||
    !body.message ||
    typeof body.message !== "string" ||
    body.message.trim().length === 0
  ) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (body.email != null && typeof body.email !== "string") {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const validTypes = ["bug", "feature", "general"];
  const feedbackType = validTypes.includes(body.type ?? "")
    ? body.type
    : "general";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.warn("[Feedback] persistence is not configured");
    return storageUnavailable();
  }

  try {
    const supabase = createClient(url, serviceKey);
    let userId: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const {
          data: { user },
        } = await supabase.auth.getUser(token);
        userId = user?.id ?? null;
      } catch {
        // Feedback remains available anonymously if auth lookup fails.
      }
    }

    const { error } = await supabase.from("feedback").insert({
      type: feedbackType,
      message: body.message.trim().slice(0, 2000),
      email: body.email?.trim().slice(0, 255) || null,
      user_id: userId,
    });
    if (error) {
      console.warn("[Feedback] persistence failed");
      return storageUnavailable();
    }
  } catch {
    console.warn("[Feedback] persistence unavailable");
    return storageUnavailable();
  }

  return NextResponse.json({ ok: true });
}
