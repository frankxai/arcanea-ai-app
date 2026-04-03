import { NextRequest } from 'next/server';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import {
  getProjectAuthContext,
  getProjectForCurrentUser,
  getProjectRunForCurrentUser,
  listProjectRunEventsForCurrentUser,
} from '@/lib/projects/server';
import { recordProjectTrace } from '@/lib/projects/trace';

export const projectRunRouteDeps = {
  getProjectAuthContext,
  getProjectForCurrentUser,
  getProjectRunForCurrentUser,
  listProjectRunEventsForCurrentUser,
  recordProjectTrace,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; runId: string }> },
) {
  try {
    const { id: projectId, runId } = await params;
    const { supabase, user } = await projectRunRouteDeps.getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const project = await projectRunRouteDeps.getProjectForCurrentUser(projectId);
    if (!project) {
      return errorResponse('NOT_FOUND', 'Project not found', 404);
    }

    const run = await projectRunRouteDeps.getProjectRunForCurrentUser(projectId, runId);
    if (!run) {
      return errorResponse('NOT_FOUND', 'Run not found', 404);
    }

    const events = await projectRunRouteDeps.listProjectRunEventsForCurrentUser(projectId, runId);

    await projectRunRouteDeps.recordProjectTrace(supabase, {
      userId: user.id,
      projectId,
      action: 'project_run_viewed',
      metadata: {
        runId,
        traceRunId: run.traceRunId,
        status: run.status,
      },
    });

    return successResponse({ run, events });
  } catch (error) {
    return handleApiError(error);
  }
}
