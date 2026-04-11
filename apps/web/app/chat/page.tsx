'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { buildWorldCharacterLuminor, buildWorldBuilderLuminor } from '@/lib/chat/world-character-mode';
import { encodeAttachments } from '@/lib/chat/encode-attachment';
import { toUiMessage, serializeMessages } from '@/lib/chat/message-utils';
import { useChatSearch } from '@/hooks/use-chat-search';
import { useChatShortcuts } from '@/hooks/use-chat-shortcuts';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { ChatLayout } from '@/components/chat/chat-layout';
import { ChatArea, getErrorMessage } from '@/components/chat/chat-area';
import { HistorySidebar } from '@/components/chat/history-sidebar';
import { ChatInputBar } from '@/components/chat/chat-input-bar';
import { AgentHeader } from '@/components/chat/agent-header';
import { AgentPicker } from '@/components/chat/agent-picker';
import { getLuminor } from '@/lib/luminors/config';
import dynamic from 'next/dynamic';
import { detectArtifact } from '@/components/chat/artifacts-panel';
import type { Artifact } from '@/components/chat/artifacts-panel';

const CommandPalette = dynamic(
  () => import('@/components/chat/command-palette').then((m) => m.CommandPalette),
  { ssr: false, loading: () => <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" /> },
);
const ExportDialog = dynamic(
  () => import('@/components/chat/export-dialog').then((m) => m.ExportDialog),
  { ssr: false, loading: () => <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" /> },
);
const ArtifactsPanel = dynamic(
  () => import('@/components/chat/artifacts-panel').then((m) => m.ArtifactsPanel),
  { ssr: false, loading: () => <div className="fixed right-0 top-0 h-full w-80 bg-[#0a0a10] border-l border-white/[0.06] animate-pulse" /> },
);
const BeamMode = dynamic(
  () => import('@/components/chat/beam-mode').then((m) => m.BeamMode),
  { ssr: false, loading: () => <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"><span className="text-white/40 text-sm">Loading Beam Mode...</span></div> },
);
const CreditBalance = dynamic(
  () => import('@/components/credits/credit-balance').then((m) => m.CreditBalance),
  { ssr: false, loading: () => <span className="text-xs text-white/20">---</span> },
);
import { CreationIndicator } from '@/components/chat/creation-indicator';
import { SearchOverlay } from '@/components/chat/search-overlay';
import { PhWarningCircle, PhX, PhExport, PhPlus, PhList, FolderOpen } from '@/lib/phosphor-icons';
import { useConversation, getMessageText } from '@/hooks/use-conversation';
import type { LuminorConfig } from '@/lib/luminors/config';
import { useChatSessions } from '@/hooks/use-chat-sessions';
import { useWorldCharacterInit } from '@/hooks/use-world-character-init';
import { useChatWorldMode } from '@/hooks/use-chat-world-mode';
import { useAutoSave } from '@/lib/arc/auto-save';
import { analytics } from '@/lib/analytics/events';
import { ChatImagineTabs } from '@/components/chat/chat-imagine-tabs';

export default function ChatPage() {
  const chatSessions = useChatSessions();
  const conversation = useConversation({ activeProject: chatSessions.activeProject });
  const autoSave = useAutoSave(conversation.messages, conversation.isLoading);
  const searchParams = useSearchParams();

  const [showExport, setShowExport] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [serverHasKeys, setServerHasKeys] = useState(false);
  const [pendingInput, setPendingInput] = useState('');
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [activeAgent, setActiveAgent] = useState<{ type: 'auto' | 'luminor'; id: string } | null>(null);

  const worldCharInit = useWorldCharacterInit();
  const worldMode = useChatWorldMode();

  const resolvedAgent = activeAgent?.type === 'luminor' ? (() => {
    const l = getLuminor(activeAgent.id);
    return l ? { type: 'luminor' as const, id: l.id, name: l.name, avatar: l.avatar, specialty: l.specialty } : null;
  })() : null;

  // Hero prompt handoff — read ?prompt= from URL and auto-populate input
  const promptConsumed = useRef(false);
  useEffect(() => {
    if (promptConsumed.current) return;
    const prompt = searchParams.get('prompt');
    if (prompt && prompt.trim()) {
      promptConsumed.current = true;
      setPendingInput(prompt.trim());
      window.history.replaceState(null, '', '/chat');
    }
  }, [searchParams]);

  // World character -> activate as Luminor when loaded
  const worldCharApplied = useRef(false);
  useEffect(() => {
    if (worldCharApplied.current || !worldCharInit.worldCharacter) return;
    worldCharApplied.current = true;
    conversation.handleSelectLuminor(buildWorldCharacterLuminor(worldCharInit.worldCharacter));
  }, [worldCharInit.worldCharacter, conversation]);

  // World builder mode -> activate as synthetic Luminor
  const worldModeApplied = useRef(false);
  useEffect(() => {
    if (worldModeApplied.current || !worldMode.isWorldMode) return;
    worldModeApplied.current = true;
    conversation.handleSelectLuminor(buildWorldBuilderLuminor(worldMode.worldPrompt));
  }, [worldMode.isWorldMode, worldMode.worldPrompt, conversation]);

  // Track user message count for world mode "Create" threshold
  useEffect(() => {
    if (!worldMode.isWorldMode) return;
    worldMode.updateCount(conversation.messages.filter((m) => m.role === 'user').length);
  }, [worldMode, conversation.messages]);

  const search = useChatSearch(conversation.messages);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Server key detection + persistence
  useEffect(() => {
    fetch('/api/ai/chat')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.status === 'ok') setServerHasKeys(true); })
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
  }, [chatSessions.activeProjectId, conversation.messages, conversation.isLoading]);
  useEffect(() => {
    if (!conversation.isLoading && conversation.messages.length > 0) {
      const lastAssistant = [...conversation.messages].reverse().find((m) => m.role === 'assistant');
      if (lastAssistant) {
        const artifact = detectArtifact(getMessageText(lastAssistant));
        if (artifact) setActiveArtifact(artifact);
      }
    }
  }, [conversation.messages, conversation.isLoading]);
  const handleLoadSession = useCallback((sessionId: string) => {
    const session = chatSessions.loadSession(sessionId);
    if (session && session.messages.length > 0) {
      conversation.setMessages(session.messages.map(toUiMessage));
    }
  }, [chatSessions, conversation]);

  const handleNewChat = useCallback(() => {
    conversation.startNewChat();
    chatSessions.newSession();
    textareaRef.current?.focus();
  }, [conversation, chatSessions]);

  const lastSessionTitle =
    chatSessions.sessions.length > 0 && chatSessions.sessions[0].title !== 'New Chat'
      ? chatSessions.sessions[0].title : null;

  const handleContinueLastSession = useCallback(() => {
    if (chatSessions.sessions.length > 0) handleLoadSession(chatSessions.sessions[0].id);
  }, [chatSessions.sessions, handleLoadSession]);

  const handleSend = useCallback(async (message: string, attachments?: File[]) => {
    if (!message.trim() && (!attachments || attachments.length === 0)) return;
    const files = attachments?.length ? await encodeAttachments(attachments) : undefined;
    analytics.chatSent(conversation.activeLuminor?.id);
    conversation.sendMessage({ text: message.trim(), ...(files ? { files } : {}) });
  }, [conversation]);

  useChatShortcuts({
    onNewChat: handleNewChat,
    onToggleSidebar: chatSessions.toggleSidebar,
    onToggleSearch: useCallback(() => search.setShowSearch((prev: boolean) => !prev), [search]),
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
              chatSessions.assignSessionProject(chatSessions.activeSessionId, projectId);
            }}
          />
        }
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-white/[0.05] bg-gradient-to-r from-transparent via-white/[0.01] to-transparent shrink-0 h-[52px] min-h-[52px]">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={chatSessions.toggleSidebar}
              className="md:hidden w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
              aria-label="Toggle sidebar"
              aria-expanded={chatSessions.isSidebarExpanded}
            >
              <PhList className="w-4.5 h-4.5" />
            </button>
            <ChatImagineTabs />
            {chatSessions.activeProject && (
              <div className="hidden md:flex items-center gap-1 rounded-full border border-[#00bcd4]/20 bg-[#00bcd4]/8 px-2.5 py-1 text-[11px] text-[#9be7f2]">
                <FolderOpen className="w-3 h-3" />
                <span className="max-w-[180px] truncate">{chatSessions.activeProject.title}</span>
              </div>
            )}
            {worldMode.isWorldMode && (
              <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#7c3aed]/30 bg-[#7c3aed]/10 px-2.5 py-1 text-[11px] font-medium text-[#c4b5fd]">
                <span className="w-2 h-2 rounded-full bg-[#7c3aed] animate-pulse" />
                World Builder Mode
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CreditBalance className="text-xs sm:text-sm" />
            {conversation.messages.length > 0 && (
              <button
                onClick={() => setShowExport(true)}
                className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
                aria-label="Export conversation"
                title="Export"
              >
                <PhExport className="w-4 h-4" />
              </button>
            )}
            {conversation.messages.length > 0 && (
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1.5 h-10 sm:h-auto px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
              >
                <PhPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New</span>
              </button>
            )}
          </div>
        </div>

        {/* Error banner */}
        {conversation.chatError && (() => {
          const errInfo = getErrorMessage(conversation.chatError);
          return (
          <div className="mx-4 mt-2 animate-slide-in-from-top shrink-0" role="alert">
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <PhWarningCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-red-300 font-medium">{errInfo.title}</p>
                  <p className="text-xs text-red-400/60 mt-1">{errInfo.action}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={conversation.handleRetry} className="px-3 py-1.5 text-xs rounded-lg bg-[#00bcd4]/10 text-[#00bcd4] border border-[#00bcd4]/20 hover:bg-[#00bcd4]/15 transition-colors">
                      Retry
                    </button>
                    <Link href="/settings/providers" className="px-3 py-1.5 text-xs rounded-lg text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-colors">
                      Settings
                    </Link>
                    <button
                      onClick={() => { handleNewChat(); conversation.setChatError(null); }}
                      className="ml-auto p-1 text-white/20 hover:text-white/40 transition-colors"
                      aria-label="Dismiss error"
                    >
                      <PhX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          );
        })()}

        {/* World character banner */}
        {worldCharInit.isLoading && (
          <div className="mx-4 mt-2 shrink-0">
            <div className="bg-[#00bcd4]/5 border border-[#00bcd4]/10 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-[#00bcd4]/40 border-t-[#00bcd4] rounded-full animate-spin" />
              <span className="text-sm text-[#9be7f2]">Loading character...</span>
            </div>
          </div>
        )}
        {worldCharInit.worldCharacter && (
          <div className="mx-4 mt-2 shrink-0">
            <div className="bg-[#00bcd4]/5 border border-[#00bcd4]/10 rounded-xl px-4 py-3 flex items-center gap-3">
              {worldCharInit.worldCharacter.characterPortrait && (
                <Image
                  src={worldCharInit.worldCharacter.characterPortrait}
                  alt={worldCharInit.worldCharacter.characterName}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#00bcd4]/30"
                  unoptimized
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#9be7f2] font-medium truncate">
                  Chatting with {worldCharInit.worldCharacter.characterName}
                </p>
                <p className="text-[11px] text-white/30">from {worldCharInit.worldCharacter.worldName}</p>
              </div>
              <button
                onClick={() => { worldCharApplied.current = false; worldCharInit.clearWorldCharacter(); handleNewChat(); }}
                className="p-1.5 rounded-lg text-white/25 hover:text-white/50 hover:bg-white/[0.04] transition-colors"
                aria-label="End character chat"
                title="End character chat"
              >
                <PhX className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
        {worldCharInit.error && (
          <div className="mx-4 mt-2 shrink-0">
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
              <p className="text-sm text-red-300">Failed to load character: {worldCharInit.error}</p>
            </div>
          </div>
        )}

        {/* World Builder: "Create This World" CTA */}
        {worldMode.isWorldMode && worldMode.canCreateWorld && !worldMode.createdSlug && (
          <div className="mx-4 mt-2 shrink-0">
            <div className="bg-[#7c3aed]/5 border border-[#7c3aed]/15 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#c4b5fd] font-medium">Your world is taking shape.</p>
                <p className="text-[11px] text-white/30">Click to generate a full world from this conversation.</p>
              </div>
              <button
                disabled={worldMode.isCreating}
                onClick={() => {
                  worldMode.createWorld(conversation.messages.map((m) => ({ role: m.role, content: getMessageText(m) })));
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[#7c3aed]/15 border border-[#7c3aed]/30 text-[#c4b5fd] hover:bg-[#7c3aed]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {worldMode.isCreating ? (
                  <>
                    <span className="w-3 h-3 border-2 border-[#c4b5fd]/30 border-t-[#c4b5fd] rounded-full animate-spin" />
                    Creating...
                  </>
                ) : 'Create This World'}
              </button>
            </div>
          </div>
        )}
        {worldMode.createError && (
          <div className="mx-4 mt-2 shrink-0">
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
              <p className="text-sm text-red-300">{worldMode.createError}</p>
            </div>
          </div>
        )}
        {worldMode.createdSlug && (
          <div className="mx-4 mt-2 shrink-0">
            <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3 flex items-center gap-3">
              <p className="text-sm text-emerald-300 flex-1">World created!</p>
              <Link
                href={`/worlds/${worldMode.createdSlug}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition-all"
              >
                View it &rarr;
              </Link>
            </div>
          </div>
        )}

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
          onSelectLuminor={(config) => conversation.handleSelectLuminor(config as LuminorConfig)}
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
          onContinueLastSession={lastSessionTitle ? handleContinueLastSession : null}
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
          <div className="border-t border-white/[0.05] bg-gradient-to-t from-[#08080d] via-[#0a0a10] to-[#0c0c14] shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
            <div className="max-w-[720px] mx-auto">
              <AgentHeader
                activeAgent={resolvedAgent}
                currentModel={conversation.modelId ?? 'arcanea-auto'}
                onModelChange={conversation.setModelId}
                focusMode={conversation.focusMode ?? 'auto'}
                onFocusModeChange={conversation.setFocusMode}
                onOpenAgentPicker={() => setShowAgentPicker(true)}
              />
              <div className="px-4 pb-3">
              <ChatInputBar
                onSend={handleSend}
                onModelChange={conversation.setModelId}
                currentModel={conversation.modelId ?? 'arcanea-auto'}
                isStreaming={conversation.isStreaming}
                onStop={conversation.handleRegenerate}
                enabledTools={conversation.enabledTools}
                onToggleTool={conversation.toggleTool}
                externalMessage={pendingInput}
                onExternalMessageConsumed={() => setPendingInput('')}
                textareaRef={textareaRef}
              />
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-[10px] text-white/15 hidden sm:inline">@mention for agents</span>
                <CreationIndicator autoSave={autoSave} />
              </div>
              </div>
            </div>
          </div>
        </ChatArea>
      </ChatLayout>

      <AgentPicker
        open={showAgentPicker}
        onClose={() => setShowAgentPicker(false)}
        onSelect={(agent) => setActiveAgent(agent)}
        currentAgentId={activeAgent?.id}
      />

      {activeArtifact && (
        <ArtifactsPanel artifact={activeArtifact} onClose={() => setActiveArtifact(null)} />
      )}

      <CommandPalette
        open={conversation.commandPaletteOpen}
        onClose={() => conversation.setCommandPaletteOpen(false)}
        onSelectModel={(id) => { conversation.setModelId(id); conversation.setCommandPaletteOpen(false); }}
        onSelectFocus={(id) => { conversation.setFocusMode(id); conversation.setCommandPaletteOpen(false); }}
        onNewChat={() => { handleNewChat(); conversation.setCommandPaletteOpen(false); }}
        onBeamMode={() => {
          conversation.setBeamPrompt(conversation.input.trim() || 'Compare models');
          conversation.setCommandPaletteOpen(false);
        }}
      />

      {conversation.beamPrompt && (
        <BeamMode
          prompt={conversation.beamPrompt}
          provider={conversation.provider}
          clientApiKey={conversation.clientApiKey}
          focusHint={conversation.focusHint}
          onSelectResponse={() => { conversation.sendMessage({ text: conversation.beamPrompt! }); conversation.setBeamPrompt(null); }}
          onClose={() => conversation.setBeamPrompt(null)}
        />
      )}

      {showExport && (
        <ExportDialog
          messages={conversation.messages}
          luminorName={conversation.activeLuminor?.name}
          modelLabel={conversation.providerLabel}
          onClose={() => setShowExport(false)}
        />
      )}
    </>
  );
}
