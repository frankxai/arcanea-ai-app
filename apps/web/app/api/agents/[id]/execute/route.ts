/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Agent Execute — Stream a marketplace agent task
 *
 * POST /api/agents/:id/execute
 *   Body: { input: string, context?: Record<string, unknown> }
 *   Headers: Cookie (Supabase session — required)
 *   Returns: Streaming text response (Vercel AI SDK format)
 *
 * Every call that reaches a provider is billable, so the route is guarded
 * (see lib/agents/marketplace/execute-guard.ts):
 *   - signed-in users only; anonymous requests are refused with 401
 *   - per-IP and per-user rate limits
 *   - hard caps on input, context, output tokens and tool steps
 *   - credits checked fail-closed: an error reading them denies the call
 *   - one declared model, no fall-through to other paid providers
 *   - provider-side fallbacks are not requested
 *   - ReasoningBank distillation (a second model call) is opt-in
 *   - AI_METERED_ALLOWED=false turns the route off without a deploy
 *   - one JSON log line per denial, start and finish
 *
 * Pipeline:
 *   1. Kill switch, rate limits, body validation and caps
 *   2. Look up agent spec in catalog (falls back to marketplace_agents table)
 *   3. Resolve user session (required) and check credits (fail-closed)
 *   4. Build system prompt from agent spec + user context
 *   5. Resolve the one declared model
 *   6. Stream response via Vercel AI SDK streamText
 *   7. Deduct credits on stream completion (best-effort, non-blocking)
 *
 * Uses Edge runtime for low-latency streaming.
 */

import { NextRequest } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { CATALOG_BY_ID } from "@/lib/agents/marketplace/catalog";
import { claudeRejectsSamplingParams } from "@/lib/gateway/catalog";
import { LUMINORS } from "@/lib/luminors/config";
import { refusalNoticeTransform } from "@/lib/ai/claude-safeguards";
import {
  getClientIdentifier,
  checkRateLimit,
} from "@/lib/rate-limit/rate-limiter";
import {
  EXECUTE_LIMITS,
  checkCreditsFailClosed,
  checkInputCaps,
  checkPromptCap,
  extractAccessToken,
  learningEnabled,
  logExecute,
  meteredCallsAllowed,
  resolveDeclaredModel,
  withoutPaidTools,
} from "@/lib/agents/marketplace/execute-guard";

export const runtime = "edge";

// ---------------------------------------------------------------------------
// Model resolution — one declared model, never a fall-through
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildModel(
  preferredGatewayId?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { model: any; label: string } | { error: string } {
  const declared = resolveDeclaredModel(preferredGatewayId);
  if (!declared.ok) return { error: declared.reason };

  const { provider, modelId, apiKey, label, baseUrl } = declared;
  if (provider === "google") {
    return { model: createGoogleGenerativeAI({ apiKey })(modelId), label };
  }
  if (provider === "anthropic") {
    return { model: createAnthropic({ apiKey })(modelId), label };
  }
  if (provider === "openai") {
    return { model: createOpenAI({ apiKey })(modelId), label };
  }
  if (baseUrl) {
    return {
      model: createOpenAI({ apiKey, baseURL: baseUrl })(modelId),
      label,
    };
  }
  return { error: `unsupported provider ${provider}` };
}

// ---------------------------------------------------------------------------
// Supabase session helper (edge-compatible — manual cookie parsing)
// ---------------------------------------------------------------------------

async function resolveSession(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) return null;

    const jwt = extractAccessToken(req.headers.get("cookie") ?? "");
    if (!jwt) return null;

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data } = await supabase.auth.getUser();
    if (!data?.user) return null;

    return { supabase, userId: data.user.id, user: data.user };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Deduct credits (fire-and-forget after stream completes)
// ---------------------------------------------------------------------------

