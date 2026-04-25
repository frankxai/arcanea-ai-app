'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RUNTIMES, type Runtime } from '../lib/runtimes';
import { emit } from '../lib/intent-bus';

export function RuntimeLauncher() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleClick = async (runtime: Runtime) => {
    if (runtime.status === 'install') {
      if (runtime.hosted) window.open(runtime.hosted, '_blank', 'noopener,noreferrer');
      return;
    }
    try {
      await navigator.clipboard.writeText(runtime.command);
      setCopiedId(runtime.id);
      setTimeout(() => setCopiedId(null), 1400);
    } catch {}
    emit({
      kind: 'runtime',
      runtimeId: runtime.id,
      command: runtime.command,
      trigger: 'click',
      summary: `Copied launch command for ${runtime.name}`,
    });
  };

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Runtimes</p>
        <span className="text-[10px] text-white/25">click to copy</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {RUNTIMES.map((r) => (
          <motion.button
            key={r.id}
            type="button"
            onClick={() => handleClick(r)}
            whileTap={{ scale: 0.97 }}
            className="text-left rounded-lg px-2.5 py-2 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all relative overflow-hidden"
            style={{
              boxShadow: copiedId === r.id ? `0 0 18px ${r.color}55` : undefined,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: r.color, boxShadow: `0 0 6px ${r.color}` }}
              />
              <span className="text-[11px] font-medium text-white/85 truncate">{r.name}</span>
            </div>
            <p className="text-[10px] text-white/40 truncate">{r.tagline}</p>
            {copiedId === r.id ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-1.5 right-2 text-[9px] uppercase tracking-widest"
                style={{ color: r.color }}
              >
                copied
              </motion.span>
            ) : null}
            {r.status === 'install' ? (
              <span className="absolute top-1.5 right-2 text-[8px] uppercase tracking-widest text-white/30">
                install
              </span>
            ) : null}
          </motion.button>
        ))}
      </div>

      <p className="text-[10px] text-white/30 mt-3 leading-relaxed">
        One intent, many runtimes. Same prompt, your choice of brain.
      </p>
    </div>
  );
}
