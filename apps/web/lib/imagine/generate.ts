import { generateImage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { OperationPendingError } from "../billing/operations";
import {
  getModel,
  DEFAULT_IMAGE_MODEL_ID,
  getGatewayFallbackChain,
} from "../models/registry";

export type ImageProvider = "grok" | "openrouter" | "gemini" | "gateway";
export interface ImageGenerationResult {
  images: Array<{ url: string; revisedPrompt?: string }>;
  provider: ImageProvider;
  model: string;
}
export interface ImageGenerationOptions {
  prompt: string;
  aspectRatio?: string;
  count?: number;
  forceProvider?: ImageProvider;
  openrouterModel?: string;
  modelId?: string;
}
/** Only the admitted route supplies a durable operation and checkpoint. */
export interface ImageRuntime {
  reference: string;
  checkpoint: (job: ImageJob) => Promise<void>;
  transport?: typeof fetch;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
  budgetMs?: number;
}
export type ImageJob = {
  provider: "grok" | "gateway";
  requestId: string;
  model: string;
  count: number;
};
const GROK_MODEL = "grok-imagine-image-2.0";
const GEMINI_MODEL = "gemini-3.1-flash-image";
const RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "21:9"];
const pause = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
const record = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const items = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

export const OPENROUTER_IMAGE_MODELS = [
  {
    id: "google/gemini-3-pro-image-preview",
    name: "Gemini 3 Pro Image",
    label: "Nano Banana Pro",
    tier: "premium" as const,
    provider: "Google",
  },
  {
    id: "google/gemini-3.1-flash-image-preview",
    name: "Gemini 3.1 Flash Image",
    label: "Nano Banana 2",
    tier: "fast" as const,
    provider: "Google",
  },
  {
    id: "black-forest-labs/flux.2-max",
    name: "FLUX.2 Max",
    label: "FLUX.2 Max",
    tier: "premium" as const,
    provider: "Black Forest Labs",
  },
  {
    id: "black-forest-labs/flux.2-pro",
    name: "FLUX.2 Pro",
    label: "FLUX.2 Pro",
    tier: "quality" as const,
    provider: "Black Forest Labs",
  },
  {
    id: "black-forest-labs/flux.2-flex",
    name: "FLUX.2 Flex",
    label: "FLUX.2 Flex",
    tier: "fast" as const,
    provider: "Black Forest Labs",
  },
  {
    id: "black-forest-labs/flux.2-klein-4b",
    name: "FLUX.2 Klein",
    label: "FLUX.2 Klein",
    tier: "fast" as const,
    provider: "Black Forest Labs",
  },
  {
    id: "openai/gpt-5-image",
    name: "GPT-5 Image",
    label: "GPT-5 Image",
    tier: "premium" as const,
    provider: "OpenAI",
  },
  {
    id: "openai/gpt-5-image-mini",
    name: "GPT-5 Image Mini",
    label: "GPT-5 Image Mini",
    tier: "fast" as const,
    provider: "OpenAI",
  },
  {
    id: "google/gemini-2.5-flash-image-preview",
    name: "Gemini 2.5 Flash Image",
    label: "Nano Banana",
    tier: "fast" as const,
    provider: "Google",
  },
] as const;

const DEFAULT_OPENROUTER_MODEL = "google/gemini-3.1-flash-image-preview";

function channel(runtime: ImageRuntime) {
  const now = runtime.now ?? Date.now;
  const deadline =
    now() + Math.min(Math.max(runtime.budgetMs ?? 45_000, 1), 45_000);
  const pending = () => new OperationPendingError(runtime.reference);
  return {
    now,
    deadline,
    pending,
    sleep: runtime.sleep ?? pause,
    async request(
      url: string,
      key: string,
      body?: Record<string, unknown>,
      google = false,
      extraHeaders?: Record<string, string>,
    ) {
      const remaining = deadline - now();
      if (remaining <= 0) throw pending();
      const controller = new AbortController();
      const timer = setTimeout(
        () => controller.abort(),
        Math.min(remaining, 15_000),
      );
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(google
            ? { "x-goog-api-key": key }
            : key
              ? { Authorization: `Bearer ${key}` }
              : {}),
          ...extraHeaders,
        };
        const response = await (runtime.transport ?? fetch)(url, {
          method: body ? "POST" : "GET",
          headers,
          body: body ? JSON.stringify(body) : undefined,
          redirect: "error",
          signal: controller.signal,
        });
        if (!response.ok) {
          if (body && [400, 401, 403, 404, 422, 429].includes(response.status))
            throw new ProviderRejectedError(response.status);
          throw pending();
        }
        const reader = response.body?.getReader();
        if (!reader) throw pending();
        const chunks: Uint8Array[] = [];
        let bytes = 0;
        for (;;) {
          const part = await reader.read();
          if (part.done) break;
          bytes += part.value.byteLength;
          if (bytes > 32 * 1024 * 1024) {
            await reader.cancel();
            throw pending();
          }
          chunks.push(part.value);
        }
        return record(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        if (error instanceof ProviderRejectedError) throw error;
        throw pending();
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

class ProviderRejectedError extends Error {
  constructor(status: number) {
    super(`Image provider rejected the request (${status})`);
  }
}
type Channel = ReturnType<typeof channel>;

function imageUrl(value: unknown, pending: () => Error): string {
  if (typeof value !== "string") throw pending();
  const inline = value.match(
    /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]*={0,2})$/,
  );
  if (inline && inline[2].length > 0 && inline[2].length % 4 === 0)
    return value;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password)
      return value;
  } catch {
    /* A malformed success is an unknown paid outcome. */
  }
  throw pending();
}

