'use client';

/**
 * SessionSidebar — Chat history sidebar showing saved conversations
 *
 * Displays a list of previous chat sessions from localStorage.
 * Supports loading, deleting, and creating new sessions.
 * Designed to match the existing near-black Arcanea chat theme.
 */

import React from 'react';
import {
  PhPlus,
  PhX,
  PhChatCircleDots,
} from '@/lib/phosphor-icons';
import type { ChatSessionSummary } from '@/lib/chat/local-store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
// Component
// ---------------------------------------------------------------------------

interface SessionSidebarProps {
  sessions: ChatSessionSummary[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onNewChat: () => void;
}

export function SessionSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
}: SessionSidebarProps) {
  if (sessions.length === 0) {
    return (
      <div className="border-b border-white/[0.06]">
        <div className="px-3 pt-2 pb-1">
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-colors"
          >
            <PhPlus className="w-3.5 h-3.5" />
            New Chat
          </button>
        </div>
        <p className="text-[10px] text-white/20 text-center py-3 px-3">
          Your conversations will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="border-b border-white/[0.06]">
      {/* New Chat button */}
      <div className="px-3 pt-2 pb-1">
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-colors"
        >
          <PhPlus className="w-3.5 h-3.5" />
          New Chat
        </button>
      </div>

      {/* Session list */}
      <div
        className="max-h-[280px] overflow-y-auto px-2 pb-2"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
      >
        {sessions.map((session) => {
          const isActive = activeSessionId === session.id;
          return (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`group w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all duration-100 border ${
                isActive
                  ? 'bg-[#00bcd4]/8 border-[#00bcd4]/15'
                  : 'border-transparent hover:bg-white/[0.03]'
              }`}
            >
              <PhChatCircleDots
                className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#00bcd4]/60' : 'text-white/20'}`}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[11px] leading-tight truncate ${
                    isActive ? 'text-[#00bcd4]/90' : 'text-white/60'
                  }`}
                >
                  {session.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] text-white/20">
                    {relativeTime(session.updatedAt)}
                  </span>
                  <span className="text-[9px] text-white/15">
                    {session.messageCount} msg{session.messageCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded text-white/20 hover:text-red-400/70 hover:bg-red-400/10 transition-all shrink-0"
                aria-label={`Delete: ${session.title}`}
              >
                <PhX className="w-3 h-3" />
              </button>
            </button>
          );
        })}
      </div>
    </div>
  );
}
