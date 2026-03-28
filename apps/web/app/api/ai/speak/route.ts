/**
 * Text-to-Speech API Route (OpenAI TTS)
 *
 * Generates speech audio from text using OpenAI's TTS models.
 * Streams mp3 audio back to the client.
 *
 * Accepts JSON: { text, voice?, model? }
 * Returns audio/mpeg stream.
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 30;

const VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] as const;
type Voice = (typeof VOICES)[number];

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'nova', model = 'tts-1' } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 },
      );
    }

    // Limit text length (TTS has a 4096 char limit)
    const trimmedText = text.trim().slice(0, 4096);

    if (!VOICES.includes(voice as Voice)) {
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
        model: model === 'tts-1-hd' ? 'tts-1-hd' : 'tts-1',
        input: trimmedText,
        voice,
        response_format: 'mp3',
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

    // Stream the audio back without buffering the entire response
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
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
