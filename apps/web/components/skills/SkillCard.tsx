'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import {
  Check,
  Code,
  Copy,
  Edit3,
  Terminal,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Skill } from '@/lib/skills/loader';

const TOOL_LABELS: Record<string, string> = {
  'claude-code': 'Claude',
  opencode: 'OpenCode',
  cursor: 'Cursor',
  codex: 'Codex',
  gemini: 'Gemini',
};

const TOOL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'claude-code': Terminal,
  opencode: Code,
  cursor: Edit3,
  codex: Code,
  gemini: Terminal,
};

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
        toast.success('Install command copied', {
          description: installCommand,
        });
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Failed to copy command');
      }
    },
    [installCommand]
  );

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 rounded-2xl"
    >
      <Card
        variant="interactive"
        className="relative flex h-full flex-col overflow-hidden transition-all group-hover:border-[#00bcd4]/30"
      >
        {/* Gradient accent on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00bcd4]/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        <CardHeader className="relative pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {skill.category && (
                <Badge variant="crystal" size="sm" className="mb-3 uppercase tracking-widest">
                  {skill.category}
                </Badge>
              )}
              <CardTitle className="leading-tight text-white/95 group-hover:text-white line-clamp-2">
                {skill.name}
              </CardTitle>
            </div>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-white/10 transition-colors group-hover:text-[#00bcd4]/80"
              aria-hidden="true"
            />
          </div>
        </CardHeader>

        <CardContent className="relative flex-1 pt-0">
          <CardDescription className="line-clamp-2 text-white/50">
            {skill.description}
          </CardDescription>

          {skill.toolCompatibility && skill.toolCompatibility.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {skill.toolCompatibility.slice(0, 5).map((t) => {
                const Icon = TOOL_ICONS[t];
                return (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white/40"
                  >
                    {Icon && <Icon className="h-2.5 w-2.5" />}
                    {TOOL_LABELS[t] || t}
                  </span>
                );
              })}
            </div>
          )}
        </CardContent>

        <CardFooter className="relative mt-auto border-t-0 pt-0">
          <div className="flex w-full items-center gap-2 rounded-md border border-white/[0.04] bg-black/40 px-3 py-2">
            <code className="flex-1 truncate font-mono text-[11px] text-white/60">
              {installCommand}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy install command"
              className="shrink-0 rounded p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-[#00bcd4]"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
