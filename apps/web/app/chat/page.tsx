/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildWorldCharacterLuminor,
  buildWorldBuilderLuminor,
} from "@/lib/chat/world-character-mode";
import { encodeAttachments } from "@/lib/chat/encode-attachment";
import { toUiMessage, serializeMessages } from "@/lib/chat/message-utils";
import { useChatSearch } from "@/hooks/use-chat-search";
import { useChatShortcuts } from "@/hooks/use-chat-shortcuts";
import { useSearchParams } from "next/navigation";

import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatArea } from "@/components/chat/chat-area";
import { HistorySidebar } from "@/components/chat/history-sidebar";
import { ChatInputBar } from "@/components/chat/chat-input-bar";
import { ChatStorageStatus } from "@/components/chat/chat-storage-status";
import { ChatNotices } from "@/components/chat/chat-notices";
import { ChatOverlays } from "@/components/chat/chat-overlays";
import { AgentHeader } from "@/components/chat/agent-header";
import { getLuminor } from "@/lib/luminors/config";
import dynamic from "next/dynamic";
import { detectArtifact } from "@/components/chat/artifacts-panel";
import type { Artifact } from "@/components/chat/artifacts-panel";

const CreditBalance = dynamic(
  () =>
    import("@/components/credits/credit-balance").then((m) => m.CreditBalance),
  {
    ssr: false,
    loading: () => (
      <span className="text-xs text-[var(--arc-text-secondary)]">---</span>
    ),
  },
);
import { CreationIndicator } from "@/components/chat/creation-indicator";
import { VaultContextStrip } from "@/components/chat/vault-context-strip";
import { SearchOverlay } from "@/components/chat/search-overlay";
import { PhExport, PhPlus, PhList, FolderOpen } from "@/lib/phosphor-icons";
import { useConversation, getMessageText } from "@/hooks/use-conversation";
import type { LuminorConfig } from "@/lib/luminors/config";
import { useChatSessions } from "@/hooks/use-chat-sessions";
import { useWorldCharacterInit } from "@/hooks/use-world-character-init";
import { useChatWorldMode } from "@/hooks/use-chat-world-mode";
import { useAutoSave } from "@/lib/arc/auto-save";
import { analytics } from "@/lib/analytics/events";
import { ChatImagineTabs } from "@/components/chat/chat-imagine-tabs";
import { useAuth } from "@/lib/auth/context";
import ChatLoading from "./loading";

export default function ChatPage() {
  const { credentialScope } = useAuth();
  const token = credentialScope.get();
  // Keep the URL prompt intact while AuthProvider resolves the initial account.
  if (!token.actor) return <ChatLoading />;
  // Retire messages, artifacts, search and callbacks together when auth changes.
  // The scope guards also reject work between the auth event and this render.
  return (
    <ChatPageContent key={`${token.actor ?? "pending"}:${token.revision}`} />
  );
}

