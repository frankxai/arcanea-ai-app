'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface CopyableCommandProps {
  command: string;
  label?: string;
  language?: string;
  className?: string;
  multiline?: boolean;
}

/**
 * Code block with one-click copy. Used throughout /contribute to surface
 * install / git commands so readers can run them without retyping.
 */
export function CopyableCommand({
  command,
  label,
  language = 'bash',
  className,
  multiline = false,
}: CopyableCommandProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(command);
      } else if (typeof document !== 'undefined') {
        // Progressive-enhancement fallback for browsers without clipboard API.
        const textarea = document.createElement('textarea');
        textarea.value = command;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success(label ? `Copied "${label}"` : 'Copied to clipboard');
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      toast.error('Copy failed — select the text manually');
    }
  }, [command, label]);

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-white/[0.08] bg-[#0c0c12]/80 backdrop-blur-sm',
        className,
      )}
    >
      {label ? (
        <div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-2">
          <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">{label}</span>
          <span className="text-[10px] text-white/25 font-mono">{language}</span>
        </div>
      ) : null}
      <div className="flex items-start gap-3 px-4 py-3">
        <pre
          className={cn(
            'flex-1 overflow-x-auto font-mono text-[12.5px] leading-relaxed text-[#9befe8]',
            multiline ? 'whitespace-pre' : 'whitespace-pre-wrap break-all',
          )}
        >
          <code>{command}</code>
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy command'}
          className={cn(
            'shrink-0 rounded-md border border-white/[0.08] bg-white/[0.03] p-1.5',
            'text-white/50 hover:text-[#00bcd4] hover:border-[#00bcd4]/30',
            'focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/40 transition-colors',
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
