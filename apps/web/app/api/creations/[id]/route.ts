/**
 * Single Creation API Route
 *
 * GET /api/creations/[id] - Fetch single creation
 * PATCH /api/creations/[id] - Update creation
 * DELETE /api/creations/[id] - Delete creation
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  getCreation,
  updateCreation,
  deleteCreation,
  incrementViewCount,
} from '@/lib/database/services/creation-service';
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseRequestBody,
  parseBoolean,
} from '@/lib/api-utils';
import { VALIDATION_RULES } from '@/lib/database/types/api-responses';

/**
 * GET /api/creations/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseServer = await createClient();
    const { id } = await params;

    if (!id) {
      return errorResponse('INVALID_INPUT', 'Creation ID is required', 400);
    }

    const { searchParams } = new URL(request.url);
    const incrementViews = parseBoolean(searchParams.get('incrementViews'), true);

    const creation = await getCreation(supabaseServer, id);

    if (!creation) {
      return errorResponse('NOT_FOUND', 'Creation not found', 404);
    }

    if (incrementViews && creation.visibility === 'public') {
      incrementViewCount(supabaseServer, id).catch(console.error);
    }

    return successResponse({ creation });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/creations/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseServer = await createClient();
    const { id } = await params;

    if (!id) {
      return errorResponse('INVALID_INPUT', 'Creation ID is required', 400);
    }

    // Derive userId from session; fall back to body for backward compat
    const { data: { user } } = await supabaseServer.auth.getUser();

    const body = await parseRequestBody(request);
    if (!body) {
      return errorResponse('INVALID_INPUT', 'Invalid request body', 400);
    }

    const updateSchema = z.object({
      userId: z.string().uuid().optional(),
      title: z.string().min(VALIDATION_RULES.title.minLength).max(VALIDATION_RULES.title.maxLength).optional(),
      description: z.string().max(VALIDATION_RULES.description.maxLength).nullable().optional(),
      content: z.record(z.any()).optional(),
      type: z.enum(['text', 'image', 'video', 'audio', 'code', 'mixed']).optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
      visibility: z.enum(['public', 'private', 'unlisted']).optional(),
      element: z.enum(['Fire', 'Water', 'Earth', 'Wind', 'Void', 'Spirit']).nullable().optional(),
      gate: z.enum(['Foundation', 'Flow', 'Fire', 'Heart', 'Voice', 'Sight', 'Crown', 'Starweave', 'Unity', 'Source']).nullable().optional(),
      guardian: z.enum(['Lyssandria', 'Leyla', 'Draconia', 'Maylinn', 'Alera', 'Lyria', 'Aiyami', 'Elara', 'Ino', 'Shinkami']).nullable().optional(),
      tags: z.array(z.string().max(VALIDATION_RULES.tags.maxLength)).max(VALIDATION_RULES.tags.maxCount).optional(),
    });

    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid input', 400, { errors: validation.error.errors });
    }

    const { userId: bodyUserId, ...updates } = validation.data;
    const userId = user?.id ?? bodyUserId;

    if (!userId) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const updatedCreation = await updateCreation(supabaseServer, id, userId, updates);

    if (!updatedCreation) {
      return errorResponse('NOT_FOUND', 'Creation not found or not owned by user', 404);
    }

    return successResponse({ creation: updatedCreation });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/creations/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseServer = await createClient();
    const { id } = await params;

    if (!id) {
      return errorResponse('INVALID_INPUT', 'Creation ID is required', 400);
    }

    // Derive userId from session; fall back to body for backward compat
    const { data: { user } } = await supabaseServer.auth.getUser();

    let bodyUserId: string | undefined;
    try {
      const body = await parseRequestBody(request);
      bodyUserId = body?.userId as string | undefined;
    } catch {
      // Body may be empty for DELETE — that's fine
    }

    const userId = user?.id ?? bodyUserId;

    if (!userId) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const deleted = await deleteCreation(supabaseServer, id, userId);

    if (!deleted) {
      return errorResponse('NOT_FOUND', 'Creation not found or not owned by user', 404);
    }

    return successResponse({ message: 'Creation deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
