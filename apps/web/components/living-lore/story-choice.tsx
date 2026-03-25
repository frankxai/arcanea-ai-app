'use client';

import { useState } from 'react';
import { LazyMotion, domMax, m, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, transitions, springs } from '@/lib/design/motion';
import type { StoryChoice as StoryChoiceType } from '@/lib/living-lore/types';
import { getCrewMember } from '@/lib/living-lore/crew-data';

interface StoryChoiceProps {
  choice: StoryChoiceType;
  onSelect: (optionId: string) => void;
  selectedId?: string;
  disabled?: boolean;
}

export function StoryChoice({ choice, onSelect, selectedId, disabled }: StoryChoiceProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <LazyMotion features={domMax}>
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.enter}
        className="my-6"
      >
        {/* Narrative prompt */}
        <p className="text-sm italic text-text-primary/70 leading-relaxed mb-4 pl-3 border-l-2 border-atlantean-teal-aqua/20">
          {choice.prompt}
        </p>

        {/* Options */}
        <m.div
          variants={staggerContainer('normal')}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-2"
        >
          {choice.options.map((option) => {
            const isSelected = selectedId === option.id;
            const hasSelection = !!selectedId;
            const crewMember = option.crewMemberId
              ? getCrewMember(option.crewMemberId)
              : null;
            const accentColor = crewMember?.color ?? '#7fffd4';

            return (
              <m.button
                key={option.id}
                variants={staggerItem}
                onClick={() => {
                  if (!disabled && !hasSelection) onSelect(option.id);
                }}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                disabled={disabled || hasSelection}
                animate={{
                  scale: isSelected ? 1.02 : 1,
                  opacity: hasSelection && !isSelected ? 0.4 : 1,
                }}
                transition={springs.snappy}
                className="relative text-left rounded-xl border px-4 py-3 transition-colors duration-200"
                style={{
                  background: isSelected
                    ? `${accentColor}12`
                    : hoveredId === option.id
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(255,255,255,0.03)',
                  borderColor: isSelected
                    ? `${accentColor}50`
                    : 'rgba(255,255,255,0.06)',
                  boxShadow: isSelected
                    ? `0 0 20px ${accentColor}15`
                    : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  {crewMember && (
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm"
                      style={{ backgroundColor: `${crewMember.color}18` }}
                    >
                      {crewMember.avatar}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-text-primary leading-snug">
                      {option.label}
                    </p>
                    {option.description && (
                      <p className="text-xs text-text-dim mt-0.5">
                        {option.description}
                      </p>
                    )}
                  </div>
                  {isSelected && (
                    <m.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={springs.bouncy}
                      className="text-xs"
                      style={{ color: accentColor }}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </m.span>
                  )}
                </div>
              </m.button>
            );
          })}
        </m.div>

        {/* Consequence hint after selection */}
        <AnimatePresence>
          {selectedId && (
            <m.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transitions.smooth}
              className="text-xs text-text-dim italic mt-3 text-center"
            >
              {choice.consequence}
            </m.p>
          )}
        </AnimatePresence>
      </m.div>
    </LazyMotion>
  );
}
