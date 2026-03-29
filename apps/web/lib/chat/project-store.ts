'use client';

import { clearProjectFromSessions, listChatSessions } from '@/lib/chat/local-store';

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
    id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
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
