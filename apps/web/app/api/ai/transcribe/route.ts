/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Speech-to-Text API Route (Whisper STT)
 *
 * Transcribes audio files using Groq Whisper (primary, faster/cheaper)
 * with OpenAI Whisper as fallback.
 *
 * Accepts multipart/form-data with an 'audio' field.
 * Returns { text, language?, provider }.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';

export const runtime = 'edge';
export const maxDuration = 30;

// 5 transcriptions per minute — protects Groq/OpenAI quota
const TRANSCRIBE_RATE_LIMIT = { maxRequests: 5, windowMs: 60_000 };

export async function POST(req: NextRequest) {
  // Rate limit check
  const clientId = getClientIdentifier(req);
  const rl = checkRateLimit(clientId, TRANSCRIBE_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again in a minute.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)) },
      }
    );
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 },
      );
    }

    // Validate file size (max 25MB for Whisper)
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Audio file too large (max 25MB)' },
        { status: 400 },
      );
    }

    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!groqKey && !openaiKey) {
      return NextResponse.json(
        {
          error: 'Voice transcription is not connected on this deployment.',
          provider: 'none',
          cta: 'byok',
          hint: 'Add your own Groq or OpenAI key in Settings to use voice immediately.',
        },
        { status: 503 },
      );
    }

    if (groqKey) {
      try {
        const groqForm = new FormData();
        groqForm.append('file', audioFile, audioFile.name || 'audio.webm');
        groqForm.append('model', 'whisper-large-v3-turbo');
        groqForm.append('response_format', 'json');

        const res = await fetch(
          'https://api.groq.com/openai/v1/audio/transcriptions',
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${groqKey}` },
            body: groqForm,
          },
        );

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({
            text: data.text,
            language: data.language,
            provider: 'groq',
          });
        }

        const body = await res.text().catch(() => res.statusText);
        console.error(`[transcribe] Groq failed status=${res.status} body=${body.slice(0, 400)}`);

        if (!openaiKey) {
          return NextResponse.json(
            {
              error: 'Voice provider is misconfigured.',
              provider: 'groq',
              cta: 'byok',
              hint: 'Hosted Groq key rejected the request. Add your own key in Settings to bypass.',
            },
            { status: 502 },
          );
        }
      } catch (e) {
        console.error('[transcribe] Groq threw:', (e as Error).message);
      }
    }

    if (openaiKey) {
      const oaiForm = new FormData();
      oaiForm.append('file', audioFile, audioFile.name || 'audio.webm');
      oaiForm.append('model', 'whisper-1');
      oaiForm.append('response_format', 'json');

      const res = await fetch(
        'https://api.openai.com/v1/audio/transcriptions',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${openaiKey}` },
          body: oaiForm,
        },
      );

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ text: data.text, provider: 'openai' });
      }

      const body = await res.text().catch(() => res.statusText);
      console.error(`[transcribe] OpenAI failed status=${res.status} body=${body.slice(0, 400)}`);

      return NextResponse.json(
        {
          error: 'Voice provider is misconfigured.',
          provider: 'openai',
          cta: 'byok',
          hint: 'Hosted OpenAI key rejected the request. Add your own key in Settings to bypass.',
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        error: 'Voice transcription is not connected on this deployment.',
        provider: 'none',
        cta: 'byok',
        hint: 'Add your own Groq or OpenAI key in Settings to use voice immediately.',
      },
      { status: 503 },
    );
  } catch (error) {
    console.error('[transcribe] unexpected error:', error);
    return NextResponse.json(
      { error: 'Transcription error', cta: 'retry' },
      { status: 500 },
    );
  }
}
