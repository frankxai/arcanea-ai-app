/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest } from 'next/server';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import { buildProjectCompletionSummary } from '@/lib/projects/progress';
import { getProjectAuthContext, getProjectWorkspaceForCurrentUser } from '@/lib/projects/server';
import { recordProjectTrace } from '@/lib/projects/trace';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { supabase, user } = await getProjectAuthContext();
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    const workspace = await getProjectWorkspaceForCurrentUser(projectId);
    if (!workspace) {
      return errorResponse('NOT_FOUND', 'Project not found', 404);
    }

    const completion = buildProjectCompletionSummary(workspace);

    await recordProjectTrace(supabase, {
      userId: user.id,
      projectId,
      action: 'project_graph_eval',
      metadata: {
        type: 'completion_check',
        ready: completion.ready,
        completionPercent: completion.progress.completionPercent,
      },
    });

    return successResponse({
      projectId,
      status: completion.status,
      message: completion.summary,
      results: {
        summary: completion.summary,
        artifacts: workspace.creations.map((creation) => ({
          id: creation.id,
          title: creation.title,
          type: creation.type,
          sourceSessionId: creation.sourceSessionId,
        })),
        progress: completion.progress,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
