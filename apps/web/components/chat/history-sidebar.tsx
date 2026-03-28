'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  ChatCircleDots,
  House,
  GearSix,
  MagnifyingGlass,
  Trash,
  CaretLeft,
  PencilSimple,
  Check,
  X,
  UserCircle,
  FolderOpen,
} from '@/lib/phosphor-icons';
import type { ChatSessionSummary } from '@/lib/chat/local-store';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HistorySidebarProps {
  expanded: boolean;
  onToggle: () => void;
  sessions: ChatSessionSummary[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  activeSessionId?: string;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, title: string) => void;
  onTogglePin?: (id: string) => void;
}

interface TimeGroups {
  today: ChatSessionSummary[];
  yesterday: ChatSessionSummary[];
  week: ChatSessionSummary[];
  older: ChatSessionSummary[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function groupByTime(sessions: ChatSessionSummary[]): TimeGroups {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const week = new Date(today.getTime() - 7 * 86400000);

  return {
    today: sessions.filter((s) => new Date(s.updatedAt) >= today),
    yesterday: sessions.filter((s) => {
      const d = new Date(s.updatedAt);
      return d >= yesterday && d < today;
    }),
    week: sessions.filter((s) => {
      const d = new Date(s.updatedAt);
      return d >= week && d < yesterday;
    }),
    older: sessions.filter((s) => new Date(s.updatedAt) < week),
  };
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ---------------------------------------------------------------------------
// Session Item
// ---------------------------------------------------------------------------

interface SessionItemProps {
  session: ChatSessionSummary;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
  onTogglePin?: () => void;
  onAutoClose?: () => void;
}

function SessionItem({ session, isActive, onSelect, onDelete, onRename, onTogglePin, onAutoClose }: SessionItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(session.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleDoubleClick = useCallback(() => {
    setEditValue(session.title);
    setEditing(true);
  }, [session.title]);

  const commitRename = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== session.title) {
      onRename(trimmed);
    }
    setEditing(false);
  }, [editValue, session.title, onRename]);

  const cancelRename = useCallback(() => {
    setEditValue(session.title);
    setEditing(false);
  }, [session.title]);

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (confirmDelete) {
        onDelete();
        setConfirmDelete(false);
      } else {
        setConfirmDelete(true);
        // Auto-reset confirm after 5s
        setTimeout(() => setConfirmDelete(false), 5000);
      }
    },
    [confirmDelete, onDelete]
  );

  const handleSelect = useCallback(() => {
    onSelect();
    // Auto-close sidebar on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      onAutoClose?.();
    }
  }, [onSelect, onAutoClose]);

  return (
    <button
      onClick={handleSelect}
      onDoubleClick={handleDoubleClick}
      aria-current={isActive ? 'page' : undefined}
      className={`group w-full flex items-center gap-2 px-2.5 py-2.5 min-h-[44px] rounded-lg text-left transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none ${
        isActive
          ? 'bg-[#00bcd4]/8 border-l-2 border-[#00bcd4]'
          : 'border-l-2 border-transparent hover:bg-white/[0.06]'
      }`}
    >
      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="flex items-center gap-1">
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') cancelRename();
              }}
              onBlur={commitRename}
              onClick={(e) => e.stopPropagation()}
              aria-label="Rename conversation"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-1.5 py-0.5 text-[11px] text-white/90 outline-none focus:border-[#00bcd4]/40 focus:bg-white/[0.06] transition-colors"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                commitRename();
              }}
              className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-teal-400/70 hover:text-teal-400 focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
              aria-label="Confirm rename"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                cancelRename();
              }}
              className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-white/30 hover:text-white/60 transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
              aria-label="Cancel rename"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <>
            <p className={`text-[11px] leading-tight line-clamp-1 ${isActive ? 'text-white' : 'text-white/60'}`}>
              {session.title}
            </p>
            <span className="text-[9px] text-white/20 mt-0.5 block">
              {relativeTime(session.updatedAt)}
            </span>
          </>
        )}
      </div>

      {/* Pin indicator — always visible when pinned */}
      {!editing && session.pinned && (
        <button
          onClick={(e) => { e.stopPropagation(); onTogglePin?.(); }}
          className="shrink-0 p-0.5 rounded transition-colors text-[#ffd700] hover:text-[#ffd700]/70"
          aria-label="Unpin"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 1.5l1.85 3.75L14 5.85l-3 2.92.71 4.13L8 10.9l-3.71 2 .71-4.13-3-2.92 4.15-.6L8 1.5z" />
          </svg>
        </button>
      )}

      {/* Action buttons — visible on hover, hidden during edit */}
      {!editing && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {/* Pin button — only show outline on hover when not already pinned */}
          {!session.pinned && (
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePin?.(); }}
              className="w-5 h-5 flex items-center justify-center rounded text-white/0 group-hover:text-white/20 hover:!text-[#ffd700]/70 hover:bg-[#ffd700]/5 focus-visible:ring-2 focus-visible:ring-[#ffd700]/40 focus-visible:outline-none transition-colors"
              aria-label="Pin"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 1.5l1.85 3.75L14 5.85l-3 2.92.71 4.13L8 10.9l-3.71 2 .71-4.13-3-2.92 4.15-.6L8 1.5z" />
              </svg>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDoubleClick();
            }}
            className="w-5 h-5 flex items-center justify-center rounded text-white/20 hover:text-white/50 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
            aria-label={`Rename: ${session.title}`}
          >
            <PencilSimple className="w-3 h-3" />
          </button>
          {confirmDelete ? (
            <button
              onClick={handleDeleteClick}
              className="shrink-0 px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/20 focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
              aria-label="Confirm delete"
            >
              Delete?
            </button>
          ) : (
            <button
              onClick={handleDeleteClick}
              className="w-5 h-5 flex items-center justify-center rounded text-white/20 hover:text-red-400/70 hover:bg-red-400/10 transition-all focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
              aria-label={`Delete: ${session.title}`}
            >
              <Trash className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Time Group Section
// ---------------------------------------------------------------------------

interface TimeGroupProps {
  label: string;
  sessions: ChatSessionSummary[];
  activeSessionId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onTogglePin?: (id: string) => void;
  onAutoClose?: () => void;
  labelClassName?: string;
}

function TimeGroup({ label, sessions, activeSessionId, onSelect, onDelete, onRename, onTogglePin, onAutoClose, labelClassName }: TimeGroupProps) {
  if (sessions.length === 0) return null;

  return (
    <div className="mb-1">
      <div className="px-3 py-1.5">
        <span className={`text-[10px] uppercase tracking-[0.08em] font-medium ${labelClassName || 'text-white/25'}`}>
          {label}
        </span>
      </div>
      <div className="px-1.5 flex flex-col gap-0.5">
        {sessions.map((session) => (
          <SessionItem
            key={session.id}
            session={session}
            isActive={activeSessionId === session.id}
            onSelect={() => onSelect(session.id)}
            onDelete={() => onDelete(session.id)}
            onRename={(title) => onRename(session.id, title)}
            onTogglePin={onTogglePin ? () => onTogglePin(session.id) : undefined}
            onAutoClose={onAutoClose}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Collapsed Rail
// ---------------------------------------------------------------------------

interface CollapsedRailProps {
  onToggle: () => void;
  onNewChat: () => void;
}

function CollapsedRail({ onToggle, onNewChat }: CollapsedRailProps) {
  return (
    <div className="flex w-12 flex-shrink-0 flex-col items-center py-3 gap-2 border-r border-cosmic-border bg-cosmic-deep/90 backdrop-blur-xl max-md:hidden">
      {/* New Chat */}
      <button
        onClick={onNewChat}
        className="w-8 h-8 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
        aria-label="New chat"
        title="New chat"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Toggle expand */}
      <button
        onClick={onToggle}
        className="w-8 h-8 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
        aria-label="Show history"
        aria-expanded={false}
        title="Chat history"
      >
        <ChatCircleDots className="w-4 h-4" />
      </button>

      {/* Divider */}
      <div className="w-5 border-t border-white/5" />

      {/* Home */}
      <Link
        href="/"
        className="w-8 h-8 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
        title="Home"
      >
        <House className="w-4 h-4" />
      </Link>

      {/* My Creations */}
      <Link
        href="/creations"
        className="w-8 h-8 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
        title="My Creations"
      >
        <FolderOpen className="w-4 h-4" />
      </Link>

      {/* Settings */}
      <Link
        href="/settings"
        className="w-8 h-8 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
        title="Settings"
      >
        <GearSix className="w-4 h-4" />
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User avatar area */}
      <Link
        href="/settings"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
        title="Account"
      >
        <UserCircle className="w-5 h-5" />
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Expanded Panel
// ---------------------------------------------------------------------------

interface ExpandedPanelProps {
  onToggle: () => void;
  onNewChat: () => void;
  sessions: ChatSessionSummary[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  activeSessionId?: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, title: string) => void;
  onTogglePin?: (id: string) => void;
}

function ExpandedPanel({
  onToggle,
  onNewChat,
  sessions,
  searchQuery,
  onSearchQueryChange,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onTogglePin,
}: ExpandedPanelProps) {
  // Separate pinned from unpinned, then group unpinned by time
  const pinnedSessions = sessions.filter((s) => s.pinned);
  const unpinnedSessions = sessions.filter((s) => !s.pinned);
  const groups = groupByTime(unpinnedSessions);

  // Auto-close handler for mobile
  const handleAutoClose = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      onToggle();
    }
  }, [onToggle]);

  // On mobile, chat-layout already handles fixed overlay + backdrop
  // so this panel just fills its container. On desktop it's inline.
  return (
    <>
      <aside
        className="flex flex-col w-full h-full bg-cosmic-deep/90 backdrop-blur-xl transition-[width] duration-200 ease-in-out"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-white/[0.06]">
          <button
            onClick={onNewChat}
            aria-label="Start new conversation"
            className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-[44px] rounded-lg text-xs font-medium text-[#00bcd4] hover:bg-[#00bcd4]/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
          >
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </button>
          <button
            onClick={onToggle}
            className="w-7 h-7 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
            aria-label="Collapse sidebar"
            aria-expanded={true}
          >
            <CaretLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="relative">
            <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
              <input
                type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Search chats..."
              aria-label="Search conversations"
              className="w-full pl-8 pr-3 py-1.5 min-h-[44px] rounded-lg bg-white/[0.04] border border-white/[0.06]
                text-xs text-white/80 placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-[#00bcd4]/30 focus:bg-white/[0.06] focus:border-[#00bcd4]/30 transition-colors"
            />
          </div>
        </div>

        {/* Session list */}
        <nav
          role="navigation"
          aria-label="Conversation history"
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
        >
          {sessions.length === 0 ? (
            <div className="px-3 py-4">
              {searchQuery.trim() ? (
                <div className="text-center py-4">
                  <p className="text-[11px] text-white/20 mb-2">
                    No matches found
                  </p>
                  <button
                    onClick={() => onSearchQueryChange('')}
                    className="text-[10px] text-[#00bcd4]/60 hover:text-[#00bcd4] transition-colors"
                  >
                    Clear search
                  </button>
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8">
                  <ChatCircleDots className="w-6 h-6 text-white/10 mx-auto mb-2" />
                  <p className="text-[11px] text-white/20">
                    No conversations yet
                  </p>
                  <p className="text-[10px] text-white/10 mt-1">
                    Start a chat to begin
                  </p>
                </div>
              ) : (
                /* Loading skeleton */
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="px-2">
                      <div className="h-3 bg-white/[0.06] rounded w-3/4 mb-1.5" />
                      <div className="h-2 bg-white/[0.04] rounded w-1/3" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {pinnedSessions.length > 0 && (
                <TimeGroup
                  label="Pinned"
                  sessions={pinnedSessions}
                  activeSessionId={activeSessionId}
                  onSelect={onSelectSession}
                  onDelete={onDeleteSession}
                  onRename={onRenameSession}
                  onTogglePin={onTogglePin}
                  onAutoClose={handleAutoClose}
                  labelClassName="text-[#ffd700]/50"
                />
              )}
              <TimeGroup
                label="Today"
                sessions={groups.today}
                activeSessionId={activeSessionId}
                onSelect={onSelectSession}
                onDelete={onDeleteSession}
                onRename={onRenameSession}
                onTogglePin={onTogglePin}
                onAutoClose={handleAutoClose}
              />
              <TimeGroup
                label="Yesterday"
                sessions={groups.yesterday}
                activeSessionId={activeSessionId}
                onSelect={onSelectSession}
                onDelete={onDeleteSession}
                onRename={onRenameSession}
                onTogglePin={onTogglePin}
                onAutoClose={handleAutoClose}
              />
              <TimeGroup
                label="Previous 7 Days"
                sessions={groups.week}
                activeSessionId={activeSessionId}
                onSelect={onSelectSession}
                onDelete={onDeleteSession}
                onRename={onRenameSession}
                onTogglePin={onTogglePin}
                onAutoClose={handleAutoClose}
              />
              <TimeGroup
                label="Older"
                sessions={groups.older}
                activeSessionId={activeSessionId}
                onSelect={onSelectSession}
                onDelete={onDeleteSession}
                onRename={onRenameSession}
                onTogglePin={onTogglePin}
                onAutoClose={handleAutoClose}
              />
            </>
          )}
        </nav>

        {/* Cross-route links */}
        <div className="flex items-center gap-3 px-3 py-2 border-t border-white/[0.04]">
          <Link href="/gallery" className="text-[11px] text-white/30 hover:text-[#00bcd4]/60 transition-colors">Gallery</Link>
          <Link href="/academy" className="text-[11px] text-white/30 hover:text-[#00bcd4]/60 transition-colors">Academy</Link>
          <Link href="/library" className="text-[11px] text-white/30 hover:text-[#00bcd4]/60 transition-colors">Library</Link>
        </div>

        {/* Footer nav */}
        <div className="border-t border-white/[0.06] px-3 py-2 flex items-center gap-1">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2 py-1.5 min-h-[44px] rounded-lg text-[11px] text-white/40 hover:text-white/70 hover:bg-white/[0.06] hover:shadow-glow-sm/20 transition-all focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
          >
            <House className="w-3.5 h-3.5" />
            Home
          </Link>
          <Link
            href="/creations"
            className="flex items-center gap-1.5 px-2 py-1.5 min-h-[44px] rounded-lg text-[11px] text-white/40 hover:text-white/70 hover:bg-white/[0.06] hover:shadow-glow-sm/20 transition-all focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Creations
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-1.5 px-2 py-1.5 min-h-[44px] rounded-lg text-[11px] text-white/40 hover:text-white/70 hover:bg-white/[0.06] hover:shadow-glow-sm/20 transition-all focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
          >
            <GearSix className="w-3.5 h-3.5" />
            Settings
          </Link>
          <div className="flex-1" />
          <Link
            href="/settings"
            className="w-7 h-7 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
            title="Account"
          >
            <UserCircle className="w-4 h-4" />
          </Link>
        </div>
      </aside>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Export
// ---------------------------------------------------------------------------

export function HistorySidebar({
  expanded,
  onToggle,
  sessions,
  searchQuery,
  onSearchQueryChange,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onTogglePin,
}: HistorySidebarProps) {
  if (!expanded) {
    return <CollapsedRail onToggle={onToggle} onNewChat={onNewChat} />;
  }

  return (
    <ExpandedPanel
      onToggle={onToggle}
      onNewChat={onNewChat}
      sessions={sessions}
      searchQuery={searchQuery}
      onSearchQueryChange={onSearchQueryChange}
      activeSessionId={activeSessionId}
      onSelectSession={onSelectSession}
      onDeleteSession={onDeleteSession}
      onRenameSession={onRenameSession}
      onTogglePin={onTogglePin}
    />
  );
}
