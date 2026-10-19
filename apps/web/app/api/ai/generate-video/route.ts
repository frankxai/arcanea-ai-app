import { NextRequest, NextResponse, after } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { runVideoWorkflow, notifyStep, refundStep } from "@/lib/imagine/video-workflow";
import { isHttpsImageUrl } from "@/lib/imagine/video-admission";
import { getModel } from "@/lib/models/registry";

export const runtime = "nodejs";
export const maxDuration = 300;

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

type GenerationJobsQuery = {
  from: (table: string) => {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: string) => {
          maybeSingle: () => PromiseLike<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
          single: () => PromiseLike<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
        };
      };
    };
    insert: (row: Record<string, unknown>) => {
      select: (cols: string) => {
        single: () => PromiseLike<{ data: { id: string; status: string } | null; error: { message: string; code?: string } | null }>;
      };
    };
  };
};

async function authenticateRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim();
    if (!token) return null;
    const admin = createAdminClient();
    const {
      data: { user },
      error,
    } = await admin.auth.getUser(token);
    if (error || !user) return null;
    return user;
  }

  const userClient = await createClient();
  const {
    data: { user },
    error,
  } = await userClient.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      prompt,
      duration = 5,
      operation = "text-to-video",
      imageUrl,
      requestKey,
    } = body || {};

    if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 2000) {
      return NextResponse.json({ error: "A valid prompt (up to 2000 characters) is required" }, { status: 400 });
    }
    if (!Number.isInteger(duration) || duration < 3 || duration > 30) {
      return NextResponse.json({ error: "Duration must be an integer between 3 and 30 seconds" }, { status: 400 });
    }
    if (operation !== "text-to-video" && operation !== "image-to-video") {
      return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
    }
    if (operation === "image-to-video") {
      if (!imageUrl) {
        return NextResponse.json({ error: "Image URL is required for image-to-video" }, { status: 400 });
      }
      if (!isHttpsImageUrl(imageUrl)) {
        return NextResponse.json({ error: "Valid HTTPS image URL is required for image-to-video" }, { status: 400 });
      }
    }

    const key =
      typeof requestKey === "string" && requestKey.trim().length > 0 && requestKey.trim().length <= 128
        ? requestKey.trim()
        : `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const supabase = createAdminClient();
    const db = supabase as unknown as GenerationJobsQuery;

    // Idempotency check: return existing job if same (user_id, request_key) was already submitted
    const { data: existingJob } = await db
      .from("generation_jobs")
      .select("*")
      .eq("user_id", user.id)
      .eq("request_key", key)
      .maybeSingle();

    if (existingJob && typeof existingJob.id === "string") {
      return NextResponse.json({
        success: true,
        idempotent: true,
        jobId: existingJob.id,
        status: existingJob.status,
        videoUrl: existingJob.video_url,
        assetId: existingJob.asset_id,
        message: "Returning existing video generation workflow.",
      });
    }

    // Per-user rate limiting (5 new video jobs per hour)
    const now = Date.now();
    const userLimit = rateLimits.get(user.id);
    if (userLimit && now < userLimit.resetAt) {
      if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json(
          { error: "Video generation rate limit exceeded. Maximum 5 videos per hour." },
          { status: 429 }
        );
      }
      userLimit.count++;
    } else {
      rateLimits.set(user.id, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    }

    const modelConfig = getModel(operation === "image-to-video" ? "wan-2.5" : "veo-3.1");
    const model =
      modelConfig?.gatewayId ||
      (operation === "image-to-video" ? "alibaba/wan-2.5-i2v-720p" : "google/veo-3.1-generate-001");
    const cost = duration * 15;

    const { data: job, error: jobError } = await db
      .from("generation_jobs")
      .insert({
        user_id: user.id,
        request_key: key,
        kind: "video",
        model,
        inputs: { prompt, duration, operation, imageUrl, requestKey: key },
        status: "queued",
        cost,
      })
      .select("id, status")
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: jobError?.message || "Failed to create job" }, { status: 500 });
    }

    const workflowInputs = {
      jobId: job.id,
      userId: user.id,
      prompt,
      operation: operation as "text-to-video" | "image-to-video",
      imageUrl,
      duration,
      requestKey: key,
    };

    after(async () => {
      try {
        await runVideoWorkflow(workflowInputs);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unhandled background workflow error";
        try {
          await refundStep(workflowInputs, `debit_${job.id}_${key}`, cost, msg);
          await notifyStep(workflowInputs, "failed", { error: msg });
        } catch {}
      }
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      requestKey: key,
      status: job.status,
      message: "Video generation workflow started.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const jobId = new URL(req.url).searchParams.get("jobId");
    if (!jobId) return NextResponse.json({ error: "Job ID is required" }, { status: 400 });

    const user = await authenticateRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createAdminClient();
    const db = supabase as unknown as GenerationJobsQuery;
    const { data: job, error } = await db
      .from("generation_jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .single();
    if (error || !job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    return NextResponse.json({
      jobId: job.id,
      requestKey: job.request_key,
      status: job.status,
      model: job.model,
      steps: job.steps,
      videoUrl: job.video_url,
      assetId: job.asset_id,
      error: job.error,
      cost: job.cost,
      createdAt: job.created_at,
      updatedAt: job.updated_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