function result(
  images: unknown[],
  provider: ImageProvider,
  model: string,
  wire: Channel,
): ImageGenerationResult {
  if (!images.length) throw wire.pending();
  return {
    provider,
    model,
    images: images.map((entry) => {
      const value = record(entry);
      return {
        url: imageUrl(value.url, wire.pending),
        ...(typeof value.revised_prompt === "string"
          ? { revisedPrompt: value.revised_prompt }
          : {}),
      };
    }),
  };
}

export async function resumeImages(
  value: unknown,
  runtime: ImageRuntime,
): Promise<ImageGenerationResult> {
  const wire = channel(runtime);
  const job = record(value);

  const isGrok = job.provider === "grok" && job.model === GROK_MODEL;
  const isGateway =
    job.provider === "gateway" &&
    typeof job.model === "string" &&
    Boolean(getModel(job.model));

  if (
    (!isGrok && !isGateway) ||
    typeof job.requestId !== "string" ||
    !/^[A-Za-z0-9_-]{1,200}$/.test(job.requestId) ||
    !Number.isInteger(job.count) ||
    Number(job.count) < 1 ||
    Number(job.count) > 4
  )
    throw wire.pending();
  const key = process.env.XAI_API_KEY;
  if (!key && job.provider === "grok") throw wire.pending();
  while (wire.now() < wire.deadline) {
    const pollUrl =
      job.provider === "gateway"
        ? `${process.env.AI_GATEWAY_URL || "https://ai-gateway.vercel.sh"}/v1/images/${job.requestId}`
        : `https://api.x.ai/v1/images/${job.requestId}`;
    const data = await wire.request(pollUrl, key || "");
    if (data.status === "failed")
      throw new Error("Image generation failed at the provider");
    if (data.status === "done") {
      const images = items(data.data);
      if (images.length > Number(job.count)) throw wire.pending();
      return result(images, job.provider, String(job.model), wire);
    }
    if (data.status !== "pending") throw wire.pending();
    await wire.sleep(Math.min(2000, Math.max(0, wire.deadline - wire.now())));
  }
  throw wire.pending();
}

