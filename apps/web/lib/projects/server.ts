import { createClient } from '@/lib/supabase/server';
import type { ProjectWorkspaceEvaluation } from '@/lib/projects/enrichment';

export interface ProjectRecord {
  id: string;
  title: string;
  description: string | null;
  goal: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectWorkspaceSnapshot {
  project: ProjectRecord;
  sessions: Array<{
    id: string;
    title: string | null;
    updatedAt: string;
    luminorId: string | null;
    modelId: string | null;
  }>;
  creations: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    thumbnailUrl: string | null;
    createdAt: string;
    sourceSessionId: string | null;
  }>;
  memories: Array<{
    id: string;
    content: string;
    createdAt: string | null;
  }>;
  stats: {
    sessionCount: number;
    creationCount: number;
    memoryCount: number;
  };
}

export interface ProjectGraphSummaryRecord {
  summary: string;
  tags: string[];
  facts: string[];
  score: number;
  checks: ProjectWorkspaceEvaluation['checks'];
  updatedAt: string;
}

export interface ProjectActivityRecord {
  id: string;
  action: string;
  createdAt: string;
  metadata: Record<string, unknown> | null;
}

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;
type UntypedServerSupabase = ServerSupabase & {
  from: (table: string) => any;
};

function asUntyped(client: ServerSupabase): UntypedServerSupabase {
  return client as unknown as UntypedServerSupabase;
}

