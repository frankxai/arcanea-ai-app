'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GearSix } from '@/lib/phosphor-icons';
import {
  clearStoredKeys,
  getStoredKeys,
  setStoredKeys,
  verifyElevenKey,
  verifyGroqKey,
} from './browser-voice';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SettingsPanelProps {
  onKeysChanged?: () => void;
}

type VerifyState = 'idle' | 'loading' | 'ok' | 'err';

// ---------------------------------------------------------------------------
// Drawer slide animation
// ---------------------------------------------------------------------------

const DRAWER = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { duration: 0.35, ease: [0.22, 0.65, 0.25, 1] as [number, number, number, number] },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SettingsPanel({ onKeysChanged }: SettingsPanelProps) {
  const [open, setOpen] = useState(false);
  const [groqVal, setGroqVal] = useState('');
  const [elevenVal, setElevenVal] = useState('');
  const [groqState, setGroqState] = useState<VerifyState>('idle');
  const [elevenState, setElevenState] = useState<VerifyState>('idle');
  const [hasKeys, setHasKeys] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Seed inputs from storage when drawer opens
  useEffect(() => {
    if (!open) return;
    const k = getStoredKeys();
    setGroqVal(k.groq ?? '');
    setElevenVal(k.eleven ?? '');
    setGroqState('idle');
    setElevenState('idle');
  }, [open]);

  // Track whether any key is stored (for dot indicator)
  useEffect(() => {
    const k = getStoredKeys();
    setHasKeys(Boolean(k.groq || k.eleven));
  }, []);

  const refreshHasKeys = () => {
    const k = getStoredKeys();
    setHasKeys(Boolean(k.groq || k.eleven));
  };

  const handleVerifyGroq = async () => {
    if (!groqVal.trim()) return;
    setGroqState('loading');
    const result = await verifyGroqKey(groqVal.trim());
    setGroqState(result.ok ? 'ok' : 'err');
  };

  const handleVerifyEleven = async () => {
    if (!elevenVal.trim()) return;
    setElevenState('loading');
    const result = await verifyElevenKey(elevenVal.trim());
    setElevenState(result.ok ? 'ok' : 'err');
  };

  const handleSave = () => {
    setStoredKeys({ groq: groqVal.trim() || undefined, eleven: elevenVal.trim() || undefined });
    refreshHasKeys();
    onKeysChanged?.();
    setOpen(false);
  };

  const handleClear = () => {
    clearStoredKeys();
    setGroqVal('');
    setElevenVal('');
    setGroqState('idle');
    setElevenState('idle');
    refreshHasKeys();
    onKeysChanged?.();
  };

  return (
    <>
      {/* Gear trigger */}
      <button
        data-ignore-click
        type="button"
        aria-label="Open API key settings"
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="absolute top-6 right-6 flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm text-white/40 hover:text-white/80 hover:bg-white/[0.08] transition-colors"
        style={{ cursor: 'pointer' }}
      >
        <GearSix size={16} weight="regular" />
        {/* Status dot */}
        <span
          aria-hidden
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#050507]"
          style={{ backgroundColor: hasKeys ? '#00bcd4' : 'rgba(255,255,255,0.15)' }}
        />
      </button>

      {/* Drawer + backdrop */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="settings-backdrop"
              data-ignore-click
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            />

            {/* Drawer */}
            <motion.div
              key="settings-drawer"
              ref={drawerRef}
              data-ignore-click
              {...DRAWER}
              className="fixed inset-y-0 right-0 z-50 flex flex-col bg-[#09090b]/90 border-l border-white/[0.06] backdrop-blur-xl"
              style={{ width: 'min(420px, 100vw)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
                <h2
                  className="text-[11px] tracking-[0.28em] uppercase text-white/80"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Your Keys
                </h2>
                <button
                  type="button"
                  aria-label="Close settings"
                  onClick={() => setOpen(false)}
                  className="text-white/30 hover:text-white/60 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Groq */}
                <KeyField
                  label="Groq API Key"
                  placeholder="gsk_..."
                  value={groqVal}
                  onChange={(v) => { setGroqVal(v); setGroqState('idle'); }}
                  verifyState={groqState}
                  onVerify={handleVerifyGroq}
                  linkHref="https://console.groq.com/keys"
                  linkLabel="Get a free Groq key"
                />

                {/* ElevenLabs */}
                <KeyField
                  label="ElevenLabs API Key"
                  placeholder="sk_..."
                  value={elevenVal}
                  onChange={(v) => { setElevenVal(v); setElevenState('idle'); }}
                  verifyState={elevenState}
                  onVerify={handleVerifyEleven}
                  linkHref="https://elevenlabs.io/app/speech-synthesis"
                  linkLabel="Get ElevenLabs key"
                />

                {/* Notice */}
                <p className="text-[10px] text-white/25 leading-relaxed">
                  Keys stay in your browser. Never sent to Arcanea.
                </p>
              </div>

              {/* Footer actions */}
              <div className="px-6 py-5 border-t border-white/[0.06] flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-2 rounded-lg text-[11px] tracking-[0.14em] uppercase font-medium transition-colors"
                  style={{
                    background: 'rgba(0,188,212,0.15)',
                    color: '#7feaff',
                    border: '1px solid rgba(0,188,212,0.3)',
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 rounded-lg text-[11px] tracking-[0.14em] uppercase text-white/30 hover:text-white/60 border border-white/[0.06] transition-colors"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// KeyField sub-component
// ---------------------------------------------------------------------------

interface KeyFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  verifyState: VerifyState;
  onVerify: () => void;
  linkHref: string;
  linkLabel: string;
}

function KeyField({
  label,
  placeholder,
  value,
  onChange,
  verifyState,
  onVerify,
  linkHref,
  linkLabel,
}: KeyFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] tracking-[0.18em] uppercase text-white/50">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 px-3 py-2 rounded-lg text-[12px] text-white/80 bg-white/[0.03] border border-white/[0.06] placeholder-white/20 focus:outline-none focus:border-[#00bcd4]/40 transition-colors"
          style={{ fontFamily: 'var(--font-mono, JetBrains Mono, monospace)' }}
        />
        <VerifyButton state={verifyState} onClick={onVerify} disabled={!value.trim()} />
      </div>
      <a
        href={linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-[10px] text-[#00bcd4]/60 hover:text-[#00bcd4] transition-colors"
      >
        {linkLabel} →
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Verify button with state indicator
// ---------------------------------------------------------------------------

interface VerifyButtonProps {
  state: VerifyState;
  onClick: () => void;
  disabled: boolean;
}

function VerifyButton({ state, onClick, disabled }: VerifyButtonProps) {
  const icon =
    state === 'loading' ? (
      <span className="inline-block w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
    ) : state === 'ok' ? (
      <span className="text-emerald-400">✓</span>
    ) : state === 'err' ? (
      <span className="text-rose-400">✗</span>
    ) : (
      <span>Check</span>
    );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || state === 'loading'}
      className="px-3 py-2 rounded-lg text-[11px] border border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white/80 hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      aria-label="Verify key"
    >
      {icon}
    </button>
  );
}