export async function generateImages(
  options: ImageGenerationOptions,
  runtime?: ImageRuntime,
): Promise<ImageGenerationResult> {
  if (!runtime?.reference || !runtime.checkpoint)
    throw new Error("Durable image admission is required");
  const {
    prompt,
    aspectRatio = "1:1",
    count = 1,
    forceProvider,
    openrouterModel,
    modelId,
  } = options;
  if (
    !prompt.trim() ||
    !Number.isInteger(count) ||
    count < 1 ||
    count > 4 ||
    !RATIOS.includes(aspectRatio) ||
    (forceProvider !== undefined &&
      !["grok", "openrouter", "gemini", "gateway"].includes(forceProvider)) ||
    (openrouterModel !== undefined &&
      !OPENROUTER_IMAGE_MODELS.some((entry) => entry.id === openrouterModel))
  )
    throw new Error("Invalid image generation settings");

  const gatewayUrl =
    process.env.AI_GATEWAY_URL || "https://ai-gateway.vercel.sh";

  const provider =
    forceProvider ??
    (process.env.AI_GATEWAY_TOKEN || process.env.VERCEL_OIDC_TOKEN
      ? "gateway"
      : process.env.OPENROUTER_API_KEY
        ? "openrouter"
        : process.env.XAI_API_KEY
          ? "grok"
          : process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
            ? "gemini"
            : null);

  const key =
    provider === "gateway"
      ? process.env.AI_GATEWAY_TOKEN || process.env.VERCEL_OIDC_TOKEN || ""
      : provider === "openrouter"
        ? process.env.OPENROUTER_API_KEY
        : provider === "grok"
          ? process.env.XAI_API_KEY
          : process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

  if (!provider || (provider !== "gateway" && !key))
    throw new Error(
      "No image generation API configured for the selected provider",
    );

  const wire = channel(runtime);

  if (provider === "gateway") {
    const selectedModelDef =
      getModel(modelId || DEFAULT_IMAGE_MODEL_ID) ||
      getModel(DEFAULT_IMAGE_MODEL_ID)!;
    const targetGatewayId = selectedModelDef.gatewayId;
    const fallbacks = getGatewayFallbackChain(selectedModelDef.id);

    const gatewayClient = createOpenAI({
      baseURL: `${gatewayUrl}/v1`,
      apiKey: key || "gateway-oidc",
      headers: fallbacks.length
        ? { "x-gateway-models": JSON.stringify(fallbacks) }
        : undefined,
      fetch: runtime.transport,
    });

    try {
      const generated = await generateImage({
        model: gatewayClient.image(targetGatewayId),
        prompt,
        n: count,
        providerOptions: {
          gateway: {
            models: fallbacks,
          },
        },
      });

      return {
        provider: "gateway",
        model: selectedModelDef.id,
        images: generated.images.map((img) => ({
          url: imageUrl(
            img.base64 ? `data:image/png;base64,${img.base64}` : img.url,
            wire.pending,
          ),
        })),
      };
    } catch (error) {
      if (error instanceof ProviderRejectedError) throw error;
      throw wire.pending();
    }
  }

  if (provider === "grok") {
    const accepted = await wire.request(
      "https://api.x.ai/v1/images/generations",
      key!,
      {
        model: GROK_MODEL,
        prompt,
        n: count,
        aspect_ratio: aspectRatio,
        response_format: "url",
        deferred: true,
      },
    );
    if (
      typeof accepted.request_id !== "string" ||
      !/^[A-Za-z0-9_-]{1,200}$/.test(accepted.request_id)
    )
      throw wire.pending();
    const job: ImageJob = {
      provider: "grok",
      requestId: accepted.request_id,
      model: GROK_MODEL,
      count,
    };
    try {
      await runtime.checkpoint(job);
    } catch {
      throw wire.pending();
    }
    const remaining = wire.deadline - wire.now();
    if (remaining <= 0) throw wire.pending();
    return resumeImages(job, { ...runtime, budgetMs: remaining });
  }

  const model =
    provider === "gemini"
      ? GEMINI_MODEL
      : (openrouterModel ?? DEFAULT_OPENROUTER_MODEL);
  const submissions = Array.from({ length: count }, async (_, index) => {
    const variation =
      count > 1
        ? `${prompt} (variation ${index + 1}, unique composition and style)`
        : prompt;
    if (provider === "openrouter") {
      const data = await wire.request(
        "https://openrouter.ai/api/v1/chat/completions",
        key!,
        {
          model,
          messages: [{ role: "user", content: variation }],
          modalities: model.includes("flux") ? ["image"] : ["image", "text"],
          image_config: { aspect_ratio: aspectRatio },
          provider: { allow_fallbacks: false },
        },
      );
      if (data.error) throw wire.pending();
      const choice = record(items(data.choices)[0]);
      const message = record(choice.message);
      if (message.refusal || choice.finish_reason === "content_filter")
        throw new Error("The image provider declined this prompt");
      let urls = items(message.images).map(
        (imageItem) => record(record(imageItem).image_url).url,
      );
      if (!urls.length && typeof message.content === "string")
        urls =
          message.content.match(
            /data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}/g,
          ) ?? [];
      if (urls.length !== 1) throw wire.pending();
      return result(
        urls.map((url) => ({ url })),
        provider,
        model,
        wire,
      ).images;
    }
    const data = await wire.request(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      key!,
      {
        contents: [{ parts: [{ text: variation }] }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: { aspectRatio },
        },
      },
      true,
    );
    const feedback = record(data.promptFeedback);
    const candidate = record(items(data.candidates)[0]);
    if (
      feedback.blockReason ||
      ["SAFETY", "IMAGE_SAFETY", "PROHIBITED_CONTENT"].includes(
        String(candidate.finishReason),
      )
    )
      throw new Error("The image provider declined this prompt");
    const images = items(record(candidate.content).parts).flatMap((part) => {
      const inline = record(record(part).inlineData);
      return inline.data
        ? [{ url: `data:${inline.mimeType};base64,${inline.data}` }]
        : [];
    });
    if (images.length !== 1) throw wire.pending();
    return result(images, provider, model, wire).images;
  });
  const settled = await Promise.allSettled(submissions);
  if (
    settled.some(
      (outcome) =>
        outcome.status === "rejected" &&
        outcome.reason instanceof OperationPendingError,
    )
  )
    throw wire.pending();
  const images = settled.flatMap((outcome) =>
    outcome.status === "fulfilled" ? outcome.value : [],
  );
  if (!images.length)
    throw new Error("Image generation was rejected by the provider");
  return { images, provider, model };
}