function mapProjectRow(row: Record<string, unknown>): ProjectRecord {
  return {
    id: String(row.id),
    title: String(row.title ?? 'Untitled Project'),
    description: typeof row.description === 'string' ? row.description : null,
    goal: typeof row.goal === 'string' ? row.goal : null,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

function mapGraphSummaryRow(row: Record<string, unknown>): ProjectGraphSummaryRecord {
  return {
    summary: typeof row.summary === 'string' ? row.summary : '',
    tags: Array.isArray(row.tags) ? row.tags.filter((tag): tag is string => typeof tag === 'string') : [],
    facts: Array.isArray(row.facts) ? row.facts.filter((fact): fact is string => typeof fact === 'string') : [],
    score: typeof row.score === 'number' ? row.score : 0,
    checks: Array.isArray(row.checks) ? row.checks as ProjectWorkspaceEvaluation['checks'] : [],
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

function mapProjectActivityRow(row: Record<string, unknown>): ProjectActivityRecord {
  return {
    id: String(row.id),
    action: String(row.action ?? 'project_updated'),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    metadata:
      row.metadata && typeof row.metadata === 'object'
        ? (row.metadata as Record<string, unknown>)
        : null,
  };
}

export async function getProjectAuthContext() {
  const supabase = await createClient();
  const db = asUntyped(supabase);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, db, user };
}

export async function listProjectsForCurrentUser(): Promise<ProjectRecord[]> {
  const { db, user } = await getProjectAuthContext();
  if (!user) return [];

  const { data, error } = await db
    .from('chat_projects')
    .select('id, title, description, goal, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error || !data) return [];

  return (data as Record<string, unknown>[]).map(mapProjectRow);
}

export async function createProjectForCurrentUser(input: {
  title: string;
  description?: string | null;
  goal?: string | null;
}): Promise<ProjectRecord | null> {
  const { db, user } = await getProjectAuthContext();
  if (!user) return null;

  const now = new Date().toISOString();
  const { data, error } = await db
    .from('chat_projects')
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description ?? null,
      goal: input.goal ?? null,
      created_at: now,
      updated_at: now,
    })
    .select('id, title, description, goal, created_at, updated_at')
    .single();

  if (error || !data) return null;

  return mapProjectRow(data as Record<string, unknown>);
}

export async function getProjectForCurrentUser(projectId: string): Promise<ProjectRecord | null> {
  const { db, user } = await getProjectAuthContext();
  if (!user) return null;

  const { data, error } = await db
    .from('chat_projects')
    .select('id, title, description, goal, created_at, updated_at')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single();

  if (error || !data) return null;

  return mapProjectRow(data as Record<string, unknown>);
}

export async function updateProjectForCurrentUser(
  projectId: string,
  patch: { title?: string; description?: string | null; goal?: string | null },
): Promise<ProjectRecord | null> {
  const { db, user } = await getProjectAuthContext();
  if (!user) return null;

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (patch.title !== undefined) payload.title = patch.title;
  if (patch.description !== undefined) payload.description = patch.description;
  if (patch.goal !== undefined) payload.goal = patch.goal;

  const { data, error } = await db
    .from('chat_projects')
    .update(payload)
    .eq('id', projectId)
    .eq('user_id', user.id)
    .select('id, title, description, goal, created_at, updated_at')
    .single();

  if (error || !data) return null;

  return mapProjectRow(data as Record<string, unknown>);
}

export async function deleteProjectForCurrentUser(projectId: string): Promise<boolean> {
  const { db, user } = await getProjectAuthContext();
  if (!user) return false;

  const { error } = await db
    .from('chat_projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', user.id);

  return !error;
}

export async function getProjectWorkspaceForCurrentUser(
  projectId: string,
): Promise<ProjectWorkspaceSnapshot | null> {
  const { db, user } = await getProjectAuthContext();
  if (!user) return null;

  const { data: projectRow, error: projectError } = await db
    .from('chat_projects')
    .select('id, title, description, goal, created_at, updated_at')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single();

  if (projectError || !projectRow) return null;

  const [sessionsRes, creationsRes, memoryLinksRes] = await Promise.all([
    db
      .from('chat_sessions')
      .select('id, title, updated_at, luminor_id, model_id')
      .eq('user_id', user.id)
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false })
      .limit(12),
    db
      .from('creations')
      .select('id, title, type, status, thumbnail_url, created_at, source_session_id')
      .eq('user_id', user.id)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(12),
    db
      .from('project_memory_links')
      .select('memory_id, created_at')
      .eq('user_id', user.id)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(24),
  ]);

  const linkedMemoryIds = ((memoryLinksRes.data as Array<{ memory_id: string }> | null) ?? [])
    .map((row) => row.memory_id)
    .filter(Boolean);

  const memoriesRes = linkedMemoryIds.length > 0
    ? await db
        .from('user_memories')
        .select('id, content, created_at')
        .in('id', linkedMemoryIds)
        .limit(12)
    : { data: [] as Array<{ id: string; content: string; created_at: string | null }> };

  const sessions = ((sessionsRes.data as Array<Record<string, unknown>> | null) ?? []).map((row) => ({
    id: String(row.id),
    title: typeof row.title === 'string' ? row.title : null,
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
    luminorId: typeof row.luminor_id === 'string' ? row.luminor_id : null,
    modelId: typeof row.model_id === 'string' ? row.model_id : null,
  }));

  const creations = ((creationsRes.data as Array<Record<string, unknown>> | null) ?? []).map((row) => ({
    id: String(row.id),
    title: String(row.title ?? 'Untitled Creation'),
    type: String(row.type ?? 'mixed'),
    status: String(row.status ?? 'draft'),
    thumbnailUrl: typeof row.thumbnail_url === 'string' ? row.thumbnail_url : null,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    sourceSessionId: typeof row.source_session_id === 'string' ? row.source_session_id : null,
  }));

  const memories = ((memoriesRes.data as Array<Record<string, unknown>> | null) ?? []).map((row) => ({
    id: String(row.id),
    content: String(row.content ?? ''),
    createdAt: typeof row.created_at === 'string' ? row.created_at : null,
  }));

  return {
    project: mapProjectRow(projectRow as Record<string, unknown>),
    sessions,
    creations,
    memories,
    stats: {
      sessionCount: sessions.length,
      creationCount: creations.length,
      memoryCount: linkedMemoryIds.length,
    },
  };
}

export async function getProjectGraphSummaryForCurrentUser(
  projectId: string,
): Promise<ProjectGraphSummaryRecord | null> {
  const { db, user } = await getProjectAuthContext();
  if (!user) return null;

  try {
    const { data, error } = await db
      .from('project_graph_summaries')
      .select('summary, tags, facts, score, checks, updated_at')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    if (error || !data) return null;

    return mapGraphSummaryRow(data as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function listProjectActivityForCurrentUser(
  projectId: string,
  limit = 12,
): Promise<ProjectActivityRecord[]> {
  const { db, user } = await getProjectAuthContext();
  if (!user) return [];

  try {
    const { data, error } = await db
      .from('activity_log')
      .select('id, action, metadata, created_at')
      .eq('user_id', user.id)
      .eq('entity_type', 'project')
      .eq('entity_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return (data as Record<string, unknown>[]).map(mapProjectActivityRow);
  } catch {
    return [];
  }
}
