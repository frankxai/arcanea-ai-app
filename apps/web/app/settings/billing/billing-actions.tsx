"use client";

import { useState } from "react";
import Link from "next/link";
import { formatEuro } from "@/lib/billing/catalog";

interface PackOption {
  id: string;
  credits: number;
  priceCents: number;
}

export function BillingActions({
  live,
  hasSubscription,
  packs,
}: {
  live: boolean;
  hasSubscription: boolean;
  packs: PackOption[];
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const post = async (path: string, body?: unknown, key = path) => {
    setBusy(key);
    setError(null);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        setError(data.error ?? "That did not work. Try again in a moment.");
        setBusy(null);
        return;
      }
      window.location.assign(data.url);
    } catch {
      setError("Network error. Try again in a moment.");
      setBusy(null);
    }
  };

  if (!live) {
    return (
      <section className="rounded-2xl border border-dashed border-[var(--arc-cosmic-border-bright)] p-5 text-xs text-[var(--arc-text-secondary)]">
        Checkout is not open yet. Plans and credit packs are described on the{" "}
        <Link
          href="/pricing"
          className="underline underline-offset-2 hover:text-[var(--arc-text-primary)]"
        >
          pricing page
        </Link>
        , and the Founding Circle list there gets first access.
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {hasSubscription ? (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => post("/api/billing/portal")}
            className="px-4 py-2.5 rounded-xl border border-[var(--arc-cosmic-border-bright)] text-xs font-semibold text-[var(--arc-text-primary)] hover:bg-[var(--arc-cosmic-surface)] disabled:opacity-50"
          >
            {busy === "/api/billing/portal"
              ? "Opening…"
              : "Manage subscription and invoices"}
          </button>
        ) : (
          <Link
            href="/pricing"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--arc-brand-arcanean-gold)] to-[var(--arc-brand-atlantean-teal)] text-[var(--arc-cosmic-void)] text-xs font-semibold"
          >
            Choose a plan
          </Link>
        )}
      </div>

      {packs.length > 0 && (
        <div>
          <p className="text-[10px] font-mono tracking-widest text-[var(--arc-text-secondary)] mb-3">
            Top up credits
          </p>
          <div className="flex flex-wrap gap-3">
            {packs.map((pack) => (
              <button
                key={pack.id}
                type="button"
                disabled={busy !== null}
                onClick={() =>
                  post("/api/billing/checkout", { sku: pack.id }, pack.id)
                }
                className="px-4 py-2.5 rounded-xl border border-[var(--arc-cosmic-border-bright)] text-xs text-[var(--arc-text-primary)] hover:bg-[var(--arc-cosmic-surface)] disabled:opacity-50"
              >
                {busy === pack.id
                  ? "Opening…"
                  : `${pack.credits.toLocaleString("en-US")} credits · ${formatEuro(pack.priceCents)}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-[var(--arc-fire)]">{error}</p>}
    </section>
  );
}
