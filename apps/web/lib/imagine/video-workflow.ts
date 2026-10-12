"use workflow";

import { google } from "@ai-sdk/google";
import { experimental_generateVideo } from "ai";
import { createAdminClient } from "../supabase/server";

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

function getVideoUrl(file: unknown): string {
  if (!file || typeof file !== "object") return "";
  const obj = file as Record<string, unknown>;
  if (typeof obj.url === "string" && obj.url) return obj.url;
  if (typeof obj.base64 === "string" && obj.base64) {
    return `data:${(typeof obj.mediaType === "string" && obj.mediaType) || "video/mp4"};base64,${obj.base64}`;
  }
  return "";
}

async function recordStep(jobId: string, status: string, stepName: string, data?: Record<string, unknown>, error?: string) {
  try {
    const supabase = createAdminClient();
    const { data: currentJob } = await supabase.from("generation_jobs").select("steps").eq("id", jobId).single();
    const existingSteps = (currentJob?.steps as Array<Record<string, unknown>>) || [];
    const newStep = { step: stepName, timestamp: new Date().toISOString(), status: error ? "failed" : "completed", ...(data || {}), ...(error ? { error } : {}) };
    await supabase.from("generation_jobs").update({ status, steps: [...existingSteps, newStep], ...(error ? { error } : {}), updated_at: new Date().toISOString() }).eq("id", jobId);
  } catch {}
}

export async function admitStep(inputs: VideoWorkflowInputs): Promise<VideoStepResult> {
  "use step";
  if (!inputs.userId || !inputs.prompt || !inputs.jobId) return { step: "admit", status: "failed", error: "Invalid workflow inputs" };
  if (inputs.operation === "image-to-video" && !inputs.imageUrl) return { step: "admit", status: "failed", error: "Image URL required for image-to-video" };
  await recordStep(inputs.jobId, "admitted", "admit");
  return { step: "admit", status: "success" };
}

export async function debitStep(inputs: VideoWorkflowInputs, cost: number): Promise<VideoStepResult> {
  "use step";
  const debitId = `debit_${inputs.jobId}_${inputs.requestKey}`;
  await recordStep(inputs.jobId, "debited", "debit", { debitId, cost });
  return { step: "debit", status: "success", data: { debitId, cost } };
}

export async function generateStep(inputs: VideoWorkflowInputs): Promise<VideoStepResult> {
  "use step";
  const isI2V = inputs.operation === "image-to-video";
  const primaryModelId = isI2V ? "wan-v2.6-i2v-flash" : "veo-3.1-generate-001";
  await recordStep(inputs.jobId, "generating", "generate_start", { model: primaryModelId });

  try {
    const res = await experimental_generateVideo({
      model: google(primaryModelId), prompt: inputs.prompt,
      ...(isI2V && inputs.imageUrl ? { prompt: { text: inputs.prompt, image: inputs.imageUrl } } : {}),
      ...(inputs.duration ? { duration: inputs.duration } : {}),
    });
    const url = getVideoUrl(res.video);
    if (url) {
      await recordStep(inputs.jobId, "generating", "generate_complete", { model: primaryModelId, url });
      return { step: "generate", status: "success", data: { videoUrl: url, model: primaryModelId } };
    }
  } catch (err) {
    console.warn(`Primary model ${primaryModelId} failed, trying fallback:`, err);
  }

  try {
    const fbRes = await experimental_generateVideo({ model: google("veo-3.1-generate-001"), prompt: inputs.prompt });
    const fbUrl = getVideoUrl(fbRes.video);
    if (fbUrl) {
      await recordStep(inputs.jobId, "generating", "generate_complete", { model: "veo-3.1-generate-001", url: fbUrl });
      return { step: "generate", status: "success", data: { videoUrl: fbUrl, model: "veo-3.1-generate-001" } };
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
  await recordStep(inputs.jobId, "storing", "store", { videoUrl });
  return { step: "store", status: "success", data: { storedUrl: videoUrl } };
}

export async function linkStep(inputs: VideoWorkflowInputs, videoUrl: string, model: string): Promise<VideoStepResult> {
  "use step";
  const assetId = `asset_${inputs.jobId}`;
  const supabase = createAdminClient();
  await supabase.from("generation_jobs").update({ status: "completed", asset_id: assetId, video_url: videoUrl, model, updated_at: new Date().toISOString() }).eq("id", inputs.jobId);
  await recordStep(inputs.jobId, "completed", "link", { assetId });
  return { step: "link", status: "success", data: { assetId } };
}

export async function notifyStep(inputs: VideoWorkflowInputs, status: "completed" | "failed", extra?: Record<string, unknown>): Promise<VideoStepResult> {
  "use step";
  await recordStep(inputs.jobId, status, "notify", extra);
  return { step: "notify", status: "success", data: { notified: true, jobStatus: status, ...extra } };
}

export async function refundStep(inputs: VideoWorkflowInputs, debitId: string, cost: number, reason: string): Promise<VideoStepResult> {
  "use step";
  await recordStep(inputs.jobId, "refunded", "refund", { debitId, cost }, reason);
  return { step: "refund", status: "success", data: { refunded: true, debitId, cost } };
}

export async function runVideoWorkflow(inputs: VideoWorkflowInputs) {
  const cost = (inputs.duration || 5) * 15;
  const admit = await admitStep(inputs);
  if (admit.status === "failed") { await notifyStep(inputs, "failed", { error: admit.error }); return { success: false, error: admit.error }; }

  const debit = await debitStep(inputs, cost);
  if (debit.status === "failed") { await notifyStep(inputs, "failed", { error: debit.error }); return { success: false, error: debit.error }; }

  const debitId = (debit.data?.debitId as string) || `debit_${inputs.jobId}`;

  const gen = await generateStep(inputs);
  if (gen.status === "failed") {
    await refundStep(inputs, debitId, cost, gen.error || "Generation failed");
    await notifyStep(inputs, "failed", { error: gen.error });
    return { success: false, error: gen.error };
  }

  const videoUrl = gen.data?.videoUrl as string;
  const model = gen.data?.model as string;

  const store = await storeStep(inputs, videoUrl);
  if (store.status === "failed") {
    await refundStep(inputs, debitId, cost, store.error || "Store failed");
    await notifyStep(inputs, "failed", { error: store.error });
    return { success: false, error: store.error };
  }

  const link = await linkStep(inputs, videoUrl, model);
  if (link.status === "failed") {
    await refundStep(inputs, debitId, cost, link.error || "Link failed");
    await notifyStep(inputs, "failed", { error: link.error });
    return { success: false, error: link.error };
  }

  await notifyStep(inputs, "completed", { videoUrl, assetId: link.data?.assetId });
  return { success: true, jobId: inputs.jobId, videoUrl, assetId: link.data?.assetId };
}
