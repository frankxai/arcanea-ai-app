import { NextRequest } from 'next/server';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import { enrichProjectGraph, evaluateProjectWorkspace } from '@/lib/projects/enrichment';
import { getProjectAuthContext } from '@/lib/projects/server';
import { getProjectWorkspaceForCurrentUser } from '@/lib/projects/server';
import { recordProjectTrace } from '@/lib/projects/trace';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const workspace = await getProjectWorkspaceForCurrentUser(id);
    if (!workspace) {
      return errorResponse('NOT_FOUND', 'Project graph not found', 404);
    }

    const { supabase, user } = await getProjectAuthContext();
    const shouldEnrich = request.nextUrl.searchParams.get('enrich') === '1';
    const evaluation = evaluateProjectWorkspace(workspace);

    if (user) {
      await recordProjectTrace(supabase, {
        userId: user.id,
        projectId: id,
        action: 'project_graph_eval',
        metadata: { score: evaluation.score },
      });
    }

    let enrichment: Awaited<ReturnType<typeof enrichProjectGraph>> | null = null;
    if (shouldEnrich && user) {
      enrichment = await enrichProjectGraph(supabase, user.id, workspace);
      await recordProjectTrace(supabase, {
        userId: user.id,
        projectId: id,
        action: 'project_graph_enriched',
        metadata: {
          score: enrichment.evaluation.score,
          edgeCount: enrichment.edgeCount,
          factCount: enrichment.factCount,
        },
      });
    }

    return successResponse({ workspace, evaluation, enrichment });
  } catch (error) {
    return handleApiError(error);
  }
}
