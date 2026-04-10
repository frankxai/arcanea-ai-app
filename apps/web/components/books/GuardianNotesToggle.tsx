'use client';

/**
 * Small client island used inside the server-rendered GuardianReport.
 * Keeps the surrounding component a pure server component.
 */

import { useState } from 'react';

interface GuardianNotesToggleProps {
  notes: string;
}

export function GuardianNotesToggle({ notes }: GuardianNotesToggleProps) {
  const [open, setOpen] = useState(false);

  if (!notes || notes.trim().length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-[10px] uppercase tracking-wider text-white/30 hover:text-white/60 transition-colors"
        aria-expanded={open}
      >
        {open ? '− Hide detailed notes' : '+ Show detailed notes'}
      </button>
      {open && (
        <p className="mt-2 text-xs text-white/50 leading-relaxed whitespace-pre-wrap">
          {notes}
        </p>
      )}
    </div>
  );
}

export default GuardianNotesToggle;
