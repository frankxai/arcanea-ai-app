'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  PhShare,
  PhCopy,
  PhLink,
  PhCheck,
  PhTwitterLogo,
} from '@/lib/phosphor-icons';

// ── Props ──────────────────────────────────────────────────────────────────

interface ShareButtonProps {
  /** The URL to share. Defaults to current page URL. */
  url?: string;
  /** Title for the share action */
  title: string;
  /** Description for social sharing */
  description?: string;
  /** Button size variant */
  size?: 'sm' | 'md';
  /** Callback after successful share */
  onShare?: (method: string) => void;
}

// ── Component ──────────────────────────────────────────────────────────────

export function ShareButton({
  url,
  title,
  description,
  size = 'md',
  onShare,
}: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  // Close menu on outside click
  useEffect(() => {
    if (!showMenu) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  const handleNativeShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url: shareUrl,
        });
        onShare?.('native');
      } catch {
        // User cancelled or share failed — no-op
      }
      setShowMenu(false);
    }
  }, [title, description, shareUrl, onShare]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onShare?.('copy');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      onShare?.('copy');
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl, onShare]);

  const handleTwitterShare = useCallback(() => {
    const text = encodeURIComponent(`${title}${description ? ` — ${description}` : ''}`);
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      '_blank',
      'width=550,height=420'
    );
    onShare?.('twitter');
    setShowMenu(false);
  }, [title, description, shareUrl, onShare]);

  const handleShare = useCallback(() => {
    // Try native share first (mobile)
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      handleNativeShare();
      return;
    }
    // Otherwise show dropdown menu
    setShowMenu((prev) => !prev);
  }, [handleNativeShare]);

  const sizeClasses = size === 'sm'
    ? 'w-7 h-7 text-xs'
    : 'w-9 h-9 text-sm';

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={handleShare}
        className={`${sizeClasses} rounded-lg flex items-center justify-center text-text-muted hover:text-crystal hover:bg-crystal/10 transition-all`}
        aria-label={`Share ${title}`}
      >
        <PhShare className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>

      {/* Dropdown menu (desktop fallback) */}
      {showMenu && (
        <div className="absolute right-0 top-full mt-1 z-30 w-48 rounded-xl bg-[#16161e] border border-white/[0.08] shadow-xl py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
          >
            {copied ? (
              <>
                <PhCheck className="w-3.5 h-3.5 text-crystal" />
                <span className="text-crystal">Copied</span>
              </>
            ) : (
              <>
                <PhLink className="w-3.5 h-3.5" />
                <span>Copy link</span>
              </>
            )}
          </button>

          <button
            onClick={handleTwitterShare}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
          >
            <PhTwitterLogo className="w-3.5 h-3.5" />
            <span>Share on X</span>
          </button>

          <div className="border-t border-white/[0.06] my-1" />

          <button
            onClick={() => {
              handleCopyLink();
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
          >
            <PhCopy className="w-3.5 h-3.5" />
            <span>Copy as Markdown</span>
          </button>
        </div>
      )}
    </div>
  );
}
