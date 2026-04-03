import type { SupabaseClient } from '@supabase/supabase-js';
import { createActivity } from '@/lib/database/services/activity-service';

export interface ProjectTraceInput {
  userId: string;
  projectId: string;
  action:
    | 'project_created'
    | 'project_updated'
    | 'project_deleted'
    | 'project_chat_context_loaded'
    | 'project_creation_linked'
    | 'project_memory_linked'
    | 'project_graph_enriched'
    | 'project_graph_eval'
    | 'project_graph_viewed'
    | 'project_provider_routed'
    | 'project_run_ingested'
    | 'project_run_viewed'
    | 'project_run_list_viewed'
    | 'project_run_cost_preflight';
  metadata?: Record<string, unknown>;
}

export async function recordProjectTrace(
  supabase: SupabaseClient,
  input: ProjectTraceInput,
): Promise<void> {
  try {
    await createActivity(supabase, {
      userId: input.userId,
      action: input.action,
      entityType: 'project',
      entityId: input.projectId,
      metadata: input.metadata,
    });
  } catch (error) {
    console.warn('[projects/trace] failed to record trace', error);
  }
}
