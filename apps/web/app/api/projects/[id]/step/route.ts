import { NextRequest } from 'next/server';
import { z } from 'zod';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import { buildProjectStepGuidance } from '@/lib/projects/progress';
import { getProjectAuthContext, getProjectWorkspaceForCurrentUser } from '@/lib/projects/server';
import { recordProjectTrace } from '@/lib/projects/trace';

const requestSchema = z.object({
  userInput: z.string().trim().min(1).max(2000),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { supabase, user } = await getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const body = await request.json().catch(() => null);
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Missing required field: userInput', 400, {
        errors: validation.error.errors,
      });
    }

    const workspace = await getProjectWorkspaceForCurrentUser(projectId);
    if (!workspace) {
      return errorResponse('NOT_FOUND', 'Project not found', 404);
    }

    const guidance = buildProjectStepGuidance(workspace, validation.data.userInput);

    await recordProjectTrace(supabase, {
      userId: user.id,
      projectId,
      action: 'project_graph_eval',
      metadata: {
        type: 'step_guidance',
        currentStep: guidance.currentStep,
        completionPercent: guidance.progress.completionPercent,
      },
    });

    return successResponse({
      projectId,
      ...guidance,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
