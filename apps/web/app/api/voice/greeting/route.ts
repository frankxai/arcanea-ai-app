/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Voice Greeting API Route
 *
 * Returns a streamed MP3 of the persona's activation greeting.
 * Used by daemon-launched windows: clap → window opens →
 * /api/voice/greeting?persona=X&tenant=Y plays automatically.
 *
 * Inputs (query):
 *  - persona: PersonaId (lumina, jarvis, draconia, lyria, alera, shinkami, nero)
 *  - tenant : 'arcanea' | 'sis' | 'frankx' (default 'arcanea')
 *
 * Caches greeting copy by (persona, tenant) for 30 minutes to avoid
 * re-billing OpenAI TTS on every clap. The cache lives in-memory per
 * Edge isolate — worst case duplicates one TTS call per cold start.
 *
 * Cache strategy: store the audio bytes once, replay on subsequent calls.
 * Edge runtime ArrayBuffer is safe to reuse.
 */

import { NextRequest, NextResponse } from 'next/server';
import { PERSONAS, greetingFor, type PersonaId } from '@/app/room/[persona]/personas';

export const runtime = 'edge';
export const maxDuration = 15;

interface CachedGreeting {
  bytes: ArrayBuffer;
  contentType: string;
  ts: number;
}

const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, CachedGreeting>();

const TENANT_VOICE_OVERRIDE: Record<string, Partial<Record<PersonaId, string>>> = {
  sis: {
    lumina: 'shimmer',
    alera: 'echo',
  },
  frankx: {
    lumina: 'alloy',
    jarvis: 'alloy',
  },
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const personaParam = url.searchParams.get('persona') || 'lumina';
  const tenant = url.searchParams.get('tenant') || 'arcanea';

  if (!(personaParam in PERSONAS)) {
    return NextResponse.json({ error: 'Unknown persona' }, { status: 400 });
  }
  const personaId = personaParam as PersonaId;
  const persona = PERSONAS[personaId];
  const text = greetingFor(personaId, tenant);

  const cacheKey = `${personaId}|${tenant}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.ts < CACHE_TTL_MS) {
    return new NextResponse(hit.bytes, {
      headers: {
        'Content-Type': hit.contentType,
        'Cache-Control': 'public, max-age=1800',
        'X-Greeting-Cache': 'hit',
        'X-Persona': personaId,
        'X-Tenant': tenant,
      },
    });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return NextResponse.json(
      { error: 'TTS not configured. Set OPENAI_API_KEY.' },
      { status: 503 },
    );
  }

  const tenantVoice = TENANT_VOICE_OVERRIDE[tenant]?.[personaId];
  const voice = tenantVoice || (persona.voiceKey === 'lumina' ? 'nova' : 'shimmer');

  const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1-hd',
      input: text,
      voice,
      response_format: 'mp3',
      speed: 1.0,
    }),
  });

  if (!ttsRes.ok) {
    const err = await ttsRes.text();
    console.error('Greeting TTS error:', ttsRes.status, err);
    return NextResponse.json({ error: 'Greeting generation failed' }, { status: 502 });
  }

  const bytes = await ttsRes.arrayBuffer();
  const contentType = ttsRes.headers.get('Content-Type') || 'audio/mpeg';
  cache.set(cacheKey, { bytes, contentType, ts: Date.now() });

  return new NextResponse(bytes, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=1800',
      'X-Greeting-Cache': 'miss',
      'X-Persona': personaId,
      'X-Tenant': tenant,
      'X-Voice': voice,
    },
  });
}
