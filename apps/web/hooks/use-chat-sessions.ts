/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { analytics } from "@/lib/analytics/events";
import {
  createChatSessionStore,
  type ChatMessage,
  type ChatSession,
  type ChatSessionSummary,
} from "@/lib/chat/local-store";
import {
  createChatProjectStore,
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

export function useChatSessions(
  owner: string | null,
  enabled = true,
): UseChatSessionsReturn {
  const stores = useMemo(
    () => ({
      ...createChatSessionStore(owner),
      ...createChatProjectStore(owner),
    }),
    [owner],
  );
  const [activeSessionId, setActiveSessionId] = useState<string>(
    () => stores.getActiveChatSessionId() ?? stores.newSessionId(),
  );
  const [activeProjectId, setActiveProjectId] = useState<string | null>(() =>
    stores.getActiveChatProjectId(),
  );
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() =>
    getInitialExpanded(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isHydrating, setIsHydrating] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncCloudSessions = useCallback(async () => {
    if (!enabled) return;
    const cloudSessions = await loadCloudSessions(owner);
    if (cloudSessions.length === 0) return;

    stores.mergeChatSessions(cloudSessions.map(cloudSessionToLocalSession));
  }, [stores, owner, enabled]);

  const refreshSessions = useCallback(async () => {
    setRefreshTick((tick) => tick + 1);
  }, [stores, owner, enabled]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_KEY);
      if (stored !== null) {
        setIsSidebarExpanded(stored === "true");
      }
    } catch {
      // ignore localStorage failures
    }
  }, [stores, owner, enabled]);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (!enabled) return;
      await syncCloudSessions();
      await stores.syncProjectsFromCloud();
      if (!cancelled) {
        setRefreshTick((tick) => tick + 1);
        setIsHydrating(false);
      }
    }

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [refreshSessions, syncCloudSessions, stores, owner, enabled]);

  useEffect(() => {
    function handleFocus() {
      if (!enabled) return;
      void syncCloudSessions()
        .then(async () => {
          await stores.syncProjectsFromCloud();
          setRefreshTick((tick) => tick + 1);
        })
        .catch(() => {});
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refreshSessions, syncCloudSessions, stores, owner, enabled]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [stores, owner, enabled]);

  const setActiveSession = useCallback(
    (sessionId: string) => {
      if (!enabled) return;
      setActiveSessionId(sessionId);
      stores.setActiveChatSessionId(sessionId);
    },
    [stores, owner, enabled],
  );

  const setProject = useCallback(
    (projectId: string | null) => {
      if (!enabled) return;
      setActiveProjectId(projectId);
      stores.setActiveChatProject(projectId);
      analytics.projectSelected(projectId);
      refreshSessions();
    },
    [refreshSessions, stores, owner, enabled],
  );

  const loadSession = useCallback(
    (id: string): ChatSession | null => {
      if (!enabled) return null;
      const session = stores.loadChatSession(id);
      if (session) {
        setActiveSessionId(id);
        stores.setActiveChatSessionId(id);
        setActiveProjectId(session.projectId ?? null);
        stores.setActiveChatProject(session.projectId ?? null);
      }
      return session;
    },
    [stores, owner, enabled],
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
      if (!enabled || messages.length === 0) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const resolvedProjectId =
          opts?.projectId ??
          stores.loadChatSession(activeSessionId)?.projectId ??
          activeProjectId;

        stores.saveChatSession(activeSessionId, messages, {
          ...opts,
          projectId: resolvedProjectId,
        });
        refreshSessions();

        void saveSessionToCloud(
          {
            id: activeSessionId,
            title: stores.loadChatSession(activeSessionId)?.title || "New Chat",
            messages: messages as unknown as Record<string, unknown>[],
            luminorId: opts?.luminorId ?? null,
            modelId: opts?.modelId ?? null,
            projectId: resolvedProjectId,
          },
          owner,
        );
      }, 600);
    },
    [activeProjectId, activeSessionId, refreshSessions, stores, owner, enabled],
  );

  const newSession = useCallback(() => {
    const id = stores.newSessionId();
    setActiveSessionId(id);
    if (enabled) stores.setActiveChatSessionId(id);
    return id;
  }, [stores, owner, enabled]);

  const deleteSession = useCallback(
    (id: string) => {
      if (!enabled) return;
      stores.deleteChatSession(id);
      void deleteCloudSession(id, owner);

      if (id === activeSessionId) {
        const nextSessionId = stores.newSessionId();
        setActiveSessionId(nextSessionId);
        stores.setActiveChatSessionId(nextSessionId);
      }

      refreshSessions();
    },
    [activeSessionId, refreshSessions, stores, owner, enabled],
  );

  const renameSession = useCallback(
    (id: string, title: string) => {
      if (!enabled) return;
      const trimmed = title.trim();
      if (!trimmed) return;

      stores.renameChatSession(id, trimmed);
      void renameCloudSession(id, trimmed, owner);
      refreshSessions();
    },
    [refreshSessions, stores, owner, enabled],
  );

  const togglePin = useCallback(
    (id: string) => {
      if (!enabled) return;
      stores.togglePinSession(id);
      refreshSessions();
    },
    [refreshSessions, stores, owner, enabled],
  );

  const createProjectHandler = useCallback(
    (title: string) => {
      if (!enabled) return null;
      const project = stores.createChatProject({ title });
      if (project) {
        setActiveProjectId(project.id);
        analytics.projectCreated(project.id);
        void stores.saveProjectToCloud(project);
        refreshSessions();
      }
      return project;
    },
    [refreshSessions, stores, owner, enabled],
  );

  const renameProjectHandler = useCallback(
    (id: string, title: string) => {
      if (!enabled) return;
      const trimmed = title.trim();
      if (!trimmed) return;
      stores.renameChatProject(id, trimmed);
      const project = stores.loadChatProject(id);
      if (project) {
        void stores.saveProjectToCloud(project);
      }
      refreshSessions();
    },
    [refreshSessions, stores, owner, enabled],
  );

  const deleteProjectHandler = useCallback(
    (id: string) => {
      if (!enabled) return;
      stores.deleteChatProject(id);
      void stores.deleteProjectFromCloud(id);
      if (activeProjectId === id) {
        setActiveProjectId(null);
      }
      refreshSessions();
    },
    [activeProjectId, refreshSessions, stores, owner, enabled],
  );

  const assignSessionProject = useCallback(
    (sessionId: string, projectId: string | null) => {
      if (!enabled) return;
      stores.assignSessionToProject(sessionId, projectId);
      analytics.projectSessionLinked(projectId, sessionId);
      void stores.assignCloudSessionToProject(sessionId, projectId);

      if (sessionId === activeSessionId) {
        setActiveProjectId(projectId);
        stores.setActiveChatProject(projectId);
      }

      refreshSessions();
    },
    [activeSessionId, refreshSessions, stores, owner, enabled],
  );

  const toggleSidebar = useCallback(() => {
    setIsSidebarExpanded((prev) => {
      const next = !prev;
      persistExpanded(next);
      return next;
    });
  }, [stores, owner, enabled]);

  const allSessions = useMemo<ChatSessionSummary[]>(() => {
    void refreshTick;
    if (!enabled) return [];
    return searchQuery.trim()
      ? stores.searchSessions(searchQuery)
      : stores.listChatSessions();
  }, [refreshTick, searchQuery, stores, owner, enabled]);

  const stableSessions = useMemo<ChatSessionSummary[]>(() => {
    return activeProjectId
      ? allSessions.filter((session) => session.projectId === activeProjectId)
      : allSessions;
  }, [activeProjectId, allSessions, stores, owner, enabled]);

  const stableProjects = useMemo<ChatProject[]>(() => {
    void refreshTick;
    return enabled ? stores.listChatProjects() : [];
  }, [refreshTick, stores, owner, enabled]);

  const activeProject = useMemo(
    () =>
      enabled && activeProjectId
        ? stores.loadChatProject(activeProjectId)
        : null,
    [activeProjectId, refreshTick, stores, enabled],
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
