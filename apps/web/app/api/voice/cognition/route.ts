/**
 * Cognition Bridge Route — /api/voice/cognition
 *
 * Routes a text utterance through Starlight Voice Operator's brain
 * (FastAPI :7373/api/utterance) instead of the cloud chat path. Gives
 * "one mind, two bodies": arcanea.ai/room and the local CLI share the
 * same packet schema, approval gate, and dispatcher fleet.
 *
 * Activated by COGNITION_BRIDGE_URL env var. When unset, returns 503
 * with cta:'no-bridge'. Rooms in cloud mode keep using /api/ai/chat.
 *
 * Auth: when VOICE_OPERATOR_AUTH_TOKEN is set, sent as Bearer header.
 * Loopback (127.0.0.1) bypasses auth voice-operator-side.
 *
 * Trade-off: NOT streaming. Voice operator returns full packet JSON
 * after routing completes. Acceptable because room-client already
 * shows orb 'thinking' state during the round-trip; full reply lands
 * in <2s for tier-A read-only intents.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';

export const runtime = 'edge';
export const maxDuration = 30;

const RATE_LIMIT = { maxRequests: 30, windowMs: 60_000 };
const MAX_TEXT_CHARS = 4000;
const BRIDGE_TIMEOUT_MS = 8_000;

interface CognitionIn {
  text: string;
  source?: string;
  persona?: string;
}

interface VoiceOperatorTurn {
  ok: boolean;
  spoken_update?: string;
  packet?: {
    packet_id?: string;
    classification?: { intent_class?: string; confidence?: string };
    target_system?: string;
    approval?: { tier?: 'A' | 'B' | 'C'; required?: boolean };
    route_history?: string[];
    risk_flags?: string[];
  };
  routing?: { target?: string; confidence?: string; rationale?: string };
  reason?: string;
}

export async function POST(req: NextRequest) {
  const clientId = getClientIdentifier(req);
  const rl = checkRateLimit(clientId, RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again in a minute.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)) },
      },
    );
  }

  const bridgeUrl = process.env.COGNITION_BRIDGE_URL;
  if (!bridgeUrl) {
    return NextResponse.json(
      {
        error: 'Cognition bridge is not configured on this deployment.',
        cta: 'no-bridge',
        hint: 'Set COGNITION_BRIDGE_URL=http://127.0.0.1:7373/api/utterance in the local env, then run voice-operator (SIS/private/voice-operator/run.ps1).',
      },
      { status: 503 },
    );
  }

  let body: CognitionIn;
  try {
    body = (await req.json()) as CognitionIn;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const text = (body.text ?? '').trim();
  if (!text) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }
  if (text.length > MAX_TEXT_CHARS) {
    return NextResponse.json(
      { error: `text too long (max ${MAX_TEXT_CHARS} chars)` },
      { status: 400 },
    );
  }

  const authToken = process.env.VOICE_OPERATOR_AUTH_TOKEN ?? '';
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (authToken) headers.authorization = `Bearer ${authToken}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BRIDGE_TIMEOUT_MS);

  try {
    const res = await fetch(bridgeUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text,
        source: body.source ?? 'arcanea-room',
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const errBody = await res.text().catch(() => res.statusText);
      const upstreamMessage = errBody.slice(0, 200);
      return NextResponse.json(
        {
          error: `Cognition bridge returned ${res.status}`,
          provider: 'voice-operator',
          hint: upstreamMessage || res.statusText,
          cta: res.status === 401 ? 'auth' : 'retry',
        },
        { status: 502 },
      );
    }

    const data = (await res.json()) as VoiceOperatorTurn;

    return NextResponse.json({
      text: data.spoken_update ?? '',
      ok: data.ok ?? true,
      provider: 'voice-operator',
      packet_id: data.packet?.packet_id,
      intent: data.packet?.classification?.intent_class,
      confidence: data.packet?.classification?.confidence,
      target_system: data.packet?.target_system,
      approval_tier: data.packet?.approval?.tier,
      approval_required: data.packet?.approval?.required ?? false,
      route_history: data.packet?.route_history ?? [],
      risk_flags: data.packet?.risk_flags ?? [],
      routing: data.routing,
      reason: data.reason,
    });
  } catch (e) {
    clearTimeout(timeout);
    const err = e as Error;
    if (err.name === 'AbortError' || err.name === 'TimeoutError') {
      return NextResponse.json(
        {
          error: 'Cognition bridge timeout (>8s)',
          cta: 'retry',
          hint: 'Voice operator may be processing a long task. Check http://127.0.0.1:7373/healthz.',
        },
        { status: 504 },
      );
    }
    return NextResponse.json(
      {
        error: 'Cognition bridge unreachable',
        cta: 'no-bridge',
        hint: `${err.message}. Confirm voice-operator is running and COGNITION_BRIDGE_URL points to it.`,
      },
      { status: 503 },
    );
  }
}

/**
 * GET — probe whether the bridge is configured. Used by the room
 * client on mount to decide which path to take (cognition vs cloud
 * chat) before the user speaks.
 *
 * NEVER reveals the bridge URL itself in the response — only whether
 * it's set. Internal address must not leak through edge runtime.
 */
export async function GET() {
  const bridgeUrl = process.env.COGNITION_BRIDGE_URL;
  return NextResponse.json({
    bridge_configured: Boolean(bridgeUrl),
    hint: bridgeUrl
      ? 'POST { text, source?, persona? } to route through voice-operator.'
      : 'Set COGNITION_BRIDGE_URL to enable. See planning-with-files/VOICE_OPERATOR_BOOT_RUNBOOK_2026-04-30.md.',
  });
}
