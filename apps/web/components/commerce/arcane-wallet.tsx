'use client';

import { useState, useEffect } from 'react';
import {
  Diamond, ArrowsClockwise, TrendUp, Lightning, Star,
  Sun, Sparkle,
} from '@/lib/phosphor-icons';
import type { ArcaneWallet } from '@/lib/types/commerce';

interface ArcaneWalletCardProps {
  wallet: ArcaneWallet | null;
  onClaimDaily?: () => Promise<{ mana: number; streak: number }>;
}

export function ArcaneWalletCard({ wallet, onClaimDaily }: ArcaneWalletCardProps) {
  const [claiming, setClaiming] = useState(false);
  const [claimResult, setClaimResult] = useState<{ mana: number; streak: number } | null>(null);

  const canClaim = wallet && (!wallet.lastDailyClaimAt || !isToday(wallet.lastDailyClaimAt));

  async function handleClaim() {
    if (!onClaimDaily || claiming) return;
    setClaiming(true);
    try {
      const result = await onClaimDaily();
      setClaimResult(result);
    } catch {
      // Silently handle — likely already claimed
    } finally {
      setClaiming(false);
    }
  }

  if (!wallet) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Diamond className="h-8 w-8 text-amber-400/50" weight="duotone" />
          <div>
            <h3 className="font-cinzel text-lg text-white/60">Arcane Diamond</h3>
            <p className="text-sm text-white/40">Sign in to open your vault</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/40 via-black/60 to-purple-950/30 p-6 backdrop-blur-xl">
      {/* Ambient glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
            <Diamond className="h-7 w-7 text-amber-400" weight="duotone" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg text-amber-100">Arcane Diamond</h3>
            <p className="text-xs text-amber-200/40 capitalize">{wallet.tier} tier</p>
          </div>
        </div>

        {/* Streak badge */}
        {wallet.streak > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1">
            <Lightning className="h-4 w-4 text-orange-400" weight="fill" />
            <span className="text-xs font-medium text-orange-300">{wallet.streak} day streak</span>
          </div>
        )}
      </div>

      {/* Balance */}
      <div className="relative mt-6">
        <p className="text-xs uppercase tracking-wider text-amber-300/50">Mana Reserve</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-cinzel text-4xl font-bold text-amber-100">
            {wallet.manaBalance.toLocaleString()}
          </span>
          <Sparkle className="h-5 w-5 text-amber-400" weight="fill" />
        </div>

        {wallet.lockedMana > 0 && (
          <p className="mt-1 text-xs text-amber-200/40">
            {wallet.lockedMana.toLocaleString()} sealed in covenants
          </p>
        )}
      </div>

      {/* Stats row */}
      <div className="relative mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-white/5 p-3">
          <div className="flex items-center gap-1.5">
            <TrendUp className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-white/40">Lifetime Earned</span>
          </div>
          <p className="mt-1 font-cinzel text-lg text-emerald-300">
            {wallet.lifetimeEarned.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <div className="flex items-center gap-1.5">
            <ArrowsClockwise className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-white/40">Lifetime Burned</span>
          </div>
          <p className="mt-1 font-cinzel text-lg text-purple-300">
            {wallet.lifetimeBurned.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Daily Well claim */}
      {canClaim && (
        <button
          onClick={handleClaim}
          disabled={claiming}
          className="relative mt-6 w-full overflow-hidden rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 px-4 py-3 font-cinzel text-sm font-medium text-cyan-200 transition-all hover:border-cyan-400/50 hover:from-cyan-800/40 hover:to-blue-800/40 disabled:opacity-50"
        >
          <div className="flex items-center justify-center gap-2">
            <Sun className="h-5 w-5 text-cyan-300" weight="duotone" />
            {claiming ? 'Drawing from The Well...' : 'Draw from The Well'}
          </div>
        </button>
      )}

      {/* Claim result */}
      {claimResult && (
        <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-3 text-center">
          <p className="text-sm text-cyan-200">
            The Well flows with <span className="font-bold">{claimResult.mana} Mana</span>
          </p>
          <p className="mt-1 text-xs text-cyan-300/60">
            Day {claimResult.streak} streak
          </p>
        </div>
      )}
    </div>
  );
}

function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  return (
    date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth() === now.getUTCMonth() &&
    date.getUTCDate() === now.getUTCDate()
  );
}
