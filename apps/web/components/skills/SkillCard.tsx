'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import type { Skill } from '@/lib/skills/loader';

const TOOL_LABELS: Record<string, string> = {
  'claude-code': 'Claude',
  opencode: 'OpenCode',
  cursor: 'Cursor',
  codex: 'Codex',
  gemini: 'Gemini',
};

function CopyIcon({ copied }: { copied: boolean }) {
  if (copied) {
    return (
      <svg
        className="w-3.5 h-3.5 text-green-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    );
  }
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

export default function SkillCard({ skill }: { skill: Skill }) {
  const [copied, setCopied] = useState(false);

  const installCommand =
    skill.installCommand || `npx arcanea install ${skill.slug}`;

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(installCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* ignore */
      }
    },
    [installCommand]
  );

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group relative flex flex-col h-full rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm p-6 transition-all hover:border-[#00bcd4]/30 hover:bg-white/[0.05] hover:-translate-y-0.5"
    >
      {/* Gradient accent */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00bcd4]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative flex flex-col h-full">
        {/* Category pill */}
        {skill.category && (
          <div className="mb-3">
            <span className="inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-md bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-[#00bcd4]/80">
              {skill.category}
            </span>
          </div>
        )}

        {/* Name */}
        <h3 className="font-display text-lg font-semibold text-white/95 group-hover:text-white mb-2 leading-tight">
          {skill.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-2 flex-1">
          {skill.description}
        </p>

        {/* Tool compat */}
        {skill.toolCompatibility && skill.toolCompatibility.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {skill.toolCompatibility.slice(0, 5).map((t) => (
              <span
                key={t}
                className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-white/40"
              >
                {TOOL_LABELS[t] || t}
              </span>
            ))}
          </div>
        )}

        {/* Install command */}
        <div className="mt-auto flex items-center gap-2 rounded-md bg-black/40 border border-white/[0.04] px-3 py-2">
          <code className="flex-1 font-mono text-[11px] text-white/60 truncate">
            {installCommand}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy install command"
            className="shrink-0 p-1 rounded hover:bg-white/10 text-white/40 hover:text-[#00bcd4] transition-colors"
          >
            <CopyIcon copied={copied} />
          </button>
        </div>

        {/* Arrow */}
        <div className="absolute top-0 right-0 text-white/10 group-hover:text-[#00bcd4]/60 transition-colors text-sm">
          →
        </div>
      </div>
    </Link>
  );
}
