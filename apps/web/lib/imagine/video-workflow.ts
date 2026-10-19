"use workflow";

import { google } from "@ai-sdk/google";
import { experimental_generateVideo } from "ai";
import { createAdminClient } from "../supabase/server";
import { getModel } from "../models/registry";
import { createMediaStore } from "../media/media-store";
import { isHttpsImageUrl } from "./video-admission";

export interface VideoWorkflowInputs {
  jobId: string;
  userId: string;
  prompt: string;
  operation?: "text-to-video" | "image-to-video";
  imageUrl?: string;
  duration?: number;
  requestKey: string;
}

export interface VideoStepResult {
  step: string;
  status: "success" | "failed";
  data?: Record<string, unknown>;
  error?: string;
}

type LooseAdminClient = {
  from: (table: string) => {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        single: () => PromiseLike<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
      };
    };
    insert: (row: Record<string, unknown>) => {
      select: (cols: string) => {
        single: () => PromiseLike<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
      };
    };
    update: (row: Record<string, unknown>) => {
      eq: (col: string, val: string) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
    };
  };
  rpc: (fn: string, args: Record<string, unknown>) => PromiseLike<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
};

function adminDb(): LooseAdminClient {
  return createAdminClient() as unknown as LooseAdminClient;
}

function getVideoUrl(file: unknown): string {
  if (!file || typeof file !== "object") return "";
  const obj = file as Record<string, unknown>;
  if (typeof obj.url === "string" && obj.url) return obj.url;
  if (typeof obj.base64 === "string" && obj.base64) {
    return `data:${(typeof obj.mediaType === "string" && obj.mediaType) || "video/mp4"};base64,${obj.base64}`;
  }
  return "";
}

