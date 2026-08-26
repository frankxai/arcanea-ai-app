'use client';

import { Share2, Sparkles, PanelLeftClose, PanelLeft, Download, Upload, Shield, Mail } from 'lucide-react';
import { brand, cosmic, text } from '@arcanea/design-system/tokens';

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
      className="border-b"
      style={{
        backgroundColor: cosmic.deep,
        borderColor: cosmic.border,
      }}
    >
      {/* Dawnsworn strip - always visible on first fold */}
      <div
        className="px-4 py-2 border-b"
        style={{ borderColor: cosmic.border }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" style={{ color: brand.arcaneanGold }} aria-hidden="true" />
            <span
              className="text-sm font-medium"
              style={{ color: text.primary, fontFamily: 'Geist, sans-serif' }}
            >
              Become Dawnsworn
            </span>
            <span
              className="text-xs hidden sm:inline"
              style={{ color: text.secondary, fontFamily: 'Geist, sans-serif' }}
            >
              — fund the journey, display license, no IP sale
            </span>
          </div>

          <a
            href="mailto:frank@arcanea.ai?subject=Dawnsworn Interest"
            className="px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 text-sm"
            style={{
              backgroundColor: brand.arcaneanGold,
              color: cosmic.void,
              fontFamily: 'Geist, sans-serif',
              fontWeight: 500,
            }}
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Join waitlist</span>
          </a>
        </div>
      </div>

      {/* Main header toolbar */}
      <div className="h-14 flex items-center justify-between px-4">
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
