'use client';

import { m, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface StyleTooltipProps {
  style: {
    id: string;
    name: string;
    description: string;
    guardian?: string;
    element?: string;
    tier: 'free' | 'premium';
  } | null;
  anchor: { top: number; left: number; width: number } | null;
}

export function StyleTooltip({ style, anchor }: StyleTooltipProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !style || !anchor) return null;

  const isPremium = style.tier === 'premium';

  return createPortal(
    <AnimatePresence>
      {style && (
        <m.div
          initial={{ opacity: 0, y: 4, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[100] pointer-events-none"
          style={{
            top: anchor.top - 8,
            left: anchor.left + anchor.width / 2,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="bg-[#151518] border border-white/[0.08] rounded-xl px-3.5 py-2.5 shadow-2xl max-w-[280px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-white/90">{style.name}</span>
              {isPremium ? (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Forge
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Free
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">{style.description}</p>
            {(style.guardian || style.element) && (
              <div className="flex items-center gap-1.5 mt-1.5">
                {style.guardian && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00bcd4]/10 text-[#00bcd4]/70 border border-[#00bcd4]/15">
                    {style.guardian}
                  </span>
                )}
                {style.element && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30 border border-white/[0.06]">
                    {style.element}
                  </span>
                )}
              </div>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
