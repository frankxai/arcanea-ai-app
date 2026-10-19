/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * TASTE AI Vision Scoring — Phase 2 media intelligence
 * Guardian: Lyria (Sight Gate, 639 Hz)
 *
 * POST /api/media/taste
 *   Runs AI vision analysis on media_catalog entries using Haiku (~$0.0003/image).
 *   Updates taste_score with real visual evaluation and refines quality_tier.
 *
 * Body: { ids?: string[], guardian?: string, limit?: number, tier?: number }
 *
 * TASTE dimensions (weighted):
 *   Canon Alignment (25%), Design Compliance (25%), Emotional Impact (20%),
 *   Technical Fit (15%), Uniqueness (15%)
 *
 * Cost: ~$0.0003/image via Haiku 5.5 vision
 */

import { NextRequest, NextResponse } from "next/server";
import { requireMediaOperator } from "@/lib/media/require-operator";

interface CatalogEntry {
  id: string;
  storage_path: string;
  guardian: string | null;
  gate: string | null;
  element: string | null;
  scene: string;
  public_url: string;
}

function isValidScoreDimension(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100
  );
}

function resolveTrustedStorageImageUrl(
  publicUrl: string,
  supabaseUrl: string,
): string | null {
  try {
    const allowedOrigin = new URL(supabaseUrl);
    const candidate = new URL(publicUrl);
    if (candidate.protocol !== "https:") return null;
    if (candidate.hostname !== allowedOrigin.hostname) return null;
    if (!candidate.pathname.startsWith("/storage/v1/object/public/")) {
      return null;
    }
    return candidate.toString();
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const denial = await requireMediaOperator();
  if (denial) return denial;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const writeKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!supabaseUrl || !writeKey) {
    return NextResponse.json(
      { error: "Media catalog unavailable." },
      { status: 503 },
    );
  }
  if (!anthropicKey) {
    return NextResponse.json(
      { error: "Media scoring unavailable." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { ids, guardian, tier, limit = 20 } = body;
  if (
    typeof limit !== "number" ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 50 ||
    (ids !== undefined &&
      (!Array.isArray(ids) ||
        ids.length === 0 ||
        ids.length > 50 ||
        !ids.every(
          (id) => typeof id === "string" && /^[a-f0-9-]{36}$/i.test(id),
        ))) ||
    (guardian !== undefined &&
      (typeof guardian !== "string" ||
        !/^[a-z0-9_-]{1,64}$/i.test(guardian))) ||
    (tier !== undefined &&
      (typeof tier !== "number" ||
        !Number.isInteger(tier) ||
        tier < 1 ||
        tier > 4))
  ) {
    return NextResponse.json(
      { error: "Invalid media selection or limit." },
      { status: 400 },
    );
  }
  const maxLimit = limit;

  try {
    // Fetch entries to analyze
    const params = new URLSearchParams();
    params.set(
      "select",
      "id,storage_path,guardian,gate,element,scene,public_url",
    );
    params.set("limit", String(maxLimit));
    params.set("order", "created_at.asc,id.asc");

    if (Array.isArray(ids) && ids.length > 0) {
      params.set("id", `in.(${ids.join(",")})`);
    } else if (typeof guardian === "string") {
      params.set("guardian", `eq.${guardian}`);
    } else if (typeof tier === "number") {
      params.set("quality_tier", `eq.${tier}`);
    }

    const fetchRes = await fetch(
      `${supabaseUrl}/rest/v1/media_catalog?${params}`,
      { headers: { apikey: writeKey, Authorization: `Bearer ${writeKey}` } },
    );
    if (!fetchRes.ok) {
      return NextResponse.json(
        { error: "Existing catalog could not be read." },
        { status: 502 },
      );
    }

    const entries: CatalogEntry[] = await fetchRes.json();
    if (entries.length === 0) {
      return NextResponse.json({
        analyzed: 0,
        message: "No entries match criteria",
      });
    }

    // Analyze in batches of 5
    const results: Array<{
      id: string;
      guardian: string | null;
      scores: Record<string, number>;
      tier: number;
      notes: string;
    }> = [];

    for (let i = 0; i < entries.length; i += 5) {
      const batch = entries.slice(i, i + 5);
      const batchResults = await Promise.all(
        batch.map((e) => analyzeImage(e, anthropicKey, supabaseUrl)),
      );
      for (const r of batchResults) {
        if (r) results.push(r);
      }
    }

    // Update catalog
    let updated = 0;
    for (const r of results) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/media_catalog?id=eq.${r.id}`,
        {
          method: "PATCH",
          headers: {
            apikey: writeKey,
            Authorization: `Bearer ${writeKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            taste_score: r.scores,
            quality_tier: r.tier,
            analyzed_by: "haiku-vision",
          }),
        },
      );
      if (res.ok) updated++;
    }

    if (results.length === 0) {
      return NextResponse.json(
        {
          error:
            "No media could be scored. Retry after checking provider availability.",
        },
        { status: 502 },
      );
    }
    const partial =
      results.length !== entries.length || updated !== results.length;
    return NextResponse.json(
      {
        analyzed: results.length,
        updated,
        failed: entries.length - results.length,
        partial,
        cost_estimate: `~$${(results.length * 0.0003).toFixed(4)}`,
        results: results.map((r) => ({
          id: r.id,
          guardian: r.guardian,
          tier: r.tier,
          total: r.scores.total,
          notes: r.notes,
        })),
      },
      { status: partial ? 502 : 200 },
    );
  } catch {
    console.error("[media/taste] processing failed");
    return NextResponse.json(
      { error: "Media scoring failed." },
      { status: 502 },
    );
  }
}

