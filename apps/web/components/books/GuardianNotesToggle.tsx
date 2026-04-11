'use client';

/**
 * Small client island used inside the server-rendered GuardianReport.
 * Expand/collapse for detailed Guardian notes.
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuardianNotesToggleProps {
  notes: string;
}

export function GuardianNotesToggle({ notes }: GuardianNotesToggleProps) {
  const [open, setOpen] = useState(false);

  if (!notes || notes.trim().length === 0) return null;

  return (
    <div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="h-auto px-2 py-1 text-[10px] uppercase tracking-wider text-white/40 hover:text-white/80"
      >
        {open ? (
          <>
            <ChevronUp className="h-3 w-3" /> Hide detailed notes
          </>
        ) : (
          <>
            <ChevronDown className="h-3 w-3" /> Show detailed notes
          </>
        )}
      </Button>
      {open && (
        <p className="mt-2 text-xs text-white/50 leading-relaxed whitespace-pre-wrap">
          {notes}
        </p>
      )}
    </div>
  );
}

export default GuardianNotesToggle;
