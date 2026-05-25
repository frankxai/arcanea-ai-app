/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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

type ProjectCreationRouteParams = Promise<{ id: string; creationId: string }>;

export const projectCreationRouteDeps = {
  assignCreationToProjectForCurrentUser,
  detachCreationFromProjectForCurrentUser,
  getProjectAuthContext,
  recordProjectTrace,
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: ProjectCreationRouteParams },
) {
  try {
    const { id, creationId } = await params;
    const body = await request.json().catch(() => ({}));
    const validation = creationPatchSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Invalid creation link input', 400, {
        errors: validation.error.errors,
      });
    }

    const { supabase, user } = await projectCreationRouteDeps.getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const creation = await projectCreationRouteDeps.assignCreationToProjectForCurrentUser(
      id,
      creationId,
      validation.data.sourceSessionId,
    );
    if (!creation) {
      return errorResponse('NOT_FOUND', 'Creation not found', 404);
    }

    await projectCreationRouteDeps.recordProjectTrace(supabase, {
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
  { params }: { params: ProjectCreationRouteParams },
) {
  try {
    const { id, creationId } = await params;
    const { supabase, user } = await projectCreationRouteDeps.getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const deleted = await projectCreationRouteDeps.detachCreationFromProjectForCurrentUser(id, creationId);
    if (!deleted) {
      return errorResponse('NOT_FOUND', 'Creation not found', 404);
    }

    await projectCreationRouteDeps.recordProjectTrace(supabase, {
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
