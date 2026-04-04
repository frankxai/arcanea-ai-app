import { useState, useEffect, useCallback } from 'preact/hooks';
import { SearchBar } from '../components/SearchBar';
import { ConversationCard } from '../components/ConversationCard';
import { Button } from '../components/Button';
import { theme } from '../styles/theme';
import type { Platform } from '../../shared/types';

interface StoredConv {
  id: string;
  platform: Platform;
  title: string;
  exportedAt: number;
  messageCount: number;
  wordCount: number;
  hasCode: boolean;
  hasImages: boolean;
}

const PLATFORMS: Platform[] = ['chatgpt', 'claude', 'perplexity', 'grok', 'gemini'];

export function LibraryView() {
  const [conversations, setConversations] = useState<StoredConv[]>([]);
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<Platform | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const msg = search
        ? { type: 'SEARCH_CONVERSATIONS', payload: { query: search, platform: filterPlatform } }
        : { type: 'GET_CONVERSATIONS', payload: { platform: filterPlatform } };
      const result = await chrome.runtime.sendMessage(msg);
      setConversations(result?.conversations || []);
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [search, filterPlatform]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  function handleSelect(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }

  async function handleDeleteSelected() {
    for (const id of selected) {
      await chrome.runtime.sendMessage({ type: 'DELETE_CONVERSATION', payload: { id } });
    }
    setSelected(new Set());
    loadConversations();
  }

  const chipStyle = (active: boolean) => `
    padding: 4px 10px; border-radius: 16px; font-size: 11px; font-weight: 500;
    transition: all ${theme.transition}; cursor: pointer; white-space: nowrap;
    ${active
      ? `background: ${theme.primaryMuted}; color: ${theme.primary}; border: 1px solid ${theme.border};`
      : `background: transparent; color: ${theme.textMuted}; border: 1px solid ${theme.borderSubtle};`
    }
  `;

  return (
    <div style="display: flex; flex-direction: column; gap: 12px; animation: fadeIn 0.3s ease;">
      <SearchBar value={search} onChange={setSearch} />

      {/* Filter chips */}
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        <button
          style={chipStyle(!filterPlatform)}
          onClick={() => setFilterPlatform(null)}
        >
          All
        </button>
        {PLATFORMS.map((p) => (
          <button
            key={p}
            style={chipStyle(filterPlatform === p)}
            onClick={() => setFilterPlatform(filterPlatform === p ? null : p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div style={`
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 12px; border-radius: ${theme.radiusSm};
          background: ${theme.primaryMuted}; border: 1px solid ${theme.border};
        `}>
          <span style={`font-size: 12px; color: ${theme.primary};`}>
            {selected.size} selected
          </span>
          <div style="display: flex; gap: 8px;">
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteSelected}>
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Conversation list */}
      {loading ? (
        <div style={`text-align: center; padding: 32px; color: ${theme.textDim};`}>
          <div style="animation: pulse 2s ease-in-out infinite;">Loading...</div>
        </div>
      ) : conversations.length === 0 ? (
        <div style={`text-align: center; padding: 32px; color: ${theme.textDim};`}>
          <div style="font-size: 28px; opacity: 0.3; margin-bottom: 8px;">&#128218;</div>
          <p style="font-size: 13px;">
            {search ? 'No conversations match your search.' : 'No exported conversations yet.'}
          </p>
        </div>
      ) : (
        <div style="display: flex; flex-direction: column; gap: 8px;">
          {conversations.map((c) => (
            <ConversationCard
              key={c.id}
              id={c.id}
              title={c.title}
              platform={c.platform}
              date={c.exportedAt}
              wordCount={c.wordCount}
              messageCount={c.messageCount}
              hasCode={c.hasCode}
              hasImages={c.hasImages}
              selected={selected.has(c.id)}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
