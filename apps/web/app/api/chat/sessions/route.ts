/** Saved chat sessions belong to the authenticated account, never a client userId. */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type SessionRow = {
  id: string;
  title: string | null;
  luminor_id: string | null;
  created_at: string;
  updated_at: string;
};

function respond(data: unknown, error: string | null, status = 200) {
  return NextResponse.json(
    { data, error },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

async function getAuthenticatedClient() {
  try {
    const client = await createClient();
    const { data, error } = await client.auth.getUser();
    return error || !data.user ? null : { client, userId: data.user.id };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const auth = await getAuthenticatedClient();
  if (!auth) return respond(null, "Sign in to access saved sessions.", 401);

  try {
    let query = auth.client
      .from("chat_sessions")
      .select("*")
      .eq("user_id", auth.userId)
      .order("updated_at", { ascending: false });
    const luminorId = req.nextUrl.searchParams.get("luminorId");
    if (luminorId) query = query.eq("luminor_id", luminorId);
    const { data: sessions, error } = await query;
    if (error) throw error;

    return respond(
      (sessions ?? []).map((session: SessionRow) => ({
        id: session.id,
        title: session.title ?? "New conversation",
        luminorId: session.luminor_id,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
        messageCount: 0,
      })),
      null,
    );
  } catch {
    console.error("[chat/sessions GET] Persistence unavailable");
    return respond(null, "Saved sessions are temporarily unavailable.", 503);
  }
}

export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedClient();
  if (!auth) return respond(null, "Sign in to save sessions.", 401);

  let body: { luminorId?: unknown; title?: unknown };
  try {
    body = await req.json();
  } catch {
    return respond(null, "Invalid JSON body.", 400);
  }
  const luminorId =
    typeof body?.luminorId === "string" &&
    body.luminorId.length <= 128 &&
    body.luminorId
      ? body.luminorId
      : "default";
  const title =
    typeof body?.title === "string" && body.title.trim()
      ? body.title.trim().slice(0, 120)
      : "New conversation";

  try {
    const { data: session, error } = await auth.client
      .from("chat_sessions")
      .insert({ user_id: auth.userId, luminor_id: luminorId, title })
      .select("*")
      .single();
    if (error || !session) throw error ?? new Error("No session returned");
    return respond(
      {
        id: session.id,
        title: session.title ?? title,
        luminorId: session.luminor_id,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
        messageCount: 0,
      },
      null,
      201,
    );
  } catch {
    console.error("[chat/sessions POST] Persistence unavailable");
    return respond(null, "Session was not saved. Please retry.", 503);
  }
}
