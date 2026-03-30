import { NextRequest } from 'next/server';
import { z } from 'zod';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import {
  assignCreationToProjectForCurrentUser,
  detachCreationFromProjectForCurrentUser,
  getProjectAuthContext,
} from '@/lib/projects/server';
import { recordProjectTrace } from '@/lib/projects/trace';

const creationPatchSchema = z.object({
  sourceSessionId: z.string().min(1).nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<any> },
) {
  try {
    const { id, creationId } = (await params) as { id: string; creationId: string };
    const body = await request.json().catch(() => ({}));
    const validation = creationPatchSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid creation link input', 400, {
        errors: validation.error.errors,
      });
    }

    const { supabase, user } = await getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const creation = await assignCreationToProjectForCurrentUser(
      id,
      creationId,
      validation.data.sourceSessionId,
    );
    if (!creation) {
      return errorResponse('NOT_FOUND', 'Creation not found', 404);
    }

    await recordProjectTrace(supabase, {
      userId: user.id,
      projectId: id,
      action: 'project_creation_linked',
      metadata: {
        creationId,
        sourceSessionId: validation.data.sourceSessionId ?? null,
      },
    });

    return successResponse({ creation });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<any> },
) {
  try {
    const { id, creationId } = (await params) as { id: string; creationId: string };
    const { supabase, user } = await getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const deleted = await detachCreationFromProjectForCurrentUser(id, creationId);
    if (!deleted) {
      return errorResponse('NOT_FOUND', 'Creation not found', 404);
    }

    await recordProjectTrace(supabase, {
      userId: user.id,
      projectId: id,
      action: 'project_updated',
      metadata: {
        change: 'creation_detached',
        creationId,
      },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