function ChatPageContent() {
  const chatSessions = useChatSessions();
  const conversation = useConversation({
    activeProject: chatSessions.activeProject,
  });
  const autoSave = useAutoSave(conversation.messages, conversation.isLoading);
  const searchParams = useSearchParams();

  const [showExport, setShowExport] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [serverHasKeys, setServerHasKeys] = useState(false);
  const [pendingInput, setPendingInput] = useState("");
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [activeAgent, setActiveAgent] = useState<{
    type: "auto" | "luminor";
    id: string;
  } | null>(null);

  const worldCharInit = useWorldCharacterInit();
  const worldMode = useChatWorldMode();

  const resolvedAgent =
    activeAgent?.type === "luminor"
      ? (() => {
          const l = getLuminor(activeAgent.id);
          return l
            ? {
                type: "luminor" as const,
                id: l.id,
                name: l.name,
                avatar: l.avatar,
                specialty: l.specialty,
              }
            : null;
        })()
      : conversation.activeLuminor
        ? {
            type: "luminor" as const,
            id: conversation.activeLuminor.id,
            name: conversation.activeLuminor.name,
            avatar:
              conversation.activeLuminor.avatar ??
              conversation.activeLuminor.name.slice(0, 1),
            specialty:
              conversation.activeLuminor.tagline ??
              conversation.activeLuminor.title,
          }
        : null;

  // Hero prompt handoff — read ?prompt= from URL and auto-populate input
  const promptConsumed = useRef(false);
  useEffect(() => {
    if (promptConsumed.current) return;
    const prompt = searchParams.get("prompt");
    if (prompt && prompt.trim()) {
      promptConsumed.current = true;
      if (searchParams.get("auto") !== "1") {
        setPendingInput(prompt.trim());
      }
      const params = new URLSearchParams(window.location.search);
      params.delete("prompt");
      params.delete("auto");
      const nextUrl = params.toString()
        ? `/chat?${params.toString()}`
        : "/chat";
      window.history.replaceState(null, "", nextUrl);
    }
  }, [searchParams]);

  // World character -> activate as Luminor when loaded
  const worldCharApplied = useRef(false);
  useEffect(() => {
    if (worldCharApplied.current || !worldCharInit.worldCharacter) return;
    worldCharApplied.current = true;
    conversation.handleSelectLuminor(
      buildWorldCharacterLuminor(worldCharInit.worldCharacter),
    );
  }, [worldCharInit.worldCharacter, conversation]);

  // World builder mode -> activate as synthetic Luminor
  const worldModeApplied = useRef(false);
  useEffect(() => {
    if (worldModeApplied.current || !worldMode.isWorldMode) return;
    worldModeApplied.current = true;
    conversation.handleSelectLuminor(
      buildWorldBuilderLuminor(worldMode.worldPrompt),
    );
  }, [worldMode.isWorldMode, worldMode.worldPrompt, conversation]);

  // Track user message count for world mode "Create" threshold
  useEffect(() => {
    if (!worldMode.isWorldMode) return;
    worldMode.updateCount(
      conversation.messages.filter((m) => m.role === "user").length,
    );
  }, [worldMode, conversation.messages]);

  const search = useChatSearch(conversation.messages);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Server key detection + persistence
  useEffect(() => {
    fetch("/api/ai/chat")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.status === "ok") setServerHasKeys(true);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (conversation.messages.length > 0 && !conversation.isLoading) {
      chatSessions.saveMessages(serializeMessages(conversation.messages), {
        luminorId: conversation.activeLuminor?.id ?? null,
        modelId: conversation.modelId,
        projectId: chatSessions.activeProjectId ?? null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chatSessions.activeProjectId,
    conversation.messages,
    conversation.isLoading,
  ]);
  useEffect(() => {
    if (!conversation.isLoading && conversation.messages.length > 0) {
      const lastAssistant = [...conversation.messages]
        .reverse()
        .find((m) => m.role === "assistant");
      if (lastAssistant) {
        const artifact = detectArtifact(getMessageText(lastAssistant));
        if (artifact) setActiveArtifact(artifact);
      }
    }
  }, [conversation.messages, conversation.isLoading]);
  const handleLoadSession = useCallback(
    (sessionId: string) => {
      const session = chatSessions.loadSession(sessionId);
      if (session && session.messages.length > 0) {
        conversation.setMessages(session.messages.map(toUiMessage));
      }
    },
    [chatSessions, conversation],
  );

  const handleNewChat = useCallback(() => {
    conversation.startNewChat();
    chatSessions.newSession();
    textareaRef.current?.focus();
  }, [conversation, chatSessions]);

  const lastSessionTitle =
    chatSessions.sessions.length > 0 &&
    chatSessions.sessions[0].title !== "New Chat"
      ? chatSessions.sessions[0].title
      : null;

  const handleContinueLastSession = useCallback(() => {
    if (chatSessions.sessions.length > 0)
      handleLoadSession(chatSessions.sessions[0].id);
  }, [chatSessions.sessions, handleLoadSession]);

  const handleSend = useCallback(
    async (message: string, attachments?: File[]) => {
      if (!message.trim() && (!attachments || attachments.length === 0)) return;
      const files = attachments?.length
        ? await encodeAttachments(attachments)
        : undefined;
      analytics.chatSent(conversation.activeLuminor?.id);
      conversation.sendMessage({
        text: message.trim(),
        ...(files ? { files } : {}),
      });
    },
    [conversation],
  );

  useChatShortcuts({
    onNewChat: handleNewChat,
    onToggleSidebar: chatSessions.toggleSidebar,
    onToggleSearch: useCallback(
      () => search.setShowSearch((prev: boolean) => !prev),
      [search],
    ),
    hasMessages: conversation.messages.length > 0,
  });

  return (
    <>
      <ChatLayout
        sidebarExpanded={chatSessions.isSidebarExpanded}
        onToggleSidebar={chatSessions.toggleSidebar}
        sidebar={
          <HistorySidebar
            expanded={chatSessions.isSidebarExpanded}
            onToggle={chatSessions.toggleSidebar}
            allSessions={chatSessions.allSessions}
            sessions={chatSessions.sessions}
            projects={chatSessions.projects}
            searchQuery={chatSessions.searchQuery}
            onSearchQueryChange={chatSessions.setSearchQuery}
            activeProjectId={chatSessions.activeProjectId}
            activeSessionId={chatSessions.activeSessionId}
            onNewChat={handleNewChat}
            onSelectSession={handleLoadSession}
            onDeleteSession={chatSessions.deleteSession}
            onRenameSession={chatSessions.renameSession}
            onTogglePin={chatSessions.togglePin}
            onSelectProject={chatSessions.setActiveProject}
            onCreateProject={(title) => chatSessions.createProject(title)}
            onRenameProject={chatSessions.renameProject}
            onDeleteProject={chatSessions.deleteProject}
            onAssignActiveSessionToProject={(projectId) => {
              chatSessions.assignSessionProject(
                chatSessions.activeSessionId,
                projectId,
              );
            }}
          />
        }
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-white/[0.05] bg-gradient-to-r from-transparent via-white/[0.01] to-transparent shrink-0 h-[52px] min-h-[52px]">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={chatSessions.toggleSidebar}
              className="md:hidden w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-[var(--arc-text-secondary)] hover:text-[var(--arc-text-secondary)] hover:bg-white/[0.04] transition-colors"
              aria-label="Toggle sidebar"
              aria-expanded={chatSessions.isSidebarExpanded}
            >
              <PhList className="w-4.5 h-4.5" />
            </button>
            <ChatImagineTabs />
            {chatSessions.activeProject && (
              <div className="hidden md:flex items-center gap-1 rounded-full border border-[var(--arc-brand-atlantean-teal)]/20 bg-[var(--arc-brand-atlantean-teal)]/8 px-2.5 py-1 text-[11px] text-[var(--arc-text-primary)]">
                <FolderOpen className="w-3 h-3" />
                <span className="max-w-[180px] truncate">
                  {chatSessions.activeProject.title}
                </span>
              </div>
            )}
            {worldMode.isWorldMode && (
              <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[var(--arc-void)]/30 bg-[var(--arc-void)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--arc-text-primary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--arc-void)] animate-pulse" />
                World Builder Mode
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CreditBalance className="text-xs sm:text-sm" />
            {conversation.messages.length > 0 && (
              <button
                onClick={() => setShowExport(true)}
                className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[var(--arc-text-secondary)] hover:text-[var(--arc-text-secondary)] hover:bg-white/[0.04] transition-colors"
                aria-label="Export conversation"
                title="Export"
              >
                <PhExport className="w-4 h-4" />
              </button>
            )}
            {conversation.messages.length > 0 && (
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1.5 h-10 sm:h-auto px-3 py-1.5 rounded-lg text-xs text-[var(--arc-text-secondary)] hover:text-[var(--arc-text-secondary)] hover:bg-white/[0.04] transition-colors"
              >
                <PhPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New</span>
              </button>
            )}
          </div>
        </div>

        <ChatStorageStatus
          status={
            conversation.messages.length ? chatSessions.saveStatus : "idle"
          }
          onRetry={chatSessions.retryCloudSave}
          onSaveCopy={chatSessions.saveSeparateCopy}
          onExport={() => setShowExport(true)}
        />
        <ChatNotices
          conversation={conversation}
          worldCharInit={worldCharInit}
          worldMode={worldMode}
          handleNewChat={handleNewChat}
          onEndCharacterChat={() => {
            worldCharApplied.current = false;
            worldCharInit.clearWorldCharacter();
            handleNewChat();
          }}
        />

        {/* Chat area with messages + input bar */}
        <ChatArea
          messages={conversation.messages}
          isStreaming={conversation.isStreaming}
          isLoading={conversation.isLoading}
          isThinking={conversation.isThinking}
          isEmpty={conversation.isEmpty}
          activeLuminor={conversation.activeLuminor}
          swarmResult={conversation.swarmResult}
          providerLabel={conversation.providerLabel}
          runtimeSummary={conversation.runtimeSummary}
          onSendMessage={conversation.sendMessage}
          onSetInput={(v: string) => setPendingInput(v)}
          onFocusInput={() => textareaRef.current?.focus()}
          onSelectLuminor={(config) =>
            conversation.handleSelectLuminor(config as LuminorConfig)
          }
          onCopy={conversation.handleCopy}
          copiedId={conversation.copiedId}
          editingMessageId={conversation.editingMessageId}
          onSetEditingMessageId={conversation.setEditingMessageId}
          onEditMessage={conversation.handleEditMessage}
          onRegenerateFrom={conversation.handleRegenerateFrom}
          branches={conversation.branches}
          onLoadBranch={conversation.loadBranch}
          lastMsg={conversation.lastMsg ?? null}
          autoSave={autoSave}
          searchQuery={search.inConvoSearchQuery}
          clientApiKey={conversation.clientApiKey ?? null}
          serverHasKeys={serverHasKeys}
          lastSessionTitle={lastSessionTitle}
          onContinueLastSession={
            lastSessionTitle ? handleContinueLastSession : null
          }
          searchOverlay={
            search.showSearch ? (
              <SearchOverlay
                open={search.showSearch}
                totalMatches={search.totalMatches}
                currentMatchIndex={search.currentMatchIndex}
                onQueryChange={search.handleSearchQueryChange}
                onNext={search.handleSearchNext}
                onPrev={search.handleSearchPrev}
                onClose={search.handleSearchClose}
              />
            ) : undefined
          }
        >
          <div
            className="border-t border-white/[0.05] bg-gradient-to-t from-[var(--arc-cosmic-void)] via-[var(--arc-cosmic-void)] to-[var(--arc-cosmic-void)] shrink-0"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <div className="max-w-[720px] mx-auto">
              <AgentHeader
                activeAgent={resolvedAgent}
                currentModel={conversation.modelId ?? "arcanea-auto"}
                onModelChange={conversation.setModelId}
                focusMode={conversation.focusMode ?? "auto"}
                onFocusModeChange={conversation.setFocusMode}
                onOpenAgentPicker={() => setShowAgentPicker(true)}
              />
              <VaultContextStrip
                latestUserMessage={(() => {
                  const lastUser = [...conversation.messages]
                    .reverse()
                    .find((m) => m.role === "user");
                  if (!lastUser) return null;
                  return getMessageText(lastUser);
                })()}
                disabled={conversation.isStreaming || conversation.isEmpty}
              />
              <div className="px-4 pb-3">
                <ChatInputBar
                  onSend={handleSend}
                  onModelChange={conversation.setModelId}
                  currentModel={conversation.modelId ?? "arcanea-auto"}
                  isStreaming={conversation.isStreaming}
                  onStop={conversation.handleStop}
                  enabledTools={conversation.enabledTools}
                  onToggleTool={conversation.toggleTool}
                  externalMessage={pendingInput}
                  onExternalMessageConsumed={() => setPendingInput("")}
                  textareaRef={textareaRef}
                />
                <div className="flex items-center justify-between mt-2 px-1">
                  <span className="text-[10px] text-[var(--arc-text-secondary)] hidden sm:inline">
                    @mention for agents
                  </span>
                  <CreationIndicator autoSave={autoSave} />
                </div>
              </div>
            </div>
          </div>
        </ChatArea>
      </ChatLayout>

      <ChatOverlays
        conversation={conversation}
        showAgentPicker={showAgentPicker}
        setShowAgentPicker={setShowAgentPicker}
        activeAgent={activeAgent}
        setActiveAgent={setActiveAgent}
        activeArtifact={activeArtifact}
        setActiveArtifact={setActiveArtifact}
        showExport={showExport}
        setShowExport={setShowExport}
        handleNewChat={handleNewChat}
      />
    </>
  );
}
