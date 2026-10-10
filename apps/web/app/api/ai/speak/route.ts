import { NextRequest } from "next/server";
import {
  getClientIdentifier,
  checkRateLimit,
} from "@/lib/rate-limit/rate-limiter";
import {
  privateAudio,
  voiceCredentials,
  voiceFailure,
  voiceJson,
  VoiceRequestError,
} from "@/lib/voice/route-utils";

export const runtime = "edge";
export const maxDuration = 30;
const RATE_LIMIT = { maxRequests: 10, windowMs: 60_000 };
const VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] as const;
type Voice = (typeof VOICES)[number];
const PERSONA_MAP: Record<
  string,
  { voice: Voice; model: "tts-1" | "tts-1-hd" }
> = {
  jarvis: { voice: "onyx", model: "tts-1-hd" }, // Deep, unhurried
  lumina: { voice: "nova", model: "tts-1-hd" }, // Warm, clear, authoritative
  arcanea: { voice: "nova", model: "tts-1-hd" }, // Default Arcanea voice
  lyssandria: { voice: "shimmer", model: "tts-1" }, // Grounded, earthy
  leyla: { voice: "nova", model: "tts-1" }, // Fluid, creative
  draconia: { voice: "onyx", model: "tts-1" }, // Deep, powerful
  maylinn: { voice: "fable", model: "tts-1" }, // Gentle, warm
  alera: { voice: "alloy", model: "tts-1-hd" }, // Clear, resonant
  lyria: { voice: "shimmer", model: "tts-1-hd" }, // Mystical, ethereal
  aiyami: { voice: "echo", model: "tts-1-hd" }, // Wise, enlightened
  elara: { voice: "fable", model: "tts-1-hd" }, // Transformative
  ino: { voice: "alloy", model: "tts-1" }, // Collaborative, warm
  shinkami: { voice: "echo", model: "tts-1-hd" }, // Transcendent, gravitas
  nero: { voice: "onyx", model: "tts-1-hd" }, // Deep, primordial
  coach: { voice: "alloy", model: "tts-1" }, // Professional, clear
};

// Supported Orpheus voices: https://console.groq.com/docs/text-to-speech/orpheus.
const GROQ_PERSONA_MAP: Record<string, string> = {
  jarvis: "troy",
  lumina: "diana",
  arcanea: "diana",
  lyssandria: "hannah",
  leyla: "autumn",
  draconia: "daniel",
  maylinn: "hannah",
  alera: "austin",
  lyria: "autumn",
  aiyami: "troy",
  elara: "diana",
  ino: "austin",
  shinkami: "daniel",
  nero: "troy",
  coach: "austin",
};

/** Customer-key speech; never truncate the submitted text to fit a provider. */
export async function POST(req: NextRequest) {
  try {
    const keys = voiceCredentials(req);
    const limit = checkRateLimit(
      `voice:speak:${getClientIdentifier(req)}`,
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
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      throw new VoiceRequestError("Invalid speech request.", 400);
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new VoiceRequestError("Invalid speech request.", 400);
    const { text, voice, model, persona, speed } = body as Record<
      string,
      unknown
    >;
    if (typeof text !== "string" || !text.trim())
      throw new VoiceRequestError("Text is required.", 400);
    if (text.length > 4096)
      throw new VoiceRequestError(
        "Speech text exceeds 4096 characters. Choose a shorter passage.",
        400,
      );
    if (
      (persona !== undefined && typeof persona !== "string") ||
      (voice !== undefined && typeof voice !== "string") ||
      (speed !== undefined &&
        (typeof speed !== "number" || !Number.isFinite(speed))) ||
      (model !== undefined && model !== "tts-1" && model !== "tts-1-hd")
    )
      throw new VoiceRequestError("Invalid speech options.", 400);
    const personaId =
      typeof persona === "string" ? persona.toLowerCase() : "default";
    if (personaId !== "default" && !Object.hasOwn(PERSONA_MAP, personaId))
      throw new VoiceRequestError("Choose an available voice persona.", 400);
    const personaConfig = PERSONA_MAP[personaId];
    const resolvedVoice = personaConfig?.voice || voice || "nova";
    if (!VOICES.includes(resolvedVoice as Voice))
      throw new VoiceRequestError("Choose an available speech voice.", 400);
    const resolvedModel =
      personaConfig?.model || (model === "tts-1-hd" ? "tts-1-hd" : "tts-1");
    const resolvedSpeed =
      typeof speed === "number" ? Math.min(4, Math.max(0.25, speed)) : 1;
    // Groq documents a 200-character limit. A supplied OpenAI key preserves longer text.
    if (text.length > 200 && !keys.openai)
      throw new VoiceRequestError(
        "Groq speech supports up to 200 characters. Connect OpenAI in Settings → Providers for longer passages.",
        400,
        "byok",
      );
    const signal = AbortSignal.any([req.signal, AbortSignal.timeout(20_000)]);
    let lastStatus: number | undefined;
    for (const provider of ["groq", "openai"] as const) {
      const key = keys[provider];
      if (!key || (provider === "groq" && text.length > 200)) continue;
      if (signal.aborted)
        throw new VoiceRequestError(
          "Voice request cancelled or timed out. Try again when ready.",
          408,
        );
      const providerVoice =
        provider === "groq"
          ? GROQ_PERSONA_MAP[personaId] || "troy"
          : String(resolvedVoice);
      const providerModel =
        provider === "groq" ? "canopylabs/orpheus-v1-english" : resolvedModel;
      try {
        const response = await fetch(
          provider === "groq"
            ? "https://api.groq.com/openai/v1/audio/speech"
            : "https://api.openai.com/v1/audio/speech",
          {
            method: "POST",
            signal,
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: providerModel,
              voice: providerVoice,
              input: text,
              response_format: provider === "groq" ? "wav" : "mp3",
              ...(provider === "openai" ? { speed: resolvedSpeed } : {}),
            }),
          },
        );
        lastStatus = response.status;
        if (response.ok)
          return privateAudio(response, {
            "Content-Type": provider === "groq" ? "audio/wav" : "audio/mpeg",
            "X-Voice": providerVoice,
            "X-Model": providerModel,
            "X-Provider": provider,
            "X-Persona": personaId,
          });
        await response.body?.cancel();
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
