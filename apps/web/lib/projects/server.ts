import { createClient } from '@/lib/supabase/server';

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
