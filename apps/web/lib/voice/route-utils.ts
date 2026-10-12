import { NextRequest, NextResponse } from "next/server";
import {
  CredentialPolicyError,
  extractCustomerKeys,
} from "@/lib/gateway/credential-policy.mjs";

export const VOICE_HEADERS = {
  "Cache-Control": "private, no-store, no-transform",
  "X-Accel-Buffering": "no",
};

export class VoiceRequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public cta: "byok" | "retry" = "retry",
  ) {
    super(message);
  }
}

export function voiceJson(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) {
  return NextResponse.json(body, {
    status,
    headers: { ...headers, ...VOICE_HEADERS },
  });
}

export function voiceCredentials(req: NextRequest) {
  if (req.signal.aborted)
    throw new VoiceRequestError(
      "Voice request cancelled. Try again when ready.",
      408,
    );
  const keys = extractCustomerKeys(req.headers);
  if (!keys.groq && !keys.openai)
    throw new VoiceRequestError(
      "Connect your Groq or OpenAI key in Settings → Providers to use voice.",
      401,
      "byok",
    );
  return keys;
}

export function voiceFailure(error: unknown, providerStatus?: number) {
  if (
    error instanceof CredentialPolicyError ||
    error instanceof VoiceRequestError
  )
    return voiceJson(
      {
        error: error.message,
        cta: error instanceof VoiceRequestError ? error.cta : "byok",
      },
      error.status,
    );
  if (providerStatus === 401 || providerStatus === 403)
    return voiceJson(
      {
        error:
          "The voice provider rejected your key. Check Settings → Providers.",
        cta: "byok",
      },
      401,
    );
  if (providerStatus === 429)
    return voiceJson(
      {
        error:
          "Your voice provider is rate limiting requests. Try again in a minute.",
        cta: "retry",
      },
      429,
      { "Retry-After": "60" },
    );
  console.error("Voice provider request failed.");
  return voiceJson(
    {
      error:
        "Voice provider request failed. Try again or check your provider settings.",
      cta: "retry",
    },
    502,
  );
}

/** Preserve audio bytes while keeping deferred upstream errors out of diagnostics. */
export function privateAudio(
  response: Response,
  metadata: Record<string, string>,
) {
  const contentType = response.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();
  if (
    contentType &&
    !contentType.startsWith("audio/") &&
    contentType !== "application/octet-stream"
  ) {
    void response.body?.cancel().catch(() => {});
    return voiceFailure(undefined);
  }
  if (!response.body) return voiceFailure(undefined);
  const reader = response.body.getReader();
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          reader.releaseLock();
        } else controller.enqueue(value);
      } catch {
        console.error("Voice provider stream failed.");
        controller.error(new Error("Voice provider request failed."));
        reader.releaseLock();
      }
    },
    async cancel() {
      try {
        await reader.cancel();
      } catch {
        /* The upstream stream may already have failed. */
      } finally {
        reader.releaseLock();
      }
    },
  });
  return new NextResponse(body, { headers: { ...metadata, ...VOICE_HEADERS } });
}
