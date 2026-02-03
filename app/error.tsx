'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service (e.g., Sentry)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping bg-red-500/20 rounded-full" />
            <div className="relative bg-red-500/10 p-6 rounded-full border border-red-500/30">
              <AlertTriangle className="w-16 h-16 text-red-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Something Went Wrong
        </h1>

        <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
          The Guardian spirits encountered an unexpected disturbance. Don't worry, they're working to restore balance.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 p-6 bg-slate-900/50 border border-slate-800 rounded-lg text-left">
            <p className="text-xs text-slate-500 font-mono mb-2">Error Details:</p>
            <p className="text-sm text-red-400 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-slate-600 font-mono mt-3">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-300 border border-slate-700"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-slate-500 text-sm">
          <p className="mb-2">If the problem persists, try:</p>
          <ul className="space-y-1">
            <li>Refreshing your browser</li>
            <li>Clearing your cache and cookies</li>
            <li>Checking your internet connection</li>
            <li>Contacting support if the issue continues</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
