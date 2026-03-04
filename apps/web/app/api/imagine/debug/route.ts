import { NextResponse } from 'next/server';

/**
 * Debug endpoint — check which API keys are configured.
 * Only returns boolean presence, never actual values.
 * DELETE THIS AFTER DEBUGGING.
 */
export async function GET() {
  // Check all possible xAI env var names
  const envCheck = {
    XAI_API_KEY: !!process.env.XAI_API_KEY,
    XAI_KEY: !!process.env.XAI_KEY,
    GROK_API_KEY: !!process.env.GROK_API_KEY,
    X_AI_API_KEY: !!process.env.X_AI_API_KEY,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    GOOGLE_API_KEY: !!process.env.GOOGLE_API_KEY,
    GOOGLE_GENERATIVE_AI_API_KEY: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    FAL_KEY: !!process.env.FAL_KEY,
    BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    VERCEL_ENV: process.env.VERCEL_ENV || 'unknown',
    NODE_ENV: process.env.NODE_ENV || 'unknown',
  };

  return NextResponse.json(envCheck);
}
