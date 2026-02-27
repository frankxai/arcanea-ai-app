/**
 * Single Collection API Route
 *
 * GET /api/collections/[id] - Get collection with its items
 * PATCH /api/collections/[id] - Update collection
 * DELETE /api/collections/[id] - Delete collection
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseRequestBody,
} from '@/lib/api-utils';
import { VALIDATION_RULES, type Visibility } from '@/lib/database/types/api-responses';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/collections/[id]
 *
 * Returns the collection and its items (joined with creations).
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Fetch the collection
    const { data: collection, error: collError } = await supabaseServer
      .from('collections')
      .select('*')
      .eq('id', id)
      .single();

    if (collError || !collection) {
      return errorResponse('NOT_FOUND', 'Collection not found', 404);
    }

    // Fetch items with joined creation data
    const { data: items, error: itemsError } = await supabaseServer
      .from('collection_items')
      .select(`
        id,
        sort_order,
        added_at,
        creation_id,
        creations (
          id,
          title,
          description,
          type,
          status,
          visibility,
          element,
          gate,
          guardian,
          tags,
          thumbnail_url,
          like_count,
          view_count,
          user_id,
          created_at,
          updated_at
        )
      `)
      .eq('collection_id', id)
      .order('sort_order', { ascending: true });

    if (itemsError) {
      console.error('[collection GET items] Supabase error:', itemsError);
    }

    const mappedItems = (items || []).map((item) => {
      const creation = item.creations as Record<string, unknown> | null;
      return {
        id: item.id,
        sortOrder: item.sort_order,
        addedAt: item.added_at,
        creationId: item.creation_id,
        creation: creation
          ? {
              id: creation.id as string,
              title: creation.title as string,
              description: creation.description as string | null,
              type: creation.type as string,
              status: creation.status as string,
              visibility: creation.visibility as string,
              element: creation.element as string | null,
              gate: creation.gate as string | null,
              guardian: creation.guardian as string | null,
              tags: (creation.tags || []) as string[],
              thumbnailUrl: creation.thumbnail_url as string | null,
              likeCount: (creation.like_count || 0) as number,
              viewCount: (creation.view_count || 0) as number,
              userId: creation.user_id as string,
              createdAt: creation.created_at as string,
              updatedAt: creation.updated_at as string,
            }
          : null,
      };
    });

    return successResponse({
      collection: mapCollection(collection),
      items: mappedItems,
      itemCount: mappedItems.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/collections/[id]
 *
 * Body: { title?, description?, visibility?, coverUrl?, sortOrder? }
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const body = await parseRequestBody(request);
    if (!body) {
      return errorResponse('INVALID_INPUT', 'Invalid request body', 400);
    }

    const updateSchema = z.object({
      title: z.string().min(VALIDATION_RULES.title.minLength).max(VALIDATION_RULES.title.maxLength).optional(),
      description: z.string().max(VALIDATION_RULES.description.maxLength).nullable().optional(),
      visibility: z.enum(['public', 'private', 'unlisted']).optional(),
      coverUrl: z.string().url().nullable().optional(),
      sortOrder: z.number().int().min(0).optional(),
    });

    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid input', 400, {
        errors: validation.error.errors,
      });
    }

    const updates = validation.data;
    const payload: Record<string, unknown> = {};

    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.visibility !== undefined) payload.visibility = updates.visibility;
    if (updates.coverUrl !== undefined) payload.cover_url = updates.coverUrl;
    if (updates.sortOrder !== undefined) payload.sort_order = updates.sortOrder;

    if (Object.keys(payload).length === 0) {
      return errorResponse('INVALID_INPUT', 'No fields to update', 400);
    }

    const { data, error } = await supabaseServer
      .from('collections')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[collection PATCH] Supabase error:', error);
      return errorResponse('DATABASE_ERROR', 'Failed to update collection', 500);
    }

    if (!data) {
      return errorResponse('NOT_FOUND', 'Collection not found', 404);
    }

    return successResponse({ collection: mapCollection(data) });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/collections/[id]
 *
 * Deletes the collection and all its items (cascade via FK).
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Delete all collection_items first (in case no FK cascade)
    await supabaseServer
      .from('collection_items')
      .delete()
      .eq('collection_id', id);

    const { error } = await supabaseServer
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[collection DELETE] Supabase error:', error);
      return errorResponse('DATABASE_ERROR', 'Failed to delete collection', 500);
    }

    return successResponse({ deleted: true });
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
