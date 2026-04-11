'use client';

import { useCallback, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import type { Skill } from '@/lib/skills/loader';

type ToolId =
  | 'claude-code'
  | 'opencode'
  | 'cursor'
  | 'codex'
  | 'gemini-cli'
  | 'universal';

interface ToolDef {
  id: ToolId;
  label: string;
  buildCommand: (slug: string, skill: Skill) => string;
  description: (label: string) => string;
}

const TOOLS: ToolDef[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    buildCommand: (slug) => `cp -r oss/skills/arcanea/${slug} ~/.claude/skills/`,
    description: (label) =>
      `Copies the skill directory to your ${label} skills folder. Restart the tool to load.`,
  },
  {
    id: 'opencode',
    label: 'OpenCode',
    buildCommand: (slug) => `cp -r oss/skills/arcanea/${slug} ~/.opencode/skills/`,
    description: (label) =>
      `Copies the skill directory to your ${label} skills folder. Restart the tool to load.`,
  },
  {
    id: 'cursor',
    label: 'Cursor',
    buildCommand: (slug) => `cp -r oss/skills/arcanea/${slug} ~/.cursor/skills/`,
    description: (label) =>
      `Copies the skill directory to your ${label} skills folder. Restart the tool to load.`,
  },
  {
    id: 'codex',
    label: 'Codex',
    buildCommand: (slug) => `cp -r oss/skills/arcanea/${slug} ~/.codex/skills/`,
    description: (label) =>
      `Copies the skill directory to your ${label} skills folder. Restart the tool to load.`,
  },
  {
    id: 'gemini-cli',
    label: 'Gemini CLI',
    buildCommand: (slug) => `cp -r oss/skills/arcanea/${slug} ~/.gemini/skills/`,
    description: (label) =>
      `Copies the skill directory to your ${label} skills folder. Restart the tool to load.`,
  },
  {
    id: 'universal',
    label: 'Universal (npx)',
    buildCommand: (slug, skill) =>
      skill.installCommand || `npx arcanea install ${slug}`,
    description: () =>
      'Universal installer that detects your AI tool and copies the skill to the correct directory.',
  },
];

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`Copied ${label} install command`, { description: text });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy command');
    }
  }, [text, label]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-[#00bcd4]/30 hover:text-[#00bcd4]"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-400" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

export default function InstallTabs({ skill }: { skill: Skill }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-4">
      <Tabs defaultValue="claude-code" className="w-full">
        <TabsList className="flex w-full flex-wrap justify-start">
          {TOOLS.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TOOLS.map((tool) => {
          const command = tool.buildCommand(skill.slug, skill);
          return (
            <TabsContent key={tool.id} value={tool.id} className="mt-4">
              <div className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-black/40 px-4 py-3">
                <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-white/80">
                  <span className="mr-2 text-[#00bcd4]/60">$</span>
                  {command}
                </code>
                <CopyButton text={command} label={tool.label} />
              </div>
              <p className="mt-3 text-[11px] text-white/30">
                {tool.description(tool.label)}
              </p>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
