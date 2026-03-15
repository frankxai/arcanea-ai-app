'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PhPlus, PhX, PhChatCircleDots } from '@/lib/phosphor-icons';

interface ConversationSummary {
  id: string;
  title: string;
  luminorId: string | null;
  messageCount: number;
  lastMessage: string | null;
  updatedAt: string;
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

export function ConversationList({ onNewChat }: { onNewChat: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = searchParams.get('conversation');
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations?limit=10');
      if (res.status === 401) { setConversations([]); setLoading(false); return; }
      if (!res.ok) throw new Error('fetch failed');
      const json = await res.json();
      setConversations(json.data ?? []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const handleSelect = useCallback((id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('conversation', id);
    router.push(`/chat?${params.toString()}`);
  }, [router, searchParams]);

  const handleDelete = useCallback(async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConversations((prev) => prev.filter((c) => c.id !== id));
    try { await fetch(`/api/conversations/${id}`, { method: 'DELETE' }); }
    catch { fetchConversations(); }
    if (activeId === id) { onNewChat(); router.push('/chat'); }
  }, [activeId, fetchConversations, onNewChat, router]);

  if (!loading && conversations.length === 0 && !error) return null;

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
      <div className="max-h-[220px] overflow-y-auto px-2 pb-2" style={{ scrollbarWidth: 'thin' }}>
        {loading && (
          <div className="flex flex-col gap-1 px-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 rounded-md bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        )}
        {error && <p className="text-[10px] text-white/20 text-center py-3">Could not load history</p>}
        {!loading && conversations.map((conv) => {
          const isActive = activeId === conv.id;
          return (
            <button
              key={conv.id}
              onClick={() => handleSelect(conv.id)}
              className={`group w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all duration-100 border ${
                isActive ? 'bg-[#00bcd4]/8 border-[#00bcd4]/15' : 'border-transparent hover:bg-white/[0.03]'
              }`}
            >
              <PhChatCircleDots className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#00bcd4]/60' : 'text-white/20'}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-[11px] leading-tight truncate ${isActive ? 'text-[#00bcd4]/90' : 'text-white/60'}`}>
                  {conv.title}
                </p>
                <span className="text-[9px] text-white/20">{relativeTime(conv.updatedAt)}</span>
              </div>
              <button
                onClick={(e) => handleDelete(e, conv.id)}
                className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded text-white/20 hover:text-red-400/70 hover:bg-red-400/10 transition-all shrink-0"
                aria-label={`Delete conversation: ${conv.title}`}
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
