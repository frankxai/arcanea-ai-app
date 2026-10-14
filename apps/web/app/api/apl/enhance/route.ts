/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * APL Enhance API — the SPARK.SHAPE.SHARPEN prompt transformer
 *
 * POST /api/apl/enhance
 * Body: { prompt: string, mode?: "text" | "image" | "music" }
 *
 * Uses Grok via OpenRouter to rewrite a generic prompt into full
 * SPARK.SHAPE.SHARPEN format. Returns structured JSON with the
 * enhanced prompt, spark detail, palette, sharpen constraints,
 * and before/after quality scores from the local enhance() engine.
 */

import { NextRequest, NextResponse } from "next/server";
import { enhance } from "@/lib/apl/enhance";
import { buildLocalGuidance } from "@/lib/apl/local-guidance";

export const runtime = "edge";

// ---------------------------------------------------------------------------
// Rate limiting (mirrors /api/ai/chat pattern)
// ---------------------------------------------------------------------------

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

// ---------------------------------------------------------------------------
// Quality level to numeric score
// ---------------------------------------------------------------------------

const QUALITY_SCORES: Record<string, number> = {
  generic: 25,
  clear: 50,
  vivid: 75,
  resonant: 95,
};

// ---------------------------------------------------------------------------
// Mode-specific system prompt suffix
// ---------------------------------------------------------------------------

const MODE_HINTS: Record<string, string> = {
  text: `The enhanced prompt is for a text/story AI. Focus on narrative voice, emotional specificity, and structural clarity.`,
  image: `The enhanced prompt is for an image generation AI. Focus on composition, lighting, texture, and camera angle. Keep under 200 words.`,
  music: `The enhanced prompt is for a music generation AI. Focus on tempo, instrumentation, emotional arc, and sonic texture. Translate visual palettes into auditory ones.`,
};

// ---------------------------------------------------------------------------
// Core system prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are APL — the Arcanean Prompt Language engine. Transform generic prompts into SPARK.SHAPE.SHARPEN format.

Given a prompt, return a JSON object with:
- spark: the one unique, specific detail you added (the truth that makes it theirs)
- palette: which sensory palette fits best (forge/tide/root/drift/void)
- paletteDescription: 1-2 sentences of sensory atmosphere
- sharpen: array of 3 things it must NOT be
- enhanced: the complete rewritten prompt in SPARK.SHAPE.SHARPEN format

Rules:
- The SPARK must be a surprising, specific detail — not a description
- The palette must include feel/smell/sound, not just visuals
- The SHARPEN must name the obvious defaults this prompt would normally produce
- The enhanced prompt must be ready to paste into any AI model
- Return ONLY valid JSON, no explanations`;

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    // --- Rate limiting by IP ---
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0].trim() || "anonymous";
    const rateLimitKey = `apl:${ip}`;
    const now = Date.now();
    const userLimit = rateLimits.get(rateLimitKey);

    if (userLimit) {
      if (now < userLimit.resetAt) {
        if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
          const retryAfterSec = Math.ceil((userLimit.resetAt - now) / 1000);
          return NextResponse.json(
            { error: `Rate limit exceeded. Try again in ${retryAfterSec}s.` },
            { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
          );
        }
        userLimit.count++;
      } else {
        rateLimits.set(rateLimitKey, {
          count: 1,
          resetAt: now + RATE_LIMIT_WINDOW,
        });
      }
    } else {
      rateLimits.set(rateLimitKey, {
        count: 1,
        resetAt: now + RATE_LIMIT_WINDOW,
      });
    }

    // --- Parse & validate ---
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }
    const prompt: unknown = body?.prompt;
    const mode: string = body?.mode || "text";

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "prompt is required (string)" },
        { status: 400 },
      );
    }

    if (prompt.length > 4000) {
      return NextResponse.json(
        { error: "Prompt too long (max 4000 chars)" },
        { status: 400 },
      );
    }

    if (!["text", "image", "music"].includes(mode)) {
      return NextResponse.json(
        { error: 'mode must be "text", "image", or "music"' },
        { status: 400 },
      );
    }

    // --- Before quality score ---
    const before = enhance(prompt);
    const qualityBefore = QUALITY_SCORES[before.qualityLevel] ?? 25;

    // --- LLM enhancement via OpenRouter / Grok ---
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      // The local APL engine can give useful, deterministic guidance without
      // billing a model or pretending to have rewritten the creator's ideas.
      const { guidance, enhanced } = buildLocalGuidance(
        prompt,
        before.suggestions,
      );
      return NextResponse.json({
        original: prompt,
        enhanced,
        spark: null,
        palette: before.detectedPalettes[0]?.palette ?? null,
        paletteDescription: null,
        sharpened: [],
        suggestions: guidance,
        source: "local-guidance",
        qualityBefore,
        qualityAfter: qualityBefore,
      });
    }

    const systemContent = MODE_HINTS[mode]
      ? `${SYSTEM_PROMPT}\n\n${MODE_HINTS[mode]}`
      : SYSTEM_PROMPT;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://arcanea.ai",
        "X-Title": "Arcanea APL Enhance",
      },
      body: JSON.stringify({
        model: "x-ai/grok-2-1212",
        messages: [
          { role: "system", content: systemContent },
          {
            role: "user",
            content: `Transform this ${mode} prompt using SPARK.SHAPE.SHARPEN:\n\n"${prompt}"`,
          },
        ],
        max_tokens: 600,
        temperature: 0.85,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            res.status === 429
              ? "Enhancement provider rate limited."
              : "Enhancement provider unavailable.",
        },
        { status: res.status === 429 ? 429 : 502 },
      );
    }

    const data = await res.json();
    const raw =
      (
        data as { choices?: { message?: { content?: string } }[] }
      )?.choices?.[0]?.message?.content?.trim() || "";

    // --- Parse LLM JSON response ---
    let parsed: {
      spark?: string;
      palette?: string;
      paletteDescription?: string;
      sharpen?: string[];
      enhanced?: string;
    };

    try {
      parsed = JSON.parse(raw);
    } catch {
      // If the LLM returned non-JSON, try to extract JSON from the response
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          // Fallback: treat entire response as the enhanced prompt
          parsed = { enhanced: raw };
        }
      } else {
        parsed = { enhanced: raw };
      }
    }

    const enhanced = parsed.enhanced || prompt;

    // --- After quality score ---
    const after = enhance(enhanced);
    const qualityAfter = QUALITY_SCORES[after.qualityLevel] ?? 25;

    return NextResponse.json({
      original: prompt,
      enhanced,
      spark: parsed.spark || null,
      palette: parsed.palette || null,
      paletteDescription: parsed.paletteDescription || null,
      sharpened: parsed.sharpen || [],
      qualityBefore,
      qualityAfter,
      source: "provider-rewrite",
    });
  } catch {
    console.error("APL Enhance API error");
    return NextResponse.json(
      { error: "Prompt enhancement is temporarily unavailable." },
      { status: 502 },
    );
  }
}
