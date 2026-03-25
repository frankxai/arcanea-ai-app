'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Journal error:', error); }, [error]);
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h2 className="text-xl font-semibold text-white/80 mb-2">Something went wrong</h2>
      <p className="text-sm text-white/40 mb-6 max-w-md text-center">
        Could not load your journey.{' '}
        {error.digest && <span className="font-mono text-xs text-white/20">({error.digest})</span>}
      </p>
      <button onClick={reset} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-atlantean-teal-aqua/10 border border-atlantean-teal-aqua/30 text-atlantean-teal-aqua hover:bg-atlantean-teal-aqua/20 transition-colors">
        Try again
      </button>
    </div>
  );
}
