/**
 * User Memories API Route
 *
 * GET    /api/memories       — List authenticated user's memories (grouped by category)
 * POST   /api/memories       — Save a new memory
 * DELETE  /api/memories?id=   — Delete a specific memory
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  handleApiError,
} from '@/lib/api-utils';

const MAX_MEMORIES_PER_USER = 100;
// The user_memories table exists at runtime but is currently missing from the
// generated Supabase types. Keep this route runtime-safe without blocking the
// wider app on stale schema codegen.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UntypedClient = any;

interface MemoryRow {
  id: string;
  content: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

const VALID_CATEGORIES = [
  'preference',
  'background',
  'goal',
  'project',
  'style',
  'general',
] as const;

const createMemorySchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(500, 'Content must be 500 characters or fewer'),
  category: z.enum(VALID_CATEGORIES).default('general'),
  projectId: z.string().uuid().optional(),
});

/**
 * GET /api/memories
 *
 * Returns all memories for the authenticated user, grouped by category.
 */
export async function GET() {
  try {
    const supabase = (await createClient()) as UntypedClient;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const { data: memories, error } = await supabase
      .from('user_memories')
      .select('id, content, category, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch memories:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to fetch memories', 500);
    }

    // Group by category
    const grouped: Record<string, MemoryRow[]> = {};
    for (const cat of VALID_CATEGORIES) {
      grouped[cat] = [];
    }
    for (const mem of (memories ?? []) as MemoryRow[]) {
      const cat = mem.category as string;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(mem);
    }

    return successResponse({
      memories: memories ?? [],
      grouped,
      total: memories?.length ?? 0,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/memories
 *
 * Body: { content: string, category?: string }
 * Enforces max 100 memories per user and 500 char limit.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = (await createClient()) as UntypedClient;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse('INVALID_INPUT', 'Invalid request body', 400);
    }

    const validation = createMemorySchema.safeParse(body);
    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid input', 400, {
        errors: validation.error.errors,
      });
    }

    // Check memory count limit
    const { count, error: countError } = await supabase
      .from('user_memories')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      console.error('Failed to count memories:', countError);
      return errorResponse('INTERNAL_ERROR', 'Failed to check memory limit', 500);
    }

    if ((count ?? 0) >= MAX_MEMORIES_PER_USER) {
      return errorResponse(
        'CONFLICT',
        `Memory limit reached (${MAX_MEMORIES_PER_USER}). Delete old memories before adding new ones.`,
        422
      );
    }

    // Check for duplicate/similar memories before inserting
    const { data: existing } = await supabase
      .from('user_memories')
      .select('id, content')
      .eq('user_id', user.id)
      .eq('category', validation.data.category);

    if (existing) {
      const newContentLower = validation.data.content.toLowerCase();
      const duplicate = (existing as MemoryRow[]).find((m) => {
        const existingLower = m.content.toLowerCase();
        const snippet = newContentLower.slice(0, 50);
        return (
          existingLower.includes(snippet) ||
          newContentLower.includes(existingLower.slice(0, 50))
        );
      });
      if (duplicate) {
        // Update existing memory instead of creating a duplicate
        await supabase
          .from('user_memories')
          .update({
            content: validation.data.content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', duplicate.id);

        if (validation.data.projectId) {
          await supabase
            .from('project_memory_links')
            .upsert({
              project_id: validation.data.projectId,
              user_id: user.id,
              memory_id: duplicate.id,
            }, { onConflict: 'project_id,memory_id' });
        }

        // Fire-and-forget: re-embed the updated memory
        import('@/lib/memory/semantic').then(({ embedMemory }) => {
          embedMemory(supabase, duplicate.id, validation.data.content).catch(() => {});
        });

        return successResponse(
          { memory: { ...duplicate, content: validation.data.content }, updated: true },
          200,
        );
      }
    }

    const { data: memory, error: insertError } = await supabase
      .from('user_memories')
      .insert({
        user_id: user.id,
        content: validation.data.content,
        category: validation.data.category,
      })
      .select('id, content, category, created_at')
      .single();

    if (insertError) {
      console.error('Failed to insert memory:', insertError);
      return errorResponse('INTERNAL_ERROR', 'Failed to save memory', 500);
    }

    // Fire-and-forget: embed the new memory for semantic search
    if (memory?.id) {
      if (validation.data.projectId) {
        await supabase
          .from('project_memory_links')
          .upsert({
            project_id: validation.data.projectId,
            user_id: user.id,
            memory_id: memory.id,
          }, { onConflict: 'project_id,memory_id' });
      }

      import('@/lib/memory/semantic').then(({ embedMemory }) => {
        embedMemory(supabase, memory.id, validation.data.content).catch(() => {});
      });
    }

    return successResponse({ memory }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/memories?id=<uuid>
 *
 * Deletes a specific memory owned by the authenticated user.
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = (await createClient()) as UntypedClient;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const { searchParams } = new URL(request.url);
    const memoryId = searchParams.get('id');

    if (!memoryId) {
      return errorResponse('INVALID_INPUT', 'Memory ID is required (?id=<uuid>)', 400);
    }

    // UUID format validation
    const uuidSchema = z.string().uuid();
    const uuidResult = uuidSchema.safeParse(memoryId);
    if (!uuidResult.success) {
      return errorResponse('INVALID_INPUT', 'Invalid memory ID format', 400);
    }

    const { error: deleteError } = await supabase
      .from('user_memories')
      .delete()
      .eq('id', memoryId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Failed to delete memory:', deleteError);
      return errorResponse('INTERNAL_ERROR', 'Failed to delete memory', 500);
    }

    return successResponse({ deleted: memoryId });
  } catch (error) {
    return handleApiError(error);
  }
}
