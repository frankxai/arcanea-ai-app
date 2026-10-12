/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { analytics } from "@/lib/analytics/events";
import { useAuth } from "@/lib/auth/context";
import { createChatStorageScope } from "@/lib/chat/storage-scope";
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
} from "@/lib/chat/local-store";
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
} from "@/lib/chat/project-store";
import {
  cloudSessionToLocalSession,
  deleteCloudSession,
  loadCloudSessions,
  renameCloudSession,
  saveSessionToCloud,
} from "@/lib/chat/supabase-store";

const SIDEBAR_KEY = "arcanea-sidebar-expanded";
const MOBILE_BREAKPOINT = 768;

function getInitialExpanded(): boolean {
  return false;
}

function persistExpanded(value: boolean): void {
  if (typeof window === "undefined") return;

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
    opts?: {
      luminorId?: string | null;
      modelId?: string | null;
      projectId?: string | null;
    },
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
  const { credentialScope } = useAuth();
  const token = credentialScope.get();
  const storageScope = useMemo(
    () => createChatStorageScope(credentialScope, token),
    [credentialScope, token],
  );
  const [selection, setSelection] = useState(() => ({
    scope: storageScope,
    sessionId: getActiveChatSessionId(storageScope) ?? newSessionId(),
    projectId: getActiveChatProjectId(storageScope),
  }));
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() =>
    getInitialExpanded(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isHydrating, setIsHydrating] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Also reset consumers that use the hook outside the keyed chat page. React
  // retries this render before committing callbacks for the previous selection.
  if (selection.scope !== storageScope) {
    setSelection({
      scope: storageScope,
      sessionId: getActiveChatSessionId(storageScope) ?? newSessionId(),
      projectId: getActiveChatProjectId(storageScope),
    });
    setSearchQuery("");
    setIsHydrating(true);
  }
  const activeSessionId = selection.sessionId;
  const activeProjectId = selection.projectId;
  const setActiveSessionId = useCallback(
    (id: string) => {
      if (storageScope.isCurrent())
        setSelection((previous) => ({ ...previous, sessionId: id }));
    },
    [storageScope],
  );
  const setActiveProjectId = useCallback(
    (id: string | null) => {
      if (storageScope.isCurrent())
        setSelection((previous) => ({ ...previous, projectId: id }));
    },
    [storageScope],
  );

  const syncCloudSessions = useCallback(async () => {
    const cloudSessions = await loadCloudSessions(storageScope);
    if (!storageScope.isCurrent() || cloudSessions.length === 0) return;

    mergeChatSessions(
      cloudSessions.map(cloudSessionToLocalSession),
      storageScope,
    );
  }, [storageScope]);

  const refreshSessions = useCallback(async () => {
    if (!storageScope.isCurrent()) return;
    setRefreshTick((tick) => tick + 1);
  }, [storageScope]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_KEY);
      if (stored !== null) {
        setIsSidebarExpanded(stored === "true");
      }
    } catch {
      // ignore localStorage failures
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        await syncCloudSessions();
        if (!cancelled && storageScope.isCurrent())
          await syncProjectsFromCloud(storageScope);
      } finally {
        if (!cancelled && storageScope.isCurrent()) {
          setRefreshTick((tick) => tick + 1);
          setIsHydrating(false);
        }
      }
    }

    void hydrate().catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [storageScope, syncCloudSessions]);

  useEffect(() => {
    function handleFocus() {
      void syncCloudSessions()
        .then(async () => {
          if (!storageScope.isCurrent()) return;
          await syncProjectsFromCloud(storageScope);
          if (storageScope.isCurrent()) setRefreshTick((tick) => tick + 1);
        })
        .catch(() => {});
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [storageScope, syncCloudSessions]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [storageScope]);

  const setActiveSession = useCallback(
    (sessionId: string) => {
      if (!storageScope.isCurrent()) return;
      setActiveSessionId(sessionId);
      setActiveChatSessionId(sessionId, storageScope);
    },
    [storageScope],
  );

  const setProject = useCallback(
    (projectId: string | null) => {
      if (!storageScope.isCurrent()) return;
      setActiveProjectId(projectId);
      setActiveChatProject(projectId, storageScope);
      analytics.projectSelected(projectId);
      refreshSessions();
    },
    [refreshSessions, storageScope],
  );

  const loadSession = useCallback(
    (id: string): ChatSession | null => {
      const session = loadChatSession(id, storageScope);
      if (session) {
        setActiveSessionId(id);
        setActiveChatSessionId(id, storageScope);
        setActiveProjectId(session.projectId ?? null);
        setActiveChatProject(session.projectId ?? null, storageScope);
      }
      return session;
    },
    [storageScope],
  );

  const saveMessages = useCallback(
    (
      messages: ChatMessage[],
      opts?: {
        luminorId?: string | null;
        modelId?: string | null;
        projectId?: string | null;
      },
    ) => {
      if (!storageScope.isCurrent() || messages.length === 0) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      const resolvedProjectId =
        opts?.projectId ??
        loadChatSession(activeSessionId, storageScope)?.projectId ??
        activeProjectId;
      // Preserve completed messages immediately; only network sync is debounced.
      // Changing account or leaving within 600 ms must not discard the local save.
      saveChatSession(
        activeSessionId,
        messages,
        { ...opts, projectId: resolvedProjectId },
        storageScope,
      );
      refreshSessions();

      debounceRef.current = setTimeout(() => {
        if (!storageScope.isCurrent()) return;

        void saveSessionToCloud(
          {
            id: activeSessionId,
            title:
              loadChatSession(activeSessionId, storageScope)?.title ||
              "New Chat",
            messages: messages as unknown as Record<string, unknown>[],
            luminorId: opts?.luminorId ?? null,
            modelId: opts?.modelId ?? null,
            projectId: resolvedProjectId,
          },
          storageScope,
        );
      }, 600);
    },
    [activeProjectId, activeSessionId, refreshSessions, storageScope],
  );

  const newSession = useCallback(() => {
    const id = newSessionId();
    if (!storageScope.isCurrent()) return id;
    setActiveSessionId(id);
    setActiveChatSessionId(id, storageScope);
    return id;
  }, [storageScope]);

  const deleteSession = useCallback(
    (id: string) => {
      if (!storageScope.isCurrent()) return;
      deleteChatSession(id, storageScope);
      void deleteCloudSession(id, storageScope);

      if (id === activeSessionId) {
        const nextSessionId = newSessionId();
        setActiveSessionId(nextSessionId);
        setActiveChatSessionId(nextSessionId, storageScope);
      }

      refreshSessions();
    },
    [activeSessionId, refreshSessions, storageScope],
  );

  const renameSession = useCallback(
    (id: string, title: string) => {
      const trimmed = title.trim();
      if (!storageScope.isCurrent() || !trimmed) return;

      renameChatSession(id, trimmed, storageScope);
      void renameCloudSession(id, trimmed, storageScope);
      refreshSessions();
    },
    [refreshSessions, storageScope],
  );

  const togglePin = useCallback(
    (id: string) => {
      togglePinSession(id, storageScope);
      refreshSessions();
    },
    [refreshSessions, storageScope],
  );

  const createProjectHandler = useCallback(
    (title: string) => {
      const project = createChatProject({ title }, storageScope);
      if (project) {
        setActiveProjectId(project.id);
        analytics.projectCreated(project.id);
        void saveProjectToCloud(project, storageScope);
        refreshSessions();
      }
      return project;
    },
    [refreshSessions, storageScope],
  );

  const renameProjectHandler = useCallback(
    (id: string, title: string) => {
      const trimmed = title.trim();
      if (!storageScope.isCurrent() || !trimmed) return;
      renameChatProject(id, trimmed, storageScope);
      const project = loadChatProject(id, storageScope);
      if (project) {
        void saveProjectToCloud(project, storageScope);
      }
      refreshSessions();
    },
    [refreshSessions, storageScope],
  );

  const deleteProjectHandler = useCallback(
    (id: string) => {
      if (!storageScope.isCurrent()) return;
      deleteChatProject(id, storageScope);
      void deleteProjectFromCloud(id, storageScope);
      if (activeProjectId === id) {
        setActiveProjectId(null);
      }
      refreshSessions();
    },
    [activeProjectId, refreshSessions, storageScope],
  );

  const assignSessionProject = useCallback(
    (sessionId: string, projectId: string | null) => {
      if (!storageScope.isCurrent()) return;
      assignSessionToProject(sessionId, projectId, storageScope);
      analytics.projectSessionLinked(projectId, sessionId);
      void assignCloudSessionToProject(sessionId, projectId, storageScope);

      if (sessionId === activeSessionId) {
        setActiveProjectId(projectId);
        setActiveChatProject(projectId, storageScope);
      }

      refreshSessions();
    },
    [activeSessionId, refreshSessions, storageScope],
  );

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
      ? searchSessions(searchQuery, storageScope)
      : listChatSessions(storageScope);
  }, [refreshTick, searchQuery, storageScope]);

  const stableSessions = useMemo<ChatSessionSummary[]>(() => {
    return activeProjectId
      ? allSessions.filter((session) => session.projectId === activeProjectId)
      : allSessions;
  }, [activeProjectId, allSessions]);

  const stableProjects = useMemo<ChatProject[]>(() => {
    void refreshTick;
    return listChatProjects(storageScope);
  }, [refreshTick, storageScope]);

  const activeProject = useMemo(
    () =>
      activeProjectId ? loadChatProject(activeProjectId, storageScope) : null,
    [activeProjectId, refreshTick, storageScope],
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
