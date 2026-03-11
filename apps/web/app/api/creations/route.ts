/**
 * Creations API Route
 *
 * GET /api/creations - List creations with filters
 * POST /api/creations - Create new creation
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  listCreations,
  createCreation,
} from '@/lib/database/services/creation-service';
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseRequestBody,
  parsePaginationParams,
} from '@/lib/api-utils';
import { VALIDATION_RULES, type CreationFilters } from '@/lib/database/types/api-responses';

/**
 * GET /api/creations
 *
 * Query parameters:
 * - type: text|image|video|audio|code|mixed
 * - element: Fire|Water|Earth|Wind|Void|Spirit
 * - gate: Foundation|Flow|Fire|Heart|Voice|Sight|Crown|Starweave|Unity|Source
 * - guardian: Lyssandria|Leyla|Draconia|Maylinn|Alera|Lyria|Aiyami|Elara|Ino|Shinkami
 * - status: draft|published|archived
 * - visibility: public|private|unlisted
 * - tags: Comma-separated tags
 * - sortBy: recent|popular|created_at|updated_at|like_count|view_count
 * - sortOrder: asc|desc
 * - page, pageSize
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseServer = await createClient();
    const { searchParams } = new URL(request.url);
    const { page, pageSize } = parsePaginationParams(searchParams);

    const filters: CreationFilters = { page, pageSize };

    const type = searchParams.get('type');
    if (type && ['text', 'image', 'video', 'audio', 'code', 'mixed'].includes(type)) {
      filters.type = type as CreationFilters['type'];
    }

    const element = searchParams.get('element');
    if (element) filters.element = element as CreationFilters['element'];

    const gate = searchParams.get('gate');
    if (gate) filters.gate = gate as CreationFilters['gate'];

    const guardian = searchParams.get('guardian');
    if (guardian) filters.guardian = guardian as CreationFilters['guardian'];

    const status = searchParams.get('status');
    if (status && ['draft', 'published', 'archived'].includes(status)) {
      filters.status = status as CreationFilters['status'];
    }

    const visibility = searchParams.get('visibility');
    if (visibility && ['public', 'private', 'unlisted'].includes(visibility)) {
      filters.visibility = visibility as CreationFilters['visibility'];
    }

    const tagsParam = searchParams.get('tags');
    if (tagsParam) {
      filters.tags = tagsParam.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    const sortBy = searchParams.get('sortBy');
    if (sortBy && ['recent', 'popular', 'created_at', 'updated_at', 'like_count', 'view_count'].includes(sortBy)) {
      filters.sortBy = sortBy as CreationFilters['sortBy'];
    }

    const sortOrder = searchParams.get('sortOrder');
    if (sortOrder && ['asc', 'desc'].includes(sortOrder)) {
      filters.sortOrder = sortOrder as CreationFilters['sortOrder'];
    }

    const result = await listCreations(supabaseServer, filters);

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/creations
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseServer = await createClient();
    const body = await parseRequestBody(request);
    if (!body) {
      return errorResponse('INVALID_INPUT', 'Invalid request body', 400);
    }

    const createSchema = z.object({
      userId: z.string().uuid(),
      title: z.string().min(VALIDATION_RULES.title.minLength).max(VALIDATION_RULES.title.maxLength),
      description: z.string().max(VALIDATION_RULES.description.maxLength).optional(),
      content: z.record(z.any()).optional(),
      type: z.enum(['text', 'image', 'video', 'audio', 'code', 'mixed']).default('text'),
      status: z.enum(['draft', 'published']).default('draft'),
      visibility: z.enum(['public', 'private', 'unlisted']).default('private'),
      element: z.enum(['Fire', 'Water', 'Earth', 'Wind', 'Void', 'Spirit']).optional(),
      gate: z.enum(['Foundation', 'Flow', 'Fire', 'Heart', 'Voice', 'Sight', 'Crown', 'Starweave', 'Unity', 'Source']).optional(),
      guardian: z.enum(['Lyssandria', 'Leyla', 'Draconia', 'Maylinn', 'Alera', 'Lyria', 'Aiyami', 'Elara', 'Ino', 'Shinkami']).optional(),
      tags: z.array(z.string().max(VALIDATION_RULES.tags.maxLength)).max(VALIDATION_RULES.tags.maxCount).optional(),
      thumbnailUrl: z.string().url().optional(),
      aiModel: z.string().max(100).optional(),
      aiPrompt: z.string().max(5000).optional(),
    });

    const validation = createSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid input', 400, { errors: validation.error.errors });
    }

    const { userId, ...creationData } = validation.data;

    const creation = await createCreation(supabaseServer, userId, creationData);

    return successResponse({ creation }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
