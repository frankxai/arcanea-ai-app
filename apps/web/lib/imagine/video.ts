import { OperationPendingError } from "../billing/operations";
import { isHttpsImageUrl } from "./video-admission";

export type VideoResult = {
  videoUrl: string;
  provider: "grok-video" | "fal-ai";
};
export type VideoJob = {
  provider: VideoResult["provider"];
  requestId: string;
  statusUrl: string;
  resultUrl: string | null;
};
export const videoProvider = (env: Record<string, string | undefined>) =>
  env.XAI_API_KEY ? "grok-video" : env.FAL_KEY ? "fal-ai" : null;
const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function jobFrom(value: unknown, reference: string): VideoJob {
  const pending = () => new OperationPendingError(reference);
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw pending();
  const job = value as VideoJob;
  if (
    !["grok-video", "fal-ai"].includes(job.provider) ||
    typeof job.requestId !== "string" ||
    !/^[a-z0-9-]{1,128}$/i.test(job.requestId)
  )
    throw pending();
  if (job.provider === "grok-video")
    return {
      provider: job.provider,
      requestId: job.requestId,
      statusUrl: "https://api.x.ai/v1/videos/" + job.requestId,
      resultUrl: null,
    };
  const trusted = (value: unknown, status: boolean) => {
    if (typeof value !== "string") throw pending();
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw pending();
    }
    const suffix = "/requests/" + job.requestId + (status ? "/status" : "");
    if (
      url.origin !== "https://queue.fal.run" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !url.pathname.startsWith("/fal-ai/kling-video/") ||
      !(
        url.pathname.endsWith(suffix) ||
        (!status && url.pathname.endsWith(suffix + "/response"))
      )
    )
      throw pending();
    return url.href;
  };
  return {
    ...job,
    statusUrl: trusted(job.statusUrl, true),
    resultUrl: trusted(job.resultUrl, false),
  };
}

function requester(
  provider: VideoJob["provider"],
  reference: string,
  env: Record<string, string | undefined>,
  transport: typeof fetch,
) {
  const key = provider === "grok-video" ? env.XAI_API_KEY : env.FAL_KEY;
  if (!key) throw new OperationPendingError(reference);
  const authorization = (provider === "grok-video" ? "Bearer " : "Key ") + key;
  const deadline = Date.now() + 90_000;
  return async (url: string, body?: Record<string, unknown>) => {
    const left = deadline - Date.now();
    if (left <= 0) throw new OperationPendingError(reference);
    try {
      return await transport(url, {
        method: body ? "POST" : "GET",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
        },
        body: body && JSON.stringify(body),
        signal: AbortSignal.timeout(Math.min(15_000, left)),
        redirect: "error",
        cache: "no-store",
      });
    } catch {
      throw new OperationPendingError(reference);
    }
  };
}

/** Recovery only polls the recorded job; it has no paid submission path. */
export async function resumeVideo(
  value: unknown,
  reference: string,
  env: Record<string, string | undefined> = process.env,
  transport: typeof fetch = fetch,
  wait: (ms: number) => Promise<void> = sleep,
): Promise<VideoResult> {
  const job = jobFrom(value, reference);
  const request = requester(job.provider, reference, env, transport);
  const grok = job.provider === "grok-video";
  for (let i = 0; i < 25; i++) {
    await wait(3000);
    const response = await request(job.statusUrl);
    if (!response.ok) continue;
    const status = await response.json().catch(() => null);
    if (!status) throw new OperationPendingError(reference);
    if (
      (grok && ["failed", "error"].includes(status.status)) ||
      (!grok &&
        (status.status === "FAILED" ||
          (status.status === "COMPLETED" && status.error)))
    )
      throw Error("The video provider confirmed that generation failed.");
    if (
      (grok && status.status === "done") ||
      (!grok && status.status === "COMPLETED")
    ) {
      let result = status;
      if (!grok) {
        const response = await request(job.resultUrl!);
        if (!response.ok) throw new OperationPendingError(reference);
        result = await response.json().catch(() => null);
      }
      if (!isHttpsImageUrl(result?.video?.url))
        throw new OperationPendingError(reference);
      return { videoUrl: result.video.url, provider: job.provider };
    }
  }
  throw new OperationPendingError(reference);
}

/** Persist the accepted job before polling; unknown outcomes never start a fallback. */
export async function generateVideo(
  imageUrl: string,
  prompt: string,
  reference: string,
  checkpoint: (job: VideoJob) => Promise<void>,
  env: Record<string, string | undefined> = process.env,
  transport: typeof fetch = fetch,
  wait: (ms: number) => Promise<void> = sleep,
): Promise<VideoResult> {
  const provider = videoProvider(env);
  if (!provider) throw Error("Video generation is unavailable.");
  const grok = provider === "grok-video";
  const request = requester(provider, reference, env, transport);
  const motion =
    prompt ||
    "Cinematic camera movement, slow dolly in, atmospheric lighting, subtle motion";
  const start = await request(
    grok
      ? "https://api.x.ai/v1/videos/generations"
      : "https://queue.fal.run/fal-ai/kling-video/v1/standard/image-to-video",
    grok
      ? {
          model: "grok-imagine-video",
          prompt: motion,
          image_url: imageUrl,
          duration: 5,
          aspect_ratio: "1:1",
          resolution: "720p",
        }
      : {
          prompt: motion,
          image_url: imageUrl,
          duration: "5",
          aspect_ratio: "1:1",
        },
  );
  if (!start.ok) {
    if ([400, 401, 403, 404, 422, 429].includes(start.status))
      throw Error("The video provider refused this request.");
    throw new OperationPendingError(reference);
  }
  const submitted = await start.json().catch(() => null);
  const job = jobFrom(
    {
      provider,
      requestId: submitted?.request_id,
      statusUrl: submitted?.status_url,
      resultUrl: submitted?.response_url,
    },
    reference,
  );
  try {
    await checkpoint(job);
  } catch {
    throw new OperationPendingError(reference);
  }
  return resumeVideo(job, reference, env, transport, wait);
}
