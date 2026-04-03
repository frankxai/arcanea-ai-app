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
  docs: Array<{
    id: string;
    title: string;
    docType: string;
    status: string;
    updatedAt: string;
    wordCount: number;
    excerpt: string | null;
  }>;
  memories: Array<{
    id: string;
    content: string;
    createdAt: string | null;
  }>;
  stats: {
    sessionCount: number;
    creationCount: number;
    docCount: number;
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

export interface ProjectSessionRecord {
  id: string;
  title: string | null;
  updatedAt: string;
  luminorId: string | null;
  modelId: string | null;
  projectId?: string | null;
}

export interface ProjectCreationRecord {
  id: string;
  title: string;
  type: string;
  status: string;
  thumbnailUrl: string | null;
  createdAt: string;
  sourceSessionId: string | null;
  projectId?: string | null;
}

export interface ProjectDocRecord {
  id: string;
  title: string;
  docType: string;
  status: string;
  updatedAt: string;
  wordCount: number;
  excerpt: string | null;
}

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;
type UntypedQueryResult = PromiseLike<{ data: unknown; error?: unknown }>;

interface UntypedQueryBuilder extends UntypedQueryResult {
  delete(): UntypedQueryBuilder;
  eq(column: string, value: unknown): UntypedQueryBuilder;
  in(column: string, values: unknown[]): UntypedQueryBuilder;
  insert(values: Record<string, unknown>): UntypedQueryBuilder;
  limit(count: number): UntypedQueryBuilder;
  or(filters: string): UntypedQueryBuilder;
  order(column: string, options?: { ascending?: boolean }): UntypedQueryBuilder;
  select(columns: string): UntypedQueryBuilder;
  single(): UntypedQueryBuilder;
  update(values: Record<string, unknown>): UntypedQueryBuilder;
}

type UntypedServerSupabase = ServerSupabase & {
  from: (table: string) => UntypedQueryBuilder;
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

function mapSessionRow(row: Record<string, unknown>): ProjectSessionRecord {
  return {
    id: String(row.id),
    title: typeof row.title === 'string' ? row.title : null,
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
    luminorId: typeof row.luminor_id === 'string' ? row.luminor_id : null,
    modelId: typeof row.model_id === 'string' ? row.model_id : null,
    projectId: typeof row.project_id === 'string' ? row.project_id : null,
  };
}

function mapCreationRow(row: Record<string, unknown>): ProjectCreationRecord {
  return {
    id: String(row.id),
    title: String(row.title ?? 'Untitled Creation'),
    type: String(row.type ?? 'mixed'),
    status: String(row.status ?? 'draft'),
    thumbnailUrl: typeof row.thumbnail_url === 'string' ? row.thumbnail_url : null,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    sourceSessionId: typeof row.source_session_id === 'string' ? row.source_session_id : null,
    projectId: typeof row.project_id === 'string' ? row.project_id : null,
  };
}

function mapDocRow(
  row: Record<string, unknown> & {
    project_doc_content?: Array<{ content_text?: string | null; word_count?: number | null }>;
  },
): ProjectDocRecord {
  const content = Array.isArray(row.project_doc_content) ? row.project_doc_content[0] : null;
  const excerpt =
    typeof content?.content_text === 'string' && content.content_text.trim().length > 0
      ? content.content_text.trim().slice(0, 220)
      : null;

  return {
    id: String(row.id),
    title: String(row.title ?? 'Untitled Doc'),
    docType: String(row.doc_type ?? 'note'),
    status: String(row.status ?? 'draft'),
    updatedAt: String(row.updated_at ?? row.last_edited_at ?? new Date().toISOString()),
    wordCount: typeof content?.word_count === 'number' ? content.word_count : 0,
    excerpt,
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

  const [sessionsRes, creationsRes, docsRes, memoryLinksRes] = await Promise.all([
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
      .from('project_docs')
      .select(`
        id, title, doc_type, status, updated_at, last_edited_at,
        project_doc_content ( content_text, word_count )
      `)
      .eq('user_id', user.id)
      .eq('project_id', projectId)
      .order('last_edited_at', { ascending: false })
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

  const sessions = ((sessionsRes.data as Array<Record<string, unknown>> | null) ?? []).map(mapSessionRow);

  const creations = ((creationsRes.data as Array<Record<string, unknown>> | null) ?? []).map(mapCreationRow);
  const docs = (
    (docsRes.data as Array<
      Record<string, unknown> & {
        project_doc_content?: Array<{ content_text?: string | null; word_count?: number | null }>;
      }
    > | null) ?? []
  ).map(mapDocRow);

  const memories = ((memoriesRes.data as Array<Record<string, unknown>> | null) ?? []).map((row) => ({
    id: String(row.id),
    content: String(row.content ?? ''),
    createdAt: typeof row.created_at === 'string' ? row.created_at : null,
  }));

  return {
    project: mapProjectRow(projectRow as Record<string, unknown>),
    sessions,
    creations,
    docs,
    memories,
    stats: {
      sessionCount: sessions.length,
      creationCount: creations.length,
      docCount: docs.length,
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

export async function listProjectCandidateSessionsForCurrentUser(
  projectId: string,
  limit = 8,
): Promise<ProjectSessionRecord[]> {
  const { db, user } = await getProjectAuthContext();
  if (!user) return [];

  try {
    const { data, error } = await db
      .from('chat_sessions')
      .select('id, title, updated_at, luminor_id, model_id, project_id')
      .eq('user_id', user.id)
      .or(`project_id.is.null,project_id.neq.${projectId}`)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return (data as Record<string, unknown>[]).map(mapSessionRow);
  } catch {
    return [];
  }
}

export async function listProjectCandidateCreationsForCurrentUser(
  projectId: string,
  limit = 8,
): Promise<ProjectCreationRecord[]> {
  const { db, user } = await getProjectAuthContext();
  if (!user) return [];

  try {
    const { data, error } = await db
      .from('creations')
      .select('id, title, type, status, thumbnail_url, created_at, source_session_id, project_id')
      .eq('user_id', user.id)
      .or(`project_id.is.null,project_id.neq.${projectId}`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return (data as Record<string, unknown>[]).map(mapCreationRow);
  } catch {
    return [];
  }
}

export async function assignSessionToProjectForCurrentUser(
  projectId: string,
  sessionId: string,
): Promise<ProjectSessionRecord | null> {
  const { db, user } = await getProjectAuthContext();
  if (!user) return null;

  const { data, error } = await db
    .from('chat_sessions')
    .update({
      project_id: projectId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .select('id, title, updated_at, luminor_id, model_id, project_id')
    .single();

  if (error || !data) return null;
  return mapSessionRow(data as Record<string, unknown>);
}

export async function detachSessionFromProjectForCurrentUser(
  projectId: string,
  sessionId: string,
): Promise<boolean> {
  const { db, user } = await getProjectAuthContext();
  if (!user) return false;

  const { error } = await db
    .from('chat_sessions')
    .update({
      project_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .eq('project_id', projectId);

  return !error;
}

export async function assignCreationToProjectForCurrentUser(
  projectId: string,
  creationId: string,
  sourceSessionId?: string | null,
): Promise<ProjectCreationRecord | null> {
  const { db, user } = await getProjectAuthContext();
  if (!user) return null;

  const payload: Record<string, unknown> = {
    project_id: projectId,
  };
  if (sourceSessionId !== undefined) {
    payload.source_session_id = sourceSessionId;
  }

  const { data, error } = await db
    .from('creations')
    .update(payload)
    .eq('id', creationId)
    .eq('user_id', user.id)
    .select('id, title, type, status, thumbnail_url, created_at, source_session_id, project_id')
    .single();

  if (error || !data) return null;
  return mapCreationRow(data as Record<string, unknown>);
}

export async function detachCreationFromProjectForCurrentUser(
  projectId: string,
  creationId: string,
): Promise<boolean> {
  const { db, user } = await getProjectAuthContext();
  if (!user) return false;

  const { error } = await db
    .from('creations')
    .update({
      project_id: null,
    })
    .eq('id', creationId)
    .eq('user_id', user.id)
    .eq('project_id', projectId);

  return !error;
}
