'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { CreditBalance as CreditBalanceData } from '@/lib/types/credits';

// ─── Credit Balance Indicator ────────────────────────────────────────────────
// Compact display for the chat header/toolbar.
// Shows remaining credits with Arcanean styling.
// Hover: breakdown tooltip. Click: navigate to /pricing.

interface CreditBalanceProps {
  className?: string;
}

export function CreditBalance({ className }: CreditBalanceProps) {
  const [balance, setBalance] = useState<CreditBalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await fetch('/api/credits/balance');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBalance(data.balance);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    // Refresh every 60s to keep balance current
    const interval = setInterval(fetchBalance, 60_000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  if (loading) {
    return <Skeleton variant="rect" className="h-8 w-20 rounded-full" />;
  }

  if (error || !balance) {
    return null; // Silently hide on error — non-critical UI element
  }

  const isForge = balance.isForge;
  const total = balance.purchased + balance.daily;
  const isLow = !isForge && total < 3;

  return (
    <Link
      href="/pricing"
      className={cn(
        'group relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5',
        'text-sm font-medium transition-all duration-200',
        'border border-cosmic-border hover:border-[rgba(127,255,212,0.3)]',
        'liquid-glass hover:bg-[rgba(127,255,212,0.06)]',
        isForge && 'border-[rgba(255,215,0,0.25)] shadow-[0_0_8px_rgba(255,215,0,0.1)]',
        isLow && 'animate-pulse',
        className
      )}
    >
      {/* Credit icon */}
      <span
        className={cn(
          'text-base leading-none',
          isForge ? 'text-[#ffd700] drop-shadow-[0_0_4px_rgba(255,215,0,0.4)]' : 'text-[#7fffd4]'
        )}
      >
        {'\u2726'}
      </span>

      {/* Count */}
      <span className={cn('text-text-primary', isForge && 'text-[#ffd700]')}>
        {isForge ? '\u221E' : total}
      </span>

      {/* Tooltip — hidden on mobile */}
      <div
        className={cn(
          'pointer-events-none absolute top-full right-0 z-50 mt-2',
          'hidden md:block',
          'w-48 rounded-lg border border-cosmic-border p-3',
          'liquid-glass text-xs text-text-secondary',
          'opacity-0 transition-opacity duration-150 group-hover:opacity-100'
        )}
      >
        {isForge ? (
          <p className="text-[#ffd700] font-medium">Forge — Unlimited creations</p>
        ) : (
          <div className="space-y-1">
            <p>Purchased: <span className="text-text-primary">{balance.purchased}</span></p>
            <p>Daily free: <span className="text-text-primary">{balance.daily}/{balance.dailyMax}</span></p>
            <p className="pt-1 text-[#7fffd4] font-medium">Click to get more</p>
          </div>
        )}
      </div>
    </Link>
  );
}
