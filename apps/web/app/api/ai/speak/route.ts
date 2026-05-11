/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Text-to-Speech API Route — Groq PlayAI primary, OpenAI fallback
 *
 * Generates speech audio from text. Tries Groq PlayAI first (faster + same key
 * as STT/LLM, so Sir's Groq-only stack covers the full pipeline), falls back to
 * OpenAI TTS if GROQ_API_KEY is absent. Returns 503 if neither is set.
 *
 * Accepts JSON: { text, voice?, model?, persona?, speed? }
 * - voice: raw OpenAI voice (alloy, echo, fable, onyx, nova, shimmer)
 *   (ignored when Groq path is used; persona-mapped Groq voice wins)
 * - persona: Arcanea character name → maps to curated voice on each provider
 * - speed: playback speed (0.25–4.0, default 1.0; OpenAI only)
 * Returns audio stream (wav from Groq, mp3 from OpenAI).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';

export const runtime = 'edge';
export const maxDuration = 30;

// 10 TTS requests per minute — protects provider quota
const TTS_RATE_LIMIT = { maxRequests: 10, windowMs: 60_000 };

const VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] as const;
type Voice = (typeof VOICES)[number];

// Arcanea character → voice + quality mapping
// Each Guardian/character gets a distinct voice that matches their personality
const PERSONA_MAP: Record<string, { voice: Voice; model: 'tts-1' | 'tts-1-hd' }> = {
  jarvis:     { voice: 'onyx',    model: 'tts-1-hd' },  // Deep, unhurried
  lumina:     { voice: 'nova',    model: 'tts-1-hd' },  // Warm, clear, authoritative
  arcanea:    { voice: 'nova',    model: 'tts-1-hd' },  // Default Arcanea voice
  lyssandria: { voice: 'shimmer', model: 'tts-1' },     // Grounded, earthy
  leyla:      { voice: 'nova',    model: 'tts-1' },     // Fluid, creative
  draconia:   { voice: 'onyx',    model: 'tts-1' },     // Deep, powerful
  maylinn:    { voice: 'fable',   model: 'tts-1' },     // Gentle, warm
  alera:      { voice: 'alloy',   model: 'tts-1-hd' },  // Clear, resonant
  lyria:      { voice: 'shimmer', model: 'tts-1-hd' },  // Mystical, ethereal
  aiyami:     { voice: 'echo',    model: 'tts-1-hd' },  // Wise, enlightened
  elara:      { voice: 'fable',   model: 'tts-1-hd' },  // Transformative
  ino:        { voice: 'alloy',   model: 'tts-1' },     // Collaborative, warm
  shinkami:   { voice: 'echo',    model: 'tts-1-hd' },  // Transcendent, gravitas
  nero:       { voice: 'onyx',    model: 'tts-1-hd' },  // Deep, primordial
  coach:      { voice: 'alloy',   model: 'tts-1' },     // Professional, clear
};

// Groq PlayAI voices — 19 English voices via the playai-tts model.
// Same Groq key Sir uses for Whisper STT + Llama LLM. One key, full pipeline.
// Voice names per https://console.groq.com/docs/text-to-speech.
const GROQ_PERSONA_MAP: Record<string, string> = {
  jarvis:     'Atlas-PlayAI',     // Deep, composed — closest match to Tony Stark Jarvis
  lumina:     'Celeste-PlayAI',   // Warm, illuminating
  arcanea:    'Celeste-PlayAI',
  lyssandria: 'Mamaw-PlayAI',     // Grounded, earthy
  leyla:      'Quinn-PlayAI',     // Fluid, creative
  draconia:   'Briggs-PlayAI',    // Commanding, fire-tempered
  maylinn:    'Gail-PlayAI',      // Gentle, warm
  alera:      'Indigo-PlayAI',    // Clear, resonant
  lyria:      'Cheyenne-PlayAI',  // Mystical
  aiyami:     'Mason-PlayAI',     // Wise, enlightened
  elara:      'Arista-PlayAI',    // Transformative
  ino:        'Calum-PlayAI',     // Collaborative, warm
  shinkami:   'Fritz-PlayAI',     // Transcendent, gravitas
  nero:       'Mason-PlayAI',     // Deep, primordial
  coach:      'Mikail-PlayAI',    // Professional, clear
};

export async function POST(req: NextRequest) {
  // Rate limit check
  const clientId = getClientIdentifier(req);
  const rl = checkRateLimit(clientId, TTS_RATE_LIMIT);
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
    const { text, voice, model, persona, speed } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 },
      );
    }

    const trimmedText = text.trim().slice(0, 4096);

    // Resolve voice: persona takes priority, then explicit voice, then default
    const personaConfig = persona ? PERSONA_MAP[persona.toLowerCase()] : null;
    const resolvedVoice = personaConfig?.voice || voice || 'nova';
    const resolvedModel = personaConfig?.model || (model === 'tts-1-hd' ? 'tts-1-hd' : 'tts-1');
    const resolvedSpeed = typeof speed === 'number' ? Math.min(4.0, Math.max(0.25, speed)) : 1.0;

    if (!VOICES.includes(resolvedVoice as Voice)) {
      return NextResponse.json(
        { error: `Invalid voice. Choose from: ${VOICES.join(', ')}` },
        { status: 400 },
      );
    }

    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!groqKey && !openaiKey) {
      return NextResponse.json(
        {
          error: 'Text-to-speech not configured.',
          hint: 'Set GROQ_API_KEY (preferred — same key as STT and LLM) or OPENAI_API_KEY.',
        },
        { status: 503 },
      );
    }

    // ---- Groq PlayAI path (preferred) ------------------------------------
    if (groqKey) {
      const groqVoice =
        (persona && GROQ_PERSONA_MAP[persona.toLowerCase()]) || 'Atlas-PlayAI';

      const groqRes = await fetch('https://api.groq.com/openai/v1/audio/speech', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'playai-tts',
          voice: groqVoice,
          input: trimmedText,
          response_format: 'wav',
        }),
      });

      if (groqRes.ok) {
        return new NextResponse(groqRes.body, {
          headers: {
            'Content-Type': 'audio/wav',
            'Cache-Control': 'no-cache',
            'X-Voice': groqVoice,
            'X-Model': 'playai-tts',
            'X-Provider': 'groq',
            'X-Persona': persona || 'default',
          },
        });
      }

      // Groq failed — log and try OpenAI if available, otherwise surface error
      const groqErr = await groqRes.text().catch(() => groqRes.statusText);
      console.error('Groq TTS error:', groqRes.status, groqErr);
      if (!openaiKey) {
        return NextResponse.json(
          {
            error: 'Groq TTS request failed and no OpenAI fallback configured.',
            provider: 'groq',
            status: groqRes.status,
          },
          { status: 502 },
        );
      }
      // fall through to OpenAI
    }

    // ---- OpenAI fallback (or primary if no Groq key) ---------------------
    const openaiRes = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: resolvedModel,
        input: trimmedText,
        voice: resolvedVoice,
        response_format: 'mp3',
        speed: resolvedSpeed,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      console.error('OpenAI TTS error:', openaiRes.status, err);
      return NextResponse.json(
        { error: 'TTS generation failed', provider: 'openai' },
        { status: 502 },
      );
    }

    return new NextResponse(openaiRes.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
        'X-Voice': resolvedVoice,
        'X-Model': resolvedModel,
        'X-Provider': 'openai',
        'X-Persona': persona || 'default',
      },
    });
  } catch (error) {
    console.error('Speak API error:', error);
    return NextResponse.json(
      { error: 'TTS error' },
      { status: 500 },
    );
  }
}
