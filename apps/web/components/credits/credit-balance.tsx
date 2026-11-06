/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { CreditBalance as CreditBalanceData } from "@/lib/types/credits";

// ─── Credit Balance Indicator ────────────────────────────────────────────────
// Compact display for the chat header/toolbar.
// Reads from the governed /api/billing/balance ledger endpoint.

interface CreditBalanceProps {
  className?: string;
}

interface GovernedBalanceSnapshot {
  credits: number;
  planName: string;
  planId: string;
}

export function CreditBalance({ className }: CreditBalanceProps) {
  const [snapshot, setSnapshot] = useState<GovernedBalanceSnapshot | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await fetch("/api/billing/balance");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (data?.account && typeof data.account.balance === "number") {
        setSnapshot({
          credits: data.account.balance,
          planId: data.account.plan || "spark",
          planName: data.plan?.name || data.account.plan || "Spark",
        });
      } else if (data?.balance && typeof data.balance.purchased === "number") {
        const legacy = data.balance as CreditBalanceData;
        setSnapshot({
          credits: legacy.purchased + (legacy.daily || 0),
          planId: "spark",
          planName: "Spark",
        });
      } else {
        throw new Error("Unexpected balance payload");
      }
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

  if (error || !snapshot) {
    return null; // Silently hide on error — non-critical UI element
  }

  const total = snapshot.credits;
  const isPaidPlan =
    snapshot.planId === "creator" || snapshot.planId === "studio";
  const isLow = total < 10;

  return (
    <Link
      href="/settings/billing"
      className={cn(
        "group relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
        "text-sm font-medium transition-all duration-200",
        "border border-cosmic-border hover:border-[var(--arc-brand-atlantean-teal)]/40",
        "liquid-glass hover:bg-[var(--arc-cosmic-surface)]",
        isPaidPlan && "border-[var(--arc-brand-arcanean-gold)]/30",
        isLow && "animate-pulse",
        className,
      )}
    >
      {/* Credit icon */}
      <span
        className={cn(
          "text-base leading-none",
          isPaidPlan
            ? "text-[var(--arc-brand-arcanean-gold)]"
            : "text-[var(--arc-brand-atlantean-teal)]",
        )}
      >
        {"\u2726"}
      </span>

      {/* Count */}
      <span className="text-text-primary font-mono">
        {total.toLocaleString("en-US")}
      </span>

      {/* Tooltip — hidden on mobile */}
      <div
        className={cn(
          "pointer-events-none absolute top-full right-0 z-50 mt-2",
          "hidden md:block",
          "w-56 rounded-lg border border-cosmic-border p-3",
          "liquid-glass text-xs text-text-secondary",
          "opacity-0 transition-opacity duration-150 group-hover:opacity-100",
        )}
      >
        <div className="space-y-1">
          <p>
            Plan:{" "}
            <span className="text-text-primary font-medium capitalize">
              {snapshot.planName}
            </span>
          </p>
          <p>
            Managed credits:{" "}
            <span className="text-text-primary font-mono">
              {total.toLocaleString("en-US")}
            </span>
          </p>
          <p className="text-[11px] text-text-muted">
            BYOK chat & worlds cost 0 credits
          </p>
          <p className="pt-1 text-[var(--arc-brand-atlantean-teal)] font-medium">
            Manage billing & credits
          </p>
        </div>
      </div>
    </Link>
  );
}
