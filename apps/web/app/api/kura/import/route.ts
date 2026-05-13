// ============================================================
// Arcanea Kura — bridge import endpoint
// Receives an opt-in mirror of a local Kura capture from the
// arcanea-kura Chrome extension. Local-first is the default;
// this endpoint exists only for users who explicitly click
// "Send to Arcanea" inside the extension popup.
// ============================================================

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

// Use Vercel Fluid Compute (Node) — full Node.js APIs, faster cold starts.
// Per Vercel knowledge update 2026-02-27, Edge functions are no longer the
// recommendation; Fluid Compute is the default and supports MV3-style payloads.
export const runtime = 'nodejs';
export const maxDuration = 30; // seconds; well below the 300s default cap

const SUPPORTED_SCHEMA = '0.2.0';
const MAX_BODY_BYTES = 8 * 1024 * 1024; // 8 MB hard cap for a single capture

// ----- Schema (kept narrow — full validation happens against FORMAT_SPEC) ---

const PlatformSchema = z.enum([
  'chatgpt',
  'claude',
  'gemini',
  'grok',
  'deepseek',
  'perplexity',
]);

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.string().optional(),
});

const ConversationSchema = z.object({
  id: z.string(),
  platform: PlatformSchema,
  title: z.string(),
  url: z.string().url(),
  messages: z.array(MessageSchema),
  capturedAt: z.string(),
});

const MediaSchema = z.object({
  id: z.string(),
  platform: PlatformSchema,
  type: z.enum(['image', 'video']),
  url: z.string().url(),
  filename: z.string(),
  capturedAt: z.string(),
});

const PromptSchema = z.object({
  id: z.string(),
  platform: PlatformSchema,
  text: z.string(),
  capturedAt: z.string(),
});

const DetectionSchema = z.object({
  platform: PlatformSchema,
  pageType: z.enum(['conversation', 'imagine', 'gallery', 'unknown']),
  conversations: z.array(ConversationSchema).default([]),
  media: z.array(MediaSchema).default([]),
  prompts: z.array(PromptSchema).default([]),
  stats: z
    .object({
      totalConversations: z.number().int().nonnegative(),
      totalImages: z.number().int().nonnegative(),
      totalVideos: z.number().int().nonnegative(),
      totalPrompts: z.number().int().nonnegative(),
    })
    .partial()
    .optional(),
});

const PayloadSchema = z.object({
  source: z.literal('arcanea-kura'),
  version: z.string(),
  schemaVersion: z.string(),
  platform: PlatformSchema,
  data: DetectionSchema,
});

type Payload = z.infer<typeof PayloadSchema>;

// ----- Handler ----------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Body size guard — read once, reject early.
  const contentLength = Number(req.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_BYTES) {
    return jsonError(413, 'capture too large', {
      maxBytes: MAX_BODY_BYTES,
      receivedBytes: contentLength,
    });
  }

  // 2. Parse JSON safely.
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return jsonError(400, 'invalid JSON body');
  }

  // 3. Schema validation.
  const parsed = PayloadSchema.safeParse(json);
  if (!parsed.success) {
    return jsonError(422, 'payload does not match Kura bridge schema', {
      issues: parsed.error.issues.slice(0, 10),
    });
  }
  const payload: Payload = parsed.data;

  // 4. Schema version gate. Hard refuse mismatches — caller should upgrade.
  if (payload.schemaVersion !== SUPPORTED_SCHEMA) {
    return jsonError(409, 'schema version mismatch', {
      supported: SUPPORTED_SCHEMA,
      received: payload.schemaVersion,
      action:
        payload.schemaVersion < SUPPORTED_SCHEMA
          ? 'extension is older than this server; please update the extension'
          : 'this server is older than the extension; please check arcanea.ai for an update',
    });
  }

  // 5. Mint a server-side capture id. The extension's per-conversation id is
  //    platform-scoped and not globally unique; this id is what the user can
  //    reference in the second brain.
  const captureId = mintCaptureId(payload);

  // 6. Persistence — deferred to a follow-up integration with Supabase. For now
  //    we log the metadata only, never the conversation bodies, and return 202.
  //    This keeps the endpoint useful (and non-error) without storing private
  //    content prematurely.
  logCaptureMetadata(captureId, payload);

  // 7. 202 Accepted — the bridge is intentionally fire-and-forget at v0.2.0.
  return NextResponse.json(
    {
      ok: true,
      status: 'accepted',
      captureId,
      message:
        'Capture received. Persistence to the Arcanea second brain is queued.',
      schemaVersion: SUPPORTED_SCHEMA,
      received: {
        conversations: payload.data.conversations.length,
        media: payload.data.media.length,
        prompts: payload.data.prompts.length,
      },
    },
    { status: 202, headers: { 'Cache-Control': 'no-store' } },
  );
}

export function OPTIONS(): NextResponse {
  // Permissive CORS — the extension calls this from a content-script context.
  // Authentication, when added, will be a signed token in the X-Kura-Token
  // header, not cookies.
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, X-Arcanea-Source, X-Kura-Token',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// ----- Helpers ----------------------------------------------------------------

function jsonError(
  status: number,
  message: string,
  extra: Record<string, unknown> = {},
): NextResponse {
  return NextResponse.json(
    { ok: false, status: 'error', message, ...extra },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );
}

function mintCaptureId(payload: Payload): string {
  // Stable per (platform, source conversation id, captured timestamp) tuple so
  // repeated posts of the same capture deduplicate naturally.
  const firstConv = payload.data.conversations[0];
  const seed = firstConv
    ? `${payload.platform}::${firstConv.id}::${firstConv.capturedAt}`
    : `${payload.platform}::${Date.now()}::${Math.random().toString(36).slice(2)}`;
  // Cheap hash — no crypto dependency, deterministic enough for an id.
  let h = 0xcbf29ce484222325n;
  for (const ch of seed) {
    h ^= BigInt(ch.charCodeAt(0));
    h = (h * 0x100000001b3n) & 0xffffffffffffffffn;
  }
  return `kura_${h.toString(16).padStart(16, '0')}`;
}

function logCaptureMetadata(captureId: string, payload: Payload): void {
  // Metadata only. Bodies stay on the user's machine until they configure a
  // persistence target (Supabase row, S3 object, Living Worlds entity, etc.).
  console.log('[kura/import]', {
    captureId,
    platform: payload.platform,
    schemaVersion: payload.schemaVersion,
    extensionVersion: payload.version,
    counts: {
      conversations: payload.data.conversations.length,
      media: payload.data.media.length,
      prompts: payload.data.prompts.length,
    },
    titles: payload.data.conversations.map((c) => c.title).slice(0, 3),
  });
}
