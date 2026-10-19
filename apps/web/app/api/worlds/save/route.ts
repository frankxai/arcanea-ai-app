import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { saveWorldDraftSchema } from "@/lib/worlds/draft";
import { readWorldRequest } from "@/lib/worlds/generation";
import { withAbortDeadline } from "@/lib/async-deadline";
import { saveWorldDraft, DraftSaveError } from "@/lib/worlds/save-draft";

export const runtime = "nodejs";
export const maxDuration = 30;
const reply = (body: unknown, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store, no-transform" },
  });

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin)
    return reply(
      { saved: false, error: "Save the draft from this Arcanea page." },
      403,
    );
  if (request.signal.aborted)
    return reply(
      { saved: false, error: "Saving was cancelled. Your draft is unchanged." },
      408,
    );
  try {
    const db = await createClient();
    const {
      data: { user },
      error,
    } = await withAbortDeadline("world save authentication", 4500, () =>
      db.auth.getUser(),
    );
    if (error || !user)
      return reply({ saved: false, error: "Sign in to save this draft." }, 401);
    let body: unknown;
    try {
      const raw = await readWorldRequest(request, 150000);
      body = JSON.parse(raw);
    } catch (error) {
      if (error instanceof RangeError)
        return reply(
          { saved: false, error: "This draft is too large to save." },
          413,
        );
      if (
        request.signal.aborted ||
        (error instanceof DOMException && error.name === "TimeoutError")
      )
        return reply(
          {
            saved: false,
            error:
              "Reading the draft was interrupted. Your draft is unchanged.",
          },
          408,
        );
      return reply({ saved: false, error: "Invalid draft." }, 400);
    }
    const parsed = saveWorldDraftSchema.safeParse(body);
    if (!parsed.success)
      return reply(
        {
          saved: false,
          error:
            "This draft could not be validated. Export a copy before starting again.",
        },
        400,
      );
    const saved = await withAbortDeadline("world draft save", 18000, (signal) =>
      saveWorldDraft(
        db,
        user.id,
        parsed.data,
        AbortSignal.any([request.signal, signal]),
      ),
    );
    return reply(saved);
  } catch {
    // Do not expose provider/database errors or creator content.
    return reply({ saved: false, error: new DraftSaveError().message }, 503);
  }
}