function resolveVideoModel(gatewayId: string) {
  const hasGatewayCreds = Boolean(
    process.env.AI_GATEWAY_TOKEN?.trim() || process.env.VERCEL_OIDC_TOKEN?.trim()
  );
  if (
    !hasGatewayCreds &&
    gatewayId.startsWith("google/") &&
    (process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY)
  ) {
    return google.video(gatewayId.replace(/^google\//, ""));
  }
  return gatewayId;
}

async function recordStep(
  jobId: string,
  status: string,
  stepName: string,
  data?: Record<string, unknown>,
  error?: string
): Promise<boolean> {
  try {
    const supabase = adminDb();
    const { data: currentJob, error: selectErr } = await supabase
      .from("generation_jobs")
      .select("steps")
      .eq("id", jobId)
      .single();
    if (selectErr) return false;
    const existingSteps = Array.isArray(currentJob?.steps)
      ? (currentJob.steps as Array<Record<string, unknown>>)
      : [];
    const newStep = {
      step: stepName,
      timestamp: new Date().toISOString(),
      status: error ? "failed" : "completed",
      ...(data || {}),
      ...(error ? { error } : {}),
    };
    const { error: updateErr } = await supabase
      .from("generation_jobs")
      .update({
        status,
        steps: [...existingSteps, newStep],
        ...(error ? { error } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId);
    return !updateErr;
  } catch {
    return false;
  }
}

export async function admitStep(inputs: VideoWorkflowInputs): Promise<VideoStepResult> {
  "use step";
  if (!inputs.userId || !inputs.prompt || !inputs.jobId || !inputs.requestKey) {
    return { step: "admit", status: "failed", error: "Invalid workflow inputs" };
  }
  if (
    inputs.duration !== undefined &&
    (!Number.isInteger(inputs.duration) || inputs.duration < 3 || inputs.duration > 30)
  ) {
    return { step: "admit", status: "failed", error: "Duration must be between 3 and 30 seconds" };
  }
  if (inputs.operation === "image-to-video") {
    if (!inputs.imageUrl) {
      return { step: "admit", status: "failed", error: "Image URL required for image-to-video" };
    }
    if (!isHttpsImageUrl(inputs.imageUrl)) {
      return { step: "admit", status: "failed", error: "Valid HTTPS image URL required for image-to-video" };
    }
  }
  const recorded = await recordStep(inputs.jobId, "admitted", "admit");
  if (!recorded) {
    return { step: "admit", status: "failed", error: "Failed to persist admission state" };
  }
  return { step: "admit", status: "success" };
}

export async function debitStep(inputs: VideoWorkflowInputs, cost: number): Promise<VideoStepResult> {
  "use step";
  if (!Number.isInteger(cost) || cost < 0) {
    return { step: "debit", status: "failed", error: "Invalid credit cost" };
  }
  const debitId = `debit_${inputs.jobId}_${inputs.requestKey}`;
  const reference = `${inputs.userId}:${inputs.requestKey}`;
  const supabase = adminDb();

  const { data: reservation, error: rpcError } = await supabase.rpc("billing_reserve_credits", {
    p_user: inputs.userId,
    p_amount: cost,
    p_action: "video.clip",
    p_reference: reference,
    p_metadata: {
      jobId: inputs.jobId,
      fingerprint: `${inputs.prompt}:${inputs.operation || "text-to-video"}:${inputs.duration || 5}`,
    },
  });

  if (rpcError || (reservation && reservation.ok === false)) {
    const errReason =
      (reservation?.reason as string) || rpcError?.message || "Insufficient credits or reservation error";
    await recordStep(inputs.jobId, "failed", "debit", { debitId, cost }, errReason);
    return { step: "debit", status: "failed", error: errReason };
  }

  const { error: jobErr } = await supabase
    .from("generation_jobs")
    .update({
      status: "debited",
      debit_id: debitId,
      cost,
      updated_at: new Date().toISOString(),
    })
    .eq("id", inputs.jobId);

  if (jobErr) {
    return { step: "debit", status: "failed", error: jobErr.message };
  }

  const recorded = await recordStep(inputs.jobId, "debited", "debit", { debitId, cost, reference });
  if (!recorded) {
    return { step: "debit", status: "failed", error: "Failed to record debit step" };
  }
  return { step: "debit", status: "success", data: { debitId, cost, reference } };
}

export async function generateStep(inputs: VideoWorkflowInputs): Promise<VideoStepResult> {
  "use step";
  const isI2V = inputs.operation === "image-to-video";
  const registryEntry = getModel(isI2V ? "wan-2.5" : "veo-3.1");
  const primaryModelId =
    registryEntry?.gatewayId || (isI2V ? "alibaba/wan-2.5-i2v-720p" : "google/veo-3.1-generate-001");
  const fallbackModelId =
    registryEntry?.fallbackId || (isI2V ? "google/veo-3.1-generate-001" : "klingai/kling-v2.5-turbo-pro");

  const promptPayload =
    isI2V && inputs.imageUrl ? { text: inputs.prompt, image: inputs.imageUrl } : inputs.prompt;
  const durationOpt = inputs.duration ? { duration: inputs.duration } : {};

  await recordStep(inputs.jobId, "generating", "generate_start", { model: primaryModelId });

  try {
    const res = await experimental_generateVideo({
      model: resolveVideoModel(primaryModelId),
      prompt: promptPayload,
      ...durationOpt,
    });
    const url = getVideoUrl(res.video);
    if (url) {
      await recordStep(inputs.jobId, "generating", "generate_complete", { model: primaryModelId, url });
      return { step: "generate", status: "success", data: { videoUrl: url, model: primaryModelId } };
    }
  } catch (err) {
    console.warn(`Primary model ${primaryModelId} failed, trying fallback ${fallbackModelId}:`, err);
  }

  try {
    const fbRes = await experimental_generateVideo({
      model: resolveVideoModel(fallbackModelId),
      prompt: promptPayload,
      ...durationOpt,
    });
    const fbUrl = getVideoUrl(fbRes.video);
    if (fbUrl) {
      await recordStep(inputs.jobId, "generating", "generate_complete", { model: fallbackModelId, url: fbUrl });
      return { step: "generate", status: "success", data: { videoUrl: fbUrl, model: fallbackModelId } };
    }
  } catch (fallbackErr) {
    const errMsg = fallbackErr instanceof Error ? fallbackErr.message : "Generation failed";
    await recordStep(inputs.jobId, "failed", "generate_error", undefined, errMsg);
    return { step: "generate", status: "failed", error: errMsg };
  }

  await recordStep(inputs.jobId, "failed", "generate_error", undefined, "No video returned");
  return { step: "generate", status: "failed", error: "No video returned" };
}

export async function storeStep(inputs: VideoWorkflowInputs, videoUrl: string): Promise<VideoStepResult> {
  "use step";
  if (!videoUrl) {
    return { step: "store", status: "failed", error: "Missing video URL to store" };
  }
  let storedUrl = videoUrl;
  if (process.env.STARLIGHT_MEDIA_API_KEY?.trim() && videoUrl.startsWith("data:")) {
    const match = videoUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      try {
        const mediaStore = createMediaStore();
        const bytes = Buffer.from(match[2], "base64");
        const uploaded = await mediaStore.put(bytes, {
          contentType: match[1] || "video/mp4",
          ownerId: inputs.userId,
          kind: "video",
          visibility: "private",
        });
        storedUrl = uploaded.url;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Private media upload failed";
        await recordStep(inputs.jobId, "failed", "store", undefined, msg);
        return { step: "store", status: "failed", error: msg };
      }
    }
  }
  const recorded = await recordStep(inputs.jobId, "storing", "store", { videoUrl: storedUrl });
  if (!recorded) {
    return { step: "store", status: "failed", error: "Failed to record store step" };
  }
  return { step: "store", status: "success", data: { storedUrl } };
}

export async function linkStep(
  inputs: VideoWorkflowInputs,
  videoUrl: string,
  model: string
): Promise<VideoStepResult> {
  "use step";
  const supabase = adminDb();
  const { data: assetRow, error: assetErr } = await supabase
    .from("assets")
    .insert({
      owner_id: inputs.userId,
      kind: "video",
      storage_bucket: "arcanea-media-private",
      object_key: videoUrl,
      duration_seconds: inputs.duration || 5,
      model_id: model,
      prompt: inputs.prompt,
      job_id: inputs.jobId,
      visibility: "private",
      moderation_status: "pending",
    })
    .select("id")
    .single();

  if (assetErr) {
    await recordStep(inputs.jobId, "failed", "link", undefined, assetErr.message);
    return { step: "link", status: "failed", error: assetErr.message };
  }

  const assetId = (assetRow?.id as string) || `asset_${inputs.jobId}`;
  const { error: updateErr } = await supabase
    .from("generation_jobs")
    .update({
      status: "completed",
      asset_id: assetId,
      video_url: videoUrl,
      model,
      updated_at: new Date().toISOString(),
    })
    .eq("id", inputs.jobId);

  if (updateErr) {
    return { step: "link", status: "failed", error: updateErr.message };
  }

  const reference = `${inputs.userId}:${inputs.requestKey}`;
  const cost = (inputs.duration || 5) * 15;
  await supabase.rpc("billing_settle_reservation", {
    p_user: inputs.userId,
    p_reference: reference,
    p_actual: cost,
    p_metadata: { jobId: inputs.jobId, assetId },
  });

  const recorded = await recordStep(inputs.jobId, "completed", "link", { assetId });
  if (!recorded) {
    return { step: "link", status: "failed", error: "Failed to record link completion" };
  }
  return { step: "link", status: "success", data: { assetId } };
}

export async function notifyStep(
  inputs: VideoWorkflowInputs,
  status: "completed" | "failed",
  extra?: Record<string, unknown>
): Promise<VideoStepResult> {
  "use step";
  await recordStep(inputs.jobId, status, "notify", extra);
  return { step: "notify", status: "success", data: { notified: true, jobStatus: status, ...extra } };
}

export async function refundStep(
  inputs: VideoWorkflowInputs,
  debitId: string,
  cost: number,
  reason: string
): Promise<VideoStepResult> {
  "use step";
  const supabase = adminDb();
  const reference = `${inputs.userId}:${inputs.requestKey}`;
  await supabase.rpc("billing_request_release", {
    p_user: inputs.userId,
    p_reference: reference,
  });
  const { error: releaseErr } = await supabase.rpc("billing_release_reservation", {
    p_user: inputs.userId,
    p_reference: reference,
    p_metadata: { jobId: inputs.jobId, debitId, reason },
  });
  if (releaseErr) {
    await recordStep(inputs.jobId, "failed", "refund_error", { debitId, cost }, releaseErr.message);
    return { step: "refund", status: "failed", error: releaseErr.message };
  }
  const recorded = await recordStep(inputs.jobId, "refunded", "refund", { debitId, cost }, reason);
  if (!recorded) {
    return { step: "refund", status: "failed", error: "Failed to record refund state" };
  }
  return { step: "refund", status: "success", data: { refunded: true, debitId, cost } };
}

export async function runVideoWorkflow(inputs: VideoWorkflowInputs) {
  const cost = (inputs.duration || 5) * 15;
  const admit = await admitStep(inputs);
  if (admit.status === "failed") {
    await notifyStep(inputs, "failed", { error: admit.error });
    return { success: false, error: admit.error };
  }

  const debit = await debitStep(inputs, cost);
  if (debit.status === "failed") {
    await notifyStep(inputs, "failed", { error: debit.error });
    return { success: false, error: debit.error };
  }

  const debitId = (debit.data?.debitId as string) || `debit_${inputs.jobId}_${inputs.requestKey}`;

  try {
    const gen = await generateStep(inputs);
    if (gen.status === "failed") {
      await refundStep(inputs, debitId, cost, gen.error || "Generation failed");
      await notifyStep(inputs, "failed", { error: gen.error });
      return { success: false, error: gen.error };
    }

    const rawVideoUrl = gen.data?.videoUrl as string;
    const model = gen.data?.model as string;

    const store = await storeStep(inputs, rawVideoUrl);
    if (store.status === "failed") {
      await refundStep(inputs, debitId, cost, store.error || "Store failed");
      await notifyStep(inputs, "failed", { error: store.error });
      return { success: false, error: store.error };
    }

    const storedVideoUrl = (store.data?.storedUrl as string) || rawVideoUrl;

    const link = await linkStep(inputs, storedVideoUrl, model);
    if (link.status === "failed") {
      await refundStep(inputs, debitId, cost, link.error || "Link failed");
      await notifyStep(inputs, "failed", { error: link.error });
      return { success: false, error: link.error };
    }

    await notifyStep(inputs, "completed", { videoUrl: storedVideoUrl, assetId: link.data?.assetId });
    return { success: true, jobId: inputs.jobId, videoUrl: storedVideoUrl, assetId: link.data?.assetId };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unhandled workflow error";
    await refundStep(inputs, debitId, cost, errMsg);
    await notifyStep(inputs, "failed", { error: errMsg });
    return { success: false, error: errMsg };
  }
}