async function deductCredits(
  supabaseUrl: string,
  supabaseAnonKey: string,
  userId: string,
  agentId: string,
  amount: number,
  modelUsed: string,
): Promise<void> {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    // Use service role key if available for elevated write access
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey;
    const admin = createClient(supabaseUrl, serviceKey);

    // Try RPC first (atomic decrement); fall back to read-modify-write
    const rpcResult = await admin.rpc("decrement_credits", {
      p_user_id: userId,
      p_amount: amount,
    });

    if (rpcResult.error) {
      // RPC not available yet — read current balance then deduct manually
      const { data: row } = await admin
        .from("credits")
        .select("balance")
        .eq("user_id", userId)
        .single();

      const currentBalance: number = (row?.balance ?? 0) as number;
      const newBalance = Math.max(0, currentBalance - amount);

      await admin.from("credits").upsert(
        {
          user_id: userId,
          balance: newBalance,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
    }

    // Log the transaction
    await admin.from("credit_transactions").insert({
      user_id: userId,
      amount: -amount,
      type: "consume",
      agent_id: agentId,
      description: `Agent task: ${agentId} (${modelUsed})`,
    });
  } catch {
    // Non-fatal: best-effort credit deduction
  }
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestStarted = Date.now();
  try {
    const { id } = await params;

    const deny = (
      status: number,
      error: string,
      reason: string,
      extra: Record<string, unknown> = {},
      headers: Record<string, string> = {},
    ) => {
      logExecute({ event: "denied", reason, status, agentId: id });
      return new Response(JSON.stringify({ error, ...extra }), {
        status,
        headers: { "Content-Type": "application/json", ...headers },
      });
    };

    // ── 1. Kill switch, rate limit, body validation and caps ─────────────────
    if (!meteredCallsAllowed()) {
      return deny(
        503,
        "Agent execution is temporarily unavailable.",
        "kill_switch",
      );
    }

    const ipLimit = checkRateLimit(
      getClientIdentifier(req),
      EXECUTE_LIMITS.perIp,
    );
    if (!ipLimit.allowed) {
      const retryAfter = Math.max(
        1,
        Math.ceil((ipLimit.resetTime - Date.now()) / 1000),
      );
      return deny(
        429,
        "Too many requests. Please slow down.",
        "rate_limit_ip",
        { retryAfter },
        { "Retry-After": String(retryAfter) },
      );
    }

    let body: { input?: unknown; context?: unknown };
    try {
      body = await req.json();
    } catch {
      return deny(400, "Invalid JSON in request body", "invalid_json");
    }

    const checked = checkInputCaps(body.input, body.context);
    if (!checked.ok) {
      return deny(checked.status, checked.error, "input_caps");
    }
    const { input, context } = checked;

    // ── 2. Resolve agent spec ────────────────────────────────────────────────
    // Resolution order: 12 Chosen Luminors → marketplace catalog → marketplace_agents table
    let agent = CATALOG_BY_ID[id] ?? null;

    // Check the 12 Chosen Luminors first (canonical, always free, always available)
    if (!agent) {
      const chosen = LUMINORS[id];
      if (chosen) {
        agent = {
          id: chosen.id,
          name: chosen.name,
          title: chosen.loreName,
          category: chosen.team,
          description: chosen.tagline,
          longDescription: chosen.description,
          priceCredits: 0, // Chosen Luminors are always free
          element: "Spirit",
          gateAlignment: chosen.title, // e.g. "Gate of Structure"
          icon: chosen.avatar,
          color: chosen.color,
          gradient: chosen.gradient,
          capabilities: [],
          inputPlaceholder: "",
          examplePrompts: chosen.quickActions?.map((qa) => qa.prompt) ?? [],
          spec: {
            systemPrompt: chosen.systemPrompt,
            name: chosen.name,
            title: chosen.loreName,
            tagline: chosen.tagline,
            temperature: 0.7,
            origin: "chosen",
          },
          rating: 5.0,
          usageCount: 0,
          isFeatured: true,
          creatorId: null, // Arcanea canonical, no creator royalty
        } as unknown as NonNullable<typeof agent>;
      }
    }

    if (!agent) {
      // Try Supabase marketplace_agents table
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (supabaseUrl && supabaseAnonKey) {
          const { createClient } = await import("@supabase/supabase-js");
          const supabase = createClient(supabaseUrl, supabaseAnonKey);
          const { data } = await supabase
            .from("marketplace_agents")
            .select("*")
            .eq("id", id)
            .eq("is_published", true)
            .single();
          if (data) {
            agent = {
              id: data.id,
              name: data.spec?.name ?? id,
              title: data.spec?.title ?? "",
              category: data.category,
              description: data.spec?.tagline ?? "",
              longDescription: "",
              priceCredits: data.price_credits ?? 10,
              element: data.spec?.element ?? "Spirit",
              gateAlignment:
                (data.spec?.gateAlignment ?? [])[0] ?? "Foundation",
              icon: data.spec?.avatar ?? "✨",
              color: "var(--arc-brand-atlantean-teal)",
              gradient: "from-teal-900/60 to-cyan-900/60",
              capabilities: [],
              inputPlaceholder: "",
              examplePrompts: [],
              spec: data.spec,
              rating: Number(data.rating) ?? 0,
              usageCount: data.usage_count ?? 0,
              isFeatured: data.is_featured ?? false,
              creatorId: data.creator_id ?? null,
            };
          }
        }
      } catch {
        // Non-fatal
      }
    }

    if (!agent) {
      return new Response("Agent not found", { status: 404 });
    }

    // ── 3. Resolve user session (required) ───────────────────────────────────
    const session = await resolveSession(req);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

    if (!session) {
      return deny(401, "Sign in to run agents.", "anonymous");
    }

    const userLimit = checkRateLimit(
      getClientIdentifier(req, session.userId),
      EXECUTE_LIMITS.perUser,
    );
    if (!userLimit.allowed) {
      const retryAfter = Math.max(
        1,
        Math.ceil((userLimit.resetTime - Date.now()) / 1000),
      );
      return deny(
        429,
        "Too many requests. Please slow down.",
        "rate_limit_user",
        { retryAfter },
        { "Retry-After": String(retryAfter) },
      );
    }

    // ── 4. Credit check — fail-closed ────────────────────────────────────────
    const credits = await checkCreditsFailClosed(
      session.supabase,
      session.userId,
      agent.priceCredits,
    );

    if (credits.status === "unavailable") {
      return deny(
        503,
        "Credits are unavailable right now. Please try again shortly.",
        "credits_unavailable",
      );
    }

    if (credits.status === "insufficient") {
      return deny(402, "Insufficient credits", "insufficient_credits", {
        required: agent.priceCredits,
        balance: credits.balance,
        message: "Purchase more credits to run this agent.",
      });
    }

    // ── 5. Resolve the model first, so a missing key is refused before any
    //      paid retrieval, embedding or tool call runs ───────────────────
    const preferredGatewayId = agent.spec?.preferredModel ?? undefined;
    const resolved = buildModel(preferredGatewayId);

    if ("error" in resolved) {
      return deny(
        503,
        "No AI provider is configured for this agent.",
        `model_unavailable: ${resolved.error}`,
      );
    }

    const { model, label } = resolved;
    const temperature = agent.spec?.temperature ?? 0.7;
    // AI SDK models expose modelId; Claude 5.x rejects sampling parameters with a 400.
    const modelId = String(model.modelId ?? "");
    const sendTemperature = !claudeRejectsSamplingParams(modelId);

    // ── 6. Build system prompt ───────────────────────────────────────────────
    const agentSystemPrompt =
      agent.spec?.systemPrompt ??
      `You are ${agent.name}, ${agent.title}. ${agent.description}`;

    let systemPrompt = agentSystemPrompt;

    // ReasoningBank RETRIEVE — fetch relevant memory items BEFORE response.
    // Off unless AGENT_EXECUTE_LEARNING=true: retrieval embeds the input through
    // a paid provider. If retrieval fails, we proceed without memory.
    try {
      if (!learningEnabled()) throw new Error("memory disabled");
      const { retrieveMemoryItems, formatMemoryItemsForPrompt } =
        await import("@/lib/memory/reasoning-bank");
      const memoryItems = await retrieveMemoryItems({
        luminorId: agent.id,
        userId: session?.userId ?? null,
        queryText: input,
        topK: 5,
        threshold: 0.6,
      });
      const memoryBlock = formatMemoryItemsForPrompt(memoryItems);
      if (memoryBlock) {
        systemPrompt = `${systemPrompt}${memoryBlock}`;
      }
    } catch {
      // Fail-open: memory retrieval never blocks execution
    }

    // Inject user context if available
    if (session?.userId) {
      const userName = (context.userName as string) ?? "Creator";
      const userRank = (context.rank as string) ?? "Apprentice";
      const userElement = (context.element as string) ?? null;

      const contextBlock = [
        "[CREATOR CONTEXT]",
        `Name: ${userName}`,
        `Rank: ${userRank}`,
        ...(userElement ? [`Element: ${userElement}`] : []),
        "[/CREATOR CONTEXT]",
        "",
      ].join("\n");

      systemPrompt = `${contextBlock}${systemPrompt}`;
    }

    if (!checkPromptCap(systemPrompt, input)) {
      return deny(
        413,
        "The agent prompt is too large to run.",
        "prompt_cap",
        {},
      );
    }

    // ── 7. Resolve tools for this Luminor ─────────────────────────────────────
    // Dynamic import for edge compatibility — tool-resolver pulls in zod + ai/tool
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let luminorTools: Record<string, any> | undefined;
    try {
      const { resolveToolsForLuminor, teamToDomain } =
        await import("@/lib/luminors/tool-resolver");
      const domain =
        agent.spec?.domain ?? teamToDomain(agent.category ?? "development");
      const resolved = resolveToolsForLuminor({
        luminorId: agent.id,
        domain,
        userId: session?.userId ?? null,
        authenticated: !!session,
      });
      // Tools that call a paid provider with a server key are not offered here.
      luminorTools = withoutPaidTools(resolved);
    } catch {
      // Fail-open: if tool resolution fails, proceed without tools
    }

    // ── 8. Stream response ───────────────────────────────────────────────────
    const result = streamText({
      model,
      system: systemPrompt,
      messages: [{ role: "user", content: input }],
      ...(sendTemperature ? { temperature } : {}),
      maxOutputTokens: EXECUTE_LIMITS.maxOutputTokens,
      // No provider-side fallback is requested: a refusal or error ends the
      // call instead of silently re-running on another (billable) model.
      experimental_transform: refusalNoticeTransform(),
      ...(luminorTools
        ? { tools: luminorTools, maxSteps: EXECUTE_LIMITS.maxToolSteps }
        : {}),
      onFinish: ({ text, usage, finishReason }) => {
        logExecute({
          event: "finished",
          agentId: agent.id,
          userId: session.userId,
          model: label,
          finishReason,
          inputTokens: usage?.inputTokens,
          outputTokens: usage?.outputTokens,
          durationMs: Date.now() - requestStarted,
        });

        // ── 8. Deduct credits after completion ──────────────────────────────
        if (session && supabaseUrl && supabaseAnonKey) {
          // Fire and forget — do not await
          deductCredits(
            supabaseUrl,
            supabaseAnonKey,
            session.userId,
            agent.id,
            agent.priceCredits,
            label,
          ).catch((err) => {
            console.error("[execute] deductCredits failed:", err);
          });
        }

        // Log task to agent_tasks table (best-effort)
        if (session && supabaseUrl && supabaseAnonKey) {
          void (async () => {
            try {
              const { createClient } = await import("@supabase/supabase-js");
              const serviceKey =
                process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey;
              const admin = createClient(supabaseUrl, serviceKey);
              await admin.from("agent_tasks").insert({
                user_id: session.userId,
                agent_id: agent.id,
                input,
                output: text,
                status: "completed",
                credits_consumed: agent.priceCredits,
                model_used: label,
                completed_at: new Date().toISOString(),
              });
            } catch {
              // Non-fatal
            }
          })();
        }

        // ReasoningBank — JUDGE + DISTILL + CONSOLIDATE (fire-and-forget)
        // Runs the distillation loop in the background so the response
        // is never blocked. If a principle is extracted, it's stored as
        // a memory item for future RETRIEVE calls. Off unless
        // AGENT_EXECUTE_LEARNING=true: it costs a second provider call.
        if (supabaseUrl && learningEnabled()) {
          void (async () => {
            try {
              const { learnFromExchange } =
                await import("@/lib/memory/reasoning-bank");
              await learnFromExchange({
                luminorId: agent.id,
                userId: session?.userId ?? null,
                userInput: input,
                agentOutput: text,
                model: label,
              });
            } catch (err) {
              console.error("[execute] reasoning-bank learn failed:", err);
            }
          })();
        }

        // Registry Protocol telemetry — usage_events + revenue_events
        // This is the feedback loop for the marketplace: every invocation
        // flows through here, regardless of whether it's a Chosen Luminor or
        // a user-forged marketplace agent. Non-blocking, best-effort.
        if (supabaseUrl && supabaseAnonKey) {
          void (async () => {
            try {
              const { createClient } = await import("@supabase/supabase-js");
              const serviceKey =
                process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey;
              const admin = createClient(supabaseUrl, serviceKey);

              // Approximate token count from text length (Vercel AI SDK edge
              // doesn't always surface usage; ~4 chars per token is a safe estimate)
              const estimatedTokens = Math.ceil(
                (input.length + text.length) / 4,
              );
              const durationMs = Date.now() - requestStarted;

              // 1. usage_events — every invocation
              await admin.from("usage_events").insert({
                agent_id: agent.id,
                platform_id: null, // native arcanea.ai invocation
                deployment_id: null,
                user_id: session?.userId ?? null,
                tokens_used: estimatedTokens,
                duration_ms: durationMs,
                credits_consumed: agent.priceCredits,
                metadata: {
                  model: label,
                  origin: agent.creatorId ? "forged" : "chosen",
                  streaming: true,
                },
              });

              // 2. revenue_events — only for creator-forged agents with a price
              if (agent.creatorId && agent.priceCredits > 0) {
                // Compute split via SQL function for consistency
                const { data: split } = await admin.rpc(
                  "calculate_revenue_split",
                  {
                    p_gross: agent.priceCredits,
                    p_platform_id: null,
                  },
                );
                const row = Array.isArray(split) ? split[0] : split;
                const platformFee: number = row?.platform_fee ?? 0;
                const creatorPayout: number = row?.creator_payout ?? 0;

                await admin.from("revenue_events").insert({
                  agent_id: agent.id,
                  creator_id: agent.creatorId,
                  platform_id: null,
                  deployment_id: null,
                  gross_amount: agent.priceCredits,
                  platform_fee: platformFee,
                  creator_payout: creatorPayout,
                  affiliate_id: null,
                  affiliate_payout: 0,
                  event_type: "usage",
                });
              }
            } catch (err) {
              console.error("[execute] registry telemetry failed:", err);
            }
          })();
        }
      },
    });

    logExecute({
      event: "started",
      agentId: agent.id,
      userId: session.userId,
      model: label,
    });

    return result.toTextStreamResponse({
      headers: {
        "x-arcanea-agent": agent.id,
        "x-arcanea-model": label,
        "x-arcanea-credits": String(agent.priceCredits),
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
