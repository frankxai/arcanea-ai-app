/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * browser-voice.ts
 * Direct browser-side calls to Groq + ElevenLabs APIs for BYOK mode.
 * SSR-safe: all localStorage access guarded by typeof window check.
 */

// ---------------------------------------------------------------------------
// Key storage
// ---------------------------------------------------------------------------

import {
  readProviderPreferences,
  providerStorageNames,
  parseProviderKeys,
  type ProviderActor,
} from "@/lib/ai/provider-preferences";

export interface StoredKeys {
  groq?: string;
  eleven?: string;
}

export function getStoredKeys(actor: ProviderActor): StoredKeys {
  if (typeof window === "undefined" || !actor) return {};
  const keys = readProviderPreferences(localStorage, actor).keys;
  const groq = keys.groq;
  const eleven = keys.elevenlabs;
  return { groq: groq || undefined, eleven: eleven || undefined };
}

export function setStoredKeys(k: StoredKeys, actor: ProviderActor): void {
  if (typeof window === "undefined") return;
  const names = providerStorageNames(actor);
  if (!names) throw new Error("Wait for your account before saving keys.");
  const keys = readProviderPreferences(localStorage, actor).keys;
  localStorage.setItem(
    names.keys,
    JSON.stringify(
      parseProviderKeys(
        JSON.stringify({
          ...keys,
          groq: k.groq || "",
          elevenlabs: k.eleven || "",
        }),
      ),
    ),
  );
  window.dispatchEvent(new Event("arcanea-model-change"));
}

export function clearStoredKeys(actor: ProviderActor): void {
  setStoredKeys({}, actor);
}

// ---------------------------------------------------------------------------
// Persona → ElevenLabs voice ID map
// ---------------------------------------------------------------------------

export const ELEVEN_VOICES: Record<string, string> = {
  lumina: "pFZP5JQG7iQjIQuC4Bku", // Lily
  alera: "EXAVITQu4vr4xnSDxMaL", // Sarah
  lyria: "pFZP5JQG7iQjIQuC4Bku",
  coach: "EXAVITQu4vr4xnSDxMaL",
  draconia: "onwK4e9ZLuTAKqWW03F9", // Daniel
  shinkami: "onwK4e9ZLuTAKqWW03F9",
  jarvis: "JBFqnCBsd6RMkjVDRZzb", // George
  nero: "onwK4e9ZLuTAKqWW03F9",
};

export function voiceIdForPersona(voiceKey: string): string {
  return ELEVEN_VOICES[voiceKey] ?? ELEVEN_VOICES["lumina"];
}

// ---------------------------------------------------------------------------
// Groq — speech-to-text
// ---------------------------------------------------------------------------

export async function transcribeWithGroq(
  blob: Blob,
  apiKey: string,
): Promise<string> {
  const ext =
    blob.type.includes("mp4") || blob.type.includes("m4a") ? "m4a" : "webm";
  const form = new FormData();
  form.append("file", blob, `mic.${ext}`);
  form.append("model", "whisper-large-v3-turbo");
  form.append("response_format", "text");

  const res = await fetch(
    "https://api.groq.com/openai/v1/audio/transcriptions",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    },
  );

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Groq transcription failed (${res.status}): ${msg}`);
  }

  return res.text();
}

// ---------------------------------------------------------------------------
// Groq — chat completion
// ---------------------------------------------------------------------------

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatWithGroqParams {
  messages: ChatMessage[];
  systemPrompt: string;
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
}

export async function chatWithGroq(
  params: ChatWithGroqParams,
): Promise<string> {
  const {
    messages,
    systemPrompt,
    apiKey,
    temperature = 0.5,
    maxTokens = 240,
  } = params;

  const body = {
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    temperature,
    max_tokens: maxTokens,
    stream: false,
  };

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Groq chat failed (${res.status}): ${msg}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  return data.choices[0].message.content.trim();
}

// ---------------------------------------------------------------------------
// ElevenLabs — text-to-speech
// ---------------------------------------------------------------------------

interface SpeakParams {
  text: string;
  voiceId: string;
  apiKey: string;
  signal?: AbortSignal;
}

export async function speakWithElevenLabs(params: SpeakParams): Promise<Blob> {
  const { text, voiceId, apiKey, signal } = params;

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?output_format=mp3_44100_128`,
    {
      method: "POST",
      signal,
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.75,
          style: 0.35,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`ElevenLabs TTS failed (${res.status}): ${msg}`);
  }

  return res.blob();
}

// ---------------------------------------------------------------------------
// Key verification
// ---------------------------------------------------------------------------

export async function verifyGroqKey(
  apiKey: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    return { ok: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function verifyElevenKey(
  apiKey: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/user", {
      headers: { "xi-api-key": apiKey },
    });
    return { ok: res.ok, error: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
