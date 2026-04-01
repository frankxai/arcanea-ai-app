'use client';

import { clearProjectFromSessions, listChatSessions } from '@/lib/chat/local-store';
import { createClient } from '@/lib/supabase/client';

const PROJECTS_KEY = 'arcanea_chat_projects';
const ACTIVE_PROJECT_KEY = 'arcanea_active_chat_project';

export interface ChatProject {
  id: string;
  title: string;
  description?: string;
  goal?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectGraphSnapshot {
  projectId: string;
  sessionCount: number;
  creationCount: number;
  memoryCount: number;
  recentCreationTitles: string[];
  recentMemorySnippets: string[];
}

type UntypedQueryResult = PromiseLike<{ data: unknown; error?: unknown }>;

interface UntypedQueryBuilder extends UntypedQueryResult {
  delete(): UntypedQueryBuilder;
  eq(column: string, value: unknown): UntypedQueryBuilder;
  in(column: string, values: unknown[]): UntypedQueryBuilder;
  limit(count: number): UntypedQueryBuilder;
  order(column: string, options?: { ascending?: boolean }): UntypedQueryBuilder;
  select(columns: string): UntypedQueryBuilder;
  update(values: Record<string, unknown>): UntypedQueryBuilder;
  upsert(values: Record<string, unknown>, options?: { onConflict?: string }): UntypedQueryBuilder;
}

interface UntypedCloudProjectClient {
  from(table: string): UntypedQueryBuilder;
}

function readProjects(): ChatProject[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeProjects(projects: ChatProject[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch {
    // ignore storage failures
  }
}

function mapCloudProject(row: Record<string, unknown>): ChatProject {
  return {
    id: String(row.id),
    title: String(row.title ?? 'Untitled Project'),
    description: typeof row.description === 'string' ? row.description : undefined,
    goal: typeof row.goal === 'string' ? row.goal : undefined,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

function mergeProjects(localProjects: ChatProject[], cloudProjects: ChatProject[]): ChatProject[] {
  const merged = new Map<string, ChatProject>();

  for (const project of localProjects) {
    merged.set(project.id, project);
  }

  for (const project of cloudProjects) {
    const existing = merged.get(project.id);
    if (!existing) {
      merged.set(project.id, project);
      continue;
    }

    if (new Date(project.updatedAt).getTime() >= new Date(existing.updatedAt).getTime()) {
      merged.set(project.id, project);
    }
  }

  return Array.from(merged.values())
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

async function getCloudProjectClient() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return {
      supabase: supabase as unknown as UntypedCloudProjectClient,
      userId: user.id,
    };
  } catch {
    return null;
  }
}

function touch(project: ChatProject): ChatProject {
  return {
    ...project,
    updatedAt: new Date().toISOString(),
  };
}

export function listChatProjects(): ChatProject[] {
  return readProjects()
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function loadChatProject(id: string): ChatProject | null {
  return readProjects().find((project) => project.id === id) ?? null;
}

export function createChatProject(input: {
  title: string;
  description?: string;
  goal?: string;
}): ChatProject | null {
  const title = input.title.trim();
  if (!title) return null;

  const now = new Date().toISOString();
  const project: ChatProject = {
    id: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`,
    title,
    description: input.description?.trim() || undefined,
    goal: input.goal?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  const projects = [project, ...readProjects()];
  writeProjects(projects);
  setActiveChatProject(project.id);
  return project;
}

export function updateChatProject(
  id: string,
  patch: Partial<Pick<ChatProject, 'title' | 'description' | 'goal'>>,
): void {
  const projects = readProjects().map((project) => {
    if (project.id !== id) return project;

    const nextTitle = patch.title?.trim();
    return touch({
      ...project,
      ...(nextTitle ? { title: nextTitle } : {}),
      ...(patch.description !== undefined ? { description: patch.description.trim() || undefined } : {}),
      ...(patch.goal !== undefined ? { goal: patch.goal.trim() || undefined } : {}),
    });
  });

  writeProjects(projects);
}

export function renameChatProject(id: string, title: string): void {
  updateChatProject(id, { title });
}

export function deleteChatProject(id: string): void {
  writeProjects(readProjects().filter((project) => project.id !== id));
  clearProjectFromSessions(id);

  if (getActiveChatProjectId() === id) {
    setActiveChatProject(null);
  }
}

export function getActiveChatProjectId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem(ACTIVE_PROJECT_KEY);
  } catch {
    return null;
  }
}

export function setActiveChatProject(projectId: string | null): void {
  if (typeof window === 'undefined') return;

  try {
    if (projectId) {
      localStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
    } else {
      localStorage.removeItem(ACTIVE_PROJECT_KEY);
    }
  } catch {
    // ignore storage failures
  }
}

export function getProjectSessionCount(projectId: string): number {
  return listChatSessions().filter((session) => session.projectId === projectId).length;
}

export async function syncProjectsFromCloud(): Promise<ChatProject[]> {
  const cloud = await getCloudProjectClient();
  if (!cloud) return listChatProjects();

  const { data, error } = await cloud.supabase
    .from('chat_projects')
    .select('id, title, description, goal, created_at, updated_at')
    .eq('user_id', cloud.userId)
    .order('updated_at', { ascending: false });

  if (error || !data) return listChatProjects();

  const merged = mergeProjects(readProjects(), (data as Record<string, unknown>[]).map(mapCloudProject));
  writeProjects(merged);
  return merged;
}

export async function saveProjectToCloud(project: ChatProject): Promise<boolean> {
  const cloud = await getCloudProjectClient();
  if (!cloud) return false;

  const { error } = await cloud.supabase
    .from('chat_projects')
    .upsert({
      id: project.id,
      user_id: cloud.userId,
      title: project.title,
      description: project.description ?? null,
      goal: project.goal ?? null,
      updated_at: project.updatedAt,
    }, { onConflict: 'id' });

  return !error;
}

export async function deleteProjectFromCloud(projectId: string): Promise<boolean> {
  const cloud = await getCloudProjectClient();
  if (!cloud) return false;

  const { error } = await cloud.supabase
    .from('chat_projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', cloud.userId);

  return !error;
}

export async function assignCloudSessionToProject(
  sessionId: string,
  projectId: string | null,
): Promise<boolean> {
  const cloud = await getCloudProjectClient();
  if (!cloud) return false;

  const { error } = await cloud.supabase
    .from('chat_sessions')
    .update({
      project_id: projectId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .eq('user_id', cloud.userId);

  return !error;
}

export async function loadProjectGraph(projectId: string): Promise<ProjectGraphSnapshot | null> {
  const cloud = await getCloudProjectClient();
  if (!cloud) return null;

  const [sessionsRes, creationsRes, memoryLinksRes] = await Promise.all([
    cloud.supabase
      .from('chat_sessions')
      .select('id, title')
      .eq('user_id', cloud.userId)
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false })
      .limit(5),
    cloud.supabase
      .from('creations')
      .select('id, title')
      .eq('user_id', cloud.userId)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(5),
    cloud.supabase
      .from('project_memory_links')
      .select('memory_id')
      .eq('user_id', cloud.userId)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const memoryIds = ((memoryLinksRes.data as Array<{ memory_id: string }> | null) ?? []).map((row) => row.memory_id);

  const memoriesRes = memoryIds.length > 0
    ? await cloud.supabase
      .from('user_memories')
      .select('id, content')
      .in('id', memoryIds)
      .limit(10)
    : { data: [] };

  const sessionRows = (sessionsRes.data as Array<{ id: string; title?: string | null }> | null) ?? [];
  const creationRows = (creationsRes.data as Array<{ title: string | null }> | null) ?? [];

  return {
    projectId,
    sessionCount: sessionRows.length,
    creationCount: creationRows.length,
    memoryCount: memoryIds.length,
    recentCreationTitles: creationRows
      .map((row) => row.title ?? 'Untitled creation'),
    recentMemorySnippets: ((memoriesRes.data as Array<{ content: string }> | null) ?? [])
      .map((row) => row.content.slice(0, 120)),
  };
}
