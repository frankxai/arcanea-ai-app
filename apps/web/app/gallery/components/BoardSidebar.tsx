'use client';

import { Plus, Crown } from 'lucide-react';
import { brand, cosmic, text } from '@arcanea/design-system/tokens';

interface BoardSidebarProps {
  currentBoard: string;
  onNewWorld: () => void;
  onLoadArcanea: () => void;
}

export function BoardSidebar({
  currentBoard,
  onNewWorld,
  onLoadArcanea,
}: BoardSidebarProps) {
  return (
    <aside
      className="w-64 border-r flex flex-col"
      style={{
        backgroundColor: cosmic.deep,
        borderColor: cosmic.border,
      }}
    >
      <div className="p-4 border-b" style={{ borderColor: cosmic.border }}>
        <h2
          className="text-sm font-medium mb-3"
          style={{ color: text.secondary, fontFamily: 'Geist, sans-serif' }}
        >
          Boards
        </h2>

        <button
          onClick={onNewWorld}
          className="w-full px-3 py-2 rounded-md flex items-center gap-2 transition-all hover:bg-white/5 text-left"
          style={{
            color: text.primary,
            fontFamily: 'Geist, sans-serif',
            borderWidth: '1px',
            borderStyle: 'dashed',
            borderColor: cosmic.borderBright,
          }}
        >
          <Plus className="w-4 h-4" style={{ color: brand.atlanteanTeal }} />
          <span className="text-sm">New world</span>
        </button>
      </div>

      <div className="flex-1 p-4 space-y-2">
        <button
          onClick={onLoadArcanea}
          className={`w-full px-3 py-2 rounded-md flex items-center gap-2 transition-all text-left ${
            currentBoard === 'arcanea' ? 'bg-white/10' : 'hover:bg-white/5'
          }`}
          style={{
            color: text.primary,
            fontFamily: 'Geist, sans-serif',
          }}
        >
          <Crown className="w-4 h-4" style={{ color: brand.arcaneanGold }} />
          <span className="text-sm">Arcanea King's Table</span>
        </button>

        {currentBoard === 'blank' && (
          <div
            className="px-3 py-2 rounded-md"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: text.primary,
              fontFamily: 'Geist, sans-serif',
            }}
          >
            <span className="text-sm">New World</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t" style={{ borderColor: cosmic.border }}>
        <p className="text-xs" style={{ color: text.muted, fontFamily: 'Geist, sans-serif' }}>
          Drop images anywhere on the canvas. Use Generate to create new visuals.
        </p>
      </div>
    </aside>
  );
}
