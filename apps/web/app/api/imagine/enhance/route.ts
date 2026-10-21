/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createClient } from "@/lib/supabase/server";
import {
  platformDefaultModelId,
  platformGatewayAvailable,
  platformGatewayOptions,
  platformLanguageModel,
} from "@/lib/ai/platform-gateway";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.length > 2000) {
      return NextResponse.json(
        { error: "Provide a prompt of up to 2000 characters" },
        { status: 400 },
      );
    }

    // Enhancement is a paid model call: signed-in users only.
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Sign in to enhance prompts" },
        { status: 401 },
      );
    }

    if (!platformGatewayAvailable()) {
      return NextResponse.json(
        { error: "Enhancement service not configured." },
        { status: 503 },
      );
    }

    // Platform credentials: Vercel AI Gateway only.
    const result = await generateText({
      model: platformLanguageModel(platformDefaultModelId()),
      system: `You are Arcanea's prompt architect. Use the SPARK.SHAPE.SHARPEN method:

SPARK — Find the one specific detail that makes this image unique. Not a description — a truth.
SHAPE — Add sensory atmosphere: what does this scene feel like, sound like, smell like? Use a palette (Forge=heat/ember/gold, Tide=cool/silver/echo, Root=earth/moss/weight, Drift=wind/ozone/pale, Void=silence/starfield/ink).
SHARPEN — Cut the defaults. No generic fantasy lighting. No symmetrical compositions unless earned. No "ethereal glow" or "majestic" or "hauntingly beautiful."

Add composition (camera angle, depth, framing), lighting (specific source and quality), atmosphere (weather, particles, time of day), and one unexpected texture detail. Keep the user's core vision but elevate it with specificity. Return ONLY the enhanced prompt, no explanations. Maximum 200 words.`,
      prompt: `Enhance this image prompt for maximum visual impact:\n\n"${prompt}"`,
      maxOutputTokens: 300,
      temperature: 0.8,
      providerOptions: platformGatewayOptions("imagine-enhance"),
    });
    const enhanced = result.text.trim() || prompt;

    return NextResponse.json({ enhanced, original: prompt });
  } catch (error) {
    console.error("Enhance API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Enhancement failed" },
      { status: 500 },
    );
  }
}
