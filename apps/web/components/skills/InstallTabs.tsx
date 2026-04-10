'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Skill } from '@/lib/skills/loader';

type ToolId = 'claude-code' | 'opencode' | 'cursor' | 'codex' | 'gemini' | 'npx';

interface ToolDef {
  id: ToolId;
  label: string;
  buildCommand: (slug: string, skill: Skill) => string;
}

const TOOLS: ToolDef[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    buildCommand: (slug) => `cp -r skills/${slug} ~/.claude/skills/`,
  },
  {
    id: 'opencode',
    label: 'OpenCode',
    buildCommand: (slug) => `cp -r skills/${slug} ~/.opencode/skills/`,
  },
  {
    id: 'cursor',
    label: 'Cursor',
    buildCommand: (slug) => `cp -r skills/${slug} ~/.cursor/skills/`,
  },
  {
    id: 'codex',
    label: 'Codex',
    buildCommand: (slug) => `cp -r skills/${slug} ~/.codex/skills/`,
  },
  {
    id: 'gemini',
    label: 'Gemini CLI',
    buildCommand: (slug) => `cp -r skills/${slug} ~/.gemini/skills/`,
  },
  {
    id: 'npx',
    label: 'Universal (npx)',
    buildCommand: (slug, skill) =>
      skill.installCommand || `npx arcanea install ${slug}`,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-[#00bcd4] hover:border-[#00bcd4]/30 transition-colors text-xs font-medium"
    >
      {copied ? (
        <>
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
          Copied
        </>
      ) : (
        <>
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
          Copy
        </>
      )}
    </button>
  );
}

export default function InstallTabs({ skill }: { skill: Skill }) {
  const [active, setActive] = useState<ToolId>('claude-code');

  const activeTool = TOOLS.find((t) => t.id === active) ?? TOOLS[0];
  const command = useMemo(
    () => activeTool.buildCommand(skill.slug, skill),
    [activeTool, skill]
  );

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-white/[0.06] bg-black/20">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`px-4 py-3 text-xs font-medium transition-colors border-b-2 ${
              active === t.id
                ? 'text-[#00bcd4] border-[#00bcd4]'
                : 'text-white/50 border-transparent hover:text-white/80'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Command */}
      <div className="p-5">
        <div className="flex items-center gap-3 rounded-lg bg-black/40 border border-white/[0.04] px-4 py-3">
          <code className="flex-1 font-mono text-[13px] text-white/80 overflow-x-auto whitespace-nowrap">
            <span className="text-[#00bcd4]/60 mr-2">$</span>
            {command}
          </code>
          <CopyButton text={command} />
        </div>
        <p className="mt-3 text-[11px] text-white/30">
          {active === 'npx'
            ? 'Universal installer that detects your AI tool and copies the skill to the correct directory.'
            : `Copies the skill directory to your ${activeTool.label} skills folder. Restart the tool to load.`}
        </p>
      </div>
    </div>
  );
}
