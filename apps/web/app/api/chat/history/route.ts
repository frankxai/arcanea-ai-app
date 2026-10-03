/** Chat history is durable only for authenticated accounts, under Supabase RLS. */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type StoredMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function respond(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function authenticatedUserId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    return error ? null : (data.user?.id ?? null);
  } catch {
    return null;
  }
}

function validMessages(value: unknown): value is StoredMessage[] {
  return (
    Array.isArray(value) &&
    value.length <= 50 &&
    value.every(
      (message) =>
        message &&
        typeof message.id === "string" &&
        message.id.length > 0 &&
        message.id.length <= 128 &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0 &&
        message.content.length <= 8000,
    )
  );
}

export async function GET(req: NextRequest) {
  const userId = await authenticatedUserId();
  if (!userId)
    return respond({ error: "Sign in to access saved chat history." }, 401);

  const luminorId = req.nextUrl.searchParams.get("luminorId") || "default";
  const beforeId = req.nextUrl.searchParams.get("before") ?? undefined;
  const requestedLimit = Number(req.nextUrl.searchParams.get("limit") || 50);
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(1, Math.min(200, Math.trunc(requestedLimit)))
    : 50;

  try {
    const { getChatHistory } = await import("@/lib/services/chat-service");
    const result = await getChatHistory(userId, luminorId, { limit, beforeId });
    return respond({
      sessionId: result.sessionId,
      messages: result.messages.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        timestamp: message.createdAt,
      })),
      bondState: result.bondState,
      hasMore: result.hasMore,
    });
  } catch {
    console.error("[chat/history GET] Persistence unavailable");
    return respond(
      { error: "Saved chat history is temporarily unavailable." },
      503,
    );
  }
}

export async function POST(req: NextRequest) {
  const userId = await authenticatedUserId();
  if (!userId) return respond({ error: "Sign in to save chat history." }, 401);

  let body: { luminorId?: unknown; messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return respond({ error: "Invalid JSON body." }, 400);
  }
  if (!validMessages(body?.messages)) {
    return respond(
      { error: "Provide at most 50 valid messages of up to 8,000 characters." },
      400,
    );
  }
  const luminorId =
    typeof body.luminorId === "string" &&
    body.luminorId.length <= 128 &&
    body.luminorId
      ? body.luminorId
      : "default";
  if (body.messages.length === 0) return respond({ ok: true, saved: 0 });

  try {
    const { persistChatMessages } = await import("@/lib/services/chat-service");
    const result = await persistChatMessages(userId, luminorId, body.messages);
    return respond({ ok: true, ...result });
  } catch {
    console.error("[chat/history POST] Persistence unavailable");
    return respond(
      { ok: false, error: "Chat was not saved. Please retry." },
      503,
    );
  }
}
