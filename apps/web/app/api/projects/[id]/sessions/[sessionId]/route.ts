/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest } from 'next/server';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import {
  assignSessionToProjectForCurrentUser,
  detachSessionFromProjectForCurrentUser,
  getProjectAuthContext,
} from '@/lib/projects/server';
import { recordProjectTrace } from '@/lib/projects/trace';

type ProjectSessionRouteParams = Promise<{ id: string; sessionId: string }>;

export const projectSessionRouteDeps = {
  assignSessionToProjectForCurrentUser,
  detachSessionFromProjectForCurrentUser,
  getProjectAuthContext,
  recordProjectTrace,
};

export async function PATCH(
  _request: NextRequest,
  { params }: { params: ProjectSessionRouteParams },
) {
  try {
    const { id, sessionId } = await params;
    const { supabase, user } = await projectSessionRouteDeps.getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const session = await projectSessionRouteDeps.assignSessionToProjectForCurrentUser(id, sessionId);
    if (!session) {
      return errorResponse('NOT_FOUND', 'Session not found', 404);
    }

    await projectSessionRouteDeps.recordProjectTrace(supabase, {
      userId: user.id,
      projectId: id,
      action: 'project_updated',
      metadata: {
        change: 'session_linked',
        sessionId,
      },
    });

    return successResponse({ session });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: ProjectSessionRouteParams },
) {
  try {
    const { id, sessionId } = await params;
    const { supabase, user } = await projectSessionRouteDeps.getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const deleted = await projectSessionRouteDeps.detachSessionFromProjectForCurrentUser(id, sessionId);
    if (!deleted) {
      return errorResponse('NOT_FOUND', 'Session not found', 404);
    }

    await projectSessionRouteDeps.recordProjectTrace(supabase, {
      userId: user.id,
      projectId: id,
      action: 'project_updated',
      metadata: {
        change: 'session_detached',
        sessionId,
      },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
