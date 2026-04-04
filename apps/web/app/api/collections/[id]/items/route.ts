/**
 * Collection Items API Route
 *
 * POST /api/collections/[id]/items - Add a creation to the collection
 * DELETE /api/collections/[id]/items - Remove a creation from the collection
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseRequestBody,
} from '@/lib/api-utils';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/collections/[id]/items
 *
 * Body: { creationId }
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const supabaseServer = await createClient();
    const { id: collectionId } = await context.params;

    const body = await parseRequestBody(request);
    if (!body) {
      return errorResponse('INVALID_INPUT', 'Invalid request body', 400);
    }

    const addSchema = z.object({
      creationId: z.string().uuid(),
    });

    const validation = addSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid input', 400, {
        errors: validation.error.errors,
      });
    }

    const { creationId } = validation.data;

    // Run all three pre-insert checks in parallel
    const [
      { data: collection, error: collError },
      { data: existing },
      { data: lastItem },
    ] = await Promise.all([
      // Verify collection exists
      supabaseServer
        .from('collections')
        .select('id')
        .eq('id', collectionId)
        .single(),
      // Check for duplicate
      supabaseServer
        .from('collection_items')
        .select('id')
        .eq('collection_id', collectionId)
        .eq('creation_id', creationId)
        .maybeSingle(),
      // Determine next sort_order
      supabaseServer
        .from('collection_items')
        .select('sort_order')
        .eq('collection_id', collectionId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single(),
    ]);

    if (collError || !collection) {
      return errorResponse('NOT_FOUND', 'Collection not found', 404);
    }

    if (existing) {
      return errorResponse('ALREADY_EXISTS', 'Creation is already in this collection', 409);
    }

    const nextSortOrder = lastItem ? lastItem.sort_order + 1 : 0;

    const { data, error } = await supabaseServer
      .from('collection_items')
      .insert({
        collection_id: collectionId,
        creation_id: creationId,
        sort_order: nextSortOrder,
      })
      .select()
      .single();

    if (error) {
      console.error('[collection items POST] Supabase error:', error);
      return errorResponse('DATABASE_ERROR', 'Failed to add item to collection', 500);
    }

    return successResponse(
      {
        item: {
          id: data.id,
          collectionId: data.collection_id,
          creationId: data.creation_id,
          sortOrder: data.sort_order,
          addedAt: data.added_at,
        },
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/collections/[id]/items
 *
 * Body: { creationId }
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const supabaseServer = await createClient();
    const { id: collectionId } = await context.params;

    const body = await parseRequestBody(request);
    if (!body) {
      return errorResponse('INVALID_INPUT', 'Invalid request body', 400);
    }

    const removeSchema = z.object({
      creationId: z.string().uuid(),
    });

    const validation = removeSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid input', 400, {
        errors: validation.error.errors,
      });
    }

    const { creationId } = validation.data;

    const { error } = await supabaseServer
      .from('collection_items')
      .delete()
      .eq('collection_id', collectionId)
      .eq('creation_id', creationId);

    if (error) {
      console.error('[collection items DELETE] Supabase error:', error);
      return errorResponse('DATABASE_ERROR', 'Failed to remove item from collection', 500);
    }

    return successResponse({ removed: true });
  } catch (error) {
    return handleApiError(error);
  }
}
