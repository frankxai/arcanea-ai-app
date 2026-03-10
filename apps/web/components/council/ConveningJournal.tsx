"use client";

import { useState } from "react";
import { m } from "framer-motion";

interface ConveningJournalProps {
  value: string;
  onChange: (value: string) => void;
  onSave: (value: string) => Promise<void> | void;
  placeholder?: string;
  color?: string;
}

export function ConveningJournal({
  value,
  onChange,
  onSave,
  placeholder = "What surfaced? What surprised you? What will you do differently?",
  color = "#00bcd4",
}: ConveningJournalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!value.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await onSave(value);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block font-mono text-xs text-white/40 uppercase tracking-widest">
        Session Journal
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 font-body text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[#00bcd4]/30 focus:bg-white/[0.04] transition-all resize-none leading-relaxed"
        style={{ caretColor: color }}
      />

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-white/20">
          {value.length} chars
        </span>

        <button
          onClick={handleSave}
          disabled={!value.trim() || isSaving}
          className="flex items-center gap-2 px-5 py-2 rounded-xl font-display text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-30 disabled:pointer-events-none"
          style={{
            background: saved
              ? "linear-gradient(135deg, #10b981, #059669)"
              : `linear-gradient(135deg, ${color}cc, ${color}60)`,
            color: "#09090b",
          }}
        >
          {isSaving ? (
            <>
              <span
                className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"
                aria-hidden
              />
              Saving...
            </>
          ) : saved ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M2.5 7L5.5 10L11.5 4"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Saved
            </>
          ) : (
            "Save Entry"
          )}
        </button>
      </div>

      {saved && (
        <m.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="font-body text-xs text-[#10b981] text-center"
        >
          Entry saved to your session journal.
        </m.p>
      )}
    </div>
  );
}
