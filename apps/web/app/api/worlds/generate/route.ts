import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { APICallError, NoObjectGeneratedError, generateText, Output } from "ai";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { withAbortDeadline } from "@/lib/async-deadline";
import { extractCustomerKeys } from "@/lib/gateway/credential-policy.mjs";
import { draftResult } from "@/lib/worlds/draft";
import {
  WORLD_MODEL,
  WORLD_FORGE_PROMPT,
  worldGenerationSchema,
  worldGenerationRequestSchema,
  readWorldRequest,
} from "@/lib/worlds/generation";

export const runtime = "nodejs";
export const maxDuration = 60;
const privateHeaders = { "Cache-Control": "private, no-store, no-transform" };
const reply = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: privateHeaders });

export async function POST(req: NextRequest) {
  // Cookies authorize the account; the customer key authorizes only this model request.
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin)
    return reply({ error: "Create the draft from this Arcanea page." }, 403);
  try {
    const db = await createClient();
    const { data, error } = await withAbortDeadline(
      "world authentication",
      4500,
      () => db.auth.getUser(),
    );
    if (error || !data.user)
      return reply({ error: "Sign in to create a world draft." }, 401);
  } catch {
    return reply(
      { error: "Your session could not be checked. Try again." },
      503,
    );
  }
  let key: string | undefined;
  try {
    key = extractCustomerKeys(req.headers).google;
  } catch {
    return reply({ error: "Check your Gemini API key." }, 400);
  }
  if (!key)
    return reply({ error: "Add your Gemini API key to create a draft." }, 402);
  let input;
  try {
    const body = await readWorldRequest(req);
    input = worldGenerationRequestSchema.safeParse(JSON.parse(body));
  } catch (error) {
    return reply(
      { error: "The world request is invalid or too large." },
      error instanceof RangeError ? 413 : 400,
    );
  }
  if (!input.success)
    return reply(
      {
        error: "Use a concept of 5 to 500 characters and a listed refinement.",
      },
      400,
    );
  if (req.signal.aborted)
    return reply(
      { error: "Generation was cancelled. Your concept is unchanged." },
      408,
    );
  try {
    const google = createGoogleGenerativeAI({ apiKey: key });
    const result = await generateText({
      model: google(WORLD_MODEL),
      system: WORLD_FORGE_PROMPT,
      prompt: JSON.stringify(input.data),
      output: Output.object({ schema: worldGenerationSchema }),
      temperature: 0.9,
      maxOutputTokens: 6000,
      maxRetries: 0,
      abortSignal: AbortSignal.any([req.signal, AbortSignal.timeout(45000)]),
      providerOptions: {
        google: {
          thinkingConfig: { thinkingBudget: 0, includeThoughts: false },
        },
      },
    });
    const parsed = worldGenerationSchema.safeParse(result.output);
    if (!parsed.success)
      return reply(
        {
          error:
            "The draft was incomplete. Your concept is unchanged; retry when ready.",
        },
        502,
      );
    return reply(draftResult(parsed.data, randomUUID()));
  } catch (error) {
    // Upstream errors can contain the credential and full creator prompt.
    if (APICallError.isInstance(error)) {
      const providerStatus = error.statusCode;
      const code =
        providerStatus === 429
          ? "PROVIDER_QUOTA"
          : providerStatus === 401 || providerStatus === 403
            ? "PROVIDER_ACCESS"
            : providerStatus === 404
              ? "MODEL_UNAVAILABLE"
              : providerStatus === 400
                ? "PROVIDER_REQUEST"
                : "PROVIDER_UNAVAILABLE";
      const message =
        code === "PROVIDER_QUOTA"
          ? "Gemini quota is unavailable. Check your Google quota before trying again."
          : code === "PROVIDER_ACCESS"
            ? "Google refused this key's access. Check its Gemini API permissions."
            : code === "MODEL_UNAVAILABLE"
              ? "This Gemini model is unavailable to your key. Your concept is unchanged."
              : code === "PROVIDER_REQUEST"
                ? "Google rejected the generation request. Your concept is unchanged."
                : "Gemini is unavailable. Your concept is unchanged; try again later.";
      return reply(
        {
          error: message,
          code,
          ...(Number.isInteger(providerStatus) &&
          providerStatus! >= 400 &&
          providerStatus! <= 599
            ? { providerStatus }
            : {}),
        },
        502,
      );
    }
    if (NoObjectGeneratedError.isInstance(error))
      return reply(
        {
          error:
            "Gemini did not return a complete valid draft. Your concept is unchanged.",
          code:
            error.finishReason === "length" ? "OUTPUT_LIMIT" : "OUTPUT_INVALID",
        },
        502,
      );
    return reply(
      {
        error:
          "Generation did not finish. Check your key and quota, then retry. Your concept is unchanged.",
        code: "GENERATION_FAILED",
      },
      502,
    );
  }
}
