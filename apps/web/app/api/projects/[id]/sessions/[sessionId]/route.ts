import { NextRequest } from 'next/server';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import {
  assignSessionToProjectForCurrentUser,
  detachSessionFromProjectForCurrentUser,
  getProjectAuthContext,
} from '@/lib/projects/server';
import { recordProjectTrace } from '@/lib/projects/trace';

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<any> },
) {
  try {
    const { id, sessionId } = (await params) as { id: string; sessionId: string };
    const { supabase, user } = await getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const session = await assignSessionToProjectForCurrentUser(id, sessionId);
    if (!session) {
      return errorResponse('NOT_FOUND', 'Session not found', 404);
    }

    await recordProjectTrace(supabase, {
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
  { params }: { params: Promise<any> },
) {
  try {
    const { id, sessionId } = (await params) as { id: string; sessionId: string };
    const { supabase, user } = await getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const deleted = await detachSessionFromProjectForCurrentUser(id, sessionId);
    if (!deleted) {
      return errorResponse('NOT_FOUND', 'Session not found', 404);
    }

    await recordProjectTrace(supabase, {
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
