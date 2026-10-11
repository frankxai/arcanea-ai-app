import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { costFor } from "@/lib/billing/catalog";
import {
  BillingError,
  InsufficientCreditsError,
  OperationPendingError,
  OperationConflictError,
  OperationFailedError,
  withReservation,
} from "@/lib/billing/ledger";
import { generateVideo, resumeVideo } from "@/lib/imagine/video";
import { checkpointVideoJob, readVideoJob } from "@/lib/imagine/video-jobs";
import {
  isHttpsImageUrl,
  MAX_ANIMATION_PROMPT_LENGTH,
} from "@/lib/imagine/video-admission";

export const maxDuration = 120;
const respond = (body: unknown, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    !isHttpsImageUrl(body.imageUrl) ||
    (body.prompt != null && typeof body.prompt !== "string") ||
    (body.prompt?.length ?? 0) > MAX_ANIMATION_PROMPT_LENGTH ||
    typeof body.requestKey !== "string" ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
      body.requestKey,
    )
  )
    return respond(
      {
        error:
          "Provide an https image URL, a bounded prompt and a stable request key.",
      },
      400,
    );
  const { imageUrl, requestKey } = body;
  const prompt = body.prompt ?? "";
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user)
      return respond(
        { error: "Sign in to animate images.", reason: "unauthenticated" },
        401,
      );
    const amount = costFor("video.clip", 1);
    const fingerprint = createHash("sha256")
      .update(JSON.stringify({ imageUrl, prompt, action: "video.clip" }))
      .digest("hex");
    const outcome = await withReservation(
      {
        userId: user.id,
        requestKey,
        fingerprint,
        action: "video.clip",
        amount,
      },
      async (reference) => ({
        result: await generateVideo(imageUrl, prompt, reference, (job) =>
          checkpointVideoJob(user.id, reference, job),
        ),
        actualCredits: amount,
      }),
      async (reference) => ({
        result: await resumeVideo(
          await readVideoJob(user.id, reference),
          reference,
        ),
        actualCredits: amount,
      }),
    );
    return respond({
      ...outcome.result,
      charged: outcome.charged,
      balance: outcome.account.balance,
      requestKey,
    });
  } catch (error) {
    if (error instanceof InsufficientCreditsError)
      return respond(
        {
          error: "Not enough credits for a video clip.",
          reason: "insufficient_credits",
          required: error.required,
          balance: error.balance,
        },
        402,
      );
    if (error instanceof OperationPendingError)
      return respond(
        { error: error.message, reason: "operation_pending", requestKey },
        409,
      );
    if (error instanceof OperationConflictError)
      return respond(
        { error: error.message, reason: "request_conflict", requestKey },
        409,
      );
    if (error instanceof OperationFailedError)
      return respond(
        { error: error.message, reason: "generation_failed", requestKey },
        502,
      );
    return respond(
      {
        error:
          error instanceof BillingError
            ? "Credit admission is unavailable. Retry this request safely."
            : "Animation is unavailable. Retry this request safely.",
        reason: "admission_unavailable",
        requestKey,
      },
      503,
    );
  }
}
