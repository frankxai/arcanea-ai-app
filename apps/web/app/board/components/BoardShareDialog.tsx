'use client';

import { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { brand, cosmic, text } from '@arcanea/design-system/tokens';

interface BoardShareDialogProps {
  boardId: string;
  boardName: string;
  onClose: () => void;
}

export function BoardShareDialog({ boardId, boardName, onClose }: BoardShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/board?id=${boardId}` 
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border p-6 relative"
        style={{
          backgroundColor: cosmic.surface,
          borderColor: cosmic.borderBright,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-white/5 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" style={{ color: text.secondary }} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Share2 className="w-6 h-6" style={{ color: brand.atlanteanTeal }} />
          <h2
            className="text-xl font-medium"
            style={{ color: text.primary, fontFamily: 'Geist, sans-serif' }}
          >
            Share board
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className="block text-sm mb-2"
              style={{ color: text.secondary, fontFamily: 'Geist, sans-serif' }}
            >
              Board name
            </label>
            <p
              className="text-base"
              style={{ color: text.primary, fontFamily: 'Geist, sans-serif' }}
            >
              {boardName}
            </p>
          </div>

          <div>
            <label
              className="block text-sm mb-2"
              style={{ color: text.secondary, fontFamily: 'Geist, sans-serif' }}
            >
              Share link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 rounded-md border"
                style={{
                  backgroundColor: cosmic.raised,
                  borderColor: cosmic.borderBright,
                  color: text.primary,
                  fontFamily: 'Geist Mono, monospace',
                  fontSize: '0.875rem',
                }}
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-md border transition-all hover:bg-white/5"
                style={{
                  borderColor: cosmic.borderBright,
                  color: brand.atlanteanTeal,
                  fontFamily: 'Geist, sans-serif',
                  fontWeight: 500,
                }}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div
            className="p-4 rounded-md border"
            style={{
              backgroundColor: 'rgba(0,188,212,0.05)',
              borderColor: 'rgba(0,188,212,0.2)',
            }}
          >
            <p
              className="text-sm"
              style={{ color: text.primary, fontFamily: 'Geist, sans-serif' }}
            >
              Anyone with this link can view the board. Board state is stored locally in your browser using tldraw's persistence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
