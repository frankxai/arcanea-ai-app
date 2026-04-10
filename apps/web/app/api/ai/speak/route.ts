/**
 * Text-to-Speech API Route (OpenAI TTS)
 *
 * Generates speech audio from text using OpenAI's TTS models.
 * Streams mp3 audio back to the client.
 *
 * Accepts JSON: { text, voice?, model?, persona?, speed? }
 * - voice: raw OpenAI voice (alloy, echo, fable, onyx, nova, shimmer)
 * - persona: Arcanea character name → maps to curated voice + quality
 * - speed: playback speed (0.25–4.0, default 1.0)
 * Returns audio/mpeg stream.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';

export const runtime = 'edge';
export const maxDuration = 30;

// 10 TTS requests per minute — protects OpenAI TTS quota
const TTS_RATE_LIMIT = { maxRequests: 10, windowMs: 60_000 };

const VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] as const;
type Voice = (typeof VOICES)[number];

// Arcanea character → voice + quality mapping
// Each Guardian/character gets a distinct voice that matches their personality
const PERSONA_MAP: Record<string, { voice: Voice; model: 'tts-1' | 'tts-1-hd' }> = {
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

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json(
        { error: 'Text-to-speech not configured. Set OPENAI_API_KEY.' },
        { status: 503 },
      );
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
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

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenAI TTS error:', response.status, err);
      return NextResponse.json(
        { error: 'TTS generation failed' },
        { status: 502 },
      );
    }

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
        'X-Voice': resolvedVoice,
        'X-Model': resolvedModel,
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
