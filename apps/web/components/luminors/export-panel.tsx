'use client';

import { Terminal, Globe, Package, Download, FileCode } from '@/lib/phosphor-icons';
import {
  exportAsClaudeCodeAgent,
  exportAsGPTConfig,
  exportAsLobeChatAgent,
  exportAsJSON,
  type LuminorSpec,
} from '@/lib/luminors/luminor-spec';

/* ------------------------------------------------------------------ */
/*  Download helper                                                    */
/* ------------------------------------------------------------------ */

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/*  Export options                                                      */
/* ------------------------------------------------------------------ */

const EXPORT_OPTIONS = [
  {
    key: 'claude-code',
    label: 'Claude Code',
    badge: '.md',
    icon: Terminal,
    description: 'Agent file for Claude Code & Codex',
    export: (spec: LuminorSpec) => ({
      content: exportAsClaudeCodeAgent(spec),
      filename: `${spec.name.toLowerCase().replace(/\s+/g, '-')}.md`,
      type: 'text/markdown',
    }),
  },
  {
    key: 'gpt-store',
    label: 'GPT Store',
    badge: '.json',
    icon: Globe,
    description: 'OpenAI GPT-compatible config',
    export: (spec: LuminorSpec) => ({
      content: JSON.stringify(exportAsGPTConfig(spec), null, 2),
      filename: `${spec.name.toLowerCase().replace(/\s+/g, '-')}-gpt.json`,
      type: 'application/json',
    }),
  },
  {
    key: 'lobechat',
    label: 'LobeChat',
    badge: '.json',
    icon: Package,
    description: 'LobeChat agent definition',
    export: (spec: LuminorSpec) => ({
      content: JSON.stringify(exportAsLobeChatAgent(spec), null, 2),
      filename: `${spec.name.toLowerCase().replace(/\s+/g, '-')}-lobechat.json`,
      type: 'application/json',
    }),
  },
  {
    key: 'portable',
    label: 'Portable JSON',
    badge: '.json',
    icon: FileCode,
    description: 'Universal Arcanea format',
    export: (spec: LuminorSpec) => ({
      content: exportAsJSON(spec),
      filename: `${spec.name.toLowerCase().replace(/\s+/g, '-')}-spec.json`,
      type: 'application/json',
    }),
  },
] as const;

/* ------------------------------------------------------------------ */
/*  ExportPanel                                                        */
/* ------------------------------------------------------------------ */

interface ExportPanelProps {
  spec: LuminorSpec;
}

export function ExportPanel({ spec }: ExportPanelProps) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center gap-2">
        <Download size={14} className="text-white/30" />
        <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
          Export as Agent
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {EXPORT_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                const { content, filename, type } = opt.export(spec);
                downloadFile(content, filename, type);
              }}
              className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] transition-colors group-hover:bg-white/[0.08]">
                <Icon size={16} className="text-white/40 transition-colors group-hover:text-white/70" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white/60 transition-colors group-hover:text-white/80">
                    {opt.label}
                  </span>
                  <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-mono text-white/30">
                    {opt.badge}
                  </span>
                </div>
                <p className="mt-0.5 text-[10px] text-white/25">{opt.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
