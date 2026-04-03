import { NextRequest } from 'next/server';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import {
  getProjectAuthContext,
  getProjectForCurrentUser,
  inferProjectRunCostPreflight,
  type ProjectRunUpsertInput,
} from '@/lib/projects/server';
import { recordProjectTrace } from '@/lib/projects/trace';

export const projectRunPreflightRouteDeps = {
  getProjectAuthContext,
  getProjectForCurrentUser,
  inferProjectRunCostPreflight,
  recordProjectTrace,
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: projectId } = await params;
    const { supabase, user } = await projectRunPreflightRouteDeps.getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const project = await projectRunPreflightRouteDeps.getProjectForCurrentUser(projectId);
    if (!project) {
      return errorResponse('NOT_FOUND', 'Project not found', 404);
    }

    const body = (await request.json().catch(() => null)) as Partial<ProjectRunUpsertInput> | null;
    if (!body?.kind || !body.repoId || !body.repoPath || !body.commandName || !body.commandPreview || !body.traceRunId) {
      return errorResponse(
        'INVALID_INPUT',
        'kind, traceRunId, repoId, repoPath, commandName, and commandPreview are required',
        400,
      );
    }

    const preflight = projectRunPreflightRouteDeps.inferProjectRunCostPreflight({
      traceRunId: body.traceRunId,
      kind: body.kind,
      status: body.status ?? 'queued',
      runtime: body.runtime,
      provider: body.provider,
      repoId: body.repoId,
      repoPath: body.repoPath,
      commandName: body.commandName,
      commandPreview: body.commandPreview,
      executionMode: body.executionMode ?? 'delegated',
      sourceTracePath: body.sourceTracePath,
      sourceDocId: body.sourceDocId,
      sourceCreationId: body.sourceCreationId,
      sourceCollectionId: body.sourceCollectionId,
      sourcePromptId: body.sourcePromptId,
      sourcePromptCollectionId: body.sourcePromptCollectionId,
      startedAt: body.startedAt ?? new Date().toISOString(),
      finishedAt: body.finishedAt,
      durationMs: body.durationMs,
      metadata: body.metadata,
      cost: body.cost,
      events: body.events,
    });

    await projectRunPreflightRouteDeps.recordProjectTrace(supabase, {
      userId: user.id,
      projectId,
      action: 'project_run_cost_preflight',
      metadata: {
        kind: body.kind,
        repoId: body.repoId,
        billingMode: preflight.billingMode,
        estimatedCredits: preflight.estimatedCredits,
        estimatedUsd: preflight.estimatedUsd,
        byokEligible: preflight.byokEligible,
      },
    });

    return successResponse({ preflight });
  } catch (error) {
    return handleApiError(error);
  }
}
