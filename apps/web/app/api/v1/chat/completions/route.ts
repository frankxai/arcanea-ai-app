/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Arcanea Intelligence Gateway — Chat Completions API
 *
 * OpenAI-compatible endpoint: POST /api/v1/chat/completions
 *
 * This single endpoint makes Arcanea a provider in 30+ tools:
 * LobeChat, Open WebUI, Cursor, Continue, LiteLLM, LangChain, etc.
 *
 * BYOK: Users provide their own provider API keys.
 * Smart Routing: Use model "arcanea-auto" for automatic best-model selection.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  extractCustomerKeys,
  PUBLIC_INFERENCE_TIER,
  CredentialPolicyError,
} from "@/lib/gateway/credential-policy.mjs";
import type { ChatCompletionRequest, GatewayConfig } from "@/lib/gateway/types";
import { CURATED_MODELS, getModelById } from "@/lib/gateway/models";
import { routeRequest } from "@/lib/gateway/router";
import { dispatchToProvider } from "@/lib/gateway/providers";
import {
  checkRateLimit,
  rateLimitHeaders,
  recordTokenUsage,
} from "@/lib/gateway/rate-limiter";

export const runtime = "edge";

// Public inference accepts only credentials supplied for this request.
function extractGatewayConfig(req: NextRequest): GatewayConfig {
  return { providerKeys: extractCustomerKeys(req.headers), smartRouting: true };
}

// ─── POST Handler ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // ── Rate Limiting (tiered, sliding window) ──
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anon";
    const tier = PUBLIC_INFERENCE_TIER;
    const rateLimitKey = `gateway:${ip}`;
    const rateResult = checkRateLimit(rateLimitKey, tier);

    if (!rateResult.allowed) {
      const retryAfter = Math.ceil((rateResult.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: {
            message: `Rate limit exceeded for ${tier} tier. Please try again in ${retryAfter}s.`,
            type: "rate_limit_error",
            tier,
            retryAfter,
          },
        },
        {
          status: 429,
          headers: {
            ...rateLimitHeaders(rateResult),
            "Retry-After": String(retryAfter),
          },
        },
      );
    }

    // Parse request
    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: {
            message: "Request body must be valid JSON.",
            type: "invalid_request_error",
          },
        },
        { status: 400 },
      );
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return NextResponse.json(
        {
          error: {
            message: "Request body must be an object.",
            type: "invalid_request_error",
          },
        },
        { status: 400 },
      );
    }
    const body = payload as ChatCompletionRequest;

    if (
      !Array.isArray(body.messages) ||
      body.messages.length === 0 ||
      body.messages.some(
        (message) =>
          !message ||
          typeof message !== "object" ||
          !["system", "user", "assistant", "tool"].includes(message.role) ||
          !(
            typeof message.content === "string" ||
            Array.isArray(message.content) ||
            (message.role === "assistant" &&
              message.content === null &&
              Array.isArray(message.tool_calls))
          ),
      )
    ) {
      return NextResponse.json(
        {
          error: {
            message: "messages must contain valid chat messages.",
            type: "invalid_request_error",
          },
        },
        { status: 400 },
      );
    }

    if (
      typeof body.model !== "string" ||
      !body.model.trim() ||
      (body.stream !== undefined && typeof body.stream !== "boolean")
    ) {
      return NextResponse.json(
        {
          error: {
            message: "A model name and a boolean stream option are required.",
            type: "invalid_request_error",
          },
        },
        { status: 400 },
      );
    }

    // Build gateway config from request
    const config = extractGatewayConfig(req);
    if (Object.keys(config.providerKeys).length === 0) {
      return NextResponse.json(
        {
          error: {
            message: "Provide a customer provider key for this request.",
            type: "authentication_error",
          },
        },
        { status: 401 },
      );
    }

    // Resolve model
    const modelId = body.model;
    const streaming = body.stream ?? false;
    const selectedModel =
      getModelById(modelId) ||
      CURATED_MODELS.find((model) => model.providerModelId === modelId);
    if (selectedModel && !config.providerKeys[selectedModel.provider]) {
      return NextResponse.json(
        {
          error: {
            message: `Provide a customer key for ${selectedModel.provider}.`,
            type: "authentication_error",
          },
        },
        { status: 401 },
      );
    }

    // Route the request
    const route = routeRequest(modelId, body.messages, config);

    if (!route) {
      // If model not found in catalog, try treating it as a passthrough
      // (user specified a raw provider model ID like "gpt-4o")
      return NextResponse.json(
        {
          error: {
            message: `Model "${modelId}" not found. Use GET /api/v1/models to see available models, or use "arcanea-auto" for smart routing.`,
            type: "invalid_request_error",
            hint:
              "Available models: " +
              CURATED_MODELS.slice(0, 5)
                .map((m) => m.id)
                .join(", ") +
              "...",
          },
        },
        { status: 400 },
      );
    }

    // Check we have a key for this provider
    const apiKey = config.providerKeys[route.model.provider];
    if (!apiKey) {
      return NextResponse.json(
        {
          error: {
            message: `No API key found for provider "${route.model.provider}". Provide it via X-${route.model.provider}-Key header for this request.`,
            type: "authentication_error",
            provider: route.model.provider,
          },
        },
        { status: 401 },
      );
    }

    // Dispatch to provider
    const response = await dispatchToProvider(
      route.model.provider,
      route.model.providerModelId,
      apiKey,
      body,
      route.model.id,
      streaming,
    );

    // Add gateway metadata headers + rate limit headers
    const rlHeaders = rateLimitHeaders(rateResult);

    // For non-streaming, read body for token tracking then rebuild response
    let responseBody: ReadableStream<Uint8Array> | string | null =
      response.body;

    if (!streaming) {
      const text = await response.text();
      responseBody = text;
      try {
        const json = JSON.parse(text);
        if (json?.usage?.total_tokens) {
          recordTokenUsage(rateLimitKey, json.usage.total_tokens);
        }
      } catch {
        // Non-critical — token tracking is best-effort
      }
    }

    const finalResponse = new Response(responseBody, {
      status: response.status,
      headers: response.headers,
    });

    finalResponse.headers.set("X-Arcanea-Model", route.model.id);
    finalResponse.headers.set("X-Arcanea-Provider", route.model.provider);
    finalResponse.headers.set("X-Arcanea-Route-Reason", route.reason);
    finalResponse.headers.set("Cache-Control", "private, no-store");

    for (const [header, value] of Object.entries(rlHeaders)) {
      finalResponse.headers.set(header, value);
    }

    return finalResponse;
  } catch (error) {
    if (error instanceof CredentialPolicyError) {
      return NextResponse.json(
        { error: { message: error.message, type: "invalid_request_error" } },
        { status: error.status },
      );
    }
    // Provider errors can contain credentials or request contents. Do not log them.

    const message = "Internal gateway error";

    return NextResponse.json(
      { error: { message, type: "internal_error" } },
      { status: 500 },
    );
  }
}

// ─── GET Handler (Health Check) ──────────────────────────────────────

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Arcanea Intelligence Gateway",
    version: "1.0.0",
    credentialMode: "customer-byok",
    managedInference: "disabled",
    models: CURATED_MODELS.length,
    endpoints: {
      chat: "/api/v1/chat/completions",
      models: "/api/v1/models",
    },
    documentation: "https://arcanea.ai/docs/api",
  });
}
