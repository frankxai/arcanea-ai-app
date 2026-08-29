'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface BookPurchaseButtonProps {
  configured: boolean;
  className?: string;
  label?: string;
}

export function BookPurchaseButton({
  configured,
  className = '',
  label = 'Get the complete edition — €17',
}: BookPurchaseButtonProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function beginCheckout() {
    if (!configured || loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/books/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 401) {
        window.location.assign(`/auth/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      const payload = await response.json() as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        setError(payload.error ?? 'Checkout is temporarily unavailable.');
        return;
      }

      window.location.assign(payload.url);
    } catch {
      setError('Checkout is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={beginCheckout}
        disabled={!configured || loading}
        className={`${className} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {loading ? 'Opening secure checkout…' : configured ? label : 'Founding edition opens soon'}
      </button>
      {error ? <p className="text-sm text-rose-200/80" role="alert">{error}</p> : null}
    </div>
  );
}
