'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-lg font-display font-semibold text-white mb-2">Something went wrong</h2>
        <p className="text-sm text-white/50 mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl bg-[#00bcd4]/10 border border-[#00bcd4]/20 text-[#00bcd4] text-sm font-medium hover:bg-[#00bcd4]/20 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
