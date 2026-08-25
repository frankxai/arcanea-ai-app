'use client';

import { Share2, Sparkles, PanelLeftClose, PanelLeft, Download, Upload } from 'lucide-react';
import { brand, cosmic } from '@arcanea/design-system/tokens';

interface BoardHeaderProps {
  boardName: string;
  onGenerate: () => void;
  onShare: () => void;
  onToggleSidebar: () => void;
  onExport: () => void;
  onImport: () => void;
  sidebarOpen: boolean;
}

export function BoardHeader({
  boardName,
  onGenerate,
  onShare,
  onToggleSidebar,
  onExport,
  onImport,
  sidebarOpen,
}: BoardHeaderProps) {
  return (
    <header
      className="h-14 flex items-center justify-between px-4 border-b"
      style={{
        backgroundColor: cosmic.deep,
        borderColor: cosmic.border,
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-5 h-5" style={{ color: brand.atlanteanTeal }} />
          ) : (
            <PanelLeft className="w-5 h-5" style={{ color: brand.atlanteanTeal }} />
          )}
        </button>

        <h1
          className="text-lg font-medium"
          style={{ fontFamily: 'Geist, sans-serif', color: brand.atlanteanTeal }}
        >
          {boardName}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onImport}
          className="p-2 rounded-md border transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            borderColor: cosmic.borderBright,
            color: brand.atlanteanTeal,
          }}
          aria-label="Import board"
        >
          <Upload className="w-4 h-4" />
        </button>

        <button
          onClick={onExport}
          className="p-2 rounded-md border transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            borderColor: cosmic.borderBright,
            color: brand.atlanteanTeal,
          }}
          aria-label="Export board"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={onGenerate}
          className="px-4 py-2 rounded-md flex items-center gap-2 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            backgroundColor: brand.arcaneanGold,
            color: cosmic.void,
            fontFamily: 'Geist, sans-serif',
            fontWeight: 500,
          }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate</span>
        </button>

        <button
          onClick={onShare}
          className="px-4 py-2 rounded-md flex items-center gap-2 border transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            borderColor: cosmic.borderBright,
            color: brand.atlanteanTeal,
            fontFamily: 'Geist, sans-serif',
            fontWeight: 500,
          }}
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </header>
  );
}
