'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { analytics } from '@/lib/analytics/events';
import {
  assignSessionToProject,
  deleteChatSession,
  getActiveChatSessionId,
  listChatSessions,
  loadChatSession,
  mergeChatSessions,
  newSessionId,
  renameChatSession,
  saveChatSession,
  searchSessions,
  setActiveChatSessionId,
  togglePinSession,
  type ChatMessage,
  type ChatSession,
  type ChatSessionSummary,
} from '@/lib/chat/local-store';
import {
  createChatProject,
  assignCloudSessionToProject,
  deleteProjectFromCloud,
  deleteChatProject,
  getActiveChatProjectId,
  listChatProjects,
  loadChatProject,
  renameChatProject,
  saveProjectToCloud,
  setActiveChatProject,
  syncProjectsFromCloud,
  type ChatProject,
} from '@/lib/chat/project-store';
import {
  cloudSessionToLocalSession,
  deleteCloudSession,
  loadCloudSessions,
  renameCloudSession,
  saveSessionToCloud,
} from '@/lib/chat/supabase-store';

const SIDEBAR_KEY = 'arcanea-sidebar-expanded';
const MOBILE_BREAKPOINT = 768;

function getInitialExpanded(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    // Only expand if user explicitly expanded before; first visit is always collapsed
    if (stored !== null) return stored === 'true';
    return false;
  } catch {
    return false;
  }
}

function persistExpanded(value: boolean): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(SIDEBAR_KEY, String(value));
  } catch {
    // ignore localStorage failures
  }
}

export interface UseChatSessionsReturn {
  allSessions: ChatSessionSummary[];
  sessions: ChatSessionSummary[];
  projects: ChatProject[];
  activeProject: ChatProject | null;
  activeProjectId: string | null;
  activeSessionId: string;
  isSidebarExpanded: boolean;
  searchQuery: string;
  isHydrating: boolean;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  setActiveProject: (projectId: string | null) => void;
  setActiveSession: (sessionId: string) => void;
  loadSession: (id: string) => ChatSession | null;
  saveMessages: (
    messages: ChatMessage[],
    opts?: { luminorId?: string | null; modelId?: string | null; projectId?: string | null },
  ) => void;
  newSession: () => string;
  deleteSession: (id: string) => void;
  renameSession: (id: string, title: string) => void;
  togglePin: (id: string) => void;
  createProject: (title: string) => ChatProject | null;
  renameProject: (id: string, title: string) => void;
  deleteProject: (id: string) => void;
  assignSessionProject: (sessionId: string, projectId: string | null) => void;
  refreshSessions: () => Promise<void>;
}

