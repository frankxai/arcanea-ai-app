import { NextRequest } from "next/server";
import {
  getClientIdentifier,
  checkRateLimit,
} from "@/lib/rate-limit/rate-limiter";
import {
  voiceCredentials,
  voiceFailure,
  voiceJson,
  VoiceRequestError,
} from "@/lib/voice/route-utils";

export const runtime = "edge";
export const maxDuration = 30;
const RATE_LIMIT = { maxRequests: 5, windowMs: 60_000 };

/** Customer-key transcription; a second supplied key permits provider fallback. */
export async function POST(req: NextRequest) {
  try {
    const keys = voiceCredentials(req);
    const limit = checkRateLimit(
      `voice:transcribe:${getClientIdentifier(req)}`,
      RATE_LIMIT,
    );
    if (!limit.allowed)
      return voiceJson(
        { error: "Rate limit exceeded. Try again in a minute.", cta: "retry" },
        429,
        {
          "Retry-After": String(
            Math.ceil((limit.resetTime - Date.now()) / 1000),
          ),
        },
      );
    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      throw new VoiceRequestError("Invalid audio upload.", 400);
    }
    const audio = form.get("audio");
    if (!(audio instanceof Blob) || !audio.size)
      throw new VoiceRequestError("Provide a non-empty audio file.", 400);
    if (audio.size > 25 * 1024 * 1024)
      throw new VoiceRequestError("Audio file too large (max 25MB).", 400);
    const signal = AbortSignal.any([req.signal, AbortSignal.timeout(20_000)]);
    let lastStatus: number | undefined;
    for (const provider of ["groq", "openai"] as const) {
      const key = keys[provider];
      if (!key) continue;
      if (signal.aborted)
        throw new VoiceRequestError(
          "Voice request cancelled or timed out. Try again when ready.",
          408,
        );
      const upstreamForm = new FormData();
      upstreamForm.append("file", audio, audio.name || "audio.webm");
      upstreamForm.append(
        "model",
        provider === "groq" ? "whisper-large-v3-turbo" : "whisper-1",
      );
      upstreamForm.append("response_format", "json");
      try {
        const response = await fetch(
          provider === "groq"
            ? "https://api.groq.com/openai/v1/audio/transcriptions"
            : "https://api.openai.com/v1/audio/transcriptions",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${key}` },
            body: upstreamForm,
            signal,
          },
        );
        lastStatus = response.status;
        if (response.ok) {
          const data: unknown = await response.json();
          if (
            data &&
            typeof data === "object" &&
            "text" in data &&
            typeof data.text === "string"
          )
            return voiceJson({
              text: data.text,
              ...("language" in data && typeof data.language === "string"
                ? { language: data.language }
                : {}),
              provider,
            });
          lastStatus = 502;
        } else await response.body?.cancel();
      } catch {
        if (signal.aborted)
          throw new VoiceRequestError(
            "Voice request cancelled or timed out. Try again when ready.",
            408,
          );
        lastStatus = undefined;
      }
    }
    return voiceFailure(undefined, lastStatus);
  } catch (error) {
    return voiceFailure(error);
  }
}
