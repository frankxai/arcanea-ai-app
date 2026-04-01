import { NextRequest } from 'next/server';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-utils';
import {
  buildProjectGraphView,
  enrichProjectGraph,
  evaluateProjectWorkspace,
} from '@/lib/projects/enrichment';
import {
  getProjectAuthContext,
  getProjectGraphSummaryForCurrentUser,
  getProjectWorkspaceForCurrentUser,
} from '@/lib/projects/server';
import { recordProjectTrace } from '@/lib/projects/trace';

export const projectGraphRouteDeps = {
  buildProjectGraphView,
  enrichProjectGraph,
  evaluateProjectWorkspace,
  getProjectAuthContext,
  getProjectGraphSummaryForCurrentUser,
  getProjectWorkspaceForCurrentUser,
  recordProjectTrace,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const workspace = await projectGraphRouteDeps.getProjectWorkspaceForCurrentUser(id);
    if (!workspace) {
      return errorResponse('NOT_FOUND', 'Project graph not found', 404);
    }

    const { supabase, user } = await projectGraphRouteDeps.getProjectAuthContext();
    const shouldEnrich = request.nextUrl.searchParams.get('enrich') === '1';
    const evaluation = projectGraphRouteDeps.evaluateProjectWorkspace(workspace);
    const persistedSummary = await projectGraphRouteDeps.getProjectGraphSummaryForCurrentUser(id);
    const { graph: graphView } = projectGraphRouteDeps.buildProjectGraphView(
      workspace,
      persistedSummary,
      persistedSummary ? 'stored' : 'derived',
    );

    if (user) {
      await projectGraphRouteDeps.recordProjectTrace(supabase, {
        userId: user.id,
        projectId: id,
        action: 'project_graph_viewed',
        metadata: {
          score: graphView.score,
          source: graphView.source,
          hasPersistedSummary: Boolean(persistedSummary),
          enrichRequested: shouldEnrich,
        },
      });
    }

    let enrichment: Awaited<ReturnType<typeof enrichProjectGraph>> | null = null;
    if (shouldEnrich && user) {
      enrichment = await projectGraphRouteDeps.enrichProjectGraph(supabase, user.id, workspace);
      graphView.summary = enrichment.summary;
      graphView.tags = enrichment.tags;
      graphView.score = enrichment.evaluation.score;
      graphView.checks = enrichment.evaluation.checks;
      graphView.source = 'enriched';
      await projectGraphRouteDeps.recordProjectTrace(supabase, {
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

    return successResponse({ workspace, evaluation, graph: graphView, enrichment });
  } catch (error) {
    return handleApiError(error);
  }
}