export function useChatSessions(): UseChatSessionsReturn {
  const [activeSessionId, setActiveSessionId] = useState<string>(() => getActiveChatSessionId() ?? newSessionId());
  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => getActiveChatProjectId());
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => getInitialExpanded());
  const [searchQuery, setSearchQuery] = useState('');
  const [isHydrating, setIsHydrating] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncCloudSessions = useCallback(async () => {
    const cloudSessions = await loadCloudSessions();
    if (cloudSessions.length === 0) return;

    mergeChatSessions(cloudSessions.map(cloudSessionToLocalSession));
  }, []);

  const refreshSessions = useCallback(async () => {
    setRefreshTick((tick) => tick + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      await syncCloudSessions();
      await syncProjectsFromCloud();
      if (!cancelled) {
        setRefreshTick((tick) => tick + 1);
        setIsHydrating(false);
      }
    }

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [refreshSessions, syncCloudSessions]);

  useEffect(() => {
    function handleFocus() {
      void syncCloudSessions()
        .then(async () => {
          await syncProjectsFromCloud();
          setRefreshTick((tick) => tick + 1);
        })
        .catch(() => {});
    }

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshSessions, syncCloudSessions]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const setActiveSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
    setActiveChatSessionId(sessionId);
  }, []);

  const setProject = useCallback((projectId: string | null) => {
    setActiveProjectId(projectId);
    setActiveChatProject(projectId);
    analytics.projectSelected(projectId);
    refreshSessions();
  }, [refreshSessions]);

  const loadSession = useCallback((id: string): ChatSession | null => {
    const session = loadChatSession(id);
    if (session) {
      setActiveSessionId(id);
      setActiveChatSessionId(id);
      setActiveProjectId(session.projectId ?? null);
      setActiveChatProject(session.projectId ?? null);
    }
    return session;
  }, []);

  const saveMessages = useCallback((
    messages: ChatMessage[],
    opts?: { luminorId?: string | null; modelId?: string | null; projectId?: string | null },
  ) => {
    if (messages.length === 0) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const resolvedProjectId = opts?.projectId ?? loadChatSession(activeSessionId)?.projectId ?? activeProjectId;

      saveChatSession(activeSessionId, messages, {
        ...opts,
        projectId: resolvedProjectId,
      });
      refreshSessions();

      void saveSessionToCloud({
        id: activeSessionId,
        title: loadChatSession(activeSessionId)?.title || 'New Chat',
        messages: messages as unknown as Record<string, unknown>[],
        luminorId: opts?.luminorId ?? null,
        modelId: opts?.modelId ?? null,
        projectId: resolvedProjectId,
      });
    }, 600);
  }, [activeProjectId, activeSessionId, refreshSessions]);

  const newSession = useCallback(() => {
    const id = newSessionId();
    setActiveSessionId(id);
    setActiveChatSessionId(id);
    return id;
  }, []);

  const deleteSession = useCallback((id: string) => {
    deleteChatSession(id);
    void deleteCloudSession(id);

    if (id === activeSessionId) {
      const nextSessionId = newSessionId();
      setActiveSessionId(nextSessionId);
      setActiveChatSessionId(nextSessionId);
    }

    refreshSessions();
  }, [activeSessionId, refreshSessions]);

  const renameSession = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    renameChatSession(id, trimmed);
    void renameCloudSession(id, trimmed);
    refreshSessions();
  }, [refreshSessions]);

  const togglePin = useCallback((id: string) => {
    togglePinSession(id);
    refreshSessions();
  }, [refreshSessions]);

  const createProjectHandler = useCallback((title: string) => {
    const project = createChatProject({ title });
    if (project) {
      setActiveProjectId(project.id);
      analytics.projectCreated(project.id);
      void saveProjectToCloud(project);
      refreshSessions();
    }
    return project;
  }, [refreshSessions]);

  const renameProjectHandler = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    renameChatProject(id, trimmed);
    const project = loadChatProject(id);
    if (project) {
      void saveProjectToCloud(project);
    }
    refreshSessions();
  }, [refreshSessions]);

  const deleteProjectHandler = useCallback((id: string) => {
    deleteChatProject(id);
    void deleteProjectFromCloud(id);
    if (activeProjectId === id) {
      setActiveProjectId(null);
    }
    refreshSessions();
  }, [activeProjectId, refreshSessions]);

  const assignSessionProject = useCallback((sessionId: string, projectId: string | null) => {
    assignSessionToProject(sessionId, projectId);
    analytics.projectSessionLinked(projectId, sessionId);
    void assignCloudSessionToProject(sessionId, projectId);

    if (sessionId === activeSessionId) {
      setActiveProjectId(projectId);
      setActiveChatProject(projectId);
    }

    refreshSessions();
  }, [activeSessionId, refreshSessions]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarExpanded((prev) => {
      const next = !prev;
      persistExpanded(next);
      return next;
    });
  }, []);

  const allSessions = useMemo<ChatSessionSummary[]>(() => {
    void refreshTick;
    return searchQuery.trim()
      ? searchSessions(searchQuery)
      : listChatSessions();
  }, [refreshTick, searchQuery]);

  const stableSessions = useMemo<ChatSessionSummary[]>(() => {
    return activeProjectId
      ? allSessions.filter((session) => session.projectId === activeProjectId)
      : allSessions;
  }, [activeProjectId, allSessions]);

  const stableProjects = useMemo<ChatProject[]>(() => {
    void refreshTick;
    return listChatProjects();
  }, [refreshTick]);

  const activeProject = useMemo(
    () => (activeProjectId ? loadChatProject(activeProjectId) : null),
    [activeProjectId, refreshTick],
  );

  return {
    allSessions,
    sessions: stableSessions,
    projects: stableProjects,
    activeProject,
    activeProjectId,
    activeSessionId,
    isSidebarExpanded,
    searchQuery,
    isHydrating,
    setSearchQuery,
    toggleSidebar,
    setActiveProject: setProject,
    setActiveSession,
    loadSession,
    saveMessages,
    newSession,
    deleteSession,
    renameSession,
    togglePin,
    createProject: createProjectHandler,
    renameProject: renameProjectHandler,
    deleteProject: deleteProjectHandler,
    assignSessionProject,
    refreshSessions,
  };
}
