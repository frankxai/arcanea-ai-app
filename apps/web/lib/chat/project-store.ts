/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import {
  clearProjectFromSessions,
  listChatSessions,
} from "@/lib/chat/local-store";
import { createClient } from "@/lib/supabase/client";
import {
  chatStorageKey,
  chatUserId,
  guestChatStorageScope,
  type ChatStorageScope,
} from "./storage-scope";

const PROJECTS_KEY = "arcanea_chat_projects";
const ACTIVE_PROJECT_KEY = "arcanea_active_chat_project";

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
  upsert(
    values: Record<string, unknown>,
    options?: { onConflict?: string },
  ): UntypedQueryBuilder;
}

interface UntypedCloudProjectClient {
  from(table: string): UntypedQueryBuilder;
}

function readProjects(scope: ChatStorageScope): ChatProject[] {
  if (typeof window === "undefined") return [];
  const key = chatStorageKey(PROJECTS_KEY, scope);
  if (!key) return [];

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeProjects(projects: ChatProject[], scope: ChatStorageScope): void {
  if (typeof window === "undefined") return;
  const key = chatStorageKey(PROJECTS_KEY, scope);
  if (!key) return;

  try {
    localStorage.setItem(key, JSON.stringify(projects));
  } catch {
    // ignore storage failures
  }
}

function mapCloudProject(row: Record<string, unknown>): ChatProject {
  return {
    id: String(row.id),
    title: String(row.title ?? "Untitled Project"),
    description:
      typeof row.description === "string" ? row.description : undefined,
    goal: typeof row.goal === "string" ? row.goal : undefined,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

function mergeProjects(
  localProjects: ChatProject[],
  cloudProjects: ChatProject[],
): ChatProject[] {
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

    if (
      new Date(project.updatedAt).getTime() >=
      new Date(existing.updatedAt).getTime()
    ) {
      merged.set(project.id, project);
    }
  }

  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

async function getCloudProjectClient(scope: ChatStorageScope) {
  const userId = chatUserId(scope);
  if (!userId) return null;
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!scope.isCurrent() || user?.id !== userId) return null;
    return {
      supabase: supabase as unknown as UntypedCloudProjectClient,
      userId,
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

export function listChatProjects(
  scope: ChatStorageScope = guestChatStorageScope,
): ChatProject[] {
  return readProjects(scope)
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}

export function loadChatProject(
  id: string,
  scope: ChatStorageScope = guestChatStorageScope,
): ChatProject | null {
  return readProjects(scope).find((project) => project.id === id) ?? null;
}

export function createChatProject(
  input: {
    title: string;
    description?: string;
    goal?: string;
  },
  scope: ChatStorageScope = guestChatStorageScope,
): ChatProject | null {
  if (!chatStorageKey(PROJECTS_KEY, scope)) return null;
  const title = input.title.trim();
  if (!title) return null;

  const now = new Date().toISOString();
  const project: ChatProject = {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`,
    title,
    description: input.description?.trim() || undefined,
    goal: input.goal?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  const projects = [project, ...readProjects(scope)];
  writeProjects(projects, scope);
  setActiveChatProject(project.id, scope);
  return project;
}

export function updateChatProject(
  id: string,
  patch: Partial<Pick<ChatProject, "title" | "description" | "goal">>,
  scope: ChatStorageScope = guestChatStorageScope,
): void {
  const projects = readProjects(scope).map((project) => {
    if (project.id !== id) return project;

    const nextTitle = patch.title?.trim();
    return touch({
      ...project,
      ...(nextTitle ? { title: nextTitle } : {}),
      ...(patch.description !== undefined
        ? { description: patch.description.trim() || undefined }
        : {}),
      ...(patch.goal !== undefined
        ? { goal: patch.goal.trim() || undefined }
        : {}),
    });
  });

  writeProjects(projects, scope);
}

export function renameChatProject(
  id: string,
  title: string,
  scope: ChatStorageScope = guestChatStorageScope,
): void {
  updateChatProject(id, { title }, scope);
}

export function deleteChatProject(
  id: string,
  scope: ChatStorageScope = guestChatStorageScope,
): void {
  writeProjects(
    readProjects(scope).filter((project) => project.id !== id),
    scope,
  );
  clearProjectFromSessions(id, scope);

  if (getActiveChatProjectId(scope) === id) {
    setActiveChatProject(null, scope);
  }
}

export function getActiveChatProjectId(
  scope: ChatStorageScope = guestChatStorageScope,
): string | null {
  if (typeof window === "undefined") return null;
  const key = chatStorageKey(ACTIVE_PROJECT_KEY, scope);
  if (!key) return null;

  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setActiveChatProject(
  projectId: string | null,
  scope: ChatStorageScope = guestChatStorageScope,
): void {
  if (typeof window === "undefined") return;
  const key = chatStorageKey(ACTIVE_PROJECT_KEY, scope);
  if (!key) return;

  try {
    if (projectId) {
      localStorage.setItem(key, projectId);
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // ignore storage failures
  }
}

export function getProjectSessionCount(
  projectId: string,
  scope: ChatStorageScope = guestChatStorageScope,
): number {
  return listChatSessions(scope).filter(
    (session) => session.projectId === projectId,
  ).length;
}

export async function syncProjectsFromCloud(
  scope: ChatStorageScope = guestChatStorageScope,
): Promise<ChatProject[]> {
  const cloud = await getCloudProjectClient(scope);
  if (!cloud) return listChatProjects(scope);

  const { data, error } = await cloud.supabase
    .from("chat_projects")
    .select("id, title, description, goal, created_at, updated_at")
    .eq("user_id", cloud.userId)
    .order("updated_at", { ascending: false });

  if (!scope.isCurrent() || error || !Array.isArray(data))
    return listChatProjects(scope);

  const merged = mergeProjects(
    readProjects(scope),
    (data as Record<string, unknown>[]).map(mapCloudProject),
  );
  writeProjects(merged, scope);
  return merged;
}

export async function saveProjectToCloud(
  project: ChatProject,
  scope: ChatStorageScope = guestChatStorageScope,
): Promise<boolean> {
  const cloud = await getCloudProjectClient(scope);
  if (!cloud) return false;

  const { error } = await cloud.supabase.from("chat_projects").upsert(
    {
      id: project.id,
      user_id: cloud.userId,
      title: project.title,
      description: project.description ?? null,
      goal: project.goal ?? null,
      updated_at: project.updatedAt,
    },
    { onConflict: "id" },
  );

  return scope.isCurrent() && !error;
}

export async function deleteProjectFromCloud(
  projectId: string,
  scope: ChatStorageScope = guestChatStorageScope,
): Promise<boolean> {
  const cloud = await getCloudProjectClient(scope);
  if (!cloud) return false;

  const { error } = await cloud.supabase
    .from("chat_projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", cloud.userId);

  return scope.isCurrent() && !error;
}

export async function assignCloudSessionToProject(
  sessionId: string,
  projectId: string | null,
  scope: ChatStorageScope = guestChatStorageScope,
): Promise<boolean> {
  const cloud = await getCloudProjectClient(scope);
  if (!cloud) return false;

  const { error } = await cloud.supabase
    .from("chat_sessions")
    .update({
      project_id: projectId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .eq("user_id", cloud.userId);

  return scope.isCurrent() && !error;
}

export async function loadProjectGraph(
  projectId: string,
  scope: ChatStorageScope = guestChatStorageScope,
): Promise<ProjectGraphSnapshot | null> {
  const cloud = await getCloudProjectClient(scope);
  if (!cloud) return null;

  const [sessionsRes, creationsRes, memoryLinksRes] = await Promise.all([
    cloud.supabase
      .from("chat_sessions")
      .select("id, title")
      .eq("user_id", cloud.userId)
      .eq("project_id", projectId)
      .order("updated_at", { ascending: false })
      .limit(5),
    cloud.supabase
      .from("creations")
      .select("id, title")
      .eq("user_id", cloud.userId)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(5),
    cloud.supabase
      .from("project_memory_links")
      .select("memory_id")
      .eq("user_id", cloud.userId)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (
    !scope.isCurrent() ||
    sessionsRes.error ||
    creationsRes.error ||
    memoryLinksRes.error
  )
    return null;

  const memoryIds = (
    (memoryLinksRes.data as Array<{ memory_id: string }> | null) ?? []
  ).map((row) => row.memory_id);

  const memoriesRes =
    memoryIds.length > 0
      ? await cloud.supabase
          .from("user_memories")
          .select("id, content")
          .eq("user_id", cloud.userId)
          .in("id", memoryIds)
          .limit(10)
      : { data: [] };

  if (!scope.isCurrent() || ("error" in memoriesRes && memoriesRes.error))
    return null;

  const sessionRows =
    (sessionsRes.data as Array<{ id: string; title?: string | null }> | null) ??
    [];
  const creationRows =
    (creationsRes.data as Array<{ title: string | null }> | null) ?? [];

  return {
    projectId,
    sessionCount: sessionRows.length,
    creationCount: creationRows.length,
    memoryCount: memoryIds.length,
    recentCreationTitles: creationRows.map(
      (row) => row.title ?? "Untitled creation",
    ),
    recentMemorySnippets: (
      (memoriesRes.data as Array<{ content: string }> | null) ?? []
    ).map((row) => row.content.slice(0, 120)),
  };
}
