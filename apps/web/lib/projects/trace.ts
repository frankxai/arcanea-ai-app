/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { SupabaseClient } from '@supabase/supabase-js';
import { createActivity } from '@/lib/database/services/activity-service';

export interface ProjectProviderRoutingTraceInput {
  requestedProvider?: string | null;
  resolvedProvider: string;
  routeMode: 'gateway' | 'legacy' | 'auto-detected';
  apiKeySource: 'server-env' | 'client-byok' | 'unknown';
  gatewayModel?: string | null;
  modelLabel: string;
  enabledTools?: string[];
  focusHint?: string | null;
  projectTitle?: string | null;
  activeGates?: string[];
  activeLuminors?: string[];
}

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
    | 'project_provider_routed';
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

export function buildProjectProviderRoutingTraceMetadata(
  input: ProjectProviderRoutingTraceInput,
): Record<string, unknown> {
  return {
    projectTitle: input.projectTitle ?? null,
    requestedProvider: input.requestedProvider ?? null,
    resolvedProvider: input.resolvedProvider,
    routeMode: input.routeMode,
    apiKeySource: input.apiKeySource,
    gatewayModel: input.gatewayModel ?? null,
    modelLabel: input.modelLabel,
    enabledTools: input.enabledTools ?? [],
    enabledToolCount: input.enabledTools?.length ?? 0,
    hasFocusHint: Boolean(input.focusHint),
    focusHint: input.focusHint ?? null,
    activeGates: input.activeGates ?? [],
    activeGateCount: input.activeGates?.length ?? 0,
    activeLuminors: input.activeLuminors ?? [],
    activeLuminorCount: input.activeLuminors?.length ?? 0,
  };
}
