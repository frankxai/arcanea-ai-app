import { createHash } from "node:crypto";
import { enhanceImagePrompt } from "@/lib/imagine/enhance-image-prompt";
/**
 * POST /api/imagine/generate
 *
 * Admission is server-side and atomic: the signed-in user's credits are
 * reserved before any provider call, settled for the images actually returned,
 * and released in full if the provider fails. Anonymous requests get 401; the
 * /imagine page stays browsable but generation on Arcanea-managed keys needs an
 * account. Prices come from the billing catalog, never from this file.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  generateImages,
  OPENROUTER_IMAGE_MODELS,
} from "@/lib/imagine/generate";
import { applyStyle } from "@/lib/imagine/styles";
import type { ImagineGenerationResponse } from "@/lib/imagine/contracts";
import { createClient } from "@/lib/supabase/server";
import { costFor, type ActionId } from "@/lib/billing/catalog";
import {
  BillingError,
  OperationPendingError,
  OperationConflictError,
  OperationFailedError,
  InsufficientCreditsError,
  withReservation,
} from "@/lib/billing/ledger";

export const maxDuration = 60;

function imageAction(model: string | undefined): ActionId {
  const entry = OPENROUTER_IMAGE_MODELS.find((entry) => entry.id === model);
  return entry?.tier === "premium" || entry?.tier === "quality"
    ? "image.premium"
    : "image.standard";
}

export async function POST(req: NextRequest) {
  const startedAt = new Date();
  try {
    const {
      prompt,
      requestKey,
      count = 4,
      aspectRatio = "1:1",
      provider,
      model,
      style,
      enhance: shouldEnhance,
    } = await req.json();

    if (
      typeof prompt !== "string" ||
      !prompt.trim() ||
      prompt.length > 2000 ||
      !Number.isInteger(count) ||
      count < 1 ||
      count > 4
    ) {
      return NextResponse.json(
        { error: "Provide a prompt (up to 2000 characters) and 1 to 4 images" },
        { status: 400 },
      );
    }

    if (
      typeof requestKey !== "string" ||
      !/^[a-f0-9-]{36}$/i.test(requestKey)
    ) {
      return NextResponse.json(
        { error: "A stable generation request key is required" },
        { status: 400 },
      );
    }
    if (
      (model != null && typeof model !== "string") ||
      (model != null &&
        !OPENROUTER_IMAGE_MODELS.some((entry) => entry.id === model)) ||
      (style != null && typeof style !== "string") ||
      (provider != null &&
        !["grok", "openrouter", "gemini"].includes(provider)) ||
      !["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "21:9"].includes(
        aspectRatio,
      )
    ) {
      return NextResponse.json(
        { error: "Invalid generation settings" },
        { status: 400 },
      );
    }
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Sign in to generate images", reason: "unauthenticated" },
        { status: 401 },
      );
    }

    const action = imageAction(typeof model === "string" ? model : undefined);
    const perImage = costFor(action, 1);
    const requested = costFor(action, count);

    const fingerprint = createHash("sha256")
      .update(
        JSON.stringify({
          prompt,
          count,
          aspectRatio,
          provider: provider ?? null,
          model: model ?? null,
          style: style ?? null,
          enhance: Boolean(shouldEnhance),
        }),
      )
      .digest("hex");

    let outcome: Awaited<
      ReturnType<
        typeof withReservation<Awaited<ReturnType<typeof generateImages>>>
      >
    >;
    try {
      outcome = await withReservation(
        {
          userId: user.id,
          requestKey,
          fingerprint,
          action,
          amount: requested,
          metadata: {
            count,
            aspectRatio,
            model: model ?? null,
            provider: provider ?? null,
          },
        },
        async () => {
          const processedPrompt = shouldEnhance
            ? await enhanceImagePrompt(prompt)
            : prompt;
          const { prompt: styledPrompt } = applyStyle(
            processedPrompt,
            style || "none",
          );
          const generated = await generateImages({
            prompt: styledPrompt,
            count,
            aspectRatio,
            forceProvider: provider || undefined,
            openrouterModel: model || undefined,
          });
          // The quoted request count is the maximum billable/deliverable quantity.
          const result = {
            ...generated,
            images: generated.images.slice(0, count),
          };
          if (result.images.length === 0) throw new Error("No images returned");
          return { result, actualCredits: result.images.length * perImage };
        },
      );
    } catch (error) {
      if (error instanceof OperationPendingError)
        return NextResponse.json(
          { error: error.message, reason: "operation_pending", requestKey },
          { status: 409 },
        );
      if (error instanceof OperationConflictError)
        return NextResponse.json(
          { error: error.message, reason: "request_conflict", requestKey },
          { status: 409 },
        );
      if (error instanceof OperationFailedError)
        return NextResponse.json(
          { error: error.message, reason: "generation_failed", requestKey },
          { status: 502 },
        );
      if (error instanceof InsufficientCreditsError) {
        return NextResponse.json(
          {
            error: "Not enough credits",
            reason: "insufficient_credits",
            required: error.required,
            balance: error.balance,
          },
          { status: 402 },
        );
      }
      if (error instanceof BillingError) {
        return NextResponse.json(
          {
            error: "Credit admission is unavailable",
            reason: "ledger_unavailable",
          },
          { status: 503 },
        );
      }
      const msg =
        error instanceof Error ? error.message : "Image generation failed";
      if (msg.includes("No image generation API configured")) {
        return NextResponse.json({ error: msg }, { status: 503 });
      }
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const { result, charged, account } = outcome;
    const completedAt = new Date();

    // Grok returns external URLs; Gemini and OpenRouter return base64 data URLs.
    const images = result.images.map((img) => {
      if (img.url.startsWith("data:")) {
        const match = img.url.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          return {
            data: match[2],
            mimeType: match[1],
            prompt: img.revisedPrompt || prompt,
          };
        }
      }
      return { url: img.url, prompt: img.revisedPrompt || prompt };
    });

    const response: ImagineGenerationResponse & {
      credits: { action: ActionId; charged: number; balance: number };
    } = {
      generationId: `gen_${requestKey}`,
      status: "completed",
      provider: result.provider,
      model: result.model,
      prompt,
      revisedPrompt: result.images[0]?.revisedPrompt,
      aspectRatio,
      assetUrls: result.images.map((img) => img.url),
      assets: result.images.map((img, index) => {
        const legacyImage = images[index];
        return {
          url: img.url,
          prompt: img.revisedPrompt || prompt,
          revisedPrompt: img.revisedPrompt,
          mimeType:
            "mimeType" in legacyImage ? legacyImage.mimeType : undefined,
          data: "data" in legacyImage ? legacyImage.data : undefined,
        };
      }),
      timing: {
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        durationMs: completedAt.getTime() - startedAt.getTime(),
      },
      safety: {
        providerConfigured: true,
        fallbackUsed: result.provider !== "openrouter",
      },
      saveState: { canSave: images.length > 0 },
      error: null,
      images: images.map((image) => ({
        ...image,
        revisedPrompt: image.prompt,
      })),
      credits: { action, charged, balance: account.balance },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Imagine API error:", error);
    return NextResponse.json(
      { error: "Failed to generate images" },
      { status: 500 },
    );
  }
}
