import { NextRequest } from 'next/server';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import {
  getProjectAuthContext,
  getProjectForCurrentUser,
  listProjectRunEventsForCurrentUser,
  listProjectRunsForCurrentUser,
  upsertProjectRunForCurrentUser,
  type ProjectRunUpsertInput,
} from '@/lib/projects/server';
import { recordProjectTrace } from '@/lib/projects/trace';

export const projectRunsRouteDeps = {
  getProjectAuthContext,
  getProjectForCurrentUser,
  listProjectRunsForCurrentUser,
  upsertProjectRunForCurrentUser,
  listProjectRunEventsForCurrentUser,
  recordProjectTrace,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: projectId } = await params;
    const { supabase, user } = await projectRunsRouteDeps.getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const project = await projectRunsRouteDeps.getProjectForCurrentUser(projectId);
    if (!project) {
      return errorResponse('NOT_FOUND', 'Project not found', 404);
    }

    const limit = Number(request.nextUrl.searchParams.get('limit') ?? '24');
    const runs = await projectRunsRouteDeps.listProjectRunsForCurrentUser(projectId, Number.isFinite(limit) ? limit : 24);

    await projectRunsRouteDeps.recordProjectTrace(supabase, {
      userId: user.id,
      projectId,
      action: 'project_run_list_viewed',
      metadata: {
        runCount: runs.length,
      },
    });

    return successResponse({ runs });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: projectId } = await params;
    const { supabase, user } = await projectRunsRouteDeps.getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const project = await projectRunsRouteDeps.getProjectForCurrentUser(projectId);
    if (!project) {
      return errorResponse('NOT_FOUND', 'Project not found', 404);
    }

    const body = (await request.json().catch(() => null)) as
      | { run?: ProjectRunUpsertInput; includeEvents?: boolean }
      | null;
    if (!body?.run) {
      return errorResponse('INVALID_INPUT', 'Run payload is required', 400);
    }

    const run = await projectRunsRouteDeps.upsertProjectRunForCurrentUser(projectId, body.run);
    if (!run) {
      return errorResponse('INTERNAL_ERROR', 'Failed to persist project run', 500);
    }

    const events = body.includeEvents
      ? await projectRunsRouteDeps.listProjectRunEventsForCurrentUser(projectId, run.id)
      : [];

    await projectRunsRouteDeps.recordProjectTrace(supabase, {
      userId: user.id,
      projectId,
      action: 'project_run_ingested',
      metadata: {
        runId: run.id,
        traceRunId: run.traceRunId,
        kind: run.kind,
        status: run.status,
        billingMode: run.billingMode,
        estimatedCredits: run.estimatedCredits,
      },
    });

    return successResponse({ run, events }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
