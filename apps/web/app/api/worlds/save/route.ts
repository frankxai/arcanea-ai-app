import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { saveWorldDraftSchema } from "@/lib/worlds/draft";
import { saveWorldDraft, DraftSaveError } from "@/lib/worlds/save-draft";

export async function POST(request: NextRequest) {
  try {
    const db = await createClient();
    const {
      data: { user },
      error,
    } = await db.auth.getUser();
    if (error || !user)
      return NextResponse.json(
        { saved: false, error: "Sign in to save this draft." },
        { status: 401 },
      );
    const raw = await request.text();
    if (raw.length > 150000)
      return NextResponse.json(
        { saved: false, error: "This draft is too large to save." },
        { status: 413 },
      );
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { saved: false, error: "Invalid draft." },
        { status: 400 },
      );
    }
    const parsed = saveWorldDraftSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        {
          saved: false,
          error:
            "This draft could not be validated. Export a copy before starting again.",
        },
        { status: 400 },
      );
    const saved = await saveWorldDraft(db, user.id, parsed.data);
    return NextResponse.json(saved);
  } catch {
    // Do not expose provider/database errors or creator content.
    return NextResponse.json(
      { saved: false, error: new DraftSaveError().message },
      { status: 503 },
    );
  }
}
