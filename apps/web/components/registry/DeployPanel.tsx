'use client';

import { useState } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import type { RegistryAgent } from '@/lib/registry/queries';

interface DeployPanelProps {
  agent: RegistryAgent;
}

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

export function DeployPanel({ agent }: DeployPanelProps) {
  const [copied, setCopied] = useState<'mcp' | 'http' | null>(null);

  const mcpSnippet = `# MCP tool call
registry_deploy --agent-id ${agent.id}`;

  const httpSnippet = `# HTTP API
curl -X POST https://arcanea.ai/api/registry/deploy \\
  -H "Content-Type: application/json" \\
  -d '{"agent_id": "${agent.id}"}'`;

  const copy = async (text: string, which: 'mcp' | 'http') => {
    await navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: PREMIUM_EASE }}
        className="sticky top-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm"
      >
        <div className="mb-5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-white/40">Deploy</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold text-white">Free</span>
            {agent.is_open && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/80">
                Open · MIT
              </span>
            )}
          </div>
        </div>

        {/* MCP deploy */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">Via MCP</span>
            <button
              onClick={() => copy(mcpSnippet, 'mcp')}
              className="font-mono text-[10px] uppercase tracking-wider text-white/50 transition-colors hover:text-cyan-300"
            >
              {copied === 'mcp' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-lg border border-white/[0.06] bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-white/80">
            {mcpSnippet}
          </pre>
        </div>

        {/* HTTP deploy */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">Via HTTP</span>
            <button
              onClick={() => copy(httpSnippet, 'http')}
              className="font-mono text-[10px] uppercase tracking-wider text-white/50 transition-colors hover:text-cyan-300"
            >
              {copied === 'http' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-lg border border-white/[0.06] bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-white/80">
            {httpSnippet}
          </pre>
        </div>

        {/* Fork button */}
        {agent.source_url ? (
          <a
            href={agent.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-center font-mono text-xs uppercase tracking-wider text-white/70 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-cyan-200"
          >
            Fork on GitHub
          </a>
        ) : (
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.01] px-4 py-3 text-center font-mono text-[10px] uppercase tracking-wider text-white/30">
            Source coming soon
          </div>
        )}

        {/* Attribution note */}
        <p className="mt-6 border-t border-white/[0.06] pt-4 font-mono text-[10px] leading-relaxed text-white/40">
          Every deployment is recorded as an attribution event. Transparent by design — no hidden tracking,
          no revenue splits, no platform fees.
        </p>
      </m.div>
    </LazyMotion>
  );
}
