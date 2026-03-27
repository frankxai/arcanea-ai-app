'use client';

import { useState } from 'react';
import {
  Shield, CheckCircle, PencilSimple, Sparkle,
} from '@/lib/phosphor-icons';
import type { ForgeCovenant, CovenantSplit } from '@/lib/types/commerce';
import type { TeamRole } from '@/lib/types/challenge';

const ROLE_LABELS: Record<TeamRole, string> = {
  creator: 'Creator',
  architect: 'Architect',
  artificer: 'Artificer',
  songweaver: 'Songweaver',
  lorekeeper: 'Lorekeeper',
  spellbinder: 'Spellbinder',
  guardian: 'Guardian',
  monk: 'Monk',
};

interface ForgeCovenantEditorProps {
  splits: CovenantSplit[];
  onChange: (splits: CovenantSplit[]) => void;
  onSign?: () => Promise<void>;
  readonly?: boolean;
}

export function ForgeCovenantEditor({
  splits,
  onChange,
  onSign,
  readonly = false,
}: ForgeCovenantEditorProps) {
  const [signing, setSigning] = useState(false);
  const total = splits.reduce((sum, s) => sum + s.percentage, 0);
  const isValid = total === 100;

  function updatePercentage(index: number, value: number) {
    if (readonly) return;
    const newSplits = [...splits];
    newSplits[index] = { ...newSplits[index], percentage: Math.max(0, Math.min(100, value)) };
    onChange(newSplits);
  }

  async function handleSign() {
    if (!onSign || signing || !isValid) return;
    setSigning(true);
    try {
      await onSign();
    } finally {
      setSigning(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Shield className="h-7 w-7 text-amber-400" weight="duotone" />
        <div>
          <h3 className="font-cinzel text-lg text-white">Covenant of the Forge</h3>
          <p className="text-sm text-white/40">Define how the bounty is split among the team.</p>
        </div>
      </div>

      {/* Split editor */}
      <div className="mt-6 space-y-3">
        {splits.map((split, i) => (
          <div key={split.memberId} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm text-white/60">
                <span className="text-white">{ROLE_LABELS[split.role] || split.role}</span>
              </p>
            </div>

            {/* Visual bar */}
            <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-amber-500/60 transition-all"
                style={{ width: `${split.percentage}%` }}
              />
            </div>

            {/* Input */}
            {readonly ? (
              <span className="w-12 text-right font-cinzel text-sm text-amber-200">
                {split.percentage}%
              </span>
            ) : (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={split.percentage}
                  onChange={(e) => updatePercentage(i, parseInt(e.target.value) || 0)}
                  min={0}
                  max={100}
                  className="w-14 rounded border border-white/10 bg-white/5 px-2 py-1 text-right text-sm text-white focus:border-amber-500/40 focus:outline-none"
                />
                <span className="text-xs text-white/30">%</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Total indicator */}
      <div className={`mt-4 flex items-center justify-between rounded-lg px-3 py-2 ${
        isValid ? 'bg-emerald-900/20' : 'bg-red-900/20'
      }`}>
        <span className="text-xs text-white/40">Total</span>
        <span className={`font-cinzel text-sm font-bold ${
          isValid ? 'text-emerald-300' : 'text-red-300'
        }`}>
          {total}%{!isValid && ' (must equal 100%)'}
        </span>
      </div>

      {/* Sign button */}
      {onSign && !readonly && (
        <button
          onClick={handleSign}
          disabled={!isValid || signing}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 font-cinzel text-sm font-medium text-white transition-all hover:from-amber-500 hover:to-orange-500 disabled:opacity-40"
        >
          <PencilSimple className="h-5 w-5" />
          {signing ? 'Signing...' : 'Sign the Covenant'}
        </button>
      )}
    </div>
  );
}

/** Read-only covenant display card */
export function CovenantCard({ covenant }: { covenant: ForgeCovenant }) {
  const statusColors: Record<string, string> = {
    draft: '#60a5fa',
    signed: '#f59e0b',
    active: '#34d399',
    completed: '#10b981',
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-400" weight="duotone" />
          <span className="font-cinzel text-sm text-white">Forge Covenant</span>
        </div>
        <span
          className="text-xs capitalize"
          style={{ color: statusColors[covenant.status] || '#6b7280' }}
        >
          {covenant.status}
        </span>
      </div>

      {covenant.totalEarnings > 0 && (
        <div className="mt-2 flex items-center gap-1">
          <Sparkle className="h-4 w-4 text-amber-400" weight="fill" />
          <span className="font-cinzel text-lg text-amber-200">
            {covenant.totalEarnings.toLocaleString()} Mana
          </span>
          <span className="text-xs text-white/30">distributed</span>
        </div>
      )}

      <div className="mt-3 space-y-1">
        {covenant.splits.map((split) => (
          <div key={split.memberId} className="flex items-center justify-between text-xs">
            <span className="text-white/40">{ROLE_LABELS[split.role] || split.role}</span>
            <span className="text-white/60">{split.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
