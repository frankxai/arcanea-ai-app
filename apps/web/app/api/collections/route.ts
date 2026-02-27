/**
 * Collections API Route
 *
 * GET /api/collections - List collections for a user
 * POST /api/collections - Create a new collection
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseRequestBody,
  parsePaginationParams,
} from '@/lib/api-utils';
import { VALIDATION_RULES, type Visibility } from '@/lib/database/types/api-responses';

/**
 * GET /api/collections?userId=xxx
 *
 * Query parameters:
 * - userId: (required) UUID of the user whose collections to list
 * - visibility: public|private|unlisted (optional filter)
 * - page, pageSize: pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse('INVALID_INPUT', 'userId query parameter is required', 400);
    }

    const { page, pageSize, offset } = parsePaginationParams(searchParams);

    let query = supabaseServer
      .from('collections')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    const visibility = searchParams.get('visibility');
    if (visibility && ['public', 'private', 'unlisted'].includes(visibility)) {
      query = query.eq('visibility', visibility);
    }

    query = query
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('[collections GET] Supabase error:', error);
      return errorResponse('DATABASE_ERROR', 'Failed to fetch collections', 500);
    }

    const collections = (data || []).map(mapCollection);

    return successResponse({
      collections,
      total: count ?? 0,
      page,
      pageSize,
      hasMore: (count ?? 0) > offset + pageSize,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/collections
 *
 * Body: { userId, title, description?, visibility?, coverUrl? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody(request);
    if (!body) {
      return errorResponse('INVALID_INPUT', 'Invalid request body', 400);
    }

    const createSchema = z.object({
      userId: z.string().uuid(),
      title: z.string().min(VALIDATION_RULES.title.minLength).max(VALIDATION_RULES.title.maxLength),
      description: z.string().max(VALIDATION_RULES.description.maxLength).optional(),
      visibility: z.enum(['public', 'private', 'unlisted']).default('private'),
      coverUrl: z.string().url().optional(),
    });

    const validation = createSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid input', 400, {
        errors: validation.error.errors,
      });
    }

    const { userId, title, description, visibility, coverUrl } = validation.data;

    // Determine next sort_order for this user
    const { data: lastCollection } = await supabaseServer
      .from('collections')
      .select('sort_order')
      .eq('user_id', userId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    const nextSortOrder = lastCollection ? lastCollection.sort_order + 1 : 0;

    const { data, error } = await supabaseServer
      .from('collections')
      .insert({
        user_id: userId,
        title,
        description: description ?? null,
        visibility,
        cover_url: coverUrl ?? null,
        sort_order: nextSortOrder,
      })
      .select()
      .single();

    if (error) {
      console.error('[collections POST] Supabase error:', error);
      return errorResponse('DATABASE_ERROR', 'Failed to create collection', 500);
    }

    return successResponse({ collection: mapCollection(data) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

function mapCollection(data: Record<string, unknown>) {
  return {
    id: data.id as string,
    userId: data.user_id as string,
    title: data.title as string,
    description: data.description as string | null,
    coverUrl: data.cover_url as string | null,
    visibility: (data.visibility || 'private') as Visibility,
    sortOrder: (data.sort_order ?? 0) as number,
    metadata: data.metadata as Record<string, unknown> | null,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}
