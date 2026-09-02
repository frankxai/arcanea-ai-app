import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GROWTH_CAPTURE_URL =
  process.env.GROWTH_CAPTURE_URL ??
  "https://gfrfcqyprekhazzugdkr.supabase.co/functions/v1/growth-capture";

const WAITLIST_PROGRAMS = [
  "arcanea-newsletter",
  "arcanea-founding-circle",
] as const;

type WaitlistProgram = (typeof WAITLIST_PROGRAMS)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function textValue(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  return normalized ? normalized.slice(0, max) : undefined;
}

function resolveProgram(value: unknown): WaitlistProgram {
  return typeof value === "string" &&
    WAITLIST_PROGRAMS.includes(value as WaitlistProgram)
    ? (value as WaitlistProgram)
    : "arcanea-founding-circle";
}

export async function POST(req: NextRequest) {
  let raw: Record<string, unknown>;
  try {
    const body = (await req.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: "Invalid submission." },
        { status: 400 },
      );
    }
    raw = body as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid submission." },
      { status: 400 },
    );
  }

  const honeypot = textValue(raw.website, 120) ?? textValue(raw.company, 120);
  if (honeypot) {
    return NextResponse.json({ success: true }, { status: 202 });
  }

  const email = textValue(raw.email, 254)?.toLowerCase() ?? "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const program = resolveProgram(raw.program);
  const requestOrigin = req.headers.get("origin") ?? new URL(req.url).origin;
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Origin: requestOrigin,
  };
  if (clientIp) headers["x-growth-client-ip"] = clientIp;

  let response: Response;
  try {
    response = await fetch(GROWTH_CAPTURE_URL, {
      method: "POST",
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
      body: JSON.stringify({
        email,
        name: textValue(raw.name, 120),
        program,
        source:
          textValue(raw.source, 120) ??
          (program === "arcanea-newsletter"
            ? "community_footer"
            : "pricing_founding_circle"),
        intention: textValue(raw.intention, 500),
        referrer:
          textValue(raw.referrer, 2048) ??
          textValue(req.headers.get("referer"), 2048),
        page_path: textValue(raw.page_path, 2048),
        utm_source: textValue(raw.utm_source, 120),
        utm_medium: textValue(raw.utm_medium, 120),
        utm_campaign: textValue(raw.utm_campaign, 120),
        utm_content: textValue(raw.utm_content, 120),
        utm_term: textValue(raw.utm_term, 120),
        metadata: { surface: "arcanea" },
      }),
    });
  } catch (error) {
    console.error("Growth Core capture unavailable:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Signup storage is temporarily unavailable. Please try again.",
      },
      { status: 503 },
    );
  }

  const result = (await response.json().catch(() => null)) as
    | { accepted?: boolean; error?: string }
    | null;

  if (!response.ok || result?.accepted !== true) {
    console.error("Growth Core capture rejected:", response.status);
    const status = response.status === 429 ? 429 : 503;
    return NextResponse.json(
      {
        success: false,
        error:
          status === 429
            ? "Too many requests. Please try again shortly."
            : "Signup storage is temporarily unavailable. Please try again.",
      },
      {
        status,
        headers: status === 429 ? { "Retry-After": "600" } : undefined,
      },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message:
        program === "arcanea-newsletter"
          ? "Subscription saved."
          : "Welcome to the Founding Circle.",
    },
    { status: 201 },
  );
}
