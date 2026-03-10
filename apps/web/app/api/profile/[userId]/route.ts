/**
 * Profile API Route
 *
 * GET /api/profile/[userId] - Fetch user profile with stats
 * PATCH /api/profile/[userId] - Update user profile
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  getProfileWithStats,
  updateProfile,
} from '@/lib/database/services/profile-service';
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseRequestBody,
} from '@/lib/api-utils';
import { VALIDATION_RULES } from '@/lib/database/types/api-responses';

/**
 * GET /api/profile/[userId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const supabaseServer = await createClient();
    const { userId } = await params;

    if (!userId) {
      return errorResponse('INVALID_INPUT', 'User ID is required', 400);
    }

    const profileData = await getProfileWithStats(supabaseServer, userId);

    if (!profileData) {
      return errorResponse('NOT_FOUND', 'Profile not found', 404);
    }

    return successResponse(profileData);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/profile/[userId]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const supabaseServer = await createClient();
    const { userId } = await params;

    if (!userId) {
      return errorResponse('INVALID_INPUT', 'User ID is required', 400);
    }

    const body = await parseRequestBody(request);
    if (!body) {
      return errorResponse('INVALID_INPUT', 'Invalid request body', 400);
    }

    const updateSchema = z.object({
      displayName: z.string().min(VALIDATION_RULES.displayName.minLength).max(VALIDATION_RULES.displayName.maxLength).optional(),
      bio: z.string().max(VALIDATION_RULES.bio.maxLength).optional(),
      avatarUrl: z.string().url().optional().or(z.literal('')),
      activeGate: z.enum(['Foundation', 'Flow', 'Fire', 'Heart', 'Voice', 'Sight', 'Crown', 'Starweave', 'Unity', 'Source']).optional(),
      guardian: z.enum(['Lyssandria', 'Leyla', 'Draconia', 'Maylinn', 'Alera', 'Lyria', 'Aiyami', 'Elara', 'Ino', 'Shinkami']).optional(),
      academyHouse: z.enum(['Lumina', 'Nero', 'Pyros', 'Aqualis', 'Terra', 'Ventus', 'Synthesis']).optional(),
    });

    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid input', 400, { errors: validation.error.errors });
    }

    const updatedProfile = await updateProfile(supabaseServer, userId, validation.data);

    if (!updatedProfile) {
      return errorResponse('NOT_FOUND', 'Profile not found', 404);
    }

    return successResponse({ profile: updatedProfile });
  } catch (error) {
    return handleApiError(error);
  }
}
