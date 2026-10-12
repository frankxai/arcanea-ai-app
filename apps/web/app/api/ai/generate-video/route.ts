import { NextRequest, NextResponse, after } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { runVideoWorkflow } from "@/lib/imagine/video-workflow";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createAdminClient();
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const { prompt, duration = 5, operation = "text-to-video", imageUrl, requestKey } = body || {};
    if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    if (operation === "image-to-video" && !imageUrl) {
      return NextResponse.json({ error: "Image URL is required for image-to-video" }, { status: 400 });
    }

    const key = requestKey || `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const model = operation === "image-to-video" ? "alibaba/wan-v2.6-i2v-flash" : "google/veo-3.1-generate-001";

    const { data: job, error: jobError } = await supabase
      .from("generation_jobs")
      .insert({ user_id: user.id, kind: "video", model, inputs: { prompt, duration, operation, imageUrl, requestKey: key }, status: "queued", cost: duration * 15 })
      .select("id, status").single();

    if (jobError || !job) return NextResponse.json({ error: jobError?.message || "Failed to create job" }, { status: 500 });

    after(async () => {
      try { await runVideoWorkflow({ jobId: job.id, userId: user.id, prompt, operation, imageUrl, duration, requestKey: key }); } catch {}
    });

    return NextResponse.json({ success: true, jobId: job.id, status: job.status, message: "Video generation workflow started." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const jobId = new URL(req.url).searchParams.get("jobId");
    if (!jobId) return NextResponse.json({ error: "Job ID is required" }, { status: 400 });

    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createAdminClient();
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { data: job, error } = await supabase.from("generation_jobs").select("*").eq("id", jobId).eq("user_id", user.id).single();
    if (error || !job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    return NextResponse.json({ jobId: job.id, status: job.status, model: job.model, steps: job.steps, videoUrl: job.video_url, assetId: job.asset_id, error: job.error, cost: job.cost, createdAt: job.created_at, updatedAt: job.updated_at });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
