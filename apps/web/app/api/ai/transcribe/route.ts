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

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
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

    // ── Try Groq Whisper first (faster, cheaper) ───────────────────────
    const groqKey = process.env.GROQ_API_KEY;
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
      } catch {
        // Fall through to OpenAI
      }
    }

    // ── Fallback: OpenAI Whisper ───────────────────────────────────────
    const openaiKey = process.env.OPENAI_API_KEY;
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

      return NextResponse.json(
        { error: 'Transcription failed' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: 'No speech-to-text provider configured. Set GROQ_API_KEY or OPENAI_API_KEY.' },
      { status: 503 },
    );
  } catch (error) {
    console.error('Transcribe API error:', error);
    return NextResponse.json(
      { error: 'Transcription error' },
      { status: 500 },
    );
  }
}
