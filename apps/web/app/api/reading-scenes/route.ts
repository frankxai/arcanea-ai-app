import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit/rate-limiter";

export const maxDuration = 30;

const MAX_BYTES = 3 * 1024 * 1024;
const sourceSchema = z.object({
  bookId: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(100),
  bookTitle: z.string().min(1).max(200),
  chapterTitle: z.string().min(1).max(200),
  path: z
    .string()
    .regex(/^\/books\/[a-z0-9-]+\/[a-z0-9-]+$/)
    .max(300),
  chapterHash: z.string().regex(/^[a-f0-9]{64}$/),
  passage: z.string().min(12).max(1200),
});
const sceneSchema = z.object({
  requestKey: z.string().uuid(),
  source: sourceSchema,
  brief: z.string().min(12).max(2000),
  model: z.string().min(1).max(100),
  provider: z.enum(["grok", "openrouter", "gemini"]),
  image: z.object({
    data: z
      .string()
      .min(4)
      .max(2_900_000)
      .regex(/^[A-Za-z0-9+/]+={0,2}$/),
    mimeType: z.enum(["image/png", "image/jpeg", "image/webp"]),
  }),
});

function reply(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

/** Private, owner-bound and retry-idempotent; never publishes or uploads publicly. */
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin)
    return reply({ error: "Invalid request origin" }, 403);
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return reply({ error: "Sign in to save a private scene" }, 401);
    if (
      !checkRateLimit(`reading-scene-save:${user.id}`, {
        maxRequests: 10,
        windowMs: 60_000,
      }).allowed
    ) {
      const response = reply(
        {
          error:
            "Too many save attempts. Your scene is retained; retry in a minute.",
        },
        429,
      );
      response.headers.set("Retry-After", "60");
      return response;
    }
    const reader = req.body?.getReader();
    if (!reader) return reply({ error: "Provide a scene" }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        return reply(
          { error: "Download this image; it exceeds the private save limit" },
          413,
        );
      }
      chunks.push(value);
    }
    let body: unknown;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return reply({ error: "Invalid scene data" }, 400);
    }
    const parsed = sceneSchema.safeParse(body);
    if (!parsed.success) return reply({ error: "Invalid scene data" }, 400);
    const scene = parsed.data;
    const bytes = Buffer.from(scene.image.data, "base64");
    const validRaster =
      scene.image.mimeType === "image/png"
        ? bytes
            .subarray(0, 8)
            .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : scene.image.mimeType === "image/jpeg"
          ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
          : bytes.toString("ascii", 0, 4) === "RIFF" &&
            bytes.toString("ascii", 8, 12) === "WEBP";
    if (!validRaster)
      return reply({ error: "Provide a supported raster image" }, 400);
    const fingerprint = createHash("sha256")
      .update(JSON.stringify(scene))
      .digest("hex");
    // A browser reference is provenance, not a server certification of canon/rights.
    const content = {
      schema: "arcanea.reading-scene.v1",
      source: scene.source,
      sourceVerification: "reader-reference",
      canonStatus: "personal-interpretation",
      rightsStatus: "not-reviewed",
      fingerprint,
      image: scene.image,
      generation: {
        requestKey: scene.requestKey,
        model: scene.model,
        provider: scene.provider,
        brief: scene.brief,
      },
    };
    const { data, error } = await supabase
      .from("creations")
      .insert({
        id: scene.requestKey,
        user_id: user.id,
        title: `${scene.source.chapterTitle}: scene interpretation`.slice(
          0,
          200,
        ),
        description: scene.source.passage,
        content,
        type: "image",
        status: "draft",
        visibility: "private",
        tags: ["reading-scene"],
        ai_model: scene.model,
        ai_prompt: scene.brief,
      })
      .select("id")
      .single();
    if (!error && data)
      return reply({ creationId: data.id, visibility: "private" });
    if (error?.code === "23505") {
      const { data: existing, error: readError } = await supabase
        .from("creations")
        .select("id,content,visibility")
        .eq("id", scene.requestKey)
        .eq("user_id", user.id)
        .single();
      if (
        !readError &&
        existing?.visibility === "private" &&
        existing.content?.fingerprint === fingerprint
      )
        return reply({ creationId: existing.id, visibility: "private" });
      return reply(
        {
          error:
            "This scene identity already belongs to a different saved version",
        },
        409,
      );
    }
    return reply(
      {
        error:
          "Private save is unavailable. Keep this scene and retry or download a copy.",
      },
      503,
    );
  } catch {
    return reply(
      {
        error:
          "Private save is unavailable. Keep this scene and retry or download a copy.",
      },
      503,
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return reply({ error: "Sign in to reopen your private scenes" }, 401);
    const path = req.nextUrl.searchParams.get("path") ?? "";
    if (!/^\/books\/[a-z0-9-]+\/[a-z0-9-]+$/.test(path) || path.length > 300)
      return reply({ error: "Invalid chapter reference" }, 400);
    // This prerequisite is private metadata, not a promise of credit entitlement
    // or model availability. The existing generation route remains authoritative.
    const imageGeneration = {
      providerConfigured: Boolean(process.env.OPENROUTER_API_KEY?.trim()),
    };
    const sceneReply = (body: Record<string, unknown>, status = 200) =>
      reply({ ...body, imageGeneration }, status);
    const { data, error } = await supabase
      .from("creations")
      .select("id,content")
      .eq("user_id", user.id)
      .eq("visibility", "private")
      .eq("status", "draft")
      .contains("content", {
        schema: "arcanea.reading-scene.v1",
        source: { path },
      })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error)
      return sceneReply({ error: "Private scenes could not be loaded" }, 503);
    if (!data) return sceneReply({ scene: null });
    const content = data.content;
    const validated = sceneSchema.safeParse({
      requestKey: data.id,
      source: content?.source,
      brief: content?.generation?.brief,
      model: content?.generation?.model,
      provider: content?.generation?.provider,
      image: content?.image,
    });
    if (!validated.success)
      return sceneReply(
        { error: "This saved scene needs its original recovery copy" },
        409,
      );
    const s = validated.data;
    return sceneReply({
      scene: {
        schema: "arcanea.reading-scene.v1",
        owner: user.id,
        source: s.source,
        brief: s.brief,
        model: s.model,
        requestKey: s.requestKey,
        creationId: data.id,
        result: {
          generationId: `gen_${s.requestKey}`,
          status: "completed",
          model: s.model,
          provider: s.provider,
          images: [s.image],
        },
      },
    });
  } catch {
    return reply({ error: "Private scenes could not be loaded" }, 503);
  }
}
