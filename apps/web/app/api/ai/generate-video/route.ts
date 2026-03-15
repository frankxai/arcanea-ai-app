/**
 * Video Generation API Route for Arcanea MVP
 * Handles video generation with Veo 3.1
 */

import { NextRequest, NextResponse } from 'next/server';
import { createVeoProvider } from '@/lib/ai-core';
import { createAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs'; // Video generation needs more time
export const maxDuration = 300; // 5 minutes

// Rate limiting - very restrictive for video
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5; // Only 5 videos per hour

interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
  resolution?: '480p' | '720p' | '1080p';
  fps?: 24 | 30 | 60;
  style?: string;
  mood?: string;
  cameraMovement?: 'static' | 'pan' | 'zoom' | 'tracking' | 'dolly' | 'crane';
  pacing?: 'slow' | 'medium' | 'fast';
  includeAudio?: boolean;
  audioStyle?: 'ambient' | 'cinematic' | 'upbeat' | 'dramatic';
  quality?: 'standard' | 'high';
  academyTheme?: 'atlantean' | 'draconic' | 'creation-light';
  operation?: 'text-to-video' | 'image-to-video';
  imageUrl?: string; // For image-to-video
}

export async function POST(req: NextRequest) {
  try {
    // Authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user ID early for subsequent operations
    const userId = user.id;

    // Rate limiting
    const now = Date.now();
    const userLimit = rateLimits.get(userId);

    if (userLimit) {
      if (now < userLimit.resetAt) {
        if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
          return NextResponse.json(
            { error: 'Video generation rate limit exceeded. Maximum 5 videos per hour.' },
            { status: 429 }
          );
        }
        userLimit.count++;
      } else {
        rateLimits.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
      }
    } else {
      rateLimits.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    }

    // Parse request
    const body: VideoGenerationRequest = await req.json();
    const {
      prompt,
      duration,
      resolution,
      fps,
      style,
      mood,
      cameraMovement,
      pacing,
      includeAudio,
      audioStyle,
      quality,
      academyTheme,
      operation = 'text-to-video',
      imageUrl,
    } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (operation === 'image-to-video' && !imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required for image-to-video' },
        { status: 400 }
      );
    }

    // Initialize provider
    const veo = createVeoProvider({
      apiKey: process.env.GEMINI_API_KEY,
    });

    let video;

    switch (operation) {
      case 'text-to-video':
        video = await veo.generateVideo(prompt, {
          duration,
          resolution,
          fps,
          style,
          mood,
          cameraMovement,
          pacing,
          includeAudio,
          audioStyle,
          quality,
          academyTheme,
        });
        break;

      case 'image-to-video':
        video = await veo.generateFromImage(imageUrl!, prompt, {
          duration,
          resolution,
          fps,
          style,
          mood,
          cameraMovement,
          pacing,
          includeAudio,
          audioStyle,
          quality,
          academyTheme,
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      video: {
        id: video.id,
        status: video.status,
        prompt: video.prompt,
        metadata: video.metadata,
        cost: video.cost,
        estimatedCompletionTime: video.estimatedCompletionTime,
      },
      message: 'Video generation started.',
    });
  } catch (error) {
    console.error('Video generation API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// Check video generation status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Video job tracking table not yet created — return placeholder
    return NextResponse.json({
      jobId,
      status: 'pending',
      message: 'Video job tracking coming soon. Check back later.',
    });
  } catch (error) {
    console.error('Video status API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