async function analyzeImage(
  entry: CatalogEntry,
  anthropicKey: string,
  supabaseUrl: string,
) {
  try {
    const trustedImageUrl = resolveTrustedStorageImageUrl(
      entry.public_url,
      supabaseUrl,
    );
    if (!trustedImageUrl) return null;

    const guardianCtx = entry.guardian
      ? `This image represents ${entry.guardian} (${entry.gate} Gate, ${entry.element} element).`
      : "No Guardian assigned yet.";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-5-5",
        // Haiku 5.5 thinks by default and thinking counts toward max_tokens:
        // low effort plus headroom keeps the short JSON reply from being cut off.
        max_tokens: 1024,
        output_config: { effort: "low" },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "url", url: trustedImageUrl },
              },
              {
                type: "text",
                text: `TASTE evaluator for Arcanea fantasy universe. Score this image 0-100 on:
1. CANON (25%): Arcanea mythology fit? ${guardianCtx}
2. DESIGN (25%): Cosmic glass aesthetic, ethereal, detailed?
3. EMOTION (20%): Evokes wonder/power/transcendence?
4. TECHNICAL (15%): Good composition, web-ready?
5. UNIQUENESS (15%): Distinctive contribution?
Context: "${entry.scene}"
Reply ONLY with JSON: {"canon":N,"design":N,"emotion":N,"technical":N,"uniqueness":N,"notes":"one line"}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    // A safety refusal is HTTP 200 with no usable text; Haiku 5.5 has no
    // server-side fallback, so the image simply goes unscored.
    if (data.stop_reason === "refusal") return null;
    // The reply can start with a thinking block, so find the text block by type.
    const text =
      (
        data.content as Array<{ type: string; text?: string }> | undefined
      )?.find((block) => block.type === "text")?.text ?? "";
    const match = text.match(/\{[^}]+\}/);
    if (!match) return null;

    const s = JSON.parse(match[0]);
    if (
      !isValidScoreDimension(s.canon) ||
      !isValidScoreDimension(s.design) ||
      !isValidScoreDimension(s.emotion) ||
      !isValidScoreDimension(s.technical) ||
      !isValidScoreDimension(s.uniqueness)
    ) {
      return null;
    }

    const total = Math.round(
      s.canon * 0.25 +
        s.design * 0.25 +
        s.emotion * 0.2 +
        s.technical * 0.15 +
        s.uniqueness * 0.15,
    );
    const tier = total >= 80 ? 1 : total >= 60 ? 2 : total >= 40 ? 3 : 4;

    return {
      id: entry.id,
      guardian: entry.guardian,
      scores: {
        canon: s.canon,
        design: s.design,
        emotion: s.emotion,
        technical: s.technical,
        uniqueness: s.uniqueness,
        total,
      },
      tier,
      notes: typeof s.notes === "string" ? s.notes : "",
    };
  } catch {
    return null;
  }
}
