/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { User, Shield, Heart, Sparkle, ChatCircleText, CaretDown, CaretUp } from '@/lib/phosphor-icons';
import type { CharacterDiamond } from '@/lib/author/types';

interface CharacterDiamondCardProps {
  character: CharacterDiamond;
  onSelectCharacter?: (char: CharacterDiamond) => void;
}

export function CharacterDiamondCard({ character, onSelectCharacter }: CharacterDiamondCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 space-y-3 transition-all hover:border-white/[0.1]">
      {/* Top Profile */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/20 to-[var(--arc-brand-arcanean-gold)]/20 border border-white/[0.08] flex items-center justify-center text-white/80 font-display text-xs font-semibold">
            {character.avatarUrl ? (
              <img src={character.avatarUrl} alt={character.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              character.name.charAt(0)
            )}
          </div>
          <div>
            <h4 className="font-display text-xs font-semibold text-white/90">{character.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-sans text-[var(--arc-brand-atlantean-teal)]/80">
                {character.originClass}
              </span>
              <span className="text-white/20">&middot;</span>
              <span className="text-[9px] font-sans text-[var(--arc-brand-arcanean-gold)]/80">
                Gate: {character.primaryGate}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded text-white/30 hover:text-white/70 hover:bg-white/[0.03] transition-colors"
          title={expanded ? 'Collapse' : 'Expand Diamond'}
        >
          {expanded ? <CaretUp size={12} /> : <CaretDown size={12} />}
        </button>
      </div>

      {/* Signature Dialogue Preview */}
      {character.signatureDialogue && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[10px] text-white/60 italic">
          <ChatCircleText size={12} className="text-white/30 flex-shrink-0 mt-0.5" />
          <p>&ldquo;{character.signatureDialogue}&rdquo;</p>
        </div>
      )}

      {/* Character Diamond Grid (Desire, Wound, Mask, Truth) */}
      {expanded && (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04]">
          {/* Desire */}
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-1">
            <span className="text-[9px] font-sans uppercase font-semibold text-amber-300/80 flex items-center gap-1">
              <Sparkle size={10} /> Conscious Desire
            </span>
            <p className="text-[10px] text-white/50 leading-snug">{character.desire}</p>
          </div>

          {/* Wound */}
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-1">
            <span className="text-[9px] font-sans uppercase font-semibold text-rose-300/80 flex items-center gap-1">
              <Heart size={10} /> Formative Wound
            </span>
            <p className="text-[10px] text-white/50 leading-snug">{character.wound}</p>
          </div>

          {/* Mask */}
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-1">
            <span className="text-[9px] font-sans uppercase font-semibold text-cyan-300/80 flex items-center gap-1">
              <Shield size={10} /> Public Mask
            </span>
            <p className="text-[10px] text-white/50 leading-snug">{character.mask}</p>
          </div>

          {/* Truth */}
          <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-1">
            <span className="text-[9px] font-sans uppercase font-semibold text-emerald-300/80 flex items-center gap-1">
              <User size={10} /> Ultimate Truth
            </span>
            <p className="text-[10px] text-white/50 leading-snug">{character.truth}</p>
          </div>
        </div>
      )}
    </div>
  );
}
