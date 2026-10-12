/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { analytics } from "@/lib/analytics/events";
import { useAuth } from "@/lib/auth/context";
import { chatUserId, createChatStorageScope } from "@/lib/chat/storage-scope";
import {
  assignSessionToProject,
  deleteChatSession,
  getActiveChatSessionId,
  generateSessionTitle,
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
  saveChatSnapshotToCloud,
} from "@/lib/chat/supabase-store";

const SIDEBAR_KEY = "arcanea-sidebar-expanded";
const MOBILE_BREAKPOINT = 768;
export type ChatSaveStatus =
  | "idle"
  | "local"
  | "saving"
  | "synced"
  | "conflict"
  | "unavailable"
  | "failed"
  | "volatile";

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
  saveStatus: ChatSaveStatus;
  retryCloudSave: () => void;
  saveSeparateCopy: () => void;
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
  // Keep the server and first client render independent of device-only caches.
  const [hasMounted, setHasMounted] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveEpochRef = useRef(0);
  const pendingSnapshotRef = useRef<ChatSession | null>(null);
  const [saveState, setSaveState] = useState<{
    id: string;
    status: ChatSaveStatus;
  }>({ id: "", status: "idle" });

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
    setSaveState({ id: "", status: "idle" });
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
    setHasMounted(true);
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
      saveEpochRef.current += 1;
      pendingSnapshotRef.current = null;
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
        pendingSnapshotRef.current = null;
        saveEpochRef.current += 1;
        setActiveSessionId(id);
        setActiveChatSessionId(id, storageScope);
        setActiveProjectId(session.projectId ?? null);
        setActiveChatProject(session.projectId ?? null, storageScope);
      }
      return session;
    },
    [storageScope],
  );

  const persistSnapshot = useCallback(
    async (snapshot: ChatSession, epoch: number) => {
      if (!storageScope.isCurrent() || !chatUserId(storageScope)) return;
      setSaveState({ id: snapshot.id, status: "saving" });
      const result = await saveChatSnapshotToCloud(
        {
          ...snapshot,
          messages: snapshot.messages as unknown as Record<string, unknown>[],
          luminorId: snapshot.luminorId ?? null,
          modelId: snapshot.modelId ?? null,
        },
        storageScope,
      );
      if (
        !storageScope.isCurrent() ||
        epoch !== saveEpochRef.current ||
        result.status === "retired"
      )
        return;
      setSaveState({ id: snapshot.id, status: result.status });
      refreshSessions();
    },
    [storageScope, refreshSessions],
  );

  const retryCloudSave = useCallback(() => {
    if (!storageScope.isCurrent()) return;
    const snapshot =
      pendingSnapshotRef.current?.id === activeSessionId
        ? pendingSnapshotRef.current
        : loadChatSession(activeSessionId, storageScope);
    if (!snapshot || snapshot.id !== activeSessionId) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    void persistSnapshot(snapshot, ++saveEpochRef.current);
  }, [activeSessionId, storageScope, persistSnapshot]);

  const saveSeparateCopy = useCallback(() => {
    if (!storageScope.isCurrent()) return;
    const original =
      pendingSnapshotRef.current?.id === activeSessionId
        ? pendingSnapshotRef.current
        : loadChatSession(activeSessionId, storageScope);
    if (!original || original.id !== activeSessionId) return;
    const id = newSessionId();
    const title = `${original.title.slice(0, 48)} (copy)`;
    const stored = saveChatSession(
      id,
      original.messages,
      { ...original, title },
      storageScope,
    );
    const snapshot = loadChatSession(id, storageScope) ?? {
      ...original,
      id,
      title,
      cloudRevision: undefined,
    };
    pendingSnapshotRef.current = snapshot;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setActiveSessionId(id);
    setActiveChatSessionId(id, storageScope);
    setSaveState({ id, status: stored ? "local" : "volatile" });
    refreshSessions();
    void persistSnapshot(snapshot, ++saveEpochRef.current);
  }, [activeSessionId, storageScope, persistSnapshot, refreshSessions]);

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
      const stored = saveChatSession(
        activeSessionId,
        messages,
        { ...opts, projectId: resolvedProjectId },
        storageScope,
      );
      const cached = loadChatSession(activeSessionId, storageScope);
      const snapshot =
        stored && cached
          ? cached
          : {
              id: activeSessionId,
              title: cached?.title ?? generateSessionTitle(messages),
              messages: messages.map((message) => ({
                ...message,
                parts: message.parts?.map((part) => ({ ...part })),
              })),
              ...opts,
              projectId: resolvedProjectId,
              cloudRevision: cached?.cloudRevision,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
      pendingSnapshotRef.current = snapshot;
      setSaveState({
        id: activeSessionId,
        status: stored ? "local" : "volatile",
      });
      const epoch = ++saveEpochRef.current;
      refreshSessions();

      debounceRef.current = setTimeout(() => {
        if (!storageScope.isCurrent()) return;

        const latest = stored
          ? loadChatSession(activeSessionId, storageScope)
          : null;
        if (!latest && stored) return;
        void persistSnapshot(latest ?? snapshot, epoch);
      }, 600);
    },
    [
      activeProjectId,
      activeSessionId,
      refreshSessions,
      storageScope,
      persistSnapshot,
    ],
  );

  const newSession = useCallback(() => {
    const id = newSessionId();
    if (!storageScope.isCurrent()) return id;
    pendingSnapshotRef.current = null;
    saveEpochRef.current += 1;
    setActiveSessionId(id);
    setActiveChatSessionId(id, storageScope);
    return id;
  }, [storageScope]);

  const deleteSession = useCallback(
    (id: string) => {
      if (!storageScope.isCurrent()) return;
      deleteChatSession(id, storageScope);
      if (id === activeSessionId && debounceRef.current)
        clearTimeout(debounceRef.current);
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
      const snapshot = loadChatSession(id, storageScope);
      if (snapshot) void persistSnapshot(snapshot, ++saveEpochRef.current);
      refreshSessions();
    },
    [refreshSessions, storageScope, persistSnapshot],
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
      const snapshot = loadChatSession(sessionId, storageScope);
      if (snapshot) void persistSnapshot(snapshot, ++saveEpochRef.current);

      if (sessionId === activeSessionId) {
        setActiveProjectId(projectId);
        setActiveChatProject(projectId, storageScope);
      }

      refreshSessions();
    },
    [activeSessionId, refreshSessions, storageScope, persistSnapshot],
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
    if (!hasMounted) return [];
    return searchQuery.trim()
      ? searchSessions(searchQuery, storageScope)
      : listChatSessions(storageScope);
  }, [hasMounted, refreshTick, searchQuery, storageScope]);

  const stableSessions = useMemo<ChatSessionSummary[]>(() => {
    return activeProjectId
      ? allSessions.filter((session) => session.projectId === activeProjectId)
      : allSessions;
  }, [activeProjectId, allSessions]);

  const stableProjects = useMemo<ChatProject[]>(() => {
    void refreshTick;
    if (!hasMounted) return [];
    return listChatProjects(storageScope);
  }, [hasMounted, refreshTick, storageScope]);

  const activeProject = useMemo(
    () =>
      hasMounted && activeProjectId
        ? loadChatProject(activeProjectId, storageScope)
        : null,
    [hasMounted, activeProjectId, refreshTick, storageScope],
  );

  return {
    saveStatus: !hasMounted
      ? "idle"
      : saveState.id === activeSessionId
        ? saveState.status
        : loadChatSession(activeSessionId, storageScope)?.cloudDirty
          ? "local"
          : loadChatSession(activeSessionId, storageScope)?.cloudRevision
            ? "synced"
            : "idle",
    retryCloudSave,
    saveSeparateCopy,
    allSessions,
    sessions: stableSessions,
    projects: stableProjects,
    activeProject,
    activeProjectId: hasMounted ? activeProjectId : null,
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
